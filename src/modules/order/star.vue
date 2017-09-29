<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" v-show="showPage">
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'500px'">

            <div slot="content">
                <a style="font-size:30px;color:#ffcc00;text-decoration:none;" v-if="starValue >=1" @click="setStarValue(1)">
                    <span class="glyphicon glyphicon-star" aria-hidden="true"></span>
                </a>
                <a style="font-size:30px;color:#DCDCDC;text-decoration:none;" v-if="starValue <1" @click="setStarValue(1)">
                    <span class="glyphicon glyphicon-star" aria-hidden="true"></span>
                </a>
                <a style="font-size:30px;color:#ffcc00;text-decoration:none;" v-if="starValue >=2" @click="setStarValue(2)">
                    <span class="glyphicon glyphicon-star" aria-hidden="true"></span>
                </a>
                <a style="font-size:30px;color:#DCDCDC;text-decoration:none;" v-if="starValue <2" @click="setStarValue(2)">
                    <span class="glyphicon glyphicon-star" aria-hidden="true"></span>
                </a>
                <a style="font-size:30px;color:#ffcc00;text-decoration:none;" v-if="starValue >=3" @click="setStarValue(3)">
                    <span class="glyphicon glyphicon-star" aria-hidden="true"></span>
                </a>
                <a style="font-size:30px;color:#DCDCDC;text-decoration:none;" v-if="starValue <3" @click="setStarValue(3)">
                    <span class="glyphicon glyphicon-star" aria-hidden="true"></span>
                </a>
                <a style="font-size:30px;color:#ffcc00;text-decoration:none;" v-if="starValue >=4" @click="setStarValue(4)">
                    <span class="glyphicon glyphicon-star" aria-hidden="true"></span>
                </a>
                <a style="font-size:30px;color:#DCDCDC;text-decoration:none;" v-if="starValue <4" @click="setStarValue(4)">
                    <span class="glyphicon glyphicon-star" aria-hidden="true"></span>
                </a>
                <a style="font-size:30px;color:#ffcc00;text-decoration:none;" v-if="starValue >=5" @click="setStarValue(5)">
                    <span class="glyphicon glyphicon-star" aria-hidden="true"></span>
                </a>
                <a style="font-size:30px;color:#DCDCDC;text-decoration:none;" v-if="starValue <5" @click="setStarValue(5)">
                    <span class="glyphicon glyphicon-star" aria-hidden="true"></span>
                </a>

            </div>
            <div slot="btnList">
                <button type="button" @click.stop="addStar" class="btn default blue">提交</button>
                <button type="button" class="btn default" data-dismiss="modal">取消</button>
            </div>
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
    </div>
</template>
<script>
import client from '../../common/utils/client';
import { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList } from '../../components';
import loading from '../common/loading';
import { showSelectPic, getSelectPicList } from '../../vuex/actions/actions.resource';
export default {
    components: { selectPic, mAlert, mSelect, mMultiSelect, selectComponentAll, itemList, loading },
    props: {
        show: {
            type: Boolean,
            value: false
        },
        onhide: {
            type: Function,
            value: () => { }
        },
        starnum: {
            type: Number,
            value: 0
        },
        id: {
            type: String,
            value: 0
        },
    },
    data() {
        return {
            isLoading: false,
            showDialog: false,
            showPage: false,
            showPainListSelect: true,
            painIdsSelect: [],
            starValue: 0,
            painList: [],
            componentShowOption: {},
            data: {
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
            },
            addStarData: {
                "ordStar": 0,
                "orsubId": 0
            },
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '加星',
            sourceStar:0,//用来取消时回显数据
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
        //设置显示星数
        setStarValue(num) {
            this.starValue = num;
        },
        //加星操作
        addStar() {
            this.addStarData.ordStar = this.starValue;
            this.addStarData.orsubId = this.id;
            client.postData(ORDER_ADD_STAR, this.addStarData).then(data => {
                if (data.code == 200) {
                    this.showMsg(data.msg);
                    this.$parent.getList(false, true);
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
            });
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
            this.starValue=this.sourceStar;
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
            this.hideDialog();
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
        },
        starnum() {
            this.starValue = 0;
            this.starValue = this.starnum;
            this.sourceStar= this.starnum;
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