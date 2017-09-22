<template>
    <div>
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
        <!--确定停用-->
        <m-alert :title="'停用品牌'" :show-cancel-btn="true" :show="showUnuseDialog" :onsure="ajaxControl" :onhide="hideMsg">
            <div slot="content">确定停用吗？</div>
        </m-alert>
        <!--确定启用-->
        <m-alert :title="'启用品牌'" :show-cancel-btn="true" :show="showUseDialog" :onsure="ajaxControl" :onhide="hideMsg">
            <div slot="content">确定启用吗？</div>
        </m-alert>
        <loading :show="isLoading"></loading>
    </div>
</template>

<script>
import client from '../../common/utils/client';
import loading from '../common/loading';
import { mMultiSelect, mAlert, mSelect } from '../../components';
export default {
    components: { mMultiSelect, mAlert, mSelect, loading },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: ''
        },
        items: {
            type: Array,
            default: []
        },
        onhide: {
            type: Function,
            default: () => { }
        }
    },
    data() {
        return {
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            isLoading: false,
            importantData: null,
            showUnuseDialog: false,
            showUseDialog: false,
            rejectDesc: '',    //拒绝理由
            withdrawDesc: '',  //撤回说明
            important: '',//优先级选择
            order: '',//优先级排序
            pullNum: 10, //一次拉取爬虫文章数量
        }
    },
    methods: {
        ajaxControl() {
            // 确定提交
            this.isLoading = true;
            if (this.type == 'withdrawAll') {
                this.url = COMPONENT_BATCH_WITHDRAW + '?deployOption=' + this.withdrawDesc;
            }
            if (this.type == 'rejectAll') {
                this.url = COMPONENT_BATCH_REJECT + '?rejectOption=' + this.rejectDesc;
            }
            if (this.type == 'important') {
                this.options = this.importantData;
            }
            if (this.type == 'getMoreArticle') {
                this.options = { pullNum: this.pullNum };
            }
            client.postData(this.url, this.options).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    this.onhide('success')
                    this.showMsg(this.tips);
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
                this.showMsg(data.message);
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
            this.showRejectDialog = false;
            this.showAlert = false;
            this.showSubmitDialog = false;
            this.showWithdrawDialog = false;
            this.showPublishDialog = false;
            this.showUnuseDialog = false;
            this.showUseDialog = false;
            this.showPutawayDialog = false;
            this.showSoldOutDialog = false;
            this.showImportantDialog = false;
            this.showGetArticleDialog = false;
            this.onhide();
        }
    },
    watch: {
        show(val) {
            if (!val) return;
            this.options = {};
            switch (this.type) {
                case 'unuse':
                    this.tips = '停用成功';
                    this.url = PBD_DISPLAY + "?pbdBrandId=" + this.items[0].pbdBrandId+"&pbdDisplay=" + this.items[0].pbdDisplay;
                    this.showUnuseDialog = true;
                    break;
                case 'use':
                    this.tips = '启用成功';
                    this.url = PBD_DISPLAY + "?pbdBrandId=" + this.items[0].pbdBrandId+"&pbdDisplay=" + this.items[0].pbdDisplay;
                    this.showUseDialog = true;
                    break;
                default:
                    break;
            }
        }
    }
}
</script>

<style>

</style>
