webpackJsonp([7],{"8CiA":function(t,n){},fhpn:function(t,n){},wrZl:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});e("8CiA");var i={render:function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"rank-wrap"},[e("div",{staticClass:"rank-tab"},[e("a",{class:{current:"personal"==t.type},on:{click:function(n){return t.tabChange("personal")}}},[t._v("个人")]),t._v(" "),e("a",{class:{current:"team"==t.type},on:{click:function(n){return t.tabChange("team")}}},[t._v("队长")]),t._v(" "),e("a",{class:{current:"union"==t.type},on:{click:function(n){return t.tabChange("union")}}},[t._v("联盟")])]),t._v(" "),e("div",{staticClass:"rank-container"},[e("div",{staticClass:"rank-title"},[t._v("\n            "+t._s("personal"==t.type?"个人":"team"==t.type?"队长":"联盟")+"排行榜\n        ")]),t._v(" "),"personal"!==t.type?e("ul",{staticClass:"rank-switch"},[e("li",{class:{current:"score"==t.item},on:{click:function(n){return t.switchChange("score")}}},[t._v("积分")]),t._v(" "),e("li",{class:{current:"correct_rate"==t.item},on:{click:function(n){return t.switchChange("correct_rate")}}},[t._v("正确率")]),t._v(" "),e("li",{class:{current:"checkin"==t.item},on:{click:function(n){return t.switchChange("checkin")}}},[t._v("签到率")]),t._v(" "),e("li",{class:{current:"case"==t.item},on:{click:function(n){return t.switchChange("case")}}},[t._v("提供案例次数")])]):t._e(),t._v(" "),e("ul",{staticClass:"rank-list"},t._l(t.rankList,function(n,i){return e("li",{key:n.id},[e("i",{staticClass:"rank-icon"},[t._v(t._s(i+1))]),t._v(" "),e("div",{staticClass:"union-name"},[t._v(t._s(n.name))]),t._v(" "),e("div",{staticClass:"union-point"},[e("em",[t._v(t._s(n.num))]),t._v(t._s(n.unit)+"\n                ")])])}),0)])])},staticRenderFns:[]};var a=e("VU/8")({data:function(){return{tabIndex:1,switchIndex:1,type:"personal",item:"score",itemCache:{},rankList:[]}},created:function(){this.getRank()},methods:{tabChange:function(t){this.itemCache[this.type]=this.item,this.type=t,this.item=this.itemCache[t]||"score",this.getRank()},switchChange:function(t){this.item=t,this.getRank()},getRank:function(){var t=this,n={type:this.type,item:this.item};this.$api.getLeaderBoard(n).then(function(n){t.rankList=1==n.code?n.data:[]})}}},i,!1,function(t){e("fhpn")},null,null);n.default=a.exports}});
//# sourceMappingURL=7.190aa3612ee1938cef0c.js.map