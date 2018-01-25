<template>
    <form class="row search-form" style="margin: 5px 0 0 0">
        <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3 ">礼品卡密码：</label>
                <div class="col-md-9">
                    <input type="text" maxlength="12"  class="form-control">
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3">有效期：</label>
                <div class="col-md-9 time-box">
                    <div><input type="text" class="form-control inline-block datePicker"  placeholder="选择开始时间" id="createStartTime"></div>
                    <div>至</div>
                    <div><input type="text" class="form-control inline-block datePicker" placeholder="选择结束时间" id="createEndTime"></div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3 ">礼品卡状态：</label>
                <div class="col-md-9">
                    <select class="form-control">
                                <option v-for="item in orderTypeList" :value="item">{{item}}</option>
                            </select>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3">礼品卡面值：</label>
                <div class="col-md-9 time-box">
                    <div><input type="text" class="form-control inline-block"   v-model="startPrice" placeholder=""></div>
                    <div>~</div>
                    <div><input type="text" class="form-control inline-block" v-model="endPrice" placeholder=""></div>
                </div>
            </div>
        </div>
    </form>
</template>
<script>
    import client from "../../common/utils/client";
    import tagTree from '../common/tagTree';
    import {
        getComponentList,
        getComponentChannelList
    } from "../../vuex/actions/actions.component";
    import {
        getPainTree
    } from "../../vuex/actions/actions.pain";
    import {
        mMultiSelect,
        mAlert,
        mSelect,
        itemList
    } from "../../components";
    export default {
        props: {
            onchange: {
                type: Function,
                default: () => {}
            },
            oncreate: {
                type: Function,
                default: () => {}
            }
        },
        vuex: {
            getters: {
                componentChannelList: ({
                    component
                }) => component.componentChannelList,
                painTree: ({
                    pain
                }) => pain.painTree,
            },
            actions: {
                getComponentChannelList,
                getPainTree
            }
        },
        components: {
            mMultiSelect,
            mSelect,
            mAlert,
            tagTree,
            itemList
        },
        data() {
            return {
                searchOptions: {
                    createStartTime: "",
                    createEndTime: "",
                    page: {
                        currentPage: 1,
                        pageSize: 10,
                        startIndex: 0,
                        totalPage: 0,
                        totalSize: 0
                    }
                },
                orderTypeList: ["全部", "已使用", "未使用"],
                startPrice: "",
                endPrice: ""
            };
        },
        methods: {
            setOptions() {
                let options = this.searchOptions;
                let createStartTime = $("#createStartTime").val(),
                    createEndTime = $("#createEndTime").val();
                if (createStartTime != "") {
                    options.createStartTime = createStartTime + " 00:00:00";
                }
                if (createEndTime != "") {
                    options.createEndTime = createEndTime + " 23:59:59";
                }
                this.onchange(options);
            }
        },
        watch: {
            startPrice(val) {
                if (!/^[0-9]+.?[0-9]*$/.test(val)||!parseInt(val)>0||parseInt(val)>parseInt(this.endPrice)) {
                    this.startPrice="";   
                }
            },
            endPrice(val) {
                if (!/^[0-9]+.?[0-9]*$/.test(val)||!parseInt(val)>0||parseInt(val)<parseInt(this.startPrice)) {
                    this.endPrice="";      
                }
            },
        },
        ready() {
            this.setOptions();
            this.onchange(this.searchOptions);
            this.oncreate(false, true);
            $('#createStartTime').val('').datetimepicker({
                format: 'yyyy-mm-dd',
                language: 'zh-CN',
                autoclose: 'true',
                minView: 2
            });
            $('#createEndTime').val('').datetimepicker({
                format: 'yyyy-mm-dd',
                language: 'zh-CN',
                autoclose: 'true',
                minView: 2
            });
          
            $('.datePicker').on('change', () => {
                this.setOptions();
            })
        }
    };
</script>
<style lang="less" scope>
    .search-form .col-md-4 {
        padding-left: 0;
    }
    .col-md-4:nth-child(3n) {
        padding-right: 0;
    }
    .form-control.inline-block {
        display: inline-block;
        padding-right: 5px !important;
    }
    .time-box {
        display: -webkit-box;
        display: -moz-box;
        div {
            -webkit-box-flex: 1;
            -moz-box-flex: 1;
        }
        div:nth-child(2) {
            line-height: 34px;
            width: 85px;
            margin: 0 5px;
            text-align: center;
        }
    }
</style>

