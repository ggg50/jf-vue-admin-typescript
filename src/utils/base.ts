
import _ from 'lodash'

export {
    replaceArrayItem,
}

interface IterateFn<T> {
    (value: any, index: number, obj: any[]): T;
}

// replace the first match item in one array
function replaceArrayItem(arr: Array<any>, searchFn: IterateFn<void>, newItem: any): Array<any> {
    let _arr = _.cloneDeep(arr);
    let _index = _arr.findIndex(searchFn)
    if(_index === -1) _arr.push(newItem)
    _arr.splice(_index, 1, newItem)
    return _arr
}
