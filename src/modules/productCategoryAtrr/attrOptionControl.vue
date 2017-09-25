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
                                <tr v-for="(index, itemobj) in dataList">                                                                  
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

        <!--确定删除-->
        <m-alert :title="'删除内容'" :show-cancel-btn="true" :show="showControl" :onsure="ajaxControlDel" :onhide="hideMsg">
            <div slot="content">确定删除吗？</div>
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
        optlist: [] // 父页面传值
    },
    data() {
        return {
            isLoading: false,
            showDialog: false,
            showPage: false,
            showControl: false,
            dataList:[], // 属性值list
            clickItems: [],   // 点击操作的数据项
            itemobj: {
                "pcaoName": ""
            },
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '编辑属性值',
            selectPicType: 1,// logo类型
            pcaoIdNum : 0,// 属性值数量
            selRow : {},// 删除行数据
            deleteIndex: "",// 删除行索引
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
            this.dataList.push({"pcaoName" : ""});
            
            this.pcaoIdNum++;
            // if(pcaoIdNum<=2 || pcaoIdNum>=50){
            //       this.showMsg("属性值最少2个最多50个");
            // }
        },
        // 删除确认弹出框
        deleteOption(itemobj, index){
            this.deleteIndex = index;// 删除行索引
            this.selRow = itemobj;// 删除行数据
            this.showControl = true;// 弹出删除确认
        },
        // 删除属性值
        ajaxControlDel(){
            this.dataList.splice(this.deleteIndex, 1); //删除索引为deleteIndex的元素
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
        },
        clearInfo() {
            this.itemobj = {
                "pcaoName": ""
            }
        },
        // 提交信息
        submitInfo() {
            /**属性值是否存在较验 */
            var isSubmit = true;
            this.dataList.forEach(item => {
                let pid = item.pcaoId;
                let pname = item.pcaoName;
                this.dataList.forEach(item2 => {
                    if(pid != item2.pcaoId && pname == item2.pcaoName){
                        this.showMsg('这个属性值已经存在，请输入新的属性值!');
                        isSubmit = false;
                    }
                });
            });
            /**属性值长度较验 */
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