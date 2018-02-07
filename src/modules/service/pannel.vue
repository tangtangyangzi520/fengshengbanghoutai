<template>
  <!-- 商品列表-编辑SKU信息 -->
  <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
    <m-alert :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1100px'" :backdrop="true">
      <div slot="content">
        <div class="row" style="background-color:#F0F0F0;">
          <div class="content-top ">
            <div class="all">
              <div class="part-word">买家申请售后</div>
              <div class="part-word">商家处理售后申请</div>
              <div class="part-word grey-word">退款完成</div>
            </div>
            <div class="all">
              <div class="part-cir">1</div>
              <div class="progress"></div>
              <div class="part-cir">2</div>
              <div class="progress grey-progress"></div>
              <div class="part-cir grey-cir">3</div>
            </div>
          </div>
        </div>
        <div class="row" style="background-color:#F0F0F0;">
          <div class="content-top all">
            <div class="middle ">
              <h4>售后信息</h4>
              <div class="soldInfo">
                <div class="all">
                  <image class="left-img" src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1002203061,3808629810&fm=27&gp=0.jpg"></image>
                  <div style="margin-left:10px;">
                    <div>商品标题商品标题商品标题商品标题商品标题标</div>
                    <div style="text-align:left;">规格</div>
                  </div>
                </div>
                <div style="margin-top:20px;">退款说明：与描述不符</div>
                <div>退款金额：880.00 元（含运费0.00元）</div>
                <div>退款编号：与描述不符</div>
              </div>
              <div class="soldInfo middle-bor">
                <p>订单编号：12655897889985</p>
                <p>退款类型：普通订单</p>
                <p>付款方式：支付宝支付</p>
                <p>买家昵称：吉萨</p>
                <p>配送方式：快递</p>
                <p>收货信息：广东省 广州市 海珠区 工业大道缘觉路公园内工业大道缘觉路公园内, 张丽, 15920311373</p>
                <p>买家留言：省电发热管太</p>
              </div>
            </div>
            <div class="middle">
              <h4 sty>售后状态：退款中</h4>
              <div class="soldInfo ">
                <p>退款金额：880.00 元 </p>
                <p>退款方式：退至银行卡</p>
              </div>
            </div>
          </div>
        </div>
        <div class="row" style="background-color:#F0F0F0;">
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
      <span slot="btnList">
                            <button type="button" class="btn blue" @click="addItem()">保存</button>
                            <button type="button" class="btn default" @click="hideDialog()" >取消</button>
                        </span>
    </m-alert>
  </div>
</template>

<script>
  import client from "../../common/utils/client";
  import tagTree from "../common/tagTree";
  import {
    getComponentList,
    getComponentChannelList
  } from "../../vuex/actions/actions.component";
  import {
    getPainTree
  } from "../../vuex/actions/actions.pain";
  import {
    mMultiSelect,
    mAlert,
    mSelect,
    itemList
  } from "../../components";
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
      itemList
    },
    vuex: {
      getters: {
        componentChannelList: ({
          component
        }) => component.componentChannelList,
        painTree: ({
          pain
        }) => pain.painTree
      },
      actions: {
        getComponentChannelList,
        getPainTree
      }
    },
    data() {
      return {
        showDialog: false,
        showPage: false,
        title: "",
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
      submitInfo() {},
      addItem() {
        this.showDialog = false;
        setTimeout(() => {
          this.showPage = false;
          this.onhide("cancel");
        }, 300);
      },
    },
    ready() {
    },
    watch: {
      show() {
        this.showPage = this.show;
        this.showDialog = this.show;
      },
    },
    create() {
      console.log(this.show)
    },
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
    border-radius: 100%!important;
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