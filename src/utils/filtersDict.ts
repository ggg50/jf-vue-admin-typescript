
import Vue from 'vue'

export const filtersDict = { // Customize your filters dict
  $d: 'dateFormatter',
  $t: 'timeFormatter',
  $m: 'moneyFormatter',
  $a: 'toThousandFilter'
}

export type IFilterKey = keyof typeof filtersDict

const filterKeys = Object.keys(filtersDict)

export function getGlobalFilter(key: IFilterKey, vm: Vue): Function {
  if (!filterKeys.includes(key)) console.log(`current key ${key} no found, which mean there is no present filter in dict match with it`)

  const _filters = vm.$options.filters
  const _filterName = filtersDict[key]
  if (_filters?.[_filterName]) {
    return _filters[_filterName]
  } else {
    console.error(
      `Global filters checking error, \n there is no global filter '${_filterName}' found in current project, if you are in dev environment,  you can create it or modify the filterDict's ${key} property within filtersDict file`
    )
    return (value: any) => value
  }
}
