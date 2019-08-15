import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      id: 1,
      component: () => import('@/components/Home'),
      hidden: true,
      name: '主页',
      path: '/',
      redirect: '/article'
    },
    {
      id: 11,
      children: [
        {
          id: 101,
          component: () => import('@/components/view/Article'),
          hidden: false,
          icon: 'el-icon-user',
          name: '文章打分',
          path: '/article'
        }
      ],
      component: () => import('@/components/Home'),
      hidden: false,
      icon: 'el-icon-document',
      name: '稿件管理',
      path: '/manuscript'
    }
  ]
})
