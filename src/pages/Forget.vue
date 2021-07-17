<template>
  <q-page class="flex row justify-center">
    <div class="san-grail q-pa-md">
      <q-stepper
        v-model="step"
        ref="stepper"
        color="primary"
        animated
      >
        <q-step
          :name="1"
          title="身份验证"
          icon="verified_user"
          :done="step > 1"
        >
          <q-form class="flex column" ref="emailVerify">
            <q-input
              label="邮箱"
              v-model="verifyForm.email"
              maxlength="50"
              lazy-rules
              @keydown.enter.prevent
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
              label="验证码"
              v-model="verifyForm.captcha.code"
              maxlength="20"
              lazy-rules
              :rules="[ val => val && val.length > 0 || '请输入验证码']"
              @keydown.enter.prevent
            >
              <template v-slot:prepend>
                <q-icon name="how_to_reg"></q-icon>
              </template>
              <template v-slot:after>
                <q-img style="cursor: pointer" @click="getCaptchaData" :src="'data:image/png;base64,'+captchaImg"
                       width="100px" height="50px">
                </q-img>
              </template>
            </q-input>
            <q-btn @click="verifyEmail" color="primary" label="继续"/>
          </q-form>
        </q-step>

        <q-step
          :name="2"
          title="更改密码"
          icon="manage_accounts"
          :done="step > 2"
        >
          <q-form class="flex column" ref="codeVerify">
            <div>我们向您的邮箱中发送了验证码，请在下方填写：</div>
            <q-input label="邮箱验证码" type="text" mask="######"
                     v-model="verifyCodeFrom.emailCode"
                     lazy-rules
                     @keydown.enter.prevent
                     :rules="[val => val && val.length > 0 || '请输入验证码',]"/>
            <q-btn @click="verifyCode" color="primary" label="继续"/>
          </q-form>

        </q-step>

        <q-step
          :name="3"
          title="完成"
          icon="check_circle"
          :done="step === 3"
        >
          <q-form class="flex column" ref="changeFrom">
            <q-input
              label="密码"
              name="password"
              v-model="verifyCodeFrom.password"
              maxlength="20"
              autocomplete="new-password"
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
              :rules="[ val => val===verifyCodeFrom.password || '两次输入不一致']"
            >
              <template v-slot:prepend>
                <q-icon name="lock"></q-icon>
              </template>
            </q-input>
            <q-btn @click="changePassword"
                   :label="submitted===1?'修改成功!': '修改密码'"
                   :color="submitted===1?'secondary': 'primary'"
                   :disable="submitted!==0"
                   :loading="submitted===-1"/>
          </q-form>
        </q-step>

        <!--        <template v-slot:navigation>-->
        <!--          <q-stepper-navigation>-->
        <!--            <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 3 ? '完成' : '继续'"/>-->
        <!--            <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="后退" class="q-ml-sm"/>-->
        <!--          </q-stepper-navigation>-->
        <!--        </template>-->
      </q-stepper>
    </div>
  </q-page>
</template>

<script>
import {changePasswordByEmail, getCaptcha, sendEmailCode} from "src/api/api";

export default {
  name: "Forget",
  data() {
    return {
      step: 1,
      isPwd: true,
      verifyForm: {
        email: "",
        captcha: {
          code: "",
          id: ""
        }
      },
      passwordAgain: "",
      verifyCodeFrom: {
        emailCode: "",
        password: ""
      },
      captchaImg: "",
      submitted: 0
    }
  },
  created() {
    this.getCaptchaData()
  },
  methods: {
    getCaptchaData() {
      getCaptcha().then(res => {
        this.verifyForm.captcha.code = ""
        this.verifyForm.captcha.id = res.data.data.id
        this.captchaImg = res.data.data.base64Data
      })
    },
    verifyEmail() {
      this.$refs.emailVerify.validate().then(success => {
        if (success) {
          sendEmailCode(this.verifyForm).then(res => {
            console.log(res)
            if (res.data.code === 0) {
              this.$refs.stepper.next()
            }
          })
        }
      })
    },
    verifyCode() {
      this.$refs.codeVerify.validate().then(success => {
        if (success) {
          changePasswordByEmail({emailCode: this.verifyCodeFrom.emailCode}).then(res => {
            console.log(res)
            if (res.data.code === 0) {
              this.$refs.stepper.next()
            }
          })
        }
      })
    },
    changePassword() {
      this.submitted = -1
      this.$refs.changeFrom.validate().then(success => {
        if (success) {
          changePasswordByEmail({
            emailCode: this.verifyCodeFrom.emailCode,
            password: this.$md5(this.verifyCodeFrom.password)
          }).then(res => {
            console.log(res)
            if (res.data.code === 0) {
              this.submitted = 1
              setTimeout(this.toLogin, 1500)
            } else {
              this.submitted = 0
            }
          })
        }
        this.submitted = 0
      })
    },
    toLogin() {
      this.$router.push('login')
    },
  }
}
</script>

<style scoped>

</style>
