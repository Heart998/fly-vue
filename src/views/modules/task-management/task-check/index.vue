<template>
  <div>
    <el-form :inline="true" :model="dataForm" label-width="70px">
      <el-form-item label="时间段:">
        <el-date-picker v-model="dates" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="pickerChange"></el-date-picker>
      </el-form-item>
        <el-form-item label="机构名称">
        <el-popover v-model="companyListVisible" ref="companyListPopover" placement="bottom-start" trigger="click">
          <el-tree class="company-listtree" :data="companyList" :props="{ label: 'name', children: 'children' }" node-key="id" ref="companyListTree" :highlight-current="true"
            :expand-on-click-node="false" accordion @current-change="companyListTreeCurrentChangeHandle">
          </el-tree>
        </el-popover>
        <el-input v-model="corpName" v-popover:companyListPopover :readonly="true" placeholder="所属单位" clearable></el-input>
      </el-form-item>
      <el-form-item label="所属条线">
        <el-select v-model="dataForm.lineId" placeholder="请选择">
          <el-option v-for="(item,index) in line" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="任务名称" v-if="false">
        <el-input v-model="dataForm.name" placeholder="任务名称" clearable @keyup.enter.native="getDataList(1)" style="width:240px"></el-input>
      </el-form-item> -->
      <el-form-item label="任务类型">
        <el-select v-model="dataForm.target" clearable style="width:240px">
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
      <!-- <el-form-item label="考核人"  v-if="false">
        <el-input v-model="dataForm.creator" placeholder="接收人" clearable @keyup.enter.native="getDataList(1)" style="width:240px"></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button v-if="isAuth('biz:taskaudit:spotList')" @click="getDataList(1)" type="primary">查询</el-button>
        <el-button @click="resDataList()">重置</el-button>
      </el-form-item>
    </el-form>
    <xtable v-bind="table" v-loading="table.loading" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />
  </div>
</template>

<script>
import { getDataList } from '@/api/task-check'
import { getTX } from '@/api/common/index'
import xtable from '@/components/xtable/xtable'
export default {
  components: {
    xtable,
  },
  data() {
    return {
      dates:'',
      companyListVisible: false, // 机构是否显示
      companyList: [],   // 机构
      taskClassificationArr: [], // 联系人分类
      contactPersonArr: [], // 联络员分类
      statusArr: [
      ],
      line: [],   //条线集合
      corpName:'', // 机构名称
      dataForm: {
        startTime: '',
        endTime: '',
        corpId: '',
        lineId: '',
        target: '',
        classify: '',
        // name: '',
        // creator: '',
      },
      table: {
        loading: false,
        list: [],
        isMultiple: false,
        typeIndex: true,
        title: {
          show: false,
          align: 'left',
          label: '2333',
          list: [
            {
              label: '新增',
              type: 'primary',
              method: (index, row) => {},
            },
          ],
        },

        tableHeader: [
          { label: '任务名称', name: 'name' },
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
            },
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
            },
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
              if (row.status === 3) {
                a = '待抽查'
              } else if (row.status === 4) {
                a = '已归档'
              } 
              return a
            },
          },
        ],
        total: 1,
        listQuery: {
          page: 1,
          pageSize: 10,
          pageSizes: [5, 8, 12, 24, 20],
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
                if (row.status === 4) {
                  return true
                } else {
                  return false
                }
              },
              method: (index, row) => {
                this.taskProcessing(row, 'yes')
              },
            },
            {
              label: '抽查',
              type: 'text',
              filter: (row) => {
                if (row.status === 3) {
                  return true
                } else {
                  return false
                }
              },
              method: (index, row) => {
                this.taskProcessing(row, '')
              },
            },
          ],
        },
        multipleSelection: [], // 多选框勾选中的信息
      },
    }
  },
  methods: {
    taskProcessing(row, islook) {
      this.$store.dispatch('setTaskParams', {
        type: 'choucha',
        id: row.id,
        status: row.status,
        islook,
      })
      if (row.classify === 'lhg') {
        this.$router.push({
          name: 'ComplianceTraining',
        })
      } else if (row.classify === 'lfx') {
        this.$router.push({
          name: 'RiskInvestigation',
        })
      } else if (row.classify === 'ldd') {
        this.$router.push({
          name: 'SupervisionAndInspection',
        })
      } else if (row.classify === 'lwt') {
        this.$router.push({
          name: 'ProblemClueSubmission',
        })
      } else if (row.classify === 'lbg') {
        this.$router.push({
          name: 'ReportReportSubmission',
        })
      } else if (row.classify === 'lcy') {
        this.$router.push({
          name: 'ParticipateInInspectionItems',
        })
      } else if (row.classify === '1') {
        this.$router.push({
          name: 'ProblemRectification',
        })
      } else if (row.classify === 'ccx') {
        this.$router.push({
          name: 'IntegrityAndComplianceEducation',
        })
      } else if (row.classify === 'cfx') {
        this.$router.push({
          name: 'LlyRiskInvestigation',
        })
      } else if (row.classify === 'czc') {
        this.$router.push({
          name: 'WorkplaceInspection',
        })
      } else if (row.classify === 'cry') {
        this.$router.push({
          name: 'PersonnelInterview',
        })
      } else if (row.classify === 'cwt') {
        this.$router.push({
          name: 'LlyProblemClueSubmission',
        })
      } else if (row.classify === '16') {
        this.$router.push({
          name: 'LlyProblemRectification',
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
    // 时间段转换
    pickerChange () {
      if (this.dates.length) {
        this.dataForm.startTime = this.dates[0]
        this.dataForm.endTime = this.dates[1]
      }
    },
    getDic() {
      this.taskClassificationArr = this.getDictDataList('linkman_task')
      this.contactPersonArr = this.getDictDataList('contact-task')
      this.statusArr = this.getDictDataList('task_list_status')
    },
    resDataList() {
      for (let item in this.dataForm) {
        this.dataForm[item] = ''
      }
      this.dates = ''
      this.corpName = ''
      this.table.listQuery.page = 1
      this.table.listQuery.pageSize = 10
      this.getDataList()
    },
    getDataList(page) {
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
    // 获取的机构列表转换成查询的数据
    companyListTreeCurrentChangeHandle (data) {
      this.corpName = data.name
      this.dataForm.corpId = data.id
      this.companyListVisible = false
    },
    // 获取机构列表
    getCompanyList () {
      return this.$http({
        url: this.$http.adornUrl('/sys/company/list'),
        method: 'get',
        params: this.$http.adornParams({
          type: 1
        })
      })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.companyList = res.data
        })
        .catch(() => {})
    },
    handleSizeChange(val) {
      this.table.listQuery.pageSize = val
      this.getDataList(1)
    },
    handleCurrentChange(val) {
      this.table.listQuery.page = val
      this.getDataList()
    },
  },
  created() {
    // 获取到条线集合
    getTX().then((res) => {
      let data = res.data
      if (data.code === 0 && data.msg === 'success') {
        this.line = data.list
      }
    })
    this.getDic()
    this.getCompanyList()
    this.getDataList()
  },
}
</script>

<style>
</style>