<template>
    <div class="caseDetail">
        <div class="case-detail">
            <h1>{{articleData.title}}</h1>
            <div class="case-author">
                <div class="case-author-avatar">
                    <img :src="articleData.user_avatar">
                </div>
                <div class="case-author-info">
                    SA销售ID:{{articleData.user_id}}
                </div>
            </div>
            <div class="case-detail-content">
                <p v-for="img in articleData.images">
                    <img :src="img">
                </p>
                <p>{{articleData.content}}</p>
            </div>
        </div>
        <div class="article-loading" v-if="loading"></div>
    </div>
</template>

<script>
    import common from '../assets/js/common'
    import '../assets/scss/casedetail.scss'
    export default {
        data() {
            return {
                baseUrl : common.ossUrl,
                id : this.$route.query.id,
                articleData : {},
                loading : false
            }
        },
        created() {
            this.getArticleDetail(this.id);
        },
        methods: {
            getArticleDetail(id){
                if(this.loading){
                    return;
                }
                this.loading = true;
                this.$api.getCaseDetail({id:id}).then(res=>{
                    this.loading = false;
                    if(res.code == 1 && res.data.item){
                        this.articleData = res.data.item;
                    }else{
                        this.$popup("数据出错");
                        setTimeout(()=>{
                            this.$router.go(-1);
                        },1000)
                        
                    }
                })
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
        }
    }
</script>

<style lang="scss">

</style>
