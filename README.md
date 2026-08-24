# Tu Żyjemy — strona i baza wiedzy

Statyczna strona zbudowana w [Hugo](https://gohugo.io), publikowana automatycznie
na GitHub Pages. Pięć języków: polski (domyślny), rosyjski, angielski, ukraiński,
białoruski.

Sercem serwisu jest **baza wiedzy**: co zostało zrobione, jakie pisma wysłano, co
odpowiedziały instytucje, jakie orzeczenia warto cytować i ile realnie trwają sprawy.

---

## 1. Pierwsze uruchomienie

### Wymagania

Hugo **extended** w wersji 0.156 lub nowszej (szablony używają `hugo.Data`
i `hugo.Sites`, dostępnych od 0.156).

```bash
# macOS
brew install hugo

# Linux (Debian/Ubuntu)
wget https://github.com/gohugoio/hugo/releases/download/v0.165.0/hugo_extended_0.165.0_linux-amd64.deb
sudo dpkg -i hugo_extended_0.165.0_linux-amd64.deb

# Windows
winget install Hugo.Hugo.Extended
```

### Podgląd lokalny

```bash
hugo server -D
```

Zmiany w plikach są widoczne natychmiast. Flaga `-D` pokazuje też wpisy oznaczone
`draft: true`.

`baseURL` w `hugo.toml` to `https://tuzyjemy.pl/` (bez podkatalogu), więc podgląd
lokalny działa pod zwykłym `http://localhost:1313/`.

### Sprawdzenie, czy wszystko się buduje

```bash
hugo --minify          # pełne budowanie do katalogu public/
```

Polecenie kończy się podsumowaniem (liczba stron w każdym języku). Ostrzeżenia
i błędy szablonów pojawiają się na wyjściu — brak komunikatów oznacza, że jest dobrze.

---

## 2. Publikacja na GitHub Pages

1. Utwórz repozytorium na GitHubie i wgraj do niego zawartość tego katalogu:

   ```bash
   git init
   git add .
   git commit -m "Pierwsza wersja strony"
   git branch -M main
   git remote add origin git@github.com:NAZWA-ORGANIZACJI/NAZWA-REPO.git
   git push -u origin main
   ```

2. W repozytorium: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

3. `baseURL` w `hugo.toml` jest już ustawiony na docelową domenę
   (`https://tuzyjemy.pl/`), a plik `static/CNAME` zawiera `tuzyjemy.pl` —
   w ustawieniach repozytorium (**Settings → Pages → Custom domain**) wpisz
   tę samą domenę i skonfiguruj DNS zgodnie ze wskazówkami GitHuba.

4. Każdy `git push` do gałęzi `main` uruchamia publikację
   (`.github/workflows/hugo.yml`). Postęp widać w zakładce **Actions**.

---

## 3. Jak dodać treść

### Nowe działanie („Co zrobiliśmy")

```bash
hugo new content/pl/dzialania/skarga-do-wsa-marzec-2027.md
```

Powstanie plik z gotowym szkieletem. Usuń `draft: true`, gdy wpis jest gotowy.

Analogicznie dla pozostałych sekcji:

```bash
hugo new content/pl/wzory/wniosek-o-przyspieszenie.md
hugo new content/pl/orzeczenia/wsa-krakow-2027.md
hugo new content/pl/odpowiedzi/udsc-odpowiedz-2027.md
hugo new content/pl/aktualnosci/spotkanie-otwarte.md
```

### Pola front matter

| Pole | Znaczenie |
| --- | --- |
| `title` | tytuł wpisu |
| `description` | jedno zdanie widoczne na liście i w wynikach wyszukiwania |
| `date` | data wpisu — po niej sortowana jest oś czasu |
| `instytucje` | lista adresatów, np. `["Sejm RP"]` — tworzy stronę zbiorczą |
| `tematy` | lista tematów, np. `["Przewlekłość postępowań"]` |
| `statusy` | stan sprawy, np. `["Oczekuje na odpowiedź"]` |
| `lata` | rocznik, np. `["2026"]` |
| `data_wyslania`, `data_odpowiedzi` | daty w formacie `24.06.2026` |
| `dni` | liczba dni od wysłania do odpowiedzi |
| `sygnatura` | numer sprawy nadany przez urząd lub sąd |
| `sad`, `wynik` | tylko dla sekcji `orzeczenia` |
| `uwaga_prawna: true` | dodaje ostrzeżenie „to nie jest porada prawna" |

**Ważne:** `instytucje`, `tematy`, `statusy` i `lata` to taksonomie — nazwy muszą być
w liczbie mnogiej i muszą być listami, nawet gdy wartość jest jedna.

### Skróty (shortcodes) do użycia w treści

Kopiowalny blok z treścią pisma:

```
{{< wzor >}}
[MIEJSCOWOŚĆ], [DATA]
…
{{< /wzor >}}
```

Wyróżniona uwaga:

```
{{< notatka >}}Ostrzeżenie{{< /notatka >}}
{{< notatka typ="info" >}}Informacja{{< /notatka >}}
```

Przycisk pobierania (plik wrzuć do `static/pliki/`):

```
{{< plik url="/pliki/skarga.docx" tytul="Pobierz .docx" >}}
```

---

## 4. Statystyki

Nie prowadzimy własnych statystyk. Strona `/statystyki/` odsyła do projektu
**Kalendarz pobytu** ([@pobytrack](https://t.me/pobytrack)), który zbiera dane
o realnych terminach w sprawach pobytowych. Treść tej strony to zwykły tekst
w `content/<język>/statystyki/_index.md` — nic się nie przelicza.

Docelowo chcemy zrobić to wspólnie z pobytrack; wtedy rozwiązanie będzie
wyglądało inaczej niż dawne wykresy liczone z pliku CSV.

---

## 5. Tłumaczenia

Każdy język ma własny katalog w `content/`:

```
content/pl/   ← polski (domyślny, adresy bez prefiksu)
content/en/   ← /en/…
content/ru/   ← /ru/…
content/uk/   ← /uk/…
content/be/   ← /be/…
```

Aby przetłumaczyć wpis, skopiuj plik pod **tą samą ścieżką i nazwą** do katalogu
innego języka. Hugo automatycznie połączy wersje i przełącznik języka pokaże
tłumaczenie zamiast strony głównej.

```bash
cp content/pl/wzory/ponaglenie-bezczynnosc.md content/uk/wzory/ponaglenie-bezczynnosc.md
```

Nazwy katalogów sekcji zostają polskie (`wzory`, `dzialania`…), ale **adresy URL
są tłumaczone** — konfiguracja w `hugo.toml`, sekcja `permalinks`:

| Sekcja | PL | EN | RU | UK | BE |
| --- | --- | --- | --- | --- | --- |
| działania | `/dzialania/` | `/en/actions/` | `/ru/deystviya/` | `/uk/diyi/` | `/be/dzejanni/` |
| wzory | `/wzory/` | `/en/templates/` | `/ru/obraztsy/` | `/uk/zrazky/` | `/be/uzory/` |
| orzeczenia | `/orzeczenia/` | `/en/court-decisions/` | `/ru/resheniya-sudov/` | `/uk/rishennya-sudiv/` | `/be/rashenni-sudou/` |
| odpowiedzi | `/odpowiedzi/` | `/en/responses/` | `/ru/otvety/` | `/uk/vidpovidi/` | `/be/adkazy/` |
| statystyki | `/statystyki/` | `/en/statistics/` | `/ru/statistika/` | `/uk/statystyka/` | `/be/statystyka/` |
| aktualności | `/aktualnosci/` | `/en/news/` | `/ru/novosti/` | `/uk/novyny/` | `/be/navisy/` |

Napisy interfejsu (przyciski, nagłówki, etykiety) są w `i18n/pl.toml`, `i18n/en.toml` itd.
Klucze muszą być identyczne we wszystkich plikach.

---

## 6. Strona główna

Kampanię z góry strony i karty „Możesz pomóc już teraz" edytuje się w katalogu
`data/campaign/`:

```
data/campaign/layout.yaml   struktura: wydarzenie, odnośniki, przełączniki
data/campaign/pl.yaml       teksty po polsku
data/campaign/ru.yaml       teksty po rosyjsku   (en, uk, be analogicznie)
```

Struktura jest opisana **raz**, w `layout.yaml`; pliki językowe zawierają wyłącznie
teksty i łączą się z nią przez pola `id`. Dodanie karty to jeden wpis w `layout.yaml`
plus tłumaczenia — bez dotykania szablonów.

Aby zakończyć kampanię, ustaw w `layout.yaml`:

```yaml
active: false
```

Blok zniknie ze strony głównej, a tłumaczenia zostaną na przyszłość.

### Potwierdzanie obecności

Strona jest statyczna, więc **zgłoszeń nie zbieramy u siebie**. Wydarzenie żyje
w [Mobilizonie](https://mobilizon.fr), a przycisk „Przyjdę" prowadzi na jego stronę:

```yaml
event:
  url: "https://mobilizon.fr/events/…"
  date: "2026-09-07"
  timeStart: "16:30"
  timeEnd: "18:00"
  place: "…"
  address: "…"
```

Liczbę zgłoszeń pobieramy przy budowaniu strony z publicznego API Mobilizona
(`event-attendance.html`). API zwraca **wyłącznie liczbę** — imiona i adresy
zgłaszających widzi tylko organizator wydarzenia. Osoba odwiedzająca stronę
główną nie łączy się z Mobilizonem; robi to nasz serwer budujący, co 6 godzin
(harmonogram w `.github/workflows/hugo.yml`).

W ustawieniach wydarzenia w Mobilizonie **włącz udział anonimowy** — inaczej
zgłoszenie wymaga zakładania konta.

Datę i miejsce wpisujemy w `layout.yaml`, a nie pobieramy z API, żeby strona
działała także wtedy, gdy Mobilizon nie odpowiada. Po zmianie terminu w Mobilizonie
trzeba poprawić je tutaj ręcznie.

---

## 7. Ustawienia w `hugo.toml`

```toml
baseURL   = "…"           # adres publikacji — koniecznie zmień
[params]
  telegram = "…"          # link w górnym pasku
  email    = "…"          # adres w stopce i w blokach kontaktowych
  liczbaWydarzen = 4      # ile wpisów na osi czasu na stronie głównej
  liczbaAktualnosci = 3   # ile aktualności na stronie głównej
  repoEdycji = ""         # np. "https://github.com/org/repo" — dodaje w stopce
                          # link „Edytuj tę stronę"
```

Kolory i typografia: `assets/css/main.css`, sekcja `:root` na samej górze. Wszystkie
barwy zdefiniowane są raz, w wariancie jasnym i ciemnym — zmiana tam zmienia całą stronę.

---

## 8. Struktura katalogów

```
.
├── hugo.toml                 konfiguracja: języki, taksonomie, menu, adresy
├── archetypes/               szkielety nowych wpisów (hugo new)
├── assets/
│   ├── css/main.css          style — paleta w :root
│   └── js/site.js            filtry, menu, kopiowanie treści
├── content/
│   ├── pl/ en/ ru/ uk/ be/   treść, po jednym katalogu na język
├── i18n/                     napisy interfejsu
├── layouts/
│   ├── baseof.html           szkielet strony
│   ├── home.html             strona główna
│   ├── list.html             listy sekcji (z filtrowaniem)
│   ├── single.html           pojedynczy wpis
│   ├── term.html             strony taksonomii
│   ├── statystyki/list.html  strona statystyk (odsyła do pobytrack)
│   ├── _partials/            elementy wielokrotnego użytku
│   └── _shortcodes/          wzor, notatka, plik
├── static/
│   ├── pliki/                pliki do pobrania (.docx, .pdf)
│   └── img/                  obrazy
└── .github/workflows/hugo.yml   automatyczna publikacja
```

---

## 9. Bezpieczeństwo i prywatność

Kilka rzeczy warto trzymać się od początku:

- **Nie publikujcie danych osobowych osób prowadzących sprawy.** Odpowiedzi urzędów
  zanonimizujcie przed wrzuceniem (imiona, adresy, numery dokumentów).
- Historia gita jest publiczna i **trwała**. Plik z danymi osobowymi usunięty
  następnym commitem nadal da się odczytać. Jeśli coś takiego się stanie, trzeba
  przepisać historię (`git filter-repo`) i wymusić push.
- Strona nie zawiera żadnych trackerów, skryptów zewnętrznych ani ciasteczek —
  jedyne żądanie na zewnątrz to font z Google Fonts. Jeśli chcecie usunąć i to,
  wgrajcie plik fontu do `static/` i podmieńcie odnośnik w `layouts/_partials/head.html`.
- Do zbierania zgłoszeń używajcie narzędzi, które nie profilują użytkowników.
  Obecnie: Mobilizon (potwierdzenia obecności). Inne warte rozważenia: CryptPad,
  Framaforms, własny Nextcloud.

---

## 10. Licencja

Treści — CC BY-SA 4.0. Kod strony — MIT. Szczegóły w pliku `LICENSE`.
