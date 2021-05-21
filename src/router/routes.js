const routes = [
  {
    path: '/survey',
    component: () => import('layouts/SurveyLayout.vue'),
    children: [
      {path: '', component: () => import('pages/Blank')},
      {
        path: ':token',
        component: () => import('pages/Survey.vue'),
        meta: {
          title: "问卷"
        }
      },
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MasterLayout'),
    children: [
      {
        path: '', component: () => import('pages/Welcome'),
        meta: {
          title: "欢迎 -LoremSurvey"
        }
      },
      {
        path: 'login', component: () => import('pages/Login'),
        meta: {
          title: "登录 -LoremSurvey"
        }
      },
      {
        path: 'register', component: () => import('pages/Register'),
        meta: {
          title: "注册 -LoremSurvey"
        }
      },
    ]
  },
  {
    path: '/manage',
    component: () => import('layouts/MasterLayout'),
    beforeEnter: (to, from, next) => {
      const isLogin = document.cookie.match(new RegExp("(^| )username=([^;]*)(;|$)"))
      if (!isLogin) next({path: '/login'})
      else next()
    },
    children: [
      {
        path: 'edit/:id', component: () => import('pages/Edit'),
        meta: {
          title: "问卷编辑 -LoremSurvey"
        }
      },
      {
        path: 'user', component: () => import('pages/User'),
        meta: {
          title: "个人中心 -LoremSurvey"
        }
      },
      {
        path: 'respondents', component: () => import( 'pages/Respondents'),
        meta: {
          title: "受访者管理 -LoremSurvey"
        }
      },
      {
        path: '', component: () => import('pages/SurveyManager'),
        meta: {
          title: "问卷管理 -LoremSurvey"
        }
      },
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
