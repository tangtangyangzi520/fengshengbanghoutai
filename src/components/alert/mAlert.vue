<template>
    <div class="modal alertModal" :class="{'fade':effect}" :id="id" :role="basic" aria-hidden="true" style="height:2000px;" :data-backdrop="backdrop">
        <div class="modal-dialog" :style="{width:width}">
            <div class="modal-content">
                <div class="modal-header" style="text-align:left;">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                    <h4 class="modal-title">{{title}}</h4>
                </div>
                <div class="modal-body" style="max-height:630px;overflow-x:hidden;overflow-y:auto;">
                    <slot name="content"></slot>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn blue" data-dismiss="modal" v-if="!hideBtn" @click="hideAlert">确定</button>
                    <button type="button" class="btn default" data-dismiss="modal" v-if="showCancelBtn" @click="cancel">取消</button>
                    <slot name="btnList"></slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        'role': {
            type: String,
            default: 'basic'
        },
        'show': {
            type: Boolean,
            default: false,
            required: true
        },
        'hideBtn': {
            type: Boolean,
            default: false
        },
        'showCancelBtn': {
            type: Boolean,
            default: false
        },
        onhide: {
            type: Function,
            default: () => { }
        },
        onsure: {
            type: Function,
            default: () => { }
        },
        'effect': {
            type: String,
            default: 'fade'
        },
        'title': {
            type: String,
            default: '提示'
        },
        'message': {
            type: String,
            default: '成功！'
        },
        'width': {
            type: String,
            default: '500px'
        },
        backdrop: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            id: 'modal' + Date.now().toString(32) + Math.round(Math.random() * 1000)
        }
    },
    methods: {
        hideAlert() {
            $(this.$el).modal({ show: false });
            this.onhide();
            this.onsure();
        },
        cancel() {
            $(this.$el).modal({ show: false });
            this.onhide();
        }
    },
    watch: {
        show() {
            $(this.$el).modal({ show: this.show });
        }
    },
    ready() {
        $('#' + this.id).on('show.bs.modal', () => {
        })
        $('#' + this.id).on('shown.bs.modal', () => {
        })
        $('#' + this.id).on('hide.bs.modal', () => {
        })
        $('#' + this.id).on('hidden.bs.modal', () => {
            this.onhide();
        })
    },
    transitions: {
        'fade': {
            enterClass: 'fadeIn',
            leaveClass: 'fadeOut'
        },
        'zoom': {
            enterClass: 'zoomIn',
            leaveClass: 'zoomOut'
        },
        'slide': {
            enterClass: 'slideInRight',
            leaveClass: 'slideOutRight'
        }
    }
};
</script>
<style lang="less">
.modal.alertModal.fade.in {
    padding-left: 0;
}

.alertModal {
    .modal-title {
        color: #777;
        font-size: 18px;
    }
    .modal-body {
        font-size: 16px;
        padding: 25px;
        .form-group {
            font-size: 14px;
            label {
                line-height: 24px;
                text-align: right;
            }
        }
    }
}
</style>