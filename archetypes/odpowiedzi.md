---
title: "{{ replace .Name "-" " " | title }}"
description: "Kto odpowiedział, na co i z jakim skutkiem."
date: {{ .Date }}
draft: true

instytucje: []
tematy: []
statusy: []
lata: ["{{ now.Format "2006" }}"]

data_wyslania: ""
data_odpowiedzi: ""
dni:
sygnatura: ""
---

## Co napisał urząd

> Cytat z odpowiedzi.

## Nasza ocena
