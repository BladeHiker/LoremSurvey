<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated style="background: linear-gradient(145deg,#1976d2 11%,#0f477e 75%);">
      <q-toolbar>
        <q-ajax-bar
          ref="bar"
          position="top"
          color="blue-3"
          size="3px"
        />
        <q-btn dense flat round icon="menu" @click="drawer = !drawer" v-if="isLogin"/>
        <q-toolbar-title shrink>
        <span class="flex inline items-center">
<!--          <q-icon name="widgets" color="white" size="18px"/>-->
          &nbsp;
          <span style="font-size: 15px">{{ this.$route.meta.name }}</span>
        </span>
        </q-toolbar-title>
        <q-toolbar-title>
          <div class="text-center xs-hide">
            <q-btn flat size="20px" no-caps padding="5px 15px" @click="goHome">
              <span class="flex row flex-center">
                    <img
                      alt="LoremSurvey"
                      src="~assets/text-logo.svg"
                      class="logo-img"
                    >
                <!--                <span class="logo">Lorem<span class="logo-white">Survey</span></span>-->
                <span class="version ellipsis gt-sm">  &nbsp; &nbsp;{{ ver }}</span></span>
            </q-btn>

            <!--          <span >{{this.$route.meta.title}}</span>-->
          </div>
        </q-toolbar-title>
        <q-btn-dropdown no-caps icon="account_circle" flat size="15px" padding="12px">
          <template slot="label">
            <div class="q-ml-sm gt-xs">
              {{ isLogin ? userName : '未登录' }}
            </div>
          </template>
          <q-list>
            <q-item v-close-popup v-if="isLogin" class="xs">
              <q-item-section>
                <q-item-label>{{ userName }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup v-if="!isLogin" @click="routeTo('/login')">
              <q-item-section>
                <q-item-label>登录</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup v-if="isLogin" @click="onLogout">
              <q-item-section>
                <q-item-label>注销</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup v-if="!isLogin" @click="routeTo('/register')">
              <q-item-section>
                <q-item-label>注册</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup v-if="isLogin" @click="routeTo('/manage/user')">
              <q-item-section>
                <q-item-label>个人中心</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="drawer"
      elevated
      :width="300"
      :breakpoint="400"
      v-if="isLogin"
    >
      <q-scroll-area style="height:400px; margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-item clickable v-ripple @click="routeTo('/')">
            <q-item-section avatar>
              <q-icon name="home"/>
            </q-item-section>

            <q-item-section>
              主页
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="routeTo('/manage')">
            <q-item-section avatar>
              <q-icon name="star"/>
            </q-item-section>

            <q-item-section>
              问卷管理
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="routeTo('/manage/respondents')">
            <q-item-section avatar>
              <q-icon name="send"/>
            </q-item-section>

            <q-item-section>
              受访者管理
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="routeTo('/manage/user')">
            <q-item-section avatar>
              <q-icon name="account_circle"/>
            </q-item-section>

            <q-item-section>
              个人中心
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <div class="fixed-bottom version-area">
        <div class="text-h6 text-primary">LoremSurvey</div>
        <div class="text-grey text-bold"> {{ ver }}</div>
      </div>
      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent flex column flex-center">
          <q-icon size="56px" class="q-mb-sm" name="account_circle"/>
          <div class="text-h6">{{ isLogin ? userName : '未登录' }}</div>
          <div class="text-h7" v-if="isLogin">管理员</div>
          <q-btn v-else dense flat @click="routeTo('login');drawer=false">登录</q-btn>
        </div>
      </q-img>
    </q-drawer>
    <q-page-container class="column">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>

import {logout} from "src/api/api";

export default {
  name: 'MasterLayout',
  data() {
    return {
      isLogin: true,
      userName: null,
      drawer: false,
      ver: "v2.5 开发版本"
    }
  },
  updated() {
    if (this.$cookies.isKey('username')) {
      this.userName = this.$cookies.get('username')
      this.isLogin = true
    } else
      this.isLogin = false
  },
  created() {
    if (this.$cookies.isKey('username')) {
      this.userName = this.$cookies.get('username')
      this.isLogin = true
    } else
      this.isLogin = false
  },
  methods: {
    goHome() {
      if (this.isLogin && this.$route.path !== '/manage')
        document.location.href = '/manage'
      else
        document.location.href = ''
    },
    routeTo(url) {
      this.$router.push(url)
      this.drawer = false
    },
    onLogout() {
      this.$cookies.remove('username')
      logout()
      this.isLogin = false
      location.reload()
    }
  }
}
</script>
<style scoped>
.version-area {
  height: 80px;
  box-sizing: border-box;
  padding: 20px;
}

.center-title {
  letter-spacing: 3px;
  font-size: 16px;
  font-weight: 200;
  padding-right: 50px;
}

.version {
  padding-top: 3px;
  font-size: small;
  color: rgba(221, 221, 221, 0.62);
  word-wrap: break-word;
}

.logo-white {
  background-color: white;
  color: #1667B8;
}

.logo {
  padding: 0 5px;
  line-height: 22px;
}

.logo-img {
  height: 30px;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  /*image-rendering:-webkit-optimize-contrast;*/
  image-rendering: auto;
  image-rendering: crisp-edges;
  -ms-interpolation-mode: nearest-neighbor;
}
</style>
