import * as types from '../types'
import * as contentTypes from '../types/types.author'
import client from '../../common/utils/client';

// 专家列表
export const getAuthorList = ({ dispatch }, data) => {
    data.componentType = [12];
    data.deployStatus = 2;
    data.filter = 1;
    data.page = { "totalPage": 0, "currentPage": 1, "totalSize": 0, "pageSize": 10000 };
    client.postData(COMPONENT_LIST, data).then(response => {
        if (response.code != 200) {
            return dispatch(contentTypes.GET_AUTHOR_LIST_FAILE, data)
        }
        var data = response.data;
        dispatch(contentTypes.GET_AUTHOR_LIST_SUCCESS, data)
    }, response => {
        dispatch(contentTypes.GET_AUTHOR_LIST_FAILE)
    })
}