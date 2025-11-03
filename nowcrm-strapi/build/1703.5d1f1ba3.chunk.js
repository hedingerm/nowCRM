"use strict";(self.webpackChunkstrapi_app=self.webpackChunkstrapi_app||[]).push([[1703],{21753:(V,T,t)=>{t.d(T,{u:()=>g});var s=t(9732);const c=s.n.injectEndpoints({endpoints:i=>({getWebhooks:i.query({query:o=>({url:`/admin/webhooks/${o?.id??""}`,method:"GET"}),transformResponse:o=>Array.isArray(o.data)?o.data:[o.data],providesTags:(o,h,d)=>typeof d=="object"&&"id"in d?[{type:"Webhook",id:d.id}]:[...o?.map(({id:f})=>({type:"Webhook",id:f}))??[],{type:"Webhook",id:"LIST"}]}),createWebhook:i.mutation({query:o=>({url:"/admin/webhooks",method:"POST",data:o}),transformResponse:o=>o.data,invalidatesTags:[{type:"Webhook",id:"LIST"}]}),updateWebhook:i.mutation({query:({id:o,...h})=>({url:`/admin/webhooks/${o}`,method:"PUT",data:h}),transformResponse:o=>o.data,invalidatesTags:(o,h,{id:d})=>[{type:"Webhook",id:d}]}),triggerWebhook:i.mutation({query:o=>({url:`/admin/webhooks/${o}/trigger`,method:"POST"}),transformResponse:o=>o.data}),deleteManyWebhooks:i.mutation({query:o=>({url:"/admin/webhooks/batch-delete",method:"POST",data:o}),transformResponse:o=>o.data,invalidatesTags:(o,h,{ids:d})=>d.map(f=>({type:"Webhook",id:f}))})}),overrideExisting:!1}),{useGetWebhooksQuery:x,useCreateWebhookMutation:M,useUpdateWebhookMutation:b,useTriggerWebhookMutation:C,useDeleteManyWebhooksMutation:W}=c,g=(i=void 0,o)=>{const{data:h,isLoading:d,error:f}=x(i,o),[B,{error:P}]=M(),[l,{error:p}]=b(),[O]=C(),[k]=W();return{webhooks:h,isLoading:d,error:f||P||p,createWebhook:B,updateWebhook:l,triggerWebhook:O,deleteManyWebhooks:k}}},65515:(V,T,t)=>{t.d(T,{S:()=>i});var s=t(15724),c=t(14992),x=t(68574),M=t(9990),b=t(90886),C=t(96352);const W=(0,c.Ay)(x.a)`
  height: ${24/16}rem;
  width: ${24/16}rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    height: ${10/16}rem;
    width: ${10/16}rem;
  }

  svg path {
    fill: ${({theme:o})=>o.colors.primary600};
  }
`,g=(0,c.Ay)(x.a)`
  border-radius: 0 0 ${({theme:o})=>o.borderRadius} ${({theme:o})=>o.borderRadius};
  display: block;
  width: 100%;
  border: none;
`,i=({children:o,icon:h,...d})=>(0,s.jsxs)("div",{children:[(0,s.jsx)(M.c,{}),(0,s.jsx)(g,{as:"button",background:"primary100",padding:5,...d,children:(0,s.jsxs)(b.s,{children:[(0,s.jsx)(W,{"aria-hidden":!0,background:"primary200",children:h}),(0,s.jsx)(x.a,{paddingLeft:3,children:(0,s.jsx)(C.o,{variant:"pi",fontWeight:"bold",textColor:"primary600",children:o})})]})})]})},91703:(V,T,t)=>{t.d(T,{ProtectedListPage:()=>ct});var s=t(15724),c=t(16592),x=t(43442),M=t(59748),b=t(75726),C=t(21087),W=t(34146),g=t(96352),i=t(33e3),o=t(75715),h=t(68574),d=t(91090),f=t(65515),B=t(36092),P=t(20480),l=t(63962),p=t(51336),O=t(56198),k=t(50622),I=t(90886),J=t(14992);const R=J.Ay.div`
  background: ${({theme:n})=>n.colors.danger500};
  border: none;
  border-radius: 16px;
  position: relative;
  height: ${24/16}rem;
  width: ${40/16}rem;

  & span {
    font-size: ${({visibleLabels:n})=>n?"1rem":0};
  }

  &:before {
    content: '';
    background: ${({theme:n})=>n.colors.neutral0};
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    position: absolute;
    transition: all 0.5s;
    left: ${({theme:n})=>n.spaces[1]};
    top: ${({theme:n})=>n.spaces[1]};
  }

  @media (prefers-reduced-motion: reduce) {
    &:before {
      transition: none;
    }
  }
`,st=J.Ay.button`
  background: transparent;
  padding: 0;
  border: none;

  &[aria-checked='true'] ${R} {
    background: ${({theme:n})=>n.colors.success500};
  }

  &[aria-checked='true'] ${R}:before {
    transform: translateX(1rem);
  }
`,ot=c.forwardRef(({label:n,onChange:u,onLabel:D="On",offLabel:S="Off",selected:j,visibleLabels:v=!1,...K},a)=>(0,s.jsx)(st,{ref:a,role:"switch","aria-checked":j,"aria-label":n,onClick:u,visibleLabels:v,type:"button",...K,children:(0,s.jsxs)(I.s,{children:[(0,s.jsxs)(R,{children:[(0,s.jsx)("span",{children:D}),(0,s.jsx)("span",{children:S})]}),v&&(0,s.jsx)(h.a,{as:"span","aria-hidden":!0,paddingLeft:2,color:j?"success600":"danger600",children:j?D:S})]})}));var Q=t(5694),et=t(73772),at=t(88311),m=t(47249),U=t(67192),Y=t(74082),nt=t(96935),rt=t(65075),dt=t(99532),Z=t(67691),it=t(39648),w=t(9732),lt=t(21753),bt=t(94174),Ct=t(52211),Wt=t(11164),St=t(43274),Et=t(80265),At=t(4223),Pt=t(83670),pt=t(59652),Dt=t(57036),Lt=t(70991),$t=t(18337),Bt=t(71430),Ot=t(49079),kt=t(61622),It=t(11338),Rt=t(24172),Ut=t(54150),Kt=t(68216),Ft=t(55758),Nt=t(85715),zt=t(61951),Gt=t(50984),Xt=t(97769),Ht=t(92082),Vt=t(12958),Jt=t(16439),Qt=t(34215),Yt=t(34374),Zt=t(81121),wt=t(32828),qt=t(45298),_t=t(75830),ts=t(36239),ss=t(87295),os=t(53377),es=t(42605),as=t(3342),ns=t(73518),rs=t(65737),ds=t(61184),is=t(58668),ls=t(36901),hs=t(50840),cs=t(13123),gs=t(7851);const ht=()=>{const[n,u]=c.useState(!1),[D,S]=c.useState(!1),[j,v]=c.useState([]),K=(0,w.j)(e=>e.admin_app.permissions.settings?.webhooks),{formatMessage:a}=(0,dt.A)(),{_unstableFormatAPIError:L}=(0,m.wq)(),y=(0,m.hN)();(0,m.L4)();const{push:gt}=(0,Z.W6)(),{pathname:q}=(0,Z.zy)(),{isLoading:vt,allowedActions:{canCreate:F,canUpdate:N,canDelete:_}}=(0,m.ec)(K),{notifyStatus:tt}=(0,x.W)(),{isLoading:mt,webhooks:E,error:z,updateWebhook:ut,deleteManyWebhooks:xt}=(0,lt.u)();c.useEffect(()=>{if(z){y({type:"warning",message:L(z)});return}E&&tt(a({id:"Settings.webhooks.list.loading.success",defaultMessage:"Webhooks have been loaded"}))},[E,z,y,a,tt,L]);const ft=async e=>{try{const r=await ut(e);"error"in r&&y({type:"warning",message:L(r.error)})}catch{y({type:"warning",message:{id:"notification.error",defaultMessage:"An error occurred"}})}},jt=async()=>{try{S(!0);const e=await xt({ids:j});if("error"in e){y({type:"warning",message:L(e.error)});return}v([])}catch{y({type:"warning",message:{id:"notification.error",defaultMessage:"An error occurred"}})}finally{S(!1),u(!1)}},yt=e=>v(e?E?.map(r=>r.id)??[]:[]),Tt=(e,r)=>v(e?H=>[...H,r]:H=>H.filter(Mt=>Mt!==r)),G=e=>()=>gt(`${q}/${e}`),X=vt||mt,$=E?.length??0,A=j.length;return(0,s.jsxs)(M.P,{children:[(0,s.jsx)(m.x7,{name:"Webhooks"}),(0,s.jsxs)(b.g,{"aria-busy":X,children:[(0,s.jsx)(C.Q,{title:a({id:"Settings.webhooks.title",defaultMessage:"Webhooks"}),subtitle:a({id:"Settings.webhooks.list.description",defaultMessage:"Get POST changes notifications"}),primaryAction:F&&!X&&(0,s.jsx)(at.z,{as:it.k2,startIcon:(0,s.jsx)(U.A,{}),variant:"default",to:`${q}/create`,size:"S",children:a({id:"Settings.webhooks.list.button.add",defaultMessage:"Create new webhook"})})}),A>0&&_&&(0,s.jsx)(W.B,{startActions:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(g.o,{variant:"epsilon",textColor:"neutral600",children:a({id:"Settings.webhooks.to.delete",defaultMessage:"{webhooksToDeleteLength, plural, one {# webhook} other {# webhooks}} selected"},{webhooksToDeleteLength:A})}),(0,s.jsx)(i.$,{onClick:()=>u(!0),startIcon:(0,s.jsx)(Y.A,{}),size:"L",variant:"danger-light",children:a({id:"global.delete",defaultMessage:"Delete"})})]})}),(0,s.jsx)(o.s,{children:X?(0,s.jsx)(h.a,{background:"neutral0",padding:6,shadow:"filterShadow",hasRadius:!0,children:(0,s.jsx)(m.Bl,{})}):$>0?(0,s.jsxs)(d.X,{colCount:5,rowCount:$+1,footer:(0,s.jsx)(f.S,{onClick:G("create"),icon:(0,s.jsx)(U.A,{}),children:a({id:"Settings.webhooks.list.button.add",defaultMessage:"Create new webhook"})}),children:[(0,s.jsx)(B.d,{children:(0,s.jsxs)(P.Tr,{children:[(0,s.jsx)(l.Th,{children:(0,s.jsx)(p.J,{"aria-label":a({id:"global.select-all-entries",defaultMessage:"Select all entries"}),indeterminate:A>0&&A<$,value:A===$,onValueChange:yt})}),(0,s.jsx)(l.Th,{width:"20%",children:(0,s.jsx)(g.o,{variant:"sigma",textColor:"neutral600",children:a({id:"global.name",defaultMessage:"Name"})})}),(0,s.jsx)(l.Th,{width:"60%",children:(0,s.jsx)(g.o,{variant:"sigma",textColor:"neutral600",children:a({id:"Settings.webhooks.form.url",defaultMessage:"URL"})})}),(0,s.jsx)(l.Th,{width:"20%",children:(0,s.jsx)(g.o,{variant:"sigma",textColor:"neutral600",children:a({id:"Settings.webhooks.list.th.status",defaultMessage:"Status"})})}),(0,s.jsx)(l.Th,{children:(0,s.jsx)(O.s,{children:a({id:"Settings.webhooks.list.th.actions",defaultMessage:"Actions"})})})]})}),(0,s.jsx)(k.N,{children:E?.map(e=>(0,s.jsxs)(P.Tr,{onClick:N?G(e.id):void 0,style:{cursor:N?"pointer":"default"},children:[(0,s.jsx)(l.Td,{onClick:r=>r.stopPropagation(),children:(0,s.jsx)(p.J,{"aria-label":`${a({id:"global.select",defaultMessage:"Select"})} ${e.name}`,value:j?.includes(e.id),onValueChange:r=>Tt(r,e.id),name:"select"})}),(0,s.jsx)(l.Td,{children:(0,s.jsx)(g.o,{fontWeight:"semiBold",textColor:"neutral800",children:e.name})}),(0,s.jsx)(l.Td,{children:(0,s.jsx)(g.o,{textColor:"neutral800",children:e.url})}),(0,s.jsx)(l.Td,{children:(0,s.jsx)(I.s,{children:(0,s.jsx)(ot,{onLabel:a({id:"global.enabled",defaultMessage:"Enabled"}),offLabel:a({id:"global.disabled",defaultMessage:"Disabled"}),label:`${e.name} ${a({id:"Settings.webhooks.list.th.status",defaultMessage:"Status"})}`,selected:e.isEnabled,onChange:r=>{r.stopPropagation(),ft({...e,isEnabled:!e.isEnabled})},visibleLabels:!0})})}),(0,s.jsx)(l.Td,{children:(0,s.jsxs)(I.s,{gap:1,children:[N&&(0,s.jsx)(Q.K,{label:a({id:"Settings.webhooks.events.update",defaultMessage:"Update"}),icon:(0,s.jsx)(nt.A,{}),noBorder:!0}),_&&(0,s.jsx)(Q.K,{onClick:r=>{r.stopPropagation(),v([e.id]),u(!0)},label:a({id:"Settings.webhooks.events.delete",defaultMessage:"Delete webhook"}),icon:(0,s.jsx)(Y.A,{}),noBorder:!0})]})})]},e.id))})]}):(0,s.jsx)(et.p,{icon:(0,s.jsx)(rt.A,{width:"160px"}),content:a({id:"Settings.webhooks.list.empty.description",defaultMessage:"No webhooks found"}),action:(0,s.jsx)(i.$,{variant:"secondary",startIcon:(0,s.jsx)(U.A,{}),disabled:!F,onClick:F?G("create"):void 0,children:a({id:"Settings.webhooks.list.button.add",defaultMessage:"Create new webhook"})})})})]}),(0,s.jsx)(m.TM,{isOpen:n,onToggleDialog:()=>u(e=>!e),onConfirm:jt,isConfirmButtonLoading:D})]})},ct=()=>{const n=(0,w.j)(u=>u.admin_app.permissions.settings?.webhooks.main);return(0,s.jsx)(m.kz,{permissions:n,children:(0,s.jsx)(ht,{})})}}}]);
