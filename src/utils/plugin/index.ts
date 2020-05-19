import devPlugin from './devPicker'
import { VueConstructor } from 'vue'

export default {
  install(Vue: VueConstructor) {
    Vue.use(devPlugin)
  }
}
