---
title: "{{ replace .Name "-" " " | title }}"
description: "Jedno zdanie: co zrobiliśmy i wobec kogo."
date: {{ .Date }}
draft: true

instytucje: []          # np. ["Pomorski Urząd Wojewódzki"]
tematy: []              # np. ["Przewlekłość postępowań"]
statusy: ["W toku"]     # Planowane | W toku | Wysłane | Oczekuje na odpowiedź |
                        # Odpowiedź otrzymana | Częściowo uwzględnione |
                        # Uwzględnione | Odrzucone | Bez odpowiedzi | Zakończone
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
