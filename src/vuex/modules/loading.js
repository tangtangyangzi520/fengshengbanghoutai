import {
	CHANGE_LOADING
} from '../types'

const state = {item: {show:false}}

const mutations = {
  [CHANGE_LOADING](state, action) {
    state.item = action.loading
  }
}

export default {
  state,
  mutations
}