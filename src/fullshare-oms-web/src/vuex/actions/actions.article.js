import * as types from '../types'
import * as articleTypes from '../types/types.article'
import client from '../../common/utils/client';

// 打开选择图片资源弹窗
export const showSelectArticle = ({ dispatch }, data) => {
  dispatch(articleTypes.SHOW_SELECT_ARTICLE, { data: data });
}
export const getSelectArticleList = ({ dispatch }, data) => {
  dispatch(articleTypes.GET_SELECT_ARTICLE_LIST, {});
}
// 获取方案列表
export const getArticleList = ({ dispatch }, data) => {
  if(data.channelId==''){
    delete data.channelId;
  }
  client.postData(ARTICLE_LIST,data).then(response => {
    if(response.code!=200){
      return dispatch(articleTypes.GET_ARTICLE_LIST_FAIL,response)
    }
    dispatch(articleTypes.GET_ARTICLE_LIST_SUCCESS,response)
  }, response => {
    dispatch(articleTypes.GET_ARTICLE_LIST_FAIL)
  })
}