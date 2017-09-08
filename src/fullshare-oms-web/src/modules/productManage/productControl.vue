<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1000px'" >
            <div slot="content">
                <div class="row" style="background-color:#F0F0F0">
                    <form class="form-horizontal" name="addForm" role="form">
                           <br>
                        <div class="form-group">
                            <label for="title" class="col-md-3 control-label">
                                <span class="required">* </span>商品类目： 
                                      
                            </label>
                            <label for="title" class="col-sm-5 control-label">
                                 <span style="float:left">{{par[0]}}&nbsp;&nbsp;>&nbsp;&nbsp;{{par[1]}}&nbsp;&nbsp;>&nbsp;&nbsp;{{par[2]}}</span>  
                            </label>
                        </div>
    
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>商品名称：
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="request.spuName" placeholder="">
                            </div>
                        </div>
    
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>商品广告词：
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="request.spuAd" placeholder="">
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
                                <span class="required">* </span>商品关键词：
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="request.spuKeyword" placeholder="关键词之间用空格隔开">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                商品简介：
                            </label>
                            <div class="controls col-md-7">
                                <textarea class="form-control input-sm" v-model="request.spuPcSummary" placeholder="选填，微信分享给好友时会显示这里的文案">
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
                                <span class="required">* </span>上榜理由：
                            </label>
                            <div class="col-md-4">
                                <select class="form-control" v-model="shangb" size=11 multiple="multiple">
                                     
                                     <option v-for="item in shangbanglist" :value="item">{{item.keyValue}}</option>
                                 </select>
                            </div>
                        </div>
                        
    
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>专家观点：
                            </label>
                            <div class="controls col-md-8">
                                <textarea class="form-control input-sm" v-model="request.spuExpertOption" placeholder="30-100个字以内">
                                </textarea> 
                            </div>
                        </div>
    
         <hr style="height:1px;border:none;border-top:1px solid white;" /><br>    
          <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                              <button type="button" class="btn purple" @click="reset()">重置基本属性</button> 
                            </label>

                        </div>
<!-- <span style="color:#F00">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* </span><font style="color:#6699CC" size="3">请先移除不需要的属性,再生成SKU组合</font> -->
                     <div   v-for="(v,i) in sxlist"  style ="width: 100%; background-color:white;
                             border:1px solid #F0F0F0;" > 
                        <div class="baseSx"> 
                         <a class="delete2" @click="closeProperty($event)" >×</a>                       
                         <span class="pca" style="margin-left:5%;display:-moz-inline-box;display:inline-block;width:75px;">{{i.pcaName}}
                                  <input :value="i.pcaName" type="hidden" />
                                  <input :value="i.pcaId" type="hidden" />
                                  <input :value="i.pcaSortNo" type="hidden" />
                                  <input :value="i.pcraCatId" type="hidden" />
                                  <input :value="i.pcaMemo" type="hidden" />
                                  <input :value="i.pcaInputType" type="hidden" />
                                  <input :value="i.pcaSaleProp" type="hidden" />
                                  <input :value="i.pcaRequired" type="hidden" />
                         </span> 
                         <span v-for="(ind,s) in i.pcaoList" class="pcao">                      
                                  <input type="checkbox" class="input" :value="s.pcaoName" style="width:16px;height:16px;margin-right:3px"> {{s.pcaoName}}
                                  <input :value="s.pcaoId" type="hidden" />
                                  <input :value="s.pcaoName" type="hidden" />
                                  <input :value="s.pcaoSortNo" type="hidden" />
                                  <input :value="s.pcaoValue" type="hidden" />
                                  <!-- 6个换一行 -->
                                   <a v-if="(ind+1)%8 == 0"><br> <span  style="margin-left:13.8%;color:white">{{i.pcaName}}</span></a>
                         </span>
                           
                            <!-- <span v-for="a in 0">&nbsp;</span> -->
                         <span class="addsxxx" >
                            <input type="checkbox" class="input tianjia" value="1" style="width:16px;height:16px;margin-right:3px"> <input type="text" style ="width: 5%; height:100%"  placeholder=""  @keyup="getcheck($event)">
                            <a class="" style="text-decoration:none" @click="addsxxx($event)" >添加&nbsp;&nbsp;&nbsp;&nbsp;</a>  
                        </span>
                            
                        </div>
                    </div>
 <br><span style="color:#F00">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* </span><font style="color:#6699CC" size="3">还可以添加 2 组，销售属性总数最多4组，SKU组合不能超过600组。</font>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                              <button type="button" class="btn yellow" @click="addProperty()">添加销售属性</button> 
                            </label>

                        </div>
                             
             <hr style="height:1px;border:none;border-top:1px solid white;" /><br>  
                     <div id="div1" class="box">
     <span style="color:#F00">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* </span><font style="color:#6699CC" size="3">只有一个SKU的情况：如需添加销售属性请先生成SKU组合</font>
                        <div class="form-group" >
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>丰盛榜售价：
                            </label>
                            <div class="controls col-md-2">
                               <input type="text" class="form-control input-sm" v-model="sj" placeholder="" @keyup="checkfloat($event)">
                        </div>
                            <label for="title" class="col-sm-2 control-label">
                                <span class="required">* </span>原价：
                            </label>
                            <div class="controls col-md-2">
                               <input type="text" class="form-control input-sm" v-model="yj" placeholder="" @keyup="checkfloat($event)">
                            </div>
                    </div>
                         <div class="form-group">  
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>展示库存（件）：
                            </label>
                            <div class="controls col-md-2">
                               <input type="text" class="form-control input-sm" v-model="kc" placeholder="" @keyup="check($event)">
                            </div>
                            <label for="title" class="col-sm-2 control-label">
                                <span class="required">* </span>ERP库存（件）：
                            </label>
                            <div class="controls col-md-2">
                               <input type="text" class="form-control input-sm" v-model="erpkc" placeholder="" @keyup="check($event)">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>SKU编码：
                            </label>
                            <div class="controls col-md-2">
                               <input type="text" class="form-control input-sm" v-model="skubm" placeholder="">  
                            </div>
                        </div>
                     </div> 
                                  
                   <div id="base">
                        <div id="0" class="box2" style="display:none">
                            <a class="delete"  >×</a>   
                            <input type="text" class="col-md-2 input" placeholder="销售属性名称">
                            <br><br>                           
                            <input type="text" class="col-md-2 input" v-for="i in 10 " placeholder="">
                        </div>
                    </div>
                    <div class="form-group"> 
                        <label for="title" class="col-sm-3 control-label">                         
                             <button type="button" class="btn green" v-on:click="dkej()">生成SKU组合</button>
                        </label>
                    </div>
                    <div >
                        <table id="pltab" border="1" cellspacing="0" cellpadding="0" style="display:none">  
                          
                                <tr style-"text-align: center">
                                   <td style="width:41.8%;border:1px solid white"> <h5 style="color:#6699CC"><strong>批量输入数据</strong></h5></td>
                                   <td style="border:1px solid white;line-height:30px">￥<input class=" input2" type="text"  @keyup="sput($event,'.put0')"  /></td>
                                   <td style="border:1px solid white">￥<input class=" input2" type="text"  @keyup="sput($event,'.put1')" /></td>
                                   <td style="border:1px solid white">  <input class=" input2" type="text"  @keyup="sput($event,'.put2')" /></td>
                                   <td style="border:1px solid white">  <input class=" input2" type="text"  @keyup="ssput($event,'.put3')" /></td>
                                   <td style="border:1px solid white;width:17%">  <input class=" input2" type="text"  @keyup="ssput($event,'.put4')" /></td>
                                </tr>

                            
                        </table>
                        <table class="tab" id="table" style="display:none" border="1" cellspacing="0" cellpadding="0">  
                          <tr>
                             <th>序号</th>
                             <th>SKU组合</th>
                             <th><span style="color:red">*</span>丰盛榜售价</th>
                             <th>原价</th>
                             <th><span style="color:red">*</span>展示库存（件）</th>
                             <th>ERP实际库存</th>
                             <th>SKU编码</th>
                          </tr>
                             <tbody id="itemList" >
                                <tr v-for="(index,group) in xssxList">
                                   <td>{{index+1}}<input class="input2" type="hidden" :value="index+1"/></td>
                                   <td style="width:40%;;line-height:30px"> <a class="dele" @click="close($event,index)" >×</a> {{ group }} <input class="input2" type="hidden" :value="group"/></td>
                                   <td>￥<input class="put0 input2" type="text"  @keyup="checkfloat($event)"/></td>
                                   <td>￥<input class="put1 input2" type="text"  @keyup="checkfloat($event)"/></td>
                                   <td>  <input class="put2 input2" type="text"  @keyup="check($event)"/></td>
                                   <td>  <input class="put3 input2" type="text"  @keyup="check($event)"/></td>
                                   <td style="width:17%">  <input class="put4 input2" type="text"  /></td>
                                </tr>

                             </tbody>
                        </table>
                    </div>

     <br><hr style="height:1px;border:none;border-top:1px solid white;" /><br>
     
                       <h4><strong>图片上传</strong></h4>
                       <div class="" style="padding-bottom:10px;">     
                               
                            <div class="controls " style="text-align:center"> 
                                <span class="required"></span>选择本地图片:        
                               <!--   <i class="fa fa-image pick-img" @click="showSelectPicDialog(1)" v-if="data.iconUrl==''" style="margin-top: 20px;"></i>
                                <img :src="data.iconUrl" class="cursor" @click="showSelectPicDialog(1)" height="80" v-else style="pointer:corsor;margin-bottom:-10px;"><br> -->
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
                            <div class="controls col-md-4">
                                <input type="radio" name="yunfei" v-model="request.spuFreight" value="包邮" checked >包邮&nbsp;&nbsp;&nbsp;&nbsp;
                                
                               
                                 <input type="radio" name="yunfei" v-model="request.spuFreight" value="运费￥10">运费￥10&nbsp;&nbsp;&nbsp;&nbsp;
                                
                               <!--   <select class="form-control" v-model="thirdActive">
                                     <option value="0">请选择</option>
                                     <option v-for="item in chanelList" :value="item.id">{{item.text}}</option>
                                 </select> -->
                            </div>
                        </div>

                        <!--  <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>每人限购：
                            </label>
                            <div class="controls col-md-4">
                                <input type="text" class="form-control input-sm" v-model="data.subtitle" placeholder="请输入良言文案">
                            </div>
                        </div> -->

                         <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>参与消保类型：
                            </label>
                            <div class="controls col-md-4" >
                               <span  class="insu" v-for="data in insurancelist">
                                <input type="checkbox"   :value="data.keyValue+','+data.dictionnaryId+','+data.sortNo" style="width:16px;height:16px;margin-right:3px">&nbsp;&nbsp;{{ data.keyValue }}<br>
                                </span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>包装清单：<br><font color="#A8A8A8">200字以内</font>
                            </label>
                            <div class="controls col-md-7">
                                <textarea class="form-control input-sm" v-model="request.spuPackingList" placeholder="200字以内">
                                </textarea> 
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>开始时间：
                            </label>
                            <div class="controls col-md-4 ">
                                <span class="radios">
                                <input type="radio" name="startTime" v-model="rad" value="1" checked>立刻                                                              
                                <br>
                                <input type="radio"  name="startTime"  v-model="rad" value="2">设定<br>  
                                </span>
                       <div class="col-md-6 time-box">
                        <input type="text" class="form-control inline-block datePicker" placeholder="选择开始时间" v-model="time" id="createStartTime"/>
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
                </div>                                                    
                           
                    </form>
                </div>
            </div>
            <span slot="btnList">
                <button type="button" class="btn blue" @click="addItem()">保存并下一步</button>
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
            <!-- <select-component-all v-show="showComponent" :options="componentShowOption" :onselect="selectComponentFunc" :oncancel="cancelSelectComponent"></select-component-all> -->
        </div>
        <!-- <loading :show="isLoading"></loading> -->
        <!-- 标签选择弹窗 -->
         <tag-tree v-if="showTagTreeSelect" :list="tagsList" :onselect="selectTagFunc" :oncancel="showTagDialog"   :type="0"></tag-tree>
         <tag-tree v-if="showperTreeSelect" :list="personList" :onselect="selectPerFunc" :oncancel="showperDialog" :type="3"></tag-tree>
        <tag-tree v-if="showneiTreeSelect" :list="neirongList" :onselect="selectNeiFunc" :oncancel="showneiDialog" :type="1"></tag-tree>
        <template-control v-if="!destroyControlDialog" :id="expertEditId" :show="showAddDialog" v-bind:par="sele" :onhide="hideAddDialog" :getspu="spu"  :closeparent="hideDialog"></template-control> 
        </div>
    </div>
</template>
<script>
import client from '../../common/utils/client';
import tagTree from '../common/tagTree';
import templateControl from './templateControl';
import { selectPic, mAlert, mSelect, mMultiSelect, itemList } from '../../components';
import { showSelectPic, getSelectPicList } from '../../vuex/actions/actions.resource';//上传图片插件
export default {
    components: { selectPic, tagTree, mAlert, mSelect, mMultiSelect, itemList ,templateControl },
    props: {
        cflag: false,
        par:{      
            type: Array,
            default: []
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
        }
    },
    data() {
        return {
            request:{
              //"spuType": 1,
                "spuPic": '',
                "spuAppSummary": "",
                "spuPcSummary":"",
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
                "skuPlanShelvesDate":"",//上架时间
                "resourceList": [],//图片集合
                "tagList":[],//标签集合
                "skuList":[]
            },
            rad:1,         //上架状态 1:立刻  2:设定
            hour : -1,     //上架时间小时
            minutes : -1,  //上架时间分钟
            time :"",      //上架时间日期 
            insurancelist: [], //CheckBox消保类型集合 
            shangb :[],
            shangbanglist: [],
            sxlist: [],
            img:"http://img1.fshtop.com/1502701860183.jpg",
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
            },
            spuCatId:"",
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
            zhi:[],
            yj:'',
            sj:'',
            kc:'',
            skubm:'',
            erpkc:'',
            spu:{
                "msg":"",
                "id":0,

            }
            /*searchOptions: {
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
            }*/
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
        sput(event,clazz) {
              let el = event.currentTarget;
                var reg = /^-?\d{0,9}\.?\d{0,2}$/
               let s = $(el).val()+""
              let f = !reg.test(s)
            if (  f ) {
                   this.showMsg("请输入数字")
                   $(el).val("")
                   return
               }
              
              $(clazz).val($(el).val())
        },
        ssput(event,clazz) {
              let el = event.currentTarget;
                   var reg = /^-?\d{0,10}$/
               let s = $(el).val()+""
              let f = !reg.test(s)
            if (  f ) {
                   this.showMsg("请输入整数")
                   $(el).val("")
                   return
               }
              
              $(clazz).val($(el).val())
        },
        //输入内容 选中事件
        getcheck(event) {
            let el = event.currentTarget;
            if( $(el).val() != ""){
                 $(el).prev(":checkbox").prop("checked","true")
            }else{
                  $(el).prev(":checkbox").removeAttr("checked")
            }

        },
         //小数校验
        checkfloat(event){
               let el = event.currentTarget;
               var reg = /^-?\d{0,9}\.?\d{0,2}$/
               let s = $(el).val()+""
              let f = !reg.test(s)
            if (  f ) {
                   this.showMsg("请输入数字")
                   //$(el).val(s.substring(0,s.length-1))
                    $(el).val("")
               }
        },
        //整数校验
         check(event){
               let el = event.currentTarget;
               var reg = /^-?\d{0,10}$/
               let s = $(el).val()+""
              let f = !reg.test(s)
            if (  f ) {
                   this.showMsg("请输入整数")
                   //$(el).val(s.substring(0,s.length-1))
                    $(el).val("")
               }
        },
        //重置基本属性
        reset() {
            client.postData(  PCA_GET_BY_CATID + "?parentIds="+this.par[3]+","+this.par[4]+","+this.par[5], {}  ).then(data => {
                if (data.code == 200) {

                    this.sxlist = data.data;
                     this.yj  = ''
                     this.sj  = ''
                     this.kc  = ''
                     this.skubm  = ''
                     this.erpkc  = ''
                     this.xssxList = []
                     $("#table").hide()
                     $("#pltab").hide()
                     $("#div1").show()
                     $("#pltab input:text").val("")
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.showMsg("属性获取失败,请重试")
            })
        },
        //增加属性选项
        addsxxx( event ) {
            let el = event.currentTarget;
            //console.log( $(el).siblings(".addsxxx"))
            if( $( $(el).parent().children("input:text") ).length > 23 ){
                this.showMsg("添加属性不能超过24个")
                return
            }
            let f =  $(el).parent()
            f.append("<input type='checkbox' class='input' value='1' style='width:16px;height:16px;margin-right:3px'> <input type='text' style ='width: 5%; height:100%''  placeholder=''  > &nbsp;&nbsp;&nbsp;&nbsp;")
            $(el).parent().children("input:text").on("keyup",this.getcheck) 
            //$(el).prev().add("<input type='checkbox' class='input' value='1' > <input type='text' style ='width: 5%; height:100%''  placeholder=''> ")
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
        // 选择图片文件回调
        selectPicFunc(list) {
            // alert(0);
            console.log(list);
            //alert(0);
            if (this.selectPicType == 2) {

                this.request.resourceList[1] = {"psrBlock": 1, "psrResourceUrl":  list[0].url,"psrSortNo": 2, "psrType": 1,"psrResourceId":list[0].id } 
                this.data.twoUrl = list[0].url;
            } else if (this.selectPicType == 3) {
                 this.request.resourceList[2] =  {"psrBlock": 1, "psrResourceUrl":  list[0].url,"psrSortNo": 3, "psrType": 1,"psrResourceId":list[0].id} 
                this.data.threeUrl = list[0].url;
            }else if (this.selectPicType == 4) {
                 this.request.resourceList[3] = {"psrBlock": 1, "psrResourceUrl":  list[0].url,"psrSortNo": 4, "psrType": 1,"psrResourceId":list[0].id} 
                this.data.fourUrl = list[0].url;
            }else if (this.selectPicType == 5) {
                 this.request.resourceList[4] =  {"psrBlock": 1, "psrResourceUrl":  list[0].url,"psrSortNo": 5, "psrType": 1,"psrResourceId":list[0].id} 
                this.data.fiveUrl = list[0].url;
            }else {
                 this.request.resourceList[0] = {"psrBlock": 1, "psrResourceUrl":  list[0].url,"psrSortNo": 1, "psrType": 1,"psrResourceId":list[0].id} 
                 this.data.oneUrl = list[0].url;
                 this.request.spuPic = list[0].url
            }
            this.showSelectPic({ show: false });
        },
       multiCartesian (data){  
           var len = data.length;  
           if(len == 0)  
              return [];  
           else if(len == 1)  
              return data[0];  
           else{  
              var r=data[0];  
              for(var i=1;i<len;i++){  
                 r=this.Cartesian(r,data[i]);  
                }  
              return r;  
            }  
        },
        ft(a,b) {  
            if(!(a instanceof Array))  
                 a = [a];  
            var ret = Array.call(null,a);  
            ret.push(b);  
            return ret;  
        },
        Cartesian(a,b){
            var ret=[];  
            for(var i=0;i<a.length;i++){  
               for(var j=0;j<b.length;j++){  
                  ret.push(this.ft(a[i],b[j]));  
                }  
            }  
                return ret;  
        },
        dkej() {
            
             $("#table").hide()
             $("#pltab").hide();
             this.xssxList = []
            let flag = false
            let fla = false
            let msg = ""
            let a = new Array();
            //基本属性的遍历
             $(".baseSx ").each(function(index,val){
                     let arr = new Array()
                     flag = false
                     $(val).children(".pcao").children(":checked").each(function(index,check){
                        arr.push( $(check).val() )
                        flag = true
                     })
                     $(val).children(".addsxxx").children(":checked").each(function(index,check){
                        if( $.trim( $(check).next(":text").val() ) == ""){
                            msg = "添加属性值不能为空"
                            return
                        }
                        arr.push( $(check).next(":text").val() )
                        flag = true
                        msg = ""
                     })
                       if(flag){
                       a.push(arr)
                    }else{
                        if(!fla){
                            fla = true
                        }
                    }
                })
            if(msg != ""){
                     $("#table").hide()
                     $("#pltab").hide()
                     this.xssxList = []
                 this.showMsg(msg)
                 return
             }
             if(fla){
                 //this.showMsg("请先选择基本属性或移除")
                  //$("#table").hide()
                    // $("#pltab").hide()
                     //this.xssxList = []
                 //return
             }
            //销售属性的遍历 及 判空
            let msg2 = ''

           $("#base div[id!=\"0\"]").each(function(index,v){
                     let name = ''
                     let arr = new Array()
                     flag = false
                $(v).children("input").each(function(i,val){

                    if( i == 0 && $.trim( $(val).val() ) == ""){
                        msg2 = "属性名称不能为空!"
                         $("#table").hide()
                         $("#pltab").hide()
                         this.xssxList = []
                        //this.showMsg("温馨提示",'属性名称不能为空');
                        return 
                    }
                    //获取属性名
                    if(i == 0){
                        name = $(val).val()
                    }
                    //遍历属性值存进数组
                    if( i >= 1 && $.trim( $(val).val() ) != ""){
                        arr.push( $(val).val() )
                        flag = true
                    }
                })
                if(flag){
                    for(let n=0 ; n<arr.length-1 ; n++){
                        for(let m =1; m<arr.length ; m++){
                            if(arr[n] == arr[m]){
                                msg2 = " 属性名:"+ name +"->属性值'"+arr[n]+"'已重复!"
                                return 
                            }

                        }
                    }
                    a.push(arr)
                }else{
                    msg2 += "\n属性名:"+ name + "->属性值不能为空!"
                    $("#table").hide()
                     $("#pltab").hide()
                     this.xssxList = []
                    //this.showMsg("温馨提示",'属性值不能为空!');
                    return
                }     
           })
           if( msg2 != ''){
            this.showMsg(msg2)
            return
           }
           // 组合数的判断 ,没超出范围就求笛卡尔积
           if(a.length > 0){
                   let sum = 1
                   $(a).each(function(ind,va){
                        sum *= $(va).length
                   })
               if(sum > 600){
                   this.showMsg("SKU组合不能超过600种! 现在组合数"+sum+"种");
                    $("#table").style.display="none";
                     $("#pltab").style.display="none";
                     this.xssxList = []
                   return 
               }
               this.xssxList = this.multiCartesian(a); 
               $("#table").show()
               $("#pltab").show()
               $("#div1").hide()
            }else{
                   this.showMsg("请先选择商品属性");
                    $("#table").style.display="none";
                     $("#pltab").style.display="none";
                     this.xssxList = []
                 }  
        },
        //删除基本属性
        closeProperty(event) { 
            let el = event.currentTarget;
           if( $(el).parent().hasClass("baseSx") ){
               //if( confirm( "确定删除该属性?")){
                   $(el).parent().remove() 
                   this.xssxList = []; 
                  $("#table").hide()
                  $("#pltab").hide()
              // }      
          // }else{
                   //$(el).parent().remove()  
            }
           /*if(  $("#base div[id!=\"0\"]").length == 0 ){
                  this.xssxList = []; 
                  $("#table").style.display="none";
                     $("#pltab").style.display="none";
                     
                  $("#div1").show()
           }*/
        },
        //删除新增销售属性
        closexssx(event) {
                //alert(1)
                  let el = event.currentTarget;
                   $(el).parent().remove()  
           
          /* if(  $("#base div[id!=\"0\"]").length == 0 ){
                  this.xssxList = []; 
                  $("#table").hide()
                 $("#pltab").hide()
                  $("#div1").show()
           }*/

        },
        //删除spu列
        close(event,index) { 
           // let el = event.currentTarget;
             //$(el).parent().parent().children("td").remove()  
             this.xssxList.splice(index, 1);
           },
         addProperty(){ 
             if( $("#base div[id!=\"0\"]").length > 3 )  {
                this.showMsg("销售属性总数最多4组!");
                  return
             }
             var el = $("#0").clone(true,true).attr("id",++this.idnum).show()
             el.prependTo($("#base"))
             $("#div1").hide()    
             $(".box2 .delete").on("click",this.closexssx)        
         },

         addItem() {

            if( this.request.spuName == '' ){
                this.showMsg("请输入商品名称")
                return
            }
              this.request.spuCatId = this.par[5];
              let item = $("#itemList>tr")
              let spuName  = this.request.spuName
              let spulist = []
              let bname = $("span[class='pca']")
              let base = $(".baseSx")
              let xsval =  $("#base div[id!=\"0\"]")
              let leimuid = this.request.spuCatId 
              let msg = ""

              let yjg = this.yj
              let sjg = this.sj
              let kcs = this.kc
              let skubm2 = this.skubm
              let erpkc2 = this.erpkc

            

         if( $("#div1").is(":visible") &&  $("#table").is( ":hidden") ){ 

                 

                   // alert("单一sku")
                    let msg2 = ""
                    let baseList = []
                    let attrList = [] 
                    let pcaoList = []
                    let skuname = ''
                    //获取每列spu数据         
                   $(base).each(function(d,zc){
                      let flag = true
                       //alert($($(zc).children("span[class='pcao']").children("input:checked")).length)
           // alert($($($(".addsxxx")[d]).children("input:checked")).length)
                      //匹配基本属性
                      if( $($(zc).children("span[class='pcao']").children("input:checked")).length +  $($($(".addsxxx")[d]).children("input:checked")).length > 1 ){
                                   msg2 = "属性名称->"+ $($(bname[d]).children("input:hidden")[0]).val()+":不是单一的sku,请先生成SKU组合"
                                   return
                      }else if($($(zc).children("span[class='pcao']").children("input:checked")).length == 1 && $($($(".addsxxx")[d]).children("input:checked")).length == 0){
                        //alert("基本")
                            let list =  $(zc).children("span[class='pcao']").children("input:checked").siblings("input:hidden")
                             let basesx = { //基本属性对象
                                      "psaoAtrrId": $($(bname[d]).children("input:hidden")[1]).val(), //基本属性ID
                                      "psaoAtrrValue": $($(zc).children("span[class='pcao']").children("input:checked")).val(),  // 选项值  
                                      "psaoOptionId": $(list[0]).val() ,          // 属性值ID
                                      "psaoSortNo": $(list[2]).val(),            // 
                                      "psaoType": 2              //  2 
                                    }
                                baseList.push(basesx)
                                skuname += $($(zc).children("span[class='pcao']").children("input:checked")).val()+","

                      }else if( $($($(".addsxxx")[d]).children("input:checked")).length == 1 && $($(zc).children("span[class='pcao']").children("input:checked")).length == 0){ 
                               //上面不匹配，确定为新增基础属性
                               //alert("添加")
                               if( $.trim($($($(".addsxxx")[d]).children("input:checked").next(":text")).val() ) == "" ){
                                       //alert(1)
                                       msg2 = $($(bname[d]).children("input:hidden")[0]).val()+":添加属性值不能为空"
                                       return false
                               }
                             let newbase =  {
                                      "pcaoAtrrId":  $($(bname[d]).children("input:hidden")[1]).val(),//需要属性id
                                      "pcaoIcon": 0,
                                      "pcaoName": $($($(".addsxxx")[d]).children("input:checked").next(":text")).val(),
                                      "pcaoSortNo": 0,
                                      "pcaoUseFlag": 1,
                                      "pcaoValue": $($($(".addsxxx")[d]).children("input:checked").next(":text")).val(),
                                      "skuOptionList": [
                                        {
                                          "psaoAtrrId": $($(bname[d]).children("input:hidden")[1]).val(),//属性id
                                          "psaoAtrrValue": $($($(".addsxxx")[d]).children("input:checked").next(":text")).val(),
                                          "psaoSortNo": 0,
                                          "psaoType": 2
                                        }
                                      ]
                                    }
                                     pcaoList.push(newbase)
                                      skuname += $($($(".addsxxx")[d]).children("input:checked").next(":text")).val()+","
                            }
                      })

                     if( msg2 != ''){
                        this.showMsg(msg2)
                        return
                     }

                     if(  this.sj == '' ){
                        this.showMsg('请输入丰盛榜售价')
                        return
                    }
                       if( this.yj == '' ){
                        this.showMsg('请输入原价')
                        return
                    }
                      
                      if(  this.kc == '' ){
                        this.showMsg('请输入展示库存')
                        return
                    }
                      if(  this.erpkc == '' ){
                        this.showMsg('请输入ERP库存')
                        return
                    }
                    if(  this.skubm == '' ){
                        this.showMsg('请输入SKU编码')
                        return
                    }
    /*$(xsval).each(function(f,ze){
                    
                    let count = 0
                    let pcaname = ""
                    let pcaval = ""
                    $(ze).children(":text").each(function(g,zf){
                         if( g == 0){
                            pcaname = $(zf).val()
                         }
                         if( count > 1) {
                            msg = "销售属性不唯一,不是单一的sku"
                            return 
                         }
                         if( $.trim( $(zf).val() ) != ""  ){
                             count++    
                             }
                         })

                        let map = {
                                          "optionList": [  //销售属性选项  
                                            {
                                              "pcaoName": $(zf).val(),  //  选项值
                                              "pcaoSortNo": g,       // 排序号
                                              "pcaoValue": $(zf).val(), //  选项值
                                             
                                              "skuOptionList": [    //sku属性选项
                                                {
                                                  "psaoAtrrValue": $(zf).val(), // 选项值  
                                                  "psaoSortNo": g,//排序号
                                                  "psaoType": 2  // 2
                                                }
                                              ]
                                            }
                                          ],
                                          "pcaInputType": 4,    //  4
                                          "pcaMemo": pcaname, // 备注
                                          "pcaName": pcaname, // 销售属性名
                                          "pcaRequired": 0,   // 0
                                          "pcaSaleProp": 1,  // 1
                                          "pcaSortNo": g,   // 排序号
                                          "pcraCatId": leimuid,  //  类目ID 
                                        }
                                 skuname += pcaval+","
                                 attrList.push(map)
                    })*/
                  skuname = skuname.substring(0,skuname.length-1)
                  //alert(skuname+spuName )
            let  sin = {   
                        "pcaoList": pcaoList,
                        "skuOptionList":baseList,
                        "attrList": attrList,
                        "skuAtrr": skuname ,          // 拼接属性
                        "skuClassify": "i",     //   i
                        "skuCode": skubm2,        //   sku编码
                        "skuMarketSalePrice": yjg,   //   原价
                        "skuName":  skuname+spuName  ,      //    拼接属性spu名字
                        "skuNew": 1,   
                        "skuOverseas": 1,              // 1
                        "skuSalePrice": sjg,            // 售价   
                        "skuStockNum": kcs,            //  库存 $(el[4]).val()
                        "skuUnit": "",         //  "" 
                        "skuUrl": "",          //  ""
                        "skuWhId": "",                //   ""
                        "sku_remark": skuname ,     //  拼接属性 
                        "skuShowNum": erpkc2,  
                    }
                    console.log(sin)
                    spulist.push(sin)
                    console.log(spulist)
} else {
            //获取基本属性列表
           /*  $(base).each(function(b,za){
                  //alert( $($(za).children("input:hidden")[0]).val() )
             })
             //获取属性值
             $("span[class='pcao']").each(function(d,zc){
                
             })
             //获取新增属性
              $(".addsxxx input:checked").each(function(e,zd){  
                
             })
             //获取销售属性
             $("#base div[id!=\"0\"] :text").each(function(c,zb){
                    //alert($(zb).val())
             })
   
         $(".addsxxx input:checked").each(function(r,y){  
                alert( $(y).next(":text").val() )
                             })*/
                      if(this.xssxList.length == 0){
                        this.showMsg("请先生成SKU组合")
                        return
                      }
                      let xssx = this.xssxList 
                      //alert(   $($(item)).length )
                      $(item).each(function(a, z){
                            let sin = {}
                            let baseList = []
                            let attrList = [] 
                            let pcaoList = []
                //alert(  xssx[a] )
                           if( a < $(item).length -2){
                            //alert(  xssx[a] )
                            //获取每列spu数据
                               let el =  $(z).children("td").children("input")
                                
                               //let zhi = $(el[0]).val().split(",")
                               //alert(xssx[a])
                               //取每一行的sku组合的值
                               let s = xssx[a]+""
                               let zhi = s.split(",")
                               let  ii = 0
               $(base).each(function(d,zc){
                      let flag = true
                      //匹配基本属性
                  if( $($(zc).children("span[class='pcao']").children("input:checked")).length > 0 || 
                      $($(zc).children("span[class='addsxxx']").children("input:checked")).length > 0 ){
                     $(zc).children("span[class='pcao']").children("input:checked").each(function(b,za){
                              if($(za).val()==zhi[ii] ){
                               // alert($(za).siblings("input:hidden").length)
                               let list = $(za).siblings("input:hidden")
                               //alert($($(bname[d]).children("input:hidden")[1]).val()) 属性名相关参数
                               let basesx = { //基本属性对象
                                      "psaoAtrrId": $($(bname[d]).children("input:hidden")[1]).val(), //基本属性ID
                                      "psaoAtrrValue": zhi[ii],  // 选项值  
                                      "psaoOptionId": $(list[0]).val() ,          // 属性值ID
                                      "psaoSortNo": $(list[2]).val(),            // 
                                      "psaoType": 2              //  2 
                                    }
                                baseList.push(basesx)
                                ++ii
                                flag = false
                                return false
                              }
                      })
                  
                  //上面不匹配，确定为新增基础属性
            if( flag )   {
                     let newbase =  {
                                      "pcaoAtrrId":  $($(bname[d]).children("input:hidden")[1]).val(),//需要属性id
                                      "pcaoIcon": 0,
                                      "pcaoName": zhi[ii],
                                      "pcaoSortNo": 0,
                                      "pcaoUseFlag": 1,
                                      "pcaoValue": zhi[ii],
                                      "skuOptionList": [
                                        {
                                          "psaoAtrrId": $($(bname[d]).children("input:hidden")[1]).val(),//属性id
                                          "psaoAtrrValue": zhi[ii],
                                          "psaoSortNo": 0,
                                          "psaoType": 2
                                        }
                                      ]
                                    }
                                     pcaoList.push(newbase)
                                     ++ii
                            }
                  }

              })
                /*alert($(base).length)
                alert($(xsval).length)
                 alert($(bname).length)
                 alert($(zhi).length)*/
               //销售属性的匹配
               let len = $(base).length
               $(xsval).each(function(f,ze){
                    let optionList = []
                    $(ze).children(":text").each(function(g,zf){
                         if(g > 0 ){
                             if($(zf).val() == zhi[f+ii] ){
                                //匹配成功
                                 //alert($($(ze).children(":text")[0]).val()) //销售属性名称
                                 //alert($(zf).val())
                                 //let optionList = []
                                 let map = {
                                          "optionList": [  //销售属性选项  
                                            {
                                              "pcaoName": zhi[f+ii],  //  选项值
                                              "pcaoSortNo": g,       // 排序号
                                              "pcaoValue": zhi[f+ii], //  选项值
                                             
                                              "skuOptionList": [    //sku属性选项
                                                {
                                                  "psaoAtrrValue": zhi[f+ii], // 选项值  
                                                  "psaoSortNo": g,//排序号
                                                  "psaoType": 2  // 2
                                                }
                                              ]
                                            }
                                          ],
                                          "pcaInputType": 4,    //  4
                                          "pcaMemo": zhi[f+ii], // 备注
                                          "pcaName": $($(ze).children(":text")[0]).val(), // 销售属性名
                                          "pcaRequired": 0,   // 0
                                          "pcaSaleProp": 1,  // 1
                                          "pcaSortNo": g,   // 排序号
                                          "pcraCatId": leimuid,  //  类目ID 
                                        }

                                 attrList.push(map)
                                 return false
                             }
                         }
                    })
               })
                        /*       "skuOptionList": [
                        {
                          "psaoAtrrId": 0,             //基本属性ID
                          "psaoAtrrValue": "string",  // 选项值  
                          "psaoOptionId": 0,          // 属性值ID
                          "psaoSortNo": 0,            // 
                          "psaoType": 0              //  2 
                        }
                      ],，*/

                
                                 /* <input :value="i.pcaName" type="hidden" />
                                  <input :value="i.pcaId" type="hidden" />
                                  <input :value="i.pcaSortNo" type="hidden" />
                                  <input :value="i.pcraCatId" type="hidden" />
                                  <input :value="i.pcaMemo" type="hidden" />
                                  <input :value="i.pcaInputType" type="hidden" />
                                  <input :value="i.pcaSaleProp" type="hidden" />
                                  <input :value="i.pcaRequired" type="hidden" />*/

                                 /* <input :value="s.pcaoId" type="hidden" />
                                  <input :value="s.pcaoName" type="hidden" />
                                  <input :value="s.pcaoSortNo" type="hidden" />
                                  <input :value="s.pcaoValue" type="hidden" />*/

                          //销售属性
                       /*{
                          "optionList": [  //销售属性选项  
                               {
                                  "pcaoName": "string",  //  选项值
                                   "pcaoSortNo": 0,       // 排序号
                                   "pcaoValue": "string", //  选项值
                                   "skuOptionList": [    //sku属性选项
                                      {
                                           "psaoAtrrValue": "string", // 选项值  
                                           "psaoSortNo": 0,//排序号
                                           "psaoType": 0  // 2
                                      }
                                                    ]
                                }
                                      ],
                                      "pcaInputType": 0,    //  4
                                      "pcaMemo": "string", // 备注
                                      "pcaName": "string", // 销售属性名
                                      "pcaRequired": 0,   // 0
                                      "pcaSaleProp": 0,  // 1
                                      "pcaSortNo": 0,   // 排序号
                                      "pcraCatId": 0,  //  类目ID 
                                }*/

            /*                     "pcaoList": [
                                    {
                                      "pcaoAtrrId": 0,//需要属性id
                                      "pcaoIcon": 0,
                                      "pcaoName": "string",
                                      "pcaoSortNo": 0,
                                      "pcaoUseFlag": 0,
                                      "pcaoValue": "string",
                                      "skuOptionList": [
                                        {
                                          "psaoAtrrId": 0,属性id
                                          "psaoAtrrValue": "string",
                                          "psaoSortNo": 0,
                                          "psaoType": 0
                                        }
                                      ]
                                    }
                                  ],
                            */
                            
                    if( $(el[2]).val() == ''){
                        msg += "第"+$(el[0]).val()+"行: 未填写丰盛榜售价___________"
                        //return
                    }
                    if( $(el[3]).val() == ''){
                        msg += "第"+$(el[0]).val()+"行: 未填写原价____________"
                        //return
                    }
                    if( $(el[4]).val() == ''){
                        msg += "第"+$(el[0]).val()+"行: 未填写展示库存___________"
                        //return
                    }
                    if( $(el[5]).val() == ''){
                        msg += "第"+$(el[0]).val()+"行: 未填写ERP实际库存___________"
                        //return
                    }        
                    if( $(el[6]).val() == ''){
                        msg += "第"+$(el[0]).val()+"行: 未填写sku编码___________"
                        //return
                    }
                    if(msg){
                        return
                    }
                            
              sin = {   
                        "pcaoList": pcaoList,
                        "skuOptionList":baseList,
                        "attrList": attrList,
                        "skuAtrr": $(el[1]).val() ,          // 拼接属性
                        "skuClassify": "i",     //   i
                        "skuCode": $(el[6]).val(),        //   sku编码
                        "skuMarketSalePrice": $(el[3]).val(),   //   原价
                        "skuName":  $(el[1]).val()+spuName  ,      //    拼接属性spu名字
                        "skuNew": 1,   
                        "skuOverseas": 1,              // 1
                        "skuSalePrice": $(el[2]).val(),            // 售价   
                        "skuStockNum": $(el[5]).val(),            //  库存 $(el[4]).val()
                        "skuUnit": "",         //  "" 
                        "skuUrl": "",          //  ""
                        "skuWhId": "",                //   ""
                        "sku_remark": $(el[1]).val() ,     //  拼接属性
                        "skuShowNum": $(el[4]).val(),  //展示库存

                    }
                    console.log(sin)
                    spulist.push(sin)
                    console.log(spulist)
           }      
      })
}
      if( msg != ''){
              this.showMsg(msg)
              return
      }
       //sku
      this.request.skuList = spulist
      //品牌判空
      if(this.request.spuBrandId < 0 ){
        this.showMsg("请选择品牌")
        return
      }

       this.request.tagList = []
      //类目标签
      if( this.tagsList.length == 0){
            this.showMsg("请选择类目标签")
            return
      }
        this.tagsList.forEach((per,index)=>{
             this.request.tagList.push( { "prpTagType": 100 ,"prpTagId": per.id ,"prpTagName": per.text ,"prpSort": per.sortNum } )
        })
      //人群标签
     
      if( this.personList.length == 0){
            this.showMsg("请选择人群标签")
            return
      }
        this.personList.forEach((per,index)=>{
             this.request.tagList.push( { "prpTagType": 300 ,"prpTagId": per.id ,"prpTagName": per.text ,"prpSort": per.sortNum } )
        })
      //内容标签
      if( this.neirongList.length == 0){
            this.showMsg("请选择内容标签")
            return
      }
        this.neirongList.forEach((per,index)=>{
             this.request.tagList.push( { "prpTagType": 201 ,"prpTagId": per.id ,"prpTagName": per.text ,"prpSort": per.sortNum } )
        })
      
        //上榜理由
     if(this.shangb.length == 0 ){
            this.showMsg("上榜理由不能为空")
            return
         }
         //商品图片判空
       
        if(this.request.resourceList.length == 0 ){
            this.showMsg("商品图片至少上传一张")
            return
         }
      
    //保消类型
         let arr = [];
         $(".insu input:checked").each(function(i , v){
             //let ar = {"piInsuranceId": '',"piInsurance":'',"piSort":'', }
               let ar = $(v).val().split(",")
               let av = {"piInsuranceId": ar[1],"piInsurance":ar[0],"piSort":ar[2], }
               arr.push(av)
         })
         if(arr.length == 0 ){
            this.showMsg("消保类型不能为空")
            return
         }
         //上架时间
      if( $(".radios input:checked").val() == 2 ){
           if( this.hour == -1 || this.minutes == -1 || this.time == ""){
            this.showMsg("上架时间不能为空")
            return
           }
           this.request.skuPlanShelvesDate = this.time//+" "+this.hour+":"+this.minutes
           if( this.hour>= 10 ){
                          this.request.skuPlanShelvesDate += " "+this.hour
                    }else{
                        this.request.skuPlanShelvesDate += " 0"+this.hour
                    }
                    if( this.minutes >= 10 ){
                          this.request.skuPlanShelvesDate += ":"+this.minutes
                    }else{
                        this.request.skuPlanShelvesDate+= ":0"+this.minutes
                    }
      } else {
           this.request.skuPlanShelvesDate = ""
      } 
      //
         this.request.piList = arr 
         this.request.spuAppSummary = this.request.spuPcSummary

        this.shangb.forEach((data,index)=>{
                this.request.pcrList.$set(index, {"pcrReason": data.keyValue,"pcrSortNo":data.sortNo,"pcrSpuId":data.dictionnaryId, }  );
                //data.keyValue+','+data.dictionnaryId+','+data.sortNo"
             })

            client.postData( SPU_CREATE , this.request).then(data => {
                if (data.code == 200) {
                    //alert("新增成功")
                    //this.showMsg("新增成功")
                    this.spu.id = data.spuId
                    this.spu.msg = "新增成功"
                    this.expertEditId = '';
                    this.showAddDialog = true;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
              this.showMsg("新增失败,请重试"+data.message);
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
        client.postData(  SYSTEM_DICTIONARY  , {
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
                 this.showMsg("获取消保类型信息失败,请刷新重试"+data.message);
            })
        },
        //获取上榜 理由
        getshangbangList() { 
        client.postData(  SYSTEM_REASON , {}).then(data => {
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
        client.postData(  PBD_GET_LIST , {
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
            if( list.length > 3 ){
                alert("标签不能超过3个")
                return
            }
            this.neirongList = []
            this.neirongList = list;
            this.data.labelIds = [];
            list.forEach(item => {
                this.data.labelIds.push(item.id);
            })
            this.showneiTreeSelect = !this.showneiTreeSelect;
        },
        //人群标签回调
        selectPerFunc(list) {
            if( list.length > 3 ){
                alert("标签不能超过3个")
                return
            }
            this.personList = [];
            this.personList = list;
            this.data.labelIds = [];
            list.forEach(item => {
                this.data.labelIds.push(item.id);
            })
            this.showperTreeSelect = !this.showperTreeSelect;
        },
        // 选择标签回调
        selectTagFunc(list) {
            if( list.length > 3 ){
                alert("标签不能超过3个")
                return
            }
            this.tagsList = []
            this.tagsList = list;
            this.data.labelIds = [];
            list.forEach(item => {
                this.data.labelIds.push(item.id);
            })
            this.showTagTreeSelect = !this.showTagTreeSelect;
        },
        hideDialog() {
            this.par = []
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
    
    created() {
         this.getxbList()
         this.getshangbangList(); 
         this.getbrandList();
    },
    watch: {
        shangb() {
            if(this.shangb.length > 3){
                this.showMsg("最多选择3个理由")
                return
            }
                this.request.pcrList.pcrReason = this.shangb 
                //alert(this.request.pcrList.pcrReason)
        },
        cflag() {
            //alert(this.spuCatId)
            let arr =[]
            arr.push(this.par[3])
            arr.push(this.par[4])
            arr.push(this.par[5])
           client.postData(  PCA_GET_BY_CATID  , {"parentIds" :arr }  ).then(data => {
                if (data.code == 200) {

                    this.sxlist = data.data;
                    
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.showMsg("获取基本属性失败,请刷新重试");
            })

          /* this.sxlist = {"code":200,"msg":"操作成功","serverTime":"1504084257797","data":[{"pcaId":"900967612593364994","pcraCatId":"1001","pcaName":"电器","pcaSortNo":"0","pcaInputType":0,"pcaSearchType":1,"pcaSaleProp":1,"pcaAtrrType":0,"pcaRequired":0,"pcaUseFlag":0,"pcaMemo":"string","pcaCreatedTime":1503643409000,"pcaCreator":"oym","pcaModifyTime":1503661501000,"pcaModify":"oym","pcaoList":[{"pcaoId":"901040722596225024","pcaoAtrrId":"900967612593364994","pcaoName":"strings","pcaoValue":"string","pcaoIcon":"0","pcaoSortNo":1,"pcaoUseFlag":0,"pcaoCreator":"oym","pcaoCreatedTime":1503659824000,"pcaoModify":"oym","pcaoModifyTime":1503661258000}]},{"pcaId":"902448197199355904","pcraCatId":"1001001","pcaName":"string","pcaSortNo":"0","pcaInputType":0,"pcaSearchType":1,"pcaSaleProp":0,"pcaAtrrType":0,"pcaRequired":0,"pcaUseFlag":0,"pcaMemo":"string","pcaCreatedTime":1503995392000,"pcaCreator":"oym","pcaModifyTime":1503995392000,"pcaModify":"oym","pcaoList":[{"pcaoId":"1","pcaoAtrrId":"902448197199355904","pcaoName":"1","pcaoValue":"1","pcaoIcon":"1","pcaoSortNo":1,"pcaoUseFlag":1,"pcaoCreator":"","pcaoCreatedTime":1501571942000,"pcaoModify":"1","pcaoModifyTime":1503645546000}]},{"pcaId":"902448197199355905","pcraCatId":"1001001001","pcaName":"颜色","pcaSortNo":"0","pcaInputType":0,"pcaSearchType":1,"pcaSaleProp":0,"pcaAtrrType":0,"pcaRequired":0,"pcaUseFlag":0,"pcaMemo":"string","pcaCreatedTime":1503995509000,"pcaCreator":"oym","pcaModifyTime":1503995509000,"pcaModify":"oym","pcaoList":[{"pcaoId":"902448197199355134","pcaoAtrrId":"902448197199355905","pcaoName":"蓝","pcaoValue":"蓝","pcaoIcon":null,"pcaoSortNo":1,"pcaoUseFlag":0,"pcaoCreator":"yjj","pcaoCreatedTime":1502087704000,"pcaoModify":"yjj","pcaoModifyTime":1504074908000},{"pcaoId":"902448197199355136","pcaoAtrrId":"902448197199355905","pcaoName":"白","pcaoValue":"白","pcaoIcon":null,"pcaoSortNo":1,"pcaoUseFlag":0,"pcaoCreator":"yjj","pcaoCreatedTime":1502087704000,"pcaoModify":"yjj","pcaoModifyTime":1504074908000},{"pcaoId":"902448197199355138","pcaoAtrrId":"902448197199355905","pcaoName":"绿","pcaoValue":"绿","pcaoIcon":null,"pcaoSortNo":1,"pcaoUseFlag":0,"pcaoCreator":"yjj","pcaoCreatedTime":1502087704000,"pcaoModify":"yjj","pcaoModifyTime":1504074908000},{"pcaoId":"902448197199355137","pcaoAtrrId":"902448197199355905","pcaoName":"黑","pcaoValue":"黑","pcaoIcon":null,"pcaoSortNo":1,"pcaoUseFlag":0,"pcaoCreator":"yjj","pcaoCreatedTime":1502087704000,"pcaoModify":"yjj","pcaoModifyTime":1504074908000},{"pcaoId":"902448197199355135","pcaoAtrrId":"902448197199355905","pcaoName":"黄","pcaoValue":"黄","pcaoIcon":null,"pcaoSortNo":1,"pcaoUseFlag":0,"pcaoCreator":"yjj","pcaoCreatedTime":1502087704000,"pcaoModify":"yjj","pcaoModifyTime":1504074908000}]},{"pcaId":"902495960805040134","pcraCatId":"1001001001","pcaName":"款式","pcaSortNo":"0","pcaInputType":0,"pcaSearchType":1,"pcaSaleProp":0,"pcaAtrrType":0,"pcaRequired":0,"pcaUseFlag":0,"pcaMemo":"string","pcaCreatedTime":1504006780000,"pcaCreator":"oym","pcaModifyTime":1504006780000,"pcaModify":"oym","pcaoList":[{"pcaoId":"902448197199355140","pcaoAtrrId":"902495960805040134","pcaoName":"短","pcaoValue":"短","pcaoIcon":null,"pcaoSortNo":1,"pcaoUseFlag":0,"pcaoCreator":"yjj","pcaoCreatedTime":1502087704000,"pcaoModify":"yjj","pcaoModifyTime":1504074908000},{"pcaoId":"902448197199355139","pcaoAtrrId":"902495960805040134","pcaoName":"长","pcaoValue":"长","pcaoIcon":null,"pcaoSortNo":1,"pcaoUseFlag":0,"pcaoCreator":"yjj","pcaoCreatedTime":1502087704000,"pcaoModify":"yjj","pcaoModifyTime":1504074908000},{"pcaoId":"902495960805040135","pcaoAtrrId":"902495960805040134","pcaoName":"string","pcaoValue":"string","pcaoIcon":"0","pcaoSortNo":1,"pcaoUseFlag":0,"pcaoCreator":"oym","pcaoCreatedTime":1504006780000,"pcaoModify":"oym","pcaoModifyTime":1504006780000},{"pcaoId":"902448197199355141","pcaoAtrrId":"902495960805040134","pcaoName":"中","pcaoValue":"中","pcaoIcon":null,"pcaoSortNo":1,"pcaoUseFlag":0,"pcaoCreator":"yjj","pcaoCreatedTime":1502087704000,"pcaoModify":"yjj","pcaoModifyTime":1504074908000}]}]}.data*/
        },
        par(){
             //this.showMsg("watch"+this.par);
             this.request.spuCatId = this.par[5];
             this.spuCatId = this.par[3]+","+this.par[4]+","+this.par[5];
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
         $('#createStartTime').val('').datetimepicker({ format: 'yyyy-mm-dd', language: 'zh-CN', autoclose: 'true', minView: 2 });
        $('.datePicker').on('change', () => {
            this.rad = 2
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
        height: 200px;
        width: 100%;
        //display:inline-block;
        background-color:white;
        border:1px solid #000;
    }
    .box2{
        //margin-left: 2%;
        //overflow-x: scroll;
        height: 160px;
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
.delete2{
    //font-family:"Microsoft Yahei",simSun,Arial;
    font-size:23px;
   /* position: relative;
    left: 65%;
    top: -10%;*/
    //float: left;
    margin-left:3%;
    text-decoration:none
}
.delete2:hover{
    color:red
}
</style>