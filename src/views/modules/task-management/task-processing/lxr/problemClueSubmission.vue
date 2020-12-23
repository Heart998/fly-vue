<template>
  <div>

    <taskBaseInfo v-bind="forms"></taskBaseInfo>
    <el-form :model="forms" :inline="true" label-width="115px" class="problemDisabled" ref="forms" :rules="dataRules">
      <h3 class="form_h3_title">
        <div class="line_type_shu"></div>任务信息
      </h3>
      <el-form-item label="问题发生机构:" prop="problemDept">
        <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.problemDept" style="width:240px"></el-input>
      </el-form-item>
      <el-form-item label="问题发生时间:" prop="problemTime">
        <el-date-picker :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.problemTime" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width:240px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="涉及人员:" prop="coverUser">
        <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.coverUser" style="width:240px"></el-input>
      </el-form-item>
      <el-form-item label="涉及金额:" prop="coverMoney">
        <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.coverMoney" style="width:240px" type="number">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-col :span="24">
        <el-form-item label="具体问题描述:" class="flex-box children_flex" prop="description">
          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.description" type="textarea"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="处置措施:" class="flex-box children_flex" prop="handleSteps">
          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.handleSteps" type="textarea"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="处置结果:" class="flex-box children_flex" prop="handleResult">
          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.handleResult" type="textarea"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="上传附件:">
          <upload v-bind="forms.fileList2" @changeFileList="moreFilesFn" />
        </el-form-item>
      </el-col>
      <div class="clear"></div>
    </el-form>

    <footterButton @onSubmit="onSubmit" ref="footerbutton" v-if="this.editNum == 0"/>
      <footterButton @onSubmit="onEdit" ref="footerbutton" v-if="this.editNum == 1"/>
    <checkAndReview v-if="checkAndReviewShow" />
  </div>
</template>

<script>
import upload from '@/components/el-upload/el-upload'
import taskBaseInfo from '@/views/modules/task-management/task-common/taskBaseInfo'
import { linkmanclueSubmitFn, linkmanclueEditFn, getFormsHx } from '@/api/task-processing/index.js'
import checkAndReview from '@/views/modules/task-management/task-common/footterCheckReview'
import footterButton from '@/views/modules/task-management/task-common/footterButtonBox'
export default {
  components: {
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
      taskParams: {},
      problemDisabled: false,
      shenheboxshow: false,
      forms: {
        id: '',
        taskId: '',
        taskFiles: [],
        fileList2: {
          files: [],
          uploadbtnshow: true
        }
      },
      dataRules: {
        problemDept: [
          { required: true, message: '问题发生机构不能为空', trigger: 'bulr' }
        ],
        problemTime: [
          { required: true, message: '问题发生时间不能为空', trigger: 'bulr' }
        ],
        coverUser: [
          { required: true, message: '涉及人员不能为空', trigger: 'bulr' }
        ],
        coverMoney: [
          { required: true, message: '涉及金额不能为空', trigger: 'bulr' }
        ],
        description: [
          { required: true, message: '具体问题描述不能为空', trigger: 'bulr' }
        ],
        handleSteps: [
          { required: true, message: '处置措施不能为空', trigger: 'bulr' }
        ],
        handleResult: [
          { required: true, message: '处置结果不能为空', trigger: 'bulr' }
        ]
      }
    }
  },
  methods: {
    getFormsHx (id) {
      getFormsHx({ id }).then((res) => {
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.forms = { ...data.business }
          let taskFiles = null
          if (data.taskFiles) {
            taskFiles = data.taskFiles
          }
          this.forms.taskFiles =
            data.taskFiles !== null && data.taskFiles.length
              ? data.taskFiles.map((item) => {
                return {
                  fileName: item.fileName,
                  fileUrl: item.fileUrl
                }
              })
              : []
          this.forms.fileList2 = {}
          this.forms.fileList2.files =
            taskFiles !== null && taskFiles.length
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

    onEdit () {
      this.$refs.forms.validate((valsd) => {
        if (valsd) {
          this.$confirm('任务修改后将不能修改，是否继续提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.btnloading = true
            let params = { ...this.forms }
            params.taskFiles = this.forms.taskFiles
            delete params.fileList2
            linkmanclueEditFn(params).then((res) => {
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
      this.$refs.forms.validate((valsd) => {
        if (valsd) {
          this.$confirm('任务提交后将不能修改，是否继续提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.btnloading = true
            let params = { ...this.forms }
            params.taskId = this.id
            delete params.fileList2
            linkmanclueSubmitFn(params).then((res) => {
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
    moreFilesFn (arr) {
      this.forms.taskFiles = arr
    },
    gobackonce () {
      this.$router.go(-1)
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
            this.getFormsHx(this.forms.id)
            // 当任务状态为3、4则显示打分情况
            if(this.taskParams.status === 3 || this.taskParams.status === 4){
              this.checkAndReviewShow = true //显示打分情况
              this.editNum = -1
            }
          } else if (this.taskParams.islook === 'edit') {
            this.editNum = 1
            this.problemDisabled = false
            this.forms.fileList2.uploadbtnshow = false
            this.getFormsHx(this.forms.id)
          } else {
            this.problemDisabled = false
          }
        } else if (this.taskParams.type === 'shenhe') {
          this.checkAndReviewShow = true
          this.shenheboxshow = true
          this.getFormsHx(this.forms.id)
          this.problemDisabled = true
        } else if (this.taskParams.type === 'choucha') {
          this.checkAndReviewShow = true
          this.shenheboxshow = true
          this.getFormsHx(this.forms.id)
          this.problemDisabled = true
        } else if (this.taskParams.type === 'pclook') {
          this.getFormsHx(this.forms.id)
          this.problemDisabled = true
          this.checkAndReviewShow = true
          this.pcParams = this.taskParams.pcParams
        } else if (
          this.taskParams.type === 'queren' ||
          this.taskParams.type === 'kaohe'
        ) {
          this.getFormsHx(this.forms.id)
          this.problemDisabled = true
          this.checkAndReviewShow = true
          // 当任务状态为3、4则显示打分情况
          if(this.taskParams.status === 3 || this.taskParams.status === 4){
            this.checkAndReviewShow = true //显示打分情况
            this.editNum = -1
          }
        }
      }
    }
  },
  created () {
    this.inittaskParams()
  }
}
</script>

<style>
</style>