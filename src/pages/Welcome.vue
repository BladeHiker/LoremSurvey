<template>
  <div class="q-pa-md column flex-center">
    <div class="work-area">
      <h3 class="welcome-title">欢迎使用 <br> <span class="no-wrap">LoremSurvey</span> <span style="word-break: keep-all">调查问卷系统</span></h3>
      <q-btn rounded push color="primary" size="15px" icon-right="arrow_forward" @click="routeTo('manage')">开始使用
      </q-btn>

      <!--      <q-card>-->
      <!--        <q-card-section horizontal class="start-panel">-->
      <!--          <q-card-section class="col-6 column text-center">-->
      <!--            <q-card-section class="col-2">-->
      <!--              <div class="text-h5">注册</div>-->
      <!--            </q-card-section>-->
      <!--            <q-card-section class="col-10 column flex-center">-->
      <!--              <div>无需注册，即可使用</div>-->
      <!--              <br/>-->
      <!--              <q-btn label="立即创建" flat color="primary"></q-btn>-->
      <!--            </q-card-section>-->
      <!--          </q-card-section>-->
      <!--          <q-separator vertical/>-->
      <!--          <q-card-section class="col-6 column text-center">-->
      <!--            <q-card-section class="col-2">-->
      <!--              <div class="text-h5">已有问卷</div>-->
      <!--            </q-card-section>-->
      <!--            <q-card-section class="col-10 column flex-center flex-space children-margin">-->
      <!--              <q-form autocorrect="off"-->
      <!--                      autocapitalize="off"-->
      <!--                      autocomplete="off"-->
      <!--                      spellcheck="false">-->
      <!--                <q-input label="问卷ID" dense value=""/>-->
      <!--                <q-input label="口令" type="password" dense value=""/>-->
      <!--                <q-btn type="submit" label="查看" color="secondary" flat></q-btn>-->
      <!--              </q-form>-->
      <!--            </q-card-section>-->
      <!--          </q-card-section>-->
      <!--        </q-card-section>-->
      <!--      </q-card>-->
    </div>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  data() {
    return {}
  },
  methods: {
    routeTo(url) {
      this.$router.push(url)
    }
  }
}
</script>

<style scoped>

.flex-space {
  justify-content: space-around;
}

.start-panel {
  height: 250px;
}

.children-margin * {
  margin: 5px 0;
}

.welcome-title{
  line-height: 60px;
  letter-spacing: 05px;
}
</style>
