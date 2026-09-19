/* ==========================================================
   Color Playground – script.js (clean version)
   ========================================================== */

// ── Palette Defaults ──────────────────────────────────────
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

const htmlEl   = document.documentElement;
const controls = document.getElementById('controls');
const lightBtn = document.getElementById('lightBtn');
const darkBtn  = document.getElementById('darkBtn');

// ── Color Utilities ───────────────────────────────────────

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/** Valid: #RRGGBB or #RRGGBBAA */
function isValidHex(v) { return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(v); }

/** HEX → { r, g, b, a } */
function hexToRgba(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3 || hex.length === 4) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const a = hex.length >= 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

/** RGBA → HEX. Alpha omitted when it is 1. */
function rgbaToHex(r, g, b, a = 1) {
  const h = v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0');
  let out = '#' + h(r) + h(g) + h(b);
  if (a < 1) out += h(a * 255);
  return out.toUpperCase();
}

/** RGB (0-255) → HSV { h:0-360, s:0-100, v:0-100 } */
function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  if (d !== 0) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h *= 60;
  }
  return { h, s: s * 100, v: max * 100 };
}

/** HSV → [R, G, B] (0-255) */
function hsvToRgb(h, s, v) {
  h = ((h % 360) + 360) % 360;
  s /= 100; v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;
  let r1, g1, b1;
  if      (h < 60)  { r1 = c; g1 = x; b1 = 0; }
  else if (h < 120) { r1 = x; g1 = c; b1 = 0; }
  else if (h < 180) { r1 = 0; g1 = c; b1 = x; }
  else if (h < 240) { r1 = 0; g1 = x; b1 = c; }
  else if (h < 300) { r1 = x; g1 = 0; b1 = c; }
  else              { r1 = c; g1 = 0; b1 = x; }
  return [
    Math.round((r1 + m) * 255),
    Math.round((g1 + m) * 255),
    Math.round((b1 + m) * 255)
  ];
}

/** HEX → HSL [h, s%, l%] (for Harmony) */
function hexToHsl(hex) {
  const { r, g, b } = hexToRgba(hex);
  const r1 = r / 255, g1 = g / 255, b1 = b / 255;
  const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r1: h = (g1 - b1) / d + (g1 < b1 ? 6 : 0); break;
      case g1: h = (b1 - r1) / d + 2; break;
      default: h = (r1 - g1) / d + 4;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

/** HSL → HEX (for Harmony) */
function hslToHex(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toH = x => Math.round(x * 255).toString(16).padStart(2, '0');
  return ('#' + toH(r) + toH(g) + toH(b)).toUpperCase();
}


// ── Build Palette Controls ────────────────────────────────

function buildControls() {
  cpClose(); // trigger buttons are about to be replaced
  controls.innerHTML = '';

  Object.keys(labels).forEach(key => {
    const row = document.createElement('div');
    row.className = 'color-row';

    const wrap = document.createElement('div');
    wrap.className = 'color-picker-wrap';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'custom-picker-trigger';
    btn.style.backgroundColor = state[key];
    btn.dataset.key = key;
    btn.setAttribute('aria-label', 'Pick ' + labels[key]);
    wrap.appendChild(btn);

    const label = document.createElement('div');
    label.className = 'color-label';
    label.textContent = labels[key];

    const textIn = document.createElement('input');
    textIn.type = 'text';
    textIn.className = 'color-hex-input';
    textIn.value = state[key].toUpperCase();
    textIn.maxLength = 9;
    textIn.spellcheck = false;
    textIn.dataset.keyText = key;

    row.append(wrap, label, textIn);
    controls.appendChild(row);
  });
}


// ── Render Live Preview ───────────────────────────────────

function renderPreview() {
  Object.keys(state).forEach(key => {
    const cssVar = '--pv-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
    htmlEl.style.setProperty(cssVar, state[key]);
  });
}

function syncTriggerBg(key) {
  const btn = controls.querySelector(`[data-key="${key}"]`);
  if (btn) btn.style.backgroundColor = state[key];
}


// ── Hex Text Input Handler ────────────────────────────────

controls.addEventListener('input', e => {
  const target = e.target;
  const key = target.dataset.keyText;
  if (!key) return;

  let v = target.value.trim();
  if (v && !v.startsWith('#')) v = '#' + v;

  if (isValidHex(v)) {
    state[key] = v.toUpperCase();
    syncTriggerBg(key);
    target.classList.remove('invalid');
    renderPreview();
  } else {
    target.classList.add('invalid');
  }
});


// ── Theme Switching & Reset ───────────────────────────────

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
document.getElementById('resetBtn').addEventListener('click', () => setMode(mode));


// ── Export CSS ────────────────────────────────────────────

document.getElementById('exportBtn').addEventListener('click', () => {
  const out = document.getElementById('cssOut');
  const lines = Object.keys(state).map(key => {
    const name = '--color-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
    return `  ${name}: ${state[key]};`;
  });
  out.value = `:root {\n${lines.join('\n')}\n}`;
  out.style.display = 'block';
  out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  out.focus();
  out.select();
});


// ── Bulk Input ────────────────────────────────────────────

const labelToKey = {};
Object.keys(labels).forEach(key => {
  labelToKey[labels[key].toLowerCase().replace(/\s+/g, '')] = key;
});
labelToKey['mutedtext'] = 'textMuted';

function parseBulkInput(raw) {
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  const result = {};
  const unmatched = [];

  lines.forEach(line => {
    const m = line.match(/#[0-9A-Fa-f]{6}\b/);
    if (!m) { unmatched.push(line); return; }
    const norm = line.slice(0, m.index).trim().toLowerCase().replace(/\s+/g, '');
    const key = labelToKey[norm];
    if (key) result[key] = m[0].toUpperCase();
    else unmatched.push(line);
  });

  return { result, unmatched };
}

document.getElementById('applyBulkBtn').addEventListener('click', () => {
  const raw = document.getElementById('bulkInput').value;
  const statusEl = document.getElementById('bulkStatus');
  const setStatus = (msg, cls) => { statusEl.textContent = msg; statusEl.className = 'status-msg ' + cls; };

  if (!raw.trim()) return setStatus('Textarea is empty.', 'err');

  const { result, unmatched } = parseBulkInput(raw);
  const n = Object.keys(result).length;
  if (n === 0) return setStatus('Unrecognized format. Check the placeholder.', 'err');

  Object.assign(state, result);
  buildControls();
  renderPreview();

  if (unmatched.length) setStatus(`Applied ${n} colors, skipped ${unmatched.length} lines.`, 'err');
  else setStatus(`Applied ${n} colors successfully ✓`, 'ok');

  setTimeout(() => { statusEl.textContent = ''; }, 4000);
});


// ── Color Harmony ─────────────────────────────────────────

const harmonyBasePicker = document.getElementById('harmonyBasePicker');
const harmonyBaseHex    = document.getElementById('harmonyBaseHex');
const harmonyType       = document.getElementById('harmonyType');
const harmonyResults    = document.getElementById('harmonyResults');

function generateHarmony() {
  let hex = harmonyBaseHex.value.trim();
  if (!isValidHex(hex)) return;
  hex = hex.slice(0, 7).toUpperCase(); // harmony ignores alpha

  const [h, s, l] = hexToHsl(hex);
  const wrap = v => ((v % 360) + 360) % 360;
  const type = harmonyType.value;
  let colors = [hex];

  if (type === 'complementary') {
    colors.push(hslToHex(wrap(h + 180), s, l));
  } else if (type === 'analogous') {
    colors = [hslToHex(wrap(h - 30), s, l), hex, hslToHex(wrap(h + 30), s, l)];
  } else if (type === 'triadic') {
    colors.push(hslToHex(wrap(h + 120), s, l), hslToHex(wrap(h + 240), s, l));
  } else if (type === 'split-complementary') {
    colors.push(hslToHex(wrap(h + 150), s, l), hslToHex(wrap(h + 210), s, l));
  } else if (type === 'monochromatic') {
    colors = [
      hslToHex(h, s, Math.min(100, l + 30)),
      hslToHex(h, s, Math.min(100, l + 15)),
      hex,
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

    const hexLbl = document.createElement('span');
    hexLbl.className = 'harmony-swatch-hex';
    hexLbl.textContent = color;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-copy';
    btn.textContent = 'Copy';
    btn.onclick = () => {
      if (navigator.clipboard) navigator.clipboard.writeText(color).catch(() => {});
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1500);
    };

    card.append(swatch, hexLbl, btn);
    harmonyResults.appendChild(card);
  });
}

harmonyBaseHex.addEventListener('input', () => {
  let v = harmonyBaseHex.value.trim();
  if (v && !v.startsWith('#')) v = '#' + v;
  if (isValidHex(v)) {
    harmonyBasePicker.style.backgroundColor = v;
    harmonyBaseHex.classList.remove('invalid');
    generateHarmony();
  } else {
    harmonyBaseHex.classList.add('invalid');
  }
});
harmonyType.addEventListener('change', generateHarmony);


// ── Quick Color Preview ───────────────────────────────────

const quickInput      = document.getElementById('quickInput');
const quickStatus     = document.getElementById('quickStatus');
const quickSwatchList = document.getElementById('quickSwatchList');

function renderQuickSwatches() {
  const lines = quickInput.value.split('\n').map(l => l.trim()).filter(Boolean);
  quickSwatchList.innerHTML = '';

  if (!lines.length) {
    const p = document.createElement('p');
    p.className = 'empty-state';
    p.textContent = 'No colors yet. Enter hex codes to preview.';
    quickSwatchList.appendChild(p);
    quickStatus.textContent = '';
    quickStatus.className = 'status-msg';
    return;
  }

  let valid = 0, invalid = 0;
  lines.forEach((line, i) => {
    const ok = /^#[0-9A-Fa-f]{6}$/.test(line);

    const row  = document.createElement('div'); row.className = 'quick-swatch';
    const box  = document.createElement('div'); box.className = 'qs-color';
    const info = document.createElement('div'); info.className = 'qs-info';
    const idx  = document.createElement('span'); idx.className = 'qs-idx'; idx.textContent = `#${i + 1}`;
    const hex  = document.createElement('span'); hex.className = 'qs-hex';

    if (ok) {
      box.style.background = line;
      hex.textContent = line.toUpperCase();
      valid++;
    } else {
      box.style.background = 'transparent';
      box.style.borderColor = 'var(--app-err)';
      hex.textContent = `"${line}" — invalid`;
      hex.style.color = 'var(--app-err)';
      invalid++;
    }

    info.append(hex, idx);
    row.append(box, info);
    quickSwatchList.appendChild(row);
  });

  quickStatus.textContent = invalid
    ? `${valid} valid, ${invalid} unrecognized.`
    : `${valid} colors rendered ✓`;
  quickStatus.className = 'status-msg ' + (invalid ? 'err' : 'ok');
}

quickInput.addEventListener('input', renderQuickSwatches);


// ══════════════════════════════════════════════════════════
//  CUSTOM COLOR PICKER
// ══════════════════════════════════════════════════════════

const cpPopup      = document.getElementById('cpPopup');
const cpSatArea    = document.getElementById('cpSatArea');
const cpSatThumb   = document.getElementById('cpSatThumb');
const cpHueTrack   = document.getElementById('cpHueTrack');
const cpHueThumb   = document.getElementById('cpHueThumb');
const cpAlphaTrack = document.getElementById('cpAlphaTrack');
const cpAlphaGrad  = document.getElementById('cpAlphaGrad');
const cpAlphaThumb = document.getElementById('cpAlphaThumb');
const cpPreview    = document.getElementById('cpPreview');
const cpHex        = document.getElementById('cpHex');
const cpR          = document.getElementById('cpR');
const cpG          = document.getElementById('cpG');
const cpB          = document.getElementById('cpB');
const cpA          = document.getElementById('cpA');

let cpState = { h: 0, s: 100, v: 100, a: 1 };
let cpActiveKey = null;   // palette key being edited
let cpIsHarmony = false;  // editing the Harmony base color?
let cpTriggerEl = null;   // button that opened the picker

// ── Open / Close ──────────────────────────────────────────

function cpOpen(key, triggerEl, isHarmony) {
  cpActiveKey = key;
  cpIsHarmony = !!isHarmony;
  cpTriggerEl = triggerEl;

  const hex = isHarmony ? harmonyBaseHex.value.trim() : state[key];
  const { r, g, b, a } = hexToRgba(isValidHex(hex) ? hex : '#FF0000');
  const hsv = rgbToHsv(r, g, b);
  cpState = { h: hsv.h, s: hsv.s, v: hsv.v, a };

  cpPopup.classList.remove('hidden');
  cpRender(false); // don't push: opening must not alter the color (rounding)
  cpPosition(triggerEl);
}

function cpClose() {
  cpPopup.classList.add('hidden');
  cpActiveKey = null;
  cpIsHarmony = false;
  cpTriggerEl = null;
}

function cpPosition(triggerEl) {
  const tr = triggerEl.getBoundingClientRect();
  const pw = cpPopup.offsetWidth;
  const ph = cpPopup.offsetHeight;
  const gap = 6;

  let top  = tr.bottom + gap;
  let left = tr.left;

  if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
  if (left < 8) left = 8;
  if (top + ph > window.innerHeight - 8) top = tr.top - ph - gap;
  if (top < 8) top = 8;

  cpPopup.style.left = left + 'px';
  cpPopup.style.top  = top + 'px';
}

// ── Render UI from cpState ────────────────────────────────

function cpRender(push = true) {
  const { h, s, v, a } = cpState;
  const [r, g, b] = hsvToRgb(h, s, v);
  const hex = rgbaToHex(r, g, b, a);

  cpSatArea.style.backgroundColor = `hsl(${h}, 100%, 50%)`;
  cpSatThumb.style.left = s + '%';
  cpSatThumb.style.top  = (100 - v) + '%';
  cpSatThumb.style.background = `rgb(${r},${g},${b})`;
  cpHueThumb.style.left = (h / 360 * 100) + '%';
  cpAlphaGrad.style.background = `linear-gradient(to right, rgba(${r},${g},${b},0), rgb(${r},${g},${b}))`;
  cpAlphaThumb.style.left = (a * 100) + '%';
  cpPreview.style.background = `rgba(${r},${g},${b},${a})`;

  // Don't overwrite a field while the user is typing in it
  if (document.activeElement !== cpHex) { cpHex.value = hex; cpHex.classList.remove('invalid'); }
  if (document.activeElement !== cpR) cpR.value = r;
  if (document.activeElement !== cpG) cpG.value = g;
  if (document.activeElement !== cpB) cpB.value = b;
  if (document.activeElement !== cpA) cpA.value = Math.round(a * 100);

  if (push) cpPushColor(hex);
}

/** Push the picked color into app state / harmony */
function cpPushColor(hex) {
  if (cpIsHarmony) {
    harmonyBasePicker.style.backgroundColor = hex;
    harmonyBaseHex.value = hex;
    harmonyBaseHex.classList.remove('invalid');
    generateHarmony();
  } else if (cpActiveKey) {
    state[cpActiveKey] = hex;
    syncTriggerBg(cpActiveKey);
    const textIn = controls.querySelector(`[data-key-text="${cpActiveKey}"]`);
    if (textIn) { textIn.value = hex; textIn.classList.remove('invalid'); }
    renderPreview();
  }
}

// ── Pointer helpers (mouse + touch) ───────────────────────

function ptrX(e) { return (e.touches ? e.touches[0] : e).clientX; }
function ptrY(e) { return (e.touches ? e.touches[0] : e).clientY; }

function makeDraggable(el, onMove) {
  function start(e) {
    if (e.type === 'mousedown' && e.button !== 0) return;
    e.preventDefault();
    onMove(e);
    const move = ev => { ev.preventDefault(); onMove(ev); };
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('touchend', up);
  }
  el.addEventListener('mousedown', start);
  el.addEventListener('touchstart', start, { passive: false });
}

// ── Saturation / Value area ───────────────────────────────

makeDraggable(cpSatArea, e => {
  const rect = cpSatArea.getBoundingClientRect();
  const x = clamp(ptrX(e) - rect.left, 0, rect.width);
  const y = clamp(ptrY(e) - rect.top, 0, rect.height);
  cpState.s = (x / rect.width) * 100;
  cpState.v = (1 - y / rect.height) * 100;
  cpRender();
});

// ── Hue slider ────────────────────────────────────────────

makeDraggable(cpHueTrack, e => {
  const rect = cpHueTrack.getBoundingClientRect();
  const x = clamp(ptrX(e) - rect.left, 0, rect.width);
  cpState.h = (x / rect.width) * 360;
  cpRender();
});

// ── Alpha slider ──────────────────────────────────────────

makeDraggable(cpAlphaTrack, e => {
  const rect = cpAlphaTrack.getBoundingClientRect();
  const x = clamp(ptrX(e) - rect.left, 0, rect.width);
  cpState.a = x / rect.width;
  cpRender();
});

// ── HEX input ─────────────────────────────────────────────

cpHex.addEventListener('input', () => {
  let v = cpHex.value.trim();
  if (v && !v.startsWith('#')) v = '#' + v;
  if (isValidHex(v)) {
    const { r, g, b, a } = hexToRgba(v);
    const hsv = rgbToHsv(r, g, b);
    cpState = { h: hsv.s > 0 ? hsv.h : cpState.h, s: hsv.s, v: hsv.v, a };
    cpRender();
  } else {
    cpHex.classList.toggle('invalid', v.length > 1);
  }
});

// ── RGBA inputs ───────────────────────────────────────────

function onRgbaInput() {
  const r = clamp(parseInt(cpR.value) || 0, 0, 255);
  const g = clamp(parseInt(cpG.value) || 0, 0, 255);
  const b = clamp(parseInt(cpB.value) || 0, 0, 255);
  const a = clamp((parseInt(cpA.value) || 0) / 100, 0, 1);
  const hsv = rgbToHsv(r, g, b);
  if (hsv.s > 0) cpState.h = hsv.h; // keep hue for grays
  cpState.s = hsv.s;
  cpState.v = hsv.v;
  cpState.a = a;
  cpRender();
}
[cpR, cpG, cpB, cpA].forEach(el => el.addEventListener('input', onRgbaInput));

// ── Open on trigger click / close on outside click ────────

document.addEventListener('click', e => {
  const trig = e.target.closest('.custom-picker-trigger');
  if (trig) {
    if (!cpPopup.classList.contains('hidden') && cpTriggerEl === trig) {
      cpClose();
      return;
    }
    cpOpen(trig.dataset.key || null, trig, trig.dataset.harmony === 'true');
    return;
  }
  if (!cpPopup.classList.contains('hidden') && !cpPopup.contains(e.target)) cpClose();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !cpPopup.classList.contains('hidden')) cpClose();
});

window.addEventListener('resize', () => {
  if (cpTriggerEl && !cpPopup.classList.contains('hidden')) cpPosition(cpTriggerEl);
});


// ── Initialize ────────────────────────────────────────────

htmlEl.setAttribute('data-theme', mode);
buildControls();
renderPreview();
generateHarmony();
renderQuickSwatches();