webpackJsonp([3],{"7S+o":function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i={components:{caseList:s("g801").a},data:function(){return{caseList:[],page:1,pagesize:10,case_loading:!1,case_all_loaded:!1,isedit:!0}},created:function(){this.getCaseList()},methods:{caseScroll:function(){this.caseDom&&(this.articleDom.clientHeight+this.articleDom.scrollTop+50>=document.querySelector(".case-list").clientHeight&&!this.case_all_loaded&&!this.case_loading&&(this.page++,this.getCaseList()))},getCaseList:function(){var t=this;this.case_loading||this.case_all_loaded||(this.case_loading=!0,this.$api.myCase({page:this.page,pagesize:this.pagesize}).then(function(e){1==e.code?(1==t.case_page?t.caseList=e.data.list:t.caseList=t.caseList.concat(e.data.list),e.data.page*e.pagesize>=e.data.total&&(t.case_all_loaded=!0)):t.$popup(e.msg)}))},share:function(){this.$router.push({path:"/share"})}}},a={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{on:{scroll:this.caseScroll}},[e("caseList",{attrs:{caseList:this.caseList,isedit:this.isedit}}),this._v(" "),e("div",{staticClass:"share-btn",on:{click:this.share}},[this._v("我要分享案例")])],1)},staticRenderFns:[]};var n=s("VU/8")(i,a,!1,function(t){s("lYzo")},null,null);e.default=n.exports},"az/z":function(t,e){},g801:function(t,e,s){"use strict";s("jCIP");var i=s("2Uyi"),a={name:"caseList",data:function(){return{baseUrl:i.a.ossUrl}},props:{caseList:{type:Array,default:[]},paddingBottom:{type:String,default:"0"},isedit:{type:Boolean,default:!1}},created:function(){},methods:{like:function(t){var e=this;this.$api.caseLike({id:t.id}).then(function(s){0==s.code?e.$set(t,"is_liked",s.data.is_liked):e.$popup(s.msg)})},toCaseDetail:function(t){this.$router.push({path:"/caseDetail",query:{id:t.id}})},editCase:function(t){this.$router.push({path:"/share",query:{id:t.id}})}}},n={render:function(){var t=this.$createElement,e=this._self._c||t;return 0==this.caseList.length?e("p",{staticClass:"case-list-empty"},[this._v("当前没有相关案例")]):this._e()},staticRenderFns:[]};var c=s("VU/8")(a,n,!1,function(t){s("az/z")},null,null);e.a=c.exports},jCIP:function(t,e){},lYzo:function(t,e){}});
//# sourceMappingURL=3.dcb22519284a167e6df8.js.map