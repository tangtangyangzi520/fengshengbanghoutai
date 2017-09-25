<template>
    <!-- 通用属性添加/编辑页面 -->
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'800px'">
            <div slot="content">
                <div class="row nopadding">
                    <form class="form-horizontal" name="addForm" role="form">
                        <div class="row">
                            <div class="col-md-6">
                                <label for="title" class="col-sm-3 control-label">
                                    <span class="required">* </span>属性名称：
                                </label>
                                <div class="controls col-md-8">
                                    <input type="hidden" class="form-control input-sm" v-model="data.pcraCatId">
                                    <input type="text" class="form-control input-sm" v-model="data.pcaName" placeholder="请输入属性名称">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label for="title" class="col-sm-3 control-label">是否必填：</label>
                                <div class="controls col-md-3" style="padding-top:6px;">
                                    <input type="checkbox" v-model="data.pcaRequired" />
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <label for="title" class="col-sm-4 control-label">是否默认展示：</label>
                                <div class="controls col-md-3" style="padding-top:6px;">
                                    <input type="checkbox" v-model="data.pcaUseFlag" />
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label for="title" class="col-sm-3 control-label">备注：</label>
                                <div class="controls col-md-8">
                                    <input type="text" class="form-control input-sm" v-model="data.pcaMemo" placeholder="请输入备注">
                                </div>
                            </div>
						</div>
                        <div class="row" >
                            <div class="col-md-6">
                                <label class="col-sm-3 control-label">
                                    <span class="required">*</span>属性类型：
                                </label>
                                <div class="col-md-3" style="padding-top:6px;">
                                    <select v-model="data.pcaInputType" class="type">
                                        <option value="-1">请选择</option>
                                        <option v-for="item in inputtypesList" :value="item.key">{{item.keyValue}}</option>
                                    </select>
                                </div> 
                                <div class="col-md-4" style="padding-top:6px;">
                                    <!-- 编辑属性值链接 -->
                                    <a v-show="isShowEditAttrLink" @click.stop="showEditAttrDialog">编辑属性值</a>
                                </div>
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

        <!-- 编辑属性值弹出框 -->
        <attr-option-control v-if="!destroyControlDialog" :show="isShowEditAttrDialog" :onhide="closeEditAttrDialog" v-on:attroptionlist="recieveAttrOptionList" :optlist="data.optionList"></attr-option-control>

        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
        <div style="position:fixed;z-index:111111;" v-show="picShowOption.show">
            <select-pic v-show="picShowOption.show" :options="picShowOption" :onselect="selectPicFunc" :oncancel="cancelSelect"></select-pic>
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
import attrOptionControl from './attrOptionControl'; // 编辑属性值页面

export default {
    components: { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList, tagTree, loading, attrOptionControl },
    props: {
        show: {
            type: Boolean,
            value: false
        },
        onhide: {
            type: Function,
            value: () => { }
        },
        selectedid: {
            type: String,
            value: 0
        },
        pcaid:{
            type: String,
            value: 0
        }
    },
    data() {
        return {
            pcaInputType: -1,
            isLoading: false,
            showDialog: false,
            showPage: false,
            showPainListSelect: true,
            inputtypesList: [], // 获取属性类型
            componentShowOption: {},
            data: {
                "pcraCatId": 0,
                "pcaName": "",
                "pcaRequired": false,
                "pcaUseFlag": false,
                "pcaMemo": "",
                "pcaInputType": -1,
                "optionList": [], // 属性值list
            },
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '添加分类属性',
            
            isShowEditAttrLink: false, // 是否显示[编辑属性值]链接
            isShowEditAttrDialog: false, // 是否显示编辑属性弹出框
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
        // 获取属性类型列表
        getinputtypeList() {
            client.postData(PCA_INPUTTYPES, {}).then(data => {
                if (data.code == 200) {
                    let list = data.data;
                    this.inputtypesList = list;
                } else {
                    this.showMsg(data.msg);
                }
            });
        },
        // 选择属性类型回调
        selectinputtypesFunc(list) {
            let types = [];
            list.forEach((item) => {
                types.push(item.id);
            });
            this.typeListSelect = types;
            if (this.typeListSelect.length != 0) {
                this.searchOptions.types = this.typeListSelect;
            } else {
                this.searchOptions.types = [];
            }
            this.setOptions();
        },
        setOptions() {
            let options = this.searchOptions;
            if (options.types && options.types.length == 0) {
                delete options.types;
            }
        },
        // 弹出选择标签弹窗
        showTagDialog() {
            this.showTagTreeSelect = !this.showTagTreeSelect;
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
        // 弹出编辑属性值页面
        showEditAttrDialog(){
            // 将编辑属性值页面弹框控制重置为false
            this.isShowEditAttrDialog = true;
        },
        // 关闭编辑属性值页面
        closeEditAttrDialog(){
            // 将编辑属性值页面弹框控制重置为false
            this.isShowEditAttrDialog = false;
        },
        // 获取编辑属性值页面attrOptionControl.vue传过来的属性值list(点击[确定]按钮的时候才会传) 
        recieveAttrOptionList(text){
            this.data.optionList = text;
            // 将编辑属性值页面弹框控制重置为false
            this.isShowEditAttrDialog = false;
        },
        // 提交信息
        submitInfo() {
            let data =  this.data;

            // 数据校验
            if (this.data.pcaName.replace(/\s/g, '') == '' || this.data.pcaName.length > 10) {
                this.showMsg('请输入属性名称(1~10字)');
                return;
            }
            if(this.data.pcaInputType < 0 ){
                this.showMsg("请选择属性类型")
                return;
            }

            // 组装数据
            if(data.pcaRequired){ // 是否必填
                data.pcaRequired = 1;
            }else{
                data.pcaRequired = 0;
            }
            if(data.pcaUseFlag){ // 是否默认展示
                data.pcaUseFlag = 1;
            }else{
                data.pcaUseFlag = 0;
            }
            
            // 添加/编辑url
            let url = PCA_INSERT;// 添加url
            if (this.pcaid != '') {
                url = PCA_UPDATE + '?pcaId=' + this.pcaid;// 编辑url
                data.pcaId = this.pcaid;
            } 
            this.isLoading = true;
            data.pcraCatId = this.selectedid;

            // 发送添加/编辑通用属性请求
            client.postData(url, data).then(response => {
                this.isLoading = false;
                if (response.code != 200) {
                    this.showMsg(response.message);
                } else {
                    if (this.pcaid != '') {
                        this.onhide('update');
                    } else {
                        this.onhide('create');
                    }

                    //清空数据
                    this.data = {
                        "pcraCatId": 0,
                        "pcaName": "",
                        "pcaRequired": false,
                        "pcaUseFlag": false,
                        "pcaMemo": "",
                        "pcaInputType": -1,
                        "optionList": [], // 属性值list
                    }
                }
            }, response => {
                this.isLoading = false;
                this.showMsg(response.message);
            })
        }
    },
    created() {
        this.data.pcraCatId = this.selectedid;
        this.getinputtypeList();
    },
    watch: {
        show() {
            this.showPage = this.show;
            this.showDialog = this.show;
        },
        // 监听属性类型下拉框的变化,当属性类型=单选、多选、下拉列表时,显示[编辑属性值]链接
        'data.pcaInputType': function(val, oldVal){
            if(val == 1 || val == 2 || val == 3){
                this.isShowEditAttrLink = true;
            }else{
                this.isShowEditAttrLink = false;
            }
        },
        // 监听类目通用属性id
        pcaid() {
            //清空数据
            this.data = {
                "pcraCatId": 0,
                "pcaName": "",
                "pcaRequired": false,
                "pcaUseFlag": false,
                "pcaMemo": "",
                "pcaInputType": -1,
                "optionList": [], // 属性值list
            }
            
            // 判断是添加还是编辑
            if (this.pcaid == '') {
                //this.tagsList = [];
                this.title = '添加分类属性';
                this.isLoading = true;
                // setTimeout(() => {
                //     this.typesList = client.global.componentTypes;
                // }, 30)
                // return;
            }else{
                this.title = '编辑分类属性';
                this.isLoading = true;

                // 编辑回显
                client.postData(PCA_QUERY_BYID + '?pcaId=' + this.pcaid, {}).then(response => {
                    this.isLoading = false;
                    if (response.code == 200) {
                        let data = response.data;
                        this.data.pcraCatId = data.selectedid;
                        this.data.pcaName = data.pcaName;
                        this.data.pcaSaleProp = data.pcaSaleProp;
                        this.data.pcaRequired = data.pcaRequired;
                        this.data.pcaMemo = data.pcaMemo;
                        this.data.pcaInputType = data.pcaInputType;
                        this.data.pcaUseFlag = data.pcaUseFlag;
                        this.data.optionList = data.pcaoList;// 属性值list
                    } else {
                        this.showMsg(response.msg);
                    }
                }, data => {
                    this.isLoading = false;
                    this.showMsg(response.msg);
                });
            }
        }
    },
    ready() {
    
    },
    beforeDestroy() {

    }
};
</script>