Źródło karty podglądu (og:image) — static/img/og-default.png, 1200x630.

Płótno SVG jest kwadratowe (1200x1200), a właściwa karta leży w środkowym
pasie. qlmanage skaluje SVG do kwadratu, więc przy płótnie 1200x630
renderowałby obraz powiększony i przycięty. Dlatego rysujemy na kwadracie,
a potem wycinamy środek.

Aby przebudować:

  qlmanage -t -s 1200 -o . og-default.svg
  sips -c 630 1200 og-default.svg.png --out ../../static/img/og-default.png
  rm og-default.svg.png
