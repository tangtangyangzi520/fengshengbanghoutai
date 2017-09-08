<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1000px'" >
            <div slot="content" style="background-color:#F0F0F0">
               
                    

                       
                    <div >
                        <table class="tab" id="table" style="" border="1" cellspacing="0" cellpadding="0">  
                        <thead>
                          <tr>
                             <th>SKU组合</th>
                             <th><span style="color:red">*</span>丰盛榜售价</th>
                             <th>原价</th>
                             <th><span style="color:red">*</span>展示库存（件）</th>
                             <th>ERP实际库存</th>
                             <th>SKU编码</th>
                          </tr></thead>
                             <tbody id="itemList">
                                <tr v-for=" g in skuList" style="height:20%">
                                   <td style="width:43%" > <a class="dele" @click="close(g.skuId)" >×</a> {{ g.skuAtrr }} </td>
                                   <td>￥<input class=" input2" type="text" v-model="g.skuSalePrice"/></td>
                                   <td>￥<input class=" input2" type="text" v-model="g.skuMarketSalePrice"/></td>
                                   <td>  <input class=" input2" type="text" v-model="g.skuShowNum"/></td>
                                   <td>  <input class=" input2" type="text" v-model="g.skuStockNum"/></td>
                                   <td style="width:17%" > {{ g.skuCode }}  </td>
                                </tr>
                             </tbody>
                        </table>
                    </div>

    
        <!-- <loading :show="isLoading"></loading> -->
        <!-- 标签选择弹窗 -->
        </div><span slot="btnList">
                <button type="button" class="btn blue" @click="addItem()">编辑保存</button>
                <button type="button" class="btn default" @click="hideDialog()" >取消</button>
            </span></m-alert>
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
        skuflag:true,
        spuid2: 0,
        cflag: false,
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
                "skuRequestList":[],
            },
            hour : -1,
            minutes : -1,
            time :"",
            insurancelist: [],
            shangb :[],
            shangbanglist: [],
            sxlist: [],
            img:"http://img1.fshtop.com/1502701860183.jpg",
            xssxList:[],
            idnum:0,
            destroyControlDialog: false, //注销良言操作弹框
             expertEditId: '',
             showAddDialog: false,
            isLoading: false,
            showDialog: false,
            showPage: false,
            showPainListSelect: true,
            painIdsSelect: [],
            skuList: [],
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
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: 'SKU列表信息',
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
        close(i) {
            this.skuList.$remove(this.skuList.find(t => t.skuId === i))
            //let el = event.currentTarget;
            // $(el).parent().parent().children("td").remove()  
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
                console.log(this.skuList)
            client.postData("http://192.168.4.249:8086/eb-manager/sku/editProductSku", this.skuList).then(data => {
                if (data.code == 200) {
                    alert("新增成功")
                    this.showMsg("修改成功")
                    this.expertEditId = '';
                    this.showAddDialog = true;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.showMsg("修改失败,请重试");
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
         //this.getxbList()
         //this.getshangbangList(); 
         //this.getbrandList();
    },
    watch: {
        skuflag(){
            client.postData("http://192.168.4.249:8086/eb-manager/sku/getProductSkuBySpuId?spuId="+this.spuid2, {}).then(data => {
                this.isLoading = false;
                //if (data.code == 200) {
                   
                    this.skuList = data;
                    console.log(this.skuList)
                    
                //} else {
                  //  this.showMsg(data.msg);
                //}
            }, data => {
                this.isLoading = false;
            })
        },
        spuid2(val) {
            
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
                //this.title = '编辑基本信息';
                this.getPainList();
                this.tagsList = [];
                setTimeout(() => {
                    this.typesList = client.global.componentTypes;
                }, 30)
                return;
            }
            //this.title = '编辑基本信息';
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
</style>