import DevLog from '@/components/Dev/DevLog.vue'
import Vue from 'vue'

export {
  IDevPicker,
  IDevDataItem,
  IDevOptionsItem,
}

interface IDevPicker {
  target: DevLog | null
  bindTarget(vm: DevLog): void
  createDevDom(): DevLog
  bindAppRoot(vm: Vue): void
}

interface IDevOptionsItem {
  name: string
  routes: string[]
  tab?: number
  description?: string
}

interface IDevDataItem extends IDevOptionsItem{
  key: string
  vm: Vue | null
}
