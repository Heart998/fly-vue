// 任务管理
import httpRequest from '../../utils/httpRequest'

// 获取列表
export function getDataList (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/taskdef/list'),
    method: 'get',
    params
  })
}
// 新增保存任务
export function addTask (data) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/taskdef/saveTask'),
    method: 'post',
    data
  })
}
// 修改保存任务
export function editTask (data) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/taskdef/updateTask'),
    method: 'post',
    data
  })
}
// 执行任务 defId
export function saveBatch (data) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/taskbatch/saveBatch'),
    method: 'post',
    data
  })
}

// 点击查看 根据id 获得基本信息
export function getBaseInfo (id) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/taskdef/infoById/' + id),
    method: 'get'
  })
}
// 根据id获取批次列表信息
export function getPcList (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/taskbatch/list'),
    method: 'get',
    params
  })
}

// 根据当前批次列表code查询改批次所有被分配到任务的人员列表
export function getPcXqList (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/task/list'),
    method: 'get',
    params
  })
}
// 根据id回显当前form表单信息方便修改
export function getInfoById (id) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/taskdef/infoById/'+ id),
    method: 'get'
  })
}
// 根据id关闭执行长的固定任务
export function closeFn (id) {
    return httpRequest({
      url: httpRequest.adornUrl('/biz/taskdef/closeTask/'+ id),
      method: 'get'
    })
  }
