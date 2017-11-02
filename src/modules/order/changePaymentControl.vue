<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1200px'">
            <div slot="content">
                <div class="row nopadding col-md-12">
                    <div>
                        <h2>订单原价（不含运费）：{{editPaymentData.ordAmount}}元</h2>
                    </div>
                    <table class="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>商品</th>
                                <th>单价（元）</th>
                                <th>数量</th>
                                <th>小计（元）</th>
                                <th>总优惠金额</th>
                                <th>涨价或减价</th>
                                <th>运费（元）</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(index,itemDetail) in editPaymentData.orderDetailList" :key="index">
                                <td class="tdTitle" style="width:26%;">
                                    <p>
                                        <a target="_blank" :href="itemDetail.detailSpu.spuPic" title="查看大图">
                                            <img :src="itemDetail.detailSpu.spuPic" class="img-rounded" style="height:50px">
                                        </a>
                                    </p>
                                    <h4>{{itemDetail.detailSpu.spuName}}</h4>
                                    <p>{{itemDetail.detailSku.skuName}}</p>
                                    <!-- <p>SKU编码：{{itemDetail.detailSku.skuCode}}</p> -->
                                </td>
                                <td align="center" style="width:7%;vertical-align: middle;">
                                    {{itemDetail.ordOriginal}}
                                </td>
                                <td align="center" style="width:7%;vertical-align: middle;">
                                    {{itemDetail.ordSkuNum}}
                                </td>
                                <td align="center" style="width:7%;vertical-align: middle;">
                                    {{itemDetail.ordOriginal*itemDetail.ordSkuNum}}
                                </td>
                                <td align="center" style="width:12%;vertical-align: middle;">
                                    -{{getCampaignAmount(itemDetail)}}
                                </td>
                                <td align="center" style="width:12%;vertical-align: middle;">
                                    <input type="text" class="form-control" v-model="itemDetail.ordChangePrice" @blur="checkChangePrice(itemDetail)">
                                </td>
                                <td align="center" style="width:12%;vertical-align: middle;" :rowspan="editPaymentData.orderDetailList.length" v-if="index===0">
                                    <input type="text" class="form-control" v-model="editPaymentData.ordTransportAmount" @blur="checkTransportAmount(editPaymentData)">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="row nopadding col-md-12">
                        <div>
                            &nbsp;&nbsp;&nbsp;&nbsp;收货地址： {{ordAddress()}}
                        </div>
                        <div>
                            &nbsp;&nbsp;&nbsp;&nbsp;买家实付： {{calculateActAmount()}}{{actAmount()}}
                            <div>
                                &nbsp;&nbsp;&nbsp;&nbsp;买家实付 = 原价 - 总优惠金额 + 运费 + 总涨价或减价(涨价或减价：如果为减价，则需输入负值；如果为涨价,则需输入正值。)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="btnList">
                <button type="button" @click.stop="editActAmount" class="btn default blue">确定</button>
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
        <loading :show="isLoading"></loading>
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
            value: null,
        }
    },
    data() {
        return {
            editPaymentData: null,
            isLoading: false,
            showDialog: false,
            showPage: false,
            orderSubStatusList: [{ id: 6, name: '售后线下处理' }],
            componentShowOption: {},
            editStatusData: {
                "ordOrderId": 0,
                "ordStatus": 0,
            },
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '修改订单价格',
            changeDataList: [],
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
        //实付为0的商品进行手动改价,返回true,否则返回false; 
        isUnableChange(item) {
            let actDetail;
            actDetail = Number(item.ordOriginal) * Number(item.ordSkuNum) - Number(item.ordCampaignAmount)-Number(item.ordDiscount);
            return actDetail == 0 && item.ordChangePrice != 0;
        },
        //校验涨价减价
        checkChangePrice(item) {
            //实付为0的商品不得涨价或减价
            if (this.isUnableChange(item)) {
                this.$parent.showMsg("该商品实付金额为0元,不可手动改价");
                item.ordChangePrice = 0;
                return;
            }
            if (isNaN(item.ordChangePrice)) {
                alert("请输入不超过2位的金额");
                item.ordChangePrice = 0;
                return;
            }
            item.ordChangePrice = Number(item.ordChangePrice).toFixed(2);
            if (item.ordOriginal * item.ordSkuNum + Number(item.ordChangePrice) - item.ordShareAmount < 0) {
                this.$parent.showMsg("减价幅度不得大于需付价格");
                item.ordChangePrice = 0;
            }
            return;
        },
        //校验运费
        checkTransportAmount(item) {
            // if (!/^[0-9]*$/.test(item.ordTransportAmount) || item.ordTransportAmount < 0) {
            //     this.$parent.showMsg("请输入不小于0的数字");
            //     item.ordTransportAmount = 0;
            // }
            if (!/^[0-9]{1,8}([.]{1}[0-9]{1,2})?$/.test(item.ordTransportAmount) || item.ordTransportAmount < 0) {
                alert("请输入大于或等于0的2位金额");
            }
            return;
        },
        //提交修改
        editActAmount() {
            //校验数据
            this.checkTransportAmount(this.editPaymentData);
            for (let index = 0; index < this.editPaymentData.orderDetailList.length; index++) {
                let element = this.editPaymentData.orderDetailList[index];
                this.checkChangePrice(element);
            }
            client.postData(ORDER_EDIT_ACT_AMOUNT, this.editPaymentData).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    this.$parent.getList();
                    this.hideDialog();
                    this.$parent.showMsg("修改成功");
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
                this.showMsg(data.message);
            });
        },
        //计算实付款
        actAmount() {
            let changePriceSum = 0, totalCampaignAmount = 0, subActAmount;
            this.editPaymentData.orderDetailList.forEach(item => {
                let price = item.ordChangePrice == '' ? 0 : item.ordChangePrice;
                changePriceSum = Number(changePriceSum) + Number(price);
                totalCampaignAmount = Number(totalCampaignAmount) + Number(this.getCampaignAmount(item));
            });
            subActAmount = Number(this.editPaymentData.ordAmount) - Number(totalCampaignAmount) + Number(this.editPaymentData.ordTransportAmount) + Number(changePriceSum);
            return subActAmount.toFixed(2);
        },
        //获取改价字符串
        getChangePriceString() {
            let string = '', list = [], price = 0;
            this.editPaymentData.orderDetailList.forEach(item => {
                price = item.ordChangePrice == '' ? 0 : item.ordChangePrice;
                list.push(price);
                string = list.join("+");
            });
            return string;
        },
        //获取总优惠
        getTotalCampaignAmount() {
            let string = '', list = [], price = 0;
            this.editPaymentData.orderDetailList.forEach(item => {
                price = this.getCampaignAmount(item);
                price = price == "" ? 0 : price;
                list.push(price);
                string = list.join("+");
            });
            return string;
        },
        //计算商品优惠金额
        getCampaignAmount(item) {
            return Number(item.ordShareAmount) + Number(item.ordCampaignAmount) + Number(item.ordDiscount);
        },
        //计算买家实付算式
        calculateActAmount() {
            let amount = '', changePriceString = this.getChangePriceString(), ordCampaignShareAmount = this.getTotalCampaignAmount();
            amount = this.editPaymentData.ordAmount + "-(" + this.getTotalCampaignAmount() + ")+" + (this.editPaymentData.ordTransportAmount == '' ? 0 : this.editPaymentData.ordTransportAmount) +
                "+(" + changePriceString + ")=";
            return amount;
        },
        //显示收货信息
        ordAddress() {
            let orderSub = this.subData;
            return orderSub.ordReceiveProvince + " " + orderSub.ordReceiveCitity + " " + orderSub.ordReceiveArea + " " + orderSub.ordReceiveDetail
        },
        //选择下拉框
        selectComponentFunc(item) {
            this.editStatusData.ordStatus = item.id;
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
            this.editPaymentData = Object.assign({}, this.subData);
        },
    },
    ready() {
        this.typesList = client.global.componentTypes;
    },
    beforeDestroy() {

    }
};
</script>

