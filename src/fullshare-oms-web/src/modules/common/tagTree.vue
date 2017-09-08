<template>
    <div class="fixedBg">
        <div class="container-tree rows">
            <div class="hd">选择标签</div>
            <div class="col-md-6" style="border-right:1px solid #DDD;">
                <div class="form-group" style="margin-top:10px;height:30px;">
                    <div class="col-md-6" style="padding:0;">
                        <m-select :data="labelType" :active-items="labelTypeActive" :placeholder="'请选择内容'" :change-func="selectLabelPropFunc" :class="'fixedIcon'"></m-select>
                    </div>
                    <div class="col-md-6" style="padding-right:0;">
                        <form id="searchArticleForm">
                            <div class="input-icon right">
                                <i class="fa fa-search" style="cursor:pointer;" @click="goSearch()"></i>
                                <input type="text" v-model="searchKey" @blur="goSearch" class="form-control input-circle" placeholder="搜索标签名称">
                            </div>
                        </form>
                    </div>
                </div>
                <div class="tree-demo jstree jstree-1 jstree-default" style="overflow:auto;height:380px;margin-bottom:10px;clear:both;">
                    <ul class="jstree-container-ul jstree-children jstree-wholerow-ul jstree-no-dots">
                        <treeview v-if="selectListSearch.length==0&&searchKey==''&&typeof dataList == 'object'" :model="dataList" :select="selectItem"></treeview>
                        <p style="line-height:40px;text-align:center;" v-if="selectListSearch.length==0&&searchKey!=''">没有搜索匹配项</p>
                        <template v-for="model in selectListSearch">
                            <treeview :model="model" :select="selectItem" v-if="typeof model == 'object'"></treeview>
                        </template>
                    </ul>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group label-title" style="margin-top:10px;font-size:14px;">
                    <div class="col-md-8 right fr" style="padding:0;">
                        <button class="btn green btn-xs" type="button" @click="clear" style="margin-top:-5px;">全部清空</button>
                    </div>
                    已选标签({{selectList.length}})
                </div>
                <div style="overflow:auto;height:380px;margin-bottom:10px;">
                    <item-list :list="selectList" :remove="removeItem"></item-list>
                </div>
            </div>
            <div class="ft">
                <a class="btn-ok" @click="selectOk">确定</a>
                <a class="btn-cancel" @click="oncancel">取消</a>
            </div>
        </div>
        <loading :show="isLoading"></loading>
    </div>
</template>
<script>
import client from '../../common/utils/client';
import { mMultiSelect, mAlert, mSelect, itemList } from '../../components';
import loading from './loading';
import treeview from './tagTreeItem';
let vueThis = null;
export default {
    props: {
        type: 0,
        list: Array, // 已选列表
        show: Boolean,
        onselect: Function,
        oncancel: Function
    },
    components: { mSelect, loading, treeview, itemList },
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
            searchKey: '',
            selectListSet: new Set(), // 已选标签Set
            selectList: [], // 已选标签
            selectListSearch: [], // 搜索结果标签
        }
    },
    methods: {
        selectOk() {
            this.onselect(this.selectList);
        },
        // 跳转添加页面
        addItem(item) {
            console.log(item)
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
                    this.labelTypeActive = data.data[this.type];
                    this.getList(this.labelTypeActive.id);
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
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
                    data.data.root.isShow = true;
                    this.dataList = data.data.root;
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
            if (item.id == '0') {
                return;
            }
            let parentItem = client.findParentItem(this.dataList,item);
            let index = parentItem.children.findIndex(subItem => subItem.id == item.id);
            let newItem = Object.assign({},item);
            parentItem.children.splice(index,1,newItem);
            if (this.selectListSet.has(item)) {
                this.selectListSet.delete(item);
                newItem.isSelected = false;
            } else {
                this.selectListSet.add(newItem);
                newItem.isSelected = true;
            }
            this.selectList = Array.from(this.selectListSet);
        },
        // 移除某项
        removeItem(item) {
            let parentItem = client.findParentItem(this.dataList,item);
            let index = parentItem.children.findIndex(subItem => subItem.id == item.id);
            let newItem = Object.assign({},item);
            parentItem.children.splice(index,1,newItem);
            if (this.selectListSet.has(item)) {
                this.selectListSet.delete(item);
                newItem.isSelected = false;
                this.selectList = Array.from(this.selectListSet);
            }
        },
        // 全部清空
        clear() {
            this.selectList.forEach(item => {
                item.isSelected = false;
            })
            this.selectListSet = new Set();
            this.selectList = [];
        },
        goSearch() {
            this.selectListSearch = [];
            this.dataList.children.forEach(item => {
                this.handlerSearch(item);
            })
            console.log(this.selectListSearch)
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
        selectLabelPropFunc(item) {
            if (item == '') {
                this.labelTypeActive = this.labelType[1];
            } else {
                this.labelTypeActive = item;
            }
            this.selectListSearch = [];
            this.searchKey = '';
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
        }
    },
    watch: {
        list() {
            this.selectList = this.list;
        },
        searchKey(){
            this.goSearch();
        }
    },
    created() {
        vueThis = this;
        this.getTagType();
    },
    ready() {
        let _this = this;
        this.selectList = this.list;
        this.list.forEach(item => {
            this.selectListSet.add(item);
        })
        $('#searchArticleForm').on('submit', function (e) {
            e.preventDefault();
            _this.goSearch();
        })
    }
};
</script>

<style lang="less" scope>
.container-tree {
    position: relative;
    margin: auto;
    top: 50%;
    margin-top: -280px;
    width: 800px;
    height: 560px;
    background: #FFF;
    box-sizing: border-box;
    border: 1px solid #CCC;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    .hd {
        position: relative;
        width: 100%;
        height: 50px;
        line-height: 50px;
        background: #EEE;
        color: #000;
        padding: 0 15px;
        box-sizing: border-box;
        border-bottom: 1px solid #DDD;
        font-size: 16px;
        span {
            font-size: 14px;
        }
    }
    .ft {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 60px;
        line-height: 60px;
        text-align: center;
        background: #EEE;
        border-top: 1px solid #CCC;
        a {
            color: #333;
            border: 1px solid #CCC;
            display: inline-block;
            width: 80px;
            height: 36px;
            line-height: 36px;
            margin: 0 10px;
            text-align: center;
            background: #FFF;
            &:hover {
                text-decoration: none;
                background: #F5F5F5;
            }
            &.btn-ok {
                color: #FFF;
                background: #337AB7;
                border-color: #337AB7;
                &:hover {
                    text-decoration: none;
                    background: #286090;
                }
            }
            &.btn-ok.disabled {
                border: 1px solid #CCC;
                color: #ababab;
                background: #f3f3f3;
            }
        }
    }
}

#treeListBlock {
    height: 400px;
    overflow: auto;
}
</style>