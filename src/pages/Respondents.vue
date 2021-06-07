<template>
  <q-page class="flex justify-center">
    <div class="work-area">
      <div class="manager-header">
        <div class="text-h3">
          受访者管理
        </div>
        <q-separator color="black"></q-separator>
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
        >
          <template v-slot:top-right>
            <div class="flex row">
              <q-btn color="primary" @click="upload=true">上传
              </q-btn>
              <q-space style="width: 10px"/>
              <q-btn color="red" :disable="selected.length===0" @click="onDel">删除
                {{ selected.length > 0 ? selected.length + " 人" : "" }}
              </q-btn>
            </div>
          </template>
        </q-table>
      </div>
      <q-dialog v-model="upload" @hide="getData">
        <q-card class="q-pa-sm bg-grey-2">
          <q-card-section>
            <div class="text-h6">上传受访者名单(.XLS/.XLSX)</div>
          </q-card-section>
          <q-separator/>
          <q-card-section>
            <q-uploader
              :url="URL"
              accept=".xls,.xlsx"
              max-files="1"
              bordered
            />
          </q-card-section>
        </q-card>
      </q-dialog>

    </div>
  </q-page>
</template>

<script>
import {URL_Prefix} from "src/utils/request";
import {deleteRespondents, getRespondentList} from "src/api/respondent";

export default {
  name: "Respondents",
  data() {
    return {
      selected: [],
      upload: false,
      columns: [
        {
          name: 'id',
          required: true,
          label: '学号/工号',
          field: 'id',
          sortable: true
        },
        {name: 'name', label: '姓名', field: 'name', sortable: true},
        {name: 'school', label: '学校', field: 'school', sortable: true},
        {name: 'sex', label: '性别', field: 'sex'},
        {name: 'phone', label: '手机号', field: 'phone'},
        {name: 'email', label: '邮箱', field: 'email'},
      ],
      data: [],
      URL: '/api/question/respondents'
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getRespondentList().then(res => {
        this.data = res.data.data
      })
    },
    getSelectedString() {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.data.length}`
    },
    onDel() {
      let delList = []
      for (let i = 0; i < this.selected.length; i++) {
        delList.push(this.selected[i].id)
      }
      deleteRespondents(delList).then(() => {
        this.getData()
      })
    }
  }
}
</script>

<style scoped>

</style>
