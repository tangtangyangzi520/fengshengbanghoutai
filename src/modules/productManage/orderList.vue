<template>
<!-- 商品列表-对应商品订单列表页面 -->
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">

     <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1600px'">
         <div slot="content" >
                <!-- 引入订单列表页面 -->
                <list :ospuid="spuid" :oflag="flag" :ooflag="fflag"  v-ref:order></list>
           
         </div>
           <span slot="btnList" >
             
                  <button type="button" v-else class="btn default" @click="hideDialog()" >关闭</button>

              </span> 
        </m-alert>
    </div>
</template>
<script>
import client from '../../common/utils/client';
import { pageTitleBar, paging, itemControl, mMultiSelect, mAlert, mSelect } from '../../components';
import orderSearch from './orderSearch';
import control from '../common/control';
import loading from '../common/loading';
import list from '../order/list';

let vueThis = null;
export default {
    components: { pageTitleBar, paging, itemControl, mAlert, mMultiSelect, mSelect, orderSearch, control, 
                    loading,list },
    props: {
        title:'',
        lspuid:0,
        lflag:false,
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
            fflag:false,
            spuid:0,
            flag:false,
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
            showDialog: false,
            orsId: 0,
            ordOrderId:0,
            showPage: false,
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
        hideDialog() {
            this.$refs.order.clearSearchOptions()
            this.fflag = !this.fflag
            this.showDialog = false;
            setTimeout(() => {
                this.showPage = false;
                this.onhide();
            }, 300)
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
        //显示订单状态    
        ordStatus(status){
            switch(status){
                case 0:return '待付款';
                case 1:return '待发货';
                case 2:return '已发货';
                case 3:return '已完成';
                case 4:return '已关闭';
                case 5:return '已取消';
                case 6:return '售后线下处理';
                default:;
            }
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
            let options, url = ORDER_GET_LIST;
            if (!firstSearch) {
                // 拿最后一次请求的参数
                options = this.lastSearchOptions;
            } else {
                options = Object.assign({}, this.searchOptions);
            }
            if (page) {
                options.page = page;
            }
            this.isLoading = true;
            this.dataList = [];
            this.lastSearchOptions = options;
            // 统计数据
            //this.getCount(options);
            //options.componentType = [12];
            options.ordSpuId = this.ospuid
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
       /* getCount(options) {
            options.componentType = [12];
            client.postData(COMPONENT_ARTICLE_COUNTER, options).then(data => {
                if (data.code == 200) {
                    this.countDesc = data.data;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
            })
        },*/
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
         lflag() {
           // alert(this.ospuid)
            this.spuid = this.lspuid
            this.flag = !this.flag 

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
</style>