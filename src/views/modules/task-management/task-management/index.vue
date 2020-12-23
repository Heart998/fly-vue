<template>
  <div class="mod-config">
    <el-form :inline="true" :model="forms" ref="forms" @keyup.enter.native="getDataList()">
      <el-row>
        <el-form-item>
          任务名称:
        </el-form-item>
        <el-form-item>
          <el-input v-model="forms.taskName" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item>
          任务类型:
        </el-form-item>
        <el-form-item>
          <el-select v-model="forms.type" clearable @change="resPage">
            <el-option v-for="item in assessmentTypeArr" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList(1)" v-if="isAuth('biz:taskdef:list')">查询</el-button>
          <el-button @click="resetDataList()">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-col>
            <el-dropdown split-button type="primary" @command="command" v-if="isAuth('biz:taskdef:save')">
              <span class="el-dropdown-link">
                新建任务
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">新建联系人任务</el-dropdown-item>
                <el-dropdown-item command="2">新建联络员任务</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>

        </el-form-item>
      </el-row>
    </el-form>

    <xtable v-bind="table" v-loading="table.loading" @handleSizeChange="handleSizeChange" @handleSelectionChange="handleSelectionChange" @handleCurrentChange="handleCurrentChange" />
    <!-- 弹窗, 新增 / 修改 -->

    <el-dialog :title="dataForm.id === ''? '新建任务' : '修改任务'" :close-on-click-modal="false" :visible.sync="addOrUpdateVisible" width="730px" style="font-weight: bold;">
      <br>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="任务类型" prop="type">
              <el-select v-model="dataForm.type" placeholder="请选择" style="width:240px" clearable>
                <el-option v-for="item in assessmentTypeArr" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行频率" v-if="frequencyshow" prop="frequency">
              <el-select v-model="dataForm.frequency" placeholder="请选择" style="width:240px" clearable>
                <el-option v-for="item in frequencyArr" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="截止时间" v-else prop="endTime">
              <el-date-picker  v-model="dataForm.endTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" align="right" :picker-options="pickerOptions" class="date_picker" style="width:240px;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="任务分类" prop="classify">
              <el-select v-if="dataForm.target === '1'" v-model="dataForm.classify" placeholder="请选择" style="width:240px" clearable @change="classifyChangeHandler">
                <el-option v-for="item in taskTypeLxrArradd" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                </el-option>
              </el-select>
              <el-select v-else v-model="dataForm.classify" placeholder="请选择" style="width:240px" clearable @change="classifyChangeHandler">
                <el-option v-for="item in taskTypeLlyArradd" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="任务名称" style="width:240px" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="涉及层级" prop="levels">
              <el-select v-if="dataForm.target === 1 || dataForm.target === '1'" multiple v-model="dataForm.levels" placeholder="请选择" style="width:240px" clearable>
                <el-option v-for="item in LevelArr" :key="item.id" :label="item.label" :value="item.id">
                </el-option>
              </el-select>
              <el-select v-else v-model="dataForm.levels" multiple placeholder="请选择" style="width:240px" clearable>
                <el-option label="职场" value="L4">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="涉及条线" prop="lines">
              <el-select v-model="dataForm.lines" multiple placeholder="请选择" style="width:240px" clearable>
                <el-option v-for="item in stripList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="涉及机构" prop="deptIds">
              <treeselect
                style="line-height:18px;padding-right: 16px;"
                :multiple="true"
                :flat="true" 
                value-consists-of="ALL"
                v-model="dataForm.deptIds" 
                :options="deptList" 
                :normalizer="deptNormalizer"
                :max-height="200"
                placeholder="请选择机构" >
                <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }" :class="labelClassName">
                {{ node.label }}
                <span v-if="shouldShowCount" :class="countClassName">({{ count }})</span>
                <el-button v-if="node.isBranch" type="text" @click.stop="treeSelectAll(node)">全选</el-button>
              </label>
              </treeselect>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="上传附件" size="mini">
              <upload @changeFileList="getFileList" v-bind="files" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="任务描述" size="mini" prop="description">
              <el-input type="textarea" v-model="dataForm.description" style="width: 575px;" :rows="2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrUpdateVisible = false" :disabled="btnloading">取消</el-button>
        <el-button type="primary" @click="submitFn" :loading="btnloading">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import xtable from '@/components/xtable/xtable'
import { getTX } from '@/api/common/index.js'
import {
  getDataList,
  addTask,
  editTask,
  saveBatch,
  getInfoById,
  closeFn
} from '@/api/task-management/index'
import LevelArr from '@/mixins/level-arr'
import upload from '@/components/el-upload/el-upload'
export default {
  mixins: [LevelArr],
  components: {
    xtable,
    upload
  },
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() <= Date.now()
        }
      },
      forms: {
        taskName: '',
        type: ''
      },
      dataForm: {
        target: '',
        type: '',
        frequency: '',
        endTime: '',
        classify: '',
        name: '',
        description: '',
        levels: [],
        lines: [],
        deptIds: [],
        id: '',
        files: []
      },
      files: {
        files: [],
        uploadbtnshow: true
      },
      dataList: [],
      deptList: [],
      dataListSelections: [],
      assessmentTypeArr: [],
      frequencyArr: [],
      frequencyarr: [],
      stripList: [],
      taskTypeLxrArr: [],
      taskTypeLxrArradd: [],
      taskTypeLlyArr: [],
      taskTypeLlyArradd: [],
      taskStatusArr: [],
      addOrUpdateVisible: false,
      btnloading: false,
      dataRule: {
        type: [
          { required: true, message: '任务类型不能为空', trigger: 'change' }
        ],
        frequency: [
          { required: true, message: '执行频率不能为空', trigger: 'change' }
        ],
        endTime: [
            { required: true, message: '任务名称不能为空', trigger: 'blur' }
        ],
        classify: [
          { required: true, message: '任务分类不能为空', trigger: 'change' }
        ],
        name: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '任务描述不能为空', trigger: 'blur' }
        ],
        levels: [
          { required: true, message: '涉及层级不能为空', trigger: 'change' }
        ],
        lines: [
          { required: true, message: '涉及条线不能为空', trigger: 'change' }
        ],
        files: [
          { required: true, message: '上传附件不能为空', trigger: 'blur' }
        ]
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
              method: (index, row) => {}
            },
            {
              label: '删除',
              type: 'danger',
              method: (index, row) => {}
            }
          ]
        },

        tableHeader: [
          {
            label: '任务名称',
            name: 'name',
            width: 100
          },
          {
            label: '层级',
            name: 'level'
          },
          //   {
          //     label: '条线',
          //     name: 'line',
          //     formatter: (row) => {
          //       let d = ''
          //       this.stripList.forEach(ite => {
          //         if (ite.id === row.line) {
          //           d = ite.name
          //         }
          //       })
          //       return d
          //     }
          //   },
          {
            label: '任务类型',
            name: 'type',
            formatter: (row) => {
              if (row.type === 'linshi') {
                return '临时任务'
              } else if (row.type === 'guding') {
                return '固定任务'
              }
            }
          },
          {
            label: '执行频率',
            name: 'frequency',
            width: 70,
            formatter: (row) => {
              let b = ''
              this.frequencyarr.forEach((ite) => {
                if (ite.dictValue === row.frequency) {
                  b = ite.dictLabel
                }
              })
              return b
            }
          },
          {
            label: '任务分类',
            name: 'classify',
            formatter: (row) => {
              let c = ''
              if (row.target === '1') {
                // 联系人任务
                this.taskTypeLxrArr.forEach((ite) => {
                  if (ite.dictValue === row.classify) {
                    c = ite.dictLabel
                  }
                })
              } else {
                // 联络员任务
                this.taskTypeLlyArr.forEach((ite) => {
                  if (ite.dictValue === row.classify) {
                    c = ite.dictLabel
                  }
                })
              }

              return c
            }
          },
          {
            label: '发起人',
            name: 'userName'
          },
          {
            label: '发起部门',
            name: 'deptName'
          },
          {
            label: '发起时间',
            name: 'createTime',
            width: 80
          },
          {
            label: '状态',
            name: 'status',
            width: 70,
            formatter: (row) => {
              let a = ''
              this.taskStatusArr.forEach((item) => {
                if (item.dictValue === row.status.toString()) {
                  a = item.dictLabel
                }
              })
              return a
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
          //   isDropDown: true,
          fixed: 'right',
          width: 250,
          list: [
            {
              label: '查看',
              type: 'text',
              filter: (row) => {
                return true
              },
              method: (index, row) => {
                this.looklinkto(row)
              }
            },
            {
              label: '修改',
              type: 'text',
              filter: (row) => {
                if (this.isAuth('biz:taskdef:update')) {
                  if (row.status === 0 || row.status === 1) {
                    return true
                  } else {
                    return false
                  }
                } else {
                  return false
                }
              },
              method: (index, row) => {
                if (row.classify === 'prs') {
                  this.taskTypeLxrArradd.push({
                    dictLabel: '联系人问题整改',
                    dictValue: 'prs'
                  })
                  this.taskTypeLlyArradd.push({
                    dictLabel: '联络员问题整改',
                    dictValue: 'prs'
                  })
                }
                this.openTaskDialog(row.target, row.id)
              }
            },
            {
              label: '执行',
              type: 'text',
              filter: (row) => {
                if (this.isAuth('biz:taskbatch:save')) {
                  if (row.type === 'linshi') {
                    if (row.status === 2) {
                      return false
                    } else {
                      return true
                    }
                  } else {
                    return false
                  }
                } else {
                  return false
                }
              },
              method: (index, row) => {
                this.saveBatchFn(row)
              }
            },
            {
              label: '删除',
              type: 'text',
              filter: (row) => {
                if (this.isAuth('biz:taskdef:delete')) {
                  if (row.status === 0 || row.status === 1) {
                    return true
                  } else {
                    return false
                  }
                } else {
                  return false
                }
              },
              method: (index, row) => {
                this.deleteHandle(row.id)
              }
            },
            {
              label: '关闭',
              type: 'text',
              filter: (row) => {
                if (row.status === 2 && row.type === 'guding') {
                  return true
                } else {
                  return false
                }
              },
              method: (index, row) => {
                this.closeFn(row.id)
              }
            }
          ]
        },
        multipleSelection: [] // 多选框勾选中的信息
      }
    }
  },
  created () {
    this.getAssessmentTypeDic()
    this.getFrequencyArrDic()
    this.getTaskTypeDic()
    this.getLine()
    this.getCompanyList()
    this.getStatus()
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    treeSelectAll(node){
      var ids = new Array();
      this.getTreeNodeId(node,ids);
      if(this.dataForm.deptIds.indexOf(node.id) == -1){
        ids.forEach(i=>{
          var idx = this.dataForm.deptIds.indexOf(i);
          if(idx !== -1){
            this.dataForm.deptIds.splice(idx, 1);
          }
        })
      }else{
        ids.forEach(i=>{
          if(this.dataForm.deptIds.indexOf(i) === -1){
            this.dataForm.deptIds.push(i);
          }
        })
      }
    },
    getTreeNodeId(node, arr) {
      arr.push(node.id);
      if (node.children && node.children.length > 0) {
        node.children.forEach((item) => {
          this.getTreeNodeId(item, arr);
        });
      }
    },
    // 部门树形数据格式化
    deptNormalizer (node) {
      if (node.children && node.children.length > 0) {
        return {
          id: node.id,
          label: node.name,
          children: node.children
        }
      } else {
        return {
          id: node.id,
          label: node.name,
          children: undefined
        }
      }
    },
    // 获取部门列表
    getCompanyList () {
      return this.$http({
        url: this.$http.adornUrl('/sys/company/list'),
        method: 'get',
        params: this.$http.adornParams({
          type: 1
        })
      }).then(({ data }) => {
        this.deptList = data && data.code === 0 ? data.data : []
      }).catch(() => {})
    },
    classifyChangeHandler (val) {
      if (val) {
        if (this.dataForm.target === '1') { this.dataForm.name = this.getDictLabel('linkman_task', val) } else { this.dataForm.name = this.getDictLabel('contact-task', val) }
      } else {
        this.dataForm.name = ''
      }
    },
    getLine () {
      // 获取条线字典
      getTX().then((res) => {
        if (res.data.code === 0 && res.data.msg === 'success') {
          this.stripList = res.data.list
        }
      })
    },
    // 获取任务分类字典
    getTaskTypeDic () {
      this.taskTypeLxrArr = this.getDictDataList('linkman_task')
      this.taskTypeLxrArradd = this.taskTypeLxrArr.filter((item) => {
        return item.dictValue !== 'prs'
      })
      this.taskTypeLlyArr = this.getDictDataList('contact-task')
      this.taskTypeLlyArradd = this.taskTypeLlyArr.filter((item) => {
        return item.dictValue !== 'prs'
      })
    },
    // 获取执行频率字典
    getFrequencyArrDic () {
      this.frequencyarr = this.frequencyArr = this.getDictDataList('frequency')
      this.frequencyArr = this.frequencyArr.filter(item => {
        return item.dictValue !== 'once'
      })
    },
    // 获取任务类型字典
    getAssessmentTypeDic () {
      this.assessmentTypeArr = this.getDictDataList('task_type')
    },
    // 获取任务状态字典
    getStatus () {
      this.taskStatusArr = this.getDictDataList('task_status')
    },
    command (type) {
      this.dataForm = {
        target: '',
        type: '',
        frequency: '',
        endTime: '',
        classify: '',
        name: '',
        description: '',
        levels: [],
        lines: [],
        deptIds: [],
        id: '',
        files: []
      }
      this.files.files = []
      this.taskTypeLxrArr = this.getDictDataList('linkman_task')
      this.taskTypeLxrArradd = this.taskTypeLxrArr.filter((item) => {
        return item.dictValue !== 'prs'
      })
      this.taskTypeLlyArr = this.getDictDataList('contact-task')
      this.taskTypeLlyArradd = this.taskTypeLlyArr.filter((item) => {
        return item.dictValue !== 'prs'
      })
      this.openTaskDialog(type, '')
    },
    // 打开弹窗（新增 编辑）
    openTaskDialog (type, id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        if (id !== '') {
          this.dataForm.id = id
          getInfoById(id).then((res) => {
            let data = res.data
            if (data.code === 0 && data.msg === 'success') {
              this.dataForm = { ...data.taskDef }
              this.files.files = data.taskDef.files.map((item) => {
                return {
                  name: item.fileName,
                  url: item.fileUrl
                }
              })
            }
          })
        }
        this.dataForm.target = type
      })
    },
    // 子组件回传fileList
    getFileList (fileList) {
      this.dataForm.files = fileList
    },
    // 点击弹窗触发
    submitFn () {
      let {
        target,
        type,
        frequency,
        endTime,
        classify,
        name,
        description,
        levels,
        lines,
        deptIds,
        id,
        files
      } = this.dataForm
      let params = {
        target: target,
        type: type,
        classify: classify,
        name: name,
        description: description,
        levels: levels,
        lines: lines,
        deptIds: deptIds,
        id: id,
        files: files
      }
      if (type === 'guding') {
        params.frequency = frequency
      } else {
        params.endTime = endTime
      }

      if (this.dataForm.id === '') {
        params.id = undefined
        this.addTaskFn(params)
      } else {
        this.editTaskFn(params)
      }
    },
    // 新增接口
    addTaskFn (params) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.btnloading = true
          addTask(params).then((res) => {
            let data = res.data
            if (data.code === 0 && data.msg === 'success') {
              this.httpSuccess()
              this.$message.success('新增成功')
            }
          })
        } else {
          return false
        }
      })
    },
    // 编辑接口
    editTaskFn (params) {
      this.btnloading = true
      editTask(params).then((res) => {
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.httpSuccess()
          this.$message.success('修改成功')
        }
      })
    },
    httpSuccess () {
      this.btnloading = false
      this.addOrUpdateVisible = false
      this.getDataList()
    },
    saveBatchFn (row) {
      this.$confirm('是否现在执行该任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.table.loading = true
          saveBatch({ defId: row.id })
            .then((res) => {
              let data = res.data
              if (data.code === 0 && data.msg === 'success') {
                this.$message.success('执行成功')
                this.getDataList()
              }
            })
            .catch(() => {
              this.table.loading = false
              this.$message.error('执行失败，请联系管理员！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消执行'
          })
        })
    },
    looklinkto (row) {
      this.$router.push({
        name: 'TaskManagementTaskLook',
        params: { id: row.id, target: row.target }
      })
    },
    handleSizeChange (val) {
      this.table.listQuery.pageSize = val
      this.table.listQuery.page = 1
      this.getDataList()
    },
    // 每次多选框勾选或取消时触发
    handleSelectionChange (val) {
      this.table.multipleSelection = val
    },
    //
    handleCurrentChange (val) {
      this.table.listQuery.page = val
      this.getDataList()
    },
    resPage () {
      this.table.listQuery.pageSize = 10
      this.table.listQuery.page = 1
      this.table.total = 1
    },
    resForm () {
      this.forms.taskName = ''
      this.forms.type = ''
    },
    // 重置数据
    resetDataList () {
      this.resForm()
      this.resPage()
      this.getDataList()
    },
    // 获取数据列表
    getDataList (page) {
      if (page) {
        this.table.listQuery.page = page
      }
      this.table.loading = true
      var params = {
        limit: this.table.listQuery.pageSize,
        page: this.table.listQuery.page,
        taskName: this.forms.taskName,
        type: this.forms.type
      }

      getDataList(params).then((res) => {
        if (res.data.code === 0 && res.data.msg === 'success') {
          this.table.list = res.data.page.list
          this.table.total = res.data.page.totalCount
          this.table.loading = false
        } else {
          this.$message.warning('获取数据失败')
        }
      })
    },
    // 执行中的固定任务可以关闭
    closeFn (id) {
      this.$confirm(`确定关闭该任务?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.table.loading = true
          closeFn(id).then((res) => {
            let data = res.data
            if (data.code === 0 && data.msg === 'success') {
              this.$message.success('任务已关闭')
              this.getDataList()
            }
          })
        })
        .catch((_) => {
          this.$message.error('关闭失败，请联系管理员！')
          this.table.loading = false
        })
    },
    // 删除
    deleteHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
          return item.id
        })
      this.$confirm(
        `确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.table.loading = true
        this.$http({
          url: this.$http.adornUrl('/biz/taskdef/deleteById/' + id),
          method: 'get'
        })
          .then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getDataList()
            } else {
              this.$message.warning(data.msg)
            }
          })
          .catch(() => {
            this.$message.error('删除失败，请联系管理员！')
            this.table.loading = false
          })
      })
    }
  },
  computed: {
    frequencyshow () {
      let e
      this.dataForm.type === 'guding' ? e = true : e = false
      return e
    }
  }
}
</script>
<style> 
.el-picker-panel__footer .el-button--text.el-picker-panel__link-btn {
  display: none;
}
</style>