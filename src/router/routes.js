const routes = [
  {
    path: '/survey',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: ':token', component: () => import('pages/survey.vue')}
    ]

  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/Index.vue')}
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
