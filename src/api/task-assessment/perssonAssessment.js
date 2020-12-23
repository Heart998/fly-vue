// 模板考核
import httpRequest from '../../utils/httpRequest'

// 获取列表
export function getList (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/usercheck/list'),
    method: 'get',
    params
  })
}

// 获取员工基本信息
export function getBseInfo (params) {
    return httpRequest({
      url: httpRequest.adornUrl('/biz/usercheck/info'),
      method: 'get',
      params
    })
  }
  

// 人员考核保存
export function saveUserCheck (data) {
    return httpRequest({
      url: httpRequest.adornUrl('/biz/usercheck/update'),
      method: 'post',
      data
    })
  }

  // 获取员工确认列表数据
export function getUserStaffList (params) {
    return httpRequest({
      url: httpRequest.adornUrl('/biz/usercheck/staffList'),
      method: 'get',
      params
    })
  }

  // 员工确认按钮
export function userAffirm (params) {
    return httpRequest({
      url: httpRequest.adornUrl('/biz/usercheck/affirm'),
      method: 'get',
      params
    })
  }
  