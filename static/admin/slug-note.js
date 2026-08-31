/* Objaśnienie pola „Przyjazny link” (slug).
 *
 * Sveltia generuje to pole sama i pokazuje je wyłącznie przy TWORZENIU wpisu,
 * a konfiguracja nie pozwala dopiąć do niego podpowiedzi ani uzależnić opisu
 * od tego, czy wpis jest nowy. Dlatego dostawiamy notkę z poziomu przeglądarki
 * i tylko wtedy, gdy pole naprawdę jest na ekranie.
 *
 * Celowo bez żadnych założeń co do wewnętrznych klas Sveltii: szukamy etykiety
 * po jej treści. Jeśli interfejs się zmieni albo zostanie przełączony na inny
 * język niż znane niżej, notka po prostu się nie pojawi — nic się nie zepsuje.
 */
(function () {
  var MARK = 'data-tz-slug-note';
  // etykiety pola slug w językach interfejsu, których używamy
  var LABELS = ['przyjazny link', 'slug', 'слаг', 'ярлык'];

  var section = function () {
    var m = /#\/collections\/([^\/?]+)/.exec(location.hash || '');
    return m && m[1] ? '/' + m[1] + '/' : '/…/';
  };

  var text = function () {
    return 'To jest adres strony: wpisane tu „protest-7-wrzesnia” da '
         + section() + 'protest-7-wrzesnia/. Wpisz je po polsku — wielkie litery, '
         + 'polskie znaki i spacje poprawią się same.';
  };

  // Etykieta pola slug, o ile jest na ekranie.
  //
  // Sveltia renderuje ją NIE jako <label>, tylko jako element z id
  // zakończonym na „-label” (input obok wskazuje go przez aria-labelledby),
  // a jej treść bierze z tłumaczenia klucza `slug`. Dlatego szukamy po id,
  // a tekst porównujemy z listą znanych tłumaczeń.
  var findLabel = function () {
    var nodes = document.querySelectorAll('[id$="-label"], label');
    for (var i = 0; i < nodes.length; i++) {
      var t = (nodes[i].textContent || '').trim().toLowerCase().replace(/\s+/g, ' ');
      if (LABELS.indexOf(t) !== -1) return nodes[i];
    }
    return null;
  };

  // najbliższy przodek, który zawiera również pole tekstowe
  var fieldBox = function (label) {
    var el = label;
    for (var i = 0; i < 6 && el; i++) {
      if (el.querySelector && el.querySelector('input, textarea')) return el;
      el = el.parentElement;
    }
    return null;
  };

  var sync = function () {
    try {
      var existing = document.querySelector('[' + MARK + ']');
      var label = findLabel();

      if (!label) {                       // pola nie ma (np. edycja istniejącego wpisu)
        if (existing) existing.remove();
        return;
      }
      if (existing) {                     // jest — tylko odśwież ścieżkę sekcji
        existing.textContent = text();
        return;
      }
      var box = fieldBox(label);
      if (!box) return;

      var p = document.createElement('p');
      p.setAttribute(MARK, '');
      p.textContent = text();
      p.style.cssText = [
        'margin:6px 0 0', 'font-size:12.5px', 'line-height:1.45',
        'opacity:.75', 'max-width:60ch'
      ].join(';');
      box.appendChild(p);
    } catch (e) {
      /* cicho — brak notki jest akceptowalny, błąd w panelu nie */
    }
  };

  var schedule = (function () {
    var t = null;
    return function () { clearTimeout(t); t = setTimeout(sync, 120); };
  })();

  if (typeof MutationObserver === 'function') {
    new MutationObserver(schedule).observe(document.documentElement, {
      childList: true, subtree: true
    });
  }
  window.addEventListener('hashchange', schedule);
  schedule();
})();
