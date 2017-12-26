<template>
<!-- 优惠券-列表页面 -->
    <div style="background-color:white">
        <div class="page-bar min-bar">
            <page-title-bar>
                <span slot="title">优惠券列表{{countDesc}}</span>
            </page-title-bar>
            <a><div  id="-1" class="cha2"    style="float:left"  @click="changeClass(-1)">所有优惠券</div></a>  
            <a><div  id="0" class="select2"  style="float:left"  @click="changeClass(0)">未开始</div></a>   
            <a><div  id="2" class="select2"  style="float:left"  @click="changeClass(2)">进行中</div></a>
            <a><div  id="1" class="select2"  style="float:left"  @click="changeClass(1)">已结束</div></a>
            <br>
                <p style="text-align:center">
                    <hr style="height:3px;background-color:gray;width:99%;margin-left:0.4%" >
                </p>
            <br>
            <!--按钮  -->
            <button class="btn" type="button" @click="add()" style="margin-left:6px;float:left;margin-top:10px;background-color: #66CC33;color:white" v-if="limitResource.coupon_add">新建优惠券</button>
            <button class="btn" type="button" @click="exportList()" style="margin-left:6px;float:left;margin-top:10px;background-color: #66CC33;color:white" v-if="limitResource.coupon_export_list">导出列表</button>
            <button class="btn" type="button" @click="exportDetails()" style="margin-left:6px;float:left;margin-top:10px;background-color: #66CC33;color:white" v-if="limitResource.coupon_export_detail">导出明细</button>
            <span style="float:right;display:inline-block;margin-bottom:10px;margin-right:0.4%">
                <span  style="display:inline-block;"> 
                    <search :onchange="changeSearchOptions" :oncreate="getList" :parent="par" :cflag="flag" ></search>
                </span>
                <!--  <button class="btn green-meadow" @click="search()" type="button" style="background-color:#66CC33">搜索</button> -->
            </span>
            <br>
        </div>
        <br>
        <div class="contentBlock" id="contentList">
            <div class="table-responsive col-md-12">
                <table class="table table-striped table-bordered table-hover " id="discount">
                    <thead>
                        <tr style="background-color:#D7D7D7;height:45px">
                            <th style="width:4%" v-if="limitResource.coupon_export_detail">
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll">全选</button>
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList">反选</button>
                            </th>
                            <th style="width:25%;">优惠券名称</th>
                            <th style="width:10%;">价值</th>
                            <th style="width:10%;">领取限制
                                <!-- <a id="desc"  class="orderBy" style="text-decoration:none" @click="orderBy(false)">▼</a>
                                <a id="asc" class="orderBy" style="display:none;text-decoration:none" @click="orderBy(true)">▲</a> -->
                            </th>
                            <th style="width:20%;">有效期</th>
                            <th style="width:10%;">领取人/次</th>
                            <th style="width:10%;">已使用</th>
                            <th style="">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in dataList" @click="selectItem(item)">
                            <td style="text-align:center;vertical-align:middle;" v-if="limitResource.coupon_export_detail">
                                <input type="checkbox" :checked="item.checked"></input>
                            </td>
                            <td style="vertical-align:middle" class="tdTitle">
                                {{item.mkcName}}
                            </td>
                            <td style="width:13%;text-align:center;vertical-align:middle;font-family: 'Arial Normal', 'Arial'; font-weight: 400; font-style: normal;">
                                {{item.mkcPrice}}<br>
                                <span v-if="item.mkcUsedCondition > 0 ">最低消费：￥{{item.mkcUsedCondition}}</span>
                            </td>
                            <td style="text-align:center;vertical-align:middle;">
                                <span v-if="item.mkcJoinTimes == 0 ">不限张数<br></span>
                                <span v-else>限{{item.mkcJoinTimes}}张<br></span>
                                {{ "库存："+ item.mkcTotalAmount}}
                            </td>
                            <td style="text-align:center;vertical-align:middle;font-family: 'Arial Normal', 'Arial';font-weight: 400; font-style: normal;">
                               <span v-if="item.mkcDateType==1"> 领到券当天开始{{item.mkcDateNum}}天内有效</span>
                               <span v-if="item.mkcDateType==2"> 领到券次日开始{{item.mkcDateNum}}天内有效</span>
                               <span v-if="item.mkcDateType==0">{{item. mktStart|filterTime}} 至<br> {{item.mktEnd|filterTime}}</span>
                            </td>
                            <td style="text-align:center;vertical-align:middle;">
                                <p>{{item.totalNum}}/</p>{{item.totalNum}}
                            </td>
                            <td style="text-align:center;vertical-align:middle;">
                                {{item.useNum}}
                            </td>
                            <!-- <td style="text-align:center;vertical-align:middle;">{{item.spuModifyTime|filterTime}}</td>
                            <td style="text-align:center;vertical-align:middle;">{{item.spuModifyTime|filterTime}}</td> -->
                            <td style="text-align:center;vertical-align:middle;">
                                <!-- v-if="limitResource.expert_info_edit" 编辑的权限控制-->
                                <span v-if="item.mkcIsInvalid == 1" >已失效</span>
                                <span v-if="item.mkcIsInvalid == 0" >
                                    <button type="button"  class="btn btn-xs green" @click.stop="showCouponCtr(item.mkcCampaignId)" v-if="item.bindStatus==0">添加卡券</button>
                                    <button type="button"  class="btn btn-xs green" @click.stop="showCouponCtr(item.mkcCampaignId)" v-if="item.bindStatus==1">查看卡券</button>
                                    <button type="button"  class="btn btn-xs blue" @click.stop="showEdit(item.mkcCampaignId)" v-if="limitResource.coupon_edit">编辑</button>
                                    <button type="button"  @click.stop="showControlFunc(item.mkcCampaignId,'delete')" class="btn btn-xs yellow-crusta" v-if="limitResource.coupon_invalidate">使失效</button> 
                                </span>
                            </td>
                        </tr>
                        <tr v-if="dataList.length==0">
                            <td colspan="9" class="center">暂无数据</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- 导出列表 -->
        <form action="" id="exportListForm" method="post">
            <input type="hidden" name="listRequest" />
        </form>
        <!-- 导出明细 -->
        <form action="" id="exportDetailForm" method="post">
            <input type="hidden" name="detailRequest" />
        </form>
        <!-- 分页 -->
        <paging  :current-page="page.currentPage" :page-size="page.pageSize" :start-index="page.startIndex" :total-page="page.totalPage" :total-size="page.totalSize" :change="getList"></paging>
        <span v-if="dataList.length==0"><br><br></span>
        <!-- 优惠券-新建/编辑弹框 -->
        <add-coupon v-if="!destroyControlDialog" :id="expertEditId" :show="showEditDialog" :spuid="spu" :onhide="hideEditDialog" :coflag="couflag" :mkttid="mktid"></add-coupon> 
        <!-- 微信卡券-新建/编辑弹框 -->
        <add-wx-coupon :id="editWxCouponId" :show="showCouponDialog" :onhide="hideCouponDialog"></add-wx-coupon> 
        <m-alert :title="'提交'" :show-cancel-btn="true" :show="showSubmitDialog" :onsure="ajaxControl" :onhide="hideMsg">
            <div slot="content">确定提交吗？</div>
        </m-alert>
        <m-alert :title="'提交'" :show-cancel-btn="true" :show="showSubmitDialog" :onsure="ajaxControl" :onhide="hideMsg">
            <div slot="content">确定提交吗？</div>
        </m-alert>
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
        <control :show="showControl" :items="clickItems" :onhide="hideControlFunc" :type="controlType" :search="getList"></control>
        <loading :show="isLoading"></loading>
    </div>
</template>

<script>
import client from '../../common/utils/client';
import { pageTitleBar, paging, itemControl, mMultiSelect, mAlert, mSelect } from '../../components';
import search from './search';
import control from './control';
import loading from '../common/loading';
import addCoupon from './addCoupon';
import addWxCoupon from './addWxCoupon';

let vueThis = null;

export default {
    components: { pageTitleBar, paging, itemControl, mAlert, mMultiSelect, mSelect, search, control, loading, addCoupon, addWxCoupon },
    data() {
        return {
            mktid: 0,
            couflag: false,
            ordertitle: '',
            oospuid: 0,
            ooflag: false,
            limgflag: false,
            lspuid: 0,
            lflag: false,
            spuname: '',
            skuCode: '',
            spuCatId: '',
            skuCode: '',
            spuName: '',
            pflag: true,
            kflag: true,
            flag: true,
            spu: 0,
            img: "http://img1.fshtop.com/1502701860183.jpg",
            par: -100,
            isLoading: false,
            countDesc: '',  //数据统计
            dataList: [],
            page: {},   // 分页请求数据
            showAlert: false,
            showAddDialog: false,   //新增商品
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            limitResource: null, //发布状态
            clickItems: [],   //点击操作的数据项
            controlType: '',  //当前操作的权限类型
            showControl: false, //显示操作弹窗
            destroyControlDialog: false, //注销良言操作弹框
            expertEditId: '',
            showEditDialog: false,  //编辑商品
            showEditspuDialog: false,  //编辑商品
            showCouponDialog: false, //编辑微信卡券
            showpreDialog: false,
            showorderDialog: false,
            editWxCouponId: '', //编辑的优惠券id
        }
    },
    computed: {
        selectItems() {
            let list = [];
            this.dataList.forEach(item => {
                item.checked && list.push(item);
            });
            return list;
        }
    },
    filters: {
        filterStatus(id) {
            // return client.global.componentStatus.find(item => item.id == id).name;
        },
        filterTime(time) {
            return client.formateTime(time);
        }
    },
    methods: {
        //导出优惠券列表
        exportList() {
            $("#exportListForm").attr("action", MKT_EXPORT_LIST);
            $("input[name='listRequest']").val(this.par);
            $("#exportListForm").submit();
        },
        //导出使用明细
        exportDetails() {
            let detailRequest, list=[];
            this.dataList.forEach(item => {
                if (item.checked == true) {
                    list.push(item.mkcCampaignId);
                }
            });
            if(list.length==0){
                this.showMsg("请选择需要导出使用明细的优惠券");
                return;
            }
            detailRequest = list.join(",");
            $("#exportDetailForm").attr("action", MKT_EXPORT_DETAIL);
            $("input[name='detailRequest']").val(detailRequest);
            $("#exportDetailForm").submit();
        },
        //打开编辑页面
        add() {
            this.mktid = -100;
            setTimeout(()=>{
                 this.showEditDialog = true;
            },100);
        },
        showEdit(id) {
            this.mktid = id;
            this.couflag = !this.couflag;
            this.showEditDialog = true;
        },
        //添加或查看卡券
        showCouponCtr(editWxCouponId){
            this.editWxCouponId = editWxCouponId;
            this.showCouponDialog = true;
        },
        hideCouponDialog(type){
            this.showCouponDialog = false;
            console.log(type);
        },
        //根据售价升降序
        orderBy(val) {
            let options;
            if (true) {
                // 拿最后一次请求的参数
                options = this.lastSearchOptions;
            } else {
                options = Object.assign({}, this.searchOptions);
            }
            this.isLoading = true;
            this.dataList = [];
            this.lastSearchOptions = options;
            if( !val ){
                $("#asc").show();
                $("#desc").hide();
                options.orderBy = 0;
            }else{
                $("#desc").show();
                $("#asc").hide();
                options.orderBy = 1;
            }
            //
            client.postData( SPU_GET_LIST , options).then(data => {  //192.168.4.249
                this.isLoading = false;
                if (data.code == 200) {
                    data.data.forEach(item => {
                        item.checked = false;
                    });
                    this.dataList = data.data;
                    this.page = data.page;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
            });
        },
        search(){
            this.flag = ! this.flag;
        },
        hideEditspuDialog(control) {
            this.expertEditId = '';
            this.showEditspuDialog = false;
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
                }, 100);
                setTimeout(() => {
                    //重新加入
                    this.destroyControlDialog = false;
                }, 200);
                this.getList(false,true);
            }
        } ,
        //编辑商品
        hideEditDialog(control) {
            this.expertEditId = '';
            this.showEditDialog = false;
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
                }, 200);
                this.getList(false,true);
            }
         } ,
        //点击改变样式
        changeClass(obj) {
            $("#desc").show();
            $("#asc").hide();
            $("#"+obj).removeClass("select2").addClass("cha2");
            if(obj == "-1"){
                $("#0,#2,#1").removeClass("cha2").addClass("select2");
                this.par = -1;
            }else if(obj == "0"){
                $("#-1,#2,#1").removeClass("cha2").addClass("select2");
                this.par = 0;
            }else if(obj == "2"){
                $("#-1,#0,#1").removeClass("cha2").addClass("select2");
                this.par = 2;
            }else{
                $("#0,#2,#-1").removeClass("cha2").addClass("select2");
                this.par = 1;
            }
             //this.getList(false,true);
        },
        show(){
             this.showEditDialog = true;
        },
        addItem() {
            //document.location = '/dist/#!/categoryControl';
            this.expertEditId = '';
            this.showAddDialog = true;
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
                }, 100);
                setTimeout(() => {
                    //重新加入
                    this.destroyControlDialog = false;
                }, 200);
                //this.getList();
            }
        },
        // 搜索条件变化
        changeSearchOptions(options) {
            this.searchOptions = options;
        },
        showControlFunc(item, type) {
            this.clickItems = [];
            this.controlType = type;
            //this.showEditDialog = true;
            //console.log(item);
            if (!item) {
                if (this.selectItems.length != 0) {
                    this.clickItems = this.selectItems;
                    this.showControl = true;
                }
            } else {
                this.clickItems.push(item);
                if (type == 'edit') {
                    //this.expertEditId = item.componentId;
                    this.showAddDialog = true;
                } else {
                    this.showControl = true;
                }
            }
        },
        hideControlFunc(type) {
            if (type == 'success') {
                //this.getList();
            }
            this.showControl = false;
        },
        //查询列表数据
        getList(page, firstSearch) {
            let options;
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
            //
            client.postData( MKT_LIST , options).then(data => {  //192.168.4.249
                this.isLoading = false;
                if (data.code == 200) {
                    data.data.forEach(item => {
                        item.checked = false;
                    });
                    this.dataList = data.data;
                    this.page = data.page;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
            });
        },
        //查询行头统计数据
        /*getCount(options) {
            options.componentType = [12];
            client.postData(COMPONENT_ARTICLE_COUNTER, options).then(data => {
                if (data.code == 200) {
                    this.countDesc = data.data;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
            });
        },
        */
        selectAll() {
            this.dataList.forEach(item => {
                item.checked = true;
            });
        },
        reverseList() {
            this.dataList.forEach(item => {
                item.checked = !item.checked;
            });
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
            this.showEditDialog = false;
            this.showAddDialog = false;
            this.showEditspuDialog = false;
        }
    },
    created() {
        vueThis = this;
        this.limitResource = JSON.parse(localStorage.getItem('limitResource'));
        //console.log(this.limitResource);
    },
    watch: {
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
.select2 {
    margin-left: 3px;
    border: 10px solid gray;
    border-bottom: 0px solid white;
    border-width: 1px;
    height: 30px;
    width: 100px;
    display: inline-block;
    text-align: center;
    line-height: 30px;
    font-weight: bold;
}

;
.cha2 {
    margin-left: 6px;
    color: white;
    border-width: 1px;
    height: 30px;
    width: 100px;
    display: inline-block;
    text-align: center;
    line-height: 30px;
    background-color: #66CC33
}

;
td {
    text-align: center;
    vertical-align: middle
};
.tt:hover {
    color:#6699CC
};
.orderBy:hover{
    color:red;
    text-decoration:none
}
#discount td{
    border-right:none; 
    border-left:none;
}
#discount th{
    border-right:none; 
    border-left:none;
}
</style>