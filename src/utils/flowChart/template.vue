<template>
  <!-- <div v-html="htmlText" /> -->
  <div class="flowChartWrapper">
    <div class="flowChartInnerWrapper" :style="wrapperStyle">
      <template v-for="(options, key) in steps">
        <div :key="key" class="step" :class="options.className" :style="options.style">
          <div class="text">
            {{ options.content }}
            <div v-if="showTips">
              {{ key }}
            </div>
          </div>
        </div>
      </template>
      <template v-for="(options, key) in lines">
        <div :key="key" class="line" :class="options.className" :style="options.style">
          <div v-if="showTips" class="text">
            {{ key }}
          </div>
        </div>
      </template>
      <el-button v-if="!$isProduction" style="width: 100px" @click.stop="tipsToggler">
        {{ showTips ? 'close' : 'debug' }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
// c 形状线深度，根据期间的行宽度；超出最宽行的高度取决于它到中线的距离
// 手动添加 width 有可能会导致 z 线条错开的情况, 通过微调 width 的值可以解决
// todo rightUpRight 如何报错？

import { Component, Prop, Vue } from 'vue-property-decorator'
import { FlowChartGenerator } from './index'
import { ILineItem, IRawOptions, IStepItem, } from './flowChartType'

@Component({
  name: 'TestPage',
  components: {
  },
})

export default class extends Vue {
  private wrapperStyle = {}
  private steps: {[prop: string]: IStepItem } = {}
  private lines: {[prop: string]: ILineItem } = {}
  private showTips = false
  private unit = 'px'

  // <div class="line" :class="linesList.line1.class" :style="linesList.line1.style"><div class="text">text</div></div>
  // <div class="step" :class="stepsList.step1.class" :style="stepsList.step1.style"></div>
  // <div class="arrow" :class="arrowsList.arrow1.class" :style="arrowsList.arrow1.style"></div>

  options: IRawOptions[] = [
    [{ content: '业务小微提出资质需求', width: 100 }],
    [{ content: '平台主审批', }],
    [{ content: '经营资质节点签收', width: 100 }, { content: '经营资质节点签收', }, { content: '经营资质节点签收', width: 100 }],
    [{ content: '通过', }, { content: '通过', }],
    // { content: '经营资质节点反馈申请材料清单', },
    // { content: '业务小微准备业务类材料', },
    // { content: '经营资质节点准备证明类材料', },
    // { content: '经营资质节点汇总材料提交资质申请', },
    // { content: '行政部门审批', },
    // { content: '经营资质节点领证保管', },
    // { content: '重新核对修改申请材料', },
    // { content: '结束', },
  ]

  tipsToggler() {
    this.showTips = !this.showTips
  }

  created() {
    const options: IRawOptions[] = [
      [{ content: '业务小微提出资质需求', width: 100 }],
      [{ content: '平台主审批', }],
      [{ content: '经营资质节点签收', width: 100 }, { content: '经营资质节点签收', }, { content: '经营资质节点签收', width: 100 }],
      [{}, { content: '通过', }, { content: '通过', }],
      [{ content: '通过', }],
      [{ content: '经营资质节点签收', width: 100 }, { content: '经营资质节点签收', }, { content: '经营资质节点签收', width: 100 }],
      [{ content: '通过', }]
      // { content: '经营资质节点反馈申请材料清单', },
      // { content: '业务小微准备业务类材料', },
      // { content: '经营资质节点准备证明类材料', },
      // { content: '经营资质节点汇总材料提交资质申请', },
      // { content: '行政部门审批', },
      // { content: '经营资质节点领证保管', },
      // { content: '重新核对修改申请材料', },
      // { content: '结束', },
    ]
    const template = `
1_1-(down)->2_1
2_1-(down)->3_1
    `

    const a = new FlowChartGenerator({ width: 200, height: 50, spaceX: 30, spaceY: 50, lineWidth: 2, })
    a.setRichStepsData(options)

    a.generateSteps()
    a.generateLines(template)

    this.wrapperStyle = a.chartWrapperStyle
    this.lines = a.getAndPrintLines()
    this.steps = a.getAndPrintSteps()
  }
}
</script>

<style lang="scss" scoped>
div {
  box-sizing: content-box;
}
$lineColor: #2bf4ec;
$mainBackground: #23475f;
$stepBackground: #3d5d75;
$lineWidth: 2px;
$borderStyle: $lineWidth solid $lineColor;
$arrowBorder: 2 * $lineWidth solid $mainBackground;
$stepZIndex: 3;
$lineZIndex: 1;
$textZIndex: 2;
$arrowZIndex: 2;

@mixin arrowUp {
  transform: rotate(180deg);
}

@mixin arrowDown {
  transform: rotate(0deg);
}

@mixin arrowLeft {
  transform: rotate(90deg);
}

@mixin arrowRight {
  transform: rotate(-90deg);
}

@mixin arrowBottomOffset {
  bottom: - $lineWidth * 2 + $lineWidth / 2;
}
@mixin arrowTopOffset {//
  top: - $lineWidth * 2 + $lineWidth / 2;
}
@mixin arrowLeftOffset {//
  left: - $lineWidth * 2 - $lineWidth / 2;
}
@mixin arrowRightOffset {
  right: - $lineWidth * 2 - $lineWidth / 2;
}

.flowChartWrapper{
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;

  & .flowChartInnerWrapper {
    background-color: $mainBackground;
    position: relative;
  }

}

// step
.step {
  z-index: $stepZIndex;
  position: absolute;
  border-radius: 5px;
  border: 1px solid #cad0d4;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $stepBackground;
  // transform: translate(-50%, -50%);

  & .text {
    padding: 10px;
  }
}

// line
.line {
  position: absolute;
  z-index: $lineZIndex;
  // border: 1px solid blue;
  // transform: translate(-50%, -50%);

  &.downRight, &.leftUp {
    border-radius: 0 0 0 5px;
    border-left: $borderStyle;
    border-bottom: $borderStyle;
  }

  &.rightDown, &.upLeft {
    border-radius: 0 5px 0 0;
    border-top: $borderStyle;
    border-right: $borderStyle;
  }
  &.downLeft, &.rightUp {
    border-radius: 0 0 5px 0;
    border-right: $borderStyle;
    border-bottom: $borderStyle;
  }
  &.leftDown, &.upRight {
    border-radius: 5px 0 0 0;
    border-top: $borderStyle;
    border-left: $borderStyle;
  }

  &.down, &.up {
    border-left: $borderStyle;
  }
  &.left, &.right {
    border-top: $borderStyle;
  }

  // &.upOffset {
  //   transform: translateY($lineWidth);
  // }
  // &.downOffset {
  //   transform: translateY(-$lineWidth);
  // }
  // &.leftOffset {
  //   transform: translateX($lineWidth);
  // }
  // &.rightOffset {
  //   transform: translateX(-$lineWidth);
  // }

  &.arrow {
    &::after {
      content: '';
      display: block;
      z-index: $arrowZIndex;
      position: absolute;
      width: 0;
      height: 0;
      border: $arrowBorder;
      border-top-color: $lineColor;
      border-bottom-width: 0;
      // transform: translate(-50%, -100%);
      // transform: translate(-50%, -100%) rotate(90deg);
    }
  }

  & .text {
    z-index: $textZIndex;
    position: absolute;
  }

  &.down {
    &.arrow::after {
      bottom: -$lineWidth;
      @include arrowLeftOffset;
      @include arrowDown;
    }
    & .text {
      left: 0; top: 0; transform: translate(10%, 20%);
    }
  }

  &.up {
    &.arrow::after {
      top: 0;
      @include arrowLeftOffset;
      @include arrowUp;
    }
    & .text {
      right: 0; bottom: 0; transform: translate(-10%, -20%);
    }
  }

  &.left {
    &.arrow::after {
      left: -$lineWidth;
      @include arrowTopOffset;
      @include arrowLeft;
    }
    & .text {
      left: 0; bottom: 0; transform: translate(10%, -20%);
    }
  }

  &.right {
    &.arrow::after {
      right: - 2 * $lineWidth; // haha, i don't know 2* is required
      @include arrowTopOffset;
      @include arrowRight;
    }
    & .text {
      right: 0; top: 0; transform: translate(-10%, 20%);
    }
  }

  &.downRight {
    &.arrow::after {
      right: 0;
      @include arrowBottomOffset;
      @include arrowRight;
    }
    &.text {
      left: 0px; top: 0px; transform: translate(-110%, 20%);
    }
  }
  &.leftUp {
    &.arrow::after {
      top: 0;
      @include arrowLeftOffset;
      @include arrowUp;
    }

    &.text {
      right: 0px; bottom: 0px; transform: translate(110%, 20%);
    }
  }

  &.rightDown {
    &.arrow::after {
      bottom: 0;
      @include arrowRightOffset;
      @include arrowDown;
    }
    &.text {
      left: 0px; top: 0px; transform: translate(-10%, -120%);
    }
  }
  &.upLeft {
    &.arrow::after {
      left: -$lineWidth;
      // left: 0;
      @include arrowTopOffset;
      @include arrowLeft;
    }
    &.text {
      right: 0px; bottom: 0px; transform: translate(-10%, -120%);
    }
  }

  &.downLeft {
    &.arrow::after {
      left: -$lineWidth;
      @include arrowBottomOffset;
      @include arrowLeft;
    }
    &.text {
      top: 0; right: 0; transform: translate(110%, 20%);
    }
  }
  &.rightUp {
    &.arrow::after {
      top: 0;
      @include arrowRightOffset;
      @include arrowUp;
    }
    &.text {
      bottom: 0; left: 0; transform: translate(10%, 120%);
    }
  }
  &.leftDown {
    &.arrow::after {
      bottom: 0;
      @include arrowLeftOffset;
      @include arrowDown;
    }
    &.text {
      top: 0; right: 0; transform: translate(-10%, -120%);
    }
  }
  &.upRight {
    &.arrow::after {
      right: - $lineWidth;
      @include arrowTopOffset;
      @include arrowRight;
    }
    &.text {
      bottom: 0; left: 0; transform: translate(-110%, 20%);
    }
  }
}

</style>
