<template>
  <div class="app-container">
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table
      ref="draggableTable"
      v-loading="listLoading"
      :data="list"
      row-key="id"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        align="center"
        label="ID"
        width="65"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="180px"
        align="center"
        label="Date"
      >
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="300px"
        label="Title"
      >
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="180px"
        align="center"
        label="Author"
      >
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="105px"
        label="Importance"
      >
        <template slot-scope="{row}">
          <svg-icon
            v-for="n in +row.importance"
            :key="n"
            name="star"
            class="icon-star"
          />
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Readings"
        width="95"
      >
        <template slot-scope="{row}">
          <span>{{ row.pageviews }}</span>
        </template>
      </el-table-column>

      <el-table-column
        class-name="status-col"
        label="Status"
        width="110"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.status | articleStatusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Drag"
        width="80"
      >
        <svg-icon
          class="draggable-handler"
          name="drag"
          width="20"
          height="20"
        />
      </el-table-column>
    </el-table>
    <!-- $t is vue-i18n global function to translate lang (lang in @/lang)  -->
    <div class="show-d">
      <el-tag style="margin-right:12px;">
        {{ $t('table.dragTips1') }} :
      </el-tag> {{ oldList }}
    </div>
    <div class="show-d">
      <el-tag>{{ $t('table.dragTips2') }} :</el-tag> {{ newList }}
    </div>
    <el-button @click="test">
      test
    </el-button>

    <common-table
      :table-data="testData"
      :distribute-width="true"
      :columns-list="testColumn"
    />
  </div>
</template>

<script lang="ts">
import Sortable from 'sortablejs'
import { Component, Vue } from 'vue-property-decorator'
import { getArticles } from '@/api/articles'
import { IArticleData } from '@/api/types'
import CommonTable from '@/components/Table/CommonTable.vue'
import { generateRandom } from './index.ts'

@Component({
  name: 'TextPage',
  components: {
    CommonTable
  }
})

export default class extends Vue {
  private testColumn = ['DokD-date$t-100%', 'ADDRESS-address-200%', 'NAME-name-100%', 'momey-number$a-300%']
  private testData = [
    {
      date: '2016-05-02',
      name: '王虎1',
      address: ' 1518 弄',
      number: '123123123'
    },
    {
      date: '2016-05-04',
      name: '王小虎2',
      address: '上海市普陀区金沙 弄',
      number: '123123123'
    },
    {
      date: '2016-05-01',
      name: '王小虎3',
      address: '上海市普陀区金沙江路 1519 弄'
    },
    {
      date: '2016-05-03',
      name: '王小虎4',
      address: '上海市普陀区金沙江路 1516 弄'
    }
  ]

  private list: IArticleData[] = []
  private listLoading = true
  private total = []
  private oldList: number[] = []
  private newList: number[] = []
  private listQuery = {
    page: 1,
    limit: 10
  }

  t = 1
  bb = '2'

  private sortable: Sortable | null = null

  created() {
    this.getList()
  }

  test() {
    this.t = generateRandom('name', 10, 30)
    this.ok()
  }

  ok() {
    this.$dp([
      {
        name: 'bb',
        routes: ['test', 'Permission'],
        description: 'description1'
      },
      {
        name: 't',
        routes: ['*'],
        description: 'description1'
      },
      {
        name: 'abc',
        routes: ['Icons', 'Permission'],
        description: 'description1'
      }
    ], this)
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getArticles(this.listQuery)
    this.list = data.items
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
    this.total = data.total
    this.oldList = this.list.map((v) => v.id)
    this.newList = this.oldList.slice()
    this.$nextTick(() => {
      this.setSort()
    })
  }

  private setSort() {
    const el = (this.$refs.draggableTable as Vue).$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0] as HTMLElement
    this.sortable = Sortable.create(el, {
      ghostClass: 'sortable-ghost', // Class name for the drop placeholder
      onEnd: evt => {
        if (typeof (evt.oldIndex) !== 'undefined' && typeof (evt.newIndex) !== 'undefined') {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)
          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      }
    })
  }
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
