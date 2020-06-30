<template>
  <div>
    <common-form :form-options="searchOptions"
                 :show-default-button="searchOptions.length > 0"
                 :inline="true"
                 :enable-clear="true"
                 :submit-text="submitText"
                 button-position="right"
                 @submit="onSubmit"
    >
      <template #default>
        <slot />
      </template>
    </common-form>
  </div>
</template>

<script lang="ts">
/*
# version

1.0.0
*/

import { Component, Vue, Prop } from 'vue-property-decorator'
// import CommonTable from '@/components/Table/CommonTable.vue'
import CommonForm, { IFormItem } from '@/components/Form/CommonForm.vue'

export type ISearchItem = IFormItem

@Component({
  name: 'CommonSearch',
  components: {
    CommonForm,
  }
})
export default class extends Vue {
  @Prop({ required: true })searchOptions!: IFormItem[]

  get submitText() {
    return this.searchOptions.length > 0 ? '查询' : '刷新'
  }

  onSubmit(params: any) {
    this.$emit('search', params)
  }
}
</script>

<style lang="scss" scoped>
</style>
