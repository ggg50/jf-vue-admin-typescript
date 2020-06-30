import Handler from './handler'

// #系统管理
// 用户管理
export const userManagement: string[] = [
  'count-账户-input',
  'nikName-昵称-input',
  'telphone-电话-input',
]

// # 经营资质
//   资质概况
export const qualificationProfile: string[] = [
  'companyName-公司名称-input',
  'qualificationName-资质名称-input',
]

//  资质详情
export const qualificationDetail: string[] = [
  'companyName-公司名称-input',
  'qualificationName-对应资质-input',
  'status-状态-input',
]
//  申请列表
export const applicantList: string[] = [
  'name-所需许可名称-input',
  'applyNameName-申请人姓名-input',
]

//  资质指南
export const qualificationGuideline: string[] = [
  'qualificationName-资质名称-input',
  'status-状态-input',
]

export const handler = new Handler('searchOptions').formTemplateHandler
