<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1200px'">
            <div slot="content">

            </div>
            <span slot="btnList">
                <button type="button" class="btn default" data-dismiss="modal">确定</button>
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
        <loading :show="isLoading"></loading>
    </div>
</template>
<script>
import client from '../../common/utils/client';
import { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList } from '../../components';
import loading from '../common/loading';
import { showSelectPic, getSelectPicList } from '../../vuex/actions/actions.resource';

export default {
    components: {
        selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList, loading,
    },
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
        setData: {
            type: Object,
            value: {}
        },
        subData: {
            type: Object,
            value: {}
        },
        progressObject: {
            width: '',
        }
    },
    data() {
        return {
            showOddDialog: false,
            destroyControlDialog: false,
            orderlog: [],
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
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '订单详情',
            showCampaignStatus: false,
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
        hideOddDialog(control) {
            this.showOddDialog = false;
            if (control) {
                setTimeout(() => {
                    //移除组件
                    this.destroyControlDialog = true;
                }, 100)
                setTimeout(() => {
                    //重新加入
                    this.destroyControlDialog = false;
                }, 200)
                //this.getList();
            }
        },
        //卖家改价
        changeTotal() {
            let total = 0;
            this.subData.orderDetailList.forEach(item => {
                total = total + item.ordChangePrice;
            });
            return total;
        },
        //弹出物流详情窗口
        showOdd() {
            this.showOddDialog = true
        },
        //隐藏优惠券信息
        hidePreferentialContent(event) {
            $("#PreferentialContent").hide()
        },
        //鼠标移至图标,显示优惠内容
        showPreferentialContent(event) {
            $("#PreferentialContent").show()
        },
        // //优惠券信息
        // showCompaign() {
        //     this.showCampaignStatus = !this.showCampaignStatus;
        // },
        //取消订单
        cancelOrder(itemSub) {
            this.$parent.cancelOrder(itemSub);
        },
        //修改价格
        editPayAmount(itemSub) {
            this.$parent.editPayAmount(itemSub);
        },
        //备注
        setDemo(orsId) {
            this.$parent.setDemo(orsId);
        },
        //加星
        setStar(data) {
            this.$parent.setStar(data);
        },
        //查看商品预览
        previewpro(data) {
            this.$parent.previewpro(data);
        },
        //进度条
        progressWidth() {
            let progress = this.subData.ordStatus;
            //console.log(progress)
            switch (progress) {
                case 0: this.progressObject.width = "25%"; return;
                case 1: this.progressObject.width = "50%"; return;
                case 2: this.progressObject.width = "75%"; return;
                case 3: this.progressObject.width = "100%"; return;
                default: ;
            }
        },
        //商品总件数
        totalNum() {
            let totalNum = 0;
            this.subData.orderDetailList.forEach(item => {
                totalNum += item.ordSkuNum;
            });
            return totalNum;
        },
        //商品限时折扣优惠
        detailCampaignAmount(itemDetail) {
            return (itemDetail.ordDiscount / itemDetail.ordSkuNum).toFixed(2);
        },
        //商品小计
        detailActAmount(itemDetail) {
            return (itemDetail.ordOriginal * itemDetail.ordSkuNum - itemDetail.ordDiscount).toFixed(2);
        },
        //显示支付状态
        payStatus(payStatus) {
            switch (payStatus) {
                case 0: return '未支付';
                case 1: return '支付成功';
                case 2: return '取消支付';
                case 3: return '无效订单';
                default: ;
            }
        },
        //显示收货信息
        ordAddress(orderSub) {
            return orderSub.ordReceiveProvince + " " + orderSub.ordReceiveCitity + " " + orderSub.ordReceiveArea + " " + orderSub.ordReceiveDetail +
                "," + orderSub.ordReceiveName + "," + orderSub.ordReceiveMobile
        },
        //显示配送方式
        ordLogiType(ordLogiType) {
            switch (ordLogiType) {
                case 1: return '快递发货';
                case 2: return '上门自提';
                default: ;
            }
        },
        //支付渠道显示
        ordPayChannel(payChannel) {
            switch (payChannel) {
                case 10:
                case 11:
                case 12: return '微信支付';
                case 20:
                case 21:
                case 22: return '支付宝支付';
                default: ;
            }
        },
        // 显示订单类型
        orderTypeDisplay(orderType) {
            switch (orderType) {
                case 0: return '跨境订单';
                case 1: return '普通订单';
                default: ;
            }
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
        hideAddDialog() {
            this.showDialog = false;
        },
        hideDialog() {
            this.showDemoDialog = false;
            this.showStatusDialog = false;
            this.showReasonDialog = false;
            setTimeout(() => {
                this.showPage = false;
                this.onhide();
            }, 300)
        },
        hideCampaignDialog() {
            this.showCampaignStatus = false;
            setTimeout(() => {
                this.showCampaignStatus = true;
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
        },
        clearInfo() {
            this.data = {
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
            }
            this.painIdsSelect = [];
        },
    },
    computed() {

    },
    created() {
    },
    watch: {
        subData(val) {
            client.postData(ODD_GET_ORDERSUBID + "?ordOrderId=" + val.ordOrderId, {}).then(data => {
                //console.log(val.ordOrderId)
                if (data.code == 200) {
                    if (data.data == null) {
                        this.orderlog = []
                    } else {
                        data.data.forEach((log, index) => {
                            this.orderlog.$set(index, log)
                        })
                    }
                }
            }, data => {
                this.showMsg("获取物流详情失败!" + data.message);
            })
        },
        show() {
            this.showPage = this.show;
            this.showDialog = this.show;
        },
        id() {
            this.data = {
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
            }
            this.painList = [];
            this.painIdsSelect = [];
            if (this.id == '') {
                this.title = '添加专家';
                setTimeout(() => {
                    this.typesList = client.global.componentTypes;
                }, 30)
                return;
            }
            this.title = '编辑专家';
            this.isLoading = true;
            this.painList = [];
            client.postData(AUTHOR_GET + '?componentId=' + this.id, {}).then(response => {
                this.isLoading = false;
                if (response.code == 200) {
                    let data = response.data;
                    if (data.painIds) {
                        data.painIds.forEach(item => {
                            this.painIdsSelect.push({ id: item, name: '' })
                        })
                        this.data.painIds = data.painIds;
                    }
                    if (data.painOptions) {
                        /*data.painOptions.forEach(item => {
                            this.painIdsSelect.push({ id: item, name: '' })
                        })*/
                        this.data.painOptions = data.painOptions;
                    }
                    /*"authorName": "",
                                    "authorTitle":"",
                                    "authorType":2,
                                    "bgUrl":"",
                                    "description":"",
                                    "halfFigure":"",
                                    "iconId":"",
                                    "iconUrl":"",
                                    "painIds":[],
                                    "painOptions":[]*/

                    this.data.authorId = data.authorId;
                    this.data.authorName = data.authorName;
                    this.data.authorTitle = data.authorTitle;
                    this.data.description = data.description;
                    this.data.iconUrl = data.iconUrl;
                    this.data.halfFigure = data.halfFigure;
                    this.data.bgUrl = data.bgUrl;
                    data.tags.forEach(item => {
                        item.id = item.tagId;
                        item.text = item.tagName;
                    })
                } else {
                    this.showMsg(response.msg);
                }
            }, data => {
                this.isLoading = false;
                this.showMsg(data.message);
            })
        }
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
<style>
.myBorder {
    border-top: 1px solid #000
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s
}

#PreferentialContent {
    border: 2px solid #CCCCCC;
    width: 300px;
    position: absolute;
    bottom: -10%;
    left: 70%;
    background-color: white;
    display: none;
}

#PreferentialContent td {
    background-color: white;
    border-right: 2px solid #D7D7D7;
    border-left: 2px solid #D7D7D7;
}
</style>