<template>
  <div>
    人员访谈
    <taskBaseInfo v-bind="forms"></taskBaseInfo>

    <el-form :model="forms" :inline="true" ref="forms" :rules="dataRule" label-width="125px" class="problemDisabled">
      <h3 class="form_h3_title">
        <div class="line_type_shu"></div>任务信息
      </h3>
      <el-row>
        <el-form-item label="访谈原因" prop="reason">
          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.reason" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="访谈时间" prop="day">
          <el-date-picker :class="{noborder: problemDisabled}" v-model="forms.day" :disabled="problemDisabled" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="date" style="width:240px"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="访谈对象姓名" prop="userName">
          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.userName" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="访谈对象工号" prop="userCode">
          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.userCode" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="访谈结果" prop="result">
          <el-select v-model="forms.result" style="width:240px" :class="{noborder: problemDisabled}" :disabled="problemDisabled">
            <el-option label="正常" value="1"></el-option>
            <el-option label="异常" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="访谈人员" prop="checker">
          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.checker" style="width:240px"></el-input>
        </el-form-item>
        <el-col :span="24">
          <el-form-item label="上传附件:">
            <upload v-bind="forms.fileList2" @changeFileList="fileChangeFn2" />
          </el-form-item>
        </el-col>
        <div class="clear"></div>
      </el-row>
    </el-form>
    <h3 class="form_h3_title">
      <div class="line_type_shu"></div>访谈发现问题明细
    </h3>
    <xtable v-bind="table" v-loading="table.loading" />

    <el-dialog title="问题" :visible.sync="dialogVisible" append-to-body width="1300px">
      <el-form :model="visibleForm" :inline="true" :rules="problemRule" ref="visibleForm" label-width="160px" class="problemDisabled">
        <el-row>
          <el-form-item label="问题发生击机构:" prop="problemDept">

            <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="visibleForm.problemDept" style="width:240px"></el-input>
          </el-form-item>
          <el-form-item label="问题发生的时间:" prop="problemTime">
            <el-date-picker :class="{noborder: problemDisabled}" v-model="visibleForm.problemTime" :disabled="problemDisabled" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="date"
              style="width:240px" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="涉及金额:" prop="coverMoney">
            <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="visibleForm.coverMoney" type="number" style="width:240px">
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
        <el-button type="primary" @click="diaologSubmit" v-if="!problemDisabled">确 定</el-button>
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
import footterButton from '@/views/modules/task-management/task-common/footterButtonBox'
import { getTX } from '@/api/common/index.js'
import {
  contactinterviewSubmitFn,
  contactinterviewEditFn,
  getFormsHx,
  getFMQDDM,
  getFMQDDMCODE
} from '@/api/task-processing/index.js'
import taskBaseInfo from '@/views/modules/task-management/task-common/taskBaseInfo'
import checkAndReview from '@/views/modules/task-management/task-common/footterCheckReview'
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
      checkAndReviewShow: false,
      id: '',
      shenheboxshow: false,
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
        clueEntity: [],
        reason: '',
        day: '',
        userName: '',
        userCode: '',
        result: '',
        checker: '',
        taskFiles: [],
        fileList2: {
          files: [],
          uploadbtnshow: true
        }
      },
      visibleForm: {},
      dataRule: {
        reason: [
          { required: true, message: '访谈原因不能为空', trigger: 'blur' }
        ],
        day: [{ required: true, message: '检查时间不能为空', trigger: 'blur' }],
        userName: [
          { required: true, message: '访谈对象姓名不能为空', trigger: 'blur' }
        ],
        userCode: [
          { required: true, message: '访谈对象工号不能为空', trigger: 'blur' }
        ],
        result: [
          { required: true, message: '访谈结果不能为空', trigger: 'change' }
        ],
        checker: [
          { required: true, message: '访谈人员不能为空', trigger: 'blur' }
        ]
      },
      problemRule: {
        problemDept: [
          { required: true, message: '问题发生机构不能为空', trigger: 'blur' }
        ],
        problemTime: [
          { required: true, message: '问题发生时间不能为空', trigger: 'blur' }
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
          { required: true, message: '处理措施不能为空', trigger: 'blur' }
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
            label: '问题发生时间',
            name: 'problemTime',
            width: 110
          },
          {
            label: '涉及人员',
            name: 'problemTime'
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
      },
      pcParams: {}
    }
  },

  methods: {
    diaologSubmit () {
      this.$refs.visibleForm.validate((vals) => {
        if (vals) {
          if (this.subandedit === 'add') {
            this.indexTypeId += 1
            this.visibleForm.categoryArr = this.categoryArr
            let objs = JSON.stringify(this.visibleForm)
            let obj = JSON.parse(objs)
            obj.indexTypeId = this.indexTypeId
            obj.options = this.options
            this.table.list.push(obj)
          } else if (this.subandedit === 'edit') {
            this.visibleForm.categoryArr = this.categoryArr
            let editobjs = JSON.stringify(this.visibleForm)
            let editobj = JSON.parse(editobjs)
            editobj.indexTypeId = this.indexTypeId
            editobj.options = this.options
            let indd = null
            for (let i = 0; i < this.table.list.length; i++) {
              if (this.indexTypeId === this.table.list[i].indexTypeId) {
                indd = i
              }
            }
            this.table.list.splice(indd, 1, editobj)
          }
          this.dialogVisible = false
          this.watchTableListChange()
        } else {
          return false
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
    resForm () {
      this.visibleForm = {

        problemDept: '',
        problemTime: '',

        coverUser: '',
        handleSteps: '',
        handleResult: '',

        coverMoney: '',

        description: ''
      }
      this.categoryArr = []
      this.options = []
      try {
        this.$refs.visibleForm.resetFields()
      } catch (error) {
        console.log(error)
      }
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
            _this.taskParams.islook === 'yes' ||
            _this.taskParams.type === 'shenhe' ||
            _this.taskParams.type === 'choucha' ||
            _this.taskParams.type === 'kaohe' ||
            _this.taskParams.type === 'queren'
          ) {
            _this.forms.fileList2.uploadbtnshow = false
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
      this.$refs.forms.validate((validate) => {
        if (validate) {
          this.$confirm('任务修改后将不能修改，是否继续提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.btnloading = true
            let params = JSON.stringify(this.forms)
            params = JSON.parse(params)
            let arr = this.table.list.slice()
            let clueEntity = arr.map((item) => {
              let ite = item
              return ite
            })
            params.clueEntity = clueEntity
            params.taskId = this.id
            contactinterviewEditFn(params).then((res) => {
              var data = res.data
              this.btnloading = false
              if (data.code === 0 && data.msg === 'success') {
                this.$message.success('提交成功')
                this.$refs.footerbutton.back()
              } else {
                this.$message.warning(data.msg)
              }
            })
          }).catch(() => {
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
      this.$refs.forms.validate((validate) => {
        if (validate) {
          this.$confirm('任务提交后将不能修改，是否继续提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
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
            contactinterviewSubmitFn(params).then((res) => {
              var data = res.data
              this.btnloading = false
              if (data.code === 0 && data.msg === 'success') {
                this.$message.success('提交成功')
                this.$refs.footerbutton.back()
              } else {
                this.$message.warning(data.msg)
              }
            })
          }).catch(() => {
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
          this.forms.fileList2.uploadbtnshow = false
          this.shenheboxshow = true
          this.getFormsHx(this.forms.id)
          this.problemDisabled = true
        } else if (this.taskParams.type === 'choucha') {
          this.table.title.list[0].show = false
          this.forms.fileList2.uploadbtnshow = false
          this.checkAndReviewShow = true
          this.shenheboxshow = true
          this.getFormsHx(this.forms.id)
          this.problemDisabled = true
        } else if (this.taskParams.type === 'pclook') {
          this.table.title.list[0].show = false
          this.getFormsHx(this.forms.id)
          this.forms.fileList2.uploadbtnshow = false
          this.problemDisabled = true
          this.checkAndReviewShow = true
          this.pcParams = this.taskParams.pcParams
        } else if (
          this.taskParams.type === 'queren' ||
          this.taskParams.type === 'kaohe'
        ) {
          this.table.title.list[0].show = false
          this.forms.fileList2.uploadbtnshow = false
          this.getFormsHx(this.forms.id)
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