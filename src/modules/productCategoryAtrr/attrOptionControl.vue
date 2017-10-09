<template>
    <!-- 通用属性-编辑属性值页面 -->
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;"  v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'30%'">
            <div slot="content">
                <div class="row">
                    <div>
                         <p><button type="button" class="btn btn-xs blue" @click="addOption()">添加</button></p></br>
                    </div>
                    <form class="form-horizontal" name="addForm" role="form">
                        <table class="table table-striped table-bordered table-hover" id="attrOption-table">
                            <thead>
                                <tr>
                                    <th style="width:;">属性值</th>
                                    <th style="width:;">操作</th>
                                </tr>
                            </thead>
                            <tbody id="attrOptionTbody">
                                <tr v-for="(index, itemobj) in dataList" v-if="itemobj.pcaoUseFlag == 1">                                                                  
                                    <td>
                                        <p style="padding-top:2px;">
                                            <input type="text" ref="input" :value="itemobj.pcaoName" v-model="itemobj.pcaoName"/>
                                        </p>
                                    </td>
                                    <td>
                                        <p style="padding-top:4px;">
                                            <button type="button" class="btn btn-xs blue" @click.stop="deleteOption(itemobj, index)">删除</button>
                                        </p>
                                    </td>
                                </tr>                            
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>
            <span slot="btnList">
                <button type="button" class="btn blue" @click="submitInfo()" @blur="save">确定</button>
                <button type="button" class="btn default" data-dismiss="modal">关闭</button>
            </span>
        </m-alert>
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>

        <!-- 删除新添加的属性值确认弹出框 -->
        <m-alert :title="'温馨提示'" :show-cancel-btn="true" :show="showControl" :onsure="ajaxControlDel" :onhide="hideMsg">
            <div slot="content">确定删除吗？</div>
        </m-alert>
        <!-- 删除回显的属性值确认弹出框 -->
        <m-alert :title="'温馨提示'" :show-cancel-btn="true" :show="showDelExistOption" :onsure="sureDelete" :onhide="hideMsg">
            <div slot="content">删除此数据可能会影响商品属性的展示,确定删除吗？</div>
        </m-alert>
        
        <div style="position:fixed;z-index:111111;" v-show="picShowOption.show">
            <select-pic v-show="picShowOption.show" :options="picShowOption" :onselect="selectPicFunc" :oncancel="cancelSelect"></select-pic>
        </div>
    
        <div class="loading" style="position:fixed;z-index:11111;" v-if="isLoading">
            <div class="page-spinner-bar">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
            </div>
        </div>
    </div>
</template>

<script>
import client from '../../common/utils/client';
import { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList } from '../../components';
import { showSelectPic, getSelectPicList } from '../../vuex/actions/actions.resource';

export default {
    components: { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList },
    props: {
        show: {
            type: Boolean,
            value: false
        },
        onhide: {
            type: Function,
            value: () => { }
        },
        pcaoId:{
            type: String,
            value: 0 
        },
        optlist: [], // 父页面传过来的属性值list
    },
    data() {
        return {
            isLoading: false,
            showDialog: false,
            showPage: false,
            showControl: false,
            dataList:[{// 属性值list
                    "pcaoId": "",
                    "pcaoName": "",
                    "pcaoUseFlag" : "1"
            }], 
            clickItems: [],   // 点击操作的数据项
            // itemobj: {
            //     "pcaoName": ""
            // },
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '编辑属性值',
            selectPicType: 1,// logo类型
            pcaoIdNum : 0,// 属性值数量
            selRow : {},// 删除行数据
            deleteIndex: "",// 删除行索引
            showDelExistOption: false,// 删除回显属性值弹框
            ExistOptionId: "",// 所要删除的回显属性值id
        }
    },
    vuex: {
        getters: {
            picShowOption: ({ resourceControl }) => resourceControl.picShowOption,
            selectPicList: ({ resourceControl }) => resourceControl.selectPicList,
        },
        actions: { showSelectPic, getSelectPicList }
    },
    methods: {
        // 添加一行
        addOption(){
            // 首先判断属性值数量在2-50个之间
            if(this.pcaoIdNum <= 2){
                this.dataList.push({ "pcaoId": "","pcaoName": "","pcaoUseFlag" : "1" });// 添加一行
                this.pcaoIdNum++; // 属性值数量+1
            }else if(this.pcaoIdNum >= 50){
                this.showMsg("属性值最少2个最多50个");
            }else if(this.pcaoIdNum>2 && this.pcaoIdNum<50){
                this.dataList.push({ "pcaoId": "","pcaoName": "","pcaoUseFlag" : "1" });// 添加一行
                this.pcaoIdNum++; // 属性值数量+1
            }else{
                this.showMsg("属性值最少2个最多50个");
            }
        },
        // 删除确认弹出框
        deleteOption(itemobj, index){
            // 判断删除的是回显的数据还是新增的数据(通用选项pcaoId判别)
            if(itemobj.pcaoId == ""){
                // 删除的是新添加的数据
                this.deleteIndex = index;// 删除行索引
                this.selRow = itemobj;// 删除行数据
                this.showControl = true;// 弹出删除确认
            }else{
                this.ExistOptionId = itemobj.pcaoId;
                this.showDelExistOption = true;
            }
        },
        // 删除新添加属性值
        ajaxControlDel(){
            this.dataList.splice(this.deleteIndex, 1); //删除索引为deleteIndex的元素
            this.pcaoIdNum--;// 属性值数量-1
        },
        // 删除回显属性值(隐藏,将pcaoUseFlag设置为0)
        sureDelete(){ 
            for (let item of this.dataList) {
                if(item.pcaoId == this.ExistOptionId){
                    item.pcaoUseFlag = 0;
                    this.ExistOptionId = -1;// 清空数据
                    this.pcaoIdNum--;// 属性值数量-1
                }
            }
        },
        // 隐藏选择资源弹窗
        cancelSelect() {
            this.showSelectPic({ show: false });
        },
        // 隐藏选择组件弹窗
        cancelSelectComponent() {
            this.showComponent = false;
        },
        hideDialog() {
            this.showDialog = false;
            setTimeout(() => {
                this.showPage = false;
                this.onhide();
            }, 300)
        },
        showMsg(msg, title) {
            if (title) {
                this.showAlertTitle = title;
            } else {
                this.showAlertTitle = '温馨提示';
            }
            this.showAlertMsg = msg;
            this.showAlert = true;
        },
        hideMsg() {
            this.showDeleteDialog = false;
            this.showAlert = false;
            this.showControl = false;
            this.showDelExistOption = false;
        },
        // 提交信息
        submitInfo() {
            // 数据校验
            var isSubmit = true;
            if(this.dataList.length > 1){
                for(let i=0; i<this.dataList.length; i++){
                    if(this.dataList[i].pcaoUseFlag == 1){// 排除禁用的
                        for(let j=i+1; j<this.dataList.length; j++){
                            if(this.dataList[j].pcaoUseFlag == 1 && this.dataList[i].pcaoName == this.dataList[j].pcaoName){
                                this.showMsg('这个属性值已经存在，请输入新的属性值!');
                                return;
                            }
                        }
                    }
                }
            }

            var arr =[];
            this.dataList.forEach(item=> {
                if((item.pcaoName.length-1)==-1){
                    this.showMsg('请输入属性值') 
                    isSubmit = false;
                } 
                if ((item.pcaoName.length)>10){
                    this.showMsg('属性值不能超过10个字');
                    isSubmit = false;
                }
            });
            if(!isSubmit) {
                return;
            }

            if(this.pcaoIdNum < 2 || this.pcaoIdNum > 50){
                this.showMsg('属性值最少2个最多50个!');
                return;
            }

            this.$emit("attroptionlist", this.dataList);// 向父组件传递属性值list
            this.showPage = false;
            this.showDialog = false;
        }
    }, 
    created() {
     
    },
    watch: {
        show() {
            this.dataList = Object.assign([], this.optlist);// 创建新的实例,回显属性值数据
            this.pcaoIdNum = this.optlist.length;// 回显属性值数量
            this.showPage = this.show;
            this.showDialog = this.show;
        }
    },
    ready() {
        this.typesList = client.global.componentTypes;
    },
    beforeDestroy() {
    }
}
</script>