# Devlog — Alcopilot

Podrobný záznam dosavadní práce na projektu Alcopilot (PWA pro sledování konzumace alkoholu v SAJ jednotkách).


## DEN 1 (2026-02-21 - 2026-02-22)         


### 1. Přehled projektu

- **Repozitář:** [miromar2022/alcopilot](https://github.com/miromar2022/alcopilot)
- **Technologie:** Vanilla HTML/CSS/JS, žádný framework, žádný build step
- **Hosting:** GitHub Pages z větve `main`
- **Milestone:** MVP (8 issues)

---

### 2. Historie commitů (chronologicky)

| Commit | Zpráva | Větev | Poznámka |
|--------|--------|-------|----------|
| `16d50cf` | `chore: initialize project structure` | `main` | Inicializace projektu — index.html, style.css, app.js, SPEC.md, CLAUDE.md, icons, manifest.json |
| `c5bbe7b` | `docs: fix GitHub Pages URL in README` | `main` | Oprava odkazu na živou aplikaci |
| `1282e4b` | `chore: add .gitignore to exclude _dev/ directory` | `chore/add-dev-folder` | Přidán .gitignore s pravidlem `_dev/` |
| `9d2dc76` | `Merge pull request #9` | `main` | Merge PR #9 — .gitignore |
| `a448c18` | `feat: add basic UI layout (Issue #2)` | `feature/ui-layout` | HTML markup + kompletní CSS pro hlavní obrazovku |
| `217e462` | `chore: move GITHUB_ISSUES.md to _dev/` | `feature/ui-layout` | Přesun do _dev/, GitHub issues = single source of truth |
| `26f4376` | `fix: add keyboard focus styles and clarify magic number (PR #10 review)` | `feature/ui-layout` | Oprava a11y + CSS komentář k max-width: 412px |

---

### 3. Stav větví

#### Lokální větve

| Větev | Commit | Tracking | Stav |
|-------|--------|----------|------|
| `main` | `9d2dc76` | `origin/main` | Aktuální |
| `feature/ui-layout` **(HEAD)** | `26f4376` | `origin/feature/ui-layout` | **Ahead by 2 commits** (217e462, 26f4376 ještě nepushnuty) |
| `chore/add-dev-folder` | `1282e4b` | `origin/chore/add-dev-folder` | Mergnutá, lze smazat |

#### Vzdálené větve (origin)

| Větev | Commit | Poznámka |
|-------|--------|----------|
| `origin/main` | `9d2dc76` | Protected branch, aktuální |
| `origin/feature/ui-layout` | `a448c18` | Zastaralá — chybí 2 commity (217e462, 26f4376) |
| `origin/chore/add-dev-folder` | `1282e4b` | Mergnutá, stale |

#### Nepushnuté změny

Lokální `feature/ui-layout` je **2 commity před** `origin/feature/ui-layout`:
1. `217e462` — `chore: move GITHUB_ISSUES.md to _dev/`
2. `26f4376` — `fix: add keyboard focus styles and clarify magic number (PR #10 review)`

**Akce potřebná:** `git push` na `feature/ui-layout` pro synchronizaci.

---

### 4. Pull Requesty

| # | Název | Větev | Stav | Poznámka |
|---|-------|-------|------|----------|
| **#9** | chore: add .gitignore to exclude _dev/ directory | `chore/add-dev-folder` | **MERGED** (2026-02-21) | Přidání .gitignore |
| **#10** | feat: basic UI layout (Issue #2) | `feature/ui-layout` | **OPEN** | Implementace Issue #2, 6 review komentářů od Copilota — vyhodnoceny a zodpovězeny |

#### PR #10 — Review komentáře Copilota (vyhodnocení)

| # | Komentář | Verdikt | Stav |
|---|----------|---------|------|
| 1 | `<time>` element — chybí `datetime` atribut | Odloženo na Issue #3 | Odpovězeno v PR |
| 2 | Nekonzistentní whitespace v atributech tlačítek | Zamítnuto — záměrné zarovnání | Odpovězeno v PR |
| 3 | Chybí focus styly pro klávesnici | **Opraveno** (commit `26f4376`) | Odpovězeno v PR |
| 4 | `max-width: 412px` — magické číslo | Zamítnuto — přidán vysvětlující komentář | Odpovězeno v PR |
| 5 | `tbody:empty::after` — cross-browser spolehlivost | Odloženo na QA (Issue #8) | Odpovězeno v PR |
| 6 | Konflikt `:nth-child(odd)` a `:first-child` | Zamítnuto — záměrný design | Odpovězeno v PR |

---

### 5. GitHub Issues (MVP Milestone)

| # | Název | Label | Stav | Poznámka |
|---|-------|-------|------|----------|
| #1 | Inicializace projektu a GitHub Pages | `chore` | **CLOSED** | Hotovo — repo, Pages, ikony, základní soubory |
| #2 | Základní UI layout | `feature` | **OPEN** | V práci — PR #10 otevřen, HTML/CSS hotovo, čeká na merge |
| #3 | Session management a počítadlo SAJ | `feature` | OPEN | Čeká na implementaci — app.js logika |
| #4 | Časový log | `feature` | OPEN | Čeká — záznamy s timestampy a doby konzumace |
| #5 | Perzistence (localStorage) | `feature` | OPEN | Čeká — ukládání session do localStorage |
| #6 | Haptická zpětná vazba | `feature` | OPEN | Čeká — navigator.vibrate(50) |
| #7 | PWA (manifest + service worker) | `feature` | OPEN | Čeká — sw.js, offline podpora |
| #8 | QA a finální review | `chore` | OPEN | Čeká — testování na zařízeních, Lighthouse audit |

**Postup MVP: 1/8 uzavřen, 1/8 v práci (PR otevřen), 6/8 čeká.**

---

### 6. Struktura souborů (aktuální lokální stav)

```
alcopilot/
├── .claude/                    # Nesledováno Gitem
│   ├── launch.json             # Dev server konfigurace (node HTTP na portu 8080)
│   └── settings.local.json     # Lokální nastavení Claude Code
├── .git/
├── .gitignore                  # Obsahuje: _dev/
├── _dev/                       # Ignorováno Gitem — interní dokumenty
│   ├── GITHUB_ISSUES.md        # Přesunut z kořene (commit 217e462)
│   ├── issue-2-plan.md         # Plán implementace Issue #2
│   └── README.md               # Popis složky
├── docs/
│   └── devlog.md               # <-- Tento soubor
├── icons/
│   ├── icon-192.png            # PWA ikona 192×192
│   └── icon-512.png            # PWA ikona 512×512
├── app.js                      # Aplikační logika (zatím jen 'use strict')
├── CLAUDE.md                   # Instrukce pro Claude Code
├── index.html                  # App shell — header, counter, controls, log table
├── README.md                   # Popis projektu
├── SPEC.md                     # Kompletní specifikace aplikace
└── style.css                   # Veškeré styly (275 řádků, dark theme, responsive)
```

#### Soubory sledované Gitem vs. lokální

| Soubor/složka | V Gitu | Lokálně | Poznámka |
|---------------|--------|---------|----------|
| `index.html` | ✅ | ✅ | HTML markup s app shell |
| `style.css` | ✅ | ✅ | Lokálně novější (+focus-visible, +komentář) |
| `app.js` | ✅ | ✅ | Jen `'use strict'` — logika bude v Issue #3+ |
| `CLAUDE.md` | ✅ | ✅ | Instrukce pro AI |
| `SPEC.md` | ✅ | ✅ | Specifikace aplikace |
| `README.md` | ✅ | ✅ | Popis projektu |
| `.gitignore` | ✅ | ✅ | Pravidlo `_dev/` |
| `icons/` | ✅ | ✅ | 192px + 512px ikony |
| `_dev/` | ❌ (.gitignore) | ✅ | Interní docs, plány |
| `.claude/` | ❌ (untracked) | ✅ | Launch config, local settings |
| `docs/devlog.md` | ❌ (nový) | ✅ | Tento soubor — ještě necommitnut |

---

### 7. Technické detaily implementace

#### index.html (Issue #2)
- Sémantický HTML5 s `aria-label` a `aria-live` atributy
- App shell: `.app-shell` > `header` + `main`
- Counter section: velké číslo SAJ s labelem
- Controls: `+ SAJ` (červené), `− SAJ` (modré, disabled při 0), `Reset` (šedé)
- Log table s hlavičkou (#, Čas, Doba konzumace) a `tbody:empty::after` placeholder
- `<time>` element pro session start (bude naplněn v Issue #3)

#### style.css (Issue #2 + PR review fix)
- CSS custom properties (dark theme: `--bg: #1a1a2e`, `--surface: #16213e`, atd.)
- Responzivní: mobile-first, landscape media query (max-height 500px), desktop (min-width 1024px)
- Tap target: minimum 64×64px (`--tap-target: 64px`) na `+ SAJ` a `− SAJ`
- Counter: `font-size: clamp(5rem, 20vw, 8rem)` — škáluje se podle viewportu
- Focus-visible: `outline: 3px solid var(--accent-plus)` s `outline-offset: 3px`
- Reset button max-width: 412px (= 200px + 200px + 12px gap — šířka řady primárních tlačítek)

#### app.js
- Zatím jen `'use strict'` — veškerá logika bude implementována v Issue #3–#6

---

### 8. Co je potřeba udělat dál

#### Okamžité kroky
1. **Push** nepushnutých commitů na `feature/ui-layout` (2 commity)
2. **Merge PR #10** po push — uzavře Issue #2
3. **Začít Issue #3** — Session management a počítadlo SAJ (app.js)

#### Plán implementace (zbývající issues)
1. **Issue #3** — Session management: +SAJ/-SAJ/Reset logika, timestamps, session start
2. **Issue #4** — Časový log: renderování tabulky, doby konzumace, živý timer
3. **Issue #5** — Perzistence: localStorage save/restore/clear
4. **Issue #6** — Haptická zpětná vazba: navigator.vibrate(50)
5. **Issue #7** — PWA: manifest.json dokončení, sw.js cache strategie
6. **Issue #8** — QA: cross-browser testing, Lighthouse audit

---

### 9. Známé problémy a technický dluh

| Problém | Priorita | Kdy řešit |
|---------|----------|-----------|
| `<time>` element bez `datetime` atributu | Nízká | Issue #3 (spolu s JS logikou) |
| `tbody:empty::after` cross-browser quirks | Nízká | Issue #8 (QA) |
| `manifest.json` nekompletní | Střední | Issue #7 |
| `sw.js` neexistuje | Střední | Issue #7 |
| `app.js` prázdný | Vysoká | Issue #3 (další v pořadí) |
| Stale branch `chore/add-dev-folder` | Nízká | Smazat po úklidu |
