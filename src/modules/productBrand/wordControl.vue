<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'800px'">
            <div slot="content">
                <div class="row">
                   <form class="form-horizontal" name="addForm" role="form">
    
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>品牌名称
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="data.pbdName" >
                            </div>
                        </div>
    
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                英文名称
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="data.pbdEnglishName" >
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                品牌网址
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="data.pbdWebsite" >
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                品牌描述
                            </label>
                            <div class="controls col-md-6">
                                <textarea v-model="data.pbdIntroduce"  rows="2" cols="50" maxlength="256"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                </span>国家
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="data.pbdCountry" >
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label" >
                                </span>是否停用
                            </label>
                            <div class="controls col-md-6" style="margin-top:1.3%">
                               <span >
                                <input type="checkbox" :checked="false" @click="isPbdDisPlay()" id="pbdCheckbox"></input>
                                </span>
                            </div>
                        </div>
                        <div class="form-group" style="padding-bottom:10px;">
                            <label class="col-sm-3 control-label">
                                品牌Logo</label>
                            <div class="controls col-md-6">
                                <button class="btn" @click="showSelectPicDialog(1)" type="button" v-if="data.pbdLogoUrl==''">选择图片</button>
                                <label v-if="data.pbdLogoUrl==''" class="control-label">
                                未选择任何文件
                                </label>
                                <img :src="data.pbdLogoUrl" class="cursor" @click="showSelectPicDialog(1)" height="80" v-else style="pointer:corsor;margin-bottom:-10px;">
                                
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                </span>预览Logo
                            </label>
                            <div class="controls col-md-6">
                                <img :src="data.pbdLogoUrl" class="cursor"  height="80" v-else style="pointer:corsor;margin-bottom:-10px;">
                            </div>
                        </div>
                       
                        <div class="form-group">
                            <label for="title" class="col-sm-3 control-label">
                                <span class="required">* </span>品牌排序
                            </label>
                            <div class="controls col-md-6">
                                <input type="text" class="form-control input-sm" v-model="data.pbdSort" >
                            </div>
                        </div>
                        
                    </form>
                </div>
            </div>
            <span slot="btnList">
                <button type="button" class="btn blue" @click="submitInfo()">保存</button>
                <button type="button" class="btn default" data-dismiss="modal">取消</button>
            </span>
        </m-alert>
        <m-alert :title="showAlertTitle" :show="showAlert" :onhide="hideMsg">
            <div slot="content">{{showAlertMsg}}</div>
        </m-alert>
        <div style="position:fixed;z-index:111111;" v-show="picShowOption.show">
            <select-pic v-show="picShowOption.show" :options="picShowOption" :onselect="selectPicFunc" :oncancel="cancelSelect"></select-pic>
        </div>
        <div style="position:fixed;z-index:11111;" v-show="showComponent">
            <select-component-all v-show="showComponent" :options="componentShowOption" :onselect="selectComponentFunc" :oncancel="cancelSelectComponent"></select-component-all>
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
        id: {
            type: String,
            value: 0
        }
    },
    data() {
        return {
            isLoading: false,
            showDialog: false,
            showPage: false,
            data: {
                "componentType": 16,
                "pbdName": "",
                "pbdEnglishName": "",
                "pbdDisplay": 1,
                "pbdWebsite": "",
                "pbdLogoUrl": "",
                "pbdLogoId": "",
                "pbdIntroduce": "",
                "pbdCountry": "",
                "pbdSort": ""
            },
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '添加品牌',
            selectPicType: 1,//logo类型
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
         // 是否停用
        isPbdDisPlay() {
            var type = $("#pbdCheckbox").prop('checked');
            if(type){
                this.data.pbdDisplay = 0;
            } else {
                this.data.pbdDisplay = 1;
            }
        },
         // 显示选择图片
        showSelectPicDialog(type) {
            this.showSelectPic({ name: 'bannerPic', show: true, storeType: 4, single: true });
        },
        // 选择图片文件回调
        selectPicFunc(list) {
            //console.log(list);
            this.data.pbdLogoUrl = list[0].url;
             this.data.pbdLogoId = list[0].id;
            this.showSelectPic({ show: false });
        },
         // 隐藏选择资源弹窗
        cancelSelect() {
            this.showSelectPic({ show: false });
        },
        // 选择组件回调
        selectComponentFunc(list) {
            if (list[0].componentType == 27 || list[0].componentType == 15 || list[0].componentType == 13) {
                this.contentSelect = list[0].subtitle;
            } else {
                this.contentSelect = list[0].title;
            }
            this.data.subComponentId = list[0].componentId;
            this.showComponent = false;
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
            this.showAlert = false;
        },
        clearInfo() {
            this.data = {
                "componentType": 16,
                "pbdName": "",
                "pbdEnglishName": "",
                "pbdDisplay": 1,
                "pbdWebsite": "",
                "pbdLogoUrl": "",
                "pbdLogoId": "",
                "pbdIntroduce": "",
                "pbdCountry": "",
                "pbdSort": ""
            }
        },
        // 提交信息
        submitInfo() {
            let data = this.data;
            if (data.pbdName.replace(/\s/g, '') == '' || data.pbdName.length > 20) {
                this.showMsg('请输入品牌名称(1~20字)');
                return;
            }
            if (data.pbdEnglishName.length > 30) {
                this.showMsg('请输入英文名称(1~30字)');
                return;
            }
            if (data.pbdWebsite.length > 100) {
                this.showMsg('请输入品牌网址(1~100字)');
                return;
            }
            if (data.pbdIntroduce.length > 100) {
                this.showMsg('请输入品牌描述(1~100字)');
                return;
            }
            if (data.pbdCountry.length > 20) {
                this.showMsg('请输入国家(1~20字)');
                return;
            }
           

            var reg = /^\+?[1-9][0-9]{0,11}$/
            
            let f = !reg.test(data.pbdSort)
            if (  f ) {
                   this.showMsg("请输入1~10位非0正整数")
                   //$(el).val(s.substring(0,s.length-1))
                    $(el).val("")
            }

            let url = PBD_CREATE ;
            if (this.id != 0) {
                url =  PBD_EDIT  + '?pbdBrandId=' + this.id;
                data.pbdBrandId = this.id;
            }
            this.isLoading = true;
            client.postData(url, data).then(response => {
                this.isLoading = false;
                if (response.code != 200) {
                    this.showMsg(response.message);
                } else {
                    if (this.id != 0) {
                        this.onhide('update');
                    } else {
                        this.onhide('create');
                    }
                }
            }, response => {
                this.isLoading = false;
                this.showMsg(response.message);
            })
        }
    },
    created() {
    },
    watch: {
        show() {
            this.showPage = this.show;
            this.showDialog = this.show;
        },
        id() {
            this.data = {
                "componentType": 16,
                "pbdName": "",
                "pbdEnglishName": "",
                "pbdDisplay": 1,
                "pbdWebsite": "",
                "pbdLogoUrl": "",
                "pbdLogoId": "",
                "pbdIntroduce": "",
                "pbdCountry": "",
                "pbdSort": ""
            }
            this.isLoading = true;
            client.postData(  PBD_GET_MAXSORT).then(response => {
                this.isLoading = false;
                if (response.code == 200) {
                    this.data.pbdSort = response.data + 1;
                } else {
                        this.showMsg(response.msg);
                }
            }, data => {
                this.isLoading = false;
                this.showMsg('网络连接错误');
            })
            if (this.id == 0) {
                this.title = '添加品牌';
                setTimeout(() => {
                    this.typesList = client.global.componentTypes;
                }, 30)
                return;
            }
            this.title = '编辑品牌';
            this.isLoading = true;
            client.postData(  PBD_GET_ONE  + '?pbdBrandId=' + this.id, {}).then(response => {
                this.isLoading = false;
                if (response.code == 200) {
                    let data = response.data;
                    this.data.pbdName = data.pbdName;
                    this.data.pbdEnglishName = data.pbdEnglishName;
                    this.data.pbdWebsite = data.pbdWebsite;
                    this.data.pbdLogoUrl = data.pbdLogoUrl;
                    this.data.pbdLogoId = data.pbdLogoId;
                    this.data.pbdIntroduce = data.pbdIntroduce;
                    this.data.pbdCountry = data.pbdCountry;
                    this.data.pbdSort = data.pbdSort;
                    this.data.pbdDisplay = data.pbdDisplay;
                    if(this.data.pbdDisplay==1){
                        $("#pbdCheckbox").prop('checked',false);
                    } else{
                        $("#pbdCheckbox").prop('checked',true);
                    }
                } else {
                    this.showMsg(response.message);
                }
            }, data => {
                this.isLoading = false;
                this.showMsg('网络连接错误');
            })
        }
    },
    ready() {
        this.typesList = client.global.componentTypes;
    },
    beforeDestroy() {
    }
};
</script>