<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'600px'">
            <div slot="content">
                <!-- <m-select :data="cancelReasonList" :placeholder="'请选择取消原因'" :change-func="selectReasonFunc" :class="'fixedIcon'" ></m-select> -->
                <div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">订单状态：</label>
                    <div class="controls col-md-6">
                    <select v-model="editReasonData.ordCancelReason" class="type">
                        <option v-for="item in cancelReasonList" :value="item.keyValue">{{item.keyValue}}</option>
                    </select>
                </div>
                </div>
                <span slot="btnList">
                    <button type="button" @click.stop="editCancelReason" class="btn default blue">确定</button>
                    <button type="button" class="btn default" data-dismiss="modal">取消</button>
                </span>
            </div>
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
        setdata:{},
        sendReq:false,
    },
    data() {
        return {
            editReasonData:{
                "ordOrderId":0,
                "ordStatus":5,
                "ordCancelReason":'',
            },
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
            title: '取消订单',
            cancelReasonList:[],
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
        //提交原因
        editCancelReason(){
            this.editReasonData.ordOrderId=this.id;
            console.log(this.editCancelReason);
            if(!this.editReasonData.ordCancelReason){
                // this.showMsg("请选择订单状态");
                return;
            }
            client.postData(ORDER_EDIT_REASON,this.editReasonData).then(data => {
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
        //获取取消原因
        getCancelReasonList(){
            let url=ORDER_CANCEL_REASON;
            client.postData(url,{}).then(data => {
               // this.isLoading = false;
                if (data.code != 200) {
                    this.showMsg(data.msg);
                } else {
                    this.cancelReasonList=data.data;
                }
            }, data => {
                //this.isLoading = false;
                this.showMsg(data.msg);
            })
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
            datas.labelIds = [];
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
        
    },
    watch: {
        sendReq(){
            this.getCancelReasonList();
        },
        show() {
            this.showPage = this.show;
            this.showDialog = this.show;
        },
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