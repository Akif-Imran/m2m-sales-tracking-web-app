import{c as p,l as c,o as d,d as y,R as t,j as e,x,a4 as h,a9 as F,T as a,C,F as f,A,b3 as T,b4 as _,b5 as k,D as N,L as R,G as m,S as b}from"./index-490414e6.js";const D=p(i=>({descText:{flex:1,textAlign:"right",fontFamily:`Greycliff CF, ${i.fontFamily}`,color:c.titleText,fontWeight:400,fontSize:d(14),lineHeight:1},headerText:{flex:1,textAlign:"left",fontFamily:`Greycliff CF, ${i.fontFamily}`,color:c.titleText,fontWeight:700,fontSize:d(14),lineHeight:1}})),z=()=>{const{classes:i,theme:r}=D(),j=y(),[o,I]=t.useState([]),[l,u]=t.useState([]),[S,Y]=t.useState(!1),n=t.useCallback(()=>{},[]);t.useEffect(()=>{o&&u(o)},[o]),t.useEffect(()=>{n()},[n]);const g=S?e.jsx(x,{children:e.jsx(h,{children:e.jsx(F,{variant:"dots"})})}):e.jsx(t.Fragment,{children:l.length===0?e.jsx(x,{children:e.jsx(h,{children:e.jsx(a,{color:c.titleText,children:"No Notifications"})})}):e.jsx(e.Fragment,{children:l.map(s=>e.jsx(C,{shadow:"sm",mb:"xs",px:"sm",py:"xs",radius:"md",children:e.jsxs(f,{direction:"column",children:[e.jsxs(f,{direction:"row",justify:"space-between",align:"center",children:[e.jsx(a,{size:"md",children:s.title}),e.jsx(A,{onClick:s.isRead?void 0:()=>j(T(s.id)),children:s.isRead?e.jsx(_,{stroke:1.5,color:r.colors[r.primaryColor][6]}):e.jsx(k,{stroke:1.5,color:r.colors[r.primaryColor][6]})})]}),e.jsx(a,{size:"sm",c:c.titleText,children:s.body}),e.jsx(a,{className:i.descText,c:"dark.1",children:N.fromISO(s.createdAt).toFormat(R)})]})},s.id.toString()))})});return e.jsx(m,{children:e.jsx(m.Col,{span:4,children:e.jsx(b,{children:g})})})};export{z as default};
