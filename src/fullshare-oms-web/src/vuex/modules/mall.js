const state = {
    authorList: []
}

const mutations = {
    [GET_CAMPAIGN_FENCES_LIST_FAILE](state) {
        state.authorList = []
    },
    [GET_CAMPAIGN_FENCES_LIST_SUCCESS](state, list) {
        for (let i = 0; i < list.length; i++) {
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