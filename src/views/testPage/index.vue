<template>
  <div class="app-container">
    <common-form :form-options="testData" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import CommonTable from '@/components/Table/CommonTable.vue'
import CommonForm, { IFormItem } from './CommonForm.vue'

@Component({
  name: 'TextPage',
  components: {
    CommonForm,
  }
})

export default class extends Vue {
  private testData: IFormItem[] = [
    {
      type: 'input',
      key: 'name',
      label: '姓名',
      rules: [
        { required: true, message: '请输入活动名称', trigger: 'blur' },
        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
      ],
      random: 'text',
    },
    {
      type: 'time',
      key: 'time',
      label: '日期',
      rules: [
        { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
      ],
    },
    {
      type: 'dateRange',
      key: ['start', 'end'],
      label: '时间期限',
      rules: [
        { required: true, message: '请选择日期', trigger: 'change' }
      ],
    }
  ]

  // created() {
  // }

  // test() {
  // }
}
</script>

<style lang="scss">
.sortable-ghost {
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>

<style lang="scss" scoped>
.icon-star {
  margin-right: 2px;
}

.draggable-handler {
  cursor: pointer;
}

.show-d {
  margin-top: 15px;
}
</style>
