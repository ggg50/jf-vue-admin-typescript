import { userBaseInfo, roleItem, menuItem } from '../../api/testData/userData'

// request
export interface ILogin {
  username: string
  password: string
  captchaId: string
  captchaCode: string
}
// response

export type UserInfo = typeof userBaseInfo
export type RoleItem = typeof roleItem
export type RoleInfo = RoleItem[]
export type MenuItem = typeof menuItem
export type MenuInfo = MenuItem[]

export interface IUserInfoAndMenu {
  roles: RoleInfo
  user: UserInfo
  menus: MenuInfo
}
