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
    ]
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
  {
    path: '/tokens',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'Tokens',
        path: '',
        component: () => import('pages/TokensPage.vue'),
        children: [
          {
            name: 'TokenMinting',
            path: 'mint',
            component: () => import('components/TokenMinting.vue')
          },
          {
            name: 'TokenBurning',
            path: 'burn',
            component: () => import('components/TokenBurning.vue')
          }
        ]
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
