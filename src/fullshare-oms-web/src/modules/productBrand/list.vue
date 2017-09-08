<template>
      <div>
        <div class="page-bar min-bar">
            <page-title-bar>
                <span slot="title">{{name}}管理{{countDesc}}</span>
            </page-title-bar>
            <search :onchange="changeSearchOptions" :oncreate="getList"></search>
            <div class="col-md-12 right">
                <span v-if="selectItems.length>0" class="desc">已选
                    <em>{{selectItems.length}}</em> 项 </span>
                <button class="btn green" type="button" v-if="limitResource.good_word_add" @click="addBanner()" style="margin-left:10px;">添加{{name}}</button>
                <button class="btn green-meadow" @click="getList(false,true)" type="button">搜索</button>
            </div>
            <div style="height:5px;clear:both;"></div>
        </div>
        <div class="contentBlock" id="contentList">
            <div class="table-responsive col-md-12">
                <table class="table table-striped table-bordered table-hover" id="sku-content-table">
                    <thead>
                        <tr>
                            <th style="width:4%">
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll">全选</button>
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList">反选</button>
                            </th>
                            <th style="width:26%;">品牌Logo</th>
                            <th style="width:7%;">品牌名称</th>
                            <th style="width:7%;">英文名称</th>
                            <th style="width:10%;">品牌网址</th>
                            <th style="width:10%;">品牌描述</th>
                            <th style="width:10%;">国家</th>
                            <th style="width:10%;">品牌排序</th>
                            <th style="">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in dataList" @click="selectItem(item)">
                            <td style="text-align:center;vertical-align:middle;">
                                <input type="checkbox" :checked="item.checked"></input>
                            </td>
                            <td style="width:100px">
                                <p>
                                    <a target="_blank" :href="item.pbdLogoUrl" title="查看大图">
                                        <img :src="item.pbdLogoUrl" style="height:50px">
                                    </a>
                                </p>
                            </td>
                            <td>{{item.pbdName}}</td>
                            <td>{{item.pbdEnglishName}}</td>
                            <td>{{item.pbdWebsite}}</td>
                            <td>{{item.pbdIntroduce}}</td>
                            <td>{{item.pbdCountry}}</td>
                            <td>{{item.pbdSort}}</td>
                            <td>
                                <button type="button" v-if="limitResource.good_word_edit" class="btn btn-xs blue" @click.stop="showControlFunc(item,'edit')">编辑</button>
                                <button type="button" v-if="limitResource.good_word_delete" @click.stop="showControlFunc(item,'delete')" class="btn btn-xs red">删除</button>
                            </td>
                        </tr>
                        <tr v-if="dataList.length==0">
                            <td colspan="9" class="center">暂无数据</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <paging :current-page="page.currentPage" :page-size="page.pageSize" :start-index="page.startIndex" :total-page="page.totalPage" :total-size="page.totalSize" :change="getList"></paging>
        <!-- 创建品牌弹窗 -->
        <word-control v-if="!destroyControlDialog" :id="wordEditId" :show="showAddDialog" :onhide="hideAddDialog"></word-control>
        <m-alert :title="'提交品牌'" :show-cancel-btn="true" :show="showSubmitDialog" :onsure="ajaxControl" :onhide="hideMsg">
            <div slot="content">确定提交品牌吗？</div>
        </m-alert>
        
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
        <brandcontrol :show="showControl" :items="clickItems" :onhide="hideControlFunc" :type="controlType"></brandcontrol>
        <loading :show="isLoading"></loading>
    </div>
</template>
<script>
import client from '../../common/utils/client';
import { pageTitleBar, paging, itemControl, mMultiSelect, mAlert, mSelect } from '../../components';
import search from './search';
import control from '../common/control';
import brandcontrol from './control';
import loading from '../common/loading';
import wordControl from './wordControl';
let vueThis = null;
export default {
    components: { pageTitleBar, paging, itemControl, mAlert, mMultiSelect, mSelect, search, control, loading, wordControl,brandcontrol },
     data() {
        return {
            name: '品牌',
            isLoading: false,
            countDesc: '',  //数据统计
            dataList: [],
            page: {},   // 分页请求数据
            showAlert: false,
            showAddDialog: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            clickItems: [],   //点击操作的数据项
            controlType: '',  //当前操作的权限类型
            showControl: false, //显示操作弹窗
            destroyControlDialog: false, //注销品牌操作弹框
            wordEditId: ''
        }
    },
    computed: {
        selectItems() {
            let list = [];
            this.dataList.forEach(item => {
                item.checked && list.push(item);
            })
            return list;
        }
    },
    filters: {
        filterStatus(id) {
            return client.global.componentStatus.find(item => item.pbdBrandId == pbdBrandId).name;
        },
        filterTime(time) {
            return client.formateTime(time);
        }
    },
    methods: {
        //添加品牌
        addBanner() {
            this.wordEditId = '';
            this.showAddDialog = true;
        },
        hideAddDialog(control) {
            this.wordEditId = '';
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
        // 跳转添加页面
        /*addItem() {
            this.$router.go({ name: 'goodProductStore', params: { type: 16, id: 0 } })
        },*/
        // 搜索条件变化
        changeSearchOptions(options) {
            this.searchOptions = options;
        },
        showControlFunc(item, type) {
            this.controlType = type;
            if (!item) {
                if (this.selectItems.length != 0) {
                    this.clickItems = this.selectItems;
                    this.showControl = true;
                }
            } else {
                this.clickItems = typeof item == 'array' ? item : [item];
                if (type == 'edit') {
                    this.wordEditId = item.pbdBrandId;
                    this.showAddDialog = true;
                    //this.$router.go({ name: 'contentPublish', params: { type: 16, id: this.clickItems[0].pbdBrandId, controlType: '1/h1Text' } })
                } else {
                    this.showControl = true;
                }
            }
        },
        hideControlFunc(type) {
            if (type == 'success') {
                this.getList();
            }
            this.showControl = false;
        },
        getList(page, firstSearch) {
            let options;
            if (!firstSearch) {
                // 拿最后一次请求的参数
                options = this.lastSearchOptions;
            } else {
                options = Object.assign({}, this.searchOptions);
            }
            if (page) {
                options.page = page;
            }
            this.isLoading = true;
            this.dataList = [];
            this.lastSearchOptions = options;
            // 统计数据
            //this.getCount(options);
            options.componentType = [16];
            client.postData( PBD_GET_LIST , options).then(data => {
                this.isLoading = false;
                if (data.code == 200) {
                    data.data.forEach(item => {
                        item.checked = false;
                    })
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
            options.componentType = [16];
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
            item.checked = !item.checked;
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
            this.showAddDialog = false
        }
    },
    created() {
        vueThis = this;
        this.limitResource = JSON.parse(localStorage.getItem('limitResource'));
        console.log(JSON.parse(localStorage.getItem('limitResource')))
    },
    watch: {
    },
    route: {
        canReuse: () => {
            vueThis.getList(false, true);
        }
    },
    ready() {
        client.resetListHeight();
    }
};
</script>

<style lang="less" scope>
@import "../../common/css/list.less";
</style>