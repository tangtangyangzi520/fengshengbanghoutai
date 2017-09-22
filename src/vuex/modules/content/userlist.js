import {
  SUCCESS_GET_USER_LIST,
  FAILURE_GET_USER_LIST
} from '../../types/types.content'

const state = {
  items:[]
}

const mutations = {
  [FAILURE_GET_USER_LIST](state){
    state.items = []
  },
  [SUCCESS_GET_USER_LIST](state,action){
    state.items = action.list
  }
}

export default {
  state,
  mutations
}