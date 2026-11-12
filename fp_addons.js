/* Funparts Ã¢ÂÂ mÃÂ³dulos add-on (carregados apÃÂ³s app_1.js/app_2.js) */
/* Reset da personalizaÃÂ§ÃÂ£o (fallback inline, garante disponibilidade mesmo com cache do app_1.js).
   Recarrega a pÃÂ¡gina: zera o estado S (em memÃÂ³ria) e volta ÃÂ  etapa TIPO;
   o carrinho fica salvo no localStorage e ÃÂ© preservado. */
if(typeof window.iniciarNovaPersonalizacao!=='function'){
  window.iniciarNovaPersonalizacao=function(){
    try{ location.reload(); }catch(e){ location.href=location.pathname+location.search; }
  };
}

/* "Continuar comprando" (botÃÂ£o que aparece depois de adicionar o item ao carrinho) deve
   REINICIAR a personalizaÃÂ§ÃÂ£o por completo Ã¢ÂÂ exatamente como "Iniciar nova personalizaÃÂ§ÃÂ£o" Ã¢ÂÂ,
   e nÃÂ£o apenas voltar ÃÂ  etapa 1 mantendo as configuraÃÂ§ÃÂµes do item anterior gravadas no estado S.
   O carrinho ÃÂ© preservado (fica salvo no localStorage e ÃÂ© relido ao recarregar). */
(function(){
  window.continuarComprando=function(){
    if(typeof window.iniciarNovaPersonalizacao==='function'){ window.iniciarNovaPersonalizacao(); return; }
    try{ location.reload(); }catch(e){ location.href=location.pathname+location.search; }
  };
})();

/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ EDITAR PRODUTO NO CARRINHO (recarrega a personalizacao salva e atualiza o item) ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
   Implementado aqui inline para nao depender de novo deploy do app_1.js.
   Cada item guarda cfg com a configuracao completa; restauramos e voltamos ao resumo. */
(function(){
  window._editandoId = window._editandoId || null;

  // Carrinho: adiciona "editar produto" nos itens LEGO personalizados
  /* ===== O CARRINHO AGRUPA O QUE E' IGUAL =============================
     Quem desenha o carrinho e' ESTE arquivo, nao o app_1.js: a linha abaixo
     substitui a de la. As ferramentas (_cartGrupos, _cartMaisUm, ...) vivem
     no app_1.js e sao usadas daqui.
     Se elas nao existirem -- app_1.js revertido, por exemplo -- a tela volta
     sozinha ao desenho antigo, uma linha por item, em vez de quebrar. */
  window._cartRender = function(){
    var n=CART.length;
    var c=document.getElementById('cartCount');
    if(c){ c.textContent=n; c.classList.toggle('on',n>0); }
    var body=document.getElementById('cartBody');
    var foot=document.getElementById('cartFoot');
    if(!body)return;
    var _T=function(k,fb){return (window.FP&&FP.t)?FP.t(k):fb;};
    if(!n){
      body.innerHTML='<div class="cart-empty">'+_T('cart.empty','Seu carrinho estÃÂ¡ vazio.')+'<br>'+_T('cart.emptyHint','Monte um quadro e adicione aqui.')+'</div>';
      if(foot)foot.style.display='none';
      return;
    }
    var _agrupa=(typeof _cartGrupos==='function');
    if(_agrupa && typeof _cartQtdCss==='function')_cartQtdCss();
    var _lista=_agrupa?_cartGrupos():CART.map(function(x){return {item:x,itens:[x]};});
    var _teto=(typeof _CART_MAX==='number')?_CART_MAX:20;
    body.innerHTML=_lista.map(function(g,gi){
      var i=g.item, q=g.itens.length;
      var img=i.thumb ? '<img src="'+i.thumb+'" alt="">' : '<div class="ph">'+(i.tipo==='lego'?'ÃÂ°ÃÂÃÂ§ÃÂ±':'ÃÂ°ÃÂÃÂÃÂÃÂ¯ÃÂ¸ÃÂ')+'</div>';
      /* "editar produto" so com UMA unidade: editar uma de tres partiria a
         linha em duas sem o cliente ter pedido */
      var editavel=(q===1 && i.cfg && i.via!=='catalogo' && (i.tipo==='lego' || (i.tipo==='mini' && i.cfg.miniScale!==undefined)));
      var edBtn=editavel ? '<button class="cart-ed" onclick="editarProduto(\''+i.id+'\')">'+_T('cart.edit','editar produto')+'</button>' : '';
      var rmBtn='<button class="cart-rm" onclick="'+(_agrupa?('_cartRemoverGrupo('+gi+')'):('removerDoCarrinho(\''+i.id+'\')'))+'">'+_T('cart.remove','remover')+'</button>';
      var ctrl=_agrupa
        ? '<div class="cart-qtd">'
            +'<button type="button" aria-label="tirar uma unidade"'+(q<=1?' disabled':'')
              +' onclick="_cartMenosUm('+gi+')">\u2212</button>'
            +'<b>'+q+'</b>'
            +'<button type="button" aria-label="somar uma unidade"'+(q>=_teto?' disabled':'')
              +' onclick="_cartMaisUm('+gi+')">+</button>'
          +'</div>'
        : '';
      /* o "cada" so aparece com mais de uma unidade: com uma seria repetir o
         mesmo numero duas vezes */
      var unit=(q>1)?('<div class="cart-un">'+_brlCart(i.preco)+' cada</div>'):'';
      return '<div class="cart-item">'
        +'<div class="cart-thumb">'+img+'</div>'
        +'<div class="cart-info">'
          +'<div class="cart-nm">'+_esc(i.titulo)+'</div>'
          +'<div class="cart-dt">'+_esc(i.sub)+'<br>'+i.linhas.map(_esc).join(' \u00b7 ')+'</div>'
          +'<div class="cart-foot-row">'
            +ctrl
            +'<div style="text-align:right">'
              +'<div class="cart-price">'+_brlCart((Number(i.preco)||0)*q)+'</div>'
              +unit
            +'</div>'
          +'</div>'
          +'<div class="cart-foot-row" style="margin-top:6px;justify-content:flex-end">'
            +'<div class="cart-acts">'+edBtn+rmBtn+'</div>'
          +'</div>'
        +'</div>'
      +'</div>';
    }).join('');
    if(foot)foot.style.display='';
    var t=document.getElementById('cartTotal');
    if(t)t.textContent=_brlCart(_cartTotal());
    _freteSegueOCarrinho(n);
  };

  /* ===== O FRETE TEM DE SEGUIR O CARRINHO ==============================
     O painel de frete so calculava quando o cliente clicava em "Calcular".
     Mudou o carrinho depois disso -- e agora mudar e' um clique no "+" --
     e o valor na tela continuava o do carrinho antigo. Cobrar o frete de
     uma unidade e mandar duas e' prejuizo silencioso.
     Entao: mudou a quantidade de itens, com o CEP ja preenchido e o painel
     aberto, recalcula sozinho. O cliente escolhe a entrega de novo, que e'
     o certo: o preco mudou. */
  var _qtdNoUltimoDesenho=null;
  function _freteSegueOCarrinho(n){
    try{
      if(_qtdNoUltimoDesenho===null){ _qtdNoUltimoDesenho=n; return; }
      if(_qtdNoUltimoDesenho===n) return;
      _qtdNoUltimoDesenho=n;
      var cep=document.getElementById('fpCep');
      var btn=document.getElementById('fpCalcBtn');
      var opts=document.getElementById('fpFreteOpts');
      if(!cep||!btn||!opts) return;
      var v=String(cep.value||'').replace(/[^0-9A-Za-z]/g,'');
      var min=((window.FP&&FP.region)==='BR')?8:4;
      if(v.length<min) return;
      /* so se ja havia uma cotacao na tela: nao calcular frete para quem
         ainda nem chegou nessa etapa */
      if(!opts.innerHTML) return;
      clearTimeout(window._freteSegueT);
      window._freteSegueT=setTimeout(function(){ try{ btn.click(); }catch(e){} },150);
    }catch(e){}
  }

  // Resumo: em modo edicao o botao vira "Atualizar pedido"
  var _origBotoes = window._botoesResumo;
  window._botoesResumo = function(adicionado){
    if(window._editandoId){
      var add=document.getElementById('btnAddCart');
      var cont=document.getElementById('btnContinuar');
      if(add){ add.classList.add('finalizar'); add.textContent='Atualizar pedido Ã¢ÂÂ'; add.onclick=window.atualizarPedido; }
      if(cont)cont.style.display='none';
      return;
    }
    if(typeof _origBotoes==='function') _origBotoes(adicionado);
  };

  // Restauracao compartilhada (moldura, fundo, LED, relevos)
  function _restauraComuns(cfg){
    var mc=document.querySelector('#step-5 .ocard[onclick*="'+cfg.moldura+'"]');
    if(mc && typeof selMoldura==='function')selMoldura(mc,cfg.moldura,cfg.molduraLbl||'');
    if(cfg.uvColor!==undefined)S.uvColor=cfg.uvColor;
    if(cfg.uvLayoutType!==undefined)S.uvLayoutType=cfg.uvLayoutType;
    if(cfg.uvStripeMain!==undefined)S.uvStripeMain=cfg.uvStripeMain;
    if(cfg.uvStripeAccent!==undefined)S.uvStripeAccent=cfg.uvStripeAccent;
    var fc=document.querySelector('.ocard[onclick*="'+cfg.fundo+'"]');
    if(fc && typeof selFundo==='function')selFundo(fc,cfg.fundo,cfg.fundoLbl||'');
    if(cfg.led && !S.led && typeof togLED==='function')togLED();
    else if(!cfg.led && S.led && typeof togLED==='function')togLED();
    if(cfg.led){
      S.ledTipo=cfg.ledTipo||'warm'; S.ledFio=cfg.ledFio||'com';
      var lc=document.getElementById(S.ledTipo==='rgb'?'ledCardRgb':'ledCardWarm');
      if(lc && typeof setLED==='function')setLED(lc,S.ledTipo);
      if(typeof selLedFio==='function')selLedFio(S.ledFio);
    }
    var rrows=[].slice.call(document.querySelectorAll('.rrow'));
    rrows.forEach(function(r){ if(r.classList.contains('sel'))r.click(); });
    (cfg.relOpts||[]).forEach(function(lbl){
      var t=rrows.filter(function(r){ return (r.getAttribute('onclick')||'').indexOf("'"+lbl+"'")>-1; })[0];
      if(t && !t.classList.contains('sel'))t.click();
    });
  }

  function _editarLego(item,cfg){
    window._editandoId=item.id;
    if(typeof fecharCarrinho==='function')fecharCarrinho();
    selectTipo('lego');
    if(typeof renderLegoModels==='function')renderLegoModels(cfg.legoBrand);
    S.legoBrand=cfg.legoBrand;
    [].forEach.call(document.querySelectorAll('#legoBrands .bcard'),function(b){ b.classList.toggle('sel',(b.textContent||'').trim()===cfg.legoBrand); });
    var rows=document.querySelectorAll('#legoModels .mrow'), alvo=null;
    [].forEach.call(rows,function(r){ var s=r.querySelector('span'); if(s && s.textContent.trim()===cfg.legoModel) alvo=r; });
    if(alvo)alvo.click();
    _restauraComuns(cfg);
    if(typeof calcPrice==='function')calcPrice();
    if(typeof goStep==='function')goStep(7);
    setTimeout(function(){ if(typeof _botoesResumo==='function')_botoesResumo(false); },40);
  }

  function _editarMini(item,cfg){
    window._editandoId=item.id;
    if(typeof fecharCarrinho==='function')fecharCarrinho();
    selectTipo('mini');
    /* item da IA: volta direto para o formulario da IA (nao para a tela dos dois caminhos) */
    if(typeof selMiniChoice==='function')selMiniChoice((!cfg.miniChoice||cfg.miniChoice==='apenas')?'ia':cfg.miniChoice);
    var setV=function(idv,v){ var e=document.getElementById(idv); if(e && v!=null && v!==''){ e.value=v; try{e.dispatchEvent(new Event('input'));e.dispatchEvent(new Event('change'));}catch(_){} } };
    setV('apenaCarBrand',cfg.aiBrand); setV('apenaCarModel',cfg.aiModel); setV('apenaCarColor',cfg.aiColor); setV('apenaCarYear',cfg.aiYear);
    setV('apenaCarBrandSelect',cfg.aiBrand); setV('apenaCarModelInput',cfg.aiModel);
    setV('aiCarBrand',cfg.aiBrand); setV('aiCarModel',cfg.aiModel); setV('aiCarColor',cfg.aiColor); setV('aiCarYear',cfg.aiYear);
    S.miniBrand=cfg.miniBrand||cfg.aiBrand||''; S.miniModel=cfg.miniModel||cfg.aiModel||'';
    if(cfg.miniSize!==undefined)S.miniSize=cfg.miniSize;
    if(cfg.miniDim!==undefined)S.miniDim=cfg.miniDim;
    S.miniScale=cfg.miniScale; S.quadroDim=cfg.quadroDim;
    if(cfg.miniOpt!==undefined)S.miniOpt=cfg.miniOpt;
    if(cfg.disp!==undefined)S.disp=cfg.disp;
    S.aiCarColor=cfg.aiColor||'';
    var carUrl = (item.imgKey ? _fotoUrl(item.imgKey) : (cfg.carImg||''));
    if(carUrl && typeof _detTopViewUrl!=='undefined'){ _detTopViewUrl=carUrl; if(typeof _detTopViewKey!=='undefined')_detTopViewKey='edit:'+item.id; }
    _restauraComuns(cfg);
    if(typeof renderFrameCards==='function')renderFrameCards();
    if(typeof calcPrice==='function')calcPrice();
    if(typeof goStep==='function')goStep(7);
    setTimeout(function(){
      if(carUrl){ var d=document.getElementById('detPvCar'); if(d){ d.src=carUrl; d.style.display='block'; } }
      if(typeof updateDetPreview==='function')updateDetPreview();
      if(typeof applyDetCarOverlay==='function')applyDetCarOverlay();
      if(typeof _botoesResumo==='function')_botoesResumo(false);
    },70);
  }

  // Dispatcher: recarrega item salvo (LEGO ou Miniatura / Somente Quadro) e vai ao resumo
  window.editarProduto = function(id){
    var item=null,k; for(k=0;k<CART.length;k++){ if(CART[k].id===id){ item=CART[k]; break; } }
    if(!item||!item.cfg){ return; }
    var cfg=item.cfg;
    if(cfg.tipo==='lego'){ _editarLego(item,cfg); return; }
    if(cfg.tipo==='mini' && cfg.miniScale!==undefined){ _editarMini(item,cfg); return; }
    alert('Este item foi adicionado antes desta atualizaÃÂ§ÃÂ£o e nÃÂ£o guardou os dados necessÃÂ¡rios para ediÃÂ§ÃÂ£o. Remova e monte novamente para poder editÃÂ¡-lo.');
  };

  // Enriquece o cfg dos itens Miniatura (escala, dimensÃÂ£o, carro, cores) p/ permitir edicao
  var _origMonta = window._cartMontaItem;
  if(typeof _origMonta==='function'){
    window._cartMontaItem = function(){
      var it=_origMonta();
      if(it && it.cfg && it.tipo==='mini'){
        var g=function(a,b){ var e=document.getElementById(a)||document.getElementById(b); return e?(e.value||''):''; };
        it.cfg.miniChoice = S.miniChoice||'apenas';
        it.cfg.miniScale  = S.miniScale||'';
        it.cfg.quadroDim  = S.quadroDim||'';
        it.cfg.aiBrand = g('aiCarBrand','apenaCarBrand')||S.miniBrand||'';
        it.cfg.aiModel = g('aiCarModel','apenaCarModel')||S.miniModel||'';
        it.cfg.aiColor = g('aiCarColor','apenaCarColor')||S.aiCarColor||'';
        it.cfg.aiYear  = g('aiCarYear','apenaCarYear')||'';
        var cimg=(typeof _detTopViewUrl!=='undefined')?(_detTopViewUrl||''):'';
        it.cfg.carImg = (cimg && cimg.indexOf('data:')!==0)?cimg:'';
      }
      return it;
    };
  }

  // Substitui o item editado no carrinho (mesmo id, sem duplicar)
  window.atualizarPedido = function(){
    if(!window._editandoId)return;
    var idx=-1,k; for(k=0;k<CART.length;k++){ if(CART[k].id===window._editandoId){ idx=k; break; } }
    if(idx<0){ window._editandoId=null; return; }
    var novo=_cartMontaItem();
    var src=novo.imgSrc; delete novo.imgSrc;
    var _imgFundo=novo._imgFundo||null; delete novo._imgFundo;
    novo.thumb=CART[idx].thumb||'';
    var _lista=(novo.preview&&novo.preview.imgs)||[]; if(novo.preview)delete novo.preview.imgs;
    novo.id=window._editandoId;
    CART[idx]=novo;
    _cartSave(); _cartRender();
    if(typeof _cartThumb==='function')_cartThumb(src,function(thumb){ if(!thumb)return; var a=CART.filter(function(x){return x.id===novo.id;})[0]; if(a){a.thumb=thumb;_cartSave();_cartRender();} });
    if(_imgFundo && typeof _subirImagemItem==='function'){
      _subirImagemItem(_imgFundo,function(ch){ if(!ch)return; var a=CART.filter(function(x){return x.id===novo.id;})[0]; if(a){ a.imgKey=ch; if(a.cfg&&a.cfg.redoma_sm)a.cfg.redoma_sm.img=ch; _cartSave(); } });
    }
    if(novo.via!=='catalogo' && src && src.indexOf('data:')===0 && typeof _subirImagemItem==='function'){
      _subirImagemItem(src,function(ch){ if(!ch)return; var a=CART.filter(function(x){return x.id===novo.id;})[0]; if(a){a.imgKey=ch;_cartSave();} });
    }
    if(_lista.length && typeof _subirImagemItem==='function'){
      novo.imgKeys=new Array(_lista.length);
      _lista.forEach(function(d,i2){ _subirImagemItem(d,function(ch){ var a=CART.filter(function(x){return x.id===novo.id;})[0]; if(!a||!ch)return; if(!a.imgKeys)a.imgKeys=new Array(_lista.length); a.imgKeys[i2]=ch; _cartSave(); }); });
    }
    window._editandoId=null;
    if(typeof _botoesResumo==='function')_botoesResumo(true);
    if(typeof abrirCarrinho==='function')abrirCarrinho();
  };

  // Mobile: marca o quadro LEGO 49x49 p/ o CSS deixÃÂ¡-lo quadrado e contido (igual desktop)
  var _origUpd = window.updateDetPreview;
  if(typeof _origUpd==='function'){
    window.updateDetPreview = function(){
      var r = _origUpd.apply(this, arguments);
      try{
        var q=document.getElementById('legoDetQuadro');
        if(q){
          var is4949 = (typeof S!=='undefined' && S.tipo==='lego') && /^49\s*[ÃÂx]\s*49/.test((S.legoDim)||'');
          q.classList.toggle('dim4949', !!is4949);
        }
      }catch(e){}
      return r;
    };
  }

  // Mobile: manter a barra inferior (avanÃÂ§ar/voltar) sincronizada com a etapa REAL.
  // Bug: "continuar comprando" e cliques no menu do topo trocam de etapa via goStep,
  // mas a barra mobile sÃÂ³ era atualizada pelos botÃÂµes avanÃÂ§ar/voltar -> sumia o "avanÃÂ§ar".
  var _origMobUpd = window._mobUpdateNav;
  if(typeof _origMobUpd==='function'){
    window._mobUpdateNav = function(){
      try{
        var secs=document.querySelectorAll('.cfg-sec'); var cur=-1;
        secs.forEach(function(s,i){ if(s.classList.contains('active'))cur=i; });
        if(cur>=0) window._mobStep=cur;
      }catch(e){}
      return _origMobUpd.apply(this, arguments);
    };
  }
  var _origGoStepNav = window.goStep;
  if(typeof _origGoStepNav==='function'){
    window.goStep = function(){
      var r=_origGoStepNav.apply(this, arguments);
      try{ if(typeof _mobUpdateNav==='function') _mobUpdateNav(); }catch(e){}
      return r;
    };
  }

  // re-render inicial: aplica o botao "editar" em itens ja no carrinho
  if(typeof _cartRender==='function'){ try{ _cartRender(); }catch(e){} }
})();

(function(){
  var CFG={
    BR:{lang:'pt',currency:'BRL',symbol:'R$',frete:'superfrete',gateway:'pagarme',flag:'ÃÂ°ÃÂÃÂÃÂ§ÃÂ°ÃÂÃÂÃÂ·',reg:{pt:'Brasil',en:'Brazil'},prices:{lego_base_carbono:689,lego_base_fosco:589,mini_base_P:1990,mini_base_M:2490,mini_base_G:2990,opt_moldura_fibra:75,opt_led_rgb_sem:489,opt_led_rgb_com:589,opt_led_warm_sem:389,opt_led_warm_com:489,opt_relevo_bandeira:90,opt_relevo_piloto:90}},
    EU:{lang:'en',currency:'EUR',symbol:'\u20ac',frete:'sendcloud',gateway:'stripe',flag:'ÃÂ°ÃÂÃÂÃÂªÃÂ°ÃÂÃÂÃÂº',reg:{pt:'Europa',en:'Europe'},prices:{lego_base_carbono:119,lego_base_fosco:102,mini_base_P:343,mini_base_M:429,mini_base_G:515,opt_moldura_fibra:13,opt_led_rgb_sem:84,opt_led_rgb_com:102,opt_led_warm_sem:67,opt_led_warm_com:84,opt_relevo_bandeira:16,opt_relevo_piloto:16}},
    US:{lang:'en',currency:'USD',symbol:'$',frete:'sendcloud',gateway:'stripe',flag:'ÃÂ°ÃÂÃÂÃÂºÃÂ°ÃÂÃÂÃÂ¸',reg:{pt:'EUA',en:'USA'},prices:{lego_base_carbono:130,lego_base_fosco:111,mini_base_P:375,mini_base_M:470,mini_base_G:564,opt_moldura_fibra:14,opt_led_rgb_sem:92,opt_led_rgb_com:111,opt_led_warm_sem:73,opt_led_warm_com:92,opt_relevo_bandeira:17,opt_relevo_piloto:17}}
  };
  var EUcc=['PT','ES','FR','DE','IT','BE','NL','LU','IE','AT','FI','GR','CY','MT','EE','LV','LT','SK','SI','HR','PL','CZ','HU','RO','BG','DK','SE','GB','CH','NO','IS'];
  function regiaoDe(cc){cc=(cc||'').toUpperCase();if(cc==='BR')return'BR';if(cc==='US')return'US';if(EUcc.indexOf(cc)>-1)return'EU';return'BR';}

  // Bandeiras em SVG (renderizam iguais em qualquer sistema, inclusive Windows)
  function euStars(){var a=[[14,3.8],[17.1,4.63],[19.37,6.9],[20.2,10],[19.37,13.1],[17.1,15.37],[14,16.2],[10.9,15.37],[8.63,13.1],[7.8,10],[8.63,6.9],[10.9,4.63]];return a.map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r=".85"/>';}).join('');}
  function flagSVG(code){
    var a='width="18" height="13" viewBox="0 0 28 20" style="border-radius:2px;display:block;flex-shrink:0"';
    if(code==='BR')return '<svg '+a+'><rect width="28" height="20" fill="#009c3b"/><path d="M14 2.5 25.5 10 14 17.5 2.5 10Z" fill="#ffdf00"/><circle cx="14" cy="10" r="4" fill="#002776"/></svg>';
    if(code==='GB')return '<svg '+a+'><rect width="28" height="20" fill="#012169"/><path d="M0 0L28 20M28 0L0 20" stroke="#fff" stroke-width="4"/><path d="M0 0L28 20M28 0L0 20" stroke="#c8102e" stroke-width="2"/><path d="M14 0V20M0 10H28" stroke="#fff" stroke-width="6"/><path d="M14 0V20M0 10H28" stroke="#c8102e" stroke-width="3.4"/></svg>';
    if(code==='US')return '<svg '+a+'><rect width="28" height="20" fill="#fff"/><g fill="#b22234"><rect width="28" height="2"/><rect y="4" width="28" height="2"/><rect y="8" width="28" height="2"/><rect y="12" width="28" height="2"/><rect y="16" width="28" height="2"/></g><rect width="12" height="10" fill="#3c3b6e"/><g fill="#fff"><circle cx="2.4" cy="2.2" r=".75"/><circle cx="6" cy="2.2" r=".75"/><circle cx="9.6" cy="2.2" r=".75"/><circle cx="4.2" cy="5" r=".75"/><circle cx="7.8" cy="5" r=".75"/><circle cx="2.4" cy="7.8" r=".75"/><circle cx="6" cy="7.8" r=".75"/><circle cx="9.6" cy="7.8" r=".75"/></g></svg>';
    if(code==='EU')return '<svg '+a+'><rect width="28" height="20" fill="#003399"/><g fill="#ffcc00">'+euStars()+'</g></svg>';
    if(code==='ES')return '<svg '+a+'><rect width="28" height="20" fill="#c60b1e"/><rect y="5" width="28" height="10" fill="#ffc400"/></svg>';
    if(code==='FR')return '<svg '+a+'><rect width="28" height="20" fill="#fff"/><rect width="9.34" height="20" fill="#0055a4"/><rect x="18.66" width="9.34" height="20" fill="#ef4135"/></svg>';
    return '';
  }

  var DICT={
    pt:{
      'nav.newCustom':'Iniciar nova personalizaÃÂ§ÃÂ£o','nav.cart':'Carrinho',
      'step.tipo':'Tipo','step.modelo':'Modelo','step.produto':'Produto','step.detalhe':'Detalhamento','step.fundo':'Fundo','step.moldura':'Moldura + LED','step.relevo':'Alto-relevo','step.pedido':'Pedido',
      'cart.title':'Seu carrinho','cart.total':'Total','cart.note':'Sem frete ÃÂ· Combinamos o envio pelo WhatsApp','cart.checkout':'Fechar pedido Ã¢ÂÂ','cart.more':'Continuar comprando',
      'cart.remove':'remover','cart.edit':'editar produto','cart.empty':'Seu carrinho estÃÂ¡ vazio.','cart.emptyHint':'Monte um quadro e adicione aqui.',
      'frete.title':'Frete / Entrega','frete.cep':'Digite seu CEP','frete.calc':'Calcular','frete.calculating':'CalculandoÃ¢ÂÂ¦','frete.eco':'EconÃÂ´mico','frete.exp':'Expresso','frete.days':'dias ÃÂºteis','frete.invalid':'Informe um CEP vÃÂ¡lido','frete.totalShip':'Total com frete','frete.mock':'','frete.none':'Nenhuma opÃÂ§ÃÂ£o de frete para este endereÃÂ§o.','frete.fail':'NÃÂ£o foi possÃÂ­vel calcular o frete agora. Tente novamente.','frete.emptyCart':'Adicione um item ao carrinho para calcular o frete.'
    },
    en:{
      'nav.newCustom':'Start new customization','nav.cart':'Cart',
      'step.tipo':'Type','step.modelo':'Model','step.produto':'Product','step.detalhe':'Details','step.fundo':'Background','step.moldura':'Frame + LED','step.relevo':'Relief','step.pedido':'Order',
      'cart.title':'Your cart','cart.total':'Total','cart.note':'Shipping calculated at checkout','cart.checkout':'Checkout Ã¢ÂÂ','cart.more':'Continue shopping',
      'cart.remove':'remove','cart.edit':'edit product','cart.empty':'Your cart is empty.','cart.emptyHint':'Build a frame and add it here.',
      'frete.title':'Shipping / Delivery','frete.cep':'Enter your postal code','frete.calc':'Calculate','frete.calculating':'CalculatingÃ¢ÂÂ¦','frete.eco':'Standard','frete.exp':'Express','frete.days':'business days','frete.invalid':'Enter a valid postal code','frete.totalShip':'Total with shipping','frete.mock':'','frete.none':'No shipping options for this address.','frete.fail':'Could not calculate shipping right now. Please try again.','frete.emptyCart':'Add an item to the cart to calculate shipping.'
    },
    es:{
      'nav.newCustom':'Iniciar nueva personalizaciÃÂ³n','nav.cart':'Carrito',
      'step.tipo':'Tipo','step.modelo':'Modelo','step.produto':'Producto','step.detalhe':'Detalles','step.fundo':'Fondo','step.moldura':'Marco + LED','step.relevo':'Relieve','step.pedido':'Pedido',
      'cart.title':'Tu carrito','cart.total':'Total','cart.note':'EnvÃÂ­o calculado al finalizar la compra','cart.checkout':'Finalizar pedido Ã¢ÂÂ','cart.more':'Seguir comprando',
      'cart.remove':'quitar','cart.edit':'editar producto','cart.empty':'Tu carrito estÃÂ¡ vacÃÂ­o.','cart.emptyHint':'Crea un cuadro y agrÃÂ©galo aquÃÂ­.',
      'frete.title':'EnvÃÂ­o / Entrega','frete.cep':'Ingresa tu cÃÂ³digo postal','frete.calc':'Calcular','frete.calculating':'CalculandoÃ¢ÂÂ¦','frete.eco':'EstÃÂ¡ndar','frete.exp':'ExprÃÂ©s','frete.days':'dÃÂ­as hÃÂ¡biles','frete.invalid':'Ingresa un cÃÂ³digo postal vÃÂ¡lido','frete.totalShip':'Total con envÃÂ­o','frete.mock':'','frete.none':'No hay opciones de envÃÂ­o para esta direcciÃÂ³n.','frete.fail':'No se pudo calcular el envÃÂ­o ahora. IntÃÂ©ntalo de nuevo.','frete.emptyCart':'Agrega un artÃÂ­culo al carrito para calcular el envÃÂ­o.'
    },
    fr:{
      'nav.newCustom':'Nouvelle personnalisation','nav.cart':'Panier',
      'step.tipo':'Type','step.modelo':'ModÃÂ¨le','step.produto':'Produit','step.detalhe':'DÃÂ©tails','step.fundo':'Fond','step.moldura':'Cadre + LED','step.relevo':'Relief','step.pedido':'Commande',
      'cart.title':'Votre panier','cart.total':'Total','cart.note':'Livraison calculÃÂ©e au paiement','cart.checkout':'Finaliser la commande Ã¢ÂÂ','cart.more':'Continuer les achats',
      'cart.remove':'retirer','cart.edit':'modifier le produit','cart.empty':'Votre panier est vide.','cart.emptyHint':'CrÃÂ©ez un cadre et ajoutez-le ici.',
      'frete.title':'Livraison','frete.cep':'Saisissez votre code postal','frete.calc':'Calculer','frete.calculating':'CalculÃ¢ÂÂ¦','frete.eco':'Standard','frete.exp':'Express','frete.days':'jours ouvrÃÂ©s','frete.invalid':'Saisissez un code postal valide','frete.totalShip':'Total avec livraison','frete.mock':'','frete.none':'Aucune option de livraison pour cette adresse.','frete.fail':'Impossible de calculer la livraison pour le moment. RÃÂ©essayez.','frete.emptyCart':'Ajoutez un article au panier pour calculer la livraison.'
    }
  };

  var FP={lang:'pt',region:'BR',cfg:CFG,geoCountry:null};
  FP.t=function(k){var d=DICT[FP.lang]||DICT.pt;return (d[k]!=null)?d[k]:((DICT.pt[k]!=null)?DICT.pt[k]:k);};
  function save(){try{localStorage.setItem('fp_lang',FP.lang);localStorage.setItem('fp_region',FP.region);}catch(e){}}

  // ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ TRADUÃÂÃÂO COMPLETA DO SITE (PT/EN/ES/FR) ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
  var FULL={}; window.__fpFULL=FULL;
  function T(pt,en,es,fr){FULL[pt]={en:en,es:es,fr:fr};}
  // CabeÃÂ§alho / navegaÃÂ§ÃÂ£o / carrinho / checkout
  T("Total:","Total:","Total:","Total :");
  T("Iniciar nova personaliza\u00e7\u00e3o","Start new customization","Iniciar nueva personalizaci\u00f3n","Nouvelle personnalisation");
  T("Iniciar nova personaliza\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00a3o","Start new customization","Iniciar nueva personalizaci\u00f3n","Nouvelle personnalisation");
  T("Seu carrinho","Your cart","Tu carrito","Votre panier");
  T("Sem frete \u00b7 Combinamos o envio pelo WhatsApp","Shipping arranged via WhatsApp","Env\u00edo coordinado por WhatsApp","Livraison convenue via WhatsApp");
  T("Sem frete \u00c3\u0082\u00c2\u00b7 Combinamos o envio pelo WhatsApp","Shipping arranged via WhatsApp","Env\u00edo coordinado por WhatsApp","Livraison convenue via WhatsApp");
  T("Fechar pedido \u2192","Checkout \u2192","Finalizar pedido \u2192","Finaliser la commande \u2192");
  T("Fechar pedido \u00c3\u00a2\u00c2\u0086\u00c2\u0092","Checkout \u2192","Finalizar pedido \u2192","Finaliser la commande \u2192");
  T("Continuar comprando","Continue shopping","Seguir comprando","Continuer les achats");
  T("Precisamos desses dados para emitir a nota e combinar a entrega.","We need this information to issue the invoice and arrange delivery.","Necesitamos estos datos para emitir la factura y coordinar la entrega.","Nous avons besoin de ces informations pour \u00e9mettre la facture et organiser la livraison.");
  T("Nome completo","Full name","Nombre completo","Nom complet");
  T("WhatsApp","WhatsApp","WhatsApp","WhatsApp");
  T("E-mail","Email","Correo electr\u00f3nico","E-mail");
  T("Endere\u00e7o","Address","Direcci\u00f3n","Adresse");
  T("Endere\u00c3\u0083\u00c2\u00a7o","Address","Direcci\u00f3n","Adresse");
  T("N\u00famero","Number","N\u00famero","Num\u00e9ro");
  T("N\u00c3\u0083\u00c2\u00bamero","Number","N\u00famero","Num\u00e9ro");
  T("Complemento","Address line 2","Complemento","Compl\u00e9ment");
  T("(opcional)","(optional)","(opcional)","(facultatif)");
  T("Bairro","District","Barrio","Quartier");
  T("Cidade","City","Ciudad","Ville");
  T("Seus dados s\u00e3o usados apenas para emitir a nota fiscal e realizar a entrega.","Your data is used only to issue the invoice and complete delivery.","Tus datos se usan solo para emitir la factura y realizar la entrega.","Vos donn\u00e9es servent uniquement \u00e0 \u00e9mettre la facture et \u00e0 effectuer la livraison.");
  T("Seus dados s\u00c3\u0083\u00c2\u00a3o usados apenas para emitir a nota fiscal e realizar a entrega.","Your data is used only to issue the invoice and complete delivery.","Tus datos se usan solo para emitir la factura y realizar la entrega.","Vos donn\u00e9es servent uniquement \u00e0 \u00e9mettre la facture et \u00e0 effectuer la livraison.");
  T("Fechar pedido via WhatsApp","Checkout via WhatsApp","Finalizar pedido por WhatsApp","Finaliser via WhatsApp");
  T("\u2190 Voltar aos itens","\u2190 Back to items","\u2190 Volver a los art\u00edculos","\u2190 Retour aux articles");
  T("\u00c3\u00a2\u00c2\u0086\u00c2\u0090 Voltar aos itens","\u2190 Back to items","\u2190 Volver a los art\u00edculos","\u2190 Retour aux articles");
  T("Item adicionado ao carrinho","Item added to cart","Art\u00edculo a\u00f1adido al carrito","Article ajout\u00e9 au panier");
  T("Ver carrinho","View cart","Ver carrito","Voir le panier");
  // Home / etapa Tipo
  T("CHEGOU A HORA","IT'S TIME","LLEG\u00d3 EL MOMENTO","C'EST LE MOMENT");
  T("DE PERSONALIZAR","TO CUSTOMIZE","DE PERSONALIZAR","DE PERSONNALISER");
  T("SEU QUADRO","YOUR FRAME","TU CUADRO","VOTRE CADRE");
  T("SIGA AS ORIENTA\u00c7\u00d5ES","FOLLOW THE STEPS","SIGUE LAS INSTRUCCIONES","SUIVEZ LES INDICATIONS");
  T("SIGA AS ORIENTA\u00c3\u0083\u00c2\u0087\u00c3\u0083\u00c2\u0095ES","FOLLOW THE STEPS","SIGUE LAS INSTRUCCIONES","SUIVEZ LES INDICATIONS");
  T("DO MENU ABAIXO","IN THE MENU BELOW","DEL MEN\u00da DE ABAJO","DU MENU CI-DESSOUS");
  T("Preview em tempo real","Real-time preview","Vista previa en tiempo real","Aper\u00e7u en temps r\u00e9el");
  T("Gerando top-view\u2026","Generating top view\u2026","Generando vista superior\u2026","G\u00e9n\u00e9ration de la vue de dessus\u2026");
  T("Gerando top-view\u00c3\u00a2\u00c2\u0080\u00c2\u00a6","Generating top view\u2026","Generando vista superior\u2026","G\u00e9n\u00e9ration de la vue de dessus\u2026");
  T("\u27f2 Girar carro 180\u00b0","\u27f2 Rotate car 180\u00b0","\u27f2 Girar coche 180\u00b0","\u27f2 Pivoter la voiture 180\u00b0");
  T("\u00c3\u00a2\u00c2\u009f\u00c2\u00b2 Girar carro 180\u00c3\u0082\u00c2\u00b0","\u27f2 Rotate car 180\u00b0","\u27f2 Girar coche 180\u00b0","\u27f2 Pivoter la voiture 180\u00b0");
  T("PREVIEW EM TEMPO REAL","REAL-TIME PREVIEW","VISTA PREVIA EN TIEMPO REAL","APER\u00c7U EN TEMPS R\u00c9EL");
  T("VEJA O EXEMPLO DA PROPOR\u00c7\u00c3O (DIMENS\u00c3O) DO QUADRO","SEE AN EXAMPLE OF THE FRAME PROPORTION (SIZE)","MIRA UN EJEMPLO DE LA PROPORCI\u00d3N (TAMA\u00d1O) DEL CUADRO","VOYEZ UN EXEMPLE DE LA PROPORTION (TAILLE) DU CADRE");
  T("VEJA O EXEMPLO DA PROPOR\u00c3\u0083\u00c2\u0087\u00c3\u0083\u00c2\u0083O (DIMENS\u00c3\u0083\u00c2\u0083O) DO QUADRO","SEE AN EXAMPLE OF THE FRAME PROPORTION (SIZE)","MIRA UN EJEMPLO DE LA PROPORCI\u00d3N (TAMA\u00d1O) DEL CUADRO","VOYEZ UN EXEMPLE DE LA PROPORTION (TAILLE) DU CADRE");
  T("A partir do exemplo acima, voc\u00ea conseguir\u00e1 ter a no\u00e7\u00e3o geral da dimens\u00e3o do quadro comparado a dimens\u00e3o de uma pessoa com 1,75m de altura","From the example above, you can get a general sense of the frame size compared to a person 1.75 m tall","Con el ejemplo de arriba podr\u00e1s hacerte una idea del tama\u00f1o del cuadro comparado con una persona de 1,75 m de altura","\u00c0 partir de l'exemple ci-dessus, vous aurez une id\u00e9e g\u00e9n\u00e9rale de la taille du cadre par rapport \u00e0 une personne d'1,75 m");
  T("A partir do exemplo acima, voc\u00c3\u0083\u00c2\u00aa conseguir\u00c3\u0083\u00c2\u00a1 ter a no\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00a3o geral da dimens\u00c3\u0083\u00c2\u00a3o do quadro comparado a dimens\u00c3\u0083\u00c2\u00a3o de uma pessoa com 1,75m de altura","From the example above, you can get a general sense of the frame size compared to a person 1.75 m tall","Con el ejemplo de arriba podr\u00e1s hacerte una idea del tama\u00f1o del cuadro comparado con una persona de 1,75 m de altura","\u00c0 partir de l'exemple ci-dessus, vous aurez une id\u00e9e g\u00e9n\u00e9rale de la taille du cadre par rapport \u00e0 une personne d'1,75 m");
  T("Fan\u00e1tico, voc\u00ea est\u00e1 prestes a criar","Fan, you're about to create","Fan\u00e1tico, est\u00e1s a punto de crear","Passionn\u00e9, vous \u00eates sur le point de cr\u00e9er");
  T("Fan\u00c3\u0083\u00c2\u00a1tico, voc\u00c3\u0083\u00c2\u00aa est\u00c3\u0083\u00c2\u00a1 prestes a criar","Fan, you're about to create","Fan\u00e1tico, est\u00e1s a punto de crear","Passionn\u00e9, vous \u00eates sur le point de cr\u00e9er");
  T("um quadro exclusivo!","an exclusive frame!","\u00a1un cuadro exclusivo!","un cadre exclusif !");
  T("Aguarde, estamos gerando a imagem da sua miniatura em alta resolu\u00e7\u00e3o.","Please wait, we're generating your model image in high resolution.","Espera, estamos generando la imagen de tu miniatura en alta resoluci\u00f3n.","Veuillez patienter, nous g\u00e9n\u00e9rons l'image de votre miniature en haute r\u00e9solution.");
  T("Aguarde, estamos gerando a imagem da sua miniatura em alta resolu\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00a3o.","Please wait, we're generating your model image in high resolution.","Espera, estamos generando la imagen de tu miniatura en alta resoluci\u00f3n.","Veuillez patienter, nous g\u00e9n\u00e9rons l'image de votre miniature en haute r\u00e9solution.");
  T("Preparando\u2026","Preparing\u2026","Preparando\u2026","Pr\u00e9paration\u2026");
  T("Preparando\u00c3\u00a2\u00c2\u0080\u00c2\u00a6","Preparing\u2026","Preparando\u2026","Pr\u00e9paration\u2026");
  T("Qual \u00e9 o seu colecion\u00e1vel? Tudo come\u00e7a aqui.","What's your collectible? It all starts here.","\u00bfCu\u00e1l es tu coleccionable? Todo empieza aqu\u00ed.","Quel est votre objet de collection ? Tout commence ici.");
  T("Qual \u00c3\u0083\u00c2\u00a9 o seu colecion\u00c3\u0083\u00c2\u00a1vel? Tudo come\u00c3\u0083\u00c2\u00a7a aqui.","What's your collectible? It all starts here.","\u00bfCu\u00e1l es tu coleccionable? Todo empieza aqu\u00ed.","Quel est votre objet de collection ? Tout commence ici.");
  T("QUADROS PARA LEGO","FRAMES FOR LEGO","CUADROS PARA LEGO","CADRES POUR LEGO");
  T("Quadros para sets LEGO Technic, Creator, Icons e F1","Frames for LEGO Technic, Creator, Icons and F1 sets","Cuadros para sets LEGO Technic, Creator, Icons y F1","Cadres pour sets LEGO Technic, Creator, Icons et F1");
  T("Quadros para Miniaturas","Frames for Models","Cuadros para Miniaturas","Cadres pour Miniatures");
  T("Die-cast em escalas 1:12, 1:18, 1:24 e 1:43","Die-cast in 1:12, 1:18, 1:24 and 1:43 scales","Die-cast en escalas 1:12, 1:18, 1:24 y 1:43","Die-cast aux \u00e9chelles 1:12, 1:18, 1:24 et 1:43");
  T("Pr\u00f3ximo: Escolher Modelo \u2192","Next: Choose Model \u2192","Siguiente: Elegir modelo \u2192","Suivant : Choisir le mod\u00e8le \u2192");
  T("Pr\u00c3\u0083\u00c2\u00b3ximo: Escolher Modelo \u00c3\u00a2\u00c2\u0086\u00c2\u0092","Next: Choose Model \u2192","Siguiente: Elegir modelo \u2192","Suivant : Choisir le mod\u00e8le \u2192");
  // etapa Modelo
  T("Modelo LEGO","LEGO Model","Modelo LEGO","Mod\u00e8le LEGO");
  T("Selecione a marca e depois o modelo espec\u00edfico","Select the brand and then the specific model","Selecciona la marca y luego el modelo espec\u00edfico","S\u00e9lectionnez la marque puis le mod\u00e8le pr\u00e9cis");
  T("Selecione a marca e depois o modelo espec\u00c3\u0083\u00c2\u00adfico","Select the brand and then the specific model","Selecciona la marca y luego el modelo espec\u00edfico","S\u00e9lectionnez la marque puis le mod\u00e8le pr\u00e9cis");
  T("Com ou Sem Miniatura?","With or Without Model?","\u00bfCon o sin miniatura?","Avec ou sans miniature ?");
  T("SOMENTE QUADRO","FRAME ONLY","SOLO CUADRO","CADRE SEUL");
  T("Nessa op\u00e7\u00e3o voc\u00ea ter\u00e1 a oportunidade de personalizar um quadro para a sua miniatura especial","In this option you can customize a frame for your special model","En esta opci\u00f3n podr\u00e1s personalizar un cuadro para tu miniatura especial","Dans cette option, vous pourrez personnaliser un cadre pour votre miniature");
  T("Nessa op\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00a3o voc\u00c3\u0083\u00c2\u00aa ter\u00c3\u0083\u00c2\u00a1 a oportunidade de personalizar um quadro para a sua miniatura especial","In this option you can customize a frame for your special model","En esta opci\u00f3n podr\u00e1s personalizar un cuadro para tu miniatura especial","Dans cette option, vous pourrez personnaliser un cadre pour votre miniature");
  T("QUADRO INCLUSO MINIATURA","FRAME WITH MODEL INCLUDED","CUADRO CON MINIATURA INCLUIDA","CADRE AVEC MINIATURE INCLUSE");
  T("Nessa op\u00e7\u00e3o voc\u00ea encontrar\u00e1 quadros que j\u00e1 s\u00e3o vendidos completos. Contendo o quadro e a miniatura","In this option you'll find frames sold complete, including the frame and the model","En esta opci\u00f3n encontrar\u00e1s cuadros que se venden completos: el cuadro y la miniatura","Dans cette option, vous trouverez des cadres vendus complets, avec le cadre et la miniature");
  T("Nessa op\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00a3o voc\u00c3\u0083\u00c2\u00aa encontrar\u00c3\u0083\u00c2\u00a1 quadros que j\u00c3\u0083\u00c2\u00a1 s\u00c3\u0083\u00c2\u00a3o vendidos completos. Contendo o quadro e a miniatura","In this option you'll find frames sold complete, including the frame and the model","En esta opci\u00f3n encontrar\u00e1s cuadros que se venden completos: el cuadro y la miniatura","Dans cette option, vous trouverez des cadres vendus complets, avec le cadre et la miniature");
  T("\u2190 Voltar","\u2190 Back","\u2190 Volver","\u2190 Retour");
  T("\u00c3\u00a2\u00c2\u0086\u00c2\u0090 Voltar","\u2190 Back","\u2190 Volver","\u2190 Retour");
  T("Modelos dispon\u00edveis","Available models","Modelos disponibles","Mod\u00e8les disponibles");
  T("Modelos dispon\u00c3\u0083\u00c2\u00adveis","Available models","Modelos disponibles","Mod\u00e8les disponibles");
  T("Foto em breve","Photo coming soon","Foto pr\u00f3ximamente","Photo bient\u00f4t");
  T("\u2713 CONCLUIR ESCOLHA","\u2713 CONFIRM CHOICE","\u2713 CONFIRMAR ELECCI\u00d3N","\u2713 VALIDER LE CHOIX");
  T("\u00c3\u00a2\u00c2\u009c\u00c2\u0093 CONCLUIR ESCOLHA","\u2713 CONFIRM CHOICE","\u2713 CONFIRMAR ELECCI\u00d3N","\u2713 VALIDER LE CHOIX");
  T("Escolha a marca","Choose the brand","Elige la marca","Choisissez la marque");
  T("Marca / Categoria","Brand / Category","Marca / Categor\u00eda","Marque / Cat\u00e9gorie");
  T("Outros","Others","Otros","Autres");
  T("\u2726 Visualiza\u00e7\u00e3o gerada por Intelig\u00eancia Artificial","\u2726 Preview generated by Artificial Intelligence","\u2726 Vista previa generada por Inteligencia Artificial","\u2726 Aper\u00e7u g\u00e9n\u00e9r\u00e9 par Intelligence Artificielle");
  T("\u00c3\u00a2\u00c2\u009c\u00c2\u00a6 Visualiza\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00a3o gerada por Intelig\u00c3\u0083\u00c2\u00aancia Artificial","\u2726 Preview generated by Artificial Intelligence","\u2726 Vista previa generada por Inteligencia Artificial","\u2726 Aper\u00e7u g\u00e9n\u00e9r\u00e9 par Intelligence Artificielle");
  T("Marca do carro","Car brand","Marca del coche","Marque de la voiture");
  T("Modelo do carro","Car model","Modelo del coche","Mod\u00e8le de la voiture");
  T("Ano","Year","A\u00f1o","Ann\u00e9e");
  T("Cor","Color","Color","Couleur");
  T("Selecionada:","Selected:","Seleccionada:","S\u00e9lectionn\u00e9e :");
  T("\u2726 GERAR VISUALIZA\u00c7\u00c3O COM IA","\u2726 GENERATE AI PREVIEW","\u2726 GENERAR VISTA PREVIA CON IA","\u2726 G\u00c9N\u00c9RER L'APER\u00c7U PAR IA");
  T("\u00c3\u00a2\u00c2\u009c\u00c2\u00a6 GERAR VISUALIZA\u00c3\u0083\u00c2\u0087\u00c3\u0083\u00c2\u0083O COM IA","\u2726 GENERATE AI PREVIEW","\u2726 GENERAR VISTA PREVIA CON IA","\u2726 G\u00c9N\u00c9RER L'APER\u00c7U PAR IA");
  T("Gerando sua visualiza\u00e7\u00e3o...","Generating your preview...","Generando tu vista previa...","G\u00e9n\u00e9ration de votre aper\u00e7u...");
  T("Gerando sua visualiza\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00a3o...","Generating your preview...","Generando tu vista previa...","G\u00e9n\u00e9ration de votre aper\u00e7u...");
  T("A IA est\u00e1 criando uma imagem exclusiva do seu carro","AI is creating an exclusive image of your car","La IA est\u00e1 creando una imagen exclusiva de tu coche","L'IA cr\u00e9e une image exclusive de votre voiture");
  T("A IA est\u00c3\u0083\u00c2\u00a1 criando uma imagem exclusiva do seu carro","AI is creating an exclusive image of your car","La IA est\u00e1 creando una imagen exclusiva de tu coche","L'IA cr\u00e9e une image exclusive de votre voiture");
  T("\u2726 Sua miniatura \u2014 visualiza\u00e7\u00e3o gerada","\u2726 Your model \u2014 generated preview","\u2726 Tu miniatura \u2014 vista previa generada","\u2726 Votre miniature \u2014 aper\u00e7u g\u00e9n\u00e9r\u00e9");
  T("\u00c3\u00a2\u00c2\u009c\u00c2\u00a6 Sua miniatura \u00c3\u00a2\u00c2\u0080\u00c2\u0094 visualiza\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00a3o gerada","\u2726 Your model \u2014 generated preview","\u2726 Tu miniatura \u2014 vista previa generada","\u2726 Votre miniature \u2014 aper\u00e7u g\u00e9n\u00e9r\u00e9");
  T("\u21bb GERAR NOVA VARIA\u00c7\u00c3O","\u21bb GENERATE NEW VARIATION","\u21bb GENERAR NUEVA VARIACI\u00d3N","\u21bb G\u00c9N\u00c9RER UNE NOUVELLE VARIANTE");
  T("\u00c3\u00a2\u00c2\u0086\u00c2\u00bb GERAR NOVA VARIA\u00c3\u0083\u00c2\u0087\u00c3\u0083\u00c2\u0083O","\u21bb GENERATE NEW VARIATION","\u21bb GENERAR NUEVA VARIACI\u00d3N","\u21bb G\u00c9N\u00c9RER UNE NOUVELLE VARIANTE");
  T("Geramos a imagem da sua miniatura com intelig\u00eancia Artificial, para que confirme o modelo e consiga personalizar seu quadro o mais pr\u00f3ximo da realidade poss\u00edvel.","We generated your model image with Artificial Intelligence so you can confirm the model and customize your frame as close to reality as possible.","Generamos la imagen de tu miniatura con Inteligencia Artificial para que confirmes el modelo y personalices tu cuadro lo m\u00e1s fiel posible.","Nous avons g\u00e9n\u00e9r\u00e9 l'image de votre miniature par Intelligence Artificielle afin que vous confirmiez le mod\u00e8le et personnalisiez votre cadre au plus pr\u00e8s de la r\u00e9alit\u00e9.");
  T("Geramos a imagem da sua miniatura com intelig\u00c3\u0083\u00c2\u00aancia Artificial, para que confirme o modelo e consiga personalizar seu quadro o mais pr\u00c3\u0083\u00c2\u00b3ximo da realidade poss\u00c3\u0083\u00c2\u00advel.","We generated your model image with Artificial Intelligence so you can confirm the model and customize your frame as close to reality as possible.","Generamos la imagen de tu miniatura con Inteligencia Artificial para que confirmes el modelo y personalices tu cuadro lo m\u00e1s fiel posible.","Nous avons g\u00e9n\u00e9r\u00e9 l'image de votre miniature par Intelligence Artificielle afin que vous confirmiez le mod\u00e8le et personnalisiez votre cadre au plus pr\u00e8s de la r\u00e9alit\u00e9.");
  T("PERSONALIZAR QUADRO \u2192","CUSTOMIZE FRAME \u2192","PERSONALIZAR CUADRO \u2192","PERSONNALISER LE CADRE \u2192");
  T("PERSONALIZAR QUADRO \u00c3\u00a2\u00c2\u0086\u00c2\u0092","CUSTOMIZE FRAME \u2192","PERSONALIZAR CUADRO \u2192","PERSONNALISER LE CADRE \u2192");
  T("Marca do ve\u00edculo","Vehicle brand","Marca del veh\u00edculo","Marque du v\u00e9hicule");
  T("Marca do ve\u00c3\u0083\u00c2\u00adculo","Vehicle brand","Marca del veh\u00edculo","Marque du v\u00e9hicule");
  T("Outra","Other","Otra","Autre");
  T("Modelo exato","Exact model","Modelo exacto","Mod\u00e8le exact");
  T("Tamanho do quadro (sincronizado com a escala)","Frame size (synced with scale)","Tama\u00f1o del cuadro (sincronizado con la escala)","Taille du cadre (synchronis\u00e9e avec l'\u00e9chelle)");
  T("Pr\u00f3ximo: Miniatura \u2192","Next: Model \u2192","Siguiente: Miniatura \u2192","Suivant : Miniature \u2192");
  T("Pr\u00c3\u0083\u00c2\u00b3ximo: Miniatura \u00c3\u00a2\u00c2\u0086\u00c2\u0092","Next: Model \u2192","Siguiente: Miniatura \u2192","Suivant : Miniature \u2192");
  // etapa Produto / miniatura
  T("Confirme que j\u00e1 possui a miniatura para montagem no quadro.","Confirm you already own the model to mount in the frame.","Confirma que ya tienes la miniatura para montarla en el cuadro.","Confirmez que vous poss\u00e9dez d\u00e9j\u00e0 la miniature \u00e0 monter dans le cadre.");
  T("Confirme que j\u00c3\u0083\u00c2\u00a1 possui a miniatura para montagem no quadro.","Confirm you already own the model to mount in the frame.","Confirma que ya tienes la miniatura para montarla en el cuadro.","Confirmez que vous poss\u00e9dez d\u00e9j\u00e0 la miniature \u00e0 monter dans le cadre.");
  T("FOTOS EM BREVE","PHOTOS COMING SOON","FOTOS PR\u00d3XIMAMENTE","PHOTOS BIENT\u00d4T");
  T("Descri\u00e7\u00e3o do produto","Product description","Descripci\u00f3n del producto","Description du produit");
  T("Descri\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00a3o do produto","Product description","Descripci\u00f3n del producto","Description du produit");
  T("Descri\u00e7\u00e3o em breve...","Description coming soon...","Descripci\u00f3n pr\u00f3ximamente...","Description bient\u00f4t...");
  T("Descri\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00a3o em breve...","Description coming soon...","Descripci\u00f3n pr\u00f3ximamente...","Description bient\u00f4t...");
  T("Ver resumo \u2192","View summary \u2192","Ver resumen \u2192","Voir le r\u00e9sum\u00e9 \u2192");
  T("Ver resumo \u00c3\u00a2\u00c2\u0086\u00c2\u0092","View summary \u2192","Ver resumen \u2192","Voir le r\u00e9sum\u00e9 \u2192");
  T("EU J\u00c1 TENHO A MINIATURA","I ALREADY HAVE THE MODEL","YA TENGO LA MINIATURA","J'AI D\u00c9J\u00c0 LA MINIATURE");
  T("EU J\u00c3\u0083\u00c2\u0081 TENHO A MINIATURA","I ALREADY HAVE THE MODEL","YA TENGO LA MINIATURA","J'AI D\u00c9J\u00c0 LA MINIATURE");
  T("Confirmo que j\u00e1 tenho a miniatura e gostaria de comprar apenas o quadro.","I confirm I already have the model and would like to buy only the frame.","Confirmo que ya tengo la miniatura y deseo comprar solo el cuadro.","Je confirme avoir d\u00e9j\u00e0 la miniature et souhaite acheter uniquement le cadre.");
  T("Confirmo que j\u00c3\u0083\u00c2\u00a1 tenho a miniatura e gostaria de comprar apenas o quadro.","I confirm I already have the model and would like to buy only the frame.","Confirmo que ya tengo la miniatura y deseo comprar solo el cuadro.","Je confirme avoir d\u00e9j\u00e0 la miniature et souhaite acheter uniquement le cadre.");
  T("Pr\u00f3ximo: Detalhamento \u2192","Next: Details \u2192","Siguiente: Detalles \u2192","Suivant : D\u00e9tails \u2192");
  T("Pr\u00c3\u0083\u00c2\u00b3ximo: Detalhamento \u00c3\u00a2\u00c2\u0086\u00c2\u0092","Next: Details \u2192","Siguiente: Detalles \u2192","Suivant : D\u00e9tails \u2192");
  T("Miniatura compacta","Compact model","Miniatura compacta","Miniature compacte");
  T("Tamanho m\u00e9dio","Medium size","Tama\u00f1o mediano","Taille moyenne");
  T("Tamanho m\u00c3\u0083\u00c2\u00a9dio","Medium size","Tama\u00f1o mediano","Taille moyenne");
  T("Tamanho grande","Large size","Tama\u00f1o grande","Grande taille");
  T("Extra grande","Extra large","Extra grande","Tr\u00e8s grande");
  T("Pr\u00f3ximo: Fundo \u2192","Next: Background \u2192","Siguiente: Fondo \u2192","Suivant : Fond \u2192");
  T("Pr\u00c3\u0083\u00c2\u00b3ximo: Fundo \u00c3\u00a2\u00c2\u0086\u00c2\u0092","Next: Background \u2192","Siguiente: Fondo \u2192","Suivant : Fond \u2192");
  // etapa Fundo
  T("Fundo do Quadro","Frame Background","Fondo del cuadro","Fond du cadre");
  T("Material que reveste o interior do quadro, ao redor da miniatura","Material lining the inside of the frame, around the model","Material que reviste el interior del cuadro, alrededor de la miniatura","Mat\u00e9riau qui habille l'int\u00e9rieur du cadre, autour de la miniature");
  T("Fibra de Carbono","Carbon Fiber","Fibra de carbono","Fibre de carbone");
  T("Revestimento em vinil texturizado. Visual esportivo profundo.","Textured vinyl finish. Deep sporty look.","Revestimiento de vinilo texturizado. Aspecto deportivo profundo.","Rev\u00eatement en vinyle textur\u00e9. Allure sportive profonde.");
  T("Acr\u00edlico Brilho \u2014 UV","Glossy Acrylic \u2014 UV","Acr\u00edlico brillo \u2014 UV","Acrylique brillant \u2014 UV");
  T("Acr\u00c3\u0083\u00c2\u00adlico Brilho \u00c3\u00a2\u00c2\u0080\u00c2\u0094 UV","Glossy Acrylic \u2014 UV","Acr\u00edlico brillo \u2014 UV","Acrylique brillant \u2014 UV");
  T("Impress\u00e3o UV em acr\u00edlico de alto brilho. Cores profundas, acabamento espelhado.","UV printing on high-gloss acrylic. Deep colors, mirror finish.","Impresi\u00f3n UV en acr\u00edlico de alto brillo. Colores profundos, acabado espejado.","Impression UV sur acrylique tr\u00e8s brillant. Couleurs profondes, finition miroir.");
  T("Impress\u00c3\u0083\u00c2\u00a3o UV em acr\u00c3\u0083\u00c2\u00adlico de alto brilho. Cores profundas, acabamento espelhado.","UV printing on high-gloss acrylic. Deep colors, mirror finish.","Impresi\u00f3n UV en acr\u00edlico de alto brillo. Colores profundos, acabado espejado.","Impression UV sur acrylique tr\u00e8s brillant. Couleurs profondes, finition miroir.");
  T("Fosco","Matte","Mate","Mat");
  T("Acabamento fosco com layouts exclusivos. Visual elegante e sofisticado.","Matte finish with exclusive layouts. Elegant, sophisticated look.","Acabado mate con dise\u00f1os exclusivos. Aspecto elegante y sofisticado.","Finition mate avec des motifs exclusifs. Allure \u00e9l\u00e9gante et raffin\u00e9e.");
  T("Modelo do Layout","Layout Style","Dise\u00f1o del layout","Style de motif");
  T("Pr\u00f3ximo: Moldura + LED \u2192","Next: Frame + LED \u2192","Siguiente: Marco + LED \u2192","Suivant : Cadre + LED \u2192");
  T("Pr\u00c3\u0083\u00c2\u00b3ximo: Moldura + LED \u00c3\u00a2\u00c2\u0086\u00c2\u0092","Next: Frame + LED \u2192","Siguiente: Marco + LED \u2192","Suivant : Cadre + LED \u2192");
  // etapa Moldura + LED
  T("Acabamento da estrutura externa do quadro","Finish of the frame's outer structure","Acabado de la estructura externa del cuadro","Finition de la structure externe du cadre");
  T("Moldura revestida com vinil texturizado de fibra de carbono. Acabamento esportivo premium.","Frame wrapped in textured carbon-fiber vinyl. Premium sporty finish.","Marco revestido con vinilo texturizado de fibra de carbono. Acabado deportivo premium.","Cadre habill\u00e9 de vinyle textur\u00e9 fibre de carbone. Finition sportive premium.");
  T("Laca Preto","Black Lacquer","Laca negra","Laque noire");
  T("Revestimento em laca preta. Acabamento liso, sofisticado e atemporal.","Black lacquer finish. Smooth, sophisticated and timeless.","Revestimiento en laca negra. Acabado liso, sofisticado y atemporal.","Rev\u00eatement en laque noire. Finition lisse, raffin\u00e9e et intemporelle.");
  T("Incluso","Included","Incluido","Inclus");
  T("Ilumina\u00e7\u00e3o LED","LED Lighting","Iluminaci\u00f3n LED","\u00c9clairage LED");
  T("Ilumina\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00a3o LED","LED Lighting","Iluminaci\u00f3n LED","\u00c9clairage LED");
  T("\u00f0\u009f\u0092\u00a1 Ilumina\u00e7\u00e3o LED interna","\ud83d\udca1 Internal LED lighting","\ud83d\udca1 Iluminaci\u00f3n LED interna","\ud83d\udca1 \u00c9clairage LED int\u00e9rieur");
  T("\u00c3\u0083\u00c2\u00b0\u00c3\u0082\u00c2\u009f\u00c3\u0082\u00c2\u0092\u00c3\u0082\u00c2\u00a1 Ilumina\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00a3o LED interna","\ud83d\udca1 Internal LED lighting","\ud83d\udca1 Iluminaci\u00f3n LED interna","\ud83d\udca1 \u00c9clairage LED int\u00e9rieur");
  T("Selecione o tipo abaixo","Select the type below","Selecciona el tipo abajo","Choisissez le type ci-dessous");
  T("Retroilumina\u00e7\u00e3o no interior do quadro \u2014 efeito espetacular no ambiente","Backlighting inside the frame \u2014 a stunning effect in the room","Retroiluminaci\u00f3n en el interior del cuadro \u2014 efecto espectacular en el ambiente","R\u00e9tro\u00e9clairage \u00e0 l'int\u00e9rieur du cadre \u2014 effet spectaculaire dans la pi\u00e8ce");
  T("Retroilumina\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00a3o no interior do quadro \u00c3\u00a2\u00c2\u0080\u00c2\u0094 efeito espetacular no ambiente","Backlighting inside the frame \u2014 a stunning effect in the room","Retroiluminaci\u00f3n en el interior del cuadro \u2014 efecto espectacular en el ambiente","R\u00e9tro\u00e9clairage \u00e0 l'int\u00e9rieur du cadre \u2014 effet spectaculaire dans la pi\u00e8ce");
  T("Sem LED","No LED","Sin LED","Sans LED");
  T("Tipo de LED","LED Type","Tipo de LED","Type de LED");
  T("\ud83d\udd0c Com Fio","\ud83d\udd0c Wired","\ud83d\udd0c Con cable","\ud83d\udd0c Filaire");
  T("\u00c3\u0083\u00c2\u00b0\u00c3\u0082\u00c2\u009f\u00c3\u0082\u00c2\u0094\u00c3\u0082\u00c2\u008c Com Fio","\ud83d\udd0c Wired","\ud83d\udd0c Con cable","\ud83d\udd0c Filaire");
  T("\ud83d\udd0b Sem Fio","\ud83d\udd0b Wireless","\ud83d\udd0b Inal\u00e1mbrico","\ud83d\udd0b Sans fil");
  T("\u00c3\u0083\u00c2\u00b0\u00c3\u0082\u00c2\u009f\u00c3\u0082\u00c2\u0094\u00c3\u0082\u00c2\u008b Sem Fio","\ud83d\udd0b Wireless","\ud83d\udd0b Inal\u00e1mbrico","\ud83d\udd0b Sans fil");
  T("Neutro","Neutral","Neutro","Neutre");
  T("Luz 3000K","3000K light","Luz 3000K","Lumi\u00e8re 3000K");
  T("RGB","RGB","RGB","RGB");
  T("Multicolor","Multicolor","Multicolor","Multicolore");
  T("Pr\u00f3ximo: Alto-relevo \u2192","Next: Relief \u2192","Siguiente: Relieve \u2192","Suivant : Relief \u2192");
  T("Pr\u00c3\u0083\u00c2\u00b3ximo: Alto-relevo \u00c3\u00a2\u00c2\u0086\u00c2\u0092","Next: Relief \u2192","Siguiente: Relieve \u2192","Suivant : Relief \u2192");
  // etapa Alto-relevo
  T("Elementos em alto relevo aplicados no quadro","Raised relief elements applied to the frame","Elementos en altorrelieve aplicados al cuadro","\u00c9l\u00e9ments en relief appliqu\u00e9s au cadre");
  T("Relevos fixos","Fixed reliefs","Relieves fijos","Reliefs fixes");
  T("(sempre inclu\u00eddos)","(always included)","(siempre incluidos)","(toujours inclus)");
  T("(sempre inclu\u00c3\u0083\u00c2\u00addos)","(always included)","(siempre incluidos)","(toujours inclus)");
  T("\ud83c\udff7\ufe0f Logotipo Marca","\ud83c\udff7\ufe0f Brand Logo","\ud83c\udff7\ufe0f Logotipo de la marca","\ud83c\udff7\ufe0f Logo de la marque");
  T("\u00c3\u0083\u00c2\u00b0\u00c3\u0082\u00c2\u009f\u00c3\u0082\u00c2\u008f\u00c3\u0082\u00c2\u00b7\u00c3\u0083\u00c2\u00af\u00c3\u0082\u00c2\u00b8\u00c3\u0082\u00c2\u008f Logotipo Marca","\ud83c\udff7\ufe0f Brand Logo","\ud83c\udff7\ufe0f Logotipo de la marca","\ud83c\udff7\ufe0f Logo de la marque");
  T("Gerado com IA conforme marca selecionada","AI-generated based on the selected brand","Generado con IA seg\u00fan la marca seleccionada","G\u00e9n\u00e9r\u00e9 par IA selon la marque choisie");
  T("Gerando o logo da marca com IA\u2026","Generating the brand logo with AI\u2026","Generando el logo de la marca con IA\u2026","G\u00e9n\u00e9ration du logo de la marque par IA\u2026");
  T("Gerando o logo da marca com IA\u00c3\u00a2\u00c2\u0080\u00c2\u00a6","Generating the brand logo with AI\u2026","Generando el logo de la marca con IA\u2026","G\u00e9n\u00e9ration du logo de la marque par IA\u2026");
  T("Branco","White","Blanco","Blanc");
  T("Preto","Black","Negro","Noir");
  T("Vermelho","Red","Rojo","Rouge");
  T("Escolher cor","Choose color","Elegir color","Choisir la couleur");
  T("\u00f0\u009f\u008f\u008e\u00ef\u00b8\u008f Logo do Modelo \u2014 Canto inferior direito","\ud83c\udfce\ufe0f Model Logo \u2014 Bottom right corner","\ud83c\udfce\ufe0f Logo del modelo \u2014 Esquina inferior derecha","\ud83c\udfce\ufe0f Logo du mod\u00e8le \u2014 Coin inf\u00e9rieur droit");
  T("\u00c3\u0083\u00c2\u00b0\u00c3\u0082\u00c2\u009f\u00c3\u0082\u00c2\u008f\u00c3\u0082\u00c2\u008e\u00c3\u0083\u00c2\u00af\u00c3\u0082\u00c2\u00b8\u00c3\u0082\u00c2\u008f Logo do Modelo \u00c3\u00a2\u00c2\u0080\u00c2\u0094 Canto inferior direito","\ud83c\udfce\ufe0f Model Logo \u2014 Bottom right corner","\ud83c\udfce\ufe0f Logo del modelo \u2014 Esquina inferior derecha","\ud83c\udfce\ufe0f Logo du mod\u00e8le \u2014 Coin inf\u00e9rieur droit");
  T("Gerado com IA conforme modelo selecionado","AI-generated based on the selected model","Generado con IA seg\u00fan el modelo seleccionado","G\u00e9n\u00e9r\u00e9 par IA selon le mod\u00e8le choisi");
  T("Gerando o logo do modelo com IA\u2026","Generating the model logo with AI\u2026","Generando el logo del modelo con IA\u2026","G\u00e9n\u00e9ration du logo du mod\u00e8le par IA\u2026");
  T("Gerando o logo do modelo com IA\u00c3\u00a2\u00c2\u0080\u00c2\u00a6","Generating the model logo with AI\u2026","Generando el logo del modelo con IA\u2026","G\u00e9n\u00e9ration du logo du mod\u00e8le par IA\u2026");
  T("Relevos opcionais","Optional reliefs","Relieves opcionales","Reliefs optionnels");
  T("\u00f0\u009f\u008f\u00b4 Bandeira do Pa\u00eds","\ud83c\udff4 Country Flag","\ud83c\udff4 Bandera del pa\u00eds","\ud83c\udff4 Drapeau du pays");
  T("\u00c3\u0083\u00c2\u00b0\u00c3\u0082\u00c2\u009f\u00c3\u0082\u00c2\u008f\u00c3\u0082\u00c2\u00b4 Bandeira do Pa\u00c3\u0083\u00c2\u00ads","\ud83c\udff4 Country Flag","\ud83c\udff4 Bandera del pa\u00eds","\ud83c\udff4 Drapeau du pays");
  T("Canto superior direito \u2014 bandeira do piloto ou escuderia em relevo","Top right corner \u2014 driver or team flag in relief","Esquina superior derecha \u2014 bandera del piloto o escuder\u00eda en relieve","Coin sup\u00e9rieur droit \u2014 drapeau du pilote ou de l'\u00e9curie en relief");
  T("Canto superior direito \u00c3\u00a2\u00c2\u0080\u00c2\u0094 bandeira do piloto ou escuderia em relevo","Top right corner \u2014 driver or team flag in relief","Esquina superior derecha \u2014 bandera del piloto o escuder\u00eda en relieve","Coin sup\u00e9rieur droit \u2014 drapeau du pilote ou de l'\u00e9curie en relief");
  T("\ud83d\udc64 Nome do Piloto","\ud83d\udc64 Driver Name","\ud83d\udc64 Nombre del piloto","\ud83d\udc64 Nom du pilote");
  T("\u00c3\u0083\u00c2\u00b0\u00c3\u0082\u00c2\u009f\u00c3\u0082\u00c2\u0091\u00c3\u0082\u00c2\u00a4 Nome do Piloto","\ud83d\udc64 Driver Name","\ud83d\udc64 Nombre del piloto","\ud83d\udc64 Nom du pilote");
  T("Canto inferior esquerdo \u2014 at\u00e9 20 caracteres gravados em relevo","Bottom left corner \u2014 up to 20 characters engraved in relief","Esquina inferior izquierda \u2014 hasta 20 caracteres grabados en relieve","Coin inf\u00e9rieur gauche \u2014 jusqu'\u00e0 20 caract\u00e8res grav\u00e9s en relief");
  T("Canto inferior esquerdo \u00c3\u00a2\u00c2\u0080\u00c2\u0094 at\u00c3\u0083\u00c2\u00a9 20 caracteres gravados em relevo","Bottom left corner \u2014 up to 20 characters engraved in relief","Esquina inferior izquierda \u2014 hasta 20 caracteres grabados en relieve","Coin inf\u00e9rieur gauche \u2014 jusqu'\u00e0 20 caract\u00e8res grav\u00e9s en relief");
  T("\u00f0\u009f\u0093\u008b Placa com informa\u00e7\u00f5es do Carro","\ud83d\udccb Plate with Car information","\ud83d\udccb Placa con informaci\u00f3n del coche","\ud83d\udccb Plaque avec informations de la voiture");
  T("\u00c3\u0083\u00c2\u00b0\u00c3\u0082\u00c2\u009f\u00c3\u0082\u00c2\u0093\u00c3\u0082\u00c2\u008b Placa com informa\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00b5es do Carro","\ud83d\udccb Plate with Car information","\ud83d\udccb Placa con informaci\u00f3n del coche","\ud83d\udccb Plaque avec informations de la voiture");
  T("Placa t\u00e9cnica em alto relevo com dados do ve\u00edculo","Technical plate in relief with the vehicle's data","Placa t\u00e9cnica en altorrelieve con los datos del veh\u00edculo","Plaque technique en relief avec les donn\u00e9es du v\u00e9hicule");
  T("Placa t\u00c3\u0083\u00c2\u00a9cnica em alto relevo com dados do ve\u00c3\u0083\u00c2\u00adculo","Technical plate in relief with the vehicle's data","Placa t\u00e9cnica en altorrelieve con los datos del veh\u00edculo","Plaque technique en relief avec les donn\u00e9es du v\u00e9hicule");
  T("\u00f0\u009f\u0097\u00ba\u00ef\u00b8\u008f Tra\u00e7ado do circuito","\ud83d\uddfa\ufe0f Circuit Layout","\ud83d\uddfa\ufe0f Trazado del circuito","\ud83d\uddfa\ufe0f Trac\u00e9 du circuit");
  T("\u00c3\u0083\u00c2\u00b0\u00c3\u0082\u00c2\u009f\u00c3\u0082\u00c2\u0097\u00c3\u0082\u00c2\u00ba\u00c3\u0083\u00c2\u00af\u00c3\u0082\u00c2\u00b8\u00c3\u0082\u00c2\u008f Tra\u00c3\u0083\u00c2\u00a7ado do circuito","\ud83d\uddfa\ufe0f Circuit Layout","\ud83d\uddfa\ufe0f Trazado del circuito","\ud83d\uddfa\ufe0f Trac\u00e9 du circuit");
  T("Mapa em alto relevo do circuito oficial do modelo","Relief map of the model's official circuit","Mapa en altorrelieve del circuito oficial del modelo","Carte en relief du circuit officiel du mod\u00e8le");
  T("COR DO NOME:","NAME COLOR:","COLOR DEL NOMBRE:","COULEUR DU NOM :");
  T("Ver Resumo \u2192","View Summary \u2192","Ver resumen \u2192","Voir le r\u00e9sum\u00e9 \u2192");
  T("Ver Resumo \u00c3\u00a2\u00c2\u0086\u00c2\u0092","View Summary \u2192","Ver resumen \u2192","Voir le r\u00e9sum\u00e9 \u2192");
  // etapa Pedido / resumo
  T("Seu Quadro","Your Frame","Tu cuadro","Votre cadre");
  T("Revise a configura\u00e7\u00e3o e finalize o pedido","Review your setup and complete the order","Revisa la configuraci\u00f3n y finaliza el pedido","V\u00e9rifiez la configuration et finalisez la commande");
  T("Revise a configura\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00a3o e finalize o pedido","Review your setup and complete the order","Revisa la configuraci\u00f3n y finaliza el pedido","V\u00e9rifiez la configuration et finalisez la commande");
  T("Foto","Photo","Foto","Photo");
  T("Quadro completo com miniatura","Complete frame with model","Cuadro completo con miniatura","Cadre complet avec miniature");
  T("Adicionar ao carrinho \u2192","Add to cart \u2192","A\u00f1adir al carrito \u2192","Ajouter au panier \u2192");
  T("Adicionar ao carrinho \u00c3\u00a2\u00c2\u0086\u00c2\u0092","Add to cart \u2192","A\u00f1adir al carrito \u2192","Ajouter au panier \u2192");
  T("Tirar d\u00favidas no WhatsApp","Questions on WhatsApp","Consultas por WhatsApp","Questions sur WhatsApp");
  T("Tirar d\u00c3\u0083\u00c2\u00bavidas no WhatsApp","Questions on WhatsApp","Consultas por WhatsApp","Questions sur WhatsApp");
  T("\u2190 Voltar ao produto","\u2190 Back to product","\u2190 Volver al producto","\u2190 Retour au produit");
  T("\u00c3\u00a2\u00c2\u0086\u00c2\u0090 Voltar ao produto","\u2190 Back to product","\u2190 Volver al producto","\u2190 Retour au produit");
  T("Categoria","Category","Categor\u00eda","Cat\u00e9gorie");
  T("Dimens\u00e3o","Dimensions","Dimensi\u00f3n","Dimensions");
  T("Dimens\u00c3\u0083\u00c2\u00a3o","Dimensions","Dimensi\u00f3n","Dimensions");
  T("Moldura","Frame","Marco","Cadre");
  T("LED","LED","LED","LED");
  T("Alto-relevo extra","Extra relief","Relieve extra","Relief suppl\u00e9mentaire");
  T("Nenhum","None","Ninguno","Aucun");
  T("SKU","SKU","SKU","SKU");
  T("Total estimado","Estimated total","Total estimado","Total estim\u00e9");
  T("\ud83d\udce6 Embalagem Premium","\ud83d\udce6 Premium Packaging","\ud83d\udce6 Embalaje premium","\ud83d\udce6 Emballage premium");
  T("\u00c3\u0083\u00c2\u00b0\u00c3\u0082\u00c2\u009f\u00c3\u0082\u00c2\u0093\u00c3\u0082\u00c2\u00a6 Embalagem Premium","\ud83d\udce6 Premium Packaging","\ud83d\udce6 Embalaje premium","\ud83d\udce6 Emballage premium");
  T("\u2190 Editar configura\u00e7\u00e3o","\u2190 Edit configuration","\u2190 Editar configuraci\u00f3n","\u2190 Modifier la configuration");
  T("\u00c3\u00a2\u00c2\u0086\u00c2\u0090 Editar configura\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00a3o","\u2190 Edit configuration","\u2190 Editar configuraci\u00f3n","\u2190 Modifier la configuration");
  T("Sem frete \u2022 Pre\u00e7o pode variar","Shipping not included \u2022 Price may vary","Env\u00edo no incluido \u2022 El precio puede variar","Livraison non incluse \u2022 Le prix peut varier");
  T("Sem frete \u00c3\u00a2\u00c2\u0080\u00c2\u00a2 Pre\u00c3\u0083\u00c2\u00a7o pode variar","Shipping not included \u2022 Price may vary","Env\u00edo no incluido \u2022 El precio puede variar","Livraison non incluse \u2022 Le prix peut varier");
  T("novo","new","nuevo","nouveau");
  T("atual","current","actual","actuel");
  T("Cancelar","Cancel","Cancelar","Annuler");
  T("OK","OK","OK","OK");
  // placeholders
  T("Como no documento","As on your ID","Como en el documento","Comme sur le document");
  T("voce@email.com","you@email.com","tu@email.com","vous@email.com");
  T("Rua, avenida\u2026","Street, avenue\u2026","Calle, avenida\u2026","Rue, avenue\u2026");
  T("Rua, avenida\u00c3\u00a2\u00c2\u0080\u00c2\u00a6","Street, avenue\u2026","Calle, avenida\u2026","Rue, avenue\u2026");
  T("Apto, bloco\u2026","Apt, block\u2026","Depto, bloque\u2026","Appt, b\u00e2timent\u2026");
  T("Apto, bloco\u00c3\u00a2\u00c2\u0080\u00c2\u00a6","Apt, block\u2026","Depto, bloque\u2026","Appt, b\u00e2timent\u2026");
  T("Digite a marca do carro...","Type the car brand...","Escribe la marca del coche...","Saisissez la marque de la voiture...");
  T("Selecione acima ou digite...","Select above or type...","Selecciona arriba o escribe...","S\u00e9lectionnez ci-dessus ou saisissez...");
  T("Digite o pa\u00eds (ex: Brasil, It\u00e1lia, Reino Unido...)","Type the country (e.g. Brazil, Italy, UK...)","Escribe el pa\u00eds (ej: Brasil, Italia, Reino Unido...)","Saisissez le pays (ex : Br\u00e9sil, Italie, Royaume-Uni...)");
  T("Digite o pa\u00c3\u0083\u00c2\u00ads (ex: Brasil, It\u00c3\u0083\u00c2\u00a1lia, Reino Unido...)","Type the country (e.g. Brazil, Italy, UK...)","Escribe el pa\u00eds (ej: Brasil, Italia, Reino Unido...)","Saisissez le pays (ex : Br\u00e9sil, Italie, Royaume-Uni...)");
  T("Nome do piloto (m\u00e1x. 20 caracteres)","Driver name (max. 20 characters)","Nombre del piloto (m\u00e1x. 20 caracteres)","Nom du pilote (max. 20 caract\u00e8res)");
  T("Nome do piloto (m\u00c3\u0083\u00c2\u00a1x. 20 caracteres)","Driver name (max. 20 characters)","Nombre del piloto (m\u00e1x. 20 caracteres)","Nom du pilote (max. 20 caract\u00e8res)");
  T("Come\u00e7ar uma personaliza\u00e7\u00e3o do zero (mant\u00e9m o carrinho)","Start a customization from scratch (keeps the cart)","Empezar una personalizaci\u00f3n desde cero (mantiene el carrito)","D\u00e9marrer une personnalisation de z\u00e9ro (conserve le panier)");
  T("Come\u00c3\u0083\u00c2\u00a7ar uma personaliza\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00a3o do zero (mant\u00c3\u0083\u00c2\u00a9m o carrinho)","Start a customization from scratch (keeps the cart)","Empezar una personalizaci\u00f3n desde cero (mantiene el carrito)","D\u00e9marrer une personnalisation de z\u00e9ro (conserve le panier)");
  T("Se o carro vier de cabe\u00e7a para baixo, clique para corrigir","If the car appears upside down, click to fix","Si el coche aparece al rev\u00e9s, haz clic para corregir","Si la voiture est \u00e0 l'envers, cliquez pour corriger");
  T("Se o carro vier de cabe\u00c3\u0083\u00c2\u00a7a para baixo, clique para corrigir","If the car appears upside down, click to fix","Si el coche aparece al rev\u00e9s, haz clic para corregir","Si la voiture est \u00e0 l'envers, cliquez pour corriger");

  var _traduzindo=false, _mo=null;
  T("Tipo de Quadro","Frame Type","Tipo de Marco","Type de Cadre");
  T("Modelo \u2192","Model \u2192","Modelo \u2192","Mod\u00e8le \u2192");
  T("Modelo \u00c3\u00a2\u00c2\u0086\u00c2\u0092","Model \u2192","Modelo \u2192","Mod\u00e8le \u2192");
  T("Finalizar e pagar \u2192","Checkout \u2192","Finalizar y pagar \u2192","Finaliser et payer \u2192");
  T("Finalizar e pagar \u00c3\u00a2\u00c2\u0086\u00c2\u0092","Checkout \u2192","Finalizar y pagar \u2192","Finaliser et payer \u2192");
  T("Fundo","Background","Fondo","Arri\u00e8re-plan");
  T("Modelo","Model","Modelo","Mod\u00e8le");
  T("Miniatura","Model","Miniatura","Miniature");
  T("Detalhamento","Details","Detalles","D\u00e9tails");
  T("Moldura + LED","Frame + LED","Marco + LED","Cadre + LED");
  T("Alto-relevo","Relief","Relieve","Relief");
  T("Produto","Product","Producto","Produit");
  T("Preencha o CEP para calcular o frete","Enter your ZIP code to calculate shipping","Ingrese su c\u00f3digo postal para calcular el env\u00edo","Entrez votre code postal pour calculer la livraison");
  /* ---- frases que ficavam em portugues (auditoria de 06/09/2026) ---- */
  /* ---- 07/09/2026: chaves com a acentuacao certa e as frases que faltavam ---- */
  T("Escolher quadros para sua miniatura(s);","Choose frames for your miniature(s);","Elegir cuadros para tu(s) miniatura(s);","Choisir des cadres pour votre miniature ;");
  T("Combinar retirada","Schedule pickup","Coordinar la recogida","Convenir du retrait");
  T("COMBINAR RETIRADA","SCHEDULE PICKUP","COORDINAR LA RECOGIDA","CONVENIR DU RETRAIT");
  T("Escolha o Frete","Select shipping","Elige el env\u00edo","Choisissez la livraison");
  T("ESCOLHA O FRETE","SELECT SHIPPING","ELIGE EL ENV\u00cdO","CHOISISSEZ LA LIVRAISON");
  T("Se escolher essa op\u00e7\u00e3o voc\u00ea ter\u00e1 dois caminhos:","By choosing this option, you'll have two paths:","Si eliges esta opci\u00f3n tendr\u00e1s dos caminos:","Si vous choisissez cette option, vous aurez deux possibilit\u00e9s :");
  T("\u2714 Produto pronto para entrega \u00a0\u00b7\u00a0 \u2714 Quadro + Miniatura inclusos \u00a0\u00b7\u00a0 \u2714 Embalagem premium","\u2714 Ready for delivery \u00a0\u00b7\u00a0 \u2714 Frame + Miniature included \u00a0\u00b7\u00a0 \u2714 Premium packaging","\u2714 Producto listo para entrega \u00a0\u00b7\u00a0 \u2714 Cuadro + Miniatura incluidos \u00a0\u00b7\u00a0 \u2714 Embalaje premium","\u2714 Produit pr\u00eat \u00e0 \u00eatre livr\u00e9 \u00a0\u00b7\u00a0 \u2714 Cadre + Miniature inclus \u00a0\u00b7\u00a0 \u2714 Emballage premium");
  T("Come\u00e7ar uma personaliza\u00e7\u00e3o do zero (mant\u00e9m o carrinho)","Start a customization from scratch (keeps the cart)","Empezar una personalizaci\u00f3n desde cero (mantiene el carrito)","D\u00e9marrer une personnalisation de z\u00e9ro (conserve le panier)");
  T("Rua, avenida\u2026","Street, avenue\u2026","Calle, avenida\u2026","Rue, avenue\u2026");
  T("Apto, bloco\u2026","Apt, block\u2026","Depto, bloque\u2026","Appt, b\u00e2timent\u2026");
  T("Se o carro vier de cabe\u00e7a para baixo, clique para corrigir","If the car appears upside down, click to fix","Si el coche aparece al rev\u00e9s, haz clic para corregir","Si la voiture est \u00e0 l'envers, cliquez pour corriger");
  T("Digite o pa\u00eds (ex: Brasil, It\u00e1lia, Reino Unido...)","Type the country (e.g. Brazil, Italy, UK...)","Escribe el pa\u00eds (ej: Brasil, Italia, Reino Unido...)","Saisissez le pays (ex : Br\u00e9sil, Italie, Royaume-Uni...)");
  T("Nome do piloto (m\u00e1x. 20 caracteres)","Driver name (max. 20 characters)","Nombre del piloto (m\u00e1x. 20 caracteres)","Nom du pilote (max. 20 caract\u00e8res)");
  T("Qual \u00e9 o seu colecion\u00e1vel? Tudo come\u00e7a aqui.","What's your collectible? It all starts here.","\u00bfCu\u00e1l es tu coleccionable? Todo empieza aqu\u00ed.","Quel est votre objet de collection ? Tout commence ici.");
  T("Nessa op\u00e7\u00e3o voc\u00ea ter\u00e1 a oportunidade de personalizar um quadro para a sua miniatura especial","In this option you can customize a frame for your special model","En esta opci\u00f3n podr\u00e1s personalizar un cuadro para tu miniatura especial","Dans cette option, vous pourrez personnaliser un cadre pour votre miniature");
  T("Nessa op\u00e7\u00e3o voc\u00ea encontrar\u00e1 quadros que j\u00e1 s\u00e3o vendidos completos. Contendo o quadro e a miniatura","In this option you'll find frames sold complete, including the frame and the model","En esta opci\u00f3n encontrar\u00e1s cuadros que se venden completos: el cuadro y la miniatura","Dans cette option, vous trouverez des cadres vendus complets, avec le cadre et la miniature");
  T("Escolher quadros prontos que j\u00e1 contenham miniaturas inclusas.","Choose ready-made frames that already include the model car.","Elegir cuadros listos que ya incluyen la miniatura.","Choisir des cadres pr\u00eats qui incluent d\u00e9j\u00e0 la miniature.");
  T("EU J\u00c1 TENHO A MINIATURA","I ALREADY HAVE THE MODEL","YA TENGO LA MINIATURA","J'AI D\u00c9J\u00c0 LA MINIATURE");
  T("Confirmo que j\u00e1 tenho a miniatura e gostaria de comprar apenas o quadro.","I confirm I already have the model and would like to buy only the frame.","Confirmo que ya tengo la miniatura y deseo comprar solo el cuadro.","Je confirme avoir d\u00e9j\u00e0 la miniature et souhaite acheter uniquement le cadre.");
  T("Nessa op\u00e7\u00e3o n\u00e3o est\u00e1 incluso a miniatura. Produzimos e vendemos apenas os quadros","This option does not include the miniature. We only produce and sell","Esta opci\u00f3n no incluye la miniatura. Solo producimos y vendemos los cuadros","Cette option n'inclut pas la miniature. Nous produisons et vendons uniquement les cadres");
  T("para Lego.","frames for Lego.","para Lego.","pour Lego.");
  T("Se escolher essa op\u00e7\u00e3o voc\u00ea ter\u00e1","By choosing this option, you'll have","Si eliges esta opci\u00f3n tendr\u00e1s","En choisissant cette option, vous aurez");
  T("dezenas de modelos de quadros","dozens of frame models","decenas de modelos de cuadros","des dizaines de mod\u00e8les de cadres");
  T("para fixar sua miniatura de Lego.","to mount your Lego miniature.","para fijar tu miniatura de Lego.","pour fixer votre miniature Lego.");
  T("Observa\u00e7\u00e3o:","Note:","Nota:","Remarque :");
  T("Modelo LEGO","LEGO Model","Modelo LEGO","Mod\u00e8le LEGO");
  T("Modelo","Model","Modelo","Mod\u00e8le");
  T("Selecione a marca e depois o modelo espec\u00edfico","Select the brand and then the specific model","Selecciona la marca y luego el modelo espec\u00edfico","S\u00e9lectionnez la marque puis le mod\u00e8le pr\u00e9cis");
  T("Selecione o quadro da sua prefer\u00eancia","Select the frame you prefer","Selecciona el cuadro que prefieras","S\u00e9lectionnez le cadre de votre choix");
  /* ---- 05/10/2026: Somente quadro -> dois caminhos ---- */
  T("Como voc\u00ea quer o seu quadro?","How would you like your frame?","\u00bfC\u00f3mo quieres tu cuadro?","Comment voulez-vous votre cadre ?");
  T("Quadros prontos para sua miniatura","Ready-made frames for your model car","Cuadros listos para tu miniatura","Cadres pr\u00eats pour votre miniature");
  T("Personalize o quadro para sua miniatura","Customize the frame for your model car","Personaliza el cuadro para tu miniatura","Personnalisez le cadre pour votre miniature");
  T("Modelos j\u00e1 criados para miniaturas espec\u00edficas. Escolha a marca e o modelo.","Designs already created for specific model cars. Choose the brand and the model.","Modelos ya creados para miniaturas espec\u00edficas. Elige la marca y el modelo.","Mod\u00e8les d\u00e9j\u00e0 cr\u00e9\u00e9s pour des miniatures pr\u00e9cises. Choisissez la marque et le mod\u00e8le.");
  T("Monte o fundo do seu jeito e veja a pr\u00e9via gerada por Intelig\u00eancia Artificial.","Design the background your way and see a preview generated by Artificial Intelligence.","Dise\u00f1a el fondo a tu manera y mira la vista previa generada por Inteligencia Artificial.","Composez le fond \u00e0 votre fa\u00e7on et d\u00e9couvrez l'aper\u00e7u g\u00e9n\u00e9r\u00e9 par Intelligence Artificielle.");
  T("Nessa op\u00e7\u00e3o a miniatura n\u00e3o est\u00e1 inclusa. Produzimos e vendemos apenas o quadro para a sua miniatura.","The model car is not included in this option. We only produce and sell the frame for your model car.","En esta opci\u00f3n la miniatura no est\u00e1 incluida. Solo producimos y vendemos el cuadro para tu miniatura.","Dans cette option, la miniature n'est pas incluse. Nous produisons et vendons uniquement le cadre pour votre miniature.");
  T("N\u00e3o inclusa","Not included","No incluida","Non incluse");
  T("Quadro para Miniaturas \u2014 Quadro pronto (sem miniatura)","Model car frame \u2014 Ready-made frame (model car not included)","Cuadro para miniaturas \u2014 Cuadro listo (sin miniatura)","Cadre pour miniatures \u2014 Cadre pr\u00eat (sans miniature)");
  T("Miniatura n\u00e3o inclusa","Model car not included","Miniatura no incluida","Miniature non incluse");
  T("Modelos dispon\u00edveis","Available models","Modelos disponibles","Mod\u00e8les disponibles");
  T("Filmes","Movies","Pel\u00edculas","Films");
  T("Motos","Motorcycles","Motos","Motos");
  T("F\u00f3rmula 1","Formula 1","F\u00f3rmula 1","Formule 1");
  T("Ferrari Cole\u00e7\u00e3o Burago","Ferrari Burago Collection","Ferrari Colecci\u00f3n Burago","Ferrari Collection Burago");
  T("Miniatura","Model","Miniatura","Miniature");
  T("Confirme que j\u00e1 possui a miniatura para montagem no quadro.","Confirm you already own the model to mount in the frame.","Confirma que ya tienes la miniatura para montarla en el cuadro.","Confirmez que vous poss\u00e9dez d\u00e9j\u00e0 la miniature \u00e0 monter dans le cadre.");
  T("\u26a0 ATEN\u00c7\u00c3O: MINIATURA N\u00c3O INCLUSA","\u26a0 PLEASE NOTE: MODEL CAR NOT INCLUDED","\u26a0 ATENCI\u00d3N: MINIATURA NO INCLUIDA","\u26a0 ATTENTION : MINIATURE NON INCLUSE");
  T("Esta op\u00e7\u00e3o de personaliza\u00e7\u00e3o refere-se exclusivamente \u00e0 produ\u00e7\u00e3o do quadro. A miniatura diecast exibida nas imagens (via intelig\u00eancia artificial) n\u00e3o acompanha o produto e n\u00e3o est\u00e1 inclusa na compra.","This customisation covers the production of the frame only. The die-cast model shown in the images (generated by artificial intelligence) does not come with the product and is not included in the purchase.","Esta personalizaci\u00f3n se refiere exclusivamente a la producci\u00f3n del cuadro. La miniatura die-cast que aparece en las im\u00e1genes (generada con inteligencia artificial) no acompa\u00f1a al producto ni est\u00e1 incluida en la compra.","Cette personnalisation concerne uniquement la fabrication du cadre. La miniature die-cast visible sur les images (g\u00e9n\u00e9r\u00e9e par intelligence artificielle) n'accompagne pas le produit et n'est pas incluse dans l'achat.");
  T("Este servi\u00e7o \u00e9 destinado a clientes que j\u00e1 possuem a pr\u00f3pria miniatura e desejam transform\u00e1-la em uma pe\u00e7a decorativa exclusiva, fixando-a na parede de maneira inovadora e elegante.","This service is for customers who already own their model car and want to turn it into an exclusive decorative piece, mounted on the wall in an elegant, original way.","Este servicio est\u00e1 pensado para clientes que ya tienen su propia miniatura y quieren convertirla en una pieza decorativa exclusiva, fijada a la pared de forma innovadora y elegante.","Ce service s'adresse aux clients qui poss\u00e8dent d\u00e9j\u00e0 leur miniature et souhaitent en faire une pi\u00e8ce d\u00e9corative exclusive, fix\u00e9e au mur de fa\u00e7on \u00e9l\u00e9gante et originale.");
  T("O quadro ser\u00e1 enviado pronto para que voc\u00ea fa\u00e7a a instala\u00e7\u00e3o da miniatura utilizando parafusos, de forma simples e pr\u00e1tica. O kit inclui: quadro personalizado, buchas, parafusos e gabarito de instala\u00e7\u00e3o, facilitando tanto a fixa\u00e7\u00e3o da miniatura no quadro quanto a instala\u00e7\u00e3o do quadro na parede.","The frame ships ready for you to mount the model car with screws, simply and quickly. The kit includes: the customised frame, wall plugs, screws and an installation template, making it easy both to fix the model in the frame and to hang the frame on the wall.","El cuadro se env\u00eda listo para que instales la miniatura con tornillos, de forma sencilla y pr\u00e1ctica. El kit incluye: cuadro personalizado, tacos, tornillos y plantilla de instalaci\u00f3n, facilitando tanto la fijaci\u00f3n de la miniatura como la instalaci\u00f3n del cuadro en la pared.","Le cadre est livr\u00e9 pr\u00eat \u00e0 recevoir la miniature, fix\u00e9e avec des vis, simplement et rapidement. Le kit comprend : le cadre personnalis\u00e9, des chevilles, des vis et un gabarit de pose, pour fixer facilement la miniature dans le cadre et le cadre au mur.");
  T("Geramos a imagem da sua miniatura com intelig\u00eancia Artificial, para que confirme o modelo e consiga personalizar seu quadro o mais pr\u00f3ximo da realidade poss\u00edvel.","We generated your model image with Artificial Intelligence so you can confirm the model and customize your frame as close to reality as possible.","Generamos la imagen de tu miniatura con Inteligencia Artificial para que confirmes el modelo y personalices tu cuadro lo m\u00e1s fiel posible.","Nous avons g\u00e9n\u00e9r\u00e9 l'image de votre miniature par Intelligence Artificielle afin que vous confirmiez le mod\u00e8le et personnalisiez votre cadre au plus pr\u00e8s de la r\u00e9alit\u00e9.");
  T("Clique no bot\u00e3o","Click the button","Haz clic en el bot\u00f3n","Cliquez sur le bouton");
  T(", abaixo e d\u00ea continuidade na experi\u00eancia"," below to continue"," de abajo y contin\u00faa la experiencia"," ci-dessous pour continuer");
  T("\u2726 GERAR VISUALIZA\u00c7\u00c3O COM IA","\u2726 GENERATE AI PREVIEW","\u2726 GENERAR VISTA PREVIA CON IA","\u2726 G\u00c9N\u00c9RER L'APER\u00c7U PAR IA");
  T("\u2726 Visualiza\u00e7\u00e3o gerada por Intelig\u00eancia Artificial","\u2726 Preview generated by Artificial Intelligence","\u2726 Vista previa generada por Inteligencia Artificial","\u2726 Aper\u00e7u g\u00e9n\u00e9r\u00e9 par Intelligence Artificielle");
  T("Ex: 488 GTB, Senna, 911 Turbo S...","e.g. 488 GTB, Senna, 911 Turbo S\u2026","Ej.: 488 GTB, Senna, 911 Turbo S\u2026","Ex. : 488 GTB, Senna, 911 Turbo S\u2026");
  T("Amarelo","Yellow","Amarillo","Jaune");
  T("Azul Celeste","Sky Blue","Azul Celeste","Bleu Ciel");
  T("Azul Met\u00e1lico","Metallic Blue","Azul Met\u00e1lico","Bleu M\u00e9tallis\u00e9");
  T("Branco","White","Blanco","Blanc");
  T("Champagne","Champagne","Champ\u00e1n","Champagne");
  T("Cinza Escuro","Dark Grey","Gris Oscuro","Gris Fonc\u00e9");
  T("Cinza Grafite","Graphite Grey","Gris Grafito","Gris Graphite");
  T("Dourado","Gold","Dorado","Dor\u00e9");
  T("Laranja","Orange","Naranja","Orange");
  T("Prata","Silver","Plata","Argent");
  T("Preto","Black","Negro","Noir");
  T("Rosa","Pink","Rosa","Rose");
  T("Roxo","Purple","Morado","Violet");
  T("Turquesa","Turquoise","Turquesa","Turquoise");
  T("Verde Brit\u00e2nico","British Green","Verde Brit\u00e1nico","Vert Anglais");
  T("Verde Lima","Lime Green","Verde Lima","Vert Citron");
  T("Vermelho Escuro","Dark Red","Rojo Oscuro","Rouge Fonc\u00e9");
  T("Vermelho Ferrari","Ferrari Red","Rojo Ferrari","Rouge Ferrari");
  T("Dimens\u00e3o","Dimensions","Dimensi\u00f3n","Dimensions");
  T("Dimens\u00e3o do quadro","Frame size","Dimensi\u00f3n del cuadro","Dimensions du cadre");
  T("Especifica\u00e7\u00f5es da miniatura e do quadro","Model car and frame specifications","Especificaciones de la miniatura y del cuadro","Caract\u00e9ristiques de la miniature et du cadre");
  T("Acr\u00edlico Brilho \u2014 UV","Glossy Acrylic \u2014 UV","Acr\u00edlico brillo \u2014 UV","Acrylique brillant \u2014 UV");
  T("Impress\u00e3o UV em acr\u00edlico de alto brilho. Cores profundas, acabamento espelhado.","UV printing on high-gloss acrylic. Deep colors, mirror finish.","Impresi\u00f3n UV en acr\u00edlico de alto brillo. Colores profundos, acabado espejado.","Impression UV sur acrylique tr\u00e8s brillant. Couleurs profondes, finition miroir.");
  T("Ilumina\u00e7\u00e3o LED","LED Lighting","Iluminaci\u00f3n LED","\u00c9clairage LED");
  T("\ud83d\udca1 Ilumina\u00e7\u00e3o LED interna","\ud83d\udca1 Internal LED lighting","\ud83d\udca1 Iluminaci\u00f3n LED interna","\ud83d\udca1 \u00c9clairage LED int\u00e9rieur");
  T("Retroilumina\u00e7\u00e3o no interior do quadro \u2014 efeito espetacular no ambiente","Backlighting inside the frame \u2014 a stunning effect in the room","Retroiluminaci\u00f3n en el interior del cuadro \u2014 efecto espectacular en el ambiente","R\u00e9tro\u00e9clairage \u00e0 l'int\u00e9rieur du cadre \u2014 effet spectaculaire dans la pi\u00e8ce");
  T("(sempre inclu\u00eddos)","(always included)","(siempre incluidos)","(toujours inclus)");
  T("\ud83c\udff4 Bandeira do Pa\u00eds","\ud83c\udff4 Country flag","\ud83c\udff4 Bandera del pa\u00eds","\ud83c\udff4 Drapeau du pays");
  T("Canto superior direito \u2014 bandeira do piloto ou escuderia em relevo","Top right corner \u2014 driver or team flag in relief","Esquina superior derecha \u2014 bandera del piloto o escuder\u00eda en relieve","Coin sup\u00e9rieur droit \u2014 drapeau du pilote ou de l'\u00e9curie en relief");
  T("\ud83d\udc64 Nome do Piloto","\ud83d\udc64 Driver Name","\ud83d\udc64 Nombre del piloto","\ud83d\udc64 Nom du pilote");
  T("Canto inferior esquerdo \u2014 at\u00e9 20 caracteres gravados em relevo","Bottom left corner \u2014 up to 20 characters engraved in relief","Esquina inferior izquierda \u2014 hasta 20 caracteres grabados en relieve","Coin inf\u00e9rieur gauche \u2014 jusqu'\u00e0 20 caract\u00e8res grav\u00e9s en relief");
  T("Resumo","Summary","Resumen","R\u00e9capitulatif");
  T("Revise a configura\u00e7\u00e3o e finalize o pedido","Review your setup and complete the order","Revisa la configuraci\u00f3n y finaliza el pedido","V\u00e9rifiez la configuration et finalisez la commande");
  T("Envio pr\u00f3prio","Own delivery","Env\u00edo propio","Livraison en propre");
  T("Tirar d\u00favidas no WhatsApp","Questions on WhatsApp","Consultas por WhatsApp","Questions sur WhatsApp");
  T("\ud83c\udfc6 Artesanal","\ud83c\udfc6 Handcrafted","\ud83c\udfc6 Artesanal","\ud83c\udfc6 Fait main");
  T("\ud83d\udce6 Embalagem Premium","\ud83d\udce6 Premium Packaging","\ud83d\udce6 Embalaje premium","\ud83d\udce6 Emballage premium");
  T("\u23f1 7\u201312 dias \u00fateis","\u23f1 7\u201312 business days","\u23f1 7\u201312 d\u00edas h\u00e1biles","\u23f1 7 \u00e0 12 jours ouvr\u00e9s");
  T("\u2708 Todo o Brasil","\u2708 Across Brazil","\u2708 Todo Brasil","\u2708 Partout au Br\u00e9sil");
  T("Seus dados","Your details","Tus datos","Vos coordonn\u00e9es");
  T("Endere\u00e7o","Address","Direcci\u00f3n","Adresse");
  T("N\u00famero","Number","N\u00famero","Num\u00e9ro");
  T("Complemento","Address line 2","Complemento","Compl\u00e9ment");
  T("(opcional)","(optional)","(opcional)","(facultatif)");
  T("Seus dados s\u00e3o usados apenas para emitir a nota fiscal e realizar a entrega.","Your data is used only to issue the invoice and complete delivery.","Tus datos se usan solo para emitir la factura y realizar la entrega.","Vos donn\u00e9es servent uniquement \u00e0 \u00e9mettre la facture et \u00e0 effectuer la livraison.");
  T("RETIRAR NA F\u00c1BRICA","FACTORY PICKUP","RECOGIDA EN F\u00c1BRICA","RETRAIT \u00c0 L'ATELIER");
  T("Gr\u00e1tis","Free","Gratis","Gratuit");
  T("8 dias \u00fateis","8 business days","8 d\u00edas h\u00e1biles","8 jours ouvr\u00e9s");
  T("Cupom de desconto","Discount code","C\u00f3digo de descuento","Code de r\u00e9duction");
  T("Digite seu cupom","Enter your code","Introduce tu c\u00f3digo","Saisissez votre code");
  T("Aplicar","Apply","Aplicar","Appliquer");
  T("Digite seu CEP","Enter your postal code","Introduce tu c\u00f3digo postal","Saisissez votre code postal");
  T("Nova personaliza\u00e7\u00e3o","New customisation","Nueva personalizaci\u00f3n","Nouvelle personnalisation");
  T("Come\u00e7ar uma personaliza\u00e7\u00e3o do zero (mant\u00e9m o carrinho)","Start a customization from scratch (keeps the cart)","Empezar una personalizaci\u00f3n desde cero (mantiene el carrito)","D\u00e9marrer une personnalisation de z\u00e9ro (conserve le panier)");
  T("Se o carro vier de cabe\u00e7a para baixo, clique para corrigir","If the car appears upside down, click to fix","Si el coche aparece al rev\u00e9s, haz clic para corregir","Si la voiture est \u00e0 l'envers, cliquez pour corriger");
  T("VEJA O EXEMPLO DA PROPOR\u00c7\u00c3O (DIMENS\u00c3O) DO QUADRO","SEE AN EXAMPLE OF THE FRAME PROPORTION (SIZE)","MIRA UN EJEMPLO DE LA PROPORCI\u00d3N (TAMA\u00d1O) DEL CUADRO","VOYEZ UN EXEMPLE DE LA PROPORTION (TAILLE) DU CADRE");
  T("A partir do exemplo acima, voc\u00ea conseguir\u00e1 ter a no\u00e7\u00e3o geral da dimens\u00e3o do quadro comparado a dimens\u00e3o de uma pessoa com 1,75m de altura","From the example above, you can get a general sense of the frame size compared to a person 1.75 m tall","Con el ejemplo de arriba podr\u00e1s hacerte una idea del tama\u00f1o del cuadro comparado con una persona de 1,75 m de altura","\u00c0 partir de l'exemple ci-dessus, vous aurez une id\u00e9e g\u00e9n\u00e9rale de la taille du cadre par rapport \u00e0 une personne d'1,75 m");
  T("SIGA AS ORIENTA\u00c7\u00d5ES","FOLLOW THE STEPS","SIGUE LAS INSTRUCCIONES","SUIVEZ LES INDICATIONS");
  T("Linha completa de quadros","The complete frame range","La gama completa de cuadros","La gamme compl\u00e8te de cadres");
  T("Total:","Total:","Total:","Total :");
  T("Total estimado","Estimated total","Total estimado","Total estim\u00e9");
  T("Sem frete \u2022 Pre\u00e7o pode variar","Shipping not included \u2022 Price may vary","Env\u00edo no incluido \u2022 El precio puede variar","Livraison non incluse \u2022 Le prix peut varier");
  T("DE PERSONALIZAR","TO CUSTOMIZE","DE PERSONALIZAR","DE PERSONNALISER");
  T("Pr\u00f3ximo: Escolher Modelo \u2192","Next: Choose Model \u2192","Siguiente: Elegir modelo \u2192","Suivant : Choisir le mod\u00e8le \u2192");
  T("Pr\u00f3ximo: Detalhamento \u2192","Next: Details \u2192","Siguiente: Detalles \u2192","Suivant : D\u00e9tails \u2192");
  T("Pr\u00f3ximo: Fundo \u2192","Next: Background \u2192","Siguiente: Fondo \u2192","Suivant : Fond \u2192");
  T("Pr\u00f3ximo: Moldura + LED \u2192","Next: Frame + LED \u2192","Siguiente: Marco + LED \u2192","Suivant : Cadre + LED \u2192");
  T("Pr\u00f3ximo: Alto-relevo \u2192","Next: Relief \u2192","Siguiente: Relieve \u2192","Suivant : Relief \u2192");
  T("Pr\u00f3ximo: Miniatura \u2192","Next: Model \u2192","Siguiente: Miniatura \u2192","Suivant : Miniature \u2192");
  T("PERSONALIZAR QUADRO \u2192","CUSTOMIZE FRAME \u2192","PERSONALIZAR CUADRO \u2192","PERSONNALISER LE CADRE \u2192");
  T("Adicionar ao carrinho \u2192","Add to cart \u2192","A\u00f1adir al carrito \u2192","Ajouter au panier \u2192");
  T("Modelo \u2192","Model \u2192","Modelo \u2192","Mod\u00e8le \u2192");
  T("Detalhamento \u2192","Details \u2192","Detalles \u2192","D\u00e9tails \u2192");
  T("Dimens\u00e3o \u2192","Size \u2192","Dimensi\u00f3n \u2192","Dimension \u2192");
  T("Fundo \u2192","Background \u2192","Fondo \u2192","Fond \u2192");
  T("Moldura + LED \u2192","Frame + LED \u2192","Marco + LED \u2192","Cadre + LED \u2192");
  T("Alto-relevo \u2192","Relief \u2192","Relieve \u2192","Relief \u2192");
  T("Miniatura \u2192","Model car \u2192","Miniatura \u2192","Miniature \u2192");
  T("Ver Resumo \u2192","View Summary \u2192","Ver resumen \u2192","Voir le r\u00e9sum\u00e9 \u2192");
  T("Finalizar e pagar \u2192","Checkout \u2192","Finalizar y pagar \u2192","Finaliser et payer \u2192");
  T("\u2190 Voltar","\u2190 Back","\u2190 Volver","\u2190 Retour");
  T("\u2190 Voltar aos itens","\u2190 Back to items","\u2190 Volver a los art\u00edculos","\u2190 Retour aux articles");
  T("\u2190 Editar configura\u00e7\u00e3o","\u2190 Edit configuration","\u2190 Editar configuraci\u00f3n","\u2190 Modifier la configuration");
// CHARSET FIX: corrige double-encoded UTF-8 nos text nodes do DOM
(function(){
function _dec(s){
try{
var b=new Uint8Array(s.length),ok=true;
for(var i=0;i<s.length;i++){var c=s.charCodeAt(i);if(c>255){ok=false;break;}b[i]=c;}
return ok?new TextDecoder('utf-8',{fatal:false}).decode(b):s;
}catch(e){return s;}}
function fixNode(n){
if(n.nodeType!==3)return;
var t=n.textContent;
if(!/[\xC0-\xFF][\x80-\xBF]/.test(t))return;
var f=_dec(_dec(t));
if(f!==t)n.textContent=f;}
function fixAll(root){
var w=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT);
var n;while((n=w.nextNode()))fixNode(n);}
function setup(){
fixAll();
try{
var obs=new MutationObserver(function(muts){
muts.forEach(function(m){
m.addedNodes.forEach(function(nd){if(nd.nodeType===3)fixNode(nd);else if(nd.nodeType===1)fixAll(nd);});
if(m.type==='characterData')fixNode(m.target);
});});
obs.observe(document.body,{childList:true,subtree:true,characterData:true});
}catch(e){}}
if(document.readyState==='loading'){
document.addEventListener('DOMContentLoaded',setup);
}else{setup();}
window._charsetFix={ran:true};
})();
// EMOJI FIX v2: charset-safe re-registro de chaves FULL
(function(){
var fix=[
[String.fromCharCode(55357,56481),String.fromCharCode(240,159,146,161)],
[String.fromCharCode(55357,56587),String.fromCharCode(240,159,148,139)],
[String.fromCharCode(55357,56588),String.fromCharCode(240,159,148,140)],
[String.fromCharCode(55356,57335,65039),String.fromCharCode(240,159,143,183,239,184,143)],
[String.fromCharCode(55356,57294,65039),String.fromCharCode(240,159,143,142,239,184,143)],
[String.fromCharCode(55356,57332),String.fromCharCode(240,159,143,180)],
[String.fromCharCode(55357,56420),String.fromCharCode(240,159,145,164)],
[String.fromCharCode(55357,56523),String.fromCharCode(240,159,147,139)],
[String.fromCharCode(55357,56826,65039),String.fromCharCode(240,159,151,186,239,184,143)],
[String.fromCharCode(55357,56550),String.fromCharCode(240,159,147,166)]
];
var added=0;
var ks=Object.keys(FULL);
fix.forEach(function(p){
  var good=p[0],bad=p[1];
  ks.forEach(function(k){
    if(k.indexOf(bad)!==-1){
      var nk=k.split(bad).join(good);
      var v=FULL[k],nv={};
      ['en','es','fr'].forEach(function(l){if(v[l])nv[l]=v[l].split(bad).join(good);});
      FULL[nk]=nv;
      added++;
    }
  });
});
window._emojiFix={ran:true,added:added,fullSize:ks.length};
})();
// PRICE FIX v3: moeda regional para .tdesc dos ledFio
(function(){
var _r='BR';
function _f(n,r){if(r==='EU')return'\u20AC '+n.toFixed(2).replace('.',',');if(r==='US')return'$ '+n.toFixed(2);return'R$ '+n.toFixed(2).replace('.',',');}
function fix(){var r=(window.FP&&window.FP.region)||'BR';/* 12/11/2026: o preco do LED agora sai do painel (app_1.js, _precoOpcionais) */[].forEach(function(p){var d=document.querySelector('#'+p[0]+' .tdesc');if(!d)return;var t=(d.textContent||'');var n=parseFloat(t.replace(/[^\d,.]/g,'').replace(',','.'))||p[1];if(n>0)d.textContent=_f(n,r);});}
function hook(){
if(!window.FP)return;
if(window.FP.__ph)return;
window.FP.__ph=1;
_r=window.FP.region||'BR';
try{Object.defineProperty(window.FP,'region',{get:function(){return _r;},set:function(v){_r=v;fix();},configurable:true,enumerable:true});}catch(e){}
if(window.FP.setRegion){var _o=window.FP.setRegion;window.FP.setRegion=function(r){_o.call(window.FP,r);fix();};}
fix();
}
hook();
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){hook();fix();});}else{hook();fix();}
window.addEventListener('load',function(){hook();fix();});
window._priceFix={ran:true};
})();


  function traduzTudo(lang){
    var body=document.body; if(!body)return;
    _traduzindo=true;
    var alvo=(lang&&lang!=='pt')?lang:null;
    var w=document.createTreeWalker(body,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
      if(!n.nodeValue||!n.nodeValue.trim())return NodeFilter.FILTER_REJECT;
      var p=n.parentNode; if(!p)return NodeFilter.FILTER_REJECT;
      var tag=p.nodeName; if(tag==='SCRIPT'||tag==='STYLE'||tag==='TEXTAREA'||tag==='OPTION')return NodeFilter.FILTER_REJECT;
      if(p.closest&&p.closest('#fpLang'))return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
    var nodes=[],nn; while(nn=w.nextNode())nodes.push(nn);
    nodes.forEach(function(n){
      var cur=n.nodeValue, curT=cur.trim();
      if(n.__pt===undefined)n.__pt=cur;
      var baseT=n.__pt.trim();
      if(!alvo){ if(n.__tr){ if(n.nodeValue!==n.__pt)n.nodeValue=n.__pt; n.__tr=false; } return; }
      var tr=FULL[baseT]||FULL[curT];
      if(tr&&tr[alvo]){ var src=FULL[baseT]?n.__pt:cur; var lead=src.match(/^\s*/)[0],tail=src.match(/\s*$/)[0]; var v=lead+tr[alvo]+tail; if(n.nodeValue!==v)n.nodeValue=v; n.__tr=true; return; }
      var m=curT.match(/^Passo (\d+) de (\d+)$/); if(m){ var pw={en:'Step %1 of %2',es:'Paso %1 de %2',fr:'ÃÂtape %1 sur %2'}[alvo]; n.nodeValue=cur.replace(curT,pw.replace('%1',m[1]).replace('%2',m[2])); }
    });
    document.querySelectorAll('[placeholder]').forEach(function(el){
      if(el.closest('#fpLang'))return;
      if(el.__ptph===undefined)el.__ptph=el.getAttribute('placeholder');
      var tr=FULL[el.__ptph]; var val=(alvo&&tr&&tr[alvo])?tr[alvo]:el.__ptph;
      if(el.getAttribute('placeholder')!==val)el.setAttribute('placeholder',val);
    });
    _traduzindo=false;
  }
  window.FP_traduzTudo=traduzTudo;
  function iniObserverI18n(){
    if(_mo||!document.body)return;
    _mo=new MutationObserver(function(){ if(_traduzindo||FP.lang==='pt')return; clearTimeout(window.__i18nT); window.__i18nT=setTimeout(function(){traduzTudo(FP.lang);
    // Multi-currency: injetar preÃÂ§os regionais em CAT_PRECOS + recalcular
    (function(){
      var reg=FP.region||'BR';
      if(reg==='BR'){
        // Restaurar preÃÂ§os originais do banco (BR)
        /* 12/11/2026: esta volta para o real saiu daqui. Numa visita que COMECA na Europa o
           "original" guardado ja era a tabela em euro, e voltar para o Brasil deixava os
           numeros do euro com R$ na frente. Quem devolve a tabela do Brasil e' o reaplica(),
           la embaixo, a partir do catalogo. */
      } else if(CFG[reg]&&CFG[reg].prices){
        // Salvar original apenas uma vez
        if(window._origCAT_PRECOS===undefined) window._origCAT_PRECOS=window.CAT_PRECOS;
        window.CAT_PRECOS=(window.__fpPrecosEur&&Object.keys(window.__fpPrecosEur).length)
          ? window.__fpPrecosEur : CFG[reg].prices;
      }
      // Recalcular preÃÂ§o exibido e corrigir sÃÂ­mbolo
      setTimeout(function(){
        if(typeof calcPrice==='function') calcPrice();
        var sym=(CFG[reg]&&CFG[reg].symbol)||'R$';
        if(sym!=='R$'){
          ['pvPrice','mobBarPrice','deskBarPrice'].forEach(function(id){
            var el=document.getElementById(id);
            if(el&&el.textContent) el.textContent=el.textContent.replace(/R$/g,sym);
          });
        }
      },50);
    })();},140); });
    _mo.observe(document.body,{childList:true,subtree:true,characterData:true});
  }
  if(document.readyState!=='loading')setTimeout(iniObserverI18n,300); else document.addEventListener('DOMContentLoaded',function(){setTimeout(iniObserverI18n,300);});

  function aplicar(){
    var t=FP.t, q=function(s){return document.querySelector(s);}, el;
    traduzTudo(FP.lang);
    el=q('.novaPersona-btn span'); if(el)el.textContent=t('nav.newCustom');
    el=q('.cart-btn .lbl'); if(el)el.textContent=t('nav.cart');
    var order=['step.tipo','step.modelo','step.produto','step.detalhe','step.fundo','step.moldura','step.relevo','step.pedido'];
    document.querySelectorAll('.stab .slbl').forEach(function(e,i){ if(order[i])e.textContent=t(order[i]); });
    el=q('#cartTitulo'); if(el)el.textContent=t('cart.title');
    document.querySelectorAll('.cart-tot-l').forEach(function(e){e.textContent=t('cart.total');});
    el=q('.cart-note'); if(el)el.textContent=t('cart.note');
    el=q('#cartFoot .btn-cart-go'); if(el)el.textContent=t('cart.checkout');
    el=q('#cartFoot .btn-cart-more'); if(el)el.textContent=t('cart.more');
    document.documentElement.lang=(FP.lang==='pt'?'pt-BR':'en');
    if(typeof _cartRender==='function'){try{_cartRender();}catch(e){}}
    atualizaSeletor();
    atualizaFreteLabels();
  }
  FP.setLang=function(l){FP.lang=l;save();aplicar();};
  FP.setRegion=function(r){if(!CFG[r])return;FP.region=r;FP.lang=CFG[r].lang;if(typeof resetFrete==='function')resetFrete();save();aplicar();};
  window.FP=FP;

  function montaSeletor(){
    var header=document.querySelector('header'); if(!header||document.getElementById('fpLang'))return;
    var cartBtn=document.getElementById('cartBtn');
    var wrap=document.createElement('div'); wrap.className='fp-lang'; wrap.id='fpLang';
    wrap.innerHTML='<button class="fp-lang-btn" id="fpLangBtn" aria-label="Idioma e regiÃÂ£o"><span class="fp-flag" id="fpLangFlag"></span><span class="fp-lang-txt" id="fpLangTxt">PT</span><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>'
      +'<div class="fp-lang-menu" id="fpLangMenu">'
      +'<div class="fp-lang-h" id="fpH1">Idioma</div>'
      +'<div class="fp-lang-opt" data-lang="pt"><span class="fp-flag">'+flagSVG('BR')+'</span> PortuguÃÂªs</div>'
      +'<div class="fp-lang-opt" data-lang="en"><span class="fp-flag">'+flagSVG('GB')+'</span> English</div>'
      +'<div class="fp-lang-opt" data-lang="es"><span class="fp-flag">'+flagSVG('ES')+'</span> EspaÃÂ±ol</div>'
      +'<div class="fp-lang-opt" data-lang="fr"><span class="fp-flag">'+flagSVG('FR')+'</span> FranÃÂ§ais</div>'
      +'<div class="fp-lang-div"></div>'
      +'<div class="fp-lang-h" id="fpH2">RegiÃÂ£o / Entrega</div>'
      +'<div class="fp-lang-opt" data-reg="BR"><span class="fp-flag">'+flagSVG('BR')+'</span> <span data-rk="BR">Brasil</span></div>'
      +'<div class="fp-lang-opt" data-reg="EU"><span class="fp-flag">'+flagSVG('EU')+'</span> <span data-rk="EU">Europa</span></div>'
      +'<div class="fp-lang-opt" data-reg="US"><span class="fp-flag">'+flagSVG('US')+'</span> <span data-rk="US">EUA</span></div>'
      +'</div>';
    if(cartBtn)header.insertBefore(wrap,cartBtn); else header.appendChild(wrap);
    document.getElementById('fpLangBtn').addEventListener('click',function(e){e.stopPropagation();document.getElementById('fpLangMenu').classList.toggle('open');});
    document.addEventListener('click',function(){var m=document.getElementById('fpLangMenu');if(m)m.classList.remove('open');});
    wrap.querySelectorAll('[data-lang]').forEach(function(o){o.addEventListener('click',function(){FP.setLang(o.getAttribute('data-lang'));});});
    wrap.querySelectorAll('[data-reg]').forEach(function(o){o.addEventListener('click',function(){FP.setRegion(o.getAttribute('data-reg'));});});
  }
  function atualizaSeletor(){
    var fl=document.getElementById('fpLangFlag'); if(fl)fl.innerHTML=flagSVG(FP.region);
    var tx=document.getElementById('fpLangTxt'); if(tx)tx.textContent=FP.lang.toUpperCase();
    var _h1={pt:'Idioma',en:'Language',es:'Idioma',fr:'Langue'}, _h2={pt:'RegiÃÂ£o / Entrega',en:'Region / Delivery',es:'RegiÃÂ³n / EnvÃÂ­o',fr:'RÃÂ©gion / Livraison'};
    var h1=document.getElementById('fpH1'); if(h1)h1.textContent=_h1[FP.lang]||_h1.pt;
    var h2=document.getElementById('fpH2'); if(h2)h2.textContent=_h2[FP.lang]||_h2.pt;
    document.querySelectorAll('#fpLang [data-lang]').forEach(function(o){o.classList.toggle('on',o.getAttribute('data-lang')===FP.lang);});
    document.querySelectorAll('#fpLang [data-reg]').forEach(function(o){o.classList.toggle('on',o.getAttribute('data-reg')===FP.region);});
    document.querySelectorAll('#fpLang [data-rk]').forEach(function(s){var r=s.getAttribute('data-rk');if(CFG[r])s.textContent=CFG[r].reg[FP.lang]||CFG[r].reg.pt;});
  }

  // ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ FRETE: cÃÂ¡lculo REAL Ã¢ÂÂ SuperFrete (BR ÃÂ¢ÃÂÃÂ¤100cm) ÃÂ· Melhor Envio/Jadlog (BR >100cm) ÃÂ· Sendcloud (EU) ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
  FP.frete=null;
  var FRETE_EU_PAISES=[['BE','BÃÂ©lgica'],['FR','FranÃÂ§a'],['DE','Alemanha'],['NL','PaÃÂ­ses Baixos'],['LU','Luxemburgo'],['IT','ItÃÂ¡lia'],['ES','Espanha'],['PT','Portugal'],['AT','ÃÂustria'],['IE','Irlanda']];
  function fmt(v){var loc={pt:'pt-BR',en:'en-US',es:'es-ES',fr:'fr-FR'}[FP.lang]||'pt-BR';return Number(v||0).toLocaleString(loc,{minimumFractionDigits:2,maximumFractionDigits:2});}
  function _freteDim(i){
    if(i&&i.cfg){ if(i.cfg.legoDim)return i.cfg.legoDim; if(i.cfg.quadroDim)return i.cfg.quadroDim; if(i.cfg.dim)return i.cfg.dim; }
    if(i&&i.dim)return i.dim;
    var txt=((i&&i.sub)||'')+' '+(((i&&i.linhas)||[]).join(' '));
    var m=txt.match(/\d{1,3}(?:[.,]\d)?\s*[ÃÂx]\s*\d{1,3}(?:[.,]\d)?\s*cm/i);
    return m?m[0]:'';
  }
  /* redoma viaja pelo id: o servidor busca a caixa no banco. Item de redoma
     entra na lista mesmo sem medida legivel, porque quem manda e' o id. */
  function _freteItens(){
    return (window.CART||[]).map(function(i){
      var rid=(i.cfg&&i.cfg.redoma_id)||null;
      var sm=(i.cfg&&i.cfg.redoma_sm)||null;
      var o={dim:_freteDim(i),qty:1};
      if(sm&&sm.l)o.redoma_sm={l:sm.l,p:sm.p,a:sm.a};   /* caixa pela regra, no servidor */
      else if(rid)o.redoma_id=rid;
      return o;
    }).filter(function(x){ return x.dim||x.redoma_id||x.redoma_sm; });
  }
  function atualizaFreteLabels(){
    var t=FP.t,e;
    e=document.getElementById('fpFreteT'); if(e)e.textContent=t('frete.title');
    e=document.getElementById('fpCep'); if(e)e.placeholder=(FP.region==='BR')?t('frete.cep'):'Postal code / ZIP';
    e=document.getElementById('fpCalcBtn'); if(e)e.textContent=t('frete.calc');
    e=document.getElementById('fpFreteNote'); if(e)e.textContent='';
    var pais=document.getElementById('fpFretePais'); if(pais)pais.style.display=(FP.region==='EU')?'':'none';
  }
  function resetFrete(){FP.frete=null;var o=document.getElementById('fpFreteOpts');if(o)o.innerHTML='';var c=document.getElementById('fpCep');if(c)c.value='';var tt=document.getElementById('fpFreteTot');if(tt)tt.remove();}
  function renderOpcoes(carrier,currency,options){
    var t=FP.t, opts=document.getElementById('fpFreteOpts'); if(!opts)return;
    if(!options||!options.length){ opts.innerHTML='<div class="fp-frete-msg" style="color:#d98a82">'+t('frete.none')+'</div>'; return; }
    var html=options.map(function(o){
      var prazo=o.days?(o.days+' '+t('frete.days')):'';
      var nome=String(o.label||'').replace(/"/g,'&quot;');
      return '<div class="fp-frete-opt" data-preco="'+o.price+'" data-nome="'+nome+'"><div class="fp-frete-radio"></div><div class="fp-frete-info"><div class="fp-frete-nome">'+nome+'</div><div class="fp-frete-prazo">'+prazo+'</div></div><div class="fp-frete-preco">'+currency+' '+fmt(o.price)+'</div></div>';
    }).join('');
    opts.innerHTML=html;
    opts.querySelectorAll('.fp-frete-opt').forEach(function(o){o.addEventListener('click',function(){selFrete(o,currency,carrier);});});
  }
  function calcFrete(){
    var t=FP.t, cepEl=document.getElementById('fpCep'), opts=document.getElementById('fpFreteOpts'); if(!opts||!cepEl)return;
    var v=(cepEl.value||'').replace(/[^0-9A-Za-z]/g,''); var minLen=(FP.region==='BR')?8:4;
    if(v.length<minLen){ opts.innerHTML='<div class="fp-frete-msg" style="color:#d98a82">'+t('frete.invalid')+'</div>'; FP.frete=null; return; }
    var itens=_freteItens();
    if(!itens.length){ opts.innerHTML='<div class="fp-frete-msg" style="color:#d98a82">'+t('frete.emptyCart')+'</div>'; return; }
    var paisEl=document.getElementById('fpFretePaisSel');
    var country=(FP.region==='BR')?'BR':((paisEl&&paisEl.value)||FP.geoCountry||'BE');
    opts.innerHTML='<div class="fp-frete-msg">'+t('frete.calculating')+'</div>';
    var API=(typeof API_FUNPARTS!=='undefined')?API_FUNPARTS:'https://funparts-ai-proxy.rodox1209.workers.dev';
    fetch(API+'/frete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({region:FP.region,country:country,postal_code:v,items:itens})})
      .then(function(r){return r.json();})
      .then(function(d){ if(d&&d.ok){ renderOpcoes(d.carrier,CFG[FP.region].symbol,d.options||[]); } else { opts.innerHTML='<div class="fp-frete-msg" style="color:#d98a82">'+((d&&d.erro)||t('frete.fail'))+'</div>'; } })
      .catch(function(){ opts.innerHTML='<div class="fp-frete-msg" style="color:#d98a82">'+t('frete.fail')+'</div>'; });
  }
  function selFrete(o,currency,carrier){
    document.querySelectorAll('#fpFreteOpts .fp-frete-opt').forEach(function(x){x.classList.remove('on');});
    o.classList.add('on');
    FP.frete={price:parseFloat(o.getAttribute('data-preco')),label:o.getAttribute('data-nome'),carrier:carrier||'',currency:currency||CFG[FP.region].symbol,region:FP.region};
    var sym=currency||CFG[FP.region].symbol, sub=(typeof _cartTotal==='function')?_cartTotal():0, tot=sub+FP.frete.price;
    var old=document.getElementById('fpFreteTot'); if(old)old.remove();
    var d=document.createElement('div'); d.className='fp-frete-tot'; d.id='fpFreteTot';
    d.innerHTML='<span>'+FP.t('frete.totalShip')+'</span><span>'+sym+' '+fmt(tot)+'</span>';
    document.getElementById('fpFreteOpts').appendChild(d);
  }
  function injetaFrete(){
    var foot=document.getElementById('cartFoot'); if(!foot||document.getElementById('fpFrete'))return;
    var box=document.createElement('div'); box.className='fp-frete'; box.id='fpFrete';
    var paisOpts=FRETE_EU_PAISES.map(function(p){return '<option value="'+p[0]+'">'+p[1]+'</option>';}).join('');
    box.innerHTML='<div class="fp-frete-h"><span>ÃÂ°ÃÂÃÂÃÂ</span> <span id="fpFreteT"></span></div>'
      +'<div id="fpFretePais" style="display:none;margin-bottom:8px"><select id="fpFretePaisSel" style="width:100%;background:#101010;border:1px solid #2c2c2c;color:#eee;border-radius:8px;padding:9px 11px;font-family:inherit;font-size:13px">'+paisOpts+'</select></div>'
      +'<div class="fp-frete-row"><input id="fpCep" inputmode="numeric" maxlength="9" autocomplete="postal-code"><button id="fpCalcBtn" type="button"></button></div>'
      +'<div id="fpFreteOpts"></div>'
      +'<div class="fp-frete-note" id="fpFreteNote"></div>';
    var btnGo=foot.querySelector('.btn-cart-go');
    if(btnGo)foot.insertBefore(box,btnGo); else foot.appendChild(box);
    document.getElementById('fpCalcBtn').addEventListener('click',calcFrete);
    document.getElementById('fpCep').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();calcFrete();}});
    var ps=document.getElementById('fpFretePaisSel'); if(ps&&FP.geoCountry){ for(var k=0;k<ps.options.length;k++){ if(ps.options[k].value===FP.geoCountry){ps.selectedIndex=k;break;} } }
    atualizaFreteLabels();
  }
  window.FP.resetFrete=resetFrete; window.FP.atualizaFreteLabels=atualizaFreteLabels; window.FP.injetaFrete=injetaFrete;

  function posicionaSeletor(){
    var cb=document.getElementById('cartBtn'), fp=document.getElementById('fpLang');
    if(!cb||!fp)return;
    var cs=getComputedStyle(cb);
    if(cs.position==='absolute'){
      var cbW=cb.getBoundingClientRect().width;
      var cbRight=parseFloat(cs.right)||22;
      fp.style.right=Math.round(cbRight+cbW+12)+'px';
    }
  }
  function init(){
    montaSeletor();
    injetaFrete();
    posicionaSeletor();
    window.addEventListener('resize',posicionaSeletor);
    setTimeout(posicionaSeletor,300);
    var sl=null,sr=null; try{sl=localStorage.getItem('fp_lang');sr=localStorage.getItem('fp_region');}catch(e){}
    if(sl&&sr&&CFG[sr]){ FP.lang=sl; FP.region=sr; aplicar(); return; }
    aplicar(); // PT enquanto detecta
    fetch('/cdn-cgi/trace',{cache:'no-store'}).then(function(r){return r.text();}).then(function(txt){
      var cc=(txt.match(/loc=([A-Z]{2})/)||[])[1]; FP.geoCountry=cc||null;
      var reg=regiaoDe(cc); FP.region=reg; FP.lang=CFG[reg].lang; save(); aplicar();
    }).catch(function(){});
  }
  if(document.readyState!=='loading')init(); else document.addEventListener('DOMContentLoaded',init);
})();

/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ CUPOM DE DESCONTO (carrinho) ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
   Inline para nÃÂ£o depender de novo deploy do app_1.js.
   Valida no Worker (/cupom), aplica o desconto no total (fonte ÃÂºnica = _cartTotal)
   e injeta o cÃÂ³digo no POST /pedido para o servidor recalcular e contar o uso. */
(function(){
  var API=(typeof API_FUNPARTS!=='undefined')?API_FUNPARTS:'https://funparts-ai-proxy.rodox1209.workers.dev';
  var LS='fp_cupom_v1';
  window._cupom=null;
  var L={
    pt:{title:'Cupom de desconto',ph:'Digite seu cupom',apply:'Aplicar',remove:'remover',applied:'aplicado',freeship:'+ frete grÃÂ¡tis',invalid:'Cupom invÃÂ¡lido',checking:'VerificandoÃ¢ÂÂ¦',empty:'Informe um cupom'},
    en:{title:'Discount coupon',ph:'Enter your coupon',apply:'Apply',remove:'remove',applied:'applied',freeship:'+ free shipping',invalid:'Invalid coupon',checking:'CheckingÃ¢ÂÂ¦',empty:'Enter a coupon'}
  };
  function lg(k){var l=(window.FP&&FP.lang==='en')?'en':'pt';return (L[l]&&L[l][k])||L.pt[k];}
  function sym(){return (window.CFG&&window.FP&&CFG[FP.region])?CFG[FP.region].symbol:'R$';}
  function fmt(v){var l=(window.FP&&FP.lang==='en')?'en-US':'pt-BR';return Number(v||0).toLocaleString(l,{minimumFractionDigits:2,maximumFractionDigits:2});}
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}

  var _subOrig=window._cartTotal;                 // total ORIGINAL (sem desconto)
  function subtotalBruto(){ return (typeof _subOrig==='function')?(Number(_subOrig())||0):0; }
  function descontoDe(sub){
    if(!window._cupom)return 0;
    var c=window._cupom;
    var d=(c.tipo==='fixo')?Math.min(Number(c.valor)||0,sub):(sub*(Number(c.valor)||0)/100);
    d=Math.round(d*100)/100; if(d>sub)d=sub; if(d<0)d=0; return d;
  }
  // a partir daqui _cartTotal ÃÂ© o total COM desconto (o site inteiro passa a usar este)
  window._cartTotal=function(){ var s=subtotalBruto(); return Math.max(0,Math.round((s-descontoDe(s))*100)/100); };
  window._cupomDesconto=function(){ return descontoDe(subtotalBruto()); };

  // acabamento: valores inteiros ficam limpos (R$ 689); com desconto fracionado mostra 2 casas (R$ 620,10)
  var _obrl=window._brlCart;
  window._brlCart=function(v){
    var n=Number(v||0);
    if(Number.isInteger(n)) return (typeof _obrl==='function')?_obrl(n):('R$ '+n.toLocaleString('pt-BR'));
    return 'R$ '+n.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  };

  function salvar(){ try{ if(window._cupom)localStorage.setItem(LS,JSON.stringify(window._cupom)); else localStorage.removeItem(LS);}catch(e){} }

  function boxHTML(){
    if(window._cupom){
      var c=window._cupom, desc=descontoDe(subtotalBruto());
      return '<div class="fp-cup-h"><span>ÃÂ°ÃÂÃÂÃÂÃÂ¯ÃÂ¸ÃÂ</span> '+lg('title')+'</div>'
        +'<div class="fp-cup-applied"><div class="fp-cup-tag">'+esc(c.codigo)+' '+lg('applied')
          +(c.frete_gratis?' <em>'+lg('freeship')+'</em>':'')+'</div>'
          +'<div class="fp-cup-val">ÃÂ¢ÃÂÃÂ '+sym()+' '+fmt(desc)+'</div>'
          +'<button type="button" class="fp-cup-rm" id="fpCupRm">'+lg('remove')+'</button></div>';
    }
    return '<div class="fp-cup-h"><span>ÃÂ°ÃÂÃÂÃÂÃÂ¯ÃÂ¸ÃÂ</span> '+lg('title')+'</div>'
      +'<div class="fp-cup-row"><input id="fpCupIn" autocomplete="off" placeholder="'+esc(lg('ph'))+'" style="text-transform:uppercase"><button type="button" id="fpCupBtn">'+lg('apply')+'</button></div>'
      +'<div class="fp-cup-msg" id="fpCupMsg"></div>';
  }
  function montaBox(){
    var foot=document.getElementById('cartFoot'); if(!foot)return null;
    var box=document.getElementById('fpCup');
    if(!box){ box=document.createElement('div'); box.className='fp-cup'; box.id='fpCup';
      var fre=document.getElementById('fpFrete'), note=foot.querySelector('.cart-note');
      var ref=fre||note; if(ref)foot.insertBefore(box,ref); else foot.appendChild(box);
    }
    return box;
  }
  function bind(){
    var b=document.getElementById('fpCupBtn'); if(b)b.onclick=aplicar;
    var inp=document.getElementById('fpCupIn'); if(inp)inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();aplicar();}});
    var rm=document.getElementById('fpCupRm'); if(rm)rm.onclick=remover;
  }
  function render(){
    var box=montaBox(); if(!box)return;
    if(!window.CART||!CART.length){ box.style.display='none'; return; }
    box.style.display=''; box.innerHTML=boxHTML(); bind();
  }
  window._renderCupomBox=render;
  function msg(txt,cor){ var m=document.getElementById('fpCupMsg'); if(m){m.textContent=txt||'';m.style.color=cor||'#8a8a8a';} }

  function aplicar(){
    var inp=document.getElementById('fpCupIn'); if(!inp)return;
    var cod=(inp.value||'').trim(); if(!cod){msg(lg('empty'),'#d98a82');return;}
    var btn=document.getElementById('fpCupBtn'); if(btn)btn.disabled=true; msg(lg('checking'));
    fetch(API+'/cupom',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({codigo:cod,subtotal:subtotalBruto()})})
      .then(function(r){return r.json();})
      .then(function(d){
        if(btn)btn.disabled=false;
        if(d&&d.ok){ window._cupom={codigo:d.codigo,tipo:d.tipo,valor:d.valor,frete_gratis:!!d.frete_gratis}; salvar(); atualizaTudo(); }
        else { msg((d&&d.erro)||lg('invalid'),'#d98a82'); }
      }).catch(function(){ if(btn)btn.disabled=false; msg(lg('invalid'),'#d98a82'); });
  }
  function remover(){ window._cupom=null; salvar(); atualizaTudo(); }

  function atualizaTudo(){
    render();
    if(typeof window._cartRender==='function')window._cartRender();
    var t2=document.getElementById('cartTotal2'); if(t2&&typeof _brlCart==='function')t2.textContent=_brlCart(_cartTotal());
    var sel=document.querySelector('#fpFreteOpts .fp-frete-opt.on'); if(sel)sel.click(); // recomputa "Total com frete"
  }

  // re-renderiza a caixa sempre que o carrinho ÃÂ© redesenhado
  var _cr=window._cartRender;
  window._cartRender=function(){ if(typeof _cr==='function')_cr.apply(this,arguments); render(); };

  // injeta o cupom no POST /pedido (o app_1.js nÃÂ£o conhece o cupom)
  var _of=window.fetch;
  window.fetch=function(input,init){
    try{
      var u=(typeof input==='string')?input:(input&&input.url)||'';
      if(init&&init.method&&String(init.method).toUpperCase()==='POST'&&init.body&&u.indexOf('/pedido')>=0){
        var b=JSON.parse(init.body);
        if(b&&Array.isArray(b.itens)){
          if(window._cupom)b.cupom=window._cupom.codigo;
          if(window.FP&&FP.frete&&FP.frete.price!=null){ b.frete={label:FP.frete.label,price:FP.frete.price,carrier:FP.frete.carrier||'',currency:FP.frete.currency||'R$'}; }
          init=Object.assign({},init,{body:JSON.stringify(b)});
        }
      }
    }catch(e){}
    return _of.call(this,input,init);
  };

  function revalida(cod){
    fetch(API+'/cupom',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({codigo:cod,subtotal:subtotalBruto()})})
      .then(function(r){return r.json();}).then(function(d){
        if(d&&d.ok){ window._cupom={codigo:d.codigo,tipo:d.tipo,valor:d.valor,frete_gratis:!!d.frete_gratis}; }
        else { window._cupom=null; salvar(); }
        atualizaTudo();
      }).catch(function(){});
  }
  function init(){
    try{ var s=localStorage.getItem(LS); if(s){ var c=JSON.parse(s); if(c&&c.codigo){ window._cupom=c; revalida(c.codigo); } } }catch(e){}
    render();
  }
  if(document.readyState!=='loading')setTimeout(init,250); else document.addEventListener('DOMContentLoaded',function(){setTimeout(init,250);});
})();

/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ FRETE na mensagem do WhatsApp (fechamento) ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
   Injeta a transportadora escolhida + "Total com frete" na mensagem, sem tocar no app_1.js. */
(function(){
  var _open=window.open;
  var CN={superfrete:'SuperFrete',melhorenvio:'Melhor Envio',sendcloud:'Sendcloud'};
  function fmtM(v,sym){ return (sym||'R$')+' '+Number(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}); }
  function bloco(){
    var f=(window.FP&&FP.frete)?FP.frete:null; if(!f||f.price==null)return '';
    var sym=f.currency||'R$'; var carr=(CN[f.carrier]||f.carrier||'').toString().trim();
    var nome=(carr?carr+' ÃÂ· ':'')+(f.label||'');
    var sub=(typeof _cartTotal==='function')?_cartTotal():0;
    var b='\n*Frete:* '+nome+' Ã¢ÂÂ '+fmtM(f.price,sym);
    if(sym==='R$') b+='\n*Total com frete:* '+fmtM(sub+Number(f.price),sym);
    return b;
  }
  function injURL(url){
    try{
      if(typeof url!=='string'||!/wa\.me|api\.whatsapp/.test(url)||url.indexOf('text=')<0)return url;
      var b=bloco(); if(!b)return url;
      var i=url.indexOf('text=')+5, pre=url.slice(0,i), txt=decodeURIComponent(url.slice(i));
      if(txt.indexOf('*Frete:*')>=0)return url;
      if(txt.indexOf('\n\nDetalhes e imagens:')>=0) txt=txt.replace('\n\nDetalhes e imagens:', b+'\n\nDetalhes e imagens:');
      else if(txt.indexOf('*MEUS DADOS*')>=0) txt=txt.replace('*MEUS DADOS*', b.replace(/^\n/,'')+'\n\n*MEUS DADOS*');
      else txt=txt+'\n'+b.replace(/^\n/,'');
      return pre+encodeURIComponent(txt);
    }catch(e){return url;}
  }
  window.open=function(u,name,feat){
    if(typeof u==='string' && /wa\.me|api\.whatsapp/.test(u)) u=injURL(u);
    var w=_open.call(window,u,name,feat);
    if((u===''||u==null) && w){
      try{
        return {
          _real:w,
          get closed(){ try{return w.closed;}catch(e){return false;} },
          focus:function(){ try{w.focus();}catch(e){} },
          close:function(){ try{w.close();}catch(e){} },
          get location(){ return { set href(url){ try{ w.location.href=injURL(url); }catch(e){ try{w.location.href=url;}catch(_){} } }, get href(){ try{return w.location.href;}catch(e){return '';} } }; }
        };
      }catch(e){ return w; }
    }
    return w;
  };
})();

/* Bloqueia clique direto nas etapas do topo (stepper).
   O cliente ÃÂ© forÃÂ§ado a seguir o passo a passo: navega sÃÂ³ pelos botÃÂµes "PrÃÂ³ximo Ã¢ÂÂ" e "Ã¢ÂÂ Voltar". */
(function(){
  document.addEventListener('click', function(e){
    var t=e.target; var tab=(t&&t.closest)?t.closest('.stab'):null;
    if(tab){ e.preventDefault(); e.stopPropagation(); }
  }, true);
  document.addEventListener('keydown', function(e){
    // impede ativar a etapa por teclado (Enter/EspaÃÂ§o) caso esteja focada
    if((e.key==='Enter'||e.key===' ')&&document.activeElement&&document.activeElement.closest&&document.activeElement.closest('.stab')){ e.preventDefault(); e.stopPropagation(); }
  }, true);
  var st=document.createElement('style');
  st.textContent='.stab{cursor:default!important;}';
  (document.head||document.documentElement).appendChild(st);
})();

/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ Galeria do produto (Quadro com miniatura): 4 miniaturas SEMPRE coladas ÃÂ  imagem principal ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
   Antes o box da imagem "esticava" (flex:1) e centralizava a foto numa ÃÂ¡rea alta, deixando as
   miniaturas grudadas na base (vÃÂ£o grande em telas maiores). Agora imagem + miniaturas viram um
   bloco ÃÂºnico, centralizado, com as fotinhas logo abaixo Ã¢ÂÂ igual em qualquer resoluÃÂ§ÃÂ£o. */
(function(){
  if(typeof window._catGaleriaHTML!=='function')return;
  window._catGaleriaHTML=function(soFoto){
    var idx=(window.S&&S.incFotoIdx)||0;
    var _F=(typeof _catFotos==='function')?_catFotos():[];
    var thumbs=soFoto?'':_F.map(function(f,k){
      return '<img src="'+f+'" data-th="'+k+'" onclick="trocarFotoIncluso('+k+')" style="width:74px;height:58px;object-fit:cover;border-radius:6px;cursor:pointer;flex-shrink:0;border:2px solid '+(k===idx?'#e07b00':'transparent')+';">';
    }).join('');
    var _mobG=window.innerWidth<=720;
    var _wrap=_mobG
      ? 'width:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:10px;'
      : 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:12px;';
    // box da imagem NÃÂO cresce (flex:0) -> a foto encosta nas miniaturas e o bloco fica centralizado
    var _box=_mobG
      ? 'width:100%;display:flex;align-items:flex-start;justify-content:center;'
      : 'flex:0 1 auto;min-height:0;width:100%;display:flex;align-items:center;justify-content:center;';
    /* ALTURA MAXIMA DA FOTO NO DESKTOP: 682 px.
       Antes era max-height:100%. Porcentagem de altura so vale quando o pai
       tem altura definida, e aqui ele nao tem -- entao aquele limite nunca
       valeu de nada: medi a foto com 1.280 px de altura numa tela de 1.200.
       Um numero fixo nao depende do pai e e' o que o Rodolfo pediu.
       O CELULAR NAO MUDA: continua com os 46vh de sempre. */
    var _img=_mobG
      ? 'width:100%;max-height:46vh;object-fit:contain;border-radius:10px;display:block;'
      : 'max-width:100%;max-height:682px;object-fit:contain;border-radius:10px;display:block;';
    return '<div style="'+_wrap+'">'
      +'<div style="'+_box+'">'
      +'<img id="catMainPhoto" src="'+(_F[idx]||_F[0]||'')+'" style="'+_img+'">'
      +'</div>'
      +'<div id="catThumbs" style="display:flex;flex-direction:row;flex-wrap:wrap;justify-content:center;gap:8px;flex-shrink:0;width:100%;">'+thumbs+'</div>'
      +'</div>';
  };
})();

/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ Imagem de entrada (home/Tipo): ancorar no topo, perto do menu ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
   Antes #heroImg centralizava vertical (align-items:center;height:100%), entÃÂ£o em monitores
   mais verticais a imagem descia demais. Agora fica colada ao topo, prÃÂ³xima do menu, em qualquer tela. */
(function(){
  function anchorHero(){
    var h=document.getElementById('heroImg');
    if(h){ h.style.alignItems='flex-start'; h.style.paddingTop='30px'; }
  }
  if(document.readyState!=='loading')anchorHero(); else document.addEventListener('DOMContentLoaded',anchorHero);
  // reforÃÂ§a caso o painel seja re-renderizado ao voltar pra home
  setTimeout(anchorHero,400);
})();

/* ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ Ancoragem geral no topo: coluna esquerda (todas as etapas) + resumo/TOTAL do checkout ÃÂ¢ÃÂÃÂÃÂ¢ÃÂÃÂ
   1) .pv-panel usava justify-content:center -> em monitores altos/verticais todo preview da
      esquerda (produto, LEGO, Mini, preview em tempo real) descia demais. Agora cola no topo,
      logo abaixo do menu superior, em qualquer resoluÃÂ§ÃÂ£o.
   2) #cartForm (dados do cliente) tinha flex:1 e crescia, empurrando o bloco TOTAL/botÃÂ£o do
      WhatsApp para o rodapÃÂ©. Agora o form nÃÂ£o estica (flex:0 1 auto): o resumo/TOTAL fica
      colado logo apÃÂ³s o ÃÂºltimo campo. Se a tela for baixa, o form rola normalmente. */
(function(){
  var css=''
    + '.pv-panel{justify-content:flex-start!important;}'
    + '#cartForm.cart-body{flex:0 1 auto!important;}'
    // Previews de altura fixa (fluxo LEGO/Miniatura) encostavam a imagem no centro do painel.
    // Com height:auto o container "abraÃÂ§a" a imagem e o .pv-panel (flex-start) o cola no topo.
    // O texto sobreposto do #legoHeroImg (top:50%) passa a centralizar na prÃÂ³pria imagem.
    + '#legoHeroImg,#miniHeroImg,#miniStep1HeroImg{height:auto!important;align-items:flex-start!important;}'
    // Pares de preview (catÃÂ¡logo Produto e "somente quadro" Detalhamento): o app coloca o
    // .pv-panel em row com align-items:center, o que centralizava verticalmente o bloco
    // "homem + quadro". No modo row: centraliza na HORIZONTAL e ancora no TOPO (junto ao menu).
    + '.pv-panel[style*="flex-direction: row"]{justify-content:center!important;align-items:flex-start!important;}';
  var st=document.createElement('style');
  st.setAttribute('data-fp','anchor-top');
  st.textContent=css;
  (document.head||document.documentElement).appendChild(st);
})();

;(function(){
'use strict';
if(typeof window.FP_traduzTudo!=='function')return;
var _orig=window.FP_traduzTudo;

/* Ã¢ÂÂÃ¢ÂÂ PT to EN text-node map (keys are trimmed text-node content) Ã¢ÂÂÃ¢ÂÂ */
var EN={
  'Carrinho':'Cart',
  'Seu carrinho estÃÂ¡ vazio.':'Your cart is empty.',
  'Monte um quadro e adicione aqui.':'Build a frame and add it here.',
  'Pedido':'Order',
  'PERSONALIZAR QUADRO':'CUSTOMIZE FRAME',
  'Selecione a marca...':'Select brand...',
  '\u26a0 ATEN\u00C7\u00C3O: MINIATURA N\u00C3O INCLUSA':'\u26a0 NOTICE: MINIATURE NOT INCLUDED',
  'Esta op\u00E7\u00E3o de personaliza\u00E7\u00E3o refere-se exclusivamente \u00E0 produ\u00E7\u00E3o do quadro. A miniatura diecast exibida nas imagens (via intelig\u00EAncia artificial) n\u00E3o acompanha o produto e n\u00E3o est\u00E1 inclusa na compra.':'This customization option refers exclusively to the production of the frame. The diecast miniature shown in the images (via artificial intelligence) does not accompany the product and is not included in the purchase.',
  'Este servi\u00E7o \u00E9 destinado a clientes que j\u00E1 possuem a pr\u00F3pria miniatura e desejam transform\u00E1-la em uma pe\u00E7a decorativa exclusiva, fixando-a na parede de maneira inovadora e elegante.':'This service is intended for customers who already own their own miniature and wish to transform it into an exclusive decorative piece, mounting it on the wall in an innovative and elegant way.',
  'O quadro ser\u00E1 enviado pronto para que voc\u00EA fa\u00E7a a instala\u00E7\u00E3o da miniatura utilizando parafusos, de forma simples e pr\u00E1tica. O kit inclui: quadro personalizado, buchas, parafusos e gabarito de instala\u00E7\u00E3o, facilitando tanto a fixa\u00E7\u00E3o da miniatura no quadro quanto a instala\u00E7\u00E3o do quadro na parede.':'The frame will be shipped ready for you to install the miniature using screws, in a simple and practical manner. The kit includes: custom frame, wall plugs, screws, and an installation template \u2014 making it easy to both mount the miniature to the frame and hang the frame on the wall.',
  'Verifica\u00E7\u00E3o de disponibilidade':'Availability check',
  'Miniaturas dispon\u00EDveis no mercado s\u00E3o fornecidas em die-cast (ferro fundido) nas escalas 1:18 ou 1:24.':'Miniatures available on the market are supplied in die-cast (iron) at 1:18 or 1:24 scale.',
  'Modelos raros ou exclusivos s\u00E3o produzidos via':'Rare or exclusive models are produced via',
  'impress\u00E3o 3D + pintura automotiva':'3D printing + automotive paint',
  'Disponibilidade da miniatura':'Miniature availability',
  'Personaliza\u00E7\u00E3o da miniatura':'Miniature customization',
  'Especifica\u00E7\u00F5es da miniatura e do quadro':'Miniature and frame specifications',
  'Dimens\u00E3o da miniatura':'Miniature dimensions',
  'Dimens\u00E3o do quadro':'Frame dimensions',
  'Set Selecionado':'Selected Set',
  '\uD83D\uDCE6 Quadro + Miniatura':'\uD83D\uDCE6 Frame + Miniature',
  '\u2708 Todo o Brasil':'\u2708 Across Brazil',
  'N\u00E3o tenho certeza':"I'm not sure",
  'N\u00E3o existe \u2014 modelo exclusivo':"Doesn't exist \u2014 exclusive model",
  'Die-cast 1:18 ou 1:24 \u2014 fundi\u00E7\u00E3o em ferro':'Die-cast 1:18 or 1:24 \u2014 iron casting',
  'Impress\u00E3o 3D com acabamento pintura automotiva':'3D printing with automotive paint finish',
  'Cor personalizada (aerografia)':'Custom color (airbrushing)',
  'Placa personalizada':'Custom license plate',
  'Figura de piloto inclusa':'Pilot figure included',
  '\u2714 Produto pronto para entrega \u00A0\u00B7\u00A0 \u2714 Quadro + Miniatura inclusos \u00A0\u00B7\u00A0 \u2714 Embalagem premium':'\u2714 Ready for delivery \u00A0\u00B7\u00A0 \u2714 Frame + Miniature included \u00A0\u00B7\u00A0 \u2714 Premium packaging',
  'Se escolher essa op\u00E7\u00E3o voc\u00EA ter\u00E1 dois caminhos:':"By choosing this option, you'll have two paths:",
  'Escolher quadros para sua miniatura(s);':'Choose frames for your miniature(s);',
  'Escolher quadros prontos que j\u00E1 contenham miniaturas inclusas.':'Choose ready-made frames that already include miniatures.',
  'Sobre esta visualiza\u00E7\u00E3o':'About this visualization',
  'A imagem do ve\u00EDculo foi gerada por Intelig\u00EAncia Artificial para facilitar a visualiza\u00E7\u00E3o de como a sua miniatura ficar\u00E1 aplicada no quadro.':'The vehicle image was generated by Artificial Intelligence to help visualize how your miniature will look mounted in the frame.',
  'Por esse motivo, alguns detalhes, como rodas, far\u00F3is, tonalidades e acabamentos, podem apresentar pequenas diferen\u00E7as em rela\u00E7\u00E3o \u00E0 miniatura que voc\u00EA possui.':'For this reason, some details such as wheels, headlights, tones, and finishes may show slight differences from the miniature you own.',
  'Nesta etapa, o objetivo principal \u00E9 demonstrar a':'At this stage, the main goal is to show the vehicle\u2019s',
  'propor\u00E7\u00E3o do ve\u00EDculo em rela\u00E7\u00E3o ao quadro':'scale relative to the frame',
  '. Assim, na pr\u00F3xima etapa, voc\u00EA poder\u00E1 comparar os diferentes tamanhos dispon\u00EDveis e escolher com mais seguran\u00E7a o modelo que melhor valoriza e acomoda a sua miniatura.':".\u00A0In the next step, you'll be able to compare the available sizes and confidently choose the option that best showcases and fits your miniature.",
  'Se escolher essa op\u00E7\u00E3o voc\u00EA ter\u00E1':"By choosing this option, you'll have",
  'dezenas de modelos de quadros':'dozens of frame models',
  'para fixar sua miniatura de Lego.':'to mount your Lego miniature.',
  'Observa\u00E7\u00E3o:':'Note:',
  'para Lego.':'frames for Lego.'
};

var PT={};
Object.keys(EN).forEach(function(k){PT[EN[k]]=k;});

function applyMap(map){
  var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
  var n,batch=[];
  while((n=walker.nextNode())){
    var t=n.textContent.trim();
    if(Object.prototype.hasOwnProperty.call(map,t)){
      var orig=n.textContent;
      var lead=orig.match(/^[\s]*/)[0];
      var trail=orig.match(/[\s]*$/)[0];
      batch.push({n:n,v:lead+map[t]+trail});
    }
  }
  batch.forEach(function(x){x.n.textContent=x.v;});
}

function applyLegoSection(lang){
  var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
  var n;
  while((n=walker.nextNode())){
    var t=n.textContent.trim();
    var isTarget=(lang==='en')
      ? (t.indexOf('Produzimos e vendemos apenas os quadros')>=0||t.indexOf('dezenas de modelos de quadros')>=0)
      : (t.indexOf('We only produce and sell')>=0||t.indexOf('dozens of frame models')>=0);
    if(!isTarget)continue;
    var container=n.parentElement;
    for(var i=0;i<5&&container;i++){
      if(container.querySelectorAll('strong').length>=1)break;
      container=container.parentElement;
    }
    if(!container)break;
    var html=container.innerHTML;
    if(lang==='en'){
      container.innerHTML=html
        .replace(/Se escolher essa op\u00E7\u00E3o voc\u00EA ter\u00E1/g,"By choosing this option, you'll have")
        .replace(/dezenas de modelos de quadros/g,'dozens of frame models')
        .replace(/para fixar sua miniatura de Lego\./g,'to mount your Lego miniature.')
        .replace(/Observa\u00E7\u00E3o:/g,'Note:')
        .replace(/Nessa op\u00E7\u00E3o n\u00E3o est\u00E1 incluso a miniatura\. Produzimos e vendemos apenas os quadros/g,'This option does not include the miniature. We only produce and sell')
        .replace(/para Lego\./g,'frames for Lego.');
    } else {
      container.innerHTML=html
        .replace(/By choosing this option, you'll have/g,'Se escolher essa op\u00E7\u00E3o voc\u00EA ter\u00E1')
        .replace(/dozens of frame models/g,'dezenas de modelos de quadros')
        .replace(/to mount your Lego miniature\./g,'para fixar sua miniatura de Lego.')
        .replace(/Note:/g,'Observa\u00E7\u00E3o:')
        .replace(/This option does not include the miniature\. We only produce and sell/g,'Nessa op\u00E7\u00E3o n\u00E3o est\u00E1 incluso a miniatura. Produzimos e vendemos apenas os quadros')
        .replace(/frames for Lego\./g,'para Lego.');
    }
    break;
  }
}

function setEl(id,txt){var el=document.getElementById(id);if(el)el.textContent=txt;}
function setQ(sel,txt){var el=document.querySelector(sel);if(el)el.textContent=txt;}

function applyFpFreteHNode(lang){
  var el=document.querySelector('.fp-frete-h');
  if(!el)return;
  var tw=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  var n;
  while((n=tw.nextNode())){
    var t=n.textContent.trim();
    if(lang==='en'&&t==='Entrega')n.textContent='Delivery';
    else if(lang==='pt'&&t==='Delivery')n.textContent='Entrega';
  }
}

window.FP_traduzTudo=function(lang){
  _orig.call(this,lang);
  if(lang==='en'){
    setEl('fpH2','Region / Delivery');
    setEl('fpFreteT','Shipping / Delivery');
    setEl('fixedTL','\uD83C\uDFC1 Formula 1 Logo \u2014 Top left corner');
    if(window._relevoMsgAplica)window._relevoMsgAplica();
    setQ('#cartBtn .lbl','Cart');
    applyFpFreteHNode('en');
    applyMap(EN);
    applyLegoSection('en');
  } else if(lang==='pt'){
    setEl('fpH2','Regi\u00E3o / Entrega');
    setEl('fpFreteT','Frete / Entrega');
    setEl('fixedTL','\uD83C\uDFC1 Logo F\u00F3rmula 1 \u2014 Canto superior esquerdo');
    if(window._relevoMsgAplica)window._relevoMsgAplica();
    setQ('#cartBtn .lbl','Carrinho');
    applyFpFreteHNode('pt');
    applyMap(PT);
    applyLegoSection('pt');
  }
};
})();

;(function(){
'use strict';
if(typeof window.FP_traduzTudo!=='function')return;
var _orig2=window.FP_traduzTudo;
var EXTRA_EN={
  'Clique no botÃÂ£o':'Click the button',
  ', abaixo e dÃÂª continuidade na experiÃÂªncia':', below and continue the experience',
  'PadrÃÂ£o':'Standard',
  'NÃÂºmero de corrida na carroceria':'Race number on the bodywork',
  'Ã¢ÂÂ± 7Ã¢ÂÂ12 dias ÃÂºteis':'Ã¢ÂÂ± 7Ã¢ÂÂ12 business days',
};
var EXTRA_PT={};
Object.keys(EXTRA_EN).forEach(function(k){EXTRA_PT[EXTRA_EN[k]]=k;});
function applyExtraMap(map){
  var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
  var n,batch=[];
  while((n=walker.nextNode())){
    var t=n.textContent.trim();
    if(Object.prototype.hasOwnProperty.call(map,t)){
      var orig=n.textContent;
      var lead=orig.match(/^[\s]*/)[0];
      var trail=orig.match(/[\s]*$/)[0];
      batch.push({n:n,v:lead+map[t]+trail});
    }
  }
  batch.forEach(function(x){x.n.textContent=x.v;});
}
window.FP_traduzTudo=function(lang){
  _orig2.call(this,lang);
  if(lang==='en')applyExtraMap(EXTRA_EN);
  else if(lang==='pt')applyExtraMap(EXTRA_PT);
};
})();

;(function(){
'use strict';
if(typeof window.FP_traduzTudo!=='function')return;
var _fp_chain=window.FP_traduzTudo;

var ALL_EN={
  'Carrinho':'Cart',
  'Seu carrinho est\u00E1 vazio.':'Your cart is empty.',
  'Monte um quadro e adicione aqui.':'Build a frame and add it here.',
  'Pedido':'Order',
  'PERSONALIZAR QUADRO':'CUSTOMIZE FRAME',
  'Selecione a marca...':'Select brand...',
  '\u26a0 ATEN\u00C7\u00C3O: MINIATURA N\u00C3O INCLUSA':'\u26a0 NOTICE: MINIATURE NOT INCLUDED',
  'Esta op\u00E7\u00E3o de personaliza\u00E7\u00E3o refere-se exclusivamente \u00E0 produ\u00E7\u00E3o do quadro. A miniatura diecast exibida nas imagens (via intelig\u00EAncia artificial) n\u00E3o acompanha o produto e n\u00E3o est\u00E1 inclusa na compra.':'This customization option refers exclusively to the production of the frame. The diecast miniature shown in the images (via artificial intelligence) does not accompany the product and is not included in the purchase.',
  'Este servi\u00E7o \u00E9 destinado a clientes que j\u00E1 possuem a pr\u00F3pria miniatura e desejam transform\u00E1-la em uma pe\u00E7a decorativa exclusiva, fixando-a na parede de maneira inovadora e elegante.':'This service is intended for customers who already own their own miniature and wish to transform it into an exclusive decorative piece, mounting it on the wall in an innovative and elegant way.',
  'O quadro ser\u00E1 enviado pronto para que voc\u00EA fa\u00E7a a instala\u00E7\u00E3o da miniatura utilizando parafusos, de forma simples e pr\u00E1tica. O kit inclui: quadro personalizado, buchas, parafusos e gabarito de instala\u00E7\u00E3o, facilitando tanto a fixa\u00E7\u00E3o da miniatura no quadro quanto a instala\u00E7\u00E3o do quadro na parede.':'The frame will be shipped ready for you to install the miniature using screws, in a simple and practical manner. The kit includes: custom frame, wall plugs, screws, and an installation template \u2014 making it easy to both mount the miniature to the frame and hang the frame on the wall.',
  'Verifica\u00E7\u00E3o de disponibilidade':'Availability check',
  'Miniaturas dispon\u00EDveis no mercado s\u00E3o fornecidas em die-cast (ferro fundido) nas escalas 1:18 ou 1:24.':'Miniatures available on the market are supplied in die-cast (iron) at 1:18 or 1:24 scale.',
  'Modelos raros ou exclusivos s\u00E3o produzidos via':'Rare or exclusive models are produced via',
  'impress\u00E3o 3D + pintura automotiva':'3D printing + automotive paint',
  'Disponibilidade da miniatura':'Miniature availability',
  'Personaliza\u00E7\u00E3o da miniatura':'Miniature customization',
  'Especifica\u00E7\u00F5es da miniatura e do quadro':'Miniature and frame specifications',
  'Dimens\u00E3o da miniatura':'Miniature dimensions',
  'Dimens\u00E3o do quadro':'Frame dimensions',
  'Set Selecionado':'Selected Set',
  '\uD83D\uDCE6 Quadro + Miniatura':'\uD83D\uDCE6 Frame + Miniature',
  '\u2708 Todo o Brasil':'\u2708 Across Brazil',
  'N\u00E3o tenho certeza':"I'm not sure",
  'N\u00E3o existe \u2014 modelo exclusivo':"Doesn't exist \u2014 exclusive model",
  'Die-cast 1:18 ou 1:24 \u2014 fundi\u00E7\u00E3o em ferro':'Die-cast 1:18 or 1:24 \u2014 iron casting',
  'Impress\u00E3o 3D com acabamento pintura automotiva':'3D printing with automotive paint finish',
  'Cor personalizada (aerografia)':'Custom color (airbrushing)',
  'Placa personalizada':'Custom license plate',
  'Figura de piloto inclusa':'Pilot figure included',
  '\u2714 Produto pronto para entrega \u00A0\u00B7\u00A0 \u2714 Quadro + Miniatura inclusos \u00A0\u00B7\u00A0 \u2714 Embalagem premium':'\u2714 Ready for delivery \u00A0\u00B7\u00A0 \u2714 Frame + Miniature included \u00A0\u00B7\u00A0 \u2714 Premium packaging',
  'Se escolher essa op\u00E7\u00E3o voc\u00EA ter\u00E1 dois caminhos:':"By choosing this option, you'll have two paths:",
  'Escolher quadros para sua miniatura(s);':'Choose frames for your miniature(s);',
  'Escolher quadros prontos que j\u00E1 contenham miniaturas inclusas.':'Choose ready-made frames that already include miniatures.',
  'Sobre esta visualiza\u00E7\u00E3o':'About this visualization',
  'A imagem do ve\u00EDculo foi gerada por Intelig\u00EAncia Artificial para facilitar a visualiza\u00E7\u00E3o de como a sua miniatura ficar\u00E1 aplicada no quadro.':'The vehicle image was generated by Artificial Intelligence to help visualize how your miniature will look mounted in the frame.',
  'Por esse motivo, alguns detalhes, como rodas, far\u00F3is, tonalidades e acabamentos, podem apresentar pequenas diferen\u00E7as em rela\u00E7\u00E3o \u00E0 miniatura que voc\u00EA possui.':'For this reason, some details such as wheels, headlights, tones, and finishes may show slight differences from the miniature you own.',
  'Nesta etapa, o objetivo principal \u00E9 demonstrar a':'At this stage, the main goal is to show the vehicle\u2019s',
  'propor\u00E7\u00E3o do ve\u00EDculo em rela\u00E7\u00E3o ao quadro':'scale relative to the frame',
  '. Assim, na pr\u00F3xima etapa, voc\u00EA poder\u00E1 comparar os diferentes tamanhos dispon\u00EDveis e escolher com mais seguran\u00E7a o modelo que melhor valoriza e acomoda a sua miniatura.':".\u00A0In the next step, you'll be able to compare the available sizes and confidently choose the option that best showcases and fits your miniature.",
  'Se escolher essa op\u00E7\u00E3o voc\u00EA ter\u00E1':"By choosing this option, you'll have",
  'dezenas de modelos de quadros':'dozens of frame models',
  'para fixar sua miniatura de Lego.':'to mount your Lego miniature.',
  'Observa\u00E7\u00E3o:':'Note:',
  'para Lego.':'frames for Lego.',
  'Clique no bot\u00E3o':'Click the button',
  ', abaixo e d\u00EA continuidade na experi\u00EAncia':', below and continue the experience',
  'Padr\u00E3o':'Standard',
  'N\u00FAmero de corrida na carroceria':'Race number on the bodywork',
  '\u23F1 7\u201312 dias \u00FAteis':'\u23F1 7\u201312 business days',
};

var ALL_PT={};
Object.keys(ALL_EN).forEach(function(k){ALL_PT[ALL_EN[k]]=k;});

function setEl(id,txt){var el=document.getElementById(id);if(el)el.textContent=txt;}
function setQ(sel,txt){var el=document.querySelector(sel);if(el)el.textContent=txt;}

function applyMap(map){
  var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
  var n,batch=[];
  while((n=walker.nextNode())){
    var t=n.textContent.trim();
    if(Object.prototype.hasOwnProperty.call(map,t)){
      var orig=n.textContent;
      var lead=orig.match(/^[\s]*/)[0];
      var trail=orig.match(/[\s]*$/)[0];
      batch.push({n:n,v:lead+map[t]+trail});
    }
  }
  batch.forEach(function(x){x.n.textContent=x.v;});
}

function applyLegoSection(lang){
  var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
  var n;
  while((n=walker.nextNode())){
    var t=n.textContent.trim();
    var isTarget=(lang==='en')
      ?(t.indexOf('Produzimos e vendemos apenas os quadros')>=0||t.indexOf('dezenas de modelos de quadros')>=0)
      :(t.indexOf('We only produce and sell')>=0||t.indexOf('dozens of frame models')>=0);
    if(!isTarget)continue;
    var container=n.parentElement;
    for(var i=0;i<5&&container;i++){
      if(container.querySelectorAll('strong').length>=1)break;
      container=container.parentElement;
    }
    if(!container)break;
    var html=container.innerHTML;
    if(lang==='en'){
      container.innerHTML=html
        .replace(/Se escolher essa op\u00E7\u00E3o voc\u00EA ter\u00E1/g,"By choosing this option, you'll have")
        .replace(/dezenas de modelos de quadros/g,'dozens of frame models')
        .replace(/para fixar sua miniatura de Lego\./g,'to mount your Lego miniature.')
        .replace(/Observa\u00E7\u00E3o:/g,'Note:')
        .replace(/Nessa op\u00E7\u00E3o n\u00E3o est\u00E1 incluso a miniatura\. Produzimos e vendemos apenas os quadros/g,'This option does not include the miniature. We only produce and sell')
        .replace(/para Lego\./g,'frames for Lego.');
    } else {
      container.innerHTML=html
        .replace(/By choosing this option, you'll have/g,'Se escolher essa op\u00E7\u00E3o voc\u00EA ter\u00E1')
        .replace(/dozens of frame models/g,'dezenas de modelos de quadros')
        .replace(/to mount your Lego miniature\./g,'para fixar sua miniatura de Lego.')
        .replace(/Note:/g,'Observa\u00E7\u00E3o:')
        .replace(/This option does not include the miniature\. We only produce and sell/g,'Nessa op\u00E7\u00E3o n\u00E3o est\u00E1 incluso a miniatura. Produzimos e vendemos apenas os quadros')
        .replace(/frames for Lego\./g,'para Lego.');
    }
    break;
  }
}

function applyFpFreteHNode(lang){
  var el=document.querySelector('.fp-frete-h');
  if(!el)return;
  var tw=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  var n;
  while((n=tw.nextNode())){
    var t=n.textContent.trim();
    if(lang==='en'&&t==='Entrega')n.textContent='Delivery';
    else if(lang==='pt'&&t==='Delivery')n.textContent='Entrega';
  }
}

window.FP_traduzTudo=function(lang){
  /* chama a cadeia original Ã¢ÂÂ ignora erro de TreeWalker do original */
  try{_fp_chain.call(window,lang);}catch(e){}
  try{ if(window._relevoMsgAplica)window._relevoMsgAplica(); }catch(e){}
  /* reaplica nossas traduÃÂ§ÃÂµes de forma garantida */
  if(lang==='en'){
    setEl('fpH2','Region / Delivery');
    setEl('fpFreteT','Shipping / Delivery');
    setEl('fixedTL','\uD83C\uDFC1 Formula 1 Logo \u2014 Top left corner');
    if(window._relevoMsgAplica)window._relevoMsgAplica();
    setQ('#cartBtn .lbl','Cart');
    applyFpFreteHNode('en');
    applyMap(ALL_EN);
    applyLegoSection('en');
  } else if(lang==='pt'){
    setEl('fpH2','Regi\u00E3o / Entrega');
    setEl('fpFreteT','Frete / Entrega');
    setEl('fixedTL','\uD83C\uDFC1 Logo F\u00F3rmula 1 \u2014 Canto superior esquerdo');
    if(window._relevoMsgAplica)window._relevoMsgAplica();
    setQ('#cartBtn .lbl','Carrinho');
    applyFpFreteHNode('pt');
    applyMap(ALL_PT);
    applyLegoSection('pt');
  }
};
})();

;(function(){
'use strict';
if(typeof window.FP_traduzTudo!=='function')return;
var _p4=window.FP_traduzTudo;
var _lang4='pt';
var _tmr4=null;

/* Full EN map: all patch3 entries + new dynamic-content entries */
var EN4={
  'Carrinho':'Cart',
  'Seu carrinho estÃÂ¡ vazio.':'Your cart is empty.',
  'Monte um quadro e adicione aqui.':'Build a frame and add it here.',
  'Pedido':'Order',
  'PERSONALIZAR QUADRO':'CUSTOMIZE FRAME',
  'Selecione a marca...':'Select brand...',
  'Ã¢ÂÂ  ATENÃÂÃÂO: MINIATURA NÃÂO INCLUSA':'Ã¢ÂÂ  NOTICE: MINIATURE NOT INCLUDED',
  'Esta opÃÂ§ÃÂ£o de personalizaÃÂ§ÃÂ£o refere-se exclusivamente ÃÂ  produÃÂ§ÃÂ£o do quadro. A miniatura diecast exibida nas imagens (via inteligÃÂªncia artificial) nÃÂ£o acompanha o produto e nÃÂ£o estÃÂ¡ inclusa na compra.':'This customization option refers exclusively to the production of the frame. The diecast miniature shown in the images (via artificial intelligence) does not accompany the product and is not included in the purchase.',
  'Este serviÃÂ§o ÃÂ© destinado a clientes que jÃÂ¡ possuem a prÃÂ³pria miniatura e desejam transformÃÂ¡-la em uma peÃÂ§a decorativa exclusiva, fixando-a na parede de maneira inovadora e elegante.':'This service is intended for customers who already own their own miniature and wish to transform it into an exclusive decorative piece, mounting it on the wall in an innovative and elegant way.',
  'O quadro serÃÂ¡ enviado pronto para que vocÃÂª faÃÂ§a a instalaÃÂ§ÃÂ£o da miniatura utilizando parafusos, de forma simples e prÃÂ¡tica. O kit inclui: quadro personalizado, buchas, parafusos e gabarito de instalaÃÂ§ÃÂ£o, facilitando tanto a fixaÃÂ§ÃÂ£o da miniatura no quadro quanto a instalaÃÂ§ÃÂ£o do quadro na parede.':'The frame will be shipped ready for you to install the miniature using screws, in a simple and practical manner. The kit includes: custom frame, wall plugs, screws, and an installation template Ã¢ÂÂ making it easy to both mount the miniature to the frame and hang the frame on the wall.',
  'VerificaÃÂ§ÃÂ£o de disponibilidade':'Availability check',
  'Miniaturas disponÃÂ­veis no mercado sÃÂ£o fornecidas em die-cast (ferro fundido) nas escalas 1:18 ou 1:24.':'Miniatures available on the market are supplied in die-cast (iron) at 1:18 or 1:24 scale.',
  'Modelos raros ou exclusivos sÃÂ£o produzidos via':'Rare or exclusive models are produced via',
  'impressÃÂ£o 3D + pintura automotiva':'3D printing + automotive paint',
  'Disponibilidade da miniatura':'Miniature availability',
  'PersonalizaÃÂ§ÃÂ£o da miniatura':'Miniature customization',
  'EspecificaÃÂ§ÃÂµes da miniatura e do quadro':'Miniature and frame specifications',
  'DimensÃÂ£o da miniatura':'Miniature dimensions',
  'DimensÃÂ£o do quadro':'Frame dimensions',
  'Set Selecionado':'Selected Set',
  'Ã°ÂÂÂ¦ Quadro + Miniatura':'Ã°ÂÂÂ¦ Frame + Miniature',
  'Ã¢ÂÂ Todo o Brasil':'Ã¢ÂÂ Across Brazil',
  'NÃÂ£o tenho certeza':"I'm not sure",
  'NÃÂ£o existe Ã¢ÂÂ modelo exclusivo':"Doesn't exist Ã¢ÂÂ exclusive model",
  'Die-cast 1:18 ou 1:24 Ã¢ÂÂ fundiÃÂ§ÃÂ£o em ferro':'Die-cast 1:18 or 1:24 Ã¢ÂÂ iron casting',
  'ImpressÃÂ£o 3D com acabamento pintura automotiva':'3D printing with automotive paint finish',
  'Cor personalizada (aerografia)':'Custom color (airbrushing)',
  'Placa personalizada':'Custom license plate',
  'Figura de piloto inclusa':'Pilot figure included',
  'Ã¢ÂÂ Produto pronto para entrega ÃÂ ÃÂ·ÃÂ  Ã¢ÂÂ Quadro + Miniatura inclusos ÃÂ ÃÂ·ÃÂ  Ã¢ÂÂ Embalagem premium':'Ã¢ÂÂ Ready for delivery ÃÂ ÃÂ·ÃÂ  Ã¢ÂÂ Frame + Miniature included ÃÂ ÃÂ·ÃÂ  Ã¢ÂÂ Premium packaging',
  'Se escolher essa opÃÂ§ÃÂ£o vocÃÂª terÃÂ¡ dois caminhos:':"By choosing this option, you'll have two paths:",
  'Escolher quadros para sua miniatura(s);':'Choose frames for your miniature(s);',
  'Escolher quadros prontos que jÃÂ¡ contenham miniaturas inclusas.':'Choose ready-made frames that already include miniatures.',
  'Sobre esta visualizaÃÂ§ÃÂ£o':'About this visualization',
  'A imagem do veÃÂ­culo foi gerada por InteligÃÂªncia Artificial para facilitar a visualizaÃÂ§ÃÂ£o de como a sua miniatura ficarÃÂ¡ aplicada no quadro.':'The vehicle image was generated by Artificial Intelligence to help visualize how your miniature will look mounted in the frame.',
  'Por esse motivo, alguns detalhes, como rodas, farÃÂ³is, tonalidades e acabamentos, podem apresentar pequenas diferenÃÂ§as em relaÃÂ§ÃÂ£o ÃÂ  miniatura que vocÃÂª possui.':'For this reason, some details such as wheels, headlights, tones, and finishes may show slight differences from the miniature you own.',
  'Nesta etapa, o objetivo principal ÃÂ© demonstrar a':'At this stage, the main goal is to show the vehicleÃ¢ÂÂs',
  'proporÃÂ§ÃÂ£o do veÃÂ­culo em relaÃÂ§ÃÂ£o ao quadro':'scale relative to the frame',
  '. Assim, na prÃÂ³xima etapa, vocÃÂª poderÃÂ¡ comparar os diferentes tamanhos disponÃÂ­veis e escolher com mais seguranÃÂ§a o modelo que melhor valoriza e acomoda a sua miniatura.':".ÃÂ In the next step, you'll be able to compare the available sizes and confidently choose the option that best showcases and fits your miniature.",
  'Se escolher essa opÃÂ§ÃÂ£o vocÃÂª terÃÂ¡':"By choosing this option, you'll have",
  'dezenas de modelos de quadros':'dozens of frame models',
  'para fixar sua miniatura de Lego.':'to mount your Lego miniature.',
  'ObservaÃÂ§ÃÂ£o:':'Note:',
  'para Lego.':'frames for Lego.',
  'Clique no botÃÂ£o':'Click the button',
  ', abaixo e dÃÂª continuidade na experiÃÂªncia':', below and continue the experience',
  'PadrÃÂ£o':'Standard',
  'NÃÂºmero de corrida na carroceria':'Race number on the bodywork',
  'Ã¢ÂÂ± 7Ã¢ÂÂ12 dias ÃÂºteis':'Ã¢ÂÂ± 7Ã¢ÂÂ12 business days',
  /* Ã¢ÂÂÃ¢ÂÂ NEW entries for dynamically rendered wizard content Ã¢ÂÂÃ¢ÂÂ */
  'Fibra de Carbono (Vinil)':'Carbon Fiber (Vinyl)',
  'Fibra de Carbono':'Carbon Fiber',
  'Envio prÃÂ³prio':'Self-provided',
  /* DETAILS subtitle Ã¢ÂÂ may appear all-caps in DOM or via CSS */
  'EspecificaÃÂ§ÃÂµes da miniatura e do quadro':'Miniature and frame specifications',
  'ESPECIFICAÃÂÃÂES DA MINIATURA E DO QUADRO':'MINIATURE AND FRAME SPECIFICATIONS',
  /* Lego / option card texts */
  'Nessa opÃÂ§ÃÂ£o nÃÂ£o estÃÂ¡ incluso a miniatura. Produzimos e vendemos apenas os quadros':'This option does not include the miniature. We only produce and sell',
  /* Common wizard labels */
  'Selecione o modelo...':'Select model...',
  'Selecione o tamanho...':'Select size...',
  'Selecione a cor...':'Select color...',
  'Selecione o acabamento...':'Select finish...',
  'Selecione a opÃÂ§ÃÂ£o...':'Select option...',
  /* Shipping/checkout */
  'Calcular':'Calculate',
  'Calcular frete':'Calculate shipping',
  'Frete grÃÂ¡tis':'Free shipping',
  'Prazo de entrega':'Delivery time',
  'Dias ÃÂºteis':'Business days',
  'Entrega':'Delivery',
  'Finalizar pedido':'Complete order',
  'Continuar comprando':'Continue shopping'
};

var PT4={};
Object.keys(EN4).forEach(function(k){PT4[EN4[k]]=k;});

/* Text-only walker Ã¢ÂÂ safe from MutationObserver (no innerHTML Ã¢ÂÂ no loops) */
function walkApply(map){
  var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
  var n,q=[];
  while((n=w.nextNode())){
    var t=n.textContent.trim();
    if(Object.prototype.hasOwnProperty.call(map,t)){
      var s=n.textContent;
      var l=s.match(/^[\s]*/)[0];
      var r=s.match(/[\s]*$/)[0];
      q.push({n:n,v:l+map[t]+r});
    }
  }
  q.forEach(function(x){x.n.textContent=x.v;});
}

/* Observer: re-applies text translations whenever new nodes appear */
var ob4=new MutationObserver(function(ms){
  var ok=ms.some(function(m){return m.addedNodes.length>0;});
  if(!ok)return;
  clearTimeout(_tmr4);
  _tmr4=setTimeout(function(){
    if(_lang4==='en')walkApply(EN4);
    else if(_lang4==='pt')walkApply(PT4);
  },80);
});

window.FP_traduzTudo=function(lang){
  _lang4=lang;
  _p4.call(this,lang);          /* full chain (patch3 + applyLegoSection) */
  walkApply(lang==='en'?EN4:PT4); /* apply new entries immediately */
  ob4.observe(document.body,{childList:true,subtree:true});
};
})();

;(function(){
'use strict';
if(typeof window.FP_traduzTudo!=='function')return;
var _p5=window.FP_traduzTudo;
var _lang5='pt';
var _tmr5=null;

/* Exact text node map Ã¢ÂÂ in new entries not covered by patches 1-4 */
var EN5={
  /* Model step header */
  'QUADRO PARA MINIATURAS':'MINIATURE FRAME',
  'Selecione o quadro da sua preferÃÂªncia':'Select your preferred frame',
  'SELECIONE O QUADRO DA SUA PREFERÃÂNCIA':'SELECT YOUR PREFERRED FRAME',
  'Quadro para LEGO':'Frame for LEGO',
  /* Relief step */
  'LOGOTIPO COM MARCA DO CARRO':'BRAND LOGO',
  'Ã°ÂÂÂ·Ã¯Â¸Â Logotipo com marca do carro':'Ã°ÂÂÂ·Ã¯Â¸Â Brand Logo',
  'Logotipo com marca do carro':'Brand Logo',
  'Logotipo oficial da marca selecionada':'Official logo of the selected brand',
  'Ã°ÂÂÂ Artesanal':'Ã°ÂÂÂ Handcrafted',
  'Artesanal':'Handcrafted',
  /* Order summary rows */
  'Miniatura Die-cast / 3D':'Miniature Die-cast / 3D',
  'Ã¢ÂÂ Logo da Marca Ã¢ÂÂ canto sup. esq.':'Ã¢ÂÂ Brand Logo Ã¢ÂÂ top-left corner',
  'Ã¢ÂÂ Logo do Modelo Ã¢ÂÂ canto inf. dir.':'Ã¢ÂÂ Model Logo Ã¢ÂÂ bottom-right corner',
  'Logo da Marca Ã¢ÂÂ canto sup. esq.':'Brand Logo Ã¢ÂÂ top-left corner',
  'Logo do Modelo Ã¢ÂÂ canto inf. dir.':'Model Logo Ã¢ÂÂ bottom-right corner',
  /* Background options */
  'DegradÃÂª Central':'Center Gradient',
  'Cor do DegradÃÂª Central':'Center Gradient Color',
  'ENVIE A IMAGEM DA SUA PREFERÃÂNCIA':'SEND YOUR PREFERRED IMAGE',
  'Envie a imagem da sua preferÃÂªncia':'Send your preferred image',
  /* Miniature availability wizard */
  'VerificaÃÂ§ÃÂ£o de disponibilidade':'Availability check',
  'Disponibilidade da miniatura':'Miniature availability',
  'PersonalizaÃÂ§ÃÂ£o da miniatura':'Miniature customization',
  'DimensÃÂ£o da miniatura':'Miniature dimensions',
  'DimensÃÂ£o do quadro':'Frame dimensions',
  /* Compound label parts (also handled by substrApply below) */
  'Moldura Laca Preto':'Black Lacquer Frame',
  'Fundo Fibra de Carbono (Vinil)':'Carbon Fiber (Vinyl) Background',
  'Fundo Fibra de Carbono':'Carbon Fiber Background',
};

var PT5={};
Object.keys(EN5).forEach(function(k){PT5[EN5[k]]=k;});

/* Substring map Ã¢ÂÂ for compound cart/label strings not matched exactly */
var SUBSTR_EN={
  'Moldura Laca Preto':'Black Lacquer Frame',
  'Moldura Fibra de Carbono' :'Carbon Fiber Frame',
  'Fundo Fibra de Carbono (Vinil)':'Carbon Fiber (Vinyl) Background',
  'Fundo Fibra de Carbono' :'Carbon Fiber Background',
  'Fundo AcrÃÂ­lico UV':'UV Acrylic Background',
  'Logo da Marca':'Brand Logo',
  'Logo do Modelo':'Model Logo',
  'canto sup. esq.':'top-left corner',
  'canto inf. dir.':'bottom-right corner',
  'Miniatura Die-cast':'Miniature Die-cast',
};
var SUBSTR_PT={};
Object.keys(SUBSTR_EN).forEach(function(k){SUBSTR_PT[SUBSTR_EN[k]]=k;});

/* Exact text-node walker Ã¢ÂÂ safe for MutationObserver (no innerHTML) */
function walkApply(map){
  var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
  var n,q=[];
  while((n=w.nextNode())){
    var t=n.textContent.trim();
    if(Object.prototype.hasOwnProperty.call(map,t)){
      var s=n.textContent;
      var l=s.match(/^[\s]*/)[0];
      var r=s.match(/[\s]*$/)[0];
      q.push({n:n,v:l+map[t]+r});
    }
  }
  q.forEach(function(x){x.n.textContent=x.v;});
}

/* Substring walker Ã¢ÂÂ handles compound strings in cart/label nodes */
function substrApply(subMap){
  var keys=Object.keys(subMap);
  if(!keys.length)return;
  var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
  var n,q=[];
  while((n=w.nextNode())){
    var t=n.textContent;
    var changed=false;
    for(var i=0;i<keys.length;i++){
      var pt=keys[i];
      if(t.indexOf(pt)!==-1){
        t=t.split(pt).join(subMap[pt]);
        changed=true;
      }
    }
    if(changed)q.push({n:n,v:t});
  }
  q.forEach(function(x){x.n.textContent=x.v;});
}

var ob5=new MutationObserver(function(ms){
  var ok=ms.some(function(m){return m.addedNodes.length>0;});
  if(!ok)return;
  clearTimeout(_tmr5);
  _tmr5=setTimeout(function(){
    if(_lang5==='en'){walkApply(EN5);substrApply(SUBSTR_EN);}
    else if(_lang5==='pt'){walkApply(PT5);substrApply(SUBSTR_PT);}
  },80);
});

window.FP_traduzTudo=function(lang){
  _lang5=lang;
  _p5.call(this,lang);          /* full upstream chain */
  if(lang==='en'){walkApply(EN5);substrApply(SUBSTR_EN);}
  else if(lang==='pt'){walkApply(PT5);substrApply(SUBSTR_PT);}
  ob5.observe(document.body,{childList:true,subtree:true});
};
})();

;(function(){
'use strict';
if(typeof window.FP_traduzTudo!=='function')return;
var _p6=window.FP_traduzTudo;
var _lang6='pt';
var _tmr6=null;

/* New entries not covered by patches 1-5:
   Unabbreviated corner labels used in RELIEF step cards and order summary */
var EN6={
  /* RELIEF step card titles (all-caps compound) */
  'MODEL LOGO Ã¢ÂÂ CANTO INFERIOR DIREITO':'MODEL LOGO Ã¢ÂÂ BOTTOM RIGHT CORNER',
  'BRAND LOGO Ã¢ÂÂ CANTO SUPERIOR ESQUERDO':'BRAND LOGO Ã¢ÂÂ TOP LEFT CORNER',
  'Logo do Modelo Ã¢ÂÂ canto inferior direito':'Model Logo Ã¢ÂÂ bottom-right corner',
  'Logo da Marca Ã¢ÂÂ canto superior esquerdo':'Brand Logo Ã¢ÂÂ top-left corner',
  'Ã¢ÂÂ Logo da Marca Ã¢ÂÂ canto superior esquerdo':'Ã¢ÂÂ Brand Logo Ã¢ÂÂ top-left corner',
  'Ã¢ÂÂ Logo do Modelo Ã¢ÂÂ canto inferior direito':'Ã¢ÂÂ Model Logo Ã¢ÂÂ bottom-right corner',
  /* Standalone corner label strings */
  'CANTO INFERIOR DIREITO':'BOTTOM RIGHT CORNER',
  'CANTO SUPERIOR ESQUERDO':'TOP LEFT CORNER',
  'canto inferior direito':'bottom-right corner',
  'canto superior esquerdo':'top-left corner',
  /* Abbreviated reverse map (ENÃ¢ÂÂPT) handled automatically via PT6 below */
};

var PT6={};
Object.keys(EN6).forEach(function(k){PT6[EN6[k]]=k;});

/* Substring map for compound strings containing corner labels */
var SUBSTR_EN6={
  'CANTO INFERIOR DIREITO':'BOTTOM RIGHT CORNER',
  'CANTO SUPERIOR ESQUERDO':'TOP LEFT CORNER',
  'canto inferior direito':'bottom-right corner',
  'canto superior esquerdo':'top-left corner',
};
var SUBSTR_PT6={};
Object.keys(SUBSTR_EN6).forEach(function(k){SUBSTR_PT6[SUBSTR_EN6[k]]=k;});

function walkApply(map){
  var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
  var n,q=[];
  while((n=w.nextNode())){
    var t=n.textContent.trim();
    if(Object.prototype.hasOwnProperty.call(map,t)){
      var s=n.textContent;
      var l=s.match(/^[\s]*/)[0];
      var r=s.match(/[\s]*$/)[0];
      q.push({n:n,v:l+map[t]+r});
    }
  }
  q.forEach(function(x){x.n.textContent=x.v;});
}

function substrApply(subMap){
  var keys=Object.keys(subMap);
  if(!keys.length)return;
  var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
  var n,q=[];
  while((n=w.nextNode())){
    var t=n.textContent;
    var changed=false;
    for(var i=0;i<keys.length;i++){
      var pt=keys[i];
      if(t.indexOf(pt)!==-1){t=t.split(pt).join(subMap[pt]);changed=true;}
    }
    if(changed)q.push({n:n,v:t});
  }
  q.forEach(function(x){x.n.textContent=x.v;});
}

var ob6=new MutationObserver(function(ms){
  var ok=ms.some(function(m){return m.addedNodes.length>0;});
  if(!ok)return;
  clearTimeout(_tmr6);
  _tmr6=setTimeout(function(){
    if(_lang6==='en'){walkApply(EN6);substrApply(SUBSTR_EN6);}
    else if(_lang6==='pt'){walkApply(PT6);substrApply(SUBSTR_PT6);}
  },80);
});

window.FP_traduzTudo=function(lang){
  _lang6=lang;
  _p6.call(this,lang);          /* full upstream chain */
  if(lang==='en'){walkApply(EN6);substrApply(SUBSTR_EN6);}
  else if(_lang6==='pt'){walkApply(PT6);substrApply(SUBSTR_PT6);}
  ob6.observe(document.body,{childList:true,subtree:true});
};
})();

;(function(){
'use strict';
if(typeof window.FP_traduzTudo!=='function')return;
var _p7=window.FP_traduzTudo;
var _lang7='pt';
var _tmr7=null;

/* Fix for patch6: actual DOM text is mixed-case "Canto inferior direito" (capital C),
   not "CANTO INFERIOR DIREITO". Also the card title includes the emoji prefix. */
var EN7={
  /* RELIEF step card Ã¢ÂÂ exact node with emoji */
  'Ã°ÂÂÂÃ¯Â¸Â Model Logo Ã¢ÂÂ Canto inferior direito':'Ã°ÂÂÂÃ¯Â¸Â Model Logo Ã¢ÂÂ Bottom right corner',
  'Ã°ÂÂÂÃ¯Â¸Â Model Logo Ã¢ÂÂ Canto superior esquerdo':'Ã°ÂÂÂÃ¯Â¸Â Model Logo Ã¢ÂÂ Top left corner',
  /* Without emoji */
  'Model Logo Ã¢ÂÂ Canto inferior direito':'Model Logo Ã¢ÂÂ Bottom right corner',
  'Model Logo Ã¢ÂÂ Canto superior esquerdo':'Model Logo Ã¢ÂÂ Top left corner',
  'Brand Logo Ã¢ÂÂ Canto superior esquerdo':'Brand Logo Ã¢ÂÂ Top left corner',
  'Brand Logo Ã¢ÂÂ Canto inferior direito':'Brand Logo Ã¢ÂÂ Bottom right corner',
  /* Order summary rows */
  'Ã¢ÂÂ Brand Logo Ã¢ÂÂ Canto superior esquerdo':'Ã¢ÂÂ Brand Logo Ã¢ÂÂ top-left corner',
  'Ã¢ÂÂ Model Logo Ã¢ÂÂ Canto inferior direito':'Ã¢ÂÂ Model Logo Ã¢ÂÂ bottom-right corner',
};

var PT7={};
Object.keys(EN7).forEach(function(k){PT7[EN7[k]]=k;});

/* Substring map Ã¢ÂÂ capital-C variants */
var SUBSTR_EN7={
  'Canto inferior direito':'bottom-right corner',
  'Canto superior esquerdo':'top-left corner',
};
var SUBSTR_PT7={};
Object.keys(SUBSTR_EN7).forEach(function(k){SUBSTR_PT7[SUBSTR_EN7[k]]=k;});

function walkApply(map){
  var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
  var n,q=[];
  while((n=w.nextNode())){
    var t=n.textContent.trim();
    if(Object.prototype.hasOwnProperty.call(map,t)){
      var s=n.textContent;
      var l=s.match(/^[\s]*/)[0];
      var r=s.match(/[\s]*$/)[0];
      q.push({n:n,v:l+map[t]+r});
    }
  }
  q.forEach(function(x){x.n.textContent=x.v;});
}

function substrApply(subMap){
  var keys=Object.keys(subMap);
  if(!keys.length)return;
  var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
  var n,q=[];
  while((n=w.nextNode())){
    var t=n.textContent;
    var changed=false;
    for(var i=0;i<keys.length;i++){
      var pt=keys[i];
      if(t.indexOf(pt)!==-1){t=t.split(pt).join(subMap[pt]);changed=true;}
    }
    if(changed)q.push({n:n,v:t});
  }
  q.forEach(function(x){x.n.textContent=x.v;});
}

var ob7=new MutationObserver(function(ms){
  var ok=ms.some(function(m){return m.addedNodes.length>0;});
  if(!ok)return;
  clearTimeout(_tmr7);
  _tmr7=setTimeout(function(){
    if(_lang7==='en'){walkApply(EN7);substrApply(SUBSTR_EN7);}
    else if(_lang7==='pt'){walkApply(PT7);substrApply(SUBSTR_PT7);}
  },80);
});

window.FP_traduzTudo=function(lang){
  _lang7=lang;
  _p7.call(this,lang);          /* full upstream chain */
  if(lang==='en'){walkApply(EN7);substrApply(SUBSTR_EN7);}
  else if(lang==='pt'){walkApply(PT7);substrApply(SUBSTR_PT7);}
  ob7.observe(document.body,{childList:true,subtree:true});
};
})();

;(function(){
'use strict';

/* PATCH 8 Ã¢ÂÂ Language-change detector.
   Root cause: the EN/PT toggle button writes 'fp_lang' to localStorage
   but does NOT call window.FP_traduzTudo. Patches 1-7 all hook into
   FP_traduzTudo and are therefore never triggered by the UI toggle.
   This patch polls localStorage every 150 ms and calls FP_traduzTudo
   whenever the language changes, including retries for late React renders. */

function _getLang8(){
  try{return localStorage.getItem('fp_lang')||'pt';}catch(e){return 'pt';}
}

var _p8_lastLang=_getLang8();
var _p8_timers=[];

function _applyLang8(lang){
  if(typeof window.FP_traduzTudo==='function'){
    try{window.FP_traduzTudo(lang);}catch(e){}
  }
}

function _onLangChange8(lang){
  /* Cancel any pending retries from the last change */
  _p8_timers.forEach(function(t){clearTimeout(t);});
  _p8_timers=[];
  /* Apply immediately, then retry to catch content rendered after React settles */
  _applyLang8(lang);
  _p8_timers.push(setTimeout(function(){_applyLang8(lang);},150));
  _p8_timers.push(setTimeout(function(){_applyLang8(lang);},400));
  _p8_timers.push(setTimeout(function(){_applyLang8(lang);},900));
}

/* Poll localStorage every 150 ms Ã¢ÂÂ cheap (single string comparison) */
setInterval(function(){
  var cur=_getLang8();
  if(cur!==_p8_lastLang){
    _p8_lastLang=cur;
    _onLangChange8(cur);
  }
},150);

/* Also apply on initial page load after React finishes its first renders */
setTimeout(function(){_applyLang8(_getLang8());},400);
setTimeout(function(){_applyLang8(_getLang8());},900);
setTimeout(function(){_applyLang8(_getLang8());},1800);

})();

;(function(){
'use strict';
if(typeof window.FP_traduzTudo!=='function')return;
var _p9=window.FP_traduzTudo;
var _lang9='pt';
var _tmr9=null;
var _ob9=null;

/* PATCH 9 Ã¢ÂÂ Multi-language translation + flag icon fix.

   Problem 1: Patches 4-7 only apply EN maps when lang==='en'. For lang='fr' or
   lang='es', they call walkApply(PTn) which tries to map ENÃ¢ÂÂPT Ã¢ÂÂ a no-op since
   the dynamic content is already in PT. Fix: for any non-PT language, run the
   combined EN translation maps after the chain, translating PTÃ¢ÂÂEN as fallback.

   Problem 2: The .fp-flag SVG in .fp-lang-btn stays as the Brazil flag regardless
   of the selected language. Fix: clone the matching flag SVG from the
   .fp-lang-opt dropdown item that corresponds to the active language. */

/* Ã¢ÂÂÃ¢ÂÂ COMBINED EN MAP Ã¢ÂÂ union of EN4 + EN5 + EN6 + EN7 Ã¢ÂÂÃ¢ÂÂ */
var _EN9={
  /* patch4 entries */
  'Carrinho':'Cart',
  'Seu carrinho estÃÂ¡ vazio.':'Your cart is empty.',
  'Monte um quadro e adicione aqui.':'Build a frame and add it here.',
  'Pedido':'Order',
  'PERSONALIZAR QUADRO':'CUSTOMIZE FRAME',
  'Selecione a marca...':'Select brand...',
  'Ã¢ÂÂ  ATENÃÂÃÂO: MINIATURA NÃÂO INCLUSA':'Ã¢ÂÂ  NOTICE: MINIATURE NOT INCLUDED',
  'Esta opÃÂ§ÃÂ£o de personalizaÃÂ§ÃÂ£o refere-se exclusivamente ÃÂ  produÃÂ§ÃÂ£o do quadro. A miniatura diecast exibida nas imagens (via inteligÃÂªncia artificial) nÃÂ£o acompanha o produto e nÃÂ£o estÃÂ¡ inclusa na compra.':'This customization option refers exclusively to the production of the frame. The diecast miniature shown in the images (via artificial intelligence) does not accompany the product and is not included in the purchase.',
  'Este serviÃÂ§o ÃÂ© destinado a clientes que jÃÂ¡ possuem a prÃÂ³pria miniatura e desejam transformÃÂ¡-la em uma peÃÂ§a decorativa exclusiva, fixando-a na parede de maneira inovadora e elegante.':'This service is intended for customers who already own their own miniature and wish to transform it into an exclusive decorative piece, mounting it on the wall in an innovative and elegant way.',
  'O quadro serÃÂ¡ enviado pronto para que vocÃÂª faÃÂ§a a instalaÃÂ§ÃÂ£o da miniatura utilizando parafusos, de forma simples e prÃÂ¡tica. O kit inclui: quadro personalizado, buchas, parafusos e gabarito de instalaÃÂ§ÃÂ£o, facilitando tanto a fixaÃÂ§ÃÂ£o da miniatura no quadro quanto a instalaÃÂ§ÃÂ£o do quadro na parede.':'The frame will be shipped ready for you to install the miniature using screws, in a simple and practical manner. The kit includes: custom frame, wall plugs, screws, and an installation template Ã¢ÂÂ making it easy to both mount the miniature to the frame and hang the frame on the wall.',
  'VerificaÃÂ§ÃÂ£o de disponibilidade':'Availability check',
  'Miniaturas disponÃÂ­veis no mercado sÃÂ£o fornecidas em die-cast (ferro fundido) nas escalas 1:18 ou 1:24.':'Miniatures available on the market are supplied in die-cast (iron) at 1:18 or 1:24 scale.',
  'Modelos raros ou exclusivos sÃÂ£o produzidos via':'Rare or exclusive models are produced via',
  'impressÃÂ£o 3D + pintura automotiva':'3D printing + automotive paint',
  'Disponibilidade da miniatura':'Miniature availability',
  'PersonalizaÃÂ§ÃÂ£o da miniatura':'Miniature customization',
  'EspecificaÃÂ§ÃÂµes da miniatura e do quadro':'Miniature and frame specifications',
  'DimensÃÂ£o da miniatura':'Miniature dimensions',
  'DimensÃÂ£o do quadro':'Frame dimensions',
  'Set Selecionado':'Selected Set',
  'Ã°ÂÂÂ¦ Quadro + Miniatura':'Ã°ÂÂÂ¦ Frame + Miniature',
  'Ã¢ÂÂ Todo o Brasil':'Ã¢ÂÂ Across Brazil',
  'NÃÂ£o tenho certeza':"I'm not sure",
  'NÃÂ£o existe Ã¢ÂÂ modelo exclusivo':"Doesn't exist Ã¢ÂÂ exclusive model",
  'Die-cast 1:18 ou 1:24 Ã¢ÂÂ fundiÃÂ§ÃÂ£o em ferro':'Die-cast 1:18 or 1:24 Ã¢ÂÂ iron casting',
  'ImpressÃÂ£o 3D com acabamento pintura automotiva':'3D printing with automotive paint finish',
  'Cor personalizada (aerografia)':'Custom color (airbrushing)',
  'Placa personalizada':'Custom license plate',
  'Figura de piloto inclusa':'Pilot figure included',
  'Ã¢ÂÂ Produto pronto para entrega  ÃÂ·  Ã¢ÂÂ Quadro + Miniatura inclusos  ÃÂ·  Ã¢ÂÂ Embalagem premium':'Ã¢ÂÂ Ready for delivery  ÃÂ·  Ã¢ÂÂ Frame + Miniature included  ÃÂ·  Ã¢ÂÂ Premium packaging',
  'Se escolher essa opÃÂ§ÃÂ£o vocÃÂª terÃÂ¡ dois caminhos:':"By choosing this option, you'll have two paths:",
  'Escolher quadros para sua miniatura(s);':'Choose frames for your miniature(s);',
  'Escolher quadros prontos que jÃÂ¡ contenham miniaturas inclusas.':'Choose ready-made frames that already include miniatures.',
  'Sobre esta visualizaÃÂ§ÃÂ£o':'About this visualization',
  'A imagem do veÃÂ­culo foi gerada por InteligÃÂªncia Artificial para facilitar a visualizaÃÂ§ÃÂ£o de como a sua miniatura ficarÃÂ¡ aplicada no quadro.':'The vehicle image was generated by Artificial Intelligence to help visualize how your miniature will look mounted in the frame.',
  'Por esse motivo, alguns detalhes, como rodas, farÃÂ³is, tonalidades e acabamentos, podem apresentar pequenas diferenÃÂ§as em relaÃÂ§ÃÂ£o ÃÂ  miniatura que vocÃÂ  possui.':'For this reason, some details such as wheels, headlights, tones, and finishes may show slight differences from the miniature you own.',
  'Nesta etapa, o objetivo principal ÃÂ© demonstrar a':'At this stage, the main goal is to show the vehicleÃ¢ÂÂs',
  'proporÃÂ§ÃÂ£o do veÃÂ­culo em relaÃÂ§ÃÂ£o ao quadro':'scale relative to the frame',
  '. Assim, na prÃÂ³xima etapa, vocÃÂ  poderÃÂ¡ comparar os diferentes tamanhos disponÃÂ­veis e escolher com mais seguranÃÂ§a o modelo que melhor valoriza e acomoda a sua miniatura.':".ÃÂ In the next step, you'll be able to compare the available sizes and confidently choose the option that best showcases and fits your miniature.",
  'Se escolher essa opÃÂ§ÃÂ£o vocÃÂ  terÃÂ¡':"By choosing this option, you'll have",
  'dezenas de modelos de quadros':'dozens of frame models',
  'para fixar sua miniatura de Lego.':'to mount your Lego miniature.',
  'ObservaÃÂ§ÃÂ£o:':'Note:',
  'para Lego.':'frames for Lego.',
  'Clique no botÃÂ£o':'Click the button',
  ', abaixo e dÃÂª continuidade na experiÃÂªncia':', below and continue the experience',
  'PadrÃÂ£o':'Standard',
  'NÃÂºmero de corrida na carroceria':'Race number on the bodywork',
  'Ã¢ÂÂ± 7Ã¢ÂÂ12 dias ÃÂºteis':'Ã¢ÂÂ± 7Ã¢ÂÂ12 business days',
  'Fibra de Carbono (Vinil)':'Carbon Fiber (Vinyl)',
  'Fibra de Carbono':'Carbon Fiber',
  'Envio prÃÂ³prio':'Self-provided',
  'ESPECIFICAÃÂÃÂES DA MINIATURA E DO QUADRO':'MINIATURE AND FRAME SPECIFICATIONS',
  'Nessa opÃÂ§ÃÂ£o nÃÂ£o estÃÂ¡ incluso a miniatura. Produzimos e vendemos apenas os quadros':'This option does not include the miniature. We only produce and sell',
  'Selecione o modelo...':'Select model...',
  'Selecione o tamanho...':'Select size...',
  'Selecione a cor...':'Select color...',
  'Selecione o acabamento...':'Select finish...',
  'Selecione a opÃÂ§ÃÂ£o...':'Select option...',
  'Calcular':'Calculate',
  'Calcular frete':'Calculate shipping',
  'Frete grÃÂ¡tis':'Free shipping',
  'Prazo de entrega':'Delivery time',
  'Dias ÃÂºteis':'Business days',
  'Entrega':'Delivery',
  'Finalizar pedido':'Complete order',
  'Continuar comprando':'Continue shopping',
  /* patch5 entries */
  'QUADRO PARA MINIATURAS':'MINIATURE FRAME',
  'Selecione o quadro da sua preferÃÂªncia':'Select your preferred frame',
  'SELECIONE O QUADRO DA SUA PREFERÃÂNCIA':'SELECT YOUR PREFERRED FRAME',
  'Quadro para LEGO':'Frame for LEGO',
  'LOGOTIPO COM MARCA DO CARRO':'BRAND LOGO',
  'Ã°ÂÂÂ·Ã¯Â¸Â Logotipo com marca do carro':'Ã°ÂÂÂ·Ã¯Â¸Â Brand Logo',
  'Logotipo com marca do carro':'Brand Logo',
  'Logotipo oficial da marca selecionada':'Official logo of the selected brand',
  'Ã°ÂÂÂ Artesanal':'Ã°ÂÂÂ Handcrafted',
  'Artesanal':'Handcrafted',
  'Miniatura Die-cast / 3D':'Miniature Die-cast / 3D',
  'Ã¢ÂÂ Logo da Marca Ã¢ÂÂ canto sup. esq.':'Ã¢ÂÂ Brand Logo Ã¢ÂÂ top-left corner',
  'Ã¢ÂÂ Logo do Modelo Ã¢ÂÂ canto inf. dir.':'Ã¢ÂÂ Model Logo Ã¢ÂÂ bottom-right corner',
  'Logo da Marca Ã¢ÂÂ canto sup. esq.':'Brand Logo Ã¢ÂÂ top-left corner',
  'Logo do Modelo Ã¢ÂÂ canto inf. dir.':'Model Logo Ã¢ÂÂ bottom-right corner',
  'DegradÃÂª Central':'Center Gradient',
  'Cor do DegradÃÂª Central':'Center Gradient Color',
  'ENVIE A IMAGEM DA SUA PREFERÃÂNCIA':'SEND YOUR PREFERRED IMAGE',
  'Envie a imagem da sua preferÃÂªncia':'Send your preferred image',
  'Moldura Laca Preto':'Black Lacquer Frame',
  'Fundo Fibra de Carbono (Vinil)':'Carbon Fiber (Vinyl) Background',
  'Fundo Fibra de Carbono':'Carbon Fiber Background',
  /* patch6 entries */
  'MODEL LOGO Ã¢ÂÂ CANTO INFERIOR DIREITO':'MODEL LOGO Ã¢ÂÂ BOTTOM RIGHT CORNER',
  'BRAND LOGO Ã¢ÂÂ CANTO SUPERIOR ESQUERDO':'BRAND LOGO Ã¢ÂÂ TOP LEFT CORNER',
  'Logo do Modelo Ã¢ÂÂ canto inferior direito':'Model Logo Ã¢ÂÂ bottom-right corner',
  'Logo da Marca Ã¢ÂÂ canto superior esquerdo':'Brand Logo Ã¢ÂÂ top-left corner',
  'Ã¢ÂÂ Logo da Marca Ã¢ÂÂ canto superior esquerdo':'Ã¢ÂÂ Brand Logo Ã¢ÂÂ top-left corner',
  'Ã¢ÂÂ Logo do Modelo Ã¢ÂÂ canto inferior direito':'Ã¢ÂÂ Model Logo Ã¢ÂÂ bottom-right corner',
  'CANTO INFERIOR DIREITO':'BOTTOM RIGHT CORNER',
  'CANTO SUPERIOR ESQUERDO':'TOP LEFT CORNER',
  'canto inferior direito':'bottom-right corner',
  'canto superior esquerdo':'top-left corner',
  /* patch7 entries */
  'Ã°ÂÂÂÃ¯Â¸Â Model Logo Ã¢ÂÂ Canto inferior direito':'Ã°ÂÂÂÃ¯Â¸Â Model Logo Ã¢ÂÂ Bottom right corner',
  'Ã°ÂÂÂÃ¯Â¸Â Model Logo Ã¢ÂÂ Canto superior esquerdo':'Ã°ÂÂÂÃ¯Â¸Â Model Logo Ã¢ÂÂ Top left corner',
  'Model Logo Ã¢ÂÂ Canto inferior direito':'Model Logo Ã¢ÂÂ Bottom right corner',
  'Model Logo Ã¢ÂÂ Canto superior esquerdo':'Model Logo Ã¢ÂÂ Top left corner',
  'Brand Logo Ã¢ÂÂ Canto superior esquerdo':'Brand Logo Ã¢ÂÂ Top left corner',
  'Brand Logo Ã¢ÂÂ Canto inferior direito':'Brand Logo Ã¢ÂÂ Bottom right corner',
  'Ã¢ÂÂ Brand Logo Ã¢ÂÂ Canto superior esquerdo':'Ã¢ÂÂ Brand Logo Ã¢ÂÂ top-left corner',
  'Ã¢ÂÂ Model Logo Ã¢ÂÂ Canto inferior direito':'Ã¢ÂÂ Model Logo Ã¢ÂÂ bottom-right corner'
};

/* Combined substring map for compound strings */
var _SUBSTR9={
  'Moldura Laca Preto':'Black Lacquer Frame',
  'Moldura Fibra de Carbono':'Carbon Fiber Frame',
  'Fundo Fibra de Carbono (Vinil)':'Carbon Fiber (Vinyl) Background',
  'Fundo Fibra de Carbono':'Carbon Fiber Background',
  'Fundo AcrÃÂ­lico UV':'UV Acrylic Background',
  'Logo da Marca':'Brand Logo',
  'Logo do Modelo':'Model Logo',
  'canto sup. esq.':'top-left corner',
  'canto inf. dir.':'bottom-right corner',
  'Miniatura Die-cast':'Miniature Die-cast',
  'CANTO INFERIOR DIREITO':'BOTTOM RIGHT CORNER',
  'CANTO SUPERIOR ESQUERDO':'TOP LEFT CORNER',
  'Canto inferior direito':'bottom-right corner',
  'Canto superior esquerdo':'top-left corner'
};

/* Text-node exact-match walker */
function _walkApply9(map){
  try{
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
    var n,q=[];
    while((n=w.nextNode())){
      var t=n.textContent.trim();
      if(Object.prototype.hasOwnProperty.call(map,t)){
        var s=n.textContent;
        var l=s.match(/^[\s]*/)[0];
        var r=s.match(/[\s]*$/)[0];
        q.push({n:n,v:l+map[t]+r});
      }
    }
    q.forEach(function(x){x.n.textContent=x.v;});
  }catch(e){}
}

/* Substring walker for compound labels */
function _substrApply9(subMap){
  try{
    var keys=Object.keys(subMap);
    if(!keys.length)return;
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
    var n,q=[];
    while((n=w.nextNode())){
      var t=n.textContent;
      var changed=false;
      for(var i=0;i<keys.length;i++){
        var pt=keys[i];
        if(t.indexOf(pt)!==-1){t=t.split(pt).join(subMap[pt]);changed=true;}
      }
      if(changed)q.push({n:n,v:t});
    }
    q.forEach(function(x){x.n.textContent=x.v;});
  }catch(e){}
}

/* Ã¢ÂÂÃ¢ÂÂ FLAG ICON FIX Ã¢ÂÂÃ¢ÂÂ
   Language dropdown has .fp-lang-opt items for PortuguÃÂªs/English/EspaÃÂ±ol/FranÃÂ§ais.
   Clone the .fp-flag SVG from the matching option into the button's flag slot. */
var _p9_langNames={pt:'PortuguÃÂªs',en:'English',es:'EspaÃÂ±ol',fr:'FranÃÂ§ais'};

function _updateFlag9(lang){
  try{
    var targetName=_p9_langNames[lang];
    if(!targetName)return;
    var opts=document.querySelectorAll('.fp-lang-opt');
    var srcFlag=null;
    for(var i=0;i<opts.length;i++){
      if(opts[i].textContent.trim()===targetName){
        srcFlag=opts[i].querySelector('.fp-flag');
        break;
      }
    }
    if(!srcFlag)return;
    var btnFlag=document.querySelector('#fpLangFlag');
    if(!btnFlag)return;
    var cloned=srcFlag.cloneNode(true);
    cloned.id='fpLangFlag';
    btnFlag.parentNode.replaceChild(cloned,btnFlag);
  }catch(e){}
}

/* MutationObserver: re-apply EN translations for non-PT on new DOM nodes */
function _startOb9(){
  if(_ob9)return;
  _ob9=new MutationObserver(function(ms){
    var ok=ms.some(function(m){return m.addedNodes.length>0;});
    if(!ok)return;
    clearTimeout(_tmr9);
    _tmr9=setTimeout(function(){
      if(_lang9==='en'){
        _walkApply9(_EN9);
        _substrApply9(_SUBSTR9);
      }
    },80);
  });
  _ob9.observe(document.body,{childList:true,subtree:true});
}

/* Ã¢ÂÂÃ¢ÂÂ INTERCEPT FP_traduzTudo Ã¢ÂÂÃ¢ÂÂ */
window.FP_traduzTudo=function(lang){
  _lang9=lang;
  _p9.call(this,lang);           /* run full upstream chain (patches 1-8) */
  if(lang==='en'){
    /* For any non-PT language: ensure PTÃ¢ÂÂEN translation is applied.
       Patches 4-7 incorrectly run walkApply(PTn) for non-EN/non-PT langs
       (which maps ENÃ¢ÂÂPT, a no-op on PT content). We apply the EN maps here
       to guarantee dynamic content (LEGO card, wizard labels) gets translated. */
    _walkApply9(_EN9);
    _substrApply9(_SUBSTR9);
  }
  /* Update flag icon in language button */
  _updateFlag9(lang);
  /* Retry flag update for late-rendering React dropdown */
  setTimeout(function(){_updateFlag9(lang);},200);
  setTimeout(function(){_updateFlag9(lang);},600);
  /* Start observer for React re-renders */
  _startOb9();
};

/* Ã¢ÂÂÃ¢ÂÂ INITIAL LOAD Ã¢ÂÂÃ¢ÂÂ */
/* Apply on first load in case lang is already non-PT in localStorage */
(function(){
  function _p9Init(){
    var lang=localStorage.getItem('fp_lang')||'pt';
    if(lang==='en'){_walkApply9(_EN9);_substrApply9(_SUBSTR9);}
    _updateFlag9(lang);
    _startOb9();
  }
  setTimeout(_p9Init,500);
  setTimeout(_p9Init,1000);
  setTimeout(_p9Init,2000);
})();

})();

;(function(){
'use strict';

/* PATCH 10 Ã¢ÂÂ Fix remaining LEGO card PT fragment.
   "Se escolher essa opÃÂ§ÃÂ£o vocÃÂª terÃÂ¡" appears as part of a single
   concatenated text node, so _walkApply9 (exact-match) never fires.
   Adding it to a new SUBSTR pass fixes the partial translation. */

if(typeof window.FP_traduzTudo!=='function')return;
var _p10=window.FP_traduzTudo;
var _lang10='pt';
var _tmr10=null;
var _ob10=null;

var _SUBSTR10={
  'Se escolher essa opÃÂ§ÃÂ£o vocÃÂª terÃÂ¡ dois caminhos:':"By choosing this option, you'll have two paths:",
  'Se escolher essa opÃÂ§ÃÂ£o vocÃÂª terÃÂ¡':"By choosing this option, you'll have",
  'Escolher quadros para sua miniatura(s);':'Choose frames for your miniature(s);',
  'Escolher quadros prontos que jÃÂ¡ contenham miniaturas inclusas.':'Choose ready-made frames that already include miniatures.',
  'dois caminhos:':'two paths:'
};

function _substrApply10(subMap){
  try{
    var keys=Object.keys(subMap);
    if(!keys.length)return;
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
    var n,q=[];
    while((n=w.nextNode())){
      var t=n.textContent;
      var changed=false;
      for(var i=0;i<keys.length;i++){
        var pt=keys[i];
        if(t.indexOf(pt)!==-1){t=t.split(pt).join(subMap[pt]);changed=true;}
      }
      if(changed)q.push({n:n,v:t});
    }
    q.forEach(function(x){x.n.textContent=x.v;});
  }catch(e){}
}

function _startOb10(){
  if(_ob10)return;
  _ob10=new MutationObserver(function(ms){
    var ok=ms.some(function(m){return m.addedNodes.length>0;});
    if(!ok)return;
    clearTimeout(_tmr10);
    _tmr10=setTimeout(function(){
      if(_lang10==='en')_substrApply10(_SUBSTR10);
    },80);
  });
  _ob10.observe(document.body,{childList:true,subtree:true});
}

window.FP_traduzTudo=function(lang){
  _lang10=lang;
  _p10.call(this,lang);
  if(lang==='en')_substrApply10(_SUBSTR10);
  _startOb10();
};

(function(){
  function _p10Init(){
    var lang=localStorage.getItem('fp_lang')||'pt';
    if(lang==='en')_substrApply10(_SUBSTR10);
    _startOb10();
  }
  setTimeout(_p10Init,600);
  setTimeout(_p10Init,1200);
  setTimeout(_p10Init,2500);
})();

})();

;(function(){
'use strict';

/* PATCH 11 Ã¢ÂÂ Retry pump for React re-render timing.
   Root cause: React re-renders components AFTER FP_traduzTudo(lang)
   returns, resetting text nodes back to PT. Patches 9-10 run once
   and the MutationObserver (childList only) may miss direct text-node
   mutations. This patch schedules 4 retries at 150 / 400 / 900 / 2000ms
   with a per-language guard so stale retries are cancelled on lang change.

   Covers confirmed-failing nodes (verified in-browser):
   - "Se escolher essa opÃÂ§ÃÂ£o voce tera " (LEGO card, concat node)
   - ". Assim, na proxima etapa, voce podera comparar..." (viz note)
   - Remaining LEGO-path fragments and prop/step sentences. */

if(typeof window.FP_traduzTudo!=='function')return;
var _p11=window.FP_traduzTudo;
var _lang11='pt';
var _tmrs11=[];

var _RETRY11={
  'Se escolher essa opÃÂ§ÃÂ£o vocÃÂª terÃÂ¡ dois caminhos:':"By choosing this option, you'll have two paths:",
  'Se escolher essa opÃÂ§ÃÂ£o vocÃÂª terÃÂ¡':"By choosing this option, you'll have",
  '. Assim, na prÃÂ³xima etapa, vocÃÂª poderÃÂ¡ comparar os diferentes tamanhos disponÃÂ­veis e escolher com mais seguranÃÂ§a o modelo que melhor valoriza e acomoda a sua miniatura.':"In the next step, you'll be able to compare the available sizes and confidently choose the option that best showcases and fits your miniature.",
  'Nesta etapa, o objetivo principal ÃÂ© demonstrar a':"At this stage, the main goal is to show the vehicleÃ¢ÂÂs",
  'proporÃÂ§ÃÂ£o do veÃÂ­culo em relaÃÂ§ÃÂ£o ao quadro':'scale relative to the frame',
  'Escolher quadros para sua miniatura(s);':'Choose frames for your miniature(s);',
  'Escolher quadros prontos que jÃÂ¡ contenham miniaturas inclusas.':'Choose ready-made frames that already include miniatures.',
  'dois caminhos:':'two paths:',
  'dezenas de modelos de quadros':'dozens of frame models',
  'para fixar sua miniatura de Lego.':'to mount your Lego miniature.',
  'para Lego.':'frames for Lego.',
  'Clique no botÃÂ£o':'Click the button',
  ', abaixo e dÃÂª continuidade na experiÃÂªncia':', below and continue the experience',
  'ObservaÃÂ§ÃÂ£o:':'Note:'
};

function _substrApply11(subMap){
  try{
    var keys=Object.keys(subMap);
    if(!keys.length)return;
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
    var n,q=[];
    while((n=w.nextNode())){
      var t=n.textContent;
      var changed=false;
      for(var i=0;i<keys.length;i++){
        var pt=keys[i];
        if(t.indexOf(pt)!==-1){t=t.split(pt).join(subMap[pt]);changed=true;}
      }
      if(changed)q.push({n:n,v:t});
    }
    q.forEach(function(x){x.n.textContent=x.v;});
  }catch(e){}
}

function _runRetry11(capturedLang){
  if(_lang11!==capturedLang)return;
  if(capturedLang==='en')_substrApply11(_RETRY11);
}

window.FP_traduzTudo=function(lang){
  _lang11=lang;
  _p11.call(this,lang);
  for(var k=0;k<_tmrs11.length;k++)clearTimeout(_tmrs11[k]);
  _tmrs11=[];
  if(lang==='en'){
    _substrApply11(_RETRY11);
    var cl=lang;
    _tmrs11.push(setTimeout(function(){_runRetry11(cl);},150));
    _tmrs11.push(setTimeout(function(){_runRetry11(cl);},400));
    _tmrs11.push(setTimeout(function(){_runRetry11(cl);},900));
    _tmrs11.push(setTimeout(function(){_runRetry11(cl);},2000));
  }
};

(function(){
  function _p11Init(){
    var lang=localStorage.getItem('fp_lang')||'pt';
    if(lang==='en')_substrApply11(_RETRY11);
  }
  setTimeout(_p11Init,800);
  setTimeout(_p11Init,1500);
  setTimeout(_p11Init,3000);
})();

})();

;(function(){
'use strict';

/* PATCH 12 Ã¢ÂÂ sel* intercept + missing display-name translations.
   Three confirmed issues (EN mode):
   1. Order summary BACKGROUND stays PT Ã¢ÂÂ selFundo stores PT 3rd arg
   2. Preview "Textura Rexy" stays PT Ã¢ÂÂ LEGO_FUNDOS_DB nome field
   3. Cart "Retirar na fabrica" stays PT Ã¢ÂÂ _fpFreteRender injects PT HTML
   Fix: intercept selFundo/selMoldura/selDisp at source + substr observer */

var _lang12=(localStorage.getItem('fp_lang')||'pt');

var _SELMAP12={
  'AcrÃÂ­lico Brilho com ImpressÃÂ£o UV':'Glossy Acrylic Ã¢ÂÂ UV',
  'Fibra de Carbono (Vinil)':'Carbon Fiber (Vinyl)',
  'Fosco':'Matte',
  'Fibra de Carbono':'Carbon Fiber',
  'Laca Preto':'Black Lacquer',
  'Die-cast Ã¢ÂÂ disponÃÂ­vel no mercado':'Die-cast Ã¢ÂÂ available on market',
  'A verificar pela equipe Funparts':'To be verified by Funparts team',
  'ImpressÃÂ£o 3D + Pintura Automotiva':'3D Printing + Automotive Paint'
};

var _SUBSTR12={
  'AcrÃÂ­lico Brilho com ImpressÃÂ£o UV':'Glossy Acrylic Ã¢ÂÂ UV',
  'Fosco':'Matte',
  'Textura Rexy':'Texture Rexy',
  'TEXTURA REXY':'TEXTURE REXY',
  'DegrÃÂª Linear':'Linear Gradient',
  'DegrÃÂª':'Gradient',
  'Abstrato':'Abstract',
  'Setas':'Arrows',
  'Listra Central':'Center Stripe',
  'Listras':'Stripes',
  'Retirar na fÃÂ¡brica':'Factory pickup',
  'Retirar na FÃÂ¡brica':'Factory pickup',
  'RETIRAR NA FÃÂBRICA':'FACTORY PICKUP',
  'Seu carrinho':'Your cart',
  'Fechar pedido':'Complete order',
  'Die-cast Ã¢ÂÂ disponÃÂ­vel no mercado':'Die-cast Ã¢ÂÂ available on market',
  'A verificar pela equipe Funparts':'To be verified by Funparts team',
  'ImpressÃÂ£o 3D + Pintura Automotiva':'3D Printing + Automotive Paint'
};

function _substrApply12(subMap){
  try{
    var keys=Object.keys(subMap);
    if(!keys.length)return;
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
    var n,q=[];
    while((n=w.nextNode())){
      var t=n.textContent;
      var changed=false;
      for(var i=0;i<keys.length;i++){
        var pt=keys[i];
        if(t.indexOf(pt)!==-1){t=t.split(pt).join(subMap[pt]);changed=true;}
      }
      if(changed)q.push({n:n,v:t});
    }
    q.forEach(function(x){x.n.textContent=x.v;});
  }catch(e){}
}

function _patchSelFn12(fnName){
  if(typeof window[fnName]!=='function')return;
  var orig=window[fnName];
  window[fnName]=function(el,key,name){
    if(_lang12==='en'&&name&&_SELMAP12[name])name=_SELMAP12[name];
    return orig.call(this,el,key,name);
  };
}

function _applySelPatches12(){
  ['selFundo','selMoldura','selDisp'].forEach(_patchSelFn12);
}

if(typeof window.FP_traduzTudo==='function'){
  var _p12=window.FP_traduzTudo;
  window.FP_traduzTudo=function(lang){
    _lang12=lang;
    _p12.call(this,lang);
    if(lang==='en'){
      _substrApply12(_SUBSTR12);
      var cl=lang;
      setTimeout(function(){if(_lang12===cl)_substrApply12(_SUBSTR12);},200);
      setTimeout(function(){if(_lang12===cl)_substrApply12(_SUBSTR12);},600);
      setTimeout(function(){if(_lang12===cl)_substrApply12(_SUBSTR12);},1500);
    }
    _applySelPatches12();
  };
}

var _ob12=null,_tmr12=null;
function _startOb12(){
  if(_ob12)return;
  _ob12=new MutationObserver(function(ms){
    if(!ms.some(function(m){return m.addedNodes.length>0;}))return;
    if(_lang12!=='en')return;
    clearTimeout(_tmr12);
    _tmr12=setTimeout(function(){
      _substrApply12(_SUBSTR12);
      _applySelPatches12();
    },80);
  });
  _ob12.observe(document.body,{childList:true,subtree:true});
}

(function(){
  _applySelPatches12();
  if(_lang12==='en'){
    _substrApply12(_SUBSTR12);
    setTimeout(function(){_substrApply12(_SUBSTR12);},500);
    setTimeout(function(){_substrApply12(_SUBSTR12);},1200);
  }
  _startOb12();
})();

})();

;(function(){
'use strict';

/* PATCH 13 Ã¢ÂÂ LED field, FINALIZAR PEDIDO button, shipping subtitle & GrÃÂ¡tis.
   Four confirmed PT strings in EN mode:
   1. Order summary LED field: "Com iluminaÃÂ§ÃÂ£o LED" stays PT
      Ã¢ÂÂ Fix: intercept selLED (if present) + substr map
   2. Wizard step 8 bottom button: "FINALIZAR PEDIDO" stays PT
      Ã¢ÂÂ Root cause: existing _EN9 maps 'Finalizar pedido' but not the ALL-CAPS variant
      Ã¢ÂÂ Fix: add uppercase variant to substr map
   3. Shipping subtitle: "Combinar retirada" stays PT under FACTORY PICKUP
      Ã¢ÂÂ Fix: substr map + MutationObserver already running from patch12
   4. Shipping cost: "GrÃÂ¡tis" stays PT
      Ã¢ÂÂ Fix: substr map */

var _lang13 = (localStorage.getItem('fp_lang') || 'pt');

/* Ã¢ÂÂÃ¢ÂÂ MAP 1: sel* function 3rd-argument names Ã¢ÂÂÃ¢ÂÂ */
var _SELMAP13 = {
  /* selLED / selIluminacao */
  'Com iluminaÃÂ§ÃÂ£o LED':'With LED lighting',
  'Sem iluminaÃÂ§ÃÂ£o':'Without lighting',
  'Sem IluminaÃÂ§ÃÂ£o':'Without lighting',
  'SEM ILUMINAÃÂÃÂO':'WITHOUT LIGHTING',
  'Com IluminaÃÂ§ÃÂ£o LED':'With LED lighting',
  'COM ILUMINAÃÂÃÂO LED':'WITH LED LIGHTING'
};

/* Ã¢ÂÂÃ¢ÂÂ MAP 2: DOM text-node substr replacements Ã¢ÂÂÃ¢ÂÂ */
var _SUBSTR13 = {
  /* LED / lighting */
  'Com iluminaÃÂ§ÃÂ£o LED':'With LED lighting',
  'Com IluminaÃÂ§ÃÂ£o LED':'With LED lighting',
  'COM ILUMINAÃÂÃÂO LED':'WITH LED LIGHTING',
  'Sem iluminaÃÂ§ÃÂ£o':'Without lighting',
  'Sem IluminaÃÂ§ÃÂ£o':'Without lighting',
  'SEM ILUMINAÃÂÃÂO':'WITHOUT LIGHTING',
  /* Finalizar pedido Ã¢ÂÂ all case variants */
  'FINALIZAR PEDIDO':'COMPLETE ORDER',
  'Finalizar Pedido':'Complete Order',
  /* Shipping subtitle */
  'Combinar retirada':'Schedule pickup',
  'COMBINAR RETIRADA':'SCHEDULE PICKUP',
  /* Shipping cost */
  'GrÃÂ¡tis':'Free',
  'GRÃÂTIS':'FREE',
  'grÃÂ¡tis':'free'
};

function _substrApply13(subMap){
  try{
    var keys=Object.keys(subMap);
    if(!keys.length)return;
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
    var n,q=[];
    while((n=w.nextNode())){
      var t=n.textContent;
      var changed=false;
      for(var i=0;i<keys.length;i++){
        var pt=keys[i];
        if(t.indexOf(pt)!==-1){t=t.split(pt).join(subMap[pt]);changed=true;}
      }
      if(changed)q.push({n:n,v:t});
    }
    q.forEach(function(x){x.n.textContent=x.v;});
  }catch(e){}
}

/* Ã¢ÂÂÃ¢ÂÂ INTERCEPT sel* FUNCTIONS Ã¢ÂÂÃ¢ÂÂ */
function _patchSelFn13(fnName){
  if(typeof window[fnName]!=='function')return;
  var orig=window[fnName];
  window[fnName]=function(el,key,name){
    if(_lang13==='en'&&name&&_SELMAP13[name]){
      name=_SELMAP13[name];
    }
    return orig.call(this,el,key,name);
  };
}

function _applySelPatches13(){
  ['selLED','selIluminacao','selIluminaÃÂ§ÃÂ£o'].forEach(_patchSelFn13);
}

/* Ã¢ÂÂÃ¢ÂÂ INTERCEPT FP_traduzTudo Ã¢ÂÂÃ¢ÂÂ */
if(typeof window.FP_traduzTudo==='function'){
  var _p13=window.FP_traduzTudo;
  window.FP_traduzTudo=function(lang){
    _lang13=lang;
    _p13.call(this,lang);
    if(lang==='en'){
      _substrApply13(_SUBSTR13);
      var cl=lang;
      setTimeout(function(){if(_lang13===cl)_substrApply13(_SUBSTR13);},200);
      setTimeout(function(){if(_lang13===cl)_substrApply13(_SUBSTR13);},600);
      setTimeout(function(){if(_lang13===cl)_substrApply13(_SUBSTR13);},1500);
    }
    _applySelPatches13();
  };
}

/* Ã¢ÂÂÃ¢ÂÂ PERSISTENT MUTATION OBSERVER Ã¢ÂÂÃ¢ÂÂ */
var _ob13=null;
var _tmr13=null;
function _startOb13(){
  if(_ob13)return;
  _ob13=new MutationObserver(function(ms){
    if(!ms.some(function(m){return m.addedNodes.length>0;}))return;
    if(_lang13!=='en')return;
    clearTimeout(_tmr13);
    _tmr13=setTimeout(function(){
      _substrApply13(_SUBSTR13);
      _applySelPatches13();
    },80);
  });
  _ob13.observe(document.body,{childList:true,subtree:true});
}

/* Ã¢ÂÂÃ¢ÂÂ INITIAL LOAD Ã¢ÂÂÃ¢ÂÂ */
(function(){
  _applySelPatches13();
  if(_lang13==='en'){
    _substrApply13(_SUBSTR13);
    setTimeout(function(){_substrApply13(_SUBSTR13);},500);
    setTimeout(function(){_substrApply13(_SUBSTR13);},1200);
  }
  _startOb13();
})();

})();

;(function(){
'use strict';

/* PATCH 14 Ã¢ÂÂ ESCOLHA O FRETE, CONTINUAR, FINALIZAR PEDIDO.
   Three confirmed PT strings in EN mode:
   1. Shipping modal header: "ESCOLHA O FRETE"
   2. Shipping modal button: "CONTINUAR"
   3. Order summary green button: "FINALIZAR PEDIDO" (patch13 added it but
      React re-renders the button AFTER the observer debounce window) */

var _lang14 = (localStorage.getItem('fp_lang') || 'pt');

var _SUBSTR14 = {
  'ESCOLHA O FRETE':'SELECT SHIPPING',
  'Escolha o frete':'Select shipping',
  'Escolha o Frete':'Select shipping',
  'CONTINUAR':'CONTINUE',
  'Continuar':'Continue',
  'FINALIZAR PEDIDO':'COMPLETE ORDER',
  'Finalizar Pedido':'Complete Order',
  'Finalizar pedido':'Complete order',
  'Digite seu CEP':'Enter your ZIP code'
};

function _substrApply14(subMap){
  try{
    var keys=Object.keys(subMap);
    if(!keys.length)return;
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
    var n,q=[];
    while((n=w.nextNode())){
      var t=n.textContent;
      var changed=false;
      for(var i=0;i<keys.length;i++){
        var pt=keys[i];
        if(t.indexOf(pt)!==-1){t=t.split(pt).join(subMap[pt]);changed=true;}
      }
      if(changed)q.push({n:n,v:t});
    }
    q.forEach(function(x){x.n.textContent=x.v;});
  }catch(e){}
}

/* Ã¢ÂÂÃ¢ÂÂ INTERCEPT FP_traduzTudo Ã¢ÂÂÃ¢ÂÂ */
if(typeof window.FP_traduzTudo==='function'){
  var _p14=window.FP_traduzTudo;
  window.FP_traduzTudo=function(lang){
    _lang14=lang;
    _p14.call(this,lang);
    if(lang==='en'){
      var cl=lang;
      /* Aggressive retry schedule Ã¢ÂÂ React re-renders buttons late */
      [50,150,300,600,1000,1800,3000].forEach(function(ms){
        setTimeout(function(){if(_lang14===cl)_substrApply14(_SUBSTR14);},ms);
      });
    }
  };
}

/* Ã¢ÂÂÃ¢ÂÂ PERSISTENT MUTATION OBSERVER Ã¢ÂÂ 40ms debounce (tighter window) Ã¢ÂÂÃ¢ÂÂ */
var _ob14=null;
var _tmr14=null;
function _startOb14(){
  if(_ob14)return;
  _ob14=new MutationObserver(function(ms){
    if(!ms.some(function(m){return m.addedNodes.length>0;}))return;
    if(_lang14!=='en')return;
    clearTimeout(_tmr14);
    _tmr14=setTimeout(function(){_substrApply14(_SUBSTR14);},40);
  });
  _ob14.observe(document.body,{childList:true,subtree:true});
}

/* Ã¢ÂÂÃ¢ÂÂ INITIAL LOAD Ã¢ÂÂÃ¢ÂÂ */
(function(){
  if(_lang14==='en'){
    _substrApply14(_SUBSTR14);
    [300,800,1600,3000].forEach(function(ms){
      setTimeout(function(){_substrApply14(_SUBSTR14);},ms);
    });
  }
  _startOb14();
})();

})();


/* ââ FIX: moldura 49Ã49cm â aspect-ratio quadrado ââââââââââââââââââââââ
   Produtos LEGO com dim:'49Ã49cm' recebem classe .dim4949, mas
   app_1.js aplica inline style aspect-ratio:53/83 (portrait).
   Patch: (1) CSS !important vence inline style; (2) corrige inline
   style via JS imediato + MutationObserver para mudanÃ§as dinÃ¢micas.  */
(function(){
  // 1. Injetar regra CSS com !important â tem precedÃªncia sobre inline style
  var _st49 = document.createElement('style');
  _st49.id = 'fp-dim4949-fix';
  _st49.textContent =
    '.dim4949{aspect-ratio:1/1!important;}' +
    '.dim4949 [style]{aspect-ratio:1/1!important;}';
  document.head.appendChild(_st49);

  // 2. Corrigir inline style diretamente (belt-and-suspenders)
  function _fix49(){
    document.querySelectorAll('.dim4949').forEach(function(el){
      if(el.style.aspectRatio && el.style.aspectRatio.replace(/\s/g,'') !== '1/1'){
        el.style.aspectRatio = '1/1';
      }
      // Corrigir tambÃ©m filhos com inline aspect-ratio errado
      el.querySelectorAll('[style]').forEach(function(child){
        if(child.style.aspectRatio && child.style.aspectRatio.replace(/\s/g,'') !== '1/1'){
          child.style.aspectRatio = '1/1';
        }
      });
    });
  }

  // 3. Patch selFrameSize â roda correÃ§Ã£o logo apÃ³s a funÃ§Ã£o original
  if(typeof window.selFrameSize === 'function'){
    var _origSFS49 = window.selFrameSize;
    window.selFrameSize = function(el, dim){
      var r = _origSFS49.apply(this, arguments);
      setTimeout(_fix49, 0);
      return r;
    };
  }

  // 4. Rodar imediatamente e em delays pÃ³s-renderizaÃ§Ã£o
  _fix49();
  [100, 300, 800, 1500, 3000].forEach(function(ms){
    setTimeout(_fix49, ms);
  });

  // 5. MutationObserver para mudanÃ§as dinÃ¢micas (ex: troca de produto)
  var _ob49, _tmr49;
  function _start49(){
    if(_ob49) return;
    _ob49 = new MutationObserver(function(ms){
      var relevant = ms.some(function(m){
        return (m.type === 'attributes') ||
               (m.addedNodes.length > 0);
      });
      if(!relevant) return;
      clearTimeout(_tmr49);
      _tmr49 = setTimeout(_fix49, 40);
    });
    _ob49.observe(document.body,{
      childList: true, subtree: true,
      attributes: true, attributeFilter: ['style','class']
    });
  }
  if(document.body) _start49();
  else document.addEventListener('DOMContentLoaded', _start49);
})();


/* ━━ Proporcao da moldura no preview ━━━━━━━━━━━━━━━━━━━━━
   O #legoDetQuadro nasce com aspect-ratio:53/83 escrito no proprio HTML.
   Quando a rotina que deveria corrigir isso nao roda (ou roda antes da
   dimensao existir), o produto 49x49 fica desenhado com a moldura do 53x83.
   Este bloco e' a ultima palavra: le a dimensao do proprio produto -- a
   mesma que aparece embaixo do nome na tela -- e aplica a proporcao dela
   nos dois quadros de preview.                                        */
(function(){
  /* A dimensao e' a fonte da verdade, nao uma lista de nomes escrita a mao:
     dos 8 quadros 49x49 do catalogo so 3 estavam na lista antiga, e os
     outros 5 (DeLorean, Renault F1, Mini F1, Mercedes AMG One, BMW GS 1250)
     apareciam com a moldura do 53x83. Produto novo entra sozinho. */
  function _fpRatioDaDim(dim){
    var n = String(dim || '').match(/\d+(?:[.,]\d+)?/g);
    if (!n || n.length < 2) return '';
    var a = parseFloat(String(n[0]).replace(',', '.'));
    var b = parseFloat(String(n[1]).replace(',', '.'));
    if (!(a > 0 && b > 0)) return '';
    /* quadrado sai como 1/1 para falar a mesma lingua do outro bloco de
       correcao -- se um escrevesse 49/49 e o outro 1/1, os dois ficariam
       se corrigindo em looping */
    if (Math.abs(a - b) < 0.001) return '1/1';
    return a + '/' + b;
  }

  var _fixing49v2 = false;
  function fixDetQuadro(){
    if(_fixing49v2) return;
    try {
      if (typeof S === 'undefined' || S.tipo !== 'lego') return;
      var r = _fpRatioDaDim(S.legoDim);
      if (!r) return;                    /* dimensao ilegivel: nao mexe em nada */
      _fixing49v2 = true;
      [document.getElementById('legoDetQuadro'),
       document.querySelector('#livePv .quadro')].forEach(function(el){
        if (!el) return;
        if (String(el.style.aspectRatio || '').replace(/\s/g, '') === r) return;
        el.style.aspectRatio = r;
      });
    } catch(e){
    } finally { _fixing49v2 = false; }
  }

  // Rodar imediatamente e após cada renderização
  fixDetQuadro();
  [100, 300, 600, 1200, 2500].forEach(function(ms){ setTimeout(fixDetQuadro, ms); });

  // Patch goStep — roda correção sempre que muda de etapa
  var _origGS49 = window.goStep;
  if(typeof _origGS49 === 'function'){
    window.goStep = function(n){
      var r = _origGS49.apply(this, arguments);
      setTimeout(fixDetQuadro, 50);
      setTimeout(fixDetQuadro, 250);
      return r;
    };
  }

  // Patch selLegoModel — roda correção quando muda de modelo
  var _origSLM49 = window.selLegoModel;
  if(typeof _origSLM49 === 'function'){
    window.selLegoModel = function(){
      var r = _origSLM49.apply(this, arguments);
      setTimeout(fixDetQuadro, 50);
      setTimeout(fixDetQuadro, 300);
      return r;
    };
  }

  // MutationObserver: corrige quando o style de #legoDetQuadro muda
  var _ob49v2;
  function startObs49v2(){
    /* body, e nao so o #legoDetQuadro: o quadro do visualizador (#livePv)
       tambem precisa ser vigiado, e ele nem sempre existe no inicio */
    var target = document.body;
    if(_ob49v2){ _ob49v2.disconnect(); }
    _ob49v2 = new MutationObserver(function(ms){
      var relevant = ms.some(function(m){
        return (m.type==='attributes' && m.attributeName==='style') ||
               (m.type==='childList' && m.addedNodes.length > 0);
      });
      if(!relevant) return;
      clearTimeout(window._tmr49v2);
      window._tmr49v2 = setTimeout(fixDetQuadro, 30);
    });
    _ob49v2.observe(target, {
      attributes: true, attributeFilter: ['style'],
      childList: true, subtree: true
    });
  }
  if(document.body) startObs49v2();
  else document.addEventListener('DOMContentLoaded', startObs49v2);

  window._fixDetQuadro49v2 = fixDetQuadro;
})();


/* ============ O QUE O DICIONARIO DE FRASES NAO ALCANCA ============
   O tradutor do site troca frases inteiras em nos de texto e em placeholders.
   Sobram tres casos, todos encontrados na auditoria de 06/09/2026:

   1. ATRIBUTOS title (as dicas que aparecem ao passar o mouse). Sao apenas
      dois no site e os dois mostravam acentuacao quebrada ate em portugues,
      porque o conserto de acentuacao que roda no navegador arruma texto de
      pagina e nao mexe em atributo. Agora eles sao escritos por aqui, ja com
      o acento certo, nos quatro idiomas.
   2. Os nomes de cor da paleta, que tambem vivem em title.
   3. Frases coladas a um nome de produto, como "Visualizador . Ferrari SF24"
      e '"Ferrari Daytona SP3" adicionado'. Como o texto muda a cada produto,
      nenhuma frase inteira bate: aqui a troca e' por pedaco.

   Roda depois de cada troca de idioma e sempre que a pagina muda.
   Se algo faltar, sai sem fazer nada (nunca quebra a pagina). */
(function(){
  var FRASES=[
    {pt:"Qual \u00e9 o seu colecion\u00e1vel? Tudo come\u00e7a aqui.",en:"What's your collectible? It all starts here.",es:"\u00bfCu\u00e1l es tu coleccionable? Todo empieza aqu\u00ed.",fr:"Quel est votre objet de collection ? Tout commence ici."},
    {pt:"Nessa op\u00e7\u00e3o voc\u00ea ter\u00e1 a oportunidade de personalizar um quadro para a sua miniatura especial",en:"In this option you can customize a frame for your special model",es:"En esta opci\u00f3n podr\u00e1s personalizar un cuadro para tu miniatura especial",fr:"Dans cette option, vous pourrez personnaliser un cadre pour votre miniature"},
    {pt:"Nessa op\u00e7\u00e3o voc\u00ea encontrar\u00e1 quadros que j\u00e1 s\u00e3o vendidos completos. Contendo o quadro e a miniatura",en:"In this option you'll find frames sold complete, including the frame and the model",es:"En esta opci\u00f3n encontrar\u00e1s cuadros que se venden completos: el cuadro y la miniatura",fr:"Dans cette option, vous trouverez des cadres vendus complets, avec le cadre et la miniature"},
    {pt:"Escolher quadros prontos que j\u00e1 contenham miniaturas inclusas.",en:"Choose ready-made frames that already include the model car.",es:"Elegir cuadros listos que ya incluyen la miniatura.",fr:"Choisir des cadres pr\u00eats qui incluent d\u00e9j\u00e0 la miniature."},
    {pt:"EU J\u00c1 TENHO A MINIATURA",en:"I ALREADY HAVE THE MODEL",es:"YA TENGO LA MINIATURA",fr:"J'AI D\u00c9J\u00c0 LA MINIATURE"},
    {pt:"Confirmo que j\u00e1 tenho a miniatura e gostaria de comprar apenas o quadro.",en:"I confirm I already have the model and would like to buy only the frame.",es:"Confirmo que ya tengo la miniatura y deseo comprar solo el cuadro.",fr:"Je confirme avoir d\u00e9j\u00e0 la miniature et souhaite acheter uniquement le cadre."},
    {pt:"Nessa op\u00e7\u00e3o n\u00e3o est\u00e1 incluso a miniatura. Produzimos e vendemos apenas os quadros",en:"This option does not include the miniature. We only produce and sell",es:"Esta opci\u00f3n no incluye la miniatura. Solo producimos y vendemos los cuadros",fr:"Cette option n'inclut pas la miniature. Nous produisons et vendons uniquement les cadres"},
    {pt:"para Lego.",en:"frames for Lego.",es:"para Lego.",fr:"pour Lego."},
    {pt:"Se escolher essa op\u00e7\u00e3o voc\u00ea ter\u00e1",en:"By choosing this option, you'll have",es:"Si eliges esta opci\u00f3n tendr\u00e1s",fr:"En choisissant cette option, vous aurez"},
    {pt:"dezenas de modelos de quadros",en:"dozens of frame models",es:"decenas de modelos de cuadros",fr:"des dizaines de mod\u00e8les de cadres"},
    {pt:"para fixar sua miniatura de Lego.",en:"to mount your Lego miniature.",es:"para fijar tu miniatura de Lego.",fr:"pour fixer votre miniature Lego."},
    {pt:"Observa\u00e7\u00e3o:",en:"Note:",es:"Nota:",fr:"Remarque :"},
    {pt:"Modelo LEGO",en:"LEGO Model",es:"Modelo LEGO",fr:"Mod\u00e8le LEGO"},
    {pt:"Modelo",en:"Model",es:"Modelo",fr:"Mod\u00e8le"},
    {pt:"Selecione a marca e depois o modelo espec\u00edfico",en:"Select the brand and then the specific model",es:"Selecciona la marca y luego el modelo espec\u00edfico",fr:"S\u00e9lectionnez la marque puis le mod\u00e8le pr\u00e9cis"},
    {pt:"Selecione o quadro da sua prefer\u00eancia",en:"Select the frame you prefer",es:"Selecciona el cuadro que prefieras",fr:"S\u00e9lectionnez le cadre de votre choix"},
    {pt:"Modelos dispon\u00edveis",en:"Available models",es:"Modelos disponibles",fr:"Mod\u00e8les disponibles"},
    {pt:"Filmes",en:"Movies",es:"Pel\u00edculas",fr:"Films"},
    {pt:"Motos",en:"Motorcycles",es:"Motos",fr:"Motos"},
    {pt:"F\u00f3rmula 1",en:"Formula 1",es:"F\u00f3rmula 1",fr:"Formule 1"},
    {pt:"Ferrari Cole\u00e7\u00e3o Burago",en:"Ferrari Burago Collection",es:"Ferrari Colecci\u00f3n Burago",fr:"Ferrari Collection Burago"},
    {pt:"Miniatura",en:"Model",es:"Miniatura",fr:"Miniature"},
    {pt:"Confirme que j\u00e1 possui a miniatura para montagem no quadro.",en:"Confirm you already own the model to mount in the frame.",es:"Confirma que ya tienes la miniatura para montarla en el cuadro.",fr:"Confirmez que vous poss\u00e9dez d\u00e9j\u00e0 la miniature \u00e0 monter dans le cadre."},
    {pt:"\u26a0 ATEN\u00c7\u00c3O: MINIATURA N\u00c3O INCLUSA",en:"\u26a0 PLEASE NOTE: MODEL CAR NOT INCLUDED",es:"\u26a0 ATENCI\u00d3N: MINIATURA NO INCLUIDA",fr:"\u26a0 ATTENTION : MINIATURE NON INCLUSE"},
    {pt:"Esta op\u00e7\u00e3o de personaliza\u00e7\u00e3o refere-se exclusivamente \u00e0 produ\u00e7\u00e3o do quadro. A miniatura diecast exibida nas imagens (via intelig\u00eancia artificial) n\u00e3o acompanha o produto e n\u00e3o est\u00e1 inclusa na compra.",en:"This customisation covers the production of the frame only. The die-cast model shown in the images (generated by artificial intelligence) does not come with the product and is not included in the purchase.",es:"Esta personalizaci\u00f3n se refiere exclusivamente a la producci\u00f3n del cuadro. La miniatura die-cast que aparece en las im\u00e1genes (generada con inteligencia artificial) no acompa\u00f1a al producto ni est\u00e1 incluida en la compra.",fr:"Cette personnalisation concerne uniquement la fabrication du cadre. La miniature die-cast visible sur les images (g\u00e9n\u00e9r\u00e9e par intelligence artificielle) n'accompagne pas le produit et n'est pas incluse dans l'achat."},
    {pt:"Este servi\u00e7o \u00e9 destinado a clientes que j\u00e1 possuem a pr\u00f3pria miniatura e desejam transform\u00e1-la em uma pe\u00e7a decorativa exclusiva, fixando-a na parede de maneira inovadora e elegante.",en:"This service is for customers who already own their model car and want to turn it into an exclusive decorative piece, mounted on the wall in an elegant, original way.",es:"Este servicio est\u00e1 pensado para clientes que ya tienen su propia miniatura y quieren convertirla en una pieza decorativa exclusiva, fijada a la pared de forma innovadora y elegante.",fr:"Ce service s'adresse aux clients qui poss\u00e8dent d\u00e9j\u00e0 leur miniature et souhaitent en faire une pi\u00e8ce d\u00e9corative exclusive, fix\u00e9e au mur de fa\u00e7on \u00e9l\u00e9gante et originale."},
    {pt:"O quadro ser\u00e1 enviado pronto para que voc\u00ea fa\u00e7a a instala\u00e7\u00e3o da miniatura utilizando parafusos, de forma simples e pr\u00e1tica. O kit inclui: quadro personalizado, buchas, parafusos e gabarito de instala\u00e7\u00e3o, facilitando tanto a fixa\u00e7\u00e3o da miniatura no quadro quanto a instala\u00e7\u00e3o do quadro na parede.",en:"The frame ships ready for you to mount the model car with screws, simply and quickly. The kit includes: the customised frame, wall plugs, screws and an installation template, making it easy both to fix the model in the frame and to hang the frame on the wall.",es:"El cuadro se env\u00eda listo para que instales la miniatura con tornillos, de forma sencilla y pr\u00e1ctica. El kit incluye: cuadro personalizado, tacos, tornillos y plantilla de instalaci\u00f3n, facilitando tanto la fijaci\u00f3n de la miniatura como la instalaci\u00f3n del cuadro en la pared.",fr:"Le cadre est livr\u00e9 pr\u00eat \u00e0 recevoir la miniature, fix\u00e9e avec des vis, simplement et rapidement. Le kit comprend : le cadre personnalis\u00e9, des chevilles, des vis et un gabarit de pose, pour fixer facilement la miniature dans le cadre et le cadre au mur."},
    {pt:"Geramos a imagem da sua miniatura com intelig\u00eancia Artificial, para que confirme o modelo e consiga personalizar seu quadro o mais pr\u00f3ximo da realidade poss\u00edvel.",en:"We generated your model image with Artificial Intelligence so you can confirm the model and customize your frame as close to reality as possible.",es:"Generamos la imagen de tu miniatura con Inteligencia Artificial para que confirmes el modelo y personalices tu cuadro lo m\u00e1s fiel posible.",fr:"Nous avons g\u00e9n\u00e9r\u00e9 l'image de votre miniature par Intelligence Artificielle afin que vous confirmiez le mod\u00e8le et personnalisiez votre cadre au plus pr\u00e8s de la r\u00e9alit\u00e9."},
    {pt:"Clique no bot\u00e3o",en:"Click the button",es:"Haz clic en el bot\u00f3n",fr:"Cliquez sur le bouton"},
    {pt:", abaixo e d\u00ea continuidade na experi\u00eancia",en:" below to continue",es:" de abajo y contin\u00faa la experiencia",fr:" ci-dessous pour continuer"},
    {pt:"\u2726 GERAR VISUALIZA\u00c7\u00c3O COM IA",en:"\u2726 GENERATE AI PREVIEW",es:"\u2726 GENERAR VISTA PREVIA CON IA",fr:"\u2726 G\u00c9N\u00c9RER L'APER\u00c7U PAR IA"},
    {pt:"\u2726 Visualiza\u00e7\u00e3o gerada por Intelig\u00eancia Artificial",en:"\u2726 Preview generated by Artificial Intelligence",es:"\u2726 Vista previa generada por Inteligencia Artificial",fr:"\u2726 Aper\u00e7u g\u00e9n\u00e9r\u00e9 par Intelligence Artificielle"},
    {pt:"Ex: 488 GTB, Senna, 911 Turbo S...",en:"e.g. 488 GTB, Senna, 911 Turbo S\u2026",es:"Ej.: 488 GTB, Senna, 911 Turbo S\u2026",fr:"Ex. : 488 GTB, Senna, 911 Turbo S\u2026"},
    {pt:"Amarelo",en:"Yellow",es:"Amarillo",fr:"Jaune"},
    {pt:"Azul Celeste",en:"Sky Blue",es:"Azul Celeste",fr:"Bleu Ciel"},
    {pt:"Azul Met\u00e1lico",en:"Metallic Blue",es:"Azul Met\u00e1lico",fr:"Bleu M\u00e9tallis\u00e9"},
    {pt:"Branco",en:"White",es:"Blanco",fr:"Blanc"},
    {pt:"Champagne",en:"Champagne",es:"Champ\u00e1n",fr:"Champagne"},
    {pt:"Cinza Escuro",en:"Dark Grey",es:"Gris Oscuro",fr:"Gris Fonc\u00e9"},
    {pt:"Cinza Grafite",en:"Graphite Grey",es:"Gris Grafito",fr:"Gris Graphite"},
    {pt:"Dourado",en:"Gold",es:"Dorado",fr:"Dor\u00e9"},
    {pt:"Laranja",en:"Orange",es:"Naranja",fr:"Orange"},
    {pt:"Prata",en:"Silver",es:"Plata",fr:"Argent"},
    {pt:"Preto",en:"Black",es:"Negro",fr:"Noir"},
    {pt:"Rosa",en:"Pink",es:"Rosa",fr:"Rose"},
    {pt:"Roxo",en:"Purple",es:"Morado",fr:"Violet"},
    {pt:"Turquesa",en:"Turquoise",es:"Turquesa",fr:"Turquoise"},
    {pt:"Verde Brit\u00e2nico",en:"British Green",es:"Verde Brit\u00e1nico",fr:"Vert Anglais"},
    {pt:"Verde Lima",en:"Lime Green",es:"Verde Lima",fr:"Vert Citron"},
    {pt:"Vermelho Escuro",en:"Dark Red",es:"Rojo Oscuro",fr:"Rouge Fonc\u00e9"},
    {pt:"Vermelho Ferrari",en:"Ferrari Red",es:"Rojo Ferrari",fr:"Rouge Ferrari"},
    {pt:"Dimens\u00e3o",en:"Dimensions",es:"Dimensi\u00f3n",fr:"Dimensions"},
    {pt:"Dimens\u00e3o do quadro",en:"Frame size",es:"Dimensi\u00f3n del cuadro",fr:"Dimensions du cadre"},
    {pt:"Especifica\u00e7\u00f5es da miniatura e do quadro",en:"Model car and frame specifications",es:"Especificaciones de la miniatura y del cuadro",fr:"Caract\u00e9ristiques de la miniature et du cadre"},
    {pt:"Acr\u00edlico Brilho \u2014 UV",en:"Glossy Acrylic \u2014 UV",es:"Acr\u00edlico brillo \u2014 UV",fr:"Acrylique brillant \u2014 UV"},
    {pt:"Impress\u00e3o UV em acr\u00edlico de alto brilho. Cores profundas, acabamento espelhado.",en:"UV printing on high-gloss acrylic. Deep colors, mirror finish.",es:"Impresi\u00f3n UV en acr\u00edlico de alto brillo. Colores profundos, acabado espejado.",fr:"Impression UV sur acrylique tr\u00e8s brillant. Couleurs profondes, finition miroir."},
    {pt:"Ilumina\u00e7\u00e3o LED",en:"LED Lighting",es:"Iluminaci\u00f3n LED",fr:"\u00c9clairage LED"},
    {pt:"\ud83d\udca1 Ilumina\u00e7\u00e3o LED interna",en:"\ud83d\udca1 Internal LED lighting",es:"\ud83d\udca1 Iluminaci\u00f3n LED interna",fr:"\ud83d\udca1 \u00c9clairage LED int\u00e9rieur"},
    {pt:"Retroilumina\u00e7\u00e3o no interior do quadro \u2014 efeito espetacular no ambiente",en:"Backlighting inside the frame \u2014 a stunning effect in the room",es:"Retroiluminaci\u00f3n en el interior del cuadro \u2014 efecto espectacular en el ambiente",fr:"R\u00e9tro\u00e9clairage \u00e0 l'int\u00e9rieur du cadre \u2014 effet spectaculaire dans la pi\u00e8ce"},
    {pt:"(sempre inclu\u00eddos)",en:"(always included)",es:"(siempre incluidos)",fr:"(toujours inclus)"},
    {pt:"\ud83c\udff4 Bandeira do Pa\u00eds",en:"\ud83c\udff4 Country flag",es:"\ud83c\udff4 Bandera del pa\u00eds",fr:"\ud83c\udff4 Drapeau du pays"},
    {pt:"Canto superior direito \u2014 bandeira do piloto ou escuderia em relevo",en:"Top right corner \u2014 driver or team flag in relief",es:"Esquina superior derecha \u2014 bandera del piloto o escuder\u00eda en relieve",fr:"Coin sup\u00e9rieur droit \u2014 drapeau du pilote ou de l'\u00e9curie en relief"},
    {pt:"\ud83d\udc64 Nome do Piloto",en:"\ud83d\udc64 Driver Name",es:"\ud83d\udc64 Nombre del piloto",fr:"\ud83d\udc64 Nom du pilote"},
    {pt:"Canto inferior esquerdo \u2014 at\u00e9 20 caracteres gravados em relevo",en:"Bottom left corner \u2014 up to 20 characters engraved in relief",es:"Esquina inferior izquierda \u2014 hasta 20 caracteres grabados en relieve",fr:"Coin inf\u00e9rieur gauche \u2014 jusqu'\u00e0 20 caract\u00e8res grav\u00e9s en relief"},
    {pt:"Resumo",en:"Summary",es:"Resumen",fr:"R\u00e9capitulatif"},
    {pt:"Revise a configura\u00e7\u00e3o e finalize o pedido",en:"Review your setup and complete the order",es:"Revisa la configuraci\u00f3n y finaliza el pedido",fr:"V\u00e9rifiez la configuration et finalisez la commande"},
    {pt:"Envio pr\u00f3prio",en:"Own delivery",es:"Env\u00edo propio",fr:"Livraison en propre"},
    {pt:"Tirar d\u00favidas no WhatsApp",en:"Questions on WhatsApp",es:"Consultas por WhatsApp",fr:"Questions sur WhatsApp"},
    {pt:"\ud83c\udfc6 Artesanal",en:"\ud83c\udfc6 Handcrafted",es:"\ud83c\udfc6 Artesanal",fr:"\ud83c\udfc6 Fait main"},
    {pt:"\ud83d\udce6 Embalagem Premium",en:"\ud83d\udce6 Premium Packaging",es:"\ud83d\udce6 Embalaje premium",fr:"\ud83d\udce6 Emballage premium"},
    {pt:"\u23f1 7\u201312 dias \u00fateis",en:"\u23f1 7\u201312 business days",es:"\u23f1 7\u201312 d\u00edas h\u00e1biles",fr:"\u23f1 7 \u00e0 12 jours ouvr\u00e9s"},
    {pt:"\u2708 Todo o Brasil",en:"\u2708 Across Brazil",es:"\u2708 Todo Brasil",fr:"\u2708 Partout au Br\u00e9sil"},
    {pt:"Seus dados",en:"Your details",es:"Tus datos",fr:"Vos coordonn\u00e9es"},
    {pt:"Endere\u00e7o",en:"Address",es:"Direcci\u00f3n",fr:"Adresse"},
    {pt:"N\u00famero",en:"Number",es:"N\u00famero",fr:"Num\u00e9ro"},
    {pt:"Complemento",en:"Address line 2",es:"Complemento",fr:"Compl\u00e9ment"},
    {pt:"(opcional)",en:"(optional)",es:"(opcional)",fr:"(facultatif)"},
    {pt:"Seus dados s\u00e3o usados apenas para emitir a nota fiscal e realizar a entrega.",en:"Your data is used only to issue the invoice and complete delivery.",es:"Tus datos se usan solo para emitir la factura y realizar la entrega.",fr:"Vos donn\u00e9es servent uniquement \u00e0 \u00e9mettre la facture et \u00e0 effectuer la livraison."},
    {pt:"RETIRAR NA F\u00c1BRICA",en:"FACTORY PICKUP",es:"RECOGIDA EN F\u00c1BRICA",fr:"RETRAIT \u00c0 L'ATELIER"},
    {pt:"Gr\u00e1tis",en:"Free",es:"Gratis",fr:"Gratuit"},
    {pt:"8 dias \u00fateis",en:"8 business days",es:"8 d\u00edas h\u00e1biles",fr:"8 jours ouvr\u00e9s"},
    {pt:"Cupom de desconto",en:"Discount code",es:"C\u00f3digo de descuento",fr:"Code de r\u00e9duction"},
    {pt:"Digite seu cupom",en:"Enter your code",es:"Introduce tu c\u00f3digo",fr:"Saisissez votre code"},
    {pt:"Aplicar",en:"Apply",es:"Aplicar",fr:"Appliquer"},
    {pt:"Digite seu CEP",en:"Enter your postal code",es:"Introduce tu c\u00f3digo postal",fr:"Saisissez votre code postal"},
    {pt:"Nova personaliza\u00e7\u00e3o",en:"New customisation",es:"Nueva personalizaci\u00f3n",fr:"Nouvelle personnalisation"},
    {pt:"Come\u00e7ar uma personaliza\u00e7\u00e3o do zero (mant\u00e9m o carrinho)",en:"Start a customization from scratch (keeps the cart)",es:"Empezar una personalizaci\u00f3n desde cero (mantiene el carrito)",fr:"D\u00e9marrer une personnalisation de z\u00e9ro (conserve le panier)"},
    {pt:"Se o carro vier de cabe\u00e7a para baixo, clique para corrigir",en:"If the car appears upside down, click to fix",es:"Si el coche aparece al rev\u00e9s, haz clic para corregir",fr:"Si la voiture est \u00e0 l'envers, cliquez pour corriger"},
    {pt:"VEJA O EXEMPLO DA PROPOR\u00c7\u00c3O (DIMENS\u00c3O) DO QUADRO",en:"SEE AN EXAMPLE OF THE FRAME PROPORTION (SIZE)",es:"MIRA UN EJEMPLO DE LA PROPORCI\u00d3N (TAMA\u00d1O) DEL CUADRO",fr:"VOYEZ UN EXEMPLE DE LA PROPORTION (TAILLE) DU CADRE"},
    {pt:"A partir do exemplo acima, voc\u00ea conseguir\u00e1 ter a no\u00e7\u00e3o geral da dimens\u00e3o do quadro comparado a dimens\u00e3o de uma pessoa com 1,75m de altura",en:"From the example above, you can get a general sense of the frame size compared to a person 1.75 m tall",es:"Con el ejemplo de arriba podr\u00e1s hacerte una idea del tama\u00f1o del cuadro comparado con una persona de 1,75 m de altura",fr:"\u00c0 partir de l'exemple ci-dessus, vous aurez une id\u00e9e g\u00e9n\u00e9rale de la taille du cadre par rapport \u00e0 une personne d'1,75 m"},
    {pt:"SIGA AS ORIENTA\u00c7\u00d5ES",en:"FOLLOW THE STEPS",es:"SIGUE LAS INSTRUCCIONES",fr:"SUIVEZ LES INDICATIONS"},
    {pt:"Linha completa de quadros",en:"The complete frame range",es:"La gama completa de cuadros",fr:"La gamme compl\u00e8te de cadres"},
    {pt:"Total:",en:"Total:",es:"Total:",fr:"Total :"},
    {pt:"Total estimado",en:"Estimated total",es:"Total estimado",fr:"Total estim\u00e9"},
    {pt:"Sem frete \u2022 Pre\u00e7o pode variar",en:"Shipping not included \u2022 Price may vary",es:"Env\u00edo no incluido \u2022 El precio puede variar",fr:"Livraison non incluse \u2022 Le prix peut varier"},
    {pt:"DE PERSONALIZAR",en:"TO CUSTOMIZE",es:"DE PERSONALIZAR",fr:"DE PERSONNALISER"},
    {pt:"Pr\u00f3ximo: Escolher Modelo \u2192",en:"Next: Choose Model \u2192",es:"Siguiente: Elegir modelo \u2192",fr:"Suivant : Choisir le mod\u00e8le \u2192"},
    {pt:"Pr\u00f3ximo: Detalhamento \u2192",en:"Next: Details \u2192",es:"Siguiente: Detalles \u2192",fr:"Suivant : D\u00e9tails \u2192"},
    {pt:"Pr\u00f3ximo: Fundo \u2192",en:"Next: Background \u2192",es:"Siguiente: Fondo \u2192",fr:"Suivant : Fond \u2192"},
    {pt:"Pr\u00f3ximo: Moldura + LED \u2192",en:"Next: Frame + LED \u2192",es:"Siguiente: Marco + LED \u2192",fr:"Suivant : Cadre + LED \u2192"},
    {pt:"Pr\u00f3ximo: Alto-relevo \u2192",en:"Next: Relief \u2192",es:"Siguiente: Relieve \u2192",fr:"Suivant : Relief \u2192"},
    {pt:"Pr\u00f3ximo: Miniatura \u2192",en:"Next: Model \u2192",es:"Siguiente: Miniatura \u2192",fr:"Suivant : Miniature \u2192"},
    {pt:"PERSONALIZAR QUADRO \u2192",en:"CUSTOMIZE FRAME \u2192",es:"PERSONALIZAR CUADRO \u2192",fr:"PERSONNALISER LE CADRE \u2192"},
    {pt:"Adicionar ao carrinho \u2192",en:"Add to cart \u2192",es:"A\u00f1adir al carrito \u2192",fr:"Ajouter au panier \u2192"},
    {pt:"Modelo \u2192",en:"Model \u2192",es:"Modelo \u2192",fr:"Mod\u00e8le \u2192"},
    {pt:"Detalhamento \u2192",en:"Details \u2192",es:"Detalles \u2192",fr:"D\u00e9tails \u2192"},
    {pt:"Dimens\u00e3o \u2192",en:"Size \u2192",es:"Dimensi\u00f3n \u2192",fr:"Dimension \u2192"},
    {pt:"Fundo \u2192",en:"Background \u2192",es:"Fondo \u2192",fr:"Fond \u2192"},
    {pt:"Moldura + LED \u2192",en:"Frame + LED \u2192",es:"Marco + LED \u2192",fr:"Cadre + LED \u2192"},
    {pt:"Alto-relevo \u2192",en:"Relief \u2192",es:"Relieve \u2192",fr:"Relief \u2192"},
    {pt:"Miniatura \u2192",en:"Model car \u2192",es:"Miniatura \u2192",fr:"Miniature \u2192"},
    {pt:"Ver Resumo \u2192",en:"View Summary \u2192",es:"Ver resumen \u2192",fr:"Voir le r\u00e9sum\u00e9 \u2192"},
    {pt:"Finalizar e pagar \u2192",en:"Checkout \u2192",es:"Finalizar y pagar \u2192",fr:"Finaliser et payer \u2192"},
    {pt:"\u2190 Voltar",en:"\u2190 Back",es:"\u2190 Volver",fr:"\u2190 Retour"},
    {pt:"\u2190 Voltar aos itens",en:"\u2190 Back to items",es:"\u2190 Volver a los art\u00edculos",fr:"\u2190 Retour aux articles"},
    {pt:"\u2190 Editar configura\u00e7\u00e3o",en:"\u2190 Edit configuration",es:"\u2190 Editar configuraci\u00f3n",fr:"\u2190 Modifier la configuration"},
    /* redoma sob medida (22/09/2026) */
    {pt:"Como voc\u00ea quer sua redoma?",en:"How would you like your display case?",es:"\u00bfC\u00f3mo quieres tu vitrina?",fr:"Comment voulez-vous votre vitrine ?"},
    {pt:"Redoma pronta",en:"Ready-made case",es:"Vitrina lista",fr:"Vitrine pr\u00eate"},
    {pt:"Modelos da linha, prontos para o seu item",en:"Models from our range, ready for your piece",es:"Modelos de la l\u00ednea, listos para tu pieza",fr:"Mod\u00e8les de la gamme, pr\u00eats pour votre pi\u00e8ce"},
    {pt:"Personalize",en:"Customize",es:"Personaliza",fr:"Personnalisez"},
    {pt:"Sob medida",en:"Made to measure",es:"A medida",fr:"Sur mesure"},
    {pt:"Voc\u00ea informa a medida, o pre\u00e7o sai na hora",en:"You enter the size, the price appears instantly",es:"T\u00fa indicas la medida, el precio sale al instante",fr:"Vous indiquez la mesure, le prix s\u2019affiche aussit\u00f4t"},
    {pt:"Qual a medida da sua redoma?",en:"What size is your display case?",es:"\u00bfQu\u00e9 medida tiene tu vitrina?",fr:"Quelle est la mesure de votre vitrine ?"},
    {pt:"Largura",en:"Width",es:"Ancho",fr:"Largeur"},
    {pt:"Profundidade",en:"Depth",es:"Profundidad",fr:"Profondeur"},
    {pt:"Altura",en:"Height",es:"Altura",fr:"Hauteur"},
    {pt:"Medidas internas do v\u00e3o.",en:"Inside clearance dimensions.",es:"Medidas internas del hueco.",fr:"Dimensions int\u00e9rieures utiles."},
    {pt:"De",en:"From",es:"De",fr:"De"},
    {pt:"a",en:"to",es:"a",fr:"\u00e0"},
    {pt:"cm por lado.",en:"cm per side.",es:"cm por lado.",fr:"cm par c\u00f4t\u00e9."},
    {pt:"Fora do limite:",en:"Out of range:",es:"Fuera del l\u00edmite:",fr:"Hors limite :"},
    {pt:"de",en:"from",es:"de",fr:"de"},
    {pt:"Use cent\u00edmetros inteiros.",en:"Use whole centimetres.",es:"Usa cent\u00edmetros enteros.",fr:"Utilisez des centim\u00e8tres entiers."},
    {pt:"Sob medida ainda n\u00e3o dispon\u00edvel nesta regi\u00e3o.",en:"Made to measure is not available in this region yet.",es:"A medida a\u00fan no disponible en esta regi\u00f3n.",fr:"Le sur mesure n\u2019est pas encore disponible dans cette r\u00e9gion."},
    {pt:"N\u00e3o consegui calcular agora. Tente de novo.",en:"Could not calculate right now. Please try again.",es:"No pude calcular ahora. Int\u00e9ntalo de nuevo.",fr:"Calcul impossible pour le moment. R\u00e9essayez."},
    {pt:"Calculando\u2026",en:"Calculating\u2026",es:"Calculando\u2026",fr:"Calcul en cours\u2026"},
    {pt:"Sua redoma",en:"Your display case",es:"Tu vitrina",fr:"Votre vitrine"},
    {pt:"Acr\u00edlico cristal 3 mm",en:"3 mm clear acrylic",es:"Acr\u00edlico cristal de 3 mm",fr:"Acrylique cristal 3 mm"},
    {pt:"Base em dois n\u00edveis (black piano + 5 mm)",en:"Two-level base (piano black + 5 mm)",es:"Base de dos niveles (negro piano + 5 mm)",fr:"Socle \u00e0 deux niveaux (noir piano + 5 mm)"},
    {pt:"Caixa de envio",en:"Shipping box",es:"Caja de env\u00edo",fr:"Carton d\u2019exp\u00e9dition"},
    {pt:"Produzida sob medida \u00b7 7 dias \u00fateis",en:"Made to order \u00b7 7 business days",es:"Fabricada a medida \u00b7 7 d\u00edas h\u00e1biles",fr:"Fabriqu\u00e9e sur mesure \u00b7 7 jours ouvr\u00e9s"},
    {pt:"Continuar \u2192",en:"Continue \u2192",es:"Continuar \u2192",fr:"Continuer \u2192"},
    {pt:"Redomas que j\u00e1 fizemos",en:"Cases we have made",es:"Vitrinas que ya hicimos",fr:"Vitrines d\u00e9j\u00e0 r\u00e9alis\u00e9es"},
    {pt:"Prontas ou sob medida \u2014 escolha e veja o pre\u00e7o na hora",en:"Ready-made or made to measure \u2014 choose and see the price instantly",es:"Listas o a medida \u2014 elige y ve el precio al instante",fr:"Pr\u00eates ou sur mesure \u2014 choisissez et voyez le prix aussit\u00f4t"},
    {pt:"Produtos prontos \u2014 escolha a linha e depois o modelo",en:"Ready-made products \u2014 choose the range, then the model",es:"Productos listos \u2014 elige la l\u00ednea y luego el modelo",fr:"Produits pr\u00eats \u2014 choisissez la gamme puis le mod\u00e8le"},
    {pt:"Displays / Redomas de Acr\u00edlico",en:"Acrylic Display Cases",es:"Vitrinas de acr\u00edlico",fr:"Vitrines en acrylique"},
    {pt:"Redoma / Display",en:"Display case",es:"Vitrina",fr:"Vitrine"},
    /* impressao UV no fundo (23/09/2026) */
    {pt:"Imagem impressa no fundo",en:"Printed image on the back",es:"Imagen impresa en el fondo",fr:"Image imprim\u00e9e au fond"},
    {pt:"Sua foto, logo ou arte em impress\u00e3o UV na parede de tr\u00e1s",en:"Your photo, logo or artwork UV-printed on the back wall",es:"Tu foto, logo o arte en impresi\u00f3n UV en la pared trasera",fr:"Votre photo, logo ou visuel imprim\u00e9 UV sur la paroi arri\u00e8re"},
    {pt:"Enviar imagem (opcional)",en:"Upload image (optional)",es:"Enviar imagen (opcional)",fr:"Envoyer l\u2019image (facultatif)"},
    {pt:"Trocar imagem",en:"Change image",es:"Cambiar imagen",fr:"Changer l\u2019image"},
    {pt:"Pode enviar agora ou depois da compra, pelo WhatsApp.",en:"You can upload it now or after purchase, via WhatsApp or e-mail.",es:"Puedes enviarla ahora o despu\u00e9s de la compra, por WhatsApp.",fr:"Vous pouvez l\u2019envoyer maintenant ou apr\u00e8s l\u2019achat, par WhatsApp ou e-mail."},
    {pt:"Imagem recebida:",en:"Image received:",es:"Imagen recibida:",fr:"Image re\u00e7ue :"},
    {pt:". Ela aparece no desenho e vai junto do pedido.",en:". It shows on the drawing and goes with your order.",es:". Aparece en el dibujo y va junto con el pedido.",fr:". Elle appara\u00eet sur le dessin et accompagne la commande."},
    {pt:"Envie um arquivo de imagem (JPG ou PNG).",en:"Please upload an image file (JPG or PNG).",es:"Env\u00eda un archivo de imagen (JPG o PNG).",fr:"Envoyez un fichier image (JPG ou PNG)."},
    /* redomas: tela da linha, ficha, rodape e textos do painel (23/09/2026) */
    {pt:"Escolha a linha",en:"Choose the range",es:"Elige la l\u00ednea",fr:"Choisissez la gamme"},
    {pt:"Produtos dispon\u00edveis",en:"Available products",es:"Productos disponibles",fr:"Produits disponibles"},
    {pt:"Medida",en:"Size",es:"Medida",fr:"Dimensions"},
    {pt:"Envio",en:"Shipping",es:"Env\u00edo",fr:"Exp\u00e9dition"},
    {pt:"Desmontada, montagem por encaixe",en:"Shipped disassembled, snap-fit assembly",es:"Desmontada, montaje por encaje",fr:"Livr\u00e9e d\u00e9mont\u00e9e, montage par embo\u00eetement"},
    {pt:"Prazo de produ\u00e7\u00e3o",en:"Production time",es:"Plazo de producci\u00f3n",fr:"D\u00e9lai de fabrication"},
    {pt:"7 dias \u00fateis",en:"7 business days",es:"7 d\u00edas h\u00e1biles",fr:"7 jours ouvr\u00e9s"},
    {pt:"Fundo",en:"Back panel",es:"Fondo",fr:"Fond"},
    {pt:"\u00b7 imagem a enviar",en:"\u00b7 image to be sent",es:"\u00b7 imagen por enviar",fr:"\u00b7 image \u00e0 envoyer"},
    {pt:"Redomas e displays prontos para a sua cole\u00e7\u00e3o",en:"Ready-made cases and displays for your collection",es:"Vitrinas y displays listos para tu colecci\u00f3n",fr:"Vitrines et pr\u00e9sentoirs pr\u00eats pour votre collection"},
    {pt:"Redomas de encaixe",en:"Snap-fit display cases",es:"Vitrinas de encaje",fr:"Vitrines \u00e0 embo\u00eetement"},
    {pt:"Contato",en:"Contact",es:"Contacto",fr:"Contact"},
    {pt:"Trocas e devolu\u00e7\u00f5es",en:"Returns & exchanges",es:"Cambios y devoluciones",fr:"Retours et \u00e9changes"},
    {pt:"Privacidade",en:"Privacy",es:"Privacidad",fr:"Confidentialit\u00e9"},
    {pt:"Seu carrinho",en:"Your cart",es:"Tu carrito",fr:"Votre panier"},
    {pt:"Produzida com laterais e topo em acr\u00edlico cristal de 3 mm, proporciona excelente transpar\u00eancia, prote\u00e7\u00e3o e um acabamento sofisticado. Sua base possui dois n\u00edveis: o primeiro em acr\u00edlico Black Piano de 3 mm, com brilho intenso e elegante, e o segundo em acr\u00edlico premium de 5 mm, criando um efeito de destaque que eleva ainda mais a apresenta\u00e7\u00e3o da pe\u00e7a.\n\nTodas as redomas s\u00e3o enviadas desmontadas para maior seguran\u00e7a durante o transporte. A montagem \u00e9 extremamente simples e intuitiva, realizada atrav\u00e9s de encaixes precisos, sem necessidade de cola, parafusos ou ferramentas.",en:"Crafted with 3 mm crystal-clear acrylic sides and top, it offers outstanding transparency, protection and a refined finish. Its two-level base pairs a first tier in 3 mm Piano Black acrylic, deep and glossy, with a second tier in 5 mm premium acrylic, creating a raised effect that elevates the presentation of your piece.\n\nEvery case ships disassembled for maximum safety in transit. Assembly is remarkably simple and intuitive, using precision snap-fit joints: no glue, screws or tools required.",es:"Fabricada con laterales y tapa en acr\u00edlico cristal de 3 mm, ofrece una transparencia excelente, protecci\u00f3n y un acabado sofisticado. Su base tiene dos niveles: el primero en acr\u00edlico Negro Piano de 3 mm, con un brillo intenso y elegante, y el segundo en acr\u00edlico premium de 5 mm, creando un efecto de realce que eleva a\u00fan m\u00e1s la presentaci\u00f3n de la pieza.\n\nTodas las vitrinas se env\u00edan desmontadas para mayor seguridad durante el transporte. El montaje es muy sencillo e intuitivo, mediante encajes precisos, sin necesidad de pegamento, tornillos ni herramientas.",fr:"R\u00e9alis\u00e9e avec des parois et un couvercle en acrylique cristal de 3 mm, elle offre une transparence remarquable, une protection optimale et une finition raffin\u00e9e. Son socle \u00e0 deux niveaux associe un premier plateau en acrylique Noir Piano de 3 mm, profond et brillant, \u00e0 un second en acrylique premium de 5 mm, cr\u00e9ant un effet de mise en valeur qui sublime la pr\u00e9sentation de votre pi\u00e8ce.\n\nToutes les vitrines sont livr\u00e9es d\u00e9mont\u00e9es pour une s\u00e9curit\u00e9 maximale pendant le transport. Le montage est simple et intuitif, par embo\u00eetements pr\u00e9cis, sans colle, vis ni outils."},
    {pt:"Redoma para Capacete da Lego - Ayrton Senna",en:"Case for the LEGO Ayrton Senna helmet",es:"Vitrina para el casco LEGO de Ayrton Senna",fr:"Vitrine pour le casque LEGO d\u2019Ayrton Senna"},
    {pt:"Redoma para Capacete da Lego - Hamilton",en:"Case for the LEGO Lewis Hamilton helmet",es:"Vitrina para el casco LEGO de Lewis Hamilton",fr:"Vitrine pour le casque LEGO de Lewis Hamilton"},
    {pt:"Escolha a melhor op\u00e7\u00e3o para a sua cole\u00e7\u00e3o!",en:"Choose the best option for your collection!",es:"\u00a1Elige la mejor opci\u00f3n para tu colecci\u00f3n!",fr:"Choisissez la meilleure option pour votre collection !"},
    {pt:"Quadros para seu Lego",en:"Frames for your LEGO",es:"Cuadros para tu LEGO",fr:"Cadres pour votre LEGO"},
    {pt:"Centenas de op\u00e7\u00f5es para voc\u00ea escolher",en:"Hundreds of options to choose from",es:"Cientos de opciones para elegir",fr:"Des centaines d\u2019options au choix"},
    {pt:"Quadros completos - J\u00e1 inclusos miniaturas",en:"Complete frames, model car included",es:"Cuadros completos, miniatura incluida",fr:"Cadres complets, miniature incluse"},
    {pt:"Quadros completos - J\u00e1 inclusos miniaturas (opcional LED)",en:"Complete frames, model car included (optional LED)",es:"Cuadros completos, miniatura incluida (LED opcional)",fr:"Cadres complets, miniature incluse (LED en option)"},
    {pt:"Fa\u00e7a sua obra de arte abstrata exclusiva",en:"Create your own exclusive abstract artwork",es:"Crea tu obra de arte abstracta exclusiva",fr:"Cr\u00e9ez votre \u0153uvre d\u2019art abstraite exclusive"}
  ];
  var PEDACOS=[
    /* nomes das redomas e linhas do carrinho (23/09/2026) -- os longos antes */
    {pt:"Redoma para Capacete da Lego (modelo Ayrton Senna)",en:"Display case for the LEGO Ayrton Senna helmet",es:"Vitrina para el casco LEGO de Ayrton Senna",fr:"Vitrine pour le casque LEGO d\u2019Ayrton Senna"},
    {pt:"Redoma para Capacete da Lego (modelo Lewis Hamilton)",en:"Display case for the LEGO Lewis Hamilton helmet",es:"Vitrina para el casco LEGO de Lewis Hamilton",fr:"Vitrine pour le casque LEGO de Lewis Hamilton"},
    {pt:"Redoma para Mclaren MP4/4 do piloto Ayrton Senna",en:"Display case for Ayrton Senna\u2019s McLaren MP4/4",es:"Vitrina para el McLaren MP4/4 de Ayrton Senna",fr:"Vitrine pour la McLaren MP4/4 d\u2019Ayrton Senna"},
    {pt:"Enviada desmontada \u2014 montagem por encaixe",en:"Shipped disassembled \u2014 snap-fit assembly",es:"Enviada desmontada \u2014 montaje por encaje",fr:"Livr\u00e9e d\u00e9mont\u00e9e \u2014 montage par embo\u00eetement"},
    {pt:"Produ\u00e7\u00e3o em 7 dias \u00fateis",en:"Made in 7 business days",es:"Fabricaci\u00f3n en 7 d\u00edas h\u00e1biles",fr:"Fabrication en 7 jours ouvr\u00e9s"},
    {pt:") \u2014 imagem a enviar pelo cliente",en:") \u2014 image to be sent by the customer",es:") \u2014 imagen por enviar por el cliente",fr:") \u2014 image \u00e0 envoyer par le client"},
    {pt:") \u2014 imagem enviada",en:") \u2014 image received",es:") \u2014 imagen recibida",fr:") \u2014 image re\u00e7ue"},
    {pt:"Impress\u00e3o UV no fundo (",en:"UV-printed back panel (",es:"Impresi\u00f3n UV en el fondo (",fr:"Impression UV au fond ("},
    {pt:"Impress\u00e3o UV ",en:"UV print ",es:"Impresi\u00f3n UV ",fr:"Impression UV "},
    {pt:"Redoma sob medida ",en:"Made-to-measure case ",es:"Vitrina a medida ",fr:"Vitrine sur mesure "},
    {pt:" + impress\u00e3o no fundo",en:" + printed back",es:" + impresi\u00f3n en el fondo",fr:" + impression au fond"},
    {pt:"Visualizador \u00b7 ",en:"Viewer \u00b7 ",es:"Visualizador \u00b7 ",fr:"Visualiseur \u00b7 "},
    {pt:"\" adicionado",en:"\" added",es:"\" a\u00f1adido",fr:"\" ajout\u00e9"}
  ];
  var PT={};                         /* como estava, para voltar ao portugues */
  function lang(){
    try{ if(window.FP&&FP.lang)return FP.lang; }catch(e){}
    try{ return localStorage.getItem('fp_lang')||'pt'; }catch(e){}
    return 'pt';
  }
  /* Reproduz o mesmo estrago de acentuacao que existe nos arquivos, para
     reconhecer tanto o texto certo quanto o quebrado. Feito na mao: as
     funcoes prontas do navegador estouram com bytes soltos. */
  function emBytes(s){                 /* texto -> string de bytes */
    var r='';
    for(var i=0;i<s.length;i++){
      var c=s.codePointAt(i);
      if(c>0xFFFF)i++;
      if(c<0x80)r+=String.fromCharCode(c);
      else if(c<0x800)r+=String.fromCharCode(0xC0|(c>>6),0x80|(c&63));
      else if(c<0x10000)r+=String.fromCharCode(0xE0|(c>>12),0x80|((c>>6)&63),0x80|(c&63));
      else r+=String.fromCharCode(0xF0|(c>>18),0x80|((c>>12)&63),0x80|((c>>6)&63),0x80|(c&63));
    }
    return r;
  }
  function quebra(s){ try{ return emBytes(emBytes(s)); }catch(e){ return s; } }
  var MAPA={};
  FRASES.forEach(function(f){
    MAPA[f.pt]=f;
    var q=quebra(f.pt);
    if(q!==f.pt)MAPA[q]=f;
  });

  function titulos(){
    var l=lang();
    var els=document.querySelectorAll('[title]');
    for(var i=0;i<els.length;i++){
      var el=els[i];
      if(el.__fpT===undefined)el.__fpT=el.getAttribute('title')||'';
      var base=el.__fpT.trim();
      var f=MAPA[base];
      if(!f)continue;
      var novo=(l==='pt')?f.pt:(f[l]||f.pt);
      if(el.getAttribute('title')!==novo)el.setAttribute('title',novo);
    }
  }
  /* Passagem final por FRASE INTEIRA. Existem blocos antigos que aplicam a
     traducao INGLESA mesmo quando o idioma e' espanhol ou frances. Esta
     passagem roda por ultimo e devolve cada frase ao idioma escolhido.
     E' idempotente: se ja esta certo, nao encosta no no. */
  var TODAS={}; window.__fpTODAS=TODAS;
  FRASES.forEach(function(f){
    ['en','es','fr'].forEach(function(l){ if(f[l])TODAS[f[l]]=f; });
    TODAS[f.pt]=f;
    var q=quebra(f.pt); if(q!==f.pt)TODAS[q]=f;
  });
  var mexidas=0;
  function textos(){
    var l=lang();
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
    var n,fila=[];
    while((n=w.nextNode())){
      var cur=n.nodeValue;
      if(!cur||!cur.trim())continue;
      var p=n.parentNode; if(!p)continue;
      var tg=p.nodeName;
      if(tg==='SCRIPT'||tg==='STYLE'||tg==='TEXTAREA'||tg==='OPTION')continue;
      if(p.closest&&p.closest('#fpLang'))continue;
      var f=TODAS[cur.trim()];
      if(!f)continue;
      var certo=(l==='pt')?f.pt:(f[l]||f.pt);
      var lead=cur.match(/^\s*/)[0], tail=cur.match(/\s*$/)[0];
      var novo=lead+certo+tail;
      if(n.nodeValue!==novo)fila.push([n,novo]);
    }
    mexidas+=fila.length;
    fila.forEach(function(x){ x[0].nodeValue=x[1]; });
    return fila.length;
  }
  window.__fpI18nMexidas=function(){ return mexidas; };
  function pedacos(){
    var l=lang();
    if(!PEDACOS.length)return;
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
    var n,fila=[];
    while((n=w.nextNode())){
      var t=n.nodeValue;
      if(!t||!t.trim())continue;
      var p=n.parentNode;
      if(!p)continue;
      var tg=p.nodeName;
      if(tg==='SCRIPT'||tg==='STYLE'||tg==='TEXTAREA')continue;
      if(n.__fpP===undefined)n.__fpP=t;
      var base=n.__fpP, novo=base, mudou=false;
      for(var k=0;k<PEDACOS.length;k++){
        var pc=PEDACOS[k];
        var de=pc.pt, para=(l==='pt')?pc.pt:(pc[l]||pc.pt);
        if(novo.indexOf(de)>=0&&de!==para){ novo=novo.split(de).join(para); mudou=true; }
      }
      if(mudou&&n.nodeValue!==novo)fila.push([n,novo]);
      else if(!mudou&&l==='pt'&&n.nodeValue!==base)fila.push([n,base]);
    }
    fila.forEach(function(x){ x[0].nodeValue=x[1]; });
  }
  var t=null;
  function tudo(){ try{titulos();}catch(e){} try{textos();}catch(e){} try{pedacos();}catch(e){} }
  function agenda(){ clearTimeout(t); t=setTimeout(tudo,80); }
  function liga(){
    tudo();
    try{
      if(window.FP&&typeof FP.setLang==='function'){
        var o=FP.setLang; FP.setLang=function(){ var r=o.apply(this,arguments); agenda(); return r; };
      }
      if(window.FP&&typeof FP.setRegion==='function'){
        var o2=FP.setRegion; FP.setRegion=function(){ var r=o2.apply(this,arguments); agenda(); return r; };
      }
    }catch(e){}
    try{
      new MutationObserver(agenda).observe(document.body,{childList:true,subtree:true});
    }catch(e){}
  }
  if(document.readyState==='loading')
    document.addEventListener('DOMContentLoaded',function(){setTimeout(liga,120);});
  else setTimeout(liga,120);
})();


/* ============ FRASE MISTURADA (portugues + ingles) ============
   Os blocos antigos de traducao trocam PEDACOS de frase por ingles sempre que
   o idioma escolhido nao e' portugues - inclusive em espanhol e frances. O
   resultado e' uma frase pela metade, tipo
       "Se escolher essa opcao voce tera two paths:"
   que nao bate com nenhuma entrada do dicionario e por isso fica na tela.

   A lista abaixo foi montada aplicando as trocas dos blocos antigos em cima
   de cada frase do dicionario: cada linha e' [mistura, frase original]. Aqui
   a mistura vira apelido da frase, e a passagem por frase inteira que ja
   existe devolve o idioma certo.

   So age em espanhol e frances - em ingles a frase ja esta correta.
   Se algo faltar, sai sem fazer nada. */
(function(){
  var MIST=[
    ["By choosing this option, you'll have dois caminhos:","Se escolher essa op\u00e7\u00e3o voc\u00ea ter\u00e1 dois caminhos:"],
    ["Choose ready-made frames that already include miniatures.","Escolher quadros prontos que j\u00e1 contenham miniaturas inclusas."],
    ["Continue comprando","Continuar comprando"],
    ["Enter your ZIP code","Digite seu CEP"],
    ["Se escolher essa op\u00e7\u00e3o voc\u00ea ter\u00e1 two paths:","Se escolher essa op\u00e7\u00e3o voc\u00ea ter\u00e1 dois caminhos:"],
    ["\u00f0\u009f\u008f\u008e\u00ef\u00b8\u008f Model Logo \u2014 Canto inferior direito","\u00f0\u009f\u008f\u008e\u00ef\u00b8\u008f Logo do Modelo \u2014 Canto inferior direito"]
  ];
  function lang(){
    try{ if(window.FP&&FP.lang)return FP.lang; }catch(e){}
    try{ return localStorage.getItem('fp_lang')||'pt'; }catch(e){}
    return 'pt';
  }
  function emBytes(s){
    var r='';
    for(var i=0;i<s.length;i++){
      var c=s.codePointAt(i);
      if(c>0xFFFF)i++;
      if(c<0x80)r+=String.fromCharCode(c);
      else if(c<0x800)r+=String.fromCharCode(0xC0|(c>>6),0x80|(c&63));
      else if(c<0x10000)r+=String.fromCharCode(0xE0|(c>>12),0x80|((c>>6)&63),0x80|(c&63));
      else r+=String.fromCharCode(0xF0|(c>>18),0x80|((c>>12)&63),0x80|((c>>6)&63),0x80|(c&63));
    }
    return r;
  }
  function quebra(s){ try{ return emBytes(emBytes(s)); }catch(e){ return s; } }
  var MAPA={};
  MIST.forEach(function(p){
    MAPA[p[0]]=p[1];
    var q=quebra(p[0]); if(q!==p[0])MAPA[q]=p[1];
  });
  function traduz(pt){
    try{
      var l=lang();
      if(typeof FULL==='undefined')return null;
      var e=FULL[pt]||FULL[quebra(pt)];
      if(!e)return null;
      return (l==='pt')?pt:(e[l]||null);
    }catch(e){ return null; }
  }
  var t=null,mexidas=0;
  function passa(){
    var l=lang();
    if(l!=='es'&&l!=='fr'&&l!=='pt')return;      /* ingles ja esta certo */
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
    var n,fila=[];
    while((n=w.nextNode())){
      var cur=n.nodeValue;
      if(!cur||!cur.trim())continue;
      var p=n.parentNode; if(!p)continue;
      var tg=p.nodeName;
      if(tg==='SCRIPT'||tg==='STYLE'||tg==='TEXTAREA'||tg==='OPTION')continue;
      var pt=MAPA[cur.trim()];
      if(!pt)continue;
      var certo=traduz(pt);
      if(!certo)continue;
      var novo=cur.match(/^\s*/)[0]+certo+cur.match(/\s*$/)[0];
      if(n.nodeValue!==novo)fila.push([n,novo]);
    }
    mexidas+=fila.length;
    fila.forEach(function(x){ x[0].nodeValue=x[1]; });
  }
  window.__fpMisturas=function(){ return mexidas; };
  function agenda(){ clearTimeout(t); t=setTimeout(function(){ try{passa();}catch(e){} },110); }
  function liga(){
    agenda();
    try{
      if(window.FP&&typeof FP.setLang==='function'){
        var o=FP.setLang; FP.setLang=function(){ var r=o.apply(this,arguments); agenda(); return r; };
      }
    }catch(e){}
    try{ new MutationObserver(agenda).observe(document.body,{childList:true,subtree:true,characterData:true}); }catch(e){}
  }
  if(document.readyState==='loading')
    document.addEventListener('DOMContentLoaded',function(){setTimeout(liga,160);});
  else setTimeout(liga,160);
})();


/* ============ CHECKOUT EUROPEU: ENTREGA ============
   Tres coisas, todas so para regiao diferente de Brasil. No Brasil nada muda.

   1. DESTRAVA O "CONTINUAR" - NO BRASIL TAMBEM.  A trava que impede fechar
      pedido sem entrega escolhida (posta no conserto do frete, 04/09) olha
      window._freteEscolhido. Mas quem preenche essa variavel e' o painel
      antigo do app_1.js, que so calcula quando o campo CEP do FORMULARIO ja
      esta preenchido - e esse formulario so aparece DEPOIS da tela do frete.
      Na pratica quem calcula e' o painel do fp_addons.js (o do botao
      "Calcular"), e ele guarda a escolha em FP.frete. Resultado, medido nos
      dois lados: o cliente escolhe a transportadora, ve o "Total com frete"
      na tela, clica em Continuar e nada acontece. So passava quem clicasse em
      "Retirar na fabrica". Vale para Brasil e Europa.
      Aqui, na hora de avancar, a escolha e' emprestada para a variavel que a
      trava espera e devolvida logo depois - assim nada mais no site enxerga
      essa variavel preenchida (o texto do WhatsApp, por exemplo, continua
      saindo do FP.frete, com o simbolo certo). A trava continua barrando quem
      nao escolheu nada.

   2. RETIRADA.  Fora do Brasil, "RETIRAR NA FABRICA" (Barueri) e' substituida
      pela retirada em Braine-l'Alleud. Mesma linha, mesmo lugar na lista.

   3. LIMPA A LISTA.  A Sendcloud devolve tudo que existe na rota, inclusive
      carta sem selo por EUR 0,00 e servicos B2B, que so entregam em endereco
      comercial. Um quadro de 53x83 vai numa caixa de 6 kg e 92 cm: nenhum dos
      dois entrega isso na casa do cliente. Ficam de fora, na Europa. */
(function(){
  var RETIRADA_EU={
    endereco:"Place Abb\u00e9 Renard, 5 \u2014 1420 Braine-l\u2019Alleud",
    nome:{pt:"RETIRAR EM BRAINE-L\u2019ALLEUD",en:"PICK UP IN BRAINE-L\u2019ALLEUD",
          es:"RECOGER EN BRAINE-L\u2019ALLEUD",fr:"RETRAIT \u00c0 BRAINE-L\u2019ALLEUD"},
    gratis:{pt:"Gr\u00e1tis",en:"Free",es:"Gratis",fr:"Gratuit"}
  };
  function reg(){ try{ return (window.FP&&FP.region)||'BR'; }catch(e){ return 'BR'; } }
  function lang(){ try{ return (window.FP&&FP.lang)||'pt'; }catch(e){ return 'pt'; } }
  function fora(){ return reg()!=='BR'; }
  function simbolo(){
    try{ if(window.CFG&&CFG[reg()]&&CFG[reg()].symbol)return CFG[reg()].symbol; }catch(e){}
    return '\u20ac';
  }

  /* ---------- 1. destrava o avanco (Brasil E Europa) ---------- */
  (function(){
    if(typeof window.carrinhoPasso!=='function')return;
    var oPasso=window.carrinhoPasso;
    window.carrinhoPasso=function(){
      var emprestado=false;
      try{
        if(window.FP&&FP.frete&&FP.frete.price!=null&&!window._freteEscolhido){
          window._freteEscolhido={__eu:true,label:FP.frete.label,price:FP.frete.price,
                                  carrier:FP.frete.carrier||'',currency:FP.frete.currency||simbolo()};
          emprestado=true;
        }
      }catch(e){}
      try{ return oPasso.apply(this,arguments); }
      finally{
        try{ if(emprestado&&window._freteEscolhido&&window._freteEscolhido.__eu)
               window._freteEscolhido=null; }catch(e){}
      }
    };
  })();

  /* ---------- 2. limpa a lista que vem da Sendcloud ---------- */
  (function(){
    if(typeof window.fetch!=='function')return;
    var oFetch=window.fetch;
    function serve(o){
      if(!o)return false;
      var p=Number(o.price);
      if(!(p>0))return false;                          /* ninguem entrega quadro de graca */
      var n=String(o.label||'');
      if(/(^|[^a-z])b2b([^a-z]|$)/i.test(n))return false;   /* so endereco comercial */
      return true;
    }
    window.fetch=function(entrada,init){
      var u='';
      try{ u=(typeof entrada==='string')?entrada:((entrada&&entrada.url)||''); }catch(e){}
      var r=oFetch.apply(this,arguments);
      if(u.indexOf('/frete')<0||!fora())return r;
      return r.then(function(resp){
        try{
          var clone=resp.clone();
          return clone.json().then(function(d){
            if(!d||!d.ok||!Array.isArray(d.options))return resp;
            var limpo=d.options.filter(serve);
            if(limpo.length===d.options.length)return resp;
            if(!limpo.length)limpo=d.options;          /* nunca deixar sem opcao nenhuma */
            d.options=limpo;
            return new Response(JSON.stringify(d),
              {status:resp.status,statusText:resp.statusText,headers:resp.headers});
          }).catch(function(){ return resp; });
        }catch(e){ return resp; }
      });
    };
  })();

  /* ---------- 3. retirada: Barueri vira Braine-l'Alleud ---------- */
  (function(){
    function escolhe(linha){
      try{
        window.FP.frete={price:0,label:RETIRADA_EU.nome[lang()]||RETIRADA_EU.nome.en,
                         carrier:'retirada',currency:simbolo(),region:reg()};
      }catch(e){}
      try{
        document.querySelectorAll('#fpFreteOpts .fp-frete-opt')
          .forEach(function(x){ x.classList.remove('on'); });
        linha.classList.add('on');
      }catch(e){}
      /* mesma linha de total que o painel europeu ja mostra */
      try{
        var sub=(typeof _cartTotal==='function')?_cartTotal():0;
        var v=Number(sub||0).toLocaleString(
          ({pt:'pt-BR',en:'en-US',es:'es-ES',fr:'fr-FR'})[lang()]||'pt-BR',
          {minimumFractionDigits:2,maximumFractionDigits:2});
        var velho=document.getElementById('fpFreteTot'); if(velho)velho.remove();
        var d=document.createElement('div');
        d.className='fp-frete-tot'; d.id='fpFreteTot';
        var rot=(window.FP&&FP.t)?FP.t('frete.totalShip'):'Total';
        d.innerHTML='<span>'+rot+'</span><span>'+simbolo()+' '+v+'</span>';
        var cx=document.getElementById('fpFreteOpts'); if(cx)cx.appendChild(d);
      }catch(e){}
    }
    function ajusta(){
      if(!fora())return;
      var linhas=document.querySelectorAll('#fpFreteOpts [data-retirada="1"]');
      for(var i=0;i<linhas.length;i++){
        var l=linhas[i];
        if(l.getAttribute('data-eu')==='1'&&l.getAttribute('data-lg')===lang())continue;
        l.setAttribute('data-eu','1');
        l.setAttribute('data-lg',lang());
        l.removeAttribute('onclick');
        l.onclick=null;
        l.innerHTML='<div class="fp-frete-radio"></div>'
          +'<div class="fp-frete-info">'
          +'<div class="fp-frete-nome">'+(RETIRADA_EU.nome[lang()]||RETIRADA_EU.nome.en)+'</div>'
          +'<div class="fp-frete-prazo">'+RETIRADA_EU.endereco+'</div>'
          +'</div>'
          +'<div class="fp-frete-preco">'+(RETIRADA_EU.gratis[lang()]||RETIRADA_EU.gratis.en)+'</div>';
        (function(el){ el.addEventListener('click',function(){ escolhe(el); }); })(l);
      }
    }
    var t=null;
    function agenda(){ clearTimeout(t); t=setTimeout(function(){ try{ajusta();}catch(e){} },60); }
    function liga(){
      agenda();
      try{ new MutationObserver(agenda).observe(document.body,{childList:true,subtree:true}); }catch(e){}
      try{
        if(window.FP&&typeof FP.setLang==='function'){
          var o=FP.setLang; FP.setLang=function(){ var r=o.apply(this,arguments); agenda(); return r; };
        }
        if(window.FP&&typeof FP.setRegion==='function'){
          var o2=FP.setRegion; FP.setRegion=function(){ var r=o2.apply(this,arguments); agenda(); return r; };
        }
      }catch(e){}
    }
    if(document.readyState==='loading')
      document.addEventListener('DOMContentLoaded',function(){setTimeout(liga,200);});
    else setTimeout(liga,200);
  })();
})();


/* ============ PRECO EM EURO VEM DO BANCO ============
   Ver o comentario do commit. Resumo: o site passa a usar os precos em euro
   definidos no painel, os mesmos que o servidor usa para cobrar. Sem preco em
   euro, o item nao e' vendido na Europa - some da lista ou desliga o botao. */
(function(){
  var BRUTO=null;              /* catalogo como veio do banco, intacto */
  /* as chaves que o calculo do site consulta de verdade. Conferido no
     app_1.js: bases por prefixo e estes seis opcionais. */
  var USADAS=/^(lego_base_|mini_base_)|^(opt_moldura_fibra|opt_led_rgb_sem|opt_mini_comprar|opt_disp_3d|opt_relevo_bandeira|opt_relevo_piloto)$/;
  var FALTA=[];                /* chaves sem preco em euro */

  function reg(){ try{ return (window.FP&&FP.region)||'BR'; }catch(e){ return 'BR'; } }
  /* so a Europa: a regiao EUA nunca foi aberta e nao tem preco em dolar no
     banco - mexer nela agora seria inventar numero. */
  function euro(){ return reg()==='EU'; }
  function lang(){ try{ return (window.FP&&FP.lang)||'pt'; }catch(e){ return 'pt'; } }

  var AVISO={
    pt:'Este item ainda nao tem preco em euro definido.',
    en:'This item has no price in euro yet.',
    es:'Este articulo aun no tiene precio en euros.',
    fr:'Cet article n\u2019a pas encore de prix en euros.'
  };

  /* Troca a tabela de precos e a lista de produtos pela versao em euro.
     Nao inventa nenhum numero: o que nao tem euro fica de fora. */
  function converte(c){
    if(!c||!euro())return c;
    var out;
    try{ out=JSON.parse(JSON.stringify(c)); }catch(e){ return c; }
    var pe=c.precos_eur||{}, pr=c.precos||{};
    out.precos={};
    FALTA=[];
    Object.keys(pr).forEach(function(k){
      if(pe[k]!=null)out.precos[k]=pe[k];
      /* So trava por chave que o site REALMENTE consulta. O banco tem
         chaves de LED antigo que o painel esconde e o site nao usa; exigir
         euro delas deixava a Europa sem preco para sempre, sem ter como
         preencher. */
      else if(USADAS.test(k))FALTA.push(k);
    });
    /* PRODUTO PRONTO: quadro de catalogo (out.mini) e redoma (out.redoma)
       seguem a mesma regra -- o preco em euro do painel entra no lugar do
       real, e o que nao tem euro nao e' vendido na Europa.

       ISTO ERA ESCRITO SO PARA out.mini. A redoma nasceu depois, numa chave
       nova, e este bloco nunca soube que ela existia: na Europa ela saia com
       o preco em REAL e o simbolo do euro (\u20ac 219 no lugar de \u20ac 29).
       Por isso agora e' UM laco percorrendo as familias, e nao duas copias do
       mesmo codigo -- a proxima familia entra acrescentando uma palavra. */
    ['mini','redoma','pronto'].forEach(function(fam){
      var grupo=out[fam];
      if(!grupo)return;
      Object.keys(grupo).forEach(function(m){
        var itens=((grupo[m]||{}).itens)||[];
        var vivos=itens.filter(function(p){ return p&&p.p_eur!=null; });
        vivos.forEach(function(p){ p.p=p.p_eur; });
        if(vivos.length)grupo[m].itens=vivos;
        else delete grupo[m];
      });
    });
    return out;
  }

  /* Quando falta preco em euro de alguma base ou opcional, o configurador nao
     pode mostrar valor: o numero sairia da reserva escrita no codigo, que esta
     em real. Melhor desligar a compra e dizer o porque. */
  function trava(){
    var ligar=!(euro()&&FALTA.length);
    ['btnAddCart','btnAddCartInc'].forEach(function(id){
      var b=document.getElementById(id);
      if(!b)return;
      b.disabled=!ligar;
      b.style.opacity=ligar?'':'0.45';
      b.style.pointerEvents=ligar?'':'none';
    });
    var msg=document.getElementById('fpSemEuro');
    if(!ligar){
      if(!msg){
        msg=document.createElement('div');
        msg.id='fpSemEuro';
        msg.style.cssText='margin:10px 0;padding:9px 11px;border:1px solid #6a4a12;'
          +'background:#241a06;color:#e8c37a;border-radius:8px;font-size:12.5px;line-height:1.5';
        var alvo=document.getElementById('btnAddCart');
        if(alvo&&alvo.parentNode)alvo.parentNode.insertBefore(msg,alvo);
      }
      msg.textContent=AVISO[lang()]||AVISO.en;
      ['pvPrice','mobBarPrice','deskBarPrice'].forEach(function(id){
        var el=document.getElementById(id);
        if(el)el.textContent='\u2014';
      });
    }else if(msg){ msg.remove(); }
  }

  function reaplica(){
    if(!BRUTO||typeof window._aplicaCatalogoBanco!=='function')return;
    var out=converte(BRUTO);
    if(euro())alinhaCFG(out.precos); else alinhaCFG(null);
    try{ window._aplicaCatalogoBanco(out); }catch(e){}
    try{ if(typeof calcPrice==='function')calcPrice(); }catch(e){}
    setTimeout(trava,60);
  }

  /* Um bloco antigo faz  CAT_PRECOS = CFG[regiao].prices  a cada mudanca na
     pagina. Essa tabela esta escrita dentro do arquivo e cobre so os quadros
     LEGO. Em vez de brigar com ele, os numeros DELE sao trocados pelos do
     banco: seja quem for que escreva CAT_PRECOS, o valor sai certo. */
  function alinhaCFG(precosEur){
    try{
      /* CFG vive dentro de um bloco fechado e nao da para alcancar daqui.
         Entao a tabela do banco e' publicada aqui, e o bloco antigo (alterado
         no mesmo commit) passa a preferi-la a tabela escrita no arquivo. */
      if(precosEur&&Object.keys(precosEur).length)window.__fpPrecosEur=precosEur;
      else window.__fpPrecosEur=null;
      if(window.__fpPrecosEur&&euro())window.CAT_PRECOS=window.__fpPrecosEur;
    }catch(e){}
  }

  /* A resposta do banco e' interceptada no proprio fetch: e' cedo o bastante
     para pegar a primeira carga, que acontece antes deste bloco ligar. */
  (function(){
    if(typeof window.fetch!=='function')return;
    var oFetch=window.fetch;
    window.fetch=function(entrada,init){
      var u='';
      try{ u=(typeof entrada==='string')?entrada:((entrada&&entrada.url)||''); }catch(e){}
      var r=oFetch.apply(this,arguments);
      if(u.indexOf('/catalogo')<0)return r;
      return r.then(function(resp){
        try{
          return resp.clone().json().then(function(c){
            if(!c||(!c.precos&&!c.mini))return resp;
            BRUTO=c;
            var out=converte(c);
            if(euro())alinhaCFG(out.precos);
            setTimeout(trava,120);
            if(out===c)return resp;
            return new Response(JSON.stringify(out),
              {status:resp.status,statusText:resp.statusText,headers:resp.headers});
          }).catch(function(){ return resp; });
        }catch(e){ return resp; }
      });
    };
  })();

  function liga(){
    try{
      if(window.FP&&typeof FP.setRegion==='function'){
        var o=FP.setRegion;
        FP.setRegion=function(){ var r=o.apply(this,arguments); setTimeout(reaplica,40);
          /* redoma sob medida: o preco e' perguntado de novo, na moeda nova */
          try{ if(typeof _smRegiaoMudou==='function')setTimeout(_smRegiaoMudou,80); }catch(e){}
          return r; };
      }
      if(window.FP&&typeof FP.setLang==='function'){
        var o2=FP.setLang;
        FP.setLang=function(){ var r=o2.apply(this,arguments); setTimeout(trava,60); return r; };
      }
    }catch(e){}
    try{ if(typeof calcPrice==='function'){ var oc=calcPrice;
      window.calcPrice=function(){ var r=oc.apply(this,arguments); try{trava();}catch(e){} return r; }; } }catch(e){}
    setTimeout(trava,400);
  }
  if(document.readyState==='loading')
    document.addEventListener('DOMContentLoaded',function(){setTimeout(liga,200);});
  else setTimeout(liga,200);
})();


/* ============ A RETIRADA NAO PODE SUMIR DA LISTA ============
   Dois paineis de frete escrevem na mesma caixa. O painel do botao "Calcular"
   substitui o conteudo inteiro quando as opcoes chegam, e leva junto a linha
   "RETIRAR NA FABRICA", que o painel antigo coloca so uma vez ao abrir a tela.
   Resultado: quem calculava o frete perdia a opcao de retirar.

   Aqui a linha e' garantida depois de qualquer redesenho: se sumiu, volta; se
   duplicou, fica uma so. O texto e o clique sao os mesmos de sempre. Fora do
   Brasil, o bloco anterior troca o conteudo pela retirada em Braine-l'Alleud. */
(function(){
  var NOME='RETIRAR NA F\u00c1BRICA', PRAZO='Combinar retirada', GRATIS='Gr\u00e1tis';

  function novaLinha(){
    var d=document.createElement('div');
    d.className='fp-frete-opt';
    d.setAttribute('data-retirada','1');
    d.innerHTML='<div class="fp-frete-radio"></div>'
      +'<div class="fp-frete-info">'
      +'<div class="fp-frete-nome">'+NOME+'</div>'
      +'<div class="fp-frete-prazo">'+PRAZO+'</div>'
      +'</div>'
      +'<div class="fp-frete-preco">'+GRATIS+'</div>';
    d.addEventListener('click',function(){
      /* Fora do Brasil quem cuida desta linha e' o bloco da retirada europeia,
         que ja poe o rotulo e a moeda certos. Chamar a funcao do painel
         brasileiro aqui deixaria "RETIRAR NA FABRICA" em real no pedido. */
      try{ if(window.FP&&FP.region&&FP.region!=='BR')return; }catch(e){}
      try{ if(typeof window._selRetirada==='function'){ window._selRetirada(); return; } }catch(e){}
      /* reserva, caso a funcao do painel antigo nao exista */
      try{
        window._freteEscolhido={label:NOME,price:0,carrier:null,currency:'BRL'};
        document.querySelectorAll('#fpFreteOpts .fp-frete-opt')
          .forEach(function(x){ x.classList.remove('on'); });
        d.classList.add('on');
      }catch(e){}
    });
    return d;
  }

  function garante(){
    var caixas=document.querySelectorAll('#fpFreteOpts');
    for(var i=0;i<caixas.length;i++){
      var cx=caixas[i];
      var todas=cx.querySelectorAll('.fp-frete-opt');
      if(!todas.length)continue;                 /* lista vazia: nao e' hora ainda */
      var rets=cx.querySelectorAll('[data-retirada="1"]');
      if(rets.length>1){                          /* duplicou: mantem a primeira */
        for(var k=1;k<rets.length;k++){
          try{ rets[k].parentNode.removeChild(rets[k]); }catch(e){}
        }
        continue;
      }
      if(rets.length===1)continue;                /* ja esta la */
      /* a linha do total, quando existe, fica sempre por ultimo */
      var tot=cx.querySelector('.fp-frete-tot');
      try{
        if(tot)cx.insertBefore(novaLinha(),tot);
        else cx.appendChild(novaLinha());
      }catch(e){}
    }
  }

  var t=null;
  function agenda(){ clearTimeout(t); t=setTimeout(function(){ try{garante();}catch(e){} },90); }
  function liga(){
    agenda();
    try{ new MutationObserver(agenda).observe(document.body,{childList:true,subtree:true}); }catch(e){}
  }
  if(document.readyState==='loading')
    document.addEventListener('DOMContentLoaded',function(){setTimeout(liga,250);});
  else setTimeout(liga,250);
})();


/* ============ QUANDO O PAGAMENTO NAO ABRE ============
   Antes daqui, qualquer falha no pagamento esvaziava o carrinho, fechava o
   painel e abria o WhatsApp, sem uma palavra. O cliente nao sabia o que tinha
   acontecido e a Funparts tambem nao: gateway fora do ar e pedido abaixo do
   valor minimo eram indistinguiveis.

   Agora a tela diz o motivo, o carrinho continua montado e o WhatsApp vira uma
   escolha, num botao, em vez de um desvio automatico. */
(function(){
  var T={
    pt:{ tit:'N\u00e3o foi poss\u00edvel abrir o pagamento',
         ped:'Pedido', tentar:'Tentar de novo', zap:'Falar no WhatsApp',
         rede:'N\u00e3o conseguimos falar com o servidor. Seu carrinho continua aqui.',
         minimo:'O total do pedido est\u00e1 abaixo do valor m\u00ednimo aceito pelo pagamento (R$ 1,00).',
         semcfg:'O meio de pagamento n\u00e3o est\u00e1 configurado no momento.',
         semeuro:'Este item ainda n\u00e3o tem pre\u00e7o em euro definido.',
         generico:'O pagamento n\u00e3o p\u00f4de ser criado agora. Seu carrinho continua aqui.' },
    en:{ tit:'We could not open the payment',
         ped:'Order', tentar:'Try again', zap:'Message on WhatsApp',
         rede:'We could not reach the server. Your cart is still here.',
         minimo:'The order total is below the minimum accepted by the payment provider.',
         semcfg:'The payment method is not available right now.',
         semeuro:'This item has no price in euro yet.',
         generico:'The payment could not be created right now. Your cart is still here.' },
    es:{ tit:'No pudimos abrir el pago',
         ped:'Pedido', tentar:'Intentar de nuevo', zap:'Escribir por WhatsApp',
         rede:'No pudimos contactar el servidor. Tu carrito sigue aqu\u00ed.',
         minimo:'El total del pedido est\u00e1 por debajo del m\u00ednimo aceptado por el pago.',
         semcfg:'El medio de pago no est\u00e1 disponible en este momento.',
         semeuro:'Este art\u00edculo a\u00fan no tiene precio en euros.',
         generico:'El pago no pudo crearse ahora. Tu carrito sigue aqu\u00ed.' },
    fr:{ tit:'Le paiement n\u2019a pas pu s\u2019ouvrir',
         ped:'Commande', tentar:'R\u00e9essayer', zap:'\u00c9crire sur WhatsApp',
         rede:'Nous n\u2019avons pas pu joindre le serveur. Votre panier est toujours l\u00e0.',
         minimo:'Le total de la commande est inf\u00e9rieur au minimum accept\u00e9 par le paiement.',
         semcfg:'Le moyen de paiement n\u2019est pas disponible pour le moment.',
         semeuro:'Cet article n\u2019a pas encore de prix en euros.',
         generico:'Le paiement n\u2019a pas pu \u00eatre cr\u00e9\u00e9. Votre panier est toujours l\u00e0.' }
  };
  function t(){ var l='pt'; try{ l=(window.FP&&FP.lang)||'pt'; }catch(e){} return T[l]||T.pt; }

  /* traduz o que o servidor respondeu para uma frase que o cliente entende */
  function explica(motivo){
    var x=t(), m=String(motivo||'');
    if(m==='__rede__')return x.rede;
    if(/valor invalido/i.test(m))return x.minimo;
    if(/nao configurad/i.test(m))return x.semcfg;
    if(/preco em euro/i.test(m))return x.semeuro;
    if(m&&m.length<160&&!/^http/i.test(m))return m;   /* mensagem propria do servidor */
    return x.generico;
  }

  window._fpFalhaPgto=function(motivo, pedido, cliente, aba, btn, textoZap){
    var x=t();
    /* a aba em branco foi aberta no clique; sem pagamento, ela nao serve */
    try{ if(aba && !aba.closed) aba.close(); }catch(e){}
    try{ if(btn){ btn.disabled=false; btn.textContent='FECHAR PEDIDO \u2192'; } }catch(e){}

    var alvo=document.getElementById('cartFoot2')||document.getElementById('cartFoot')
             ||document.getElementById('cartPanel');
    if(!alvo){ try{ if(typeof textoZap==='function')window.open('https://wa.me/'+(typeof _fpZapNum==='function'?_fpZapNum():'5511910646157')+'?text='+encodeURIComponent((window._fpZap||String)(textoZap())),'_blank'); }catch(e){} return; }

    var velho=document.getElementById('fpPgtoFalha');
    if(velho)velho.remove();
    var cx=document.createElement('div');
    cx.id='fpPgtoFalha';
    cx.style.cssText='margin:10px 0;padding:12px 13px;border:1px solid #7a3b34;'
      +'background:#2a1512;color:#f0cdc7;border-radius:9px;font-size:13px;line-height:1.55';
    var cod=(pedido&&pedido.codigo)?('<div style="margin-top:6px;opacity:.75">'+x.ped+': '+String(pedido.codigo).replace(/[<>&"]/g,'')+'</div>'):'';
    cx.innerHTML='<div style="font-weight:700;margin-bottom:4px">'+x.tit+'</div>'
      +'<div>'+explica(motivo)+'</div>'+cod
      +'<div style="display:flex;gap:8px;margin-top:11px;flex-wrap:wrap">'
      +'<button type="button" id="fpPgtoTentar" style="flex:1 1 130px;background:#e07b00;border:0;color:#fff;'
      +'padding:10px 12px;border-radius:8px;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer">'+x.tentar+'</button>'
      +'<button type="button" id="fpPgtoZap" style="flex:1 1 130px;background:transparent;border:1px solid #4a4a4a;'
      +'color:#ddd;padding:10px 12px;border-radius:8px;font-family:inherit;font-size:13px;cursor:pointer">'+x.zap+'</button>'
      +'</div>';
    alvo.insertBefore(cx, alvo.firstChild);
    try{ cx.scrollIntoView({behavior:'smooth',block:'center'}); }catch(e){}

    var bt=document.getElementById('fpPgtoTentar');
    if(bt)bt.addEventListener('click',function(){
      cx.remove();
      try{ if(typeof window.fecharPedidoWpp==='function')window.fecharPedidoWpp(); }catch(e){}
    });
    var bz=document.getElementById('fpPgtoZap');
    if(bz)bz.addEventListener('click',function(){
      var txt='';
      try{ if(typeof textoZap==='function')txt=textoZap(); }catch(e){}
      if(!txt){
        /* 12/11/2026: no idioma do cliente (na Europa a conversa abre com a unidade da Belgica) */
        var _zl={pt:['Ol\u00e1! Tentei fechar meu pedido na Funparts e o pagamento n\u00e3o abriu.','Pedido','Cliente'],en:['Hi! I tried to complete my order on Funparts and the payment did not open.','Order','Customer'],es:['\u00a1Hola! Intent\u00e9 cerrar mi pedido en Funparts y el pago no se abri\u00f3.','Pedido','Cliente'],fr:['Bonjour ! J\u2019ai essay\u00e9 de finaliser ma commande sur Funparts et le paiement ne s\u2019est pas ouvert.','Commande','Client']};
        var _zt=_zl[(window.FP&&FP.lang)||'pt']||_zl.pt;
        txt=_zt[0];
        if(pedido&&pedido.codigo)txt+='\n'+_zt[1]+': '+pedido.codigo;
        if(cliente&&cliente.nome)txt+='\n'+_zt[2]+': '+cliente.nome;
      }
      try{ window.open('https://wa.me/'+(typeof _fpZapNum==='function'?_fpZapNum():'5511910646157')+'?text='+encodeURIComponent((window._fpZap||String)(txt)),'_blank'); }catch(e){}
    });
  };
})();


/* ============ "FALTA PREENCHER: ..." ============
   A mensagem de campo obrigatorio dizia so "Confira os campos destacados".
   Como o campo Pais comeca em branco e fica abaixo da dobra, dava a impressao
   de que o botao de fechar pedido nao funcionava. Aqui ela ganha os nomes dos
   campos, nos quatro idiomas. */
(function(){
  var T={
    pt:{ falta:'Falta preencher: ', geral:'Confira os campos destacados antes de continuar.' },
    en:{ falta:'Please fill in: ',  geral:'Check the highlighted fields before continuing.' },
    es:{ falta:'Falta completar: ', geral:'Revisa los campos marcados antes de continuar.' },
    fr:{ falta:'\u00c0 remplir : ',    geral:'V\u00e9rifiez les champs en rouge avant de continuer.' }
  };
  window._fpAvisoCampos=function(nomes){
    var l='pt';
    try{ l=(window.FP&&FP.lang)||'pt'; }catch(e){}
    var t=T[l]||T.pt;
    if(!nomes||!nomes.length)return t.geral;
    return t.falta+nomes.join(', ');
  };
})();


/* ============ LISTA DE ENTREGA COM ROLAGEM PROPRIA ============
   A Sendcloud devolve 7 opcoes para a Belgica. O rodape do carrinho nao rola
   de proposito (para o botao ficar sempre no lugar), entao a lista longa
   empurrava o "Continuar" para fora da tela.

   Aqui a lista ganha altura maxima e rolagem propria. Nenhuma opcao some.
   So age quando ha MAIS DE 4 opcoes: com 2 ou 3, como no Brasil, nada muda. */
(function(){
  var MAX_ALTURA=186;          /* cabem ~3 opcoes e meia: da para ver que rola */
  var MINIMO=5;                /* de 5 opcoes para cima */

  function ajusta(){
    var caixas=document.querySelectorAll('#fpFreteOpts');
    for(var i=0;i<caixas.length;i++){
      var cx=caixas[i];
      var n=cx.querySelectorAll('.fp-frete-opt').length;
      if(n>=MINIMO){
        if(cx.style.maxHeight!==MAX_ALTURA+'px'){
          cx.style.maxHeight=MAX_ALTURA+'px';
          cx.style.overflowY='auto';
          cx.style.paddingRight='4px';
          try{ cx.style.scrollbarWidth='thin'; }catch(e){}
        }
      }else if(cx.style.maxHeight){
        cx.style.maxHeight='';
        cx.style.overflowY='';
        cx.style.paddingRight='';
      }
    }
  }

  var t=null;
  function agenda(){ clearTimeout(t); t=setTimeout(function(){ try{ajusta();}catch(e){} },90); }
  function liga(){
    agenda();
    try{ new MutationObserver(agenda).observe(document.body,{childList:true,subtree:true}); }catch(e){}
    try{ window.addEventListener('resize',agenda); }catch(e){}
  }
  if(document.readyState==='loading')
    document.addEventListener('DOMContentLoaded',function(){setTimeout(liga,260);});
  else setTimeout(liga,260);
})();


/* ============ O TOTAL DA EUROPA ESTAVA EM REAL ============
   Duas correcoes pequenas em cima do total do fechamento:

   1) escolher a retirada, ou trocar de transportadora, nem sempre refazia o
      total -- a linha da retirada europeia e a lista do painel novo nao
      chamam o calculo do total. Aqui qualquer clique numa opcao de entrega
      manda refazer. So fora do Brasil: la o painel antigo ja faz isso.

   2) o prazo da lista sai escrito em portugues ("1 dia util") mesmo com o
      site em ingles, frances ou espanhol, porque vem do painel antigo. Aqui
      ele e reescrito no idioma da pagina, sem mexer no resto da linha. */
(function(){
  function reg(){ try{ return (window.FP&&FP.region)||'BR'; }catch(e){ return 'BR'; } }
  function lang(){ try{ return (window.FP&&FP.lang)||'pt'; }catch(e){ return 'pt'; } }

  var PRAZO={
    pt:{um:'1 dia \u00fatil',        n:' dias \u00fateis'},
    en:{um:'1 business day',      n:' business days'},
    es:{um:'1 d\u00eda h\u00e1bil',     n:' d\u00edas h\u00e1biles'},
    fr:{um:'1 jour ouvr\u00e9',      n:' jours ouvr\u00e9s'}
  };

  function traduzPrazos(){
    if(reg()==='BR')return;
    var t=PRAZO[lang()]||PRAZO.en;
    var els=document.querySelectorAll('#fpFreteOpts .fp-frete-prazo');
    for(var i=0;i<els.length;i++){
      var el=els[i], s=String(el.textContent||'').trim();
      var m=s.match(/^(\d+)\s*dias?\b/i);      /* so o que veio em portugues */
      if(!m)continue;
      var n=parseInt(m[1],10);
      el.textContent=(n===1)?t.um:(n+t.n);
    }
  }

  function refazTotal(){
    if(reg()==='BR')return;
    try{ if(typeof window._fpFreteAtualizaTot==='function')window._fpFreteAtualizaTot(); }catch(e){}
  }

  function passada(){ traduzPrazos(); refazTotal(); }

  /* qualquer clique numa opcao de entrega */
  document.addEventListener('click',function(e){
    var alvo=null;
    try{ alvo=(e.target&&e.target.closest)?e.target.closest('.fp-frete-opt'):null; }catch(err){}
    if(!alvo)return;
    setTimeout(passada,0); setTimeout(passada,200);
  },true);

  /* e sempre que a lista for redesenhada */
  function envolve(){
    try{
      if(typeof window._fpFreteRender!=='function'||window._fpFreteRender.__fpTot)return;
      var o=window._fpFreteRender;
      var f=function(){ var r=o.apply(this,arguments); try{ passada(); }catch(err){} return r; };
      f.__fpTot=1; window._fpFreteRender=f;
    }catch(err){}
  }
  setTimeout(envolve,300); setTimeout(envolve,1200); setTimeout(envolve,2500);
  setTimeout(passada,1500);
})();

/* ============ WHATSAPP: MENSAGEM LIMPA (28/09/2026) ============
   O botao "Tirar duvidas no WhatsApp" do resumo montava a mensagem com
   variaveis do app_1.js que (1) guardam texto com acentuacao corrompida e
   (2) nao sabem de redoma nem de produto pronto -- a redoma saia como
   "Tipo: Miniatura / Modelo: Ferrari / 25 x 35 cm". Agora a mensagem sai do
   PROPRIO RESUMO que o cliente esta vendo (ja consertado e traduzido na
   tela), e todo texto que vai para o WhatsApp passa por _fpZap, que desfaz
   a corrupcao por trecho. Fonte so em ASCII (\u) de proposito. */
(function(){
  var CP={0x20AC:0x80,0x201A:0x82,0x0192:0x83,0x201E:0x84,0x2026:0x85,0x2020:0x86,0x2021:0x87,
          0x02C6:0x88,0x2030:0x89,0x0160:0x8A,0x2039:0x8B,0x0152:0x8C,0x017D:0x8E,0x2018:0x91,
          0x2019:0x92,0x201C:0x93,0x201D:0x94,0x2022:0x95,0x2013:0x96,0x2014:0x97,0x02DC:0x98,
          0x2122:0x99,0x0161:0x9A,0x203A:0x9B,0x0153:0x9C,0x017E:0x9E,0x0178:0x9F};
  var RUN=/[\u0080-\u00ff\u0152\u0153\u0160\u0161\u0178\u017d\u017e\u0192\u02c6\u02dc\u2013\u2014\u2018-\u201a\u201c-\u201e\u2020-\u2022\u2026\u2030\u2039\u203a\u20ac\u2122]{2,}/g;
  function rodada(run){
    var b=new Uint8Array(run.length);
    for(var i=0;i<run.length;i++){
      var c=run.charCodeAt(i);
      if(c<256)b[i]=c; else if(CP[c]!=null)b[i]=CP[c]; else return null;
    }
    try{ return new TextDecoder('utf-8',{fatal:true}).decode(b); }catch(e){ return null; }
  }
  function conserta(s){
    s=String(s==null?'':s);
    for(var k=0;k<4;k++){
      var mudou=false;
      s=s.replace(RUN,function(run){
        var d=rodada(run);
        if(d!=null&&d!==run&&d.length<run.length){ mudou=true; return d; }
        return run;
      });
      if(!mudou)break;
    }
    return s.replace(/[\ufffd\u0080-\u009F]/g,'');
  }
  window._fpZap=conserta;

  var TXT={
    pt:{oi:'Ol\u00e1! Tenho uma d\u00favida sobre esta configura\u00e7\u00e3o no site da Funparts:',tot:'Total estimado',ver:'Ver o produto'},
    en:{oi:'Hi! I have a question about this configuration on the Funparts website:',tot:'Estimated total',ver:'See the product'},
    es:{oi:'\u00a1Hola! Tengo una duda sobre esta configuraci\u00f3n en el sitio de Funparts:',tot:'Total estimado',ver:'Ver el producto'},
    fr:{oi:'Bonjour ! J\u2019ai une question sur cette configuration sur le site Funparts :',tot:'Total estim\u00e9',ver:'Voir le produit'}
  };
  var ICO={sumDim:'\ud83d\udcd0',sumMold:'\ud83d\uddbc\ufe0f',sumFund:'\ud83c\udfa8',sumLed:'\ud83d\udca1',
           sumMini:'\ud83d\ude97',sumRel:'\u2728',pvSku:'\ud83d\udd16'};
  var ESTILO=window.__fpZapEstilo||'B';

  function txt(el){ return el?conserta(String(el.textContent||'')).replace(/\s+/g,' ').trim():''; }
  function vazio(v){ return !v||/^[\u2014\u2013\-\u00b7.\s]*$/.test(v); }
  function vis(el){ return !!(el&&el.style.display!=='none'&&getComputedStyle(el).display!=='none'); }

  function linkProduto(){
    try{
      var p=(typeof S!=='undefined')?S.incProduto:null;
      if(!p||p.sm||p.id==null)return '';
      return 'https://www.funparts.'+((window.FP&&FP.region==='EU')?'be':'com.br')+'/?p='+(S.ehRedoma?'r':'p')+p.id;
    }catch(e){ return ''; }
  }

  function montar(){
    var L=(window.FP&&TXT[FP.lang])||TXT.pt, B=(ESTILO==='B');
    var t=[L.oi,''], total='', titulo='', sub='';
    var inc=document.getElementById('inclusoSummaryBlock');
    if(vis(inc)){
      titulo=txt(document.getElementById('iSumBrand'));
      sub=txt(document.getElementById('iSumName'));
      total=txt(document.getElementById('iSumPrice'));
      if(titulo&&sub){ t.push((B?'\ud83c\udff7\ufe0f ':'')+'*'+titulo+'*'); t.push(sub); }
      else if(sub||titulo){ t.push((B?'\ud83c\udff7\ufe0f ':'')+'*'+(sub||titulo)+'*'); }
    }else{
      var cat=txt(document.getElementById('sumCat')), mod=txt(document.getElementById('sumMod'));
      if(!vazio(cat))t.push((B?'\ud83c\udff7\ufe0f ':'')+'*'+cat+'*');
      if(!vazio(mod))t.push(mod);
      var extra=[];
      var rows=document.querySelectorAll('#step-7 .sum-block .sum-row');
      for(var i=0;i<rows.length;i++){
        var v=rows[i].querySelector('.sum-val'), k=rows[i].querySelector('.sum-key');
        if(!v||v.id==='sumCat'||v.id==='sumMod')continue;
        var val=txt(v), key=txt(k);
        /* 12/11/2026: o selo de preco e o X de remover vinham colados no texto ("Fibra de Carbono+R$75 x") */
        val=val.replace(/[\u00d7\u2715\u2716\u274c]/g,' ').replace(/\s*\+\s*(R\$|\u20ac)\s*([\d.,]+)/g,' (+$1$2)').replace(/\s+/g,' ').replace(/\s+\)/g,')').trim();
        if(vazio(val)||!key)continue;
        if(v.id==='pvSku')key='SKU';
        extra.push((B&&ICO[v.id]?ICO[v.id]+' ':'')+key+': '+val);
      }
      if(extra.length){ t.push(''); t=t.concat(extra); }
      total=txt(document.getElementById('sumTotal'));
    }
    if(!vazio(total)){ t.push(''); t.push((B?'\ud83d\udcb0 ':'')+'*'+L.tot+': '+total+'*'); }
    var lk=linkProduto();
    if(lk){ t.push(''); t.push((B?'\ud83d\udd17 ':'')+L.ver+': '+lk); }
    return conserta(t.join('\n'));
  }
  window._fpZapTexto=montar;

  var velho=window.abrirWpp;
  window.abrirWpp=function(){
    var m='';
    try{ m=montar(); }catch(e){ m=''; }
    if(!m){ try{ if(typeof velho==='function')return velho.apply(this,arguments); }catch(e){} return; }
    window.open('https://wa.me/'+(typeof _fpZapNum==='function'?_fpZapNum():'5511910646157')+'?text='+encodeURIComponent(m),'_blank');
  };
})();

/* VIDEO DO PRODUTO (08/11/2026) -- estilo C1 aprovado pelo Rodolfo.
   A foto continua sendo a primeira imagem. Se o produto tem video no painel
   (item.vid no /catalogo), aparece a pilula "Video . 0:18" no canto inferior
   esquerdo da foto principal; o toque abre o video em tela cheia, com som,
   e o botao verde Comprar leva ao resumo do pedido. O video so e' baixado
   no toque. Produto sem video: nada muda. Texto novo so com \u (o arquivo
   e' servido sem charset). */
(function(){
  if(typeof window._catGaleriaHTML!=='function')return;
  var BASE='https://funparts-ai-proxy.rodox1209.workers.dev/vid/';
  var TX={pt:{v:'V\u00eddeo',c:'Comprar',f:'Fechar',e:'N\u00e3o foi poss\u00edvel reproduzir o v\u00eddeo neste aparelho.'},
          en:{v:'Video',c:'Buy now',f:'Close',e:'This video cannot be played on this device.'},
          es:{v:'V\u00eddeo',c:'Comprar',f:'Cerrar',e:'No se pudo reproducir el v\u00eddeo en este dispositivo.'},
          fr:{v:'Vid\u00e9o',c:'Acheter',f:'Fermer',e:'Impossible de lire la vid\u00e9o sur cet appareil.'}};
  function lg(){ try{ return (window.FP&&FP.lang)||localStorage.getItem('fp_lang')||'pt'; }catch(e){ return 'pt'; } }
  function T(){ return TX[lg()]||TX.pt; }
  /* S e' declarado com let no app_1.js: nao fica em window.S */
  function item(){ try{ return (typeof S!=='undefined'&&S&&S.incProduto)||null; }catch(e){ return null; } }
  /* HEVC (padrao do iPhone) so aparece onde o aparelho toca: nos outros a
     pagina fica como hoje, sem selo -- nunca um video quebrado na tela. */
  var _hevc=null;
  function tocaHevc(){
    if(_hevc!==null)return _hevc;
    _hevc=false;
    try{ var v=document.createElement('video');
      ['hvc1.1.6.L93.B0','hvc1.2.4.L123.B0','hvc1.1.6.L120.90','hev1.1.6.L93.B0'].forEach(function(c){ if(v.canPlayType('video/mp4; codecs="'+c+'"')) _hevc=true; });
    }catch(e){}
    return _hevc;
  }
  function tem(){ var it=item(); if(!(it&&it.vid&&!it.sm))return false; if(it.vcod==='hevc'&&!tocaHevc())return false; return true; }
  function tempo(s){ s=Math.max(1,Math.floor(Number(s)||0)); var r=s%60; return Math.floor(s/60)+':'+(r<10?'0':'')+r; }
  var PLAY='<svg viewBox="0 0 10 12" width="9" height="11" aria-hidden="true"><path d="M1 0.6L9.6 6L1 11.4z" fill="#fff"/></svg>';
  function css(){
    if(document.getElementById('fpVidCss'))return;
    var st=document.createElement('style'); st.id='fpVidCss';
    st.textContent=
     '.fp-vpill{position:absolute;left:12px;bottom:12px;z-index:3;display:flex;align-items:center;gap:8px;padding:6px 14px 6px 6px;margin:0;'
    +'border-radius:999px;background:rgba(8,8,8,.72);border:1px solid rgba(255,255,255,.22);color:#fff;font:600 13px/1 -apple-system,"Segoe UI",Roboto,Arial,sans-serif;'
    +'letter-spacing:.01em;cursor:pointer;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);box-shadow:0 4px 18px rgba(0,0,0,.35);opacity:0;transition:opacity .25s,transform .2s,background .2s;-webkit-tap-highlight-color:transparent}'
    +'.fp-vpill:hover{background:rgba(8,8,8,.86);transform:translateY(-1px)}'
    +'.fp-vpill i{width:26px;height:26px;border-radius:50%;background:#e07b00;display:flex;align-items:center;justify-content:center;padding-left:2px;box-sizing:border-box;flex:none}'
    +'.fp-vpill em{font-style:normal;font-weight:400;color:#bbb}'
    +'.fp-vmod{position:fixed;inset:0;z-index:2147483000;background:#000;display:none}'
    +'.fp-vmod.on{display:block}'
    +'.fp-vmod video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000}'
    +'.fp-vtop{position:absolute;left:0;right:0;top:0;display:flex;align-items:flex-start;gap:12px;padding:calc(env(safe-area-inset-top,0px) + 16px) 16px 30px;background:linear-gradient(rgba(0,0,0,.62),transparent);pointer-events:none}'
    +'.fp-vtit{flex:1;min-width:0;color:#fff;font:700 12px/1.45 -apple-system,"Segoe UI",Roboto,Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;text-shadow:0 1px 6px #000;padding-top:11px}'
    +'.fp-vx{pointer-events:auto;flex:none;width:42px;height:42px;border-radius:50%;background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.3);color:#fff;font:400 24px/1 Arial,sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0 0 2px}'
    +'.fp-vbuy{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 78px);border:0;border-radius:9px;padding:14px 24px;white-space:nowrap;'
    +'background:linear-gradient(135deg,#0E8A4F,#1FBE71);color:#fff;font:800 14px/1 -apple-system,"Segoe UI",Roboto,Arial,sans-serif;letter-spacing:.02em;cursor:pointer;box-shadow:0 8px 26px rgba(0,0,0,.45)}'
    +'.fp-verr{position:absolute;left:24px;right:24px;top:45%;text-align:center;color:#ddd;font:500 14px/1.5 -apple-system,"Segoe UI",Roboto,Arial,sans-serif;display:none}';
    (document.head||document.documentElement).appendChild(st);
  }
  /* a pilula fica no canto da FOTO pintada (object-fit:contain deixa faixas) */
  function pos(){
    var img=document.getElementById('catMainPhoto'), p=document.getElementById('fpVidPill');
    if(!img||!p||!p.parentNode)return;
    var box=p.parentNode, r=img.getBoundingClientRect(), b=box.getBoundingClientRect();
    if(!r.width||!r.height)return;
    var nw=img.naturalWidth, nh=img.naturalHeight, pw=r.width, ph=r.height;
    if(nw&&nh){ var s=Math.min(r.width/nw, r.height/nh); pw=nw*s; ph=nh*s; }
    p.style.left=Math.round((r.left-b.left)+(r.width-pw)/2+12)+'px';
    p.style.bottom=Math.round((b.bottom-r.bottom)+(r.height-ph)/2+12)+'px';
    p.style.opacity='1';
  }
  function liga(){
    var img=document.getElementById('catMainPhoto'), p=document.getElementById('fpVidPill');
    if(!img||!p)return;
    var box=p.parentNode;
    try{ if(box&&getComputedStyle(box).position==='static') box.style.position='relative'; }catch(e){}
    if(!img.__fpVid){ img.__fpVid=1; img.addEventListener('load',pos); }
    if(img.complete) pos();
  }
  var _rt=null;
  window.addEventListener('resize',function(){ clearTimeout(_rt); _rt=setTimeout(pos,90); });

  var orig=window._catGaleriaHTML;
  window._catGaleriaHTML=function(soFoto){
    var h=orig.apply(this,arguments);
    try{
      if(soFoto||!tem())return h;
      var it=item(); css();
      var pill='<button type="button" id="fpVidPill" class="fp-vpill" onclick="_fpVidAbre()" aria-label="'+T().v+'"><i>'+PLAY+'</i><span>'+T().v+'</span>'
        +(it.vdur?('<em>\u00b7 '+tempo(it.vdur)+'</em>'):'')+'</button>';
      var feito=false;
      h=h.replace(/<img id="catMainPhoto"[^>]*>/,function(m){ feito=true; return m+pill; });
      if(feito) setTimeout(liga,0);
    }catch(e){}
    return h;
  };

  var _hist=false, _depois=null, _ovf='';
  function modal(){
    var m=document.getElementById('fpVidModal'); if(m)return m;
    css();
    m=document.createElement('div'); m.id='fpVidModal'; m.className='fp-vmod';
    m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true');
    m.innerHTML='<video id="fpVidEl" playsinline webkit-playsinline controls preload="none" controlslist="nodownload"></video>'
      +'<div class="fp-verr" id="fpVidErr"></div>'
      +'<div class="fp-vtop"><div class="fp-vtit" id="fpVidTit"></div><button type="button" class="fp-vx" id="fpVidX">\u00d7</button></div>'
      +'<button type="button" class="fp-vbuy" id="fpVidBuy"></button>';
    document.body.appendChild(m);
    document.getElementById('fpVidX').onclick=function(){ fecha(true); };
    document.getElementById('fpVidBuy').onclick=compra;
    var v=document.getElementById('fpVidEl');
    v.addEventListener('error',function(){ if(!v.getAttribute('src'))return; var e=document.getElementById('fpVidErr'); e.textContent=T().e; e.style.display='block'; });
    v.addEventListener('contextmenu',function(e){ e.preventDefault(); });
    return m;
  }
  window._fpVidAbre=function(){
    var it=item(); if(!it||!it.vid)return;
    var m=modal(), v=document.getElementById('fpVidEl');
    document.getElementById('fpVidTit').textContent=String(it.n||'');
    var x=document.getElementById('fpVidX'); x.setAttribute('aria-label',T().f); x.title=T().f;
    var pr=''; try{ if(typeof _brl==='function'&&it.p!=null) pr=_brl(it.p); }catch(e){}
    document.getElementById('fpVidBuy').textContent=T().c+(pr?(' \u00b7 '+pr):'');
    document.getElementById('fpVidErr').style.display='none';
    var f=document.getElementById('catMainPhoto');
    if(f&&f.src) v.setAttribute('poster',f.src); else v.removeAttribute('poster');
    v.muted=false;
    v.setAttribute('src',BASE+encodeURIComponent(it.vid));
    m.classList.add('on');
    _ovf=document.documentElement.style.overflow; document.documentElement.style.overflow='hidden';
    try{ history.pushState({fpVid:1},'',location.href); _hist=true; }catch(e){ _hist=false; }
    try{ var p=v.play(); if(p&&p.catch) p.catch(function(){ v.muted=true; v.play().catch(function(){}); }); }catch(e){}
  };
  function fecha(viaTela){
    var m=document.getElementById('fpVidModal');
    if(!m||!m.classList.contains('on'))return false;
    m.classList.remove('on');
    var v=document.getElementById('fpVidEl');
    try{ v.pause(); }catch(e){}
    v.removeAttribute('src'); try{ v.load(); }catch(e){}
    document.documentElement.style.overflow=_ovf||'';
    if(viaTela&&_hist){ _hist=false; try{ history.back(); return true; }catch(e){} }
    _hist=false; return false;
  }
  function segue(){
    var f=_depois; _depois=null; if(f){ try{ f(); }catch(e){} }
  }
  window.addEventListener('popstate',function(){
    if(_hist){ _hist=false; fecha(false); }
    if(_depois) setTimeout(segue,0);
  });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') fecha(true); });
  function compra(){
    _depois=function(){
      if((window.innerWidth||1024)<=720&&typeof window.mobNext==='function') window.mobNext();
      else if(typeof window.goStep==='function') window.goStep(7);
    };
    var esperaVolta=fecha(true);
    if(esperaVolta) setTimeout(function(){ if(_depois) segue(); },600);
    else segue();
  }
})();

/* ===== IDIOMAS: PASSAGEM FINAL DE CONSISTENCIA (11/11/2026) =====
   Pedido do Rodolfo: clientes da Belgica trocavam o idioma e parte do site
   continuava em portugues (ou sobrava ingles no meio do frances/espanhol).
   Causas: (1) nome e descricao de produto vinham do painel so em portugues;
   (2) blocos antigos traduziam so para ingles; (3) frases que nunca entraram
   no dicionario; (4) a traducao podia perder a corrida com a tela.
   Esta passagem roda por ULTIMO e nao guarda estado: olha o texto que esta
   na tela, reconhece a frase em qualquer idioma e escreve no idioma escolhido.
   - frases novas: tabela F; moldes com numero/nome dentro: tabela MO
   - produtos (nome e descricao) pelo ID do cadastro: tabela PROD
   - textos de ajuda do painel: tabela INFO
   - tambem confere os dicionarios que ja existiam (FULL e FRASES)
   Texto novo so com \u (o arquivo e' servido sem charset). */
(function(){
  var F=[["Carrinho","Cart","Carrito","Panier"],["Seu carrinho est\u00e1 vazio.","Your cart is empty.","Tu carrito est\u00e1 vac\u00edo.","Votre panier est vide.","Your cart est\u00e1 vazio."],["Monte um quadro e adicione aqui.","Build a frame and add it here.","Crea un cuadro y agr\u00e9galo aqu\u00ed.","Cr\u00e9ez un cadre et ajoutez-le ici."],["Pedido","Order","Pedido","Commande"],["PERSONALIZAR QUADRO","CUSTOMIZE FRAME","PERSONALIZAR CUADRO","PERSONNALISER LE CADRE"],["Selecione a marca...","Select brand...","Selecciona la marca...","S\u00e9lectionnez la marque..."],["Verifica\u00e7\u00e3o de disponibilidade","Availability check","Verificaci\u00f3n de disponibilidad","V\u00e9rification de disponibilit\u00e9"],["Miniaturas dispon\u00edveis no mercado s\u00e3o fornecidas em die-cast (ferro fundido) nas escalas 1:18 ou 1:24.","Miniatures available on the market are supplied in die-cast (iron) at 1:18 or 1:24 scale.","Las miniaturas disponibles en el mercado se suministran en die-cast (metal fundido) a escala 1:18 o 1:24.","Les miniatures disponibles sur le march\u00e9 sont fournies en die-cast (m\u00e9tal moul\u00e9) \u00e0 l\u2019\u00e9chelle 1:18 ou 1:24."],["Modelos raros ou exclusivos s\u00e3o produzidos via","Rare or exclusive models are produced via","Los modelos raros o exclusivos se producen mediante","Les mod\u00e8les rares ou exclusifs sont r\u00e9alis\u00e9s par"],["impress\u00e3o 3D + pintura automotiva","3D printing + automotive paint","impresi\u00f3n 3D + pintura de automoci\u00f3n","impression 3D + peinture automobile"],["Disponibilidade da miniatura","Miniature availability","Disponibilidad de la miniatura","Disponibilit\u00e9 de la miniature"],["Personaliza\u00e7\u00e3o da miniatura","Miniature customization","Personalizaci\u00f3n de la miniatura","Personnalisation de la miniature"],["Dimens\u00e3o da miniatura","Miniature dimensions","Dimensi\u00f3n de la miniatura","Dimensions de la miniature"],["Set Selecionado","Selected Set","Set seleccionado","Set s\u00e9lectionn\u00e9"],["Quadro + Miniatura","Frame + Miniature","Cuadro + Miniatura","Cadre + Miniature"],["Die-cast 1:18 ou 1:24 \u2014 fundi\u00e7\u00e3o em ferro","Die-cast 1:18 or 1:24 \u2014 iron casting","Die-cast 1:18 o 1:24 \u2014 metal fundido","Die-cast 1:18 ou 1:24 \u2014 m\u00e9tal moul\u00e9"],["Impress\u00e3o 3D com acabamento pintura automotiva","3D printing with automotive paint finish","Impresi\u00f3n 3D con acabado de pintura de automoci\u00f3n","Impression 3D avec finition peinture automobile"],["Cor personalizada (aerografia)","Custom color (airbrushing)","Color personalizado (aerograf\u00eda)","Couleur personnalis\u00e9e (a\u00e9rographe)"],["Placa personalizada","Custom license plate","Matr\u00edcula personalizada","Plaque personnalis\u00e9e"],["Figura de piloto inclusa","Pilot figure included","Figura de piloto incluida","Figurine de pilote incluse"],["Sobre esta visualiza\u00e7\u00e3o","About this visualization","Sobre esta visualizaci\u00f3n","\u00c0 propos de cet aper\u00e7u"],["A imagem do ve\u00edculo foi gerada por Intelig\u00eancia Artificial para facilitar a visualiza\u00e7\u00e3o de como a sua miniatura ficar\u00e1 aplicada no quadro.","The vehicle image was generated by Artificial Intelligence to help visualize how your miniature will look mounted in the frame.","La imagen del veh\u00edculo fue generada por Inteligencia Artificial para ayudarte a visualizar c\u00f3mo quedar\u00e1 tu miniatura en el cuadro.","L\u2019image du v\u00e9hicule a \u00e9t\u00e9 g\u00e9n\u00e9r\u00e9e par Intelligence Artificielle pour vous aider \u00e0 visualiser votre miniature dans le cadre."],["Por esse motivo, alguns detalhes, como rodas, far\u00f3is, tonalidades e acabamentos, podem apresentar pequenas diferen\u00e7as em rela\u00e7\u00e3o \u00e0 miniatura que voc\u00ea possui.","For this reason, some details such as wheels, headlights, tones, and finishes may show slight differences from the miniature you own.","Por este motivo, algunos detalles, como llantas, faros, tonalidades y acabados, pueden presentar peque\u00f1as diferencias respecto a la miniatura que tienes.","C\u2019est pourquoi certains d\u00e9tails, comme les jantes, les phares, les teintes et les finitions, peuvent pr\u00e9senter de l\u00e9g\u00e8res diff\u00e9rences par rapport \u00e0 votre miniature."],["Nesta etapa, o objetivo principal \u00e9 demonstrar a","At this stage, the main goal is to show the vehicle\u2019s","En esta etapa, el objetivo principal es mostrar la","\u00c0 cette \u00e9tape, l\u2019objectif principal est de montrer la"],["propor\u00e7\u00e3o do ve\u00edculo em rela\u00e7\u00e3o ao quadro","scale relative to the frame","proporci\u00f3n del veh\u00edculo respecto al cuadro","proportion du v\u00e9hicule par rapport au cadre"],[". Assim, na pr\u00f3xima etapa, voc\u00ea poder\u00e1 comparar os diferentes tamanhos dispon\u00edveis e escolher com mais seguran\u00e7a o modelo que melhor valoriza e acomoda a sua miniatura.",". In the next step, you'll be able to compare the available sizes and confidently choose the option that best showcases and fits your miniature.",". As\u00ed, en la siguiente etapa, podr\u00e1s comparar los distintos tama\u00f1os disponibles y elegir con m\u00e1s seguridad el modelo que mejor realza y acomoda tu miniatura.",". Ainsi, \u00e0 l\u2019\u00e9tape suivante, vous pourrez comparer les diff\u00e9rentes tailles disponibles et choisir en toute confiance le mod\u00e8le qui met le mieux en valeur votre miniature."],["Padr\u00e3o","Standard","Est\u00e1ndar","Standard"],["N\u00famero de corrida na carroceria","Race number on the bodywork","N\u00famero de carrera en la carrocer\u00eda","Num\u00e9ro de course sur la carrosserie"],["Fibra de Carbono (Vinil)","Carbon Fiber (Vinyl)","Fibra de carbono (vinilo)","Fibre de carbone (vinyle)"],["ESPECIFICA\u00c7\u00d5ES DA MINIATURA E DO QUADRO","MINIATURE AND FRAME SPECIFICATIONS","ESPECIFICACIONES DE LA MINIATURA Y DEL CUADRO","CARACT\u00c9RISTIQUES DE LA MINIATURE ET DU CADRE"],["Selecione o modelo...","Select model...","Selecciona el modelo...","S\u00e9lectionnez le mod\u00e8le..."],["Selecione o tamanho...","Select size...","Selecciona el tama\u00f1o...","S\u00e9lectionnez la taille..."],["Selecione a cor...","Select color...","Selecciona el color...","S\u00e9lectionnez la couleur..."],["Selecione o acabamento...","Select finish...","Selecciona el acabado...","S\u00e9lectionnez la finition..."],["Selecione a op\u00e7\u00e3o...","Select option...","Selecciona la opci\u00f3n...","S\u00e9lectionnez l\u2019option..."],["Calcular","Calculate","Calcular","Calculer"],["Calcular frete","Calculate shipping","Calcular env\u00edo","Calculer la livraison"],["Frete gr\u00e1tis","Free shipping","Env\u00edo gratis","Livraison gratuite"],["Prazo de entrega","Delivery time","Plazo de entrega","D\u00e9lai de livraison"],["Dias \u00fateis","Business days","D\u00edas h\u00e1biles","Jours ouvr\u00e9s"],["Entrega","Delivery","Entrega","Livraison"],["Finalizar pedido","Complete order","Finalizar pedido","Finaliser la commande"],["Fechar pedido","Complete order","Finalizar pedido","Finaliser la commande"],["FINALIZAR PEDIDO","COMPLETE ORDER","FINALIZAR PEDIDO","FINALISER LA COMMANDE"],["Finalizar Pedido","Complete Order","Finalizar pedido","Finaliser la commande"],["QUADRO PARA MINIATURAS","MINIATURE FRAME","CUADRO PARA MINIATURAS","CADRE POUR MINIATURES"],["SELECIONE O QUADRO DA SUA PREFER\u00caNCIA","SELECT YOUR PREFERRED FRAME","SELECCIONA EL CUADRO QUE PREFIERAS","S\u00c9LECTIONNEZ LE CADRE DE VOTRE CHOIX"],["Quadro para LEGO","Frame for LEGO","Cuadro para LEGO","Cadre pour LEGO"],["LOGOTIPO COM MARCA DO CARRO","BRAND LOGO","LOGOTIPO DE LA MARCA","LOGO DE LA MARQUE"],["Logotipo com marca do carro","Brand Logo","Logotipo de la marca","Logo de la marque"],["Logotipo oficial da marca selecionada","Official logo of the selected brand","Logotipo oficial de la marca seleccionada","Logo officiel de la marque s\u00e9lectionn\u00e9e"],["Artesanal","Handcrafted","Artesanal","Fait main"],["Miniatura Die-cast / 3D","Miniature Die-cast / 3D","Miniatura Die-cast / 3D","Miniature Die-cast / 3D"],["Miniatura Die-cast","Miniature Die-cast","Miniatura Die-cast","Miniature Die-cast"],["Logo da Marca \u2014 canto sup. esq.","Brand Logo \u2014 top-left corner","Logo de la marca \u2014 esquina sup. izq.","Logo de la marque \u2014 coin sup. gauche","Logo da Marca \u2014 canto superior esquerdo","Brand Logo \u2014 Canto superior esquerdo","Brand Logo \u2014 Top left corner"],["Logo do Modelo \u2014 canto inf. dir.","Model Logo \u2014 bottom-right corner","Logo del modelo \u2014 esquina inf. der.","Logo du mod\u00e8le \u2014 coin inf. droit","Logo do Modelo \u2014 canto inferior direito","Model Logo \u2014 Canto inferior direito","Model Logo \u2014 Bottom right corner"],["Logo do Modelo \u2014 canto sup. esq.","Model Logo \u2014 top-left corner","Logo del modelo \u2014 esquina sup. izq.","Logo du mod\u00e8le \u2014 coin sup. gauche","Model Logo \u2014 Canto superior esquerdo","Model Logo \u2014 Top left corner"],["Logo da Marca \u2014 canto inf. dir.","Brand Logo \u2014 bottom-right corner","Logo de la marca \u2014 esquina inf. der.","Logo de la marque \u2014 coin inf. droit","Brand Logo \u2014 Canto inferior direito","Brand Logo \u2014 Bottom right corner"],["Logo F\u00f3rmula 1 \u2014 canto sup. esq.","Formula 1 Logo \u2014 Top left corner","Logo F\u00f3rmula 1 \u2014 esquina sup. izq.","Logo Formule 1 \u2014 coin sup. gauche","Logo F\u00f3rmula 1 \u2014 top-left corner","Logo F\u00f3rmula 1 \u2014 canto superior esquerdo","Logo F\u00f3rmula 1 \u2014 Canto superior esquerdo","Formula 1 Logo \u2014 top-left corner"],["Nome do modelo \u2014 canto sup. esq.","Model name \u2014 top-left corner","Nombre del modelo \u2014 esquina sup. izq.","Nom du mod\u00e8le \u2014 coin sup. gauche","Nome do modelo \u2014 top-left corner","Nome do modelo \u2014 canto superior esquerdo","Nome do modelo \u2014 Top left corner"],["MODEL LOGO \u2014 CANTO INFERIOR DIREITO","MODEL LOGO \u2014 BOTTOM RIGHT CORNER","LOGO DEL MODELO \u2014 ESQUINA INFERIOR DERECHA","LOGO DU MOD\u00c8LE \u2014 COIN INF\u00c9RIEUR DROIT"],["BRAND LOGO \u2014 CANTO SUPERIOR ESQUERDO","BRAND LOGO \u2014 TOP LEFT CORNER","LOGO DE LA MARCA \u2014 ESQUINA SUPERIOR IZQUIERDA","LOGO DE LA MARQUE \u2014 COIN SUP\u00c9RIEUR GAUCHE"],["Logo da Marca","Brand Logo","Logo de la marca","Logo de la marque"],["Logo do Modelo","Model Logo","Logo del modelo","Logo du mod\u00e8le"],["Nome do modelo","Model name","Nombre del modelo","Nom du mod\u00e8le"],["canto sup. esq.","top-left corner","esquina sup. izq.","coin sup. gauche","canto superior esquerdo","Canto superior esquerdo","Top left corner"],["canto inf. dir.","bottom-right corner","esquina inf. der.","coin inf. droit","canto inferior direito","Canto inferior direito","Bottom right corner"],["CANTO INFERIOR DIREITO","BOTTOM RIGHT CORNER","ESQUINA INFERIOR DERECHA","COIN INF\u00c9RIEUR DROIT"],["CANTO SUPERIOR ESQUERDO","TOP LEFT CORNER","ESQUINA SUPERIOR IZQUIERDA","COIN SUP\u00c9RIEUR GAUCHE"],["Degrad\u00ea Central","Center Gradient","Degradado central","D\u00e9grad\u00e9 central"],["Cor do Degrad\u00ea Central","Center Gradient Color","Color del degradado central","Couleur du d\u00e9grad\u00e9 central"],["ENVIE A IMAGEM DA SUA PREFER\u00caNCIA","SEND YOUR PREFERRED IMAGE","ENV\u00cdA LA IMAGEN QUE PREFIERAS","ENVOYEZ L\u2019IMAGE DE VOTRE CHOIX"],["Envie a imagem da sua prefer\u00eancia","Send your preferred image","Env\u00eda la imagen que prefieras","Envoyez l\u2019image de votre choix"],["Moldura Laca Preto","Black Lacquer Frame","Marco Laca negra","Cadre Laque noire"],["Moldura Fibra de Carbono","Carbon Fiber Frame","Marco Fibra de carbono","Cadre Fibre de carbone"],["Fundo Fibra de Carbono (Vinil)","Carbon Fiber (Vinyl) Background","Fondo Fibra de carbono (vinilo)","Fond Fibre de carbone (vinyle)"],["Fundo Fibra de Carbono","Carbon Fiber Background","Fondo Fibra de carbono","Fond Fibre de carbone"],["Fundo Acr\u00edlico UV","UV Acrylic Background","Fondo Acr\u00edlico UV","Fond Acrylique UV"],["\u2714 Produto pronto para entrega \u00b7 \u2714 Quadro + Miniatura inclusos \u00b7 \u2714 Embalagem premium","\u2714 Ready for delivery \u00b7 \u2714 Frame + Miniature included \u00b7 \u2714 Premium packaging","\u2714 Producto listo para entrega \u00b7 \u2714 Cuadro + Miniatura incluidos \u00b7 \u2714 Embalaje premium","\u2714 Produit pr\u00eat \u00e0 livrer \u00b7 \u2714 Cadre + Miniature inclus \u00b7 \u2714 Emballage premium"],["Acr\u00edlico Brilho com Impress\u00e3o UV","Glossy Acrylic \u2014 UV","Acr\u00edlico brillante con impresi\u00f3n UV","Acrylique brillant avec impression UV"],["Die-cast \u2014 dispon\u00edvel no mercado","Die-cast \u2014 available on market","Die-cast \u2014 disponible en el mercado","Die-cast \u2014 disponible sur le march\u00e9"],["A verificar pela equipe Funparts","To be verified by Funparts team","A verificar por el equipo Funparts","\u00c0 v\u00e9rifier par l\u2019\u00e9quipe Funparts"],["Impress\u00e3o 3D + Pintura Automotiva","3D Printing + Automotive Paint","Impresi\u00f3n 3D + Pintura de automoci\u00f3n","Impression 3D + Peinture automobile"],["Textura Rexy","Texture Rexy","Textura Rexy","Texture Rexy"],["TEXTURA REXY","TEXTURE REXY","TEXTURA REXY","TEXTURE REXY"],["Degrad\u00ea Linear","Linear Gradient","Degradado lineal","D\u00e9grad\u00e9 lin\u00e9aire"],["Degrad\u00ea","Gradient","Degradado","D\u00e9grad\u00e9"],["Abstrato","Abstract","Abstracto","Abstrait"],["Setas","Arrows","Flechas","Fl\u00e8ches"],["Listra Central","Center Stripe","Franja central","Bande centrale"],["Listras","Stripes","Franjas","Bandes"],["Bicolor","Two-tone","Bicolor","Bicolore"],["Imagens","Images","Im\u00e1genes","Images"],["Retirar na f\u00e1brica","Factory pickup","Recogida en f\u00e1brica","Retrait \u00e0 l\u2019atelier","Retirar na F\u00e1brica"],["Com ilumina\u00e7\u00e3o LED","With LED lighting","Con iluminaci\u00f3n LED","Avec \u00e9clairage LED","Com Ilumina\u00e7\u00e3o LED"],["COM ILUMINA\u00c7\u00c3O LED","WITH LED LIGHTING","CON ILUMINACI\u00d3N LED","AVEC \u00c9CLAIRAGE LED"],["Sem ilumina\u00e7\u00e3o","Without lighting","Sin iluminaci\u00f3n","Sans \u00e9clairage","Sem Ilumina\u00e7\u00e3o"],["SEM ILUMINA\u00c7\u00c3O","WITHOUT LIGHTING","SIN ILUMINACI\u00d3N","SANS \u00c9CLAIRAGE"],["GR\u00c1TIS","FREE","GRATIS","GRATUIT"],["gr\u00e1tis","free","gratis","gratuit"],["Escolha o frete","Select shipping","Elige el env\u00edo","Choisissez la livraison"],["CONTINUAR","CONTINUE","CONTINUAR","CONTINUER"],["Continuar","Continue","Continuar","Continuer"],["Continuar comprando","Continue shopping","Seguir comprando","Continuer les achats","Continue comprando"],["para Lego.","frames for Lego.","para Lego.","pour Lego."],["Avi\u00f5es","Planes","Aviones","Avions"],["Bandeira do Pa\u00eds","Country flag","Bandera del pa\u00eds","Drapeau du pays"],["Nome do Piloto","Driver name","Nombre del piloto","Nom du pilote"],["Campo obrigat\u00f3rio","Required field","Campo obligatorio","Champ obligatoire"],["E-mail inv\u00e1lido","Invalid email","E-mail no v\u00e1lido","E-mail invalide"],["Informe nome e sobrenome","Enter first and last name","Indica nombre y apellido","Indiquez pr\u00e9nom et nom"],["Informe o bairro","Enter the district","Indica el barrio","Indiquez le quartier"],["Informe a cidade","Enter the city","Indica la ciudad","Indiquez la ville"],["Cupom inv\u00e1lido","Invalid code","C\u00f3digo no v\u00e1lido","Code invalide"],["Cupom n\u00e3o encontrado.","Code not found.","C\u00f3digo no encontrado.","Code introuvable."],["Este cupom ainda n\u00e3o est\u00e1 v\u00e1lido.","This code is not valid yet.","Este c\u00f3digo a\u00fan no es v\u00e1lido.","Ce code n\u2019est pas encore valable."],["Este cupom atingiu o limite de usos.","This code has reached its usage limit.","Este c\u00f3digo ha alcanzado su l\u00edmite de usos.","Ce code a atteint sa limite d\u2019utilisation."],["Este cupom est\u00e1 desativado.","This code is disabled.","Este c\u00f3digo est\u00e1 desactivado.","Ce code est d\u00e9sactiv\u00e9."],["Este cupom expirou.","This code has expired.","Este c\u00f3digo ha caducado.","Ce code a expir\u00e9."],["Informe um cupom.","Enter a code.","Introduce un c\u00f3digo.","Saisissez un code."],["Consulta","On request","Consulta","Sur demande"],["Cor Principal","Main color","Color principal","Couleur principale"],["Cor de Destaque","Accent color","Color de realce","Couleur d\u2019accent"],["Decals de patrocinadores","Sponsor decals","Calcas de patrocinadores","Stickers des sponsors"],["Faixa Deslocada","Offset Stripe","Franja desplazada","Bande d\u00e9cal\u00e9e"],["Meio a Meio","Half and Half","Mitad y mitad","Moiti\u00e9-moiti\u00e9"],["Sua Imagem","Your Image","Tu imagen","Votre image"],["SUA IMAGEM","YOUR IMAGE","TU IMAGEN","VOTRE IMAGE"],["Display / Redoma de Acr\u00edlico","Display / Acrylic Case","Display / Vitrina de acr\u00edlico","Pr\u00e9sentoir / Vitrine en acrylique"],["Acr\u00edlico cristal","Crystal acrylic","Acr\u00edlico cristal","Acrylique cristal"],["Redoma","Display case","Vitrina","Vitrine"],["Escala da miniatura","Model car scale","Escala de la miniatura","\u00c9chelle de la miniature"],["Marca","Brand","Marca","Marque"],["Inclusa","Included","Incluida","Incluse"],["Fibra de carbono","Carbon fiber","Fibra de carbono","Fibre de carbone"],["Laca Fosco","Matte lacquer","Laca mate","Laque mate"],["Seu Carro","Your Car","Tu coche","Votre voiture"],["Quadro para Miniaturas","Frame for Model Cars","Cuadro para miniaturas","Cadre pour miniatures"],["Produto pronto","Ready-made product","Producto listo","Produit pr\u00eat"],["Quadros prontos","Ready-made frames","Cuadros listos","Cadres pr\u00eats"],["Miniatura inclusa","Model car included","Miniatura incluida","Miniature incluse"],["Existe no mercado","Available on the market","Existe en el mercado","Existe sur le march\u00e9"],["N\u00e3o tenho certeza","I'm not sure","No estoy seguro","Je ne suis pas s\u00fbr"],["Nossa equipe verifica e retorna via WhatsApp","Our team checks and gets back to you on WhatsApp","Nuestro equipo lo verifica y te responde por WhatsApp","Notre \u00e9quipe v\u00e9rifie et vous r\u00e9pond par WhatsApp"],["N\u00e3o existe \u2014 modelo exclusivo","Doesn't exist \u2014 exclusive model","No existe \u2014 modelo exclusivo","N\u2019existe pas \u2014 mod\u00e8le exclusif"],["Fan\u00e1tico, essa miniatura \u00e9 sensacional.","Wow, this model car is sensational.","\u00a1Qu\u00e9 pasada, esta miniatura es sensacional!","Superbe, cette miniature est sensationnelle."],["Aguarde! Estamos gerando uma nova imagem da vista superior da sua miniatura.","Please wait! We are generating a new top-view image of your model car.","\u00a1Un momento! Estamos generando una nueva imagen de la vista superior de tu miniatura.","Un instant ! Nous g\u00e9n\u00e9rons une nouvelle image de votre miniature vue du dessus."],["Em instantes iremos demonstrar alguns modelos para que consiga escolher qual ir\u00e1 combinar com o seu ambiente.","In a moment we will show you a few options so you can choose the one that suits your space.","En unos instantes te mostraremos algunos modelos para que elijas el que mejor combine con tu espacio.","Dans un instant, nous vous pr\u00e9senterons quelques mod\u00e8les pour que vous choisissiez celui qui s\u2019accorde \u00e0 votre int\u00e9rieur."],["J\u00e1 consegue imaginar ela em um quadro?","Can you already picture it in a frame?","\u00bfYa te la imaginas en un cuadro?","Vous l\u2019imaginez d\u00e9j\u00e0 dans un cadre ?"],["Pronto!","Done!","\u00a1Listo!","C\u2019est pr\u00eat !"],["Preparando\u2026","Preparing\u2026","Preparando\u2026","Pr\u00e9paration\u2026"],["Preparando o pedido\u2026","Preparing your order\u2026","Preparando el pedido\u2026","Pr\u00e9paration de la commande\u2026"],["Ajustando ilumina\u00e7\u00e3o\u2026","Adjusting the lighting\u2026","Ajustando la iluminaci\u00f3n\u2026","R\u00e9glage de l\u2019\u00e9clairage\u2026"],["Fechar","Close","Cerrar","Fermer"],["Visualizador","Viewer","Visualizador","Visualiseur"],["Informa\u00e7\u00e3o","Information","Informaci\u00f3n","Information"],["Outros (digitar)","Other (type it)","Otros (escribir)","Autres (saisir)"],["Vinil Fibra de Carbono","Carbon Fiber Vinyl","Vinilo fibra de carbono","Vinyle fibre de carbone"],["Revestimento do fundo com vinil texturizado de fibra de carbono","Back panel covered in textured carbon fiber vinyl","Fondo revestido con vinilo texturizado de fibra de carbono","Fond habill\u00e9 de vinyle textur\u00e9 fibre de carbone"],["Consulte o pre\u00e7o","Price on request","Consulta el precio","Prix sur demande"],["Sem conex\u00e3o com o servidor de imagens. Verifique sua internet e tente novamente.","No connection to the image server. Check your internet and try again.","Sin conexi\u00f3n con el servidor de im\u00e1genes. Comprueba tu conexi\u00f3n e int\u00e9ntalo de nuevo.","Connexion au serveur d\u2019images impossible. V\u00e9rifiez votre connexion et r\u00e9essayez."],["Erro de conex\u00e3o com o servidor","Server connection error","Error de conexi\u00f3n con el servidor","Erreur de connexion au serveur"],["Erro desconhecido","Unknown error","Error desconocido","Erreur inconnue"],["\u26a0 Selecione uma marca, preencha o modelo e selecione uma cor.","\u26a0 Select a brand, enter the model and pick a color.","\u26a0 Selecciona una marca, indica el modelo y elige un color.","\u26a0 S\u00e9lectionnez une marque, indiquez le mod\u00e8le et choisissez une couleur."],["\u26a0 Preencha a marca, o modelo e selecione uma cor.","\u26a0 Enter the brand and model, and pick a color.","\u26a0 Indica la marca y el modelo, y elige un color.","\u26a0 Indiquez la marque et le mod\u00e8le, puis choisissez une couleur."],["Foto recebida. Nossa equipe validar\u00e1 a escala.","Photo received. Our team will check the scale.","Foto recibida. Nuestro equipo validar\u00e1 la escala.","Photo re\u00e7ue. Notre \u00e9quipe validera l\u2019\u00e9chelle."],["Set n\u00e3o selecionado","No set selected","Set no seleccionado","Aucun set s\u00e9lectionn\u00e9"],["Com LED \u2728","With LED \u2728","Con LED \u2728","Avec LED \u2728"],["Com LED","With LED","Con LED","Avec LED"],["Branco P\u00e9rola","Pearl White","Blanco perla","Blanc nacr\u00e9"],["Prata Met\u00e1lico","Metallic Silver","Plata metalizado","Argent m\u00e9tallis\u00e9"],["Este produto cont\u00e9m alto relevo por\u00e9m n\u00e3o \u00e9 edit\u00e1vel.","This product includes a relief, but it cannot be edited.","Este producto incluye relieve, pero no es editable.","Ce produit comporte un relief, mais il n\u2019est pas modifiable."],["Nenhuma op\u00e7\u00e3o dispon\u00edvel para este CEP.","No option available for this postal code.","No hay opciones disponibles para este c\u00f3digo postal.","Aucune option disponible pour ce code postal."],["1 dia \u00fatil","1 business day","1 d\u00eda h\u00e1bil","1 jour ouvr\u00e9"],["Calculando frete\u2026","Calculating shipping\u2026","Calculando el env\u00edo\u2026","Calcul de la livraison\u2026"],["N\u00e3o foi poss\u00edvel calcular o frete para este CEP.","We couldn't calculate shipping for this postal code.","No se pudo calcular el env\u00edo para este c\u00f3digo postal.","Impossible de calculer la livraison pour ce code postal."],["Erro ao calcular frete. Tente novamente.","Error calculating shipping. Please try again.","Error al calcular el env\u00edo. Int\u00e9ntalo de nuevo.","Erreur lors du calcul de la livraison. R\u00e9essayez."],["Buscando endere\u00e7o\u2026","Looking up address\u2026","Buscando direcci\u00f3n\u2026","Recherche de l\u2019adresse\u2026"],["CEP n\u00e3o encontrado","Postal code not found","C\u00f3digo postal no encontrado","Code postal introuvable"],["sem fio","wireless","inal\u00e1mbrico","sans fil"],["com fio","wired","con cable","filaire"],["Escala real do quadro","Actual frame scale","Escala real del cuadro","\u00c9chelle r\u00e9elle du cadre"],["Somente quadro","Frame only","Solo el cuadro","Cadre seul"],["Quadro LEGO","LEGO frame","Cuadro LEGO","Cadre LEGO"],["Tra\u00e7ado de Interlagos","Interlagos track layout","Trazado de Interlagos","Trac\u00e9 d\u2019Interlagos"],["DeLorean \u2014 De Volta para o Futuro","DeLorean \u2014 Back to the Future","DeLorean \u2014 Regreso al futuro","DeLorean \u2014 Retour vers le futur"],["Rel\u00e2mpago McQueen","Lightning McQueen","Rayo McQueen","Flash McQueen"],["Redbull F1 - Edi\u00e7\u00e3o Especial Suzuka","Red Bull F1 - Suzuka Special Edition","Red Bull F1 - Edici\u00f3n especial Suzuka","Red Bull F1 - \u00c9dition sp\u00e9ciale Suzuka"],["Este item foi adicionado antes desta atualiza\u00e7\u00e3o e n\u00e3o guardou os dados necess\u00e1rios para edi\u00e7\u00e3o. Remova e monte novamente para poder edit\u00e1-lo.","This item was added before this update and did not keep the data needed for editing. Remove it and build it again to edit it.","Este art\u00edculo se a\u00f1adi\u00f3 antes de esta actualizaci\u00f3n y no guard\u00f3 los datos necesarios para editarlo. Elim\u00ednalo y vuelve a crearlo para poder editarlo.","Cet article a \u00e9t\u00e9 ajout\u00e9 avant cette mise \u00e0 jour et n\u2019a pas conserv\u00e9 les donn\u00e9es n\u00e9cessaires \u00e0 sa modification. Retirez-le et recr\u00e9ez-le pour pouvoir le modifier."],["B\u00e9lgica","Belgium","B\u00e9lgica","Belgique"],["Fran\u00e7a","France","Francia","France"],["Alemanha","Germany","Alemania","Allemagne"],["Pa\u00edses Baixos","Netherlands","Pa\u00edses Bajos","Pays-Bas"],["Luxemburgo","Luxembourg","Luxemburgo","Luxembourg"],["It\u00e1lia","Italy","Italia","Italie"],["Espanha","Spain","Espa\u00f1a","Espagne"],["\u00c1ustria","Austria","Austria","Autriche"],["Irlanda","Ireland","Irlanda","Irlande"],["B\u00e9lgica / Belgium","Belgium","B\u00e9lgica","Belgique"],["Pa\u00edses Baixos / Netherlands","Netherlands","Pa\u00edses Bajos","Pays-Bas"],["Alemanha / Germany","Germany","Alemania","Allemagne"],["Fran\u00e7a / France","France","Francia","France"],["Luxemburgo / Luxembourg","Luxembourg","Luxemburgo","Luxembourg"],["Espanha / Spain","Spain","Espa\u00f1a","Espagne"],["It\u00e1lia / Italy","Italy","Italia","Italie"],["Abrir carrinho","Open cart","Abrir carrito","Ouvrir le panier"],["Carrinho de compras","Shopping cart","Carrito de compras","Panier"],["Idioma e regi\u00e3o","Language and region","Idioma y regi\u00f3n","Langue et r\u00e9gion","Idioma e regi\u00c3\u00a3o","Idioma e regi\u00c3\u0083\u00c2\u00a3o"],["Limpar","Clear","Limpiar","Effacer"],["Voltar","Back","Volver","Retour"],["somar uma unidade","add one","sumar una unidad","ajouter une unit\u00e9"],["tirar uma unidade","remove one","quitar una unidad","retirer une unit\u00e9"],["Saiba mais","Learn more","Saber m\u00e1s","En savoir plus"],["Ex: 2023","e.g. 2023","Ej.: 2023","Ex. : 2023"],["Ex: Ferrari 488 GTB, McLaren Senna...","e.g. Ferrari 488 GTB, McLaren Senna...","Ej.: Ferrari 488 GTB, McLaren Senna...","Ex. : Ferrari 488 GTB, McLaren Senna..."],["Redomas de acr\u00edlico","Acrylic display cases","Vitrinas de acr\u00edlico","Vitrines en acrylique"],["Redomas de acr\u00edlico personalizadas","Custom acrylic display cases","Vitrinas de acr\u00edlico personalizadas","Vitrines en acrylique personnalis\u00e9es"],["Redomas de acr\u00edlico - Dimens\u00e3o personalizada","Acrylic display cases - Made to measure","Vitrinas de acr\u00edlico - A medida","Vitrines en acrylique - Sur mesure"]];
  var MO=[["Passo {n} de {m}","Step {n} of {m}","Paso {n} de {m}","\u00c9tape {n} sur {m}"],["Escala: {n}","Scale: {n}","Escala: {n}","\u00c9chelle : {n}"],["Foto {n}","Photo {n}","Foto {n}","Photo {n}"],["\"{0}\" adicionado","\"{0}\" added","\"{0}\" a\u00f1adido","\"{0}\" ajout\u00e9"],["Moldura {0}","{0} Frame","Marco {0}","Cadre {0}"],["Fundo {0}","{0} Background","Fondo {0}","Fond {0}"]], NFECH=4;
  var PROD={"r4":{"n":["Display case for the LEGO Lando Norris helmet","Vitrina para el casco LEGO de Lando Norris","Vitrine pour le casque LEGO de Lando Norris"]},"r5":{"n":["Display case for the LEGO Oscar Piastri helmet","Vitrina para el casco LEGO de Oscar Piastri","Vitrine pour le casque LEGO d\u2019Oscar Piastri"]},"r6":{"n":["Display case for the LEGO Leclerc helmet","Vitrina para el casco LEGO de Leclerc","Vitrine pour le casque LEGO de Leclerc"]},"r7":{"n":["Malboro sticker for the LEGO Senna helmet","Adhesivo Malboro para el casco LEGO de Senna","Autocollant Malboro pour le casque LEGO de Senna"],"d":["Sticker made of white vinyl with UV printing.\nIt ships pre-cut: just peel it off and apply it to the LEGO piece on the front of the helmet.","Adhesivo fabricado en vinilo blanco con impresi\u00f3n UV.\nLo enviamos ya recortado: solo tienes que despegarlo y pegarlo en la pieza de LEGO situada en la parte frontal del casco.","Autocollant r\u00e9alis\u00e9 en vinyle blanc avec impression UV.\nIl est livr\u00e9 pr\u00e9d\u00e9coup\u00e9 : il suffit de le d\u00e9tacher et de le coller sur la pi\u00e8ce LEGO situ\u00e9e \u00e0 l\u2019avant du casque."]},"r8":{"n":["Display case for Michael Schumacher\u2019s Ferrari F2004","Vitrina para el Ferrari F2004 de Michael Schumacher","Vitrine pour la Ferrari F2004 de Michael Schumacher"]},"r9":{"n":["Display case for Nigel Mansell\u2019s Renault","Vitrina para el Renault de Nigel Mansell","Vitrine pour la Renault de Nigel Mansell"]},"r10":{"n":["Display case for Disney \u201cMickey ears\u201d","Vitrina para las \u201corejas de Mickey\u201d de Disney","Vitrine pour les \u00ab oreilles de Mickey \u00bb Disney"]},"r11":{"n":["Premium display case for the Shell Ferrari 2026 Collection","Vitrina/display premium para la Colecci\u00f3n Shell Ferrari 2026","Vitrine/pr\u00e9sentoir premium pour la Collection Shell Ferrari 2026"],"d":["Showcase your collection with the Funparts Premium Acrylic Display Case, designed to present the Shell service station Ferrari 2026 model cars with order, protection and elegance.\n\nMade from 3 mm premium acrylic, it offers excellent transparency to highlight every detail of the cars. Its double base pairs 3 mm Piano Black acrylic with 5 mm clear acrylic, creating a refined finish that enhances the whole set.\n\nMeasuring 29.5 cm wide \u00d7 17.5 cm deep \u00d7 7 cm high, it is ideal for turning your collection into a centerpiece of your decor.\n\nThe case ships disassembled and uses a snap-fit system that is extremely easy to assemble, with no glue required.\n\nModel cars not included.","Realza tu colecci\u00f3n con la Vitrina de Acr\u00edlico Premium Funparts, dise\u00f1ada para exponer las miniaturas Ferrari 2026 de las estaciones Shell con orden, protecci\u00f3n y elegancia.\n\nFabricada en acr\u00edlico premium de 3 mm, ofrece una transparencia excelente para destacar cada detalle de los coches. Su base doble combina acr\u00edlico Negro Piano de 3 mm con acr\u00edlico transparente de 5 mm, creando un acabado sofisticado que realza el conjunto.\n\nCon unas dimensiones de 29,5 cm de ancho \u00d7 17,5 cm de fondo \u00d7 7 cm de alto, es ideal para convertir tu colecci\u00f3n en protagonista de la decoraci\u00f3n.\n\nLa vitrina se env\u00eda desmontada y cuenta con un sistema de encaje de montaje muy sencillo, sin necesidad de pegamento.\n\nMiniaturas no incluidas.","Mettez votre collection en valeur avec la Vitrine en Acrylique Premium Funparts, con\u00e7ue pour exposer les miniatures Ferrari 2026 des stations Shell avec ordre, protection et \u00e9l\u00e9gance.\n\nR\u00e9alis\u00e9e en acrylique premium de 3 mm, elle offre une excellente transparence pour souligner chaque d\u00e9tail des voitures. Son double socle associe un acrylique Noir Piano de 3 mm \u00e0 un acrylique transparent de 5 mm, pour une finition raffin\u00e9e qui sublime l\u2019ensemble.\n\nAvec ses dimensions de 29,5 cm de large \u00d7 17,5 cm de profondeur \u00d7 7 cm de haut, elle est id\u00e9ale pour faire de votre collection un \u00e9l\u00e9ment phare de votre d\u00e9coration.\n\nLa vitrine est livr\u00e9e d\u00e9mont\u00e9e et dispose d\u2019un syst\u00e8me d\u2019embo\u00eetement au montage tr\u00e8s simple, sans colle.\n\nMiniatures non incluses."]},"r12":{"n":["Premium display case for the Shell Ferrari 2025 Collection","Vitrina/display premium para la Colecci\u00f3n Shell Ferrari 2025","Vitrine/pr\u00e9sentoir premium pour la Collection Shell Ferrari 2025"],"d":{"c":"r11","s":[["2026","2025"]]}},"r13":{"n":["Acrylic display case for the LEGO Ferrari F1 SF24","Vitrina de acr\u00edlico para el Ferrari F1 SF24 de LEGO","Vitrine en acrylique pour la Ferrari F1 SF24 LEGO"],"d":["Your Ferrari SF24 deserves a display worthy of a true racing machine!\n\nDesigned specifically for the LEGO Ferrari SF24, the Funparts premium display case combines sophistication, protection and a flawless finish, turning your collectible into a true decorative piece.\n\nMade from 3 mm premium crystal acrylic, it offers excellent transparency and a privileged view of every detail of your LEGO.\n\nProduct features:\n\n- Dimensions: 72 \u00d7 30 \u00d7 18 cm (length \u00d7 depth \u00d7 height).\n- Material: 3 mm premium crystal acrylic.\n- Double base: first layer in 3 mm Piano Black acrylic and second layer in 5 mm premium acrylic.\n- Finish: sophisticated design, with exceptional transparency and shine.\n- Assembly: practical snap-fit system, with no glue or screws required.\n- Shipping: shipped disassembled, for easier transport and greater safety.\n\n\ud83c\udfc1 Much more than protection: it showcases your collection!\n\nWith the Funparts quality standard, your Ferrari SF24 gets the spotlight it deserves, whether in the office, the living room or your dedicated motorsport space.\n\nFunparts \u2014 Your passion deserves to be on display!\n\nNote: LEGO Ferrari SF24 not included.","\u00a1Tu Ferrari SF24 merece una exposici\u00f3n a la altura de una aut\u00e9ntica m\u00e1quina de las pistas!\n\nDise\u00f1ada especialmente para el LEGO Ferrari SF24, la vitrina premium de Funparts combina sofisticaci\u00f3n, protecci\u00f3n y un acabado impecable, convirtiendo tu pieza de colecci\u00f3n en un aut\u00e9ntico objeto de decoraci\u00f3n.\n\nFabricada en acr\u00edlico cristal premium de 3 mm, ofrece una transparencia excelente y una visi\u00f3n privilegiada de todos los detalles de tu LEGO.\n\nCaracter\u00edsticas del producto:\n\n- Dimensiones: 72 \u00d7 30 \u00d7 18 cm (largo \u00d7 fondo \u00d7 alto).\n- Material: acr\u00edlico cristal premium de 3 mm.\n- Base doble: primera capa en acr\u00edlico Negro Piano de 3 mm y segunda capa en acr\u00edlico premium de 5 mm.\n- Acabado: dise\u00f1o sofisticado, con transparencia y brillo excepcionales.\n- Montaje: pr\u00e1ctico sistema de encaje, sin necesidad de pegamento ni tornillos.\n- Env\u00edo: producto enviado desmontado, lo que facilita el transporte y ofrece mayor seguridad.\n\n\ud83c\udfc1 \u00a1Mucho m\u00e1s que proteger: es realzar tu colecci\u00f3n!\n\nCon el est\u00e1ndar de calidad Funparts, tu Ferrari SF24 recibe el protagonismo que merece, ya sea en la oficina, en el sal\u00f3n o en tu espacio dedicado al automovilismo.\n\nFunparts \u2014 \u00a1Tu pasi\u00f3n merece estar en exposici\u00f3n!\n\nNota: LEGO Ferrari SF24 no incluido.","Votre Ferrari SF24 m\u00e9rite une exposition \u00e0 la hauteur d\u2019une v\u00e9ritable machine de course !\n\nCon\u00e7ue sp\u00e9cialement pour la LEGO Ferrari SF24, la vitrine premium Funparts allie sophistication, protection et finition irr\u00e9prochable, pour transformer votre pi\u00e8ce de collection en v\u00e9ritable objet de d\u00e9coration.\n\nR\u00e9alis\u00e9e en acrylique cristal premium de 3 mm, elle offre une excellente transparence et une vue privil\u00e9gi\u00e9e sur tous les d\u00e9tails de votre LEGO.\n\nCaract\u00e9ristiques du produit :\n\n- Dimensions : 72 \u00d7 30 \u00d7 18 cm (longueur \u00d7 profondeur \u00d7 hauteur).\n- Mat\u00e9riau : acrylique cristal premium de 3 mm.\n- Double socle : premi\u00e8re couche en acrylique Noir Piano de 3 mm et seconde couche en acrylique premium de 5 mm.\n- Finition : design raffin\u00e9, avec une transparence et une brillance exceptionnelles.\n- Montage : syst\u00e8me d\u2019embo\u00eetement pratique, sans colle ni vis.\n- Exp\u00e9dition : produit livr\u00e9 d\u00e9mont\u00e9, pour un transport plus simple et plus s\u00fbr.\n\n\ud83c\udfc1 Bien plus qu\u2019une protection : une mise en valeur de votre collection !\n\nAvec le standard de qualit\u00e9 Funparts, votre Ferrari SF24 re\u00e7oit la place qu\u2019elle m\u00e9rite, au bureau, au salon ou dans votre espace d\u00e9di\u00e9 au sport automobile.\n\nFunparts \u2014 Votre passion m\u00e9rite d\u2019\u00eatre expos\u00e9e !\n\nRemarque : LEGO Ferrari SF24 non incluse."]},"r14":{"n":["Acrylic display case for the LEGO Mercedes F1 W14","Vitrina de acr\u00edlico para el Mercedes F1 W14 de LEGO","Vitrine en acrylique pour la Mercedes F1 W14 LEGO"],"d":{"c":"r13","s":[["LEGO Ferrari SF24","LEGO Mercedes W14 F1"],["Ferrari SF24","Mercedes W14 F1"]]}},"r15":{"n":["Premium display case for the Ferrari 12Cilindri - Shell Ferrari 2026 Collection","Vitrina/display premium para el Ferrari 12Cilindri - Colecci\u00f3n Shell Ferrari 2026","Vitrine/pr\u00e9sentoir premium pour la Ferrari 12Cilindri - Collection Shell Ferrari 2026"],"d":["Your Ferrari deserves much more than a spot on the shelf. It deserves a display worthy of its history! \ud83c\udfc1\n\nFunparts presents its new Premium Acrylic Display Case, designed specifically for the Ferrari 12Cilindri model car from the Shell 2026 Collection.\n\nWith a sophisticated design, a flawless finish and high-quality materials, this case turns your model car into a true showpiece.\n\nDetails that make the difference:\n\n- Dimensions: 16.5 \u00d7 10 \u00d7 7 cm (height).\n- 3 mm premium crystal acrylic: exceptional transparency and a refined finish.\n- Two-step double base: an elegant combination of 3 mm Piano Black acrylic and 5 mm premium acrylic.\n- UV printing directly on the acrylic: exclusive artwork applied to the back panel of the case, creating a custom backdrop that enhances the Ferrari even more.\n- Exclusive Funparts design: developed to deliver a sophisticated, distinctive presentation.\n\n\ud83c\udfc6 It is not just protection. It is a display experience!\n\nEvery detail was designed to highlight the lines and character of the Ferrari 12Cilindri, combining elegance, technology and a passion for motorsport.\n\nFunparts \u2014 Turning your passion into art!\n\nModel car not included.","Tu Ferrari merece mucho m\u00e1s que un lugar en la estanter\u00eda. \u00a1Merece una exposici\u00f3n a la altura de su historia! \ud83c\udfc1\n\nFunparts presenta su nueva Vitrina de Acr\u00edlico Premium, dise\u00f1ada especialmente para la miniatura Ferrari 12Cilindri de la Colecci\u00f3n Shell 2026.\n\nCon un dise\u00f1o sofisticado, un acabado impecable y materiales de alta calidad, esta vitrina convierte tu miniatura en una aut\u00e9ntica pieza de exposici\u00f3n.\n\nDetalles que marcan la diferencia:\n\n- Dimensiones: 16,5 \u00d7 10 \u00d7 7 cm (alto).\n- Acr\u00edlico cristal premium de 3 mm: transparencia excepcional y acabado refinado.\n- Base doble en dos escalones: elegante combinaci\u00f3n de acr\u00edlico Negro Piano de 3 mm con acr\u00edlico premium de 5 mm.\n- Impresi\u00f3n UV directamente sobre el acr\u00edlico: dise\u00f1o exclusivo aplicado en la cara trasera de la vitrina, creando un escenario personalizado que realza a\u00fan m\u00e1s el Ferrari.\n- Dise\u00f1o exclusivo Funparts: desarrollado para ofrecer una presentaci\u00f3n sofisticada y diferente.\n\n\ud83c\udfc6 No es solo una protecci\u00f3n. \u00a1Es una experiencia de exposici\u00f3n!\n\nCada detalle fue pensado para destacar las l\u00edneas y la personalidad del Ferrari 12Cilindri, uniendo elegancia, tecnolog\u00eda y pasi\u00f3n por el automovilismo.\n\nFunparts \u2014 \u00a1Transformando tu pasi\u00f3n en arte!\n\nMiniatura no incluida.","Votre Ferrari m\u00e9rite bien plus qu\u2019une place sur une \u00e9tag\u00e8re. Elle m\u00e9rite une exposition \u00e0 la hauteur de son histoire ! \ud83c\udfc1\n\nFunparts pr\u00e9sente sa nouvelle Vitrine en Acrylique Premium, con\u00e7ue sp\u00e9cialement pour la miniature Ferrari 12Cilindri de la Collection Shell 2026.\n\nAvec son design raffin\u00e9, sa finition irr\u00e9prochable et ses mat\u00e9riaux de haute qualit\u00e9, cette vitrine transforme votre miniature en v\u00e9ritable pi\u00e8ce d\u2019exposition.\n\nLes d\u00e9tails qui font la diff\u00e9rence :\n\n- Dimensions : 16,5 \u00d7 10 \u00d7 7 cm (hauteur).\n- Acrylique cristal premium de 3 mm : transparence exceptionnelle et finition raffin\u00e9e.\n- Double socle \u00e0 deux niveaux : association \u00e9l\u00e9gante d\u2019un acrylique Noir Piano de 3 mm et d\u2019un acrylique premium de 5 mm.\n- Impression UV directement sur l\u2019acrylique : visuel exclusif appliqu\u00e9 sur la face arri\u00e8re de la vitrine, cr\u00e9ant un d\u00e9cor personnalis\u00e9 qui met encore plus la Ferrari en valeur.\n- Design exclusif Funparts : pens\u00e9 pour offrir une pr\u00e9sentation raffin\u00e9e et distinctive.\n\n\ud83c\udfc6 Ce n\u2019est pas seulement une protection. C\u2019est une exp\u00e9rience d\u2019exposition !\n\nChaque d\u00e9tail a \u00e9t\u00e9 pens\u00e9 pour souligner les lignes et la personnalit\u00e9 de la Ferrari 12Cilindri, en alliant \u00e9l\u00e9gance, technologie et passion du sport automobile.\n\nFunparts \u2014 Transformer votre passion en art !\n\nMiniature non incluse."]},"r16":{"n":["Display case for the LEGO McLaren MP4/4 + Ayrton Senna helmet","Vitrina para el McLaren MP4/4 + casco LEGO de Ayrton Senna","Vitrine pour la McLaren MP4/4 + le casque LEGO d\u2019Ayrton Senna"],"d":["TWO LEGENDS. ONE DISPLAY CASE\n\nThe legendary McLaren MP4/4 and Ayrton Senna\u2019s iconic helmet, together in a display worthy of their history! \ud83c\udde7\ud83c\uddf7\n\nIntroducing the FUNPARTS Premium Acrylic Display Case, designed especially for collectors who want to bring together two of LEGO\u2019s most iconic sets in a single presentation, with sophistication, protection and a high-end finish.\n\nWHAT MAKES IT DIFFERENT\n\nUnlike conventional display cases, this project was designed to hold the LEGO McLaren MP4/4 and the LEGO Ayrton Senna helmet at the same time, creating an exclusive composition that enhances every detail of both models.\n\nPREMIUM MATERIALS AND FINISH\n\nMade with sides and top in 3 mm clear crystal acrylic, the case offers excellent visibility, protection against dust and a refined finish.\n\nIts base has a special two-level construction:\n\n\ud83d\udd39 First level: 3 mm Piano Black acrylic, with a deep shine, elegant reflections and a luxurious look.\n\n\ud83d\udd39 Second level: 5 mm clear premium acrylic, creating a visual effect of depth that enhances the presentation of your collection even more.\n\nThe set also includes a custom themed backdrop, inspired by the legendary McLaren MP4/4, which completes the display and gives it a unique visual identity.\n\n\ud83d\udcd0 DIMENSIONS\n\n- Width: 41 cm\n- Depth: 18 cm\n- Height: 20 cm\n\n\ud83d\udce6 SAFE SHIPPING AND EASY ASSEMBLY\n\nAll FUNPARTS display cases ship disassembled, for greater safety in transit and a lower risk of damage to the acrylic parts.\n\nAssembly is extremely simple and intuitive, using precision snap-fit joints designed to align the parts perfectly.\n\n\u2705 No glue.\n\n\u2705 No screws.\n\n\u2705 No tools needed.\n\n\ud83c\udfc6 A DISPLAY WORTHY OF A LEGEND\n\nMore than a display case, this is a project that turns two motorsport icons into a single showpiece, combining design, technology and a premium finish.\n\nFUNPARTS | Your collection deserves this spotlight.\n\n\ud83d\udcf2 Discover our products and turn your collection into a true work of art!\n\nNote: the LEGO McLaren MP4/4 and Ayrton Senna helmet sets are not included. The product offered is the display case only.\n\n#Funparts #AyrtonSenna #McLarenMP44 #LEGOF1 #LEGOCollectors #Formula1 #RedomaDeAcrilico #Colecionismo #Senna","DOS LEYENDAS. UNA SOLA VITRINA\n\nEl legendario McLaren MP4/4 y el ic\u00f3nico casco de Ayrton Senna, juntos en una exposici\u00f3n a la altura de su historia. \ud83c\udde7\ud83c\uddf7\n\nPresentamos la Vitrina de Acr\u00edlico Premium FUNPARTS, dise\u00f1ada especialmente para coleccionistas que desean unir dos de los sets m\u00e1s emblem\u00e1ticos de LEGO en una \u00fanica presentaci\u00f3n, con sofisticaci\u00f3n, protecci\u00f3n y un acabado de alta gama.\n\nLA GRAN DIFERENCIA\n\nA diferencia de las vitrinas convencionales, este proyecto fue dise\u00f1ado para alojar a la vez el McLaren MP4/4 y el casco de Ayrton Senna de LEGO, creando una composici\u00f3n exclusiva que realza cada detalle de los dos modelos.\n\nMATERIALES Y ACABADO PREMIUM\n\nFabricada con laterales y tapa en acr\u00edlico cristal transparente de 3 mm, la vitrina ofrece una visibilidad excelente, protecci\u00f3n contra el polvo y un acabado sofisticado.\n\nSu base tiene una construcci\u00f3n especial en dos niveles:\n\n\ud83d\udd39 Primer nivel: acr\u00edlico Negro Piano de 3 mm, con brillo intenso, reflejos elegantes y aspecto lujoso.\n\n\ud83d\udd39 Segundo nivel: acr\u00edlico premium transparente de 5 mm, que crea un efecto visual de profundidad y realza a\u00fan m\u00e1s la presentaci\u00f3n de la colecci\u00f3n.\n\nEl conjunto incluye adem\u00e1s un fondo tem\u00e1tico personalizado, inspirado en el legendario McLaren MP4/4, que completa la exposici\u00f3n y le da una identidad visual \u00fanica.\n\n\ud83d\udcd0 DIMENSIONES\n\n- Ancho: 41 cm\n- Fondo: 18 cm\n- Alto: 20 cm\n\n\ud83d\udce6 ENV\u00cdO SEGURO Y MONTAJE SENCILLO\n\nTodas las vitrinas FUNPARTS se env\u00edan desmontadas, lo que garantiza mayor seguridad durante el transporte y reduce el riesgo de da\u00f1os en las piezas de acr\u00edlico.\n\nEl montaje es muy sencillo e intuitivo, mediante encajes precisos dise\u00f1ados para lograr una alineaci\u00f3n perfecta entre las piezas.\n\n\u2705 Sin pegamento.\n\n\u2705 Sin tornillos.\n\n\u2705 Sin herramientas.\n\n\ud83c\udfc6 UNA EXPOSICI\u00d3N A LA ALTURA DE UNA LEYENDA\n\nM\u00e1s que una vitrina, es un proyecto que convierte dos iconos del automovilismo en una \u00fanica pieza de exposici\u00f3n, combinando dise\u00f1o, tecnolog\u00eda y acabado premium.\n\nFUNPARTS | Tu colecci\u00f3n merece este protagonismo.\n\n\ud83d\udcf2 \u00a1Descubre nuestros productos y convierte tu colecci\u00f3n en una aut\u00e9ntica obra de arte!\n\nNota: los sets LEGO del McLaren MP4/4 y del casco de Ayrton Senna no est\u00e1n incluidos. El producto ofrecido corresponde exclusivamente a la vitrina expositora.\n\n#Funparts #AyrtonSenna #McLarenMP44 #LEGOF1 #LEGOCollectors #Formula1 #RedomaDeAcrilico #Colecionismo #Senna","DEUX L\u00c9GENDES. UNE SEULE VITRINE\n\nLa l\u00e9gendaire McLaren MP4/4 et le casque embl\u00e9matique d\u2019Ayrton Senna, r\u00e9unis dans une exposition \u00e0 la hauteur de leur histoire ! \ud83c\udde7\ud83c\uddf7\n\nD\u00e9couvrez la Vitrine en Acrylique Premium FUNPARTS, con\u00e7ue sp\u00e9cialement pour les collectionneurs qui souhaitent r\u00e9unir deux des sets LEGO les plus embl\u00e9matiques dans une seule pr\u00e9sentation, avec raffinement, protection et finition haut de gamme.\n\nCE QUI FAIT LA DIFF\u00c9RENCE\n\nContrairement aux vitrines classiques, ce projet a \u00e9t\u00e9 con\u00e7u pour accueillir \u00e0 la fois la McLaren MP4/4 et le casque d\u2019Ayrton Senna de LEGO, cr\u00e9ant une composition exclusive qui met en valeur chaque d\u00e9tail des deux mod\u00e8les.\n\nMAT\u00c9RIAUX ET FINITION PREMIUM\n\nR\u00e9alis\u00e9e avec des parois et un couvercle en acrylique cristal transparent de 3 mm, la vitrine offre une excellente visibilit\u00e9, une protection contre la poussi\u00e8re et une finition raffin\u00e9e.\n\nSon socle b\u00e9n\u00e9ficie d\u2019une construction sp\u00e9ciale \u00e0 deux niveaux :\n\n\ud83d\udd39 Premier niveau : acrylique Noir Piano de 3 mm, \u00e0 la brillance intense, aux reflets \u00e9l\u00e9gants et \u00e0 l\u2019allure luxueuse.\n\n\ud83d\udd39 Second niveau : acrylique premium transparent de 5 mm, cr\u00e9ant un effet visuel de profondeur qui sublime encore la pr\u00e9sentation de la collection.\n\nL\u2019ensemble comprend \u00e9galement un fond th\u00e9matique personnalis\u00e9, inspir\u00e9 de la l\u00e9gendaire McLaren MP4/4, qui compl\u00e8te l\u2019exposition et lui donne une identit\u00e9 visuelle unique.\n\n\ud83d\udcd0 DIMENSIONS\n\n- Largeur : 41 cm\n- Profondeur : 18 cm\n- Hauteur : 20 cm\n\n\ud83d\udce6 EXP\u00c9DITION S\u00dbRE ET MONTAGE SIMPLIFI\u00c9\n\nToutes les vitrines FUNPARTS sont livr\u00e9es d\u00e9mont\u00e9es, pour une s\u00e9curit\u00e9 maximale pendant le transport et un risque r\u00e9duit de dommages aux pi\u00e8ces en acrylique.\n\nLe montage est tr\u00e8s simple et intuitif, par embo\u00eetements pr\u00e9cis con\u00e7us pour assurer un alignement parfait des pi\u00e8ces.\n\n\u2705 Sans colle.\n\n\u2705 Sans vis.\n\n\u2705 Sans outils.\n\n\ud83c\udfc6 UNE EXPOSITION \u00c0 LA HAUTEUR D\u2019UNE L\u00c9GENDE\n\nPlus qu\u2019une vitrine, ce projet transforme deux ic\u00f4nes du sport automobile en une seule pi\u00e8ce d\u2019exposition, alliant design, technologie et finition premium.\n\nFUNPARTS | Votre collection m\u00e9rite cette mise en valeur.\n\n\ud83d\udcf2 D\u00e9couvrez nos produits et transformez votre collection en v\u00e9ritable \u0153uvre d\u2019art !\n\nRemarque : les sets LEGO de la McLaren MP4/4 et du casque d\u2019Ayrton Senna ne sont pas inclus. Le produit propos\u00e9 correspond exclusivement \u00e0 la vitrine d\u2019exposition.\n\n#Funparts #AyrtonSenna #McLarenMP44 #LEGOF1 #LEGOCollectors #Formula1 #RedomaDeAcrilico #Colecionismo #Senna"]},"p1":{"n":["Ferrari 296 GTB with yellow stripes","Ferrari 296 GTB con franjas amarillas","Ferrari 296 GTB \u00e0 bandes jaunes"]},"p2":{"n":["Red Ferrari 458 Speciale","Ferrari 458 Speciale rojo","Ferrari 458 Speciale rouge"]},"p3":{"n":["Ferrari 499P Le Mans","Ferrari 499P Le Mans","Ferrari 499P Le Mans"]},"p4":{"n":["Ferrari 499P Le Mans","Ferrari 499P Le Mans","Ferrari 499P Le Mans"]},"p5":{"n":["Ferrari Burago Collection","Ferrari Colecci\u00f3n Burago","Ferrari Collection Burago"]},"p55":{"n":["Frame for the Senna Collection model cars","Cuadro para miniaturas Colecci\u00f3n Senna","Cadre pour miniatures Collection Senna"]},"p56":{"n":["Frame for the Shell Ferrari 2026 Collection","Cuadro para la colecci\u00f3n Shell Ferrari 2026","Cadre pour la collection Shell Ferrari 2026"],"d":["Premium Frame 25 \u00d7 35 cm \u2014 Ferrari Shell 2026 Collection | 1:43 scale\n\nTurn your model cars into a centerpiece! Designed by Funparts to display the exclusive Ferraris from the Shell service station 2026 promotion, this frame showcases your collection with a premium finish and easy mounting.\n\nMade from PREMIUM acrylic with reverse UV printing, it keeps a 100% gloss surface that brings out the colors and details of the artwork. The Ferrari logo in 3 mm raised relief, also reverse printed, adds depth to the composition.\n\nThe PREMIUM frame is 30 mm deep and 20 mm wide, completing the look of the display.\n\nEasy mounting, with the holes ready\n\nYou don\u2019t need to drill the frame! Funparts delivers it with every hole in the right position, made with a dedicated template for mounting the model cars. Just position your models and fix them with the screws supplied with the product.\n\nFeatures and included items:\n\n- 25 \u00d7 35 cm frame.\n- Compatible with the Ferrari Shell 2026 model cars in 1:43 scale.\n- PREMIUM acrylic with gloss finish and reverse UV printing.\n- Ferrari logo in 3 mm raised relief.\n- PREMIUM frame, 30 mm deep and 20 mm wide.\n- Screws for mounting the model cars in the frame.\n- Wall plug and screw for hanging the frame on the wall.\n\nModel cars not included.","Cuadro Premium 25 \u00d7 35 cm \u2014 Colecci\u00f3n Ferrari Shell 2026 | Escala 1:43\n\n\u00a1Convierte tus miniaturas en una pieza protagonista! Dise\u00f1ado por Funparts para exponer los Ferrari exclusivos de la promoci\u00f3n de las estaciones Shell 2026, este cuadro realza tu colecci\u00f3n con un acabado premium y un montaje pr\u00e1ctico.\n\nFabricado en acr\u00edlico PREMIUM con impresi\u00f3n UV en reverso, mantiene la superficie con un 100 % de brillo, resaltando los colores y los detalles del dise\u00f1o. El logotipo Ferrari en relieve de 3 mm, tambi\u00e9n con impresi\u00f3n en reverso, aporta profundidad a la composici\u00f3n.\n\nEl marco PREMIUM tiene 30 mm de fondo y 20 mm de ancho, completando el aspecto del expositor.\n\nFijaci\u00f3n sencilla, con los orificios ya hechos\n\n\u00a1No necesitas taladrar el cuadro! Funparts lo entrega con todos los orificios en la posici\u00f3n correcta, hechos con una plantilla espec\u00edfica para fijar las miniaturas. Solo tienes que colocar tus modelos y fijarlos con los tornillos que acompa\u00f1an al producto.\n\nCaracter\u00edsticas y elementos incluidos:\n\n- Cuadro de 25 \u00d7 35 cm.\n- Compatible con las miniaturas Ferrari Shell 2026 a escala 1:43.\n- Acr\u00edlico PREMIUM con acabado brillante e impresi\u00f3n UV en reverso.\n- Logotipo Ferrari en relieve de 3 mm.\n- Marco PREMIUM de 30 mm de fondo y 20 mm de ancho.\n- Tornillos para fijar las miniaturas al cuadro.\n- Taco y tornillo para instalar el cuadro en la pared.\n\nMiniaturas no incluidas.","Cadre Premium 25 \u00d7 35 cm \u2014 Collection Ferrari Shell 2026 | \u00c9chelle 1:43\n\nFaites de vos miniatures une pi\u00e8ce ma\u00eetresse ! Con\u00e7u par Funparts pour exposer les Ferrari exclusives de la promotion des stations Shell 2026, ce cadre met votre collection en valeur avec une finition premium et une fixation pratique.\n\nR\u00e9alis\u00e9 en acrylique PREMIUM avec impression UV au verso, il conserve une surface 100 % brillante qui fait ressortir les couleurs et les d\u00e9tails du visuel. Le logo Ferrari en relief de 3 mm, lui aussi imprim\u00e9 au verso, apporte de la profondeur \u00e0 la composition.\n\nLe cadre PREMIUM mesure 30 mm de profondeur et 20 mm de largeur, pour parfaire l\u2019ensemble.\n\nFixation simple, trous d\u00e9j\u00e0 perc\u00e9s\n\nInutile de percer le cadre ! Funparts le livre avec tous les trous aux bons emplacements, r\u00e9alis\u00e9s \u00e0 l\u2019aide d\u2019un gabarit sp\u00e9cifique pour la fixation des miniatures. Il suffit de positionner vos mod\u00e8les et de les fixer avec les vis fournies.\n\nCaract\u00e9ristiques et \u00e9l\u00e9ments inclus :\n\n- Cadre de 25 \u00d7 35 cm.\n- Compatible avec les miniatures Ferrari Shell 2026 \u00e0 l\u2019\u00e9chelle 1:43.\n- Acrylique PREMIUM finition brillante avec impression UV au verso.\n- Logo Ferrari en relief de 3 mm.\n- Cadre PREMIUM de 30 mm de profondeur et 20 mm de largeur.\n- Vis pour fixer les miniatures dans le cadre.\n- Cheville et vis pour accrocher le cadre au mur.\n\nMiniatures non incluses."]},"p57":{"n":["Frame for the Shell Ferrari 2025 Collection","Cuadro para la colecci\u00f3n Shell Ferrari 2025","Cadre pour la collection Shell Ferrari 2025"],"d":{"c":"p56","s":[["2026","2025"]]}},"p58":{"n":["Frame for the Ferrari 12Cilindri - Shell Ferrari 2026 Collection","Cuadro para el Ferrari 12Cilindri - Colecci\u00f3n Shell Ferrari 2026","Cadre pour la Ferrari 12Cilindri - Collection Shell Ferrari 2026"],"d":["Premium Frame 25 \u00d7 35 cm \u2014 Ferrari 12Cilindri - Ferrari Shell 2026 Collection | 1:43 scale\n\nTurn your model car into a centerpiece! Designed by Funparts to display the exclusive Ferrari 12Cilindri from the Shell service station 2026 promotion, this frame showcases your collection with a premium finish and easy mounting.\n\nMade from PREMIUM acrylic with reverse UV printing, it keeps a 100% gloss surface that brings out the colors and details of the artwork. The Ferrari logo in 3 mm raised relief, also reverse printed, adds depth to the composition.\n\nThe PREMIUM frame is 30 mm deep and 20 mm wide, completing the look of the display.\n\nEasy mounting, with the holes ready\n\nYou don\u2019t need to drill the frame! Funparts delivers it with every hole in the right position, made with a dedicated template for mounting the model cars. Just position your model and fix it with the screws supplied with the product.\n\nFeatures and included items:\n\n- 25 \u00d7 35 cm frame.\n- Compatible with the Ferrari 12Cilindri Shell 2026 model car in 1:43 scale.\n- PREMIUM acrylic with gloss finish and reverse UV printing.\n- Ferrari logo in 3 mm raised relief.\n- PREMIUM frame, 30 mm deep and 20 mm wide.\n- Screws for mounting the model car in the frame.\n- Wall plug and screw for hanging the frame on the wall.\n\nThe frame comes pre-drilled so you can mount your model car.\nModel car not included.","Cuadro Premium 25 \u00d7 35 cm \u2014 Ferrari 12Cilindri - Colecci\u00f3n Ferrari Shell 2026 | Escala 1:43\n\n\u00a1Convierte tu miniatura en una pieza protagonista! Dise\u00f1ado por Funparts para exponer el Ferrari 12Cilindri exclusivo de la promoci\u00f3n de las estaciones Shell 2026, este cuadro realza tu colecci\u00f3n con un acabado premium y un montaje pr\u00e1ctico.\n\nFabricado en acr\u00edlico PREMIUM con impresi\u00f3n UV en reverso, mantiene la superficie con un 100 % de brillo, resaltando los colores y los detalles del dise\u00f1o. El logotipo Ferrari en relieve de 3 mm, tambi\u00e9n con impresi\u00f3n en reverso, aporta profundidad a la composici\u00f3n.\n\nEl marco PREMIUM tiene 30 mm de fondo y 20 mm de ancho, completando el aspecto del expositor.\n\nFijaci\u00f3n sencilla, con los orificios ya hechos\n\n\u00a1No necesitas taladrar el cuadro! Funparts lo entrega con todos los orificios en la posici\u00f3n correcta, hechos con una plantilla espec\u00edfica para fijar las miniaturas. Solo tienes que colocar tu modelo y fijarlo con los tornillos que acompa\u00f1an al producto.\n\nCaracter\u00edsticas y elementos incluidos:\n\n- Cuadro de 25 \u00d7 35 cm.\n- Compatible con la miniatura Ferrari 12Cilindri Shell 2026 a escala 1:43.\n- Acr\u00edlico PREMIUM con acabado brillante e impresi\u00f3n UV en reverso.\n- Logotipo Ferrari en relieve de 3 mm.\n- Marco PREMIUM de 30 mm de fondo y 20 mm de ancho.\n- Tornillos para fijar la miniatura al cuadro.\n- Taco y tornillo para instalar el cuadro en la pared.\n\nEl cuadro ya viene perforado para que puedas fijar tu miniatura.\nMiniatura no incluida.","Cadre Premium 25 \u00d7 35 cm \u2014 Ferrari 12Cilindri - Collection Ferrari Shell 2026 | \u00c9chelle 1:43\n\nFaites de votre miniature une pi\u00e8ce ma\u00eetresse ! Con\u00e7u par Funparts pour exposer la Ferrari 12Cilindri exclusive de la promotion des stations Shell 2026, ce cadre met votre collection en valeur avec une finition premium et une fixation pratique.\n\nR\u00e9alis\u00e9 en acrylique PREMIUM avec impression UV au verso, il conserve une surface 100 % brillante qui fait ressortir les couleurs et les d\u00e9tails du visuel. Le logo Ferrari en relief de 3 mm, lui aussi imprim\u00e9 au verso, apporte de la profondeur \u00e0 la composition.\n\nLe cadre PREMIUM mesure 30 mm de profondeur et 20 mm de largeur, pour parfaire l\u2019ensemble.\n\nFixation simple, trous d\u00e9j\u00e0 perc\u00e9s\n\nInutile de percer le cadre ! Funparts le livre avec tous les trous aux bons emplacements, r\u00e9alis\u00e9s \u00e0 l\u2019aide d\u2019un gabarit sp\u00e9cifique pour la fixation des miniatures. Il suffit de positionner votre mod\u00e8le et de le fixer avec les vis fournies.\n\nCaract\u00e9ristiques et \u00e9l\u00e9ments inclus :\n\n- Cadre de 25 \u00d7 35 cm.\n- Compatible avec la miniature Ferrari 12Cilindri Shell 2026 \u00e0 l\u2019\u00e9chelle 1:43.\n- Acrylique PREMIUM finition brillante avec impression UV au verso.\n- Logo Ferrari en relief de 3 mm.\n- Cadre PREMIUM de 30 mm de profondeur et 20 mm de largeur.\n- Vis pour fixer la miniature dans le cadre.\n- Cheville et vis pour accrocher le cadre au mur.\n\nLe cadre est d\u00e9j\u00e0 perc\u00e9 pour fixer votre miniature.\nMiniature non incluse."]}};
  var INFO={"fundo_uv":["The artwork is produced with high-definition UV printing, applied in reverse on the back of the glossy acrylic. This technique protects the print from scratches and direct contact, and creates greater depth, sharpness and color intensity. The crystal-clear acrylic delivers a refined finish, with a premium shine and excellent visual quality.\n***Real example of the result shown in the image alongside.","El dise\u00f1o se produce con impresi\u00f3n UV de alta definici\u00f3n, aplicada en reverso sobre la cara posterior del acr\u00edlico brillante. Esta t\u00e9cnica protege la impresi\u00f3n de ara\u00f1azos y del contacto directo, adem\u00e1s de crear mayor profundidad, nitidez e intensidad en los colores. El acr\u00edlico cristalino ofrece un acabado sofisticado, con brillo premium y una excelente calidad visual.\n***Ejemplo real del resultado en la imagen de al lado.","Le visuel est r\u00e9alis\u00e9 en impression UV haute d\u00e9finition, appliqu\u00e9e au verso de l\u2019acrylique brillant. Cette technique prot\u00e8ge l\u2019impression des rayures et du contact direct, tout en apportant plus de profondeur, de nettet\u00e9 et d\u2019intensit\u00e9 aux couleurs. L\u2019acrylique cristallin offre une finition raffin\u00e9e, avec une brillance premium et une excellente qualit\u00e9 visuelle.\n***Exemple r\u00e9el du r\u00e9sultat sur l\u2019image ci-contre."],"fundo_carbono":["The back of the frame is covered in textured carbon fiber vinyl, for a sophisticated, sporty and truly premium look. Beyond enriching the composition visually, its texture creates depth and makes the model car and the other elements of the design stand out even more. The result is a modern, elegant finish inspired by the world of high-performance motorsport.\n***Real example of the result in the image alongside.","El fondo del cuadro recibe un revestimiento de vinilo texturizado de fibra de carbono, que aporta un aspecto sofisticado, deportivo y muy premium. Adem\u00e1s de enriquecer visualmente la composici\u00f3n, su textura crea profundidad y destaca a\u00fan m\u00e1s la miniatura y los dem\u00e1s elementos del dise\u00f1o. El resultado es un acabado moderno, elegante e inspirado en el universo del automovilismo de alto rendimiento.\n***Ejemplo real del resultado en la imagen de al lado.","Le fond du cadre est habill\u00e9 d\u2019un vinyle textur\u00e9 fibre de carbone, pour une allure raffin\u00e9e, sportive et r\u00e9solument premium. En plus d\u2019enrichir visuellement la composition, sa texture cr\u00e9e de la profondeur et met encore plus en valeur la miniature et les autres \u00e9l\u00e9ments du projet. Le r\u00e9sultat : une finition moderne, \u00e9l\u00e9gante et inspir\u00e9e de l\u2019univers du sport automobile de haute performance.\n***Exemple r\u00e9el du r\u00e9sultat sur l\u2019image ci-contre."],"fundo_fosco":["The artwork is printed in high-definition UV with a matte finish, for intense colors, excellent sharpness and rich detail. The non-glossy surface reduces reflections and gives a more even view in different settings. The result is a refined, modern and premium finish that enhances every element of the composition.\n***Real example of the result shown in the image alongside.","El dise\u00f1o recibe impresi\u00f3n UV de alta definici\u00f3n con acabado mate, lo que garantiza colores intensos, excelente nitidez y riqueza de detalles. La superficie sin brillo reduce los reflejos y ofrece una visualizaci\u00f3n m\u00e1s uniforme en distintos ambientes. El resultado es un acabado sofisticado, moderno y premium, que realza cada elemento de la composici\u00f3n.\n***Ejemplo real del resultado en la imagen de al lado.","Le visuel est imprim\u00e9 en UV haute d\u00e9finition avec une finition mate, pour des couleurs intenses, une excellente nettet\u00e9 et une grande richesse de d\u00e9tails. La surface sans brillance r\u00e9duit les reflets et offre un rendu plus uniforme dans diff\u00e9rents environnements. Le r\u00e9sultat : une finition raffin\u00e9e, moderne et premium, qui met en valeur chaque \u00e9l\u00e9ment de la composition.\n***Exemple r\u00e9el du r\u00e9sultat sur l\u2019image ci-contre."],"moldura_fibra":["Our frame is wrapped in textured vinyl that reproduces the look and feel of carbon fiber. Its finish brings out the details of the piece and adds a sporty, sophisticated style inspired by the world of supercars. An ideal choice for turning your collection into a centerpiece of your decor.","Nuestro marco est\u00e1 revestido con vinilo texturizado que reproduce el aspecto y el tacto de la fibra de carbono. Su acabado realza los detalles del cuadro y aporta una est\u00e9tica deportiva y sofisticada, inspirada en el universo de los superdeportivos. Una elecci\u00f3n ideal para convertir tu colecci\u00f3n en protagonista de la decoraci\u00f3n.","Notre cadre est habill\u00e9 d\u2019un vinyle textur\u00e9 qui reproduit l\u2019aspect et le toucher de la fibre de carbone. Sa finition souligne les d\u00e9tails du cadre et apporte une esth\u00e9tique sportive et raffin\u00e9e, inspir\u00e9e de l\u2019univers des supercars. Un choix id\u00e9al pour faire de votre collection un \u00e9l\u00e9ment phare de votre d\u00e9coration."],"moldura_laca":["Our frame with a matte black lacquer finish offers a smooth, even and sophisticated surface. The matte black reduces reflections and enhances the composition, making your model car stand out with elegance. A timeless choice that suits different settings and makes your collection part of the decor.\n","Nuestro marco con acabado en laca negra mate ofrece una superficie lisa, uniforme y sofisticada. El negro mate reduce los reflejos y realza la composici\u00f3n del cuadro, destacando tu miniatura con elegancia. Una elecci\u00f3n atemporal que combina con distintos ambientes y convierte tu colecci\u00f3n en parte de la decoraci\u00f3n.\n","Notre cadre \u00e0 finition laque noire mate offre une surface lisse, uniforme et raffin\u00e9e. Le noir mat r\u00e9duit les reflets et met en valeur la composition du cadre, en soulignant votre miniature avec \u00e9l\u00e9gance. Un choix intemporel qui s\u2019accorde \u00e0 diff\u00e9rents int\u00e9rieurs et int\u00e8gre votre collection \u00e0 la d\u00e9coration."]};
  var LI={pt:0,en:1,es:2,fr:3};
  function lang(){ var l='pt'; try{ l=(window.FP&&FP.lang)||localStorage.getItem('fp_lang')||'pt'; }catch(e){} return LI[l]==null?'pt':l; }
  function norm(s){ return String(s==null?'':s).replace(/\s+/g,' ').trim(); }
  var IDX={};
  function poe(idx,v,e){ v=norm(v); if(v&&!idx[v]) idx[v]=e; }
  F.forEach(function(a){
    var e={pt:a[0],en:a[1],es:a[2],fr:a[3]};
    for(var i=0;i<a.length;i++) if(a[i]) poe(IDX,a[i],e);
  });
  /* moldes: uma expressao por idioma; {0} {1} traduz o miolo, {n} {m} nao */
  function esc(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
  var MOL=MO.map(function(a){
    var m={f:a,re:[],ord:[]};
    for(var i=0;i<4;i++){
      var nomes=[], src=esc(a[i]).replace(/\\\{(\w)\\\}/g,function(_,k){ nomes.push(k); return '(.+?)'; });
      m.re.push(new RegExp('^'+src+'$')); m.ord.push(nomes);
    }
    return m;
  });
  /* produtos e textos de ajuda: montados a partir do catalogo que o site carregou */
  var PIDX={}, PSIG='', PV=0;
  function resolve(k,campo){
    var p=PROD[k]; if(!p) return null; var v=p[campo]; if(!v) return null;
    if(v.c){ var b=resolve(v.c,campo); if(!b) return null; return b.map(function(t){ v.s.forEach(function(x){ t=t.split(x[0]).join(x[1]); }); return t; }); }
    return v;
  }
  function tam(v){ if(!v) return 0; try{ var j=JSON.stringify(v), h=0; for(var i=0;i<j.length;i++) h=(h*31+j.charCodeAt(i))|0; return j.length+'.'+h; }catch(e){ return 0; } }
  function prodMonta(){
    var cats=[], sig='';
    try{ if(typeof REDOMA_CATALOG!=='undefined') cats.push(['r',REDOMA_CATALOG]); }catch(e){}
    try{ if(typeof INCLUSO_CATALOG!=='undefined') cats.push(['p',INCLUSO_CATALOG]); }catch(e){}
    try{ if(typeof PRONTO_CATALOG!=='undefined') cats.push(['p',PRONTO_CATALOG]); }catch(e){}
    var itens=[];
    cats.forEach(function(c){ try{ Object.keys(c[1]||{}).forEach(function(b){ (((c[1][b]||{}).itens)||[]).forEach(function(it){ if(it&&it.id!=null){ itens.push([c[0]+it.id,it]); sig+=c[0]+it.id+':'+String(it.n||'').length+':'+String(it.desc||'').length+':'+tam(it.nx)+tam(it.dx)+tam(it.tx)+';'; } }); }); }catch(e){} });
    var inf=null; try{ if(typeof INFOS!=='undefined') inf=INFOS; }catch(e){}
    if(inf) sig+='i'+Object.keys(inf).length;
    var CI=null; try{ CI=(window.__fpCatI18n&&typeof window.__fpCatI18n==='object')?window.__fpCatI18n:null; }catch(e){}
    if(CI) sig+='c'+tam(CI);
    if(sig===PSIG) return; PSIG=sig; PV++; PIDX={};
    /* 11/11/2026: o que foi digitado no painel (nx = nome, dx/tx = descricao, por idioma)
       vale ANTES da tabela embutida; idioma sem nada no painel cai na tabela e, sem ela, no portugues */
    function obj(v){ return (v&&typeof v==='object')?v:null; }
    function entra(pt,a,b,c){
      var e={pt:pt}, tem=false;
      ['en','es','fr'].forEach(function(l,i){ var v=(a&&a[l])||(b&&b[l])||(c&&c[i])||null; if(v){ e[l]=v; tem=true; } });
      if(!tem) return;
      /* idioma que ficou sem nada: usa a frase do dicionario do site e, sem ela, o portugues
         (assim, ao trocar de idioma, nao sobra na tela o texto do idioma anterior) */
      var o=IDX[norm(pt)]||antigos(norm(pt));
      ['en','es','fr'].forEach(function(l){ if(!e[l]) e[l]=(o&&o[l])||pt; });
      poe(PIDX,pt,e);
      ['en','es','fr'].forEach(function(l){ poe(PIDX,e[l],e); if(o&&o[l]) poe(PIDX,o[l],e); });
    }
    itens.forEach(function(x){
      var k=x[0], it=x[1], n=resolve(k,'n'), d=resolve(k,'d');
      if(it.n) entra(it.n,obj(it.nx),null,n);
      var tx=obj(it.tx), base=it.desc||'';
      if(!base&&tx&&tx.pt) base=tx.pt;
      if(base) entra(base,obj(it.dx),tx,d);
    });
    if(CI) Object.keys(CI).forEach(function(nm){ if(nm) entra(nm,obj(CI[nm]),null,null); });
    if(inf) Object.keys(INFO).forEach(function(k){
      var t=inf[k]&&inf[k].texto, d=INFO[k]; if(!t) return;
      var e={pt:t,en:d[0],es:d[1],fr:d[2]}; poe(PIDX,t,e); d.forEach(function(x){ poe(PIDX,x,e); });
    });
  }
  /* nome do produto no idioma (usado pela busca) */
  function entNome(it){ if(!it||!it.n) return null; prodMonta(); var e=PIDX[norm(it.n)]||null; if(!e){ var a=antigos(norm(it.n)); if(a) e=a; } return e; }
  window._fpNomeTrad=function(it){ try{ var l=lang(), e=entNome(it); return (e&&l!=='pt'&&e[l])?e[l]:(it?it.n:''); }catch(x){ return it?it.n:''; } };
  window._fpNomesTodos=function(it){ try{ var e=entNome(it); return e?[e.en,e.es,e.fr].join(' '):''; }catch(x){ return ''; } };
  /* dicionarios que ja existiam: FRASES (qualquer idioma) e FULL (por portugues + volta) */
  var REV=null, SUJO=new RegExp('['+String.fromCharCode(194,195)+']');
  function antigos(s){
    var T=window.__fpTODAS, f=T&&T[s];
    if(f&&f.pt!=null) return f;
    var U=window.__fpFULL; if(!U) return null;
    if(!REV){ REV={}; var amb={};
      Object.keys(U).forEach(function(pt){ var o=U[pt], e={pt:pt,en:o.en,es:o.es,fr:o.fr};
        var suja=SUJO.test(pt);
        [pt,o.en,o.es,o.fr].forEach(function(v,i){ v=norm(v); if(!v) return; var x=REV[v];
          if(x&&x.pt!==pt){
            /* a mesma frase cadastrada duas vezes (uma com acento quebrado): fica a limpa */
            if(x.en===e.en&&x.es===e.es&&x.fr===e.fr){ if(!suja&&SUJO.test(x.pt)) REV[v]=e; return; }
            if(i>0) amb[v]=1; return; }
          if(!x) REV[v]=e; }); });
      /* variante que serve a duas frases diferentes: so vale a leitura em portugues */
      Object.keys(amb).forEach(function(v){ if(!U[v]) delete REV[v]; });
    }
    return REV[s]||null;
  }
  function acha(s){ return PIDX[s]||IDX[s]||antigos(s); }
  var PRE=/^([^0-9A-Za-z\u00c0-\u024f"\u201c\u00ab(\[#*.]+)(.+)$/;
  var SEP=/( \u2014 | \u00b7 | \/ | \| )/;
  function tr(s,l,prof){
    var e=acha(s), m, r, i, k;
    if(e){ r=e[l]; return (r==null||r==='')?null:r; }
    if(prof>3||s.length>400) return null;
    if((m=/^(.*\S)(\s*[\u2192\u203a])$/.exec(s))){ r=tr(m[1],l,prof+1); return r==null?null:r+m[2]; }
    if((m=/^(\u2190\s*)(.+)$/.exec(s))){ r=tr(m[2],l,prof+1); return r==null?null:m[1]+r; }
    if((m=PRE.exec(s))){ r=tr(m[2],l,prof+1); return r==null?null:m[1]+r; }
    r=molde(s,l,prof,0,NFECH); if(r!=null) return r;
    if(SEP.test(s)){
      var ps=s.split(SEP), mud=false;
      for(i=0;i<ps.length;i+=2){ var p=norm(ps[i]); if(!p) continue; r=tr(p,l,prof+1); if(r!=null&&r!==p){ ps[i]=r; mud=true; } }
      return mud?ps.join(''):null;
    }
    return molde(s,l,prof,NFECH,MOL.length);
  }
  /* os NFECH primeiros moldes tem inicio e fim marcados; os outros ("Moldura X") so valem
     quando o miolo e' uma frase conhecida -- senao "Cadre seul" viraria "Moldura seul" */
  function molde(s,l,prof,de,ate){
    for(var i=de;i<ate;i++){
      for(var k=0;k<4;k++){
        var m=MOL[i].re[k].exec(s); if(!m) continue;
        var args={}, nomes=MOL[i].ord[k], ok=true;
        for(var j=0;j<nomes.length;j++){
          var v=m[j+1], nm=nomes[j];
          if(nm>='0'&&nm<='9'){ var t=tr(norm(v),l,prof+1); if(t==null&&i>=NFECH) ok=false; args[nm]=(t==null?v:t); }
          else { if(!/^[\d.,:\/xX\u00d7\s]+$/.test(v)) ok=false; args[nm]=v; }
        }
        if(!ok) continue;
        return MOL[i].f[LI[l]].replace(/\{(\w)\}/g,function(_,q){ return args[q]; });
      }
    }
    return null;
  }
  function desiste(o,l){
    if(o.__fp3l!==l){ o.__fp3l=l; o.__fp3c=0; }
    o.__fp3c=(o.__fp3c||0)+1;
    return o.__fp3c>8;                 /* outro bloco insiste em desfazer: nao entra em briga */
  }
  var ATR=['placeholder','title','aria-label','alt'];
  /* rodape: na regiao Europa quem vende e' a empresa belga (11/11/2026) */
  var RP_BR=['Funparts LTDA','CNPJ 09.579.820/0001-54','Barueri, SP'], RP_EU=['FUNPARTS EUROPE SRL','TVA BE 1040.041.918','Braine-l\'Alleud, Belgique'];
  function rodape(){
    var sp=document.querySelectorAll('footer.site-foot .row:first-child span'); if(sp.length!==3) return;
    var eu=false; try{ eu=((window.FP&&FP.region)||localStorage.getItem('fp_region'))==='EU'; }catch(e){}
    var alvo=eu?RP_EU:RP_BR;
    for(var i=0;i<3;i++){ if(sp[i].textContent!==alvo[i]) sp[i].textContent=alvo[i]; }
  }
  /* selo de entrega do resumo: "Todo o Brasil" so vale no Brasil (12/11/2026) */
  var TG_BR=['\u2708 Todo o Brasil','\u2708 Across Brazil','\u2708 Todo Brasil','\u2708 Partout au Br\u00e9sil'];
  var TG_EU=['\u2708 Toda a Uni\u00e3o Europeia','\u2708 Across the EU','\u2708 Toda la Uni\u00f3n Europea','\u2708 Partout dans l\u2019UE'];
  function seloEntrega(){
    var els=document.querySelectorAll('.tag'); if(!els.length) return;
    var eu=false; try{ eu=((window.FP&&FP.region)||localStorage.getItem('fp_region'))==='EU'; }catch(e){}
    var alvo=(eu?TG_EU:TG_BR)[LI[lang()]||0];
    for(var i=0;i<els.length;i++){
      var t=norm(els[i].textContent); if(t===alvo) continue;
      if(TG_BR.indexOf(t)>=0||TG_EU.indexOf(t)>=0) els[i].textContent=alvo;
    }
  }
  var JA=false;
  function passa(){
    if(!document.body) return;
    try{ rodape(); }catch(e){}
    try{ seloEntrega(); }catch(e){}
    var l=lang();
    /* visita toda em portugues: nada a fazer (so trabalha depois de existir outro idioma na tela) */
    if(l!=='pt') JA=true; else if(!JA) return;
    try{ prodMonta(); }catch(e){}
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false), n, fila=[];
    while((n=w.nextNode())){
      var cur=n.nodeValue; if(!cur||cur.length<2) continue;
      if(n.__fp3v===cur&&n.__fp3k===l+PV) continue;
      n.__fp3v=cur; n.__fp3k=l+PV;
      var p=n.parentNode; if(!p) continue; var tg=p.nodeName;
      if(tg==='SCRIPT'||tg==='STYLE'||tg==='TEXTAREA'||tg==='NOSCRIPT') continue;
      if(p.closest&&p.closest('#fpLang')) continue;
      var s=norm(cur); if(!s||!/[A-Za-z\u00c0-\u024f]{2}/.test(s)) continue;
      var r=null; try{ r=tr(s,l,0); }catch(e){ r=null; }
      /* 11/11/2026: o bloco antigo de "pedacos" as vezes chega antes e troca so um trecho da
         descricao (ex.: "Impressao UV"); ai a frase nao bate mais. Ele guarda o texto original
         em __fpP: se o original e' um produto conhecido, traduz a partir dele */
      if(r==null&&typeof n.__fpP==='string'&&n.__fpP!==cur){ var s0=norm(n.__fpP), e0=PIDX[s0]; if(e0&&e0[l]&&norm(e0[l])!==s) r=e0[l]; }
      if(r==null||r===s||norm(r)===s) continue;
      fila.push([n,cur,r]);
    }
    fila.forEach(function(x){
      var n=x[0], cur=x[1]; if(n.nodeValue!==cur||desiste(n,l)) return;
      var v=cur.match(/^\s*/)[0]+x[2]+cur.match(/\s*$/)[0];
      n.nodeValue=v; n.__fp3v=v;
      try{ n.__fpP=undefined; }catch(e){}   /* o bloco de pedacos reaprende o texto daqui */
    });
    var els=document.querySelectorAll('[placeholder],[title],[aria-label],img[alt]');
    for(var i=0;i<els.length;i++){
      var el=els[i]; if(el.closest&&el.closest('#fpLang')&&!el.hasAttribute('aria-label')) continue;
      for(var a=0;a<ATR.length;a++){
        var val=el.getAttribute(ATR[a]); if(!val||val.length<3) continue;
        var ck='__fp3q'+a, cv=l+PV+'|'+val; if(el[ck]===cv) continue; el[ck]=cv;
        var s2=norm(val), r2=null; try{ r2=tr(s2,l,0); }catch(e){}
        if(r2==null||r2===s2) continue;
        if(!el.__fp3a) el.__fp3a={}; var c=el.__fp3a; if(c.l!==l){ c.l=l; c.n=0; } if(++c.n>12) continue;
        el.setAttribute(ATR[a],r2);
        if(ATR[a]==='placeholder'){ try{ el.__ptph=undefined; }catch(e){} }
      }
    }
    try{ var dt=document.title, sf=' \u00b7 Funparts'; if(dt&&dt.slice(-sf.length)===sf){ var b=norm(dt.slice(0,-sf.length)), rt=tr(b,l,0); if(rt!=null&&rt!==b) document.title=rt+sf; } }catch(e){}
  }
  window._fpI18nFinal=passa;
  /* agenda: roda ~90 ms depois da PRIMEIRA mudanca (nao adia a cada nova) e repete ao sossegar */
  var t1=null, t2=null, ult=0;
  function agenda(){
    /* no maximo ~3 passagens por segundo: a barra de preco do site se reescreve sem parar */
    if(!t1) t1=setTimeout(function(){ t1=null; ult=Date.now(); try{ passa(); }catch(e){} },Math.max(90,320-(Date.now()-ult)));
    clearTimeout(t2); t2=setTimeout(function(){ ult=Date.now(); try{ passa(); }catch(e){} },450);
  }
  /* troca de idioma: avisa a cadeia antiga na hora (ela so percebia 150 ms depois e aplicava o idioma anterior) */
  function avisa(){ try{ if(typeof window.FP_traduzTudo==='function') window.FP_traduzTudo(lang()); }catch(e){} }
  function liga(){
    try{ passa(); }catch(e){}
    try{
      if(window.FP&&typeof FP.setLang==='function'){ var o=FP.setLang; FP.setLang=function(){ var r=o.apply(this,arguments); avisa(); agenda(); setTimeout(agenda,500); return r; }; }
      if(window.FP&&typeof FP.setRegion==='function'){ var o2=FP.setRegion; FP.setRegion=function(){ var r=o2.apply(this,arguments); avisa(); agenda(); setTimeout(agenda,500); return r; }; }
    }catch(e){}
    try{ new MutationObserver(agenda).observe(document.body,{childList:true,subtree:true,characterData:true}); }catch(e){}
    [600,1500,3000,6000].forEach(function(ms){ setTimeout(agenda,ms); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){ setTimeout(liga,200); });
  else setTimeout(liga,200);
})();
