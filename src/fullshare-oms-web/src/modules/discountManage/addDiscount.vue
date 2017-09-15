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
                    </div>&nbsp;&nbsp;15个字以内
            </div>
            <div class="form-group">
                <label for="title" class="col-sm-3 control-label">
                    <span class="required">* </span>生效时间：
                </label>
                    <div class="controls col-md-2 ">
                        <input type="text" class="form-control inline-block datePicker" placeholder="选择生效时间" id="createStartTime3" v-model="request.mktStart" required="required" 
                          /> 
                    </div>
                       <div class="col-md-1 ">至</div>
                    <div class="controls col-md-2 nopadding ">
                       <input type="text" class="form-control inline-block datePicker" placeholder="选择过期时间" id="createEndTime3" v-model="mktEnd" required="required" 
                        pattern="^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$">
                  </div>  <br> 
            </div>
            <div class="form-group">
                <label for="title" class="col-sm-3 control-label">
                    <span class="required">* </span>活动标签：
                </label>
                    <div class="controls col-md-4">
                         <input type="text" class="form-control input-sm"  value="数据库暂无此字段,可不填" placeholder="限时折扣"  required="required" oninvalid="setCustomValidity('请输入活动标签!')"> 
                         活动期间展示于商品详情的价格旁边，2至5字。                                
                         <input id="sub1" type="submit" style="display:none" >

                    </div>
            </div>
           
             <div class="form-group">
                <label for="title" class="col-sm-3 control-label">
                    <span class="required">* </span>选择商品：
                </label>
                    <!-- <div class="controls col-md-4">
                         <input type="text" class="form-control input-sm" v-model="request.spuName" placeholder="限时折扣" > 
                         活动期间展示于商品详情的价格旁边，2至5字。
                    </div> -->
                      <button class="btn yellow-crusta" type="button" @click="showselect" >选择商品</button>

            </div>
                        <div class="form-group" v-for="spu in spuList">
                        <table class="tab" id="t" style="width:1000px" border="1" cellspacing="0" cellpadding="0">  
                        <thead>
                          <tr>
                             <th style="width:20%">
                                 <a :id="'desc'+spu.spuId"  class="orderBy" style="display:none;text-decoration:none" @click="orderBy(false,spu.spuId)">▼</a>
                                 <a :id="'asc'+spu.spuId" class="orderBy" style="text-decoration:none" @click="orderBy(true,spu.spuId)">▲</a>
                               
                             </th>
                             <th style="width:40%">
                                  <p>
                                    <a target="_blank" :href="spu.imgUrl" title="查看大图">
                                        <img :src="spu.imgUrl" class="img-rounded" style="height:60px; width:80px">
                                    </a>
                                </p>
                                <a  style="text-decoration:none;" title="预览商品"  > 
                                <h4 class="tt"><p style="color:#6699CC">{{spu.spuName}}</p><span style="color:#FF9900">¥{{spu.minSalePrice}}</span>
                                &nbsp;&nbsp;&nbsp;&nbsp;库存:{{spu.totalSaleNum}}</h4>
                                </a>
                             </th>
                             <th style="width:20%"> 批量减价 <input type="text" class="input-sm"  @keyup="reduceBefore(spu.spuId,spu.minSalePrice,$event)" :id="'before'+spu.spuId" >  </th>
                             <th style="width:15%"> 减价后<input type="text" class="input-sm" @keyup="refuceAfter(spu.spuId,spu.minSalePrice,$event)" :id="'after'+spu.spuId" > </th>
                             <th style="width:5%"></th>
                          </tr>
                          
                        </thead>
                             <tbody :id="'tab'+spu.spuId" style="display:none">
                                <tr >   
                                  <td style="width:20%">
                                        
                                     <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll(spu)">全选</button>
                                     <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList(spu)">反选</button>
                                  </td>
                                  <td style="width:40%"> SKU组合 </td>
                                  <td style="width:20%"> 原价（元） </td>
                                  <td style="width:15%"> 减价后</td>
                                  <td style="width:5%"> 操作</td>
                                </tr>
                                <tr v-for=" g in spu.skuList" style="height:20%"  @click="selectItem(g)">  
                                   <td style="width:20%"> <input type="checkbox" :checked="g.checked"></input> </td>
                                   <td style="width:40%"> {{ g.skuName }} </td>
                                   <td style="width:20%"> {{ g.skuMarketProPrice }}</td>
                                    <td style="width:15%"> <input type="text" class="input-sm" v-model="g.skuSalePrice"  >  </td>
                                    <td style="width:5%"> 
                                    <button type="button"  @click.stop="showControlFunc(item,'delete')" class="btn btn-xs red">删除</button> </td>
                                </tr>
                             </tbody>
                        </table>
                   
                </div>
                 </form>
            </div>

            <span slot="btnList">
                <button type="button" class="btn blue" @click="addItem()">保存</button>
                <button type="button" class="btn default" @click="hideDialog()" >取消</button>
            </span>
        </m-alert>
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
        <select-spu v-if="!destroyControlDialog" :show="showSpuDialog" :onhide="hideselDialog" @spu-data="getSelected"></select-spu>
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
            mktEnd:"",
            spuList:[],
            time:"",
            mkcUsedCondition:0,
            timesList:[1,2,3,4,5,10],
            request:{
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
        }
    },
    filters: {
        filterTime(time) {
            return client.formateTime(time);
        }
    },
    methods: {
         refuceAfter(id , min) {
             let el = event.currentTarget
             var reg = /^-?\d{0,9}\.?\d{0,2}$/
             let s = $(el).val()+""
             let f = !reg.test(s)
             if (  f ) {
                   $(el).blur()
                   $(el).val("")
                   $("#before"+id).val('')
                    this.spuList.forEach(spu =>{
                        if(spu.spuId == id){
                        spu.skuList.forEach(sku =>{
                        sku.skuSalePrice = '' 
                        })
                    }
                })
                   this.showMsg("请输入数字")
                   return
               }
             this.spuList.forEach(spu =>{
                if(spu.spuId == id){
                    let price = ( min - $("#after"+id).val() ).toFixed(2)
                    if( price < 0 ){
                        $(el).blur()
                        this.showMsg("减价后售价不能高于原价")
                         $("#before"+id).val('')
                         $("#after"+id).val('')
                         spu.skuList.forEach(sku =>{
                         sku.skuSalePrice = ""
                        })

                        return false
                    }else{
                         $("#before"+id).val( price )
                         spu.skuList.forEach(sku =>{
                         sku.skuSalePrice = sku.skuMarketProPrice - price
                        })
                    } 
                }
             })
         },
         reduceBefore(id , min,event) {
             let el = event.currentTarget
             var reg = /^-?\d{0,9}\.?\d{0,2}$/
             let s = $(el).val()+""
             let f = !reg.test(s)
             if (  f ) {
                   $(el).blur()
                   $(el).val("")
                   $("#after"+id).val('')
                   this.spuList.forEach(spu =>{
                        if(spu.spuId == id){
                        spu.skuList.forEach(sku =>{
                        sku.skuSalePrice = ''
                        })
                    }
                })
                   this.showMsg("请输入数字")
                   return
               }
             this.spuList.forEach(spu =>{
                if(spu.spuId == id){
                    let price = ( min - $("#before"+id).val() ).toFixed(2)
                    if( price < 0 ){
                        $(el).blur()
                        this.showMsg("减价后售价不能少于0")
                        $("#before"+id).val('')
                        $("#after"+id).val('')
                         spu.skuList.forEach(sku =>{
                         sku.skuSalePrice = ""
                        })
                        return false
                    }else{
                        $("#after"+id).val( price )
                        spu.skuList.forEach(sku =>{
                        sku.skuSalePrice = sku.skuMarketProPrice - $("#before"+id).val() 
                        })
                    }
                }
             })
         },
         addItem(){
              $("#sub1").click()
         },
         addItem2(ev) {
            this.request.cmisList = []
            this.spuList.forEach(item => {
               item.skuList.forEach(sku => {
                    if( sku.skuSalePrice != '' ){
                       this.request.cmisList.push( {
                          "enableStatus": 1,//0-无效，1-有效
                          "misCampaignId": 0,//活动主键
                          "misDiscountPrice": sku.skuSalePrice,//限时折扣价
                          "misMandatory": 1,//是否必要产品：0-非必要产品，1-必要产品
                          "misMcnId": 0,  //条件主键
                          "misSkuId": sku.skuId, //产品主键
                          "misType": 1 ,//商品类型：1-a商品，2-b商品 
                        })
                    }
                })
            })
            if( this.request.mkcCampaignId > 0 ){
                client.postData( MKT_EDIT , this.request).then(data => {
                this.isLoading = true
                if (data.code == 200) {
                        this.showMsg("编辑限时折扣成功")
                 this.isLoading = false
                    setTimeout(() => {
                        this.hideDialog()
                    }, 1000)
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                      this.showMsg("编辑限时折扣失败"+data.message);
             })

            }else{
                client.postData( MKT_CREATE , this.request).then(data => {
                this.isLoading = true
                if (data.code == 200) {
                        this.showMsg("新健限时折扣成功")
                 this.isLoading = false
                    setTimeout(() => {
                        this.hideDialog()
                    }, 1000)
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                      this.showMsg("新健限时折扣失败"+data.message)
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
                $("#tab"+id).show()
            }else{
                $("#asc"+id).show()
                $("#desc"+id).hide()
                $("#tab"+id).hide()
            }
            
        },
        selectAll(val) {
            val.skuList.forEach(item => {
                item.checked = true;
            })
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
        dflag() {
          client.postData(  MKT_GET_ID  +"?mkcCampaignId="+this.mkcid , {}).then(response => {
                this.isLoading = false;
                if (response.code == 200) {
                   this.request.mkcCampaignId =  response.data.mkcCampaignId
                   this.request.mkcName = response.data.mkcName
                   var sjtime  = new Date(response.data.mktStart)
                    this.request.mktStart = sjtime.getFullYear() 
                    if( sjtime.getMonth()+1 >= 10 ){
                          this.request.mktStart += "-"+(sjtime.getMonth()+1)
                    }else{
                        this.request.mktStart += "-0"+(sjtime.getMonth()+1)
                    }
                    if( sjtime.getDate() >= 10 ){
                         this.request.mktStart += "-"+sjtime.getDate()
                    }else{
                        this.request.mktStart += "-0"+sjtime.getDate()
                    }

                    var endtime  = new Date(response.data.mktEnd)
                    this.mktEnd = endtime.getFullYear() 
                    if( endtime.getMonth()+1 >= 10 ){
                          this.mktEnd += "-"+(endtime.getMonth()+1)
                    }else{
                        this.mktEnd += "-0"+(endtime.getMonth()+1)
                    }
                    if( endtime.getDate() >= 10 ){
                         this.mktEnd += "-"+endtime.getDate()
                    }else{
                        this.mktEnd += "-0"+endtime.getDate()
                    }
                    this.request.mktEnd = this.mktEnd
                    //
                  
                    response.data.spuList.forEach( spu => {
                        spu.skuList.forEach( sku => {
                             sku.checked = false
                             sku.skuSalePrice = ""
                             response.data.misList.forEach(m => {
                                  if( m.misSkuId == sku.skuId ){
                                    sku.checked = true
                                    sku.skuSalePrice = m.misDiscountPrice
                                  }
                             })
                        })
                    })
                    this.spuList = response.data.spuList
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
            if( this.request.mktStart ){
                this.request.mktEnd = ""
                val = val.replace(/-/g,"/")
                let end = new Date(val)
                let start = new Date( this.request.mktStart.replace(/-/g,"/") )
                if( end < start ){
                    this.showMsg('生效时间不可以大于过期时间')
                    this.mktEnd = ""
                    this.request.mktEnd = ""
                    return
                }
                this.time = (end - start)/24/3600/1000
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
        
         $('#createStartTime3').val('').datetimepicker({ format: 'yyyy-mm-dd', language: 'zh-CN', autoclose: 'true', minView: 2 });
        $('#createEndTime3').val('').datetimepicker({ format: 'yyyy-mm-dd', language: 'zh-CN', autoclose: 'true', minView: 2 });
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