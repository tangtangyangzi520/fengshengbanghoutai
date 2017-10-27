<template>
    <div>
        <div class="page-bar min-bar">
            <page-title-bar v-show="showflag">
                <span slot="title">订单列表</span>
            </page-title-bar>
            <search :onchange="changeSearchOptions" :oncreate="getList" v-ref:search></search>
            <div class="col-md-12 left">
                <div class="col-md-4"></div>
                <div class="col-md-6">
                    <button class="btn blue" type="button" @click="getListByState(searchOptions.ordStatus)">筛选</button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <button class="btn blue" type="button" @click="exportOrder" v-if="limitResource.Order_export">批量导出</button>
                    <!-- <button class="btn blue" type="button" @click="showControlFunc(null,'rejectAll')">查看已生成报表</button> -->
                </div>
            </div>
            <form id="exportForm" method="POST">
                <input type="hidden" v-model="exportString" name="request">
            </form>
            <div class="col-md-12 contentOrderleft">
                <button class="btn default" :class="{'blue':checkedList[0]}" type="button" @click="getListByState(-1)">全部</button>
                <button class="btn default" :class="{'blue':checkedList[1]}" type="button" @click="getListByState(0)">待付款</button>
                <button class="btn default" :class="{'blue':checkedList[2]}" type="button" @click="getListByState(1)">待发货</button>
                <button class="btn default" :class="{'blue':checkedList[3]}" type="button" @click="getListByState(2)">已发货</button>
                <button class="btn default" :class="{'blue':checkedList[4]}" type="button" @click="getListByState(3)">已完成</button>
                <button class="btn default" :class="{'blue':checkedList[5]}" type="button" @click="getListByState(4)">已关闭</button>
                <button class="btn default" :class="{'blue':checkedList[6]}" type="button" @click="getListByState(5)">售后线下处理</button>
            </div>
        </div>
        <div class="contentOrderBlock" id="contentList">
            <div class="table-responsive col-md-12">
                <table class="table orderTable table-striped table-bordered table-hover">
                    <thead>
                        <tr style="background-color:rgba(215, 215, 215, 1);">
                            <th style="width:26%;">商品信息</th>
                            <th style="width:7%;">单价/数量</th>
                            <th style="width:7%;">下单时间</th>
                            <th style="width:7%;">订单状态</th>
                            <th style="width:7%;">买家</th>
                            <th style="width:15%;">实付款</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div class="table-responsive col-md-12" v-for="itemSet in dataList" :key="itemSet.orstNo">
                <div class="col-md-12" style="background-color:rgba(228, 228, 228, 1);height:30px;padding:7px 0;">
                    <div class="col-md-9">
                        <span style="color:green;">订单编号: {{itemSet.orstNo}}</span>
                        <span style="color:green;"> &nbsp;&nbsp;&nbsp;&nbsp; 支付流水号：{{itemSet.orsPayNum}}</span>
                        &nbsp;&nbsp;&nbsp;&nbsp; 付款时间：{{itemSet.orderSubList[0].ordPayTime}} &nbsp;&nbsp;&nbsp;&nbsp; 实付金额:{{itemSet.orsOpenPay.toFixed(2)}}元 &nbsp;&nbsp;&nbsp;&nbsp;
                        <span v-if="itemSet.orderSubList.length==1 && itemSet.orderSubList[0].ordOrderType==0" style="color:blue;">跨境订单</span>
                    </div>
                    <div v-show="showflag" class="col-md-3 right" v-if="itemSet.orderSubList.length == 1">
                        <a href="javascript:;" @click="showDetail(itemSet,itemSet.orderSubList[0])" v-if="limitResource.orderSeeDetails">查看详情</a>
                        <span v-if="limitResource.orderSeeDetails && limitResource.editOrderSetDemo">--</span>
                        <a href="javascript:;" @click="setDemo(itemSet.orderSubList[0])" v-if="limitResource.editOrderSetDemo">备注</a>
                        <span v-if="(limitResource.editOrderSetDemo && limitResource.addStar) || (limitResource.orderSeeDetails && limitResource.addStar)">--</span>
                        <a @click="setStar(itemSet.orderSubList[0])" v-if="limitResource.addStar && itemSet.orderSubList[0].ordStar<=0">加星</a>
                        <a style="font-size:15px;color:#ffcc00;text-decoration:none;" v-if="limitResource.addStar&&itemSet.orderSubList[0].ordStar>0" @click="setStar(itemSet.orderSubList[0])">
                            <span class="glyphicon glyphicon-star" aria-hidden="true"></span>
                            <span style="font-size:12px;color:#FF2D2D;position:relative;bottom:5px;">×{{itemSet.orderSubList[0].ordStar}}</span>
                        </a>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                </div>
                <table class="table orderTable table-striped table-bordered table-hover">
                    <tbody v-for="itemSub in itemSet.orderSubList" :key="itemSub.ordOrderNo">
                        <tr v-for="(index,itemDetail) in itemSub.orderDetailList" @click="selectItem(item)" :key="index">
                            <td class="tdTitle" style="width:26%;">
                                <p v-if="index===0 && itemSet.orderSubList.length>1">
                                    子订单号:{{itemSub.ordOrderNo}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span v-if="itemSub.ordOrderType==0" style="color:blue;">跨境订单</span>
                                </p>
                                <p>
                                    <a target="_blank" :href="itemDetail.detailSpu.spuPic" title="查看大图">
                                        <img :src="itemDetail.detailSpu.spuPic" class="img-rounded" style="height:50px">
                                    </a>
                                </p>
                                <h4>
                                    <a style="text-decoration:none;color:green;" title="预览商品" @click.stop="previewpro(itemDetail.detailSpu.spuId)">{{itemDetail.detailSpu.spuName}}</a>
                                </h4>
                                <p>
                                    <span style="color:black;">{{itemDetail.detailSku.skuName}}</span>
                                </p>
                                <p>
                                    <span style="color:black;">SKU编码：{{itemDetail.detailSku.skuCode}}</span>
                                </p>
                            </td>
                            <td align="center" style="width:7%;vertical-align:middle;">
                                <p style="padding-top:5px;">
                                    <span class=""> ¥ {{itemDetail.ordOriginal.toFixed(2)}}</span>
                                </p>
                                <p style="padding-top:5px;">
                                    <span class="">（{{itemDetail.ordSkuNum}}{{itemDetail.ordUnit}}）</span>
                                </p>
                            </td>
                            <td align="center" style="width:7%;" :rowspan="itemSub.orderDetailList.length" v-if="index===0">
                                {{itemSub.ordCreatedTime}}
                            </td>
                            <td align="center" style="width:7%;" :rowspan="itemSub.orderDetailList.length" v-if="index===0">
                                <!-- 订单状态 -->
                                {{itemSub.ordStatusDisplay}}
                                <p>
                                    <button type="button" @click.stop="cancelOrder(itemSub)" class="btn btn-xs blue" v-if="limitResource.cancelOrderSub && (itemSub.ordStatus==0) && showflag">取消订单</button>
                                </p>
                                <p>
                                    <button type="button" @click.stop="editStatus(itemSub)" class="btn btn-xs blue" v-if="limitResource.changeOrdStatus&&(itemSub.ordStatus==1||itemSub.ordStatus==2||itemSub.ordStatus==3)&&showflag">修改状态</button>
                                </p>
                            </td>
                            <td align="center" style="width:7%;" :rowspan="itemSub.orderDetailList.length" v-if="index===0">
                                <p>{{itemSet.orsMemberNickname}}</p>
                                <p>{{itemSub.ordReceiveName}}</p>
                                <p>{{itemSub.ordReceiveMobile}}</p>
                            </td>
                            <td align="center" style="width:15%;" :rowspan="itemSub.orderDetailList.length" v-if="index===0">
                                <p v-show="showflag" v-if="itemSet.orderSubList.length > 1">
                                    <a href="javascript:;" @click="showDetail(itemSet,itemSub)" v-if="limitResource.orderSeeDetails">查看详情</a>
                                    <span v-if="limitResource.orderSeeDetails && limitResource.editOrderSetDemo">--</span>
                                    <a href="javascript:;" @click="setDemo(itemSub)" v-if="limitResource.editOrderSetDemo">备注</a>
                                    <span v-if="(limitResource.editOrderSetDemo && limitResource.addStar) || 
                                                                                                               (limitResource.orderSeeDetails && limitResource.addStar)">--</span>
                                    <a @click="setStar(itemSub)" v-if="limitResource.addStar&&itemSub.ordStar<=0">加星</a>
                                    <a style="font-size:15px;color:#ffcc00;text-decoration:none;" v-if="limitResource.addStar&&itemSub.ordStar>0" @click="setStar(itemSub)">
                                        <span class="glyphicon glyphicon-star" aria-hidden="true"></span>
                                        <span style="font-size:12px;color:#FF2D2D;position:relative;bottom:5px;">×{{itemSub.ordStar}}</span>
                                    </a>
                                </p>
                                <p>¥ {{itemSub.ordActAmount.toFixed(2)}}</p>
                                <p>{{ordPayChannel(itemSet.orsPayChannel)}}</p>
                                <p>
                                    <button type="button" v-show="(itemSub.ordStatus==0)&&showflag" @click.stop="editPayAmount(itemSub)" class="btn btn-xs blue" v-if="limitResource.editActAmount">修改价格</button>
                                </p>
                            </td>
                        </tr>
                        <tr v-if="itemSub.ordDemo.length>0">
                            <td colspan="6" style="text-align:left;background-color:rgba(255, 204, 102, 1)">
                                卖家备注:{{itemSub.ordDemo}}
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-if="itemSet.buyerMessage.length>0">
                        <tr>
                            <td colspan="6" style="text-align:left;background-color:rgba(255, 204, 255, 1)">
                                买家备注:{{itemSet.buyerMessage}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="dataList.length==0" class="center" style="text-align:center">
                暂无数据
            </div>
        </div>
        <paging :current-page="page.currentPage" :page-size="page.pageSize" :start-index="page.startIndex" :total-page="page.totalPage" :total-size="page.totalSize" :change="getList"></paging>
        <!-- 创建订单详情弹窗 -->
        <order-control v-if="!destroyControlDialog" :id="orderEditId" :set-data="orderSetData" :sub-data="orderSubData" :show="showAddDialog" :onhide="hideAddDialog"></order-control>
        <!-- 创建订单备注弹窗 -->
        <demo-control v-if="!destroyControlDialog" :id="ordOrderId" :ordsubdemo="ordDemo" :show="showDemoDialog" :onhide="hideDemoDialog"></demo-control>
        <!-- 创建修改订单状态弹窗 -->
        <change-status-control v-if="!destroyControlDialog" :id="ordOrderId" :show="showStatusDialog" :onhide="hideStatusDialog"></change-status-control>
        <!-- 创建取消订单弹窗 -->
        <cancel-order-control v-if="!destroyControlDialog" :id="ordOrderId" :show="showReasonDialog" :onhide="hideReasonDialog" :send-req="reason"></cancel-order-control>
        <!-- 创建修改订单价格弹窗 -->
        <change-payment-control v-if="!destroyPaymentDialog" :sub-data="orderSubData" :show="showPaymentDialog" :onhide="hidePaymentDialog"></change-payment-control>
        <!-- 测试选择商品弹窗 -->
        <select-spu v-if="!destroyControlDialog" :show="showSpuDialog" :onhide="hideAddDialog" @spu-data="getSelected"></select-spu>
        <!--加星-->
        <star v-if="!destroyControlDialog" :id="ordOrderId" :starnum="ordStar" :show="showStarDialog" :onhide="hideStarDialog"></star>
        <!-- 创建预览商品弹窗 -->
        <preview v-if="!destroyControlDialog" :id="expertEditId" :show="showpreDialog" :onhide="hidePreDialog" :pspuid="lspuid" :pflag="lflag" :imgflag="limgflag"></preview>

        <m-alert :title="'提交'" :show-cancel-btn="true" :show="showSubmitDialog" :onsure="ajaxControl" :onhide="hideMsg">
            <div slot="content">确定提交吗？</div>
        </m-alert>
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
        <control :show="showControl" :items="clickItems" :onhide="hideControlFunc" :type="controlType"></control>
        <loading :show="isLoading"></loading>
    </div>
</template>
<script>
import client from '../../common/utils/client';
import { pageTitleBar, paging, itemControl, mMultiSelect, mAlert, mSelect } from '../../components';
import search from './search';
import control from '../common/control';
import loading from '../common/loading';
import selectSpu from '../common/selectSpu';
import orderControl from './orderControl';
import demoControl from './demoControl';
import changeStatusControl from './changeStatusControl';
import cancelOrderControl from './cancelOrderControl';
import changePaymentControl from './changePaymentControl';
import preview from '../productManage/preview';
import star from './star';
let vueThis = null;
export default {
    components: {
        pageTitleBar, paging, itemControl, mAlert, mMultiSelect, mSelect, search, control,
        loading, orderControl, demoControl, changeStatusControl, cancelOrderControl, changePaymentControl, selectSpu, preview, star,
    },
    props: {
        title: '',
        ospuid: 0,
        oflag: false,
        ooflag: false,
        show: {
            type: Boolean,
            value: false
        },
        onhide: {
            type: Function,
            value: () => { }
        },
    },
    data() {
        return {
            showflag: true,
            limgflag: false,
            lspuid: 0,
            lflag: false,
            exportString: '',
            reason: false,
            isLoading: false,
            countDesc: '',  //数据统计
            dataList: [],
            page: {},   // 分页请求数据
            showAlert: false,
            showAddDialog: false,
            showDemoDialog: false,
            showStarDialog: false,
            showStatusDialog: false,
            showReasonDialog: false,
            showPaymentDialog: false,
            showpreDialog: false,
            showSpuDialog: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            limitResource: null, //发布状态
            clickItems: [],   //点击操作的数据项
            controlType: '',  //当前操作的权限类型
            showControl: false, //显示操作弹窗
            destroyControlDialog: false, //注销良言操作弹框
            destroyPaymentDialog: false,
            orderEditId: '',
            orderSetData: null,
            orderSubData: null,
            orsId: 0,
            ordOrderId: 0,
            ordStar: 0,
            ordDemo: "",
            testSelectedSpu: [],
            checkedList: [true, false, false, false, false, false, false],//用来使被选中标签高亮

        }
    },
    computed: {
        selectItems() {
            let list = [];
            this.dataList.forEach(item => {
                item.checked && list.push(item);
            })
            return list;
        },
    },
    filters: {
        filterStatus(id) {
            return client.global.componentStatus.find(item => item.id == id).name;
        },
        filterTime(time) {
            return client.formateTime(time);
        }
    },
    methods: {
        clearSearchOptions() {
            this.$refs.search.clearOptions()
            //console.log(this.$refs.search)
        },
        //得到选择的商品
        getSelected(data) {
            this.testSelectedSpu = data;
        },
        //选择商品
        selectSpu() {
            this.showSpuDialog = true;
        },
        //导出订单
        exportOrder() {
            this.searchOptions.ordSpuId = this.ospuid;
            $("#exportForm").attr("action", ORDER_EXPORT);
            $("input[name='request']").val(JSON.stringify(this.searchOptions));
            $("#exportForm").submit();
        },
        //修改订单状态弹窗
        editStatus(itemSub) {
            this.ordOrderId = itemSub.ordOrderId;
            this.showStatusDialog = true;
        },
        //取消订单
        cancelOrder(itemSub) {
            this.ordOrderId = itemSub.ordOrderId;
            this.reason = !this.reason;
            this.showReasonDialog = true;
        },
        //修改价格
        editPayAmount(itemSub) {
            this.orderSubData = itemSub;
            this.showPaymentDialog = true;
        },
        //备注
        setDemo(data) {
            this.ordOrderId = data.ordOrderId;
            this.ordDemo = data.ordDemo;
            this.showDemoDialog = true;
        },
        //加星
        setStar(data) {
            //console.log(data);
            this.ordOrderId = data.ordOrderId;
            this.ordStar = data.ordStar
            this.showStarDialog = true;
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
        //通过点击订单状态查询订单列表
        getListByState(num) {
            for (let index = 0; index < this.checkedList.length; index++) {//被选中标签高亮
                if (index == num + 1) {
                    this.checkedList.splice(index, 1, true);
                } else {
                    this.checkedList.splice(index, 1, false);
                }
            }
            this.checkedbtn = num;
            this.searchOptions.ordStatus = num;
            this.getList(false, true);
        },
        //点击查看详情
        showDetail(itemSet, itemSub) {
            this.orderSetData = itemSet;
            this.orderSubData = itemSub;
            this.showAddDialog = true;
        },
        //商品那边的方法
        hideDialog() {
            this.showDialog = false;
            setTimeout(() => {
                this.showPage = false;
                this.onhide();
            }, 300)
        },
        //预览商品
        previewpro(val) {
            this.lspuid = val
            this.limgflag = !this.limgflag
            this.lflag = !this.lflag
            this.showpreDialog = true;
        },
        hideAddDialog(control) {
            this.expertEditId = '';
            this.showAddDialog = false;
            if (control && control == 'create') {
                this.showMsg('保存成功');
            }
            if (control && control == 'update') {
                this.showMsg('更新成功');
            }
            if (control) {
                setTimeout(() => {
                    //移除组件
                    this.destroyControlDialog = true;
                }, 100)
                setTimeout(() => {
                    //重新加入
                    this.destroyControlDialog = false;
                }, 200)
                this.getList();
            }
        },
        hidePreDialog() {
            this.showpreDialog = false
            setTimeout(() => {
                this.onhide('cancel');
            }, 300)
        },
        hideDemoDialog() {
            this.showDemoDialog = false
            setTimeout(() => {
                this.onhide('cancel');
            }, 300)
        },
        hideStatusDialog() {
            this.showStatusDialog = false
            setTimeout(() => {
                this.onhide('cancel');
            }, 300)
        },
        hideReasonDialog() {
            this.showReasonDialog = false
            setTimeout(() => {
                this.onhide('cancel');
            }, 300)
        },
        hidePaymentDialog() {
            this.showPaymentDialog = false
            this.getList();
        },
        hideStarDialog() {
            this.showStarDialog = false
            setTimeout(() => {
                this.onhide('cancel');
            }, 300)
        },
        // 搜索条件变化
        changeSearchOptions(options) {
            this.searchOptions = options;
        },
        hideControlFunc(type) {
            if (type == 'success') {
                this.getList();
            }
            this.showControl = false;
        },
        //数据校验
        checkOptions() {
            if (this.searchOptions.lowOrsOpenPay) {
                if (!/^[0-9]{1,8}([.]{1}[0-9]{1,2})?$/.test(this.searchOptions.lowOrsOpenPay) || this.searchOptions.lowOrsOpenPay < 0) {
                    alert("实付金额请输入不小于0的整数");
                    return false;
                }
            }
            if (this.searchOptions.highOrsOpenPay) {
                if (!/^[0-9]{1,8}([.]{1}[0-9]{1,2})?$/.test(this.searchOptions.highOrsOpenPay) || this.searchOptions.highOrsOpenPay < 0) {
                    alert("实付金额请输入不小于0的整数");
                    return false;
                }
            }
            return true;
        },
        getList(page, firstSearch) {
            let options, url = ORDER_GET_LIST;
            //数据校验
            if (!this.checkOptions()) return;
            if (!firstSearch) {
                // 拿最后一次请求的参数
                options = this.lastSearchOptions;
            } else {
                options = Object.assign({}, this.searchOptions);
            }
            if (page) {
                options.page = page;
            }
            options.ordSpuId = this.ospuid
            this.exportString = JSON.stringify(options);
            this.isLoading = true;
            this.dataList = [];
            this.lastSearchOptions = options;
            // 统计数据
            this.getCount(options);
            options.componentType = [12];
            client.postData(url, options).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    data.data.forEach(item => {
                        item.checked = false;
                    })
                    this.dataList = data.data;
                    this.page = data.page;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
            })
        },
        getCount(options) {
            options.componentType = [12];
            client.postData(COMPONENT_ARTICLE_COUNTER, options).then(data => {
                if (data.code == 200) {
                    this.countDesc = data.data;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
            })
        },
        selectAll() {
            this.dataList.forEach(item => {
                item.checked = true;
            })
        },
        reverseList() {
            this.dataList.forEach(item => {
                item.checked = !item.checked;
            })
        },
        selectItem(item) {
            //item.checked = !item.checked;
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
            this.showAddDialog = false
        }
    },
    created() {
        vueThis = this;
        this.limitResource = JSON.parse(localStorage.getItem('limitResource'));
    },
    watch: {
        ooflag() {
            this.showflag = true
        },
        oflag() {
            // alert(this.ospuid)
            this.showflag = false
            this.getList(false, true)
        },
        show() {
            this.showPage = this.show
            this.showDialog = this.show
        },
    },
    route: {
        canReuse: () => {
            vueThis.getList(false, true);
        }
    },
    ready() {
        client.resetListHeight();
    }
};
</script>

<style lang="less">
@import "../../common/css/common.less";
@import "../../common/css/list.less";
.contentOrderBlock {
    overflow: auto;
    border: none;
    margin-top: 0px;
}

.contentOrderleft {
    position: relative;
    min-height: 1px;
    padding-left: 6px;
    padding-right: 15px;
}

.orderTable {
    width: 100%;
    margin-bottom: 8px;
}
</style>