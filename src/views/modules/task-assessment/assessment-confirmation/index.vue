<template>
  <div>
    <el-form :inline="true" :model="forms">
      <el-form-item label="员工姓名:">
        <el-input v-model="forms.name" placeholder="请输入内容" style="width:240px"></el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="forms.status" placeholder="请输入内容" style="width:240px">
          <el-option :label="item.label" :value="item.value" v-for="(item, index) in statusArr" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList(1)">查询</el-button>
        <el-button>重置</el-button>
      </el-form-item>

    </el-form>
    <xtable v-bind="table" v-loading="table.loading" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />
  </div>
</template>

<script>
import {
  getUserStaffList,
  userAffirm,
} from '@/api/task-assessment/perssonAssessment'
import xtable from '@/components/xtable/xtable'
export default {
  components: {
    xtable,
  },
  data() {
    return {
      statusArr: [
        {
          label: '待考核',
          value: 1,
        },
        {
          label: '已考核',
          value: 2,
        },
        {
          label: '已确认',
          value: 3,
        },
      ],
      forms: {
        name: '',
        status: '',
      },
      table: {
        loading: false,
        list: [],
        isMultiple: true,
        typeIndex: false,
        title: {
          show: false,
          align: 'left',
          label: '2333',
          list: [],
        },
        tableHeader: [
          {
            label: '员工姓名',
            name: 'name',
            width: 100,
          },
          {
            label: '所属部门',
            name: 'deptName',
            width: 100,
          },
          {
            label: '所属条线',
            name: 'lineName',
            width: 100,
          },
          {
            label: '考核周期',
            name: 'period',
            width: 100,
          },
          {
            label: '考核模板',
            name: 'templateName',
            width: 100,
          },
          {
            label: '创建时间',
            name: 'createTime',
            width: 100,
          },
          {
            label: '考核得分',
            name: 'checkScore',
            width: 100,
          },
          {
            label: '考核状态',
            name: 'status',
            width: 100,
            formatter: (row) => {
              let arr = this.statusArr
              let b = ''
              for (let i = 0; i < arr.length; i++) {
                if (row.status === arr[i].value) {
                  b = arr[i].label
                }
              }
              return b
            },
          },
          {
            label: '确认人',
            name: 'confirmUserName',
            width: 100,
          },
          {
            label: '确认时间',
            name: 'confirmTime',
            width: 100,
          },
        ],
        total: 1,
        listQuery: {
          page: 1,
          pageSize: 10,
        },
        // 操作
        operates: {
          show: true,
          isDropDown: true,
          width: 250,
          fixed: 'right',
          list: [
            {
              label: '查看',
              type: 'text',
              method: (index, row) => {
                this.assessment('queren',row.id, 'yes')
              },
            },
          ],
        },
      },
    }
  },

  methods: {
    getDataList(page) {
      if (page) {
        this.table.listQuery.page = page
      }
      this.table.loading = true
      let params = {
        limit: this.table.listQuery.pageSize,
        page: this.table.listQuery.page,
        name: this.forms.name,
        status: this.forms.status,
      }
      getUserStaffList(params).then((res) => {
        let data = res.data
        this.table.loading = false
        if (data.code === 0 && data.msg === 'success') {
          this.table.list = data.page.list
          this.table.total = data.page.totalCount
        }
      })
    },

    assessment(type,id, islook) {
      this.$store.dispatch('setAssessmentParams', { type, id, islook })
      this.$router.push({
        name: 'startAssessment',
      })
    },
    handleCurrentChange(val) {
      this.table.listQuery.page = val
      this.getDataList()
    },
    handleSizeChange(val) {
      this.table.listQuery.pageSize = val
      this.getDataList(1)
    },
  },
  created() {
    this.getDataList()
  },
}
</script>

<style scoped>
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>