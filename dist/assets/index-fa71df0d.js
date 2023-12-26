import{c as _,R as t,b,j as e,a5 as x,T as j,l as o,D as v,N as z,x as F,o as u,C as R,a6 as p,a7 as D,a8 as f,a9 as S,aa as N,S as Y,ab as A,Y as i}from"./index-df60243a.js";import{I as y}from"./IconFileExport-94a60461.js";const M=_(h=>({controlsContainer:{display:"flex",flex:1,flexDirection:"row",justifyContent:"space-between",alignItems:"flex-end"}})),B=()=>{const{classes:h}=M(),[a,g]=t.useState(new Date),[r,m]=t.useState(new Date),[c,q]=t.useState([]),{companyId:l}=b(),[C,H]=t.useState(!1),w=()=>{if(!l){i("Error","Invalid vehicle Id","error");return}d(a,r,l)},d=t.useCallback((s,n,P)=>{console.log(s,n,P)},[]);t.useEffect(()=>{l&&d(a,r,l)},[d]);const k=s=>{s&&g(s)},I=s=>{s&&m(s)},E=async()=>{const s=a||new Date,n=r||new Date;if(c.length===0){i("Export PDF","No data to export","error");return}i("Export PDF","Please wait...","success"),console.log(s,n)},T=c.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(x,{children:e.jsx(j,{color:o.titleText,children:"No data to display"})})})}):e.jsx(e.Fragment,{children:c.map((s,n)=>e.jsxs("tr",{children:[e.jsx("td",{children:s==null?void 0:s.itemName}),e.jsx("td",{children:s==null?void 0:s.itemType}),e.jsx("td",{children:s==null?void 0:s.quantity}),e.jsx("td",{children:s==null?void 0:s.price.amount}),e.jsx("td",{children:s==null?void 0:s.status}),e.jsx("td",{children:v.fromISO(s.warranty).toFormat(z)})]},n))});return e.jsxs(F,{spacing:u(5),children:[e.jsx(j,{fz:u(25),color:o.titleText,children:"Claims Report"}),e.jsxs(R,{radius:"md",shadow:"md",sx:{minHeight:"94vh"},children:[e.jsxs("div",{className:h.controlsContainer,children:[e.jsxs(p,{children:[e.jsx(D,{radius:"md",label:"Start Date",placeholder:"Pick Date",value:a,onChange:k,required:!0,withAsterisk:!1,icon:e.jsx(f,{size:"1.2rem",stroke:1.5,color:o.titleText}),styles:{input:{width:200}}}),e.jsx(D,{radius:"md",label:"End Date",placeholder:"Pick Date",value:r,onChange:I,required:!0,withAsterisk:!1,icon:e.jsx(f,{size:"1.2rem",stroke:1.5,color:o.titleText}),styles:{input:{width:200}}})]}),e.jsxs(p,{children:[e.jsx(S,{variant:"filled",radius:"md",leftIcon:e.jsx(y,{size:"1.2rem",stroke:2}),size:"sm",onClick:w,children:"Search"}),e.jsx(S,{variant:"filled",radius:"md",leftIcon:e.jsx(y,{size:"1.2rem",stroke:2}),size:"sm",onClick:E,children:"Export PDF"})]})]}),C?e.jsx(x,{mt:"xs",children:e.jsx(N,{size:"lg",variant:"dots"})}):e.jsx(Y,{children:e.jsxs(A,{sx:{minWidth:"800px"},verticalSpacing:"sm",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Item Name"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Quantity"}),e.jsx("th",{children:"Price"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Warranty Date/Time"})]})}),e.jsx("tbody",{children:T})]})})]})]})};export{B as ClaimsReport,B as default};