<template>
<!-- 运费模板-选择配送区域页面 -->
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1200px'" >
            <div slot="content">
                <div class="col-md-12">
                    <!-- 区域列表 -->
                    <div class="col-md-5 right" style="overflow-y: scroll;height:300px;">
                        <table class="table table-striped table-bordered table-hover" id="sku-content-table">
                            <thead>
                                <tr>
                                    <th style="width:20%">

                                        <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll(1)">全选</button>
                                        <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList(1)">反选</button>
                                    </th>
                                    <th style="width:60%;">可选省、市、区</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in unSelectedList" @click="selectOne(item)">
                                    <td style="text-align:center;vertical-align:middle;">
                                        <input type="checkbox" :checked="item.checked"></input>
                                    </td>
                                    <td class="tdTitle">
                                        {{item.name}}
                                    </td>
                                </tr>
                                <tr v-if="unSelectedList.length==0">
                                    <td colspan="9" class="center">暂无数据</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- 选择按钮 -->
                    <div class="col-md-1" style="margin-top:10%; margin-left:63px; margin-right:20px;">
                        <button class="btn blue" type="button" @click="selectArea()">&gt;&gt;</button>
                        </br>
                        </br>
                        <button class="btn blue" type="button" @click="unSelectArea()">&lt;&lt;</button>
                    </div>
                    <!-- 被选中的区域列表 -->
                    <div class="col-md-5" style="overflow-y: scroll;height:300px;">
                        <table class="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style="width:20%">
                                        <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll(2)">全选</button>
                                        <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList(2)">反选</button>
                                    </th>
                                    <th style="width:60%;">已选省、市、区</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in selectedList" @click="selectOne(item)">
                                    <td style="text-align:center;vertical-align:middle;">
                                        <input type="checkbox" :checked="item.checked"></input>
                                    </td>
                                    <td class="tdTitle">
                                        {{item.name}}
                                    </td>
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
import { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList, paging } from '../../components';
import loading from '../common/loading';
import treeview from '../common/tagTreeItem';
import { showSelectPic, getSelectPicList } from '../../vuex/actions/actions.resource';
export default {
    components: { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList, loading, treeview, paging },
    props: {
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
        areaStr: {
            type: String,
            value: ''
        },
        allSelectedArea: {
            type: String,
            value: ''
        },
    },
    data() {
        return {
            filtedList:[],//被过滤的省份
            areaString: '',//省份地区字符串
            isLoading: false,
            isShow: false,
            parentIds: 0,
            showDialog: false,
            showPage: false,
            componentShowOption: {},
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '选择可配送区域',
            selectList: [], // 已选标签
            unSelectedList: [],//未选商品列表
            selectedList: [],//已选商品列表
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
        getSelectedList(str) {
            if(str==''){
                return [];
            }
            let arr = str.split("、"),arr2=[];
            arr.forEach(item => {
                arr2.push({ "name": item,"checked":true });
            });
            return arr2;
        },
        //过滤未选择数据
        filterList() {
            let sourceList = this.unSelectedList, targetList = this.filtedList, index, index2,index3
            let selectList = this.selectedList;
            let arr = [];
            for (index = sourceList.length - 1; index >= 0; index--) {
                for (index3 = selectList.length - 1; index3 >= 0; index3--) {
                    if (sourceList[index].name == selectList[index3].name) {
                        arr.push(selectList[index3].name);
                        break;
                    }
                }
                for (index2 = targetList.length - 1; index2 >= 0; index2--) {
                    if (sourceList[index].name == targetList[index2].name) {
                        sourceList.splice(index, 1);
                        break;
                    }
                }
            }
            let msg = '';
            if(arr.length < selectList.length){
                for(let i = 0; i < selectList.length; i++){
                    let flag = true;
                    for(let j = 0; j < arr.length; j++){
                        if(arr[j] == selectList[i].name){
                            flag = false;
                            break;
                        }
                    }
                    if(flag){
                        msg = '地区信息已更改,请重新设置配送区域';
                        selectList.splice(i,1);
                        --i;
                    }
                }
            }
            if(msg && this.show){
                this.showMsg(msg);
            }
        },
        //将数据传给父类
        sendData() {
            let list = this.selectedList, arr = [];
            list.forEach(item => {
                arr.push(item.name);
            });
            let str = arr.join("、");
            this.$emit('area-data', str);// 子传父
            this.hideDialog();
        },
        //将一个list中选中的数据转移到另一个list中
        moveData(sourceList, targetList) {
            let index;
            for (index = sourceList.length - 1; index >= 0; index--) {
                if (sourceList[index].checked == true) {
                    targetList.push(sourceList[index]);
                    sourceList.splice(index, 1);
                }
            }
        },
        // 右移
        selectArea() {
            this.moveData(this.unSelectedList, this.selectedList);
        },
        // 左移
        unSelectArea() {
            this.moveData(this.selectedList, this.unSelectedList);
        },
        // 全选
        selectAll(type) {
            let arr = [], list;
            list = type == 1 ? this.unSelectedList : this.selectedList;
            list.forEach(item => {
                item.checked = true;
                arr.push(Object.assign({}, item));
            })
            if (type == 1) {
                this.unSelectedList = arr;
            } else if (type = 2) {
                this.selectedList = arr;
            }
        },
        // 反选
        reverseList(type) {
            let arr = [], list;
            list = type == 1 ? this.unSelectedList : this.selectedList;
            list.forEach(item => {
                item.checked = !item.checked;
                arr.push(Object.assign({}, item));
            })
            if (type == 1) {
                this.unSelectedList = arr;
            } else if (type = 2) {
                this.selectedList = arr;
            }
        },
        // 单选
        selectOne(item) {
            item.checked = !item.checked;
            this.unSelectedList = client.copyArr(this.unSelectedList);// (深)拷贝一个list重新赋值给unSelectedList
        },
        //获取未选区域数据
        getUnSelectedList() {
            this.isLoading = true;
            this.unSelectedList = [];
            client.postData(AREA_GET_LIST, {}).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    this.unSelectedList = data.data;
                    this.unSelectedList.forEach(item => {
                        item.checked = false;
                    });
                    //console.log(this.filterList);
                    this.filterList();
                    //console.log(this.unSelectedList);
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
    computed() {

    },
    created() {

    },
    watch: {
        show() {
            this.showPage = this.show;
            this.showDialog = this.show;
            if(!this.show)return;
            this.selectedList=this.getSelectedList(this.areaStr);
            this.filtedList=this.getSelectedList(this.allSelectedArea);
            this.getUnSelectedList();
           // this.getSelectedList();
           
        },

    },
    ready() {
        this.typesList = client.global.componentTypes;
    },
    beforeDestroy() {
    }
};
</script>