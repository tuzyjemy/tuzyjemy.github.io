---
title: "{{ replace .Name "-" " " | title }}"
description: "Kto odpowiedział, na co i z jakim skutkiem."
date: {{ .Date }}
draft: true
material_kind: odpowiedzi

instytucje: []
tematy: []
statusy: []
lata: ["{{ now.Format "2006" }}"]

data_wyslania: ""
data_odpowiedzi: ""
dni:
sygnatura: ""
linked_action: "" # Canonical action path, e.g. /publikacje/petycja-sejm-legalizacja/
---

## Co napisał urząd

> Cytat z odpowiedzi.

## Nasza ocena
