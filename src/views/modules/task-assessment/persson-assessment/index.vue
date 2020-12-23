<template>
  <div>
    <el-form :inline="true" :model="forms">
        <el-form-item label="时间段:">
        <qselect @getValue="qselectvalue" ref="qselect" />
      </el-form-item>
      <el-form-item label="员工姓名:">
        <el-input v-model="forms.name" placeholder="请输入内容" style="width:240px" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="forms.status" placeholder="请输入内容" style="width:240px">
          <el-option :label="item.label" :value="item.value" v-for="(item, index) in statusArr" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList(1)">查询</el-button>
        <el-button @click="resList">重置</el-button>
      </el-form-item>

    </el-form>
    <xtable v-bind="table" v-loading="table.loading" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />
  </div>
</template>

<script>
import xtable from '@/components/xtable/xtable'
import { getList } from '@/api/task-assessment/perssonAssessment'
import qselect from '@/components/quarterly-select/index'
export default {
  components: {
    xtable,
    qselect
  },
  data () {
    return {
      statusArr: [
        {
          label: '待考核',
          value: 1
        },
        {
          label: '已考核',
          value: 2
        },
        {
          label: '已确认',
          value: 3
        }
      ],
      forms: {
        name: '',
        status: '',
        season: ''
      },
      table: {
        loading: false,
        list: [],
        isMultiple: true,
        typeIndex: false,
        title: {
          show: false,
          align: 'left',
          label: '',
          list: []
        },
        tableHeader: [
          {
            label: '员工姓名',
            name: 'name',
            width: 100
          },
          {
            label: '所属部门',
            name: 'deptName',
            width: 100
          },
          {
            label: '所属条线',
            name: 'lineName',
            width: 100
          },
          {
            label: '考核周期',
            name: 'period',
            width: 100
          },
          {
            label: '考核模板',
            name: 'templateName',
            width: 100
          },
          {
            label: '创建时间',
            name: 'createTime',
            width: 100
          },
          {
            label: '考核得分',
            name: 'checkScore',
            width: 100
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
            }
          }
        ],
        total: 1,
        listQuery: {
          page: 1,
          pageSize: 10
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
                this.assessment('kaohe', row.id, 'yes', row.type)
              }
            },
            {
              label: '考核',
              type: 'text',
              filter: (row) => {
                if (row.status === 1) {
                  return true
                } else {
                  return false
                }
              },
              method: (index, row) => {
                this.assessment('kaohe', row.id, '', row.type)
              }
            },
            {
              label: '重新考核',
              type: 'text',
              filter: (row) => {
                 if (this.isAuth("biz:usercheck:again")) {
                if (row.status === 2) {
                  return true
                } else {
                  return false
                }
                 }
              },
              method: (index, row) => {
                this.assessment('kaohe', row.id, '', row.type)
              }
            }
          ]
        }
      }
    }
  },

  methods: {
    getList (page) {
      this.table.loading = true
      let pageNam = null
      if (page) {
        this.table.listQuery.page = pageNam = page
      } else {
        pageNam = this.table.listQuery.page
      }
      let params = {
        name: this.forms.name,
        status: this.forms.status,
        season: this.forms.season,
        limit: this.table.listQuery.pageSize,
        page: pageNam

      }
      getList(params).then((res) => {
        this.table.loading = false
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.table.total = data.page.totalCount
          this.table.list = data.page.list
        }
      })
      .catch(err => {
        this.table.loading = false
      })
    },
    resList () {
      this.forms.name = ''
      this.forms.status = ''
      this.forms.season = ''
      this.table.listQuery.pageSize = 10
      this.table.listQuery.page = 1
      this.$refs.qselect.resValue()
      this.getList()
    },
    handleSizeChange (val) {
      this.table.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.table.listQuery.page = val
      this.getList()
    },
    assessment (type, id, islook, types) {
      this.$store.dispatch('setAssessmentParams', { type, id, islook })
      this.$router.push({
        name: 'startAssessment',
        params:  {types:types}
      })
    },
    qselectvalue (val) {
      this.forms.season = val
    }
  },
  created () {
    this.getList()
  }
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