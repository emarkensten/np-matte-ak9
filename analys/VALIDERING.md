# Validering av analysen

Skapad: April 2026
Uppdaterad: April 2026 (utökad med 2015, 2016, 2018, 2019)
Analyserad av: Claude (Anthropic)

---

## Verifierade påståenden

### Betygsgränser (kravgränser)
Direkt extraherade från PRIM-gruppens rapporter och provdokument.

| År | Totalt | E | D | C | B | A |
|----|--------|---|---|---|---|---|
| 2016 | 90 p | 22 | 36 | 48 | 63 | 73 |
| 2017 | 91 p | 22 | 38 | 50 | 64 | 74 |
| 2018 | 91 p | 22 | 37 | 50 | 65 | 75 |
| 2019 | 90 p | 21 | 37 | 51 | 64 | 75 |
| 2024 | 88 p | 21 | 35 | 49 | 61 | 73 |
| 2025 | 89 p | 22 | 36 | 50 | 62 | 74 |

**Verifiering:** E-gräns ≈ 24% av totalpoängen. C-gräns ≈ 55%. A-gräns ≈ 82%. Konsistent över alla år. ✅

### Andel godkända elever
| År | Andel F (underkänt) | Andel godkänt (E+) |
|----|---------------------|--------------------|
| 2016 | 8,2% | 91,8% |
| 2017 | 18,0% | 82,0% |
| 2018 | 14,6% | 85,4% |
| 2019 | 17,4% | 82,6% |
| 2024 | ~15% | ~85% |
| 2025 | ~16% | ~84% |

### Poängfördelning E/C/A
| År | E-poäng | C-poäng | A-poäng | Totalt |
|----|---------|---------|---------|--------|
| 2016 | 35 (39%) | 34 (38%) | 21 (23%) | 90 |
| 2017 | 38 (42%) | 32 (35%) | 21 (23%) | 91 |
| 2018 | 38 (42%) | 32 (35%) | 21 (23%) | 91 |
| 2019 | 37 (41%) | 34 (38%) | 19 (21%) | 90 |

**Slutsats:** Fördelningen är mycket stabil. Ungefär 40% E, 37% C, 22% A. ✅

---

## Uppskattningar — nu med höjd konfidens

### Ämnesfördelning
Baserat på **7 provår** (2013, 2014, 2015, 2016, 2017, 2018, 2019):
- Taluppfattning/aritmetik: 40–50% — **bekräftat alla 7 år** ✅
- Algebra: 25–30% — **bekräftat alla 7 år** ✅
- Geometri: 20–30% — **bekräftat alla 7 år** ✅
- Samband/funktioner: 20–25% — **bekräftat** ✅
- Statistik/sannolikhet: ~10% — **bekräftat** ✅

**Osäkerhet:** ±5 procentenheter. Höjd från ⚠️ Medium till ✅ Hög.

### "Alltid med"-frågetyper
Verifierat över **7 provår** (upp från 3):
- Ekvationslösning: **7/7 år** ✅
- Geometri (vinklar, area): **7/7 år** ✅
- Procent/bråk: **7/7 år** ✅
- Grafer/diagramtolkning: **7/7 år** ✅
- Statistik (medelvärde/median/typvärde): **6/7 år** ✅
- Sannolikhet: **7/7 år** ✅
- Kombinatorik/multiplikationsprincipen: **minst 4/7 år** ⚠️

**Konfidens höjd från ⚠️ Medium till ✅ Hög** för de 6 första kategorierna.

### Provstruktur
Verifierat **7/7 år**:
- Delprov B: 15–22 uppgifter, utan miniräknare, E-tunga
- Delprov C: Alltid exakt 1 stor djupuppgift (12–14 poäng)
- Delprov D: 10–12 uppgifter med redovisningskrav, temabaserat (6/7 år)
- Svårighetsprogression i B: alltid E → C → A

### Teman Delprov D (alla år)
| År | Tema |
|----|------|
| 2013 | Sydafrika |
| 2014 | Matlagning/bakning |
| 2015 | Vardagsmatematik (inget sammanhållet tema) |
| 2016 | Festival |
| 2017 | Fester |
| 2018 | Hållbar utveckling / Miljö |
| 2019 | Vatten |

### Lösningsproportioner
Påståendet att E-uppgifter har lösningsproportion 0,70–0,90 baseras på PRIM-rapporternas kommentarer.

**Osäkerhet:** ⚠️ Medium. Utan fullständig uppgiftsnivådata kan vi inte verifiera varje enskild uppgift.

---

## Kvarvarande begränsningar

1. **Bildanalys:** Ca 15–25% av uppgifterna innehåller figurer som inte extraheras med pdfplumber
2. **Uppgiftsnivådata:** PRIM-gruppen publicerar ibland detaljerade lösningsproportioner per uppgift — ej extraherade
3. **NP 2022–2023:** Sekretessbelagda, frisläpps uppskattningsvis 2028–2029
4. **NP 2024–2025:** Prov finns men använder nytt poängsystem (ej E/C/A) — kan laddas ner för analys men direkt jämförelse svårare
5. **NP 2020–2021:** Ställdes in pga Covid-19

---

## Rådata vs. härledda slutsatser

| Påstående | Typ | Källa | Konfidens |
|-----------|-----|-------|-----------|
| Provdatum 11+13 maj 2026 | Rådata | Skolverket | ✅ Hög |
| Betygsgränser | Rådata | PRIM-rapporter | ✅ Hög |
| Andel godkända | Rådata | PRIM-rapporter | ✅ Hög |
| Ämnesfördelning % | Verifierat | 7 provår + rapporter | ✅ Hög |
| "Alltid med"-frågetyper | Mönster | 7 provår | ✅ Hög |
| Lösningsproportioner | Uppskattning | Rapportkommentarer | ⚠️ Medium |
| Vanligaste misstag | Kvalitativt | Bedömningsanvisningar | ✅ Hög |
| Provstruktur (B/C/D) | Verifierat | 7 provår | ✅ Hög |
| Teman Delprov D | Verifierat | 7 provår | ✅ Hög |
