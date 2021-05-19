<template>
  <q-page class="flex justify-center">
    <q-form @submit="onRegister"
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false">
      <q-card class="flex column login-card">
        <div class="text-h4">注册</div>
        <br/>
        <q-input
          label="用户名"
          v-model="registerForm.username"
          maxlength="20"
          lazy-rules
          :rules="[ val => val && val.length > 0 || '请输入用户名']"
        >
          <template v-slot:prepend>
            <q-icon name="account_box"></q-icon>
          </template>
        </q-input>
        <q-input
          label="手机号"
          v-model="registerForm.phone"
          maxlength="20"
          lazy-rules
          :rules="[
            val => val && val.length !== 0 || '请输入手机号',
            val => val && /^[1][3,4,5,7,8][0-9]{9}$/.test(val) || '请输入正确的手机号',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="phone"></q-icon>
          </template>
        </q-input>
        <q-input
          label="邮箱"
          v-model="registerForm.email"
          maxlength="20"
          lazy-rules
          :rules="[
            val => val && val.length > 0 || '请输入邮箱',
            val => val &&(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(val)) || '请输入正确的邮箱地址'
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="email"></q-icon>
          </template>
        </q-input>
        <q-input
          label="密码"
          v-model="registerForm.password"
          maxlength="20"
          autocomplete="new-password"
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
          label="重复密码"
          v-model="passwordAgain"
          maxlength="20"
          autocomplete="new-password"
          type="password"
          :rules="[ val => val===registerForm.password || '两次输入不一致']"
        >
          <template v-slot:prepend>
            <q-icon name="lock"></q-icon>
          </template>
        </q-input>
        <q-btn color="primary" type="submit" label="注册" :loading="loading"/>
        <div class="text-center">
          <q-btn flat dense @click="toLogin">登录</q-btn>
        </div>
      </q-card>
    </q-form>
  </q-page>
</template>

<script>

import {register} from "src/api/api";


export default {
  name: "Register",
  data() {
    return {
      isPwd: true,
      registerForm: {
        username: null,
        password: "",
        phone: "",
        email: ""
      },
      passwordAgain: "",
      loading: false,
    };
  },
  created() {

  },
  methods: {
    toLogin() {
      this.$router.push('login')
    },
    onRegister() {
      this.loading = true
      this.registerForm.password = this.$md5(this.registerForm.password)
      register(this.registerForm).then(res => {
        if (res.code === 0) {
          this.loading = false
          //注册成功
          this.toLogin()
        }
      }).catch(() => {
        this.loading = false
      })

    }
  },
};
</script>

<style scoped lang="scss">
.login-card {
  margin: 20px 0;
  padding: 20px;
  height: 600px;
  width: min(400px, 90vw);
  justify-content: space-around;
}
</style>
