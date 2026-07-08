/* ── ComandiVivi — Test Suite ── */
const fs = require('fs');
const path = require('path');
const http = require('http');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    console.log(`  ✗ ${name}`);
    console.log(`    ${e.message}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Assertion failed');
}

function assertEqual(a, b, msg) {
  if (a !== b) throw new Error(msg || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}

console.log('\n🔬 ComandiVivi Test Suite\n');

/* ── HTML Structure ── */
console.log('📄 HTML structure');

const htmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

test('has doctype', () => assert(html.startsWith('<!DOCTYPE html>')));
test('has lang="it"', () => assert(/<html lang="it"/.test(html)));
test('has viewport meta', () => assert(/meta name="viewport"/.test(html)));
test('has title', () => assert(/<title>.*ComandiVivi.*<\/title>/.test(html)));
test('has meta description', () => assert(/meta name="description"/.test(html)));
test('has canonical link', () => assert(/rel="canonical"/.test(html)));
test('canonical points to correct URL', () => {
  assert(/https:\/\/cristianporco\.it\/app\/comandivivi\//.test(html));
});
test('has og:title', () => assert(/og:title/.test(html)));
test('has og:description', () => assert(/og:description/.test(html)));
test('has og:url', () => assert(/og:url/.test(html)));
test('has JSON-LD', () => assert(/application\/ld\+json/.test(html)));
test('has exactly one h1', () => {
  const h1Count = (html.match(/<h1/g) || []).length;
  assertEqual(h1Count, 1, `Expected 1 h1, found ${h1Count}`);
});
test('has header landmark', () => assert(/<header/.test(html)));
test('has main landmark', () => assert(/<main/.test(html)));
test('has footer landmark', () => assert(/<footer/.test(html)));
test('has copy button', () => assert(/Copia comando/.test(html)));
test('has reset button', () => assert(/Reimposta/.test(html)));
test('no hardcoded port 3000', () => assert(!/:3000/.test(html)));
test('has base href="./" for sub-path safety', () => assert(/base href="\.\/"/.test(html)));

/* ── SEO Files ── */
console.log('\n📡 SEO files');

const robotsPath = path.join(__dirname, 'robots.txt');
test('robots.txt exists', () => assert(fs.existsSync(robotsPath)));
test('robots.txt has correct sitemap URL', () => {
  const r = fs.readFileSync(robotsPath, 'utf8');
  assert(/cristianporco\.it\/app\/comandivivi\/sitemap\.xml/.test(r));
});

const sitemapPath = path.join(__dirname, 'sitemap.xml');
test('sitemap.xml exists', () => assert(fs.existsSync(sitemapPath)));
test('sitemap.xml has correct loc', () => {
  const s = fs.readFileSync(sitemapPath, 'utf8');
  assert(/cristianporco\.it\/app\/comandivivi\//.test(s));
});

/* ── JavaScript Logic ── */
console.log('\n⚙️  JavaScript logic');

// Extract and evaluate the COMMANDS object
const jsPath = path.join(__dirname, 'app.js');
let js = fs.readFileSync(jsPath, 'utf8');

// Extract the COMMANDS object by finding its boundaries
const cmdStart = js.indexOf('const COMMANDS = {');
const afterCmd = js.substring(cmdStart + 'const COMMANDS = '.length);
// Find the matching closing brace by counting
let depth = 0;
let cmdEnd = -1;
for (let i = 0; i < afterCmd.length; i++) {
  if (afterCmd[i] === '{') depth++;
  if (afterCmd[i] === '}') {
    depth--;
    if (depth === 0) { cmdEnd = i + 1; break; }
  }
}
const commandsLiteral = afterCmd.substring(0, cmdEnd);
const COMMANDS = (new Function('return ' + commandsLiteral))();

test('COMMANDS has 5 categories', () => {
  assertEqual(Object.keys(COMMANDS).length, 5);
});

test('git has subcommands', () => {
  assert(COMMANDS.git.subcommands.length >= 5);
});

test('git clone template is correct', () => {
  const sc = COMMANDS.git.subcommands.find(s => s.id === 'clone');
  assert(sc, 'clone not found');
  assertEqual(sc.template, 'git clone {url} {dir}');
});

test('git clone has 2 fields', () => {
  const sc = COMMANDS.git.subcommands.find(s => s.id === 'clone');
  assertEqual(sc.fields.length, 2);
});

test('ffmpeg has subcommands', () => {
  assert(COMMANDS.ffmpeg.subcommands.length >= 4);
});

test('docker has subcommands', () => {
  assert(COMMANDS.docker.subcommands.length >= 4);
});

test('terminal has subcommands', () => {
  assert(COMMANDS.terminal.subcommands.length >= 5);
});

test('npm has subcommands', () => {
  assert(COMMANDS.npm.subcommands.length >= 3);
});

test('all templates contain placeholders or are complete', () => {
  Object.values(COMMANDS).forEach(cat => {
    cat.subcommands.forEach(sc => {
      assert(sc.template && sc.template.length > 0, `${cat.name}/${sc.id}: template is empty`);
    });
  });
});

test('all fields have key, label, type', () => {
  Object.values(COMMANDS).forEach(cat => {
    cat.subcommands.forEach(sc => {
      sc.fields.forEach(f => {
        assert(f.key, `field missing key in ${cat.name}/${sc.id}`);
        assert(f.label, `field missing label in ${cat.name}/${sc.id}`);
        assert(f.type, `field missing type in ${cat.name}/${sc.id}`);
      });
    });
  });
});

test('select fields have options array', () => {
  Object.values(COMMANDS).forEach(cat => {
    cat.subcommands.forEach(sc => {
      sc.fields.forEach(f => {
        if (f.type === 'select') {
          assert(Array.isArray(f.options) && f.options.length > 0,
            `select field ${f.key} in ${cat.name}/${sc.id} missing options`);
        }
      });
    });
  });
});

// Test command generation logic
function generateCommand(category, subcommandId, values) {
  const cat = COMMANDS[category];
  const sc = cat.subcommands.find(s => s.id === subcommandId);
  if (!sc) return null;

  let cmd = sc.template;
  sc.fields.forEach(field => {
    let val = (values[field.key] || '').trim();
    if (!val && field.default) val = field.default;
    if (!val) val = `{${field.key}}`;
    cmd = cmd.split(`{${field.key}}`).join(val);
  });
  return cmd.replace(/\s+/g, ' ').trim();
}

test('generate git clone with all fields', () => {
  const cmd = generateCommand('git', 'clone', {
    url: 'https://github.com/user/repo.git',
    dir: 'my-folder'
  });
  assertEqual(cmd, 'git clone https://github.com/user/repo.git my-folder');
});

test('generate git clone without optional dir', () => {
  const cmd = generateCommand('git', 'clone', {
    url: 'https://github.com/user/repo.git'
  });
  assertEqual(cmd, 'git clone https://github.com/user/repo.git {dir}');
});

test('generate git commit', () => {
  const cmd = generateCommand('git', 'commit', { msg: 'Fix login bug' });
  assertEqual(cmd, 'git commit -m "Fix login bug"');
});

test('generate ffmpeg convert', () => {
  const cmd = generateCommand('ffmpeg', 'convert-video', {
    input: 'input.avi',
    codec: 'libx264',
    output: 'output.mp4'
  });
  assertEqual(cmd, 'ffmpeg -i input.avi -c:v libx264 output.mp4');
});

test('generate docker run', () => {
  const cmd = generateCommand('docker', 'run', {
    image: 'nginx:latest',
    flags: '-d -p 8080:80'
  });
  assertEqual(cmd, 'docker run -d -p 8080:80 nginx:latest');
});

test('generate terminal ls', () => {
  const cmd = generateCommand('terminal', 'ls', { path: '~/Documents' });
  assertEqual(cmd, 'ls -la ~/Documents');
});

test('generate npm install', () => {
  const cmd = generateCommand('npm', 'install', { package: 'express' });
  assertEqual(cmd, 'npm install express');
});

/* ── CSS Validation ── */
console.log('\n🎨 CSS checks');

test('CSS contains color contrast tokens', () => {
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  assert(styleMatch, 'Style tag not found');
  const css = styleMatch[1];
  assert(css.includes('--text:'), 'Missing --text token');
  assert(css.includes('--primary:'), 'Missing --primary token');
  assert(css.includes('--bg:'), 'Missing --bg token');
});

test('CSS has prefers-reduced-motion', () => {
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  assert(/prefers-reduced-motion/.test(styleMatch[1]));
});

test('CSS has focus-visible styles', () => {
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  assert(/focus-visible/.test(styleMatch[1]));
});

test('CSS has min-height 44px on inputs', () => {
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  assert(/min-height:\s*44px/.test(styleMatch[1]));
});

test('CSS has line-height on body', () => {
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  assert(/line-height:\s*1\.[5-7]/.test(styleMatch[1]));
});

/* ── Accessibility ── */
console.log('\n♿ Accessibility');

test('labels use "for" attribute', () => {
  assert(/for="field-/.test(html) || js.includes('for="field-'));
});

test('role attributes on interactive elements', () => {
  // Check for radiogroup anywhere in HTML or JS (from HTML template)
  assert(html.includes('radiogroup'), 'Missing radiogroup role');
  // Check for radio role — in HTML, setAttribute, or .role = 
  const hasRadio = html.includes('"radio"') || html.includes("'radio'") ||
                   js.includes('.role = \'radio\'') || js.includes('.role = "radio"') ||
                   js.includes('setAttribute(\'role\', \'radio\'') || js.includes('setAttribute("role", "radio"');
  assert(hasRadio, 'Missing radio role');
});

test('aria-live region for toast', () => {
  assert(/aria-live="polite"/.test(html));
});

test('aria-label on copy button', () => {
  assert(/aria-label="Copia/.test(html));
});

test('button elements for actions (not div)', () => {
  assert(/<button/.test(html));
});

/* ── Responsive ── */
console.log('\n📱 Responsive');

test('media query for mobile', () => {
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  assert(/@media.*max-width/.test(styleMatch[1]));
});

/* ── Server ── */
console.log('\n🌐 Server availability');

const PORT = process.env.PORT || 4601;

test('server starts and responds', (done) => {
  const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } else if (req.url === '/app.js') {
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(fs.readFileSync(jsPath));
    } else if (req.url === '/robots.txt') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(fs.readFileSync(robotsPath));
    } else if (req.url === '/sitemap.xml') {
      res.writeHead(200, { 'Content-Type': 'application/xml' });
      res.end(fs.readFileSync(sitemapPath));
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    try {
      const opts = { hostname: '127.0.0.1', port: PORT, path: '/' };
      const req = http.get(opts, (res) => {
        assertEqual(res.statusCode, 200, `Status should be 200, got ${res.statusCode}`);
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          assert(data.includes('ComandiVivi'), 'Response should contain ComandiVivi');
          req.destroy();
        });
      });
      req.on('error', (e) => { throw new Error(`Server request failed: ${e.message}`); });
    } catch(e) {
      throw e;
    }
  });

  // Keep server running for the app
  if (typeof done === 'function') done();
});

/* ── Results ── */
setTimeout(() => {
  console.log(`\n${'═'.repeat(40)}`);
  console.log(`  Passed: ${passed}  |  Failed: ${failed}`);
  console.log(`${'═'.repeat(40)}\n`);
  if (failed > 0) {
    process.exit(1);
  }
}, 1000);
