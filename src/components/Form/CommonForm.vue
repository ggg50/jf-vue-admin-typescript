<template>
  <el-form ref="form" :model="innerForm" label-width="80px" :rules="innerRules">
    <template v-for="(value, key) in innerForm">
      <el-form-item :key="key" :label="innerDict[key].label" :prop="key" :required="false">
        <el-col v-if="innerDict[key].type === 'input'" :span="24">
          <el-input v-model="innerForm[key]" />
        </el-col>

        <el-col v-else-if="innerDict[key].type === 'number'" :span="24">
          <el-input v-model="innerForm[key]" type="number" />
        </el-col>

        <el-col v-else-if="innerDict[key].type === 'textarea'" :span="24">
          <el-input v-model="innerForm[key]" type="textarea" />
        </el-col>

        <el-col v-else-if="innerDict[key].type === 'time'" :span="24">
          <el-time-picker v-model="innerForm[key]" style="width: 100%;" />
        </el-col>

        <el-col v-else-if="innerDict[key].type === 'date'" :span="24">
          <el-date-picker v-model="innerForm[key]" type="date" placeholder="选择日期" />
        </el-col>

        <template v-else-if="innerDict[key].type === 'dateRange'">
          <el-col :span="11">
            <el-date-picker v-model="innerForm[key][0]" type="date" placeholder="选择日期" style="width: 100%;" />
          </el-col>
          <el-col class="line" :span="2">
            -
          </el-col>
          <el-col :span="11">
            <el-date-picker v-model="innerForm[key][1]" type="date" placeholder="选择日期" style="width: 100%;" />
          </el-col>
        </template>

        <el-col v-else-if="innerDict[key].type === 'switch'" :span="24">
          <el-switch v-model="innerForm[key]" />
        </el-col>

        <el-col v-else-if="innerDict[key].type === 'checkbox'" :span="24">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="美食/餐厅线上活动" name="type" />
            <el-checkbox label="地推活动" name="type" />
            <el-checkbox label="线下主题活动" name="type" />
            <el-checkbox label="单纯品牌曝光" name="type" />
          </el-checkbox-group>
        </el-col>

        <el-col v-else-if="innerDict[key].type === 'radio'" :span="24">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="线上品牌商赞助" />
            <el-radio label="线下场地免费" />
          </el-radio-group>
        </el-col>
      </el-form-item>
    </template>
    <el-form-item />

    <el-form-item>
      <el-button type="primary" @click="onSubmit">
        立即创建
      </el-button>
      <el-button>取消</el-button>
      <el-button type="primary" @click="fillRandom">
        自动填充
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">

//! require relative validate, such as password

/*

# Form item options:
  key: key of item, if current item is range-type item (such as dateRange), it should be an array includes 'start' key and 'end' key, just like ['start', 'end']
  label: label
  type: item type
  format: use to custem data format, only for date, time, dateRange
  rules: item rules, view element-ui for more detail
  random: specify the random data type, if this property isn't present, there will be an 'intelligent' automatic detection ...
  randomFormat: extra args for random data generation, if required more than one args, value should be an array
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

  private innerForm: IObject = {}
  private innerDict: IObject = {}
  private innerRules: IRulesObject = {}
  private randomTypesReg = new RegExp(typesList.join('|'), 'i')
  resultForm: IObject = {} // the output data when submiting

  @Watch('innerForm', { deep: true, immediate: true })
  createOutputForm() {
    const _data: IObject = {}
    for (const key in this.innerForm) {
      const _options = this.innerDict[key]
      const _value = this.innerForm[key]
      if (/range/i.test(_options.type)) {
        // 'range' type get keys from innerDict
        _data[_options.key[0]] = _value[0] && moment(_value[0]).format(_options.format || 'YYYY-MM-DD')
        _data[_options.key[1]] = _value[1] && moment(_value[1]).format(_options.format || 'YYYY-MM-DD')
      } else if (/date/i.test(_options.type)) {
        _data[key] = _value && moment(_value).format(_options.format || 'YYYY-MM-DD')
      } else if (/time/i.test(_options.type)) {
        _data[key] = _value && moment(_value).format(_options.format || 'HH:mm:SS')
      } else {
        _data[key] = _value
      }
    }
    this.resultForm = _data

    console.log(JSON.stringify(this.innerForm, null, 2))
    console.log(JSON.stringify(this.resultForm, null, 2))
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
          _form[item.key[0]] = [null, null]
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
