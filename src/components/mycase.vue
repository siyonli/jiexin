<template>
    <div @scroll="caseScroll">
        <caseList :caseList="caseList" :isedit="isedit"></caseList>
        <div class="share-btn" @click="share">我要分享案例</div>
    </div>
</template>

<script>
    import caseList from './caseList.vue'
    export default {
        components: {caseList},
        data() {
            return {
                caseList : [],
                page: 1,
                pagesize : 10,
                case_loading : false,
                case_all_loaded : false,
                isedit : true
            }
        },
        created() {
            this.getCaseList();
        },
        methods: {
            caseScroll(){
                if(!this.caseDom){
                    return;
                }
                var wHeight = this.articleDom.clientHeight,
                    scrollTop = this.articleDom.scrollTop,
                    clientHeight= document.querySelector(".case-list").clientHeight;
                if(wHeight+scrollTop+50 >= clientHeight && !this.case_all_loaded && !this.case_loading){
                    this.page++;
                    this.getCaseList();
                }
            },
            getCaseList(){
                if(this.case_loading || this.case_all_loaded){
                    return;
                }
                this.case_loading = true;
                this.$api.myCase({
                    page : this.page,
                    pagesize : this.pagesize
                }).then(res=>{
                    if(res.code==1){
                        if(this.case_page==1){
                            this.caseList = res.data.list;
                        }else{
                            this.caseList = this.caseList.concat(res.data.list);
                        }
                        if(res.data.page * res.pagesize >= res.data.total){
                            this.case_all_loaded = true;
                        }
                    }else{
                        this.$popup(res.msg)
                    }
                })
            },
            share(){
                this.$router.push({path:"/share"})
            }
        }
    }
</script>

<style lang="scss">
.share-btn{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0; 
    height: 1.52rem;
    line-height: 1.52rem;
    text-align: center;
    background-image: linear-gradient(90deg, #FC921D 0%, #FA5E12 100%);
    color: #ffffff;
    font-size: 0.4rem;
}
</style>
