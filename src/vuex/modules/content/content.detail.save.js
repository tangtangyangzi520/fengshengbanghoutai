import {
  SUCCESS_SAVE_CONTENT_DETAIL,
  FAILURE_SAVE_CONTENT_DETAIL
} from '../../types/types.content'

const state = {
  detail: {}
}

const mutations = {
  [FAILURE_SAVE_CONTENT_DETAIL](state){
    state.detail = {}
  },
  [SUCCESS_SAVE_CONTENT_DETAIL](state,action){
    state.detail = action.detail
  }
}

export default {
  state,
  mutations
}