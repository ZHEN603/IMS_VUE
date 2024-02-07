import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { asyncRoutes } from './router'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/404'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  if (store.getters.token) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next('/')
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      if (!store.getters.userId) {
        const {roles} = await store.dispatch("user/getUserInfo")
        const filteredRoutes = asyncRoutes.filter(item =>{
          return roles.menus.includes(item.path)
        })
        store.commit('user/setRoutes', filteredRoutes)
        router.addRoutes([...filteredRoutes, { path: '*', redirect: '/404', hidden: true }])
        next(to.path)
      }else{
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
