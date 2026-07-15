
(function(){
var _cpCB=null,_cpH=0,_cpS=1,_cpV=1,_cpDG=false,_cpDH=false;
function h2r(h){h=h.replace('#','');if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];return{r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16)};}
function r2h(r,g,b){return'#'+[r,g,b].map(x=>Math.round(Math.max(0,Math.min(255,x))).toString(16).padStart(2,'0')).join('');}
function r2hsv(r,g,b){r/=255;g/=255;b/=255;var mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn,h=0,s=mx?d/mx:0,v=mx;if(d){if(mx===r)h=(g-b)/d+(g<b?6:0);else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;}return{h,s,v};}
function h2rgb(h,s,v){var i=Math.floor(h/60)%6,f=h/60-Math.floor(h/60),p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s),r,g,b;switch(i){case 0:r=v;g=t;b=p;break;case 1:r=q;g=v;b=p;break;case 2:r=p;g=v;b=t;break;case 3:r=p;g=q;b=v;break;case 4:r=t;g=p;b=v;break;case 5:r=v;g=p;b=q;break;}return{r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)};}
function cpHex(){var rgb=h2rgb(_cpH,_cpS,_cpV);return r2h(rgb.r,rgb.g,rgb.b);}
function cpDG(){var c=document.getElementById('cpGrad');if(!c)return;var ctx=c.getContext('2d'),W=c.width,H=c.height;ctx.fillStyle='hsl('+_cpH+',100%,50%)';ctx.fillRect(0,0,W,H);var wg=ctx.createLinearGradient(0,0,W,0);wg.addColorStop(0,'rgba(255,255,255,1)');wg.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=wg;ctx.fillRect(0,0,W,H);var bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'rgba(0,0,0,0)');bg.addColorStop(1,'rgba(0,0,0,1)');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);}
function cpDH(){var c=document.getElementById('cpHueBar');if(!c)return;var ctx=c.getContext('2d'),W=c.width,H=c.height;var g=ctx.createLinearGradient(0,0,0,H);for(var i=0;i<=6;i++)g.addColorStop(i/6,'hsl('+(i*60)+',100%,50%)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);var y=(_cpH/360)*H;ctx.strokeStyle='rgba(255,255,255,0.9)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
function cpUI(){var hex=cpHex();var np=document.getElementById('cpNewPrev');if(np)np.style.background=hex;var rgb=h2r(hex);var rr=document.getElementById('cpR'),gg=document.getElementById('cpG'),bb=document.getElementById('cpB');if(rr)rr.value=rgb.r;if(gg)gg.value=rgb.g;if(bb)bb.value=rgb.b;var hi=document.getElementById('cpHexInp');if(hi)hi.value=hex.replace('#','').toUpperCase();var gc=document.getElementById('cpGradCur');if(gc){var cv=document.getElementById('cpGrad');if(cv){gc.style.left=(_cpS*cv.offsetWidth)+'px';gc.style.top=((1-_cpV)*cv.offsetHeight)+'px';}}cpDG();cpDH();}
window.openColorPicker=function(cur,cb,anchor){_cpCB=cb;var rgb=h2r(cur||'#ffffff');var hsv=r2hsv(rgb.r,rgb.g,rgb.b);_cpH=hsv.h;_cpS=hsv.s;_cpV=hsv.v;var cp=document.getElementById('cpCurPrev');if(cp)cp.style.background=cur||'#ffffff';var box=document.getElementById('cpickerBox');var modal=document.getElementById('cpicker');modal.style.display='block';if(anchor){var rct=anchor.getBoundingClientRect();var PH=370,PW=316,MG=8;var spaceBelow=window.innerHeight-rct.bottom-MG;var spaceAbove=rct.top-MG;var top,left;if(spaceBelow>=PH||spaceBelow>=spaceAbove){top=Math.min(rct.bottom+MG,window.innerHeight-PH-MG);}else{top=Math.max(MG,rct.top-PH-MG);}top=Math.max(MG,top);left=Math.max(MG,Math.min(rct.left,window.innerWidth-PW-MG));box.style.top=top+'px';box.style.left=left+'px';box.style.transform='none';}else{box.style.top='50%';box.style.left='50%';box.style.transform='translate(-50%,-50%)';}setTimeout(cpUI,20);};
window.closePicker=function(){document.getElementById('cpicker').style.display='none';};
window.confirmPicker=function(){if(_cpCB)_cpCB(cpHex());closePicker();};
window.cpFromHex=function(){var h=document.getElementById('cpHexInp').value.trim();if(/^[0-9a-fA-F]{6}$/.test(h)){var rgb=h2r('#'+h);var hsv=r2hsv(rgb.r,rgb.g,rgb.b);_cpH=hsv.h;_cpS=hsv.s;_cpV=hsv.v;cpUI();}};
window.cpFromRGB=function(){var r=Math.min(255,Math.max(0,parseInt(document.getElementById('cpR').value)||0));var g=Math.min(255,Math.max(0,parseInt(document.getElementById('cpG').value)||0));var b=Math.min(255,Math.max(0,parseInt(document.getElementById('cpB').value)||0));var hsv=r2hsv(r,g,b);_cpH=hsv.h;_cpS=hsv.s;_cpV=hsv.v;cpUI();};
function cpGP(e){var c=document.getElementById('cpGrad');if(!c)return;var rct=c.getBoundingClientRect();_cpS=Math.max(0,Math.min(1,(e.clientX-rct.left)/rct.width));_cpV=1-Math.max(0,Math.min(1,(e.clientY-rct.top)/rct.height));cpUI();}
function cpHP(e){var c=document.getElementById('cpHueBar');if(!c)return;var rct=c.getBoundingClientRect();_cpH=Math.max(0,Math.min(359,(e.clientY-rct.top)/rct.height*360));cpUI();}
function cpBind(){var grad=document.getElementById('cpGrad');var hue=document.getElementById('cpHueBar');if(!grad||!hue){return setTimeout(cpBind,100);}
grad.addEventListener('mousedown',function(e){_cpDG=true;cpGP(e);e.preventDefault();});
grad.addEventListener('touchstart',function(e){_cpDG=true;cpGP(e.touches[0]);e.preventDefault();},{passive:false});
hue.addEventListener('mousedown',function(e){_cpDH=true;cpHP(e);e.preventDefault();});
hue.addEventListener('touchstart',function(e){_cpDH=true;cpHP(e.touches[0]);e.preventDefault();},{passive:false});
document.addEventListener('mousemove',function(e){if(_cpDG)cpGP(e);if(_cpDH)cpHP(e);});
document.addEventListener('mouseup',function(){_cpDG=false;_cpDH=false;});
document.addEventListener('touchmove',function(e){if(_cpDG||_cpDH){if(_cpDG)cpGP(e.touches[0]);if(_cpDH)cpHP(e.touches[0]);e.preventDefault();}},{passive:false});
document.addEventListener('touchend',function(){_cpDG=false;_cpDH=false;});}
cpBind();
})();
