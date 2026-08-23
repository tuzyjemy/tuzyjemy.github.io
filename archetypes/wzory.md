---
title: "{{ replace .Name "-" " " | title }}"
description: "Kiedy używać tego pisma i na jakiej podstawie prawnej."
date: {{ .Date }}
draft: true

instytucje: []
tematy: []
lata: ["{{ now.Format "2006" }}"]
uwaga_prawna: true      # wyświetla ostrzeżenie „to nie jest porada prawna”
wzor: true
autor: "Zespół Tu Żyjemy"

pliki:                  # opcjonalne pliki do pobrania z katalogu static/pliki/
  # - tytul: "Pobierz .docx"
  #   url: "/pliki/nazwa.docx"
---

Krótko: kiedy to pismo ma sens, do kogo się je składa i w jakim terminie.

## Treść pisma

{{</* wzor */>}}
[MIEJSCOWOŚĆ], [DATA]

…
{{</* /wzor */>}}

## Jak wysłać
