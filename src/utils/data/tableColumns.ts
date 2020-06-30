import Handler from './handler'
// # 系统管理
//   角色管理
export const roleManagement: string[] = [
  'roleCode-编码-number',
  'description-描述-text'
]

// 用户管理
export const userManagement: string[] = [
  'accountIDName-登录名-text',
  'name-姓名-name',
  'belongDepartment-所属部门-text',
  'whetherFreezing-是否冻结-toggle',
  'sex-性别-sex',
  'phone-电话-phone',
  'permissionOperate-权限操作-text'
]
// 机构管理
// todo
export const organizationalManagement: string[] = [
  'organizationName-组织架构名称-text',
  'name-负责人-name',
  'organizationStructure-组织架构类别-text',
  'permissionRange-权限范围-text',
  'updateName-更新人-name',
  'updateNameTime-更新时间-time'
]

//  菜单管理
// todo
export const menuManagement: string[] = [
  'menuName-菜单名称-text',
  'menuPath-菜单路径-text',
  'isOpen-是否开放-toggle'
]

//  #经营资质
//   资质概况
export const qualificationProfile: string[] = [
  'companyName-公司名称-name',
  'qualificationName-对应资质-text',
  'businessScope-许可范围-text',
  'approvalAuthority-审批机关-text',
  'validPeriod-有效期限-time',
  'status-状态-testRandom'
]

//  资质详情
export const qualificationDetail: string[] = [
  'companyName-公司名称-name',
  'qualificationName-对应资质-text',
  'businessScope-许可范围-text',
  'approvalAuthority-审批机关-text',
  'validityPeriod-有效期限-time',
  'status-操作-testRandom'
]

//  申请列表
export const applicantList: string[] = [
  'applyNumber-申请编号-number',
  'licenseName-所需许可名称-name',
  'applicantName-申请人姓名-name',
  'status-操作-test'
]

//
export const checklistApplication: string[] = [
  'fileType-文件类型',
  'clearPaperName-文件名称',
]

// 资质指南
export const qualificationGuideline: string[] = [
  'id-编号-number',
  'licenseName-名称-name',
  'createTime-创建时间-time', // todo
  'updateTime-发布时间-time', // todo
  'status-状态-status',
  'operator-操作-text'
]

export const handler = new Handler('tableColumns').tableTemplateHandler
