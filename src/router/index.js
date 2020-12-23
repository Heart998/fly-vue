/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } }
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } },
    { path: '/theme', component: _import('common/theme'), name: 'theme', meta: { title: '主题' } },
    { path: '/demo-echarts', component: _import('demo/echarts'), name: 'demo-echarts', meta: { title: 'demo-echarts', isTab: true } },
    { path: '/demo-ueditor', component: _import('demo/ueditor'), name: 'demo-ueditor', meta: { title: 'demo-ueditor', isTab: true } },
    { path: '/task-assessment-assessment-manage/linkman', component: _import('modules/task-assessment/assessment-manage/linkman'), name: 'linkman', meta: { title: 'linkman', isTab: false } },
    { path: '/task-assessment-assessment-manage/startAssessment', component: _import('modules/task-assessment/persson-assessment/startAssessment'), name: 'startAssessment', meta: { title: 'startAssessment', isTab: false } },
    // 任务处理-部门风控联系人
    { path: '/task-management-task-processing/complianceTraining', component: _import('modules/task-management/task-processing/lxr/complianceTraining'), name: 'ComplianceTraining', meta: { title: '合规培训', isTab: false } },
    { path: '/task-management-task-processing/riskInvestigation', component: _import('modules/task-management/task-processing/lxr/riskInvestigation'), name: 'RiskInvestigation', meta: { title: '风险排查', isTab: false } },
    { path: '/task-management-task-processing/supervisionAndInspection', component: _import('modules/task-management/task-processing/lxr/supervisionAndInspection'), name: 'SupervisionAndInspection', meta: { title: '督导检查', isTab: false } },
    { path: '/task-management-task-processing/problemClueSubmission', component: _import('modules/task-management/task-processing/lxr/problemClueSubmission'), name: 'ProblemClueSubmission', meta: { title: '问题线索报送', isTab: false } },
    { path: '/task-management-task-processing/reportReportSubmission', component: _import('modules/task-management/task-processing/lxr/reportReportSubmission'), name: 'ReportReportSubmission', meta: { title: '报告报表报送', isTab: false } },
    { path: '/task-management-task-processing/participateInInspectionItems', component: _import('modules/task-management/task-processing/lxr/participateInInspectionItems'), name: 'ParticipateInInspectionItems', meta: { title: '参与检查项目', isTab: false } },
    { path: '/task-management-task-processing/problemRectification', component: _import('modules/task-management/task-processing/lxr/problemRectification'), name: 'ProblemRectification', meta: { title: '问题整改', isTab: false } },
    // 任务处理-职场风控联络员
    { path: '/task-management-task-processing/integrityAndComplianceEducation', component: _import('modules/task-management/task-processing/lly/integrityAndComplianceEducation'), name: 'IntegrityAndComplianceEducation', meta: { title: '诚信合规教育', isTab: false } },
    { path: '/task-management-task-processing/llyRiskInvestigation', component: _import('modules/task-management/task-processing/lly/llyRiskInvestigation'), name: 'LlyRiskInvestigation', meta: { title: '风险排查', isTab: false } },
    { path: '/task-management-task-processing/workplaceInspection', component: _import('modules/task-management/task-processing/lly/workplaceInspection'), name: 'WorkplaceInspection', meta: { title: '职场巡查', isTab: false } },
    { path: '/task-management-task-processing/personnelInterview', component: _import('modules/task-management/task-processing/lly/personnelInterview'), name: 'PersonnelInterview', meta: { title: '人员访谈', isTab: false } },
    { path: '/task-management-task-processing/llyProblemClueSubmission', component: _import('modules/task-management/task-processing/lly/llyProblemClueSubmission'), name: 'LlyProblemClueSubmission', meta: { title: '问题线索报送', isTab: false } },
    { path: '/task-management-task-processing/llyProblemRectification', component: _import('modules/task-management/task-processing/lly/llyProblemRectification'), name: 'LlyProblemRectification', meta: { title: '问题整改', isTab: false } },
//    任务管理-查看
    { path: '/task-management-task-management/taskLook', component: _import('modules/task-management/task-management/taskLook'), name: 'TaskManagementTaskLook', meta: { title: '任务查看', isTab: false } },
    // 任务管理-批次列表
    { path: '/task-management-task-management/pclist', component: _import('modules/task-management/task-management/pclist'), name: 'TaskManagementPcList', meta: { title: '任务查看', isTab: false } }
  ],
  beforeEnter (to, from, next) {
    let token = Vue.cookie.get('token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({ name: 'login' })
    }
    next()
  }
}

export function addDynamicRoute (routeParams, router) {
  // 组装路由名称, 并判断是否已添加, 如是: 则直接跳转
  var routeName = routeParams.routeName
  var dynamicRoute = window.SITE_CONFIG['dynamicRoutes'].filter(item => item.name === routeName)[0]
  if (dynamicRoute) {
    return router.push({ name: routeName, params: routeParams.params })
  }
  // 否则: 添加并全局变量保存, 再跳转
  dynamicRoute = {
    path: routeName,
    component: () => import(`@/views/modules/${routeParams.path}`),
    name: routeName,
    meta: {
      menuId: routeParams.menuId,
      title: routeParams.title,
      isDynamic: true,
      isTab: true,
      iframeUrl: ''
    }
  }
  router.addRoutes([
    {
      ...mainRoutes,
      name: `main-dynamic__${dynamicRoute.name}`,
      children: [dynamicRoute]
    }
  ])

  window.SITE_CONFIG['dynamicRoutes'].push(dynamicRoute)
  router.push({ name: dynamicRoute.name, params: routeParams.params })
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
    // 获取字典列表, 添加并全局变量保存
    http({
      url: http.adornUrl('/sys/dict/type/all'),
      method: 'get',
      params: http.adornParams()
    }).then(({ data: res }) => {
      if (res.code !== 0) {
        return
      }
      window.SITE_CONFIG['dictList'] = res.data
    }).catch(() => { })
    // 获取菜单列表, 添加并全局变量保存
    http({
      url: http.adornUrl('/sys/menu/nav'),
      method: 'get',
      params: http.adornParams()
    }).then(({ data }) => {
      if (data && data.code === 0) {
        fnAddDynamicMenuRoutes(data.menuList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
        sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
        next({ ...to, replace: true })
      } else {
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        next()
      }
    }).catch((e) => {
      console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
      router.push({ name: 'login' })
    })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) { }
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' } }
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    window.SITE_CONFIG['dynamicRoutes'] = routes
    console.log('\n')
    console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    console.log(mainRoutes.children)
    console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
  }
}

export default router
