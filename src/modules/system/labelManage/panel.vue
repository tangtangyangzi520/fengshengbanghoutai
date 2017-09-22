<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'800px'">
            <div slot="content">
                <div class="row">
                    <form class="form-horizontal" name="addForm" role="form">
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>关注点</label>
                            <div class="controls col-md-6">
                                <m-multi-select :data="painList" v-if="showPainListSelect" :active-items="painIdsSelect" :placeholder="'请选择内容'" :change-func="selectPainFunc"></m-multi-select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required"></span>专家</label>
                            <div class="controls col-md-6">
                                <m-select :data="authorList" :active-items="selectAuthor" :placeholder="'请选择专家'" :change-func="selectAuthorFunc" :class="'fixedIcon'"></m-select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>视频名称</label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="data.title" placeholder="输入视频名称">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="subtitle" class="col-sm-3 control-label">描述</label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="data.subtitle" placeholder="请输入描述">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="subtitle" class="col-sm-3 control-label">
                                <span class="required">* </span>视频URL</label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="data.mediumUrl" @click="selectVideo" placeholder="请选择视频">
                            </div>
                        </div>
                        <div class="form-group" style="padding-bottom:10px;">
                            <label class="col-sm-3 control-label">
                                <span class="required">* </span>视频竖图</label>
                            <div class="controls col-md-6">
                                <i class="fa fa-image pick-img" @click="showSelectPicDialogHarp" v-if="data.mediumHomeIconHarp==''" style="margin-top: 20px;"></i>
                                <img :src="data.mediumHomeIconHarp" class="cursor" @click="showSelectPicDialogHarp" height="80" v-else style="margin-bottom:-10px;">
                            </div>
                        </div>
                        <div class="form-group" style="padding-bottom:10px;">
                            <label class="col-sm-3 control-label">
                                <span class="required">* </span>视频横图</label>
                            <div class="controls col-md-6">
                                <i class="fa fa-image pick-img" @click="showSelectPicDialogAcross" v-if="data.mediumHomeIconAcross==''" style="margin-top: 20px;"></i>
                                <img :src="data.mediumHomeIconAcross" class="cursor" @click="showSelectPicDialogAcross" height="60" v-else style="margin-bottom:-10px;">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">
                                <span class="required"></span>标签</label>
                            <div class="controls col-md-6">
                                <m-multi-select :data="labelList" :active-items="labelIdsActive" :placeholder="'请选择标签'" :change-func="selectLabelFunc"></m-multi-select>
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
        <div style="position:fixed;z-index:111111;" v-show="picShowOption.show">
            <select-pic v-show="picShowOption.show" :options="picShowOption" :onselect="selectPicFunc" :oncancel="cancelSelect"></select-pic>
        </div>
        <div style="position:fixed;z-index:111111;" v-show="mediaShowOption.show">
            <select-media v-show="mediaShowOption.show" :options="mediaShowOption" :onselect="selectMediaFunc" :oncancel="cancelSelect"></select-media>
        </div>
        <div class="loading" style="position:fixed;z-index:11111;" v-if="isLoading">
            <div class="page-spinner-bar">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
            </div>
        </div>
    </div>
</template>
<script>
import client from '../../../common/utils/client';
import { selectPic, selectMedia, mAlert, mSelect, mMultiSelect } from '../../../components';
import { showSelectPic, getSelectPicList, showSelectMedia, getSelectMediaList } from '../../../vuex/actions/actions.resource';
export default {
    components: { selectPic, mAlert, mSelect, mMultiSelect, selectMedia },
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
            labelIdsActive: [], //选中标签
            labelList: [],
            painIdsSelect: [],
            painList: [],
            authorList: [],
            selectAuthor: { id: 0, name: '默认' },   //选择的作者
            componentShowOption: {},
            data: {
                "componentType": 24,
                "painIds": [],
                "mediumHomeIcon": "",
                "authorId": '',
                "mediumUrl": '',
                "mediumHomeIconAcross": '',
                "mediumHomeIconHarp": '',
                "subtitle": "",
                "title": "",
                "labelIds": [],
            },
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '创建视频',
        }
    },
    vuex: {
        getters: {
            mediaShowOption: ({ resourceControl }) => resourceControl.mediaShowOption,
            selectMediaList: ({ resourceControl }) => resourceControl.selectMediaList,
            picShowOption: ({ resourceControl }) => resourceControl.picShowOption,
            selectPicList: ({ resourceControl }) => resourceControl.selectPicList,
        },
        actions: { showSelectPic, getSelectPicList, showSelectMedia }
    },
    methods: {
        selectVideo() {
            this.showSelectMedia({ name: 'video', type: 'video', storeType: 5, show: true });
        },
        // 选择媒体文件回调
        selectMediaFunc(list) {
            this.data.mediumUrl = list[0].url;
            this.showSelectMedia({ show: false });
        },
        // 显示选择竖图
        showSelectPicDialogHarp() {
            this.selectPicType = 1;
            this.showSelectPic({ name: 'bannerPic', show: true, storeType: 5, single: true, cut: { width: 750, height: 1120 } });
        },
        // 显示选择横图
        showSelectPicDialogAcross() {
            this.selectPicType = 2;
            this.showSelectPic({ name: 'bannerPic', show: true, storeType: 5, single: true, cut: { width: 1125, height: 633 } });
        },
        // 选择图片文件回调
        selectPicFunc(list) {
            if (this.selectPicType === 1) {
                this.data.mediumHomeIconHarp = list[0].url;
            } else {
                this.data.mediumHomeIconAcross = list[0].url;
            }
            this.showSelectPic({ show: false });
        },
        // 隐藏选择资源弹窗
        cancelSelect() {
            this.showSelectPic({ show: false });
            this.showSelectMedia({ show: false });
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
        // 选择标签
        selectLabelFunc(list) {
            if (list instanceof Array) {
                this.labelIdsActive = list;
            } else {
                this.labelIdsActive = [list];
            }
            this.data.labelIds = [];
            this.labelIdsActive.forEach(item => {
                this.data.labelIds.push(item.id);
            })
        },
        // 选择作者回调
        selectExpertFunc(list) {
            let experts = [];
            list.forEach((item) => {
                experts.push(item.id);
            })
            this.expertsListSelect = experts;
            if (this.expertsListSelect.length != 0) {
                this.data.experts = this.expertsListSelect;
            } else {
                this.data.experts = [];
            }
        },
        selectAuthorFunc(item) {
            this.selectAuthor = { id: item.id, name: item.name };
            this.data.authorId = item.id;
        },
        getLabelsList() {
            client.postData(COMPONENT_LABELS_BY_PARENT + '?parentId=52', {}).then(data => {
                if (data.code != 200) {
                    this.showMsg(data.msg);
                } else {
                    let list = data.data;
                    this.labelList = [];
                    for (let i = 0; i < list.length; i++) {
                        this.labelList.push({ id: list[i].labelId, name: list[i].labelName });
                    }
                }
            }, response => {
                this.showMsg('网络连接错误');
            })
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
        // 获取作者列表
        getExpertList() {
            client.postData(COMPONENT_GET_AUTHORS, {}).then(data => {
                if (data.code == 200) {
                    let list = data.data;
                    for (let i = 0; i < list.length; i++) {
                        list[i].name = list[i].title;
                        list[i].id = list[i].componentId;
                    }
                    this.authorList = list;
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
                "componentType": 24,
                "painIds": [],
                "mediumHomeIcon": "",
                "authorId": '',
                "mediumUrl": '',
                "mediumHomeIconAcross": '',
                "mediumHomeIconHarp": '',
                "subtitle": "",
                "title": "",
                "labelIds": [],
            }
            this.labelIdsActive = [];
            this.contentSelect = '';
            this.painIdsSelect = [];
            this.getPainList();

        },
        // 提交信息
        submitInfo() {
            let data = this.data;
            if (this.painIdsSelect.length === 0) {
                this.showMsg('请选择关注点');
                return;
            }
            if (data.title.replace(/\s/g, '') == '') {
                this.showMsg('请输入名称');
                return;
            }
            if (data.mediumUrl.replace(/\s/g, '') == '') {
                this.showMsg('请输入视频URL');
                return;
            }
            if (data.mediumHomeIconHarp == '') {
                this.showMsg('请选择视频竖图');
                return;
            }
            if (data.mediumHomeIconAcross == '') {
                this.showMsg('请选择视频横图');
                return;
            }
            data.mediumHomeIcon = data.mediumHomeIconHarp + '&&' + data.mediumHomeIconAcross;
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
        },
        getComponentById(id) {
            this.isLoading = true;
            client.postData(COMPONENT_GET + '?componentId=' + id, {}).then(response => {
                this.isLoading = false;
                if (response.code != 200) {
                    this.showMsg(response.msg);
                } else {
                }
            }, response => {
                this.isLoading = false;
                this.showMsg('网络连接错误');
            })
        }
    },
    created() {
        this.getPainList();
        this.getExpertList();
        this.getLabelsList();
    },
    watch: {
        show() {
            this.showPage = this.show;
            this.showDialog = this.show;
        },
        id() {
            this.data = {
                "componentType": 24,
                "painIds": [],
                "mediumHomeIcon": "",
                "authorId": '',
                "mediumUrl": '',
                "mediumHomeIconAcross": '',
                "mediumHomeIconHarp": '',
                "subtitle": "",
                "title": "",
                "labelIds": [],
            }
            this.painList = [];
            this.painIdsSelect = [];
            this.selectAuthor = { id: 0, name: '' };
            this.labelIdsActive = [];
            if (this.id == '') {
                this.title = '创建视频';
                this.getPainList();
                this.getExpertList();
                this.getLabelsList();
                return;
            }
            this.title = '编辑视频';
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
                        data.labelIds.forEach(item => {
                            this.labelIdsActive.push({ id: item, name: '' });
                        })
                        this.data.mediumHomeIconHarp = data.mediumHomeIcon.split('&&')[0];
                        this.data.mediumHomeIconAcross = data.mediumHomeIcon.split('&&')[1];
                        this.data.panIds = data.painIds;
                        this.selectAuthor = { id: data.authorId, name: '' };
                    }
                    this.getPainList();
                    this.getLabelsList();
                    this.getExpertList();
                    this.data.title = data.title;
                    this.data.subtitle = data.subtitle;
                    this.data.mediumUrl = data.mediumUrl;
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
        this.showPainListSelect = true;
    },
    beforeDestroy() {
        this.showPainListSelect = false;
    }
};
</script>