import Vue from 'vue'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'
import store from './vuex/store'
import configRouter from './routes'
import App from './App.vue'
import $ from 'jquery'
Vue.use(VueRouter)



const router = new VueRouter({
    hashbang: true,
    history: false,
    saveScrollPosition: true,
    suppressTransitionError: true
})
configRouter(router)
sync(store, router)

router.start(Vue.extend(App), '#root')
window.router = router;

router.afterEach(function(to) {
    console.log('zzzz')
    setTimeout(resizeHeight, 100)

})

let resizeHeight = function resetListHeight() {
    const windowHeight = $(window).height();
    $('#contentList').height(windowHeight - $('.page-bar').height() - 120 - $('.pagination').height());
}
$(window).on("resize", () => {
    resizeHeight();
});