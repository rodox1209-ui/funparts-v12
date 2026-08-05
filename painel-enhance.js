/**
 * Funparts Painel — EUR/USD Enhancement
 * Hospedado em funparts-v12.pages.dev/painel-enhance.js
 * Ativado via bookmarklet no /painel
 * Preços € e $ persistidos em localStorage do browser
 */
(function () {
  'use strict';

  var LS_KEY = 'fp_intl_v2';

  function getIntl() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function setIntl(d) { localStorage.setItem(LS_KEY, JSON.stringify(d)); }

  /* ---- helpers de conversão padrão ---- */
  function eurDef(brl) { return Math.round((brl || 0) / 5.8); }
  function usdDef(brl) { return Math.round((brl || 0) / 5.3); }

  /* ---- aguardar o painel carregar ---- */
  function aguardar(check, cb, ms) {
    if (check()) { cb(); return; }
    setTimeout(function () { aguardar(check, cb, ms); }, ms || 300);
  }

  aguardar(
    function () { return typeof linhaMini !== 'undefined' && typeof renderMini !== 'undefined'; },
    iniciar
  );

  function iniciar() {
    patchLinhaMini();
    patchRenderMini();
    patchSalvarMini();
    renderMini(); // re-renderiza com as novas colunas

    /* indicador visual */
    var sub = document.querySelector('sub');
    if (sub && sub.textContent.indexOf('EUR') < 0) {
      sub.innerHTML += ' &nbsp;|&nbsp; <span style="color:#6f6">🌍 EUR/USD ativo</span>';
    }

    /* botão de exportar JSON */
    adicionarBtnExport();
  }

  /* ==============================
     PATCH: linhaMini — adiciona inputs EUR e USD em cada linha
  ============================== */
  var _origLinhaMini = null;

  function patchLinhaMini() {
    _origLinhaMini = window.linhaMini;
    window.linhaMini = function (p) {
      var html = _origLinhaMini(p);

      /* identificador estável para localStorage */
      var pid = p.id ? String(p.id) : ('novo_' + (p._n || 0));
      var intl = getIntl();
      var saved = intl[pid] || {};
      var brl = p.preco || 0;
      var eurV = saved.eur !== undefined ? saved.eur : eurDef(brl);
      var usdV = saved.usd !== undefined ? saved.usd : usdDef(brl);

      var eurTd =
        '<td style="width:88px">' +
          '<input data-intl="eur" type="number" min="0" value="' + eurV + '"' +
          ' title="Preço em Euros (€)"' +
          ' style="width:100%;background:#0c1f0c;border:1px solid #2a4a2a;color:#6f6;' +
          'padding:5px 4px;border-radius:4px;font-size:12px;box-sizing:border-box;">' +
        '</td>';

      var usdTd =
        '<td style="width:88px">' +
          '<input data-intl="usd" type="number" min="0" value="' + usdV + '"' +
          ' title="Preço em Dólar ($)"' +
          ' style="width:100%;background:#0c1520;border:1px solid #2a3a4e;color:#7ad;' +
          'padding:5px 4px;border-radius:4px;font-size:12px;box-sizing:border-box;">' +
        '</td>';

      /* inserir ANTES da coluna de Fotos */
      var fotosIdx = html.indexOf('<td style="width:96px"');
      if (fotosIdx < 0) fotosIdx = html.indexOf('abrirFotos');
      if (fotosIdx >= 0) {
        /* recuar até o <td mais próximo */
        var tdStart = html.lastIndexOf('<td', fotosIdx);
        if (tdStart >= 0) {
          return html.slice(0, tdStart) + eurTd + usdTd + html.slice(tdStart);
        }
      }
      /* fallback: appenda antes do último </tr> */
      var lastTr = html.lastIndexOf('</tr>');
      if (lastTr >= 0) return html.slice(0, lastTr) + eurTd + usdTd + html.slice(lastTr);
      return html;
    };
  }

  /* ==============================
     PATCH: renderMini — adiciona headers € e $ na tabela
  ============================== */
  var _origRenderMini = null;

  function patchRenderMini() {
    _origRenderMini = window.renderMini;
    window.renderMini = function () {
      _origRenderMini();
      adicionarHeaders();
    };
  }

  function adicionarHeaders() {
    document.querySelectorAll('#area table thead tr').forEach(function (tr) {
      /* evitar duplicar headers */
      if (tr.querySelector('.th-eur')) return;
      var ths = tr.querySelectorAll('th');
      var fotosTh = null;
      ths.forEach(function (th) {
        var t = th.textContent.trim();
        if (t === 'Fotos' || t === 'fotos') fotosTh = th;
      });
      if (!fotosTh) {
        /* fallback: inserir antes da última coluna de ações */
        fotosTh = ths[ths.length - 1];
      }
      if (fotosTh) {
        fotosTh.insertAdjacentHTML('beforebegin',
          '<th class="th-eur" style="color:#6f6;font-weight:700;letter-spacing:1px">€ EUR</th>' +
          '<th class="th-usd" style="color:#7ad;font-weight:700;letter-spacing:1px">$ USD</th>'
        );
      }
    });
  }

  /* ==============================
     PATCH: salvarMini — salva EUR/USD no localStorage junto com o save normal
  ============================== */
  function patchSalvarMini() {
    var _orig = window.salvarMini;
    window.salvarMini = function (btn) {
      var tr = btn.closest('tr');
      if (tr) {
        var raw = tr.getAttribute('data-row');
        var eurEl = tr.querySelector('[data-intl="eur"]');
        var usdEl = tr.querySelector('[data-intl="usd"]');
        if (raw && raw.indexOf('novo') < 0 && (eurEl || usdEl)) {
          var intl = getIntl();
          intl[raw] = {
            eur: eurEl ? Number(eurEl.value) : (intl[raw] ? intl[raw].eur : 0),
            usd: usdEl ? Number(usdEl.value) : (intl[raw] ? intl[raw].usd : 0)
          };
          setIntl(intl);
          animarSalvo(btn);
        }
      }
      _orig.call(this, btn);
    };
  }

  function animarSalvo(btn) {
    var orig = btn.textContent;
    btn.textContent = '✓ Salvo';
    setTimeout(function () { if (btn.textContent === '✓ Salvo') btn.textContent = orig; }, 1500);
  }

  /* ==============================
     Botão de Export JSON (para backup / uso no site)
  ============================== */
  function adicionarBtnExport() {
    if (document.getElementById('fp-export-intl')) return;
    var bar = document.querySelector('.bar') || document.querySelector('nav');
    if (!bar) return;
    var btn = document.createElement('button');
    btn.id = 'fp-export-intl';
    btn.textContent = '↓ Exportar €/$';
    btn.title = 'Exportar preços EUR/USD como JSON (para usar no site)';
    btn.style.cssText =
      'background:#1a2a1a;border:1px solid #2a4a2a;color:#6f6;' +
      'border-radius:8px;padding:7px 13px;font-size:12px;cursor:pointer;' +
      'letter-spacing:1px;margin-left:auto;';
    btn.onclick = function () {
      var data = getIntl();
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'precos-intl-' + new Date().toISOString().slice(0, 10) + '.json';
      a.click();
      URL.revokeObjectURL(a.href);
    };
    bar.appendChild(btn);

    /* botão de importar */
    var btnImp = document.createElement('button');
    btnImp.textContent = '↑ Importar €/$';
    btnImp.title = 'Importar preços EUR/USD de um arquivo JSON exportado anteriormente';
    btnImp.style.cssText =
      'background:#1a1a2a;border:1px solid #2a2a4a;color:#7ad;' +
      'border-radius:8px;padding:7px 13px;font-size:12px;cursor:pointer;' +
      'letter-spacing:1px;margin-left:6px;';
    btnImp.onclick = function () {
      var inp = document.createElement('input');
      inp.type = 'file'; inp.accept = '.json';
      inp.onchange = function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var fr = new FileReader();
        fr.onload = function (ev) {
          try {
            var d = JSON.parse(ev.target.result);
            setIntl(d);
            renderMini();
            alert('Importado com sucesso! ' + Object.keys(d).length + ' produtos.');
          } catch (ex) { alert('Erro ao importar: ' + ex.message); }
        };
        fr.readAsText(file);
      };
      inp.click();
    };
    bar.appendChild(btnImp);
  }

})();
