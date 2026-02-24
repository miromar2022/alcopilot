# Alcopilot – Specifikace MVP

> **Poznámka:** Tento dokument popisuje původní MVP plán. Od v1.0.0 aplikace obsahuje rozšíření nad rámec tohoto dokumentu — viz [`CHANGELOG.md`](CHANGELOG.md) pro aktuální stav:
> - Drink type buttons (pivo, víno, panák) místo jednoho `+ SAJ` tlačítka
> - Storno s 10s auto-disable místo trvalého `− SAJ`
> - Duration chart (sloupcový graf intervalů)
> - Info dialog se zobrazením verze

## Přehled

Webová aplikace plnící roli kopilota konzumenta alkoholických nápojů. Umožňuje evidovat konzumaci v jednotkách SAJ (standardní alkoholická jednotka) v průběhu jedné drinking session.

**SAJ** = abstraktní počítací jednotka, aplikace neřeší obsah čistého alkoholu.

## Funkční požadavky

### Drinking session lifecycle

- Session **začíná** zadáním prvního SAJ.
- Session **končí** stiskem tlačítka Reset.
- Reset smaže veškerá data aktuální drinking session (po potvrzení – viz níže).
- Před resetem aplikace zobrazí potvrzovací dialog: *"Opravdu ukončit drinking session? Tato akce nelze vrátit."*

### Hlavní obrazovka

**Ovládací prvky:**
- Tlačítko `+ SAJ` – přidá 1 SAJ, zaznamená timestamp
- Tlačítko `− SAJ` – ubere 1 SAJ a smaže poslední záznam z logu; disabled pokud je počet SAJ = 0
- Tlačítko `Reset` – ukončí session po potvrzení

**Zobrazované informace:**
- Celkový počet SAJ od začátku session (velký, čitelný číselný údaj)
- Čas začátku session (timestamp prvního záznamu)

### Časový log

Tabulka/seznam záznamů, každý řádek obsahuje čas přidání SAJ (začátek konzumace) a dobu konzumace (čas od tohoto SAJ do dalšího; u posledního záznamu živý timer).
- Záznamy jsou řazeny od nejnovějšího (nejnovější nahoře).
- Nejnovější záznam (nahoře) zobrazuje živý timer – uplynulý čas od posledního SAJ, aktualizovaný každých 60 sekund.


Příklad zobrazení - zadán jen první SAJ

| # | Start | Doba konzumace |
|---|-------------|------------------------|
| 1 | 19:32 | 5 min *(živý timer)* |


Příklad zobrazení - zadány 3 SAJ

| # | Start | Doba konzumace |
|---|-------------|------------------------|
| 3 | 20:58 | 5 min *(živý timer)* |
| 2 | 20:15 | 43 min |
| 1 | 19:30 | 45 min |



### Edge cases  

- Počet SAJ nemůže klesnout pod 0 – tlačítko `− SAJ` je disabled při 0.
- Při smazání záznamu přes `− SAJ` se smaže poslední záznam logu a přepočítají se doby konzumace.
- Formát doby konzumace: `X min` pro méně než hodinu, `X hod Y min` pro hodinu a více.
- Živý timer v prvních 60 sekundách zobrazuje `< 1 min` (nikoli `0 min`).

## Nefunkční požadavky

### Perzistence

- Data session uložena v `localStorage`.
- Při obnovení stránky (refresh) session přežije – data se načtou z `localStorage`.
- Reset vymaže `localStorage`.

### Responzivní design a mobilní UX

- Primární cílová platforma: mobilní prohlížeč (portrait orientation).
- Tlačítka `+ SAJ` a `− SAJ` musí mít minimální tap target **64×64 px**.
- Haptická zpětná vazba po stisku `+ SAJ`: `navigator.vibrate(50)` (kde podporováno).
- Layout funkční i v landscape orientaci a na desktopu.

### PWA

- `manifest.json` s názvem, ikonou a `display: standalone`.
- Service worker cachující statické soubory pro offline použití.
- Uživatel může přidat aplikaci na homescreen mobilního zařízení.

## Tech stack

| Vrstva | Technologie |
|--------|-------------|
| Markup | HTML5 |
| Styling | CSS3 (bez frameworku) |
| Logika | Vanilla JavaScript (ES6+) |
| Perzistence | localStorage |
| PWA | manifest.json + Service Worker |
| Hosting | GitHub Pages |

Žádný build step, žádné závislosti, žádný package manager.

## Struktura projektu

```
alcopilot/
├── index.html
├── style.css
├── app.js
├── sw.js                  # Service Worker
├── manifest.json
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
├── SPEC.md
└── README.md
```

## GitHub workflow

- `main` – produkční větev, chráněná (branch protection: vyžadovat PR, nelze přímo pushovat)
- Feature větve: `feature/<název>`, `fix/<název>`, `chore/<název>`
- Každá nová funkcionalita = samostatná větev + PR do `main`
- Commit konvence: [Conventional Commits](https://www.conventionalcommits.org/) – `feat:`, `fix:`, `chore:`, `docs:`
- Hosting: GitHub Pages nasazené z `main` větve

## Milestones

### Milestone 1 – MVP (tento dokument)
Základní session management, počítadlo SAJ, časový log, localStorage, PWA, responzivní design.

### Milestone 2 – možná budoucí rozšíření (mimo scope MVP)
- Historie minulých sessions
- Statistiky (průměrný interval, SAJ/hodinu)
- Notifikace / upozornění po X SAJ
- Tmavý režim
