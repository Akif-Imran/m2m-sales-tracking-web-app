import{c as k,o as D,ac as q,ad as M,d as F,e as z,R as h,ah as G,aS as U,Y as C,aT as L,aU as N,aV as R,j as e,al as V,am as $,x as T,G as B,p as _,a6 as H,a9 as b,C as O,F as v,T as m,M as S,A as Q,l as x,I as W,aH as Y,ay as X,B as J,W as K,aW as Z,aX as ee,a as se,f as ae,aY as te,q as re,m as oe,S as ne}from"./index-df60243a.js";const ce=k(r=>({})),ie=k({fileUploadButton:{marginTop:D(-32),marginLeft:D(128)}}),le=q().shape({name:M().required("Category name is required"),description:M().required("Category description is required")}),E=r=>{var w,A;const{opened:p,onClose:l,title:y,mode:i="add"}=r,{theme:P}=ie(),u=F(),{state:{token:g}}=z(),[j,d]=h.useState(!1),s=G({initialValues:{name:i==="edit"&&((w=r.record)==null?void 0:w.name)||"",description:i==="edit"&&((A=r.record)==null?void 0:A.description)||""},validationSchema:le,onSubmit:(t,n)=>{console.log(t),i==="add"?o(t,n):I(t,n)}}),f=()=>{s.resetForm(),l()},o=(t,n)=>{d(a=>!0),u(U({token:g,category:t})).unwrap().then(a=>{C("Add Purchase Category",a==null?void 0:a.message,a.success?"success":"error"),a.success&&(u(L(a.data)),n.resetForm(),l())}).catch(a=>{console.log("Add Purchase Category: ",a==null?void 0:a.message),C("Add Purchase Category","An error occurred","error")}).finally(()=>{d(a=>!1)})},I=(t,n)=>{var a;d(c=>!0),u(N({token:g,id:((a=r.record)==null?void 0:a._id)||"",category:t})).unwrap().then(c=>{C("Update Purchase Category",c==null?void 0:c.message,c.success?"success":"error"),c.success&&(u(R(c.data)),n.resetForm(),l())}).catch(c=>{console.log("Update Purchase Category: ",c==null?void 0:c.message),C("Update Purchase Category","An error occurred","error")}).finally(()=>{d(c=>!1)})};return h.useEffect(()=>{i==="edit"&&!r.record||s.setValues(t=>{var n,a;return{...t,name:i==="edit"&&((n=r.record)==null?void 0:n.name)||"",description:i==="edit"&&((a=r.record)==null?void 0:a.description)||""}})},[r.record,i]),e.jsx(V,{size:"md",withinPortal:!0,withOverlay:!0,title:y,opened:p,onClose:l,overlayProps:$(P),children:e.jsx(T,{children:e.jsx(B,{children:e.jsx(B.Col,{span:12,children:e.jsxs(T,{spacing:"xs",children:[e.jsx(_,{required:!0,withAsterisk:!1,label:"Name",name:"name",id:"name",value:s.values.name,onChange:s.handleChange,onBlur:s.handleBlur,error:s.touched.name&&s.errors.name?s.errors.name:""}),e.jsx(_,{required:!0,withAsterisk:!1,label:"Description",name:"description",id:"description",value:s.values.description,onChange:s.handleChange,onBlur:s.handleBlur,error:s.touched.description&&s.errors.description?s.errors.description:""}),e.jsxs(H,{align:"flex-end",position:"right",mt:D(32),children:[e.jsx(b,{variant:"outline",onClick:f,size:"xs",children:"Cancel"}),e.jsx(b,{size:"xs",variant:"filled",loading:j,onClick:()=>s.handleSubmit(),children:"Save"})]})]})})})})})},de=k(r=>({})),he=({item:r,setForEdit:p})=>{const{theme:l}=de(),y=F(),{state:{isAdmin:i,token:P}}=z(),[u,g]=h.useState(!1),j=f=>{K({theme:l,title:"Delete Purchase Category",loading:u,description:e.jsx(m,{fw:"normal",fs:"normal",fz:"sm",color:x.titleText,children:"Are you sure you want to delete this Purchase Category? This action is destructive and you will have to contact support to restore data."}),cancelLabel:"Cancel",confirmLabel:"Delete",onConfirm:()=>{g(o=>!0),y(Z({token:P,id:f})).unwrap().then(o=>{C("Delete Purchase Category",o==null?void 0:o.message,o.success?"success":"error"),o.success&&y(ee(f))}).catch(o=>{console.log("Delete Purchase Category: ",o==null?void 0:o.message),C("Delete Purchase Category","An error occurred","error")}).finally(()=>{g(o=>!1)})},onCancel:()=>C("Delete Purchase Category","Operation canceled!","error")})},d={fw:700,c:x.titleText,size:"sm"},s={fz:"sm",color:x.titleText};return e.jsx(O,{shadow:"md",m:"xs",children:e.jsx(T,{spacing:"xs",children:e.jsxs(v,{direction:"row",justify:"space-between",children:[e.jsxs(v,{direction:"column",columnGap:"sm",children:[e.jsxs(v,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(m,{...d,children:"Name: "}),e.jsx(m,{...s,children:r.name})]}),e.jsxs(v,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(m,{...d,children:"Description: "}),e.jsx(m,{...s,children:r.description})]})]}),i?e.jsxs(S,{withArrow:!0,withinPortal:!0,children:[e.jsx(S.Target,{children:e.jsx(Q,{color:x.titleText,children:e.jsx(W,{})})}),e.jsxs(S.Dropdown,{children:[e.jsx(S.Label,{children:"Options"}),e.jsx(S.Item,{onClick:()=>p(r),icon:e.jsx(Y,{size:16}),color:x.titleText,children:"Edit"}),e.jsx(S.Item,{color:"red",icon:e.jsx(X,{size:16}),onClick:()=>j(r._id),children:"Delete"})]})]}):e.jsx(J,{variant:"light",color:"red",children:e.jsx(m,{children:"Admin Required"})})]})})},r._id)},me=()=>{ce();const{state:{isAdmin:r}}=z(),{classes:p}=se(),{data:l}=ae(te),[y,i]=h.useState(""),[P,u]=h.useState(!1),[g,j]=h.useState(!1),[d,s]=h.useState([]),[f,o]=h.useState({}),I=h.useCallback(t=>{o(t),j(!0)},[]),w=t=>{i(t);const n=l.filter(a=>a.name.toLowerCase().includes(t.toLowerCase()));s(n)};h.useEffect(()=>{s(l)},[l]);const A=d.length===0?e.jsx("center",{children:e.jsx(m,{color:x.titleText,align:"center",children:"No Purchase categories"})}):e.jsx(e.Fragment,{children:d.map(t=>e.jsx(he,{item:t,setForEdit:I},t._id))});return e.jsx(O,{radius:"md",shadow:"md",h:"92vh",py:"xs",mb:"xs",children:e.jsxs(T,{children:[e.jsx(m,{fz:D(25),m:"xs",color:x.titleText,children:"Purchase Categories"}),e.jsxs(v,{gap:"md",m:"xs",className:p.searchContainer,children:[e.jsx(_,{value:y,className:p.searchInput,placeholder:"Search by any field",icon:e.jsx(re,{size:16}),onChange:t=>{var n;return w((n=t.target)==null?void 0:n.value)}}),r&&e.jsx(b,{variant:"filled",rightIcon:e.jsx(oe,{size:16}),onClick:()=>u(!0),children:"Category"})]}),e.jsx(ne,{type:"scroll",h:"72vh",children:A}),e.jsx(E,{mode:"add",title:"Add Category",record:void 0,opened:P,onClose:()=>u(!1)}),e.jsx(E,{mode:"edit",title:"Update Category",record:f,opened:g,onClose:()=>j(!1)})]})})};export{me as PurchaseCategories,me as default};
