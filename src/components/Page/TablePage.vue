<template>
  <div>
    <common-search :search-options="searchOptionsList" @clear="clearParams" @search="onSearch">
      <common-action class="commonAction" :path="path" :add-options-list="addOptionsList" :edit-options-list="editOptionsList" :item-list="innerSelectedRows">
        <template #extraButton>
          <slot name="extraButton" :selectedList="innerSelectedRows" />
        </template>
      </common-action>
    </common-search>
    <promise-table ref="table"
                   :data="loadFn"
                   :mode="mode"
                   :columns-list="columnsList"
                   v-bind="$attrs"
                   :selected-rows.sync="innerSelectedRows"
                   v-on="$listeners"
    >
      <template v-for="item in slotList" #[item]="{row, rawRow}">
        <slot :name="item" :row="row" :rawRow="rawRow" />
      </template>
    </promise-table>
  </div>
</template>

<script lang="ts">

/*

# version

1.0.3

# idea
1.Intro a selectedRowsTransfer to compatible with the no-default-selectedRows-input case

attention: 'selectedRowsTransfer' is nothing to do with component developer(maybe you), use innerSelectedRows instead

# update
1. extraButton slot ---- 2020-06-06 16:19:23
2. Listen 'refreshTablePage' event on current parent to refresh this page

# raw
extraButton|slot|-|-|-|-
refreshTablePage|event|-|-|-|event listen on this.$parent

*/

import { Component, Vue, Prop, Watch, PropSync } from 'vue-property-decorator'
import Pagination from '@/components/Pagination/index.vue'
import PromiseTable, { ITableHeadItem } from '@/components/Table/PromiseTable.vue'
import CommonForm from '@/components/Form/CommonForm.vue'
import CommonSearch from '@/components/Search/CommonSearch.vue'
import CommonAction from '@/components/Action/CommonAction.vue'
import { baseSearchApi } from '@/api/tableBase'

@Component({
  name: 'TablePage',
  components: {
    Pagination,
    PromiseTable,
    CommonForm,
    CommonSearch,
    CommonAction,
  },
})
export default class extends Vue {
  @Prop({ required: true }) columnsList!: ITableHeadItem[] | string[]
  @Prop({ default: () => [] })addOptionsList!: {[prop: string]: any}[]
  @Prop({ default: () => [] })editOptionsList!: {[prop: string]: any}[]
  @Prop({ default: () => [] })searchOptionsList!: {[prop: string]: any}[]
  @Prop({ default: 'table' })mode!: string
  @Prop({ required: true }) path!: string
  @PropSync('selectedRows', { default: () => [] }) selectedRowsTransfer!: any[]

  private innerSelectedRows: any[] = []
  public searchParams: {[prop: string]: any} ={} //= { a: 1 }

  @Watch('selectedRowsTransfer', { deep: true, immediate: true })
  copyIn() {
    this.innerSelectedRows = this.selectedRowsTransfer
  }

  @Watch('innerSelectedRows', { deep: true, immediate: true })
  copyOut() {
    this.selectedRowsTransfer = this.innerSelectedRows
  }

  get slotList(): string[] {
    if (typeof this.columnsList[0] === 'string') {
      return (this.columnsList as string[]).map((item: string) => item.replace(/[$-].*$/, ''))
    } else {
      return (this.columnsList as any).map((item: any) => item.key.replace(/\$.*$/, ''))
    }
  }

  created() {
    this.$dp([{
      name: (this.$parent as any).columnsList ? 'columnsList' : 'multipleColumnsList',
      routes: [this.$route.name || ''],
    }], this.$parent)

    this.$dp([{
      name: 'innerSelectedRows',
      routes: [this.$route.name || ''],
    }], this)

    this.$parent.$on('refreshTablePage', () => this.onRefresh())
  }

  onSearch(params: {[prop: string]: string}) {
    this.searchParams = params
    this.onRefresh()
  }

  onRefresh() {
    (this.$refs.table as PromiseTable).$emit('refresh')
  }

  clearParams() {
    this.searchParams = {}
  }

  loadFn(currentPage: number) {
    // fn(params) mix page
    return baseSearchApi(this.path, { currentPage, ...this.searchParams })
  }
}
</script>

<style lang="scss" scoped>
.commonAction{
  margin-bottom: 20px;
}

</style>
