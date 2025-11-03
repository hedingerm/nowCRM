"use strict";(self.webpackChunkstrapi_app=self.webpackChunkstrapi_app||[]).push([[3492],{7863:(A,O,s)=>{s.d(O,{B:()=>K,D:()=>B,H:()=>U,R:()=>y});var t=s(15724),E=s(59748),M=s(75715),g=s(21087),D=s(75726),P=s(90886),m=s(96352),i=s(47249),r=s(50096),o=s(77007),l=s(99532),d=s(9732),T=s(1696),_=s(14992);const c=(0,_.Ay)(P.s)`
  svg path {
    fill: ${({theme:a})=>a.colors.neutral600};
  }
`,L=({name:a})=>(0,t.jsxs)(P.s,{background:"primary100",borderStyle:"dashed",borderColor:"primary600",borderWidth:"1px",gap:3,hasRadius:!0,padding:3,shadow:"tableShadow",width:(0,i.a8)(300),children:[(0,t.jsx)(c,{alignItems:"center",background:"neutral200",borderRadius:"50%",height:6,justifyContent:"center",width:6,children:(0,t.jsx)(o.A,{width:`${8/16}rem`})}),(0,t.jsx)(m.o,{fontWeight:"bold",children:a})]}),B=()=>(0,t.jsx)(d.P,{renderItem:a=>{if(a.type===T.D.STAGE)return(0,t.jsx)(L,{name:typeof a.item=="string"?a.item:null})}}),y=({children:a})=>(0,t.jsx)(E.P,{children:(0,t.jsx)(D.g,{tabIndex:-1,children:(0,t.jsx)(M.s,{children:a})})}),K=({href:a})=>{const{formatMessage:h}=(0,l.A)();return(0,t.jsx)(i.N_,{startIcon:(0,t.jsx)(r.A,{}),to:a,children:h({id:"global.back",defaultMessage:"Back"})})},U=({title:a,subtitle:h,navigationAction:W,primaryAction:C})=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(i.x7,{name:a}),(0,t.jsx)(g.Q,{navigationAction:W,primaryAction:C,title:a,subtitle:h})]})},11082:(A,O,s)=>{s.d(O,{u:()=>E});var t=s(5192);function E(M={}){const{id:g="",...D}=M,{data:P,isLoading:m}=(0,t.c)({id:g,populate:"stages",...D}),[i]=(0,t.d)(),[r]=(0,t.e)(),[o]=(0,t.f)(),{workflows:l,meta:d}=P??{};return{meta:d,workflows:l,isLoading:m,createWorkflow:i,updateWorkflow:r,deleteWorkflow:o}}},38119:(A,O,s)=>{s.d(O,{u:()=>m});var t=s(16592),E=s(47249),M=s(9732);const g=M.n.injectEndpoints({endpoints:i=>({getComponents:i.query({query:()=>({url:"/content-manager/components",method:"GET"}),transformResponse:r=>r.data}),getContentTypes:i.query({query:()=>({url:"/content-manager/content-types",method:"GET"}),transformResponse:r=>r.data})}),overrideExisting:!1}),{useGetComponentsQuery:D,useGetContentTypesQuery:P}=g;function m(){const{_unstableFormatAPIError:i}=(0,E.wq)(),r=(0,E.hN)(),o=D(),l=P();t.useEffect(()=>{l.error&&r({type:"warning",message:i(l.error)})},[l.error,i,r]),t.useEffect(()=>{o.error&&r({type:"warning",message:i(o.error)})},[o.error,i,r]);const d=o.isLoading||l.isLoading,T=t.useMemo(()=>(l?.data??[]).filter(c=>c.kind==="collectionType"&&c.isDisplayed),[l?.data]),_=t.useMemo(()=>(l?.data??[]).filter(c=>c.kind!=="collectionType"&&c.isDisplayed),[l?.data]);return{isLoading:d,components:t.useMemo(()=>o?.data??[],[o?.data]),collectionTypes:T,singleTypes:_}}},43492:(A,O,s)=>{s.d(O,{ProtectedReviewWorkflowsPage:()=>Z});var t=s(15724),E=s(16592),M=s(5694),g=s(80885),D=s(90886),P=s(91090),m=s(50622),i=s(36092),r=s(20480),o=s(63962),l=s(65515),d=s(96352),T=s(56198),_=s(47249),c=s(96935),L=s(67192),B=s(74082),y=s(99532),K=s(67691),U=s(14992),a=s(9732),h=s(38119),W=s(7863),C=s(24291),X=s(1696),Y=s(11082),ls=s(94174),Es=s(52211),ds=s(11164),Ms=s(43274),Ds=s(80265),Ps=s(4223),Os=s(83670),gs=s(59652),ms=s(57036),cs=s(70991),vs=s(18337),fs=s(71430),Ts=s(49079),hs=s(61622),Cs=s(11338),As=s(24172),Ls=s(54150),Ws=s(68216),Rs=s(55758),Is=s(85715),Bs=s(61951),ys=s(50984),Ks=s(97769),Us=s(92082),js=s(12958),xs=s(16439),us=s(34215),ps=s(34374),ws=s(81121),Ss=s(32828),$s=s(45298),Ns=s(75830),Fs=s(36239),Gs=s(87295),zs=s(53377),Xs=s(42605),Ys=s(3342),Hs=s(73518),Qs=s(65737),Zs=s(61184),Js=s(58668),Vs=s(36901),ks=s(50840),bs=s(13123),qs=s(7851),st=s(5192);const H=(0,U.Ay)(_.N_)`
  align-items: center;
  height: ${(0,_.a8)(32)};
  display: flex;
  justify-content: center;
  padding: ${({theme:e})=>`${e.spaces[2]}}`};
  width: ${(0,_.a8)(32)};

  svg {
    height: ${(0,_.a8)(12)};
    width: ${(0,_.a8)(12)};

    path {
      fill: ${({theme:e})=>e.colors.neutral500};
    }
  }

  &:hover,
  &:focus {
    svg {
      path {
        fill: ${({theme:e})=>e.colors.neutral800};
      }
    }
  }
`,Q=()=>{const{formatMessage:e}=(0,y.A)(),{push:R}=(0,K.W6)(),{trackUsage:w}=(0,_.z1)(),[j,x]=E.useState(null),[J,I]=E.useState(!1),{collectionTypes:V,singleTypes:k,isLoading:b}=(0,h.u)(),{meta:v,workflows:S,isLoading:u,deleteWorkflow:q}=(0,Y.u)(),[ss,$]=E.useState(!1),{_unstableFormatAPIError:ts}=(0,_.wq)(),p=(0,_.hN)(),{getFeature:os,isLoading:N}=(0,a.m)(),es=(0,a.j)(n=>n.admin_app.permissions.settings?.["review-workflows"]),{allowedActions:{canCreate:F,canDelete:ns}}=(0,_.ec)(es),f=os("review-workflows")?.[X.C],_s=n=>[...V,...k].find(z=>z.uid===n)?.info.displayName,as=n=>{x(n)},is=()=>{x(null)},rs=async()=>{if(j)try{$(!0);const n=await q({id:j});if("error"in n){p({type:"warning",message:ts(n.error)});return}x(null),p({type:"success",message:{id:"notification.success.deleted",defaultMessage:"Deleted"}})}catch{p({type:"warning",message:{id:"notification.error.unexpected",defaultMessage:"An error occurred"}})}finally{$(!1)}};return E.useEffect(()=>{!u&&!N&&f&&v&&v?.workflowCount>parseInt(f,10)&&I(!0)},[N,u,v,v?.workflowCount,f]),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(W.H,{primaryAction:F&&(0,t.jsx)(_.z9,{startIcon:(0,t.jsx)(L.A,{}),size:"S",to:"/settings/review-workflows/create",onClick:n=>{f&&v&&v?.workflowCount>=parseInt(f,10)?(n.preventDefault(),I(!0)):w("willCreateWorkflow")},children:e({id:"Settings.review-workflows.list.page.create",defaultMessage:"Create new workflow"})}),subtitle:e({id:"Settings.review-workflows.list.page.subtitle",defaultMessage:"Manage your content review process"}),title:e({id:"Settings.review-workflows.list.page.title",defaultMessage:"Review Workflows"})}),(0,t.jsxs)(W.R,{children:[u||b?(0,t.jsx)(D.s,{justifyContent:"center",children:(0,t.jsx)(g.a,{children:e({id:"Settings.review-workflows.page.list.isLoading",defaultMessage:"Workflows are loading"})})}):(0,t.jsxs)(P.X,{colCount:3,footer:F&&(0,t.jsx)(l.S,{icon:(0,t.jsx)(L.A,{}),onClick:()=>{f&&v&&v?.workflowCount>=parseInt(f,10)?I(!0):(R("/settings/review-workflows/create"),w("willCreateWorkflow"))},children:e({id:"Settings.review-workflows.list.page.create",defaultMessage:"Create new workflow"})}),rowCount:1,children:[(0,t.jsx)(i.d,{children:(0,t.jsxs)(r.Tr,{children:[(0,t.jsx)(o.Th,{children:(0,t.jsx)(d.o,{variant:"sigma",children:e({id:"Settings.review-workflows.list.page.list.column.name.title",defaultMessage:"Name"})})}),(0,t.jsx)(o.Th,{children:(0,t.jsx)(d.o,{variant:"sigma",children:e({id:"Settings.review-workflows.list.page.list.column.stages.title",defaultMessage:"Stages"})})}),(0,t.jsx)(o.Th,{children:(0,t.jsx)(d.o,{variant:"sigma",children:e({id:"Settings.review-workflows.list.page.list.column.contentTypes.title",defaultMessage:"Content Types"})})}),(0,t.jsx)(o.Th,{children:(0,t.jsx)(T.s,{children:e({id:"Settings.review-workflows.list.page.list.column.actions.title",defaultMessage:"Actions"})})})]})}),(0,t.jsx)(m.N,{children:S?.map(n=>(0,E.createElement)(r.Tr,{...(0,_.qM)({fn(G){G.target.nodeName!=="BUTTON"&&R(`/settings/review-workflows/${n.id}`)}}),key:`workflow-${n.id}`},(0,t.jsx)(o.Td,{width:(0,_.a8)(250),children:(0,t.jsx)(d.o,{textColor:"neutral800",fontWeight:"bold",ellipsis:!0,children:n.name})}),(0,t.jsx)(o.Td,{children:(0,t.jsx)(d.o,{textColor:"neutral800",children:n.stages.length})}),(0,t.jsx)(o.Td,{children:(0,t.jsx)(d.o,{textColor:"neutral800",children:(n?.contentTypes??[]).map(_s).join(", ")})}),(0,t.jsx)(o.Td,{children:(0,t.jsxs)(D.s,{alignItems:"center",justifyContent:"end",children:[(0,t.jsx)(H,{to:`/settings/review-workflows/${n.id}`,"aria-label":e({id:"Settings.review-workflows.list.page.list.column.actions.edit.label",defaultMessage:"Edit {name}"},{name:n.name}),children:(0,t.jsx)(c.A,{})}),S.length>1&&ns&&(0,t.jsx)(M.K,{"aria-label":e({id:"Settings.review-workflows.list.page.list.column.actions.delete.label",defaultMessage:"Delete {name}"},{name:"Default workflow"}),icon:(0,t.jsx)(B.A,{}),noBorder:!0,onClick:()=>{as(String(n.id))}})]})})))})]}),(0,t.jsx)(_.TM,{bodyText:{id:"Settings.review-workflows.list.page.delete.confirm.body",defaultMessage:"If you remove this worfklow, all stage-related information will be removed for this content-type. Are you sure you want to remove it?"},isConfirmButtonLoading:ss,isOpen:!!j,onToggleDialog:is,onConfirm:rs}),(0,t.jsxs)(C.L.Root,{isOpen:J,onClose:()=>I(!1),children:[(0,t.jsx)(C.L.Title,{children:e({id:"Settings.review-workflows.list.page.workflows.limit.title",defaultMessage:"You\u2019ve reached the limit of workflows in your plan"})}),(0,t.jsx)(C.L.Body,{children:e({id:"Settings.review-workflows.list.page.workflows.limit.body",defaultMessage:"Delete a workflow or contact Sales to enable more workflows."})})]})]})]})},Z=()=>{const e=(0,a.j)(R=>R.admin_app.permissions.settings?.["review-workflows"]?.main);return(0,t.jsx)(_.kz,{permissions:e,children:(0,t.jsx)(Q,{})})}},65515:(A,O,s)=>{s.d(O,{S:()=>r});var t=s(15724),E=s(14992),M=s(68574),g=s(9990),D=s(90886),P=s(96352);const m=(0,E.Ay)(M.a)`
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
`,i=(0,E.Ay)(M.a)`
  border-radius: 0 0 ${({theme:o})=>o.borderRadius} ${({theme:o})=>o.borderRadius};
  display: block;
  width: 100%;
  border: none;
`,r=({children:o,icon:l,...d})=>(0,t.jsxs)("div",{children:[(0,t.jsx)(g.c,{}),(0,t.jsx)(i,{as:"button",background:"primary100",padding:5,...d,children:(0,t.jsxs)(D.s,{children:[(0,t.jsx)(m,{"aria-hidden":!0,background:"primary200",children:l}),(0,t.jsx)(M.a,{paddingLeft:3,children:(0,t.jsx)(P.o,{variant:"pi",fontWeight:"bold",textColor:"primary600",children:o})})]})})]})}}]);
