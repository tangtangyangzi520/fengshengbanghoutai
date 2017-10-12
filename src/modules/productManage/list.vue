<template>

    <div>
        <div class="page-bar min-bar">
            <page-title-bar>
                <span slot="title">商品列表</span>
            </page-title-bar>
           
            <search :onchange="changeSearchOptions" :oncreate="getList" :parent="par" :cflag="flag"></search>
            <br>
            
            <div class="col-md-12 right" style="display:inline-block" >
            
                <span v-if="selectItems.length>0" class="desc">已选
                    <em>{{selectItems.length}}</em> 项 </span>
                
                <button class="btn green" type="button"  @click="addItem()" style="margin-left:10px;">发布商品</button>
               <!--  v-if="limitResource.expert_info_add" 添加按钮的权限-->
               <!--  <button class="btn blue" type="button" @click="showControlFunc(null,'publishAll')">修改模板</button>
                <button class="btn default" type="button" @click="showControlFunc(null,'submitAll')">下架</button>
                <button class="btn purple" type="button" @click="showControlFunc(null,'rejectAll')">删除</button>-->
                <span v-if="par == 3">
                 <button type="button" class="btn blue" @click="up()" >批量上架</button>
                 </span>
                 <span v-else>
                 <button type="button" class="btn default" @click="down()">批量下架</button>
                 </span>
                 <button class="btn purple" type="button" @click="deleteSpu()">删除</button>
                 <button class="btn yellow-crusta" type="button" @click="productexport()">导出</button> 
                 <button class="btn green-meadow" @click="search()" type="button">搜索</button>
            </div>
             <a><div  id="1" class="cha"    style="float:left"    @click="changeClass(1)">出售中</div></a>  
            <a> <div id="2" class="select"  style="float:left"   @click="changeClass(2)">已售罄</div></a>   
            <a><div  id="3" class="select"  style="float:left"  @click="changeClass(3)">仓库中</div></a>
            <div style="height:5px;clear:both;"></div>
        </div>

        <div class="contentBlock" id="contentList">
            <div class="table-responsive col-md-12">
                <table class="table table-striped table-bordered table-hover" id="sku-content-table">
                    <thead>
                        <tr>
                            <th style="width:4%">
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll">全选</button>
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList">反选</button>
                            </th>
                            <th style="width:35%;">商品信息</th>
                            <th style="width:9%;">丰盛榜售价
                                <a id="desc"  class="orderBy" style="text-decoration:none" @click="orderBy(false)">▼</a>
                                <a id="asc" class="orderBy" style="display:none;text-decoration:none" @click="orderBy(true)">▲</a>
                            </th>
                            <th style="width:7%;">总库存</th>
                            <th style="width:10%;">总销量</th>
                            <th style="width:10%;">创建时间</th>
                            <th style="width:10%;">更新时间</th>
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
                                   font-style: normal;">{{"￥"+item.minSalePrice+"  ~ ￥"+item.maxSalePrice}}</td>
                            <td style="text-align:center;vertical-align:middle;">
                                 <span v-if="item.totalStockNum > 0">    
                                {{item.totalStockNum}}
                                </span>
                                <span v-else>
                                    库存不足
                                </span>
                                <p style="padding-top:5px;">
                                    <span class="label label-default" v-if="item.spuShelvesStatus!=1">下架</span>
                                    <span class="label label-success" v-else>上架</span>
                                </p>
                            </td>

                            <td style="text-align:center;vertical-align:middle;">
                                <a  style="text-decoration:none;" title="订单列表"  @click.stop="order(item.spuId,item.spuName)"> 
                                   {{item.totalSaleNum}}
                                </a>
                               
                                 <!--  商品状态 -->
                              <!--       <span class="label label-default" v-if="item.deployStatus==4">{{item.spuCatId|filterStatus}}</span>
                                <template v-else>
                                    <span class="label label-success" v-if="item.deployStatus==2">{{item.spuReferLayout|filterStatus}}</span>
                                    <span class="label label-info" v-else>{{item.spuReferLayout|filterStatus}}</span>
                                </template>
                                <p style="padding-top:5px;">
                                    <span class="label label-default" v-if="item.spuReferLayout!=1">下架</span>
                                    <span class="label label-success" v-else>上架</span>
                                </p>
                                <p style="padding-top:5px;">
                                    <span class="label label-warning" v-if="item.spuReferLayout>0">{{item.spuReferLayout+'个标签'}}</span>
                                </p> -->
                            </td>
                            
                            <td style="text-align:center;vertical-align:middle;">{{item.spuCreatedTime|filterTime}}</td>
                            <td style="text-align:center;vertical-align:middle;">{{item.spuModifyTime|filterTime}}</td>
                            <td style="text-align:center;vertical-align:middle;">
                                        <!-- v-if="limitResource.expert_info_edit" 编辑的权限控制-->
                            <button type="button"  class="btn btn-xs blue" @click.stop="showEdit(item.spuId,'edit')">编辑</button>
                            <button type="button"  class="btn btn-xs yellow-crusta" @click.stop="showEditspu(item.spuId,item.spuName,'edit')">查看SKU列表</button>

                                 <!--    <button type="button" v-show="(item.deployStatus==3||item.deployStatus==4)" @click.stop="showControlFunc(item,'submit')" v-if="limitResource.expert_info_submit" class="btn btn-xs purple">提交</button>
                                    <button type="button" v-show="(item.deployStatus==5||item.deployStatus==1)" @click.stop="showControlFunc(item,'publish')" v-if="limitResource.expert_info_deploy" class="btn btn-xs purple">发布</button>
                                    <button type="button" v-show="(item.deployStatus==5)" @click.stop="showControlFunc(item,'reject')" v-if="limitResource.expert_info_reject" class="btn btn-xs default">拒绝</button>
                                    <button type="button" v-show="(item.submitStatus!=1)" @click.stop="showControlFunc(item,'putaway')" v-if="limitResource.expert_info_putaway" class="btn btn-xs default">上架</button>
                                    <button type="button" v-show="item.submitStatus==1" @click.stop="showControlFunc(item,'soldOut')" v-if="limitResource.expert_info_soldOut" class="btn btn-xs default">下架</button>
                                    <button type="button" v-show="(item.deployStatus==2)" @click.stop="showControlFunc(item,'withdraw')" v-if="limitResource.expert_info_withdraw" class="btn btn-xs default">撤回</button>
                                    <button type="button" v-if="limitResource.expert_info_delete" @click.stop="showControlFunc(item,'delete')" class="btn btn-xs red">删除</button> -->
                                  
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
             <!--   <input type="hidden" name="skuCode" v-model="skuCode"/> 
               <input type="hidden" name="spuCatId" v-model="spuCatId"/> 
               <input type="hidden" name="skuCode" v-model="skuCode"/>  -->
        </form>
        <paging :current-page="page.currentPage" :page-size="page.pageSize" :start-index="page.startIndex" :total-page="page.totalPage" :total-size="page.totalSize" :change="getList"></paging>
        <!-- 创建专家弹窗 -->
         <!--  <product-control v-if="!destroyControlDialog" :id="expertEditId" :show="showAddDialog" :onhide="hideAddDialog"></product-control> -->  
         <order-list v-if="!destroyControlDialog" :show="showorderDialog"  :onhide="hideDialog3" :lspuid="oospuid" :lflag="ooflag" :title="ordertitle"></order-list> 

         <preview v-if="!destroyControlDialog" :id="expertEditId" :show="showpreDialog"  :onhide="hideDialog2" :pspuid="lspuid" :pflag="lflag" :imgflag="limgflag"></preview> 
         <category-control v-if="!destroyControlDialog" :id="expertEditId" :show="showAddDialog" :onhide="hideAddDialog"  :closepar="getList"></category-control> 
         <edit-product-control v-if="!destroyControlDialog" :id="expertEditId" :show="showEditDialog" :spuid="spu" :onhide="hideEditDialog" :proflag="pflag"></edit-product-control> 
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
    
    components: { pageTitleBar, paging, itemControl, mAlert, mMultiSelect, mSelect, search, control, loading, manageControl,productControl,categoryControl,EditProductControl,EditSkuControl,preview ,orderList },
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
            })
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
         deleteSpu() {
            let arr = []
            this.dataList.forEach( item => {
                if(item.checked == true ){
                     arr.push(item.spuId)
                }
            })
            
            client.postData( SPU_DELETE ,  arr ).then(data => {
                if (data.code == 200) {
                    this.showMsg("删除成功")
                    this.getList()
            }else {
                    this.showMsg(data.msg);
                }}, data => {
                this.showMsg("删除失败,请重试");
            })
         },
         up() {
            
            let arr = []
            this.dataList.forEach( item => {
                if(item.checked == true ){
                     arr.push(item.spuId)
                }
            })
            if(arr.length ==0){
                this.showMsg("请先选中商品")
                return
            }
             if(this.upflag){
                this.showMsg("点击过于频繁")
                return
            }
            this.upflag = true
            setTimeout(()=>{
                this.upflag = false
            },3000)
            client.postData( SPU_EDIT_UP_DOWN ,  { "ids": arr, "spuShelvesStatus": 1 }).then(data => {
                if (data.code == 200) {
                    this.showMsg("上架成功")
                    this.getList()
            }else {
                    this.showMsg(data.msg);
                }}, data => {
                this.upflag = false
                this.showMsg("上架失败,请重试");
            })
         },
         down() {
            
            let arr = []
            this.dataList.forEach( item => {
                if(item.checked == true ){
                     arr.push(item.spuId)
                }
            })
             if(arr.length ==0){
                this.showMsg("请先选中商品")
                return
            }  
            if(this.downflag){
                this.showMsg("点击过于频繁")
                return
            }
            this.downflag = true
            setTimeout(()=>{
                this.downflag = false
            },3000)
            client.postData( SPU_EDIT_UP_DOWN ,  { "ids": arr, "spuShelvesStatus": 0 }).then(data => {
                if (data.code == 200) {
                    this.showMsg("下架成功")
                    this.getList()
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.downflag = false
                this.showMsg("下架失败,请重试");
            })
         },
        //根据售价升降序
        orderBy( val ) {
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
                 $("#asc").show()
                $("#desc").hide()
               options.orderBy = 0
            }else{
                $("#desc").show()
                $("#asc").hide()
               options.orderBy = 1
            }
             client.postData( SPU_GET_LIST , options).then(data => {  //192.168.4.249
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
        //隐藏订单
        hideDialog3() {
                this.showorderDialog = false;
                setTimeout(() => {
                this.onhide('cancel');
            }, 300)
        },
        order(val,name) {
            this.oospuid = val
            this.ordertitle = name+"---订单列表"
            this.ooflag = !this.ooflag
            this.showorderDialog = true
        },
        hideDialog2() {
                this.showpreDialog = false
                setTimeout(() => {
                this.onhide('cancel');
            }, 300)
        },
        previewpro(val) {
            setTimeout(()=>{
                this.lspuid = val
                this.limgflag = !this.limgflag
                this.lflag = !this.lflag
                this.showpreDialog = true;
            },100)          
        },
        productexport() {
            if(this.exportflag){
                this.showMsg("点击过于频繁")
                return
            }
            this.exportflag = true
            setTimeout(()=>{
                this.exportflag = false
            },5000)
            let options;
                // 拿最后一次请求的参数
                //options = this.lastSearchOptions;
            //options = Object.assign({}, this.searchOptions);
            options = this.searchOptions
            this.isLoading = true;
            this.dataList = [];
            /*console.log( this.searchOptions)
            console.log(options)
            return*/
            this.spuName =  JSON.stringify({"spuName":options.spuName,"spuCatId":options.spuCatId,"spuCode":options.spuCode,"skuCode":options.skuCode,"saleStatus":options.saleStatus,}) +""
            $("input[name='request']").val(JSON.stringify({"spuName":options.spuName,"spuCatId":options.spuCatId,"spuCode":options.spuCode,"skuCode":options.skuCode,"saleStatus":options.saleStatus,"showCatIdList":options.showCatIdList}) +"")
            var url= SPU_EXPORT // 
            $("#exportForm").attr("action",url);  
            $("#exportForm").submit();  
            this.getList()
        },
        search(){
            this.flag = ! this.flag
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
                }, 100)
                setTimeout(() => {
                    //重新加入
                    this.destroyControlDialog = false;
                }, 200)
                this.getList();
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
                }, 200)
                this.getList();
            }

         } ,
        //点击改变样式
        changeClass(obj) {
                $("#desc").show()
                $("#asc").hide()
             $("#"+obj).removeClass("select").addClass("cha");
            if(obj == "1"){
              $("#2,#3").removeClass("cha").addClass("select");
                this.par = 1
            }else if(obj == "2"){
                $("#1,#3").removeClass("cha").addClass("select");
                this.par = 2
            }else{
                $("#2,#1").removeClass("cha").addClass("select");
                this.par = 3
            }
             //this.getList(false,true);
             
        },
        showEditspu(item, name , type) {
            this.kflag = !this.kflag
            this.controlType = type;
            this.spu = item
            this.spuname = name
            console.log(1)
            console.log(this.spu)
            this.showEditspuDialog = true;  
        },
        //打开编辑页面
        showEdit(item, type) {
            this.pflag = !this.pflag
            this.controlType = type;
            this.spu = 0
            this.spu = item
            console.log(this.spu)
            this.show()
            
        },
        show(){
             
             this.showEditDialog = true;
        },
        //添加良言
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
        showControlFunc(item, type) {
            this.controlType = type;
             //this.showEditDialog = true;
            //console.log(item);
            if (!item) {
                if (this.selectItems.length != 0) {
                    this.clickItems = this.selectItems;
                    this.showControl = true;
                }
            } else {
                this.clickItems = typeof item == 'array' ? item : [item];
                if (type == 'edit') {
                    this.expertEditId = item.componentId;
                    this.showAddDialog = true;
                } else {
                    this.showControl = true;
                }
            }
        },
        hideControlFunc(type) {
            if (type == 'success') {
                this.getList();
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
            // 统计数据
            //this.getCount(options);
            //options.componentType = [12];

            /*this.dataList =  {"code":200,"msg":"操作成功","serverTime":"0","data":[{"maxSalePrice":110.00,"minSalePrice":110.00,"totalStockNum":110,"totalSaleNum":1,"spuId":"900646218680655873","spuName":"iphone","spuCreatedTime":1503566566000,"spuModifyTime":1503567684000},{"maxSalePrice":0,"minSalePrice":0,"totalStockNum":0,"totalSaleNum":0,"spuId":"901979298590777344","spuName":"string","spuCreatedTime":1503883598000,"spuModifyTime":1503883598000},{"maxSalePrice":0,"minSalePrice":0,"totalStockNum":0,"totalSaleNum":0,"spuId":"901979298590777345","spuName":"string","spuCreatedTime":1503883600000,"spuModifyTime":1503883600000},{"maxSalePrice":0,"minSalePrice":0,"totalStockNum":0,"totalSaleNum":0,"spuId":"901979298590777346","spuName":"string","spuCreatedTime":1503883600000,"spuModifyTime":1503883600000},{"maxSalePrice":0,"minSalePrice":0,"totalStockNum":0,"totalSaleNum":0,"spuId":"901979298590777347","spuName":"string","spuCreatedTime":1503883600000,"spuModifyTime":1503883600000},{"maxSalePrice":0,"minSalePrice":0,"totalStockNum":0,"totalSaleNum":0,"spuId":"901979298590777348","spuName":"string","spuCreatedTime":1503883600000,"spuModifyTime":1503883600000},{"maxSalePrice":0,"minSalePrice":0,"totalStockNum":0,"totalSaleNum":0,"spuId":"901979298590777349","spuName":"string","spuCreatedTime":1503883600000,"spuModifyTime":1503883600000},{"maxSalePrice":0,"minSalePrice":0,"totalStockNum":0,"totalSaleNum":0,"spuId":"901979298590777350","spuName":"string","spuCreatedTime":1503883601000,"spuModifyTime":1503883601000},{"maxSalePrice":0,"minSalePrice":0,"totalStockNum":0,"totalSaleNum":0,"spuId":"901979298590777351","spuName":"string","spuCreatedTime":1503883601000,"spuModifyTime":1503883601000},{"maxSalePrice":0,"minSalePrice":0,"totalStockNum":0,"totalSaleNum":0,"spuId":"901979298590777352","spuName":"string","spuCreatedTime":1503883601000,"spuModifyTime":1503883601000}],"page":{"currentPage":1,"pageSize":10,"startIndex":0,"totalPage":6,"totalSize":52}}.data*/
            client.postData( SPU_GET_LIST , options).then(data => {  //192.168.4.249
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
            })
        },



        */
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
            this.showEditDialog = false
            this.showAddDialog = false
            this.showEditspuDialog = false
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