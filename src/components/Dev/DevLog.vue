<template>
  <div class="devLog" :class="{hidden: isHidden}" @click.stop="onShow">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="0" :name="tabsKey[0]">
        当前路由：{{ routeName }}<br>
        pressingKey: {{ currentPressKeys }}
        <template v-for="item in showData">
          <div :key="item.key" :title="item.description">
            {{ item.vm[item.name] }}
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane label="1" :name="tabsKey[1]">
        <template v-for="type in typesList">
          <span :key="type">
            <el-button type="primary" plain @click="copyContent(type, $event)">
              {{ type }}
            </el-button>
          </span>
        </template>
      </el-tab-pane>
      <el-tab-pane label="2" :name="tabsKey[2]">
        2
      </el-tab-pane>
      <el-tab-pane label="3" :name="tabsKey[3]">
        3
      </el-tab-pane>
    </el-tabs>
    <div class="close" @click.stop="onHide">
      <i class="el-icon-circle-close" />
    </div>
  </div>
</template>
<script lang="ts">

/*

# update
clear pressKeys when page toggle ---- 2020-05-31 11:01:37
*/

// !attention, this component is created away from the project root Vue(App), which may cause some unexpected error when you attempt to use some global feature of root App, such as global directive ...

import { Component, Vue, Watch } from 'vue-property-decorator'
import { IDevDataItem } from '@/types/dev'
import { generateRandom, typesList, RandomKey } from '@/utils/common/random'
import { handleClipboard } from '@/utils/clipboard'
import { clipboard } from '../../directives'

@Component({
  name: 'DevLog',
  components: {},
  directives: {
    clipboard
  }
})

export default class DevLog extends Vue {
  rootVm: Vue | null = null
  devData: IDevDataItem[] = []
  isHidden = false
  typesList = typesList

  //! attention, the first four key(code) is used to check for tabs switching
  commonCodes = [49, 50, 51, 52, 192, 9, 66]// keycode: 1-49 2-50 3-51 4-52 d-68 ~-192 tab-9 b-66
  featureCodes = [68, 17] // keycode: d-68 ctr-17
  allCode = [...this.commonCodes, ...this.featureCodes]
  currentPressKeys: number[] = []
  tabsKey = ['1', '2', '3', '4']
  inputData = '1'
  activeTab = '1'

  get routeName(): string {
    if (this.rootVm && this.rootVm.$route) {
      return this.rootVm.$route.name || ''
    }
    return ''
  }

  get showData(): IDevDataItem[] {
    return this.devData && this.devData.filter(item => item.routes.includes(this.routeName) || item.routes.includes('*'))
  }

  @Watch('currentPressKeys')
  showToggle() {
    if (this.currentPressKeys.length === 2) {
      const _code = this.getCurrentPressCommonCode()
      const _index = this.commonCodes.indexOf((_code as number))
      const _tab = this.tabsKey[_index]
      if (_tab) {
        this.isHidden = false
        this.activeTab = _tab
      } else {
        this.isHidden = !this.isHidden
      }
    }
  }

  created() {
    // todo
    document.addEventListener('keydown', event => {
      const code = event.keyCode
      if (this.codeCanBePush(code, this.commonCodes) || this.codeCanBePush(code, this.featureCodes)) {
        this.currentPressKeys.push(code)
        event.stopPropagation()
      }
    })

    document.addEventListener('keyup', event => {
      const code = event.keyCode
      if (this.allCode.includes(code) && this.currentPressKeys.includes(code)) {
        this.currentPressKeys = this.currentPressKeys.filter(item => item !== code)
        event.stopPropagation()
      }
    })

    let visibilityChange
    if (typeof document.hidden !== 'undefined') {
      visibilityChange = 'visibilitychange'
    } else if (typeof (document as any).msHidden !== 'undefined') {
      visibilityChange = 'msvisibilitychange'
    } else if (typeof (document as any).webkitHidden !== 'undefined') {
      visibilityChange = 'webkitvisibilitychange'
    }

    document.addEventListener(visibilityChange as string, () => { this.currentPressKeys = [] })
  }

  onShow() {
    if (this.isHidden) this.isHidden = false
  }

  onHide() {
    this.isHidden = true
  }

  copyContent(type: RandomKey, event: MouseEvent) {
    handleClipboard(generateRandom(type), event)
  }

  // check whether current code is included in a limit list but is't included in pressing key
  codeCanBePush(code: number, list: number[]) {
    return list.includes(code) && this.currentPressKeys.every(n => !list.includes(n))
  }

  getCurrentPressCommonCode() {
    for (const code of this.commonCodes) {
      if (this.currentPressKeys.includes(code)) return code
    }
  }
}

</script>

<style lang="scss" scoped>
$backgroundColor: rgba(141, 137, 137, 0.6);
$backgroundColorDeep: rgba(141, 137, 137, 1);

.devLog {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  z-index: 999;
  color: red;
  background-color: $backgroundColor;
  padding: 10px;
  border-radius: 5px 0 5px 5px;
  line-height: 1.4em;
  transition: all 0.3s;
  overflow: auto;

  &:hover {
    width: 300px;
    height: 300px;
    background-color: $backgroundColorDeep;
  }

  &.hidden {
    width: 30px;
    height: 30px;
    border-radius: 0 0 0 100%;

    &::after {
      display: block;
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: $backgroundColorDeep;
    }

  }

  & .close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
  }
}

.el-icon-circle-close {
  font-size: 1.3em;
}
</style>
