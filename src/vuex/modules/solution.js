import {
	SHOW_SELECT_SOLUTION,
	GET_SELECT_SOLUTION_LIST,
  GET_SOLUTION_LIST_FAIL,
  GET_SOLUTION_LIST_SUCCESS,
} from '../types/types.solution'

const state = {
	solutionShowOption: {},
	selectSolutionList: [],
  solutionList: [],
}

const mutations = {
  [SHOW_SELECT_SOLUTION](state, action) {
  	if(typeof action.data.name == 'undefined'){
    	state.solutionShowOption.show = false;
	  }else{
    	state.solutionShowOption = action.data;
	  }
    state.timestamp = Date.now();
  },
  [GET_SELECT_SOLUTION_LIST](state, action) {
    let storage = JSON.parse(localStorage.getItem(state.solutionShowOption.name));
    storage[0].timestamp = Date.now();
    state.selectSolutionList = JSON.stringify(storage);
  },
  [GET_SOLUTION_LIST_FAIL](state, action) {
    state.solutionList = []
  },
  [GET_SOLUTION_LIST_SUCCESS](state, action) {
    state.solutionList = action
  }
}

export default {
  state,
  mutations
}