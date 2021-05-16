<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-ajax-bar
          ref="bar"
          position="top"
          color="accent"
          size="2px"
        />
        <q-toolbar-title>
          <q-btn flat size="20px" no-caps padding="8px 5px" @click="goHome">LoremSurvey</q-btn>
          <span class="version"> v0.3 <span>开发版本</span></span>
        </q-toolbar-title>
        <q-btn-dropdown :label="isLogin? userName:'未登录'" icon="account_circle" flat size="15px" padding="12px">
          <q-list>
            <q-item clickable v-close-popup v-if="!isLogin">
              <q-item-section>
                <q-item-label>登录</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup v-if="isLogin">
              <q-item-section>
                <q-item-label>注销</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup v-if="!isLogin">
              <q-item-section>
                <q-item-label>注册</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup v-if="isLogin">
              <q-item-section>
                <q-item-label>个人中心</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

      </q-toolbar>
    </q-header>

    <q-page-container class="column">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MasterLayout',
  data() {
    return {
      isLogin: true,
      userName: '老段'
    }
  },
  methods: {
    goHome() {
      document.location.href = ''
    }
  }
}
</script>
<style scoped>
.version {
  font-size: small;
  color: rgba(221, 221, 221, 0.62);
  word-wrap: break-word;
}
</style>
