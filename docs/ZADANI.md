# Alcopilot – Podrobné technické zadání

**Verze:** 1.0.6  
**Datum:** Únor 2026  
**Technologie:** HTML5, CSS3, Vanilla JavaScript (bez frameworku)

---

## 1. Přehled a účel aplikace

**Alcopilot** je progresivní webová aplikace (PWA) určená pro sledování konzumace alkoholu v průběhu jedné drinking session. Aplikace eviduje jednotlivé SAJ (standardní alkoholická jednotka – abstraktní jednotka nezávislá na skutečném obsahu alkoholu) spolu s typem konzumovaného nápoje a časy jejich přidání.

**Typická cílová skupina:** Dospělí uživatelé na mobilních zařízeních (Android, iOS) v přírodním portrait módu.

---

## 2. Funkční požadavky

### 2.1 Životní cyklus drinking session

#### Začátek session
- Session začíná tím, že uživatel poprvé přidá SAJ stisknutím jednoho z tlačítek nápojů (Pivo, Víno, Panák).
- Při přidání prvního SAJ se zaznamená aktuální timestamp (metodou `Date.now()`).
- Aplikace automaticky zobrazí čas začátku session v textu „Začátek: HH:MM".

#### Průběh session
- Uživatel může přidávat SAJ klikáním na tlačítka nápojů.
- Ke každému SAJ se zaznamená timestamp a typ nápoje.
- Uživatel může **stornovat** poslední SAJ tlačítkem Storno (aktivní pouze v časovém okně 10 sekund po přidání SAJ).
- Na obrazovce jsou viditelné: celkový počet SAJ, čas začátku session, časový log s intervalem mezi jednotlivými SAJ, graf doby konzumace.

#### Konec session
- Session končí stisknutím tlačítka **Reset**.
- Aplikace zobrazí potvrzovací dialog: `"Opravdu ukončit drinking session? Tuto akci nelze vrátit."`
- Po potvrzení se:
  - Vymažou všechny záznamy ze `localStorage`
  - Vynulují všechny časovače (live timer, Storno timer)
  - Skryje se sekce grafu
  - Obsah logu se smaže
  - Čítač SAJ se nastaví na 0
  - Skryje se text začátku session
- Pokud uživatel dialog zruší (Cancel), nic se neděje.

### 2.2 Ovládací prvky

#### 2.2.1 Tlačítka nápojů (Pivo, Víno, Panák)
- **Vizuální vzhled:** Tři ikony nápojů vedle sebe, každá 80×80 px
  - Pivo (`icons/beer.png`)
  - Víno (`icons/wine.png`)
  - Panák (`icons/shot.png`)
- **Chování:** Kliknutí na kterékoliv tlačítko přidá SAJ typu odpovídajícího nápoji
- **Haptická zpětná vazba:** Pokud je dostupné, spustit `navigator.vibrate(50)` [vibrace 50 ms]
- **Dostupnost (a11y):**
  - Každé tlačítko má `aria-label` s popisem (e.g., "Přidat pivo")
  - Minimální tap target: 80×80 px (překračuje WCAG 2.1 AA minimum 64×64 px)
- **Zaměření:** Při zaměření (focus) zobrazit focus outline
- **Stav po kliknutí:** Bezprostředně volá `enableStornoTemporarily()` → Storno se aktivuje na 10 sekund

#### 2.2.2 Tlačítko Storno
- **Text:** "Storno"
- **Funkce:** Smaže poslední přidaný SAJ (pop z pole `timestamps`)
- **Dostupnost:**
  - `aria-label`: "Storno posledního SAJ"
  - Atribut `disabled`: True, pokud `timestamps.length === 0` nebo když uplynuly 10 sekund od posledního přidání SAJ
- **Automatické zakázání:** Po přidání SAJ se Storno aktivuje, ale **pouze na dobu 10 sekund**
  - Správa časovače: `stornoTimer = setTimeout(() => { els.btnRemove.disabled = true }, 10000)`
  - Pokud uživatel stornuje SAJ během okna, zbývající čas (10s − uplynulý čas) se přepočítá pro poslední zbývající SAJ
- **Barva:** Modrá (`--accent-minus`, `#4a9eff`)
- **Velikost:** Flexibilní šířka (flex: 1), zaujímá polovinu řádku s Resetem

#### 2.2.3 Tlačítko Reset
- **Text:** "Reset"
- **Funkce:** Ukončí session s potvrzením
- **Dialog:** Při kliknutí se zobrazí `confirm()` dialog s textem `"Opravdu ukončit drinking session? Tuto akci nelze vrátit."`
  - Pokud uživatel zvolí OK (Ano) → spustí `resetSession()`
  - Pokud Zruš (Ne) → session pokračuje
- **Barva:** Tmavá (`--btn-reset-bg`, `#2a2a4a`), text šedavý
- **Velikost:** Flexibilní šířka (flex: 1), vedle Storna

### 2.3 Zobrazované informace

#### 2.3.1 Počítadlo SAJ (Counter Section)
- **Umístění:** Horní část aplikace, za header
- **Obsah:**
  - Velké číslo (`font-size: clamp(5rem, 20vw, 8rem)`) reprezentující celkový počet SAJ
  - Pod číslem text "SAJ" (uppercase)
  - Pod tím text "Začátek: HH:MM" (zobrazuje se, pokud `timestamps.length > 0`)
    - Čas se vypočítá z prvního záznamu (nejstaršího)
    - Formát: `HH:MM` v českém formátu (např. "19:30")
- **Dostupnost:**
  - `aria-live="polite" aria-atomic="true"` na prvku čítače
  - Time element s isostring datem v `datetime` atributu

#### 2.3.2 Časový log (Log Section)
- **Formát:** HTML `<table>` s hlavičkou a tělem
- **Sloupce (zleva doprava):**
  1. **#** — Běžné číslo SAJ (1, 2, 3, ..., N zprava)
  2. **Nápoj** — Malá ikona nápoje (24×24 px)
  3. **Čas** — Čas přidání SAJ v HH:MM
  4. **Doba konzumace** — Interval mezi tímto SAJ a následujícím (nebo live timer pro poslední)

- **Řazení:** Od nejnovějšího po nejstarší (poslední přidaný SAJ je na prvním řádku)
- **Barvy řádků:**
  - Nejnovější řádek (první): Tmavší pozadí (`--surface-2`)
  - Ostatní řádky: Střídají se mezi `--surface` a bez pozadí
- **Doba konzumace — detaily:**
  - Pokud SAJ **není poslední** (už máme další): Zobrazit počítaný interval v minutách/hodinách
    - Formát: `X min` pro interval < 60 minut (e.g., "43 min")
    - Formát: `X hod Y min` pro >= 60 minut (e.g., "1 hod 23 min")
  - Pokud SAJ **je poslední** (je to ten nejnovější): Zobrazit **live timer**
    - Live timer se aktualizuje každých **60 sekund**
    - Formát: `< 1 min` pokud uplynulo < 60 sekund
    - Jinak: `X min` nebo `X hod Y min` dle délky
    - Live timer je řídící interval: `setInterval(() => { tdDur.textContent = elapsedText(entry.ts) }, 60000)`

#### 2.3.3 Aktuální doba konzumace (Duration Chart)
- **Viditelnost:** Zobrazuje se pouze pokud `timestamps.length >= 2`
  - Mít alespoň 2 záznamy znamená, že máme alespoň 1 dokončený interval (mezi SAJ #1 a #2)
- **Typ grafu:** Sloupcový (bar) graf se 1 sloupcem na jeden **dokončený** interval
  - Poslední SAJ (live timer) se v grafu **nezobrazuje**
  - Počet sloupců = `timestamps.length - 1`
- **SVG layout:**
  - Viewbox: `0 0 320 160` (zachovává poměr aspect)
  - Padding: top 10, right 16, bottom 28, left 36
  - Plota šířka: 320 - 16 - 36 = 268
  - Plot výška: 160 - 10 - 28 = 122
- **Osa Y (svislá):**
  - Minimum: 0 minut
  - Maximum: Zaokrouhleno na nejbližší vyšší násobek 5 minut nad maximum v datech
    - Algoritmus: `const maxMin = Math.ceil(maxMs / 60000 / 5) * 5 || 5`
  - Gridlines: Horizontální čáry v 25%, 50%, 75%, 100% výšky
  - Labels: Vedle gridlines (vlevo od plota) s popisky (0m, 5m, 10m, ..., 50m, 1h, ...) podle maxima
- **Osa X (vodorovná):**
  - Čísla SAJ (1, 2, 3, ...) pod sloupci — reprezentují čísla nápojů (neindexují, ale čísla od 1 do N)
- **Sloupce:**
  - Barva: `#f5a800` (oranžová)
  - Zaoblení rohů: `rx="3" ry="3"`
  - Výška: Vypočítána z délky intervalu vůči maximu
  - Šířka: `Math.min((plotW / bars.length) * 0.65, 40)` px
  - Umístění: Centrováno v každém slotu na ose X
- **Accessibility (a11y):**
  - `<title>` element v SVG s textem: `"Graf doby konzumace: nápoj 1: X min, nápoj 2: Y min, ..."`
  - `role="img"` na SVG
  - `aria-label` popisující obsah
- **Barvy prvků:**
  - Gridlines: `#2a2a5a` (hranice)
  - Text (labels): `#8888aa` (sekundární text)
  - Sloupce: `#f5a800` (oranžová)

### 2.4 Info dialog

#### 2.4.1 Otevření dialogu
- **Trigger:** Kliknutí na info ikonu (ℹ) v header
- **Dialog element:** Nativní HTML5 `<dialog>` — `els.infoDialog.showModal()`

#### 2.4.2 Obsah dialogu
- **Číslo verze:** Přečteno z `APP_VERSION` v `app.js` (nyní "1.0.6")
- **Datum vydání:** Přečteno z `RELEASE_DATE` v `app.js` (formátováno jako "1. března 2026")
- **Tlačítko Zavřít:** Tlačítko v dialogu pro zavření

#### 2.4.3 Zavření dialogu
- Tři způsoby:
  1. Kliknutí na tlačítko Zavřít
  2. Kliknutí na backdrop (tmavé pozadí mimo dialog) — `click` event na `dialog` element
  3. Stisk klávesy Escape

---

## 3. Datový model a perzistence

### 3.1 Struktura dat v paměti

**Globální proměnná `timestamps`: Array of Objects**

Každý záznam obsahuje:
```javascript
{
  ts: Number,      // Timestamp v ms (Date.now())
  type: String     // 'beer' | 'wine' | 'shot'
}
```

**Příklad:**
```javascript
timestamps = [
  { ts: 1234567890123, type: 'beer' },
  { ts: 1234567890234, type: 'wine' },
  { ts: 1234567890456, type: 'shot' }
]
```

- Záznamy se přidávají na **konec pole** (`push`)
- Při Storno se odebírá z **konce pole** (`pop`)
- Při renderování se iteruje od **konce k začátku** (nejnovější nahoře)

### 3.2 Perzistence v localStorage

- **Storage key:** `'alcopilot-session'`
- **Formát:** JSON string pole `timestamps`
- **Uložení:** Volána vždy po změně (`addSaj`, `removeSaj`), pomocí `saveSession()`
  ```javascript
  localStorage.setItem('alcopilot-session', JSON.stringify(timestamps))
  ```
- **Načtení:** Při load stránky (`DOMContentLoaded`), pomocí `loadSession()`
  ```javascript
  const stored = localStorage.getItem('alcopilot-session')
  timestamps = JSON.parse(stored) // nebo []
  ```
- **Migrace starého formátu:** Původní aplikace měla pole čísel (`[1234567890, ...]`), nová má pole objektů
  - Při load: Zkontrolovat formát, pokud je stará verze (plain number), konvertovat na nový formát s `type: 'beer'`
- **Reset:** Smazáno přes `localStorage.removeItem('alcopilot-session')`
- **Error handling:** Try-catch, protože localStorage může být nedostupný (private mode, kvóta překročena)

---

## 4. Komunikace s uživatelem a zpětná vazba

### 4.1 Haptická zpětná vazba
- **Trigger:** Kliknutí na tlačítko přidání nápoje
- **Implementace:** `navigator.vibrate?.(50)` — vibruj 50 ms
- **Fallback:** Pokud není dostupné (`?`), jednoduše se ignore

### 4.2 Vizuální feedback tlačítek
- **Aktiv stav:** Při kliku se tlačítko změní velikostí (scale 0.96-0.93)
- **Focus outline:** Při zaměření (keyboard) se zobrazí outline oranžové barvy (`--accent-plus`)
- **Disabled stav:** Tlačítko Storno se vybílí (opacity 0.35) a změní text barvu, pokud je disabled

### 4.3 Potvrzovací dialog
- Nativní `confirm()` dialog s textem
- Uživatel musí výslovně potvrdit, aby se vymazala session

---

## 5. Nefunkční požadavky

### 5.1 Responzivní design

#### Cílové rozlišení
- **Primární:** Mobilní zařízení (375–428 px šířka) v portrait módu
- **Sekundární:** Tablet (600+ px šířka)
- **Terciární:** Desktop (1024+ px šířka)

#### Layout
- **Portrait (≤ 600px):**
  - Single column layout
  - Max-width obsahu: 600px, centered (margin: 0 auto)
  - Tlačítka nápojů: 3 za sebou vodorovně, gap 1 rem
  - Storno + Reset: 2 vedle sebe, flex 1 każde
  - Log tabulka: scrollovatelná horizontálně na úzké obrazovce

- **Landscape (≤ 500px výšky):**
  - Komprimovaný layout
  - Counter font-size: `clamp(3rem, 12vh, 5rem)`
  - Gap mezi sekcemi: 1 rem místo 2 rem
  - Padding aplikace: 0.5 rem block, 1.25 rem inline

- **Desktop (≥ 1024px):**
  - Max-width: 600px (bez změny), ale padding větší (2 rem inline)
  - Gap: 2.5 rem
  - Counter font-size: 8rem (fixed)

### 5.2 Design a barvy

#### Color palette (CSS Custom Properties)
```css
--bg:             #1a1a2e   /* Dark background */
--surface:        #16213e   /* Card/section background */
--surface-2:      #0f3460   /* Darker surface for emphasis */
--accent-plus:    #e94560   /* Orange/red for add, focus */
--accent-minus:   #4a9eff   /* Blue for removal/cancel */
--btn-reset-bg:   #2a2a4a   /* Reset button background */
--text-primary:   #eaeaea   /* Main text */
--text-secondary: #8888aa   /* Labels, descriptions */
--text-disabled:  #44445a   /* Disabled text */
--border:         #2a2a5a   /* Lines, dividers */
```

#### Typografie
- Font-family: `system-ui, -apple-system, sans-serif`
- Counter value: `clamp(5rem, 20vw, 8rem)` (responsive, fluid)
- Ostatní text: `1rem` až `0.75rem` dle kontextu
- Button text: `1.125rem` (bold)
- Line-height base: 1.4

### 5.3 Akcesibilita (WCAG 2.1 AA)

#### Minimální tap targets
- Drink buttons: 80×80 px
- Info button: 44×44 px (WCAG minimum)
- Ostatní: min 44×44 px

#### Aria labels a attributes
- Všechna tlačítka: `aria-label` s popisem
- Counter: `aria-live="polite" aria-atomic="true"` (live region pro čtečky)
- Time elementy: `datetime=""` atributy
- Info dialog: `aria-label="Informace o aplikaci"`
- Chart (SVG): `role="img"` + `<title>` + `aria-label`

#### Barevný kontrast
- Text na pozadí: Poměr 4.5:1 pro normální text (AA)
- Focus indicators: Jasné, viditelné (3px oranžový outline)

#### Formuláře a interakce
- Disable state visual: Jasně viditelné (opacity, barva změní)
- Dialog: Nativní HTML5 `<dialog>` s backdrop blur

### 5.4 PWA (Progressive Web App)

#### manifest.json
- `name`: "Alcopilot"
- `short_name`: "Alcopilot"
- `description`: "Sledování konzumace alkoholu v SAJ jednotkách"
- `start_url`: "."
- `display`: "standalone" — spustí se na HomeScreen jako native app
- `background_color` + `theme_color`: "#1a1a2e"
- `icons`: Dvě ikonky (192×192, 512×512 px)

#### Service Worker (sw.js)
- Cachuje všechny statické soubory (HTML, CSS, JS, PNG)
- Cache name: `'alcopilot-vX.Y.Z'` (versionováno)
- Offline-first strategy: Slouží z cache, pokud není dostupná síť
- Update detection: Pokud S.W. aktualizace existuje, stránka se automaticky reload
  - `reg.addEventListener('updatefound', ...)` → detekce nového SW
  - Pokud je nový SW aktivní a původní měl controller → `window.location.reload()`

#### Orientace
- Primární: Portrait (landscape je podporováno, ale secondary)
- Manifest: Nezadává `orientation`, mobilní OS si vybere

### 5.5 Výkon

- **Bundle size:** Bez dependencies, < 50 KB gzipped (HTML + CSS + JS dohromady)
- **Live updates:** Live timer aktualizuje interaktivní prvky každých 60 sekund (nikoliv 1 sec)
- **Rendering:** Debounce renderování v `requestAnimationFrame()` nebo přímý render (aplikace je malá)

### 5.6 Kompatibilita

- **Prohlížeče:** Chrome/Edge 70+, Firefox 65+, Safari 12.2+ (iOS)
- **ES6 features:** Arrow functions, `const`/`let`, template literals povoleny
- **Webové API:** `localStorage`, `localStorage.vibrate()`, Service Workers, HTML5 `<dialog>`

---

## 6. Implementační detail — algoritmy a logika

### 6.1 Přidání SAJ
```
addSaj(type: 'beer' | 'wine' | 'shot')
  1. Přidej {ts: Date.now(), type} do pole timestamps
  2. Spusť vibrace: navigator.vibrate?.(50)
  3. Zavolej render()
  4. Ulož session do localStorage
  5. Aktivuj Storno na 10 sekund: enableStornoTemporarily()
```

### 6.2 Stornování SAJ
```
removeSaj()
  1. Pokud timestamps.length === 0: return (nic se neudělá)
  2. Pop poslední záznam: timestamps.pop()
  3. Zavolej render()
  4. Ulož session
  5. SPECIÁLNÍ LOGIKA:
     - Pokud zbyla nějaká SAJ (timestamps.length > 0):
       - Vypočítej, jak dlouho je poslední SAJ staré: elapsed = Date.now() - timestamps[timestamps.length-1].ts
       - Pokud elapsed < 10000:
         - Aktivuj Storno na zbývající čas: enableStornoTemporarily(10000 - elapsed)
       - Jinak: Storno zůstane disabled
```

### 6.3 Reset session
```
resetSession()
  1. Pokud timestamps.length === 0: return
  2. Zobraz confirm dialog: "Opravdu ukončit drinking session? Tuto akci nelze vrátit."
  3. Pokud uživatel zvolí Cancel: return, nic se neudělá
  4. Pokud OK:
     - Vynuluj: timestamps = []
     - Smaž localStorage: localStorage.removeItem('alcopilot-session')
     - Skryj chart section: els.chartSection.hidden = true
     - Zavolej render()
```

### 6.4 Formátování času intervalu
```
formatDuration(ms: Number) -> String
  1. Vypočítej totalMinutes = Math.floor(ms / 60000)
  2. Pokud totalMinutes < 60: vrať '${totalMinutes} min'
  3. Jinak:
     - hours = Math.floor(totalMinutes / 60)
     - minutes = totalMinutes % 60
     - vrať '${hours} hod ${minutes} min'
```

### 6.5 Elapsed text (live timer)
```
elapsedText(fromTs: Number) -> String
  1. ms = Date.now() - fromTs
  2. Pokud ms < 60000: vrať '< 1 min'
  3. Jinak: zavolej formatDuration(ms)
```

### 6.6 Aktivace Storno na X sekund
```
enableStornoTemporarily(duration = 10000)
  1. Pokud existuje předchozí timer: clearTimeout(stornoTimer)
  2. Nastav: els.btnRemove.disabled = false
  3. Nastav stornoTimer = setTimeout(() => {
       els.btnRemove.disabled = true
       stornoTimer = null
     }, duration)
```

### 6.7 Render — Master funkce
```
render()
  1. Aktualizuj čítač: els.count.textContent = timestamps.length
  2. UPDATE Storno state:
     - Pokud timestamps.length === 0: cancelStornoTimer() a els.btnRemove.disabled = true
  3. UPDATE Session start time:
     - Pokud timestamps.length > 0:
       - els.sessionStart.hidden = false
       - els.startTime.textContent = formatTime(new Date(timestamps[0].ts))
       - els.startTime.datetime = new Date(timestamps[0].ts).toISOString()
     - Jinak: els.sessionStart.hidden = true
  4. Zavolej renderChart()
  5. Zavolej renderLog()
```

### 6.8 Render Chart
```
renderChart()
  1. Pokud timestamps.length < 2: els.chartSection.hidden = true; return
  2. els.chartSection.hidden = false
  3. Vypočítej completed intervals (timestamps[0..n-2] a jejich vzdálenost do dalšího)
  4. Vypočítej max čas v datech: maxMs, zaokrouhlí na max_minut = ceil(maxMs / 60000 / 5) * 5
  5. Vygeneruj SVG:
     - Gridlines v 0%, 25%, 50%, 75%, 100% výšky
     - Y labels (0m, 5m, ..., 60m, 1h, ...)
     - Barové sloupce (jeden na interval)
     - X labels (čísla nápojů)
  6. Vlož do els.chart
```

### 6.9 Render Log
```
renderLog()
  1. CANCEL předchozí live timer: if (timerInterval) clearInterval(timerInterval)
  2. els.logBody.innerHTML = '' (smazat starý obsah)
  3. Pokud timestamps.length === 0: return
  4. Iteruj od timestamps.length-1 až 0 (nejnovější nahoře):
     - Pro každý záznam vytvoř řádek tabulky s:
       - # (číslo: i+1)
       - Икона nápoje (img se src z DRINK_ICONS)
       - Čas (formatTime(new Date(entry.ts)))
       - Doba konzumace:
         * Pokud je posledním záznamem (i === timestamps.length-1):
           - Nastav text: elapsedText(entry.ts)
           - Nastav timerInterval = setInterval(() => {
               td.textContent = elapsedText(entry.ts)
             }, 60000)  # Update každých 60s
         * Jinak: Staticky vypočítej interval do dalšího: formatDuration(timestamps[i+1].ts - entry.ts)
```

---

## 7. Stav dokumentu a inicializace

### 7.1 Inicializace (DOMContentLoaded)
```javascript
1. loadSession()  // Obnov session z localStorage
2. Zaregistruj event listeners:
   - Drink buttons → addSaj('beer'|'wine'|'shot')
   - Storno button → removeSaj()
   - Reset button → resetSession()
   - Info button → els.infoDialog.showModal()
   - Info Close button → els.infoDialog.close()
   - Dialog backdrop (click) → els.infoDialog.close()
   - (Escape se zpracuje automaticky <dialog>)
3. Vlož verzi: els.infoVersion.textContent = APP_VERSION
4. Vlož datum: els.infoRelease.textContent = RELEASE_DATE (formátováno)
5. Zavolej render()  // Initial render
6. SPECIÁLNÍ LOGIKA po load:
   - Pokud timestamps.length > 0:
     - elapsed = Date.now() - timestamps[timestamps.length-1].ts
     - Pokud elapsed < 10000:
       - enableStornoTemporarily(10000 - elapsed)
7. Registruj Service Worker:
   - navigator.serviceWorker.register('sw.js')
   - Detekuj aktualizace (updatefound event)
   - Pokud nový SW je aktivní a existuje oldSW → reload stránky
```

---

## 8. Testovací scénáře (manuální testing)

### Scénář 1: Základní session
1. Otevři aplikaci
2. Klikni "Přidat pivo" — měl bys vidět počet "1", čas začátku, záznam v logu
3. Čekej 30 sekund, klikni "Přidat víno" — měl bys vidět "2", v logu 2 záznamy, gráf s 1 sloupcem
4. Klikni Reset, potvrď — session se smaže, log bude prázdný

### Scénář 2: Storno
1. Přidej SAJ -> Storno by měl být aktivní (modré tlačítko)
2. Čekej 5 sekund -> storno je stále aktivní
3. Čekej dalších 6 sekund (celkem 11 sekund) -> Storno by měl být disabled (šedé)
4. Přidej nový SAJ -> Storno je opět aktivní
5. Hned klikni Storno -> poslední SAJ se smaže, čítač se sníží

### Scénář 3: Live timer
1. Přidej SAJ
2. Čekej 1 minutu -> v logu se zobrazí "< 1 min"
3. Čekej dalších 60 sekund -> mělo by se aktualizovat (bez F5) -> "1 min"
4. Czekej dalších 30 sekund -> "1 min" (aktualizace každých 60s)

### Scénář 4: Persistence
1. Přidej 3 SAJ
2. Refresh stránky (F5) -> session by měla být obnovena, počet SAJ se zachová
3. Přidej 2. SAJ, Storno -> počet SAJ se zníží
4. Refresh -> stav se znovu zachová

### Scénář 5: Offline
1. Otevři devtools -> Network -> Offline
2. Přidej SAJ (aplikace by měla fungovat bez sítě)
3. Refresh stránky (offline) -> session se načte z cache + localStorage
4. Vrať Online
5. Přidej SAJ -> debug console by měl biti Service Worker update (pokud existuje)

### Scénář 6: Responsive
1. Otevři na mobilu (Android Chrome + iOS Safari)
2. Portrait: Všechny prvky by měly být čitelné, tap targets >= 64px
3. Landscape: Layout se komprimuje, ale vše zůstane funkční
4. Desktop (1200px): Layout je stejný, ale s větším paddingem

### Scénář 7: Info dialog
1. Klikni info ikonu (ℹ)
2. Dialog by měl zobrazit verzi a datum
3. Zavři dialog:
   - Kliknutím na "Zavřít" tlačítko
   - Kliknutím na backdrop
   - Stiskem Escape
4. Dialog by měl přejít do poklidu (no-op přidávání SAJ během dialogu)

---

## 9. Nasazení a publikace

### 9.1 Hostování
- **Služba:** GitHub Pages
- **Branch:** `main` (protected, změny pouze přes PR)
- **URL:** `https://miromar2022.github.io/alcopilot/`

### 9.2 Build a deployment
- **Bez build kroku:** Soubory se nasadí přímo (HTML, CSS, JS jsou statické)
- **Service Worker versioning:**
  - Při každé nové verzi se změní `CACHE_NAME` v `sw.js`
  - Formát: `'alcopilot-vX.Y.Z'` (e.g., `'alcopilot-v1.0.6'`)
  - Starší cache se automaticky invaliduje v prohlížeči
- **Verze aplikace:**
  - `APP_VERSION` v `app.js`
  - `version` v `manifest.json`
  - Obojí musí být synchronizováno

### 9.3 Release workflow
1. Merge PR do `main`
2. Aktualizuj verzi (podle Conventional Commits: feat → minor, fix → patch)
3. Aktualizuj `app.js`, `manifest.json`, `sw.js`, `CHANGELOG.md`
4. Commituj: `chore: bump version to X.Y.Z`
5. Vytvoř git tag: `git tag vX.Y.Z && git push --tags`
6. Vytvoř GitHub Release (MANDATORY) s release notes z CHANGELOG
7. Publikuj

---

## 10. Konvence kódu a style guide

### 10.1 JavaScript
- **Komentáře:** `/* ==== Sekce ==== */` pro hlavní sekce, `//` pro inline
- **Proměnné:** camelCase (`timestamp`, `drinkButtons`, etc.)
- **Funkce:** camelCase, jedno slovo pro akci (`render`, `addSaj`, etc.)
- **Globální:** `const` pro constants (APP_VERSION), `let` pro mutable globály (timestamps)
- **DOM selektory:** `const $ = id => document.getElementById(id)`
- **Error handling:** Try-catch pro localStorage, tolerance pro chybějící API

### 10.2 HTML
- **Semantic:** `<header>`, `<main>`, `<section>`, `<table>` místo divů
- **Aria:** Všechna interaktivní prvky mají labels
- **Attributes:** `data-*` pro vlastní data, `aria-*` pro a11y

### 10.3 CSS
- **Custom properties:** `--color`, `--spacing` v `:root`
- **Mobile-first:** Base styles pro mobile, media queries pro desktop
- **BEM-like:** `.btn-row--drinks`, `.counter-value` pro špeciální varianty
- **Z-index:** Zřídka se používá (dialog je v HTML order)

---

## 11. Vydané verze a historie

- **v1.0.0** — MVP: SAJ counter, log, Reset, localStorage
- **v1.0.1–1.0.5** — Bugfixes a refinementy
- **v1.0.6** — Current version (Únor 2026)

Podrobnosti: Viz `CHANGELOG.md`

---

## Poznámky pro vývojáře

1. **Bez frameworku:** Vanilla JS, HTML5, CSS3 — cíl je minimální dependencies
2. **Service Worker:** Testuj offline mode v DevTools (App > Service Workers menu)
3. **localStorage Quota:** Max ~5 MB na domén (pro tuto aplikaci nikdy nepřekročíme)
4. **Časové zóny:** `Date.now()` vrací UTC, formátování se provádí v local timezone
5. **Mobile testing:** Vždycky testuj na real device (Android Chrome, iOS Safari), ne jen emulator
6. **Accessibility:** Po změnách vždy spusť Lighthouse PWA audit

---

**Konec dokumentu**
