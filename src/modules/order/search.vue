<template>
    <form class="row search-form" style="margin: 5px 0 0 0">

        <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3">订单编号:</label>
                <div class="col-md-9">
                    <input type="text" class="form-control" v-model="searchOptions.ordOrderNo">
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3">收货人名称:</label>
                <div class="col-md-9">
                    <input type="text" class="form-control" v-model="searchOptions.ordReceiveName">
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3">收货人手机:</label>
                <div class="col-md-9">
                    <input type="text" class="form-control" v-model="searchOptions.ordReceiveMobile">
                </div>
            </div>
        </div>
          <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3">订单状态:</label>
                <div class="col-md-9">
                    <m-select :data="stateList" :placeholder="'请选择内容'" :change-func="selectStateFunc" :class="'fixedIcon'"></m-select>
                </div>
            </div>
        </div>
         <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3">物流方式:</label>
                <div class="col-md-9">
                    <m-select :data="logiTypeList" :placeholder="'请选择内容'" :change-func="selectLogiTypeFunc" :class="'fixedIcon'"></m-select>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3">下单时间：</label>
                <div class="col-md-9 time-box">
                    <div><input type="text" class="form-control inline-block datePicker" placeholder="选择开始时间" id="createStartTime"></div>
                    <div>至</div>
                    <div><input type="text" class="form-control inline-block datePicker" placeholder="选择结束时间" id="createEndTime"></div>
                    <a @click="setTime(7)">近7天</a>
                    <a @click="setTime(30)">近30天</a>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3">实付金额:</label>
                <div class="col-md-9 time-box">
                    <div><input type="text" class="form-control inline-block" :placeholder="'输入最低金额'" v-model="searchOptions.lowOrsOpenPay" @blur="checkAmount(searchOptions.lowOrsOpenPay)"></div>
                    <div>~</div>
                    <div><input type="text" class="form-control inline-block" :placeholder="'输入最高金额'" v-model="searchOptions.highOrsOpenPay" @blur="checkAmount(searchOptions.highOrsOpenPay)"></div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3">订单类型:</label>
                <div class="col-md-9">
                    <m-select :data="orderTypeList" :placeholder="'请选择内容'" :change-func="selectOrderTypeFunc" :class="'fixedIcon'"></m-select>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <button class="btn red" type="button" @click="clearOptions()">清空查询条件</button>
            </div>
        </div>
    </form>
</template>
<script>
import client from '../../common/utils/client';
import { getComponentList } from '../../vuex/actions/actions.component';
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
        }
    },
    vuex: {
        getters: {
        },
        actions: {
        }
    },
    components: { mMultiSelect, mSelect, mAlert },
    data() {
        return {
            stateList: [
                { id: -1, name: '全部' }, { id: 0, name: '待付款' }, { id: 1, name: '待发货' }, { id: 2, name: '已发货' }, { id: 3, name: '已完成' }, { id: 4, name: '已关闭' }, { id: 5, name: '售后线下处理' }
            ],
            logiTypeList: [
                { id: -1, name: '全部' }, { id: 1, name: '快递发货' }, { id: 2, name: '上门自提' }
            ],
            orderTypeList: [
                { id: -1, name: '全部' }, { id: 0, name: '普通订单' }, { id: 1, name: '跨境订单' }
            ],
            lastSearchOptions: {},
            searchOptions: {
                ordOrderNo: '',
                ordReceiveName: '',
                ordReceiveMobile: '',
                ordStatus: -1,
                ordLogiType: -1,
                createStartTime: '',
                createEndTime: '',
                lowOrsOpenPay: '',
                highOrsOpenPay: '',
                ordOrderType: -1,
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
        //校验查询金额
        checkAmount(data){
            if(!/^[0-9]*$/.test(data) || data < 0){
                this.$parent.showMsg("请输入不小于0的数字");
            }
        },
        //清空查询条件
        clearOptions() {
            this.searchOptions = {
                ordOrderNo: '',
                ordReceiveName: '',
                ordReceiveMobile: '',
                ordStatus: -1,
                ordLogiType: -1,
                createStartTime: '',
                createEndTime: '',
                lowOrsOpenPay: '',
                highOrsOpenPay: '',
                ordOrderType: -1,
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    startIndex: 0,
                    totalPage: 0,
                    totalSize: 0
                }
            };
            //修改下拉框的值
            let list = this.stateList,listLogi=this.logiTypeList,listOrderType=this.orderTypeList;
            this.stateList = [];
            this.logiTypeList=[];
            this.orderTypeList=[];
            setTimeout(() => this.stateList = list, 50)
            setTimeout(() => this.logiTypeList = listLogi, 50)
            setTimeout(() => this.orderTypeList = listOrderType, 50)
            $('#createStartTime').val("");
            $('#createEndTime').val("");
            this.setOptions();
        },
        //设置时间(近7天/近30天)
        setTime(dayNumber) {
            let date, createStartTime, createEndTime, timestamp, newDate;
            date = new Date();
            timestamp = date.getTime();
            newDate = new Date(timestamp - dayNumber * 24 * 3600 * 1000);
            createEndTime = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
            createStartTime = [newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate()].join('-');
            $('#createStartTime').val(createStartTime);
            $('#createEndTime').val(createEndTime);
            this.setOptions();
        },
        // 过滤请求参数
        setOptions() {
            let options = this.searchOptions;
            options.createStartTime = options.createEndTime = '';
            let createStartTime = $('#createStartTime').val(),
                createEndTime = $('#createEndTime').val();

            if (createStartTime != '') {
                options.createStartTime = createStartTime + ' 00:00:00';
            }
            if (createEndTime != '') {
                options.createEndTime = createEndTime + " 23:59:59";
            }
            // for (let item in options) {
            //     if (options[item] === '') {
            //         delete options[item];
            //     }
            // }
            this.onchange(options);
        },
        // 选择订单状态回调
        selectStateFunc(item) {
            this.searchOptions.ordStatus = item.id;
            this.setOptions();
        },
        // 选择物流方式回调
        selectLogiTypeFunc(item) {
            this.searchOptions.ordLogiType = item.id;
            this.setOptions();
        },
        // 选择订单类型回调
        selectOrderTypeFunc(item) {
            this.searchOptions.ordOrderType = item.id;
            this.setOptions();
        }
    },
    created() {

    },
    watch: {
        ordOrderNo(val) {
            this.searchOptions.ordOrderNo = val;
        },
        ordReceiveName(val) {
            this.searchOptions.ordReceiveName = val;
        },
        ordReceiveMobile(val) {
            this.searchOptions.ordReceiveMobile = val;
        },
        lowOrsOpenPay(val) {
            this.searchOptions.lowOrsOpenPay = val;
        },
        highOrsOpenPay(val) {
            this.searchOptions.highOrsOpenPay = val;
        },
    },
    ready() {
        this.setOptions();
        this.onchange(this.searchOptions);
        this.oncreate(false, true);
        $('#createStartTime').val('').datetimepicker({ format: 'yyyy-mm-dd', language: 'zh-CN', autoclose: 'true', minView: 2 });
        $('#createEndTime').val('').datetimepicker({ format: 'yyyy-mm-dd', language: 'zh-CN', autoclose: 'true', minView: 2 });
        $('.datePicker').on('change', () => {
            this.setOptions();
        })
    }
}
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
    padding-right: 5px!important;
}

.time-box {
    display: -webkit-box;
    display: -moz-box;
    div {
        -webkit-box-flex: 1.0;
        -moz-box-flex: 1.0
    }
    div:nth-child(2) {
        line-height: 34px;
        width: 85px;
        margin: 0 5px;
        text-align: center
    }
}
</style>

