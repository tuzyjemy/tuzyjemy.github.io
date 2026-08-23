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

  /* ------------------------------------------------- sortowanie tabel */
  document.querySelectorAll("table[data-sortable]").forEach(function (table) {
    var headers = Array.prototype.slice.call(table.querySelectorAll("thead th"));
    headers.forEach(function (th, index) {
      th.setAttribute("tabindex", "0");
      th.setAttribute("role", "button");
      function sort() {
        var dir = th.getAttribute("aria-sort") === "ascending" ? -1 : 1;
        headers.forEach(function (h) { h.removeAttribute("aria-sort"); });
        th.setAttribute("aria-sort", dir === 1 ? "ascending" : "descending");
        var body = table.tBodies[0];
        var rows = Array.prototype.slice.call(body.rows);
        rows.sort(function (a, b) {
          var x = a.cells[index] ? a.cells[index].textContent.trim() : "";
          var y = b.cells[index] ? b.cells[index].textContent.trim() : "";
          var nx = parseFloat(x.replace(/[^\d.,-]/g, "").replace(",", "."));
          var ny = parseFloat(y.replace(/[^\d.,-]/g, "").replace(",", "."));
          if (!isNaN(nx) && !isNaN(ny)) return (nx - ny) * dir;
          return x.localeCompare(y, document.documentElement.lang || "pl") * dir;
        });
        rows.forEach(function (r) { body.appendChild(r); });
      }
      th.addEventListener("click", sort);
      th.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sort(); }
      });
    });
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
