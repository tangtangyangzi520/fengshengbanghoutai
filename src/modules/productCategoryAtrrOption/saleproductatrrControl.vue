<template>
    <!-- 销售属性-添加/编辑页面 -->
    <div style="position:absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :idp="pcaId" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'30%'">
            <div slot="content">
                <form class="form-horizontal" name="addForm" role="form">
                    <!-- 属性名称输入框 -->
                    <div class="form-group">
                        <label for="title" class="col-sm-3 control-label">
                            <span class="required">* </span>属性名称：
                        </label>
                        <div class="controls col-md-8">
                            <input type="text" class="form-control input-sm" v-model="data.pcaName" placeholder="请输入属性名称,限20个字符以内">
                        </div>
                    </div>
                    <!-- 编辑属性值 -->
                    <div class="form-group">
                        <p>
                            <h4>编辑属性值</h4>
                        </p>
                        <div>
                            <button type="button" class="btn btn-xs blue" @click="addOption()">添加</button>
                        </div>
                        </br>
                        <table class="table table-striped table-bordered table-hover" id="attrOption-table">
                            <thead>
                                <tr>
                                    <th style="width:;">属性值</th>
                                    <th style="width:;">操作</th>
                                </tr>
                            </thead>
                            <tbody id="attrOptionTbody">
                                <tr v-for="(index, itemobj) in data.optionList" v-if="itemobj.pcaoUseFlag == 1">
                                    <td>
                                        <p style="padding-top:5px;">
                                            <input type="text" ref="input" :value="itemobj.pcaoName" v-model="itemobj.pcaoName" />
                                        </p>
                                    </td>
                                    <td>
                                        <p style="padding-top:5px;">
                                            <button type="button" class="btn btn-xs blue" @click="deleteOption(index, itemobj)">删除</button>
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </form>
            </div>
            <!-- 操作按钮 -->
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

        <control :show="showControl" :items="clickItems" :onhide="hideControlFunc" :type="controlType"></control>
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
import control from './control';
import { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList } from '../../components';
import { showSelectPic, getSelectPicList } from '../../vuex/actions/actions.resource';

export default {
    components: { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList, control },
    props: {
        pcaId: 0,
        show: {
            type: Boolean,
            value: false
        },
        onhide: {
            type: Function,
            value: () => { }
        },
        pcaid: {
            type: String,
            value: 0
        },
        pcaoId: {
            type: String,
            value: 0
        },
        pcaName2: {  //属性名称(从list.vue传过来)
            type: String,
            value: ""
        },
        pcaList: [],// 该分类下的属性,用来判断重名
        catId: 0,// 分类id
    },
    data() {
        return {
            isLoading: false,
            showDialog: false,
            showPage: false,
            showControl: false,
            controlType: '',
            clickItems: [], // 点击操作的数据项
            //dataList: [],
            data: {
                "pcaId": "",// 属性ID
                "pcraCatId": 0,  // 分类主键
                "pcaName": "",// 属性名称
                "optionList": [],
            },
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '添加自定义属性',
            selectPicType: 1, //logo类型
            pcaoIdNum: 0,// 属性值数量
            selRow: {},
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
        addOption() {
            console.log(this.pcaoIdNum);
            // 首先判断属性值数量在2-50个之间
            if(this.pcaoIdNum <= 2){
                this.data.optionList.push({ "pcaoId": "","pcaoName": "","pcaoUseFlag" : "1" });// 添加一行
                this.pcaoIdNum++; // 属性值数量+1
            }else if(this.pcaoIdNum >= 50){
                this.showMsg("属性值最少2个最多50个");
            }else if(this.pcaoIdNum>2 && this.pcaoIdNum<50){
                this.data.optionList.push({ "pcaoId": "","pcaoName": "","pcaoUseFlag" : "1" });// 添加一行
                this.pcaoIdNum++; // 属性值数量+1
            }else{
                this.showMsg("属性值最少2个最多50个");
            }
        },
        // 删除确认弹出框
        deleteOption(index, itemobj){
            // 判断删除的是回显的数据还是新增的数据(通用选项pcaoId判别)
            if(itemobj.pcaoId == ""){
                // 删除的是新添加的数据
                this.deleteIndex = index;// 删除行索引
                this.showControl = true;// 弹出删除确认
            }else{
                this.ExistOptionId = itemobj.pcaoId;
                this.showDelExistOption = true;
            }
        },
        // 删除新添加属性值
        ajaxControlDel(){ 
            this.data.optionList.splice(this.deleteIndex, 1);//删除索引为deleteIndex的元素
            this.pcaoIdNum--;// 属性值数量-1
            console.log(this.data.optionList);
        },
        // 删除回显属性值(隐藏,将pcaoUseFlag设置为0)
        sureDelete(){ 
            for (let item of this.data.optionList) {
                if(item.pcaoId == this.ExistOptionId){
                    item.pcaoUseFlag = 0;
                    this.ExistOptionId = -1;// 清空数据
                    this.pcaoIdNum--;// 属性值数量-1
                }
            }
        },
        // 回显数据
        getList() {
            let url = PCAO_GET_ID; // 按属性ID查询属性值列表
            client.postData(url + '?pcaoAtrrId=' + this.pcaid).then(response => {
                this.isLoading = false;
                if (response.code == 200) {
                    let list = response.data;
                    //console.log(list);
                    this.data.optionList = list;
                    this.pcaoIdNum = this.data.optionList.length;// 回显属性值数量
                } else {
                    this.showMsg(response.msg);
                }
            });
        },
        hideDialog() {
            //清空数据
            this.data = {
                "pcaId": "",// 属性ID
                "pcraCatId": this.catId,  // 分类主键
                "pcaName": "",// 属性名称
                "optionList": [],
            };

            this.showDialog = false;
            setTimeout(() => {
                this.showPage = false;
                this.onhide();
            }, 300);
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
            this.showAlert = false;
            this.showControl = false;
            this.showDelExistOption = false;
        },
        // 去掉前后空格方法
        trim(text){
            return text.replace(/(^\s*)|(\s*$)/g, "");
        },
        // 提交信息
        submitInfo() {
            // 数据校验
            //var isSubmit = true;
            let pcaNameTempList = Object.assign([], this.pcaList);// 因为数据双向绑定,从原来的list中删除一个元素会反应到页面上,所有用一个新的实例(Object.assign())接收转换一下
            if (this.pcaid != '') {
                //编辑操作(从list中删掉回显的属性名称)
                for (let i=0; i<pcaNameTempList.length; i++) {
                    if(pcaNameTempList[i].pcaName == this.pcaName2){
                        pcaNameTempList.splice(i, 1);
                    }
                }
            }
            for (let item of pcaNameTempList) {
                if(item.pcaName == this.trim(this.data.pcaName)){
                    this.showMsg('属性名称已经存在，请输入新的属性名!');
                    return;
                }
            }
            if (this.data.pcaName.replace(/(^\s*)|(\s*$)/g, "") == "" || this.data.pcaName.length > 20) {
                this.showMsg('属性名称不能为空,且限20个字符以内');
                return;
            }
            if(this.data.optionList.length > 1){
                for(let i=0; i<this.data.optionList.length; i++){
                    if(this.data.optionList[i].pcaoUseFlag == 1){// 排除禁用的
                        for(let j=i+1; j<this.data.optionList.length; j++){
                            if(this.data.optionList[j].pcaoUseFlag == 1 && this.data.optionList[i].pcaoName == this.data.optionList[j].pcaoName){
                                this.showMsg('这个属性值已经存在，请输入新的属性值!');
                                return;
                            }
                        }
                    }
                }
            }
            // if(!isSubmit) {
            //     return;
            // }
            //let set = new Set();
            for (let item of this.data.optionList) {
                if(item.pcaoUseFlag == 1){// 排除禁用的
                    if (item.pcaoName.replace(/(^\s*)|(\s*$)/g, "") == "" || item.pcaoName.length > 10) {
                        this.showMsg('属性值不能为空,且限10个字符以内');
                        return;
                    }
                }
               // set.add(item.pcaoName);
            }
            // if (set.size < this.data.optionList.length) {
            //     this.showMsg('属性值重复，请输入新的属性值!');
            //     return;
            // }
            if(this.pcaoIdNum < 2 || this.pcaoIdNum > 50){
                this.showMsg('属性值最少2个最多50个!');
                return;
            }

            // 添加/编辑url
            let url = SALE_CREATE; // 添加url
            if (this.pcaid != '') {
                url = SALE_UPDATE;// 编辑url
                this.data.pcaId = this.pcaid;
            }
    //console.log(this.data);
    //return;
            // 发送添加/编辑请求
            client.postData(url, this.data).then(response => {
                this.isLoading = false;
                if (response.code != 200) {
                    this.showMsg(response.message);
                } else {
                    if (this.data.pcaId != '') {
                        this.onhide('update');
                    } else {
                        this.onhide('create');
                    }
                }
            }, response => {
                this.isLoading = false;
                // this.showMsg('网络连接错误');
            });
        },

    },
    created() {
        
    },
    watch: {
        show() {
            this.showPage = this.show;
            this.showDialog = this.show;
            this.data.pcraCatId = this.catId;
            //this.pcaoIdNum = this.data.optionList.length;// 回显属性值数量

            if(this.pcaid == ''){
                // 清空数据
                this.data = {
                    "pcaId": "",// 属性ID
                    "pcraCatId": this.catId,  // 分类主键
                    "pcaName": "",// 属性名称
                    "optionList": []
                };
            }
        },
        pcaid() {
            // 判断是添加还是编辑
            if(this.pcaid == ''){
                this.title = '添加自定义属性';
            }else{
                this.title = '修改自定义属性';

                // 数据回显
                this.data.pcaName = this.pcaName2;// 将父页面传递过来的属性名称赋值给变量pcaName
                this.getList();
            }
        },
              
    },
    ready() {
        //this.typesList = client.global.componentTypes;
    },
    beforeDestroy() {
    }
}
</script>