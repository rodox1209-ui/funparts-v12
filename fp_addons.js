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

/* Ã¢ÂÂÃ¢ÂÂ EDITAR PRODUTO NO CARRINHO (recarrega a personalizacao salva e atualiza o item) Ã¢ÂÂÃ¢ÂÂ
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
      var img=i.thumb ? '<img src="'+i.thumb+'" alt="">' : '<div class="ph">'+(i.tipo==='lego'?'Ã°ÂÂ§Â±':'Ã°ÂÂÂÃ¯Â¸Â')+'</div>';
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
    BR:{lang:'pt',currency:'BRL',symbol:'R$',frete:'superfrete',gateway:'pagarme',flag:'Ã°ÂÂÂ§Ã°ÂÂÂ·',reg:{pt:'Brasil',en:'Brazil'},prices:{lego_base_carbono:689,lego_base_fosco:589,mini_base_P:1990,mini_base_M:2490,mini_base_G:2990,opt_moldura_fibra:75,opt_led_rgb_sem:489,opt_led_rgb_com:589,opt_led_warm_sem:389,opt_led_warm_com:489,opt_relevo_bandeira:90,opt_relevo_piloto:90}},
    EU:{lang:'en',currency:'EUR',symbol:'Ã¢ÂÂ¬',frete:'sendcloud',gateway:'stripe',flag:'Ã°ÂÂÂªÃ°ÂÂÂº',reg:{pt:'Europa',en:'Europe'},prices:{lego_base_carbono:119,lego_base_fosco:102,mini_base_P:343,mini_base_M:429,mini_base_G:515,opt_moldura_fibra:13,opt_led_rgb_sem:84,opt_led_rgb_com:102,opt_led_warm_sem:67,opt_led_warm_com:84,opt_relevo_bandeira:16,opt_relevo_piloto:16}},
    US:{lang:'en',currency:'USD',symbol:'$',frete:'sendcloud',gateway:'stripe',flag:'Ã°ÂÂÂºÃ°ÂÂÂ¸',reg:{pt:'EUA',en:'USA'},prices:{lego_base_carbono:130,lego_base_fosco:111,mini_base_P:375,mini_base_M:470,mini_base_G:564,opt_moldura_fibra:14,opt_led_rgb_sem:92,opt_led_rgb_com:111,opt_led_warm_sem:73,opt_led_warm_com:92,opt_relevo_bandeira:17,opt_relevo_piloto:17}}
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

  // Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ TRADUÃÃO COMPLETA DO SITE (PT/EN/ES/FR) Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
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
  T("Ã°ÂÂÂ¡ IluminaÃ§Ã£o LED interna","Ã°ÂÂÂ¡ Internal LED lighting","Ã°ÂÂÂ¡ IluminaciÃ³n LED interna","Ã°ÂÂÂ¡ Ãclairage LED intÃ©rieur");
  T("Selecione o tipo abaixo","Select the type below","Selecciona el tipo abajo","Choisissez le type ci-dessous");
  T("RetroiluminaÃ§Ã£o no interior do quadro â efeito espetacular no ambiente","Backlighting inside the frame â a stunning effect in the room","RetroiluminaciÃ³n en el interior del cuadro â efecto espectacular en el ambiente","RÃ©troÃ©clairage Ã  l'intÃ©rieur du cadre â effet spectaculaire dans la piÃ¨ce");
  T("Sem LED","No LED","Sin LED","Sans LED");
  T("Tipo de LED","LED Type","Tipo de LED","Type de LED");
  T("Ã°ÂÂÂ Com Fio","Ã°ÂÂÂ Wired","Ã°ÂÂÂ Con cable","Ã°ÂÂÂ Filaire");
  T("Ã°ÂÂÂ Sem Fio","Ã°ÂÂÂ Wireless","Ã°ÂÂÂ InalÃ¡mbrico","Ã°ÂÂÂ Sans fil");
  T("Neutro","Neutral","Neutro","Neutre");
  T("Luz 3000K","3000K light","Luz 3000K","LumiÃ¨re 3000K");
  T("RGB","RGB","RGB","RGB");
  T("Multicolor","Multicolor","Multicolor","Multicolore");
  T("PrÃ³ximo: Alto-relevo â","Next: Relief â","Siguiente: Relieve â","Suivant : Relief â");
  // etapa Alto-relevo
  T("Elementos em alto relevo aplicados no quadro","Raised relief elements applied to the frame","Elementos en altorrelieve aplicados al cuadro","ÃlÃ©ments en relief appliquÃ©s au cadre");
  T("Relevos fixos","Fixed reliefs","Relieves fijos","Reliefs fixes");
  T("(sempre incluÃ­dos)","(always included)","(siempre incluidos)","(toujours inclus)");
  T("Ã°ÂÂÂ·Ã¯Â¸Â Logotipo Marca","Ã°ÂÂÂ·Ã¯Â¸Â Brand Logo","Ã°ÂÂÂ·Ã¯Â¸Â Logotipo de la marca","Ã°ÂÂÂ·Ã¯Â¸Â Logo de la marque");
  T("Gerado com IA conforme marca selecionada","AI-generated based on the selected brand","Generado con IA segÃºn la marca seleccionada","GÃ©nÃ©rÃ© par IA selon la marque choisie");
  T("Gerando o logo da marca com IAâ¦","Generating the brand logo with AIâ¦","Generando el logo de la marca con IAâ¦","GÃ©nÃ©ration du logo de la marque par IAâ¦");
  T("Branco","White","Blanco","Blanc");
  T("Preto","Black","Negro","Noir");
  T("Vermelho","Red","Rojo","Rouge");
  T("Escolher cor","Choose color","Elegir color","Choisir la couleur");
  T("Ã°ÂÂÂÃ¯Â¸Â Logo do Modelo â Canto inferior direito","Ã°ÂÂÂÃ¯Â¸Â Model Logo â Bottom right corner","Ã°ÂÂÂÃ¯Â¸Â Logo del modelo â Esquina inferior derecha","Ã°ÂÂÂÃ¯Â¸Â Logo du modÃ¨le â Coin infÃ©rieur droit");
  T("Gerado com IA conforme modelo selecionado","AI-generated based on the selected model","Generado con IA segÃºn el modelo seleccionado","GÃ©nÃ©rÃ© par IA selon le modÃ¨le choisi");
  T("Gerando o logo do modelo com IAâ¦","Generating the model logo with AIâ¦","Generando el logo del modelo con IAâ¦","GÃ©nÃ©ration du logo du modÃ¨le par IAâ¦");
  T("Relevos opcionais","Optional reliefs","Relieves opcionales","Reliefs optionnels");
  T("Ã°ÂÂÂ´ Bandeira do PaÃ­s","Ã°ÂÂÂ´ Country Flag","Ã°ÂÂÂ´ Bandera del paÃ­s","Ã°ÂÂÂ´ Drapeau du pays");
  T("Canto superior direito â bandeira do piloto ou escuderia em relevo","Top right corner â driver or team flag in relief","Esquina superior derecha â bandera del piloto o escuderÃ­a en relieve","Coin supÃ©rieur droit â drapeau du pilote ou de l'Ã©curie en relief");
  T("Ã°ÂÂÂ¤ Nome do Piloto","Ã°ÂÂÂ¤ Driver Name","Ã°ÂÂÂ¤ Nombre del piloto","Ã°ÂÂÂ¤ Nom du pilote");
  T("Canto inferior esquerdo â atÃ© 20 caracteres gravados em relevo","Bottom left corner â up to 20 characters engraved in relief","Esquina inferior izquierda â hasta 20 caracteres grabados en relieve","Coin infÃ©rieur gauche â jusqu'Ã  20 caractÃ¨res gravÃ©s en relief");
  T("Ã°ÂÂÂ Placa com informaÃ§Ãµes do Carro","Ã°ÂÂÂ Plate with Car information","Ã°ÂÂÂ Placa con informaciÃ³n del coche","Ã°ÂÂÂ Plaque avec informations de la voiture");
  T("Placa tÃ©cnica em alto relevo com dados do veÃ­culo","Technical plate in relief with the vehicle's data","Placa tÃ©cnica en altorrelieve con los datos del vehÃ­culo","Plaque technique en relief avec les donnÃ©es du vÃ©hicule");
  T("Ã°ÂÂÂºÃ¯Â¸Â TraÃ§ado do circuito","Ã°ÂÂÂºÃ¯Â¸Â Circuit Layout","Ã°ÂÂÂºÃ¯Â¸Â Trazado del circuito","Ã°ÂÂÂºÃ¯Â¸Â TracÃ© du circuit");
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
  T("Ã°ÂÂÂ¦ Embalagem Premium","Ã°ÂÂÂ¦ Premium Packaging","Ã°ÂÂÂ¦ Embalaje premium","Ã°ÂÂÂ¦ Emballage premium");
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
  T("Tipo de Quadro","Frame Type","Tipo de Marco","Type de Cadre");
  T("Modelo â","Model â","Modelo â","ModÃ¨le â");
  T("Finalizar e pagar â","Checkout â","Finalizar y pagar â","Finaliser et payer â");
  T("Fundo","Background","Fondo","ArriÃ¨re-plan");
  T("Modelo","Model","Modelo","ModÃ¨le");
  T("Miniatura","Model","Miniatura","Miniature");
  T("Detalhamento","Details","Detalles","DÃ©tails");
  T("Moldura + LED","Frame + LED","Marco + LED","Cadre + LED");
  T("Alto-relevo","Relief","Relieve","Relief");
  T("Produto","Product","Producto","Produit");
  T("Preencha o CEP para calcular o frete","Enter your ZIP code to calculate shipping","Ingrese su cÃ³digo postal para calcular el envÃ­o","Entrez votre code postal pour calculer la livraison");
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
    // Multi-currency: injetar preÃ§os regionais em CAT_PRECOS + recalcular
    (function(){
      var reg=FP.region||'BR';
      if(reg==='BR'){
        // Restaurar preÃ§os originais do banco (BR)
        if(window._origCAT_PRECOS!==undefined) window.CAT_PRECOS=window._origCAT_PRECOS;
      } else if(CFG[reg]&&CFG[reg].prices){
        // Salvar original apenas uma vez
        if(window._origCAT_PRECOS===undefined) window._origCAT_PRECOS=window.CAT_PRECOS;
        window.CAT_PRECOS=CFG[reg].prices;
      }
      // Recalcular preÃ§o exibido e corrigir sÃ­mbolo
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

  // Ã¢ÂÂÃ¢ÂÂ FRETE: cÃ¡lculo REAL â SuperFrete (BR Ã¢ÂÂ¤100cm) Â· Melhor Envio/Jadlog (BR >100cm) Â· Sendcloud (EU) Ã¢ÂÂÃ¢ÂÂ
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
    box.innerHTML='<div class="fp-frete-h"><span>Ã°ÂÂÂ</span> <span id="fpFreteT"></span></div>'
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

/* Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ CUPOM DE DESCONTO (carrinho) Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
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
      return '<div class="fp-cup-h"><span>Ã°ÂÂÂÃ¯Â¸Â</span> '+lg('title')+'</div>'
        +'<div class="fp-cup-applied"><div class="fp-cup-tag">'+esc(c.codigo)+' '+lg('applied')
          +(c.frete_gratis?' <em>'+lg('freeship')+'</em>':'')+'</div>'
          +'<div class="fp-cup-val">Ã¢ÂÂ '+sym()+' '+fmt(desc)+'</div>'
          +'<button type="button" class="fp-cup-rm" id="fpCupRm">'+lg('remove')+'</button></div>';
    }
    return '<div class="fp-cup-h"><span>Ã°ÂÂÂÃ¯Â¸Â</span> '+lg('title')+'</div>'
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

/* Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ FRETE na mensagem do WhatsApp (fechamento) Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
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

/* Ã¢ÂÂÃ¢ÂÂ Galeria do produto (Quadro com miniatura): 4 miniaturas SEMPRE coladas Ã  imagem principal Ã¢ÂÂÃ¢ÂÂ
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

/* Ã¢ÂÂÃ¢ÂÂ Imagem de entrada (home/Tipo): ancorar no topo, perto do menu Ã¢ÂÂÃ¢ÂÂ
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

/* Ã¢ÂÂÃ¢ÂÂ Ancoragem geral no topo: coluna esquerda (todas as etapas) + resumo/TOTAL do checkout Ã¢ÂÂÃ¢ÂÂ
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

;(function(){
'use strict';
if(typeof window.FP_traduzTudo!=='function')return;
var _orig=window.FP_traduzTudo;

/* ââ PT to EN text-node map (keys are trimmed text-node content) ââ */
var EN={
  'Carrinho':'Cart',
  'Seu carrinho estÃ¡ vazio.':'Your cart is empty.',
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
    setEl('relevoNenhumMsg','This product does not include the high relief option.');
    setQ('#cartBtn .lbl','Cart');
    applyFpFreteHNode('en');
    applyMap(EN);
    applyLegoSection('en');
  } else if(lang==='pt'){
    setEl('fpH2','Regi\u00E3o / Entrega');
    setEl('fpFreteT','Frete / Entrega');
    setEl('fixedTL','\uD83C\uDFC1 Logo F\u00F3rmula 1 \u2014 Canto superior esquerdo');
    setEl('relevoNenhumMsg','Este produto n\u00E3o cont\u00E9m a op\u00E7\u00E3o de alto relevo.');
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
  'Clique no botÃ£o':'Click the button',
  ', abaixo e dÃª continuidade na experiÃªncia':', below and continue the experience',
  'PadrÃ£o':'Standard',
  'NÃºmero de corrida na carroceria':'Race number on the bodywork',
  'â± 7â12 dias Ãºteis':'â± 7â12 business days',
  'Super HerÃ³is':'Super Heroes'
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
  'Super Her\u00F3is':'Super Heroes'
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
  /* chama a cadeia original â ignora erro de TreeWalker do original */
  try{_fp_chain.call(window,lang);}catch(e){}
  /* reaplica nossas traduÃ§Ãµes de forma garantida */
  if(lang==='en'){
    setEl('fpH2','Region / Delivery');
    setEl('fpFreteT','Shipping / Delivery');
    setEl('fixedTL','\uD83C\uDFC1 Formula 1 Logo \u2014 Top left corner');
    setEl('relevoNenhumMsg','This product does not include the high relief option.');
    setQ('#cartBtn .lbl','Cart');
    applyFpFreteHNode('en');
    applyMap(ALL_EN);
    applyLegoSection('en');
  } else if(lang==='pt'){
    setEl('fpH2','Regi\u00E3o / Entrega');
    setEl('fpFreteT','Frete / Entrega');
    setEl('fixedTL','\uD83C\uDFC1 Logo F\u00F3rmula 1 \u2014 Canto superior esquerdo');
    setEl('relevoNenhumMsg','Este produto n\u00E3o cont\u00E9m a op\u00E7\u00E3o de alto relevo.');
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
  'Seu carrinho estÃ¡ vazio.':'Your cart is empty.',
  'Monte um quadro e adicione aqui.':'Build a frame and add it here.',
  'Pedido':'Order',
  'PERSONALIZAR QUADRO':'CUSTOMIZE FRAME',
  'Selecione a marca...':'Select brand...',
  'â  ATENÃÃO: MINIATURA NÃO INCLUSA':'â  NOTICE: MINIATURE NOT INCLUDED',
  'Esta opÃ§Ã£o de personalizaÃ§Ã£o refere-se exclusivamente Ã  produÃ§Ã£o do quadro. A miniatura diecast exibida nas imagens (via inteligÃªncia artificial) nÃ£o acompanha o produto e nÃ£o estÃ¡ inclusa na compra.':'This customization option refers exclusively to the production of the frame. The diecast miniature shown in the images (via artificial intelligence) does not accompany the product and is not included in the purchase.',
  'Este serviÃ§o Ã© destinado a clientes que jÃ¡ possuem a prÃ³pria miniatura e desejam transformÃ¡-la em uma peÃ§a decorativa exclusiva, fixando-a na parede de maneira inovadora e elegante.':'This service is intended for customers who already own their own miniature and wish to transform it into an exclusive decorative piece, mounting it on the wall in an innovative and elegant way.',
  'O quadro serÃ¡ enviado pronto para que vocÃª faÃ§a a instalaÃ§Ã£o da miniatura utilizando parafusos, de forma simples e prÃ¡tica. O kit inclui: quadro personalizado, buchas, parafusos e gabarito de instalaÃ§Ã£o, facilitando tanto a fixaÃ§Ã£o da miniatura no quadro quanto a instalaÃ§Ã£o do quadro na parede.':'The frame will be shipped ready for you to install the miniature using screws, in a simple and practical manner. The kit includes: custom frame, wall plugs, screws, and an installation template â making it easy to both mount the miniature to the frame and hang the frame on the wall.',
  'VerificaÃ§Ã£o de disponibilidade':'Availability check',
  'Miniaturas disponÃ­veis no mercado sÃ£o fornecidas em die-cast (ferro fundido) nas escalas 1:18 ou 1:24.':'Miniatures available on the market are supplied in die-cast (iron) at 1:18 or 1:24 scale.',
  'Modelos raros ou exclusivos sÃ£o produzidos via':'Rare or exclusive models are produced via',
  'impressÃ£o 3D + pintura automotiva':'3D printing + automotive paint',
  'Disponibilidade da miniatura':'Miniature availability',
  'PersonalizaÃ§Ã£o da miniatura':'Miniature customization',
  'EspecificaÃ§Ãµes da miniatura e do quadro':'Miniature and frame specifications',
  'DimensÃ£o da miniatura':'Miniature dimensions',
  'DimensÃ£o do quadro':'Frame dimensions',
  'Set Selecionado':'Selected Set',
  'ð¦ Quadro + Miniatura':'ð¦ Frame + Miniature',
  'â Todo o Brasil':'â Across Brazil',
  'NÃ£o tenho certeza':"I'm not sure",
  'NÃ£o existe â modelo exclusivo':"Doesn't exist â exclusive model",
  'Die-cast 1:18 ou 1:24 â fundiÃ§Ã£o em ferro':'Die-cast 1:18 or 1:24 â iron casting',
  'ImpressÃ£o 3D com acabamento pintura automotiva':'3D printing with automotive paint finish',
  'Cor personalizada (aerografia)':'Custom color (airbrushing)',
  'Placa personalizada':'Custom license plate',
  'Figura de piloto inclusa':'Pilot figure included',
  'â Produto pronto para entrega Â Â·Â  â Quadro + Miniatura inclusos Â Â·Â  â Embalagem premium':'â Ready for delivery Â Â·Â  â Frame + Miniature included Â Â·Â  â Premium packaging',
  'Se escolher essa opÃ§Ã£o vocÃª terÃ¡ dois caminhos:':"By choosing this option, you'll have two paths:",
  'Escolher quadros para sua miniatura(s);':'Choose frames for your miniature(s);',
  'Escolher quadros prontos que jÃ¡ contenham miniaturas inclusas.':'Choose ready-made frames that already include miniatures.',
  'Sobre esta visualizaÃ§Ã£o':'About this visualization',
  'A imagem do veÃ­culo foi gerada por InteligÃªncia Artificial para facilitar a visualizaÃ§Ã£o de como a sua miniatura ficarÃ¡ aplicada no quadro.':'The vehicle image was generated by Artificial Intelligence to help visualize how your miniature will look mounted in the frame.',
  'Por esse motivo, alguns detalhes, como rodas, farÃ³is, tonalidades e acabamentos, podem apresentar pequenas diferenÃ§as em relaÃ§Ã£o Ã  miniatura que vocÃª possui.':'For this reason, some details such as wheels, headlights, tones, and finishes may show slight differences from the miniature you own.',
  'Nesta etapa, o objetivo principal Ã© demonstrar a':'At this stage, the main goal is to show the vehicleâs',
  'proporÃ§Ã£o do veÃ­culo em relaÃ§Ã£o ao quadro':'scale relative to the frame',
  '. Assim, na prÃ³xima etapa, vocÃª poderÃ¡ comparar os diferentes tamanhos disponÃ­veis e escolher com mais seguranÃ§a o modelo que melhor valoriza e acomoda a sua miniatura.':".Â In the next step, you'll be able to compare the available sizes and confidently choose the option that best showcases and fits your miniature.",
  'Se escolher essa opÃ§Ã£o vocÃª terÃ¡':"By choosing this option, you'll have",
  'dezenas de modelos de quadros':'dozens of frame models',
  'para fixar sua miniatura de Lego.':'to mount your Lego miniature.',
  'ObservaÃ§Ã£o:':'Note:',
  'para Lego.':'frames for Lego.',
  'Clique no botÃ£o':'Click the button',
  ', abaixo e dÃª continuidade na experiÃªncia':', below and continue the experience',
  'PadrÃ£o':'Standard',
  'NÃºmero de corrida na carroceria':'Race number on the bodywork',
  'â± 7â12 dias Ãºteis':'â± 7â12 business days',
  'Super HerÃ³is':'Super Heroes',
  /* ââ NEW entries for dynamically rendered wizard content ââ */
  'Fibra de Carbono (Vinil)':'Carbon Fiber (Vinyl)',
  'Fibra de Carbono':'Carbon Fiber',
  'Envio prÃ³prio':'Self-provided',
  /* DETAILS subtitle â may appear all-caps in DOM or via CSS */
  'EspecificaÃ§Ãµes da miniatura e do quadro':'Miniature and frame specifications',
  'ESPECIFICAÃÃES DA MINIATURA E DO QUADRO':'MINIATURE AND FRAME SPECIFICATIONS',
  /* Lego / option card texts */
  'Nessa opÃ§Ã£o nÃ£o estÃ¡ incluso a miniatura. Produzimos e vendemos apenas os quadros':'This option does not include the miniature. We only produce and sell',
  /* Common wizard labels */
  'Selecione o modelo...':'Select model...',
  'Selecione o tamanho...':'Select size...',
  'Selecione a cor...':'Select color...',
  'Selecione o acabamento...':'Select finish...',
  'Selecione a opÃ§Ã£o...':'Select option...',
  /* Shipping/checkout */
  'Calcular':'Calculate',
  'Calcular frete':'Calculate shipping',
  'Frete grÃ¡tis':'Free shipping',
  'Prazo de entrega':'Delivery time',
  'Dias Ãºteis':'Business days',
  'Entrega':'Delivery',
  'Finalizar pedido':'Complete order',
  'Continuar comprando':'Continue shopping'
};

var PT4={};
Object.keys(EN4).forEach(function(k){PT4[EN4[k]]=k;});

/* Text-only walker â safe from MutationObserver (no innerHTML â no loops) */
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

/* Exact text node map â in new entries not covered by patches 1-4 */
var EN5={
  /* Model step header */
  'QUADRO PARA MINIATURAS':'MINIATURE FRAME',
  'Selecione o quadro da sua preferÃªncia':'Select your preferred frame',
  'SELECIONE O QUADRO DA SUA PREFERÃNCIA':'SELECT YOUR PREFERRED FRAME',
  'Quadro para LEGO':'Frame for LEGO',
  /* Relief step */
  'LOGOTIPO COM MARCA DO CARRO':'BRAND LOGO',
  'ð·ï¸ Logotipo com marca do carro':'ð·ï¸ Brand Logo',
  'Logotipo com marca do carro':'Brand Logo',
  'Logotipo oficial da marca selecionada':'Official logo of the selected brand',
  'ð Artesanal':'ð Handcrafted',
  'Artesanal':'Handcrafted',
  /* Order summary rows */
  'Miniatura Die-cast / 3D':'Miniature Die-cast / 3D',
  'â Logo da Marca â canto sup. esq.':'â Brand Logo â top-left corner',
  'â Logo do Modelo â canto inf. dir.':'â Model Logo â bottom-right corner',
  'Logo da Marca â canto sup. esq.':'Brand Logo â top-left corner',
  'Logo do Modelo â canto inf. dir.':'Model Logo â bottom-right corner',
  /* Background options */
  'DegradÃª Central':'Center Gradient',
  'Cor do DegradÃª Central':'Center Gradient Color',
  'ENVIE A IMAGEM DA SUA PREFERÃNCIA':'SEND YOUR PREFERRED IMAGE',
  'Envie a imagem da sua preferÃªncia':'Send your preferred image',
  /* Miniature availability wizard */
  'VerificaÃ§Ã£o de disponibilidade':'Availability check',
  'Disponibilidade da miniatura':'Miniature availability',
  'PersonalizaÃ§Ã£o da miniatura':'Miniature customization',
  'DimensÃ£o da miniatura':'Miniature dimensions',
  'DimensÃ£o do quadro':'Frame dimensions',
  /* Compound label parts (also handled by substrApply below) */
  'Moldura Laca Preto':'Black Lacquer Frame',
  'Fundo Fibra de Carbono (Vinil)':'Carbon Fiber (Vinyl) Background',
  'Fundo Fibra de Carbono':'Carbon Fiber Background',
};

var PT5={};
Object.keys(EN5).forEach(function(k){PT5[EN5[k]]=k;});

/* Substring map â for compound cart/label strings not matched exactly */
var SUBSTR_EN={
  'Moldura Laca Preto':'Black Lacquer Frame',
  'Moldura Fibra de Carbono' :'Carbon Fiber Frame',
  'Fundo Fibra de Carbono (Vinil)':'Carbon Fiber (Vinyl) Background',
  'Fundo Fibra de Carbono' :'Carbon Fiber Background',
  'Fundo AcrÃ­lico UV':'UV Acrylic Background',
  'Logo da Marca':'Brand Logo',
  'Logo do Modelo':'Model Logo',
  'canto sup. esq.':'top-left corner',
  'canto inf. dir.':'bottom-right corner',
  'Miniatura Die-cast':'Miniature Die-cast',
};
var SUBSTR_PT={};
Object.keys(SUBSTR_EN).forEach(function(k){SUBSTR_PT[SUBSTR_EN[k]]=k;});

/* Exact text-node walker â safe for MutationObserver (no innerHTML) */
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

/* Substring walker â handles compound strings in cart/label nodes */
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
  'MODEL LOGO â CANTO INFERIOR DIREITO':'MODEL LOGO â BOTTOM RIGHT CORNER',
  'BRAND LOGO â CANTO SUPERIOR ESQUERDO':'BRAND LOGO â TOP LEFT CORNER',
  'Logo do Modelo â canto inferior direito':'Model Logo â bottom-right corner',
  'Logo da Marca â canto superior esquerdo':'Brand Logo â top-left corner',
  'â Logo da Marca â canto superior esquerdo':'â Brand Logo â top-left corner',
  'â Logo do Modelo â canto inferior direito':'â Model Logo â bottom-right corner',
  /* Standalone corner label strings */
  'CANTO INFERIOR DIREITO':'BOTTOM RIGHT CORNER',
  'CANTO SUPERIOR ESQUERDO':'TOP LEFT CORNER',
  'canto inferior direito':'bottom-right corner',
  'canto superior esquerdo':'top-left corner',
  /* Abbreviated reverse map (ENâPT) handled automatically via PT6 below */
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
  /* RELIEF step card â exact node with emoji */
  'ðï¸ Model Logo â Canto inferior direito':'ðï¸ Model Logo â Bottom right corner',
  'ðï¸ Model Logo â Canto superior esquerdo':'ðï¸ Model Logo â Top left corner',
  /* Without emoji */
  'Model Logo â Canto inferior direito':'Model Logo â Bottom right corner',
  'Model Logo â Canto superior esquerdo':'Model Logo â Top left corner',
  'Brand Logo â Canto superior esquerdo':'Brand Logo â Top left corner',
  'Brand Logo â Canto inferior direito':'Brand Logo â Bottom right corner',
  /* Order summary rows */
  'â Brand Logo â Canto superior esquerdo':'â Brand Logo â top-left corner',
  'â Model Logo â Canto inferior direito':'â Model Logo â bottom-right corner',
};

var PT7={};
Object.keys(EN7).forEach(function(k){PT7[EN7[k]]=k;});

/* Substring map â capital-C variants */
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

/* PATCH 8 â Language-change detector.
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

/* Poll localStorage every 150 ms â cheap (single string comparison) */
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

/* PATCH 9 â Multi-language translation + flag icon fix.

   Problem 1: Patches 4-7 only apply EN maps when lang==='en'. For lang='fr' or
   lang='es', they call walkApply(PTn) which tries to map ENâPT â a no-op since
   the dynamic content is already in PT. Fix: for any non-PT language, run the
   combined EN translation maps after the chain, translating PTâEN as fallback.

   Problem 2: The .fp-flag SVG in .fp-lang-btn stays as the Brazil flag regardless
   of the selected language. Fix: clone the matching flag SVG from the
   .fp-lang-opt dropdown item that corresponds to the active language. */

/* ââ COMBINED EN MAP â union of EN4 + EN5 + EN6 + EN7 ââ */
var _EN9={
  /* patch4 entries */
  'Carrinho':'Cart',
  'Seu carrinho estÃ¡ vazio.':'Your cart is empty.',
  'Monte um quadro e adicione aqui.':'Build a frame and add it here.',
  'Pedido':'Order',
  'PERSONALIZAR QUADRO':'CUSTOMIZE FRAME',
  'Selecione a marca...':'Select brand...',
  'â  ATENÃÃO: MINIATURA NÃO INCLUSA':'â  NOTICE: MINIATURE NOT INCLUDED',
  'Esta opÃ§Ã£o de personalizaÃ§Ã£o refere-se exclusivamente Ã  produÃ§Ã£o do quadro. A miniatura diecast exibida nas imagens (via inteligÃªncia artificial) nÃ£o acompanha o produto e nÃ£o estÃ¡ inclusa na compra.':'This customization option refers exclusively to the production of the frame. The diecast miniature shown in the images (via artificial intelligence) does not accompany the product and is not included in the purchase.',
  'Este serviÃ§o Ã© destinado a clientes que jÃ¡ possuem a prÃ³pria miniatura e desejam transformÃ¡-la em uma peÃ§a decorativa exclusiva, fixando-a na parede de maneira inovadora e elegante.':'This service is intended for customers who already own their own miniature and wish to transform it into an exclusive decorative piece, mounting it on the wall in an innovative and elegant way.',
  'O quadro serÃ¡ enviado pronto para que vocÃª faÃ§a a instalaÃ§Ã£o da miniatura utilizando parafusos, de forma simples e prÃ¡tica. O kit inclui: quadro personalizado, buchas, parafusos e gabarito de instalaÃ§Ã£o, facilitando tanto a fixaÃ§Ã£o da miniatura no quadro quanto a instalaÃ§Ã£o do quadro na parede.':'The frame will be shipped ready for you to install the miniature using screws, in a simple and practical manner. The kit includes: custom frame, wall plugs, screws, and an installation template â making it easy to both mount the miniature to the frame and hang the frame on the wall.',
  'VerificaÃ§Ã£o de disponibilidade':'Availability check',
  'Miniaturas disponÃ­veis no mercado sÃ£o fornecidas em die-cast (ferro fundido) nas escalas 1:18 ou 1:24.':'Miniatures available on the market are supplied in die-cast (iron) at 1:18 or 1:24 scale.',
  'Modelos raros ou exclusivos sÃ£o produzidos via':'Rare or exclusive models are produced via',
  'impressÃ£o 3D + pintura automotiva':'3D printing + automotive paint',
  'Disponibilidade da miniatura':'Miniature availability',
  'PersonalizaÃ§Ã£o da miniatura':'Miniature customization',
  'EspecificaÃ§Ãµes da miniatura e do quadro':'Miniature and frame specifications',
  'DimensÃ£o da miniatura':'Miniature dimensions',
  'DimensÃ£o do quadro':'Frame dimensions',
  'Set Selecionado':'Selected Set',
  'ð¦ Quadro + Miniatura':'ð¦ Frame + Miniature',
  'â Todo o Brasil':'â Across Brazil',
  'NÃ£o tenho certeza':"I'm not sure",
  'NÃ£o existe â modelo exclusivo':"Doesn't exist â exclusive model",
  'Die-cast 1:18 ou 1:24 â fundiÃ§Ã£o em ferro':'Die-cast 1:18 or 1:24 â iron casting',
  'ImpressÃ£o 3D com acabamento pintura automotiva':'3D printing with automotive paint finish',
  'Cor personalizada (aerografia)':'Custom color (airbrushing)',
  'Placa personalizada':'Custom license plate',
  'Figura de piloto inclusa':'Pilot figure included',
  'â Produto pronto para entrega  Â·  â Quadro + Miniatura inclusos  Â·  â Embalagem premium':'â Ready for delivery  Â·  â Frame + Miniature included  Â·  â Premium packaging',
  'Se escolher essa opÃ§Ã£o vocÃª terÃ¡ dois caminhos:':"By choosing this option, you'll have two paths:",
  'Escolher quadros para sua miniatura(s);':'Choose frames for your miniature(s);',
  'Escolher quadros prontos que jÃ¡ contenham miniaturas inclusas.':'Choose ready-made frames that already include miniatures.',
  'Sobre esta visualizaÃ§Ã£o':'About this visualization',
  'A imagem do veÃ­culo foi gerada por InteligÃªncia Artificial para facilitar a visualizaÃ§Ã£o de como a sua miniatura ficarÃ¡ aplicada no quadro.':'The vehicle image was generated by Artificial Intelligence to help visualize how your miniature will look mounted in the frame.',
  'Por esse motivo, alguns detalhes, como rodas, farÃ³is, tonalidades e acabamentos, podem apresentar pequenas diferenÃ§as em relaÃ§Ã£o Ã  miniatura que vocÃ  possui.':'For this reason, some details such as wheels, headlights, tones, and finishes may show slight differences from the miniature you own.',
  'Nesta etapa, o objetivo principal Ã© demonstrar a':'At this stage, the main goal is to show the vehicleâs',
  'proporÃ§Ã£o do veÃ­culo em relaÃ§Ã£o ao quadro':'scale relative to the frame',
  '. Assim, na prÃ³xima etapa, vocÃ  poderÃ¡ comparar os diferentes tamanhos disponÃ­veis e escolher com mais seguranÃ§a o modelo que melhor valoriza e acomoda a sua miniatura.':".Â In the next step, you'll be able to compare the available sizes and confidently choose the option that best showcases and fits your miniature.",
  'Se escolher essa opÃ§Ã£o vocÃ  terÃ¡':"By choosing this option, you'll have",
  'dezenas de modelos de quadros':'dozens of frame models',
  'para fixar sua miniatura de Lego.':'to mount your Lego miniature.',
  'ObservaÃ§Ã£o:':'Note:',
  'para Lego.':'frames for Lego.',
  'Clique no botÃ£o':'Click the button',
  ', abaixo e dÃª continuidade na experiÃªncia':', below and continue the experience',
  'PadrÃ£o':'Standard',
  'NÃºmero de corrida na carroceria':'Race number on the bodywork',
  'â± 7â12 dias Ãºteis':'â± 7â12 business days',
  'Super HerÃ³is':'Super Heroes',
  'Fibra de Carbono (Vinil)':'Carbon Fiber (Vinyl)',
  'Fibra de Carbono':'Carbon Fiber',
  'Envio prÃ³prio':'Self-provided',
  'ESPECIFICAÃÃES DA MINIATURA E DO QUADRO':'MINIATURE AND FRAME SPECIFICATIONS',
  'Nessa opÃ§Ã£o nÃ£o estÃ¡ incluso a miniatura. Produzimos e vendemos apenas os quadros':'This option does not include the miniature. We only produce and sell',
  'Selecione o modelo...':'Select model...',
  'Selecione o tamanho...':'Select size...',
  'Selecione a cor...':'Select color...',
  'Selecione o acabamento...':'Select finish...',
  'Selecione a opÃ§Ã£o...':'Select option...',
  'Calcular':'Calculate',
  'Calcular frete':'Calculate shipping',
  'Frete grÃ¡tis':'Free shipping',
  'Prazo de entrega':'Delivery time',
  'Dias Ãºteis':'Business days',
  'Entrega':'Delivery',
  'Finalizar pedido':'Complete order',
  'Continuar comprando':'Continue shopping',
  /* patch5 entries */
  'QUADRO PARA MINIATURAS':'MINIATURE FRAME',
  'Selecione o quadro da sua preferÃªncia':'Select your preferred frame',
  'SELECIONE O QUADRO DA SUA PREFERÃNCIA':'SELECT YOUR PREFERRED FRAME',
  'Quadro para LEGO':'Frame for LEGO',
  'LOGOTIPO COM MARCA DO CARRO':'BRAND LOGO',
  'ð·ï¸ Logotipo com marca do carro':'ð·ï¸ Brand Logo',
  'Logotipo com marca do carro':'Brand Logo',
  'Logotipo oficial da marca selecionada':'Official logo of the selected brand',
  'ð Artesanal':'ð Handcrafted',
  'Artesanal':'Handcrafted',
  'Miniatura Die-cast / 3D':'Miniature Die-cast / 3D',
  'â Logo da Marca â canto sup. esq.':'â Brand Logo â top-left corner',
  'â Logo do Modelo â canto inf. dir.':'â Model Logo â bottom-right corner',
  'Logo da Marca â canto sup. esq.':'Brand Logo â top-left corner',
  'Logo do Modelo â canto inf. dir.':'Model Logo â bottom-right corner',
  'DegradÃª Central':'Center Gradient',
  'Cor do DegradÃª Central':'Center Gradient Color',
  'ENVIE A IMAGEM DA SUA PREFERÃNCIA':'SEND YOUR PREFERRED IMAGE',
  'Envie a imagem da sua preferÃªncia':'Send your preferred image',
  'Moldura Laca Preto':'Black Lacquer Frame',
  'Fundo Fibra de Carbono (Vinil)':'Carbon Fiber (Vinyl) Background',
  'Fundo Fibra de Carbono':'Carbon Fiber Background',
  /* patch6 entries */
  'MODEL LOGO â CANTO INFERIOR DIREITO':'MODEL LOGO â BOTTOM RIGHT CORNER',
  'BRAND LOGO â CANTO SUPERIOR ESQUERDO':'BRAND LOGO â TOP LEFT CORNER',
  'Logo do Modelo â canto inferior direito':'Model Logo â bottom-right corner',
  'Logo da Marca â canto superior esquerdo':'Brand Logo â top-left corner',
  'â Logo da Marca â canto superior esquerdo':'â Brand Logo â top-left corner',
  'â Logo do Modelo â canto inferior direito':'â Model Logo â bottom-right corner',
  'CANTO INFERIOR DIREITO':'BOTTOM RIGHT CORNER',
  'CANTO SUPERIOR ESQUERDO':'TOP LEFT CORNER',
  'canto inferior direito':'bottom-right corner',
  'canto superior esquerdo':'top-left corner',
  /* patch7 entries */
  'ðï¸ Model Logo â Canto inferior direito':'ðï¸ Model Logo â Bottom right corner',
  'ðï¸ Model Logo â Canto superior esquerdo':'ðï¸ Model Logo â Top left corner',
  'Model Logo â Canto inferior direito':'Model Logo â Bottom right corner',
  'Model Logo â Canto superior esquerdo':'Model Logo â Top left corner',
  'Brand Logo â Canto superior esquerdo':'Brand Logo â Top left corner',
  'Brand Logo â Canto inferior direito':'Brand Logo â Bottom right corner',
  'â Brand Logo â Canto superior esquerdo':'â Brand Logo â top-left corner',
  'â Model Logo â Canto inferior direito':'â Model Logo â bottom-right corner'
};

/* Combined substring map for compound strings */
var _SUBSTR9={
  'Moldura Laca Preto':'Black Lacquer Frame',
  'Moldura Fibra de Carbono':'Carbon Fiber Frame',
  'Fundo Fibra de Carbono (Vinil)':'Carbon Fiber (Vinyl) Background',
  'Fundo Fibra de Carbono':'Carbon Fiber Background',
  'Fundo AcrÃ­lico UV':'UV Acrylic Background',
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

/* ââ FLAG ICON FIX ââ
   Language dropdown has .fp-lang-opt items for PortuguÃªs/English/EspaÃ±ol/FranÃ§ais.
   Clone the .fp-flag SVG from the matching option into the button's flag slot. */
var _p9_langNames={pt:'PortuguÃªs',en:'English',es:'EspaÃ±ol',fr:'FranÃ§ais'};

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

/* ââ INTERCEPT FP_traduzTudo ââ */
window.FP_traduzTudo=function(lang){
  _lang9=lang;
  _p9.call(this,lang);           /* run full upstream chain (patches 1-8) */
  if(lang!=='pt'){
    /* For any non-PT language: ensure PTâEN translation is applied.
       Patches 4-7 incorrectly run walkApply(PTn) for non-EN/non-PT langs
       (which maps ENâPT, a no-op on PT content). We apply the EN maps here
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

/* ââ INITIAL LOAD ââ */
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

/* PATCH 10 â Fix remaining LEGO card PT fragment.
   "Se escolher essa opÃ§Ã£o vocÃª terÃ¡" appears as part of a single
   concatenated text node, so _walkApply9 (exact-match) never fires.
   Adding it to a new SUBSTR pass fixes the partial translation. */

if(typeof window.FP_traduzTudo!=='function')return;
var _p10=window.FP_traduzTudo;
var _lang10='pt';
var _tmr10=null;
var _ob10=null;

var _SUBSTR10={
  'Se escolher essa opÃ§Ã£o vocÃª terÃ¡ dois caminhos:':"By choosing this option, you'll have two paths:",
  'Se escolher essa opÃ§Ã£o vocÃª terÃ¡':"By choosing this option, you'll have",
  'Escolher quadros para sua miniatura(s);':'Choose frames for your miniature(s);',
  'Escolher quadros prontos que jÃ¡ contenham miniaturas inclusas.':'Choose ready-made frames that already include miniatures.',
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

/* PATCH 11 â Retry pump for React re-render timing.
   Root cause: React re-renders components AFTER FP_traduzTudo(lang)
   returns, resetting text nodes back to PT. Patches 9-10 run once
   and the MutationObserver (childList only) may miss direct text-node
   mutations. This patch schedules 4 retries at 150 / 400 / 900 / 2000ms
   with a per-language guard so stale retries are cancelled on lang change.

   Covers confirmed-failing nodes (verified in-browser):
   - "Se escolher essa opÃ§Ã£o voce tera " (LEGO card, concat node)
   - ". Assim, na proxima etapa, voce podera comparar..." (viz note)
   - Remaining LEGO-path fragments and prop/step sentences. */

if(typeof window.FP_traduzTudo!=='function')return;
var _p11=window.FP_traduzTudo;
var _lang11='pt';
var _tmrs11=[];

var _RETRY11={
  'Se escolher essa opÃ§Ã£o vocÃª terÃ¡ dois caminhos:':"By choosing this option, you'll have two paths:",
  'Se escolher essa opÃ§Ã£o vocÃª terÃ¡':"By choosing this option, you'll have",
  '. Assim, na prÃ³xima etapa, vocÃª poderÃ¡ comparar os diferentes tamanhos disponÃ­veis e escolher com mais seguranÃ§a o modelo que melhor valoriza e acomoda a sua miniatura.':"In the next step, you'll be able to compare the available sizes and confidently choose the option that best showcases and fits your miniature.",
  'Nesta etapa, o objetivo principal Ã© demonstrar a':"At this stage, the main goal is to show the vehicleâs",
  'proporÃ§Ã£o do veÃ­culo em relaÃ§Ã£o ao quadro':'scale relative to the frame',
  'Escolher quadros para sua miniatura(s);':'Choose frames for your miniature(s);',
  'Escolher quadros prontos que jÃ¡ contenham miniaturas inclusas.':'Choose ready-made frames that already include miniatures.',
  'dois caminhos:':'two paths:',
  'dezenas de modelos de quadros':'dozens of frame models',
  'para fixar sua miniatura de Lego.':'to mount your Lego miniature.',
  'para Lego.':'frames for Lego.',
  'Clique no botÃ£o':'Click the button',
  ', abaixo e dÃª continuidade na experiÃªncia':', below and continue the experience',
  'ObservaÃ§Ã£o:':'Note:'
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

/* PATCH 12 â sel* intercept + missing display-name translations.
   Three confirmed issues (EN mode):
   1. Order summary BACKGROUND stays PT â selFundo stores PT 3rd arg
   2. Preview "Textura Rexy" stays PT â LEGO_FUNDOS_DB nome field
   3. Cart "Retirar na fabrica" stays PT â _fpFreteRender injects PT HTML
   Fix: intercept selFundo/selMoldura/selDisp at source + substr observer */

var _lang12=(localStorage.getItem('fp_lang')||'pt');

var _SELMAP12={
  'AcrÃ­lico Brilho com ImpressÃ£o UV':'Glossy Acrylic â UV',
  'Fibra de Carbono (Vinil)':'Carbon Fiber (Vinyl)',
  'Fosco':'Matte',
  'Fibra de Carbono':'Carbon Fiber',
  'Laca Preto':'Black Lacquer',
  'Die-cast â disponÃ­vel no mercado':'Die-cast â available on market',
  'A verificar pela equipe Funparts':'To be verified by Funparts team',
  'ImpressÃ£o 3D + Pintura Automotiva':'3D Printing + Automotive Paint'
};

var _SUBSTR12={
  'AcrÃ­lico Brilho com ImpressÃ£o UV':'Glossy Acrylic â UV',
  'Fosco':'Matte',
  'Textura Rexy':'Texture Rexy',
  'TEXTURA REXY':'TEXTURE REXY',
  'DegrÃª Linear':'Linear Gradient',
  'DegrÃª':'Gradient',
  'Abstrato':'Abstract',
  'Setas':'Arrows',
  'Listra Central':'Center Stripe',
  'Listras':'Stripes',
  'Retirar na fÃ¡brica':'Factory pickup',
  'Retirar na FÃ¡brica':'Factory pickup',
  'RETIRAR NA FÃBRICA':'FACTORY PICKUP',
  'Seu carrinho':'Your cart',
  'Fechar pedido':'Complete order',
  'Die-cast â disponÃ­vel no mercado':'Die-cast â available on market',
  'A verificar pela equipe Funparts':'To be verified by Funparts team',
  'ImpressÃ£o 3D + Pintura Automotiva':'3D Printing + Automotive Paint'
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

/* PATCH 13 â LED field, FINALIZAR PEDIDO button, shipping subtitle & GrÃ¡tis.
   Four confirmed PT strings in EN mode:
   1. Order summary LED field: "Com iluminaÃ§Ã£o LED" stays PT
      â Fix: intercept selLED (if present) + substr map
   2. Wizard step 8 bottom button: "FINALIZAR PEDIDO" stays PT
      â Root cause: existing _EN9 maps 'Finalizar pedido' but not the ALL-CAPS variant
      â Fix: add uppercase variant to substr map
   3. Shipping subtitle: "Combinar retirada" stays PT under FACTORY PICKUP
      â Fix: substr map + MutationObserver already running from patch12
   4. Shipping cost: "GrÃ¡tis" stays PT
      â Fix: substr map */

var _lang13 = (localStorage.getItem('fp_lang') || 'pt');

/* ââ MAP 1: sel* function 3rd-argument names ââ */
var _SELMAP13 = {
  /* selLED / selIluminacao */
  'Com iluminaÃ§Ã£o LED':'With LED lighting',
  'Sem iluminaÃ§Ã£o':'Without lighting',
  'Sem IluminaÃ§Ã£o':'Without lighting',
  'SEM ILUMINAÃÃO':'WITHOUT LIGHTING',
  'Com IluminaÃ§Ã£o LED':'With LED lighting',
  'COM ILUMINAÃÃO LED':'WITH LED LIGHTING'
};

/* ââ MAP 2: DOM text-node substr replacements ââ */
var _SUBSTR13 = {
  /* LED / lighting */
  'Com iluminaÃ§Ã£o LED':'With LED lighting',
  'Com IluminaÃ§Ã£o LED':'With LED lighting',
  'COM ILUMINAÃÃO LED':'WITH LED LIGHTING',
  'Sem iluminaÃ§Ã£o':'Without lighting',
  'Sem IluminaÃ§Ã£o':'Without lighting',
  'SEM ILUMINAÃÃO':'WITHOUT LIGHTING',
  /* Finalizar pedido â all case variants */
  'FINALIZAR PEDIDO':'COMPLETE ORDER',
  'Finalizar Pedido':'Complete Order',
  /* Shipping subtitle */
  'Combinar retirada':'Schedule pickup',
  'COMBINAR RETIRADA':'SCHEDULE PICKUP',
  /* Shipping cost */
  'GrÃ¡tis':'Free',
  'GRÃTIS':'FREE',
  'grÃ¡tis':'free'
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

/* ââ INTERCEPT sel* FUNCTIONS ââ */
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
  ['selLED','selIluminacao','selIluminaÃ§Ã£o'].forEach(_patchSelFn13);
}

/* ââ INTERCEPT FP_traduzTudo ââ */
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

/* ââ PERSISTENT MUTATION OBSERVER ââ */
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

/* ââ INITIAL LOAD ââ */
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

/* PATCH 14 â ESCOLHA O FRETE, CONTINUAR, FINALIZAR PEDIDO.
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

/* ââ INTERCEPT FP_traduzTudo ââ */
if(typeof window.FP_traduzTudo==='function'){
  var _p14=window.FP_traduzTudo;
  window.FP_traduzTudo=function(lang){
    _lang14=lang;
    _p14.call(this,lang);
    if(lang!=='pt'){
      var cl=lang;
      /* Aggressive retry schedule â React re-renders buttons late */
      [50,150,300,600,1000,1800,3000].forEach(function(ms){
        setTimeout(function(){if(_lang14===cl)_substrApply14(_SUBSTR14);},ms);
      });
    }
  };
}

/* ââ PERSISTENT MUTATION OBSERVER â 40ms debounce (tighter window) ââ */
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

/* ââ INITIAL LOAD ââ */
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


/* ━━ FIX: moldura 49×49cm — aspect-ratio quadrado ━━━━━━━━━━━━━━━━━━━━━━
   Produtos LEGO com dim:'49×49cm' recebem classe .dim4949, mas
   app_1.js aplica inline style aspect-ratio:53/83 (portrait).
   Patch: (1) CSS !important vence inline style; (2) corrige inline
   style via JS imediato + MutationObserver para mudanças dinâmicas.  */
(function(){
  // 1. Injetar regra CSS com !important — tem precedência sobre inline style
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
      // Corrigir também filhos com inline aspect-ratio errado
      el.querySelectorAll('[style]').forEach(function(child){
        if(child.style.aspectRatio && child.style.aspectRatio.replace(/\s/g,'') !== '1/1'){
          child.style.aspectRatio = '1/1';
        }
      });
    });
  }

  // 3. Patch selFrameSize — roda correção logo após a função original
  if(typeof window.selFrameSize === 'function'){
    var _origSFS49 = window.selFrameSize;
    window.selFrameSize = function(el, dim){
      var r = _origSFS49.apply(this, arguments);
      setTimeout(_fix49, 0);
      return r;
    };
  }

  // 4. Rodar imediatamente e em delays pós-renderização
  _fix49();
  [100, 300, 800, 1500, 3000].forEach(function(ms){
    setTimeout(_fix49, ms);
  });

  // 5. MutationObserver para mudanças dinâmicas (ex: troca de produto)
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
