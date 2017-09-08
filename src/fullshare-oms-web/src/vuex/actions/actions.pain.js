import * as types from '../types'
import * as painTypes from '../types/types.pain'
import client from '../../common/utils/client';

// 获取方案列表
export const getPainTree = ({ dispatch }, data) => {
  client.postData(PAIN_TREE,data).then(response => {
    if(response.code!=200){
      return dispatch(painTypes.GET_SOLUTION_LIST_FAIL,response)
    }
    dispatch(painTypes.GET_SOLUTION_LIST_SUCCESS,response)
  }, response => {
    dispatch(painTypes.GET_SOLUTION_LIST_FAIL)
  })
}