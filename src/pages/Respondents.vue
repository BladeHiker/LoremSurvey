<template>
  <q-page class="flex justify-center">
    <div class="work-area">
      <div class="manager-header">
        <div class="text-h3">
          受访者管理
        </div>
        <q-separator color="black"></q-separator>
        <div class="main-btn-group">
          <q-btn flat color="primary" icon-right="arrow_forward">
            导入受访者列表
          </q-btn>
        </div>
      </div>
      <div class="q-pa-md">
        <q-table
          title="受访者"
          :data="data"
          :columns="columns"
          row-key="name"
          :selected-rows-label="getSelectedString"
          selection="multiple"
          :selected.sync="selected"
        />
      </div>
      <q-uploader
        url="http://192.168.236.95:8000/app_01/receivefile/"
        accept=".xls,.xlsx"
        max-files="1"
      />
    </div>
  </q-page>
</template>

<script>
export default {
  name: "Respondents",
  data() {
    return {
      selected: [],
      columns: [
        {
          name: 'id',
          required: true,
          label: '学号/工号',
          align: 'left',
          field: 'id',
          sortable: true
        },
        {name: 'name', label: '姓名', field: 'name', sortable: true},
        {name: 'fat', label: '学校', field: 'school', sortable: true},
        {name: 'carbs', label: '学院', field: 'major'},
        {name: 'protein', label: '性别', field: 'protein'},
        {name: 'sodium', label: '手机号', field: 'sodium'},
        {name: 'sodium', label: '邮箱', field: 'sodium'},
      ],
      data: [
        {}
      ]
    }
  },
  methods: {
    getSelectedString() {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.data.length}`
    }
  }
}
</script>

<style scoped>

</style>
