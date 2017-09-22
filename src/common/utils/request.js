import client from './client';

// 操作数据：拒绝申请
const ajaxLimitReject = (params) => {
    return client.postData(ARTICLE_LIST, params);
}

// 操作数据：发布
const ajaxLimitPublish = (params) => {
    return client.postData(ARTICLE_LIST, params);
}

// 操作数据：提交
const ajaxLimitSubmit = (params) => {
    return client.postData(ARTICLE_LIST, params);
}

// 操作数据：撤回
const ajaxLimitWithdraw = (params) => {
    return client.postData(ARTICLE_LIST, params);
}
export default req = {
    ajaxLimitReject
}