<template>
  <div class="flex column flex-center home-bg column content-center">
    <div class="q-pa-lg text-center q-my-lg flex flex-center" style="height: 100vh">
      <div>
        <img
          alt="LoremSurvey"
          src="~assets/text-logo.svg"
          class="logo-img"
          style="width: min(80vw , 800px)"
        >
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
        <q-space style="height: 20vh"/>
        <q-icon name="expand_more" class="up-down-ani" size="50px" color="white"/>
      </div>
    </div>
    <div class="q-pa-lg full-width" style="background-color: #2c3e5080;">
      <q-timeline color="white" dark>
        <q-timeline-entry heading>
          开发进度
        </q-timeline-entry>

        <q-timeline-entry
          title="V2.5"
          subtitle="2021年6月19日"
        >
          <div>
            更新迭代
            <ul>
              <li>新增：多选题</li>
              <li>界面：更新题目修改界面、答题界面</li>
            </ul>
          </div>
        </q-timeline-entry>
        <q-timeline-entry
          title="V2.4"
          subtitle="2021年6月17日"
        >
          <div>
            更新迭代
            <ul>
              <li>新增：修改密码、忘记密码</li>
              <li>界面：答题界面微调</li>
            </ul>
          </div>
        </q-timeline-entry>
        <q-timeline-entry
          title="V2.3"
          subtitle="2021年6月15日"
        >
          <div>
            功能状态
            <ul>
              <li>可以进行正常的出卷，答题，发送私密链接，统计数据</li>
              <li>用户模块尚未完成密码修改</li>
              <li>问卷模块未完成问卷协同编辑，查看具体是谁答的问卷</li>
            </ul>
            更新迭代
            <ul>
              <li>用户界面更新：主页添加时间线、布局优化、细节调整</li>
              <li>开放问卷逻辑优化</li>
              <li>添加Logo</li>
            </ul>
          </div>
        </q-timeline-entry>

        <q-timeline-entry
          title="..."
        >
          <div>
          </div>
        </q-timeline-entry>
        <q-timeline-entry
          title="V1.0"
          subtitle="2021年5月25日"
          icon="flag"
          color="green"
        >
          <div>
            Release V1.0
          </div>
        </q-timeline-entry>
        <q-timeline-entry
          title="..."
        >
          <div>
          </div>
        </q-timeline-entry>
        <q-timeline-entry
          title="Hello World"
          subtitle="2021年5月8日"
          icon="play_arrow"
          color="green"
        >
          <div>
            项目开发开始
          </div>
        </q-timeline-entry>
      </q-timeline>
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
  /*width: 100vw;*/
  /*height: 100vh;*/
  overflow: hidden;
  background-image: url("https://i.loli.net/2021/06/10/FmDtHWlydAKvZNJ.png");
  background-color: #009FEE;
  background-attachment: fixed;
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

.up-down-ani {
  animation: down 3s ease infinite;
}

@keyframes down {

  0%,
  100% {
    transform: translateY(0);
    opacity: 1;
  }

  50% {
    transform: translateY(5vh);
    opacity: 0.5;
  }
}
</style>
