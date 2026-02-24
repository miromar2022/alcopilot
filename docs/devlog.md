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

---

## DEN 2 (2026-02-22)

### 1. Shrnutí

Dokončena veškerá aplikační logika. Issues #3–#6 implementovány a mergnuty do `main`. `app.js` je plně funkční — session management, časový log, perzistence, haptika. MVP je ze 6/8 issues hotovo, zbývá pouze Issue #7 (PWA) a Issue #8 (QA).

---

### 2. Provedené práce

#### PR review — PR #10 (UI layout)
- 6 komentářů od Copilot AI vyhodnoceno a zodpovězeno přímo v PR
- **Opraveno:** chybějící `:focus-visible` styly na tlačítkách (a11y, commit `26f4376`)
- **Zamítnuto:** whitespace zarovnání (záměrné), nth-child konflikt (záměrný design)
- **Odloženo:** `<time datetime>` na Issue #3, `tbody:empty` na QA

#### Organizace repozitáře
- `GITHUB_ISSUES.md` přesunut do `_dev/` — GitHub issues jsou single source of truth (commit `217e462`)
- Ověřeno: všech 8 issues existuje na GitHubu se správným obsahem, labels a milestony
- Issue #2 uzavřen ručně (PR #10 neměl `Closes #2` v popisu)
- Dev server nakonfigurován přes `.claude/launch.json` (node HTTP server, port 8080)
- `docs/devlog.md` vytvořen jako podrobný záznam práce

#### Issue #3 — Session management (PR #11, commit `6bd8524`)
- Implementován celý `app.js` od základu
- `timestamps[]` array jako datová struktura (epoch ms)
- `addSaj()` / `removeSaj()` / `resetSession()` s confirmation dialogem
- Session start time zobrazen při prvním SAJ (`<time datetime="">` s ISO 8601)
- `−SAJ` disabled při count = 0
- Confirm text: *"Opravdu ukončit drinking session? Tuto akci nelze vrátit."*

#### Issue #4 — Časový log (PR #12, commit `14da0aa`)
- `renderLog()` — iterace od nejnovějšího záznamu (konec pole) k nejstaršímu
- Číslování: SAJ #N = index+1, nejnovější nahoře
- "Doba konzumace" = interval od tohoto SAJ do dalšího (`formatDuration(ms)`)
- Formáty: `X min` (< 60 min) / `X hod Y min` (≥ 60 min)
- Živý timer u posledního záznamu: `elapsedText()` aktualizovaný každých 60s přes `setInterval`
- `< 1 min` v prvních 60 sekundách
- `clearInterval` při každém re-renderu — žádný setInterval leak

#### Issue #5 + #6 — Perzistence + Haptika (PR #13, commit `ef4e134`)
- `LS_KEY = 'alcopilot-session'` — namespaced klíč
- `saveSession()` — `JSON.stringify(timestamps)` po každé mutaci
- `loadSession()` — `JSON.parse` + `Array.isArray` validace při `DOMContentLoaded`
- Veškeré localStorage operace v `try-catch` (quota exceeded, private mode)
- Reset: `localStorage.removeItem(LS_KEY)` (ne `clear()` — nezasahuje do jiných dat)
- `navigator.vibrate?.(50)` v `addSaj()` — optional chaining, žádná chyba na desktopu

---

### 3. Aktuální stav `app.js` (po DEN 2)

```
app.js (~170 řádků)
├── DOM references (els object)
├── State: timestamps[], timerInterval, LS_KEY
├── Helpers: formatTime(), formatDuration(), elapsedText()
├── Persistence: saveSession(), loadSession()
├── Log render: renderLog() se setInterval live timerem
├── Render: render() — counter, session start, renderLog()
├── Event handlers: addSaj(), removeSaj(), resetSession()
└── Init: DOMContentLoaded → loadSession() → listenery → render()
```

---

### 4. Stav PRs a issues (konec DEN 2)

| PR | Větev | Stav | Issues |
|----|-------|------|--------|
| #9 | `chore/add-dev-folder` | ✅ MERGED | — |
| #10 | `feature/ui-layout` | ✅ MERGED | Closes #2 |
| #11 | `feature/session-management` | ✅ MERGED | Closes #3 |
| #12 | `feature/session-management` | ✅ MERGED | Closes #4 |
| #13 | `feature/persistence` | ✅ MERGED | Closes #5, #6 |

| Issue | Název | Stav |
|-------|-------|------|
| #1 | Inicializace | ✅ CLOSED |
| #2 | Základní UI layout | ✅ CLOSED |
| #3 | Session management | ✅ CLOSED |
| #4 | Časový log | ✅ CLOSED |
| #5 | Perzistence (localStorage) | ✅ CLOSED |
| #6 | Haptická zpětná vazba | ✅ CLOSED |
| #7 | PWA (manifest + service worker) | ✅ CLOSED |
| #8 | QA a finální review | 🔄 OPEN |

**MVP postup: 7/8 hotovo (87.5 %)**

---

### 5. Zbývající práce

#### Issue #8 — QA
- Android Chrome (fyzické zařízení / emulátor)
- iOS Safari (fyzické zařízení / simulátor)
- Desktop Chrome + Firefox
- Lighthouse PWA audit — žádné kritické chyby
- Ověřit všechna acceptance criteria #1–#7

---

### 6. Technický dluh (aktualizovaný)

| Problém | Priorita | Kdy řešit |
|---------|----------|-----------|
| `tbody:empty::after` cross-browser quirks | Nízká | Issue #8 (QA) |
| Stale branches (`chore/add-dev-folder`, `feature/ui-layout`, `feature/session-management`, `feature/persistence`, `feature/pwa`) | Nízká | Úklid po MVP |

---

## DEN 3 (2026-02-22 — pokračování)

### 1. Shrnutí

PR #14 (Issue #7 — PWA) úspěšně mergnuto uživatelem. `main` aktualizován na `5c907d1`. Issues #1–#7 všechny closed. Zbývá pouze Issue #8 (QA). MVP je 7/8 hotovo.

---

### 2. Stav `main` po PR #14

```
5c907d1  Merge pull request #14 from miromar2022/feature/pwa
80f0db5  feat: add PWA manifest and service worker (Issue #7)
96706c0  docs: update devlog with DEN 2 progress summary
57b81e7  Merge pull request #13 from miromar2022/feature/persistence
ef4e134  feat: add localStorage persistence and haptic feedback (Issue #5, #6)
4883d46  Merge pull request #12 from miromar2022/feature/session-management
14da0aa  feat: add time log with duration calculation (Issue #4)
349ff16  Merge pull request #11 from miromar2022/feature/session-management
ce57641  Update confirmation message in resetSession function
6bd8524  feat: add session management and SAJ counter (Issue #3)
```

#### Soubory v `main` (aktuálně)

| Soubor | Stav | Poznámka |
|--------|------|----------|
| `index.html` | ✅ Finální | Sémantický HTML, a11y atributy |
| `style.css` | ✅ Finální | Dark theme, responsive, focus-visible |
| `app.js` | ✅ Finální | 170 řádků — session, log, persistence, haptika, SW |
| `manifest.json` | ✅ Nový (PR #14) | name, standalone, theme-color, 2 ikony |
| `sw.js` | ✅ Nový (PR #14) | Cache-first, skipWaiting, clients.claim |
| `docs/devlog.md` | ✅ Tento soubor | Průběžně aktualizován |

---

### 3. Issue #7 — PWA (PR #14, commit `80f0db5`)

#### Co bylo implementováno

**`manifest.json`:**
- `name: "Alcopilot"`, `short_name: "Alcopilot"`
- `display: "standalone"` — spustí se bez adresního řádku
- `background_color` + `theme_color`: `#1a1a2e` (dark navy)
- 2 ikony: `icon-192.png` (192×192) + `icon-512.png` (512×512)

**`sw.js`:**
- `CACHE_NAME = 'alcopilot-v1'`
- Precache: `/`, `/index.html`, `/style.css`, `/app.js`, `/manifest.json`, `/icons/icon-192.png`, `/icons/icon-512.png`
- Install: `cache.addAll(ASSETS)` + `skipWaiting`
- Activate: smazat staré cache + `clients.claim`
- Fetch: cache-first → fallback na síť

**`app.js` — SW registrace:**
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
```
- Feature detection — žádná chyba na prohlížečích bez SW podpory

#### Ověření (preview_eval)
- ✅ Manifest načten (`document.querySelector('link[rel="manifest"]')`)
- ✅ SW zaregistrován (stav `activated`)
- ✅ Žádné JS chyby v konzoli

---

### 4. Zbývající práce — Issue #8 (QA)

Jediný zbývající issue pro uzavření MVP milestone.

#### Checklist (dle GITHUB_ISSUES.md)
- [ ] Android Chrome — fyzické zařízení nebo emulátor
- [ ] iOS Safari — fyzické zařízení nebo simulátor
- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Lighthouse PWA audit — Performance, Accessibility, PWA kategorie
- [ ] Ověřit +SAJ / −SAJ / Reset na všech platformách
- [ ] Ověřit localStorage persistence (reload)
- [ ] Ověřit offline režim (Service Worker)
- [ ] Ověřit haptiku na Android (fyzické zařízení)
- [ ] Installability check (Add to Home Screen prompt)

---

## DEN 5 (2026-02-24)

### Info Dialog & Version Display (PR #22 + #23)

**Rozsah:** Přidání info ikony v headeru s verzí aplikace.

**PR #22** — `feat: info ikona s verzí a definicí SAJ`
- Tlačítko ℹ (SVG inline) v pravém rohu headeru
- Nativní `<dialog>` element (nový HTML5 feature) místo `alert()`
- Dark-theme styling s `.info-dialog`, `::backdrop` blur efektem
- Dialog obsahoval verzi, definici SAJ a tabulku nápojů

**Review & Fixes:**
- Tap target: zvýšen z 36 px na 44 px (`padding: 0.75rem` + `min-width/height: 44px`)
- Sémantika: přidán `<tbody>` do tabulky v dialogu
- False positives: `.btn-info-close` již dědí `border-radius: 12px` a interaktivní stavy z `.btn`

**PR #23** — `fix: info dialog zobrazuje pouze verzi`
- Odstraněna tabulka a popis SAJ (uživatelská zpětná vazba)
- CSS cleanup: odstraněny osiřelé třídy (`.info-dialog__sep`, `__table`, `__section-title` atd.)
- Dialog je nyní minimalistický: jenom název a verze

**Výsledek:**
- 257 řádků app.js, 390 řádků style.css (minimálně bez frameworku)
- Accessibility: WCAG 2.1 minimum tap targets, `aria-label`, keyboard support
- UX: Zavření tlačítkem, backdrop klikem, Escape klávesou

---

## DEN 6 (2026-02-24)

### Versioning & Release Infrastructure (PR #26 → #30)

**Rozsah:** Kompletní přepracování versioningu — od problematického automated workflow k indie-friendly manuálnímu přístupu.

#### 1. Diagnostika problému (info dialog hotfix)
- Info dialog feature mergnut, ale version bump workflow selhával
- Root cause: Chybějící initiální git tag (`v0.0.0` fallback)
- Workflow bug: Node.js template string interpolation v `sw.js` update kroku
- Branch protection: GitHub Actions bot nemůže direktně pushovat do `main`

#### 2. PR #26 — Dokumentace & cleanup
- `.gitignore`: Add `C:/` (WSL Windows path exclusion)
- `devlog.md`: Add DEN 5 summary (info dialog feature, PR review process)
- `README.md`: Rozšířen s features list, quick start, dev instructions
- Status: ✅ Mergnut

#### 3. PR #28-#29 — Versioning cleanup
- Smazán `.github/workflows/version-bump.yml` (137 řádků)
  - Důvody: branch protection issues, fragile implementation, lack of transparency
- Přidán komplexní **Versioning** section v `CLAUDE.md`:
  - Bump rules (minor/patch/major dle Conventional Commits)
  - Manual version bump checklist (3 soubory: app.js, manifest.json, sw.js)
  - Git tag & push instructions
  - **⚠️ Claude instrukce:** Zeptej se na version bump po PR merge s feat:/fix:
- Status: ✅ PR #29 mergnut

#### 4. PR #30 — Release Workflow dokumentace
- Přidán komplexní **Release Workflow** section v `CLAUDE.md` (68 řádků):
  - 5-step process: verze → CHANGELOG → commit → tag → GitHub Release
  - CHANGELOG.md guidelines (Keep a Changelog format)
  - Kategorizace commits (Added/Fixed/Technical)
  - Příklady release notes s emoji headers
  - Vysvětlení proč manuální (indie approach, no git-cliff dependency)
- Status: ✅ Mergnut

#### 5. CHANGELOG.md & GitHub Release
- Vytvořen `CHANGELOG.md` pro v1.0.0:
  - MVP features (SAJ tracking, duration chart, PWA, offline, persistence)
  - Technical highlights (zero dependencies, accessibility, dark theme)
  - Fixes (relative paths, icon sizing, button overflow, focus styles)
- GitHub Release v1.0.0 publikován s release notes
- Status: ✅ CHANGELOG.md commitnut a pushován

#### 6. Git housekeeping
- Smazány staré lokální větve (celkem 13 z předchozích iterací)
- Zbývá: `main` (aktuální) + `feature/graph` (mergnutá, v worktree)
- Status: ✅ Clean

**Výsledek:**
- ✅ Indie/craft development approach (osvědčené praktiky)
- ✅ Transparentní workflow (user controls versioning)
- ✅ CLAUDE.md je nový "CI/CD" — Claude se zeptá a provede release
- ✅ CHANGELOG.md setup (Keep a Changelog format, ready for v1.1.0+)
- ✅ Zero external dependencies (git-cliff ne, ručně handcrafted)
- ✅ Git history čistý, dokumentace kompletní

**Příštích 5 step na releasu:**
1. PR s `feat:` → Claude se zeptá: "Bump to 1.1.0?"
2. User: "Yes"
3. Claude: Updates 3 files, CHANGELOG, commit, tag
4. Claude: `gh release create v1.1.0 --notes "..."`
5. Release hotov ✅

---
