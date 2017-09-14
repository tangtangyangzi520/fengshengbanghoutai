<template>
    <div>
        <div class="page-bar min-bar">
            <page-title-bar>
                <span slot="title">订单管理{{countDesc}}</span>
            </page-title-bar>
            <search :onchange="changeSearchOptions" :oncreate="getList"></search>
            <div class="col-md-12 right">
                <button class="btn blue" type="button" @click="getList(false,true)">筛选</button>
                <button class="btn yellow-crusta" type="button" @click="exportOrder">批量导出</button>
<!--                 <button class="btn yellow-crusta" type="button" @click="selectSpu" >选择商品</button>
 -->                <!-- <button class="btn purple" type="button" @click="showControlFunc(null,'rejectAll')">查看已生成报表</button> -->
        

            </div>
            <form id="exportForm" method="POST">
                <input type="hidden" v-model="exportString" name="request">
            </form>
            <div class="col-md-12">
                <button class="btn blue" type="button" @click="getListByState(-1)">全部</button>
                <button class="btn default" type="button" @click="getListByState(0)">待付款</button>
                <button class="btn default" type="button" @click="getListByState(1)">待发货</button>
                <button class="btn default" type="button" @click="getListByState(2)">已发货</button>
                <button class="btn default" type="button" @click="getListByState(3)">已完成</button>
                <button class="btn default" type="button" @click="getListByState(4)">已关闭</button>
                <button class="btn default" type="button" @click="getListByState(5)">已取消</button>
                <button class="btn default" type="button" @click="getListByState(6)">售后线下处理</button>
            </div>
            <div style="height:5px;clear:both;"></div>
        </div>
        <div class="contentBlock" id="contentList">
            <div class="table-responsive col-md-12">
                <table class="table table-striped table-bordered table-hover" >
                    <thead>
                        <tr>
                            <th style="width:26%;">商品信息</th>
                            <th style="width:7%;">单价/数量</th>
                            <th style="width:7%;">下单时间</th>
                            <th style="width:10%;">订单状态</th>
                            <th style="width:10%;">买家</th>
                            <th style="width:10%;">实付款</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div class="table-responsive col-md-12" v-for="itemSet in dataList" :key="itemSet.orstNo">
                <div>订单编号: {{itemSet.orstNo}} &nbsp;&nbsp;&nbsp;&nbsp;    
                支付流水号：需要支付接口提供数据 &nbsp;&nbsp;&nbsp;&nbsp;   
                付款时间：{{itemSet.orderSubList[0].ordPayTime}} &nbsp;&nbsp;&nbsp;&nbsp;
                实付金额:{{itemSet.orsOpenPay}}元 &nbsp;&nbsp;&nbsp;&nbsp;
                 
                <a href="javascript:;" @click="setDemo(itemSet.orsId)">备注</a>
                 <!-- --<a href="javascript:;">加星</a> -->
                
                </div>
                <table class="table table-striped table-bordered table-hover" >
                    <tbody v-for="itemSub in itemSet.orderSubList" :key="itemSub.ordOrderNo">
                        <tr v-for="(index,itemDetail) in itemSub.orderDetailList" @click="selectItem(item)" :key="index">
                            <td class="tdTitle" style="width:26%;">
                                <p v-if="index===0 && itemSet.orderSubList.length>1">子订单号:{{itemSub.ordOrderNo}}&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;" @click="showDetail(itemSet,itemSub)">查看详情</a></p>
                                <p>
                                    <a target="_blank" :href="itemDetail.detailSpu.spuPic" title="查看大图">
                                        <img :src="itemDetail.detailSpu.spuPic" class="img-rounded" style="height:50px">
                                    </a>
                                </p>
                                <h4>{{itemDetail.detailSpu.spuName}}</h4>
                                <p>{{itemDetail.detailSku.skuName}}</p>
                                <p>SKU编码：{{itemDetail.detailSku.skuCode}}</p>
                            </td>
                            <td align="center"  style="width:7%;vertical-align:middle;">
                                <p style="padding-top:5px;">
                                    <span  class=""> ¥ {{itemDetail.ordOriginal}}</span>
                                </p>
                                <p style="padding-top:5px;">
                                    <span class="">（{{itemDetail.ordSkuNum}}{{itemDetail.ordUnit}}）</span>
                                </p>
                            </td>
                            <td align="center" style="width:7%;" :rowspan="itemSub.orderDetailList.length" v-if="index===0">

                               {{itemSub.ordCreatedTime}}
                            </td>
                            <td align="center" style="width:10%;" :rowspan="itemSub.orderDetailList.length" v-if="index===0">
                                <!-- 订单状态 -->
                                {{itemSub.ordStatusDisplay}}
                                <p><button type="button" v-show="(itemSub.ordStatus==0)" @click.stop="cancelOrder(itemSub)" class="btn btn-xs blue">取消订单</button></p>
                                <p><button type="button" v-show="(itemSub.ordStatus==1||itemSub.ordStatus==2||itemSub.ordStatus==3)" @click.stop="editStatus(itemSub)" class="btn btn-xs blue">修改状态</button></p>
                                </td>
                            <td align="center" style="width:10%;" :rowspan="itemSub.orderDetailList.length" v-if="index===0">
                                <p>{{itemSub.ordMemberId}}</p>
                                <p>{{itemSub.ordReceiveName}}</p>
                                <p>{{itemSub.ordReceiveMobile}}</p>
                            </td>
                            <td align="center" style="width:10%;" :rowspan="itemSub.orderDetailList.length" v-if="index===0">
                                <p>¥ {{itemSub.ordActAmount}}</p>
                                <p>{{ordPayChannel(itemSet.orsPayChannel)}}</p>
                                <p><button type="button" v-show="(itemSub.ordStatus==0)" @click.stop="editPayAmount(itemSub)" class="btn btn-xs blue">修改价格</button></p>
                            </td>
                        </tr>
                    </tbody>
                    </tbody>
                </table>
            </div>
            <div v-if="dataList.lenth==0" class="center">
                暂无数据
            </div>
        </div>
        <paging :current-page="page.currentPage" :page-size="page.pageSize" :start-index="page.startIndex" :total-page="page.totalPage" :total-size="page.totalSize" :change="getList"></paging>
        <!-- 创建订单详情弹窗 -->
        <order-control v-if="!destroyControlDialog" :id="orderEditId" :set-data="orderSetData" :sub-data="orderSubData" :show="showAddDialog" :onhide="hideAddDialog" ></order-control>
        <!-- 创建订单备注弹窗 -->
        <demo-control v-if="!destroyControlDialog" :id="orsId" :show="showDemoDialog" :onhide="hideAddDialog" ></demo-control>
        <!-- 创建修改订单状态弹窗 -->
        <change-status-control v-if="!destroyControlDialog" :id="ordOrderId" :show="showStatusDialog" :onhide="hideAddDialog" ></change-status-control>
        <!-- 创建取消订单弹窗 -->
        <cancel-order-control v-if="!destroyControlDialog" :id="ordOrderId" :show="showReasonDialog" :onhide="hideAddDialog" :send-req="reason"></cancel-order-control>

        <!-- 创建修改订单价格弹窗 -->
        <change-payment-control v-if="!destroyControlDialog" :sub-data="orderSubData" :show="showPaymentDialog" :onhide="hideAddDialog"></change-payment-control>
        <!-- 测试选择商品弹窗 -->
        <select-spu v-if="!destroyControlDialog" :show="showSpuDialog" :onhide="hideAddDialog" @spu-data="getSelected"></select-spu>

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
let vueThis = null;
export default {
    components: { pageTitleBar, paging, itemControl, mAlert, mMultiSelect, mSelect, search, control, 
                    loading, orderControl,demoControl,changeStatusControl,cancelOrderControl,changePaymentControl,selectSpu },
    props: {
        title:'',
        ospuid:0,
        oflag:false,
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
            exportString:'',
            reason:false,
            isLoading: false,
            countDesc: '',  //数据统计
            dataList: [],
            page: {},   // 分页请求数据
            showAlert: false,
            showAddDialog: false,
            showDemoDialog: false,
            showStatusDialog:false,
            showReasonDialog:false,
            showPaymentDialog:false,
            showSpuDialog:false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            limitResource: null, //发布状态
            clickItems: [],   //点击操作的数据项
            controlType: '',  //当前操作的权限类型
            showControl: false, //显示操作弹窗
            destroyControlDialog: false, //注销良言操作弹框
            orderEditId: '',
            orderSetData: null,
            orderSubData: null,
            orsId: 0,
            ordOrderId:0,
            testSelectedSpu:[],
        }
    },
    computed: {
        selectItems() {
            let list = [];
            this.dataList.forEach(item => {
                item.checked && list.push(item);
            })
            return list;
        }
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
        //得到选择的商品
        getSelected(data){
            this.testSelectedSpu=data;
        },
        //选择商品
        selectSpu(){
            this.showSpuDialog=true;
        },
        //导出订单
        exportOrder(){
            $("#exportForm").attr("action",ORDER_EXPORT);
            $("#exportForm").submit();

        },
        //修改订单状态弹窗
        editStatus(itemSub){
            this.ordOrderId=itemSub.ordOrderId;
            this.showStatusDialog=true;
        },
        //取消订单
        cancelOrder(itemSub){
            this.ordOrderId=itemSub.ordOrderId;
            this.reason=!this.reason;
            this.showReasonDialog=true;
        },
        //修改价格
        editPayAmount(itemSub){
            this.orderSubData=itemSub;
            this.showPaymentDialog=true;
        },
        //备注
        setDemo(orsId){
            this.orsId=orsId;
            this.showDemoDialog=true;
        },
        //支付渠道显示
        ordPayChannel(payChannel){
            switch(payChannel){
                case 10:
                case 11:
                case 12:return '微信支付';
                case 20:
                case 21:
                case 22:return '支付宝支付';
                default:;
            }
        },
        //通过点击订单状态查询订单列表
        getListByState(num){
            this.searchOptions.ordStatus=num;
            this.getList(false,true);
        },
        //点击查看详情
        showDetail(itemSet,itemSub){
            this.orderSetData=itemSet;
            this.orderSubData=itemSub;
            this.showAddDialog=true;
        },
        //商品那边的方法
        hideDialog() {
            this.showDialog = false;
            setTimeout(() => {
                this.showPage = false;
                this.onhide();
            }, 300)
        },
        hideAddDialog(control) {
            this.expertEditId = '';
            this.showAddDialog = false;
            this.showDemoDialog=false;
            this.showStatusDialog=false;
            this.showReasonDialog=false;
            this.showPaymentDialog=false;
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
        getList(page, firstSearch) {
            let options,url=ORDER_GET_LIST;
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
            this.exportString=JSON.stringify(options);
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
            item.checked = !item.checked;
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
        oflag() {
           // alert(this.ospuid)
            this.getList(false, true)

         },
         show() {
            this.showPage = this.show
            this.showDialog = this.show
        },
        orderSubData(value){
            console.log(value.ordActAmount);
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
</style>