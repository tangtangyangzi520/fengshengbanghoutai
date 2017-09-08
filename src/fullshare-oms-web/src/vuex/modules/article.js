import {
	SHOW_SELECT_ARTICLE,
	GET_SELECT_ARTICLE_LIST,
  GET_ARTICLE_LIST_FAIL,
  GET_ARTICLE_LIST_SUCCESS,
} from '../types/types.article'

const state = {
	articleShowOption: {},
	selectArticleList: [],
  articleList: [],
}

const mutations = {
  [SHOW_SELECT_ARTICLE](state, action) {
  	if(typeof action.data.name == 'undefined'){
    	state.articleShowOption.show = false;
	  }else{
    	state.articleShowOption = action.data;
	  }
    state.timestamp = Date.now();
  },
  [GET_SELECT_ARTICLE_LIST](state, action) {
    let storage = JSON.parse(localStorage.getItem(state.articleShowOption.name));
    storage[0].timestamp = Date.now();
    state.selectArticleList = JSON.stringify(storage);
  },
  [GET_ARTICLE_LIST_FAIL](state, action) {
    state.articleList = []
  },
  [GET_ARTICLE_LIST_SUCCESS](state, action) {
    state.articleList = action
  }
}

export default {
  state,
  mutations
}