<template>
    <div class="home-wrap">
        <div class="personal">
            <div class="personal-photo">
                <img :src="userInfo.avatar">
            </div>
            <div class="personal-name">{{userInfo.nickname}}</div>
            <div class="personal-id">SA销售ID:{{userInfo.username}}</div>
            <div class="personal-point"><em>{{userInfo.score}}</em>积分</div>
        </div>
        <div class="home-main">
            <div class="home-fn-btns">
                <div class="home-fn-signup" :class="userInfo.is_checkin==1?'checkin':''" @click="signup"><i></i>{{userInfo.is_checkin==1?'已签到':'点击签到'}}</div>
                <div class="home-fn-lucky" @click="toLucky"><i></i>去抽奖</div>
            </div>
            <ul class="home-links">
                <li class="mycase">
                    <router-link class="home-link" to="/mycase">我发布的案例</router-link>
                </li>
                <li class="feedback">
                    <router-link class="home-link" to="/reply">我要留言反馈</router-link>
                </li>
            </ul>
        </div>

        <div class="layer" v-if="signupLayerVisible">
            <div class="layer-bg"></div>
            <div class="layer-container signup-success">
                <label>签到成功</label>
                <div class="signup-tips">累计签到 <em>{{accumulate}}</em> 天，今日 <em>+{{pointToday}}</em> 积分</div>
                <div class="signup-layer-btn" @click="signupLayerVisible=false">确定</div>
            </div>
        </div>
    </div>
</template>

<script>
    import '../assets/scss/home.scss'
    import common from '../assets/js/common'
    export default {
        data() {
            return {
                baseUrl : common.ossUrl,
                signupLayerVisible : false,
                accumulate : 0,
                pointToday : 0,
                userInfo : {}
            }
        },
        created() {
            this.getUserInfo();
        },
        methods: {
            signup(){
                if(this.userInfo.is_checkin==1){
                    this.$popup("您今天已经签到了!");
                    return;
                }
                this.$api.signup().then(res=>{
                    if(res.code==1){
                        this.signupLayerVisible = true;
                        this.accumulate = res.data.checkin_num;
                        this.pointToday = res.data.add_score;
                        this.getUserInfo();
                    }else{
                        this.$popup(res.msg)
                    }
                })
                
            },
            getUserInfo(){
                this.$api.getUserInfo().then(res=>{
                    if(res.code==1){
                        this.userInfo = res.data;
                        this.$store.dispatch("updateUserInfo",res.data);
                    }else{
                        this.$popup(res.msg)
                    }
                })
            },
            toLucky(){
                this.$router.push({path:'/lucky'});
            }
        }
    }
</script>

<style lang="scss">

</style>
