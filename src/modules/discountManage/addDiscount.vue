<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1100px'" >
            <div slot="content">
             <form  id='submitform1'>
                <p > 活动信息 </p> 
         <hr>
         <br>
            <div class="form-group">
                <label for="title" class="col-sm-3 control-label">
                    <span class="required">* </span>活动名称：
                </label>
                    <div class="controls col-md-4">
                         <input type="text" class="form-control input-sm" v-model="request.mkcName" placeholder="请填写活动名称" required="required" maxLength="15" > 
                    </div>&nbsp;&nbsp;<p style="margin-left:-1.7%;margin-top:-1.2%">
                        <span style="color:#999999">15个字以内</span></p>
            </div>
            <br>
            <div class="form-group">
                <label for="title" class="col-sm-3 control-label">
                    <span class="required">* </span>生效时间：
                </label>
                    <div class="controls col-md-3 ">
                        <input type="text" class="form-control inline-block datePicker" placeholder="选择生效时间" id="createStartTime3" v-model="request.mktStart" required="required" 
                          /> 
                    </div>
                       <div class="col-md-1" style="margin-top:0.5%;margin-left:-1.2%">至</div>
                    <div class="controls col-md-3 nopadding" style="margin-left:-4%">
                       <input type="text" class="form-control inline-block datePicker" placeholder="选择过期时间" id="createEndTime3" v-model="mktEnd" required="required" >
                  </div>  <br> 
            </div>
            <br >
            <div class="form-group" style="margin-top:0.8%">
                <label for="title" class="col-sm-3 control-label">
                    <span class="required">* </span>活动标签：
                </label>
                    <div class="controls col-md-4">
                         <input type="text" class="form-control input-sm"  placeholder="限时折扣"  required="required" v-model="request.mkcLabel" minlength="2" maxlength="5"> 
                         活动期间展示于商品详情的价格旁边，2至5字。                                
                         <input id="sub1" type="submit" style="display:none" >

                    </div>
            </div>
            <br> <br><br>
             <div class="form-group" >
                <label for="title" class="col-sm-3 control-label">
                    <span class="required">* </span>选择商品：
                </label>
                    <!-- <div class="controls col-md-4">
                         <input type="text" class="form-control input-sm" v-model="request.spuName" placeholder="限时折扣" > 
                         活动期间展示于商品详情的价格旁边，2至5字。
                    </div> -->
                      <button class="btn yellow-crusta" type="button" @click="showselect" 
                      style="margin-left:1.57%">添加</button>
                      <br><br>
                      <span style="margin-left:26.5%">
                        批量减价 <input type="number" class="input-sm-2"   v-model="reduce" step="0.01" @keyup="integer($event)" @blur="integer($event)" min="0.00" max="9999999"/> 元  &nbsp;&nbsp;
                      <a style="text-decoration:none" @click="plreduce()">确定</a> &nbsp;&nbsp;&nbsp;
                      
                     </span>  
                     <br><br>
            </div>
                        <div class="form-group" v-for="(index,spu) in spuList">
                        <table class="tab" id="t" style="width:850px;margin-left:16.5%" border="1" cellspacing="0"   cellpadding="0">  
                        <thead>
                          <tr>
                             <th style="width:7%">
                                 <input type="checkbox" v-model="spu.checked"></input> 
                                 <a :id="'desc'+spu.spuId"  class="orderBy" style="display:none;text-decoration:none" @click="orderBy(false,spu.spuId)">▼</a>
                                 <a :id="'asc'+spu.spuId" class="orderBy" style="text-decoration:none" @click="orderBy(true,spu.spuId)">▲</a>
                             </th>
                             <th style="width:35%;text-align:left">
                                  <p>
                                    <a target="_blank" :href="spu.imgUrl" title="查看大图">
                                        <img :src="spu.imgUrl" class="img-rounded" style="height:60px; width:80px">
                                    </a>
                                </p>
                                <a  style="text-decoration:none;" title="预览商品"  > 
                                <h4 class="tt"><p style="color:#333333;margin-bottom:2.8%;font-weight:400;font-style:normal;
                                    font-family:'Arial Normal', 'Arial'">{{spu.spuName}}</p><span style="color:#FF9900">¥{{spu.minSalePrice}}</span>
                                    <span style="color:#333333;font-size:14px;font-family:'Arial Normal', 'Arial'">
                                &nbsp;&nbsp;&nbsp;&nbsp;库存:{{spu.totalStockNum}}</span>
                                </h4>
                                </a>
                             </th>
                             <th style="width:20%"> 减价 &nbsp;&nbsp;<input type="number" class="input-sm-2"    @keyup="reduceBefore(spu.spuId,spu.minSalePrice,$event)" :id="'before'+spu.spuId" step="0.01" required="required" min="0.01" @change="reduceBefore(spu.spuId,spu.minSalePrice,$event)" :max="spu.minSalePrice" @click="clickreduceBefore(spu.spuId,spu.minSalePrice,$event)" :value="spu.reduce"
                                @blur="reduceBefore(spu.spuId,spu.minSalePrice,$event)"/>  元
                             </th>
                             <th style="width:18%"> 减价后<input type="number" class="input-sm-1" @keyup="refuceAfter(spu.spuId,spu.minSalePrice,$event)" :id="'after'+spu.spuId" step="0.01" required="required" @change="refuceAfter(spu.spuId,spu.minSalePrice,$event)" min="0.01" :max="spu.minSalePrice" @blur="refuceAfter(spu.spuId,spu.minSalePrice,$event)"> 元</th>
                             <th style="width:5%"><a style="text-decoration:none" @click="cut(index)">取消</a></th>
                        </tr>
                          
                        </thead>
                             <tbody :id="'tab'+spu.spuId" style="display:none">
                                <tr >   
                                  <td style="width:7%">
                                 <!--        
                                     <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll(spu)">全选</button>
                                     <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList(spu)">反选</button> -->
                                  </td>
                                  <td style="width:35%"> SKU组合 </td>
                                  <td style="width:20%"> 原价（元） </td>
                                  <td style="width:18%" colspan="2"> 减价后</td>
<!--                                   <td style="width:15%"> 操作</td>
 -->                                </tr>
                                <tr v-for=" g in spu.skuList" style="height:20%"  @click="selectItem(g)">  
                                   <td style="width:7%"> <!-- <input type="checkbox" :checked="g.checked"></input> --> </td>
                                   <td style="width:35%"> {{ g.skuName }} </td>
                                   <td style="width:20%"> {{ g.skuSalePrice }}</td>
                                    <td style="width:18%" colspan="2"> <!-- <input type="text" class="input-sm" v-model="g.skuSalePrice"  >  -->{{g.skureduce}} </td>
                                  <!--     <td style="width:15%"> 
                                  <button type="button"  @click.stop="showControlFunc(item,'delete')" class="btn btn-xs red">删除</button> </td>
 -->                                </tr>
                             </tbody>
                        </table>
                   <!-- <a style="text-decoration:none" @click="plcut()">取消</a> -->
                </div>
                   <input type="checkbox" style="margin-left:18.3%" @click="selectAll($event)">&nbsp;全选 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                   <button type="button" class="btn default" @click="plcut()">批量取消</button>
                 </form>
            </div>

            <span slot="btnList" >
                <div style="text-align:center">
                <button type="button" class="btn blue" @click="addItem()">保存</button>
                <button type="button" class="btn default" @click="hideDialog()" >取消</button>
            </div>
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
import selectSpu from '../common/selectSpu';
import client from '../../common/utils/client';
import {  mAlert, mSelect, mMultiSelect, itemList ,selectComponentAll} from '../../components';
export default {
    components: { mAlert, mSelect, mMultiSelect, itemList  ,selectComponentAll,selectSpu},
    props: {
        mkcid: 0,
        dflag: false,
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
            reduce:0,
            mktEnd:"",
            spuList:[],
            time:"",
            mkcUsedCondition:0,
            timesList:[1,2,3,4,5,10],
            request:{
              "mkcLabel":"",
              "mkcCampaignId":0,
              "cmisList": [],
              "mkcJoinTimes": 0,// 每人参加次数
              "mkcName": "", // 活动名称
              "mkcPrice": 0,//价值
              "mkcRemark": "",// 活动详情描述
              "mkcTimeRange": 2,// 时间范围：1-无时间限制，2-活动期间，3-活动期间的指定时段
              "mkcTotalAmount": 0,// 总配额
              "mkcType": 6,  //;// 活动类型：1-买赠券（赠积分），2-买送券（送产品），4-提货券，5-立减券（订单直接减去金额），6-限时促销活动，7-预售活动
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
            title: '设置限时折扣',
            neirongList:[],
            personList:[],
            tagsList: [],             //选择的标签
            showTagTreeSelect: false, //显示标签选择弹窗
            showperTreeSelect: false,//
            showneiTreeSelect: false,
            showSpuDialog:false,
            submitflag:false,
        }
    },
    filters: {
        filterTime(time) {
            return client.formateTime(time);
        }
    },
    methods: {
         integer(event){
            var reg = /^[0-9]{1,6}([.]{1}[0-9]{1,2})?$/
             let f = !reg.test(this.reduce+'')
             if( f ){
               this.reduce = 0
               this.showMsg("请输入合法数字!")
               return 
             }
            /*if(this.reduce <= 0 ){
                this.showMsg("减价不能少于0")
                return
            }*/
           // let el = event.currentTarget;
            //$(el).val(Math.abs($(el).val()).toFixed(2))
         },
         plreduce(){
            
             this.reduce = Math.abs(this.reduce).toFixed(2)
             var reg = /^[0-9]{1,7}([.]{1}[0-9]{1,2})?$/
             let f = !reg.test(this.reduce+'')
             if( f ){
               this.reduce = 0
               this.showMsg("请输入合法数字!")
               return 
             }
             if(this.reduce <= 0 ){
                this.showMsg("减价幅度不能少于0")
                return
            }
            let list = [];
            this.spuList.forEach(spu =>{
                spu.reduce = this.reduce;
                $("#before"+spu.spuId).val(this.reduce);
                $("#before"+spu.spuId).click()
            })
         },
         plcut(){
             let arra = new Array()
             this.spuList.forEach(spu =>{
                if( !spu.checked ){
                   arra.push(spu)
                }
             })
             this.spuList = []
             arra.forEach((spu,index) =>{
              this.spuList.$set(index,spu)
             })
         },
         cut(index){
            this.spuList.splice(index,1)   
         },
         refuceAfter(id , min,event) {
             let el = event.currentTarget
             //$(el).val(Math.abs($(el).val()))
             var reg = /^[0-9]{1,7}([.]{1}[0-9]{1,2})?$/
             let s = $(el).val()+""
             let f = !reg.test(s)
             if (  f ) {
                   $(el).blur()
                   $(el).val("")
                   $("#before"+id).val("")
                    this.spuList.forEach(spu =>{
                        if(spu.spuId == id){
                        spu.skuList.forEach(sku =>{
                        sku.skuSalePrice = '' 
                        })
                    }
                })
                   this.showMsg("请输入合法数字!")
                   return
               }
             this.spuList.forEach(spu =>{
                if(spu.spuId == id){
                    let price = ( min - $("#after"+id).val() ).toFixed(2)
                    if( price < 0 ){
                        $(el).blur()
                        this.showMsg("减价后售价不能高于原价!")
                         $("#before"+id).val("")
                         $("#after"+id).val("")
                         spu.skuList.forEach(sku =>{
                            sku.skureduce = ""
                        })

                        return false
                    }else{
                         spu.reduce = price
                         $("#before"+id).val( price )
                         spu.skuList.forEach(sku =>{
                         sku.skureduce = sku.skuSalePrice - price
                        })
                    } 
                }
             })
         },
         clickreduceBefore(id , min,event) {      
             let el = event.currentTarget
             //$(el).val(Math.abs($(el).val()))
             var reg = /^[0-9]{1,7}([.]{1}[0-9]{1,2})?$/
             let s = $(el).val()+""
             let f = !reg.test(s)
             if (  f ) {
                   //$(el).blur()
                   $(el).val("")
                   $("#after"+id).val("")
                   this.spuList.forEach(spu =>{
                        if(spu.spuId == id){
                            spu.skuList.forEach(sku =>{
                            sku.skureduce = ""
                        })
                    }
                })
                   //this.showMsg("请输入合法数字!")
                   return
               }
             this.spuList.forEach(spu =>{
                if(spu.spuId == id){
                    let price = ( min - $("#before"+id).val() ).toFixed(2)
                    if( price < 0 ){
                        $("#before"+id).val("")
                        $(el).val("")
                        $(el).blur()
                        this.showMsg("减价后售价不能少于0!")
                        $("#after"+id).val("")
                         spu.skuList.forEach(sku =>{
                         sku.skureduce = ""
                        })
                        return false
                    }else{
                        spu.reduce = $("#before"+id).val()
                        $("#after"+id).val( price )
                        spu.skuList.forEach(sku =>{
                        sku.skureduce = sku.skuSalePrice - $("#before"+id).val() 
                        })
                    }
                }
             })
         },
         reduceBefore(id , min,event) {      
           
             let el = event.currentTarget
             //$(el).val(Math.abs($(el).val()))
             var reg = /^[0-9]{1,7}([.]{1}[0-9]{1,2})?$/
             let s = $(el).val()+""
             let f = !reg.test(s)
             if (  f ) {
                   $(el).blur()
                   $(el).val("")
                   $("#after"+id).val("")
                   this.spuList.forEach(spu =>{
                        if(spu.spuId == id){
                            spu.skuList.forEach(sku =>{
                            sku.skureduce = ""
                        })
                    }
                })
                   this.showMsg("请输入合法数字!")
                   return
               }
             this.spuList.forEach(spu =>{
                if(spu.spuId == id){
                    let price = ( min - $("#before"+id).val() ).toFixed(2)
                    if( price < 0 ){
                        $("#before"+id).val("")
                        $(el).val("")
                        $(el).blur()
                        this.showMsg("减价后售价不能少于0!")
                        $("#after"+id).val("")
                         spu.skuList.forEach(sku =>{
                         sku.skureduce = ""
                        })
                        return false
                    }else{
                        //alert(1)
                        spu.reduce = $("#before"+id).val()
                        $("#after"+id).val( price )
                        spu.skuList.forEach(sku =>{
                        sku.skureduce = sku.skuSalePrice - $("#before"+id).val() 
                        })
                    }
                }
             })
         },
         addItem(){
              $("#sub1").click()
         },
         addItem2(ev) {
            ev.preventDefault();  
            ev.preventDefault();  
            
            if(this.submitflag){
                this.showMsg("点击过于频繁")
                return
            }
            this.submitflag = true
            setTimeout(()=>{
                this.submitflag = false
            },5000)
            this.request.cmisList = []
            if(this.spuList.length == 0 ){
                this.showMsg("您还未选择参加活动的商品.请至少选择一个活动商品.")
                return
            }
            if(new Date(this.request.mktStart).getTime() - new Date().getTime() < 60000){
                   this.showMsg('生效时间请比现在时间大于1分钟以上')
                   $("#createStartTime3").val("")
                   return
            }    
            if(new Date(this.request.mktEnd).getTime() - new Date(this.request.mktStart).getTime() < 60000){
                   this.showMsg('过期时间请比生效时间大于1分钟以上')
                   $("#createEndTime3").val("")
                   return
            }    
            this.spuList.forEach(spu => {
                console.log(spu)
                    //if( sku.skuSalePrice != '' ){
                       this.request.cmisList.push( {
                          "enableStatus": 1,//0-无效，1-有效
                          "misCampaignId": 0,//活动主键
                          "misMandatory": 1,//是否必要产品：0-非必要产品，1-必要产品
                          "misMcnId": 0,  //条件主键
                          "misSpuId": spu.spuId, //产品主键
                          "misType": 1 ,//商品类型：1-a商品，2-b商品 
                          "misDiscountPrice": spu.reduce,//限时折扣价
                    })
               // }
            })
            if( this.request.mkcCampaignId > 0 ){
                client.postData( MKT_EDIT , this.request).then(data => {
                this.isLoading = true
                if (data.code == 200) {
                        this.showMsg("编辑限时折扣成功!")
                 this.isLoading = false
                    setTimeout(() => {
                        this.hideDialog()
                    }, 1000)
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                      this.submitflag = false
                      this.showMsg("编辑限时折扣失败!"+data.message);
             })

            }else{
                client.postData( MKT_CREATE , this.request).then(data => {
                this.isLoading = true
                if (data.code == 200) {
                        this.showMsg("新建限时折扣成功!")
                 this.isLoading = false
                    setTimeout(() => {
                        this.hideDialog()
                    }, 1000)
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                      this.submitflag = false
                      this.showMsg("新建限时折扣失败!"+data.message)
                })
            }
            // ev.preventDefault();  
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
                $("#tab"+id).show()
            }else{
                $("#asc"+id).show()
                $("#desc"+id).hide()
                $("#tab"+id).hide()
            }
            
        },
        selectAll(val) {
            let el = val.currentTarget
            if( $(el).is(":checked") ){
                this.spuList.forEach(item => {
                    item.checked = true;
                })
            }else{
                this.spuList.forEach(item => {
                    item.checked = false;
                })
            }
        },
        reverseList(val) {
            val.skuList.forEach(item => {
                item.checked = !item.checked;
            })
        },
        hideselDialog() {
             this.showSpuDialog = false

        },
        getSelected( data ) {
            this.spuList = null;
             data.forEach(spu =>{
                spu.checked = false
                if(!spu.reduce){
                     spu.reduce = 0.00
                }
             })
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
                this.showMsg('网络连接错误');
            })
        }
    },
    
    created() {
        
    },
    watch: {
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
               val = val.replace(/-/g,"/")
                let start = new Date(val)
                if(this.mktEnd){
                   let end = new Date( this.mktEnd.replace(/-/g,"/") )
                   if( end < start ){
                    this.showMsg('生效时间不可以大于过期时间')
                    this.request.mktStart = ""
                    return
                   }
                    this.time = (end - start)/24/3600/1000
                }       
          },　　　　　　　　　　
          deep:true　　　　　　　　
        },
        dflag() {
          client.postData(  MKT_GET_ID  +"?mkcCampaignId="+this.mkcid , {}).then(response => {
                this.isLoading = false;
                if (response.code == 200) {
                   this.request.mkcCampaignId =  response.data.mkcCampaignId
                   this.request.mkcName =  response.data.mkcName
                   this.request.mkcLabel = response.data.mkcLabel
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
                    this.request.mktEnd = this.mktEnd
                    //
                  
                    response.data.spuList.forEach( spu => {
                        
                             //sku.checked = false
                             //sku.skuSalePrice = ""
                             response.data.misList.forEach(m => {
                                  if( m.misSpuId == spu.spuId ){
                                   // sku.checked = true
                                    $("#before"+spu.spuId).val(m.misDiscountPrice)
                                    spu.reduce = m.misDiscountPrice
                                    spu.skuList.forEach( sku => {
                                        sku.skureduce = sku.skuSalePrice - spu.reduce
                                    })
                            }
                            
                        })
                    })

                    this.spuList = response.data.spuList
                    setTimeout(()=>{
                         this.spuList.forEach(spu=>{
                        $("#before"+spu.spuId).val(spu.reduce)
                        $("#before"+spu.spuId).click()
                    })

                    },300)
                   
                   /* item.skuList.forEach(sku => {
                            sku.checked = false
                            sku.skuSalePrice = ''
                        })*/
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
                this.showMsg('日期格式不合法')
                this.mktEnd = ""
                this.request.mktEnd = ""
                return
              }
            }
              val = val.replace(/-/g,"/")
                let end = new Date(val)
                if(end <= new Date()){
                  this.showMsg('过期时间不可以小于现在时间')
                  this.mktEnd = ""
                  this.request.mktEnd = ""
                  return
                }
            if( this.request.mktStart ){
                let start = new Date( this.request.mktStart.replace(/-/g,"/") )
                if( end < start ){
                    this.showMsg('生效时间不可以大于过期时间')
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
                this.showMsg(response.message);
            })
        }
    },
    ready() {   
          let dates = $("#createStartTime3,#createEndTime3");
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
             var option = this.id == "createStartTime3" ? "minDate" : "maxDate";
             dates.not(this).datepicker("option", option, selectedDate );
          },
          onClose: function(data,inst){   
             dates.removeAttr("disabled")
          },
          beforeShow: function(){
             dates.attr("disabled","disabled")
             if( $("#createStartTime3").datepicker( 'getDate' ) != null ){
               return
             }
              $(this).datepicker('option', 'minDate', new Date() )
          },
      });
          dates.on("click",function(){
           
            $(this).attr("disabled","disabled")
          })
        $("#submitform1").on("submit",this.addItem2);  
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