<template>
  <div>
    <el-form :inline="true" :model="params" label-width="80px">
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
        <el-select v-model="params.lineId" placeholder="请选择">
          <el-option v-for="(item,index) in line" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名:">
        <el-input v-model="params.realName" placeholder="请输入" clearable @keyup.enter.native="getDataList()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList(1)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resDataList"> 重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="importTemplate()">导出</el-button> 
      </el-form-item>
    </el-form>

    <xtable v-bind="table" v-loading="table.loading" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />
  </div>
</template>

<script>
import xtable from '@/components/xtable/xtable'
import qselect from '@/components/quarterly-select/index'
import { getTX } from '@/api/common/index'
import { getWorkloadSummary, getWorkloadSummaryExport} from '@/api/statistical-report/statistics-of-rectification-problems/index'
export default {
  components: {
    xtable
  },
  data () {
    return {
      companyListVisible: false,
      companyList: [],
      corpName: '',
      dates:'',
      params: {
        startTime: '',
        endTime: '',
        corpId: '',
        lineId: '',
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
            name: 'corpName',
            width: 80
          },
          {
            label: '所属条线',
            name: 'lineName',
            width: 80
          },
          {
            label: '姓名',
            name: 'realName',
            width: 80
          },
          {
            label: '合规培训次数',
            name: 'pxcs',
            width: 80
          },
          {
            label: '上传课件次数',
            name: 'kjcs',
            width: 100
          },
          {
            label: '风险排查次数',
            name: 'fxpc',
            width: 80
          },
          {
            label: '风险排查数量',
            name: 'pcsl',
            width: 80
          },
          {
            label: '督导检查次数',
            name: 'ddjc',
            width: 80
          },
          {
            label: '参与检查次数',
            name: 'cyjc',
            width: 80
          },
          {
            label: '问题线索数量',
            name: 'wtxs',
            width: 80
          },
          {
            label: '报告报表报送次数',
            name: 'bbbs',
            width: 80
          }
        ],
        total: 1,
        listQuery: {
          page: 1,
          pageSize: 10
        },
        multipleSelection: [] // 多选框勾选中的信息
      }
    }
  },
  methods: {
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
      this.params.corpId = data.id
      this.companyListVisible = false
    },
    resDataList () {
      this.table.listQuery = {
        page: 1,
        pageSize: 10
      }
      let params = {...this.params}
      for (let ite in this.params) {
        params[ite] = ''
      }
      this.corpId = ''
      this.dates = ''
      this.params = params
      this.$refs.qselect.resValue()
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
      getWorkloadSummary(params).then((res) => {
        this.table.loading = false
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.table.list = data.page.list
          this.table.total = data.page.totalCount
        }
      })
    },
    // 时间段转换
    pickerChange () {
      if (this.dates.length) {
        this.params.startTime = this.dates[0]
        this.params.endTime = this.dates[1]
      }
    },
    // 导出
    importTemplate () {
      let params = { ...this.params }
      getWorkloadSummaryExport(params).then((res) => {
        if (res) {
          const aLink = document.createElement('a')
          let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
          aLink.href = URL.createObjectURL(blob)
          aLink.setAttribute('download', '工作量汇总' + '.xlsx') // 设置下载文件名称
          aLink.click()
          this.$refs.loadElement.appendChild(aLink)
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