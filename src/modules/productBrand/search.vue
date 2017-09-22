<template>
    <form class="row search-form" style="margin: 5px 0 0 0">  
        <input type="text" class="form-control" v-model="searchOptions.keyword">
    </form>
</template>
<script>
import client from '../../common/utils/client';
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
        }
    },
    vuex: {
    },
    components: { mMultiSelect, mSelect, mAlert },
    data() {
        return {
            stateList: [],
            lastSearchOptions: {},
            searchOptions: {
                keyword: '',
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
        //添加品牌
        addBanner() {
            this.wordEditId = '';
            this.showAddDialog = true;
        },
        // 过滤请求参数，空值的字段删除
        setOptions() {
            let options = this.searchOptions;
            for (let item in options) {
                if (options[item] === '') {
                    delete options[item];
                }
            }
            if (options.keyword == "") {
                delete options.keyword;
            }
            this.onchange(options);
        }
    },
    created() {
    },
    watch: {
        keyword(val) {
            this.searchOptions.keyword = val;
        }
    },
    ready() {
        this.setOptions();
        this.onchange(this.searchOptions);
        this.oncreate(false, true);
        $('.datePicker').on('change', () => {
            this.setOptions();
        })
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

