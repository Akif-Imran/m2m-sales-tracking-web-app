import{u as be,a as ve,b as Pe,d as Me,e as Ne,f as _,s as Fe,a0 as Ge,h as Te,i as ze,R as l,j as e,C as j,k as u,F as r,T as i,t as a,M as x,A as F,I as W,l as m,m as S,n as f,r as Oe,G as g,o as C,S as G,B,p as q,q as ke,v as J,w as o,D as I,x as K,y as X,z as Z,Q as Ye,E as U,H as Re,J as Ee,K as Qe,L,a1 as $e,N as Ve,O as He,P as We,U as Be,c as qe,V as ee,W as Je,X as w,Y as Ke,Z as Xe,$ as Ze}from"./index-b8f12e27.js";import{I as Ue,a as se}from"./IconTrashFilled-f0c50bd8.js";const ns=()=>{var H;const{theme:b}=Le(),ne=be(),{classes:T}=ve(),{companyId:p}=Pe();console.log(p);const A=Me(),{state:{token:z,user:v,isAdmin:ie}}=Ne(),D=_(Fe),P=_(Ge),{data:O}=_(Te),{data:M}=_(ze),[re,k]=l.useState(!1),[te,ae]=l.useState(!0),[d,oe]=l.useState(),[ce,le]=l.useState([]),[de,Y]=l.useState([]),[xe,N]=l.useState([]),[n,R]=l.useState(),[he,E]=l.useState(!1),[me,Q]=l.useState(!1),[je,$]=l.useState(!1),[ue,V]=l.useState(!1),[pe,ge]=l.useState(""),[Ce,ye]=l.useState(!1),[fe,we]=l.useState("");l.useEffect(()=>{if(!p)return;const s=O.find(c=>c._id===p),t=P.filter(c=>c.customerId===p),h=M.filter(c=>c.customerId===p);Y(h),le(t),oe(s),t.length>0&&(R(t[0]),N(D.filter(c=>c.projectId===t[0]._id))),ae(c=>!1)},[p,O,P,M,D]);const Ae=s=>{const t=P.find(c=>c._id===s);R(t);const h=D.filter(c=>c.projectId===s);N(h)},De=s=>{ee({theme:b,title:"Delete Company",loading:!1,description:e.jsx(i,{fw:"normal",fs:"normal",fz:"sm",color:m.titleText,children:"Are you sure you want to delete this Company? This action is destructive and you will have to company support to restore data."}),cancelLabel:"Cancel",confirmLabel:"Delete Company",onConfirm:()=>{A(Je({id:s,token:z})).unwrap().then(t=>{w("Delete Company",t==null?void 0:t.message,t.success?"success":"error"),t.success&&A(Ke(t.data._id))}).catch(t=>{console.log(t==null?void 0:t.message)})},onCancel:()=>w("Delete Company","Operation canceled!","error")})},_e=s=>{ee({theme:b,title:"Delete",loading:re,description:e.jsx(i,{fw:"normal",fs:"normal",fz:"sm",color:m.titleText,children:"Are you sure you want to delete this Contact Person? This action is destructive and you will have to contact support to restore data."}),cancelLabel:"Cancel",confirmLabel:"Delete",onConfirm:()=>{k(t=>!0),A(Xe({token:z,id:s})).unwrap().then(t=>{w("Delete Contact",t==null?void 0:t.message,t.success?"success":"error"),t.success&&A(Ze(t.data._id))}).catch(t=>{console.log("Delete Contact: ",t==null?void 0:t.message),w("Delete Contact","An error occurred","error")}).finally(()=>{k(t=>!1)})},onCancel:()=>w("Delete","Operation canceled!","error")})},Se=s=>{ge(s);const t=M.filter(h=>h.name.toLowerCase().includes(s.toLowerCase())&&h.customerId===p);Y(t)},Ie=s=>{we(s);const t=D.filter(h=>h.projectId===(n==null?void 0:n._id)).filter((h,c)=>{var y;return`${c+1}`.toLowerCase().includes(s.toLowerCase())||((y=h.contactPerson)==null?void 0:y.name.toLowerCase().includes(s.toLowerCase()))||h.meetingPlace.toLowerCase().includes(s.toLowerCase())});N(t)};return te?e.jsx("div",{children:"Loading..."}):d?e.jsxs(e.Fragment,{children:[e.jsx(j,{...u,children:e.jsxs(r,{direction:"row",justify:"space-between",align:"center",w:"100%",children:[e.jsx(i,{...a,size:"xl",align:"center"}),e.jsx(i,{...a,size:"xl",align:"center",children:d==null?void 0:d.name}),e.jsxs(x,{withArrow:!0,withinPortal:!0,position:"right-start",children:[e.jsx(x.Target,{children:e.jsx(F,{children:e.jsx(W,{size:16,stroke:1.3,color:m.titleText})})}),e.jsxs(x.Dropdown,{children:[e.jsx(x.Label,{children:"New"}),e.jsx(x.Item,{color:m.titleText,icon:e.jsx(S,{...f}),onClick:()=>Q(!0),children:"Project"}),e.jsx(x.Item,{color:m.titleText,icon:e.jsx(S,{...f}),onClick:()=>V(!0),children:"Purchase Request"}),e.jsx(x.Item,{color:m.titleText,icon:e.jsx(S,{...f}),onClick:()=>$(!0),children:"Expense / Claim"}),e.jsx(x.Label,{children:"Options"}),e.jsx(x.Item,{c:m.titleText,icon:e.jsx(Ue,{...f}),onClick:s=>{s.stopPropagation(),ne(Oe.reports.list_nav(d==null?void 0:d._id))},children:"Reports"}),ie&&e.jsx(x.Item,{color:"red",icon:e.jsx(se,{size:f.size}),onClick:s=>{s.stopPropagation(),De(d==null?void 0:d._id)},children:"Delete"})]})]})]})}),e.jsxs(g,{children:[e.jsxs(g.Col,{span:3,children:[e.jsx(j,{...u,h:C(56),children:e.jsx(i,{...a,size:"md",mt:C(4),children:"Prospects"})}),e.jsx(G,{type:"scroll",h:"80vh",children:ce.map(s=>e.jsx(j,{shadow:"sm",mb:"xs",px:"sm",py:"xs",radius:"md",onClick:()=>Ae(s._id),children:e.jsxs(r,{direction:"row",justify:"space-between",align:"center",children:[e.jsxs(r,{direction:"column",align:"flex-start",children:[e.jsx(i,{...a,children:s.name}),e.jsx(B,{variant:"filled",color:q[s.status],children:s==null?void 0:s.statusName})]}),(n==null?void 0:n._id)===s._id&&e.jsx(ke,{size:24,color:m.titleText})]})},s._id))})]}),e.jsx(g.Col,{span:9,children:e.jsxs(J,{spacing:"xs",children:[e.jsxs(g,{children:[e.jsxs(g.Col,{span:7,children:[e.jsx(j,{...u,h:C(56),children:e.jsx(J,{spacing:"xs",children:e.jsxs(r,{direction:"row",align:"center",mt:C(4),children:[e.jsx(i,{...a,size:"md",children:"Details"}),(n==null?void 0:n.status)&&e.jsx(B,{ml:"lg",variant:"filled",color:q[n==null?void 0:n.status],children:n==null?void 0:n.statusName})]})})}),n&&e.jsx(j,{...u,children:e.jsxs(r,{direction:"column",children:[e.jsxs(r,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(i,{...a,children:"Name: "}),e.jsx(i,{...o,children:(n==null?void 0:n.name)||"N/A"})]}),e.jsxs(r,{direction:"row",align:"center",justify:"space-between",children:[e.jsxs(r,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(i,{...a,children:"Type: "}),e.jsx(i,{...o,children:(n==null?void 0:n.type)||"N/A"})]}),e.jsxs(r,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(i,{...a,children:"Salesman: "}),e.jsx(i,{...o,children:n!=null&&n.salesPerson?(n==null?void 0:n.salesPerson)===(v==null?void 0:v._id)?"(You)":(H=n==null?void 0:n.salesPersonValue)==null?void 0:H.name:"N/A"})]})]}),e.jsxs(r,{direction:"row",align:"center",justify:"space-between",children:[e.jsxs(r,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(i,{...a,children:"Value: "}),e.jsx(i,{...o,children:n!=null&&n.value?Intl.NumberFormat("en-US",{style:"currency",currency:n==null?void 0:n.value.currency,maximumFractionDigits:2,minimumFractionDigits:2}).format(n==null?void 0:n.value.amount):"N/A"})]}),e.jsxs(r,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(i,{...a,children:"Contract Date: "}),e.jsx(i,{...o,children:n!=null&&n.contractDate?I.fromISO(n==null?void 0:n.contractDate).toFormat(K):"N/A"})]})]}),e.jsxs(r,{direction:"row",align:"center",justify:"space-between",children:[e.jsxs(r,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(i,{...a,children:"Quotation: "}),e.jsx(i,{...o,children:(n==null?void 0:n.quotation)||"N/A"})]}),e.jsxs(r,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(i,{...a,children:"Delivery Date: "}),e.jsx(i,{...o,children:n!=null&&n.deliveryDate?I.fromISO(n==null?void 0:n.deliveryDate).toFormat(K):"N/A"})]})]}),e.jsxs(r,{direction:"row",align:"flex-start",columnGap:"sm",children:[e.jsx(i,{...a,children:"Description: "}),e.jsx(i,{...o,children:(n==null?void 0:n.description)||"N/A"})]})]})})]}),e.jsxs(g.Col,{span:5,children:[e.jsx(j,{...u,h:C(56),children:e.jsxs(r,{direction:"row",justify:"space-between",align:"center",children:[e.jsx(i,{...a,size:"md",children:"Contacts"}),e.jsxs(r,{direction:"row",columnGap:"xs",align:"center",children:[e.jsx(X,{size:"xs",radius:"md",value:pe,className:T.searchInput,placeholder:"Search by any field",icon:e.jsx(Z,{size:16}),onChange:s=>{var t;return Se((t=s.target)==null?void 0:t.value)}}),e.jsx(F,{variant:"filled",size:"sm",color:"dark",onClick:()=>E(!0),children:e.jsx(S,{size:16,stroke:1.3,color:m.white})})]})]})}),e.jsx(G,{type:"scroll",h:"36vh",children:de.map(s=>e.jsx(j,{...u,children:e.jsx(l.Fragment,{children:e.jsxs(r,{direction:"row",justify:"flex-start",align:"flex-start",columnGap:"sm",children:[e.jsx(r,{my:"auto",children:e.jsx(Ye,{src:s.businessCard?`${U}\\${s.businessCard}`:"/user.png",children:e.jsx(Re,{src:s.businessCard?`${U}\\${s.businessCard}`:"/user.png",size:88})},s._id)}),e.jsxs(r,{direction:"column",w:"100%",children:[e.jsxs(r,{direction:"row",justify:"space-between",align:"center",children:[e.jsxs(r,{direction:"row",align:"center",justify:"flex-start",children:[e.jsx(i,{...a,mr:"xs",children:"Name:"}),e.jsx(i,{...o,children:(s==null?void 0:s.name)||"N/A"})]}),e.jsxs(x,{withinPortal:!0,withArrow:!0,position:"bottom-end",children:[e.jsx(x.Target,{children:e.jsx(F,{children:e.jsx(W,{size:16,stroke:1.3,color:m.titleText})})}),e.jsxs(x.Dropdown,{children:[e.jsx(x.Label,{children:"Options"}),e.jsx(x.Item,{color:"red",icon:e.jsx(se,{stroke:1.3,size:16}),onClick:()=>_e(s._id),children:"Delete"})]})]})]}),e.jsxs(r,{direction:"row",align:"center",justify:"flex-start",children:[e.jsx(i,{...a,mr:"xs",children:"Email:"}),e.jsx(Ee,{...o,href:s==null?void 0:s.email,target:"_blank",c:"blue",children:(s==null?void 0:s.email)||"N/A"})]}),e.jsxs(r,{direction:"row",align:"center",justify:"flex-start",children:[e.jsx(i,{...a,mr:"xs",children:"Mobile No.:"}),e.jsx(i,{...o,children:(s==null?void 0:s.mobile)||"N/A"})]}),e.jsxs(r,{direction:"row",align:"center",justify:"flex-start",children:[e.jsx(i,{...a,mr:"xs",children:"Designation:"}),e.jsx(i,{...o,children:(s==null?void 0:s.designation)||"N/A"})]}),e.jsxs(r,{direction:"row",align:"center",justify:"flex-start",children:[e.jsx(i,{...a,mr:"xs",children:"Department:"}),e.jsx(i,{...o,children:(s==null?void 0:s.department)||"N/A"})]})]})]})},s._id)}))})]})]}),e.jsxs("div",{children:[e.jsx(j,{...u,h:C(56),children:e.jsxs(r,{direction:"row",justify:"space-between",align:"center",children:[e.jsx(i,{...a,size:"md",children:"Meetings / Follow Up:"}),e.jsx(r,{direction:"row",columnGap:"xs",align:"center",children:e.jsx(X,{miw:"24vw",size:"xs",radius:"md",value:fe,className:T.searchInput,placeholder:"Search by contact, place, No.",icon:e.jsx(Z,{size:16}),onChange:s=>{var t;return Ie((t=s.target)==null?void 0:t.value)}})})]})}),e.jsx(G,{type:"scroll",h:"33vh",children:xe.map((s,t)=>{var c,y;const h=s!=null&&s.expensePrice?Intl.NumberFormat("en-US",{style:"currency",currency:s.expensePrice.currency,maximumFractionDigits:2,minimumFractionDigits:2}).format(s.expensePrice.amount):"N/A";return Qe.createElement(j,{...u,key:s._id},e.jsx(l.Fragment,{children:e.jsxs(r,{direction:"row",justify:"space-between",children:[e.jsxs(r,{direction:"column",my:"md",children:[e.jsxs(i,{...a,mb:"xs",children:["#",t+1]}),e.jsxs(r,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(i,{...a,children:"Date/Time: "}),e.jsx(i,{...o,children:I.fromISO(s.meetingDate).toFormat(L)})]}),e.jsxs(r,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(i,{...a,children:"Location:"}),e.jsx(i,{...o,children:s.meetingPlace})]}),e.jsxs(r,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(i,{...a,children:"Meeting With:"}),e.jsx(i,{...o,children:(c=s.contactPerson)==null?void 0:c.name})]}),e.jsxs(r,{direction:"row",align:"flex-start",columnGap:"sm",children:[e.jsx(i,{...a,children:"Agenda:"}),e.jsx(i,{...o,children:s.meetingAgenda})]}),e.jsxs(r,{direction:"row",align:"flex-start",columnGap:"sm",children:[e.jsx(i,{...a,children:"Summary:"}),e.jsx(i,{...o,children:s.meetingSummary})]})]}),e.jsxs(r,{direction:"column",my:"md",children:[e.jsx(i,{...a,mb:"xs",children:"Next Visit"}),e.jsxs(r,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(i,{...a,children:"Date/Time: "}),e.jsx(i,{...o,children:s.nextMeetingDate?I.fromISO(s.nextMeetingDate).toFormat(L):"---"})]}),e.jsxs(r,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(i,{...a,children:"Agenda:"}),e.jsx(i,{...o,children:s.nextMeetingAgenda})]}),e.jsxs(r,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(i,{...a,children:"Place:"}),e.jsx(i,{...o,children:s.nextMeetingPlace})]})]}),e.jsxs(r,{direction:"column",my:"md",children:[e.jsx(i,{...a,mb:"xs",children:"Expense / Claim"}),e.jsxs(r,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(i,{...a,children:"Name:"}),e.jsx(i,{...o,children:s==null?void 0:s.expenseName})]}),e.jsxs(r,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(i,{...a,children:"Type:"}),e.jsx(i,{...o,children:((y=s==null?void 0:s.expenseTypeDetail)==null?void 0:y.name)||"---"})]}),e.jsxs(r,{direction:"row",align:"center",columnGap:"sm",children:[e.jsx(i,{...a,children:"Price:"}),e.jsx(i,{...o,children:h})]})]})]})}))})})]})]})})]}),e.jsx($e,{title:"Add Project",opened:me,onClose:()=>Q(!1),companyId:d._id}),e.jsx(Ve,{title:"Add Contact",opened:he,companyId:d._id,onClose:()=>E(!1)}),e.jsx(He,{title:"Add Follow Up",opened:Ce,projectId:n==null?void 0:n._id,companyId:d._id,onClose:()=>ye(!1)}),e.jsx(We,{title:"Add Claim",opened:je,companyId:d._id,projectId:n==null?void 0:n._id,onClose:()=>$(!1)}),e.jsx(Be,{title:"Add Purchase Request",opened:ue,companyId:d._id,projectId:n==null?void 0:n._id,onClose:()=>V(!1)})]}):e.jsx("center",{children:"No such company exits..."})},Le=qe(b=>({}));export{ns as CompanyProjects,ns as default};
