---
title: "Piaskownica redakcyjna"
description: "Miejsce do testowania panelu redakcyjnego. Nic tu nie jest treścią serwisu."
noindex: true
build:
  list: never
  render: always
  publishResources: true
# `cascade` przenosi te ustawienia na wszystkie wpisy w sekcji — także te,
# które dopiero powstaną w panelu. Dzięki temu nowy wpis testowy nie trafi
# do list, kanału RSS ani mapy strony bez dodatkowego pamiętania o tym.
cascade:
  noindex: true
  build:
    list: never
    render: always
---

{{< notatka typ="info" >}}
**To jest piaskownica.** Sekcja służy wyłącznie do sprawdzania, jak działa panel
redakcyjny i obieg z pull requestami. Nie ma jej w menu, w mapie strony ani w wyszukiwarce.
Wpisy stąd nie pojawiają się nigdzie indziej w serwisie — można je swobodnie tworzyć,
zmieniać i kasować.
{{< /notatka >}}

Jak przetestować obieg redakcyjny:

1. Wejdź do panelu pod [/admin/](/admin/) i zaloguj się tokenem.
2. Wybierz kolekcję **Piaskownica** i utwórz wpis.
3. Zapisz — panel założy gałąź `cms/piaskownica_pl/<slug>` i otworzy pull request (na początku jako szkic).
4. Zmień status na **W recenzji**, potem **Gotowe** — zmieni się etykieta pull requesta.
5. Kliknij **Opublikuj** — pull request zostanie scalony, gałąź skasowana, a strona przebudowana.
6. Albo **Odrzuć** — pull request zamknie się bez scalania, a gałąź zniknie.

Na `main` nie trafia nic aż do publikacji.
