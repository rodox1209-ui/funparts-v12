(function(){
'use strict';

var LS='fp_fx_';

function rowKey(tab,tr){
  var c=tr.querySelectorAll('td');
  var n=c[0]?c[0].textContent.trim().replace(/[^a-zA-Z0-9]/g,'_').substring(0,40):'row';
  return LS+tab+'_'+n;
}

function makeCellEdit(key,cur,color,bg){
  var td=document.createElement('td'); td.className='fp-'+cur+'-td';
  var inp=document.createElement('input'); inp.type='number';
  inp.value=localStorage.getItem(key+'_'+cur)||'';
  inp.className='fp-'+cur+'-inp';
  inp.placeholder='--';
  inp.style.cssText='width:80px;background:'+bg+';color:'+color+';border:1px solid #333;padding:4px 6px;border-radius:4px;font-weight:bold;font-size:13px;';
  inp.addEventListener('change',function(){ localStorage.setItem(key+'_'+cur,this.value); });
  td.appendChild(inp); return td;
}

function patchTabela(tabela,thText,inputSel,tabId){
  var ths=Array.from(tabela.querySelectorAll('th'));
  var valorTh=null, valorIdx=-1;
  ths.forEach(function(th,i){ if(th.textContent.trim()===thText){ valorTh=th; valorIdx=i; } });
  if(!valorTh||valorIdx<0) return;
  if(ths.some(function(th){ return th.textContent.trim()==='\u20AC EUR'; })) return;
  var eurTh=document.createElement('th');
  eurTh.textContent='\u20AC EUR'; eurTh.className='fp-eur-th'; eurTh.style.color='#4caf50';
  var usdTh=document.createElement('th');
  usdTh.textContent='$ USD'; usdTh.className='fp-usd-th'; usdTh.style.color='#2196f3';
  valorTh.insertAdjacentElement('afterend',usdTh);
  valorTh.insertAdjacentElement('afterend',eurTh);
  tabela.querySelectorAll('tr').forEach(function(tr){
    var cells=Array.from(tr.querySelectorAll('td'));
    if(cells.length<=valorIdx) return;
    var priceInp=cells[valorIdx].querySelector(inputSel);
    if(!priceInp) return;
    var k=rowKey(tabId,tr);
    var eurTd=makeCellEdit(k,'eur','#4caf50','#0d2b0d');
    var usdTd=makeCellEdit(k,'usd','#2196f3','#0d1e2b');
    cells[valorIdx].insertAdjacentElement('afterend',usdTd);
    cells[valorIdx].insertAdjacentElement('afterend',eurTd);
  });
}

function patchMini(){
  var area=document.getElementById('area'); if(!area) return;
  area.querySelectorAll('table').forEach(function(t){
    patchTabela(t,'Pre\u00E7o (R$)','input[data-k="preco"]','mini');
  });
}

function patchPrecos(){
  var area=document.getElementById('area'); if(!area) return;
  area.querySelectorAll('table').forEach(function(t){
    patchTabela(t,'Valor (R$)','input[data-k="valor"]','precos');
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

hookMostrar();
patchAtiva();
})();