<template>
    <div>
        <div class="page-bar min-bar">
            <page-title-bar>
                <span slot="title">礼品卡列表</span>
            </page-title-bar>
            <search :onchange="changeSearchOptions" :oncreate="getList" v-ref:search></search>
            <div class="col-md-6 right fr" style="float:right;margin-top:-40px;">
                <button class="btn green" @click="addMore()" type="button">新建礼品卡</button>
                <button class="btn green-meadow" @click="getList()" type="button">导出列表</button>
            </div>
            <div style="height:5px;clear:both;"></div>
        </div>
        <div class="contentBlock" id="contentList">
            <div class="table-responsive col-md-12">
                <table class="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th style="width:4%">
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll">全选</button>
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList">反选</button>
                            </th>
                            <th style="width:20%;">礼品卡密码 </th>
                            <th style="width:7%;">总面值</th>
                            <th style="width:7%;">兑换子卡张数</th>
                            <th style="width:10%;">子卡面值</th>
                            <th style="width:7%;">有效期</th>
                            <th style="width:7%;">归属人</th>
                            <th style="width:7%;">礼品卡状态</th>
                            <th style="width:7%;">已消费金额</th>
                            <th style="width:10%;">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in dataList" @click="selectItem(item)">
                            <td style="text-align:center;vertical-align:middle;">
                                <input type="checkbox" :checked="item.checked"></input>
                            </td>
                            <td class="tdTitle">
                                <h4>455899632255222222222</h4>
                            </td>
                            <td>1000</td>
                            <td>3</td>
                            <td>4000，4000，4000</td>
                            <td>2017-08-25 至 2020-08-25 </td>
                            <td>程晨</td>
                            <td>已兑换</td>
                            <td>4000</td>
                            <td><button type="button" class="btn btn-xs blue" @click="checkMore()">查看</button>
                                <button type="button" class="btn btn-xs red" @click.stop="showControlFunc(item,'edit')">删除</button>
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
        <pannel :show="showAddDialog" :onhide="hideAddDialog"></pannel>
        <loading :show="isLoading"></loading>
    </div>
</template>
<script>
    import client from "../../common/utils/client";
    import {
        pageTitleBar,
        paging,
        itemControl,
        mMultiSelect,
        mAlert,
        mSelect
    } from "../../components";
    import search from "./search";
    import pannel from "./pannel";
    import loading from "../common/loading";
    import selectSpu from "../common/selectSpu";
    export default {
        components: {
            pageTitleBar,
            paging,
            itemControl,
            mAlert,
            mMultiSelect,
            mSelect,
            search,
            loading,
            selectSpu,
            pannel
        },
        props: {},
        data() {
            return {
                dataList: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                page: {
                    currentPage: 1,
                    pageSize: 20,
                    startIndex: 2,
                    totalPage: 20,
                    totalSize: 10
                },
                showAddDialog: false,
                searchOptions:""
            };
        },
        computed: {},
        filters: {},
        methods: {
            addMore() {
                this.showAddDialog = true;
            },
            hideAddDialog() {
                this.showAddDialog = false;
            },
            getList() {
            //    options = Object.assign({}, this.searchOptions);
            },
            selectItem(item) {
                item.checked = !item.checked;
            },
            // 全选
            selectAll() {
                this.dataList.forEach(item => {
                    item.checked = true;
                });
            },
            // 反选
            reverseList() {
                this.dataList.forEach(item => {
                    item.checked = !item.checked;
                });
            },
            changeSearchOptions(options) {
                this.searchOptions = options;
            },
        },
        created() {},
        watch: {},
        route: {},
        ready() {}
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