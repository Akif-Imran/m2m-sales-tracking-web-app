import{a as F,R as s,O as h,k as e,l as x,T as j,m as o,D,E as m,n as z,P as u,C as R,U as p,V as f,W as S,X as g,Y as v,S as A,Z as M,K as C}from"./index-62f20919.js";import{I as k}from"./IconFileExport-fc1f83b7.js";const b=F(l=>({controlsContainer:{display:"flex",flex:1,flexDirection:"row",justifyContent:"space-between",alignItems:"flex-end"}})),L=()=>{const{classes:l}=b(),[r,y]=s.useState(new Date),[i,T]=s.useState(new Date),[c,N]=s.useState([]),[w,d]=s.useState(!1),P=()=>{d(!0),setTimeout(()=>d(!1),1e3)},n=s.useCallback(t=>{const a=t?h(t):h(r);console.log(a)},[r]);s.useEffect(()=>{n()},[n]);const _=t=>{t&&(y(t),n(t))},E=t=>{t&&(T(t),n(t))},I=async()=>{const t=r||new Date,a=i||new Date;if(c.length===0){C("Export PDF","No data to export","error");return}C("Export PDF","Please wait...","success"),console.log(t,a)},Y=c.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(x,{children:e.jsx(j,{color:o.titleText,children:"No data to display"})})})}):e.jsx(e.Fragment,{children:c.map((t,a)=>e.jsxs("tr",{children:[e.jsx("td",{children:t.name}),e.jsx("td",{children:t.type}),e.jsx("td",{children:t.status}),e.jsx("td",{children:D.fromISO(t.contractDate).toFormat(m)}),e.jsx("td",{children:D.fromISO(t.deliveryDate).toFormat(m)}),e.jsx("td",{children:t.value.amount}),e.jsx("td",{children:t.description})]},a))});return e.jsxs(z,{spacing:u(5),children:[e.jsx(j,{fz:u(25),color:o.titleText,children:"Project Performance Report"}),e.jsxs(R,{radius:"md",shadow:"md",sx:{minHeight:"94vh"},children:[e.jsxs("div",{className:l.controlsContainer,children:[e.jsxs(p,{children:[e.jsx(f,{radius:"md",label:"Start Date",placeholder:"Pick Date",value:r,onChange:_,required:!0,withAsterisk:!1,icon:e.jsx(S,{size:"1.2rem",stroke:1.5,color:o.titleText}),styles:{input:{width:200}}}),e.jsx(f,{radius:"md",label:"End Date",placeholder:"Pick Date",value:i,onChange:E,required:!0,withAsterisk:!1,icon:e.jsx(S,{size:"1.2rem",stroke:1.5,color:o.titleText}),styles:{input:{width:200}}})]}),e.jsxs(p,{children:[e.jsx(g,{variant:"filled",radius:"md",leftIcon:e.jsx(k,{size:"1.2rem",stroke:2}),size:"sm",onClick:P,children:"Search"}),e.jsx(g,{variant:"filled",radius:"md",leftIcon:e.jsx(k,{size:"1.2rem",stroke:2}),size:"sm",onClick:I,children:"Export PDF"})]})]}),w?e.jsx(x,{mt:"xs",children:e.jsx(v,{size:"lg",variant:"dots"})}):e.jsx(A,{children:e.jsxs(M,{sx:{minWidth:"800px"},verticalSpacing:"sm",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Name"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Contract Date/Time"}),e.jsx("th",{children:"Delivery Date/Time"}),e.jsx("th",{children:"Value"}),e.jsx("th",{children:"Description"})]})}),e.jsx("tbody",{children:Y})]})})]})]})};export{L as default};