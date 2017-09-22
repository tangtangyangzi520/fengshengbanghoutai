import * as types from '../types'
import * as resourceTypes from '../types/types.resource'
import client from '../../common/utils/client';

// 打开选择图片资源弹窗
export const showSelectPic = ({ dispatch }, data) => {
  dispatch(resourceTypes.SHOW_SELECT_PIC, { data: data });
}
export const getSelectPicList = ({ dispatch }, data) => {
  dispatch(resourceTypes.GET_SELECT_PIC_LIST, {});
}
// 打开选择媒体资源弹窗
export const showSelectMedia = ({ dispatch }, data) => {
  dispatch(resourceTypes.SHOW_SELECT_MEDIA, { data: data });
}
export const getSelectMediaList = ({ dispatch }, data) => {
  dispatch(resourceTypes.GET_SELECT_MEDIA_LIST, {});
}
//获取资源列表
export const getResourceList = ({ dispatch }, data) => {
  if(data.storeType==''){
    delete data.storeType;
  }
  client.postData(INFOR_MATERIAL_GET,data).then(response => {
    if(response.code!=200){
      return dispatch(resourceTypes.GET_RESOURCE_LIST_FAIL,response)
    }
    dispatch(resourceTypes.GET_RESOURCE_LIST_SUCCESS,response)
  }, response => {
    dispatch(resourceTypes.GET_RESOURCE_LIST_FAIL)
  })
}