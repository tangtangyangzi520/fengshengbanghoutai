<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1200px'" >
            <div slot="content">
             <form  id='submitform3'>
            <br>
            <div class="form-group">
                <label for="title" class="col-sm-3 control-label">
                    模板名称：
                </label>
                    <div class="controls col-md-4">
                         <input type="text" class="form-control input-sm" v-model="pctName" placeholder="" required="required" maxLength="49" > 
                         <input type="submit" style="display:none" id="sub3">
                    </div>
            </div>
            <br><br>
            <div class="form-group">
                <label for="title" class="col-sm-3 control-label">
                    计费方式：
                </label>
                    <div class="controls col-md-2 ">
                        <input type="radio" name="menkan" v-model="" value="0" checked >按件数&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>  <br> 
            </div>
             <div class="form-group">
                <label for="title" class="col-sm-3 control-label">
                    配送区域：
                </label>
                        <div class="controls col-md-9" >
                <table class="table table-striped table-hover discount " >
                    <thead>
                          <tr style="background-color:#F2F2F2;height:50px;">
                           <!--  <th style="width:4%">
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll">全选</button>
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList">反选</button>
                            </th> -->
                            <th style="width:56%;text-align:left; border-right:none;border-left:none;">可配送区域</th>
                             <th style="width:11%; border-right:none; border-left:none;">首件（个）</th>
                            <th style="width:11%; border-right:none;border-left:none;">运费（元）
                               
                            </th>
                            <th style="width:11%; border-right:none;border-left:none;">续件（个）</th>
                           
                            <th style="width:11%; border-right:none;border-left:none;">续费（元）</th>
                        </tr>                
                    </thead>
                    <tbody >
                        <tr  @click="selectItem(g)" v-for="(index,g) in dataList" style="border-bottom:2px solid #D7D7D7"  >
                            <!-- 全选反选 <td style="text-align:center;vertical-align:middle;">
                                <input type="checkbox" :checked="item.checked"></input>
                            </td> -->
                            <td style="width:56%;text-align:left;vertical-align:middle;border-right:none;border-left:none;">
                               {{g.pctArea}}<br>
                               <button class="btn yellow-crusta" type="button" @click="showselect('tr'+count,index,g.pctArea)" >指定可配送区域和运费</button>
                            </td>
                            <td style="width:11%;text-align:center;vertical-align:middle;font-family: 'Arial Normal', 'Arial';font-weight: 400;font-style: normal;border-right:none;border-left:none;text-align:left"> &nbsp; &nbsp;{{g.pctFirstNum}}
                            </td>
                            <td style="width:11%;text-align:center;vertical-align:middle;border-right:none;border-left:none;text-align:left">
                                <input type="number" class="input-sm" v-model="g.pctFirstPrice"  min="0" max="999999" required="required"  @keyup="integer($event)" @change="integer($event)"> 
                            </td>

                            <td style="width:11%;text-align:center;vertical-align:middle;border-right:none;border-left:none;text-align:left">
                                                       &nbsp;&nbsp;{{g.pctOtherNum}}
                            </td>
                            <td style="width:11%;text-align:center;vertical-align:middle;border-right:none;border-left:none;text-align:left">
                                 <input type="number" class="input-sm" v-model="g.pctOtherPrice"  min="0" max="999999" required="required"  @keyup="integer($event)" @change="integer($event)"/> 
                            </td>
                        </tr>
                    </tbody>
                </table>
                   
                </div>  </div>
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
        <select-area v-if="!destroyControlDialog" :show="showSpuDialog" :onhide="hideselDialog" @area-data="getSelected" :area-str="areaString" :all-selected-area="allSelected" ></select-area>
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
import selectArea from './selectArea';
import client from '../../common/utils/client';
import {  mAlert, mSelect, mMultiSelect, itemList ,selectComponentAll} from '../../components';
export default {
    components: { mAlert, mSelect, mMultiSelect, itemList  ,selectComponentAll,selectArea},
    props: {
        pctArrs: [],
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
            shengNum:-1,
            pc:{},
            allSelected:'',
            areaString:'',
            index:-1,
            pctName:"",
            dataList:[{
                "pctArea": "",
                "pctFirstNum": 1,
                "pctFirstPrice": 0,
                "pctId": 0,
                "pctName": "",
                "pctOtherNum": 1,
                "pctOtherPrice": 0
              }],
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
            title: '新建运费模板',
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
         integer(event){
            let el = event.currentTarget;
            $(el).val(Math.abs($(el).val()))
            $(el).val(Math.round($(el).val()))
            var reg = /^\d{0,3}$/
            let s = $(el).val()+""
            let f = !reg.test(s)
            if (  f ) {
                    $(el).val("")
               }
         },
         addItem(){
              $("#sub3").click()
         },
         addItem2(ev) {
            let pctList = []
            let count = 0
            this.dataList.forEach( data =>{
                 if( data.pctArea != "" ){
                     data.pctName = this.pctName
                     pctList.push( data )
                     count += data.pctArea.split("、").length
                 }
            })
             if( pctList.length == 0){
              this.showMsg("请先选择可配送区域再保存")
              return
            }
            if(  this.shengNum > count ){
                 this.showMsg("运费模板必须包含所有省份")
                 return
            }
            if( pctList[0].pctId > 0 ){
                this.pc.pcName = this.pctName
                this.pc.pctSet = pctList
                client.postData( PCT_EDIT , this.pc ).then(data => {
                this.isLoading = true
                if (data.code == 200) {
                        this.showMsg("编辑运费模板成功")
                 this.isLoading = false
                    setTimeout(() => {
                        this.hideDialog()
                    }, 1000)
                } else {
                    this.showMsg(data.message);
                }
            }, data => {
                      this.showMsg("编辑运费模板失败;"+data.message);
             })

            }else{
                client.postData( PCT_CREATE ,{"pctSet":pctList,"pcName":this.pctName,}).then(data => {
                this.isLoading = true
                if (data.code == 200) {
                        this.showMsg("新健运费模板成功")
                 this.isLoading = false
                    setTimeout(() => {
                        this.hideDialog()
                    }, 1000)
                } else {
                    this.showMsg(data.message);
                }
            }, data => {
                      this.showMsg("新健运费模板失败;"+data.message)
                })
            }
             ev.preventDefault();  
        },
        //点击行自动选中或不选中
       selectItem(item) {
            item.checked = !item.checked;
        },
        //获取省份
        getshengList() { 
            console.log('获取省份信息')
            client.postData( AREA_GET_LIST , {}).then(data => {
                if (data.code == 200) {
                    this.shengNum = data.data.length;
                } else {
                    //this.showMsg(data.msg);
                }
            }, data => {
                this.showMsg("获取省份信息失败,请刷新重试");
            })
        },
        //展开 或 收起
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
          if( data != ""){
               this.dataList[this.index].pctArea = data
               if( this.dataList.length == this.index+1){
                     this.dataList.push({
                        "pctArea": "",
                        "pctFirstNum": 1,
                        "pctFirstPrice": 0,
                        "pctId": 0,
                        "pctName": "",
                        "pctOtherNum": 1,
                        "pctOtherPrice": 0
                    })
                  }
          }else{
            this.dataList[this.index].pctArea = data
          }
        },
        showselect(val,ind,str) {
             this.allSelected = ''
             this.dataList.forEach( (data,index )=>{
              if( data.pctArea != ''){
                  if( index == 0){
                      this.allSelected = data.pctArea
                  }else{
                      this.allSelected += ("、"+data.pctArea)
                  }
               }     
             })
             this.areaString = str
             this.index = ind
             this.trId = val
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
            this.dataList = []
            this.title = '编辑运费模板';
            this.pctName =  this.pctArrs.pcName
            this.pc = this.pctArrs
            this.dataList = this.pctArrs.pctSet
            this.dataList.push({
                        "pctArea": "",
                        "pctFirstNum": 1,
                        "pctFirstPrice": 0,
                        "pctId": 0,
                        "pctName": "",
                        "pctOtherNum": 1,
                        "pctOtherPrice": 0
                    })
            this.pctArrs = []
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
                this.title = '编辑运费模板';
                this.getPainList();
                this.tagsList = [];
                setTimeout(() => {
                    this.typesList = client.global.componentTypes;
                }, 30)
                return;
            }
            this.title = '编辑运费模板';
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
        $("#submitform3").on("submit",this.addItem2) 
         this.getshengList()     
    },
    beforeDestroy() {
        this.showPainListSelect = false;
    }
};
</script>
<style lang="less" scoped>
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
  .tab{
        text-align: center;
        border-collapse: collapse;
    }
  table,table tr th, table tr td { 
       text-align: center; 
       border:1px solid #eaeaea; 
    }
  td input{
    width:100%
   }

</style>