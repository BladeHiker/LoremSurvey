import Vue from "vue";
import routes from 'src/router/routes'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({x: 0, y: 0}),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,

  })
  Router.beforeEach((to, from, next) => {//beforeEach是router的钩子函数，在进入路由前执行
    if (to.meta.title) {//判断是否有标题
      document.title = to.meta.title
    }
    next()//执行进入路由，如果不写就不会进入目标页
  })
  return Router
}
