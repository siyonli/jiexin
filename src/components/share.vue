<template>
    <div>
        <div class="j-form">
            <div class="j-form-content">
                <div class="j-form-title">
                    <input type="text" name="title" placeholder="请输入标题" v-model="title">
                </div>
                <div class="j-form-textarea">
                    <textarea placeholder="请输入正文" v-model="message"></textarea>
                </div>
                <div class="j-form-images">
                    <ul class="images-list">
                        <li v-for="(_src,i) in imageSrc" :key="i" class="view">
                            <div><img :src="_src"></div>
                            <i @click="removeImage(i)"></i>
                        </li>
                        <li @click="openFileSelect">
                            <img src="../../static/images/image16_share.png">
                            <input id="files" type="file" name="files" multiple="multiple" @change="fileChange">
                        </li>
                    </ul>
                </div>
            </div>
            <div :class="['j-form-btn',{disabled:pushing}]" @click="publick">{{btnText}}</div>
        </div>
    </div>
</template>

<script>
    import common from '../assets/js/common'
    export default {
        data() {
            return {
                baseUrl : common.ossUrl,
                id : this.$route.query.id,
                title : '',
                message : '',
                pushing : false,
                imageFiles : [],
                imageSrc : [],
                images : [],
                btnText : '发布'
            }
        },
        created() {
            if(this.id){
                this.getArticleDetail(this.id);
            }
        },
        methods: {
            getArticleDetail(id){
                this.$api.getCaseDetail({id:id}).then(res=>{
                    if(res.code == 1){
                        var data = res.data.item;
                        this.title = data.title;
                        this.message = data.content;
                        this.imageSrc = data.images;
                        this.images = data.images;
                        this.imageFiles = data.images.map(src=>{
                            return src;
                        })
                    }else{
                        this.$popup(res.msg)
                    }
                })
            },
            openFileSelect(){
                if(this.imageFiles.length >=6 ){
                    return;
                }
                var btn = document.getElementById("files");
                btn.click();
            },
            fileChange(){
                var btn = document.getElementById("files");
                var files = Array.prototype.slice.call(btn.files);
                var len = 6 - this.imageFiles.length;
                var arr = files.slice(0,len);
                var srcs = new Array(arr.length)
                this.imageSrc = this.imageSrc.concat(srcs);
                this.imageFiles = this.imageFiles.concat(arr);
                // console.log(this.imageSrc);
                // console.log(this.imageFiles);
                this.imageFiles.forEach((file,i)=>{
                    if(typeof file == "string"){
                        return;
                    }
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = ()=>{
                        this.imageSrc[i] = reader.result;
                        this.$forceUpdate();
                    }
                })
            },
            removeImage(index){
                this.imageSrc.splice(index,1);
                this.imageFiles.splice(index,1);
                this.images.splice(index,1);
                this.$forceUpdate();
            },
            publick(){
                if(this.pushing){
                    return;
                }
                if(!this.title){
                    this.$popup("请输入标题");
                    return;
                }
                if(!this.message){
                    this.$popup("请输入正文");
                    return;
                }
                this.pushing = true;
                this.btnText = '正在上传图片...';
                this.uploadFiles();
            },
            uploadFiles(){
                let formData = new FormData();
                var src_count = this.imageFiles.filter(file=>{
                    return typeof file == "string"
                }).length;
                var file_count = this.imageFiles.length - src_count;
                console.log(src_count,file_count);
                var count = 0;
                if(!file_count && this.id){
                    this.submitForm();
                }
                if(!this.imageFiles.length && !this.id){
                    this.submitForm();
                }
                this.imageFiles.forEach((file,i)=>{
                    if(typeof file == "string"){
                        return;
                    }
                    formData.append('prefix', 'createCourseCover');
                    formData.append('file', file);
                    this.$api.fetchPost(formData).then(res=> {
                        if (res.code == 1) {
                            this.images[i] = res.data.url;
                        }else{
                            this.images[i] = '';
                        }
                        count++;
                        if(file_count == count){
                            this.submitForm();
                        }
                    })
                })
                
            },
            submitForm(){
                this.btnText = '正在提交...';
                if(this.id){
                    this.$api.updateCase({
                        id: this.id,
                        title : this.title,
                        content : this.message,
                        images : this.images.join(",")
                    }).then(res=>{
                        fn(res,"修改成功",0)
                    }) 
                }else{
                    this.$api.createCase({
                        title : this.title,
                        content : this.message,
                        images : this.images.join(",")
                    }).then(res=>{
                        fn(res,"提交成功",1)
                    })           
                }
                
                const fn = (res,msg,code)=>{
                    this.pushing = false;
                    if(res.code == code){
                        this.$popup(msg);
                        this.title = '';
                        this.message = '';
                        this.images = [];
                        this.imageFiles = [];
                        this.imageSrc = [];
                        this.btnText = '发布';
                        setTimeout(()=>{
                            this.$router.go(-1);
                        },1000)
                    }else{
                        this.$popup(res.msg)
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
.j-form{
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    .j-form-content{
        overflow: hidden;
        flex: 1;
        display: flex;
        flex-direction: column;
        .j-form-title{
            overflow: hidden;
            border-bottom: 1px solid #f2f2f2;
            input{
                display: block;
                padding: 0.56rem 0.72rem;
                font-size: 0.56rem;
                height: 1.92rem;
                line-height: 0.8rem;
                margin: 0;
                box-sizing: border-box;
                width: 100%;
                border: none;
                outline: none;
            }
        }
        .j-form-textarea{
            flex: 1;
            overflow: hidden;
            textarea{
                display: block;
                padding: 0.56rem 0.72rem;
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                font-size: 0.4rem;
                line-height: 0.56rem;
                outline: none;
                border: none;
            }
        }
        .j-form-images{
            overflow: hidden;
            border-top: 1px solid #f2f2f2;
            ul{
                height: 1.44rem;
                box-sizing: border-box;
                overflow: hidden;
                li{
                    float: left;
                    width: 0.8rem;
                    height: 0.64rem;
                    border-radius: 1px;
                    position: relative;
                    margin-left: 0.48rem;
                    margin-top: 0.4rem;
                    > div{
                        overflow: hidden;
                        height: 100%;
                    }
                    img{
                        width: 0.8rem;
                        display: block;
                    }
                    i{
                        display: block;
                        width: 0.32rem;
                        height: 0.32rem;
                        border-radius: 0.32rem;
                        background: url(../../static/images/force_game_avatar.png) no-repeat center center rgba(0,0,0,0.55);
                        background-size: 0.16rem;
                        position: absolute;
                        right: -0.16rem;
                        top: -0.16rem;
                    }
                    input{
                        display: none;
                    }
                }
                li.view{
                    img{
                        margin-top: 50%;
                        transform: translateY(-50%);
                    }
                }
            }
        }
    }
    .j-form-btn{
        height: 1.52rem;
        text-align: center;
        line-height: 1.52rem;
        font-size: 0.4rem;
        color: #ffffff;
        background-image: linear-gradient(90deg, #FC921D 0%, #FA5E12 100%);
    }
    .j-form-btn.disabled{
        background: #BBBBBB;
    }
}
</style>
