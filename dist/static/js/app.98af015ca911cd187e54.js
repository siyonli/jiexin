webpackJsonp([18],{0:function(e,t){},"1WNi":function(e,t){},"26DW":function(e,t){},"2Uyi":function(e,t,n){"use strict";n("vgQg");t.a={ossUrl:"http://ask.dxytg.com"}},"4ml/":function(e,t){},"5jRo":function(e,t,n){"use strict";var i=n("uXeI"),a={methods:{getBroswerInfo:function(){var e=navigator.userAgent.toLowerCase();return{isWechat:"micromessenger"==e.match(/MicroMessenger/i),isApp:"mitao"==e.match(/mitao/i)}},createNoncestr:function(e){e=Number(e)||16;for(var t="",n=0;n<e;n++)t+="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".substr(Math.round(10*Math.random()),1);return t},createWxShareConfig:function(e,t,n,a){var o=a.split("#")[0],r=parseInt((new Date).getTime()/1e3),s=this.createNoncestr();return{appids:e,timestamp:r,noncestr:s,sign:i("jsapi_ticket="+t+"&noncestr="+s+"&timestamp="+r+"&url="+o),wximgurl:n}},wxShare:function(e,t,n){e&&t&&n?(e.config({debug:!1,appId:t.appids,timestamp:t.timestamp,nonceStr:t.noncestr,signature:t.sign,jsApiList:["onMenuShareTimeline","onMenuShareAppMessage"]}),e.ready(function(){e.onMenuShareAppMessage({title:n.title,desc:n.desc,link:n.links,imgUrl:n.wximgurl,success:function(){},cancel:function(){}}),e.onMenuShareTimeline({title:n.title,link:n.links,imgUrl:n.wximgurl,success:function(){},cancel:function(){}})}),e.error(function(e){console.log(e)})):console.error("微信分享传入配置参数错误")},wxPay:function(e,t,n,i,a){e&&t?(n=n||new Function,i=i||new Function,a=a||new Function,e.config({debug:!1,appId:t.appId,timestamp:t.timeStamp,nonceStr:t.nonceStr,signature:t.signType,jsApiList:["chooseWXPay"]}),e.chooseWXPay({appId:t.appId,timestamp:t.timeStamp,nonceStr:t.nonceStr,package:t.package,signType:t.signType,paySign:t.paySign,success:n,cancel:i}),e.error(a)):console.error("微信分享传入配置参数错误")}}};t.a=a},"7IJS":function(e,t){},EDgR:function(e,t){!function(e,t){function n(){var t=o.getBoundingClientRect().width;t/c>540&&(t=540*c);var n=t/10;o.style.fontSize=n+"px",l.rem=e.rem=n}var i,a=e.document,o=a.documentElement,r=a.querySelector('meta[name="viewport"]'),s=a.querySelector('meta[name="flexible"]'),c=0,u=0,l=t.flexible||(t.flexible={});if(r){console.warn("将根据已有的meta标签来设置缩放比例");var p=r.getAttribute("content").match(/initial\-scale=([\d\.]+)/);p&&(u=parseFloat(p[1]),c=parseInt(1/u))}else if(s){var m=s.getAttribute("content");if(m){var d=m.match(/initial\-dpr=([\d\.]+)/),h=m.match(/maximum\-dpr=([\d\.]+)/);d&&(c=parseFloat(d[1]),u=parseFloat((1/c).toFixed(2))),h&&(c=parseFloat(h[1]),u=parseFloat((1/c).toFixed(2)))}}if(!c&&!u){var f=(e.navigator.appVersion.match(/android/gi),e.navigator.appVersion.match(/iphone/gi)),g=e.devicePixelRatio;u=1/(c=f?g>=3&&(!c||c>=3)?3:g>=2&&(!c||c>=2)?2:1:1)}if(o.setAttribute("data-dpr",c),!r)if((r=a.createElement("meta")).setAttribute("name","viewport"),r.setAttribute("content","initial-scale="+u+", maximum-scale="+u+", minimum-scale="+u+", user-scalable=no"),o.firstElementChild)o.firstElementChild.appendChild(r);else{var v=a.createElement("div");v.appendChild(r),a.write(v.innerHTML)}e.addEventListener("resize",function(){clearTimeout(i),i=setTimeout(n,300)},!1),e.addEventListener("pageshow",function(e){e.persisted&&(clearTimeout(i),i=setTimeout(n,300))},!1),"complete"===a.readyState?a.body.style.fontSize=12*c+"px":a.addEventListener("DOMContentLoaded",function(){a.body.style.fontSize=12*c+"px"},!1),n(),l.dpr=e.dpr=c,l.refreshRem=n,l.rem2px=function(e){var t=parseFloat(e)*this.rem;return"string"==typeof e&&e.match(/rem$/)&&(t+="px"),t},l.px2rem=function(e){var t=parseFloat(e)/this.rem;return"string"==typeof e&&e.match(/px$/)&&(t+="rem"),t}}(window,window.lib||(window.lib={})),function(){var e="@charset \"utf-8\";html{overflow-y:scroll;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}html *{outline:0;-webkit-text-size-adjust:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}html,body{font-family:sans-serif}body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td,hr,button,article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{margin:0;padding:0}input,select,textarea{font-size:100%}table{border-collapse:collapse;border-spacing:0}fieldset,img{border:0}abbr,acronym{border:0;font-variant:normal}del{text-decoration:line-through}address,caption,cite,code,dfn,em,th,var{font-style:normal;font-weight:500}ol,ul{list-style:none}caption,th{text-align:left}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:500}q:before,q:after{content:''}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}a:hover{text-decoration:underline}ins,a{text-decoration:none}",t=document.createElement("style");if(document.getElementsByTagName("head")[0].appendChild(t),t.styleSheet)t.styleSheet.disabled||(t.styleSheet.cssText=e);else try{t.innerHTML=e}catch(n){t.innerText=e}}()},MXkr:function(e,t){},NHnr:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n("ECII"),a=n.n(i),o=n("5jRo"),r=(n("2Uyi"),n("vgQg")),s={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.navigatorVisible?n("nav",{attrs:{id:"nav"}},[n("router-link",{staticClass:"nav nav-index",attrs:{to:"/index"}},[e._v("主页")]),e._v(" "),n("router-link",{staticClass:"nav nav-answer",attrs:{to:"/answer"}},[e._v("答题")]),e._v(" "),n("router-link",{staticClass:"nav nav-learn",attrs:{to:"/learn"}},[e._v("学习")]),e._v(" "),n("router-link",{staticClass:"nav nav-rank",attrs:{to:"/rank"}},[e._v("排行榜")]),e._v(" "),n("router-link",{staticClass:"nav nav-home",attrs:{to:"/home"}},[e._v("我")])],1):e._e()},staticRenderFns:[]};var c={name:"App",components:{navBottom:n("VU/8")({name:"navBottom",props:{},data:function(){return{navigatorVisible:this.$store.state.navigatorVisible}},created:function(){},watch:{"$store.state.navigatorVisible":function(e,t){this.navigatorVisible=e}}},s,!1,function(e){n("7IJS")},null,null).exports},mixins:[o.a],data:function(){return{whiteList:["/","/game_pk","/game_unlimited","/game_level","/mycase","/article","/caseDetail","/reply","/share","/lucky","/game"],username:"",weixinid:"",wxConfig:{}}},created:function(){this.init()},methods:{init:function(){this.checkUrlPath(this.$route),this.getUserInfo()},getWxConfig:function(){var e=this;this.$api.getWxConfig({url:location.href}).then(function(t){1==t.code&&(e.wxConfig=t.data,e.wxConfig.jsApiList=["playVoice","pauseVoice","stopVoice","onVoicePlayEnd"],e.wxConfig.debug="true",e.$store.state.wxConfig=e.wxConfig,e.$wx.config(e.wxConfig))})},getUserInfo:function(){var e=this;this.$api.getUserInfo().then(function(t){1==t.code&&e.$store.dispatch("updateUserInfo",t.data)})},bindHomerId:function(){var e=this;this.$api.bindHomerId({username:this.username,weixinid:this.$store.state.openid}).then(function(t){1==t.code?(e.$popup("操作成功"),e.$store.dispatch("login",""),window.openid=""):e.$popup(t.msg)})},checkUrlPath:function(e){this.whiteList.indexOf(e.path)>-1?this.$store.dispatch("increment",!1):this.$store.dispatch("increment",!0),this.$forceUpdate()}},watch:{$route:function(e,t){this.checkUrlPath(e)}}},u={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("div",{attrs:{id:"main"}},[n("router-view",{staticClass:"child-view",attrs:{id:"child-view"}})],1),e._v(" "),e.$store.state.openid?n("div",{staticClass:"login-layer"},[n("div",{staticClass:"login-layer-bg",on:{click:function(t){e.$store.state.openid=""}}}),e._v(" "),n("div",{staticClass:"login-layer-form"},[n("h1",[e._v("绑定人事ID")]),e._v(" "),e._e(),e._v(" "),n("div",{staticClass:"lofin-form-row"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.username,expression:"username"}],attrs:{type:"number",name:"homeid",placeholder:"人事ID"},domProps:{value:e.username},on:{input:function(t){t.target.composing||(e.username=t.target.value)}}})]),e._v(" "),n("div",{staticClass:"login-form-btn",on:{click:e.bindHomerId}},[e._v("确认")])])]):e._e(),e._v(" "),n("nav-bottom")],1)},staticRenderFns:[]};var l=n("VU/8")(c,u,!1,function(e){n("zsN1")},null,null).exports,p=n("/ocq");a.a.use(p.a);var m=[{path:"/",name:"Knowledge Game",component:function(e){return n.e(4).then(function(){var t=[n("bWex")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"/index",name:"Knowledge Game",component:function(e){return n.e(8).then(function(){var t=[n("dAjm")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"/answer",name:"答题",component:function(e){return n.e(11).then(function(){var t=[n("QsFq")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"/home",name:"个人中心",component:function(e){return n.e(9).then(function(){var t=[n("wUZA")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"/rank",name:"排行榜",component:function(e){return n.e(7).then(function(){var t=[n("wrZl")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"/game",name:"答题",component:function(e){return Promise.all([n.e(0),n.e(12)]).then(function(){var t=[n("aTr5")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"/game_pk",name:"答题",component:function(e){return Promise.all([n.e(0),n.e(16)]).then(function(){var t=[n("085P")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"/game_unlimited",name:"答题",component:function(e){return Promise.all([n.e(0),n.e(14)]).then(function(){var t=[n("5YdR")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"/game_level",name:"答题",component:function(e){return Promise.all([n.e(0),n.e(15)]).then(function(){var t=[n("KIo0")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"/mycase",name:"我的案例",component:function(e){return n.e(2).then(function(){var t=[n("7S+o")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"/learn",name:"训练营",component:function(e){return n.e(3).then(function(){var t=[n("UOcd")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"/article",name:"训练营",component:function(e){return n.e(1).then(function(){var t=[n("Xt6H")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"/caseDetail",name:"训练营",component:function(e){return n.e(10).then(function(){var t=[n("57sx")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"/reply",name:"留言反馈",component:function(e){return n.e(6).then(function(){var t=[n("Wkgs")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"/share",name:"我要分享",component:function(e){return n.e(5).then(function(){var t=[n("Eg0l")];e.apply(null,t)}.bind(this)).catch(n.oe)}},{path:"/lucky",name:"积分抽奖",component:function(e){return n.e(13).then(function(){var t=[n("kluF")];e.apply(null,t)}.bind(this)).catch(n.oe)}}],d=new p.a({routes:m.map(function(e){return e.beforeEnter=function(e,t,n){document.title=e.name,n()},e}),scrollBehavior:function(e,t,n){return n||(t.meta.keepAlive&&(t.meta.savedPosition=document.body.scrollTop),{x:0,y:e.meta.savedPosition||0})}}),h=n("bOdI"),f=n.n(h),g=n("NYxO");a.a.use(g.a);var v=new g.a.Store(f()({state:{navigatorVisible:!1,openid:"",userInfo:{},wxConfig:{}},actions:{navigatorTrigger:function(){console.log(arguments)}},mutations:{increment:function(e,t){e.navigatorVisible=t},login:function(e,t){e.openid=t},updateUserInfo:function(e,t){e.userInfo=t}}},"actions",{increment:function(e,t){e.commit("increment",t)},login:function(e,t){e.commit("login",t)},updateUserInfo:function(e,t){e.commit("updateUserInfo",t)}})),b=n("iqGf"),y=n.n(b),x=n("//Fk"),w=n.n(x),C=n("mtWM"),k=n.n(C),_=n("mw3O"),j=n.n(_);var $=k.a.create({baseURL:r.a.apiHost,crossDomain:!0,headers:{"Content-Type":"application/x-www-form-urlencoded;charset=utf-8"},params:{},timeout:6e4,transformRequest:function(e){return j.a.stringify(e)}});$.interceptors.request.use(function(e){return e},function(e){return console.log(e),w.a.reject(e)}),$.interceptors.response.use(function(e){return e.data});var I=k.a.create({baseURL:r.a.apiHost,crossDomain:!0,headers:{"Content-Type":"multipart/form-data"},params:{},timeout:6e4});I.interceptors.request.use(function(e){return"post"===r.a.method&&"/api/common/upload"!=r.a.url&&(r.a.data=j.a.stringify(r.a.data)),e},function(e){return w.a.reject(e)}),I.interceptors.response.use(function(e){return e.data});var S={answerBegin:function(e){return this.ajax("/api/answer/begin","post",e)},answerEnd:function(e){return this.ajax("/api/answer/end","post",e)},getQuestion:function(e){return this.ajax("/api/answer/get_question","post",e)},questionReply:function(e){return this.ajax("/api/answer/reply","post",e)},getLeaderBoard:function(e){return this.ajax("/api/leaderboard","get",e)},getArticleList:function(e){return this.ajax("/api/articlelearn/list","get",e)},getArticleDetail:function(e){return this.ajax("/api/articlelearn/item","get",e)},getCaseList:function(e){return this.ajax("/api/articlecase/list","get",e)},caseLike:function(e){return this.ajax("/api/articlecase/like","post",e)},myCase:function(e){return this.ajax("/api/articlecase/my","get",e)},getCaseDetail:function(e){return this.ajax("/api/articlecase/item","get",e)},getUserInfo:function(e){return this.ajax("/api/user/userinfo","get",e)},signup:function(e){return this.ajax("/api/user/checkin","post",e)},feedBack:function(e){return this.ajax("/api/user/feedback","post",e)},fetchPost:function(e){return this.formsubmit("/api/common/upload","post",e)},createCase:function(e){return this.ajax("/api/articlecase/create","post",e)},updateCase:function(e){return this.ajax("/api/articlecase/update","post",e)},bindHomerId:function(e){return this.ajax("/api/user/bindhomerid","post",e)},getPrizeList:function(e){return this.ajax("/api/turntable/goods","post",e)},toLottery:function(e){return this.ajax("/api/turntable/lottery","post",e)},getPrizeRecord:function(e){return this.ajax("/api/turntable/my_prize","get",e)},getWxConfig:function(e){return this.ajax("/api/user/weixin","get",e)},ajax:function(e,t,n){return"get"==t?$.get(e,{params:n}):$.post(e,n)},formsubmit:function(e,t,n){return"get"==t?I.get(e,{params:n}):I.post(e,n)}},T=n("fxnj"),E=n.n(T),U=n("Fd2+"),P=(n("EDgR"),n("MXkr"),n("4ml/"),n("26DW"),{data:function(){return{visible:!1,message:"",duration:2e3,onClose:null,showClose:!1,closed:!1,timer:null}},watch:{closed:function(e){e&&(this.visible=!1,this.$el.addEventListener("transitionend",this.destroyElement))}},methods:{destroyElement:function(){this.$el.removeEventListener("transitionend",this.destroyElement),this.$destroy(!0),this.$el.parentNode.removeChild(this.$el)},close:function(){this.closed=!0,"function"==typeof this.onClose&&this.onClose(this)},clearTimer:function(){clearTimeout(this.timer)},startTimer:function(){var e=this;this.duration>0&&(this.timer=setTimeout(function(){e.closed||e.close()},this.duration))}},mounted:function(){this.startTimer()}}),L={render:function(){var e=this.$createElement,t=this._self._c||e;return t("transition",[this.visible?t("div",{staticClass:"Popup"},[t("span",[this._v(this._s(this.message))])]):this._e()])},staticRenderFns:[]};var F=n("VU/8")(P,L,!1,function(e){n("1WNi")},null,null).exports,A=n("pFYg"),V=n.n(A),M=Object.prototype.hasOwnProperty;function R(e){return null!==e&&"object"===(void 0===e?"undefined":V()(e))&&(t=e,n="componentOptions",M.call(t,n));var t,n}var z=a.a.extend(F),D=void 0,N=[],W=1,q=function e(t,n,i){if(!a.a.prototype.$isServer){i="function"==typeof i?i:new Function;var o="message_"+W++,r={message:t,duration:Number(n)||2e3,onClose:function(){e.close(o,i)}};return(D=new z({data:r})).id=o,R(D.message)&&(D.$slots.default=[D.message],D.message=null),D.vm=D.$mount(),document.body.appendChild(D.vm.$el),D.vm.visible=!0,D.dom=D.vm.$el,N.push(D),D.vm}};q.close=function(e,t){for(var n=0,i=N.length;n<i;n++)if(e===N[n].id){"function"==typeof t&&t(N[n]),N.splice(n,1);break}};var H=q,O=function e(t){arguments.length>1&&void 0!==arguments[1]&&arguments[1];e.installed||(t.component(H.name,H),t.prototype.$popup=H)};"undefined"!=typeof window&&window.Vue&&O(window.Vue);var B={install:O,Popup:H};a.a.config.productionTip=!1,a.a.use(y.a),a.a.prototype.$http=$,a.a.prototype.$api=S,a.a.prototype.$wx=E.a,a.a.use(U.a),a.a.use(B),new a.a({el:"#app",router:d,store:v,components:{App:l},template:"<App/>"})},vgQg:function(e,t,n){"use strict";t.a={apiHost:""}},zsN1:function(e,t){}},["NHnr"]);
//# sourceMappingURL=app.98af015ca911cd187e54.js.map