var sha1 = require('sha1');
let mixin = {
	methods: {
		/**
		 * 获取浏览器环境信息
		 * @return isWechat {Boolean} 是否在微信浏览器环境中
		 * @return isApp 	{Boolean} 是否在APP中
		 */
		getBroswerInfo() {
			var ua = navigator.userAgent.toLowerCase();
			return {
				isWechat: ua.match(/MicroMessenger/i) == "micromessenger",
				isApp: ua.match(/mitao/i) == "mitao"
			}
		},

		/**
		 * 创建随机串
		 * @param	length	{Number}	随机串的长度 默认16
		 * @return 	随机串
		 */
		createNoncestr(length) {
			length = Number(length) || 16;
			var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			var val = "";
			for (var i = 0; i < length; i++) {
				val += str.substr(Math.round((Math.random() * 10)), 1);
			}
			return val;
		},

		/**
		 * 生成微信分享配置
		 * @param	app_id	{String}	公众号appid
		 * @param	jsapi_ticket	{String} 	密钥
		 * @param	img_url	{String}	分享图标链接
		 */
		createWxShareConfig(app_id, jsapi_ticket, img_url, _url) {
			// let url = encodeURIComponent(location.href);
			let url = _url.split('#')[0];
			let timestamp = parseInt(new Date().getTime() / 1000);
			let noncestr = this.createNoncestr();
			let signature = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`
			let sign = sha1(signature);
			return {
				appids: app_id,
				// url : url,
				timestamp: timestamp,
				noncestr: noncestr,
				sign: sign,
				wximgurl: img_url
			}
		},

		/**
		 * 微信分享
		 * @param	wx	{Object}	微信jssdk
		 * @param	initConfig	{Object}	微信分享初始配置 appid,时间戳，随机串,签名
		 * @param	shareConfig	{Object}	分享的信息	标题、描述、链接、图标
		 */
		wxShare(wx, initConfig, shareConfig) {
			if (!wx || !initConfig || !shareConfig) {
				console.error("微信分享传入配置参数错误")
				return;
			}
			// alert(JSON.stringify(initConfig))
			// console.log(wx.updateAppMessageShareData)
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出
				appId: initConfig.appids, // 必填，公众号的唯一标识
				timestamp: initConfig.timestamp, // 必填，生成签名的时间戳
				nonceStr: initConfig.noncestr, // 必填，生成签名的随机串
				signature: initConfig.sign, // 必填，签名，见附录1
				jsApiList: [
					'onMenuShareTimeline',
					'onMenuShareAppMessage'
				] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			wx.ready(function() {
				// alert(JSON.stringify(shareConfig))
				// alert(wx.onMenuShareTimeline)
				wx.onMenuShareAppMessage({
					title: shareConfig.title, // 分享标题
					desc: shareConfig.desc, // 分享描述
					link: shareConfig.links, // 分享链接
					imgUrl: shareConfig.wximgurl, // 分享图标
					success: function() {
						// alert("微信好友成功");
						// 用户确认分享后执行的回调函数
					},
					cancel: function() {
						// alert("微信好友失败");
						// 用户取消分享后执行的回调函数
					}
				});
				wx.onMenuShareTimeline({
					title: shareConfig.title, // 分享标题
					link: shareConfig.links, // 分享链接
					imgUrl: shareConfig.wximgurl, // 分享图标
					success: function() {
						// alert("分享朋友圈成功");
						// 用户确认分享后执行的回调函数
					},
					cancel: function() {
						// alert("分享朋友圈失败");
						// 用户取消分享后执行的回调函数
					}
				});
			});
			wx.error(function(res) {
				console.log(res)
				// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
				// alert("微信分享失败！")
			});
		},
		wxPay(wx, config, successCallback, cancelCallback, errorCallback) {
			if (!wx || !config) {
				console.error("微信分享传入配置参数错误")
				return;
			}
			successCallback = successCallback || new Function();
			cancelCallback = cancelCallback || new Function();
			errorCallback = errorCallback || new Function();
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出
				appId: config.appId, // 必填，公众号的唯一标识
				timestamp: config.timeStamp, // 必填，生成签名的时间戳
				nonceStr: config.nonceStr, // 必填，生成签名的随机串
				signature: config.signType, // 必填，签名
				jsApiList: [
					'chooseWXPay',
				] // 必填，需要使用的JS接口列表
			});
			wx.chooseWXPay({
				appId: config.appId,
				timestamp: config.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签
				nonceStr: config.nonceStr, // 支付签名随机串，不长于 32 位
				package: config.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
				signType: config.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
				paySign: config.paySign, // 支付签名
				success: successCallback,
				cancel: cancelCallback
			});
			wx.error(errorCallback);
		}
	}
}
export default mixin;
