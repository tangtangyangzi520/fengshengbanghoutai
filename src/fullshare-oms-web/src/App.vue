<template>
  <div v-if="!isSingle">
    <m-header></m-Header>
    <div class="clearfix"> </div>
    <div class="page-container">
        <div class="page-sidebar-wrapper">
            <m-sidebar :menu-name="menuName"></m-sidebar>
        </div>
        <div class="page-content-wrapper">
            <div class="page-content" style="padding-left: 0;padding-right: 0;padding-top: 0;">
                <router-view></router-view>
            </div>
        </div>
    </div>
    <div class="page-footer"> 
        <div class="page-footer-inner"> 2017 &copy; 丰盛榜网络科技 </div>
        <div class="scroll-to-top">
            <i class="icon-arrow-up"></i>
        </div>
    </div>
    <m-loading :show="isLoading"></m-loading>
  </div>
  <div v-else style="height:580px;background:#FFF;">
    <router-view transition="fade" transition-mode="out-in"></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import store from './vuex/store'
import mHeader from './modules/common/mHeader.vue';
import mSidebar from './modules/common/mSidebar.vue';
import mLoading from './modules/common/loading.vue';
export default {
  store,
  components: { mHeader,mSidebar,mLoading },
  data(){
    return{
      show: false,
      isSingle: false
    }
  },
  vuex: {
    getters: {
      isLoading:({loading}) => loading.item.show
    }
  },
  methods: {
  },
  created() {
    if(this.$route.name == 'resourceSelectPic'||this.$route.name == 'resourceSelectMedia'){
      this.isSingle = true;
    }
  }
}
</script>

<style lang="less">
@import "./common/css/common.less";
body, h1, h2, h3, h4, h5, h6{
  font-family: "Helvetica Neue",Helvetica,"Microsoft YaHei",Arial,sans-serif; 
  scrollbar-arrow-color: #f4ae21;
  scrollbar-face-color: #333;
  scrollbar-3dlight-color: #666;
  scrollbar-highlight-color: #666;
  scrollbar-shadow-color: #999;
  scrollbar-darkshadow-color: #666;
  scrollbar-track-color: #666;
  scrollbar-base-color:#f8f8f8;
}
* {
  font-family: "Helvetica Neue",Helvetica,"Microsoft YaHei",Arial,sans-serif; 
}
.fade-transition {
  transform: translateY(0);
  transition: all .1s ease;
}
.fade-enter, .fade-leave {
  transform: translateY(10px);
  opacity: 0;
}
</style>
