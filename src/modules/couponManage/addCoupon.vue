<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1100px'" >
            <div slot="content">
                <div class="row" style="background-color:#F0F0F0">
                    <form class="form-horizontal" name="addForm" role="form" id='submitform'>
                          <div class="col-md-12">   
                          <h5 > 基本信息 </h5> 
                          </div> 
                           <div class="form-group" style="text-align:center">
                              <hr style="height:1px;border:none;border-top:1px solid black;width:97%;margin-left:1.5%;" />
                          </div>
                          <div class="form-group" style="margin-top:-0.2%">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>优惠券名称：
                            </label>
                            <div class="controls col-md-3" style="margin-top:0.5%">
                                <input type="text" class="form-control input-sm" v-model="request.mkcName" placeholder="" required="required" :maxLength="a" />
                                <input id="sub" type="submit" style="display:none" id="name"/>
                            </div>&nbsp;&nbsp;<p style="margin-left:-1.7%;margin-top:-0.4%">
                              <span style="color:#999999">10个字以内</span></p>
                          </div>
    
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>发放总量：
                            </label>
                            <div class="col-md-2"  style="margin-top:0.5%">
                                <input type="number" max="2147483647" class="form-control input-sm" v-model="request.mkcTotalAmount" placeholder=""  required="required" min="1" 
                                  @keyup="integer($event)" @change="integer($event)"/>
                            </div>
                            <label  class="col-sm-0 control-label" style="margin-left:-0.5%;margin-top:0.4%">
                               张
                            </label>
                        </div>
                        <div class="form-group" >
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>优惠形式：
                            </label>
                            <div class="col-md-8 nopadding">

                            <div class="col-md-3" style="margin-top:1.5%">
                                <input type="radio"  v-model="" value="指定金额" checked :class="{ 'active': isActive }" >指定金额&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>
                               <br> <br>
                               <div class="col-md-2" style="margin-top:1%" >面值：</div>
                               <div class="col-md-3" style="margin-left:-10%">
                                <input type="number" class="form-control input-sm" v-model="request.mkcPrice" placeholder="" required="required" max="999999" min="1" :class="{ 'active': isActive }"
                                @keyup="integer($event)" @change="integer($event)"/></div>
                                 <label  class="col-sm-0 control-label" 
                                 style="margin-left:-0.8%;margin-top:-0.1%">元
                            </label>
                            <div style="color:#FF6633;margin-left:2%;margin-top:1.2%">优惠券不能抵扣运费</div>
                            </div>
                        </div>
                      

                         <div class="form-group" >
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>使用门槛：
                            </label>
                           <div class="col-md-8 nopadding">
                            <div class="col-md-3" style="margin-top:1.5%">
                                <input type="radio" name="menkan" v-model="menkan" value="0" checked :class="{ 'active': isActive }" >不限制&nbsp;&nbsp;&nbsp;&nbsp;
                                </div>
                                <br> <br>
                                <div class="col-sm-2" style="margin-top:1%">
                                <input type="radio" name="menkan" v-model="menkan" value="1"  :class="{ 'active': isActive }">满&nbsp;&nbsp;&nbsp;&nbsp; 
                                </div>
                                <div class="col-md-3" style="margin-left:-10%;margin-top:0.4%">  
                                  <input type="number" class="form-control input-sm" v-model="request.mkcUsedCondition" placeholder="" max="999999" required="required" min="0" @keyup="integer($event)" @change="integer($event)" :class="{ 'active': isActive }"/></div>
                               
                               <label  class="col-sm-0 control-label" style="margin-left:-0.6%;margin-top:0.5%">
                               元可使用
                               </label>
                               <div style="color:#FF6633;margin-left:2%;margin-top:1.2%">
                               使用门槛计算不包含运费</div>
                             </div>
                         </div>
                       
                         <hr style="background-color:white;display:block"> 
                       <div class="col-md-12">  <h5 > 基本规则 </h5>  </div>
                        <div class="form-group" style="text-align:center">
                              <hr style="height:1px;border:none;border-top:1px solid black;width:97%;margin-left:1.5%;" />
                          </div>
                      
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>每人限领：
                            </label>
                            <div class="col-md-3" style="margin-top:0.5%">
                                <select class="form-control" v-model="request.mkcJoinTimes" :class="{ 'active': isActive }">
                                     <option value="0">不限张</option>
                                     <option v-for="item in timesList" :value="item">{{item}}张</option>
                                 </select>
                                <!-- <m-select :data="brandList" :placeholder="'请选择内容'" :change-func="selectTagStatusFunc" :class="'fixedIcon'"></m-select> -->
                            </div>
                        </div>
                        <div class="form-group" >
                          <label for="title" class="col-sm-3 control-label">
                            <span class="required">* </span>有效期：
                          </label>
                          <div class="col-md-8 nopadding">

                            <div class="col-md-3" style="margin-top:1.5%">
                              <input type="radio"  value="0"  checked :class="{ 'active': isActive }" name="lingquan" v-model="request.mkcDateType" >
                               &nbsp;&nbsp;固定日期&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>
                            <br> <br> <br> 
                            <div id="fixedTime">
                                  <label for="title" class="col-sm-3 control-label" style="margin-left:-10%">
                                    <span class="required">* </span>生效时间：
                                  </label>
                                  <div class="controls col-md-4 " >
                                    <input type="text" class="form-control inline-block" placeholder="选择生效时间" 
                                    id="createStartTime2" v-model="request.mktStart"  :class="{ 'active': isActive }" > 
                                  </div><br><br><br>
                                  <label for="title" class="col-sm-4 control-label" style="margin-left:-18.2%">
                                    <span class="required" :class="{ 'active': isActive }">* </span>过期时间：
                                  </label>
                                  <div class="controls col-md-4 " >
                                    <input type="text" class="form-control inline-block" placeholder="选择过期时间" 
                                    id="createEndTime2" v-model="request.mktEnd"  :class="{ 'active': isActive }"> <br><br>
                                  </div>  
                            </div>
                            <div class="col-sm-8" >
                              <input type="radio"  value="1" :class="{ 'active': isActive }"  name="lingquan" v-model="request.mkcDateType">
                                 &nbsp;&nbsp;领到券当天即刻开始<span v-html="todayHtml" ></span>
                                <input id="today" type="number" min="0" max="99" v-model="request.mkcDateNum" v-show="!todayHtml"
                                 @keyup="integer($event)" @change="integer($event)" @blur="integer($event)"
                                 style="display:none" class="active"/> 
                                 天内有效<br><br>
                              <input type="radio" value="2" :class="{ 'active': isActive }"  name="lingquan" v-model="request.mkcDateType">
                                 &nbsp;&nbsp;领到券次日开始<span v-html="nextDayHtml" ></span> 
                                  <input v-show="!nextDayHtml" type="number" min="0" max="99" v-model="request.mkcDateNum" @keyup="integer($event)" @change="integer($event)" @blur="integer($event)" style="display:none" class="active" /> 
                                 天内有效
                            </div>
                          </div></div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>可使用商品：
                            </label>
                            <div class="controls col-md-4" style="margin-top:1%">
                                <input type="radio" name="useful" v-model="request.mkcUsedType" value="1" checked >全店商品&nbsp;&nbsp;&nbsp;&nbsp;
                                <input type="radio" name="useful" v-model="request.mkcUsedType" value="0" >指定商品&nbsp;&nbsp;&nbsp;&nbsp;
                                <button class="btn yellow-crusta" type="button" @click="showselect" style="display:none" id="selectSpu">添加商品</button>
                            </div>
                        </div>
                        <div class="form-group" v-for="spu in spuList">
                        <table class="tab" id="t" style="width:850px;margin-left:16%" border="1" 
                        cellspacing="0" cellpadding="0">  
                        <thead>
                          <tr>
                             <th style="width:10%">
                                 <a :id="'desc'+spu.spuId"  class="orderBy" style="display:none;text-decoration:none" @click="orderBy(false,spu.spuId)">▼</a>
                                 <a :id="'asc'+spu.spuId" class="orderBy" style="text-decoration:none" @click="orderBy(true,spu.spuId)">▲</a>
                                <!-- <input type="checkbox" :checked="spu.checked" @click="reverseList(spu)"></input> -->
                               <!--  <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll(spu)">全选</button>
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList(spu)">反选</button> -->
                             </th>
                             <th style="width:50%"> <p>
                                    <a target="_blank" :href="spu.imgUrl" title="查看大图">
                                        <img :src="spu.imgUrl" class="img-rounded" style="height:60px; width:80px">
                                    </a>
                                </p>
                                <a  style="text-decoration:none;" title="预览商品"  > 
                                <h4 class="tt"><p style="color:#6699CC">{{spu.spuName}}</p><span style="color:#FF9900">&nbsp;&nbsp;&nbsp;&nbsp;¥{{spu.minSalePrice}}</span>
                                &nbsp;&nbsp;&nbsp;&nbsp;<!-- 库存:{{spu.totalStockNum}} --></h4>
                                </a></th>
                             <th style="width:40%">{{spu.spuCreatedTime|filterTime}}</th>
                          </tr>
                        </thead>
                             <tbody :id="spu.spuId" style="display:none">
                                <tr v-for=" g in spu.skuList" style="height:20%"  @click="selectItem(g)">  
                                   <td style="width:10%"> <!-- <input type="checkbox" :checked="g.checked"></input> --> </td>
                                   <td style="width:50%"> {{ g.skuName }} </td>
                                   <td style="width:40%"> {{ g.skuCreatedTime|filterTime }}</td>
                                </tr>
                             </tbody>
                        </table>
                    </div>
                         <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                               使用说明：
                            </label>
                            <div class="controls col-md-6" style="margin-top:1%">
                                <textarea v-model="request.mkcRemark" placeholder="填写活动的详细说明，支持换行,最多200字" maxLength="200" rows="7" cols="60">
                                </textarea> 
                            </div>
                        </div>
                       
                    </form>
                </div>
            </div>

            <span slot="btnList">
                <button type="button" class="btn blue" @click="addItem()">保存</button>
                <button type="button" class="btn default" @click="hideDialog()" >取消</button>
            </span>
        </m-alert>
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
        <select-spu v-if="!destroyControlDialog" :show="showSpuDialog" :onhide="hideselDialog" @spu-data="getSelected" :spulist="spuList"></select-spu>
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
import selectSpu from './selectSpu';
import client from '../../common/utils/client';
import {  mAlert, mSelect, mMultiSelect, itemList ,selectComponentAll} from '../../components';
export default {
    components: { mAlert, mSelect, mMultiSelect, itemList  ,selectComponentAll,selectSpu},
    props: {
        mkttid: -1,
        coflag: false,
        
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
            todayHtml:" N",
            nextDayHtml:" N",
            isActive:true,
            menkan:0,
            a:10,
            spuList:[],
            time:"",
            mkcUsedCondition:0,
            timesList:[1,2,3,4,5,10],
            request:{
              "mkcDateType":0,
              "mkcDateNum":0,
              "mkcUsedType":1,//使用类型： 1全店商品 0指定商品
              "mkcCampaignId":-1,
              "cmisList": [],
              "mkcJoinTimes": 0,// 每人参加次数
              "mkcName": "", // 活动名称
              "mkcPrice": 0,//价值
              "mkcRemark": "",// 活动详情描述
              "mkcTimeRange": 2,// 时间范围：1-无时间限制，2-活动期间，3-活动期间的指定时段
              "mkcTotalAmount": 0,// 总配额
              "mkcType": 5,  //;// 活动类型：1-买赠券（赠积分），2-买送券（送产品），4-提货券，5-立减券（订单直接减去金额），6-限时促销活动，7-预售活动
              "mkcUsedCondition": 0,//使用门槛
              "mktEnd": "", //结束时间
              "mktStart": "",//开始时间
              "mkcScopeRange": 1,// 区域范围：1-全国所有店铺使用，2-区域店铺使用，3-指定店铺使用
              "mkcPlmRange": 1,// 平台渠道单位：1-所有平台渠道，2-指定平台渠道
              "mkcPaymentRange": 1,// 渠道范围：1-所有支付渠道，2-指定支付渠道
              "mkcMemberRange": 1,// 会员使用范围：1-全部会员，2-全部新客，3-全部老客，4-指定会员，5-指定会员等级
              "mkcWsRange": 1,// 仓储范围：1-无限制，2-指定仓储
              "mkcBrandRange": 1,// 品牌范围：1-无限制，2-指定品牌
              "mkcNeedCode": 0,// 是否允许活动码：0-不需要，1-需要
              "mkcPresentStyle": 1,// 优惠方式：1-多种优惠选择一种，2-多种优惠并存，比如：要么送产品要么送金额，寄送产品也优惠金额
              "mkcSortNo": 0,// 排序值
            },
            destroyControlDialog: false, //注销良言操作弹框
             expertEditId: '',
             showAddDialog: false,
            isLoading: false,
            showDialog: false,
            showPage: false,
            showPainListSelect: true,
            data: {
                "componentType": 16,
                "subtitle": "",
                "title": "",
                "authorName": "",
                "authorTitle": "",
                "authorType": 2,
                "description": "",
                "halfFigure": "",    
            },
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '新建店铺优惠券',
            neirongList:[],
            personList:[],
            tagsList: [],             //选择的标签
            showTagTreeSelect: false, //显示标签选择弹窗
            showperTreeSelect: false,//
            showneiTreeSelect: false,
            showSpuDialog:false,
            couponflag:false,
        }
    },
    filters: {
        filterTime(time) {
            return client.formateTime(time);
        }
    },
    methods: {
         /*lingquancheck(event , val ){
            let el = event.currentTarget
            this.request.mkcDateNum = 0
            if($(el).is(':checked')){
                   if(val == 1){
                        $("#nextbox").removeAttr("checked")
                        /*$("#nextDay").hide()
                        $("#today").show()
                        this.nextDayHtml = ' N'
                        this.todayHtml = '<input  type="number" min="0" max="99" v-model="request.mkcDateNum" @keyup="integer($event)" @change="integer($event)" @blur="integer($event)" class="active" />'
                        this.request.mkcDateType = 1
                     }else if(val == 2){
                        $("#todaybox").removeAttr("checked")
                        $("#nextDay").show()
                        $("#today").hide()
                        this.todayHtml = ' N'
                        this.nextDayHtml = '<input  type="number" min="0" max="99" v-model="request.mkcDateNum" @keyup="integer($event)" @change="integer($event)" @blur="integer($event)" class="active" />'
                        this.request.mkcDateType = 2
                   }
                   this.request.mkcDateNum = 0
                   return
              }
             if( !($("#nextbox").is(':checked') || $("#todaybox").is(':checked')) ){
                       this.request.mkcDateType = 0
                       this.request.mkcDateNum = 0
                       /* $("#nextDay").hide()
                        $("#today").hide()
              }
         },*/
         integer(event){
            let el = event.currentTarget;
            $(el).val(Math.abs($(el).val()))
            $(el).val(Math.round($(el).val()))
            var reg = /^\d{0,10}$/
            let s = $(el).val()+""
            let f = !reg.test(s)
            if (  f ) {
                    $(el).val("")
               }
         },
         addItem(){
              $("#sub").click()
         },
         addItem2(ev) {
            ev.preventDefault();  
            ev.preventDefault();  

            if(this.couponflag){
                this.showMsg("点击过于频繁")
                return
            }
            this.couponflag = true
            setTimeout(()=>{
                this.couponflag = false
            },5000)

          if(this.mkttid <= 0 ){
                if(this.menkan == 1 && this.request.mkcUsedCondition <= 0 ){
                    this.showMsg("使用门槛必须大于0!")
                    return
                }
                 if(this.menkan ==  0 ){
                    this.request.mkcUsedCondition = 0
                }
                if( this.request.mkcDateType > 0  &&  (this.request.mkcDateNum <= 0 || $.trim(this.request.mkcDateNum) == '')) {
                    this.showMsg("请填写领券后有效天数")
                    return
                }
                if(this.request.mkcDateType == 0){
                   this.request.mkcDateNum = 0
                    if(!this.request.mktStart){
                      this.showMsg('请填写生效时间')
                      return
                    }
                    if(!this.request.mktEnd){
                      this.showMsg('请填写过期时间')
                      return
                    }
                }
                if( this.request.mkcDateType == 0 && new Date(this.request.mktStart).getTime() - new Date().getTime() < 60000){
                       this.showMsg('生效时间请比现在时间大于1分钟以上')
                       $("#createStartTime2").val("")
                       return
                }    
                if( this.request.mkcDateType == 0 && new Date(this.request.mktEnd).getTime() - new Date(this.request.mktStart).getTime() < 60000){
                       this.showMsg('过期时间请比生效时间大于1分钟以上')
                       $("#createEndTime2").val("")
                       return
                }
                
          }    
            if(this.request.mkcUsedType == 0 && this.spuList.length == 0){
              this.showMsg("请先指定商品!")
              return
            }
            this.request.cmisList = []
            this.spuList.forEach(item => {
               //item.skuList.forEach(sku => {
                    if( item.checked ){
                       this.request.cmisList.push( {
                          "enableStatus": 1,//0-无效，1-有效
                          "misCampaignId": 0,//活动主键
                          "misDiscountPrice": 0,//限时折扣价
                          "misMandatory": 1,//是否必要产品：0-非必要产品，1-必要产品
                          "misMcnId": 0,  //条件主键
                          "misSpuId": item.spuId, //产品主键
                          "misType": 1 ,//商品类型：1-a商品，2-b商品 
                        })
                    }
                //})
            })
             /*if(this.request.cmisList == 0){
                this.showMsg("请先选择商品再保存")
            }*/

             if( this.request.mkcCampaignId > 0 ){
                client.postData( MKT_EDIT , this.request).then(data => {
                this.isLoading = true
                if (data.code == 200) {
                        this.showMsg("编辑优惠券成功!")
                        this.mkttid = -1
                 this.isLoading = false
                    setTimeout(() => {
                        this.hideDialog()
                    }, 1000)
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                      this.couponflag = false
                      this.showMsg("编辑优惠券失败!"+data.message);
             })

            }else{
                client.postData( MKT_CREATE , this.request).then(data => {
                this.isLoading = true
                if (data.code == 200) {
                        this.showMsg("新建优惠券成功!")
                 this.isLoading = false
                    setTimeout(() => {
                        this.hideDialog()
                    }, 1000)
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                      this.couponflag = false
                      this.showMsg("新建优惠券失败!"+data.message)
                })
            }
             ev.preventDefault();  
        },
        //点击行自动选中或不选中
        selectItem(item) {
            item.checked = !item.checked;
        },
        //sku展开 或 收起
         orderBy( val ,id) {
            if( val ){
                $("#desc"+id).show()
                $("#asc"+id).hide()
                $("#"+id).show()
            }else{
                $("#asc"+id).show()
                $("#desc"+id).hide()
                $("#"+id).hide()
            }
            
        },
        selectAll(val) {
            val.skuList.forEach(item => {
                item.checked = true;
            })
        },
        reverseList(val) {
            val.checked = !val.checked;
            val.skuList.forEach(item => {
                item.checked = !item.checked;
            })
        },
        hideselDialog() {
             this.showSpuDialog = false

        },
        getSelected( data ) {
            this.spuList = []
             console.log(data)
             this.spuList = data
        },
        showselect() {
             this.showSpuDialog = true
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
        hideDialog() {
            //this.par = []
            this.isActive = false
            this.showDialog = false;
            setTimeout(() => {
                this.showPage = false;
                this.onhide('cancel');
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
                this.showMsg(response.message);
            })
        }
    },
    
    created() {
        
    },
    watch: {
        "request.mkcDateType":{　
           handler(val,oldVal){　
            this.request.mkcDateNum = 0
            if(val > 0){
               $("#fixedTime").hide()
               this.request.mktStart = ''
               this.request.mktEnd = ''
            }
            if(val == 0){
               $("#fixedTime").show()
               this.nextDayHtml = ' N'
               this.todayHtml = ' N'
            }else if(val == 1){
               this.nextDayHtml = ' N'
               this.todayHtml = ''
            }else if(val == 2){
               this.todayHtml = ' N'
               this.nextDayHtml = ''
            }
            
          },
          deep:true　　　　　　　　
        },
        "request.mktStart":{　　
          　handler(val,oldVal){　
               if( val ) {
                let reg = /^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s((([0-1][0-9])|(2?[0-3]))\:([0-5]?[0-9])((\s)|(\:([0-5]?[0-9])))))?$/
                if(!reg.test(val)){
                  this.showMsg('日期格式不合法')
                  this.request.mktStart = "" 
                  return
                }
              }
                /* val = val.replace(/-/g,"/")
                let start = new Date(val)
              if(this.mktEnd){
                   let end = new Date( this.mktEnd.replace(/-/g,"/") )
                   if( end < start ){
                    this.showMsg('生效时间不可以大于过期时间')
                    this.request.mktStart = ""
                    return
                   }
                    this.time = (end - start)/24/3600/1000
                }*/
          },　　　　　　　　　　
          deep:true　　　　　　　　
        },
        "request.mkcUsedType":{　
         handler(val,oldVal){　
          if(val == 1){
            $("#selectSpu").hide()
          }else{
            $("#selectSpu").show()
          }
        },
         deep:true　　　　　　　　
        },
        coflag() {
           this.isActive = true
           $(".active").attr("disabled","disabled")
           this.request.mkcCampaignId= this.mkttid
           this.title = "编辑优惠券"
           client.postData(  MKT_GET_ID  +"?mkcCampaignId="+this.mkttid , {}).then(response => {
                this.isLoading = false;
                if (response.code == 200) {
                    this.request.mkcName       = response.data.mkcName
                    this.request.mkcJoinTimes = response.data.mkcJoinTimes
                    this.request.mkcPrice      = response.data.mkcPrice
                    this.request.mkcRemark     = response.data.mkcRemark
                    this.request.mkcTimeRange = response.data.mkcTimeRange
                    this.request.mkcTotalAmount= response.data.mkcTotalAmount
                    this.request.mkcType       = response.data.mkcType
                    this.request.mkcUsedCondition= response.data.mkcUsedCondition
                    this.request.mkcDateType = response.data.mkcDateType
                    setTimeout(()=>{
                        this.request.mkcDateNum = response.data.mkcDateNum
                    },200)
                   //开始时间
                    let sjtime  = new Date(response.data.mktStart)
                    this.request.mktStart = sjtime.getFullYear() 
                    if( sjtime.getMonth()+1 >= 10 ){
                          this.request.mktStart += "-"+(sjtime.getMonth()+1)
                    }else{
                        this.request.mktStart += "-0"+(sjtime.getMonth()+1)
                    }
                    if( sjtime.getDate() >= 10 ){
                         this.request.mktStart += "-"+sjtime.getDate()+" "
                    }else{
                        this.request.mktStart += "-0"+sjtime.getDate()+" "  
                    }
                    if( sjtime.getHours() >= 10 ){
                         this.request.mktStart += ""+sjtime.getHours()+":"
                    }else{
                        this.request.mktStart += "0"+sjtime.getHours()+":"
                    }
                    if( sjtime.getMinutes() >= 10 ){
                         this.request.mktStart += ""+sjtime.getMinutes()+":"
                    }else{
                        this.request.mktStart += "0"+sjtime.getMinutes()+":"
                    }
                    if( sjtime.getSeconds() >= 10 ){
                         this.request.mktStart += ""+sjtime.getSeconds()
                    }else{
                        this.request.mktStart += "0"+sjtime.getSeconds()
                    }
                    //过期时间
                    let endtime  = new Date(response.data.mktEnd)
                    this.mktEnd = endtime.getFullYear() 
                    if( endtime.getMonth()+1 >= 10 ){
                          this.mktEnd += "-"+(endtime.getMonth()+1)
                    }else{
                        this.mktEnd += "-0"+(endtime.getMonth()+1)
                    }
                    if( endtime.getDate() >= 10 ){
                         this.mktEnd += "-"+endtime.getDate()+" "
                    }else{
                        this.mktEnd += "-0"+endtime.getDate()+" "
                    }
                    if( endtime.getHours() >= 10 ){
                         this.mktEnd += ""+endtime.getHours()+":"
                    }else{
                        this.mktEnd += "0"+endtime.getHours()+":"
                    }
                    if( endtime.getMinutes() >= 10 ){
                         this.mktEnd += ""+endtime.getMinutes()+":"
                    }else{
                        this.mktEnd += "0"+endtime.getMinutes()+":"
                    }
                    if( endtime.getSeconds() >= 10 ){
                         this.mktEnd += ""+endtime.getSeconds()
                    }else{
                        this.mktEnd += "0"+endtime.getSeconds()
                    }
                    //使用门槛回显
                    if(this.request.mkcUsedCondition > 0 ){
                      this.menkan = 1
                    }
                    this.request.mktEnd = this.mktEnd
                    //领取时间回显
                    /* if( this.request.mkcDateType ==1  ){
                        $("#todaybox").prop("checked","true")
                        $("#today").show()
                    }else  if( this.request.mkcDateType ==2  ){
                        $("#nextbox").prop("checked","true")
                        $("#nextDay").show()
                    }*/
                    //可使用商品回显
                    //if( response.data.spuList.length > 0 ){
                    this.request.mkcUsedType = response.data.mkcUsedType
                   // }
                     response.data.spuList.forEach( spu => {
                        //spu.skuList.forEach( sku => {
                             //sku.checked = false
                          spu.skuList.forEach( sku => {
                             sku.checked = false
                           })
                             response.data.misList.forEach(m => {
                                  if( m.misSpuId == spu.spuId ){
                                    spu.checked = true
                                  }
                        })
                    })
                    this.spuList = response.data.spuList
                }
            }, response => {
                this.isLoading = false;
                this.showMsg(response.message);
            })
        },
        mktEnd(val) {
            if( val ) {
              let reg = /^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s((([0-1][0-9])|(2?[0-3]))\:([0-5]?[0-9])((\s)|(\:([0-5]?[0-9])))))?$/
              if(!reg.test(val)){
                this.showMsg('日期格式不合法!')
                this.mktEnd = ""
                this.request.mktEnd = ""
                return
              }
            }
    
              val = val.replace(/-/g,"/")
                let end = new Date(val)
           if(this.mkttid <= 0 ){
                if(end <= new Date()){
                  this.showMsg('过期时间不可以小于现在时间!')
                  this.mktEnd = ""
                  this.request.mktEnd = ""
                  return
                }
            }
                
            if( this.request.mktStart ){
                let start = new Date( this.request.mktStart.replace(/-/g,"/") )
                if( end < start ){
                    this.showMsg('生效时间不可以大于过期时间!')
                    this.mktEnd = ""
                    this.request.mktEnd = ""
                    return
                }
                this.time = Math.round((end - start)/24/3600/1000)
                this.request.mktEnd = val
            }
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
          let dates = $("#createStartTime2,#createEndTime2");
          dates.datetimepicker({
          dateFormat: "yy-mm-dd",
          timeFormat: 'HH:mm:ss',
          showMonthAfterYear: true,
          changeMonth: true, 
          changeYear: true,
          buttonImageOnly: true,
          showSecond: true,
          stepHour: 1,
          stepMinute: 1,
          stepSecond: 1,
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
           var option = this.id == "createStartTime2" ? "minDate" : "maxDate";
           dates.not(this).datepicker("option", option, selectedDate );
          },
          onClose: function(data,inst){   
             dates.removeAttr("disabled")
          },
          beforeShow: function(){
             dates.attr("disabled","disabled")
             if( $("#createStartTime2").datepicker( 'getDate' ) != null ){
               return
             }
              $(this).datepicker('option', 'minDate', new Date() )
          },
      });
          dates.on("click",function(){
            $(this).attr("disabled","disabled")
          })
        $("#submitform").on("submit",this.addItem2);  
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
.active{
 
}

</style>