<template>
  <div class="devLog">
    当前路由：{{ routeName }}
    <template v-for="item in showData">
      <div
        :key="item.key"
        :title="item.description"
      >
        {{ item.vm[item.name] }}
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { IDevDataItem } from '@/types/dev'

@Component({
  name: 'DevLog',
  components: {}
})

export default class DevLog extends Vue {
  rootVm: Vue | null = null
  devData: IDevDataItem[] = [];

  @Watch('rootVm', { immediate: true })
  updateVisiable() {
    console.log(this.rootVm)
  }

  get routeName(): string {
    if (this.rootVm && this.rootVm.$route) {
      return this.rootVm.$route.name || ''
    }
    return ''
  }

  get showData(): IDevDataItem[] {
    return this.devData && this.devData.filter(item => item.routes.includes(this.routeName) || item.routes.includes('*'))
  }

  created() {
    console.log(this.devData)
    console.log(this.rootVm)
  }
}

</script>

<style lang="scss" scoped>
.devLog {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  z-index: 999;
  background-color: red;

  &:hover {
    width: 300px;
    height: 300px;
  }
}
</style>
