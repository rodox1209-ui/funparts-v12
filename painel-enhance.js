(function(){
'use strict';

// ── Taxas de câmbio: fator R$ -> moeda estrangeira
var LS_EUR='fp_eur_rate', LS_USD='fp_usd_rate';
function getEur(){ return parseFloat(localStorage.getItem(LS_EUR))||0.165; }
function getUsd(){ return parseFloat(localStorage.getItem(LS_USD))||0.175; }
function setEur(v){ localStorage.setItem(LS_EUR,v); }
function setUsd(v){ localStorage.setItem(LS_USD,v); }
function calcEur(brl){ return Math.round(brl*getEur()); }
function calcUsd(brl){ return Math.round(brl*getUsd()); }

// ── Debounce
function debounce(fn,ms){ var t; return function(){ clearTimeout(t); t=setTimeout(fn,ms); }; }

// ── Criar td de conversão
function makeCellEur(brl){
  var td=document.createElement('td'); td.className='fp-eur-td';
  var inp=document.createElement('input'); inp.type='number'; inp.value=calcEur(brl);
  inp.readOnly=true; inp.className='fp-eur-inp'; inp.setAttribute('data-brl',brl);
  inp.style.cssText='width:75px;background:#1a3d1a;color:#4caf50;border:none;padding:4px 6px;border-radius:4px;font-weight:bold;font-size:13px;';
  td.appendChild(inp); return td;
}
function makeCellUsd(brl){
  var td=document.createElement('td'); td.className='fp-usd-td';
  var inp=document.createElement('input'); inp.type='number'; inp.value=calcUsd(brl);
  inp.readOnly=true; inp.className='fp-usd-inp'; inp.setAttribute('data-brl',brl);
  inp.style.cssText='width:75px;background:#1a2d3d;color:#2196f3;border:none;padding:4px 6px;border-radius:4px;font-weight:bold;font-size:13px;';
  td.appendChild(inp); return td;
}

// ── Recalcular todos os valores sem re-render
function recalcular(){
  document.querySelectorAll('.fp-eur-inp').forEach(function(inp){
    inp.value=calcEur(parseFloat(inp.getAttribute('data-brl'))||0);
  });
  document.querySelectorAll('.fp-usd-inp').forEach(function(inp){
    inp.value=calcUsd(parseFloat(inp.getAttribute('data-brl'))||0);
  });
}

// ── Patch genérico para qualquer tabela com coluna de preço
function patchTabela(tabela, thText, inputSel){
  var ths=Array.from(tabela.querySelectorAll('th'));
  var valorTh=null, valorIdx=-1;
  ths.forEach(function(th,i){ if(th.textContent.trim()===thText){ valorTh=th; valorIdx=i; } });
  if(!valorTh||valorIdx<0) return;
  if(ths.some(function(th){ return th.textContent.trim()==='\u20AC EUR'; })) return;
  // Inserir USD depois de EUR (resultado: Preco | EUR | USD)
  var usdTh=document.createElement('th');
  usdTh.textContent='$ USD'; usdTh.className='fp-usd-th'; usdTh.style.color='#2196f3';
  var eurTh=document.createElement('th');
  eurTh.textContent='\u20AC EUR'; eurTh.className='fp-eur-th'; eurTh.style.color='#4caf50';
  valorTh.insertAdjacentElement('afterend',usdTh);
  valorTh.insertAdjacentElement('afterend',eurTh);
  tabela.querySelectorAll('tr').forEach(function(tr){
    var cells=Array.from(tr.querySelectorAll('td'));
    if(cells.length<=valorIdx) return;
    var priceInp=cells[valorIdx].querySelector(inputSel);
    if(!priceInp) return;
    var brl=parseFloat(priceInp.value)||0;
    var eurTd=makeCellEur(brl);
    var usdTd=makeCellUsd(brl);
    cells[valorIdx].insertAdjacentElement('afterend',usdTd);
    cells[valorIdx].insertAdjacentElement('afterend',eurTd);
    priceInp.addEventListener('input',function(){
      var v=parseFloat(this.value)||0;
      var ei=eurTd.querySelector('.fp-eur-inp');
      var ui=usdTd.querySelector('.fp-usd-inp');
      if(ei){ ei.setAttribute('data-brl',v); ei.value=calcEur(v); }
      if(ui){ ui.setAttribute('data-brl',v); ui.value=calcUsd(v); }
    });
  });
}

// ── Patch: Miniatura inclusa
function patchMini(){
  var area=document.getElementById('area'); if(!area) return;
  area.querySelectorAll('table').forEach(function(t){
    patchTabela(t,'Pre\u00E7o (R$)','input[data-k="preco"]');
  });
}

// ── Patch: Prec\u0327os e opcionais
function patchPrecos(){
  var area=document.getElementById('area'); if(!area) return;
  area.querySelectorAll('table').forEach(function(t){
    patchTabela(t,'Valor (R$)','input[data-k="valor"]');
  });
}

// ── Detectar aba ativa e aplicar patch correspondente
function patchAtiva(){
  var active=document.querySelector('[id^=nav-].on');
  if(!active) return;
  if(active.id==='nav-mini') patchMini();
  else if(active.id==='nav-precos') patchPrecos();
  // nav-lego: tab de configuracao de modelos, sem coluna de preco
}

// ── MutationObserver no #area para re-aplicar apos troca de aba
function setupObserver(){
  var area=document.getElementById('area'); if(!area) return;
  var doPatch=debounce(patchAtiva,300);
  var obs=new MutationObserver(function(muts){
    if(muts.some(function(m){ return m.addedNodes.length>0; })) doPatch();
  });
  obs.observe(area,{childList:true,subtree:false});
}

// ── Barra de taxas de cambio
function criarBarra(){
  if(document.getElementById('fp-rate-bar')) return;
  var area=document.getElementById('area'); if(!area) return;
  var eurBrl=(1/getEur()).toFixed(2), usdBrl=(1/getUsd()).toFixed(2);
  var bar=document.createElement('div');
  bar.id='fp-rate-bar';
  bar.style.cssText='background:#111;border:1px solid #2a2a2a;border-radius:6px;padding:8px 16px;margin-bottom:10px;display:flex;align-items:center;gap:14px;font-size:13px;color:#999;flex-wrap:wrap;';
  bar.innerHTML=
    '<span style="color:#f60;font-weight:bold;">&#9881; C\u00E2mbio</span>'+
    '<label style="color:#4caf50;">\u20AC 1 EUR = R$ <input id="fp-eur-brl" type="number" step="0.01" min="1" value="'+eurBrl+'" style="width:72px;background:#1a3d1a;color:#4caf50;border:1px solid #4caf50;padding:3px 6px;border-radius:4px;font-weight:bold;"></label>'+
    '<label style="color:#2196f3;">$ 1 USD = R$ <input id="fp-usd-brl" type="number" step="0.01" min="1" value="'+usdBrl+'" style="width:72px;background:#1a2d3d;color:#2196f3;border:1px solid #2196f3;padding:3px 6px;border-radius:4px;font-weight:bold;"></label>'+
    '<button id="fp-aplicar" style="background:#f60;color:#fff;border:none;padding:5px 14px;border-radius:5px;cursor:pointer;font-weight:bold;font-size:13px;">Aplicar</button>';
  area.parentNode.insertBefore(bar,area);
  document.getElementById('fp-aplicar').addEventListener('click',function(){
    var e=parseFloat(document.getElementById('fp-eur-brl').value);
    var u=parseFloat(document.getElementById('fp-usd-brl').value);
    if(e>0) setEur(1/e);
    if(u>0) setUsd(1/u);
    recalcular();
  });
}

// ── Iniciar
criarBarra();
setupObserver();
setTimeout(patchAtiva,200);
})();