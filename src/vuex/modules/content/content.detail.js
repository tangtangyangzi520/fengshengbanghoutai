import {
    SUCCESS_GET_CONTENT_DETAIL,
    FAILURE_GET_CONTENT_DETAIL
} from '../../types/types.content'

const state = {
    detail: {},
    state: {},
}

const mutations = {
    [FAILURE_GET_CONTENT_DETAIL](state, action) {
        state.state = { code: action.code, msg: action.msg }
        alert(action.msg)
    },
    [SUCCESS_GET_CONTENT_DETAIL](state, action) {

        if (typeof action.detail == 'string') {
            try {
                action.detail = JSON.parse(action.detail);
            } catch (e) {
                action.detail = {};
            }
        } else {
            if (!action.detail) {
                state.detail = action.detail;
                return;
            }
            if (action.detail.articleContent) {
                try {
                    action.detail.content = JSON.parse(action.detail.articleContent);
                } catch (e) {
                    action.detail.content = []
                }
            }
        }
        if (action.detail.tags) {
            action.detail.tags.forEach(item => {
                item.id = item.tagId;
                item.text = item.tagName;
            })
        }
        if (action.detail.mediumHomeIcon == '') {
            action.detail.mediumHomeIcon = [];
        } else {
            if (typeof action.detail.mediumHomeIcon == 'string') {
                action.detail.mediumHomeIcon = action.detail.mediumHomeIcon.split('&&');
            }
        }
        state.detail = action.detail;
        if (!state.detail.mediumHomeIcon) {
            state.detail.mediumHomeIcon = '';
        }
        if (!state.detail.mediumUrl) {
            state.detail.mediumUrl = '';
        }
        localStorage.setItem('contentDetail', JSON.stringify(action.detail));
    }
}

export default {
    state,
    mutations
}