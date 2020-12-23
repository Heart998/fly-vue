import httpRequest from '../../utils/httpRequest'

// 获取下拉条线
export function getTX () {
  return httpRequest({
    url: httpRequest.adornUrl('/sys/line/select'),
    method: 'get'
  })
}

// 获取图表数据
export function getChart (){
  return httpRequest({
    url: httpRequest.adornUrl('/biz/task/chart'),
    method:'get'
  })
}
