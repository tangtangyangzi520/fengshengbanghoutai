<template>
    <div>
        <div class="page-bar min-bar">
            <div style="width:100%;position:relative;overflow:hidden;">
                <ul class="page-breadcrumb">
                    <li>
                        <a href="/dashboard.html">首页</a>
                        <i class="fa fa-circle"></i>
                    </li>
                    <li>
                        <span slot="title">标签管理</span>
                    </li>
                </ul>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label class="col-md-3">标签属性：</label>
                    <div class="col-md-9">
                        <m-select :data="labelType" :active-items="labelTypeActive" :placeholder="'请选择内容'" :change-func="selectLabelPropFunc" :class="'fixedIcon'"></m-select>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label class="col-md-3">标签名称：</label>
                    <div class="col-md-9">
                        <input type="text" class="form-control" placeholder="请输入标签名称搜索" v-model="searchKey">
                    </div>
                </div>
            </div>
            <div style="height:5px;clear:both;"></div>
        </div>
        <div class="contentBlock" id="contentList">
            <div class="col-md-6" style="border-right:1px solid #DDD;">
                <div class="form-group label-title">
                    <div class="col-md-8 right fr" style="padding:0;">
                        <button class="btn green btn-xs" type="button" v-show="showSaveSortResultBtn" @click="saveSortResult()" style="margin-top:-5px;">保存排序</button>
                    </div>
                    {{labelTypeActive.name}}
                </div>
                <div class="tree-demo jstree jstree-1 jstree-default" id="treeList" style="overflow:auto;">
                    <ul class="jstree-container-ul jstree-children jstree-wholerow-ul jstree-no-dots">
                        <treeview v-if="selectListSearch.length==0&&searchKey==''&&typeof dataList == 'object'" :model="dataList" :select="selectItem" :sort-up="sortUp" :sort-down="sortDown" :delete="deleteLabel" :edit="editLabel" :hide-sort="true"></treeview>
                        <p style="line-height:40px;text-align:center;" v-if="selectListSearch.length==0&&searchKey!=''">没有搜索匹配项</p>
                        <template v-for="model in selectListSearch">
                            <treeview :model="model" :select="selectItem" v-if="typeof model == 'object'" :delete="deleteLabel" :edit="editLabel" :hide-sort="true"></treeview>
                        </template>
                    </ul>
                </div>
            </div>
            <div class="col-md-6">
                <div class="row" style="padding:0 10px;" v-if="controlType=='add'">
                    <div class="form-group label-title">添加{{labelTypeActive.name}}</div>
                    <div class="form-group" v-show="hasSelectItem">选中标签：{{selectItemActive.text}}</div>
                    <div class="form-group">
                        <label for="title" class="col-md-2 control-label">
                            <span class="required">* </span>标签名称</label>
                        <div class="controls col-md-8">
                            <input type="text" class="form-control" v-model="data.title" placeholder="输入标签名称">
                        </div>
                    </div>
                    <div class="form-group center" style="margin-top: 70px;">
                        <button class="btn green" type="button" @click="ajaxCreateLabel(1)">添加顶级标签</button>
                        <button class="btn green" type="button" v-show="hasSelectItem" @click="ajaxCreateLabel(2)">添加平级标签</button>
                        <button class="btn green" type="button" v-show="hasSelectItem" @click="ajaxCreateLabel(3)">添加子标签</button>
                    </div>
                </div>
                <div class="row" style="padding:0 10px;" v-if="controlType=='edit'">
                    <div class="form-group label-title">编辑标签</div>
                    <div class="form-group">
                        <label for="title" class="col-md-2 control-label">
                            <span class="required">* </span>标签名称</label>
                        <div class="controls col-md-8">
                            <input type="text" class="form-control" v-model="selectItemActive.text" placeholder="输入标签名称">
                        </div>
                    </div>
                    <div class="form-group center" style="margin-top: 70px;">
                        <button class="btn green" type="button" @click="saveItemInfo">保存</button>
                    </div>
                </div>
            </div>
        </div>
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
        <!--确定删除-->
        <m-alert :title="'删除内容'" :show-cancel-btn="true" :show="showDeleteDialog" :onsure="ajaxDelete" :onhide="hideMsg">
            <div slot="content">确定删除“{{selectItemActive.text}}”吗？</div>
        </m-alert>
        <loading :show="isLoading"></loading>
    </div>
</template>
<script>
import client from '../../../common/utils/client';
import { pageTitleBar, paging, itemControl, mMultiSelect, mAlert, mSelect } from '../../../components';
import panel from './panel';
import control from '../../common/control';
import loading from '../../common/loading';
import treeview from './treeview';
let vueThis = null;
export default {
    components: { pageTitleBar, paging, itemControl, mAlert, mMultiSelect, mSelect, control, loading, panel, treeview },
    data() {
        return {
            name: '',
            labelType: [],
            labelTypeActive: { id: 0, name: '物理标签' },
            isLoading: false,
            dataList: [],
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            showDeleteDialog: false,
            searchKey: '',
            data: {
                title: '',
            },
            limitResource: null, // 发布状态
            selectItemActive: null,  // 被选中的项目
            hasSelectItem: false, // 选择子项进行操作
            controlType: 'add',   // 操作类型
            showSaveSortResultBtn: false, // 显示排序保存按钮
            selectListSearch: [], // 搜索结果标签
        }
    },
    methods: {
        sortUp(item) {
            let list = client.findParentList(this.dataList.children, item);
            let index = list.findIndex(subitem => item.id == subitem.id);
            if (index == 0) {
                return;
            }
            let tempItem = list[index];
            let tempItemNext = list[index + 1];
            list.splice(index, 1);
            list.splice(index - 1, 0, tempItem);
            list.forEach((item, i) => {
                item.sortNum = list.length - i;
            })
            this.sortList = list;
            this.showSaveSortResultBtn = true;
        },
        sortDown(item) {
            let list = client.findParentList(this.dataList.children, item);
            let index = list.findIndex(subitem => item.id == subitem.id);
            if (index == list.length - 1) {
                return;
            }
            let tempItem = list[index];
            let tempItemNext = list[index + 1];
            list.splice(index, 1);
            list.splice(index + 1, 0, tempItem);
            list.forEach((item, i) => {
                item.sortNum = list.length - i;
            })
            this.sortList = list;
            this.showSaveSortResultBtn = true;
        },
        deleteLabel(item) {
            console.log(item);
            this.selectItemActive = item;
            this.showDeleteDialog = true;
        },
        editLabel(item) {
            this.controlType = 'edit';
            this.selectItemActive = Object.assign({}, item);
            console.log(item)
        },
        // 保存编辑标签信息
        saveItemInfo() {
            this.isLoading = true;
            client.postData(TAG_EDIT, { labelName: this.selectItemActive.text, tagId: this.selectItemActive.id }).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    this.showMsg('更新成功');
                    let targetItem = client.findTreeItem(this.dataList.children, this.selectItemActive.id);
                    targetItem.text = this.selectItemActive.text;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
                this.showMsg(data.message);
            })
        },
        // 创建标签
        ajaxCreateLabel(type) {
            if(this.data.title.replace(/\s/g,'') == ''){
                this.showMsg('请输入标签名称');
                return;
            }
            this.isLoading = true;
            let options = {};
            options.labelName = this.data.title;
            options.typeId = this.labelTypeActive.id;
            //添加平级标签
            if (type == 2) {
                let parentItem = client.findParentItem(this.dataList,this.selectItemActive)
                if(parentItem.id != 0){
                    options.parentTagId = parentItem.id;
                }
            }
            //添加子标签
            if (type == 3) {
                options.parentTagId = this.selectItemActive.id;
            }
            client.postData(TAG_CREATE, options).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    this.showMsg('创建成功');
                    this.data.title = '';
                    this.getList(this.labelTypeActive.id);
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
                this.showMsg(data.message);
            })
        },
        // 提交删除操作
        ajaxDelete() {
            this.isLoading = true;
            let items = client.findParentItem(this.dataList, this.selectItemActive);
            client.postData(TAG_DELETE + '?tagId=' + this.selectItemActive.id, {}).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    this.showMsg('删除成功');
                    this.selectItemActive = null;
                    // let index = items.children.findIndex(subitem => this.selectItemActive.id == subitem.id);
                    // items.children.splice(index,1);
                    this.getList(this.labelTypeActive.id);
                    this.selectListSearch = [];
                    this.searchKey = '';
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
                this.showMsg(data.message);
            })
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
                    this.labelTypeActive = data.data[0];
                    this.getList(this.labelTypeActive.id);
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
                this.showMsg(data.message);
            })
        },
        getList(typeId) {
            this.isLoading = true;
            client.postData(TAG_LIST_GET + '?typeId=' + typeId, {}).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    data.data.root.children.forEach(item => {
                        this.filterData(item);
                    })
                    data.data.root.isOpen = true;
                    data.data.root.isSelected = false;
                    this.dataList = data.data.root;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
                this.showMsg(data.message);
            })
        },
        // 处理树形数据
        filterData(item) {
            item.isOpen = false;
            item.isSelected = false;
            if (item.children.length != 0) {
                item.children.forEach(subitem => {
                    this.filterData(subitem);
                })
            }
        },
        // 处理树形数据
        filterDataSelected(item) {
            item.isSelected = false;
            if (item.children.length != 0) {
                item.children.forEach(subitem => {
                    this.filterDataSelected(subitem);
                })
            }
        },
        // 选中一个项时出发
        selectItem(item) {
            this.dataList.children.forEach(subitem => {
                this.filterDataSelected(subitem);
            })
            this.selectItemActive = Object.assign({}, item);
            this.hasSelectItem = true;
            this.dataList.isSelected = false;
            item.isSelected = !item.isSelected;
            this.controlType = 'add';
        },
        selectLabelPropFunc(item) {
            if (item == '') {
                this.labelTypeActive = this.labelType[0];
            } else {
                this.labelTypeActive = item;
            }
            this.getList(this.labelTypeActive.id);
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
        },
        goSearch() {
            this.selectListSearch = [];
            this.dataList.children.forEach(item => {
                this.handlerSearch(item);
            })
        },
        handlerSearch(item) {
            item.isShow = true;
            if (this.searchKey.replace(/\s/g, '') != '') {
                if (item.text.indexOf(this.searchKey) == -1 && this.searchKey.replace(/\s/g, '') != '') {
                    item.isShow = false;
                } else {
                    this.selectListSearch.push(item);
                    console.log(item);
                }
            }
            if (item.children.length != 0) {
                item.children.forEach(subitem => {
                    this.handlerSearch(subitem);
                })
            }
        },
    },
    created() {
        vueThis = this;
        this.getTagType();
        this.limitResource = JSON.parse(localStorage.getItem('limitResource'));
        console.log(JSON.parse(localStorage.getItem('limitResource')));
    },
    watch: {
        searchKey(){
            this.goSearch();
        },
        dataList() {
            $('#orgTree').jstree({
                'plugins': ["wholerow", "types"],
                'core': {
                    "themes": {
                        "responsive": false
                    },
                    'data': [this.dataList]
                },
                "types": {
                    "default": {
                        "icon": "fa fa-folder icon-state-warning icon-lg"
                    },
                    "file": {
                        "icon": "fa fa-file icon-state-warning icon-lg"
                    }
                },
                state: {
                    checked: true,
                    disabled: true,
                    expanded: true,
                    selected: true
                },
            });
            let _this = this;
            $('#orgTree').on("changed.jstree", function (e, data) {
                console.log(_this.dataList);
            });
        }
    },
    route: {
        canReuse: () => {
            vueThis.getList(false, true);
        }
    },
    ready() {
        client.resetListHeight();
        const windowHeight = $(window).height();
        $('#treeList').height(windowHeight - 250);
        $(window).on('resize', function () {
            const windowHeight = $(window).height();
            $('#treeList').height(windowHeight - 250);
        })
        let _this = this;
        $('#searchArticleForm').on('submit', function (e) {
            e.preventDefault();
            _this.goSearch();
        })
    }
};
</script>

<style lang="less" scope>
@import "../../../common/css/list.less";

</style>