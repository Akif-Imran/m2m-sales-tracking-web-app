import{c as p,l as c,o as d,d as y,R as t,j as e,x,a5 as h,aa as F,T as r,C,F as f,A,b4 as T,b5 as N,b6 as _,D as k,N as R,G as m,S as b}from"./index-5cd21567.js";const D=p(a=>({descText:{flex:1,textAlign:"right",fontFamily:`Greycliff CF, ${a.fontFamily}`,color:c.titleText,fontWeight:400,fontSize:d(14),lineHeight:1},headerText:{flex:1,textAlign:"left",fontFamily:`Greycliff CF, ${a.fontFamily}`,color:c.titleText,fontWeight:700,fontSize:d(14),lineHeight:1}})),z=()=>{const{classes:a,theme:i}=D(),j=y(),[o,I]=t.useState([]),[l,u]=t.useState([]),[S,Y]=t.useState(!1),n=t.useCallback(()=>{},[]);t.useEffect(()=>{o&&u(o)},[o]),t.useEffect(()=>{n()},[n]);const g=S?e.jsx(x,{children:e.jsx(h,{children:e.jsx(F,{variant:"dots"})})}):e.jsx(t.Fragment,{children:l.length===0?e.jsx(x,{children:e.jsx(h,{children:e.jsx(r,{color:c.titleText,children:"No Notifications"})})}):e.jsx(e.Fragment,{children:l.map(s=>e.jsx(C,{shadow:"sm",mb:"xs",px:"sm",py:"xs",radius:"md",children:e.jsxs(f,{direction:"column",children:[e.jsxs(f,{direction:"row",justify:"space-between",align:"center",children:[e.jsx(r,{size:"md",children:s.title}),e.jsx(A,{onClick:s.isRead?void 0:()=>j(T(s.id)),children:s.isRead?e.jsx(N,{stroke:1.5,color:i.colors[i.primaryColor][6]}):e.jsx(_,{stroke:1.5,color:i.colors[i.primaryColor][6]})})]}),e.jsx(r,{size:"sm",c:c.titleText,children:s.body}),e.jsx(r,{className:a.descText,c:"dark.1",children:k.fromISO(s.createdAt).toFormat(R)})]})},s.id.toString()))})});return e.jsx(m,{children:e.jsx(m.Col,{span:4,children:e.jsx(b,{children:g})})})};export{z as default};
