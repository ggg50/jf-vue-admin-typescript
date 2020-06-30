export default class Handler {
  fileName: string
  formTemplateHandler: {[prop: string]: (obj: {[prop: string]: any}, prop: string) => string[]}
  tableTemplateHandler: {[prop: string]: (obj: {[prop: string]: any}, prop: string) => string[]}

  constructor(fileName: string) {
    this.fileName = fileName

    this.formTemplateHandler = {
      get: (obj: {[prop: string]: any}, prop: string): string[] => {
        if (prop in obj) {
          let _list = JSON.parse(JSON.stringify(obj[prop]))
          if (typeof _list[0] === 'string') {
            _list = _list.map((item: string) => {
              try {
                const values = item.split('-')
                const _option: {[prop: string]: any} = {
                  key: values[0].trim(),
                  label: values[1].trim(),
                  type: values[2].trim(),
                }
                if (_option.type === 'select') {
                  if (values.length < 5) {
                    console.error('模板不符合规范，当前模板类型是‘select’，长度应该是 5 个单位')
                  }
                  if (values[3]) _option.keyList = values[3].split(',').map(item => item.trim())
                  if (values[4]) _option.valueList = values[4].split(',').map(item => item.trim())
                }

                if (/range/i.test(_option.type)) {
                  _option.key = _option.key.split(',').map((item: string) => item.trim())
                  if (_option.key.length !== 2) {
                    console.error('模板不符合规范，‘range’ 类型的 key 因为有两个，用逗号分开，比如 start,end')
                  }
                }

                return _option
              } catch (e) {
                console.error(`fileName: ${this.fileName}`)
                console.error('formTemplateHandler')
                console.error(`模板出错：${item}`)
                console.log(e)
                return []
              }
            })
          }
          return _list
        }
        return []
      }
    }

    this.tableTemplateHandler = {
      get: (obj: {[prop: string]: any}, prop: string): string[] => {
        if (prop in obj) {
          let _list = JSON.parse(JSON.stringify(obj[prop]))
          if (typeof _list[0] === 'string') {
            _list = _list.map((item: string) => {
              try {
                const values = item.split('-')
                return {
                  key: values[0].trim(),
                  title: values[1].trim(),
                  random: values[2] && values[2].trim()
                }
              } catch (e) {
                console.error(`fileName: ${this.fileName}`)
                console.error('tableTemplateHandler')
                console.error(`模板出错：${item}`)
                console.log(e)
                return []
              }
            })
          }
          return _list
        }

        return []
      }
    }
  }
}
