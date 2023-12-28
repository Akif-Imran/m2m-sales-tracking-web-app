import{c as M,o as G,ac as Y,ad as f,d as Q,e as O,R as u,ah as X,aD as Z,Y as C,aE as ee,aF as re,aG as se,j as e,al as ae,am as te,x as z,G as V,p as x,a6 as _,a9 as F,C as J,F as c,T as l,M as A,A as le,l as b,I as ie,aH as ne,ay as de,B as oe,K as W,W as ce,aI as ue,aJ as he,a as me,f as pe,aK as xe,q as je,m as Se,S as fe}from"./index-5cd21567.js";const ge=M(s=>({})),we=M({fileUploadButton:{marginTop:G(-32),marginLeft:G(128)}}),ye=Y().shape({name:f().required("Supplier name is required"),email:f().email("Invalid email address").required("Supplier email is required"),mobile:f().required("Supplier mobile is required"),address:f().required("Supplier address is required"),city:f().required("Supplier city is required"),state:f().required("Supplier state is required"),country:f().required("Supplier country is required"),website:f().url().required("Supplier website is required")}),K=s=>{var k,I,D,o,y,T,L,P;const{opened:v,onClose:h,title:j,mode:a="add"}=s,{theme:q}=we(),g=Q(),{state:{token:S}}=O(),[B,i]=u.useState(!1),r=X({initialValues:{name:a==="edit"&&((k=s.record)==null?void 0:k.name)||"",email:a==="edit"&&((I=s.record)==null?void 0:I.email)||"",mobile:a==="edit"&&((D=s.record)==null?void 0:D.mobile)||"",address:a==="edit"&&((o=s.record)==null?void 0:o.address)||"",city:a==="edit"&&((y=s.record)==null?void 0:y.city)||"",state:a==="edit"&&((T=s.record)==null?void 0:T.state)||"",country:a==="edit"&&((L=s.record)==null?void 0:L.country)||"",website:a==="edit"&&((P=s.record)==null?void 0:P.website)||""},validationSchema:ye,onSubmit:(m,p)=>{console.log(m),a==="add"?n(m,p):E(m,p)}}),w=()=>{r.resetForm(),h()},n=(m,p)=>{i(t=>!0),g(Z({token:S,supplier:{...m,businessCard:"na",designation:"na",department:"na",customerId:"652506a266869aaf01825588"}})).unwrap().then(t=>{C("Add Supplier",t==null?void 0:t.message,t.success?"success":"error"),t.success&&(ee(t.data),p.resetForm(),h())}).catch(t=>{console.log("Add Supplier: ",t==null?void 0:t.message),C("Add Supplier","An error occurred","error")}).finally(()=>{i(t=>!1)})},E=(m,p)=>{var t;i(d=>!0),g(re({token:S,id:((t=s.record)==null?void 0:t._id)||"",supplier:{...m,businessCard:"na",designation:"na",department:"na",customerId:"652506a266869aaf01825588"}})).unwrap().then(d=>{C("Update Supplier",d==null?void 0:d.message,d.success?"success":"error"),d.success&&(g(se(d.data)),p.resetForm(),h())}).catch(d=>{console.log("Update Supplier: ",d==null?void 0:d.message),C("Update Supplier","An error occurred","error")}).finally(()=>{i(d=>!1)})};return u.useEffect(()=>{a==="edit"&&!s.record||r.setValues(m=>{var p,t,d,U,R,N,H,$;return{...m,name:a==="edit"&&((p=s.record)==null?void 0:p.name)||"",email:a==="edit"&&((t=s.record)==null?void 0:t.email)||"",mobile:a==="edit"&&((d=s.record)==null?void 0:d.mobile)||"",address:a==="edit"&&((U=s.record)==null?void 0:U.address)||"",city:a==="edit"&&((R=s.record)==null?void 0:R.city)||"",state:a==="edit"&&((N=s.record)==null?void 0:N.state)||"",country:a==="edit"&&((H=s.record)==null?void 0:H.country)||"",website:a==="edit"&&(($=s.record)==null?void 0:$.website)||""}})},[s.record,a]),e.jsx(ae,{size:"xl",withinPortal:!0,withOverlay:!0,title:j,opened:v,onClose:h,overlayProps:te(q),children:e.jsx(z,{children:e.jsx(V,{children:e.jsx(V.Col,{span:12,children:e.jsxs(z,{spacing:"xs",children:[e.jsx(x,{required:!0,withAsterisk:!1,label:"Name",name:"name",id:"name",value:r.values.name,onChange:r.handleChange,onBlur:r.handleBlur,error:r.touched.name&&r.errors.name?r.errors.name:""}),e.jsxs(_,{grow:!0,align:"flex-start",children:[e.jsx(x,{required:!0,withAsterisk:!1,label:"Email",name:"email",id:"email",value:r.values.email,onChange:r.handleChange,onBlur:r.handleBlur,error:r.touched.email&&r.errors.email?r.errors.email:""}),e.jsx(x,{required:!0,withAsterisk:!1,label:"Phone",name:"mobile",id:"mobile",value:r.values.mobile,onChange:r.handleChange,onBlur:r.handleBlur,error:r.touched.mobile&&r.errors.mobile?r.errors.mobile:""})]}),e.jsx(x,{required:!0,withAsterisk:!1,label:"Address",name:"address",id:"address",value:r.values.address,onChange:r.handleChange,onBlur:r.handleBlur,error:r.touched.address&&r.errors.address?r.errors.address:""}),e.jsxs(_,{grow:!0,align:"flex-start",children:[e.jsx(x,{required:!0,withAsterisk:!1,label:"City",name:"city",id:"city",value:r.values.city,onChange:r.handleChange,onBlur:r.handleBlur,error:r.touched.city&&r.errors.city?r.errors.city:""}),e.jsx(x,{required:!0,withAsterisk:!1,label:"State",name:"state",id:"state",value:r.values.state,onChange:r.handleChange,onBlur:r.handleBlur,error:r.touched.state&&r.errors.state?r.errors.state:""})]}),e.jsxs(_,{grow:!0,align:"flex-start",children:[e.jsx(x,{required:!0,withAsterisk:!1,label:"Country",name:"country",id:"country",value:r.values.country,onChange:r.handleChange,onBlur:r.handleBlur,error:r.touched.country&&r.errors.country?r.errors.country:""}),e.jsx(x,{required:!0,withAsterisk:!1,label:"Website URL",placeholder:"https://www.example.com",name:"website",id:"website",value:r.values.website,onChange:r.handleChange,onBlur:r.handleBlur,error:r.touched.website&&r.errors.website?r.errors.website:""})]}),e.jsxs(_,{align:"flex-end",position:"right",mt:G(32),children:[e.jsx(F,{variant:"outline",onClick:w,size:"xs",children:"Cancel"}),e.jsx(F,{size:"xs",variant:"filled",loading:B,onClick:()=>r.handleSubmit(),children:"Save"})]})]})})})})})},be=M(s=>({})),Ce=({item:s,setForEdit:v})=>{const{theme:h}=be(),j=Q(),{state:{isAdmin:a,token:q}}=O(),[g,S]=u.useState(!1),B=w=>{ce({theme:h,title:"Delete Supplier",loading:g,description:e.jsx(l,{fw:"normal",fs:"normal",fz:"sm",color:b.titleText,children:"Are you sure you want to delete this supplier? This action is destructive and you will have to contact support to restore data."}),cancelLabel:"Cancel",confirmLabel:"Delete Supplier",onConfirm:()=>{S(n=>!0),j(ue({token:q,id:w})).unwrap().then(n=>{C("Delete Supplier",n==null?void 0:n.message,n.success?"success":"error"),n.success&&j(he(w))}).catch(n=>{console.log("Delete Supplier: ",n==null?void 0:n.message),C("Delete Supplier","An error occurred","error")}).finally(()=>{S(n=>!1)})},onCancel:()=>C("Delete Supplier","Operation canceled!","error")})},i={fw:700,c:b.titleText,size:"sm"},r={fz:"sm",color:b.titleText};return e.jsx(J,{shadow:"md",m:"xs",children:e.jsxs(z,{spacing:"xs",children:[e.jsxs(c,{direction:"row",justify:"space-between",children:[e.jsxs(c,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(l,{...i,children:"Name: "}),e.jsx(l,{...r,children:s.name})]}),a?e.jsxs(A,{withArrow:!0,withinPortal:!0,children:[e.jsx(A.Target,{children:e.jsx(le,{color:b.titleText,children:e.jsx(ie,{})})}),e.jsxs(A.Dropdown,{children:[e.jsx(A.Label,{children:"Options"}),e.jsx(A.Item,{onClick:()=>v(s),icon:e.jsx(ne,{size:16}),color:b.titleText,children:"Edit"}),e.jsx(A.Item,{color:"red",icon:e.jsx(de,{size:16}),onClick:()=>B(s._id),children:"Delete"})]})]}):e.jsx(oe,{variant:"light",color:"red",children:e.jsx(l,{children:"Admin Required"})})]}),e.jsxs(c,{direction:"column",justify:"flex-start",m:0,p:0,children:[e.jsxs(c,{direction:"row",align:"flex-start",columnGap:"sm",children:[e.jsx(l,{...i,children:"Phone: "}),e.jsx(l,{...r,children:s.mobile})]}),e.jsxs(c,{direction:"row",align:"flex-start",columnGap:"sm",children:[e.jsx(l,{...i,children:"Email: "}),e.jsx(W,{href:s.email,...r,color:"blue",children:s.email})]}),e.jsxs(c,{direction:"row",align:"flex-start",columnGap:"sm",children:[e.jsx(l,{...i,children:"City:"}),e.jsx(l,{...r,children:s.city})]}),e.jsxs(c,{direction:"row",align:"flex-start",columnGap:"sm",children:[e.jsx(l,{...i,children:"State: "}),e.jsx(l,{...r,children:s.state})]}),e.jsxs(c,{direction:"row",align:"flex-start",columnGap:"sm",children:[e.jsx(l,{...i,children:"Country: "}),e.jsx(l,{...r,children:s.state})]}),e.jsxs(c,{direction:"row",align:"flex-start",columnGap:"sm",children:[e.jsx(l,{...i,children:"Website: "}),e.jsx(W,{href:s.website,...r,color:"blue",children:s.website})]}),e.jsxs(c,{direction:"row",align:"flex-start",columnGap:"sm",children:[e.jsx(l,{...i,children:"Address: "}),e.jsx(l,{...r,children:s.address})]})]})]})},s._id)},Ae=()=>{ge();const{state:{isAdmin:s,isHR:v}}=O(),{classes:h}=me(),{data:j}=pe(xe),[a,q]=u.useState(""),[g,S]=u.useState(!1),[B,i]=u.useState(!1),[r,w]=u.useState([]),[n,E]=u.useState({}),k=u.useCallback(o=>{E(o),i(!0)},[]),I=o=>{if(q(o),s||v){const y=j.filter(T=>T.name.toLowerCase().includes(o.toLowerCase()));w(y)}};u.useEffect(()=>{w(j)},[s,v,j]);const D=r.length===0?e.jsx("center",{children:e.jsx(l,{color:b.titleText,align:"center",children:"No Suppliers"})}):e.jsx(e.Fragment,{children:r.map(o=>e.jsx(Ce,{item:o,setForEdit:k},o._id))});return e.jsx(J,{radius:"md",shadow:"md",h:"92vh",py:"xs",mb:"xs",children:e.jsxs(z,{children:[e.jsx(l,{fz:G(25),m:"xs",color:b.titleText,children:"Suppliers"}),e.jsxs(c,{gap:"md",m:"xs",className:h.searchContainer,children:[e.jsx(x,{value:a,className:h.searchInput,placeholder:"Search by any field",icon:e.jsx(je,{size:16}),onChange:o=>{var y;return I((y=o.target)==null?void 0:y.value)}}),s&&e.jsx(F,{variant:"filled",rightIcon:e.jsx(Se,{size:16}),onClick:()=>S(!0),children:"Supplier"})]}),e.jsx(fe,{type:"scroll",h:"72vh",children:D}),e.jsx(K,{mode:"add",title:"Add Supplier",record:void 0,opened:g,onClose:()=>S(!1)}),e.jsx(K,{mode:"edit",title:"Update Supplier",record:n,opened:B,onClose:()=>i(!1)})]})})};export{Ae as Suppliers,Ae as default};
