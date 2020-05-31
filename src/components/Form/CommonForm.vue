<template>
  <el-form ref="form" :model="innerForm" label-width="auto" :rules="innerRules" :inline="false">
    <el-row :gutter="90">
      <template v-for="(value, key) in innerForm">
        <el-col :key="key" :sm="smCol" :xl="xlCol">
          <el-form-item :key="key" :label="innerDict[key].label" :prop="key" :required="innerDict[key].required" :span="8">
            <el-input v-if="innerDict[key].type === 'input'" :key="key" v-model="innerForm[key]" style="width: 100%;" />

            <el-input v-else-if="innerDict[key].type === 'number'" v-model="innerForm[key]" type="number" />

            <el-input v-else-if="innerDict[key].type === 'textarea'" v-model="innerForm[key]" type="textarea" />

            <el-time-picker v-else-if="innerDict[key].type === 'time'" v-model="innerForm[key]" style="width: 100%;" />

            <el-date-picker v-else-if="innerDict[key].type === 'date'" v-model="innerForm[key]" type="date" placeholder="选择日期" />

            <el-date-picker
              v-else-if="innerDict[key].type === 'dateRange'"
              v-model="innerForm[key]"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 100%;"
            />

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
        </el-col>
      </template>
    </el-row>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">
        {{ submitText }}
      </el-button>
      <el-button v-if="enableCancel" @click="$emit('cancel')">
        取消
      </el-button>
      <el-button type="primary" @click="fillRandom">
        自动填充
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">

//! require relative validate, such as password

/*

cancel event

# usage

# attention

1. if item rules is present, item required property is set to true automatically, witch is the el-form's feature

# Form item options:
  key: key of item, if current item is range-type item (such as dateRange), it should be an array includes 'start' key and 'end' key, just like ['start', 'end']
  label: label
  type: item type
  format: use to custem data format, only for date, time, dateRange
  rules: item rules, view element-ui for more detail
  random: specify the random data type, if this property isn't present, there will be an 'intelligent' automatic detection ...
  randomFormat: extra args for random data generation, if required more than one args, value should be an array

# demo data

[
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
*/

import { Prop, Vue, Component, Watch } from 'vue-property-decorator'
import { generateRandom, typesList, RandomKey } from '@/utils/common/random'
import moment from 'moment'

type FormItemType = 'time' | 'date' | 'dateRange' | 'input'

export interface IFormItem {
  key: string | [string, string]
  label: string
  type: FormItemType
  format?: string
  rules?: any[]
  random?: RandomKey
  randomFormat?: any
  required?: boolean
}

interface IObject {
  [prop: string]: any
}

interface IRulesObject {
  [prop: string]: any[]
}

@Component({
  name: 'CommonForm'
})

export default class extends Vue {
  @Prop({ required: true }) formOptions!: IFormItem[]
  @Prop({ default: false }) enableCancel!: boolean
  @Prop({ default: '提交' }) submitText!: string
  @Prop({ default: false }) inline!: boolean

  private innerForm: IObject = {}
  private innerDict: IObject = {}
  private innerRules: IRulesObject = {}
  private randomTypesReg = new RegExp(typesList.join('|'), 'i')
  resultForm: IObject = {} // the output data when submiting

  get smCol() {
    return this.inline ? 8 : 24
  }

  get xlCol() {
    return this.inline ? 6 : 24
  }

  @Watch('innerForm', { deep: true, immediate: true })
  createOutputForm() {
    const _data: IObject = {}
    for (const key in this.innerForm) {
      const _options = this.innerDict[key]
      const _value = this.innerForm[key]
      if (/range/i.test(_options.type)) {
        // 'range' type get keys from innerDict
        _data[_options.key[0]] = _value && _value[0] && moment(_value[0]).format(_options.format || 'YYYY-MM-DD')
        _data[_options.key[1]] = _value && _value[1] && moment(_value[1]).format(_options.format || 'YYYY-MM-DD')
      } else if (/date/i.test(_options.type)) {
        _data[key] = _value && moment(_value).format(_options.format || 'YYYY-MM-DD')
      } else if (/time/i.test(_options.type)) {
        _data[key] = _value && moment(_value).format(_options.format || 'HH:mm:SS')
      } else {
        _data[key] = _value
      }
    }
    this.resultForm = _data
  }

  @Watch('formOptions', { deep: true, immediate: true })
  setInnerData() {
    const _form: IObject = {}
    const _dict: IObject = {}
    const _rules: IRulesObject = {}

    this.formOptions.forEach(item => {
      if (/range/i.test(item.type)) {
        if (item.key.length !== 2) {
          console.error(`${this.$options.name}: type ${item.type} required key property is an array with two string item `)
        } else {
          // item.key[0]: use one of the two keys
          _form[item.key[0]] = null
          _dict[item.key[0]] = item
          _rules[item.key[0]] = item.rules || []

          // add range-type item validator
          const _firstItem = _rules[item.key[0]] && _rules[item.key[0]][0]
          if (_firstItem) {
            _rules[item.key[0]][0] = {
              ..._firstItem,
              validator: this.rangeValidator(_firstItem.validator)
            }
          }
        }
      } else {
        _form[(item.key as string)] = /date|time/i.test(item.type) ? null : ''
        _dict[(item.key as string)] = item
        _rules[(item.key as string)] = item.rules || []
      }
    })

    this.innerForm = Object.assign({}, _form)
    this.innerDict = Object.assign({}, _dict)
    this.innerRules = Object.assign({}, _rules)
  }

  mounted() {
    this.$dp([
      {
        name: 'resultForm',
        routes: [this.$route.name || ''],
        tab: 3,
      }
    ], this)
  }

  fillRandom() {
    for (const key in this.innerForm) {
      this.innerForm[key] = Array.isArray(this.innerForm[key])
        ? this.innerForm[key].map(() => this.createRandom(key))
        : this.innerForm[key] = this.createRandom(key)
    }
  }

  // first check 'random' property, then 'type', then use 'text' directly
  createRandom(key: string) {
    const _item = this.innerDict[key]
    const _type: RandomKey = _item.random
      ? _item.random
      : this.randomTypesReg.test(_item.type)
        ? (this.randomTypesReg.exec(_item.type) as any)[0]
        : 'text'

    const _random = Array.isArray(_item.randomFormat)
      ? generateRandom(_type, ..._item.randomFormat)
      : generateRandom(_type, _item.randomFormat)

    return /date|time/i.test(_type)
      ? new Date(_random)
      : _random
  }

  // validator for range type item
  rangeValidator(validateFn?: Function) {
    function validator(rules: any, value: any, callback: any) {
      if (value === null) callback(new Error('请选择'))

      if (!Array.isArray(value)) {
        console.error('validator checking error, \'range\' type value required value is an array with two item ')
      }
      try {
        const [value1, value2] = value
        if (!value1 || !value2) callback(new Error('请选择'))
        if (validateFn) {
          validateFn(rules, value1, callback)
          validateFn(rules, value2, callback)
        }
      } catch (e) { console.log(e) }

      callback()
    }

    return validator
  }

  onSubmit() {
    (this.$refs.form as any).validate((valid: any) => {
      if (valid) {
        this.$emit('submt', this.resultForm)
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.line {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
