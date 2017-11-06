<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'800px'">
            <div slot="content">
                <div class="col-md-12" style="padding-bottom:5px;">
                    <div class="col-md-2">收货地址:</div>
                    <div class="col-md-10">{{ordAddress()}}</div>
                </div>
                <div class="col-md-12" style="padding-bottom:5px;">
                    <div class="col-md-2">发货方式:</div>
                    <div class="col-md-10">
                        <input type="radio" checked>物流发货
                    </div>
                </div>
                <div class="col-md-12" style="padding-bottom:5px;">
                    <div class="col-md-2">物流公司:</div>
                    <div class="col-md-4">
                        <m-select :data="logiCompanyList" :placeholder="'请选择内容'" :change-func="selectLogiCompanyFunc" :class="'fixedIcon'"></m-select>
                    </div>
                    <div class="col-md-2">快递单号:</div>
                    <div class="col-md-4">
                        <input type="text" v-model="orderSub.ordLogiName">
                    </div>
                </div>
            </div>
            <span slot="btnList">
                <button type="button" @click.stop="deliver" class="btn default blue">提交</button>
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
            logiCompanyList: [],//物流公司列表
            orderSub:{
                "ordOrderId":"",
                "ordLogiCompany":"",
                "ordLogiName":""
            }
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
        deliver() {
            //参数校验
            console.log(this.orderSub.ordLogiCompany);
            if (this.orderSub.ordLogiCompany==null||this.orderSub.ordLogiCompany === "") {
                alert("请选择物流公司");
                return;
            }
            if (this.orderSub.ordLogiName === "") {
                alert("请填写快递单号");
                return;
            }
            client.postData(ORDER_DELIVER, this.orderSub).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    this.showMsg(data.msg);
                    this.$parent.getList(false, true);
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
                this.showMsg(data.message);
            });
        },
        //获取物流公司列表
        getLogiCompanyList() {
            client.postData(ORDER_GET_LOGI_COMPANY, {}).then(data => {
                if (data.code == 200) {
                    this.logiCompanyList = data.data;
                }
            }, data => {
            });
        },
        //选择物流公司回调
        selectLogiCompanyFunc(item) {
            this.orderSub.ordLogiCompany = item.id;
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
            this.orderSub.ordOrderId=this.subData.ordOrderId;
            this.getLogiCompanyList();
        },
        ordsubdemo() {
            this.editDemoData.ordDemo = this.ordsubdemo;
            this.sourceDemo = this.ordsubdemo;
        },
    },
    ready() {
        this.typesList = client.global.componentTypes;
        this.showPainListSelect = true;
    },
    beforeDestroy() {
        this.showPainListSelect = false;
    }
};
</script>