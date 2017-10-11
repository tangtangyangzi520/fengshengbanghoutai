<template>
    <div>
        <div class="page-bar">
            <ul class="page-breadcrumb">
                <li>
                    <i class="fa fa-home"></i>
                    <a href="javascript:;">首页</a>
                    <i class="fa fa-angle-right"></i>
                </li>
                <li>
                    <a href="javascript:;">我的工作台</a>
                </li>
            </ul>
        </div>
        <h3>工作台首页</h3>
        <div style="text-align:center;vertical-align:middle;min-height:500px">
        <a target="_black" href="http://192.168.4.247:7007/dist/#!/">oms系统</a><span v-for="i in 10">&nbsp;</span> 
        <a href="http://192.168.4.249:7007/dist/#!/" target="_black">cms系统</a>
        </div>
    </div>
</template>
<script>
import client from '../common/utils/client';
export default {
    data() {
        return {
        }
    },
    methods: {
        
    },
    created() {
      
    },
    ready() {
      
    }
}
</script>
<style lang="less" scope>

.page-container-bg-solid .page-bar, .page-content-white .page-bar {
   margin: 0 0 20px 0;
   background-color: #F7F7F7;
   border-bottom: 1px solid #F7F7F7!important;
}
</style>

