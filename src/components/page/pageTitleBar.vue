<template>
    <div style="width:100%;position:relative;overflow:hidden;">
        <ul class="page-breadcrumb">
            <li>
                <a href="/dist/#!/">首页</a>
                <i class="fa fa-circle"></i>
            </li>
            <li>
                <slot name="title"></slot>
            </li>
        </ul>
        <!--事件在common/utils/client.js，主要处理折叠搜索栏-->
        <button class="btn btn-xs green" id="btnShowOrHideSearch" type="button" @click="showOrHideSearchBar">
            <template v-if="show">
                <i class="fa fa-angle-up"></i> 隐藏搜索</template>
            <template v-else>
                <i class="fa fa-angle-down"></i> 展开搜索</template>
        </button>
    </div>
</template>
<script>
import client from "../../common/utils/client";
export default {
    props: {
    },
    data() {
        return {
            show: true
        };
    },
    methods: {
        showOrHideSearchBar() {
            this.show = !this.show;
            localStorage.setItem('showTopBar', this.show);
        }
    },
    created() {
        let showTopBar = localStorage.getItem('showTopBar');
        if (showTopBar && showTopBar == 'false') {
            this.show = false;
        }
    },
    watch: {
        show() {
            if (this.show) {
                $('.page-bar.min-bar').css({ 'height': 'auto', 'overflow': '' });

            } else {
                $('.page-bar.min-bar').css({ 'height': 40, 'overflow': 'hidden' });
            }
            client.resetListHeight();
        }
    },
    ready() {
        let showTopBar = localStorage.getItem('showTopBar');
        if (showTopBar && showTopBar == 'false') {
            this.show = false;
        }
    }
};
</script>
<style lang="less" scope>
#btnShowOrHideSearch {
    position: absolute;
    right: 0;
    top: 0;
}
</style>