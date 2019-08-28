<template>
    <div class="learn-wrap">
        <div :class="['learn-tab','active'+tabIndex]">
            <span :class="{current:tabIndex==1}" @click="tabChange(1)">训练营</span>
            <span :class="{current:tabIndex==2}" @click="tabChange(2)">优秀案例</span>
        </div>
        <div class="learn-main">
            <div :class="['learn-content',{active:tabIndex==2}]">
                <div class="learn-article" @scroll="articleScroll()">
                    <ul class="article-list">
                        <li v-for="(item,i) in articleList" @click="showArticleDetail(item.id)">
                            <div class="article-top">
                                <div class="article-media" v-if="item.cover_image">
                                    <img :src="item.cover_image">
                                </div>
                                <div class="article-title">{{item.title}}</div>
                            </div>
                            <div class="article-foot">
                                <span>{{item.category_name}}</span>|
                                <em v-if="item.audio_file">音频</em>
                                <em v-if="item.video_file">视频</em>
                                <em v-if="!item.audio_file && !item.video_file">文章</em>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="learn-case" @scroll="caseScroll()">
                    <caseList :caseList="caseList" padding-bottom="1.68rem"></caseList>
                    <div class="share-btn" ref="sharebtn" v-if="tabIndex==2" @click="share">我要分享案例</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import caseList from './caseList.vue'
    import common from '../assets/js/common'
    export default {
        components: {caseList},
        data() {
            return {
                baseUrl : common.ossUrl,
                tabIndex : this.$route.query.act,
                caseList : [],
                articleList : [],
                art_page : 1,
                art_limit : 10,
                art_all_loaded : false,
                case_page : 1,
                case_limit : 10,
                case_all_loaded : false,
                art_loading : false,
                case_loading : false,
                articleDom : null,
                caseDom : null
            }
        },
        created() {
            this.getArticleList();
            this.getCaseList();
        },
        mounted(){
            this.articleDom = document.querySelector(".learn-article");
            this.caseDom = document.querySelector(".learn-case");
        },
        methods: {
            articleScroll(){
                if(!this.articleDom){
                    return;
                }
                var wHeight = this.articleDom.clientHeight,
                    scrollTop = this.articleDom.scrollTop,
                    clientHeight= document.querySelector(".article-list").clientHeight;
                if(wHeight+scrollTop+50 >= clientHeight && !this.art_all_loaded && !this.art_loading){
                    this.art_page++;
                    this.getArticleList();
                }
            },
            caseScroll(){
                if(!this.caseDom){
                    return;
                }
                var wHeight = this.articleDom.clientHeight,
                    scrollTop = this.articleDom.scrollTop,
                    clientHeight= document.querySelector(".case-list").clientHeight;
                if(wHeight+scrollTop+50 >= clientHeight && !this.case_all_loaded && !this.case_loading){
                    this.case_page++;
                    this.getCaseList();
                }
            },
            tabChange(index){
                if(this.tabIndex != index){
                    this.tabIndex = index;
                }
            },
            getArticleList(){
                if(this.art_loading || this.art_all_loaded){
                    return;
                }
                this.art_loading = true;
                this.$api.getArticleList({
                    page: this.art_page
                }).then(res=>{
                    this.art_loading = false;
                    if(res.code==1){
                        if(this.art_page==1){
                            this.articleList = res.data.list;
                        }else{
                            this.articleList = this.articleList.concat(res.data.list);
                        }
                        if(this.art_page * res.data.pagesize >= res.data.total){
                            this.art_all_loaded = true;
                        }
                    }else{
                        this.$popup(res.msg)
                    }
                })
            },
            showArticleDetail(id){
                this.$router.push({path:"/article",query:{id:id}});
            },
            getCaseList(){
                if(this.case_loading || this.case_all_loaded){
                    return;
                }
                this.case_loading = true;
                this.$api.getCaseList({
                    page: this.case_page,
                    pagesize : this.case_limit
                }).then(res=>{
                    this.case_loading = false;
                    if(res.code==1){
                        if(this.case_page==1){
                            this.caseList = res.data.list;
                        }else{
                            this.caseList = this.caseList.concat(res.data.list);
                        }
                        if(this.case_page * res.data.pagesize >= res.data.total){
                            this.case_all_loaded = true;
                        }
                    }else{
                        this.$popup(res.msg)
                    }
                })
            },
            share(e){
                this.$router.push({path:"/share"})
            }
        }
    }
</script>

<style lang="scss">
    .learn-wrap{
        overflow: hidden;
        background: #ffffff !important;
        display: flex;
        flex-direction: column;
        .learn-tab{
            display: flex;
            position: relative;
            background: #f5f5f5;
            padding-bottom: 2px;
            span{
                display: block;
                height: 1.28rem;
                line-height: 1.28rem;
                flex: 1;
                text-align: center;
                font-size: 0.48rem;
                color: #999999;
                background: #ffffff;
            }
            span.current{
                color: #000000;
            }
        }
        .learn-tab:after{
            display: block;
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 50%;
            height: 2px;
            background: #FA6D15;
            transition: left .3s ease;
        }
        .learn-tab.active2:after{
            left: 50%;
        }

        .learn-main{
            overflow: hidden;
            flex: 1;
            .learn-content{
                width: 200%;
                overflow: hidden;
                transition: all ease .3s;
                height: 100%;
                display: flex;
                > div{
                    overflow: hidden;
                    flex: 1;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                }
            }
            .learn-content.active{
                margin-left: -100%;
            }
        }
        .article-list{
            overflow: hidden;
            padding: 0 0.4rem;
            li{
                overflow: hidden;
                padding: 0.48rem 0;
                border-bottom: 1px solid #eeeeee;
            }
            .article-top{
                overflow: hidden;
                display: flex;
                .article-media{
                    width: 2.72rem;
                    height: 2.16rem;
                    overflow: hidden;
                    border-radius: 0.16rem;
                    margin-right: 0.56rem;
                    img{
                        display: block;
                        width: 100%;
                    }
                }
                .article-title{
                    font-size: 0.4rem;
                    color: #2c2c2c;
                    line-height: 0.72rem;
                    flex: 1;
                    max-height: 2.16rem;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    overflow: hidden;
                }
            }
            .article-foot{
                overflow: hidden;
                margin-top: 0.4rem;
                font-size: 0.32rem;
                color: #666666;
                em{
                    color: #000000;
                    margin-left: 8px;
                }
                span{
                    margin-right: 8px;
                }
            }
        }
        .learn-case{
            background-color: #f0f0f0;
            position: relative;
            .share-btn{
                position: fixed;
                left: 0;
                right: 0;
                bottom: 1.52rem;
                height: 1.52rem;
                line-height: 1.52rem;
                text-align: center;
                background-image: linear-gradient(90deg, #FC921D 0%, #FA5E12 100%);
                color: #ffffff;
                font-size: 0.4rem;
            }
        }
    }
</style>
