import {
  GET_RESOURCE_BY_USER_SUCCESS,
  GET_RESOURCE_BY_USER_FAIL
} from '../../types/types.system'

const state = {
  systemResource: {}
}

const mutations = {
  [GET_RESOURCE_BY_USER_FAIL](state){
    state.systemResource = {}
  },
  [GET_RESOURCE_BY_USER_SUCCESS](state,action){
    state.systemResource = action
  }
}

export default {
  state,
  mutations
}