webpackJsonp([11],{JAgW:function(t,e){},QsFq:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});i("hw2i");var n={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"answer-warp"},[i("h1",{staticClass:"answer-page-title"},[t._v("答题赢积分")]),t._v(" "),i("div",{staticClass:"answer-mode answer-mode-pk"},[i("div",{staticClass:"mode-title"},[t._v("PK模式")]),t._v(" "),i("div",{staticClass:"mode-desc"},[t._v("匹配对手，一轮题数为10题，赢过对手则奖励积分。")]),t._v(" "),i("button",{on:{click:function(e){return t.beginGame("pk")}}},[t._v("开始")])]),t._v(" "),i("div",{staticClass:"answer-mode answer-mode-unlimited"},[i("div",{staticClass:"mode-title"},[t._v("无限模式")]),t._v(" "),i("div",{staticClass:"mode-desc"},[t._v("有3次错误的机会，超过后答题结束，答对的题目获得积分。")]),t._v(" "),i("button",{on:{click:function(e){return t.beginGame("unlimited")}}},[t._v("开始")])]),t._v(" "),i("div",{staticClass:"answer-mode answer-mode-level"},[i("div",{staticClass:"mode-title"},[t._v("闯关模式")]),t._v(" "),i("div",{staticClass:"mode-desc"},[t._v("共10个关卡，每关5题，答题时间递减，每关卡可得相应积分。")]),t._v(" "),i("button",{on:{click:function(e){return t.beginGame("level")}}},[t._v("开始")])]),t._v(" "),i("div",{staticStyle:{height:"0.4rem"}})])},staticRenderFns:[]};var s=i("VU/8")({data:function(){return{}},created:function(){},methods:{init:function(){},beginGame:function(t){this.$router.push({path:"/game_"+t})}},watch:{}},n,!1,function(t){i("JAgW")},null,null);e.default=s.exports},hw2i:function(t,e){}});
//# sourceMappingURL=11.c14c9f570660e6c3efd9.js.map