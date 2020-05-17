
import _ from 'lodash'

export {
    replaceArrayItem,
}

interface IterateFn<T> {
    (value: any, index: number, obj: any[]): T;
}
interface CompareFn {
    (item1: any, item2: any): boolean
}

/** 
 * replace the first match item in one array
 * @param {boolean} change whether clone the raw array or not 
 */ 

function replaceArrayItem(arr: Array<any>, newItem: any, compareFn: CompareFn, change: boolean = true): Array<any> {
    let _arr = change ? _.cloneDeep(arr) : arr
    function _compareFn(item: any) {
        return compareFn(item, newItem)
    }
    let _index = _arr.findIndex(_compareFn)

    if(_index === -1) _arr.push(newItem)
    _arr.splice(_index, 1, newItem)
    return _arr
}
