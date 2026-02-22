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
let timestamps = [];

/* ============================================================
   Helpers
   ============================================================ */
function formatTime(date) {
  return date.toLocaleTimeString('cs-CZ', {
    hour: '2-digit',
    minute: '2-digit',
  });
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

  // Log body — clear (full rendering in Issue #4)
  els.logBody.innerHTML = '';
}

/* ============================================================
   Event handlers
   ============================================================ */
function addSaj() {
  timestamps.push(Date.now());
  render();
}

function removeSaj() {
  if (timestamps.length === 0) return;
  timestamps.pop();
  render();
}

function resetSession() {
  if (timestamps.length === 0) return;
  if (!confirm('Opravdu ukončit drinking session? Tato akce nelze vrátit.')) return;
  timestamps = [];
  render();
}

/* ============================================================
   Init
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  els.btnAdd.addEventListener('click', addSaj);
  els.btnRemove.addEventListener('click', removeSaj);
  els.btnReset.addEventListener('click', resetSession);
  render();
});
