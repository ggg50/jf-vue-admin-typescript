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

interface IDevDataItem {
  key: string
  name: string
  routes: string[]
  description?: string
  vm: Vue | null
}

interface IDevOptionsItem {
  name: string
  routes: string[]
  description?: string
}
