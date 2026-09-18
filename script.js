const defaults = {
  light: {
    primary:   '#E05AA6',
    secondary: '#A565D9',
    tertiary:  '#F3E8FB',
    background:'#FBF7FC',
    surface:   '#FFFFFF',
    text:      '#241628',
    textMuted: '#6B6178',
    border:    '#E4DCEB',
    success:   '#16A34A',
    danger:    '#DC2626',
    warning:   '#D97706',
    info:      '#2563EB'
  },
  dark: {
    primary:   '#E05AA6',
    secondary: '#A565D9',
    tertiary:  '#2B1A3D',
    background:'#16121C',
    surface:   '#1F1726',
    text:      '#F4F2F7',
    textMuted: '#B8B1C7',
    border:    '#332B40',
    success:   '#4ADE80',
    danger:    '#F87171',
    warning:   '#FBBF24',
    info:      '#60A5FA'
  }
};

const labels = {
  primary: 'Primary',
  secondary: 'Secondary',
  tertiary: 'Tertiary',
  background: 'Background',
  surface: 'Surface',
  text: 'Text',
  textMuted: 'Text Muted',
  border: 'Border',
  success: 'Success',
  danger: 'Danger',
  warning: 'Warning',
  info: 'Info'
};

let mode = 'dark';
let state = { ...defaults[mode] };

const htmlEl = document.documentElement;
const controls = document.getElementById('controls');
const lightBtn = document.getElementById('lightBtn');
const darkBtn = document.getElementById('darkBtn');

function buildControls() {
  controls.innerHTML = '';
  Object.keys(labels).forEach(key => {
    const row = document.createElement('div');
    row.className = 'color-row';
    
    const pickerWrap = document.createElement('div');
    pickerWrap.className = 'color-picker-wrap';
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = state[key];
    colorInput.dataset.key = key;
    pickerWrap.appendChild(colorInput);
    
    const label = document.createElement('div');
    label.className = 'color-label';
    label.textContent = labels[key];
    
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.className = 'color-hex-input';
    textInput.value = state[key].toUpperCase();
    textInput.maxLength = 7;
    textInput.dataset.keyText = key;
    
    row.appendChild(pickerWrap);
    row.appendChild(label);
    row.appendChild(textInput);
    controls.appendChild(row);
  });
}

function isValidHex(v) {
  return /^#[0-9A-Fa-f]{6}$/i.test(v);
}

function renderPreview() {
  Object.keys(state).forEach(key => {
    const cssVar = '--pv-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
    htmlEl.style.setProperty(cssVar, state[key]);
  });
}

function handleInput(e) {
  const target = e.target;
  const key = target.dataset.key || target.dataset.keyText;
  if (!key) return;

  if (target.dataset.key) {
    state[key] = target.value;
    const twin = controls.querySelector(`[data-key-text="${key}"]`);
    if(twin) {
      twin.value = target.value.toUpperCase();
      twin.classList.remove('invalid');
    }
  } else {
    let v = target.value.trim();
    if (v && !v.startsWith('#')) v = '#' + v;
    
    if (isValidHex(v)) {
      state[key] = v;
      const twin = controls.querySelector(`[data-key="${key}"]`);
      if(twin) twin.value = v;
      target.classList.remove('invalid');
    } else {
      target.classList.add('invalid');
      return; 
    }
  }
  renderPreview();
}

controls.addEventListener('input', handleInput);

function setMode(newMode) {
  mode = newMode;
  state = { ...defaults[mode] };
  
  htmlEl.setAttribute('data-theme', mode);
  
  lightBtn.classList.toggle('active', mode === 'light');
  darkBtn.classList.toggle('active', mode === 'dark');
  
  buildControls();
  renderPreview();
  
  const cssOut = document.getElementById('cssOut');
  if (cssOut) cssOut.style.display = 'none';
}

lightBtn.addEventListener('click', () => setMode('light'));
darkBtn.addEventListener('click', () => setMode('dark'));

document.getElementById('resetBtn').addEventListener('click', () => {
  setMode(mode);
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const out = document.getElementById('cssOut');
  const lines = Object.keys(state).map(key => {
    const cssVarName = '--color-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
    return `  ${cssVarName}: ${state[key]};`;
  });
  out.value = `:root {\n${lines.join('\n')}\n}`;
  out.style.display = 'block';
  out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  out.focus();
  out.select();
});

// Bulk Paste parsing
const labelToKey = {};
Object.keys(labels).forEach(key => {
  const normalized = labels[key].toLowerCase().replace(/\s+/g, '');
  labelToKey[normalized] = key;
});
labelToKey['textmuted'] = 'textMuted';
labelToKey['mutedtext'] = 'textMuted';

function parseBulkInput(raw) {
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  const result = {};
  const unmatched = [];

  lines.forEach(line => {
    const hexMatch = line.match(/#[0-9A-Fa-f]{6}\b/i);
    if (!hexMatch) { unmatched.push(line); return; }

    const hex = hexMatch[0];
    const labelPart = line.slice(0, hexMatch.index).trim();
    const normalized = labelPart.toLowerCase().replace(/\s+/g, '');

    const key = labelToKey[normalized];
    if (key) {
      result[key] = hex;
    } else {
      unmatched.push(line);
    }
  });

  return { result, unmatched };
}

document.getElementById('applyBulkBtn').addEventListener('click', () => {
  const raw = document.getElementById('bulkInput').value;
  const statusEl = document.getElementById('bulkStatus');

  if (!raw.trim()) {
    statusEl.textContent = 'Textarea is empty.';
    statusEl.className = 'status-msg err';
    return;
  }

  const { result, unmatched } = parseBulkInput(raw);
  const matchedCount = Object.keys(result).length;

  if (matchedCount === 0) {
    statusEl.textContent = 'Unrecognized format. Check the placeholder.';
    statusEl.className = 'status-msg err';
    return;
  }

  Object.assign(state, result);
  buildControls();
  renderPreview();

  if (unmatched.length > 0) {
    statusEl.textContent = `Applied ${matchedCount} colors, skipped ${unmatched.length} lines.`;
    statusEl.className = 'status-msg err';
  } else {
    statusEl.textContent = `Applied ${matchedCount} colors successfully ✓`;
    statusEl.className = 'status-msg ok';
  }
  
  setTimeout(() => {
    statusEl.textContent = '';
  }, 4000);
});

// Quick Color Preview
const quickInput = document.getElementById('quickInput');
const quickStatus = document.getElementById('quickStatus');
const quickSwatchList = document.getElementById('quickSwatchList');

function renderQuickSwatches() {
  const lines = quickInput.value.split('\n').map(l => l.trim()).filter(Boolean);
  quickSwatchList.innerHTML = '';

  if (lines.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No colors yet. Enter hex codes to preview.';
    quickSwatchList.appendChild(empty);
    quickStatus.textContent = '';
    quickStatus.className = 'status-msg';
    return;
  }

  let validCount = 0;
  let invalidCount = 0;

  lines.forEach((line, i) => {
    const hexMatch = line.match(/^#[0-9A-Fa-f]{6}$/i);

    const row = document.createElement('div');
    row.className = 'quick-swatch';

    const colorBox = document.createElement('div');
    colorBox.className = 'qs-color';

    const info = document.createElement('div');
    info.className = 'qs-info';

    const indexEl = document.createElement('span');
    indexEl.className = 'qs-idx';
    indexEl.textContent = `#${i + 1}`;

    const hexEl = document.createElement('span');
    hexEl.className = 'qs-hex';

    if (hexMatch) {
      colorBox.style.background = line;
      hexEl.textContent = line.toUpperCase();
      validCount++;
    } else {
      colorBox.style.background = 'transparent';
      colorBox.style.borderColor = 'var(--app-err)';
      hexEl.textContent = `"${line}" — invalid`;
      hexEl.style.color = 'var(--app-err)';
      invalidCount++;
    }

    info.appendChild(hexEl);
    info.appendChild(indexEl);
    row.appendChild(colorBox);
    row.appendChild(info);
    
    quickSwatchList.appendChild(row);
  });

  if (invalidCount > 0) {
    quickStatus.textContent = `${validCount} valid, ${invalidCount} unrecognized.`;
    quickStatus.className = 'status-msg err';
  } else {
    quickStatus.textContent = `${validCount} colors rendered ✓`;
    quickStatus.className = 'status-msg ok';
  }
}

quickInput.addEventListener('input', renderQuickSwatches);
renderQuickSwatches();

// Initialize App
htmlEl.setAttribute('data-theme', mode);
buildControls();
renderPreview();

