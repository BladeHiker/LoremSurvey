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
          <q-form class="flex column">
            <q-input
              label="邮箱"
              v-model="verifyForm.email"
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
              label="验证码"
              v-model="verifyForm.captcha.code"
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
                </q-img>
              </template>
            </q-input>
            <q-btn @click="$refs.stepper.next()" color="primary" label="继续" type="submit"/>
          </q-form>
        </q-step>

        <q-step
          :name="2"
          title="更改密码"
          icon="manage_accounts"
          :done="step > 2"
        >
          <q-input label="验证码" type="text" mask="######"/>
        </q-step>

        <q-step
          :name="3"
          title="完成"
          icon="check_circle"
          :done="step === 3"
        >
          This step won't show up because it is disabled.
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
import {getCaptcha} from "src/api/api";

export default {
  name: "Forget",
  data() {
    return {
      step: 1,
      verifyForm: {
        email: "",
        captcha: {
          code: "",
          id: ""
        }
      },
      captchaImg: ""
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
  }
}
</script>

<style scoped>

</style>
