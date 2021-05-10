const routes = [
  {
    path: '/index',
    component: () => import('pages/Index.vue'),
  },
  {
    path: '/survey',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/Survey.vue')},
      {path: ':token', component: () => import('pages/Survey.vue')}
    ]
  },
  {
    path: '/edit',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: ':id', component: () => import('pages/Edit.vue')}
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
