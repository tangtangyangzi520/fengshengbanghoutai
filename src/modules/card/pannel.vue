<template>
    <!-- 商品列表-编辑SKU信息 -->
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1000px'" :backdrop="true">
            <div slot="content">
                <div class="row" style="background-color:#F0F0F0;">
                    <form class="form-horizontal" name="addForm" role="form">
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">礼品卡密码：</label>
                            <div class="controls col-md-4" style="margin-top:8px;">
                                <input type="radio" name="leixing" value="1" checked>自动生成&nbsp;&nbsp;&nbsp;&nbsp;
                                <input type="radio" name="leixing" value="2">手动输入
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">礼品卡密码：</label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="request.spuAd" placeholder="" maxLength="50">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">总面值：</label>
                            <div class="controls col-md-6 all">
                                <input type="text" class="form-control input-sm" v-model="allprice" placeholder="" maxLength="50">
                                <div class="last-word">&nbsp;&nbsp;元&nbsp;&nbsp;</div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">兑换子卡张数：</label>
                            <div class="controls col-md-6 all">
                                <input type="text" class="form-control input-sm" placeholder="" maxLength="50">
                                <div class="last-word">&nbsp;&nbsp;张&nbsp;&nbsp;</div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">面值：</label>
                            <div class="controls col-md-6 all ">
                                <div style="width:28%;"><input type="text" class="form-control input-sm"  style="width:100%;" v-model="firstprice" placeholder=""></div>
                                <div style="width:8%;" class="last-word">&nbsp;&nbsp;元&nbsp;&nbsp;</div>
                                <div style="width:28%;"><input type="text" class="form-control input-sm"  style="width:100%;" v-model="secondprice" placeholder=""></div>
                                <div style="width:8%;" class="last-word">&nbsp;&nbsp;元&nbsp;&nbsp;</div>
                                <div style="width:28%;"><input type="text" class="form-control input-sm"  style="width:100%;" v-model="thirdprice" placeholder=""></div>
                                <div class="last-word">&nbsp;&nbsp;元&nbsp;&nbsp;</div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">有效期：</label>
                            <div class="controls col-md-6 all">
                                <div style="width:40%;"><input type="text"   class="form-control input-sm datePicker" style="width:100%;" placeholder=""  id="chooseStartTime"></div>
                                <div style="width:20%;text-align:center;" class="last-word">&nbsp;&nbsp;至&nbsp;&nbsp;</div>
                                <div style="width:40%;"><input type="text"   class="form-control input-sm datePicker" style="width:100%;" placeholder="" id="chooseEndTime"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">归属人：</label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="request.spuAd" placeholder="" maxLength="50">
                            </div>
                        </div>
                    </form>
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
import { getPainTree } from "../../vuex/actions/actions.pain";
import { mMultiSelect, mAlert, mSelect, itemList } from "../../components";
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
      showDialog: false,
      showPage: false,
      title: "新建礼品卡",
      allprice: "",
      firstprice: "",
      secondprice: "",
      thirdprice: "",
      searchOptions: {
        chooseStartTime: "",
        chooseEndTime: ""
      }
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
    setOptions() {
      let options = this.searchOptions;
      let chooseStartTime = $("#chooseStartTime").val(),
        chooseEndTime = $("#chooseEndTime").val();
      if (chooseStartTime != "") {
        options.chooseStartTime = chooseStartTime + " 00:00:00";
      }
      if (chooseEndTime != "") {
        options.chooseEndTime = chooseEndTime + " 23:59:59";
      }
      this.onchange(options);
    }
  },
   ready(){
    this.setOptions();
    this.onchange(this.searchOptions);
    $("#chooseStartTime")
      .val("")
      .datetimepicker({
        format: "yyyy-mm-dd",
        language: "zh-CN",
        autoclose: "true",
        minView: 2
      });
    $("#chooseEndTime")
      .val("")
      .datetimepicker({
        format: "yyyy-mm-dd",
        language: "zh-CN",
        autoclose: "true",
        minView: 2
      });
    $(".datePicker").on("change", () => {
      this.setOptions();
    });
  },
  watch: {
    show() {
      this.showPage = this.show;
      this.showDialog = this.show;
    },
    allprice(val) {
      if (!/^[0-9]+.?[0-9]*$/.test(val) || !parseInt(val) > 0) {
        this.allprice = "";
      }
    },
    firstprice(val) {
      if (!/^[0-9]+.?[0-9]*$/.test(val) || !parseInt(val) > 0) {
        this.firstprice = "";
      }
    },
    secondprice(val) {
      if (!/^[0-9]+.?[0-9]*$/.test(val) || !parseInt(val) > 0) {
        this.secondprice = "";
      }
    },
    thirdprice(val) {
      if (!/^[0-9]+.?[0-9]*$/.test(val) || !parseInt(val) > 0) {
        this.thirdprice = "";
      }
    }
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
/* .sprice{
    margin-top:
} */
</style>