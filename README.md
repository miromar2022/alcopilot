# Alcopilot

**PWA pro sledování alkoholu v SAJ jednotkách během drinking session.**

Zaznamenává časy konzumace, počítá standardní alkoholické jednotky (SAJ) a zobrazuje doby mezi jednotlivými nápoji.

**Živá aplikace:** https://miromar2022.github.io/alcopilot/

## ✨ Features

- **+ SAJ / − SAJ** – Přidej/odeber pivo, víno, panák jedním tapem
- **Časový log** – Tabulka s časy, nápoji a dobami konzumace
- **Počítadlo** – Reálný čas od začátku session
- **Live timer** – Aktualizuje se každých 60 sekund pro poslední položku
- **Info ikona** – Zobrazí verzi aplikace
- **Persistent storage** – Data jsou uložena v localStorage, reload zachová session
- **Offline režim** – Service Worker cachuje assets pro práci bez internetu
- **Responsive design** – Optimalizováno pro mobil, tablet, desktop
- **PWA** – Lze přidat na homescreen (Android + iOS)

## Tech stack

Vanilla HTML/CSS/JS **bez frameworku, bez závislostí, bez build kroku.**

- `index.html` – App shell + UI
- `style.css` – Dark theme styling (CSS variables)
- `app.js` – Logika (257 řádků)
- `sw.js` – Service Worker pro offline + caching
- `manifest.json` – PWA metadata

## Quick start

**Vývoj (s HTTP server vyžadovaným pro SW):**
```bash
python3 -m http.server 8080
# nebo
npx serve .
```

Pak otevři **http://localhost:8080**

**Produkce:**
```bash
git push origin main
# Deploy → GitHub Pages (automatický via Actions)
```

## Vývoj

- Žádné build steps — edituj `index.html`, `style.css`, `app.js` přímo
- Testing: manuální QA (Android Chrome, iOS Safari, desktop browsers)
- Commit style: [Conventional Commits](https://www.conventionalcommits.org/) (feat:, fix:, chore:)
- Větve: `feature/*`, `fix/*`, `chore/*` — všechny skrz PR na `main`

**Specifikace & architektura:** viz [`CLAUDE.md`](CLAUDE.md) a [`SPEC.md`](SPEC.md)
