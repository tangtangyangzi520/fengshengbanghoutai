<template>

    <div style="background-color:white">
        <div class="page-bar min-bar">
            <page-title-bar>
                <span slot="title">运费模板列表</span>
            </page-title-bar>
            <a><div  id="6" class="cha3"    style="float:left"    @click="changeClass(-1)">快递发货</div></a>  
           <!--  <a> <div id="0" class="select2"  style="float:left"   @click="changeClass(0)">未开始</div></a>   
            <a><div  id="2" class="select2"  style="float:left"  @click="changeClass(2)">进行中</div></a>
            <a><div  id="1" class="select2"  style="float:left"  @click="changeClass(1)">已结束</div></a> -->
            <br>
                <p style="text-align:center">
                    <hr style="height:3px;background-color:white;width:99%;margin-left:0.4%" >
                </p>
           
            <button class="btn" type="button"  @click="addItem('add')" style="margin-left:6px;float:left;margin-top:10px;background-color:#1E90FF;color:white">新增运费模板</button>

            <span style="float:right;display:inline-block;margin-bottom:10px;margin-right:0.4%">
                 <span  style="display:inline-block;"> 
                       <search :onchange="changeSearchOptions" :oncreate="getList" :parent="par" :cflag="flag" ></search>
                 </span>
                 <!-- <button class="btn green-meadow" @click="search()" type="button" style="background-color:#66CC33">搜索</button> -->
            </span>
            <br>
            <!-- <div class="col-md-12 right" style="display:inline-block">
                <span v-if="selectItems.length>0" class="desc">已选
                    <em>{{selectItems.length}}</em> 项 </span>
                
            </div> -->
            
        </div>
        <br> <h4 style="text-align:center" v-if="dataList.length==0"> 暂无数据,请先新增运费模板 </h4>
        <div class="contentBlock" >
            <div class="table-responsive col-md-12" v-for="items in dataList" >
                <table class="table table-striped table-bordered table-hover discount " >
                    <thead>
                        <tr style="background-color:#F2F2F2;height:55px;">
                           <!--  <th style="width:4%">
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll">全选</button>
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList">反选</button>
                            </th> -->
                            <th style="width:35%;text-align:left;border-right:none;border-left:none; ">&nbsp;&nbsp;{{items[0].pctName}}</th>
                            <th colspan="2" style="width:33%;text-align:left;border-right:none;border-left:none;">
                                <h5>最后编辑时间<span v-if="items[0].pctModifyTime > 0">{{items[0].pctModifyTime|filterTime}}</span></h5></th>                       
                            <th colspan="2" style=" width:32%;text-align:left;border-right:none;border-left:none;">  
                            <span v-if="dataList.length > 0">
<!--                              <button type="button"  class="btn btn-xs yellow-crusta" @click.stop="showControlFunc(items,'submit')">复制模板</button>  
 -->                             <button type="button"  class="btn btn-xs blue" @click.stop="editItem(items)">修改</button>
<!--                              <button type="button"  class="btn btn-xs default" @click.stop="editItem(items)">删除</button>
 -->                             <a :id="'desc'+items[0].pctId"  class="orderBy" style="text-decoration:none" @click="orderBy(false,items[0].pctId)">▼</a>
                             <a :id="'asc'+items[0].pctId" class="orderBy" style="display:none;text-decoration:none" @click="orderBy(true,items[0].pctId)">▲</a>
                         </span>
                         </th>
                     </tr>
                       
                    </thead>
                    <tbody  :id="'tab'+items[0].pctId" >
                         <tr style="background-color:#white;height:40px;border-bottom:4px solid #D7D7D7;">
                           <!--  <th style="width:4%">
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll">全选</button>
                                <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList">反选</button>
                            </th> -->
                            <th style="width:35%;text-align:left; border-right:none;border-left:none;">可配送区域</th>
                             <th style="width:20%; border-right:none; border-left:none;">首件（个）</th>
                            <th style="width:13%; border-right:none;border-left:none;">运费（元）
                               
                            </th>
                            <th style="width:12%; border-right:none;border-left:none;">续件（个）</th>
                           
                            <th style=" border-right:none;border-left:none;">续费（元）</th>
                        </tr>
                        <tr  @click="selectItem(items)" v-for="item in items" style="border-bottom:2px solid #D7D7D7;">

                            <!-- 全选反选 <td style="text-align:center;vertical-align:middle;">
                                <input type="checkbox" :checked="item.checked"></input>
                            </td> -->
                            <td style="width:35%;text-align:left;vertical-align:middle;border-right:none;border-left:none;">
                                <!-- <p>
                                    <a target="_blank" :href="item.imgUrl" title="查看大图">
                                        <img :src="item.imgUrl" class="img-rounded" style="height:60px; width:80px">
                                    </a>
                                </p> -->
                            <!-- <a  style="text-decoration:none;" title="预览商品"  @click.stop="previewpro(item.spuId)"> 
                                <h4 class="tt"><p style="color:#6699CC">商品编码:{{item.spuCode}}</p>{{item.spuName}}</h4>
                            </a> --> {{item.pctArea}}

                            </td>
                            <td style="width:13%;text-align:center;vertical-align:middle;font-family: 'Arial Normal', 'Arial';font-weight: 400;font-style: normal;border-right:none;border-left:none;text-align:left;">
                                     &nbsp;&nbsp; {{item.pctFirstNum}}
                            </td>
                            <td style="text-align:center;vertical-align:middle;border-right:none;border-left:none;text-align:left">
                               <!--  商品状态 -->
                                <!--  <span class="label label-default" v-if="item.deployStatus==4">{{item.spuCatId|filterStatus}}</span>
                                <template v-else>
                                    <span class="label label-success" v-if="item.deployStatus==2">{{item.spuReferLayout|filterStatus}}</span>
                                    <span class="label label-info" v-else>{{item.spuReferLayout|filterStatus}}</span>
                                </template> -->
                              &nbsp;&nbsp; {{item.pctFirstPrice}}
                            </td>

                            <td style="text-align:center;vertical-align:middle;border-right:none;border-left:none;text-align:left">
                               &nbsp;&nbsp; {{item.pctOtherNum}}
                            </td>
                            
                          <!--   <td style="text-align:center;vertical-align:middle;">{{item.spuModifyTime|filterTime}}</td>
                            <td style="text-align:center;vertical-align:middle;">{{item.spuModifyTime|filterTime}}</td> -->
                            <td style="text-align:center;vertical-align:middle;border-right:none;border-left:none;text-align:left">
                                  &nbsp;&nbsp; {{item.pctOtherPrice}}
                            </td>
                        </tr>
                        <tr v-if="dataList.length==0">
                            <td colspan="9" >暂无数据</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <form action="" id="exportForm" method="post"> 
               <input type="hidden" name="request" /> 
             <!--   <input type="hidden" name="skuCode" v-model="skuCode"/> 
               <input type="hidden" name="spuCatId" v-model="spuCatId"/> 
               <input type="hidden" name="skuCode" v-model="skuCode"/>  -->
        </form>
       <!--  <paging :current-page="page.currentPage" :page-size="page.pageSize" :start-index="page.startIndex" :total-page="page.totalPage" :total-size="page.totalSize" :change="getList"></paging> -->
        <control :show="showControl" :items="clickItems" :onhide="hideControlFunc" :type="controlType"></control>
         <addpct v-if="!destroyControlDialog" :id="expertEditId" :show="showAddDialog" :onhide="hideAddDialog"  :closepar="getList" :dflag="disflag" :pct-arrs="pctArr"></addpct> 
      
        <m-alert :title="'提交'" :show-cancel-btn="true" :show="showSubmitDialog" :onsure="ajaxControl" :onhide="hideMsg">
            <div slot="content">确定提交吗？</div>
        </m-alert>
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
        
        <loading :show="isLoading"></loading>
    </div>
</template>
<script>
import client from '../../common/utils/client';
import { pageTitleBar, paging, itemControl, mMultiSelect, mAlert, mSelect } from '../../components';
import search from './search';
import control from './control';
import loading from '../common/loading';
import addpct from './addpct';
/*import orderList from './orderList';
import preview from './preview';
import manageControl from './manageControl';
import productControl from './productControl';
import EditProductControl from './EditProductControl';
import EditSkuControl from './EditSkuControl';*/

let vueThis = null;

export default {
    
    components: { pageTitleBar, paging, itemControl, mAlert, mMultiSelect, mSelect, search, control,addpct, loading,/* manageControl,productControl,categoryControl,EditProductControl,EditSkuControl,preview ,orderList*/ },
    data() {
        return {
            disflag:false,
            pctArr:[],
            lflag:false,
            pflag:true,
            flag:true,
            par : -100,
            isLoading: false,
            dataList: [],
            page: {},   // 分页请求数据
            showAlert: false,
            showAddDialog: false,   //新增商品
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            limitResource: null, //发布状态
            clickItems: [],   //点击操作的数据项
            controlType: '',  //当前操作的权限类型
            showControl: false, //显示操作弹窗
            destroyControlDialog: false, //注销良言操作弹框
            expertEditId: '',
            showEditDialog:false,  //编辑商品
            showEditspuDialog:false,  //编辑商品
            showpreDialog:false,
        }
    },
    computed: {
        selectItems() {
            let list = [];
            this.dataList.forEach(item => {
                item.checked && list.push(item);
            })
            return list;
        }
    },
    filters: {
        filterStatus(id) {
           // return client.global.componentStatus.find(item => item.id == id).name;
        },
        filterTime(time) {
            return client.formateTime(time);
        }
    },
    methods: {
        editItem(arr) {
            this.pctArr = []
            arr.forEach((item,index)=>{
                this.pctArr.$set(index,item);
             })
            this.disflag = !this.disflag
            this.showAddDialog = true;
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
        hideDialog2() {
                this.showpreDialog = false
                setTimeout(() => {
                this.onhide('cancel');
            }, 300)
        },
        search(){
            this.flag = ! this.flag
        },
        hideEditspuDialog(control) {
            this.expertEditId = '';
            this.showEditspuDialog = false;
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
                this.getList();
            }

         } ,
        //点击改变样式
        changeClass(obj) {
                $("#desc").show()
                $("#asc").hide()
             $("#"+obj).removeClass("select3").addClass("cha3");
            if(obj == "-1"){
              $("#0,#2,#1").removeClass("cha3").addClass("select3");
                this.par = -1
            }else if(obj == "0"){
                $("#-1,#2,#1").removeClass("cha3").addClass("select3");
                this.par = 0
            }else  if(obj == "2"){
                $("#-1,#0,#1").removeClass("cha3").addClass("select3");
                this.par = 2
            }else{
                $("#0,#2,#-1").removeClass("cha3").addClass("select3");
                this.par = 1
            }
             //this.getList(false,true);
        },
        //打开编辑页面
        showEdit(item, type) {
            this.pflag = !this.pflag
            this.controlType = type
            this.spu = 0
            this.spu = item
            console.log(this.spu)
            this.show()
        },
        show(){
             this.showEditDialog = true;
        },
        //添加良言
        addItem(val) {
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
                this.getList();
            }
        },
        // 搜索条件变化
        changeSearchOptions(options) {
            this.searchOptions = options;
        },
        showControlFunc(item, type) {

            this.controlType = type;this.showControl = true;
             //this.showEditDialog = true;
            //console.log(item);
            if (!item) {
                if (this.selectItems.length != 0) {
                    this.clickItems = this.selectItems;
                    this.showControl = true;
                }
            } else {
                this.clickItems.push(item);
                if (type == 'edit') {
                    //this.expertEditId = item.componentId;
                    this.showAddDialog = true;
                } else {
                    this.showControl = true;
                }
            }
        },
        hideControlFunc(type) {
            if (type == 'success') {
                this.getList();
            }
            this.showControl = false;
        },
        //查询列表数据
        getList(page, firstSearch) {
            let options;
            if (!firstSearch) {
                // 拿最后一次请求的参数
                options = this.lastSearchOptions;
            } else {
                options = Object.assign({}, this.searchOptions);
            }
            if (page) {
                options.page = page;
            }
            this.isLoading = true;
            this.dataList = [];
            this.lastSearchOptions = options;
            client.postData( PCT_LIST , options).then(data => {  //192.168.4.249
                this.isLoading = false;
                if (data.code == 200) {
                    let total = new Array()
                    let branch = new Array()
                    let name = ""
                    data.data.forEach(item => {
                        item.checked = false;
                        if(name != ""){
                            if(name == item.pctName){
                                branch.push(item)
                            }else{
                                name = item.pctName
                                total.push(branch)
                                branch = new Array()
                                branch.push(item)
                            }
                        }else{
                           name = item.pctName
                           branch.push(item)
                        }
                    })
                    if(branch.length > 0 ){
                       total.push(branch)
                    }
                    this.dataList = total
                    //alert(total.length)
                    this.page = data.page;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
                this.isLoading = false;
            })
        },
        selectAll() {
            this.dataList.forEach(item => {
                item.checked = true;
            })
        },
        reverseList() {
            this.dataList.forEach(item => {
                item.checked = !item.checked;
            })
        },
        selectItem(item) {
            item.checked = !item.checked;
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
            this.showEditDialog = false
            this.showAddDialog = false
            this.showEditspuDialog = false
        }
    },
    created() {
        vueThis = this;
        this.getList()
        this.limitResource = JSON.parse(localStorage.getItem('limitResource'));
    },
    watch: {
    },
    route: {
        canReuse: () => {
            vueThis.getList(false, true);
        }
    },
    ready() {
        client.resetListHeight();
    }
};
</script>

<style lang="less">
@import "../../common/css/common.less";
@import "../../common/css/list.less";
.select3{
    margin-left: 3px;
    border:10px solid gray;
    border-bottom:0px solid white;
    border-width:1px;
    height: 30px;
    width: 100px;
    display:inline-block;
    text-align:center;
    line-height: 30px;
    font-weight:bold;
};
.cha3{
    margin-left: 6px;
    color:black;
    border-width:1px;
    height: 30px;
    width: 100px;
    display:inline-block;
    text-align:center;
    line-height: 30px;
    background-color: #F0F0F0
    
};
td{
    text-align: center;
    vertical-align: middle
};
 .tt:hover {
   color:#6699CC
};
.orderBy:hover{
    color:red;
    text-decoration:none
}
.discount td{
     border-right:none; 
    border-left:none;
}
 th{
     border-right:none; 
     border-left:none;
}
</style>