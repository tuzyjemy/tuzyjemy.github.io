---
title: "{{ replace .Name "-" " " | title }}"
description: "Jednozdaniowe streszczenie tego, co sąd rozstrzygnął."
date: {{ .Date }}
draft: true

sad: ""                 # np. "Wojewódzki Sąd Administracyjny w Gdańsku"
sygnatura: ""           # np. "III SAB/Gd 118/25"
wynik: ""               # np. "Skarga uwzględniona, grzywna 2 000 zł"
zrodlo: "https://orzeczenia.nsa.gov.pl/"

instytucje: []
tematy: []
statusy: []
lata: ["{{ now.Format "2006" }}"]
---

## Teza

## Dlaczego to ważne

## Jak to wykorzystać
