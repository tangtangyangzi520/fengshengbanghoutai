<template>
    <!-- 作废 -->
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :ide="pcaId" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'800px'">
            <div slot="content">
                <div class="row nopadding">
                    <form class="form-horizontal" name="addForm" role="form">
                        
                        <div class="col-md-6">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>属性名称:
                            </label>
                            <div class="controls col-md-9">
                                <input type="hidden" class="form-control input-sm" v-model="data.pcraCatId">
                                <input type="text" class="form-control input-sm" v-model="data.pcaName" placeholder="请输入属性名称">
                            </div>
                        </div>
    
                        <div class="col-md-6">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required"></span>是否必填
                            </label>
                          
                            <div class="controls col-md-4" >
                                <!-- {{data.pcaRequired}}
                                <input type="checkbox" v-model="data.pcaRequired" v-if="data.pcaRequired-1 " checked  >-->
                                <input type="checkbox" v-model="data.pcaRequired"  ><br>
                            </div>
                        </div>
					
                        <div class="col-md-6" >
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>是否默认展示</label>
                            <div class="controls col-md-4">
                                <!--{{data.pcaSaleProp}} -->
                                    <input type="checkbox"  v-model="data.pcaSaleProp"  />
                            </div>
                        </div>
                        
						<div class="col-md-6">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>备注:
                            </label>
                            <div class="controls col-md-9">
                                <input type="text" class="form-control input-sm" v-model="data.pcaMemo" placeholder="请输入备注">
                            </div>
                        </div>
						
						<div class="form-group">
                            <label class="col-sm-3 control-label">
                                <span class="required"></span>*属性类型：</label>
						<!-- pcaAtrrType -->
                         <div class="controls col-md-6">
                                <select v-model="data.pcaInputType" class="type">
                                    <option value="0">请选择</option>
                                    <option v-for="item in inputtypesList" :value="item.key">{{item.keyValue}}</option>
                                </select>
                           </div>     
                        <!-- 标签选择 -->
                     <!--  <button type="button" class="btn btn-xs blue" @click.stop="showAttrOption(itemobj)">编辑属性值</button> -->
                </div>
            </div>
            <span slot="btnList">
                <button type="button" class="btn blue" @click="submitInfo">保存</button>
                <button type="button" class="btn default" data-dismiss="modal">取消</button>
            </span>
        </m-alert>
      <!--   <attr-option-control v-if="!destroyControlDialog" :idp="ide" :show="!showDialog" :onhide="hideAddDialog"></attr-option-control> -->

        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
        <div style="position:fixed;z-index:111111;" v-show="picShowOption.show">
            <select-pic v-show="picShowOption.show" :options="picShowOption" :onselect="selectPicFunc" :oncancel="cancelSelect"></select-pic>
        </div>
      
        <loading :show="isLoading"></loading>
        <!-- 标签选择弹窗 -->
        <tag-tree v-if="showTagTreeSelect" :list="tagsList" :onselect="selectTagFunc" :oncancel="showTagDialog"></tag-tree>

    </div>
</template>

<script>
import client from '../../common/utils/client';
import tagTree from '../common/tagTree';
import { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList } from '../../components';
import loading from '../common/loading';
import { showSelectPic, getSelectPicList } from '../../vuex/actions/actions.resource';

export default {
    components: { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList, tagTree, loading },
    props: {
        show: {
            type: Boolean,
            value: false
        },
        onhide: {
            type: Function,
            value: () => { }
        },
        selectedid: {
            type: String,
            value: 0
        },
        pcaid:{
            type: String,
            value: 0
        }
    },
    data() {
        return {
            pcaInputType:0,
            isLoading: false,
            showDialog: false,
            showPage: false,
            showPainListSelect: true,
            //获取属性类型
            inputtypesList:[],
            componentShowOption: {},
            data: {
                "pcraCatId":0,
                "pcaName": "",
                "pcaRequired":0,
                "pcaSaleProp": 0,
                "pcaMemo": "",
                "pcaInputType":""
            },
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '添加分类属性',
           
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
     
         // 获取属性类型列表
        getinputtypeList() {
            client.postData(PCA_INPUTTYPES, {}).then(data => {
                if (data.code == 200) {
                    
                    let list = data.data;
                    console.log(list);
                    this.inputtypesList = list;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
            })
        },
        // 选择属性类型回调
        selectinputtypesFunc(list) {
            let types = [];
            list.forEach((item) => {
                types.push(item.id);
            })
            this.typeListSelect = types;
            if (this.typeListSelect.length != 0) {
                this.searchOptions.types = this.typeListSelect;
            } else {
                this.searchOptions.types = [];
            }
            this.setOptions();
        },
        setOptions() {
            let options = this.searchOptions;
             if (options.types && options.types.length == 0) {
                delete options.types;
            }
        },
        // 弹出选择标签弹窗
        showTagDialog() {
            this.showTagTreeSelect = !this.showTagTreeSelect;
        },
        //  showAttrOption(itemobj){
        //     this.showDialog=false;
           
        //     this.pcaId = itemobj.pcaId;
        //      console.log(this.pcaId);
        // },
        // 选择组件回调
        selectComponentFunc(list) {
            if (list[0].componentType == 27 || list[0].componentType == 15 || list[0].componentType == 13) {
                this.contentSelect = list[0].subtitle;
            } else {
                this.contentSelect = list[0].title;
            }
            this.data.subComponentId = list[0].componentId;
            this.showComponent = false;
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
            this.showAlert = false;
        },
        clearInfo() {
            this.data = {
                "pcaName": "",
                "pcaRequired": 0,
                "pcaSaleProp": "",
                "pcaMemo": "",
                "pcaInputType":0
            }
           
           // this.getPainList();
        },
        // 提交信息
        submitInfo() {
            let data =  this.data;
            if (this.data.pcaName.replace(/\s/g, '') == '' || this.data.pcaName.length > 30) {
                this.showMsg('请输入属性名称(1~30字)');
                return;
            }
            if(data.pcaRequired ){
                data.pcaRequired=1
            }else{
                data.pcaRequired=0
            }
            if(data.pcaSaleProp){
                data.pcaSaleProp=1
            }else{
                data.pcaSaleProp=0     
            }
            
          //添加选项
            let url = PCA_CREATE;

            if (this.pcaid!= '') {
                //alert(this.pcaid);
                url = PCA_EDIT+ '?pcaId=' + this.pcaid;
                data.pcaId = this.pcaid;
            } 
            this.isLoading = true;
            data.pcraCatId=this.selectedid;
            client.postData(url, data).then(response => {
                this.isLoading = false;
                if (response.code != 200) {
                    this.showMsg(response.msg);
                } else {
                    if (this.pcaid != '') {
                        this.onhide('update');
                    } else {
                        this.onhide('create');
                    }
                }
            }, response => {
                this.isLoading = false;
                this.showMsg('网络连接错误');
            })
        }
    },
    created() {
        this.data.pcraCatId= this.selectedid
        this.getinputtypeList();
    },
    watch: {
        show() {
            this.showPage = this.show;
            this.showDialog = this.show;
        },
        pcaid() {
            this.data = {
                "selectedid":"",
                "pcaName": "",
                "pcaRequired":0,      
                "pcaSaleProp":0,                     
                "pcaMemo": "",
                "pcaInputType":0
            }
          
            if (this.pcaid == '') {
                this.tagsList = [];
                this.title = '添加分类属性';
                setTimeout(() => {
                    this.typesList = client.global.componentTypes;
                }, 30)
                return;
            }
            this.title = '编辑分类属性';
            this.isLoading = true;
            client.postData(PCA_GET_ID + '?pcaId=' + this.pcaid, {}).then(response => {
                this.isLoading = false;
                if (response.code == 200) {
                   // let data = response.data;
                   let data = response.data;
                    this.data.pcraCatId =data.selectedid;
                    this.data.pcaName = data.pcaName;
                    this.data.pcaSaleProp = data.pcaSaleProp;
                    this.data.pcaRequired = data.pcaRequired;
                    this.data.pcaMemo = data.pcaMemo;
                    this.data.pcaInputType=data.pcaInputType;
                   
                } else {
                    this.showMsg(response.msg);
                }
            }, data => {
                this.isLoading = false;
                this.showMsg('网络连接错误');
            })
        }
    },
    ready() {
       // this.typesList = client.global.componentTypes;
    },
    beforeDestroy() {
    }
};
</script>