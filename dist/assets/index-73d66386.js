import{c as z,e as b,R as t,b as F,j as e,a4 as j,T as u,l as c,D as R,L as A,v as Y,o as m,C as L,a5 as p,a6 as D,a7 as f,a8 as S,a9 as M,S as N,aa as H,X as d}from"./index-e03b4df2.js";import{I as g}from"./IconFileExport-2b43392d.js";const q=z(h=>({controlsContainer:{display:"flex",flex:1,flexDirection:"row",justifyContent:"space-between",alignItems:"flex-end"}})),W=()=>{const{classes:h}=q(),{state:{token:x}}=b(),[r,C]=t.useState(new Date),[a,k]=t.useState(new Date),[l,B]=t.useState([]),{vehicleId:n}=F(),[w,y]=t.useState(!1),I=()=>{if(console.log("called search"),!n){d("Error","Invalid vehicle Id","error");return}i(r,a,n)},i=t.useCallback((s,o,P)=>{y(!0),console.log(s,o,P,x)},[x]);t.useEffect(()=>{n&&i(r,a,n)},[i,n]);const T=s=>{s&&C(s)},_=s=>{s&&k(s)},v=async()=>{const s=r||new Date,o=a||new Date;if(l.length===0){d("Export PDF","No data to export","error");return}d("Export PDF","Please wait...","success"),console.log(s,o)},E=l.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(j,{children:e.jsx(u,{color:c.titleText,children:"No data to display"})})})}):e.jsx(e.Fragment,{children:l.map((s,o)=>e.jsxs("tr",{children:[e.jsx("td",{children:s==null?void 0:s.name}),e.jsx("td",{children:R.fromISO(s.service_date).toFormat(A)}),e.jsx("td",{children:s.type_name}),e.jsx("td",{children:s.status_name}),e.jsx("td",{children:s.description})]},o))});return e.jsxs(Y,{spacing:m(5),children:[e.jsx(u,{fz:m(25),color:c.titleText,children:"Team Performance Report"}),e.jsxs(L,{radius:"md",shadow:"md",sx:{minHeight:"94vh"},children:[e.jsxs("div",{className:h.controlsContainer,children:[e.jsxs(p,{children:[e.jsx(D,{radius:"md",label:"Start Date",placeholder:"Pick Date",value:r,onChange:T,required:!0,withAsterisk:!1,icon:e.jsx(f,{size:"1.2rem",stroke:1.5,color:c.titleText}),styles:{input:{width:200}}}),e.jsx(D,{radius:"md",label:"End Date",placeholder:"Pick Date",value:a,onChange:_,required:!0,withAsterisk:!1,icon:e.jsx(f,{size:"1.2rem",stroke:1.5,color:c.titleText}),styles:{input:{width:200}}})]}),e.jsxs(p,{children:[e.jsx(S,{variant:"filled",radius:"md",leftIcon:e.jsx(g,{size:"1.2rem",stroke:2}),size:"sm",onClick:()=>I(),children:"Search"}),e.jsx(S,{variant:"filled",radius:"md",leftIcon:e.jsx(g,{size:"1.2rem",stroke:2}),size:"sm",onClick:v,children:"Export PDF"})]})]}),w?e.jsx(j,{mt:"xs",children:e.jsx(M,{size:"lg",variant:"dots"})}):e.jsx(N,{children:e.jsxs(H,{sx:{minWidth:"800px"},verticalSpacing:"sm",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Name"}),e.jsx("th",{children:"Date/Time"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Description"})]})}),e.jsx("tbody",{children:E})]})})]})]})};export{W as default};
