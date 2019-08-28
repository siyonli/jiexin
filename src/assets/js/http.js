import axios from 'axios';
import config from './config.js'
import Common from './common.js'
import qs from 'qs'
let mock = true;

function getToken(){
	if(localStorage.business_token){
		return localStorage.business_token
	}else{
		return Common.resloveUrl().token;
	}
}
// axios.defaults.withCredentials=true
// import Vue from 'vue'
// import Popup from '../components/popup/index.js'
let instance = axios.create({
	// 前置
	baseURL: config.apiHost,
	crossDomain:true,
	// 设置headers
	headers: {
		// 'Content-Type': 'application/json'
    	'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'
	},
	// 固定的URL 参数
	params: {},
	// 超时设置 60s
	timeout: 60000,
	transformRequest:(data)=>{
	  return qs.stringify(data)
	}
})
instance.interceptors.request.use(_config => {
	// console.log(_config);
// 	if(_config.method == "post"){
// 		_config.data = JSON.stringify(_config.data);
// 	}
  // _config.headers['Authorization'] = 'Bearer '+ getToken()
	return _config
}, error => {
	console.log(error)
	return Promise.reject(error)
})
instance.interceptors.response.use(response => {
	return response.data;
})

let instanceForm = axios.create({
	// 前置
	baseURL: config.apiHost,
	crossDomain:true,
	// 设置headers
	headers: {
    	'Content-Type':'multipart/form-data'
	},
	// 固定的URL 参数
	params: {},
	// 超时设置 60s
	timeout: 60000,
})
instanceForm.interceptors.request.use(_config => {
	if (config.method === 'post' && config.url != '/api/common/upload') { // 将其过滤掉
    	config.data = qs.stringify(config.data);
    }
	return _config
}, error => {
	return Promise.reject(error)
})
instanceForm.interceptors.response.use(response => {
	
	return response.data;
})


export {
	instance,
	instanceForm
}
