<template>
<div class="select-dialog" :class="{single:singleDialog}">
    <div class="dialog">
        <div class="hd">
        <span class="fr">图片大小：{{options.cut.width}}*{{options.cut.height}}</span>
        图片裁剪</div>
        <div class="bd">
            <div class="right-content">
                <div class="img-container">
                    <img :src="cropImageInfo.url" id="cropImage">
                </div>
                <div class="loading" v-if="isLoading">
                    <div class="page-spinner-bar" style="top:48%;">
                        <div class="bounce1"></div>
                        <div class="bounce2"></div>
                        <div class="bounce3"></div>
                    </div>
                </div>
                <div class="upload-list" v-if="uploadList.length!=0">
                    <template v-for="item in uploadList" >
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
            <a class="btn-ok" @click="selectOk">确定</a>
            <a class="btn-cancel" @click="oncancel">取消</a>
        </div>
    </div>  
</div>
</template>
<script>
    import client from '../../common/utils/client';
    import { getResourceList } from '../../vuex/actions/actions.resource';
    export default {
        props: {
            imageinfo: {
                type: Object,
                default: {}
            },
            options: {
                type: Object,
                default: {}
            },
            onselect: {
                type: Function,
                default: ()=>{}
            },
            oncancel: {
                type: Function,
                default: ()=>{}
            },
            singleDialog: {
                type: Boolean,
                default: false
            }
        },
        vuex: {
          getters: {
            resouceList: ({resourceControl}) => resourceControl.resouceList,
          },
          actions: {
            getResourceList
          }
        },
        data () {
            return {
               uploadList: [],
               selectList: [],
               totalPage: 1,
               curPage: 1,
               isLoading: false,
               cropImageInfo: null,
            }
        },
        ready () {
            $(document).on('click',this.cancelRemove);
        },
        beforeDestroy () {
        },
        created () {
        },
        methods: {
           selectOk() {
            const _this = this;
            let base64 = this.cropper.getCroppedCanvas({
                width: this.options.cut.width,
                height: this.options.cut.height,
                fillColor:'#FFF'}).toDataURL('image/jpeg',60);
            _this.uploadImg(base64);
           },
           uploadImg(imgData) {
            let _this = this;
            let options = {
                bast64File: imgData.split(',')[1],
                fileName: this.cropImageInfo.name,
                mediumType: 1,
                storeType: 1,
                creator: this.cropImageInfo.creator,
            }
            if(this.cropImageInfo.storeType != ''){
                options.storeType = this.cropImageInfo.storeType;
            }
            _this.isLoading = true;
            $.ajax({
              url: File_Upload+'1.0.0/upload/base64file',
              data: JSON.stringify(options),
              contentType: 'application/json',
              type: 'post',
              headers: {
                  Authorization: client.cmsHearders.Authorization
              },
              success: function(data){
                _this.isLoading = false;
                if(data.code!=200){
                    alert(data.msg);
                }else{
                    _this.onselect(data.data);
                }
              },
              error: function(){
                _this.isLoading = false;
              }
            })
           },
           cancelFile(item) {
            this.uploader.removeFile(item.file);
            let index = this.uploadList.findIndex((info)=>info.id==item.id);
            if(index>=0){
                this.uploadList.splice(index,1);
            }
           },
           initUploader(){
                
           },
           initCropper(){
              let _this = this;
              var Cropper = window.Cropper;
              var container = document.querySelector('.img-container');
              var image = document.querySelector('#cropImage');
              var img = new Image();
              img.src = this.imageinfo.url;
              img.onload = ()=>{
                if((img.width/img.height).toFixed(3) == (this.options.cut.width/this.options.cut.height).toFixed(3)){
                    this.uploadImg(img.src);
                }else{
                  var cropAreaRatio = 1;
                  var options = {
                    aspectRatio: _this.options.cut.width / _this.options.cut.height,
                    minContainerWidth: 800,
                    minContainerHeight: 490,
                    cropBoxResizable: false,
                    ready: function (e) {
                    },
                    cropstart: function (e) {
                    },
                    cropmove: function (e) {
                    },
                    cropend: function (e) {
                    },
                    crop: function (e) {
                      var data = e.detail;
                    },
                    zoom: function (e) {
                    },
                  };
                  this.cropper = new Cropper(image, options);
                }
              }
           }
        },
        beforeDestory () {
            $(document).unbind('click',this.cancelRemove);
        },
        watch: {
           options() {
            this.initUploader();
           },
           imageinfo(){
            this.cropImageInfo = this.imageinfo;
            if(this.cropper){
                this.cropper.destroy();
            }
            setTimeout(()=>{
                this.initCropper();
            },200)
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
.thumbnail>img, .thumbnail a>img {
    display: block;
    height: auto;
    max-width: 100%;
    margin-right: auto;
    margin-left: auto;
}
.page-spinner-bar {
}
.loading {
    position: absolute;
    width: 100%;
    height: 100%;
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
    background: rgba(0,0,0,0);
    top: 0;
    left: 0;
    z-index: 11;
    &.single {
        .dialog {
            top: 0;
            height: 580px;
            margin-top: 0;
            #uploader-block .thumbnail {
                height: 100px;
            }
            .pagging {
                bottom: 21px;
            }
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
        box-shadow: 0 0 15px rgba(0,0,0,0.2);
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
            .right-content {
                position: relative;
                left: 0;
                width: 800px;
                height: 490px;
                .loading {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                }
            }
            .img-container {
                width: 800px;
                height: 490px;
                text-align: center;
                img {
                    max-width: 100%;
                    max-height: 100%;
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
}
</style>

