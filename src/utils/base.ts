
import _ from 'lodash'

export interface IIterateFn<T> {
    (value: any, index?: number, array?: any[]): T
}
export interface ICompareFn {
    (item1: any, item2: any): boolean
}

/**
 * replace the first match item in one array
 * @param {boolean} change whether clone the raw array or not
 */

export function replaceArrayItem(arr: Array<any>, newItem: any, compareFn: ICompareFn, change = true): Array<any> {
  const _arr = change ? _.cloneDeep(arr) : arr
  function _compareFn(item: any) {
    return compareFn(item, newItem)
  }
  const _index = _arr.findIndex(_compareFn)

  if (_index === -1) _arr.push(newItem)
  _arr.splice(_index, 1, newItem)
  return _arr
}

export function getChineseLength(string: string): number {
  const _matches = string.match(/[\u00ff-\uffff]/g)
  let _length = 0
  if (_matches) {
    _length = _matches.length * 2
    const _reg = new RegExp(_matches.join('|'), 'g')
    string = string.replace(_reg, '')
  }
  _length += string.length
  return _length
}

export function insertSpace(text: string, target: number): string {
  const _length = getChineseLength(text)
  if (_length < target) {
    text += ' '.repeat(target - _length)
    return text
  }
  return text
}

export function underlineToHump(value: string): string {
  return value.replace(/_(\w)/g, (_, w) => { return w.toUpperCase() })
}

export function firstWordUpperCase(str: string): string {
  return str.slice(0, 1).toUpperCase() + str.slice(1)
}

export function firstWordLowerCase(str: string): string {
  return str.slice(0, 1).toLowerCase() + str.slice(1)
}
