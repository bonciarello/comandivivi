/* ── ComandiVivi — App Logic ── */

const COMMANDS = {
  git: {
    name: 'Git',
    iconClass: 'git',
    iconEmoji: '',
    tips: 'Assicurati di essere nella cartella del repository prima di eseguire comandi git.',
    subcommands: [
      {
        id: 'clone',
        label: 'Clona repository',
        desc: 'Scarica una copia locale di un repository remoto.',
        template: 'git clone {url} {dir}',
        fields: [
          { key: 'url', label: 'URL del repository', type: 'text', placeholder: 'https://github.com/user/repo.git', hint: '', required: true },
          { key: 'dir', label: 'Cartella destinazione', type: 'text', placeholder: 'mia-cartella', hint: 'Opzionale: lascia vuoto per usare il nome del repo' }
        ],
        tips: 'Incolla l\'URL HTTPS o SSH del repository che vuoi clonare.'
      },
      {
        id: 'commit',
        label: 'Commit modifiche',
        desc: 'Salva le modifiche locali con un messaggio descrittivo.',
        template: 'git commit -m "{msg}"',
        fields: [
          { key: 'msg', label: 'Messaggio del commit', type: 'text', placeholder: 'Aggiunta nuova funzionalità', hint: '', required: true }
        ],
        tips: 'Prima del commit esegui git add per aggiungere i file. Scrivi messaggi chiari e in italiano.'
      },
      {
        id: 'push',
        label: 'Push remoto',
        desc: 'Carica i commit locali sul repository remoto.',
        template: 'git push {remote} {branch}',
        fields: [
          { key: 'remote', label: 'Nome remoto', type: 'select', options: ['origin', 'upstream'], default: 'origin' },
          { key: 'branch', label: 'Nome branch', type: 'text', placeholder: 'main', hint: '', required: true }
        ],
        tips: 'Il nome remoto predefinito è "origin". Il branch principale spesso è "main" o "master".'
      },
      {
        id: 'branch',
        label: 'Crea branch',
        desc: 'Crea un nuovo branch e ci si sposta automaticamente.',
        template: 'git checkout -b {name}',
        fields: [
          { key: 'name', label: 'Nome del nuovo branch', type: 'text', placeholder: 'feature/login', hint: '', required: true }
        ],
        tips: 'Usa nomi descrittivi: feature/nome-funzione, fix/nome-bug, hotfix/nome-urgenza.'
      },
      {
        id: 'merge',
        label: 'Unisci branch',
        desc: 'Incorpora le modifiche di un branch in quello corrente.',
        template: 'git merge {branch}',
        fields: [
          { key: 'branch', label: 'Branch da unire', type: 'text', placeholder: 'feature/login', hint: '', required: true }
        ],
        tips: 'Prima del merge, assicurati di essere sul branch di destinazione (es. git checkout main).'
      },
      {
        id: 'log',
        label: 'Visualizza log',
        desc: 'Mostra la cronologia dei commit in formato compatto.',
        template: 'git log --oneline -n {n}',
        fields: [
          { key: 'n', label: 'Numero di commit', type: 'number', placeholder: '10', hint: '', required: false, default: '10' }
        ],
        tips: 'Premi Q per uscire dalla visualizzazione del log nel terminale.'
      }
    ]
  },
  ffmpeg: {
    name: 'FFmpeg',
    iconClass: 'ffmpeg',
    iconEmoji: '',
    tips: 'FFmpeg deve essere installato sul sistema. Verifica con ffmpeg -version.',
    subcommands: [
      {
        id: 'convert-video',
        label: 'Converti video',
        desc: 'Cambia il codec di un file video (es. da AVI a MP4).',
        template: 'ffmpeg -i {input} -c:v {codec} {output}',
        fields: [
          { key: 'input', label: 'File di input', type: 'text', placeholder: 'video.avi', hint: '', required: true },
          { key: 'codec', label: 'Codec video', type: 'select', options: ['libx264', 'libx265', 'libvpx-vp9', 'mpeg4'], default: 'libx264' },
          { key: 'output', label: 'File di output', type: 'text', placeholder: 'video.mp4', hint: '', required: true }
        ],
        tips: 'libx264 produce file .mp4 compatibili ovunque. libx265 è più efficiente ma meno compatibile.'
      },
      {
        id: 'extract-audio',
        label: 'Estrai audio',
        desc: 'Estrae la traccia audio da un file video.',
        template: 'ffmpeg -i {input} -vn -acodec {codec} {output}',
        fields: [
          { key: 'input', label: 'File video', type: 'text', placeholder: 'video.mp4', hint: '', required: true },
          { key: 'codec', label: 'Codec audio', type: 'select', options: ['libmp3lame', 'aac', 'libvorbis', 'flac'], default: 'libmp3lame' },
          { key: 'output', label: 'File di output', type: 'text', placeholder: 'audio.mp3', hint: '', required: true }
        ],
        tips: 'libmp3lame per MP3, aac per M4A, flac per audio senza perdita di qualità.'
      },
      {
        id: 'resize-video',
        label: 'Ridimensiona video',
        desc: 'Cambia le dimensioni di un video mantenendo le proporzioni.',
        template: 'ffmpeg -i {input} -vf scale={w}:{h} {output}',
        fields: [
          { key: 'input', label: 'File di input', type: 'text', placeholder: 'video.mp4', hint: '', required: true },
          { key: 'w', label: 'Larghezza (px)', type: 'number', placeholder: '1280', hint: '', required: true },
          { key: 'h', label: 'Altezza (px)', type: 'number', placeholder: '720', hint: 'Usa -1 per mantenere le proporzioni', required: true },
          { key: 'output', label: 'File di output', type: 'text', placeholder: 'video-ridotto.mp4', hint: '', required: true }
        ],
        tips: 'Imposta l\'altezza a -1 per calcolarla automaticamente: scale=1280:-1 mantiene le proporzioni.'
      },
      {
        id: 'trim-video',
        label: 'Taglia video',
        desc: 'Estrae un segmento di un video più lungo.',
        template: 'ffmpeg -i {input} -ss {start} -t {duration} {output}',
        fields: [
          { key: 'input', label: 'File di input', type: 'text', placeholder: 'video.mp4', hint: '', required: true },
          { key: 'start', label: 'Inizio (HH:MM:SS)', type: 'text', placeholder: '00:01:30', hint: '', required: true },
          { key: 'duration', label: 'Durata (HH:MM:SS)', type: 'text', placeholder: '00:00:30', hint: '', required: true },
          { key: 'output', label: 'File di output', type: 'text', placeholder: 'ritaglio.mp4', hint: '', required: true }
        ],
        tips: 'Puoi usare anche i secondi: -ss 90 -t 30 taglia 30 secondi a partire dal minuto 1:30.'
      },
      {
        id: 'gif',
        label: 'Crea GIF animata',
        desc: 'Converte un breve video in una GIF animata.',
        template: 'ffmpeg -i {input} -vf "fps={fps},scale={w}:-1" {output}',
        fields: [
          { key: 'input', label: 'File video', type: 'text', placeholder: 'video.mp4', hint: '', required: true },
          { key: 'fps', label: 'FPS della GIF', type: 'number', placeholder: '10', hint: '', required: false, default: '10' },
          { key: 'w', label: 'Larghezza (px)', type: 'number', placeholder: '480', hint: '', required: true },
          { key: 'output', label: 'File di output', type: 'text', placeholder: 'animazione.gif', hint: '', required: true }
        ],
        tips: 'Mantieni FPS basso (8-15) e larghezza ridotta (320-480px) per file GIF leggeri.'
      }
    ]
  },
  docker: {
    name: 'Docker',
    iconClass: 'docker',
    iconEmoji: '',
    tips: 'Docker deve essere in esecuzione. Verifica con docker ps.',
    subcommands: [
      {
        id: 'run',
        label: 'Avvia container',
        desc: 'Esegue un container da un\'immagine Docker.',
        template: 'docker run {flags} {image}',
        fields: [
          { key: 'image', label: 'Immagine Docker', type: 'text', placeholder: 'nginx:latest', hint: '', required: true },
          { key: 'flags', label: 'Opzioni extra', type: 'text', placeholder: '--name mio-nginx -p 8080:80 -d', hint: '-d per detached, -p per porte, --name per il nome' }
        ],
        tips: 'Le opzioni più comuni: -d (background), -p PORTALOCALE:PORTACONTAINER, --name NOME, -v VOLUME.'
      },
      {
        id: 'build',
        label: 'Costruisci immagine',
        desc: 'Crea un\'immagine Docker da un Dockerfile.',
        template: 'docker build -t {name}:{tag} {path}',
        fields: [
          { key: 'name', label: 'Nome immagine', type: 'text', placeholder: 'mia-app', hint: '', required: true },
          { key: 'tag', label: 'Tag', type: 'text', placeholder: 'latest', hint: '', required: false, default: 'latest' },
          { key: 'path', label: 'Percorso Dockerfile', type: 'text', placeholder: '.', hint: 'Usa . per la cartella corrente', required: false, default: '.' }
        ],
        tips: 'Esegui il comando nella cartella che contiene il Dockerfile. Il punto . indica la cartella corrente.'
      },
      {
        id: 'stop',
        label: 'Ferma container',
        desc: 'Arresta un container in esecuzione.',
        template: 'docker stop {container}',
        fields: [
          { key: 'container', label: 'Nome o ID container', type: 'text', placeholder: 'mio-nginx', hint: '', required: true }
        ],
        tips: 'Usa docker ps per vedere i container attivi e trovare nome o ID.'
      },
      {
        id: 'rm',
        label: 'Rimuovi container',
        desc: 'Elimina un container fermo.',
        template: 'docker rm {container}',
        fields: [
          { key: 'container', label: 'Nome o ID container', type: 'text', placeholder: 'mio-nginx', hint: '', required: true }
        ],
        tips: 'Per rimuovere anche il volume associato aggiungi -v: docker rm -v NOME.'
      },
      {
        id: 'compose-up',
        label: 'Docker Compose up',
        desc: 'Avvia tutti i servizi definiti nel file docker-compose.yml.',
        template: 'docker compose up {flags}',
        fields: [
          { key: 'flags', label: 'Opzioni', type: 'select', options: ['-d', '-d --build', '--build'], default: '-d' }
        ],
        tips: '-d avvia in background. --build ricostruisce le immagini prima di avviare.'
      }
    ]
  },
  terminal: {
    name: 'Terminale',
    iconClass: 'terminal',
    iconEmoji: '',
    tips: 'Comandi base per muoversi nel file system da terminale (Linux/macOS).',
    subcommands: [
      {
        id: 'ls',
        label: 'Elenca file',
        desc: 'Mostra il contenuto di una cartella con dettagli.',
        template: 'ls -la {path}',
        fields: [
          { key: 'path', label: 'Percorso', type: 'text', placeholder: '~/Documenti', hint: 'Lascia vuoto per la cartella corrente' }
        ],
        tips: '-l mostra i dettagli, -a include i file nascosti. Puoi combinare i flag: ls -lah.'
      },
      {
        id: 'cp',
        label: 'Copia file',
        desc: 'Copia un file o una cartella in una nuova posizione.',
        template: 'cp -r {source} {dest}',
        fields: [
          { key: 'source', label: 'File sorgente', type: 'text', placeholder: 'documento.txt', hint: '', required: true },
          { key: 'dest', label: 'Destinazione', type: 'text', placeholder: '~/backup/', hint: '', required: true }
        ],
        tips: 'Il flag -r serve per copiare cartelle. Per file singoli puoi ometterlo.'
      },
      {
        id: 'mv',
        label: 'Sposta / Rinomina',
        desc: 'Sposta un file o lo rinomina se la destinazione è nella stessa cartella.',
        template: 'mv {source} {dest}',
        fields: [
          { key: 'source', label: 'File sorgente', type: 'text', placeholder: 'vecchio-nome.txt', hint: '', required: true },
          { key: 'dest', label: 'Destinazione / Nuovo nome', type: 'text', placeholder: 'nuovo-nome.txt', hint: '', required: true }
        ],
        tips: 'Per rinominare, indica la stessa cartella con un nome diverso. Per spostare, indica un\'altra cartella.'
      },
      {
        id: 'mkdir',
        label: 'Crea cartella',
        desc: 'Crea una nuova cartella, comprese le cartelle intermedie.',
        template: 'mkdir -p {path}',
        fields: [
          { key: 'path', label: 'Percorso', type: 'text', placeholder: 'progetto/src/componenti', hint: '', required: true }
        ],
        tips: 'Il flag -p crea automaticamente tutte le cartelle intermedie mancanti.'
      },
      {
        id: 'chmod',
        label: 'Cambia permessi',
        desc: 'Modifica i permessi di lettura, scrittura ed esecuzione di un file.',
        template: 'chmod {mode} {file}',
        fields: [
          { key: 'mode', label: 'Modalità', type: 'select', options: ['755', '644', '777', '600', '700'], default: '755' },
          { key: 'file', label: 'File o cartella', type: 'text', placeholder: 'script.sh', hint: '', required: true }
        ],
        tips: '755 = eseguibile da tutti, scrivibile solo dal proprietario. 644 = leggibile da tutti, scrivibile solo dal proprietario.'
      },
      {
        id: 'find',
        label: 'Cerca file',
        desc: 'Trova file e cartelle in base al nome.',
        template: 'find {path} -name "{pattern}"',
        fields: [
          { key: 'path', label: 'Cartella di ricerca', type: 'text', placeholder: '.', hint: 'Usa . per la cartella corrente', required: false, default: '.' },
          { key: 'pattern', label: 'Nome da cercare', type: 'text', placeholder: '*.jpg', hint: 'Usa * come carattere jolly', required: true }
        ],
        tips: '* corrisponde a qualsiasi carattere. Esempio: *.pdf trova tutti i PDF, foto* trova file che iniziano con foto.'
      },
      {
        id: 'grep',
        label: 'Cerca nel contenuto',
        desc: 'Cerca un testo all\'interno dei file.',
        template: 'grep -r "{pattern}" {path}',
        fields: [
          { key: 'pattern', label: 'Testo da cercare', type: 'text', placeholder: 'TODO', hint: '', required: true },
          { key: 'path', label: 'Cartella', type: 'text', placeholder: '.', hint: 'Usa . per la cartella corrente', required: false, default: '.' }
        ],
        tips: '-r cerca ricorsivamente in tutte le sottocartelle. Aggiungi -i per ignorare maiuscole/minuscole.'
      }
    ]
  },
  npm: {
    name: 'npm',
    iconClass: 'npm',
    iconEmoji: '',
    tips: 'npm è il gestore di pacchetti di Node.js. Verifica l\'installazione con node -v e npm -v.',
    subcommands: [
      {
        id: 'install',
        label: 'Installa pacchetto',
        desc: 'Installa un pacchetto npm nel progetto corrente.',
        template: 'npm install {package}',
        fields: [
          { key: 'package', label: 'Nome pacchetto', type: 'text', placeholder: 'express', hint: '', required: true }
        ],
        tips: 'Aggiungi --save-dev per dipendenze di sviluppo, -g per installazione globale.'
      },
      {
        id: 'run',
        label: 'Esegui script',
        desc: 'Esegue uno script definito nel package.json.',
        template: 'npm run {script}',
        fields: [
          { key: 'script', label: 'Nome script', type: 'text', placeholder: 'dev', hint: '', required: true }
        ],
        tips: 'Script comuni: dev, build, start, test, lint. Controlla package.json per la lista completa.'
      },
      {
        id: 'init',
        label: 'Inizializza progetto',
        desc: 'Crea un nuovo file package.json per il progetto.',
        template: 'npm init -y',
        fields: [],
        tips: 'Il flag -y accetta tutte le impostazioni predefinite. Senza -y potrai compilare ogni campo interattivamente.'
      },
      {
        id: 'build',
        label: 'Build progetto',
        desc: 'Compila il progetto per la produzione.',
        template: 'npm run build',
        fields: [],
        tips: 'Questo comando esegue lo script "build" definito nel package.json.'
      }
    ]
  }
};

/* ── State ── */
let state = {
  category: null,
  subcommandId: null,
  values: {}
};

/* ── DOM Refs ── */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const categoryGrid = $('.category-grid');
const subcommandBar = $('#subcommandBar');
const formPanel = $('#formPanel');
const formIcon = $('#formIcon');
const formTitle = $('#formTitle');
const formDesc = $('#formDesc');
const formFields = $('#formFields');
const previewSection = $('#previewSection');
const previewCommand = $('#previewCommand');
const previewStatus = $('#previewStatus');
const actionsRow = $('#actionsRow');
const copyBtn = $('#copyBtn');
const resetBtn = $('#resetBtn');
const tipsBar = $('#tipsBar');
const tipsText = $('#tipsText');
const toast = $('#toast');
const toastMsg = $('#toastMsg');
const subLabel = $('#sub-label');

/* ── Init ── */
function init() {
  renderCategories();
  copyBtn.addEventListener('click', handleCopy);
  resetBtn.addEventListener('click', handleReset);
}

/* ── Render Categories ── */
function renderCategories() {
  categoryGrid.innerHTML = '';
  Object.entries(COMMANDS).forEach(([key, cat]) => {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.role = 'radio';
    card.setAttribute('aria-checked', state.category === key ? 'true' : 'false');
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="cat-icon ${cat.iconClass}" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${getCatIcon(cat.iconClass)}</svg>
      </div>
      <div>
        <div class="cat-label">${cat.name}</div>
        <div class="cat-count">${cat.subcommands.length} comandi</div>
      </div>
    `;
    card.addEventListener('click', () => selectCategory(key));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectCategory(key); }
    });
    if (state.category === key) card.classList.add('active');
    categoryGrid.appendChild(card);
  });
}

function getCatIcon(cls) {
  const icons = {
    git: '<circle cx="12" cy="12" r="3"/><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><line x1="7.5" y1="7.5" x2="9.5" y2="10"/><line x1="16.5" y1="7.5" x2="14.5" y2="10"/><line x1="7.5" y1="16.5" x2="9.5" y2="14"/><line x1="16.5" y1="16.5" x2="14.5" y2="14"/>',
    ffmpeg: '<polygon points="5 3 19 12 5 21 5 3"/><line x1="9" y1="12" x2="19" y2="12"/>',
    docker: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M6 7h2v2H6zM10 7h2v2h-2zM14 7h2v2h-2zM8 11h2v2H8zM12 11h2v2h-2zM6 15h12v1H6z"/>',
    terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
    npm: '<path d="M2 8h20v8H12v-6H9v6H2z"/>'
  };
  return icons[cls] || '';
}

/* ── Select Category ── */
function selectCategory(key) {
  if (state.category === key) {
    // deselect
    state.category = null;
    state.subcommandId = null;
    state.values = {};
    hideSubsequent();
    renderCategories();
    return;
  }
  state.category = key;
  state.subcommandId = null;
  state.values = {};
  renderCategories();
  renderSubcommands();
  showElement(subLabel);
  showElement(subcommandBar);
  hideElement(formPanel);
  hideElement(previewSection);
  hideElement(actionsRow);
  hideElement(tipsBar);
}

function hideSubsequent() {
  hideElement(subLabel);
  hideElement(subcommandBar);
  hideElement(formPanel);
  hideElement(previewSection);
  hideElement(actionsRow);
  hideElement(tipsBar);
}

/* ── Render Subcommands ── */
function renderSubcommands() {
  const cat = COMMANDS[state.category];
  subcommandBar.innerHTML = '';
  cat.subcommands.forEach((sc) => {
    const chip = document.createElement('button');
    chip.className = 'subcommand-chip';
    chip.type = 'button';
    chip.textContent = sc.label;
    chip.setAttribute('role', 'radio');
    chip.setAttribute('aria-checked', state.subcommandId === sc.id ? 'true' : 'false');
    if (state.subcommandId === sc.id) chip.classList.add('active');
    chip.addEventListener('click', () => selectSubcommand(sc.id));
    subcommandBar.appendChild(chip);
  });
}

/* ── Select Subcommand ── */
function selectSubcommand(id) {
  state.subcommandId = id;
  state.values = {};
  renderSubcommands();
  renderForm();
  updatePreview();
  showElement(formPanel);
  showElement(previewSection);
  showElement(actionsRow);
  showElement(tipsBar);
}

/* ── Render Form ── */
function renderForm() {
  const cat = COMMANDS[state.category];
  const sc = cat.subcommands.find(s => s.id === state.subcommandId);
  if (!sc) return;

  formIcon.innerHTML = `<div class="cat-icon ${cat.iconClass}" style="width:28px;height:28px;font-size:0.875rem" aria-hidden="true">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${getCatIcon(cat.iconClass)}</svg>
  </div>`;
  formTitle.textContent = sc.label;
  formDesc.textContent = sc.desc;

  formFields.innerHTML = '';
  sc.fields.forEach((field) => {
    const group = document.createElement('div');
    group.className = 'field-group' + (sc.fields.length === 1 ? ' full-width' : '');

    if (field.type === 'select') {
      group.innerHTML = `
        <label class="field-label" for="field-${field.key}">
          ${field.label}
          ${field.required ? '<span style="color:var(--error)">*</span>' : ''}
          ${field.hint ? `<span class="field-hint">${field.hint}</span>` : ''}
        </label>
        <select class="field-select" id="field-${field.key}" data-key="${field.key}">
          ${field.options.map(o => `<option value="${o}" ${(state.values[field.key] || field.default) === o ? 'selected' : ''}>${o}</option>`).join('')}
        </select>
        <span class="field-error" id="error-${field.key}"></span>
      `;
    } else {
      const inputType = field.type === 'number' ? 'number' : 'text';
      const val = state.values[field.key] !== undefined ? state.values[field.key] : (field.default || '');
      group.innerHTML = `
        <label class="field-label" for="field-${field.key}">
          ${field.label}
          ${field.required ? '<span style="color:var(--error)">*</span>' : ''}
          ${field.hint ? `<span class="field-hint">${field.hint}</span>` : ''}
        </label>
        <input
          class="field-input"
          id="field-${field.key}"
          type="${inputType}"
          data-key="${field.key}"
          placeholder="${field.placeholder}"
          value="${escapeHtml(val)}"
          ${field.required ? 'required' : ''}
        >
        <span class="field-error" id="error-${field.key}"></span>
      `;
    }
    formFields.appendChild(group);
  });

  // Add event listeners
  formFields.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => {
      state.values[el.dataset.key] = el.value;
      validateField(el.dataset.key);
      updatePreview();
    });
    el.addEventListener('change', () => {
      state.values[el.dataset.key] = el.value;
      validateField(el.dataset.key);
      updatePreview();
    });
    el.addEventListener('blur', () => {
      validateField(el.dataset.key);
    });
  });

  // Tips
  tipsText.textContent = sc.tips || cat.tips || '';

  // Initial validation for required fields
  sc.fields.forEach(f => { if (f.required) validateField(f.key); });
}

function validateField(key) {
  const cat = COMMANDS[state.category];
  const sc = cat.subcommands.find(s => s.id === state.subcommandId);
  const field = sc.fields.find(f => f.key === key);
  if (!field) return;

  const input = document.getElementById(`field-${key}`);
  const error = document.getElementById(`error-${key}`);
  if (!input || !error) return;

  const val = (state.values[key] || '').trim();

  if (field.required && !val) {
    input.classList.add('error');
    error.textContent = `Campo obbligatorio — inserisci ${field.label.toLowerCase()}`;
    return false;
  }

  if (field.type === 'number' && val && isNaN(Number(val))) {
    input.classList.add('error');
    error.textContent = 'Inserisci un numero valido';
    return false;
  }

  input.classList.remove('error');
  error.textContent = '';
  return true;
}

/* ── Update Preview ── */
function updatePreview() {
  const cat = COMMANDS[state.category];
  const sc = cat.subcommands.find(s => s.id === state.subcommandId);
  if (!sc) {
    previewCommand.innerHTML = '<span class="preview-empty">Compila i campi per vedere il comando...</span>';
    previewStatus.textContent = '';
    return;
  }

  let cmd = sc.template;
  let hasMissing = false;

  sc.fields.forEach(field => {
    let val = (state.values[field.key] || '').trim();
    if (!val && field.default) val = field.default;
    if (!val && field.required) {
      val = `{${field.key}}`;
      hasMissing = true;
    }
    const placeholder = `{${field.key}}`;
    cmd = cmd.split(placeholder).join(val);
  });

  // Remove empty optional parts (trailing spaces after empty optionals)
  cmd = cmd.replace(/\s+/g, ' ').trim();

  // Build highlighted HTML
  const tokens = tokenizeCommand(cmd, sc.template, sc.fields);
  const prompt = '<span class="preview-prompt">$</span>';

  if (cmd.trim() === sc.template) {
    // No fields filled yet
    previewCommand.innerHTML = prompt + '<span class="preview-empty">' + escapeHtml(sc.template) + '</span><span class="preview-caret" aria-hidden="true"></span>';
    previewStatus.textContent = '';
  } else {
    previewCommand.innerHTML = prompt + '<span class="preview-text">' + tokens + '</span><span class="preview-caret" aria-hidden="true"></span>';
    if (hasMissing) {
      previewStatus.innerHTML = '⚠️ Compila i campi obbligatori';
      previewStatus.style.color = '#D97706';
    } else {
      previewStatus.innerHTML = '✓ Comando pronto';
      previewStatus.style.color = 'var(--secondary)';
    }
  }
}

function tokenizeCommand(cmd, template, fields) {
  // Simple tokenization: split by spaces and colorize
  const parts = cmd.split(/(\s+)/);
  let result = '';
  parts.forEach(part => {
    if (part.trim() === '') {
      result += part;
      return;
    }
    const trimmed = part.trim();
    // Determine token type
    let cls = '';
    if (['git', 'ffmpeg', 'docker', 'ls', 'cp', 'mv', 'mkdir', 'chmod', 'find', 'grep', 'npm'].includes(trimmed)) {
      cls = 'cmd-name';
    } else if (trimmed.startsWith('-')) {
      cls = 'cmd-flag';
    } else if (trimmed.startsWith('.') || trimmed.startsWith('/') || trimmed.startsWith('~') || trimmed.includes('/')) {
      cls = 'cmd-path';
    } else if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
      cls = 'cmd-value';
    } else if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      cls = 'cmd-placeholder';
    } else {
      cls = 'cmd-arg';
    }
    result += `<span class="${cls}">${escapeHtml(part)}</span>`;
  });
  return result;
}

/* ── Copy ── */
async function handleCopy() {
  const cat = COMMANDS[state.category];
  const sc = cat.subcommands.find(s => s.id === state.subcommandId);
  if (!sc) return;

  // Validate all required fields
  let allValid = true;
  sc.fields.forEach(f => {
    if (!validateField(f.key)) allValid = false;
  });

  let cmd = sc.template;
  sc.fields.forEach(field => {
    let val = (state.values[field.key] || '').trim();
    if (!val && field.default) val = field.default;
    if (!val && field.required) val = `{${field.key}}`;
    cmd = cmd.split(`{${field.key}}`).join(val);
  });
  cmd = cmd.replace(/\s+/g, ' ').trim();

  if (!allValid) {
    showToast('⚠️ Completa tutti i campi obbligatori prima di copiare', false);
    return;
  }

  try {
    await navigator.clipboard.writeText(cmd);
    copyBtn.classList.add('copied');
    copyBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
      Copiato!
    `;
    showToast('✓ Comando copiato negli appunti', true);
    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        Copia comando
      `;
    }, 2000);
  } catch {
    showToast('Errore durante la copia. Seleziona e copia manualmente.', false);
  }
}

/* ── Reset ── */
function handleReset() {
  state.values = {};
  renderForm();
  updatePreview();
  showToast('Campi reimpostati', true);
}

/* ── Toast ── */
let toastTimer;
function showToast(msg, success) {
  clearTimeout(toastTimer);
  toastMsg.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ── Helpers ── */
function showElement(el) { el.style.display = ''; }
function hideElement(el) { el.style.display = 'none'; }
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ── Keyboard nav for category cards ── */
document.addEventListener('keydown', (e) => {
  if (!state.category) return;
  if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
    // Only handle if no text is selected (let normal copy work)
    const sel = window.getSelection();
    if (!sel || sel.toString().length === 0) {
      e.preventDefault();
      handleCopy();
    }
  }
});

/* ── Start ── */
init();
