<template>
<div class="form-group">
  <div class="input-icon right for-text" :class="mClass">
    <i v-if="maxlength!=0">{{inputCount}}/{{maxlength}}</i>
    <input type="text" v-model="inputValue" :maxlength="maxlength==0?'':maxlength" class="form-control" :placeholder="placeholder">
  </div>
</div>
</template>
<script>
    import EventListener from '../util/eventListener';
    export default {
        props: {
            changeValue: {
                type: Function,
                default: () => {}
            },
            value: {
                type: [String,Number],
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
        data () {
            return {
              inputCount: 0,
              inputValue: ''
            }
        },
        ready () {
        },
        methods: {
          
        },
        watch: {
          value () {
            this.inputValue = this.value;
          },
          inputValue () {
            this.value = this.inputValue;
            this.changeValue(this.inputValue);
            this.inputCount = this.inputValue.length;
          }
        }
    };
</script>
<style lang="less" scope>
.input-icon.right.for-text >i {
  font-style: normal;
  font-size: 10px;
  top: auto;
  right: 15px;
  bottom: 0;
}
.right.for-text.middle {
  .form-control {
    font-size: 16px!important;
  }
}
.right.for-text.large {
  .form-control {
    font-size: 18px!important;
  }
}
.right.for-text.bottom {
  .form-control {
    border: none;
    font-size: 14px;
    border-bottom: 1px solid #CCC;
  }
}
</style>

