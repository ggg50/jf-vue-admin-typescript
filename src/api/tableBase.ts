import request from '@/utils/request'

/*
接口规范
# search
path: {path}/search GET
e.g: /qualify/survey/search
params:
currentPage:
pageSize
orderBy ?:

# add
path: {path}/add POST
e.g: /qualify/survey/add

# delete
path: {path}/delete DELETE
e.g: /qualify/survey/delete
data:
  paperIds: 'id1-id2'

# edit
path: {path}/edit POST
e.g: /qualify/survey/edit
data:
  paperId: 'id',
  others data

# freeze & unfreeze:
todo .
path: /{path}/edit/ice
data:
  paperIds: 'id1-id2-id3', id
  operator: 1-freeze; 2-unfreeze

!attention
每一个 id 的具体 key 要根据实际情况而定
*/

export const baseSearchApi = (path: string, params: {[prop: string]: any}) =>
  request({
    url: `${path}/search`,
    method: 'get',
    params: {
      pageSize: 10,
      ...params
    },
  })

// export const baseSearchOneApi = (path: string, id: string, params: {[prop: string]: any}) =>
//   request({
//     url: `/${path}/query/list/${id}`,
//     method: 'get',
//     params,
//   })

export const baseAddApi = (path: string, data: {[prop: string]: any}) =>
  request({
    url: `${path}/add`,
    method: 'POST',
    data
  })

type DeleteData = {[prop: string]: string}
export const baseDeleteApi = (path: string, data: DeleteData) =>
  request({
    url: `${path}/delete`,
    method: 'DELETE',
    data
  })

export const baseEditApi = (path: string, data: {[prop: string]: any}) =>
  request({
    url: `${path}/edit`,
    method: 'POST',
    data
  })

// todo
export const baseFreezeApi = (path: string, data: {[prop: string]: any}) =>
  request({
    url: `/${path}/edit/ice`,
    method: 'PUT',
    data
  })
