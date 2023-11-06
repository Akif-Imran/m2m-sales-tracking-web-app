import{a as _,R as t,b as v,k as e,l as x,T as j,m as o,D as z,E as b,n as F,P as u,C as R,U as p,V as D,W as f,X as S,Y,S as A,Z as N,K as i}from"./index-62f20919.js";import{I as m}from"./IconFileExport-fc1f83b7.js";const M=_(h=>({controlsContainer:{display:"flex",flex:1,flexDirection:"row",justifyContent:"space-between",alignItems:"flex-end"}})),B=()=>{const{classes:h}=M(),[r,y]=t.useState(new Date),[a,g]=t.useState(new Date),[c,q]=t.useState([]),{companyId:l}=v(),[C,H]=t.useState(!1),k=()=>{if(!l){i("Error","Invalid vehicle Id","error");return}d(r,a,l)},d=t.useCallback((s,n,T)=>{console.log(s,n,T)},[]);t.useEffect(()=>{l&&d(r,a,l)},[d]);const w=s=>{s&&y(s)},I=s=>{s&&g(s)},E=async()=>{const s=r||new Date,n=a||new Date;if(c.length===0){i("Export PDF","No data to export","error");return}i("Export PDF","Please wait...","success"),console.log(s,n)},P=c.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(x,{children:e.jsx(j,{color:o.titleText,children:"No data to display"})})})}):e.jsx(e.Fragment,{children:c.map((s,n)=>e.jsxs("tr",{children:[e.jsx("td",{children:s==null?void 0:s.itemName}),e.jsx("td",{children:s==null?void 0:s.itemType}),e.jsx("td",{children:s==null?void 0:s.quantity}),e.jsx("td",{children:s==null?void 0:s.price.amount}),e.jsx("td",{children:s==null?void 0:s.status}),e.jsx("td",{children:z.fromISO(s.warranty).toFormat(b)})]},n))});return e.jsxs(F,{spacing:u(5),children:[e.jsx(j,{fz:u(25),color:o.titleText,children:"Claims Report"}),e.jsxs(R,{radius:"md",shadow:"md",sx:{minHeight:"94vh"},children:[e.jsxs("div",{className:h.controlsContainer,children:[e.jsxs(p,{children:[e.jsx(D,{radius:"md",label:"Start Date",placeholder:"Pick Date",value:r,onChange:w,required:!0,withAsterisk:!1,icon:e.jsx(f,{size:"1.2rem",stroke:1.5,color:o.titleText}),styles:{input:{width:200}}}),e.jsx(D,{radius:"md",label:"End Date",placeholder:"Pick Date",value:a,onChange:I,required:!0,withAsterisk:!1,icon:e.jsx(f,{size:"1.2rem",stroke:1.5,color:o.titleText}),styles:{input:{width:200}}})]}),e.jsxs(p,{children:[e.jsx(S,{variant:"filled",radius:"md",leftIcon:e.jsx(m,{size:"1.2rem",stroke:2}),size:"sm",onClick:k,children:"Search"}),e.jsx(S,{variant:"filled",radius:"md",leftIcon:e.jsx(m,{size:"1.2rem",stroke:2}),size:"sm",onClick:E,children:"Export PDF"})]})]}),C?e.jsx(x,{mt:"xs",children:e.jsx(Y,{size:"lg",variant:"dots"})}):e.jsx(A,{children:e.jsxs(N,{sx:{minWidth:"800px"},verticalSpacing:"sm",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Item Name"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Quantity"}),e.jsx("th",{children:"Price"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Warranty Date/Time"})]})}),e.jsx("tbody",{children:P})]})})]})]})};export{B as ClaimsReport,B as default};
