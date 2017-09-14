<template>
    <div class="page-sidebar navbar-collapse collapse">
        <ul class="page-sidebar-menu" data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200">
            <li class="start nav-item" :class="{active:isIndexPage}">
                <a href="/dist/#!/">
                    <i class="icon-home"></i>
                    <span class="title">首页</span>
                    <span class="selected"></span>
                </a>
            </li>
            <li class="nav-item" v-for="item in catList" v-show="item.text!='' " :class="{active:item.active}">
                <a class="nav-link nav-toggle">
                    <i :class="!item.icon?'icon-wrench':item.icon"></i>
                    <span class="title"> {{item.text}} </span>
                    <span class="arrow" :class="{open:item.active}"></span>
                    <span class="selected" v-if="item.active"></span>
                </a>
                <ul class="sub-menu" v-if="catList.length!=0">
                    <li v-for="subItem in item.children"  :class="{active:subItem.active}" @click="changeUrl(subItem)">  <!-- v-show="subItem.state.selected" -->
                        <a>
                            <i class="icon-puzzle"></i> {{subItem.text}} </span>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script>
import client from "../../common/utils/client";
export default {
    props: {
        menuName: {
            type: String,
            default: 'index'
        },
    },
    data() {
        return {
            navList: [],
            isIndexPage: false,
			catList:[
			    {"text":"商品管理" ,"children":[
                    {"text":"商品列表","url":"/dist/#!/productManage"},
                    {"text":"品牌列表","url":"/dist/#!/productBrand"},
                    {"text":"通用属性列表","url":"/dist/#!/productCategoryAtrr"},
                    {"text":"销售属性列表","url":"/dist/#!/productCategoryAtrrOption"},
                  ]
                },
                {"text":"订单管理" ,"children":[
                    {"text":"订单列表","url":"/dist/#!/order"},
                    /*{"text":"品牌列表","url":"/dist/#!/productBrand"},
                    {"text":"属性列表","url":"/"},*/
                  ]
                },
                {"text":"营销管理" ,"children":[
                    {"text":"限时折扣列表","url":"/dist/#!/discountManage"},
                    {"text":"优惠券列表","url":"/dist/#!/couponManage"},
                    /*{"text":"品牌列表","url":"/dist/#!/productBrand"},
                    {"text":"属性列表","url":"/"},*/
                  ]
                },
			]
        }
    },
    created() {
        client.postData(SYSTEM_USER_RESOURCE, {}).then(response => {
            if (response.code == 200) {
                let list = response.data.root.children;
                let resource = {};
                list.forEach(litem => {
                    litem.active = false;
                    if(litem.code && litem.code.replace(/\s/g,'') != ''){
                        resource[litem.code] = litem.state.selected;
                    }
                    litem.children.forEach(item => {
                        switch (item.url) {
                            case 'info.painVideoMgr':
                                // 视频管理列表
                                item.url = '/dist/#!/painVideoList';
                                break;
                            case 'info.videoMgr':
                                // 视频管理列表
                                item.url = '/dist/#!/videoList';
                                break;
                            case 'info.loreVideoMgr':
                                // 痛点图文
                                item.url = '/dist/#!/articlePainList/19';
                                break;
                            case 'info.perfectSolveMgr':
                                // 360解决方案
                                item.url = '/dist/#!/articleList/20';
                                break;
                            case 'info.foodArticleMgr':
                                // 良食文章
                                item.url = '/dist/#!/articleList/14';
                                break;
                            case 'info.expertArticleMgr':
                                // 大咖说文章
                                item.url = '/dist/#!/articleList/21';
                                break;
                            case 'info.goodProductActicleMgr':
                                // 良品导购文
                                item.url = '/dist/#!/articleList/22';
                                break;
                            case 'info.goodStoreArticleMgr':
                                // 良店导购文
                                item.url = '/dist/#!/articleList/23';
                                break;
                            case 'info.activityArticleMgr':
                                // 活动文章
                                item.url = '/dist/#!/articleList/26';
                                break;
                            case 'info.goodProductMgr':
                                // 良品单品
                                item.url = '/dist/#!/goodProductStoreIndex/13';
                                break;
                            case 'info.solutionMgr':
                                // 行动食谱
                                item.url = '/dist/#!/solutionList';
                                break;
                            case 'info.goodStoreMgr':
                                // 良店单项
                                item.url = '/dist/#!/goodProductStoreIndex/15';
                                break;
                            case 'info.wordsArticleMgr':
                                // 良言
                                item.url = '/dist/#!/productBrand';
                                break;
                            case 'info.expertMgr':
                                // 专家管理
                                item.url = '/dist/#!/productManage';
                                break;
                            case 'info.bannerMgr':
                                // Banner管理
                                item.url = '/dist/#!/bannerListIndex';
                                break;
                            case 'info.columnFenceMgr':
                                // 栏目管理
                                item.url = '/dist/#!/channelManage';
                                break;
                            case 'info.headlineMgr':
                                // 健康头条
                                item.url = '/dist/#!/headlines';
                                break;
                     
                            case 'info.tagMgr':
                                // 标签管理
                                item.url = '/dist/#!/labelManage';
                                break;
							 case 'info.quickProductMgr':
                                // 商品管理
                                item.url = '/dist/#!/productManage';
                                break;
                            default:
                                break;
                        }
                        if (location.href.indexOf(item.url) > -1) {
                            item.active = litem.active = true;
                            this.isIndexPage = false;
                        } else {
                            item.active = false;
                        }
                        if(item.state.selected){
                            litem.selected = true;
                        }
                        item.children.forEach(sitem=>{
                            resource[sitem.code] = sitem.state.selected;
                        })
                        
                    })
                })
                localStorage.setItem('limitResource', JSON.stringify(resource));
                this.navList = list;
            }
        }, response => {
        })
        if(this.$route.path=='/'){
            this.isIndexPage = true;
            this.navList.forEach(litem => {
                litem.active = false;
                litem.children.forEach(item => {
                    item.active = litem.active = false;
                })
            })
        }
    },
    methods: {
        changeUrl(subitem) {

            if (subitem.url != null && !/dist/.test(subitem.url)) {
                location.href = '/#/' + subitem.url.replace(/\./g, '/');
            } else if (subitem.url != null && /dist/.test(subitem.url)) {
                location.href = subitem.url;
            } else {
                location.href = '#';
            }
            this.navList.forEach(litem => {
                litem.active = false;
                litem.children.forEach(item => {
                    if (item.url == subitem.url) {
                        console.log(item.url, subitem.url)
                        litem.active = item.active = true;
                    } else {
                        item.active = false;
                    }
                })
            })
        }
    },
    watch: {
        '$route.path'() {
            if(this.$route.path=='/'){
                this.isIndexPage = true;
                this.navList.forEach(litem => {
                    litem.active = false;
                    litem.children.forEach(item => {
                        item.active = litem.active = false;
                    })
                })
            }else{
                this.isIndexPage = false;
            }
        }
    }
};
</script>
<style lang="less" scope>

</style>
