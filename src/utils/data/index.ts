
import * as tableColumns from './tableColumns'
import * as searchOrder from './searchOrder'
import * as addOrder from './addOrder'
import * as editOrder from './editOrder'

export default {
  tableColumns: new Proxy(tableColumns, tableColumns.handler),
  searchOptions: new Proxy(searchOrder, searchOrder.handler),
  addOptions: new Proxy(addOrder, addOrder.handler),
  editOptions: new Proxy(editOrder, editOrder.handler),
}
