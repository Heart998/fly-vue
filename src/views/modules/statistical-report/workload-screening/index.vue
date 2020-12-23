<template>
  <div>
    <el-form :inline="true" :model="params" label-width="80px">
      
      <el-form-item label="任务名称:">
        <el-input v-model="params.taskName" placeholder="请输入" clearable @keyup.enter.native="getDataList()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList(1)" v-if="isAuth('biz:risk:list')">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resDataList"> 重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="importTemplate()" v-if="isAuth('biz:exportLinkmanRisk:export')">导出</el-button> 
      </el-form-item>
    </el-form>

    <xtable v-bind="table" v-loading="table.loading" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />
  </div>
</template>

<script>
import xtable from '@/components/xtable/xtable'
import qselect from '@/components/quarterly-select/index'
import { getLinkmanRisk, getLinkmanRiskExport} from '@/api/statistical-report/statistics-of-rectification-problems/index'
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
        taskName: ''
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
            label: '任务名称',
            name: 'taskname',
            width: 100
          },
          {
            label: '培训课件数量',
            name: 'pxNum',
            width: 100,
            formatter: (row) => {
                if(row.pxNum === null){
                    return 0
                }else{
                   return row.pxNum
                }
            }
          },
          {
            label: '产说会课件数量',
            name: 'cshNum',
            width: 100,
            formatter: (row) => {
                if(row.cshNum === null){
                    return 0
                }else{
                   return row.cshNum
                }
            }
          },
          {
            label: '宣传资料数量',
            name: 'xcNum',
            width: 100,
            formatter: (row) => {
                if(row.xcNum === null){
                    return 0
                }else{
                   return row.xcNum
                }
            }
          },
          {
            label: '投诉件数量',
            name: 'tsNum',
            width: 100,
            formatter: (row) => {
                if(row.tsNum === null){
                    return 0
                }else{
                   return row.tsNum
                }
            }
          },
          {
            label: '企划方案数量',
            name: 'qhNum',
            width: 100,
            formatter: (row) => {
                if(row.qhNum === null){
                    return 0
                }else{
                   return row.qhNum
                }
            }
          },
          {
            label: '保单数量',
            name: 'bdNum',
            width: 100,
            formatter: (row) => {
                if(row.bdNum === null){
                    return 0
                }else{
                   return row.bdNum
                }
            }
          },
          {
            label: '短信数量',
            name: 'dxNum',
            width: 100,
            formatter: (row) => {
                if(row.dxNum === null){
                    return 0
                }else{
                   return row.dxNum
                }
            }
          },
          {
            label: '微信数量',
            name: 'wxNum',
            width: 100,
            formatter: (row) => {
                if(row.wxNum === null){
                    return 0
                }else{
                   return row.wxNum
                }
            }
          },
          {
            label: '朋友圈数量',
            name: 'pyqNum',
            width: 100,
            formatter: (row) => {
                if(row.pyqNum === null){
                    return 0
                }else{
                   return row.pyqNum
                }
            }
          },
          {
            label: '重点销售人员数量',
            name: 'zdxsNum',
            width: 100,
            formatter: (row) => {
                if(row.zdxsNum === null){
                    return 0
                }else{
                   return row.zdxsNum
                }
            }
          }
          ,
          {
            label: '非重点销售人员数量',
            name: 'fzdxsNum',
            width: 100,
            formatter: (row) => {
                if(row.fzdxsNum === null){
                    return 0
                }else{
                   return row.fzdxsNum
                }
            }
          }
          ,
          {
            label: '财务凭证数量',
            name: 'cwpzNum',
            width: 100,
            formatter: (row) => {
                if(row.cwpzNum === null){
                    return 0
                }else{
                   return row.cwpzNum
                }
            }
          }
          ,
          {
            label: '中介机构协议数量',
            name: 'zjxyNum',
            width: 100,
            formatter: (row) => {
                if(row.zjxyNum === null){
                    return 0
                }else{
                   return row.zjxyNum
                }
            }
          }
          ,
          {
            label: '中介机构网点数量',
            name: 'zjwdNum',
            width: 100,
            formatter: (row) => {
                if(row.zjwdNum === null){
                    return 0
                }else{
                   return row.zjwdNum
                }
            }
          }
          ,
          {
            label: '第三方网络平台数量',
            name: 'wrNum',
            width: 100,
            formatter: (row) => {
                if(row.wrNum === null){
                    return 0
                }else{
                   return row.wrNum
                }
            }
          }
          ,
          {
            label: '单证数量',
            name: 'dzNum',
            width: 100,
            formatter: (row) => {
                if(row.dzNum === null){
                    return 0
                }else{
                   return row.dzNum
                }
            }
          }
          ,
          {
            label: '印章数量',
            name: 'yzNum',
            width: 100,
            formatter: (row) => {
                if(row.yzNum === null){
                    return 0
                }else{
                   return row.yzNum
                }
            }
          }
          ,
          {
            label: '回访录音',
            name: 'hfName',
            width: 100,
            formatter: (row) => {
                if(row.hfName === null){
                    return 0
                }else{
                   return row.hfName
                }
            }
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
   
    resDataList () {
      this.table.listQuery = {
        page: 1,
        pageSize: 10
      }
      this.params.taskName = ''
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
      getLinkmanRisk(params).then((res) => {
        this.table.loading = false
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.table.list = data.page.list
          this.table.total = data.page.totalCount
        }
      })
    },
   
    // 导出
    importTemplate () {
      let params = { ...this.params }
      getLinkmanRiskExport(params).then((res) => {
        if (res) {
          const aLink = document.createElement('a')
          let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
          aLink.href = URL.createObjectURL(blob)
          aLink.setAttribute('download', '排查工作量汇总' + '.xlsx') // 设置下载文件名称
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
    this.getDataList()
  }
}
</script>

<style>
</style>