<template>
	<div>
		<p class="case-list-empty" v-if="caseList.length==0">当前没有相关案例</p>
		<ul class="case-list" :style="{'padding-bottom':paddingBottom}">
			<li v-for="(item,i) in caseList" @click="toCaseDetail(item)">
				<div class="case-item-flex">
					<div class="case-item-media" v-if="item.cover_image">
						<img :src="item.cover_image">
					</div>
					<div class="case-item-title">{{item.title}}</div>
				</div>
				<div class="case-item-bottom">
					<div class="case-item-owner" @click.stop="editCase(item)" v-if="isedit">编辑</div>
					<div class="case-item-owner" v-else>员工ID  {{item.user_name}}{{item.is_liked}}</div>
					<div :class="['case-item-like',item.is_liked=='1' ? 'like' : '']" @click.stop="like(item)"></div>
				</div>
			</li>
		</ul>	
	</div>
	
</template>
<script>
	import '../assets/scss/caseList.scss'
	import common from '../assets/js/common'
	export default {
		name: 'caseList',
		data(){
			return {
				baseUrl : common.ossUrl,
			}
		},
		props:{
			caseList : {
				type : Array,
				default : []
			},
			paddingBottom: {
				type : String,
				default : '0'
			},
			isedit : {
				type: Boolean,
				default : false
			}
		},
		created(){
			// console.log(this.caseList);
		},
		methods:{
			like(item){
				this.$api.caseLike({
					id : item.id
				}).then(res=>{
					if(res.code == 0){
						this.$set(item,'is_liked',res.data.is_liked)
					}else{
						this.$popup(res.msg)
					}
				})
			},
			toCaseDetail(item){
				this.$router.push({path:'/caseDetail',query:{id:item.id}})
			},
			editCase(item){
				this.$router.push({path:'/share',query:{id:item.id}})
			}
		}
	}
</script>
<style lang="scss">
	
</style>
