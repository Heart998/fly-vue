<template>
  <div>
    <el-form :inline="true" :model="params" label-width="80px">
      <el-form-item label="时间段:">
        <el-date-picker v-model="dates" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="pickerChange">
        </el-date-picker>

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
        <el-select v-model="params.lineIds" placeholder="请选择">
          <el-option v-for="(item,index) in line" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名:">
        <el-input v-model="params.realName" placeholder="请输入" clearable @keyup.enter.native="getDataList()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList(1)" v-if="isAuth('biz:ConfirmationProblem:list')">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resDataList"> 重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="importTemplate()" v-if="isAuth('biz:exportConfirmationProblem:list')">导出</el-button>
      </el-form-item>
    </el-form>

    <xtable v-bind="table" v-loading="table.loading" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />
  </div>
</template>

<script>
import xtable from '@/components/xtable/xtable'
import { getTX } from '@/api/common/index'
import { getQueryConfirmationProblem, exportConfirmationProblem } from '@/api/statistical-report/statistics-of-rectification-problems/index'
export default {
  components: {
    xtable
  },
  data () {
    return {
      companyListVisible: false,
      companyList: [],
      dates: '',
      corpName: '',
      params: {
        foundTime: '',
        endTime: '',
        corpName: '',
        lineIds: '',
        realName: ''
      },
      line: [],
      table: {
        loading: false,
        list: [],
        isMultiple: false,
        typeIndex: true,
        title: {
          show: false,
          align: 'left',
          label: '',
          list: []
        },

        tableHeader: [
          {
            label: '机构名称',
            name: 'corpName'
          },
          {
            label: '所属条线',
            name: 'lineNames'
          },
          {
            label: '姓名',
            name: 'realName'
          },
          {
            label: '发现问题数量',
            name: 'num'
          }
        ],
        total: 1,
        listQuery: {
          page: 1,
          pageSize: 10
        }

      }
    }
  },
  methods: {
       // 导出
    importTemplate () {
      let params = { ...this.params }
      exportConfirmationProblem(params).then((res) => {
        if (res) {
          const aLink = document.createElement('a')
          let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
          aLink.href = URL.createObjectURL(blob)
          aLink.setAttribute('download', '确认问题统计' + '.xlsx') // 设置下载文件名称
          aLink.click()
          this.$refs.loadElement.appendChild(aLink)
        }
      })
    },
      // 时间段转换
    pickerChange () {
      if (this.dates.length) {
        this.params.foundTime = this.dates[0]
        this.params.endTime = this.dates[1]
      }
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
    companyListTreeCurrentChangeHandle (data) {
      this.corpName = data.name
      this.params.corpName = data.id
      this.companyListVisible = false
    },
    resDataList () {
      this.table.listQuery = {
        page: 1,
        pageSize: 10
      }
      let params = { ...this.params }
      for (let ite in this.params) {
        params[ite] = ''
      }
      this.corpName = ''
      this.dates = ''
      this.params = params
      this.getDataList()
    },
    getDataList (page) {
      this.table.loading = true
      let params = { ...this.params }
      if (page) {
        params.page = page
      } else {
        params.page = this.table.listQuery.page
      }

      params.limit = this.table.listQuery.pageSize
      getQueryConfirmationProblem(params).then((res) => {
        this.table.loading = false
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.table.list = data.page.list
          this.table.total = data.page.totalCount
        }
      })
    },

    handleSizeChange (val) {
      this.table.listQuery.page = 1
      this.table.listQuery.pageSize = val
      this.getDataList()
    },
    handleCurrentChange (val) {
      this.table.listQuery.page = val
      this.getDataList()
    }
  },
  created () {
    getTX().then((res) => {
      let data = res.data
      if (data.code === 0 && data.msg === 'success') {
        this.line = data.list
      }
    })
    this.getCompanyList()
    this.getDataList()
  }
}
</script>

<style>
</style>