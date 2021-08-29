import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
// 解决路由冲突
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

// 异步组件加载
const Index = () => import('@/views/Index')
const Login = () => import('@/views/Login')
const Home = () => import('@/views/Home')
const Goods = () => import('@/views/Goods')
const Thanks = () => import('@/views/Thanks')
const GoodsDetail = () => import('@/views/GoodsDetail')
const User = () => import('@/views/User')

// import Index from '@/views/Index'
// import Login from '@/views/Login'
// import Home from '@/views/Home'
// import Goods from '@/views/Goods'
// import Thanks from '@/views/Thanks'
// import GoodsDetail from '@/views/GoodsDetail'
// import User from '@/views/User'

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home',
      name: 'home',
      component: Index,
      children: [
        {
          path: 'home',
          component: Home
        },
        {
          path: 'goods',
          component: Goods
        },
        {
          path: 'thanks',
          component: Thanks
        },
        {
          path: 'goodsDetail',
          component: GoodsDetail
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/user',
      name: 'user',
      component: User,
      meta: {
        // 需要守卫
        auth: true
      }
    }
  ]
})
