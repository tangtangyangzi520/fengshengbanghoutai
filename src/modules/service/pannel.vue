<template>
<!-- // public static final int REFUND_STATUS_NOT = 0;// 申请退款
// public static final int REFUND_STATUS_WAIT_SELLER_AGREE = 1;// 等待商家审核
// public static final int REFUND_STATUS_WAIT_BUYER_RETURN_GOODS = 2;// 退款中
// public static final int REFUND_STATUS_WAIT_SELLER_CONFIRM_GOODS = 3;// 退款中
// public static final int REFUND_STATUS_SELLER_REFUSE_BUYER = 4;// 申请被拒绝
// public static final int REFUND_STATUS_SUCCESS = 5;// 退款成功
// public static final int REFUND_STATUS_CLOSED = 6;// 退款关闭
// public static final int REFUND_STATUS_REFUNDING = 7;// 退款中
// public static final int REFUND_STATUS_FAIL = 8;// 退款失败 -->
  <!-- 商品列表-编辑SKU信息 -->
  <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
    <m-alert :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1100px'" :backdrop="true">
      <div slot="content">
        <div class="row" style="background-color:#F0F0F0;">
          <div class="content-top ">
            <div class="all">
              <div class="part-word">买家申请售后</div>
              <div class="part-word" v-if="dataDetail.orrRefundStatus===1||dataDetail.orrRefundStatus==5||dataDetail.orrRefundStatus==4||dataDetail.orrRefundStatus==6||dataDetail.orrRefundStatus==8||dataDetail.orrRefundStatus==7">商家处理售后申请</div>
              <div class="part-word grey-word" v-else>商家处理售后申请</div>
              <div class="part-word" v-if="dataDetail.orrRefundStatus==5||dataDetail.orrRefundStatus==4||dataDetail.orrRefundStatus==6||dataDetail.orrRefundStatus==8">退款完成</div>
              <div class="part-word grey-word" v-else>退款完成</div>
            </div>
            <div class="all">
              <div class="part-cir">1</div>
              <template v-if="dataDetail.orrRefundStatus===1||dataDetail.orrRefundStatus==5||dataDetail.orrRefundStatus==4||dataDetail.orrRefundStatus==6||dataDetail.orrRefundStatus==8||dataDetail.orrRefundStatus==7">
                <div class="progress"></div>
                <div class="part-cir">2</div>
              </template>
              <template v-else>
                <div class="progress grey-progress"></div>
                <div class="part-cir grey-cir">2</div>
              </template>
              <template v-if="dataDetail.orrRefundStatus==5||dataDetail.orrRefundStatus==4||dataDetail.orrRefundStatus==6||dataDetail.orrRefundStatus==8">
                <div class="progress"></div>
                <div class="part-cir">3</div>
              </template>
              <template v-else>
                <div class="progress grey-progress"></div>
                <div class="part-cir grey-cir">3</div>
              </template>
              
            </div>
          </div>
        </div>
        <div class="row" style="background-color:#F0F0F0;">
          <div class="content-top all">
            <div class="middle ">
              <h4>售后信息</h4>
              <div class="soldInfo">
                <div>
                  <img class="left-img fl" style="margin-right:10px;" :src="dataDetail.spu.spuPic"/>
                  <div style="margin-left:10px;">
                    <div>{{dataDetail.spu.spuName}}</div>
                    <div style="text-align:left;color:#999;">{{dataDetail.sku.skuName}}</div>
                  </div>
                </div>
                <div style="margin-top:20px;">退款说明：{{dataDetail.orrClientRemark }}</div>
                <div>退款金额：{{dataDetail.orrActAmount}} 元</div>
                <div>退款编号：{{dataDetail.orrId}}</div>
              </div>
              <div class="soldInfo middle-bor">
                <p>订单编号：{{dataDetail.orrOrstNo}}</p>
                <p>订单类型：{{dataDetail.set.orsType===0?'普通订单':'海外购'}}</p>
                <p>付款方式：{{dataDetail.set.orsPayChannelDisplay}}</p>
                <p>买家昵称：{{dataDetail.set.orsMemberNickname}}</p>
                <p>配送方式：{{dataDetail.set.orderSubList[0].ordLogiTypeDisplay}}</p>
                <p>收货信息：{{dataDetail.set.orderSubList[0].ordReceiveProvince}} 
                  {{dataDetail.set.orderSubList[0].ordReceiveCitity}} 
                  {{dataDetail.set.orderSubList[0].ordReceiveArea}} 
                  {{dataDetail.set.orderSubList[0].ordReceiveDetail}} , {{dataDetail.set.orderSubList[0].ordReceiveName}}, {{dataDetail.set.orderSubList[0].ordReceiveMobile}}</p>
                <p>买家留言：{{dataDetail.set.buyerMessage}} </p>
              </div>
            </div>
            <div class="middle">
              <h4 sty>售后状态：{{dataDetail.orrRefundResult}}</h4>
              <div class="soldInfo ">
                <p>退款金额：{{dataDetail.orrActAmount}} 元 </p>
                <p>退款方式：退至{{dataDetail.set.orsPayChannelDisplay}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-if="dataDetail.orrRefundStatus==1||dataDetail.orrRefundStatus===0">
          <h4>审核意见：</h4>
          <textarea class="form-control" v-model="orrServiceRemark" placeholder="请输入审核意见"></textarea>
        </div>
        <div class="row" v-show="false" style="background-color:#F0F0F0;">
          <div class="content-top ">
            <h4>协商记录</h4>
            <div class="middle">
              <h4 style="margin-top:30px;">商家<text class="time">2018-02-02 16:52:09</text></h4>
              <p>同意退款给买家 </p>
              <p>退款金额：880.00</p>
              <h4 style="margin-top:30px;">买家<text class="time">2018-02-02 16:52:09</text></h4>
              <p>发起了退款申请，等待商家处理</p>
              <p>退款说明：与描述差异大</p>
              <p>退款金额：880.00</p>
              <p>联系电话：13897202812</p>
            </div>
          </div>
        </div>
      </div>
      <span slot="btnList" v-if="dataDetail.orrRefundStatus==1||dataDetail.orrRefundStatus===0">
      <!-- <span slot="btnList"> -->
          <button type="button" class="btn blue" @click="submitInfo(1)">同意卖家退款</button>
          <button type="button" class="btn default" @click="submitInfo(2)">拒绝退款申请</button>
      </span>
      <!-- <loading :show="isLoading"></loading> -->
      
    </m-alert>
    <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
        <div slot="content">{{showAlertMsg}}</div>
    </m-alert>
    <div class="loading" v-if="isLoading">
        <div class="page-spinner-bar">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
    </div>
  </div>
</template>

<script>
import client from "../../common/utils/client";
import tagTree from "../common/tagTree";
import {
  getComponentList,
  getComponentChannelList
} from "../../vuex/actions/actions.component";
import { getPainTree } from "../../vuex/actions/actions.pain";
import { mMultiSelect, mAlert, mSelect, itemList } from "../../components";
import loading from "../common/loading";

export default {
  props: {
    show: {
      type: Boolean,
      value: false
    },
    onhide: {
      type: Function,
      value: () => {}
    },
    onchange: {
      type: Function,
      default: () => {}
    },
    id: {
      type: String
    },
    oncreate: {
      type: Function,
      default: () => {}
    }
  },
  components: {
    mMultiSelect,
    mSelect,
    mAlert,
    tagTree,
    itemList,
    loading
  },
  vuex: {
    getters: {
      componentChannelList: ({ component }) => component.componentChannelList,
      painTree: ({ pain }) => pain.painTree
    },
    actions: {
      getComponentChannelList,
      getPainTree
    }
  },
  data() {
    return {
      dataDetail: null,
      showDialog: false,
      showPage: false,
      title: "",
      isLoading: false,
      orrServiceRemark: "",
      showAlert: false,
      showAlertTitle: "温馨提示",
      showAlertMsg: ""
    };
  },
  vuex: {},
  methods: {
    hideDialog() {
      this.showDialog = false;
      setTimeout(() => {
        this.showPage = false;
        this.onhide("cancel");
      }, 300);
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
    },
    submitInfo(status) {
      if (this.isLoading) return;
      this.isLoading = true;
      client
        .postData(ORDER_AUDIT_REFUND, {
          orrId: this.id,
          orrServiceRemark: this.orrServiceRemark,
          status: status
        })
        .then(
          data => {
            this.isLoading = false;
            this.getInfo();
            if (data.code == 200) {
              this.showMsg(data.msg);
            } else {
              this.showMsg(data.msg);
            }
          },
          data => {
            this.isLoading = false;
            this.showMsg("获取信息错误!" + data.message);
          }
        );
    },
    addItem() {
      this.showDialog = false;
      setTimeout(() => {
        this.showPage = false;
        this.onhide("cancel");
      }, 300);
    },
    getInfo(){
      this.isLoading = true;
      client.postData(ORDER_GET_REFOUND_DETAIL, { orrId: this.id }).then(
        data => {
          this.isLoading = false;
          if (data.code == 200) {
            this.dataDetail = data.data;
          } else {
            this.showMsg("获取信息错误!" + data.message);
          }
        },
        data => {
          this.isLoading = false;
          this.showMsg("获取信息错误!" + data.message);
        }
      );
    }
  },
  ready() {},
  watch: {
    show() {
      this.showPage = this.show;
      this.showDialog = this.show;
    },
    id() {
      this.orrServiceRemark = '';
      if (this.id == 0) return;
      this.getInfo();
    }
  },
  created() {},
  beforeDestroy() {}
};
</script>

<style lang="less" scoped>
.input {
  margin-left: 2%;
  margin-top: 1%;
}
.tab {
  text-align: center;
  border-collapse: collapse;
}
table,
table tr th,
table tr td {
  text-align: center;
  border: 1px solid #a5a552;
}
.last-word {
  margin-top: 8px;
}
.all {
  display: -webkit-box;
}
.btn {
  text-align: right;
}
.content-top {
  width: 100%;
  padding: 20px;
}
/* .sprice{
                        margin-top:
                    } */
.part-word {
  color: rgb(119, 161, 240);
  font-size: 18px;
}
.grey-word {
  color: rgb(199, 197, 197);
}
.part-word:nth-child(1) {
  margin-left: 120px;
}
.part-word:not(:first-child) {
  margin-left: 220px;
}
.part-cir {
  width: 30px;
  height: 30px;
  border-radius: 100% !important;
  background: rgb(119, 161, 240);
  color: #ffffff;
  line-height: 30px;
  margin-top: 10px;
  text-align: center;
}
.grey-cir {
  background: rgb(199, 197, 197);
}
.part-cir:nth-child(1) {
  margin-left: 160px;
}
.progress {
  width: 270px;
  margin: 20px 20px 0 20px;
  border-radius: 10px !important;
  height: 10px;
  background: rgb(119, 161, 240);
}
.grey-progress {
  background: rgb(199, 197, 197);
}
.row:not(:first-child) {
  margin-top: 10px;
}
.middle {
  width: 50%;
}
.middle:nth-child(1) {
  border-right: 1px solid rgb(223, 220, 220);
}
.middle:nth-child(2) {
  padding: 0 20px;
}
.soldInfo {
  margin-left: 20px;
}
.middle-bor {
  margin: 10px 10px 0 20px;
  padding-top: 10px;
  border-top: 1px solid rgb(223, 220, 220);
}
.left-img {
  width: 50px;
  height: 50px;
}
.soldInfo p {
  margin-top: 10px;
}
.time {
  margin-left: 20px;
  font-size: 14px;
}
</style>

