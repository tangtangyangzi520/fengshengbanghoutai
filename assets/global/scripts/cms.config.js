/**
 * Created by liangjiahao on 2016.04.14.
 */

var SYSTEM_USER_LOGIN = CMS_API_BASE + "/system/login";
var SYSTEM_ROLE_LIST = CMS_API_BASE + "/system/listSystemRole";
var SYSTEM_ROLE_ADD = CMS_API_BASE + "/system/createSystemRole";
var SYSTEM_ROLE_GET = CMS_API_BASE + "/system/getSystemRole";
var SYSTEM_ROLE_EDIT = CMS_API_BASE + "/system/editSystemRole";
var SYSTEM_ROLE_DELETE = CMS_API_BASE + "/system/deleteSystemRole";
var SYSTEM_ROLE_RESOUCE_SAVE = CMS_API_BASE + "/system/saveRoleResource";
var SYSTEM_USER_LIST = CMS_API_BASE + "/system/listSystemUser";
var SYSTEM_USER_ADD = CMS_API_BASE + "/system/createSystemUser";
var SYSTEM_USER_GET = CMS_API_BASE + "/system/getSystemUser";
var SYSTEM_USER_EDIT = CMS_API_BASE + "/system/editSystemUser";
var SYSTEM_USER_ROLE_GET = CMS_API_BASE + "/system/getUserRole";
var SYSTEM_USER_ROLE_SAVE = CMS_API_BASE + "/system/saveUserRole";
var SYSTEM_RESOURCE_TREE = CMS_API_BASE + "/system/getResourceTreeByRole";
var SYSTEM_CHANNEL_LIST = CMS_API_BASE + "/system/listSkuChannel";
var SYSTEM_USER_PASSWORD = CMS_API_BASE + "/system/modifyPassword";
var SYSTEM_USER_RESOURCE = CMS_API_BASE + "/system/getResourceByUser";
var SYSTEM_LOG_LIST = CMS_API_BASE + "/log/list";
var SYSTEM_LOG_MODULE = CMS_API_BASE + "/log/getModules";
var SYSTEM_LOG_OPERATION = CMS_API_BASE + "/log/getOperations";

var SYSTEM_ORG_LIST = CMS_API_BASE + "/system/listSystemOrg";
var SYSTEM_ORG_TREE = CMS_API_BASE + "/system/getOrgTree";
var SYSTEM_ORG_ADD = CMS_API_BASE + "/system/createSystemOrg";
var SYSTEM_ORG_EDIT = CMS_API_BASE + "/system/editSystemOrg";
var SYSTEM_ORG_DELETE = CMS_API_BASE + "/system/deleteSystemOrg";
var SYSTEM_ORG_GET = CMS_API_BASE + "/system/getSystemOrgById";
var SYSTEM_APP_STORE_GET = CMS_API_BASE + "/system/listAppStore";

var INFOR_SKU_LIST = CMS_API_BASE + "/sku/list";
var INFOR_SKU_ADD = CMS_API_BASE + "/sku/add";
var INFOR_SKU_DELETE = CMS_API_BASE + "/sku/delete";
var INFOR_SKU_EDIT = CMS_API_BASE + "/sku/edit";
var INFOR_SKU_DEPLOY = CMS_API_BASE + "/sku/publish";
var INFOR_SKU_GET = CMS_API_BASE + "/sku/getSkuById";
var INFOR_SKU_PAIN_GET = CMS_API_BASE + "/sku/getSkuPainById";


var INFOR_MATERIAL_GET = STORE_API_BASE + "/common/1.0.0/get/files";
var INFOR_MATERIAL_SKU_UPLOAD = STORE_API_BASE + "/common/1.0.0/upload/file";

var PAIN_LIST = CMS_API_BASE + "/pain/list";
var PAIN_ADD = CMS_API_BASE + "/pain/create";
var PAIN_GET = CMS_API_BASE + "/pain/getById";
var PAIN_EDIT = CMS_API_BASE + "/pain/edit";
var PAIN_DELETE = CMS_API_BASE + "/pain/delete";
var PAIN_PUBLISH = CMS_API_BASE + "/pain/deploy";
var PAIN_CANCEL_PUBLISH = CMS_API_BASE + "/pain/withdraw";
//var PAIN_COMPONENT=CMS_API_BASE+"/cmspain/component";
var PAIN_TREE = CMS_API_BASE + "/pain/getPainTree";
var PAIN_GET_FENCE = CMS_API_BASE + "/pain/getFence";

var PAIN_VIDEO_LIST = CMS_API_BASE + "/cmspainvideo/list";
var PAIN_VIDEO_ADD = CMS_API_BASE + "/cmspainvideo/add";
var PAIN_VIDEO_DELTELE = CMS_API_BASE + "/cmspainvideo/delete";
var PAIN_VIDEO_GET = CMS_API_BASE + "/cmspainvideo/get";
var PAIN_VIDEO_UPDATE = CMS_API_BASE + "/cmspainvideo/update";
var PAIN_VIDEO_SUBMIT = CMS_API_BASE + "/cmspainvideo/submmit";
var PAIN_VIDEO_PUBLISH = CMS_API_BASE + "/cmspainvideo/publish";
var PAIN_VIDEO_WITHDRAW = CMS_API_BASE + "/cmspainvideo/withdraw";

var AUTHOR_LIST = CMS_API_BASE + "/author/listAuthor";
var AUTHOR_ADD = CMS_API_BASE + "/author/createAuthor";
var AUTHOR_EDIT = CMS_API_BASE + "/author/editAuthor";
var AUTHOR_GET = CMS_API_BASE + "/author/getAuthorById";
var AUTHOR_DELETE = CMS_API_BASE + "/author/deleteAuthor";
var AUTHOR_PUBLISH = CMS_API_BASE + "/author/publishAuthor";
var AUTHOR_CANCELPUBLISH = CMS_API_BASE + "/author/cancelPublishAuthor";
var AUTHOR_PAIN = CMS_API_BASE + "/cmspain/listPainForAuthor";
var AUTHOR_PAIN_ADD = CMS_API_BASE + "/author/addAuthorPain";
var AUTHOR_PAIN_TREE = CMS_API_BASE + "/author/getPainTree";
var AUTHOR_PAIN_INFO = CMS_API_BASE + "/author/getPainByAuthor";
var AUTHOR_GET_ARTICLENUM = CMS_API_BASE + "/author/getArticleNum";
var AUTHOR_GET_DEPLOIY = CMS_API_BASE + "/author/getAuthors";

var VERSION_LIST = CMS_API_BASE + "/app/version/list";
var VERSION_ADD = CMS_API_BASE + "/app/version/create";
var VERSION_EDIT = CMS_API_BASE + "/app/version/edit";
var VERSION_GET = CMS_API_BASE + "/app/version/get";
var VERSION_PUBLISH = CMS_API_BASE + "/app/version/publish";
var VERSION_DELETE = CMS_API_BASE + "/app/version/delete";

//视频列表管理
var VIDEO_LIST = CMS_API_BASE + "/video/list";


var WELCOME_LIST = CMS_API_BASE + "/app/welcome/list";
var WELCOME_ADD = CMS_API_BASE + "/app/welcome/create";
var WELCOME_EDIT = CMS_API_BASE + "/app/welcome/edit";
var WELCOME_GET = CMS_API_BASE + "/app/welcome/get";
var WELCOME_PUBLISH = CMS_API_BASE + "/app/welcome/publish";

var BANNER_LIST = CMS_API_BASE + "/banner/list";
var BANNER_CREATE = CMS_API_BASE + "/banner/create";
var BANNER_EDIT = CMS_API_BASE + "/banner/edit";
var BANNER_GET = CMS_API_BASE + "/banner/get";
var BANNER_SORT = CMS_API_BASE + "/banner/sort";
var BANNER_COUNT = CMS_API_BASE + "/banner/count";
var INFOR_BANNER_ADD = CMS_API_BASE + "/banner/add";
var INFOR_BANNER_DALETE = CMS_API_BASE + "/banner/delete";
var INFOR_BANNER_GET_BYID = CMS_API_BASE + "/banner/getBannerById";
var INFOR_BANNER_UPDATE = CMS_API_BASE + "/banner/update";

var SOLUTION_LIST = CMS_API_BASE + "/solution/listSolution";
var SOLUTION_ADD = CMS_API_BASE + "/solution/createSolution";
var SOLUTION_EDIT = CMS_API_BASE + "/solution/editSolution";
var SOLUTION_GET = CMS_API_BASE + "/solution/getSolution";
var SOLUTION_PUBLISH = CMS_API_BASE + "/solution/publishSolution";
var SOLUTION_CANCELPUBLISH = CMS_API_BASE + "/solution/cancelpublishSolution";
var SOLUTION_DELETE = CMS_API_BASE + "/solution/deleteSolution";
var SOLUTION_PAIN_TREE = CMS_API_BASE + "/solution/getPainTree";
var SOLUTION_PAIN_INFO = CMS_API_BASE + "/solution/getPainBySolution";

var SHARETEMPLATE_LIST = CMS_API_BASE + "/sharetemplate/list";
var SHARETEMPLATE_ADD = CMS_API_BASE + "/sharetemplate/create";
var SHARETEMPLATE_EDIT = CMS_API_BASE + "/sharetemplate/edit";
var SHARETEMPLATE_GET = CMS_API_BASE + "/sharetemplate/get";
var SHARETEMPLATE_PUBLISH = CMS_API_BASE + "/sharetemplate/publish";
var SHARETEMPLATE_CANCELPUBLISH = CMS_API_BASE + "/sharetemplate/cancelPublish";
var SHARETEMPLATE_DELETE = CMS_API_BASE + "/sharetemplate/delete";

var MEMBER_LIST = MEMBER_API_BASE + "/member/manager/1.0.0/getMemberList";
var MEMBER_ENABLE = MEMBER_API_BASE + "/member/manager/1.0.0/forbidden";
var MEMBERSHARE_LIST = CMS_API_BASE + "/article/getArticleShareByMemberId";

var MEMBERPAIN_LIST = CMS_API_BASE + "/cmspain/listPainsForMember";

var ARTICLE_LIST = CMS_API_BASE + "/article/list";
var ARTICLE_ADD = CMS_API_BASE + "/article/save";
var ARTICLE_EDIT = CMS_API_BASE + "/article/edit";
var ARTICLE_GET = CMS_API_BASE + "/article/get";
var ARTICLE_PUBLISH = CMS_API_BASE + "/article/publish";
var ARTICLE_CANCELPUBLISH = CMS_API_BASE + "/article/cancelPublish";
var ARTICLE_DELETE = CMS_API_BASE + "/article/delete";
var ARTICLE_ACTION_GET = CMS_API_BASE + "/article/getArticleActionCount";
var ARTICLE_ACTION_SET = CMS_API_BASE + "/article/setArticleActionCount";
var ARTICLE_PRIORITY_GET = CMS_API_BASE + "/article/getArticlePriority";
var ARTICLE_PRIORITY_SET = CMS_API_BASE + "/article/setArticlePriority";
var ARTICLE_PULL_THIRD_ARTICLE = CMS_API_BASE + "/article/pullThirdActicle";

var QUESTION_LIST = CMS_API_BASE + "/question/list";
var QUESTION_ADD = CMS_API_BASE + "/question/create";
var QUESTION_GET = CMS_API_BASE + "/question/getById";
var QUESTION_EDIT = CMS_API_BASE + "/question/edit";
var QUESTION_DELETE = CMS_API_BASE + "/question/delete";
var QUESTION_PUBLISH = CMS_API_BASE + "/question/publish";
var QUESTION_CANCEL_PUBLISH = CMS_API_BASE + "/question/cancelPublish";

var MESSAGE_TEMPLATE_LIST = CMS_API_BASE + "/messagetemplate/list";
var MESSAGE_TEMPLATE_ADD = CMS_API_BASE + "/messagetemplate/create";
var MESSAGE_TEMPLATE_GET = CMS_API_BASE + "/messagetemplate/get";
var MESSAGE_TEMPLATE_EDIT = CMS_API_BASE + "/messagetemplate/edit";
var MESSAGE_TEMPLATE_DELETE = CMS_API_BASE + "/messagetemplate/delete";

var MESSAGE_PUSH_LIST = CMS_API_BASE + "/messagepush/listMessagePush";

var WORDS_LIST = CMS_API_BASE + "/word/list";
var WORDS_ADD = CMS_API_BASE + "/word/save";
var WORDS_GET = CMS_API_BASE + "/word/getById";
var WORDS_EDIT = CMS_API_BASE + "/word/save";
var WORDS_DELETE = CMS_API_BASE + "/word/delete";
var WORDS_PUBLISH = CMS_API_BASE + "/word/publish";
var WORDS_CANCEL_PUBLISH = CMS_API_BASE + "/word/cancel";
var WORDS_SUBMIT = CMS_API_BASE + "/word/submit";

var GOOD_PRODUCT_LIST = CMS_API_BASE + "/goodproduct/list";
var GOOD_PRODUCT_GET = CMS_API_BASE + "/goodproduct/get";
var GOOD_PRODUCT_CREATE = CMS_API_BASE + "/goodproduct/create";
var GOOD_PRODUCT_EDIT = CMS_API_BASE + "/goodproduct/edit";
var GOOD_PRODUCT_DELETE = CMS_API_BASE + "/goodproduct/delete";
var GOOD_PRODUCT_DEPLOY = CMS_API_BASE + "/goodproduct/deploy";
var GOOD_PRODUCT_SUBMIT = CMS_API_BASE + "/goodproduct/submit";
var GOOD_PRODUCT_WITHDRAW = CMS_API_BASE + "/goodproduct/withdraw";
var GOOD_PRIORITY_SET = CMS_API_BASE + "/goodproduct/priority";

var COMPONENT_LIST = CMS_API_BASE + "/component/list";
var COMPONENT_GET = CMS_API_BASE + "/component/get";
var COMPONENT_DELETE = CMS_API_BASE + "/component/delete";
var COMPONENT_DEPLOY = CMS_API_BASE + "/component/deploy";
var COMPONENT_SUBMIT = CMS_API_BASE + "/component/submit";
var COMPONENT_WITHDRAW = CMS_API_BASE + "/component/withdraw";
var COMPONENT_REJECT = CMS_API_BASE + "/component/reject";
var COMPONENT_SET = CMS_API_BASE + "/component/priority";
var COMPONENT_PUTAWAY = CMS_API_BASE + "/component/putaway";
var COMPONENT_SOLDOUT = CMS_API_BASE + "/component/soldOut";
var COMPONENT_PAIN_LIST = CMS_API_BASE + "/component/painList";
var COMPONENT_PAIN_BY_COMPONENT_ID = CMS_API_BASE + "/component/getPainByComponentId";
var COMPONENT_ADD = CMS_API_BASE + "/component/create";
var COMPONENT_EDIT = CMS_API_BASE + "/component/edit";
var COMPONENT_GETWITHPAINS = CMS_API_BASE + "/component/getwithPains";
var COMPONENT_ADD_ARTICLE = CMS_API_BASE + "/component/createArticle";
var COMPONENT_EDIT_ARTICLE = CMS_API_BASE + "/component/editArticle";
var COMPONENT_GET_LABEL = CMS_API_BASE + "/component/getLabels";
var COMPONENT_CHECK_PAIN = CMS_API_BASE + "/component/checkPain";
var COMPONENT_GETPAINDATA = CMS_API_BASE + "/component/getPainData";
var COMPONENT_COUNTER = CMS_API_BASE + "/component/getCounterComponentByType";
var COMPONENT_GET_USERS = CMS_API_BASE + "/component/getUserList";
var COMPONENT_GET_AUTHORS = CMS_API_BASE + "/component/getAuthorList";
var COMPONENT_ARTICLE_COUNTER = CMS_API_BASE + "/component/getCountArticleByType";
var COMPONENT_LABELS_BY_PARENT = CMS_API_BASE + "/component/getLabelsByParent";
var COMPONENT_BATCH_DEPLOY = CMS_API_BASE + "/component/getdeploybatch";
var COMPONENT_BATCH_SUBMIT = CMS_API_BASE + "/component/getbatchsubmit";
var COMPONENT_BATCH_WITHDRAW = CMS_API_BASE + "/component/getbatchwithdraw";
var COMPONENT_BATCH_REJECT = CMS_API_BASE + "/component/getbatchreject";
var COMPONENT_THIRD_SOURCE = CMS_API_BASE + "/component/getThirdSource";

var HOME_PAGE_GET_COMPONENT = CMS_API_BASE + "/homePage/getComponents";
var HOME_PAGE_GET_COMPONENT_SORT = CMS_API_BASE + "/homePage/getComponentSort";
var HOME_PAGE_GET_COMPONENT_SORT_BY_PARAM = CMS_API_BASE + "/homePage/getAllComponentSortByParam";
var HOME_PAGE_GET_COMPONENT_SORT_BY_ID = CMS_API_BASE + "/homePage/getComponentSortById";
var HOME_PAGE_GET_FENCES = CMS_API_BASE + "/homePage/getFences";
var HOME_PAGE_UPDATE_SORTS = CMS_API_BASE + "/homePage/updateSorts";
var HOME_PAGE_EDIT_SORT = CMS_API_BASE + "/homePage/editSort";
var HOME_PAGE_DELETE_SORT = CMS_API_BASE + "/homePage/deleteSort";
var HOME_PAGE_GET_COMPONENT_EXPROT = CMS_API_BASE + "/homePage/getComponentsForExport";
var HOME_PAGE_GET_COMPONENT_IMPORT = CMS_API_BASE + "/homePage/getbatchupdateSorts";


var MERCHANDISE_LIST = CMS_API_BASE + "/merchandise/list";
var MERCHANDISE_CREATE = CMS_API_BASE + "/merchandise/create";
var MERCHANDISE_EDIT = CMS_API_BASE + "/merchandise/edit";
var MERCHANDISE_GET = CMS_API_BASE + "/merchandise/get";
var MERCHANDISE_RELATION = CMS_API_BASE + "/merchandise/getMerchandiseArticleRelation";
var MERCHANDISE_GET_STORE_LABELS = CMS_API_BASE + "/merchandise/getStoreLabels";
var MERCHANDISE_UPDATE_YOUZAN_PRODUCT = CMS_API_BASE + "/merchandise/updateYouzanProduct";
var MERCHANDISE_PULL_NEW_PRODUCT = CMS_API_BASE + "/merchandise/pullNewProduct";

var SOLUTION_LIST = CMS_API_BASE + "/solution/list";
var SOLUTION_CREATE = CMS_API_BASE + "/solution/create";
var SOLUTION_EDIT = CMS_API_BASE + "/solution/edit";
var SOLUTION_GET = CMS_API_BASE + "/solution/get";

var CAMPAIGN_LIST = CMS_API_BASE + "/campaign/list"
var CAMPAIGN_CREATE = CMS_API_BASE + "/campaign/create"
var CAMPAIGN_EDIT = CMS_API_BASE + "/campaign/edit"
var CAMPAIGN_GET = CMS_API_BASE + "/campaign/get"
var CAMPAIGN_ALL_LIST = CMS_API_BASE + "/campaign/listAll"
var CAMPAIGN_FENCES_GET = CMS_API_BASE + "/campaign/getFences"
var CAMPAIGN_SUB_COMPONENT_LIST = CMS_API_BASE + "/campaign/listPainComponent"
var CAMPAIGN_FATHER_ADD = CMS_API_BASE + "/campaign/createForActivity"
var CAMPAIGN_FATHER_DELETE = CMS_API_BASE + "/campaign/deleteForActivity"


var CAMPAIGN_COMPONENT_LIST = CMS_API_BASE + "/campaign/listSub"
var CAMPAIGN_COMPONENT_CREATE = CMS_API_BASE + "/campaign/createSub"
var CAMPAIGN_COMPONENT_DELETE = CMS_API_BASE + "/campaign/deleteSub"
var CAMPAIGN_COMPONENT_COUNTER = CMS_API_BASE + "/campaign/getPainComponentCounter"


var LINK_FEEDBACKK_LIST = CMS_API_BASE + "/linkFeedback/list";

var FENCE_TREE = CMS_API_BASE + "/fence/getFenceTree";
var FENCE_CREATE = CMS_API_BASE + "/fence/create";
var FENCE_EDIT = CMS_API_BASE + "/fence/edit";
var FENCE_DELETE = CMS_API_BASE + "/fence/delete";
var FENCE_GET = CMS_API_BASE + "/fence/getFenceById";

//var TAG_LIST_GET = CMS_API_BASE + "/tag/getTagTree";  /////////根据typeId 获取类目列表
var TAG_TYPE_GET = CMS_API_BASE + "/tag/getTagType";
var TAG_EDIT = CMS_API_BASE + "/tag/editTag";
var TAG_DELETE = CMS_API_BASE + "/tag/deleteTag";
var TAG_CREATE = CMS_API_BASE + "/tag/createTag";

var FENCE_STANDARD_CREATE = CMS_API_BASE + "/positioning/fence/createStandardFence";
var FENCE_STANDARD_DELETE = CMS_API_BASE + "/positioning/fence/deleteStandardFence";
var FENCE_STANDARD_EDIT = CMS_API_BASE + "/positioning/fence/editStandardFence";
var FENCE_GET_BY_COLUM_ID = CMS_API_BASE + "/positioning/fence/getByColumnId";
var FENCE_GET_DETAIL = CMS_API_BASE + "/positioning/fence/getDetailByFenceId";
var FENCE_SAVE_SORT = CMS_API_BASE + "/positioning/fence/saveFenceSort";
var COLUMN_SORT = CMS_API_BASE + "/positioning/column/saveColumnSort";

var HEADLINE_CREATE = CMS_API_BASE + "/headline/create";
var HEADLINE_EDIT = CMS_API_BASE + "/headline/edit";
var HEADLINE_GET = CMS_API_BASE + "/headline/getById";
var HEADLINE_LIST = CMS_API_BASE + "/headline/getList";

//商品模块url
//sku
var  SKU_EDIT_LIST      =  OMS_TEST + "/sku/editProductSku";         //编辑sku列表
var  SKU_GET_BY_ID      =  OMS_TEST + "/sku/getProductSkuBySpuId";   //根据spuID获取sku列表

//评论管理
var  OIC_GET_LIST       =  OMS_TEST + "/oic/listOic";                //获取评论列表
var  OIC_IMPORT_LIST    =  OMS_TEST + "/oic/exportOics";             //导入评论
var  OIC_DELETE         =  OMS_TEST + "/oic/deleteOic";              //删除评论
var  OIC_EDIT           =  OMS_TEST + "/oic/editOrderItemComment";   //编辑评论
var  OIC_EXPORT_TEMPLATE=  OMS_TEST + "/oic/exportOicTemplate";      //导出评论模板

//spu,图片资源
var  SPU_EXPORT         =  OMS_TEST + "/spu/exportSpu";              //根据spuid导出sku列表
var  SPU_CREATE         =  OMS_TEST + "/spu/createProductSpu";       //新增spu
var  SPU_GET_LIST       =  OMS_TEST + "/spu/listSpu";                //获取spu列表
var  SPU_GET_LIST_SKU   =  OMS_TEST + "/spu/listSpuAndSku";          //获取spu列表(包含sku列表)
var  SPU_EDIT           =  OMS_TEST + "/spu/editProductSpu";         //编辑spu
var  SPU_GET_BY_ID      =  OMS_TEST + "/spu/getProductSpuById";      //根据ID获取单个spu
var  PSR_CREATE         =  OMS_TEST + "/psr/createPsr";              //新增详情页
var  PSR_GETBANNER_BY_ID    =  OMS_TEST + "/psr/getPsrBannerById";   //banner图片资源
var  PSR_GETDETAILS_BY_ID   =  OMS_TEST + "/psr/getPsrDetailsById";  //详情图片资源
var  SPU_EDIT_UP_DOWN   =  OMS_TEST + "/spu/shelvesSpu";             //sku上架或下架
var  SPU_DELETE  =  OMS_TEST + "/spu/deleteSpus";                    //sku上架或下架

//品牌
var  PBD_GET_LIST   =  OMS_TEST + "/pbd/list";                       //获取品牌列表
var  PBD_GET_LISTUSED   =  OMS_TEST + "/pbd/listUsed";               //获取正在使用的品牌列表
var  PBD_CREATE     =  OMS_TEST + "/pbd/createProductBrand";         //新增品牌
var  PBD_EDIT       =  OMS_TEST + "/pbd/editProductBrand";           //编辑品牌
var  PBD_DISPLAY    =  OMS_TEST + "/pbd/displayProductBrand";        //启用停用品牌
var  PBD_GET_ONE    =  OMS_TEST + "/pbd/getProductBrandById";        //根据品牌ID获取品牌
var  PBD_GET_MAXSORT    =  OMS_TEST + "/pbd/getMaxPbdSort";          //获取最大排序

//数据字典
var  SYSTEM_REASON       =  OMS_TEST + "/reason/getProductChartReasons";  //获取上榜理由
var  TAG_LIST_GET        =  CMS_API_BASE + "/tag/getTagTree";             //根据typeId 获取类目列表
var  SYSTEM_DICTIONARY   =  OMS_TEST + "/system/listDictionary";          //根据"parentCode"获取数据字典
var  PCA_GET_BY_CATID    =  OMS_TEST + "/pca/getProductCategoryAtrrPcraCatIds"; //根据类目ID获取属性值

//订单模块url
var ORDER_GET_LIST     =    OMS_TEST + "/order/list";                    //订单条件查询列表
var ORDER_GET_LIST     =  OMS_TEST + "/order/list";                      //订单条件查询列表
var ORDER_EDIT_DEMO    =  OMS_TEST + "/order/editOrderSetDemo";          //编辑商家备注
var ORDER_EDIT_STATUS  =  OMS_TEST + "/order/changeOrdStatus";           //修改订单状态
var ORDER_CANCEL_REASON   =  OMS_TEST + "/order/getOrderCancelReasons";  //获取订单取消原因
var ORDER_EDIT_REASON  =  OMS_TEST + "/order/cancelOrderSub";            //取消订单
var ORDER_EDIT_ACT_AMOUNT =  OMS_TEST + "/order/editActAmount";          //修改订单价格
var ORDER_EXPORT       =  OMS_TEST + "/order/exportOrder";               //订单导出
var ORDER_ADD_STAR     =  OMS_TEST + "/order/addStar";                   //订单加星提交
var ORDER_DELIVER      =  OMS_TEST + "/order/deliverOrderSub";           //订单手动发货
var ORDER_GET_LOGI_COMPANY =  OMS_TEST + "/order/getLogiCompanyList";    //获取物流公司列表

//物流模块
var ODD_GET_ORDERSUBID       =  OMS_TEST + "/odd/getByOrderSubId";       //根据子单获取物流信息?ordOrderId=1

//app商品测试
var APP_SPU_GET_ONE =  APP_TEST + "/spu/getAppProductSpuById";           //根据spuID获取信息

//类目属性模块
//=========================================新增加(chensenrong)====================================================//
var PCA_INSERT      = OMS_TEST + "/pca/insertProductCategoryAtrr";         //添加通用属性及属性选项
var PCA_QUERY_BYID  = OMS_TEST + "/pca/queryProductCategoryAtrrByPcaId";   //根据属性ID获取分类属性及属性选项
var PCA_UPDATE      = OMS_TEST + "/pca/updateProductCategoryAtrr";         //修改通用属性及属性选项
var PCA_REMOVE      = OMS_TEST + "/pca/removeProductCategoryAtrr";         //删除通用属性及属性选项
var SALE_CREATE     = OMS_TEST + "/pca/createSaleSpuCategoryAtrr";         //添加销售属性及属性选项
var SALE_UPDATE     = OMS_TEST + "/pca/editSaleSpuCategoryAtrr";           //修改销售属性及属性选项
var SALE_DELETE     = OMS_TEST + "/pca/removeSaleSpuCategoryAtrr";         //删除销售属性及属性选项
var GET_ATRR_LIST   = OMS_TEST + "/pca/getAtrrListByPcraCatId";            //根据分类ID获取属性数据(无分页)
//===============================================================================================================//
var PCA_CREATE      = OMS_TEST +"/pca/createProductCategoryAtrr";          //分类属性添加
var PCA_GET_ID      = OMS_TEST +"/pca/getProductCategoryAtrrByPcaId";      //根据属性ID获取分类属性
var PCA_EDIT        = OMS_TEST +"/pca/editProductCategoryAtrr";            //分类属性修改
var PCA_GET_PCRACATIDS      = OMS_TEST +"/pca/getPcraCatIds";              //根据分类ID获取SPU分类属性
var PCA_GET_BY_PCRACATIDS   = OMS_TEST + "/pca/getProductCategoryAtrrPcraCatIds"; //根据分类ID获取SPU分类属性分页查询
var PCA_DELETE      = OMS_TEST + "/pca/deleteProductCategoryAtrr";         //删除SPU分类属性
var PCA_INPUTTYPES  = OMS_TEST +"/pca/getpcaInputTypes";                   //根据"parentCode"获取数据字典
var SALEPCA_CREATE  =  OMS_TEST +"/pca/createSaleProductCategoryAtrr";     //销售属性添加

var PCAO_DELETE     = OMS_TEST +  "/pcao/deleteProductCategoryAtrrOption"; //删除属性选项
var PCAO_CREATE     = OMS_TEST +  "/pcao/createPacoandpcaoName";           //添加属性选项
var PCAO_GET_ID     = OMS_TEST +   "/pcao/getProductCategoryAtrrOptionAtrrByPcaoAtrrId"; //根据分类属性ID获取属性选项值

//营销模块
var MKT_LIST   =  OMS_TEST+ "/mkt/list";                              //优惠券/活动条件查询
var MKT_CREATE =  OMS_TEST+ "/mkt/createMktCampaign";                 //新建优惠券/活动
var MKT_EDIT   =  OMS_TEST+ "/mkt/editMktCampaign";                   //编辑优惠券/活动
var MKT_GET_ID   =  OMS_TEST+ "/mkt/getMktCampaignRespById";          //根据id获取优惠券/活动
var MKT_INVALIDATE   =  OMS_TEST+ "/mkt/invalidateMktCampaign";       //优惠券/活动失效
var MKT_DELETE  =  OMS_TEST+ "/mkt/deleteMktCampaign";                //优惠券/活动删除
var MKT_EXPORT_LIST  =  OMS_TEST+ "/mkt/exportCoupon";                //优惠券列表导出
var MKT_EXPORT_DETAIL  =  OMS_TEST+ "/order/exportByCampaignIds";     //优惠券明细导出

//运费模板模块  
var PCT_EDIT   =  OMS_TEST+ "/pc/editProductCarriage";                //新增运费模板
var PCT_CREATE =  OMS_TEST+ "/pc/createProductCarriage";              //新增运费模板
var PCT_LIST   =  OMS_TEST+ "/pc/list";                               //运费模板列表(包含pct)
var PCT_PCLIST =  OMS_TEST+ "/pc/pcList";                             //运费模板列表(只有pc)

//地区模块
var AREA_GET_LIST = OMS_TEST + "/area/list";                          //获取所有的省份

//系统配置管理
var SYSTEM_SETTING_LIST = OMS_TEST + "/systemSetting/list";           //获取所有系统配置参数
var SYSTEM_SETTING_EDIT = OMS_TEST + "/systemSetting/edit";           //编辑所有系统配置参数

//CMS系统
var CMS_SERVER = "http://cms.fshtop.com/index.html";                  //CMS系统首页