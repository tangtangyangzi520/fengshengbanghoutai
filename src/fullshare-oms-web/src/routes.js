//销售属性管理
import productCategoryAtrrOption from './modules/productCategoryAtrrOption/list.vue';
//通用属性管理
import productCategoryAtrr from './modules/productCategoryAtrr/list.vue';
//订单管理
import order from './modules/order/list.vue';
//商品管理
import productManage from './modules/productManage/list.vue';
//品牌管理
import productBrand from './modules/productBrand/list.vue';
import index from './modules/index.vue';
// 系统通用管理
import LabelManage from './modules/system/labelManage/list.vue';
//省市区三级联动
import area from  './modules/area/selectArea.vue';

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
        '/area': {
            name: 'area',
            component: area
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