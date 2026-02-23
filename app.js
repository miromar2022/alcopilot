'use strict';

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
  logBody:      $('log-body'),
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

  // Log
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
  render();

  // Po načtení: pokud je poslední záznam < 10s starý, povolit Storno na zbývající čas
  if (timestamps.length > 0) {
    const elapsed = Date.now() - timestamps[timestamps.length - 1].ts;
    if (elapsed < 10000) {
      enableStornoTemporarily(10000 - elapsed);
    }
  }

  // Service Worker registrace
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
});
