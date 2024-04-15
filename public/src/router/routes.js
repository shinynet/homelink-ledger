const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('pages/IndexPage.vue')
      }
    ]
  },
  {
    path: '/order',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Order',
        component: () => import('pages/OrderPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
