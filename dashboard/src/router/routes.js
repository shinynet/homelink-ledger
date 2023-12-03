import { LocalStorage } from 'quasar'
import { lucid } from 'boot/lucid'

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
      console.log('error: ', error)
      LocalStorage.remove('wallet')
      return false
    }
  }
  LocalStorage.remove('wallet')
  return false
}

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'Dashboard',
        path: '',
        component: () => import('pages/DashboardPage.vue')
      }
    ],
    beforeEnter: async () => {
      const authenticated = await isAuthenticated()
      console.log('authenticated: ', authenticated)
      return (authenticated || { name: 'Login' })
      // TODO: Change to a global guard to prevent access
      //  to any route (except Login) if not authenticated
    }
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        name: 'Login',
        path: '',
        component: () => import('pages/WalletLogin.vue')
      }
    ]
  },
  {
    path: '/playground',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'Playground',
        path: '',
        component: () => import('pages/PlaygroundPage.vue')
      }
    ]
  },

  // Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
