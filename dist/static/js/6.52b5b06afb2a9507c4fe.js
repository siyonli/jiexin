webpackJsonp([6],{IolV:function(t,e){},Wkgs:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});s("bahC");var i={data:function(){return{title:"",message:"",pushing:!1}},created:function(){},methods:{publick:function(){var t=this;this.pushing||(this.title?this.message?(this.pushing=!0,this.$api.feedBack({title:this.title,message:this.message}).then(function(e){t.pushing=!1,1==e.code?(t.$popup("提交成功"),t.title="",t.message="",setTimeout(function(){t.$router.go(-1)},1e3)):t.$popup(e.msg)})):this.$popup("请输入正文"):this.$popup("请输入标题"))}}},a={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("div",{staticClass:"j-form"},[s("div",{staticClass:"j-form-content"},[s("div",{staticClass:"j-form-title"},[s("input",{directives:[{name:"model",rawName:"v-model",value:t.title,expression:"title"}],attrs:{type:"text",name:"title",placeholder:"请输入标题"},domProps:{value:t.title},on:{input:function(e){e.target.composing||(t.title=e.target.value)}}})]),t._v(" "),s("div",{staticClass:"j-form-textarea"},[s("textarea",{directives:[{name:"model",rawName:"v-model",value:t.message,expression:"message"}],attrs:{placeholder:"请输入正文"},domProps:{value:t.message},on:{input:function(e){e.target.composing||(t.message=e.target.value)}}})])]),t._v(" "),s("div",{staticClass:"j-form-btn",on:{click:t.publick}},[t._v("发布")])])])},staticRenderFns:[]};var n=s("VU/8")(i,a,!1,function(t){s("IolV")},null,null);e.default=n.exports},bahC:function(t,e){}});
//# sourceMappingURL=6.52b5b06afb2a9507c4fe.js.map