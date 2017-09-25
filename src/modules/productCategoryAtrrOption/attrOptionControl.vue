<template>
    <!-- 销售属性编辑页面 -->
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :idp="pcaId" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'30%'">
            <div slot="content">
                <form class="form-horizontal" name="addForm" role="form">
                    <!-- 属性名称输入框 -->
                    <div class="row">
                        <label for="title" class="col-sm-3 control-label">
                            <span class="required">* </span>属性名称:
                        </label>
                        <div class="controls col-md-6">
                            <!-- <input type="hidden" class="form-control input-sm" v-model="pcraCatId"> -->
                            <input type="text" class="form-control input-sm" v-model="pcaName2" placeholder="请输入属性名称">
                        </div>
                    </div>

                    <!-- 编辑属性值 -->
                    <div class="row">
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
                                    <th style="width:70%;">属性值</th>
                                    <th style="width:30%;">操作</th>
                                </tr>
                            </thead>
                            <tbody id="attrOptionTbody">
                                <tr v-for="itemobj in dataList">
                                    <!--<td><input type="hidden" v-model="itemobj.pcaoId"/></td>  @blur="save" @dblclick="edit($event)" -->
                                    <td>
                                        <!-- <span v-if="!editing" @dblclick="edit">{{itemobj.pcaoName}}</span> -->
                                        <input type="text" ref="input" class="form-control input-sm" :value="itemobj.pcaoName" v-model="itemobj.pcaoName" /></td>
                                    <td>
                                        <a @click="deleteOption(itemobj)">删除</a>
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
                <button type="button" class="btn default" data-dismiss="modal" @click="hideDialog()">关闭</button>
            </span>
        </m-alert>

        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>

        <!--删除属性值确认弹出框-->
        <m-alert :title="'删除内容'" :show-cancel-btn="true" :show="showControl" :onsure="ajaxControlDel" :onhide="hideMsg">
            <div slot="content">确定删除吗？</div>
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
        pcaList: [],
        pcaItem:{},

    },
    data() {
        return {
            isLoading: false,
            showDialog: false,
            showPage: false,
            showControl: false,
            controlType: '',
            clickItems: [],   //点击操作的数据项
            dataList: [],
            data: {"pcaoName": ""},  //属性值名称
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '添加/修改自定义属性',
            selectPicType: 1, //logo类型
            pcaoIdNum: 0,
            selRow: {},
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
        //添加一行
        addOption() {
            //    console.log("pcaId is "+this.pcaid);
            this.dataList.push({ "val": "" });
            this.pcaoIdNum++;
        },
        //弹出删除确认
        deleteOption(itemobj) {
            this.selRow = itemobj;
            this.showControl = true;
        },
        //删除操作
        ajaxControlDel() {
            if (this.selRow.pcaoId == null) {
                let index = this.dataList.findIndex(item => item.pcaoId == this.selRow.pcaoId);
                this.dataList.splice(index, 1);
            } else {
                // this.controlType = type;
                this.clickItems = typeof this.selRow == 'array' ? this.selRow : [this.selRow];
                let url = PCAO_DELETE + '?pcaoId=' + this.selRow.pcaoId;
                client.postData(url).then(data => {
                    this.isLoading = false;
                    this.getList();
                });
            }
        },
        // 回显数据
        getList() {
            let url = PCAO_GET_ID; // 按属性ID查询属性值列表
            client.postData(url + '?pcaoAtrrId=' + this.pcaid).then(response => {
                this.isLoading = false;
                if (response.code == 200) {
                    let list = response.data;
                    // console.log(list);
                    this.dataList = list;
                    // this.stateList = client.global.deployStatusSelect;
                } else {
                    this.showMsg(response.msg);
                }
            });
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
                this.onhide("cancel");
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
        // 提交信息
        submitInfo() {
            console.log(this.pcaName2);//属性名称
            let pcaList2,url;
            //属性名称唯一性校验
            pcaList2=Object.assign([],this.pcaList);
            for (let index = 0; index < pcaList2.length; index++) {
                if(pcaList2[index].pcaId==this.pcaItem.pcaId){
                    pcaList2.splice(index,1);
                }
            }
            console.log(pcaList2);
            pcaList2.forEach(item => {
                if (item.pcaName == this.pcaName2) {
                    this.showMsg('这个属性名已经存在，请输入新的属性名!');
                    return;
                }
            });
            //属性值唯一性校验
            let set = new Set();
            this.dataList.forEach(item => {
                set.add(item.pcaoName);
            });
            if (set.size < this.dataList.length) {
                this.showMsg('属性值重复，请输入新的属性值!');
                return;
            }
            //提交属性选项
            url = PCAO_CREATE; //添加属性值url        
            //将属性名称添加到每一个dataList的每一个json中
            this.dataList.forEach(item => item["pcaName"] = this.pcaName2);
            console.log(this.dataList);
            console.log(this.pcaid);
            return;

            client.postData(url, { "pcaoList": this.dataList }).then(response => {
                this.isLoading = false;
                if (response.code != 200) {
                    this.showMsg(response.msg);
                } else {
                    if (this.id != '') {
                        this.onhide('update');
                    } else {
                        this.onhide('create');
                    }
                }
            }, response => {
                this.isLoading = false;
                this.showMsg('网络连接错误');
            }
            );
        },

    },
    created() {

    },
    watch: {
        show() {
            this.showPage = this.show;
            this.showDialog = this.show;
        },
        pcaid() {
            this.getList();
        },

    },
    ready() {
        this.typesList = client.global.componentTypes;
    },
    beforeDestroy() {
    }
}
</script>