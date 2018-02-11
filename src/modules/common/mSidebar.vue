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
             <li class="nav-item" v-for="item in catList" v-show="item.text!=''&&item.selected" :class="{active:item.active}">
                <a class="nav-link nav-toggle">
                    <i :class="!item.icon?'icon-wrench':item.icon"></i>
                    <span class="title"> {{item.text}} </span>
                    <span class="arrow" :class="{open:item.active}"></span>
                    <span class="selected" v-if="item.active"></span>
                </a>
                <ul class="sub-menu " v-if="item.children.length!=0">
                    <li v-for="subItem in item.children"  :class="{active:subItem.active}" class="nav-item start"><!-- v-show="subItem.state.selected" -->
                       <a class="nav-link nav-toggle"  v-if="subItem.children.length!=0">
                        <i :class="!subItem.icon?'icon-wrench':subItem.icon"></i>
                        <span class="title"> {{subItem.text}} </span>
                        <span class="arrow" :class="{open:subItem.active}"></span>
                        <span class="selected" v-if="subItem.active"></span>
                    </a>
                        <ul class="sub-menu" v-if="subItem.children.length!=0">
                            <li v-for="san in subItem.children"  :class="{active:san.active}" @click="changeUrl(san)" > <!-- v-show="san.state.selected" -->
                                <a>
                                    <i class="icon-puzzle"></i> {{san.text}} <!-- </span> -->
                                </a>
                            </li>
                        </ul>
                        <a v-else @click="changeUrl(subItem)">
                            <i class="icon-puzzle"></i> {{subItem.text}} <!-- </span> -->
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
      default: "index"
    }
  },
  data() {
    return {
      navList: [],
      isIndexPage: false,
      catList: [
        {
          text: "商品",
          active: false,
          selected: true,
          children: [
            /*{"text":"商品管理","selected":true,"active":false,"children":[
                        {"text":"商品列表","url":"/dist/#!/productManage","active":false,"selected":true},
                    ]},
                    {"text":"商品配置","selected":true,"active":false,"children":[
                        {"text":"通用属性列表","url":"/dist/#!/productCategoryAtrr","active":false,"selected":true},
                        {"text":"销售属性列表","url":"/dist/#!/productCategoryAtrrOption","active":false,"selected":true},
                        {"text":"商品品牌管理","url":"/dist/#!/productBrand","active":false,"selected":true},
                    ]},*/
          ]
        },
        {
          text: "订单",
          active: false,
          selected: true,
          children: [
            /* {"text":"订单管理","selected":true,"active":false,"children":[
                        {"text":"订单列表","url":"/dist/#!/order","active":false,"selected":true},
                    ]},
                    {"text":"订单设置","selected":true,"active":false,"children":[
                        {"text":"运费模板","url":"/dist/#!/ProductCarriageTemp","active":false,"selected":true},
                    ]},*/
          ]
        },
        {
          text: "营销",
          active: false,
          selected: true,
          children: [
            /*{"text":"营销活动","selected":true,"active":false,"children":[
                        {"text":"优惠券列表","url":"/dist/#!/couponManage","active":false,"selected":true},
                        {"text":"限时折扣列表","url":"/dist/#!/discountManage","selected":true,"active":false},
                    ]},*/
          ]
        }
      ]
    };
  },
  created() {
    client.postData(SYSTEM_USER_RESOURCE + "?systemId=2", {}).then(
      response => {
        if (response.code == 200) {
          let list = response.data.root.children;
          let resource = {};
          list.forEach(litem => {
            litem.active = false;
            if (litem.code && litem.code.replace(/\s/g, "") != "") {
              resource[litem.code] = litem.state.selected;
            }
            litem.children.forEach(item => {
              switch (item.url) {
                case "info.brandMgr":
                  // 商品品牌列表
                  item.url = "/dist/#!/productBrand";
                  break;
                case "info.productMgr":
                  // 商品列表
                  item.url = "/dist/#!/productManage";
                  break;
                case "info.productCategoryAtrrMgr":
                  // 通用属性列表
                  item.url = "/dist/#!/productCategoryAtrr";
                  break;
                case "info.productCategoryAtrrOptionMgr":
                  // 销售属性列表
                  item.url = "/dist/#!/productCategoryAtrrOption";
                  break;
                case "info.orderMgr":
                  // 订单列表
                  item.url = "/dist/#!/order";
                  break;
                case "info.ProductCarriageMgr":
                  // 运费模板列表
                  item.url = "/dist/#!/ProductCarriageTemp";
                  break;
                case "info.couponMgr":
                  // 优惠券列表
                  item.url = "/dist/#!/couponManage";
                  break;
                case "info.discountMgr":
                  // 限时折扣列表
                  item.url = "/dist/#!/discountManage";
                  break;
                case "info.productCommentMgr":
                  // 商品评论列表
                  item.url = "/dist/#!/productComment";
                  break;
                case "info.refundMgr":
                  // 售后订单
                  item.url = "/dist/#!/serviceList";
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
              if (item.state.selected) {
                litem.selected = true;
              }
              item.children.forEach(sitem => {
                resource[sitem.code] = sitem.state.selected;
              });
            });
          });
          localStorage.setItem("limitResource", JSON.stringify(resource));
          this.navList = list;
          this.catList.forEach(cat => {
            this.navList.forEach(nav => {
              // 根据前两个字判断属于哪个菜单
              if (nav.text.indexOf(cat.text) > -1) {
                cat.children.push(nav);
              }
            });
          });
        }
      },
      response => {}
    );
    if (this.$route.path == "/") {
      this.isIndexPage = true;
      this.navList.forEach(litem => {
        litem.active = false;
        litem.children.forEach(item => {
          item.active = litem.active = false;
        });
      });
    }
  },
  methods: {
    changeUrl(subitem) {
      if (subitem.url != null && !/dist/.test(subitem.url)) {
        location.href = "/#/" + subitem.url.replace(/\./g, "/");
      } else if (subitem.url != null && /dist/.test(subitem.url)) {
        location.href = subitem.url;
      } else {
        location.href = "#";
      }
      this.catList.forEach(litem => {
        litem.active = false;
        litem.children.forEach(item => {
          if (item.url == subitem.url) {
            //console.log(item.url, subitem.url)
            litem.active = item.active = true;
          } else {
            item.active = false;
          }
          item.children.forEach(san => {
            if (san.url == subitem.url) {
              console.log(san.url, subitem.url);
              litem.active = san.active = true;
            } else {
              san.active = false;
            }
          });
        });
      });
    }
  },
  watch: {
    "$route.path"() {
      if (this.$route.path == "/") {
        this.isIndexPage = true;
        this.navList.forEach(litem => {
          litem.active = false;
          litem.children.forEach(item => {
            item.active = litem.active = false;
          });
        });
        this.catList.forEach(litem => {
          litem.active = false;
          litem.children.forEach(item => {
            item.active = litem.active = false;
          });
        });
      } else {
        this.isIndexPage = false;
      }
    }
  }
};
</script>
<style lang="less" scope>

</style>
