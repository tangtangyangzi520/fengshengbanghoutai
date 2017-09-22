import * as types from '../types'
import * as skuTypes from '../types/types.solution'
import client from '../../common/utils/client';

// 打开选择图片资源弹窗
export const showSelectSolution = ({ dispatch }, data) => {
  dispatch(skuTypes.SHOW_SELECT_SOLUTION, { data: data });
}
export const getSelectSolutionList = ({ dispatch }, data) => {
  dispatch(skuTypes.GET_SELECT_SOLUTION_LIST, {});
}
// 获取方案列表
export const getSolutionList = ({ dispatch }, data) => {
  if(data.channelId==''){
    delete data.channelId;
  }
  data.filter = 1;
  data.deployStatus = 2;
  data.componentType = [17];
  client.postData(COMPONENT_LIST,data).then(response => {
    if(response.code!=200){
      return dispatch(skuTypes.GET_SOLUTION_LIST_FAIL,response)
    }
    dispatch(skuTypes.GET_SOLUTION_LIST_SUCCESS,response)
  }, response => {
    dispatch(skuTypes.GET_SOLUTION_LIST_FAIL)
  })
}