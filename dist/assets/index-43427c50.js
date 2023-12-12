import{b5 as ae,b6 as Se,b7 as Ce,R as v,b8 as U,c as K,o as j,K as x,b9 as S,ba as A,bb as Re,bc as Ie,bd as Ee,be as Ae,bf as De,bg as Ne,bh as Te,bi as ke,bj as Be,f as F,bk as He,bl as Le,j as s,T as C,aa as q,B as G,v as Me,bm as ze}from"./index-a621499c.js";const D={context:"Accordion component was not found in the tree",itemContext:"Accordion.Item component was not found in the tree",value:"Accordion.Item component was rendered with invalid value or without value"},[Ve,N]=ae(D.context);function We({children:e,multiple:r,value:t,defaultValue:o,onChange:n,id:a,loop:p,transitionDuration:c,disableChevronRotation:h,chevronPosition:f,chevronSize:u,order:i,chevron:g,variant:_,radius:l,classNames:d,styles:b,unstyled:O}){const P=Se(a),[m,z]=Ce({value:t,defaultValue:o,finalValue:r?[]:null,onChange:n}),we=w=>Array.isArray(m)?m.includes(w):w===m,$e=w=>{const je=Array.isArray(m)?m.includes(w)?m.filter(xe=>xe!==w):[...m,w]:w===m?null:w;z(je)};return v.createElement(Ve,{value:{isItemActive:we,onChange:$e,getControlId:U(`${P}-control`,D.value),getRegionId:U(`${P}-panel`,D.value),transitionDuration:c,disableChevronRotation:h,chevronPosition:f,chevronSize:u,order:i,chevron:g,loop:p,variant:_,radius:l,classNames:d,styles:b,unstyled:O}},e)}const[Ke,se]=ae(D.itemContext);function Ue(e,r,{radius:t}){const o=e.colorScheme==="dark"?e.colors.dark[4]:e.colors.gray[3],n=e.colorScheme==="dark"?e.colors.dark[6]:e.colors.gray[0],a=e.fn.radius(t);return r==="default"?{color:e.colorScheme==="dark"?e.colors.dark[0]:e.black,borderBottom:`${j(1)} solid ${o}`}:r==="contained"?{border:`${j(1)} solid ${o}`,transition:"background-color 150ms ease","&[data-active]":{backgroundColor:n},"&:first-of-type":{borderTopRightRadius:a,borderTopLeftRadius:a,"& > [data-accordion-control]":{borderTopRightRadius:a,borderTopLeftRadius:a}},"&:last-of-type":{borderBottomRightRadius:a,borderBottomLeftRadius:a,"& > [data-accordion-control]":{borderBottomRightRadius:a,borderBottomLeftRadius:a}},"& + &":{borderTop:0}}:r==="filled"?{borderRadius:a,"&[data-active]":{backgroundColor:n}}:r==="separated"?{borderRadius:a,backgroundColor:n,border:`${j(1)} solid transparent`,transition:"background-color 150ms ease","& + &":{marginTop:e.spacing.md},"&[data-active]":{backgroundColor:e.colorScheme==="dark"?e.colors.dark[7]:e.white,borderColor:o}}:{}}var Fe=K((e,r,{variant:t})=>({item:Ue(e,t,r)}));const qe=Fe;var Ge=Object.defineProperty,T=Object.getOwnPropertySymbols,ie=Object.prototype.hasOwnProperty,le=Object.prototype.propertyIsEnumerable,J=(e,r,t)=>r in e?Ge(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,Je=(e,r)=>{for(var t in r||(r={}))ie.call(r,t)&&J(e,t,r[t]);if(T)for(var t of T(r))le.call(r,t)&&J(e,t,r[t]);return e},Qe=(e,r)=>{var t={};for(var o in e)ie.call(e,o)&&r.indexOf(o)<0&&(t[o]=e[o]);if(e!=null&&T)for(var o of T(e))r.indexOf(o)<0&&le.call(e,o)&&(t[o]=e[o]);return t};const Xe={},ce=x.forwardRef((e,r)=>{const t=S("AccordionItem",Xe,e),{children:o,className:n,value:a}=t,p=Qe(t,["children","className","value"]),c=N(),{classes:h,cx:f}=qe({radius:c.radius},{name:"Accordion",classNames:c.classNames,styles:c.styles,unstyled:c.unstyled,variant:c.variant});return v.createElement(Ke,{value:{value:a}},v.createElement(A,Je({ref:r,className:f(h.item,n),"data-active":c.isItemActive(a)||void 0},p),o))});ce.displayName="@mantine/core/AccordionItem";var Ye=Object.defineProperty,Ze=Object.defineProperties,er=Object.getOwnPropertyDescriptors,Q=Object.getOwnPropertySymbols,rr=Object.prototype.hasOwnProperty,tr=Object.prototype.propertyIsEnumerable,X=(e,r,t)=>r in e?Ye(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,R=(e,r)=>{for(var t in r||(r={}))rr.call(r,t)&&X(e,t,r[t]);if(Q)for(var t of Q(r))tr.call(r,t)&&X(e,t,r[t]);return e},or=(e,r)=>Ze(e,er(r));function nr(e,r){return r==="default"||r==="contained"?e.fn.hover({backgroundColor:e.colorScheme==="dark"?e.colors.dark[6]:e.colors.gray[0]}):{}}var ar=K((e,{transitionDuration:r,chevronPosition:t,chevronSize:o},{variant:n})=>({icon:{display:"flex",alignItems:"center",justifyContent:"center",marginRight:t==="left"?0:e.spacing.sm,marginLeft:t==="left"?e.spacing.lg:0},chevron:{display:"flex",alignItems:"center",justifyContent:"center",transition:`transform ${r}ms ease`,marginRight:t==="right"?0:e.spacing.sm,marginLeft:t==="right"?e.spacing.lg:0,width:j(o),minWidth:j(o),"&[data-rotate]":{transform:"rotate(180deg)"}},label:{color:"inherit",fontWeight:400,flex:1,overflow:"hidden",textOverflow:"ellipsis",paddingTop:e.spacing.md,paddingBottom:e.spacing.md},itemTitle:{margin:0,padding:0},control:or(R(R(R({},e.fn.focusStyles()),e.fn.fontStyles()),nr(e,n)),{width:"100%",display:"flex",alignItems:"center",flexDirection:t==="right"?"row-reverse":"row",paddingRight:e.spacing.md,paddingLeft:t==="right"?`calc(${e.spacing.md} + ${j(4)})`:e.spacing.xs,textAlign:"left",color:e.colorScheme==="dark"?e.colors.dark[0]:e.black,"&:disabled":R({opacity:.4,cursor:"not-allowed"},e.fn.hover({backgroundColor:"transparent"}))})}));const sr=ar;var ir=Object.defineProperty,lr=Object.defineProperties,cr=Object.getOwnPropertyDescriptors,k=Object.getOwnPropertySymbols,de=Object.prototype.hasOwnProperty,pe=Object.prototype.propertyIsEnumerable,Y=(e,r,t)=>r in e?ir(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,dr=(e,r)=>{for(var t in r||(r={}))de.call(r,t)&&Y(e,t,r[t]);if(k)for(var t of k(r))pe.call(r,t)&&Y(e,t,r[t]);return e},pr=(e,r)=>lr(e,cr(r)),fr=(e,r)=>{var t={};for(var o in e)de.call(e,o)&&r.indexOf(o)<0&&(t[o]=e[o]);if(e!=null&&k)for(var o of k(e))r.indexOf(o)<0&&pe.call(e,o)&&(t[o]=e[o]);return t};const ur={},fe=x.forwardRef((e,r)=>{const t=S("AccordionControl",ur,e),{disabled:o,onKeyDown:n,onClick:a,chevron:p,children:c,className:h,icon:f}=t,u=fr(t,["disabled","onKeyDown","onClick","chevron","children","className","icon"]),i=N(),{value:g}=se(),{classes:_,cx:l}=sr({transitionDuration:i.transitionDuration,chevronPosition:i.chevronPosition,chevronSize:i.chevronSize,radius:i.radius},{name:"Accordion",classNames:i.classNames,styles:i.styles,unstyled:i.unstyled,variant:i.variant}),d=i.isItemActive(g),b=typeof i.order=="number",O=`h${i.order}`,P=v.createElement(Re,pr(dr({},u),{ref:r,"data-accordion-control":!0,disabled:o,className:l(_.control,h),onClick:m=>{a==null||a(m),i.onChange(g)},type:"button","data-active":d||void 0,"aria-expanded":d,"aria-controls":i.getRegionId(g),id:i.getControlId(g),unstyled:i.unstyled,onKeyDown:Ie({siblingSelector:"[data-accordion-control]",parentSelector:"[data-accordion]",activateOnFocus:!1,loop:i.loop,orientation:"vertical",onKeyDown:n})}),v.createElement("span",{className:_.chevron,"data-rotate":!i.disableChevronRotation&&d||void 0},p||i.chevron),v.createElement("span",{className:_.label},c),f&&v.createElement("span",{className:_.icon},f));return b?v.createElement(O,{className:_.itemTitle},P):P});fe.displayName="@mantine/core/AccordionControl";var vr=Object.defineProperty,mr=Object.defineProperties,hr=Object.getOwnPropertyDescriptors,Z=Object.getOwnPropertySymbols,gr=Object.prototype.hasOwnProperty,_r=Object.prototype.propertyIsEnumerable,ee=(e,r,t)=>r in e?vr(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,yr=(e,r)=>{for(var t in r||(r={}))gr.call(r,t)&&ee(e,t,r[t]);if(Z)for(var t of Z(r))_r.call(r,t)&&ee(e,t,r[t]);return e},br=(e,r)=>mr(e,hr(r)),Or=K((e,r)=>({panel:br(yr({},e.fn.fontStyles()),{wordBreak:"break-word",lineHeight:e.lineHeight}),content:{padding:e.spacing.md,paddingTop:`calc(${e.spacing.xs} / 2)`}}));const Pr=Or;var wr=Object.defineProperty,$r=Object.defineProperties,jr=Object.getOwnPropertyDescriptors,B=Object.getOwnPropertySymbols,ue=Object.prototype.hasOwnProperty,ve=Object.prototype.propertyIsEnumerable,re=(e,r,t)=>r in e?wr(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,$=(e,r)=>{for(var t in r||(r={}))ue.call(r,t)&&re(e,t,r[t]);if(B)for(var t of B(r))ve.call(r,t)&&re(e,t,r[t]);return e},V=(e,r)=>$r(e,jr(r)),xr=(e,r)=>{var t={};for(var o in e)ue.call(e,o)&&r.indexOf(o)<0&&(t[o]=e[o]);if(e!=null&&B)for(var o of B(e))r.indexOf(o)<0&&ve.call(e,o)&&(t[o]=e[o]);return t};function Sr(e){if(!e||typeof e=="string")return 0;const r=e/36;return Math.round((4+15*r**.25+r/5)*10)}function W(e){return e!=null&&e.current?e.current.scrollHeight:"auto"}const I=typeof window<"u"&&window.requestAnimationFrame;function Cr({transitionDuration:e,transitionTimingFunction:r="ease",onTransitionEnd:t=()=>{},opened:o}){const n=x.useRef(null),a=0,p={display:"none",height:0,overflow:"hidden"},[c,h]=x.useState(o?{}:p),f=l=>{De.flushSync(()=>h(l))},u=l=>{f(d=>$($({},d),l))};function i(l){return{transition:`height ${e||Sr(l)}ms ${r}`}}Ee(()=>{I(o?()=>{u({willChange:"height",display:"block",overflow:"hidden"}),I(()=>{const l=W(n);u(V($({},i(l)),{height:l}))})}:()=>{const l=W(n);u(V($({},i(l)),{willChange:"height",height:l})),I(()=>u({height:a,overflow:"hidden"}))})},[o]);const g=l=>{if(!(l.target!==n.current||l.propertyName!=="height"))if(o){const d=W(n);d===c.height?f({}):u({height:d}),t()}else c.height===a&&(f(p),t())};function _(l={}){var d=l,{style:b={},refKey:O="ref"}=d,P=xr(d,["style","refKey"]);const m=P[O];return V($({"aria-hidden":!o},P),{[O]:Ae(n,m),onTransitionEnd:g,style:$($({boxSizing:"border-box"},b),c)})}return _}var Rr=Object.defineProperty,H=Object.getOwnPropertySymbols,me=Object.prototype.hasOwnProperty,he=Object.prototype.propertyIsEnumerable,te=(e,r,t)=>r in e?Rr(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,E=(e,r)=>{for(var t in r||(r={}))me.call(r,t)&&te(e,t,r[t]);if(H)for(var t of H(r))he.call(r,t)&&te(e,t,r[t]);return e},Ir=(e,r)=>{var t={};for(var o in e)me.call(e,o)&&r.indexOf(o)<0&&(t[o]=e[o]);if(e!=null&&H)for(var o of H(e))r.indexOf(o)<0&&he.call(e,o)&&(t[o]=e[o]);return t};const Er={transitionDuration:200,transitionTimingFunction:"ease",animateOpacity:!0},ge=x.forwardRef((e,r)=>{const t=S("Collapse",Er,e),{children:o,in:n,transitionDuration:a,transitionTimingFunction:p,style:c,onTransitionEnd:h,animateOpacity:f}=t,u=Ir(t,["children","in","transitionDuration","transitionTimingFunction","style","onTransitionEnd","animateOpacity"]),i=Ne(),g=Te(),l=(i.respectReducedMotion?g:!1)?0:a,{systemStyles:d,rest:b}=ke(u),O=Cr({opened:n,transitionDuration:l,transitionTimingFunction:p,onTransitionEnd:h});return l===0?n?v.createElement(A,E({},b),o):null:v.createElement(A,E({},O(E(E({style:c,ref:r},b),d))),v.createElement("div",{style:{opacity:n||!f?1:0,transition:f?`opacity ${l}ms ${p}`:"none"}},o))});ge.displayName="@mantine/core/Collapse";var Ar=Object.defineProperty,Dr=Object.defineProperties,Nr=Object.getOwnPropertyDescriptors,L=Object.getOwnPropertySymbols,_e=Object.prototype.hasOwnProperty,ye=Object.prototype.propertyIsEnumerable,oe=(e,r,t)=>r in e?Ar(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,Tr=(e,r)=>{for(var t in r||(r={}))_e.call(r,t)&&oe(e,t,r[t]);if(L)for(var t of L(r))ye.call(r,t)&&oe(e,t,r[t]);return e},kr=(e,r)=>Dr(e,Nr(r)),Br=(e,r)=>{var t={};for(var o in e)_e.call(e,o)&&r.indexOf(o)<0&&(t[o]=e[o]);if(e!=null&&L)for(var o of L(e))r.indexOf(o)<0&&ye.call(e,o)&&(t[o]=e[o]);return t};const Hr={};function be(e){const r=S("AccordionPanel",Hr,e),{children:t,className:o}=r,n=Br(r,["children","className"]),a=N(),{value:p}=se(),{classNames:c,styles:h,unstyled:f}=N(),{classes:u,cx:i}=Pr({radius:a.radius},{name:"Accordion",classNames:c,styles:h,unstyled:f,variant:a.variant});return v.createElement(ge,kr(Tr({},n),{className:i(u.panel,o),in:a.isItemActive(p),transitionDuration:a.transitionDuration,role:"region",id:a.getRegionId(p),"aria-labelledby":a.getControlId(p)}),v.createElement("div",{className:u.content},t))}be.displayName="@mantine/core/AccordionPanel";var Lr=Object.defineProperty,Mr=Object.defineProperties,zr=Object.getOwnPropertyDescriptors,M=Object.getOwnPropertySymbols,Oe=Object.prototype.hasOwnProperty,Pe=Object.prototype.propertyIsEnumerable,ne=(e,r,t)=>r in e?Lr(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,Vr=(e,r)=>{for(var t in r||(r={}))Oe.call(r,t)&&ne(e,t,r[t]);if(M)for(var t of M(r))Pe.call(r,t)&&ne(e,t,r[t]);return e},Wr=(e,r)=>Mr(e,zr(r)),Kr=(e,r)=>{var t={};for(var o in e)Oe.call(e,o)&&r.indexOf(o)<0&&(t[o]=e[o]);if(e!=null&&M)for(var o of M(e))r.indexOf(o)<0&&Pe.call(e,o)&&(t[o]=e[o]);return t};const Ur={multiple:!1,disableChevronRotation:!1,transitionDuration:200,chevronPosition:"right",variant:"default",chevronSize:24,chevron:v.createElement(Be,null)};function y(e){const r=S("Accordion",Ur,e),{id:t,loop:o,children:n,multiple:a,value:p,defaultValue:c,onChange:h,transitionDuration:f,disableChevronRotation:u,chevronPosition:i,chevronSize:g,order:_,chevron:l,classNames:d,styles:b,unstyled:O,variant:P,radius:m}=r,z=Kr(r,["id","loop","children","multiple","value","defaultValue","onChange","transitionDuration","disableChevronRotation","chevronPosition","chevronSize","order","chevron","classNames","styles","unstyled","variant","radius"]);return v.createElement(We,{id:t,multiple:a,value:p,defaultValue:c,onChange:h,loop:o,transitionDuration:f,disableChevronRotation:u,chevronPosition:i,chevronSize:g,order:_,chevron:l,variant:P,radius:m,classNames:d,styles:b,unstyled:O},v.createElement(A,Wr(Vr({},z),{"data-accordion":!0}),n))}y.Item=ce;y.Control=fe;y.Panel=be;y.displayName="@mantine/core/Accordion";const qr=()=>{const{data:e}=F(He),{data:r}=F(Le),t={1:"When the prospect is added it should be lead added with lead status.",2:"When further progress is made on the lead and follow Ups (Meetings) are conducted. The status should be updated to this.",3:"After submitting a quotation the status should be updated to this. With relevant details",4:"When work order for a prospect is received it become a project and will now show up under project management module. Use 'Move to projects' from the context menu to update the status to this.",5:"After receiving payment update the status to this.",6:"Marks the project as completed after its delivered."},o={1:"The highest access level is Admin. Nothing is hidden from admin. Certain features are only accessible by admin. For example Edit, Delete Records and  'Suppliers', 'Warehouse', 'Expense Types', and 'Purchase Category' in settings.",2:"This level represents the sales staff. They typically work on generating leads.",3:"The technical staff assigned to a project by admin.",4:"This represents Accounts or HR. Restricted from certain features such as adding a purchase request. Because a user of this level holds the right to approve 'Purchase Requests'."};return s.jsxs(y,{variant:"contained",radius:"md",children:[s.jsxs(y.Item,{value:"project-status",children:[s.jsx(y.Control,{children:s.jsx(C,{fw:"bolder",size:"lg",c:"#495057",children:"Project Status Info"})}),s.jsx(y.Panel,{children:s.jsxs(q,{withBorder:!0,withColumnBorders:!0,children:[s.jsx("thead",{children:s.jsxs("tr",{children:[s.jsx("th",{children:"Status"}),s.jsx("th",{children:"Description"})]})}),s.jsx("tbody",{children:e.map(n=>s.jsxs("tr",{children:[s.jsx("td",{children:s.jsx(G,{variant:"filled",color:Me[n.id],children:n.name})}),s.jsx("td",{children:s.jsx(C,{size:"sm",color:"dimmed",children:t[n.id]})})]}))})]})})]}),s.jsxs(y.Item,{value:"user-level",children:[s.jsx(y.Control,{children:s.jsx(C,{fw:"bolder",size:"lg",c:"#495057",children:"User Level Info"})}),s.jsx(y.Panel,{children:s.jsxs(q,{withBorder:!0,withColumnBorders:!0,children:[s.jsx("thead",{children:s.jsxs("tr",{children:[s.jsx("th",{children:"Level"}),s.jsx("th",{children:"Description"})]})}),s.jsx("tbody",{children:r.map(n=>s.jsxs("tr",{children:[s.jsx("td",{children:s.jsx(G,{variant:"filled",color:ze[n.id],children:n.name})}),s.jsx("td",{children:s.jsx(C,{size:"sm",color:"dimmed",children:o[n.id]})})]}))})]})})]})]})};export{qr as default};
