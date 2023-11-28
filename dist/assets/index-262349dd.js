import{a as R,e as b,R as s,b as A,k as e,Z as m,T as D,l as i,D as p,K as f,t as L,$ as S,C as Y,a0 as k,a1 as g,a2 as C,a3 as w,a4 as M,S as N,a5 as H,V as h}from"./index-4c56ab08.js";import{I as y}from"./IconFileExport-e57b867a.js";const q=R(x=>({controlsContainer:{display:"flex",flex:1,flexDirection:"row",justifyContent:"space-between",alignItems:"flex-end"}})),U=()=>{const{classes:x}=q(),{state:{token:j}}=b(),[r,I]=s.useState(new Date),[a,E]=s.useState(new Date),[c,O]=s.useState([]),{companyId:n}=A(),[T,B]=s.useState(!1),v=()=>{if(!n){h("Error","Invalid vehicle Id","error");return}d(r,a,n)},d=s.useCallback((t,o,l)=>{console.log(t,o,l,j)},[j]);s.useEffect(()=>{n&&d(r,a,n)},[d,n]);const _=t=>{t&&I(t)},z=t=>{t&&E(t)},F=async()=>{const t=r||new Date,o=a||new Date;if(c.length===0){h("Export PDF","No data to export","error");return}h("Export PDF","Please wait...","success"),console.log(t,o)},P=c.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(m,{children:e.jsx(D,{color:i.titleText,children:"No data to display"})})})}):e.jsx(e.Fragment,{children:c.map((t,o)=>{const l=p.fromISO(t.startDate),u=p.fromISO(t.endDate);return e.jsxs("tr",{children:[e.jsx("td",{children:t==null?void 0:t.name}),e.jsx("td",{children:l.toFormat(f)}),e.jsx("td",{children:u.toFormat(f)}),e.jsx("td",{children:u.diff(l).toFormat("hh:mm:ss")}),e.jsx("td",{children:t.type}),e.jsx("td",{children:t.status}),e.jsx("td",{children:t.reason}),e.jsx("td",{children:t.remarks})]},o)})});return e.jsxs(L,{spacing:S(5),children:[e.jsx(D,{fz:S(25),color:i.titleText,children:"Leaves Report"}),e.jsxs(Y,{radius:"md",shadow:"md",sx:{minHeight:"94vh"},children:[e.jsxs("div",{className:x.controlsContainer,children:[e.jsxs(k,{children:[e.jsx(g,{radius:"md",label:"Start Date",placeholder:"Pick Date",value:r,onChange:_,required:!0,withAsterisk:!1,icon:e.jsx(C,{size:"1.2rem",stroke:1.5,color:i.titleText}),styles:{input:{width:200}}}),e.jsx(g,{radius:"md",label:"End Date",placeholder:"Pick Date",value:a,onChange:z,required:!0,withAsterisk:!1,icon:e.jsx(C,{size:"1.2rem",stroke:1.5,color:i.titleText}),styles:{input:{width:200}}})]}),e.jsxs(k,{children:[e.jsx(w,{variant:"filled",radius:"md",leftIcon:e.jsx(y,{size:"1.2rem",stroke:2}),size:"sm",onClick:v,children:"Search"}),e.jsx(w,{variant:"filled",radius:"md",leftIcon:e.jsx(y,{size:"1.2rem",stroke:2}),size:"sm",onClick:F,children:"Export PDF"})]})]}),T?e.jsx(m,{mt:"xs",children:e.jsx(M,{size:"lg",variant:"dots"})}):e.jsx(N,{children:e.jsxs(H,{sx:{minWidth:"800px"},verticalSpacing:"sm",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Name"}),e.jsx("th",{children:"Start Date/Time"}),e.jsx("th",{children:"End Date/Time"}),e.jsx("th",{children:"Duration (hh:mm:ss)"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Reason"}),e.jsx("th",{children:"Remarks"})]})}),e.jsx("tbody",{children:P})]})})]})]})};export{U as default};
