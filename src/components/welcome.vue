<template>
    <div>
        <div class="welcome" v-if="!loading">
            <div class="wel-logo"></div>
            <div class="wel-title"></div>
            <div class="wel-player">
                <img src="../../static/images/home_player_light.png">
            </div>
            <div class="wel-moon"></div>
            <div class="wel-cloud2"></div>
            <div class="wel-star"></div>
            <div class="wel-ball"></div>
            <div class="wel-slime"></div>
            <div class="wel-cloud1"></div>
            <div class="wel-kirby"></div>
            <div class="wel-btn" @click="letsgo"></div>
        </div>
        <div class="res-loading" v-if="loading"><span>加载中 {{percent}}%</span></div>
    </div>
</template>

<script>
    import '../assets/scss/welcome.scss'
    export default {
        data() {
            return {
                loading: true,
                percent : 0
            }
        },
        created() {
            this.loadImage();
        },
        methods: {
            letsgo(){
                if(window.openid){
                    this.$store.dispatch("login",window.openid);
                }else{
                    this.$router.push({
                        path : '/index'
                    })
                }
            },
            loadImage(){
                var images = [
                    '../../static/images/home_bg.jpg',
                    '../../static/images/home_tit.png',
                    '../../static/images/home_player.png',
                    '../../static/images/home_player_light.png',
                    '../../static/images/home_moon.png',
                    '../../static/images/home_cloud02.png',
                    '../../static/images/home_star.png',
                    '../../static/images/home_pokemon_ball.png',
                    '../../static/images/home_slime.png',
                    '../../static/images/home_cloud01.png',
                    '../../static/images/home_kirby.png',
                    '../../static/images/home_btn.png'
                ]
                var count = 0;
                images.forEach(src=>{
                    var img = new Image();
                    img.onload = ()=>{
                        count++;
                        this.percent = Number(count/images.length*100).toFixed(2);
                        if(count==images.length){
                            setTimeout(()=>{
                                this.loading = false;
                                if(window.openid){
                                    this.$store.dispatch("login",window.openid);
                                }
                            },500)
                        }
                    }
                    img.src = src;
                })
            }
        }
    }
</script>

<style lang="scss">

</style>
