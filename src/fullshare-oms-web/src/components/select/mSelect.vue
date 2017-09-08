<template>
    <div class="form-control dropdown-icon" style="padding:0;box-sizing:border-box;">
        <select class="form-control input-xlarge select2me" :id="id" :data-placeholder="placeholder">
            <option value=""></option>
            <option v-for="(index,item) in sData" :selected="item.id==activeItems.id?'selected':''" :value="index">{{item.name}}</option>
        </select>
        <div class="dicon">
            <i class="fa fa-angle-down"></i>
        </div>
    </div>
</template>
<script>
import EventListener from '../util/eventListener';
export default {
    props: {
        placeholder: {
            type: String,
            default: '请选择'
        },
        'data': {
            type: Array,
            default: []
        },
        changeFunc: {
            type: Function,
            default: () => { }
        },
        activeItems: {}
    },
    data() {
        return {
            id: 'select' + Date.now().toString(36) + Math.round(Math.random() * 10000),
            selectValue: '',
            sData: []
        };
    },
    ready() {
        this.sData = this.data;
        const _this = this;
        const $eventSelect = $('#' + this.id);
        $eventSelect.select2({
            allowClear: true
        });
        $eventSelect.on("change", function (e) {
            // $(_this.$el).find('.select2-selection__rendered').html('<span class="select2-selection__clear">×</span>'+_this.data[$eventSelect.val()].name);
            _this.changeValue($eventSelect.val());
        });
        $('.select2.select2-container').attr('class', 'select2 select2-container select2-container--default');
        $('.select2.select2-container input').css({ 'width': '100px', 'border': 'none' });
        $('.select2-container--default .select2-selection--single').css({ 'border': 'none' });
        $('.selection__arrow').hide();
    },
    beforeDestroy() {
       
    },
    methods: {
        changeValue(index) {
            if (index == '') {
                this.changeFunc('');
            } else {
                this.changeFunc(this.data[index]);
            }
        }
    },
    watch: {
        data() {
            this.sData = this.data;
        },
        activeItems() {
            if (!this.activeItems) {
                this.sData = [];
                setTimeout(() => {
                    this.sData = this.data;
                }, 200)
            }
        }
    }
};
</script>
<style lang="less">
.select2.select2-container {
    width: 100%!important;
}
.select2-container--default .select2-selection--single {
    border: none!important;
}
.dropdown-icon {
    position: relative;
    .dicon {
        position: absolute;
        width: 20px;
        height: 34px;
        text-align: center;
        top: 0;
        right: 0;
        font-size: 18px;
        color: #999;
        line-height: 34px;
    }
}

.select2-search input {
    border: 1px solid #e5e5e5;
    background-color: #fff !important;
    filter: none;
    margin: 0;
    outline: 0;
    border: 1px solid #e5e5e5;
    webkit-appearance: none !important;
    color: #333333;
    outline: 0;
    height: auto !important;
    min-height: 26px;
    padding: 6px 6px !important;
    line-height: 20px;
    font-size: 14px;
    font-weight: normal;
    vertical-align: top;
    background-color: #ffffff;
    -webkit-box-shadow: none;
    box-shadow: none;
    margin-top: 5px;
}

.select2-search input {
    width: 100%;
    height: auto !important;
    min-height: 26px;
    padding: 4px 20px 4px 5px;
    margin: 0;
    outline: 0;
    font-family: sans-serif;
    font-size: 1em;
    border: 1px solid #aaa;
    border-radius: 0;
    -webkit-box-shadow: none;
    box-shadow: none;
}

.select2-container .select2-selection--single .select2-selection__rendered {
    line-height: 34px;
}

.select2-selection__clear {
    float: right;
    font-size: 20px;
    color: #999;
    font-weight: normal!important;
}

.select2-results .select2-results__option--highlighted {
    background: #eee;
    color: #333;
}

.select2-results {
    max-height: 200px;
    padding: 0 0 0 4px;
    margin: 4px 4px 4px 0;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.fixedIcon .dicon i {
    position: relative!important;
}

.select2-search input {
    border-color: #c2cad8;
}

.select2-container.select2-container--bootstrap.select2-container--open .select2-dropdown {
    box-sizing: content-box;
    border-color: #c2cad8;
    margin-left: -1px;
}

.select2-selection__placeholder {
    color: #999;
}

.select2.select2-container b {
    display: none;
}
</style>

