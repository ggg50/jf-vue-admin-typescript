import { VueConstructor } from 'vue'
import DevLog from '@/components/Dev/DevLog.vue'
import { IDevPicker, IDevDataItem, IDevOptionsItem } from '@/types/dev'
import _ from 'lodash'
import { replaceArrayItem } from '@/utils/base'

if (!DevLog) console.error('Component Devlog is undefined, make sure you have imported it correctly')

export default {
  install(Vue: VueConstructor) {
    if (process.env.NODE_ENV === 'production') {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      Vue.prototype.$dp = () => {}
      return
    }

    // devPicker.target.devData: array
    // devPicker.target.rootVm: app root vm

    const devPicker: IDevPicker = {
      target: null,
      bindTarget: bindTarget,
      createDevDom: createDevDom,
      bindAppRoot: bindAppRoot
    }

    devPicker.bindTarget(devPicker.createDevDom())

    /**
     * this fn will marge optionsList to devPicker target vm's devData
     * @param {Array} optionsList see below
     * @param {string} optionsList.name name of data
     * @param {Array} optionsList.routes array of route name data should be showed
     * @param {string} optionsList.description
     *
     * or, you can input a list of string formatted like this: 'name-route1,route2-description'
     */

    type OptionType = IDevOptionsItem[] | string[]

    const pickerFn = function(optionsList: OptionType, vm: Vue) {
      let _optionsList: OptionType = _.cloneDeep(optionsList)

      if (!(devPicker.target && (devPicker.target as any).rootVm)) devPicker.bindAppRoot(vm)

      try {
        if (_optionsList[0] && typeof _optionsList[0] === 'string') {
          _optionsList = (_optionsList as string[]).map((item: string) => {
            const _items = item.trim().split('-')
            return {
              name: _items[0].trim(),
              routes: _items[1].trim().split(','),
              description: _items[2] && _items[2].trim()
            }
          })
        }
      } catch (e) {
        console.error('devPicker update: bad optionsList template')
        console.log(e)
      }

      if (devPicker.target) {
        // 把 optionsList 传给devPicker
        (_optionsList as IDevOptionsItem[]).forEach((item: IDevOptionsItem) => {
          const _item: IDevDataItem = {
            ...item,
            vm,
            key: (vm as any).name || '' + item.name
          }
          const _arr = (devPicker.target as any).devData as IDevDataItem[]
          (devPicker.target as any).devData = replaceArrayItem(_arr, _item, (devItem, newItem) => devItem.key === newItem.key, false)
        })
      }
    }

    Vue.prototype.$dp = pickerFn

    function bindTarget(vm: DevLog) {
      if (devPicker.target) {
        console.error('current devPicker.target has been bound, you are trying to rebind it to another vm, which shouldn\'t happen normally ')
      }
      devPicker.target = vm
    }

    // use one of the vm to bind the main App to devPicker
    function bindAppRoot(vm: Vue) {
      if (!devPicker.target) return
      (devPicker.target as any).rootVm = vm.$root
    }

    function createDevDom(): DevLog {
      // const Constructor = new DevLog()
      const Constructor = Vue.extend(DevLog)
      const devVm: DevLog = new Constructor({})
      devVm.$mount()
      document.body.appendChild(devVm.$el)
      return devVm
    }
  }
}
