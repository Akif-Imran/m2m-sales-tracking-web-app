import{c as k,o as A,ab as G,ac as M,d as B,e as z,R as d,ag as q,aJ as N,X as T,aK as P,aL as U,aM as R,j as e,ah as V,ai as $,v as D,G as F,y as _,a5 as H,a8 as b,C as L,F as S,T as m,M as E,A as Q,l as j,I as J,aF as K,ax as X,B as W,V as Y,aN as Z,aO as ee,a as se,f as ne,aP as te,z as ae,m as oe,S as re}from"./index-b8f12e27.js";const ce=k(t=>({})),ie=k({fileUploadButton:{marginTop:A(-32),marginLeft:A(128)}}),le=G().shape({name:M().required("Expense type name is required"),description:M().required("Expense type description is required")}),O=t=>{var v,w;const{opened:f,onClose:p,title:x,mode:c="add"}=t,{theme:g}=ie(),h=B(),{state:{token:u}}=z(),[C,l]=d.useState(!1),n=q({initialValues:{name:c==="edit"&&((v=t.record)==null?void 0:v.name)||"",description:c==="edit"&&((w=t.record)==null?void 0:w.description)||""},validationSchema:le,onSubmit:(i,a)=>{console.log(i),c==="add"?o(i,a):I(i,a)}}),y=()=>{n.resetForm(),p()},o=(i,a)=>{l(s=>!0),h(N({token:u,expenseType:i})).unwrap().then(s=>{T("Add Expense Type",s==null?void 0:s.message,s.success?"success":"error"),s.success&&(h(P(s.data)),a.resetForm(),p())}).catch(s=>{console.log("Add Expense Type: ",s==null?void 0:s.message),T("Add Expense Type","An error occurred","error")}).finally(()=>{l(s=>!1)})},I=(i,a)=>{var s;l(r=>!0),h(U({token:u,id:((s=t.record)==null?void 0:s._id)||"",expenseType:i})).unwrap().then(r=>{T("Update Expense Type",r==null?void 0:r.message,r.success?"success":"error"),r.success&&(h(R(r.data)),a.resetForm(),p())}).catch(r=>{console.log("Update Expense Type: ",r==null?void 0:r.message),T("Update Expense Type","An error occurred","error")}).finally(()=>{l(r=>!1)})};return d.useEffect(()=>{c==="edit"&&!t.record||n.setValues(i=>{var a,s;return{...i,name:c==="edit"&&((a=t.record)==null?void 0:a.name)||"",description:c==="edit"&&((s=t.record)==null?void 0:s.description)||""}})},[t.record,c]),e.jsx(V,{size:"md",withinPortal:!0,withOverlay:!0,title:x,opened:f,onClose:p,overlayProps:$(g),children:e.jsx(D,{children:e.jsx(F,{children:e.jsx(F.Col,{span:12,children:e.jsxs(D,{spacing:"xs",children:[e.jsx(_,{required:!0,withAsterisk:!1,label:"Name",name:"name",id:"name",value:n.values.name,onChange:n.handleChange,onBlur:n.handleBlur,error:n.touched.name&&n.errors.name?n.errors.name:""}),e.jsx(_,{required:!0,withAsterisk:!1,label:"Description",name:"description",id:"description",value:n.values.description,onChange:n.handleChange,onBlur:n.handleBlur,error:n.touched.description&&n.errors.description?n.errors.description:""}),e.jsxs(H,{align:"flex-end",position:"right",mt:A(32),children:[e.jsx(b,{variant:"outline",onClick:y,size:"xs",children:"Cancel"}),e.jsx(b,{size:"xs",variant:"filled",loading:C,onClick:()=>n.handleSubmit(),children:"Save"})]})]})})})})})},de=k(t=>({})),pe=({item:t,setForEdit:f})=>{const{theme:p}=de(),x=B(),{state:{isAdmin:c,token:g}}=z(),[h,u]=d.useState(!1),C=y=>{Y({theme:p,title:"Delete Expense Type",loading:h,description:e.jsx(m,{fw:"normal",fs:"normal",fz:"sm",color:j.titleText,children:"Are you sure you want to delete this Expense Type? This action is destructive and you will have to contact support to restore data."}),cancelLabel:"Cancel",confirmLabel:"Delete",onConfirm:()=>{u(o=>!0),x(Z({token:g,id:y})).unwrap().then(o=>{T("Delete Expense Type",o==null?void 0:o.message,o.success?"success":"error"),o.success&&x(ee(y))}).catch(o=>{console.log("Delete Expense Type: ",o==null?void 0:o.message),T("Delete Expense Type","An error occurred","error")}).finally(()=>{u(o=>!1)})},onCancel:()=>T("Delete Expense Type","Operation canceled!","error")})},l={fw:700,c:j.titleText,size:"sm"},n={fz:"sm",color:j.titleText};return e.jsx(L,{shadow:"md",m:"xs",children:e.jsx(D,{spacing:"xs",children:e.jsxs(S,{direction:"row",justify:"space-between",children:[e.jsxs(S,{direction:"column",columnGap:"sm",children:[e.jsxs(S,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(m,{...l,children:"Name: "}),e.jsx(m,{...n,children:t.name})]}),e.jsxs(S,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(m,{...l,children:"Description: "}),e.jsx(m,{...n,children:t.description})]})]}),c?e.jsxs(E,{withArrow:!0,withinPortal:!0,children:[e.jsx(E.Target,{children:e.jsx(Q,{color:j.titleText,children:e.jsx(J,{})})}),e.jsxs(E.Dropdown,{children:[e.jsx(E.Label,{children:"Options"}),e.jsx(E.Item,{onClick:()=>f(t),icon:e.jsx(K,{size:16}),color:j.titleText,children:"Edit"}),e.jsx(E.Item,{color:"red",icon:e.jsx(X,{size:16}),onClick:()=>C(t._id),children:"Delete"})]})]}):e.jsx(W,{variant:"light",color:"red",children:e.jsx(m,{children:"Admin Required"})})]})})},t._id)},he=()=>{ce();const{state:{isAdmin:t,isHR:f}}=z(),{classes:p}=se(),{data:x}=ne(te),[c,g]=d.useState(""),[h,u]=d.useState(!1),[C,l]=d.useState(!1),[n,y]=d.useState([]),[o,I]=d.useState({}),v=d.useCallback(a=>{I(a),l(!0)},[]),w=a=>{if(g(a),t||f){const s=x.filter(r=>r.name.toLowerCase().includes(a.toLowerCase()));y(s)}};d.useEffect(()=>{y(x)},[t,f,x]);const i=n.length===0?e.jsx("center",{children:e.jsx(m,{color:j.titleText,align:"center",children:"No Expense types"})}):e.jsx(e.Fragment,{children:n.map(a=>e.jsx(pe,{item:a,setForEdit:v},a._id))});return e.jsx(L,{radius:"md",shadow:"md",h:"92vh",py:"xs",mb:"xs",children:e.jsxs(D,{children:[e.jsx(m,{fz:A(25),m:"xs",color:j.titleText,children:"Expense Types"}),e.jsxs(S,{gap:"md",m:"xs",className:p.searchContainer,children:[e.jsx(_,{value:c,className:p.searchInput,placeholder:"Search by any field",icon:e.jsx(ae,{size:16}),onChange:a=>{var s;return w((s=a.target)==null?void 0:s.value)}}),t&&e.jsx(b,{variant:"filled",rightIcon:e.jsx(oe,{size:16}),onClick:()=>u(!0),children:"Expense Type"})]}),e.jsx(re,{type:"scroll",h:"72vh",children:i}),e.jsx(O,{mode:"add",title:"Add Expense Type",record:void 0,opened:h,onClose:()=>u(!1)}),e.jsx(O,{mode:"edit",title:"Update Expense Type",record:o,opened:C,onClose:()=>l(!1)})]})})};export{he as ExpenseTypes,he as default};
