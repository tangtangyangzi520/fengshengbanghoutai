<template>
    <div class="select-dialog">
        <div class="dialog">
            <div class="hd">
                选择{{typeName}}
            </div>
            <div class="bd">
                <div class="left-side">
                    <ul>
                        <li v-for="item in menu" @click="selectMenu(item)" :class="{active:item.id==activeMenu}">{{item.name}}</li>
                        <!-- <li>+新建分组</li> -->
                    </ul>
                </div>
                <div class="right-content">
                    <div class="top-bar">
                        <form id="searchForm">
                            <div class="input-icon right" style="margin-top:8px;width:50%;margin-left:50%;">
                                <i class="fa fa-search" style="cursor:pointer;" @click="goSearch()"></i>
                                <input type="text" v-model="searchKey" class="form-control input-circle" placeholder="请输入搜索名称">
                            </div>
                        </form>
                    </div>
                    <div id="uploader-block" v-if="!isLoading">
                        <div v-if="componentListData.length!=0">
                            <div :id="item.id" class="file-item thumbnail" v-for="item in componentListData" :class="{'active':item.isSelected}" @click="selectItem(item)">
                                <div class="info">
                                    <img :src="item.mediumHomeIcon.split('&&')[0]" v-if="item.mediumHomeIcon">{{item.componentType==27||item.componentType==15||item.componentType==13?item.subtitle:item.name}}</div>
                                <div class="hover" v-show="false">
                                    <a>
                                        <i class="fa fa-pencil"></i>
                                    </a>
                                    <a>
                                        <i class="fa fa-arrows-h"></i>
                                    </a>
                                    <a @click.stop="showRemoveConfirm(item)">
                                        <i class="fa fa-trash-o"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div style="text-align:center;line-height:400px;" v-if="isSearch&&componentListData.length==0">没有搜索结果</div>
                        <div style="text-align:center;line-height:400px;" v-if="!isSearch&&componentListData.length==0">暂无{{typeName}}</div>
                    </div>
                    <div class="pagging" v-if="componentList.page.totalPage>1">
                        <a class="btnPrev" @click.prevent="getPrevList()" v-if="componentList.page.currentPage!=1">
                            <i class="fa fa-caret-left"></i>
                        </a>
                        {{componentList.page.currentPage}} / {{componentList.page.totalPage}}
                        <span style="display:inline-block;width:32px;">
                            <a class="btnNext" @click.prevent="getNextList()" v-if="componentList.page.currentPage!=componentList.page.totalPage">
                                <i class="fa fa-caret-right"></i>
                            </a>
                        </span>
                    </div>
                    <div class="loading" v-if="isLoading">
                        <div class="page-spinner-bar">
                            <div class="bounce1"></div>
                            <div class="bounce2"></div>
                            <div class="bounce3"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ft">
                <div class="fl">已选择{{selectList.length}}个</div>
                <a class="btn-ok" :class="{disabled:selectList.length==0}" @click="selectOk">确定</a>
                <a class="btn-cancel" @click="oncancel">取消</a>
            </div>
        </div>
    </div>
</template>
<script>
import client from '../../common/utils/client';
import { getComponentListAll, getComponentChannelList } from '../../vuex/actions/actions.component';
export default {
    props: {
        options: {
            type: Object,
            default: {}
        },
        onselect: {
            type: Function,
            default: () => { }
        },
        oncancel: {
            type: Function,
            default: () => { }
        },

    },
    vuex: {
        getters: {
            componentList: ({ component }) => component.componentList,
            componentChannelList: ({ component }) => component.componentChannelList,
        },
        actions: {
            getComponentChannelList, getComponentListAll
        }
    },
    data() {
        return {
            singleType: true,
            menu: [{ id: 0, name: '全部' }],
            activeMenu: 0,
            uploadList: [],
            componentTypes: [],
            componentListData: [],
            selectList: [],
            totalPage: 1,
            curPage: 1,
            isLoading: true,
            searchKey: '',
            isSearch: false, //当前列表数据是在搜索
            typeName: '良品'
        }
    },
    ready() {
        $(document).on('click', this.cancelRemove);
        let _this = this;
        $('#searchForm').on('submit', function (e) {
            e.preventDefault();
            _this.isLoading = true;
            _this.isSearch = true;
            _this.getComponentListAll({ channelId: _this.activeMenu == 0 ? '' : _this.activeMenu, componentType: _this.options.componentType, title: _this.searchKey, page: { pageSize: 16, currentPage: 1 } })
        })
        this.componentTypes = client.global.componentTypes;
    },
    beforeDestroy() {
    },
    created() {
        this.getComponentListAll({ channelId: '', componentType: this.options.componentType, page: { pageSize: 16, currentPage: 1 } });
        if (this.options.componentType == 1) {
            // 商品列表才有渠道选择
            this.getComponentChannelList({})
        } else {
            this.typeName = '良店';
        }
    },
    methods: {
        goSearch() {
            this.isSearch = true;
            this.isLoading = true;
            this.getComponentListAll({ channelId: this.activeMenu == 0 ? '' : this.activeMenu, title: this.searchKey, componentType: this.options.componentType, page: { pageSize: 16, currentPage: 1 } })
        },
        getNextList() {
            this.isLoading = true;
            let page = this.componentList.page.currentPage + 1;
            if (this.isSearch) {
                this.getComponentListAll({ channelId: this.activeMenu == 0 ? '' : this.activeMenu, title: this.searchKey, componentType: this.options.componentType, page: { pageSize: 16, currentPage: page } })
            } else {
                this.getComponentListAll({ channelId: this.activeMenu == 0 ? '' : this.activeMenu, componentType: this.options.componentType, page: { pageSize: 16, currentPage: page } })
            }
        },
        getPrevList() {
            this.isLoading = true;
            let page = this.componentList.page.currentPage - 1;
            if (this.isSearch) {
                this.getComponentListAll({ channelId: this.activeMenu == 0 ? '' : this.activeMenu, componentType: this.options.componentType, title: this.searchKey, page: { pageSize: 16, currentPage: page } })
            } else {
                this.getComponentListAll({ channelId: this.activeMenu == 0 ? '' : this.activeMenu, componentType: this.options.componentType, page: { pageSize: 16, currentPage: page } })
            }
        },
        selectMenu(item) {
            this.isLoading = true;
            this.activeMenu = item.id;
            this.isSearch = false;
            this.getComponentListAll({ channelId: this.activeMenu == 0 ? '' : this.activeMenu, componentType: this.options.componentType, page: { pageSize: 16, currentPage: 1 } });
        },
        selectOk() {
            if (this.selectList.length != 0) {
                localStorage.setItem(this.options.name, JSON.stringify(this.selectList));
                this.onselect(this.selectList);
            }
        },
        selectItem(item) {
            if (!this.singleType) {
                if (!item.isSelected) {
                    this.selectList.push(item);
                } else {
                    const index = this.selectList.findIndex((info) => item.id == info.id);
                    this.selectList.splice(index, 1);
                }
            } else {
                if (!item.isSelected) {
                    for (let i = 0; i < this.componentListData.length; i++) {
                        this.componentListData[i].isSelected = false;
                    }
                    this.selectList = [item];
                } else {
                    this.selectList = [];
                }
            }
            item.isSelected = !item.isSelected;
        },
        showRemoveConfirm(item) {
            this.cancelRemove();
            item.showRemove = true
        },
        removeItem() {

        }
    },
    beforeDestory() {
        $(document).unbind('click', this.cancelRemove);
    },
    watch: {
        componentList() {
            this.isLoading = false;
            let list = this.componentList.data;
            if (list != null) {
                let arr = [];
                for (let i = 0; i < list.length; i++) {
                    let item = list[i];
                    item.showRemove = false;
                    let isSelected = false;
                    if (this.selectList.findIndex((info) => info.id == item.componentId) >= 0) {
                        isSelected = true;
                    }
                    item.isSelected = isSelected;
                    let tempItem = { url: item.mediumHomeIcon, name: item.title, showRemove: false, isSelected: isSelected, id: item.componentId };
                    Object.assign(tempItem, item);
                    arr.push(tempItem);
                }
                this.componentListData = arr;
            } else {
                this.componentListData = [];
            }
        },
        options() {
            this.isLoading = true;
            this.activeMenu = 0;
            if (!this.options.single) {
                this.singleType = false;
            }
            this.searchKey = '';
            if (this.options.componentType == 13) {
                // 商品列表才有渠道选择
                this.getComponentChannelList({});
                this.typeName = '良品';
            } else {
                console.log(client.global.componentTypes)
                this.typeName = client.global.componentTypes.find(item => item.id == this.options.componentType).name;
                this.menu = [{ id: 0, name: '全部' }];
            }
            this.getComponentListAll({ channelId: '', componentType: this.options.componentType, page: { pageSize: 16, currentPage: 1, totalSize: 0 } })
        },
        componentChannelList() {
            let list = this.componentChannelList.data;
            this.menu = [{ id: 0, name: '全部' }];
            for (let i = 0; i < list.length; i++) {
                this.menu.push({ id: list[i].dictionnaryId, name: list[i].keyValue });
            }
        }
    }
};
</script>
<style lang="less" scoped>
@import "../../assets/webuploader/webuploader.css";
.fl {
    float: left;
}

.fr {
    float: right;
}

img {
    border: 0;
}

.loading {
    position: absolute;
    width: 100%;
    height: 100%;
}

.page-spinner-bar {
    position: absolute;
}

.thumbnail>img,
.thumbnail a>img {
    display: block;
    height: auto;
    max-width: 100%;
    margin-right: auto;
    margin-left: auto;
}

#uploader-block .thumbnail {
    position: relative;
    width: 308px;
    height: 38px;
    border: none;
    padding: 3px;
    cursor: pointer;
    &:hover {
        background: #EEE;
    }
    .fa-play {
        color: #999;
        font-size: 12px;
        &:hover {
            color: #000;
        }
    }
    .fr.btn {
        padding: 2px 0;
        font-size: 12px;
        margin-left: 10px;
        margin-right: 10px;
        color: #666;
    }
    &.active {
        color: #FFF;
        background: #659be0;
        .fr.btn {
            color: #FFF;
        }
        .fa-play {
            color: #FFF;
            font-size: 12px;
            &:hover {
                color: #FFF;
            }
        }
        &:hover {
            background: #659be0;
        }
        .file-img {
            span {
                i {
                    color: #FFF;
                }
            }
        }
        .info {
            line-height: 32px;
            color: #FFF;
        }
    }
    .file-img {
        cursor: pointer;
        span {
            display: block;
            float: left;
            width: 26px;
            height: 30px;
            margin-left: 5px;
            line-height: 28px;
            i {
                font-size: 16px;
                color: #999;
            }
        }
    }
    img {
        height: 40px;
        width: 40px;
        float: left;
        margin-top: -10px;
        border: none;
        margin-right: 5px;
    }
    .hover {
        position: absolute;
        background: rgba(0, 0, 0, 0.5);
        top: 65px;
        left: 0;
        width: 100%;
        height: 30px;
        line-height: 30px;
        a {
            color: #EEE;
            display: block;
            float: left;
            width: 33.33%;
            text-align: center;
            &:hover {
                color: #FFF;
            }
        }
    }
    .confirm {
        position: absolute;
        width: 152px;
        height: 50px;
        text-align: center;
        top: 95px;
        left: 0;
        background: #FFF;
        padding-left: 5px;
        border: 1px solid #CCC;
        z-index: 10;
        a {
            font-size: 14px;
            margin: 8px 5px;
            width: 60px;
            &:hover {
                text-decoration: none;
            }
        }
    }
}

.file-item {
    float: left;
    position: relative;
    margin: 10px 0 0 21px;
    padding: 0;
    background: #F5F5F5;
    .info {
        position: relative;
        left: 0;
        bottom: 0;
        right: 0;
        height: 30px;
        line-height: 32px;
        color: #333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 12px;
        z-index: 10;
    }
    .error {
        position: absolute;
        top: 4px;
        left: 4px;
        right: 4px;
        background: red;
        color: white;
        text-align: center;
        height: 20px;
        font-size: 14px;
        line-height: 23px;
    }
}

.upload-list {
    position: absolute;
    z-index: 13;
    right: 1px;
    top: 49px;
    width: 400px;
    height: auto;
    background: #FFF;
    border: 1px solid #CCC;
    padding: 10px 10px 0 10px;
    .item {
        float: none;
        overflow: hidden;
        font-size: 12px;
        line-height: 24px;
        .file-name {
            display: block;
            width: 90px;
            height: 24px;
            line-height: 24px;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .file-size {
            color: #999;
            margin-right: 15px;
        }
        .progress {
            width: 200px;
            margin-bottom: 10px;
            height: 15px;
            margin-top: 4px;
        }
    }
}

.select-dialog {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    top: 0;
    left: 0;
    z-index: 11;
    .dialog {
        position: absolute;
        width: 800px;
        height: 600px;
        left: 50%;
        margin-left: -400px;
        top: 50%;
        margin-top: -300px;
        background: #FFF;
        box-sizing: border-box;
        border: 1px solid #CCC;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        .hd {
            position: relative;
            width: 100%;
            height: 50px;
            line-height: 50px;
            background: #EEE;
            color: #000;
            padding: 0 15px;
            box-sizing: border-box;
            border-bottom: 1px solid #DDD;
            font-size: 16px;
            span {
                font-size: 14px;
            }
        }
        .bd {
            position: relative;
            width: 100%;
            height: 560px;
            .left-side {
                position: absolute;
                left: 0;
                top: 0;
                width: 120px;
                height: 490px;
                border-right: 1px solid #DDD;
                box-sizing: border-box;
                overflow: auto;
                ul,
                li {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }
                li {
                    width: 100%;
                    height: 50px;
                    line-height: 50px;
                    font-size: 14px;
                    color: #333;
                    text-align: center;
                    border-bottom: 1px solid #DDD;
                    cursor: pointer;
                    &.active {
                        background-color: #DDD;
                        &:hover {
                            background: #DDD;
                        }
                    }
                    &:hover {
                        background: #EEE;
                    }
                }
            }
            .right-content {
                position: relative;
                left: 120px;
                width: 680px;
                height: 490px;
            }
        }
        .ft {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 60px;
            line-height: 60px;
            text-align: center;
            background: #EEE;
            border-top: 1px solid #CCC;
            padding-left: 20px;
            a {
                color: #333;
                border: 1px solid #CCC;
                display: inline-block;
                width: 80px;
                height: 36px;
                line-height: 36px;
                margin: 0 10px;
                text-align: center;
                background: #FFF;
                &:hover {
                    text-decoration: none;
                    background: #F5F5F5;
                }
                &.btn-ok {
                    color: #FFF;
                    background: #337AB7;
                    border-color: #337AB7;
                    &:hover {
                        text-decoration: none;
                        background: #286090;
                    }
                }
                &.btn-ok.disabled {
                    border: 1px solid #CCC;
                    color: #ababab;
                    background: #f3f3f3;
                }
            }
        }
    }
}

.top-bar {
    border-bottom: 1px solid #CCC;
    line-height: 40px;
    padding: 0 10px;
    height: 50px;
    overflow: hidden;
    a {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        margin-top: 10px;
        background: #9AC64A;
        color: #FFF;
        text-align: center;
        float: right;
        border-radius: 5px!important;
        .webuploader-pick {
            background: #9AC64A;
            width: 100px;
            height: 30px;
            line-height: 30px;
            padding: 0;
            border-radius: 5px!important;
        }
        &:hover .webuploader-pick {
            background: #8cb640;
        }
    }
}

.pagging {
    position: absolute;
    bottom: 5px;
    width: 100%;
    height: 40px;
    line-height: 32px;
    text-align: right;
    padding-right: 25px;
    font-size: 14px;
    a {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-size: 20px;
        width: 32px;
        color: #666;
        border: 1px solid #CCC;
        border-radius: 5px!important;
        vertical-align: -3px;
        margin: 0 5px;
        &:hover {
            background: #EEE;
            color: #333;
        }
    }
}
</style>

