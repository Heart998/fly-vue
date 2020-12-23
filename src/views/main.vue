<template>
  <div
    class="site-wrapper"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <template v-if="!loading">
      <main-navbar />
      <main-sidebar />
      <div class="site-content__wrapper" :style="{ 'min-height': documentClientHeight + 'px' }">
        <main-content v-if="!$store.state.common.contentIsNeedRefresh" />
      </div>
    </template>
  </div>
</template>

<script>
  import MainNavbar from './main-navbar'
  import MainSidebar from './main-sidebar'
  import MainContent from './main-content'
  export default {
    provide () {
      return {
        // 刷新
        refresh () {
          this.$store.commit('common/updateContentIsNeedRefresh', true)
          this.$nextTick(() => {
            this.$store.commit('common/updateContentIsNeedRefresh', false)
          })
        }
      }
    },
    data () {
      return {
        loading: true
      }
    },
    components: {
      MainNavbar,
      MainSidebar,
      MainContent
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight },
        set (val) { this.$store.commit('common/updateDocumentClientHeight', val) }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold }
      },
      userId: {
        get () { return this.$store.state.user.id },
        set (val) { this.$store.commit('user/updateId', val) }
      },
      userName: {
        get () { return this.$store.state.user.name },
        set (val) { this.$store.commit('user/updateName', val) }
      },
      realName: {
        get () { return this.$store.state.user.realName },
        set (val) { this.$store.commit('user/updateRealName', val) }
      },
      usercode: {
        get () { return this.$store.state.user.userCode },
        set (val) { this.$store.commit('user/updateUsercode', val) }
      },
      deptId: {
        get () { return this.$store.state.user.deptId },
        set (val) { this.$store.commit('user/updateDeptId', val) }
      },
      deptName: {
        get () { return this.$store.state.user.deptName },
        set (val) { this.$store.commit('user/updateDeptName', val) }
      },
      corpId: {
        get () { return this.$store.state.user.corpId },
        set (val) { this.$store.commit('user/updateCorpId', val) }
      },
      corpName: {
        get () { return this.$store.state.user.corpName },
        set (val) { this.$store.commit('user/updateCorpName', val) }
      }
    },
    created () {
      this.getUserInfo()
    },
    mounted () {
      this.resetDocumentClientHeight()
    },
    methods: {
      // 重置窗口可视高度
      resetDocumentClientHeight () {
        this.documentClientHeight = document.documentElement['clientHeight']
        window.onresize = () => {
          this.documentClientHeight = document.documentElement['clientHeight']
        }
      },
      // 获取当前管理员信息
      getUserInfo () {
        this.$http({
          url: this.$http.adornUrl('/sys/user/info'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.loading = false
            this.userId = data.user.userId
            this.userName = data.user.username
            this.usercode = data.user.usercode
            this.realName = data.user.realName
            this.deptId = data.user.deptId
            this.deptName = data.user.deptName
            this.corpId = data.user.corpId
            this.corpName = data.user.corpName
          }
        })
      }
    }
  }
</script>
