<template>
    <div style="padding:0;box-sizing:border-box;">
        <select :id="id" class="form-control select2" multiple v-if="item.children.length!=0" :data-placeholder="placeholder">
            <optgroup :label="item.name" v-for="item in sData">
                <option v-for="childItem in item.children" :id="childItem.id">{{childItem.name}}</option>
            </optgroup>
        </select>
        <select :id="id" class="form-control select2" multiple v-else :data-placeholder="placeholder">
            <option :id="item.id" v-for="item in sData">{{item.name}}</option>
        </select>
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
        data: {
            type: Array,
            default: []
        },
        changeFunc: {
            type: Function,
            default: () => { }
        },
        activeItems: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            id: 'multiSelect' + Date.now().toString(32) + Math.round(Math.random() * 10000),
            sData: [],
            selectList: [],
        }
    },
    ready() {
        this.$multiSelect = $("#" + this.id).select2();
        const _this = this;
        $("#" + this.id).on('select2:select', function (evt) {
            let item = evt.params.data;
            _this.selectList.push({ id: item.element.id, name: item.element.innerText });
            _this.changeFunc(_this.selectList);
            _this.update();
        });
        $("#" + this.id).on('select2:unselect', function (evt) {
            let item = evt.params.data;
            let index = _this.selectList.findIndex((info) => info.id == item.element.id)
            if (index >= 0) {
                _this.selectList.splice(index, 1);
            }
            _this.changeFunc(_this.selectList);
            _this.update();
        });
        $('.select2.select2-container').attr('class','select2 select2-container select2-container--default');
        $('.select2.select2-container input').css('width','100px');
    },
    beforeDestroy() {
        $("#" + this.id).select2('destroy');
    },
    methods: {
        update() {
            let _this = this;
            $('#' + this.id).siblings('.select2').find('li').each(function () {
                if (_this.selectList.length != 0) {
                    if ($(this).attr('title') == _this.selectList[0].name) {
                        $(this).addClass('active');
                    } else {
                        $(this).removeClass('active')
                    }
                }
            })
            if(_this.selectList.length==1&&$('#' + this.id).siblings('.select2').find('li').length==1){
                _this.changeFunc([]);
            }
        }
    },
    watch: {
        data() {
            this.sData = this.data;
        },
        sData() {
            setTimeout(() => {
                let arr = [];
                this.selectList = [];
                for (var i = 0; i < this.activeItems.length; i++) {
                    let matchItem = this.sData.find((item) => item.id == this.activeItems[i].id);
                    if (matchItem) {
                        arr.push(matchItem.name);
                        this.selectList.push({ id: this.activeItems[i].id, name: this.activeItems[i].name });
                    }
                }
                if (arr.length != 0) {
                    if (this.$multiSelect) {
                        this.$multiSelect.val(arr).trigger("change");
                    }
                }
            }, 200)

            setTimeout(() => {
                this.update();
            }, 200)
        },
        activeItems() {
            if (this.activeItems.length == 0) {
                this.sData = [];
                setTimeout(() => {
                    this.sData = this.data;
                }, 200)
            }
            // if(!this.initTrigger){
            //     let arr = [];
            //     this.selectList = [];
            //     for(var i=0;i<this.activeItems.length;i++){
            //         arr.push(this.activeItems[i].name);
            //         this.selectList.push({id:this.activeItems[i].id,name:this.activeItems[i].name});
            //     }
            //     if(arr.length!=0){
            //         this.initTrigger = true;
            //         this.$multiSelect.val(arr).trigger("change");
            //     }
            //     this.initTrigger = true;
            //     this.update();
            // }
            // console.log(111)
            // console.log(this.activeItems)
        }
    }
};
</script>
<style lang="less">
.select2-container.select2-container--bootstrap.select2-container--open {
    z-index: 1111111;
}
.select2-selection.select2-selection--multiple {
    min-height: 34px;
    padding: 0;
}

.select2-selection__choice.active {
    // background-color: #7fb719!important;
    // color: #FFF;
    // span {
    //     color: #FFF!important;
    // }
}

.select2-container.select2-container--default.select2-container--open .select2-dropdown.select2-dropdown--below {
    box-sizing: border-box;
    margin-left: 0;
    margin-top: -1px;
}

.select2-container--default.select2-container--focus .select2-selection--multiple {
    border-color: #c2cad8;
}

.select2-container--default .select2-selection--multiple {
    border-color: #c2cad8;
}

.select2-container--default .select2-selection--multiple .select2-selection__rendered ul {
    padding-top: 4px!important;
}

.select2.select2-container.select2-container--default.select2-container--below li {
    margin-top: 4px;
}

.select2-container--default .select2-selection--multiple .select2-selection__rendered li {
    line-height: 20px;
    margin-top: 4px;
    font-size: 14px;
}

.select2-container--default .select2-selection--multiple .select2-selection__choice__remove {
    font-size: 20px;
    margin-right: 4px;
    margin-top: 2px;
    vertical-align: -2px;
}

.select-content-area {
    line-height: 10px;
}

.select2-container .select2-search--inline .select2-search__field {
    margin-top: 0;
    line-height: 20px;
    height: 30px!important;
    padding: 0;
    margin-top: -2px;
    margin-bottom: -4px;
}

.select2-container--default .select2-results__option .select2-results__option {
    width: 25%;
    border-right: 4px solid #FFF;
    box-sizing: border-box;
    float: left;
}

.select2-results {
    max-height: 300px;
}

.select2-container--default .select2-results>.select2-results__options {
    max-height: 300px;
}

.select2-container--default .select2-results__option[aria-selected=true] {
    background: #EEE;
}

.select2-container--default .select2-results__option[aria-selected=true]:active {
    color: #333;
    background: #EEE;
}

.select2-container--default .select2-results__option[aria-selected=true]:hover {
    color: #333;
    background: #EEE;
}

.select2-results__option {
    margin-bottom: 0;
}

.select2-container--default .select2-results__option--highlighted[aria-selected] {
    background-color: #5897fb!important;
}

.select2-container .select2-search--inline .select2-search__field {
    padding: 0;
}

.select2-results__option {
    overflow: hidden;
}
</style>