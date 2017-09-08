<template>
    <div>
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
    
        <m-alert :title="'提交内容'" :show-cancel-btn="true" :show="showSubmitDialog" :onsure="ajaxControl" :onhide="hideMsg">
            <div slot="content">确定提交吗？</div>
        </m-alert>
        <!--确定发布-->
        <m-alert :title="'发布内容'" :show-cancel-btn="true" :show="showPublishDialog" :onsure="ajaxControl" :onhide="hideMsg">
            <div slot="content">确定发布吗？</div>
        </m-alert>
        <!--确定上架-->
        <m-alert :title="'下架内容'" :show-cancel-btn="true" :show="showPutawayDialog" :onsure="ajaxControl" :onhide="hideMsg">
            <div slot="content">确定上架吗？</div>
        </m-alert>
        <!--确定下架-->
        <m-alert :title="'下架内容'" :show-cancel-btn="true" :show="showSoldOutDialog" :onsure="ajaxControl" :onhide="hideMsg">
            <div slot="content">确定下架吗？</div>
        </m-alert>
    
        <!--确定删除-->
        <m-alert :title="'删除内容'" :show-cancel-btn="true" :show="showDeleteDialog" :onsure="ajaxControl" :onhide="hideMsg">
            <div slot="content">确定删除吗？</div>
        </m-alert>
        <m-alert :title="'拒绝提交申请'" :show-cancel-btn="true" :onsure="ajaxControl" :show="showRejectDialog" :onhide="hideMsg">
            <div class="form-group" slot="content" style="padding-bottom:15px;">
                <label for="account" class="col-sm-4 control-label">拒绝理由</label>
                <div class="controls col-md-6">
                    <input type="text" class="form-control input-sm " v-model="rejectDesc" placeholder="拒绝理由">
                </div>
            </div>
        </m-alert>
        <m-alert :title="'撤回内容'" :show-cancel-btn="true" :onsure="ajaxControl" :show="showWithdrawDialog" :onhide="hideMsg">
            <div class="form-group" slot="content" style="padding-bottom:15px;">
                <label for="account" class="col-sm-4 control-label">撤回说明</label>
                <div class="controls col-md-6">
                    <input type="text" class="form-control input-sm " v-model="withdrawDesc" placeholder="撤回说明">
                </div>
            </div>
        </m-alert>
        <!--确定优先-->
        <m-alert :title="'设置优先级'" :show-cancel-btn="true" :show="showImportantDialog" :onsure="ajaxControl" :onhide="hideMsg">
            <div class="form-group" slot="content" style="padding-bottom:15px;" v-if="importantData">
                <label for="account" class="col-sm-4 control-label">优先级</label>
                <div class="controls col-md-6">
                    <select class="form-control input-sm " name="selected" v-model="importantData.priorityNum">
                        <option value="-1">请选择</option>
                        <option value="0">普通</option>
                        <option value="1">置顶</option>
                    </select>
                </div>
            </div>
            <div class="form-group" slot="content" style="padding-bottom:15px;">
                <label for="account" class="col-sm-4 control-label">排序</label>
                <div class="controls col-md-6">
                    <input type="text" class="form-control input-sm " v-model="importantData.sortNum">
                </div>
            </div>
        </m-alert>
        <!--拉取爬虫文章-->
        <m-alert :title="'设置拉取数量'" :show-cancel-btn="true" :show="showGetArticleDialog" :onsure="ajaxControl" :onhide="hideMsg">
            <div class="form-group" slot="content" style="padding-bottom:15px;">
                <label for="account" class="col-sm-4 control-label">拉取数量</label>
                <div class="controls col-md-6">
                    <select class="form-control input-sm " name="selected" v-model="pullNum">
                        <option value="10">10条</option>
                        <option value="20">20条</option>
                        <option value="30">30条</option>
                        <option value="40">40条</option>
                        <option value="50">50条</option>
                        <option value="100">100条</option>
                    </select>
                </div>
            </div>
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
            showRejectDialog: false,
            showSubmitDialog: false,
            showWithdrawDialog: false,
            showPublishDialog: false,
            showDeleteDialog: false,
            showPutawayDialog: false,
            showSoldOutDialog: false,
            showImportantDialog: false,
            showGetArticleDialog: false,
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
            this.showDeleteDialog = false;
            this.showPutawayDialog = false;
            this.showSoldOutDialog = false;
            this.showImportantDialog = false;
            this.showGetArticleDialog = false;
            this.onhide();
        }
    },
    watch: {
        type(val) {
            console.log("type is " + val);
            this.type = val;
        },
        show(val) {
            if (!val) return;
            this.options = {};
            console.log("show is " + val + " type:" +this.type);
            switch (this.type) {
                case 'submit':
                    this.showSubmitDialog = true;
                    this.tips = '提交成功';
                    this.url = COMPONENT_SUBMIT + "?componentId=" + this.items[0].componentId;
                    break;
                case 'reject':
                    this.rejectDesc = '';
                    this.showRejectDialog = true;
                    this.tips = '成功拒绝';
                    this.url = COMPONENT_REJECT;
                    this.options = { "id": this.items[0].componentId, "rejectOption": this.rejectDesc };
                    break;
                case 'publish':
                    this.tips = '发布成功';
                    this.url = COMPONENT_DEPLOY + "?componentId=" + this.items[0].componentId;
                    this.showPublishDialog = true;
                    break;
                case 'putaway':
                    this.tips = '上架成功';
                    this.url = COMPONENT_PUTAWAY;
                    this.options = [];
                    this.items.forEach(item=>{
                        this.options.push(item.componentId);
                    })
                    this.showPutawayDialog = true;
                    break;
                case 'soldOut':
                    this.tips = '下架成功';
                    this.url = COMPONENT_SOLDOUT;
                    this.options = [];
                    this.items.forEach(item=>{
                        this.options.push(item.componentId);
                    })
                    this.showSoldOutDialog = true;
                    break;
                case 'important':
                    this.tips = '设置成功';
                    this.isLoading = true;
                    // 获取原数据
                    client.postData(COMPONENT_GET + '?componentId=' + this.items[0].componentId, {}).then(response => {
                        this.isLoading = false;
                        if (response.code == 200) {
                            this.importantData = response.data;
                        } else {
                            this.showMsg(response.msg);
                        }
                    }, data => {
                        this.isLoading = false;
                        this.showMsg('网络连接错误');
                    })
                    // 保存修改的数据接口
                    this.url = COMPONENT_SET;
                    this.showImportantDialog = true;
                    break;
                case 'delete':
                    console.log(this.items[0].pcaoId);
                    this.tips = '删除成功';
                     this.url = PCA_DELETE + "?pcaId=" + this.items[0].pcaId;
                    this.showDeleteDialog = true;
                    break;
                case 'withdraw':
                    this.withdrawDesc = '';
                    this.showWithdrawDialog = true;
                    this.tips = '撤回成功';
                    this.url = COMPONENT_WITHDRAW;
                    this.options = { "id": this.items[0].componentId, "deployOption": this.withdrawDesc };
                    break;
                case 'publishAll':
                    this.showPublishDialog = true;
                    this.tips = '发布成功';
                    this.url = COMPONENT_BATCH_DEPLOY;
                    this.options = [];
                    this.items.forEach(item => {
                        if (item.deployStatus == 5 || item.deployStatus == 1 || item.deployStatus == 0) {
                            this.options.push(item.componentId);
                        }
                    })
                    break;
                case 'withdrawAll':
                    this.withdrawDesc = '';
                    this.showWithdrawDialog = true;
                    this.tips = '撤回成功';
                    this.options = [];
                    this.items.forEach(item => {
                        if (item.deployStatus == 2) {
                            this.options.push(item.componentId);
                        }
                    })
                    break;
                case 'rejectAll':
                    this.rejectDesc = '';
                    this.showRejectDialog = true;
                    this.tips = '成功拒绝';
                    this.options = [];
                    this.items.forEach(item => {
                        if (item.deployStatus == 5) {
                            this.options.push(item.componentId);
                        }
                    })
                    break;
                case 'submitAll':
                    this.showSubmitDialog = true;
                    this.tips = '提交成功';
                    this.options = [];
                    this.url = COMPONENT_BATCH_SUBMIT;
                    this.items.forEach(item => {
                        if (item.deployStatus == 3 || item.deployStatus == 4) {
                            this.options.push(item.componentId);
                        }
                    })
                    break;
                case 'getMoreArticle':
                    this.showGetArticleDialog = true;
                    this.tips = '操作成功';
                    this.options = [];
                    this.url = ARTICLE_PULL_THIRD_ARTICLE;
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
