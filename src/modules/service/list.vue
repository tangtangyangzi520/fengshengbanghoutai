<template>
  <div>
    <div class="page-bar min-bar">
      <page-title-bar v-show="showflag">
        <span slot="title">售后订单</span>
      </page-title-bar>
      <search :onchange="changeSearchOptions" :oncreate="getList"></search>
      <div class="col-md-2 fr" style="margin-top:-40px;">
        <button class="btn blue" type="button" @click="getListByState">筛选</button>&nbsp;&nbsp;&nbsp;&nbsp;
        <!--   <button class="btn blue" type="button" @click="exportOrder" v-if="limitResource.Order_export">批量导出</button> -->
      </div>
      <form id="exportForm" method="POST">
        <input type="hidden" v-model="exportString" name="request">
      </form>
      <div class="col-md-12 contentOrderleft">
        <button class="btn default" :class="{'blue':changeNum==0}" type="button" @click="getListByState(0)">全部</button>
        <button class="btn default" :class="{'blue':changeNum==1}" type="button" @click="getListByState(1)">退款中</button>
        <button class="btn default" :class="{'blue':changeNum==2}" type="button" @click="getListByState(2)">退款成功</button>
        <button class="btn default" :class="{'blue':changeNum==3}" type="button" @click="getListByState(3)">退款关闭</button>
      </div>
    </div>
    <div class="contentOrderBlock" id="contentList">
      <div class="table-responsive col-md-12">
        <table class="table table-striped table-bordered table-hover" id="sku-content-table">
          <thead>
            <tr style="height:50px;">
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
              <td>{{item.orrId}}</td>
              <td class="tdTitle">
                <p>
                  <a target="_blank" href="hello" title="查看大图">
                    <img :src="item.spu.spuPic" class="img-rounded" style="height:80px">
                  </a>
                </p>
                <h4>订单编号&nbsp;{{item.orrOrstNo }}</h4>
                <p>{{item.spu.spuName}}</p>
                <h4>{{item.sku.skuName}}</h4>
              </td>
              <td>{{item.orsTotalPay }}</td>
              <td>{{item.orrActAmount }}</td>
              <td>{{item.orrCreatedTime |filterTime}}</td>
              <td>{{item.orrRefundResult}}</td>
              <td>
                <button type="button" class="btn btn-xs blue" @click="checkMore(item)">处理退款</button>
              </td>
            </tr>
            <tr v-if="dataList.length==0">
              <td colspan="9" class="center">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <pannel :show="showAddDialog" :id="detailId" :onhide="hideAddDialog"></pannel>
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
      dataList: [],
      page: {}, // 分页请求数据
      showAlert: false,
      showAlertTitle: "温馨提示",
      showAlertMsg: "",
      limitResource: null, //发布状态
      showAddDialog: false,
      lastSearchOptions: {},
      changeNum: 0,
      detailId: 0,
    };
  },
  filters: {
    filterTime(time) {
      return client.formateTime(time);
    }
  },
  methods: {
    checkMore(item) {
      console.log(item)
      this.detailId = item.orrId;
      this.showAddDialog = true;
    },
    hideAddDialog() {
      this.showAddDialog = false;
    },
    getListByState(status) {
      if (typeof status == "number") {
        this.changeNum = status;
      }
      this.getList(null, true);
    },
    //导出订单
    /*     exportOrder() {
            this.searchOptions.ordSpuId = this.ospuid;
            $("#exportForm").attr("action", ORDER_EXPORT);
            $("input[name='request']").val(JSON.stringify(this.searchOptions));
            $("#exportForm").submit();
          }, */
    // 搜索条件变化
    changeSearchOptions(options) {
      this.searchOptions = options;
    },
    getList(page, firstSearch) {
      let options = "";
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
      if (this.changeNum == 1) {
        options.orrRefundStatus = [0, 1, 2, 3, 7];
      }
      if (this.changeNum == 2) {
        options.orrRefundStatus = [5];
      }
      if (this.changeNum == 3) {
        options.orrRefundStatus = [4, 6, 8];
      }
      this.dataList = [];
      client.postData(ORDER_GET_REFOUND, options).then(
        data => {
          this.isLoading = false;
          if (data.code == 200) {
            this.dataList = [];
            data.data.find(item => {
              // if (this.changeNum == 0) {
              //   this.dataList.push(item);
              // }
              // if (
              //   (this.changeNum == 1 && item.orrRefundStatus == 2) ||
              //   item.orrRefundStatus == 2 ||
              //   item.orrRefundStatus == 3 ||
              //   item.orrRefundStatus == 7
              // ) {
              //   this.dataList.push(item);
              // }
              // if (this.changeNum == 2 && item.orrRefundStatus == 5) {
              //   this.dataList.push(item);
              // }
              // if (this.changeNum == 3 && item.orrRefundStatus == 6) {
              //   this.dataList.push(item);
              // }
              this.dataList.push(item);
            });
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
    }
  },
  filters: {
    filterTime(time) {
      return client.formateTime(time);
    }
  },
  created() {
    console.log("sss", this.searchOptions);
    /*       vueThis = this;
            this.limitResource = JSON.parse(localStorage.getItem("limitResource")); */
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
  line-height: 100%;
}
.table > tbody > tr > td,
.table > tbody > tr > th,
.table > tfoot > tr > td,
.table > tfoot > tr > th,
.table > thead > tr > td,
.table > thead > tr > th {
  vertical-align: middle;
}
</style>
