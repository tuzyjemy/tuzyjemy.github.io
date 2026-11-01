# Tu Żyjemy — strona i baza wiedzy

Statyczna strona zbudowana w [Hugo](https://gohugo.io), publikowana automatycznie
na GitHub Pages. Pięć języków: polski (domyślny), rosyjski, angielski, ukraiński,
białoruski.

Sercem serwisu jest **baza wiedzy**: co zostało zrobione, jakie pisma wysłano, co
odpowiedziały instytucje, jakie orzeczenia warto cytować i ile realnie trwają sprawy.

> **Pracujesz z narzędziem AI?** Instrukcje dla asystentów programistycznych są
> w pliku [`AGENTS.md`](AGENTS.md) — opisuje architekturę i pułapki tego repozytorium
> dokładniej niż ten plik. `CLAUDE.md` jest tylko odnośnikiem do niego.

---

## 1. Pierwsze uruchomienie

### Wymagania

Hugo **extended** w wersji 0.156 lub nowszej (szablony używają `hugo.Data`
i `hugo.Sites`, dostępnych od 0.156). Obecnie pracujemy na 0.165.

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

Polecenie kończy się tabelką z liczbą stron w każdym języku. Stan odniesienia:
około 91 stron po polsku i 85 w każdym pozostałym języku, budowanie poniżej dwóch
sekund.

Hugo wypisuje przy tym kilkanaście ostrzeżeń `WARN deprecated` (`languageCode`,
`languageName`, `.Site.Data`, `.Site.Sites`). Są znane i niegroźne — nie znaczą, że
coś zepsułeś. Żeby zobaczyć tylko to, co istotne:

```bash
hugo --destination /tmp/sprawdzenie 2>&1 | grep -E "^ERROR|Total in"
```

Nie ma testów automatycznych ani lintera. **Czyste budowanie i zajrzenie do
wygenerowanego HTML to jedyna dostępna weryfikacja** — warto po każdej większej
zmianie.

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
   Publikację można też odpalić ręcznie (**Run workflow**). Pull requesty budują
   się osobno, bez publikowania (`.github/workflows/pr-build.yml`).

**Nie ma przebudowywania co godzinę.** Było potrzebne, dopóki strona główna
pokazywała licznik zgłoszeń pobierany z Mobilizona w trakcie budowania. Strona
zmienia się teraz tylko wtedy, gdy sami coś zmienimy. Szczegóły i warunek
przywrócenia — w komentarzu w `hugo.yml` oraz w punkcie 6.

---

## 3. Jak dodać treść

### Edytor dla osób nietechnicznych

Pod adresem **`/admin/`** działa [Sveltia CMS](https://github.com/sveltia/sveltia-cms) —
edytor w przeglądarce, który zapisuje zmiany wprost do repozytorium. Logowanie
tokenem GitHuba (`auth_methods: [token]`, zakres `public_repo`).

Włączony jest **tryb redakcyjny** (`publish_mode: editorial_workflow`): zapis tworzy
propozycję zmiany do zatwierdzenia, a nie publikuje od razu. Kolekcje w edytorze:
`publikacje`, `wzory`, `poradniki`, `strony`, `kampania`, `supporters`,
`opisy_sekcji`, `piaskownica`.

Konfiguracja edytora jest **generowana przez Hugo** z pliku `assets/admin/config.yml`
przez `layouts/_partials/cms-config.html`. Zmiany w szablonach mogą więc zepsuć
edytor — po takiej zmianie warto zajrzeć na `/admin/`.

### Nowe wpisy z wiersza poleceń

Prawie wszystko, co ma datę — aktualności, opisy działań, analizy, skutki — to
**publikacja** w jednym katalogu `content/publikacje/`:

```bash
hugo new content publikacje/spotkanie-otwarte.pl.md
hugo new content --kind dzialania publikacje/skarga-do-wsa-marzec-2027.pl.md
hugo new content --kind skutki publikacje/skutki-marzec-2027.pl.md
hugo new content wzory/wniosek-o-przyspieszenie.pl.md
hugo new content poradniki/jak-zlozyc-ponaglenie.pl.md
```

Dostępne szkielety (`archetypes/`): `default`, `publikacje`, `dzialania`,
`odpowiedzi`, `orzeczenia`, `poradniki`, `skutki`, `wzory`.

Po skończeniu pracy usuń `draft: true`.

### Rodzaj publikacji: `material_kind`

Rodzaj wpisu to **pole front matter, nie katalog**:

```yaml
material_kind: aktualnosci    # albo: dzialania, statystyki, skutki
```

`material_kind` **nie zmienia adresu strony** — wszystkie publikacje mieszkają pod
`/publikacje/`. Dawne osobne sekcje (`/aktualnosci/`, `/dzialania/`, `/statystyki/`,
`/skutki/`, `/odpowiedzi/`) już nie istnieją; stare odnośniki działają dzięki polu
`aliases` i przekierowaniom z `content/redirects/`.

Przy przenoszeniu istniejącej publikacji **zachowaj stary adres w `aliases`**.

Sekcje, które pozostają osobne: `publikacje`, `wzory` (wzory pism), `poradniki`,
`orzeczenia` (baza orzeczeń), `pomoc` (strona zbiorcza).

### Pola front matter

| Pole | Znaczenie |
| --- | --- |
| `title` | tytuł wpisu |
| `description` | jedno zdanie widoczne na liście i w wynikach wyszukiwania |
| `date` | data wpisu — po niej sortowana jest oś czasu |
| `lastmod` | data ostatniej istotnej zmiany |
| `material_kind` | rodzaj publikacji (patrz wyżej) |
| `tematy` | lista tematów — **wartości po polsku**, patrz punkt 5 |
| `instytucje` | lista adresatów, np. `["Sejm RP"]` |
| `lata` | rocznik, np. `["2026"]` |
| `autor` | domyślnie `Zespół Tu Żyjemy` |
| `aliases` | stare adresy, które mają dalej działać |
| `zrodlo` | odnośnik do źródła pokazywany w ramce z metadanymi |
| `data_wyslania`, `data_odpowiedzi` | daty w formacie `24.06.2026` |
| `sygnatura` | numer sprawy nadany przez urząd lub sąd |
| `wzor: true` | oznacza wpis jako wzór pisma (sekcja `wzory`) |
| `uwaga_prawna: true` | dodaje ostrzeżenie „to nie jest porada prawna" |
| `hide_link_translations: true` | wyłącza odnośniki do tłumacza przy odnośnikach w treści |

**Uwaga:** jedyną taksonomią Hugo jest `temat` (konfiguracja w `hugo.toml`).
`instytucje` i `lata` to zwykłe pola używane przez szablony — kiedyś były
taksonomiami i tworzyły strony zbiorcze, dziś już nie.

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

Pozostałe: `{{< slupki >}}` (wykres słupkowy), `{{< orz >}}` (tabela orzeczeń),
`{{< ulotki >}}` (ulotki do druku), `{{< kontakt >}}` (blok kontaktowy),
`{{< statystyki-dane >}}` (zestaw danych z `data/statystyki/`).

---

## 4. Statystyki i dane źródłowe

Analizy są publikacjami w `content/publikacje/` z `material_kind: statystyki`.
Porównanie międzywojewódzkie korzysta z danych w `data/statystyki/` — ścieżki do
danych są niezależne od publicznych adresów. Baza orzeczeń pozostaje pod
`/orzeczenia/`.

Informacja o niezależnym projekcie Kalendarz pobytu / Pobytrack jest
w `content/dolacz.<język>.md`, pod zakotwiczeniem `#pobytrack`.

Surowe dane wejściowe (arkusze, eksporty) trzymamy w `_source/`. Katalog nie jest
publikowany.

---

## 5. Tłumaczenia, tematy i adresy

### Języki to końcówki nazw plików

Kod języka jest **przyrostkiem nazwy pliku**, nie katalogiem:

```text
content/publikacje/example.pl.md
content/publikacje/example.en.md
content/publikacje/example.ru.md
content/publikacje/example.uk.md
content/publikacje/example.be.md
```

Zachowaj tę samą nazwę bazową we wszystkich tłumaczeniach — Hugo połączy je
automatycznie:

```bash
cp content/wzory/ponaglenie-bezczynnosc.pl.md content/wzory/ponaglenie-bezczynnosc.uk.md
```

### W treści pisz ścieżki polskie

Publiczne adresy sekcji różnią się między językami (ustawione w `hugo.toml`):

| Sekcja | PL | RU | EN | UK | BE |
| --- | --- | --- | --- | --- | --- |
| Publikacje | `/publikacje/` | `/ru/publikatsii/` | `/en/publications/` | `/uk/publikatsii/` | `/be/publikatsyi/` |
| Wzory pism | `/wzory/` | `/ru/obraztsy/` | `/en/templates/` | `/uk/zrazky/` | `/be/uzory/` |
| Poradniki | `/poradniki/` | `/ru/instruktsii/` | `/en/guides/` | `/uk/instruktsii/` | `/be/instruktsyi/` |
| Orzeczenia | `/orzeczenia/` | `/ru/resheniya-sudov/` | `/en/court-decisions/` | `/uk/rishennya-sudiv/` | `/be/rashenni-sudou/` |

W treści **zawsze pisz ścieżkę polską**:

```markdown
[wzór ponaglenia](/wzory/ponaglenie-bezczynnosc/)
```

`layouts/_markup/render-link.html` przepisze ją na adres w języku czytelnika, a jeśli
strona nie istnieje w tym języku — poprowadzi do wersji w innym. Ręcznie wpisany
`/ru/obraztsy/…` zepsuje to działanie.

### Tematy mają polskie wartości i tłumaczone etykiety

Pole `tematy` przyjmuje **polską wartość we wszystkich językach**: `Analizy`,
`Petycje`, `Współpraca`, `Wydarzenia`, `Poradniki`, `Wzory pism`.

Etykiety wyświetlane czytelnikowi są w `data/topiclabels.yaml`, kolory
w `data/topiccolors.yaml`. Przetłumaczona wartość w front matter cicho utworzy
drugi, niedziałający temat.

### Nawigacja i kolekcje

Menu, przypisanie sekcji do kolekcji oraz filtry tematyczne opisuje jeden plik —
`data/navigation.yaml`:

```yaml
collections:
  publikacje: [publikacje]
  pomoc: [poradniki, wzory]
```

Zmiana nawigacji to zmiana w tym pliku, nie w szablonach.

### Odnośniki do tłumacza

Działają dwa osobne mechanizmy — warto ich nie mieszać:

- **Nasze strony** bez tłumaczenia w języku czytelnika dostają odnośnik do Tłumacza
  Google z `layouts/_partials/gtranslate-url.html`. Kieruje on na **uproszczoną wersję
  dokumentu** (format wyjściowy `plain`, `layouts/single.plain.html`) — bez nawigacji
  i filtrów, bo tłumaczenie pełnej strony psuje układ.
- **Odnośniki zewnętrzne w treści** dostają plakietkę języka i — jeśli to ma sens —
  odnośnik do tłumaczenia. Decydują o tym dwa pliki: `data/linklangs.yaml` (host albo
  pełny adres → język; dopasowanie idzie od pełnego adresu, przez host, po domenę
  nadrzędną) i `data/linknotranslate.yaml` (hosty, przy których pokazujemy samą
  plakietkę, bo tłumacz nie ma czego pokazać — np. Google Docs wymaga logowania).

Dodając cytowane źródło zewnętrzne, zwykle trzeba dopisać jedną linię
do `linklangs.yaml`.

### Stare adresy

`aliases` w publikacjach utrzymują dawne odnośniki. Katalog `content/redirects/`
zawiera strony przekierowujące (`type: redirect`) dla adresów wycofanych całkowicie —
prowadzą do zakotwiczeń w archiwalnych publikacjach i są wyłączone z list oraz
z mapy strony. Publikowane są też dawne kanały RSS sekcji, dla istniejących
subskrybentów.

Napisy interfejsu są w `i18n/<język>.toml` (po ok. 165 kluczy). Nowy klucz trzeba
dodać do **wszystkich pięciu** plików — inaczej w danym języku wyświetli się surowa
nazwa klucza.

---

## 6. Strona główna

Kampanię z góry strony i karty „Możesz pomóc już teraz" edytuje się w katalogu
`data/campaign/`:

```
data/campaign/layout.yaml   struktura: wydarzenie, odnośniki, przełączniki
data/campaign/pl.yaml       teksty po polsku
data/campaign/ru.yaml       teksty po rosyjsku   (en, uk, be analogicznie)
```

Główny opis kampanii jest podzielony na pola `lead`, `boundary`, `principle` i `body`.
`boundary` zawiera krótkie doprecyzowanie zakresu i jest wyświetlane nieco grubszym
krojem; pozostałe pola zachowują zwykłą hierarchię akapitów.

Struktura jest opisana **raz**, w `layout.yaml`; pliki językowe zawierają wyłącznie
teksty i łączą się z nią przez pola `id`. Dodanie karty to jeden wpis w `layout.yaml`
plus tłumaczenia — bez dotykania szablonów.

**Pamiętaj:** `layout.yaml` jest wspólny dla wszystkich języków. Zmiana w nim dotyka
pięciu wersji strony naraz; zmiana w pliku językowym — tylko jednej.

Aby zakończyć kampanię, ustaw w `layout.yaml`:

```yaml
active: false
```

Blok zniknie ze strony głównej, a tłumaczenia zostaną na przyszłość.

### Panel obok nagłówka

Panel po prawej stronie ma dwa warianty, wybierane przez zawartość `layout.yaml`:

- **z wydarzeniem** (`event:`) — karta z datą, licznik zgłoszeń i przycisk „Przyjdę";
- **bez wydarzenia** (`followup:`) — wyniki ostatniego działania (`voteFacts`
  w pliku językowym) i przycisk prowadzący dalej, np. na Telegram.

Obecnie działa wariant drugi. Dopisanie bloku `event:` przywraca pierwszy bez zmian
w szablonach.

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

Liczbę zgłoszeń pobieramy **przy budowaniu strony** z publicznego API Mobilizona
(`layouts/_partials/event-attendance.html`). API zwraca wyłącznie liczbę — imiona
i adresy zgłaszających widzi tylko organizator wydarzenia. Osoba odwiedzająca stronę
nie łączy się z Mobilizonem; robi to nasz serwer budujący.

> **Ważne:** skoro licznik powstaje w trakcie budowania, a strona jest statyczna,
> przy wariancie z wydarzeniem trzeba **przywrócić blok `schedule:`**
> w `.github/workflows/hugo.yml`. Bez niego licznik zamarznie na chwili ostatniego
> wypchnięcia zmian.

W ustawieniach wydarzenia w Mobilizonie **włącz udział anonimowy** — inaczej
zgłoszenie wymaga zakładania konta.

Datę i miejsce wpisujemy w `layout.yaml`, a nie pobieramy z API, żeby strona
działała także wtedy, gdy Mobilizon nie odpowiada. Po zmianie terminu w Mobilizonie
trzeba poprawić je tutaj ręcznie.

---

## 7. Ustawienia w `hugo.toml`

```toml
baseURL   = "…"              # adres publikacji — koniecznie zmień
[params]
  telegram = "…"             # link w górnym pasku
  email    = "…"             # adres w stopce i w blokach kontaktowych
  phone    = "…"             # telefon w blokach kontaktowych
  formularzHistorii    = ""  # zewnętrzny formularz: opisz swoją sprawę
  formularzOrganizacji = ""  # zewnętrzny formularz: zgłoś organizację
  liczbaWydarzen    = 4      # ile wpisów na osi czasu na stronie głównej
  liczbaDzialan     = 3      # ile działań na stronie głównej
  liczbaAktualnosci = 3      # ile aktualności na stronie głównej
  repoEdycji = ""            # np. "https://github.com/org/repo" — dodaje w stopce
                             # link „Edytuj tę stronę"
```

Tam również: języki wraz z adresami sekcji (`permalinks`), taksonomia `temat`,
format wyjściowy `plain` używany przez odnośniki do tłumacza oraz menu główne.

Kolory i typografia: `assets/css/main.css`, sekcja `:root` na samej górze. Wszystkie
barwy zdefiniowane są raz, w wariancie jasnym i ciemnym — zmiana tam zmienia całą stronę.

---

## 8. Struktura katalogów

```
.
├── hugo.toml                 języki, adresy sekcji, taksonomia, formaty, menu
├── AGENTS.md  CLAUDE.md      instrukcje dla narzędzi AI
├── archetypes/               szkielety nowych wpisów (hugo new)
├── assets/
│   ├── css/main.css          style — paleta w :root
│   ├── js/site.js            filtry, menu, kopiowanie treści
│   └── admin/config.yml      źródło konfiguracji edytora Sveltia CMS
├── content/
│   ├── publikacje/           kronika — rodzaj wpisu w material_kind
│   ├── wzory/ poradniki/     wzory pism, poradniki
│   ├── orzeczenia/           baza orzeczeń WSA i NSA
│   ├── pomoc/ tematy/        strony zbiorcze
│   ├── redirects/            przekierowania z wycofanych adresów
│   ├── piaskownica/          piaskownica, poza listami
│   └── _index.*  o-nas.*  dolacz.*
├── data/
│   ├── campaign/             kampania: layout.yaml + plik na język
│   ├── navigation.yaml       menu, kolekcje, filtry tematyczne
│   ├── linklangs.yaml        języki odnośników zewnętrznych
│   ├── linknotranslate.yaml  hosty bez odnośnika do tłumacza
│   ├── topiclabels.yaml  topiccolors.yaml
│   ├── dates.yaml  langpriority.yaml  supporters.yaml  ulotki.yaml
│   └── statystyki/           dane do porównania międzywojewódzkiego
├── i18n/                     napisy interfejsu (5 plików)
├── layouts/
│   ├── baseof.html           szkielet strony
│   ├── home.html             strona główna
│   ├── list.html             listy sekcji (z filtrowaniem)
│   ├── single.html           pojedynczy wpis
│   ├── *.plain.html          uproszczona wersja dla tłumacza
│   ├── taxonomy.html  term.html        strony tematów
│   ├── collection/           listy kolekcji (publikacje, pomoc)
│   ├── orzeczenia/list.html  baza orzeczeń
│   ├── redirect/single.html  strona przekierowująca
│   ├── _markup/render-link.html        przepisywanie odnośników i plakietki
│   ├── _partials/            elementy wielokrotnego użytku
│   └── _shortcodes/          wzor, notatka, plik, slupki, orz, ulotki, kontakt
├── static/
│   ├── admin/                edytor Sveltia CMS
│   ├── pliki/                pliki do pobrania (.docx, .pdf)
│   └── img/                  obrazy
├── _source/                  surowe dane wejściowe (niepublikowane)
└── .github/workflows/
    ├── hugo.yml              publikacja na GitHub Pages
    └── pr-build.yml          budowanie pull requestów
```

---

## 9. Rzetelność, bezpieczeństwo i prywatność

Strona stawia publiczne tezy o działaniu instytucji, pod nazwą inicjatywy. Dlatego:

- **Nie wymyślamy liczb, dat, sygnatur ani cytatów.** Jeśli danej nie ma w repozytorium
  albo nie podał jej ktoś z zespołu — pytamy, a nie dopisujemy czegoś wiarygodnie
  wyglądającego.
- **Pilnujemy, kto co stwierdził.** „Policzyliśmy 200–300 osób" i „media podały ponad
  200" to dwa różne zdania. Nie powołujemy się na prasę w sprawach, które widzieliśmy
  sami, ani odwrotnie.
- **Obietnica to nie odpowiedź.** Zapowiedź na spotkaniu i formalna odpowiedź na
  petycję to osobne rzeczy i osobne wpisy.
- **Nie publikujemy danych osobowych osób prowadzących sprawy.** Odpowiedzi urzędów
  anonimizujcie przed wrzuceniem (imiona, adresy, numery dokumentów).
- Historia gita jest publiczna i **trwała**. Plik z danymi osobowymi usunięty
  następnym commitem nadal da się odczytać. Jeśli coś takiego się stanie, trzeba
  przepisać historię (`git filter-repo`) i wymusić push.
- Strona nie zawiera trackerów, skryptów zewnętrznych ani ciasteczek — jedyne żądanie
  na zewnątrz to krój Inter z Google Fonts (`layouts/_partials/head.html`). Jeśli
  chcecie usunąć i to, wgrajcie plik fontu do `static/` i podmieńcie tam odnośnik.
- Do zbierania zgłoszeń używajcie narzędzi, które nie profilują użytkowników.
  Obecnie: Mobilizon (potwierdzenia obecności). Inne warte rozważenia: CryptPad,
  Framaforms, własny Nextcloud.

---

## 10. Licencja

Treści — CC BY-SA 4.0. Kod strony — MIT. Szczegóły w pliku `LICENSE`.
