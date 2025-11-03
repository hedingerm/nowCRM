"use strict";(self.webpackChunkstrapi_app=self.webpackChunkstrapi_app||[]).push([[7198],{17198:(I,D,_)=>{_.r(D),_.d(D,{LoginEE:()=>K});var E=_(15724),a=_(68574),O=_(9990),P=_(90886),M=_(96352),l=_(99532),i=_(14992),n=_(9732),d=_(81541),L=_(47249),r=_(94174),o=_(52211),h=_(11164),s=_(43274),A=_(80265),C=_(4223),t=_(16592),W=_(83670),m=_(59652),g=_(57036),x=_(70991),j=_(18337),f=_(71430),y=_(49079),c=_(61622),S=_(11338),$=_(24172),N=_(54150),F=_(68216),G=_(55758),z=_(85715),X=_(61951),Z=_(50984),H=_(97769),J=_(92082),Q=_(12958),V=_(16439),Y=_(34215),u=_(34374),p=_(81121),e=_(32828),w=_(45298),k=_(75830),b=_(36239),q=_(87295),__=_(53377),E_=_(42605),s_=_(3342),t_=_(73518),a_=_(65737),O_=_(61184),n_=_(58668),D_=_(36901),P_=_(50840),M_=_(13123),d_=_(7851);const B=(0,i.Ay)(O.c)`
  flex: 1;
`,K=v=>{const{formatMessage:T}=(0,l.A)(),{isLoading:U,data:R=[]}=(0,n.g)(void 0,{skip:!window.strapi.features.isEnabled(window.strapi.features.SSO)});return!window.strapi.features.isEnabled(window.strapi.features.SSO)||!U&&R.length===0?(0,E.jsx)(n.L,{...v}):(0,E.jsx)(n.L,{...v,children:(0,E.jsx)(a.a,{paddingTop:7,children:(0,E.jsxs)(P.s,{direction:"column",alignItems:"stretch",gap:7,children:[(0,E.jsxs)(P.s,{children:[(0,E.jsx)(B,{}),(0,E.jsx)(a.a,{paddingLeft:3,paddingRight:3,children:(0,E.jsx)(M.o,{variant:"sigma",textColor:"neutral600",children:T({id:"Auth.login.sso.divider"})})}),(0,E.jsx)(B,{})]}),(0,E.jsx)(d.S,{providers:R,displayAllProviders:!1})]})})})}},81541:(I,D,_)=>{_.d(D,{S:()=>L});var E=_(15724),a=_(9704),O=_(78789),P=_(90886),M=_(95363),l=_(96352),i=_(99532),n=_(39648),d=_(14992);const L=({providers:s,displayAllProviders:A})=>{const{formatMessage:C}=(0,i.A)();return A?(0,E.jsx)(a.x,{gap:4,children:s.map(t=>(0,E.jsx)(O.E,{col:4,children:(0,E.jsx)(o,{provider:t})},t.uid))}):s.length>2&&!A?(0,E.jsxs)(a.x,{gap:4,children:[s.slice(0,2).map(t=>(0,E.jsx)(O.E,{col:4,children:(0,E.jsx)(o,{provider:t})},t.uid)),(0,E.jsx)(O.E,{col:4,children:(0,E.jsx)(M.m,{label:C({id:"global.see-more"}),children:(0,E.jsx)(h,{as:n.N_,to:"/auth/providers",children:(0,E.jsx)("span",{"aria-hidden":!0,children:"\u2022\u2022\u2022"})})})})]}):(0,E.jsx)(r,{justifyContent:"center",children:s.map(t=>(0,E.jsx)(o,{provider:t},t.uid))})},r=(0,d.Ay)(P.s)`
  & a:not(:first-child):not(:last-child) {
    margin: 0 ${({theme:s})=>s.spaces[2]};
  }
  & a:first-child {
    margin-right: ${({theme:s})=>s.spaces[2]};
  }
  & a:last-child {
    margin-left: ${({theme:s})=>s.spaces[2]};
  }
`,o=({provider:s})=>(0,E.jsx)(M.m,{label:s.displayName,children:(0,E.jsx)(h,{href:`${window.strapi.backendURL}/admin/connect/${s.uid}`,children:s.icon?(0,E.jsx)("img",{src:s.icon,"aria-hidden":!0,alt:"",height:"32px"}):(0,E.jsx)(l.o,{children:s.displayName})})}),h=d.Ay.a`
  width: ${136/16}rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${48/16}rem;
  border: 1px solid ${({theme:s})=>s.colors.neutral150};
  border-radius: ${({theme:s})=>s.borderRadius};
  text-decoration: inherit;
  &:link {
    text-decoration: none;
  }
  color: ${({theme:s})=>s.colors.neutral600};
`}}]);
