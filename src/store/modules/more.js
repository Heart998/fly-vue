export default {
  state: {
    taskParams: {
        type: '', // 总标识符 用来判断是 处理/审核/抽查 进的页面 chuli choucha shenhe
        id: '',
        islook: '', // 是否是查看 yes 是  其他或空 不是
        pcParams: '', // 如果是从批次详情里面进来的会暂存数据 待返回的时候要从这拿数据回传回去
        status: ''  // 任务状态 -----------------------wfs新增 
    },
    assessmentParams: {}
  
  },
  mutations: {
    SET_TASK_PARAMS (state, obj) {
      state.taskParams = obj
    },
    SET_ASSESSMENT_PARAMS (state, obj) {
      state.assessmentParams = obj
    }

  },
  /**
   * 响应在 view 上的用户输入导致的状态变化。
   */
  actions: {
    setTaskParams ({commit}, obj) {
      commit('SET_TASK_PARAMS', obj)
    },
    setAssessmentParams ({commit}, obj) {
      commit('SET_ASSESSMENT_PARAMS', obj)
    }
  }
}
