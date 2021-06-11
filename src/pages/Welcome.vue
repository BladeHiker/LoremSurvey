<template>
  <div class="flex column flex-center home-bg">
    <div class="q-pa-lg text-center">
      <div class="no-wrap welcome-title">
        <span>Lorem</span>
        <span>Survey</span>
      </div>
      <hr style="border-color: #ffffff"/>
      <br/>
      <div class="text-h5 text-white" style="word-break: keep-all">
        简单易用的高校调查问卷系统
      </div>
      <br/>
      <br/>
      <q-btn
        stretch size="15px" outline
        class="q-px-lg q-py-sm text-white"
        icon-right="arrow_forward" @click="routeTo('manage')">开 始 使 用
      </q-btn>
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
.home-bg {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-image: url("https://i.loli.net/2021/06/10/FmDtHWlydAKvZNJ.png");
  background-color: #009FEE;
  text-shadow: 3px 3px 10px rgba(51, 51, 51, 0.6);
}

.flex-space {
  justify-content: space-around;
}

.start-panel {
  height: 250px;
}

.children-margin * {
  margin: 5px 0;
}

.welcome-title {
  color: #ffffff;
  font-size: min(13vw, 150px);
  letter-spacing: 3px;
  font-weight: lighter;
  max-width: 90vw;
  word-break: break-word;
}
</style>
