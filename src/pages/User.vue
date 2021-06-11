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
          <q-item-section side>-</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>手机号</q-item-section>
          <q-item-section side>-</q-item-section>
        </q-item>
        <q-item>
          <q-item-section>密码</q-item-section>

          <q-item-section side>
            <q-btn flat dense color="primary" onclick="alert('在写了在写了')">修改密码</q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "User",
  data() {
    return {}
  }, methods: {}
}
</script>

<style scoped>

</style>
