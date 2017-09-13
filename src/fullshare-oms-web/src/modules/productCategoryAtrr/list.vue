<template>
    <div>
        <div class="page-bar min-bar">
            <page-title-bar>
                <span slot="title">类目通用属性设置</span>
            </page-title-bar>
            <div class="col-md-12 right">
               <span v-if="selectItems.length>0" class="desc">已选
                    <em>{{selectItems.length}}</em> 项 </span>   
                <button class="btn green" type="button"   @click="addItem()" style="margin-left:10px;">添加</button>
                <!-- <button class="btn green-meadow" @click="getList(false,true)" type="button">搜索</button> -->
            </div>
            <div style="height:5px;clear:both;"></div>
        </div>
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
                <div class="col-md-6" id="contentList">
                    <table class="table table-striped table-bordered table-hover" id="category-table">
                        <thead>
                            <tr>
                            <th >属性名称</th>
                            <th >属性类型</th>
							<th >是否必填</th>
							<th >是否默认展示</th>
							<th >属性值列表</th>
							<th >所属类目</th>
                            <th >创建时间</th>
							<th >排序号</th>
                            <th >操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="itemobj in dataList" >
                                <td>{{itemobj.pcaName}}</td>
                                <td >
                                    <span class="label label-info" v-show="itemobj.pcaInputType==1">单选</span>
                                    <span class="label label-info" v-show="itemobj.pcaInputType==2">多选</span>
                                    <span class="label label-info" v-show="itemobj.pcaInputType==3">下拉列表</span>
                                    <span class="label label-info" v-show="itemobj.pcaInputType==4">单行文本</span>
                                    <span class="label label-info" v-show="itemobj.pcaInputType==5">多行文本</span>
                                </td>
                                <!--{{itemobj.pcaInputType}}-->
                                <td>
                                    <p style="padding-top:5px;">
                                        <span class="label label-default" v-if="itemobj.pcaRequired!=1">否</span>
                                        <span class="label label-success" v-else>是</span>
                                    </p>
                                </td>
                                <td>
                                     <p style="padding-top:5px;">
                                        <span class="label label-default" v-if="itemobj.pcaSaleProp!=1">否</span>
                                        <span class="label label-success" v-else>是</span>
                                    </p>
                                </td> 
                                <td>
                                    <span v-for="p in itemobj.pcaoList">{{p.pcaoName}},</span>
                                </td>
                                <td>{{selectTreetext}}</td>
                                <td>{{itemobj.pcaCreatedTime|filterTime}}</td>
                                <td>{{itemobj.pcaSortNo}}</td>
                                <td>
                                     <button type="button" v-show="selectTreeId==itemobj.pcraCatId"  class="btn btn-xs blue" @click.stop="showControlFunc(itemobj,'edit')">编辑</button>
                                     <button type="button"  v-show="selectTreeId==itemobj.pcraCatId" @click.stop="showControlFunc(itemobj,'delete')" class="btn btn-xs red">删除</button>
                                     <button type="button" class="btn btn-xs blue" @click.stop="showControlFunc(itemobj,'editvalue')">编辑属性值</button>
                                </td>
                            </tr>
                            <tr v-if="dataList.length==0">
                                <td colspan="9" class="center">暂无数据</td>
                            </tr>
                        </tbody>
                    </table>
                  <paging :current-page="page.currentPage" :page-size="page.pageSize" :start-index="page.startIndex" :total-page="page.totalPage" :total-size="page.totalSize" :change="getList"></paging>     

                </div>

            </div>
       
        <!-- 创建分类属性弹窗 -->       
      <productatrr-control v-if="!destroyControlDialog" :selectedid="selectTreeId" :pcaid="pcaEditId" :show="showAddDialog" :onhide="hideAddDialog"></productatrr-control>
      <attr-option-control v-if="!destroyControlDialog" :pcaid="pcaEditId" :show="showDialog" :onhide="hideAddDialog"></attr-option-control>
         <m-alert :title="'提交'" :show-cancel-btn="true" :show="showSubmitDialog" :onsure="ajaxControl" :onhide="hideMsg">
            <div slot="content">确定提交吗？</div>
        </m-alert> 
           <!--确定删除-->
        <m-alert :title="'删除内容'" :show-cancel-btn="true" :show="showControl" :onsure="ajaxControlDel" :onhide="hideMsg">
            <div slot="content">确定删除吗？</div>
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
    components: { pageTitleBar, paging, itemControl, mAlert, mMultiSelect,mSelect,  loading, productatrrControl, treeview, itemList ,attrOptionControl},
    data() {
        return {
            name: '',
            labelType: [],
            labelTypeActive: { id: 0, name: '物理标签' },
            isShow:false,
            isLoading: false,
            treeList: [],
            dataList: [],
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
            selectTreeId:0,
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
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    startIndex: 0,
                    totalPage: 0,
                    totalSize: 0
                }
            }
        }
    },
    filters: {
       
        filterTime(time) {
            return client.formateTime(time);
        }
    },
    methods: {
        

         addItem() {
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
            
        //查看商品
        showProductFunc(){
            location.href='/dist/#!/product';
        },
        selectOk() {
            this.onselect(this.selectList);
        },
        
        // 获取标签属性列表
        getTagType() {
            this.isLoading = true;
            client.postData(TAG_TYPE_GET, {}).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    data.data.forEach(item => {
                        item.id = item.typeId;
                        item.name = item.typeName;
                    })
                    this.labelType = data.data;
                    this.labelTypeActive = data.data[1];
                    this.getTreeList(this.labelTypeActive.id);
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
            })
        },
        showControlFunc(itemobj, type) {
            this.controlType = type;
             this.selRow = itemobj;
            if (!itemobj) {
                if (this.selectItems.length != 0) {
                    this.clickItems = this.selectItems;
                    this.showControl = true;
                }
            } else {
                this.clickItems = typeof this.selRow == 'array' ? this.selRow : [this.selRow];
                if (type == 'edit') {
                    this.pcaEditId = this.selRow.pcaId;
                    console.log(this.showControl);
                    this.showAddDialog = true;
                }
                else if(type == 'editvalue'){
                    this.pcaEditId = this.selRow.pcaId;
                  //  this.getOptions();
                    this.showDialog = true; 
                }
                else {
                    this.showControl = true;
                }
            }
        },
        ajaxControlDel(){
                let url=PCA_DELETE+'?pcaId=' + this.selRow.pcaId;
                client.postData(url).then(data =>{
                    this.isLoading = false;     
                    this.getList();
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
        getList(page, firstSearch){
            let options;
             if (!firstSearch) {
                // 拿最后一次请求的参数
                options = this.lastSearchOptions;
            } else {
                this.searchOptions.parentIds = this.parentIds;
                this.searchOptions.pcaSaleProp =0;
                options = Object.assign({}, this.searchOptions);
               // console.log(options);
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
        getCount(options) {
           // options.componentType = [16];
            client.postData(PCA_GET_BY_PCRACATIDS, options).then(data => {
                if (data.code == 200) {
                    this.countDesc = data.data;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
            })
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
            this.selectTreeId = item.id;
            this.selectTreetext=item.text;
            //console.log("id="+item.id+",value="+item.text);
            this.parentIds = client.getParentIdList(this.treeList, item);
            this.parentTexts = client.getParentTextList(this.treeList,item);
            this.getList(false, true);
             console.log(this.parentIds);
              console.log(this.parentTexts);
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
        }
    },

    created() {
        this.getTreeList(100);
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
