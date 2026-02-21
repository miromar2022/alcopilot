# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Alcopilot** is a Czech-language PWA for tracking alcohol consumption in SAJ units (standardní alkoholická jednotka) during a drinking session. Full specification is in `SPEC.md`.

## Development

**No build step, no dependencies, no package manager.** Directly edit `index.html`, `style.css`, `app.js`, `sw.js`.

Serve locally with any HTTP server (required for Service Worker to function):
```sh
python3 -m http.server 8080
# or
npx serve .
```

Testing is manual — see `GITHUB_ISSUES.md` Issue #8 for the QA checklist (Android Chrome, iOS Safari, desktop Chrome/Firefox, Lighthouse PWA audit).

## Architecture

Single-page app with no framework. All files are static assets deployed to GitHub Pages from `main`.

| File | Purpose |
|------|---------|
| `index.html` | App shell and UI markup |
| `style.css` | All styling (no framework) |
| `app.js` | All application logic |
| `sw.js` | Service Worker — caches static assets for offline use |
| `manifest.json` | PWA manifest (name, icons, `display: standalone`) |
| `icons/` | `icon-192.png` and `icon-512.png` |

**State management:** All session state lives in `localStorage`. On load, restore from `localStorage`; on Reset (after confirmation dialog), wipe `localStorage`.

**Session data structure:** The app stores a list of SAJ timestamps. The SAJ count is derived from `timestamps.length`. On `− SAJ`, pop the last timestamp. Intervals are computed on render from adjacent timestamps.

## Key Implementation Details

- **`+ SAJ` button**: adds timestamp, calls `navigator.vibrate(50)` if available, updates UI
- **`− SAJ` button**: removes last timestamp, disabled when count = 0
- **Reset button**: shows confirmation `"Opravdu ukončit drinking session? Tato akce nelze vrátit."` before clearing
- **Live timer**: most recent entry shows elapsed time since last SAJ, updated every 60 seconds; displays `< 1 min` when under 60 seconds
- **Doba konzumace**: each entry shows time from that SAJ until the next one (`X min` or `X hod Y min`); most recent entry shows live timer instead
- **Log order**: newest entries first
- **Tap targets**: `+ SAJ` and `− SAJ` buttons must be at minimum **64×64 px**

## Git Workflow

- `main` is protected — all changes via PR, no direct push
- Branch naming: `feature/<name>`, `fix/<name>`, `chore/<name>`
- Commit style: [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `chore:`, `docs:`
