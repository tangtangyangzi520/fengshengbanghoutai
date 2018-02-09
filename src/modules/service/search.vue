<template>
  <form class="row search-form" style="margin: 5px 0 0 0">
    <div class="col-md-4">
      <div class="form-group">
        <label class="col-md-3 sea">订单编号：</label>
        <div class="col-md-9">
          <input type="text" class="form-control" v-model="orrId">
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="form-group">
        <label class="col-md-3 sea">退款编号：</label>
        <div class="col-md-9">
          <input type="text" class="form-control" v-model="orrOrstNo">
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="form-group">
        <label class="col-md-3" style=" width:21.8%">下单时间：</label>
        <div class="col-md-9 time-box">
          <div><input type="text" class="form-control inline-block datePicker" placeholder="选择开始时间" id="createStartTimeOrder"></div>
          <div>至</div>
          <div><input type="text" class="form-control inline-block datePicker" placeholder="选择结束时间" id="createEndTimeOrder"></div>
          <a style="position:relative;bottom:-7px;" @click="setTime(7)">近7天</a>
          <a style="position:relative;bottom:-7px;" @click="setTime(30)">近30天</a>
        </div>
      </div>
    </div>
    <div class="col-md-2">
      <div class="form-group">
        <button class="btn blue" type="button" @click="clearOptions()">清空查询条件</button>
      </div>
    </div>
  </form>
</template>
<script>
  import client from "../../common/utils/client";
  import {
    getComponentList
  } from "../../vuex/actions/actions.component";
  import {
    mMultiSelect,
    mAlert,
    mSelect
  } from "../../components";
  export default {
    props: {
      onchange: {
        type: Function,
        default: () => {}
      },
      oncreate: {
        type: Function,
        default: () => {}
      }
    },
    vuex: {
      getters: {},
      actions: {}
    },
    components: {
      mMultiSelect,
      mSelect,
      mAlert
    },
    data() {
      return {
        lastSearchOptions: {},
        searchOptions: {
          page: {
            currentPage: 1,
            pageSize: 10,
            startIndex: 0,
            totalPage: 0,
            totalSize: 0
          }
        },
        orrId: '',
        orrOrstNo: ''
      };
    },
    methods: {
      //校验查询金额
      checkAmount(data) {
        if (data == "") {
          return;
        }
        if (!/^[0-9]{1,8}([.]{1}[0-9]{1,2})?$/.test(data) || data < 0) {
          alert("请输入大于或等于0的金额");
        }
      },
      //清空查询条件
      clearOptions() {
        this.searchOptions = {
          page: {
            currentPage: 1,
            pageSize: 10,
            startIndex: 0,
            totalPage: 0,
            totalSize: 0
          }
        };
        //修改下拉框的值
        $("#createStartTimeOrder").val("");
        $("#createEndTimeOrder").val("");
        this.setOptions();
      },
      //设置时间(近7天/近30天)
      setTime(dayNumber) {
        let date, createStartTime, createEndTime, timestamp, newDate;
        date = new Date();
        timestamp = date.getTime();
        newDate = new Date(timestamp - dayNumber * 24 * 3600 * 1000);
        createEndTime = [
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate()
        ].join("-");
        createStartTime = [
          newDate.getFullYear(),
          newDate.getMonth() + 1,
          newDate.getDate()
        ].join("-");
        $("#createStartTimeOrder").val(createStartTime);
        $("#createEndTimeOrder").val(createEndTime);
        this.setOptions();
      },
      // 过滤请求参数
      setOptions() {
        let options = Object.assign({}, this.searchOptions);
        options.createStartTime = options.createEndTime = "";
        let createStartTime = $("#createStartTimeOrder").val(),
          createEndTime = $("#createEndTimeOrder").val();
        if (createStartTime != "") {
          options.createStartTime = createStartTime + " 00:00";
        } else {
          delete options.createStartTime;
        }
        if (createEndTime != "") {
          options.createEndTime = createEndTime + " 23:59";
        } else {
          delete options.createEndTime;
        }
        /*     options.payStartTime = options.payEndTime = "";
             let payStartTime = $("#payStartTimeOrder").val(),
               payEndTime = $("#payEndTimeOrder").val();
             if (payStartTime != "") {
               options.payStartTime = payStartTime + " 00:00:00";
             }
             if (payEndTime != "") {
               options.payEndTime = payEndTime + " 23:59:59";
             }  */
        this.onchange(options);
      }
    },
    created() {},
    watch: {
      orrId(val) {
        this.searchOptions.orrId = val;
        this.searchOptions.orrOrstNo = val;　　
        this.setOptions();
      },
      orrOrstNo(newValue, oldValue) {　　
        this.searchOptions.orrOrstNo = newValue;　　
        this.setOptions();
      }
    },
    ready() {
      this.setOptions();
      this.onchange(this.searchOptions);
      this.oncreate(false, true);
      let dates = $("#createStartTimeOrder,#createEndTimeOrder");
      if (dates.datepicker) {
        dates.datepicker({
          dateFormat: "yy-mm-dd",
          timeFormat: "HH:mm",
          showMonthAfterYear: true,
          changeMonth: true,
          changeYear: true,
          buttonImageOnly: true,
          stepHour: 1,
          stepMinute: 1,
          closeText: "确定",
          prevText: "&#x3c;上月",
          nextText: "下月&#x3e;",
          currentText: "今天",
          monthNames: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
          ],
          monthNamesShort: [
            "一",
            "二",
            "三",
            "四",
            "五",
            "六",
            "七",
            "八",
            "九",
            "十",
            "十一",
            "十二"
          ],
          dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
          dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
          dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
          weekHeader: "周",
          showAnim: "highlight",
          isClear: true, //是否显示清空
          isRTL: false,
          onSelect: function(selectedDate) {
            var option = this.id == "createStartTimeOrder" ? "minDate" : "maxDate";
            dates.not(this).datepicker("option", option, selectedDate);
          },
          onClose: function(data, inst) {
            $(this).blur();
            dates.removeAttr("disabled");
          },
          beforeShow: function() {
            dates.attr("disabled", "disabled");
            if ($("#createEndTimeOrder").datepicker("getDate") != null) {
              return;
            }
            $(this).datepicker("option", "maxDate", new Date());
          }
        });
        dates.on("click", function() {
          $(this).attr("disabled", "disabled");
        });
        dates.on("blur", this.setOptions);
        let datess = $("#payStartTimeOrder,#payEndTimeOrder");
        datess.datepicker({
          dateFormat: "yy-mm-dd",
          timeFormat: "HH:mm",
          showMonthAfterYear: true,
          changeMonth: true,
          changeYear: true,
          buttonImageOnly: true,
          stepHour: 1,
          stepMinute: 1,
          closeText: "确定",
          prevText: "&#x3c;上月",
          nextText: "下月&#x3e;",
          currentText: "今天",
          monthNames: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
          ],
          monthNamesShort: [
            "一",
            "二",
            "三",
            "四",
            "五",
            "六",
            "七",
            "八",
            "九",
            "十",
            "十一",
            "十二"
          ],
          dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
          dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
          dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
          weekHeader: "周",
          showAnim: "highlight",
          isClear: true, //是否显示清空
          isRTL: false,
          onSelect: function(selectedDate) {
            var option = this.id == "payStartTimeOrder" ? "minDate" : "maxDate";
            datess.not(this).datepicker("option", option, selectedDate);
          },
          onClose: function(data, inst) {
            $(this).blur();
            datess.removeAttr("disabled");
          },
          beforeShow: function() {
            datess.attr("disabled", "disabled");
            if ($("#payEndTimeOrder").datepicker("getDate") != null) {
              return;
            }
            $(this).datepicker("option", "maxDate", new Date());
          }
        });
        datess.on("click", function() {
          $(this).attr("disabled", "disabled");
        });
        datess.on("blur", this.setOptions);
      }
    }
  };
</script>
<style lang="less" scope>
  .search-form .col-md-4 {
    padding-left: 0;
  }
  .col-md-4:nth-child(3n) {
    padding-right: 0;
  }
  .form-control.inline-block {
    display: inline-block;
    padding-right: 5px !important;
  }
  .time-box {
    display: -webkit-box;
    display: -moz-box;
    div {
      -webkit-box-flex: 1;
      -moz-box-flex: 1;
    }
    div:nth-child(2) {
      line-height: 34px;
      width: 85px;
      margin: 0 5px;
      text-align: center;
    }
  }
  .sea {
    width: 19%;
  }
</style>

