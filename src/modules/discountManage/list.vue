<template>
<!-- 限时折扣-列表页面 -->
    <div style="background-color:white">
        <div class="page-bar min-bar">
            <page-title-bar>
                <span slot="title">限时折扣列表{{countDesc}}</span>
            </page-title-bar>
            <a><div  id="-1" class="cha2"    style="float:left"  @click="changeClass(-1)">所有限时折扣</div></a>  
            <a><div  id="0" class="select2"  style="float:left"  @click="changeClass(0)">未开始</div></a>   
            <a><div  id="2" class="select2"  style="float:left"  @click="changeClass(2)">进行中</div></a>
            <a><div  id="1" class="select2"  style="float:left"  @click="changeClass(1)">已结束</div></a>
            <br>
                <p style="text-align:center">
                    <hr style="height:3px;background-color:gray;width:99%;margin-left:0.4%" >
                </p>
            <br> 
            <button class="btn" type="button"  @click="addItem('add')" style="margin-left:6px;float:left;margin-top:10px;background-color: #66CC33;color:white"  v-if="limitResource.discount_add">新建限时折扣</button>
            <span style="float:right;display:inline-block;margin-bottom:10px;margin-right:0.4%">
                 <span  style="display:inline-block;"> 
                       <search :onchange="changeSearchOptions" :oncreate="getList" :parent="par" :cflag="flag" ></search>
                 </span>
                 <button class="btn green-meadow" @click="search()" type="button" style="background-color:#66CC33">搜索</button>
            </span>
            <br>
            <!-- <div class="col-md-12 right" style="display:inline-block">
                <span v-if="selectItems.length>0" class="desc">已选
                    <em>{{selectItems.length}}</em> 项 </span>
            </div> -->
        </div>
        <div class="contentBlock" id="contentList">
            <div class="table-responsive col-md-12">
                <table class="table table-striped table-bordered table-hover " id="discount" >
                    <thead>
                        <tr style="background-color:#D7D7D7;height:45px">
                            <!--  <th style="width:4%">
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll">全选</button>
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList">反选</button>
                            </th> -->
                            <th style="width:35%;">活动名称</th>
                            <th style="width:20%;">有效时间</th>
                            <th style="width:13%;">活动标签
                                <!--  <a id="desc"  class="orderBy" style="text-decoration:none" @click="orderBy(false)">▼</a>
                                <a id="asc" class="orderBy" style="display:none;text-decoration:none" @click="orderBy(true)">▲</a> -->
                            </th>
                            <th style="width:12%;">活动状态</th>
                            <th style="">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in dataList" @click="selectItem(item)">
                            <!-- 全选反选 <td style="text-align:center;vertical-align:middle;">
                                <input type="checkbox" :checked="item.checked"></input>
                            </td> -->
                            <td style="text-align:center;vertical-align:middle;">
                                <!-- <p>
                                    <a target="_blank" :href="item.imgUrl" title="查看大图">
                                        <img :src="item.imgUrl" class="img-rounded" style="height:60px; width:80px">
                                    </a>
                                </p> -->
                                <!-- <a  style="text-decoration:none;" title="预览商品"  @click.stop="previewpro(item.spuId)"> 
                                    <h4 class="tt"><p style="color:#6699CC">商品编码:{{item.spuCode}}</p>{{item.spuName}}</h4>
                                </a> --> 
                                {{item.mkcName}}
                            </td>
                            <td style="width:13%;text-align:center;vertical-align:middle;font-family: 'Arial Normal', 'Arial';font-weight: 400; font-style: normal;">
                                {{item.mktStart|filterTime}} 至<br>  {{item.mktEnd|filterTime}}
                            </td>
                            <td style="text-align:center;vertical-align:middle;">
                                <!--  商品状态 -->
                                <!--  <span class="label label-default" v-if="item.deployStatus==4">{{item.spuCatId|filterStatus}}</span>
                                <template v-else>
                                    <span class="label label-success" v-if="item.deployStatus==2">{{item.spuReferLayout|filterStatus}}</span>
                                    <span class="label label-info" v-else>{{item.spuReferLayout|filterStatus}}</span>
                                </template> -->
                                <p style="padding-top:5px;">
                                    <button class="btn" type="button"  style="background-color:#FF0000;color:white">限时折扣</button>
                                    <!--  <span class="label label-default" v-if="item.spuReferLayout!=1">下架</span> -->
                                    <!--   <span class="label label-success" v-else>上架</span> -->
                                </p>
                            </td>
                            <td style="text-align:center;vertical-align:middle;">
                                <span v-if="item.mkcStatus == 0">未开始</span>
                                <span v-if="item.mkcStatus == 2">进行中</span>
                                <span v-if="item.mkcStatus == 1">已结束</span>
                            </td>
                            <!--   <td style="text-align:center;vertical-align:middle;">{{item.spuModifyTime|filterTime}}</td>
                            <td style="text-align:center;vertical-align:middle;">{{item.spuModifyTime|filterTime}}</td> -->
                            <td style="text-align:center;vertical-align:middle;">
                                        <!-- v-if="limitResource.expert_info_edit" 编辑的权限控制-->
                                <span v-if="item.mkcIsInvalid == 1 " >已失效</span>
                                <span v-if="item.mkcIsInvalid == 0 ">
                                    <button type="button" class="btn btn-xs blue" @click.stop="editItem(item.mkcCampaignId)" v-if="limitResource.discount_edit && par != 1">编辑</button>
                                    <button type="button"  class="btn btn-xs yellow-crusta"  @click.stop="showControlFunc(item.mkcCampaignId,'submit')" v-if="limitResource.discount_invalidate">使失效</button>
                                    <button type="button"  @click.stop="showControlFunc(item.mkcCampaignId,'delete')" class="btn btn-xs red" v-if="limitResource.discount_delete">删除</button>
                                </span>
                                <!-- <button type="button" v-show="(item.deployStatus==3||item.deployStatus==4)" @click.stop="showControlFunc(item,'submit')" v-if="limitResource.expert_info_submit" class="btn btn-xs purple">提交</button>
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
            <!-- <input type="hidden" name="skuCode" v-model="skuCode"/> 
            <input type="hidden" name="spuCatId" v-model="spuCatId"/> 
            <input type="hidden" name="skuCode" v-model="skuCode"/> -->
        </form>
        <!-- 分页 -->
        <paging :current-page="page.currentPage" :page-size="page.pageSize" :start-index="page.startIndex" :total-page="page.totalPage" :total-size="page.totalSize" :change="getList"></paging>
        <control :show="showControl" :items="clickItems" :onhide="hideControlFunc" :type="controlType"></control>
        <!-- 限时折扣-新建/编辑弹框 -->
        <add-discount v-if="!destroyControlDialog" :id="expertEditId" :show="showAddDialog" :onhide="hideAddDialog"  :closepar="getList" :dflag="disflag" :mkcid="mkid"></add-discount> 
        <m-alert :title="'提交'" :show-cancel-btn="true" :show="showSubmitDialog" :onsure="ajaxControl" :onhide="hideMsg">
            <div slot="content">确定提交吗？</div>
        </m-alert>
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
        <loading :show="isLoading"></loading>
    </div>
</template>

<script>
import client from '../../common/utils/client';
import { pageTitleBar, paging, itemControl, mMultiSelect, mAlert, mSelect } from '../../components';
import search from './search';
import control from './control';
import loading from '../common/loading';
import addDiscount from './addDiscount';
/*import orderList from './orderList';
import preview from './preview';
import manageControl from './manageControl';
import productControl from './productControl';
import EditProductControl from './EditProductControl';
import EditSkuControl from './EditSkuControl';*/

let vueThis = null;

export default {
    components: { pageTitleBar, paging, itemControl, mAlert, mMultiSelect, mSelect, search, control, addDiscount, loading,/* manageControl,productControl,categoryControl,EditProductControl,EditSkuControl,preview ,orderList*/ },
    data() {
        return {
            disflag:false,
            mkid:0,
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
            par : -100,
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
        editItem(id) {
            this.mkid = id;
            this.disflag = !this.disflag;
            this.showAddDialog = true;
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
        //隐藏订单
        hideDialog3() {
            this.showorderDialog = false;
            setTimeout(() => {
                this.onhide('cancel');
            }, 300);
        },
        order(val,name) {
            this.oospuid = val;
            this.ordertitle = name+"---订单列表";
            this.ooflag = !this.ooflag;
            this.showorderDialog = true;
        },
        hideDialog2() {
            this.showpreDialog = false;
            setTimeout(() => {
                this.onhide('cancel');
            }, 300);
        },
        previewpro(val) {
            this.lspuid = val;
            this.limgflag = !this.limgflag;
            this.lflag = !this.lflag;
            this.showpreDialog = true;
        },
        productexport() {
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
            this.spuName =  JSON.stringify({"spuName":options.spuName,"spuCatId":options.spuCatId,"spuCode":options.spuCode,"skuCode":options.skuCode,}) +""
            $("input[name='request']").val(JSON.stringify({"spuName":options.spuName,"spuCatId":options.spuCatId,"spuCode":options.spuCode,"skuCode":options.skuCode,}) +"")
            var url = SPU_EXPORT; // 
            $("#exportForm").attr("action",url);  
            $("#exportForm").submit();  
            this.getList();
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
                }, 100);
                setTimeout(() => {
                    //重新加入
                    this.destroyControlDialog = false;
                }, 200);
                this.getList();
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
            }else  if(obj == "2"){
                $("#-1,#0,#1").removeClass("cha2").addClass("select2");
                this.par = 2;
            }else{
                $("#0,#2,#-1").removeClass("cha2").addClass("select2");
                this.par = 1;
            }
        },
        showEditspu(item, name , type) {
            this.kflag = !this.kflag;
            this.controlType = type;
            this.spu = item;
            this.spuname = name;
            //console.log(1);
            //console.log(this.spu);
            this.showEditspuDialog = true;  
        },
        //打开编辑页面
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
        //添加良言
        addItem(val) {
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
        showControlFunc(item, type) {
            this.clickItems = [];
            this.controlType = type;this.showControl = true;
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
            })
        },*/
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
.select2{
    margin-left: 3px;
    border:10px solid gray;
    border-bottom:0px solid white;
    border-width:1px;
    height: 30px;
    width: 100px;
    display:inline-block;
    text-align:center;
    line-height: 30px;
    font-weight:bold;
};
.cha2{
    margin-left: 6px;
    color:white;
    border-width:1px;
    height: 30px;
    width: 100px;
    display:inline-block;
    text-align:center;
    line-height: 30px;
    background-color: #66CC33
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
#discount td{
    border-right:none; 
    border-left:none;
}
#discount th{
    border-right:none; 
    border-left:none;
}
</style>