<template>
      <form class="row search-form" style="margin: 5px 0 0 0">
           <div class="col-md-4">
                <div class="form-group">
                    <label class="col-md-3">名称：</label>
                    <div class="col-md-9">
                        <input type="text" class="form-control" v-model="searchOptions.keyword">
                    </div>
                </div>
            </div>
    </form>
</template>
<script>
import client from '../../common/utils/client';
import { getComponentList, getComponentChannelList } from '../../vuex/actions/actions.component';
import { getPainTree } from '../../vuex/actions/actions.pain';
import { mMultiSelect, mAlert, mSelect } from '../../components';
export default {
    props: {
        onchange: {
            type: Function,
            default: () => { }
        },
        oncreate: {
            type: Function,
            default: () => { }
        },
        id:{
            type: String,
            value: 0 
        },
    },
    vuex: {
        getters: {
            componentChannelList: ({ component }) => component.componentChannelList,
            painTree: ({ pain }) => pain.painTree,
        },
        actions: {
            getComponentChannelList, getPainTree
        }
    },
    components: { mMultiSelect, mSelect, mAlert },
    data() {
        return {
            stateList: [],
            lastSearchOptions: {},
            searchOptions: {
                parentIds: this.id,
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    startIndex: 0,
                    totalPage: 0,
                    totalSize: 0
                }
            }
        }
    },
    methods: {
       // 过滤请求参数，空值的字段删除
        setOptions() {
            let options = this.searchOptions;
            for (let item in options) {
                if (options[item] === '') {
                    delete options[item];
                }
            }
            if (options.parentIds == "") {
                delete options.parentIds;
            }
            this.onchange(options);
        }       
    },
    created() {
 
    },
    watch: {
        parentIds(val) {
            this.searchOptions.parentIds = val;
        }
       
    },
    ready() {      
    }
}
</script>
<style lang="less" scope>
.search-form .col-md-4{
    padding-left:0;
}
.col-md-4:nth-child(3n){
    padding-right:0;
}
.form-control.inline-block {
    display: inline-block;
    padding-right: 5px!important;
}
.time-box{
    display:-webkit-box;
    display:-moz-box;
    div{-webkit-box-flex: 1.0;-moz-box-flex: 1.0}
    div:nth-child(2){line-height:34px;width:85px;margin:0 5px;text-align:center}
}
</style>

