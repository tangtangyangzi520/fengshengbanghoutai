<template>
    <form class="row" style="margin: 5px 0 0 0">
        <div style="width:100%;overflow:hidden;">
            <div class="col-md-4">
                <div class="form-group">
                    <label class="col-md-3">创建时间：</label>
                    <div class="col-md-9 time-box" style="padding: 0;">
                        <div>
                            <input type="text" class="form-control inline-block datePicker" placeholder="选择开始时间" id="createStartTime">
                        </div>
                        <div>至</div>
                        <div>
                            <input type="text" class="form-control inline-block datePicker" placeholder="选择结束时间" id="createEndTime">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label class="col-md-3">更新时间：</label>
                    <div class="col-md-9 time-box" style="padding: 0;">
                        <div>
                            <input type="text" class="form-control inline-block datePicker" placeholder="选择开始时间" id="modifyedStartTime">
                        </div>
                        <div>至</div>
                        <div>
                            <input type="text" class="form-control inline-block datePicker" placeholder="选择结束时间" id="modifyedEndTime">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label class="col-md-3">视频名：</label>
                    <div class="col-md-9">
                        <input type="text" class="form-control" v-model="searchOptions.title">
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label class="col-md-3">发布状态：</label>
                    <div class="col-md-9">
                        <m-select :data="stateList" :placeholder="'请选择内容'" :change-func="selectStateFunc" :class="'fixedIcon'"></m-select>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label class="col-md-3">创建人：</label>
                    <div class="col-md-9">
                        <m-multi-select :data="authorList" :active-items="[]" :placeholder="'请选择内容'" :change-func="selectAuthorFunc"></m-multi-select>
                    </div>
                </div>
            </div>
    
            <div class="col-md-4">
                <div class="form-group">
                    <label class="col-md-3">作者：</label>
                    <div class="col-md-9">
                        <m-multi-select :data="expertsList" :active-items="[]" :placeholder="'请选择内容'" :change-func="selectExpertFunc"></m-multi-select>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label class="col-md-3">关注点：</label>
                    <div class="col-md-9">
                        <m-multi-select :data="painList" :active-items="painIdsActive" :placeholder="'请选择关注点'" :change-func="selectPainFunc"></m-multi-select>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label class="col-md-3">标签</label>
                    <div class="col-md-9">
                        <m-multi-select :data="labelList" :active-items="labellIdActive" :placeholder="'请选择标签'" :change-func="selectLabelFunc"></m-multi-select>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label class="col-md-3">上架状态：</label>
                    <div class="col-md-9">
                        <m-select :data="putawayStateList" :placeholder="'请选择内容'" :change-func="selectPutawayStateFunc" :class="'fixedIcon'"></m-select>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>
<script>
import client from '../../../common/utils/client';
import { getComponentList, } from '../../../vuex/actions/actions.component';
import { getPainTree } from '../../../vuex/actions/actions.pain';
import { mMultiSelect, mAlert, mSelect } from '../../../components';
export default {
    props: {
        onchange: {
            type: Function,
            default: () => { }
        },
        oncreate: {
            type: Function,
            default: () => { }
        }
    },
    vuex: {
        getters: {
            componentChannelList: ({ component }) => component.componentChannelList,
            painTree: ({ pain }) => pain.painTree,
        },
        actions: {
            getPainTree
        }
    },
    components: { mMultiSelect, mSelect, mAlert },
    data() {
        return {
            stateList: [],
            painList: [],
            authorList: [],//创建者列表
            expertsList: [],//作者列表
            labelList: [],
            putawayStateList: [{ id: 0, name: '下架' }, { id: 1, name: '上架' }],
            lastSearchOptions: {},
            painIdsActive: [],   //关注点选中
            labellIdActive: [], //渠道类型选中
            searchOptions: {
                title: '',
                subtitle: '',
                creators: [],
                experts: [],
                pains: [],
                deployStatus: -1,
                createStartTime: '',
                createEndTime: '',
                modifyedStartTime: '',
                modifyedEndTime: '',
                skuChannels: [],
                submitStatus: -1,
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    startIndex: 0,
                    totalPage: 0,
                    totalSize: 0
                }
            }
        }
    },
    methods: {
        // 过滤请求参数，空值的字段删除
        setOptions() {
            let options = this.searchOptions;
            options.createStartTime = options.createEndTime = options.modifyedStartTime = options.modifyedEndTime = '';
            let createStartTime = $('#createStartTime').val(),
                createEndTime = $('#createEndTime').val(),
                modifyedStartTime = $('#modifyedStartTime').val(),
                modifyedEndTime = $('#modifyedEndTime').val();
            if (createStartTime != '') {
                options.createStartTime = createStartTime + ' 00:00:00';
            }
            if (createEndTime != '') {
                options.createEndTime = createEndTime + " 23:59:59";
            }
            if (modifyedStartTime != '') {
                options.modifyedStartTime = modifyedStartTime + ' 00:00:00';
            }
            if (modifyedEndTime != '') {
                options.modifyedEndTime = modifyedEndTime + " 23:59:59";
            }
            for (let item in options) {
                if (options[item] == '') {
                    delete options[item];
                }
            }
            if (options.creators && options.creators.length == 0) {
                delete options.creators;
            }
            if (options.deployStatus == -1) {
                delete options.deployStatus;
            }
            if (options.skuChannels && options.skuChannels.length == 0) {
                delete options.skuChannels;
            }
            if (options.pains && options.pains.length == 0) {
                delete options.pains;
            }
            if (options.submitStatus && options.submitStatus == -1) {
                delete options.submitStatus;
            }
            this.onchange(options);
        },
        // 获取创建者列表
        getAuhorList() {
            client.postData(COMPONENT_GET_USERS, {}).then(data => {
                if (data.code == 200) {
                    let list = data.data;
                    for (let i = 0; i < list.length; i++) {
                        list[i].name = list[i].userName;
                        list[i].id = list[i].userId;
                    }
                    this.authorList = list;
                    this.stateList = client.global.deployStatusSelect;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
            })
        },
        // 获取作者列表
        getExpertList() {
            client.postData(COMPONENT_GET_AUTHORS, {}).then(data => {
                if (data.code == 200) {
                    let list = data.data;
                    for (let i = 0; i < list.length; i++) {
                        list[i].name = list[i].title;
                        list[i].id = list[i].componentId;
                    }
                    this.expertsList = list;
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
            })
        },
        // 获取标签列表
        getLabels() {
            client.postData(COMPONENT_LABELS_BY_PARENT + '?parentId=52', {}).then(data => {
                if (data.code == 200) {
                    let list = data.data;
                    this.labelList = [];
                    for (let i = 0; i < list.length; i++) {
                        this.labelList.push({ id: list[i].labelId, name: list[i].labelName });
                    }
                } else {
                    this.showMsg(data.msg);
                }
            }, data => {
            })
        },
        // 选择发布状态回调
        selectStateFunc(item) {
            this.searchOptions.deployStatus = item.id;
            this.setOptions();
        },
        // 选择标签回调
        selectLabelFunc(list) {
            if (list instanceof Array) {
                this.labellIdActive = list;
            } else {
                this.labellIdActive = [list];
            }
            this.searchOptions.labelIds = [];
            this.labellIdActive.forEach(item => {
                this.searchOptions.labelIds.push(item.id);
            })
            this.setOptions();
        },
        // 选择痛点回调
        selectPainFunc(list) {
            this.painIdsActive = [];
            if (list instanceof Array) {
                this.painIdsActive = list;
            } else {
                this.painIdsActive = [list];
            }
            this.searchOptions.pains = [];
            this.painIdsActive.forEach(item => {
                this.searchOptions.pains.push(item.id);
            })
            this.setOptions();
        },
        // 选择创建者回调
        selectAuthorFunc(list) {
            let creators = [];
            list.forEach((item) => {
                creators.push(item.id);
            })
            this.authorListSelect = creators;
            if (this.authorListSelect.length != 0) {
                this.searchOptions.creators = this.authorListSelect;
            } else {
                this.searchOptions.creators = [];
            }
            this.setOptions();
        },
        // 选择作者回调
        selectExpertFunc(list) {
            let experts = [];
            list.forEach((item) => {
                experts.push(item.id);
            })
            this.expertsListSelect = experts;
            if (this.expertsListSelect.length != 0) {
                this.searchOptions.experts = this.expertsListSelect;
            } else {
                this.searchOptions.experts = [];
            }
            this.setOptions();
        },
        // 选择上架状态回调
        selectPutawayStateFunc(item) {
            if (item.id == -1) {
                delete this.searchOptions.submitStatus;
            } else {
                this.searchOptions.submitStatus = item.id;
            }
        }
    },
    created() {
        this.getAuhorList();
        this.getExpertList();
        this.getPainTree();
        this.getLabels();
    },
    watch: {
        title(val) {
            this.searchOptions.title = val;
        },
        subtitle(val) {
            this.searchOptions.subtitle = val;
        },
        // 关注点列表加入id，name字段才可以使用select组件
        painTree() {
            let list = [];
            for (let i = 0; i < this.painTree.length; i++) {
                let item = this.painTree[i];
                let pushItem = {
                    id: item.id,
                    name: item.text,
                    item: item,
                    children: []
                }
                for (let j = 0; j < item.children.length; j++) {
                    let childItem = item.children[j];
                    pushItem.children.push({ id: childItem.id, name: childItem.text, item: childItem });
                }
                list.push(pushItem);
            }
            this.painList = list;
        }
    },
    ready() {
        this.setOptions();
        this.onchange(this.searchOptions);
        this.oncreate(false, true);
        $('#createStartTime').val('').datetimepicker({ format: 'yyyy-mm-dd', language: 'zh-CN', autoclose: 'true', minView: 2 });
        $('#createEndTime').val('').datetimepicker({ format: 'yyyy-mm-dd', language: 'zh-CN', autoclose: 'true', minView: 2 });
        $('#modifyedStartTime').val('').datetimepicker({ format: 'yyyy-mm-dd', language: 'zh-CN', autoclose: 'true', minView: 2 });
        $('#modifyedEndTime').val('').datetimepicker({ format: 'yyyy-mm-dd', language: 'zh-CN', autoclose: 'true', minView: 2 });
        $('.datePicker').on('change', () => {
            this.setOptions();
        })
    }
}
</script>
<style scope>
.form-control.inline-block {
    display: inline-block;
    padding-right: 5px!important;
}
</style>

