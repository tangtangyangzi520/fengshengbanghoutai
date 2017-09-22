import * as types from '../types'
import * as contentTypes from '../types/types.content'
import client from '../../common/utils/client';
let hasGetArticleContent = false;
// 用户列表
export const getUserList = ({ dispatch }, data, isAdd) => {
    dispatch(types.CHANGE_LOADING, { loading: { show: true } })

    client.getUserList(data).then(response => {
        dispatch(types.CHANGE_LOADING, { loading: { show: false } })
        if (!response.ok) {
            return dispatch(contentTypes.FAILURE_GET_USER_LIST)
        }
        var data = response.data;
        dispatch(contentTypes.SUCCESS_GET_USER_LIST, { list: data })
    }, response => {
        dispatch(types.CHANGE_LOADING, { loading: { show: false } })
        dispatch(contentTypes.FAILURE_GET_USER_LIST)
    })
}

// 内容详情
export const getContentDetail = ({ dispatch }, data) => {
        if (data.id == 0 || typeof data.id == 'undefined') {
            let draftArtcleId = localStorage.getItem('draftArticleId');
            if (draftArtcleId == 0) {
                let draftArticleContent = localStorage.getItem('contentDetail' + localStorage.getItem('draftArticleType'));
                if (draftArticleContent) {
                    //读取到有草稿数据则设置
                    localStorage.setItem('contentDetail', draftArticleContent);
                } else {
                    //读取不到草稿数据则重置缓存
                    localStorage.removeItem('contentDetail');
                }
            }
            dispatch(contentTypes.SUCCESS_GET_CONTENT_DETAIL, { detail: localStorage.getItem('contentDetail') });
            return
        }
        if (data.id != 0) {
            client.postData(CMS_API_BASE + "/component/getArticle?componentId=" + data.id, {}).then(response => {
                if (response.code != 200) {
                    return dispatch(contentTypes.FAILURE_GET_CONTENT_DETAIL, { code: response.code, msg: response.msg })
                }
                var data = response.data;
                dispatch(contentTypes.SUCCESS_GET_CONTENT_DETAIL, { detail: data })
            }, response => {
                dispatch(contentTypes.FAILURE_GET_CONTENT_DETAIL)
            })
        }
    }
    // 保存内容详情
export const saveContentDetail = ({ dispatch }, data) => {
        let draftArticleId = localStorage.getItem('draftArticleId');
        if (draftArtcleId == 0) {
            let draftArticleContent = localStorage.getItem('contentDetail');
            localStorage.setItem('contentDetail' + localStorage.getItem('draftArticleType'), draftArticleContent);
            dispatch(contentTypes.SUCCESS_SAVE_CONTENT_DETAIL, { detail: localStorage.getItem('contentDetail') });
            return
        }
        dispatch(types.CHANGE_LOADING, { loading: { show: true } });
        client.getUserList(data).then(response => {
            dispatch(types.CHANGE_LOADING, { loading: { show: false } })
            if (!response.ok) {
                return dispatch(contentTypes.FAILURE_SAVE_CONTENT_DETAIL)
            }
            var data = response.data;
            dispatch(contentTypes.SUCCESS_SAVE_CONTENT_DETAIL, { detail: data })
        }, response => {
            dispatch(types.CHANGE_LOADING, { loading: { show: false } })
            dispatch(contentTypes.FAILURE_SAVE_CONTENT_DETAIL)
        })
    }
    // 通知更新组件内容
export const updateComponentData = ({ dispatch }, data, isAdd) => {
    dispatch(contentTypes.UPDATE_COMPONENT_DATA, { update: data });
}
export const clearComponentData = ({ dispatch }, data, isAdd) => {
    dispatch(contentTypes.CLEAR_COMPONENT_DATA, { update: data });
}