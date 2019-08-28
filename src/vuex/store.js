import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
	state: {
		navigatorVisible: false,
		openid : '',
		userInfo : {},
		wxConfig : {}
	},
	actions:{
		navigatorTrigger () {
			console.log(arguments);
	    	// state.navigatorVisible = bool
		}
	},
	mutations: {
		increment (state, bool) {
			state.navigatorVisible = bool
		},
		login (state, openid) {
			state.openid = openid;
		},
		updateUserInfo (state, data) {
			state.userInfo = data;
		},
	},
	actions: {
		increment (context,data) {
			context.commit('increment',data);
		},
		login (context,data) {
			context.commit('login',data);
		},
		updateUserInfo (context,data) {
			context.commit('updateUserInfo',data);
		},
	}
})
