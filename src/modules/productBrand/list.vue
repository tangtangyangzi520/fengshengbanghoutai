<template>
      <div>
        <div class="page-bar min-bar">
            <page-title-bar>
                <span slot="title">{{name}}列表{{countDesc}}</span>
            </page-title-bar>
            <button class="btn" type="button"  @click="addBanner()" style="margin-left:6px;float:left;margin-top:10px;background-color: #66CC33;color:white"
            v-if="limitResource.brand_add" >添加</button> <!-- v-if="limitResource.brand_add" -->
            <span style="float:right;display:inline-block;margin-bottom:10px;margin-right:0.4%">
                 <span  style="display:inline-block;"> 
                       <search :onchange="changeSearchOptions" :oncreate="getList" :parent="par" :cflag="flag"></search>
                 </span>
                <button class="btn green-meadow" @click="getList(false,true)" type="button" style="background-color:#66CC33">搜索</button>
            </span> 
            <div style="height:5px;clear:both;"></div>
        </div>
        <div class="contentBlock" id="contentList">
            <div class="table-responsive col-md-12">
                <table class="table table-striped table-bordered table-hover" id="sku-content-table">
                    <thead>
                        <tr>
                            <th style="width:20%;">品牌Logo</th>
                            <th style="width:10%;">品牌名称</th>
                            <th style="width:10%;">英文名称</th>
                            <th style="width:10%;">品牌网址</th>
                            <th style="width:10%;">品牌描述</th>
                            <th style="width:10%;">国家</th>
                            <th style="width:10%;">状态</th>
                            <th style="width:10%;">品牌排序</th>
                            <th style="">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in dataList" @click="selectItem(item)">
                            <td  style="width:200px;text-align:center;vertical-align:middle;">
                                <p >
                                    <a  target="_blank" :href="item.pbdLogoUrl" title="查看大图">

                                        <img :src="item.pbdLogoUrl" style="height:50px;width:50px" v-if="item.pbdLogoUrl != null">
                                    </a>
                                </p>
                            </td>
                            <td>{{item.pbdName}}</td>
                            <td>{{item.pbdEnglishName}}</td>
                            <td>{{item.pbdWebsite}}</td>
                            <td>{{item.pbdIntroduce}}</td>
                            <td>{{item.pbdCountry}}</td>
                            <td>
                                <span v-if="item.pbdDisplay == 1">启用</span>
                                <span v-if="item.pbdDisplay == 0">停用</span>
                            </td>
                            <td>{{item.pbdSort}}</td>
                            <td style="text-align:center;vertical-align:middle;">
                                <button type="button"  class="btn btn-xs blue" @click.stop="showControlFunc(item,'edit')" v-if="limitResource.brand_edit">编辑</button><!-- v-if="limitResource.brand_edit" -->
                                <button type="button"  @click.stop="showControlFunc(item,'unuse')" class="btn btn-xs red"
                                v-if="limitResource.brand_delete && item.pbdDisplay == 1">停用</button><!--   -->
                                <button type="button"  @click.stop="showControlFunc(item,'use')" class="btn btn-xs green"
                                v-if="limitResource.brand_delete && item.pbdDisplay == 0">启用</button><!--   -->
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
            this.wordEditId = '0';
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
        //console.log(JSON.parse(localStorage.getItem('limitResource')))
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