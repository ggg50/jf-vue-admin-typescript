<template>
  <el-form ref="form" :model="innerForm" label-width="80px" :rules="innerRules">
    <template v-for="(value, key) in innerForm">
      <el-form-item :key="key" :label="innerDict[key].label" :prop="key">
        <el-input v-if="innerDict[key].type === 'input'" v-model="innerForm[key]" />

        <el-input v-if="innerDict[key].type === 'number'" v-model="innerForm[key]" type="textarea" />

        <el-input v-if="innerDict[key].type === 'textarea'" v-model="innerForm[key]" type="textarea" />

        <el-col v-else-if="innerDict[key].type === 'date'" :span="24">
          <el-time-picker v-model="innerForm[key]" style="width: 100%;" />
        </el-col>

        <template v-else-if="innerDict[key].type === 'dateRange'">
          <el-col :span="11">
            <el-time-picker v-model="innerForm[key]" style="width: 100%;" />
          </el-col>
          <el-col class="line" :span="2">
            -
          </el-col>
          <el-col :span="11">
            <el-time-picker v-model="innerForm[key]" style="width: 100%;" />
          </el-col>
        </template>
        <el-switch v-else-if="innerDict[key].type === 'switch'" v-model="innerForm[key]" />

        <el-checkbox-group v-else-if="innerDict[key].type === 'checkbox'" v-model="ruleForm.type">
          <el-checkbox label="美食/餐厅线上活动" name="type" />
          <el-checkbox label="地推活动" name="type" />
          <el-checkbox label="线下主题活动" name="type" />
          <el-checkbox label="单纯品牌曝光" name="type" />
        </el-checkbox-group>

        <el-radio-group v-else-if="innerDict[key].type === 'radio'" v-model="ruleForm.resource">
          <el-radio label="线上品牌商赞助" />
          <el-radio label="线下场地免费" />
        </el-radio-group>
      </el-form-item>
    </template>
    <el-form-item />

    <el-form-item>
      <el-button type="primary" @click="onSubmit">
        立即创建
      </el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Prop, Vue, Component, Watch } from 'vue-property-decorator'
import { IFilterKey, getGlobalFilter } from '@/utils/filtersDict'

interface IFormItem {
  key: string
  label: string
  type: string
  rules?: any[]
}
interface IObject {
  [prop: string]: any
}

@Component({
  name: 'CommonForm'
})

export default class extends Vue {
  @Prop({ required: true }) formOptions!: IFormItem[]

  private innerForm: IObject = {}
  private innerDict: IObject = {}
  private innerRules: IObject /* todo */ = {}

  @Watch('formOptions', { deep: true, immediate: true })
  setSearchParams() {
    const _form: IObject = {}
    const _dict: IObject = {}
    const _rules: IObject = {}
    this.formOptions.forEach(item => {
    // if (item.type === 'dateRange') {
    //   this.innerForm[item.key[0]] = [undefined, undefined] // dateRange 的 key 直接取其中一个，请求参数的唯一的，不用怕跟其它重复
    //   this.dict[item.key[0]] = { ...item, rawKey: item.key } // rawKey 是原本的 key list, 可以用来获取参数名
    // } else {

      _form[item.key] = item.type === 'date' ? undefined : ''
      _dict[item.key] = item
      _rules[item.key] = item.rules || []
    })

    this.innerForm = Object.assign({}, _form)
    this.innerDict = Object.assign({}, _dict)
    this.innerRules = Object.assign({}, _rules)
  }

  @Watch('innerForm', { deep: true })
  abc() {
    console.log(JSON.stringify(this.innerForm, null, 2))
  }

  onSubmit() {
    console.log('submit!')
  }
}
</script>

<style lang="scss" scoped>
// .line {
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }
</style>
