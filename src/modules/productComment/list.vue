<template>
    <div>
        <div class="page-bar min-bar">
            <page-title-bar v-show="showflag">
                <span slot="title">商品内部评价</span>
            </page-title-bar>
            <search :onchange="changeSearchOptions" :oncreate="getList" v-ref:search></search>
            <br>
            <div class="col-md-12 left">
                <div class="col-md-4"></div>
                <div class="col-md-8 right">
                    <button class="btn blue" type="button" @click="downloadTemplate" v-if="limitResource.productComment_downloadTemplate">下载导入模板</button>
                    <button class="btn blue" type="button" @click="showImport" v-if="limitResource.productComment_importComment">导入评论</button>
                    <button class="btn blue" type="button" @click="getList(false,true)">筛选</button>
                </div>
            </div>
        </div>
        <form id="templateForm" method="POST">
            <input type="hidden" v-model="exportString" name="request">
        </form>
        <div class="contentOrderBlock" id="contentList">
            <div class="table-responsive col-md-12">
                <table class="table orderTable table-striped table-bordered table-hover">
                    <thead>
                        <tr style="background-color:rgba(215, 215, 215, 1);height:40px;">
                            <th style="width:10%;">买家昵称</th>
                            <th style="width:20%;">sku名称</th>
                            <th style="width:35%;">评论内容</th>
                            <th style="width:5%;">星级</th>
                            <th style="width:5%;">图片状态</th>
                            <th style="width:15%;">评论时间</th>
                            <th style="width:10%;">操作</th>
                        </tr>
                        <tr v-for="item in dataList" :key="item.oicId">
                            <td style="vertical-align: middle;">{{item.oicMemberNickname}}</td>
                            <td style="vertical-align: middle;">{{item.oicProductName}}</td>
                            <td style="vertical-align: middle;">{{item.oicComment}}</td>
                            <td style="vertical-align: middle;">{{item.oicStarNum}}</td>
                            <td style="vertical-align: middle;">{{item.oicImgStatus==0 ? "无图" : "有图"}}</td>
                            <td style="vertical-align: middle;">{{item.oicCreatedTime}}</td>
                            <td style="vertical-align: middle;">
                                <button class="btn blue" type="button" @click="edit(item)" v-if="limitResource.productComment_edit">编辑</button>
                                <button class="btn blue" type="button" @click="showDelete(item)" v-if="limitResource.productComment_delete">删除</button>
                            </td>
                        </tr>
                    </thead>
                </table>
            </div>
            <div v-if="dataList.lenth==0" class="center">
                暂无数据
            </div>
        </div>
        <paging :current-page="page.currentPage" :page-size="page.pageSize" :start-index="page.startIndex" :total-page="page.totalPage" :total-size="page.totalSize" :change="getList"></paging>
        <!-- 创建编辑评论弹窗 -->
        <comment-control v-if="!destroyControlDialog" :id="orderEditId" :edit-data="editItem" :show="showAddDialog" :onhide="hideAddDialog"></comment-control>
        <!-- 创建导入评论弹窗 -->
        <import-control v-if="!destroyControlDialog" :id="orderEditId" :edit-data="editItem" :show="showImport" :onhide="hideImportDialog"></import-control>
        <m-alert :title="'温馨提示'" :show-cancel-btn="true" :show="showDeleteDialog" :onsure="deleteControl" :onhide="hideMsg">
            <div slot="content">是否确认删除？</div>
        </m-alert>

        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
        <control :show="showControl" :items="clickItems" :onhide="hideControlFunc" :type="controlType"></control>
        <loading :show="isLoading"></loading>
    </div>
</template>
<script>
import client from '../../common/utils/client';
import { pageTitleBar, paging, itemControl, mMultiSelect, mAlert, mSelect } from '../../components';
import search from './search';
import control from '../common/control';
import loading from '../common/loading';
import commentControl from './commentControl';
import importControl from './importControl';
let vueThis = null;
export default {
    components: {
        pageTitleBar, paging, itemControl, mAlert, mMultiSelect, mSelect, search, control, loading, commentControl, importControl
    },
    props: {
        title: '',
        ospuid: 0,
        oflag: false,
        ooflag: false,
        show: {
            type: Boolean,
            value: false
        },
        onhide: {
            type: Function,
            value: () => { }
        },
    },
    data() {
        return {
            showflag: true,
            limgflag: false,
            lspuid: 0,
            lflag: false,
            exportString: '',
            reason: false,
            isLoading: false,
            countDesc: '',  //数据统计
            dataList: [],
            page: {},   // 分页请求数据
            showAlert: false,
            showAddDialog: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            limitResource: null, //发布状态
            clickItems: [],   //点击操作的数据项
            controlType: '',  //当前操作的权限类型
            showControl: false, //显示操作弹窗
            destroyControlDialog: false, //注销良言操作弹框
            destroyPaymentDialog: false,
            orderEditId: '',
            orderSetData: null,
            orderSubData: null,
            orsId: 0,
            ordOrderId: 0,
            ordStar: 0,
            ordDemo: "",
            testSelectedSpu: [],
            checkedList: [true, false, false, false, false, false, false],//用来使被选中标签高亮
            editItem: {},
            showDeleteDialog: false, //删除弹框
            selRow: {}, //选择的行
            showImportDialog: false,
        }
    },
    computed: {
        selectItems() {
            let list = [];
            this.dataList.forEach(item => {
                item.checked && list.push(item);
            })
            return list;
        },
    },
    filters: {
        filterStatus(id) {
            return client.global.componentStatus.find(item => item.id == id).name;
        },
        filterTime(time) {
            return client.formateTime(time);
        }
    },
    methods: {
        //弹出导入评论框
        showImport() {
            this.showImportDialog = true;
        },
        //下载导入模板
        downloadTemplate() {
            $("#templateForm").attr("action", OIC_EXPORT_TEMPLATE);
            $("#templateForm").submit();
        },
        // 弹出删除
        showDelete(item) {
            this.selRow = item
            this.showDeleteDialog = true;
        },
        // 确认删除
        deleteControl() {
            this.deleteItem(this.selRow);
            this.showDeleteDialog = false;
        },
        // 编辑
        edit(item) {
            this.editItem = item;
            this.showAddDialog = true;
        },
        // 删除操作
        deleteItem(item) {
            // 发送删除请求
            client.postData(OIC_DELETE + "?id=" + item.oicId).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    this.showMsg("删除成功");
                    this.getList(false, true);
                } else {
                    this.showMsg("删除失败" + data.msg);
                }
            }, data => {
                this.showMsg("删除失败");
            });
        },
        clearSearchOptions() {
            this.$refs.search.clearOptions()
        },
        //隐藏导入评论
        hideImportDialog() {
            this.showImportDialog = false;
        },
        hideAddDialog(control) {
            this.expertEditId = '';
            this.showAddDialog = false;
            if (control && control == 'create') {
                this.showMsg('保存成功');
            }
            if (control && control == 'update') {
                this.showMsg('更新成功');
            }
            if (control) {
                setTimeout(() => {
                    //移除组件
                    this.destroyControlDialog = true;
                }, 100)
                setTimeout(() => {
                    //重新加入
                    this.destroyControlDialog = false;
                }, 200)
                this.getList();
            }
        },
        // 搜索条件变化
        changeSearchOptions(options) {
            this.searchOptions = options;
        },
        hideControlFunc(type) {
            if (type == 'success') {
                this.getList();
            }
            this.showControl = false;
        },
        getList(page, firstSearch) {
            let options;
            options = Object.assign({}, this.searchOptions);
            if (page) {
                options.page = page;
            } else {
                options.page = this.page;
            }
            this.isLoading = true;
            this.dataList = [];
            client.postData(OIC_GET_LIST, options).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    this.dataList = data.data;
                    this.page = data.page;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
            })
        },
        getCount(options) {
            options.componentType = [12];
            client.postData(COMPONENT_ARTICLE_COUNTER, options).then(data => {
                if (data.code == 200) {
                    this.countDesc = data.data;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
            })
        },
        selectAll() {
            this.dataList.forEach(item => {
                item.checked = true;
            })
        },
        reverseList() {
            this.dataList.forEach(item => {
                item.checked = !item.checked;
            })
        },
        selectItem(item) {
            //item.checked = !item.checked;
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
            this.showAddDialog = false;
            this.showDeleteDialog = false;
        }
    },
    created() {
        vueThis = this;
        this.limitResource = JSON.parse(localStorage.getItem('limitResource'));
        this.getList(false, true);
    },
    watch: {

    },
    route: {

    },
    ready() {
        client.resetListHeight();
    }
};
</script>

<style lang="less">
@import "../../common/css/common.less";
@import "../../common/css/list.less";
.contentOrderBlock {
    overflow: auto;
    border: none;
    margin-top: 0px;
}

.contentOrderleft {
    position: relative;
    min-height: 1px;
    padding-left: 6px;
    padding-right: 15px;
}

.orderTable {
    width: 100%;
    margin-bottom: 8px;
}
</style>