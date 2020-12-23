<template>
  <div>

    <taskBaseInfo v-bind="forms"></taskBaseInfo>
    <el-form :model="forms" :inline="true" label-width="140px" class="problemDisabled" ref="forms" :rules="dataRules">
      <h3 class="form_h3_title">
        <div class="line_type_shu"></div>任务信息
      </h3>
      <el-row>
        <el-form-item label="项目名称:" prop="project">
          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.project" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="检查时间:" prop="checkTime">
          <el-date-picker :class="{noborder: problemDisabled}" v-model="forms.checkTime" :disabled="problemDisabled" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="date"
            style="width:240px" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检查对象:" prop="checkObj">
          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.checkObj" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="是否担任检查组长:" prop="leader">
          <el-select :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.leader" placeholder="请选择" style="width:240px">
            <el-option v-for="item in checkTypeArr" :key="item.id" :label="item.label" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-col :span="24">
          <el-form-item label="负责检查内容:" class="flex-box children_flex" prop="content">
            <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.content" type="textarea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上传附件:" class="flex-box children_flex">
            <upload v-bind="forms.fileList2" @changeFileList="moreFilesFn" />
          </el-form-item>
        </el-col>
        <div style="clear:both;"></div>
        <h3 class="form_h3_title">
          <div class="line_type_shu"></div>检查发现问题明细
        </h3>
        <xtable v-bind="table" v-loading="table.loading" />

      </el-row>
    </el-form>

    <el-dialog title="问题" :visible.sync="dialogVisible" append-to-body width="1300px">
      <el-form :model="visibleForm" :inline="true" label-width="160px" ref="visibleForm" :rules="problemRulse">
        <el-row>
          <el-form-item label="问题发生击机构:" prop="problemDept">

            <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="visibleForm.problemDept" style="width:240px"></el-input>
          </el-form-item>
          <el-form-item label="问题发生的时间:" prop="problemTime">
            <el-date-picker :class="{noborder: problemDisabled}" :picker-options="pickerOptions" v-model="visibleForm.problemTime" :disabled="problemDisabled" value-format="yyyy-MM-dd" type="date"
              style="width:240px" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="涉及金额:" prop="coverMoney">
            <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="visibleForm.coverMoney" style="width:240px">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-col :span="24">
            <el-form-item label="涉及人员:" class="flex-box children_flex" prop="coverUser">
              <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="textarea" v-model="visibleForm.coverUser" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="具体问题描述:" class="flex-box children_flex" prop="description">
              <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="textarea" v-model="visibleForm.description" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="处置措施:" class="flex-box children_flex" prop="handleSteps">
              <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="textarea" v-model="visibleForm.handleSteps" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="处置结果:" class="flex-box children_flex" prop="handleResult">
              <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="textarea" v-model="visibleForm.handleResult" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit" v-if="!problemDisabled">确 定</el-button>
      </span>
    </el-dialog>

    <footterButton @onSubmit="onSubmit" ref="footerbutton" v-if="this.editNum == 0" />
    <footterButton @onSubmit="onEdit" ref="footerbutton" v-if="this.editNum == 1" />

    <checkAndReview v-if="checkAndReviewShow" />
  </div>
</template>

<script>
import xtable from '@/components/xtable/xtable'
import upload from '@/components/el-upload/el-upload'
import LevelArr from '@/mixins/level-arr'
import { getTX } from '@/api/common/index.js'
import {
  linkmanparticipationSubmitFn,
  linkmanparticipationEdit,
  getFormsHx,
  getFMQDDM,
  getFMQDDMCODE
} from '@/api/task-processing/index.js'
import checkAndReview from '@/views/modules/task-management/task-common/footterCheckReview'
import footterButton from '@/views/modules/task-management/task-common/footterButtonBox'
import taskBaseInfo from '@/views/modules/task-management/task-common/taskBaseInfo'
export default {
  mixins: [LevelArr],
  components: {
    xtable,
    taskBaseInfo,
    upload,
    checkAndReview,
    footterButton
  },
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      editNum: '0',
      pcParams: {},
      checkAndReviewShow: false,
      id: '',
      btnloading: false,
      indexTypeId: 1, // 用来记录假数据的下标
      subandedit: '', // 判断form是添加还是编辑
      DicRiskClassArr: [],
      DicLineArr: [],
      DicPostTypeeArr: [],
      DicProblemDiscoveryArr: [],
      categoryArr: [],
      loading: false,
      options: [],
      dialogVisible: false,
      problemDisabled: false,
      forms: {
        id: '',
        bizId: '',
        project: '',
        clueEntity: [],
        taskFiles: [],
        fileList2: {
          files: [],
          uploadbtnshow: true
        }
      },
      visibleForm: {},
      // 表单验证
      dataRules: {
        project: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' }
        ],
        checkTime: [
          { required: true, message: '检查时间不能为空', trigger: 'blur' }
        ],
        checkObj: [
          { required: true, message: '检查对象不能为空', trigger: 'blur' }
        ],
        leader: [
          {
            required: true,
            message: '是否担任检查组长不能为空',
            trigger: 'change'
          }
        ],
        content: [
          { required: true, message: '负责检查内容不能为空', trigger: 'blur' }
        ]
      },
      problemRulse: {
        problemDept: [
          {
            required: true,
            message: '问题发生击机构不能为空',
            trigger: 'blur'
          }
        ],
        problemTime: [
          {
            required: true,
            message: '问题发生的时间不能为空',
            trigger: 'blur'
          }
        ],
        coverMoney: [
          { required: true, message: '涉及金额不能为空', trigger: 'blur' }
        ],
        coverUser: [
          { required: true, message: '涉及人员不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '具体问题描述不能为空', trigger: 'blur' }
        ],
        handleSteps: [
          { required: true, message: '处置措施不能为空', trigger: 'blur' }
        ],
        handleResult: [
          { required: true, message: '处置结果不能为空', trigger: 'blur' }
        ]
      },
      table: {
        loading: false,
        list: [],
        isMultiple: false,
        typeIndex: true,
        title: {
          show: true,
          align: 'left',
          label: '',
          list: [
            {
              label: '新增问题',
              show: true,
              size: 'small',
              type: 'primary',
              method: () => {
                this.addProblem()
              }
            }
          ]
        },
        tableHeader: [
          {
            label: '问题发送机构',
            name: 'problemDept',
            width: 100
          },
          {
            label: '问题发送时间',
            name: 'problemTime',
            width: 100
          },
          {
            label: '涉及人员',
            name: 'coverUser'
          },
          {
            label: '涉及金额',
            name: 'coverMoney',
            width: 100
          },
          {
            label: '具体问题描述',
            name: 'description',
            width: 100
          },
          {
            label: '处置措施',
            name: 'handleSteps',
            width: 200
          },
          {
            label: '处置结果',
            name: 'handleResult',
            width: 200
          }
        ],
        // 操作
        operates: {
          show: true,
          fixed: 'right',
          width: 150,
          list: [
            {
              label: '编辑',
              type: 'text',
              show: true,
              method: (index, row) => {
                this.editFn(row)
              },
              filter: (row) => {
                return !this.problemDisabled
              }
            },
            {
              label: '查看',
              type: 'text',
              method: (index, row) => {
                this.lookFn(row)
              }
            },
            {
              label: '删除',
              type: 'text',
              show: true,
              method: (index, row) => {
                this.del(row)
              },
              filter: (row) => {
                return !this.problemDisabled
              }
            }
          ]
        }
      }
    }
  },

  methods: {
    dialogSubmit () {
      let that = this
      that.$refs.visibleForm.validate((validate) => {
        if (validate) {
          if (that.subandedit === 'add') {
            that.indexTypeId += 1
            that.visibleForm.categoryArr = that.categoryArr
            let objs = JSON.stringify(that.visibleForm)
            let obj = JSON.parse(objs)
            obj.indexTypeId = that.indexTypeId
            obj.options = that.options
            that.table.list.push(obj)
          } else if (that.subandedit === 'edit') {
            // debugger

            that.visibleForm.categoryArr = that.categoryArr
            let editobjs = JSON.stringify(that.visibleForm)
            let editobj = JSON.parse(editobjs)
            let indd = null
            if (this.taskParams.islook === 'edit') {
              for (let i = 0; i < that.table.list.length; i++) {
                if (that.indexTypeId === that.table.list[i].id) {
                  indd = i
                }
              }
            } else {
              editobj.indexTypeId = that.indexTypeId
              editobj.options = that.options

              for (let i = 0; i < that.table.list.length; i++) {
                if (that.indexTypeId === that.table.list[i].indexTypeId) {
                  indd = i
                }
              }
            }

            that.table.list.splice(indd, 1, editobj)
          }
          that.dialogVisible = false
          this.watchTableListChange()
        } else {
          return false
        }
      })
    },
    resForm () {
      for (let item in this.visibleForm) {
        this.visibleForm[item] = ''
      }
      this.categoryArr = []
      this.options = []
    },
    getBaseInfoHxData (row) {
      this.forms.project = row.name
    },
    editFn (row) {
      this.resForm()
      this.subandedit = 'edit'
      this.visibleForm = { ...row }
      this.categoryArr = row.categoryArr
      this.indexTypeId = row.indexTypeId
      this.options = row.options
      this.dialogVisible = true
    },
    lookFn (row) {
      this.resForm()
      this.subandedit = 'look'
      this.visibleForm = { ...row }
      this.dialogVisible = true
      this.fmqdChange(row.problemCode)
    },
    del (row) {
      let indd = null
      for (let i = 0; i < this.table.list.length; i++) {
        if (row.indexTypeId === this.table.list[i].indexTypeId) {
          indd = i
        }
      }
      this.table.list.splice(indd, 1)
    },
    addProblem () {
      this.resForm()
      this.dialogVisible = true
      this.subandedit = 'add'
      this.options = []
    },
    moreFilesFn (arr) {
      this.forms.taskFiles = arr
    },
    fmqdChange (val) {
      getFMQDDMCODE({ code: val }).then((res) => {
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.categoryArr = data.classifyVos
          this.visibleForm.category1 = this.categoryArr[0].code
          this.visibleForm.category2 = this.categoryArr[1].code
          this.visibleForm.category3 = this.categoryArr[2].code
          this.visibleForm.category4 = this.categoryArr[3].code
        }
      })
    },
    watchTableListChange () {
      if(this.table.list){
        this.table.list = this.table.list.filter((item) => {
          if (item.indexTypeId === undefined) {
            item.indexTypeId = item.id
          }
          return item
        })
      }
    },
    getFormsHx (id) {
      let _this = this
      getFormsHx({ id }).then((res) => {
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          _this.forms = { ...data.business }
          _this.forms.clueEntity = data.commonClues
          _this.table.list = data.commonClues
          _this.watchTableListChange()
          let taskFiles = data.taskFiles
          this.forms.taskFiles =
            data.taskFiles !== null && data.taskFiles.length
              ? data.taskFiles.map((item) => {
                return {
                  fileName: item.fileName,
                  fileUrl: item.fileUrl
                }
              })
              : []
          _this.forms.fileList2 = {}
          _this.forms.fileList2.files =
            taskFiles.length > 0
              ? taskFiles.map((item) => {
                return {
                  name: item.fileName,
                  url: item.fileUrl
                }
              })
              : []

          if (
            this.taskParams.islook === 'yes' ||
            this.taskParams.type === 'shenhe' ||
            this.taskParams.type === 'choucha' ||
            this.taskParams.type === 'kaohe' ||
            this.taskParams.type === 'queren'
          ) {
            this.forms.fileList2.uploadbtnshow = false
          }
        }
      })
    },
    remoteMethod (name) {
      if (name !== '') {
        this.loading = true
        getFMQDDM({ name }).then((res) => {
          this.loading = false
          let data = res.data
          if (data.code === 0 && data.msg === 'success') {
            setTimeout(() => {
              this.options = data.classifyVos
            }, 200)
          }
        })
      } else {
        this.options = []
      }
    },
    onEdit () {
      this.$refs.forms.validate((vaild) => {
        if (vaild) {
          this.$confirm('任务修改后将不能修改，是否继续提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.btnloading = true
              let params = JSON.stringify(this.forms)
              params = JSON.parse(params)
              let arr = this.table.list.slice()
              let clueEntity = arr.map((item) => {
                let ite = item
                this.forms.bizId = ite.bizId
                delete ite.options
                delete ite.id
                delete ite.indexTypeId
                return ite
              })
              params.clueEntity = clueEntity
              linkmanparticipationEdit(params).then((res) => {
                var data = res.data
                this.btnloading = false
                if (data.code === 0 && data.msg === 'success') {
                  this.$message.success('提交成功')
                  this.$refs.footerbutton.back()
                } else {
                  this.$message.warning(data.msg)
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
        } else {
          return false
        }
      })
    },
    onSubmit () {
      this.$refs.forms.validate((vaild) => {
        if (vaild) {
          this.$confirm('任务提交后将不能修改，是否继续提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.btnloading = true
              let params = JSON.stringify(this.forms)
              params = JSON.parse(params)
              let arr = this.table.list.slice()
              let clueEntity = arr.map((item) => {
                let ite = item
                delete ite.options
                delete ite.indexTypeId
                return ite
              })
              params.clueEntity = clueEntity
              delete params.fileList2
              params.taskId = this.id
              delete params.id
              linkmanparticipationSubmitFn(params).then((res) => {
                var data = res.data
                this.btnloading = false
                if (data.code === 0 && data.msg === 'success') {
                  this.$message.success('提交成功')
                  this.$refs.footerbutton.back()
                } else {
                  this.$message.warning(data.msg)
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
        } else {
          return false
        }
      })
    },
    fileChangeFn1 (arr) {
      this.forms.hfName = arr[0].fileName
      this.forms.hfUrl = arr[0].fileUrl
    },
    fileChangeFn2 (arr) {
      this.forms.taskFiles = arr
    },
    gobackonce () {
      this.$router.go(-1)
    },
    getDic () {
      getTX().then((res) => {
        if (res.data.code === 0 && res.data.msg === 'success') {
          this.DicLineArr = res.data.list
        }
      }) // 条线字典

      //   this.DicPostTypeeArr = this.getDictDataList('post_typee') // 岗位

      this.DicRiskClassArr = this.getDictDataList('risk_class') // 风险等级
      this.DicProblemDiscoveryArr = this.getDictDataList('problem_discovery') // 发现问题途径
    },
    inittaskParams () {
      this.taskParams = this.$store.state.more.taskParams
      if (this.taskParams.id === '' && this.taskParams.type === '') {
        this.gobackonce()
      } else {
        this.forms.id = this.id = this.taskParams.id
        if (this.taskParams.type === 'chuli') {
          if (this.taskParams.islook === 'yes') {
            this.problemDisabled = true
            this.forms.fileList2.uploadbtnshow = false
            this.table.title.show = false
            this.getFormsHx(this.forms.id)
            // 当任务状态为3、4则显示打分情况
            if (this.taskParams.status === 3 || this.taskParams.status === 4) {
              this.checkAndReviewShow = true // 显示打分情况
              this.editNum = -1
            }
          } else if (this.taskParams.islook === 'edit') {
            this.editNum = 1
            this.problemDisabled = false
            this.forms.fileList2.uploadbtnshow = false
            this.getFormsHx(this.forms.id)
          } else {
            this.problemDisabled = false
            this.table.title.show = true
          }
        } else if (this.taskParams.type === 'shenhe') {
          this.table.title.list[0].show = false
          this.checkAndReviewShow = true
          this.shenheboxshow = true
          this.getFormsHx(this.forms.id)
          this.problemDisabled = true
        } else if (this.taskParams.type === 'choucha') {
          this.table.title.list[0].show = false
          this.checkAndReviewShow = true
          this.shenheboxshow = true
          this.getFormsHx(this.forms.id)
          this.problemDisabled = true
        } else if (this.taskParams.type === 'pclook') {
          this.getFormsHx(this.forms.id)
          this.forms.fileList2.uploadbtnshow = false
          this.problemDisabled = true
          this.checkAndReviewShow = true
          this.pcParams = this.taskParams.pcParams
        } else if (
          this.taskParams.type === 'queren' ||
          this.taskParams.type === 'kaohe'
        ) {
          this.getFormsHx(this.forms.id)
          this.forms.fileList2.uploadbtnshow = false
          this.problemDisabled = true
          this.checkAndReviewShow = true
          // 当任务状态为3、4则显示打分情况
          if (this.taskParams.status === 3 || this.taskParams.status === 4) {
            this.checkAndReviewShow = true // 显示打分情况
            this.editNum = -1
          }
        }
      }
    }
  },
  created () {
    this.getDic()
    this.inittaskParams()
  }
}
</script>

<style>
</style>