<template>
  <q-page class="flex flex-center">
    <q-card class="flex column q-pa-lg">
      <div class="text-h4 text-center">个人中心</div>
      <br/>
      <q-list>
        <q-item>
          <q-item-section>用户名</q-item-section>
          <q-space style="width: 50px"/>
          <q-item-section side>{{ this.$cookies.get('username') }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>邮箱</q-item-section>
          <q-item-section side>{{ userInfo.email }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>手机号</q-item-section>
          <q-item-section side>{{ userInfo.phone }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>密码</q-item-section>

          <q-item-section side>
            <q-btn flat dense color="primary" @click="toChange">修改密码</q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
    <q-dialog v-model="changePassword">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">修改密码</div>
          <q-space/>
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>

        <q-card-section>
          <q-form ref="passwordFrom" class="flex column">
            <q-input
              label="旧密码"
              v-model="pswdForm.old"
              maxlength="20"
              type="password"
              lazy-rules
              :rules="[ val => val && val.length > 0 || '请输入密码']"
            >
              <template v-slot:prepend>
                <q-icon name="lock"></q-icon>
              </template>
            </q-input>
            <q-input
              label="新密码"
              v-model="pswdForm.new"
              maxlength="20"
              :type="isPwd ? 'password' : 'text'"
              lazy-rules
              :rules="
          [
             val => val && val.length > 0 || '请输入密码',
             val => val && /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(val) || '密码至少包含 数字和英文，长度6-20'
          ]"
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
              :rules="[ val => val===pswdForm.new || '两次输入不一致']"
            >
              <template v-slot:prepend>
                <q-icon name="lock"></q-icon>
              </template>
            </q-input>
            <q-btn color="primary" label="修改密码" @click="change"/>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {changeUserPassword, getUserInfo} from "src/api/api";

export default {
  name: "User",
  data() {
    return {
      userInfo: {
        email: "*",
        id: 4,
        phone: "*",
        username: "*"
      },
      changePassword: true,
      pswdForm: {
        old: "",
        new: ""
      },
      isPwd: true,
      passwordAgain: ""
    }
  },
  created() {
    getUserInfo().then(res => {
      this.userInfo = res.data.data
    })
  },
  methods: {
    toChange() {
      this.changePassword = true
      this.passwordAgain = ""
      this.pswdForm.new = this.pswdForm.old = ""
    },
    change() {
      this.$refs.passwordFrom.validate().then(success => {
        if (success) {
          changeUserPassword({
            id: this.userInfo.id,
            oldPassword: this.$md5(this.pswdForm.old),
            password: this.$md5(this.pswdForm.new),
          }).then(res => {
            if (res.data.code === 0) {
              this.changePassword = false
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
