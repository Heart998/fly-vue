<template>
  <div>
    <!-- 诚信教育合规培训 -->
    <taskBaseInfo v-bind="forms"></taskBaseInfo>
    <el-form :model="forms" :inline="true" ref="forms" :rules="dataRule" label-width="150px" class="problemDisabled">
      <el-row>
        <div class="clear"></div>
        <h3 class="form_h3_title">
          <div class="line_type_shu"></div>任务信息
        </h3>
        <el-form-item label="合规教育时间:" prop="day">
          <el-date-picker value-format="yyyy-MM-dd" v-model="forms.day" type="date" placeholder="选择日期时间" align="right" style="width:240px" :picker-options="pickerOptions" :disabled="problemDisabled"
            :class="{noborder: problemDisabled}">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合规教育时长:" prop="length">
          <el-input type="number" :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.length" style="width:240px">
            <template slot="append">分</template>
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="参与对象:" prop="participant">
          <el-input v-model="forms.participant" :class="{noborder: problemDisabled}" :disabled="problemDisabled" style="width:240px"></el-input>
        </el-form-item> -->
        <el-form-item label="参与人数:" prop="number">
          <el-input v-model="forms.number" type="number" :class="{noborder: problemDisabled}" :disabled="problemDisabled" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="培训讲师:" prop="teacher">
          <el-input v-model="forms.teacher" :class="{noborder: problemDisabled}" :disabled="problemDisabled" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="课件名称:" prop="material">
          <el-input v-model="forms.material" :class="{noborder: problemDisabled}" :disabled="problemDisabled" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="是否属于自创:" prop="original">
          <el-select v-model="forms.original" style="width:240px" :disabled="problemDisabled" :class="{noborder: problemDisabled}">
            <el-option :label="item.label" :value="item.id" v-for="(item, index) in checkTypeArr" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-col :span="24">
          <el-form-item label="合规教育内容:" class="flex-box children_flex" prop="content">
            <el-input type="textarea" v-model="forms.content" :class="{noborder: problemDisabled}" :disabled="problemDisabled" :rows="2"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-show="forms.original">
          <el-form-item label="上传课件:" prop="fileList1">
            <upload v-bind="forms.fileList1" @changeFileList="kejianFileFn" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上传其他附件:">
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
import checkAndReview from '@/views/modules/task-management/task-common/footterCheckReview'
import footterButton from '@/views/modules/task-management/task-common/footterButtonBox'
import LevelArr from '@/mixins/level-arr'
import {
  contacttrainSubmitFn,
  contacttrainEditFn,
  getFormsHx
} from '@/api/task-processing/index.js'
export default {
  mixins: [LevelArr],
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
        },
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      editNum: '0',
      checkAndReviewShow: false,
      id: '',
      shenheboxshow: false,
      problemDisabled: false,
      forms: {
        id: '',
        taskId: '',
        day: '',
        length: '',
        content: '',
        participant: '',
        number: '',
        teacher: '',
        material: '',
        original: '',
        path: '',
        files: [],
        fileList1: {
          files: [],
          limit: 1,
          uploadbtnshow: true
        },
        fileList2: {
          files: [],
          uploadbtnshow: true
        }
      },

      pcParams: {},
      dataRule: {
        day: [
          { required: true, message: '合规教育时间不能为空', trigger: 'blur' }
        ],
        length: [
          { required: true, message: '合规教育时长不能为空', trigger: 'blur' }
        ],
        participant: [
          { required: true, message: '参与对象不能为空', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '参与人数不能为空', trigger: 'blur' }
        ],
        teacher: [
          { required: true, message: '培训讲师不能为空', trigger: 'blur' }
        ],
        material: [
          { required: true, message: '课件名称不能为空', trigger: 'blur' }
        ],
        fileList1: [
          { required: true, message: '课件不能为空', trigger: 'blur' }
        ],
        original: [
          { required: true, message: '是否属于自创不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '合规教育内容不能为空', trigger: 'blur' }
        ]
      }

    }
  },

  methods: {
    getFormsHx (id) {
      getFormsHx({ id }).then((res) => {
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          let {
            id,
            taskId,
            day,
            length,
            content,
            participant,
            number,
            teacher,
            material,
            original,
            path,
            pathName
          } = data.business
          let files = data.taskFiles
          this.forms.id = id
          this.forms.taskId = taskId
          this.forms.day = day
          this.forms.length = length
          this.forms.content = content
          this.forms.participant = participant
          this.forms.pathName = pathName
          this.forms.taskFiles =
            data.taskFiles !== null && data.taskFiles.length
              ? data.taskFiles.map((item) => {
                return {
                  fileName: item.fileName,
                  fileUrl: item.fileUrl
                }
              })
              : []
          this.forms.number = number
          this.forms.teacher = teacher
          material !== null ? material : '?'
          this.forms.material = material
          this.forms.original = original
          this.forms.fileList1.files =
            path !== null && path !== '' ? [{ name: pathName, url: path }] : []
          this.forms.fileList2.files =
            files !== null && files.length
              ? files.map((item) => {
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
            this.forms.fileList1.uploadbtnshow = false
            this.forms.fileList2.uploadbtnshow = false
          }
        }
      })
    },
    onEdit () {
      this.$refs.forms.validate((valid) => {
        if (this.forms.original == true) {
          if (this.forms.path === '' || this.forms.path === undefined) {
            this.$message({
              type: 'info',
              message: '请上传文件'
            })
            return
          }
        }
        if (valid) {
          this.$confirm('任务修改后将不能修改，是否继续提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.btnloading = true
            let params = { ...this.forms }
            delete params.fileList1
            delete params.fileList2
            contacttrainEditFn(params).then((res) => {
              var data = res.data
              this.btnloading = false
              if (data.code === 0 && data.msg === 'success') {
                this.$message.success('修改成功')
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
        if (this.forms.original == true) {
          if (this.forms.path === '' || this.forms.path === undefined) {
            this.$message({
              type: 'info',
              message: '请上传文件'
            })
            return
          }
        }

        if (validate) {
          this.$confirm('任务提交后将不能修改，是否继续提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.btnloading = true
            let params = {
              taskId: this.id,
              day: this.forms.day,
              length: this.forms.length,
              type: this.forms.type,
              content: this.forms.content,
              participant: this.forms.participant,
              number: this.forms.number,
              teacher: this.forms.teacher,
              material: this.forms.material,
              original: this.forms.original,
              path: this.forms.path,
              pathName: this.forms.pathName,
              files: this.forms.files
            }
            contacttrainSubmitFn(params).then((res) => {
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
      if (arr.length <= 0) {
        this.forms.path = ''
        this.forms.pathName = ''
      } else {
        this.forms.path = arr[0].fileUrl
        this.forms.pathName = arr[0].fileName
      }
    },

    moreFilesFn (arr) {
      this.forms.files = arr
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
            this.forms.fileList1.uploadbtnshow = false
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
          this.forms.fileList1.uploadbtnshow = false
          this.forms.fileList2.uploadbtnshow = false
          this.problemDisabled = true
          this.checkAndReviewShow = true
          this.pcParams = this.taskParams.pcParams
        } else if (
          this.taskParams.type === 'queren' ||
          this.taskParams.type === 'kaohe'
        ) {
          this.forms.fileList1.uploadbtnshow = false
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