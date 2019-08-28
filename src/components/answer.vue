<template>
    <div class="answer-warp">
        <h1 class="answer-page-title">答题赢积分</h1>
        <div class="answer-mode answer-mode-pk">
            <div class="mode-title">PK模式</div>
            <div class="mode-desc">匹配对手，一轮题数为10题，赢过对手则奖励积分。</div>
            <button @click="beginGame('pk')">开始</button>
        </div>
        <div class="answer-mode answer-mode-unlimited">
            <div class="mode-title">无限模式</div>
            <div class="mode-desc">有3次错误的机会，超过后答题结束，答对的题目获得积分。</div>
            <button @click="beginGame('unlimited')">开始</button>
        </div>
        <div class="answer-mode answer-mode-level">
            <div class="mode-title">闯关模式</div>
            <div class="mode-desc">共10个关卡，每关5题，答题时间递减，每关卡可得相应积分。</div>
            <button @click="beginGame('level')">开始</button>
        </div>
        <div style="height: 0.4rem;"></div>
    </div>
</template>

<script>
    import '../assets/scss/answer.scss'
    export default {
        data() {
            return {

            }
        },
        created() {

        },
        methods: {
            init() {

            },
            beginGame(mode){
                this.$router.push({path: '/game_'+mode})
            }
        },
        watch: {

        }
    }
</script>

<style lang="scss">

</style>
