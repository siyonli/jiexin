<template>
	<nav id="nav" v-if="navigatorVisible">
		<router-link class="nav nav-index" to="/index">主页</router-link>
    <router-link class="nav nav-answer" to="/answer">答题</router-link>
    <router-link class="nav nav-learn" to="/learn">学习</router-link>
    <router-link class="nav nav-rank" to="/rank">排行榜</router-link>
    <router-link class="nav nav-home" to="/home">我</router-link>
  </nav>
</template>

<script>
	export default {
		name: 'navBottom',
		props:{

		},
		data() {
			return {
        navigatorVisible : this.$store.state.navigatorVisible
			};
		},
    created() {

    },
    watch:{
      '$store.state.navigatorVisible'(nv,ov){
        this.navigatorVisible = nv;
      }
    }
	}
</script>

<style lang="scss">
#nav{
	// position: fixed;
	height: 1.52rem;
	width: 100%;
	// left: 0;
	// bottom: 0;
	display: flex;
	border-top: 1px solid #f2f2f2;
	background: #FFFFFF;
  box-shadow: 0 -2px 3px 0 rgba(147,147,147,0.05);
	> *{
		display: block;
		flex: 1;
		text-align: center;
		font-size: 0.32rem;
    color: #c0c0c0;
    padding-top: 0.88rem;
    line-height: 0.48rem;
    text-decoration: none;
    background-position: center 0.2rem;
    background-repeat: no-repeat;
    background-size: 0.64rem;
	}
  .nav-index{
    background-image: url(../../../static/images/btn06_home_nor.png);
  }
  .nav-answer{
    background-image: url(../../../static/images/btn07_home_nor.png);
  }
  .nav-learn{
    background-image: url(../../../static/images/btn08_home_nor.png);
  }
  .nav-rank{
    background-image: url(../../../static/images/btn09_home_nor.png);
  }
  .nav-home{
    background-image: url(../../../static/images/btn10_home_nor.png);
  }
  .router-link-exact-active{
    color: #FC8347;
  }
  .router-link-exact-active.nav-index{
    background-image: url(../../../static/images/btn06_home_sel.png);
  }
  .router-link-exact-active.nav-answer{
    background-image: url(../../../static/images/btn07_home_sel.png);
  }
  .router-link-exact-active.nav-learn{
    background-image: url(../../../static/images/btn08_home_sel.png);
  }
  .router-link-exact-active.nav-rank{
    background-image: url(../../../static/images/btn09_home_sel.png);
  }
  .router-link-exact-active.nav-home{
    background-image: url(../../../static/images/btn10_home_sel.png);
  }
}
</style>
