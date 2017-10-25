<template>
<!-- 商品详情图片上传页面 -->
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1000px'">
            <div slot="content">
                <div class="row" style="background-color:#F0F0F0">
                    <form class="form-horizontal" name="addForm" role="form">
                        <!--   
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>品牌：
                            </label>
                            <div class="col-md-4">    
                                <select class="form-control" v-model="firstActive">
                                    <option value="0">请选择一级类目</option>
                                    <option v-for="item in authorList" :value="item.id">{{item.text}}</option>
                                </select><a>刷新</a> | <a>+新建</a>
                            </div>
                        </div> 
                        -->
                        <h1><font style="color:red">{{getspu.msg}}</font></h1>

                        <h4><strong>商品详情图片上传</strong></h4> 
                        <div class="col-md-4" style="padding-bottom:10px;">
                            <input type="button" sytle="width=100px;height=100px" @click="showSelectPicDialog(1)" height="80" value="点击编辑图片广告" />
                        </div>
                        <br><br><br>
                        <div id="img" style="text-align:center; margin-left:30%;" v-for=" (index,a) in imgList ">
                            <item-move :change-up="detailMoveUp.bind(this,index)" :change-down="detailMoveDown.bind(this,index)" :remove-item="detailRemove.bind(this,index)" style="width:400px;" :hidden-left-right=false>
                                <img class="images" :src="a.url" style="height:300px; width:400px;">
                            </item-move><br>
                        </div>

                        <!-- <div   id="img" style="text-align:center" v-for=" a in imgList "> 
                            <img class="images" :src="a.url"    style=" width: 400px ; height:300px"/><br>
                        </div> -->
                    </form>
                </div>
            </div>
            <span slot="btnList">
                <!--  <button type="button" class="btn default" data-dismiss="modal">上一步</button> -->
                <!--  <button type="button" class="btn yellow-crusta" data-dismiss="modal">上架</button>
                <button type="button" class="btn green-meadow" @click="submitInfo">下架</button>  -->
                <!--  <button type="button" class="btn purple" @click="submitInfo">预览</button>  -->
                    <button type="button" class="btn blue" @click="save">保存</button> 
                    <button type="button" class="btn green" @click="up()" >上架</button>
                    <button type="button" class="btn default" @click="down()" >下架</button>
                    <button type="button" class="btn yellow-crusta" @click="preview()">预览</button> 
            </span>
        </m-alert>
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
        <div class="loading" style="position:fixed;z-index:11111;" v-if="isLoading">
            <div class="page-spinner-bar">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
            </div>
        </div>
        <div style="position:fixed;z-index:111111;" v-show="picShowOption.show">
            <select-pic v-show="picShowOption.show" :options="picShowOption" :onselect="selectPicFunc" :oncancel="cancelSelect"></select-pic>
        </div>
        <div style="position:fixed;z-index:11111;" v-show="showComponent">
            <!-- <select-component-all v-show="showComponent" :options="componentShowOption" :onselect="selectComponentFunc" :oncancel="cancelSelectComponent"></select-component-all> -->
        </div>
        <!-- 标签选择弹窗 -->
        <tag-tree v-if="showTagTreeSelect" :list="tagsList" :onselect="selectTagFunc" :oncancel="showTagDialog"></tag-tree>
        <preview v-if="!destroyControlDialog" :id="expertEditId" :show="showAddDialog"  :onhide="hideDialog2" :imgs="imgList"  :pspuid="getspu.id" :pflag="tflag"></preview> 
    </div>
</template>

<script>
import preview from './preview';
import client from '../../common/utils/client';
import itemMove from '../../components/page/itemMove';
import tagTree from '../common/tagTree';
import { selectPic, mAlert, mSelect, mMultiSelect, itemList } from '../../components';
import { showSelectPic, getSelectPicList } from '../../vuex/actions/actions.resource';//上传图片插件

export default {
    components: { selectPic, tagTree, mAlert, mSelect, mMultiSelect, itemList, preview, itemMove },
    props: {
        getspu:{
            "msg":"",
            "id":0,
        },
        par:{      
            type: Array,
            default: function () {
            return []  }
        },
        show: {
            type: Boolean,
            value: false
        },
        onhide: {
            type: Function,
            value: () => { }
        },
        id: {
            type: String,
            value: 0
        },
        closeparent: {
            type: Function,
            default: () => { }
        }
    },
    data() {
        return {
            tflag:false,
            psrRequestList: {"spuId":'', "psrList":[] },
            img:"http://img1.fshtop.com/1502701860183.jpg",
            imgList:[],
            brandList:[],
            isLoading: false,
            showDialog: false,
            showPage: false,
            showPainListSelect: true,
            painIdsSelect: [],
            painList: [],
            data: {
                "componentType": 16,
                "painIds": [],
                "subtitle": "",
                "title": "",
                "authorName": "",
                "authorTitle": "",
                "authorType": 2,
                "bgUrl": "",
                "description": "",
                "halfFigure": "",
                "iconId": null,
                "iconUrl": "http://img1.fshtop.com/1502701860183.jpg",
                "painIds": [],
                "painOptions": []
            },
            showAddDialog:false,
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '编辑商品详情',
            tagsList: [],             //选择的标签
            showTagTreeSelect: false, //显示标签选择弹窗
            selectPicType: 1,//区分头像,半身图还是背景(默认1专家头像)
            searchOptions: {
                zt : "1",//状态
                title: '',
                spuCode:'',
                spuName: '',
                subtitle: '',
                creators: [],
                //experts: [],
                pains: [],
                deployStatus: -1,
                createStartTime: '',
                createEndTime: '',
                modifyedStartTime: '',
                modifyedEndTime: '',
                skuChannels: [],
                submitStatus: -1,
                temflag:false,
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    startIndex: 0,
                    totalPage: 0,
                    totalSize: 0
                }
            }
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
        // 详情图片上移
        detailMoveUp(index){
            if(this.imgList.length > 1){
                // 图片向上移动一位,即点中移动的图片和前一张图片交换位置
                let temp = {};
                if(index != 0){
                    temp = this.imgList[index];
                    this.imgList.$set(index,this.imgList[index-1]);
                    this.imgList.$set(index-1,temp);
                }else{
                    // 如果点击的是第一张图片,则与最后一张交换
                    temp = this.imgList[index];
                    this.imgList.$set(index,this.imgList[this.imgList.length-1]);
                    this.imgList.$set(this.imgList.length-1,temp);
                }
            }
        },
        // 详情图片下移
        detailMoveDown(index){
            if(this.imgList.length > 1){
                // 图片向下移动一位,即点中移动的图片和后一张图片交换位置
                let temp = {};
                if(index != (this.imgList.length-1)){
                    temp = this.imgList[index];
                    this.imgList.$set(index,this.imgList[index+1]);
                    this.imgList.$set(index+1,temp);
                }else{
                    // 如果点击的是最后一张图片,则与第一张交换
                    temp = this.imgList[index];
                    this.imgList.$set(index,this.imgList[0]);
                    this.imgList.$set(0,temp);
                }
            }
        },
        // 详情图片删除
        detailRemove(index){
            this.imgList.splice(index,1);
        },
        up() {
            if(this.temflag){
                this.showMsg("点击过于频繁");
                return;
            }
            this.temflag = true;
            setTimeout(()=>{
                this.temflag = false;
            },5000);
            client.postData( SPU_EDIT_UP_DOWN ,  { "ids": [this.getspu.id], "spuShelvesStatus": 1 }).then(data => {
                if (data.code == 200) {
                    this.showMsg("上架成功");
                }else {
                    this.showMsg(data.msg);
                }}, data => {
                this.temflag = false;
                this.showMsg("上架失败,请重试");
            });
        },
        down() {
            if(this.temflag){
                this.showMsg("点击过于频繁");
                return;
            }
            this.temflag = true;
            setTimeout(()=>{
                this.temflag = false;
            },5000);
            client.postData( SPU_EDIT_UP_DOWN ,  { "ids": [this.getspu.id], "spuShelvesStatus": 0 }).then(data => {
                if (data.code == 200) {
                    this.showMsg("下架成功");
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.temflag = false;
                this.showMsg("下架失败,请重试");
            });
        },
        preview() {
            this.tflag = !this.tflag;
            this.showAddDialog = true;
        },
        save() {
            if(this.temflag){
                this.showMsg("点击过于频繁");
                return;
            }
            this.temflag = true;
            setTimeout(()=>{
                this.temflag = false;
            },5000);
            this.imgList.forEach((data,index)=>{
                this.psrRequestList.psrList.push( {
                        "psrBlock": 4,
                        "psrResourceId": data.id,
                        "psrResourceUrl": data.url,
                        "psrSortNo": index,
                        "psrSpuId": this.getspu.id,
                        "psrType": 3
                    } 
                )
            });
            this.psrRequestList.spuId = this.getspu.id;

            client.postData(  PSR_CREATE , this.psrRequestList).then(data => {
                if (data.code == 200) {
                    //alert("新增成功")
                    this.showMsg("新增详情成功");
                    setTimeout(() => {
                        this.hideDialog();
                    }, 1500)
                    //this.expertEditId = '';
                    //this.showAddDialog = true;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                 this.temflag = false;
                this.showMsg("新增详情失败");
             });
        },
        // 隐藏选择资源弹窗
        cancelSelect() {
            this.showSelectPic({ show: false });
        },
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
        // 显示选择图片
        showSelectPicDialog(type) {
            this.showSelectPic({ name: 'bannerPic', show: true, storeType: 4, single: false });
            if (type == 2) {
                this.selectPicType = 2;
            } else if (type == 3) {
                this.selectPicType = 3;
            }
        },
        // 选择图片文件回调
        selectPicFunc(list) {
            //console.log(list);
            if (this.selectPicType == 2) {
                this.data.halfFigure = list[0].url;
            } else if (this.selectPicType == 3) {
                this.data.bgUrl = list[0].url;
            } else {
                this.data.iconUrl = list[0].url;
            }
            this.showSelectPic({ show: false });
            for(let i=0; i<list.length; i++){
                this.imgList.push(list[i]);
            }
        },
        //品牌回调
        selectTagStatusFunc(item) {
            //alert(item.id);
            if (item == '') {
                this.searchOptions.existTag = '';
            } else {
                this.searchOptions.existTag = item.id === 0 ? false : true;
            }
            this.setOptions();
        },
        // 弹出选择标签弹窗
        showTagDialog() {
            this.showTagTreeSelect = !this.showTagTreeSelect;
        },
        // 移除某个标签
        removeTagItem(item) {
            let index = this.tagsList.findIndex(subitem => subitem.id == item.id);
            this.tagsList.splice(index, 1);
        },
        // 选择标签回调
        selectTagFunc(list) {
            this.tagsList = list;
            this.data.labelIds = [];
            list.forEach(item => {
                this.data.labelIds.push(item.id);
            })
            this.showTagTreeSelect = !this.showTagTreeSelect;
        },
        hideDialog() {
            this.closeparent()
            this.showDialog = false;
            setTimeout(() => {
                this.showPage = false;
                this.onhide();
            }, 300);
        },
        hideDialog2() {
            //this.showDialog = false;
            //this.showPage = false;
           this.showAddDialog = false;
        },
        selectPainFunc(list) {
            let arr = [];
            list.forEach(item => {
                arr.push(item.id);
            })
            this.painIdsSelect = arr;
            this.data.painIds = arr;
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
                "componentType": 16,
                "painIds": [],
                "subtitle": "",
                "title": ""
            }
            this.painIdsSelect = [];
        },
        // 提交信息
        submitInfo() {
            let data = this.data;
            if (data.title.replace(/\s/g, '') == '' || data.title.length > 30) {
                this.showMsg('请输入良言标题(1~30字)');
                return;
            }
            if (data.subtitle.replace(/\s/g, '') == '' || data.subtitle.length > 70) {
                this.showMsg('请输入良言文案(1~70字)');
                return;
            }
            if (this.tagsList.length == 0) {
                this.showMsg('请选择标签');
                return;
            }
            data.labelIds = [];
            this.tagsList.forEach(item => {
                data.labelIds.push(item.id);
            })
            let url = COMPONENT_ADD;
            if (this.id != '') {
                url = COMPONENT_EDIT;
                data.componentId = this.id;
            }
            this.isLoading = true;
            client.postData(url, data).then(response => {
                this.isLoading = false;
                if (response.code != 200) {
                    this.showMsg(response.msg);
                } else {
                    this.showPainListSelect = false;
                    if (this.id != '') {
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
        /*this.getPainList();*/
        //this.getbrandList();
    },
    watch: {
        imgList( val ) {
            if( val == [] ){
               return;
            }
            $("#img").show();
         },
        show() {
            this.showPage = this.show;
            this.showDialog = this.show;
        },
        id() {
            this.data = {
                "componentType": 16,
                "painIds": [],
                "subtitle": "",
                "title": ""
            }
            this.painList = [];
            this.painIdsSelect = [];
            if (this.id == '') {
                this.title = '编辑基本信息';
                this.tagsList = [];
                setTimeout(() => {
                    this.typesList = client.global.componentTypes;
                }, 30)
                return;
            }
            this.title = '编辑基本信息';
            this.isLoading = true;
            this.painList = [];

            client.postData(COMPONENT_GETWITHPAINS + '?componentId=' + this.id, {}).then(response => {
                this.isLoading = false;
                if (response.code == 200) {
                    let data = response.data;
                    if (data.painIds) {
                        data.painIds.forEach(item => {
                            this.painIdsSelect.push({ id: item, name: '' })
                        });
                        this.data.painIds = data.painIds;
                    }
                    data.tags.forEach(item => {
                        item.id = item.tagId;
                        item.text = item.tagName;
                    });
                    this.tagsList = data.tags;
                    this.data.title = data.title;
                    this.data.subtitle = data.subtitle;
                } else {
                    this.showMsg(response.msg);
                }
            }, data => {
                this.isLoading = false;
                this.showMsg('网络连接错误');
            });
        }
    },
    ready() {
        this.typesList = client.global.componentTypes;
        this.showPainListSelect = true;
    },
    beforeDestroy() {
        this.showPainListSelect = false;
    }
};
</script>
