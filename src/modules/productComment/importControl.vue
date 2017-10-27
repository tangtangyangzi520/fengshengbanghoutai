<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'600px'">
            <div slot="content" style="padding-bottom=20px;">
                <div style="padding-bottom=20px;">
                    <form id="exportForm" method="POST" enctype="multipart/form-data">
                        <input type="file" name="file" :value="fileName" accept=".csv,application/vnd.ms-excel" style="display:inline">
                    </form>
                </div></br>
                <div>说明: 请按照下载的导入模板进行上传导入,文件格式为".xls" (Excel 97-2003)</div>
            </div>
            <span slot="btnList">
                <button type="button" class="btn blue" @click="importComment">确定</button>
                <button type="button" class="btn default" @click="hideDialog">取消</button>
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
import itemMove from '../../components/page/itemMove';


export default {
    components: {
        selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList, loading, itemMove
    },
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
        editData: {
            type: Object,
            value: {}
        },
        progressObject: {
            width: '',
        }
    },
    data() {
        return {
            showOddDialog: false,
            destroyControlDialog: false,
            orderlog: [],
            isLoading: false,
            showDialog: false,
            showPage: false,
            showPainListSelect: true,
            painIdsSelect: [],
            painList: [],
            imgList: [],
            componentShowOption: {},
            data: null,
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '导入评论',
            showCampaignStatus: false,
            fileName:'',
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
        // 导入excel
        importComment() {
            if(this.fileName.length==0){
                this.showMsg("请选择需要上传的文件");
                return;
            }
            $("#exportForm").attr("action", OIC_IMPORT_LIST);
            $("#exportForm").submit();
        },
        hideAddDialog() {
            this.showDialog = false;
        },
        hideDialog() {
            setTimeout(() => {
                this.showPage = false;
                this.show=false;
            }, 300)
        },
        hideCampaignDialog() {
            this.showCampaignStatus = false;
            setTimeout(() => {
                this.showCampaignStatus = true;
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
        this.showPainListSelect = true;
    },
    beforeDestroy() {
        this.showPainListSelect = false;
    }
};
</script>
<style>
.myBorder {
    border-top: 1px solid #000
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s
}

#PreferentialContent {
    border: 2px solid #CCCCCC;
    width: 300px;
    position: absolute;
    bottom: -10%;
    left: 70%;
    background-color: white;
    display: none;
}

#PreferentialContent td {
    background-color: white;
    border-right: 2px solid #D7D7D7;
    border-left: 2px solid #D7D7D7;
}
</style>