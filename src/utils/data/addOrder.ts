import Handler from './handler'

// # 系统管理
//   角色管理
export const roleManagement: string[] = [
  'roleCode-编码-input',
  'description-描述-input',
]

//  用户管理
export const userManagement: string[] = [
  'accountIDName-登录名-input',
  'name-姓名-input',
  'belongDepartment-所属部门-input',
  'whetherFreezing-是否冻结-input',
  'sex-性别-input',
  'phone-电话-input',
  'permissionOperate-权限操作-input',
]

// 机构管理
// todo
export const organizationalManagement: string[] = [
  'organizationName-组织架构名称-input',
  'name-负责人-input',
  'organizationStructure-组织架构类别-input',
  'permissionRange-权限范围-input',
  'updateName-更新人-input',
  'updateNameTime-更新时间-input',
]

//  菜单管理
// todo
export const menuManagement: string[] = [
  'menuName-菜单名称-input',
  'menuPath-菜单路径-input',
  'isOpen-是否开放-input',
]

//  #经营资质
//   资质概况
export const qualificationProfile: string[] = [
  'companyName-公司名称-input',
  'qualificationName-对应资质-input',
  'businessScope-许可范围-input',
  'approvalAuthority-审批机关-input',
  'validPeriod-有效期限-input',
  'status-状态-input',
]

//  资质详情
export const qualificationDetail: string[] = [
  'companyName-公司名称-input',
  'qualificationName-对应资质-input',
  'businessScope-许可范围-input',
  'approvalAuthority-审批机关-input',
  'validityPeriod-有效期限-input',
  'status-操作-input',
]

//  申请列表
export const applicantList: string[] = [
  'applyNumber-申请编号-input',
  'licenseName-所需许可名称-input',
  'applicantName-申请人姓名-input',
  'status-操作-input',
]

// 资质指南
export const qualificationGuideline: string[] = [
  'id-编号-input',
  'licenseName-名称-input',
  'start,end-创建时间-dateRange',
  'time-发布时间-input',
  'status-状态-input',
  'operator-操作-input',
]

export const handler = new Handler('addOptions').formTemplateHandler
