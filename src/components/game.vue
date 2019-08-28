<template>
    <div class="game-wrap">

        <div style="display: none;">
            <audio id="qa-audio" preload="preload"></audio>
        </div>
        <div class="matching" v-if="mode=='pk' && gameStatus == 'matching'">
            <div class="matching-animate">
                <div class="user">
                    <img :src="userInfo.avatar">
                </div>
                <div class="matching-planet matching-planet-1"></div>
                <div class="matching-planet matching-planet-2"></div>
                <div class="matching-planet matching-planet-3"></div>
                <div class="rival" v-if="!matching">
                    <img :src="rival.avatar">
                </div>
            </div>
            <div class="matching-consuming" v-if="matching">正在匹配 {{consumingText}}</div>
            <div class="matching-consuming" v-else>匹配完成</div>
            <div class="matching-btn matching-btn-cancel" v-if="matching" @click="goBack">取消</div>
            <div class="matching-btn matching-btn-done" v-else>正在进入</div>
        </div>

        <div class="game-container" v-if="gameStatus !== 'matching' && gameStatus!=='end'">
            <div class="game-player">
                <div class="game-player-self">
                    <div class="game-player-score">{{myScore}}</div>
                    <div :class="['game-player-avatar',{success:isCorrect=='success'},{fail:isCorrect=='fail'}]">
                        <img :src="userInfo.avatar">
                    </div>
                </div>
                <div class="game-player-rival" v-if="mode=='pk'">
                    <div :class="['game-player-avatar',rivalAnswerStatus]">
                        <img :src="rival.avatar">
                    </div>
                    <div class="game-player-score">{{rivalScore}}</div>
                </div>
                <div class="game-timing" v-if="(gameStatus=='start' || gameStatus=='checking') && mode!=='unlimited'">
                    <div class="game-timing-left"><i :class="{rotate:isRotate}" :style="timingLeftStyle"></i></div>
                    <div class="game-timing-right"><i :class="{rotate:isRotate}" :style="timingRightStyle"></i></div>
                    <span>{{timingCount}}</span>
                </div>
                <div class="game-remaining" v-if="(gameStatus=='start' || gameStatus=='checking') && mode=='unlimited'">
                    <i :class="{grey:wrongCount>0}"></i>
                    <i :class="{grey:wrongCount>1}"></i>
                    <i :class="{grey:wrongCount>2}"></i>
                </div>
            </div>
            <div :class="['game-question-type',currentQuestion.question_type]" v-if="gameStatus=='prepare'">
                <label>第{{questionIndex+1}}题</label>
                <div class="q-type">{{currentQuestion.question_type == "single" ? "单选题" : "多选题"}}</div>
            </div>
            <div class="game-qa" v-if="gameStatus=='start' || gameStatus=='checking'">
                <div class="game-question">
                    {{currentQuestion.title}}
                    <img v-if="currentQuestion.image" :src="currentQuestion.image">
                    <div class="game-q-audio" :class="{playing:audioPlaying}" @click="playAudio" v-if="currentQuestion.audio">
                        <span>{{currentQuestion.duration|duration2str}}</span><span>{{isIOS ? "  点击播放":""}}</span>
                    </div>
                </div>
                <ul class="game-answer-list">
                    <li v-for="(q,i) in currentQuestion.options_list" :key="i" @click="doAnswer(i)"
                        :class="{
                            choose : answerList[i]==1,
                            correct: currentQuestion.correct_list[i] && gameStatus=='checking',
                            success: currentQuestion.correct_list[i] && answerList[i]==1 && gameStatus=='checking',
                            fail : !currentQuestion.correct_list[i] && answerList[i]==1 && gameStatus=='checking'
                        }"
                    >{{q}}</li>
                </ul>
                <div :class="['game-answer-result',isCorrect ? isCorrect : '']" v-if="gameStatus=='checking'">
                    <span v-if="isCorrect=='fail'">很遗憾，回答错误</span>
                    <span v-if="isCorrect=='success'">恭喜您，回答正确</span>
                </div>
            </div>
            <div style="height: 1.86rem" v-if="currentQuestion.question_type != 'single' && gameStatus=='start'"></div>
            <div class="mulit-btn" v-if="currentQuestion.question_type != 'single' && gameStatus=='start'" @click="manualAnswer">确定</div>
        </div>

        <div :class="['layer-pk-mode',isPkWin?'success':'fail']" v-if="gameStatus == 'end'">
            <div class="gameover-result-title">{{isPkWin?"胜利":"失败"}}</div>
            <div class="gameover-result-content">
                <div style="overflow: hidden;" v-if="mode == 'pk'">
                    <div class="myself">
                        <div class="avatar"><img :src="userInfo.avatar"></div>
                        <div class="score">{{myScore}}</div>
                    </div>
                    <div class="rival">
                        <div class="avatar"><img :src="rival.avatar"></div>
                        <div class="score">{{rivalScore}}</div>
                    </div>
                </div>
                <div style="overflow: hidden;" v-else>
                    <div class="myself">
                        <div class="avatar"></div>
                    </div>
                </div>
                <label class="game-this-round"><em>本局奖励</em></label>
                <div class="game-score-count">积分+{{score}}</div>
                <div class="gameover-btns">
                    <a class="goback" @click="goBack">返回</a>
                    <a class="try-again" @click="oneMoreTry()" v-if="mode!='level'">再来一局</a>
                    <a class="try-again" 
                    @click="oneMoreTry()" 
                    v-if="mode=='level' && gameStatus == 'end' && (questionIndex==beginData.length-1 || (questionIndex<beginData.length-1 && !isPkWin))" 
                    >再来一局</a>
                    <a class="try-again" @click="nextLevel()" v-if="mode=='level' && gameStatus == 'end' && questionIndex<beginData.length-1 && isPkWin" >下一关</a>
                </div>
            </div>
            
        </div>


    </div>
</template>

<script>
    import '../assets/scss/game.scss'
    export default {
        data() {
            return {
                baseUrl : "http://ask.dxytg.com",
                mode : this.$route.query.mode || "pk",      //模式
                matching : true,                    //匹配状态 true匹配中
                rival : {},                          //对手  
                rule : {}, 
                batch_id : 0,
                myScore : 0,
                rivalScore : 0,
                score : 0,
                consuming : 0,                      //耗时
                consumingText : '00:00',            //耗时
                max_duration : 20,
                userInfo : this.$store.state.userInfo,
                beginTime : '',
                endTime : '',
                cacheData : {},
                beginData : {},
                gameStatus : 'matching',            //游戏状态 matching 匹配中 prepare 准备 start 开始 checking 检查答案 end 结束
                timingLeftStyle : '',
                timingRightStyle : '',
                isRotate : false,
                timingCount : 10,
                consumingTimer : null,
                countdownTimer : null,
                questionTimer : null,
                rivalTimer : null,
                gameTimer : null,
                checkAnswerTimer : null,
                currentQuestion : {},
                questionIndex : 0,
                isCorrect : '',
                answerList : [],
                isCanDoAnswer : true,
                isPkWin : false,
                audioSrc : false,
                rivalAnswerStatus : '',
                correctCount : 0,
                wrongCount : 0,
                audioPlaying : false
            }
        },
        created() {
            var u = navigator.userAgent;
            this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            this.init();
        },
        methods: {
            init(){
                this.destroyTimer();
                this.matching = true;
                this.gameStatus = 'matching';
                this.isCanDoAnswer = true;
                this.beginData = [];
                this.questionIndex = 0;
                this.timingLeftStyle = '';
                this.timingRightStyle = '';
                this.consuming = 0;
                this.myScore = 0;
                this.rivalScore = 0;
                this.isCorrect= '';
                this.rivalAnswerStatus = '';
                this.wrongCount = 0;
                this.begin();
            },
            /** 开始 **/
            begin(){
                if(this.mode == 'pk'){
                    this.consumingTimer = setInterval(()=>{
                        this.consuming++;
                    },1000)
                }
                this.$api.answerBegin({
                    mode : this.mode
                }).then(res=>{
                    if(res.code == 1){
                        this.answerBeginHandle(res.data);
                    }else{
                        this.$popup(res.msg);
                        this.goBack();
                    }
                })
            },
            answerBeginHandle(data){
                this.rival = data.rival;
                this.rule = data.rule;
                this.batch_id = data.batch_id;
                this.getQuestion(data.batch_id);
                clearInterval(this.consumingTimer);
                this.consumingTimer = null;
            },
            /**
            *   获取问题列表
            */
            getQuestion(batch_id){
                this.$api.getQuestion({
                    batch_id : batch_id
                }).then(res=>{
                    if(res.code == 1 && res.data.length){
                        this.beginData = res.data;
                        this.beginGame(0);
                        this.bindAudioEvent();
                    }else{
                        this.$popup(res.msg || "服务器数据出错");
                        this.goBack();
                    }
                })
            },
            beginGame(index){
                if(index >= this.beginData.length){
                    this.gameEnd();
                    return;
                }
                this.timingRightStyle = '';
                this.timingLeftStyle = '';
                this.isCanDoAnswer = true;
                this.gameStatus = 'prepare';
                this.questionIndex = index;
                this.currentQuestion = this.beginData[this.questionIndex];
                this.isCorrect = '';
                this.rivalAnswerStatus = '';
                this.answerList = this.currentQuestion.options_list.map(a=>0);
                var arr = this.currentQuestion.correct_list;
                this.currentQuestion.correct_list = this.currentQuestion.options_list.map((a,i)=>{
                    return arr.indexOf(i) > -1;
                })
                if(this.mode !== "unlimited"){
                    var duration = (this.currentQuestion.max_duration || this.max_duration);
                }
                if(this.currentQuestion.audio){
                    this.audioPreload(this.currentQuestion.audio);
                    if(this.isIOS){
                        duration += 4;
                    }
                }
                this.questionTimer = setTimeout(()=>{
                    this.gameStatus = 'start';
                    this.beginTime = new Date().getTime();
                    if(this.mode !== "unlimited"){
                        this.timingCountDown(duration);
                    }
                    if(this.mode == 'level'){
                        this.ruleitem = this.rule[Math.floor(this.questionIndex/5)];
                    }
                    if(this.mode == 'pk'){
                        this.rivalTimer = setTimeout(()=>{
                            this.rivalAnswerStatus = this.currentQuestion.rival_correct == 1 ? "success" : "fail"
                            this.isBothAnswer("对手答题完毕");
                        },this.currentQuestion.rival_duration*1000)
                    }
                },1500)
            },
            /**
            *   开始pk模式
            */
            gameEnd(){
                console.log("game over");
                this.$api.answerEnd({
                    batch_id : this.batch_id
                }).then(res=>{
                    this.gameStatus = 'end';
                    this.isPkWin = res.data.score > 0;
                    if(res.code==1){
                        this.score = res.data.score;
                    }else{
                        this.$popup(res.msg);
                    }
                })
            },
            /**
            *   点击答案选项
            */
            doAnswer(index){
                if(!this.isCanDoAnswer){
                    return;
                }
                var bool = this.answerList.some(a=>a);

                if(this.currentQuestion.question_type == 'single'){
                    if(!bool){
                        this.answerList[index] = 1;
                        this.endTime = new Date().getTime();
                        var _bool = this.checkAnswerIsCorrect();
                        // this.isCorrect = _bool ? "success" : "fail";
                    }
                }else{
                    this.answerList[index] = !this.answerList[index];
                }
                if(this.mode == 'pk'){
                    if(this.currentQuestion.question_type=='single'){
                        var bool = this.checkAnswerIsCorrect();
                        this.isCorrect = bool ? "success" : "fail";
                        this.isBothAnswer("本人答题完毕");
                    }
                }else{
                    if(this.currentQuestion.question_type=='single'){
                        this.checkAnswer();
                    }
                }
                this.$forceUpdate();
            },
            manualAnswer(){
                if(this.currentQuestion.question_type=='single'){
                    return;
                }
                if(this.mode == 'pk'){
                    this.endTime = new Date().getTime();
                    var bool = this.checkAnswerIsCorrect();
                    this.isCorrect = bool ? "success" : "fail";
                    this.isBothAnswer("本人答题完毕");
                }else{
                    this.checkAnswer();
                }
            },
            /**
            *   检查答题情况
            */
            checkAnswer(){
                this.stopAudio();
                this.isCanDoAnswer = false;
                this.gameStatus = 'checking';
                var bool = this.checkAnswerIsCorrect();
                this.isCorrect = bool ? "success" : "fail";
                if(this.mode == 'pk'){
                    this.myScore+= bool ? this.rule.win_score : 0;
                }
                if(this.mode == 'unlimited'){
                    this.myScore+= bool ? this.rule.one_correct_score : 0;
                }
                if(this.mode == 'level'){
                    this.myScore+= bool ? this.ruleitem.level_score : 0;
                }
                this.rivalScore += this.currentQuestion.rival_correct == 1 ? this.rule.win_score : 0;
                this.wrongCount += bool ? 0 : 1;
                this.correctCount += bool ? 1 : 0;
                clearInterval(this.countdownTimer);
                this.countdownTimer = null;
                this.isRotate = false;
                this.questionReply();
                
                var isLevelWrong = this.mode == 'level' && this.wrongCount > 0;
                
                this.checkAnswerTimer = setTimeout(()=>{
                    if(isLevelWrong){
                        this.gameEnd();
                        return;
                    }
                    if(this.questionIndex%5==4 && this.mode == 'level'){
                        this.gameStatus = "end";
                        this.isPkWin = true;
                        this.score = this.correctCount * this.ruleitem.level_score;
                        return;
                    }
                    var index = this.questionIndex+1;
                    if(this.mode == 'unlimited' && this.wrongCount >= 3){
                        this.gameEnd();
                    }else{
                        this.beginGame(index);
                    }
                },2000)
                
            },
            /**
            *   检查我的答案是否正确
            */
            checkAnswerIsCorrect(){
                var a_length = this.answerList.filter(a=>a).length;
                var c_length = this.currentQuestion.correct_list.filter(a=>a).length;
                var is = this.currentQuestion.correct_list.every((a,i)=>{
                    return !!a == !!this.answerList[i];
                })
                return a_length==c_length && is;
            },
            /**
            *   PK模式下 检查双方是否都已经答题完毕
            */
            isBothAnswer(msg){
                console.log(msg,this.isCorrect,this.rivalAnswerStatus,this.myScore)
                
                if(this.isCorrect && this.rivalAnswerStatus){
                    this.stopAudio();
                    clearInterval(this.countdownTimer);
                    this.countdownTimer = null;
                    this.isRotate = false;
                    this.isCanDoAnswer = false;
                    this.gameStatus = 'checking';
                    this.myScore+= this.isCorrect=='success' ? this.rule.win_score : 0;
                    this.rivalScore += this.currentQuestion.rival_correct == 1 ? this.rule.win_score : 0;
                    this.questionReply();
                    this.gameTimer = setTimeout(()=>{
                        this.beginGame(this.questionIndex+1);
                    },2000)
                }else if(this.isCorrect){
                    this.gameStatus = 'checking';
                }
            },
            /**
            *   音频loadedmetadata事件
            */
            loadedmetadata(){
                var audio = document.getElementById("qa-audio");
                this.currentQuestion.duration = audio.duration;
            },
            /**
            *   预加载音频
            */
            audioPreload(audioSrc){
                this.$nextTick(()=>{
                    var audio = document.getElementById("qa-audio");
                    if(!audio){return;}
                    audioSrc.forEach(src=>{
                        var source = document.createElement("source");
                        var type = src.split(".")[1];
                        source.type = type == "ogg" ? "audio/ogg" : "audio/mpeg";
                        source.src = this.baseUrl + src;
                        audio.appendChild(source);
                    })
                    audio.addEventListener("loadedmetadata",this.loadedmetadata,true)
                    audio.addEventListener("timeupdate",this.loadedmetadata,true)
                    audio.addEventListener("canplay",this.loadedmetadata,true)
                    audio.load();
                })
                
            },
            /**
            *   播放音频
            */
            playAudio(){
                this.audioPlaying = true;
                var audio = document.getElementById("qa-audio");
                audio.play();
                audio.removeEventListener("loadedmetadata",this.loadedmetadata,true)
                audio.removeEventListener("timeupdate",this.loadedmetadata,true)
                audio.removeEventListener("canplay",this.loadedmetadata,true)
            },
            /**
            *   停止播放音频
            */
            stopAudio(){
                var audio = document.getElementById("qa-audio");
                audio.pause();
                audio.currentTime = 0;
                this.audioPlaying = false;
            },
            bindAudioEvent(){
                setTimeout(()=>{
                    var audio = document.getElementById("qa-audio");
                    audio.addEventListener("ended",()=>{
                        this.audioPlaying = false;
                    })
                },1000)
            },
            /**
            *   答题倒计时
            */
            timingCountDown(time){
                this.timingCount = time;
                var t = Number(time) *5;
                var count = 0;
                this.countdownTimer = setInterval(()=>{
                    count++;
                    if(count % 10 == 0){
                        this.timingCount--;
                    }
                    if(count<=t){
                        this.timingRightStyle = `transform: rotate(${180/t*count-45}deg)`;
                    }else{
                        this.timingLeftStyle = `transform: rotate(${180/t*(count-t)-45}deg)`;
                    }
                    if(this.timingCount<=0){
                        clearInterval(this.countdownTimer);
                        this.countdownTimer = null;
                        this.isRotate = false;
                        this.checkAnswer();
                    }
                },100)
            },
            
            nextLevel(){
                this.correctCount = 0;
                this.beginGame(this.questionIndex+1);
            },
            /**
            *   答题完一题进行上报
            */
            questionReply(){
                var duration = ((this.endTime||new Date().getTime()) - this.beginTime)/1000;
                var selecteds = this.answerList.map((a,i)=>{
                        return a ? String(i) : '';
                    }).filter(a=>a);
                var param = {
                    batch_id : this.batch_id,
                    question_id : this.currentQuestion.id,
                    selecteds : selecteds,
                    duration : duration
                }
                if(!selecteds.length){
                    param.selecteds['0'] = '';
                }
                this.$api.questionReply(param)
            },
            /**
            *   再来一局
            */
            oneMoreTry(){
                this.init();
            },
            /**
            *   返回
            */
            goBack(){
                this.$router.go(-1);
            },
            /**
            *   清除定时器
            */
            destroyTimer(){
                clearTimeout(this.consumingTimer);
                clearTimeout(this.countdownTimer);
                clearTimeout(this.questionTimer);
                clearTimeout(this.rivalTimer);
                clearTimeout(this.gameTimer);
                clearTimeout(this.checkAnswerTimer);
                this.consumingTimer = null;
                this.countdownTimer = null;
                this.questionTimer = null;
                this.rivalTimer = null;
                this.gameTimer = null;
                this.checkAnswerTimer = null;
            }

        },
        beforeDestroy(){
            this.destroyTimer();
        },
        watch:{
            consuming(v){
                var m = v - v % 60,
                    s = v - m * 60;
                m = m < 10 ? ("0"+m) : m;
                s = s < 10 ? ("0"+s) : s;
                this.consumingText = m + ":" + s;
            }
        },
        filters : {
            duration2str(v){
                v = Math.ceil(v||0);
                var h = Math.floor(v/3600),
                    m = Math.floor((v - h * 3600)/60),
                    s = v - m * 60 - h * 3600;
                m = m < 10 ? ("0"+m) : m;
                s = s < 10 ? ("0"+s) : s;
                if(h){
                    return (h < 10 ? ("0"+h) : h)
                }else{
                    return m + ":" + s;
                }
            }
        }
    }
</script>

<style lang="scss">

</style>
