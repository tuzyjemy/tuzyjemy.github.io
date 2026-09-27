/* Tu Żyjemy — skrypty interfejsu.
   Bez zewnętrznych bibliotek. Wszystko działa też przy wyłączonym JS
   (filtry są wtedy po prostu niewidoczne, a lista pełna). */

(function () {
  "use strict";

  /* ------------------------------------------------- menu mobilne */
  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  if (header && navToggle) {
    navToggle.addEventListener("click", function () {
      var open = header.getAttribute("data-nav") === "open";
      header.setAttribute("data-nav", open ? "closed" : "open");
      navToggle.setAttribute("aria-expanded", String(!open));
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && header && navToggle && header.getAttribute("data-nav") === "open") {
      header.setAttribute("data-nav", "closed");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.focus();
    }
  });

  /* ------------------------------------------------- przełącznik języka */
  var lang = document.querySelector(".lang");
  if (lang) {
    var langToggle = lang.querySelector(".lang-toggle");
    langToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = lang.getAttribute("data-open") === "true";
      lang.setAttribute("data-open", open ? "false" : "true");
      langToggle.setAttribute("aria-expanded", String(!open));
    });
    document.addEventListener("click", function () {
      lang.setAttribute("data-open", "false");
      langToggle.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        lang.setAttribute("data-open", "false");
        langToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ------------------------------------------------- filtrowanie list */
  document.querySelectorAll("[data-filterable]").forEach(function (root) {
    var items = Array.prototype.slice.call(root.querySelectorAll("[data-item]"));
    var chips = Array.prototype.slice.call(root.querySelectorAll(".chip[data-facet]"));
    var dependentFilters = root.hasAttribute("data-dependent-filters");
    var urlFilters = root.hasAttribute("data-url-filters");
    var search = root.querySelector(".search-input");
    var summary = root.querySelector("[data-count]");
    var empty = root.querySelector("[data-empty]");
    var clear = root.querySelector("[data-clear]");
    var active = {};

    function readUrl() {
      if (!urlFilters) return;
      var params = new URLSearchParams(window.location.search);
      var topic = params.get("temat");
      active = {};
      chips.forEach(function (chip) {
        var selected = chip.getAttribute("data-facet") === "tematy" && chip.getAttribute("data-value") === topic;
        chip.setAttribute("aria-pressed", String(selected));
        if (selected) active.tematy = topic;
      });
      if (search) search.value = params.get("q") || "";
    }

    function writeUrl(method) {
      if (!urlFilters) return;
      var url = new URL(window.location.href);
      if (active.tematy) url.searchParams.set("temat", active.tematy);
      else url.searchParams.delete("temat");
      if (search && search.value.trim()) url.searchParams.set("q", search.value.trim());
      else url.searchParams.delete("q");
      if (url.href !== window.location.href) window.history[method](null, "", url);
    }

    function matches(item, ignoredFacet) {
      for (var facet in active) {
        if (!active[facet] || facet === ignoredFacet) continue;
        var values = (item.getAttribute("data-" + facet) || "").split("|");
        if (values.indexOf(active[facet]) === -1) return false;
      }
      if (search && search.value.trim()) {
        var q = search.value.trim().toLowerCase();
        if ((item.getAttribute("data-search") || "").toLowerCase().indexOf(q) === -1) {
          return false;
        }
      }
      return true;
    }

    function apply() {
      var shown = 0;
      items.forEach(function (item) {
        var ok = matches(item);
        item.hidden = !ok;
        if (ok) shown++;
      });
      if (summary) summary.textContent = String(shown);
      if (empty) empty.hidden = shown !== 0;
      if (dependentFilters) {
        chips.forEach(function (chip) {
          var facet = chip.getAttribute("data-facet");
          var value = chip.getAttribute("data-value");
          // Keep the current choice operable, even when search yields no results.
          // Alternatives ignore their own facet so switching remains possible.
          var available = active[facet] === value || items.some(function (item) {
            var values = (item.getAttribute("data-" + facet) || "").split("|");
            return values.indexOf(value) !== -1 && matches(item, facet);
          });
          chip.disabled = !available;
        });
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var facet = chip.getAttribute("data-facet");
        var value = chip.getAttribute("data-value");
        var isOn = chip.getAttribute("aria-pressed") === "true";
        root.querySelectorAll('.chip[data-facet="' + facet + '"]').forEach(function (c) {
          c.setAttribute("aria-pressed", "false");
        });
        if (isOn || !value) {
          active[facet] = null;
        } else {
          active[facet] = value;
          chip.setAttribute("aria-pressed", "true");
        }
        apply();
        writeUrl("pushState");
      });
    });

    if (search) {
      /* Duże tabele (np. orzeczenia — kilka tysięcy wierszy) przeliczają się
         przy każdym naciśnięciu klawisza; krótkie opóźnienie usuwa zacinanie. */
      var t = null;
      search.addEventListener("input", function () {
        clearTimeout(t);
        t = setTimeout(function () {
          apply();
          writeUrl("replaceState");
        }, items.length > 500 ? 160 : 0);
      });
    }
    if (clear) {
      clear.addEventListener("click", function () {
        active = {};
        chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        if (search) search.value = "";
        apply();
        writeUrl("pushState");
      });
    }
    if (urlFilters) {
      window.addEventListener("popstate", function () {
        readUrl();
        apply();
      });
      readUrl();
    }
    apply();
  });


  /* ------------------------------------------------- kopiowanie wzoru */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.querySelector(btn.getAttribute("data-copy"));
      if (!target || !navigator.clipboard) return;
      navigator.clipboard.writeText(target.innerText).then(function () {
        var old = btn.textContent;
        btn.textContent = btn.getAttribute("data-copied-label") || "OK";
        setTimeout(function () { btn.textContent = old; }, 1800);
      });
    });
  });

})();
