<template>
    <div class="page-bar">
        <ul class="page-breadcrumb">
            <li>
                <a href="/dashboard.html">首页</a>
                <i class="fa fa-circle"></i>
            </li>
            <li>
                <slot name="title"></slot>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
    },
    data() {
        return {

        };
    },
    methods: {

    },
    watch: {
    }
};
</script>
<style lang="less" scope>

</style>