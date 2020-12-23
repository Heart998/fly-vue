<template>

  <div class="fixed-bottm-box">
    <el-button type="primary" @click="onSubmit" v-if="taskParams.type === 'chuli' && !problemDisabled && isAuth('biz:linkmanreport:save')">提交</el-button>
    <!-- <el-button type="primary" @click="onStaing" v-if="staing === 'fx' && taskParams.type === 'chuli' && !problemDisabled && isAuth('biz:linkmanreport:save')">暂存</el-button> -->
    <el-button @click="back"
      v-if="taskParams.type === 'chuli' && !problemDisabled">取消
    </el-button>
    <el-button @click="back"
      v-if="taskParams.type === 'chuli' && problemDisabled">返回
    </el-button>
      <el-button @click="back"
      v-if="taskParams.type === 'kaohe' && problemDisabled">返回
    </el-button>
    <el-button @click="back"
      v-if="taskParams.type === 'queren' && problemDisabled">返回
    </el-button>
  </div>

</template>

<script>
export default {
  data() {
    return {
      taskParams: {},
      problemDisabled: false,
      staing: ''
    }
  },
  methods: {
    onSubmit() {
      this.$emit('onSubmit')
    },
    back() {
      if (this.taskParams.type === 'pclook') {
        this.$router.replace({
          name: 'TaskManagementPcList',
          params: {
            lastId: this.pcParams.id,
            lastTarget: this.pcParams.target,
            code: this.pcParams.code,
          },
        })
      } else if (
        this.taskParams.type === 'queren' ||
        this.taskParams.type === 'kaohe'
      ) {
        this.$router.replace({
          name: 'startAssessment',
        })
      } else {
        let route = this.forms
        switch (this.taskParams.type) {
          case 'chuli':
            route = 'processing'
            break
          case 'shenhe':
            route = 'review'
            break
          case 'choucha':
            route = 'check'
            break
          default:
            route = 'processing'
        }
        this.$router.replace({
          path: `/task-management-task-${route}/index`,
        })
      }
    },
    inittaskParams() {
      this.taskParams = this.$store.state.more.taskParams
      console.log('返回按钮', this.taskParams)
      if (this.taskParams.id !== '' || this.taskParams.type !== '') {
        if (this.taskParams.type === 'chuli') {
          if (this.taskParams.islook === 'yes') {
            this.problemDisabled = true
          } else {
            this.problemDisabled = false
          }
        } else if (
          this.taskParams.type === 'shenhe' ||
          this.taskParams.type === 'choucha' ||
          this.taskParams.type === 'pclook' ||
          this.taskParams.type === 'queren' ||
          this.taskParams.type === 'kaohe'
        ) {
          this.problemDisabled = true
        }
      } else {
        console.warn('no store "taskParams" data !!!')
      }
    },
  },
  created() {
    this.inittaskParams()
  },
}
</script>

<style>
</style>