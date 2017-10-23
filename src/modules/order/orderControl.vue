<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1200px'">
            <div slot="content">
                <div class="row nopadding">
                    <!-- 订单进度条 -->
                    <div class="col-md-12 myBorder" v-if="this.subData.ordStatus==0||this.subData.ordStatus==1||this.subData.ordStatus==2||this.subData.ordStatus==3">
                        </br>
                        <div class="col-md-12">
                            <div class="col-md-3" style="text-align:center;">
                                <span style="color:blue;">买家下单</span>
                            </div>
                            <div class="col-md-3" style="text-align:center;">
                                <span style="color:blue;" v-if="this.subData.ordStatus==1||this.subData.ordStatus==2||this.subData.ordStatus==3">买家付款</span>
                                <span v-else> 买家付款</span>
                            </div>
                            <div class="col-md-3" style="text-align:center;">
                                <span style="color:blue;" v-if="this.subData.ordStatus==2||this.subData.ordStatus==3">商家发货</span>
                                <span v-else> 商家发货</span>
                            </div>
                            <div class="col-md-3" style="text-align:center;">
                                <span style="color:blue;" v-if="this.subData.ordStatus==3">交易完成</span>
                                <span v-else> 交易完成</span>
                            </div>
                        </div>
                        </br>
                        </br>
                        <!-- 进度条start -->
                        <div class="col-md-12" v-if="this.subData.ordStatus==0">
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:25%;">
                                    <span class="sr-only"></span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12" v-if="this.subData.ordStatus==1">
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:50%;">
                                    <span class="sr-only"></span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12" v-if="this.subData.ordStatus==2">
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:75%;">
                                    <span class="sr-only"></span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12" v-if="this.subData.ordStatus==3">
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:100%;">
                                    <span class="sr-only"></span>
                                </div>
                            </div>
                        </div>
                        <!-- 进度条end -->
                        <!-- 具体时间 -->
                        <div class="col-md-12">
                            <div class="col-md-3" style="text-align:center;">
                                {{subData.ordCreatedTime}}
                            </div>
                            <div class="col-md-3" style="text-align:center;">
                                <span v-if="this.subData.ordStatus==1||this.subData.ordStatus==2||this.subData.ordStatus==3"> {{subData.ordPayTime}}</span>
                            </div>
                            <div class="col-md-3" style="text-align:center;">
                                <span v-if="this.subData.ordStatus==2||this.subData.ordStatus==3">{{subData.ordLogiTime}}</span>
                            </div>
                            <div class="col-md-3" style="text-align:center;">
                                <span v-if="this.subData.ordStatus==3">{{subData.completeTime}}</span>
                            </div>
                            </br>
                            </br>
                        </div>
                    </div>
                    <!-- 订单信息 -->
                    <div class="col-md-12">
                        <div class="col-md-6 myBorder">
                            <div class="col-md-12">
                                <div class="col-md-6">
                                    <h4>订单信息</h4>
                                </div>
                                <div class="col-md-6 right">
                                    担保交易
                                </div>
                            </div>
                            <table class="table table-bordered table-hover">
                                <tr>
                                    <td width="30%">订单编号: </td>
                                    <td width="70%">{{subData.ordOrderNo}}</td>
                                </tr>
                                <tr>
                                    <td width="30%">订单类型: </td>
                                    <td width="70%">{{orderTypeDisplay(subData.ordOrderType)}}</td>
                                </tr>
                                <tr>
                                    <td width="30%">付款方式: </td>
                                    <td width="70%">{{ordPayChannel(setData.orsPayChannel)}}</td>
                                </tr>
                                <tr>
                                    <td width="30%">买家昵称: </td>
                                    <td width="70%">{{setData.orsMemberNickname}}</td>
                                </tr>
                                <tr v-if="subData.ordMemberName.length >0">
                                    <td width="30%">姓名: </td>
                                    <td width="70%">{{subData.ordMemberName}}</td>
                                </tr>
                                <tr v-if="subData.ordMemberIdentity.length >0">
                                    <td width="30%">身份证号: </td>
                                    <td width="70%">{{subData.ordMemberIdentity}}</td>
                                </tr>
                                <tr>
                                    <td width="30%">配送方式: </td>
                                    <td width="70%">{{ordLogiType(subData.ordLogiType)}}</td>
                                </tr>
                                <tr>
                                    <td width="30%">收货信息: </td>
                                    <td width="70%">{{ordAddress(subData)}}</td>
                                </tr>
                                <tr>
                                    <td width="30%">买家留言: </td>
                                    <td width="70%">{{setData.buyerMessage}}</td>
                                </tr>
                            </table>
                        </div>

                        <div class="col-md-6 myBorder">
                            <h4>订单状态:
                                <span v-if="subData.ordStatus==0">&nbsp;&nbsp;商品已拍下,等待买家付款 </span>
                                <span v-if="subData.ordStatus==1">&nbsp;&nbsp;买家已付款,等待商家发货 </span>
                                <span v-if="subData.ordStatus==2">&nbsp;&nbsp;商家已发货,等待交易成功 </span>
                                <span v-if="subData.ordStatus==3">&nbsp;&nbsp;交易完成 </span>
                                <span v-if="subData.ordStatus==4">&nbsp;&nbsp;交易关闭 </span>
                            </h4>
                            <div v-if="subData.ordStatus==0">如买家未在规定时间内付款,订单将按照设置逾期自动关闭;</div>
                            <div v-if="subData.ordStatus==1">买家已付款至你的财付通账户,请尽快发货,否则买家有权申请退款;</div>
                            <div v-if="subData.ordStatus==2">买家如在
                                <span style="color:red;">7天内</span>没有申请退款,交易将自动完成;</div>
                            <div v-if="subData.ordStatus==3">
                                </br>
                            </div>
                            <div v-if="subData.ordStatus==4">{{subData.ordCancelReason}}</br>
                                </br>
                            </div>
                            <div>
                                <a @click.stop="setDemo(subData)">备注</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <a @click.stop="setStar(subData)">加星</a>
                                <p>
                                    <button type="button" v-show="(subData.ordStatus==0)" @click.stop="editPayAmount(subData)" class="btn btn-xs blue">修改价格</button>
                                    <button type="button" v-show="(subData.ordStatus==0)" @click.stop="cancelOrder(subData)" class="btn btn-xs blue">取消订单</button>
                                </p>

                            </div>
                        </div>
                    </div>

                    <div class="col-md-12 myBorder" v-if="subData.ordStatus!=0 && subData.ordStatus!=4">
                        <table class="table table-bordered table-hover">
                            <tr>
                                <th style="width:30%;">订单号 | 交易单号 | 支付方式</th>
                                <th style="width:20%;">付款人及留言</th>
                                <th style="width:20%;">付款时间</th>
                                <th style="width:10%;">实收（元）</th>
                                <th style="width:10%;">状态</th>
                            </tr>
                            <tr>
                                <td width="20%">
                                    <p>{{subData.ordOrderNo}}</p>
                                    <p>{{setData.orsPayNum}}</p>
                                    <p>{{ordPayChannel(setData.orsPayChannel)}}</p>
                                </td>
                                <td width="20%" align="center" style="vertical-align:middle;">{{setData.orsMemberNickname}}:{{setData.buyerMessage.length>0?setData.buyerMessage:'无'}}</td>
                                <td width="20%" align="center" style="vertical-align:middle;">{{subData.ordPayTime}}</td>
                                <td width="20%" align="center" style="vertical-align:middle;">{{subData.ordActAmount.toFixed(2)}}</td>
                                <td width="20%" align="center" style="vertical-align:middle;">{{payStatus(setData.orsPayStatus)}}</td>
                            </tr>
                            <tr>
                                <td colspan="5" style="text-align:left">累计收款：&nbsp;&nbsp;{{subData.ordActAmount.toFixed(2)}}元&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 实收款：&nbsp;&nbsp;{{subData.ordActAmount.toFixed(2)}}元</td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-md-12">
                        <table class="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style="width:26%;">商品信息</th>
                                    <th style="width:7%;">单价(元)</th>
                                    <th style="width:7%;">数量</th>
                                    <th style="width:10%;">优惠(元)</th>
                                    <th style="width:10%;">小计(元)</th>
                                    <th style="width:10%;">状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colspan="6" style="text-align:left">
                                        <span style="font-weight:bold;">包裹-1</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{subData.ordLogiCompany}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 运单号：&nbsp;{{subData.ordLogiName}}
                                        <span v-if="orderlog.length >0" style="margin-left:5%">{{orderlog[0].oddTime}}&nbsp;[{{orderlog[0].oddStatus}}]&nbsp;{{orderlog[0].oddContent}}</span>
                                        <a v-if="orderlog.length >0" style="text-decoration:none;margin-left:3%" @click="showOdd()">更多</a>
                                    </td>
                                </tr>
                                <tr v-for="(index,itemDetail) in subData.orderDetailList">
                                    <td class="tdTitle" style="width:26%;">
                                        <p>商品编码:{{itemDetail.detailSku.skuCode}}</p>
                                        <p>
                                            <a target="_blank" :href="itemDetail.detailSpu.spuPic" title="查看大图">
                                                <img :src="itemDetail.detailSpu.spuPic" class="img-rounded" style="height:50px">
                                            </a>
                                        </p>
                                        <h4>
                                            <a style="text-decoration:none;" title="预览商品" @click.stop="previewpro(itemDetail.detailSpu.spuId)">{{itemDetail.detailSpu.spuName}}</a>
                                        </h4>

                                        <p>发货地: 需要提供发货地</p>
                                        <p>规格: {{itemDetail.detailSku.skuName}}</p>
                                    </td>
                                    <td align="center" style="width:7%;vertical-align:middle;">
                                        {{itemDetail.ordOriginal.toFixed(2)}}
                                    </td>
                                    <td align="center" style="width:7%;vertical-align:middle;">
                                        {{itemDetail.ordSkuNum}}
                                    </td>
                                    <td align="center" style="width:10%;vertical-align:middle;">
                                        <!-- 优惠 -->
                                        {{detailCampaignAmount(itemDetail)}}
                                    </td>
                                    <td align="center" style="width:10%;vertical-align:middle;">
                                        <!-- 小计 -->
                                        {{detailActAmount(itemDetail)}}
                                    </td>
                                    <td align="center" style="width:10%;vertical-align:middle;">
                                        {{subData.ordStatusDisplay}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="right">
                            订单共{{totalNum()}}件商品，总计：¥{{subData.ordActAmount}}（含运费 ￥{{subData.ordTransportAmount}}）
                            <!-- <div style="width:50px;" @mouseenter.stop="showCompaign" @mouseleave.stop="showCompaign">
                                                                            <span class="glyphicon glyphicon-exclamation-sign" style="color:blue;" aria-hidden="true"></span>
                                                                        </div> -->
                            <img style="" @mouseout="hidePreferentialContent($event)" @mouseover="showPreferentialContent($event)" src="u7027.jpg">
                            <table class="table table-striped table-bordered table-hover" id="PreferentialContent">
                                <thead>
                                    <tr style="background-color:#F2F2F2;height:40px;">
                                        <th style="width:65%;text-align:center;border-right:none;border-left:none; ">包含以下抵扣方式</th>
                                        <th style="width:35%;text-align:center;border-right:none;border-left:none;">金额（元）</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in subData.orderDetailList" style="border-bottom:2px solid #D7D7D7;height:40px;" v-if="detailCampaignAmount(item)>0">
                                        <td style="width:65%;text-align:center;vertical-align:middle;font-family: 'Arial Normal', 'Arial';font-weight: 100;font-style: normal;border-right:none;border-left:none;">
                                            {{item.ordCampaign.mkcName}} <br>
                                            <span v-if="item.ordCampaign.mkcRemark">({{item.ordCampaign.mkcRemark}})</span>
                                        </td>
                                        <td style="width:35%;text-align:center;vertical-align:middle;border-left:2px solid #D7D7D7;">
                                            -{{detailCampaignAmount(item)}}
                                        </td>
                                    </tr>
                                    <tr v-if="subData.ordCampaignShareAmount >0">
                                        <td style="width:65%;text-align:center;vertical-align:middle;font-family: 'Arial Normal', 'Arial';font-weight: 100;font-style: normal;border-right:none;border-left:none;">
                                            {{setData.orsCampaign.mkcName}} <br>
                                            <span v-if="setData.orsCampaign.mkcRemark">({{setData.orsCampaign.mkcRemark}})</span>
                                        </td>
                                        <td style="width:35%;text-align:center;vertical-align:middle;border-left:2px solid #D7D7D7;">
                                            -{{subData.ordCampaignShareAmount}}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="width:65%;text-align:center;vertical-align:middle;font-family: 'Arial Normal', 'Arial';font-weight: 100;font-style: normal;border-right:none;border-left:none;">
                                            卖家改价
                                        </td>
                                        <td style="width:35%;text-align:center;vertical-align:middle;border-left:2px solid #D7D7D7;">
                                            {{changeTotal()}}
                                        </td>
                                    </tr>
                                    <tr v-if="subData.orderDetailList.length==0">
                                        <td colspan="2">暂无数据</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="btnList">
                <button type="button" class="btn default" data-dismiss="modal">确定</button>
            </span>
        </m-alert>
        <!-- 优惠信息气泡 -->
        <odd-log-detail v-if="!destroyControlDialog" :show="showOddDialog" :onhide="hideOddDialog" :orderlogdetail="orderlog"></odd-log-detail>
        <campaign-control v-if="!destroyControlDialog" :show="showCampaignStatus" :onhide="hideCampaignDialog"></campaign-control>
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
import campaignControl from './campaignControl';
import oddLogDetail from './oddLogDetail';

export default {
    components: {
        selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList, loading, campaignControl, oddLogDetail
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
            console.log(progress)
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
                console.log(val.ordOrderId)
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