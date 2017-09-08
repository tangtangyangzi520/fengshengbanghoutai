<template>
    <div class="page-header navbar navbar-fixed-top">
        <div class="page-header-inner">
            <div class="page-logo">
                <a href="/">
                    <img src="../../../assets/layouts/layout/img/fsb-logo.png" style="margin: 5px 25px;width: 100px;" alt="logo" class="logo-default" /> </a>
                <div class="menu-toggler sidebar-toggler" @click="hideLeftNav">
                    <span></span>
                </div>
            </div>
            <form class="search-form hide" action="#" method="GET">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Search..." name="query">
                    <span class="input-group-btn">
                        <a href="javascript:;" class="btn submit">
                            <i class="icon-magnifier"></i>
                        </a>
                    </span>
                </div>
            </form>
            <a href="javascript:;" class="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">
                <span></span>
            </a>
            <div class="top-menu">
                <ul class="nav navbar-nav pull-right">
                    <li class="dropdown dropdown-user">
                        <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-close-others="true" aria-haspopup="true" aria-expanded="false">
                            <img alt="" class="img-circle" :src="logo">
                            <span class="username username-hide-on-mobile ng-binding"> {{user.userName}} </span>
                            <i class="fa fa-angle-down"></i>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-default">
                            <li>
                                <a ui-sref="system.userinfo" href="/#/system/userinfo">
                                    <i class="icon-lock"></i> 个人中心 </a>
                            </li>
                            <li>
                                <a @click="logout()">
                                    <i class="icon-key"></i> 退出 </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import logo from '../../assets/ic_launcher_app.png';
import client from '../../common/utils/client';
export default {
    props: {
        'title': {
            type: String,
            default: 'default title'
        },
        'smallTitle': {
            type: String,
            default: 'default small title'
        }
    },
    data() {
        return {
            showNav: true,
            logo: logo,
            user: {}
        }
    },
    created() {
        let showLeftNav = localStorage.getItem('showLeftNav');
        if (showLeftNav && showLeftNav == 'false') {
            this.showNav = false;
        }
        this.user = JSON.parse(decodeURIComponent(client.getCookie('user')));
    },
    ready() {
        let showLeftNav = localStorage.getItem('showLeftNav');
        if (showLeftNav && showLeftNav == 'false') {
            this.showNav = false;
        }
    },
    methods: {
        hideLeftNav() {
            this.showNav = !this.showNav;
            localStorage.setItem('showLeftNav', this.showNav);
        },
        logout() {
            $.cookie('user', null, { path: '/' });
            location.href = '/login.html';
        }
    },
    watch: {
        showNav(val) {
            // if (!val) {
            //     $('body').attr('class', 'page-header-fixed page-sidebar-closed-hide-logo ng-scope page-content-white page-sidebar-closed');
            //     $('.page-sidebar-menu').attr('class', 'page-sidebar-menu page-sidebar-menu-closed');
            // } else {
            //     $('body').attr('class', 'page-header-fixed page-sidebar-closed-hide-logo ng-scope page-content-white');
            //     $('.page-sidebar-menu').attr('class', 'page-sidebar-menu');
            // }
        }
    }
};
</script>
<style lang="less" scoped>
.page-header.navbar .menu-toggler.sidebar-toggler1 {
    float: right;
    margin: 15.5px 0 0;
}
</style>
