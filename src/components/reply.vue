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
            </div>
            <div class="j-form-btn" @click="publick">发布</div>
        </div>
    </div>
</template>

<script>
    import '../assets/scss/reply.scss'
    export default {
        data() {
            return {
                title : '',
                message : '',
                pushing : false
            }
        },
        created() {
            
        },
        methods: {
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
                this.$api.feedBack({
                    title : this.title,
                    message : this.message
                }).then(res=>{
                    this.pushing = false;
                    if(res.code == 1){
                        this.$popup("提交成功");
                        this.title = '';
                        this.message = '';
                        setTimeout(()=>{
                            this.$router.go(-1);
                        },1000)
                    }else{
                        this.$popup(res.msg)
                    }
                })
            }
        }
    }
</script>

<style lang="scss">

</style>
