<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1200px'" >
             <div slot="content">
                <div class="col-md-12 right">
                    <div class="col-md-2 right">
                        <!-- <m-select :data="searchList" :placeholder="'商品编码'" :change-func="selectSearchFunc" :class="'fixedIcon'" v-model="searchType"></m-select> -->
                        <select v-model="searchType" class="type">
                            <option v-for="item in searchList" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                    <div class="col-md-4 right">
                        <input type="text" class="form-control" placeholder="请输入" v-model="searchWord">
                    </div>
                    <div class="col-md-1 right">
                        <button class="btn blue" type="button" @click="getUnSelectedList(false,true)">搜索</button>
                    </div>   
                    <div class="col-md-5 right">
                    </div>
                </div>
                </br>
                </br>
                </br>
                </br>
                <div class="col-md-12" >
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
                    <!-- 商品列表 -->
                    <div class="col-md-4 right">
                        <table class="table table-striped table-bordered table-hover" id="sku-content-table">
                            <thead>
                                <tr>
                                    <th style="width:20%">
                                       
                                       <!--  <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll(this.unSelectedList)">全选</button>
                                        <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList(this.unSelectedList)">反选</button> -->
                                    </th>
                                    <th style="width:60%;">商品信息</th>
                                    <th style="width:20%;">库存</th>
                                </tr>
                            </thead>
                            <tbody >
                                <tr v-for="item in unSelectedList" @click="selectOne(item)">
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
                                            <h4 class="tt"><p style="color:#6699CC">{{item.spuName}}</p><span style="color:red;">¥{{item.minSalePrice}}</span></h4>
                                        </a>
                                    </td>
                                    <td>{{item.totalStockNum}}</td>
                                </tr>
                                <tr v-if="unSelectedList.length==0">
                                    <td colspan="9" class="center">暂无数据</td>
                                </tr>
                            </tbody>
                        </table>
                        <!-- 分页条 -->
                        <paging v-if="unSelectedList.length>0" :current-page="page.currentPage" :page-size="page.pageSize" :start-index="page.startIndex" :total-page="page.totalPage" :total-size="page.totalSize" :change="getList"></paging>
                    </div>
                    <!-- 选择按钮 -->
                    <div class="col-md-1 right">
                        <button class="btn blue" type="button" @click="selectSpu()">&gt;&gt;</button>
                        </br>
                        </br>
                        <button class="btn blue" type="button" @click="unSelectSpu()">&lt;&lt;</button>
                    </div>
                    <!-- 被选中的商品列表 -->
                    <div class="col-md-4 right">
                        <table class="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                   <!--  <th style="width:10%">
                                        <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll(this.selectedList)">全选</button>
                                        <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList(this.selectedList)">反选</button>
                                    </th> -->
                                    <th style="width:80%;">商品信息</th>
                                    <th style="width:10%;">库存</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in selectedList" @click="selectOne(item)">
                                    <!-- <td style="text-align:center;vertical-align:middle;">
                                        <input type="checkbox" :checked="item.checked"></input>
                                    </td> -->
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
                                    <td>{{item.totalStockNum}}</td>
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
                <button type="button" @click.stop="sendData" class="btn default blue">确定使用</button>
                <button type="button" class="btn default" data-dismiss="modal">取消</button>
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
import { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList,paging } from '../../components';
import loading from '../common/loading';
import treeview from '../common/tagTreeItem';
import { showSelectPic, getSelectPicList } from '../../vuex/actions/actions.resource';
export default {
    components: { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList, loading,treeview,paging },
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
                "saleStatus":1,
                "orderBy":-1,
                "showCatIdList":[],
                "page": {
                    "currentPage": 0,
                    "pageSize": 0,
                    "startIndex": 0,
                    "totalPage": 0,
                    "totalSize": 0
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
            console.log(this.selectedList+"selectedList")
            let sourceList=this.unSelectedList,targetList=this.selectedList,index,index2;
            for (index = sourceList.length-1; index >=0; index--){
                for (index2 = targetList.length-1; index2 >=0; index2--){
                    if(sourceList[index].spuId==targetList[index2].spuId){
                        sourceList.splice(index,1);
                        break;
                    }
                }
            }
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
            if(this.selectedList.length > 0){
                this.selectedList[0].checked=false
                this.unSelectedList.push(this.selectedList[0])
            }
            this.selectedList = []
            this.moveData(this.unSelectedList,this.selectedList);
        },
        unSelectSpu(){
            if(this.selectedList.length > 0){
                this.selectedList[0].checked=false
                this.unSelectedList.push(this.selectedList[0])
            }
            this.selectedList = []
            this.moveData(this.selectedList,this.unSelectedList);
        },
         //拿到树形数据
        getTreeList(typeId) {
            this.isLoading = true;
            client.postData(TAG_LIST_GET + '?typeId=' + typeId, {}).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    data.data.root.children.forEach(item => {
                        this.filterData(item);
                    })
                    data.data.root.isOpen = true;
                    data.data.root.isSelected = false;
                    data.data.root.isShow = true;
                    this.treeList = data.data.root; 
                    console.log(this.treeList);
                    // this.selectList = Array.from(this.selectListSet);
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
            })
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
                })
            }
            item.isShow = true;
            if (item.children.length != 0) {
                item.children.forEach(subitem => {
                    this.filterData(subitem);
                })
            }
        },
         // 选中一个项时触发
        selectItem(item) {
            this.searchOptions.spuCatId=item.id;
            this.getUnSelectedList(false, true);
        },
        selectAll(list) {//全选
            list.forEach(item => {
                item.checked = true;
            })
        },
         reverseList(list) {//反选
            list.forEach(item => {
                item.checked = !item.checked;
            })
        },
        selectOne(item){//单选
            item.checked = !item.checked;
            if(item.checked){
                this.unSelectedList.forEach(data=>{
                    if(item.spuId != data.spuId){
                         data.checked = false 
                    }    
                })
            }
        },
        //获取未选商品数据
        getUnSelectedList(page, firstSearch){
            let options;
            //判断查询条件
            if(this.searchType==2){ 
                this.searchOptions.spuCode ='';
                this.searchOptions.spuName =this.searchWord;
            }else{
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
            client.postData( SPU_GET_LIST_SKU , options).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    data.data.forEach(item => {
                        item.checked = false
                        item.skuList.forEach(sku => {
                            sku.checked = false
                            sku.skureduce = ''
                        })
                    })
                    this.unSelectedList = data.data;
                    this.filterList();
                    this.page = data.page;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
            })
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
                })
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
            this.selectedList=this.spulist;
        },

    },
    ready() {
        this.typesList = client.global.componentTypes;
    },
    beforeDestroy() {
    }
};
</script>