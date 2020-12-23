// 模板考核
import httpRequest from '../../utils/httpRequest'

// 新增模板
export function addAssessnebtManage (data) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/checktemplate/saveTemplate'),
    method: 'post',
    data
  })
}

// 获取列表数据
export function getList (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/checktemplate/list'),
    method: 'get',
    params
  })
}
// 详情回显
export function hxFroms (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/checktemplate/info/' + params),
    method: 'get'
  })
}
// 修改保存
export function saveEdit (data) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/checktemplate/update'),
    method: 'post',
    data
  })
}

export function delFn (data) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/checktemplate/delete'),
    method: 'post',
    data
  })
}
