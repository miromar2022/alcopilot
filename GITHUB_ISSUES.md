# GitHub Issues – Alcopilot MVP

Níže jsou připravené issues pro GitHub. Každý issue odpovídá jedné atomické pracovní jednotce.
Doporučené pořadí: issues jsou seřazeny tak, aby bylo možné pracovat postupně.

---

## Issue #1 – Inicializace projektu a GitHub Pages

**Label:** `chore`
**Milestone:** MVP

### Popis
Připravit základní strukturu projektu, GitHub repozitář a hosting.

### Acceptance criteria
- [ ] Repozitář `alcopilot` vytvořen na GitHubu
- [ ] Základní soubory vytvořeny: `index.html`, `style.css`, `app.js`, `README.md`, `SPEC.md`
- [ ] Ikony vytvořeny a umístěny: `icons/icon-192.png` (192×192 px) a `icons/icon-512.png` (512×512 px)
- [ ] První commit pushnut přímo na `main` (branch protection ještě není aktivní)
- [ ] Branch protection na `main` aktivována **po** prvním přímém push (PR required)
- [ ] GitHub Pages nasazeny z větve `main`, aplikace dostupná na veřejné URL
- [ ] `README.md` obsahuje popis projektu a odkaz na živou aplikaci

---

## Issue #2 – Základní UI layout

**Label:** `feature`
**Milestone:** MVP

### Popis
Vytvořit responzivní HTML/CSS layout hlavní obrazovky.

### Acceptance criteria
- [ ] Zobrazuje se počitadlo SAJ (velký, čitelný text)
- [ ] Přítomna tlačítka: `+ SAJ`, `− SAJ`, `Reset`
- [ ] Tap target tlačítek `+ SAJ` a `− SAJ` je minimálně 64×64 px
- [ ] Layout je použitelný na mobilním prohlížeči (portrait, min. šířka 320 px)
- [ ] Layout je použitelný na desktopu (min. šířka 1024 px)
- [ ] Layout je použitelný v landscape orientaci

---

## Issue #3 – Session management a počítadlo SAJ

**Label:** `feature`
**Milestone:** MVP

### Popis
Implementovat logiku session a základní počítadlo SAJ.

### Acceptance criteria
- [ ] Stisk `+ SAJ` zvýší počet SAJ o 1
- [ ] Stisk `− SAJ` sníží počet SAJ o 1
- [ ] Tlačítko `− SAJ` je disabled pokud je počet SAJ = 0
- [ ] Session začíná prvním stiskem `+ SAJ` (zaznamená se čas začátku session)
- [ ] Čas začátku session je zobrazen na obrazovce
- [ ] Stisk `Reset` zobrazí potvrzovací dialog; po potvrzení se session vymaže a UI se vrátí do výchozího stavu
- [ ] Po resetu je počet SAJ = 0, log je prázdný

---

## Issue #4 – Časový log

**Label:** `feature`
**Milestone:** MVP

### Popis
Implementovat seznam záznamů s timestampy a dobami konzumace.

### Acceptance criteria
- [ ] Každý stisk `+ SAJ` přidá záznam do logu s přesným časem (formát HH:MM)
- [ ] Záznamy jsou zobrazeny od nejnovějšího
- [ ] U každého záznamu je zobrazena doba konzumace (formát: `X min` nebo `X hod Y min`) – čas od tohoto SAJ do dalšího
- [ ] Poslední (nejnovější) záznam zobrazuje živý timer – uplynulý čas od posledního SAJ, aktualizovaný každých 60 sekund
- [ ] V prvních 60 sekundách timer zobrazuje `< 1 min` (ne `0 min`)
- [ ] Stisk `− SAJ` smaže poslední záznam z logu a přepočítá doby konzumace

---

## Issue #5 – Perzistence (localStorage)

**Label:** `feature`
**Milestone:** MVP

### Popis
Uložit stav session do localStorage tak, aby přežil refresh stránky.

### Acceptance criteria
- [ ] Po refreshi stránky se session obnoví (počet SAJ, log záznamů, čas začátku)
- [ ] Reset vymaže localStorage
- [ ] Pokud localStorage neobsahuje data, aplikace se spustí v prázdném stavu

---

## Issue #6 – Haptická zpětná vazba

**Label:** `feature`
**Milestone:** MVP

### Popis
Přidat vibraci po stisku `+ SAJ` na zařízeních, která to podporují.

### Acceptance criteria
- [ ] Po stisku `+ SAJ` zařízení vibruje (50 ms) pokud `navigator.vibrate` je dostupné
- [ ] Na zařízeních bez podpory vibrace nevzniká žádná chyba

---

## Issue #7 – PWA (manifest + service worker)

**Label:** `feature`
**Milestone:** MVP

### Popis
Přidat podporu Progressive Web App – aplikaci lze přidat na homescreen a funguje offline.

### Acceptance criteria
- [ ] `manifest.json` je přítomen a správně odkazován v `index.html`
- [ ] Manifest obsahuje: název (`Alcopilot`), `display: standalone`, ikony 192×192 a 512×512 px
- [ ] Service worker (`sw.js`) cachuje statické soubory (HTML, CSS, JS, manifest, ikony)
- [ ] Aplikace se načte a funguje offline (bez internetového připojení) po prvním načtení
- [ ] Na Android Chrome se zobrazí výzva "Přidat na plochu"
- [ ] Na iOS Safari lze aplikaci přidat na plochu přes share sheet

---

## Issue #8 – QA a finální review

**Label:** `chore`
**Milestone:** MVP

### Popis
Otestovat celou aplikaci před uzavřením MVP milestone.

### Acceptance criteria
- [ ] Otestováno na Android Chrome (fyzické zařízení nebo emulátor)
- [ ] Otestováno na iOS Safari (fyzické zařízení nebo simulátor)
- [ ] Otestováno na desktop Chrome a Firefox
- [ ] Žádné JS chyby v konzoli
- [ ] Všechny acceptance criteria předchozích issues jsou splněny
- [ ] Lighthouse PWA audit neobsahuje žádné kritické chyby (installability, offline, manifest)
- [ ] `README.md` je aktuální
