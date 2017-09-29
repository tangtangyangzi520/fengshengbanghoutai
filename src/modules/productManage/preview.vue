<template>
    <div style="position: absolute;top:0;left:0;width:95%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'300px'">
            <div slot="content" >
                <div class="row" style="background-color:#F0F0F0">
                   <div style="text-align:center;background-color:white">
                       <img style="height:260px" :src="banner">
                          <h5 ><font size=3 style="float:left">{{ spuName}}</font></h5>
                <br>
                    <h4 style="color:red;margin-left:-1%">
                              <strong style="float:left" v-if="minSalePrice == maxSalePrice">￥{{ minSalePrice }}</strong>
                              <strong style="float:left" v-else>￥{{minSalePrice+ "~" + maxSalePrice}}</strong></h4> 
                <br>
                <hr style="color:#909090">
                        <div style="margin-top:3%;margin-bottom:3%">
                            <font style="color:DimGray">
                                 <span style="float:left">运费：{{ spuFreight }}</span> 
                                 <span v-for="a in 3">&nbsp;</span> 剩余：{{ totalStockNum }}
                            </font>
                        </div>
               <hr style="color:DimGray">
                        <div style="margin-top:4%;margin-bottom:4%">
                              <font style="color:black">满150块包邮</font>
                        </div>
               <hr style="color:DimGray">
                       </div>
                         <br>
                      <div style="text-align:center;background-color:white">
               <hr style="color:DimGray">
                        <div style="margin-top:4%;margin-bottom:4%">
                             丰盛榜健康商城
                                <a style="color:#909090;float:right">
                                    进入店铺 
                                       <span v-for="a in 2">&nbsp;</span> &gt;
                                </a>
                        </div>
             
               <hr style="color:DimGray">
          
                     <div style="margin-top:4%;margin-bottom:4%">
                            <h5 style="color:#909090">
                                企业认证  <span v-for="a in 8">&nbsp;</span>担保交易
                            </h5>
                     </div>
               <hr style="color:DimGray"></div>
                 <br>
                    <div   id="img" style="text-align:center;background-color:white" > 
                          <span  v-for=" a in imgs ">
                              <img class="images" :src="a.url"  style=" width: 270px ; height:260px"/>
                         </span>
                &nbsp;
                <hr style="color:DimGray">
                   <div style="margin-top:4%;margin-bottom:4%">
                         <a style="display:block;color:#909090;margin-left:1.5%;text-decoration:none">
                         <font size="4">划线价格说明</font> <span v-for="a in 25">&nbsp;</span>  &gt;</a>
                   </div>
                <hr style="color:DimGray">   
            </div>
        </div>
    
</div>
               <span slot="btnList" >
               <!--  <button type="button" class="btn default" data-dismiss="modal">上一步</button> -->
               <!--  <button type="button" class="btn yellow-crusta" data-dismiss="modal">上架</button>
                <button type="button" class="btn green-meadow" @click="submitInfo">下架</button>  -->
                <!--  <button type="button" class="btn purple" @click="submitInfo">预览</button>  -->
                 <!--  <button type="button" class="btn blue" @click="save">保存</button>  -->
                  <button type="button" v-if="showimg" class="btn default" @click="hideDialog()" >重新编辑</button>
                  <button type="button" v-else class="btn default" @click="hideDialog()" >关闭</button>

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
    </div>
</template>

<script>

import client from '../../common/utils/client';
import tagTree from '../common/tagTree';
import { selectPic, mAlert, mSelect, mMultiSelect, itemList } from '../../components';
import { showSelectPic, getSelectPicList } from '../../vuex/actions/actions.resource';//上传图片插件

export default {
    components: { selectPic, tagTree, mAlert, mSelect, mMultiSelect, itemList },
    props: {
        imgflag:false,
        pflag:false,
        pspuid:0,
        imgs:[],
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
            showimg:true,
            spuName :'',
            maxSalePrice :0,
            minSalePrice :0,
            totalStockNum :0,
            spuFreight :'',
            banner:'',
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
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '预览',
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
            this.showDialog = false;
            setTimeout(() => {
                this.showPage = false;
                this.onhide('cancel');
            }, 300)
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
            this.getPainList();
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
    getPainList() {
            this.showPainListSelect = true;
            client.postData(PAIN_TREE, {}).then(data => {
                if (data.code == 200) {
                    let list = data.data.root.children;
                    for (let i = 0; i < list.length; i++) {
                        list[i].name = list[i].text;
                    }
                    this.painList = list;
                    this.showPainListSelect = true;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
            })
        },
    created() {
        /*this.getPainList();*/
         //this.getbrandList();
    },
    watch: {
        imgflag() {
             this.imgs = []
             this.imgList= []
             this.showimg = false
             client.postData( PSR_GETDETAILS_BY_ID + "?spuId="+this.pspuid, {}).then(data => {  //192.168.4.249
                   
                   for(let i = 0;i < data.length ;i++){
                       this.imgList.push({
                              "id": data[i].psrResourceId,
                              "url": data[i].psrResourceUrl,
                       })
                   }
                   this.imgs = this.imgList
            }, data => {
                this.isLoading = false;
            })
        },
        pspuid() {
             client.postData(  APP_SPU_GET_ONE +"?spuId=" + this.pspuid , {}).then(data => {
                if (data.code == 200) {
                    //alert("新增成功")
                    this.banner =  data.data.bannerList[0].psrResourceUrl
                    this.spuName = data.data.spuName
                    this.maxSalePrice = data.data.maxSalePrice
                    this.minSalePrice = data.data.minSalePrice
                    this.totalStockNum = data.data.totalStockNum
                    this.spuFreight = data.data.spuFreight
                    this.title = "预览:" + data.data.spuName 
                   
                }
            }, data => {
                this.showMsg("spu获取失败");
                //alert("spu获取失败")
             })
        },
        imgList( val ) {
            if( val == [] ){
               return
            }
             $("#img").show()
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
                this.getPainList();
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
                        })
                        this.data.painIds = data.painIds;
                    }
                    data.tags.forEach(item => {
                        item.id = item.tagId;
                        item.text = item.tagName;
                    })
                    this.tagsList = data.tags;
                    this.getPainList();
                    this.data.title = data.title;
                    this.data.subtitle = data.subtitle;
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
        this.typesList = client.global.componentTypes;
        this.showPainListSelect = true;

    },
    beforeDestroy() {
        this.showPainListSelect = false;
    }
};
</script>
<style lang="less" scoped>
a{
     text-decoration:none
}
</style>