import{c as Y,R as s,a3 as h,j as e,a4 as x,T as j,l as i,D as z,L as F,v as P,o as D,C as R,a5 as u,a6 as m,a7 as p,a8 as f,a9 as A,S as M,aa as b,X as S}from"./index-e03b4df2.js";import{I as g}from"./IconFileExport-2b43392d.js";const v=Y(c=>({controlsContainer:{display:"flex",flex:1,flexDirection:"row",justifyContent:"space-between",alignItems:"flex-end"}})),q=()=>{const{classes:c}=v(),[a,k]=s.useState(new Date),[o,C]=s.useState(new Date),[l,L]=s.useState([]),[T,d]=s.useState(!1),w=()=>{d(!0),setTimeout(()=>d(!1),1e3)},n=s.useCallback(t=>{const r=t?h(t):h(a);console.log(r)},[a]);s.useEffect(()=>{n()},[n]);const _=t=>{t&&(k(t),n(t))},E=t=>{t&&(C(t),n(t))},y=async()=>{const t=a||new Date,r=o||new Date;if(l.length===0){S("Export PDF","No data to export","error");return}S("Export PDF","Please wait...","success"),console.log(t,r)},I=l.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(x,{children:e.jsx(j,{color:i.titleText,children:"No data to display"})})})}):e.jsx(e.Fragment,{children:l.map((t,r)=>e.jsxs("tr",{children:[e.jsx("td",{children:t.title}),e.jsx("td",{children:t.status}),e.jsx("td",{children:z.fromISO(t.completionDeadline).toFormat(F)}),e.jsx("td",{children:t.description})]},r))});return e.jsxs(P,{spacing:D(5),children:[e.jsx(j,{fz:D(25),color:i.titleText,children:"Task Report"}),e.jsxs(R,{radius:"md",shadow:"md",sx:{minHeight:"94vh"},children:[e.jsxs("div",{className:c.controlsContainer,children:[e.jsxs(u,{children:[e.jsx(m,{radius:"md",label:"Start Date",placeholder:"Pick Date",value:a,onChange:_,required:!0,withAsterisk:!1,icon:e.jsx(p,{size:"1.2rem",stroke:1.5,color:i.titleText}),styles:{input:{width:200}}}),e.jsx(m,{radius:"md",label:"End Date",placeholder:"Pick Date",value:o,onChange:E,required:!0,withAsterisk:!1,icon:e.jsx(p,{size:"1.2rem",stroke:1.5,color:i.titleText}),styles:{input:{width:200}}})]}),e.jsxs(u,{children:[e.jsx(f,{variant:"filled",radius:"md",leftIcon:e.jsx(g,{size:"1.2rem",stroke:2}),size:"sm",onClick:w,children:"Search"}),e.jsx(f,{variant:"filled",radius:"md",leftIcon:e.jsx(g,{size:"1.2rem",stroke:2}),size:"sm",onClick:y,children:"Export PDF"})]})]}),T?e.jsx(x,{mt:"xs",children:e.jsx(A,{size:"lg",variant:"dots"})}):e.jsx(M,{children:e.jsxs(b,{sx:{minWidth:"800px"},verticalSpacing:"sm",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Title"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Deadline"}),e.jsx("th",{children:"Description"})]})}),e.jsx("tbody",{children:I})]})})]})]})};export{q as default};
