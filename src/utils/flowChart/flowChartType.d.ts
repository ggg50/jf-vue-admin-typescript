// type textKey = keyof typeof text

// const baseDirection = ['up', 'down', 'left', 'right']
// const directionList = [...baseDirection]
// function generateTypeKeys() {
//   const _fu = firstWordUpperCase
//   baseDirection.forEach(k1 => {
//     baseDirection.forEach(k2 => {
//       if (k2 === k1) return
//       directionList.push(k1 + _fu(k2))
//       directionList.push(k1 + _fu(k2) + _fu(k1))
//       baseDirection.forEach(k3 => {
//         directionList.push(k1 + _fu(k2) + _fu(k3))
//       })
//     })
//   })
// }
// generateTypeKeys()
// console.log(JSON.stringify(directionList))

export interface IFlowChartOptions {
  width: number // stepWidth
  height: number // stepHeight
  spaceX: number
  spaceY: number
  unit?: string
  // lineHeight: number
  lineWidth: number
  // lineWidth: number
}

export interface IRawStepItem {
  content?: string
  width?: number
  height?: number
  // line?: number
  // width?: number
  // x?: number
  // y?: number
}
export interface IRichStepItem {
  content: string
  // line: number
  width: number
  height: number
  ex: number
  ey: number
  x: number
  y: number
}

export type IRawOptions = IRawStepItem[]

export interface IRichOptions {
  list: IRichStepItem[]
  width: number
  rangeX: [number, number]
}

export interface IResult {
  htmlText: string
  richData: IRichOptions[]
  chartWidth: number
  chartHeight: number
}

export type Point = [number, number]
export type Position = 'top' | 'bottom' | 'left' | 'right'
export type BaseDirection = 'up' |'down' |'left' |'right'
export type Direction = 'up' |'down' |'left' |'right' |'upDown' |'upDownUp' |'upDownUp' |'upDownDown' |'upDownLeft' |'upDownRight' |'upLeft' |'upLeftUp' |'upLeftUp' |'upLeftDown' |'upLeftLeft' |'upLeftRight' |'upRight' |'upRightUp' |'upRightUp' |'upRightDown' |'upRightLeft' |'upRightRight' |'downUp' |'downUpDown' |'downUpUp' |'downUpDown' |'downUpLeft' |'downUpRight' |'downLeft' |'downLeftDown' |'downLeftUp' |'downLeftDown' |'downLeftLeft' |'downLeftRight' |'downRight' |'downRightDown' |'downRightUp' |'downRightDown' |'downRightLeft' |'downRightRight' |'leftUp' |'leftUpLeft' |'leftUpUp' |'leftUpDown' |'leftUpLeft' |'leftUpRight' |'leftDown' |'leftDownLeft' |'leftDownUp' |'leftDownDown' |'leftDownLeft' |'leftDownRight' |'leftRight' |'leftRightLeft' |'leftRightUp' |'leftRightDown' |'leftRightLeft' |'leftRightRight' |'rightUp' |'rightUpRight' |'rightUpUp' |'rightUpDown' |'rightUpLeft' |'rightUpRight' |'rightDown' |'rightDownRight' |'rightDownUp' |'rightDownDown' |'rightDownLeft' |'rightDownRight' |'rightLeft' |'rightLeftRight' |'rightLeftUp' |'rightLeftDown' |'rightLeftLeft' |'rightLeftRight'

export interface ILineOptions {
  startStep: IRichStepItem
  startPoint: Point
  endStep: IRichStepItem
  endPoint: Point
  startPosition: Position
  endPosition: Position
  type: 'line' | 'cline' | 'zline'
  direction: Direction
  rate?: number
  target?: number
  isTarget?: true
}

export interface IPAndD {
  startDirection: Direction
  endDirection: Direction
  endPosition: Position
  startPosition: Position
}

export interface ILineItem {
  className: string
  text: string
  style: {[key: string]: string}
  direction: Direction
  // top: string // number + 'px'
  // left: string
  // width: string
  // height: string
  // target?: number
  // gutter?: number
  // type: 'line' | 'cline' | 'zline'
  // arrow: boolean
}

export type IStepItem = {
  className: string
  content: string
  style: {[key: string]: string}
  // top: string // number + 'px'
  // left: string
  // width: string
  // height: string
}
