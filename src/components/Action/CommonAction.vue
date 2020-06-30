<template>
  <div class="commonActionWrapper">
    <div class="buttonWrapper">
      <template v-for="item in actionTypes">
        <el-button :key="item.type"
                   v-waves
                   v-action="item.type"
                   type="primary"
                   :disabled="!enableAction[item.type]"
                   @click="item.handler"
        >
          <span class="svg-container">
            <svg-icon :name="item.type" />
          </span>
          {{ $t(`table.${item.type}`) }}
        </el-button>
      </template>
      <slot name="extraButton" />
    </div>

    <el-dialog
      title="增加"
      :visible.sync="addVisible"
    >
      <common-form :form-options="addOptionsList" :submit-text="$t(`table.add`)" @submit="handleAdd" />
    </el-dialog>

    <el-dialog
      title="修改"
      :visible.sync="editVisible"
    >
      <common-form :form-options="editOptionsList" :submit-text="$t(`table.edit`)" @submit="handleEdit" />
    </el-dialog>
  </div>
</template>

<script lang="ts">

/*
# version
1.0.1

# update
extraButton slot ---- 2020-06-06 16:17:08

# raw
extraButton|slot|-|-|-|-
*/

import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import CommonForm from '@/components/Form/CommonForm.vue'
import { baseAddApi, baseEditApi, baseDeleteApi, baseFreezeApi } from '@/api/tableBase'

type ActionTypes = 'add' | 'edit'| 'delete'| 'freeze'| 'unfreeze'
interface IActionItem {
  type: ActionTypes
  handler: Function
}

@Component({
  name: 'CommonAction',
  components: {
    CommonForm,
  },
})

export default class extends Vue {
  @Prop({ default: () => [] })addOptionsList!: {[prop: string]: any}[]
  @Prop({ default: () => [] })editOptionsList!: {[prop: string]: any}[]
  @Prop({ default: () => [] })itemList!: {[prop: string]: any}[]
  @Prop({ required: true })path!: string
  @Prop({ default: 'id' })idKey!: string

  private addVisible = false
  private innerEditOptionsList = this.editOptionsList
  private editVisible = false
  private actionTypes: IActionItem[] = [
    { type: 'add', handler: this.onAdd, },
    { type: 'edit', handler: this.onEdit, },
    { type: 'delete', handler: this.commonConfirm('delete', this.handleMultipleItem), },
    { type: 'freeze', handler: this.commonConfirm('freeze', this.handleMultipleItem), },
    { type: 'unfreeze', handler: this.commonConfirm('unfreeze', this.handleMultipleItem), }
  ]

  get enableAction(): {[prop: string]: boolean} {
    return {
      add: true,
      edit: this.itemList.length === 1,
      delete: this.itemList.length > 0,
      freeze: this.itemList.some(item => item.isFreeze === false), // if any item unfreeze
      unfreeze: this.itemList.some(item => item.isFreeze === true), // if any item freeze
    }
  }

  get currentId(): string {
    return this.itemList.map(item => item[this.idKey] || '').filter(item => item).join('-')
  }

  @Watch('itemList', { deep: true, immediate: true })
  insertEditRawData() {
    if (!this.enableAction.edit) return
    const _item = this.itemList[0]
    this.innerEditOptionsList.forEach(item => {
      item.value = _item[item.key]
    })
  }

  created() {
    this.$dp([
      {
        name: 'currentId',
        routes: [this.$route.name || ''],
      }
    ], this)
  }

  onAdd() {
    this.addVisible = true
  }

  onEdit() {
    this.editVisible = true
  }

  commonConfirm(type: ActionTypes, handler: Function): Function {
    const _handler = () => {
      this.$confirm(`确认${this.$t(`table.${type}`)}所选行吗？`)
        .then(() => {
          handler(type)
        })
        .catch(e => { console.log(e) })
    }
    return _handler
  }

  handleAdd(value: {[prop: string]: any}) {
    this.$confirm('确认添加')
      .then(() => {
        baseAddApi(this.path, value)
          .then(() => {
            this.$message.success('添加成功！')
          })
          .catch(e => {
            this.$message.success('添加失败！')
            console.log(e)
          })
      })
  }

  handleEdit(value: {[prop: string]: any}) {
    this.$confirm('确认修改')
      .then(() => {
        const _value = this.$_.cloneDeep(value)
        _value[this.idKey] = this.currentId
        baseEditApi(this.path, _value)
          .then(() => {
            this.$message.success('修改成功！')
          })
          .catch(e => {
            this.$message.success('修改失败！')
            console.log(e)
          })
      })
      .catch(e => { console.log(e) })
  }

  handleMultipleItem(type: string) {
    const _data: {[prop: string]: any} = {}
    _data[`${this.idKey}s`] = this.currentId
    let _fn
    if (type === 'delete') {
      _fn = baseDeleteApi
    } else {
      _fn = baseFreezeApi
      _data.operator = type === 'freeze' ? 1 : 2
    }

    _fn(this.path, _data)
      .then(() => {
        this.$message.success(`${this.$t(`table.${type}`)}操作成功！`)
      })
      .catch(e => {
        this.$message.success(`${this.$t(`table.${type}`)}操作失败！`)
        console.log(e)
      })
  }

  // handleDelete() {
  //   const _data: {[prop: string]: string} = {}
  //   _data[`${this.idKey}s`] = this.currentId
  //   baseDeleteApi(this.path, _data)
  //     .then(() => {
  //       this.$message.success('修改成功')
  //     })
  //     .catch(e => {
  //       console.log(e)
  //     })
  // }

  // handleFreeze() {
  //   baseFreezeApi(this.path, _value)
  //     .then(() => {
  //       this.$message.success('修改成功')
  //     })
  //     .catch(e => {
  //       console.log(e)
  //     })
  // }

  // handleUnfreeze() {
  //   baseFreezeApi(this.path, _value)
  //     .then(() => {
  //       this.$message.success('修改成功')
  //     })
  //     .catch(e => {
  //       console.log(e)
  //     })
  // }
}
</script>

<style scoped lang="scss">
.commonActionWrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

</style>
