import Vue, {VueConstructor} from 'vue'
import { IDevDataItem } from "@/types/dev"
// plugin
declare module 'vue/types/vue' {
    interface VueConstructor {
      $dp: (optionsList: IDevDataItem[] | string[], vm: Vue) => void
    }
}
declare module 'vue/types/vue' {
    interface Vue {
      $ok: string 
    }
}