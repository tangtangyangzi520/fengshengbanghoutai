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
            
            <div v-if="dataList.length==0" class="center" style="text-align:center">
                暂无数据
            </div>
        </div>
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
    loading
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
       checkedList: [true, false, false, false] //用来使被选中标签高亮
    };
  },
  filters: {
    filterTime(time) {
      return client.formateTime(time);
    }
  },
  methods: {
    //导出订单
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
    }
  },
  created() {
    vueThis = this;
    this.limitResource = JSON.parse(localStorage.getItem("limitResource"));
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

<style lang="less">
@import "../../common/css/common.less";
@import "../../common/css/list.less";

</style>