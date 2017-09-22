<template>
 <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'800px'">
            <div slot="content" >
   
        <div class="form-group">        
            <div class="" style="margin-left:30%">
                  类目搜索： <input type="text" class="input input-sm" v-model="data.title" placeholder="请输入关键字">
                    <button class="btn green-meadow" @click="getLEIMUList" type="button">搜索</button>
            </div>
        </div>
       <input type="text" style="margin-left: 10%;" class="input"  placeholder="">
       <input type="text" class="input"  placeholder="">
       <input type="text" class="input"  placeholder="">
       <div class="box" style="margin-left: 10%;">
           <ul>
               <li v-for="item in firstList"><a @click="secondbuild(item,$event)">{{item.text}}</a><span v-for="i in 6">&nbsp;</span> <span style="float:right;margin-right:15%"> > </span> </li> 
           </ul>
       </div>  
       <div class="box">
           <ul>
               <li v-for="item in secondList"><a @click="thirdbuild(item,$event)">{{item.text}}</a><span v-for="i in 6">&nbsp;</span> <span style="float:right;margin-right:15%"> > </span> </li> 
           </ul>
       </div>  
       <div class="box">
           <ul>
               <li v-for="item in thirdList"><a :id="item.id" @click="thirdSelect(item,$event)">{{item.text}}</a><span v-for="i in 4">&nbsp;</span> <span style="float:right;margin-right:6%"> > </span> </li> 
           </ul>
       </div> <br><br>  
       <div style="text-align:center">           
       <button class="btn blue"  @click="addItem()" type="button">下一步</button>
       <div>
       </div>
      </div>
      </div>
      </m-alert>
        <product-control v-if="!destroyControlDialog" :id="expertEditId" :show="showAddDialog" :par="sele" :onhide="hideAddDialog" :cflag="flag"></product-control> 
        </div>
</template>
<script>
import client from '../../common/utils/client';
import tagTree from '../common/tagTree';
import productControl from './productControl';
import { selectPic, mAlert, mSelect, mMultiSelect, itemList } from '../../components';
export default {
    components: { selectPic, tagTree, mAlert, mSelect, mMultiSelect, itemList ,productControl},
    props: {
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
        },
         closepar: {
            type: Function,
            default: () => { }
        }
    },
    data() {
        return {
            flag: false,
            sele:[],
            selectArray:[],
            thirdList:  [],
            secondList: [],
            firstList:  [],
            leimuList:[],
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
            title: '选择商品类目',
            tagsList: [],             //选择的标签
            showTagTreeSelect: false, //显示标签选择弹窗
             destroyControlDialog: false, //注销良言操作弹框
             expertEditId: '',
             showAddDialog: false,
        }
    },
    methods: {
         addItem() {
            let msg =""
            if( this.sele[1] == null || this.sele[2] == null){
                alert( "请先选择三级的类目")
                return;
            }
            //this.showMsg(msg);
            let arr = this.sele;
            this.expertEditId = '';
            this.showAddDialog = true;
            this.flag = !this.flag;
        },
        thirdSelect(val,event){
             let el = event.currentTarget;
             $(el).parent().addClass("selected");
             $(el).parent().siblings("li").removeClass("selected");
             this.selectArray[2]= val.text
             this.selectArray[5]= val.id
             // this.sele = this.selectArray;
             this.selectArray.forEach((item,index)=>{
                this.sele.$set(index,item);
             })
             //alert("sele"+this.selectArray.toString())
        },
        thirdbuild(val,event) {
            var el = event.currentTarget;
             $(el).parent().addClass("selected");
             $(el).parent().siblings("li").removeClass("selected");
             this.thirdList = this.secondList.find(item=>item.id==val.id).children;
             this.sele[2] = null
             this.selectArray[1]= val.text
             this.selectArray[4]= val.id
        },
        secondbuild(val,event) {
            var el = event.currentTarget;
             $(el).parent().addClass("selected");
             $(el).parent().siblings("li").removeClass("selected");
            this.secondList = this.leimuList.find(item=>item.id==val.id).children;
            this.thirdList = []
            this.sele[2] = null
            this.selectArray[0]= val.text
            this.selectArray[3]= val.id
        },
        // 获取类目列表
        getLEIMUList() {
            /*this.leimuList=[{"name":"个人护理","id":10,"ch":[{"name":"补补","id":1010,"ch":[{"name":"存储","id":101010},{"name":"订单","id":101020}]},{"name":"不变","id":1020,"ch":[{"name":"查出","id":102010},{"name":"得到","id":102020}]}]},{"name":"啊啊啊啊","id":20,"ch":[{"name":"宝贝","id":2010,"ch":[{"name":"超出","id":201010},{"name":"单点","id":201020}]},{"name":"报表","id":2020,"ch":[{"name":"出错","id":202010},{"name":"到底","id":202020}]}]}]
            this.firstList =  this.leimuList  */
            this.thirdList = []
            this.secondList = []
            client.postData( TAG_LIST_GET + "?typeId=100", {}).then(data => {
                if (data.code == 200) {

                    this.leimuList = data.data.root.children;
                    this.firstList =  this.leimuList
                    
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
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
            this.closepar()
            this.sele=[],
            this.selectArray=[]
            this.thirdList=[]
            this.secondList=[]
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
    created() {
        this.getLEIMUList();
        this.selectArray.length = 6
    },
    watch: {
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
                this.title = '选择商品类目';
                this.getPainList();
                this.tagsList = [];
                setTimeout(() => {
                    this.typesList = client.global.componentTypes;
                }, 30)
                return;
            }
            this.title = '编辑良言';
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
        margin-left: 2%;
        overflow-x: scroll;
        height: 200px;
        width: 25%;
        display:inline-block;
        background-color:#F0F0F0;
        border:1px solid #000;
    }
    .input{
        margin-left: 2%;
        height: 5%;
        width: 25%;
        display:inline-block;

    }
    li{
        list-style-type:none;
        margin-bottom: 4%;
        margin-top :5%
    }
    a{
        text-decoration:none;
        color:black;
        font:Microsoft YaHei  12px arial,sans-serif;
    }
    .selected a{
        color:blue
    }

</style>