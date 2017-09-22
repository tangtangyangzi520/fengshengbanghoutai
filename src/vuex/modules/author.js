import {
  GET_AUTHOR_LIST_SUCCESS,
  GET_AUTHOR_LIST_FAILE
} from '../types/types.author'

const state = {
  authorList: []
}

const mutations = {
  [GET_AUTHOR_LIST_FAILE](state){
    state.authorList = []
  },
  [GET_AUTHOR_LIST_SUCCESS](state,list){
    for(let i=0;i<list.length;i++){
      list[i].name = list[i].title;
      list[i].id = list[i].componentId;
    }
    state.authorList = list;
  }
}

export default {
  state,
  mutations
}