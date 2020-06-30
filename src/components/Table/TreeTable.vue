<template>
  <div class="app-container">
    <common-tree :raw-data-list="innerRawDataList"
                 show-checkbox
                 class="tree"
                 :default-expand-all="true"
                 :check-strictly="true"
                 v-bind="$attrs"
                 v-on="$listeners"
    >
      <template #head="{levelKey, levelCount}">
        <div class="treeheadWrapper" :style="{'padding-left': `${28 + 18 * levelCount}px`}">
          <div class="treeHead">
            <ul>
              <template v-for="options in columnsList">
                <li :key="options.key">
                  {{ options.title }}
                </li>
              </template>
            </ul>
          </div>
        </div>
      </template>
      <template #default="{data, levelKey, levelCount}">
        <div class="treeItem" :style="{'margin-left': `${levelCount * 18 - 18 * data[levelKey]}px`}">
          <ul>
            <template v-for="(options, index) in columnsList">
              <li v-if="index === 0" :key="options.key" :style="{'padding-left': `${18 * (data[levelKey] - 1)}px`}">
                <slot :name="options.key" :row="data">
                  {{ data[options.key] }}
                </slot>
              </li>
              <li v-else :key="options.key">
                <slot :name="options.key" :row="data">
                  {{ data[options.key] }}
                </slot>
              </li>
            </template>
          </ul>
        </div>
      </template>
    </common-tree>
  </div>
</template>

<script lang="ts">

/*
思路：
1.加入 treeLevel 属性
2.根据层数来判断要往右移动多远
3.可以传入一个有层级的 list, 也可以是一个 tree

# version

1.0.2

# attention
though this is a table component, it's not depend on el-table or CommonTable

# update
1. name slot for every row data; accept list type data; output selected itemsList ---- 2020-06-03 15:54:11
2. generate random data ---- 2020-06-08 15:41:15

# raw
turnOnTest|data|-|-|-|turn on random data manually

*/

import { Component, Vue, Prop, } from 'vue-property-decorator'
import CommonTree from '@/components/Tree/CommonTree.vue'
import { generateRandom, RandomKey } from '@/utils/common/random'

type HeadKeys = string[]

export interface ITableHeadItem {
  title: string
  key: string
  width?: string | number
  random?: RandomKey
}

@Component({
  name: 'TreeTable',
  components: {
    CommonTree,
  },
})

export default class extends Vue {
  @Prop({ required: true }) columnsList!: ITableHeadItem[]
  @Prop({ required: true }) rawDataList!: {[prop: string]: string}[]

  private turnOnTest = true

  get innerRawDataList() {
    if (this.turnOnTest && this.rawDataList.length === 0) {
      return this.createTestData()
    }
    return this.rawDataList
  }

  createTestData(): {[prop: string]: string}[] {
    const _list = []
    for (let i = 0; i < 40; i++) {
      const _data: {[prop: string]: any} = {}
      this.columnsList.forEach(item => {
        const _type: RandomKey = item.random || 'text'
        _data[item.key] = generateRandom(_type)
      })
      _data.id = generateRandom('number', 1) - 1
      _data.parentId = generateRandom('number', 1) - 1
      _list.push(_data)
    }
    return _list
  }
}
</script>

<style lang="scss" scoped>
.treeItem, .treeHead {
  font-size: 0.9em;
  width: 100%;

  & ul {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    & li {
      width: 100px;
      list-style: none;
      flex-grow: 1;
    }
  }
}

.treeheadWrapper {
  width: 100%;
}

</style>
<style lang="scss">
.el-tree.tree {
  & .el-tree-node__content {
    height: auto;
  }
}
</style>
