webpackJsonp([15],{P1fh:function(t,e){},aTr5:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});i("XTnM");var s={data:function(){return{baseUrl:"http://ask.dxytg.com",mode:this.$route.query.mode||"pk",matching:!0,rival:{},rule:{},batch_id:0,myScore:0,rivalScore:0,score:0,consuming:0,consumingText:"00:00",max_duration:20,userInfo:this.$store.state.userInfo,beginTime:"",endTime:"",cacheData:{},beginData:{},gameStatus:"matching",timingLeftStyle:"",timingRightStyle:"",isRotate:!1,timingCount:10,consumingTimer:null,countdownTimer:null,questionTimer:null,rivalTimer:null,gameTimer:null,checkAnswerTimer:null,currentQuestion:{},questionIndex:0,isCorrect:"",answerList:[],isCanDoAnswer:!0,isPkWin:!1,audioSrc:!1,rivalAnswerStatus:"",correctCount:0,wrongCount:0,audioPlaying:!1}},created:function(){var t=navigator.userAgent;this.isIOS=!!t.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),this.init()},methods:{init:function(){this.destroyTimer(),this.matching=!0,this.gameStatus="matching",this.isCanDoAnswer=!0,this.beginData=[],this.questionIndex=0,this.timingLeftStyle="",this.timingRightStyle="",this.consuming=0,this.myScore=0,this.rivalScore=0,this.isCorrect="",this.rivalAnswerStatus="",this.wrongCount=0,this.begin()},begin:function(){var t=this;"pk"==this.mode&&(this.consumingTimer=setInterval(function(){t.consuming++},1e3)),this.$api.answerBegin({mode:this.mode}).then(function(e){1==e.code?t.answerBeginHandle(e.data):(t.$popup(e.msg),t.goBack())})},answerBeginHandle:function(t){this.rival=t.rival,this.rule=t.rule,this.batch_id=t.batch_id,this.getQuestion(t.batch_id),clearInterval(this.consumingTimer),this.consumingTimer=null},getQuestion:function(t){var e=this;this.$api.getQuestion({batch_id:t}).then(function(t){1==t.code&&t.data.length?(e.beginData=t.data,e.beginGame(0),e.bindAudioEvent()):(e.$popup(t.msg||"服务器数据出错"),e.goBack())})},beginGame:function(t){var e=this;if(t>=this.beginData.length)this.gameEnd();else{this.timingRightStyle="",this.timingLeftStyle="",this.isCanDoAnswer=!0,this.gameStatus="prepare",this.questionIndex=t,this.currentQuestion=this.beginData[this.questionIndex],this.isCorrect="",this.rivalAnswerStatus="",this.answerList=this.currentQuestion.options_list.map(function(t){return 0});var i=this.currentQuestion.correct_list;if(this.currentQuestion.correct_list=this.currentQuestion.options_list.map(function(t,e){return i.indexOf(e)>-1}),"unlimited"!==this.mode)var s=this.currentQuestion.max_duration||this.max_duration;this.currentQuestion.audio&&(this.audioPreload(this.currentQuestion.audio),this.isIOS&&(s+=4)),this.questionTimer=setTimeout(function(){e.gameStatus="start",e.beginTime=(new Date).getTime(),"unlimited"!==e.mode&&e.timingCountDown(s),"level"==e.mode&&(e.ruleitem=e.rule[Math.floor(e.questionIndex/5)]),"pk"==e.mode&&(e.rivalTimer=setTimeout(function(){e.rivalAnswerStatus=1==e.currentQuestion.rival_correct?"success":"fail",e.isBothAnswer("对手答题完毕")},1e3*e.currentQuestion.rival_duration))},1500)}},gameEnd:function(){var t=this;console.log("game over"),this.$api.answerEnd({batch_id:this.batch_id}).then(function(e){t.gameStatus="end",t.isPkWin=e.data.score>0,1==e.code?t.score=e.data.score:t.$popup(e.msg)})},doAnswer:function(t){if(this.isCanDoAnswer){var e=this.answerList.some(function(t){return t});if("single"==this.currentQuestion.question_type){if(!e){this.answerList[t]=1,this.endTime=(new Date).getTime();this.checkAnswerIsCorrect()}}else this.answerList[t]=!this.answerList[t];if("pk"==this.mode){if("single"==this.currentQuestion.question_type){e=this.checkAnswerIsCorrect();this.isCorrect=e?"success":"fail",this.isBothAnswer("本人答题完毕")}}else"single"==this.currentQuestion.question_type&&this.checkAnswer();this.$forceUpdate()}},manualAnswer:function(){if("single"!=this.currentQuestion.question_type)if("pk"==this.mode){this.endTime=(new Date).getTime();var t=this.checkAnswerIsCorrect();this.isCorrect=t?"success":"fail",this.isBothAnswer("本人答题完毕")}else this.checkAnswer()},checkAnswer:function(){var t=this;this.stopAudio(),this.isCanDoAnswer=!1,this.gameStatus="checking";var e=this.checkAnswerIsCorrect();this.isCorrect=e?"success":"fail","pk"==this.mode&&(this.myScore+=e?this.rule.win_score:0),"unlimited"==this.mode&&(this.myScore+=e?this.rule.one_correct_score:0),"level"==this.mode&&(this.myScore+=e?this.ruleitem.level_score:0),this.rivalScore+=1==this.currentQuestion.rival_correct?this.rule.win_score:0,this.wrongCount+=e?0:1,this.correctCount+=e?1:0,clearInterval(this.countdownTimer),this.countdownTimer=null,this.isRotate=!1,this.questionReply();var i="level"==this.mode&&this.wrongCount>0;this.checkAnswerTimer=setTimeout(function(){if(i)t.gameEnd();else{if(t.questionIndex%5==4&&"level"==t.mode)return t.gameStatus="end",t.isPkWin=!0,void(t.score=t.correctCount*t.ruleitem.level_score);var e=t.questionIndex+1;"unlimited"==t.mode&&t.wrongCount>=3?t.gameEnd():t.beginGame(e)}},2e3)},checkAnswerIsCorrect:function(){var t=this,e=this.answerList.filter(function(t){return t}).length,i=this.currentQuestion.correct_list.filter(function(t){return t}).length,s=this.currentQuestion.correct_list.every(function(e,i){return!!e==!!t.answerList[i]});return e==i&&s},isBothAnswer:function(t){var e=this;console.log(t,this.isCorrect,this.rivalAnswerStatus,this.myScore),this.isCorrect&&this.rivalAnswerStatus?(this.stopAudio(),clearInterval(this.countdownTimer),this.countdownTimer=null,this.isRotate=!1,this.isCanDoAnswer=!1,this.gameStatus="checking",this.myScore+="success"==this.isCorrect?this.rule.win_score:0,this.rivalScore+=1==this.currentQuestion.rival_correct?this.rule.win_score:0,this.questionReply(),this.gameTimer=setTimeout(function(){e.beginGame(e.questionIndex+1)},2e3)):this.isCorrect&&(this.gameStatus="checking")},loadedmetadata:function(){var t=document.getElementById("qa-audio");this.currentQuestion.duration=t.duration},audioPreload:function(t){var e=this;this.$nextTick(function(){var i=document.getElementById("qa-audio");i&&(t.forEach(function(t){var s=document.createElement("source"),n=t.split(".")[1];s.type="ogg"==n?"audio/ogg":"audio/mpeg",s.src=e.baseUrl+t,i.appendChild(s)}),i.addEventListener("loadedmetadata",e.loadedmetadata,!0),i.addEventListener("timeupdate",e.loadedmetadata,!0),i.addEventListener("canplay",e.loadedmetadata,!0),i.load())})},playAudio:function(){this.audioPlaying=!0;var t=document.getElementById("qa-audio");t.play(),t.removeEventListener("loadedmetadata",this.loadedmetadata,!0),t.removeEventListener("timeupdate",this.loadedmetadata,!0),t.removeEventListener("canplay",this.loadedmetadata,!0)},stopAudio:function(){var t=document.getElementById("qa-audio");t.pause(),t.currentTime=0,this.audioPlaying=!1},bindAudioEvent:function(){var t=this;setTimeout(function(){document.getElementById("qa-audio").addEventListener("ended",function(){t.audioPlaying=!1})},1e3)},timingCountDown:function(t){var e=this;this.timingCount=t;var i=5*Number(t),s=0;this.countdownTimer=setInterval(function(){++s%10==0&&e.timingCount--,s<=i?e.timingRightStyle="transform: rotate("+(180/i*s-45)+"deg)":e.timingLeftStyle="transform: rotate("+(180/i*(s-i)-45)+"deg)",e.timingCount<=0&&(clearInterval(e.countdownTimer),e.countdownTimer=null,e.isRotate=!1,e.checkAnswer())},100)},nextLevel:function(){this.correctCount=0,this.beginGame(this.questionIndex+1)},questionReply:function(){var t=((this.endTime||(new Date).getTime())-this.beginTime)/1e3,e=this.answerList.map(function(t,e){return t?String(e):""}).filter(function(t){return t}),i={batch_id:this.batch_id,question_id:this.currentQuestion.id,selecteds:e,duration:t};e.length||(i.selecteds[0]=""),this.$api.questionReply(i)},oneMoreTry:function(){this.init()},goBack:function(){this.$router.go(-1)},destroyTimer:function(){clearTimeout(this.consumingTimer),clearTimeout(this.countdownTimer),clearTimeout(this.questionTimer),clearTimeout(this.rivalTimer),clearTimeout(this.gameTimer),clearTimeout(this.checkAnswerTimer),this.consumingTimer=null,this.countdownTimer=null,this.questionTimer=null,this.rivalTimer=null,this.gameTimer=null,this.checkAnswerTimer=null}},beforeDestroy:function(){this.destroyTimer()},watch:{consuming:function(t){var e=t-t%60,i=t-60*e;e=e<10?"0"+e:e,i=i<10?"0"+i:i,this.consumingText=e+":"+i}},filters:{duration2str:function(t){t=Math.ceil(t||0);var e=Math.floor(t/3600),i=Math.floor((t-3600*e)/60),s=t-60*i-3600*e;return i=i<10?"0"+i:i,s=s<10?"0"+s:s,e?e<10?"0"+e:e:i+":"+s}}},n={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"game-wrap"},[t._m(0),t._v(" "),"pk"==t.mode&&"matching"==t.gameStatus?i("div",{staticClass:"matching"},[i("div",{staticClass:"matching-animate"},[i("div",{staticClass:"user"},[i("img",{attrs:{src:t.userInfo.avatar}})]),t._v(" "),i("div",{staticClass:"matching-planet matching-planet-1"}),t._v(" "),i("div",{staticClass:"matching-planet matching-planet-2"}),t._v(" "),i("div",{staticClass:"matching-planet matching-planet-3"}),t._v(" "),t.matching?t._e():i("div",{staticClass:"rival"},[i("img",{attrs:{src:t.rival.avatar}})])]),t._v(" "),t.matching?i("div",{staticClass:"matching-consuming"},[t._v("正在匹配 "+t._s(t.consumingText))]):i("div",{staticClass:"matching-consuming"},[t._v("匹配完成")]),t._v(" "),t.matching?i("div",{staticClass:"matching-btn matching-btn-cancel",on:{click:t.goBack}},[t._v("取消")]):i("div",{staticClass:"matching-btn matching-btn-done"},[t._v("正在进入")])]):t._e(),t._v(" "),"matching"!==t.gameStatus&&"end"!==t.gameStatus?i("div",{staticClass:"game-container"},[i("div",{staticClass:"game-player"},[i("div",{staticClass:"game-player-self"},[i("div",{staticClass:"game-player-score"},[t._v(t._s(t.myScore))]),t._v(" "),i("div",{class:["game-player-avatar",{success:"success"==t.isCorrect},{fail:"fail"==t.isCorrect}]},[i("img",{attrs:{src:t.userInfo.avatar}})])]),t._v(" "),"pk"==t.mode?i("div",{staticClass:"game-player-rival"},[i("div",{class:["game-player-avatar",t.rivalAnswerStatus]},[i("img",{attrs:{src:t.rival.avatar}})]),t._v(" "),i("div",{staticClass:"game-player-score"},[t._v(t._s(t.rivalScore))])]):t._e(),t._v(" "),"start"!=t.gameStatus&&"checking"!=t.gameStatus||"unlimited"===t.mode?t._e():i("div",{staticClass:"game-timing"},[i("div",{staticClass:"game-timing-left"},[i("i",{class:{rotate:t.isRotate},style:t.timingLeftStyle})]),t._v(" "),i("div",{staticClass:"game-timing-right"},[i("i",{class:{rotate:t.isRotate},style:t.timingRightStyle})]),t._v(" "),i("span",[t._v(t._s(t.timingCount))])]),t._v(" "),"start"!=t.gameStatus&&"checking"!=t.gameStatus||"unlimited"!=t.mode?t._e():i("div",{staticClass:"game-remaining"},[i("i",{class:{grey:t.wrongCount>0}}),t._v(" "),i("i",{class:{grey:t.wrongCount>1}}),t._v(" "),i("i",{class:{grey:t.wrongCount>2}})])]),t._v(" "),"prepare"==t.gameStatus?i("div",{class:["game-question-type",t.currentQuestion.question_type]},[i("label",[t._v("第"+t._s(t.questionIndex+1)+"题")]),t._v(" "),i("div",{staticClass:"q-type"},[t._v(t._s("single"==t.currentQuestion.question_type?"单选题":"多选题"))])]):t._e(),t._v(" "),"start"==t.gameStatus||"checking"==t.gameStatus?i("div",{staticClass:"game-qa"},[i("div",{staticClass:"game-question"},[t._v("\n                "+t._s(t.currentQuestion.title)+"\n                "),t.currentQuestion.image?i("img",{attrs:{src:t.currentQuestion.image}}):t._e(),t._v(" "),t.currentQuestion.audio?i("div",{staticClass:"game-q-audio",class:{playing:t.audioPlaying},on:{click:t.playAudio}},[i("span",[t._v(t._s(t._f("duration2str")(t.currentQuestion.duration)))]),i("span",[t._v(t._s(t.isIOS?"  点击播放":""))])]):t._e()]),t._v(" "),i("ul",{staticClass:"game-answer-list"},t._l(t.currentQuestion.options_list,function(e,s){return i("li",{key:s,class:{choose:1==t.answerList[s],correct:t.currentQuestion.correct_list[s]&&"checking"==t.gameStatus,success:t.currentQuestion.correct_list[s]&&1==t.answerList[s]&&"checking"==t.gameStatus,fail:!t.currentQuestion.correct_list[s]&&1==t.answerList[s]&&"checking"==t.gameStatus},on:{click:function(e){return t.doAnswer(s)}}},[t._v(t._s(e))])}),0),t._v(" "),"checking"==t.gameStatus?i("div",{class:["game-answer-result",t.isCorrect?t.isCorrect:""]},["fail"==t.isCorrect?i("span",[t._v("很遗憾，回答错误")]):t._e(),t._v(" "),"success"==t.isCorrect?i("span",[t._v("恭喜您，回答正确")]):t._e()]):t._e()]):t._e(),t._v(" "),"single"!=t.currentQuestion.question_type&&"start"==t.gameStatus?i("div",{staticStyle:{height:"1.86rem"}}):t._e(),t._v(" "),"single"!=t.currentQuestion.question_type&&"start"==t.gameStatus?i("div",{staticClass:"mulit-btn",on:{click:t.manualAnswer}},[t._v("确定")]):t._e()]):t._e(),t._v(" "),"end"==t.gameStatus?i("div",{class:["layer-pk-mode",t.isPkWin?"success":"fail"]},[i("div",{staticClass:"gameover-result-title"},[t._v(t._s(t.isPkWin?"胜利":"失败"))]),t._v(" "),i("div",{staticClass:"gameover-result-content"},["pk"==t.mode?i("div",{staticStyle:{overflow:"hidden"}},[i("div",{staticClass:"myself"},[i("div",{staticClass:"avatar"},[i("img",{attrs:{src:t.userInfo.avatar}})]),t._v(" "),i("div",{staticClass:"score"},[t._v(t._s(t.myScore))])]),t._v(" "),i("div",{staticClass:"rival"},[i("div",{staticClass:"avatar"},[i("img",{attrs:{src:t.rival.avatar}})]),t._v(" "),i("div",{staticClass:"score"},[t._v(t._s(t.rivalScore))])])]):i("div",{staticStyle:{overflow:"hidden"}},[t._m(1)]),t._v(" "),t._m(2),t._v(" "),i("div",{staticClass:"game-score-count"},[t._v("积分+"+t._s(t.score))]),t._v(" "),i("div",{staticClass:"gameover-btns"},[i("a",{staticClass:"goback",on:{click:t.goBack}},[t._v("返回")]),t._v(" "),"level"!=t.mode?i("a",{staticClass:"try-again",on:{click:function(e){return t.oneMoreTry()}}},[t._v("再来一局")]):t._e(),t._v(" "),"level"==t.mode&&"end"==t.gameStatus&&(t.questionIndex==t.beginData.length-1||t.questionIndex<t.beginData.length-1&&!t.isPkWin)?i("a",{staticClass:"try-again",on:{click:function(e){return t.oneMoreTry()}}},[t._v("再来一局")]):t._e(),t._v(" "),"level"==t.mode&&"end"==t.gameStatus&&t.questionIndex<t.beginData.length-1&&t.isPkWin?i("a",{staticClass:"try-again",on:{click:function(e){return t.nextLevel()}}},[t._v("下一关")]):t._e()])])]):t._e()])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticStyle:{display:"none"}},[e("audio",{attrs:{id:"qa-audio",preload:"preload"}})])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"myself"},[e("div",{staticClass:"avatar"})])},function(){var t=this.$createElement,e=this._self._c||t;return e("label",{staticClass:"game-this-round"},[e("em",[this._v("本局奖励")])])}]};var a=i("VU/8")(s,n,!1,function(t){i("P1fh")},null,null);e.default=a.exports}});
//# sourceMappingURL=15.d42bdb94cb4035e45015.js.map