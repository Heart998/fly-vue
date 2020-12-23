<template>
  <el-card shadow="never" class="aui-card--fill">
      <div style="text-align: center;font-size: 28px">{{dataForm.title}}</div>
      <el-divider></el-divider>
      <div v-html="dataForm.content"></div>
      <div>
          <hr size=1 color="#ddd" style="margin:30px 0 10px 0;">
          <span class="span-divider">发送者：{{dataForm.senderName}}</span>
          <span class="span-divider">发送时间：{{dataForm.senderDate}}</span>
          <span>类型：
              <template>
              {{ getDictLabel("notice_type", dataForm.type + '') }}
              </template>
          </span>
          <hr  size=1 color="#ddd" style="margin:10px 0 30px 0;">
      </div>
      <div style="text-align: center;"><el-button type="danger" @click="closeCurrentTab()">关闭</el-button></div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/notice/user/page',
        createdIsNeed: false,
        activatedIsNeed: true,
        getDataListIsPage: true
      },
      dataForm: {
        id: '',
        type: 0,
        title: '',
        content: ''
      }
    }
  },
  computed: {
    mainTabs: {
      get () { return this.$store.state.common.mainTabs },
      set (val) { this.$store.commit('common/updateMainTabs', val) }
    },
    mainTabsActiveName: {
      get () { return this.$store.state.common.mainTabsActiveName },
      set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
    }
  },
  created () {
    this.dataForm.id = this.$route.params.id || 0
    this.getInfo()
  },
  methods: {
    // 获取信息
    getInfo () {
      this.$http({
        url: this.$http.adornUrl(`/sys/notice/${this.dataForm.id}`),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    },
    // 关闭当前窗口
    closeCurrentTab () {
      var tabName = this.mainTabsActiveName
      this.mainTabs = this.mainTabs.filter(item => item.name !== tabName)
      if (this.mainTabs.length >= 1) {
        // 当前选中tab被删除
        if (tabName === this.mainTabsActiveName) {
          var tab = this.mainTabs[this.mainTabs.length - 1]
          this.$router.push({ name: tab.name, query: tab.query, params: tab.params }, () => {
            this.mainTabsActiveName = this.$route.name
          })
        }
      } else {
        this.menuActiveName = ''
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>
<style scoped>
.span-divider::after{
  content: "";
  margin-left: 15px;
  padding-left: 15px;
  border-left: 1px solid #c0c4cc;
  height: 12px;
  display: inline-block;
  vertical-align: middle;
}
</style>