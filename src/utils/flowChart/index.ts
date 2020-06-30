/*
# version
1.0.4

# usage
1. instantiating one instance with some 'baseOptions':

const chart = new FlowChartGenerator({ width: 200, height: 50, spaceX: 30, spaceY: 50, lineWidth: 2, unit: 'px'})

2. input step options, this will also auto running generateSteps method inner(of course you can run it manually)

chart.setRichStepsData(stepsOptions)

3. generating lines and steps(as earlier-mentioned, it's optional)

chart.generateSteps() // options
chart.generateLines(linesTemplate) // options

! mentionable, direction of every lines maybe hard to define by imagining, we recommend you skip lines-generating (current step) and have a overview of whole chart first.

4. get data and print
const wrapperStyle = a.chartWrapperStyle
const lines = a.getAndPrintLines()
const steps = a.getAndPrintSteps()

# options and template
1. baseOptions

width: steps width
height: steps height
spaceX: horizontal space between two steps
spaceY: vertical space between two steps
lineWidth: line width
unit: 'px' default

2. stepsOptions: IRawStepItem[][]
IRawStepItem:
  content: step content
  width: Custom sets current step's width
  height: -

3. linesTemplate

1) template:

  startStep-(direction)->targetStep

  step: 1_1, 2_2, 9_14

  lineType:
    common line : ->
    z-like line : -z>
    c-like line : -c>

2) example：template-explain

1_1-(down)->2_1
  1_1 : start step is row 1 col 1
  2_1 : target step
  (down) : direction
  -> : line

1_1-(rightDownRight)-z>3_3
  (rightDownRight) : direction
  -z> : zline

1_1-(rightDownLeft)-c>3_3
  -c> : cline

# options data example
1. baseOptions

{ width: 200, height: 50, spaceX: 30, spaceY: 50, lineWidth: 2, }

! if you are require a left or right offset, you can use a empty obj( {} ) to take up one step's place

2. stepsOptions

const stepsOptions = [
  [{ content: '步骤 1', width: 100 }],
  [{ content: '步骤 2', }],
  [{ content: '步骤 3-1', width: 100 }, { content: '步骤 3-2', }, { content: '步骤 3-3', width: 100 }], // 第四行
  [{}, { content: '通过', }, { content: ' 不通过', }],
  [{ content: '结束', }],
]

3. linesTemplate

const linesTemplate = `
1_1-(down)->2_1-(downLeftDown)-z>3_1-(downRightDown)-z>4_2-(right)->4_3-(rightUpLeft)-c>1_1
4_3-(downLeft)->5_1
1_1-(leftDownRight)-c>2_1
2_1-(downRightDown)-z>3_3
3_2-(down)->4_1
3_3-(left)->3_2
4_1-(down)->5_1`

!attention, ignore empty steps( {} )

4. result data
this.lines = {
  "line1": {
    "text": "",
    "className": "down arrow",
    "direction": "down",
    "style": { "left": "360px", "top": "100px", "width": "1px", "height": "71.6px" }
  },
  "line2": {
    "text": "",
    "className": "down arrow",
    "direction": "down",
    "style": { "left": "130px", "top": "223.6px", "width": "230px", "height": "71.6px" }
  }
}

this.steps = {
  "step1": {
    "className": "",
    "content": "业务小微提出资质需求",
    "style": { "top": "50px", "left": "310px", "width": "100px", "height": "50px" }
  },
  "step2": {
    "className": "",
    "content": "平台主审批",
    "style": { "top": "173.6px", "left": "260px", "width": "200px", "height": "50px" }
  },
]

# idea

1. (discarded idea) you can use linesOptions directly as well as linesTemplate

# attention

1. for well display, 'content-box' div is applied

# update
1. docs ---- 2020-06-16 12:55:01
2. enable custom unit like 'vw' ---- 2020-06-19 00:56:15
3. update demo data ---- 2020-06-20 14:58:21

*/
import { firstWordLowerCase } from '@/utils/base'
import { IFlowChartOptions, ILineItem, ILineOptions, IPAndD, IRawOptions, IRichOptions, IRichStepItem, Point, Position, Direction, IStepItem, } from './flowChartType'

export class FlowChartGenerator {
  private goldenRatio = 0.618
  private chartWidth = 0
  private chartHeight = 0
  private unit: string
  private baseOptions: IFlowChartOptions
  private richStepsData: IRichOptions[] = []
  private richStepsDataWithoutEmpty: IRichOptions[] = []
  private stepsList: IStepItem[] = []
  private steps: {[prop: string]: IStepItem } = {}
  private linesList: ILineItem[] = []
  private lines: {[prop: string]: ILineItem } = {}
  private directionList: string[] = ['up', 'down', 'left', 'right', 'upDown', 'upDownUp', 'upDownUp', 'upDownDown', 'upDownLeft', 'upDownRight', 'upLeft', 'upLeftUp', 'upLeftUp', 'upLeftDown', 'upLeftLeft', 'upLeftRight', 'upRight', 'upRightUp', 'upRightUp', 'upRightDown', 'upRightLeft', 'upRightRight', 'downUp', 'downUpDown', 'downUpUp', 'downUpDown', 'downUpLeft', 'downUpRight', 'downLeft', 'downLeftDown', 'downLeftUp', 'downLeftDown', 'downLeftLeft', 'downLeftRight', 'downRight', 'downRightDown', 'downRightUp', 'downRightDown', 'downRightLeft', 'downRightRight', 'leftUp', 'leftUpLeft', 'leftUpUp', 'leftUpDown', 'leftUpLeft', 'leftUpRight', 'leftDown', 'leftDownLeft', 'leftDownUp', 'leftDownDown', 'leftDownLeft', 'leftDownRight', 'leftRight', 'leftRightLeft', 'leftRightUp', 'leftRightDown', 'leftRightLeft', 'leftRightRight', 'rightUp', 'rightUpRight', 'rightUpUp', 'rightUpDown', 'rightUpLeft', 'rightUpRight', 'rightDown', 'rightDownRight', 'rightDownUp', 'rightDownDown', 'rightDownLeft', 'rightDownRight', 'rightLeft', 'rightLeftRight', 'rightLeftUp', 'rightLeftDown', 'rightLeftLeft', 'rightLeftRight']

  constructor(baseOptions: IFlowChartOptions) {
    this.baseOptions = baseOptions
    this.unit = baseOptions.unit || 'px'
  }

  init() {
    this.chartWidth = 0
    this.chartHeight = 0
    this.richStepsData = []
    this.richStepsDataWithoutEmpty = []
    this.steps = {}
    this.lines = {}
  }

  get chartWrapperStyle() {
    return {
      width: this.chartWidth + this.unit,
      height: this.chartHeight + this.unit
    }
  }

  getAndPrintSteps() {
    console.log('this.steps = ' + JSON.stringify(this.steps, null, 2))
    return this.steps
  }

  getAndPrintLines() {
    console.log('this.lines = ' + JSON.stringify(this.lines, null, 2))
    return this.lines
  }

  getAndPrintWrapperStyle() {
    const _style = this.chartWrapperStyle
    console.log(JSON.stringify(_style, null, 2))
    return _style
  }

  setRichStepsData(optionsList: IRawOptions[]) {
    this.init()
    this.handleStepsOptions(optionsList)
    this.generateSteps()
  }

  generateSteps() {
    this.stepsList = []
    if (this.richStepsData.length === 0) {
      console.error('Please set richStepsData before running generateSteps method')
    }
    let _count = 1
    this.richStepsData.forEach((items: IRichOptions) => {
      items.list.forEach(item => {
        // remove empty step
        if (!item.content) return
        this.stepsList.push({
          className: '',
          content: item.content,
          style: {
            top: item.y + this.unit,
            left: item.x + this.unit,
            width: item.width + this.unit,
            height: item.height + this.unit,
          }
        })
      })
    })

    this.getRichStepsDataWithoutEmpty(

    )
    this.stepsList.forEach(item => {
      this.steps['step' + _count] = item
      _count += 1
    })
  }

  generateLines(template: string) {
    this.linesList = []
    template
      .split(/\n|;/)
      .map(item => item.trim())
      .filter(item => item)
      .forEach(t => this.handleSingleLineTemplate(t))

    let _count = 1
    this.linesList.forEach(item => {
      this.lines['line' + _count] = item
      _count += 1
    })
  }

  getRichStepsDataWithoutEmpty() {
    this.richStepsDataWithoutEmpty = JSON.parse(JSON.stringify(this.richStepsData))
    this.richStepsDataWithoutEmpty.forEach(item => {
      item.list = item.list.filter(item => item.content !== '')
    })
  }

  // generate chartHeight + chartWidth + richData
  handleStepsOptions(optionsList: IRawOptions[]) {
    console.warn('attention, a real step item\'s content property is required')
    const _rawOptionsList: IRawOptions[] = JSON.parse(JSON.stringify(optionsList))
    const _richOptionsList: IRichOptions[] = []
    const _allNodeList: IRichStepItem[] = []

    _rawOptionsList.forEach((listItem: IRawOptions, index: number) => {
      const _listLength = listItem.length
      const _s = this.baseOptions

      const _richListItem: IRichStepItem[] = listItem.map((item, subIndex) => {
        const distanceMulriple = subIndex + 0.5 - _listLength / 2
        const _item: IRichStepItem = {
          content: item.content || '',
          width: item.width || _s.width,
          height: item.height || _s.height,
          x: distanceMulriple * (_s.width + _s.spaceX),
          y: _s.width * this.goldenRatio * index + _s.spaceY,
          ex: 0,
          ey: 0,
        }
        _item.ex = _item.x + _item.width
        _item.ey = _item.y + _item.height

        _allNodeList.push(_item)

        return _item
      })

      _richOptionsList[index] = {
        list: _richListItem,
        width: _listLength * (_s.width + _s.spaceX) + _s.spaceX,
        rangeX: [0, 0]
      }
    })

    this.chartWidth = _richOptionsList // 获取最长的一个
      .map(item => item.width || 0)
      .reduce((x, y) => { return x > y ? x : y })

    this.chartHeight = _rawOptionsList.length * this.goldenRatio * this.baseOptions.width

    // item.x
    _allNodeList.forEach(item => {
      item.x = item.x + this.chartWidth / 2 - item.width / 2 // x 右移，转换成相对背景的中线
      item.ex = item.x + item.width
      item.ey = item.y + item.height
    })

    // one row's width can only be set after all step's 'x' property has been set
    _richOptionsList.forEach(listItem => {
      listItem.rangeX = [listItem.list[0].x, listItem.list[listItem.list.length - 1].ex]
    })

    this.richStepsData = _richOptionsList
  }

  // input two point, output left-top&right-bottom core defined square
  generateSquare(startPoint: Point, endPoint: Point) {
    const _xList: Point = ([startPoint[0], endPoint[0]] as Point).sort((x, y) => x - y)
    const _yList: Point = ([startPoint[1], endPoint[1]] as Point).sort((x, y) => x - y)
    const _startPoint = [_xList[0], _yList[0]]
    const _endPoint = [_xList[1], _yList[1]]

    return {
      x: _startPoint[0],
      y: _startPoint[1],
      width: _endPoint[0] - _startPoint[0] || 1,
      height: _endPoint[1] - _startPoint[1] || 1,
    }
  }

  getPoint(stepData: IRichStepItem, position: Position): Point {
    const _d = stepData
    if (position === 'top') {
      return [_d.x + _d.width / 2, _d.y]
    } else if (position === 'bottom') {
      return [_d.x + _d.width / 2, _d.ey]
    } else if (position === 'left') {
      return [_d.x, _d.y + _d.height / 2]
    } else {
      return [_d.ex, _d.y + _d.height / 2]
    }
  }

  drawLine(startPoint: Point, endPoint: Point, type: Direction, extraClass = '', endOffset = true) {
    const _start: Point = [startPoint[0], startPoint[1]]
    const _end: Point = [endPoint[0], endPoint[1]]
    const _square = this.generateSquare(_start, _end)
    const _lw = this.baseOptions.lineWidth

    if (this.unit === 'px') {
      if (endOffset === true) {
        const _match = type.match(/[A-Z]?[a-z]*?$/)
        if (_match) {
          const _endDiretion = _match[0].toLowerCase()
          if (_endDiretion === 'up') {
            _square.y += _lw
            _square.height -= _lw
          } else if (_endDiretion === 'down') {
            _square.height -= _lw
          } else if (_endDiretion === 'left') {
            _square.x += _lw
            _square.width -= _lw
          } else if (_endDiretion === 'right') {
            _square.width -= _lw
          }
        }
      }

      // discarded
      // if (['downLeft'].includes(type)) {
      //   _square.width += _lw
      // }

      // if (['rightDown', 'leftDown'].includes(type)) {
      //   _square.y -= _lw
      //   _square.height += _lw
      // }

      // if (['upLeft'].includes(type)) {
      //   _square.y -= _lw
      //   _square.height += _lw
      // }
    }

    this.linesList.push({
      text: '',
      className: type + ' ' + extraClass,
      direction: type,
      style: {
        left: _square.x + this.unit,
        top: _square.y + this.unit,
        width: _square.width + this.unit,
        height: _square.height + this.unit,
      }
    })
  }

  zDrawLine(startPoint: Point, endPoint: Point, type: Direction, rate = this.goldenRatio) {
    const _pStart = startPoint
    const _pCenterX = Math.abs(startPoint[0] - endPoint[0]) * rate + (startPoint[0] > endPoint[0] ? endPoint[0] : startPoint[0])
    const _pCenterY = Math.abs(startPoint[1] - endPoint[1]) * rate + (startPoint[1] > endPoint[1] ? endPoint[1] : startPoint[1])
    const _pCenter: Point = [_pCenterX, _pCenterY]
    const _pEnd = endPoint

    this.drawLine(_pStart, _pCenter, (type.match(/^[a-z]*?[A-Z][a-z]*/) as any)[0], '', false)

    this.drawLine(
      _pCenter,
      _pEnd,
      (firstWordLowerCase((type.match(/[A-Z].*$/) as any)[0]) as Direction),
      (type.match(/^[a-z]*/) as any)[0] + 'Offset arrow', // 'xxxOffset' className
    )
  }

  cDrawLine(startPoint: Point, endPoint: Point, type: Direction, target: number, isTarget = true) {
    const _pStart = startPoint
    const _pEnd = endPoint
    const _firstDirection = (type.match(/^[a-z]*/) as any)[0]
    const _px1 = startPoint[0]
    const _py1 = startPoint[1]
    const _px2 = endPoint[0]
    const _py2 = endPoint[1]

    let _target = 0
    if (isTarget === true) {
      _target = target
    } else {
      if (_firstDirection === 'up') {
        _target = _py1 > _py2 ? _py2 - target : _py1 - target
      } else if (_firstDirection === 'down') {
        _target = _py1 > _py2 ? _py1 + target : _py2 + target
      } else if (_firstDirection === 'left') {
        _target = _px1 > _px2 ? _px2 - target : _px1 - target
      } else if (_firstDirection === 'right') {
        _target = _px1 > _px2 ? _px1 + target : _px2 + target
      } else {
        console.error(`firstDirection unmatched, current: ${_firstDirection}`)
      }
    }

    let _pCenter: Point = [0, 0]
    if (['up', 'down'].includes(_firstDirection)) {
      _pCenter = [(_px1 + _px2) / 2, _target]
    } else {
      _pCenter = [_target, (_py1 + _py2) / 2]
    }

    this.drawLine(_pStart, _pCenter, (type.match(/^[a-z]*?[A-Z][a-z]*/) as any)[0], '', false)

    this.drawLine(
      _pCenter,
      _pEnd,
      (firstWordLowerCase((type.match(/[A-Z].*$/) as any)[0]) as Direction),
      'arrow',
    )
  }

  // get item from '1_1' type template text
  getStepItem(str: string): IRichStepItem {
    try {
      const _indexs = str.split('_')
      return this.richStepsDataWithoutEmpty[parseInt(_indexs[0]) - 1].list[parseInt(_indexs[1]) - 1]
    } catch (e) {
      console.log(e)
      throw new Error(`获取 step fail，error template: ${str}, expect something like '1_1'`)
    }
  }

  getPositionAndDirection(str: Direction): IPAndD {
    const _startDict: {[prop: string]: Position} = { up: 'top', down: 'bottom', left: 'left', right: 'right' }
    const _endDict: {[prop: string]: Position} = { up: 'bottom', down: 'top', left: 'right', right: 'left' }
    const _startReg = /^[a-z]*/
    const _endReg = /[A-Z]?[a-z]*?$/
    const _start = (str.match(_startReg) as any)[0]
    const _end = (str.match(_endReg) as any)[0].toLowerCase()
    return {
      startDirection: _start,
      endDirection: _end,
      endPosition: _endDict[_end],
      startPosition: _startDict[_start],
    }
  }

  getEdgePointList(startStep: IRichStepItem, endStep: IRichStepItem, startIndex: number, endIndex: number, direction: Direction): number[] {
    const [small, big] = [startIndex, endIndex].sort((x, y) => x - y)
    if (!['left', 'right'].includes(direction)) {
      console.error('only direction \'left\' and \'right\' are arroy in drawing c line')
    }
    if (direction === 'left') {
      return [
        startStep.x,
        endStep.x,
        ...this.richStepsDataWithoutEmpty.map(item => item.rangeX[0]).splice(small, big - small)
      ]
    } else if (direction === 'right') {
      return [
        startStep.ex,
        endStep.ex,
        ...this.richStepsDataWithoutEmpty.map(item => item.rangeX[1]).splice(small, big - small)
      ]
    }
    // up down ?
    return []
  }

  // getExtendSpace
  // 获取需要拓展到的地方的 x 坐标
  getExtendFromList(list: number[], direction: Direction): number {
    if (direction === 'left') {
      const min = list.reduce((x, y) => { return x > y ? y : x })
      return min * this.goldenRatio
    } else {
      const max = list.reduce((x, y) => { return x > y ? x : y })
      return this.chartWidth - this.goldenRatio * (this.chartWidth - max)
    }
  }

  getExtendLineX(startStep: IRichStepItem, endStep: IRichStepItem, startIndex: number, endIndex: number, direction: Direction): number {
    const _list: number[] = this.getEdgePointList(startStep, endStep, startIndex, endIndex, direction)
    return this.getExtendFromList(_list, direction)
  }

  //  template demo: '1_1-(down)->2_1-(downRightDown)-z>3_3-(downLeftDown)-z>4_2-(rightUpLeft)-c>1_1'
  handleSingleLineTemplate(template: string) {
    const stepTemplateList = template.match(/\d*_\d*/g)
    const directionList = template.match(/\(.*?\)-\w?>/g)
    const optionsList: ILineOptions[] = []

    if (!stepTemplateList || !directionList || (stepTemplateList.length - directionList.length) !== 1) {
      console.error('template error1')
    } else {
      directionList.forEach((item, index) => {
        try {
          const _match = item.match(/\((.*?)\)-(.?)>/)
          if (!(_match && _match[1]))console.error(`error template: ${item}`)
          const { startPosition: _startPosition, endPosition: _endPosition, startDirection: _startDirection } = this.getPositionAndDirection((_match && _match[1]) as any)
          const _startLineIndex = parseInt(stepTemplateList[index].split('_')[0]) - 1
          const _endLineIndex = parseInt(stepTemplateList[index + 1].split('_')[0]) - 1
          const _startStep: IRichStepItem = this.getStepItem(stepTemplateList[index])
          const _startPoint = this.getPoint((_startStep as any), _startPosition)
          const _endStep: IRichStepItem = this.getStepItem(stepTemplateList[index + 1])
          const _endPoint = this.getPoint((_endStep as any), _endPosition)

          const _type = (((_match && _match[2]) || '') + 'line' as any)

          const _data: ILineOptions = {
            startStep: _startStep,
            startPoint: _startPoint,
            endStep: _endStep,
            endPoint: _endPoint,
            startPosition: _startPosition,
            endPosition: _endPosition,
            type: _type,
            direction: (_match && _match[1] as any),
          }

          if (_type === 'cline') {
            _data.target = this.getExtendLineX(_startStep, _endStep, _startLineIndex, _endLineIndex, _startDirection)
          }

          optionsList.push(_data)
        } catch (e) { console.error(`template error2: ${item}`) }
      })

      // create line options
      optionsList.forEach(lineItem => {
        if (lineItem.type === 'zline') {
          this.zDrawLine(lineItem.startPoint, lineItem.endPoint, lineItem.direction,)
        } else if (lineItem.type === 'cline') {
          this.cDrawLine(lineItem.startPoint, lineItem.endPoint, lineItem.direction, (lineItem.target as any))
        } else {
          this.drawLine(lineItem.startPoint, lineItem.endPoint, lineItem.direction, 'arrow')
        }
      })
    }
  }
}
