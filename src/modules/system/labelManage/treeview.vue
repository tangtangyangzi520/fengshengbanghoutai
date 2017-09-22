<template>
    <li class="jstree-node jstree-no-dots" :class="{'jstree-open':model.isOpen,'jstree-closed':!model.isOpen}" @click.stop="selectItem(model)">
        <div class="jstree-wholerow" :class="{'jstree-wholerow-clicked':model.isSelected}">
            <span class="fa fa-trash-o fr" title="删除" @click.stop="deleteLabel(model)"></span>
            <span class="fa fa-pencil fr" title="编辑" @click.stop="editLabel(model)"></span>
            <span class="fa fa-arrow-up fr" title="上移" v-if="!hideSort" @click.stop="changeUp(model)"></span>
            <span class="fa fa-arrow-down fr" title="下移" v-if="!hideSort" @click.stop="changeDown(model)"></span>
        </div>
        <i class="jstree-icon jstree-ocl" @click.stop="showItem(model)" :style="{opacity:model.children.length==0?0:1}"></i>
        <a class="jstree-anchor">
            <i class="jstree-icon jstree-themeicon fa fa-folder icon-state-warning icon-lg jstree-themeicon-custom"></i>{{model.text}}</a>
        <ul class="jstree-children" v-if="model.children.length!=0">
            <treeview v-for="m in model.children" :sort="sortLabel" :hide-sort="true" :model="m" :select="select" :sort-up="sortUp" :sort-down="sortDown" :delete="deleteLabel" :edit="editLabel"></treeview>
        </ul>
    </li>
</template>
<script>
import client from '../../../common/utils/client';
export default {
    name: 'treeview',
    props: {
        model: Object,
        select: Function,
        sortDown: Function,
        sortUp: Function,
        delete: Function,
        edit: Function,
        hideSort: Boolean,
    },
    data() {
        return {

        }
    },
    methods: {
        showItem(item) {
            if (item.children.length == 0) return;
            item.isOpen = !item.isOpen;
        },
        selectItem(item) {
            this.select(item);
        },
        deleteLabel(item){
            this.delete(item);
        },
        editLabel(item){
            this.edit(item);
        },
        changeUp(item){
            this.sortUp(item);
        },
        changeDown(item){
            this.sortDown(item);
        }
    },
    created() {
    },
    ready() {
    },
    beforeDestroy() {
    }
};
</script>

<style lang="less">
.jstree-icon {
    background-position: -36px -4px;
}

.jstree-wholerow .fr {
    color: #CCC;
    margin-top: 5px;
    margin-right: 5px;
}

.jstree-wholerow {
    &:hover {
        background: #EEE;
        .fr {
            color: #666;
        }
    }
}
</style>