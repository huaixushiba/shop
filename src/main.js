// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import Vuex from 'vuex'
import store from './store'
import { getStore } from '@/utils/storage'

// 使用vuelazyload
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)
// or with options
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'dist/error.png',
  loading: 'dist/loading.gif',
  attempt: 1
})

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.prototype.$http = axios
// 设置公共url
axios.defaults.baseURL = 'http://127.0.0.1:3000'

// 请求拦截器
axios.interceptors.request.use(config => {
  const token = getStore('token')
  if (token) {
    // 表示用户已登录
    // ['Authorization'] 取决于后端
    config.headers.common['Authorization'] = token
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 守卫
router.beforeEach((to, from, next) => {
  axios.post('/validate', {}).then(res => {
    let data = res.data
    if (data.state !== 1) {
      if (to.matched.some(record => record.meta.auth)) {
        // 用户未登录，需要跳转登录页面
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        })
      } else {
        next()
      }
    } else {
      // 保存用户的信息
      store.commit('ISLOGIN', data)
      if (to.path === '/login') {
        router.push({
          path: '/'
        })
      }
    }
  }).catch(error => {
    console.log(error)
  })
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
