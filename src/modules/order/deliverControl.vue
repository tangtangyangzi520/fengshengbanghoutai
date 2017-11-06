<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'800px'">
            <div slot="content">
                <div class="col-md-12" style="padding-bottom:5px;">
                    <div class="col-md-2">收货地址:</div>
                    <div class="col-md-10">{{ordAddress()}}</div>
                </div>
                <div class="col-md-12" style="padding-bottom:5px;">
                    <div class="col-md-2">物流公司:</div>
                    <div class="col-md-4">

                    </div>
                    <div class="col-md-2">快递单号:</div>
                    <div class="col-md-4">
                        <input type="text" v-model="subData.ordLogiName">
                    </div>
                </div>
                <div class="col-md-12" style="padding-bottom:5px;">
                    <div class="col-md-2">发货时间:</div>
                    <div class="col-md-4">
                        <input type="text" class="form-control inline-block datePicker" placeholder="选择发货时间" id="createStartTimeOrder"  v-model="subData.ordLogiTime">
                    </div>
                </div>

            </div>
            <span slot="btnList">
                <button type="button" @click.stop="editDetailDemo" class="btn default blue">提交</button>
                <button type="button" class="btn default" data-dismiss="modal">取消</button>
            </span>
        </m-alert>
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
        <div style="position:fixed;z-index:111111;" v-show="picShowOption.show">
            <select-pic v-show="picShowOption.show" :options="picShowOption" :onselect="selectPicFunc" :oncancel="cancelSelect"></select-pic>
        </div>
        <div style="position:fixed;z-index:11111;" v-show="showComponent">
            <select-component-all v-show="showComponent" :options="componentShowOption" :onselect="selectComponentFunc" :oncancel="cancelSelectComponent"></select-component-all>
        </div>
    </div>
</template>
<script>
import client from '../../common/utils/client';
import { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList } from '../../components';
import loading from '../common/loading';
import { showSelectPic, getSelectPicList } from '../../vuex/actions/actions.resource';
export default {
    components: { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList, loading },
    props: {
        show: {
            type: Boolean,
            value: false
        },
        onhide: {
            type: Function,
            value: () => { }
        },
        id: {
            type: String,
            value: 0
        },
        subData: {
            type: Object,
            value: {}
        }
    },
    data() {
        return {
            isLoading: false,
            showDialog: false,
            showPage: false,
            showPainListSelect: true,
            painIdsSelect: [],
            painList: [],
            componentShowOption: {},
            data: {
                "authorName": "",
                "authorTitle": "",
                "authorType": 2,
                "bgUrl": "",
                "description": "",
                "halfFigure": "",
                "iconId": null,
                "iconUrl": "",
                "painIds": [],
                "painOptions": []
            },
            editDemoData: {
                "ordOrderId": 0,
                "ordDemo": '',
            },
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '商品发货',
            sourceDemo: '',//取消时回显
        }
    },
    vuex: {
        getters: {
            picShowOption: ({ resourceControl }) => resourceControl.picShowOption,
            selectPicList: ({ resourceControl }) => resourceControl.selectPicList,
        },
        actions: { showSelectPic, getSelectPicList }
    },
    methods: {
        //显示收货信息
        ordAddress() {
            let orderSub = this.subData;
            return orderSub.ordReceiveProvince + " " + orderSub.ordReceiveCitity + " " + orderSub.ordReceiveArea + " " + orderSub.ordReceiveDetail +
                "," + orderSub.ordReceiveName + "," + orderSub.ordReceiveMobile
        },
        //提交商家备注
        editDetailDemo() {
            this.editDemoData.ordOrderId = this.id;
            client.postData(ORDER_EDIT_DEMO, this.editDemoData).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    this.showMsg(data.msg);
                    this.$parent.getList(false, true);
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
            });
        },
        // 选择组件回调
        selectComponentFunc(list) {
            if (list[0].componentType == 27 || list[0].componentType == 15 || list[0].componentType == 13) {
                this.contentSelect = list[0].subtitle;
            } else {
                this.contentSelect = list[0].title;
            }
            this.data.subComponentId = list[0].componentId;
            this.showComponent = false;
        },
        // 隐藏选择组件弹窗
        cancelSelectComponent() {
            this.showComponent = false;
        },
        hideDialog() {
            this.showDialog = false;
            this.editDemoData.ordDemo = this.sourceDemo;
            setTimeout(() => {
                this.showPage = false;
                this.onhide();
            }, 300)
        },
        showMsg(msg, title) {
            if (title) {
                this.showAlertTitle = title;
            } else {
                this.showAlertTitle = '温馨提示';
            }
            this.showAlertMsg = msg;
            this.showAlert = true;
        },
        hideMsg() {
            this.showAlert = false;
            this.hideDialog();
        },

    },
    computed() {

    },
    created() {

    },
    watch: {
        show() {
            this.showPage = this.show;
            this.showDialog = this.show;
        },
        ordsubdemo() {
            this.editDemoData.ordDemo = this.ordsubdemo;
            this.sourceDemo = this.ordsubdemo;
        },
    },
    ready() {
        this.typesList = client.global.componentTypes;
        this.showPainListSelect = true;
        let dates = $("#createStartTimeOrder");
        dates.datepicker({
            dateFormat: "yy-mm-dd",
            timeFormat: 'HH:mm:ss',
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
    },
    beforeDestroy() {
        this.showPainListSelect = false;
    }
};
</script>