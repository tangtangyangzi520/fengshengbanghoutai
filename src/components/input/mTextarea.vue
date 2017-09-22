<template>
    <div class="form-group">
        <div class="input-icon right for-text" :class="mClass">
            <i v-if="maxlength!=0">{{inputCount}}/{{maxlength}}</i>
            <textarea :id="id" v-model="inputValue" :maxlength="maxlength==0?'':maxlength" class="form-control" rows="1" :placeholder="placeholder"></textarea>
        </div>
    </div>
</template>
<script>
import EventListener from '../util/eventListener';
export default {
    props: {
        changeValue: {
            type: Function,
            default: () => { }
        },
        value: {
            type: [String, Number],
            default: '请输入内容'
        },
        placeholder: {
            type: String,
            default: '请输入内容'
        },
        maxlength: {
            type: Number,
            default: 0
        },
        mClass: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            inputCount: 0,
            id: 'textarea' + Date.now().toString(36) + parseInt(Math.random() * 10000),
            inputValue: '',
            firstInit: true,
        };
    },
    ready() {
        $(document).on('input propertychange', 'textarea', this.change);
        setTimeout(() => {
            if (document.getElementById(this.id)) {
                $('#' + this.id).css('height', document.getElementById(this.id).scrollHeight);
            }
        }, 200)
    },
    methods: {
        change(e) {
            const $target = $(e.target);
            $(e.target).css('height', e.target.scrollHeight);
            this.inputCount = $target.val().length;
            let $textarea = $('#' + this.id);
            if (this.maxlength != 0 && typeof $textarea.val() != 'undefined') {
                $textarea.siblings('i').html($textarea.val().length + '/' + $textarea.attr('maxlength'));
            }
            if (this.inputCount < 10) {
                $(e.target).css('height', 32);
            }
        }
    },
    beforeDestroy() {
        $(document).unbind('input propertychange', 'textarea', this.change);
    },
    watch: {
        value() {
            this.inputValue = this.value;
            setTimeout(() => {
                if ($('#' + this.id).length != 0) {
                    let scrollHeight = document.getElementById(this.id).scrollHeight;
                    if (navigator.userAgent.indexOf("Firefox") > 0 && this.firstInit) {
                        scrollHeight-= 6;
                        this.firstInit = false;
                    }
                    $('#' + this.id).css('height', scrollHeight);
                }
            }, 200)
        },
        inputValue() {
            this.value = this.inputValue;
            this.changeValue(this.inputValue);
            this.inputCount = this.inputValue.length;
            setTimeout(() => {
                if ($('#' + this.id).length != 0) {
                    let scrollHeight = document.getElementById(this.id).scrollHeight;
                    $('#' + this.id).css('height', scrollHeight);
                }
            }, 200)
        }
    }
};
</script>
<style lang="less" scope>
.form-group {
    position: relative;
    i {
        position: absolute;
    }
}

.form-control {
    padding-right: 40px;
    resize: none;
    &::-webkit-scrollbar {
        width: 0px
    }
}

.input-icon.right.for-text>i {
    font-style: normal;
    font-size: 10px;
    top: auto;
    width: auto;
    right: 1px;
    bottom: 0;
}

.right.for-text.bottom {
    .form-control {
        border: none;
        border-bottom: 1px solid #CCC;
    }
}
</style>

