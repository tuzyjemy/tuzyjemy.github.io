# AGENTS.md — Tu Żyjemy

Instructions for AI coding agents working in this repository. Written for a cold
start: read this before touching files. Human-facing setup and editing docs live in
`README.md` (note: parts of the README predate the `publikacje` restructure — this
file is authoritative where they disagree).

## What this project is

**tuzyjemy.pl** — the website and public knowledge base of *Tu Żyjemy*, a grassroots
migrants'-rights initiative in Pomerania, Poland. It campaigns on residence-permit
proceedings that take two years and longer.

Static site: **Hugo 0.165 extended**, published to GitHub Pages. Five languages:
**pl** (default, no URL prefix), **ru**, **en**, **uk**, **be**.

It serves two audiences at once, and that tension drives most editorial decisions:

- **migrants** who need practical help — their main language is **Russian**;
- **Polish public opinion and press** — their language is **Polish**.

So `ru` and `pl` are the load-bearing languages. When a change can't be made in all
five at once, do `ru` and `pl` first and say which languages still lag.

### Editorial standards

This site makes factual claims about institutions, in public, as a named initiative.
That raises the bar above ordinary web copy:

- **Never invent a fact, figure, date, case number or quotation.** If a number isn't
  in the repo or supplied by the user, ask. Writing a plausible-looking statistic into
  this site is a serious failure, not a draft.
- **Keep attribution straight.** "We counted 200–300 people" and "media reported over
  200" are different claims. Don't let the site cite the press for things the
  initiative witnessed itself, or vice versa.
- **Separate promises from answers.** A spoken announcement at a meeting is not a
  formal reply to a petition. Record them separately.
- **Don't publish personal data.** Anonymise names, addresses and document numbers in
  institutional replies before committing. Git history is public and permanent — a
  leak removed in a later commit is still readable, and fixing it means rewriting
  history.

## Commands

```bash
hugo server -D                      # local preview at http://localhost:1313/
hugo --destination /tmp/chk         # throwaway build; the real check
hugo --minify                       # production build into public/
```

There is no test suite and no linter. **A clean `hugo` build plus inspecting the
rendered HTML is the only verification available** — use it after every change.

Expect ~14 `WARN deprecated` lines (`languageCode`, `languageName`, `.Site.Data`,
`.Site.Sites`). They are pre-existing and unrelated to your change. Filter them:

```bash
hugo --destination /tmp/chk 2>&1 | grep -E "^ERROR|Total in"
```

Current baseline: builds clean, ~91 PL / 85 per other language, ~1.2 s.

## Architecture: the five things that aren't obvious

### 1. Languages are filename suffixes, not directories

```
content/publikacje/example.pl.md    →  /publikacje/example/
content/publikacje/example.ru.md    →  /ru/publikatsii/example/
```

Keep the **same basename** across translations; Hugo links them automatically. There
is no `content/<lang>/` tree (an older layout, still shown in README §8 — ignore it).

### 2. Everything chronicle-like is one section: `publikacje`

`content/publikacje/` holds ~20 publications × 5 languages. Their *kind* is front
matter, not a directory:

```yaml
material_kind: aktualnosci   # news        (also: dzialania, statystyki, skutki)
```

`material_kind` **does not affect the URL**. The old `/aktualnosci/`, `/dzialania/`
etc. sections no longer exist; `aliases` in front matter keep their old links alive,
and `content/redirects/` holds meta-refresh stubs for retired pages (see §5).

Sections that remain real: `publikacje`, `wzory` (letter templates), `poradniki`
(guides), `orzeczenia` (court-rulings database), `pomoc` (hub page).

### 3. Per-language URLs come from `hugo.toml`, Polish paths from the link hook

Each language defines its own `permalinks.page` / `permalinks.section`:

| Section | pl | ru | en | uk | be |
| --- | --- | --- | --- | --- | --- |
| publikacje | `/publikacje/` | `/publikatsii/` | `/publications/` | `/publikatsii/` | `/publikatsyi/` |
| wzory | `/wzory/` | `/obraztsy/` | `/templates/` | `/zrazky/` | `/uzory/` |
| poradniki | `/poradniki/` | `/instruktsii/` | `/guides/` | `/instruktsii/` | `/instruktsyi/` |
| orzeczenia | `/orzeczenia/` | `/resheniya-sudov/` | `/court-decisions/` | `/rishennya-sudiv/` | `/rashenni-sudou/` |

**In Markdown, always write the Polish path.** `layouts/_markup/render-link.html`
rewrites it to the reader's language, and falls back to another language's version if
the page doesn't exist in theirs:

```markdown
[wzór ponaglenia](/wzory/ponaglenie-bezczynnosc/)
```

Never hand-write `/ru/obraztsy/...` in content.

### 4. Two separate translation mechanisms — don't confuse them

**Our own pages** that lack a translation get a Google Translate link built by
`layouts/_partials/gtranslate-url.html`. It points at the **`plain` output format**
(`layouts/single.plain.html`, declared in `hugo.toml` `[outputFormats]`) — a
navigation-free version of the document, because translating the full page wrecks the
layout.

**External links in content** get a language badge and, where useful, a translate
link, driven by two data files:

- `data/linklangs.yaml` — host → language. Resolved **exact URL first, then host, then
  parent domain**, so a single URL can be marked without claiming its whole host. (Our
  three Google Docs are marked individually; `docs.google.com` as a whole is not,
  because files there are in mixed languages.)
- `data/linknotranslate.yaml` — hosts that get the badge but **no** translate link,
  because Translate can't render them (Google Docs needs sign-in and builds text with
  scripts). Per-page escape hatch: `hide_link_translations: true`.

Adding a cited external source usually means adding one line to `linklangs.yaml`.

### 5. Collections and navigation share one source of truth

`data/navigation.yaml` defines the menu, which sections belong to which public
collection, and the topic facets shown on each:

```yaml
collections:
  publikacje: [publikacje]
  pomoc: [poradniki, wzory]
```

`layouts/_partials/collection-for.html` resolves a section to its collection;
`layouts/collection/list.html` renders it. Changing navigation means editing this YAML,
not templates.

## Conventions and traps

### Topics are Polish keys with translated labels

`tematy` in front matter takes the **Polish canonical value** in every language
(`Analizy`, `Petycje`, `Współpraca`, `Wydarzenia`, `Poradniki`, `Wzory pism`). Display
labels live in `data/topiclabels.yaml`, colours in `data/topiccolors.yaml`. A
translated value in front matter silently creates a second, broken topic.

`temat` is the **only** Hugo taxonomy (`hugo.toml`). `instytucje` and `lata` are plain
front-matter params used by templates — not taxonomies, despite what README §3 says.

### The homepage campaign is split structure / text

```
data/campaign/layout.yaml     structure shared by ALL languages: event, links, toggles
data/campaign/{pl,ru,en,uk,be}.yaml   text only
```

Edit `layout.yaml` and you change all five languages at once. Edit a language file and
only that language changes. Joined by `id` keys in
`layouts/_partials/campaign.html`; rendered by `layouts/home.html` and
`_partials/attend.html`.

`active: false` in `layout.yaml` retires the campaign, keeping translations for later.
Restoring an `event:` block restores the RSVP panel with no template edit — and if you
do, also restore the `schedule:` cron in `.github/workflows/hugo.yml`, since the
attendance counter is fetched at build time and would otherwise freeze.

### Shortcodes

```
{{< notatka >}}warning{{< /notatka >}}        {{< notatka typ="info" >}}info{{< /notatka >}}
{{< wzor >}}copyable letter text{{< /wzor >}}
{{< plik url="/pliki/x.docx" tytul="Download" >}}
{{< slupki >}}  {{< orz >}}  {{< ulotki >}}  {{< kontakt >}}  {{< statystyki-dane >}}
```

### Anchors in non-Latin headings

Hugo keeps diacritics and Cyrillic in heading `id`s. `## Media o proteście` →
`id="media-o-proteście"`, `## СМИ о протесте` → `id="сми-о-протесте"`. In-page links
must match exactly (they percent-encode in `href`, which is fine). **Always verify
anchors against built HTML** — a wrong one fails silently.

### UI strings

`i18n/{pl,ru,en,uk,be}.toml`, ~165 keys each. Add a key to **all five** files or that
language renders the raw key name.

### Editing via CMS

Non-technical editors use **Sveltia CMS** at `/admin/`. Its config is *generated* by
`layouts/_partials/cms-config.html` from `assets/admin/config.yml` — so template
changes can break the editor. `publish_mode: editorial_workflow`. Collections:
`publikacje`, `wzory`, `poradniki`, `strony`, `kampania`, `supporters`, `opisy_sekcji`,
`piaskownica`.

Validating that config: Ruby's YAML parser is too permissive to catch real errors —
use the JavaScript `yaml` package instead. For `data/*.yaml`, Hugo's own build is the
authoritative check.

## Deploy

`.github/workflows/hugo.yml` → GitHub Pages, on **push to `main`** and manual
`workflow_dispatch`. There is deliberately **no scheduled rebuild** (see the comment
in that file). `pr-build.yml` builds pull requests. Custom domain via `static/CNAME`.

## Working style in this repo

- **Verify in the built output, not the source.** Grep `/tmp/chk` for rendered links,
  anchors, badges and counts. A change that looks right in Markdown can render wrong.
- **After a bulk edit, re-grep for the old string.** A partial sweep reports success
  identically to a complete one.
- **Check cross-language consistency.** Counts, dates and figures drift between the
  five files. When you change a number, grep all languages for the old one.
- **Don't widen scope silently.** Removing an obsolete call-to-action from a chronicle
  entry is not licence to remove the same link where it's a live call to action.
- The user handles `git commit` and `git push` themselves unless they ask otherwise.

## Layout

```
hugo.toml                   languages, permalinks, taxonomy, outputs, params, menu
content/
  publikacje/               the chronicle — material_kind picks the kind
  wzory/ poradniki/         letter templates, guides
  orzeczenia/               court-rulings database
  pomoc/ tematy/            hub pages
  redirects/                meta-refresh stubs for retired URLs
  piaskownica/              sandbox, excluded from listings
  _index.*  o-nas.*  dolacz.*
data/
  campaign/                 homepage campaign: layout.yaml + one file per language
  navigation.yaml           menu, collections, topic facets
  linklangs.yaml            external-link languages (URL → host → parent domain)
  linknotranslate.yaml      hosts with badge but no translate link
  topiclabels.yaml topiccolors.yaml
  dates.yaml langpriority.yaml supporters.yaml ulotki.yaml
  statystyki/               datasets for the regional comparison
layouts/
  _markup/render-link.html  THE link hook: Polish paths → per-language URLs, badges
  _partials/                campaign, attend, collection-*, gtranslate-url, meta-box …
  _shortcodes/              notatka, wzor, plik, slupki, orz, ulotki, kontakt
  collection/ orzeczenia/ redirect/
  *.plain.html              navigation-free output used by translate links
i18n/                       UI strings, 5 files
assets/css/main.css         palette in :root, light + dark
assets/admin/config.yml     Sveltia CMS source config
static/pliki/ static/img/   downloads and images
.github/workflows/          hugo.yml (deploy), pr-build.yml
```
