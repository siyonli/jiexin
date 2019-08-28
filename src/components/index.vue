<template>
    <div class="index-wrap">
        <div class="index-nav">
            <router-link class="index-nav-link index-nav_trainingcamp" to="/learn?act=1">训练营</router-link>
            <router-link class="index-nav-link index-nav_case" to="/learn?act=2">优秀案例</router-link>
            <router-link class="index-nav-link index-nav_luckydraw" to="/lucky">积分抽奖</router-link>
            <router-link class="index-nav-link index-nav_share" to="/share">我要分享</router-link>
        </div>
        <div class="index-answer">
            <a class="index-answer-link" @click="goAnswerPage"></a>
        </div>
        <div class="index-union-rank">
            <label class="pub-title">联盟榜单</label>
            <ul class="rank-list">
                <li v-for="(item,i) in unionRank" :key="item.id">
                    <i class="rank-icon">{{i+1}}</i>
                    <div class="union-name">{{item.name}}</div>
                    <div class="union-point">
                        <em>{{item.num}}</em>积分
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import '../assets/scss/index.scss'
    export default {
        data() {
            return {
                unionRank : []
            }
        },
        created() {
            this.getUnionRank();
        },
        methods: {
            goAnswerPage(){
                this.$router.push({path:"/answer"})
            },
            getUnionRank(){
                this.$api.getLeaderBoard({
                    type : 'union',
                    item : 'score'
                }).then(res=>{
                    this.unionRank = res.code == 1 ? res.data : []
                })
            }
        }
    }
</script>

<style lang="scss">

</style>
