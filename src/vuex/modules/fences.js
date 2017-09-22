const state = {
    updateFence: Date.now(),
    createFence: null
}

const mutations = {
    ['updateFenceInfo'](state) {
        state.updateFence = Date.now();
    },
    ['createFenceInfo'](state, action) {
        state.createFence = action;
    }
}

export default {
    state,
    mutations
}