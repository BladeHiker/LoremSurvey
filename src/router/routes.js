const routes = [
  {
    path: '/survey',
    component: () => import('layouts/SurveyLayout.vue'),
    children: [
      {path: '', component: () => import('pages/Blank.vue')},
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
    component: () => import('pages/Welcome.vue'),
    meta: {
      title: "欢迎 -LoremSurvey"
    }
  },
  {
    path: '/',
    component: () => import('layouts/MasterLayout.vue'),
    children: [
      // {
      //   path: '', component: () => import('pages/Welcome.vue'),
      //   meta: {
      //     title: "欢迎 -LoremSurvey"
      //   }
      // },
      {
        path: 'login', component: () => import('pages/Login.vue'),
        meta: {
          title: "登录 -LoremSurvey"
        }
      },
      {
        path: 'register', component: () => import('pages/Register.vue'),
        meta: {
          title: "注册 -LoremSurvey"
        }
      },
      {
        path: 'forget', component: () => import('pages/Forget.vue'),
        meta: {
          title: "找回密码 -LoremSurvey"
        }
      },
    ]
  },
  {
    path: '/manage',
    component: () => import('layouts/MasterLayout.vue'),
    beforeEnter: (to, from, next) => {
      const isLogin = document.cookie.match(new RegExp("(^| )username=([^;]*)(;|$)"))
      if (!isLogin) next({path: '/login'})
      else next()
    },
    children: [
      {
        path: 'edit/:id', component: () => import('pages/Edit.vue'),
        meta: {
          title: "问卷编辑 -LoremSurvey"
        }
      },
      {
        path: 'user', component: () => import('pages/User.vue'),
        meta: {
          title: "个人中心 -LoremSurvey"
        }
      },
      {
        path: 'respondents', component: () => import( 'pages/Respondents.vue'),
        meta: {
          title: "受访者管理 -LoremSurvey"
        }
      },
      {
        path: '', component: () => import('pages/SurveyManager.vue'),
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
