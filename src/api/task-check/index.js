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

// 抽查保存
export function taskauditSpot(data) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/taskaudit/spot'),
    method: 'post',
    data
  })
}
//  获取列表
export function getDataList(params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/taskaudit/spotList'),
    method: 'get',
    params
  })
}
