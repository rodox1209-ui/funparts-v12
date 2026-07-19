
// NULL-SAFE
function setEl(id,v){var e=document.getElementById(id);if(e)e.textContent=v;}
function setStyle(id,p,v){var e=document.getElementById(id);if(e)e.style[p]=v;}

// V2 JS

// ── CATÁLOGO LEGO ──
const LEGO_CATALOG = {
  'Formula 1': [
    {name:'Ferrari SF24 F1',dim:'53×83cm',scale:'1:8',f1:true},
    {name:'Red Bull F1',dim:'53×83cm',scale:'1:8',f1:true},
    {name:'McLaren F1 MCL35',dim:'53×83cm',scale:'1:8',f1:true},
    {name:'McLaren F1 MCL39',dim:'53×83cm',scale:'1:8',f1:true},
    {name:'Aston Martin F1',dim:'53×83cm',scale:'1:8',f1:true},
    {name:'Alfa Romeo F1',dim:'53×83cm',scale:'1:8',f1:true},
    {name:'Stake Sauber F1',dim:'53×83cm',scale:'1:8',f1:true},
    {name:'Renault F1',dim:'49×49cm',scale:'1:13',f1:true},
    {name:'Toleman F1',dim:'53×83cm',scale:'1:8',f1:true},
    {name:'McLaren MP4/4 Senna',dim:'53×83cm',scale:'1:8',f1:true},
    {name:'Mini F1 Speed Champions',dim:'49×49cm',scale:'1:13',f1:true},
  ],
  'Ferrari': [
    {name:'Ferrari Daytona SP3',dim:'53×83cm',scale:'1:8',f1:false},
    {name:'Ferrari 488 GTE',dim:'53×83cm',scale:'1:8',f1:false},
    {name:'Ferrari SF24 F1',dim:'53×83cm',scale:'1:8',f1:true},
  ],
  'McLaren': [
    {name:'McLaren P1',dim:'53×83cm',scale:'1:8',f1:false},
    {name:'McLaren GTR',dim:'53×83cm',scale:'1:8',f1:false},
    {name:'McLaren MP4/4 Senna',dim:'49×49cm',scale:'1:13',f1:true},
    {name:'McLaren F1 MCL35',dim:'53×83cm',scale:'1:8',f1:true},
    {name:'McLaren F1 MCL39',dim:'53×83cm',scale:'1:8',f1:true},
  ],
  'Porsche': [
    {name:'Porsche 911 RSR',dim:'53×83cm',scale:'1:8',f1:false},
    {name:'Porsche GT3rs',dim:'53×83cm',scale:'1:8',f1:false},
    {name:'Porsche 911 Targa 1970',dim:'53×83cm',scale:'1:8',f1:false},
  ],
  'Lamborghini': [
    {name:'Lamborghini Sian',dim:'53×83cm',scale:'1:8',f1:false},
  ],
  'Mercedes': [
    {name:'Mercedes W14',dim:'53×83cm',scale:'1:8',f1:true},
    {name:'Mercedes AMG One',dim:'49×49cm',scale:'1:13',f1:false},
  ],
  'Bugatti': [
    {name:'Bugatti Chiron',dim:'53×83cm',scale:'1:8',f1:false},
  ],
  'BMW': [
    {name:'BMW 1000RR',dim:'53×83cm',scale:'1:8',f1:false},
    {name:'BMW GS 1250',dim:'83×53cm',scale:'1:8',f1:false},
  ],
  'Ford': [
    {name:'Ford GT',dim:'53×83cm',scale:'1:8',f1:false},
    {name:'Ford Raptor',dim:'53×83cm',scale:'1:8',f1:false},
    {name:'Ford Mustang GT 1960',dim:'53×83cm',scale:'1:8',f1:false},
  ],
  'Dodge': [
    {name:'Dodge Charger R/T',dim:'53×83cm',scale:'1:8',f1:false},
  ],
  'Nissan': [
    {name:'Nissan GTR Skyline',dim:'53×83cm',scale:'1:8',f1:false},
  ],
  'Land Rover': [
    {name:'Land Rover Defender',dim:'53×83cm',scale:'1:8',f1:false},
  ],
  'Motos': [
    {name:'Ducati',dim:'53×83cm',scale:'1:8',f1:false},
    {name:'Yamaha MT-10',dim:'53×83cm',scale:'1:8',f1:false},
    {name:'BMW 1000RR',dim:'53×83cm',scale:'1:8',f1:false},
    {name:'BMW GS 1250',dim:'49×49cm',scale:'1:13',f1:false},
  ],
  'Super Heróis': [
    {name:'Batmóvel',dim:'53×83cm',scale:'1:8',f1:false},
    {name:'Tumbler Batman',dim:'53×83cm',scale:'1:8',f1:false},
    {name:'Ecto-01 Ghostbusters',dim:'53×83cm',scale:'1:8',f1:false},
    {name:'X-Wing Star Wars',dim:'53×83cm',scale:'1:8',f1:false},
  ],
  'Filmes': [
    {name:'DeLorean — De Volta para o Futuro',dim:'49×49cm',scale:'1:13',f1:false},
    {name:'Ecto-01 Ghostbusters',dim:'53×83cm',scale:'1:8',f1:false},
    {name:'X-Wing Star Wars',dim:'53×83cm',scale:'1:8',f1:false},
  ],
  'Outros': [
    {name:'Traçado de Interlagos',dim:'53×83cm',scale:'—',f1:false},
    {name:'Concorde Airbus',dim:'63×128cm',scale:'—',f1:false},
  ],
};

const MINI_SIZES = [
  {id:'1043',label:'25 × 35 cm',scale:'1:43',base:459},
  {id:'2449',label:'49 × 49 cm',scale:'1:24',base:1290},
  {id:'1849',label:'49 × 49 cm',scale:'1:18',base:1490},
  {id:'1866',label:'40 × 66,5 cm',scale:'1:18',base:1990},
  {id:'1266',label:'40 × 66,5 cm',scale:'1:12',base:2490},
];

// ── STATE ──
const S = {
  tipo:'lego', legoBrand:'Formula 1', legoModel:null, legoF1:true, legoDim:'53×83cm',
  miniBrand:'Ferrari', miniModel:'', miniSize:'4066', miniDim:'40 × 66,5 cm',
  miniOpt:'own', disp:'exist', customs:[], customExtra:0,
  moldura:'m-laca', molduraLbl:'Laca Preto',
  fundo:'f-carbono', fundoLbl:'Fibra de Carbono (Vinil)', fundoLayout:'Revestimento do fundo com vinil texturizado de fibra de carbono', uvColor:'#FF2200',
  led:false, ledFio:'com', ledTipo:'warm', ledPrice:199, relTL:'#fff', relBR:'#d5040f',
  relOpts:[], relOptsExtra:0,
  _total:0,
};

// ── NAVEGAÇÃO ──
function showAiPopup(title,body){var defT='Fanático, você está prestes a criar<br>um quadro exclusivo!';var defB='Aguarde, estamos gerando a imagem da sua miniatura em alta resolução.';var p=document.getElementById('aiLoadingPopup');if(!p)return;var t=document.getElementById('aiPopupTitle');var b=document.getElementById('aiPopupBody');if(t)t.innerHTML=title||defT;if(b)b.innerHTML=body||defB;p.style.display='flex';_aiProgStart(22);}
function hideAiPopup(){var p=document.getElementById('aiLoadingPopup');_aiProgFinish();if(p)setTimeout(function(){p.style.display='none';},320);}

// ── Barra de progresso da geração por IA ──
// Estimativa: a API nao envia progresso real, entao usamos uma curva calibrada pelo tempo medio
// medido (~19s em quality medium). A barra desacelera e trava em 95% ate a imagem chegar de fato.
var _aiProgTimer=null;
var _AI_STAGES=[[0,'Preparando o pedido…'],[14,'Analisando marca e modelo…'],[34,'Modelando a carroceria…'],[56,'Aplicando pintura e reflexos…'],[76,'Ajustando iluminação…'],[90,'Finalizando os detalhes…']];
function _aiStageTxt(p){var t=_AI_STAGES[0][1];for(var i=0;i<_AI_STAGES.length;i++){if(p>=_AI_STAGES[i][0])t=_AI_STAGES[i][1];}return t;}
function _aiProgStart(estSec){
  var bar=document.getElementById('aiProgBar');
  if(!bar)return;
  var pct=document.getElementById('aiProgPct'), st=document.getElementById('aiProgStage');
  clearInterval(_aiProgTimer);
  bar.style.transition='width .35s ease'; bar.style.width='0%';
  if(pct)pct.textContent='0%';
  if(st)st.textContent=_AI_STAGES[0][1];
  var t0=Date.now(), est=(estSec||19)*1000;
  _aiProgTimer=setInterval(function(){
    var p=95*(1-Math.exp(-2.2*(Date.now()-t0)/est));
    if(p>95)p=95;
    bar.style.width=p.toFixed(1)+'%';
    if(pct)pct.textContent=Math.round(p)+'%';
    if(st)st.textContent=_aiStageTxt(p);
  },200);
}
function _aiProgFinish(){
  clearInterval(_aiProgTimer);
  var bar=document.getElementById('aiProgBar'), pct=document.getElementById('aiProgPct'), st=document.getElementById('aiProgStage');
  if(bar)bar.style.width='100%';
  if(pct)pct.textContent='100%';
  if(st)st.textContent='Pronto!';
}
function goStep(n){
  // Restaurar resumo padrão se saindo do contexto incluso
  if(n!==6){
    var iSb=document.getElementById('inclusoSummaryBlock');
    if(iSb)iSb.style.display='none';
    var sb=document.querySelector('#step-7 .sum-block');
    if(sb)sb.style.display='';
    var tgs=document.querySelector('#step-7 .tags');
    if(tgs)tgs.style.display='';
    var bf=document.querySelector('#step-7 .btn-fin');
    if(bf)bf.style.display='';
    var bw=document.querySelector('#step-7 .btn-wpp');
    if(bw)bw.style.display='';
  }
  // Restaurar step-2 ao sair do contexto incluso
  if(n!==2 && S.miniChoice==='incluso'){
    setStyle('step2RegularContent','display','');
    setStyle('inclusoProdutoSection','display','none');
    setEl('tabStep2Lbl','Miniatura');
    setEl('step2Title','Miniatura');
    setEl('step2Sub','Confirme que já possui a miniatura para montagem no quadro.');
  }
  // catalogo (produto pronto): o aviso dos "dois caminhos" nao aparece daqui pra frente
  var _smiG=document.getElementById('sidebarMiniInfo');
  if(_smiG && typeof S!=='undefined' && S.tipo==='mini' && S.miniChoice==='incluso') _smiG.style.display='none';
  // Mini flow: mostrar/ocultar miniPreviewWrap + centralizar par via row flex
  var _mpw=document.getElementById('miniPreviewWrap');
  var _pvPanel=document.querySelector('.pv-panel');
  if(_mpw){_mpw.style.display='none';_mpw.style.position='';}
  if(_pvPanel){_pvPanel.style.flexDirection='';_pvPanel.style.justifyContent='';}
  var _wallBtns=document.querySelectorAll('.btn-wall-example');
  var _parede=Array.from(_wallBtns).find(function(b){return b.textContent.includes('APLICADO NA PAREDE');});
  if(_parede)_parede.style.display='';
  if(n===3 && typeof S!=='undefined' && S.tipo==='mini'){
    if(_parede)_parede.style.display='none';
    setTimeout(function(){
      var _lp=document.getElementById('livePv');
      var _pv2=document.querySelector('.pv-panel');
      if(_mpw&&_lp&&_pv2){
        _pv2.style.flexDirection='row';
        _pv2.style.justifyContent='center';
        _pv2.style.alignItems='center';
        _mpw.style.position='relative';
        _mpw.style.display='flex';
        _mpw.style.flexDirection='column';
        _mpw.style.width=_lp.offsetWidth+'px';
        _mpw.style.height=_lp.offsetHeight+'px';
        _mpw.style.marginLeft='16px';
        _mpw.style.overflow='hidden';
        _mpw.style.flexShrink='0';
      }
      var _msi=document.getElementById('miniScaleImg');
      if(_msi&&!_msi.getAttribute('data-loaded')){
        var _wImg=document.querySelector('#wallModal img');
        if(_wImg&&_wImg.src){_msi.src=_wImg.src;_msi.setAttribute('data-loaded','1');}
      }
    },150);
  }
  // Mini flow step 3: rename tab + carregar imagem IA no preview (flow apenas)
  if(n===2 && typeof S!=='undefined' && S.tipo==='mini'){
    setEl('tabStep2Lbl','Miniatura');
    if(S.miniChoice==='apenas'){
      var _aImg=document.getElementById('apenaGeneratedImg');
      var _mH=document.getElementById('miniHeroImg');
      // usar o ATRIBUTO src: a propriedade .src resolve para a URL da pagina quando vazio
      var _aSrc=_aImg?(_aImg.getAttribute('src')||''):'';
      if(_aSrc.length>10&&_mH){
        _mH.style.padding='0';_mH.style.background='#0d0d0d';
        _mH.innerHTML='<img src="'+_aImg.src+'" style="width:100%;height:100%;object-fit:cover;display:block;">';
      }
    }
  }
  var _sn=1;document.querySelectorAll('.stab').forEach((t,i)=>{
    t.classList.remove('active','done');
    if(i===n)t.classList.add('active');
    if(i<n)t.classList.add('done');
    const sn=t.querySelector('.snum');
    if(!sn)return;if(t.style.display==='none'){sn.textContent='';return;}
    sn.textContent=i<n?'✓':_sn;_sn++;
  });
  document.querySelectorAll('.cfg-sec').forEach((s,i)=>s.classList.toggle('active',i===n));
  // Toggle hero image vs live preview
  var hero=document.getElementById('heroImg');
  var legoHero=document.getElementById('legoHeroImg');
  var miniHero=document.getElementById('miniHeroImg');
  var live=document.getElementById('livePv');
  if(hero&&legoHero&&live){
    var miniStep1Hero=document.getElementById('miniStep1HeroImg');
    hero.style.display=n===0?'flex':'none';
    legoHero.style.display=(n===1&&(typeof S==='undefined'||S.tipo!=='mini'))?'flex':'none';
    if(miniStep1Hero)miniStep1Hero.style.display=(n===1&&typeof S!=='undefined'&&S.tipo==='mini')?'flex':'none';
    if(miniHero)miniHero.style.display=n===2?'flex':'none';
    var isLegoFlow=(typeof S!=='undefined'&&S.tipo==='lego');
    live.style.display=(n===0||n===1||n===2||isLegoFlow)?'none':'flex';
    var legoWrap=document.getElementById('legoPreviewWrap');
    if(legoWrap) legoWrap.style.display=(n>=3&&isLegoFlow)?'flex':'none';
  }
  // Produto pronto do catalogo: o preview e a FOTO do produto, nao o quadro montado
  var _mh=document.getElementById('miniHeroImg');
  if(_mh && typeof _MINI_HERO_ORIG==='undefined'){ window._MINI_HERO_ORIG={h:_mh.innerHTML,p:_mh.style.padding,b:_mh.style.background}; }
  if(typeof S!=='undefined' && S.tipo==='mini' && S.miniChoice==='incluso' && S.incProduto){
    var _lv=document.getElementById('livePv'); if(_lv)_lv.style.display='none';
    var _lw=document.getElementById('legoPreviewWrap'); if(_lw)_lw.style.display='none';
    if(_mh && typeof INCLUSO_FOTOS!=='undefined'){
      _mh.style.display='flex'; _mh.style.padding='20px'; _mh.style.background='#0d0d0d';
      _mh.setAttribute('data-cat','1');
      _mh.innerHTML=_catGaleriaHTML();
      // painel lado a lado: galeria + imagem "homem + quadro" (mesma logica do passo 3 do mini)
      var _pvC=document.querySelector('.pv-panel');
      var _mpwC=document.getElementById('miniPreviewWrap');
      if(_pvC&&_mpwC){
        _pvC.style.flexDirection='row'; _pvC.style.justifyContent='center'; _pvC.style.alignItems='center';
        _mh.style.flex='1 1 0'; _mh.style.minWidth='0'; _mh.style.width='auto';
        _mpwC.style.position='relative'; _mpwC.style.display='flex'; _mpwC.style.flexDirection='column';
        _mpwC.style.flex='0 0 32%'; _mpwC.style.maxWidth='32%'; _mpwC.style.marginLeft='16px'; _mpwC.style.height='auto';
        // imagem de escala conforme a DIMENSAO do produto escolhido
        var _msiC=document.getElementById('miniScaleImg');
        var _dimC=(S.incProduto&&S.incProduto.dim)||'';
        var _imgC=(typeof MINI_SCALE_IMGS!=='undefined')?MINI_SCALE_IMGS[_dimC]:null;
        if(_msiC){
          if(_imgC){
            _msiC.style.display='block'; _msiC.src=_imgC;
            var _wmC=document.querySelector('#wallModalBox img'); if(_wmC)_wmC.src=_imgC;
            _mpwC.style.display='flex';
          } else {
            // sem referencia de escala para essa dimensao: nao mostrar proporcao errada
            _mpwC.style.display='none';
          }
        }
      }
    }
  } else if(_mh && _mh.getAttribute('data-cat')==='1'){
    _mh.style.flex=''; _mh.style.minWidth=''; _mh.style.width='100%';
    // restaura o hero original do fluxo normal
    _mh.removeAttribute('data-cat');
    _mh.innerHTML=_MINI_HERO_ORIG.h; _mh.style.padding=_MINI_HERO_ORIG.p; _mh.style.background=_MINI_HERO_ORIG.b;
  }
  // Mini-only mode on step 2
  var q=document.querySelector('.quadro');
  var pv=document.getElementById('livePv');
  if(q){n===2?q.classList.add('mini-only'):q.classList.remove('mini-only');}
  if(pv){n===2?pv.classList.add('mini-only-pv'):pv.classList.remove('mini-only-pv');}
  if(q){n===5?q.classList.add('moldura-only'):q.classList.remove('moldura-only');}
  if(pv){n===5?pv.classList.add('moldura-only-pv'):pv.classList.remove('moldura-only-pv');}
  if(q){n===4?q.classList.add('fundo-only'):q.classList.remove('fundo-only');}
  // Detalhamento step: show frame photo on carbon-fiber bg; hide car/relevo/logos
  // Mini: o preview montado do quadro continua valendo no resumo (n=7). LEGO mantem a regra original (n<7).
  var _isMiniFlow=(typeof S!=='undefined'&&S.tipo==='mini');
  var _pvAtivo=(n>=3&&(n<7||_isMiniFlow));
  var _dpf=document.getElementById('detPvFrame');
  if(_dpf) _dpf.style.display=_pvAtivo?'block':'none';
  var _dpfundo=document.getElementById('detPvFundo');
  if(_dpfundo) _dpfundo.style.display=_pvAtivo?'block':'none';
  var _dpc=document.getElementById('detPvCar');
  if(_dpc){
    _dpc.style.display=(_pvAtivo&&_detTopViewUrl&&S.tipo==='mini')?'block':'none';
    _dpc.style.zIndex=(n===3)?'10':'5';
  }
  var _dpcl=document.getElementById('detPvCarLoader');
  if(_dpcl&&(n!==3||S.tipo!=='mini')) _dpcl.style.display='none';
  var _qd=document.querySelector('#livePv .quadro');
  if(_qd){
    if(_pvAtivo){
      if(S.tipo==='lego'&&S.legoDim){
        var _lr=_legoLegacyRatio(S.legoDim);
        if(_lr){_qd.style.aspectRatio=_lr;_qd.style.overflow='hidden';}
      } else if(S.quadroDim&&DIM_STYLE[S.quadroDim]){
        _qd.style.aspectRatio=DIM_STYLE[S.quadroDim].ratio;
        _qd.style.overflow='hidden';
      }
    } else {
      _qd.style.aspectRatio='';
      _qd.style.overflow='';
    }
  }
  // use visibility (not display) so layout is preserved
  var _detVis=['iCarro','relExtras','logoF1','logoBR','iMoldura'];
  // ledDark/ledGlow mantidos visíveis no mini step 5 para preview LED funcionar
  _detVis.forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.style.visibility=_pvAtivo?'hidden':'';
  });
  // Remove .c-fundo from layout so aspect-ratio controls .quadro height
  var _cfundo=document.querySelector('#livePv .c-fundo');
  if(_cfundo) _cfundo.style.display=_pvAtivo?'none':'';
  if(n===3){initDetalhamento();if(S.tipo==='mini'){triggerDetTopView();}}
  else if(n===4){updateDetPreview();updateDetPvFundo();if(S.tipo==='mini'){renderUvMiniOptions();}else{renderFundoLayouts(S.fundo);}updateFundoLayoutsVisibility();if(S.tipo==='mini'&&_detTopViewUrl)setTimeout(applyDetCarOverlay,80);}
  else if(n>=5&&(n<7||_isMiniFlow)){updateDetPreview();updateDetPvFundo();if(S.tipo==='mini'&&_detTopViewUrl)setTimeout(applyDetCarOverlay,80);if((n===6||n===7)&&typeof updateFixedRelevo==='function'){
    updateFixedRelevo();
    // Step 6: restore visibility de logo IA para relevo preview
    if(S.tipo==='mini'){['logoF1','logoBR','relExtras'].forEach(function(id){var el=document.getElementById(id);if(el)el.style.visibility='';});}
    // Init LEGO badge images by copying from livePv
    var _lf1=document.getElementById('legoLogoF1');
    var _f1=document.getElementById('logoF1');
    if(_lf1&&_f1&&(!_lf1.src||_lf1.src===window.location.href))_lf1.src=_f1.src;
    // Clear legoRelExtras before re-adding
    var _lre=document.getElementById('legoRelExtras');
    if(_lre)_lre.innerHTML='';
    // Re-apply current relOpts to legoRelExtras
    if(typeof updateBadgeTL==='function')updateBadgeTL(null);
    if(typeof updateBadgeBR==='function')updateBadgeBR(null,null);
  }}
  if(n===7){_sumRemoved={moldura:false,led:false,rel:[]};buildSummary();}
  calcPrice();
}

// ── SOFT-DELETE STATE (reset ao entrar no step 7) ──
var _sumRemoved={moldura:false,led:false,rel:[]};

// ── REMOVE OPCIONAL DO RESUMO ──
function removeSumItem(type, key, label){
  if(type==='moldura'){
    _sumRemoved.moldura=true;
    var _lc=document.querySelector('#step-5 .ocard[onclick*="m-laca"]');
    if(_lc) selMoldura(_lc,'m-laca','Laca Preto');
    else { S.moldura='m-laca'; S.molduraLbl='Laca Preto'; calcPrice(); }
  } else if(type==='led'){
    if(S.led){ _sumRemoved.led=true; _sumRemoved.ledFio=S.ledFio; _sumRemoved.ledTipo=S.ledTipo; togLED(); }
  } else if(type==='rel'){
    _sumRemoved.rel.push({key:key,label:label||key});
    var _row=document.querySelector('.rrow[onclick*="\''+key+'\'"]');
    if(_row && _row.classList.contains('sel')) togRelevoOpt(_row, key, label||key, 89);
    // Remove visual elements from preview
    document.querySelectorAll('.rel-'+key).forEach(function(el){el.remove();});
  }
  buildSummary();
}
function restoreSumItem(type, key, label){
  if(type==='moldura'){
    _sumRemoved.moldura=false;
    var _fc=document.querySelector('#step-5 .ocard[onclick*="m-fibra"]');
    if(_fc) selMoldura(_fc,'m-fibra','Fibra de Carbono');
  } else if(type==='led'){
    var _sF=_sumRemoved.ledFio||'com', _sT=_sumRemoved.ledTipo||'warm';
    _sumRemoved.led=false;
    if(!S.led) togLED(); // liga com reset padrão
    // Restaurar fio/tipo que o cliente havia escolhido
    S.ledFio=_sF; S.ledTipo=_sT;
    var _fc2=document.getElementById('ledFioCom'),_fs2=document.getElementById('ledFioSem');
    if(_fc2) _fc2.classList.toggle('sel',_sF==='com');
    if(_fs2) _fs2.classList.toggle('sel',_sF==='sem');
    var _cw2=document.getElementById('ledCardWarm'),_cr2=document.getElementById('ledCardRgb');
    if(_cw2) _cw2.classList.toggle('on',_sT==='warm');
    if(_cr2) _cr2.classList.toggle('on',_sT==='rgb');
    ['ledGlow','legoLedGlow'].forEach(function(id){var el=document.getElementById(id);if(el)el.className='led-glow '+(_sT==='rgb'?'cold':_sT);});
    calcPrice();
  } else if(type==='rel'){
    _sumRemoved.rel=_sumRemoved.rel.filter(function(r){return r.key!==key;});
    var _row2=document.querySelector('.rrow[onclick*="\''+key+'\'"]');
    if(_row2 && !_row2.classList.contains('sel')) togRelevoOpt(_row2, key, label||key, 89);
    // Re-add visual to preview
    if(key==='bandeira' && typeof addBandeira==='function') addBandeira();
    else if(key==='piloto' && typeof addPiloto==='function') addPiloto();
  }
  buildSummary();
}

// ── STEP 1: TIPO ──
function selectTipo(t){
  S.tipo=t;
  // sair do modo catalogo logo no inicio (garante reset mesmo se algo abaixo falhar)
  S.incProduto=null;
  if(typeof aplicarModoCatalogo==='function')aplicarModoCatalogo(false);
  document.getElementById('tLego').classList.toggle('sel',t==='lego');
  document.getElementById('tMini').classList.toggle('sel',t==='mini');
  var _fc=document.getElementById('fundoFoscoCard');if(_fc)_fc.style.display=t==='mini'?'none':'';
  setStyle('legoSection','display',t==='lego'?'block':'none');
  setStyle('miniSection','display','none');
  setStyle('miniChoiceSection','display',t==='mini'?'block':'none');
  setStyle('step1NavBtns','display',t==='lego'?'':'none');
  setStyle('step1Title','display',t==='mini'?'none':'');
  setStyle('step1Sub','display',t==='mini'?'none':'');
  setEl('step1Title',t==='lego'?'Modelo LEGO':'Miniatura Die-cast / 3D');
  const pvCatQ=document.querySelector('#pvCat span,#pvCat');if(pvCatQ)pvCatQ.textContent=t==='lego'?'LEGO':'Miniatura';
  setEl('pvCat',t==='lego'?'LEGO':'Miniatura / Die-cast');
  if(t==='lego')renderLegoModels('Formula 1');
  else renderMiniSizes();
  calcPrice();

  var _cTL_L=document.getElementById('colorTL_lego');
  var _cTL_M=document.getElementById('colorTL_mini');
  if(_cTL_L)_cTL_L.style.display=t==='mini'?'none':'flex';
  if(_cTL_M)_cTL_M.style.display=t==='mini'?'flex':'none';
  var _cP_L=document.getElementById('colorPiloto_lego');
  var _cP_M=document.getElementById('colorPiloto_mini');
  if(_cP_L)_cP_L.style.display=t==='mini'?'none':'flex';
  if(_cP_M)_cP_M.style.display=t==='mini'?'flex':'none'
  var _tab2=document.getElementById('tabStep2');
  if(_tab2)_tab2.style.display=t==='mini'?'none':'';
  var _smi=document.getElementById('sidebarMiniInfo');
  if(_smi)_smi.style.display=t==='mini'?'block':'none';
  var _sli=document.getElementById('sidebarLegoInfo');
  if(_sli)_sli.style.display=t==='mini'?'none':'block';
  S.incProduto=null;
  if(typeof aplicarModoCatalogo==='function')aplicarModoCatalogo(false);
  // na tela TIPO volta a mostrar os "dois caminhos" (e nao o aviso da imagem por IA)
  var _ip0=document.getElementById('miniInfoPaths'); if(_ip0)_ip0.style.display='block';
  var _ia0=document.getElementById('miniInfoAI');    if(_ia0)_ia0.style.display='none';
}

// ── LEGO BRAND ──
function selLegoBrand(card,brand){
  document.querySelectorAll('#legoBrands .bcard').forEach(c=>c.classList.remove('sel'));
  card.classList.add('sel');
  S.legoBrand=brand;
  renderLegoModels(brand);
}

function renderLegoModels(brand){
  const models=LEGO_CATALOG[brand]||[];
  const el=document.getElementById('legoModels');
  el.innerHTML='';
  models.forEach(m=>{
    const d=document.createElement('div');
    d.className='mrow';
    d.innerHTML=`<span>${m.name}</span><span class="mrow-tag">${m.dim} · ${m.scale}</span>`;
    d.onclick=()=>selLegoModel(d,m);
    el.appendChild(d);
  });
  if(models.length>0)selLegoModel(el.querySelector('.mrow'),models[0]);
}


// ── MODEL CAR IMAGES ──
var MODEL_CAR_IMAGES={
  'Mercedes W14':'images/img_032.webp',
  'McLaren MP4/4 Senna':'images/img_033.webp',
};
var DEFAULT_CAR_SRC='images/img_006.webp';
var MODEL_MINI_IMAGES={
  'Mercedes W14':'images/img_034.webp',
  'McLaren MP4/4 Senna':'images/img_035.webp',
};
var DEFAULT_MINI_SRC='images/img_004.webp';

// ── LOGO BR POR MODELO ──
var MODEL_LOGO_BR={
  'Mercedes W14':'images/img_036.webp',
};
var DEFAULT_LOGO_BR_SRC='images/img_009.png';
var FERRARI_MODELS_SET=new Set(['Ferrari SF24 F1','Ferrari 488 GTE','Ferrari Daytona SP3']);
var MODEL_LOGO_BR_SIZE={
  'Mercedes W14':{h:'22px',w:'auto'},
};
var MODEL_CAR_SIZE={
  'McLaren MP4/4 Senna':'36.96%',
};






var INCLUSO_MODELS={
  'Ferrari':[
    {name:'Ferrari 458',imgs:[],price:null,desc:''},
    {name:'Ferrari 458 Scuderia Amarela',imgs:[],price:null,desc:''},
    {name:'Ferrari F50',imgs:[],price:null,desc:''},
  ],
};

var MODEL_RELEVO_IMAGES={
  'McLaren MP4/4 Senna':{
    placa:'images/img_037.webp',
    tracado:'images/img_038.webp',
    placa_cfg:{w:48,pos:'bottom-left',bottom:'10%'},
    tracado_cfg:{w:40,pos:'bottom-right',bottom:'calc(33% - 10px)',right:'calc(6% + 5px)'},
    bandeira_pos:'bottom-right',
    bandeira_bottom:'calc(24% - 10px)',
    bandeira_right:'calc(6% + 5px)',
  },
};
function selLegoModel(row,model){
  var iCarro=document.getElementById('iCarro');
  if(iCarro){
    iCarro.src=MODEL_CAR_IMAGES[model.name]||DEFAULT_CAR_SRC;
    const _cDiv=iCarro.closest('.c-carro');
    if(_cDiv)_cDiv.style.width=MODEL_CAR_SIZE[model.name]||'';
  }
  var iMiniHero=document.getElementById('iMiniHero');
  if(iMiniHero)iMiniHero.src=MODEL_MINI_IMAGES[model.name]||DEFAULT_MINI_SRC;
  var logoBR=document.getElementById('logoBR');
  if(logoBR){
    const _hasModelLogo=!!MODEL_LOGO_BR[model.name];
    const _logoSrc=MODEL_LOGO_BR[model.name]||(FERRARI_MODELS_SET.has(model.name)?DEFAULT_LOGO_BR_SRC:null);
    const _bbrDiv=logoBR.closest('.b-br');
    if(_logoSrc){
      logoBR.src=_logoSrc;
      if(_bbrDiv)_bbrDiv.style.display='';
      const _sz=MODEL_LOGO_BR_SIZE[model.name];
      if(_sz){
        logoBR.style.height=_sz.h;
        logoBR.style.width=_sz.w;
        logoBR.style.maxWidth='none';
      } else {
        logoBR.style.height='';
        logoBR.style.width='';
        logoBR.style.maxWidth='';
      }
    } else {
      if(_bbrDiv)_bbrDiv.style.display='none';
    }
  }
  // Refresh fundo e moldura per-model (sem referência a F/M — definidos depois no INIT)
  const _iFund=document.getElementById('iFundo');
  if(_iFund){
    const _mf2=MODEL_FUNDO_IMAGES[model.name];
    const _fk2={'f-carbono':'fibra','f-uv':'brilho','f-fosco':'fosco'}[S.fundo];
    if(_mf2&&_mf2[_fk2]) _iFund.src=_mf2[_fk2];
  }
  const _iMold=document.getElementById('iMoldura');
  if(_iMold){
    const _mm2=MODEL_MOLDURA_IMAGES[model.name];
    const _mk2={'m-fibra':'fibra','m-laca':'laca'}[S.moldura];
    if(_mm2&&_mm2[_mk2]) _iMold.src=_mm2[_mk2];
  }
  var hSub=document.getElementById('headerSub');
  if(hSub)hSub.textContent='Visualizador · '+model.name+' LEGO';
  document.querySelectorAll('#legoModels .mrow').forEach(r=>r.classList.remove('sel'));
  row.classList.add('sel');
  S.legoModel=model.name;
  S.legoF1=model.f1;
  S.legoDim=model.dim;
  updateFixedRelevo();
  // Mostrar/ocultar rrows de relevo por modelo
  (function(){
    var _mr=(typeof MODEL_RELEVO_IMAGES!=='undefined')&&MODEL_RELEVO_IMAGES[model.name];
    var _hasPlaca=!!(_mr&&_mr.placa);
    var _hasTracado=!!(_mr&&_mr.tracado);
    var _rPlaca=document.querySelector('.rrow[data-rel="placa"]');
    var _rTracado=document.querySelector('.rrow[data-rel="tracado"]');
    var _rPiloto=document.querySelector('.rrow[data-rel="piloto"]');
    if(_rPlaca) _rPlaca.style.display=_hasPlaca?'':'none';
    if(_rTracado) _rTracado.style.display=_hasTracado?'':'none';
    if(_rPiloto) _rPiloto.style.display=_hasPlaca?'none':'';
    var _pi=document.getElementById('pilotoInput');
    if(_pi&&_hasPlaca) _pi.style.display='none';
    // Remover relevos fixos do modelo anterior ao trocar
    var _op=document.querySelector('.rel-placa');
    if(_op) _op.remove();
    var _ot=document.querySelector('.rel-tracado');
    if(_ot) _ot.remove();
    // Desmarcar rows se modelo não tem a imagem
    if(_rPlaca&&!_hasPlaca) _rPlaca.classList.remove('sel');
    if(_rTracado&&!_hasTracado) _rTracado.classList.remove('sel');
  })();
  setEl('pvMod',model.name);
  setEl('carLbl',model.name);
  updateBadgeTL(model.f1?'F1':'Logo '+model.name.split(' ')[0]);
  renderFundoLayouts(S.fundo);
  calcPrice();
}

// ── MINI BRAND ──


function selMiniBrandIncluso(card,brand){
  document.querySelectorAll('#miniBrands .bcard').forEach(c=>c.classList.remove('sel'));
  card.classList.add('sel');
  S.miniBrand=brand;
  // Mostrar galeria de modelos incluso
  setStyle('miniSection','display','none');
  setStyle('miniInclusoModelSection','display','block');
  setEl('inclusoModelTitle', brand + ' — Modelos disponíveis');
  var models=INCLUSO_MODELS[brand]||[];
  var grid=document.getElementById('inclusoModelGrid');
  if(!grid)return;
  grid.innerHTML='';
  if(models.length===0){
    grid.innerHTML='<div style="color:#888;padding:20px;">Nenhum modelo cadastrado ainda.</div>';
    return;
  }
  models.forEach(function(m,i){
    var card=document.createElement('div');
    card.style.cssText='background:#1e1e1e;border:1.5px solid #333;border-radius:10px;overflow:hidden;cursor:pointer;transition:border-color .2s;';
    card.onmouseenter=function(){this.style.borderColor='#e07b00';};
    card.onmouseleave=function(){this.style.borderColor='#333';};
    card.onclick=function(){selInclusoModel(m);};
    var imgH=m.img?'<img src="'+m.img+'" style="width:100%;height:110px;object-fit:cover;">'
      :'<div style="width:100%;height:110px;background:#2a2a2a;display:flex;align-items:center;justify-content:center;color:#555;font-size:11px;">Foto em breve</div>';
    var priceH=m.price?'<div style="color:#e07b00;font-weight:700;font-size:13px;margin-top:4px;">R$ '+m.price.toFixed(2).replace('.',',')+'</div>':'';
    card.innerHTML=imgH+'<div style="padding:8px 10px;"><div style="color:#eee;font-size:12px;font-weight:600;line-height:1.3;">'+m.name+'</div>'+priceH+'</div>';
    grid.appendChild(card);
  });
}

function backToInclusoBrands(){
  setStyle('miniInclusoModelSection','display','none');
  setStyle('miniSection','display','block');
}

function selInclusoModel(model){
  S.inclusoModel=model;
  // marca vem do que o cliente escolheu no dropdown (form ativo), nao de um valor fixo
  var _fb=((document.getElementById('aiCarBrand')||{}).value||'').trim()||((document.getElementById('apenaCarBrand')||{}).value||'').trim();
  S.incBrand=_fb||S.miniBrand||'';
  S.miniChoice='incluso';
  // nesta tela o aviso e sobre a imagem gerada por IA (nao sobre os dois caminhos)
  var _ip=document.getElementById('miniInfoPaths'); if(_ip)_ip.style.display='none';
  var _ia=document.getElementById('miniInfoAI');    if(_ia)_ia.style.display='block';

  // Renomear tab e título do step-2
  setEl('tabStep2Lbl','Produto');
  setEl('step2Title', model.name || 'Produto');
  setEl('step2Sub', S.incBrand || '');

  // Esconder conteúdo regular, mostrar incluso
  setStyle('step2RegularContent','display','none');
  setStyle('inclusoProdutoSection','display','block');

  var imgs = model.imgs||[];
  var firstImg = imgs[0]||'';

  // ── Injetar imagem AI no painel hero (substitui Ferrari SF24 default) ──
  var mhi = document.getElementById('miniHeroImg');
  if(mhi && firstImg){
    mhi.style.padding='0';
    mhi.style.background='#0d0d0d';
    mhi.innerHTML='<img src="'+firstImg+'" style="width:100%;height:100%;object-fit:contain;border-radius:0;display:block;">';
  }

  // Preencher galeria (ip2MainImgWrap oculto quando há imagem no hero)
  var mainWrapOuter = document.getElementById('ip2MainImgWrap');
  var mainWrap = document.getElementById('ip2MainImg');
  var thumbsWrap = document.getElementById('ip2Thumbs');
  if(firstImg && mainWrapOuter){
    // Imagem já no hero — esconde galeria duplicada
    mainWrapOuter.style.display='none';
    if(thumbsWrap) thumbsWrap.style.display='none';
  } else if(mainWrap){
    if(mainWrapOuter) mainWrapOuter.style.display='';
    if(thumbsWrap) thumbsWrap.style.display='';
    if(imgs.length===0){
      mainWrap.innerHTML='<div style="color:#555;font-size:13px;">Fotos em breve</div>';
    } else {
      mainWrap.innerHTML='<img id="ip2MainGalleryImg" src="'+firstImg+'" style="width:100%;height:100%;object-fit:contain;border-radius:10px;">';
      if(thumbsWrap){
        thumbsWrap.innerHTML='';
        imgs.forEach(function(src,i){
          var th=document.createElement('div');
          th.style.cssText='width:72px;height:54px;border-radius:7px;overflow:hidden;cursor:pointer;border:2px solid '+(i===0?'#e07b00':'#333')+';flex-shrink:0;';
          th.innerHTML='<img src="'+src+'" style="width:100%;height:100%;object-fit:contain;">';
          th.onclick=(function(s,el){return function(){
            var mg=document.getElementById('ip2MainGalleryImg');
            if(mg)mg.src=s;
            var mhi2=document.getElementById('miniHeroImg');
            if(mhi2)mhi2.innerHTML='<img src="'+s+'" style="width:100%;height:100%;object-fit:contain;border-radius:0;display:block;">';
            thumbsWrap.querySelectorAll('div').forEach(function(d){d.style.borderColor='#333';});
            el.style.borderColor='#e07b00';
          };})(src,th);
          thumbsWrap.appendChild(th);
        });
      }
    }
  }

  // Descrição
  setEl('ip2Desc', model.desc || '');

  // Navegar para step-2
  goStep(2);
}

function backToInclusoModels(){
  setStyle('miniInclusoProductSection','display','none');
  setStyle('miniInclusoModelSection','display','block');
}

function confirmarInclusoModel(){
  var m=S.inclusoModel||{};
  var brand=S.incBrand||S.miniBrand||'';

  // Preencher cabeçalho incluso
  setEl('iSumBrand', brand);
  setEl('iSumName', m.name||'');
  setEl('iSumDesc', m.desc||'');
  setEl('iSumPrice', m.price ? 'R$ '+m.price.toFixed(2).replace('.',',') : 'Consulte o preço');

  // Imagem
  var imgWrap=document.getElementById('iSumImg');
  if(imgWrap){
    var imgs=m.imgs||[];
    imgWrap.parentElement.innerHTML=imgs.length>0
      ?'<img src="'+imgs[0]+'" style="width:130px;height:130px;object-fit:cover;">'
      :'<div style="width:130px;height:100px;display:flex;align-items:center;justify-content:center;color:#555;font-size:11px;">Foto em breve</div>';
  }

  // Preencher sum-block com dados do produto incluso
  setEl('sumCat','Quadro para Miniaturas');
  setEl('sumMod', brand + (m.name ? ' — ' + m.name : ''));
  setEl('sumDim', m.dim||'—');
  setEl('sumMold','—');
  setEl('sumFund','—');
  setEl('sumLed','—');
  setEl('sumMini','Inclusa no produto');
  setEl('sumRel','—');
  setEl('pvSku','—');
  setEl('sumTotal', m.price ? 'R$ '+m.price.toFixed(2).replace('.',',') : 'Consulte o preço');

  // Navegar para step-7
  goStep(7);

  // Mostrar cabeçalho incluso + manter sum-block
  setStyle('inclusoSummaryBlock','display','block');
  document.querySelector('#step-7 .sum-block').style.display='';
  document.querySelector('#step-7 .tags').style.display='none';
  document.querySelector('#step-7 .btn-fin').style.display='none';
  document.querySelector('#step-7 .btn-wpp').style.display='none';
  var backBtn=document.querySelector('#step-7 .btn-back');
  if(backBtn)backBtn.style.display='none';
}

function backToInclusoProduct(){
  setStyle('inclusoSummaryBlock','display','none');
  setStyle('miniInclusoProductSection','display','block');
  setStyle('miniInclusoModelSection','display','none');
  goStep(1);
}

function finalizarIncluso(){
  abrirWpp();
}


// Chave via URL hash (#key=sk-...) ou localStorage — nunca hardcoded
(function(){
  var hash=window.location.hash;
  var m=hash.match(/[#&]key=([^&]+)/);
  if(m&&m[1]){
    try{localStorage.setItem('funparts_oai_key',decodeURIComponent(m[1]));}catch(e){}
    // Limpa o hash da URL sem recarregar a página
    history.replaceState(null,'',window.location.pathname+window.location.search);
  }
})();
var OPENAI_API_KEY=(function(){try{return localStorage.getItem('funparts_oai_key')||'';}catch(e){return '';}}());

function _pollinationsImage(carName, color, resolve, reject){
  var prompt=
    'Hyper-realistic professional product photo. 1:18 scale die-cast collectible miniature of a '+color+' '+carName+'. '
    +'Positioned on a dark walnut executive desk, 3/4 front-left view, car nose pointing left. '
    +'Correct proportions and silhouette faithful to original '+carName+'. '
    +color+' high-gloss metallic paint, realistic reflections, chrome details, detailed alloy wheels, realistic tires, '
    +'headlights, taillights, air intakes, front grille, side mirrors, visible interior. '
    +'Background: black leather executive chair left, large window right with soft-focus commercial skyscrapers, '
    +'green plant in black pot right, B&W decorative framed artwork, dark hardcover book foreground. '
    +'Soft natural window light from right, realistic paint and desk reflections, '
    +'natural soft shadow beneath miniature, sharp focus on car, blurred background. '
    +'Ultra-photorealistic, 8K, studio product photography, premium luxury composition. '
    +'No people, no text overlays, no distorted logos.';
  var seed=Math.floor(Math.random()*99999);
  var url='https://image.pollinations.ai/prompt/'+encodeURIComponent(prompt)
    +'?width=1344&height=896&model=gptimage&seed='+seed+'&nologo=true&enhance=true';
  console.log('[Funparts] Pollinations URL:', url);
  fetch(url,{signal:AbortSignal.timeout?AbortSignal.timeout(120000):undefined})
    .then(function(resp){
      console.log('[Funparts] Pollinations status:', resp.status, resp.headers.get('content-type'));
      if(resp.ok && (resp.headers.get('content-type')||'').startsWith('image/')){
        resolve(url);
      } else {
        reject(new Error('Erro ao gerar imagem (status '+resp.status+'). Tente novamente.'));
      }
    })
    .catch(function(e){
      console.error('[Funparts] Pollinations error:', e);
      reject(new Error('Sem conexão com o servidor de imagens. Verifique sua internet e tente novamente.'));
    });
}

function generateCarImage(brand, model, year, color){
  return new Promise(function(resolve, reject){
    var carName=(brand+' '+model+(year?' '+year:'')).trim();
    var _prompt=
      'Crie uma imagem hiper-realista em alta resolução de uma miniatura em escala 1:18 de um carro da marca '+brand+', modelo '+model+(year?', ano '+year:'')+', na cor '+color+'.\n'+
      'A imagem deve seguir como referência visual o cenário de um escritório executivo moderno, com uma mesa de madeira escura e superfície levemente brilhante, ambiente elegante, limpo e sofisticado.\n'+
      'O carro deve estar posicionado sobre a mesa como peça principal da composição, em visão frontal 3/4, levemente na diagonal, com a dianteira apontada para o lado esquerdo da imagem e a traseira para o lado direito, mantendo proporções realistas de uma miniatura colecionável escala 1:18.\n'+
      'O veículo deve ser extremamente detalhado, com aparência de miniatura premium die-cast, pintura brilhante na cor '+color+', reflexos realistas, rodas detalhadas, pneus realistas, faróis, lanternas, entradas de ar, grade frontal, retrovisores, interior visível quando aplicável, acabamento fiel ao modelo real '+model+(year?' '+year:'')+' da marca '+brand+'.\n'+
      'Não alterar as proporções originais do carro. Não deixar o carro mais largo, mais estreito, mais alto ou mais baixo do que o modelo real. Manter fielmente a silhueta, comprimento, largura, altura, entre-eixos, formato dos faróis, lanternas, para-choques, rodas, portas, capô, teto e demais características do veículo original.\n'+
      'A composição deve parecer uma fotografia profissional de produto dentro de um escritório.\n'+
      'Cenário: Mesa executiva de madeira escura com textura realista e reflexos suaves. Cadeira de escritório preta em couro ao fundo, posicionada no lado esquerdo. Porta-canetas preto com canetas metálicas no lado esquerdo da mesa. Armário ou aparador de madeira ao fundo. Quadro decorativo preto e branco apoiado no aparador, levemente desfocado. Janela grande no lado direito, com vista desfocada para prédios comerciais. Planta verde em vaso preto no lado direito. Livro ou caderno escuro no canto direito da mesa. Caneta metálica sobre o caderno no primeiro plano.\n'+
      'Iluminação: Luz natural suave entrando pela janela lateral direita. Reflexos realistas na pintura do carro e na mesa. Sombras naturais e suaves abaixo da miniatura. Profundidade de campo realista, com o carro em foco e o fundo levemente desfocado.\n'+
      'Estilo visual: Hiper-realismo. Fotografia profissional de produto. Alta resolução. Ultra detailed. Realistic reflections. Realistic shadows. Premium collectible miniature. Executive office environment. Clean luxury composition.\n'+
      'Formato: Proporção horizontal 16:9. Enquadramento centralizado no carro com espaço ao redor para mostrar o cenário. Não inserir pessoas. Não inserir textos aleatórios. Não distorcer logotipos ou emblemas do carro. Não criar um carro genérico; o veículo deve ser fiel ao modelo '+model+(year?' '+year:'')+' da marca '+brand+'.';

    function _setStatus(txt){var el=document.getElementById('aiLoadingStatus');if(el)el.textContent=txt;}

    // ── Proxy Cloudflare Worker — chave OpenAI fica server-side ──
    _setStatus('Gerando com OpenAI (alta resolução)…');
    var xhr=new XMLHttpRequest();
    xhr.open('POST','https://funparts-ai-proxy.rodox1209.workers.dev',true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.timeout=120000;
    xhr.onload=function(){
      try{
        var data=JSON.parse(xhr.responseText);
        if(xhr.status>=400){
          reject(new Error((data.error&&data.error.message)||('HTTP '+xhr.status)));return;
        }
        var item=data.data&&data.data[0];
        if(!item){reject(new Error('Resposta vazia'));return;}
        if(item.b64_json)resolve('data:image/png;base64,'+item.b64_json);
        else if(item.url)resolve(item.url);
        else reject(new Error('Formato inesperado'));
      }catch(e){reject(new Error(e.message));}
    };
    xhr.onerror=function(){reject(new Error('Erro de conexão com o servidor'));};
    xhr.ontimeout=function(){reject(new Error('Tempo esgotado. Tente novamente.'));};
    xhr.send(JSON.stringify({model:'gpt-image-1',prompt:_prompt,n:1,size:'1536x1024',quality:'medium'}));
  });
}

function salvarApiKey(){
  var k=document.getElementById('aiApiKey')?document.getElementById('aiApiKey').value.trim():'';
  if(!k||!k.startsWith('sk-')){
    setStyle('aiErrorState','display','block');
    setEl('aiErrorState','⚠ Chave inválida. Deve começar com sk-');
    return;
  }
  OPENAI_API_KEY=k;
  setStyle('aiKeySection','display','none');
  setStyle('aiKeyOk','display','block');
  setStyle('aiErrorState','display','none');
}

var AI_COLORS=[
  {name:'Vermelho Ferrari',hex:'#CC0000'},{name:'Vermelho Escuro',hex:'#8B0000'},
  {name:'Laranja',hex:'#FF6600'},{name:'Amarelo',hex:'#FFD700'},
  {name:'Verde Britânico',hex:'#005C2E'},{name:'Verde Lima',hex:'#7DC26A'},
  {name:'Azul Metálico',hex:'#1C4B9C'},{name:'Azul Celeste',hex:'#4DA6FF'},
  {name:'Turquesa',hex:'#00B5B0'},{name:'Roxo',hex:'#6B3FA0'},
  {name:'Rosa',hex:'#E8568A'},{name:'Preto',hex:'#111111'},
  {name:'Cinza Escuro',hex:'#444444'},{name:'Cinza Grafite',hex:'#777777'},
  {name:'Prata',hex:'#C0C0C0'},{name:'Branco',hex:'#EFEFEF'},
  {name:'Champagne',hex:'#D4B896'},{name:'Dourado',hex:'#C8A400'},
];

function initColorPalette(){
  var palette=document.getElementById('aiColorPalette');
  if(!palette||palette.children.length>0)return;
  AI_COLORS.forEach(function(c){
    var sw=document.createElement('div');
    sw.title=c.name;
    sw.style.cssText='aspect-ratio:1;border-radius:7px;background:'+c.hex+';cursor:pointer;border:2px solid #2a2a2a;transition:border .12s,transform .12s;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);';
    sw.onclick=function(){
      palette.querySelectorAll('div').forEach(function(s){s.style.border='2px solid #2a2a2a';s.style.transform='scale(1)';});
      sw.style.border='2px solid #e07b00';
      sw.style.transform='scale(1.18)';
      document.getElementById('aiCarColor').value=c.name;
    };
    palette.appendChild(sw);
  });
}

function initApenaColorPalette(){var palette=document.getElementById('apenaColorPalette');if(!palette||palette.children.length>0)return;AI_COLORS.forEach(function(c){var sw=document.createElement('div');sw.title=c.name;sw.style.cssText='aspect-ratio:1;border-radius:7px;background:'+c.hex+';cursor:pointer;border:2px solid #2a2a2a;transition:border .12s,transform .12s;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);';sw.onclick=function(){palette.querySelectorAll('div').forEach(function(s){s.style.border='2px solid #2a2a2a';s.style.transform='scale(1)';});sw.style.border='2px solid #e07b00';sw.style.transform='scale(1.18)';document.getElementById('apenaCarColor').value=c.name;};palette.appendChild(sw);});}
async function gerarVisualizacaoApenas(){initApenaColorPalette();var brand=(document.getElementById('apenaCarBrand')||{}).value||S.miniBrand||'';var model=(document.getElementById('apenaCarModel')||{}).value||S.miniModel||'';var year=(document.getElementById('apenaCarYear')||{}).value||'';var color=(document.getElementById('apenaCarColor')||{}).value||'';brand=brand.trim();model=model.trim();year=year.trim();color=color.trim();if(!brand||!model||!color){setStyle('apenaErrorState','display','block');hideAiPopup();setEl('apenaErrorState','⚠ Selecione uma marca, preencha o modelo e selecione uma cor.');return;}setStyle('apenaErrorState','display','none');setStyle('apenaGenerateBtn','display','none');setStyle('apenaGeneratedResult','display','none');setStyle('apenaLoadingState','display','block');showAiPopup();var carName=[brand,model,year].filter(Boolean).join(' ');S.miniBrand=brand;S.miniModel=model;S.aiCarName=carName;S.aiCarColor=color;_detTopViewUrl='';_detTopViewKey='';try{var imgUrl=await Promise.race([generateTopViewPromise((brand+' '+model+(year?' '+year:'')).trim(),color),new Promise(function(_r,rej){setTimeout(function(){rej(new Error('Tempo esgotado (90s). Verifique sua chave OpenAI.'));},90000);})]);setStyle('apenaLoadingState','display','none');setStyle('apenaGenerateBtn','display','block');setStyle('apenaGeneratedResult','display','block');hideAiPopup();var img=document.getElementById('apenaGeneratedImg');if(img)img.src=imgUrl;_detTopViewUrl=imgUrl;_detTopViewKey=([brand,model,year].filter(Boolean).join(' '))+'|'+color;var hero=document.getElementById('miniStep1HeroImg');if(hero){hero.style.display='flex';hero.style.padding='0';hero.style.background='#0d0d0d';hero.innerHTML='<img src="'+imgUrl+'" style="width:100%;height:100%;object-fit:cover;border-radius:0;display:block;">';}setEl('pvMod',brand+(model?' — '+model:''));goStep(3);}catch(e){setStyle('apenaLoadingState','display','none');setStyle('apenaGenerateBtn','display','block');setStyle('apenaErrorState','display','block');setEl('apenaErrorState','⚠ '+(e.message||'Erro desconhecido'));}}
async function gerarVisualizacaoIA(){
  initColorPalette();
  var brand=(document.getElementById('aiCarBrand')||{}).value||'';
  var model=(document.getElementById('aiCarModel')||{}).value||'';
  var year=(document.getElementById('aiCarYear')||{}).value||'';
  var color=document.getElementById('aiCarColor').value.trim();
  brand=brand.trim(); model=model.trim(); year=year.trim();
  var carName=(brand+' '+model+(year?' '+year:'')).trim();
  if(!brand||!model||!color){
    setStyle('aiErrorState','display','block');
    setEl('aiErrorState','⚠ Preencha a marca, o modelo e selecione uma cor.');
    return;
  }

  setStyle('aiErrorState','display','none');
  setStyle('aiGenerateBtn','display','none');
  setStyle('aiLoadingState','display','block');
  showAiPopup();
  S.aiCarName=carName;
  S.aiCarColor=color;
  S.incBrand=brand;
  try{
    var imgUrl=await generateCarImage(brand,model,year,color);
    var fakeModel={name:color+' '+carName,imgs:[imgUrl],price:null,desc:'Visualização gerada por IA · '+color+' '+carName};
    setStyle('aiLoadingState','display','none');
    setStyle('aiGenerateBtn','display','block');
    hideAiPopup();
    selInclusoModel(fakeModel);
  }catch(e){
    setStyle('aiLoadingState','display','none');
    setStyle('aiGenerateBtn','display','block');
    hideAiPopup();
    setStyle('aiErrorState','display','block');
    var msg=e.message||'Erro desconhecido';
    if(msg.includes('401')){
      msg='Chave inválida ou expirada. Verifique a chave em platform.openai.com';
    }
    setEl('aiErrorState','⚠ '+msg);
  }
}

function backToMiniChoice(){
  setStyle('miniInclusoAISection','display','none');
  setStyle('miniApenasSection','display','none');
  setStyle('miniChoiceSection','display','block');
  S.incProduto=null;
  if(typeof aplicarModoCatalogo==='function')aplicarModoCatalogo(false);
  setStyle('step1NavBtns','display','none');
}

function selMiniChoice(choice){
  S.miniChoice=choice;
  // fora do catalogo o aviso lateral volta ao normal
  if(choice!=='incluso') setStyle('sidebarMiniInfo','display','block');
  setStyle('miniChoiceSection','display','none');
  setStyle('miniSection','display','block');
  setEl('step1Title','QUADRO PARA MINIATURAS');
  setEl('step1Sub','Selecione o quadro da sua preferência');
  setStyle('step1Title','display','');
  setStyle('step1Sub','display','');

  if(choice==='incluso'){
    // Modo incluso: mostrar seção de IA em vez de brand logos
    setStyle('miniSection','display','none');
    setStyle('miniInclusoAISection','display','block');
    // o aviso dos "dois caminhos" so vale nas etapas anteriores
    setStyle('sidebarMiniInfo','display','none');
    setStyle('step1NavBtns','display','none');
    S.incProduto=null;
    aplicarModoCatalogo(false);
    renderInclusoBrands();

  } else {
    // Modo apenas: formulário AI
    setStyle('miniSection','display','none');
    setStyle('miniApenasSection','display','block');
    setStyle('step1NavBtns','display','none');
    setTimeout(initApenaColorPalette,50);
  }
}
function selMiniBrand(card,brand){
  if(S.miniChoice==='incluso'){
    selMiniBrandIncluso(card,brand);
    return;
  }
  document.querySelectorAll('#miniBrands .bcard').forEach(c=>c.classList.remove('sel'));
  card.classList.add('sel');
  S.miniBrand=brand;
  setEl('pvMod',brand+(S.miniModel?' — '+S.miniModel:''));
}

function updateMiniModel(){
  S.miniModel=document.getElementById('miniModelInput').value;
  setEl('pvMod',S.miniBrand+(S.miniModel?' — '+S.miniModel:''));
  setEl('carLbl',S.miniModel||S.miniBrand);
  updateBadgeTL(S.miniModel||S.miniBrand);
  const iF1=S.miniBrand==='Formula 1';
  S.legoF1=iF1;
  updateFixedRelevo();
}

function renderMiniSizes(){
  const el=document.getElementById('miniSizeOpts');
  el.innerHTML='';
  MINI_SIZES.forEach((sz,i)=>{
    const d=document.createElement('div');
    d.className='ocard'+(i===0?' sel':'');
    d.innerHTML=`<div class="ochk">${i===0?'✓':''}</div><div class="oname">${sz.label}</div><div class="odesc">Escala: ${sz.scale}</div>`;
    d.onclick=()=>selMiniSize(d,sz);
    el.appendChild(d);
  });
  S.miniSize=MINI_SIZES[0].id;
  S.miniDim=MINI_SIZES[0].label;
}

function selMiniSize(card,sz){
  document.querySelectorAll('#miniSizeOpts .ocard').forEach(c=>{c.classList.remove('sel');c.querySelector('.ochk').textContent='';});
  card.classList.add('sel');
  card.querySelector('.ochk').textContent='✓';
  S.miniSize=sz.id;
  S.miniDim=sz.label;
  calcPrice();
}

// ── STEP 3: MINIATURA ──
function selMiniOpt(opt){
  S.miniOpt=opt;
  document.getElementById('mOwnCard').classList.toggle('sel',opt==='own');
  document.getElementById('mBuyCard').classList.toggle('sel',opt==='buy');
  setStyle('ownSection','display',opt==='own'?'block':'none');
  setStyle('buySection','display',opt==='buy'?'block':'none');
  calcPrice();
}

function selDisp(row,key,label){
  document.querySelectorAll('#buySection .rrow').forEach(r=>r.classList.remove('sel'));
  row.classList.add('sel');
  S.disp=key;
}

function togCustom(row,label){
  row.classList.toggle('sel');
  const box=row.querySelector('.ckbox');
  const on=row.classList.contains('sel');
  box.textContent=on?'✓':'';
  const extra=parseInt(row.querySelector('.ckextra').textContent.replace(/\D/g,''));
  if(on){S.customs.push(label);S.customExtra+=extra;}
  else{S.customs=S.customs.filter(c=>c!==label);S.customExtra-=extra;}
  calcPrice();
}

function trigUpload(){document.getElementById('fileInput').click();}
function handleFile(e){
  if(e.target.files[0]){
    const z=document.querySelector('.upload-z');
    z.querySelector('.utit').textContent='✅ '+e.target.files[0].name;
    z.querySelector('.udesc').textContent='Foto recebida. Nossa equipe validará a escala.';
  }
}

// ── STEP 4: DETALHAMENTO ──
var SCALE_FRAMES={
  '1:43':['25x35cm'],
  '1:24':['25x35cm','49x49cm'],
  '1:18':['49x49cm','40x66,5cm'],
  '1:12':['40x66,5cm']
};

var FIBRA_B64="images/img_039.jpg";
var FUNDO_IMAGES={
  "25x35cm":"images/img_040.jpg",
  "49x49cm":"images/img_041.jpg",
  "40x66,5cm":"images/img_042.jpg"
};
var DIM_IMAGES={
  "25x35cm":"images/img_043.png",
  "49x49cm":"images/img_044.png",
  "40x66,5cm":"images/img_045.png",
};
var DIM_STYLE={
  '25x35cm':  {cls:'m-fibra', ratio:'1303/1829'},
  '49x49cm':  {cls:'m-fibra', ratio:'525/527'},
  '40x66,5cm':{cls:'m-fibra', ratio:'800/1266'}
};
// Moldura images for miniatura preview (dimension × tipo)
var MINI_MOLDURA_IMAGES={
  '25x35cm':  {fibra:'https://lh3.googleusercontent.com/d/1gISNsZWMTieUpIlOR8mXAEMfwcdxlnAY', laca:'https://lh3.googleusercontent.com/d/1AA0l-XiKaWFspkQYcEGqrnHQ2DC86PNX'},
  '40x66,5cm':{fibra:'https://lh3.googleusercontent.com/d/1Y2Pj3MoWsb75czP2alkPqBgbIIy0-4Eb', laca:'https://lh3.googleusercontent.com/d/1Yt_ldtRaI_TPGhPieFGsQ762A-3FXTT2'},
  '49x49cm':  {fibra:'https://lh3.googleusercontent.com/d/1SZLlOB6U2IKWYTr2CWC2G6craO8LgGv7', laca:'https://lh3.googleusercontent.com/d/1OXb1ET16x7qKrN5mxB8WTTPfKEFzpSbv'}
};
var MINI_SCALE_IMGS={
  '25x35cm':  'images/img_046.jpg',
  '49x49cm':  'images/img_047.jpg',
  '40x66,5cm':'images/img_048.jpg',
  '66,5x40cm':'images/img_049.jpg'
};
function updateMiniRefImg(){
  var el=document.getElementById('miniScaleImg');
  if(!el)return;
  var img=MINI_SCALE_IMGS[S.quadroDim];
  if(img){el.src=img;var wm=document.querySelector('#wallModalBox img');if(wm)wm.src=img;}
}

// ── DETALHAMENTO: top-view car overlay ──
var _detTopViewUrl='';
var _detTopViewKey='';

// Multiplicadores calibrados pelo usuário para cada combinação escala × quadro
var DET_SIZE_MULT={
  '43_25x35':1.40,
  '24_25x35':1.20,
  '24_49x49':1.40,
  '18_49x49':1.36,
  '18_40x66.5':1.275
};
function getDetCarSize(scale,quadroDim){
  var ratio=parseInt((scale||'1:43').split(':')[1],10)||43;
  var carL=4500/ratio;
  var dims=(quadroDim||'25x35cm').replace('cm','').replace(',','.').split('x').map(parseFloat);
  var longMM=Math.max(dims[0]||35,dims[1]||35)*10;
  var dimKey=(quadroDim||'').replace('cm','').replace(',','.');
  var mult=DET_SIZE_MULT[ratio+'_'+dimKey]||1.0;
  return{hPct:Math.min(0.88,carL/longMM*mult)};
}

function generateTopViewPromise(carName,color){
  return new Promise(function(resolve,reject){
    var prompt=
      'Gere uma imagem de vista superior (top view) de uma miniatura colecionável diecast premium do carro '+carName+', na cor '+color+'.\n'+
      'POSICIONAMENTO OBRIGATÓRIO DA CÂMERA:\n'+
      'A câmera deve estar posicionada exatamente acima do centro do veículo, apontada verticalmente para baixo em um ângulo exato de 90 graus.\n'+
      'A lente deve estar perfeitamente paralela ao plano horizontal do veículo.\n'+
      'Não utilizar perspectiva fotográfica. Não utilizar lente grande-angular. Não utilizar visão isométrica. Não utilizar vista diagonal. Não utilizar vista 3/4.\n'+
      'Não mostrar excessivamente as laterais, a dianteira ou a traseira do veículo.\n'+
      'ALINHAMENTO OBRIGATÓRIO:\n'+
      'O eixo longitudinal central do veículo deve estar perfeitamente reto e vertical na imagem.\n'+
      'ORIENTAÇÃO CRÍTICA — NÃO INVERTER: a DIANTEIRA do carro deve ficar na METADE SUPERIOR da imagem e a TRASEIRA na METADE INFERIOR.\n'+
      'Na PARTE DE CIMA da imagem devem aparecer: capô, grade frontal, faróis dianteiros e para-choque dianteiro.\n'+
      'Na PARTE DE BAIXO da imagem devem aparecer: porta-malas, aerofólio traseiro, lanternas traseiras e escapamento.\n'+
      'O carro aponta para cima, como se estivesse avançando em direção ao topo da imagem.\n'+
      'O centro do para-choque dianteiro, o centro do teto e o centro do para-choque traseiro devem formar uma única linha vertical reta.\n'+
      'As rodas do lado esquerdo e direito devem permanecer perfeitamente alinhadas e simétricas.\n'+
      'O veículo não pode estar rotacionado, inclinado ou posicionado diagonalmente.\n'+
      'FIDELIDADE DO VEÍCULO:\n'+
      'Preservar fielmente o modelo, carroceria, cor, proporções, teto, capô, vidros, aerofólio, entradas de ar, rodas e todos os detalhes visíveis da miniatura original.\n'+
      'Não modificar o design do veículo. Não inventar peças. Não alterar o modelo das rodas.\n'+
      'Não transformar a miniatura em um carro real em tamanho natural. Manter aparência hiper-realista de miniatura diecast premium.\n'+
      'PROPORÇÕES REAIS (crítico): um carro é tipicamente 2,3 a 2,5 vezes mais comprido do que largo. Não esticar nem alargar o veículo para preencher a largura da imagem. A largura da carroceria deve ocupar aproximadamente 40% da largura da imagem, deixando espaço transparente nas laterais.\n'+
      'COMPOSIÇÃO:\n'+
      'Mostrar o veículo inteiro, sem cortar nenhuma parte. Centralizar perfeitamente o veículo na tela.\n'+
      'Manter margens iguais nos quatro lados. Usar composição totalmente simétrica.\n'+
      'Fundo transparente, uniforme e sem elementos adicionais. Não inserir piso, cenário, textos, logotipos adicionais ou objetos.\n'+
      'OPACIDADE (crítico): todas as superfícies do veículo — carroceria, para-brisa, vidros laterais e teto — devem ser materiais sólidos e totalmente opacos (pintados ou vidro fumê). Nenhum furo, área vazada ou transparente dentro da silhueta do carro. A transparência deve existir apenas fora do contorno do veículo.\n'+
      'ILUMINAÇÃO:\n'+
      'Iluminação de estúdio suave e uniforme, distribuída igualmente pelos dois lados.\n'+
      'Evitar sombras laterais fortes que prejudiquem a simetria.\n'+
      'Utilizar apenas uma sombra muito suave e centralizada abaixo da miniatura, caso seja necessária para preservar o volume.\n'+
      'RESULTADO FINAL:\n'+
      'Imagem técnica, ortográfica, perfeitamente centralizada e simétrica, adequada para aplicação automática em um mockup digital.\n'+
      'Vista superior pura. Top view exata. Câmera a 90 graus. Zero perspectiva. Zero rotação diagonal. Zero vista 3/4.\n'+
      'Alta nitidez em todo o veículo. Fundo transparente.\n'+
      'LEMBRETE FINAL DE ORIENTAÇÃO (obrigatório): o capô e os faróis dianteiros OBRIGATORIAMENTE na parte SUPERIOR da imagem; as lanternas traseiras na parte INFERIOR. Nunca inverter o carro.';
    var xhr=new XMLHttpRequest();
    xhr.open('POST','https://funparts-ai-proxy.rodox1209.workers.dev',true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.timeout=120000;
    xhr.onload=function(){
      try{
        var data=JSON.parse(xhr.responseText);
        if(xhr.status>=400){
          reject(new Error((data.error&&data.error.message)||('HTTP '+xhr.status)));return;
        }
        var item=data.data&&data.data[0];
        if(!item){reject(new Error('Resposta vazia'));return;}
        if(item.b64_json)resolve('data:image/png;base64,'+item.b64_json);
        else if(item.url)resolve(item.url);
        else reject(new Error('Formato inesperado'));
      }catch(e){reject(e);}
    };
    xhr.onerror=function(){reject(new Error('Erro de conexão com o servidor'));};
    xhr.ontimeout=function(){reject(new Error('Tempo esgotado. Tente novamente.'));};
    xhr.send(JSON.stringify({
      model:'gpt-image-1',
      prompt:prompt,
      n:1,
      size:'1024x1536',
      quality:'medium',
      background:'transparent',
      output_format:'png'
    }));
  });
}

// Remove background from top-view image using canvas pixel processing
// Works regardless of background color returned by the API (white, gray, etc.)
function removeImageBackground(dataUrl){
  return new Promise(function(resolve){
    var canvas=document.createElement('canvas');
    var ctx=canvas.getContext('2d');
    var img=new Image();
    img.onload=function(){
      canvas.width=img.width;
      canvas.height=img.height;
      ctx.drawImage(img,0,0);
      try{
        var d=ctx.getImageData(0,0,canvas.width,canvas.height);
        var px=d.data;
        var w=canvas.width,h=canvas.height;
        // Sample 8 edge points to determine background color
        var corners=[
          [0,0],[w-1,0],[0,h-1],[w-1,h-1],
          [Math.floor(w/2),0],[0,Math.floor(h/2)],
          [Math.floor(w/2),h-1],[w-1,Math.floor(h/2)]
        ];
        var rs=0,gs=0,bs=0;
        corners.forEach(function(c){
          var i=(c[1]*w+c[0])*4;
          rs+=px[i];gs+=px[i+1];bs+=px[i+2];
        });
        var n=corners.length;
        var bgR=Math.round(rs/n),bgG=Math.round(gs/n),bgB=Math.round(bs/n);
        var tolerance=22;
        var feather=38;
        // ── FLOOD-FILL from edges: only remove background pixels reachable from border ──
        // Conservative tolerance preserves ALL interior areas (glass, windshield, trim)
        var visited=new Uint8Array(w*h);
        var qx=[],qy=[],qi=0;
        function isBg(x,y){
          var i=(y*w+x)*4;
          if(px[i+3]<10)return true;
          var dr=px[i]-bgR,dg=px[i+1]-bgG,db=px[i+2]-bgB;
          return(dr*dr+dg*dg+db*db)<tolerance*tolerance;
        }
        function seed(x,y){if(!visited[y*w+x]&&isBg(x,y)){visited[y*w+x]=1;qx.push(x);qy.push(y);}}
        for(var x=0;x<w;x++){seed(x,0);seed(x,h-1);}
        for(var y=1;y<h-1;y++){seed(0,y);seed(w-1,y);}
        var DX=[0,0,1,-1],DY=[1,-1,0,0];
        while(qi<qx.length){
          var cx=qx[qi],cy=qy[qi];qi++;
          for(var k=0;k<4;k++){var nx=cx+DX[k],ny=cy+DY[k];seed(nx,ny);}
        }
        // Apply transparency only to edge-reachable background pixels
        for(var i=0;i<w*h;i++){
          if(visited[i]){
            var p=i*4;
            var dr=px[p]-bgR,dg=px[p+1]-bgG,db=px[p+2]-bgB;
            var dist=Math.sqrt(dr*dr+dg*dg+db*db);
            if(dist<tolerance){px[p+3]=0;}
            else if(dist<feather){px[p+3]=Math.round(px[p+3]*((dist-tolerance)/(feather-tolerance)));}
          }
        }
        ctx.putImageData(d,0,0);
        // Crop to car bounding box so naturalWidth/naturalHeight = actual car ratio
        var minX=w,maxX=0,minY=h,maxY=0;
        for(var y=0;y<h;y++){for(var x=0;x<w;x++){if(px[(y*w+x)*4+3]>15){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}}}
        if(maxX>minX&&maxY>minY){
          var pad=6;
          minX=Math.max(0,minX-pad);minY=Math.max(0,minY-pad);
          maxX=Math.min(w-1,maxX+pad);maxY=Math.min(h-1,maxY+pad);
          var cw=maxX-minX+1,ch=maxY-minY+1;
          var cc=document.createElement('canvas');cc.width=cw;cc.height=ch;
          cc.getContext('2d').putImageData(ctx.getImageData(minX,minY,cw,ch),0,0);
          // Resize to physical car aspect ratio (width:height = 1900:4500 ≈ 0.422)
          // so naturalWidth/naturalHeight always matches real car proportions
          var targetW=Math.round(ch*(1900/4500));
          var rc=document.createElement('canvas');rc.width=targetW;rc.height=ch;
          rc.getContext('2d').drawImage(cc,0,0,cw,ch,0,0,targetW,ch);
          resolve(rc.toDataURL('image/png'));
        } else {
          resolve(canvas.toDataURL('image/png'));
        }
      }catch(e){
        // Canvas tainted or other error → return original
        resolve(dataUrl);
      }
    };
    img.onerror=function(){resolve(dataUrl);};
    img.src=dataUrl;
  });
}

// Correcao deterministica de orientacao: se a IA gerar o carro invertido, o giro resolve na hora.
function toggleCarFlip(){ S.carFlip=!S.carFlip; applyCarFlip(); }
function applyCarFlip(){
  var el=document.getElementById('detPvCar');
  if(el) el.style.transform=S.carFlip?'rotate(180deg)':'';
  var b=document.getElementById('btnFlipCar');
  if(b) b.style.display=(S.tipo==='mini'&&_detTopViewUrl)?'inline-block':'none';
}

function applyDetCarOverlay(){
  var el=document.getElementById('detPvCar');
  if(!el||!_detTopViewUrl||!S.miniScale||!S.quadroDim){if(el)el.style.display='none';return;}
  var sz=getDetCarSize(S.miniScale,S.quadroDim);
  var quadro=document.querySelector('#livePv .quadro');
  if(!quadro)return;
  var qW=quadro.offsetWidth,qH=quadro.offsetHeight;
  // Use the natural image dimensions to determine display ratio (prevents stretching)
  var natW=el.naturalWidth||1024;
  var natH=el.naturalHeight||1536;
  var carH=qH*sz.hPct;
  var carW=carH*(natW/natH);
  // Place in interior: border ~12% top, ~12% bottom → interior center at 50%
  var top=qH*0.12+(qH*0.76-carH)/2;
  var left=(qW-carW)/2;
  el.style.width=carW+'px';
  el.style.height=carH+'px';
  el.style.left=left+'px';
  el.style.top=top+'px';
  el.style.display='block';
  applyCarFlip();
}

async function triggerDetTopView(){
  if(S.tipo==='lego')return;
  var brand=(document.getElementById('aiCarBrand')||{}).value||(document.getElementById('apenaCarBrand')||{}).value||S.miniBrand||'';
  var model=(document.getElementById('aiCarModel')||{}).value||(document.getElementById('apenaCarModel')||{}).value||S.miniModel||'';
  var year=(document.getElementById('aiCarYear')||{}).value||(document.getElementById('apenaCarYear')||{}).value||'';
  var color=(document.getElementById('aiCarColor')||{}).value||(document.getElementById('apenaCarColor')||{}).value||S.aiCarColor||'';
  brand=brand.trim();model=model.trim();year=year.trim();color=color.trim();
  var carName=[brand,model,year].filter(Boolean).join(' ')||S.aiCarName||'';
  if(!carName||!color)return;
  var key=carName+'|'+color;
  if(_detTopViewKey===key&&_detTopViewUrl){var _cH=document.getElementById('detPvCar');if(_cH){if(_cH.src!==_detTopViewUrl){_cH.onload=function(){applyDetCarOverlay();};_cH.src=_detTopViewUrl;}else{applyDetCarOverlay();}}return;}
  var loader=document.getElementById('detPvCarLoader');
  var el=document.getElementById('detPvCar');
  if(loader)loader.style.display='block';
  if(el)el.style.display='none';
  showAiPopup('Fanático, essa miniatura é sensacional.<br>Já consegue imaginar ela em um quadro?<br>Em instantes iremos demonstrar alguns modelos para que consiga escolher qual irá combinar com o seu ambiente.','Aguarde! Estamos gerando uma nova imagem da vista superior da sua miniatura.');
  try{
    var rawUrl=await generateTopViewPromise(carName,color);
    var url=await removeImageBackground(rawUrl);
    _detTopViewUrl=url;
    _detTopViewKey=key;
    if(el){el.src=url;el.onload=function(){applyDetCarOverlay();};}
    else{applyDetCarOverlay();}
  }catch(e){
    console.warn('[Funparts] top-view:',e.message);
    if(e.message==='sem-key'&&loader){
      loader.innerHTML='<div style="color:rgba(255,200,100,.7);font-size:10px;letter-spacing:.3px;text-align:center;padding:4px;">Adicione sua chave OpenAI<br>via URL: #key=sk-…</div>';
      loader.style.display='block';
      return;
    }
  }finally{
    hideAiPopup();
    if(loader&&loader.style.display!=='none'){loader.innerHTML='<div style="color:rgba(255,255,255,.45);font-size:11px;letter-spacing:.5px;animation:aiPulse 2s ease infinite;">Gerando top-view…</div>';loader.style.display='none';}
  }
}

function _legoLegacyRatio(dim){
  // Compute CSS aspect-ratio from LEGO dim strings like "53×83cm"
  if(!dim) return '';
  var sep=dim.indexOf('×')>=0?'×':'x';
  var parts=dim.replace('cm','').replace(',','.').split(sep);
  if(parts.length===2) return parts[0].trim()+'/'+parts[1].trim();
  return '';
}
function updateDetPreview(){
  // ── LEGO branch: no car overlay, use legoDim for aspect-ratio ──
  if(S.tipo==='lego'){
    var pvMod=document.getElementById('pvMod');
    if(pvMod) pvMod.textContent=S.legoModel||S.legoBrand||'LEGO';
    var pvSpec=document.getElementById('pvSpecDesc');
    if(pvSpec) pvSpec.textContent=S.legoDim||'';
    var _quadro=document.querySelector('#livePv .quadro');
    if(_quadro&&S.legoDim){
      var ratio=_legoLegacyRatio(S.legoDim);
      if(ratio){_quadro.style.aspectRatio=ratio;_quadro.style.overflow='hidden';}
    }
    // === LEGO preview: update legoPreviewWrap elements ===
    // Fundo gradient
    updateDetPvFundo();
    // Moldura frame - use Drive CDN based on selected moldura
    var _LEGO_FRAMES={'fibra':'https://lh3.googleusercontent.com/d/1l-7-oVLTWJ2-9owSFXGSbCncvSGvjuzP','laca':'https://lh3.googleusercontent.com/d/1MAnDITKvxgmlQuMKTTofzdl-7UvIhmLq'};
    var ldfr=document.getElementById('legoDetFrame');
    if(ldfr){
      var _fk=(S.moldura==='m-fibra')?'fibra':'laca';
      ldfr.src=_LEGO_FRAMES[_fk];
      ldfr.style.display='block';
    }
    // Car image - LEGO SF24 on top of background
    var lcar=document.getElementById('legoDetCar');
    if(lcar){
      lcar.src='https://lh3.googleusercontent.com/d/1e50Ft2Ixks4Rh0jOTcBfnhMCa9GSrh95';
      lcar.style.display='block';
    }
    // Quadro aspect-ratio
    var ldq=document.getElementById('legoDetQuadro');
    if(ldq&&S.legoDim){
      var _lr=_legoLegacyRatio(S.legoDim);
      if(_lr){ldq.style.aspectRatio=_lr;}
    }
    // Scale reference image (lazy-load from wallModal)
    var lsi=document.getElementById('legoScaleImg');
    if(lsi&&!lsi.getAttribute('data-loaded')){
      var wImg=document.querySelector('#wallModal img');
      if(wImg&&wImg.src){lsi.src=wImg.src;lsi.setAttribute('data-loaded','1');}
    }
    var msi=document.getElementById('miniScaleImg');
    if(msi&&!msi.getAttribute('data-loaded')){
      var wImg2=document.querySelector('#wallModal img');
      if(wImg2&&wImg2.src){msi.src=wImg2.src;msi.setAttribute('data-loaded','1');}
    }
    // Model info labels
    var lm=document.getElementById('legoPvMod');
    if(lm) lm.textContent=(S.legoModel||'').toUpperCase();
    var ldim=document.getElementById('legoPvDim');
    if(ldim) ldim.textContent=S.legoDim||'';
    var lf=document.getElementById('legoPvFundo');
    if(lf){var fa=document.getElementById('fAtual');if(fa)lf.textContent=fa.textContent.trim();}
    var lmat=document.getElementById('legoPvMaterial');
    if(lmat){var fa2=document.getElementById('fAtual');if(fa2)lmat.textContent=fa2.textContent.trim();}
    // detPvFundo/Frame not used in LEGO wrap (keep hidden)
    var _dpc=document.getElementById('detPvCar');
    if(_dpc) _dpc.style.display='none';
    var _dpcl=document.getElementById('detPvCarLoader');
    if(_dpcl) _dpcl.style.display='none';
    return;
  }
  // ── MINI branch ──
  // ── car name from form fields ──
  var brand=(document.getElementById('aiCarBrand')||{}).value||'';
  var model=(document.getElementById('aiCarModel')||{}).value||'';
  var year =(document.getElementById('aiCarYear') ||{}).value||'';
  var color=(document.getElementById('aiCarColor')||{}).value||'';
  brand=brand.trim(); model=model.trim(); year=year.trim(); color=color.trim();
  var carName=[brand,model,year].filter(Boolean).join(' ')||'Seu Carro';

  // ── descrição: Marca / Nome do carro / Cor (3 linhas, ao vivo) ──
  updateCarDesc();

  // ── update frame appearance & preview image ──
  // Apply aspect-ratio directly to .quadro (no .frame-out in DOM)
  var _quadro=document.querySelector('#livePv .quadro');
  if(_quadro && S.quadroDim){
    var ds=DIM_STYLE[S.quadroDim];
    if(ds){
      _quadro.style.aspectRatio=ds.ratio;
      _quadro.style.overflow='hidden';
    }
  }
  // show frame preview image: dimensão + moldura específica para mini
  var dpf=document.getElementById('detPvFrame');
  if(dpf){
    var _mkDpf=(S.moldura==='m-fibra')?'fibra':'laca';
    var _dimDpf=(typeof MINI_MOLDURA_IMAGES!=='undefined')&&MINI_MOLDURA_IMAGES[S.quadroDim];
    var _srcDpf=(_dimDpf&&_dimDpf[_mkDpf])||DIM_IMAGES[S.quadroDim];
    if(_srcDpf){dpf.src=_srcDpf;dpf.style.display='block';}
    else{dpf.style.display='none';}
  }
  // update fundo background element
  var _pvFundo=document.getElementById('detPvFundo');
  if(_pvFundo){
    updateDetPvFundo();
    _pvFundo.style.display='block';
  }
}

function initDetalhamento(){
  var isLego=S.tipo==='lego';
  // show/hide tipo-specific sections
  var legoSec=document.getElementById('legoDetSection');
  var miniSec=document.getElementById('miniDetSection');
  if(legoSec) legoSec.style.display=isLego?'block':'none';
  if(miniSec) miniSec.style.display=isLego?'none':'block';
  if(isLego){
    // populate LEGO info card
    var elMod=document.getElementById('legoDetModel');
    if(elMod) elMod.textContent=S.legoModel||'Set não selecionado';
    var elBrand=document.getElementById('legoDetBrand');
    if(elBrand) elBrand.textContent=S.legoBrand||'';
    var elDim=document.getElementById('legoDetDim');
    if(elDim) elDim.textContent=S.legoDim||'53×83cm';
    updateDetPreview();
    return;
  }
  // MINI flow
  if(!S.miniScale) S.miniScale='1:43';
  document.querySelectorAll('#scaleCards .ocard').forEach(function(c){
    var sc=c.getAttribute('data-scale');
    c.classList.toggle('sel',sc===S.miniScale);
    var chk=c.querySelector('.ochk');
    if(chk)chk.textContent=(sc===S.miniScale)?'✓':'';
  });
  renderFrameCards();
  updateMiniRefImg();
  updateDetPreview();
}

function selMiniScale(el,scale){
  document.querySelectorAll('#scaleCards .ocard').forEach(function(c){
    c.classList.remove('sel');
    var chk=c.querySelector('.ochk');if(chk)chk.textContent='';
  });
  el.classList.add('sel');
  var chk=el.querySelector('.ochk');if(chk)chk.textContent='✓';
  S.miniScale=scale;
  renderFrameCards();
  updateDetPreview();
  var _dpf=document.getElementById('detPvFrame');if(_dpf)_dpf.style.objectFit='fill';
  applyDetCarOverlay();
  calcPrice();
  updateMiniRefImg();
}

function renderFrameCards(){
  var fc=document.getElementById('frameCards');
  if(!fc)return;
  var frames=SCALE_FRAMES[S.miniScale]||[];
  if(!S.quadroDim||!frames.includes(S.quadroDim)) S.quadroDim=frames[0]||'';
  fc.innerHTML='';
  frames.forEach(function(dim){
    var d=document.createElement('div');
    d.className='ocard'+(dim===S.quadroDim?' sel':'');
    d.innerHTML='<div class="ochk">'+(dim===S.quadroDim?'✓':'')+'</div>'
      +'<div class="oname" style="font-size:16px;font-weight:700;margin:6px 0 4px;">'+dim+'</div>';
    d.onclick=function(){selFrameSize(d,dim);};
    fc.appendChild(d);
  });
}

function selFrameSize(el,dim){
  document.querySelectorAll('#frameCards .ocard').forEach(function(c){
    c.classList.remove('sel');var chk=c.querySelector('.ochk');if(chk)chk.textContent='';
  });
  el.classList.add('sel');
  var chk=el.querySelector('.ochk');if(chk)chk.textContent='✓';
  S.quadroDim=dim;
  updateDetPreview();
  applyDetCarOverlay();
  calcPrice();
  updateMiniRefImg();
}

// ── STEP 5: MOLDURA ──
function selMoldura(card,cls,lbl){
  document.querySelectorAll('#step-5 .ocard').forEach(c=>{c.classList.remove('sel');c.querySelector('.ochk').textContent='';});
  card.classList.add('sel');card.querySelector('.ochk').textContent='✓';
  S.moldura=cls;S.molduraLbl=lbl;
  const molduraKey={'m-fibra':'fibra','m-laca':'laca'};
  const iMold=document.getElementById('iMoldura');
  if(iMold){
    const _mk=molduraKey[cls];
    if(S.tipo==='mini'){
      // Miniatura: #detPvFrame é o elemento visível no step 5 (iMoldura fica visibility:hidden)
      const _mmi=(typeof MINI_MOLDURA_IMAGES!=='undefined')&&MINI_MOLDURA_IMAGES[S.quadroDim];
      const _dpf=document.getElementById('detPvFrame');
      if(_dpf&&_mmi&&_mmi[_mk]){_dpf.src=_mmi[_mk];_dpf.style.display='block';}
    } else {
      const _mm=MODEL_MOLDURA_IMAGES[S.legoModel];
      iMold.src=(_mm&&_mm[_mk])||(typeof M!=='undefined'&&_mk&&M[_mk])||iMold.src;
    }
  }
  setEl('pvMold',lbl);
  updateDetPreview();
  calcPrice();
}

function togLED(){
  S.led=!S.led;
  if(S.led){ S.ledFio='com'; S.ledTipo='warm'; var _fc=document.getElementById('ledFioCom'),_fs=document.getElementById('ledFioSem'); if(_fc)_fc.classList.add('sel'); if(_fs)_fs.classList.remove('sel'); var _cw=document.getElementById('ledCardWarm'),_cr=document.getElementById('ledCardRgb'); if(_cw){_cw.classList.add('on');} if(_cr){_cr.classList.remove('on');} }
  document.getElementById('ledToggle').classList.toggle('sel',S.led);
  setEl('ledPill',S.led?'Com LED ✨':'Sem LED');
  // Mostrar/ocultar seletor de tipo LED
  const ledTypesEl=document.getElementById('ledTypes');
  if(ledTypesEl) ledTypesEl.style.display=S.led?'block':'none';
  // Atualizar preview (livePv + legoDetQuadro)
  const _applyLed=function(glowId,darkId){
    const glow=document.getElementById(glowId);
    const dark=document.getElementById(darkId);
    if(glow){
      if(S.led){
        const t=S.ledTipo||'warm';
        glow.className='led-glow '+(t==='rgb'?'cold':t);
        if(dark) dark.className='led-dark active';
      } else {
        glow.className='led-glow';
        if(dark) dark.className='led-dark';
      }
    }
  };
  _applyLed('ledGlow','ledDark');
  _applyLed('legoLedGlow','legoLedDark');
  calcPrice();
}

// ── STEP 5: FUNDO ──
const IMG_FUNDO = {
  'fibra-carbono':     {thumb:'https://lh3.googleusercontent.com/d/180eU2lPrL_faVZx7Zxld9S8vNfjNh9fg', preview:'https://lh3.googleusercontent.com/d/180eU2lPrL_faVZx7Zxld9S8vNfjNh9fg'},
  'bicolor-fibra-uv':  {thumb:'https://lh3.googleusercontent.com/d/1W1P3gYF1NvhMI5vIgIVyEjFVFV_63vEM', preview:'https://lh3.googleusercontent.com/d/1W1P3gYF1NvhMI5vIgIVyEjFVFV_63vEM'},
  'bicolor-brilho':    {thumb:'https://lh3.googleusercontent.com/d/1oDg48Qoev0YluqczYT-vD933Xsh7dXz5', preview:'https://lh3.googleusercontent.com/d/1oDg48Qoev0YluqczYT-vD933Xsh7dXz5'},
  'listras-brilho':    {thumb:'https://lh3.googleusercontent.com/d/16K-JcLjn9N3bIFPGAr2bN3ApbDQLilEC', preview:'https://lh3.googleusercontent.com/d/16K-JcLjn9N3bIFPGAr2bN3ApbDQLilEC'},
  'listras-lat-brilho':{thumb:'https://lh3.googleusercontent.com/d/1pcaDa8IrlLvQV4_PKHibSxSDt369yBs1', preview:'https://lh3.googleusercontent.com/d/1pcaDa8IrlLvQV4_PKHibSxSDt369yBs1'},
  'degradê-brilho':   {thumb:'https://lh3.googleusercontent.com/d/16w20v9vYp1gNmaTaE2rZTKY4xdD6SHVo', preview:'https://lh3.googleusercontent.com/d/16w20v9vYp1gNmaTaE2rZTKY4xdD6SHVo'},
  'bicolor-fosco':     {thumb:'https://lh3.googleusercontent.com/d/1dnIWj1KR2HaI7a03gln_DYRnp3a7Hz7Y', preview:'https://lh3.googleusercontent.com/d/1dnIWj1KR2HaI7a03gln_DYRnp3a7Hz7Y'},
  'listras-cent-fosco':{thumb:'https://lh3.googleusercontent.com/d/1E8-L1nkTe-MWYkbxWepmw_YBDfZNJYdf', preview:'https://lh3.googleusercontent.com/d/1E8-L1nkTe-MWYkbxWepmw_YBDfZNJYdf'},
  'listra-lat-fosco':  {thumb:'https://lh3.googleusercontent.com/d/1NDNeY-KiUQpn1nk4dEY2BFcsJvLDovMb', preview:'https://lh3.googleusercontent.com/d/1NDNeY-KiUQpn1nk4dEY2BFcsJvLDovMb'},
  'degradê-fosco':    {thumb:'https://lh3.googleusercontent.com/d/14F-XmnGxf62jY3mXlbYIWNNPNYz90ojO', preview:'https://lh3.googleusercontent.com/d/14F-XmnGxf62jY3mXlbYIWNNPNYz90ojO'},
};
const LEGO_FUNDO_LAYOUTS = {
  'f-carbono': [
    {name:'Fibra de Carbono', img:'https://lh3.googleusercontent.com/d/180eU2lPrL_faVZx7Zxld9S8vNfjNh9fg', preview:'https://lh3.googleusercontent.com/d/180eU2lPrL_faVZx7Zxld9S8vNfjNh9fg'},
  ],
  'f-uv': [
    {name:'Bicolor',          img:'https://lh3.googleusercontent.com/d/1oDg48Qoev0YluqczYT-vD933Xsh7dXz5', preview:'https://lh3.googleusercontent.com/d/1oDg48Qoev0YluqczYT-vD933Xsh7dXz5'},
    {name:'Degradê',          img:'https://lh3.googleusercontent.com/d/16w20v9vYp1gNmaTaE2rZTKY4xdD6SHVo', preview:'https://lh3.googleusercontent.com/d/16w20v9vYp1gNmaTaE2rZTKY4xdD6SHVo'},
    {name:'Listras Centrais', img:'https://lh3.googleusercontent.com/d/1AHeLsA7308V4u3ebwRSgGVBYPKq1WDFY', preview:'https://lh3.googleusercontent.com/d/1AHeLsA7308V4u3ebwRSgGVBYPKq1WDFY'},
    {name:'Listras Laterais', img:'https://lh3.googleusercontent.com/d/1pcaDa8IrlLvQV4_PKHibSxSDt369yBs1', preview:'https://lh3.googleusercontent.com/d/1pcaDa8IrlLvQV4_PKHibSxSDt369yBs1'},
  ],
  'f-fosco': [
    {name:'Bicolor',          img:'https://lh3.googleusercontent.com/d/1dnIWj1KR2HaI7a03gln_DYRnp3a7Hz7Y', preview:'https://lh3.googleusercontent.com/d/1dnIWj1KR2HaI7a03gln_DYRnp3a7Hz7Y'},
    {name:'Degradê',          img:'https://lh3.googleusercontent.com/d/14F-XmnGxf62jY3mXlbYIWNNPNYz90ojO', preview:'https://lh3.googleusercontent.com/d/14F-XmnGxf62jY3mXlbYIWNNPNYz90ojO'},
    {name:'Listras Centrais', img:'https://lh3.googleusercontent.com/d/1E8-L1nkTe-MWYkbxWepmw_YBDfZNJYdf', preview:'https://lh3.googleusercontent.com/d/1E8-L1nkTe-MWYkbxWepmw_YBDfZNJYdf'},
    {name:'Listras Laterais', img:'https://lh3.googleusercontent.com/d/1NDNeY-KiUQpn1nk4dEY2BFcsJvLDovMb', preview:'https://lh3.googleusercontent.com/d/1NDNeY-KiUQpn1nk4dEY2BFcsJvLDovMb'},
  ],
};
const FUNDO_LAYOUTS = {
  'f-carbono': [
    {name:'Vinil Fibra de Carbono', img:IMG_FUNDO['fibra-carbono'].thumb, preview:IMG_FUNDO['fibra-carbono'].preview},
  ],
  'f-uv': [
    {name:'Bicolor', img:IMG_FUNDO['bicolor-brilho'].thumb, preview:IMG_FUNDO['bicolor-brilho'].preview},
    {name:'Listras Centrais', img:IMG_FUNDO['listras-brilho'].thumb, preview:IMG_FUNDO['listras-brilho'].preview},
    {name:'Listras Laterais', img:IMG_FUNDO['listras-lat-brilho'].thumb, preview:IMG_FUNDO['listras-lat-brilho'].preview},
    {name:'Degradê', img:IMG_FUNDO['degradê-brilho'].thumb, preview:IMG_FUNDO['degradê-brilho'].preview},
  ],
  'f-fosco': [
    {name:'Bicolor', img:IMG_FUNDO['bicolor-fosco'].thumb, preview:IMG_FUNDO['bicolor-fosco'].preview},
    {name:'Listras Centrais', img:IMG_FUNDO['listras-cent-fosco'].thumb, preview:IMG_FUNDO['listras-cent-fosco'].preview},
    {name:'Listras Laterais', img:IMG_FUNDO['listra-lat-fosco'].thumb, preview:IMG_FUNDO['listra-lat-fosco'].preview},
    {name:'Degradê', img:IMG_FUNDO['degradê-fosco'].thumb, preview:IMG_FUNDO['degradê-fosco'].preview},
  ],
};


var MODEL_FUNDO_LAYOUTS={
  'McLaren MP4/4 Senna':{
    'f-carbono':[{name:'Vinil Fibra de Carbono',img:'images/img_049.webp',preview:'images/img_050.jpg'}],
    'f-uv':[{name:'Modelo 01',img:'images/img_051.webp',preview:'images/img_052.jpg'}],
    'f-fosco':[{name:'Modelo 01',img:'images/img_053.webp',preview:'images/img_054.jpg'}],
  },
};
function _imgSrc(s){
  if(!s)return '';
  if(s.startsWith('data:')||s.startsWith('http'))return s;
  return 'data:image/jpeg;base64,'+s;
}
function renderFundoLayouts(fundo){
  const _mfl=typeof MODEL_FUNDO_LAYOUTS!=='undefined'&&MODEL_FUNDO_LAYOUTS[S.legoModel];
  const _lfl=(S.tipo==='lego')&&typeof LEGO_FUNDO_LAYOUTS!=='undefined'&&LEGO_FUNDO_LAYOUTS[fundo];
  const opts = (_mfl&&_mfl[fundo]) || _lfl || FUNDO_LAYOUTS[fundo] || [];
  const el = document.getElementById('fundoLayoutOpts');
  if(!el) return;
  el.innerHTML = '';
  opts.forEach((layout, i) => {
    const div = document.createElement('div');
    div.className = 'layout-row' + (i===0?' sel':'');
    div.innerHTML = '<img src="'+_imgSrc(layout.img)+'" class="layout-thumb"><span class="layout-name">'+layout.name+'</span>';
    div.onclick = function(){
      document.querySelectorAll('#fundoLayoutOpts .layout-row').forEach(r=>r.classList.remove('sel'));
      div.classList.add('sel');
      S.fundoLayout = layout.name;
      S.fundoLayoutPreview = layout.preview;
      setEl('fAtual', layout.name);
      var _lpvm=document.getElementById('legoPvMaterial');
      if(_lpvm) _lpvm.textContent=layout.name;
      var _lpvf=document.getElementById('legoPvFundo');
      if(_lpvf) _lpvf.textContent=layout.name;
      const iFund = document.getElementById('iFundo');
      if(iFund) iFund.src = _imgSrc(layout.preview);
      updateDetPvFundo();
    };
    el.appendChild(div);
  });
  if(opts[0]){
    S.fundoLayout = opts[0].name || '';
    S.fundoLayoutPreview = opts[0].preview || '';
    setEl('fAtual', opts[0].name || '');
    var _lpvm0=document.getElementById('legoPvMaterial');
    if(_lpvm0) _lpvm0.textContent=opts[0].name||'';
    var _lpvf0=document.getElementById('legoPvFundo');
    if(_lpvf0) _lpvf0.textContent=opts[0].name||'';
    const iFund = document.getElementById('iFundo');
    if(iFund && opts[0].preview) iFund.src = _imgSrc(opts[0].preview);
  }
}


var MODEL_FUNDO_IMAGES={
  'McLaren MP4/4 Senna':{
    fibra:'images/img_055.jpg',
    brilho:'images/img_052.jpg',
    fosco:'images/img_054.jpg',
  },
};

var MODEL_MOLDURA_IMAGES={
  'McLaren MP4/4 Senna':{
    fibra:'images/img_056.webp',
    laca:'images/img_057.webp',
  },
};
var UV_PALETTE=[
  {color:'#FF2200',name:'Vermelho Ferrari'},
  {color:'#FF6600',name:'Laranja McLaren'},
  {color:'#FFD700',name:'Amarelo'},
  {color:'#00CC55',name:'Verde Lamborghini'},
  {color:'#0066FF',name:'Azul Cobalto'},
  {color:'#00CCFF',name:'Azul Turbo'},
  {color:'#9900CC',name:'Roxo'},
  {color:'#FF0099',name:'Rosa Neon'},
  {color:'#FFFFFF',name:'Branco Pérola'},
  {color:'#C0C0C0',name:'Prata Metálico'},
];

function renderUvColorPalette(){
  var el=document.getElementById('fundoLayoutOpts');
  if(!el)return;
  el.innerHTML='';
  var label=document.createElement('div');
  label.className='sec-sub';
  label.style.cssText='font-size:9px;letter-spacing:1.2px;margin-bottom:10px;';
  label.textContent='Cor do Degradê Central';
  el.appendChild(label);
  var grid=document.createElement('div');
  grid.style.cssText='display:grid;grid-template-columns:repeat(5,1fr);gap:8px;padding:4px 0;';
  UV_PALETTE.forEach(function(c){
    var s=document.createElement('div');
    s.className='uv-swatch'+(S.uvColor===c.color?' sel':'');
    s.title=c.name;
    s.style.cssText='width:100%;aspect-ratio:1/1;border-radius:50%;background:'+c.color+';cursor:pointer;box-sizing:border-box;'+(S.uvColor===c.color?'outline:2px solid #fff;outline-offset:3px;':'');
    s.onclick=function(){
      document.querySelectorAll('.uv-swatch').forEach(function(sw){sw.classList.remove('sel');sw.style.outline='';});
      s.classList.add('sel');s.style.outline='2px solid #fff';s.style.outlineOffset='3px';
      S.uvColor=c.color;
      updateDetPvFundo();
    };
    grid.appendChild(s);
  });
  el.appendChild(grid);
  if(!S.uvColor)S.uvColor=UV_PALETTE[0].color;
  updateDetPvFundo();
}

function hexToRgb(hex){
  var r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return {r:r,g:g,b:b};
}
function _renderMiniPickerSection(con,stateKey,defaultColor,label,swatchId){
  var lbl=document.createElement('div');
  lbl.className='sec-sub';
  lbl.style.cssText='margin-bottom:8px;margin-top:4px;';
  lbl.textContent=label;
  con.appendChild(lbl);
  var row=document.createElement('div');
  row.style.cssText='display:flex;gap:8px;align-items:center;margin-bottom:14px;';
  var sw=document.createElement('div');
  sw.id=swatchId;
  var col=S[stateKey]||defaultColor;
  sw.style.cssText='width:26px;height:26px;border-radius:50%;background:'+col+';border:2px solid rgba(255,255,255,0.25);cursor:pointer;flex-shrink:0;';
  var cb=function(c){S[stateKey]=c;var el2=document.getElementById(swatchId);if(el2)el2.style.background=c;updateDetPvFundo();};
  sw.onclick=function(){openColorPicker(S[stateKey]||defaultColor,cb,sw);};
  var btn=document.createElement('button');
  btn.textContent='Escolher cor';
  btn.style.cssText='background:transparent;border:1px solid rgba(255,255,255,0.18);color:#888;padding:3px 8px;border-radius:4px;font-size:9px;letter-spacing:0.8px;cursor:pointer;text-transform:uppercase;';
  btn.onclick=function(){openColorPicker(S[stateKey]||defaultColor,cb,btn);};
  row.appendChild(sw);row.appendChild(btn);con.appendChild(row);
}
function renderUvMiniOptions(){
  if(!S.uvLayoutType)S.uvLayoutType='deg';
  var el=document.getElementById('fundoLayoutOpts');
  if(!el)return;
  el.innerHTML='';
  var tabs=[{k:'deg',l:'Degradê Central'},{k:'stripe',l:'Listra Central'},{k:'diagonal',l:'Diagonal Sport'},{k:'faixa',l:'Faixa Deslocada'},{k:'meio',l:'Meio a Meio'},{k:'img',l:'Sua Imagem'}];
  var tabsDiv=document.createElement('div');
  tabsDiv.style.cssText='display:flex;flex-direction:column;gap:6px;margin-bottom:14px;';
  tabs.forEach(function(t){
    var b=document.createElement('button');
    var active=S.uvLayoutType===t.k;
    b.textContent=t.l;b.setAttribute('data-uvtab',t.k);
    b.style.cssText='padding:9px 14px;font-family:Barlow Condensed,sans-serif;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border-radius:6px;cursor:pointer;text-align:left;border:1px solid '+(active?'#e07b00':'rgba(255,255,255,0.12)')+';background:'+(active?'#e07b00':'rgba(255,255,255,0.05)')+';color:'+(active?'#fff':'rgba(255,255,255,0.4)')+';transition:all 0.2s';
    b.onclick=function(){selUvLayout(t.k);};
    tabsDiv.appendChild(b);
  });
  el.appendChild(tabsDiv);
  var degDiv=document.createElement('div');
  degDiv.id='uvDegPanel';degDiv.style.display=S.uvLayoutType==='deg'?'':'none';_renderMiniPickerSection(degDiv,'uvColor','#FF2200','Cor do Degradê Central','cpSwatch_uvDeg');
  el.appendChild(degDiv);
  var swHtml=function(fn,cls){
    var h='<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:4px">';
    UV_PALETTE.forEach(function(c){h+='<div class="uv-swatch '+cls+'" data-color="'+c.color+'" title="'+c.name+'" onclick="'+fn+'(this,this.dataset.color)" style="aspect-ratio:1/1;border-radius:50%;background:'+c.color+';cursor:pointer;border:2px solid transparent;box-sizing:border-box"></div>';});
    return h+'</div>';
  };
  var strDiv=document.createElement('div');
  strDiv.id='uvStripePanel';strDiv.style.display=(['stripe','diagonal','faixa','meio'].indexOf(S.uvLayoutType)>=0)?'block':'none';
  _renderMiniPickerSection(strDiv,'uvStripeMain','#FF2200','Cor Principal','cpSwatch_uvMain');
  _renderMiniPickerSection(strDiv,'uvStripeAccent','#0066FF','Cor de Destaque','cpSwatch_uvAccent');
  el.appendChild(strDiv);
  var imgDiv=document.createElement('div');
  imgDiv.id='uvImgPanel';imgDiv.style.display=S.uvLayoutType==='img'?'flex':'none';imgDiv.style.flexDirection='column';imgDiv.style.alignItems='center';
  var btn=document.createElement('button');
  btn.className='btn-wall-example';btn.style.cssText='width:100%;margin:12px 0;font-size:9px;letter-spacing:0.8px;padding:12px;';
  btn.textContent='ENVIE A IMAGEM DA SUA PREFERÊNCIA';
  btn.onclick=function(){document.getElementById('uvFileIn').click();};
  var fi=document.createElement('input');
  fi.type='file';fi.id='uvFileIn';fi.accept='image/*';fi.style.display='none';
  fi.onchange=function(e){handleUvImageUpload(e);};
  imgDiv.appendChild(btn);imgDiv.appendChild(fi);
  if(S.uvImageDataUrl){var pi=document.createElement('img');pi.style.cssText='width:100%;border-radius:8px;margin-top:8px;';pi.src=S.uvImageDataUrl;imgDiv.appendChild(pi);}
  el.appendChild(imgDiv);
}
function selUvLayout(type){
  S.uvLayoutType=type;
  document.querySelectorAll('[data-uvtab]').forEach(function(b){
    var a=b.getAttribute('data-uvtab')===type;
    b.style.background=a?'#e07b00':'rgba(255,255,255,0.05)';
    b.style.color=a?'#fff':'rgba(255,255,255,0.4)';
    b.style.borderColor=a?'#e07b00':'rgba(255,255,255,0.12)';
  });
  var _fam=['stripe','diagonal','faixa','meio'];
  var dp=document.getElementById('uvDegPanel');if(dp)dp.style.display=type==='deg'?'block':'none';
  var sp=document.getElementById('uvStripePanel');if(sp)sp.style.display=_fam.indexOf(type)>=0?'block':'none';
  var ip=document.getElementById('uvImgPanel');if(ip)ip.style.display=type==='img'?'flex':'none';
  var _lbls={deg:'Degradê Central',stripe:'Listra Central',diagonal:'Diagonal Sport',faixa:'Faixa Deslocada',meio:'Meio a Meio',img:'Sua Imagem'};
  if(_lbls[type]&&typeof setEl==='function')setEl('fAtual',_lbls[type]);
  updateDetPvFundo();
}
function selUvStripeMain(el,hex){
  document.querySelectorAll('.uv-swatch-main').forEach(function(s){s.style.borderColor='transparent';});
  el.style.borderColor='#e07b00';S.uvStripeMain=hex;updateDetPvFundo();
}
function selUvStripeAccent(el,hex){
  document.querySelectorAll('.uv-swatch-accent').forEach(function(s){s.style.borderColor='transparent';});
  el.style.borderColor='#e07b00';S.uvStripeAccent=hex;updateDetPvFundo();
}
function handleUvImageUpload(e){
  var f=e.target.files[0];if(!f)return;
  var reader=new FileReader();
  reader.onload=function(ev){
    S.uvImageDataUrl=ev.target.result;
    var panel=document.getElementById('uvImgPanel');
    if(panel){var old=panel.querySelector('img');if(old)old.remove();var img=document.createElement('img');img.style.cssText='width:100%;border-radius:8px;margin-top:8px;';img.src=ev.target.result;panel.appendChild(img);}
    updateDetPvFundo();
  };
  reader.readAsDataURL(f);
}
function updateDetPvFundo(){
  ['detPvFundo','legoDetFundo'].forEach(function(elId){
    var el=document.getElementById(elId);
    if(!el)return;
    el.style.boxShadow='';
    // LEGO: use selected layout preview as background
    if(elId==='legoDetFundo'&&S.fundoLayoutPreview){
      el.style.background='';
      el.style.backgroundImage='url('+_imgSrc(S.fundoLayoutPreview)+')';
      el.style.backgroundSize='cover';
      el.style.backgroundPosition='center';
      el.style.display='block';
      return;
    }
    if(S.fundo==='f-uv'&&S.tipo==='mini'&&['stripe','diagonal','faixa','meio'].indexOf(S.uvLayoutType)>=0){
      var _m=S.uvStripeMain||'#FF2200',_a=S.uvStripeAccent||'#FFFFFF';
      el.style.background='';el.style.backgroundSize='100% 100%';el.style.backgroundPosition='center';
      if(S.uvLayoutType==='stripe'){el.style.backgroundImage='linear-gradient(to right,'+_m+' 0%,'+_m+' 42%,'+_a+' 42%,'+_a+' 58%,'+_m+' 58%,'+_m+' 100%)';}
      else if(S.uvLayoutType==='diagonal'){el.style.backgroundImage='linear-gradient(125deg,'+_m+' 0%,'+_m+' 50%,'+_a+' 50%,'+_a+' 100%)';}
      else if(S.uvLayoutType==='faixa'){el.style.backgroundImage='linear-gradient(to right,'+_m+' 0%,'+_m+' 20%,'+_a+' 20%,'+_a+' 32%,'+_m+' 32%,'+_m+' 100%)';}
      else if(S.uvLayoutType==='meio'){el.style.backgroundImage='linear-gradient(to right,'+_m+' 0%,'+_m+' 50%,'+_a+' 50%,'+_a+' 100%)';}
      el.style.display='block';return;
    }
    if(S.fundo==='f-uv'&&S.tipo==='mini'&&S.uvLayoutType==='img'){if(S.uvImageDataUrl){el.style.backgroundImage='url('+S.uvImageDataUrl+')';el.style.backgroundSize='cover';el.style.backgroundPosition='center';el.style.display='block';}return;}
    if(S.fundo==='f-uv'&&S.uvColor){
      var rgb=hexToRgb(S.uvColor);
      var r=rgb.r,g=rgb.g,b=rgb.b;
      el.style.backgroundImage='none';
      el.style.background='radial-gradient(ellipse 110% 110% at center, '+
        'rgba('+r+','+g+','+b+',1) 0%, '+
        'rgba('+r+','+g+','+b+',1) 28%, '+
        'rgba('+r+','+g+','+b+',0.85) 42%, '+
        'rgba('+r+','+g+','+b+',0.55) 56%, '+
        'rgba('+r+','+g+','+b+',0.2) 68%, '+
        'rgba(0,0,0,0.6) 78%, #000 88%, #000 100%)';
    } else {
      var fb=(typeof FUNDO_IMAGES!=='undefined'&&S.quadroDim&&FUNDO_IMAGES[S.quadroDim])||FIBRA_B64;
      el.style.background='';
      el.style.backgroundImage='url('+fb+')';
      el.style.backgroundSize='cover';
      el.style.backgroundPosition='center';
    }
    el.style.display='block';
  });
}

// Mini: o menu "Modelo do Layout" so faz sentido no Acrilico UV (a Fibra nao aceita layout)
function updateFundoLayoutsVisibility(){
  var el=document.getElementById('fundoLayouts');
  if(!el)return;
  var mostra=(S.tipo!=='mini')||(S.fundo==='f-uv');
  el.style.display=mostra?'':'none';
}

function selFundo(card,cls,lbl){
  document.querySelectorAll('#step-4 .ocard').forEach(c=>{c.classList.remove('sel');c.querySelector('.ochk').textContent='';});
  card.classList.add('sel');card.querySelector('.ochk').textContent='✓';
  S.fundo=cls;S.fundoLbl=lbl;
  const fundoKey={'f-carbono':'fibra','f-uv':'brilho','f-fosco':'fosco'};
  const iFund=document.getElementById('iFundo');
  if(iFund){
    const _mf=MODEL_FUNDO_IMAGES[S.legoModel];
    const _fk=fundoKey[cls];
    iFund.src=(_mf&&_mf[_fk])||(typeof F!=='undefined'&&_fk&&F[_fk])||iFund.src;
  }
  if(cls==='f-uv'){if(S.tipo==='lego'){renderFundoLayouts(cls);}else{renderUvMiniOptions();}}else{if(S.tipo!=='mini'){renderFundoLayouts(cls);}}
  updateFundoLayoutsVisibility();
  updateDetPvFundo();
  calcPrice();
}

// ── Biblioteca de logos reais por marca (Mini) — chave normalizada (minusculas, sem espacos/pontuacao) ──
// build: logos v2 (31 marcas) + IA de reserva corrigida
// Chave = nome EXATO da marca no dropdown. w = largura calibrada pela proporcao do logo.
var BRAND_LOGOS={
 'Fórmula 1':{src:'images/logo_formula1.png',w:'23.0%'},
 'Ferrari':{src:'images/logo_ferrari.png',w:'13.5%'},
 'Porsche':{src:'images/logo_porsche.png',w:'13.4%'},
 'Lamborghini':{src:'images/logo_lamborghini.png',w:'16.1%'},
 'McLaren':{src:'images/logo_mclaren.png',w:'24.0%'},
 'Mercedes-Benz':{src:'images/logo_mercedes.png',w:'14.9%'},
 'BMW':{src:'images/logo_bmw.png',w:'15.1%'},
 'Audi':{src:'images/logo_audi.png',w:'24.0%'},
 'Aston Martin':{src:'images/logo_astonmartin.png',w:'24.0%'},
 'Bugatti':{src:'images/logo_bugatti.png',w:'20.3%'},
 'Nissan':{src:'images/logo_nissan.png',w:'16.5%'},
 'Toyota':{src:'images/logo_toyota.png',w:'18.0%'},
 'Ford':{src:'images/logo_ford.png',w:'22.8%'},
 'Chevrolet':{src:'images/logo_chevrolet.png',w:'21.7%'},
 'Dodge':{src:'images/logo_dodge.png',w:'24.0%'},
 'Honda':{src:'images/logo_honda.png',w:'16.5%'},
 'Bentley':{src:'images/logo_bentley.png',w:'24.0%'},
 'Rolls-Royce':{src:'images/logo_rollsroyce.png',w:'11.7%'},
 'Maserati':{src:'images/logo_maserati.png',w:'15.9%'},
 'Jaguar':{src:'images/logo_jaguar.png',w:'23.8%'},
 'Alfa Romeo':{src:'images/logo_alfaromeo.png',w:'15.0%'},
 'Koenigsegg':{src:'images/logo_koenigsegg.png',w:'13.1%'},
 'Pagani':{src:'images/logo_pagani.png',w:'20.2%'},
 'Lotus':{src:'images/logo_lotus.png',w:'15.1%'},
 'Subaru':{src:'images/logo_subaru.png',w:'20.6%'},
 'Mitsubishi':{src:'images/logo_mitsubishi.png',w:'15.6%'},
 'Land Rover':{src:'images/logo_landrover.png',w:'20.0%'},
 'Volkswagen':{src:'images/logo_volkswagen.png',w:'15.1%'},
 'Mini':{src:'images/logo_mini.png',w:'21.8%'},
 'Tesla':{src:'images/logo_tesla.png',w:'15.3%'},
 'Cadillac':{src:'images/logo_cadillac.png',w:'23.0%'}
};

// ── Dropdown de marcas (Mini) — controla exatamente quais marcas existem ──
var MINI_BRANDS=['Fórmula 1','Ferrari','Porsche','Lamborghini','McLaren','Mercedes-Benz','BMW','Audi','Aston Martin','Bugatti','Nissan','Toyota','Ford','Chevrolet','Dodge','Honda','Bentley','Rolls-Royce','Maserati','Jaguar','Alfa Romeo','Koenigsegg','Pagani','Lotus','Subaru','Mitsubishi','Land Rover','Volkswagen','Mini','Tesla','Cadillac'];
function populateBrandSelect(id){
  var sel=document.getElementById(id);
  if(!sel||sel.dataset.filled)return;
  var html='<option value="" disabled selected>Selecione a marca...</option>';
  MINI_BRANDS.forEach(function(b){ html+='<option value="'+b+'">'+b+'</option>'; });
  html+='<option value="Outros">Outros (digitar)</option>';
  sel.innerHTML=html; sel.dataset.filled='1';
}
// prefix = 'aiCar' ou 'apenaCar'. O input hidden (prefix+'Brand') continua a fonte da verdade lida pelo resto do codigo.
function brandSelectChanged(prefix){
  var sel=document.getElementById(prefix+'BrandSelect');
  var other=document.getElementById(prefix+'BrandOther');
  var hid=document.getElementById(prefix+'Brand');
  if(!sel||!hid)return;
  if(sel.value==='Outros'){
    if(other){ other.style.display=''; try{other.focus();}catch(e){} }
    hid.value=(other&&other.value.trim())||'';
  } else {
    if(other)other.style.display='none';
    hid.value=sel.value||'';
  }
  if(typeof updateCarDesc==='function')updateCarDesc();
}
function brandOtherChanged(prefix){
  var other=document.getElementById(prefix+'BrandOther');
  var hid=document.getElementById(prefix+'Brand');
  if(other&&hid)hid.value=other.value;
  if(typeof updateCarDesc==='function')updateCarDesc();
}
(function(){
  function _fillBrands(){ populateBrandSelect('aiCarBrandSelect'); populateBrandSelect('apenaCarBrandSelect'); }
  if(document.readyState!=='loading'){ _fillBrands(); } else { document.addEventListener('DOMContentLoaded',_fillBrands); }
})();
// ── AI LOGO GENERATION — mini step 6 ──
var _aiLogoCache={};
function generateLogoAI(subject,type,targetElId,loaderId,pvLoaderId){
  if(!subject||!targetElId)return;
  var cKey=type+':'+subject;
  var el=document.getElementById(targetElId);
  if(!el)return;
  // indicador no painel lateral + spinner no proprio preview
  function _load(on){var L=loaderId&&document.getElementById(loaderId);if(L)L.style.display=on?'block':'none';}
  // enquanto gera: esconde o logo anterior (evita mostrar a imagem padrao de outra marca) e mostra o spinner
  function _pv(on){
    var P=pvLoaderId&&document.getElementById(pvLoaderId);
    if(P)P.style.display=on?'block':'none';
    el.style.display=on?'none':'';
    el.style.opacity='1';
  }
  if(_aiLogoCache[cKey]){el.src=_aiLogoCache[cKey];el.style.filter='drop-shadow(1px 2px 3px rgba(0,0,0,0.6))';_pv(false);_load(false);return;}
  _load(true);
  _pv(true);
  var prompt=type==='brand'
    ?'Official "'+subject+'" car brand logo emblem, faithful and accurate, full color, iconic badge, transparent background, no extra text, high detail. PNG.'
    :'"'+subject+'" car model nameplate badge. White. 100% transparent background. Clean automotive badge typography. Minimal. PNG.';
  var xhr=new XMLHttpRequest();
  xhr.open('POST','https://funparts-ai-proxy.rodox1209.workers.dev',true);
  xhr.setRequestHeader('Content-Type','application/json');
  xhr.timeout=90000;
  xhr.onload=function(){
    try{
      var d=JSON.parse(xhr.responseText);
      var item=d.data&&d.data[0];if(!item)return;
      var url=item.b64_json?'data:image/png;base64,'+item.b64_json:item.url;
      _aiLogoCache[cKey]=url;
      var e2=document.getElementById(targetElId);
      if(e2){e2.src=url;e2.style.filter='drop-shadow(1px 2px 3px rgba(0,0,0,0.6))';}
    }catch(e){}
    _pv(false); _load(false);
  };
  xhr.onerror=xhr.ontimeout=function(){_pv(false);_load(false);};
  xhr.send(JSON.stringify({model:'gpt-image-1',prompt:prompt,n:1,size:'1024x1024',quality:'high',background:'transparent',output_format:'png'}));
}

// ── Descrição do preview (Mini): Marca / Nome do carro / Cor — atualiza ao vivo ──
function updateCarDesc(){
  // le do formulario ativo: 'aiCar…' (quadro incluso) ou 'apenaCar…' (somente quadro)
  function _v(a,b){var x=((document.getElementById(a)||{}).value||'').trim();return x||((document.getElementById(b)||{}).value||'').trim();}
  var b=_v('aiCarBrand','apenaCarBrand');
  var m=_v('aiCarModel','apenaCarModel');
  var c=_v('aiCarColor','apenaCarColor');
  // mantem o estado sincronizado com o que o cliente escolheu (usado no titulo/marca do produto)
  if(b) S.miniBrand=b;
  if(m) S.miniModel=m;
  var em=document.getElementById('pvMod'); if(em) em.textContent=b||'Seu Carro';
  var es=document.getElementById('pvSpecDesc'); if(es) es.textContent=m||'';
  var ec=document.getElementById('pvCarColor'); if(ec){ ec.textContent=c||''; ec.style.display=c?'':'none'; }
}

// ── STEP 6: ALTO-RELEVO ──
function updateFixedRelevo(){
  const tlEl=document.getElementById('fixedTL');
  const brEl=document.getElementById('brandRelDesc');
  // Mostra/oculta bloco de logo do modelo (exclusivo mini)
  var _mfbr=document.getElementById('miniFixedBR');
  if(_mfbr) _mfbr.style.display=S.tipo==='mini'?'flex':'none';
  // RESET: garante que os ajustes exclusivos do Mini nao vazem para o LEGO (volta ao CSS padrao)
  var _lfR=document.getElementById('logoF1');
  var _btlR=(_lfR&&_lfR.closest)?_lfR.closest('.b-tl'):null;
  if(_btlR){ _btlR.style.top=''; _btlR.style.left=''; }
  var _lbR=document.getElementById('logoBR');
  if(_lbR){ _lbR.style.maxWidth=''; }
  // Mini: logo real da marca tem cores proprias -> esconde o seletor de cor do TL
  var _tlc=document.getElementById('tlColorWrap');
  if(_tlc) _tlc.style.display=(S.tipo==='mini')?'none':'';
  // esconde indicadores de carregamento ao (re)entrar na etapa
  ['fixedTLLoad','fixedBRLoad','logoTLLoad','logoBRLoad'].forEach(function(id){var L=document.getElementById(id);if(L)L.style.display='none';});
  ['logoF1','logoBR'].forEach(function(id){var I=document.getElementById(id);if(I){I.style.display='';I.style.opacity='1';}});
  if(S.tipo!=='mini' && S.legoF1){
    tlEl.textContent='🏁 Logo Fórmula 1 — Canto superior esquerdo';
    updateBadgeTL('F1');
  } else if(S.tipo==='mini'){
    // Mini: gera logo da MARCA do carro via IA (TL) e modelo (BR) — mesma marca usada na geração da imagem
    const brand=((document.getElementById('aiCarBrand')||{}).value||'').trim()||((document.getElementById('apenaCarBrand')||{}).value||'').trim()||S.miniBrand||'';
    const model=((document.getElementById('aiCarModel')||{}).value||'').trim()||((document.getElementById('apenaCarModel')||{}).value||'').trim()||S.miniModel||S.miniBrand||'';
    tlEl.textContent='🏷️ Logotipo com marca do carro';
    // Mini: desloca o logo da marca um pouco para baixo e para a direita (padrao CSS: 7% / 9%)
    var _btlM=(_lfR&&_lfR.closest)?_lfR.closest('.b-tl'):null;
    if(_btlM){ _btlM.style.top='11%'; _btlM.style.left='13%'; }
    if(brand){
      var _lf=document.getElementById('logoF1');
      if(_lf){_lf.style.width='17%';}
      // casa pelo nome EXATO da marca (dropdown); fallback normalizado p/ texto livre em "Outros"
      var _bkey=brand.toLowerCase().replace(/[^a-z0-9]/g,'');
      var _entry=null;
      if(typeof BRAND_LOGOS!=='undefined'){
        _entry=BRAND_LOGOS[brand];
        if(!_entry){ for(var _k in BRAND_LOGOS){ if(_k.toLowerCase().replace(/[^a-z0-9]/g,'')===_bkey){ _entry=BRAND_LOGOS[_k]; break; } } }
      }
      var _tld=document.getElementById('fixedTLDesc');
      if(_entry&&_lf){
        // logo real da marca — cores originais, sem filtro de cor, largura calibrada
        _lf.src=(typeof _entry==='string')?_entry:_entry.src;
        _lf.style.width=(typeof _entry==='string')?'17%':(_entry.w||'17%');
        _lf.style.filter='drop-shadow(1px 2px 3px rgba(0,0,0,0.6))';
        _lf.style.opacity='1';
        var _tll=document.getElementById('fixedTLLoad'); if(_tll)_tll.style.display='none';
        if(_tld)_tld.textContent='Logotipo oficial da marca selecionada';
      } else {
        // marca sem logo cadastrado -> gera via IA (reserva)
        if(_tld)_tld.textContent='Gerado com IA conforme marca selecionada';
        generateLogoAI(brand,'brand','logoF1','fixedTLLoad','logoTLLoad');
      }
    }
    var _brEl2=document.getElementById('fixedBR');
    if(_brEl2) _brEl2.textContent='🏎️ Logo do Modelo — Canto inferior direito';
    if(model){
      var _lb=document.getElementById('logoBR');
      // Mini: aumenta o logo do modelo (o CSS .b-br img limita a 13%, entao destravamos aqui)
      if(_lb){_lb.style.width='20%';_lb.style.maxWidth='20%';}
      generateLogoAI(model,'model','logoBR','fixedBRLoad','logoBRLoad');
    }
    // Limpa texto dos badges (logo IA substitui)
    setEl('badgeTLtxt','');setEl('badgeBRtxt','');
  } else {
    const nome=S.legoModel||S.miniModel||S.miniBrand||'Modelo';
    tlEl.textContent='🏎️ Nome do modelo — Canto superior esquerdo';
    updateBadgeTL(nome.split(' ').slice(0,2).join(' ').toUpperCase());
  }
  const marca=S.tipo==='lego'?S.legoBrand:S.miniBrand;
  if(brEl&&S.tipo!=='mini') brEl.textContent=marca||'Conforme marca selecionada';
  if(S.tipo!=='mini') updateBadgeBR(marca||'FUNPARTS',S.relBR);
}

function colorToFilter(hex){
  const map={
    '#C0C0C0':'brightness(0) invert(1) sepia(0) saturate(0) brightness(0.78)',
    '#5BCCF0':'brightness(0) sepia(1) saturate(8) brightness(1.1) hue-rotate(2deg)',
    '#fff':   'brightness(0) invert(1)',
    '#E8600A':'brightness(0) sepia(1) hue-rotate(-35deg) saturate(12) brightness(1.05)',
    '#d5040f':'saturate(1.5) brightness(0.82) contrast(1.15)',
    '#1a1a1a':'brightness(0) invert(0.1)',
  };
  return map[hex]||'none';
}

function selRelColor(pos,dot,color){
  if(dot){
    var cont=document.getElementById('colorTL_lego');
    if(cont)cont.querySelectorAll('.cdot').forEach(function(d){d.classList.remove('sel');});
    dot.classList.add('sel');
  } else {
    var sw=document.getElementById('cpSwatch_'+pos.toLowerCase());
    if(sw)sw.style.background=color;
  }
  if(pos==='tl'){
    S.relTL=color;
    setStyle('badgeTLtxt','color',color);
    const logoF1=document.getElementById('logoF1');
    if(logoF1 && S.tipo!=='mini') logoF1.style.filter=colorToFilter(color)+' drop-shadow(1px 2px 2px rgba(0,0,0,0.45))';
    const legoLF1=document.getElementById('legoLogoF1');
    if(legoLF1) legoLF1.style.filter=colorToFilter(color)+' drop-shadow(1px 2px 2px rgba(0,0,0,0.45))';
  } else {
    S.relBR=color;
    updateBadgeBR(null,color);
    const bbrLine=document.querySelector('.b-br');
    if(bbrLine) bbrLine.style.borderRight='3px solid '+color;
  }
}
function togRelevoOpt(row,key,label,price){
  row.classList.toggle('sel');
  const on=row.classList.contains('sel');
  const badge=row.querySelector('.rbadge');
  badge.textContent=on?`✓ ${label}`:`+ R$ ${price}`;
  if(on){S.relOpts.push(label);S.relOptsExtra+=price;}
  else{S.relOpts=S.relOpts.filter(r=>r!==label);S.relOptsExtra-=price;}
  setStyle('pilotoInput','display',S.relOpts.includes('Nome do Piloto')?'block':'none');
  setStyle('bandeiraInput','display',S.relOpts.includes('Bandeira do País')?'block':'none');
  // Relevos de imagem fixa por modelo
  if(key==='placa'||key==='tracado'){
    var _old2=document.querySelector('.rel-'+key);
    if(_old2) _old2.remove();
    if(on){
      var _mr2=(typeof MODEL_RELEVO_IMAGES!=='undefined')&&MODEL_RELEVO_IMAGES[S.legoModel];
      var _img2=_mr2&&_mr2[key];
      if(_img2){
        var _cfg2=_mr2&&_mr2[key+'_cfg'];
        var _pos2=(_cfg2&&_cfg2.pos)||(key==='placa'?'bottom-left':'bottom-right');
        var _w2=(_cfg2&&_cfg2.w)||(key==='placa'?80:50);
        var _el2=addRelevo(_img2,label,_w2,null,_pos2);
        if(!_el2){var _el2b=document.querySelector('#relExtras .rel-item:last-child');if(_el2b)_el2=_el2b;}
        if(_el2){_el2.classList.add('rel-'+key);if(_cfg2&&_cfg2.bottom)_el2.style.bottom=_cfg2.bottom;if(_cfg2&&_cfg2.right)_el2.style.right=_cfg2.right;}
      }
    }
  }
  calcPrice();
}

function updateBadgeTL(text){
  setEl('badgeTLtxt',text||'FUNPARTS');
  setStyle('badgeTLtxt','color',S.relTL||'#fff');
  const logoF1=document.getElementById('logoF1');
  // Mini usa o logo REAL e colorido da marca: NAO aplicar filtro de cor (senao vira silhueta branca)
  if(logoF1 && S.tipo!=='mini') logoF1.style.filter=colorToFilter(S.relTL||'#fff')+' drop-shadow(1px 2px 2px rgba(0,0,0,0.45))';
  // Mirror to LEGO preview
  setEl('legoBadgeTLtxt',text||'FUNPARTS');
  setStyle('legoBadgeTLtxt','color',S.relTL||'#fff');
  const lf1=document.getElementById('legoLogoF1');
  if(lf1){
    if(!lf1.src||lf1.src===window.location.href){var _s=document.getElementById('logoF1');if(_s)lf1.src=_s.src;}
    lf1.style.filter=colorToFilter(S.relTL||'#fff')+' drop-shadow(1px 2px 2px rgba(0,0,0,0.45))';
  }
}

function updateBadgeBR(text,color){
  const marca=text||(S.tipo==='lego'?S.legoBrand:S.miniBrand)||'FUNPARTS';
  setEl('badgeBRtxt',marca.toUpperCase());
  if(color){setStyle('badgeBRtxt','color',color);setStyle('badgeBRline','background',color);}
  // Mirror to LEGO preview
  setEl('legoBadgeBRtxt',marca.toUpperCase());
  if(color){setStyle('legoBadgeBRtxt','color',color);setStyle('legoBadgeBRline','background',color);}
}

// ── PREÇO ──
function selLedFio(fio){
  S.ledFio=fio;
  document.getElementById('ledFioCom').classList.toggle('sel',fio==='com');
  document.getElementById('ledFioSem').classList.toggle('sel',fio==='sem');
  calcPrice();
}

function setLED(card, tipo){
  document.querySelectorAll('.led-card').forEach(c=>c.classList.remove('on'));
  card.classList.add('on');
  S.ledTipo=tipo;
  if(!S.led) return;
  const glow=document.getElementById('ledGlow');
  const dark=document.getElementById('ledDark');
  const _applyLedSet=function(glowId,darkId){
    const g=document.getElementById(glowId);
    const d=document.getElementById(darkId);
    if(g){
      g.className='led-glow';
      if(tipo==='warm')g.classList.add('warm');
      else if(tipo==='rgb')g.classList.add('cold');
    }
    if(d) d.className='led-dark active';
  };
  _applyLedSet('ledGlow','ledDark');
  _applyLedSet('legoLedGlow','legoLedDark');
  calcPrice();
}

var LEGO_MODEL_SKU={
  'Mini F1 Speed Champions':'FP-004',
  'Ferrari SF24 F1':'FP-012',
  'Ferrari 488 GTE':'FP-010',
  'Ferrari Daytona SP3':'FP-011',
  'McLaren P1':'FP-013',
  'Mercedes W14':'FP-014',
  'Renault F1':'FP-015',
  'McLaren F1 MCL35':'FP-016',
  'McLaren F1 MCL39':'FP-017',
  'Batmóvel':'FP-018',
  'Ford Raptor':'FP-019',
  'Ford GT':'FP-020',
  'Nissan GTR Skyline':'FP-021',
  'Yamaha MT-10':'FP-022',
  'Aston Martin F1':'FP-023',
  'Ecto-01 Ghostbusters':'FP-025',
  'Bugatti Chiron':'FP-036',
  'Lamborghini Sian':'FP-037',
  'Porsche 911 RSR':'FP-038',
  'Dodge Charger R/T':'FP-029',
  'BMW 1000RR':'FP-031',
  'Ford Mustang GT 1960':'FP-032',
};
function calcPrice(){
  // Produto pronto do catalogo: o preco e o do proprio produto
  if(S.tipo==='mini' && S.miniChoice==='incluso' && S.incProduto){
    S._total=S.incProduto.p;
    var _f=_brl(S.incProduto.p);
    setEl('pvPrice',_f);
    var _mb=document.getElementById('mobBarPrice'); if(_mb)_mb.textContent=_f;
    var _db=document.getElementById('deskBarPrice'); if(_db)_db.textContent=_f;
    return;
  }
  // 1. Base pelo produto (Medida × Fundo para LEGO, Escala × Medida para Mini)
  const LEGO_PRICE={
    '53×83cm':{c:689,f:589},'83×53cm':{c:689,f:589},
    '49×49cm':{c:689,f:589},'25×35cm':{c:689,f:589},
    '63×128cm':{c:689,f:589},'60×125cm':{c:689,f:589},
    '114×49cm':{c:689,f:589},'34×134cm':{c:689,f:589},
    '40×66,5cm':{c:689,f:589},
  };
  let base=479;
  if(S.tipo==='lego'){
    const tier=LEGO_PRICE[S.legoDim]||{c:479,f:365};
    base=(S.fundo==='f-fosco')?tier.f:tier.c;
  } else if(S.tipo==='mini'){
    const sz=MINI_SIZES.find(s=>s.id===S.miniSize);
    base=sz?sz.base:1990;
  }
  // 2. Upgrades
  if(S.moldura==='m-fibra')base+=75;
  if(S.led){
    const rgb=(S.ledTipo==='rgb');
    const sem=(S.ledFio==='sem');
    base+=rgb?(sem?589:489):(sem?489:389);
  }
  if(S.miniOpt==='buy')base+=250;
  if(S.disp==='3d'&&S.miniOpt==='buy')base+=180;
  base+=S.relOptsExtra+S.customExtra;
  S._total=base;
  const fmtd='R$ '+base.toLocaleString('pt-BR');
  setEl('pvPrice',fmtd);
  // Atualiza barra inferior em tempo real
  const mob=document.getElementById('mobBarPrice');
  if(mob) mob.textContent=fmtd;
  const desk=document.getElementById('deskBarPrice');
  if(desk) desk.textContent=fmtd;
}


// ══════ CATÁLOGO DE PRODUTOS PRONTOS — "Quadro incluso miniatura" (somente Mini) ══════
var INCLUSO_CATALOG={
 "Ferrari":{logo:'images/logo_ferrari.png',itens:[{n:"Ferrari 296 GTB listras amarelas",esc:"1:18",dim:"40x66,5cm",mol:"Fibra de carbono",p:1990},{n:"Ferrari 458 Speciale vermelha",esc:"1:18",dim:"40x66,5cm",mol:"Fibra de carbono",p:1990},{n:"Ferrari 499P Lemans",esc:"1:24",dim:"49x49cm",mol:"Fibra de carbono",p:1290},{n:"Ferrari 499P Lemans",esc:"1:18",dim:"40x66,5cm",mol:"Fibra de carbono",p:1990},{n:"Ferrari Coleção Burago",esc:"1:43",dim:"25x35cm",mol:"Fibra de carbono",p:299},{n:"Ferrari F1 SF24",esc:"1:24",dim:"49x49cm",mol:"Fibra de carbono",p:1290},{n:"Ferrari F1 SF24 - Hamilton",esc:"1:18",dim:"40x66,5cm",mol:"Fibra de carbono",p:1990},{n:"Ferrari F50",esc:"1:18",dim:"40x66,5cm",mol:"Fibra de carbono",p:1990},{n:"Ferrari FXXK",esc:"1:18",dim:"40x66,5cm",mol:"Fibra de carbono",p:1990},{n:"Ferrari LaFerrari",esc:"1:18",dim:"40x66,5cm",mol:"Fibra de carbono",p:1990},{n:"Ferrari SF24 - Mini",esc:"1:43",dim:"25x35cm",mol:"Fibra de carbono",p:399}]},
 "Fórmula 1":{logo:'images/logo_formula1.png',itens:[{n:"Red Bull F1 RB21",esc:"1:24",dim:"49x49cm",mol:"Fibra de carbono",p:1290},{n:"Redbull F1 RB20 - Max Verstappen",esc:"1:18",dim:"40x66,5cm",mol:"Fibra de carbono",p:1990},{n:"Ferrari SF25 F1",esc:"1:43",dim:"25x35cm",mol:"Fibra de carbono",p:399},{n:"McLaren MCL39 F1",esc:"1:43",dim:"25x35cm",mol:"Fibra de carbono",p:399},{n:"McLaren Senna",esc:"1:18",dim:"40x66,5cm",mol:"Fibra de carbono",p:4350},{n:"Mercedes W16 F1",esc:"1:43",dim:"25x35cm",mol:"Fibra de carbono",p:399},{n:"Red Bull RB21 F1",esc:"1:43",dim:"25x35cm",mol:"Fibra de carbono",p:399},{n:"Set Mercedes F1 - 7 carros",esc:"1:43",dim:"66,5x40cm",mol:"Fibra de carbono",p:2250},{n:"Set Red Bull F1 - 7 carros",esc:"1:43",dim:"66,5x40cm",mol:"Fibra de carbono",p:2250}]},
 "Porsche":{logo:'images/logo_porsche.png',itens:[{n:"Porsche 911 GT3 - Azul",esc:"1:18",dim:"40x66,5cm",mol:"Fibra de carbono",p:1990},{n:"Porsche 911 GT3 - Azul Tiffany",esc:"1:24",dim:"49x49cm",mol:"Fibra de carbono",p:1290},{n:"Porsche 911 GT3 - Laranja",esc:"1:24",dim:"49x49cm",mol:"Fibra de carbono",p:1290},{n:"Porsche 911 GT3 - Preta",esc:"1:18",dim:"40x66,5cm",mol:"Fibra de carbono",p:1990},{n:"Porsche 911 RSR Martini",esc:"1:24",dim:"49x49cm",mol:"Fibra de carbono",p:1290},{n:"Porsche 963 Lemans",esc:"1:24",dim:"49x49cm",mol:"Fibra de carbono",p:1290},{n:"Porsche GT2rs Fibra - Amarela",esc:"1:24",dim:"49x49cm",mol:"Fibra de carbono",p:1290},{n:"Porsche 911 Carrera RS - Branca",esc:"1:18",dim:"40x66,5cm",mol:"Fibra de carbono",p:1990}]},
 "BMW":{logo:'images/logo_bmw.png',itens:[{n:"BMW GS1250",esc:"1:9",dim:"66,5x40cm",mol:"Fibra de carbono",p:1990},{n:"BMW M2 Azul",esc:"1:18",dim:"40x66,5cm",mol:"Laca Preto",p:1990},{n:"BMW M3",esc:"1:24",dim:"49x49cm",mol:"Fibra de carbono",p:1290},{n:"BMW M6 GT3 - Azul",esc:"1:32",dim:"49x49cm",mol:"Fibra de carbono",p:399}]},
 "Chevrolet":{logo:'images/logo_chevrolet.png',itens:[{n:"Opala Chevrolet - Amarelo",esc:"1:24",dim:"49x49cm",mol:"Laca Preto",p:1290},{n:"Opala Chevrolet - Bege",esc:"1:24",dim:"49x49cm",mol:"Laca Preto",p:1290},{n:"Opala Chevrolet - Laranja",esc:"1:24",dim:"49x49cm",mol:"Laca Preto",p:1290}]},
 "Corvette":{logo:'',itens:[{n:"Corvette Branca",esc:"1:18",dim:"49x49cm",mol:"Fibra de carbono",p:1290},{n:"Corvette Rosa",esc:"1:18",dim:"49x49cm",mol:"Fibra de carbono",p:1290},{n:"Corvette Vermelha",esc:"1:18",dim:"49x49cm",mol:"Fibra de carbono",p:1290}]},
 "Ford":{logo:'images/logo_ford.png',itens:[{n:"Ford GT Gulf",esc:"1:32",dim:"25x35cm",mol:"Fibra de carbono",p:399},{n:"FordGT Vermelho",esc:"1:18",dim:"49x49cm",mol:"Fibra de carbono",p:1290},{n:"Mustang Shelby Branco listras azuis",esc:"1:18",dim:"49x49cm",mol:"Fibra de carbono",p:1290}]},
 "Ducati":{logo:'',itens:[{n:"Moto Ducati 1199 Panigale - Vermelha",esc:"1:12",dim:"25x35cm",mol:"Fibra de carbono",p:399},{n:"Moto Ducati GP",esc:"1:6",dim:"66,5x40cm",mol:"Fibra de carbono",p:1990}]},
 "Lamborghini":{logo:'images/logo_lamborghini.png',itens:[{n:"Lamborghini Huracan Performante Vermelha",esc:"1:18",dim:"40x66,5cm",mol:"Fibra de carbono",p:1990},{n:"Lamborghini Countach Laranja",esc:"1:18",dim:"40x66,5cm",mol:"Fibra de carbono",p:1990}]},
 "Volkswagen":{logo:'images/logo_volkswagen.png',itens:[{n:"Gol GTI Volkswagen",esc:"1:24",dim:"49x49cm",mol:"Laca Preto",p:1290},{n:"Fusca Volkswagen 1955 - Creme",esc:"1:18",dim:"49x49cm",mol:"Fibra de carbono",p:1290}]},
 "Audi":{logo:'images/logo_audi.png',itens:[{n:"Audi R8 Preto Fosco",esc:"1:18",dim:"49x49cm",mol:"Laca Preto",p:1290}]},
 "Filmes":{logo:'',itens:[{n:"Relâmpago McQueen",esc:"1:24",dim:"25x35cm",mol:"Fibra de carbono",p:299}]},
 "Harley Davidson":{logo:'',itens:[{n:"Moto Harley Davidson Street Glide - Preta",esc:"1:12",dim:"25x35cm",mol:"Laca Preto",p:399}]},
 "McLaren":{logo:'images/logo_mclaren.png',itens:[{n:"Mclaren MCL35",esc:"1:12",dim:"40x66,5cm",mol:"Fibra de carbono",p:2360}]},
 "Mercedes-Benz":{logo:'images/logo_mercedes.png',itens:[{n:"Mercedes W14",esc:"1:12",dim:"40x66,5cm",mol:"Fibra de carbono",p:2360}]},
 "Mitsubishi":{logo:'images/logo_mitsubishi.png',itens:[{n:"Lancer Evo Amarelo",esc:"1:24",dim:"49x49cm",mol:"Fibra de carbono",p:1290}]},
 "Nissan":{logo:'images/logo_nissan.png',itens:[{n:"GTR Nissan LibertyWalk",esc:"1:24",dim:"49x49cm",mol:"Fibra de carbono",p:1290}]}
};
var INCLUSO_FOTOS=["images/produto_1.jpg","images/produto_2.jpg","images/produto_3.jpg","images/produto_4.jpg"];

function _brl(v){return 'R$ '+Number(v).toLocaleString('pt-BR');}
function _linProd(k,v){return '<div style="display:flex;justify-content:space-between;gap:12px;"><span style="color:#888;">'+k+'</span><span style="color:#ddd;text-align:right;">'+v+'</span></div>';}

function renderInclusoBrands(){
  var el=document.getElementById('inclusoBrands'); if(!el)return;
  var h='';
  Object.keys(INCLUSO_CATALOG).forEach(function(b){
    var c=INCLUSO_CATALOG[b];
    var ico=c.logo?('<img src="'+c.logo+'" alt="">'):'<span style="font-size:16px;">\uD83C\uDFC1</span>';
    h+='<div class="bcard" data-ib="'+b+'" onclick="selInclusoBrand(this.getAttribute(\'data-ib\'))"><div class="bico">'+ico+'</div><div class="bnm">'+b+'</div></div>';
  });
  el.innerHTML=h;
  var w=document.getElementById('inclusoModelsWrap'); if(w)w.style.display='none';
}

function selInclusoBrand(b){
  S.incBrandSel=b;
  document.querySelectorAll('#inclusoBrands .bcard').forEach(function(c){c.classList.toggle('sel',c.getAttribute('data-ib')===b);});
  var its=((INCLUSO_CATALOG[b]||{}).itens)||[];
  var w=document.getElementById('inclusoModelsWrap'); if(w)w.style.display='block';
  var cnt=document.getElementById('inclusoModelsCount'); if(cnt)cnt.textContent='('+its.length+')';
  var lst=document.getElementById('inclusoModels'); if(!lst)return;
  lst.innerHTML=its.map(function(it,i){
    return '<div class="mrow" data-ii="'+i+'" onclick="selInclusoProduto(this.getAttribute(\'data-ii\'))"><span>'+it.n+'</span><span class="mrow-tag">'+it.esc+' \u00b7 '+_brl(it.p)+'</span></div>';
  }).join('');
}

function trocarFotoIncluso(k){
  k=parseInt(k,10); S.incFotoIdx=k;
  var m=document.getElementById('catMainPhoto'); if(m)m.src=INCLUSO_FOTOS[k];
  document.querySelectorAll('#catThumbs img').forEach(function(t){
    t.style.borderColor=(parseInt(t.getAttribute('data-th'),10)===k)?'#e07b00':'transparent';
  });
}

// monta a galeria do produto pronto dentro da area de preview
function _catGaleriaHTML(){
  var idx=S.incFotoIdx||0;
  var thumbs=INCLUSO_FOTOS.map(function(f,k){
    return '<img src="'+f+'" data-th="'+k+'" onclick="trocarFotoIncluso('+k+')" style="width:74px;height:58px;object-fit:cover;border-radius:6px;cursor:pointer;flex-shrink:0;border:2px solid '+(k===idx?'#e07b00':'transparent')+';">';
  }).join('');
  return '<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;">'
    +'<div style="flex:1 1 auto;min-height:0;width:100%;display:flex;align-items:center;justify-content:center;">'
    +'<img id="catMainPhoto" src="'+INCLUSO_FOTOS[idx]+'" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:10px;display:block;">'
    +'</div>'
    +'<div id="catThumbs" style="display:flex;flex-direction:row;gap:8px;flex-shrink:0;">'+thumbs+'</div>'
    +'</div>';
}

// Produto pronto: sem personalizacao -> esconde as etapas 3..6 e mostra a aba Produto
function aplicarModoCatalogo(on){
  [3,4,5,6].forEach(function(st){
    var t=document.querySelector('.stab[data-step="'+st+'"]');
    if(t)t.style.display=on?'none':'';
  });
  var t2=document.getElementById('tabStep2');
  if(t2)t2.style.display=on?'':(S.tipo==='mini'?'none':'');
  var nav=document.getElementById('step2NavBtns');
  if(nav)nav.style.display=on?'none':'';
}

function selInclusoProduto(i){
  i=parseInt(i,10);
  var b=S.incBrandSel, it=(((INCLUSO_CATALOG[b]||{}).itens)||[])[i];
  if(!it)return;
  S.incProduto=it; S.incBrand=b; S.miniChoice='incluso'; S.incProdIdx=i;
  setEl('tabStep2Lbl','Produto');
  setEl('step2Title', it.n);
  setEl('step2Sub', b);
  setStyle('step2Title','display','');
  setStyle('step2Sub','display','');
  // galeria de fotos vai para a AREA DO PREVIEW (nao na coluna da direita)
  S.incFotoIdx=0;
  var wrapO=document.getElementById('ip2MainImgWrap'), th=document.getElementById('ip2Thumbs');
  if(wrapO)wrapO.style.display='none';
  if(th)th.style.display='none';
  // ficha tecnica
  var d=document.getElementById('ip2Desc');
  if(d){
    d.innerHTML='<div style="display:flex;flex-direction:column;gap:7px;">'
      +_linProd('Marca',b)
      +_linProd('Dimens\u00e3o do quadro',it.dim)
      +_linProd('Escala da miniatura',it.esc)
      +_linProd('Moldura',it.mol)
      +_linProd('Fundo','Acr\u00edlico Brilho com Impress\u00e3o UV')
      +_linProd('Miniatura','<span style="color:#7bd67b;">Inclusa</span>')
      +'</div>';
  }
  setStyle('miniInclusoAISection','display','none');
  setStyle('step2RegularContent','display','none');
  setStyle('inclusoProdutoSection','display','block');
  aplicarModoCatalogo(true);
  goStep(2);
  setStyle('inclusoProdutoSection','display','block');
  setStyle('step2RegularContent','display','none');
  calcPrice();
}

function voltarInclusoCatalogo(){
  S.incProduto=null;
  aplicarModoCatalogo(false);
  setStyle('inclusoProdutoSection','display','none');
  goStep(1);
  setStyle('miniSection','display','none');
  setStyle('miniInclusoAISection','display','block');
  calcPrice();
}

// ── SUMÁRIO ──
function buildSummary(){
  // Produto pronto do catalogo: resumo com todos os dados para cobranca
  if(S.tipo==='mini' && S.miniChoice==='incluso' && S.incProduto){
    var _it=S.incProduto;
    setEl('sumCat','Quadro para Miniaturas \u2014 Produto pronto');
    setEl('sumMod',(S.incBrand?S.incBrand+' \u2014 ':'')+_it.n);
    setEl('sumDim',_it.dim);
    setEl('sumMold',_it.mol);
    setEl('sumFund','Acr\u00edlico Brilho com Impress\u00e3o UV');
    setEl('sumLed','Sem LED');
    setEl('sumMini','Inclusa');
    setEl('sumRel','Incluso');
    setEl('pvSku',_it.esc+' / '+_it.dim);
    setEl('sumTotal',_brl(_it.p));
    return;
  }
  const cat=S.tipo==='lego'?'LEGO Technic / Creator / Icons':'Miniatura Die-cast / 3D';
  // Mini: le marca/modelo do formulario ativo (mesma fonte da descricao), com o estado como reserva
  function _fv(a,b){var x=((document.getElementById(a)||{}).value||'').trim();return x||((document.getElementById(b)||{}).value||'').trim();}
  const _mB=(S.tipo==='lego')?'':(_fv('aiCarBrand','apenaCarBrand')||S.miniBrand||'');
  const _mM=(S.tipo==='lego')?'':(_fv('aiCarModel','apenaCarModel')||S.miniModel||'');
  const mod=S.tipo==='lego'?(S.legoModel||'—'):((_mB||'—')+(_mM?' — '+_mM:''));
  const dim=S.tipo==='lego'?S.legoDim:S.miniDim;
  setEl('sumCat',cat);
  setEl('sumMod',mod);
  setEl('sumDim',dim);
  // Moldura — badge se for upgrade pago; cinza se removido
  if(S.moldura==='m-fibra'){
    document.getElementById('sumMold').innerHTML=S.molduraLbl+'<span class="sum-badge">+R$75 <button class="sum-rm" onclick="removeSumItem(\'moldura\')">×</button></span>';
  } else if(_sumRemoved.moldura){
    document.getElementById('sumMold').innerHTML='<span class="sum-val-del">Fibra de Carbono</span><span class="sum-undo-badge">removido <button class="sum-undo-btn" onclick="restoreSumItem(\'moldura\')">↩ desfazer</button></span>';
  } else { setEl('sumMold',S.molduraLbl); }
  setEl('sumFund',S.fundoLbl);
  // LED — badge com preço real; cinza se removido
  if(S.led){
    var _rgb=(S.ledTipo==='rgb'),_sem=(S.ledFio==='sem');
    var _lp=_rgb?(_sem?589:489):(_sem?489:389);
    document.getElementById('sumLed').innerHTML='Com iluminação LED ✨<span class="sum-badge">+R$'+_lp+' <button class="sum-rm" onclick="removeSumItem(\'led\')">×</button></span>';
  } else if(_sumRemoved.led){
    document.getElementById('sumLed').innerHTML='<span class="sum-val-del">Com iluminação LED ✨</span><span class="sum-undo-badge">removido <button class="sum-undo-btn" onclick="restoreSumItem(\'led\')">↩ desfazer</button></span>';
  } else { setEl('sumLed','Sem LED'); }
  let mini='—';
  if(S.miniOpt==='own')mini='Envio próprio';
  else mini='Comprar conosco ('+({exist:'Die-cast',notsure:'A confirmar',_3d:'Impressão 3D'}[S.disp]||'Die-cast')+')';
  if(S.customs.length)mini+='\nPersonalizações: '+S.customs.join(', ');
  setEl('sumMini',mini);
  // Mini: logos fixos sempre incluídos no sumário
  var _fixedRelHtml='';
  if(S.tipo==='mini'){
    _fixedRelHtml='<span style="display:block;margin-bottom:2px;color:#aaa;">✓ Logo da Marca — canto sup. esq.</span><span style="display:block;margin-bottom:4px;color:#aaa;">✓ Logo do Modelo — canto inf. dir.</span>';
  }
  // Alto-relevo — ativos com badge; removidos em cinza com ↩
  var _actRel=S.relOpts.map(function(opt){
    var _k=opt==='Bandeira do País'?'bandeira':'piloto';
    return '<span style="display:block;margin-bottom:2px;">'+opt+'<span class="sum-badge">+R$89 <button class="sum-rm" onclick="removeSumItem(\'rel\',\''+_k+'\',\''+opt.replace(/'/g,"\\'")+'\'  )">×</button></span></span>';
  });
  var _remRel=_sumRemoved.rel.map(function(r){
    return '<span style="display:block;margin-bottom:2px;"><span class="sum-val-del">'+r.label+'</span><span class="sum-undo-badge">removido <button class="sum-undo-btn" onclick="restoreSumItem(\'rel\',\''+r.key+'\',\''+r.label.replace(/'/g,"\\'")+'\'  )">↩ desfazer</button></span></span>';
  });
  var _allRel=_actRel.concat(_remRel);
  if(_fixedRelHtml||_allRel.length){ document.getElementById('sumRel').innerHTML=_fixedRelHtml+_allRel.join(''); }
  else { setEl('sumRel','Nenhum'); }
  setEl('sumTotal','R$ '+S._total.toLocaleString('pt-BR'));
  // SKU
  let sku='—';
  if(S.tipo==='lego'){
    const bSku=LEGO_MODEL_SKU[S.legoModel]||'FP-???';
    const upgs=[];
    if(S.moldura==='m-fibra')upgs.push('FP-UPG-MOL');
    if(S.led){
      const rgb=(S.ledTipo==='rgb'),sem=(S.ledFio==='sem');
      upgs.push(rgb?(sem?'FP-UPG-LSR':'FP-UPG-LCR'):(sem?'FP-UPG-LSN':'FP-UPG-LCN'));
    }
    if(S.relOpts.includes('Bandeira do País'))upgs.push('FP-UPG-BAN');
    if(S.relOpts.includes('Nome do Piloto'))upgs.push('FP-UPG-NOM');
    sku=upgs.length?bSku+' + '+upgs.join(' + '):bSku;
  } else if(S.tipo==='mini'){
    const sz=MINI_SIZES.find(s=>s.id===S.miniSize);
    const bSku=sz?'FP-'+sz.scale.replace(':','').replace(/\//g,''):'FP-???';
    const upgs=[];
    if(S.moldura==='m-fibra')upgs.push('FP-UPG-MOL');
    if(S.led){
      const rgb=(S.ledTipo==='rgb'),sem=(S.ledFio==='sem');
      upgs.push(rgb?(sem?'FP-UPG-LSR':'FP-UPG-LCR'):(sem?'FP-UPG-LSN':'FP-UPG-LCN'));
    }
    sku=sz?(sz.scale+' / '+sz.label+(upgs.length?' + '+upgs.join(' + '):'')):'—';
  }
  setEl('pvSku',sku);
}

// ── FINALIZAR ──
function finalizar(){
  alert('🏁 Pedido recebido!\n\nNossa equipe entrará em contato via WhatsApp em até 2h para confirmar os detalhes e iniciar a produção.\n\n📦 Prazo: 7–12 dias úteis\n🏆 Embalagem premium inclusa');
}

function abrirWpp(){
  const mod=S.tipo==='lego'?(S.legoModel||'—'):(S.miniBrand+(S.miniModel?' — '+S.miniModel:''));
  const dim=S.tipo==='lego'?S.legoDim:S.miniDim;
  const msg=encodeURIComponent(
    'Olá! Configurei meu quadro Funparts:\n'+
    '• Tipo: '+(S.tipo==='lego'?'LEGO':'Miniatura')+'\n'+
    '• Modelo: '+mod+'\n'+
    '• Dimensão: '+dim+'\n'+
    '• Moldura: '+S.molduraLbl+'\n'+
    '• Fundo: '+S.fundoLbl+'\n'+
    '• LED: '+(S.led?'Sim':'Não')+'\n'+
    '• Miniatura: '+(S.miniOpt==='own'?'Envio próprio':'Comprar conosco')+'\n'+
    (S.relOpts.length?'• Relevos extras: '+S.relOpts.join(', ')+'\n':'')+
    '• Total estimado: R$ '+S._total.toLocaleString('pt-BR')+'\n\n'+
    'Gostaria de finalizar o pedido!'
  );
  window.open('https://wa.me/5511910646157?text='+msg,'_blank');
}

// INIT
renderLegoModels('Formula 1');
renderMiniSizes();
selectTipo('lego');
calcPrice();
renderFundoLayouts(S.fundo);


// PREVIEW JS
const F={brilho:'images/img_005.jpg',fosco:'images/img_058.jpg',fibra:'images/img_059.jpg'};
const M={fibra:'images/img_007.webp',laca:'images/img_060.png'};
function setF(c,k,n){document.querySelectorAll('.fc').forEach(x=>{x.classList.remove('on');x.querySelector('.fk').textContent='';});c.classList.add('on');c.querySelector('.fk').textContent='✓';document.getElementById('iFundo').src=F[k];setEl('fAtual',n);}
function setM(c,k){document.querySelectorAll('.mc').forEach(x=>x.classList.remove('on'));c.classList.add('on');document.getElementById('iMoldura').src=M[k];}
// Init: sync previews with defaults (S.fundo='f-carbono'→F.fibra, S.moldura='m-fibra'→M.fibra)
(function(){var eF=document.getElementById('iFundo');if(eF&&F.fibra)eF.src=F.fibra;})();

// Filtros CSS para colorir SVG F1
const F1_FILTERS = {
  vermelho: 'brightness(0) saturate(100%) invert(17%) sepia(100%) saturate(3000%) hue-rotate(0deg) brightness(1.1) drop-shadow(1px 2px 2px rgba(0,0,0,0.45))',
  preto:    'brightness(0) saturate(100%) drop-shadow(1px 2px 2px rgba(0,0,0,0.45))',
  branco:   'brightness(0) saturate(100%) invert(1) drop-shadow(1px 2px 2px rgba(0,0,0,0.45))',
};
function setF1Color(d, key) {
  document.querySelectorAll('#rTL .cd').forEach(x => x.classList.remove('on'));
  d.classList.add('on');
  setStyle('logoF1','filter',F1_FILTERS[key]);
}

// ── RELEVOS EXTRAS ──
const BANDEIRA_MODELO = 'images/img_061.png';
let pilotColor = '#FFFFFF';
let extraItems = [];


// Adicionar elemento arrastável ao quadro
function addRelevo(dataUrl, label, w, h, position) {
  const wrap = document.getElementById('relExtras');
  if (!wrap) { alert('Elemento relExtras não encontrado'); return; }
  const legoWrap = document.getElementById('legoRelExtras');

  const div = document.createElement('div');
  div.className = 'rel-item';
  const pos = position || 'top-left';
  if (pos === 'top-right') div.style.cssText = 'right:12%;top:7%;left:auto;';
  else if (pos === 'top-left') div.style.cssText = 'left:6%;top:7%;';
  else if (pos === 'bottom-right') div.style.cssText = 'right:6%;bottom:5%;left:auto;';
  else if (pos === 'bottom-left') div.style.cssText = 'left:9%;bottom:5%;';
  else div.style.cssText = 'left:20%;top:20%;';

  const img = document.createElement('img');
  img.src = dataUrl;
  img.style.width = w + 'px';
  img.style.filter = 'drop-shadow(1px 2px 2px rgba(0,0,0,0.45))';
  img.title = label;
  div.appendChild(img);

  let isDragging = false, startX, startY, startL, startT;

  div.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX; startY = e.clientY;
    startL = parseFloat(div.style.left) / 100 * wrap.offsetWidth;
    startT = parseFloat(div.style.top) / 100 * wrap.offsetHeight;
    div.style.opacity = '0.85';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    const newL = Math.max(0, Math.min(startL + dx, wrap.offsetWidth - img.offsetWidth));
    const newT = Math.max(0, Math.min(startT + dy, wrap.offsetHeight - img.offsetHeight));
    div.style.left = (newL / wrap.offsetWidth * 100) + '%';
    div.style.top  = (newT / wrap.offsetHeight * 100) + '%';
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) { isDragging = false; div.style.opacity = '1'; }
  });

  div.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    startX = t.clientX; startY = t.clientY;
    startL = parseFloat(div.style.left) / 100 * wrap.offsetWidth;
    startT = parseFloat(div.style.top) / 100 * wrap.offsetHeight;
    isDragging = true; e.preventDefault();
  }, {passive:false});

  div.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const t = e.touches[0];
    const dx = t.clientX - startX, dy = t.clientY - startY;
    const newL = Math.max(0, Math.min(startL + dx, wrap.offsetWidth - img.offsetWidth));
    const newT = Math.max(0, Math.min(startT + dy, wrap.offsetHeight - img.offsetHeight));
    div.style.left = (newL / wrap.offsetWidth * 100) + '%';
    div.style.top  = (newT / wrap.offsetHeight * 100) + '%';
    e.preventDefault();
  }, {passive:false});

  div.addEventListener('touchend', () => { isDragging = false; });

  wrap.appendChild(div);
  extraItems.push(div);
  if(legoWrap){var _lc=div.cloneNode(true);_lc.style.pointerEvents='none';legoWrap.appendChild(_lc);}
  return div;
}

const BANDEIRAS = {
  'brasil': 'images/img_062.svg',
  'brazil': 'images/img_062.svg',
  'alemanha': 'images/img_063.svg',
  'germany': 'images/img_063.svg',
  'italia': 'images/img_064.svg',
  'italy': 'images/img_064.svg',
  'itália': 'images/img_064.svg',
  'franca': 'images/img_065.svg',
  'france': 'images/img_065.svg',
  'frança': 'images/img_065.svg',
  'espanha': 'images/img_066.svg',
  'spain': 'images/img_066.svg',
  'holanda': 'images/img_067.svg',
  'netherlands': 'images/img_067.svg',
  'países baixos': 'images/img_067.svg',
  'reino unido': 'images/img_068.svg',
  'uk': 'images/img_068.svg',
  'inglaterra': 'images/img_068.svg',
  'australia': 'images/img_069.svg',
  'austrália': 'images/img_069.svg',
  'canada': 'images/img_070.svg',
  'canadá': 'images/img_070.svg',
  'mexico': 'images/img_071.svg',
  'méxico': 'images/img_071.svg',
  'japao': 'images/img_072.svg',
  'japão': 'images/img_072.svg',
  'japan': 'images/img_072.svg',
  'eua': 'images/img_073.svg',
  'usa': 'images/img_073.svg',
  'estados unidos': 'images/img_073.svg',
  'austria': 'images/img_074.svg',
  'áustria': 'images/img_074.svg',
  'belgica': 'images/img_075.svg',
  'bélgica': 'images/img_075.svg',
  'belgium': 'images/img_075.svg',
  'suica': 'images/img_076.svg',
  'suíça': 'images/img_076.svg',
  'switzerland': 'images/img_076.svg',
  'finlandia': 'images/img_077.svg',
  'finlândia': 'images/img_077.svg',
  'dinamarca': 'images/img_078.svg',
  'denmark': 'images/img_078.svg',
  'monaco': 'images/img_079.svg',
  'mônaco': 'images/img_079.svg',
  'portugal': 'images/img_080.svg',
  'argentina': 'images/img_081.svg',
  'china': 'images/img_082.svg',
  'noruega': 'images/img_083.svg',
  'norway': 'images/img_083.svg',
  'suecia': 'images/img_084.svg',
  'suécia': 'images/img_084.svg',
  'sweden': 'images/img_084.svg',
  'tailandia': 'images/img_085.svg',
  'tailândia': 'images/img_085.svg',
  'grecia': 'images/img_086.svg',
  'grécia': 'images/img_086.svg',
  'greece': 'images/img_086.svg',
  'polonia': 'images/img_087.svg',
  'polônia': 'images/img_087.svg',
  'poland': 'images/img_087.svg',
};
const PAISES_DISPONIVEIS = ["Argentina", "Austrália", "Áustria", "Bélgica", "Brasil", "Canadá", "China", "Dinamarca", "Espanha", "EUA", "Finlândia", "França", "Grécia", "Holanda", "Inglaterra", "Itália", "Japão", "México", "Mônaco", "Noruega", "Polônia", "Portugal", "Reino Unido", "Suécia", "Suíça", "Tailândia"];

var _pilotoTimer=null;
function debAddPiloto(){clearTimeout(_pilotoTimer);_pilotoTimer=setTimeout(addPiloto,400);}
var _bandeiraTimer=null;
function debAddBandeira(){clearTimeout(_bandeiraTimer);_bandeiraTimer=setTimeout(addBandeira,600);}
function updateCarLbl(){debAddPiloto();}
function selPilotoColor(dot,c){
  if(dot){
    document.querySelectorAll('#colorPiloto_lego .cdot').forEach(function(d){d.classList.remove('sel');});
    dot.classList.add('sel');
  } else {
    var sw=document.getElementById('cpSwatch_piloto');
    if(sw)sw.style.background=c;
  }
  pilotColor=c;
  if(document.getElementById('inpPiloto').value.trim()) debAddPiloto();
}

function addBandeira() {
  const pais = document.getElementById('inpPais').value.trim();
  if (!pais) return;

  const key = pais.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ').trim();

  // Tentar encontrar no banco
  const imgUrl = BANDEIRAS[key] || BANDEIRAS[pais.toLowerCase()];

  if (!imgUrl) {
    // Mensagem personalizada para país não disponível
    const msg = document.getElementById('bandeiraMsgBox');
    if (msg) {
      msg.innerHTML = `<strong>Bandeira de "${pais}" não disponível para visualização.</strong><br>
        Mas não se preocupe! Ao efetuar a compra, nossa equipe irá personalizar o seu quadro com a bandeira de <strong>${pais}</strong>. 🏁`;
      msg.style.display = 'block';
      setTimeout(() => { msg.style.display = 'none'; }, 6000);
    }
    return;
  }

  // Esconder mensagem se estava visível
  const msg = document.getElementById('bandeiraMsgBox');
  if (msg) msg.style.display = 'none';

  // Remover bandeira anterior
  const oldBandeira = document.querySelector('.rel-bandeira');
  if (oldBandeira) {
    extraItems = extraItems.filter(x => x !== oldBandeira);
    oldBandeira.remove();
  }

  const _bPos=(S.legoModel&&(typeof MODEL_RELEVO_IMAGES!=='undefined')&&MODEL_RELEVO_IMAGES[S.legoModel]&&MODEL_RELEVO_IMAGES[S.legoModel].bandeira_pos)||'top-right';
  var _qW=(document.getElementById('legoDetQuadro')||{offsetWidth:400}).offsetWidth;
  var _fW=Math.max(14,Math.round(_qW*0.06));
  if(S.tipo==='mini') _fW=Math.round(_fW*2); // Mini: bandeira 100% maior
  const el=addRelevo(imgUrl, pais, _fW, Math.round(_fW*16/24), _bPos);
  if (el) {
    el.classList.add('rel-bandeira');
    // Marcar clone no legoRelExtras também
    var _lre=document.getElementById('legoRelExtras');
    if(_lre&&_lre.lastElementChild) _lre.lastElementChild.classList.add('rel-bandeira');
  }
  var _bBot=(typeof MODEL_RELEVO_IMAGES!=='undefined')&&S.legoModel&&MODEL_RELEVO_IMAGES[S.legoModel]&&MODEL_RELEVO_IMAGES[S.legoModel].bandeira_bottom;
  if(_bBot&&el) el.style.bottom=_bBot;
  var _bRight=(typeof MODEL_RELEVO_IMAGES!=='undefined')&&S.legoModel&&MODEL_RELEVO_IMAGES[S.legoModel]&&MODEL_RELEVO_IMAGES[S.legoModel].bandeira_right;
  if(_bRight&&el){el.style.right=_bRight;}
  // Mini: desce a bandeira 18px (padrao do CSS inline e top:7%)
  if(S.tipo==='mini'&&el){ el.style.top='calc(7% + 18px)'; }
  // campo mantido
}

function addPiloto() {
  const nome = document.getElementById('inpPiloto').value.trim().toUpperCase();
  if (!nome) {
    ['relExtras','legoRelExtras'].forEach(function(id){
      var _w=document.getElementById(id);
      if(_w)_w.querySelectorAll('.rel-piloto').forEach(function(el){el.remove();});
    });
    return;
  }

  const fontB64 = 'T1RUTwAMAIAAAwBAQ0ZGIHiWjEwAAA3kAAHAq0dQT1Phd7gMAAHOkAAAKIJHU1VCuP+4/gAB9xQAAAAwT1MvMmm6BvcAAAEwAAAAYGNtYXA85j7qAAAEhAAABjRoZWFkHLHTOAAAAMwAAAA2aGhlYQhCBDgAAAEEAAAAJGhtdHjwwwSkAAAK2AAAAwxtYXhwAMNQAAAAASgAAAAGbWV0YVS9LasAAfdEAAATem5hbWVaqtShAAABkAAAAvFwb3N0AAMAAAAACrgAAAAgAAEAAAABAADroP6/Xw889QADA+gAAAAA3IzHswAAAADcjMez/4L+7wT/BAIAAAADAAIAAQAAAAAAAQAAAvD/OAAABOb/gv9WBc0AAQAAAAAAAAAAAAAAAAAAAMMAAFAAAMMAAAAEAowBkAAFAAACigK7AAAAjAKKArsAAAHfADEBAgAAAAAAAAAAAAAAAIAAAAcAAAACAAAAAAAAAABYWFhYAEAAACCsAvD/OAAABAIBEQAAAAMAAAAAAoECvAAgACAAAgAAABYBDgABAAAAAAABAAgAAAABAAAAAAACAAcACAABAAAAAAADABUASAABAAAAAAAEAAgADwABAAAAAAAFACIAJgABAAAAAAAGAA8AFwABAAAAAAAIAAcAXQABAAAAAAAJAAwAZAABAAAAAAAMACIAcAABAAAAAAAQAAgAkgABAAAAAAARAAcAmgADAAEECQABABAAoQADAAEECQACAA4AsQADAAEECQADACoBMQADAAEECQAEABAAvwADAAEECQAFAEQA7QADAAEECQAGAB4AzwADAAEECQAIAA4BWwADAAEECQAJABgBaQADAAEECQAMAEQBgQADAAEECQAQABABxQADAAEECQARAA4B1URlc2lnbmVyUmVndWxhckRlc2lnbmVyRGVzaWduZXJSZWd1bGFyVmVyc2lvbiAxLjAwNTtGb250c2VsZiBNYWtlciAzLjUuNDEuMDA1O0Rlc2lnbmVyUmVndWxhckFydHl3YXlZZWhvciBMaXNueWlodHRwczovL2NyZWF0aXZlbWFya2V0LmNvbS9hcnR5d2F5RGVzaWduZXJSZWd1bGFyAEQAZQBzAGkAZwBuAGUAcgBSAGUAZwB1AGwAYQByAEQAZQBzAGkAZwBuAGUAcgBEAGUAcwBpAGcAbgBlAHIAUgBlAGcAdQBsAGEAcgBWAGUAcgBzAGkAbwBuACAAMQAuADAAMAA1ADsARgBvAG4AdABzAGUAbABmACAATQBhAGsAZQByACAAMwAuADUALgA0ADEALgAwADAANQA7AEQAZQBzAGkAZwBuAGUAcgBSAGUAZwB1AGwAYQByAEEAcgB0AHkAdwBhAHkAWQBlAGgAbwByACAATABpAHMAbgB5AGkAaAB0AHQAcABzADoALwAvAGMAcgBlAGEAdABpAHYAZQBtAGEAcgBrAGUAdAAuAGMAbwBtAC8AYQByAHQAeQB3AGEAeQBEAGUAcwBpAGcAbgBlAHIAUgBlAGcAdQBsAGEAcgAAAAAAAAEAAwABAAAADAAEBigAAAGGAQAABwCGAAAACgANACAAIQAiACMAJAAlACYAJwAoACkAKgArACwALQAuAC8AMAAxADIAMwA0ADUANgA3ADgAOQA6ADsAPAA9AD4APwBAAEEAQgBDAEQARQBGAEcASABJAEoASwBMAE0ATgBPAFAAUQBSAFMAVABVAFYAVwBYAFkAWgBbAFwAXQBfAGEAYgBjAGQAZQBmAGcAaABpAGoAawBsAG0AbgBvAHAAcQByAHMAdAB1AHYAdwB4AHkAegB7AHwAfQCgAKEAogCjAKUApwCpAKoAqwCtAK4AsACyALMAtwC5ALoAuwC/AMAAwQDCAMMAxADFAMYAxwDIAMkAygDLAMwAzQDOAM8A0QDSANMA1ADVANYA1wDYANkA2gDbANwA3QDfAOAA4QDiAOMA5ADlAOYA5wDoAOkA6gDrAOwA7QDuAO8A8QDyAPMA9AD1APYA+AD5APoA+wD8AP0A/wExAVIBUwFgAWEBeAF+IBMgFCAYIBkgGiAcIB0gHiAgICIgJiA5IDogrP//AAAAAAAKAA0AIAAhACIAIwAkACUAJgAnACgAKQAqACsALAAtAC4ALwAwADEAMgAzADQANQA2ADcAOAA5ADoAOwA8AD0APgA/AEAAQQBCAEMARABFAEYARwBIAEkASgBLAEwATQBOAE8AUABRAFIAUwBUAFUAVgBXAFgAWQBaAFsAXABdAF8AYQBiAGMAZABlAGYAZwBoAGkAagBrAGwAbQBuAG8AcABxAHIAcwB0AHUAdgB3AHgAeQB6AHsAfAB9AKAAoQCiAKMApQCnAKkAqgCrAK0ArgCwALIAswC3ALkAugC7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pRwE//qWBR0AAAaBDx0AAAgGEYsdAAHAqxIAxQIAAQAjACsAMgA3AEAASQBOAFQAXABmAGwAcwB8AIcAkACaAKIApgCrALEAtwC8AMAAwwDGAMsAzwDTANYA2wDgAOQA6QDyAPYA+wECAQoBDAENAQ4BDwEQAREBEgETARQBFQEWARcBGAEZARoBGwEcAR0BHgEfASABIQEiASMBJAElASYBMQE6AUYBUAFRAVIBUwFUAVUBVgFXAVgBWQFaAVsBXAFdAV4BXwFgAWEBYgFjAWQBZQFmAWcBaAFpAWoBcwF+AYgBmAGiAaYBrgGxAbgBwQHMAdkB4wHtAfMB/gILAhkCJAIwAj4CSgJQAlYCYQJnAnACdQJ3An8ChQKLApYCnwKlAqsCtgK/AsUCywLRAtwC4gLrAvMC+QL/AwUDEAMZAx8DKQMvAzUDQANGA08DVANWA14DZANqA3UDfgOEA4oDlQOeA6QDqgOwA7sDwQPKA9AD1gPcA+cD8AP2A/8EBwQJBAsEEQQXBCAEJgQsBDIEOwRFBFMEXwRsBHgEfgSEBIwEmQSnBKtWZXJzaW9uIDEuMDA1O0ZvbnRzZWxmIE1ha2VyIDMuNS40RGVzaWduZXJSZWd1bGFyLm51bGxjb250cm9sTEZjb250cm9sQ1JzcGFjZWV4Y2xhbXF1b3RlZGJsbnVtYmVyc2lnbmRvbGxhcnBlcmNlbnRhbXBlcnNhbmRxdW90ZXNpbmdsZXBhcmVubGVmdHBhcmVucmlnaHRhc3Rlcmlza3BsdXNjb21tYWh5cGhlbnBlcmlvZHNsYXNoemVyb29uZXR3b3RocmVlZm91cmZpdmVzaXhzZXZlbmVpZ2h0bmluZWNvbG9uc2VtaWNvbG9ubGVzc2VxdWFsZ3JlYXRlcnF1ZXN0aW9uYXRBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmJyYWNrZXRsZWZ0YmFja3NsYXNoYnJhY2tldHJpZ2h0dW5kZXJzY29yZWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6YnJhY2VsZWZ0dmVydGljYWxiYXJicmFjZXJpZ2h0bm9uYnJlYWtpbmdzcGFjZWV4Y2xhbWRvd25jZW50c3Rlcmxpbmd5ZW5zZWN0aW9uY29weXJpZ2h0b3JkZmVtaW5pbmVndWlsbGVtb3RsZWZ0c29mdGh5cGhlbnJlZ2lzdGVyZWRkZWdyZWV0d29zdXBlcmlvcnRocmVlc3VwZXJpb3JwZXJpb2RjZW50ZXJlZG9uZXN1cGVyaW9yb3JkbWFzY3VsaW5lZ3VpbGxlbW90cmlnaHRxdWVzdGlvbmRvd25BZ3JhdmVBYWN1dGVBY2lyY3VtZmxleEF0aWxkZUFkaWVyZXNpc0FyaW5nQUVDY2VkaWxsYUVncmF2ZUVhY3V0ZUVjaXJjdW1mbGV4RWRpZXJlc2lzSWdyYXZlSWFjdXRlSWNpcmN1bWZsZXhJZGllcmVzaXNOdGlsZGVPZ3JhdmVPYWN1dGVPY2lyY3VtZmxleE90aWxkZU9kaWVyZXNpc211bHRpcGx5T3NsYXNoVWdyYXZlVWFjdXRlVWNpcmN1bWZsZXhVZGllcmVzaXNZYWN1dGVnZXJtYW5kYmxzYWdyYXZlYWFjdXRlYWNpcmN1bWZsZXhhdGlsZGVhZGllcmVzaXNhcmluZ2FlY2NlZGlsbGFlZ3JhdmVlYWN1dGVlY2lyY3VtZmxleGVkaWVyZXNpc2lncmF2ZWlhY3V0ZWljaXJjdW1mbGV4aWRpZXJlc2lzbnRpbGRlb2dyYXZlb2FjdXRlb2NpcmN1bWZsZXhvdGlsZGVvZGllcmVzaXNvc2xhc2h1Z3JhdmV1YWN1dGV1Y2lyY3VtZmxleHVkaWVyZXNpc3lhY3V0ZXlkaWVyZXNpc2RvdGxlc3NpT0VvZVNjYXJvbnNjYXJvbllkaWVyZXNpc3pjYXJvbmVuZGFzaGVtZGFzaHF1b3RlbGVmdHF1b3RlcmlnaHRxdW90ZXNpbmdsYmFzZXF1b3RlZGJsbGVmdHF1b3RlZGJscmlnaHRxdW90ZWRibGJhc2VkYWdnZXJidWxsZXRlbGxpcHNpc2d1aWxzaW5nbGxlZnRndWlsc2luZ2xyaWdodEV1cm8AAAABigGLAYwBjQGOAY8BkAGRAZIBkwGUAZUBlgGXAZgBmQGaAZsBnAGdAZ4BnwGgAaEBogGjAaQBpQGmAacBqAGpAaoBqwGsAa0BrgGvAbABsQGyAbMBtAG1AbYBtwG4AbkBugG7AbwBvQG+Ab8BwAHBAcIBwwHEAcUBxgHHAcgByQHKAcsBzAHNAc4BzwHQAdEB0gHTAdQB1QHWAdcB2AHZAdoB2wHcAd0B3gHfAeAB4QHiAeMB5AHlAeYB5wHoAekB6gHrAewB7QHuAe8B8AHxAfIB8wH0AfUB9gH3AfgB+QH6AfsB/AH9Af4B/wIAAgECAgIDAgQCBQIGAgcCCAIJAgoCCwIMAg0CDgIPAhACEQISAhMCFAIVAhYCFwIYAhkCGgIbAhwCHQIeAh8CIAIhAiICIwIkAiUCJgInAigCKQIqAisCLAItAi4CLwIwAjECMgIzAjQCNQI2AjcCOAI5AjoCOwI8Aj0CPgI/AkACQQJCAkMCRAJFAkYCRwJIAkkCSgJLAMMDAAABAAC0AAC2AAC4AAC6AAC9AAImAAOPAAtEAA40ABLsABbJABd/ABkBABqDAB4/AB/JACB/ACE1ACHrACKhACP/ACUJACcaACl9ACvBAC3dADIlADQXADhRADqOADv3AD1gAD7OAEDFAEIzAERWAEiQAErAAE1sAE7KAFAoAFIuAFPgAFYFAFgLAFi2AFnAAFucAFymAF6NAGA/AGGdAGNPAGWIAGfrAGn8AGtaAGziAG4+AHBvAHJ1AHP9AHWvAHeFAHg7AHoRAHrHAHwnAH5rAIAHAIHNAIP9AIX4AIhvAIphAIs2AIx+AI6jAI/rAJIbAJQWAJW9AJd6AJovAJzbAJ9dAKDlAKKiAKRzAKc+AKn+AKuwAK1iALEAALHeALVdALVgALbJALlYALzdAMDdAMQ8AMhIAMp4AMzDAMzFANKCANPgANXxANhUANkKANoUANtyAN3TAN/2AOM0AOZ9AOp3AO56APIQAPcfAPtEAP6UAQGoAQTHAQiXAQwDAQ3SAQ+hARIhARQ9ARfCARo5ARy7AR/uASMqASX5ASeDASi5AStPAS3wATFCATQwATbRATlKATvDAT5HAUF8AUS6AUeLAUvVAU6JAVIXAVVVAVieAVyYAWAuAWIcAWQKAWapAWjkAWyyAW9cAXIRAXV3AXjmAXvoAX09AYAIAYLeAYZlAYmIAYxeAY+BAZBWAZLGAZV0AZlPAZ2QAaB+AaPvAaSlAaVbAaYRAabHAad9AajmAapPAau4Aa3oAa6eAbC6AbHhAbMTAbZX+KP/ADIAAP8CvAAAFf8AAAAA//1EAAAF/wGrAAD/AAAAAAX/AAAAAP8CvAAABf/+cQAA///sAAAV/wFzAAD/AAAAAAX//0YAAP/+ywAABf//9AAA///rAAAV//9MAAD//tMAAAX/AAAAAP8CWQAABf8AwQAA//6/AAAV/wC5AAD//swAAAX//o4AAP8AAAAABf8AxQAA/wFJAAAV/wC1AAD/AS4AAAX/AAAAAP/9owAABQ6LDosOiw74UQ731f8AyLM+/wDR4UgV//98D1z/AAAAAAX//+oo9v8AAAAA///rMKT//+6euP///BcK///qij0I///pgo///3vKPQX///wcKf//6qFI/wAOlHv//+6Hrv8AFdcK/wAAAAAI/wCEBR//AAAAAAX/ABW9cf8AAAAA/wAU5mb/ABF4Uv8AA89c/wAVXrgI/wAWfXH/AIQ1wwX/AAPrhf8AFY9c///xa4X/ABFHrv//6ij2/wAAAAAI/wBY0ez/AelKPRX//3wPXP8AAAAABf//6kKP/wAAAAD//+sZmv//7p64///8FHv//+qhSAj//78mZv/+mVmaBf///Bma///qoUj/AA6XCv//7oeu/wAV1Hv/AAAAAAj/AIPwpP8AAAAABf8AFdR7/wAAAAD/ABTPXP8AEXhS/wAD6Pb/ABVeuAj/AEDzM/8BZqZmBf8AA89c/wAVXrj///GCj/8AEWFI///qEez/AAAAAAgO+Er/AeIIUP8DIeuFFf//pMUf/wAAAAAF///pUez/AAAAAP//6kKP///tnCn///wAAP//6VR7CP//3ozN//9BtcMF///88KT//+6Hrv8AC564///yD1z/ABFHrv8AAAAACP8AOfhS/wAAAAAF/wATDM3/AAAAAP8AEsUf/wANGZr/AAe1w/8AEn1xCP8ASvrh/wC0cKQF/wAKsKT/ABoCj///8MKP/wAYuFL//+VUe/8AAAAACP//BoKP/wAAAAAV//+kwo//AAAAAAX//+lUe/8AAAAA///qQo///+2cKf///AKP///pVHsI///eij3//0G1wwX///zwpP//7oeu/wALnrj///IPXP8AEUeu/wAAAAAI/wA5+FL/AAAAAAX/ABMMzf8AAAAA/wASxR//AA0Zmv8AB7XD/wASfXEI/wBK+uH/ALRwpAX/AAquFP8AGgKP///wxR//ABi4Uv//5VR7/wAAAAAIDvkV/wJoNk7/AeRCjxX//8HmZv///+Zm///VNcP////rhf//4OuF////6PYI/wAPUez/AFSUe/8ACkzN/wA3MzP/AAH4Uv8ACuuFCP8AAXrh/wAIIUj///qAAP8ABpR7///3uuH/AAAAAAj//83uFP8AAAAABf//97hS/wAAAAD///gcKf//+WuF///+hR////feuAj///9AAP//++PX///6x67//+ReuP//6lma//+Ix64I///5eFL////64f//+dwp/////XH///lUe/////hSCP//8auF////+uH///K1w/////hS///zrhT////64Qj////9cf8AAAAA/////XH/AAACj/////hS/wAAAAAI///tLhT////64f//7qFI////9cP//++9cf////hSCP8AD164/wBU3Cn/AApR7P8AN1wp/wAB+uH/AArzMwj/AAF9cf8ACCFI///6fXH/AAaUe///97rh/wAAAAAI///N7hT/AAAAAAX///e64f8AAAAA///4HCn///lrhf///oKP///33rgI////Qo////vhSP//+sKP///kVHv//+pMzf//iHhSCP//joUf////wo///+54Uv///9wp///73Cn/AAAAAAj///e4Uv////hS///4I9f///lmZv///oo9///33CkI///3K4X//861wwX///6Mzf//99ma/wAFgo////luFP8ACEKP/wAAB64I/wALDM3/AAACj/8AJv1x/wAAMzP/AFTuFP8AACj2CP///Sj2///wT1z///0AAP//72FI///8xR///+4o9gj/AAAAAP////1x/wAAAAD////4Uv8AAAAA/////XEI///9z1z///PhSP///aFI///y7hT///1wpP//8ePXCP///tHs///5eFL///7R7P//+WuF///+sKT///io9gj//45R7P///8KP///ucKT////cKf//+964/////XEI///3uuH////4Uv//+CFI///5Zmb///6Mzf//99wpCP//9yuF///OtcMF///+ij3///fZmv8ABYUf///5bhT/AAhCj/8AAAeuCP8ACxR7/wAAAo//ACcZmv8AADMz/wBVTM3/AAAo9gj///nMzf//3UAA///3fXH//9CAAP//85wp//+7czMI///+go////feuP8ABYo9///5Zmb/AAhHrv8AAAAACP8AMgeu/wAAAAAF/wAISj3/AAAAAP8AB+FI/wAGlHv/AAF64f8ACCZmCP8AAMUf/wAETM3/AAJAAP8ADzMz/wANSj3/AElXCgj/AAACj/8AAAo9/wAAB67/AAAKPf8AAAKP/wAAB64I/wAAcKT/AAJrhf8ABCZm/wAW9cP/AAXmZv8AIJR7CP8AIYAA/wAAD1z/ACgj1/8AABHs/wAmY9f/AAAR7Aj///nFH///3Rwp///3dcP//9BUe///85ma//+7cKQI///+hR////fcKf8ABYo9///5aPb/AAhFH/8AAAAACP8AMgeu/wAAAAAF/wAISj3/AAAAAP8AB+FI/wAGlHv/AAF64f8ACCZmCP8AAMUf/wAETM3/AAJCj/8ADzMz/wANR67/AElXCgj/AAACj/8AAAo9/wAAB67/AAAHrv8AAAKP/wAACj0I/wAAcKT/AAJuFP8ABC4U/wAXHrj/AAXuFP8AIMUfCP8AIczN/wAAD1z/ABfo9v8AAAzN/wACfXH/AAAAAAj/AAAHrv8AAAAA/wAACj3/AAAHrv8AAAzN/wAAAAAI/wBKij3/AAAj1////LXD/wAAI9f/AARcKf8AAAAACP8ACEUf/wAABR//AAfeuP8ABpwp/wABeFL/AAgmZgj/AAjR7P8AMUKPBf8AAXXD/wAIJmb///qAAP8ABpma///3uuH////64Qj//8JPXP///+Zm///VKPb////rhf//4Meu////6PYI/wAGzM3/ACWR7P8ABx64/wAnUez/AAX1w/8AIOuFCP8AIeZm/wAAD1z/ABf64f8AAAzN/wACgAD/AAAAAAj/AAAHrv8AAAAA/wAACj3/AAAHrv8AAAzN/wAAAAAI/wBKjM3/AAAmZv///LMz/wAAIUj/AARcKf8AAAAACP8ACEUf/wAABR//AAfeuP8ABpwp/wABeFL/AAgmZgj/AAjR7P8AMUKPBf8AAXXD/wAII9f///qAAP8ABpma///3uuH////64Qj//xCR7P//fiZmFf///d64///0MzP///2wpP//80o9///9h67///JUewj///7Hrv//+Uo9///+x67///kzM////qPX///4T1wI///449f////4Uv//+YUf////+uH///jmZv////rhCP//8hwp////+uH///MUe/////hS///0AAD////64Qj////9cf8AAAAA/////XH/AAACj/////hS/wAAAAAI///tRR/////64f//7rMz////9cP//+/R7P////rhCP8ABszN/wAlkez/AAchSP8AJ1ma/wAF+FL/ACD9cQj/ACFj1/8AAA9c/wAoAAD/AAAR7P8AJk9c/wAAFHsI///9I9f///A1w////Prh///vSj3///zAAP//7gUfCP////1x////+uH/AAACj/////rh/wAAAAD////9cQgO+cP/Avjew/8Cu4o9Ff//Qso9/wAAAAAF/wAHD1z/ACcKPQX/AAPPXP8AFY9c///xa4X/ABF4Uv//6ij2/wAAAAAI//97a4X/AAAAAAX//+oUe/8AAAAA///rFwr//+6KPf///DCk///qh64I///47hT//9jcKQX//74XCv8AAAAABf//mW4U/wAAAAD//54R7P//rjrh///tx67//5szMwj///MXCv//uKPXBf//7co9//+bGZr/AERhSP//rlR7/wBmlHv/AAAAAAj/ATvPXP8AAAAABf8ADRma/wAAAAD/AAi64f//9Zma///9rhT///MUewj///oR7P//3u4UBf///auF///zFHv///NzM///9ZcK///y64X/AAAAAAj//kjcKf8AAAAABf//6iuF/wAAAAD//+swpP//7qFI///8Fwr//+qKPQj//+zwpP//lnMzBf///Bwp///qij3/AA6Ue///7qFI/wAV1wr/AAAAAAj/AMjcKf8AAAAABf//9b1x///HQAAF///8MKT//+pwpP8ADpcK///uhR//ABXUe/8AAAAACP8AhJcK/wAAAAAF/wAV64X/AAAAAP8AFOj2/wAReFL/AAPPXP8AFXhSCP8ACkUf/wA42ZoF/wAtnCn/AAAAAAX/AAAAAP///+PXBf8AFHCk/wAAAAAF/wBmkez/AAAAAP8AYe4U/wBRwo//ABI4Uv8AZMzNCP8AC8zN/wBBaPYF/wASNcP/AGTR7P//u5wp/wBRwAD//5luFP8AAAAACP/+xDXD/wAAAAAF///y5mb/AAAAAP//90KP/wAKZmb/AAJR7P8ADOuFCP8AB/1x/wAsCj0F/wACT1z/AAzrhf8ADIzN/wAKZmb/AA0Zmv8AAAAACP8BqzXD/wAAAAAF/wAV1wr/AAAAAP8AFMzN/wARYUj/AAPo9v8AFXMzCP8AEjXD/wBkij0F/wAD7hT/ABWR7P//8Wj2/wARYUj//+omZv8AAAAACA75z/8AfoI8/wGG5mYV/wCyWZr/AAAAAAX/AC3Ue/8AAAAA/wAr5mb/ACSo9v8ACCFI/wAtDM0I/wAa49f/AJTKPQX/AAPzM/8AFePX///7B67/ABScKf//8weu/wAPh64I///zAo//AA+KPf//7I9c/wAIj1z//+muFP8AAAAACP//Taj2/wAAAAAF///SK4X/AAAAAP//1Bwp///bXCn///fcKf//0vMzCP//5Rwp//9rNcMF///8Cj3//+oZmv8ABPhS///rY9f/AAz1w///8HhSCP8ADP1x///wdcP/ABNzM///924U/wAWUez/AAAAAAj/ADRwpP8A3QUfFf8AAPCk/wAFFwr/AAUAAP8ABCuF/wAFMKT/AAAAAAj/AIZCj/8AAAAABf8AAmPX/wAAAAD/AAImZv///xHs/wABYUj///5XCgj/AAFcKf///mZm/wAAij3///264f///5Hs///9pmYI///oxR///39CjwX/AAAAAP////1xBf///xcK///65mb///sCj///+9ma///6x67/AAAAAAj//3mwpP8AAAAABf///ZcK/wAAAAD///3XCv8AAPCk///+lHv/AAG4Ugj///6zM/8AAYUf////eFL/AAJMzf8AAG4U/wACVwoI/wIiNcP//1VuFBX//02mZv8AAAAABf//0iuF/wAAAAD//9QZmv//21ma///33rj//9LzMwj//+UcKf//azXDBf///AzN///qHCn/AAT4Uv//62PX/wAM9cP///B4Ugj/AAz9cf//8HXD/wATcKT///dwpP8AFk9c/wAAAAAI/wCyXCn/AAAAAAX/AC3Ue/8AAAAA/wAr49f/ACSj1/8ACCPX/wAtCj0I/wAa49f/AJTPXAX/AAP1w/8AFeZm///7B67/ABScKf//8wo9/wAPh64I///zAo//AA+Hrv//7IzN/wAIj1z//+muFP8AAAAACP//y6FI//8kI9cV/wAAAAD////64QX///8XCv//+uPX///7Ao////vUe///+seu/wAAAAAI//95sKT/AAAAAAX///2cKf8AAAAA///93Cn/AADuFP///qj2/wABmZoI///+nrj/AAGo9v///3Mz/wACSj3/AABuFP8AAlR7CP8AF0Uf/wCAwo8F/wAA5mb/AAUZmv8ABP1x/wAEI9f/AAU4Uv8AAAAACP8AhkKP/wAAAAAF/wACY9f/AAAAAP8AAij2////Eez/AAFR7P///mj2CP8AAWPX///+VHv/AACMzf///bXD////kez///2rhQj/AH9mZv8B3XrhFf///sUf/wAC4Uj///1j1/8AAbXD///84Uj/AAAAAAj//7HUe/8AAAAABf//7tHs/wAAAAD//+9R7P//+OFI///0Fwr///OZmgj//XxeuP/9YNHsBf///dR7///9uuH///9wpP///OuF/wABOuH///0euAj/AAE64f///R64/wACmZr///5Hrv8AAyPX/wAAAAAI/wBOK4X/AAAAAAX/ABErhf8AAAAA/wAQrhT/AAceuP8AC+uF/wAMaPYI/wKDnrj/Ap8rhQX/AAIrhf8AAkUf/wAAjM3/AAMPXP///seu/wAC6PYIDvml/wLnZn3/AbPCjxX//lpFH/8AAAAABf//7MUf/wAAAAD///NFH/8AD4KP/wADVwr/ABM9cQj/AANwpP8AE2j2Bf8AA1cK/wATOuH/ABJmZv8AD5wp/wATPXH/AAAAAAj/AToKPf8AAAAABf8AD7Mz/wAAAAD/AAy64f8ADKPX/wAASj3/AA+1wwj/AAEcKf8AUt64///DOuH/AD8uFP//qVHs/wAAAAAI//8TVwr/AAAAAAX//5+mZv8AAAAA//+kMzP//7HzM///7wAA//+fpmYI///4wo///9bAAAX/AAAZmv8AAAAABf///Bma///pOuEF/wAALhT///5XCv///1ma///+gAD///+j1////lcKCP//+d64///clwr/AAhCj///3/XD/wARwAD//+dHrgj///hMzf//+p64///seFL///B4Uv//7f1x///h/XEI///7Eez///io9v//+71x///4MKT///x1w///+AKPCP//+3Mz///1x67///x4Uv//9VHs///9HCn///UHrgj///01w///9m4U///9gAD///WuFP///gzN///08zMI////z1z///8R7P///+j2////QAD////o9v///xR7CP///QUf///vAAAF///7cKT//+ZZmgX////j1/8AAAAABf///TXD///wT1z///9Zmv//8Nma/wABHCn///FmZgj/AAZUe///sbMz/wA88zP//8YcKf8AVKPX/wAAAAAI/wD9j1z/AAAAAAX/AFwrhf8AAAAA/wBYRR//AESo9v8AG2j2/wBY64UI/wACa4X/AAfmZv8AAfMz/wAH/XH/AAF9cf8ACC4UCP8AA4eu/wATyj0F/wAEdcP/ABlcKQX////mZv8AAAAABf8AAgzN/wALnrj/AAEeuP8ACrCk/wAAjM3/AAnZmgj/AABHrv8AA7XD////z1z/AANzM/8AABcK/wADnCkI/wBNq4X/AAAAAAX/AAtXCv8AAAAA/wAJkez/AAgXCv8AAgo9/wALI9cI/wAVFwr/AHd64QX/AAKFH/8ADk9c///1B67/AA0Cj///8Zma/wAAAAAI//7IFwr//zc4UhX///zCj///7YKPBf///KZm///sxR///+2cKf//8GPX///swo//AAAAAAj//4IAAP8AAAAABf//7MUf/wAAAAD///Mrhf8AD5wp/wADVwr/ABM64Qj/AANCj/8AEn1xBf8AA1ma/wATOuH/ABJj1/8AD5wp/wATPXH/AAAAAAj/AH39cf8AAAAABf8AEzrh/wAAAAD/AAzUe///8GPX///8pmb//+zFHwgO92X/APCF1v8DIeuFFf//pMUf/wAAAAAF///pVHv/AAAAAP//6kKP///tnCn///wAAP//6VR7CP//3o9c//9BtcMF///88KT//+6Hrv8AC5wp///yD1z/ABFHrv8AAAAACP8AOfrh/wAAAAAF/wATCj3/AAAAAP8AEseu/wANGZr/AAezM/8AEn1xCP8ASv1x/wC0cKQF/wAKqPb/ABoCj///8MUf/wAYuFL//+VUe/8AAAAACA736v8BRgHy/wLDAAAV///4MzP/AAF64f///DMz/wAA1Hv///guFP8AAYAACP//3XCk/wAGyj3//+6euP8AA24U///dbhT/AAbeuAj///gzM/8AAYAA///8MzP/AADUe///+DCk/wABgAAI///rR67/AAQUe///6Aeu///wHrj///e64f//6E9cCP//n9cK//7s4Uj//+ZCj///cWFI///88KT//uw64Qj///+4Uv//6DhS/wASNcP///AcKf8AFjMz/wAEFwoI/wAIRR//AAGUe/8ABC4U/wAAvXH/AAhcKf8AAX1xCP8AJP1x/wAG49f/ABJ64f8AA1R7/wAlFHv/AAbj1wj/AAhFH/8AAZR7/wAEFHv/AAC9cf8ACFwp/wABfXEI/wAWHrj/AAQXCv8AEb1x/wAUij3/AABFH/8AFVwpCP8AAuFI/wD3zM3/ABc9cf8AgDrh/wBWZmb/APcj1wj/AAdwpP8AFVR7///1szP/ABSHrv//60Uf/wAEGZoIDvfq/wEW2/D/AturhRX///e64f///oKP///7z1z///8rhf//96Zm///+fXEI///bBR////khSP//7YUf///8pmb//9rrhf//+SFICP//97rh///+go////vMzf///yuF///3qPb///6Cjwj//+nhSP//++Zm///uQAD//+t1w////71x///qoUgI///9Hrj//wgzM///6MKP//9/x67//6mXCv//CNmaCP//+JR7///quuH/AApKPf//63XD/wAUvXH///vrhQj/AAfMzf///muF/wADzM3///9Cj/8AB89c///+go8I/wAikez///k1w/8AEVwp///8kez/ACKUe///+RwpCP8AB89c///+hR//AAPMzf///yj2/wAHz1z///6Cjwj/ABS1w///++j2/wAX+uH/AA/j1/8ACEUf/wAXsKQI/wBgKPb/ARMcKf8AGb1x/wCOoUj/AAMPXP8BE8UfCP8AAFwp/wAXuFL//+3Hrv8AD+PX///pz1z///vrhQgO+FH/AcXclv8CZsUfFf///IAA/wADYUj///uhSP8AAdcK///63rj////KPQj//5EPXP//+mPXBf8APbXD/wBcaPYF/wACnCn/AAQHrv8AANma/wAE49f///7hSP8ABMKPCP///t64/wAExR////0XCv8ABAAA///7yj3/AAKAAAj//9GR7P8AG71xBf//+89c/wACgAD///sR7P8AAK4U///7Sj3///61wwj///tFH////rrh///8HCn///zwpP///aPX///7tcMI///KNcP//5qeuAX//8orhf8AZXXDBf///a4U/wAENcP///wZmv8AAw9c///7RR//AAFKPQj///tPXP8AAUUf///7D1z///9Ue///+89c///9gAAI///Rkez//+RFHwX///vHrv///Xrh///9Fwr///wCj////t64///7OuEI///+4Uj///s64f8AANwp///7HCn/AAKmZv//++ZmCP8APaj2//+jqPYF//+RAo//AAWcKQX///tUe/8AAEzN///7PXH///4Zmv///Hrh///8lwoI///8euH///ycKf///hHs///7cKT/AAAAAP//+xwpCP8AAAAA///J64UF/wAAAAD///scKf8AAe4U///7cKT/AAOFH////JcKCP8AA4Uf///8mZr/AASUe////j1x/wAE8KT/AAAmZgj/AG7j1/8ABZwpBf//wko9//+jlwoF///9Y9f///v4Uv///yZm///7HCn/AAEeuP//+0AACP8AARwp///7OuH/AALuFP//+/1x/wAEMzP///19cQj/AC5wpP//5EeuBf8ABDXD///9fXH/AATuFP///09c/wAEsKT/AAFMzQj/AAS64f8AAUeu/wAD49f/AAMPXP8AAlwp/wAESj0I/wA1zM3/AGVhSAX/ADXR7P//moeuBf8AAlHs///7zM3/AAPj1////PCk/wAEuuH///61wwj/AAS4Uv///rMz/wAE64X/AACzM/8ABDXD/wACgAAI/wAuaPb/ABu4UgX/AAQ4Uv8AAoKP/wAC64X/AAQCj/8AAR64/wAEwo8I/wABHCn/AATCj////yZm/wAE49f///1Zmv8ABBmaCP//wlcK/wBcVwoF/wBu+uH///pj1wX/AATcKf///6PX/wAEkez/AAH4Uv8AA4eu/wADZmYI/wADgo//AANmZv8AAfCk/wAEkez/AAAAAP8ABOPXCP8AAAAA/wA2FHsF/wAAAo//AATj1////hHs/wAEkez///x64f8AA2PXCA74j/8ByECC/wG5uuEV//+iFHv/AAAAAAX/ABFwpP8AYhHsBf8AA6FI/wAUVwr///JZmv8AEHXD///ro9f/AAAAAAj//5Eo9v8AAAAABf//66j2////5mb//+yrhf//74zN///8Xrj//+umZgj//+6R7P//nfCkBf//ofhS/wAAAAAF///rpmb/AAAAAP//7JR7///vczP///x4Uv//68KPCP//7GPX//+RI9cF///8kez//+uo9v8ADXhS///vjM3/ABRXCv8AAAAACP8AXgUf/wAAAAAF///ugo///54HrgX///xhSP//66j2/wANpmb//++Mzf8AFEUf////5mYI/wBu1wr////o9gX/ABRCj/8AABcK/wATaPb/ABCHrv8AA564/wAUXCkI/wARgAD/AGH4UgX/AF3rhf8AAAAABf8AFFma/wAAAAD/ABNrhf8AEIzN/wADoUj/ABQ9cQj/ABOZmv8AbtwpBf8AA4eu/wAUVwr///JZmv8AEIo9///ruuH/AAAAAAgO93n/AINS0/8AuGuFFf//pMKP/wAAAAAF///pVHv/AAAAAP//6kKP///tnCn///wCj///6VR7CP//3ozN//9BtcMF///88KT//+6KPf8AC564///yDM3/ABFHrv8AAAAACP8AOfhS/wAAAAAF/wATDM3/AAAAAP8AEsUf/wANGZr/AAe1w/8AEn1xCP8ASvrh/wC0cKQF/wAKqPb/ABoHrv//8MUf/wAYszP//+VXCv8AAAAACA74Ov8BdP9k/wG5sKQV//7byj3/AAAAAAX//+uj1/8AAAAA///slwr//+9zM////HhS///rvXEI///sZmb//5EPXAX///yMzf//66j2/wANeFL//++PXP8AFFwp/wAAAAAI/wEkNcP/AAAAAAX/ABRXCv8AAAAA/wATa4X/ABCKPf8AA6FI/wAUPXEI/wATnCn/AG7cKQX/AANuFP8AFFcK///ybhT/ABCMzf//66j2/wAAAAAIDveG/wCSa1z/ALhrhRX//5EmZv8AAAAABf//649c/wAAAAD//+yuFP//73XD///8Xrj//+vCjwj//+x9cf//kSZmBf///F64///rj1z/AA2R7P//76PX/wAUXCn/AAAAAAj/AG7XCv8AAAAABf8AFFcK/wAAAAD/ABNrhf8AEKFI/wADoUj/ABRCjwj/ABOcKf8AbtmaBf8AA4Uf/wAUWZr///JuFP8AEFcK///rqPb/AAAAAAgO+M7/AlQ6Uv8CuyuFFf//WJHs/wAAAAAF///j7hT/AAAAAP//5eZm///xyj3///DFH///6GZmCP/+a9R7//2M64UF///2bhT///E9cf8ACrCk///seFL/ABGKPf8AAAAACP8Ap3Ck/wAAAAAF/wAcDM3/AAAAAP8AGhwp/wAOOFL/AA89cf8AF5maCP8BlCj2/wJzFHsF/wAJlwr/AA7cKf//9Wj2/wATa4X//+5XCv8AAAAACA75sP8Cb2qB/wLAj1wV//6+D1z/AAAAAAX//5k9cf8AAAAA//+dnCn//63euP//7ceu//+az1wI///C3rj//q364QX//+3KPf//mtR7/wBEkez//63zM/8AZwo9/wAAAAAI/wFBq4X/AAAAAAX/AGbzM/8AAAAA/wBiYUj/AFIMzf8AEh64/wBlK4UI/wA9I9f/AVIFHwX/ABKAAP8AZTCk//+7OuH/AFIhSP//mQzN/wAAAAAI//+L3rj//g64UhX///2Ue///8xR7///zeFL///WAAP//8szN/wAAAAAI//8iZmb/AAAAAAX///LmZv8AAAAA///3Qo//AAqAAP8AAjrh/wAM64UI/wA03rj/ASR9cQX/AAJo9v8ADO4U/wAMo9f/AAp9cf8ADRma/wAAAAAI/wDdgo//AAAAAAX/AA1Hrv8AAAAA/wAIuuH///WAAP///a4U///zFHsIDvgv/wErL2//ACbuFBX/AHFcKf8Cc0KPBf8AA+PX/wAVjM3///FR7P8AEXhS///qK4X/AAAAAAj//wX4Uv8AAAAABf//6hHs/wAAAAD//+sZmv//7oeu///8GZr//+p1wwj//+zzM///lf1xBf///DCk///qbhT/AA59cf//7oeu/wAV7hT/AAAAAAj/ADX9cf8AAAAABf8ADS4U/wAAAAD/AAi9cf//9Zma///9lHv///MUewj//60hSP/+NTXDBf///DCk///qbhT/AA6Ue///7oeu/wAV1wr/AAAAAAj/AISUe/8AAAAABf8AFeuF/wAAAAD/ABTo9v8AEXhS/wAD0ez/ABV1wwgO+cT/AKieRP////rhFf8BzAKP/wAAAAAF/wAUij3////R7AX/ABXuFP8AAAAA/wAUuFL/ABF4Uv8AA7XD/wAVj1wI/wASNcP/AGno9gX/AAOeuP8AFZHs///xVHv/ABF1w///6g9c/wAAAAAI//5HUez/AAAAAAX///LmZv8AAAAA///2/XH/AAqCj/8AAlHs/wAM6PYI/wAF2Zr/ACEuFAX/AAIj1/8ADOuF/wAMczP/AAp9cf8ADTCk/wAAAAAI/wE87hT/AAAAAAX/AGbzM/8AAAAA/wBhpmb/AFImZv8AEV64/wBlFHsI/wAMRR//AEemZgX/ABFhSP8AZUUf//+6sKT/AFIhSP//mQzN/wAAAAAI//4rQo//AAAAAAX//+oPXP8AAAAA///rR67//+6Hrv///Eo9///qczMI///uuFL//5sXCgX///xeuP//6nCk/wAOrhT//+6Hrv8AFe4U/wAAAAAI/wGsyj3/AAAAAAX/AA0cKf8AAAAA/wAI64X///WZmv///cUf///zFHsI///4Xrj//9PHrgX///3euP//8xR7///zjM3///WAAP//8szN/wAAAAAI//7DEez/AAAAAAX//5kR7P8AAAAA//+ebhT//63zM///7oeu//+a1HsI///0q4X//75R7AX//+6Hrv//muj2/wBFaPb//63Zmv8AZvCk/wAAAAAIDvmn/wLycib/Ab81wxX/AAxFH/8AR6PXBf8AEXrh/wBlMKT//7qrhf8AUiFI//+ZD1z/AAAAAAj//itAAP8AAAAABf//6hR7/wAAAAD//+tHrv//7oeu///8R67//+pzMwj//+664f//mxcKBf///F64///qcKT/AA6uFP//7oeu/wAV64X/AAAAAAj/AazMzf8AAAAABf8ADTCk/wAAAAD/AAjUe///9Zma///9xR////MUewj///hhSP//08euBf///cUf///zFHv///OMzf//9YAA///y5mb/AAAAAAj//xNAAP8AAAAABf//6lma/wAAAAD//+tKPf//7nCk///8MKT//+pCjwj///twpP//5nMz///6Vwr//99j1///+3Ck///mWZoI///8MKT//+pXCv8ADoAA///uXCn/ABWmZv8AAAAACP8A7Lrh/wAAAAAF/wANMzP/AAAAAP8ACLrh///1gAD///2uFP//8xR7CP//9+j2///T3CkF///9sKT///MUe///81ma///1mZr///LmZv8AAAAACP/+UzXD/wAAAAAF///qFHv/AAAAAP//6zCk///uhR////wCj///6nMzCP//7bCk//+bFwoF///8Fwr//+pzM/8ADpR7///uh67/ABXwpP8AAAAACP8B1Lrh/wAAAAAF/wBm8zP/AAAAAP8AYkzN/wBSIUj/ABJPXP8AZUeuCP8ADOj2/wBHo9cF/wAGgo//ACPFH///+Wj2/wAgI9f///L64f8AHA9cCP8AFwo9/wAcJmb/ABHXCv8AICj2/wAGI9f/ACPhSAgO+cf/Atgzj/8BHQzNFf8AL8KP/wEGMKQF/wAD5mb/ABWR7P//8Wj2/wAReFL//+oR7P8AAAAACP//e4AA/wAAAAAF///qEez/AAAAAP//6xma///uhR////wXCv//6nCkCP//0Jwp//77TM0F//8uZmb/AADAAAX/AAAAAP8AAAAA/wBBhR//AFgUe/8AABR7/wAAeFII/wDInCn/AQ2hSAX/AAhzM/8AC1R7/wABTM3/AA8mZv//+a4U/wAMoUgI///5fXH/AAyj1///8xcK/wAH/XH///HhSP8AAAAACP//Wa4U/wAAAAAF///zRR//AAAAAP//9Bwp///58zP///iPXP//9f1xCP8AAAAA/wAAAAD//wLo9v/+q0o9/wAAAAD////mZgj//+6euP//6JcK///u6Pb//+g4Uv//7kAA///o3CkI///vGZr//+nhSP//8Qo9///qij3///sR7P//5CFICP//9Trh///DCj0F///8GZr//+oUe/8ADmZm///uKPb/ABV1w////+j2CP8By4zN///+I9cF///0qPb//78mZgX///wcKf//6m4U/wAOlHv//+6Hrv8AFeuF/wAAAAAI/wCEgAD/AAAAAAX/ABXrhf8AAAAA/wAU6Pb/ABF64f8AA+Zm/wAVj1wI/wALJmb/AEAZmgX/ABVeuP8AAC4U/wAUWZr/ABFhSP8AA+Zm/wAV1woI/wASNcP/AGc4UgX/AAO1w/8AFVwp///yK4X/ABDo9v//6164/wABBR8IDvnJ/wJdMJH/AbZAABX//tdUe/8AAAAABf//8szN/wAAAAD///dHrv8ACoAA/wACT1z/AAzrhQj/AAXzM/8AISuFBf8AAlR7/wAM64X/AAyhSP8ACoAA/wANGZr/AAAAAAj/AaRuFP8AAAAABf8AFeuF/wAAAAD/ABTo9v8AEXrh/wAD5mb/ABWMzQj/ABMj1/8AaeuFBf8AA+Zm/wAVkez///FUe/8AEVwp///qKPb/AAAAAAj//+t1w/8AAAAABf8AAAAA////64UF//3QlHv///8R7AX//9qPXP///+Zm///cUez//+G4Uv//+WZm///ajM0I///JAo///shHrgX///r4Uv//45Hs/wATD1z//+jcKf8AHG4U/wAAAAAI/wGujM3////o9gX/AA0zM/8AAAAA/wAIuFL///WAAP///bCk///zFwoI///4Ao///9PFHwX///2rhf//8xR7///zXCn///WZmv//8uZm/wAAAAAI//4yOuH/AAAAAAX//+oR7P8AAAAA///rMzP//+6FH////AAA///qczMI///tsKT//5sXCgX///wwpP//6nMz/wAOfXH//+6Hrv8AFe4U/wAAAAAI/wH1uFL/AAAAAAX/AGbzM/8AAAAA/wBiTM3/AFIhSP8AEk9c/wBlR64I/wAM64X/AEej1wX/ABI1w/8AZRR7//+7bhT/AFIj1///mQzN////+uEIDvnM/wJiRGv/AbZFHxX//sMUe/8AAAAABf//8szN/wAAAAD///dFH/8ACoAA/wACUez/AAzo9gj/AAXwpP8AIS4UBf8AAlR7/wAM6Pb/AAyj1/8ACoKP/wANGZr/AAAAAAj/Aa3PXP8AAAAABf8AFfCk/wAAAAD/ABTPXP8AEXhS/wAD/XH/ABWPXAj/ABMj1/8Aaej2Bf8AA8zN/wAVkez///Frhf8AEV64///qKPb/AAAAAAj//+t64f8AAAAABf8AAAAA////6Pb//j7Zmv8AAAAA/wAAAAD/AAAAAAj//5kMzf8AAAAA//+dtcP//63cKf//7bCk//+a6PYI///4euH//9YZmgX////o9v8AAAAA///L3rj//tgo9v8AAAAA/wAAAAAI///+eFL///dMzf///xHs///3MzP///+64f//9y4UCP///31x///vZmb/AAHmZv//70o9/wAElwr///AFHwj/AARPXP//8Prh/wAGq4X///Go9v8ACN64///zHrgI/wAItcP///NXCv8ACtHs///0z1z/AAxcKf//9twpCP8ADLrh///2lHv/AA5Mzf//+Meu/wAPEez///shSAj/AAfuFP///XCk/wAIJmb///4XCv8ACDrh///+tcMI/wAERR////9XCv8ABEo9////gAD/AARPXP///6j2CP8ABG4U////o9f/AARuFP///5wp/wAEcKT///+9cQj/ABjAAP///o9c/wAY1Hv/AAD1w/8AGMeu/wAAAAAI/wAMjM3/AAAAAP8ADI9c/wAAAAD/AAyMzf8AAAAACP8ADbhS/wAAAAD/AA264f8AAAAA/wANuFL/AAAAAAj/AA4wpP8AAAAA/wAOLhT/AAAAAP8ADjCk/wAAAAAI/wAN8KT/AAAAAP8ADfCk/wAAAAD/AA3zM/8AAAAACP8ADP1x/wAAAAD/AA0AAP8AAAAA/wAM/XH/AAAAAAj/AAtXCv8AAAAA/wALVHv/AAAAAP8AC1cK/wAAAAAI/wAI+uH/AAAAAP8ACPhS/wAAAAD/AAj4Uv8AAAAACP8ABej2/wAAAAD/AAXj1/8AAAAA/wAF6Pb/AAAAAAj/AAIhSP8AAAAA/wACHrj/AAAAAP8AAiFI/wAAAAAI/wBm8zP/AAAAAP8AYkzN/wBSIUj/ABJMzf8AZUeuCP8ADOuF/wBHo9cF/wASTM3/AGUUe///u24U/wBSI9f//5kPXP8AAAAACP//xV64//8UAAAV///9q4X///MUe///83XD///1mZr///LMzf8AAAAACP/+7P1x/wAAAAAF///x9cP/AAAAAP//9qFI/wALa4X/AAJo9v8ADgeuCP8ABw9c/wAoDM0F/wACgAD/AA4Hrv8ADWFI/wALbhT/AA4KPf8AAAAACP8BE3rh/wAAAAAF/wANMzP/AAAAAP8ACLhS///1gAD///2wpP//8xR7CA75Xv8AO5za/wItNcMV///8Xrj//+pwpP8ADq4U///uij3/ABXuFP8AAAAACP8BO0KP/wAAAAAF///HaPb//6mXCv//xn1x//+oTM3/AAAAAP8AAAAACP//+Eo9///0R64F////QAD///+64QX//0HmZv/+3euFBf//+gzN///25mb///6zM///9U9c/wAD5mb///eMzQj/AAPmZv//93Ck/wAIczP///rj1/8ACgo9/wAAAAAI/wAALhT/AAAAAP8AABma////64X/AAAwpP8AAAAACP8Awej2/wAAAAAF/wAMuuH/AAAAAP8AC1cK/wAF8KT/AAaXCv8ACgo9CP8AZdcK/wCbWZoF/wCDGZr/AMfcKQX/AAAZmv8AABR7////5mb/AAAwpP8AABma/wAAGZoI/wCufXH/AQno9gX/AADrhf8AAWFI/wAA7hT/AAGAAP8AAMAA/wABeuEI/wAIuuH/AA1hSP8AAdma/wAPszP///pXCv8ADHMzCP//+lR7/wAMo9f///OPXP8AB4Uf///xOFL/AAAAAAj//dGAAP///oUfBf8AAEUf////5mYF///ta4X/AAAAAAX/AAAAAP8AABmaBf//63XD/wAAAAAF///qKPb/AAAAAP//6zMz///unrj///xHrv//6lmaCA75yP8C9GFe/wEEVwoV/wAAvXH/AAlMzf8AAEUf/wAJAo////9zM/8ACL1xCP///3Ck/wAJSj3///5rhf8ACNHs///9Zmb/AAhzMwj///iR7P8AHnhS///xyj3/AA/PXP//+gzN/wAFYUgI/wAaq4X/ABjMzf8AE5wp/wAgPXH/AAZo9v8AI5cKCP8AAEeu/wABrhT////PXP8AAZR7/wAA1wr/AAGrhQj/AAQuFP8AFtmaBf8AABR7/wAAAAAF/wAHVwr/AClzMwX/ABECj/8AYQAA//+/Uez/AE6Cj///nzCk/wAAAAAI//6lij3/AAAAAAX//58wpP8AAAAA//+jjM3//7F9cf//7v1x//+fFwoI///4qPb//9aR7AX/AAAZmv8AAAAABf///Bma///pJmYF/wAAMKT///5R7P///1ma///+bhT///+hSP///lHsCP//+d64///caPb/AAhFH///38KP/wAR7hT//+czMwj///hKPf//+pwp///sT1z///BmZv//7eFI///hszMI///6+uH///iPXP//+89c///4MzP///xj1///+AKPCP//+3Mz///1x67///x4Uv//9TXD///9BR////TzMwj///04Uv//9lR7///9fXH///WzM////gzN///01woI////z1z///8Ue////+j2////Qo/////mZv///xHsCP///PCk///u/XEF///7cKT//+ZCjwX////o9v8AAAAABf///TXD///wNcP///9Zmv//8MAA/wABHCn///FrhQj/AAZuFP//sTXD/wA9OFL//8W9cf8AVRwp/wAAAAAI/wFrkez/AAAAAAX/AFyhSP8AAAAA/wBY1Hv/AEUMzf8AG5cK/wBZeFII/wACaPb/AAfj1/8AAfMz/wAIFwr/AAGAAP8ACCuFCP8AA4Uf/wAT+uEF/wAEXrj/ABlcKQX/AAIKPf8AC5wp/wABMzP/AArHrv8AAHMz/wAJ8KQI//8msKT//9VFHxX///yPXP//7KuF///tmZr///BPXP//7KuF/wAAAAAI//8U2Zr/AAAAAAX//+yo9v8AAAAA///zGZr/AA+wpP8AA24U/wATVHsI/wADQo//ABKUewX/AANuFP8AE1Hs/wASY9f/AA+zM/8AE1R7/wAAAAAI/wDrKPb/AAAAAAX/ABNXCv8AAAAA/wAM6Pb///BMzf///JHs///srhQI//8LtcP/AQBzMxX/AANzM/8AE1Hs/wASY9f/AA+zM/8AE1R7/wAAAAAI/wDLwAD/AAAAAAX/ABNXCv8AAAAA/wAM0ez///Bj1////KZm///sq4UI///8j1z//+xmZgX///x4Uv//7KuF///tnCn///Bj1///7MUf/wAAAAAI//80PXH/AAAAAAX//+yuFP8AAAAA///zLhT/AA+cKf8AA1cK/wATVHsIDvnL/wDV4sr/AQf64RX/ATzrhf8AAAAABf8ADTMz/wAAAAD/AAi64f//9YAA///9rhT///MUewj///oPXP//3tR7Bf///auF///zEez///NcKf//9YKP///y5mb/AAAAAAj//lIwpP8AAAAABf//6g9c/wAAAAD//+swpP//7oeu///8Ao///+pwpAj//+zcKf//lhR7Bf///BcK///qcKT/AA6Ue///7oeu/wAV8KT/AAAAAAj/ABSFH/8AAAAABf8AAAAA/wAAGZoF/wHBJmb/AAAAAAX/AGbzM/8AAAAA/wBiSj3/AFIhSP8AEk9c/wBlFwoI/wAHhR//ACnmZgX/AAAZmv8AAAAABf8ANB64/wEn1HsF/wARkez/AGOFH///vY9c/wBQpmb//5x9cf8AAAAACP8AAC4U/wABBR8F//6W8zP/AAAAAAX//5kPXP8AAAAA//+dsKT//63euP//7bMz//+auuEI///zFHv//7hcKQX//+2zM///muj2/wBEq4X//63euP8AZvMz/wAAAo8I/wA6nCn/AOv9cRX/AAJUe/8ADOj2/wAMh67/AApo9v8ADTMz/wAAAAAI/wETBR//AAAAAAX/AA4Hrv8AAAAA/wAJYUj///SUe////ZR7///x9cMI///48KT//9f1wwX///2AAP//8fhS///ynrj///SPXP//8fhS/wAAAAAI//7shR//AAAAAAX///LMzf8AAAAA///3RR//AAqAAP8AAlHs/wAM64UIDvep/wDw8Oj/Amd64RX//5EMzf8AAAAABf//66Zm/wAAAAD//+yXCv//73XD///8Xrj//+u9cQj//+x9cf//kUAABf///HhS///reFL/AA2R7P//74zN/wAUVwr/AAAAAAj/AG7XCv8AAAAABf8AFFwp/wAAAAD/ABNo9v8AEIo9/wADoUj/ABRAAAj/ABOZmv8AbtmaBf8AA4eu/wAUcKT///JwpP8AEHMz///rqPb/AAAAAAj//8J64f/+pGj2Ff//kQ9c/wAAAAAF///rj1z/AAAAAP//7KuF///vdcP///xeuP//68AACP//7H1x//+RKPYF///8YUj//+uMzf8ADY9c///vjM3/ABRcKf8AAAAACP8AbtcK/wAAAAAF/wAUVwr/AAAAAP8AE24U/wAQjM3/AAOeuP8AFFmaCP8AE5wp/wBu1woF/wADh67/ABRZmv//8oeu/wAQcKT//+umZv8AAAAACA73p/8ApRm6/wENNcMV//+kxR//AAAAAAX//+lUe/8AAAAA///qQo///+2cKf///AAA///pVHsI///ej1z//0G1wwX///zwpP//7p64/wALgo////H4Uv8AEUeu/wAAAAAI/wA5+uH/AAAAAAX/ABMKPf8AAAAA/wASxR//AA0Zmv8AB7hS/wASfXEI/wBK+uH/ALRwpAX/AAquFP8AGeuF///wwAD/ABjPXP//5W4U/wAAAAAI/wBOa4X/AVuXChX//5Eo9v8AAAAABf//66Zm/wAAAAD//+yUe///73XD///8Xrj//+u9cQj//+x9cf//kUKPBf///GFI///rj1z/AA2o9v//76PX/wAUVwr/AAAAAAj/AG7Zmv8AAAAABf8AFFma/wAAAAD/ABNo9v8AEIo9/wADoUj/ABRCjwj/ABOcKf8AbtcKBf8AA4eu/wAUQo////JXCv8AEHCk///rpmb/AAAAAAgO+Oz/AjSM0/8CdiPXFf//mRma///PrhT//vMrhf//gcAA//9h64X//7XCjwj//+ZFH///8+uF///+rhT//9vuFP8AGMUf///yEewI/wB/wAD//7ghSP8BFlcK//9jbhT/ACbwpP//6hcKCP8ACx64///5wAD/AA3o9v8ABqFI/wACOFL/AAyMzQj/ABcj1/8Ag1HsBf8AAx64/wARnrj///eXCv8AEbMz///wZmb/AAjFHwj//9NzM/8AGRHs///Xh67/ABbKPf//21wp/wAUnCkI///5a4X/AAOzM/8AAGPX/wAJlHv/AAbXCv8AAzXDCP8ANMKP/wAYxR//ADRCj/8AGIeu/wAukez/ABXcKQj/ABGPXP8ACEAA/wAMWZr/ABAuFP8AA164/wATGZoI/wAGwo//ACZZmv8AC6uF/wBCKPb/AAe4Uv8AK8o9CP8AA0Uf/wASbhT//+064f8ADnhS///vDM3///gMzQgO+JP/Ac6g5v8CQJR7Ff/++BcK/wAAAAD/ALhCj/8AAAAA//75Fwr/AAAAAAj//+uj1/8AAAAA///slwr//+91w////HhS///rwo8I///sZmb//5EmZgX///yMzf//649c/wANeFL//++j1/8AFFma/wAAAAAI/wEIGZr/AAAAAP//R49c/wAAAAD/AQcCj/8AAAAACP8AFFcK/wAAAAD/ABNrhf8AEIzN/wADnrj/ABRAAAj/ABOeuP8AbtmaBf8AA1R7/wAUQAD///JzM/8AEIeu///ro9f/AAAAAAj//9euFP/+8hmaFf/+9+j2/wAAAAD/ALhwpP8AAAAA//74/XH/AAAAAAj//+uo9v8AAAAA///slHv//+9zM////HhS///rwo8I///sY9f//5Eo9gX///yR7P//66PX/wANeFL//++PXP8AFFcK/wAAAAAI/wA5IUj/AAAAAP8AGUUf/wAAAAD/AAo4Uv8AAAAACP8ABKuF/wAAAAD/AAGUe/8AAAAA////8zP/AAAAAAj/ABCzM/8AAAAA/wA48zP/AAAAAP8Aqi4U/wAAAAAI/wAUWZr/AAAAAP8AE2uF/wAQij3/AAOeuP8AFEKPCP8AE5wp/wBu1woF/wADcKT/ABQ9cf//8nCk/wAQjM3//+umZv8AAAAACA747P8CNtsQ/wF7lwoV//+AQAD/AEfeuP/+6aj2/wCckez//9kPXP8AFej2CP//9OFI/wAGQAD///IXCv//+V64///9yj3///NzMwj//+jUe///fK4UBf///OPX///uYUj/AAho9v//7kzN/wAPmZr///c64Qj/ACz9cf//5q4U/wAo1Hv//+kFH/8AJOj2///rOuEI/wAGI9f///yMzf///564///3FHv///mcKf///P1xCP//yt64///nDM3//8tXCv//50zN///RGZr//+n64Qj//+5wpP//98AA///zpmb//+/R7P///KFI///s5mYI///5OuH//9mmZv//9FcK//+91wr///hHrv//1DhSCP///MAA///tj1z/ABLFH///8Yeu/wAQ8zP/AAfzMwj/AGbmZv8AMFHs/wEM1Hv/AH5AAP8AnhcK/wBKPXEI/wAZuuH/AAwUe/8AAVHs/wAkEez//+c4Uv8ADe4UCA75If8BQgI9/wDTx64V//98D1z/AAAAAAX//+orhf8AAAAA///rMKT//+6euP///Bma///qij0I///pgo///3vKPQX///wZmv//6qFI/wAOlHv//+6Hrv8AFdR7/wAAAAAI/wCEB67/AAAAAAX/ABW9cf8AAAAA/wAU0ez/ABF4Uv8AA+Zm/wAVXrgI/wAWeuH/AIQ1wwX/AAPo9v8AFY9c///xaPb/ABFHrv//6iuF/wAAAAAI/wCvVHv/AelKPRX//oo1w/8AAAAABf//6iuF/wAAAAD//+sZmv//7p64///8Fwr//+qhSAj//+2Cj///m3hSBf///Bma///qoUj/AA59cf//7p64/wAV1Hv/AAAAAAj/AU41w/8AAAAABf8ADRma/wAAAAD/AAij1///9Zma///9rhT///MUewj///Oj1///vIzN/wAHzM3/AAAZmv//u3Ck/wAAAAAI//+vij3/AAAAAP//srCk///NWZr//9meuP//uWPXCP//+p64///2VHv/AAArhf//9DMz/wAFx67///ZwpAj/AAWo9v//9m4U/wAKUez///o9cf8ACwzN/wAAAAAI/wBJsKT/AAAAAP8APMKP/wAAAAD/AFBCj/8AAAAACP8AZpHs/wAAAAD/AGHwpP8AUcUf/wASfXH/AGS4Ugj/AA0XCv8AR1cKBf8AEmuF/wBkzM3//7vMzf8AUbCk//+ZhR//AAAAAAgO+Zv/AtBYGP8CXpcKFf//4ej2/wAkAAD//9OKPf8AE9R7///NXrj/AAAAAAj//sXj1/8AAAAABf//nGPX/wAAAAD//6QeuP//s0eu///uTM3//54PXAj//9CmZv/++fMzBf//9wUf///OQo//AAuZmv//0MzN/wAeD1z//9wHrgj/AB4Zmv//3AAA/wAsdcP//+wo9v8AMqZm/wAAAAAI/wE6FHv/AAAAAAX/ACzcKf8AAAAA/wAth67/ABAXCv8AJdma/wAdMKQI/wAEGZr/AAMo9v8AAoo9/wAEvXH/AABR7P8ABR64CP8AAFR7/wAFD1z///44Uv8ABMKP///8a4X/AAOXCgj//+BXCv8AH8AABf//+geu/wAF/XH///ZwpP8AAOPX///5Uez///sj1wj//+jAAP//7yFI///k5mb///a1w///5go9/wAAAAAI//7F64X/AAAAAAX//+VUe/8AAAAA///pLhT/AAm9cf//8ThS/wARsKQI///xQo//ABGmZv//+nrh/wAYHrj/AASzM/8AGiFICP8AL1Hs/wEF5mYF/wAK7hT/ADxuFP8AOtR7/wAxJmb/AD1mZv8AAAAACP8BOhwp/wAAAAAF/wAapmb/AAAAAP8AFs9c///2RR//AA7FH///7lHsCP8ADsKP///uVwr/AAWHrv//5+FI///7Sj3//+XeuAj//90Hrv//PePXBf///jXD///2DM3///dXCv//+Mo9///149f/AAAAAAj//9G4Uv8AAAAABf//+Q9c/wAAAAD///mCj/8AAz1x///7I9f/AAXj1wj///mMzf8AB9cK///9IUj/AAvMzf8AAgUf/wAKa4UI/wAYgo//AIfAAAX/AAJhSP8ADSZm///81wr/AAycKf//99wp/wAJvXEI///33rj/AAm4Uv//9Aeu/wAFlwr///NHrv8AAAAACP//K7Mz/wAAAAAF///ZYUj/AAAAAP//3vXD///kaPb///kmZv//2frhCP//3cKP//9Cij0F///9x67///OHrv8AA2Zm///zRR//AAgeuP//9kzNCP8ACCZm///2RR//AAvwpP//+qZm/wANeuH/AAAAAAj/ANNUe/8AAAAABf8AEN64/wAAAAD/ABEAAP8ABdR7/wAN8zP/AAqUewj/AAT9cf8AA8euBf8ABT1x///8kewF/wAQwo////UHrv8AEz1x///6NcP/ABOcKf8AAAAACP8AP0eu/wAAAAAF/wAmq4X/AAAAAP8AIRHs/wAbo9f/AAbcKf8AJhmaCP8AGcUf/wCOjM3/AAlPXP8ANBcK/wACT1z/AAzXCgj/AACXCv8AA0zNBf8ACQAA/wAxrhT///RmZv8ALzhS///h8KT/ACP4Ugj//vuKPf/+teFIFf//V1cK/wAAAAAF/wAabhT/AJJrhQX/AKiwpP8AAAAABQ755P//y5YF/wAQFwoV/wAER67///YMzf8ACdma///53rj/AAvMzf8AAAAACP8AqIzN/wAAAAAF/wAMczP/AAAAAP8ADKPX/wAG4Uj/AAe1w/8ACsUfCP8AGko9/wAlK4UF/wANqPb/ABUAAAX/AVHUe/8AAAAABf8AEdcK///GHCkF/wADVwr///UMzf8ACRwp///5HCn/AAsPXP8AAAAACP8An564/wAAAAAF/wAKaPb/AAAAAP8ACpma/wAGIUj/AAb1w/8ACfMzCP8ABt64/wAJ8KT/AAI64f8ADFma///8qPb/AAo4Ugj//zfFH/8CZfrhBf//8xcK/wAkyj3//90o9v///vrh/wAAAAD/AAAAAAj//+2AAP8AAAAA///v8KT/AABeuP//8VHs/wAAAAAI///7uFL/AAAUe////HXD////0ez///vrhf8AABmaCP///lR7/wAAAAD///4Mzf8AAAAA///+Uez/AAAAAAj///R64f8AAC4U///1gAD/AAAZmv//9iZm////nrgI/wAAAAD///9rhQX////R7P8AAAAA////6Pb/AAAAAP///8zN////64UI/wAAAAD/AACmZgX//9w64f///pwp///lszP///khSP//62FI///kNcMI//5qzM3//ZoKPQX///iUe///9ceu///+Cj3///OhSP8ABEUf///1/XEI/wHwK4X/AZjj1xX/ADmZmv//SZwpBf//TtHs/wAAAAAFDvnW/wAgOdz////64RX/Ag6j1/8AAAAABf8AYFcK/wAAAAD/AFwXCv8ATNR7/wARFwr/AF7Hrgj/AAsmZv8APbCkBf8AApma/wAOlwr/AAHcKf8ADWPX/wAAMKT/AAzPXAj/AABHrv8AD7Mz///9q4X/AA74Uv//+ZcK/wAPgo8I///+a4X/AAPPXP//6Zwp/wApEez///19cf///a4UCP8AG2Zm/wAZAAD/ABRCj/8AILCk/wAGgAD/ACQ9cQj/AABKPf8AAa4U////z1z/AAGUe/8AANcK/wABq4UI/wAKHrj/ADgHrgX/ABIeuP8AZOZm//+7uFL/AFHCj///mWuF/wAAAAAI//4NDM3/AAAAAAX//+ouFP8AAAAA///rLhT//+6euP///Bma///qjM0I//+PeuH//ZFPXAX///wXCv//6oo9/wAOlHv//+6euP8AFdcK////+uEI/wDbAAD/AQaXChX/AAC9cf8ABEUf/wAEMKT/AANwpP8ABFwp/wAAAAAI/wET8zP/AAAAAAX/ABOFH/8AAAAA/wAM5mb///B64f///JHs///s3CkI///8eFL//+yrhQX///yPXP//7Nwp///ta4X///B9cf//7H1x/wAAAAAI//7sDM3/AAAAAAX///uhSP8AAAAA///9Hrj/AAOHrv8AAMAA/wAERR8I/wA7R67/AUf9cRX/AADAAP8ABEUf/wAELhT/AAOHrv8ABFwp/wAAAAAI/wECNcP/AAAAAAX/ABOCj/8AAAAA/wAM6Pb///B9cf///I9c///s3CkI///8eFL//+yrhQX///yR7P//7Nwp///taPb///B64f//7H1x/wAAAAAI//79yj3/AAAAAAX///uhSP8AAAAA///9Hrj/AANzM/8AAMAA/wAEXCkIDvlF/wCnm8f/AAAAABX/AYPR7P8AAAAABf8AFdR7/wAAAAD/ABTR7P8AEV64/wAD49f/ABV4Ugj/ABMMzf8AaaFIBf8AA+PX/wAVeFL///Fr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/wAAAAD///N1w///9ZcK///9q4X///MXCgj//+ouFP//hx64Bf///auF///zFHv/AAi9cf//9Zma/wANGZr/AAAAAAj/AJbMzf8AAAAABf8ABGFI/wAAAAD/AALhSP///IzN////QAD///uj1wj///O64f//vCuFBf///0Uf///7uFL///vPXP///HhS///7oUj/AAAAAAj//udo9v8AAAAABf//8uZm/wAAAAD///dFH/8ACmj2/wACUez/AAzo9gj/ADRmZv8BIkUfBf8AAlR7/wAM6Pb/AAyKPf8ACmj2/wANAo//AAAAAAj/AcpAAP8AAAAABf8AFdcK/wAAAAD/ABTR7P8AEV64/wAD49f/ABV1wwj/ABIhSP8AZIo9Bf8AA+PX/wAVeFL///GFH/8AEWFI///qHCn////64QgO+bj/AwR53P8Cu7hSFf//e/rh/wAAAAAF///qK4X/AAAAAP//6y4U///uoUj///wZmv//6oo9CP//2LMz//8mlHsF////Qo////u4Uv//+89c///8kez///uj1/8AAAAACP//AB64/wAAAAAF///7oUj/AAAAAP///R64/wADbhT/AADAAP8ABEeuCP8AJ0zN/wDZa4UF/wADz1z/ABV1w///8YAA/wARXrj//+oo9v8AAAAACP//e/1x/wAAAAAF///qKPb/AAAAAP//6y4U///uoUj///wZmv//6oo9CP//j5R7//2R8zMF///8Fwr//+qHrv8ADpR7///uoUj/ABXXCv8AAAAACP8AhAeu/wAAAAAF/wAV1wr/AAAAAP8AFM9c/wARYUj/AAPmZv8AFXXDCP8AKAzN/wDdaPYF/wAAvXH/AARHrv8ABDCk/wADh67/AARcKf8AAAAACP8A/+FI/wAAAAAF/wAEXrj/AAAAAP8AAuFI///8jM3///9AAP//+6PXCP//2AzN//8ilwoF///8HCn//+qHrv8ADpR7///uoUj/ABXXCv8AAAAACP8AhAeu/wAAAAAF/wAV0ez/AAAAAP8AFNHs/wARYUj/AAPmZv8AFXXDCP8AcGuF/wJuDM0F/wADuFL/ABV1w///8YAA/wARXrj//+oo9v8AAAAACA731f8AnbIu/wK7uFIV///qKPb/AAAAAP//6y4U///uoUj///wZmv//6oo9CP//j5R7//2R8zMF///8Fwr//+qHrv8ADpR7///uoUj/ABXXCv8AAAAACP8AhAeu/wAAAAAF/wAV1wr/AAAAAP8AFM9c/wARYUj/AAPmZv8AFXXDCP8AcG4U/wJuDM0F/wAD49f/ABV1w///8YUf/wARXrj//+oo9v8AAAAACA75I/8BY8GL/wAAAAAV/wAAAAD////o9gX/AGaR7P8AAAAA/wBh8KT/AFHFH/8AEjXD/wBk5mYI/wBWZmb/Ad5PXAX/AAPmZv8AFXXD///xa4X/ABFeuP//6ij2/wAAAAAI//97+FL/AAAAAAX//+orhf8AAAAA///rLhT//+6hSP///Bwp///qij0I//+t8zP//jnAAAX///2wpP//8y4U///zczP///WAAP//8uZm/wAAAAAI//6+hR//AAAAAAX//+ouFP8AAAAA///rLhT//+6euP///Bma///qij0I///s9cP//5ZcKQX///wXCv//6oeu/wAOlHv//+6hSP8AFdcK/wAAAAAIDvmY////t03/ACbXChX///wXCv//6oo9/wAOlHv//+6euP8AFdcK/wAAAAAI/wCEB67/AAAAAAX/ABXXCv8AAAAA/wAUz1z/ABFhSP8AA+Zm/wAVdcMI/wAKIUj/ADfuFAX/AAEHrv8ABZHs/wAC+FL/AAVMzf8ABF64/wAEK4UI/wBeeuH/AFqAAAX/AH6j1///RLCkBf8ABfCk///3R67/AAoeuP//+uPX/wALnrj/AAAAAAj/AM3Mzf8AAAAABf8ADXhS/wAAAAD/AAoKPf8AD2j2///5OFL/AAoj1wj//ygo9v8BPz1xBf///go9/wAC4Uj/AADAAP8ABEeu/wADD1z/AALhSAj/AUzo9v8BQNHsBf8ACmZm/wAKOFL///uPXP8AD24U///yhR//AAAAAAj//zI1w/8AAAAABf//9GFI/wAAAAD///QCj///+vrh///25mb///crhQj//uVCj//+75cKBf//8kAA///2D1z/AAKzM/8AEHCk/wAAAAD/AAAAAAj/ACtj1/8A8BcKBf8AA+Zm/wAVeFL///Fo9v8AEV64///qK4X/AAAAAAj//3v4Uv8AAAAABf//6iuF/wAAAAD//+suFP//7p64///8GZr//+qKPQgO+Sf/AG8i0v8ClOPXFf//j5R7//2R8zMF///8Fwr//+qHrv8ADpR7///uoUj/ABXXCv8AAAAACP8CBMUf/wAAAAAF/wAV1wr/AAAAAP8AFNHs/wARYUj/AAPmZv8AFXXDCP8AEwo9/wBpo9cF/wAD5mb/ABV1w///8WuF/wARYUj//+oo9v8AAAAACP/+vm4U/wAAAAAF///y5mb/AAAAAP//90Uf/wAKZmb/AAJR7P8ADOuFCP8AUgo9/wHGQAAF/wAEAAD/ABV1w///8YAA/wARXrj//+oo9v8AAAAACP//e/rh/wAAAAAF///qK4X/AAAAAP//6zCk///uoUj///wZmv//6oo9CA76d/8AnZiV/wK7XCkV///qK4X/AAAAAP//6y4U///unrj///wZmv//6oo9CP//j6uF//2SVHsF///8Fwr//+qHrv8ADpR7///uoUj/ABXXCv8AAAAACP8AdzXD/wAAAAAF/wAV1Hv/AAAAAP8AFNHs/wARYUj/AAPj1/8AFXXDCP8ALLMz/wD3bhQF/wBRwo///vhPXAX/AAP9cf//8kAA/wAMXCn///crhf8AD24U/wAAAAAI/wCd3Cn/AAAAAAX/AA9uFP8AAAAA/wAPmZr/AAjUe/8ACOuF/wANwAAI/wCxSj3/AQj9cQX//9MFH///B0UfBf///BcK///qh67/AA6Zmv//7qFI/wAV1Hv/AAAAAAj/AHc4Uv8AAAAABf8AFdHs/wAAAAD/ABTR7P8AEWFI/wAD5mb/ABV1wwj/AHBXCv8CbauFBf8ABAAA/wAVdcP///Fo9v8AEWFI///qKPb/AAAAAAj//2b64f8AAAAABf//8JHs/wAAAAD///BmZv//9yuF///3FHv///JAAAj//t1FH//+TA9cBf//+3Ck///5B67///UKPf8AAdwp///9lHv/AAgrhQj//4iFH/8BsOFIBf///AAA/wANwAD///Oj1/8ACNR7///wlHv/AAAAAAgO+dn/ASMvif8BiI9cFf8A13XD//6FSj0F/wAF9cP///dCj/8ACh64///649f/AAuzM/8AAAAACP8AkMUf/wAAAAAF/wAV1Hv/AAAAAP8AFNHs/wARYUj/AAPmZv8AFXXDCP8AcFcK/wJtq4UF/wADz1z/ABWPXP//8WZm/wARXrj//+orhf8AAAAACP//fOj2/wAAAAAF///qKPb/AAAAAP//6y4U///uoUj///wcKf//6oo9CP//xYzN//68YUgF///+a4X///d1w///9KZm///98zP///r9cf8AB24UCP//Ohma/wFfxR8F///6DM3/AAjR7P//9ceu/wAFBR////Rj1/8AAAAACP//WNma/wAAAAAF///qKPb/AAAAAP//6y4U///uoUj///wZmv//6oo9CP//j6uF//2SUewF///8Fwr//+qHrv8ADpcK///uo9f/ABXXCv8AAAAACP8AgxcK/wAAAAAF/wAV1wr/AAAAAP8AFNHs/wARYUj/AAPj1/8AFXMzCP8AP164/wFeeFIF/wABeuH/AAiKPf8AC24U/wACDM3/AAUHrv//+JHsCA759/8Cu0NJ/wK99cMV//5sTM3/AAAAAAX//5luFP8AAAAA//+eD1z//649cf//7co9//+bMKQI///DI9f//q8wpAX//+3KPf//mzMz/wBEYUj//6464f8AZpcK/wAAAAAI/wGTszP/AAAAAAX/AGaR7P8AAAAA/wBh8KT/AFHAAP8AEjXD/wBk0ewI/wA83Cn/AVDPXAX/ABI4Uv8AZMzN//+7nCn/AFHFH///mWj2/wAAAAAI//+MQAD//hCUexX///2rhf//8xR7///zczP///WZmv//8uj2/wAAAAAI//7P+uH/AAAAAAX///LmZv8AAAAA///3RR//AApmZv8AAlHs/wAM64UI/wA0rhT/ASNhSAX/AAJR7P8ADOZm/wAMij3/AAprhf8ADRma/wAAAAAI/wEv64X/AAAAAAX/AA0cKf8AAAAA/wAIuuH///WXCv///a4U///zFwoIDvm+/wMqYr3/AgW1wxX/ABI1w/8AZOPX//+7nrj/AFGuFP//mWuF/wAAAAAI//4NJmb/AAAAAAX//+ouFP8AAAAA///rK4X//+6euP///Bma///qij0I//+PeuH//ZFmZgX///wXCv//6oeu/wAOlwr//+6hSP8AFdcK/wAAAAAI/wCD2Zr/AAAAAAX/ABXR7P8AAAAA/wAU0ez/ABFhSP8AA+Zm/wAVdcMI/wAXUez/AIEmZgX/AADAAP8ABEUf/wAELhT/AAOHrv8ABFwp/wAAAAAI/wE/uFL/AABHrgX/AGaR7P8AAAAA/wBh8KT/AFHAAP8AEjXD/wBk0ewI//9ECj3/AIPAABX//+0KPf//l0o9Bf///HhS///s8zP//+2Cj///8H1x///slHv/AAAAAAj//v3KPf8AAAAABf//+6PX/wAAAAD///0euP8AA3Ck/wAAwAD/AARcKQj/ABycKf8AnlHsBf8AAMAA/wAER67/AAQwpP8AA4eu/wAEXCn/AAAAAAj/AQIzM/8AAAAABf8AE2uF/wAAFHv/AA0AAP//8GZm///8kez//+zcKQgO+ff/AxdAuv8AtpR7Ff8APNma/wFQz1wF/wASNcP/AGTmZv//u5wp/wBRwo///5luFP8AAAAACP/+bDMz/wAAAAAF//+ZbhT/AAAAAP//nhHs//+uPXH//+3KPf//my4UCP//wyPX//6vMzMF///tyj3//5sXCv8ARGFI//+uPXH/AGaXCv8AAAAACP8BFwUf/wAAAAAF/wADPXH/AAAAAP8AAoKP///+DM3/AACmZv///R64CP8AFYzN//+h+FIF/wAC+FL///MZmv8ACxcK///3nrj/AAyXCv///ceuCP8AGQeu///7lwr/ABvPXP8AC9cK/wAXIUj/AAgUewj/ABmFH/8ACOuF/wAZHCn/AAoMzf8AGZ64/wAInrgI/wAA1wr/AABHrgX/ABW64f8AB/1x/wAN1wr/ABarhf//+3Mz/wAT49cI///0kez/ADHj1wX///9FH/8AA3Ck/wAB8KT/AAO4Uv8AA24U/wACCj0I/wA4aPb/ACBuFP8AK6uF/wA3qPb/AAuFH/8AP9R7CP//MFR7/wAYD1wV///9rhT///MUe///83Mz///1mZr///LmZv8AAAAACP/+0BcK/wAAAAAF///y49f/AAAAAP//90Uf/wAKZmb/AAJR7P8ADOuFCP8ANK4U/wEjXrgF/wACVHv/AAzo9v8ADIo9/wAKaPb/AA0Cj/8AAAAACP8BL+j2/wAAAAAF/wANHrj/AAAAAP8ACLhS///1mZr///2wpP//8xR7CA75z/8AIDxW////+uEV/wCD7hT/AAAAAAX/ABXXCv8AAAAA/wAU0ez/ABFeuP8AA+Zm/wAVdcMI/wAXUez/AIEmZgX/AADAAP8ABEeu/wAELhT/AAOHrv8ABFwp/wAAAAAI/wCftcP/AAAwpAX/AAfj1/8AAAAA/wAGmZr///wXCv8AA0KP///5mZoI/wBLQo///20j1wX/AAi64f//7p64/wAP49f///3zM/8AL/Ck/wAAwAAI/wAcEez///+euP8AKqZm/wACJmb/AETAAP8AAAAACP8AFhwp/wAAAAD/AA2R7P8AFyFI///1IUj/ABNUewj//63FH/8AjyPXBf///dma/wADz1z/AAJUe/8ABRwp/wAEj1z/AAI9cQj/AD94Uv8AHtcK/wAyQo//ADvXCv8ADIo9/wBFNcMI/wActcP/AJ8rhQX/ABJMzf8AZOZm//+7nrj/AFHCj///mW4U/wAAAAAI//4NDM3/AAAAAAX//+ouFP8AAAAA///rK4X//+6euP///Bma///qjM0I//+PeuH//ZFPXAX///wXCv//6oo9/wAOlwr//+6euP8AFdcK/wAAAAAI/wEJFHv/AgVuFBX/AADAAP8ABEUf/wAELhT/AAOHrv8ABFwp/wAAAAAI/wECMzP/AAAAAAX/ABOFH/8AAAAA/wAM6Pb///B9cf///IzN///s3CkI///tD1z//5dKPQX///x4Uv//7PMz///tgo////B64f//7JHs/wAAAAAI//79zM3/AAAAAAX///uj1/8AAAAA///9Hrj/AANzM/8AAL1x/wAEXCkIDvmw/wHtlfD/AAAXChX/AAAAAP///+ZmBf8AFHCk/wAAAAAF/wBmkez/AAAAAP8AYfCk/wBRwAD/ABI1w/8AZNHsCP8AC8zN/wBBZmYF/wASNcP/AGTPXP//u5ma/wBRwo///5luFP8AAAAACP/+xDCk/wAAAAAF///y49f/AAAAAP//90Uf/wAKZmb/AAJR7P8ADOuFCP8AB/1x/wAsCj0F/wACUez/AAzrhf8ADIo9/wAKZmb/AA0Zmv8AAAAACP8BqzXD/wAAAAAF/wAV1wr/AAAAAP8AFNHs/wARYUj/AAPmZv8AFXXDCP8AEjXD/wBkh64F/wAD6Pb/ABWPXP//8WZm/wARYUj//+oo9v8AAAAACP/+LQeu/wAAAAAF//+ZbhT/AAAAAP//ng9c//+uQAD//+3KPf//my4UCP//8xR7//+4o9cF///tyj3//5scKf8ARGFI//+uUez/AGaXCv8AAAAACP8BO89c/wAAAAAF/wANHCn/AAAAAP8ACLhS///1mZr///2uFP//8xR7CP//+hHs///e7hQF///9q4X///MUe///83Mz///1lwr///Lo9v8AAAAACP/+SOZm/wAAAAAF///qKPb/AAAAAP//6y4U///uoUj///wZmv//6oo9CP//7PMz//+WczMF///8Fwr//+qKPf8ADpcK///uoUj/ABXXCv8AAAAACA75WP8C0/Nx/wK7uFIV//2a3rj/AAAAAAX//+oo9v8AAAAA///rLhT//+6hSP///Bma///qij0I///t4Uj//5t1wwX///wXCv//6oeu/wAOmZr//+6j1/8AFdR7/wAAAAAI/wDBEez/AAAAAAX/AAReuP8AAAAA/wAC9cP///yPXP///yuF///7oUgI//+qKPb//iUhSAX///wXCv//6oeu/wAOlHv//+6hSP8AFdcK/wAAAAAI/wCEBR//AAAAAAX/ABXUe/8AAAAA/wAU0ez/ABFhSP8AA+Zm/wAVdcMI/wBV3Cn/AdreuAX/AAC9cf8ABEeu/wAELhT/AAOHrv8ABF64/wAAAAAI/wDBFHv/AAAAAAX/ABXR7P8AAAAA/wAU0ez/ABFhSP8AA+Zm/wAVczMI/wASNcP/AGSKPQX/AAPMzf8AFXXD///xhR//ABFeuP//6i4U/wAAAAAIDvnY/wMo7C7/Ar24UhX//4AmZv8AAAAABf//6ij2/wAAAAD//+suFP//7qFI///8GZr//+qKPQj//63FH//+OOj2Bf///bCk///zFwr///NzM///9ZcK///y5mb/AAAAAAj//uwKPf8AAAAABf//8uZm/wAAAAD///dFH/8ACmj2/wACUez/AAzo9gj/AFI64f8BxxcKBf8AA+j2/wAVdcP///GAAP8AEV64///qKPb/AAAAAAj//4KUe/8AAAAABf//6iuF/wAAAAD//+srhf//7qFI///8GZr//+qKPQj//6lR7P/+IEo9Bf//7co9//+beuH/AEQZmv//rmj2/wBmNcP///+64Qj/AVceuP///yj2Bf8AADMz/wAAAAD/AAArhf8AABma/wAAMzP/AAAAAAj/ABP4Uv///+ZmBf8AZpHs////uFL/AGIhSP8AUcKP/wASNcP/AGTo9gj/AFbeuP8B4KPXBf8AA8zN/wAVXCn///Fo9v8AEV64///qLhT/AAAAAAgO+aP/AzE7fv8CuyPXFf//X4o9/wAAAAAF///vLhT/AAAAAP//7zCk///1lwr///ehSP//8GPXCP//FMAA//5J1HsF///7nrj///frhf//83hS/wACVHv///5R7P8ACTCkCP//s6FI/wGyvXEF///9TM3/AA+cKf//8uZm/wAKaPb//+8wpP8AAAAACP//X4o9/wAAAAAF///vo9f/AAAAAP//8bMz///wHrj/AAKwpP//8MAACP8APZcK//6oa4X//+4rhf8AZVwp/wBFB67//nCR7Aj/AAKzM///8GPX/wANGZr///U64f8AEOj2/wAAAAAI/wDuI9f/AAAAAAX/ABDR7P8AAAAA/wAQ/XH/AAqzM/8ACF64/wAPmZoI/wDND1z/AX/rhf//0IKP//+noUj/ALsj1/8BWhwpCP8ACBR7/wAPVHv///d1w/8AD+PX///vo9f////4UggOHASS/wS1cgL/ArsAABX//1xKPf8AAAAABf//73hS/wAAAAD//+9cKf//9d64///3czP///CrhQj//0n64f/+t4zNBf//+564///4Ao////Oo9v8AAlHs///+OFL/AAkZmgj//8KuFP8BRlHsBf///R64/wAPVHv///MAAP8ACjhS///vXrj/AAAAAAj//44Ue/8AAAAABf//72FI/wAAAAD//+9Cj///9ceu///3j1z///CR7Aj//0rrhf/+tkAABf//+564///4Ao////OmZv8AAjrh///+OuH/AAkcKQj//8FHrv8BRRmaBf///Qo9/wAPVHv///MUe/8ACiFI///vXrj/AAAAAAj//1xhSP8AAAAABf//74o9/wAAAAD///GzM///7+4U/wACyj3///DZmgj/AHiZmv/9ffhSBf8AAuFI///wkez/AA0FH///9ceu/wAQoUj/AAAAAAj/AIpwpP8AAAAABf8AEIeu/wAAAAD/ABChSP8ACiPX/wAIczP/AA864Qj/ALMj1/8BQfCkBf8ABFwp/wAH49f/AAxCj////cUf/wABxR////b9cQj/AD4o9v/+wWZmBf8AAvXD///wwo//AA0Cj///9d64/wAQij3/AAAAAAj/AIpwpP8AAAAABf8AEKFI/wAAAAD/ABC9cf8ACjhS/wAIcKT/AA9uFAj/AWCZmv8CggeuBf8ACKPX/wAPPXH///d1w/8AEBR7///vkez/AAACjwgO+Yv/AwqL+v8Cuv1xFf//PtR7/wAAAAAF///zXrj/AAAAAP//8vrh///6D1z///bMzf//9fXDCP//fzhS//9z+uEF///7ij3///sR7P//97hS/wABOFL///yo9v8ABfCkCP//sxR7/wCJyj0F///6Uez/AAoKPf//9Trh/wAF8KT///NFH/8AAAAACP//PtR7/wAAAAAF///sq4X/AAAAAP//8N64///qWZr/AAij1///8KuFCP8AopcK//7czM0F/wAEj1z///fUe////gzN///07hT///h64f//99R7CP/+5sKP//7OI9cF///x3rj///CR7P8ABz1x///qcKT/ABNrhf8AAAAACP8AwSuF/wAAAAAF/wAMo9f/AAAAAP8ADQKP/wAF8zP/AAkwpP8ACgeuCP8AjkAA/wCaszMF/wAEj1z/AATrhf8ACC4U///+5mb/AANXCv//+fMzCP8AVRwp//9nh64F/wAFj1z///X4Uv8ACuFI///6DM3/AAyj1/8AAAAACP8AwSuF/wAAAAAF/wATUez/AAAAAP8ADyPX/wAVj1z///dcKf8AD24UCP//VThS/wEx3CkF///7czP/AAguFP8AAfMz/wALD1z/AAeHrv8ACCuFCP8BC8Uf/wEjMzMF/wAOOFL/AA9Ue///+KuF/wAVpmb//+yrhf8AAAAACA75Yf8C9IDh/wK7z1wV//9Yj1z/AAAAAAX///H4Uv8AAAAA///xyj3///jCj///9rXD///0GZoI//9cwAD//y7zMwX///tuFP//+iZm///2cKT/AAF9cf///Qeu/wAHDM0I//+paPb/AM5cKQX///srhf8AC+Zm///0Y9f/AAc9cf//8g9c/wAAAAAI//9Ykez/AAAAAAX//+2uFP8AAAAA///xDM3//+xo9v8ABoKP///weFII/wCqTM3//mn4UgX/AADXCv//+PCk/wAAuuH///lPXP8AAMAA///48KQI///cCj3//zj9cQX///wUe///6oo9/wAOmZr//+6euP8AFdcK/wAAAAAI/wCEAo//AAAAAAX/ABXXCv8AAAAA/wAU0ez/ABFhSP8AA+Zm/wAVdcMI/wAj+FL/AMcCjwX/AALcKf8ABmj2/wACzM3/AAY4Uv8AAuFI/wAGaPYI/wE+Uez/AZe1wwX/AAwXCv8AD564///4MKT/ABOZmv//7Z64/////XEIDvmF/wLnvFb/ArsXChX//aRZmv8AAAAABf//6ij2/wAAAAD//+suFP//7p64///8GZr//+qKPQj//+3KPf//m3hSBf///BcK///qh67/AA6Zmv//7qFI/wAV1wr/AAAAAAj/ATBeuP8AAAAABf8AB3Ck/wAAAAD/AAGrhf//9uZm///5fXH///tZmgj//pDR7P/+3IeuBf//4uj2///rSj3//+vZmv//4T1x///6I9f//9+R7Aj//+8uFP//oxcKBf///BcK///qij3/AA6XCv//7p64/wAV1wr/AAAAAAj/AmEj1/8AAAAABf8AFdHs/wAAAAD/ABTR7P8AEWFI/wAD5mb/ABV1wwj/ABL1w/8AaS4UBf8AA+j2/wAVdcP///FmZv8AEV64///qLhT/AAAAAAj//s7FH/8AAAAABf//+Kj2/wAAAAD///5AAP8ACQKP/wAGgAD/AAS9cQj/AWsZmv8BI49cBf8AHLXD/wAUz1z/ABP1w/8AHnrh/wAF3rj/ACA9cQj/AA/64f8AWKPXBf8ABAAA/wAVXCn///FmZv8AEWFI///qK4X/AAACjwgO+Dz/AbNKNv8DHfCkFf//0IzN/wAAAAD//761w/8AABR7////B67/AAAAAAj//5luFP8AAEo9//+d4Uj//65AAP//7co9//+bFHsI///GZmb//sFPXP8APRR7/wFKq4X//53Cj//94E9cCP//7co9//+bdcP/AEQXCv//rm4U/wBmNcP///+1wwj/ACyuFP///+PX/wBG8zP///9euP8AAAAA/wAAAAAI/wAWmZr/AAAAAP8AFYUf/wAR+uH/AAQHrv8AFjCkCP8AEtR7/wBoAAAF/wAECj3/ABZKPf//8Oj2/wAR+FL//+lmZv8AAAAACP//9auF/wAAAAD//8vo9v8AAAAA///1uFL/AAAAAAj///Lo9v8AAAAA///3Qo//AApo9v8AAlHs/wAM5mYI/wAc8KT/AKA1w/8AOxcK/wFALhT/AAA64f8AAUAACP8AAk9c/wAM64X/AAyMzf8ACmPX/wANGZr/AAAAAAj/ACZXCv8AAAAA///30ez/AAAAAP8AJsUf/wAAAAAI/wAWmZr/AAAAAP8AFYUf/wAR+uH/AAQHrv8AFjCkCP8AEtcK/wBn/XEF/wAEFHv/ABZR7P//8OZm/wAR+uH//+lo9v8AAAAACA74rf8B0iQk/wAmI9cV//9OKPb/AmU64QX///fUe/8AHEAA///mFHv/ABNrhf//4p64/wAAAAAI//+Ah67/AAAAAAX//+weuP8AAAAA///xsKT//+zzM/8ABXrh///s3rgI/wCx1wr//ZrFHwX/AAgrhf//48AA/wAZ64X//+yUe/8AHV64/wAAAAAI/wB/euH/AAAAAAX/ABPeuP8AABcK/wAOUez/ABMPXP//+oUf/wATB64IDvg8/wEIST3/Ax1MzRX//9NR7P8AABwp//+5Cj3/AAChSP8AAAAA/wAAAAAI///paPb/AAAAAP//6nrh///uBR////v1w///6c9cCP//7SuF//+YAAAF///7+FL//+m1w/8ADxR7///uBR//ABaZmv8AAAAACP8AClR7/wAAAAD/ADQZmv8AAAAA/wAKR67/AAAAAAj/AA0Ue/8AAAAA/wAIvXH///WZmv///bCk///zGZoI///jDM3//1/KPf//xOj2//6/z1z////Hrv///sAACP///a4U///zFwr///NzM///9Zwp///y5mb/AAAAAAj//9mo9v8AAAAA/wAIMKT/AAAAAP//2ThS/wAAAAAI///pZmb/AAAAAP//6n1x///uBR////v1w///6c9cCP//7SuF//+YAAAF///7+FL//+m1w/8ADxR7///uB67/ABaZmv8AAAAACP8AL3Mz/wAAAAD/AEFMzf///+j2/wAA9cP/AAAAAAj/AGaR7P///7hS/wBiHrj/AFHAAP8AEjXD/wBk6PYI/wA5mZr/AT6zM///wuuF//61Uez/AGJAAP8CH7MzCP8AEij2/wBkgo///7vj1/8AUZHs//+Zz1z/AABKPQgO+Hb/AaFY9v8AAAKPFf/+INR7/wAAAAAF///rqPb/AAAAAP//7JR7///vczP///x4Uv//68KPCP//7GPX//+RJmYF///8kez//+umZv8ADXhS///vjM3/ABRXCv8AAAAACP8B3yZm/wAAAAAF/wAUXCn/AAAAAP8AE2j2/wAQjM3/AAOhSP8AFEKPCP8AE5ma/wBu1woF/wADczP/ABQ9cf//8nCk/wAQjM3//+umZv8AAAAACA75ov8CH+Yx/wJceFIV///14Uj/ABzZmv//5so9/wAHdcP///NzM/8AAAAACP//9zXD////6Pb//8DMzf8AALMz///0Vwr////Hrgj/AAAAAP8AABcKBf//4Drh///+wAD//+Gj1////YUf///oeuH//+BKPQj//pNmZv/914UfBf//7szN///oOFL/AA0wpP//4lma/wAbx67/AAAAAAj/AJewpP8AAAAABf8ADSFI/wAAAAD/AA064f8ABxR7/wAIKPb/AAtj1wj/ABfPXP8AIaZmBf8ACnhS/wAQHrgF/wEoMKT/AAAAAAX/AA64Uv//0D1xBf8AA8Uf///znCn/AAqcKf//9/1x/wAMo9f/AAAAAAj/AI+rhf8AAAAABf8AGDCk/wAAAAD/ABPFH/8AG/1x///4OuH/ABfFHwj//vBrhf8AssKPFf//dDrh/wAAAAAF/wBeT1z/AI/euAUO+Zj/AlrCH/8CgpcKFf/+PvXD/wAAAAAF///pMzP/AAAAAP//6vMz///ucKT///vrhf//6Y9cCP//mr1x//3PlwoF///7z1z//+jwpP8AD/Ck///s4Uj/ABeKPf8AAAAACP8B2fhS/wAAAAAF/wBZdcP/AAAAAP8AVbCk/wBHij3/AA/Zmv8AV/MzCP8ACsUf/wA7lwr/AANCj/8ADpcK/wAASj3/ABMHrgj/AABo9v8AF/Ck///5lHv/ABorhf//6Rma/wAdnCkI/wAYXrj/ABfR7P8AEEzN/wAdgo//AAV4Uv8AHnrhCP8AABcK/wAAnrj/AAAR7P8AAJ64/wAAFwr/AAFuFAj/AAmrhf8ANBR7Bf8AEQKP/wBeo9f//7+1w/8ATPhS//+fx67/AAAAAAj//53Ue///EpmaFf//F8o9////nrgF/wAAAAD/AAAAAP////1x/wAAEez/AAAFH/8AACj2CP8AC/XD/wBBuFIF/wAAKPb/AADuFP8AATrh/wABBR//AADwpP8AAAAACP8A6GFI/wAAAAAF/wAj3Cn/AAAAAP//8Eeu//+8euH//91j1/8AAAAACP//5pR7//8aij0V//8H0ez///+rhQX/AAAAAP8AAAAA/////XH/AAAMzf8AAAKP/wAAHrgI/wAL9cP/AEHR7AX/AAAo9v8AAOj2/wABMKT/AADzM/8AAPrh/wAAAAAI/wD4WZr/AAAAAAX/ACPXCv8AAAAA///wUez//7x64f//3WFI/wAAAAAIDvkV/wJwQl//AoMuFBX//qPMzf8AAAAABf//oUzN/wAAAAD//6UcKf//tE9c///u+uH//6LzMwj//8hMzf/+0V64Bf//96Zm///SPXH/AApcKf//1OZm/wAbHrj//9964Qj/ABseuP//331x/wAoj1z//+4XCv8ALoeu/wAAAAAI/wFdB67/AAAAAAX/ABZuFP8AAAAA/wAVgAD/ABHwpP8ABAAA/wAWD1wI/wARIUj/AF8R7AX/AAQ1w/8AFwzN///wDM3/ABMhSP//6HMz/wAAAAAI//7Q9cP/AAAAAAX///wj1/8AAAAA///8szP/AAFmZv///d64/wACjM0I///94Uj/AAKMzf///zMz/wADeuH/AACuFP8AA8o9CP8AL2Zm/wEFI9cF/wABlHv/AAimZv8ACLhS/wAHUez/AAjFH/8AAAAACP8BLweu/wAAAAAF/wAWyj3/AAAAAP8AFQzN/wARj1z/AAQUe/8AFmuFCP8AEMzN/wBc49cF/wAENcP/ABcKPf//8BHs/wATIUj//+hwpP8AAAAACA75df8CQBm+/wKEGZoV//5Z4Uj/AAAAAAX//+mR7P8AAAAA///qgo///+4PXP//+/1x///p8KQI//+aeuH//c4R7AX///vPXP//6PMz/wAP3rj//+zhSP8AF4o9/wAAAAAI/wGmHrj/AAAAAAX/AF8AAP8AAAAA/wBbBR//AEv4Uv8AENwp/wBdYUgI/wA2x67/AS8hSAX/AAhHrv8ALbXD///1o9f/ACsMzf//5OZm/wAgdcMI///k2Zr/ACCCj///124U/wAR49f//9F4Uv8AAAAACP/+rNHs//4xGZoV///94Uj/AAKHrv///zMz/wADgAD/AACrhf8AA8euCP8AL1R7/wEGQAAF/wABij3/AAimZv8ACMeu/wAHSj3/AAjR7P8AAAAACP8AyJwp/wAAAAAF/wAD3Cn/AAAAAP8AA0zN///+nCn/AAIhSP///XMzCP8AAh64///9czP/AADKPf///IUf////VHv///wzMwj//9CXCv/++cKPBf///nCk///3WZr///dHrv//+LXD///3OFL/AAAAAAj//zdj1/8AAAAABf///CPX/////XH///y1w/8AAWj2///93rj/AAKMzQgO+Uf/Aqu7B/8CgxmaFf/97W4U/wAAAAAF///ph67/AAAAAP//6nhS///uBR////v64f//6eZmCP//mqPX//3PJmYF/wAAAAD////9cQX///4FH///9NR7/wACnrj///VwpP8ABrrh///39cMI/wAGvXH///f1w/8ACf1x///7j1z/AAteuP8AAAAACP8CEpHs/wAAAAAF/wAO3Cn/AAAAAP8ADbXD/wALcKT/AAKhSP8ADpwpCP8AFij2/wB7QAAF/wABVwr/AAduFP///kKP/wAHD1z///uAAP8ABWFICP//+4AA/wAFYUj///lcKf8AAvXD///4czP/AAAAAAj//o9o9v///89cBf8ACvMz/wA8q4UF/wAAKPb/AADuFP8AATXD/wABBR//AAD1w/8AAAAACP8BKJwp/wAAAAAF/wAO2Zr/AAAAAP8ADbMz/wALbhT/AAKmZv8ADpmaCP8AE71x/wBtHrgF/wABVwr/AAduFP///kKP/wAHD1z///uAAP8ABWFICP//+4AA/wAFYUj///lcKf8AAvXD///4czP/AAAAAAj//teUe////89cBf8AC7XD/wBBAo8F/wAAKPb/AADuFP8AATXD/wABBR//AADzM/8AAAAACP8BcMUf/wAAAAAF/wAO3rj/AAAAAP8ADbMz/wALeFL/AAKhSP8ADqPXCP8AFYAA/wB20ewF/wACwo//AA84Uv//9Vma/wAM+FL///BMzf8AAAAACA75Mv8CqneV/wKCAo8V//3ubhT/AAAAAAX//+k1w/8AAAAA///q8KT//+5uFP//++uF///pkewI//+a0ez//dAmZgX/AAAAAP////rhBf///gKP///02Zr/AAKcKf//9XMz/wAGuFL///gAAAj/AAa1w///9/hS/wAJ+FL///uUe/8AC1wp/wAAAAAI/wB21Hv/AAAAAAX/ABbKPf8AAAAA/wAVDM3/ABGPXP8ABBcK/wAWbhQI/wAjtcP/AMWPXAX/AAAmZv8AAOuF/wABOFL/AAEFH/8AAPMz/wAAAAAI/wEoBR//AAAAAAX/AA7euP8AAAAA/wANtcP/AAtuFP8AAqFI/wAOmZoI/wATpmb/AGzzMwX/AAFXCv8AB2j2///+Qo//AAcKPf//+4AA/wAFY9cI///7fXH/AAVmZv//+V64/wAC+FL///hzM/8AAAAACP/+2CZm////z1wF/wALuFL/AEDuFAX/AAAo9v8AAOuF/wABNcP/AAEFH/8AAPCk/wAAAAAI/wFwB67/AAAAAAX/AA7euP8AAAAA/wANtcP/AAtuFP8AAp64/wAOmZoI/wAVaPb/AHaj1wX/AAFXCv8AB0o9///+R67/AAbzM///+4zN/wAFVwoI///7jM3/AAVXCv//+SZm/wADEez///iHrv8AAAAACA75lf8C3Prm/wKA1woV//42QAD/AAAAAAX//6DPXP8AAAAA//+kwo///7PXCv//7wzN//+iY9cI///J6Pb//tS9cQX//+6mZv//oVR7/wBATM3//7LcKf8AYEeu/wAAAAAI/wHquuH///74Uv//xZR7/wAAHCn/ABnXCv8AAAAACP8AAA9c/wAAAAD/AAAMzf8AAAAA/wAAFHv/AAAAAAj/ABZmZv8AAAAA/wAVcKT/ABHo9v8ABAKP/wAWFwoI/wA6HCn/AUHZmgX/AAIKPf8ACyPX///9a4X/AAqPXP//+U9c/wAIAo8I///5Sj3/AAgKPf//9geu/wAEbhT///SeuP8AAAAACP/+2HhS/wAAAAAF///xIUj/AAAAAP//8kzN///0kez///1euP//8Wj2CP//7FcK//+TNcMF///+q4X///iUe/8AAb1x///48KT/AAR64f//+p64CP8ABIAA///6nrj/AAaj1////Qeu/wAHjM3/AAAAAAj/AIeMzf8AADMzBf//9PXD///C6PYF////1wr///8R7P///seu///++uH///8PXP8AAAAACP//A3hS/wAAAAAF///8I9f/AAAAAP///LMz/wABZmb///3euP8AAozNCP///eFI/wACh67///8zM/8AA4AA/wAArhT/AAPMzQj/AC8mZv8BBTrhBf8AAY9c/wAIpmb/AAi9cf8AB0zN/wAIxR//AAAAAAj/AZxrhf8AAAAABf8AFmuF/wAAAAD/ABWAAP8AEfCk/wAEAAD/ABYMzQj/ABBR7P8AWnhSBf8ABDCk/wAXHrj///AUe/8AEwzN///ogo//AAAAAAgO+X7/AsL0lf8CggKPFf//iSuF/wAAAAAF///pNcP/AAAAAP//6vMz///ubhT///vrhf//6ZHsCP//3J64//88Sj0F////1wr///8XCv///s9c////DM3///8FH/8AAAAACP//GeFI////uFIF/wAjXrj/AMOwpAX/AAQcKf8AFxR7///wFwr/ABMUe///6IKP/wAAAAAI//+JLhT/AAAAAAX//+kzM/8AAAAA///q8zP//+5uFP//++uF///pkewI//+a1Hv//dAo9gX///vHrv//6OPX/wAP/XH//+zuFP8AF4KP/wAAAAAI/wB21Hv/AAAAAAX/ABbKPf8AAAAA/wAVD1z/ABGPXP8ABBR7/wAWbhQI/wAkCj3/AMdR7AX/AAAo9v8AAOj2/wABNcP/AAEFH/8AAPCk/wAAAAAI/wDmHrj/AAAzMwX//9wKPf//OLrhBf///fhS///03rj/AAKR7P//9XMz/wAGszP///f64Qj/AAa1w///9/Mz/wAJ9cP///uR7P8AC2PX/wAAAAAI/wB20ez/AAAAAAX/ABbKPf8AAAAA/wAVD1z/ABGPXP8ABBR7/wAWa4UI/wBlLhT/Ai/ZmgX/AAAAAP8AAAo9Bf8ABAeu/wAXJmb///APXP8AEwKP///ojM3/AAAAAAgO98z/ARCL5f8CggKPFf//iRcK/wAAAAAF///pMzP/AAAAAP//6vCk///ua4X///vuFP//6ZR7CP//mtR7//3QKPYF///9+FL///TcKf8AApHs///1dcP/AAawpP//9/1xCP8ABrhS///38KT/AAn1w///+5R7/wALYUj/AAAAAAj/AHbR7P8AAAAABf8AFszN/wAAAAD/ABUMzf8AEY9c/wAEFHv/ABZuFAj/AGUwpP8CL9cKBf8ABDCk/wAXHrj///AUe/8AEw9c///ogo//AAAAAAgO+Pb/Aj7wFP8CggzNFf//iSuF/wAAAAAF///pNcP/AAAAAP//6vCk///ucKT///vrhf//6ZR7CP//tiuF//5nK4UF///+cKT///dcKf//9zrh///4szP///cwpP8AAAAACP/+3quF/wAAAAAF///pMzP/AAAAAP//6vMz///ucKT///vrhf//6Y9cCP//7t64//+g7hQF///99cP///TcKf8AApR7///1czP/AAarhf//9/rhCP8ABrhS///3+FL/AAn1w///+49c/wALY9f/AAAAAAj/AU164f///+j2Bf8AXwKP/wAAAAD/AFsAAP8ATAUf/wAQ3rj/AF1uFAj/AE3Cj/8BrnrhBf8AAgo9/wALI9f///1rhf8ACoeu///5T1z/AAgFHwj///lKPf8ACAo9///2DM3/AARuFP//9Jwp/wAAAAAIDvlg/wLlq9L/AoKuFBX//0bHrv8AAAAABf//8+PX/wAAAAD///O4Uv//+tR7///2tcP///b9cQj//wIwpP//C2PXBf///+PX////6Pb////hSP///+4U////5mb////o9gj/AAAAAP8AAAKP/wAAAAD/AAAFH/8AAAAA/wAAAo8I/wAnCj3/ANgR7AX/AAQzM/8AFwo9///wD1z/ABMhSP//6HMz/wAAAAAI//+JK4X/AAAAAAX//+k1w/8AAAAA///q8KT//+5wpP//++4U///pkewI//+a5mb//dA9cQX///vMzf//6PMz/wAP8KT//+zeuP8AF4o9/wAAAAAI/wB21wr/AAAAAAX/ABbKPf8AAAAA/wAVDM3/ABGPXP8ABBR7/wAWcKQI/wAJHCn/ADJUewX/AACwpP8AA7Mz/wACB67/AAOhSP8AAweu/wAC49cI/wBPzM3/AExuFAX/AG3rhf//XWuFBf8ABozN///2YUj/AAruFP//+nrh/wAMgAD/AAAAAAj/ALk64f8AAAAABf8ACGFI/wAAAAD/AAgPXP8ABPrh/wAEHrj/AAeuFAj/AAOUe/8ABrXD////1wr/AAdrhf///CPX/wAFxR8I//891wr/AR8j1wX////64f8AABwp/wAAFHv/AACZmv8AALXD/wAAqPYI/wErqPb/ASDHrgX/AA1j1/8ADSj2///5BR//ABRrhf//7oKP/wAAAAAIDvj7/wIWskv/ALE9cRX//t6Ue/8AAAAABf///CPX/wAAAAD///yzM/8AAWZm///93rj/AAKKPQj///3hSP8AAozN////NcP/AAN64f8AAK4U/wADyj0I/wBJ0ez/AZjKPQX/AARMzf8AFxcK///wHrj/ABMcKf//6HXD/wAAAAAI//+JLhT/AAAAAAX//+k1w/8AAAAA///q8KT//+5wpP//++uF///pj1wI//+a1Hv//dArhQX///34Uv//9Nwp/wACkez///V1w/8ABrCk///3+uEI/wAGuFL///fzM/8ACfXD///7kez/AAthSP8AAAAACP8B0Rma/wAAAAAF/wAWyj3/AAAAAP8AFQ9c/wARj1z/AAQUe/8AFmuFCP8AESFI/wBfEewF/wAEMzP/ABcUe///8A9c/wATIUj//+hzM/8AAAAACA76Kv8DbuGU/wKBq4UV//92Sj3/AAAAAAX///Aj1/8AAAAA///v3Cn///bwpP//9vMz///yB64I//76T1z//neXCgX///9AAP///twp///+2Zr/AAACj////1cK/wAAFHsI////h67/AAAR7P///muF/wAAXrj///+AAP8AAaPXCP//lHCk/wGFrhQF///7o9f/AA8Hrv//8nhS/wAJszP//+9rhf8AAAAACP//dkUf/wAAAAAF///pNcP/AAAAAP//6vCk///ucKT///vrhf//6ZHsCP//muZm//3QgAAF///7zM3//+jzM/8AD/Ck///s3rj/ABePXP8AAAAACP8Aa0o9/wAAAAAF/wAWyj3/AAAAAP8AFQzN/wARj1z/AAQUe/8AFm4UCP8AI8Uf/wDGBR8F/wBCIUj//yq64QX/AARcKf//8Prh/wANh67///ZHrv8AEJR7/wAAAAAI/wCOFHv/AAAAAAX/AA/cKf8AAAAA/wAQIUj/AAkR7P8ACQzN/wAN+FII/wCPNcP/ANYKPQX//9zAAP//PRcKBf///fhS///03rj/AAKR7P//9XMz/wAGsKT///f9cQj/AAa4Uv//9/Ck/wAJ9cP///uR7P8AC2Zm/wAAAAAI/wBrR67/AAAAAAX/ABbKPf8AAAAA/wAVDM3/ABGPXP8ABBR7/wAWbhQI/wBlGZr/Ai964QX/AARHrv8AFwAA///wI9f/ABM1w///6Fwp/wAAAAAIDvma/wLe/2n/AoHCjxX//4oFH/8AAAAABf//6TMz/wAAAAD//+rzM///7nCk///764X//+mPXAj//8trhf/+3MUfBf///8AA///+uuH///8XCv///4o9////R67////cKQj///+Hrv///+Zm///+aPb////PXP///yj2/wABOFII//9Nnrj/AT0AAAX///mAAP8ACaPX///1DM3/AAWHrv//81wp/wAAAAAI//9plHv/AAAAAAX//+kzM/8AAAAA///q8zP//+5wpP//++uF///pj1wI//+a5mb//dB9cQX///vKPf//6OFI/wAQDM3//+z1w/8AF3hS/wAAAAAI/wB1+FL/AAAAAAX/ABbKPf8AAAAA/wAVD1z/ABGPXP8ABBR7/wAWa4UI/wA5B67/ATtrhQX/AAAAAP8AAAo9Bf8AACuF/wAA+uH/AACZmv8AAJma/wABB67/AAA4Ugj/AAB64f8AABcK/wABoUj/AAA4Uv8AAN64///+wAAI/wDCK4X//qq64QX/AAaPXP//9mFI/wAK9cP///p9cf8ADIo9/wAAAAAI/wCCR67/AAAAAAX/ABbMzf8AAAAA/wAVDM3/ABGPXP8ABBR7/wAWcKQI/wBlGZr/Ai+HrgX/AAQcKf8AFyZm///wCj3/ABMXCv//6Hrh/wAAAAAIDvm1/wJ/pMf/AoQEcRX//pStKP8AAAAABf//oQCm/wAAAAD//6T8O///tAWK///vIB3//6Kewgj//8k7/P/+0N7xBf//7xBu//+iSg7/AD9klv//sivU/wBhDmT/AAAAAAj/AWtS2P8AAAAABf8AXv9a/wAAAAD/AFsDxf8AS/p2/wAQ3+P/AF1hPgj/ADbEBP8BLyEPBf8AEOlM/wBdrIn//8CuPf8ATd2W//+e5Q//AAAAAAj//mGDeP/+OulhFf8AL2m3/wEGP3UF/wABi0n/AAim2P8ACMY3/wAHSp7/AAjSw/8AAAAACP8BEYKE/wAAAAAF/wAD3DX/AAAAAP8AA08K///+lzn/AAIh3v///XN4CP8AAiHe///9dpv/AADIx////IHo////U3X///w2nQj//9CvYv/++cOuBf///m5x///3WSj///c5yf//+LI////3MGD/AAAAAAj//u5hP/8AAAAABf///CPL/wAAAAD///yw9v8AAWWj///93iL/AAKMiAj///3kaP8AAoyI////NBb/AAN+GP8AAK+u/wADyWMIDvmA/wJar/b/AoKCjxX//j8Hrv8AAAAABf//6ZR7/wAAAAD//+qCj///7g9c///7+uH//+nwpAj//5q9cf/9z6j2Bf//+89c///o5mb/AA/4Uv//7OuF/wAXhR//AAAAAAj/AHarhf8AAAAABf8AFso9/wAAAAD/ABUMzf8AEY9c/wAEEez/ABZuFAj/ABT9cf8AdEUfBf8AACuF/wAA7hT/AAE4Uv8AAQUf/wAA8KT/AAAAAAj/AR+9cf8AAEAABf8AXwAA/wAAAAD/AFsCj/8AS/rh/wAQ4Uj/AF1hSAj/ABnUe/8Ajyj2Bf8AERHs/wBelHv//7+9cf8ATPXD//+fsKT/AAAAAAj//8BwpP//Pg9cFf//7vXD//+hx64F///9Uez///GeuP//8frh///0Sj3///Fo9v8AAAAACP//F8zN////z1wF/wAZxR//AI6KPQX/AAAmZv8AAOuF/wABOuH/AAECj/8AAPCk/wAAAAAI/wDoZmb/AAAAAAX/AAbKPf8AAFma/wAFczP///1AAP8AA8KP///7h64I/wADx67///uFH/8AAW4U///56Pb///7Ue///+XhSCA75tf8Cf8Ji/wKEGZoV//6UlHv/AAAAAAX//6EFH/8AAAAA//+k+uH//7QFH///7yFI//+inrgI///JOFL//tDeuAX///fAAP//0keu/wAKaPb//9TwpP8AGyFI///fij0I/wAbI9f//9+FH/8AKI9c///uHCn/AC6FH/8AAAAACP8A+uuF/wAAaPYF/wATY9f//6tZmgX/AAIMzf//9zhS/wAFUez///ieuP8AB5R7///7YUgI/wAMzM3///g4Uv8AEvhS/wAAWZr/AA4Zmv8AA24UCP8AEaPX/wAET1z/ABFUe/8ABYzN/wAQ2Zr/AAa9cQj/ABIPXP8ABzrh/wASJmb/AAbAAP8AEk9c/wAGuuEI/wAA49f/AABUe/8AAOZm/wAAVHv/AADj1/8AAFR7CP8AFkeu/wAIMKT/AA5Cj/8AF5ma///7QAD/ABTR7Aj///W64f8ALMzNBf////Mz/wAAQAD/AABPXP8AANcK/wABB67/AACj1wj/ADZuFP8AH1Hs/wAmpmb/ADSrhf8ACkeu/wA464UI/wA2x67/AS8hSAX/ABEKPf8AXqFI//+/rhT/AE0Cj///n71x/wAAAAAI//5hlwr//jro9hX/AC9o9v8BBj1xBf8AAY9c/wAIpmb/AAi9cf8AB0zN/wAIxR//AAAAAAj/ARGCj/8AAAAABf8AA9wp/wAAAAD/AANPXP///pcK/wACIUj///11wwj/AAIhSP///XXD/wAAyj3///yCj////1R7///8NcMI///QqPb//vnAAAX///5zM///91wp///3OuH///izM///9yuF/wAAAAAI//7ufXH/AAAAAAX///wj1/8AAAAA///8rhT/AAFo9v///d64/wACh64I///94Uj/AAKMzf///zMz/wADgAD/AACwpP8AA8euCA75kv8CWsRw/wKClwoV//4+9cP/AAAAAAX//+mR7P8AAAAA///qgo///+4PXP//+/1x///p8KQI//+auuH//c+XCgX///vPXP//6OZm/wAP+FL//+zrhf8AF4Uf/wAAAAAI/wB2vXH/AAAAAAX/ABbHrv8AAAAA/wAVDM3/ABGPXP8ABBma/wAWbhQI/wAVAAD/AHRHrgX/AAAo9v8AAOj2/wABOuH/AAEHrv8AAO4U/wAAAAAI/wCPuuH/AAArhQX/AATFH/8AAAAA/wAD0ez///3Ue/8AAej2///8QAAI/wBC3Cn//3wj1wX/AAihSP//7tR7/wAOwo////zcKf8AIc9c/wAAAAAI/wA2PXH/AAAAAP8AFXrh/wABuFL/AD9j1/8AAAAACP8AC4o9/wAAAAD/AApR7P8ABdma/wAFuuH/AAnCjwj/AAW4Uv8ACceu/wAAB67/AAvcKf//+lcK/wAKFHsI//+264X/AIBUewX/AAAAAP8AAEeu/wAAcKT/AADo9v8AARma/wAAij0I/wA88KT/AB2cKf8ALNR7/wA41wr/AAs64f8APd64CP8AGdR7/wCPQAAF/wARJmb/AF6Zmv//v7rh/wBNBR///5+zM/8AAAAACP//wHMz//8+JmYV///u8zP//6HKPQX///1R7P//8Zwp///x+uH///RHrv//8WuF/wAAAAAI//8Xyj3///+euAX/AAAAAP8AAAAA////+uH/AAAUe/8AAAeu/wAAKPYI/wAZwo//AI564QX/AAArhf8AAO4U/wABMzP/AAEFH/8AAPCk/wAAAAAI/wDoZmb/AAAAAAX/AAaj1/8AAAAA/wAFtcP///2KPf8AA71x///7h64I/wADvXH///uKPf8AAWj2///58KT///7R7P//+XrhCA75dP8CrxD+/wKBzM0V//5buFL/AAAAAAX//6EAAP8AAAAA//+k+uH//7QFH///7yPX//+inrgI///0YUj//7/KPQX///fCj///0kzN/wAKYUj//9T1w/8AGxma///fkewI/wAbJmb//9+FH/8AKJHs///uHrj/AC6Mzf8AAAAACP8BHDhS/wAAAAAF/wAD3Cn/AAAAAP8AA0zN///+mZr/AAIj1////XMzCP8AAh64///9czP/AADHrv///IKP////VHv///wzMwj///qmZv//4j1xBf///nCk///3Vwr///c4Uv//+LMz///3MKT/AAAAAAj//nTUe/8AAAAABf//6TCk/wAAAAD//+rzM///7m4U///77hT//+mR7Aj//+7cKf//oQeuBf//+8zN///o5mb/ABAAAP//7OuF/wAXgAD/AAAAAAj/Aa7mZv///+uFBf8AXv1x/wAAAAD/AFsFH/8AS/hS/wAQ3rj/AF1hSAj/AAqeuP8AOt64Bf8ACD1x/wAtq4X///WcKf8AKwUf///k49f/ACBzMwj//+TZmv8AIIAA///XbhT/ABHj1///0XhS/wAAAAAI//7jxR//AAAAAAX///wj1/8AAAAA///8sKT/AAFmZv///eFI/wACij0I///93rj/AAKMzf///zhS/wADeuH/AACrhf8AA8o9CP8ABzCk/wAno9cF/wABjM3/AAio9v8ACMUf/wAHSj3/AAjUe/8AAAAACP8BgHrh/wAAAAAF/wAWz1z/AAAAAP8AFQzN/wARkez/AAQR7P8AFmj2CP8AEGZm/wBaeuEF/wAELhT/ABc64f//7/rh/wATDM3//+iFH/8AAAAACA75I/8ClHD2/wKCAo8V//3YLhT/AAAAAAX//+k4Uv8AAAAA///q7hT//+5uFP//++uF///pkewI///vszP//6WHrgX///364f//9Nwp/wACj1z///V4Uv8ABrCk///3+uEI/wAGuFL///fzM/8ACfXD///7j1z/AAtmZv8AAAAACP8ArZHs/wAAMzMF//+ywAD//lSeuAX///364f//9Nwp/wACj1z///VzM/8ABrCk///3/XEI/wAGtcP///fwpP8ACfhS///7lHv/AAthSP8AAAAACP8AdtHs/wAAAAAF/wAWx67/AAAAAP8AFQ9c/wARj1z/AAQXCv8AFm4UCP8ATUKP/wGra4UF/wAALhT/AADwpP8AATXD/wABAo//AADwpP8AAAAACP8ArcUf/wAAAAAF/wAWzM3/AAAAAP8AFQzN/wARj1z/AAQR7P8AFm4UCP8AEGPX/wBaeuEF/wAAAAD/AAAFHwX/AAQeuP8AFyuF///wAAD/ABL9cf//6JcK/wAAAAAIDvmZ/wLivef/AoPXChX//4zzM/8AAAAABf//6TCk/wAAAAD//+rzM///7m4U///77hT//+mR7Aj//7X9cf/+Zm4UBf///nMz///3WZr///c4Uv//+LMz///3LhT/AAAAAAj//wej1/8AAAAABf///CZm/wAAAAD///yzM/8AAWPX///93rj/AAKMzQj///3euP8AAozN////MzP/AAN9cf8AAKuF/wADzM0I/wBKAo//AZmPXAX/AAQzM/8AFwzN///wIUj/ABMhSP//6HMz/wAAAAAI//+PHCn/AAAAAAX//+mXCv8AAAAA///qgAD//+4PXP//+/rh///p8KQI//+yAAD//lBHrgX//+8XCv//opcK/wA/DM3//7JMzf8AYMKP////vXEI/wE01Hv///89cQX/AAE1w/8AABR7Bf8AEUKP////64UF/wAAKPb/AAAAAP8AACj2/wAAAAD/AAAo9v8AAAAACP8AXuZm/wAAAAD/AFrPXP8AS89c/wAQ3rj/AF1hSAj/AE4uFP8BsJHsBf8AAAAA/wAACj0F/wAEHCn/ABb4Uv//8AzN/wATFHv//+h4Uv8AAAAACA75aP8C6P3c/wKBQo8V//9vlwr/AAAAAAX//+61w/8AAAAA///uoUj///VKPf//93hS///wEewI//8sRR///nWj1wX///9XCv///seu///+1Hv////o9v///yj2/wAAI9cI////eFL/AAAUe////kAA/wAAbhT///+mZv8AAej2CP//u0eu/wGHQo8F///9DM3/ABEKPf//8ceu/wALdcP//+3FH/8AAAAACP//b5cK/wAAAAAF///toUj/AAAAAP//8Ao9///uY9f/AAMhSP//7mFICP8AEOuF//+ho9cF/wAerhT//1UMzf8AAAAA/wAAAAD/ACHKPf//PFHsCP8AFBwp//+Lij0F/wAC8KT//+8FH/8ADpma///0Jmb/ABHzM/8AAAAACP8A1lHs/wAAAAAF/wARUez/AAAAAP8AEXCk/wAKzM3/AAieuP8AEBcKCP8AN0KP/wBneuEF/wBr1Hv/AMno9v8AAAAA/wAAAAD/AGTCj/8AulcKCP8ALlma/wBVwAAF/wAACj3/AAAMzQX/AASZmv8ACLhS/wAADM3/AAmwpP//+3XD/wAHij0I///7tcP/AAcR7P//+Hrh/wAED1z///chSP8AAAAACA76xP8EWt7C/wJ1+uEV///73Cn/AAccKf//+Drh/wAEPXH///cmZv8AAAAACP//bKj2/wAAAAAF///uwo//AAAAAP//7yj2///1x67///cuFP//8Cj2CP//XCuF//7YXrgF////Uez///7Mzf///twp////6Pb///84Uv8AAB64CP///3hS/wAAFHv///5AAP8AAG4U////nrj/AAHuFAj//8jR7P8BJa4UBf///Nma/wAQvXH///HR7P8AC0AA///uCj3/AAAAAAj//5l4Uv8AAAAABf//7uZm/wAAAAD//+61w///9XMz///3Zmb///BKPQj//10FH//+1zhSBf///0o9///+szP///6zM/////1x////WZr/AAAeuAj///964f8AABcK///+Sj3/AABmZv///6FI/wAB64UI///Hj1z/ASSXCgX///zCj/8AEK4U///x1wr/AAszM///7h64/wAAAAAI//9suuH/AAAAAAX///bo9v8AAAAA///23rj///uR7P//+c9c///4jM0I///6OFL///kPXP///Yeu///3czP/AAF64f//+AKPCP8AbIUf//2+LhQF/wADI9f//+8zM/8ADjCk///0tcP/ABH64f8AAAAACP8AfJcK/wAAAAAF/wAQ+uH/AAAAAP8AETXD/wAKcKT/AAicKf8AD4o9CP8AoT1x/wEhwo8F/wAArhT/AAFAAP8AATrh/wAABR//AAC1w////+PXCP8AAIAA////64X/AAGwpP///5R7/wAAXCn///4hSAj/ADfwpP/+4UUfBf8AA0AA///vYUj/AA4rhf//9NcK/wAR3Cn/AAAAAAj/AHyXCv8AAAAABf8AER64/wAAAAD/ABFPXP8ACozN/wAIlwr/AA+1wwj/AT1Ue/8CQco9Bf8ABN64/wAIpmb/AABFH/8ACbCk///7j1z/AAecKQgO+VX/AsfjAv8CgUo9Ff//UiPX/wAAAAAF///y8KT/AAAAAP//8pR7///54Uj///aZmv//9cKPCP//jA9c//+B8zMF////T1z///89cf///wzN/////XH///+Hrv8AAAzNCP///vXD/wAAHCn///8Ue/8AAJwp////gAD/AADj1wj//7rCj/8AfAeuBf//+c9c/wAK9cP///QwpP8ABoeu///yaPb/AAAAAAj//1Ij1/8AAAAABf//9Oj2/wAAAAD///VzM///+b1x///6Hrj///XuFAj///r64f//92Zm////nCn///ZAAP8ABFcK///4TM0I/wCSUez//vnuFAX/AALUe///+uuF///+kez///jzM///+wKP///6mZoI//8C4Uj//uyzMwX///fwpP//9zCk///9nCn///SMzf8ABD1x///2YUgI/wADxR////dzM/8ACDrh///649f/AAoFH/8AAAAACP8Ardwp/wAAAAAF/wANDM3/AAAAAP8ADWuF/wAGHrj/AAlj1/8ACj1xCP8AgAUf/wCLNcMF/wAAx67/AADXCv8AAP1x/wAAAAD/AAB64f////MzCP8AAHhS////8KT/AAEuFP///7rh/wAAuFL///6zMwj/AEyR7P//dso9Bf8ABhwp///1BR//AAvKPf//+XCk/wANo9f/AAAAAAj/AK3Zmv8AAAAABf8ACxR7/wAAAAD/AAqMzf8ABj1x/wAF4Uj/AAoKPQj/AAUHrv8ACJcK/wAAZmb/AAnFH///+6Zm/wAHwAAI//9mTM3/ARNHrgX///04Uv8ABQAA/wABfXH/AAc1w/8ABOZm/wAFVwoI/wDxAAD/AQYPXAX/AAgUe/8ACL1x/wACaPb/AAtrhf//+8o9/wAJqPYI///8QAD/AAiZmv//98eu/wAFI9f///X64f8AAAAACA75K/8Cw5c9/wJYhR8V/wAOD1z/ABIrhf//9fCk/wAXZmb//+pwpP8AAAAACP//aUzN/wAAAAAF///xY9f/AAAAAP//8ZHs///4q4X///ZwpP//88AACP//bRR7//9D2ZoF////QAD///8PXP///uj2/////XH///94Uv8AABR7CP///5Hs/wAAEez///6Mzf8AAEzN////WZr/AAGHrgj//7IUe/8Auaj2Bf//+rrh/wAM/XH///NcKf8ACA9c///w5mb/AAAAAAj//2lR7P8AAAAABf//9auF/wAAAAD///XR7P//+l64///5+uH///bmZgj///qZmv//9+PX///+1wr///bAAP8AA1wp///3+uEI/wCY7hT//pNhSAX/AACuFP//+keu/wAAmZr///qFH/8AAJma///6R64I///fz1z//03CjwX///vHrv//6Oj2/wAP+uH//+zo9v8AF4eu/wAAAAAI/wB20ez/AAAAAAX/ABbHrv8AAAAA/wAVDM3/ABGPXP8ABBma/wAWbhQI/wAgOuH/ALJhSAX/AAcUe/8AD8o9Bf8BHgeu/wFuWZoFDvlP/wKnxJj/AoFuFBX//eC1w/8AAAAABf//6TMz/wAAAAD//+rwpP//7m4U///78KT//+mUewj//++Zmv//pYeuBf//+89c///o5mb/AA/9cf//7O4U/wAXgAD/AAAAAAj/ARHPXP8AAGFIBf8AAAo9////2Zr////o9v///z1x///+uuH///8Uewj//rXHrv/++d64Bf//5H1x///sY9f//+0Hrv//4xHs///6bhT//+Ej1wj///DZmv//rF64Bf//+89c///o8zP/AA/zM///7N64/wAXj1z/AAAAAAj/AiQ4Uv8AAAAABf8AFseu/wAAAAD/ABUMzf8AEY9c/wAEFHv/ABZwpAj/ABEPXP8AXqPXBf8ABDMz/wAXHrj///ACj/8AEw9c///ogAD/AAAAAAj//u164f///5wpBf////hS/wAAJmb/AAAR7P8AAMUf/wABRR//AADwpAj/AUaMzf8BBjhSBf8AGzMz/wATtcP/ABLFH/8AHM9c/wAFjM3/AB6Hrgj/AA5j1/8AT8UfBf8ABEAA/wAW6Pb///AXCv8AEy4U///obhT/AAAAAAgO+HD/AegdEP8DHfCkFf//0Io9/wAAAAD//76euP8AABR7////B67/AAAAAAj//5luFP8AAEo9//+d4Uj//65AAP//7co9//+bFHsI///8mZr//+04Uv///QUf///vfXH///1hSP//8WuFCP//+uFI///jmZr///QMzf//5U9c///uPXH//+k9cQj//7xo9v//qWuFBf//+lcK///5TM3///1uFP//9zrh/wAC0ez///gFHwj/AAAcKf///6uF/wAABR////+euP8AACFI////o9cI/wAfz1z//7QmZgX/AA1Mzf//4Eeu/wAD3Cn//90zM///+eZm///eJmYI///58KT//95o9v//+Qeu///ZY9f///f1w///04KPCP//7co9//+beFL/AEQZmv//rm4U/wBmMzP///+1wwj/ACyuFP///+PX/wBG9cP///9euP8AAAAA/wAAAAAI/wAWeFL/AAAAAP8AFa4U/wASGZr/AAQCj/8AFh64CP8AAAAA/wAAAAD/ABLHrv8AZ7XD/wAADM3/AAA64Qj/AALMzf8AD2j2///2Eez/AA89cf//8e4U/wAGY9cI///+aPb/AAC4Uv///mPX/wAAj1z///5euP8AAHCkCP//+U9c/wAB1Hv///kmZv///64U///464X/AAAAAAj///ReuP8AAAAA///0XCn/AAAAAP//9F64/wAAAAAI///o9cP/AAAAAP//7pma/wAU6Pb/AAQXCv8AFquFCP8ABY9c/wAez1z/AAT64f8AG5Hs/wAEczP/ABi4Ugj/AATFH/8AGnCk///9Ao//ABszM///9ZcK/wAYyj0I///wpmb/ACSXCv//6xHs/wAx5mb/AAAAAP8AAAAACP///9wp/wAAWZr////9cf8AAGFI////49f/AABXCgj///0uFP8AB/XD/wACj1z/AAjKPf8ABaj2/wAGszMI/wBJbhT/AF4KPQX/AA3zM/8AEdwp/wAJXCn/ABTj1/8ABAKP/wAWSj0I/wABDM3/AAXcKf8AAR64/wAGMzP/AAEwpP8ABpHsCP8AA/Ck/wAV3Cn/ABLzM/8AEAUf/wAWNcP/AAArhQj/ABjo9v8AAC4U/wAb2Zr/AAA4Uv8AAAAA/wAAAAAI/wAWfXH/AAAAAP8AFaj2/wASGZr/AAQCj/8AFh64CP8AEtcK/wBn8zMF/wAECj3/ABYmZv//8PCk/wASIUj//+l9cf8AAAAACA731/8BNyy6/wMtszMV//98dcP/AAAAAAX//+pFH/8AAAAA///rR67//+6zM////B64///qo9cI///9eFL///IPXP//1go9//8ZT1z//5KPXP/9on1xCP///Bwp///qoUj/AA6FH///7rCk/wAVwo//AAAAAAj/AINzM/8AAAAABf8AFb1x/wAAAAD/ABS4Uv8AEU9c/wAD49f/ABVeuAj/AARKPf8AF71x/wCMYUj/AwdMzf8ACT1x/wAzGZoI/wAD3Cn/ABVcKf//8ZR7/wARTM3//+pCj/8AAAAACA74cf8Bw2YU/wGJFHsV////49f/AABUe/////1x/wAAYUj////cKf8AAFwpCP//4DCk/wBL3CkF///ysKT/AB+1w////CZm/wAizM3/AAYcKf8AIdmaCP8ABgzN/wAhlwr///kMzf//3nhS/wAICj3/ACx9cQj/ABI1w/8AZIeu//+75mb/AFGR7P//mczN/wAASj0I///TUez/AAAcKf//uQzN/wAAoUj/AAAAAP8AAAAACP//6YUf/wAAAAD//+pR7P//7eZm///8AAD//+nhSAj/AAAAAP8AAAAA///tOFL//5hcKf////Ck////szMI///+MzP///YFH/8AAlwp///1nrj/AAaeuP//+DrhCP8ABMo9///6YUj/AAaPXP///KPX/wAHZmb///4MzQj/ABGo9v//+164/wAWj1z/AANmZv8AD2PX/wAAAAAI/wAXCj3/AAAAAP8AEWZm///rGZr///vo9v//6VR7CP//+nCk///hMKT/AAjuFP8ALJHs///7jM3//+dHrgj///s64f//5Y9c/wAC/XH//+TMzf8ACmj2///nNcMI/wAPWZr//9to9v8AFO4U///OGZr/AAAAAP8AAAAACP8AACPX////o9f/AAACj////564/wAAHCn///+rhQj/AALR7P//+Ao9///9cKT///c1w///+lcK///5TM0I//+2kez//6H1wwX///IMzf//7iPX///ouuH//6L4Uv//+/rh///pszMI///+8zP///omZv///uFI///5zM3///7PXP//+W4UCP///A9c///qIUj//+0Mzf//7/1x///px67////Uewj//+cZmv///89c///kJmb////Hrv8AAAAA/wAAAAAI///pgo//AAAAAP//6lR7///t5mb///wAAP//6eFICP//7Sj2//+YD1wF///8AAD//+ncKf8ADwo9///t3rj/ABaFH/8AAAAACP8AL3XD/wAAAAD/AEFhSP///+uF/wAA9cP/AAAAAAj/AGaR7P///7XD/wBiIUj/AFHAAP8AEjXD/wBk64UI/wADY9f/ABLFH/8AEOPX/wBYq4X/AAKhSP8ADpHsCP8ABSFI/wAcZmb/AAvwpP8AGrCk/wARwo//ABbCjwj/AEOZmv8AVpR7Bf8ABaj2/wAGszP/AAKPXP8ACMeu///9LhT/AAf4UggO+FEO98f/AMvKuf8BBA9cFf//fBHs/wAAAAAF///qKPb/AAAAAP//6zCk///uh67///wXCv//6p64CP//vwzN//6ZXCkF///8MKT//+qhSP8ADoAA///unrj/ABXrhf8AAAAACP8Ag/Mz/wAAAAAF/wAVvXH/AAAAAP8AFOPX/wARYUj/AAPrhf8AFV64CP8AQNma/wFmo9cF/wAD5mb/ABVhSP//8WuF/wAReFL//+oo9v8AAAAACP8ALnXD/wEG7hQV//97+uH/AAAAAAX//+pCj/8AAAAA///rFwr//+6KPf///DCk///qoUgI///phR///3vHrgX///wZmv//6nMz/wAOlHv//+64Uv8AFdR7/wAAAAAI/wCD8KT/AAAAAAX/ABXXCv8AAAAA/wAUz1z/ABFhSP8AA+j2/wAVczMI/wAWeuH/AIQ4UgX/AAPj1/8AFV64///xa4X/ABF1w///6ij2/wAAAAAIDvkk/wJ0Ahf/Ap+hSBX//2xKPf8AAAAABf8ACFR7/wAuuuEF/wABoUj/AAkwpP//+aj2/wAHjM3///ao9v////hSCP//0L1x////2ZoF///28zP////1w///96Zm///4/XH///5o9v//9xcKCP//949c///QrhQF//+H5mb/AAAAAAX//6FMzf8AAAAA//+lHCn//7RPXP//7vhS//+i8zMI///IT1z//tFeuAX///emZv//0j1x/wAKXCn//9TmZv8AGx64///feuEI/wAbHrj//999cf8AKI9c///uGZr/AC6Hrv8AAAAACP8AeEo9/wAAAAAF///3q4X//9FFHwX///8zM///+5R7/wABCj3///vMzf8AAquF///81HsI/wACsKT///zPXP8AA/XD///+QAD/AASFH/8AAAeuCP8ALzXD/wAAKPYF/wAJD1z/AAAHrv8ACFma/wAHAAD/AAGXCv8ACOuFCP8ACGuF/wAvVHsF/wCUXCn/AAAAAAX/ABZuFP8AAAAA/wAVfXH/ABHwpP8ABAKP/wAWD1wI/wARIUj/AF8R7AX/AAQ1w/8AFwzN///wDM3/ABMhSP//6HMz/wAAAAAI//7Q+FL/AAAAAAX///wj1/8AAAAA///8szP/AAFmZv///d64/wACij0I///94Uj/AAKMzf///zMz/wADeuH/AACuFP8AA8o9CP8AL2Zm/wEFJmYF/wABlHv/AAimZv8ACLhS/wAHT1z/AAjFH/8AAAAACP8BLwo9/wAAAAAF/wAWyj3/AAAAAP8AFQ9c/wARj1z/AAQUe/8AFm4UCP8AEMzN/wBc49cF/wAEMzP/ABcCj///8A9c/wATIUj//+hzM/8AAAAACA75Uv8CfdSF/wK4qPYV//8FUez/AAAAAAX//5luFP8AAAAA//+eEez//6464f//7ceu//+bMzMI///zFHv//7ij1wX///8Ue///+uj2////czP///sAAP///4Uf///7B64I///v+FL/AAAAAP//7v1x/wAAAAD//+2hSP8AAAAACP//7Bwp/wAAAAD//+0PXP//8C4U///8czP//+xzMwj//+6j1///n+PXBf///HMz///sczP/AA1Hrv//8C4U/wAT49f/AAAAAAj/ADgR7P////1xBf8AAtwp///78KT/AAFHrv//+rhS///+8zP///oo9gj///gCj///0/MzBf///a4U///zFwr///NzM///9ZcK///y5mb/AAAAAAj///HZmv8AAAAA///xQAD/AAAAAP//8IAA/wAAAAAI///9pmb/AAAAAAX//+oo9v8AAAAA///rMKT//+6hSP///BcK///qij0I///tyj3//5t1wwX///wcKf//6nMz/wAOlHv//+6euP8AFdcK/wAAAAAI/wA8gAD/AAAAAP//txwp/wAAFwr/AjYCj////+j2CP8AFT1x/wAAAAD/ABQ9cf8AEOZm/wADzM3/ABTeuAj/ABKHrv8AZsAABf8AA8zN/wAU4Uj///HPXP8AEOZm///qwo//AAAAAAj//yaUe/8AAAAA/wBbMzP/AAAAAP//ZKuF/wAAAAAI/wACa4X/AAvKPf8ACtHs/wA6uuH/AAGPXP8AC/rhCP8Af5R7////+uEF/wAT49f/AAAAAP8AEvCk/wAP0ez/AAOPXP8AE4o9CP8AEVcK/wBgMzMF/wADjM3/ABOMzf//8rhS/wAP0ez//+wcKf8AAAAACP//8lR7/wAAAAD//6meuP8AAAAA///yPXH/AAAAAAj///+Ue/8AAAAA////0ez/AAAAAP////XD/wAAAAAI////5mb/AAAAAP///+uF/wAAAAD////hSP8AAAAACP//8uPX/wAAAAD///dFH/8ACmZm/wACT1z/AAzrhQj/AAf9cf8ALAo9Bf8AAlHs/wAM64X/AAyMzf8ACmZm/wANGZr/AAAAAAj/ANLo9v8AAAAABf8AFdcK/wAAAAD/ABTPXP8AEWFI/wAD6Pb/ABV1wwj/ABI1w/8AZIeuBf8AA+j2/wAVj1z///Fo9v8AEWFI///qK4X/AAAAAAgO+Yr/AwZF0f8Cu5cKFf//WJHs/wAAAAAF///x+FL/AAAAAP//8ceu///4wAD///a1w///9BmaCP//XMKP//8u8zMF///7cKT///omZv//9nCk/wABfXH///0Cj/8ABw9cCP//qWj2/wDOWZoF///7KPb/AAvmZv//9GPX/wAHQAD///IR7P8AAAAACP//WJR7/wAAAAAF///tsKT/AAAAAP//8Qo9///sY9f/AAaAAP//8HrhCP8AkDhS//6oMzMF///yVwr/AAACjwX////R7P8AAAAA////1wr////o9v///9Hs/wAAAAAI//+nx67/AAAXCgX///bwpP8AAAUf///3oUj///kFH////lwp///3FwoI///3fXH//9GFHwX///5Ue///9tHs/wAGT1z///hrhf8ACVR7/////XEI/wCQAAD////XCgX/AAAhSP///sAA/wAAJmb///7Cj/8AACFI///+uFII///3IUj//87uFAX//8p4Uv8AAA9cBf///9Hs/wAAAAD////XCv///+Zm////z1z/AAAAAAj//6fHrv8AABmaBf//9vMz/wAAAo////ehSP//+Qeu///+Xrj///cXCgj///d9cf//0YUfBf///lHs///20ez/AAZR7P//+Gj2/wAJVHv////9cQj/AI2PXP///9cKBf//8zrh//+5Sj0F///8Fwr//+qKPf8ADpR7///uoUj/ABXXCv8AAAAACP8AhAUf/wAAAAAF/wAV1Hv/AAAAAP8AFM9c/wARXrj/AAPo9v8AFXXDCP8ADLrh/wBGeuEF/wBiRR/////j1wX/AAAwpP8AAAAA/wAAKPb/AAAUe/8AACuF/wAAAo8I/wA+D1z////o9gX/AAkMzf////rh/wAIXrj/AAb64f8AAaFI/wAI6PYI/wAIgo//AC5wpAX/AADPXP8ABHMz///++uH/AAQ1w////VcK/wADMzMI///9Vwr/AAMwpP///BHs/wABwo////uAAP8AAAAACP//X964/wAAMKQF/wAI6Pb/ADFUewX/AACFH/8AATCk/wAAh67/AAErhf8AAIeu/wABKPYI/wBdx67////mZgX/AAAwpP8AAAAA/wAAKPb/AAAZmv8AACuF/wAAAAAI/wA+DM3////mZgX/AAkPXP////1x/wAIXrj/AAb4Uv8AAaFI/wAI6PYI/wAIgAD/AC5zMwX/AADPXP8ABHMz///+/XH/AAQ1w////VcK/wADMzMI///9Vwr/AAMwpP///A9c/wABwo////uCj/8AAAAACP//jrCk/wAAI9cF/wEMoUj/AVgPXAX/AAwZmv8AD564///4MzP/ABOZmv//7Zwp/wAAAAAIDvi3/wGp4ub/AfIZmhX//zvcKf8AAAAABf//50zN/wAAAAD//+4Ue/8AFVHs/wAEXrj/ABhj1wj/AAaMzf8AJa4UBf8AA9Hs/wAVQAD/ABMPXP8AD+4U/wAVfXH/AAAAAAj/ANMPXP8AAAAABf8ACqj2/wAAAAD/AApMzf8ACJcK/wAB5mb/AAp9cQj/AAgZmv8ALLMzBf8AAYeu/wAIbhT///mFH/8AB8AA///3bhT/AAAAAAj//xYPXP8AAAAABf//wTXD/wAAAAD//8PXCv//zceu///02Zr//8JKPQj///HAAP//rnCk///+lwr/AAVhSP8AC6Zm///X+FII///1HCn///W1wwX//+3Mzf//7tHs///0HCn//+pZmv//+7Ck///oNcMI///swAD//6EXCgX///W4Uv//xxcK/wAlRR///9IMzf8AO3XD/wAAAAAI/wDEI9f/AAAAAAX/ABjAAP8AAAAA/wAR6Pb//+qcKf//+5Hs///npmYI///5IUj//9t4UgX///w1w///6xHs///s7hT///AXCv//6oeu/wAAAAAI//8plHv/AAAAAAX///VUe/8AAAAA///1tcP///do9v///hR7///1fXEI///364X//9NhSAX///51w///95Hs/wAGfXH///hCj/8ACIzN////+uEI/wDtT1z////wpAX/AD7PXP8AAAAA/wA8Jmb/ADI4Uv8ACyj2/wA9tcMI/wAN+uH/AEtuFP8AAvrh///+aPb///JcKf8AKrCkCP8ACkzN/wAKjM0F/wATij3/ABP64f8ADK4U/wAXsKT/AAR64f8AGNcKCP8AEpcK/wBXczMF/wAKB67/ADeFH///27Ck/wAu4Uj//8PCj/8AAAAACP//85wp//+KFHsV///x0ez//7j4UgX///wrhf//6uFI///s8zP///AUe///6oeu/wAAAAAI///UwAD////wpP//tkeu////8KT//71j1/8AAAAACP//50Uf/wAAAAD//+4j1/8AFVwp/wAEXCn/ABhZmgj/AA8cKf8AR+PXBf8AA64U/wAUa4X/ABMMzf8AD+uF/wAVeFL/AAAAAAj/ALbR7P8AAAAABf8AGLrh/////XH/ABHmZv//6p64///7lHv//+ej1wgO+Z//AjJ0cP8CBXhSFf//GFma/wAAAAAF///QK4X/AAAAAP//0hR7///ZxR////dj1///0P1xCP//4Uo9//9ZKPYF///764X//+mXCv8ABPhS///rAo//AA0hSP//8EeuCP8ADRma///wRR//ABPHrv//91ma/wAWx67/AAAAAAj/AOgcKf8AAAAABf8AB9wp/wAAAAD/AAfMzf8ABoUf/wABaPb/AAe4Ugj/AAlzM/8ANGj2Bf8AAJwp/wADUez///9Mzf8AAw9c///+K4X/AAI1wwj///4hSP8AAjrh///9Fwr/AAE9cf///Jma/wAAAAAI//8xOuH/AAAAAAX///sXCv8AAAAA///7dcP/AAIKPf///Qo9/wADjM0I///9B67/AAOKPf///szN/wAE0ez/AADcKf8ABNcKCP8AGiPX/wCP/XEF/wABszP/AAlPXP8ACLrh/wAHSj3/AAluFP8AAAAACP8AzsKP/wAAAAAF/wAH3Cn/AAAAAP8AB8zN/wAGhR//AAFo9v8AB7hSCP8ACUUf/wAzOFIF/wAAnCn/AANR7P///0zN/wADDM3///4o9v8AAjhSCP///iPX/wACMzP///0cKf8AAT1x///8lHv/AAAAAAj/ACEMzf8AkO4UFf/+qLCk/wAAAAD/ABiR7P8AAFma///zK4X///7R7Aj//6UZmv//99wp//+sFwr//7fKPf//7xwp//+ih64I///w8zP//6y64f//++j2///q1wr//+RhSP//ZauFCP//68KP//+OcKT/AE6Ue///sYKP/wBi8zP/AAAAAAj/AVdR7P8AAAAA///nbhT///+o9v8ADNR7/wABLhQI/wBa49f/AAghSP8AU+uF/wBIOuH/ABDj1/8AXXXDCP8ADwo9/wBTRR//AAQZmv8AFSj2/wAbnrj/AJpUewj/ABQ4Uv8AcYzN//+xbhT/AE59cf//nQzN/wAAAAAI/wBPz1z//1FcKRX//9zR7P//PUo9Bf//8QAA//+8lHsF///2MzP//9PzM///4qj2///ZuFL//9ZFH///7s9cCP//9zhS///8YUj///beuP///Uo9///2szP///5Zmgj///GUe////YAA/wAYQo//AACmZv/+p9ma/wAAAAAI///Iz1z/AAAAAP//3Z64/wApXCn/AAm9cf8ANfhSCP8AIzCk/wDCtcMF/wAQQAD/AEkKPQX/AAXHrv8AGfrh/wAM7hT/ABgwpP8AE8o9/wARyj0I/wATR67/ABFUe/8AF+PX/wAMGZr/ABkmZv8ABH1xCP8ADmj2/wACgAD//+fAAP///1ma/wFYI9f/AAAAAAj/ADc1w/////1x/wAiYUj//9amZv//9kAA///KB64IDvho/wGgsub/AMuuFBX//5vj1/8BMv1xBf//+Yo9/wASY9f//+6R7P///31x/wAAAAD/AAAAAAj///bCj/8AAAAA///3+FL/AAAuFP//+Kj2/wAAAAAI///92Zr/AAAMzf///j1x////5mb///31w/8AAAzNCP///yuF/wAAAAD///8FH/8AAAAA////KPb/AAAAAAj///pAAP8AABma///6wAD/AAAKPf//+xHs////z1wI/wAAAAD///+4UgX////o9v8AAAAA////9cP/AAAAAP///+Zm////8zMI/wAAAAD/AABR7AX//+4euP///0zN///y2Zr///yR7P//9a4U///yGZoI//81aPb//s0CjwX///xKPf//+uPX////BR////nUe/8AAiPX///6+FII/wACJmb///sHrv8ABOj2///87hT/AAXo9v8AAAAACP8AVEUf/wAAAAAF/wAGOuH/AAAAAP8ABk9c/wADczP/AAPcKf8ABWFICP8ADSZm/wASlHsF/wAG0ez/AAqAAAX/AKjrhf8AAAAABf8ACOuF///jDM0F/wABq4X///qHrv8ABI9c///8jM3/AAWFH/8AAAAACP8AT9Hs/wAAAAAF/wAFNcP/AAAAAP8ABUo9/wADEez/AAN64f8ABPhSCP8AA2uF/wAFAo//AAEeuP8ABi4U///+Uez/AAUcKQj//xho9v8AYPXDFf8AO8o9/wBbMzMF/wAcz1z//6TMzQUO+aX/APtA1P8BTHXDFf//+6Zm/wAHMKT/AAHFH/8AChcK/wAG49f/AAcwpAj/ALEj1/8AuRR7Bf8ADtR7/wAPnrj///umZv8AE5ma///tmZr/AAAAAAj//1iR7P8AAAAABf//8fhS/wAAAAD///CCj///+MAA///0nCn///QcKQj//3vPXP//dePX///Kkez//8hCj/8AAVR7/wABXrgI///0PXH///O64f///PXD///ux67/AAduFP//871xCP8ARaj2//+Mx67/AAGwpP//989c/wAkGZr//8RKPQj/AAcwpP//9Bwp/wAM8KT///jAAP8ADgUf/wAAAAAI/wCncKT/AAAAAAX/ABJj1/8AAAAA/wALQo//ABOZmv//9q4U/wAPnrgI/wGuBR//AYEwpBX/AA7Ue/8AD564///7pmb/ABOZmv//7Zwp/wAAAAAI//9Yj1z/AAAAAAX///H4Uv8AAAAA///wgo////jAAP//9J64///0HCkI//97z1z//3Xj1///ypHs///IQo//AAFR7P8AAV64CP//9EAA///zuuH///z1w///7seu/wAHa4X///O9cQj/AEWo9v//jMeu/wABsKT///fPXP8AJBma///ESj0I/wAHMzP///QcKf8ADPCk///4wAD/AA4FH/8AAAAACP8Ap24U/wAAAAAF/wASY9f/AAAAAP8AC0Uf/wATmZr///arhf8AD564CP//mRcK/wCvoUgF///7pmb/AAcwpP8AAcUf/wAKFwr/AAbj1/8ABzCkCA6LDvgu/wEnjSH/AmwPXBX//5GhSP8AAAAABf//+yuF/wAAAAD///tmZv///CZm////I9f///tCjwj//+ccKf//dkKPBf///yPX///7QAD/AAM4Uv///Cj2/wAE1Hv/AAAAAAj/AB0uFP8AAAAABf8ABNR7/wAAAAD/AAScKf8AA9cK/wAA3Cn/AATAAAj/AAUmZv8AHI9cBf8AACj2/wAA8KT/AADwpP8AAMo9/wAA9cP/AAAAAAj/ACNUe/8AAAo9Bf8AAcKP/wAAAAD/AAFzM////yFI/wAAtcP///6XCgj/ABCo9v//34KPBf8AAeuF///8Jmb/AAOFH////4zN/wAKnCn/AAArhQj/AAY4Uv///+j2/wAJa4X/AAB64f8ADzXD/wAAAAAI/wAE49f/AAAAAP8AAwAA/wAFHrj///2Zmv8ABEUfCP//7c9c/wAfqPYF////hR//AADZmv8AAIUf/wABIUj/AAECj/8AAH1xCP8ADgzN/wAG0ez/AAscKf8ADT1x/wACxR//AA9MzQj/AAZZmv8AIzXDBf8ABAzN/wAWVHv///DcKf8AEhcK///pUez/AAAAAAj//+2o9v//um4UFf///zhS///7x67///vrhf///JHs///7szP/AAAAAAj//8bhSP8AAAAABf///weu/wAAAAD///9cKf8AAMKP/wAALhT/AAD4Ugj/AAZR7P8AIwUfBf8AACj2/wAA8zP/AADuFP8AAMeu/wAA+FL/AAAAAAj/ADkeuP8AAAAABf8ABE9c/wAAAAD/AALcKf///JHs////PXH///vCjwj/AH6o9v8AY3XDFf//8Jwp/wASYUj//+hPXP8ACoo9///mHCn/AAAAAAj//6QXCv8AAAKPBf//unCk/wAAB67/AAACj/8AAAAA///8Vwr///+euAj///8R7P///+ZmBf//0Drh///7uuH//9WcKf//2Y9c///3j1z//9FMzQj///mZmv//3MAABf///Cj2///q7hT///wCj///6hma///21wr//8zUewj///swpP//5QKP/wAF8KT//+bj1/8AD5R7///tZmYI/wAPY9f//+2cKf8AF6uF///1dcP/ABnmZv8AAAAACP8AWwAA/////XEF/wANeuH/AAAAAP8ACuPX/////XH/AAjXCv8AAAAACP8AJWFI/wAAAAD/AACR7P8AAA9c/wAC+FL/AABPXAj/AADuFP8AABmaBf8AL8Uf/wAERR//ACpj1/8AJnMz/wAIbhT/AC6zMwj/AAYzM/8AIij2Bf8AA+Zm/wAVa4X/AAP4Uv8AFcUf/wAJT1z/ADQHrgj/AATR7P8AGv1x///6D1z/ABkcKf//8G4U/wASmZoI///j64X//8MR7BX//+5wpP//nsKPBf//+IAA///eSj0F///7Jmb//+oo9v//8Y9c///uMzP//+ywpP//+Ao9CP//+8Uf///+Qo////uj1////rXD///7oUj///84Ugj///7cKf///8o9Bf///Cj2////Qo////89cf////1x//+0gAD/AAAMzQj//6qZmv8AAAeuBf//85ma/wAAAAD///Vrhf8ABHhS///5MzP/AAgj1wj///k1w/8ACB64///9euH/AAso9v8AAjCk/wAMKPYI/wARkez/AGE9cQX/AAghSP8AJIUfBf8AAuPX/wANB67/AAZXCv8ACzMz/wAJD1z/AAgo9gj/AAlR7P8ACFwp/wALlwr/AAXCj/8AC7rh/wACFwoI/wABHrj/AAA1wwX/AAMmZv8AAJma/wABEez/AAAcKf8AKej2/wAAAAAI/wAJMzP/AAAAAP8ACy4U/wAAAAD/AA2Zmv////1xCP8AVWPX////+FIF/wAMa4X/AAAAAP8ACo9c///7h67/AAbMzf//99wpCP8ABszN///349f/AAKHrv//9NcK///9zM3///PUewgO+FD/AZF/Bv8DD6j2Ff//NiPX/wAAAAAF///MuFL/AAAAAP//zweu///XHrj///bj1///zZmaCP//4ZR7//9XlwoF///249f//82Zmv8AIjCk///XHrj/ADNKPf8AAAAACP8Aydma/wAAAAAF/wAzSj3/AAAAAP8AMPhS/wAo4Uj/AAkZmv8AMmZmCP8AHm4U/wCoaPYF/wAJHCn/ADJmZv//3c9c/wAo4Uj//8y1w/8AAAAACP//xh64//8ITM0V///+1wr///mKPf//+bhS///6z1z///l1w/8AAAAACP//Z/1x/wAAAAAF///5dcP/AAAAAP//+6FI/wAFMzP/AAEo9v8ABnMzCP8AGlR7/wCRrhQF/wABK4X/AAZ1w/8ABkKP/wAFNcP/AAaPXP8AAAAACP8Al/Mz/wAAAAAF/wAGj1z/AAAAAP8ABFwp///6yj3///7XCv//+Yo9CA74Qf8BbIXS/wK+wo8V//8VoUj/AAAAAAX///UHrv8AAAAA///1o9f///dCj////iPX///1OuEI///3XCn//82MzQX///4wpP//9TXD/wAHVwr///dHrv8ACvhS/wAAAAAI/wDWY9f/AAAAAAX/AAaKPf8AAAAA/wAEeFL///rKPf///uFI///5jM0I///8MKT//+nhSAX///7uFP//+YzN///5x67///rAAP//+WPX/wAAAAAI//9hij3/AAAAAAX//8yHrv8AAAAA///PNcP//9b9cf//90Uf///NZmYI///6VHv//98mZgX///dFH///zXMz/wAiszP//9bwpP8AM3hS/wAAAAAI/wDmAo//AAAAAAX/AApFH////+ZmBf8ACvXD/wAAAAD/AApcKf8ACL1x/wAB3Cn/AArFHwj/AAkcKf8ANPXDBf8AAc9c/wAKyj3///io9v8ACLhS///1B67/AAAAAAj//yOrhf8AAAAABf//+XMz/wAAAAD///t9cf8ABUAA/wABK4X/AAZ1wwj/AALrhf8AEJR7Bf8AARHs/wAGdcP/AAY64f8ABT1x/wAGmZr/AAAAAAj/AJ54Uv8AAAAABf8AM3XD/wAAAAD/ADDXCv8AKRHs/wAIsKT/ADKMzQj/AAYeuP8AI9HsBf8ACLCk/wAyo9f//91Zmv8AKRHs///MhR//AAAAAAgO+DL/AV15tP8CvseuFf//FaFI/wAAAAAF///1B67/AAAAAP//9aZm///3RR////4hSP//9ThSCP//91wp///NjM0F///+MKT///U4Uv8AB1cK///3RR//AAr4Uv8AAAAACP8A1mPX/wAAAAAF/wAGmZr/AAAAAP8ABGj2///6yj3///7hSP//+Y9cCP///DCk///p4UgF///+49f///mKPf//+cUf///6wo////lwpP8AAAAACP//iaPX/wAAAAAF///1LhT/AAAAAP//9aFI///3OFL///4Zmv//9R64CP///bhS///zOuH///0rhf//77Ck///9uFL///MuFAj///4XCv//9S4U/wAHQAD///crhf8ACtHs/wAAAAAI/wB2Xrj/AAAAAAX/AAaXCv8AAAAA/wAEYUj///rAAP///tcK///5ij0I///78zP//+nuFAX///7XCv//+Yo9///5sKT///rPXP//+XCk/wAAAAAI//8pnCn/AAAAAAX///UHrv8AAAAA///1lwr///dCj////gKP///1OuEI///21wr//82MzQX///4Mzf//9ThS/wAHTM3///dFH/8ACvXD/wAAAAAI/wDqXrj/AAAAAAX/ADN4Uv8AAAAA/wAxJmb/ACkPXP8ACSj2/wAyo9cI/wAGdcP/ACPR7AX/AAM9cf8AEeFI///8tcP/ABAUe///+X1x/wAOB64I/wALhR//AA4Ue/8ACOuF/wAQD1z/AAMPXP8AEfCkCP8ABiFI/wAj0ewF/wAIwo//ADKUe///3Vma/wApD1z//8yHrv8AAAAACA73if8Awq0k/wG5o9cV//+RKPb/AAAAAAX//+uPXP8AAAAA///sq4X//+9zM////GFI///rwo8I///sfXH//5Eo9gX///xeuP//64zN/wANkez//++j1/8AFFma/wAAAAAI/wBu1wr/AAAAAAX/ABRZmv8AAAAA/wATa4X/ABChSP8AA6FI/wAUQo8I/wATmZr/AG7cKQX/AAOFH/8AFFcK///ycKT/ABBZmv//66Zm/wAAAAAIDveB/wDucrz/Ar4FHxX//4L9cf8AAAAABf//9Qeu/wAAAAD///WMzf//90Uf///+DM3///U4Ugj///Z64f//ywAABf///hcK///1OFL/AAdAAP//90Uf/wAK+FL/AAAAAAj/ABr64f8AAAAABf8ABpma/wAAAAD/AAReuP//+szN///+yj3///mMzQj//9aPXP//GpcKBf///hcK///1OFL/AAdPXP//90eu/wAK64X/AAAAAAj/AEJKPf8AAAAABf8ACvhS/wAAAAD/AApzM/8ACLrh/wAB5mb/AAq64Qj/ADiuFP8BOaFIBf8AAfCk/wAKwo////io9v8ACLrh///1FHv/AAAAAAgO+GP/AWw9Kv8CEBcKFf//NiPX/wAAAAAF///MtcP/AAAAAP//zweu///XHrj///bmZv//zZmaCP//4ZHs//9XmZoF///249f//82XCv8AIjMz///XHrj/ADNHrv8AAAAACP8Aydwp/wAAAAAF/wAzR67/AAAAAP8AMPhS/wAo4Uj/AAkcKf8AMmj2CP8AHm4U/wCoZmYF/wAJGZr/ADJmZv//3c9c/wAo4Uj//8y4Uv8AAAAACP//xhma//8ISj0V///+1wr///mKPf//+brh///6z1z///lzM/8AAAAACP//aAAA/wAAAAAF///5czP/AAAAAP//+6FI/wAFMzP/AAEo9v8ABnMzCP8AGlcK/wCRrhQF/wABKPb/AAZ1w/8ABkKP/wAFNcP/AAaPXP8AAAAACP8Al/XD/wAAAAAF/wAGjM3/AAAAAP8ABF64///6yj3///7Ue///+Yo9CA75pf8BmG7P/wF2+FIV//+6Vwr/AHM4Uv///k9c/wAILhT//9vmZv8AO7hSCP//+M9c/wAL49f///MPXP8AB0AA///x+uH/AAAAAAj//1iPXP8AAAAABf//7Zwp/wAAAAD///S9cf//7GZm/wAJUez///BhSAj/AGbrhf//UF64Bf8ABFma///4z1z///44Uv//9ej2///5HCn///jPXAj//07cKf//RuuFBf//8SuF///wY9f/AARZmv//7GPX/wASZmb/AAAAAAj/AKduFP8AAAAABf8ADgeu/wAAAAD/AA99cf8AB0AA/wALY9f/AAvj1wj/AIQwpP8Aihwp/wA1bhT/ADe9cf///q4U///+oUgI/wALuFL/AAxCj/8AAwo9/wARNcP///iXCv8ADEUfCP8BX3hS/wAAAAAV//+6WZr/AHM4Uv///k9c/wAILhT//9vj1/8AO7hSCP//+M9c/wAL49f///MPXP8AB0AA///x+uH/AAAAAAj//1iR7P8AAAAABf//7Zma/wAAAAD///S9cf//7GZm/wAJVHv///BhSAj/AGbo9v//UF64Bf8ABFma///4z1z///44Uv//9ej2///5Hrj///jPXAj//07cKf//RuuFBf//8SuF///wY9f/AARZmv//7GPX/wASY9f/AAAAAAj/AKdwpP8AAAAABf8ADgeu/wAAAAD/AA99cf8AB0AA/wALYUj/AAvj1wj/AIQwpP8Aihwp/wA1bhT/ADe9cf///q4U///+oUgI/wALuuH/AAxCj/8AAwo9/wARNcP///iUe/8ADEUfCA748v8BI1Xd/wE5HCkV/wCD8KT/AAAAAAX/ABXUe/8AAAAA/wAUzM3/ABFhSP8AA+j2/wAVczMI/wAWfXH/AIQ4UgX/AAPmZv8AFV64///xaPb/ABF1w///6i4U/wAAAAAI//97+uH/AAAAAAX//+pCj/8AAAAA///rLhT//+6KPf///Bma///qoUgI///phR///3vHrgX///wXCv//6nMz/wAOlHv//+64Uv8AFdR7/wAAAAAI/wDnK4X//sjAABX//rHKPf8AAAAABf//8uZm/wAAAAD///dcKf8ACmZm/wACUez/AAzrhQj/AAxcKf8AQ3Mz///4MKT////mZv8ARJHs/wAAAAAI/wBQdcP/AAAAAP8ATUzN/wAypmb/ACZj1/8ARpwpCP8ABV64/wAJq4X////Ue/8AC8zN///6OuH/AAmPXAj///pXCv8ACZHs///1rhT/AAXCj///9PMz/wAAAAAI//+2T1z/AAAAAP//wz1x/wAAAAD//6+9cf8AAAAACP//mWuF/wAAAAD//54R7P//rjrh///tgAD//5tHrgj///Lrhf//uKj2Bf//7ZcK//+bLhT/AEQzM///rlHs/wBmfXH/AAAAAAj/AXXKPf8AAAAABf8AFdR7/wAAAAD/ABTmZv8AEWFI/wAD6Pb/ABVeuAj/ABKAAP8AZIeuBf8AA964/wAVYUj///GCj/8AEWFI///qK4X/AAAAAAgO+eT/AxNYlP8AMLCkFf//N8Uf/wJl+FIF///zFwr/ACTMzf//3Sj2///++FL/AAAAAP8AAAAACP//7YKP/wAAAAD//+/uFP8AAF64///xUez/AAAAAAj///u4Uv8AABma///8eFL////PXP//++j2/wAAFwoI///+VHv/AAAAAP///gzN/wAAAAD///5Ue/8AAAAACP//9Hrh/wAAMKT///V9cf8AABcK///2Jmb///+hSAj/AAAAAP///3CkBf///9Hs/wAAAAD////mZv8AAAAA////0ez////mZgj/AAAAAP8AAKj2Bf//3Drh///+nCn//+W1w///+R64///rXCn//+Q4Ugj//mrMzf/9mgeuBf//+JR7///1x67///4KPf//86PX/wAERR////X4Ugj/AARHrv//9gzN/wAJ2Zr///ncKf8AC89c/wAAAAAI/wCoh67/AAAAAAX/AAxzM/8AAAAA/wAMo9f/AAbj1/8AB7XD/wAKxR8I/wAaSj3/ACUo9gX/AA2rhf8AFQAABf8BUdR7/wAAAAAF/wAR1wr//8YcKQX/AANZmv//9Qeu/wAJHCn///khSP8ACwzN/wAAAAAI/wCfnCn/AAAAAAX/AApo9v8AAAAA/wAKmZr/AAYj1/8ABvXD/wAJ8KQI/wAG3rj/AAnzM/8AAjrh/wAMXCn///yrhf8ACjhSCP/+MNR7/wDB6PYV/wB3lHv/ALZhSAX/ADmcKf//SZ64Bf//0vhS/wI0+FIV/wAJ8zP///Q9cf8ADtcK///49cP/AA7o9v8AAAAACP8AHrhS/wAAAAD/ACjXCv8AAAAA/wAjYUj/AAAAAAj/AAZAAP8AAAAA/wAFyj3/AANPXP8AAyuF/wAFYUgI/wADK4X/AAVj1/8AABR7/wAGqPb///z4Uv8ABXXDCP//q7Ck/wCYYUgF///26Pb/ABBhSP//7k9c/wAKlHv//+2rhf8AAAAACP//7gAA/wAAAAD//629cf8AAAAA///Lx67/AAAAAAj///keuP8AAAAA///5wAD///wAAP///Rwp///5x64I///9HCn///nCj/8AAP1x///4qPb/AARwpP//+sAACA755P8DE1YF/wAwsKQV//83x67/AmX4UgX///MXCv8AJMzN///dKPb///74Uv8AAAAA/wAAAAAI///tgAD/AAAAAP//7/Ck/wAAXrj///FR7P8AAAAACP//+7hS/wAAGZr///x4Uv///89c///76Pb/AAAXCgj///5Ue/8AAAAA///+DM3/AAAAAP///lHs/wAAAAAI///0euH/AAAwpP//9YAA/wAAFwr///YmZv///6FICP8AAAAA////cKQF////0ez/AAAAAP///+j2/wAAAAD////Mzf///+ZmCP8AAAAA/wAAqPYF///cOuH///6cKf//5bhS///5Hrj//+tcKf//5DhSCP/+aszN//2aB64F///4lHv///XHrv///go9///zo9f/AARFH///9fhSCP8ABEeu///2DM3/AAnZmv//+dwp/wALzM3/AAAAAAj/AKiKPf8AAAAABf8ADHMz/wAAAAD/AAyhSP8ABuPX/wAHtcP/AArFHwj/ABpMzf8AJSj2Bf8ADaZm/wAVAAAF/wFR1wr/AAAAAAX/ABHXCv//xhwpBf8AA1ma///1B67/AAkZmv//+SFI/wALDM3/AAAAAAj/AJ+euP8AAAAABf8ACmZm/wAAAAD/AAqZmv8ABiPX/wAG9cP/AAnwpAj/AAbj1/8ACfMz/wACOuH/AAxcKf///Kj2/wAKOFII//4w1wr/AMHo9hX/AHeUe/8AtmFIBf8AOZma//9JnrgF//+70ez/AiIrhRX/ACJrhf8AAAAA/wAmXrj/AAAAAP8AHmuF/wAAAAAI/wASVHv/AAAAAP8AD964///+Zmb/AA+XCv8AECPXCP8Am6uF/wChFHsF/wAE64X/AAUZmv8AAWZm/wAHij3///064f8ABoeuCP///Trh/wAGhR////mcKf8ABD1x///46Pb/AAAAAAj//79KPf8AAAAA//+7Qo//AAAAAP//4Bma/wAAAAAI///wOFL/AAAAAP//8Vma///4QAD///dAAP//8weuCP//lfCk//9itcMF///8WZr///qXCv///6FI///5BR//AAMPXP//+j1xCP8AAxHs///6OuH/AAX9cf///GFI/wAGhR//AAAAAAgO+eT/AxNYlP8AMLCkFf//N8Uf/wJl+FIF///zFwr/ACTMzf//3Sj2///++FL/AAAAAP8AAAAACP//7YAA/wAAAAD//+/wpP8AAF64///xUez/AAAAAAj///u4Uv8AABma///8eFL////PXP//++j2/wAAFwoI///+VHv/AAAAAP///gzN/wAAAAD///5R7P8AAAAACP//9Hrh/wAAMKT///WAAP8AABcK///2Jmb///+hSAj/AAAAAP///3CkBf///9Hs/wAAAAD////mZv8AAAAA////z1z////mZgj/AAAAAP8AAKj2Bf//3Drh///+nCn//+W4Uv//+R64///rXCn//+Q4Ugj//mrMzf/9mgeuBf//+JR7///1x67///4KPf//86PX/wAERR////X4Ugj/AARHrv//9gzN/wAJ2Zr///ncKf8AC8zN/wAAAAAI/wCoij3/AAAAAAX/AAxzM/8AAAAA/wAMo9f/AAbj1/8AB7Mz/wAKxR8I/wAaTM3/ACUo9gX/AA2rhf8AFQAABf8BUdR7/wAAAAAF/wAR1wr//8YcKQX/AANZmv//9Qeu/wAJGZr///khSP8ACw9c/wAAAAAI/wCfnCn/AAAAAAX/AApo9v8AAAAA/wAKmZr/AAYj1/8ABvXD/wAJ8KQI/wAG3rj/AAnzM/8AAj1x/wAMXCn///yo9v8ACjhSCP/+MNR7/wDB6PYV/wB3lHv/ALZhSAX/ADmZmv//SZ64Bf//KQ9c/wIlWZoV/wAtwAD/AAAAAP8AQ/hS/wAAAAD/AA8XCv8AAAAACP8ADU9c/wAAAAD/AAzCj/8ABYzN/wAJAAD/AAmuFAj/ADGKPf8ANW4UBf8AJ2uF///PGZoF/wAJ9cP///OcKf8ADyPX///4oUj/AA9hSP8AAAAACP8AFBR7/wAAAAD/ABBhSP8AAAAA/wANZmb/AAAAAAj/AAC9cf8AAAAA/wANZmb/AAAAAP8AJcAA/wAAAAAI/wAEdcP/AAAAAP8ABMzN/wAAAAD/AAUj1/8AAAAACP8ABsUf/wAAAAD/AAYrhf8AA964/wAC9cP/AAYXCgj/AALzM/8ABhcK////MKT/AAc9cf//+89c/wAFT1wI//+LOuH/AJO1wwX///fmZv8ACkAA///znrj/AAYAAP//8vMz/wAAAAAI///lYUj/AAAAAP//5u4U/wAAAAD//9oUe/8AAAAACP//4Oj2/wAAAAD//+XFH///9Zwp///ugo///+zPXAj//4ZcKf//eo9cBf//+0o9///61Hv///7Hrv//+IzN/wAC1Hv///mZmgj/AALR7P//+Zwp/wAGVHv///veuP8ABv1x/wAAAAAIDvnk/wMTWJT/ADCwpBX//zfFH/8CZfhSBf//8xcK/wAkzM3//90o9v///vhS/wAAAAD/AAAAAAj//+2AAP8AAAAA///v8KT/AABeuP//8VHs/wAAAAAI///7uFL/AAAZmv///HhS////z1z///vo9v8AABcKCP///lR7/wAAAAD///4Mzf8AAAAA///+Uez/AAAAAAj///R64f8AADCk///1gAD/AAAXCv//9iZm////oUgI/wAAAAD///9wpAX////R7P8AAAAA////5mb/AAAAAP///89c////5mYI/wAAAAD/AACo9gX//9w64f///pwp///luFL///keuP//61wp///kOFII//5qzM3//ZoHrgX///iUe///9ceu///+Cj3///Oj1/8ABEUf///1+FII/wAER67///YMzf8ACdma///53Cn/AAvMzf8AAAAACP8AqIo9/wAAAAAF/wAMczP/AAAAAP8ADKPX/wAG49f/AAezM/8ACsUfCP8AGkzN/wAlKPYF/wANq4X/ABUAAAX/AVHUe/8AAAAABf8AEdcK///GHCkF/wADWZr///UHrv8ACRma///5IUj/AAsPXP8AAAAACP8An5wp/wAAAAAF/wAKaPb/AAAAAP8ACpma/wAGI9f/AAb1w/8ACfCkCP8ABuFI/wAJ8zP/AAI64f8ADFwp///8qPb/AAo4Ugj//jDUe/8Awej2Ff8Ad5R7/wC2YUgF/wA5mZr//0meuAX//zkwpP8COPrhFf8AUI9c/wAAAAAF/wAS/XH/AAAAAP///U9c/wAWQo//AAomZv8ACkKPCP8AEGFI/wAQjM3/ABlZmv//+EUf/wAP+uH///OR7Aj/AAqZmv//98AA/wAMgo////gj1/8ADHMz///6uuEI/wAaQAD///TmZv8AHJR7/wACOFL/ABvHrv///x64CP8AUQUf///9czP/AC4KPf8ARRcK/wAEeuH/AEoKPQj/AAA1w/8AA2uFBf8AAJwp/wAKJmb///fwpP8ACI9c///11Hv/AAAAAAj/AAAAAP8AAAAA//+t/XH/AAAAAP////1x/wAAAAAI///uz1z/AAAAAP8AAMeu///tWZr///dAAP//9brhCP//9Nwp///y8KT//+1XCv///z1x///xcKT/AAccKQj///feuP8AA/XD///5T1z/AAZAAP//+DCk/wAEOFII///3uFL/AAR64f//9/1x/wAE1wr///eHrv8ABCFICP//4E9c/wAPcKT//59Mzf8ACNR7///P8KT//8po9gj//+PzM///4LhS///4R67//949cf///Io9///Y1HsI////Fwr///Wo9v8ACDrh///3I9f/AApFH/8AAAAACA755P8DE1iU/wAwx64V//83xR//AmX4UgX///MXCv8AJMzN///dKPb///74Uv8AAAAA/wAAAAAI///tgAD/AAAAAP//7/Ck/wAAXCn///FR7P8AAAAACP//+7hS/wAAGZr///x4Uv///9Hs///76Pb/AAAUewj///5Ue/8AAAAA///+DM3/AAAAAP///lHs/wAAAAAI///0euH/AAAzM///9YAA/wAAFwr///YmZv///6FICP8AAAAA////cKQF////0ez/AAAAAP///+j2/wAAAAD////Mzf///+ZmCP8AAAAA/wAAqPYF///cOuH///6Zmv//5bhS///5IUj//+tcKf//5DhSCP/+aszN//2aB64F///4lHv///XHrv///go9///zoUj/AARFH///9frhCP8ABEeu///2DM3/AAnZmv//+dwp/wALzM3/AAAAAAj/AKiKPf8AAAAABf8ADHMz/wAAAAD/AAyhSP8ABuPX/wAHtcP/AArFHwj/ABpMzf8AJSZmBf8ADaZm/wAVAo8F/wFR1wr/AAAAAAX/ABHXCv//xhwpBf8AA1ma///1B67/AAkZmv//+SFI/wALDM3/AAAAAAj/AJ+euP8AAAAABf8ACmZm/wAAAAD/AAqZmv8ABiPX/wAG9cP/AAnuFAj/AAbmZv8ACfMz/wACOuH/AAxeuP///Kj2/wAKOFII//4w1Hv/AMHmZhX/AHeUe/8AtmPXBf8AOZma//9JnCkF/wA8aPb/Ag5KPRX/AGuPXP8AAAAABf8AE71x/wAAAAD/ABLUe/8AECPX/wADh67/ABOmZgj/ABMFH/8Aa5HsBf8AA24U/wATwAD///LUe/8AD9ma///sQo//AAAAAAj//5RwpP8AAAAABf//7Cj2/wAAAAD//+1AAP//7/Mz///8euH//+xcKQj//+0R7P//lHCkBf///H1x///sKPb/AA0o9v//8CFI/wATwAD/AAAAAAj//uAKPf8AAAAAFf8Aa49c/wAAAAAF/wATvXH/AAAAAP8AEtR7/wAQI9f/AAOHrv8AE6ZmCP8AEwUf/wBrkewF/wADbhT/ABPAAP//8tR7/wAP2Zr//+xCj/8AAAAACP//lHCk/wAAAAAF///sKPb/AAAAAP//7UAA///v8zP///x64f//7FwpCP//7RHs//+UcKQF///8euH//+wo9v8ADSj2///wIUj/ABPCj/8AAAAACA755P8DE1iU/wAwsKQV//83xR//AmX4UgX///MXCv8AJMzN///dKPb///74Uv8AAAAA/wAAAAAI///tgAD/AAAAAP//7/Ck/wAAXrj///FR7P8AAAAACP//+7hS/wAAGZr///x4Uv///89c///76Pb/AAAXCgj///5Ue/8AAAAA///+DM3/AAAAAP///lHs/wAAAAAI///0euH/AAAwpP//9YAA/wAAFwr///YmZv///6FICP8AAAAA////cKQF////0ez/AAAAAP///+j2/wAAAAD////Mzf///+ZmCP8AAAAA/wAAqPYF///cOuH///6cKf//5bhS///5Hrj//+tcKf//5DhSCP/+aszN//2aB64F///4lHv///XHrv///go9///zo9f/AARFH///9fhSCP8ABEeu///2DM3/AAnZmv//+dwp/wALzM3/AAAAAAj/AKiKPf8AAAAABf8ADHMz/wAAAAD/AAyhSP8ABuPX/wAHtcP/AArFHwj/ABpMzf8AJSj2Bf8ADaZm/wAVAAAF/wFR1wr/AAAAAAX/ABHXCv//xhwpBf8AA1ma///1B67/AAkZmv//+SFI/wALDM3/AAAAAAj/AJ+euP8AAAAABf8ACmZm/wAAAAD/AAqZmv8ABiPX/wAG9cP/AAnwpAj/AAbmZv8ACfMz/wACOuH/AAxcKf///Kj2/wAKOFII//4w1Hv/AMHo9hX/AHeUe/8AtmFIBf8AOZma//9JnrgF///qXCn/Ag564RX/AAEwpP////XD/wABMKT////XCv8AATXD/wAAAAAI/wABI9f/AAAAAP8AASFI/wAAKPb/AAEmZv8AAAo9CP8AATCk////9cP/AAEwpP///9cK/wABNcP/AAAAAAj/AAEmZv8AAAAA/wABIUj/AAAo9v8AASPX/wAACj0I/wABMKT////1w/8AAS4U////1wr/AAE4Uv8AAAAACP8AASPX/wAAAAD/AAEhSP8AACj2/wABI9f/AAAKPQj/AEpZmv///YUf/wA1Cj3/ADm4Uv8AA8Uf/wBEszMI/wAEAo//AEhcKf//ylwp/wA+/XH//7rHrv///cAACP///seu/wAACj3///7XCv8AACZm///+x67/AAAAAAj///7Zmv8AAAAA///+3rj////Zmv///twp////9cMI///+yj3/AAAKPf///tHs/wAAJmb///7PXP8AAAAACP///tma/wAAAAD///7hSP///9ma///+3Cn////1wwj///7Hrv8AAAo9///+z1z/AAAmZv///szN/wAAAAAI///+2Zr/AAAAAP///t64////2Zr///7cKf////XDCP///szN/wAACj3///7XCv8AACZm///+yj3/AAAAAAj///7XCv8AAAAA///+4Uj////Zmv///twp////9cMI//+XD1z/AAN64f//wZR7//9yYUj/AE2Hrv//rRR7CP8AFHrh///qFwr/AB0Zmv//8MzN/wAi8zP/AAEhSAj//+RXCv8AnGuFFf8ADWuF/wAtAo//AEMR7P///YUf/wAKlwr//9I9cQj/AAAPXP///8AA/wAADM3////AAP8AAA9c////vXEI/wAD2Zr//+69cf///u4U///uSj3///sHrv//74UfCP//8jMz///SVwr//7weuP8AAgeu///2Hrj/AC6mZgj///x9cf8AEI9c/wAAx67/ABJR7P8ABTrh/wARij0IDhwE5v8E6c5X/wK6/XEV/wAAAAD/AAAAAP/86rhS/wAAAAD////64f///9wpCP//9j1x/wAAIUj///bXCv8AAA9c///3eFL///+wpAj/AAAAAP///24UBf///9Hs/wAAAAD////mZv8AAAAA////z1z////mZgj/AAAAAP8AAKuFBf//3Drh///+mZr//+W4Uv//+R64///rXCn//+Q4Ugj//mrMzf/9mgo9Bf//+JR7///1x67///4KPf//86FI/wAERR////X64Qj/AARHrv//9gzN/wAJ2Zr///ncKf8AC8zN/wAAAAAI/wCoij3/AAAAAAX/AAxzM/8AAAAA/wAMo9f/AAbhSP8AB7Mz/wAKx64I/wAaTM3/ACUmZgX/AA2rhf8AFQKPBf8BUdR7/wAAAAAF/wAAAAD/AAAAAP8AEVHs///Hz1z/AACCj////lR7CP8ABiPX///qQo//AB+uFP8AAa4U/wAAAAD/AAAAAAj/ABzo9v8AABma/wAc64X////zM/8AHOj2/wAAAAAI/wAmqPb/AAAAAP8AJqj2/wAAAAD/ACauFP8AAAAACP8AKwKP/wAAAAD/ACsHrv8AAAAA/wArAo//AAAAAAj/ACXKPf8AAAAA/wAlzM3/AAAAAP8AJceu/wAAAAAI/wAW+FL/AAAAAP8AFvrh/wAAAAD/ABb64f8AAAAACP8AAvMz/wAAAAD/AAL4Uv8AAAAA/wAC8zP/AAAAAAj/AA0Zmv8AAAAA/wAMjM3/AAp9cf8AAlHs/wAM0ewI/wAYnrj/AIj1wwX/AAJPXP8ADOj2///3R67/AApo9v//8uZm/wAAAAAI//5wMKT/AAAAAAX///PCj/8AAAAA///1Jmb/AAfhSP///DMz/wALnrgI///yz1z/ACh64QX///5Cj/8ABVcK/wAA64X/AAXcKf8AA0o9/wAEjM0I/wADTM3/AASMzf8ABUeu/wACsKT/AAWeuP8AAAAACP8BZf1x/wAAAAAF/wANGZr/AAAAAP8ADIeu/wAKfXH/AAJUe/8ADNR7CP8AFeuF/wB5Qo8F/wACUez/AAzrhf//90Uf/wAKY9f///LmZv8AAAAACP/+QTrh/wAAAAAF///zwAD/AAAAAP//9Sj2/wAH3rj///wzM/8AC6PXCP//8ThS/wAtUewF///+Qo//AAVXCv8AAOuF/wAF3Cn/AANMzf8ABIo9CP8AA0o9/wAEjM3/AAVKPf8AArMz/wAFnrj/AAAAAAj/Aje64f8AAAAABf8ADRma/wAAAAD/AAyMzf8ACoAA/wACT1z/AAzo9gj/ABfj1/8AhAUfBf8AAlma/wAM1Hv///dCj/8ACoAA///y5mb/AAAAAAj//FpeuP/+N5wpFf8Ad5R7/wC2YUgF/wA5mZr//0meuAUO+UX/Aqo/nv8CvRHsFf/+fRwp/wAAAAAF//+ZszP/AAAAAP//nkKP//+umZr//+2cKf//m3XDCP//whwp//6vwo8F///tnCn//5sZmv8AREo9//+uDM3/AGarhf8AAAAACP8AVHXD/wAAAAAF///1MKT//9qFH///9aFI///cwo////zCj///91HsCP///UAA///4q4X/AAChSP//99Hs/wADz1z///krhQj/AAPPXP//+Sj2/wAGnCn///sj1/8AB64U///+fXEI/wAU8zP///vUe/8AGZwp///6eFL/AAnR7P///BHsCP8AHyPX///zfXH///tMzf//3EzN///pWZr///LzMwj//+r9cf//8+PX///cuuH/AAJhSP//5Gj2/wAPYUgI///49cP/AAPwpP//99cK/wAAwAD///jcKf///UzNCP//+P1x///9XCn///pUe///+jrh///8rhT///fwpAj///cuFP//6H1xBf//+u4U///yfXH/AAaUe///8OPX/wANXCn///qMzQj/AAOo9v///oKP/wADY9f///6uFP8AAnrh////MzMI/wBRzM3//+WAAP8AbN64/wAQ5mb/ACa4Uv8APGZmCP8AFEzN/wAfuuH/AALj1/8AM+PX///dYUj/ACG4Ugj///AUe/8AD4AA///mkez/AAxuFP//3Zma/wAJI9cI///9OFL/AAC9cf///aZm/wAB3rj///6mZv8AAoo9CP///qZm/wACh67////Cj/8AAwKP/wAA8zP/AAK4Ugj/AA8Ue/8AKz1xBf8AzEeu/wAAAAAF/wAV1wr/AAAAAP8AFM9c/wARXrj/AAPj1/8AFXhSCP8AEwzN/wBpoUgF/wAD49f/ABV4Uv//8WuF/wARYUj//+oo9v8AAAAACP/+r0eu/wAAAAAF///y5mb/AAAAAP//90Uf/wAKZmb/AAJUe/8ADOj2CP8ANK4U/wEiK4UF/wACVHv/AAzR7P8ADIeu/wAKgAD/AA0FH/8AAAAACP8BULhS/wAAAAAF/wAV1Hv/AAAAAP8AFM9c/wARYUj/AAPo9v8AFXXDCP8AEq4U/wBnOuEF/wAD49f/ABV1w///8WuF/wARYUj//+oo9v8AAAAACA75ff8C7HeC/wK9B64V//2yeFL/AAAAAAX//+oo9v8AAAAA///rFwr//+6FH////Bwp///qjM0I//+PY9f//ZDUewX///wwpP//6oeu/wAOlHv//+6Hrv8AFfCk/wAAAAAI/wJNh67/AAAAAAX/AA0Zmv8AAAAA/wAMjM3/AAp9cf8AAk9c/wAM0ewI/wAYnrj/AIj1wwX/AAJR7P8ADOuF///3RR//AApmZv//8uZm/wAAAAAI//5mQo//AAAAAAX///uj1/8AAAAA///9Hrj/AAOHrv8AALrh/wAER64I/wAMK4X/AENcKQX/AADAAP8ABEeu/wAELhT/AAOHrv8ABFwp/wAAAAAI/wFJj1z/AAAAAAX/AA0Zmv8AAAAA/wAMij3/AAp9cf8AAlR7/wAM1HsI/wAV7hT/AHlAAAX/AAJR7P8ADOuF///3RR//AApj1///8uZm/wAAAAAI//62cKT/AAAAAAX///uj1/8AAAAA///9Hrj/AAOKPf8AALrh/wAER64I/wANBR//AEgwpAX/AAC9cf8ABEeu/wAELhT/AAOHrv8ABF64/wAAAAAI/wGZvXH/AAAAAAX/AA0Zmv8AAAAA/wAMjM3/AAqAAP8AAk9c/wAM64UI/wAX49f/AIQFHwX/AAJR7P8ADNR7///3Qo//AAqAAP//8uZm/wAAAAAI//6wgAD/AGyR7BX/AAnzM///9D1x/wAO2Zr///j4Uv8ADuZm/wAAAAAI/wAeuFL/AAAAAP8AKNcK/wAAAAD/ACNhSP8AAAAACP8ABkAA/wAAAAD/AAXKPf8AA0zN/wADK4X/AAVhSAj/AAMrhf8ABWZm/wAAFHv/AAamZv///PhS/wAFeFII//+rsKT/AJheuAX///brhf8AEGFI///uTM3/AAqUe///7auF/wAAAAAI///uAAD/AAAAAP//rcAA/wAAAAD//8vFH/8AAAAACP//+R64/wAAAAD///nAAP///AAA///9HCn///nHrgj///0cKf//+cKP/wAA/XH///io9v8ABHCk///6wo8IDvl9/wLsd4L/Ar0HrhX//bJ4Uv8AAAAABf//6ij2/wAAAAD//+sXCv//7oUf///8HCn//+qMzQj//49j1//9kNR7Bf///DCk///qh67/AA6Ue///7oeu/wAV8KT/AAAAAAj/Ak2Hrv8AAAAABf8ADRma/wAAAAD/AAyMzf8ACn1x/wACT1z/AAzR7Aj/ABieuP8AiPXDBf8AAlHs/wAM64X///dFH/8ACmZm///y5mb/AAAAAAj//mZCj/8AAAAABf//+6PX/wAAAAD///0euP8AA4eu/wAAuuH/AARHrgj/AAwrhf8AQ1wpBf8AAMAA/wAER67/AAQuFP8AA4eu/wAEXCn/AAAAAAj/AUmPXP8AAAAABf8ADRma/wAAAAD/AAyKPf8ACn1x/wACVHv/AAzUewj/ABXrhf8AeUAABf8AAlHs/wAM64X///dFH/8ACmPX///y5mb/AAAAAAj//rZwpP8AAAAABf//+6PX/wAAAAD///0euP8AA4o9/wAAuuH/AARHrgj/AA0Cj/8ASDCkBf8AAMAA/wAER67/AAQuFP8AA4eu/wAEXCn/AAAAAAj/AZnAAP8AAAAABf8ADRma/wAAAAD/AAyMzf8ACoAA/wACT1z/AAzrhQj/ABfj1/8AhAUfBf8AAlR7/wAM1Hv///dCj/8ACoAA///y5mb/AAAAAAj//nYXCv8AWceuFf8AImuF/wAAAAD/ACZeuP8AAAAA/wAeaPb/AAAAAAj/ABJXCv8AAAAA/wAP3rj///5j1/8AD5R7/wAQI9cI/wCbq4X/AKEXCgX/AATuFP8ABRcK/wABZmb/AAeKPf///Trh/wAGh64I///9OuH/AAaFH///+Zma/wAEPXH///jrhf8AAAAACP//v0eu/wAAAAD//7tFH/8AAAAA///gGZr/AAAAAAj///A1w/8AAAAA///xXCn///hCj///90AA///zBR8I//+V8KT//2K1wwX///xXCv//+pma////o9f///kCj/8AAw9c///6PXEI/wADD1z///o64f8ABgAA///8Y9f/AAaFH/8AAAAACA75ff8C7HeC/wK9B64V//2yeFL/AAAAAAX//+oo9v8AAAAA///rFwr//+6FH////Bwp///qjM0I//+PY9f//ZDUewX///wwpP//6oeu/wAOlHv//+6Hrv8AFfCk/wAAAAAI/wJNh67/AAAAAAX/AA0Zmv8AAAAA/wAMjM3/AAp9cf8AAk9c/wAM0ewI/wAYnrj/AIj1wwX/AAJR7P8ADOuF///3RR//AApmZv//8uZm/wAAAAAI//5mQo//AAAAAAX///uj1/8AAAAA///9Hrj/AAOHrv8AALrh/wAER64I/wAMK4X/AENcKQX/AADAAP8ABEeu/wAELhT/AAOHrv8ABFwp/wAAAAAI/wFJj1z/AAAAAAX/AA0Zmv8AAAAA/wAMij3/AAp9cf8AAlR7/wAM1HsI/wAV64X/AHlAAAX/AAJR7P8ADOuF///3RR//AApj1///8uZm/wAAAAAI//62cKT/AAAAAAX///uj1/8AAAAA///9Hrj/AAOKPf8AALrh/wAER64I/wANAo//AEgwpAX/AADAAP8ABEeu/wAELhT/AAOHrv8ABFwp/wAAAAAI/wGZwAD/AAAAAAX/AA0Zmv8AAAAA/wAMjM3/AAqAAP8AAk9c/wAM64UI/wAX49f/AIQFHwX/AAJPXP8ADNR7///3R67/AAqAAP//8uZm/wAAAAAI//4l+FL/AFzzMxX/AC29cf8AAAAA/wBD+uH/AAAAAP8ADxR7/wAAAAAI/wANT1z/AAAAAP8ADMUf/wAFjM3/AAkAAP8ACa4UCP8AMYo9/wA1bhQF/wAnaPb//88cKQX/AAn4Uv//85wp/wAPI9f///ieuP8AD2FI/wAAAAAI/wAUEez/AAAAAP8AEGPX/wAAAAD/AA1j1/8AAAAACP8AAMAA/wAAAAD/AA1mZv8AAAAA/wAlwAD/AAAAAAj/AAR1w/8AAAAA/wAEyj3/AAAAAP8ABSZm/wAAAAAI/wAGxR//AAAAAP8ABiuF/wAD3rj/AALzM/8ABhcKCP8AAvXD/wAGFwr///8wpP8AB0AA///7zM3/AAVMzQj//4s64f8Ak7hSBf//9+Zm/wAKPXH///OhSP8ABgKP///y8zP/AAAAAAj//+VhSP8AAAAA///m7hT/AAAAAP//2hR7/wAAAAAI///g6Pb/AAAAAP//5cKP///1nCn//+6FH///7M9cCP//hlwp//96j1wF///7Sj3///rR7P///seu///4jM3/AALUe///+ZwpCP8AAtHs///5mZr/AAZUe///+964/wAG/XH/AAAAAAgO+X3/Aux3gv8CvQeuFf/9snhS/wAAAAAF///qKPb/AAAAAP//6xcK///uhR////wcKf//6ozNCP//j2PX//2Q1HsF///8MKT//+qHrv8ADpR7///uh67/ABXwpP8AAAAACP8CTYeu/wAAAAAF/wANFHv/AAAAAP8ADIzN/wAKfXH/AAJUe/8ADNHsCP8AGJ64/wCI9cMF/wACUez/AAzrhf//90Uf/wAKZmb///LmZv8AAAAACP/+ZkAA/wAAAAAF///7oUj/AAAAAP///Rwp/wADh67/AADAAP8ABEeuCP8ADC4U/wBDXCkF/wAAwAD/AARHrv8ABCj2/wADh67/AARhSP8AAAAACP8BSY9c/wAAAAAF/wANGZr/AAAAAP8ADIzN/wAKfXH/AAJR7P8ADNR7CP8AFe4U/wB5QAAF/wACUez/AAzrhf//90Uf/wAKY9f///Lj1/8AAAAACP/+tnCk/wAAAAAF///7o9f/AAAAAP///Rma/wADij3/AADAAP8ABEeuCP8ADQKP/wBIMKQF/wAAwAD/AARHrv8ABC4U/wADh67/AARhSP8AAAAACP8Bmb1x/wAAAAAF/wANGZr/AAAAAP8ADIzN/wAKgAD/AAJPXP8ADOuFCP8AF+FI/wCEBR8F/wACVwr/AAzUe///90KP/wAKgAD///Lj1/8AAAAACP//Pzrh/wBF49cV/wBrj1z/AAAAAAX/ABO9cf8AAAAA/wAS1wr/ABAj1/8AA4eu/wATpmYI/wATBR//AGuR7AX/AANuFP8AE8AA///y0ez/AA/Zmv//7EKP/wAAAAAI//+UcKT/AAAAAAX//+wo9v8AAAAA///tQAD//+/zM////H1x///sXCkI///tD1z//5RwpAX///x9cf//7CuF/wANK4X///AeuP8AE71x/wAAAAAI//7gDM3/AAAAABX/AGuMzf8AAAAABf8AE8AA/wAAAAD/ABLUe/8AECPX/wADh67/ABOmZgj/ABMFH/8Aa5HsBf8AA24U/wATwAD///LUe/8AD9ma///sQAD/AAAAAAj//5RzM/8AAAAABf//7Cj2/wAAAAD//+1AAP//7/Mz///8euH//+xcKQj//+0R7P//lHCkBf///Hrh///sK4X/AA0o9v//8B64/wATwo//AAAAAAgO99f/ASLPZ/8Cu7rhFf//e+FI/wAAAAAF///qLhT/AAAAAP//6zCk///unrj///wXCv//6ozNCP//j49c//2R8KQF///8HCn//+qHrv8ADpR7///unrj/ABXXCv8AAAAACP8AhAUf/wAAAAAF/wAV1Hv/AAAAAP8AFM9c/wARYUj/AAPo9v8AFXhSCP8AcGuF/wJuD1wF/wAD6Pb/ABVzM///8YUf/wARYUj//+omZv8AAAAACP8AasKP/wBz/XEV//+rsKT/AJheuAX///brhf8AEGPX///uTM3/AAqR7P//7auF/wAAAAAI///uAAD/AAAAAP//rcAA/wAAAAD//8vFH/8AAAAACP//+R64/wAAAAD///nAAP///AKP///9HCn///nFHwj///0cKf//+cUf/wAA/XH///imZv8ABHCk///6wo8I/wCFSj3//2JPXAX/AAnzM///9Drh/wAO1wr///j4Uv8ADuZm/wAAAAAI/wAeuFL/AAAAAP8AKNma/wAAAAD/ACNhSP8AAAAACP8ABkAA/wAAAAD/AAXHrv8AA09c/wADLhT/AAVhSAj/AAMwpP8ABWPX/wAAFHv/AAamZv///PhS/wAFeFIIDvfY/wEiz2f/Aru64RX//3vhSP8AAAAABf//6i4U/wAAAAD//+swpP//7p64///8Fwr//+qMzQj//4+PXP/9kfCkBf///Bwp///qh67/AA6Ue///7p64/wAV1wr/AAAAAAj/AIQFH/8AAAAABf8AFdR7/wAAAAD/ABTPXP8AEWFI/wAD6Pb/ABV4Ugj/AHBrhf8Cbg9cBf8AA+j2/wAVczP///GCj/8AEWFI///qKPb/AAAAAAj/AJxXCv8BHI9cFf///Trh/wAGhR////mcKf8ABD1x///46Pb/AAAAAAj//79KPf8AAAAA//+7Qo//AAAAAP//4Bma/wAAAAAI///wOFL/AAAAAP//8Vma///4Qo////dAAP//8wUfCP//lfCk//9itcMF///8WZr///qZmv///6FI///5Ao//AAMR7P//+j1xCP8AAw9c///6PXH/AAX64f///GPX/wAGh67/AAAAAAj/ACJrhf8AAAAA/wAmXrj/AAAAAP8AHmuF/wAAAAAI/wASVHv/AAAAAP8AD964///+Y9f/AA+XCv8AECPXCP8Am6uF/wChFwoF/wAE7hT/AAUXCv8AAWPX/wAHij3///064f8ABoUfCA732f8BIs9n/wK7uuEV//974Uj/AAAAAAX//+ouFP8AAAAA///rMKT//+6euP///BcK///qjM0I//+Pj1z//ZHwpAX///wcKf//6oeu/wAOlHv//+6euP8AFdcK/wAAAAAI/wCEBR//AAAAAAX/ABXUe/8AAAAA/wAUz1z/ABFhSP8AA+j2/wAVeFII/wBwa4X/Am4PXAX/AAPo9v8AFXMz///xgo//ABFhSP//6ij2/wAAAAAI/wCxMzP/AHmMzRX//4s64f8Ak7hSBf//9+Zm/wAKPXH///OeuP8ABgKP///y8zP/AAAAAAj//+VhSP8AAAAA///m7hT/AAAAAP//2hR7/wAAAAAI///g6Pb/AAAAAP//5cUf///1nCn//+6Cj///7M9cCP//hl64//96j1wF///7TM3///rUe////sUf///4ij3/AALUe///+ZwpCP8AAtHs///5mZr/AAZXCv//+964/wAG+uH/AAAAAAj/AC3AAP8AAAAA/wBD+FL/AAAAAP8ADxcK/wAAAAAI/wANT1z/AAAAAP8ADMUf/wAFjM3/AAj9cf8ACa4UCP8AMYzN/wA1bhQF/wAnaPb//88cKQX/AAn1w///85wp/wAPJmb///ieuP8AD2FI/wAAAAAI/wAUEez/AAAAAP8AEGFI/wAAAAD/AA1mZv8AAAAACP8AAL1x/wAAAAD/AA1mZv8AAAAA/wAlwo//AAAAAAj/AAR1w/8AAAAA/wAEyj3/AAAAAP8ABSPX/wAAAAAI/wAGxR//AAAAAP8ABi4U/wAD3rj/AALzM/8ABhcKCP8AAvMz/wAGFwr///8uFP8AB0AA///7z1z/AAVMzQgO99r/ASLPZ/8Cu7rhFf//e+FI/wAAAAAF///qLhT/AAAAAP//6zCk///unrj///wXCv//6ozNCP//j49c//2R8KQF///8HCn//+qHrv8ADpR7///unrj/ABXXCv8AAAAACP8AhAUf/wAAAAAF/wAV1Hv/AAAAAP8AFM9c/wARYUj/AAPo9v8AFXhSCP8AcGuF/wJuD1wF/wAD6Pb/ABVzM///8YKP/wARYUj//+oo9v8AAAAACP8Ark9c/wD42ZoV//+UcKT/AAAAAAX//+wo9v8AAAAA///tQAD//+/zM////Hrh///sXCkI///tEez//5RwpAX///x64f//7Cj2/wANKPb///AhSP8AE8AA/wAAAAAI/wBrjM3/AAAAAAX/ABPAAP8AAAAA/wAS1Hv/ABAj1/8AA4eu/wATpmYI/wATBR//AGuR7AX/AANuFP8AE8AA///y1wr/AA/Zmv//7EKP/wAAAAAI//5U1Hv//00MzRX/AGuPXP8AAAAABf8AE71x/wAAAAD/ABLUe/8AECPX/wADh67/ABOo9gj/ABMFH/8Aa5HsBf8AA24U/wATvXH///LUe/8AD9wp///sQo//AAAAAAj//5RwpP8AAAAABf//7Cj2/wAAAAD//+1AAP//7/Ck///8euH//+xcKQj//+0R7P//lHCkBf///Hrh///sKPb/AA0o9v//8CFI/wATwo//AAAAAAgO+dn/AyVz6f8Cu1wpFf//fOj2/wAAAAAF///qKPb/AAAAAP//6zCk///uoUj///wZmv//6oo9CP//xZHs//68YUgF///+a4X///d1w///9KZm///98zP///r9cf8AB24UCP//Ohma/wFfwo8F///6DM3/AAjXCv//9ceu/wAFAo////RhSP8AAAAACP//WNma/wAAAAAF///qKPb/AAAAAP//6zMz///uoUj///wXCv//6oo9CP//j6j2//2SUewF///8GZr//+qHrv8ADpcK///uoUj/ABXUe/8AAAAACP8AgxcK/wAAAAAF/wAV1wr/AAAAAP8AFM9c/wARXrj/AAPo9v8AFXhSCP8AP1wp/wFeeFIF/wABfXH/AAiKPf8AC24U/wACDM3/AAUFH///+JHsCP8A13XD//6FSj0F/wAF8zP///dFH/8ACiFI///649f/AAu1w/8AAAAACP8AkMAA/wAAAAAF/wAV1Hv/AAAAAP8AFM9c/wARXrj/AAPo9v8AFXhSCP8AcFcK/wJtq4UF/wADz1z/ABWMzf//8Wj2/wARXrj//+oo9v8AAAAACP/+EVHs/wBwlwoV/wBQj1z/AAAAAAX/ABL9cf8AAAAA///9T1z/ABZCj/8ACij2/wAKQo8I/wAQXrj/ABCKPf8AGVma///4R67/AA/64f//849cCP8ACpma///3wo//AAyFH///+CPX/wAMczP///q64Qj/ABpAAP//9OZm/wAckez/AAI4Uv8AG8eu////HCkI/wBRBR////11w/8ALgo9/wBFFwr/AAR9cf8ASgo9CP8AADMz/wADa4UF/wAAnrj/AAomZv//9+4U/wAIj1z///XUe/8AAAAACP8AAAAA/wAAAAD//639cf8AAAAA/////XH/AAAAAAj//+7PXP8AAAAA/wAAx67//+1Zmv//90AA///1uuEI///03Cn///LwpP//7VcK////PXH///FwpP8ABxmaCP//9+FI/wAD9cP///lPXP8ABkAA///4LhT/AAQ64Qj///e64f8ABHhS///3+uH/AATXCv//94eu/wAEIUgI///gT1z/AA9wpP//n0zN/wAI1wr//8/wpP//ymj2CP//4/Mz///guFL///hHrv//3jrh///8ij3//9jXCgj///8Zmv//9aj2/wAIOFL///cj1/8ACkUf/wAAAAAIDvn3/wK7Q0n/Ar31wxX//mxMzf8AAAAABf//mW4U/wAAAAD//54R7P//rj1x///tx67//5swpAj//8Mj1//+rzMzBf//7co9//+bLhT/AERhSP//rkAA/wBmlwr/AAAAAAj/AZOzM/8AAAAABf8AZpHs/wAAAAD/AGHuFP8AUcKP/wASOFL/AGTPXAj/ADzcKf8BUMzNBf8AEjXD/wBkz1z//7ueuP8AUcKP//+ZaPb/AAAAAAj//8DUe///M/XDFf//y2uF//7cnrgF///9q4X///MXCv//83Mz///1lwr///Lo9v8AAAAACP/+z/rh/wAAAAAF///y6Pb/AAAAAP//90KP/wAKa4X/AAJR7P8ADOZmCP8ANK4U/wEjYUgF/wACUez/AAzrhf8ADIo9/wAKY9f/AA0Zmv8AAAAACP8BL+uF/wAAAAAF/wANGZr/AAACj/8ACL1x///1mZr///2uFP//8xR7CP//X3Mz/wE4oUgV/wAJ8zP///Q64f8ADtcK///4+FL/AA7o9v8AAAAACP8AHrhS/wAAAAD/ACjXCv8AAAAA/wAjYUj/AAAAAAj/AAZAAP8AAAAA/wAFx67/AANPXP8AAy4U/wAFYUgI/wADK4X/AAVj1/8AABR7/wAGpmb///z4Uv8ABXhSCP//q7Ck/wCYXrgF///264X/ABBj1///7kzN/wAKkez//+2rhf8AAAAACP//7gAA/wAAAAD//629cf8AAAAA///Lx67/AAAAAAj///keuP8AAAAA///5wAD///wCj////Rwp///5xR8I///9HCn///nFH/8AAP1x///4qPb/AARwpP//+sAACA759/8Cu0NJ/wK99cMV//5sTM3/AAAAAAX//5luFP8AAAAA//+eEez//649cf//7ceu//+bMKQI///DI9f//q8zMwX//+3KPf//my4U/wBEYUj//65AAP8AZpcK/wAAAAAI/wGTszP/AAAAAAX/AGaR7P8AAAAA/wBh7hT/AFHCj/8AEjhS/wBkz1wI/wA83Cn/AVDMzQX/ABI1w/8AZM9c//+7nrj/AFHCj///mWj2/wAAAAAI///A1Hv//zP1wxX//8trhf/+3J64Bf///auF///zFwr///NzM///9ZcK///y6Pb/AAAAAAj//s/64f8AAAAABf//8uj2/wAAAAD///dCj/8ACmuF/wACUez/AAzmZgj/ADSuFP8BI2FIBf8AAlHs/wAM64X/AAyKPf8ACmPX/wANGZr/AAAAAAj/AS/rhf8AAAAABf8ADRma/wAAAo//AAi9cf//9Zma///9rhT///MUewj//zkj1/8BJdHsFf8AIm4U/wAAAAD/ACZeuP8AAAAA/wAeaPb/AAAAAAj/ABJXCv8AAAAA/wAP3rj///5j1/8AD5R7/wAQI9cI/wCbq4X/AKEXCgX/AATuFP8ABRma/wABZmb/AAeHrv///Trh/wAGh64I///9OuH/AAaFH///+Zma/wAEPXH///jrhf8AAAAACP//v0eu/wAAAAD//7tFH/8AAAAA///gGZr/AAAAAAj///A1w/8AAAAA///xXCn///hCj///90AA///zBR8I//+V8KT//2K1wwX///xXCv//+pma////o9f///kCj/8AAw9c///6PXEI/wADD1z///o64f8ABgAA///8Y9f/AAaCj/8AAAAACA759/8Cu0NJ/wK99cMV//5sTM3/AAAAAAX//5luFP8AAAAA//+eEez//649cf//7ceu//+bMKQI///DI9f//q8zMwX//+3KPf//my4U/wBEYUj//65AAP8AZpcK/wAAAAAI/wGTszP/AAAAAAX/AGaR7P8AAAAA/wBh7hT/AFHCj/8AEjhS/wBkz1wI/wA83Cn/AVDMzQX/ABI1w/8AZM9c//+7nrj/AFHCj///mWj2/wAAAAAI///A0ez//zP1wxX//8to9v/+3J64Bf///auF///zFwr///N1w///9ZcK///y6Pb/AAAAAAj//s/4Uv8AAAAABf//8uuF/wAAAAD///dCj/8ACmuF/wACUez/AAzmZgj/ADSuFP8BI2FIBf8AAk9c/wAM64X/AAyMzf8ACmPX/wANGZr/AAAAAAj/AS/rhf8AAAAABf8ADRwp/wAAAo//AAi9cf//9Zma///9q4X///MUewj//ryKPf8BKP1xFf8ALb1x/wAAAAD/AEP64f8AAAAA/wAPFwr/AAAAAAj/AA1Mzf8AAAAA/wAMxR//AAWMzf8ACQAA/wAJrhQI/wAxij3/ADVuFAX/ACdo9v//zxwpBf8ACfhS///znCn/AA8j1///+J64/wAPYUj/AAAAAAj/ABQUe/8AAAAA/wAQYUj/AAAAAP8ADWZm/wAAAAAI/wAAvXH/AAAAAP8ADWZm/wAAAAD/ACXAAP8AAAAACP8ABHXD/wAAAAD/AATMzf8AAAAA/wAFI9f/AAAAAAj/AAbFH/8AAAAA/wAGK4X/AAPeuP8AAvXD/wAGFwoI/wAC8zP/AAYXCv///zCk/wAHQAD///vPXP8ABUzNCP//izrh/wCTuFIF///35mb/AApAAP//8564/wAGAAD///LzM/8AAAAACP//5WFI/wAAAAD//+buFP8AAAAA///aFHv/AAAAAAj//+Do9v8AAAAA///lxR////WcKf//7oKP///sz1wI//+GXCn//3qPXAX///tKPf//+tR7///+x67///iMzf8AAtR7///5mZoI/wAC0ez///mZmv8ABlHs///73rj/AAcAAP8AAAAACA759/8Cu0NJ/wK99cMV//5sTM3/AAAAAAX//5luFP8AAAAA//+eEez//649cf//7ceu//+bMKQI///DI9f//q8zMwX//+3KPf//my4U/wBEYUj//65AAP8AZpcK/wAAAAAI/wGTszP/AAAAAAX/AGaR7P8AAAAA/wBh7hT/AFHCj/8AEjhS/wBkz1wI/wA83Cn/AVDMzQX/ABI1w/8AZM9c//+7nrj/AFHCj///mWj2/wAAAAAI///A0ez//zP1wxX//8to9v/+3J64Bf///auF///zFwr///N1w///9ZcK///y6Pb/AAAAAAj//s/4Uv8AAAAABf//8uuF/wAAAAD///dCj/8ACmuF/wACUez/AAzmZgj/ADSuFP8BI2FIBf8AAk9c/wAM64X/AAyMzf8ACmPX/wANGZr/AAAAAAj/AS/rhf8AAAAABf8ADRwp/wAAAo//AAi9cf//9Zma///9q4X///MUewj//stFH/8BPJ64Ff8AUI9c/wAAAAAF/wAS/XH/AAAAAP///U9c/wAWRR//AAoo9v8ACkKPCP8AEF64/wAQij3/ABlZmv//+Eeu/wAP+uH///OPXAj/AAqZmv//98AA/wAMhR////gmZv8ADHMz///6uuEI/wAaQAD///TmZv8AHJHs/wACOFL/ABvHrv///xwpCP8AUQUf///9czP/AC4KPf8ARRma/wAEfXH/AEoKPQj/AAAzM/8AA2uFBf8AAJ64/wAKI9f///fuFP8ACJHs///11Hv/AAAAAAj/AAAAAP8AAAAA//+t/XH/AAAAAP////1x/wAAAAAI///uz1z/AAAAAP8AAMeu///tWZr///dAAP//9brhCP//9Nwp///y8KT//+1XCv///z1x///xcKT/AAcZmgj///fhSP8AA/XD///5T1z/AAZAAP//+C4U/wAEOuEI///3uuH/AAR4Uv//9/rh/wAE1wr///eHrv8ABCFICP//4FR7/wAPcKT//59Hrv8ACNcK///P8KT//8po9gj//+PzM///4LXD///4R67//949cf///Io9///Y1woI////FHv///WmZv8ACD1x///3I9f/AApFH/8AAAAACA759/8Cu0NJ/wK99cMV//5sTM3/AAAAAAX//5luFP8AAAAA//+eEez//649cf//7ceu//+bMKQI///DI9f//q8zMwX//+3KPf//my4U/wBEYUj//65AAP8AZpcK/wAAAAAI/wGTszP/AAAAAAX/AGaR7P8AAAAA/wBh7hT/AFHCj/8AEjhS/wBkz1wI/wA83Cn/AVDMzQX/ABI1w/8AZM9c//+7nrj/AFHCj///mWj2/wAAAAAI///A1Hv//zP1wxX//8trhf/+3J64Bf///auF///zFwr///NzM///9ZcK///y6Pb/AAAAAAj//s/64f8AAAAABf//8uj2/wAAAAD///dCj/8ACmuF/wACUez/AAzmZgj/ADSuFP8BI2FIBf8AAlHs/wAM64X/AAyKPf8ACmPX/wANGZr/AAAAAAj/AS/rhf8AAAAABf8ADRma/wAAAo//AAi9cf//9Zma///9rhT///MUewj//96j1/8BEe4UFf8Aa49c/wAAAAAF/wATvXH/AAAAAP8AEtcK/wAQI9f/AAOHrv8AE6ZmCP8AEwUf/wBrkewF/wADbhT/ABPAAP//8tHs/wAP2Zr//+xCj/8AAAAACP//lHCk/wAAAAAF///sKPb/AAAAAP//7UAA///v8zP///x9cf//7FwpCP//7Q9c//+UcKQF///8gAD//+wrhf8ADSj2///wHrj/ABO9cf8AAAAACP/+4Ao9/wAAAAAV/wBrj1z/AAAAAAX/ABPAAP8AAAAA/wAS1Hv/ABAj1/8AA4eu/wATpmYI/wATBR//AGuR7AX/AANuFP8AE8AA///y1Hv/AA/Zmv//7EAA/wAAAAAI//+UczP/AAAAAAX//+wo9v8AAAAA///tQAD//+/zM////Hrh///sXCkI///tEez//5RwpAX///x64f//7CuF/wANKPb///AeuP8AE8AA/wAAAAAIDvjc/wI1HDb/AgrcKRX//8ao9v8ARZ64Bf//8pma/wAQR67//+WXCv8AAAAA///s2Zr//++4Ugj//3lXCv//jYeuBf//obhS/wByeFIF///ylwr/ABBHrv//5ZcK/wAAAAD//+zZmv//77hSCP//rhma//+6YUgF///s1wr//++1w///+1ma///lnCn/AA1mZv//77XDCP8AXko9//+Nh64F//95WZr//42HrgX//+zXCv//77XD///7WZr//+WcKf8ADWZm///vtcMI/wA5Vwr//7phSAX/AA1o9v//77hS/wAaaPb/AAAAAP8AEyZm/wAQR64I/wCGqPb/AHJ4UgX/AF5Hrv//jYeuBf8ADWj2///vuFL/ABpo9v8AAAAA/wATJmb/ABBHrgj/AFHmZv8ARZ64Bf8AEyZm/wAQSj3/AASo9v8AGmPX///ylwr/ABBKPQj//6G4Uv8AcnhSBf8AhqZm/wByeFIF/wATJmb/ABBFH/8ABKj2/wAaaPb///KXCv8AEEo9CA759/8Cu0NJ/wK99cMV//5sTM3/AAAAAAX//5luFP8AAAAA//+eEez//649cf//7ceu//+bMKQI///DI9f//q8zMwX//+3KPf//my4U/wBEYUj//65AAP8AZpcK/wAAAAAI/wGTszP/AAAAAAX/AGaR7P8AAAAA/wBh7hT/AFHCj/8AEjhS/wBkz1wI/wA83Cn/AVDMzQX/ABI1w/8AZM9c//+7nrj/AFHCj///mWj2/wAAAAAI//5hbhT//zP1wxX/AAJR7P8ADOuF/wAMij3/AApj1/8ADRma/wAAAAAI/wD6jM3/AAAAAAX//riHrv/+2eFIBf8BW8KP///rbhQV///9q4X///MXCv//83XD///1lwr///Lo9v8AAAAACP//CJma/wAAAAAF/wFDnCn/ASKo9gUO+dj/Aas7iv8DKlHsFf8ACfMz///0OuH/AA7XCv//+PhS/wAO5mb/AAAAAAj/AB64Uv8AAAAA/wAo1wr/AAAAAP8AI2FI/wAAAAAI/wAGQAD/AAAAAP8ABco9/wADT1z/AAMrhf8ABWFICP8AAy4U/wAFY9f/AAAR7P8ABqZm///8+FL/AAV4Ugj//6uwpP8AmF64Bf//9uuF/wAQYUj//+5Mzf8ACpR7///tq4X/AAAAAAj//+4AAP8AAAAA//+twAD/AAAAAP//y8Uf/wAAAAAI///5Hrj/AAAAAP//+cAA///8Ao////0cKf//+cUfCP///Rwp///5wo//AAD9cf//+Kj2/wAEcKT///rCjwj/AgMCj//+9bhSFf//gCZm/wAAAAAF///qKPb/AAAAAP//6zCk///unrj///wXCv//6oo9CP//rcUf//445mYF///9sKT///MXCv//83Mz///1nCn///LmZv8AAAAACP/+7Ao9/wAAAAAF///y6Pb/AAAAAP//90KP/wAKZmb/AAJR7P8ADOZmCP8AUjrh/wHHGZoF/wAD49f/ABV1w///8YUf/wARYUj//+oo9v8AAAAACP//gpR7/wAAAAAF///qK4X/AAAAAP//6y4U///unrj///wXCv//6oo9CP//qVHs//4gSj0F///tyj3//5t1w/8ARBma//+ubhT/AGY1w////7XDCP8BVx64////LhQF/wAAMzP/AAAAAP8AACuF/wAAFHv/AAAzM/8AAAAACP8AE/hS////64UF/wBmkez///+4Uv8AYiFI/wBRwAD/ABI1w/8AZOj2CP8AVt64/wHgo9cF/wADzM3/ABVeuP//8Wj2/wARYUj//+ouFP8AAAAACA752P8DKOwu/wK9wo8V//+AJmb/AAAAAAX//+oo9v8AAAAA///rMKT//+6hSP///BcK///qij0I//+txR///jjmZgX///2wpP//8xcK///zczP///WZmv//8uZm/wAAAAAI//7sCj3/AAAAAAX///Lo9v8AAAAA///3Qo//AApo9v8AAlHs/wAM5mYI/wBSOuH/AccZmgX/AAPj1/8AFXXD///xhR//ABFeuP//6ij2/wAAAAAI//+ClHv/AAAAAAX//+orhf8AAAAA///rLhT//+6hSP///BcK///qij0I//+pUez//iBHrgX//+3KPf//m3hS/wBEGZr//65uFP8AZjXD////tcMI/wFXHrj///8rhQX/AAAzM/8AAAAA/wAAK4X/AAAXCv8AADMz/wAAAAAI/wAT+FL////o9gX/AGaR7P///7hS/wBiIUj/AFHAAP8AEjXD/wBk64UI/wBW3rj/AeCj1wX/AAPPXP8AFV64///xZmb/ABFeuP//6i4U/wAAAAAI//5gYUj/AFnKPRX/ACJuFP8AAAAA/wAmXrj/AAAAAP8AHmj2/wAAAAAI/wASVwr/AAAAAP8AD964///+Zmb/AA+Ue/8AECPXCP8Am6uF/wChFHsF/wAE7hT/AAUZmv8AAWZm/wAHij3///064f8ABoeuCP///Trh/wAGhR////mZmv8ABD1x///464X/AAAAAAj//79Hrv8AAAAA//+7Qo//AAAAAP//4Bwp/wAAAAAI///wNcP/AAAAAP//8Vwp///4QAD///dAAP//8weuCP//lfCk//9itcMF///8Vwr///qZmv///6PX///5Ao//AAMPXP//+j1xCP8AAw9c///6OuH/AAYAAP///GFI/wAGgo//AAAAAAgO+dj/ATMSlP8DGq4UFf8ALcAA/wAAAAD/AEP4Uv8AAAAA/wAPFwr/AAAAAAj/AA1PXP8AAAAA/wAMwo//AAWMzf8ACQAA/wAJrhQI/wAxjM3/ADVuFAX/ACdo9v//zxwpBf8ACfXD///znCn/AA8mZv//+J64/wAPXrj/AAAAAAj/ABQUe/8AAAAA/wAQYUj/AAAAAP8ADWZm/wAAAAAI/wAAvXH/AAAAAP8ADWZm/wAAAAD/ACXAAP8AAAAACP8ABHhS/wAAAAD/AATKPf8AAAAA/wAFI9f/AAAAAAj/AAbFH/8AAAAA/wAGK4X/AAPeuP8AAvXD/wAGFwoI/wAC8zP/AAYXCv///zCk/wAHPXH///vPXP8ABU9cCP//izrh/wCTuFIF///35mb/AAo9cf//8564/wAGAo////LzM/8AAAAACP//5WFI/wAAAAD//+buFP8AAAAA///aFHv/AAAAAAj//+Do9v8AAAAA///lxR////WcKf//7oKP///szM0I//+GXCn//3qPXAX///tKPf//+tR7///+x67///iMzf8AAtR7///5nCkI/wAC0ez///mZmv8ABlHs///73rj/AAcAAP8AAAAACP8B9dma//+jDM0V//+AJmb/AAAAAAX//+oo9v8AAAAA///rMKT//+6euP///BcK///qij0I//+txR///jjmZgX///2wpP//8xcK///zczP///WcKf//8uZm/wAAAAAI//7sCj3/AAAAAAX///Lo9v8AAAAA///3Qo//AApmZv8AAlHs/wAM5mYI/wBSOuH/AccZmgX/AAPj1/8AFXXD///xhR//ABFhSP//6ij2/wAAAAAI//+ClHv/AAAAAAX//+orhf8AAAAA///rLhT//+6euP///BcK///qij0I//+pUez//iBKPQX//+3KPf//m3XD/wBEGZr//65uFP8AZjXD////tcMI/wFXHrj///8uFAX/AAAzM/8AAAAA/wAAK4X/AAAUe/8AADMz/wAAAAAI/wAT+FL////rhQX/AGaR7P///7hS/wBiIUj/AFHAAP8AEjXD/wBk6PYI/wBW3rj/AeCj1wX/AAPMzf8AFV64///xaPb/ABFhSP//6i4U/wAAAAAIDvnY/wMo7C7/Ar3CjxX//4AmZv8AAAAABf//6ij2/wAAAAD//+swpP//7qFI///8Fwr//+qKPQj//63FH//+OOZmBf///bCk///zFwr///NzM///9Zma///y5mb/AAAAAAj//uwKPf8AAAAABf//8uj2/wAAAAD///dCj/8ACmj2/wACUez/AAzmZgj/AFI64f8BxxmaBf8AA+PX/wAVdcP///GFH/8AEV64///qKPb/AAAAAAj//4KUe/8AAAAABf//6iuF/wAAAAD//+suFP//7qFI///8Fwr//+qKPQj//6lR7P/+IEeuBf//7co9//+beFL/AEQZmv//rm4U/wBmNcP///+1wwj/AVceuP///yuFBf8AADMz/wAAAAD/AAArhf8AABcK/wAAMzP/AAAAAAj/ABP4Uv///+j2Bf8AZpHs////uFL/AGIhSP8AUcAA/wASNcP/AGTrhQj/AFbeuP8B4KPXBf8AA89c/wAVXrj///Frhf8AEV64///qKPb/AAAAAAj//xl64f8AReZmFf8Aa49c/wAAAAAF/wATvXH/AAAAAP8AEtma/wAQI9f/AAOCj/8AE6j2CP8AEwUf/wBrkewF/wADbhT/ABO9cf//8tR7/wAP3Cn//+xCj/8AAAAACP//lHCk/wAAAAAF///sKPb/AAAAAP//7UAA///v8zP///x64f//7FmaCP//7RHs//+UcKQF///8euH//+wo9v8ADSj2///wIUj/ABPCj/8AAAAACP/+4Aeu/wAAAAAV/wBrj1z/AAAAAAX/ABO9cf8AAAAA/wAS2Zr/ABAj1/8AA4KP/wATqPYI/wATBR//AGuR7AX/AANuFP8AE71x///y1Hv/AA/cKf//7EKP/wAAAAAI//+UcKT/AAAAAAX//+wo9v8AAAAA///tQAD//+/zM////Hrh///sWZoI///tEez//5RwpAX///x9cf//7Cj2/wANK4X///AhSP8AE71x/wAAAAAIDvlh/wFULA//AxWcKRX/ACJrhf8AAAAA/wAmXrj/AAAAAP8AHmuF/wAAAAAI/wASVHv/AAAAAP8AD964///+Y9f/AA+XCv8AECPXCP8Am6uF/wChFwoF/wAE7hT/AAUXCv8AAWPX/wAHij3///064f8ABoeuCP///Trh/wAGhR////mcKf8ABD1x///46Pb/AAAAAAj//79KPf8AAAAA//+7Qo//AAAAAP//4Bma/wAAAAAI///wOFL/AAAAAP//8Vwp///4Qo////dAAP//8wUfCP//leuF//9itcMF///8WZr///qZmv///6FI///5Ao//AAMPXP//+j1xCP8AAxHs///6OFL/AAX9cf///GZm/wAGh67/AAAAAAj/AaBUe///pjXDFf//WI9c/wAAAAAF///x+FL/AAAAAP//8co9///4vXH///a1w///9BwpCP//XMAA//8u8KQF///7cKT///oj1///9m4U/wABgAD///0Hrv8ABw9cCP//qWZm/wDOXCkF///7KPb/AAvj1///9GZm/wAHQo////IR7P8AAAAACP//WJHs/wAAAAAF///tszP/AAAAAP//8Qeu///sY9f/AAaCj///8HrhCP8AqkzN//5p+FIF/wAA1Hv///jwpP8AAMAA///5T1z/AAC9cf//+PMzCP//3Ao9//84+uEF///8Fwr//+qHrv8ADpcK///uo9f/ABXUe/8AAAAACP8AhAUf/wAAAAAF/wAV1wr/AAAAAP8AFM9c/wARXCn/AAPo9v8AFXhSCP8AI/hS/wDHBR8F/wAC3Cn/AAZmZv8AAszN/wAGOuH/AALhSP8ABmuFCP8BPlHs/wGXszMF/wAMGZr/AA+Zmv//+DCk/wATnCn//+2cKf8AAAAACA75vP8CculV/wGPwAAV///Kh67/AAAAAAX///f9cf8AAAAA///7FHv/AAX64f8AAWj2/wAHzM0I/wAT64X/AHJHrgX/AANeuP8AE1cK/wAC3rj/ABBuFP8AAseu/wAQAo8I/wALOFL/AEBeuP//znCk/wA66Pb//76o9v8AAAAACP//Ph64/wAAAAAF//+hTM3/AAAAAP//pRwp//+0TM3//+764f//ovMzCP//qnMz//4VJmYF///8D1z//+lo9v8AEWFI///rVHv/ABbuFP8AAAAACP8AdCPX/wAAAAAF/wAZVwr/AAAAAP8AFaj2/wASOuH/AARR7P8AGPrhCP8AUQAA/wHUoUgF/wABlHv/AAimZv8ACLrh/wAHT1z/AAjCj/8AAAAACP8AP6Zm/wAAAAAF/wAIQAD/AAAAAP8ABjhS///4ij3///6KPf//9+ZmCP//7Ueu//+YB64F///u7hT//6Fo9v8AQEKP//+zDM3/AGBPXP8AAAAACP8ANXMz/wAAAAAF/wAHszP/AAAAAP8ABS4U///5zM3///6o9v//+G4UCP//+qj2///iT1wF///+a4X///cuFP//92FI///4yj3///cKPf8AAAAACP//HAKP/wAAAAAF///pMzP/AAAAAP//6vMz///ua4X///vuFP//6ZR7CP//7tma//+hBR8F///7z1z//+jmZv8AD/1x///s64X/ABeCj/8AAAAACP8BB7Ck////7hQF/wBfAAD/AAAAAP8AWwKP/wBL+FL/ABDhSP8AXWFICP8ACpwp/wA63rgF/wAQ/XH/AF4XCv//wCuF/wBNa4X//59XCv8AAAAACA75ov8BeT/L/wLteFIV/wAI9cP///Vrhf8ADVwp///5qPb/AA1mZv8AAAAACP8AG6Zm/wAAAAD/ACTCj/8AAAAA/wAf1wr/AAAAAAj/AAWhSP8AAAAA/wAFNcP/AAL64f8AAtma/wAE1woI/wAC3Cn/AATZmv8AABHs/wAF+uH///1FH/8ABO4UCP//tB64/wCJI9cF///30ez/AA69cf//8BR7/wAJhR///++AAP8AAAAACP//78zN/wAAAAD//7X4Uv8AAAAA///RAAD/AAAAAAj///nPXP8AAAAA///6YUj///xo9v///WZm///6Y9cI///9Zmb///pj1/8AAOZm///5Y9f/AAP9cf//+0UfCP8B0uFI//y4czMV//9LvXH/Aii1wwX///XhSP8AHNma///myj3/AAd1w///83Mz/wAAAAAI///3NcP////o9v//wMzN/wAAszP///RXCv///8euCP8AAAAA/wAAFwoF///gOFL///7AAP//4aZm///9hR///+h4Uv//4Eo9CP/+k2j2//3Xij0F///uzM3//+g1w/8ADTCk///iXCn/ABvHrv8AAAAACP8Al7Ck/wAAAAAF/wANIUj/AAAAAP8ADTrh/wAHEez/AAgo9v8AC2PXCP8AF89c/wAhqPYF/wAKeFL/ABAcKQX/ASgwpP8AAAAABf8ADrhS///QPXEF/wADxR////OcKf8ACpwp///3/XH/AAyj1/8AAAAACP8Aj6j2/wAAAAAF/wAYMKT/AAACj/8AE8KP/wAb+uH///g9cf8AF8UfCP/+ZKj2/wCywo8V/wBeT1z/AI/euAX/AC1zM///cCFIBQ75ov8C1Cef/wAz1HsV//9LwAD/Aii1wwX///XeuP8AHNma///mzM3/AAd1w///83Mz/wAAAAAI///3MzP////o9v//wMzN/wAAszP///RZmv///8euCP8AAAAA/wAAFwoF///gNcP///7AAP//4aj2///9hR///+h4Uv//4Eo9CP/+k2Zm//3Xij0F///uz1z//+g1w/8ADS4U///iXCn/ABvHrv8AAAAACP8Al7Ck/wAAAAAF/wANI9f/AAAAAP8ADThS/wAHEez/AAgo9v8AC2PXCP8AF89c/wAhqPYF/wAKeFL/ABAcKQX/ASgwpP8AAAAABf8ADrhS///QPXEF/wADxR////OcKf8ACp64///3/XH/AAyhSP8AAAAACP8Aj6uF/wAAAAAF/wAYMKT/AAACj/8AE8Uf/wAb+uH///g4Uv8AF8UfCP/+ZKj2/wCywo8V/wBeT1z/AI/euAX/AC11w///cCFIBf//zEKP/wH19cMV/wAe+uH/AAAAAP8AIoeu/wAAAAD/ABthSP8AAAAACP8AEH1x/wAAAAD/AA5KPf///ozN/wAOBR//AA6Hrgj/AIwcKf8AkPrhBf8ABG4U/wAElHv/AAFAAP8ABso9///9go//AAXeuAj///2FH/8ABd64///6PXH/AAPPXP//+Z64/wAAAAAI///Fwo//AAAAAP//wiPX/wAAAAD//+NMzf8AAAAACP//8co9/wAAAAD///LR7P//+Qeu///4IUj///RR7Aj//6CKPf//cnCkBf///LXD///7IUj///+rhf//+bhS/wACwo////rPXAj/AAK9cf//+tHs/wAFZmb///zAAP8ABd64/wAAAAAIDvmi/wER46L/At8R7BX/ACkrhf8AAAAA/wA9LhT/AAAAAP8ADZHs/wAAAAAI/wAL+uH/AAAAAP8AC31x/wAFAAD/AAgZmv8ACLhSCP8ALJma/wAwFHsF/wAjdcP//9QAAAX/AAj4Uv//9Nma/wANoUj///lZmv8ADdma/wAAAAAI/wASD1z/AAAAAP8ADr1x/wAAAAD/AAwPXP8AAAAACP8AAKuF/wAAAAD/AAwPXP8AAAAA/wAh+uH/AAAAAAj/AAQCj/8AAAAA/wAEUez/AAAAAP8ABKFI/wAAAAAI/wAGFwr/AAAAAP8ABY9c/wADfXH/AAKmZv8ABX1xCP8AAqZm/wAFfXH///9FH/8ABoAA///8OuH/AATHrgj//5bmZv8AhPCkBf//+LXD/wAJNcP///TcKf8ABWj2///0QAD/AAAAAAj//+gKPf8AAAAA///pcKT/AAAAAP//3d64/wAAAAAI///kB67/AAAAAP//6GFI///2pmb///BFH///7rhSCP//koeu//+H5mYF///7wo////tcKf///uZm///5R67/AAKKPf//+kAACP8AAozN///6QAD/AAWzM////Eeu/wAGSj3/AAAAAAj/AcJFH//9VMKPFf//S71x/wIotcMF///14Uj/ABzZmv//5so9/wAHdcP///NzM/8AAAAACP//9zXD////6Pb//8DMzf8AALMz///0Vwr////Hrgj/AAAAAP8AABcKBf//4DhS///+wAD//+GmZv///YUf///oeuH//+BKPQj//pNmZv/914o9Bf//7szN///oNcP/AA0wpP//4lwp/wAbx67/AAAAAAj/AJewpP8AAAAABf8ADSFI/wAAAAD/AA064f8ABxHs/wAIKPb/AAtj1wj/ABfPXP8AIaj2Bf8ACnhS/wAQHCkF/wEoMKT/AAAAAAX/AA64Uv//0D1xBf8AA8Uf///znCn/AAqcKf//9/1x/wAMo9f/AAAAAAj/AI+o9v8AAAAABf8AGDCk/wAAAo//ABPHrv8AG/rh///4OFL/ABfFHwj//mSo9v8AssKPFf8AXk9c/wCP3rgF/wAtczP//3AhSAUO+aL/AtQowf8AM9R7Ff//S71x/wIotcMF///14Uj/ABzZmv//5so9/wAHdcP///NzM/8AAAAACP//9zXD////6Pb//8DPXP8AALMz///0VHv////Hrgj/AAAAAP8AABcKBf//4Drh///+wAD//+Gj1////YUf///oeuH//+BKPQj//pNmZv/914o9Bf//7szN///oNcP/AA0wpP//4lwp/wAbx67/AAAAAAj/AJewpP8AAAAABf8ADSFI/wAAAAD/AA064f8ABxHs/wAIKPb/AAtj1wj/ABfPXP8AIaj2Bf8ACnhS/wAQHCkF/wEoMKT/AAAAAAX/AA64Uv//0D1xBf8AA8Uf///znCn/AAqcKf//9/1x/wAMo9f/AAAAAAj/AI+o9v8AAAAABf8AGDMz/wAAAo//ABPFH/8AG/rh///4OFL/ABfFHwj//mSo9v8AssKPFf8AXk9c/wCP3rgF/wAtczP//3AhSAX//11Cj/8CCpmaFf8ASIKP/wAAAAAF/wARGZr/AAAAAP///ZHs/wAUB67/AAkj1/8ACT1xCP8ADr1x/wAO49f/ABbPXP//+QzN/wAOY9f///TMzQj/AAmHrv//+JR7/wALQo////juFP8ACzhS///7QAAI/wAXnrj///YFH/8AGbXD/wAB+uH/ABkCj////zhSCP8ASOuF///9tcP/AClwpP8APi4U/wAEBR//AEKeuAj/AAAwpP8AAxR7Bf8AAIzN/wAJIUj///i9cf8AB7hS///22Zr/AAAAAAj/AAAAAP8AAAAA//+2MKT/AAAAAP////1x/wAAAAAI///wh67/AAAAAP8AALMz///vNcP///geuP//9sKPCP//9frh///0QAD//+81w////09c///y49f/AAZj1wj///iuFP8AA49c///5+uH/AAWhSP//+PhS/wADzM0I///4j1z/AAQHrv//+Meu/wAEWZr///hhSP8AA7XDCP//43rh/wAN5mb//6j1w/8AB/Mz///UwAD//8/Hrgj//+bCj///49ma///5DM3//+GcKf///OPX///cwo8I////MKT///awpP8AB2Zm///4B67/AAk9cf8AAAAACA75ov8C1CjB/wAz1HsV//9LvXH/Aii1wwX///XhSP8AHNma///myj3/AAd1w///83Mz/wAAAAAI///3NcP////o9v//wM9c/wAAszP///RUe////8euCP8AAAAA/wAAFwoF///gOFL///7AAP//4aZm///9hR///+h64f//4Eo9CP/+k2Zm//3Xij0F///uzM3//+g1w/8ADTCk///iXCn/ABvHrv8AAAAACP8Al7Ck/wAAAAAF/wANIUj/AAAAAP8ADTrh/wAHEez/AAgo9v8AC2PXCP8AF89c/wAhqPYF/wAKeFL/ABAcKQX/ASgwpP8AAAAABf8ADrhS///QPXEF/wADxR////OcKf8ACpwp///3/XH/AAyj1/8AAAAACP8Aj6j2/wAAAAAF/wAYMzP/AAACj/8AE8Uf/wAb+uH///g4Uv8AF8UfCP/+ZKj2/wCywo8V/wBeT1z/AI/euAX/AC1zM///cCFIBf8AQSZm/wHf5mYV/wBk7hT/AAAAAAX/ABKFH/8AAAAA/wARrhT/AA8mZv8AA0zN/wAScKQI/wAR3Cn/AGTwpAX/AAM1w/8AEoeu///zpmb/AA7hSP//7Xrh/wAAAAAI//+bEez/AAAAAAX//+1j1/8AAAAA///uZmb///DwpP///LMz///tkewI///uOuH//5sR7AX///yzM///7V64/wAMWZr///EcKf8AEoeu/wAAAAAI//7xxR//AAAAABX/AGTuFP8AAAAABf8AEoeu/wAAAAD/ABGrhf8ADyZm/wADT1z/ABJwpAj/ABHZmv8AZPCkBf8AAzXD/wASh67///OmZv8ADuFI///tfXH/AAAAAAj//5sR7P8AAAAABf//7WFI/wAAAAD//+5mZv//8PCk///8tcP//+2R7Aj//+464f//mxHsBf///LCk///tXrj/AAxZmv//8Rwp/wASh67/AAAAAAgO+aL/AtQowf8AM9R7Ff//S71x/wIotcMF///14Uj/ABzZmv//5so9/wAHdcP///NzM/8AAAAACP//9zXD////6Pb//8DMzf8AALMz///0Vwr////Hrgj/AAAAAP8AABcKBf//4Drh///+wAD//+Gj1////YUf///oeuH//+BKPQj//pNmZv/914o9Bf//7szN///oNcP/AA0wpP//4lwp/wAbx67/AAAAAAj/AJewpP8AAAAABf8ADSFI/wAAAAD/AA064f8ABxHs/wAIKPb/AAtj1wj/ABfPXP8AIaj2Bf8ACnhS/wAQHCkF/wEoMKT/AAAAAAX/AA64Uv//0D1xBf8AA8Uf///znCn/AAqcKf//9/1x/wAMo9f/AAAAAAj/AI+o9v8AAAAABf8AGDCk/wAAAo//ABPHrv8AG/rh///4OFL/ABfFHwj//mSo9v8AssKPFf8AXk9c/wCP3rgF/wAtczP//3AhSAX///XzM/8B5NcKFf8AARHs////9cP/AAER7P///964/wABFwr/AAAAAAj/AAEHrv8AAAAA/wABAo//AAAhSP8AAQeu/wAACj0I/wABEez////1w/8AAQ9c////3rj/AAEXCv8AAAAACP8AAQeu/wAAAAD/AAEHrv8AACFI/wABBR//AAAKPQj/AAER7P////XD/wABD1z////euP8AARcK/wAAAAAI/wABB67/AAAAAP8AAQUf/wAAIUj/AAEFH/8AAAo9CP8AQuj2///9xR//AC+64f8AM/Mz/wADaPb/AD3Uewj/AAOZmv8AQSPX///PuuH/ADirhf//wbXD///9+uEI///+64X/AAAKPf///vXD/wAAIUj///7o9v8AAAAACP///vXD/wAAAAD///764f///964///++uH////1wwj///7o9v8AAAo9///+7hT/AAAhSP///vCk/wAAAAAI///+9cP/AAAAAP///vrh////3rj///764f////XDCP///uj2/wAACj3///7rhf8AACFI///+64X/AAAAAAj///71w/8AAAAA///+/XH////euP///vrh////9cMI///+6Pb/AAAKPf///vXD/wAAIUj///7o9v8AAAAACP///vMz/wAAAAD///79cf///964///++uH////1wwj//6GR7P8AAyPX///Hz1z//4CKPf8ARceu//+1XrgI/wASbhT//+xFH/8AGjMz///yUez/AB9wpP8AAQUfCP//5xwp/wCMx64V/wAMFwr/ACiCj/8APFma///9xR//AAmHrv//1tHsCP8AAAzN////wo//AAAMzf///8eu/wAAD1z////FHwj/AAN4Uv//8HXD////B67///APXP//+4eu///xK4UI///zlwr//9bo9v//wuZm/wAB1Hv///ccKf8AKf1xCP///NR7/wAO49f/AACzM/8AEH1x/wAEtcP/AA/KPQgO+vb/BFrHef8Cgy4UFf/9Wx64/wAAAAAF/wAAAAD///4KPQX///RUe/8AABHs///2Fwr/AAAHrv///AzN////7hQI/wAAAAD/AAAXCgX//+A64f///sAA///ho9f///2FH///6HhS///gSj0I//6TaPb//deKPQX//+7Mzf//6DXD/wANMKT//+JcKf8AG8eu/wAAAAAI/wCXsKT/AAAAAAX/AA0hSP8AAAAA/wANOuH/AAcR7P8ACCj2/wALZmYI/wAXz1z/ACGmZgX/AAp4Uv8AEBwpBf8BKDCk/wAAAAAF/wAOuFL//9BAAAX/AAPFH///85wp/wAKnCn///f64f8ADKPX/wAAAAAI/wAHuFL/AAAAAAX////9cf///+4UBf8BwN64/wAAAAAF/wAO2Zr/AAAAAP8ADbXD/wALbhT/AAKj1/8ADpwpCP8AFiZm/wB7Qo8F/wABVwr/AAdrhf///kKP/wAHD1z///uAAP8ABWFICP//+4KP/wAFYUj///lZmv8AAvhS///4czP/AAAAAAj//qSPXP///9cKBf//65ma/wA+j1wF/wE1Jmb/AAAAAAX/AA7Zmv8AAAAA/wANszP/AAtuFP8AAqZm/wAOmZoI/wATvXH/AG0euAX/AAFUe/8AB24U///+Qo//AAcPXP//+4KP/wAFYUgI///7gAD/AAVhSP//+Vwp/wAC9cP///hzM/8AAAAACP/+fAzN////0ewF////czP///xCjwX//+jzM/8ARrCkBf8B8e4U/wAAAAAF/wAO3Cn/AAAAAP8ADbXD/wALeFL/AAKhSP8ADqPXCP8AFX1x/wB20ewF/wACwAD/AA84Uv//9Vwp/wAM+uH///BKPf8AAAAACP/83go9//5jaPYV/wBeT1z/AI/euAX/AC1zM///cCFIBQ75Ff8CcEJf/wKDLhQV//6jzM3/AAAAAAX//6FMzf8AAAAA//+lHCn//7RMzf//7vrh//+i8zMI///ITM3//tFhSAX///emZv//0j1x/wAKXCn//9TmZv8AGx64///feFII/wAbHrj//999cf8AKI9c///uGZr/AC6Hrv8AAAAACP8AUAKP/wAAAAAF///2DM3//914Uv//9lcK///fGZr///0Cj///+AKPCP///Yo9///5Zmb/AACMzf//+Kj2/wADbhT///nZmgj/AANuFP//+dcK/wAF9cP///uj1/8ABuj2///+oUgI/wAS3Cn///xAAP8AFwzN///7BR//AAjXCv///HXDCP8AHAUf///0wAD///vHrv//3964///rmZr///RAAAj//+0Zmv//9Rwp///gQo//AAIhSP//5yuF/wAN2ZoI///5qPb/AAOMzf//+Kj2/wAAq4X///mR7P///ZR7CP//+bCk///9nrj///rmZv//+szN///9BR////jCjwj///gPXP//6tcKBf//+3Ck///z1wr/AAXrhf//8mj2/wAMBR////sXCgj/AANMzf///qZm/wADDM3///7R7P8AAjrh////R64I/wBJnCn//+gmZv8AYf1x/wAPOFL/ACLZmv8ANlmaCP8AEkUf/wAcjM3/AAKXCv8ALrXD///g2Zr/AB5Zmgj///Grhf8ADfXD///pHCn/AAswpP//4Qo9/wAINcMI///9gAD/AACo9v///eFI/wABrhT///7Hrv8AAko9CP///so9/wACSj3////Mzf8AArMz/wAA2Zr/AAJwpAj/AA5PXP8AKQzNBf8As7rh/wAAAAAF/wAWa4X/AAAAAP8AFYAA/wAR8KT/AAQAAP8AFg9cCP8AESPX/wBfEewF/wAEMzP/ABcMzf//8A9c/wATIUj//+hwpP8AAAAACP/+0PXD/wAAAAAF///8I9f/AAAAAP///LMz/wABZmb///3euP8AAoo9CP///eFI/wACjM3///8zM/8AA3rh/wAArhT/AAPKPQj/AC9mZv8BBSZmBf8AAZR7/wAIpmb/AAi64f8AB09c/wAIwo//AAAAAAj/AS8KPf8AAAAABf8AFso9/wAAAAD/ABUPXP8AEY9c/wAEFHv/ABZuFAj/ABDMzf8AXOPXBf8ABDCk/wAXCj3///APXP8AEyFI///ocKT/AAAAAAgO+Uf/AYSUoP8C7XhSFf8ACPXD///1a4X/AA1Zmv//+aj2/wANaPb/AAAAAAj/ABumZv8AAAAA/wAkwo//AAAAAP8AH9cK/wAAAAAI/wAFnrj/AAAAAP8ABTXD/wAC+uH/AALcKf8ABNcKCP8AAtma/wAE2Zr/AAAPXP8ABfrh///9R67/AATuFAj//7QhSP8AiSPXBf//99R7/wAOvXH///AUe/8ACYUf///vfXH/AAAAAAj//+/Mzf8AAAAA//+1+FL/AAAAAP//0QKP/wAAAAAI///5z1z/AAAAAP//+l64///8aPb///1o9v//+mPXCP///WZm///6Y9f/AADj1///+WPX/wAEAAD///tFHwj/AZ8cKf//B8zNFf/97W4U/wAAAAAF///ph67/AAAAAP//6nhS///uBR////v64f//6ej2CP//mqPX//3PI9cF/wAAAAD////9cQX///4FH///9NR7/wACnrj///VwpP8ABrrh///39cMI/wAGvXH///f1w/8ACf1x///7kez/AAteuP8AAAAACP8CEpHs/wAAAAAF/wAO3Cn/AAAAAP8ADbXD/wALbhT/AAKhSP8ADpwpCP8AFij2/wB7QAAF/wABVwr/AAduFP///kKP/wAHD1z///uAAP8ABWFICP//+4AA/wAFYUj///lcKf8AAvXD///4czP/AAAAAAj//o9o9v///89cBf8ACvMz/wA8q4UF/wAAKPb/AADuFP8AATXD/wABBR//AAD1w/8AAAAACP8BKJwp/wAAAAAF/wAO2Zr/AAAAAP8ADbMz/wALbhT/AAKmZv8ADpmaCP8AE71x/wBtHrgF/wABVwr/AAduFP///kKP/wAHD1z///uAAP8ABWFICP//+4AA/wAFYUj///lcKf8AAvXD///4czP/AAAAAAj//teUe////89cBf8AC7XD/wBBAo8F/wAAKPb/AADuFP8AATXD/wABBR//AADzM/8AAAAACP8BcMUf/wAAAAAF/wAO3rj/AAAAAP8ADbMz/wALeFL/AAKhSP8ADqPXCP8AFYAA/wB20ewF/wACwo//AA81w///9Vma/wAM+uH///BMzf8AAAAACA75R/8BX8pj/wLcjM0V/wAe+uH/AAAAAP8AIoeu/wAAAAD/ABthSP8AAAAACP8AEH1x/wAAAAD/AA5KPf///ozN/wAOBR//AA6Hrgj/AIwcKf8AkPrhBf8ABG4U/wAElHv/AAFAAP8ABso9///9hR//AAXeuAj///2Cj/8ABd64///6PXH/AAPPXP//+aFI/wAAAAAI///FwAD/AAAAAP//wiPX/wAAAAD//+NMzf8AAAAACP//8czN/wAAAAD///LPXP//+Qeu///4IUj///RR7Aj//6CKPf//cnCkBf///LhS///7IUj///+rhf//+bhS/wACwAD///rPXAj/AALAAP//+tHs/wAFY9f///zAAP8ABd64/wAAAAAI/wFL8KT//6ahSBX//e1uFP8AAAAABf//6Yeu/wAAAAD//+p4Uv//7gUf///7+uH//+no9gj//5qj1//9zyPXBf8AAAAA/////XEF///+BR////TUe/8AAp64///1cKT/AAa64f//9/XDCP8ABr1x///39cP/AAn9cf//+5Hs/wALXrj/AAAAAAj/AhKR7P8AAAAABf8ADtwp/wAAAAD/AA21w/8AC24U/wACoUj/AA6cKQj/ABYo9v8Ae0AABf8AAVcK/wAHbhT///5Cj/8ABw9c///7gAD/AAVhSAj///uAAP8ABWFI///5XCn/AAL1w///+HMz/wAAAAAI//6PaPb////PXAX/AArzM/8APKuFBf8AACj2/wAA7hT/AAE1w/8AAQUf/wAA9cP/AAAAAAj/ASicKf8AAAAABf8ADtma/wAAAAD/AA2zM/8AC24U/wACpmb/AA6Zmgj/ABO9cf8AbR64Bf8AAVcK/wAHbhT///5Cj/8ABw9c///7gAD/AAVhSAj///uAAP8ABWFI///5XCn/AAL1w///+HMz/wAAAAAI//7XlHv////PXAX/AAu1w/8AQQKPBf8AACj2/wAA7hT/AAE1w/8AAQUf/wAA8zP/AAAAAAj/AXDFH/8AAAAABf8ADt64/wAAAAD/AA2zM/8AC3hS/wACoUj/AA6j1wj/ABWAAP8AdtHsBf8AAsUf/wAPNcP///VZmv8ADPrh///wSj3/AAAAAAgO+Uf/AQGmjP8C3xHsFf8AKS4U/wAAAAD/AD0rhf8AAAAA/wANlHv/AAAAAAj/AAv4Uv8AAAAA/wALgAD/AAUAAP8ACBma/wAIuFII/wAslwr/ADAUewX/ACN4Uv//1AAABf8ACPhS///02Zr/AA2euP//+Vma/wAN2Zr/AAAAAAj/ABIPXP8AAAAA/wAOwAD/AAAAAP8ADAzN/wAAAAAI/wAArhT/AAAAAP8ADA9c/wAAAAD/ACH64f8AAAAACP8ABAKP/wAAAAD/AARPXP8AAAAA/wAEoUj/AAAAAAj/AAYXCv8AAAAA/wAFkez/AAN9cf8AAqPX/wAFfXEI/wACpmb/AAV9cf///0eu/wAGgAD///w4Uv8ABMeuCP//luj2/wCE8KQF///4tcP/AAk1w///9Nwp/wAFaPb///Q9cf8AAAAACP//6AzN/wAAAAD//+lwpP8AAAAA///d3rj/AAAAAAj//+QFH/8AAAAA///oY9f///amZv//8EKP///uuFII//+Sh67//4fmZgX///vCj///+1wp///+6Pb///lHrv8AAoo9///6QAAI/wACh67///o9cf8ABbXD///8Sj3/AAZKPf8AAAAACP8BqhR7//+kHCkV//3tbhT/AAAAAAX//+mHrv8AAAAA///qeFL//+4FH///+/rh///p6PYI//+ao9f//c8j1wX/AAAAAP////1xBf///gUf///01Hv/AAKeuP//9XCk/wAGuuH///f1wwj/AAa9cf//9/XD/wAJ/XH///uR7P8AC164/wAAAAAI/wISkez/AAAAAAX/AA7cKf8AAAAA/wANtcP/AAtuFP8AAqFI/wAOnCkI/wAWKPb/AHtAAAX/AAFXCv8AB24U///+Qo//AAcPXP//+4AA/wAFYUgI///7gAD/AAVhSP//+Vwp/wAC9cP///hzM/8AAAAACP/+j2j2////z1wF/wAK8zP/ADyrhQX/AAAo9v8AAO4U/wABNcP/AAEFH/8AAPXD/wAAAAAI/wEonCn/AAAAAAX/AA7Zmv8AAAAA/wANszP/AAtuFP8AAqZm/wAOmZoI/wATvXH/AG0euAX/AAFXCv8AB24U///+Qo//AAcPXP//+4AA/wAFYUgI///7gAD/AAVhSP//+Vwp/wAC9cP///hzM/8AAAAACP/+15R7////z1wF/wALtcP/AEECjwX/AAAo9v8AAO4U/wABNcP/AAEFH/8AAPMz/wAAAAAI/wFwxR//AAAAAAX/AA7euP8AAAAA/wANszP/AAt4Uv8AAqPX/wAOo9cI/wAVfXH/AHbR7AX/AALFH/8ADzXD///1WZr/AAz64f//8Eo9/wAAAAAIDvlH/wKruwf/AoMuFBX//e1uFP8AAAAABf//6Yeu/wAAAAD//+p4Uv//7gUf///7+uH//+no9gj//5qj1//9zyPXBf8AAAAA/////XEF///+BR////TUe/8AAp64///1cKT/AAa64f//9/XDCP8ABr1x///39cP/AAn9cf//+5Hs/wALXrj/AAAAAAj/AhKR7P8AAAAABf8ADtwp/wAAAAD/AA21w/8AC24U/wACoUj/AA6cKQj/ABYo9v8Ae0AABf8AAVcK/wAHbhT///5Cj/8ABw9c///7gAD/AAVhSAj///uAAP8ABWFI///5XCn/AAL1w///+HMz/wAAAAAI//6PaPb////PXAX/AArzM/8APKuFBf8AACj2/wAA7hT/AAE1w/8AAQUf/wAA9cP/AAAAAAj/ASicKf8AAAAABf8ADtma/wAAAAD/AA2zM/8AC24U/wACpmb/AA6Zmgj/ABPAAP8AbRwpBf8AAVcK/wAHbhT///5Cj/8ABw9c///7gAD/AAVhSAj///uCj/8ABWFI///5WZr/AAL1w///+HMz/wAAAAAI//7XlHv////PXAX/AAu1w/8AQQKPBf8AACj2/wAA7hT/AAE4Uv8AAQUf/wAA8KT/AAAAAAj/AXDHrv8AAAAABf8ADtwp/wAAAAD/AA2zM/8AC3hS/wACo9f/AA6j1wj/ABV9cf8AdtHsBf8AAsAA/wAPOFL///VcKf8ADPrh///wSj3/AAAAAAj//1PeuP8AQ09cFf8AZO4U/wAAAAAF/wASh67/AAAAAP8AEauF/wAPJmb/AANPXP8AEnCkCP8AEdma/wBk8KQF/wADNcP/ABKHrv//86Zm/wAO4Uj//+19cf8AAAAACP//mxHs/wAAAAAF///tYUj/AAAAAP//7mZm///w8KT///y1w///7ZHsCP//7jrh//+bEewF///8sKT//+1euP8ADFma///xHCn/ABKHrv8AAAAACP/+8co9/wAAAAAV/wBk7hT/AAAAAAX/ABKHrv8AAAAA/wARq4X/AA8mZv8AA09c/wAScKQI/wAR2Zr/AGTwpAX/AAM1w/8AEoeu///zpmb/AA7hSP//7Xrh/wAAAAAI//+bEez/AAAAAAX//+1j1/8AAAAA///uZmb///DwpP///LMz///tkewI///uPXH//5sR7AX///yrhf//7V64/wAMXCn///EcKf8AEoo9/wAAAAAIDvfN/wEQil7/AoIAABX//4kZmv8AAAAABf//6TCk/wAAAAD//+rzM///7m4U///77hT//+mR7Aj//5rUe//90Cj2Bf///fXD///03Cn/AAKUe///9XhS/wAGsKT///f64Qj/AAa1w///9/Mz/wAJ+FL///uUe/8AC2FI/wAAAAAI/wB20ez/AAAAAAX/ABbKPf8AAAAA/wAVD1z/ABGPXP8ABBR7/wAWa4UI/wBlLhT/Ai/XCgX/AAQuFP8AFyFI///wGZr/ABMMzf//6IAA/wAAAAAI/wBibhT/AHIj1xX//7Qj1/8AiSFIBf//99Hs/wAOvXH///AUe/8ACYUf///vgAD/AAAAAAj//+/Mzf8AAAAA//+1+FL/AAAAAP//0QAA/wAAAAAI///5z1z/AAAAAP//+mFI///8aPb///1mZv//+mPXCP///WZm///6Y9f/AADj1///+WPX/wAEAAD///tFHwj/AHf4Uv//chR7Bf8ACPXD///1aPb/AA1cKf//+auF/wANZmb/AAAAAAj/ABumZv8AAAAA/wAkwo//AAAAAP8AH9cK/wAAAAAI/wAFoUj/AAAAAP8ABTMz/wAC+uH/AALcKf8ABNcKCP8AAtcK/wAE3Cn/AAAPXP8ABf1x///9R67/AATuFAgO987/ARCKXv8CggAAFf//iRma/wAAAAAF///pMKT/AAAAAP//6vMz///ubhT///vuFP//6ZHsCP//mtR7//3QKPYF///99cP///TcKf8AApR7///1eFL/AAawpP//9/rhCP8ABrXD///38zP/AAn4Uv//+5R7/wALYUj/AAAAAAj/AHbR7P8AAAAABf8AFso9/wAAAAD/ABUPXP8AEY9c/wAEFHv/ABZrhQj/AGUuFP8CL9cKBf8ABC4U/wAXIUj///AZmv8AEwzN///ogAD/AAAAAAj/AJjPXP8BCdmaFf///YKP/wAF3rj///o9cf8AA89c///5oUj/AAAAAAj//8XAAP8AAAAA///CI9f/AAAAAP//40zN/wAAAAAI///xzM3/AAAAAP//8s9c///5B67///ghSP//9FHsCP//oIo9//9ycKQF///8uFL///shSP///6uF///5uFL/AALAAP//+s9cCP8AAsKP///60ez/AAVj1////MAA/wAF3rj/AAAAAAj/AB764f8AAAAA/wAih67/AAAAAP8AG2FI/wAAAAAI/wAQgAD/AAAAAP8ADkeu///+jM3/AA4FH/8ADoeuCP8AjBwp/wCQ+uEF/wAEaPb/AASUe/8AAUKP/wAGyj3///2FH/8ABd64CA73zv8BEIvl/wKCAAAV//+JFwr/AAAAAAX//+kzM/8AAAAA///q8KT//+5uFP//++4U///pkewI//+a1Hv//dAo9gX///34Uv//9Nwp/wACkez///V4Uv8ABrCk///3+uEI/wAGuFL///fzM/8ACfXD///7lHv/AAthSP8AAAAACP8AdtHs/wAAAAAF/wAWzM3/AAAAAP8AFQzN/wARj1z/AAQUe/8AFmuFCP8AZTCk/wIv1woF/wAELhT/ABchSP//8BcK/wATDM3//+iCj/8AAAAACP8AmHhS/wB20ewV//+W64X/AITwpAX///izM/8ACTXD///03Cn/AAVo9v//9EAA/wAAAAAI///oCj3/AAAAAP//6XCk/wAAAAD//93hSP8AAAAACP//5AUf/wAAAAD//+hhSP//9qZm///wRR///+64Ugj//5KHrv//h+ZmBf//+8KP///7XCn///7o9v//+Ueu/wACh67///pAAAj/AAKKPf//+j1x/wAFszP///xHrv8ABkzN/wAAAAAI/wApK4X/AAAAAP8APS4U/wAAAAD/AA2Ue/8AAAAACP8AC/hS/wAAAAD/AAt9cf8ABQAA/wAIGZr/AAi4Ugj/ACyZmv8AMBR7Bf8AI3XD///UAAAF/wAI+FL///TXCv8ADaFI///5XCn/AA3Zmv8AAAAACP8AEg9c/wAAAAD/AA69cf8AAAAA/wAMD1z/AAAAAAj/AACuFP8AAAAA/wAMD1z/AAAAAP8AIfrh/wAAAAAI/wAEAAD/AAAAAP8ABFHs/wAAAAD/AAShSP8AAAAACP8ABhcK/wAAAAD/AAWPXP8AA3rh/wACpmb/AAV9cQj/AAKmZv8ABX1x////R67/AAaFH////DXD/wAEx64IDvfO/wEQi+X/AoIAABX//4kXCv8AAAAABf//6TMz/wAAAAD//+rwpP//7m4U///77hT//+mR7Aj//5rUe//90Cj2Bf///fhS///03Cn/AAKR7P//9XhS/wAGsKT///f64Qj/AAa4Uv//9/Mz/wAJ9cP///uUe/8AC2FI/wAAAAAI/wB20ez/AAAAAAX/ABbMzf8AAAAA/wAVDM3/ABGPXP8ABBR7/wAWa4UI/wBlMKT/Ai/XCgX/AAQuFP8AFyFI///wFwr/ABMMzf//6IKP/wAAAAAI/wCvczP/AOxrhRX//5sR7P8AAAAABf//7WFI/wAAAAD//+5mZv//8PCk///8tcP//+2PXAj//+464f//mxR7Bf///LMz///tYUj/AAxcKf//8Rwp/wAShR//AAAAAAj/AGTuFP8AAAAABf8AEoeu/wAAAAD/ABGrhf8ADyZm/wADT1z/ABJwpAj/ABHcKf8AZPCkBf8AAzMz/wAShR////Oj1/8ADuFI///tfXH/AAAAAAj//m8mZv//WBHsFf8AZO4U/wAAAAAF/wASh67/AAAAAP8AEauF/wAPJmb/AANPXP8AEnCkCP8AEdma/wBk8KQF/wADNcP/ABKHrv//86Zm/wAO4Uj//+164f8AAAAACP//mxHs/wAAAAAF///tY9f/AAAAAP//7mZm///w8KT///y1w///7ZHsCP//7jrh//+bEewF///8sKT//+1euP8ADFma///xHCn/ABKHrv8AAAAACA75mv8BG7ry/wLxMKQV/wBIgo//AAAAAAX/ABEXCv8AAAAA///9lHv/ABQHrv8ACSPX/wAJPXEI/wAOvXH/AA7j1/8AFs9c///5DM3/AA5j1///9MzNCP8ACYeu///4lHv/AAtCj///+O4U/wALNcP///tAAAj/ABehSP//9gUf/wAZtcP/AAH64f8AGQKP////OFII/wBI64X///21w/8AKXCk/wA+LhT/AAQFH/8AQqPXCP8AADCk/wADEewF/wAAjM3/AAkhSP//+L1x/wAHuFL///bZmv8AAAAACP8AAAAA/wAAAAD//7YwpP8AAAAA/////XH/AAAAAAj///CHrv8AAAAA/wAAszP//+81w///+B64///2wo8I///1+uH///RAAP//7zXD////T1z///LhSP8ABmPXCP//+LCk/wADkez///n64f8ABZ64///4+FL/AAPMzQj///iPXP8ABAeu///4x67/AARZmv//+GFI/wADtcMI///jeuH/AA3mZv//qPXD/wAH8zP//9TAAP//z8euCP//5sKP///j2Zr///kMzf//4Zwp///849f//9zCjwj///8wpP//9q4U/wAHZmb///gHrv8ACT1x/wAAAAAI/wHDRR///5CR7BX//4oFH/8AAAAABf//6TMz/wAAAAD//+rzM///7nCk///764X//+mPXAj//8trhf/+3MUfBf///8AA///+uFL///8XCv///4zN////R67////Zmgj///+Hrv///+Zm///+aPb////R7P///yj2/wABNcMI//9Nnrj/AT0FHwX///mAAP8ACaPX///1DM3/AAWHrv//81wp/wAAAAAI//9plHv/AAAAAAX//+kzM/8AAAAA///q8zP//+5wpP//++uF///pj1wI//+a5mb//dB9cQX///vHrv//6OFI/wAQD1z//+zzM/8AF3hS/wAAAAAI/wB1+FL/AAAAAAX/ABbKPf8AAAAA/wAVD1z/ABGR7P8ABBR7/wAWa4UI/wA5B67/ATtrhQX/AAAAAP8AAAo9Bf8AACuF/wAA+uH/AACZmv8AAJma/wABB67/AAA4Ugj/AAB64f8AABcK/wABoUj/AAA4Uv8AAN64///+wAAI/wDCK4X//qq64QX/AAaPXP//9mFI/wAK9cP///p9cf8ADIo9/wAAAAAI/wCCR67/AAAAAAX/ABbMzf8AAAAA/wAVDM3/ABGPXP8ABBR7/wAWcKQI/wBlGZr/Ai+HrgX/AAQeuP8AFyFI///wCj3/ABMZmv//6HhS/wAAAAAIDvm1/wG5tWn/Au14UhX/AAj1w///9WuF/wANWZr///mo9v8ADWj2/wAAAAAI/wAbpmb/AAAAAP8AJMKP/wAAAAD/AB/XCv8AAAAACP8ABZ64/wAAAAD/AAU1w/8AAvrh/wAC3Cn/AATXCgj/AALZmv8ABNma/wAAFHv/AAX64f///UKP/wAE7hQI//+0Hrj/AIkj1wX///fUe/8ADr1x///wFHv/AAmFH///731x/wAAAAAI///vzM3/AAAAAP//tfhS/wAAAAD//9ECj/8AAAAACP//+c9c/wAAAAD///peuP///Gj2///9Zmb///pj1wj///1o9v//+mPX/wAA49f///lj1/8ABAAA///7RR8I/wE95mb//wij1xX//pSuFP8AAAAABf//oQAA/wAAAAD//6T9cf//tAUf///vHrj//6KhSAj//8k9cf/+0N64Bf//7w9c//+iSj3/AD9mZv//siuF/wBhDM3/AAAAAAj/AWtUe/8AAAAABf8AXv1x/wAAAAD/AFsFH/8AS/hS/wAQ3rj/AF1hSAj/ADbFH/8BLyFIBf8AEOj2/wBdq4X//8CuFP8ATd64//+e49f/AAAAAAj//5HMzf/+PRmaFf///m4U///3Vwr///c64f//+LMz///3MKT/AAAAAAj//u5j1/8AAAAABf///CPX/wAAAAD///ywpP8AAWZm///93rj/AAKMzQj///3hSP8AAozN////NcP/AAN64f8AAK4U/wADx64I/wAvaPb/AQZAAAX/AAGKPf8ACKZm/wAIx67/AAdKPf8ACNHs/wAAAAAI/wERgo//AAAAAAX/AAPcKf8AAAAA/wADT1z///6XCv8AAiFI///9dcMI/wACIUj///11w/8AAMo9///8go////9R7P///DXDCA75tf8BdwdV/wLcjM0V/wAe+uH/AAAAAP8AIoeu/wAAAAD/ABthSP8AAAAACP8AEIAA/wAAAAD/AA5Hrv///ozN/wAOBR//AA6Hrgj/AIwcKf8AkPrhBf8ABHCk/wAElHv/AAFAAP8ABso9///9go//AAXeuAj///2Cj/8ABd64///6PXH/AAPPXP//+aFI/wAAAAAI///FwAD/AAAAAP//wiPX/wAAAAD//+NMzf8AAAAACP//8czN/wAAAAD///LPXP//+Qeu///4I9f///RR7Aj//6CHrv//cnCkBf///LhS///7IUj///+rhf//+bhS/wACwAD///rPXAj/AALAAP//+tHs/wAFY9f///zAAP8ABd64/wAAAAAI/wEInCn//6d4UhX//pSuFP8AAAAABf//oQAA/wAAAAD//6T9cf//tAUf///vHrj//6KhSAj//8k9cf/+0N64Bf//7w9c//+iSj3/AD9mZv//siuF/wBhDM3/AAAAAAj/AWtUe/8AAAAABf8AXv1x/wAAAAD/AFsFH/8AS/hS/wAQ3rj/AF1hSAj/ADbFH/8BLyFIBf8AEOj2/wBdq4X//8CuFP8ATd64//+e49f/AAAAAAj//5HMzf/+PRmaFf///m4U///3Vwr///c64f//+LMz///3MKT/AAAAAAj//u5j1/8AAAAABf///CPX/wAAAAD///ywpP8AAWZm///93rj/AAKMzQj///3hSP8AAozN////NcP/AAN64f8AAK4U/wADx64I/wAvaPb/AQZAAAX/AAGKPf8ACKZm/wAIx67/AAdKPf8ACNHs/wAAAAAI/wERgo//AAAAAAX/AAPcKf8AAAAA/wADT1z///6XCv8AAiFI///9dcMI/wACIUj///11w/8AAMo9///8go////9R7P///DXDCA75tf8BHjf5/wLfEewV/wApLhT/AAAAAP8APSuF/wAAAAD/AA2Ue/8AAAAACP8AC/hS/wAAAAD/AAuAAP8ABQAA/wAIGZr/AAi4Ugj/ACyXCv8AMBR7Bf8AI3hS///UAAAF/wAI+FL///TZmv8ADaFI///5WZr/AA3XCv8AAAAACP8AEhHs/wAAAAD/AA69cf8AAAAA/wAMD1z/AAAAAAj/AACrhf8AAAAA/wAMD1z/AAAAAP8AIfrh/wAAAAAI/wAEAo//AAAAAP8ABE9c/wAAAAD/AAShSP8AAAAACP8ABhcK/wAAAAD/AAWR7P8AA31x/wACpmb/AAV9cQj/AAKmZv8ABX1x////RR//AAaAAP///Drh/wAEx64I//+W5mb/AITzMwX///i1w/8ACThS///03Cn/AAVmZv//9EAA/wAAAAAI///oCj3/AAAAAP//6XCk/wAAAAD//93euP8AAAAACP//5AUf/wAAAAD//+hj1///9qZm///wQo///+64Ugj//5KHrv//h+j2Bf//+8KP///7WZr///7o9v//+Uo9/wACij3///o9cQj/AAKMzf//+j1x/wAFszP///xHrv8ABkeu/wAAAAAI/wFha4X//6TzMxX//pSuFP8AAAAABf//oQAA/wAAAAD//6T9cf//tAUf///vHrj//6KhSAj//8k9cf/+0N64Bf//7w9c//+iSj3/AD9mZv//siuF/wBhDM3/AAAAAAj/AWtUe/8AAAAABf8AXv1x/wAAAAD/AFsFH/8AS/hS/wAQ3rj/AF1hSAj/ADbFH/8BLyFIBf8AEOj2/wBdq4X//8CuFP8ATd64//+e49f/AAAAAAj//5HMzf/+PRmaFf///m4U///3Vwr///c64f//+LMz///3MKT/AAAAAAj//u5j1/8AAAAABf///CPX/wAAAAD///ywpP8AAWZm///93rj/AAKMzQj///3hSP8AAozN////NcP/AAN64f8AAK4U/wADx64I/wAvaPb/AQZAAAX/AAGKPf8ACKZm/wAIx67/AAdKPf8ACNHs/wAAAAAI/wERgo//AAAAAAX/AAPcKf8AAAAA/wADT1z///6XCv8AAiFI///9dcMI/wACIUj///11w/8AAMo9///8go////9R7P///DXDCA75tf8Cf6N+/wKEBR8V//6UrhT/AAAAAAX//6EAAP8AAAAA//+k/XH//7QFH///7x64//+ioUgI///JPXH//tDeuAX//+8PXP//oko9/wA/Zmb//7Irhf8AYQzN/wAAAAAI/wFrVHv/AAAAAAX/AF79cf8AAAAA/wBbBR//AEv4Uv8AEN64/wBdYUgI/wA2xR//AS8hSAX/ABDo9v8AXauF///ArhT/AE3euP//nuPX/wAAAAAI//+RzM3//j0ZmhX///5uFP//91cK///3OuH///izM///9zCk/wAAAAAI//7uY9f/AAAAAAX///wj1/8AAAAA///8sKT/AAFmZv///d64/wACjM0I///94Uj/AAKMzf///zXD/wADeuH/AACuFP8AA8euCP8AL2j2/wEGQAAF/wABij3/AAimZv8ACMeu/wAHSj3/AAjR7P8AAAAACP8BEYKP/wAAAAAF/wAD3Cn/AAAAAP8AA09c///+lwr/AAIhSP///XXDCP8AAiFI///9dcP/AADKPf///IKP////Uez///w1wwj//vcFH/8BKdmaFf8ASIKP/wAAAAAF/wARGZr/AAAAAP///ZHs/wAUB67/AAkj1/8ACT1xCP8ADsAA/wAO49f/ABbMzf//+QzN/wAOY9f///TMzQj/AAmHrv//+JR7/wALRR////juFP8ACzXD///7QAAI/wAXoUj///YFH/8AGbXD/wAB+uH/ABkCj////zhSCP8ASOj2///9tcP/AClzM/8APi4U/wAEB67/AEKeuAj/AAAuFP8AAxR7Bf8AAIzN/wAJIUj///jAAP8AB7hS///21wr/AAAAAAj/AAAAAP8AAAAA//+2MzP/AAAAAP////rh/wAAAAAI///wij3/AAAAAP8AALMz///vNcP///geuP//9sKPCP//9fhS///0QAD//+81w////09c///y49f/AAZj1wj///iwpP8AA49c///5+uH/AAWhSP//+PXD/wADzM0I///4kez/AAQHrv//+Meu/wAEWZr///hhSP8AA7XDCP//43rh/wAN5mb//6jzM/8AB/Mz///Uwo///8/Hrgj//+bAAP//49ma///5D1z//+GcKf///OFI///cwo8I////K4X///awpP8AB2Zm///4B67/AAlAAP8AAAAACA75tf8Cf6N+/wKEBR8V//6UrhT/AAAAAAX//6EAAP8AAAAA//+k/XH//7QFH///7x64//+ioUgI///JPXH//tDeuAX//+8PXP//oko9/wA/Zmb//7Irhf8AYQzN/wAAAAAI/wFrVHv/AAAAAAX/AF79cf8AAAAA/wBbBR//AEv4Uv8AEN64/wBdYUgI/wA2xR//AS8hSAX/ABDo9v8AXauF///ArhT/AE3euP//nuPX/wAAAAAI//+Ryj3//j0ZmhX///5uFP//91cK///3OFL///izM///9zCk/wAAAAAI//7uZmb/AAAAAAX///whSP8AAAAA///8szP/AAFmZv///dwp/wACjM0I///94Uj/AAKMzf///zhS/wADeuH/AACrhf8AA8euCP8AL2uF/wEGQAAF/wABij3/AAimZv8ACMUf/wAHSj3/AAjUe/8AAAAACP8BEYKP/wAAAAAF/wAD3Cn/AAAAAP8AA09c///+lwr/AAIhSP///XXDCP8AAiFI///9dcP/AADKPf///IKP////Uez///w1wwj//+wUe/8A/yZmFf8AZOuF/wAAAAAF/wASh67/AAAAAP8AEauF/wAPJmb/AANPXP8AEnCkCP8AEdwp/wBk8KQF/wADNcP/ABKHrv//86Zm/wAO4Uj//+164f8AAAAACP//mxHs/wAAAAAF///tY9f/AAAAAP//7mZm///w8KT///yzM///7ZHsCP//7jrh//+bEewF///8sKT//+1euP8ADFwp///xHCn/ABKHrv8AAAAACP/+8ceu/wAAAAAV/wBk7hT/AAAAAAX/ABKHrv8AAAAA/wARq4X/AA8mZv8AA09c/wAScKQI/wAR2Zr/AGTwpAX/AAM4Uv8AEoeu///zo9f/AA7hSP//7X1x/wAAAAAI//+bEez/AAAAAAX//+1hSP8AAAAA///uaPb///DwpP///LMz///tkewI///uOuH//5sR7AX///ywpP//7V64/wAMWZr///EcKf8AEoeu/wAAAAAIDvm1/wJ/o37/AoQFHxX//pSuFP8AAAAABf//oQAA/wAAAAD//6T9cf//tAUf///vHrj//6KhSAj//8k9cf/+0N64Bf//7w9c//+iSj3/AD9mZv//siuF/wBhDM3/AAAAAAj/AWtUe/8AAAAABf8AXv1x/wAAAAD/AFsFH/8AS/hS/wAQ3rj/AF1hSAj/ADbFH/8BLyFIBf8AEOj2/wBdq4X//8CuFP8ATd64//+e49f/AAAAAAj//pDrhf//QSZmFf8AAYo9/wAIpmb/AAjHrv8AB0o9/wAI0ez/AAAAAAj/APmAAP8AAAAABf/+0YzN//81FwoF/wEirhT//7brhRX///5uFP//91cK///3OFL///izM///9zCk/wAAAAAI//7uZmb/AAAAAAX///xCj/8AAAAA///80ez/AAFcKf///d64/wACZmYI/wFU3Cn/AOSmZgUO+Zn/AbBui/8C7XhSFf8ACPXD///1a4X/AA1Zmv//+aj2/wANaPb/AAAAAAj/ABumZv8AAAAA/wAkwo//AAAAAP8AH9cK/wAAAAAI/wAFnrj/AAAAAP8ABTXD/wAC+uH/AALcKf8ABNcKCP8AAtma/wAE2Zr/AAAUe/8ABfrh///9Qo//AATuFAj//7QeuP8AiSPXBf//99R7/wAOvXH///AUe/8ACYUf///vfXH/AAAAAAj//+/Mzf8AAAAA//+1+FL/AAAAAP//0QKP/wAAAAAI///5z1z/AAAAAP//+l64///8aPb///1o9v//+mPXCP///WZm///6Y9f/AADj1///+WPX/wAEAAD///tFHwj/AapHrv//CHhSFf//jPMz/wAAAAAF///pMKT/AAAAAP//6vMz///ubhT///vuFP//6ZHsCP//tf1x//5mbhQF///+czP///dZmv//9zhS///4sKT///cuFP8AAAAACP//B6PX/wAAAAAF///8Jmb/AAAAAP///LMz/wABZmb///3euP8AAozNCP///d64/wACjM3///8zM/8AA31x/wAAq4X/AAPMzQj/AEoCj/8BmY9cBf8ABDMz/wAXDM3///AhSP8AEyFI///oczP/AAAAAAj//48cKf8AAAAABf//6ZcK/wAAAAD//+qAAP//7g9c///7+uH//+nwpAj//7IAAP/+UEUfBf//7xcK//+imZr/AD8Mzf//sko9/wBgwo/////AAAj/ATTUe////z1xBf8AATXD/wAAFHsF/wARQo/////rhQX/AAAo9v8AAAAA/wAAKPb/AAAAAP8AACj2/wAAAAAI/wBe5mb/AAAAAP8AWs9c/wBLzM3/ABDeuP8AXWFICP8ATi4U/wGwlHsF/wAAAAD/AAACjwX/AAQeuP8AFv1x///wCj3/ABMXCv//6HhS/wAAAAAIDvmZ/wFovef/AtycKRX/AB764f8AAAAA/wAih67/AAAAAP8AG2FI/wAAAAAI/wAQgo//AAAAAP8ADkUf///+j1z/AA4FH/8ADoUfCP8AjBwp/wCQ+uEF/wAEcKT/AASUe/8AAUAA/wAGyj3///2Cj/8ABd64CP///YKP/wAF3rj///o9cf8AA89c///5oUj/AAAAAAj//8XAAP8AAAAA///CI9f/AAAAAP//40zN/wAAAAAI///xzM3/AAAAAP//8s9c///5B67///ghSP//9FHsCP//oIo9//9ycKQF///8uFL///shSP///6uF///5uFL/AALAAP//+s9cCP8AAsAA///60ez/AAVj1////MAA/wAF3rj/AAAAAAj/AXoAAP//p0zNFf//jPMz/wAAAAAF///pMKT/AAAAAP//6vMz///ubhT///vuFP//6ZHsCP//tf1x//5mbhQF///+czP///dZmv//9zhS///4szP///cuFP8AAAAACP//B6PX/wAAAAAF///8Jmb/AAAAAP///LMz/wABY9f///3euP8AAozNCP///d64/wACjM3///8zM/8AA31x/wAAq4X/AAPMzQj/AEoCj/8BmY9cBf8ABDMz/wAXDM3///AhSP8AEyFI///oczP/AAAAAAj//48cKf8AAAAABf//6ZcK/wAAAAD//+qAAP//7g9c///7+uH//+nwpAj//7IAAP/+UEeuBf//7xcK//+ilwr/AD8Mzf//sko9/wBgwo/////AAAj/ATTUe////z1xBf8AATXD/wAAFHsF/wARQo/////rhQX/AAAo9v8AAAAA/wAAKPb/AAAAAP8AACj2/wAAAAAI/wBe5mb/AAAAAP8AWs9c/wBLzM3/ABDeuP8AXWFICP8ATi4U/wGwlHsF/wAAAAD/AAACjwX/AAQcKf8AFv1x///wDM3/ABMXCv//6HhS/wAAAAAIDvmZ/wEWs6r/At8R7BX/ACkrhf8AAAAA/wA9LhT/AAAAAP8ADZHs/wAAAAAI/wAL+uH/AAAAAP8AC31x/wAFAAD/AAgZmv8ACLhSCP8ALJma/wAwFHsF/wAjdcP//9QAAAX/AAj4Uv//9Nma/wANoUj///lZmv8ADdma/wAAAAAI/wASD1z/AAAAAP8ADr1x/wAAAAD/AAwPXP8AAAAACP8AAKuF/wAAAAD/AAwPXP8AAAAA/wAh+uH/AAAAAAj/AAQCj/8AAAAA/wAEUez/AAAAAP8ABKFI/wAAAAAI/wAGFwr/AAAAAP8ABY9c/wADfXH/AAKmZv8ABX1xCP8AAqj2/wAFfXH///9FH/8ABoAA///8OFL/AATHrgj//5bmZv8AhPCkBf//+LXD/wAJNcP///TcKf8ABWj2///0QAD/AAAAAAj//+gKPf8AAAAA///pcKT/AAAAAP//3d64/wAAAAAI///kB67/AAAAAP//6GFI///2pmb///BFH///7rhSCP//koeu//+H5mYF///7wo////tcKf///uj2///5R67/AAKHrv//+kAACP8AAozN///6QAD/AAWzM////Eeu/wAGSj3/AAAAAAj/AcwKPf//pMeuFf//jPMz/wAAAAAF///pMKT/AAAAAP//6vMz///ubhT///vuFP//6ZHsCP//tf1x//5mbhQF///+czP///dZmv//9zhS///4sKT///cuFP8AAAAACP//B6PX/wAAAAAF///8Jmb/AAAAAP///LMz/wABZmb///3euP8AAozNCP///d64/wACjM3///8zM/8AA31x/wAAq4X/AAPMzQj/AEoCj/8BmY9cBf8ABDMz/wAXDM3///AhSP8AEyFI///oczP/AAAAAAj//48cKf8AAAAABf//6ZcK/wAAAAD//+qAAP//7g9c///7+uH//+nwpAj//7IAAP/+UEUfBf//7xcK//+imZr/AD8Mzf//sko9/wBgwo/////AAAj/ATTUe////z1xBf8AATXD/wAAFHsF/wARQo/////rhQX/AAAo9v8AAAAA/wAAKPb/AAAAAP8AACj2/wAAAAAI/wBe5mb/AAAAAP8AWs9c/wBLzM3/ABDeuP8AXWFICP8ATi4U/wGwlHsF/wAAAAD/AAACjwX/AAQeuP8AFv1x///wCj3/ABMXCv//6HhS/wAAAAAIDvmZ/wLivef/AoPZmhX//4zzM/8AAAAABf//6TCk/wAAAAD//+rzM///7m4U///77hT//+mR7Aj//7X9cf/+Zm4UBf///nMz///3WZr///c4Uv//+LCk///3LhT/AAAAAAj//wej1/8AAAAABf///CZm/wAAAAD///yzM/8AAWZm///93rj/AAKMzQj///3euP8AAozN////MzP/AAN9cf8AAKuF/wADzM0I/wBKAo//AZmPXAX/AAQzM/8AFwzN///wIUj/ABMhSP//6HMz/wAAAAAI//+PHCn/AAAAAAX//+mXCv8AAAAA///qgAD//+4PXP//+/rh///p8KQI//+yAAD//lBFHwX//+8XCv//opma/wA/DM3//7JKPf8AYMKP////wAAI/wE01Hv///89cQX/AAE1w/8AABR7Bf8AEUKP////64UF/wAAKPb/AAAAAP8AACj2/wAAAAD/AAAo9v8AAAAACP8AXuZm/wAAAAD/AFrPXP8AS8zN/wAQ3rj/AF1hSAj/AE4uFP8BsJR7Bf8AAAAA/wAAAo8F/wAEHrj/ABb9cf//8Ao9/wATFwr//+h4Uv8AAAAACP//N9ma/wA3o9cV/wBk7hT/AAAAAAX/ABKHrv8AAAAA/wARq4X/AA8j1/8AA09c/wASczMI/wAR2Zr/AGTwpAX/AAM1w/8AEoeu///zpmb/AA7euP//7Xrh/wAAAAAI//+bFHv/AAAAAAX//+1hSP8AAAAA///uZmb///DwpP///LXD///tkewI///uOuH//5sR7AX///ywpP//7WPX/wAMWZr///EZmv8AEoeu/wAAAAAI//7xxR//AAAAABX/AGTuFP8AAAAABf8AEoeu/wAAAAD/ABGrhf8ADyPX/wADT1z/ABJzMwj/ABHcKf8AZPCkBf8AAzXD/wASh67///OmZv8ADt64///teuH/AAAAAAj//5sR7P8AAAAABf//7WPX/wAAAAD//+5mZv//8PCk///8szP//+2R7Aj//+464f//mxHsBf///LCk///tY9f/AAxcKf//8Rma/wAShR//AAAAAAgO+Sv/ATuH4f8C3IzNFf8AHvrh/wAAAAD/ACKHrv8AAAAA/wAbYUj/AAAAAAj/ABB9cf8AAAAA/wAOSj3///6Mzf8ADgUf/wAOh64I/wCMHCn/AJD64QX/AARuFP8ABJR7/wABQAD/AAbKPf///YKP/wAF3rgI///9hR//AAXeuP//+j1x/wADz1z///meuP8AAAAACP//xcKP/wAAAAD//8Ij1/8AAAAA///jTM3/AAAAAAj///HKPf8AAAAA///y0ez///kHrv//+CFI///0UewI//+gij3//3JwpAX///y1w///+yFI////q4X///m4Uv8AAsKP///6z1wI/wACwAD///rR7P8ABV64///8wAD/AAXj1/8AAAAACP8BdoAA//+lij0V//9pTM3/AAAAAAX///FmZv8AAAAA///xj1z///irhf//9nCk///zvXEI//9tFHv//0PcKQX///9AAP///w9c///+6Pb////64f///3rh/wAAFwoI////kez/AAAPXP///oo9/wAAT1z///9Zmv8AAYeuCP//shR7/wC5qPYF///6uuH/AAz9cf//81wp/wAID1z///DmZv8AAAAACP//aVHs/wAAAAAF///1q4X/AAAAAP//9dR7///6XCn///n4Uv//9uj2CP//+pma///349f///7XCv//9r1x/wADXCn///f9cQj/AJjwpP/+k2FIBf8AAKuF///6RR//AACZmv//+oeu/wAAmZr///pFHwj//9/PXP//TcKPBf//+8eu///o6Pb/AA/64f//7Oj2/wAXh67/AAAAAAj/AHbR7P8AAAAABf8AFseu/wAAAAD/ABUPXP8AEY9c/wAEFwr/ABZwpAj/ACA64f8AsmFIBf8ABxR7/wAPx64F/wEeCj3/AW5ZmgX/AAACj/8AAAeuBf8ADgzN/wASIUj///XwpP8AF2Zm///qczP/AAAAAAgO+Sv/ArIH4f8CghcKFf//aUzN/wAAAAAF///xY9f/AAAAAP//8ZHs///4q4X///ZwpP//871xCP//bRR7//9D3CkF////QAD///8PXP///uj2////+uH///94Uv8AABcKCP///5Hs/wAAD1z///6Mzf8AAE9c////WZr/AAGHrgj//7IUe/8Auaj2Bf//+rrh/wAM/XH///NcKf8ACA9c///w5mb/AAAAAAj//2lR7P8AAAAABf//9auF/wAAAAD///XR7P//+lwp///5+uH///bo9gj///qZmv//9+PX///+1wr///a9cf8AA1wp///3/XEI/wCY7hT//pNhSAX/AACuFP//+kUf/wAAmZr///qHrv8AAJma///6RR8I///fz1z//03CjwX///vHrv//6Oj2/wAP+uH//+zo9v8AF4eu/wAAAAAI/wB20ez/AAAAAAX/ABbHrv8AAAAA/wAVDM3/ABGPXP8ABBma/wAWcKQI/wAgOuH/ALJhSAX/AAcUe/8AD8euBf8BHgeu/wFuWZoF/wAABR//AAAHrgX/AA4Mzf8AEiFI///18KT/ABdmZv//6nMz/wAAAAAI//8s+FL/AERmZhX/AGTuFP8AAAAABf8AEoeu/wAAAAD/ABGrhf8ADyZm/wADT1z/ABJwpAj/ABHZmv8AZPCkBf8AAzXD/wASh67///OmZv8ADuFI///tfXH/AAAAAAj//5sR7P8AAAAABf//7WFI/wAAAAD//+5mZv//8PCk///8tcP//+2R7Aj//+464f//mxHsBf///LCk///tXrj/AAxZmv//8Rwp/wASh67/AAAAAAj//vHKPf8AAAAAFf8AZO4U/wAAAAAF/wASh67/AAAAAP8AEauF/wAPJmb/AANPXP8AEnCkCP8AEdma/wBk8KQF/wADNcP/ABKHrv//86Zm/wAO4Uj//+164f8AAAAACP//mxHs/wAAAAAF///tY9f/AAAAAP//7mZm///w8KT///yzM///7ZHsCP//7j1x//+bEewF///8sKT//+1euP8ADFma///xHCn/ABKHrv8AAAAACA73zP8BEIvl/wKCAAAV//+JFwr/AAAAAAX//+kzM/8AAAAA///q8KT//+5uFP//++4U///pkewI//+a1Hv//dAo9gX///34Uv//9Nwp/wACkez///V4Uv8ABrCk///3+uEI/wAGuFL///fzM/8ACfXD///7lHv/AAthSP8AAAAACP8AdtHs/wAAAAAF/wAWzM3/AAAAAP8AFQzN/wARj1z/AAQUe/8AFmuFCP8AZTCk/wIv1woF/wAELhT/ABchSP//8BcK/wATDM3//+iCj/8AAAAACA762v8ESg76/wK9B64V//zdTM3/AAAAAAX//5mzM/8AAAAA//+eQo///66Zmv//7Zwp//+beFII///CHCn//q/CjwX//+2cKf//mxcK/wBESj3//64PXP8AZquF/wAAAAAI/wMj6Pb/AAAAAAX/AA0Zmv8AAAAA/wAMjM3/AAp9cf8AAlHs/wAMz1wI/wAYnrj/AIj1wwX/AAJPXP8ADOuF///3R67/AApmZv//8uZm/wAAAAAI//6ZVHv/AAAAAAX///uj1/8AAAAA///9Hrj/AAOHrv8AALrh/wAER64I/wAMK4X/AENcKQX/AADAAP8ABEeu/wAELhT/AAOHrv8ABFwp/wAAAAAI/wEWfXH/AAAAAAX/AA0Zmv8AAAAA/wAMh67/AAp9cf8AAlR7/wAM1HsI/wAV64X/AHlCjwX/AAJR7P8ADOj2///3R67/AApmZv//8uZm/wAAAAAI//7pgo//AAAAAAX///uj1/8AAAAA///9Hrj/AAOKPf8AALrh/wAERR8I/wANBR//AEgzMwX/AAC9cf8ABEUf/wAELhT/AAOHrv8ABF64/wAAAAAI/wFmqPb/AAAAAAX/AA0Zmv8AAAAA/wAMjM3/AAqAAP8AAlHs/wAM64UI/wAX4Uj/AIQFHwX/AAJR7P8ADNHs///3Qo//AAqAAP//8uj2/wAAAAAI//1gYUj//fpHrhX//1FUe/8AAAAABf//8uZm/wAAAAD///dFH/8ACmZm/wACVHv/AAzo9gj/ADSuFP8BIiuFBf8AAlR7/wAM0ez/AAyHrv8ACoAA/wANBR//AAAAAAj/AK59cf8AAAAABQ76tf8EGU8s/wKDLhQV//z6wAD/AAAAAAX//6FMzf8AAAAA//+lHCn//7RMzf//7vrh//+i8zMI///ITM3//tFhSAX///emZv//0j1x/wAKXCn//9TmZv8AGx64///feFII/wAbHrj//999cf8AKI9c///uGZr/AC6Hrv8AAAAACP8DBlR7/wAAAAAF/wAO2Zr/AAAAAP8ADbhS/wALbhT/AAKhSP8ADpwpCP8AFij2/wB7Qo8F/wABVHv/AAdrhf///kKP/wAHD1z///uAAP8ABWFICP//+4KP/wAFYUj///lZmv8AAvhS///4dcP/AAAAAAj//qnR7P///8zNBf8ACvXD/wA8q4UF/wAAKPb/AADuFP8AATXD/wABBR//AAD1w/8AAAAACP8BDjCk/wAAAAAF/wAO2Zr/AAAAAP8ADbMz/wALbhT/AAKmZv8ADpmaCP8AE71x/wBtIUgF/wABVHv/AAdrhf///kKP/wAHD1z///uCj/8ABWFICP//+4AA/wAFYUj///lcKf8AAvhS///4czP/AAAAAAj//vH9cf///8zNBf8AC7hS/wBBAo8F/wAAKPb/AADuFP8AATXD/wABBR//AADzM/8AAAAACP8BVlma/wAAAAAF/wAO3rj/AAAAAP8ADbMz/wALeFL/AAKhSP8ADqPXCP8AFYAA/wB20ewF/wACwAD/AA8zM///9Vma/wAM+uH///BKPf8AAAAACP/9iuPX//4uEewV//9IqPb/AAAAAAX///wj1/8AAAAA///8szP/AAFj1////d64/wACjM0I///94Uj/AAKMzf///zMz/wADeuH/AACuFP8AA8o9CP8AL2Zm/wEFI9cF/wABlHv/AAio9v8ACLrh/wAHT1z/AAjCj/8AAAAACP8AtPXD/wAAAAAFDvmw/wF58Vn/AynzMxX/AAgZmv//9cAA/wAMYUj///oAAP8ADQzN/wAAAAAI/wAanrj/AAAAAP8AGRHs/wAAAAD/ACXrhf8AAAAACP8AHxcK/wAAAAD/ABo9cf8ACmPX/wAReuH/ABMwpAj/AHmj1/8AhXCkBf8ABLXD/wAFK4X/AAE4Uv8AB3Mz///9K4X/AAZmZgj///0uFP8ABmZm///5q4X/AAQhSP//+QKP/wAAAAAI///SQo//AAAAAP//vAUf/wAAAAD///Do9v8AAAAACP//8rMz/wAAAAD///M64f//+nMz///3AAD///ZPXAj//851w///ypHsBf//2JcK/wAw5mYF///2B67/AAxj1///8Nwp/wAHYUj///CeuP8AAAAACP//6+uF/wAAAAD//++euP8AAAAA///ynCn/AAAAAAj///9AAP8AAAAA///ymZr/AAAAAP//2kAA/wAAAAAI///7ij3/AAAAAP//+zXD/wAAAAD///rZmv8AAAAACP//+Trh/wAAAAD///nUe////B64///9Cj3///no9gj///0Mzf//+ej2/wAAz1z///jCj/8ABDCk///6sKQI/wHqsKT//v3euBX//i0FH/8AAAAABf//mW4U/wAAAAD//54Ue///rj1x///txR///5szMwj///MXCv//uKPXBf//7co9//+bFwr/AERhSP//rlcK/wBmlHv/AAAAAAj/ATvPXP8AAAAABf8ADRma/wAAAAD/AAi64f//9ZcK///9rhT///MXCgj///oR7P//3uuFBf///auF///zFwr///NzM///9ZcK///y64X/AAAAAAj//kjj1/8AAAAABf//6ij2/wAAAAD//+swpP//7qFI///8GZr//+qKPQj//+zwpP//lnMzBf///Bma///qij3/AA6XCv//7p64/wAV1Hv/AAAAAAj/AcpXCv8AAAAABf8AAAAA////64UF/wAUcKT/AAAAAAX/AGaR7P8AAAAA/wBh64X/AFHCj/8AEjrh/wBkz1wI/wALzM3/AEFmZgX/ABI1w/8AZNHs//+7nCn/AFHAAP//mWuF/wAAAAAI//7EMKT/AAAAAAX///LmZv8AAAAA///3Qo//AApmZv8AAlHs/wAM64UI/wAH/XH/ACwKPQX/AAJR7P8ADOuF/wAMjM3/AApmZv8ADRma/wAAAAAI/wGrMzP/AAAAAAX/ABXXCv8AAAAA/wAUz1z/ABFhSP8AA+j2/wAVdcMI/wASNcP/AGSHrgX/AAPrhf8AFY9c///xZmb/ABFcKf//6iuF/wAAAAAIDvl0/wFqfIP/Au2o9hX/AAdMzf//9seu/wALI9f///qZmv8AC8AA/wAAAAAI/wAX9cP/AAAAAP8AFo9c/wAAAAD/ACIeuP8AAAAACP8AG/rh/wAAAAD/ABeeuP8ACVma/wAPuuH/ABFHrgj/AG14Uv8AeBcKBf8ABD1x/wAEpmb/AAEXCv8ABrXD///9eFL/AAXCjwj///11w/8ABcKP///6TM3/AAO1w///+bMz/wAAAAAI///W1Hv/AAAAAP//wtHs/wAAAAD///Jrhf8AAAAACP//9Aeu/wAAAAD///SCj///+wAA///35mb///dKPQj//9NmZv//z+j2Bf//3Io9/wAsAo8F///3B67/AAsmZv//8l64/wAGo9f///ImZv8AAAAACP//7fCk/wAAAAD///FCj/8AAAAA///z8KT/AAAAAAj///9R7P8AAAAA///z8KT/AAAAAP//3gUf/wAAAAAI///7+uH/AAAAAP//+7Mz/wAAAAD///teuP8AAAAACP//+ej2/wAAAAD///pzM////IUf///9Vwr///qCjwj///1Zmv//+oKP/wAAuFL///mAAP8AA8eu///7OFII/wGtrhT//w8zMxX//lu4Uv8AAAAABf//oQAA/wAAAAD//6T9cf//tAUf///vIUj//6KeuAj///Rj1///v8euBf//98AA///ST1z/AAphSP//1PXD/wAbHCn//9+R7Aj/ABsj1///34Uf/wAokez//+4euP8ALozN/wAAAAAI/wEcOFL/AAAAAAX/AAPcKf8AAAAA/wADT1z///6Zmv8AAiFI///9czMI/wACHrj///1zM/8AAMeu///8go////9Ue////DMzCP//+qj2///iOuEF///+bhT///dZmv//9zhS///4szP///cwpP8AAAAACP/+dNHs/wAAAAAF///pMKT/AAAAAP//6vMz///ua4X///vuFP//6ZR7CP//7twp//+hB64F///7zM3//+jmZv8AEAAA///s64X/ABeAAP8AAAAACP8BruZm////64UF/wBe/XH/AAAAAP8AWwUf/wBL+FL/ABDeuP8AXWFICP8ACp64/wA63rgF/wAIPXH/AC2rhf//9Zwp/wArBR///+Tj1/8AIHMzCP//5Nma/wAgfXH//9duFP8AEeZm///ReFL/AAAAAAj//uPFH/8AAAAABf///CPX/wAAAAD///ywpP8AAWPX///94Uj/AAKMzQj///3euP8AAozN////OFL/AAN64f8AAKuF/wADyj0I/wAHMKT/ACej1wX/AAGMzf8ACKZm/wAIxR//AAdKPf8ACNR7/wAAAAAI/wGAeuH/AAAAAAX/ABbPXP8AAAAA/wAVDM3/ABGUe/8ABBHs/wAWaPYI/wAQZmb/AFp64QX/AAQzM/8AFzrh///v+FL/ABMMzf//6IUf/wAAAAAIDvlh/wL0gIr/ArvR7BX//1iPXP8AAAAABf//8fhS/wAAAAD///HKPf//+L1x///2tcP///QcKQj//1zAAP//LvCkBf//+3Ck///6I9f///ZuFP8AAYAA///9B67/AAcPXAj//6lmZv8AzlwpBf//+yj2/wAL49f///RmZv8AB0KP///yEez/AAAAAAj//1iR7P8AAAAABf//7bMz/wAAAAD///EHrv//7GPX/wAGgo////B64Qj/AKpMzf/+afhSBf8AANR7///48KT/AADAAP//+U9c/wAAvXH///jzMwj//9wKPf//OPrhBf///BcK///qh67/AA6XCv//7qPX/wAV1Hv/AAAAAAj/AIQFH/8AAAAABf8AFdcK/wAAAAD/ABTPXP8AEVwp/wAD6Pb/ABV4Ugj/ACP4Uv8AxwUfBf8AAtwp/wAGZmb/AALMzf8ABjrh/wAC4Uj/AAZrhQj/AT5R7P8Bl7MzBf8ADBma/wAPmZr///gwpP8AE5wp///tnCn/AAAAAAj//xUHrv8AReZmFf8Aa49c/wAAAAAF/wATvXH/AAAAAP8AEtR7/wAQI9f/AAOHrv8AE6ZmCP8AEwUf/wBrkewF/wADbhT/ABO9cf//8tcK/wAP3Cn//+xAAP8AAAAACP//lHCk/wAAAAAF///sK4X/AAAAAP//7T1x///v8zP///x64f//7FmaCP//7RHs//+UczMF///8fXH//+wo9v8ADSuF///wIUj/ABO9cf8AAAAACP/+4Ao9/wAAAAAV/wBrj1z/AAAAAAX/ABO9cf8AAAAA/wAS2Zr/ABAj1/8AA4KP/wATpmYI/wATBR//AGuR7AX/AANuFP8AE71x///y1Hv/AA/cKf//7EKP/wAAAAAI//+UcKT/AAAAAAX//+wo9v8AAAAA///tQAD//+/zM////Hrh///sWZoI///tEez//5RzMwX///x64f//7Cj2/wANKPb///AhSP8AE8KP/wAAAAAIDvlQ/wE82RP/Au2wpBX/AAdKPf//9so9/wALI9f///qXCv8AC8AA/wAAAAAI/wAX9cP/AAAAAP8AFo9c/wAAAAD/ACIhSP8AAAAACP8AG/hS/wAAAAD/ABeeuP8ACVma/wAPuuH/ABFHrgj/AG14Uv8AeBmaBf8ABD1x/wAEo9f/AAEXCv8ABrhS///9eFL/AAXCjwj///11w/8ABcKP///6TM3/AAO1w///+bMz/wAAAAAI///W1Hv/AAAAAP//wtHs/wAAAAD///JwpP8AAAAACP//9Aeu/wAAAAD///SAAP//+wAA///35mb///dKPQj//9No9v//z+j2Bf//3Ieu/wAsAo8F///3B67/AAsmZv//8l64/wAGo9f///Io9v8AAAAACP//7e4U/wAAAAD///FCj/8AAAAA///z8KT/AAAAAAj///9Ue/8AAAAA///z8KT/AAAAAP//3gUf/wAAAAAI///7/XH/AAAAAP//+7Ck/wAAAAD///tcKf8AAAAACP//+ej2/wAAAAD///pwpP///IUf///9WZr///qCjwj///1XCv//+oKP/wAAuuH///l9cf8AA8eu///7OFII/wHUAo///w7KPRX//eC1w/8AAAAABf//6TMz/wAAAAD//+rwpP//7muF///78KT//+mXCgj//++Zmv//pYUfBf//+89c///o5mb/AA/9cf//7PCk/wAXgo//AAAAAAj/ARHMzf8AAF64Bf8AAAo9////3Cn////o9v///z1x///+uuH///8Uewj//rXHrv/++dwpBf//5H1x///sY9f//+0Hrv//4xHs///6bhT//+Ej1wj///DZmv//rGFIBf//+89c///o8zP/AA/zM///7N64/wAXj1z/AAAAAAj/AiQ4Uv8AAAAABf8AFseu/wAAAAD/ABUMzf8AEY9c/wAEFHv/ABZwpAj/ABEPXP8AXqPXBf8ABDXD/wAXHCn///AAAP8AExHs///ogAD/AAAAAAj//u164f///5wpBf////hS/wAAI9f/AAAR7P8AAMeu/wABR67/AADwpAj/AUaKPf8BBjXDBf8AGzMz/wATuFL/ABLFH/8AHM9c/wAFjM3/AB6Hrgj/AA5j1/8AT8KPBf8ABEAA/wAW7hT///AcKf8AEyuF///oaPb/AAAAAAgO+Lj/AfMRUP8BubCkFf/+XbhS/wAAAAAF///ro9f/AAAAAP//7JcK///vczP///x4Uv//671xCP//7GZm//+RD1wF///8jM3//+uo9v8ADXhS///vj1z/ABRcKf8AAAAACP8Boko9/wAAAAAF/wAUWZr/AAAAAP8AE2uF/wAQij3/AAOhSP8AFD1xCP8AE5ma/wBu3CkF/wADbhT/ABRXCv//8nCk/wAQjM3//+uj1/8AAAAACA75o/8C3n9k/wG5sKQV//1ySj3/AAAAAAX//+uj1/8AAAAA///slwr//+9zM////HhS///rvXEI///sZmb//5EPXAX///yMzf//66j2/wANeFL//++PXP8AFFwp/wAAAAAI/wKNszP/AAAAAAX/ABRZmv8AAAAA/wATa4X/ABCKPf8AA6FI/wAUPXEI/wATmZr/AG7cKQX/AANwpP8AFFcK///ybhT/ABCMzf//66j2/wAAAAAIDvd2/wD4DTj/AyHrhRX//8YHrv8AAAAABf//7PMz/wAAAAD//+064f//8uZm///4Sj3//+2Cjwj//7UCj///S49cBf//9VHs///l/XH/AA89cf//50eu/wAaq4X/AAAAAAj/AFs64f8AAAAABf8AFq4U/wAAAAD/ABW9cf8AEmPX/wAD/XH/ABarhQj/ACFwpP8Avko9Bf8AAxR7/wARdcP///Rj1/8ADfMz///utcP/AAAAAAgO92X/APCGf/8DIeuFFf//pMKP/wAAAAAF///pVHv/AAAAAP//6kKP///tnCn///wCj///6VR7CP//3o9c//9BtcMF///87hT//+6Hrv8AC564///yD1z/ABFHrv8AAAAACP8AOfhS/wAAAAAF/wATDM3/AAAAAP8AEsUf/wANGZr/AAe1w/8AEn1xCP8ASv1x/wC0cKQF/wAKq4X/ABoCj///8MKP/wAYuFL//+VUe/8AAAAACA73ef8Ag1BZ/wC4a4UV//+kxR//AAAAAAX//+lUe/8AAAAA///qQo///+2cKf///AAA///pVHsI///ej1z//0G1wwX///zwpP//7oo9/wALnCn///IMzf8AEUeu/wAAAAAI/wA5+uH/AAAAAAX/ABMKPf8AAAAA/wASx67/AA0Zmv8AB7Mz/wASfXEI/wBK/XH/ALRwpAX/AAqrhf8AGgeu///wxR//ABizM///5VHs/wAAAAAIDvhd/wDuDkb/AyHrhRX//8YFH/8AAAAABf//7PXD/wAAAAD//+04Uv//8uZm///4Sj3//+2Cjwj//7UFH///S49cBf//9U9c///l/XH/AA9AAP//50eu/wAaqPb/AAAAAAj/AFs9cf8AAAAABf8AFquF/wAAAAD/ABW9cf8AEmPX/wAD/XH/ABarhQj/ACFzM/8Avko9Bf8AAxHs/wARdcP///RhSP8ADfMz///uuuH/AAAAAAj/APl9cf8AAAAAFf//xgUf/wAAAAAF///s9cP/AAAAAP//7ThS///y5mb///hKPf//7YKPCP//tQUf//9Lj1wF///1T1z//+X9cf8AD0AA///nR67/ABqo9v8AAAAACP8AWz1x/wAAAAAF/wAWq4X/AAAAAP8AFb1x/wASY9f/AAP9cf8AFquFCP8AIXMz/wC+Sj0F/wADEez/ABF1w///9GPX/wAN8zP//+64Uv8AAAAACA74Sv8A6IZ//wMh64UV//+kwo//AAAAAAX//+lUe/8AAAAA///qQo///+2cKf///AKP///pVHsI///ej1z//0G1wwX///zuFP//7oeu/wALnrj///IPXP8AEUeu/wAAAAAI/wA5+FL/AAAAAAX/ABMMzf8AAAAA/wASxR//AA0Zmv8AB7XD/wASfXEI/wBK/XH/ALRwpAX/AAqrhf8AGgKP///wxR//ABi4Uv//5VHs/wAAAAAI/wD5fXH/AAAAABX//6TCj/8AAAAABf//6VR7/wAAAAD//+pCj///7Zwp///8Ao///+lUewj//96PXP//QbXDBf///O4U///uh67/AAueuP//8g9c/wARR67/AAAAAAj/ADn64f8AAAAABf8AEwo9/wAAAAD/ABLFH/8ADRma/wAHtcP/ABJ9cQj/AEr9cf8AtHCkBf8ACquF/wAaAo////DFH/8AGLhS///lUez/AAAAAAgO+HL/AINQWf8AuGuFFf//pMUf/wAAAAAF///pVHv/AAAAAP//6kKP///tnCn///wAAP//6VR7CP//3o9c//9BtcMF///88KT//+6KPf8AC5wp///yDM3/ABFHrv8AAAAACP8AOfrh/wAAAAAF/wATCj3/AAAAAP8AEseu/wANGZr/AAezM/8AEn1xCP8ASv1x/wC0cKQF/wAKqPb/ABoHrv//8MUf/wAYszP//+VUe/8AAAAACP8A+X1x/wAAAAAV//+kxR//AAAAAAX//+lUe/8AAAAA///qQo///+2cKf///AAA///pVHsI///ej1z//0G1wwX///zwpP//7oo9/wALnCn///IMzf8AEUeu/wAAAAAI/wA5+uH/AAAAAAX/ABMKPf8AAAAA/wASx67/AA0Zmv8AB7XD/wASfXEI/wBK+uH/ALRwpAX/AAqo9v8AGgeu///wxR//ABi1w///5VR7/wAAAAAIDvl+/wLSQC//AklhSBX//0BZmv8AAAAABf//+qj2/wAAAAD///vzM/8ABNma/wAA8zP/AAVCjwj/ACBzM/8As4zNBf8AA+FI/wAVXCn///GR7P8AEUzN///qQo//AAAAAAj//3x1w/8AAAAABf//6kUf/wAAAAD//+tHrv//7rMz///8HCn//+qj1wj//98AAP//SWZmBf///0KP///764X///xzM////QUf///72Zr/AAAAAAj//z4hSP8AAAAABf//6ij2/wAAAAD//+swpP//7qFI///8Fwr//+qKPQj//+3hSP//m3XDBf///Bma///qjM3/AA6XCv//7p64/wAV1Hv/AAAAAAj/AMER7P8AAAAABf8ABFma/wAAAAD/AAL4Uv///JR7////LhT///umZgj//9PwpP//DEeuBf8AAAAA/////XH/AAAAAP8AAAAA/wAAAAD////9cQj//9Y4Uv//GNR7Bf///Bma///qij3/AA6R7P//7p64/wAV1wr/AAAAAAj/AIQFH/8AAAAABf8AFdR7/wAAAAD/ABTPXP8AEV64/wAD6Pb/ABV4Ugj/AFXcKf8B2t64Bf8AAL1x/wAER67/AAQrhf8AA4eu/wAEYUj/AAAAAAj/AMEeuP8AAAAABf8AFbMz/wAAAAD/ABTuFP8AEXhS/wAD3rj/ABVcKQj/ABI1w/8AZIo9Bf8AA89c/wAVdcP///GCj/8AEV64///qK4X/AAAAAAgO97v/AO1PSv8B0KZmFf//dXrh/wAAAAAF///mdcP/AAAAAP//59ma///rVwr///t64f//5rCkCP//55wp//91gAAF///7eFL//+Z1w/8AEPMz///rj1z/ABlwpP8AAAAACP8AioKP/wAAAAAF/wAZa4X/AAAAAP8AGEKP/wAUyj3/AASHrv8AGUzNCP8AGIAA/wCKhR8F/wAEZmb/ABlo9v//7wzN/wAUbhT//+aXCv8AAAAACA76nv8Akmtc/wC4a4UV//+RJmb/AAAAAAX//+uPXP8AAAAA///srhT//+91w////F64///rwo8I///sfXH//5EmZgX///xeuP//649c/wANkez//++j1/8AFFwp/wAAAAAI/wBu1wr/AAAAAAX/ABRXCv8AAAAA/wATa4X/ABChSP8AA6FI/wAUQo8I/wATnCn/AG7ZmgX/AAOFH/8AFFma///ybhT/ABBXCv//66j2/wAAAAAI/wGL8zP/AAAAABX//5Eo9v8AAAAABf//649c/wAAAAD//+yuFP//73XD///8Xrj//+vCjwj//+x9cf//kSZmBf///F64///rj1z/AA2R7P//76PX/wAUWZr/AAAAAAj/AG7Zmv8AAAAABf8AFFcK/wAAAAD/ABNrhf8AEKFI/wADoUj/ABRCjwj/ABOcKf8AbtmaBf8AA4eu/wAUWZr///JuFP8AEFcK///ro9f/AAAAAAj/AYv4Uv8AAAAAFf//kSj2/wAAAAAF///rj1z/AAAAAP//7K4U///vdcP///xeuP//68KPCP//7H1x//+RJmYF///8Xrj//+uPXP8ADZHs///vo9f/ABRZmv8AAAAACP8Abtma/wAAAAAF/wAUVwr/AAAAAP8AE2uF/wAQoUj/AAOhSP8AFEKPCP8AE5wp/wBu2ZoF/wADgo//ABRZmv//8nCk/wAQVwr//+umZv8AAAAACA74Rf8BsK+w/wIeAo8V/wAO1Hv/AA+euP//+6Zm/wATmZr//+2Zmv8AAAAACP//WJR7/wAAAAAF///x+FL/AAAAAP//8IKP///4wAD///ScKf//9BwpCP//e89c//9149f//8qR7P//yEKP/wABVHv/AAFeuAj///RAAP//87rh///89cP//+7Hrv8AB2uF///zvXEI/wBFqPb//4zHrv8AAbCk///3z1z/ACQZmv//xEo9CP8ABzCk///0HCn/AAzzM///+MAA/wAOBR//AAAAAAj/AKduFP8AAAAABf8AEmPX/wAAAAD/AAtFH/8AE5ma///2q4X/AA+euAj//5kXCv8Ar6FIBf//+6Zm/wAHMKT/AAHFH/8AChcK/wAG49f/AAcwpAgO+Eb/AZhsQP8BdvhSFf//ulma/wBzOFL///5PXP8ACC4U///b5mb/ADu4Ugj///jMzf8AC+PX///zD1z/AAdAAP//8frh/wAAAAAI//9Ykez/AAAAAAX//+2Zmv8AAAAA///0vXH//+xmZv8ACVR7///wYUgI/wBm6Pb//1BeuAX/AARZmv//+M9c///+OuH///Xo9v//+Rwp///4z1wI//9O3Cn//0brhQX///Erhf//8GPX/wAEWZr//+xj1/8AEmZm/wAAAAAI/wCnbhT/AAAAAAX/AA4Hrv8AAAAA/wAPfXH/AAdAAP8AC2PX/wAL49cI/wCEMKT/AIocKf8ANW4U/wA3vXH///6rhf///qFICP8AC7rh/wAMQo//AAMKPf8AETXD///4lHv/AAxFHwgO+Y3/Audzzf8CvfCkFf/+fR64/wAAAAAF//+ZsKT/AAAAAP//nkKP//+umZr//+2cKf//m3rhCP//9KFI///CMKQF///Mgo//AAAPXAX///bzM/8AAAKP///3oUj///kHrv///l64///3FwoI///3fXH//9GFHwX///5R7P//9tHs/wAGUez///ho9v8ACVR7/////XEI/wAyhR/////wpAX///ZAAP//yw9cBf//yGPX/wAAD1wF///28zP/AAACj///96FI///5B67///5euP//9xcKCP//931x///RhR8F///+Uez///bR7P8ABk9c///4a4X/AAlXCv////rhCP8ANqZm////8KQF///0WZr//8DFHwX//+2cKf//mxcK/wBESj3//64PXP8AZquF/wAAAAAI/wGD0ez/AAAAAAX/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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+//4//f/+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/1//T/2wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/w//H/8QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/9//4AAD/9//qAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAA/+oAAAAAAAAAAAAAAAAAAAAAAAD/1AAAAAAAAP/sAAAAAAAAAAD/6P/xAAAAAAAAAAAAAAAAAAD/+AAA/83/zP/LAAAAAAAAAAAAAAAA//P/8QAA/6EAAP+O/+//9wAAAAAAAAAAAAAAAAAA/6D/8P+P/9T/1wAA//YAAAAAAAD/2AAA/9L/zgAAAAAAAP/u/8r/6P+g//H/1//2AAD/3f/1/80AAAAAAAAAAAAAAAD/2QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/2QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+G/4MAAAAAAAD/2gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//kAAAAAAAD/sgAAAAAAAAAAAAD/1gAAAAAAAAAAAAAAAAAAAAD/+P/0/6cAAAAAAAAAAAAAAAAAAAAAAAD/3QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/6wAAAAD/2gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+gAAAAAAAAAAAAAAAD/4wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/6wAAAAD/3QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+oAAAAAAAAAAAAA/9X/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/7gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/6gAAAAAAAAAAAAAAAP+4AAAAAAAAAAAAAAAAAAAAAAAA//sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/9QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+f/z//UAAAAAAAAAAAAAAAAAAAAAAAAAAP/zAAAAAAAAAAAAAAAAAAAAAP/1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/1QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//MAAAAAAAAAAAAAAAAAAAAAAAD/1gAAAAAAAAAAAAAAAAAAAAD/8gAAAAAAAAAAAAAAAP+G/4IAAAAAAAD/1QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/oQAAAAAAAAAAAAD/0AAAAAAAAAAAAAAAAAAAAAAAAAAA/5cAAAAAAAAAAP/2/+4AAP/2AAAAAP/4AAAAAAAAAAAAAAAAAAAAAP/6AAAAAAAAAAAAAAAAAAAAAAAAAAD/4f/r//oAAAAAAAAAAAAAAAAAAP/1//MAAP/rAAAAAAAAAAAAAAAAAAAAAP/6AAAAAAAA//MAAAAAAAAAAAAAAAAAAAAA/98AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/MAAAAAAAAAAAAAAAAAAAAAP/0/+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+gAAAAAAAAAAAAAAAAAAAAAAAP/2AAAAAAAAAAAAAAAA//EAAAAAAAAAAP/5//EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9D/8wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/6kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/3wAAAAAAAAAAAAAAAP+pAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/9b/6//TAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/7MAAP+hAAAAAAAAAAAAAAAAAAD/7QAA//X/4AAAAAAAAAAA/9IAAP+zAAAAAAAAAAAAAAAA/+0AAAAAAAAAAAAAAAD/1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//UAAAAAAAAAAAAAAAAAAAAAAAD/1wAAAAAAAAAAAAAAAAAAAAD/9AAAAAAAAAAAAAAAAAAAAAAAAAAA/9D/0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/6kAAAAA//UAAAAAAAAAAAAAAAAAAAAAAAD/0wAAAAAAAAAAAAAAAP+pAAD/9QAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/6QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/3gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/2wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/2wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//L/9v/2AAAAAAAAAAAAAAAA//UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//L/9v/2AAAAAAAAAAAAAAAA//QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//H/9f/1AAAAAAAAAAAAAAAA//QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+n/7v/rAAAAAAAAAAAAAP+M/4UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/xgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/68AAAAAAAAAAP+S/5H/9/+nAAD/2gAAAAAAAAAAAAAAAAAAAAAAAP/QAAAAAAAAAAAAAAAAAAAAAAAAAAD/zQAAAAAAAAAA//gAAP+n//T/sgAA/6f/1wAAAAD/1gAAAAAAAAAAAAAAAAAAAAD/8f/t/6MAAP/M/9oAAAAAAAAAAAAAAAD/4wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/3QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4wAAAAD/3QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+kAAAAA//oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/9//7AAAAAAAAAAAAAAAAAAAAAAAAAAD/9//7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//L/+P/4AAAAAAAAAAAAAAAA//sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/1/+0AAP/1AAAAAP/0AAAAAAAAAAAAAAAAAAAAAP/5AAAAAAAAAAAAAAAAAAAAAAAAAAD/4f/k//kAAAAAAAAAAAAAAAD/+//0//MAAP/kAAAAAAAAAAAAAAAAAAAAAP/xAAAAAAAA/+8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/wAAAAAAAAAAAAAAAA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OnsiZ2x5cGhzIjpbMjEsNjVdLCJJRCI6N30sIjUzIjp7ImdseXBocyI6WzI1LDI2XSwiSUQiOjh9LCI2NSI6eyJnbHlwaHMiOlszNywxMTUsMTE2LDExNywxMTgsMTE5LDEyMF0sIklEIjo5fSwiNjciOnsiZ2x5cGhzIjpbMzksMTIyXSwiSUQiOjEwfSwiNjkiOnsiZ2x5cGhzIjpbNDEsMTIzLDEyNCwxMjUsMTI2XSwiSUQiOjExfSwiNzAiOnsiZ2x5cGhzIjpbNDJdLCJJRCI6MTJ9LCI3MSI6eyJnbHlwaHMiOls0M10sIklEIjoxM30sIjcyIjp7ImdseXBocyI6WzQ0LDQ1LDQ5LDUwLDEzMV0sIklEIjoxNH0sIjc0Ijp7ImdseXBocyI6WzQ2LDU3LDEzOSwxNDAsMTQxLDE0Ml0sIklEIjoxNX0sIjc1Ijp7ImdseXBocyI6WzQ3XSwiSUQiOjE2fSwiNzYiOnsiZ2x5cGhzIjpbNDhdLCJJRCI6MTd9LCI3OSI6eyJnbHlwaHMiOls1MSwzOCw0MCw1MywxMzIsMTMzLDEzNCwxMzUsMTM2LDEzOF0sIklEIjoxOH0sIjgwIjp7ImdseXBocyI6WzUyXSwiSUQiOjE5fSwiODIiOnsiZ2x5cGhzIjpbNTRdLCJJRCI6MjB9LCI4MyI6eyJnbHlwaHMiOls1NSwxNzddLCJJRCI6MjF9LCI4NCI6eyJnbHlwaHMiOls1Nl0sIklEIjoyMn0sIjg2Ijp7ImdseXBocyI6WzU4LDU5XSwiSUQiOjIzfSwiODgiOnsiZ2x5cGhzIjpbNjBdLCJJRCI6MjR9LCI4OSI6eyJnbHlwaHMiOls2MSwxNDMsMTc5XSwiSUQiOjI1fSwiOTAiOnsiZ2x5cGhzIjpbNjJdLCJJRCI6MjZ9LCI5NyI6eyJnbHlwaHMiOls2N10sIklEIjoyN30sIjk5Ijp7ImdseXBocyI6WzY5LDE1Ml0sIklEIjoyOH0sIjEwMSI6eyJnbHlwaHMiOls3MSwxNzZdLCJJRCI6Mjl9LCIxMDIiOnsiZ2x5cGhzIjpbNzJdLCJJRCI6MzB9LCIxMDQiOnsiZ2x5cGhzIjpbNzQsODAsNzUsNzksMTc0XSwiSUQiOjMxfSwiMTA2Ijp7ImdseXBocyI6Wzc2LDg3XSwiSUQiOjMyfSwiMTA3Ijp7ImdseXBocyI6Wzc3XSwiSUQiOjMzfSwiMTA4Ijp7ImdseXBocyI6Wzc4XSwiSUQiOjM0fSwiMTExIjp7ImdseXBocyI6WzgxLDY4LDcwLDgzLDE2N10sIklEIjozNX0sIjExMiI6eyJnbHlwaHMiOls4Ml0sIklEIjozNn0sIjExNCI6eyJnbHlwaHMiOls4NF0sIklEIjozN30sIjExNSI6eyJnbHlwaHMiOls4NV0sIklEIjozOH0sIjExNiI6eyJnbHlwaHMiOls4Nl0sIklEIjozOX0sIjExOCI6eyJnbHlwaHMiOls4OCw4OV0sIklEIjo0MH0sIjEyMCI6eyJnbHlwaHMiOls5MF0sIklEIjo0MX0sIjEyMSI6eyJnbHlwaHMiOls5MV0sIklEIjo0Mn0sIjEyMiI6eyJnbHlwaHMiOls5Ml0sIklEIjo0M30sIjE3MSI6eyJnbHlwaHMiOlsxMDQsMTkyXSwiSUQiOjQ0fSwiMTc4Ijp7ImdseXBocyI6WzEwOF0sIklEIjo0NX0sIjE3OSI6eyJnbHlwaHMiOlsxMDldLCJJRCI6NDZ9LCIxODUiOnsiZ2x5cGhzIjpbMTExXSwiSUQiOjQ3fSwiMTg3Ijp7ImdseXBocyI6WzExMywxOTNdLCJJRCI6NDh9LCIxOTgiOnsiZ2x5cGhzIjpbMTIxXSwiSUQiOjQ5fSwiMjA0Ijp7ImdseXBocyI6WzEyN10sIklEIjo1MH0sIjIwNSI6eyJnbHlwaHMiOlsxMjhdLCJJRCI6NTF9LCIyMDYiOnsiZ2x5cGhzIjpbMTI5XSwiSUQiOjUyfSwiMjA3Ijp7ImdseXBocyI6WzEzMF0sIklEIjo1M30sIjIyMyI6eyJnbHlwaHMiOlsxNDRdLCJJRCI6NTR9LCIyMjQiOnsiZ2x5cGhzIjpbMTQ1LDE0NiwxNDcsMTQ4LDE0OSwxNTBdLCJJRCI6NTV9LCIyMzAiOnsiZ2x5cGhzIjpbMTUxXSwiSUQiOjU2fSwiMjMyIjp7ImdseXBocyI6WzE1MywxNTQsMTU1LDE1Nl0sIklEIjo1N30sIjIzNiI6eyJnbHlwaHMiOlsxNTddLCJJRCI6NTh9LCIyMzciOnsiZ2x5cGhzIjpbMTU4LDE1OV0sIklEIjo1OX0sIjIzOSI6eyJnbHlwaHMiOlsxNjBdLCJJRCI6NjB9LCIyNDEiOnsiZ2x5cGhzIjpbMTYxXSwiSUQiOjYxfSwiMjQyIjp7ImdseXBocyI6WzE2MiwxNjMsMTY0LDE2NSwxNjZdLCJJRCI6NjJ9LCIyNDkiOnsiZ2x5cGhzIjpbMTY4XSwiSUQiOjYzfSwiMjUwIjp7ImdseXBocyI6WzE2OV0sIklEIjo2NH0sIjI1MSI6eyJnbHlwaHMiOlsxNzBdLCJJRCI6NjV9LCIyNTIiOnsiZ2x5cGhzIjpbMTcxXSwiSUQiOjY2fSwiMjUzIjp7ImdseXBocyI6WzE3MiwxNzNdLCJJRCI6Njd9LCIzMzgiOnsiZ2x5cGhzIjpbMTc1XSwiSUQiOjY4fSwiMzUzIjp7ImdseXBocyI6WzE3OF0sIklEIjo2OX0sIjM4MiI6eyJnbHlwaHMiOlsxODBdLCJJRCI6NzB9fSwicmlnaHQiOnsiMzQiOnsiZ2x5cGhzIjpbNiwxODYsMTg3XSwiSUQiOjF9LCIzOSI6eyJnbHlwaHMiOlsxMSwxODMsMTg0XSwiSUQiOjJ9LCI0MCI6eyJnbHlwaHMiOlsxMl0sIklEIjozfSwiNDIiOnsiZ2x5cGhzIjpbMTRdLCJJRCI6NH0sIjQ0Ijp7ImdseXBocyI6WzE2LDE4LDE4NSwxODgsMTkxXSwiSUQiOjV9LCI0NSI6eyJnbHlwaHMiOlsxNywxMTAsMTgxLDE4Ml0sIklEIjo2fSwiNDciOnsiZ2x5cGhzIjpbMTldLCJJRCI6N30sIjQ4Ijp7ImdseXBocyI6WzIwLDI2XSwiSUQiOjh9LCI0OSI6eyJnbHlwaHMiOlsyMV0sIklEIjo5fSwiNTEiOnsiZ2x5cGhzIjpbMjNdLCJJRCI6MTB9LCI1MyI6eyJnbHlwaHMiOlsyNV0sIklEIjoxMX0sIjU1Ijp7ImdseXBocyI6WzI3XSwiSUQiOjEyfSwiNTciOnsiZ2x5cGhzIjpbMjldLCJJRCI6MTN9LCI1OCI6eyJnbHlwaHMiOlszMF0sIklEIjoxNH0sIjU5Ijp7ImdseXBocyI6WzMxXSwiSUQiOjE1fSwiNjMiOnsiZ2x5cGhzIjpbMzVdLCJJRCI6MTZ9LCI2NSI6eyJnbHlwaHMiOlszNywxMTUsMTE2LDExNywxMTgsMTE5LDEyMCwxMjFdLCJJRCI6MTd9LCI3MiI6eyJnbHlwaHMiOls0NCwzOCw0MCw0MSw0Miw0NSw0Nyw0OCw0OSw1MCw1Miw1NCwxMjMsMTI0LDEyNSwxMjYsMTI3LDEyOCwxMjksMTMwLDEzMV0sIklEIjoxOH0sIjc0Ijp7ImdseXBocyI6WzQ2XSwiSUQiOjE5fSwiNzkiOnsiZ2x5cGhzIjpbNTEsMzksNDMsNTMsMTIyLDEzMiwxMzMsMTM0LDEzNSwxMzYsMTM4LDE3NV0sIklEIjoyMH0sIjgzIjp7ImdseXBocyI6WzU1LDE3N10sIklEIjoyMX0sIjg0Ijp7ImdseXBocyI6WzU2XSwiSUQiOjIyfSwiODUiOnsiZ2x5cGhzIjpbNTcsMTM5LDE0MCwxNDEsMTQyXSwiSUQiOjIzfSwiODYiOnsiZ2x5cGhzIjpbNTgsNTldLCJJRCI6MjR9LCI4OCI6eyJnbHlwaHMiOls2MF0sIklEIjoyNX0sIjg5Ijp7ImdseXBocyI6WzYxLDE0MywxNzldLCJJRCI6MjZ9LCI5MiI6eyJnbHlwaHMiOls2NF0sIklEIjoyN30sIjkzIjp7ImdseXBocyI6WzY1XSwiSUQiOjI4fSwiOTciOnsiZ2x5cGhzIjpbNjcsMTUxXSwiSUQiOjI5fSwiMTA0Ijp7ImdseXBocyI6Wzc0LDgwLDY4LDcwLDcxLDcyLDc1LDc3LDc4LDc5LDgyLDg0LDE3NF0sIklEIjozMH0sIjEwNiI6eyJnbHlwaHMiOls3Nl0sIklEIjozMX0sIjExMSI6eyJnbHlwaHMiOls4MSw2OSw3Myw4MywxNTIsMTY3LDE3Nl0sIklEIjozMn0sIjExNSI6eyJnbHlwaHMiOls4NV0sIklEIjozM30sIjExNiI6eyJnbHlwaHMiOls4Nl0sIklEIjozNH0sIjExNyI6eyJnbHlwaHMiOls4N10sIklEIjozNX0sIjExOCI6eyJnbHlwaHMiOls4OCw4OV0sIklEIjozNn0sIjEyMCI6eyJnbHlwaHMiOls5MF0sIklEIjozN30sIjEyMSI6eyJnbHlwaHMiOls5MV0sIklEIjozOH0sIjEyMyI6eyJnbHlwaHMiOls5M10sIklEIjozOX0sIjEyNSI6eyJnbHlwaHMiOls5NV0sIklEIjo0MH0sIjE2MSI6eyJnbHlwaHMiOls5N10sIklEIjo0MX0sIjE3MSI6eyJnbHlwaHMiOlsxMDQsMTkyXSwiSUQiOjQyfSwiMTc4Ijp7ImdseXBocyI6WzEwOF0sIklEIjo0M30sIjE3OSI6eyJnbHlwaHMiOlsxMDldLCJJRCI6NDR9LCIxODUiOnsiZ2x5cGhzIjpbMTExXSwiSUQiOjQ1fSwiMTg3Ijp7ImdseXBocyI6WzExMywxOTNdLCJJRCI6NDZ9LCIxOTEiOnsiZ2x5cGhzIjpbMTE0XSwiSUQiOjQ3fSwiMjIzIjp7ImdseXBocyI6WzE0NF0sIklEIjo0OH0sIjIyNCI6eyJnbHlwaHMiOlsxNDUsMTQ2LDE0NywxNDgsMTQ5LDE1MF0sIklEIjo0OX0sIjIzMiI6eyJnbHlwaHMiOlsxNTMsMTU0LDE1NSwxNTYsMTU3LDE1OCwxNTksMTYwLDE2MV0sIklEIjo1MH0sIjI0MiI6eyJnbHlwaHMiOlsxNjIsMTYzLDE2NCwxNjUsMTY2XSwiSUQiOjUxfSwiMjQ5Ijp7ImdseXBocyI6WzE2OCwxNjksMTcwLDE3MV0sIklEIjo1Mn0sIjI1MyI6eyJnbHlwaHMiOlsxNzIsMTczXSwiSUQiOjUzfSwiMzUzIjp7ImdseXBocyI6WzE3OF0sIklEIjo1NH0sIjgyMjQiOnsiZ2x5cGhzIjpbMTg5XSwiSUQiOjU1fSwiODIyNiI6eyJnbHlwaHMiOlsxOTBdLCJJRCI6NTZ9fX0sIm1pc3NpbmdDYXNlU3Vic3RpdHV0aW9uIjowfQAA';
  // Remove piloto anterior
  var oldPiloto = document.querySelector('.rel-piloto');
  if (oldPiloto) {
    extraItems = extraItems.filter(function(x){return x!==oldPiloto;});
    oldPiloto.remove();
  }
  var fontDataUrl = 'data:font/otf;base64,' + fontB64;
  var tryRender = function(fontFamily) {
    var cvs = document.createElement('canvas');
    var c2d = cvs.getContext('2d');
    var fSize = (S.tipo === 'mini') ? 17 : 13; // Mini: fonte do piloto +30%
    cvs.height = fSize + 16;
    c2d.font = 'bold ' + fSize + 'px "' + fontFamily + '", Arial, sans-serif';
    c2d.letterSpacing = '3px';
    var tw = c2d.measureText(nome).width;
    cvs.width = Math.max(60, Math.ceil(tw) + 20);
    c2d.font = 'bold ' + fSize + 'px "' + fontFamily + '", Arial, sans-serif';
    c2d.clearRect(0, 0, cvs.width, cvs.height);
    c2d.fillStyle = (typeof pilotColor !== 'undefined' ? pilotColor : null) || '#fff';
    c2d.textBaseline = 'top';
    c2d.fillText(nome, 10, 8);
    var imgUrl = cvs.toDataURL('image/png');
    var _pPos = (S.legoModel && (typeof MODEL_RELEVO_IMAGES !== 'undefined') && MODEL_RELEVO_IMAGES[S.legoModel] && MODEL_RELEVO_IMAGES[S.legoModel].piloto_pos) || 'bottom-left';
    // Remove elemento anterior do piloto (relExtras e legoRelExtras)
    ['relExtras','legoRelExtras'].forEach(function(id){
      var _w=document.getElementById(id);
      if(_w)_w.querySelectorAll('.rel-piloto').forEach(function(el){el.remove();});
    });
    var elP = addRelevo(imgUrl, nome, Math.round(cvs.width * 0.55), Math.round(cvs.height * 0.55), _pPos);
    if (elP) {
      elP.classList.add('rel-piloto');
      // Marcar clone em legoRelExtras também (addRelevo sempre appenda ao final)
      var _lr=document.getElementById('legoRelExtras');
      if(_lr&&_lr.lastElementChild)_lr.lastElementChild.classList.add('rel-piloto');
    }
    // Mini: sobe o nome do piloto 9px (ancorado por baixo, entao aumentamos o bottom)
    if(S.tipo==='mini'&&elP){ elP.style.bottom='calc(5% + 9px)'; }
  };
  try {
    var face = new FontFace('DesignerRegular', 'url(' + fontDataUrl + ')');
    face.load().then(function(f){ document.fonts.add(f); tryRender('DesignerRegular'); })
               .catch(function(){ tryRender('Arial'); });
  } catch(e) { tryRender('Arial'); }
}
var _mobStep=0;
function mobNext(){
  var secs=document.querySelectorAll('.cfg-sec');
  var cur=-1;
  secs.forEach(function(s,i){if(s.classList.contains('active'))cur=i;});
  if(cur<0)cur=_mobStep;
  var nxt=cur+1;
  if(nxt===2&&typeof S!=='undefined'&&S.tipo==='mini')nxt=3;
  if(nxt>=secs.length)return;
  goStep(nxt);
  _mobStep=nxt;
  _mobUpdateNav();
}
function mobBack(){
  var secs=document.querySelectorAll('.cfg-sec');
  var cur=-1;
  secs.forEach(function(s,i){if(s.classList.contains('active'))cur=i;});
  if(cur<0)cur=_mobStep;
  var prv=cur-1;
  if(prv===2&&typeof S!=='undefined'&&S.tipo==='mini')prv=1;
  if(prv<0)return;
  goStep(prv);
  _mobStep=prv;
  _mobUpdateNav();
}
function _mobUpdateNav(){
  var isLego=(typeof S!=='undefined'&&S.tipo==='lego');
  var labels=['Modelo','Dimensão','Detalhamento','Fundo','Moldura + LED','Alto-relevo','Ver Resumo',''];
  if(!isLego)labels[1]='Miniatura';
  var btn=document.getElementById('mobBtnNext');
  var bck=document.getElementById('mobBtnBack');
  var secs=document.querySelectorAll('.cfg-sec').length;
  if(btn){
    if(_mobStep>=secs-1){btn.style.display='none';}
    else{btn.style.display='';btn.textContent=(labels[_mobStep]||'Próximo')+' →';}
  }
  if(bck){bck.style.display=_mobStep>0?'':'none';}
}
