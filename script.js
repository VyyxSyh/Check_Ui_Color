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

// Color Conversions for Harmony
function hexToHsl(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;
  
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// Harmony Generator
const harmonyBasePicker = document.getElementById('harmonyBasePicker');
const harmonyBaseHex = document.getElementById('harmonyBaseHex');
const harmonyType = document.getElementById('harmonyType');
const harmonyResults = document.getElementById('harmonyResults');

function generateHarmony() {
  if (!harmonyBaseHex) return; // guard if not loaded
  const hex = harmonyBaseHex.value;
  if (!isValidHex(hex)) return;
  
  const [h, s, l] = hexToHsl(hex);
  const type = harmonyType.value;
  let colors = [hex.toUpperCase()]; 
  
  const wrap = val => (val + 360) % 360;

  if (type === 'complementary') {
    colors.push(hslToHex(wrap(h + 180), s, l));
  } else if (type === 'analogous') {
    colors = [
      hslToHex(wrap(h - 30), s, l),
      hex.toUpperCase(),
      hslToHex(wrap(h + 30), s, l)
    ];
  } else if (type === 'triadic') {
    colors.push(hslToHex(wrap(h + 120), s, l));
    colors.push(hslToHex(wrap(h + 240), s, l));
  } else if (type === 'split-complementary') {
    colors.push(hslToHex(wrap(h + 150), s, l));
    colors.push(hslToHex(wrap(h + 210), s, l));
  } else if (type === 'monochromatic') {
    colors = [
      hslToHex(h, s, Math.min(100, l + 30)),
      hslToHex(h, s, Math.min(100, l + 15)),
      hex.toUpperCase(),
      hslToHex(h, s, Math.max(0, l - 15)),
      hslToHex(h, s, Math.max(0, l - 30))
    ];
  }

  renderHarmonyResults(colors);
}

function renderHarmonyResults(colors) {
  harmonyResults.innerHTML = '';
  colors.forEach(color => {
    const card = document.createElement('div');
    card.className = 'harmony-swatch-card';
    
    const swatch = document.createElement('div');
    swatch.className = 'harmony-swatch-color';
    swatch.style.background = color;
    
    const hexLabel = document.createElement('span');
    hexLabel.className = 'harmony-swatch-hex';
    hexLabel.textContent = color;
    
    const btn = document.createElement('button');
    btn.className = 'btn-copy';
    btn.textContent = 'Copy';
    btn.onclick = () => {
      navigator.clipboard.writeText(color);
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 1500);
    };
    
    card.appendChild(swatch);
    card.appendChild(hexLabel);
    card.appendChild(btn);
    harmonyResults.appendChild(card);
  });
}

function handleHarmonyInput(e) {
  let v = e.target.value.trim();
  if (e.target === harmonyBaseHex && !v.startsWith('#') && v.length > 0) {
    v = '#' + v;
  }
  
  if (e.target === harmonyBaseHex) {
    if (isValidHex(v)) {
      harmonyBasePicker.value = v;
      harmonyBaseHex.value = v.toUpperCase();
      harmonyBaseHex.classList.remove('invalid');
      generateHarmony();
    } else {
      harmonyBaseHex.classList.add('invalid');
    }
  } else if (e.target === harmonyBasePicker) {
    harmonyBaseHex.value = v.toUpperCase();
    harmonyBaseHex.classList.remove('invalid');
    generateHarmony();
  } else if (e.target === harmonyType) {
    generateHarmony();
  }
}

if (harmonyBasePicker) {
  harmonyBasePicker.addEventListener('input', handleHarmonyInput);
  harmonyBaseHex.addEventListener('input', handleHarmonyInput);
  harmonyType.addEventListener('change', handleHarmonyInput);
  generateHarmony();
}

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

