<template>
  <div>
    <taskBaseInfo v-bind="forms"></taskBaseInfo>
    <el-form :model="forms" :inline="true" label-width="130px" class="problemDisabled" ref="forms">
      <h3 class="form_h3_title">
        <div class="line_type_shu"></div>任务信息
      </h3>
      <el-row>
        <el-form-item label="报告名称" prop="stateName">
          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.stateName" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="报表名称" prop="reportName">
          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.reportName" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="报送对象" prop="reportUser">
          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.reportUser" style="width:240px"></el-input>
        </el-form-item>
        <el-col :span="24">
          <el-form-item label="内容描述" class="flex-box children_flex" prop="description">
            <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="textarea" v-model="forms.description"></el-input>
          </el-form-item>

        </el-col>
        <el-col :span="24">
          <el-form-item label="上传附件:">
            <upload v-bind="forms.fileList2" @changeFileList="moreFilesFn" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <footterButton @onSubmit="onSubmit" ref="footerbutton" v-if="this.editNum == 0" />
    <footterButton @onSubmit="onEdit" ref="footerbutton" v-if="this.editNum == 1" />
    <checkAndReview v-if="checkAndReviewShow" />
  </div>
</template>

<script>
import upload from '@/components/el-upload/el-upload'
import taskBaseInfo from '@/views/modules/task-management/task-common/taskBaseInfo'
import { linkmanreportSubmitFn, linkmanreportEditFn, getFormsHx } from '@/api/task-processing/index.js'
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
      pcParams: {},
      checkAndReviewShow: false,
      id: '',
      forms: {
        id: ''
      },
      editNum: '0',
      problemDisabled: false,
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
        stateName: [
          { required: true, message: '报告名称不能为空', trigger: 'blur' }
        ],
        reportName: [
          { required: true, message: '报表名称不能为空', trigger: 'blur' }
        ],
        reportUser: [
          { required: true, message: '报送对象不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '内容描述不能为空', trigger: 'blur' }
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
          if (this.taskParams.islook === 'yes' ||
            this.taskParams.type === 'shenhe' ||
            this.taskParams.type === 'choucha' ||
            this.taskParams.type === 'kaohe' ||
            this.taskParams.type === 'queren') {
            this.forms.fileList2.uploadbtnshow = false
          }
        }
      })
    },

    onEdit () {
      this.$refs.forms.validate((valye) => {
        if (valye) {
          this.$confirm('任务提交后将不能修改，是否继续提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.btnloading = true
            let params = { ...this.forms }
            params.taskId = this.id
            linkmanreportEditFn(params).then((res) => {
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
      this.$refs.forms.validate((valye) => {
        if (valye) {
          this.$confirm('任务提交后将不能修改，是否继续提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.btnloading = true
            let params = { ...this.forms }
            params.taskId = this.id
            delete params.fileList2
            delete params.id
            linkmanreportSubmitFn(params).then((res) => {
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
    kejianFileFn (arr) {
      console.log(arr)
      if (arr.length === 1) {
        this.forms.path = arr[0].fileUrl
        this.forms.material = arr[0].material
      }
    },
    moreFilesFn (arr) {
      this.forms.taskFiles = arr
      console.log(this.forms)
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
            this.forms.fileList2.uploadbtnshow = false
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
          }
        } else if (this.taskParams.type === 'shenhe') {
          this.checkAndReviewShow = true
          this.shenheboxshow = true
          this.getFormsHx(this.forms.id)
          this.problemDisabled = true
          this.forms.fileList2.uploadbtnshow = false
        } else if (this.taskParams.type === 'choucha') {
          this.checkAndReviewShow = true
          this.shenheboxshow = true
          this.getFormsHx(this.forms.id)
          this.problemDisabled = true
          this.forms.fileList2.uploadbtnshow = false
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
    this.inittaskParams()
  }
}
</script>

<style>
</style>