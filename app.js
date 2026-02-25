'use strict';

const APP_VERSION = '1.0.4';

/* ============================================================
   DOM references
   ============================================================ */
const $ = (id) => document.getElementById(id);

const els = {
  count:        $('saj-count'),
  sessionStart: $('session-start'),
  startTime:    $('session-start-time'),
  btnBeer:      $('btn-beer'),
  btnWine:      $('btn-wine'),
  btnShot:      $('btn-shot'),
  btnRemove:    $('btn-remove'),
  btnReset:     $('btn-reset'),
  btnInfo:      $('btn-info'),
  infoDialog:   $('info-dialog'),
  btnInfoClose: $('btn-info-close'),
  infoVersion:  $('info-version'),
  logBody:      $('log-body'),
  chartSection: $('chart-section'),
  chart:        $('duration-chart'),
};

/* ============================================================
   State
   ============================================================ */
let timestamps    = [];   // [{ts: Number, type: 'beer'|'wine'|'shot'}, ...]
let timerInterval = null; // handle pro setInterval live timeru
let stornoTimer   = null; // handle pro 10s storno timeout

const LS_KEY = 'alcopilot-session';

const DRINK_ICONS = {
  beer: 'icons/beer.png',
  wine: 'icons/wine.png',
  shot: 'icons/shot.png',
};

/* ============================================================
   Helpers
   ============================================================ */
function formatTime(date) {
  return date.toLocaleTimeString('cs-CZ', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDuration(ms) {
  const totalMinutes = Math.floor(ms / 60000);
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours   = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours} hod ${minutes} min`;
}

function elapsedText(fromTs) {
  const ms = Date.now() - fromTs;
  if (ms < 60000) return '< 1 min';
  return formatDuration(ms);
}

/** Povolí Storno na zadanou dobu, poté ho deaktivuje */
function enableStornoTemporarily(duration = 10000) {
  if (stornoTimer !== null) clearTimeout(stornoTimer);
  els.btnRemove.disabled = false;
  stornoTimer = setTimeout(() => {
    els.btnRemove.disabled = true;
    stornoTimer = null;
  }, duration);
}

function cancelStornoTimer() {
  if (stornoTimer !== null) {
    clearTimeout(stornoTimer);
    stornoTimer = null;
  }
}

/* ============================================================
   Persistence
   ============================================================ */
function saveSession() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(timestamps));
  } catch {
    // quota exceeded nebo private mode bez storage — ignorovat
  }
}

function loadSession() {
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        // Migrace: starý formát (plain numbers) → nový formát ({ts, type})
        timestamps = parsed.map((entry) =>
          typeof entry === 'number' ? { ts: entry, type: 'beer' } : entry
        );
      }
    }
  } catch {
    timestamps = [];
  }
}

/* ============================================================
   Chart render
   ============================================================ */
function renderChart() {
  // Potřebujeme alespoň 2 záznamy → 1 dokončený interval
  // Poslední záznam NEZOBRAZUJEME — jeho doba konzumace ještě běží
  if (timestamps.length < 2) {
    els.chartSection.hidden = true;
    return;
  }
  els.chartSection.hidden = false;

  // Dokončené doby: timestamps[0..n-2], interval vždy do následujícího
  const bars = [];
  for (let i = 0; i < timestamps.length - 1; i++) {
    bars.push({
      index: i + 1,
      type:  timestamps[i].type,
      ms:    timestamps[i + 1].ts - timestamps[i].ts,
    });
  }

  // SVG layout
  const VW = 320;
  const VH = 160;
  const PAD = { top: 10, right: 16, bottom: 28, left: 36 };
  const plotW = VW - PAD.left - PAD.right;
  const plotH = VH - PAD.top  - PAD.bottom;

  // Osa Y — zaokrouhlení maxima na nejbližší vyšší násobek 5 minut
  const maxMs  = Math.max(...bars.map(b => b.ms));
  const maxMin = Math.ceil(maxMs / 60000 / 5) * 5 || 5;

  // Pomocníci
  const toY  = (ms) => PAD.top + plotH - (ms / (maxMin * 60000)) * plotH;
  const barW = Math.min((plotW / bars.length) * 0.65, 40);
  const slot = plotW / bars.length;

  // SVG namespace
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs = {}) => {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  };

  const svg = els.chart;
  const _style = getComputedStyle(document.documentElement);
  const colorBorder        = _style.getPropertyValue('--border').trim()         || '#2a2a5a';
  const colorTextSecondary = _style.getPropertyValue('--text-secondary').trim() || '#8888aa';
  const colorBar           = _style.getPropertyValue('--color-chart-bar').trim() || '#f5a800';

  svg.innerHTML = '';

  // Přístupnost: <title> se souhrnem dat pro screen readery
  const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
  titleEl.textContent = 'Graf doby konzumace: ' +
    bars.map(b => `nápoj ${b.index}: ${Math.round(b.ms / 60000)} min`).join(', ');
  svg.appendChild(titleEl);

  // Gridlines + Y labels (0, 25%, 50%, 75%, 100% maxMin)
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(f * maxMin));
  for (const t of ticks) {
    const y = toY(t * 60000);
    // gridline
    svg.appendChild(mk('line', {
      x1: PAD.left, y1: y, x2: PAD.left + plotW, y2: y,
      stroke: colorBorder, 'stroke-width': 1,
    }));
    // label
    const lbl = mk('text', {
      x: PAD.left - 4, y: y + 4,
      'text-anchor': 'end',
      'font-size': '9',
      fill: colorTextSecondary,
    });
    lbl.textContent = t < 60 ? `${t}m` : `${Math.floor(t/60)}h`;
    svg.appendChild(lbl);
  }

  // Bary + X labels
  for (let i = 0; i < bars.length; i++) {
    const b    = bars[i];
    const barH = (b.ms / (maxMin * 60000)) * plotH;
    const x    = PAD.left + slot * i + (slot - barW) / 2;
    const y    = toY(b.ms);

    svg.appendChild(mk('rect', {
      x, y,
      width:  barW,
      height: barH,
      fill:   colorBar,
      rx: 3, ry: 3,
    }));

    // X label (číslo nápoje)
    const lbl = mk('text', {
      x: x + barW / 2,
      y: VH - PAD.bottom + 12,
      'text-anchor': 'middle',
      'font-size': '9',
      fill: colorTextSecondary,
    });
    lbl.textContent = b.index;
    svg.appendChild(lbl);
  }
}

/* ============================================================
   Log render
   ============================================================ */
function renderLog() {
  // Zrušit předchozí live timer
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  els.logBody.innerHTML = '';
  if (timestamps.length === 0) return;

  // Iterujeme od nejnovějšího (konec pole) k nejstaršímu
  for (let i = timestamps.length - 1; i >= 0; i--) {
    const entry    = timestamps[i];
    const isNewest = (i === timestamps.length - 1);
    const tr       = document.createElement('tr');

    // Sloupec #
    const tdNum = document.createElement('td');
    tdNum.textContent = i + 1;
    tr.appendChild(tdNum);

    // Sloupec Nápoj (ikona)
    const tdDrink = document.createElement('td');
    tdDrink.style.textAlign = 'center';
    const icon = document.createElement('img');
    icon.src       = DRINK_ICONS[entry.type] || '';
    icon.alt       = entry.type;
    icon.className = 'log-drink-icon';
    tdDrink.appendChild(icon);
    tr.appendChild(tdDrink);

    // Sloupec Čas
    const tdTime = document.createElement('td');
    tdTime.textContent = formatTime(new Date(entry.ts));
    tr.appendChild(tdTime);

    // Sloupec Doba konzumace
    const tdDur = document.createElement('td');
    if (isNewest) {
      // Živý timer — aktualizuje se každých 60s
      tdDur.textContent = elapsedText(entry.ts);
      timerInterval = setInterval(() => {
        tdDur.textContent = elapsedText(entry.ts);
      }, 60000);
    } else {
      // Statický interval do dalšího SAJ
      tdDur.textContent = formatDuration(timestamps[i + 1].ts - entry.ts);
    }
    tr.appendChild(tdDur);

    els.logBody.appendChild(tr);
  }
}

/* ============================================================
   Render
   ============================================================ */
function render() {
  // Counter
  els.count.textContent = timestamps.length;

  // Storno disabled state — timer řídí povolení, zde jen zajistíme disabled při prázdné session
  if (timestamps.length === 0) {
    cancelStornoTimer();
    els.btnRemove.disabled = true;
  }

  // Session start time
  if (timestamps.length > 0) {
    const start = new Date(timestamps[0].ts);
    els.startTime.textContent = formatTime(start);
    els.startTime.setAttribute('datetime', start.toISOString());
    els.sessionStart.hidden = false;
  } else {
    els.sessionStart.hidden = true;
  }

  // Chart + Log
  renderChart();
  renderLog();
}

/* ============================================================
   Event handlers
   ============================================================ */
function addSaj(type) {
  timestamps.push({ ts: Date.now(), type });
  navigator.vibrate?.(50);
  render();
  saveSession();
  enableStornoTemporarily();
}

function removeSaj() {
  if (timestamps.length === 0) return;
  timestamps.pop();
  render();
  saveSession();
  // Po stornování: pokud je poslední záznam stále v 10s okně, povolíme Storno na zbývající čas
  if (timestamps.length > 0) {
    const elapsed = Date.now() - timestamps[timestamps.length - 1].ts;
    if (elapsed < 10000) {
      enableStornoTemporarily(10000 - elapsed);
    }
  }
}

function resetSession() {
  if (timestamps.length === 0) return;
  if (!confirm('Opravdu ukončit drinking session? Tuto akci nelze vrátit.')) return;
  timestamps = [];
  localStorage.removeItem(LS_KEY);
  els.chartSection.hidden = true;
  render();
}

/* ============================================================
   Init
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  loadSession();
  els.btnBeer.addEventListener('click', () => addSaj('beer'));
  els.btnWine.addEventListener('click', () => addSaj('wine'));
  els.btnShot.addEventListener('click', () => addSaj('shot'));
  els.btnRemove.addEventListener('click', removeSaj);
  els.btnReset.addEventListener('click', resetSession);
  els.infoVersion.textContent = APP_VERSION;
  els.btnInfo.addEventListener('click', () => els.infoDialog.showModal());
  els.btnInfoClose.addEventListener('click', () => els.infoDialog.close());
  els.infoDialog.addEventListener('click', (e) => {
    if (e.target === els.infoDialog) els.infoDialog.close();
  });
  render();

  // Po načtení: pokud je poslední záznam < 10s starý, povolit Storno na zbývající čas
  if (timestamps.length > 0) {
    const elapsed = Date.now() - timestamps[timestamps.length - 1].ts;
    if (elapsed < 10000) {
      enableStornoTemporarily(10000 - elapsed);
    }
  }

  // Service Worker registrace + auto-refresh při update
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then((reg) => {
      reg.addEventListener('updatefound', () => {
        const newSW = reg.installing;
        newSW.addEventListener('statechange', () => {
          // Nový SW aktivní a stránka už měla předchozí SW → reload pro čerstvé soubory
          if (newSW.state === 'activated' && navigator.serviceWorker.controller) {
            window.location.reload();
          }
        });
      });
    }).catch(() => {});
  }
});
