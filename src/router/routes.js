const routes = [
  {
    path: '/survey',
    component: () => import('layouts/SurveyLayout.vue'),
    children: [
      {path: '', component: () => import('pages/Blank')},
      {path: ':token', component: () => import('pages/Survey.vue')},
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MasterLayout'),
    children: [
      {path: '', component: () => import('pages/Welcome')},
      {path: 'login', component: () => import('pages/Login')},
      {path: 'register', component: () => import('pages/Register')},
    ]
  },
  {
    path: '/manage',
    component: () => import('layouts/MasterLayout'),
    beforeEnter: (to, from, next) => {
      const isLogin = document.cookie.match(new RegExp("(^| )Username=([^;]*)(;|$)"))
      if (!isLogin) next({path: '/login'})
      else next()
    },
    children: [
      {path: 'edit/:id', component: () => import('pages/Edit')},
      {path: 'user', component: () => import('pages/User')},
      {path: 'respondents', component: () => import( 'pages/Respondents')},
      {path: '', component: () => import('pages/SurveyManager')},
      {path: '*', redirect: '/manage'}
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
