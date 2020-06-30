<template>
  <div>
    <slot name="head" :levelKey="levelKey" :levelCount="levelCount" />
    <el-tree :data="innerTreeData"
             :props="treeOptions"
             show-checkbox
             class="tree"
             v-bind="$attrs"
             @check="onCheck"
             v-on="$listeners"
    >
      <template #default="{data}">
        <slot :data="data" :levelKey="levelKey" :levelCount="levelCount" />
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts">

/*
简介：
1.输入 list, 组件把 list 转成 tree, 同时添加了 [treeLevel] 属性
2.主要是用来处理 list, 如果传入的是 tree 结构，那就相当于直接使用了 el-tree
3.在插槽处可获取 层数 levelCount, 以及用来获取某个数据当前层数的key levelKey

# version

1.0.0

# description
intro a list-to-tree feature for el-tree, as well as, output tree level relative message

# usage
|property    |type      |value                       |default   |required  |description

|rawDataList |prop      |{[prop: string]: any}[]     |-         |required  |raw data list, no tree list
|treeOptions |prop      |-                           |-         |-         |view below for more detail
|findRootFn  |prop      |Function                    |-         |required  |a function used to find first level items
|selectedRows|sync      |Array                       |-         |-         |sync get current selected items list
|head        |slot      |(levelKey, levelCount)      |-         |-         |add content above main tree (view below for more detail)
|default     |slot      |(data, levelKey, levelCount)|-         |-         |slot inside every tree item (view below for more detail)

1.treeOptions props
  children:
    default: 'children',
  label:
    default: 'label',
  parent:
    default: 'parentId', the prop used to relate current item with it's parent
  id:
    default: 'id'

2.slot props
  data:
    (default slot) Current row data
  levelKey:
    The key used to indicate witch level current item is locate
  levelCount:
    The number of layers

# attention
though this is a table component, it's not depend on el-table or CommonTable

# update
name slot for every row data; accept list type data; output selected itemsList ---- 2020-06-03 15:54:11

# raw
rawDataList|prop|{[prop: string]: any}[]|-|required|raw data list, no tree list
treeOptions|prop|-|-|-|view below for more detail
findRootFn|prop|Function|-|required|a function used to find first level items
selectedRows|sync|Array|-|-|sync get current selected items list
head|slot|(levelKey, levelCount)|-|-|add content above main tree (view below for more detail)
default|slot|(data, levelKey, levelCount)|-|-|slot inside every tree item (view below for more detail)
*/

import { Component, Vue, Prop, Watch, PropSync } from 'vue-property-decorator'
import { createTreeDataFromItemList } from '@/utils/common/treeDataGenerator'

type HeadKeys = string[]

interface IDefaultProp {
  children: string
  label: string
}

@Component({
  name: 'TreeTable',
  components: {
  },
})

export default class extends Vue {
  @Prop({ required: true }) rawDataList!: {[prop: string]: string}[]
  @Prop({ default: () => { return { children: 'children', label: 'label', parent: 'parentId', id: 'id' } } }) treeOptions!: {[prop: string]: string}
  @Prop({ default: () => { return (item: any) => item.id === 0 } })findRootFn!: (item: any) => boolean
  @PropSync('selectedRows', { default: () => [] }) innerSelectedRows!: any[]

  private innerTreeData: {[prop: string]: string}[] = []
  private levelCount = 0
  private levelKey = 'treeLevel'

  @Watch('rawDataList', { deep: true, immediate: true })
  createInnerData() {
    const _dataList = this.$_.cloneDeep(this.rawDataList)
    this.innerTreeData = createTreeDataFromItemList(_dataList, this.findRootFn, this.treeOptions)
    this.addLevel(this.innerTreeData)
  }

  addLevel(itemList: {[prop: string]: any}[], level = 1) {
    itemList.forEach((item: {[prop: string]: any}) => {
      item[this.levelKey] = level
      if (level > this.levelCount) this.levelCount = level
      if (item[this.treeOptions.children] && item[this.treeOptions.children].length > 0) {
        this.addLevel(item[this.treeOptions.children], level + 1)
      }
    })
  }

  onCheck(_: any, list: any[]) {
    this.innerSelectedRows = (list as any).checkedNodes
  }
}
</script>

<style lang="scss">
.el-tree.tree {
  & .el-tree-node__content {
    height: auto;
  }
}
</style>
