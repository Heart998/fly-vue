<template>
  <div>
    <el-form :inline="true" :model="dataForm" label-width="70px">
      <el-form-item label="接收人">
        <el-input v-model="dataForm.creatorName" placeholder="考核人" clearable @keyup.enter.native="getDataList()" style="width:240px"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="dataForm.status" clearable style="width:240px">
          <el-option v-for="(item , index) in statusArr" :label="item.dictLabel" :value="item.dictValue" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <xtable v-bind="table" v-loading="table.loading" @handleSizeChange="handleSizeChange"  @handleCurrentChange="handleCurrentChange" />
    <br>
    <div class="fixed-bottm-box">
        <el-button @click="goback">返回</el-button>
    </div>
    <br>

  </div>
</template>

<script>
import xtable from '@/components/xtable/xtable'
import { getPcXqList } from '@/api/task-management/index'
export default {
  components: {
    xtable
  },
  data () {
    return {
      lastId: '',
      lastTarget: '',
      code: '',
      statusArr: [],
      dataForm: {
        creatorName: '',
        status: ''
      },
      table: {
        loading: false,
        list: [],
        isMultiple: true,
        typeIndex: false,
        title: {
          show: false

        },

        tableHeader: [
          { label: '任务名称', name: 'name', width: 180 },
          { label: '任务批次号', name: 'batchCode', width: 180 },
          { label: '任务分类',
            name: 'classify',
            formatter: (row) => {
              if (row.target === '1') {
                return this.getDictLabel('linkman_task', row.classify)
              }
              return this.getDictLabel('contact-task', row.classify)
            }
          },
          { label: '发起人', name: 'initiator' },
          { label: '发起部门', name: 'deptName' },
          { label: '考核起始时间', name: 'startTime', width: 180 },
          { label: '考核截止时间', name: 'endTime', width: 180 },
          { label: '考核条线', name: 'lineName' },
          { label: '接收人', name: 'realName' },
          { label: '考核得分', name: 'score' },
          { label: '实际处理人', name: 'handleUserName' },
          {
            label: '状态',
            name: 'status',
            formatter: (row) => {
              return this.getDictLabel('task_list_status', row.status)
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
              method: (index, row) => {
                  this.taskProcessing(row, 'yes')
              }
            }
          ]
        }
      }
    }
  },
  methods: {
    init () {
      let routerparams = this.$route.params
      if (routerparams.lastId !== '' && routerparams.lastTarget !== '' && routerparams.code !== '') {
        this.lastId = routerparams.lastId
        this.lastTarget = routerparams.lastTarget
        this.code = routerparams.code
        this.getStatus()
      } else {
        this.$router.push({
          path: '/task-management-task-management/index'
        })
      }
    },
    taskProcessing (row, islook) {
      this.$store.dispatch('setTaskParams', {
        type: 'pclook',
        id: row.id,
        islook,
        status: row.status,
        pcParams: {
            lastId: this.lastId,
            lastTarget: this.lastTarget,
            code: this.code
        }
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
    goback () {
      this.$router.push({
        name: 'TaskManagementTaskLook',
        params: {id: this.lastId, target: this.lastTarget}
      })
    },
    getStatus () {
      this.statusArr = this.getDictDataList('task_list_status')
      this.getDataList()
    },
    getDataList () {
        this.table.loading = true
      let params = {
        code: this.code,
        page: this.table.listQuery.page,
        limit: this.table.listQuery.pageSize,
        status: this.dataForm.status,
        creatorName: this.dataForm.creatorName
      }

      getPcXqList(params)
      .then(res => {
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
    this.init()
  }
}
</script>

