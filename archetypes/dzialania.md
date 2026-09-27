---
title: "{{ replace .Name "-" " " | title }}"
description: "Jedno zdanie: co zrobiliśmy i wobec kogo."
date: {{ .Date }}
draft: true
material_kind: dzialania

instytucje: []          # np. ["Pomorski Urząd Wojewódzki"]
tematy: []              # Petycje | Wydarzenia | Współpraca | Analizy
lata: ["{{ now.Format "2006" }}"]

data_wyslania: ""       # 24.06.2026
data_odpowiedzi: ""
dni:                    # liczba dni od wysłania do odpowiedzi
termin: ""              # ustawowy termin odpowiedzi
sygnatura: ""
autor: "Zespół Tu Żyjemy"
---

## Czego dotyczy

## Przebieg

## Czego się nauczyliśmy
