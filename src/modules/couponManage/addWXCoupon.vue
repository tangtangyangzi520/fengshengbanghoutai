<template>
<!-- 微信卡券-新建/编辑页面 -->
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <div class="modal alertModal fade" :class="{in:showDialog}" style="height:2000px;display:block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header" style="text-align:left;">
                        <button type="button" @click="hideDialog" class="close"></button>
                        <h4 class="modal-title">{{title}}</h4>
                    </div>
                    <div class="modal-body" style="max-height:630px;overflow-x:hidden;overflow-y:auto;">
                         <div class="row">
                             <form class="form-horizontal">
                                <div class="form-group">
                                    <label for="title" class="col-sm-4 control-label">
                                        <span class="required">* </span>绑定小程序appId：
                                    </label>
                                    <div class="controls col-md-6" style="margin-top:0.5%">
                                        <input type="text" class="form-control input-sm" v-model="data.appId" placeholder="" required="required" :maxLength="30" />
                                        <input id="sub" type="submit" style="display:none"/>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="title" class="col-sm-4 control-label">
                                        <span class="required">* </span>卡券跳转小程序路径：
                                    </label>
                                    <div class="controls col-md-6" style="margin-top:0.5%">
                                        <input type="text" class="form-control input-sm" v-model="data.jumpPath" placeholder="" required="required" :maxLength="200" />
                                        <input id="sub" type="submit" style="display:none"/>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="title" class="col-sm-4 control-label">
                                        <span class="required">* </span>优惠券对应cardId:
                                    </label>
                                    <div class="controls col-md-6" style="margin-top:0.5%">
                                        <input type="text" class="form-control input-sm" v-model="data.cardId" placeholder="" required="required" :maxLength="30" />
                                        <input id="sub" type="submit" style="display:none"/>
                                    </div>
                                </div>
                             </form>
                         </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn blue" @click="submitInfo">确定</button>
                        <button type="button" class="btn default" @click="cancleFunc">取消</button>
                    </div>
                </div>
            </div>
        </div>
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
        <!-- 微信卡券-选择商品弹框 -->
        <select-spu v-if="!destroyControlDialog" :show="showSpuDialog" :onhide="hideselDialog" @spu-data="getSelected" :spulist="spuList"></select-spu>
        <div class="loading" style="position:fixed;z-index:11111;" v-if="isLoading">
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
import {
  mAlert,
  mSelect,
  mMultiSelect,
  selectComponentAll
} from "../../components";

export default {
  components: {
    mAlert,
    mSelect,
    mMultiSelect,
    selectComponentAll
  },
  props: {
    show: {
      type: Boolean,
      value: false
    },
    onhide: {
      type: Function,
      value: () => {}
    },
    id: {
      type: String,
      value: 0
    }
  },
  data() {
    return {
      title: "微信卡券",
      showDialog: false,
      showPage: false,
      showAlert: false,
      showAlertTitle: "温馨提示",
      showAlertMsg: "",
      data: {
        cardId: "",
        appId: "",
        jumpPath: ""
      }
    };
  },
  filters: {
    filterTime(time) {
      return client.formateTime(time);
    }
  },
  methods: {
    hideAddDialog(control) {
      this.expertEditId = "";
      this.showAddDialog = false;
      if (control && control == "create") {
        this.showMsg("保存成功");
      }
      if (control && control == "update") {
        this.showMsg("更新成功");
      }
      if (control) {
        setTimeout(() => {
          //移除组件
          this.destroyControlDialog = true;
        }, 100);
        setTimeout(() => {
          //重新加入
          this.destroyControlDialog = false;
        }, 200);
        //this.getList();
      }
    },
    hideDialog() {
      this.showDialog = false;
      setTimeout(() => {
        this.showPage = false;
        this.onhide("cancel");
      }, 300);
    },
    cancleFunc() {
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
    clearInfo() {
      this.data = {
        componentType: 16,
        painIds: [],
        subtitle: "",
        title: ""
      };
      this.painIdsSelect = [];
      this.getPainList();
    },
    // 提交信息
    submitInfo() {
      let data = this.data;
      if (data.appId.replace(/\s/g, "") == "") {
        this.showMsg("请输入appId");
        return;
      }
      if (data.jumpPath.replace(/\s/g, "") == "") {
        this.showMsg("请输入跳转链接");
        return;
      }
      if (data.cardId.replace(/\s/g, "") == "") {
        this.showMsg("请输入cardId");
        return;
      }
      data.mkcCampaignId = this.id;
      this.isLoading = true;
      client.postData(MKT_CREATE_WX_COUPON, data).then(
        response => {
          this.isLoading = false;
          if (response.code != 200) {
            this.showMsg(response.msg);
          } else {
            this.showDialog = false;
            this.showMsg("操作成功!");
          }
        },
        response => {
          this.isLoading = false;
          this.showMsg("网络连接错误");
        }
      );
    }
  },
  created() {},
  watch: {
    show() {
      this.showPage = this.show;
      if (this.show) {
        setTimeout(() => {
          this.showDialog = this.show;
        }, 200);
      } else {
        this.showDialog = this.show;
      }
    },
    id() {
      this.data = {
        cardId: "",
        appId: "",
        jumpPath: ""
      };
      if (this.id == "") {
        this.title = "编辑卡券";
        return;
      }
      this.title = "绑定卡券";
      this.isLoading = true;
      this.painList = [];
      //
      client.postData(MKT_GET_ID + "?mkcCampaignId=" + this.id, {}).then(
        response => {
          this.isLoading = false;
          if (response.code == 200) {
            let data = response.data;
            this.data = {
              appId: data.appId ? data.appId : "",
              jumpPath: data.jumpPath ? data.jumpPath : "",
              cardId: data.cardId ? data.cardId : ""
            };
          } else {
            this.showMsg(response.msg);
          }
        },
        data => {
          this.isLoading = false;
          this.showMsg(response.message);
        }
      );
    }
  },
  ready() {},
  beforeDestroy() {
    this.showPainListSelect = false;
  }
};
</script>

<style lang="less" scoped>

</style>