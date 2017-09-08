import * as types from '../types'
import * as contentTypes from '../types/types.system'
import client from '../../common/utils/client';

// 用户列表
export const getResourceByUser = ({ dispatch },data) => {
  dispatch(types.CHANGE_LOADING, { loading: {show:true} });
  client.postData(SYSTEM_USER_RESOURCE,data).then(response => {
    dispatch(types.CHANGE_LOADING, { loading: {show:false} })
    if(response.code!=200){
      return dispatch(contentTypes.GET_RESOURCE_BY_USER_FAIL,data)
    }
    var data =response.data;
    dispatch(contentTypes.GET_RESOURCE_BY_USER_SUCCESS,data)
  }, response => {
    dispatch(types.CHANGE_LOADING, { loading: {show:false} })
    dispatch(contentTypes.GET_RESOURCE_BY_USER_FAIL)
  })
}
