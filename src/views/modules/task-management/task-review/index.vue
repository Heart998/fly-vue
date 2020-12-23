<template>
  <div>
    <el-form :inline="true" :model="dataForm" label-width="70px">
      <el-form-item label="任务名称">
        <el-input v-model="dataForm.name" placeholder="任务名称" clearable @keyup.enter.native="getDataList()" style="width:240px"></el-input>
      </el-form-item>
      <el-form-item label="任务类型">
        <el-select v-model="dataForm.target" clearable style="width:240px" @change="targetChangeHandler">
          <el-option label="风控联系人" value="1"></el-option>
          <el-option label="风控联络员" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务分类" v-show="dataForm.target === '1'">
        <el-select v-model="dataForm.classify" clearable style="width:240px">
          <el-option v-for="(item , index) in taskClassificationArr" :label="item.dictLabel" :value="item.dictValue" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务分类" v-show="dataForm.target === '2'">
        <el-select v-model="dataForm.classify" clearable style="width:240px">
          <el-option v-for="(item , index) in contactPersonArr" :label="item.dictLabel" :value="item.dictValue" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考核人">
        <el-input v-model="dataForm.creator" placeholder="接收人" clearable @keyup.enter.native="getDataList(1)" style="width:240px"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="dataForm.status" clearable style="width:240px">
          <el-option v-for="(item , index) in statusArr" :label="item.dictLabel" :value="item.dictValue" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-if="isAuth('biz:taskaudit:auditList')" @click="getDataList(1)" type="primary">查询</el-button>
        <el-button @click="resDataList()">重置</el-button>
      </el-form-item>
    </el-form>
    <xtable v-bind="table" v-loading="table.loading" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />
  </div>
</template>

<script>
import { getDataList } from '@/api/task-review'
import xtable from '@/components/xtable/xtable'
export default {
  components: {
    xtable
  },
  data () {
    return {
      taskClassificationArr: [], // 联系人分类
      contactPersonArr: [], // 联络员分类
      statusArr: [],
      dataForm: {
        name: '',
        target: '',
        classify: '',
        creator: ''
      },
      table: {
        loading: false,
        list: [],
        isMultiple: false,
        typeIndex: true,
        title: {
          show: false,
          align: 'left',
          label: '',
          list: [
            {
              label: '新增',
              type: 'primary',
              method: (index, row) => {}
            }
          ]
        },

        tableHeader: [
          { label: '任务名称', name: 'name', width: 180 },
          {
            label: '任务类型',
            name: 'target',
            width: 100,
            formatter: (row) => {
              if (row.target === '1') {
                return '联系人任务'
              } else {
                return '联络员任务'
              }
            }
          },
          {
            label: '任务分类',
            name: 'classify',
            formatter: (row) => {
              let c = ''
              if (row.target === '1') {
                // 联系人任务
                this.taskClassificationArr.forEach((ite) => {
                  if (ite.dictValue === row.classify) {
                    c = ite.dictLabel
                  }
                })
              } else {
                // 联络员任务
                this.contactPersonArr.forEach((ite) => {
                  if (ite.dictValue === row.classify) {
                    c = ite.dictLabel
                  }
                })
              }

              return c
            }
          },
          { label: '发起人', name: 'initiator' },
          { label: '发起部门', name: 'deptName' },
          { label: '考核起始时间', name: 'startTime', width: 100 },
          { label: '考核截止时间', name: 'endTime', width: 100 },
          { label: '考核条线', name: 'lineName' },
          { label: '考核人', name: 'realName' },
          { label: '考核得分', name: 'score' },
          { label: '处理人', name: 'handleUserName' },
          { label: '审核意见', name: 'auditMsg' },
          {
            label: '状态',
            name: 'status',
            formatter: (row) => {
              let a = ''
              if (row.status === 1) {
                a = '待处理'
              } else if (row.status === 2) {
                a = '待审核'
              } else if (row.status === 3) {
                a = '待抽查'
              } else if (row.status === 4) {
                a = '已归档'
              } else if (row.status === 6) {
                a = '逾期'
              }
              return a
            }
          }
        ],
        total: 1,
        listQuery: {
          page: 1,
          pageSize: 10,
          pageSizes: [5, 8, 12, 24, 20]
        },
        // 操作
        operates: {
          show: true,
          width: 150,
          fixed: 'right',
          list: [
            {
              label: '查看',
              type: 'text',
              filter: (row) => {
                if (this.isAuth('biz:taskaudit:info')) {
                  if (row.status === 3 || row.status === 4) {
                    return true
                  } else {
                    return false
                  }
                }
              },
              method: (index, row) => {
                this.taskProcessing(row, 'yes')
              }
            },
            {
              label: '审核',
              type: 'text',
              filter: (row) => {
                if (this.isAuth('biz:taskaudit:info')) {
                  if (row.status === 2) {
                    return true
                  } else {
                    return false
                  }
                }
              },
              method: (index, row) => {
                this.taskProcessing(row, '')
              }
            }
          ]
        },
        multipleSelection: [] // 多选框勾选中的信息
      }
    }
  },
  methods: {
    targetChangeHandler (val) {
      this.dataForm.classify = ''
    },
    taskProcessing (row, islook) {
      this.$store.dispatch('setTaskParams', {
        type: 'shenhe',
        id: row.id,
        status: row.status,
        islook
      })
      if (row.classify === 'lhg') {
        this.$router.push({
          name: 'ComplianceTraining'
        })
      } else if (row.classify === 'lfx') {
        this.$router.push({
          name: 'RiskInvestigation'
        })
      } else if (row.classify === 'ldd') {
        this.$router.push({
          name: 'SupervisionAndInspection'
        })
      } else if (row.classify === 'lwt') {
        this.$router.push({
          name: 'ProblemClueSubmission'
        })
      } else if (row.classify === 'lbg') {
        this.$router.push({
          name: 'ReportReportSubmission'
        })
      } else if (row.classify === 'lcy') {
        this.$router.push({
          name: 'ParticipateInInspectionItems'
        })
      } else if (row.classify === '1') {
        this.$router.push({
          name: 'ProblemRectification'
        })
      } else if (row.classify === 'ccx') {
        this.$router.push({
          name: 'IntegrityAndComplianceEducation'
        })
      } else if (row.classify === 'cfx') {
        this.$router.push({
          name: 'LlyRiskInvestigation'
        })
      } else if (row.classify === 'czc') {
        this.$router.push({
          name: 'WorkplaceInspection'
        })
      } else if (row.classify === 'cry') {
        this.$router.push({
          name: 'PersonnelInterview'
        })
      } else if (row.classify === 'cwt') {
        this.$router.push({
          name: 'LlyProblemClueSubmission'
        })
      } else if (row.classify === '16') {
        this.$router.push({
          name: 'LlyProblemRectification'
        })
      } else if (row.classify === 'prs') {
        if (row.target === '1') {
          this.$router.push({
            name: 'ProblemRectification'
          })
        } else {
          this.$router.push({
            name: 'LlyProblemRectification'
          })
        }
      }
    },
    getDic () {
      this.taskClassificationArr = this.getDictDataList('linkman_task')
      this.contactPersonArr = this.getDictDataList('contact-task')
      this.statusArr = this.getDictDataList('task_list_status')
    },
    resDataList () {
      for (let item in this.dataForm) {
        this.dataForm[item] = ''
      }
      this.table.listQuery.pageSize = 10
      this.getDataList(1)
    },
    getDataList (page) {
      if (page) {
        this.table.listQuery.page = page
      }
      this.table.loading = true
      let params = this.dataForm
      params.limit = this.table.listQuery.pageSize
      params.page = this.table.listQuery.page
      getDataList(params).then((res) => {
        this.table.loading = false
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.table.list = data.page.list
          this.table.total = data.page.totalCount
        }
      })
    },
    handleSizeChange (val) {
      this.table.listQuery.pageSize = val
      this.getDataList()
    },
    handleCurrentChange (val) {
      this.table.listQuery.page = val
      this.getDataList()
    }
  },
  created () {
    this.getDic()
    this.getDataList()
  }
}
</script>

<style>
</style>