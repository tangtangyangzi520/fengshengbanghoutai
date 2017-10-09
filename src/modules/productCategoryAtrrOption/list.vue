<template>
    <!-- 销售属性-列表页面 -->
    <div>
        <div class="page-bar min-bar">
            <page-title-bar>
                <span slot="title">类目销售属性设置（SKU属性）</span>
            </page-title-bar>
            <div class="col-md-12 right">
                <span v-if="selectItems.length>0" class="desc">已选
                    <em>{{selectItems.length}}</em> 项 </span>   
                <!-- <button class="btn green-meadow" @click="getList(false,true)" type="button">搜索</button> -->
            </div>
            <div style="height:5px;clear:both;"></div>
        </div>
        <!-- 销售属性树菜单 -->
        <div>
            <div class="col-md-3" style="height:500px;overflow:auto;">
                <div class="tree-demo jstree jstree-1 jstree-default">
                    <ul class="jstree-container-ul jstree-children jstree-wholerow-ul jstree-no-dots">
                        <treeview  :model="treeList" :select="selectItem"></treeview>
                        <template v-for="model in selectListSearch">
                            <treeview :model="model" :select="selectItem"></treeview>
                        </template>
                    </ul>
                </div> 
            </div>
            <!-- 销售属性列表 -->
            <div class="col-md-6" id="contentList" style="width:75%;">
                <div><h3>属性列表</h3></div>
                <div><button class="btn green" type="button"  @click="addItem()" v-show="isLastLevel">添加自定义属性</button></div>
                </br>
                <table class="table table-striped table-bordered table-hover" id="category-table">
                    <thead>
                        <tr>
                            <th style="width:15%;">属性名称</th>
                            <th style="width:20%;">属性值</th>
                            <th style="width:15%;">所属类目</th>
                            <th style="width:10%;">创建时间</th>
                            <th style="width:20%;">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="itemobj in dataList" >
                            <td>
                                <div style="padding-top:5px; width:200px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis" title="{{itemobj.pcaName}}">
                                    <!-- <p style="padding-top:5px;"> -->
                                        {{itemobj.pcaName}}
                                    <!-- </p> -->
                                </div>
                            </td>
                            <td>
                                <div style="padding-top:5px; width:200px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis" title="{{ itemobj.pcaoList | filterPcaoList }}">
                                <!-- <p style="padding-top:5px;"> -->
                                    <span>{{ itemobj.pcaoList | filterPcaoList }}</span>
                                <!-- </p> -->
                                </div>
                            </td>
                            <td>
                                <p style="padding-top:5px;">{{ getNameByTreeId(treeList, itemobj.pcraCatId) }}</p>
                            </td> 
                            <td>
                                <p style="padding-top:5px;">{{itemobj.pcaCreatedTime | filterTime}}</p>
                            </td>
                            <td>
                                <p style="padding-top:5px;">
                                    <button type="button" class="btn btn-xs blue" @click.stop="showControlFunc(itemobj,'edit')" v-show="isLastLevel">修改</button>                            
                                    <button type="button"  @click.stop="showControlFunc(itemobj,'delete')" class="btn btn-xs red" v-show="isLastLevel">删除</button>
                                </p>
                            </td>
                        </tr>
                        <tr v-if="dataList.length==0">
                            <td colspan="9" class="center">暂无数据</td>
                        </tr>
                    </tbody>
                </table>
                <!-- 分页 -->
                <paging :current-page="page.currentPage" :page-size="page.pageSize" :start-index="page.startIndex" :total-page="page.totalPage" :total-size="page.totalSize" :change="getList"></paging>     
            </div>
        </div>
       
        <!-- 添加/编辑销售属性页面 -->       
        <saleproductatrr-control v-if="!destroyControlDialog" :selectedid="selectTreeId" :pcaid="pcaEditId" :cat-id="selectTreeId" :show="showAddDialog" :pca-name2="listPcaName" :onhide="hideAddDialog" :pca-list="dataList"></saleproductatrr-control>
        <!-- 编辑销售属性页面 -->
        <!-- <attr-option-control v-if="!destroyControlDialog" :pcaid="pcaEditId" :pca-item="pcaItem2" :show="showDialog" :onhide="hideAddDialog" :pca-name2="listPcaName" :pca-list="dataList"></attr-option-control> -->

        <!-- 提交确认弹出框 -->
        <m-alert :title="'温馨提示'" :show-cancel-btn="true" :show="showSubmitDialog" :onsure="ajaxControl" :onhide="hideMsg">
            <div slot="content">确定提交吗？</div>
        </m-alert> 
        <!--删除确认弹出框-->
        <m-alert :title="'温馨提示'" :show-cancel-btn="true" :show="showControl" :onsure="ajaxControlDel" :onhide="hideMsg">
            <div slot="content">删除此数据可能会影响商品属性的展示,确定删除吗？</div>
        </m-alert>

        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert> 
        <loading :show="isLoading"></loading>
    </div> 
</template>

<script>
import client from '../../common/utils/client';
import { pageTitleBar, paging, itemControl, mMultiSelect, mAlert, mSelect, itemList } from '../../components';
import loading from '../common/loading';
import saleproductatrrControl from './saleproductatrrControl';
import attrOptionControl from './attrOptionControl';
import treeview from '../common/tagTreeItem';

export default {
   
    props: {
        list: Array, // 已选列表
        show: Boolean,
        onselect: Function,
        oncancel: Function
    },
    components: { pageTitleBar, paging, itemControl, mAlert, mMultiSelect,mSelect, loading, saleproductatrrControl, treeview, itemList, attrOptionControl},
    data() {
        return {
            name: '',
            labelType: [],
            labelTypeActive: { id: 0, name: '物理标签' },
            isShow:false,
            isLoading: false,
            treeList: [],
            dataList: [],// 列表list
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            searchKey: '',
            page: {},   // 分页请求数据
            selectListSet: new Set(), // 已选标签Set
            selectList: [], // 已选标签
            selectListSearch: [], // 搜索结果标签
            showAddDialog: false,
            showControl: false,
            showDialog:false,
            selectTreeId:0,//分类树id
            selectTreetext:'',
            parentIds : 0,
            clickItems: [],   //点击操作的数据项
            pcaEditId:'',
            pcaId:'',
            listPcaName:'',// 属性名称,用来传递给子组件
            pcaItem2:{},//被编辑对象
            changeObj:false,
            lastSearchOptions: {},
            controlType:'',
            selRow : {},
            searchOptions: {
                parentIds: 0,
                pcaSaleProp:1,
                pcaAtrrType:2,
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    startIndex: 0,
                    totalPage: 0,
                    totalSize: 0
                }
            },
            isLastLevel: false, //是否显示[添加/编辑/删除]按钮
        }
    },
    filters: {
        filterTime(time) {
            return client.formateTime(time);
        },
        // 格式化属性值
        filterPcaoList(pcaoList){
            let attrs = "";
            for(let i=0; i<pcaoList.length; i++){
                if(pcaoList[i].pcaoUseFlag == 1){
                    if(i != pcaoList.length-1){
                        attrs += pcaoList[i].pcaoName + "、";
                    }else{
                        attrs += pcaoList[i].pcaoName;
                    }
                }
            }
            return attrs;
        }
    },
    methods: {
        // 弹出添加页面
        addItem() {
            // 判断属性数量是否超过4个
            if(this.dataList.length >=4){
                this.showMsg('销售属性数量最多只能4个!');
            }else{
                this.showAddDialog = true;
                this.pcaEditId='';
                this.pcaId='';
            }
        }, 
        hideAddDialog(control) {
            this.pcaEditId = '';
            this.pcaId='';
            this.showAddDialog = false;
            this.showDialog = false;
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
        showControlFunc(itemobj, type) {
            this.controlType = type;
            this.selRow = itemobj;
            this.listPcaName = itemobj.pcaName;
            if (!itemobj) {
                if (this.selectItems.length != 0) {
                    this.clickItems = this.selectItems;
                    this.showControl = true;
                }
            } else {
                this.clickItems = typeof this.selRow == 'array' ? this.selRow : [this.selRow];
                if (type == 'edit') { // 编辑操作
                    this.pcaEditId = this.selRow.pcaId;
                    //this.showDialog = true; // 弹出编辑页面(attrOptionControl.vue)
                    this.showAddDialog = true;
                    this.pcaItem2=itemobj;
                }else if (type == 'delete') {
                    this.showControl = true;
                }
            }
        },
        // 删除操作
        ajaxControlDel(){
            let url = SALE_DELETE + '?pcaId=' + this.selRow.pcaId;
            client.postData(url).then(data =>{
                this.isLoading = false;     
                this.getList();
            });  
        },
        // 查询列表数据
        getList(page, firstSearch){
            let options;
             if (!firstSearch) {
                // 拿最后一次请求的参数
                options = this.lastSearchOptions;
            } else {
                this.searchOptions.parentIds = this.parentIds;
                this.searchOptions.pcaSaleProp =1;
                this.searchOptions.pcaAtrrType =2;
                options = Object.assign({}, this.searchOptions);
            }
            if (page) {
                options.page = page;
            }
            this.isLoading = true;
            this.dataList = [];
            this.lastSearchOptions = options;
             // 统计数据
            this.getCount(options);
            client.postData(PCA_GET_BY_PCRACATIDS, options).then(data => {
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
            })
        },
        getCount(options) {
            client.postData(PCA_GET_BY_PCRACATIDS, options).then(data => {
                if (data.code == 200) {
                    this.countDesc = data.data;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
            });
        },
        //拿到树形数据
        getTreeList(typeId) {
            this.isLoading = true;
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
            // root节点[丰盛]不做操作 
            if(item.id != 0){
                this.selectTreeId = item.id;// 选中的树id
                this.selectTreetext = item.text;// 选中的树名称
                //console.log("id="+item.id+",value="+item.text);
                this.parentIds = client.getParentIdList(this.treeList, item);// 获取选中的所有父id
                this.getList(false, true);
    
                // 通过判断children的length==0,则为最后一级,最后一级才显示添加/编辑/删除按钮
                let childrenLength = item.children.length;
                if(childrenLength == 0){// 最后一级
                    this.isLastLevel = true;// 显示按钮
                }else{
                    this.isLastLevel = false;// 隐藏按钮
                }
            }else{
                this.dataList = [];// 清空列表数据
                this.isLastLevel = false;// 隐藏按钮
            }
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
            this.showDeleteDialog = false;
            this.showAlert = false;
            this.showControl = false;
        },
        //根据树节点id获取所在元素父级名称
        getNameByTreeId(treeList, treeId){
            if(treeList.id == treeId){
                return treeList.text;
            } else {
                return this.deepLoop(treeList.children, treeId);// 调用递归方法
            }
        },
        // 递归方法
        deepLoop(treeItem, treeId){
            var text = "";
            treeItem.forEach(item => {
                if(text == ""){ // 解决ES6 forEach没办法结束循环问题
                    if((item.id+"") == (treeId+"")){
                        text = item.text;
                        return false;
                    } else {
                        text = this.deepLoop(item.children, treeId);
                        return false;
                    }
                }
            });
            return text;
        }
    },
    created() {
        this.getTreeList(100);// 获取树数据
    },
    ready() {
    }
    
}
</script>

<style lang="less" scope>
.page-container-bg-solid .page-bar, .page-content-white .page-bar {
   margin: 0 0 20px 0;
   background-color: #F7F7F7;
   border-bottom: 1px solid #F7F7F7!important;
} 
</style>