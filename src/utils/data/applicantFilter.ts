import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
Vue.filter('globalApplicantStatus', function(value: any) {
  if (value === 2) {
    return '经营资质节点反馈申请材料清单'
  } else if (value === 1) {
    return '经营资质节点签收'
  } else if (value === 3) {
    return '经营资质节点准备证明类材料'
  } else if (value === 4) {
    return '经营资质节点汇总材料提交资质申请'
  } else if (value === 5) {
    return '行政部门审批'
  } else if (value === 6) {
    return '经营资质节点领证保管'
  } else if (value === 9) {
    return '审批不通过'
  }
})
