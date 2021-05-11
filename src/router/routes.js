const routes = [
  {
    path: '/survey',
    component: () => import('layouts/SurveyLayout.vue'),
    children: [
      {path: '', redirect: '/'},
      {path: ':token', component: () => import('pages/Survey.vue')}
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MasterLayout'),
    children: [
      {path: '', component: () => import('pages/Welcome')},
      {path: 'edit/:id', component: () => import('pages/Edit.vue')}
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
