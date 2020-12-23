/**
 * 开发环境
 */
; (function () {
  window.SITE_CONFIG = {}

  // api接口请求地址
  window.SITE_CONFIG['baseUrl'] = '/proxyApi'

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
  window.SITE_CONFIG['menuList'] = []                     // 左侧菜单列表（后台返回，未做处理）
  window.SITE_CONFIG['permissions'] = []                  // 页面按钮操作权限（后台返回，未做处理）
  window.SITE_CONFIG['dynamicRoutes'] = []                // 动态路由列表
  window.SITE_CONFIG['dynamicMenuRoutes'] = []            // 动态(菜单)路由列表
  window.SITE_CONFIG['dynamicMenuRoutesHasAdded'] = false // 动态(菜单)路由是否已经添加的状态标示（用于判断是否需要重新拉取数据并进行动态添加操作）
})()
