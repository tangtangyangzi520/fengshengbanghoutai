<template>
<!-- 商品列表-编辑SKU信息 -->
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1000px'" :backdrop="true">
            <div slot="content" style="background-color:#F0F0F0">
                <div >
                    <table class="tab" id="table" style="" border="1" cellspacing="0" cellpadding="0">  
                        <thead>
                            <tr>
                                <th style="width:4%">
                                    <button type="button" class="btn btn-xs btn-xs blue btn-select-type" style="margin-bottom:3px;" @click="selectAll">全选</button>
                                    <button type="button" class="btn btn-xs btn-xs blue btn-select-type" @click="reverseList">反选</button>
                                </th>
                                <th>SKU组合</th>
                                <th><span style="color:red">*</span>丰盛榜售价</th>
                                <th>原价</th>
                                <th><span style="color:red">*</span>展示库存（件）</th>
                                <th>ERP实际库存</th>
                                <th>SKU编码</th>
                            </tr>
                        </thead>
                        <tbody id="itemList">
                            <tr v-for=" g in skuList" style="height:20%"  @click="selectItem(g)"> 
                                <td style="text-align:center;vertical-align:middle;"><input type="checkbox" :checked="g.checked"></input></td>
                                <td style="width:40%"><span > {{ g.skuAtrr }} </span></td>
                                <td>￥<input class=" input2" type="number" v-model="g.skuSalePrice" @keyup="checkfloat($event)" @change="checkfloat($event)" @blur="checkfloat($event)" min="0" max="99999999"/></td>
                                <td>￥<input class=" input2" type="number" v-model="g.skuMarketSalePrice" @keyup="checkfloat($event)" @change="checkfloat($event)" @blur="checkfloat($event)"  min="0" max="99999999"/></td>
                                <td> <input class=" input2" type="number" v-model="g.skuShowNum" @keyup="check($event)" @change="check($event)" @blur="check($event)" min="0" max="2000000000"/></td>
                                <td> {{ g.skuStockNum }} </td>
                                <td style="width:17%"> {{ g.skuCode }} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- <loading :show="isLoading"></loading> -->
            <!-- 标签选择弹窗 -->
            <span slot="btnList">
                <button type="button" class="btn blue" @click="addItem()">编辑保存</button>
                <!-- <button type="button" class="btn yellow-crusta" @click="up()" >批量上架</button>
                <button type="button" class="btn default" @click="down()">批量下架</button> -->
                <button type="button" class="btn green-meadow" @click="hideDialog()" >关闭</button>
            </span>
        </m-alert>
        <!-- 提示框 -->
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
    </div>
</template>

<script>
import client from '../../common/utils/client';
import tagTree from '../common/tagTree';
import templateControl from './templateControl';
import { selectPic, mAlert, mSelect, mMultiSelect, itemList } from '../../components';
import { showSelectPic, getSelectPicList } from '../../vuex/actions/actions.resource';//上传图片插件

export default {
    components: { selectPic, tagTree, mAlert, mSelect, mMultiSelect, itemList, templateControl },
    props: {
        spuname:'',
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
            editskuflag:false,
            title: '(SKU列表信息)',
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
        //小数校验
        checkfloat(event){
            let el = event.currentTarget;
            //$(el).val(Math.abs($(el).val()).toFixed(2))
            var reg = /^[0-9]{1,8}([.]{1}[0-9]{1,2})?$/;
            let s = $(el).val()+"";
            let f = !reg.test(s);
            if ( f ) {
                this.showMsg("请输入数字");
                //$(el).val(s.substring(0,s.length-1))
                $(el).val("");
            }
        },
        //整数校验
        check(event){
            let el = event.currentTarget;
            $(el).val(Math.abs($(el).val()));
            $(el).val(Math.round($(el).val()));
            var reg = /^\d{0,10}$/;
            let s = $(el).val()+"";
            let f = !reg.test(s);
            if ( f ) {
                this.showMsg("请输入整数");
                //$(el).val(s.substring(0,s.length-1))
                $(el).val("");
            }
        },
        selectAll() {
            this.skuList.forEach(item => {
                item.checked = true;
            });
        },
        reverseList() {
            this.skuList.forEach(item => {
                item.checked = !item.checked;
            });
        },
        selectItem(item) {
            item.checked = !item.checked;
        },
        //删除spu列
        close(i) {
            this.skuList.$remove(this.skuList.find(t => t.skuId === i));
            //let el = event.currentTarget;
            // $(el).parent().parent().children("td").remove()  
        },
        addItem() {
            if(this.editskuflag){
                this.showMsg("点击过于频繁");
                return;
            }
            this.editskuflag = true;
            setTimeout(()=>{
                this.editskuflag = false;
            },5000);
            //
            client.postData( SKU_EDIT_LIST , this.skuList).then(data => {
                if (data.code == 200) {
                    this.showMsg("编辑成功");
                    this.expertEditId = '';
                    this.showAddDialog = true;
                    setTimeout(() => {
                        this.hideDialog();
                    }, 10);
                } else {
                    this.showMsg(data.message);
                }
            }, data => {
                this.editskuflag = false;
                this.showMsg("编辑失败,请重试");
            });
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
                this.showMsg("标签不能超过3个");
                return;
            }
            this.neirongList = [];
            this.neirongList = list;
            this.data.labelIds = [];
            list.forEach(item => {
                this.data.labelIds.push(item.id);
            });
            this.showneiTreeSelect = !this.showneiTreeSelect;
        },
        //人群标签回调
        selectPerFunc(list) {
            if( list.length > 3 ){
                this.showMsg("标签不能超过3个");
                return;
            }
            this.personList = [];
            this.personList = list;
            this.data.labelIds = [];
            list.forEach(item => {
                this.data.labelIds.push(item.id);
            });
            this.showperTreeSelect = !this.showperTreeSelect;
        },
        // 选择标签回调
        selectTagFunc(list) {
            if( list.length > 3 ){
                this.showMsg("标签不能超过3个");
                return;
            }
            this.tagsList = [];
            this.tagsList = list;
            this.data.labelIds = [];
            list.forEach(item => {
                this.data.labelIds.push(item.id);
            });
            this.showTagTreeSelect = !this.showTagTreeSelect;
        },
        hideDialog() {
            this.showDialog = false;
            setTimeout(() => {
                this.showPage = false;
                this.onhide('cancel');
            }, 300);
        },
        selectPainFunc(list) {
            let arr = [];
            list.forEach(item => {
                arr.push(item.id);
            });
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
            });
            let url = COMPONENT_ADD;
            if (this.id != '') {
                url = COMPONENT_EDIT;
                data.componentId = this.id;
            }
            this.isLoading = true;
            //
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
            });
        }
    },
    created() {
        //this.getxbList()
        //this.getshangbangList(); 
        //this.getbrandList();
    },
    watch: {
        skuflag(){
            //
            client.postData( SKU_GET_BY_ID + "?spuId="+this.spuid2, {}).then(data => {
                this.isLoading = false;
                data.forEach(item => {
                    item.checked = false;
                });
                this.skuList = data;
                this.title = "商品名:"+this.spuname + this.title;
            }, data => {
                this.isLoading = false;
                this.showMsg("获取sku列表失败,请刷新重试");
            });
        },
        spuid2(val) {
            
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
            };
            this.painList = [];
            this.painIdsSelect = [];
            if (this.id == '') {
                //this.title = '编辑基本信息';
                this.getPainList();
                this.tagsList = [];
                setTimeout(() => {
                    this.typesList = client.global.componentTypes;
                }, 30);
                return;
            }
            //this.title = '编辑基本信息';
            this.isLoading = true;
            this.painList = [];
            //
            client.postData(COMPONENT_GETWITHPAINS + '?componentId=' + this.id, {}).then(response => {
                this.isLoading = false;
                if (response.code == 200) {
                    let data = response.data;
                    if (data.painIds) {
                        data.painIds.forEach(item => {
                            this.painIdsSelect.push({ id: item, name: '' });
                        });
                        this.data.painIds = data.painIds;
                    }
                    data.tags.forEach(item => {
                        item.id = item.tagId;
                        item.text = item.tagName;
                    });
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
            });
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
        width: 75%
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