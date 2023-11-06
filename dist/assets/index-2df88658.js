import{a as R,e as b,R as s,b as A,k as e,l as m,T as D,m as i,D as p,E as f,n as Y,P as S,C as L,U as k,V as g,W as C,X as w,Y as M,S as N,Z as H,K as h}from"./index-62f20919.js";import{I as y}from"./IconFileExport-fc1f83b7.js";const q=R(x=>({controlsContainer:{display:"flex",flex:1,flexDirection:"row",justifyContent:"space-between",alignItems:"flex-end"}})),G=()=>{const{classes:x}=q(),{state:{token:j}}=b(),[r,E]=s.useState(new Date),[a,I]=s.useState(new Date),[c,O]=s.useState([]),{companyId:n}=A(),[T,U]=s.useState(!1),v=()=>{if(!n){h("Error","Invalid vehicle Id","error");return}d(r,a,n)},d=s.useCallback((t,o,l)=>{console.log(t,o,l,j)},[j]);s.useEffect(()=>{n&&d(r,a,n)},[d,n]);const P=t=>{t&&E(t)},_=t=>{t&&I(t)},z=async()=>{const t=r||new Date,o=a||new Date;if(c.length===0){h("Export PDF","No data to export","error");return}h("Export PDF","Please wait...","success"),console.log(t,o)},F=c.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(m,{children:e.jsx(D,{color:i.titleText,children:"No data to display"})})})}):e.jsx(e.Fragment,{children:c.map((t,o)=>{const l=p.fromISO(t.startDate),u=p.fromISO(t.endDate);return e.jsxs("tr",{children:[e.jsx("td",{children:t==null?void 0:t.name}),e.jsx("td",{children:l.toFormat(f)}),e.jsx("td",{children:u.toFormat(f)}),e.jsx("td",{children:u.diff(l).toFormat("hh:mm:ss")}),e.jsx("td",{children:t.type}),e.jsx("td",{children:t.status}),e.jsx("td",{children:t.reason}),e.jsx("td",{children:t.remarks})]},o)})});return e.jsxs(Y,{spacing:S(5),children:[e.jsx(D,{fz:S(25),color:i.titleText,children:"Leaves Report"}),e.jsxs(L,{radius:"md",shadow:"md",sx:{minHeight:"94vh"},children:[e.jsxs("div",{className:x.controlsContainer,children:[e.jsxs(k,{children:[e.jsx(g,{radius:"md",label:"Start Date",placeholder:"Pick Date",value:r,onChange:P,required:!0,withAsterisk:!1,icon:e.jsx(C,{size:"1.2rem",stroke:1.5,color:i.titleText}),styles:{input:{width:200}}}),e.jsx(g,{radius:"md",label:"End Date",placeholder:"Pick Date",value:a,onChange:_,required:!0,withAsterisk:!1,icon:e.jsx(C,{size:"1.2rem",stroke:1.5,color:i.titleText}),styles:{input:{width:200}}})]}),e.jsxs(k,{children:[e.jsx(w,{variant:"filled",radius:"md",leftIcon:e.jsx(y,{size:"1.2rem",stroke:2}),size:"sm",onClick:v,children:"Search"}),e.jsx(w,{variant:"filled",radius:"md",leftIcon:e.jsx(y,{size:"1.2rem",stroke:2}),size:"sm",onClick:z,children:"Export PDF"})]})]}),T?e.jsx(m,{mt:"xs",children:e.jsx(M,{size:"lg",variant:"dots"})}):e.jsx(N,{children:e.jsxs(H,{sx:{minWidth:"800px"},verticalSpacing:"sm",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Name"}),e.jsx("th",{children:"Start Date/Time"}),e.jsx("th",{children:"End Date/Time"}),e.jsx("th",{children:"Duration (hh:mm:ss)"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Reason"}),e.jsx("th",{children:"Remarks"})]})}),e.jsx("tbody",{children:F})]})})]})]})};export{G as default};