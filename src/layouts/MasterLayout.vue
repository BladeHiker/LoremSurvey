<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          LoremSurvey
        </q-toolbar-title>

        <div>v0.1a</div>
      </q-toolbar>
    </q-header>

    <q-page-container class="column">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MasterLayout',
  data() {
    return {}
  }
}
</script>
<style scoped>
</style>
