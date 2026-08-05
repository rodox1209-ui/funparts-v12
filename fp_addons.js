/* Funparts â mÃ³dulos add-on (carregados apÃ³s app_1.js/app_2.js) */
/* Reset da personalizaÃ§Ã£o (fallback inline, garante disponibilidade mesmo com cache do app_1.js).
   Recarrega a pÃ¡gina: zera o estado S (em memÃ³ria) e volta Ã  etapa TIPO;
   o carrinho fica salvo no localStorage e Ã© preservado. */
if(typeof window.iniciarNovaPersonalizacao!=='function'){
  window.iniciarNovaPersonalizacao=function(){
    try{ location.reload(); }catch(e){ location.href=location.pathname+location.search; }
  };
}

/* "Continuar comprando" (botÃ£o que aparece depois de adicionar o item ao carrinho) deve
   REINICIAR a personalizaÃ§Ã£o por completo â exatamente como "Iniciar nova personalizaÃ§Ã£o" â,
   e nÃ£o apenas voltar Ã  etapa 1 mantendo as configuraÃ§Ãµes do item anterior gravadas no estado S.
   O carrinho Ã© preservado (fica salvo no localStorage e Ã© relido ao recarregar). */
(function(){
  window.continuarComprando=function(){
    if(typeof window.iniciarNovaPersonalizacao==='function'){ window.iniciarNovaPersonalizacao(); return; }
    try{ location.reload(); }catch(e){ location.href=location.pathname+location.search; }
  };
})();

/* ââ EDITAR PRODUTO NO CARRINHO (recarrega a personalizacao salva e atualiza o item) ââ
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
      body.innerHTML='<div class="cart-empty">'+_T('cart.empty','Seu carrinho estÃ¡ vazio.')+'<br>'+_T('cart.emptyHint','Monte um quadro e adicione aqui.')+'</div>';
      if(foot)foot.style.display='none';
      return;
    }
    body.innerHTML=CART.map(function(i){
      var img=i.thumb ? '<img src="'+i.thumb+'" alt="">' : '<div class="ph">'+(i.tipo==='lego'?'ð§±':'ðï¸')+'</div>';
      var editavel=(i.cfg && i.via!=='catalogo' && (i.tipo==='lego' || (i.tipo==='mini' && i.cfg.miniScale!==undefined)));
      var edBtn=editavel ? '<button class="cart-ed" onclick="editarProduto(\''+i.id+'\')">'+_T('cart.edit','editar produto')+'</button>' : '';
      return '<div class="cart-item">'
        +'<div class="cart-thumb">'+img+'</div>'
        +'<div class="cart-info">'
          +'<div class="cart-nm">'+_esc(i.titulo)+'</div>'
          +'<div class="cart-dt">'+_esc(i.sub)+'<br>'+i.linhas.map(_esc).join(' Â· ')+'</div>'
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
      if(add){ add.classList.add('finalizar'); add.textContent='Atualizar pedido â'; add.onclick=window.atualizarPedido; }
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
    alert('Este item foi adicionado antes desta atualizaÃ§Ã£o e nÃ£o guardou os dados necessÃ¡rios para ediÃ§Ã£o. Remova e monte novamente para poder editÃ¡-lo.');
  };

  // Enriquece o cfg dos itens Miniatura (escala, dimensÃ£o, carro, cores) p/ permitir edicao
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

  // Mobile: marca o quadro LEGO 49x49 p/ o CSS deixÃ¡-lo quadrado e contido (igual desktop)
  var _origUpd = window.updateDetPreview;
  if(typeof _origUpd==='function'){
    window.updateDetPreview = function(){
      var r = _origUpd.apply(this, arguments);
      try{
        var q=document.getElementById('legoDetQuadro');
        if(q){
          var is4949 = (typeof S!=='undefined' && S.tipo==='lego') && /^49\s*[Ãx]\s*49/.test((S.legoDim)||'');
          q.classList.toggle('dim4949', !!is4949);
        }
      }catch(e){}
      return r;
    };
  }

  // Mobile: manter a barra inferior (avanÃ§ar/voltar) sincronizada com a etapa REAL.
  // Bug: "continuar comprando" e cliques no menu do topo trocam de etapa via goStep,
  // mas a barra mobile sÃ³ era atualizada pelos botÃµes avanÃ§ar/voltar -> sumia o "avanÃ§ar".
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
    BR:{lang:'pt',currency:'BRL',symbol:'R$',frete:'superfrete',gateway:'pagarme',flag:'ð§ð·',reg:{pt:'Brasil',en:'Brazil'},prices:{lego_base_carbono:689,lego_base_fosco:589,mini_base_P:1990,mini_base_M:2490,mini_base_G:2990,opt_moldura_fibra:75,opt_led_rgb_sem:489,opt_led_rgb_com:589,opt_led_warm_sem:389,opt_led_warm_com:489,opt_relevo_bandeira:90,opt_relevo_piloto:90}},
    EU:{lang:'en',currency:'EUR',symbol:'â¬',frete:'sendcloud',gateway:'stripe',flag:'ðªðº',reg:{pt:'Europa',en:'Europe'},prices:{lego_base_carbono:119,lego_base_fosco:102,mini_base_P:343,mini_base_M:429,mini_base_G:515,opt_moldura_fibra:13,opt_led_rgb_sem:84,opt_led_rgb_com:102,opt_led_warm_sem:67,opt_led_warm_com:84,opt_relevo_bandeira:16,opt_relevo_piloto:16}},
    US:{lang:'en',currency:'USD',symbol:'$',frete:'sendcloud',gateway:'stripe',flag:'ðºð¸',reg:{pt:'EUA',en:'USA'},prices:{lego_base_carbono:130,lego_base_fosco:111,mini_base_P:375,mini_base_M:470,mini_base_G:564,opt_moldura_fibra:14,opt_led_rgb_sem:92,opt_led_rgb_com:111,opt_led_warm_sem:73,opt_led_warm_com:92,opt_relevo_bandeira:17,opt_relevo_piloto:17}}
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
      'nav.newCustom':'Iniciar nova personalizaÃ§Ã£o','nav.cart':'Carrinho',
      'step.tipo':'Tipo','step.modelo':'Modelo','step.produto':'Produto','step.detalhe':'Detalhamento','step.fundo':'Fundo','step.moldura':'Moldura + LED','step.relevo':'Alto-relevo','step.pedido':'Pedido',
      'cart.title':'Seu carrinho','cart.total':'Total','cart.note':'Sem frete Â· Combinamos o envio pelo WhatsApp','cart.checkout':'Fechar pedido â','cart.more':'Continuar comprando',
      'cart.remove':'remover','cart.edit':'editar produto','cart.empty':'Seu carrinho estÃ¡ vazio.','cart.emptyHint':'Monte um quadro e adicione aqui.',
      'frete.title':'Frete / Entrega','frete.cep':'Digite seu CEP','frete.calc':'Calcular','frete.calculating':'Calculandoâ¦','frete.eco':'EconÃ´mico','frete.exp':'Expresso','frete.days':'dias Ãºteis','frete.invalid':'Informe um CEP vÃ¡lido','frete.totalShip':'Total com frete','frete.mock':'','frete.none':'Nenhuma opÃ§Ã£o de frete para este endereÃ§o.','frete.fail':'NÃ£o foi possÃ­vel calcular o frete agora. Tente novamente.','frete.emptyCart':'Adicione um item ao carrinho para calcular o frete.'
    },
    en:{
      'nav.newCustom':'Start new customization','nav.cart':'Cart',
      'step.tipo':'Type','step.modelo':'Model','step.produto':'Product','step.detalhe':'Details','step.fundo':'Background','step.moldura':'Frame + LED','step.relevo':'Relief','step.pedido':'Order',
      'cart.title':'Your cart','cart.total':'Total','cart.note':'Shipping calculated at checkout','cart.checkout':'Checkout â','cart.more':'Continue shopping',
      'cart.remove':'remove','cart.edit':'edit product','cart.empty':'Your cart is empty.','cart.emptyHint':'Build a frame and add it here.',
      'frete.title':'Shipping / Delivery','frete.cep':'Enter your postal code','frete.calc':'Calculate','frete.calculating':'Calculatingâ¦','frete.eco':'Standard','frete.exp':'Express','frete.days':'business days','frete.invalid':'Enter a valid postal code','frete.totalShip':'Total with shipping','frete.mock':'','frete.none':'No shipping options for this address.','frete.fail':'Could not calculate shipping right now. Please try again.','frete.emptyCart':'Add an item to the cart to calculate shipping.'
    },
    es:{
      'nav.newCustom':'Iniciar nueva personalizaciÃ³n','nav.cart':'Carrito',
      'step.tipo':'Tipo','step.modelo':'Modelo','step.produto':'Producto','step.detalhe':'Detalles','step.fundo':'Fondo','step.moldura':'Marco + LED','step.relevo':'Relieve','step.pedido':'Pedido',
      'cart.title':'Tu carrito','cart.total':'Total','cart.note':'EnvÃ­o calculado al finalizar la compra','cart.checkout':'Finalizar pedido â','cart.more':'Seguir comprando',
      'cart.remove':'quitar','cart.edit':'editar producto','cart.empty':'Tu carrito estÃ¡ vacÃ­o.','cart.emptyHint':'Crea un cuadro y agrÃ©galo aquÃ­.',
      'frete.title':'EnvÃ­o / Entrega','frete.cep':'Ingresa tu cÃ³digo postal','frete.calc':'Calcular','frete.calculating':'Calculandoâ¦','frete.eco':'EstÃ¡ndar','frete.exp':'ExprÃ©s','frete.days':'dÃ­as hÃ¡biles','frete.invalid':'Ingresa un cÃ³digo postal vÃ¡lido','frete.totalShip':'Total con envÃ­o','frete.mock':'','frete.none':'No hay opciones de envÃ­o para esta direcciÃ³n.','frete.fail':'No se pudo calcular el envÃ­o ahora. IntÃ©ntalo de nuevo.','frete.emptyCart':'Agrega un artÃ­culo al carrito para calcular el envÃ­o.'
    },
    fr:{
      'nav.newCustom':'Nouvelle personnalisation','nav.cart':'Panier',
      'step.tipo':'Type','step.modelo':'ModÃ¨le','step.produto':'Produit','step.detalhe':'DÃ©tails','step.fundo':'Fond','step.moldura':'Cadre + LED','step.relevo':'Relief','step.pedido':'Commande',
      'cart.title':'Votre panier','cart.total':'Total','cart.note':'Livraison calculÃ©e au paiement','cart.checkout':'Finaliser la commande â','cart.more':'Continuer les achats',
      'cart.remove':'retirer','cart.edit':'modifier le produit','cart.empty':'Votre panier est vide.','cart.emptyHint':'CrÃ©ez un cadre et ajoutez-le ici.',
      'frete.title':'Livraison','frete.cep':'Saisissez votre code postal','frete.calc':'Calculer','frete.calculating':'Calculâ¦','frete.eco':'Standard','frete.exp':'Express','frete.days':'jours ouvrÃ©s','frete.invalid':'Saisissez un code postal valide','frete.totalShip':'Total avec livraison','frete.mock':'','frete.none':'Aucune option de livraison pour cette adresse.','frete.fail':'Impossible de calculer la livraison pour le moment. RÃ©essayez.','frete.emptyCart':'Ajoutez un article au panier pour calculer la livraison.'
    }
  };

  var FP={lang:'pt',region:'BR',cfg:CFG,geoCountry:null};
  FP.t=function(k){var d=DICT[FP.lang]||DICT.pt;return (d[k]!=null)?d[k]:((DICT.pt[k]!=null)?DICT.pt[k]:k);};
  function save(){try{localStorage.setItem('fp_lang',FP.lang);localStorage.setItem('fp_region',FP.region);}catch(e){}}

  // ââââââââââ TRADUÃÃO COMPLETA DO SITE (PT/EN/ES/FR) ââââââââââ
  var FULL={};
  function T(pt,en,es,fr){FULL[pt]={en:en,es:es,fr:fr};}
  // CabeÃ§alho / navegaÃ§Ã£o / carrinho / checkout
  T("Total:","Total:","Total:","Total :");
  T("Iniciar nova personalizaÃ§Ã£o","Start new customization","Iniciar nueva personalizaciÃ³n","Nouvelle personnalisation");
  T("Seu carrinho","Your cart","Tu carrito","Votre panier");
  T("Sem frete Â· Combinamos o envio pelo WhatsApp","Shipping arranged via WhatsApp","EnvÃ­o coordinado por WhatsApp","Livraison convenue via WhatsApp");
  T("Fechar pedido â","Checkout â","Finalizar pedido â","Finaliser la commande â");
  T("Continuar comprando","Continue shopping","Seguir comprando","Continuer les achats");
  T("Precisamos desses dados para emitir a nota e combinar a entrega.","We need this information to issue the invoice and arrange delivery.","Necesitamos estos datos para emitir la factura y coordinar la entrega.","Nous avons besoin de ces informations pour Ã©mettre la facture et organiser la livraison.");
  T("Nome completo","Full name","Nombre completo","Nom complet");
  T("WhatsApp","WhatsApp","WhatsApp","WhatsApp");
  T("E-mail","Email","Correo electrÃ³nico","E-mail");
  T("EndereÃ§o","Address","DirecciÃ³n","Adresse");
  T("NÃºmero","Number","NÃºmero","NumÃ©ro");
  T("Complemento","Address line 2","Complemento","ComplÃ©ment");
  T("(opcional)","(optional)","(opcional)","(facultatif)");
  T("Bairro","District","Barrio","Quartier");
  T("Cidade","City","Ciudad","Ville");
  T("Seus dados sÃ£o usados apenas para emitir a nota fiscal e realizar a entrega.","Your data is used only to issue the invoice and complete delivery.","Tus datos se usan solo para emitir la factura y realizar la entrega.","Vos donnÃ©es servent uniquement Ã  Ã©mettre la facture et Ã  effectuer la livraison.");
  T("Fechar pedido via WhatsApp","Checkout via WhatsApp","Finalizar pedido por WhatsApp","Finaliser via WhatsApp");
  T("â Voltar aos itens","â Back to items","â Volver a los artÃ­culos","â Retour aux articles");
  T("Item adicionado ao carrinho","Item added to cart","ArtÃ­culo aÃ±adido al carrito","Article ajoutÃ© au panier");
  T("Ver carrinho","View cart","Ver carrito","Voir le panier");
  // Home / etapa Tipo
  T("CHEGOU A HORA","IT'S TIME","LLEGÃ EL MOMENTO","C'EST LE MOMENT");
  T("DE PERSONALIZAR","TO CUSTOMIZE","DE PERSONALIZAR","DE PERSONNALISER");
  T("SEU QUADRO","YOUR FRAME","TU CUADRO","VOTRE CADRE");
  T("SIGA AS ORIENTAÃÃES","FOLLOW THE STEPS","SIGUE LAS INSTRUCCIONES","SUIVEZ LES INDICATIONS");
  T("DO MENU ABAIXO","IN THE MENU BELOW","DEL MENÃ DE ABAJO","DU MENU CI-DESSOUS");
  T("Preview em tempo real","Real-time preview","Vista previa en tiempo real","AperÃ§u en temps rÃ©el");
  T("Gerando top-viewâ¦","Generating top viewâ¦","Generando vista superiorâ¦","GÃ©nÃ©ration de la vue de dessusâ¦");
  T("â² Girar carro 180Â°","â² Rotate car 180Â°","â² Girar coche 180Â°","â² Pivoter la voiture 180Â°");
  T("PREVIEW EM TEMPO REAL","REAL-TIME PREVIEW","VISTA PREVIA EN TIEMPO REAL","APERÃU EN TEMPS RÃEL");
  T("VEJA O EXEMPLO DA PROPORÃÃO (DIMENSÃO) DO QUADRO","SEE AN EXAMPLE OF THE FRAME PROPORTION (SIZE)","MIRA UN EJEMPLO DE LA PROPORCIÃN (TAMAÃO) DEL CUADRO","VOYEZ UN EXEMPLE DE LA PROPORTION (TAILLE) DU CADRE");
  T("A partir do exemplo acima, vocÃª conseguirÃ¡ ter a noÃ§Ã£o geral da dimensÃ£o do quadro comparado a dimensÃ£o de uma pessoa com 1,75m de altura","From the example above, you can get a general sense of the frame size compared to a person 1.75 m tall","Con el ejemplo de arriba podrÃ¡s hacerte una idea del tamaÃ±o del cuadro comparado con una persona de 1,75 m de altura","Ã partir de l'exemple ci-dessus, vous aurez une idÃ©e gÃ©nÃ©rale de la taille du cadre par rapport Ã  une personne d'1,75 m");
  T("FanÃ¡tico, vocÃª estÃ¡ prestes a criar","Fan, you're about to create","FanÃ¡tico, estÃ¡s a punto de crear","PassionnÃ©, vous Ãªtes sur le point de crÃ©er");
  T("um quadro exclusivo!","an exclusive frame!","Â¡un cuadro exclusivo!","un cadre exclusif !");
  T("Aguarde, estamos gerando a imagem da sua miniatura em alta resoluÃ§Ã£o.","Please wait, we're generating your model image in high resolution.","Espera, estamos generando la imagen de tu miniatura en alta resoluciÃ³n.","Veuillez patienter, nous gÃ©nÃ©rons l'image de votre miniature en haute rÃ©solution.");
  T("Preparandoâ¦","Preparingâ¦","Preparandoâ¦","PrÃ©parationâ¦");
  T("Qual Ã© o seu colecionÃ¡vel? Tudo comeÃ§a aqui.","What's your collectible? It all starts here.","Â¿CuÃ¡l es tu coleccionable? Todo empieza aquÃ­.","Quel est votre objet de collection ? Tout commence ici.");
  T("QUADROS PARA LEGO","FRAMES FOR LEGO","CUADROS PARA LEGO","CADRES POUR LEGO");
  T("Quadros para sets LEGO Technic, Creator, Icons e F1","Frames for LEGO Technic, Creator, Icons and F1 sets","Cuadros para sets LEGO Technic, Creator, Icons y F1","Cadres pour sets LEGO Technic, Creator, Icons et F1");
  T("Quadros para Miniaturas","Frames for Models","Cuadros para Miniaturas","Cadres pour Miniatures");
  T("Die-cast em escalas 1:12, 1:18, 1:24 e 1:43","Die-cast in 1:12, 1:18, 1:24 and 1:43 scales","Die-cast en escalas 1:12, 1:18, 1:24 y 1:43","Die-cast aux Ã©chelles 1:12, 1:18, 1:24 et 1:43");
  T("PrÃ³ximo: Escolher Modelo â","Next: Choose Model â","Siguiente: Elegir modelo â","Suivant : Choisir le modÃ¨le â");
  // etapa Modelo
  T("Modelo LEGO","LEGO Model","Modelo LEGO","ModÃ¨le LEGO");
  T("Selecione a marca e depois o modelo especÃ­fico","Select the brand and then the specific model","Selecciona la marca y luego el modelo especÃ­fico","SÃ©lectionnez la marque puis le modÃ¨le prÃ©cis");
  T("Com ou Sem Miniatura?","With or Without Model?","Â¿Con o sin miniatura?","Avec ou sans miniature ?");
  T("SOMENTE QUADRO","FRAME ONLY","SOLO CUADRO","CADRE SEUL");
  T("Nessa opÃ§Ã£o vocÃª terÃ¡ a oportunidade de personalizar um quadro para a sua miniatura especial","In this option you can customize a frame for your special model","En esta opciÃ³n podrÃ¡s personalizar un cuadro para tu miniatura especial","Dans cette option, vous pourrez personnaliser un cadre pour votre miniature");
  T("QUADRO INCLUSO MINIATURA","FRAME WITH MODEL INCLUDED","CUADRO CON MINIATURA INCLUIDA","CADRE AVEC MINIATURE INCLUSE");
  T("Nessa opÃ§Ã£o vocÃª encontrarÃ¡ quadros que jÃ¡ sÃ£o vendidos completos. Contendo o quadro e a miniatura","In this option you'll find frames sold complete, including the frame and the model","En esta opciÃ³n encontrarÃ¡s cuadros que se venden completos: el cuadro y la miniatura","Dans cette option, vous trouverez des cadres vendus complets, avec le cadre et la miniature");
  T("â Voltar","â Back","â Volver","â Retour");
  T("Modelos disponÃ­veis","Available models","Modelos disponibles","ModÃ¨les disponibles");
  T("Foto em breve","Photo coming soon","Foto prÃ³ximamente","Photo bientÃ´t");
  T("â CONCLUIR ESCOLHA","â CONFIRM CHOICE","â CONFIRMAR ELECCIÃN","â VALIDER LE CHOIX");
  T("Escolha a marca","Choose the brand","Elige la marca","Choisissez la marque");
  T("Marca / Categoria","Brand / Category","Marca / CategorÃ­a","Marque / CatÃ©gorie");
  T("Outros","Others","Otros","Autres");
  T("â¦ VisualizaÃ§Ã£o gerada por InteligÃªncia Artificial","â¦ Preview generated by Artificial Intelligence","â¦ Vista previa generada por Inteligencia Artificial","â¦ AperÃ§u gÃ©nÃ©rÃ© par Intelligence Artificielle");
  T("Marca do carro","Car brand","Marca del coche","Marque de la voiture");
  T("Modelo do carro","Car model","Modelo del coche","ModÃ¨le de la voiture");
  T("Ano","Year","AÃ±o","AnnÃ©e");
  T("Cor","Color","Color","Couleur");
  T("Selecionada:","Selected:","Seleccionada:","SÃ©lectionnÃ©e :");
  T("â¦ GERAR VISUALIZAÃÃO COM IA","â¦ GENERATE AI PREVIEW","â¦ GENERAR VISTA PREVIA CON IA","â¦ GÃNÃRER L'APERÃU PAR IA");
  T("Gerando sua visualizaÃ§Ã£o...","Generating your preview...","Generando tu vista previa...","GÃ©nÃ©ration de votre aperÃ§u...");
  T("A IA estÃ¡ criando uma imagem exclusiva do seu carro","AI is creating an exclusive image of your car","La IA estÃ¡ creando una imagen exclusiva de tu coche","L'IA crÃ©e une image exclusive de votre voiture");
  T("â¦ Sua miniatura â visualizaÃ§Ã£o gerada","â¦ Your model â generated preview","â¦ Tu miniatura â vista previa generada","â¦ Votre miniature â aperÃ§u gÃ©nÃ©rÃ©");
  T("â» GERAR NOVA VARIAÃÃO","â» GENERATE NEW VARIATION","â» GENERAR NUEVA VARIACIÃN","â» GÃNÃRER UNE NOUVELLE VARIANTE");
  T("Geramos a imagem da sua miniatura com inteligÃªncia Artificial, para que confirme o modelo e consiga personalizar seu quadro o mais prÃ³ximo da realidade possÃ­vel.","We generated your model image with Artificial Intelligence so you can confirm the model and customize your frame as close to reality as possible.","Generamos la imagen de tu miniatura con Inteligencia Artificial para que confirmes el modelo y personalices tu cuadro lo mÃ¡s fiel posible.","Nous avons gÃ©nÃ©rÃ© l'image de votre miniature par Intelligence Artificielle afin que vous confirmiez le modÃ¨le et personnalisiez votre cadre au plus prÃ¨s de la rÃ©alitÃ©.");
  T("PERSONALIZAR QUADRO â","CUSTOMIZE FRAME â","PERSONALIZAR CUADRO â","PERSONNALISER LE CADRE â");
  T("Marca do veÃ­culo","Vehicle brand","Marca del vehÃ­culo","Marque du vÃ©hicule");
  T("Outra","Other","Otra","Autre");
  T("Modelo exato","Exact model","Modelo exacto","ModÃ¨le exact");
  T("Tamanho do quadro (sincronizado com a escala)","Frame size (synced with scale)","TamaÃ±o del cuadro (sincronizado con la escala)","Taille du cadre (synchronisÃ©e avec l'Ã©chelle)");
  T("PrÃ³ximo: Miniatura â","Next: Model â","Siguiente: Miniatura â","Suivant : Miniature â");
  // etapa Produto / miniatura
  T("Confirme que jÃ¡ possui a miniatura para montagem no quadro.","Confirm you already own the model to mount in the frame.","Confirma que ya tienes la miniatura para montarla en el cuadro.","Confirmez que vous possÃ©dez dÃ©jÃ  la miniature Ã  monter dans le cadre.");
  T("FOTOS EM BREVE","PHOTOS COMING SOON","FOTOS PRÃXIMAMENTE","PHOTOS BIENTÃT");
  T("DescriÃ§Ã£o do produto","Product description","DescripciÃ³n del producto","Description du produit");
  T("DescriÃ§Ã£o em breve...","Description coming soon...","DescripciÃ³n prÃ³ximamente...","Description bientÃ´t...");
  T("Ver resumo â","View summary â","Ver resumen â","Voir le rÃ©sumÃ© â");
  T("EU JÃ TENHO A MINIATURA","I ALREADY HAVE THE MODEL","YA TENGO LA MINIATURA","J'AI DÃJÃ LA MINIATURE");
  T("Confirmo que jÃ¡ tenho a miniatura e gostaria de comprar apenas o quadro.","I confirm I already have the model and would like to buy only the frame.","Confirmo que ya tengo la miniatura y deseo comprar solo el cuadro.","Je confirme avoir dÃ©jÃ  la miniature et souhaite acheter uniquement le cadre.");
  T("PrÃ³ximo: Detalhamento â","Next: Details â","Siguiente: Detalles â","Suivant : DÃ©tails â");
  T("Miniatura compacta","Compact model","Miniatura compacta","Miniature compacte");
  T("Tamanho mÃ©dio","Medium size","TamaÃ±o mediano","Taille moyenne");
  T("Tamanho grande","Large size","TamaÃ±o grande","Grande taille");
  T("Extra grande","Extra large","Extra grande","TrÃ¨s grande");
  T("PrÃ³ximo: Fundo â","Next: Background â","Siguiente: Fondo â","Suivant : Fond â");
  // etapa Fundo
  T("Fundo do Quadro","Frame Background","Fondo del cuadro","Fond du cadre");
  T("Material que reveste o interior do quadro, ao redor da miniatura","Material lining the inside of the frame, around the model","Material que reviste el interior del cuadro, alrededor de la miniatura","MatÃ©riau qui habille l'intÃ©rieur du cadre, autour de la miniature");
  T("Fibra de Carbono","Carbon Fiber","Fibra de carbono","Fibre de carbone");
  T("Revestimento em vinil texturizado. Visual esportivo profundo.","Textured vinyl finish. Deep sporty look.","Revestimiento de vinilo texturizado. Aspecto deportivo profundo.","RevÃªtement en vinyle texturÃ©. Allure sportive profonde.");
  T("AcrÃ­lico Brilho â UV","Glossy Acrylic â UV","AcrÃ­lico brillo â UV","Acrylique brillant â UV");
  T("ImpressÃ£o UV em acrÃ­lico de alto brilho. Cores profundas, acabamento espelhado.","UV printing on high-gloss acrylic. Deep colors, mirror finish.","ImpresiÃ³n UV en acrÃ­lico de alto brillo. Colores profundos, acabado espejado.","Impression UV sur acrylique trÃ¨s brillant. Couleurs profondes, finition miroir.");
  T("Fosco","Matte","Mate","Mat");
  T("Acabamento fosco com layouts exclusivos. Visual elegante e sofisticado.","Matte finish with exclusive layouts. Elegant, sophisticated look.","Acabado mate con diseÃ±os exclusivos. Aspecto elegante y sofisticado.","Finition mate avec des motifs exclusifs. Allure Ã©lÃ©gante et raffinÃ©e.");
  T("Modelo do Layout","Layout Style","DiseÃ±o del layout","Style de motif");
  T("PrÃ³ximo: Moldura + LED â","Next: Frame + LED â","Siguiente: Marco + LED â","Suivant : Cadre + LED â");
  // etapa Moldura + LED
  T("Acabamento da estrutura externa do quadro","Finish of the frame's outer structure","Acabado de la estructura externa del cuadro","Finition de la structure externe du cadre");
  T("Moldura revestida com vinil texturizado de fibra de carbono. Acabamento esportivo premium.","Frame wrapped in textured carbon-fiber vinyl. Premium sporty finish.","Marco revestido con vinilo texturizado de fibra de carbono. Acabado deportivo premium.","Cadre habillÃ© de vinyle texturÃ© fibre de carbone. Finition sportive premium.");
  T("Laca Preto","Black Lacquer","Laca negra","Laque noire");
  T("Revestimento em laca preta. Acabamento liso, sofisticado e atemporal.","Black lacquer finish. Smooth, sophisticated and timeless.","Revestimiento en laca negra. Acabado liso, sofisticado y atemporal.","RevÃªtement en laque noire. Finition lisse, raffinÃ©e et intemporelle.");
  T("Incluso","Included","Incluido","Inclus");
  T("IluminaÃ§Ã£o LED","LED Lighting","IluminaciÃ³n LED","Ãclairage LED");
  T("ð¡ IluminaÃ§Ã£o LED interna","ð¡ Internal LED lighting","ð¡ IluminaciÃ³n LED interna","ð¡ Ãclairage LED intÃ©rieur");
  T("Selecione o tipo abaixo","Select the type below","Selecciona el tipo abajo","Choisissez le type ci-dessous");
  T("RetroiluminaÃ§Ã£o no interior do quadro â efeito espetacular no ambiente","Backlighting inside the frame â a stunning effect in the room","RetroiluminaciÃ³n en el interior del cuadro â efecto espectacular en el ambiente","RÃ©troÃ©clairage Ã  l'intÃ©rieur du cadre â effet spectaculaire dans la piÃ¨ce");
  T("Sem LED","No LED","Sin LED","Sans LED");
  T("Tipo de LED","LED Type","Tipo de LED","Type de LED");
  T("ð Com Fio","ð Wired","ð Con cable","ð Filaire");
  T("ð Sem Fio","ð Wireless","ð InalÃ¡mbrico","ð Sans fil");
  T("Neutro","Neutral","Neutro","Neutre");
  T("Luz 3000K","3000K light","Luz 3000K","LumiÃ¨re 3000K");
  T("RGB","RGB","RGB","RGB");
  T("Multicolor","Multicolor","Multicolor","Multicolore");
  T("PrÃ³ximo: Alto-relevo â","Next: Relief â","Siguiente: Relieve â","Suivant : Relief â");
  // etapa Alto-relevo
  T("Elementos em alto relevo aplicados no quadro","Raised relief elements applied to the frame","Elementos en altorrelieve aplicados al cuadro","ÃlÃ©ments en relief appliquÃ©s au cadre");
  T("Relevos fixos","Fixed reliefs","Relieves fijos","Reliefs fixes");
  T("(sempre incluÃ­dos)","(always included)","(siempre incluidos)","(toujours inclus)");
  T("ð·ï¸ Logotipo Marca","ð·ï¸ Brand Logo","ð·ï¸ Logotipo de la marca","ð·ï¸ Logo de la marque");
  T("Gerado com IA conforme marca selecionada","AI-generated based on the selected brand","Generado con IA segÃºn la marca seleccionada","GÃ©nÃ©rÃ© par IA selon la marque choisie");
  T("Gerando o logo da marca com IAâ¦","Generating the brand logo with AIâ¦","Generando el logo de la marca con IAâ¦","GÃ©nÃ©ration du logo de la marque par IAâ¦");
  T("Branco","White","Blanco","Blanc");
  T("Preto","Black","Negro","Noir");
  T("Vermelho","Red","Rojo","Rouge");
  T("Escolher cor","Choose color","Elegir color","Choisir la couleur");
  T("ðï¸ Logo do Modelo â Canto inferior direito","ðï¸ Model Logo â Bottom right corner","ðï¸ Logo del modelo â Esquina inferior derecha","ðï¸ Logo du modÃ¨le â Coin infÃ©rieur droit");
  T("Gerado com IA conforme modelo selecionado","AI-generated based on the selected model","Generado con IA segÃºn el modelo seleccionado","GÃ©nÃ©rÃ© par IA selon le modÃ¨le choisi");
  T("Gerando o logo do modelo com IAâ¦","Generating the model logo with AIâ¦","Generando el logo del modelo con IAâ¦","GÃ©nÃ©ration du logo du modÃ¨le par IAâ¦");
  T("Relevos opcionais","Optional reliefs","Relieves opcionales","Reliefs optionnels");
  T("ð´ Bandeira do PaÃ­s","ð´ Country Flag","ð´ Bandera del paÃ­s","ð´ Drapeau du pays");
  T("Canto superior direito â bandeira do piloto ou escuderia em relevo","Top right corner â driver or team flag in relief","Esquina superior derecha â bandera del piloto o escuderÃ­a en relieve","Coin supÃ©rieur droit â drapeau du pilote ou de l'Ã©curie en relief");
  T("ð¤ Nome do Piloto","ð¤ Driver Name","ð¤ Nombre del piloto","ð¤ Nom du pilote");
  T("Canto inferior esquerdo â atÃ© 20 caracteres gravados em relevo","Bottom left corner â up to 20 characters engraved in relief","Esquina inferior izquierda â hasta 20 caracteres grabados en relieve","Coin infÃ©rieur gauche â jusqu'Ã  20 caractÃ¨res gravÃ©s en relief");
  T("ð Placa com informaÃ§Ãµes do Carro","ð Plate with Car information","ð Placa con informaciÃ³n del coche","ð Plaque avec informations de la voiture");
  T("Placa tÃ©cnica em alto relevo com dados do veÃ­culo","Technical plate in relief with the vehicle's data","Placa tÃ©cnica en altorrelieve con los datos del vehÃ­culo","Plaque technique en relief avec les donnÃ©es du vÃ©hicule");
  T("ðºï¸ TraÃ§ado do circuito","ðºï¸ Circuit Layout","ðºï¸ Trazado del circuito","ðºï¸ TracÃ© du circuit");
  T("Mapa em alto relevo do circuito oficial do modelo","Relief map of the model's official circuit","Mapa en altorrelieve del circuito oficial del modelo","Carte en relief du circuit officiel du modÃ¨le");
  T("COR DO NOME:","NAME COLOR:","COLOR DEL NOMBRE:","COULEUR DU NOM :");
  T("Ver Resumo â","View Summary â","Ver resumen â","Voir le rÃ©sumÃ© â");
  // etapa Pedido / resumo
  T("Seu Quadro","Your Frame","Tu cuadro","Votre cadre");
  T("Revise a configuraÃ§Ã£o e finalize o pedido","Review your setup and complete the order","Revisa la configuraciÃ³n y finaliza el pedido","VÃ©rifiez la configuration et finalisez la commande");
  T("Foto","Photo","Foto","Photo");
  T("Quadro completo com miniatura","Complete frame with model","Cuadro completo con miniatura","Cadre complet avec miniature");
  T("Adicionar ao carrinho â","Add to cart â","AÃ±adir al carrito â","Ajouter au panier â");
  T("Tirar dÃºvidas no WhatsApp","Questions on WhatsApp","Consultas por WhatsApp","Questions sur WhatsApp");
  T("â Voltar ao produto","â Back to product","â Volver al producto","â Retour au produit");
  T("Categoria","Category","CategorÃ­a","CatÃ©gorie");
  T("DimensÃ£o","Dimensions","DimensiÃ³n","Dimensions");
  T("Moldura","Frame","Marco","Cadre");
  T("LED","LED","LED","LED");
  T("Alto-relevo extra","Extra relief","Relieve extra","Relief supplÃ©mentaire");
  T("Nenhum","None","Ninguno","Aucun");
  T("SKU","SKU","SKU","SKU");
  T("Total estimado","Estimated total","Total estimado","Total estimÃ©");
  T("ð¦ Embalagem Premium","ð¦ Premium Packaging","ð¦ Embalaje premium","ð¦ Emballage premium");
  T("â Editar configuraÃ§Ã£o","â Edit configuration","â Editar configuraciÃ³n","â Modifier la configuration");
  T("Sem frete â¢ PreÃ§o pode variar","Shipping not included â¢ Price may vary","EnvÃ­o no incluido â¢ El precio puede variar","Livraison non incluse â¢ Le prix peut varier");
  T("novo","new","nuevo","nouveau");
  T("atual","current","actual","actuel");
  T("Cancelar","Cancel","Cancelar","Annuler");
  T("OK","OK","OK","OK");
  // placeholders
  T("Como no documento","As on your ID","Como en el documento","Comme sur le document");
  T("voce@email.com","you@email.com","tu@email.com","vous@email.com");
  T("Rua, avenidaâ¦","Street, avenueâ¦","Calle, avenidaâ¦","Rue, avenueâ¦");
  T("Apto, blocoâ¦","Apt, blockâ¦","Depto, bloqueâ¦","Appt, bÃ¢timentâ¦");
  T("Digite a marca do carro...","Type the car brand...","Escribe la marca del coche...","Saisissez la marque de la voiture...");
  T("Selecione acima ou digite...","Select above or type...","Selecciona arriba o escribe...","SÃ©lectionnez ci-dessus ou saisissez...");
  T("Digite o paÃ­s (ex: Brasil, ItÃ¡lia, Reino Unido...)","Type the country (e.g. Brazil, Italy, UK...)","Escribe el paÃ­s (ej: Brasil, Italia, Reino Unido...)","Saisissez le pays (ex : BrÃ©sil, Italie, Royaume-Uni...)");
  T("Nome do piloto (mÃ¡x. 20 caracteres)","Driver name (max. 20 characters)","Nombre del piloto (mÃ¡x. 20 caracteres)","Nom du pilote (max. 20 caractÃ¨res)");
  T("ComeÃ§ar uma personalizaÃ§Ã£o do zero (mantÃ©m o carrinho)","Start a customization from scratch (keeps the cart)","Empezar una personalizaciÃ³n desde cero (mantiene el carrito)","DÃ©marrer une personnalisation de zÃ©ro (conserve le panier)");
  T("Se o carro vier de cabeÃ§a para baixo, clique para corrigir","If the car appears upside down, click to fix","Si el coche aparece al revÃ©s, haz clic para corregir","Si la voiture est Ã  l'envers, cliquez pour corriger");

  var _traduzindo=false, _mo=null;
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
      var m=curT.match(/^Passo (\d+) de (\d+)$/); if(m){ var pw={en:'Step %1 of %2',es:'Paso %1 de %2',fr:'Ãtape %1 sur %2'}[alvo]; n.nodeValue=cur.replace(curT,pw.replace('%1',m[1]).replace('%2',m[2])); }
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
    if(CFG[FP.region]&&CFG[FP.region].prices)window._preco=CFG[FP.region].prices;},140); });
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
    wrap.innerHTML='<button class="fp-lang-btn" id="fpLangBtn" aria-label="Idioma e regiÃ£o"><span class="fp-flag" id="fpLangFlag"></span><span class="fp-lang-txt" id="fpLangTxt">PT</span><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>'
      +'<div class="fp-lang-menu" id="fpLangMenu">'
      +'<div class="fp-lang-h" id="fpH1">Idioma</div>'
      +'<div class="fp-lang-opt" data-lang="pt"><span class="fp-flag">'+flagSVG('BR')+'</span> PortuguÃªs</div>'
      +'<div class="fp-lang-opt" data-lang="en"><span class="fp-flag">'+flagSVG('GB')+'</span> English</div>'
      +'<div class="fp-lang-opt" data-lang="es"><span class="fp-flag">'+flagSVG('ES')+'</span> EspaÃ±ol</div>'
      +'<div class="fp-lang-opt" data-lang="fr"><span class="fp-flag">'+flagSVG('FR')+'</span> FranÃ§ais</div>'
      +'<div class="fp-lang-div"></div>'
      +'<div class="fp-lang-h" id="fpH2">RegiÃ£o / Entrega</div>'
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
    var _h1={pt:'Idioma',en:'Language',es:'Idioma',fr:'Langue'}, _h2={pt:'RegiÃ£o / Entrega',en:'Region / Delivery',es:'RegiÃ³n / EnvÃ­o',fr:'RÃ©gion / Livraison'};
    var h1=document.getElementById('fpH1'); if(h1)h1.textContent=_h1[FP.lang]||_h1.pt;
    var h2=document.getElementById('fpH2'); if(h2)h2.textContent=_h2[FP.lang]||_h2.pt;
    document.querySelectorAll('#fpLang [data-lang]').forEach(function(o){o.classList.toggle('on',o.getAttribute('data-lang')===FP.lang);});
    document.querySelectorAll('#fpLang [data-reg]').forEach(function(o){o.classList.toggle('on',o.getAttribute('data-reg')===FP.region);});
    document.querySelectorAll('#fpLang [data-rk]').forEach(function(s){var r=s.getAttribute('data-rk');if(CFG[r])s.textContent=CFG[r].reg[FP.lang]||CFG[r].reg.pt;});
  }

  // ââ FRETE: cÃ¡lculo REAL â SuperFrete (BR â¤100cm) Â· Melhor Envio/Jadlog (BR >100cm) Â· Sendcloud (EU) ââ
  FP.frete=null;
  var FRETE_EU_PAISES=[['BE','BÃ©lgica'],['FR','FranÃ§a'],['DE','Alemanha'],['NL','PaÃ­ses Baixos'],['LU','Luxemburgo'],['IT','ItÃ¡lia'],['ES','Espanha'],['PT','Portugal'],['AT','Ãustria'],['IE','Irlanda']];
  function fmt(v){var loc={pt:'pt-BR',en:'en-US',es:'es-ES',fr:'fr-FR'}[FP.lang]||'pt-BR';return Number(v||0).toLocaleString(loc,{minimumFractionDigits:2,maximumFractionDigits:2});}
  function _freteDim(i){
    if(i&&i.cfg){ if(i.cfg.legoDim)return i.cfg.legoDim; if(i.cfg.quadroDim)return i.cfg.quadroDim; if(i.cfg.dim)return i.cfg.dim; }
    if(i&&i.dim)return i.dim;
    var txt=((i&&i.sub)||'')+' '+(((i&&i.linhas)||[]).join(' '));
    var m=txt.match(/\d{1,3}(?:[.,]\d)?\s*[Ãx]\s*\d{1,3}(?:[.,]\d)?\s*cm/i);
    return m?m[0]:'';
  }
  function _freteItens(){ return (window.CART||[]).map(function(i){return {dim:_freteDim(i),qty:1};}).filter(function(x){return x.dim;}); }
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
    box.innerHTML='<div class="fp-frete-h"><span>ð</span> <span id="fpFreteT"></span></div>'
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

/* ââââââââââââââ CUPOM DE DESCONTO (carrinho) ââââââââââââââ
   Inline para nÃ£o depender de novo deploy do app_1.js.
   Valida no Worker (/cupom), aplica o desconto no total (fonte Ãºnica = _cartTotal)
   e injeta o cÃ³digo no POST /pedido para o servidor recalcular e contar o uso. */
(function(){
  var API=(typeof API_FUNPARTS!=='undefined')?API_FUNPARTS:'https://funparts-ai-proxy.rodox1209.workers.dev';
  var LS='fp_cupom_v1';
  window._cupom=null;
  var L={
    pt:{title:'Cupom de desconto',ph:'Digite seu cupom',apply:'Aplicar',remove:'remover',applied:'aplicado',freeship:'+ frete grÃ¡tis',invalid:'Cupom invÃ¡lido',checking:'Verificandoâ¦',empty:'Informe um cupom'},
    en:{title:'Discount coupon',ph:'Enter your coupon',apply:'Apply',remove:'remove',applied:'applied',freeship:'+ free shipping',invalid:'Invalid coupon',checking:'Checkingâ¦',empty:'Enter a coupon'}
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
  // a partir daqui _cartTotal Ã© o total COM desconto (o site inteiro passa a usar este)
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
      return '<div class="fp-cup-h"><span>ðï¸</span> '+lg('title')+'</div>'
        +'<div class="fp-cup-applied"><div class="fp-cup-tag">'+esc(c.codigo)+' '+lg('applied')
          +(c.frete_gratis?' <em>'+lg('freeship')+'</em>':'')+'</div>'
          +'<div class="fp-cup-val">â '+sym()+' '+fmt(desc)+'</div>'
          +'<button type="button" class="fp-cup-rm" id="fpCupRm">'+lg('remove')+'</button></div>';
    }
    return '<div class="fp-cup-h"><span>ðï¸</span> '+lg('title')+'</div>'
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

  // re-renderiza a caixa sempre que o carrinho Ã© redesenhado
  var _cr=window._cartRender;
  window._cartRender=function(){ if(typeof _cr==='function')_cr.apply(this,arguments); render(); };

  // injeta o cupom no POST /pedido (o app_1.js nÃ£o conhece o cupom)
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

/* ââââââââââ FRETE na mensagem do WhatsApp (fechamento) ââââââââââ
   Injeta a transportadora escolhida + "Total com frete" na mensagem, sem tocar no app_1.js. */
(function(){
  var _open=window.open;
  var CN={superfrete:'SuperFrete',melhorenvio:'Melhor Envio',sendcloud:'Sendcloud'};
  function fmtM(v,sym){ return (sym||'R$')+' '+Number(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}); }
  function bloco(){
    var f=(window.FP&&FP.frete)?FP.frete:null; if(!f||f.price==null)return '';
    var sym=f.currency||'R$'; var carr=(CN[f.carrier]||f.carrier||'').toString().trim();
    var nome=(carr?carr+' Â· ':'')+(f.label||'');
    var sub=(typeof _cartTotal==='function')?_cartTotal():0;
    var b='\n*Frete:* '+nome+' â '+fmtM(f.price,sym);
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
   O cliente Ã© forÃ§ado a seguir o passo a passo: navega sÃ³ pelos botÃµes "PrÃ³ximo â" e "â Voltar". */
(function(){
  document.addEventListener('click', function(e){
    var t=e.target; var tab=(t&&t.closest)?t.closest('.stab'):null;
    if(tab){ e.preventDefault(); e.stopPropagation(); }
  }, true);
  document.addEventListener('keydown', function(e){
    // impede ativar a etapa por teclado (Enter/EspaÃ§o) caso esteja focada
    if((e.key==='Enter'||e.key===' ')&&document.activeElement&&document.activeElement.closest&&document.activeElement.closest('.stab')){ e.preventDefault(); e.stopPropagation(); }
  }, true);
  var st=document.createElement('style');
  st.textContent='.stab{cursor:default!important;}';
  (document.head||document.documentElement).appendChild(st);
})();

/* ââ Galeria do produto (Quadro com miniatura): 4 miniaturas SEMPRE coladas Ã  imagem principal ââ
   Antes o box da imagem "esticava" (flex:1) e centralizava a foto numa Ã¡rea alta, deixando as
   miniaturas grudadas na base (vÃ£o grande em telas maiores). Agora imagem + miniaturas viram um
   bloco Ãºnico, centralizado, com as fotinhas logo abaixo â igual em qualquer resoluÃ§Ã£o. */
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
    // box da imagem NÃO cresce (flex:0) -> a foto encosta nas miniaturas e o bloco fica centralizado
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

/* ââ Imagem de entrada (home/Tipo): ancorar no topo, perto do menu ââ
   Antes #heroImg centralizava vertical (align-items:center;height:100%), entÃ£o em monitores
   mais verticais a imagem descia demais. Agora fica colada ao topo, prÃ³xima do menu, em qualquer tela. */
(function(){
  function anchorHero(){
    var h=document.getElementById('heroImg');
    if(h){ h.style.alignItems='flex-start'; h.style.paddingTop='30px'; }
  }
  if(document.readyState!=='loading')anchorHero(); else document.addEventListener('DOMContentLoaded',anchorHero);
  // reforÃ§a caso o painel seja re-renderizado ao voltar pra home
  setTimeout(anchorHero,400);
})();

/* ââ Ancoragem geral no topo: coluna esquerda (todas as etapas) + resumo/TOTAL do checkout ââ
   1) .pv-panel usava justify-content:center -> em monitores altos/verticais todo preview da
      esquerda (produto, LEGO, Mini, preview em tempo real) descia demais. Agora cola no topo,
      logo abaixo do menu superior, em qualquer resoluÃ§Ã£o.
   2) #cartForm (dados do cliente) tinha flex:1 e crescia, empurrando o bloco TOTAL/botÃ£o do
      WhatsApp para o rodapÃ©. Agora o form nÃ£o estica (flex:0 1 auto): o resumo/TOTAL fica
      colado logo apÃ³s o Ãºltimo campo. Se a tela for baixa, o form rola normalmente. */
(function(){
  var css=''
    + '.pv-panel{justify-content:flex-start!important;}'
    + '#cartForm.cart-body{flex:0 1 auto!important;}'
    // Previews de altura fixa (fluxo LEGO/Miniatura) encostavam a imagem no centro do painel.
    // Com height:auto o container "abraÃ§a" a imagem e o .pv-panel (flex-start) o cola no topo.
    // O texto sobreposto do #legoHeroImg (top:50%) passa a centralizar na prÃ³pria imagem.
    + '#legoHeroImg,#miniHeroImg,#miniStep1HeroImg{height:auto!important;align-items:flex-start!important;}'
    // Pares de preview (catÃ¡logo Produto e "somente quadro" Detalhamento): o app coloca o
    // .pv-panel em row com align-items:center, o que centralizava verticalmente o bloco
    // "homem + quadro". No modo row: centraliza na HORIZONTAL e ancora no TOPO (junto ao menu).
    + '.pv-panel[style*="flex-direction: row"]{justify-content:center!important;align-items:flex-start!important;}';
  var st=document.createElement('style');
  st.setAttribute('data-fp','anchor-top');
  st.textContent=css;
  (document.head||document.documentElement).appendChild(st);
})();
