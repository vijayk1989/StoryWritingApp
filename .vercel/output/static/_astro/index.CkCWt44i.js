import{r as s,y as A,R as Le}from"./index.BCPtUIm2.js";import{j as x}from"./jsx-runtime.B-tYHWOS.js";import{u as F,d as ee}from"./button.DSwAMVRZ.js";import{r as Ae,R as Te}from"./index.D1eIsul2.js";function Jt(e,t){const n=s.createContext(t),r=c=>{const{children:i,...a}=c,v=s.useMemo(()=>a,Object.values(a));return x.jsx(n.Provider,{value:v,children:i})};r.displayName=e+"Provider";function o(c){const i=s.useContext(n);if(i)return i;if(t!==void 0)return t;throw new Error(`\`${c}\` must be used within \`${e}\``)}return[r,o]}function en(e,t=[]){let n=[];function r(c,i){const a=s.createContext(i),v=n.length;n=[...n,i];const l=d=>{const{scope:h,children:p,...E}=d,u=h?.[e]?.[v]||a,f=s.useMemo(()=>E,Object.values(E));return x.jsx(u.Provider,{value:f,children:p})};l.displayName=c+"Provider";function m(d,h){const p=h?.[e]?.[v]||a,E=s.useContext(p);if(E)return E;if(i!==void 0)return i;throw new Error(`\`${d}\` must be used within \`${c}\``)}return[l,m]}const o=()=>{const c=n.map(i=>s.createContext(i));return function(a){const v=a?.[e]||c;return s.useMemo(()=>({[`__scope${e}`]:{...a,[e]:v}}),[a,v])}};return o.scopeName=e,[r,Me(o,...t)]}function Me(...e){const t=e[0];if(e.length===1)return t;const n=()=>{const r=e.map(o=>({useScope:o(),scopeName:o.scopeName}));return function(c){const i=r.reduce((a,{useScope:v,scopeName:l})=>{const d=v(c)[`__scope${l}`];return{...a,...d}},{});return s.useMemo(()=>({[`__scope${t.scopeName}`]:i}),[i])}};return n.scopeName=t.scopeName,n}function ke(e,t=[]){let n=[];function r(c,i){const a=s.createContext(i),v=n.length;n=[...n,i];function l(d){const{scope:h,children:p,...E}=d,u=h?.[e][v]||a,f=s.useMemo(()=>E,Object.values(E));return x.jsx(u.Provider,{value:f,children:p})}function m(d,h){const p=h?.[e][v]||a,E=s.useContext(p);if(E)return E;if(i!==void 0)return i;throw new Error(`\`${d}\` must be used within \`${c}\``)}return l.displayName=c+"Provider",[l,m]}const o=()=>{const c=n.map(i=>s.createContext(i));return function(a){const v=a?.[e]||c;return s.useMemo(()=>({[`__scope${e}`]:{...a,[e]:v}}),[a,v])}};return o.scopeName=e,[r,Ne(o,...t)]}function Ne(...e){const t=e[0];if(e.length===1)return t;const n=()=>{const r=e.map(o=>({useScope:o(),scopeName:o.scopeName}));return function(c){const i=r.reduce((a,{useScope:v,scopeName:l})=>{const d=v(c)[`__scope${l}`];return{...a,...d}},{});return s.useMemo(()=>({[`__scope${t.scopeName}`]:i}),[i])}};return n.scopeName=t.scopeName,n}function tn(e){const t=e+"CollectionProvider",[n,r]=ke(t),[o,c]=n(t,{collectionRef:{current:null},itemMap:new Map}),i=p=>{const{scope:E,children:u}=p,f=A.useRef(null),y=A.useRef(new Map).current;return x.jsx(o,{scope:E,itemMap:y,collectionRef:f,children:u})};i.displayName=t;const a=e+"CollectionSlot",v=A.forwardRef((p,E)=>{const{scope:u,children:f}=p,y=c(a,u),b=F(E,y.collectionRef);return x.jsx(ee,{ref:b,children:f})});v.displayName=a;const l=e+"CollectionItemSlot",m="data-radix-collection-item",d=A.forwardRef((p,E)=>{const{scope:u,children:f,...y}=p,b=A.useRef(null),C=F(E,b),g=c(l,u);return A.useEffect(()=>(g.itemMap.set(b,{ref:b,...y}),()=>void g.itemMap.delete(b))),x.jsx(ee,{[m]:"",ref:C,children:f})});d.displayName=l;function h(p){const E=c(e+"CollectionConsumer",p);return A.useCallback(()=>{const f=E.collectionRef.current;if(!f)return[];const y=Array.from(f.querySelectorAll(`[${m}]`));return Array.from(E.itemMap.values()).sort((g,w)=>y.indexOf(g.ref.current)-y.indexOf(w.ref.current))},[E.collectionRef,E.itemMap])}return[{Provider:i,Slot:v,ItemSlot:d},h,r]}function X(e,t,{checkForDefaultPrevented:n=!0}={}){return function(o){if(e?.(o),n===!1||!o.defaultPrevented)return t?.(o)}}function T(e){const t=s.useRef(e);return s.useEffect(()=>{t.current=e}),s.useMemo(()=>(...n)=>t.current?.(...n),[])}function nn({prop:e,defaultProp:t,onChange:n=()=>{}}){const[r,o]=De({defaultProp:t,onChange:n}),c=e!==void 0,i=c?e:r,a=T(n),v=s.useCallback(l=>{if(c){const d=typeof l=="function"?l(e):l;d!==e&&a(d)}else o(l)},[c,e,o,a]);return[i,v]}function De({defaultProp:e,onChange:t}){const n=s.useState(e),[r]=n,o=s.useRef(r),c=T(t);return s.useEffect(()=>{o.current!==r&&(c(r),o.current=r)},[r,o,c]),n}var Ie=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","span","svg","ul"],H=Ie.reduce((e,t)=>{const n=s.forwardRef((r,o)=>{const{asChild:c,...i}=r,a=c?ee:t;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),x.jsx(a,{...i,ref:o})});return n.displayName=`Primitive.${t}`,{...e,[t]:n}},{});function Fe(e,t){e&&Ae.flushSync(()=>e.dispatchEvent(t))}var he=globalThis?.document?s.useLayoutEffect:()=>{},_e=Le.useId||(()=>{}),Be=0;function rn(e){const[t,n]=s.useState(_e());return he(()=>{n(r=>r??String(Be++))},[e]),t?`radix-${t}`:""}var We=s.createContext(void 0);function on(e){const t=s.useContext(We);return e||t||"ltr"}/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const je=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),pe=(...e)=>e.filter((t,n,r)=>!!t&&t.trim()!==""&&r.indexOf(t)===n).join(" ").trim();/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var $e={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ue=s.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:r,className:o="",children:c,iconNode:i,...a},v)=>s.createElement("svg",{ref:v,...$e,width:t,height:t,stroke:e,strokeWidth:r?Number(n)*24/Number(t):n,className:pe("lucide",o),...a},[...i.map(([l,m])=>s.createElement(l,m)),...Array.isArray(c)?c:[c]]));/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const He=(e,t)=>{const n=s.forwardRef(({className:r,...o},c)=>s.createElement(Ue,{ref:c,iconNode:t,className:pe(`lucide-${je(e)}`,r),...o}));return n.displayName=`${e}`,n};/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const an=He("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);function Ke(e,t=globalThis?.document){const n=T(e);s.useEffect(()=>{const r=o=>{o.key==="Escape"&&n(o)};return t.addEventListener("keydown",r,{capture:!0}),()=>t.removeEventListener("keydown",r,{capture:!0})},[n,t])}var Ve="DismissableLayer",te="dismissableLayer.update",Xe="dismissableLayer.pointerDownOutside",Ye="dismissableLayer.focusOutside",re,ye=s.createContext({layers:new Set,layersWithOutsidePointerEventsDisabled:new Set,branches:new Set}),ze=s.forwardRef((e,t)=>{const{disableOutsidePointerEvents:n=!1,onEscapeKeyDown:r,onPointerDownOutside:o,onFocusOutside:c,onInteractOutside:i,onDismiss:a,...v}=e,l=s.useContext(ye),[m,d]=s.useState(null),h=m?.ownerDocument??globalThis?.document,[,p]=s.useState({}),E=F(t,S=>d(S)),u=Array.from(l.layers),[f]=[...l.layersWithOutsidePointerEventsDisabled].slice(-1),y=u.indexOf(f),b=m?u.indexOf(m):-1,C=l.layersWithOutsidePointerEventsDisabled.size>0,g=b>=y,w=Ge(S=>{const O=S.target,I=[...l.branches].some(V=>V.contains(O));!g||I||(o?.(S),i?.(S),S.defaultPrevented||a?.())},h),R=Qe(S=>{const O=S.target;[...l.branches].some(V=>V.contains(O))||(c?.(S),i?.(S),S.defaultPrevented||a?.())},h);return Ke(S=>{b===l.layers.size-1&&(r?.(S),!S.defaultPrevented&&a&&(S.preventDefault(),a()))},h),s.useEffect(()=>{if(m)return n&&(l.layersWithOutsidePointerEventsDisabled.size===0&&(re=h.body.style.pointerEvents,h.body.style.pointerEvents="none"),l.layersWithOutsidePointerEventsDisabled.add(m)),l.layers.add(m),oe(),()=>{n&&l.layersWithOutsidePointerEventsDisabled.size===1&&(h.body.style.pointerEvents=re)}},[m,h,n,l]),s.useEffect(()=>()=>{m&&(l.layers.delete(m),l.layersWithOutsidePointerEventsDisabled.delete(m),oe())},[m,l]),s.useEffect(()=>{const S=()=>p({});return document.addEventListener(te,S),()=>document.removeEventListener(te,S)},[]),x.jsx(H.div,{...v,ref:E,style:{pointerEvents:C?g?"auto":"none":void 0,...e.style},onFocusCapture:X(e.onFocusCapture,R.onFocusCapture),onBlurCapture:X(e.onBlurCapture,R.onBlurCapture),onPointerDownCapture:X(e.onPointerDownCapture,w.onPointerDownCapture)})});ze.displayName=Ve;var Ze="DismissableLayerBranch",qe=s.forwardRef((e,t)=>{const n=s.useContext(ye),r=s.useRef(null),o=F(t,r);return s.useEffect(()=>{const c=r.current;if(c)return n.branches.add(c),()=>{n.branches.delete(c)}},[n.branches]),x.jsx(H.div,{...e,ref:o})});qe.displayName=Ze;function Ge(e,t=globalThis?.document){const n=T(e),r=s.useRef(!1),o=s.useRef(()=>{});return s.useEffect(()=>{const c=a=>{if(a.target&&!r.current){let v=function(){Ee(Xe,n,l,{discrete:!0})};const l={originalEvent:a};a.pointerType==="touch"?(t.removeEventListener("click",o.current),o.current=v,t.addEventListener("click",o.current,{once:!0})):v()}else t.removeEventListener("click",o.current);r.current=!1},i=window.setTimeout(()=>{t.addEventListener("pointerdown",c)},0);return()=>{window.clearTimeout(i),t.removeEventListener("pointerdown",c),t.removeEventListener("click",o.current)}},[t,n]),{onPointerDownCapture:()=>r.current=!0}}function Qe(e,t=globalThis?.document){const n=T(e),r=s.useRef(!1);return s.useEffect(()=>{const o=c=>{c.target&&!r.current&&Ee(Ye,n,{originalEvent:c},{discrete:!1})};return t.addEventListener("focusin",o),()=>t.removeEventListener("focusin",o)},[t,n]),{onFocusCapture:()=>r.current=!0,onBlurCapture:()=>r.current=!1}}function oe(){const e=new CustomEvent(te);document.dispatchEvent(e)}function Ee(e,t,n,{discrete:r}){const o=n.originalEvent.target,c=new CustomEvent(e,{bubbles:!1,cancelable:!0,detail:n});t&&o.addEventListener(e,t,{once:!0}),r?Fe(o,c):o.dispatchEvent(c)}var Y="focusScope.autoFocusOnMount",z="focusScope.autoFocusOnUnmount",ae={bubbles:!1,cancelable:!0},Je="FocusScope",et=s.forwardRef((e,t)=>{const{loop:n=!1,trapped:r=!1,onMountAutoFocus:o,onUnmountAutoFocus:c,...i}=e,[a,v]=s.useState(null),l=T(o),m=T(c),d=s.useRef(null),h=F(t,u=>v(u)),p=s.useRef({paused:!1,pause(){this.paused=!0},resume(){this.paused=!1}}).current;s.useEffect(()=>{if(r){let u=function(C){if(p.paused||!a)return;const g=C.target;a.contains(g)?d.current=g:L(d.current,{select:!0})},f=function(C){if(p.paused||!a)return;const g=C.relatedTarget;g!==null&&(a.contains(g)||L(d.current,{select:!0}))},y=function(C){if(document.activeElement===document.body)for(const w of C)w.removedNodes.length>0&&L(a)};document.addEventListener("focusin",u),document.addEventListener("focusout",f);const b=new MutationObserver(y);return a&&b.observe(a,{childList:!0,subtree:!0}),()=>{document.removeEventListener("focusin",u),document.removeEventListener("focusout",f),b.disconnect()}}},[r,a,p.paused]),s.useEffect(()=>{if(a){se.add(p);const u=document.activeElement;if(!a.contains(u)){const y=new CustomEvent(Y,ae);a.addEventListener(Y,l),a.dispatchEvent(y),y.defaultPrevented||(tt(ct(ge(a)),{select:!0}),document.activeElement===u&&L(a))}return()=>{a.removeEventListener(Y,l),setTimeout(()=>{const y=new CustomEvent(z,ae);a.addEventListener(z,m),a.dispatchEvent(y),y.defaultPrevented||L(u??document.body,{select:!0}),a.removeEventListener(z,m),se.remove(p)},0)}}},[a,l,m,p]);const E=s.useCallback(u=>{if(!n&&!r||p.paused)return;const f=u.key==="Tab"&&!u.altKey&&!u.ctrlKey&&!u.metaKey,y=document.activeElement;if(f&&y){const b=u.currentTarget,[C,g]=nt(b);C&&g?!u.shiftKey&&y===g?(u.preventDefault(),n&&L(C,{select:!0})):u.shiftKey&&y===C&&(u.preventDefault(),n&&L(g,{select:!0})):y===b&&u.preventDefault()}},[n,r,p.paused]);return x.jsx(H.div,{tabIndex:-1,...i,ref:h,onKeyDown:E})});et.displayName=Je;function tt(e,{select:t=!1}={}){const n=document.activeElement;for(const r of e)if(L(r,{select:t}),document.activeElement!==n)return}function nt(e){const t=ge(e),n=ce(t,e),r=ce(t.reverse(),e);return[n,r]}function ge(e){const t=[],n=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:r=>{const o=r.tagName==="INPUT"&&r.type==="hidden";return r.disabled||r.hidden||o?NodeFilter.FILTER_SKIP:r.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;n.nextNode();)t.push(n.currentNode);return t}function ce(e,t){for(const n of e)if(!rt(n,{upTo:t}))return n}function rt(e,{upTo:t}){if(getComputedStyle(e).visibility==="hidden")return!0;for(;e;){if(t!==void 0&&e===t)return!1;if(getComputedStyle(e).display==="none")return!0;e=e.parentElement}return!1}function ot(e){return e instanceof HTMLInputElement&&"select"in e}function L(e,{select:t=!1}={}){if(e&&e.focus){const n=document.activeElement;e.focus({preventScroll:!0}),e!==n&&ot(e)&&t&&e.select()}}var se=at();function at(){let e=[];return{add(t){const n=e[0];t!==n&&n?.pause(),e=ie(e,t),e.unshift(t)},remove(t){e=ie(e,t),e[0]?.resume()}}}function ie(e,t){const n=[...e],r=n.indexOf(t);return r!==-1&&n.splice(r,1),n}function ct(e){return e.filter(t=>t.tagName!=="A")}var st="Portal",it=s.forwardRef((e,t)=>{const{container:n,...r}=e,[o,c]=s.useState(!1);he(()=>c(!0),[]);const i=n||o&&globalThis?.document?.body;return i?Te.createPortal(x.jsx(H.div,{...r,ref:t}),i):null});it.displayName=st;var Z=0;function cn(){s.useEffect(()=>{const e=document.querySelectorAll("[data-radix-focus-guard]");return document.body.insertAdjacentElement("afterbegin",e[0]??ue()),document.body.insertAdjacentElement("beforeend",e[1]??ue()),Z++,()=>{Z===1&&document.querySelectorAll("[data-radix-focus-guard]").forEach(t=>t.remove()),Z--}},[])}function ue(){const e=document.createElement("span");return e.setAttribute("data-radix-focus-guard",""),e.tabIndex=0,e.style.outline="none",e.style.opacity="0",e.style.position="fixed",e.style.pointerEvents="none",e}var P=function(){return P=Object.assign||function(t){for(var n,r=1,o=arguments.length;r<o;r++){n=arguments[r];for(var c in n)Object.prototype.hasOwnProperty.call(n,c)&&(t[c]=n[c])}return t},P.apply(this,arguments)};function be(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]]);return n}function ut(e,t,n){if(n||arguments.length===2)for(var r=0,o=t.length,c;r<o;r++)(c||!(r in t))&&(c||(c=Array.prototype.slice.call(t,0,r)),c[r]=t[r]);return e.concat(c||Array.prototype.slice.call(t))}var $="right-scroll-bar-position",U="width-before-scroll-bar",lt="with-scroll-bars-hidden",dt="--removed-body-scroll-bar-size";function q(e,t){return typeof e=="function"?e(t):e&&(e.current=t),e}function ft(e,t){var n=s.useState(function(){return{value:e,callback:t,facade:{get current(){return n.value},set current(r){var o=n.value;o!==r&&(n.value=r,n.callback(r,o))}}}})[0];return n.callback=t,n.facade}var vt=typeof window<"u"?s.useLayoutEffect:s.useEffect,le=new WeakMap;function mt(e,t){var n=ft(null,function(r){return e.forEach(function(o){return q(o,r)})});return vt(function(){var r=le.get(n);if(r){var o=new Set(r),c=new Set(e),i=n.current;o.forEach(function(a){c.has(a)||q(a,null)}),c.forEach(function(a){o.has(a)||q(a,i)})}le.set(n,e)},[e]),n}function ht(e){return e}function pt(e,t){t===void 0&&(t=ht);var n=[],r=!1,o={read:function(){if(r)throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");return n.length?n[n.length-1]:e},useMedium:function(c){var i=t(c,r);return n.push(i),function(){n=n.filter(function(a){return a!==i})}},assignSyncMedium:function(c){for(r=!0;n.length;){var i=n;n=[],i.forEach(c)}n={push:function(a){return c(a)},filter:function(){return n}}},assignMedium:function(c){r=!0;var i=[];if(n.length){var a=n;n=[],a.forEach(c),i=n}var v=function(){var m=i;i=[],m.forEach(c)},l=function(){return Promise.resolve().then(v)};l(),n={push:function(m){i.push(m),l()},filter:function(m){return i=i.filter(m),n}}}};return o}function yt(e){e===void 0&&(e={});var t=pt(null);return t.options=P({async:!0,ssr:!1},e),t}var Ce=function(e){var t=e.sideCar,n=be(e,["sideCar"]);if(!t)throw new Error("Sidecar: please provide `sideCar` property to import the right car");var r=t.read();if(!r)throw new Error("Sidecar medium not found");return s.createElement(r,P({},n))};Ce.isSideCarExport=!0;function Et(e,t){return e.useMedium(t),Ce}var Se=yt(),G=function(){},K=s.forwardRef(function(e,t){var n=s.useRef(null),r=s.useState({onScrollCapture:G,onWheelCapture:G,onTouchMoveCapture:G}),o=r[0],c=r[1],i=e.forwardProps,a=e.children,v=e.className,l=e.removeScrollBar,m=e.enabled,d=e.shards,h=e.sideCar,p=e.noIsolation,E=e.inert,u=e.allowPinchZoom,f=e.as,y=f===void 0?"div":f,b=e.gapMode,C=be(e,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noIsolation","inert","allowPinchZoom","as","gapMode"]),g=h,w=mt([n,t]),R=P(P({},C),o);return s.createElement(s.Fragment,null,m&&s.createElement(g,{sideCar:Se,removeScrollBar:l,shards:d,noIsolation:p,inert:E,setCallbacks:c,allowPinchZoom:!!u,lockRef:n,gapMode:b}),i?s.cloneElement(s.Children.only(a),P(P({},R),{ref:w})):s.createElement(y,P({},R,{className:v,ref:w}),a))});K.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1};K.classNames={fullWidth:U,zeroRight:$};var gt=function(){if(typeof __webpack_nonce__<"u")return __webpack_nonce__};function bt(){if(!document)return null;var e=document.createElement("style");e.type="text/css";var t=gt();return t&&e.setAttribute("nonce",t),e}function Ct(e,t){e.styleSheet?e.styleSheet.cssText=t:e.appendChild(document.createTextNode(t))}function St(e){var t=document.head||document.getElementsByTagName("head")[0];t.appendChild(e)}var wt=function(){var e=0,t=null;return{add:function(n){e==0&&(t=bt())&&(Ct(t,n),St(t)),e++},remove:function(){e--,!e&&t&&(t.parentNode&&t.parentNode.removeChild(t),t=null)}}},xt=function(){var e=wt();return function(t,n){s.useEffect(function(){return e.add(t),function(){e.remove()}},[t&&n])}},we=function(){var e=xt(),t=function(n){var r=n.styles,o=n.dynamic;return e(r,o),null};return t},Pt={left:0,top:0,right:0,gap:0},Q=function(e){return parseInt(e||"",10)||0},Rt=function(e){var t=window.getComputedStyle(document.body),n=t[e==="padding"?"paddingLeft":"marginLeft"],r=t[e==="padding"?"paddingTop":"marginTop"],o=t[e==="padding"?"paddingRight":"marginRight"];return[Q(n),Q(r),Q(o)]},Ot=function(e){if(e===void 0&&(e="margin"),typeof window>"u")return Pt;var t=Rt(e),n=document.documentElement.clientWidth,r=window.innerWidth;return{left:t[0],top:t[1],right:t[2],gap:Math.max(0,r-n+t[2]-t[0])}},Lt=we(),D="data-scroll-locked",At=function(e,t,n,r){var o=e.left,c=e.top,i=e.right,a=e.gap;return n===void 0&&(n="margin"),`
  .`.concat(lt,` {
   overflow: hidden `).concat(r,`;
   padding-right: `).concat(a,"px ").concat(r,`;
  }
  body[`).concat(D,`] {
    overflow: hidden `).concat(r,`;
    overscroll-behavior: contain;
    `).concat([t&&"position: relative ".concat(r,";"),n==="margin"&&`
    padding-left: `.concat(o,`px;
    padding-top: `).concat(c,`px;
    padding-right: `).concat(i,`px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(a,"px ").concat(r,`;
    `),n==="padding"&&"padding-right: ".concat(a,"px ").concat(r,";")].filter(Boolean).join(""),`
  }
  
  .`).concat($,` {
    right: `).concat(a,"px ").concat(r,`;
  }
  
  .`).concat(U,` {
    margin-right: `).concat(a,"px ").concat(r,`;
  }
  
  .`).concat($," .").concat($,` {
    right: 0 `).concat(r,`;
  }
  
  .`).concat(U," .").concat(U,` {
    margin-right: 0 `).concat(r,`;
  }
  
  body[`).concat(D,`] {
    `).concat(dt,": ").concat(a,`px;
  }
`)},de=function(){var e=parseInt(document.body.getAttribute(D)||"0",10);return isFinite(e)?e:0},Tt=function(){s.useEffect(function(){return document.body.setAttribute(D,(de()+1).toString()),function(){var e=de()-1;e<=0?document.body.removeAttribute(D):document.body.setAttribute(D,e.toString())}},[])},Mt=function(e){var t=e.noRelative,n=e.noImportant,r=e.gapMode,o=r===void 0?"margin":r;Tt();var c=s.useMemo(function(){return Ot(o)},[o]);return s.createElement(Lt,{styles:At(c,!t,o,n?"":"!important")})},ne=!1;if(typeof window<"u")try{var _=Object.defineProperty({},"passive",{get:function(){return ne=!0,!0}});window.addEventListener("test",_,_),window.removeEventListener("test",_,_)}catch{ne=!1}var M=ne?{}:!1,kt=function(e){return e.tagName==="TEXTAREA"},xe=function(e,t){if(!(e instanceof Element))return!1;var n=window.getComputedStyle(e);return n[t]!=="hidden"&&!(n.overflowY===n.overflowX&&!kt(e)&&n[t]==="visible")},Nt=function(e){return xe(e,"overflowY")},Dt=function(e){return xe(e,"overflowX")},fe=function(e,t){var n=t.ownerDocument,r=t;do{typeof ShadowRoot<"u"&&r instanceof ShadowRoot&&(r=r.host);var o=Pe(e,r);if(o){var c=Re(e,r),i=c[1],a=c[2];if(i>a)return!0}r=r.parentNode}while(r&&r!==n.body);return!1},It=function(e){var t=e.scrollTop,n=e.scrollHeight,r=e.clientHeight;return[t,n,r]},Ft=function(e){var t=e.scrollLeft,n=e.scrollWidth,r=e.clientWidth;return[t,n,r]},Pe=function(e,t){return e==="v"?Nt(t):Dt(t)},Re=function(e,t){return e==="v"?It(t):Ft(t)},_t=function(e,t){return e==="h"&&t==="rtl"?-1:1},Bt=function(e,t,n,r,o){var c=_t(e,window.getComputedStyle(t).direction),i=c*r,a=n.target,v=t.contains(a),l=!1,m=i>0,d=0,h=0;do{var p=Re(e,a),E=p[0],u=p[1],f=p[2],y=u-f-c*E;(E||y)&&Pe(e,a)&&(d+=y,h+=E),a instanceof ShadowRoot?a=a.host:a=a.parentNode}while(!v&&a!==document.body||v&&(t.contains(a)||t===a));return(m&&(Math.abs(d)<1||!o)||!m&&(Math.abs(h)<1||!o))&&(l=!0),l},B=function(e){return"changedTouches"in e?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0]},ve=function(e){return[e.deltaX,e.deltaY]},me=function(e){return e&&"current"in e?e.current:e},Wt=function(e,t){return e[0]===t[0]&&e[1]===t[1]},jt=function(e){return`
  .block-interactivity-`.concat(e,` {pointer-events: none;}
  .allow-interactivity-`).concat(e,` {pointer-events: all;}
`)},$t=0,k=[];function Ut(e){var t=s.useRef([]),n=s.useRef([0,0]),r=s.useRef(),o=s.useState($t++)[0],c=s.useState(we)[0],i=s.useRef(e);s.useEffect(function(){i.current=e},[e]),s.useEffect(function(){if(e.inert){document.body.classList.add("block-interactivity-".concat(o));var u=ut([e.lockRef.current],(e.shards||[]).map(me),!0).filter(Boolean);return u.forEach(function(f){return f.classList.add("allow-interactivity-".concat(o))}),function(){document.body.classList.remove("block-interactivity-".concat(o)),u.forEach(function(f){return f.classList.remove("allow-interactivity-".concat(o))})}}},[e.inert,e.lockRef.current,e.shards]);var a=s.useCallback(function(u,f){if("touches"in u&&u.touches.length===2||u.type==="wheel"&&u.ctrlKey)return!i.current.allowPinchZoom;var y=B(u),b=n.current,C="deltaX"in u?u.deltaX:b[0]-y[0],g="deltaY"in u?u.deltaY:b[1]-y[1],w,R=u.target,S=Math.abs(C)>Math.abs(g)?"h":"v";if("touches"in u&&S==="h"&&R.type==="range")return!1;var O=fe(S,R);if(!O)return!0;if(O?w=S:(w=S==="v"?"h":"v",O=fe(S,R)),!O)return!1;if(!r.current&&"changedTouches"in u&&(C||g)&&(r.current=w),!w)return!0;var I=r.current||w;return Bt(I,f,u,I==="h"?C:g,!0)},[]),v=s.useCallback(function(u){var f=u;if(!(!k.length||k[k.length-1]!==c)){var y="deltaY"in f?ve(f):B(f),b=t.current.filter(function(w){return w.name===f.type&&(w.target===f.target||f.target===w.shadowParent)&&Wt(w.delta,y)})[0];if(b&&b.should){f.cancelable&&f.preventDefault();return}if(!b){var C=(i.current.shards||[]).map(me).filter(Boolean).filter(function(w){return w.contains(f.target)}),g=C.length>0?a(f,C[0]):!i.current.noIsolation;g&&f.cancelable&&f.preventDefault()}}},[]),l=s.useCallback(function(u,f,y,b){var C={name:u,delta:f,target:y,should:b,shadowParent:Ht(y)};t.current.push(C),setTimeout(function(){t.current=t.current.filter(function(g){return g!==C})},1)},[]),m=s.useCallback(function(u){n.current=B(u),r.current=void 0},[]),d=s.useCallback(function(u){l(u.type,ve(u),u.target,a(u,e.lockRef.current))},[]),h=s.useCallback(function(u){l(u.type,B(u),u.target,a(u,e.lockRef.current))},[]);s.useEffect(function(){return k.push(c),e.setCallbacks({onScrollCapture:d,onWheelCapture:d,onTouchMoveCapture:h}),document.addEventListener("wheel",v,M),document.addEventListener("touchmove",v,M),document.addEventListener("touchstart",m,M),function(){k=k.filter(function(u){return u!==c}),document.removeEventListener("wheel",v,M),document.removeEventListener("touchmove",v,M),document.removeEventListener("touchstart",m,M)}},[]);var p=e.removeScrollBar,E=e.inert;return s.createElement(s.Fragment,null,E?s.createElement(c,{styles:jt(o)}):null,p?s.createElement(Mt,{gapMode:e.gapMode}):null)}function Ht(e){for(var t=null;e!==null;)e instanceof ShadowRoot&&(t=e.host,e=e.host),e=e.parentNode;return t}const Kt=Et(Se,Ut);var Vt=s.forwardRef(function(e,t){return s.createElement(K,P({},e,{ref:t,sideCar:Kt}))});Vt.classNames=K.classNames;var Xt=function(e){if(typeof document>"u")return null;var t=Array.isArray(e)?e[0]:e;return t.ownerDocument.body},N=new WeakMap,W=new WeakMap,j={},J=0,Oe=function(e){return e&&(e.host||Oe(e.parentNode))},Yt=function(e,t){return t.map(function(n){if(e.contains(n))return n;var r=Oe(n);return r&&e.contains(r)?r:(console.error("aria-hidden",n,"in not contained inside",e,". Doing nothing"),null)}).filter(function(n){return!!n})},zt=function(e,t,n,r){var o=Yt(t,Array.isArray(e)?e:[e]);j[n]||(j[n]=new WeakMap);var c=j[n],i=[],a=new Set,v=new Set(o),l=function(d){!d||a.has(d)||(a.add(d),l(d.parentNode))};o.forEach(l);var m=function(d){!d||v.has(d)||Array.prototype.forEach.call(d.children,function(h){if(a.has(h))m(h);else try{var p=h.getAttribute(r),E=p!==null&&p!=="false",u=(N.get(h)||0)+1,f=(c.get(h)||0)+1;N.set(h,u),c.set(h,f),i.push(h),u===1&&E&&W.set(h,!0),f===1&&h.setAttribute(n,"true"),E||h.setAttribute(r,"true")}catch(y){console.error("aria-hidden: cannot operate on ",h,y)}})};return m(t),a.clear(),J++,function(){i.forEach(function(d){var h=N.get(d)-1,p=c.get(d)-1;N.set(d,h),c.set(d,p),h||(W.has(d)||d.removeAttribute(r),W.delete(d)),p||d.removeAttribute(n)}),J--,J||(N=new WeakMap,N=new WeakMap,W=new WeakMap,j={})}},sn=function(e,t,n){n===void 0&&(n="data-aria-hidden");var r=Array.from(Array.isArray(e)?e:[e]),o=Xt(e);return o?(r.push.apply(r,Array.from(o.querySelectorAll("[aria-live]"))),zt(r,o,n,"aria-hidden")):function(){return null}};export{an as C,ze as D,et as F,H as P,Vt as R,X as a,He as b,en as c,nn as d,rn as e,tn as f,on as g,it as h,Jt as i,sn as j,cn as k,T as l,he as u};