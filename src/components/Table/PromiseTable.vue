<template>
  <div v-if="mode === 'table'">
    <common-table v-loading="loading" :columns-list="columnsList" :table-data="tableData" v-bind="$attrs" v-on="$listeners">
      <template v-for="item in keysList" #[item]="{row, rawRow}">
        <slot :name="item" :row="row" :rawRow="rawRow" />
      </template>
    </common-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="page"
      :limit="10"
      :auto-scroll="false"
      @current-change="handleCurrentChange"
    />
  </div>

  <div v-else>
    <tree-table v-loading="loading" :columns-list="columnsList" :raw-data-list="tableData" v-bind="$attrs" v-on="$listeners">
      <template v-for="item in keysList" #[item]="{row}">
        <slot :name="item" :row="row" />
      </template>
    </tree-table>
  </div>
</template>

<script lang="ts">
/*
# 简介
1.这个组件是在 CommonTable 的基础上，引入了分页，加入了自动调用列表接口功能
2.data props 是一个函数，参数是 page, 返回值是一个 Promise, 包涵 data: table 项组成的 list；total：总数
3.对这个组件触发 refresh 事件，可以手动请求接口刷新数据

# version

1.0.0

# description
common table component with pagination and get table data automatically

# usage
|property  |type      |value                  |default   |required  |description

|data      |props     |Function(page): Promise|-         |required  |axios required to get table data list and total

## trigger 'refresh' event to this component can stimulate a manual table-refreshing

# raw
data|props|Function(page): Promise|-|required|axios required to get table data list and total

*/

import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import CommonTable, { ITableHeadItem as TableHeadItem } from './CommonTable.vue'
import TreeTable from './TreeTable.vue'
import Pagination from '@/components/Pagination/index.vue'
export type ITableHeadItem = TableHeadItem

@Component({
  name: 'PromiseTable',
  components: {
    CommonTable,
    Pagination,
    TreeTable,
  },
})
export default class extends Vue {
  @Prop({ required: true }) columnsList!: TableHeadItem[] | string[]
  @Prop({ required: true }) data!: (page: number) => Promise<any>
  @Prop({ default: 'table' }) mode!: string

  @Watch('page')
  loadData() {
    this.loading = true
    this.data(this.page)
      .then(res => {
        this.tableData = res.data.list
        this.total = res.total
        this.loading = false
      })
      .catch(e => {
        console.log(e)
        this.loading = false
      })
  }

  private total = 0
  private page = 1
  private tableData: {[prop: string]: any}[] = []
  private loading = false

  get keysList(): string[] {
    if (typeof this.columnsList[0] === 'string') {
      return (this.columnsList as string[]).map((item: string) => item.replace(/[$-].*$/, ''))
    } else {
      return (this.columnsList as any).map((item: any) => item.key.replace(/\$.*$/, ''))
    }
  }

  created() {
    this.loadData()
    this.$on('refresh', this.loadData)
  }

  handleCurrentChange(value: any) {
    console.log(value)
  }
}
</script>

<style scoped lang="scss">

</style>
