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

**Current version: 1.0.4** (in `app.js`, `manifest.json`, `sw.js`)

**When to bump version:**
- `feat:` → minor bump (1.0.0 → 1.1.0)
- `fix:` → patch bump (1.0.0 → 1.0.1)
- `BREAKING CHANGE` in commit body → major bump (1.0.0 → 2.0.0)

**Version bump checklist (after PR merge):**
1. Update `app.js` — `const APP_VERSION = 'X.Y.Z'`
2. Update `manifest.json` — `"version": "X.Y.Z"`
3. Update `sw.js` — `const CACHE_NAME = 'alcopilot-vX.Y.Z'`
4. Update `CHANGELOG.md` — add new version section with date and entries
5. Create commit: `chore: bump version to X.Y.Z`
6. Create git tag: `git tag vX.Y.Z && git push --tags`
7. **Create GitHub Release** (MANDATORY): `gh release create vX.Y.Z --title "..." --notes "..."` → copy **publishedAt timestamp** for step 8
8. Update `app.js` — `const RELEASE_DATE = new Date('YYYY-MM-DDTHH:MM:SSZ')` (use publishedAt from GitHub release)

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

5. **Create GitHub Release (MANDATORY):**
   ```bash
   gh release create v1.1.0 \
     --title "v1.1.0 — [Feature Name]" \
     --notes "$(cat <<'EOF'
## Summary
- ✨ Feature 1 (from CHANGELOG Added section)
- 🐛 Fix 1 (from CHANGELOG Fixed section)

See [CHANGELOG.md](docs/CHANGELOG.md) for full details.
EOF
   )"
   ```
   - ⚠️ **REQUIRED:** Every git tag must have a GitHub Release
   - Extract summary from CHANGELOG.md (Added/Fixed/Technical sections)
   - Add emoji headers for readability
   - Link to CHANGELOG.md for full details

**Example Release Notes (from CHANGELOG):**
```
## Summary
- ✨ Bar chart visualization of drink intervals
- 🐛 Fixed timing calculation for long sessions
- 🧹 Code cleanup and performance improvements

See [CHANGELOG.md](docs/CHANGELOG.md) for full details.
```

**Checklist for release creation:**
- [ ] Tag created and pushed (`git tag v1.1.0 && git push --tags`)
- [ ] GitHub Release created with `gh release create`
- [ ] Release title includes version and feature highlight (e.g., `v1.1.0 — Duration Chart`)
- [ ] Release notes include relevant sections from CHANGELOG
- [ ] Emoji headers used for visual clarity
- [ ] Link to CHANGELOG.md included

**Why manual (not automated)?**
- Indie/craft development — transparent, controllable, reliable
- Developer consciously decides when to release
- Release notes are handcrafted, not auto-generated
- Every version gets proper documentation
