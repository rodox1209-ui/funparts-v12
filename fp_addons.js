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
    body.innerHTML=CART.map(function(i){
      var img=i.thumb ? '<img src="'+i.thumb+'" alt="">' : '<div class="ph">'+(i.tipo==='lego'?'ÃÂ°ÃÂÃÂ§ÃÂ±':'ÃÂ°ÃÂÃÂÃÂÃÂ¯ÃÂ¸ÃÂ')+'</div>';
      var editavel=(i.cfg && i.via!=='catalogo' && (i.tipo==='lego' || (i.tipo==='mini' && i.cfg.miniScale!==undefined)));
      var edBtn=editavel ? '<button class="cart-ed" onclick="editarProduto(\''+i.id+'\')">'+_T('cart.edit','editar produto')+'</button>' : '';
      return '<div class="cart-item">'
        +'<div class="cart-thumb">'+img+'</div>'
        +'<div class="cart-info">'
          +'<div class="cart-nm">'+_esc(i.titulo)+'</div>'
          +'<div class="cart-dt">'+_esc(i.sub)+'<br>'+i.linhas.map(_esc).join(' ÃÂ· ')+'</div>'
          +'<div class="cart-foot-row">'
            +'<div class="cart-price">'+_brlCart(i.preco)+'</div>'
            +'<div class="cart-acts">'+edBtn+'<button class="cart-rm" onclick="removerDoCarrinho(\''+i.id+'\')">'+_T('cart.remove','remover')+'</button></div>'
          +'</div>'
        +'</div>'
      +'</div>';
    }).join('');
    if(foot)foot.style.display='';
    var t=document.getElementById('cartTotal');
    if(t)t.textContent=_brlCart(_cartTotal());
  };

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
    if(typeof selMiniChoice==='function')selMiniChoice(cfg.miniChoice||'apenas');
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
    novo.thumb=CART[idx].thumb||'';
    var _lista=(novo.preview&&novo.preview.imgs)||[]; if(novo.preview)delete novo.preview.imgs;
    novo.id=window._editandoId;
    CART[idx]=novo;
    _cartSave(); _cartRender();
    if(typeof _cartThumb==='function')_cartThumb(src,function(thumb){ if(!thumb)return; var a=CART.filter(function(x){return x.id===novo.id;})[0]; if(a){a.thumb=thumb;_cartSave();_cartRender();} });
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
  var FULL={};
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
  T("\u00f0\u009f\u0092\u00a1 Ilumina\u00e7\u00e3o LED interna","\ud83d\udca1 Internal LED lighting","\u00f0\u009f\u0092\u00a1 Iluminaci\u00f3n LED interna","\u00f0\u009f\u0092\u00a1 \u00c9clairage LED int\u00e9rieur");
  T("\u00c3\u0083\u00c2\u00b0\u00c3\u0082\u00c2\u009f\u00c3\u0082\u00c2\u0092\u00c3\u0082\u00c2\u00a1 Ilumina\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00a3o LED interna","\ud83d\udca1 Internal LED lighting","\u00f0\u009f\u0092\u00a1 Iluminaci\u00f3n LED interna","\u00f0\u009f\u0092\u00a1 \u00c9clairage LED int\u00e9rieur");
  T("Selecione o tipo abaixo","Select the type below","Selecciona el tipo abajo","Choisissez le type ci-dessous");
  T("Retroilumina\u00e7\u00e3o no interior do quadro \u2014 efeito espetacular no ambiente","Backlighting inside the frame \u2014 a stunning effect in the room","Retroiluminaci\u00f3n en el interior del cuadro \u2014 efecto espectacular en el ambiente","R\u00e9tro\u00e9clairage \u00e0 l'int\u00e9rieur du cadre \u2014 effet spectaculaire dans la pi\u00e8ce");
  T("Retroilumina\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00a3o no interior do quadro \u00c3\u00a2\u00c2\u0080\u00c2\u0094 efeito espetacular no ambiente","Backlighting inside the frame \u2014 a stunning effect in the room","Retroiluminaci\u00f3n en el interior del cuadro \u2014 efecto espectacular en el ambiente","R\u00e9tro\u00e9clairage \u00e0 l'int\u00e9rieur du cadre \u2014 effet spectaculaire dans la pi\u00e8ce");
  T("Sem LED","No LED","Sin LED","Sans LED");
  T("Tipo de LED","LED Type","Tipo de LED","Type de LED");
  T("\ud83d\udd0c Com Fio","\ud83d\udd0c Wired","\ud83d\udd0c Con cable","\ud83d\udd0c Filaire");
  T("\u00c3\u0083\u00c2\u00b0\u00c3\u0082\u00c2\u009f\u00c3\u0082\u00c2\u0094\u00c3\u0082\u00c2\u008c Com Fio","\ud83d\udd0c Wired","\ud83d\udd0c Con cable","\ud83d\udd0c Filaire");
  T("\ud83d\udd0b Sem Fio","\ud83d\udd0b Wireless","\u00f0\u009f\u0094\u008b Inal\u00e1mbrico","\ud83d\udd0b Sans fil");
  T("\u00c3\u0083\u00c2\u00b0\u00c3\u0082\u00c2\u009f\u00c3\u0082\u00c2\u0094\u00c3\u0082\u00c2\u008b Sem Fio","\ud83d\udd0b Wireless","\u00f0\u009f\u0094\u008b Inal\u00e1mbrico","\ud83d\udd0b Sans fil");
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
  T("\u00f0\u009f\u008f\u008e\u00ef\u00b8\u008f Logo do Modelo \u2014 Canto inferior direito","\u00f0\u009f\u008f\u008e\u00ef\u00b8\u008f Model Logo \u2014 Bottom right corner","\u00f0\u009f\u008f\u008e\u00ef\u00b8\u008f Logo del modelo \u2014 Esquina inferior derecha","\u00f0\u009f\u008f\u008e\u00ef\u00b8\u008f Logo du mod\u00e8le \u2014 Coin inf\u00e9rieur droit");
  T("\u00c3\u0083\u00c2\u00b0\u00c3\u0082\u00c2\u009f\u00c3\u0082\u00c2\u008f\u00c3\u0082\u00c2\u008e\u00c3\u0083\u00c2\u00af\u00c3\u0082\u00c2\u00b8\u00c3\u0082\u00c2\u008f Logo do Modelo \u00c3\u00a2\u00c2\u0080\u00c2\u0094 Canto inferior direito","\u00f0\u009f\u008f\u008e\u00ef\u00b8\u008f Model Logo \u2014 Bottom right corner","\u00f0\u009f\u008f\u008e\u00ef\u00b8\u008f Logo del modelo \u2014 Esquina inferior derecha","\u00f0\u009f\u008f\u008e\u00ef\u00b8\u008f Logo du mod\u00e8le \u2014 Coin inf\u00e9rieur droit");
  T("Gerado com IA conforme modelo selecionado","AI-generated based on the selected model","Generado con IA seg\u00fan el modelo seleccionado","G\u00e9n\u00e9r\u00e9 par IA selon le mod\u00e8le choisi");
  T("Gerando o logo do modelo com IA\u2026","Generating the model logo with AI\u2026","Generando el logo del modelo con IA\u2026","G\u00e9n\u00e9ration du logo du mod\u00e8le par IA\u2026");
  T("Gerando o logo do modelo com IA\u00c3\u00a2\u00c2\u0080\u00c2\u00a6","Generating the model logo with AI\u2026","Generando el logo del modelo con IA\u2026","G\u00e9n\u00e9ration du logo du mod\u00e8le par IA\u2026");
  T("Relevos opcionais","Optional reliefs","Relieves opcionales","Reliefs optionnels");
  T("\u00f0\u009f\u008f\u00b4 Bandeira do Pa\u00eds","\ud83c\udff4 Country Flag","\u00f0\u009f\u008f\u00b4 Bandera del pa\u00eds","\ud83c\udff4 Drapeau du pays");
  T("\u00c3\u0083\u00c2\u00b0\u00c3\u0082\u00c2\u009f\u00c3\u0082\u00c2\u008f\u00c3\u0082\u00c2\u00b4 Bandeira do Pa\u00c3\u0083\u00c2\u00ads","\ud83c\udff4 Country Flag","\u00f0\u009f\u008f\u00b4 Bandera del pa\u00eds","\ud83c\udff4 Drapeau du pays");
  T("Canto superior direito \u2014 bandeira do piloto ou escuderia em relevo","Top right corner \u2014 driver or team flag in relief","Esquina superior derecha \u2014 bandera del piloto o escuder\u00eda en relieve","Coin sup\u00e9rieur droit \u2014 drapeau du pilote ou de l'\u00e9curie en relief");
  T("Canto superior direito \u00c3\u00a2\u00c2\u0080\u00c2\u0094 bandeira do piloto ou escuderia em relevo","Top right corner \u2014 driver or team flag in relief","Esquina superior derecha \u2014 bandera del piloto o escuder\u00eda en relieve","Coin sup\u00e9rieur droit \u2014 drapeau du pilote ou de l'\u00e9curie en relief");
  T("\ud83d\udc64 Nome do Piloto","\ud83d\udc64 Driver Name","\ud83d\udc64 Nombre del piloto","\ud83d\udc64 Nom du pilote");
  T("\u00c3\u0083\u00c2\u00b0\u00c3\u0082\u00c2\u009f\u00c3\u0082\u00c2\u0091\u00c3\u0082\u00c2\u00a4 Nome do Piloto","\ud83d\udc64 Driver Name","\ud83d\udc64 Nombre del piloto","\ud83d\udc64 Nom du pilote");
  T("Canto inferior esquerdo \u2014 at\u00e9 20 caracteres gravados em relevo","Bottom left corner \u2014 up to 20 characters engraved in relief","Esquina inferior izquierda \u2014 hasta 20 caracteres grabados en relieve","Coin inf\u00e9rieur gauche \u2014 jusqu'\u00e0 20 caract\u00e8res grav\u00e9s en relief");
  T("Canto inferior esquerdo \u00c3\u00a2\u00c2\u0080\u00c2\u0094 at\u00c3\u0083\u00c2\u00a9 20 caracteres gravados em relevo","Bottom left corner \u2014 up to 20 characters engraved in relief","Esquina inferior izquierda \u2014 hasta 20 caracteres grabados en relieve","Coin inf\u00e9rieur gauche \u2014 jusqu'\u00e0 20 caract\u00e8res grav\u00e9s en relief");
  T("\u00f0\u009f\u0093\u008b Placa com informa\u00e7\u00f5es do Carro","\ud83d\udccb Plate with Car information","\u00f0\u009f\u0093\u008b Placa con informaci\u00f3n del coche","\ud83d\udccb Plaque avec informations de la voiture");
  T("\u00c3\u0083\u00c2\u00b0\u00c3\u0082\u00c2\u009f\u00c3\u0082\u00c2\u0093\u00c3\u0082\u00c2\u008b Placa com informa\u00c3\u0083\u00c2\u00a7\u00c3\u0083\u00c2\u00b5es do Carro","\ud83d\udccb Plate with Car information","\u00f0\u009f\u0093\u008b Placa con informaci\u00f3n del coche","\ud83d\udccb Plaque avec informations de la voiture");
  T("Placa t\u00e9cnica em alto relevo com dados do ve\u00edculo","Technical plate in relief with the vehicle's data","Placa t\u00e9cnica en altorrelieve con los datos del veh\u00edculo","Plaque technique en relief avec les donn\u00e9es du v\u00e9hicule");
  T("Placa t\u00c3\u0083\u00c2\u00a9cnica em alto relevo com dados do ve\u00c3\u0083\u00c2\u00adculo","Technical plate in relief with the vehicle's data","Placa t\u00e9cnica en altorrelieve con los datos del veh\u00edculo","Plaque technique en relief avec les donn\u00e9es du v\u00e9hicule");
  T("\u00f0\u009f\u0097\u00ba\u00ef\u00b8\u008f Tra\u00e7ado do circuito","\ud83d\uddfa\ufe0f Circuit Layout","\ud83d\uddfa\ufe0f Trazado del circuito","\u00f0\u009f\u0097\u00ba\u00ef\u00b8\u008f Trac\u00e9 du circuit");
  T("\u00c3\u0083\u00c2\u00b0\u00c3\u0082\u00c2\u009f\u00c3\u0082\u00c2\u0097\u00c3\u0082\u00c2\u00ba\u00c3\u0083\u00c2\u00af\u00c3\u0082\u00c2\u00b8\u00c3\u0082\u00c2\u008f Tra\u00c3\u0083\u00c2\u00a7ado do circuito","\ud83d\uddfa\ufe0f Circuit Layout","\ud83d\uddfa\ufe0f Trazado del circuito","\u00f0\u009f\u0097\u00ba\u00ef\u00b8\u008f Trac\u00e9 du circuit");
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
function fix(){var r=(window.FP&&window.FP.region)||'BR';[['ledFioSem',199]].forEach(function(p){var d=document.querySelector('#'+p[0]+' .tdesc');if(!d)return;var t=(d.textContent||'');var n=parseFloat(t.replace(/[^\d,.]/g,'').replace(',','.'))||p[1];if(n>0)d.textContent=_f(n,r);});}
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
        if(window._origCAT_PRECOS!==undefined) window.CAT_PRECOS=window._origCAT_PRECOS;
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
      var o={dim:_freteDim(i),qty:1};
      if(rid)o.redoma_id=rid;
      return o;
    }).filter(function(x){ return x.dim||x.redoma_id; });
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
    var _img=_mobG
      ? 'width:100%;max-height:46vh;object-fit:contain;border-radius:10px;display:block;'
      : 'max-width:100%;max-height:100%;object-fit:contain;border-radius:10px;display:block;';
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
      if(_lang9!=='pt'){
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
  if(lang!=='pt'){
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
    if(lang!=='pt'){_walkApply9(_EN9);_substrApply9(_SUBSTR9);}
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
      if(_lang10!=='pt')_substrApply10(_SUBSTR10);
    },80);
  });
  _ob10.observe(document.body,{childList:true,subtree:true});
}

window.FP_traduzTudo=function(lang){
  _lang10=lang;
  _p10.call(this,lang);
  if(lang!=='pt')_substrApply10(_SUBSTR10);
  _startOb10();
};

(function(){
  function _p10Init(){
    var lang=localStorage.getItem('fp_lang')||'pt';
    if(lang!=='pt')_substrApply10(_SUBSTR10);
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
  if(capturedLang!=='pt')_substrApply11(_RETRY11);
}

window.FP_traduzTudo=function(lang){
  _lang11=lang;
  _p11.call(this,lang);
  for(var k=0;k<_tmrs11.length;k++)clearTimeout(_tmrs11[k]);
  _tmrs11=[];
  if(lang!=='pt'){
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
    if(lang!=='pt')_substrApply11(_RETRY11);
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
    if(_lang12!=='pt'&&name&&_SELMAP12[name])name=_SELMAP12[name];
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
    if(lang!=='pt'){
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
    if(_lang12==='pt')return;
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
  if(_lang12!=='pt'){
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
    if(_lang13!=='pt'&&name&&_SELMAP13[name]){
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
    if(lang!=='pt'){
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
    if(_lang13==='pt')return;
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
  if(_lang13!=='pt'){
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
    if(lang!=='pt'){
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
    if(_lang14==='pt')return;
    clearTimeout(_tmr14);
    _tmr14=setTimeout(function(){_substrApply14(_SUBSTR14);},40);
  });
  _ob14.observe(document.body,{childList:true,subtree:true});
}

/* Ã¢ÂÂÃ¢ÂÂ INITIAL LOAD Ã¢ÂÂÃ¢ÂÂ */
(function(){
  if(_lang14!=='pt'){
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
    {pt:"\u2190 Editar configura\u00e7\u00e3o",en:"\u2190 Edit configuration",es:"\u2190 Editar configuraci\u00f3n",fr:"\u2190 Modifier la configuration"}
  ];
  var PEDACOS=[
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
  var TODAS={};
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
    if(out.mini){
      Object.keys(out.mini).forEach(function(m){
        var itens=((out.mini[m]||{}).itens)||[];
        var vivos=itens.filter(function(p){ return p&&p.p_eur!=null; });
        vivos.forEach(function(p){ p.p=p.p_eur; });
        if(vivos.length)out.mini[m].itens=vivos;
        else delete out.mini[m];
      });
    }
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
        FP.setRegion=function(){ var r=o.apply(this,arguments); setTimeout(reaplica,40); return r; };
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
    if(!alvo){ try{ if(typeof textoZap==='function')window.open('https://wa.me/5511910646157?text='+encodeURIComponent(textoZap()),'_blank'); }catch(e){} return; }

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
        txt='Ol\u00e1! Tentei fechar meu pedido na Funparts e o pagamento n\u00e3o abriu.';
        if(pedido&&pedido.codigo)txt+='\nPedido: '+pedido.codigo;
        if(cliente&&cliente.nome)txt+='\nCliente: '+cliente.nome;
      }
      try{ window.open('https://wa.me/5511910646157?text='+encodeURIComponent(txt),'_blank'); }catch(e){}
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
