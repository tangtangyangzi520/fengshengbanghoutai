<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1000px'" >
            <div slot="content">
                <div class="row" style="background-color:#F0F0F0">
                    <form class="form-horizontal" name="addForm" role="form">
                        <div class="form-group">
                            <label for="title" class="col-md-3 control-label">
                                商品类目： 
                            </label>
                            <label for="title" class="col-sm-5 control-label">
                                 <span style="float:left">{{leimu}}</span>  
                            </label>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>商品类型：
                            </label>
                            <div class="controls col-md-4" style="margin-top:1%">
                                <input type="radio" name="leixing" v-model="request.spuCountryType" value="1" checked >国内&nbsp;&nbsp;&nbsp;&nbsp;
                                <input type="radio" name="leixing" v-model="request.spuCountryType" value="2" >跨境
                            </div>
                        </div>

                        <div class="form-group">
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
                       <!--  <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                商品简介：
                            </label>
                            <div class="controls col-md-7">
                                <textarea class="form-control input-sm" v-model="request.spuPcSummary" placeholder="选填，微信分享给好友时会显示这里的文案" maxLength="50">
                                </textarea> 
                            </div>
                        </div> -->
                       
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
                            <div class="col-md-4" style="background-color:white;width:600px;" >
                               <!--  <select class="form-control" v-model="shangb" size=11 multiple="multiple">
                                     
                                     <option v-for="item in shangbanglist" :value="item.keyValue">{{item.keyValue}}</option>
                                 </select> -->
                                
                                  <div  style="display:inline-block;width:280px;margin-top:2%" v-for="(index,item) in shangbanglist">
                                  <input type="checkbox" name="shangbang" v-model="shangb" :value="item.keyValue" @click="shangbang($event)"/>{{item.keyValue}}
                                  <br v-if="(index+1) % 2 == 0">
                                </div>
                                <br>
                            </div> 
                             <div class="col-md-11" >
                                    <span v-for="(index,i) in createshangbanglist">
                                        <span v-for="ii in 58">&nbsp;</span>
                                        <input type="text" style="display:inline-block;width:40%" v-model="i.pcrReason" @keyup="checkshangb(i)" maxLength="100"/>
                                        <span v-if="index == createshangbanglist.length-1"><a @click="createshangbang()"  >+添加理由</a>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <a v-if="index > 0" @click="deleteshangbang(index)">-删除理由</a><br><br>
                                    </span>
                                    <span v-for="i in 58">&nbsp;</span><span style="color:red">注：最多可选择3个理由</span>
                                </div>
                        </div>
                        
    
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                专家观点：
                            </label>
                            <div class="controls col-md-8">
                                <textarea  v-model="request.spuExpertOption" placeholder="30-100个字以内" maxLength="100" cols="50" rows="3">
                                </textarea> 
                            </div>
                        </div>

                         <hr style="height:1px;border:none;border-top:1px solid white;" />   
                      <div class="form-group" v-for="radios in radioList">
                            <label for="title" class="col-sm-3 control-label">
                              <span class="required" v-if="radios.pcaRequired == 1">* </span> {{radios.pcaName}}：
                            </label>
                            <div class="controls col-md-4" style="margin-top:1%">
                              <span v-for="radio in radios.pcaoList">
                                <input type="radio" :name="radios.pcaName" v-model="radios.pcaCreator" :value="radio" >{{radio.pcaoName}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              </span>
                            </div>
                        </div>

                        <div class="form-group" v-for="boxs in boxList">
                            <label for="title" class="col-sm-3 control-label">
                              <span class="required" v-if="boxs.pcaRequired == 1">* </span> {{boxs.pcaName}}：
                            </label>
                            <div class="controls col-md-4" style="margin-top:1%">
                              <span v-for="box in boxs.pcaoList">
                                <input type="checkbox" :name="radios.pcaName" v-model="box.checked"  >{{box.pcaoName}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              </span>
                            </div>
                        </div>

                         <div class="form-group" v-for="selects in selectList">
                            <label for="title" class="col-sm-3 control-label">
                              <span class="required" v-if="selects.pcaRequired == 1">* </span> {{selects.pcaName}}：
                            </label>
                            <div class="controls col-md-3" style="margin-top:1%">
                                   <select  v-model="selects.pcaCreator" >
                                     <option value="-1" >请选择</option>
                                     <option v-for="select in selects.pcaoList" :value="select">{{select.pcaoName}}</option>
                                   </select>
                            </div>
                        </div>

                         <div class="form-group" v-for="inputs in inputList">
                            <label for="title" class="col-sm-3 control-label">
                               <span class="required" v-if="inputs.pcaRequired == 1">* </span>{{inputs.pcaName}}：
                            </label>
                            <div class="controls col-md-6" style="margin-top:1%">
                                <input type="text" class="form-control input-sm" v-model="inputs.pcaCreator"  maxLength="50">
                            </div>
                        </div>

                         <div class="form-group" v-for="text in textList">
                            <label for="title" class="col-sm-3 control-label">
                               <span class="required" v-if="text.pcaRequired == 1">* </span>{{text.pcaName}}：
                            </label>
                            <div class="controls col-md-8" style="margin-top:1%">
                                 <textarea rows="3" cols="50" v-model="text.pcaCreator" placeholder="100字以内" maxLength="100">
                                </textarea> 
                            </div>
                        </div>

         <hr style="height:1px;border:none;border-top:1px solid white;" /><br>    
     
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
                                  <input type="number" class="form-control input-sm" v-model="request.spuFreight" placeholder="0.00" max="999"  min="0"
                                  @keyup="check($event)" @change="check($event)"/></div>
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
                               <span  class="insuedit" v-for="data in insurancelist">
                                <input type="checkbox"   :value="data.keyValue+','+data.dictionnaryId+','+data.sortNo+','+data.description" style="width:16px;height:16px;margin-right:2px" @click="insurance($event)">&nbsp;&nbsp;{{ data.keyValue }}<br>
                                </span>
                                <div style="background-color:white;border: 1px solid black;width:340px"><br>
                                  <span v-for="(index,i) in createinsurancelist">
                                    &nbsp;&nbsp;&nbsp;&nbsp;类型<input type="text" style="display:inline-block" v-model="i.keyValue" @keyup="checkinsurance(i,1)"
                                    maxLength="50"/> <br>
                                    &nbsp;&nbsp;&nbsp;&nbsp;描述<input type="text" style="display:inline-block" v-model="i.description" @keyup="checkinsurance(i,2)"
                                    maxLength="100"/>
                                    <span v-if="index == createinsurancelist.length-1"><a @click="createinsurance()"  >+添加</a>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    <a v-if="index > 0" @click="deleteinsurance(index)">-删除</a><br><br>
                                  </span>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                包装清单：<br><font color="#A8A8A8">200字以内</font>
                            </label>
                            <div class="controls col-md-7">
                                <textarea rows="3" cols="50" v-model="request.spuPackingList" placeholder="200字以内" maxLength="200">
                                </textarea> 
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="title" class="col-sm-5 control-label">
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
                       <div class="col-md-9 time-box" id="selecttime1" style="display:none">
                        <input type="text" class="form-control inline-block datePicker" placeholder="选择开始时间" id="createStartTime1" v-model="stime"/>
                               <!--  <select  v-model="hour" style="width:90px; height:27px">
                                    <option value="-1">选择小时</option>
                                    <option v-for="item in 24" :value="item">{{item}}时</option>
                                </select>&nbsp;&nbsp;
                                <select v-model="minutes" style="width:90px; height:27px">
                                    <option value="-1">选择分钟</option>
                                    <option v-for="item in 60" :value="item">{{item}}分</option>
                                </select> -->
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
            leimu:"",//类目信息
            radioList:[], //通用属性集合  单选
            boxList:[], //通用属性集合    多选
            selectList:[], //通用属性集合 选择
            inputList:[], //通用属性集合  单行文本
            textList:[], //通用属性集合   多行文本
            spuShelvesStatus:0,
            uptime:'',
            rad:1,
            img:"http://img1.fshtop.com/1502701860183.jpg",
            imgList:[],
            singleimgList:[],
            product:{},
            request:{
                "spuCountryType":1,
                "spuCarriageId":-1,//运费模板id
                "spuType": 1,
                "spuShareUrl":'',
                "spuPic": '',
                "spuId":0,
                "spuAppSummary": "",
                //"spuPcSummary": "",
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
            createshangbanglist:[{"pcrReason": "",}],
            createinsurancelist:[{"keyValue":"","description":""}],
            carriageList:[],//运费模板
            yunfei:0,       //0:统一邮费  1:运费模板
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
      //整数校验
         check(event){
               let el = event.currentTarget;
                $(el).val(Math.abs($(el).val()))
               $(el).val(Math.round($(el).val()))
               var reg = /^-?\d{0,10}$/
               let s = $(el).val()+""
              let f = !reg.test(s)
            if (  f ) {
                   this.showMsg("请输入整数")
                   //$(el).val(s.substring(0,s.length-1))
                    $(el).val("")
               }
        },
        //填写消保类型校验
        checkinsurance(val,num){
            let count = 0;
            if(num ==1){
               if($.trim(val.description) == "" ){
                   this.createinsurancelist.forEach(data=>{
                   if($.trim(data.description) != "" || $.trim(data.keyValue) != ""){
                      count++
                      } 
                   })
                   if( $(".insuedit input:checked").length + count > 5 ){
                      val.keyValue = ""
                      this.showMsg("消保类型新增和库中勾选的总和不得超过5条!")
                   }
               }
            }else{
               if($.trim(val.keyValue) == "" ){
                   this.createinsurancelist.forEach(data=>{
                   if($.trim(data.description) != "" || $.trim(data.keyValue) != ""){
                      count++
                      } 
                   })
                   if( $(".insuedit input:checked").length + count > 5 ){
                      val.description = ""
                      this.showMsg("消保类型新增和库中勾选的总和不得超过5条!")
                   }
                }
            }
        },
        //填写上榜理由校验
        checkshangb(val){
          let count = 0;
           this.createshangbanglist.forEach(data=>{
               if($.trim(data.pcrReason)){
                  count++
               } 
           })
           if(this.shangb.length + count > 3 ){
              val.pcrReason = ""
              this.showMsg("上榜理由新增和理由库中勾选的总和不得超过3条!")
           }
        },
        //勾选消保类型校验
        insurance(event){
             let el = event.currentTarget;
             if( this.createinsurancelist.length ==1  ){
                if( $.trim(this.createinsurancelist[0].keyValue) != "" || $.trim(this.createinsurancelist[0].description) != ""){
                   if( $(".insuedit input:checked").length + this.createinsurancelist.length > 5){
                      if($(el).is(':checked')){
                         $(el).removeAttr("checked")
                         this.showMsg("消保类型新增和库中勾选的总和不得超过5条!")
                         return
                      }
                  }
                }
             }else if( this.createinsurancelist.length > 1  ){
                 if( $(".insuedit input:checked").length + this.createinsurancelist.length > 5){
                   if($(el).is(':checked')){
                    $(el).removeAttr("checked")
                    this.showMsg("消保类型新增和库中勾选的总和不得超过5条!")
                    return
                    }
                 }
             }    
               if($(".insuedit input:checked").length > 5){
                 if($(el).is(':checked')){
                    $(el).removeAttr("checked")
                    this.showMsg("消保类型新增和库中勾选的总和不得超过5条!")
                  }
                }
        },
        //删除自定义上榜理由
        deleteshangbang(index){
            this.createshangbanglist.splice(index)
        },
        //添加上榜理由
        createshangbang(){
            if( this.shangb.length >= 3){
              this.showMsg("上榜理由新增和理由库中勾选的总和不得超过3条!")
              return
            }
            if( this.shangb.length + this.createshangbanglist.length >= 3){
              this.showMsg("上榜理由新增和理由库中勾选的总和不得超过3条!")
              return
            }
            this.createshangbanglist.push({"pcrReason": "",})
        },
        //删除自定义消保类型
        deleteinsurance(index){
            this.createinsurancelist.splice(index)
        },
        //添加消保类型
        createinsurance(){
            if(  $(".insuedit input:checked").length  >= 5){
              this.showMsg("消保类型新增和库中勾选的总和不得超过5条!")
              return
            }
            if( $(".insuedit input:checked").length + this.createinsurancelist.length >= 5){
              this.showMsg("消保类型新增和库中勾选的总和不得超过5条!")
              return
            }
            this.createinsurancelist.push({"keyValue":"","description":""})
        },
        //勾选上榜理由时校验
      shangbang(event){
         let el = event.currentTarget;
         if( this.createshangbanglist.length ==1  ){
            if( $.trim(this.createshangbanglist[0].pcrReason) != ""){
               if( this.shangb.length + this.createshangbanglist.length >= 3){
                 if($(el).is(':checked')){
                    $(el).removeAttr("checked")
                    this.showMsg("上榜理由新增和理由库中勾选的总和不得超过3条!")
                    return
                }
              }
            }
         }else if( this.createshangbanglist.length > 1  ){
             if( this.shangb.length + this.createshangbanglist.length >= 3){
              if($(el).is(':checked')){
                $(el).removeAttr("checked")
                this.showMsg("上榜理由新增和理由库中勾选的总和不得超过3条!")
                return
                }
             }
         }    
           if(this.shangb.length >= 3){
             if($(el).is(':checked')){
                $(el).removeAttr("checked")
                this.showMsg("上榜理由新增和理由库中勾选的总和不得超过3条!")
              }
            }
      },
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
        addItem() {

            if( $.trim(this.request.spuName)  == '' ){
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
            if( $.trim(this.request.spuShareUrl) == '' ){
                this.showMsg("请输入有赞商品地址")
                return
            }
            if( this.request.spuShareUrl.length >= 100 ){
                this.showMsg("有赞商品地址不能超过100字")
                return
            }
            if(this.request.spuBrandId < 0 ){
                this.showMsg("请选择品牌")
                return
            }
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
        //this.request.spuAppSummary = this.request.spuPcSummary
     
       this.request.tagList = []
      //类目标签
     if( this.tagsList.length == 0){
            this.showMsg("请选择展示类目标签")
            return
      }
        this.tagsList.forEach((per,index)=>{
             this.request.tagList.push( { "prpTagType": 100 ,"prpTagId": per.id ,"prpTagName": per.text ,"prpSort": per.sortNum ,"prpSpuId":this.spuid ,"prpSort":index} )
        })
      //人群标签
      if( this.personList.length == 0){
            this.showMsg("请选择人群标签")
            return
      }
        this.personList.forEach((per,index)=>{
             this.request.tagList.push( { "prpTagType": 300 ,"prpTagId": per.id ,"prpTagName": per.text ,"prpSort": per.sortNum,"prpSpuId":this.spuid ,"prpSort":index} )
        })
      //内容标签
      if( this.neirongList.length == 0){
            this.showMsg("请选择内容标签")
            return
      }
        this.neirongList.forEach((per,index)=>{
             this.request.tagList.push( { "prpTagType": 201 ,"prpTagId": per.id ,"prpTagName": per.text ,"prpSort": per.sortNum, "prpSpuId":this.spuid ,"prpSort":index} )
        })
      
     //上榜理由
            this.request.pcrList = []
            if(this.shangb.length > 3 ){
                this.showMsg("最多选择3个上榜理由")
                return
             }
            this.shangb.forEach((data,index)=>{
                    let val = this.shangbanglist.find(item=>item.keyValue == data)
                    if(val != null){
                      this.request.pcrList.push( {"pcrReason": val.keyValue,"pcrSortNo":val.sortNo,"pcrSpuId":val.dictionnaryId, }  );
                    }
                    //data.keyValue+','+data.dictionnaryId+','+data.sortNo"
                 })
             this.createshangbanglist.forEach(data=>{
                   if( $.trim(data.pcrReason) ){
                      this.request.pcrList.push({"pcrReason": $.trim(data.pcrReason),"pcrSortNo":-1,})
                   }
              })
             if(this.request.pcrList.length > 3){
                  this.showMsg("最多选择3个上榜理由")
                  return
             }
     
         //保消类型
         let arr = [];
          
         $(".insuedit input:checked").each(function(i , v){
             //let ar = {"piInsuranceId": '',"piInsurance":'',"piSort":'', }
               let ar = $(v).val().split(",")
               let av = {"piInsuranceId": ar[1],"piInsurance":ar[0],"piSort":ar[2],"piDesc":ar[3], }//
               arr.push(av)
         })
          this.createinsurancelist.forEach(data=>{
               if($.trim(data.keyValue) && $.trim(data.description) ){
                   let av = {"piInsurance":$.trim(data.keyValue),"piDesc":$.trim(data.description), }
                   arr.push(av)
               }
          })
           if( arr.length > 5){
              this.showMsg("消保类型新增和库中勾选的总和不得超过5条!")
              return
            }
          this.request.piList = arr 
          //邮费

          if(this.yunfei == 0 && $.trim(this.request.spuFreight) == ''){
             this.showMsg("请设置统一邮费的价格")
             return
        }
        if(this.yunfei ==1 && this.request.spuCarriageId ==-1){
             this.showMsg("请选择运费模板")
             return
        }
        if(this.yunfei == 0){
           this.request.spuCarriageId = -1
        }else{
          this.request.spuFreight = -1
        }
    //上架时间
      if( this.rad == 2 ){
           if( this.stime == ""){
            this.showMsg("请输入上架时间")
            return
           }
           if(new Date(this.stime).getTime() - new Date().getTime() < 60000){
                   this.showMsg('上架时间请比现在时间大于1分钟以上')
                   this.stime = ""
                   return
           }    
           this.request.spuPlanShelvesDate = this.stime//
      } else {
           this.request.spuPlanShelvesDate = ""
      } 
        //商品图片判空
        if(this.request.resourceList.length == 0 ){
            this.showMsg("商品图片至少上传一张")
            return
         }
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
                if( item.children != "" ){
                    flag = true
                    return 
                }
                this.data.labelIds.push(item.id);
            })
            if(flag){
                 alert("请选择到最后一级标签。")
               this.data.labelIds = []
               this.neirongList = list;
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
             let flag = false 
            this.personList = [];
            this.data.labelIds = [];
            list.forEach(item => {
              //alert(item.children )
                 if( item.children != "" ){
                    flag = true
                    return 
                }
                this.data.labelIds.push(item.id);
            })
             if(flag){
                alert("请选择到最后一级标签。")
               this.data.labelIds = []
               this.tagsList = list;
               return
            }else{
                this.personList = list;
                this.showperTreeSelect = !this.showperTreeSelect;
            }
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
                 if( item.children != "" ){
                    flag = true
                    return 
                }
                this.data.labelIds.push(item.id);
            })
            if(flag){
                alert("请选择到最后一级标签。")
               this.data.labelIds = []
               this.tagsList = list;
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
       rad(val){
           if(val == 1){
             $("#selecttime1").hide()
           }else{
             $("#selecttime1").show()
           }
        },
        stime(val) {
             if( val ) {
             let reg = /^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s((([0-1][0-9])|(2?[0-3]))\:([0-5]?[0-9])))?$/
              if(!reg.test(val)){
                this.showMsg('日期格式不合法')
                this.stime = "" 
                return
              }
             /*val = val.replace(/-/g,"/")
             let end = new Date(val)
             if(end <= new Date()){
               this.showMsg('上架时间请比现在时间大于1分钟以上')
               this.stime = "" 
               return
               }*/
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
                     //通用属性回显
           /* client.postData( TAG_LIST_GET + "?typeId=100", {}).then(data => {
                if (data.code == 200) {
                    let arr = []
                    data.data.root.children.children.forEach(item=>{
                       item.children.forEach(er=>{
                          er.children.forEach(san=>{
                            if(san.id == data.data.spuCatId){
                              arr.push(item.id)
                              arr.push(er.id)
                              arr.push(san.id)
                            }
                          })
                       })
                    })
             alert(arr)
              client.postData(  GET_ATRR_LIST  , {"parentIds" :arr ,"pcaAtrrType":1}  ).then(data => {
                if (data.code == 200) {
                    data.data.forEach(sx =>{
                      if(sx.pcaInputType==1){
                        sx.pcaCreator = ""
                        this.radioList.push(sx)
                      }else if(sx.pcaInputType==2){
                        sx.pcaoList.forEach(item=>{
                          item.checked = false
                        })
                        this.boxList.push(sx)
                      }else if(sx.pcaInputType==3){
                        sx.pcaCreator = -1
                        this.selectList.push(sx)
                      }else if(sx.pcaInputType==4){
                        sx.pcaCreator = ""
                        this.inputList.push(sx)
                      }else if(sx.pcaInputType==5){
                        sx.pcaCreator = ""
                        this.textList.push(sx)
                      }
                    })
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.showMsg("获取通用属性失败,请刷新重试");
            })
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
              this.showMsg("获取类目失败,请刷新重试");
            })*/
            //类目回显
          client.postData( TAG_LIST_GET + "?typeId=100", {}).then(data => {
                if (data.code == 200) {
                    let arr = []
                    data.data.root.children.forEach(item=>{
                       item.children.forEach(er=>{
                          er.children.forEach(san=>{
                            if(san.id ==  this.request.spuCatId ){
                              this.leimu = item.text+" >"+" "+er.text+" >"+" "+san.text
                          }
                      })
                  })
                })
            }})
                    //消保回显
                    for(var i=0;i< data.data.piList.length;i++){
                         if(data.data.piList[i].piInsuranceId == -1){
                           this.insurancelist.push({"keyValue":data.data.piList[i].piInsurance,
                           "dictionnaryId":data.data.piList[i].piInsuranceId,
                           "sortNo":data.data.piList[i].piSort,
                           "description":data.data.piList[i].piDesc,})//data.keyValue+','+data.dictionnaryId+','+data.sortNo+','+data.description
                         }
                    }
                    setTimeout(()=>{
                       $(data.data.piList).each(function(index,pi){
                         $(".insuedit input").each(function(i,v){
                         if(($(v).val()+'').indexOf(pi.piInsurance+'') >= 0){
                            $(v).prop("checked","true");  
                         }
                      })
                    })
                    },300)
                    
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
                          this.stime += "-"+sjtime.getDate()+" "
                    }else{
                        this.stime += "-0"+sjtime.getDate()+" "
                    }
                    if( sjtime.getHours() >= 10 ){
                         this.stime += ""+sjtime.getHours()+":"
                    }else{
                        this.stime += "0"+sjtime.getHours()+":"
                    }
                    if( sjtime.getMinutes() >= 10 ){
                         this.stime += ""+sjtime.getMinutes()
                    }else{
                        this.stime += "0"+sjtime.getMinutes()
                    }
                    this.spuShelvesStatus = data.data.spuShelvesStatus
                    if(this.spuShelvesStatus == 1){
                      this.rad = 0
                    }
                    this.uptime = data.data.spuOnShelvesTime
                   //this.stime = sjtime.getFullYear() + "-0"+(sjtime.getMonth()+1)+"-"+sjtime.getDate()
                     //alert(stime)
                    //上榜理由回显
                    for(var i=0;i< data.data.reasonsList.length;i++){
                        if(data.data.reasonsList[i].pcrSortNo == -1){
                              this.shangbanglist.push({"keyValue":data.data.reasonsList[i].pcrReason,"pcrSortNo":-1})
                          }
                      }
                    for(var i=0;i< data.data.reasonsList.length;i++){
                          this.shangb.push(data.data.reasonsList[i].pcrReason) 
                    }
                    this.request.spuShareUrl = data.data.spuShareUrl
                    this.request.spuAppSummary = data.data.spuAppSummary 
                    //this.request.spuPcSummary = data.data.spuPcSummary 
                    this.request.spuName = data.data.spuName 
                    this.request.spuCatId = data.data.spuCatId
                    this.request.spuKeyword = data.data.spuKeyword
                    this.request.spuAd = data.data.spuAd
                    this.request.spuBrandId = data.data.spuBrandId
                    this.request.spuExpertOption = data.data.spuExpertOption
                    this.request.spuFreight = data.data.spuFreight
                    this.request.spuPackingList = data.data.spuPackingList
                    this.request.spuPlanShelvesDate = data.data.spuPlanShelvesDate
                    this.request.spuCountryType = data.data.spuCountryType
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
        let dates = $("#createStartTime1");
          dates.datetimepicker({
          dateFormat: "yy-mm-dd",
          timeFormat: 'HH:mm',
          showMonthAfterYear: true,
          changeMonth: true, 
          changeYear: true,
          buttonImageOnly: true,
          stepHour: 1,
          stepMinute: 1,
          closeText: '确定',
          prevText: '&#x3c;上月',
          nextText: '下月&#x3e;',
          currentText: '今天',
          monthNames: ['一月','二月','三月','四月','五月','六月',
          '七月','八月','九月','十月','十一月','十二月'],
          monthNamesShort: ['一','二','三','四','五','六',
          '七','八','九','十','十一','十二'],
          dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
          dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
          dayNamesMin: ['日','一','二','三','四','五','六'],
          weekHeader: '周',
          showAnim:'highlight',
          isClear:true, //是否显示清空 
          isRTL: false,
          onSelect: function(selectedDate){
           //var option = this.id == "createStartTime2" ? "minDate" : "maxDate";
           //dates.not(this).datepicker("option", option, selectedDate );
          },
          onClose: function(data,inst){   
             dates.removeAttr("disabled")
          },
          beforeShow: function(){
             dates.attr("disabled","disabled")
              $(this).datepicker('option', 'minDate', new Date() )
          },
      });
          dates.on("click",function(){
            $(this).attr("disabled","disabled")
          })
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