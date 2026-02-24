# Changelog — Alcopilot

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] — 2026-02-24

### Fixed

- Resolve documentation inconsistencies across all markdown files
- Fix version bump workflow sw.js template string interpolation bug
- Remove broken automated version-bump workflow (replaced with manual process)

### Technical

- Add manual versioning guidelines and release workflow to CLAUDE.md
- Add CHANGELOG.md with Keep a Changelog format
- Add devlog DEN 6 entry (versioning & release infrastructure overhaul)
- Update CLAUDE.md Key Implementation Details to reflect current UI
- Add historical note to SPEC.md clarifying it describes original MVP plan
- Remove orphaned `cliff.toml`

---

## [1.0.0] — 2026-02-24

### Added

- **PWA Support** — Service Worker caches static assets for offline access; installable on iOS/Android
- **SAJ Tracking** — Track alcohol consumption in standard units (SAJ = 10g ethanol)
- **Drink Types** — Three preset buttons: pivo (beer), víno (wine), panák (shot)
- **Session Log** — Chronological table showing drink times and consumption intervals
- **Live Timer** — Real-time elapsed time since last drink (updates every 60 seconds)
- **Duration Chart** — Bar chart visualization of time intervals between drinks
- **Haptic Feedback** — Vibration on Android when adding SAJ
- **Persistent Storage** — Session data saved to localStorage with auto-restore on reload
- **Info Dialog** — App version display in header
- **Responsive Design** — Optimized for mobile, tablet, desktop browsers

### Technical

- **Zero Dependencies** — Vanilla HTML/CSS/JavaScript, no framework required
- **No Build Step** — Direct static file deployment to GitHub Pages
- **Accessibility** — WCAG 2.1 compliant (80px drink buttons, 44px info button, aria-labels, keyboard support)
- **Dark Theme** — Eye-friendly dark mode with CSS variables
- **PWA Manifest** — Installable as standalone app with custom splash screen

### Fixed

- Relative paths for GitHub Pages compatibility
- PWA icon sizing and home screen appearance
- Drink button overflow on mobile
- Keyboard focus styles and outline management

### Notes

- Initial release includes MVP feature set (8 issues resolved)
- Manual versioning approach (no automated CI/CD bumping)
- See [`SPEC.md`](SPEC.md) for full feature specification
- See [`docs/devlog.md`](docs/devlog.md) for development journey

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| [1.0.1] | 2026-02-24 | Documentation fixes, versioning infrastructure |
| [1.0.0] | 2026-02-24 | Initial stable release |

[1.0.1]: https://github.com/miromar2022/alcopilot/releases/tag/v1.0.1
[1.0.0]: https://github.com/miromar2022/alcopilot/releases/tag/v1.0.0
