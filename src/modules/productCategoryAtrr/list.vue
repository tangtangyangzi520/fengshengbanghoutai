<template>
    <!-- 通用属性列表页面 -->
    <div>
        <div class="page-bar min-bar">
            <page-title-bar>
                <span slot="title">类目通用属性设置</span>
            </page-title-bar>
            <div class="col-md-12 right">
                <span v-if="selectItems.length>0" class="desc">已选<em>{{selectItems.length}}</em> 项 </span>   
                <!-- <p><button class="btn green" type="button" @click="addItem()" v-show="isShowAddBtn" style="margin-left:100px;">新增</button></p> -->
            </div>
            <div style="height:5px;clear:both;"></div>
        </div>
        <div>
            <div class="col-md-2" style="height:500px;overflow:auto;">
                <div class="tree-demo jstree jstree-1 jstree-default">
                    <ul class="jstree-container-ul jstree-children jstree-wholerow-ul jstree-no-dots">
                        <treeview  :model="treeList" :select="selectItem"></treeview>
                        <template v-for="model in selectListSearch">
                            <treeview :model="model" :select="selectItem"></treeview>
                        </template>
                    </ul>
                </div> 
            </div>
            <div class="col-md-10" id="contentList">
                <div>
                    <button class="btn green" type="button" @click="addItem()" v-show="isShowAddBtn" v-if="limitResource.ProductCategoryAtrr_add">新增</button>
                </div>
                </br>
                <table class="table table-striped table-bordered table-hover" id="category-table">
                    <thead>
                        <tr style="background-color:#D7D7D7;height:40px;">
                            <th>属性名称</th>
                            <th>属性类型</th>
                            <th>是否必填</th>
                            <th>是否默认展示</th>
                            <th>属性值列表</th>
                            <th>所属类目</th>
                            <th>创建时间</th>
                            <th>排序号</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="itemobj in dataList">
                            <td>
                                <div style="padding-top:6px; width:200px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; text-algin:center; display:inline-block;" title="{{itemobj.pcaName}}">
                                    <span>{{itemobj.pcaName}}</span>
                                </div>
                            </td>
                            <td>
                                <p style="padding-top:6px;">
                                    <span v-show="itemobj.pcaInputType==1">单选</span>
                                    <span v-show="itemobj.pcaInputType==2">多选</span>
                                    <span v-show="itemobj.pcaInputType==3">下拉列表</span>
                                    <span v-show="itemobj.pcaInputType==4">单行文本</span>
                                    <span v-show="itemobj.pcaInputType==5">多行文本</span>
                                </p>
                            </td>
                            <td>
                                <p style="padding-top:6px;">
                                    <span v-if="itemobj.pcaRequired==1">√</span>
                                </p>
                            </td>
                            <td>
                                <p style="padding-top:6px;">
                                    <span v-if="itemobj.pcaIsShow==1">√</span>
                                </p>
                            </td> 
                            <td>
                                <div style="padding-top:6px; width:200px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; text-algin:center; display:inline-block;" title="{{ itemobj.pcaoList | filterPcaoList }}">
                                <!-- <p style="padding-top:5px;"> -->
                                    <span>{{ itemobj.pcaoList | filterPcaoList }}</span>
                                <!-- </p> -->
                                </div>
                            </td>
                            <td>
                                <p style="padding-top:6px;">
                                    <span>{{ getNameByTreeId(treeList, itemobj.pcraCatId) }}</span>
                                </p>
                            </td>
                            <td>
                                <p style="padding-top:6px;">
                                    <span>{{ itemobj.pcaCreatedTime | filterTime }}</span>
                                </p>   
                            </td>
                            <td>
                                <p style="padding-top:6px;">
                                    <span>{{ itemobj.pcaSortNo }}</span>
                                </p>
                            </td>
                            <td>
                                <p style="padding-top:5px;margin-left:6px;">
                                    <button type="button" class="btn btn-xs blue" @click.stop="showControlFunc(itemobj,'edit')"   v-if="selectTreeId==itemobj.pcraCatId && limitResource.ProductCategoryAtrr_edit">修改</button>
                                    <button type="button" class="btn btn-xs red"  @click.stop="showControlFunc(itemobj,'delete')" v-if="selectTreeId==itemobj.pcraCatId && limitResource.ProductCategoryAtrr_delete">删除</button>
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
       
        <!-- 添加/编辑通用属性页面 -->       
        <productatrr-control v-if="!destroyControlDialog" :selectedid="selectTreeId" :pcaid="pcaEditId" :show="showAddDialog" :onhide="hideAddDialog" :pca-list="dataListTemp" :pca-name2="listPcaName"></productatrr-control>
        <!-- 编辑属性值弹出框 -->
        <!-- <attr-option-control v-if="!destroyControlDialog" :pcaid="pcaEditId" :show="showDialog" :onhide="hideAddDialog"></attr-option-control> -->
        
        <m-alert :title="'温馨提示'" :show-cancel-btn="true" :show="showSubmitDialog" :onsure="ajaxControl" :onhide="hideMsg">
            <div slot="content">确定提交吗？</div>
        </m-alert> 

        <!-- 删除确认弹出框 -->
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
import productatrrControl from './productatrrControl';
import treeview from '../common/tagTreeItem';
import attrOptionControl from './attrOptionControl';

export default {
    props: {
        list: Array, // 已选列表
        show: Boolean,
        onselect: Function,
        oncancel: Function
    },
    components: { pageTitleBar, paging, itemControl, mAlert, mMultiSelect, mSelect, loading, productatrrControl, treeview, itemList, attrOptionControl},
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
            selectTreeId:0, //类目id
            selectTreetext:'',
            parentIds : 0,
            parentTexts:'',
            clickItems: [],   //点击操作的数据项
            pcaEditId:'',
            pcaId:'',
            changeObj:false,
            selRow : {},
            lastSearchOptions: {},
            controlType:'',
            searchOptions: {
                parentIds: 0,
                pcaSaleProp:0,
                pcaAtrrType:1,
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    startIndex: 0,
                    totalPage: 0,
                    totalSize: 0
                }
            },
            isShowAddBtn: false, // 是否显示添加按钮
            listPcaName: "",// 属性名称,传递给子组件
            dataListTemp: [],// 当前类目下的list, 传递给子组件
        }
    },
    filters: {
        // 格式化时间
        filterTime(time) {
            return client.formateTime(time);// 格式化时间
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
        // 添加按钮
        addItem() {
            // 封装当前类目下的数据list,用于传递给子组件做属性名称去重判断
            let arr = [];       
            let tempList = Object.assign([], this.dataList);
            for(let i=0; i<tempList.length; i++){                
                if(tempList[i].pcraCatId == this.selectTreeId){
                    arr.push(tempList[i]);
                }
            }
            this.dataListTemp = arr;

            this.showAddDialog = true;
            this.pcaEditId='';
            this.pcaId='';
        }, 
        hideAddDialog(control) {
            this.pcaEditId = '';
            this.pcaId='';
            //this.showControl = false;
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
        // 编辑/删除按钮弹框事件
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
                if (type == 'edit') {// 编辑操作
                    // 封装当前类目下的数据list,用于传递给子组件做属性名称去重判断
                    let arr = [];       
                    let tempList = Object.assign([], this.dataList);
                    for(let i=0; i<tempList.length; i++){                
                        if(tempList[i].pcraCatId == itemobj.pcraCatId){
                            arr.push(tempList[i]);
                        }
                    }
                    this.dataListTemp = arr;

                    this.pcaEditId = this.selRow.pcaId;
                    this.showAddDialog = true;
                }else if (type == 'delete') {// 删除操作
                    this.showControl = true;
                }
            }
        },
        // 删除分类属性及对应的属性值
        ajaxControlDel(){
            let url = PCA_REMOVE + '?pcaId=' + this.selRow.pcaId;
            // 发送请求
            client.postData(url).then(response => {
                this.isLoading = false; 
                if (response.code != 200) {
                    //this.showMsg(response.msg);
                    this.showMsg("操作失败!");
                }else{
                    this.showMsg(response.msg);
                    this.getList();
                }    
            });  
        },
        hideControlFunc(type) {
            if (type == 'success') {
                this.getList();
            }
            this.showControl = false;
        },
        // 搜索条件变化
        changeSearchOptions(options) {
            this.searchOptions = options;
        },
        // 获取列表数据
        getList(page, firstSearch){
            let options;
             if (!firstSearch) {
                // 拿最后一次请求的参数
                options = this.lastSearchOptions;
            } else {
                this.searchOptions.parentIds = this.parentIds;
                this.searchOptions.pcaSaleProp = 0;
                this.searchOptions.pcaAtrrType = 1;
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
            });
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
        // 拿到树形数据
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
            // root节点[丰盛]不做操作
            if(item.id != 0){
                this.isShowAddBtn = true; // 显示出添加按钮
    
                this.selectTreeId = item.id;
                this.selectTreetext=item.text;
                this.parentIds = client.getParentIdList(this.treeList, item);
                this.getList(false, true);
            }else{
                this.dataList = [];// 清空列表
                this.isShowAddBtn = false; // 隐藏添加按钮
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
            this.showAddDialog = false;
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
        this.getTreeList(100); // 获取树数据
        this.limitResource = JSON.parse(localStorage.getItem('limitResource'));

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
