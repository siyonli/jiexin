<template>
    <div class="game-wrap">
        <div class="matching" v-if="mode=='pk' && gameStatus == 'matching'">
            <div class="matching-animate">
                <div class="user">
                    <img src="../../static/images/photo01_game.png">
                </div>
                <div class="matching-planet matching-planet-1"></div>
                <div class="matching-planet matching-planet-2"></div>
                <div class="matching-planet matching-planet-3"></div>
                <div class="rival" v-if="!matching">
                    <img :src="baseUrl + rival.avatar">
                </div>
            </div>
            <div class="matching-consuming" v-if="matching">正在匹配 {{consumingText}}</div>
            <div class="matching-consuming" v-else>匹配完成</div>
            <div class="matching-btn matching-btn-cancel" v-if="matching">取消</div>
            <div class="matching-btn matching-btn-done" v-else>正在进入</div>
        </div>

        <div class="game-container" v-if="gameStatus !== 'matching' && gameStatus!=='end'">
            <div class="game-player">
                <div class="game-player-self">
                    <div class="game-player-score">{{myScore}}</div>
                    <div :class="['game-player-avatar',{success:isCorrect=='success'},{fail:isCorrect=='fail'}]">
                        <img src="../../static/images/photo01_game.png">
                    </div>
                </div>
                <div class="game-player-rival" v-if="mode=='pk'">
                    <div :class="['game-player-avatar',rivalAnswerStatus]">
                        <img :src="baseUrl + rival.avatar">
                    </div>
                    <div class="game-player-score">{{rivalScore}}</div>
                </div>
                <div class="game-timing" v-if="(gameStatus=='start' || gameStatus=='checking') && mode!=='unlimited'">
                    <div class="game-timing-left"><i :class="{rotate:isRotate}" :style="timingLeftStyle"></i></div>
                    <div class="game-timing-right"><i :class="{rotate:isRotate}" :style="timingRightStyle"></i></div>
                    <span>{{timingCount}}</span>
                </div>
            </div>
            <div :class="['game-question-type',currentQuestion.question_type]" v-if="gameStatus=='prepare'">
                <label>第{{questionIndex+1}}题</label>
                <div class="q-type">{{currentQuestion.question_type == "single" ? "单选题" : "多选题"}}</div>
            </div>
            <div style="display: none;">
                <audio id="qa-audio" :src="baseUrl+audioSrc" preload="preload"></audio>
            </div>
            <div class="game-qa" v-if="gameStatus=='start' || gameStatus=='checking'">
                <div class="game-question">
                    {{currentQuestion.title}}
                    <img v-if="currentQuestion.image" :src="baseUrl+currentQuestion.image">
                    <div class="game-q-audio" v-if="currentQuestion.audio">
                        {{currentQuestion.duration|duration2str}}
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

        <div :class="['layer-pk-mode',isPkWin?'success':'fail']" v-if="mode=='pk' && gameStatus == 'end'">
            <div class="gameover-result-title">{{isPkWin?"胜利":"失败"}}</div>
            <div class="gameover-result-content">
                <div style="overflow: hidden;">
                    <div class="myself">
                        <div class="avatar"><img src="../../static/images/photo01_game.png"></div>
                        <div class="score">{{myScore}}</div>
                    </div>
                    <div class="rival">
                        <div class="avatar"><img :src="baseUrl + rival.avatar"></div>
                        <div class="score">{{rivalScore}}</div>
                    </div>
                </div>
                
                <label class="game-this-round"><em>本局奖励</em></label>
                <div class="game-score-count">积分+{{score}}</div>
                <div class="gameover-btns">
                    <a class="goback">返回</a>
                    <a class="try-again" @click="oneMoreTry()">再来一局</a>
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
                mode : this.$route.query.mode || pk,      //模式
                matching : true,                    //匹配状态 true匹配中
                rival : {  //对手信息，PK模式独有
                            "user_id": "2",
                            "nickname": "Luca",
                            "avatar": "\/uploads\/20190801\/41c366155ef4324020251f0def4de6c2.jpeg"
                        },                          //对手  
                rule : {}, 
                batch_id : 0,
                myScore : 0,
                rivalScore : 0,
                score : 0,
                consuming : 0,                      //耗时
                consumingText : '00:00',            //耗时
                max_duration : 20,
                userInfo : {},
                beginTime : '',
                endTime : '',
                cacheData : {
                    'pk' : {
                        "batch_id": "3",    //答题批次
                        "mode": "pk",
                        "rival": {  //对手信息，PK模式独有
                            "user_id": "2",
                            "nickname": "Luca",
                            "avatar": "\/uploads\/20190801\/41c366155ef4324020251f0def4de6c2.jpeg"
                        },
                        "rule": {   
                            "win_score": 15 //Pk胜利获得的分数
                        }
                    },
                    'unlimited' : {
                        "mode": "unlimited",
                        "batch_id": "4",
                        "rule": {
                            "one_correct_score": 1 //每答对一道题获得积分数
                        }
                    },
                    'level' : {
                        "mode": "level",
                        "batch_id": "5",
                        "rule": [{          //每个关卡获得的积分数和每个关卡允许的答题秒数
                            "level": 1,
                            "level_score": 5,
                            "max_duration": 44
                        }, {
                            "level": 2,
                            "level_score": 6,
                            "max_duration": 36
                        }, {
                            "level": 3,
                            "level_score": 7,
                            "max_duration": 29
                        }, {
                            "level": 4,
                            "level_score": 8,
                            "max_duration": 23
                        }, {
                            "level": 5,
                            "level_score": 9,
                            "max_duration": 18
                        }, {
                            "level": 6,
                            "level_score": 10,
                            "max_duration": 14
                        }, {
                            "level": 7,
                            "level_score": 11,
                            "max_duration": 11
                        }, {
                            "level": 8,
                            "level_score": 12,
                            "max_duration": 8
                        }, {
                            "level": 9,
                            "level_score": 13,
                            "max_duration": 6
                        }, {
                            "level": 10,
                            "level_score": 14,
                            "max_duration": 5
                        }]
                    }
                },
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
                rivalAnswerStatus : ''
            }
        },
        created() {
            this.init();
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
                this.myScore = 0;
                this.rivalScore = 0;
                this.isCorrect= '';
                this.rivalAnswerStatus = '';
                this.answerBeginByPK();
            },
            /**
             * PK模式开始答题
             */
            answerBeginByPK(){
                var timer;
                const fn = (data)=>{
                    this.rival = data.rival;
                    this.rule = data.rule;
                    this.batch_id = data.batch_id;
                    this.getQuestion(data.batch_id);
                    clearInterval(timer);
                    timer = null;
                }
                timer = setInterval(()=>{
                    this.consuming++;
                },1000)
                var t = new Date().getTime();
                this.$api.answerBegin({
                    mode : this.mode
                }).then(res=>{
                    if(res.code == 1){
                        var _t = new Date().getTime();
                        if(_t-t>=4000){
                            this.matching = false;
                            fn(res.data);
                        }else{
                            setTimeout(()=>{
                                this.matching = false;
                                fn(res.data);
                            },4000-_t+t)
                        }
                    }
                })
            },
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
            /**
            *   PK模式开始游戏
            */
            pkModeBegin(index){
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
                // console.log(this.currentQuestion);
                setTimeout(()=>{
                    this.gameStatus = 'start';
                    this.checkIsAudio(this.questionIndex+1);
                    this.beginTime = new Date().getTime();
                    var duration = (this.currentQuestion.max_duration || this.max_duration) + 
                        (this.currentQuestion.audio ? (Math.ceil(this.currentQuestion.duration)+2 ): 0)
                    if(this.currentQuestion.audio){
                        setTimeout(()=>{
                            document.getElementById("qa-audio").play();
                        },500)
                    }
                    this.timingCountDown(duration);
                    setTimeout(()=>{
                        this.rivalAnswerStatus = this.currentQuestion.rival_correct == 1 ? "success" : "fail"
                        this.isBothAnswer();
                    },this.currentQuestion.rival_duration*1000)
                },1500)
            },
            /**
            *   PK模式结束游戏
            */
            pkModeEnd(){
                console.log("game over");
                this.$api.answerBegin({
                    batch_id : this.batch_id
                }).then(res=>{
                    this.gameStatus = 'end';
                    this.isPkWin = this.myScore > this.rivalScore;
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
                    this.audioSrc = game.audio;
                    var audio = document.getElementById("qa-audio");
                    // console.log(audio);
                    audio.load();
                    audio.oncanplay = ()=>{
                        this.beginData[index].duration = audio.duration;
                        if(index==0 && this.mode == 'pk'){
                            this.pkModeBegin(index);
                        }
                        if(index==0 && this.mode == 'unlimited'){
                            this.unlimitedModeBegin(index);
                        }
                    }
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
                        this.isBothAnswer();
                    }
                }else{
                    this.answerList[index] = !this.answerList[index];
                    var length = this.answerList.filter(a=>a).length;
                    var corrleng = this.currentQuestion.correct_list.filter(a=>a).length;
                    if(length == corrleng){
                        this.endTime = new Date().getTime();
                    }
                }
                this.$forceUpdate();
                
            },
            isBothAnswer(){
                if(this.isCorrect && this.rivalAnswerStatus){
                    clearInterval(this.countdownTimer);
                    this.countdownTimer = null;
                    this.timingRightStyle = '';
                    this.timingLeftStyle = '';
                    this.isRotate = false;
                    this.isCanDoAnswer = false;
                    this.gameStatus = 'checking';
                    this.myScore+= this.isCorrect=='success' ? this.rule.win_score : 0;
                    this.rivalScore += this.currentQuestion.rival_correct == 1 ? this.rule.win_score : 0;
                    this.questionReply();
                    setTimeout(()=>{
                        this.pkModeBegin(this.questionIndex+1);
                    },2000)
                }
            },
            /**
             * 答题倒计时
             */
            timingCountDown(time){
                this.timingCount = time;
                var t = Number(time) / 2;
                this.timingRightStyle = `transition: all ${t}s linear;`;
                this.timingLeftStyle = `transition: all ${t}s linear; transition-delay: ${t}s;`;
                setTimeout(()=>{
                    this.isRotate = true;
                },50)
                this.countdownTimer = setInterval(()=>{
                    this.timingCount--;
                    if(this.timingCount<=0){
                        clearInterval(this.countdownTimer);
                        this.countdownTimer = null;
                        this.timingRightStyle = '';
                        this.timingLeftStyle = '';
                        this.isRotate = false;
                        if(this.currentQuestion.question_type!='single'){
                            this.checkAnswer();
                        }
                    }
                },1000)
            },
            /**
            *   选择选项后检查答案是否正确
            */
            checkAnswer(){
                this.isCanDoAnswer = false;
                this.gameStatus = 'checking';
                var bool = this.checkISCorrect();
                this.isCorrect = bool ? "success" : "fail";
                this.myScore+= bool ? this.rule.win_score : 0;
                this.rivalScore += this.currentQuestion.rival_correct == 1 ? this.rule.win_score : 0;

                this.questionReply();
                setTimeout(()=>{
                    this.pkModeBegin(this.questionIndex+1);
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
