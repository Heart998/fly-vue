// 问题整改
import httpRequest from '../../../utils/httpRequest'

// 获取列表
export function getDataList (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/commonproblem/list'),
    method: 'get',
    params
  })
}

// 回显表单
export function getFormsHx (id) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/commonproblem/info/' + id),
    method: 'get'
  })
}

// 新增表单
export function saveForms (data) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/commonproblem/saveCommonProblem'),
    method: 'post',
    data
  })
}
// 修改表单
export function updateForms (data) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/commonproblem/updateCommonProblem'),
    method: 'post',
    data
  })
}
  // 发起整改
export function addTaskDef (data) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/commonproblem/addTaskDef'),
    method: 'post',
    //   data: httpRequest.adornData(data)
    data
  })
}
    // 删除
export function deleteFn (id) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/commonproblem/deleteById/' + id),
    method: 'get'
  })
}

    //   获取工作量汇总表格数据
export function getWorkloadSummary (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/works/list'),
    method: 'get',
    params
  })
}
      //  获取工作量汇总表格数据导出Excel
export function getWorkloadSummaryExport (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/works/export'),
    method: 'get',
    responseType: 'arraybuffer',
    params
  })
}

    //   获取排查工作量汇总表格数据
    export function getLinkmanRisk (params) {
      return httpRequest({
        url: httpRequest.adornUrl('/biz/linkmanrisk/list'),
        method: 'get',
        params
      })
    }

      //  获取排查工作量表格数据导出Excel
  export function getLinkmanRiskExport (params) {
        return httpRequest({
          url: httpRequest.adornUrl('/biz/linkmanrisk/exportLinkmanRisk'),
          method: 'get',
          responseType: 'arraybuffer',
          params
        })
      }

      //   获取确认问题汇总列表数据
export function getQueryConfirmationProblem (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/ConfirmationProblem/queryConfirmationProblem'),
    method: 'get',
    params
  })
}
        //   获取风险线索汇总列表数据
export function getQueryViewRiskClues (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/commonclue/getCommonClue'),
    method: 'get',
    params
  })
}
          //   获取部门绩效考核统计列表数据
export function getPerformanceList (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/performance/list'),
    method: 'get',
    params
  })
}
        //  获取部门绩效考核统计列表数据导出Excel
export function getPerformanceListExport (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/performance/export'),
    method: 'get',
    responseType: 'arraybuffer',
    params
  })
}
          //   获取职场绩效考核统计列表数据
export function getPerformanceZcList (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/performanceZc/list'),
    method: 'get',
    params
  })
}
        //   获取职场绩效考核统计列表数据导出Excel
export function getPerformanceZcListExport (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/performanceZc/export'),
    method: 'get',
    responseType: 'arraybuffer',
    params
  })
}

export function exportViewRiskClues (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/commonclue/exportCommonClue'),
    method: 'get',
    responseType: 'arraybuffer',
    params
  })
}

export function exportConfirmationProblem (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/ConfirmationProblem/exportConfirmationProblem'),
    method: 'get',
    responseType: 'arraybuffer',
    params
  })
}
export function exportCommonProblem (params) {
  return httpRequest({
    url: httpRequest.adornUrl('/biz/commonproblem/exportCommonProblem'),
    method: 'get',
    responseType: 'arraybuffer',
    params
  })
}
