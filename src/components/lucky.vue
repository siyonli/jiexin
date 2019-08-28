<template>
    <div class="lucky-wrap">
        <div id="lucky" class="lucky" :class="{animate:loaded}">
            <div class="pannel-title"></div>
            <div class="pannel-table">
                <div class="table-bg" :style="rotateStyle"></div>
                <div class="pointer-bg" @click="lottery"></div>
            </div>
            <div class="tips">奖品线下领取，中奖后工作人员会联系您发放奖品</div>
            <div class="prize-record" v-if="recordList.length">
                <label>中奖记录</label>
                <ul class="prize-record-list">
                    <li class="title">
                        <span>日期</span><span>奖品名称</span><span>奖品状态</span>
                    </li>
                    <li v-for="item in recordList">
                        <span>{{item.createtime|time2str}}</span>
                        <span>{{item.name}}</span>
                        <span :class="[item.is_received=='1' ? 'red':'green']">{{item.is_received=="1"?"已领取":"未领取"}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="layer-lucky-bg" v-if="isShowPrize"></div>
        <div class="layer-pk-mode success layer-lucky" v-if="isShowPrize">
            <div class="gameover-result-title">恭喜中奖</div>
            <div class="gameover-result-content">
                <div class="prize">
                    <img :src="prize.small_image">
                </div>
                <label class="game-this-round"><em>中奖获得</em></label>
                <div class="game-score-count">{{prize.name}}</div>
                <div class="gameover-btns">
                    <a class="try-again" @click="closeLayer">关闭</a>
                </div>
            </div>
            
        </div>
        <div id="lucky-loading" class="lucky-loading" v-if="!loaded"><span>加载中 {{percent}}%</span></div>
    </div>
</template>

<script>
    import common from '../assets/js/common'
    export default {
        data() {
            return {
                baseUrl : common.ossUrl,
                loaded : false,
                percent : 0,
                prizeList : [],
                rotateStyle : '',
                isShowPrize : false,
                recordList : [],
                rotate : 0,
                prize : {},
                prevprize : 0.5,
                rotating : false
            }
        },
        created() {
            // console.log(this.$dialog.alert);
            
            this.loadImage();
            this.getPrizeRecord();
        },
        filters:{
            time2str: (v)=>{
                var t = Number(v)*1000;
                var date = new Date(t);
                var y = date.getFullYear(),
                    m = date.getMonth()+1,
                    d = date.getDate();
                    m = m > 9 ? m : ('0'+m);
                    d = d > 9 ? d : ('0'+d);
                return [y,m,d].join("/")
            }
        },
        methods: {
            loadImage(){
                var images = [
                    '../../static/images/lucky_bg.png',
                    '../../static/images/lucky_title.png',
                    '../../static/images/lucky_table.png',
                    '../../static/images/lucky_cursor.png'
                ];
                var count = 0;
                images.forEach(src=>{
                    var img = new Image();
                    img.onload = ()=>{
                        count++;
                        this.percent = Number(count/images.length*100).toFixed(2);
                        if(count==images.length){
                            this.getPrizeList();
                        }
                    }
                    img.src = src;
                })
            },
            getPrizeList(){
                this.$api.getPrizeList().then(res=>{
                    if(res.code==1){
                        this.prizeList = res.data.list;
                        this.loaded = true;
                    }else{
                        this.$popup(res.msg);
                    }
                })
            },
            getPrizeRecord(){
                this.$api.getPrizeRecord({
                    page: 1,
                    pagesize : 100
                }).then(res=>{
                    if(res.code==1){
                        this.recordList = res.data.list;
                    }
                })
            },
            lottery(){
                if(this.rotating){
                    return;
                }
                var user = this.$store.state.userInfo;
                this.$dialog.confirm({
                    title: '提示',
                    message: '抽奖需要消耗50积分，当前剩余积分'+user.score
                }).then(() => {
                    this.rotating = true;
                    this.$api.toLottery().then(res=>{
                        if(res.code == 1){
                            this.prize = res.data.prize;
                            user.score = res.data.score;
                            this.$store.dispatch("updateUserInfo",user);
                            this.effectLuckyDraw();
                        }else{
                            this.rotating = false;
                            this.$popup(res.msg);
                        }
                    })
                }).catch(() => {
                    // on cancel
                });
                
            },
            effectLuckyDraw(){
                var index = 0;
                this.prizeList.forEach((item,i)=>{
                    if(item.id == this.prize.id){
                        index = i;
                    }
                })
                var delay = 6000;
                var baseRotate = 6;
                var step = 60;
                var random = parseInt(Math.random()*3);
                var rotate = (baseRotate + random) * -360 + (index - this.prevprize) * step;
                this.rotate+= rotate;
                console.log(this.rotate,this.prize.id,index,this.prevprize);
                this.rotateStyle = `transform:rotate(${this.rotate*-1}deg)`;
                this.prevprize = index;
                setTimeout(()=>{
                    this.rotating = false;
                    this.showPrize();
                },delay+300)
                
            },
            showPrize(){
                if(this.prize.name != "谢谢惠顾"){
                    this.isShowPrize = true;
                }
            },
            closeLayer(){
                this.isShowPrize = false;
            }
        }
    }
</script>

<style lang="scss">
.lucky-wrap{
    // background-image: linear-gradient(180deg, #4b09c5 0%, #e11f88 100%);
    background: -webkit-gradient(linear, 0 0, 0 100%, from(#4b09c6), to(#e11f88));
}
.lucky{
    height: 100%;
    background: url(../../static/images/lucky_bg.png) no-repeat center top;
    background-size: 100%;
    overflow: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
    .tips{
        color: #FFFFFF;
        text-align: center;
        margin-top: 0.14rem;
        font-size: 0.36rem;
    }
    .pannel-title {
        position: absolute;
        top: 0;
        width: 100%;
        height: 4rem;
        background: url(../../static/images/lucky_title.png) center top no-repeat;
        background-size: 100%;
    }
    .pannel-table {
        margin-top: 4rem;
        width: 100%;
        height: 8rem;
        overflow: hidden;
        position: relative;
        .table-bg {
            width: 8rem;
            height: 8rem;
            background: url(../../static/images/lucky_table.png) no-repeat center center;
            background-size: 100%;
            margin: 0 auto;
            transition: transform 6s;
        }
        .pointer-bg {
            width: 2.2rem;
            height: 2.36rem;
            background: url(../../static/images/lucky_cursor.png) no-repeat center center;
            background-size: 100%;
            position: absolute;
            left: 50%;
            top: 50%;
            margin: -1.18rem 0 0 -1.1rem;
        }
    }
    .prize-record{
        width: 9.1rem;
        margin: 0.6666rem auto 0.24rem;
        background: #fce9f4;
        overflow: hidden;
        border-radius: 0.16rem;
        text-align: center;
        label{
            display: block;
            height: 1rem;
            line-height: 1rem;
            font-size: 0.4rem;
            color: #f54730;
            background: #FFFFFF;
        }
        .prize-record-list{
            overflow: hidden;
            padding-top: 0.1488rem;
            li{
                height: 0.56rem;
                line-height: 0.56rem;
                font-size: 0.32rem;
                display: flex;
                span{
                    display: block;
                    flex: 1;
                }
                span.red{
                    color: #f9a4a5;
                }
                span.green{
                    color: #22ac38;
                }
            }
            li.title{
                height: 0.74rem;
                line-height: 0.74rem;
                color: #999;
            }
        }
    }

}
.layer-lucky.layer-pk-mode{
    .gameover-result-content{
        background: none;
        padding: 1.6rem 0.5333rem 0.5333rem;
        background: none !important;
        .prize{
            overflow: hidden;
            text-align: center;
            img{
                max-width: 100%;
                margin: 0 auto;
                display: block;
            }
        }
    }
        .gameover-btns{
            .try-again{
                flex: 0.5 !important;
                margin: 0 auto !important;
            }
        }
}
.animate .pannel-title {
    transform-origin: center center;
    animation: myzoom 2s ease-in;
    animation-iteration-count: 1;
    /* animation-delay: 2s; */
}

.animate .pannel-table {
    animation: dropdown .3s ease-in-out;
    animation-iteration-count: 1;
}

.animate .pannel-table .pointer-bg {
    transform-origin: 50% 50%;
    animation: myopacity 2s ease-in-out;
    animation-iteration-count: 1;
}

@keyframes myzoom {
    0% {
        transform: scale(1.5);
        opacity: 0;
    }
    /* 50% {
        transform: scale(1.25);
    } */
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes dropdown {
    from {
        transform: translate3d(0, -18.95rem, 0);
    }
    to {
        transform: translate3d(0, 0, 0);
    }
}

@keyframes myopacity {
    0% {
        opacity: 0;
        transform: scale(1);
    }
    20% {
        opacity: 1;
        transform: scale(1.3);
    }
    40% {
        opacity: 1;
        transform: scale(1);
    }
    55% {
        transform: rotate(-45deg);
    }
    70% {
        transform: rotate(0deg);
    }
    85% {
        transform: rotate(-45deg);
    }
    100% {
        transform: rotate(0deg);
    }
}
.lucky-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: -webkit-gradient(linear, 0 0, 0 100%, from(#4b09c6), to(#e11f88));
    >span {
        display: block;
        position: absolute;
        width: 100%;
        bottom: 20vh;
        left: 0;
        text-align: center;
        color: #FFFFFF;
        font-size: 0.56rem;
    }
}
</style>
