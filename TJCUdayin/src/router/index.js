import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Person from '@/views/Person'
import Recharge from '@/views/Recharge'
import Pay from '@/views/Payment'
import Cookies from 'js-cookie'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/person',
      name: 'Person',
      component: Person
    },
    {
      path: '/recharge',
      name: 'Recharge',
      component: Recharge
    },
    {
      path: '/pay/:_id',
      name: 'Pay',
      component: Pay
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/' && !Cookies.get('token')) {
    return next('/')
  }
  next()
})

export default router
