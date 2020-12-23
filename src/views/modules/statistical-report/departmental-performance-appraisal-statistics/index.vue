<template>
  <div>
    <el-form :inline="true" :model="params" label-width="80px">
      <el-form-item label="时间段:">
        <qselect @getValue="qselectvalue" ref="qselect" />
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
        <el-button type="primary" @click="importTemplate">导出</el-button>
      </el-form-item>
    </el-form>

    <xtable v-bind="table" v-loading="table.loading" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />
  </div>
</template>

<script>
import xtable from '@/components/xtable/xtable'
import qselect from '@/components/quarterly-select/index'
import { getTX } from '@/api/common/index'
import { getPerformanceList, getPerformanceListExport } from '@/api/statistical-report/statistics-of-rectification-problems/index'
export default {
  components: {
    xtable,
    qselect,
  },
  data() {
    return {
      companyListVisible: false,
      companyList: [],
      corpName: '',
      params: {
        season: '',
        corpId: '',
        lineId: '',
        realName: '',
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
          list: [],
        },

        tableHeader: [
          {
            label: '机构名称',
            name: 'corpName',
            width: 100,
          },
          {
            label: '所属条线',
            name: 'lineName',
            width: 120,
          },
          {
            label: '姓名',
            name: 'realName',
            width: 120,
          },
          {
            label: '风控培训完成率得分',
            name: 'hgpx',
            width: 120,
          },
          {
            label: '风险排查达标率得分',
            name: 'fxpc',
            width: 100,
          },
          {
            label: '整改达标率得分',
            name: 'wtzg',
            width: 120,
          },
           {
            label: '督导检查完成率得分',
            name: 'ddjc',
            width: 120,
          },
          {
            label: '数据报送达标率得分',
            name: 'bgbs',
            width: 120,
          },
          {
            label: '问题线索报送完成达标率',
            name: 'xsbs',
            width: 120,
          },
          {
            label: '加分',
            name: 'awarded',
            width: 120,
          },
          {
            label: '检查发现问题扣分',
            name: 'deduction',
            width: 120,
          },
          {
            label: '最终绩效考核成绩',
            name: 'score',
            width: 120,
          },
        ],
        total: 1,
        listQuery: {
          page: 1,
          pageSize: 10,
        },
        multipleSelection: [], // 多选框勾选中的信息
      },
    }
  },
  methods: {
    // 获取机构列表
    getCompanyList() {
      return this.$http({
        url: this.$http.adornUrl('/sys/company/list'),
        method: 'get',
        params: this.$http.adornParams({
          type: 1,
        }),
      })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.companyList = res.data
        })
        .catch(() => {})
    },
    companyListTreeCurrentChangeHandle(data) {
      this.corpName = data.name
      this.params.corpId = data.id
      this.companyListVisible = false
    },
    resDataList() {
      this.table.listQuery = {
        page: 1,
        pageSize: 10,
      }
      let params = { ...this.params }
      for (let ite in this.params) {
        params[ite] = ''
      }
      this.corpName = ''
      this.params = params
      this.$refs.qselect.resValue()
      this.getDataList()
    },
    getDataList(page) {
      this.table.loading = true
      let params = { ...this.params }
      if (page) {
        params.page = page
      } else {
        params.page = this.table.listQuery.page
      }
      params.limit = this.table.listQuery.pageSize
      getPerformanceList(params).then((res) => {
        this.table.loading = false
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.table.list = data.page.list
          this.table.total = data.page.totalCount
        }
      })
    },
            // 导出
    importTemplate() {
      let params = { ...this.params }
      getPerformanceListExport(params).then((res) =>{
        if (res) {
          const aLink = document.createElement("a");
          let blob = new Blob([res.data], {type: "application/vnd.ms-excel"})
          aLink.href = URL.createObjectURL(blob)
          aLink.setAttribute('download', '部门绩效考核汇总' + '.xlsx') // 设置下载文件名称
          aLink.click()
          this.$refs.loadElement.appendChild(aLink)
        }
      })
    },
    qselectvalue(val) {
      this.params.season = val
      console.log(val)
    },
    handleSizeChange(val) {
      this.table.listQuery.page = 1
      this.table.listQuery.pageSize = val
      this.getDataList()
    },
    handleCurrentChange(val) {
      this.table.listQuery.page = val
      this.getDataList()
    },
  },
  created() {
    getTX().then((res) => {
      let data = res.data
      if (data.code === 0 && data.msg === 'success') {
        this.line = data.list
      }
    })
    this.getCompanyList()
    this.getDataList()
  },
}
</script>

<style>
</style>




