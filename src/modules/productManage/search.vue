<template>
    <div>
        <form class="row search-form" style="margin: 5px 0 0 0">
            <input type="hidden" class="form-control" v-model="searchOptions.saleStatus"/>
            <div class="col-md-8 nopadding">
                <div class="col-md-4 ">
                    <div class="form-group">
                        <label class="col-md-4 ">&nbsp;&nbsp;商品名称</label>
                        <div class="col-md-8">
                            <input type="text" class="form-control" v-model="searchOptions.spuName" maxLength="50"/>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 ">
                    <div class="form-group">
                        <label class="col-md-4 ">商品编码</label>
                        <div class="col-md-8">
                            <input type="text" class="form-control" v-model="searchOptions.spuCode" maxLength="50"/>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 ">
                    <div class="form-group">
                        <label class="col-md-4 "> SKU编码</label>
                        <div class="col-md-8">
                            <input type="text" class="form-control" v-model="searchOptions.skuCode" maxLength="50"/>
                        </div>
                    </div>
                </div> 
            </div>
            <br><br><br>
            <div class="col-md-12 nopadding">
                <div class="form-group">
                    <label class="col-md-1 " style="width:8%;">&nbsp;&nbsp;经营类目</label>
                    <div class="col-md-7 nopadding" style="padding-left:2px;">
                        <div class="col-md-4" >
                            <select class="form-control" v-model="firstActive">
                                <option value="0">请选择一级类目</option>
                                <option v-for="item in authorList" :value="item.id">{{item.text}}</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <select class="form-control" v-model="secondActive">
                                <option value="0">请选择二级类目</option>
                                <option v-for="item in painList" :value="item.id">{{item.text}}</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <select class="form-control" v-model="thirdActive">
                                <option value="0">请选择三级类目</option>
                                <option v-for="item in chanelList" :value="item.id">{{item.text}}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <br><br><br>
            <div class="col-md-12 nopadding">
                <div class="form-group">
                    <label class="col-md-1 " style="width:8%;">&nbsp;&nbsp;展示类目</label>
                    <div class="col-md-7 nopadding" style="padding-left:2px;">
                        <div class="col-md-4">
                            <select class="form-control" v-model="showfirstActive">
                                <option value="0">请选择一级类目</option>
                                <option v-for="item in oneList" :value="item.id">{{item.text}}</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <select class="form-control" v-model="showsecondActive">
                                <option value="0">请选择二级类目</option>
                                <option v-for="item in twoList" :value="item.id">{{item.text}}</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <select class="form-control" v-model="showthirdActive">
                                <option value="0">请选择三级类目</option>
                                <option v-for="item in threeList" :value="item.id">{{item.text}}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
    </div>
</template>

<script>
import client from '../../common/utils/client';
import { getComponentList, getComponentChannelList } from '../../vuex/actions/actions.component';
import { getPainTree } from '../../vuex/actions/actions.pain';
import { mMultiSelect, mAlert, mSelect } from '../../components';

export default {
    components: { mMultiSelect, mSelect, mAlert },
    props: {
        cflag:true,
        parent: {
            type: Number,
            value: 0
        },
        onchange: {
            type: Function,
            default: () => { }
        },
        oncreate: {
            type: Function,
            default: () => { }
        }
    },
    vuex: {
        getters: {
            componentChannelList: ({ component }) => component.componentChannelList,
            painTree: ({ pain }) => pain.painTree,
        },
        actions: {
            getComponentChannelList, getPainTree
        }
    },
    data() {
        return {  
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            showAlert: false,
            oneList:[],
            twoList:[],
            threeList:[],
            leimuList:[],
            stateList: [],
            painList: [],
            authorList: [],//经营类目列表
            //expertsList: [],//作者列表
            chanelList: [],
            putawayStateList: [{ id: 0, name: '下架' }, { id: 1, name: '上架' }],
            lastSearchOptions: {},
            painIdsActive: [],   //关注点选中
            channelIdActive: [], //渠道类型选中
            tagStatusList: [{ id: 0, name: '未打' }, { id: 1, name: '已打' }],
            firstActive: 0,
            secondActive: 0,
            thirdActive: 0,
            showfirstActive: 0,
            showsecondActive: 0,
            showthirdActive: 0,
            //可以在这里编辑搜索条件
            searchOptions: {
                orderType:2,
                orderBy:1,
                spuCatId: 0,
                showCatIdList: [],
                saleStatus : 1,//状态
                skuCode: '',
                spuCode:'',
                spuName: '',
                subtitle: '',
                creators: [],
                //experts: [],
                pains: [],
                deployStatus: -1,
                //createStartTime: '',
                //createEndTime: '',
                //modifyedStartTime: '',
                //modifyedEndTime: '',
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
        // 选择是否已打标签
        selectTagStatusFunc(item) {
            if (item == '') {
                this.searchOptions.existTag = '';
            } else {
                this.searchOptions.existTag = item.id === 0 ? false : true;
            }
            this.setOptions();
        },
        // 过滤请求参数，空值的字段删除
        setOptions() {
            let options = this.searchOptions;
            for (let item in options) {
                if (options[item] === '') {
                    delete options[item];
                }
            }
            if (options.creators && options.creators.length == 0) {
                delete options.creators;
            }
            if (options.deployStatus == -1) {
                delete options.deployStatus;
            }
            if (options.skuChannels && options.skuChannels.length == 0) {
                delete options.skuChannels;
            }
            if (options.pains && options.pains.length == 0) {
                delete options.pains;
            }
            if (options.submitStatus && options.submitStatus == -1) {
                delete options.submitStatus;
            }
            this.onchange(options);
        },
        // 获取类目列表
        getLEIMUList() {
            client.postData(  TAG_LIST_GET + "?typeId=100", {}).then(data => {
                if (data.code == 200) {
                    this.leimuList = data.data.root.children;
                    let list = data.data.root.children;
                    for (let i = 0; i < list.length; i++) {
                        list[i].name = list[i].text;
                        list[i].id = list[i].id;
                    }
                    this.authorList = list;
                    this.oneList = list;
                    this.stateList = client.global.deployStatusSelect;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
            });
        },
        // 获取作者列表
        /*getExpertList() {
            client.postData(COMPONENT_GET_AUTHORS, {}).then(data => {
                if (data.code == 200) {
                    let list = data.data;
                    for (let i = 0; i < list.length; i++) {
                        list[i].name = list[i].title;
                        list[i].id = list[i].componentId;
                    }
                    this.expertsList = list;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
            })
        },*/
        // 选择发布状态回调
        selectStateFunc(item) {
            this.searchOptions.deployStatus = item.id;
            this.setOptions();
        },
        // 选择商品渠道
        selectChanelFunc(list) {
            if (list instanceof Array) {
                this.channelIdActive = list;
            } else {
                this.channelIdActive = [list];
            }
            this.searchOptions.skuChannels = [];
            this.channelIdActive.forEach(item => {
                this.searchOptions.skuChannels.push(item.id);
            })
            this.setOptions();
        },
        // 选择痛点回调
        selectPainFunc(list) {
            if( list.length !=0 ){
                let select = this.leimuList ;
                let pain = [];
                for (let i = 0; i < select.length; i++) {
                    for (let j = 0; j < select[i].children.length; j++) {
                        if( list[0].id == select[i].children[j].id ){
                            for (let z = 0; z < select[i].children[j].children.length; z++) {
                                pain = select[i].children[j].children;
                                pain[z].name = select[i].children[j].children[z].text;
                                pain[z].id = select[i].children[j].children[z].id;
                            }
                        }
                    }
                } 
                this.chanelList = pain;         
            } 
        },
        // 选择创建者回调
        selectAuthorFunc(list) {
            if( list.length !=0 ){
                let select = this.leimuList;
                let pain = [];
                for (let i = 0; i < select.length; i++) {
                    if( list[0].id == select[i].id ){
                        pain = select[i].children
                        for (let j = 0; j < select[i].children.length; j++) {
                            pain[j].name = select[i].children[j].text;
                            pain[j].id = select[i].children[j].id;
                        } 
                    }                                      
                }
                this.painList = pain;
            }
            let creators = [];
            list.forEach((item) => {
                creators.push(item.id);
            });
            this.authorListSelect = creators;
            if (this.authorListSelect.length != 0) {
                this.searchOptions.creators = this.authorListSelect;
            } else {
                this.searchOptions.creators = [];
            }
            this.setOptions();
        },
        // 选择作者回调
        /*selectExpertFunc(list) {
            let experts = [];
            list.forEach((item) => {
                experts.push(item.id);
            })
            this.expertsListSelect = experts;
            if (this.expertsListSelect.length != 0) {
                this.searchOptions.experts = this.expertsListSelect;
            } else {
                this.searchOptions.experts = [];
            }
            this.setOptions();
        },*/
        // 选择上架状态回调
        selectPutawayStateFunc(item) {
            if (item.id == -1) {
                delete this.searchOptions.submitStatus;
            } else {
                this.searchOptions.submitStatus = item.id;
            }
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
        }
    },
    created() {
        this.getLEIMUList();
        //this.getExpertList();
        //this.getComponentChannelList();
        //this.getPainTree();
    },
    watch: {
        cflag() {
            if(this.searchOptions.showCatIdList.length>0){
                let id = 0;
                if(this.searchOptions.showCatIdList[0] > 0 ){
                    id = this.searchOptions.showCatIdList[0];
                }
                if(this.searchOptions.showCatIdList[1] > 0 ){
                    id = this.searchOptions.showCatIdList[1];
                }
                if(this.searchOptions.showCatIdList[2] > 0 ){
                    id = this.searchOptions.showCatIdList[2];
                }
                if(id > 0 ){
                    let object= null;
                    this.leimuList.forEach(item=>{ 
                        if(item.id == id){
                            object = item;
                        }
                        item.children.forEach(er=>{
                            if(er.id == id){
                                object = er;
                            }
                            er.children.forEach(san=>{
                                if(san.id == id){
                                    object = san;
                                }
                            });
                        });
                    });
                    if(object.children != ""){
                        this.showMsg("展示类目请选择到最后一级标签。");
                        return;
                    }
                }
            }
            if( (this.firstActive ==0 && this.secondActive == 0 && this.thirdActive == 0) || (this.firstActive >0 && this.secondActive > 0 && this.thirdActive > 0) ){
                this.oncreate(false, true);
            }else{
                this.showMsg("经营类目请选择到最后一级标签。");
                return;
            }
        },
        parent(val){
            if(this.searchOptions.showCatIdList.length>0){
                let id = 0;
                if(this.searchOptions.showCatIdList[0] > 0 ){
                    id = this.searchOptions.showCatIdList[0];
                }
                if(this.searchOptions.showCatIdList[1] > 0 ){
                    id = this.searchOptions.showCatIdList[1];
                }
                if(this.searchOptions.showCatIdList[2] > 0 ){
                    id = this.searchOptions.showCatIdList[2];
                }
                if(id > 0 ){
                    let object= null;
                    this.leimuList.forEach(item=>{ 
                        if(item.id == id){
                            object = item;
                        }
                        item.children.forEach(er=>{
                            if(er.id == id){
                                object = er;
                            }
                            er.children.forEach(san=>{
                                if(san.id == id){
                                    object = san;
                                }
                            });
                        });
                    });
                    if(object.children != ""){
                        this.showMsg("展示类目请选择到最后一级标签。");
                        return;
                    }
                }
            }
            this.searchOptions.saleStatus = val;
            if( (this.firstActive + this.secondActive + this.thirdActive) == 0 || (this.firstActive >0 && this.secondActive > 0 && this.thirdActive > 0) ){
                this.oncreate(false, true);
            }else{
                this.showMsg("经营类目请选择到最后一级标签。");
                return;
            }
        },
        showthirdActive(val) {
            this.searchOptions.showCatIdList[2] = val;
        },
        showfirstActive(val){
            this.searchOptions.showCatIdList[2] = 0;
            this.searchOptions.showCatIdList[1] = 0;
            this.searchOptions.showCatIdList[0] = val;
            this.showsecondActive = 0;
            this.showthirdActive = 0;
            this.threeList =[];
            this.twoList = [];
            if( this.leimuList.find(item=>item.id==val) != null){
                this.twoList = this.leimuList.find(item=>item.id==val).children;
            }
        },
        showsecondActive(val){
            this.searchOptions.showCatIdList[2] = 0;
            this.searchOptions.showCatIdList[1] = val;
            this.showthirdActive = 0;
            this.threeList =[];
            if( this.twoList.find(item=>item.id==val) != null){
                this.threeList = this.twoList.find(item=>item.id==val).children;
            }
        },
        thirdActive(val) {
            this.searchOptions.spuCatId = val;
        },
        firstActive(val){
            this.secondActive = 0;
            this.thirdActive = 0;
            this.chanelList =[];
            this.painList = [];
            if(this.leimuList.find(item=>item.id==val) != null){
                this.painList = this.leimuList.find(item=>item.id==val).children;
            }
        },
        secondActive(val){
            this.thirdActive = 0;
            this.chanelList =[];
            if(this.painList.find(item=>item.id==val) != null){
                this.chanelList = this.painList.find(item=>item.id==val).children;
            }
        },
        title(val) {
            this.searchOptions.title = val;
        },
        subtitle(val) {
            this.searchOptions.subtitle = val;
        },
        componentChannelList() {
            let list = this.componentChannelList.data;
            this.chanelList = [];
            for (let i = 0; i < list.length; i++) {
                this.chanelList.push({ id: list[i].dictionnaryId, name: list[i].keyValue });
            }
        },
        // 关注点列表加入id，name字段才可以使用select组件
        painTree() {
            let list = [];
            for (let i = 0; i < this.painTree.length; i++) {
                let item = this.painTree[i];
                let pushItem = {
                    id: item.id,
                    name: item.text,
                    item: item,
                    children: []
                }
                for (let j = 0; j < item.children.length; j++) {
                    let childItem = item.children[j];
                    pushItem.children.push({ id: childItem.id, name: childItem.text, item: childItem });
                }
                list.push(pushItem);
            }
            this.painList = list;
        }
    },
    ready() {
        this.setOptions();
        this.onchange(this.searchOptions);
        this.oncreate(false, true);
    }
}
</script>

<style lang="less" scope>
.search-form .col-md-4{
    padding-left:0;
}
.col-md-4:nth-child(3n){
    padding-right:0;
}
.form-control.inline-block {
    display: inline-block;
    padding-right: 5px!important;
}
.time-box{
    display:-webkit-box;
    display:-moz-box;
    div{-webkit-box-flex: 1.0;-moz-box-flex: 1.0}
    div:nth-child(2){line-height:34px;width:85px;margin:0 5px;text-align:center}
}
</style>

