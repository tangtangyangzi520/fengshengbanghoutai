<template>
    <div class="select-dialog" :class="{single:singleDialog}">
        <div class="dialog">
            <div class="hd">
                <!-- <span class="fr">最大上传图片大小5M</span> -->
                选择{{typeText}}
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
                        <a id="fileMediaPicker">本地上传</a>
                        <form id="searchMediaForm">
                            <div class="input-icon right" style="margin-top:8px;width:30%;float:left;">
                                <i class="fa fa-search" style="cursor:pointer;" @click="goSearch()"></i>
                                <input type="text" v-model="searchKey" class="form-control input-circle" placeholder="请输入文件名称">
                            </div>
                        </form>
                        <div class="checkbox-list">
                            <label class="checkbox-inline">
                                <div class="checker" id="uniform-inlineCheckbox21">
                                    <span class="">
                                        <input type="checkbox" v-model="isCreator" id="inlineCheckbox21" value="option1">
                                    </span>
                                </div> 本人上传
                            </label>
                        </div>
                        <select class="form-control filter-options" v-model="filterTime">
                            <option value="0">全部时间</option>
                            <option value="1">今天</option>
                            <option value="2">最近7天</option>
                            <option value="3">最近30天</option>
                        </select>
                    </div>
                    <div id="uploader-block" v-if="!isLoading">
                        <div v-if="imgList.length!=0">
                            <div :id="item.id" class="file-item thumbnail" v-for="item in imgList" :class="{'active':item.isSelected}" @click="selectFile(item)">
                                <a class="fr btn" :href="item.url" target="_blank" title="点击播放">
                                    <i class="fa fa-play"></i>
                                </a>
                                <div class="file-img">
                                    <span v-if="options.type=='music'">
                                        <i class="fa fa-music"></i>
                                    </span>
                                    <span v-if="options.type=='video'">
                                        <i class="fa fa-video-camera"></i>
                                    </span>
                                </div>
                                <div class="info">{{item.name}}</div>
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
                                <div class="confirm" v-if="item.showRemove">
                                    <a class="btn red btn-sure" @click="removeItem(item)">确定</a>
                                    <a class="btn default" @click="cancelRemove(item)">取消</a>
                                </div>
                            </div>
                        </div>
                        <div style="text-align:center;line-height:400px;" v-if="isSearch&&imgList.length==0">没有搜索结果</div>
                        <div style="text-align:center;line-height:400px;" v-if="!isSearch&&imgList.length==0">暂无文件</div>
                    </div>
                    <div class="pagging" v-if="resouceList.page.totalPage>1">
                        <a class="btnPrev" @click.prevent="getPrevList()" v-if="resouceList.page.currentPage!=1">
                            <i class="fa fa-caret-left"></i>
                        </a>
                        {{resouceList.page.currentPage}} / {{resouceList.page.totalPage}}
                        <span style="display:inline-block;width:32px;">
                            <a class="btnNext" @click.prevent="getNextList()" v-if="resouceList.page.currentPage!=resouceList.page.totalPage">
                                <i class="fa fa-caret-right"></i>
                            </a>
                        </span>
                    </div>
                    <div class="select-file-info" v-if="selectFileInfo">
                        文件大小：{{selectFileInfo.size|filterSize}}　时长：{{selectFileInfo.duration|filterTime}}
                    </div>
                    <div class="loading" v-if="isLoading">
                        <div class="page-spinner-bar">
                            <div class="bounce1"></div>
                            <div class="bounce2"></div>
                            <div class="bounce3"></div>
                        </div>
                    </div>
                    <div class="upload-list" v-if="uploadList.length!=0">
                        <template v-for="item in uploadList">
                            <div class="item" v-if="uploadList.length!=0&&item.status!='uploadSuccess'">
                                <a class="fr btn-remove" @click="cancelFile(item)" v-if="item.progress<100">取消</a>
                                <span class="fl file-name">{{item.name}}</span>
                                <span class="fl file-size">{{parseInt(item.size/1024)}}k</span>
                                <div class="progress progress-striped active">
                                    <div class="progress-bar progress-bar-info" role="progressbar" :aria-valuenow="item.progress" aria-valuemin="0" aria-valuemax="100" :style="{width: item.progress+'%'}">
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <div class="ft">
                <div class="fl">已选择{{selectList.length}}个</div>
                <a class="btn-ok" :class="{disabled:selectList.length==0}" @click="selectOk">确定</a>
                <a class="btn-cancel" @click="cancelBack">取消</a>
            </div>
            <audio style="display: none" id="audioForLength"></audio>
            <audio style="display: none" id="videoForLength"></audio>
        </div>
    </div>
</template>
<script>
import client from '../../common/utils/client';
import { getResourceList } from '../../vuex/actions/actions.resource';
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
        singleType: {
            type: Boolean,
            default: true
        },
        singleDialog: {
            type: Boolean,
            default: false
        }
    },
    vuex: {
        getters: {
            resouceList: ({ resourceControl }) => resourceControl.resouceList,
        },
        actions: {
            getResourceList
        }
    },
    data() {
        return {
            menu: [{ id: 0, name: '全部' }, { id: 1, name: '文章' }, { id: 2, name: '商品/服务' }, { id: 3, name: '用户' }, { id: 4, name: '专家' }, { id: 5, name: '视频内容' }, { id: 6, name: '其他' }],
            activeMenu: 0,
            uploadList: [],
            imgList: [],
            selectList: [],
            totalPage: 1,
            curPage: 1,
            isLoading: true,
            searchKey: '',
            isSearch: false, //当前列表数据是在搜索
            selectFileInfo: null,
            isCreator: false, //搜索条件，本人
            creator: 0, //搜索条件，本人
            dateArea: [{ type: 0, name: '全部时间' }, { type: 1, name: '今天' }, { type: 2, name: '最近一周' }, { type: 3, name: '最近一月' }],
            filterTime: 0, //搜索条件，时间段,
            searchOption: null, //最后请求数据的参数
        }
    },
    computed: {
        mediumType() {
            return this.options.type == 'video' ? 3 : 2;
        },
        typeText() {
            return this.options.type == 'video' ? '视频' : '音乐';
        }
    },
    ready() {
        this.initUploader();
        $(document).on('click', this.cancelRemove);
        let _this = this;
        $('#searchMediaForm').on('submit', function (e) {
            e.preventDefault();
            _this.isLoading = true;
            _this.isSearch = true;
            let options = { mediumType: this.mediumType, storeType: _this.activeMenu == 0 ? '' : _this.activeMenu, storeName: _this.searchKey, page: { pageSize: 16, currentPage: 1 } };
            _this.appendSearchOptions(options);
            _this.searchOption = options;
            _this.getResourceList(options);
        })
    },
    beforeDestroy() {
    },
    created() {
    },
    filters: {
        filterTime(val) {
            let duration = parseInt(val);
            let minutes = parseInt(duration / 60);
            let seconds = duration % 60;
            duration = minutes != 0 ? minutes + '分' + seconds + '秒' : seconds + '秒';
            return duration;
        },
        filterSize(val) {
            if (val < 1024) {
                return val + 'Kb';
            } else {
                return (val / 1024).toFixed(2) + 'M';
            }
        }
    },
    methods: {
        goSearch() {
            this.isSearch = true;
            this.isLoading = true;
            let options = { mediumType: this.mediumType, storeType: this.activeMenu == 0 ? '' : this.activeMenu, storeName: this.searchKey, page: { pageSize: 16, currentPage: 1 } };
            this.appendSearchOptions(options);
            this.searchOption = options;
            this.getResourceList(options);
        },
        getNextList() {
            this.isLoading = true;
            let page = this.resouceList.page.currentPage + 1;
            let options = { mediumType: this.mediumType, storeType: this.activeMenu == 0 ? '' : this.activeMenu, page: { pageSize: 16, currentPage: page } };
            this.appendSearchOptions(options);
            if (this.isSearch) {
                Object.assign(options, { storeName: this.searchKey });
            }
            this.searchOption = options;
            this.getResourceList(options);

        },
        getPrevList() {
            this.isLoading = true;
            let page = this.resouceList.page.currentPage - 1;
            let options = { mediumType: this.mediumType, storeType: this.activeMenu == 0 ? '' : this.activeMenu, page: { pageSize: 16, currentPage: page } };
            this.appendSearchOptions(options);
            if (this.isSearch) {
                Object.assign(options, { storeName: this.searchKey });
            }
            this.searchOption = options;
            this.getResourceList(options);
        },
        appendSearchOptions(options) {
            this.isLoading = true;
            let dtEnd = new Date(Date.now() + 24 * 60 * 60 * 1000);
            options.endTime = dtEnd.getFullYear() + '-' + this.intNum(dtEnd.getMonth() + 1) + '-' + this.intNum(dtEnd.getDate());
            if (this.filterTime == 1) {
                options.startTime = this.getSearchStartTime(1);
            } else if (this.filterTime == 2) {
                options.startTime = this.getSearchStartTime(7);
            } else if (this.filterTime == 3) {
                options.startTime = this.getSearchStartTime(31);
            } else {
                delete options.startTime;
                delete options.endTime;
            }
            options.creator = this.creator;
        },
        getSearchStartTime(day) {
            let dtTime = new Date(Date.now() - (day - 1) * 24 * 60 * 60 * 1000);
            return dtTime.getFullYear() + '-' + this.intNum(dtTime.getMonth() + 1) + '-' + this.intNum(dtTime.getDate());
        },
        intNum(num) {
            return num > 9 ? num : '0' + num;
        },
        selectMenu(item) {
            this.isLoading = true;
            this.activeMenu = item.id;
            let options = { mediumType: this.mediumType, storeType: this.activeMenu == 0 ? '' : this.activeMenu, page: { pageSize: 16, currentPage: 1 } };
            this.appendSearchOptions(options);
            if (this.isSearch) {
                Object.assign(options, { storeName: this.searchKey });
            }
            this.searchOption = options;
            this.getResourceList(options);
            this.initUploader();
        },
        cancelBack() {
            this.activeMenu = 0;
            this.oncancel();
        },
        selectOk() {
            if (this.selectList.length != 0) {
                this.activeMenu = 0;
                localStorage.setItem(this.options.name, JSON.stringify(this.selectList));
                this.onselect(this.selectList);
            }
        },
        selectFile(item) {
            if (!this.singleType) {
                if (!item.isSelected) {
                    this.selectList.push(item);
                } else {
                    const index = this.selectList.findIndex((info) => item.id == info.id);
                    this.selectList.splice(index, 1);
                }
            } else {
                if (!item.isSelected) {
                    for (let i = 0; i < this.imgList.length; i++) {
                        this.imgList[i].isSelected = false;
                    }
                    this.selectList = [item];
                } else {
                    this.selectList = [];
                }
            }
            item.isSelected = !item.isSelected;
            if (item.isSelected) {
                if (this.options.type == 'video') {
                    const audio = document.getElementById('audioForLength');
                    audio.src = item.url;
                    audio.addEventListener('canplay', () => {
                        this.selectFileInfo = {
                            size: item.size,
                            duration: audio.duration
                        }
                    })
                } else {
                    const video = document.getElementById('videoForLength');
                    video.src = item.url;
                    video.addEventListener('canplay', () => {
                        this.selectFileInfo = {
                            size: item.size,
                            duration: video.duration
                        }
                    })
                }
            } else {
                this.selectFileInfo = null;
            }
        },
        showRemoveConfirm(item) {
            this.cancelRemove();
            item.showRemove = true
        },
        removeItem() {

        },
        cancelRemove() {
            for (let i = 0; i < this.imgList.length; i++) {
                this.imgList[i].showRemove = false;
            }
        },
        getImgList(page) {
            let list = localStorage.getItem('imgList');
            list = !list ? [] : JSON.parse(list);
            for (let i = 0; i < list.length; i++) {
                list[i].showRemove = false;
                list[i].isSelected = false;
            }
            this.imgList = list.splice(page - 1, 18);
        },
        cancelFile(item) {
            this.uploader.removeFile(item.file);
            let index = this.uploadList.findIndex((info) => info.id == item.id);
            if (index >= 0) {
                this.uploadList.splice(index, 1);
            }
        },
        initUploader() {
            let _this = this;
            if (_this.uploader) {
                _this.uploader = null;
            }
            // 初始化Web Uploader
            _this.uploader = WebUploader.create({
                // 选完文件后，是否自动上传。
                auto: true,
                // 文件接收服务端。
                server: File_Upload + '1.0.0/upload/file',
                pick: '#fileMediaPicker',
                accept: {
                    title: 'media',
                    extensions: _this.options.type == 'video' ? 'mpeg,mp4,avi,mov' : 'mp3,mp4,wav,wma',
                    mimeTypes: _this.options.type == 'video' ? 'video/mpeg,video/mp4,video/avi,video/mov' : 'audio/mp3,audio/mp4,audio/wav,audio/wma'
                },
                formData: {
                    "mediumType": _this.mediumType,
                    "storeType": _this.activeMenu == 0 ? 1 : _this.activeMenu
                },
                fileVal: 'multiFile',
                duplicate: false,
                sendAsBinary: false,
                fileNumLimit: 10
            })
            _this.uploader.on('uploadBeforeSend', function (obj, data, headers) {
                headers.Authorization = client.cmsHearders.Authorization;
            });
            // 当有文件添加进来的时候
            _this.uploader.on('fileQueued', function (file) {
                let item = {
                    name: file.name,
                    id: file.id,
                    url: '',
                    progress: 0,
                    size: file.size,
                    file: file,
                }
                _this.uploadList.push(item)
                _this.uploader.makeThumb(file, function (error, src) {
                    if (error) {
                        item.status = 'error';
                    }
                    item.url = src;
                }, 300, 300);
            })
            _this.uploader.on('uploadProgress', function (file, percentage) {
                let item = _this.uploadList.find((item) => item.id == file.id);
                item.progress = percentage * 100;
            });
            _this.uploader.on('uploadSuccess', function (file, data) {
                let index = _this.uploadList.findIndex((item) => item.id == file.id);
                if (index >= 0) {
                    _this.uploadList.splice(index, 1);
                    _this.getImgList(1);
                }
            });
            _this.uploader.on('uploadError', function (file) {
                let item = _this.uploadList.find((item) => item.id == file.id);
                let index = _this.uploadList.findIndex((item) => item.id == file.id);
                item.error = 'uploadError'
                _this.uploadList.splice(index, 1);
            });
            _this.uploader.on('uploadComplete', function (file) {
                _this.isLoading = true;
                let options = { mediumType: _this.mediumType, storeType: _this.activeMenu == 0 ? '' : _this.activeMenu, page: { pageSize: 16, currentPage: 1 } };
                _this.appendSearchOptions(options);
                _this.searchOption = options;
                _this.getResourceList(options);
            });
        }
    },
    beforeDestory() {
        $(document).unbind('click', this.cancelRemove);
    },
    watch: {
        filterTime(val) {
            this.appendSearchOptions(this.searchOption);
            this.getResourceList(this.searchOption);
        },
        isCreator(val) {
            this.isLoading = true;
            this.creator = val ? 1 : 0;
            this.searchOption.creator = this.creator;
            this.getResourceList(this.searchOption);
        },
        resouceList() {
            let list = this.resouceList.data.fileResources;
            this.isLoading = false;
            if (list != null) {
                let arr = [];
                for (let i = 0; i < list.length; i++) {
                    list[i].showRemove = false;
                    list[i].isSelected = false;
                    let item = list[i];
                    arr.push({ url: item.ossUrl, name: item.storeName, showRemove: false, isSelected: false, size: item.storeSize });
                }
                this.imgList = arr;
            } else {
                this.imgList = [];
            }
        },
        options() {
            this.isLoading = true;
            this.selectList = [];
            this.selectFileInfo = null;
            this.searchKey = '';
            if (typeof this.options.storeType != 'undefined') {
                this.activeMenu = this.options.storeType;
            }
            this.creator = 1;
            this.isCreator = true;
            this.filterTime = 1;
            this.initUploader();
            let options = { mediumType: this.mediumType, storeType: this.activeMenu == 0 ? '' : this.activeMenu, page: { pageSize: 16, currentPage: 1 } };
            this.appendSearchOptions(options);
            if (this.isSearch) {
                Object.assign(options, { storeName: this.searchKey });
            }
            this.searchOption = options;
            this.getResourceList(options);
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

.top-bar {
    .checkbox-list {
        padding-top: 3px;
        margin-left: 50px;
        width: 90px;
        float: left;
        input {
            margin-top: 14px;
        }
    }
    .filter-options {
        float: left;
        width: 120px;
        padding-right: 20px;
        margin-top: 7px;
    }
}

.thumbnail>img,
.thumbnail a>img {
    display: block;
    height: auto;
    max-width: 100%;
    margin-right: auto;
    margin-left: auto;
}

.loading {
    position: absolute;
    width: 100%;
    height: 100%;
}

.page-spinner-bar {
    position: absolute;
}

#uploader-block .thumbnail {
    position: relative;
    width: 308px;
    height: 30px;
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
            line-height: 26px;
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
        width: 100%;
        height: 88px;
        border: 1px solid #CCC;
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
    margin: 16px 0 0 21px;
    padding: 0;
    background: #F5F5F5;
    .info {
        position: relative;
        left: 0;
        bottom: 0;
        right: 0;
        height: 30px;
        line-height: 26px;
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
    &.single {
        .dialog {
            top: 0;
            height: 580px;
            margin-top: 0;
            .pagging {
                bottom: 21px;
            }
        }
        .select-file-info {
            bottom: 21px;
        }
    }
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
                .loading {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                }
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
    .webuploader-pick {
        line-height: 30px!important;
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

.select-file-info {
    position: absolute;
    bottom: 5px;
    width: 60%;
    height: 40px;
    line-height: 32px;
    text-align: left;
    padding-left: 25px;
    font-size: 12px;
    color: #699b0d;
}
</style>

