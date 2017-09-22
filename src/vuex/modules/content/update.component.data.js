import {
  UPDATE_COMPONENT_DATA,
  CLEAR_COMPONENT_DATA
} from '../../types/types.content'

const state = {
  update: 0,
  clear: 0,
}

const mutations = {
  [UPDATE_COMPONENT_DATA](state,action){
    state.update = Date.now();
  },
  [CLEAR_COMPONENT_DATA](state,action){
    state.clear = Date.now();
  }
}

export default {
  state,
  mutations
}