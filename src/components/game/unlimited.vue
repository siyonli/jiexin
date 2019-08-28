<template>
    <div class="game-wrap">
        <div class="game-container" v-if="gameStatus !== 'matching' && gameStatus!=='end'">
            <div class="game-player">
                <div class="game-player-self">
                    <div class="game-player-score">{{myScore}}</div>
                    <div :class="['game-player-avatar',{success:isCorrect=='success'},{fail:isCorrect=='fail'}]">
                        <img :src="userInfo.avatar">
                    </div>
                </div>
                <div class="game-timing" v-if="(gameStatus=='start' || gameStatus=='checking') && mode!=='unlimited'">
                    <div class="game-timing-left"><i :class="{rotate:isRotate}" :style="timingLeftStyle"></i></div>
                    <div class="game-timing-right"><i :class="{rotate:isRotate}" :style="timingRightStyle"></i></div>
                    <span>{{timingCount}}</span>
                </div>
                <div class="game-remaining">
                    <i :class="{grey:wrongCount>0}"></i>
                    <i :class="{grey:wrongCount>1}"></i>
                    <i :class="{grey:wrongCount>2}"></i>
                </div>
            </div>
            <div :class="['game-question-type',currentQuestion.question_type]" v-if="gameStatus=='prepare'">
                <label>第{{questionIndex+1}}题</label>
                <div class="q-type">{{currentQuestion.question_type == "single" ? "单选题" : "多选题"}}</div>
            </div>
            <div style="display: none;">
                <audio id="qa-audio" :src="audioSrc" preload="preload"></audio>
            </div>
            <div class="game-qa" v-if="gameStatus=='start' || gameStatus=='checking'">
                <div class="game-question">
                    {{currentQuestion.title}}
                    <img v-if="currentQuestion.image" :src="currentQuestion.image">
                    <div class="game-q-audio" v-if="currentQuestion.audio" @click="playAudio">
                        {{currentQuestion.duration|duration2str}}<span>{{isIOS ? "  点击播放":""}}</span>
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
        </div>

        <div :class="['layer-pk-mode','layer-pk-mode-unlimited',isPkWin?'success':'fail']" v-if="gameStatus == 'end'">
            <div class="gameover-result-title">{{isPkWin?"胜利":"失败"}}</div>
            <div class="gameover-result-content">
                <div style="overflow: hidden;">
                    <div class="myself">
                        <div class="avatar"></div>
                    </div>
                </div>
                <label class="game-this-round"><em>本局奖励</em></label>
                <div class="game-score-count">积分+{{score}}</div>
                <div class="gameover-btns">
                    <a class="goback" @click="goBack">返回</a>
                    <a class="try-again" @click="oneMoreTry()">再来一局</a>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
    import '../../assets/scss/game.scss'
    import common from '../../assets/js/common'
    export default {
        data() {
            return {
                baseUrl : common.ossUrl,
                mode : this.$route.query.mode || 'unlimited',      //模式
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
                countdownTimer : null,
                currentQuestion : {},
                questionIndex : 0,
                isCorrect : '',
                answerList : [],
                isCanDoAnswer : true,
                isPkWin : false,
                audioSrc : false,
                rivalAnswerStatus : '',
                wrongCount : 0,
                nextTimer : null,
                gameTimer : null,
                audioTimer : null
            }
        },
        created() {
            this.init();
        },
        beforeDestroy(){
            clearTimeout(this.nextTimer);
            this.nextTimer = null;
            clearTimeout(this.gameTimer);
            this.gameTimer = null;
            clearTimeout(this.audioTimer);
            this.audioTimer = null;
        },
        methods: {
            init(){
                this.matching = true;
                this.gameStatus = 'matching';
                this.isCanDoAnswer = true;
                this.beginData = [];
                this.questionIndex = 0;
                this.timingLeftStyle = '';
                this.timingRightStyle = '';
                this.consuming = 0;
                this.countdownTimer = null;
                this.nextTimer = null;
                this.gameTimer = null;
                this.audioTimer = null;
                this.myScore = 0;
                this.rivalScore = 0;
                this.isCorrect= '';
                this.rivalAnswerStatus = '';
                this.wrongCount = 0;
                this.answerBeginByUnlimited();
            },
            /**
             * PK模式开始答题
             */
            getQuestion(batch_id){
                this.$api.getQuestion({
                    batch_id : batch_id
                }).then(res=>{
                    if(res.code == 1){
                        this.beginData = res.data;
                        setTimeout(()=>{
                            this.checkIsAudio(0);
                            // this.pkModeBegin(0);
                        },2000)
                    }else{
                        this.$popup(res.msg);
                    }
                })
            },
            getUnlimitedQuestion(batch_id){
                this.$api.getQuestion({
                    batch_id : batch_id
                }).then(res=>{
                    if(res.code == 1){
                        this.beginData = res.data;
                        this.checkIsAudio(0);
                    }else{
                        this.$popup(res.msg);
                    }
                })
            },
            /**
             * 无限模式开始答题
             */
            answerBeginByUnlimited(){
                this.gameStatus = 'matching';
                this.$api.answerBegin({
                    mode : this.mode
                }).then(res=>{
                    if(res.code == 1){
                        this.batch_id = res.data.batch_id;
                        this.rule = res.data.rule;
                        this.getUnlimitedQuestion(res.data.batch_id);
                    }else{
                        this.$popup(res.msg);
                    }
                })
                // this.beginData = this.makeQuestion();
                // this.pkModeBegin(0);
            },
            /**
            *   PK模式开始游戏
            */
            
            unlimitedModeBegin(index){
                if(index >= this.beginData.length){
                    this.pkModeEnd();
                    return;
                }
                this.isCanDoAnswer = true;
                this.gameStatus = 'prepare';
                this.questionIndex = index;
                this.currentQuestion = this.beginData[this.questionIndex];
                this.isCorrect = '';
                this.rivalAnswerStatus = '';
                this.answerList = this.currentQuestion.options_list.map(a=>0);
                // this.currentQuestion.answerList = this.currentQuestion.options_list.map(a=>0);
                var arr = this.currentQuestion.correct_list;
                this.currentQuestion.correct_list = this.currentQuestion.options_list.map((a,i)=>{
                    return arr.indexOf(i) > -1;
                })
                var that = this;
                this.gameTimer = setTimeout(()=>{
                    that.gameStatus = 'start';
                    that.checkIsAudio(that.questionIndex+1);
                    that.beginTime = new Date().getTime();
                    if(that.currentQuestion.audio){
                        var audio = document.getElementById("qa-audio");
                        // audio.setAttribute("autoplay","autoplay");
                        audio.play();
                        audio.pause();
                        audio.currentTime = 0;
                        that.audioTimer = setTimeout(()=>{
                            that.$wx.ready(()=>{
                                audio.play();
                                audio.removeEventListener("loadedmetadata",fn,false)
                            })
                        },500)
                        audio.addEventListener("loadedmetadata",fn,false)
                    }
                    
                },1500)
            },
            playAudio(){
                if(!this.isIOS){
                    return;
                }
                var audio = document.getElementById("qa-audio");
                audio.play();
            },
            stopAudio(){
                var audio = document.getElementById("qa-audio");
                audio.pause();
                audi0.currentTime = 0;
            },
            /**
            *   PK模式结束游戏
            */
            pkModeEnd(){
                console.log("game over");
                this.$api.answerEnd({
                    batch_id : this.batch_id
                }).then(res=>{
                    this.gameStatus = 'end';
                    this.isPkWin = this.wrongCount < 4;
                    if(res.code==1){
                        this.score = res.data.score;
                    }else{
                        this.$popup(res.msg);
                    }
                })
            },
            /**
            *   检查下一题是否为音频题 如果是则预加载音频 并获取时长
            */
            checkIsAudio(index){
                if(index >= this.beginData.length){
                    return;
                }
                var game = this.beginData[index];
                if(game.audio){
                    if(index == 0){
                        for(var i =0;i<this.beginData.length;i++){
                            if(!this.beginData[i].audio){
                                this.beginData[0] = this.beginData[i];
                                this.beginData[i] = game;
                                break;
                            }
                        }
                        this.pkModeBegin(index);
                        return;
                    }
                    // this.audioSrc = game.audio;
                    this.$nextTick(()=>{
                        var audio = document.getElementById("qa-audio");
                        if(!audio){
                            return;
                        }
                        game.audio.forEach(src=>{
                            var source = document.createElement("source");
                            var type = src.split(".")[1];
                            source.type = type == "ogg" ? "audio/ogg" : "audio/mpeg";
                            source.src = this.baseUrl + src;
                            audio.appendChild(source);
                        })

                        audio.load();
                        // audio.oncanplay = ()=>{
                        //     this.beginData[index].duration = audio.duration;
                        //     if(index==0 && this.mode == 'unlimited'){
                        //         this.unlimitedModeBegin(index);
                        //     }
                        // }
                    })
                }else{
                    if(index==0 && this.mode == 'pk'){
                        this.pkModeBegin(index);
                    }
                    if(index==0 && this.mode == 'unlimited'){
                        this.unlimitedModeBegin(index);
                    }
                }
            },
            /**
            *   选择答题选项
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
                        var bool = this.checkISCorrect();
                        this.isCorrect = bool ? "success" : "fail";
                        this.checkAnswer();
                    }
                }else{
                    this.answerList[index] = !this.answerList[index];
                    var length = this.answerList.filter(a=>a).length;
                    var corrleng = this.currentQuestion.correct_list.filter(a=>a).length;
                    if(length == corrleng){
                        this.endTime = new Date().getTime();
                        this.checkAnswer();
                    }
                }
                this.$forceUpdate();
                
            },
            /**
            *   选择选项后检查答案是否正确
            */
            checkAnswer(){
                this.isCanDoAnswer = false;
                this.gameStatus = 'checking';
                var bool = this.checkISCorrect();
                this.isCorrect = bool ? "success" : "fail";
                this.wrongCount += bool ? 0 : 1;
                this.myScore+= bool ? this.rule.one_correct_score : 0;
                this.questionReply();
                this.nextTimer = setTimeout(()=>{
                    if(this.wrongCount >= 3){
                        this.pkModeEnd();
                    }else{
                        this.unlimitedModeBegin(this.questionIndex+1);
                    }
                },2000)
                
            },
            checkISCorrect(){
                var a_length = this.answerList.filter(a=>a).length;
                var c_length = this.currentQuestion.correct_list.filter(a=>a).length;
                var is = this.currentQuestion.correct_list.every((a,i)=>{
                    return !!a == !!this.answerList[i];
                })
                return a_length==c_length && is;
            },
            questionReply(){
                var duration = ((this.endTime||new Date().getTime()) - this.beginTime)/1000;
                // console.log(this.endTime , this.beginTime,duration);
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
                    param.selecteds['0'] = ''
                }
                this.$api.questionReply(param).then(res=>{

                })
            },
            /**
            *   再来一局
            */
            oneMoreTry(){
                this.init();
            },
            goBack(){
                window.history.go(-1);
            }
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
                v = Math.ceil(v);
                var m = v - v % 60,
                    s = v - m * 60;
                m = m < 10 ? ("0"+m) : m;
                s = s < 10 ? ("0"+s) : s;
                return m + ":" + s;
            }
        }
    }
</script>

<style lang="scss">

</style>
