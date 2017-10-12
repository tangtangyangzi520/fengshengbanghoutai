<template>
    <div style="position: absolute;top:0;left:0;width:100%;height:100%;" >
        <m-alert v-if="!removeAddDialog" :title="title" :hide-btn="true" :show="showDialog" :onhide="hideDialog" :onsure="submitInfo" :effect="'fade'" :width="'800px'">
            <div slot="content">
                <table class="table table-striped table-bordered table-hover" >
                        <thead>
                            <tr style="background-color:#F2F2F2;height:40px;" :class="odd:flag">
                                <th style="width:25%;text-align:left;border-right:none;border-left:none; ">时间</th>
                                <th style="width:65%;text-align:left;border-right:none;border-left:none;">内容</th>
                                <th style="width:10%;text-align:center;border-right:none;border-left:none;">状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(index,log) in orderlogdetail" style="border-bottom:2px solid #D7D7D7;height:40px;">
                                <td style="width:25%;text-align:left;vertical-align:middle;font-family: 'Arial Normal', 'Arial';font-weight: 100;font-style: normal;border-right:none;border-left:none;color:green" v-if="index == 0 ">
                                    {{log.oddTime}}
                                </td>
                                <td style="width:25%;text-align:left;vertical-align:middle;font-family: 'Arial Normal', 'Arial';font-weight: 100;font-style: normal;border-right:none;border-left:none;" v-else>
                                    {{log.oddTime}}
                                </td>
                                <td style="width:60%;text-align:left;vertical-align:middle;border-left:2px solid #D7D7D7;color:green" v-if="index == 0 ">
                                    {{log.oddContent}}
                                </td>
                                <td style="width:60%;text-align:left;vertical-align:middle;border-left:2px solid #D7D7D7;" v-else >
                                    {{log.oddContent}}
                                </td>
                                <td style="width:10%;text-align:center;vertical-align:middle;border-left:2px solid #D7D7D7;color:green" v-if="index == 0 ">{{log.oddStatus}}</td>
                                <td style="width:10%;text-align:center;vertical-align:middle;border-left:2px solid #D7D7D7;" v-else>{{log.oddStatus}}</td>
                            </tr>
                            <tr v-if="subData.orderDetailList.length==0">
                                <td colspan="2">暂无数据</td>
                            </tr>
                        </tbody>
                 </table>
             </div>
         </m-alert>
    </div>
</template>
<script>
import client from '../../common/utils/client';
import {  mAlert, mSelect, mMultiSelect, selectComponentAll, itemList } from '../../components';
import loading from '../common/loading';
export default {
    components: {  mAlert, mSelect, mMultiSelect, selectComponentAll, itemList, loading },
    props: {
        orderlogdetail:[],
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
    },
    data() {
        return {
            isLoading: false,
            showDialog: false,
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
            showAlert: false,
            showAlertTitle: '温馨提示',
            showAlertMsg: '',
            removeAddDialog: false,
            title: '物流详情',
            sourceDemo:'',//取消时回显
        }
    },
    methods: {
        hideDialog() {
            setTimeout(() => {
                this.onhide();
            }, 50)
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
    computed(){
        
    },
    created() {
        
    },
    watch: {
    orderlogdetail(val){
    },
    show(val) {
        this.showDialog = val;
        },
    },
    ready() {
        this.typesList = client.global.componentTypes;
    },
    beforeDestroy() {
    }
};
</script>
