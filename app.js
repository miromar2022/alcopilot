'use strict';

/* ============================================================
   DOM references
   ============================================================ */
const $ = (id) => document.getElementById(id);

const els = {
  count:        $('saj-count'),
  sessionStart: $('session-start'),
  startTime:    $('session-start-time'),
  btnAdd:       $('btn-add'),
  btnRemove:    $('btn-remove'),
  btnReset:     $('btn-reset'),
  logBody:      $('log-body'),
};

/* ============================================================
   State
   ============================================================ */
let timestamps    = [];
let timerInterval = null;   // handle pro setInterval live timeru

const LS_KEY = 'alcopilot-session';

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
      if (Array.isArray(parsed)) timestamps = parsed;
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
    const isNewest = (i === timestamps.length - 1);
    const tr = document.createElement('tr');

    // Sloupec #
    const tdNum = document.createElement('td');
    tdNum.textContent = i + 1;
    tr.appendChild(tdNum);

    // Sloupec Čas
    const tdTime = document.createElement('td');
    tdTime.textContent = formatTime(new Date(timestamps[i]));
    tr.appendChild(tdTime);

    // Sloupec Doba konzumace
    const tdDur = document.createElement('td');
    if (isNewest) {
      // Živý timer — aktualizuje se každých 60s
      tdDur.textContent = elapsedText(timestamps[i]);
      timerInterval = setInterval(() => {
        tdDur.textContent = elapsedText(timestamps[i]);
      }, 60000);
    } else {
      // Statický interval do dalšího SAJ
      tdDur.textContent = formatDuration(timestamps[i + 1] - timestamps[i]);
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

  // − SAJ disabled state
  els.btnRemove.disabled = timestamps.length === 0;

  // Session start time
  if (timestamps.length > 0) {
    const start = new Date(timestamps[0]);
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
function addSaj() {
  timestamps.push(Date.now());
  navigator.vibrate?.(50);
  render();
  saveSession();
}

function removeSaj() {
  if (timestamps.length === 0) return;
  timestamps.pop();
  render();
  saveSession();
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
  els.btnAdd.addEventListener('click', addSaj);
  els.btnRemove.addEventListener('click', removeSaj);
  els.btnReset.addEventListener('click', resetSession);
  render();

  // Service Worker registrace
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
});
