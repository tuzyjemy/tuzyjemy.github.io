/* Własny typ pola „tagi”.
 *
 * Wartości znane z treści (przekazane w opcji `options`, generowanej przez
 * Hugo w assets/admin/config.yml) pokazujemy jako przyciski — jedno
 * kliknięcie dodaje lub usuwa tag. Pole obok pozwala dopisać nową wartość,
 * gdy żadna z istniejących nie pasuje.
 *
 * Zapisywana wartość to zwykła tablica tekstów, czyli dokładnie to, czego
 * oczekuje front matter Hugo:  tematy: ["Terminy", "Cyfryzacja"]
 *
 * Bez kroku budowania: Sveltia udostępnia globalnie `h` (React.createElement)
 * i `createClass`.
 */
(function () {
  var toArray = function (v) {
    if (!v) return [];
    if (Array.isArray(v)) return v.slice();
    if (typeof v.toJS === 'function') return v.toJS();          // Immutable
    return [];
  };

  var Control = createClass({
    getInitialState: function () {
      return { draft: '' };
    },

    current: function () {
      return toArray(this.props.value);
    },

    commit: function (next) {
      // Bez pustych i bez duplikatów — kolejność zachowana.
      var seen = [];
      next.forEach(function (t) {
        t = String(t).trim();
        if (t && seen.indexOf(t) === -1) seen.push(t);
      });
      this.props.onChange(seen);
    },

    toggle: function (tag) {
      var v = this.current();
      var i = v.indexOf(tag);
      if (i === -1) v.push(tag); else v.splice(i, 1);
      this.commit(v);
    },

    addDraft: function () {
      var t = (this.state.draft || '').trim();
      if (!t) return;
      var v = this.current();
      v.push(t);
      this.commit(v);
      this.setState({ draft: '' });
    },

    render: function () {
      var self = this;
      var value = this.current();
      var field = this.props.field;
      var options = field && typeof field.get === 'function' ? toArray(field.get('options')) : [];

      // Wartości użyte we wpisie, których nie ma w słowniku — też jako przyciski,
      // żeby dało się je odkliknąć.
      var extra = value.filter(function (t) { return options.indexOf(t) === -1; });
      var all = options.concat(extra);

      var btn = function (tag) {
        var on = value.indexOf(tag) !== -1;
        return h('button', {
          key: tag,
          type: 'button',
          onClick: function () { self.toggle(tag); },
          'aria-pressed': on,
          title: on ? 'Kliknij, aby usunąć' : 'Kliknij, aby dodać',
          style: {
            font: 'inherit', fontSize: '13px', lineHeight: '1.2',
            padding: '5px 11px', margin: '0 6px 6px 0', cursor: 'pointer',
            borderRadius: '999px',
            border: '1px solid ' + (on ? 'transparent' : 'var(--sui-secondary-border-color, #8888)'),
            background: on ? 'var(--sui-primary-accent-color, #3b82f6)' : 'transparent',
            color: on ? '#fff' : 'inherit',
            fontWeight: on ? 600 : 400
          }
        }, (on ? '✓ ' : '+ ') + tag);
      };

      return h('div', { style: { padding: '2px 0' } },
        all.length
          ? h('div', { style: { display: 'flex', flexWrap: 'wrap', marginBottom: '6px' } }, all.map(btn))
          : null,
        h('div', { style: { display: 'flex', gap: '6px', alignItems: 'center' } },
          h('input', {
            type: 'text',
            value: this.state.draft,
            placeholder: 'Nowa wartość…',
            onChange: function (e) { self.setState({ draft: e.target.value }); },
            onKeyDown: function (e) {
              if (e.key === 'Enter') { e.preventDefault(); self.addDraft(); }
            },
            style: {
              font: 'inherit', fontSize: '13px', padding: '5px 9px', flex: '1 1 auto',
              borderRadius: '6px',
              border: '1px solid var(--sui-secondary-border-color, #8888)',
              background: 'transparent', color: 'inherit'
            }
          }),
          h('button', {
            type: 'button',
            onClick: this.addDraft,
            style: {
              font: 'inherit', fontSize: '13px', padding: '5px 11px', cursor: 'pointer',
              borderRadius: '6px',
              border: '1px solid var(--sui-secondary-border-color, #8888)',
              background: 'transparent', color: 'inherit'
            }
          }, 'Dodaj')
        )
      );
    }
  });

  var Preview = createClass({
    render: function () {
      var v = toArray(this.props.value);
      return h('ul', null, v.map(function (t) { return h('li', { key: t }, t); }));
    }
  });

  CMS.registerFieldType('tagi', Control, Preview);
})();
