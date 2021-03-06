// 系统通用管理
import LabelManage from './modules/system/labelManage/list.vue';
//首页
import index from './modules/index.vue';
//商品管理
import productManage from './modules/productManage/list.vue';
//类目通用属性设置
import productCategoryAtrr from './modules/productCategoryAtrr/list.vue';
//类目销售属性设置
import productCategoryAtrrOption from './modules/productCategoryAtrrOption/list.vue';
//商品品牌管理
import productBrand from './modules/productBrand/list.vue';
//订单管理
import order from './modules/order/list.vue';
//优惠券管理
import couponManage from './modules/couponManage/list.vue';
//限时折扣管理
import discountManage from './modules/discountManage/list.vue';
//运费模板
import ProductCarriageTemp from './modules/ProductCarriageTemp/list.vue';
//省市区三级联动
import area from './modules/area/selectArea.vue';
//评论
import productComment from './modules/productComment/list.vue';
//礼品卡
import card from './modules/card/list.vue';
//售后
import serviceList from './modules/service/list.vue';
export default function(router) {
    router.map({
        '/': {
            name: 'index',
            component: index
        },
        '/productManage': {
            name: 'productManage',
            component: productManage
        },
        '/productBrand': {
            name: 'productBrand',
            component: productBrand
        },
        '/labelManage': {
            name: 'labelManage',
            component: LabelManage
        },
        '/order': {
            name: 'order',
            component: order
        },
        '/productCategoryAtrr': {
            name: 'productCategoryAtrr',
            component: productCategoryAtrr
        },
        '/productCategoryAtrrOption': {
            name: 'productCategoryAtrrOption',
            component: productCategoryAtrrOption
        },
        '/discountManage': {
            name: 'discountManage',
            component: discountManage
        },
        '/couponManage': {
            name: 'couponManage',
            component: couponManage
        },
        '/ProductCarriageTemp': {
            name: 'ProductCarriageTemp',
            component: ProductCarriageTemp
        },
        '/area': {
            name: 'area',
            component: area
        },
        '/productComment': {
            name: 'productComment',
            component: productComment
        },
        '/card': {
            name: 'card',
            component: card
        },
        '/serviceList': {
            name: 'serviceList',
            component: serviceList
        },

        // '/channelLayout/:parentId': {
        //     name: 'channelLayout',
        //     component: channelLayout,
        //     subRoutes: {
        //         '/': { name: 'mallBanner', component: channelEmpty },
        //         '/component/:type/:id/:parentFenceId': { name: 'component', component: channelComponent },
        //     }
        // },
    })
}