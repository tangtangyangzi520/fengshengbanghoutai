<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1100px'" >
            <div slot="content">
                <div class="row" style="background-color:#F0F0F0">
                    <form class="form-horizontal" name="addForm" role="form" id='submitform'>
                          <div class="col-md-12">   
                          <h5 > 基本信息 </h5> 
                          <hr> <br>
                          </div>
                          <br> 
                          <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>优惠券名称：
                            </label>
                            <div class="controls col-md-3">
                                <input type="text" class="form-control input-sm" v-model="request.mkcName" placeholder="" required="required" :maxLength="a"/>
                                <input id="sub" type="submit" style="display:none" id="name"/>
                            </div>&nbsp;&nbsp;10个字以内
                          </div>
    
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>发放总量：
                            </label>
                            <div class="col-md-2"  style="margin:0">
                                <input type="number" max="999999999" class="form-control input-sm" v-model="request.mkcTotalAmount" placeholder=""  required="required" min="0"/>
                            </div>
                            <label  class="col-sm-0 control-label" >
                               张
                            </label>
                        </div>
                        <div class="form-group" >
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>优惠形式：
                            </label>
                            <div class="col-md-8 nopadding">

                            <div class="col-md-3" >
                                <input type="radio"  v-model="" value="指定金额" checked >指定金额&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>
                               <br> <br>
                               <div class="col-md-2" >面值：</div>
                               <div class="col-md-3" ><input type="number" class="form-control input-sm" v-model="request.mkcPrice" placeholder="" required="required" max="9999999" min="0"/></div>
                                 <label  class="col-sm-0 control-label" >
                               元
                            </label>
                            <div style="color:red">优惠券不能抵扣运费</div>
                            </div>
                        </div>
                      

                         <div class="form-group" >
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>使用门槛：
                            </label>
                                       <div class="col-md-8 nopadding">

                            <div class="col-md-3" >
                                <input type="radio" name="menkan" v-model="menkan" value="0" checked >不限制&nbsp;&nbsp;&nbsp;&nbsp;
                                </div>
                                <br> <br>
                                <div class="col-sm-2" >
                                <input type="radio" name="menkan" v-model="menkan" value="1"  >满&nbsp;&nbsp;&nbsp;&nbsp; 
                                </div>
                                <div class="col-md-3" >  <input type="number" class="form-control input-sm" v-model="request.mkcUsedCondition" placeholder="" max="9999999" required="required" min="1"/></div>
                               
                               <label  class="col-sm-0 control-label" >
                               元可使用
                               </label>
                               <div style="color:red">使用门槛计算不包含运费</div>
                               </div>
                            </div>
                       
                        
                       <div class="col-md-12">  <h5 > 基本规则 </h5>  <hr> <br></div>
                       
                      
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>每人限领：
                            </label>
                            <div class="col-md-3">
                                <select class="form-control" v-model="request.mkcJoinTimes">
                                     <option value="0">不限张</option>
                                     <option v-for="item in timesList" :value="item">{{item}}张</option>
                                 </select>
                                <!-- <m-select :data="brandList" :placeholder="'请选择内容'" :change-func="selectTagStatusFunc" :class="'fixedIcon'"></m-select> -->
                            </div>
                        </div>
                        

                        <div class="form-group" >
                          <label for="title" class="col-sm-3 control-label">
                            <span class="required">* </span>有限期：
                          </label>
                          <div class="col-md-8 nopadding">

                            <div class="col-md-3" >
                              <input type="radio" name="" v-model="" value="不限制"  checked >固定日期&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>
                            <br> <br>
                            <label for="title" class="col-sm-3 control-label">
                              <span class="required">* </span>生效时间：
                            </label>
                            <div class="controls col-md-4 ">
                              <input type="text" class="form-control inline-block datePicker" placeholder="选择生效时间" id="createStartTime2" v-model="request.mktStart" required="required"> 
                            </div><br><br>
                            <label for="title" class="col-sm-4 control-label">
                              <span class="required">* </span>过期时间：
                            </label>
                            <div class="controls col-md-4 ">
                              <input type="text" class="form-control inline-block datePicker" placeholder="选择过期时间" id="createEndTime2" v-model="mktEnd" required="required"> <br>
                            </div>
                            <div class="col-sm-8" >
                              <input type="radio" name="lingquan" v-model="" value="不限制" checked>领到券当日开始 {{ time }} 天内生效<br><br>
                              <input type="radio" name="lingquan" v-model="" value="不限制"        >领到券次日开始 {{ time }} 天内生效
                            </div>
                          </div></div>
<br>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>可使用商品：
                            </label>
                            <div class="controls col-md-4">
                                <input type="radio" name="useful" v-model="useful" value="0" checked >全店商品&nbsp;&nbsp;&nbsp;&nbsp;
                                <input type="radio" name="useful" v-model="useful" value="1" >指定商品&nbsp;&nbsp;&nbsp;&nbsp;
                                <button class="btn yellow-crusta" type="button" @click="showselect" style="display:none" id="selectSpu">选择商品</button>
                            </div>
                        </div>
                        <div class="form-group" v-for="spu in spuList">
                        <table class="tab" id="t" style="width:1000px" border="1" cellspacing="0" cellpadding="0">  
                        <thead>
                          <tr>
                             <th style="width:10%">
                                 <a :id="'desc'+spu.spuId"  class="orderBy" style="display:none;text-decoration:none" @click="orderBy(false,spu.spuId)">▼</a>
                                 <a :id="'asc'+spu.spuId" class="orderBy" style="text-decoration:none" @click="orderBy(true,spu.spuId)">▲</a>
                                <input type="checkbox" :checked="spu.checked" @click="reverseList(spu)"></input>
                               <!--  <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll(spu)">全选</button>
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList(spu)">反选</button> -->
                             </th>
                             <th style="width:50%">{{spu.spuName}}</th>
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
                            <div class="controls col-md-6">
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
        mkttid: 0,
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
            menkan:0,
            useful :0,
            a:10,
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
        }
    },
    filters: {
        filterTime(time) {
            return client.formateTime(time);
        }
    },
    methods: {
         addItem(){
              $("#sub").click()
         },
         addItem2(ev) {

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
                        this.showMsg("编辑优惠券成功")
                 this.isLoading = false
                    setTimeout(() => {
                        this.hideDialog()
                    }, 1000)
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                      this.showMsg("编辑优惠券失败"+data.message);
             })

            }else{
                client.postData( MKT_CREATE , this.request).then(data => {
                this.isLoading = true
                if (data.code == 200) {
                        this.showMsg("新健优惠券成功")
                 this.isLoading = false
                    setTimeout(() => {
                        this.hideDialog()
                    }, 1000)
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                      this.showMsg("新健优惠券失败"+data.message)
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
        useful(val) {
          if(val == 0){
            $("#selectSpu").hide()
          }else{
            $("#selectSpu").show()
          }

        },
        coflag() {
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
                   //开始时间
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
                    //过期时间
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
                    //使用门槛回显
                    if(this.request.mkcUsedCondition > 0 ){
                      this.menkan = 1
                    }
                    this.request.mktEnd = this.mktEnd
                    //可使用商品回显
                    if( response.data.spuList.length > 0 ){
                       this.useful = 1
                    }
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
            if( this.request.mktStart ){
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
                this.showMsg('网络连接错误');
            })
        }
    },
    ready() {   
        
         $('#createStartTime2').val('').datetimepicker({ format: 'yyyy-mm-dd', language: 'zh-CN', autoclose: 'true', minView: 2 });
        $('#createEndTime2').val('').datetimepicker({ format: 'yyyy-mm-dd', language: 'zh-CN', autoclose: 'true', minView: 2 });
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

</style>