import Vue, {VueConstructor} from 'vue'
import { IDevOptionsItem } from "@/types/dev"
// plugin
declare module 'vue/types/vue' {
    interface Vue {
      $dp: (optionsList: IDevOptionsItem[] | string[], vm: Vue) => void
    }
}
declare module 'vue/types/vue' {
    interface Vue {
      $ok: string 
    }
}