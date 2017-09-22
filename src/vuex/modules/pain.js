import {
	GET_PAIN_TREE_FAIL,
  GET_PAIN_TREE_SUCCESS,
} from '../types/types.solution'

const state = {
  painTree: [],
}

const mutations = {
  [GET_PAIN_TREE_FAIL](state, action) {
    state.painTree = []
  },
  [GET_PAIN_TREE_SUCCESS](state, action) {
    state.painTree = action.data.root.children
  }
}

export default {
  state,
  mutations
}