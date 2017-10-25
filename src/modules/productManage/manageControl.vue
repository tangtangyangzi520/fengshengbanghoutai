<template>
<!-- 作废 -->
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'800px'">
            <div slot="content">
                <div class="row nopadding">
                    <form class="form-horizontal" name="addForm" role="form">
                        <div class="col-md-4" style="padding-bottom:10px;">
                            <label class="col-sm-4 control-label">
                                <span class="required">* </span>专家头像</label>
                            <div class="controls col-md-6">
                                <i class="fa fa-image pick-img" @click="showSelectPicDialog(1)" v-if="data.iconUrl==''" style="margin-top: 20px;"></i>
                                <img :src="data.iconUrl" class="cursor" @click="showSelectPicDialog(1)" height="80" v-else style="pointer:corsor;margin-bottom:-10px;">
                            </div>
                        </div>
                        <div class="col-md-4" style="padding-bottom:10px;">
                            <label class="col-sm-4 control-label">
                                <span class="required">* </span>半身图</label>
                            <div class="controls col-md-6">
                                <i class="fa fa-image pick-img" @click="showSelectPicDialog(2)" v-if="data.halfFigure==''" style="margin-top: 20px;"></i>
                                <img :src="data.halfFigure" class="cursor" @click="showSelectPicDialog(2)" height="80" v-else style="pointer:corsor;margin-bottom:-10px;">
                            </div>
                        </div>
                        <div class="col-md-4" style="padding-bottom:10px;">
                            <label class="col-sm-4 control-label">
                                <span class="required">* </span>背景图</label>
                            <div class="controls col-md-6">
                                <i class="fa fa-image pick-img" @click="showSelectPicDialog(3)" v-if="data.bgUrl==''" style="margin-top: 20px;"></i>
                                <img :src="data.bgUrl" class="cursor" @click="showSelectPicDialog(3)" height="80" v-else style="pointer:corsor;margin-bottom:-10px;">
                            </div>
                        </div>
    
                        <div class="col-md-6">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>专家名称
                            </label>
                            <div class="controls col-md-9">
                                <input type="text" class="form-control input-sm" v-model="data.authorName" placeholder="请输入专家名称">
                            </div>
                        </div>
    
                        <div class="col-md-6">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required"></span>专家简介
                            </label>
                            <div class="controls col-md-9">
                                <input type="text" class="form-control input-sm" v-model="data.description" placeholder="请输入专家简介">
                            </div>
                        </div>
    
                        <div class="col-md-6" v-show="false">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>关注点</label>
                            <div class="controls col-md-9">
                                <m-multi-select :data="painList" v-if="showPainListSelect" :active-items="painIdsSelect" :placeholder="'请选择关注点'" :change-func="selectPainFunc"></m-multi-select>
                            </div>
                        </div>
                        <div class="col-md-6" v-for="item in data.painOptions" v-show="false">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required"></span>{{item.painName}}</label>
                            <div class="controls col-md-9">
                                <input type="text" class="form-control input-sm" v-model="item.opinion" placeholder="">
                            </div>
                        </div>
                        <!-- 标签选择 -->
                        <div class="form-group" style="padding: 10px;">
                            <item-list :list="tagsList" :remove="removeTagItem"></item-list>
                            <a class="btn-select-label" @click="showTagDialog">
                                <i class="fa fa-plus" style="position:relative;"></i> 添加标签
                            </a>
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
        <div style="position:fixed;z-index:111111;" v-show="picShowOption.show">
            <select-pic v-show="picShowOption.show" :options="picShowOption" :onselect="selectPicFunc" :oncancel="cancelSelect"></select-pic>
        </div>
        <div style="position:fixed;z-index:11111;" v-show="showComponent">
            <select-component-all v-show="showComponent" :options="componentShowOption" :onselect="selectComponentFunc" :oncancel="cancelSelectComponent"></select-component-all>
        </div>
        <loading :show="isLoading"></loading>
        <!-- 标签选择弹窗 -->
        <tag-tree v-if="showTagTreeSelect" :list="tagsList" :onselect="selectTagFunc" :oncancel="showTagDialog"></tag-tree>
    </div>
</template>
<script>
import client from '../../common/utils/client';
import tagTree from '../common/tagTree';
import { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList } from '../../components';
import loading from '../common/loading';
import { showSelectPic, getSelectPicList } from '../../vuex/actions/actions.resource';
export default {
    components: { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList, tagTree, loading },
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
            componentShowOption: {},
            data: {
                "authorName": "",
                "authorTitle": "",
                "authorType": 2,
                "bgUrl": "",
                "description": "",
                "halfFigure": "",
                "iconId": null,
                "iconUrl": "",
                "painIds": [],
                "painOptions": []
            },
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '添加专家',
            selectPicType: 1,//区分头像,半身图还是背景(默认1专家头像)
            tagsList: [],             //选择的标签
            showTagTreeSelect: false, //显示标签选择弹窗
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
        // 显示选择图片
        showSelectPicDialog(type) {
            this.showSelectPic({ name: 'bannerPic', show: true, storeType: 4, single: true });
            if (type == 2) {
                this.selectPicType = 2;
            } else if (type == 3) {
                this.selectPicType = 3;
            }
        },
        // 选择图片文件回调
        selectPicFunc(list) {
            //console.log(list);
            //alert(0);
            if (this.selectPicType == 2) {
                this.data.halfFigure = list[0].url;
            } else if (this.selectPicType == 3) {
                this.data.bgUrl = list[0].url;
            } else {
                this.data.iconUrl = list[0].url;
            }
            this.showSelectPic({ show: false });
        },
        // 隐藏选择资源弹窗
        cancelSelect() {
            this.showSelectPic({ show: false });
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
            //处理相关专家关注点“观点”
            let optionsArr = [];
            //预先添加选中数据
            for (let i = 0; i < arr.length; i++) {
                let objs = { painComponentId: arr[i], opinion: "", painName: "" }
                optionsArr.push(objs);
            }
            //填充已有观点数据
            for (let i = 0; i < this.data.painOptions.length; i++) {
                let sameId = optionsArr.findIndex((info) => info.painComponentId == this.data.painOptions[i].painComponentId);
                if (sameId != -1) {
                    optionsArr[sameId] = this.data.painOptions[sameId];
                }
            }
            //过滤新增关注点名称painName
            this.painList.forEach(item => {
                let nameId = optionsArr.findIndex((info) => info.painComponentId == item.id);
                if (nameId != -1) {
                    optionsArr[nameId].painName = item.name;
                }
            });
            //console.log(optionsArr);
            this.data.painOptions = optionsArr;
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
                "authorName": "",
                "authorTitle": "",
                "authorType": 2,
                "bgUrl": "",
                "description": "",
                "halfFigure": "",
                "iconId": null,
                "iconUrl": "",
                "painIds": [],
                "painOptions": []
            }
            this.painIdsSelect = [];
            this.getPainList();
        },
        // 提交信息
        submitInfo() {
            let datas = Object.assign({}, this.data);
            if (this.data.authorName.replace(/\s/g, '') == '' || this.data.authorName.length > 30) {
                this.showMsg('请输入专家名称(1~30字)');
                return;
            }
            if (datas.iconUrl == '') {
                this.showMsg('请选择专家头像');
                return;
            }
            if (datas.halfFigure == '') {
                this.showMsg('请选择半身图');
                return;
            }
            if (datas.bgUrl == '') {
                this.showMsg('请选择背景图');
                return;
            }
            if (this.tagsList.length == 0) {
                this.showMsg('请选择标签');
                return;
            }
            datas.labelIds = [];
            this.tagsList.forEach(item => {
                datas.labelIds.push(item.id);
            })
            let url = AUTHOR_ADD;
            if (this.id != '') {
                url = AUTHOR_EDIT;
            } else {
                //新增专家painOptions字段名不同
                let newOptions = [];
                datas.painOptions.forEach(item => {
                    //console.log(item)
                    for (var key in item) {
                        if (key == 'painComponentId') {
                            item.id = item[key];
                            delete item.painComponentId;
                        } else if (key == 'painName') {
                            item.text = item[key];
                            delete item.painName;
                        } else if (key == 'opinion') {
                            item.option = item[key];
                            delete item.opinion;
                        }
                    }
                    newOptions.push(item);
                });
                datas.painOptions = newOptions;
            }
            datas.painOptions = JSON.stringify(datas.painOptions);
            this.isLoading = true;
            client.postData(url, datas).then(response => {
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
                this.showMsg(response.message);
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
                "authorName": "",
                "authorTitle": "",
                "authorType": 2,
                "bgUrl": "",
                "description": "",
                "halfFigure": "",
                "iconId": null,
                "iconUrl": "",
                "painIds": [],
                "painOptions": []
            }
            this.painList = [];
            this.painIdsSelect = [];
            if (this.id == '') {
                this.tagsList = [];
                this.title = '添加专家';
                this.getPainList();
                setTimeout(() => {
                    this.typesList = client.global.componentTypes;
                }, 30)
                return;
            }
            this.title = '编辑专家';
            this.isLoading = true;
            this.painList = [];
            client.postData(AUTHOR_GET + '?componentId=' + this.id, {}).then(response => {
                this.isLoading = false;
                if (response.code == 200) {
                    let data = response.data;
                    //console.log(data);
                    if (data.painIds) {
                        data.painIds.forEach(item => {
                            this.painIdsSelect.push({ id: item, name: '' })
                        })
                        this.data.painIds = data.painIds;
                    }
                    if (data.painOptions) {
                        /*data.painOptions.forEach(item => {
                            this.painIdsSelect.push({ id: item, name: '' })
                        })*/
                        this.data.painOptions = data.painOptions;
                    }
                    /*"authorName": "",
                                    "authorTitle":"",
                                    "authorType":2,
                                    "bgUrl":"",
                                    "description":"",
                                    "halfFigure":"",
                                    "iconId":"",
                                    "iconUrl":"",
                                    "painIds":[],
                                    "painOptions":[]*/


                    this.getPainList();
                    this.data.authorId = data.authorId;
                    this.data.authorName = data.authorName;
                    this.data.authorTitle = data.authorTitle;
                    this.data.description = data.description;
                    this.data.iconUrl = data.iconUrl;
                    this.data.halfFigure = data.halfFigure;
                    this.data.bgUrl = data.bgUrl;
                    data.tags.forEach(item => {
                        item.id = item.tagId;
                        item.text = item.tagName;
                    })
                    this.tagsList = data.tags;

                } else {
                    this.showMsg(response.msg);
                }
            }, data => {
                this.isLoading = false;
                this.showMsg(data.message);
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