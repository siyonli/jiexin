<template>
    <div class="rank-wrap">
        <div class="rank-tab">
            <a :class="{current:type=='personal'}" @click="tabChange('personal')">个人</a>
            <a :class="{current:type=='team'}" @click="tabChange('team')">队长</a>
            <a :class="{current:type=='union'}" @click="tabChange('union')">联盟</a>
        </div>
        <div class="rank-container">
            <div class="rank-title">
                {{type=='personal' ? "个人" : (type=='team' ? "队长" : "联盟")}}排行榜
            </div>
            <ul class="rank-switch" v-if="type!=='personal'">
                <li :class="{current:item=='score'}" @click="switchChange('score')">积分</li>
                <li :class="{current:item=='correct_rate'}" @click="switchChange('correct_rate')">正确率</li>
                <li :class="{current:item=='checkin'}" @click="switchChange('checkin')">签到率</li>
                <li :class="{current:item=='case'}" @click="switchChange('case')">提供案例次数</li>
            </ul>
            <ul class="rank-list">
                <li v-for="(item,i) in rankList" :key="item.id">
                    <i class="rank-icon">{{i+1}}</i>
                    <div class="union-name">{{item.name}}</div>
                    <div class="union-point">
                        <em>{{item.num}}</em>{{item.unit}}
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import '../assets/scss/rank.scss'
    export default {
        data() {
            return {
                tabIndex : 1,
                switchIndex : 1,
                type : 'personal',
                item : 'score',
                itemCache : {},
                rankList : []
            }
        },
        created() {
            this.getRank();
        },
        methods: {
            tabChange(type){
                this.itemCache[this.type] = this.item;
                this.type = type;
                this.item = this.itemCache[type] || 'score'
                this.getRank();
            },
            switchChange(item){
                this.item = item;
                this.getRank();
            },
            getRank(){
                var param = {
                    type : this.type,
                    item : this.item
                }
                this.$api.getLeaderBoard(param).then(res=>{
                    this.rankList = res.code == 1 ? res.data : []
                })
            }
        }
    }
</script>

<style lang="scss">

</style>
