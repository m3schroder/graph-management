import{s as I,i as P,j as z,n as d,h as T,k as b,l as w}from"../chunks/scheduler.d23b7513.js";import{S as A,i as j,g as p,h as $,j as O,f as c,a as f,r as v,s as g,u as C,c as h,v as k,d as x,t as S,w as U,y as _,z as q,k as B}from"../chunks/index.dfb5f55f.js";import{e as L}from"../chunks/public.11294112.js";import{c as y}from"../chunks/index.f2bc2b55.js";import{c as N,S as D,a as E}from"../chunks/SignedOut.07f955ac.js";const R=(i,t=void 0)=>fetch(`${L.PUBLIC_API_URL}${i}`,{...t});function V(i){let t,o,n,s;return{c(){t=p("div")},l(e){t=$(e,"DIV",{}),O(t).forEach(c)},m(e,a){f(e,t,a),n||(s=P(o=N.call(null,t,{clerk:i[0],componentType:"UserButton",props:i[1]})),n=!0)},p(e,[a]){o&&z(o.update)&&a&3&&o.update.call(null,{clerk:e[0],componentType:"UserButton",props:e[1]})},i:d,o:d,d(e){e&&c(t),n=!1,s()}}}function F(i,t,o){let n;return T(i,y,s=>o(0,n=s)),i.$$set=s=>{o(1,t=b(b({},t),w(s)))},t=w(t),[n,t]}class G extends A{constructor(t){super(),j(this,t,F,V,I,{})}}function H(i){let t,o,n,s="Test",e,a,l;return t=new G({props:{afterSignOutUrl:"/"}}),{c(){v(t.$$.fragment),o=g(),n=p("button"),n.textContent=s},l(r){C(t.$$.fragment,r),o=h(r),n=$(r,"BUTTON",{"data-svelte-h":!0}),_(n)!=="svelte-1cs4qmm"&&(n.textContent=s)},m(r,u){k(t,r,u),f(r,o,u),f(r,n,u),e=!0,a||(l=q(n,"click",i[0]),a=!0)},p:d,i(r){e||(x(t.$$.fragment,r),e=!0)},o(r){S(t.$$.fragment,r),e=!1},d(r){r&&(c(o),c(n)),U(t,r),a=!1,l()}}}function J(i){let t,o="Sign in",n,s,e="|",a,l,r="Sign up";return{c(){t=p("a"),t.textContent=o,n=g(),s=p("span"),s.textContent=e,a=g(),l=p("a"),l.textContent=r,this.h()},l(u){t=$(u,"A",{href:!0,"data-svelte-h":!0}),_(t)!=="svelte-1iuplsv"&&(t.textContent=o),n=h(u),s=$(u,"SPAN",{"data-svelte-h":!0}),_(s)!=="svelte-1e2i4m"&&(s.textContent=e),a=h(u),l=$(u,"A",{href:!0,"data-svelte-h":!0}),_(l)!=="svelte-tb1kzj"&&(l.textContent=r),this.h()},h(){B(t,"href","/signin"),B(l,"href","/signup")},m(u,m){f(u,t,m),f(u,n,m),f(u,s,m),f(u,a,m),f(u,l,m)},p:d,d(u){u&&(c(t),c(n),c(s),c(a),c(l))}}}function K(i){let t,o,n,s;return t=new D({props:{$$slots:{default:[H]},$$scope:{ctx:i}}}),n=new E({props:{$$slots:{default:[J]},$$scope:{ctx:i}}}),{c(){v(t.$$.fragment),o=g(),v(n.$$.fragment)},l(e){C(t.$$.fragment,e),o=h(e),C(n.$$.fragment,e)},m(e,a){k(t,e,a),f(e,o,a),k(n,e,a),s=!0},p(e,[a]){const l={};a&4&&(l.$$scope={dirty:a,ctx:e}),t.$set(l);const r={};a&4&&(r.$$scope={dirty:a,ctx:e}),n.$set(r)},i(e){s||(x(t.$$.fragment,e),x(n.$$.fragment,e),s=!0)},o(e){S(t.$$.fragment,e),S(n.$$.fragment,e),s=!1},d(e){e&&c(o),U(t,e),U(n,e)}}}function M(i,t,o){let n;return T(i,y,e=>o(1,n=e)),[async()=>{var l;let e=await((l=n==null?void 0:n.session)==null?void 0:l.getToken()),a=await R("/",{credentials:"include",headers:{Authorization:"Bearer "+e}}).then(r=>r.json());console.log(a)}]}class tt extends A{constructor(t){super(),j(this,t,M,K,I,{})}}export{tt as component};
