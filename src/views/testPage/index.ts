
// // 自动生成权限的代码

// /*
// 实现的功能
// 从递归的层级变成一级，同时保持父子关系

// */

// // let permissionList = getPermissionList()

// import { data as permissionList } from '@/config/router.config'

// export function getPermissionList() {
//   const nameList = []; const permissionList = []

//   // 预处理，生成权限树
//   function getPermission(routerTree) {
//     return routerTree.map(getMetaAndChild)
//   }

//   function getMetaAndChild(item, index) {
//     // if(item.children){
//     //   console.log(item.children)
//     //   item.children.forEach(getMetaAndChild)
//     // }

//     const permissionName = item.meta && item.meta.permission && item.meta.permission[0]
//     if (!permissionName || nameList.indexOf(permissionName) > -1) return {} // 没有 permissionName 或者重复的去掉
//     nameList.push(permissionName)

//     if (!item.meta || !item.meta.title || !item.meta.permission) {
//       return {}
//     }

//     return ({
//       text: item.meta && item.meta.title,
//       name: item.meta && item.meta.permission && item.meta.permission[0],
//       children: item.children ? item.children.map(getMetaAndChild) : undefined
//     })
//   }

//   const treeData = getPermission(asyncRouterMap)

//   function fillRelation(item, parentName) {
//     if (item.name && parentName) item.parent = parentName
//   }

//   // tree，获取的数据格式，直接返回一个 list
//   function fillItemToPermissionList(tree, parentName) {
//     tree.forEach(item => {
//       permissionList.push({
//         name: item.name,
//         text: item.text,
//         parent: parentName,
//       })
//       if (item.children) {
//         fillItemToPermissionList(item.children, item.name)
//       }
//     })
//   }

//   fillItemToPermissionList(treeData, '')

//   return permissionList.filter(item => item.name)

//   // api - createMenuItem
//   // treeData.forEach(item => {

//   // })

//   // 创建的通用函数-调用 api
//   function innerCreateMainMenu(item, index) {
//     return createMenuItem({
//       menu_isopen: 0,
//       name: item.meta || item.meta.permission || item.meta.permission[0],
//       menu_order: index,
//       is_leaf: 0
//     })
//   }
// }

// export const data = getPermissionList()

// autoCreateMenu(permissionList)

// function autoCreateMenu(rawList) {
//   getMenu()
//     .then(res => {
//       const currentMenu = res.data
//       const currentMenuNameList = res.data.map(item => item.menuUrl)

//       if (currentMenuNameList.length === 0) {
//         createMenuItem({ name: '首页', key: 'root' })
//           .then(res => { autoCreateMenu(permissionList) })
//       } else {
//         console.log('currentMenuNameList', currentMenuNameList)
//         let currentItem
//         let parentId

//         const hasNew = rawList.some(item => {
//           if (currentMenuNameList.indexOf(item.name) === -1 && currentMenuNameList.indexOf(item.parent) > -1) {
//             console.log('当前 item', item)
//             currentItem = item
//             parentId = currentMenu[currentMenuNameList.indexOf(item.parent)].id

//             return true
//           }
//           return false
//         })

//         console.log('需要新加的 item', currentItem)
//         console.log('parentId', parentId)

//         if (hasNew) {
//           createNew(currentItem, parentId)
//             .then(res => { autoCreateMenu(permissionList) })
//         }
//       }
//     })
// }

// function createNew(item, parentId) {
//   return createMenuItem({
//     name: item.text,
//     key: item.name,
//     parent: parentId
//   })
// }

// // deleteMenu('5ea29934e32ffc7342ad2515')
// // deleteMenu('5ea28725e32ffc7342ad24cd')

// // menu_code - 菜单编号
// // menu_name - 菜单名
// // menu_isopen - 启用状态
// // menu_url - 菜单路径
// // menu_icon - 前段需要的icon
// // menu_order - 菜单排序 对应级别123456
// // parent_id - 菜单父级id 如没有则为0
// // is_leaf - 是否为主菜单0主1表示不是
// // func_ids - 按钮id集合（待定）
