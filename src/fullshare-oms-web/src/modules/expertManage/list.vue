<template>

    <div>
        <div class="page-bar min-bar">
            <page-title-bar>
                <span slot="title">商品管理{{countDesc}}</span>
            </page-title-bar>
            <a><div  id="1" class="cha"      @click="changeClass(1)">出售中</div></a>  
            <a> <div id="2" class="select"   @click="changeClass(2)">已售罄</div></a>   
            <a><div  id="3" class="select"   @click="changeClass(3)">仓库中</div></a>
            <search :onchange="changeSearchOptions" :oncreate="getList" :parent="par" :cflag="flag"></search>
            <br>
            <div class="col-md-12 right">
                <span v-if="selectItems.length>0" class="desc">已选
                    <em>{{selectItems.length}}</em> 项 </span>
                <button class="btn green" type="button"  @click="addItem()" style="margin-left:10px;">发布商品{{name}}</button>
               <!--  v-if="limitResource.expert_info_add" 添加按钮的权限-->
                <button class="btn blue" type="button" @click="showControlFunc(null,'publishAll')">修改模板</button>
                <button class="btn default" type="button" @click="showControlFunc(null,'submitAll')">下架</button>
                <button class="btn purple" type="button" @click="showControlFunc(null,'rejectAll')">删除</button>
                <button class="btn yellow-crusta" type="button" @click="showControlFunc(null,'withdrawAll')">导出</button>
                <button class="btn green-meadow" @click="search()" type="button">搜索</button>
            </div>
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
                            <th style="width:36%;">商品信息</th>
                            <th style="width:7%;">丰盛榜售价</th>
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
                                    <a target="_blank" :href="img" title="查看大图">
                                        <img :src="item.imgUrl" class="img-rounded" style="height:60px; width:80px">
                                    </a>
                                </p>
                               <a  style="text-decoration:none;" title="预览商品"> <h4 class="tt">{{item.spuName}}</h4>
                                <p style="color:#6699CC">{{item.spuId}}</p> </a>

                            </td>
                            <td>{{item.totalSaleNum}}
                                 <!--  商品状态 -->
                                    <span class="label label-default" v-if="item.deployStatus==4">{{item.spuCatId|filterStatus}}</span>
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
                                </p>
                            </td>
                            <td style="width:13%">{{"￥"+item.minSalePrice+"~￥"+item.maxSalePrice}}</td>
                            <td>{{item.totalStockNum}}</td>
                            <td>{{item.spuModifyTime|filterTime}}</td>
                            <td>{{item.spuModifyTime|filterTime}}</td>
                            <td>
                                        <!-- v-if="limitResource.expert_info_edit" 编辑的权限控制-->
                            <button type="button"  class="btn btn-xs blue" @click.stop="showEdit(item.spuId,'edit')">编辑</button>
                            <button type="button"  class="btn btn-xs yellow-crusta" @click.stop="showEditspu(item.spuId,'edit')">查看SKU列表</button>

                                    <button type="button" v-show="(item.deployStatus==3||item.deployStatus==4)" @click.stop="showControlFunc(item,'submit')" v-if="limitResource.expert_info_submit" class="btn btn-xs purple">提交</button>
                                    <button type="button" v-show="(item.deployStatus==5||item.deployStatus==1)" @click.stop="showControlFunc(item,'publish')" v-if="limitResource.expert_info_deploy" class="btn btn-xs purple">发布</button>
                                    <button type="button" v-show="(item.deployStatus==5)" @click.stop="showControlFunc(item,'reject')" v-if="limitResource.expert_info_reject" class="btn btn-xs default">拒绝</button>
                                    <button type="button" v-show="(item.submitStatus!=1)" @click.stop="showControlFunc(item,'putaway')" v-if="limitResource.expert_info_putaway" class="btn btn-xs default">上架</button>
                                    <button type="button" v-show="item.submitStatus==1" @click.stop="showControlFunc(item,'soldOut')" v-if="limitResource.expert_info_soldOut" class="btn btn-xs default">下架</button>
                                    <button type="button" v-show="(item.deployStatus==2)" @click.stop="showControlFunc(item,'withdraw')" v-if="limitResource.expert_info_withdraw" class="btn btn-xs default">撤回</button>
                                    <button type="button" v-if="limitResource.expert_info_delete" @click.stop="showControlFunc(item,'delete')" class="btn btn-xs red">删除</button>
                                  
                            </td>
                        </tr>
                        <tr v-if="dataList.length==0">
                            <td colspan="9" class="center">暂无数据</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <paging :current-page="page.currentPage" :page-size="page.pageSize" :start-index="page.startIndex" :total-page="page.totalPage" :total-size="page.totalSize" :change="getList"></paging>
        <!-- 创建专家弹窗 -->
         <!--  <product-control v-if="!destroyControlDialog" :id="expertEditId" :show="showAddDialog" :onhide="hideAddDialog"></product-control> -->  
         <category-control v-if="!destroyControlDialog" :id="expertEditId" :show="showAddDialog" :onhide="hideAddDialog"  :closepar="getList"></category-control> 
         <edit-product-control v-if="!destroyControlDialog" :id="expertEditId" :show="showEditDialog" :spuid="spu" :onhide="hideEditDialog" :proflag="pflag"></edit-product-control> 
         <edit-sku-control v-if="!destroyControlDialog" :id="expertEditId" :show="showEditspuDialog" :spuid2="spu" :onhide="hideEditspuDialog" :skuflag="kflag"></edit-sku-control> 
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
    
    components: { pageTitleBar, paging, itemControl, mAlert, mMultiSelect, mSelect, search, control, loading, manageControl,productControl,categoryControl,EditProductControl,EditSkuControl},
    data() {
        return {
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
        showEditspu(item, type) {
            this.kflag = !this.kflag
            this.controlType = type;
            this.spu = item
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

            client.postData("http://192.168.4.249:8086/eb-manager/spu/listSpu", options).then(data => {  //192.168.4.249
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
        this.getList()
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
    margin-left: 20px;
    border:10px solid white;
    border-width:1px;
    height: 30px;
    width: 100px;
    display:inline-block;
    text-align:center;
    line-height: 30px;
    font-weight:bold;
};
.cha{
    margin-left: 20px;
    border:10px solid #6699CC;
    border-width:1px;
    height: 30px;
    width: 100px;
    display:inline-block;
    text-align:center;
    line-height: 30px;
    
};
td{
    text-align: center;
    vertical-align: middle
};
 .tt:hover {
   color:#6699CC
};

</style>