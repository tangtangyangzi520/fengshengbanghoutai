<template>
    <form class="row search-form" style="margin: 5px 0 0 0">
            
            <!-- <input type="hidden" class="form-control"  v-model="searchOptions.saleStatus">
            
                        <input type="text" class="form-control" v-model="searchOptions.spuName"> -->
                    
          
    </form>
</template>
<script>
import client from '../../common/utils/client';
import { getComponentList, getComponentChannelList } from '../../vuex/actions/actions.component';
import { getPainTree } from '../../vuex/actions/actions.pain';
import { mMultiSelect, mAlert, mSelect } from '../../components';
export default {
    props: {
        cflag:true,
        parent: {
            type: Number,
            value: -100
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
    components: { mMultiSelect, mSelect, mAlert },
    data() {
        return {  
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
                orderBy:1,
                mkcStatus : -1,//状态
                "mkcType": 5,
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
            options.createStartTime = options.createEndTime = options.modifyedStartTime = options.modifyedEndTime = '';
            let createStartTime = $('#createStartTime').val(),
                createEndTime = $('#createEndTime').val(),
                modifyedStartTime = $('#modifyedStartTime').val(),
                modifyedEndTime = $('#modifyedEndTime').val();
            if (createStartTime != '') {
                options.createStartTime = createStartTime + ' 00:00:00';
            }
            if (createEndTime != '') {
                options.createEndTime = createEndTime + " 23:59:59";
            }
            if (modifyedStartTime != '') {
                options.modifyedStartTime = modifyedStartTime + ' 00:00:00';
            }
            if (modifyedEndTime != '') {
                options.modifyedEndTime = modifyedEndTime + " 23:59:59";
            }
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
            })
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
                  //console.log(list[0].name)
                  //console.log(list[0].id)
                 let select = this.leimuList 
                 let pain = []
                 for (let i = 0; i < select.length; i++) {

                      for (let j = 0; j < select[i].children.length; j++) {

                         if( list[0].id == select[i].children[j].id ){
                             
                             for (let z = 0; z < select[i].children[j].children.length; z++) {

                          pain = select[i].children[j].children
                          //console.log(select[i].children[j].children.length)
                          pain[z].name = select[i].children[j].children[z].text
                          pain[z].id = select[i].children[j].children[z].id
                            }
                        }
                    }
                } 
                     this.chanelList = pain         
            } 
            
        },
        // 选择创建者回调
        selectAuthorFunc(list) {
            
            if( list.length !=0 ){
                  //console.log(list[0].name)
                  //console.log(list[0].id)
                 let select = this.leimuList 
                 let pain = []
                 for (let i = 0; i < select.length; i++) {
                     if( list[0].id == select[i].id ){
                        pain = select[i].children
                        for (let j = 0; j < select[i].children.length; j++) {
                        //console.log(select[i].children.length)
                        pain[j].name = select[i].children[j].text;
                        pain[j].id = select[i].children[j].id;
                    } 
                 }                                      
            }
            this.painList = pain
        }
            let creators = [];
            list.forEach((item) => {
                creators.push(item.id);
            })
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
           if( (this.firstActive ==0 && this.secondActive == 0 && this.thirdActive == 0) || (this.firstActive >0 && this.secondActive > 0 && this.thirdActive > 0) ){
              this.oncreate(false, true);
           }else{
               alert("选择经营类目不完整")

           }
        },
        parent(val){
           this.searchOptions.mkcStatus = val;
           if( (this.firstActive + this.secondActive + this.thirdActive) == 0 || (this.firstActive >0 && this.secondActive > 0 && this.thirdActive > 0) ){
              this.oncreate(false, true);
           }else{
               alert("选择类目不完整")

           }
        },
        showthirdActive(val) {
            this.searchOptions.showCatIdList[2] = val

        },
        showfirstActive(val){
            //if( val == 0){
                this.searchOptions.showCatIdList[2] = 0
                this.searchOptions.showCatIdList[1] = 0
                this.searchOptions.showCatIdList[0] = val
                this.showsecondActive = 0
                this.showthirdActive = 0
                this.threeList =[]
                this.twoList = []
           // }else{
             if( this.leimuList.find(item=>item.id==val) != null){
                this.twoList = this.leimuList.find(item=>item.id==val).children
            }
        },
        showsecondActive(val){
                this.searchOptions.showCatIdList[2] = 0
                this.searchOptions.showCatIdList[1] = val
            //if( val == 0){
                this.showthirdActive = 0
                this.threeList =[]
            //}else{
            if( this.twoList.find(item=>item.id==val) != null){
                this.threeList = this.twoList.find(item=>item.id==val).children;
            }
        },
        thirdActive(val) {
            this.searchOptions.spuCatId = val

        },
        firstActive(val){
            //if( val == 0){
                this.secondActive = 0
                this.thirdActive = 0
                this.chanelList =[]
                this.painList = []
           // }else{
            if(this.leimuList.find(item=>item.id==val) != null){

                this.painList = this.leimuList.find(item=>item.id==val).children
            }
           // }
        },
        secondActive(val){
            //if( val == 0){
                this.thirdActive = 0
                this.chanelList =[]
           // }else{
            if(this.painList.find(item=>item.id==val) != null){

                this.chanelList = this.painList.find(item=>item.id==val).children;
            }
           // }
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
        $('#createStartTime').val('').datetimepicker({ format: 'yyyy-mm-dd', language: 'zh-CN', autoclose: 'true', minView: 2 });
        $('#createEndTime').val('').datetimepicker({ format: 'yyyy-mm-dd', language: 'zh-CN', autoclose: 'true', minView: 2 });
        $('#modifyedStartTime').val('').datetimepicker({ format: 'yyyy-mm-dd', language: 'zh-CN', autoclose: 'true', minView: 2 });
        $('#modifyedEndTime').val('').datetimepicker({ format: 'yyyy-mm-dd', language: 'zh-CN', autoclose: 'true', minView: 2 });
        $('.datePicker').on('change', () => {
            this.setOptions();
        })
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

