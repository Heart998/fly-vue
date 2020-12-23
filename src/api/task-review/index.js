// 任务审核
import httpRequest from '../../utils/httpRequest'

// 任务审核-通过外面列表id 传taskId获取时效性扣分
export function taskauditDateMark(params) {
    return httpRequest({
      url: httpRequest.adornUrl('/biz/taskaudit/dateMark'),
      method: 'get',
      params
    })
  }

// 审核保存
export function taskauditAudit(data) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/taskaudit/audit'),
    method: 'post',
    data
  })
}
//  获取列表
export function getDataList(params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/taskaudit/auditList'),
    method: 'get',
    params
  })
}
// 查看审核信息
export function getSHForms(params) {
    return httpRequest({
      url: httpRequest.adornUrl('/biz/taskaudit/info'),
      method: 'get',
      params
    })
  }