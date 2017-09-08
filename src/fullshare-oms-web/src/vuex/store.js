import Vue from 'vue'
import Vuex from 'vuex'
import middlewares from './middlewares'
import loading from './modules/loading'
import system from './modules/system/system.resource'
import author from './modules/author'
import fences from './modules/fences'
import resourceControl from './modules/resource'
import component from './modules/component'
import pain from './modules/pain'
import solution from './modules/solution'
import article from './modules/article'
import contentUserList from './modules/content/userlist'
import contentDetail from './modules/content/content.detail'
import contentDetailSave from './modules/content/content.detail.save'
import componentDataUpdate from './modules/content/update.component.data'
const debug = process.env.NODE_ENV !== 'production'
Vue.use(Vuex)
Vue.config.debug = debug
Vue.config.warnExpressionErrors = false

let modules = {
    loading,
    contentUserList,
    contentDetail,
    contentDetailSave,
    componentDataUpdate,
    resourceControl,
    system,
    author,
    fences,
    component,
    solution,
    pain,
    article,
}
export default new Vuex.Store({
    modules,
    strict: debug,
    middlewares
})