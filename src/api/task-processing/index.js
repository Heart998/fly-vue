// 任务处理
import httpRequest from '../../utils/httpRequest'

// 点击查看 根据id 获得基本信息
export function getBaseInfo(params) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/task/info'),
        method: 'get',
        params
    })
}
// 点击查看 根据id 获得基本信息
// export function getInfo(data) {
//   return httpRequest({
//     url: httpRequest.adornUrl('/biz/task/info'),
//     method: 'post',
//     data
//   })
// }

// 条件搜索分页列表
export function getDataList(params) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/task/staffList'),
        method: 'get',
        params
    })
}

// 任务处理-通过id查看
export function getFormsHx(params) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/task/details'),
        method: 'get',
        params
    })
}

// 通过name查询负面清单代码的接口
export function getFMQDDM(params) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/commonproblemclassify/queryByName'),
        method: 'get',
        params
    })
}

// 通过code查询负面清单代码的接口
export function getFMQDDMCODE(params) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/commonproblemclassify/queryByCode'),
        method: 'get',
        params
    })
}
// 联系人-合规培训处理 提交接口
export function complianceTrainingSubmitFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/linkmantrain/save'),
        method: 'post',
        data
    })
}
// 联系人-合规培训处理 提交接口
export function complianceTrainingEditFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/linkmantrain/update'),
        method: 'post',
        data
    })
}
// 联系人-风险排查处理 提交接口
export function riskInvestigationSubmitFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/linkmanrisk/save'),
        method: 'post',
        data
    })
}

// 联系人-风险排查处理 修改接口
export function riskInvestigationEditFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/linkmanrisk/update'),
        method: 'post',
        data
    })
}

// 联系人-风险排查处理 暂存接口
export function riskInvestigationStaing(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/linkmanrisk/staing'),
        method: 'post',
        data
    })
}
// 联系人-督导检查 提交接口
export function linkmaninspectSubmitFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/linkmaninspect/save'),
        method: 'post',
        data
    })
}

// 联系人-督导检查 提交接口
export function linkmaninspectEditFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/linkmaninspect/update'),
        method: 'post',
        data
    })
}

// 联系人-问题线索报送 提交接口
export function linkmanclueSubmitFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/linkmanclue/save'),
        method: 'post',
        data
    })
}
// 联系人-问题线索报送 修改接口
export function linkmanclueEditFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/linkmanclue/update'),
        method: 'post',
        data
    })
}
// 联系人-报告报送 提交接口
export function linkmanreportSubmitFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/linkmanreport/save'),
        method: 'post',
        data
    })
}
// 联系人-报告报送 提交接口
export function linkmanreportEditFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/linkmanreport/update'),
        method: 'post',
        data
    })
}
// 联系人-联系人参与项目检查 提交接口
export function linkmanparticipationSubmitFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/linkmanparticipation/save'),
        method: 'post',
        data
    })
}
// 联系人-联系人参与项目检查 修改接口
export function linkmanparticipationEdit(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/linkmanparticipation/update'),
        method: 'post',
        data
    })
}
// 联络员-诚信合规教育 提交接口
export function contacttrainSubmitFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/contacttrain/saveContactTrain'),
        method: 'post',
        data
    })
}

// 联络员-诚信合规教育 修改接口
export function contacttrainEditFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/contacttrain/updateContactTrain'),
        method: 'post',
        data
    })
}

// 联络员-风险排除 提交接口
export function contactriskSubmitFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/contactrisk/saveContactRisk'),
        method: 'post',
        data
    })
}
// 联络员-风险排除 修改接口
export function contactriskEditFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/contactrisk/updateContactRisk'),
        method: 'post',
        data
    })
}

// 联络员-风险排除 暂存接口
export function staingContactRisk(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/contactrisk/staingContactRisk'),
        method: 'post',
        data
    })
}

// 联络员-职场巡查 提交接口
export function contactinspectSubmitFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/contactinspect/saveContactInspect'),
        method: 'post',
        data
    })
}
// 联络员-职场巡查 修改接口
export function contactinspectEditFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/contactinspect/updateContactInspect'),
        method: 'post',
        data
    })
}
// 联络员-人员访谈 提交接口
export function contactinterviewSubmitFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/contactinterview/saveContactInterview'),
        method: 'post',
        data
    })
}
// 联络员-人员访谈 提交接口
export function contactinterviewEditFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/contactinterview/updateContactInterview'),
        method: 'post',
        data
    })
}

// 联络员-线索报送 提交接口
export function contactclueSubmitFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/contactclue/saveContactClue'),
        method: 'post',
        data
    })
}
// 联络员-线索报送 修改接口
export function contactclueEditFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/contactclue/updateContactClue'),
        method: 'post',
        data
    })
}

// 联络员-联系人-问题整改 提交接口
export function commonrectifySubmitFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/commonrectify/save'),
        method: 'post',
        data
    })
}

// 联络员-联系人-问题整改 修改接口
export function commonrectifyEditFn(data) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/commonrectify/update'),
        method: 'post',
        data
    })
}

// 问题整改-关联问题id回显接口 （仅供问题整改调用）
export function problemInfo(params) {
    return httpRequest({
        url: httpRequest.adornUrl('/biz/commonrectify/problemInfo'),
        method: 'get',
        params
    })
}

// 根据用户id查询部门
export function getCheckCorpInfo(params) {
    return httpRequest({
        url: httpRequest.adornUrl(`/biz/task/getCheckCorpInfo`),
        method: 'get',
        params
    })
}

// 根据id查询机构名称
export function getorganization(params) {
    return httpRequest({
        url: httpRequest.adornUrl('sys/company/info'),
        method: 'get',
        params
    })
}
