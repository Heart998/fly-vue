import Vue from 'vue'
import App from '@/App'
import router from '@/router'                 // api: https://github.com/vuejs/vue-router
import store from '@/store'                   // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie'            // api: https://github.com/alfhen/vue-cookie
import '@/element-ui'                         // api: https://github.com/ElemeFE/element
import '@/icons'                              // api: http://www.iconfont.cn/
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import { isAuth, getDictLabel, getDictDataList, setLocalStorage, getLocalStorage } from '@/utils'
import cloneDeep from 'lodash/cloneDeep'
import ElRegionTree from '@/components/el-region-tree'
import ElDeptTree from '@/components/el-dept-tree'
import ElDeptCheckBoxTree from '@/components/el-dept-checkbox-tree'
import ElUserSelect from '@/components/el-user-select'
import ElDictSelect from '@/components/el-dict-select'
import ElDictRadio from '@/components/el-dict-radio'
import ElUserTreeSelect from '@/components/el-user-tree-select'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

Vue.component('treeselect', Treeselect)
Vue.use(VueCookie)
Vue.use(ElRegionTree)
Vue.use(ElDeptTree)
Vue.use(ElDeptCheckBoxTree)
Vue.use(ElUserSelect)
Vue.use(ElDictSelect)
Vue.use(ElDictRadio)
Vue.use(ElUserTreeSelect)
Vue.config.productionTip = false

// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock
if (process.env.NODE_ENV !== 'production') {
  require('@/mock')
}

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth     // 权限方法
Vue.prototype.getDictLabel = getDictLabel
Vue.prototype.setLocalStorage = setLocalStorage
Vue.prototype.getLocalStorage = getLocalStorage

Vue.prototype.getDictDataList = getDictDataList

Vue.prototype.dayjs = dayjs
// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
