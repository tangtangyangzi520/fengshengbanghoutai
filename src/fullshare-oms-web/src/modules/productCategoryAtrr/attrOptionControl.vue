<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;"  v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :idp="pcaId" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'30%'">
            <div slot="content">
                <div class="row">
                    <div>
                         <button type="button" class="btn btn-xs blue" @click="addOption()" style="position:fixed;right:15%;top:10%;">添加</button>
                    </div>
                <!-- <div style="position: absolute;top:30px;left:0;width:100%;height:100%;overflow :auto">  -->
                    <form class="form-horizontal" name="addForm" role="form">
                            <table class="table table-striped table-bordered table-hover" id="attrOption-table">
                                <thead>
                                    <tr>
                                    <th style="width:;">属性值</th>
                                    <th style="width:;">操作</th>
                                    </tr>
                                </thead>
                                <tbody id="attrOptionTbody">
                                    <tr v-for="itemobj in dataList">                                   
                                        <!--<td><input type="hidden" v-model="itemobj.pcaoId"/></td>  @blur="save" @dblclick="edit($event)" -->                               
                                        <td>
                                        <!-- <span v-if="!editing" @dblclick="edit">{{itemobj.pcaoName}}</span> -->
                                        <input type="text" ref="input"  :value="itemobj.pcaoName" v-model="itemobj.pcaoName"/></td>
                                        <td>
                                            <button type="button" class="btn btn-xs blue" @click.stop="deleteOption(itemobj)">删除</button>
                                        </td>
                                    </tr>                            
                                </tbody>
                            </table>
                        </form>
                    </div>
                <!-- </div> -->
            </div>
            <span slot="btnList">
                <button type="button" class="btn blue" @click="submitInfo()"  @blur="save">确定</button>
                <button type="button" class="btn default" data-dismiss="modal" >关闭</button>
            </span>
        </m-alert>
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>

          <!--确定删除-->
        <m-alert :title="'删除内容'" :show-cancel-btn="true" :show="showControl" :onsure="ajaxControlDel" :onhide="hideMsg">
            <div slot="content">确定删除吗？</div>
        </m-alert>
        
        <div style="position:fixed;z-index:111111;" v-show="picShowOption.show">
            <select-pic v-show="picShowOption.show" :options="picShowOption" :onselect="selectPicFunc" :oncancel="cancelSelect"></select-pic>
        </div>
    
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
import client from '../../common/utils/client';
//import control from './control';
import { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList } from '../../components';
import { showSelectPic, getSelectPicList } from '../../vuex/actions/actions.resource';
export default {
    components: { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList },
    props: {
       
        pcaId:0,
        show: {
            type: Boolean,
            value: false
        },
        onhide: {
            type: Function,
            value: () => { }
        },
        pcaid:{
            type: String,
            value: 0 
        },
        pcaoId:{
            type: String,
            value: 0 
        }
    },
    data() {
        return {
           
            isLoading: false,
            showDialog: false,
            showPage: false,
            showControl: false,
            controlType:'',
            dataList:[],
            clickItems: [],   //点击操作的数据项
            itemobj: {
                "pcaoName": ""
            },
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '编辑属性值',
            selectPicType: 1,//logo类型
            pcaoIdNum : 0,
            selRow : {},
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
           
        //添加一行
        addOption(){
            //.log("pcaId is "+this.pcaid);
            this.dataList.push( { "val":"" });
            
            this.pcaoIdNum++;
            // if(pcaoIdNum<=2 || pcaoIdNum>=50){
            //       this.showMsg("属性值最少2个最多50个");
            // }
        },
        //删除一行
        deleteOption(itemobj){
            this.selRow = itemobj;
            this.showControl = true;
        },
        ajaxControlDel(){
            if(this.selRow.pcaoId==null){
                let index = this.dataList.findIndex( item => item.pcaoId == this.selRow.pcaoId );
                this.dataList.splice(index,1); 
            }else{
               // this.controlType = type;
                this.clickItems = typeof this.selRow == 'array' ? this.selRow : [this.selRow];
                let url=PCAO_DELETE+'?pcaoId=' + this.selRow.pcaoId;
                client.postData(url).then(data =>{
                    this.isLoading = false;     
                    this.getList();
                }); 
            } 
           
        },
        //按属性ID查询属性值列表
        getList(){
            let url=PCAO_GET_ID;
           client.postData(url+'?pcaoAtrrId='+this.pcaid).then(response =>{
                 this.isLoading = false;                  
                if (response.code == 200) {
                    let list = response.data;
                   // console.log(list);
                    this.dataList = list;
                   // this.stateList = client.global.deployStatusSelect;
                } else {
                    this.showMsg(response.msg);
                }
               
            });
        },
         // 隐藏选择资源弹窗
        cancelSelect() {
            this.showSelectPic({ show: false });
        },
         // 隐藏选择组件弹窗
        cancelSelectComponent() {
            this.showComponent = false;
        },
        hideDialog() {
            this.showDialog = false;
            setTimeout(() => {
                this.showPage = false;
                this.onhide();
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
            this.showDeleteDialog = false;
            this.showAlert = false;
            this.showControl = false;
        },
        clearInfo() {
            this.itemobj = {
                "pcaoName": ""
            }
            
        },
        // 提交信息
        submitInfo() {
           // let data = this.data
            /**属性值是否存在较验 */
            var isSubmit = true;
            this.dataList.forEach(item => {
                let pid = item.pcaoId;
                let pname = item.pcaoName;
                this.dataList.forEach(item2 => {
                    if(pid != item2.pcaoId && pname == item2.pcaoName){
                        this.showMsg('这个属性值已经存在，请输入新的属性值!');
                        isSubmit = false;
                    }
                });
            });
            /**属性值长度较验 */
            var arr =[];
            this.dataList.forEach(item=> arr.push(item.pcaoName) )
             //console.log((arr[arr.length-1]));
            if ((arr[arr.length-1])== '' || ((arr[arr.length-1]).length) >= 10) {
                 this.showMsg('请输入属性值(属性值不能超过10个字)');
                 isSubmit = false;
            }
            if(!isSubmit) {
              //  console.log("返回");
                return;
            }
            //console.log("继续提交了");
            //提交属性选项
            let url= PCAO_CREATE;         
           // console.log("值~~~"+this.dataList);         
            client.postData(url,{  "pcaoList": this.dataList,
                                   "pcaoAtrrId": this.pcaid,
            }).then(response => {
              
                    this.isLoading = false;
                    if (response.code != 200) {
                        this.showMsg(response.msg);
                    } else {
                        if (this.id != '') {
                            this.onhide('update');
                        } else {
                            this.onhide('create');
                        }
                    }
                }, response => {
                    this.isLoading = false;
                    this.showMsg('网络连接错误');
                }
            );
       
        },  
    }, 
    
    created() {
     
    },
    watch: {
        show() {
            this.showPage = this.show;
            this.showDialog = this.show;
        },
        pcaid(){
            this.getList();        
        },
        
    },
    ready() {
       
        this.typesList = client.global.componentTypes;
    },
    beforeDestroy() {
    }
}
</script>