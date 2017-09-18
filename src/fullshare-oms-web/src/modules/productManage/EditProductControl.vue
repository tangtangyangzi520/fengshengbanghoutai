<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1000px'" >
            <div slot="content">
                <div class="row" style="background-color:#F0F0F0">
                    <form class="form-horizontal" name="addForm" role="form">
    
                       <br> <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>商品名称：
                            </label>
                            <div class="controls col-md-4">
                                <input type="text" class="form-control input-sm" v-model="request.spuName" placeholder="" maxLength="50">
                            </div>
                        </div>
    
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                商品广告词：
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="request.spuAd" placeholder="" maxLength="50">
                            </div>
                        </div>
                         
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span> 有赞商品地址：
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="request.spuShareUrl" placeholder="100字以内" maxLength="100">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>品牌：
                            </label>
                            <div class="col-md-3">
                                <select class="form-control" v-model="request.spuBrandId">
                                     <option value="-1">请选择</option>
                                     <option v-for="item in brandList" :value="item.pbdBrandId">{{item.pbdName}}</option>
                                 </select>
                                <!-- <m-select :data="brandList" :placeholder="'请选择内容'" :change-func="selectTagStatusFunc" :class="'fixedIcon'"></m-select> -->
                            </div>
                        </div>

                         <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                商品关键词：
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="request.spuKeyword" placeholder="关键词之间用空格隔开" maxLength="50">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                商品简介：
                            </label>
                            <div class="controls col-md-7">
                                <textarea class="form-control input-sm" v-model="request.spuPcSummary" placeholder="选填，微信分享给好友时会显示这里的文案" maxLength="50">
                                </textarea> 
                            </div>
                        </div>
                       
                        <div class="form-group" style="padding-top:10px;">
                            <label class="col-sm-3 control-label">
                                <span class="required">* </span>展示类目：</label>
                            <div class="controls col-md-9" style="padding-top:8px;">
                                <item-list :list="tagsList" :remove="removeTagItem"></item-list>
                                <a class="btn-select-label" @click="showTagDialog">
                                    <i class="fa fa-plus" style="position:relative;"></i> 添加标签
                                </a>
                            </div>
                        </div>
                        <div class="form-group" style="padding-top:10px;">
                            <label class="col-sm-3 control-label">
                                <span class="required">* </span>适用人群：</label>
                            <div class="controls col-md-9" style="padding-top:8px;">
                                <item-list :list="personList" :remove="removeperItem"></item-list>
                                <a class="btn-select-label" @click="showperDialog">
                                    <i class="fa fa-plus" style="position:relative;"></i> 添加标签
                                </a>
                            </div>
                        </div>
                        <div class="form-group" style="padding-top:10px;">
                            <label class="col-sm-3 control-label">
                                <span class="required">* </span>内容标签：</label>
                            <div class="controls col-md-9" style="padding-top:8px;">
                                <item-list :list="neirongList" :remove="removeneiItem"></item-list>
                                <a class="btn-select-label" @click="showneiDialog">
                                    <i class="fa fa-plus" style="position:relative;"></i> 添加标签
                                </a>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                上榜理由：
                            </label>
                            <div class="col-md-4">
                                <select class="form-control" v-model="shangb" size=11 multiple="multiple">
                                     
                                     <option v-for="item in shangbanglist" :value="item.keyValue">{{item.keyValue}}</option>
                                 </select>
                            </div>
                        </div>
                        
    
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                专家观点：
                            </label>
                            <div class="controls col-md-8">
                                <textarea  v-model="request.spuExpertOption" placeholder="30-100个字以内" maxLength="100">
                                </textarea> 
                            </div>
                        </div>
     
                       <h4><strong>图片上传</strong></h4>
                       <div class="" style="padding-bottom:10px;">     
                               
                            <div class="controls " style="text-align:center"> 
                                <span class="required"></span>选择本地图片:        
                                <span style="margin-left:3%">最多上传5张，800*800像素，单张大小不超过1m。仅支持 </span><br>
                                <span style="margin-left:13%">JPG、JPEG、PNG格式。</span>
                            </div>
                        </div>
                        <div style="text-align:center">
                             <table   width="100%" border="1" cellpadding="0" cellspacing="0" style="table-layout: fixed;">  
                             <tbody id="itemList">
                                <tr >
                                   <td  style="height:100px ; width: 25%">
                                   <i class="fa fa-image pick-img" @click="showSelectPicDialog( 1 )" v-if="data.oneUrl==''" style="margin-top: 20px;"></i>
                                <img :src="data.oneUrl" class="cursor" @click="showSelectPicDialog(1 )" height="80" v-else style="pointer:corsor;margin-bottom:-10px;">
                                    </td>
                                     <td  style="height:100px ; width: 25%">
                                   <i class="fa fa-image pick-img" @click="showSelectPicDialog( 2 )" v-if="data.twoUrl==''" style="margin-top: 20px;"></i>
                                <img :src="data.twoUrl" class="cursor" @click="showSelectPicDialog(2 )" height="80" v-else style="pointer:corsor;margin-bottom:-10px;">
                                    </td>
                                     <td  style="height:100px ; width: 25%">
                                   <i class="fa fa-image pick-img" @click="showSelectPicDialog( 3 )" v-if="data.threeUrl==''" style="margin-top: 20px;"></i>
                                <img :src="data.threeUrl" class="cursor" @click="showSelectPicDialog(3 )" height="80" v-else style="pointer:corsor;margin-bottom:-10px;">
                                    </td>
                                     <td  style="height:100px ; width: 25%">
                                   <i class="fa fa-image pick-img" @click="showSelectPicDialog( 4 )" v-if="data.fourUrl==''" style="margin-top: 20px;"></i>
                                <img :src="data.fourUrl" class="cursor" @click="showSelectPicDialog(4 )" height="80" v-else style="pointer:corsor;margin-bottom:-10px;">
                                    </td>
                                     <td  style="height:100px ; width: 25%">
                                   <i class="fa fa-image pick-img" @click="showSelectPicDialog( 5 )" v-if="data.fiveUrl==''" style="margin-top: 20px;"></i>
                                <img :src="data.fiveUrl" class="cursor" @click="showSelectPicDialog(5 )" height="80" v-else style="pointer:corsor;margin-bottom:-10px;">
                                    </td>
                                   
                                </tr>
                             </tbody>
                        </table>        
                        </div>
    <br><hr style="height:1px;border:none;border-top:1px solid white;" /><br>

                          <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>运费设置：
                            </label>
                         <div class="controls col-md-5">
                              <div class="col-md-4" style="margin-top:2%">
                                <input type="radio" name="yunfei" v-model="yunfei" value="0" checked >统一邮费
                              </div>
                              <h4 class="col-md-1">￥</h4>
                              <div class="col-sm-5" >
                                  <input type="number" class="form-control input-sm" v-model="request.spuFreight" placeholder="0.00" max="999"  min="0"/></div>
                              <br><br><br>
                              <div class="col-md-4" >
                                 <input type="radio" name="yunfei" v-model="yunfei" value="1">运费模板</div>
                                 <div class="col-md-6">
                                 <select class="form-control" v-model="request.spuCarriageId">
                                     <option value="-1">请选择</option>
                                     <option v-for="item in carriageList" :value="item.pcId">{{item.pcName}}</option>
                                 </select>
                                 </div>
                          </div>
                        </div>

                         <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                参与消保类型：
                            </label>
                            <div class="controls col-md-4" id="selects" >
                               <span  class="insu" v-for="data in insurancelist">
                                <input type="checkbox"   :value="data.keyValue+','+data.dictionnaryId+','+data.sortNo" style="width:16px;height:16px;margin-right:2px">&nbsp;&nbsp;{{ data.keyValue }}<br>
                                </span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                包装清单：<br><font color="#A8A8A8">200字以内</font>
                            </label>
                            <div class="controls col-md-7">
                                <textarea  v-model="request.spuPackingList" placeholder="200字以内" maxLength="200">
                                </textarea> 
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                开始时间：
                            </label>
                            <span v-if="spuShelvesStatus == 1">
                             <div class="controls col-md-6"><h4>{{uptime|filterTime}}</h4></div>
                             </span>
                            <span v-else>
                            <div class="controls col-md-4 ">
                                <span class="radios">
                                <input type="radio" name="startTime" v-model="rad" value="1" checked>立刻                                                              
                                <br>
                                <input type="radio"  name="startTime"  v-model="rad" value="2">设定<br>  
                                </span>
                       <div class="col-md-6 time-box">
                        <input type="text" class="form-control inline-block datePicker" placeholder="选择开始时间" id="createStartTime1" v-model="stime"/>
                                <select  v-model="hour" style="width:90px; height:27px">
                                    <option value="-1">选择小时</option>
                                    <option v-for="item in 24" :value="item">{{item}}时</option>
                                </select>&nbsp;&nbsp;
                                <select v-model="minutes" style="width:90px; height:27px">
                                    <option value="-1">选择分钟</option>
                                    <option v-for="item in 60" :value="item">{{item}}分</option>
                                </select>
                        </div>  
                    </div>
                </span>
                </div>                                                    
                <h4><strong>商品详情图片上传</strong></h4>             
                    <div class="col-md-4" style="padding-bottom:10px;">
                            <!-- <label class="col-sm-4 control-label">
                                <span class="required">* </span>点击编辑图片广告</label> -->
                            <div class="controls col-md-6">
                                <!-- <i class="fa fa-image pick-img" @click="showPicDialog(6)" v-if="data.iconUrl==''" style="margin-top: 20px;"></i> -->
                               <!--  <img :src="img" class="" @click="showPicDialog(6)" height="80" v-else style="pointer:corsor;margin-bottom:-10px;">  -->
                                 <input type="button" sytle="width=100px;height=100px" @click="showPicDialog(6)" height="80" value="点击编辑图片广告" />
                            </div>
                        </div>
                        <br><br>
                        <br>
                <div   id="img" style="text-align:center" v-for=" a in imgList "> 
                 
                 <img class="images" :src="a.url "    style=" width: 400px ; height:300px"/><br>
                 
            </div>
                    </form>
                </div>
            </div>
            <span slot="btnList">
                <button type="button" class="btn blue" @click="addItem()">编辑保存</button>
                <button type="button" class="btn default" @click="hideDialog()" >取消</button>
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
            <!-- <select-component-all v-show="showComponent" :options="componentShowOption" :onselect="selectComponentFunc" :oncancel="cancelSelectComponent"></select-component-all>  -->
        </div>
        <!-- <loading :show="isLoading"></loading> -->
        <!-- 标签选择弹窗 -->
         <tag-tree v-if="showTagTreeSelect" :list="tagsList" :onselect="selectTagFunc" :oncancel="showTagDialog"   :type="0"></tag-tree>
         <tag-tree v-if="showperTreeSelect" :list="personList" :onselect="selectPerFunc" :oncancel="showperDialog" :type="3"></tag-tree>
        <tag-tree v-if="showneiTreeSelect" :list="neirongList" :onselect="selectNeiFunc" :oncancel="showneiDialog" :type="1"></tag-tree>
        
        </div>
    </div>
</template>
<script>
import client from '../../common/utils/client';
import tagTree from '../common/tagTree';
import templateControl from './templateControl';
import { selectPic, mAlert, mSelect, mMultiSelect, itemList ,selectComponentAll} from '../../components';
import { showSelectPic, getSelectPicList } from '../../vuex/actions/actions.resource';//上传图片插件
export default {
    components: { selectPic, tagTree, mAlert, mSelect, mMultiSelect, itemList ,templateControl ,selectComponentAll},
    props: {
        spuid: 0,
        proflag: true,
        
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
        }
    },
    data() {
        return {
            spuShelvesStatus:0,
            uptime:'',
            rad:1,
            img:"http://img1.fshtop.com/1502701860183.jpg",
            imgList:[],
            singleimgList:[],
            product:{},
            request:{
                "spuCarriageId":-1,//运费模板id
                "spuType": 1,
                "spuShareUrl":'',
                "spuPic": '',
                "spuId":0,
                "spuAppSummary": "",
                "spuPcSummary": "",
                "spuName": "",
                "spuCatId": -1,
                "spuKeyword":"",
                "spuAd":"",
                "spuBrandId" : -1,
                "pcrList":[],
                "spuExpertOption":"",//专家观点
                "spuFreight":"", //运费
                "spuPackingList":"",//包装清单
                "piList" : [],//消保集合
                "spuPlanShelvesDate":"",//上架时间
                "resourceList": [],//图片集合
                "tagList":[],//标签集合
                "detailsList": []
            },
            carriageList:[],//运费模板
            yunfei:0,       //0:统一邮费  1:运费模板
            hour : -1,
            minutes : -1,
            stime :"",
            insurancelist: [],
            shangb :[],
            shangbanglist: [],
            sxlist: [],
            xssxList:[],
            idnum:0,
            destroyControlDialog: false, //注销良言操作弹框
             expertEditId: '',
             showAddDialog: false,
            brandList:[],
            isLoading: false,
            showDialog: false,
            showPage: false,
            showPainListSelect: true,
            painIdsSelect: [],
            painList: [],
            data: {
                "componentType": 16,
                "subtitle": "",
                "title": "",
                "authorName": "",
                "authorTitle": "",
                "authorType": 2,
                "oneUrl": "",
                "description": "",
                "halfFigure": "",
                "iconId": null,
                "twoUrl": "",
                "threeUrl": "",
                "fourUrl": "",
                "fiveUrl": "",
                "painIds": [],
                "painOptions": [],
                "iconUrl": "http://img1.fshtop.com/1502701860183.jpg",
            },
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '编辑基本信息',
            neirongList:[],
            personList:[],
            tagsList: [],             //选择的标签
            showTagTreeSelect: false, //显示标签选择弹窗
            showperTreeSelect: false,//
            showneiTreeSelect: false,
        }
    },
    vuex: {
        getters: {
            picShowOption: ({ resourceControl }) => resourceControl.picShowOption,
            selectPicList: ({ resourceControl }) => resourceControl.selectPicList,
        },
        actions: { showSelectPic, getSelectPicList }
    },
    filters: {
        filterTime(time) {
            return client.formateTime(time);
        }
    },
    methods: {
        //增加属性选项
        addsxxx( event ) {
            let el = event.currentTarget;
            //console.log( $(el).siblings(".addsxxx"))
            let f =  $(el).parent()
            f.append("<input type='checkbox' class='input' value='1' > <input type='text' style ='width: 5%; height:100%''  placeholder=''>&nbsp;&nbsp;没有合适的？可以自己输入。 ")
            //$(el).prev().add("<input type='checkbox' class='input' value='1' > <input type='text' style ='width: 5%; height:100%''  placeholder=''> ")
        },
        //显示选择多图片
        showPicDialog(type) {
            this.showSelectPic({ name: 'bannerPic', show: true, storeType: 4, single: false });
            this.selectPicType = type;
        },
        // 显示选择图片
        showSelectPicDialog(type) {
            this.showSelectPic({ name: 'bannerPic', show: true, storeType: 4, single: true });
            if (type == 2) {
                this.selectPicType = 2;
            } else if (type == 3) {
                this.selectPicType = 3;
            }else if (type == 4) {
                this.selectPicType = 4;
            }else if (type == 5) {
                this.selectPicType = 5;
            }else if (type == 1) {
                this.selectPicType = 1;
            }
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
        // 选择图片文件回调
        selectPicFunc(list) {
            // alert(0);
            console.log(list);
           // alert(this.singleimgList.length)
            //alert(0);
            if (this.selectPicType == 2) {
                this.singleimgList[1] = {"psrBlock": 1, "psrResourceUrl":  list[0].url,"psrSortNo": 2, "psrType": 1,"psrResourceId":list[0].id } 
                this.data.twoUrl = list[0].url;
            } else if (this.selectPicType == 3) {
                 this.singleimgList[2] = {"psrBlock": 1, "psrResourceUrl":  list[0].url,"psrSortNo": 3, "psrType": 1,"psrResourceId":list[0].id} 
                this.data.threeUrl = list[0].url;
            }else if (this.selectPicType == 4) {
                 this.singleimgList[3] = {"psrBlock": 1, "psrResourceUrl":  list[0].url,"psrSortNo": 4, "psrType": 1,"psrResourceId":list[0].id} 
                this.data.fourUrl = list[0].url;
            }else if (this.selectPicType == 5) {
                 this.singleimgList[4] = {"psrBlock": 1, "psrResourceUrl":  list[0].url,"psrSortNo": 5, "psrType": 1,"psrResourceId":list[0].id} 
                this.data.fiveUrl = list[0].url;
            }else if (this.selectPicType == 1)  {
                 this.singleimgList[0] = {"psrBlock": 1, "psrResourceUrl":  list[0].url,"psrSortNo": 1, "psrType": 1,"psrResourceId":list[0].id} 
                 this.data.oneUrl = list[0].url;
                  this.request.spuPic = list[0].url
            }else if (this.selectPicType == 6)  {
                 this.imgList = []
                 this.imgList = list
            }
            this.showSelectPic({ show: false });
        },
        //删除基本属性
        closeProperty(event) { 
            let el = event.currentTarget;
           if( $(el).parent().parent().parent().hasClass("baseSx") ){
               if( confirm( "确定删除该属性?")){
                   $(el).parent().parent().parent().remove()     
               }      
           }else{
                   $(el).parent().parent().parent().remove()  
           }
           if(  $("#base div[id!=\"0\"]").length == 0 ){
                  this.xssxList = []; 
                  $("#table").hide()
                  $("#div1").show()
           }
        },
        //删除新增销售属性
        closexssx(event) {
                //alert(1)
                  let el = event.currentTarget;
                   $(el).parent().remove()  
           
           if(  $("#base div[id!=\"0\"]").length == 0 ){
                  this.xssxList = []; 
                  $("#table").hide()
                  $("#div1").show()
           }

        },
        //删除spu列
        close(event) { 
            let el = event.currentTarget;
             $(el).parent().parent().children("td").remove()  
           },
         addProperty(){ 
             if( $("#base div[id!=\"0\"]").length > 3 )  {
                this.showMsg("销售属性总数最多4组!");
                  return
             }
             var el = $("#0").clone(true,true).attr("id",++this.idnum).show()//append("<a class=\"delete\" href=\"javascript:closeProperty()\">×</a>").show()

             el.prependTo($("#base"))
             $("#div1").hide()    
             $(".box2 .delete").on("click",this.closexssx)        
         },

    addItem() {

         if( this.request.spuName == '' ){
                this.showMsg("请输入商品名称")
                return
            }
        if( this.request.spuName.length >= 50 ){
                this.showMsg("商品名称不能超过50字")
                return
            }
              
            if( this.request.spuAd.length >= 50 ){
                this.showMsg("商品广告词不能超过50字")
                return
            }
            if( this.request.spuKeyword.length >= 50 ){
                this.showMsg("商品关键词不能超过50字")
                return
            }
           /* if( this.request.spuShareUrl.length >= 100 ){
                this.showMsg("有赞商品地址不能超过100字")
                return
            }*/
            /*if( this.request.spuPcSummary.length >= 50 ){
                this.showMsg("商品简介不能超过50字")
                return
            }*/
            if( this.request.spuExpertOption.length > 0 && this.request.spuExpertOption.length < 30 ){
                this.showMsg("专家观点不能少于30字")
                return
            }
            if( this.request.spuExpertOption.length >= 100 ){
                this.showMsg("专家观点不能超过100字")
                return
            }
            if( this. request.spuPackingList.length >= 200 ){
                this.showMsg("包装清单不能超过200字")
                return
            }

        this.request.spuId = this.spuid
        this.request.spuAppSummary = this.request.spuPcSummary
      if(this.request.spuBrandId < 0 ){
        this.showMsg("请选择品牌")
        return
      }
       this.request.tagList = []
      //类目标签
     /* if( this.tagsList.length == 0){
            this.showMsg("请选择展示类目标签")
            return
      }*/
        this.tagsList.forEach((per,index)=>{
             this.request.tagList.push( { "prpTagType": 100 ,"prpTagId": per.id ,"prpTagName": per.text ,"prpSort": per.sortNum ,"prpSpuId":this.spuid ,"prpSort":index} )
        })
      //人群标签
      /*if( this.personList.length == 0){
            this.showMsg("请选择人群标签")
            return
      }*/
        this.personList.forEach((per,index)=>{
             this.request.tagList.push( { "prpTagType": 300 ,"prpTagId": per.id ,"prpTagName": per.text ,"prpSort": per.sortNum,"prpSpuId":this.spuid ,"prpSort":index} )
        })
      //内容标签
      /*if( this.neirongList.length == 0){
            this.showMsg("请选择内容标签")
            return
      }*/
        this.neirongList.forEach((per,index)=>{
             this.request.tagList.push( { "prpTagType": 201 ,"prpTagId": per.id ,"prpTagName": per.text ,"prpSort": per.sortNum, "prpSpuId":this.spuid ,"prpSort":index} )
        })
      

         //上榜理由
         if(this.shangb.length > 3 ){
            this.showMsg("最多选择3个上榜理由")
            return
         }

       /* if(this.shangb.length == 0 ){
            this.showMsg("请选择上榜理由")
            return
         }*/

        this.shangb.forEach((data,index)=>{
                let val = this.shangbanglist.find(item=>item.keyValue == data)
                this.request.pcrList.$set(index, {"pcrReason": val.keyValue,"pcrSortNo":val.sortNo,"pcrSpuId":this.spuid, }  );
                //data.keyValue+','+data.dictionnaryId+','+data.sortNo"
             })
     
    //保消类型
         let arr = [];
         let sid = this.spuid
        // alert($($(".insu input:checked")).length)
         $(".insu input:checked").each(function(i , v){
             //let ar = {"piInsuranceId": '',"piInsurance":'',"piSort":'', }
               let ar = $(v).val().split(",")
               let av = { "piSpuId": sid, "piInsuranceId": ar[1],"piInsurance":ar[0],"piSort":ar[2], }
               arr.push(av)
         })
        /* if(arr.length == 0 ){
            this.showMsg("请选择消保类型")
            return
         }*/
         console.log(arr)
         this.request.piList = arr 
    //上架时间
      
      if( this.rad == 2 ){
           if( this.hour == -1 || this.minutes == -1 || this.time == ""){
            this.showMsg("请输入上架时间")
            return
           }
           this.request.spuPlanShelvesDate = this.stime//+" "+this.hour+":"+this.minutes
           if( this.hour>= 10 ){
                          this.request.spuPlanShelvesDate += " "+this.hour
                    }else{
                        this.request.spuPlanShelvesDate += " 0"+this.hour
                    }
                    if( this.minutes >= 10 ){
                          this.request.spuPlanShelvesDate += ":"+this.minutes
                    }else{
                        this.request.spuPlanShelvesDate+= ":0"+this.minutes
                    }
      } else {
           this.request.spuPlanShelvesDate = ""
      } 

        //商品图片判空
       
       /* if(this.resourceList.length == 0 ){
            this.showMsg("商品图片至少上传一张")
            return
         }*/
        //详情图片管理
         this.singleimgList.forEach((data,index)=>{
                this.request.resourceList.$set(index, data)
             })

         this.imgList.forEach((data,index)=>{
                this.request.detailsList.$set(index, {
                    
                          "psrBlock": 4,
                          "psrResourceId": data.id,
                          "psrResourceUrl": data.url,
                          "psrSortNo": index,
                          "psrSpuId": this.spuid,
                          "psrType": 3
                     });
             })

            client.postData(  SPU_EDIT , this.request).then(data => {
                if (data.code == 200) {
                    this.showMsg("编辑成功")
                    this.expertEditId = '';
                    this.showAddDialog = true;
                     setTimeout(() => {
                        this.hideDialog()
                    }, 1500)
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.showMsg("编辑失败,请重试");
            })
            
    },
    //获取运费模板
         getCarriageList() {
          client.postData(  PCT_PCLIST , {}).then(data => {
                if (data.code == 200) {
                   this.carriageList = data.data;
                } else {

                    this.showMsg(data.msg);
                }
            }, data => {
                this.showMsg("获取运费模板失败,请刷新重试");
            })
        },
        hideAddDialog(control) {
            this.expertEditId = '';
            this.showAddDialog = false;
            if (control && control == 'create') {
                this.showMsg('保存成功');
            }
            if (control && control == 'update') {
                this.showMsg('更新成功');
            }
            if (control) {
                setTimeout(() => {
                    //移除组件
                    this.destroyControlDialog = true;
                }, 100)
                setTimeout(() => {
                    //重新加入
                    this.destroyControlDialog = false;
                }, 200)
                //this.getList();
            }
        },
        //获取消保类型
        getxbList() { 
        client.postData( SYSTEM_DICTIONARY , {
              "key": "",
              "keyValue": "",
              "page": {
                "currentPage": 0,
                "pageSize": 10,
                "startIndex": 0,
                "totalPage": 0,
                "totalSize": 0
              },
              "parentCode": "product_insurance"
            }).then(data => {
                if (data.code == 200) {
                    this.insurancelist = data.data;
                } else {

                    this.showMsg(data.msg);
                }
            }, data => {
                   this.showMsg("获取消保类型信息失败,请刷新重试");
            })
        },
        //获取上榜 理由
        getshangbangList() { 
        client.postData( SYSTEM_REASON , {}).then(data => {
                if (data.code == 200) {
                    this.shangbanglist = data.data;
                } else {

                    this.showMsg(data.msg);
                }
            }, data => {
                this.showMsg("获取上榜理由信息失败,请刷新重试");
            })
        },
        //获取品牌
        getbrandList() { 
        client.postData(  PBD_GET_LIST  , {
               "page": {
               "currentPage": 0,
               "pageSize": 0,
               "startIndex": 0,
               "totalPage": 0,
               "totalSize": 0
               }}).then(data => {
                if (data.code == 200) {
                    let list = data.data;
                    for (let i = 0; i < list.length; i++) {
                        list[i].name = list[i].pbdName;
                        list[i].id = list[i].pbdId;
                    }
                    this.brandList = list;
                   
                } else {

                    this.showMsg(data.msg);
                }
            }, data => {
                 this.showMsg("获取品牌信息失败,请刷新重试");
            })
        },
        //品牌回调
        selectTagStatusFunc(item) {
            alert(item.id);
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
        showperDialog() {
            this.showperTreeSelect = !this.showperTreeSelect;
        },
        showneiDialog() {
            this.showneiTreeSelect = !this.showneiTreeSelect;
        },
        // 移除某个标签
        removeTagItem(item) {
            let index = this.tagsList.findIndex(subitem => subitem.id == item.id);
            this.tagsList.splice(index, 1);
        },
        removeperItem(item) {
            let index = this.personList.findIndex(subitem => subitem.id == item.id);
            this.personList.splice(index, 1);
        },
        removeneiItem(item) {
            let index = this.neirongList.findIndex(subitem => subitem.id == item.id);
            this.neirongList.splice(index, 1);
        },
        //内容标签回调
        selectNeiFunc(list) {
            /*if( list.length > 3 ){
                alert("标签不能超过3个")
                return
            }*/
            let flag = false 
            this.neirongList = []
            this.data.labelIds = [];
            list.forEach(item => {
                if( item.id.length < 7 ){
                    flag = true
                    return 
                }
                this.data.labelIds.push(item.id);
            })
            if(flag){
                 alert("请选择到最后一级标签。")
               this.data.labelIds = []
               return
            }else{
                this.neirongList = list;
               this.showneiTreeSelect = !this.showneiTreeSelect;
            }
        },
        //人群标签回调
        selectPerFunc(list) {
           /* if( list.length > 3 ){
                alert("标签不能超过3个")
                return
            }*/
            this.personList = [];
            this.personList = list;
            this.data.labelIds = [];
            list.forEach(item => {
                if( item.id.length < 8){

                }
                this.data.labelIds.push(item.id);
            })
            this.showperTreeSelect = !this.showperTreeSelect;
        },
        // 选择标签回调
        selectTagFunc(list) {
            /*if( list.length > 3 ){
                alert("标签不能超过3个")
                return
            }*/
            let flag = false 
            this.tagsList = []
            this.data.labelIds = [];
            list.forEach(item => {
                 if( item.id.length < 10 ){
                    flag = true
                    return 
                }
                this.data.labelIds.push(item.id);
            })
            if(flag){
                alert("请选择到最后一级标签。")
               this.data.labelIds = []
               return
            }else{
               this.tagsList = list;
                this.showTagTreeSelect = !this.showTagTreeSelect;
            }
        },
         selectFunc(list) {
            this.tagsList = []
            this.tagsList = list;
            this.data.labelIds = [];
            list.forEach(item => {
                this.data.labelIds.push(item.prpTagName);
            })
            //this.showTagTreeSelect = !this.showTagTreeSelect;
        },
        hideDialog() {
            //this.par = []
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
                    if (this.id == '') {
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
         this.getxbList()
         this.getshangbangList(); 
         this.getbrandList();
         this.getCarriageList() 
    },
    watch: {
        stime(val) {
            let reg = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/
            if(!reg.test(val)){
                this.showMsg('日期格式不合法')
                this.stime = '' 
            }
        },
        "request.spuFreight":{　　
          　handler(curVal,oldVal){　
            if(curVal > 0 ){
            this.request.spuCarriageId = -1
            //setTimeout(() => {
                this.yunfei = 0　
            //}, 50)　　　　
            }　　　　　　　
            　　　　　　　
          },　　　　　　　　　　
          deep:true　　　　　　　　
        },
        "request.spuCarriageId":{　　
          　handler(curVal,oldVal){　
            if(curVal != -1){　
                this.request.spuFreight = 0　　　　　　　　　
                this.yunfei = 1　
             }　　　　　　　
          },　　　　　　　　　　
          deep:true　　　　　　　　
        },
        proflag(){
                   client.postData( SPU_GET_BY_ID  + "?spuId="+this.spuid, {}).then(data => {  //192.168.4.249
                this.isLoading = false;
                  if (data.code == 200) {
                    //运费模板回显
                    
                    if(data.data.spuCarriageId >0){
                        this.request.spuCarriageId = data.data.spuCarriageId 
                    }else{
                       this.request.spuFreight = data.data.spuFreight
                    }
                    //上架时间回显
                    this.rad = 2
                    var sjtime  = new Date(data.data.spuPlanShelvesDate)
                    this.stime = sjtime.getFullYear() 
                    if( sjtime.getMonth()+1 >= 10 ){
                          this.stime += "-"+(sjtime.getMonth()+1)
                    }else{
                        this.stime += "-0"+(sjtime.getMonth()+1)
                    }
                    if( sjtime.getDate() >= 10 ){
                          this.stime += "-"+sjtime.getDate()
                    }else{
                        this.stime += "-0"+sjtime.getDate()
                    }
                    this.spuShelvesStatus = data.data.spuShelvesStatus
                    this.uptime = data.data.spuOnShelvesTime
                   //this.stime = sjtime.getFullYear() + "-0"+(sjtime.getMonth()+1)+"-"+sjtime.getDate()
                     //alert(stime)
                  
                    this.hour = sjtime.getHours()
                    this.minutes = sjtime.getMinutes()
                    //上榜理由回显
                    for(var i=0;i< data.data.reasonsList.length;i++){
                          this.shangb.push(data.data.reasonsList[i].pcrReason) 
                    }
                    $("#selects span").each(function(index,val){

                        for(var i=0;i< data.data.piList.length;i++){

                          if(data.data.piList[i].piInsurance +','+data.data.piList[i].piInsuranceId+','+data.data.piList[i].piSort == $($(val).children("input")).val()){

                                 $($(val).children("input")).prop("checked","true");  
                          }
                    }
                })
                    this.request.spuShareUrl = data.data.spuShareUrl
                    this.request.spuAppSummary = data.data.spuAppSummary 
                    this.request.spuPcSummary = data.data.spuPcSummary 
                    this.request.spuName = data.data.spuName 
                    this.request.spuCatId = data.data.spuCatId
                    this.request.spuKeyword = data.data.spuKeyword
                    this.request.spuAd = data.data.spuAd
                    this.request.spuBrandId = data.data.spuBrandId
                    this.request.spuExpertOption = data.data.spuExpertOption
                    this.request.spuFreight = data.data.spuFreight
                    this.request.spuPackingList = data.data.spuPackingList
                    this.request.spuPlanShelvesDate = data.data.spuPlanShelvesDate
    
                  //标签回显
                   data.data.tagList.forEach(item=> {
                    if(item.prpTagType == 100){
                        this.tagsList.push(item)
                    }else if( item.prpTagType == 300 ){
                        this.personList.push(item)
                    }else{
                         this.neirongList.push(item)
                    }
                        item.id = item.prpTagId
                        item.text = item.prpTagName
                    })

                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
            })
          //图片回显
            client.postData(  PSR_GETBANNER_BY_ID + "?spuId="+this.spuid, {}).then(data => {  //192.168.4.249
                this.isLoading = false;
                    for(let i=0 ; i< data.length ; i++){
                        if ( i == 1) {
                            this.data.twoUrl = data[i].psrResourceUrl
                        } else if ( i == 2) {
                            this.data.threeUrl = data[i].psrResourceUrl
                        }else if ( i == 3) {
                            this.data.fourUrl = data[i].psrResourceUrl
                        }else if ( i == 4) {
                            this.data.fiveUrl = data[i].psrResourceUrl
                        }else {
                             this.data.oneUrl = data[i].psrResourceUrl
                        }
                        this.request.resourceList.push( {"psrBlock": data[i].psrBlock, "psrResourceUrl": data[i].psrResourceUrl,"psrSortNo": data[i].psrSortNo, "psrType": data[i].psrType,"psrResourceId":data[i].psrResourceId } )
                        //this.showSelectPicDialog(i+1)
                    }
                  // this.showSelectPic({ show: false })
            }, data => {
                this.isLoading = false;
                this.showMsg("获取spu信息失败,请刷新重试");
            })
            //详情图片回显
            client.postData( PSR_GETDETAILS_BY_ID + "?spuId="+this.spuid, {}).then(data => {  //192.168.4.249
                   
                   for(let i = 0;i < data.length ;i++){
                       this.imgList.push({
                              "id": data[i].psrResourceId,
                              "url": data[i].psrResourceUrl,
                       })
                   }
            }, data => {
                this.isLoading = false;
            })
        },
        spuid(val) {
            
        },
        shangb() {
            if(this.shangb.length > 3){
                this.showMsg("最多选择3个理由")
                 $($("#selects span").children("input")).removeAttr("checked") 
                return
            }else{
                 this.request.pcrList.pcrReason = this.shangb 
                 //alert(this.request.pcrList.pcrReason)
            }
               
                
        },
        cflag() {
            
        },
        show() {
            this.showPage = this.show;
            this.showDialog = this.show;
        },
        id() {
            console.log(this.id)
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

        $('#createStartTime1').val('').datetimepicker({ format: 'yyyy-mm-dd', language: 'zh-CN', autoclose: 'true', minView: 2 });
        
    },
    beforeDestroy() {
        this.showPainListSelect = false;
    }
};
</script>
<style lang="less" scoped>
    .box{
        //margin-left: 2%;
        //overflow-x: scroll;
        height: 150px;
        width: 100%;
        //display:inline-block;
        background-color:white;
        border:1px solid #000;
    }
    .box2{
        //margin-left: 2%;
        //overflow-x: scroll;
        height: 120px;
        width: 100%;
        //display:inline-block;
        background-color:white;
        border:1px solid #000;
    }
    .input{
        margin-left: 2%;
        margin-top: 1%;
    }
    .input2{
        margin-left: 2%;
        margin-top: 1%;
        height: 100%;
        width: 80%
    }
    .clo{
  //display: inline-block;
  //margin-top: 0px;
 // margin-right: 0px;
  width: 9px;
  height: 9px;
  //background-repeat: no-repeat !important;
  //text-indent: -10000px;
  outline: none;
  background-image: url("../../../assets/global/img/remove-icon-small.png") !important; }
.tab{
        text-align: center;
        border-collapse: collapse;
    }
    table,table tr th, table tr td { text-align: center; border:1px solid   #A5A552; }
.time-box{
    display:-webkit-box;
    display:-moz-box;
    div{-webkit-box-flex: 1.0;-moz-box-flex: 1.0}
    div:nth-child(2){line-height:34px;width:85px;margin:0 5px;text-align:center}
}
.delete{
    //font-family:"Microsoft Yahei",simSun,Arial;
    font-size:23px;
   /* position: relative;
    left: 65%;
    top: -10%;*/
    float: right;
    margin-right:5%;
    text-decoration:none
}
.delete:hover{
    color:red
}
.dele{
    //font-family:"Microsoft Yahei",simSun,Arial;
    font-size:18px;
   /* position: relative;
    <!-- left: 65%; -->
    top: -10%;*/
    float: right;
    margin-right:5%;
    text-decoration:none
}
.dele:hover{
    color:red
}

</style>