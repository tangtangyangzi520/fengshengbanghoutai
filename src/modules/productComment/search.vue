<template>
    <form class="row search-form" style="margin: 5px 0 0 0">
        <div class="col-md-4" style="margin-left:6px;">
            <div class="form-group">
                <label class="col-md-3 sea" >sku名称：</label>
                <div class="col-md-9" >
                    <input type="text" class="form-control" v-model="searchOptions.oicProductName">
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="col-md-3 sea">图片状态：</label>
                <div class="col-md-9">
                    <select class="form-control" v-model="searchOptions.oicImgStatus">
                        <option v-for="item in logiTypeList" :value="item.id">{{item.name}}</option>
                    </select>
                </div>
            </div>
        </div>
    </form>
</template>
<script>
import client from '../../common/utils/client';
import { getComponentList } from '../../vuex/actions/actions.component';
import { getPainTree } from '../../vuex/actions/actions.pain';
import { mMultiSelect, mAlert, mSelect } from '../../components';
export default {
    props: {
        onchange: {
            type: Function,
            default: () => { }
        },
        oncreate: {
            type: Function,
            default: () => { }
        },

    },
    vuex: {
        getters: {
        },
        actions: {
        }
    },
    components: { mMultiSelect, mSelect, mAlert },
    data() {
        return {
            logiTypeList: [
                { id: -1, name: '全部' }, { id: 0, name: '无图' }, { id: 1, name: '有图' }
            ],
            lastSearchOptions: {},
            searchOptions: {
                oicProductName: '',
                oicImgStatus: -1,
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    startIndex: 0,
                    totalPage: 0,
                    totalSize: 0
                }
            }
        }
    },
    methods: {
       
    },
    created() {

    },
    watch: {

    },
    ready() {
        this.onchange(this.searchOptions);
        this.oncreate(false, true);
        let dates = $("#createStartTimeOrder,#createEndTimeOrder");
        dates.datepicker({
            dateFormat: "yy-mm-dd",
            timeFormat: 'HH:mm',
            showMonthAfterYear: true,
            changeMonth: true,
            changeYear: true,
            buttonImageOnly: true,
            stepHour: 1,
            stepMinute: 1,
            closeText: '确定',
            prevText: '&#x3c;上月',
            nextText: '下月&#x3e;',
            currentText: '今天',
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthNamesShort: ['一', '二', '三', '四', '五', '六',
                '七', '八', '九', '十', '十一', '十二'],
            dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
            weekHeader: '周',
            showAnim: 'highlight',
            isClear: true, //是否显示清空 
            isRTL: false,
            onSelect: function(selectedDate) {
                var option = this.id == "createStartTimeOrder" ? "minDate" : "maxDate";
                dates.not(this).datepicker("option", option, selectedDate);
            },
            onClose: function(data, inst) {
                $(this).blur()
                dates.removeAttr("disabled")
            },
            beforeShow: function() {
                dates.attr("disabled", "disabled")
                if ($("#createEndTimeOrder").datepicker('getDate') != null) {
                    return
                }
                $(this).datepicker('option', 'maxDate', new Date())
            },
        });
        dates.on("click", function() {
            $(this).attr("disabled", "disabled")
        })
        dates.on("blur", this.setOptions)

          let datess = $("#payStartTimeOrder,#payEndTimeOrder");
        datess.datepicker({
            dateFormat: "yy-mm-dd",
            timeFormat: 'HH:mm',
            showMonthAfterYear: true,
            changeMonth: true,
            changeYear: true,
            buttonImageOnly: true,
            stepHour: 1,
            stepMinute: 1,
            closeText: '确定',
            prevText: '&#x3c;上月',
            nextText: '下月&#x3e;',
            currentText: '今天',
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthNamesShort: ['一', '二', '三', '四', '五', '六',
                '七', '八', '九', '十', '十一', '十二'],
            dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
            weekHeader: '周',
            showAnim: 'highlight',
            isClear: true, //是否显示清空 
            isRTL: false,
            onSelect: function(selectedDate) {
                var option = this.id == "payStartTimeOrder" ? "minDate" : "maxDate";
                datess.not(this).datepicker("option", option, selectedDate);
            },
            onClose: function(data, inst) {
                $(this).blur()
                datess.removeAttr("disabled")
            },
            beforeShow: function() {
                datess.attr("disabled", "disabled")
                if ($("#payEndTimeOrder").datepicker('getDate') != null) {
                    return
                }
                $(this).datepicker('option', 'maxDate', new Date())
            },
        });
        datess.on("click", function() {
            $(this).attr("disabled", "disabled")
        })
        datess.on("blur", this.setOptions)
    }
}
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
    padding-right: 5px!important;
}

.time-box {
    display: -webkit-box;
    display: -moz-box;
    div {
        -webkit-box-flex: 1.0;
        -moz-box-flex: 1.0
    }
    div:nth-child(2) {
        line-height: 34px;
        width: 85px;
        margin: 0 5px;
        text-align: center
    }
}
.sea{
    width:19%

}
</style>

