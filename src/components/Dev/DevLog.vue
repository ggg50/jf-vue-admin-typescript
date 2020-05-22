<template>
  <div class="devLog" :class="{hidden: isHidden}" @click.stop="onShow">
    <el-tabs v-model="activeName">
      <el-tab-pane label="0" name="0">
        当前路由：{{ routeName }}
        <template v-for="item in showData">
          <div :key="item.key" :title="item.description">
            {{ item.vm[item.name] }}
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane label="1" name="1">
        <template v-for="type in typesList">
          <span :key="type" @click="copyContent(type, $event)">
            <el-button type="primary" plain>
              {{ type }}
            </el-button>
          </span>
        </template>
      </el-tab-pane>
      <el-tab-pane label="2" name="2">
        2
      </el-tab-pane>
      <el-tab-pane label="3" name="3">
        3
      </el-tab-pane>
    </el-tabs>
    <div class="close" @click.stop="onHide">
      <i class="el-icon-circle-close" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { IDevDataItem } from '@/types/dev'
import { generateRandom, typesList, RandomKey } from '@/utils/common/random'
import { handleClipboard } from '@/utils/clipboard'

@Component({
  name: 'DevLog',
  components: {}
})

export default class DevLog extends Vue {
  rootVm: Vue | null = null
  devData: IDevDataItem[] = []
  isHidden = false
  currentPressKeys: number[] = []
  typesList = typesList

  private activeName = '1'

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
      this.isHidden = !this.isHidden
    }
  }

  created() {
    document.addEventListener('keydown', event => {
      const code: number = event.keyCode
      if ([17, 66].includes(code) && !this.currentPressKeys.includes(code)) {
        this.currentPressKeys.push(code)
        event.stopPropagation()
      }
    })
    document.addEventListener('keyup', event => {
      const code: number = event.keyCode
      if ([17, 66].includes(code) && this.currentPressKeys.includes(code)) {
        this.currentPressKeys = this.currentPressKeys.filter(item => item !== code)
        event.stopPropagation()
      }
    })
  }

  onShow() {
    if (this.isHidden) this.isHidden = false
  }

  onHide() {
    this.isHidden = true
  }

  copyContent(type: RandomKey, event: MouseEvent) {
    handleClipboard(generateRandom(type), event)
    // clip
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
