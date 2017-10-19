<template>
    <div class="img-component-item" :class="customClass" :id="id">
        <slot></slot>
        <div class="bottom buying">
            <div class="inner">
                <a @click.stop="removeItemFunc">
                    <!-- 删除图标 -->
                    <i class="fa fa-trash-o"></i>
                </a>
                <a @click="changeRight" v-show="hiddenLeftRight">
                    <!-- 向右图标 -->
                    <i class="fa fa-arrow-right"></i>
                </a>
                <a @click="changeLeft" v-show="hiddenLeftRight">
                    <!-- 向左图标 -->
                    <i class="fa fa-arrow-left"></i>
                </a>
                <a @click="changeDown" v-show="hiddenUpDown">
                    <!-- 向下图标 -->
                    <i class="fa fa-arrow-down"></i>
                </a>
                <a @click="changeUp" v-show="hiddenUpDown">
                    <!-- 向上图标 -->
                    <i class="fa fa-arrow-up"></i>
                </a>
                <div class="confirm" v-if="showRemove">
                    <a class="btn red btn-sure" @click="removeItem">确定</a>
                    <a class="btn default" @click="cancel">取消</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        changeLeft: {
            type: Function,
            default() { }
        },
        changeRight: {
            type: Function,
            default() { }
        },
        changeUp: {
            type: Function,
            default() { }
        },
        changeDown: {
            type: Function,
            default() { }
        },
        removeItem: {
            type: Function,
            default() { }
        },
        editItem: {
            type: Function,
            default() { }
        },
        customClass: {
            type: String,
            default: ''
        },
        hiddenLeftRight: {
            type: Boolean,
            default: true
        },
        hiddenUpDown: {
            type: Boolean,
            default: true
        }
    },
    components: {},
    data() {
        return {
            id: 'previewItem' + Date.now().toString(36) + parseInt(Math.random() * 10000),
            showRemove: false
        }
    },
    methods: {
        removeItemFunc() {
            this.showRemove = true;
        },
        cancel() {
            this.showRemove = false;
        }
    },
    created() {
    },
    ready() {
        $(document).on('click', this.cancel);
    },
    beforeDestory() {
        $(document).unbind('click', this.cancel);
    }
};
</script>

<style lang="less">
.img-component-item {
    position: relative;
    width: 100%;
    min-height: 40px;
    background: #FFF;
    margin-bottom: 30px;
    &:hover {
        background: #edf6ea;
    }
    .bottom {
        position: absolute;
        bottom: 20px;
        left: 0;
        z-index: 10;
        width: 100%;
        background: rgba(0, 0, 0, 0.5);
        .inner {
            position: relative;
            width: 100%;
            height: 100%;
            .confirm {
                position: absolute;
                width: 100px;
                height: 34px;
                text-align: center;
                top: 18px;
                right: -10px;
                background: #FFF;
                padding-left: 3px;
                padding-top: 4px;
                border: 1px solid #CCC;
                a {
                    font-size: 14px;
                    margin: 0 3px;
                    padding: 0;
                    width: 40px;
                    float: left;
                    height: 24px;
                    line-height: 24px;
                    color: #fff;
                    &.default {
                        color: #666;
                    }
                    &:hover {
                        color: #fff;
                        text-decoration: none;
                    }
                }
            }
        }
        a {
            display: inline-block;
            float: right;
            width: 33.3333%;
            text-align: center;
            color: #fff;
            font-size: 14px;
            &:hover {
                color: #FFF;
            }
        }
    }
    p {
        display: block;
        width: 100%;
        height: 20px;
        line-height: 20px;
        margin: 0;
        font-size: 12px;
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>