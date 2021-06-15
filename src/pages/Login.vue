<template>
  <q-page class="flex flex-center">
    <q-form @submit="onLogin">
      <q-card class="flex column login-card">
        <div class="text-h4">登录问卷系统</div>
        <br/>
        <q-input
          label="用户名"
          v-model="loginForm.username"
          maxlength="20"
          lazy-rules
          :rules="[ val => val && val.length > 0 || '请输入用户名']"
        >
          <template v-slot:prepend>
            <q-icon name="account_box"></q-icon>
          </template>
        </q-input>
        <q-input
          label="密码"
          v-model="loginForm.password"
          maxlength="20"
          :type="isPwd ? 'password' : 'text'"
          lazy-rules
          :rules="[ val => val && val.length > 0 || '请输入密码']"
        >
          <template v-slot:prepend>
            <q-icon name="lock"></q-icon>
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-input
          label="验证码"
          v-model="loginForm.captcha.code"
          maxlength="20"
          lazy-rules
          :rules="[ val => val && val.length > 0 || '请输入验证码']"
        >
          <template v-slot:prepend>
            <q-icon name="how_to_reg"></q-icon>
          </template>
          <template v-slot:after>
            <q-img style="cursor: pointer" @click="getCaptchaData" :src="'data:image/png;base64,'+captchaImg"
                   width="100px" height="50px">
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey">
                  <q-icon name="refresh" size="22px"/>
                </div>
              </template>
            </q-img>
          </template>
        </q-input>
        <q-btn color="primary" type="submit" label="登录" :loading="loading"/>
        <div class="text-center">
          <q-btn flat dense @click="toForget">找回密码</q-btn>
          &nbsp;
          <q-btn flat dense @click="toReg">注册新账号</q-btn>
        </div>
      </q-card>
    </q-form>
  </q-page>
</template>

<script>

import {getCaptcha, login} from "src/api/api";

export default {
  name: "Login",
  data() {
    return {
      isPwd: true,
      loginForm: {
        username: "",
        password: "",
        captcha: {
          code: "",
          id: "",
        }
      },
      loading: false,
      captchaImg: null,
      reloadCaptcha: null
    };
  },
  created() {
    this.getCaptchaData()
  },
  methods: {
    getCaptchaData() {
      getCaptcha().then(res => {
        this.loginForm.captcha.code = ""
        this.loginForm.captcha.id = res.data.data.id
        this.captchaImg = res.data.data.base64Data
        if (this.reloadCaptcha) {
          clearTimeout(this.reloadCaptcha)
        }
        this.reloadCaptcha = setTimeout(() => {
          this.captchaImg = ""
        }, 40000)

      })
    },
    toReg() {
      this.$router.push('register')
    },
    toForget() {
      this.$router.push('forget')
    },
    onLogin() {
      this.loading = true
      this.loginForm.password = this.$md5(this.loginForm.password)
      login(this.loginForm).then(res => {
        if (res.data.code === 0) {
          //登陆成功
          this.loading = false
          this.$router.replace('manage')
        } else {
          this.loginForm.password = ""
          this.getCaptchaData()
        }
        this.loading = false
      }).catch(() => {
        this.loginForm.password = ""
        this.getCaptchaData()
        this.loading = false
      })
    }
  },
};
</script>

<style scoped lang="scss">
.login-card {
  padding: 20px;
  height: 450px;
  width: min(400px, 90vw);
  justify-content: space-around;
}
</style>
