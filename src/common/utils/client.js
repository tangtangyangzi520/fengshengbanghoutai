import global from './global';

function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2];
    return null;
}
const dev = false;
let cmsHearders = {};
const APIURL = CMS_API_BASE + '/';
let cookieUser = decodeURIComponent(getCookie('user'));
document.cookie = '';
if (cookieUser == '' || cookieUser == 'null') {
    location.href = '/login.html';
} else {
    cmsHearders = {
        'Content-Type': 'application/json;',
        'Authorization': JSON.parse(decodeURIComponent(getCookie('user'))).accessToken
    };
}

const postData = function(url, options) {
    let promise = new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            data: JSON.stringify(options),
            headers: cmsHearders,
            type: 'post',
            cache: false,
            success: function(data) {
                data = typeof data == 'object' ? data : JSON.parse(data);
                if (data.code == '9521' || data.code == '9522' || data.code == '9523' || data.status == '400') {
                    location.href = '/login.html';
                }
                resolve(data);
            },
            error: function(data) {
                reject(data.responseJSON);
            }
        })
    })
    return promise

}

const getData = function(url, options = {}, isString = false) {
    let openId = localStorage.getItem('openId')
    let promise = new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            data: options,
            type: 'get',
            headers: cmsHearders,
            cache: false,
            success: function(data) {
                if (isString) {
                    resolve(data);
                    return
                }
                data = typeof data == 'object' ? data : JSON.parse(data)
                resolve(data);
            },
            error: function() {
                reject('网络连接错误')
            }
        })
    })

    return promise
}

function getCookie(name) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (arr[0] == name) return arr[1];
    }
    return "";
}

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

function formateTime(time) {
    let dt = new Date(time);
    return dt.getFullYear() + '-' + intNum(dt.getMonth() + 1) + '-' + intNum(dt.getDate()) + ' ' + intNum(dt.getHours()) + ':' +
        intNum(dt.getMinutes()) + ':' + intNum(dt.getSeconds());
}

function intNum(num) {
    return num > 9 ? num : '0' + num;
}
// 常用列表设置自动高度
function resetListHeight() {
    const windowHeight = $(window).height();
    $('#contentList').height(windowHeight - $('.page-bar').height() - 120 - $('.pagination').height());
    $(window).on('resize', function() {
        const windowHeight = $(window).height();
        $('#contentList').height(windowHeight - $('.page-bar').height() - 120 - $('.pagination').height());
    })
}

// 根据子节点查找父节点所有子节点
function findParentList(list, itemIn) {
    let parentList = [];
    if (list.length != 0) {
        deepLoop(list, itemIn);
    }

    function deepLoop(list, itemIn) {
        list.forEach(item => {
            if (item.id == itemIn.id) {
                parentList = list;
            }
            if (item.children.length != 0) {
                deepLoop(item.children, itemIn);
            }
        })
    }
    return parentList;
}
// 根据子节点查找父节点
function findParentItem(parentItem, itemIn) {
    let list = parentItem.children,
        targetParentItem;
    if (list.length != 0) {
        deepLoop(parentItem, itemIn);
    }

    function deepLoop(parentItem, itemIn) {
        let list = parentItem.children;
        list.forEach(item => {
            if (item.id == itemIn.id) {
                targetParentItem = parentItem;
            } else {
                if (item.children.length != 0) {
                    deepLoop(item, itemIn);
                }
            }
        })
    }
    return targetParentItem;
}
// 从树中查找某个id的项目
function findTreeItem(list, id) {
    let targetItem = null;
    if (list.length != 0) {
        deepLoop(list, id);
    }

    function deepLoop(list, id) {
        list.forEach(item => {
            if (item.id == id) {
                targetItem = item;
            } else {
                if (item.children.length != 0) {
                    deepLoop(item.children, id);
                }
            }
        })
    }
    return targetItem;
}
//获取父ID
function getParentIdList(treeList, item){
    let parentItem,parentIds=new Array();
    
    console.log(treeList);
    console.log(parentIds);
    parentIds.push(item.id);
    if(item.parentId!=null){
        deepLoop(item);
    }
    return parentIds;
    function deepLoop(item){
    parentItem=findParentItem(treeList,item);
    parentIds.push(parentItem.id);
    if(parentItem.parentId!=null){
        deepLoop(parentItem);
        }
    }
}
// 数组拷贝
function copyArr(arr){
    return arr.map((e)=>{
        if(typeof e === 'object'){
            return Object.assign({},e);
        }else{
            return e;
        }
    });
}

const Client = {
    getData,
    postData,
    getQueryString,
    dev,
    cmsHearders,
    global,
    formateTime,
    resetListHeight,
    getCookie,
    delCookie,
    findParentList,
    getParentIdList,
    findTreeItem,
    findParentItem,
    copyArr,
}

export default Client;

//818版本栏位
// public final static int FENCE_TYPE_BANNER_2 = 9; //banner818版本
// public final static int FENCE_TYPE_HEALTH_SCORE = 10; //健康分数818版本
// public final static int FENCE_TYPE_HEALTH_HEADLINE = 11; //健康头条818版本
// public final static int FENCE_TYPE_AUTHOR_ARTICLE_2 = 12; //大咖说818版本
// public final static int FENCE_TYPE_MASONRY = 13; //瀑布流818版本
// public final static int FENCE_TYPE_SIDESLIP = 14; //横滑栏位818版本
// public final static int FENCE_TYPE_SUBJECT = 15; //专题栏位818版本
// public final static int FENCE_TYPE_NAVIGATOR = 16; //导航栏位818版本
// public final static int FENCE_TYPE_LIMITED_2 = 17; //限时购818版本
// public final static int FENCE_TYPE_SANDING_BLOCK = 18; //豆腐块818版本
// public final static int FENCE_TYPE_HOT_LIST = 19; //榜单栏位818版本