<template>
    <span class="list-items" v-if="list.length!=0">
        <a v-for="item in list">
            <i class="fa fa-remove" title="删除" @click="remove(item)" style="position:relative;"></i>{{item.text}}
        </a>
    </span>
</template>
<script>
export default {
    props: {
        list: Array,
        remove: Function,
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
<style lang="less">

</style>