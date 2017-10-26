<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'1200px'">
            <div slot="content">
                <div class="col-md-12" style="padding-bottom:10px;">
                    <div class="form-group">
                        <label class="col-md-2 left">评论星级：</label>
                        <div class="col-md-3">
                            <select class="form-control" v-model="editData.oicStarNum">
                                <option value="0">请选择</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-md-12" style="padding-bottom:10px;">
                    <div class="form-group">
                        <label class="col-md-2 left">评论内容：</label>
                        <div class="col-md-9">
                            <textarea v-model="editData.oicComment" placeholder="请输入评论内容" rows="6" cols="70" maxlength="500"></textarea>
                        </div>
                    </div>
                </div>
                <div class="col-md-12" style="padding-bottom:10px;">
                    <div class="form-group">
                        <label class="col-md-2 left">评论图片：</label>
                        <div class="col-md-10" style="margin-top:3px">
                            <span class="required"></span>图片上传说明：
                            <span style="margin-left:1%">最多上传10张，单张大小小于5M，仅支持JPG、JPEG格式。</span>
                        </div>
                    </div>
                </div>
                <div style="padding-bottom:10px;margin-left:19%;">
                    <input type="button" sytle="width=100px;height=100px" @click="showPicDialog(6)" height="80" value="点击编辑评论图片" />
                </div>
                <div id="img" style="text-align:center; margin-left:30%;" v-for=" (index,a) in imgList ">
                    <item-move :change-up="detailMoveUp.bind(this,index)" :change-down="detailMoveDown.bind(this,index)" :remove-item="detailRemove.bind(this,index)" style="width:400px;" :hidden-left-right="false">
                        <img class="images" :src="a.url" style="height:300px;width:400px;">
                    </item-move>
                </div>
            </div>
            <span slot="btnList">
                <button type="button" class="btn blue" @click="saveEdit()">编辑保存</button>
                <button type="button" class="btn default" @click="hideDialog()">取消</button>
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
        <loading :show="isLoading"></loading>
    </div>
</template>
<script>
import client from '../../common/utils/client';
import { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList } from '../../components';
import loading from '../common/loading';
import { showSelectPic, getSelectPicList } from '../../vuex/actions/actions.resource';
import itemMove from '../../components/page/itemMove';


export default {
    components: {
        selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList, loading, itemMove
    },
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
        editData: {
            type: Object,
            value: {}
        },
        progressObject: {
            width: '',
        }
    },
    data() {
        return {
            showOddDialog: false,
            destroyControlDialog: false,
            orderlog: [],
            isLoading: false,
            showDialog: false,
            showPage: false,
            showPainListSelect: true,
            painIdsSelect: [],
            painList: [],
            imgList: [],
            componentShowOption: {},
            data: null,
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '编辑评论',
            showCampaignStatus: false,
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
        //回显图片
        showImg() {
            let list = [];
            if (this.editData.oicImg != undefined && this.editData.oicImg.length > 0) {
                list = this.editData.oicImg.split(",");
            }
            list.forEach(item => {
                if (item.length > 0) {
                    let obj = {};
                    obj.url = item;
                    this.imgList.push(obj);
                }
            });
        },
        //保存编辑
        saveEdit() {
            let urlStr, list = [];
            this.imgList.forEach(item => {
                list.push(item.url);
            });
            urlStr = list.join(",");
            this.editData.oicImg = urlStr;
            client.postData(OIC_EDIT, this.editData).then(data => {
                if (data.code == 200) {
                    this.$parent.getList(false, true);
                    this.hideDialog();
                    this.$parent.showMsg("编辑成功");
                } else {
                    this.showMsg(data.msg);
                }
            });
        },
        // 详情图片上移
        detailMoveUp(index) {
            if (this.imgList.length > 1) {
                // 图片向上移动一位,即点中移动的图片和前一张图片交换位置
                let temp = {};
                if (index != 0) {
                    temp = this.imgList[index];
                    this.imgList.$set(index, this.imgList[index - 1]);
                    this.imgList.$set(index - 1, temp);
                } else {
                    // 如果点击的是第一张图片,则与最后一张交换
                    temp = this.imgList[index];
                    this.imgList.$set(index, this.imgList[this.imgList.length - 1]);
                    this.imgList.$set(this.imgList.length - 1, temp);
                }
            }
        },
        // 详情图片下移
        detailMoveDown(index) {
            if (this.imgList.length > 1) {
                // 图片向下移动一位,即点中移动的图片和后一张图片交换位置
                let temp = {};
                if (index != (this.imgList.length - 1)) {
                    temp = this.imgList[index];
                    this.imgList.$set(index, this.imgList[index + 1]);
                    this.imgList.$set(index + 1, temp);
                } else {
                    // 如果点击的是最后一张图片,则与第一张交换
                    temp = this.imgList[index];
                    this.imgList.$set(index, this.imgList[0]);
                    this.imgList.$set(0, temp);
                }
            }
        },
        // 详情图片删除
        detailRemove(index) {
            this.imgList.splice(index, 1);
        },
        //显示选择多图片
        showPicDialog(type) {
            this.showSelectPic({ name: 'bannerPic', show: true, storeType: 4, single: false });
            this.selectPicType = type;
        },
        // 隐藏选择资源弹窗
        cancelSelect() {
            this.showSelectPic({ show: false });
        },
        // 选择图片文件回调
        selectPicFunc(list) {
            for (let i = 0; i < list.length; i++) {
                this.imgList.push(list[i]);
            }
            console.log(this.imgList);
            this.showSelectPic({ show: false });
            //console.log(this.singleimgList);
        },
        hideAddDialog() {
            this.showDialog = false;
        },
        hideDialog() {
            setTimeout(() => {
                this.showPage = false;
                this.onhide();
            }, 300)
            this.$parent.getList(false, true);
        },
        hideCampaignDialog() {
            this.showCampaignStatus = false;
            setTimeout(() => {
                this.showCampaignStatus = true;
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
                "authorName": "",
                "authorTitle": "",
                "authorType": 2,
                "bgUrl": "",
                "description": "",
                "halfFigure": "",
                "iconId": null,
                "iconUrl": "",
                "painIds": [],
                "painOptions": []
            }
            this.painIdsSelect = [];
        },
    },
    computed() {

    },
    created() {
    },
    watch: {
        show() {
            this.showPage = this.show;
            this.showDialog = this.show;
            this.imgList = [];
            this.showImg();
        },
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
<style>
.myBorder {
    border-top: 1px solid #000
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s
}

#PreferentialContent {
    border: 2px solid #CCCCCC;
    width: 300px;
    position: absolute;
    bottom: -10%;
    left: 70%;
    background-color: white;
    display: none;
}

#PreferentialContent td {
    background-color: white;
    border-right: 2px solid #D7D7D7;
    border-left: 2px solid #D7D7D7;
}
</style>