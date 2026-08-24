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
    var chips = Array.prototype.slice.call(root.querySelectorAll(".chip"));
    var search = root.querySelector(".search-input");
    var summary = root.querySelector("[data-count]");
    var empty = root.querySelector("[data-empty]");
    var clear = root.querySelector("[data-clear]");
    var active = {};

    function matches(item) {
      for (var facet in active) {
        if (!active[facet]) continue;
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
      });
    });

    if (search) {
      search.addEventListener("input", apply);
    }
    if (clear) {
      clear.addEventListener("click", function () {
        active = {};
        chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        if (search) search.value = "";
        apply();
      });
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
