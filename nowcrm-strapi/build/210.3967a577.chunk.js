"use strict";(self.webpackChunkstrapi_app=self.webpackChunkstrapi_app||[]).push([[210],{80210:(m,P,_)=>{_.r(P),_.d(P,{FORMS:()=>U});var s=_(15724),a=_(68574),O=_(33e3),C=_(9990),D=_(80885),A=_(75726),n=_(90886),d=_(96352),l=_(90087),v=_(99532),i=_(67691),M=_(39648),r=_(14992),E=_(9732),h=_(81541),B=_(47249),t=_(94174),g=_(52211),x=_(11164),j=_(43274),c=_(80265),f=_(4223),y=_(16592),S=_(83670),$=_(59652),N=_(57036),F=_(70991),u=_(18337),z=_(71430),G=_(49079),X=_(61622),Z=_(11338),H=_(24172),J=_(54150),Q=_(68216),V=_(55758),Y=_(85715),e=_(61951),p=_(50984),k=_(97769),w=_(92082),b=_(12958),q=_(16439),__=_(34215),s_=_(34374),E_=_(81121),t_=_(32828),a_=_(45298),n_=_(75830),d_=_(36239),o_=_(87295),O_=_(53377),M_=_(42605),P_=_(3342),D_=_(73518),l_=_(65737),i_=_(61184),r_=_(58668),h_=_(36901),C_=_(50840),A_=_(13123),v_=_(7851);const T=()=>{const{push:I}=(0,i.W6)(),{formatMessage:o}=(0,v.A)(),{isLoading:L,data:W=[]}=(0,E.g)(void 0,{skip:!window.strapi.features.isEnabled(window.strapi.features.SSO)}),K=()=>{I("/auth/login")};return!window.strapi.features.isEnabled(window.strapi.features.SSO)||!L&&W.length===0?(0,s.jsx)(i.rd,{to:"/auth/login"}):(0,s.jsx)(E.U,{children:(0,s.jsxs)(A.g,{children:[(0,s.jsxs)(E.h,{children:[(0,s.jsxs)(E.C,{children:[(0,s.jsx)(E.i,{}),(0,s.jsx)(a.a,{paddingTop:6,paddingBottom:1,children:(0,s.jsx)(d.o,{as:"h1",variant:"alpha",children:o({id:"Auth.form.welcome.title"})})}),(0,s.jsx)(a.a,{paddingBottom:7,children:(0,s.jsx)(d.o,{variant:"epsilon",textColor:"neutral600",children:o({id:"Auth.login.sso.subtitle"})})})]}),(0,s.jsxs)(n.s,{direction:"column",alignItems:"stretch",gap:7,children:[L?(0,s.jsx)(n.s,{justifyContent:"center",children:(0,s.jsx)(D.a,{children:o({id:"Auth.login.sso.loading"})})}):(0,s.jsx)(h.S,{providers:W}),(0,s.jsxs)(n.s,{children:[(0,s.jsx)(R,{}),(0,s.jsx)(a.a,{paddingLeft:3,paddingRight:3,children:(0,s.jsx)(d.o,{variant:"sigma",textColor:"neutral600",children:o({id:"or"})})}),(0,s.jsx)(R,{})]}),(0,s.jsx)(O.$,{fullWidth:!0,size:"L",onClick:K,children:o({id:"Auth.form.button.login.strapi"})})]})]}),(0,s.jsx)(n.s,{justifyContent:"center",children:(0,s.jsx)(a.a,{paddingTop:4,children:(0,s.jsx)(l.N,{as:M.k2,to:"/auth/forgot-password",children:(0,s.jsx)(d.o,{variant:"pi",children:o({id:"Auth.link.forgot-password"})})})})})]})})},R=(0,r.Ay)(C.c)`
  flex: 1;
`,U={providers:T}},81541:(m,P,_)=>{_.d(P,{S:()=>v});var s=_(15724),a=_(9704),O=_(78789),C=_(90886),D=_(95363),A=_(96352),n=_(99532),d=_(39648),l=_(14992);const v=({providers:E,displayAllProviders:h})=>{const{formatMessage:B}=(0,n.A)();return h?(0,s.jsx)(a.x,{gap:4,children:E.map(t=>(0,s.jsx)(O.E,{col:4,children:(0,s.jsx)(M,{provider:t})},t.uid))}):E.length>2&&!h?(0,s.jsxs)(a.x,{gap:4,children:[E.slice(0,2).map(t=>(0,s.jsx)(O.E,{col:4,children:(0,s.jsx)(M,{provider:t})},t.uid)),(0,s.jsx)(O.E,{col:4,children:(0,s.jsx)(D.m,{label:B({id:"global.see-more"}),children:(0,s.jsx)(r,{as:d.N_,to:"/auth/providers",children:(0,s.jsx)("span",{"aria-hidden":!0,children:"\u2022\u2022\u2022"})})})})]}):(0,s.jsx)(i,{justifyContent:"center",children:E.map(t=>(0,s.jsx)(M,{provider:t},t.uid))})},i=(0,l.Ay)(C.s)`
  & a:not(:first-child):not(:last-child) {
    margin: 0 ${({theme:E})=>E.spaces[2]};
  }
  & a:first-child {
    margin-right: ${({theme:E})=>E.spaces[2]};
  }
  & a:last-child {
    margin-left: ${({theme:E})=>E.spaces[2]};
  }
`,M=({provider:E})=>(0,s.jsx)(D.m,{label:E.displayName,children:(0,s.jsx)(r,{href:`${window.strapi.backendURL}/admin/connect/${E.uid}`,children:E.icon?(0,s.jsx)("img",{src:E.icon,"aria-hidden":!0,alt:"",height:"32px"}):(0,s.jsx)(A.o,{children:E.displayName})})}),r=l.Ay.a`
  width: ${136/16}rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${48/16}rem;
  border: 1px solid ${({theme:E})=>E.colors.neutral150};
  border-radius: ${({theme:E})=>E.borderRadius};
  text-decoration: inherit;
  &:link {
    text-decoration: none;
  }
  color: ${({theme:E})=>E.colors.neutral600};
`}}]);
