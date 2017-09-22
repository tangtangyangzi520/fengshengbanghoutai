<template>
     <div class="col-md-12 nopadding">
                <div class="form-group">
                    <label class="col-md-1 " style="width:8%;">&nbsp;&nbsp;省市区联动查询：</label>
                    <div class="col-md-7 nopadding" style="padding-left:2px;">
                        <div class="col-md-4">
                            <select class="form-control" v-model="firstActive">
                                <option value="0">请选择省份</option>
                                <option v-for="item in areaList" :value="item.code">{{item.name}}</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <select class="form-control" v-model="secondActive">
                                <option value="0">请选择市</option>
                                <option v-for="item in cityList" :value="item.code">{{item.name}}</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <select class="form-control" v-model="thirdActive">
                                <option value="0">请选择区</option>
                                <option v-for="item in districtList" :value="item.code">{{item.name}}</option>
                            </select>
                        </div>
                        
                        <!-- <m-multi-select :data="authorList" :active-items="[]" :placeholder="'请选择一级类目'" :change-func="selectAuthorFunc"></m-multi-select> -->
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
           firstActive: 0,
           secondActive:0,
            isLoading: false,
            showDialog: false,
            showPage: false,
            showControl: false,
            controlType:'',
            dataList:[],
            areaList:[],
            cityList:[],
            districtList:[],
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
        // 获取类目列表
        getAreaList() {
            client.postData(AREA_GET_LIST, {}).then(data => {
                if (data.code == 200) {
                    this.areaList = data.data;    
                    console.log(this.areaList);               
                    // let list = data.data.root.children;
                    // for (let i = 0; i < list.length; i++) {
                    //     list[i].name = list[i].text;
                    //     list[i].id = list[i].id;
                    // }
                  //  this.authorList = list;
                    //this.oneList = list;
                  //  this.stateList = client.global.dyeployStatusSelect;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
            })
        },
        getcityList(val){
                client.postData(CITYAREA_GET_LIST+ "?code="+val, {}).then(data => {
                    if (data.code == 200) {
                        this.cityList = data.data;    
                        console.log(this.cityList);   
                        //this.oneList = list;
                    //  this.stateList = client.global.dyeployStatusSelect;
                    } else {
                        this.showMsg(data.msg);
                    }
                }, data => {
                }) 
        },
        getdistrictList(val){
                client.postData(CITYAREA_GET_LIST+ "?code="+val, {}).then(data => {
                        if (data.code == 200) {
                            this.districtList = data.data;    
                            console.log(this.districtList);   
                            //this.oneList = list;
                         //  this.stateList = client.global.dyeployStatusSelect;
                        } else {
                            this.showMsg(data.msg);
                        }
                }, data => {
                })    
        },
        
    }, 
    
    created() {
     this.getAreaList();
     
    },
    watch: {
        show() {
            this.showPage = this.show;
            this.showDialog = this.show;
        },
        // thirdActive(val){

        // },
        firstActive(val){
            //if( val == 0){
                this.secondActive = 0
                this.thirdActive = 0
                this.districtList = []
                this.cityList = []
           // }else{
            if(this.areaList.find(item=>item.code==val) != null){
                 console.log(val)
                 this.getcityList(val);
               // this.cityList = this.leimuList.find(item=>item.id==val).children
            }
           // }
        },       
        secondActive(val){
            //alert("sss");
                this.thirdActive = 0
                this.districtList = []
                if(this.cityList.find(item=>item.code==val)!= null){
                    //  console.log(val)
                client.postData(CITYAREA_GET_LIST+ "?code="+val, {}).then(data => {
                    if (data.code == 200) {
                        this.districtList = data.data;    
                        console.log(this.districtList);   
                        //this.oneList = list;
                    //  this.stateList = client.global.dyeployStatusSelect;
                    } else {
                        this.showMsg(data.msg);
                    }
                }, data => {
                })   
                   // this.getdistrictList(val);
                }
        },
    },
    ready() {
       
        this.typesList = client.global.componentTypes;
    },
    beforeDestroy() {
    }
}
</script>