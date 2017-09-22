<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'800px'">
            <div slot="content">
                <div class="row">
                    <form class="form-horizontal" name="addForm" role="form">
    
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>良言标题
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="data.title" placeholder="请输入良言标题">
                            </div>
                        </div>
    
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>良言文案
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="data.subtitle" placeholder="请输入良言文案">
                            </div>
                        </div>
    
                        <div class="form-group" v-show="false">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>关注点</label>
                            <div class="controls col-md-6">
                                <m-multi-select :data="painList" v-if="showPainListSelect" :active-items="painIdsSelect" :placeholder="'请选择关注点'" :change-func="selectPainFunc"></m-multi-select>
                            </div>
                        </div>
                        <!-- 标签选择 -->
                        <div class="form-group" style="padding-top:10px;">
                            <label class="col-sm-3 control-label">
                                <span class="required"></span>标签</label>
                            <div class="controls col-md-9" style="padding-top:8px;">
                                <item-list :list="tagsList" :remove="removeTagItem"></item-list>
                                <a class="btn-select-label" @click="showTagDialog">
                                    <i class="fa fa-plus" style="position:relative;"></i> 添加标签
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <span slot="btnList">
                <button type="button" class="btn blue" @click="submitInfo">保存</button>
                <button type="button" class="btn default" data-dismiss="modal">取消</button>
            </span>
        </m-alert>
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
        <div class="loading" style="position:fixed;z-index:11111;" v-if="isLoading">
            <div class="page-spinner-bar">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
            </div>
        </div>
        <!-- 标签选择弹窗 -->
        <tag-tree v-if="showTagTreeSelect" :list="tagsList" :onselect="selectTagFunc" :oncancel="showTagDialog"></tag-tree>
    </div>
</template>
<script>
import client from '../../common/utils/client';
import tagTree from '../common/tagTree';
import { selectPic, mAlert, mSelect, mMultiSelect, itemList } from '../../components';
export default {
    components: { selectPic, tagTree, mAlert, mSelect, mMultiSelect, itemList },
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
        }
    },
    data() {
        return {
            isLoading: false,
            showDialog: false,
            showPage: false,
            showPainListSelect: true,
            painIdsSelect: [],
            painList: [],
            data: {
                "componentType": 16,
                "painIds": [],
                "subtitle": "",
                "title": ""
            },
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '添加良言',
            tagsList: [],             //选择的标签
            showTagTreeSelect: false, //显示标签选择弹窗
        }
    },
    methods: {
        // 弹出选择标签弹窗
        showTagDialog() {
            this.showTagTreeSelect = !this.showTagTreeSelect;
        },
        // 移除某个标签
        removeTagItem(item) {
            let index = this.tagsList.findIndex(subitem => subitem.id == item.id);
            this.tagsList.splice(index, 1);
        },
        // 选择标签回调
        selectTagFunc(list) {
            this.tagsList = list;
            this.data.labelIds = [];
            list.forEach(item => {
                this.data.labelIds.push(item.id);
            })
            this.showTagTreeSelect = !this.showTagTreeSelect;
        },
        hideDialog() {
            this.showDialog = false;
            setTimeout(() => {
                this.showPage = false;
                this.onhide();
            }, 300)
        },
        selectPainFunc(list) {
            let arr = [];
            list.forEach(item => {
                arr.push(item.id);
            })
            this.painIdsSelect = arr;
            this.data.painIds = arr;
        },
        getPainList() {
            this.showPainListSelect = true;
            client.postData(PAIN_TREE, {}).then(data => {
                if (data.code == 200) {
                    let list = data.data.root.children;
                    for (let i = 0; i < list.length; i++) {
                        list[i].name = list[i].text;
                    }
                    this.painList = list;
                    this.showPainListSelect = true;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
            })
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
        clearInfo() {
            this.data = {
                "componentType": 16,
                "painIds": [],
                "subtitle": "",
                "title": ""
            }
            this.painIdsSelect = [];
            this.getPainList();
        },
        // 提交信息
        submitInfo() {
            let data = this.data;
            if (data.title.replace(/\s/g, '') == '' || data.title.length > 30) {
                this.showMsg('请输入良言标题(1~30字)');
                return;
            }
            if (data.subtitle.replace(/\s/g, '') == '' || data.subtitle.length > 70) {
                this.showMsg('请输入良言文案(1~70字)');
                return;
            }
            if (this.tagsList.length == 0) {
                this.showMsg('请选择标签');
                return;
            }
            data.labelIds = [];
            this.tagsList.forEach(item => {
                data.labelIds.push(item.id);
            })
            let url = COMPONENT_ADD;
            if (this.id != '') {
                url = COMPONENT_EDIT;
                data.componentId = this.id;
            }
            this.isLoading = true;
            client.postData(url, data).then(response => {
                this.isLoading = false;
                if (response.code != 200) {
                    this.showMsg(response.msg);
                } else {
                    this.showPainListSelect = false;
                    if (this.id != '') {
                        this.onhide('update');
                    } else {
                        this.onhide('create');
                    }
                }
            }, response => {
                this.isLoading = false;
                this.showMsg('网络连接错误');
            })
        }
    },
    created() {
        this.getPainList();
    },
    watch: {
        show() {
            this.showPage = this.show;
            this.showDialog = this.show;
        },
        id() {
            this.data = {
                "componentType": 16,
                "painIds": [],
                "subtitle": "",
                "title": ""
            }
            this.painList = [];
            this.painIdsSelect = [];
            if (this.id == '') {
                this.title = '添加良言';
                this.getPainList();
                this.tagsList = [];
                setTimeout(() => {
                    this.typesList = client.global.componentTypes;
                }, 30)
                return;
            }
            this.title = '编辑良言';
            this.isLoading = true;
            this.painList = [];
            client.postData(COMPONENT_GETWITHPAINS + '?componentId=' + this.id, {}).then(response => {
                this.isLoading = false;
                if (response.code == 200) {
                    let data = response.data;
                    if (data.painIds) {
                        data.painIds.forEach(item => {
                            this.painIdsSelect.push({ id: item, name: '' })
                        })
                        this.data.painIds = data.painIds;
                    }
                    data.tags.forEach(item => {
                        item.id = item.tagId;
                        item.text = item.tagName;
                    })
                    this.tagsList = data.tags;
                    this.getPainList();
                    this.data.title = data.title;
                    this.data.subtitle = data.subtitle;
                } else {
                    this.showMsg(response.msg);
                }
            }, data => {
                this.isLoading = false;
                this.showMsg('网络连接错误');
            })
        }
    },
    ready() {
        this.typesList = client.global.componentTypes;
        this.showPainListSelect = true;
    },
    beforeDestroy() {
        this.showPainListSelect = false;
    }
};
</script>