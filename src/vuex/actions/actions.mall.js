import client from '../../common/utils/client';

// 获取方案列表
export const getArticleList = ({ dispatch }, data) => {
    if (data.channelId == '') {
        delete data.channelId;
    }
    client.postData(ARTICLE_LIST, data).then(response => {
        if (response.code != 200) {
            return dispatch(articleTypes.GET_ARTICLE_LIST_FAIL, response)
        }
        dispatch(articleTypes.GET_ARTICLE_LIST_SUCCESS, response)
    }, response => {
        dispatch(articleTypes.GET_ARTICLE_LIST_FAIL)
    })
}