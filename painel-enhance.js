(function(){
'use strict';

var LS_EUR='fp_eur_rate', LS_USD='fp_usd_rate';
function getEur(){ return parseFloat(localStorage.getItem(LS_EUR))||0.165; }
function getUsd(){ return parseFloat(localStorage.getItem(LS_USD))||0.175; }
function setEur(v){ localStorage.setItem(LS_EUR,v); }
function setUsd(v){ localStorage.setItem(LS_USD,v); }
function calcEur(brl){ return Math.round(brl*getEur()); }
function calcUsd(brl){ return Math.round(brl*getUsd()); }

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

function recalcular(){
  document.querySelectorAll('.fp-eur-inp').forEach(function(inp){
    inp.value=calcEur(parseFloat(inp.getAttribute('data-brl'))||0);
  });
  document.querySelectorAll('.fp-usd-inp').forEach(function(inp){
    inp.value=calcUsd(parseFloat(inp.getAttribute('data-brl'))||0);
  });
}

function patchTabela(tabela, thText, inputSel){
  var ths=Array.from(tabela.querySelectorAll('th'));
  var valorTh=null, valorIdx=-1;
  ths.forEach(function(th,i){ if(th.textContent.trim()===thText){ valorTh=th; valorIdx=i; } });
  if(!valorTh||valorIdx<0) return;
  if(ths.some(function(th){ return th.textContent.trim()==='\u20AC EUR'; })) return;
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

function patchMini(){
  var area=document.getElementById('area'); if(!area) return;
  area.querySelectorAll('table').forEach(function(t){
    patchTabela(t,'Pre\u00E7o (R$)','input[data-k="preco"]');
  });
}

function patchPrecos(){
  var area=document.getElementById('area'); if(!area) return;
  area.querySelectorAll('table').forEach(function(t){
    patchTabela(t,'Valor (R$)','input[data-k="valor"]');
  });
}

function patchAtiva(){
  var active=document.querySelector('[id^=nav-].on');
  if(!active) return;
  if(active.id==='nav-mini') patchMini();
  else if(active.id==='nav-precos') patchPrecos();
}

function hookMostrar(){
  if(typeof window.mostrar!=='function') return;
  var _orig=window.mostrar;
  window.mostrar=function(){
    _orig.apply(this,arguments);
    patchAtiva();
  };
}

function criarBarra(){
  if(document.getElementById('fp-rate-bar')) return;
  var area=document.getElementById('area'); if(!area) return;
  var eurBrl=(1/getEur()).toFixed(2), usdBrl=(1/getUsd()).toFixed(2);
  var bar=document.createElement('div');
  bar.id='fp-rate-bar';
  bar.style.cssText='background:#111;border:1px solid #2a2a2a;border-radius:6px;padding:8px 16px;margin-bottom:10px;display:flex;align-items:center;gap:14px;font-size:13px;color:#999;';
  bar.innerHTML='<span style="color:#f60;font-weight:bold;">\u2699 C\u00E2mbio</span>'+
    '<label style="color:#4caf50;">\u20AC 1 EUR = R$ <input id="fp-eur-brl" type="number" step="0.01" min="1" value="'+eurBrl+'"></label>'+
    '<label style="color:#2196f3;">$ 1 USD = R$ <input id="fp-usd-brl" type="number" step="0.01" min="1" value="'+usdBrl+'"></label>'+
    '<button id="fp-aplicar">Aplicar</button>';
  area.parentNode.insertBefore(bar,area);
  document.getElementById('fp-aplicar').addEventListener('click',function(){
    var e=parseFloat(document.getElementById('fp-eur-brl').value);
    var u=parseFloat(document.getElementById('fp-usd-brl').value);
    if(e>0) setEur(1/e);
    if(u>0) setUsd(1/u);
    recalcular();
  });
}

criarBarra();
hookMostrar();
patchAtiva();
})();