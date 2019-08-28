import Vue from 'vue'
import Router from 'vue-router'

const welcome = resolve => require(['./../components/welcome.vue'], resolve)
const Index = resolve => require(['./../components/index.vue'], resolve)
const Answer = resolve => require(['./../components/answer.vue'], resolve)
const Home = resolve => require(['./../components/home.vue'], resolve)
const Rank = resolve => require(['./../components/rank.vue'], resolve)
const pkGame = resolve => require(['./../components/game/pk.vue'], resolve)
const unlimitedGame = resolve => require(['./../components/game/unlimited.vue'], resolve)
const levelGame = resolve => require(['./../components/game/level.vue'], resolve)
const myCase = resolve => require(['./../components/mycase.vue'], resolve)
const learn = resolve => require(['./../components/learn.vue'], resolve)
const article = resolve => require(['./../components/article.vue'], resolve)
const casedetail = resolve => require(['./../components/casedetail.vue'], resolve)
const reply = resolve => require(['./../components/reply.vue'], resolve)
const share = resolve => require(['./../components/share.vue'], resolve)
const lucky = resolve => require(['./../components/lucky.vue'], resolve)
Vue.use(Router)
const routes = [
    {
        path: '/',
        name: 'Knowledge Game',
        component: welcome
    },
    {
        path: '/index',
        name: 'Knowledge Game',
        component: Index
    },
    {
        path: '/answer',
        name: '答题',
        component: Answer
    },
    {
        path: '/home',
        name: '个人中心',
        component: Home
    },
    {
        path: '/rank',
        name: '排行榜',
        component: Rank
    },
    {
        path: '/game_pk',
        name: '答题',
        component: pkGame
    },
    {
        path: '/game_unlimited',
        name: '答题',
        component: unlimitedGame
    },
    {
        path: '/game_level',
        name: '答题',
        component: levelGame
    },
    {
        path: '/mycase',
        name: '我的案例',
        component: myCase
    },
    {
        path: '/learn',
        name: '训练营',
        component: learn
    },
    {
        path: '/article',
        name: '训练营',
        component: article
    },
    {
        path: '/caseDetail',
        name: '训练营',
        component: casedetail
    },
    {
        path: '/reply',
        name: '留言反馈',
        component: reply
    },
    {
        path: '/share',
        name: '我要分享',
        component: share
    },
    {
        path: '/lucky',
        name: '积分抽奖',
        component: lucky
    },
]

export default new Router({
    routes: routes.map(item => {
        item.beforeEnter = (to, from, next) => {
            //修改 浏览器  默认 的头部内容
            document.title = to.name;
            next();
        }
        return item;
    }),
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            if (from.meta.keepAlive) {
                from.meta.savedPosition = document.body.scrollTop
            }
            return {
                x: 0,
                y: to.meta.savedPosition || 0
            }
        }
    }
})
