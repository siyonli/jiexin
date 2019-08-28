<template>
    <div id="app">
        <div id="main">
          <router-view class="child-view" id="child-view"></router-view>
        </div>
        <div class="login-layer" v-if="$store.state.openid">
            <div class="login-layer-bg" @click="$store.state.openid=''"></div>
            <div class="login-layer-form">
                <h1>绑定人事ID</h1>
                <div class="lofin-form-row" v-if="0">
                    <input type="text" name="username" v-model="username">
                </div>
                <div class="lofin-form-row">
                    <input type="number" name="homeid" v-model="username" placeholder="人事ID">
                </div>
                <div class="login-form-btn" @click="bindHomerId">确认</div>
            </div>
        </div>
        <nav-bottom></nav-bottom>
    </div>
</template>

<script>
    import mixin from './assets/js/mixin.js'
    import common from './assets/js/common.js'
    import config from './assets/js/config.js'
    import navBottom from './assets/components/nav.vue'
    
    export default {
        name: 'App',
        components: {navBottom},
        mixins: [mixin],
        data() {
            return {
                whiteList : [
                    "/",
                    "/game_pk",
                    "/game_unlimited",
                    "/game_level",
                    "/mycase",
                    "/article",
                    "/caseDetail",
                    "/reply",
                    "/share",
                    "/lucky",
                    "/game"
                ],
                username : '',
                weixinid : '',
                wxConfig : {}
            }
        },
        created() {
            this.init();
            // this.getWxConfig();
        },
        methods: {
            init() {
                this.checkUrlPath(this.$route);
                this.getUserInfo();
            },
            getWxConfig(){
                this.$api.getWxConfig({
                    url : location.href
                }).then(res=>{
                    if(res.code == 1){
                        this.wxConfig = res.data;
                        this.wxConfig.jsApiList = [
                            'playVoice',
                            'pauseVoice',
                            'stopVoice',
                            'onVoicePlayEnd'
                        ]
                        this.wxConfig.debug = 'true'
                        this.$store.state.wxConfig = this.wxConfig;
                        this.$wx.config(this.wxConfig);
                    }
                })
            },
            getUserInfo(){
                this.$api.getUserInfo().then(res=>{
                    if(res.code==1){
                        this.$store.dispatch("updateUserInfo",res.data);
                    }
                })
            },
            bindHomerId(){
                this.$api.bindHomerId({
                    username : this.username,
                    weixinid : this.$store.state.openid
                }).then(res=>{
                    if(res.code == 1){
                        this.$popup("操作成功");
                        this.$store.dispatch("login",'');
                        window.openid = "";
                    }else{
                        this.$popup(res.msg)
                    }
                })
            },
            checkUrlPath(route){
                if(this.whiteList.indexOf(route.path) > -1){
                    this.$store.dispatch("increment",false)
                }else{
                    this.$store.dispatch("increment",true)
                }
                this.$forceUpdate();
            }
        },
        watch: {
            '$route'(to, from){
                this.checkUrlPath(to);
            }
        }
    }
</script>

<style lang="scss">

</style>
