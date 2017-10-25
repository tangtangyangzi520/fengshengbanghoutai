<template>
<!-- 限时折扣-选择商品页面(多选) -->
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1200px'" >
            <div slot="content">
                <div class="col-md-12 right">
                    <div class="col-md-1 right"></div>
                    <div class="col-md-2 right">
                        <select v-model="searchType" class="type form-control">
                            <option v-for="item in searchList" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                    <div class="col-md-4 right">
                        <input type="text" class="form-control" placeholder="请输入" v-model="searchWord">
                    </div>
                    <div class="col-md-1 right">
                        <button class="btn blue" type="button" @click="getUnSelectedList(false,true)">搜索</button>
                    </div>  
                    <div class="col-md-4 right"></div> 
                </div>
                </br>
                </br>
                </br>
                <div class="col-md-3 left">
                    <label for="title" class="control-label" style="margin-left:7%;">商品分类</label>
                </div>
                <div class="col-md-4 left">
                    <label for="title" class="control-label" style="margin-left:2%;">未选择</label>
                </div>
                <div class="col-md-1"></div>
                <div class="col-md-4 left">
                    <label for="title" class="control-label" style="margin-left:-2%;">已选择</label>
                </div>
                <div class="col-md-12">
                    <!-- 商品类目树 -->
                    <div class="col-md-3 left" style="height:400px;overflow:auto;">
                        <div class="tree-demo jstree jstree-1 jstree-default">
                            <ul class="jstree-container-ul jstree-children jstree-wholerow-ul jstree-no-dots">
                                <treeview  :model="treeList" :select="selectItem"></treeview>
                                <template v-for="model in selectListSearch">
                                    <treeview :model="model" :select="selectItem"></treeview>
                                </template>
                            </ul>
                        </div> 
                    </div>
                    <!-- 未选择的商品列表 -->
                    <div class="col-md-4">
                        <table class="table table-striped table-bordered table-hover" id="sku-content-table">
                            <thead>
                                <tr>
                                    <th style="width:10%">
                                        <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll(this.unSelectedList)">全选</button>
                                        <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList(this.unSelectedList)">反选</button>
                                    </th>
                                    <th style="width:70%;">商品信息</th>
                                    <th style="width:20%;">库存</th>
                                </tr>
                            </thead>
                            <tbody >
                                <tr v-for="item in unSelectedList" @click="selectOne(item)">
                                    <td style="text-align:center;vertical-align:middle;">
                                        <input type="checkbox" :checked="item.checked"></input>
                                    </td>
                                    <td class="tdTitle" style="text-align:center;vertical-align:middle;">
                                        <p>
                                            <a target="_blank" :href="item.imgUrl" title="查看大图">
                                                <img :src="item.imgUrl" class="img-rounded" style="height:55px; width:75px;">
                                            </a>
                                        </p>
                                        <h4 class="tt"><p style="color:#6699CC;font-size:10px;">{{item.spuName}}</p><span style="color:red;">¥{{item.minSalePrice}}</span></h4>
                                    </td>
                                    <td style="text-align:center;vertical-align:middle;">{{item.totalStockNum}}</td>
                                </tr>
                                <tr v-if="unSelectedList.length==0">
                                    <td colspan="9" class="center">暂无数据</td>
                                </tr>
                            </tbody>
                        </table>
                        <!-- 分页条 -->
                        <paging v-if="unSelectedList.length>0" :current-page="page.currentPage" :page-size="page.pageSize" :start-index="page.startIndex" :total-page="page.totalPage" :total-size="page.totalSize" :change="getUnSelectedList"></paging>
                        <!-- <h4 v-if="unSelectedList.length>0" style="text-align:center" >共 {{unSelectedList.length}}条数据</h4> -->
                    </div>
                    <!-- 选择按钮 -->
                    <div class="col-md-1">
                        <button class="btn blue" type="button" style="margin-left:25%;" @click="selectSpu()">&gt;&gt;</button>
                        </br>
                        </br>
                        <button class="btn blue" type="button" style="margin-left:25%;" @click="unSelectSpu()">&lt;&lt;</button>
                    </div>
                    <!-- 已选择的商品列表 -->
                    <div class="col-md-4">
                        <table class="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style="width:10%">
                                        <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll(this.selectedList)">全选</button>
                                        <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList(this.selectedList)">反选</button>
                                    </th>
                                    <th style="width:70%;">商品信息</th>
                                    <th style="width:20%;">库存</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in selectedList" @click="selectOne(item)">
                                    <td style="text-align:center;vertical-align:middle;">
                                        <input type="checkbox" :checked="item.checked"></input>
                                    </td>
                                    <td class="tdTitle">
                                        <p>
                                            <a target="_blank" :href="item.imgUrl" title="查看大图">
                                                <img :src="item.imgUrl" class="img-rounded" style="height:55px; width:75px;">
                                            </a>
                                        </p>
                                        <h4 class="tt"><p style="color:#6699CC;font-size:10px;">{{item.spuName}}</p><span style="color:red;">¥{{item.minSalePrice}}</span></h4>
                                    </td>
                                    <td style="text-align:center;vertical-align:middle;">{{item.totalStockNum}}</td>
                                </tr>
                                <tr v-if="selectedList.length==0">
                                    <td colspan="9" class="center">暂无数据</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
             </div>
            <span slot="btnList">
                <div style="text-align:center;">
                    <button type="button" @click.stop="sendData" class="btn default blue">确定</button>
                    <button type="button" class="btn default" data-dismiss="modal">取消</button>
                </div>
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
import paging from '../discountManage/paging';
import loading from './loading';
import treeview from './tagTreeItem';
import { showSelectPic, getSelectPicList } from '../../vuex/actions/actions.resource';

export default {
    components: { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList, loading, treeview, paging },
    props: {
        spulist:[],
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
    },
    data() {
        return {
            isLoading: false,
            isShow:false,
            parentIds : 0,
            showDialog: false,
            page: {},   // 分页请求数据
            showPage: false,
            componentShowOption: {},
            searchOptions:{
                "spuCatId":0,//类目id
                "spuCode":'',//spu商品编码
                "spuName":'',//商品名称
                "skuCode":'',//sku商品编码
                "saleStatus":0,
                "orderBy":-1,
                "showCatIdList":[],
                "page": {
                    // "currentPage": 0,
                    // "pageSize": 0,
                    // "startIndex": 0,
                    // "totalPage": 0,
                    // "totalSize": 0
                },
            },
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '选择活动商品',
            searchList:[{id:1,name:'商品编码'},{id:2,name:'商品名称'}],
            searchType:1,
            searchWord:'',
            treeList: [],
            selectListSearch: [], // 搜索结果标签
            selectList: [], // 已选标签
            unSelectedList:[],//未选商品列表
            selectedList:[],//已选商品列表
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
        //过滤未选择数据
        filterList(){
            //console.log(this.selectedList+"selectedList")
            let sourceList=this.unSelectedList,targetList=this.selectedList,index,index2;
            // let arr = []
            for (index = sourceList.length-1; index >=0; index--){
                for (index2 = targetList.length-1; index2 >=0; index2--){
                    if(sourceList[index].spuId==targetList[index2].spuId){
                        sourceList.splice(index,1);
                        //arr.push(index2)
                        break;
                    }
                }
            }
            /*if(arr.length < targetList.length){
                for(let i = 0; i < targetList.length; i++){
                    let flag = true
                    for(let j = 0; j < arr.length; j++){
                        if(arr[j] == i){
                            flag = false
                            break
                        }
                    }
                    if(flag){
                        targetList.splice(i,1);
                    }
                }
            }*/
        },
        //将数据传给父类
        sendData(){
            this.$emit('spu-data', this.selectedList);
            this.hideDialog();
        },
        //将一个list中选中的数据转移到另一个list中
        moveData(sourceList,targetList){
            let index;
            if( sourceList.length > 0 ){
                for (index = sourceList.length-1; index >=0; index--){
                    if(sourceList[index].checked==true){
                        targetList.push(sourceList[index]);
                        sourceList.splice(index,1);
                    }
                }
            }
        },
        selectSpu(){
            this.moveData(this.unSelectedList,this.selectedList);
        },
        unSelectSpu(){
            this.moveData(this.selectedList,this.unSelectedList);
        },
         //拿到树形数据
        getTreeList(typeId) {
            this.isLoading = true;
            //
            client.postData(TAG_LIST_GET + '?typeId=' + typeId, {}).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    data.data.root.children.forEach(item => {
                        this.filterData(item);
                    });
                    data.data.root.isOpen = true;
                    data.data.root.isSelected = false;
                    data.data.root.isShow = true;
                    this.treeList = data.data.root; 
                    //console.log(this.treeList);
                    // this.selectList = Array.from(this.selectListSet);
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
            });
        },
        // 处理树形数据
        filterData(item) {
            item.isOpen = false;
            item.isSelected = false;
            if (this.selectList.find(subitem => item.id == subitem.id)) {
                // 替换掉传进来的数组，方便做数据关联变动
                let index = this.selectList.findIndex(subitem => item.id == subitem.id);
                item.isSelected = true;
                this.selectList.splice(index, 1, item);
                this.selectListSet = new Set();
                this.selectList.forEach(o => {
                    this.selectListSet.add(o);
                });
            }
            item.isShow = true;
            if (item.children.length != 0) {
                item.children.forEach(subitem => {
                    this.filterData(subitem);
                });
            }
        },
         // 选中一个项时触发
        selectItem(item) {
            client.getParentIdList(this.treeList, item);
            this.searchOptions.spuCatId=item.id;
            this.getUnSelectedList(false, true);
        },
        // 全选
        selectAll(list) {
            list.forEach(item => {
                item.checked = true;
            });
        },
        // 反选
        reverseList(list) {
            list.forEach(item => {
                item.checked = !item.checked;
            });
        },
        // 单选
        selectOne(item){
            item.checked = !item.checked;
        },
        //获取未选商品数据
        getUnSelectedList(page, firstSearch){
            let options;
            //判断查询条件
            if(this.searchType==2){// 按商品名称搜索
                this.searchOptions.spuCode ='';
                this.searchOptions.spuName =this.searchWord;
            }else{// 按商品编码搜索
                this.searchOptions.spuName ='';
                this.searchOptions.spuCode =this.searchWord;
            }
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
            this.unSelectedList = [];
            this.lastSearchOptions = options;
            //
            client.postData( SPU_GET_LIST_SKU , options).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    //console.log(data);
                    data.data.forEach(item => {
                        item.checked = false;
                        item.skuList.forEach(sku => {
                            sku.checked = false;
                            sku.skureduce = '';
                        });
                    });
                    this.unSelectedList = data.data;
                    this.filterList();
                    this.page = data.page;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
            });
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
                this.onhide('cancel');
            }, 300);
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
        handlerSearch(item) {
            item.isShow = true;
            if (this.searchKey.replace(/\s/g, '') != '') {
                if (item.text.indexOf(this.searchKey) == -1 && this.searchKey.replace(/\s/g, '') != '') {
                    item.isShow = false;
                } else {
                    this.selectListSearch.push(item);
                    //console.log(item);
                }
            }
            if (item.children.length != 0) {
                item.children.forEach(subitem => {
                    this.handlerSearch(subitem);
                });
            }
        },
        selectLabelPropFunc(item) {
            if (item == '') {
                this.labelTypeActive = this.labelType[1];
            } else {
                this.labelTypeActive = item;
            }
            this.selectListSearch = [];
            this.searchKey = '';
            this.getTreeList(this.labelTypeActive.id);
        },
    },
    computed(){
        
    },
    created() {
        this.getTreeList(100);
    },
    watch: {
        show() {
            this.showPage = this.show;
            this.showDialog = this.show;
            if(!this.show)return;
            this.selectedList = [];
            this.spulist.forEach(item=>{
                this.selectedList.push(item);
            });
            if(this.searchOptions.spuCatId > 100){
                 this.getUnSelectedList(false,true);
            }
        },
    },
    ready() {
        this.typesList = client.global.componentTypes;
    },
    beforeDestroy() {
    }
};
</script>