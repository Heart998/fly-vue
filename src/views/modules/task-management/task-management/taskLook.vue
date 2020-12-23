<template>
  <div>
    <el-form :model="tasklookForms" :inline="true" label-width="120px">
      <h3 class="form_h3_title"><div class="line_type_shu"></div>基本信息</h3>
      <el-row>
        <el-form-item label="任务类型:">
          <div class="lookdiv"> {{ getDictLabel('task_type',tasklookForms.type) }}</div>
        </el-form-item>
        <el-form-item label="执行频率:">
            <div class="lookdiv"> {{ getDictLabel('frequency',tasklookForms.frequency) }}</div>
        </el-form-item>
        <el-form-item label="任务分类:">
          <div class="lookdiv" v-if="tasklookForms.target === '1'"> {{ getDictLabel('linkman_task',tasklookForms.classify) }}</div>
          <div class="lookdiv" v-else> {{ getDictLabel('contact-task',tasklookForms.classify) }}</div>
        </el-form-item>
        <el-form-item label="任务名称:">
          <div class="lookdiv">{{tasklookForms.name}}</div>
        </el-form-item>
        <el-form-item label="涉及层级:">
            <div class="lookdiv"> {{ level }}</div>
        </el-form-item>
        <el-form-item label="涉及条线:">
             <div class="lookdiv"> {{ tasklookForms.line }}</div>
        </el-form-item>
        <el-form-item label="发起部门:">
             <div class="lookdiv"> {{ tasklookForms.deptName }}</div>
        </el-form-item>
        <el-form-item label="发起时间:">
            <div class="lookdiv"> {{ tasklookForms.createTime }}</div>
        </el-form-item>
        <el-col :span="24" >
          <el-form-item label="涉及机构:">
            <div class="lookdiv" style="width: 500px" :title="tasklookForms.deptNames"> {{ tasklookForms.deptNames }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24" >
          <el-form-item label="任务状态:">
              <div class="lookdiv"> {{  getDictLabel('task_status',tasklookForms.status.toString()) }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24" >
          <el-form-item label="查看附件:" size="mini">
              <upload v-bind="tasklookForms.files"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="任务描述:" class="flex-box children_flex">
              <el-input disabled class="noborder" type="textarea" v-model="tasklookForms.description" :rows="2"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h3 class="form_h3_title"><div class="line_type_shu"></div>批次列表</h3>
    <xtable v-bind="table" v-loading="table.loading" @handleSizeChange="handleSizeChange"  @handleCurrentChange="handleCurrentChange" />
    <!-- <div class="fixed-bottm-box">
        <el-button @click="goback">返回</el-button>
    </div> -->
    <br>
    <div class="fixed-bottm-box">
        <el-button @click="goback">返回</el-button>
    </div>
  </div>
</template>

<script>
import xtable from '@/components/xtable/xtable'
import { getBaseInfo, getPcList } from '@/api/task-management/index'
import LevelArr from '@/mixins/level-arr'
import { getTX } from '@/api/common/index.js'
import upload from '@/components/el-upload/el-upload'
export default {
  mixins: [LevelArr],
  components: {
    xtable, upload
  },
  data () {
    return {
      level: '',
      problemDisabled: false,
      tasklookForms: {
        type: '',
        frequency: '',
        classify: '',
        name: '',
        levels: '',
        lines: '',
        deptName: '',
        createTime: '',
        status: '',
        description: '',
        id: '',
        files: {
          files: [],
          uploadbtnshow: false
        },
        target: '' // 判断联系人还是联络员
      },
      taskStatusArr: [],
      stripList: [],
      table: {
        height: '200px',
        loading: false,
        list: [],
        isMultiple: false,
        typeIndex: true,
        title: {
          show: false
        },

        tableHeader: [
          {
            label: '任务批次号',
            name: 'code'
          },
          {
            label: '任务数量',
            name: 'number'
          },
          {
            label: '考核起始时间',
            name: 'startTime'
          },
          {
            label: '考核截至时间',
            name: 'endTime'
          },
          {
            label: '创建时间',
            name: 'createTime'
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
          fixed: 'right',
          width: 100,
          list: [
            {
              label: '任务列表',
              type: 'text',
              method: (index, row) => {
                this.linkto(row)
              }
            }
          ]
        }
      }
    }
  },
  methods: {
    init () {
      let params = this.$route.params
      if (
        params.id !== undefined &&
        params.id !== null
      ) {
        this.tasklookForms.target = params.target
        this.tasklookForms.id = params.id
        this.getLine()

        this.getBaseForms(params.id)
        this.getPcListFn()
      } else {
        this.goback()
      }
    },
    linkto (row) {
      this.$router.push({
        name: 'TaskManagementPcList',
        params: {lastId: this.tasklookForms.id, lastTarget: this.tasklookForms.target, code: row.code}
      })
    },
    // 获取基础信息
    getBaseForms (id) {
      getBaseInfo(id).then((res) => {
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.tasklookForms = data.taskDef
          let files = data.taskDef.files.map(item => {
            return {
              name: item.fileName,
              url: item.fileUrl
            }
          })
          this.tasklookForms.files = {files, uploadbtnshow: false}
          this.levels(this.tasklookForms.levels)
        }
      })
    },
    // 获取批次列表
    getPcListFn () {
      this.table.loading = true
      let params = {
        page: this.table.listQuery.page,
        limit: this.table.listQuery.pageSize,
        id: this.tasklookForms.id
      }
      getPcList(params)
        .then(res => {
          let data = res.data
          if (data.code === 0 && data.msg === 'success') {
            this.table.loading = false
            this.table.list = data.page.list
            this.table.total = data.page.totalCount
          }
        })
    },
    // 获取条线
    getLine () {
      getTX().then((res) => {
        if (res.data.code === 0 && res.data.msg === 'success') {
          this.stripList = res.data.list
        }
      })
    },

    goback () {
      this.$router.push({
        path: '/task-management-task-management/index'
      })
    },
    levels (levels) {
      if (levels.length === 0) {
        return false
      }
      let a = ''

      if (this.tasklookForms.target === '1') {
        let _this = this
        levels.forEach(itea => {
          for (let i = 0; i < _this.LevelArr.length; i++) {
            if (itea === _this.LevelArr[i].id) {
              a += _this.LevelArr[i].label + ','
            }
          }
        })
        a = a.slice(0, -1)
      } else {
        a = '职场'
      }
      this.level = a
    },
    handleSizeChange (val) {
      this.table.listQuery.pageSize = val
      this.getPcListFn()
    },
    handleCurrentChange (val) {
      this.table.listQuery.page = val
      this.getPcListFn()
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
.noborder{
    border: none;
}
</style>