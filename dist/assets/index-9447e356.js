import{a as z,R as t,b,Y as d,k as e,Z as h,T as x,l as a,t as F,$ as j,C as _,a0 as u,a1 as p,a2 as m,a3 as f,a4 as A,S as Y,a5 as v,V as D}from"./index-4c56ab08.js";import{I as C}from"./IconFileExport-e57b867a.js";const N=z(l=>({controlsContainer:{display:"flex",flex:1,flexDirection:"row",justifyContent:"space-between",alignItems:"flex-end"}})),B=()=>{const{classes:l}=N(),[n,S]=t.useState(new Date),[g,y]=t.useState(new Date),[i,L]=t.useState([]),{companyId:k}=b(),[E,c]=t.useState(!1);console.log("companiesReport",k);const w=()=>{c(!0),setTimeout(()=>c(!1),1e3)},r=t.useCallback(s=>{const o=s?d(s):d(n);console.log(o)},[n]);t.useEffect(()=>{r()},[r]);const P=s=>{s&&(S(s),r(s))},T=s=>{s&&(y(s),r(s))},I=async()=>{if(i.length===0){D("Export PDF","No data to export","error");return}D("Export PDF","Please wait...","success")},R=i.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(h,{children:e.jsx(x,{color:a.titleText,children:"No data to display"})})})}):e.jsx(e.Fragment,{children:i.map((s,o)=>e.jsxs("tr",{children:[e.jsx("td",{children:s.name}),e.jsx("td",{children:s.phone}),e.jsx("td",{children:s.email}),e.jsx("td",{children:s.city}),e.jsx("td",{children:s.state}),e.jsx("td",{children:s.country})]},o))});return e.jsxs(F,{spacing:j(5),children:[e.jsx(x,{fz:j(25),color:a.titleText,children:"Companies Report"}),e.jsxs(_,{radius:"md",shadow:"md",sx:{minHeight:"94vh"},children:[e.jsxs("div",{className:l.controlsContainer,children:[e.jsxs(u,{children:[e.jsx(p,{radius:"md",label:"Start Date",placeholder:"Pick Date",value:n,onChange:P,required:!0,withAsterisk:!1,icon:e.jsx(m,{size:"1.2rem",stroke:1.5,color:a.titleText}),styles:{input:{width:200}}}),e.jsx(p,{radius:"md",label:"End Date",placeholder:"Pick Date",value:g,onChange:T,required:!0,withAsterisk:!1,icon:e.jsx(m,{size:"1.2rem",stroke:1.5,color:a.titleText}),styles:{input:{width:200}}})]}),e.jsxs(u,{children:[e.jsx(f,{variant:"filled",radius:"md",leftIcon:e.jsx(C,{size:"1.2rem",stroke:2}),size:"sm",onClick:w,children:"Search"}),e.jsx(f,{variant:"filled",radius:"md",leftIcon:e.jsx(C,{size:"1.2rem",stroke:2}),size:"sm",onClick:I,children:"Export PDF"})]})]}),E?e.jsx(h,{mt:"xs",children:e.jsx(A,{size:"lg",variant:"dots"})}):e.jsx(Y,{children:e.jsxs(v,{sx:{minWidth:"800px"},verticalSpacing:"sm",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Name"}),e.jsx("th",{children:"Phone"}),e.jsx("th",{children:"Email"}),e.jsx("th",{children:"City"}),e.jsx("th",{children:"State"}),e.jsx("th",{children:"Country"})]})}),e.jsx("tbody",{children:R})]})})]})]})};export{B as default};
