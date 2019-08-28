<template>
    <div class="articleDetail">
        <div class="article-video" v-if="articleData.video_file">
            <video-player  class="video-player vjs-custom-skin"
                     ref="videoPlayer"
                     :playsinline="true"
                     :options="playerOptions"
                     @play="onPlayerPlay($event)"
                     @pause="onPlayerPause($event)"
            ></video-player>
            <span class="video-time" v-if="0">{{_currentTime}}/{{_totalTime}}</span>
            <div class="video-play-btn" v-if="isVideoPause && 0"></div>
        </div>
        <!-- <aplayer :music="audioMusic"/> -->
        <div class="article-audio" v-if="articleData.audio_file && articleData.audio_file.length" @click="audioPlay">
            <div style="display: none;">
                <audio id="myaudio" preload controls>
                    <!-- <source :src="articleData.audio_file" type="audio/mpeg">
                    <source :src="articleData.audio_file" type="audio/ogg"> -->
                </audio>
                
            </div>
            <div class="audio-progress" @click.stop="audioProgress">
                <i :style="{width:percent+'%'}"></i>
                <div class="current-time">{{currentTime}}</div>
                <div class="total-time">{{totalTime}}</div>
            </div>
        </div>
        <div class="article-detail" :style="{'border-top':articleData.audio_file ? '1px solid #d1d1d1':'none'}">
            <h1>{{articleData.title}}</h1>
            <div class="article-detail-content article-detail-content-video" v-if="articleData.video_file">
                <label>视频简介</label>
                <p v-html="articleData.content"></p>
            </div>
            <div class="article-detail-content article-detail-content-audio" v-if="articleData.audio_file">
                <label>音频简介</label>
                <p v-html="articleData.content"></p>
            </div>
            <div class="article-detail-content article-detail-content-text" v-if="!articleData.video_file && !articleData.audio_file">
                <p v-html="articleData.content"></p>
            </div>
        </div>
        <div class="article-bar">
            <div class="article-bar-home" @click="goList"></div>
            <div class="article-bar-next" @click="goNext">学习下一题</div>
        </div>
        <div class="article-loading" v-if="loading"></div>
    </div>
</template>

<script>
    import 'video.js/dist/video-js.css'
    import 'vue-video-player/src/custom-theme.css'
    import common from '../assets/js/common'
    import { videoPlayer } from 'vue-video-player'
    import Aplayer from 'vue-aplayer'
    import mixin from '../assets/js/mixin'
    import wx from 'weixin-js-sdk';
    export default {
        components: {
            videoPlayer,
            Aplayer
        },
        mixins:[mixin],
        data() {
            return {
                baseUrl : common.ossUrl,
                id : this.$route.query.id,
                articleData : {},
                next_id : 0,
                loading : false,
                percent : '0',
                currentTime : '00:00',
                totalTime : '00:00',
                _currentTime : '00:00',
                _totalTime : '00:00',
                audio : null,
                video : null,
                isAudioPause : true,
                isVideoPause : true,
                playerOptions: {
                    // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                    autoplay: false, //如果true,浏览器准备好时开始回放。
                    muted: false, // 默认情况下将会消除任何音频。
                    loop: false, // 导致视频一结束就重新开始。
                    preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    language: 'zh-CN',
                    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    sources: [{
                      type: "video/mp4",
                      src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" //你的视频地址（必填）
                    }],
                    poster: "poster.jpg", //你的封面地址
                    width: document.documentElement.clientWidth,
                    notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                },
                audioMusic:{},
                wxConfig : {}
            }
        },
        created() {
            this.getArticleDetail(this.id);
            // this.getWxConfig();
        },
        methods: {
            getArticleDetail(id){
                if(this.loading){
                    return;
                }
                this.loading = true;
                this.$api.getArticleDetail({id:id}).then(res=>{
                    this.loading = false;
                    if(res.code == 1){
                        this.articleData = res.data.item;
                        this.next_id = res.data.next_id;
                        this.$nextTick(()=>{
                            if(this.articleData.audio_file&&this.articleData.audio_file.length){
                                this.audioPreload();
                            }
                            if(this.articleData.video_file){
                                this.$set(this.playerOptions,"poster",this.articleData.cover_image);
                                var _type = this.articleData.video_file.split(".")[1];
                                if(_type=="ogg" || _type=="mp4"){
                                    this.$set(this.playerOptions,"sources",[{
                                        type : "video/"+_type,
                                        src : this.articleData.video_file
                                    }]);
                                }
                            }
                        })
                        
                    }
                })
            },
            getWxConfig(){
                this.$api.getWxConfig({
                    url : location.href
                }).then(res=>{
                    if(res.code == 1){
                        this.wxConfig = res.data;
                    }
                })
            },
            audioPreload(){
                this.audio = document.getElementById("myaudio");
                
                this.articleData.audio_file.forEach(src=>{
                    var source = document.createElement("source");
                    var type = src.split(".")[1];
                    source.type = type == "ogg" ? "audio/ogg" : "audio/mpeg";
                    source.src = this.baseUrl + src;
                    this.audio.appendChild(source);
                })

                // this.audio.src = this.articleData.audio_file;
                this.audio.preload="preload";
                this.audio.load();
                this.audio.play();
                this.audio.pause();
                this.audio.currentTime = 0;
                // // alert("音频预加载")
                // document.addEventListener('WeixinJSBridgeReady', ()=> {
                //     this.audio.load();
                //     // alert("Weixin JSBridge Ready");
                //     this.audio.play();
                //     // alert("开始播放")
                //     this.audio.pause();
                //     // alert("暂停播放");
                // }, false)


                // this.$popup(this.audio.play())
                this.audio.addEventListener("loadedmetadata",(e)=>{
                    // this.$popup("!!!!");
                    this.currentTime = "00:00"
                    this.totalTime = this.consuming(parseInt(this.audio.duration));
                })
                this.audio.addEventListener("timeupdate",(e)=>{
                    this.currentTime = this.consuming(parseInt(this.audio.currentTime));
                    this.percent = Number(this.audio.currentTime / this.audio.duration * 100).toFixed(2);
                })
                this.audio.addEventListener("ended",(e)=>{
                    this.isAudioPause = true;
                })
            },
            audioPlay(){
                // alert("点击事件")
                this.isAudioPause = !this.isAudioPause;
                if(!this.isAudioPause){
                    // alert("暂停状态 进行播放")
                    this.audio.play();
                    // this.wxAudioPlay();
                }else{
                    // alert("播放状态 暂停播放")
                    this.audio.pause();
                }
            },
            audioProgress(e){
                // console.log(e);
                var offsetLeft = e.target.offsetLeft,
                    eLeft = e.offsetX;
                var width = e.target.clientWidth;
                var percent = eLeft/width;
                this.audio.currentTime = this.audio.duration*percent;
                this.percent = Number(percent*100).toFixed(2);
            },
            wxAudioPlay(){
                this.wxConfig.jsApiList = [
                    'playVoice',
                    'pauseVoice',
                    'stopVoice',
                    'onVoicePlayEnd'
                ]
                this.wxConfig.debug = 'true'
                wx.config(this.wxConfig);
                wx.ready(()=>{
                    alert("wx-js-sdk 配置完毕 状态:ready");
                    // this.audio.pause();
                    this.audio.play();
                    alert("播放中...");
                })
            },
            onPlayerPlay(player) {

            },
            onPlayerPause(player){
                
            },
            consuming(v){
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
                
            },
            goList(){
                this.$router.push({path:"/learn"});
            },
            goNext(){
                if(!this.next_id){
                    this.$popup("没有下一题了")
                    return;
                }
                this.getArticleDetail(this.next_id);
            }
        },
        computed: {
            player() {
                return this.$refs.videoPlayer.player
            }
        }
    }
</script>

<style lang="scss">
.articleDetail{
    background: #ffffff !important;
}
    .article-video{
        overflow: hidden;
        position: relative;
        video{
            width: 100%;
        }
        .video-time{
            position: absolute;
            bottom: 0.4rem;
            right: 0.64rem;
            color: #ffffff;
            font-size: 0.4rem;
            font-family: "DINCondensed-Bold";
        }
        .video-play-btn{
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            background: url(../../static/images/playv.png) no-repeat center center;
            background-size: 1.8666rem;
        }
        .vjs-big-play-button .vjs-icon-placeholder:before{
            font-size: 1.5rem;
        }
        .vjs-custom-skin > .video-js .vjs-big-play-button{
            border: none !important;
            background-color: rgba(0,0,0,0.45);
        }
    }
    .article-audio{
        width: 9.12rem;
        height: 2.56rem;
        margin: 0.8rem auto 0.64rem;
        overflow: hidden;
        border: 1px solid #dddddd;
        box-sizing: border-box;
        border-radius: 0.16rem;
        background: url(../../static/images/btn18_video_train.png) no-repeat 0.8rem center #f5f5f5;
        background-size: 0.96rem;
        position: relative;
        .audio-progress{
            width: 5.68rem;
            height: 4px;
            position: absolute;
            left: 2.64rem;
            top: 50%;
            margin-top: -2px; 
            background: #979797;
            border-radius: 4px;
            font-size: 0.32rem;
            font-family: "DINCondensed-Bold";
            i{
                display: block;
                height: 100%;
                border-radius: 4px;
                position: relative;
                background: #1FAF1B;
            }
            i:after{
                display: block;
                content: '';
                width: 12px;
                height: 12px;
                border-radius: 12px;
                background: #1FAF1B;
                position: absolute;
                right: -4px;
                top: -4px;
            }
            .current-time,
            .total-time{
                position: absolute;
                top: 10px;
            }
            .current-time{
                left: 0;
            }
            .total-time{
                right: 0;
            }
        }
    }
    .article-detail{
        overflow: hidden;
        width: 9.12rem;
        margin: 0 auto;
        padding: 0.48rem 0.24rem 1.4rem;
        box-sizing: border-box;
    }
    h1{
        color: #000000;
        font-size: 0.48rem;
        line-height: 0.72rem;
    }

    .article-detail-content{
        overflow: hidden;
        font-size: 0.4rem;
        color: #999999;
        line-height: 0.72rem;
        > label{
            margin-top: 0.16rem;
            font-size: 0.4rem;
            color: #333333;
            display: block;
        }
        img{
            display: block;
            width: 100%;
        }
    }
    .article-detail-content-text{
        margin-top: 0.48rem;
        border-top: 1px solid #eeeeee;
        p{
            margin-top: 0.32rem;
        }
    }
    .article-bar{
        height: 1.2rem;
        width: 10rem;
        position: fixed;
        left: 50%;
        bottom: 0;
        margin-left: -50%;
        display: flex;
        > div{
            flex: 1;
        }
    }
    .article-bar-next{
        background-image: linear-gradient(90deg, #FC921D 0%, #FA5E12 100%);
        text-align: center;
        line-height: 1.2rem;
        color: #ffffff;
        font-size: 0.4rem;
    }
    .article-bar-home{
        background: url(../../static/images/btn06_home_nor.png) no-repeat center center #f1f1f1;
        background-size: 0.6rem;
    }

    .article-loading{
        width: 2rem;
        height: 2rem;
        position: fixed;
        left: 50%;
        top: 50%;
        margin: -1rem 0 0 -1rem;
        border-radius: 0.2666rem;
        background: rgba(0,0,0,.5);
    }
    .article-loading:after{
        display: block;
        content: "";
        width: 0.8rem;
        height: 0.8rem;
        border: 2px solid rgba(255,255,255,.8);
        border-left: 2px solid transparent;
        border-radius: 0.8rem;
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -0.4rem 0 0 -0.4rem;
        animation: rotate linear .6s infinite;
    }

    @keyframes rotate
    {
        from {transform: rotate(0deg);}
        to {transform: rotate(360deg);}
    }




</style>
