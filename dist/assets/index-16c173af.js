import{a as _,e as z,R as s,b,k as e,Z as x,T as j,l as c,D as F,K as v,t as A,$ as u,C as q,a0 as m,a1 as p,a2 as D,a3 as f,a4 as N,S as Y,a5 as M,V as S}from"./index-95b3bade.js";import{I as k}from"./IconFileExport-4bf83648.js";const H=_(d=>({controlsContainer:{display:"flex",flex:1,flexDirection:"row",justifyContent:"space-between",alignItems:"flex-end"}})),O=()=>{const{classes:d}=H(),{state:{token:h}}=z(),[a,g]=s.useState(new Date),[r,y]=s.useState(new Date),[l,L]=s.useState([]),{companyId:i}=b(),[C,B]=s.useState(!1),w=()=>{o(a,r,i||"na")},o=s.useCallback((t,n,R)=>{console.log(t,n,R,h)},[h]);s.useEffect(()=>{i&&o(a,r,i)},[o,i]);const P=t=>{t&&g(t)},T=t=>{t&&y(t)},E=async()=>{const t=a||new Date,n=r||new Date;if(l.length===0){S("Export PDF","No data to export","error");return}S("Export PDF","Please wait...","success"),console.log(t,n)},I=l.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(x,{children:e.jsx(j,{color:c.titleText,children:"No data to display"})})})}):e.jsx(e.Fragment,{children:l.map((t,n)=>e.jsxs("tr",{children:[e.jsx("td",{children:t.itemName}),e.jsx("td",{children:t.status}),e.jsx("td",{children:t.itemType}),e.jsx("td",{children:t.quantity}),e.jsx("td",{children:F.fromISO(t.warranty).toFormat(v)}),e.jsx("td",{children:t.price.amount}),e.jsx("td",{children:t.remarks})]},n))});return e.jsxs(A,{spacing:u(5),children:[e.jsx(j,{fz:u(25),color:c.titleText,children:"Purchase Request Report"}),e.jsxs(q,{radius:"md",shadow:"md",sx:{minHeight:"94vh"},children:[e.jsxs("div",{className:d.controlsContainer,children:[e.jsxs(m,{children:[e.jsx(p,{radius:"md",label:"Start Date",placeholder:"Pick Date",value:a,onChange:P,required:!0,withAsterisk:!1,icon:e.jsx(D,{size:"1.2rem",stroke:1.5,color:c.titleText}),styles:{input:{width:200}}}),e.jsx(p,{radius:"md",label:"End Date",placeholder:"Pick Date",value:r,onChange:T,required:!0,withAsterisk:!1,icon:e.jsx(D,{size:"1.2rem",stroke:1.5,color:c.titleText}),styles:{input:{width:200}}})]}),e.jsxs(m,{children:[e.jsx(f,{variant:"filled",radius:"md",leftIcon:e.jsx(k,{size:"1.2rem",stroke:2}),size:"sm",onClick:w,children:"Search"}),e.jsx(f,{variant:"filled",radius:"md",leftIcon:e.jsx(k,{size:"1.2rem",stroke:2}),size:"sm",onClick:E,children:"Export PDF"})]})]}),C?e.jsx(x,{mt:"xs",children:e.jsx(N,{size:"lg",variant:"dots"})}):e.jsx(Y,{children:e.jsxs(M,{sx:{minWidth:"800px"},verticalSpacing:"sm",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Name"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Qty"}),e.jsx("th",{children:"Date/Time"}),e.jsx("th",{children:"Price"}),e.jsx("th",{children:"Remarks"})]})}),e.jsx("tbody",{children:I})]})})]})]})};export{O as default};
