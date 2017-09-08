import {
	SHOW_SELECT_PIC,
	GET_SELECT_PIC_LIST,
  SHOW_SELECT_MEDIA,
  GET_SELECT_MEDIA_LIST,
  GET_RESOURCE_LIST_FAIL,
  GET_RESOURCE_LIST_SUCCESS
} from '../types/types.resource'

const state = {
	picShowOption: {},
	selectPicList: [],
  mediaShowOption: {},
  selectMediaList: [],
  resouceList: [],
}

const mutations = {
  [SHOW_SELECT_PIC](state, action) {
  	if(typeof action.data.name == 'undefined'){
    	state.picShowOption.show = false;
	  }else{
    	state.picShowOption = action.data;
	  }
  },
  [GET_SELECT_PIC_LIST](state, action) {
    let storage = JSON.parse(localStorage.getItem(state.picShowOption.name));
    storage[0].timestamp = Date.now();
    state.selectPicList = JSON.stringify(storage);
  },
  [SHOW_SELECT_MEDIA](state, action) {
    if(typeof action.data.name == 'undefined'){
      state.mediaShowOption.show = false;
    }else{
      state.mediaShowOption = action.data;
    }
  },
  [GET_SELECT_MEDIA_LIST](state, action) {
    let storage = JSON.parse(localStorage.getItem(state.mediaShowOption.name));
    storage[0].timestamp = Date.now();
    state.selectMediaList = JSON.stringify(storage);
  },
  [GET_RESOURCE_LIST_FAIL](state, action) {
    state.resouceList = []
  },
  [GET_RESOURCE_LIST_SUCCESS](state, action) {
    state.resouceList = action
  },
}

export default {
  state,
  mutations
}