<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'400px'">
            <div slot="content">
                <div class="row nopadding col-md-12">
                    <div class="form-group">
                        <label class="col-sm-3 control-label">订单状态：</label>
                        <div class="controls col-md-6">
                            <select v-model="editStatusData.ordStatus" class="type">
                                <option v-for="item in orderSubStatusList" :value="item.id" selected="selected">{{item.name}}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="btnList">
                <button type="button" @click.stop="editOrderSubStatus" class="btn default blue">确定</button>
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
    </div>
</template>
<script>
import client from '../../common/utils/client';
import { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList } from '../../components';
import loading from '../common/loading';
import { showSelectPic, getSelectPicList } from '../../vuex/actions/actions.resource';
export default {
    components: { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList, loading },
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
    },
    data() {
        return {
            isLoading: false,
            showDialog: false,
            showPage: false,
            orderSubStatusList: [{ id: 5, name: '售后线下处理' }],
            componentShowOption: {},
            editStatusData: {
                "ordOrderId": 0,
                "ordStatus": 0,
            },
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '设置订单状态',
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
        //选择下拉框
        selectComponentFunc(item) {
            this.editStatusData.ordStatus = item.id;
        },
        //修改子订单状态
        editOrderSubStatus() {
            this.editStatusData.ordOrderId = this.id;
            // if(!this.editStatusData.ordStatus){
            //     this.showMsg("请选择订单状态");
            //     return;
            // }
            client.postData(ORDER_EDIT_STATUS, this.editStatusData).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    this.hideDialog();
                    this.$parent.getList();
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

    },
    computed() {

    },
    created() {

    },
    watch: {
        show() {
            this.showPage = this.show;
            this.showDialog = this.show;
        },
    },
    ready() {
        this.typesList = client.global.componentTypes;
    },
    beforeDestroy() {

    }
};
</script>