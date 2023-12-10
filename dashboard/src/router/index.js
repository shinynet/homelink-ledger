import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { lucid } from 'boot/lucid'
import { LocalStorage } from 'quasar'

const isAuthenticated = async () => {
  // TODO: validate wallet contains admin token
  if (lucid.wallet) return true

  const wallet = LocalStorage.getItem('wallet')

  if (wallet) {
    try {
      const walletApi = await window.cardano[wallet].enable()
      lucid.selectWallet(walletApi)
      return true
    } catch (error) {
      LocalStorage.remove('wallet')
      return false
    }
  }
  LocalStorage.remove('wallet')
  return false
}

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach(async to => {
    if (to.name !== 'Login') {
      const authenticated = await isAuthenticated()
      return (authenticated || { name: 'Login' })
    }
  })

  return Router
})
