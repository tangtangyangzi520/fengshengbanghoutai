import * as types from '../types'
import * as componentTypes from '../types/types.component'
import client from '../../common/utils/client';

// 打开选择图片资源弹窗
export const showSelectComponent = ({ dispatch }, data) => {
    dispatch(componentTypes.SHOW_SELECT_COMPONENT, { data: data });
}
export const getSelectComponentList = ({ dispatch }, data) => {
        dispatch(componentTypes.GET_SELECT_COMPONENT_LIST, {});
    }
    // 获取商品渠道列表
export const getComponentChannelList = ({ dispatch }, data) => {
        client.postData(SYSTEM_CHANNEL_LIST, data).then(response => {
            if (response.code != 200) {
                return dispatch(componentTypes.GET_COMPONENT_CHANNEL_LIST_FAIL, response)
            }
            dispatch(componentTypes.GET_COMPONENT_CHANNEL_LIST_SUCCESS, response)
        }, response => {
            dispatch(componentTypes.GET_COMPONENT_CHANNEL_LIST_FAIL)
        })
    }
    // 获取商品列表
export const getComponentList = ({ dispatch }, data) => {
        if (data.channelId == '') {
            delete data.channelId;
        }
        if (!data.componentType) {
            return;
        }
        data.submitStatus = 1;
        data.componentType = [data.componentType];
        let url = MERCHANDISE_LIST;
        if (data.componentType == 27 || data.componentType == 29 || data.componentType == 21 || data.componentType == 20 ||
            data.componentType == 24 || data.componentType == 26 || data.componentType == 14 || data.componentType == 22 || data.componentType == 23) {
            //商品接口地址
            url = COMPONENT_LIST;
        }
        if (data.componentType == 34) {
            //健康头条接口地址
            url = HEADLINE_LIST;
        }
        client.postData(url, data).then(response => {
            if (response.code != 200) {
                return dispatch(componentTypes.GET_COMPONENT_LIST_FAIL, response)
            }
            dispatch(componentTypes.GET_COMPONENT_LIST_SUCCESS, response)
        }, response => {
            dispatch(componentTypes.GET_COMPONENT_LIST_FAIL)
        })
    }
    // 获取组件列表
export const getComponentListAll = ({ dispatch }, data) => {
    if (data.channelId == '') {
        delete data.channelId;
    }
    if (!data.componentType) {
        return;
    }
    data.submitStatus = 1;
    data.componentType = [data.componentType];
    let url = COMPONENT_LIST;
    if (data.componentType == 27 || data.componentType == 15 || data.componentType == 13) {
        //商品接口地址
        data.subtitle = data.title;
        if (data.title) {
            delete data.title;
        }
    }
    client.postData(url, data).then(response => {
        if (response.code != 200) {
            return dispatch(componentTypes.GET_COMPONENT_LIST_FAIL, response)
        }
        dispatch(componentTypes.GET_COMPONENT_LIST_SUCCESS, response)
    }, response => {
        dispatch(componentTypes.GET_COMPONENT_LIST_FAIL)
    })
}