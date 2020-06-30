<template>
  <el-table :data="innerTableData"
            style="width: 100%"
            v-bind="$attrs"
            v-on="$listeners"
            @selection-change="handleSelectionChange"
  >
    <el-table-column
      v-if="enableSelection"
      type="selection"
      width="55"
    />
    <el-table-column
      v-if="hasIndex"
      type="index"
      width="50"
    />
    <template v-for="(item, index) in innerColumnKeys">
      <!-- eslint-disable -->
      <el-table-column
        :key="item.title + index"
        :label="item.title"
        :[widthType]="item.width ? item.width : 'auto'"
        v-bind="item.attrOptions || {}"
      >
      <!-- eslint-enable -->
        <template #default="{row}">
          <slot :name="item.key" :row="row" :rawRow="getRawData[item]">
            <span>{{ row[item.key] }}</span>
          </slot>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script lang="ts">
/*

-description
-usage
-usage-addvence
-awesome
  -el-table prop & event
  -filterDict usage
-disadvantage
-demo data

简单说：
-可以引用全局过滤器自动处理数据
-可以采用最简洁的模板定制表头并控制表单内容顺序
-实在不开心，还可以用命名插槽自己搞事情

# version

1.0.2

# description
a common table component for 'lazy' developer table-building quickly

# usage
|property       |type      |value        |default   |required  |description

|hasIndex       |prop      |Boolean      |true      |-         |whether index show or not
|columnsList    |prop      |Array        |-         |required  |message of table header, read more in addvence-usage
|tableData      |prop      |Array        |-         |required  |array of table data, read more in addvence-usage
|distributeWidth|prop      |Boolean      |true      |-         |whether table auto distribute the space in proportion（是否平均分配剩余空白）
|slots          |slot      |{row, rawRow}|-         |-         |every column have a slot with name equal to it's column key

# usage-addvence

1.columnsList
properties: 'name', 'key', 'width', 'attrOptions'
'name' and 'key' in every column item is required, while 'width' is no required
'attrOptions' property provide a way for you to custem the el-table-column's props

for 'laziest' person, here is a lazy-template: 'name-key-width'

2.tableData
within this component, data showed in the table is a clone of raw(the input tableData)
if you want to touch the raw row data, use the 'rawRow' property of slot scope

3.slot - {row, rawRow}
row is the filter-handered data
rawRow is the raw data

4.filter related
view more in 'awesome' ...

# awesome

1.global filter
I found that, always we have a requirement to use global filters to handle the expection-unmatch data, these why I introduce a auto template for filter-handling

how to use it?

first, you need to set a unique key(start with $) to every filterDict manually (say one of them is '$t', which means 'globalTimeFormatter');
then, use it in columnsList item's key property(just like 'time$t'), so that every item's 'time' value will be formated;
then, nothing more ...

# disadvantage

1.for complex idea, try name slot, or give up this component ...

2.for higher level columnsList item with 'attrOptions', you cann't use the columnsList-template grammar

# demo data
1.columnsList:
[
    { title: 'DDDD', key: 'date$t', width: '100%', attrOptions: {width: 200%},},
    { title: 'ADDRESS', key: 'address', width: '200%', },
    { title: 'NAME', key: 'name', width: '100%', },
    { title: "momey", key: 'number$a', width: '100%', }
],

2.columnsList-template:
['date$t-DDDD-100%', 'address-ADDRESS-200%', 'name-NAME-100%', 'number$a-momey-100%']

3.tableData:
[
    { date: '2016-05-02', name: '王小虎1', address: ' 1518 弄', number: '123123123', },
    { date: '2016-05-04', name: '王小虎2', address: '上海市普陀区金沙 弄', number: '123123123', },
    { date: '2016-05-01', name: '王小虎3', address: '上海市普陀区金沙江路 1519 弄' },
    { date: '2016-05-03', name: '王小虎4', address: '上海市普陀区金沙江路 1516 弄' }
],

4.slot
<template #date="{row, rawRow}">
</template>

# unfinished
pageNo(prop)
edit data

# update
created ---- 2020-05-05 15:46:58
dynamic add props to 'el-table-column' through 'columnsList' item's options property ---- 2020-05-11 00:21:27
update tempate 'title-key-width' to 'key-title-width' ---- 2020-05-30 19:18:22
generate random data ---- 2020-06-08 15:41:15
change selected data into rawData ---- 2020-06-22 17:35:19

# raw
hasIndex|prop|Boolean|true|-|whether index show or not
enableSelection|prop|Boolean|false|-|whether selection on work or not
columnsList|prop|Array|-|required|message of table header, read more in addvence-usage
tableData|prop|Array|-|required|array of table data, read more in addvence-usage
distributeWidth|prop|Boolean|true|-|whether table auto distribute the space in proportion（是否平均分配剩余空白）
slots|slot|{row, rawRow}|-|-|every column have a slot with name equal to it's column key
turnOnTest|data|-|-|-|turn on random data manually
*/

import { Prop, Vue, Component, PropSync, Watch } from 'vue-property-decorator'
import { IFilterKey, getGlobalFilter } from '../../utils/filtersDict'
import { generateRandom, RandomKey } from '../../utils/common/random'

export interface ITableHeadItem {
  title: string
  key: string
  width?: string | number
  random?: RandomKey
}

@Component({
  name: 'CommonTable'
})

export default class extends Vue {
  @Prop({ default: false }) hasIndex!: boolean
  @Prop({ default: false }) enableSelection!: boolean
  @Prop({ default: 1 }) pageNo!: number
  @Prop({ required: true }) tableData!: any[]
  @Prop({ default: true }) distributeWidth!: boolean
  @Prop({ required: true }) columnsList!: ITableHeadItem[] | string[]
  @PropSync('selectedRows') innerSelectedRows!: any[]

  filterReg = /\$.*$/
  private turnOnTest = false // useful random data auto-generate feature
  private dataMap = new Map()

  // validator: function(value) {
  //   for (const item of value) {
  //     if (typeof item === 'string') {
  //       if (item.split('-').length < 2) {
  //         console.error(
  //             `check you columnsList template, current ${item}, expect: "title-key$t-100%"`
  //         )
  //         return false
  //       }
  //     } else {
  //       if (!item.title || !item.key) {
  //         console.error(
  //           'columnsList error, title and key properties are required'
  //         )
  //         return false
  //       }
  //     }
  //   }
  //   return true
  // }

  get innerRawcolumnsList(): ITableHeadItem[] {
    let _list = JSON.parse(JSON.stringify(this.columnsList))
    if (typeof _list[0] === 'string') {
      _list = _list.map((item: string) => {
        const values = item.split('-')
        return {
          key: values[0].trim(),
          title: values[1].trim(),
          width: values[2]?.trim() || '100%'
        }
      })
    }
    return _list
  }

  // key with global filters' identifier
  get innerColumnKeysWithIdentifier(): string[] {
    return this.innerRawcolumnsList.map((item: ITableHeadItem) => item.key)
  }

  get innerColumnKeys(): ITableHeadItem[] {
    const _list = JSON.parse(JSON.stringify(this.innerRawcolumnsList))
    // remove '$\w' in every column key
    _list.forEach((item: ITableHeadItem) => (item.key = item.key.replace(this.filterReg, '')))
    return _list
  }

  get innerTableData(): any[] {
    // check filter pre-handle required and edit raw's clone data
    let data = JSON.parse(JSON.stringify(this.tableData))
    this.innerColumnKeys.forEach((item: ITableHeadItem, index: number) => {
      const _k = item.key
      // if has globalFilter sign, do something ……
      if (this.filterReg.test(_k)) {
        const _match: IFilterKey = (_k.match(this.filterReg)?.[0] as IFilterKey)
        const key: string = _k.replace(this.filterReg, '')
        const globalFilter = getGlobalFilter(_match, this)

        if (globalFilter) {
          data.forEach((item: any) => (item[key] = globalFilter(item[key])))
        }
      }
    })

    if (this.turnOnTest && data.length === 0) {
      data = this.insertRandomData()
    }
    return data
  }

  get widthType() {
    return this.distributeWidth ? 'min-width' : 'width'
  }

  @Watch('innerTableData', { deep: true, immediate: true })
  generateMap() {
    this.dataMap = new Map()
    this.innerTableData.forEach((item, index) => {
      this.dataMap.set(item, this.tableData[index])
    })
  }

  handleSelectionChange(rowsList: any[]) {
    this.innerSelectedRows = rowsList.map(this.getRawData)
  }

  insertRandomData() {
    const _list = []
    for (let i = 0; i < 10; i++) {
      const _data: {[prop: string]: any} = {}
      this.innerColumnKeys.forEach(item => {
        const _type: RandomKey = item.random || 'text'
        _data[item.key] = generateRandom(_type)
      })
      _list.push(_data)
    }
    return _list
  }

  getRawData(item: {[key: string]: any}): {[key: string]: any} {
    return this.dataMap.get(item)
  }
}
</script>
