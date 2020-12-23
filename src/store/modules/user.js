export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    realName: '',
    usercode: '',
    deptId: undefined,
    deptName: '',
    corpId: undefined,
    corpName: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateRealName (state, realName) {
      state.realName = realName
    },
    updateUsercode (state, usercode) {
      state.usercode = usercode
    },
    updateDeptId (state, deptId) {
      state.deptId = deptId
    },
    updateDeptName (state, deptName) {
      state.deptName = deptName
    },
    updateCorpId (state, corpId) {
      state.corpId = corpId
    },
    updateCorpName (state, corpName) {
      state.corpName = corpName
    }
  }
}
