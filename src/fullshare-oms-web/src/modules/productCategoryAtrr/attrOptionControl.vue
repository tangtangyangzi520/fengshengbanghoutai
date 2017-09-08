<template> 
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;"  v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :idp="pcaId" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'30%'">
            <div slot="content">
                <div class="row">
                    <div>
                         <button type="button" class="btn btn-xs blue" @click="addOption()" style="position:fixed;right:15%;top:10%;">娣诲姞</button>
                    </div>
                <!-- <div style="position: absolute;top:30px;left:0;width:100%;height:100%;overflow :auto">  -->
                    <form class="form-horizontal" name="addForm" role="form">
                            <table class="table table-striped table-bordered table-hover" id="attrOption-table">
                                <thead>
                                    <tr>
                                    <th style="width:;">灞炴�у��</th>
                                    <th style="width:;">鎿嶄綔</th>
                                    </tr>
                                </thead>
                                <tbody id="attrOptionTbody">
                                    <tr v-for="itemobj in dataList">                                   
                                        <!--<td><input type="hidden" v-model="itemobj.pcaoId"/></td>  @blur="save" @dblclick="edit($event)" -->                               
                                        <td>
                                        <!-- <span v-if="!editing" @dblclick="edit">{{itemobj.pcaoName}}</span> -->
                                        <input type="text" ref="input"  :value="itemobj.pcaoName" v-model="itemobj.pcaoName"/></td>
                                        <td>
                                            <button type="button" class="btn btn-xs blue" @click.stop="deleteOption(itemobj)">鍒犻櫎</button>
                                        </td>
                                    </tr>                            
                                </tbody>
                            </table>
                        </form>
                    </div>
                <!-- </div> -->
            </div>
            <span slot="btnList">
                <button type="button" class="btn blue" @click="submitInfo()"  @blur="save">纭畾</button>
                <button type="button" class="btn default" data-dismiss="modal" >鍏抽棴</button>
            </span>
        </m-alert>
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>

          <!--纭畾鍒犻櫎-->
        <m-alert :title="'鍒犻櫎鍐呭'" :show-cancel-btn="true" :show="showControl" :onsure="ajaxControlDel" :onhide="hideMsg">
            <div slot="content">纭畾鍒犻櫎鍚楋紵</div>
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
            clickItems: [],   //鐐瑰嚮鎿嶄綔鐨勬暟鎹」
            itemobj: {
                "pcaoName": ""
            },
            showAlert: false,
            showAlertTitle: '娓╅Θ鎻愮ず',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '缂栬緫灞炴�у��',
            selectPicType: 1,//logo绫诲瀷
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
           
        //娣诲姞涓�琛�
        addOption(){
            //.log("pcaId is "+this.pcaid);
            this.dataList.push( { "val":"" });
            
            this.pcaoIdNum++;
            // if(pcaoIdNum<=2 || pcaoIdNum>=50){
            //       this.showMsg("灞炴�у�兼渶灏�2涓渶澶�50涓�");
            // }
        },
        //鍒犻櫎涓�琛�
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
        //鎸夊睘鎬D鏌ヨ灞炴�у�煎垪琛�
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
         // 闅愯棌閫夋嫨璧勬簮寮圭獥
        cancelSelect() {
            this.showSelectPic({ show: false });
        },
         // 闅愯棌閫夋嫨缁勪欢寮圭獥
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
                this.showAlertTitle = '娓╅Θ鎻愮ず';
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
        // 鎻愪氦淇℃伅
        submitInfo() {
           // let data = this.data
            /**灞炴�у�兼槸鍚﹀瓨鍦ㄨ緝楠� */
            var isSubmit = true;
            this.dataList.forEach(item => {
                let pid = item.pcaoId;
                let pname = item.pcaoName;
                this.dataList.forEach(item2 => {
                    if(pid != item2.pcaoId && pname == item2.pcaoName){
                        this.showMsg('杩欎釜灞炴�у�煎凡缁忓瓨鍦紝璇疯緭鍏ユ柊鐨勫睘鎬у��!');
                        isSubmit = false;
                    }
                });
            });
            /**灞炴�у�奸暱搴﹁緝楠� */
            var arr =[];
            this.dataList.forEach(item=> arr.push(item.pcaoName) )
             //console.log((arr[arr.length-1]));
            if ((arr[arr.length-1])== '' || ((arr[arr.length-1]).length) >= 10) {
                 this.showMsg('璇疯緭鍏ュ睘鎬у��(灞炴�у�间笉鑳借秴杩�10涓瓧)');
                 isSubmit = false;
            }
            if(!isSubmit) {
              //  console.log("杩斿洖");
                return;
            }
            //console.log("缁х画鎻愪氦浜�");
            //鎻愪氦灞炴�ч�夐」
            let url= PCAO_CREATE;         
           // console.log("鍊紐~~"+this.dataList);         
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
                    this.showMsg('缃戠粶杩炴帴閿欒');
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