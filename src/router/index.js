import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/article',
      name: 'Article',
      component: () => import('@/components/Article')
    }
  ]
})
