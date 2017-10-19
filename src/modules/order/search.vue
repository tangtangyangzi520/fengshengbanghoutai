<template>
    <form class="row search-form" style="margin: 5px 0 0 0">

        <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3 sea" >订单编号：</label>
                <div class="col-md-9" >
                    <input type="text" class="form-control" v-model="searchOptions.ordOrderNo">
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3 sea">买家昵称：</label>
                <div class="col-md-9">
                    <input type="text" class="form-control" v-model="searchOptions.orsMemberNickname">
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3" style=" width:21.8%">收货人手机：</label>
                <div class="col-md-9">
                    <input type="text" class="form-control" v-model="searchOptions.ordReceiveMobile">
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3 sea">订单状态：</label>
                <div class="col-md-9">
                    <!-- <m-select :data="stateList" :placeholder="'请选择内容'" :change-func="selectStateFunc" :class="'fixedIcon'"></m-select> -->
                    <select class="form-control" v-model="searchOptions.ordStatus">
                        <option v-for="item in stateList" :value="item.id">{{item.name}}</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3 sea">物流方式：</label>
                <div class="col-md-9">
                    <!-- <m-select :data="logiTypeList" :placeholder="'请选择内容'" :change-func="selectLogiTypeFunc" :class="'fixedIcon'"></m-select> -->
                     <select class="form-control" v-model="searchOptions.ordLogiType">
                        <option v-for="item in logiTypeList" :value="item.id">{{item.name}}</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3" style=" width:21.8%">下单时间：</label>
                <div class="col-md-9 time-box">
                    <div><input type="text" class="form-control inline-block datePicker" placeholder="选择开始时间" id="createStartTimeOrder"></div>
                    <div>至</div>
                    <div><input type="text" class="form-control inline-block datePicker" placeholder="选择结束时间" id="createEndTimeOrder"></div>
                    <a @click="setTime(7)">近7天</a>
                    <a @click="setTime(30)">近30天</a>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3 sea">实付金额：</label>
                <div class="col-md-9 time-box">
                    <div><input type="text" class="form-control inline-block" :placeholder="'输入最低金额'" v-model="searchOptions.lowOrsOpenPay" @blur="checkAmount(searchOptions.lowOrsOpenPay)"></div>
                    <div>~</div>
                    <div><input type="text" class="form-control inline-block" :placeholder="'输入最高金额'" v-model="searchOptions.highOrsOpenPay" @blur="checkAmount(searchOptions.highOrsOpenPay)"></div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3 sea">订单类型：</label>
                <div class="col-md-9">
                    <!-- <m-select :data="orderTypeList" :placeholder="'请选择内容'" :change-func="selectOrderTypeFunc" :class="'fixedIcon'"></m-select> -->
                     <select class="form-control" v-model="searchOptions.ordOrderType">
                        <option v-for="item in orderTypeList" :value="item.id">{{item.name}}</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <button class="btn blue" type="button" @click="clearOptions()">清空查询条件</button>
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
        },

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
                { id: -1, name: '全部' }, { id: 1, name: '普通订单' }, { id: 0, name: '跨境订单' }
            ],
            lastSearchOptions: {},
            searchOptions: {
                ordOrderNo: '',
                orsMemberNickname: '',
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
        checkAmount(data) {
            if(data == ''){
                return
            }
            if (!/^[0-9]{1,8}([.]{1}[0-9]{1,2})?$/.test(data) || data < 0) {
                alert("请输入大于或等于0的金额");
            }
        },
        //清空查询条件
        clearOptions() {
            this.searchOptions = {
                ordOrderNo: '',
                orsMemberNickname: '',
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
            let list = this.stateList, listLogi = this.logiTypeList, listOrderType = this.orderTypeList;
            this.stateList = [];
            this.logiTypeList = [];
            this.orderTypeList = [];
            setTimeout(() => this.stateList = list, 50)
            setTimeout(() => this.logiTypeList = listLogi, 50)
            setTimeout(() => this.orderTypeList = listOrderType, 50)
            $('#createStartTimeOrder').val("");
            $('#createEndTimeOrder').val("");
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
            $('#createStartTimeOrder').val(createStartTime);
            $('#createEndTimeOrder').val(createEndTime);
            this.setOptions();
        },
        // 过滤请求参数
        setOptions() {
            let options = this.searchOptions;
            options.createStartTime = options.createEndTime = '';
            let createStartTime = $('#createStartTimeOrder').val(),
                createEndTime = $('#createEndTimeOrder').val();

            if (createStartTime != '') {
                options.createStartTime = createStartTime + ' 00:00:00';
            }
            if (createEndTime != '') {
                options.createEndTime = createEndTime + " 23:59:59";
            }
            this.onchange(options);
        },
        // // 选择订单状态回调
        // selectStateFunc(item) {
        //     this.searchOptions.ordStatus = item.id;
        //     this.setOptions();
        // },
        // // 选择物流方式回调
        // selectLogiTypeFunc(item) {
        //     this.searchOptions.ordLogiType = item.id;
        //     this.setOptions();
        // },
        // // 选择订单类型回调
        // selectOrderTypeFunc(item) {
        //     this.searchOptions.ordOrderType = item.id;
        //     this.setOptions();
        // }
    },
    created() {

    },
    watch: {
        ordOrderNo(val) {
            this.searchOptions.ordOrderNo = val;
        },
        orsMemberNickname(val) {
            this.searchOptions.orsMemberNickname = val;
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
        let dates = $("#createStartTimeOrder,#createEndTimeOrder");
        dates.datepicker({
            dateFormat: "yy-mm-dd",
            timeFormat: 'HH:mm',
            showMonthAfterYear: true,
            changeMonth: true,
            changeYear: true,
            buttonImageOnly: true,
            stepHour: 1,
            stepMinute: 1,
            closeText: '确定',
            prevText: '&#x3c;上月',
            nextText: '下月&#x3e;',
            currentText: '今天',
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthNamesShort: ['一', '二', '三', '四', '五', '六',
                '七', '八', '九', '十', '十一', '十二'],
            dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
            weekHeader: '周',
            showAnim: 'highlight',
            isClear: true, //是否显示清空 
            isRTL: false,
            onSelect: function(selectedDate) {
                var option = this.id == "createStartTimeOrder" ? "minDate" : "maxDate";
                dates.not(this).datepicker("option", option, selectedDate);
            },
            onClose: function(data, inst) {
                $(this).blur()
                dates.removeAttr("disabled")
            },
            beforeShow: function() {
                dates.attr("disabled", "disabled")
                if ($("#createEndTimeOrder").datepicker('getDate') != null) {
                    return
                }
                $(this).datepicker('option', 'maxDate', new Date())
            },
        });
        dates.on("click", function() {
            $(this).attr("disabled", "disabled")
        })
        dates.on("blur", this.setOptions)
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
.sea{
    width:19%

}
</style>

