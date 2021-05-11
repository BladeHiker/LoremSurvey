<template>
  <div class="q-pa-md column flex-center">
    <div class="san-grail">
      <h4>欢迎使用 <br> <span class="no-wrap">LoremSurvey</span> 问卷系统</h4>
      <q-card>
        <q-card-section horizontal class="start-panel">
          <q-card-section class="col-6 column text-center">
            <q-card-section class="col-2">
              <div class="text-h5">新建问卷</div>
            </q-card-section>
            <q-card-section class="col-10 column flex-center">
              <q-btn label="立即创建" flat color="primary"></q-btn>
            </q-card-section>
          </q-card-section>
          <q-separator vertical/>
          <q-card-section class="col-6 column text-center">
            <q-card-section class="col-2">
              <div class="text-h5">已有问卷</div>
            </q-card-section>
            <q-card-section class="col-10 column flex-center flex-space children-margin">
              <q-input label="问卷ID" dense/>
              <q-input label="口令" type="password" dense/>
              <q-btn label="查看" color="secondary" flat></q-btn>
            </q-card-section>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Welcome"
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
</style>
