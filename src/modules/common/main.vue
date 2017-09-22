<template>
<m-header></m-Header>
<div class="clearfix"> </div>
<div class="page-container">
    <div class="page-sidebar-wrapper">
        <m-sidebar :menu-name="menuName"></m-sidebar>
    </div>
    <div class="page-content-wrapper">
        <div class="page-content">
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
</template>
<script>
    import mHeader from './mHeader.vue';
    import mSidebar from './mSidebar.vue';
    export default{
        props: ['menuName'],
        data () {
            return {
                transitionName: 'fade'
            };
        },
        components: {
            mHeader,
            mSidebar
        },
        methods: {
        },
        transitions: {
            'fade': {
                enterClass: 'fadeIn',
                leaveClass: 'fadeOut'
            }
        },
        ready () {
        }
    };
</script>
<style lang="less" scope>

</style>
