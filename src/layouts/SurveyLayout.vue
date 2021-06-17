<template>
  <q-layout view="lHh Lpr lFf">
<!--    <q-header elevated>-->
<!--      <q-toolbar>-->

<!--        <q-toolbar-title>-->
<!--          LoremSurvey-->
<!--        </q-toolbar-title>-->

<!--        <div>v0.1a</div>-->
<!--      </q-toolbar>-->
<!--    </q-header>-->

    <q-page-container class="column content-center main-bg">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  data() {
    return {}
  }
}
</script>
<style scoped>
.main-bg {
  background-color: #F2F5FD;
  overflow: hidden;
}
</style>
