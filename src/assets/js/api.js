import {instance as http,instanceForm as httpForm} from './http.js'
const API = {
	//开始答题接口、完成答题接口
	answerBegin(param){
		param.token = '2718250f-640d-43ac-a628-ce188b5022ce';
		return this.ajax("/api/answer/begin",'post',param);
	},
	answerEnd(param){
		param.token = '2718250f-640d-43ac-a628-ce188b5022ce';
		return this.ajax("/api/answer/end",'post',param);
	},
	//获取答题接口
	getQuestion(param){
		param.token = '2718250f-640d-43ac-a628-ce188b5022ce';
		return this.ajax("/api/answer/get_question",'post',param);
	},
	//答题上报接口
	questionReply(param){
		param.token = '2718250f-640d-43ac-a628-ce188b5022ce';
		return this.ajax("/api/answer/reply",'post',param);
	},
	//获取榜单
	getLeaderBoard(param){
		return this.ajax("/api/leaderboard",'get',param);
	},
	//获取文章列表
	getArticleList(param){
		return this.ajax("/api/articlelearn/list",'get',param);
	},
	//获取文章详情
	getArticleDetail(param){
		return this.ajax("/api/articlelearn/item",'get',param);
	},
	//获取案例列表
	getCaseList(param){
		return this.ajax("/api/articlecase/list",'get',param);
	},
	//点赞、取消点赞
	caseLike(param){
		return this.ajax("/api/articlecase/like",'post',param);
	},
	//我的案例
	myCase(param){
		return this.ajax("/api/articlecase/my",'get',param);
	},
	//案例详情
	getCaseDetail(param){
		return this.ajax("/api/articlecase/item",'get',param);
	},
	//用户信息
	getUserInfo(param){
		if(!param){
			param = {token:'2718250f-640d-43ac-a628-ce188b5022ce'}
		}
		return this.ajax("/api/user/userinfo",'get',param);
	},
	//签到
	signup(param){
		return this.ajax("/api/user/checkin",'post',param);
	},
	//留言反馈
	feedBack(param){
		return this.ajax("/api/user/feedback",'post',param);
	},
	//上传图片
	fetchPost(param){
		return this.formsubmit("/api/common/upload",'post',param);
	},
	//添加案例
	createCase(param){
		return this.ajax("/api/articlecase/create",'post',param);
	},
	//修改案例
	updateCase(param){
		return this.ajax("/api/articlecase/update",'post',param);
	},
	//绑定人事id
	bindHomerId(param){
		return this.ajax("/api/user/bindhomerid",'post',param);
	},
	//获取奖品列表
	getPrizeList(param){
		return this.ajax("/api/turntable/goods",'post',param);
	},
	//抽奖
	toLottery(param){
		return this.ajax("/api/turntable/lottery",'post',param);
	},
	//中奖记录
	getPrizeRecord(param){
		return this.ajax("/api/turntable/my_prize",'get',param);
	},
	//获取微信配置
	getWxConfig(param){
		return this.ajax('/api/user/weixin','get',param);
	},
	
	ajax(api,type,param){
		if(type == "get"){
			return http.get(api,{
				params : param
			})
		}else{
			return http.post(api,param)
		}
	},
	formsubmit(api,type,param){
		if(type == "get"){
			return httpForm.get(api,{
				params : param
			})
		}else{
			return httpForm.post(api,param)
		}
	}
}
export default API
