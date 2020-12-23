<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="模板名称:">
        <el-input v-model="mbname" placeholder="请输入内容" clearable="" style="width:240px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList(1)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="restDataList">重置</el-button>
      </el-form-item>
     
      <el-form-item>
        <el-dropdown split-button type="primary" @command="commandFn">
          <span class="el-dropdown-link">
            新建模板
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">联系人模板</el-dropdown-item>
            <el-dropdown-item command="2">联络员模板</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>
    <xtable v-bind="table" v-loading="table.loading" @handleSizeChange="handleSizeChange" @handleSelectionChange="handleSelectionChange" @handleCurrentChange="handleCurrentChange" />
  </div>
</template>

<script>
import httpRequest from '@/utils/httpRequest' // 临时用下
import xtable from '@/components/xtable/xtable'
import { getList, delFn } from '@/api/task-assessment/assessmentManage'

export default {
  data () {
    return {
      mbname: '',
      table: {
        loading: false,
        list: [
          {
            name: '省公司科技条线模板',
            ply: '省公司，市公司，区公司',
            strip: '科技条线',
            dept: '办公室',
            crateBy: 'admin',
            createTime: '2020-08-06'
          }
        ],
        isMultiple: true,
        typeIndex: true,
        title: {
          show: false,
          align: 'left',
          label: '',
          list: [{
            show: true,
            label: '',
            type: 'danger',
            size: 'mini',
            method: (row) => {

            }
          }]
        },
        tableHeader: [
          {
            label: '模板名称',
            name: 'name',
            width: 200
          },
          {
            label: '层级',
            name: 'level',
            width: 200
          },
          {
            label: '条线',
            name: 'line',
            width: 200
          },
          {
            label: '创建部门',
            name: 'deptName',
            width: 200
          },
          {
            label: '创建人',
            name: 'createName',
            width: 100
          },
          {
            label: '创建时间',
            name: 'createTime',
            width: 200
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
          width: 180,
          fixed: 'right',
          list: [
            {
              label: '查看',
              type: 'text',
              method: (index, row) => {
                this.linkto(row.type, row.id, 'look')
              }
            },
            {
              label: '修改',
              type: 'text',
              method: (index, row) => {
                this.linkto(row.type, row.id, 'edit')
              }
            },
            {
              label: '删除',
              type: 'text',
              method: (index, row) => {
                this.delete(row.id)
              }
            },
             {
              label: '临时-触发考核',
              type: 'text',
              filter: (row) => {
                  return false
              },
              method: (index, row) => {
                  let params = {id: row.id}
                httpRequest({
                    url: httpRequest.adornUrl('/biz/usercheck/trigger'),
                    method: 'get',
                    params
                    })
                    .then(res => {
                        console.log(res)
                    })
              }
            }
          ]
        },
        multArr: []
      }
    }
  },
  components: {
    xtable
  },
  created () {
    this.getDataList(1)
  },
  methods: {

    restDataList () {
      this.table.listQuery.pageSize = 10
  
      this.mbname = ''
      this.getDataList(1)
    },
    getDataList (page) {
        if (page) {
            this.table.listQuery.page = page
        }
      this.table.loading = true
      let params = {
        limit: this.table.listQuery.pageSize,
        page: this.table.listQuery.page,
        name: this.mbname
      }
      getList(params).then((res) => {
        if (res.data.code === 0 && res.data.msg === 'success') {
          this.table.list = res.data.page.list
          this.table.total = res.data.page.totalCount
          this.table.loading = false
        }
      })
    },
    delete (id) {
      let _this = this
      _this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delFn(id)
            .then(res => {
              if (res.data.code === 0 && res.data.msg === 'success') {
                _this.$message.success('删除成功')
                _this.getDataList()
              }
            })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange (val) {
      this.table.listQuery.pageSize = val
      this.getDataList()
    },
    handleSelectionChange (val) {
      this.table.multArr = val
      console.log('handleSelectionChange', this.table.multArr)
    },
    handleCurrentChange (val) {
      this.table.listQuery.page = val
      this.getDataList()
    },
    linkto (type, id, islook) {
      this.$router.push({
        path: '/task-assessment-assessment-manage/linkman',
        query: { type, id, islook }
      })
    },
    commandFn (type) {
      this.linkto(type, '', '')
    }
  }
}
</script>

<style scoped>
</style>