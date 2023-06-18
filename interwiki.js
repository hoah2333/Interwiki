(function(){var I={showInterwiki:!1};function K(e,t){var r=document.getElementById("resizer-container"),i=document.createElement("iframe");return i.style.display="none",r.appendChild(i),t[0]!=="/"&&(t="/"+t),Le(function(){if(I.showInterwiki){var o=r.getBoundingClientRect().top;o&&(o+=1),i.src=e+"/common--javascript/resize-iframe.html?#"+o+t}},750)}function Le(e,t){var r=0;return function(){clearTimeout(r),r=setTimeout(e,t)}}var Ae="   query InterwikiQuery($url: URL!) {     page(url: $url) {       translations {         url       }       translationOf {         url         translations {           url         }       }     }   } ",Y=["https://api.crom.avn.sh/graphql","https://zh.xjo.ch/crom/graphql"];function $(e,t,r,i){Z(L(e.url+r),0,function(o){De(o,e,t,i)})}function L(e){if(e.indexOf(".wikidot.com")===-1)throw new Error("Crom requires wikidot.com branch URLs ("+e+")");return e.replace(/^https:/,"http:")}function De(e,t,r,i){function o(s){return s.url}var a=null,n=[];n=n.concat(e.translations.map(o)),e.translationOf&&(a=e.translationOf.url,n.push(a),n=n.concat(e.translationOf.translations.map(o))),n.forEach(function(s){var u=s.indexOf(L(t.url))===0;if(!u){var c=Object.keys(r).find(function(f){return s.indexOf(L(r[f].url))===0});if(!c){console.warn("Interwiki: unknown branch "+s);return}i(s,r[c].name,c,a===s)}})}function Z(e,t,r){var i=new XMLHttpRequest;i.open("POST",Y[t],!0),i.setRequestHeader("Content-Type","application/json"),i.addEventListener("readystatechange",function(){if(i.readyState===XMLHttpRequest.DONE)try{if(i.status===200){var o=JSON.parse(i.responseText);if(o.errors&&o.errors.length>0)throw new Error(o.errors);r(o.data.page)}else throw new Error(i.status)}catch(a){t++<Y.length?Z(e,t,r):(console.error("Interwiki: lookup failed for "+e),console.error(a))}}),i.send(JSON.stringify({query:Ae,variables:{url:e}}))}var Me=$;function ee(e,t,r){var i=e[t]||{},o=document.getElementsByClassName("side-block")[0];o.style.display="none";var a=document.querySelector(".heading p");a.innerText=i.head,Me(i,e,r,function(n,s,u,c){Pe(n,s,u,c),I.showInterwiki=!0})}function Pe(e,t,r,i){var o=document.getElementsByClassName("side-block")[0],a=Array.prototype.slice.call(o.getElementsByClassName("menu-item"));o.style.display="";var n=document.createElement("div");n.classList.add("menu-item"),i&&n.classList.add("original"),n.setAttribute("name",r);var s=document.createElement("img");s.setAttribute("src","//sigma9.scpwikicn.com/cn/img/default.png"),s.setAttribute("alt","default.png"),s.classList.add("image"),n.appendChild(s);var u=document.createElement("a");u.setAttribute("href",e),u.setAttribute("target","_parent"),u.innerText=t,n.appendChild(u),o.appendChild(n),a.some(function(c){if(c.getAttribute("name")>r)return o.insertBefore(n,c),!0})}function te(e,t){return function(i){var o=l(i,"type")||"default",a=l(i,"priority"),n=Number(a),s=l(i,"override")||"0",u=Boolean(Number(s));if(isNaN(n)){console.error("Interwiki: rejected style with priority"+a);return}if(o==t){var c=l(i,"theme");c&&A(n,_e(e,c),u);var f=l(i,"css");f&&qe(n,f,u)}}}function qe(e,t,r){var i=Array.prototype.slice.call(document.head.querySelectorAll("style.custom-style"));if(!i.some(ie(e,t))){if(r){var o=i.find(oe(e));if(o){console.log("Interwiki: style at priority "+e+" is being overrided."),o.innerText=t;return}}var a=document.createElement("style");a.innerText=t,re(e,a)}}function A(e,t,r){var i=Array.prototype.slice.call(document.head.querySelectorAll("link.custom-style"));if(!i.some(ie(e,t))){if(r){var o=i.find(oe(e));if(o){console.log("Interwiki: stylesheet "+o.href+" is overrided by "+t+" at priority "+e+"."),o.href=t;return}}var a=document.createElement("link");a.rel="stylesheet",a.href=t,re(e,a)}}function re(e,t){t.classList.add("custom-style"),t.dataset.priority=e;var r=Array.prototype.slice.call(document.head.querySelectorAll("link.custom-style, style.custom-style")),i=t.tagName,o=r.some(function(a){var n=Number(a.dataset.priority),s=a.tagName;if(e>n)return!1;if(n===e){if(s==="LINK"&&i==="STYLE")return!1;s===i&&console.error("Interwiki: encountered two "+(s==="LINK"?"themes":"CSS styles")+" with the same priority ("+n+") and override is set to false - result may not be as expected")}return document.head.insertBefore(t,a),!0});o||document.head.appendChild(t)}function ie(e,t){var r=function(i){return Number(i.getAttribute("data-priority"))!==e?!1:i.tagName==="LINK"?i.getAttribute("href")===t:i.tagName==="STYLE"?i.innerText===t:!1};return r}function oe(e){var t=function(r){return Number(r.getAttribute("data-priority"))===e};return t}function _e(e,t){if(t.indexOf("http")===0||t.indexOf("//")===0)return t;if(!e)return console.error("Interwiki: could not resolve relative fullname ("+t+") for unconfigured site. Consider using a full URL instead."),"";if(t.indexOf("/")===-1)return e+"/local--code/"+t+"/1";var r=t.split("/");return r.length>=3&&r[1]==="code"?e+"/local--code/"+r[0]+"/"+r[2]:(console.error("Interwiki: unknown theme location:"+t),"")}var ne={cn:{name:"\u4E2D\u6587",head:"\u5176\u4ED6\u8BED\u8A00",url:"https://scp-wiki-cn.wikidot.com/",id:"530812",category:""},cs:{name:"\u010Cesky",head:"V jin\xFDch jazyc\xEDch",url:"https://scp-cs.wikidot.com/",id:"2060442",category:""},en:{name:"English",head:"In other languages",url:"https://scp-wiki.wikidot.com/",id:"66711",category:""},fr:{name:"Fran\xE7ais",head:"Dans d\u2019autres langues",url:"https://fondationscp.wikidot.com/",id:"464696",category:""},de:{name:"Deutsch",head:"In anderen Sprachen",url:"https://scp-wiki-de.wikidot.com/",id:"1269857",category:""},int:{name:"International",head:"Languages",url:"https://scp-int.wikidot.com/",id:"1427610",category:""},it:{name:"Italiano",head:"In altre lingue",url:"https://fondazionescp.wikidot.com/",id:"530167",category:""},jp:{name:"\u65E5\u672C\u8A9E",head:"\u4ED6\u8A00\u8A9E\u7248",url:"https://scp-jp.wikidot.com/",id:"578002",category:""},ko:{name:"\uD55C\uAD6D\uC5B4",head:"\uB2E4\uB978 \uC5B8\uC5B4",url:"http://scpko.wikidot.com/",id:"486864",category:""},pl:{name:"Polski",head:"W innych j\u0119zykach",url:"http://scp-pl.wikidot.com/",id:"647733",category:""},ptbr:{name:"Portugu\xEAs",head:"Em outros idiomas",url:"https://scp-pt-br.wikidot.com/",id:"783633",category:""},ru:{name:"\u0420\u0443\u0441\u0441\u043A\u0438\u0439",head:"\u041D\u0430 \u0434\u0440\u0443\u0433\u0438\u0445 \u044F\u0437\u044B\u043A\u0430\u0445",url:"http://scp-ru.wikidot.com/",id:"169125",category:""},es:{name:"Espa\xF1ol",head:"En otros idiomas",url:"http://lafundacionscp.wikidot.com/",id:"560484",category:""},th:{name:"\u0E20\u0E32\u0E29\u0E32\u0E44\u0E17\u0E22",head:"\u0E20\u0E32\u0E29\u0E32\u0E2D\u0E37\u0E48\u0E19",url:"https://scp-th.wikidot.com/",id:"547203",category:""},ua:{name:"\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430",head:"\u0406\u043D\u0448\u0438\u043C\u0438 \u043C\u043E\u0432\u0430\u043C\u0438",url:"https://scp-ukrainian.wikidot.com/",id:"1398197",category:""},vn:{name:"Ti\u1EBFng Vi\u1EC7t",head:"Ng\xF4n ng\u1EEF",url:"https://scp-vn.wikidot.com/",id:"836589",category:""}};var ae={cn:{name:"\u4E2D\u6587",head:"\u5176\u4ED6\u8BED\u8A00",url:"https://scp-wiki-cn.wikidot.com/",id:"530812",category:"wanderers:"},cs:{name:"\u010Ce\u0161tina",head:"V jin\xFDch jazyc\xEDch",url:"https://wanderers-library-cs.wikidot.com/",id:"4600566",category:""},en:{name:"English",head:"Languages",url:"https://wanderers-library.wikidot.com/",id:"146034",category:""},fr:{name:"Fran\xE7ais",head:"Dans d\u2019autres langues",url:"https://fondationscp.wikidot.com/",id:"464696",category:"vagabonds:"},jp:{name:"\u65E5\u672C\u8A9E",head:"\u4ED6\u8A00\u8A9E\u7248",url:"https://wanderers-library-jp.wikidot.com/",id:"4600658",category:""},ko:{name:"\uD55C\uAD6D\uC5B4",head:"\uB2E4\uB978 \uC5B8\uC5B4",url:"https://wanderers-library-ko.wikidot.com/",id:"621849",category:""},pl:{name:"Polski",head:"W innych j\u0119zykach",url:"https://wanderers-library-pl.wikidot.com/",id:"4593099",category:""}};var se={cn:{name:"\u4E2D\u6587",head:"\u5176\u4ED6\u8BED\u8A00",url:"http://backrooms-wiki-cn.wikidot.com/",id:"4716348",category:""},en:{name:"English",head:"Languages",url:"http://backrooms-wiki.wikidot.com/",id:"4431268",category:""},es:{name:"Espa\xF1ol",head:"En otros idiomas",url:"http://es-backrooms-wiki.wikidot.com/",id:"4745515",category:""},fr:{name:"Fran\xE7ais",head:"Dans d\u2019autres langues",url:"http://fr-backrooms-wiki.wikidot.com/",id:"4710749",category:""},jp:{name:"\u65E5\u672C\u8A9E",head:"\u4ED6\u8A00\u8A9E\u7248",url:"http://japan-backrooms-wiki.wikidot.com/",id:"4864894",category:""},pl:{name:"Polski",head:"W innych j\u0119zykach",url:"http://pl-backrooms-wiki.wikidot.com/",id:"4761123",category:""},ptbr:{name:"Portugu\xEAs",head:"Em outros idiomas",url:"http://pt-br-backrooms-wiki.wikidot.com/",id:"4714912",category:""},ru:{name:"\u0420\u0443\u0441\u0441\u043A\u0438\u0439",head:"\u041D\u0430 \u0434\u0440\u0443\u0433\u0438\u0445 \u044F\u0437\u044B\u043A\u0430\u0445",url:"http://ru-backrooms-wiki.wikidot.com/",id:"4548260",category:""},vn:{name:"Ti\u1EBFng Vi\u1EC7t",head:"Ng\xF4n ng\u1EEF",url:"http://backrooms-vn.wikidot.com/",id:"4748367",category:""}};var d=[];var ce=function(){return d.some(function(e){return e.activeTargets.length>0})};var ue=function(){return d.some(function(e){return e.skippedTargets.length>0})};var de="ResizeObserver loop completed with undelivered notifications.",le=function(){var e;typeof ErrorEvent=="function"?e=new ErrorEvent("error",{message:de}):(e=document.createEvent("Event"),e.initEvent("error",!1,!1),e.message=de),window.dispatchEvent(e)};var h;(function(e){e.BORDER_BOX="border-box",e.CONTENT_BOX="content-box",e.DEVICE_PIXEL_CONTENT_BOX="device-pixel-content-box"})(h||(h={}));var p=function(e){return Object.freeze(e)};var D=function(){function e(t,r){this.inlineSize=t,this.blockSize=r,p(this)}return e}();var M=function(){function e(t,r,i,o){return this.x=t,this.y=r,this.width=i,this.height=o,this.top=this.y,this.left=this.x,this.bottom=this.top+this.height,this.right=this.left+this.width,p(this)}return e.prototype.toJSON=function(){var t=this,r=t.x,i=t.y,o=t.top,a=t.right,n=t.bottom,s=t.left,u=t.width,c=t.height;return{x:r,y:i,top:o,right:a,bottom:n,left:s,width:u,height:c}},e.fromRect=function(t){return new e(t.x,t.y,t.width,t.height)},e}();var y=function(e){return e instanceof SVGElement&&"getBBox"in e},z=function(e){if(y(e)){var t=e.getBBox(),r=t.width,i=t.height;return!r&&!i}var o=e,a=o.offsetWidth,n=o.offsetHeight;return!(a||n||e.getClientRects().length)},P=function(e){var t;if(e instanceof Element)return!0;var r=(t=e==null?void 0:e.ownerDocument)===null||t===void 0?void 0:t.defaultView;return!!(r&&e instanceof r.Element)},pe=function(e){switch(e.tagName){case"INPUT":if(e.type!=="image")break;case"VIDEO":case"AUDIO":case"EMBED":case"OBJECT":case"CANVAS":case"IFRAME":case"IMG":return!0}return!1};var m=typeof window!="undefined"?window:{};var O=new WeakMap,fe=/auto|scroll/,Fe=/^tb|vertical/,We=/msie|trident/i.test(m.navigator&&m.navigator.userAgent),v=function(e){return parseFloat(e||"0")},g=function(e,t,r){return e===void 0&&(e=0),t===void 0&&(t=0),r===void 0&&(r=!1),new D((r?t:e)||0,(r?e:t)||0)},ve=p({devicePixelContentBoxSize:g(),borderBoxSize:g(),contentBoxSize:g(),contentRect:new M(0,0,0,0)}),q=function(e,t){if(t===void 0&&(t=!1),O.has(e)&&!t)return O.get(e);if(z(e))return O.set(e,ve),ve;var r=getComputedStyle(e),i=y(e)&&e.ownerSVGElement&&e.getBBox(),o=!We&&r.boxSizing==="border-box",a=Fe.test(r.writingMode||""),n=!i&&fe.test(r.overflowY||""),s=!i&&fe.test(r.overflowX||""),u=i?0:v(r.paddingTop),c=i?0:v(r.paddingRight),f=i?0:v(r.paddingBottom),b=i?0:v(r.paddingLeft),Ee=i?0:v(r.borderTopWidth),Re=i?0:v(r.borderRightWidth),Se=i?0:v(r.borderBottomWidth),Te=i?0:v(r.borderLeftWidth),X=b+c,G=u+f,C=Te+Re,N=Ee+Se,U=s?e.offsetHeight-N-e.clientHeight:0,J=n?e.offsetWidth-C-e.clientWidth:0,Be=o?X+C:0,Ce=o?G+N:0,k=i?i.width:v(r.width)-Be-J,x=i?i.height:v(r.height)-Ce-U,Ne=k+X+J+C,Ie=x+G+U+N,Q=p({devicePixelContentBoxSize:g(Math.round(k*devicePixelRatio),Math.round(x*devicePixelRatio),a),borderBoxSize:g(Ne,Ie,a),contentBoxSize:g(k,x,a),contentRect:new M(b,u,k,x)});return O.set(e,Q),Q},E=function(e,t,r){var i=q(e,r),o=i.borderBoxSize,a=i.contentBoxSize,n=i.devicePixelContentBoxSize;switch(t){case h.DEVICE_PIXEL_CONTENT_BOX:return n;case h.BORDER_BOX:return o;default:return a}};var _=function(){function e(t){var r=q(t);this.target=t,this.contentRect=r.contentRect,this.borderBoxSize=p([r.borderBoxSize]),this.contentBoxSize=p([r.contentBoxSize]),this.devicePixelContentBoxSize=p([r.devicePixelContentBoxSize])}return e}();var R=function(e){if(z(e))return 1/0;for(var t=0,r=e.parentNode;r;)t+=1,r=r.parentNode;return t};var he=function(){var e=1/0,t=[];d.forEach(function(n){if(n.activeTargets.length!==0){var s=[];n.activeTargets.forEach(function(c){var f=new _(c.target),b=R(c.target);s.push(f),c.lastReportedSize=E(c.target,c.observedBox),b<e&&(e=b)}),t.push(function(){n.callback.call(n.observer,s,n.observer)}),n.activeTargets.splice(0,n.activeTargets.length)}});for(var r=0,i=t;r<i.length;r++){var o=i[r];o()}return e};var F=function(e){d.forEach(function(r){r.activeTargets.splice(0,r.activeTargets.length),r.skippedTargets.splice(0,r.skippedTargets.length),r.observationTargets.forEach(function(o){o.isActive()&&(R(o.target)>e?r.activeTargets.push(o):r.skippedTargets.push(o))})})};var me=function(){var e=0;for(F(e);ce();)e=he(),F(e);return ue()&&le(),e>0};var W,ge=[],je=function(){return ge.splice(0).forEach(function(e){return e()})},be=function(e){if(!W){var t=0,r=document.createTextNode(""),i={characterData:!0};new MutationObserver(function(){return je()}).observe(r,i),W=function(){r.textContent="".concat(t?t--:t++)}}ge.push(e),W()};var ye=function(e){be(function(){requestAnimationFrame(e)})};var S=0,He=function(){return!!S},Ve=250,Xe={attributes:!0,characterData:!0,childList:!0,subtree:!0},we=["resize","load","transitionend","animationend","animationstart","animationiteration","keyup","keydown","mouseup","mousedown","mouseover","mouseout","blur","focus"],ke=function(e){return e===void 0&&(e=0),Date.now()+e},j=!1,Ge=function(){function e(){var t=this;this.stopped=!0,this.listener=function(){return t.schedule()}}return e.prototype.run=function(t){var r=this;if(t===void 0&&(t=Ve),!j){j=!0;var i=ke(t);ye(function(){var o=!1;try{o=me()}finally{if(j=!1,t=i-ke(),!He())return;o?r.run(1e3):t>0?r.run(t):r.start()}})}},e.prototype.schedule=function(){this.stop(),this.run()},e.prototype.observe=function(){var t=this,r=function(){return t.observer&&t.observer.observe(document.body,Xe)};document.body?r():m.addEventListener("DOMContentLoaded",r)},e.prototype.start=function(){var t=this;this.stopped&&(this.stopped=!1,this.observer=new MutationObserver(this.listener),this.observe(),we.forEach(function(r){return m.addEventListener(r,t.listener,!0)}))},e.prototype.stop=function(){var t=this;this.stopped||(this.observer&&this.observer.disconnect(),we.forEach(function(r){return m.removeEventListener(r,t.listener,!0)}),this.stopped=!0)},e}(),T=new Ge,H=function(e){!S&&e>0&&T.start(),S+=e,!S&&T.stop()};var Ue=function(e){return!y(e)&&!pe(e)&&getComputedStyle(e).display==="inline"},xe=function(){function e(t,r){this.target=t,this.observedBox=r||h.CONTENT_BOX,this.lastReportedSize={inlineSize:0,blockSize:0}}return e.prototype.isActive=function(){var t=E(this.target,this.observedBox,!0);return Ue(this.target)&&(this.lastReportedSize=t),this.lastReportedSize.inlineSize!==t.inlineSize||this.lastReportedSize.blockSize!==t.blockSize},e}();var ze=function(){function e(t,r){this.activeTargets=[],this.skippedTargets=[],this.observationTargets=[],this.observer=t,this.callback=r}return e}();var B=new WeakMap,Oe=function(e,t){for(var r=0;r<e.length;r+=1)if(e[r].target===t)return r;return-1},w=function(){function e(){}return e.connect=function(t,r){var i=new ze(t,r);B.set(t,i)},e.observe=function(t,r,i){var o=B.get(t),a=o.observationTargets.length===0;Oe(o.observationTargets,r)<0&&(a&&d.push(o),o.observationTargets.push(new xe(r,i&&i.box)),H(1),T.schedule())},e.unobserve=function(t,r){var i=B.get(t),o=Oe(i.observationTargets,r),a=i.observationTargets.length===1;o>=0&&(a&&d.splice(d.indexOf(i),1),i.observationTargets.splice(o,1),H(-1))},e.disconnect=function(t){var r=this,i=B.get(t);i.observationTargets.slice().forEach(function(o){return r.unobserve(t,o.target)}),i.activeTargets.splice(0,i.activeTargets.length)},e}();var V=function(){function e(t){if(arguments.length===0)throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");if(typeof t!="function")throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");w.connect(this,t)}return e.prototype.observe=function(t,r){if(arguments.length===0)throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");if(!P(t))throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");w.observe(this,t,r)},e.prototype.unobserve=function(t){if(arguments.length===0)throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");if(!P(t))throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");w.unobserve(this,t)},e.prototype.disconnect=function(){w.disconnect(this)},e.toString=function(){return"function ResizeObserver () { [polyfill code] }"},e}();addEventListener("DOMContentLoaded",function(){var e=l(location.search,"community"),t=l(location.search,"pagename"),r=l(location.search,"lang"),i=l(location.search,"type"),o=l(location.search,"preventWikidotBaseStyle")||"true";Qe(e,t,r,i,o),window.isInterwikiFrame=!0});function l(e,t){e.indexOf("?")===0&&(e=e.substring(1));var r=e.split("&");r.reverse();var i=r.find(function(o){return o.indexOf(t+"=")===0});return i==null?"":decodeURIComponent(i.substring(t.length+1))}function Je(){Array.prototype.slice.call(parent).forEach(function(e){try{e.isStyleFrame&&window.requestStyleChange(e.location.search)}catch(t){if(!(t instanceof DOMException))throw t}})}function Qe(e,t,r,i,o){t=t.replace(/^_default:/,""),t=t.replace(/[^\w\-:]+/g,"-").toLowerCase(),t=t.replace(/^_/,"#").replace(/_/g,"-").replace(/#/,"_"),t=t.replace(/^-+|-+$/g,"");var a={wl:ae,scp:ne,br:se}[e]||{},n=a[r]||{},s=document.referrer,u=location.href.replace(/^.*\//,"/"),c=K(s,u),f=new V(c);f.observe(document.documentElement),window.requestStyleChange=te(n.url||"",i||"default"),o!=="true"&&A(-1,"//d3g0gp89917ko0.cloudfront.net/v--3e3a6f7dbcc9/common--theme/base/css/style.css",!1),Je(),ee(a,r,t)}})();
//# sourceMappingURL=interwiki.js.map
