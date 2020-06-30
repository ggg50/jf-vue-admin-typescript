<template>
  <el-form ref="form"
           class="form"
           :model="innerForm"
           label-width="auto"
           :rules="readonly ? [] : innerRules"
           :inline="false"
  >
    <el-row :gutter="50">
      <template v-for="(_, key, index) in innerForm">
        <el-col v-if="showAll || index < showNumber" :key="key" :sm="smCol" :xl="xlCol" class="formItemWrapper">
          <el-form-item :key="key" :label="innerDict[key].label" :prop="key">
            <slot :name="key">
              <el-input v-if="innerDict[key].type === 'input'"
                        :key="key"
                        v-model="innerForm[key]"
                        style="width: 100%;"
                        :placeholder="innerDict[key].placeholder || `请输入${innerDict[key].label}`"
                        :readonly="readonly"
              />

              <el-input v-else-if="innerDict[key].type === 'number'" v-model="innerForm[key]" type="number" :placeholder="innerDict[key].placeholder || `请输入${innerDict[key].label}`" :readonly="readonly" />

              <el-input v-else-if="innerDict[key].type === 'textarea'" v-model="innerForm[key]" type="textarea" :placeholder="innerDict[key].placeholder || `请输入${innerDict[key].label}`" :readonly="readonly" />

              <el-time-picker v-else-if="innerDict[key].type === 'time'" v-model="innerForm[key]" style="width: 100%;" :placeholder="innerDict[key].placeholder || `请输入${innerDict[key].label}`" :readonly="readonly" />

              <el-date-picker v-else-if="innerDict[key].type === 'date'"
                              v-model="innerForm[key]"
                              style="width: 100%;"
                              type="date"
                              placeholder="选择日期"
                              :readonly="readonly"
              />

              <el-date-picker v-else-if="innerDict[key].type === 'dateRange'"
                              v-model="innerForm[key]"
                              type="daterange"
                              range-separator="-"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              style="width: 100%;"
                              :readonly="readonly"
              />

              <el-time-picker v-else-if="innerDict[key].type === 'timeRange'"
                              v-model="innerForm[key]"
                              is-range
                              style="width: 100%;"
                              range-separator="-"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              :readonly="readonly"
              />

              <el-select v-else-if="innerDict[key].type === 'select'" v-model="innerForm[key]" style="width: 100%;" :placeholder="innerDict[key].placeholder || `请选择${innerDict[key].label}`" :readonly="readonly">
                <template v-for="item in innerDict[key].keyList">
                  <el-option :key="item" :label="innerDict[key].valueList[index]" :value="item" />
                </template>
              </el-select>

              <el-switch v-else-if="innerDict[key].type === 'switch'" v-model="innerForm[key]" style="width: 100%;" :readonly="readonly" />

              <el-checkbox-group v-else-if="innerDict[key].type === 'checkbox'" v-model="innerForm[key]" style="width: 100%;" :readonly="readonly">
                <template v-for="item in innerDict[key].keyList">
                  <el-checkbox :key="item" :label="innerDict[key].valueList[index]" :name="item" />
                </template>
              </el-checkbox-group>

              <el-radio-group v-else-if="innerDict[key].type === 'radio'" v-model="innerForm[key]" style="width: 100%;" :readonly="readonly">
                <template v-for="item in innerDict[key].keyList">
                  <el-radio :key="item" :label="item">
                    {{ innerDict[key].valueList[index] }}
                  </el-radio>
                </template>
              </el-radio-group>
            </slot>
          </el-form-item>
        </el-col>
      </template>

      <div v-if="enableDefaultButton && formOptions.length !== 0" class="buttonWrapper" :class="buttonPosition">
        <el-button type="primary" @click="onSubmit">
          {{ submitText }}
        </el-button>
        <el-button v-if="enableClear" @click="onClear">
          清空
        </el-button>
        <el-button v-if="enableCancel" @click="$emit('cancel')">
          取消
        </el-button>
        <el-button v-if="!$isProduction" type="primary" @click="fillRandom">
          自动填充
        </el-button>

        <slot name="afterButton" />
        <span v-if="itemsCount > showNumber" class="text" @click.stop="showToggle">
          {{ showAll ? '收起' : '展开' }}
          <i v-if="showAll" class="el-icon-arrow-up" />
          <i v-else class="el-icon-arrow-down" />
        </span>
      </div>
    </el-row>
    <slot />
  </el-form>
</template>

<script lang="ts">

/*

cancel event

# version

1.0.4

# usage
|property           |type      |value     |default     |required  |description

|formOptions        |prop      |Object    |-           |required  |form item options
|enableCancel       |prop      |Boolean   |false       |-         |whether cancel button show or not
|submitText         |prop      |String    |'提交'        |-         |-
|inline             |prop      |Boolean   |false       |-         |form item display inline first
|enableClear        |prop      |Boolean   |false       |-         |whether clear button show or not
|buttonPosition     |prop      |String    |'left'      |-         |foot button position: 'left', 'center', 'right'
|showNumber         |prop      |number    |999         |-         |how many item show default when item count too many
|enableDefaultButton|prop      |Boolean   |true        |-         |whether button show or not
|submit             |event     |-         |(resultData)|-         |form content as outside expect
|clear              |event     |-         |-           |-         |event when form clear
|change             |event     |-         |(resultData)|-         |trigger when data change
|default            |slot      |-         |-           |-         |insert something under the foot buttons
|beforeButton       |slot      |-         |-           |-         |insert something before foot buttons
|afterButton        |slot      |-         |-           |-         |insert something after foot buttons

# attention

1. If item rules is present, item required property is set to true automatically, witch is the el-form's feature;

2. Use v-if to toggle item showing to avoid el-item's unexpect item width bug when page switching with one item's v-show was set to false;

3. If one default time value is a timestamp, it should be type of number instead of string;

4. you can directly use el-form's methods, just like this in parent components:
  this.$refs.myForm.validate()

# Form item options:
  key: key of item, if current item is range-type item (such as dateRange), it should be an array includes 'start' key and 'end' key, just like ['start', 'end']
  label: label
  type: item type
  format: use to custem data format, only for date, time, dateRange
  rules: item rules, view element-ui for more detail
  random: specify the random data type, if this property isn't present, there will be an 'intelligent' automatic detection ...
  randomFormat: extra args for random data generation, if required more than one args, value should be an array

# update

1. custem inline style; default slot ---- 2020-05-31 15:32:09
2. enable clear form data ---- 2020-06-01 15:56:33
3. 'buttonPosition' to change button's position ---- 2020-06-02 23:32:37
4. every form-item has a name slot ---- 2020-06-03 08:31:13
5. 'clear' event ---- 2020-06-04 12:02:26
6. form readonly; enable item value ---- 2020-06-10 12:28:35
7. 'change' event ---- 2020-06-13 18:32:24
8. hide default buttons when form options list length equal to 0 ---- 2020-06-24 11:14:43

# demo data

[
  {
    type: 'input',
    key: 'name',
    label: '姓名',
    value: '张三',
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
    value: '2020-03-12',
    rules: [
      { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
    ],
  },
  {
    type: 'dateRange', //or 'timeRange'
    key: ['start', 'end'],
    value: ['2020-03-12', '2020-03-12']
    label: '时间期限',
    rules: [
      { required: true, message: '请选择日期', trigger: 'change' }
    ],
  },
]

# raw
formOptions|prop|Object|-|required|form item options
enableCancel|prop|Boolean|false|-|whether cancel button show or not
submitText|prop|String|'提交'|-|-
inline|prop|Boolean|false|-|form item display inline first
enableClear|prop|Boolean|false|-|whether clear button show or not
buttonPosition|prop|String|'left'|-| foot button position: 'left', 'center', 'right'
showNumber|prop|number|999|-|how many item show default when item count too many
enableDefaultButton|prop|Boolean|true|-| whether button show or not
submit|event|-|(resultData)|-|form content as outside expect
clear|event|-|-|-|event when form clear
change|event|-|(resultData)|-|trigger when data change
default|slot|-|-|-|insert something under the foot buttons
beforeButton|slot|-|-|-| insert something before foot buttons
afterButton|slot|-|-|-| insert something after foot buttons

*/

import { Prop, Vue, Component, Watch } from 'vue-property-decorator'
// { generateRandom, typesList, RandomKey }👇
import * as $cr from '../../utils/common/random'
import moment from 'moment'

type FormItemType = 'time' | 'timeRange' | 'date' | 'dateRange' | 'input' | 'switch' | 'select' | 'radio' | 'checkbox'

export interface IFormItem {
  key: string | [string, string]
  value?: any
  label: string
  type: FormItemType
  format?: string
  rules?: any[]
  random?: $cr.RandomKey
  randomFormat?: any
  required?: boolean
  keyList?: string[] // select, radio
  valueList?: string[]
}

interface IObject {
  [prop: string]: any
}

interface IRulesObject {
  [prop: string]: any[]
}

type Position = 'left' | 'center' | 'right' | 'inline'

@Component({
  name: 'CommonForm'
})

export default class extends Vue {
  @Prop({ required: true }) formOptions!: IFormItem[]
  @Prop({ default: false }) enableCancel!: boolean
  @Prop({ default: '提交' }) submitText!: string
  @Prop({ default: false }) inline!: boolean
  @Prop({ default: false }) enableClear!: boolean
  @Prop({ default: 'right' }) buttonPosition!: Position
  @Prop({ default: true }) enableDefaultButton!: boolean
  @Prop({ default: 999 }) showNumber!: number
  @Prop({ default: false }) readonly !: boolean

  private innerForm: IObject = {}
  private innerDict: IObject = {}
  private innerRules: IRulesObject = {}
  private randomTypesReg = new RegExp($cr.typesList.join('|'), 'i')
  private showAll = false
  resultData: IObject = {} // the output data when submiting

  get itemsCount() {
    return this.formOptions.length
  }

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
        if (/date/i.test(_options.type)) {
          _data[_options.key[0]] = _value && _value[0] && moment(_value[0]).format(_options.format || 'YYYY-MM-DD')
          _data[_options.key[1]] = _value && _value[1] && moment(_value[1]).format(_options.format || 'YYYY-MM-DD')
        } else {
          _data[_options.key[0]] = _value && _value[0] && moment(_value[0]).format(_options.format || 'HH:mm:SS')
          _data[_options.key[1]] = _value && _value[1] && moment(_value[1]).format(_options.format || 'HH:mm:SS')
        }
      } else if (/date/i.test(_options.type)) {
        _data[key] = _value && moment(_value).format(_options.format || 'YYYY-MM-DD')
      } else if (/time/i.test(_options.type)) {
        _data[key] = _value && moment(_value).format(_options.format || 'HH:mm:SS')
      } else {
        _data[key] = _value
      }
    }
    this.resultData = _data
    this.$emit('change', this.resultData)
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
          let _value
          if (item.value) {
            _value = item.value.map(this.translateToValideTime)
          }

          _form[item.key[0]] = _value || null
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
        _form[(item.key as string)] = item.value
          ? /date|time/i.test(item.type)
            ? this.translateToValideTime(item.value)
            : item.value
          : /date|time/i.test(item.type)
            ? null
            : item.type === 'switch'
              ? false
              : item.type === 'checkbox'
                ? []
                : ''
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
        name: 'resultData',
        routes: [this.$route.name || ''],
        tab: 3,
      }
    ], this)
  }

  onClear() {
    (this.$refs.form as any).resetFields()
    this.$emit('clear')
  }

  fillRandom() {
    for (const key in this.innerForm) {
      this.innerForm[key] = /range/i.test(this.innerDict[key].type)
        ? this.innerForm[key] = [this.createRandom(key), this.createRandom(key)]
        : this.innerForm[key] = this.createRandom(key)
    }
  }

  // first check 'random' property, then 'type', then use 'text' directly
  createRandom(key: string) {
    const _item = this.innerDict[key]
    if (_item.type === 'switch') return true

    const _type: $cr.RandomKey = _item.random
      ? _item.random
      : this.randomTypesReg.test(_item.type)
        ? (this.randomTypesReg.exec(_item.type) as any)[0]
        : 'text'

    const _random = Array.isArray(_item.randomFormat)
      ? $cr.generateRandom(_type, ..._item.randomFormat)
      : $cr.generateRandom(_type, _item.randomFormat)

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
        this.$emit('submit', this.resultData)
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  showToggle() {
    this.showAll = !this.showAll
  }

  checkTimeValidity(value: any): boolean {
    return moment(value).isValid()
  }

  translateToValideTime(value: any): any {
    return this.checkTimeValidity(value)
      ? value
      : this.checkTimeValidity(moment(Date.now()).format('YYYY-MM-DD') + ' ' + value)
        ? moment(Date.now()).format('YYYY-MM-DD') + ' ' + value
        : null
  }
}
</script>

<style lang="scss" scoped>
.line {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-form-item {
  margin-bottom: 22px;
  height: 36px;

  &.footerWrapper {
    height: auto;
  }
}

.buttonWrapper {
  margin-bottom: 22px;
  padding: 0 20px;
  min-width: 20%;
  display: flex;
  align-items: center;

  & .text {
    color: $themeBlue;
    font-weight: bold;
    cursor: pointer;
  }

  &.left {
    justify-content: flex-start;
  }
  &.center {
    justify-content: center;
  }
  &.right {
    justify-content: flex-end;
  }
}

// global scss buttonWrapper

</style>
