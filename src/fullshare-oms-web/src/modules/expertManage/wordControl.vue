<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'800px'">
            <div slot="content">
                <div class="row" style="background-color:#F0F0F0">
                    <form class="form-horizontal" name="addForm" role="form">

                        <div class="form-group">
                            <label for="title" class="col-md-3 control-label">
                                <span class="required">* </span>商品类目： 
                                      
                            </label>
                            <label for="title" class="col-sm-3 control-label">
                                       <span >{{par[0]}}&nbsp;&nbsp;>&nbsp;&nbsp;{{par[1]}}&nbsp;&nbsp;>&nbsp;&nbsp;{{par[2]}}</span> 
                            </label>
                        </div>
    
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>商品名称：
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="data.title" placeholder="请输入良言标题">
                            </div>
                        </div>
    
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>商品广告词：
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="data.subtitle" placeholder="请输入良言文案">
                            </div>
                        </div>
                         
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>品牌：
                            </label>
                            <div class="col-md-4">
                                <m-select :data="brandList" :placeholder="'请选择内容'" :change-func="selectTagStatusFunc" :class="'fixedIcon'"></m-select>
                            </div>
                        </div>

                         <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>商品关键词：
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="data.title" placeholder="请输入良言标题">
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
                                <item-list :list="tagsList" :remove="removeTagItem"></item-list>
                                <a class="btn-select-label" @click="showTagDialog">
                                    <i class="fa fa-plus" style="position:relative;"></i> 添加标签
                                </a>
                            </div>
                        </div>
                        <div class="form-group" style="padding-top:10px;">
                            <label class="col-sm-3 control-label">
                                <span class="required">* </span>内容标签：</label>
                            <div class="controls col-md-9" style="padding-top:8px;">
                                <item-list :list="tagsList" :remove="removeTagItem"></item-list>
                                <a class="btn-select-label" @click="showTagDialog">
                                    <i class="fa fa-plus" style="position:relative;"></i> 添加标签
                                </a>
                            </div>
                        </div>
                        

                         <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>上榜理由：
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="data.title" placeholder="请输入良言标题">
                                <item-list :list="tagsList" :remove="removeTagItem"></item-list>
                                <a class="btn-select-label" @click="showTagDialog">
                                    <i class="fa fa-plus" style="position:relative;"></i> 添加理由
                                </a>
                            </div>
                        </div>
                        
    
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>专家观点：
                            </label>
                            <div class="controls col-md-7">
                                <textarea class="form-control input-sm" v-model="data.subtitle" placeholder="请输入良言文案">
                                </textarea> 
                            </div>
                        </div>
    
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>产地：
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="data.subtitle" placeholder="请输入良言文案">
                            </div>
                        </div>

                     <hr style="height:1px;border:none;border-top:1px solid red;" /><br>

                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                              <button type="button" class="btn yellow" @click="addProperty()">添加销售属性</button> 
                            </label>
                        </div>

                     <div id="div1" class="box">
                        <div class="form-group" >
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>丰盛榜售价：
                            </label>
                            <div class="controls col-md-2">
                               <input type="text" class="form-control input-sm" v-model="data.subtitle" placeholder="">
                        </div>
                            <label for="title" class="col-sm-2 control-label">
                                <span class="required">* </span>原价：
                            </label>
                            <div class="controls col-md-2">
                               <input type="text" class="form-control input-sm" v-model="data.subtitle" placeholder="">
                            </div>
                    </div>
                         <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>展示库存（件）：
                            </label>
                            <div class="controls col-md-2">
                               <input type="text" class="form-control input-sm" v-model="data.subtitle" placeholder="">
                            </div>
                            <label for="title" class="col-sm-2 control-label">
                                <span class="required">* </span>SKU编码：
                            </label>
                            <div class="controls col-md-2">
                               <input type="text" class="form-control input-sm" v-model="data.subtitle" placeholder="">
                            </div>
                        </div>
                     </div> 

                   <div id="base">
                        <div id="0" class="box2" style="display:none">                         
                            <input type="text" class="col-md-2 input" v-model="data.subtitle" placeholder="销售属性名称">
                            <br><br>                           
                            <input type="text" class="col-md-2 input" v-model="data.subtitle" v-for="i in 10 "placeholder="">
                        </div>
                    </div>
                    <div class="form-group"> 
                        <label for="title" class="col-sm-3 control-label">                         
                             <button type="button" class="btn green" v-on:click.native="dkej()">属性添加确定</button></div>
                        </label>
                    <div >
                        <table class="tab" id="table" style="display:none" border="1" cellspacing="0" cellpadding="0">  
                          <tr>
                             <th>SKU组合</th>
                             <th><span style="color:red">*</span>丰盛榜售价</th>
                             <th>原价</th>
                             <th><span style="color:red">*</span>展示库存（件）</th>
                             <th>ERP实际库存</th>
                             <th>SKU编码</th>
                          </tr>
                             <tbody id="itemList">
                                <tr v-for="group in xssxList">
                                   <td style="width:25%">{{ group }}</td>
                                   <td>￥<input class=" input2" type="text"/></td>
                                   <td>￥<input class=" input2" type="text"/></td>
                                   <td>  <input class=" input2" type="text"/></td>
                                   <td>  <input class=" input2" type="text"/></td>
                                   <td>  <input class=" input2" type="text"/></td>
                                </tr>
                             </tbody>
                        </table>
                    </div>

                      <br><hr style="height:1px;border:none;border-top:1px solid red;" /><br>

                         <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>运费设置：
                            </label>
                            <div class="controls col-md-4">
                                <input type="radio" name="yunfei" checked="">统一邮费：
                                
                                ￥<input type="text" class="form-control " v-model="data.subtitle" placeholder="0.00">
                                <br>
                                 <input type="radio" name="yunfei" >运费模板&nbsp;&nbsp;&nbsp;&nbsp;
                                
                                 <select class="form-control" v-model="thirdActive">
                                     <option value="0">请选择</option>
                                     <option v-for="item in chanelList" :value="item.id">{{item.text}}</option>
                                 </select>
                            </div>
                        </div>

                         <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>每人限购：
                            </label>
                            <div class="controls col-md-4">
                                <input type="text" class="form-control input-sm" v-model="data.subtitle" placeholder="请输入良言文案">
                            </div>
                        </div>

                         <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>参与消保类型：
                            </label>
                            <div class="controls col-md-4">
                                <input type="checkbox"  v-model="data.subtitle" >&nbsp;&nbsp;7天无理由退货<br>
                                <input type="checkbox"  v-model="data.subtitle" >&nbsp;&nbsp;48小时快速发货<br>
                                <input type="checkbox"  v-model="data.subtitle" >&nbsp;&nbsp;假一赔十<br>
                                <input type="checkbox"  v-model="data.subtitle" >&nbsp;&nbsp;无忧退货<br>
                                <input type="checkbox"  v-model="data.subtitle" >&nbsp;&nbsp;商品如实描述<br>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>包装清单：<br><font color="#A8A8A8">200字以内</font>
                            </label>
                            <div class="controls col-md-7">
                                <textarea class="form-control input-sm" v-model="data.subtitle" placeholder="请输入良言文案">
                                </textarea> 
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>开始时间：
                            </label>
                            <div class="controls col-md-4">
                                <input type="radio" name="startTime" checked>立刻                                                              
                                <br>
                                <input type="radio"  name="startTime">设定<br>                           
                                <select  >
                                    <option value="0">请选择</option>
                                    <option v-for="item in chanelList" :value="item.id">{{item.text}}</option>
                                </select>&nbsp;&nbsp;
                                <select  >
                                    <option value="0">请选择</option>
                                    <option v-for="item in chanelList" :value="item.id">{{item.text}}</option>
                                </select>&nbsp;&nbsp;
                                <select  >
                                    <option value="0">请选择</option>
                                    <option v-for="item in chanelList" :value="item.id">{{item.text}}</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group" v-show="false">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>关注点</label>
                            <div class="controls col-md-6">
                                <m-multi-select :data="painList" v-if="showPainListSelect" :active-items="painIdsSelect" :placeholder="'请选择关注点'" :change-func="selectPainFunc"></m-multi-select>
                            </div>
                        </div>
                        <!-- 标签选择 
                        <div class="form-group" style="padding-top:10px;">
                            <label class="col-sm-3 control-label">
                                <span class="required"></span>标签</label>
                            <div class="controls col-md-9" style="padding-top:8px;">
                                <item-list :list="tagsList" :remove="removeTagItem"></item-list>
                                <a class="btn-select-label" @click="showTagDialog">
                                    <i class="fa fa-plus" style="position:relative;"></i> 添加标签
                                </a>
                            </div>
                        </div>   -->
                    </form>
                </div>
            </div>
            <span slot="btnList">
                <button type="button" class="btn blue" @click="addItem()">下一步</button>
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
        <!-- 标签选择弹窗 -->
        <tag-tree v-if="showTagTreeSelect" :list="tagsList" :onselect="selectTagFunc" :oncancel="showTagDialog"></tag-tree>
        <template-control v-if="!destroyControlDialog" :id="expertEditId" :show="showAddDialog" v-bind:par="sele" :onhide="hideAddDialog" ></template-control> 
        </div>
    </div>
</template>
<script>
import client from '../../common/utils/client';
import tagTree from '../common/tagTree';
import templateControl from './templateControl';
import { selectPic, mAlert, mSelect, mMultiSelect, itemList } from '../../components';
export default {
    components: { selectPic, tagTree, mAlert, mSelect, mMultiSelect, itemList ,templateControl },
    props: {
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
        }
    },
    data() {
        return {
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
                "painIds": [],
                "subtitle": "",
                "title": ""
            },
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '编辑基本信息',
            tagsList: [],             //选择的标签
            showTagTreeSelect: false, //显示标签选择弹窗
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
    methods: {
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
            let flag = false
            let a = new Array();
           $("#base div[id!=\"0\"]").each(function(index,v){
                     let arr = new Array()
                     flag = false
                $(v).children("input").each(function(i,val){
                    if( i == 0 && $.trim( $(val).val() ) == ""){
                        alert(this.showAlertTitle+"属性名称不能为空!")
                        return false
                    }
                    if( i >= 1 && $.trim( $(val).val() ) != ""){
                        arr.push( $(val).val() )
                        flag = true
                    }
                })
                if(flag){
                    a.push(arr)
                }else{
                    alert(this.showAlertTitle+"属性值不能为空!")
                    return false
                }     
           })
           if(flag){
               this.xssxList = this.multiCartesian(a); 
               $("#table").show()
           }
         
        },
        closeProperty(event) { 
            alert(1)
           /* let el = event.currentTarget;
           $(el).parent().parent().remove()
           alert(2)*/
        },
         addProperty(){ 
             var el = $("#0").clone(true,true).attr("id",++this.idnum).append("<span class=\"\" v-on:click=\"dkej()\">×</span>").show()
             el.prependTo($("#base"))
             
             $("#div1").hide()            
         },
         addItem() {
            this.expertEditId = '';
            this.showAddDialog = true;
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
        //获取品牌
        getbrandList() { 
        client.postData("http://localhost:8086/eb-manager/pbd/list", {"keyword": "string",
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
            this.par = []
            this.showDialog = false;
            setTimeout(() => {
                this.showPage = false;
                this.onhide();
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
         this.getbrandList();
    },
    watch: {
        par(){
            alert("watch"+this.par);
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
    .box{
        //margin-left: 2%;
        //overflow-x: scroll;
        height: 100px;
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
        width: 85%
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
    table,table tr th, table tr td { text-align: center; border:1px solid #0094ff; }
</style>