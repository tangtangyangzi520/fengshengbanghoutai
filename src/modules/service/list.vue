<template>
  <div>
    <div class="page-bar min-bar">
      <page-title-bar v-show="showflag">
        <span slot="title">售后订单</span>
      </page-title-bar>
      <search :onchange="changeSearchOptions" :oncreate="getList" v-ref:search></search>
      <div class="col-md-2 fr" style="margin-top:-40px;">
        <button class="btn blue" type="button" @click="getListByState(searchOptions.ordStatus)">筛选</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <button class="btn blue" type="button" @click="exportOrder" v-if="limitResource.Order_export">批量导出</button>
      </div>
      <form id="exportForm" method="POST">
        <input type="hidden" v-model="exportString" name="request">
      </form>
      <div class="col-md-12 contentOrderleft">
        <button class="btn default" :class="{'blue':checkedList[0]}" type="button" @click="getListByState(-1)">全部</button>
        <button class="btn default" :class="{'blue':checkedList[1]}" type="button" @click="getListByState(0)">退款中</button>
        <button class="btn default" :class="{'blue':checkedList[2]}" type="button" @click="getListByState(1)">退款成功</button>
        <button class="btn default" :class="{'blue':checkedList[3]}" type="button" @click="getListByState(2)">退款关闭</button>
      </div>
    </div>
    <div class="contentOrderBlock" id="contentList">
      <div class="table-responsive col-md-12">
        <table class="table table-striped table-bordered table-hover" id="sku-content-table">
          <thead >
            <tr style="height:50px;">
              <th style="width:4%" v-if="canHandlerList">
                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll">全选</button>
                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList">反选</button>
              </th>
              <th style="width:10%;">退款编号</th>
              <th style="width:32%;">订单编号/商品</th>
              <th style="width:10%;">订单金额</th>
              <th style="width:10%;">退款金额</th>
              <th style="width:10%;">申请时间</th>
              <th style="width:10%;">退款状态</th>
              <th style="">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in dataList">
              <td>5589875699</td>
              <td class="tdTitle">
                <p>
                  <a target="_blank" href="hello" title="查看大图">
                    <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1981593005,1408764669&fm=27&gp=0.jpg" class="img-rounded" style="height:70px">
                  </a>
                </p>
                <h4>订单编号36998545</h4>
                <p>商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题</p>
                <h4>颜色分类：黑色尺码XL</h4>
              </td>
              <td>7920.00</td>
              <td>7920.00</td>
              <td>2017-08-21 14:23:21</td>
              <td>退款中</td>
              <td>
                <button type="button" class="btn btn-xs blue" @click="checkMore()">处理退款</button>
              </td>
            </tr>
            <tr v-if="dataList.length==0">
              <td colspan="9" class="center">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <pannel :show="showAddDialog" :onhide="hideAddDialog"></pannel>
    <paging :current-page="page.currentPage" :page-size="page.pageSize" :start-index="page.startIndex" :total-page="page.totalPage" :total-size="page.totalSize" :change="getList"></paging>
    <m-alert :title="'提交'" :show-cancel-btn="true" :show="showSubmitDialog" :onsure="ajaxControl" :onhide="hideMsg">
      <div slot="content">确定提交吗？</div>
    </m-alert>
    <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
      <div slot="content">{{showAlertMsg}}</div>
    </m-alert>
    <loading :show="isLoading"></loading>
  </div>
</template>
<script>
  import client from "../../common/utils/client";
  import pannel from "./pannel";
  import {
    pageTitleBar,
    paging,
    itemControl,
    mMultiSelect,
    mAlert,
    mSelect
  } from "../../components";
  import search from "./search";
  import control from "../common/control";
  import loading from "../common/loading";
  let vueThis = null;
  export default {
    components: {
      pageTitleBar,
      paging,
      itemControl,
      mAlert,
      mMultiSelect,
      mSelect,
      search,
      control,
      loading,
      pannel
    },
    props: {
      title: "",
      ospuid: 0,
      oflag: false,
      ooflag: false,
      show: {
        type: Boolean,
        value: false
      },
      onhide: {
        type: Function,
        value: () => {}
      }
    },
    data() {
      return {
        showflag: true,
        isLoading: false,
        dataList: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        page: {}, // 分页请求数据
        showAlert: false,
        showAlertTitle: "温馨提示",
        showAlertMsg: "",
        limitResource: null, //发布状态
        checkedList: [true, false, false, false], //用来使被选中标签高亮
        showAddDialog: false,
      };
    },
    filters: {
      filterTime(time) {
        return client.formateTime(time);
      }
    },
    methods: {
      checkMore() {
        this.showAddDialog = true;
      },
      hideAddDialog() {
        this.showAddDialog = false;
      },
      /*  //导出订单
       exportOrder() {
         this.searchOptions.ordSpuId = this.ospuid;
         $("#exportForm").attr("action", ORDER_EXPORT);
         $("input[name='request']").val(JSON.stringify(this.searchOptions));
         $("#exportForm").submit();
       },
       // 搜索条件变化
       changeSearchOptions(options) {
         console.log(options);
         this.searchOptions = options;
       },
       getList(page, firstSearch) {
         let options,
           url = ORDER_GET_LIST;
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
         client.postData(url, options).then(
           data => {
             this.isLoading = false;
             if (data.code == 200) {
               data.data.forEach(item => {
                 item.checked = false;
               });
               this.dataList = data.data;
               this.page = data.page;
             } else {
               this.showMsg(data.msg);
             }
           },
           data => {
             this.isLoading = false;
           }
         );
       },
       showMsg(msg, title) {
         if (title) {
           this.showAlertTitle = title;
         } else {
           this.showAlertTitle = "温馨提示";
         }
         this.showAlertMsg = msg;
         this.showAlert = true;
       },
       hideMsg() {
         this.showAlert = false;
         this.showAddDialog = false;
       } */
    },
    created() {
      vueThis = this;
      this.limitResource = JSON.parse(localStorage.getItem("limitResource"));
    },
    watch: {},
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

<style lang="less">
  @import "../../common/css/common.less";
  @import "../../common/css/list.less";
 .tdTitle {
    text-align: left;
    vertical-align: middle;
    line-height:100%;
}
.table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th {
    vertical-align: middle;
}
</style>