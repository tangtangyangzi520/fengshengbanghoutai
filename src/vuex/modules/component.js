import {
	SHOW_SELECT_COMPONENT,
	GET_SELECT_COMPONENT_LIST,
  GET_COMPONENT_LIST_FAIL,
  GET_COMPONENT_LIST_SUCCESS,
  GET_COMPONENT_CHANNEL_LIST_SUCCESS,
  GET_COMPONENT_CHANNEL_LIST_FAIL,
} from '../types/types.component'

const state = {
	componentShowOption: {},
	selectComponentList: [],
  componentList: [],
  componentChannelList: [],
}

const mutations = {
  [SHOW_SELECT_COMPONENT](state, action) {
  	if(typeof action.data.name == 'undefined'){
    	state.componentShowOption.show = false;
	  }else{
    	state.componentShowOption = action.data;
	  }
    state.timestamp = Date.now();
  },
  [GET_SELECT_COMPONENT_LIST](state, action) {
    let storage = JSON.parse(localStorage.getItem(state.componentShowOption.name));
    storage[0].timestamp = Date.now();
    state.selectComponentList = JSON.stringify(storage);
  },
  [GET_COMPONENT_LIST_FAIL](state, action) {
    state.componentList = []
  },
  [GET_COMPONENT_LIST_SUCCESS](state, action) {
    state.componentList = action
  },
  [GET_COMPONENT_CHANNEL_LIST_SUCCESS](state, action) {
    state.componentChannelList = action;
  },
  [GET_COMPONENT_CHANNEL_LIST_FAIL](state, action) {
    state.componentChannelList = []
  },
}

export default {
  state,
  mutations
}