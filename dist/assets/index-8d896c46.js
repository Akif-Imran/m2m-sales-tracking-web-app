import{c as b,e as z,R as t,b as F,j as e,a5 as j,T as u,l as c,D as R,N as A,x as Y,o as m,C as N,a6 as p,a7 as D,a8 as f,a9 as S,aa as M,S as H,ab as L,Y as d}from"./index-5cd21567.js";import{I as g}from"./IconFileExport-aaa38359.js";const q=b(h=>({controlsContainer:{display:"flex",flex:1,flexDirection:"row",justifyContent:"space-between",alignItems:"flex-end"}})),W=()=>{const{classes:h}=q(),{state:{token:x}}=z(),[r,C]=t.useState(new Date),[a,k]=t.useState(new Date),[l,B]=t.useState([]),{vehicleId:n}=F(),[w,y]=t.useState(!1),I=()=>{if(console.log("called search"),!n){d("Error","Invalid vehicle Id","error");return}i(r,a,n)},i=t.useCallback((s,o,v)=>{y(!0),console.log(s,o,v,x)},[x]);t.useEffect(()=>{n&&i(r,a,n)},[i,n]);const T=s=>{s&&C(s)},_=s=>{s&&k(s)},E=async()=>{const s=r||new Date,o=a||new Date;if(l.length===0){d("Export PDF","No data to export","error");return}d("Export PDF","Please wait...","success"),console.log(s,o)},P=l.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(j,{children:e.jsx(u,{color:c.titleText,children:"No data to display"})})})}):e.jsx(e.Fragment,{children:l.map((s,o)=>e.jsxs("tr",{children:[e.jsx("td",{children:s==null?void 0:s.name}),e.jsx("td",{children:R.fromISO(s.service_date).toFormat(A)}),e.jsx("td",{children:s.type_name}),e.jsx("td",{children:s.status_name}),e.jsx("td",{children:s.description})]},o))});return e.jsxs(Y,{spacing:m(5),children:[e.jsx(u,{fz:m(25),color:c.titleText,children:"Team Performance Report"}),e.jsxs(N,{radius:"md",shadow:"md",sx:{minHeight:"94vh"},children:[e.jsxs("div",{className:h.controlsContainer,children:[e.jsxs(p,{children:[e.jsx(D,{radius:"md",label:"Start Date",placeholder:"Pick Date",value:r,onChange:T,required:!0,withAsterisk:!1,icon:e.jsx(f,{size:"1.2rem",stroke:1.5,color:c.titleText}),styles:{input:{width:200}}}),e.jsx(D,{radius:"md",label:"End Date",placeholder:"Pick Date",value:a,onChange:_,required:!0,withAsterisk:!1,icon:e.jsx(f,{size:"1.2rem",stroke:1.5,color:c.titleText}),styles:{input:{width:200}}})]}),e.jsxs(p,{children:[e.jsx(S,{variant:"filled",radius:"md",leftIcon:e.jsx(g,{size:"1.2rem",stroke:2}),size:"sm",onClick:()=>I(),children:"Search"}),e.jsx(S,{variant:"filled",radius:"md",leftIcon:e.jsx(g,{size:"1.2rem",stroke:2}),size:"sm",onClick:E,children:"Export PDF"})]})]}),w?e.jsx(j,{mt:"xs",children:e.jsx(M,{size:"lg",variant:"dots"})}):e.jsx(H,{children:e.jsxs(L,{sx:{minWidth:"800px"},verticalSpacing:"sm",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Name"}),e.jsx("th",{children:"Date/Time"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Description"})]})}),e.jsx("tbody",{children:P})]})})]})]})};export{W as default};
