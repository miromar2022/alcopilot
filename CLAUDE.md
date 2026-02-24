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

Testing is manual — Android Chrome, iOS Safari, desktop Chrome/Firefox, Lighthouse PWA audit.

## Architecture

Single-page app with no framework. All files are static assets deployed to GitHub Pages from `main`.

| File | Purpose |
|------|---------|
| `index.html` | App shell and UI markup |
| `style.css` | All styling (no framework) |
| `app.js` | All application logic |
| `sw.js` | Service Worker — caches static assets for offline use |
| `manifest.json` | PWA manifest (name, icons, `display: standalone`) |
| `CHANGELOG.md` | Release history (Keep a Changelog format) |
| `icons/` | PWA icons (`icon-192.png`, `icon-512.png`) + drink icons (`beer.png`, `wine.png`, `shot.png`) |

**State management:** All session state lives in `localStorage`. On load, restore from `localStorage`; on Reset (after confirmation dialog), wipe `localStorage`.

**Session data structure:** The app stores a list of SAJ timestamps. The SAJ count is derived from `timestamps.length`. On `− SAJ`, pop the last timestamp. Intervals are computed on render from adjacent timestamps.

## Key Implementation Details

- **Drink buttons** (beer, wine, shot): three 80×80 px icon buttons, each adds a timestamped SAJ entry with drink type, calls `navigator.vibrate(50)` if available
- **Storno button**: removes last SAJ entry; enabled for 10 seconds after adding a drink, then auto-disables
- **Reset button**: shows confirmation `"Opravdu ukončit drinking session? Tuto akci nelze vrátit."` before clearing
- **Live timer**: most recent entry shows elapsed time since last SAJ, updated every 60 seconds; displays `< 1 min` when under 60 seconds
- **Doba konzumace**: each entry shows time from that SAJ until the next one (`X min` or `X hod Y min`); most recent entry shows live timer instead
- **Duration chart**: horizontal bar chart above the log table, visualizing time intervals between drinks
- **Info dialog**: `<dialog>` element in header (ℹ SVG icon), shows app version only; closes via button, backdrop click, or Escape
- **Log order**: newest entries first, includes drink type icon column
- **Tap targets**: drink buttons 80×80 px (exceeds 64 px minimum); info button 44×44 px (WCAG 2.1 minimum)

## Git Workflow

- `main` is protected — all changes via PR, no direct push
- Branch naming: `feature/<name>`, `fix/<name>`, `chore/<name>`
- Commit style: [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `chore:`, `docs:`

## Versioning

**Current version: 1.0.1** (in `app.js`, `manifest.json`, `sw.js`)

**When to bump version:**
- `feat:` → minor bump (1.0.0 → 1.1.0)
- `fix:` → patch bump (1.0.0 → 1.0.1)
- `BREAKING CHANGE` in commit body → major bump (1.0.0 → 2.0.0)

**Version bump checklist (after PR merge):**
1. Update `app.js` — `const APP_VERSION = 'X.Y.Z'`
2. Update `manifest.json` — `"version": "X.Y.Z"`
3. Update `sw.js` — `const CACHE_NAME = 'alcopilot-vX.Y.Z'`
4. Create commit: `chore: bump version to X.Y.Z`
5. Create git tag: `git tag vX.Y.Z && git push --tags`

**⚠️ Claude: Ask about versioning!**
After merging a PR with `feat:` or `fix:` commits, check if a version bump is appropriate:
- If it's a meaningful user-facing change → suggest bump
- Ask: _"Should I bump the version and update app.js, manifest.json, sw.js?"_
- User answers yes/no/what version
- If yes → proceed with full release workflow (see Release Workflow below)

## Release Workflow

**After user confirms version bump (e.g., 1.0.0 → 1.1.0):**

1. **Update version in three files:**
   ```bash
   # app.js line 3
   const APP_VERSION = '1.1.0'

   # manifest.json line 3
   "version": "1.1.0"

   # sw.js line 3
   const CACHE_NAME = 'alcopilot-v1.1.0'
   ```

2. **Generate CHANGELOG entry manually:**
   - Collect commits since last tag: `git log v1.0.0..HEAD --oneline`
   - Categorize by type:
     - **Added** — `feat:` commits (user-facing features)
     - **Fixed** — `fix:` commits (bug fixes)
     - **Technical** — `refactor:`, infrastructure changes
   - Update `CHANGELOG.md` — prepend new version section with date and bullet points
   - Format: Keep a Changelog style (see existing `CHANGELOG.md`)

3. **Create release commit:**
   ```bash
   git add app.js manifest.json sw.js CHANGELOG.md
   git commit -m "chore: bump version to 1.1.0"
   ```

4. **Tag and push:**
   ```bash
   git tag v1.1.0
   git push && git push --tags
   ```

5. **Create GitHub Release:**
   ```bash
   gh release create v1.1.0 \
     --title "v1.1.0 — [Feature Name]" \
     --notes "$(git log v1.0.0..v1.1.0 --oneline | sed 's/^/- /')"
   ```
   - Or manually extract key features from CHANGELOG.md
   - Add emoji headers and formatting for readability

**Example Release Notes:**
```
v1.1.0 — Duration Chart Visualization

## Features
- 📊 Bar chart showing time intervals between drinks
- ⏱️ Better visual understanding of drinking pace

## Fixes
- Fixed timing calculation for long sessions
- Improved chart responsiveness on mobile

See [CHANGELOG.md](CHANGELOG.md) for full details.
```

**Why manual (not git-cliff)?**
- `git-cliff` requires Rust binary installation
- Indie projects benefit from handcrafted release notes
- Gives opportunity to highlight key features for users
- Links PR/issue context directly
