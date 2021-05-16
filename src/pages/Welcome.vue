<template>
  <div class="q-pa-md column flex-center">
    <div class="work-area">
      <h3 class="welcome-title">
        <span>欢迎使用</span> <br>
        <span class="no-wrap">
          <span> Lorem</span>
          <span> Survey</span>
        </span>
        <span style="word-break: keep-all"> 调查问卷系统</span>
      </h3>
      <q-btn rounded push color="primary" size="15px" icon-right="arrow_forward" @click="routeTo('manage')">开始使用
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
  line-height: 60px;
  letter-spacing: 3px;
  max-width: 90vw;
  word-break: break-word;
}
</style>
