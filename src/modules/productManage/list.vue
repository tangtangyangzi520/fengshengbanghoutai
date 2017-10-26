<template>
<!-- 商品列表页面 -->
    <div>
        <div class="page-bar min-bar">
            <page-title-bar>
                <span slot="title">商品列表</span>
            </page-title-bar>

            <!-- 条件搜索 -->
            <search :onchange="changeSearchOptions" :oncreate="getList" :parent="par" :cflag="flag"></search>
            <br>
            
            <!-- 按钮/链接 -->
            <!--  说明:配置按钮的权限方法:添加v-if="limitResource.product_add"(按钮名称(product_add)在数据库中配置) -->
            <div class="col-md-12 right" style="display:inline-block">
                <span v-if="selectItems.length>0" class="desc">已选
                    <em>{{selectItems.length}}</em> 项 
                </span>

                <button class="btn green" type="button"  @click="addItem()" style="margin-left:10px;" v-if="limitResource.product_add">发布商品</button>
                <span v-if="par == 3">
                    <button type="button" class="btn blue" @click="up()" v-if="limitResource.product_shelves">上架</button>
                    </span>
                <span v-else>
                    <button type="button" class="btn default" @click="down()" v-if="limitResource.product_shelves">下架</button>
                </span>
                <button class="btn purple"        type="button"  @click="deleteSpu()"     v-if="limitResource.product_delete">删除</button>
                <button class="btn yellow-crusta" type="button"  @click="productexport()" v-if="limitResource.product_export">导出</button> 
                <button class="btn green-meadow"  type="button"  @click="search()" >搜索</button>
            </div>

            <a><div id="1" class="cha"     style="float:left"  @click="changeClass(1)">出售中</div></a>  
            <a><div id="2" class="select"  style="float:left"  @click="changeClass(2)">已售罄</div></a>   
            <a><div id="3" class="select"  style="float:left"  @click="changeClass(3)">仓库中</div></a>
            <div style="height:5px;clear:both;"></div>
        </div>

        <!-- 列表数据 -->
        <div class="contentBlock" id="contentList">
            <div class="table-responsive col-md-12">
                <table class="table table-striped table-bordered table-hover" id="sku-content-table">
                    <thead>
                        <tr>
                            <th style="width:5%">
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll">全选</button>
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList">反选</button>
                            </th>
                            <th style="width:35%;">商品信息</th>
                            <th style="width:10%;">丰盛榜售价
                                <a id="desc"  class="orderBy" style="text-decoration:none" @click="orderByPrice(false)">▼</a>
                                <a id="asc" class="orderBy" style="display:none;text-decoration:none" @click="orderByPrice(true)">▲</a>
                            </th>
                            <th style="width:10%;">总库存</th>
                            <th style="width:10%;">总销量</th>
                            <th style="width:12%;">创建时间
                                <a id="timedesc"  class="orderBy" style="text-decoration:none" @click="orderByTime(false)">▼</a>
                                <a id="timeasc" class="orderBy" style="display:none;text-decoration:none" @click="orderByTime(true)">▲</a>
                            </th>
                            <!-- <th style="width:10%;">更新时间</th> -->
                            <th style="">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in dataList" @click="selectItem(item)">
                            <td style="text-align:center;vertical-align:middle;">
                                <input type="checkbox" :checked="item.checked"></input>
                            </td>
                            <td class="tdTitle">
                                <p>
                                    <a target="_blank" :href="item.imgUrl" title="查看大图">
                                        <img :src="item.imgUrl" class="img-rounded" style="height:60px; width:80px">
                                    </a>
                                </p>
                            <a  style="text-decoration:none;" title="预览商品"  @click.stop="previewpro(item.spuId)"> 
                                <h4 class="tt"><p style="color:#6699CC">商品编码:{{item.spuCode}}</p>{{item.spuName}}</h4>
                            </a>
                            </td>
                            <td style="width:13%;text-align:center;vertical-align:middle;font-family: 'Arial Normal', 'Arial';font-weight: 400;
                                   font-style: normal;"><span v-if="item.minSalePrice == item.maxSalePrice">{{"￥"+item.minSalePrice}}</span>
                                   <span v-else>{{"￥"+item.minSalePrice+"  ~ ￥"+item.maxSalePrice}}</span>
                            </td>
                            <td style="text-align:center;vertical-align:middle;">
                                <span v-if="item.totalStockNum > 0">{{item.totalStockNum}}</span>
                                <span v-else>库存不足</span>
                                <p style="padding-top:5px;">
                                    <span class="label label-default" v-if="item.spuShelvesStatus!=1">下架</span>
                                    <span class="label label-success" v-else>上架</span>
                                </p>
                            </td>
                            <td style="text-align:center;vertical-align:middle;">
                                <a  style="text-decoration:none;" title="订单列表"  @click.stop="order(item.spuId,item.spuName)"> 
                                   {{item.totalSaleNum}}
                                </a>
                            </td>
                            <td style="text-align:center;vertical-align:middle;">{{item.spuModifyTime|filterTime}}</td>
                            <td style="text-align:center;vertical-align:middle;">
                                <button type="button"  class="btn btn-xs blue" @click.stop="showEdit(item.spuId,'edit')" v-if="limitResource.productSpu_edit">编辑</button>
                                <button type="button"  class="btn btn-xs yellow-crusta" @click.stop="showEditspu(item.spuId,item.spuName,'edit')"v-if="limitResource.productSku_edit">查看SKU列表</button>
                            </td>
                        </tr>
                        <tr v-if="dataList.length==0">
                            <td colspan="9" class="center">暂无数据</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <form action="" id="exportForm" method="post"> 
            <input type="hidden" name="request" :value="spuName"/> 
        </form>
        
        <!-- 分页条 -->
        <paging :current-page="page.currentPage" :page-size="page.pageSize" :start-index="page.startIndex" :total-page="page.totalPage" :total-size="page.totalSize" :change="getList"></paging> 
        <!-- 订单列表弹框 -->
        <order-list v-if="!destroyControlDialog" :show="showorderDialog" :onhide="hideDialog3" :lspuid="oospuid" :lflag="ooflag" :title="ordertitle"></order-list>
        <!-- 预览商品弹框 -->
        <preview v-if="!destroyControlDialog" :id="expertEditId" :show="showpreDialog"  :onhide="hideDialog2" :pspuid="lspuid" :pflag="lflag" :imgflag="limgflag"></preview> 
        <!-- 选择商品类目弹框 -->
        <category-control v-if="!destroyControlDialog" :id="expertEditId" :show="showAddDialog" :onhide="hideAddDialog"  :closepar="getList"></category-control> 
        <!-- 编辑商品弹框 -->
        <edit-product-control v-if="!destroyControlDialog" :id="expertEditId" :show="showEditDialog" :spuid="spu" :onhide="hideEditDialog" :proflag="pflag"></edit-product-control> 
        <!-- 编辑SKU信息弹框 -->
        <edit-sku-control v-if="!destroyControlDialog" :id="expertEditId" :show="showEditspuDialog" :spuid2="spu" :onhide="hideEditspuDialog" :skuflag="kflag" :spuname="spuname"></edit-sku-control> 
        <!--  <manage-control v-if="!destroyControlDialog" :id="expertEditId" :show="showAddDialog" :onhide="hideAddDialog"></manage-control>   -->
        
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
import orderList from './orderList';
import preview from './preview';
import search from './search';
import control from '../common/control';
import loading from '../common/loading';
import manageControl from './manageControl';
import productControl from './productControl';
import categoryControl from './categoryControl';
import EditProductControl from './EditProductControl';
import EditSkuControl from './EditSkuControl';

let vueThis = null;

export default {
    components: { pageTitleBar, paging, itemControl, mAlert, mMultiSelect, mSelect, search, control, loading, manageControl, productControl, categoryControl, EditProductControl, EditSkuControl, preview, orderList },
    data() {
        return {
            ordertitle:'',
            oospuid:0,
            ooflag:false,
            limgflag:false,
            lspuid:0,
            lflag:false,
            spuname:'',
            skuCode:'',
            spuCatId:'',
            skuCode:'',
            spuName:'',
            pflag:true,
            kflag:true,
            flag:true,
            spu:0,
            img:"http://img1.fshtop.com/1502701860183.jpg",
            par : 0,
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
            showEditDialog:false,  //编辑商品
            showEditspuDialog:false,  //编辑商品
            showpreDialog:false,
            showorderDialog:false,
            exportflag:false,
            downflag:false,
            upflag:false,
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
        // 删除商品
        deleteSpu() {
            let arr = [];
            this.dataList.forEach( item => {
                if(item.checked == true ){
                    arr.push(item.spuId);
                }
            });
            if(arr.length == 0){
                this.showMsg("请选择需要删除的数据");
                return;
            }
            if(!confirm("确定删除商品吗")){
                return;
            }
            // 发送删除商品请求
            client.postData( SPU_DELETE ,  arr ).then(data => {
                if (data.code == 200) {
                    this.showMsg("删除成功");
                    this.getList();
                }else {
                    this.showMsg(data.msg);
                }}, data => {
                this.showMsg("删除失败,请重试");
            });
        },
        // 上架
        up() {
            let arr = [];
            this.dataList.forEach( item => {
                if(item.checked == true ){
                    arr.push(item.spuId);
                }
            });
            if(arr.length ==0){
                this.showMsg("请先选中商品");
                return;
            }
            if(this.upflag){
                this.showMsg("点击过于频繁");
                return;
            }
            this.upflag = true;
            setTimeout(()=>{
                this.upflag = false;
            },3000);
            //
            client.postData( SPU_EDIT_UP_DOWN ,  { "ids": arr, "spuShelvesStatus": 1 }).then(data => {
                if (data.code == 200) {
                    this.showMsg("上架成功");
                    this.getList();
                }else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.upflag = false;
                this.showMsg("上架失败,请重试");
            });
        },
        // 下架
        down() {
            let arr = [];
            this.dataList.forEach( item => {
                if(item.checked == true ){
                    arr.push(item.spuId);
                }
            })
            if(arr.length ==0){
                this.showMsg("请先选中商品");
                return;
            }  
            if(this.downflag){
                this.showMsg("点击过于频繁");
                return;
            }
            this.downflag = true;
            setTimeout(()=>{
                this.downflag = false;
            },3000);
            //
            client.postData( SPU_EDIT_UP_DOWN ,  { "ids": arr, "spuShelvesStatus": 0 }).then(data => {
                if (data.code == 200) {
                    this.showMsg("下架成功");
                    this.getList();
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.downflag = false;
                this.showMsg("下架失败,请重试");
            });
        },
        // 根据时间升降序
        orderByTime( val ) {
            let options;
            if (true) {
                // 拿最后一次请求的参数
                //options = this.lastSearchOptions;
                options = Object.assign({}, this.searchOptions);
            } else {
                options = Object.assign({}, this.searchOptions);
            }
            this.isLoading = true;
            this.dataList = [];
            this.lastSearchOptions = options;
            if( !val ){
                $("#timeasc").show();
                $("#timedesc").hide();
                options.orderBy = 0;
            }else{
                $("#timedesc").show();
                $("#timeasc").hide();
                options.orderBy = 1;
            }
            options.orderType = 2;
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
        // 根据售价升降序
        orderByPrice( val ) {
            let options;
            if (true) {
                // 拿最后一次请求的参数
                //options = this.lastSearchOptions;
                options = Object.assign({}, this.searchOptions);
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
            options.orderType = 1;
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
        // 关闭查看订单列表弹框
        hideDialog3() {
            this.showorderDialog = false;
            setTimeout(() => {
                //this.onhide('cancel');
            }, 300);
        },
        // 查看订单列表
        order(val,name) {
            this.oospuid = val;
            this.ordertitle = name+"---订单列表";
            this.ooflag = !this.ooflag;
            this.showorderDialog = true;
        },
        // 关闭预览商品弹框
        hideDialog2() {
            this.showpreDialog = false;
            setTimeout(() => {
                this.onhide('cancel');
            }, 300);
        },
        // 预览商品
        previewpro(val) {
            setTimeout(()=>{
                this.lspuid = val;
                this.limgflag = !this.limgflag;
                this.lflag = !this.lflag;
                this.showpreDialog = true;
            },100); 
        },
        // 导出
        productexport() {
            if(this.exportflag){
                this.showMsg("点击过于频繁");
                return;
            }
            this.exportflag = true;
            setTimeout(()=>{
                this.exportflag = false;
            },5000);
            let options;
            // 拿最后一次请求的参数
            //options = this.lastSearchOptions;
            //options = Object.assign({}, this.searchOptions);
            options = this.searchOptions;
            this.isLoading = true;
            this.dataList = [];
            /*console.log( this.searchOptions)
            console.log(options)
            return*/
            this.spuName =  JSON.stringify({"spuName":options.spuName,"spuCatId":options.spuCatId,"spuCode":options.spuCode,"skuCode":options.skuCode,"saleStatus":options.saleStatus,}) +"";
            $("input[name='request']").val(JSON.stringify({"spuName":options.spuName,"spuCatId":options.spuCatId,"spuCode":options.spuCode,"skuCode":options.skuCode,"saleStatus":options.saleStatus,"showCatIdList":options.showCatIdList}) +"");
            var url= SPU_EXPORT; // 
            $("#exportForm").attr("action",url);  
            $('#exportForm').attr('target','_blank');
            $("#exportForm").submit();  
            this.getList();
        },
        // 搜索按钮
        search(){
            this.flag = !this.flag;
            $("#timeasc").hide();
            $("#timedesc").show();
            $("#asc").hide();
            $("#desc").show();
        },
        // 关闭编辑SKU信息弹框
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
                this.getList();
            }
         } ,
        // 关闭编辑商品弹框
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
                }, 100);
                setTimeout(() => {
                    //重新加入
                    this.destroyControlDialog = false;
                }, 200);
                this.getList();
            }
         } ,
        // 点击改变样式(出售中/已售罄/仓库中)
        changeClass(obj) {
            $("#timedesc").show();
            $("#timeasc").hide();
            $("#desc").show();
            $("#asc").hide();
            $("#"+obj).removeClass("select").addClass("cha");
            if(obj == "1"){
                $("#2,#3").removeClass("cha").addClass("select");
                this.par = 1;
            }else if(obj == "2"){
                $("#1,#3").removeClass("cha").addClass("select");
                this.par = 2;
            }else{
                $("#2,#1").removeClass("cha").addClass("select");
                this.par = 3;
            }
             //this.getList(false,true);
        },
        // 查看SKU列表按钮
        showEditspu(item, name , type) {
            this.kflag = !this.kflag;
            this.controlType = type;
            this.spu = item;
            this.spuname = name;
            //console.log(this.spu);
            this.showEditspuDialog = true;  
        },
        // 打开编辑页面
        showEdit(item, type) {
            this.pflag = !this.pflag;
            this.controlType = type;
            this.spu = 0;
            this.spu = item;
            //console.log(this.spu);
            this.show();
        },
        show(){
            this.showEditDialog = true;
        },
        // 发布商品
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
                this.getList();
            }
        },
        // 搜索条件变化
        changeSearchOptions(options) {
            this.searchOptions = options;
        },
        // 关闭control的提示框
        hideControlFunc(type) {
            if (type == 'success') {
                this.getList();
            }
            this.showControl = false;
        },
        // 获取商品列表数据
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

            /*this.dataList =  {"code":200,"msg":"操作成功","serverTime":"0","data":[{"maxSalePrice":110.00,"minSalePrice":110.00,"totalStockNum":110,"totalSaleNum":1,"spuId":"900646218680655873","spuName":"iphone","spuCreatedTime":1503566566000,"spuModifyTime":1503567684000},{"maxSalePrice":0,"minSalePrice":0,"totalStockNum":0,"totalSaleNum":0,"spuId":"901979298590777344","spuName":"string","spuCreatedTime":1503883598000,"spuModifyTime":1503883598000},{"maxSalePrice":0,"minSalePrice":0,"totalStockNum":0,"totalSaleNum":0,"spuId":"901979298590777345","spuName":"string","spuCreatedTime":1503883600000,"spuModifyTime":1503883600000},{"maxSalePrice":0,"minSalePrice":0,"totalStockNum":0,"totalSaleNum":0,"spuId":"901979298590777346","spuName":"string","spuCreatedTime":1503883600000,"spuModifyTime":1503883600000},{"maxSalePrice":0,"minSalePrice":0,"totalStockNum":0,"totalSaleNum":0,"spuId":"901979298590777347","spuName":"string","spuCreatedTime":1503883600000,"spuModifyTime":1503883600000},{"maxSalePrice":0,"minSalePrice":0,"totalStockNum":0,"totalSaleNum":0,"spuId":"901979298590777348","spuName":"string","spuCreatedTime":1503883600000,"spuModifyTime":1503883600000},{"maxSalePrice":0,"minSalePrice":0,"totalStockNum":0,"totalSaleNum":0,"spuId":"901979298590777349","spuName":"string","spuCreatedTime":1503883600000,"spuModifyTime":1503883600000},{"maxSalePrice":0,"minSalePrice":0,"totalStockNum":0,"totalSaleNum":0,"spuId":"901979298590777350","spuName":"string","spuCreatedTime":1503883601000,"spuModifyTime":1503883601000},{"maxSalePrice":0,"minSalePrice":0,"totalStockNum":0,"totalSaleNum":0,"spuId":"901979298590777351","spuName":"string","spuCreatedTime":1503883601000,"spuModifyTime":1503883601000},{"maxSalePrice":0,"minSalePrice":0,"totalStockNum":0,"totalSaleNum":0,"spuId":"901979298590777352","spuName":"string","spuCreatedTime":1503883601000,"spuModifyTime":1503883601000}],"page":{"currentPage":1,"pageSize":10,"startIndex":0,"totalPage":6,"totalSize":52}}.data*/
            client.postData( SPU_GET_LIST , options).then(data => {  
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
        // 全选
        selectAll() {
            this.dataList.forEach(item => {
                item.checked = true;
            });
        },
        // 反选
        reverseList() {
            this.dataList.forEach(item => {
                item.checked = !item.checked;
            });
        },
        // 选中行
        selectItem(item) {
            item.checked = !item.checked;
        },
        // 打开提示框
        showMsg(msg, title) {
            if (title) {
                this.showAlertTitle = title;
            } else {
                this.showAlertTitle = '温馨提示';
            }
            this.showAlertMsg = msg;
            this.showAlert = true;
        },
        // 关闭提示框
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
.select{
    margin-left: 6px;
    border:10px solid white;
    border-width:1px;
    height: 30px;
    width: 100px;
    display:inline-block;
    text-align:center;
    line-height: 30px;
    font-weight:bold;
    border-radius:20px
};
.cha{
    margin-left: 6px;
    border:10px solid #6699CC;
    border-width:1px;
    height: 30px;
    width: 100px;
    display:inline-block;
    text-align:center;
    line-height: 30px;
    border-radius:20px
};
td{
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
</style>