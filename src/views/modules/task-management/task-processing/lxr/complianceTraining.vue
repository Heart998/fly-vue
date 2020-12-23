<template>
  <div>
    <!-- 合规培训 -->
    <taskBaseInfo v-bind="forms"></taskBaseInfo>
    <el-form :model="forms" :inline="true" label-width="120px" class="problemDisabled" ref="forms" :rules="dataRulse">
      <el-row>
        <div class="clear"></div>
        <h3 class="form_h3_title">
          <div class="line_type_shu"></div>任务信息
        </h3>
        <el-form-item label="培训时间:" prop="day">
          <el-date-picker value-format="yyyy-MM-dd" :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.day" type="date" placeholder="选择日期时间" align="right"
            style="width:240px" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="培训时长:" prop="length">
          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="forms.length" style="width:240px">
            <template slot="append">分</template>
          </el-input>
        </el-form-item>
        <el-form-item label="培训方式:" prop="type">
          <el-select v-model="forms.type" style="width:240px" :class="{noborder: problemDisabled}" :disabled="problemDisabled">
            <el-option label="面授" value="1"></el-option>
            <el-option label="视频" value="2"></el-option>
            <el-option label="其他" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="参与对象:" prop="participant">
          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.participant" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="参与人数:" prop="number">
          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.number" type="number" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="培训讲师:" prop="teacher">
          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.teacher" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="课件名称:" prop="material">
          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.material" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="是否属于自创:" prop="original">
          <el-select v-model="forms.original" style="width:240px" :class="{noborder: problemDisabled}" :disabled="problemDisabled">
            <el-option :label="item.dictLabel" :value="item.dictValue" v-for="(item, index) in checkTypeArr" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-col :span="24">
          <el-form-item label="培训内容:" class="flex-box children_flex">
            <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="textarea" v-model="forms.content" :autosize="{ minRows: 2, maxRows: 10}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上传课件:" prop="fileList1" v-if="forms.original">
            <upload v-bind="forms.fileList1" @changeFileList="kejianFileFn" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上传其他附件:">
            <!-- 每次上传成功或者删除一个附件都会触发changeFileList 方法 返回目前列表附件 -->
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
import checkAndReview from '@/views/modules/task-management/task-common/footterCheckReview'
import taskBaseInfo from '@/views/modules/task-management/task-common/taskBaseInfo'
import footterButton from '@/views/modules/task-management/task-common/footterButtonBox'
import {
  complianceTrainingSubmitFn,
  complianceTrainingEditFn,
  getFormsHx
} from '@/api/task-processing/index.js'
export default {
  components: {
    taskBaseInfo,
    upload,
    checkAndReview,
    footterButton
  },
  data () {
    return {
      editNum: '0',
      pcParams: {},
      shenheboxshow: false,
      btnloading: false,
      checkAndReviewShow: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() == Date.now()
        }
      },
      problemDisabled: false,
      checkTypeArr: [],
      dataRulse: {
        day: [{ required: true, message: '培训时间不能为空', trigger: 'blur' }],
        length: [
          { required: true, message: '培训时长不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '培训方式不能为空', trigger: 'change' }
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
        original: [{ required: true, message: '请选择', trigger: 'change' }],
        fileList1: [{ required: true, message: '上传课件', trigger: 'change' }],
        content: [
          { required: true, message: '培训内容不能为空', trigger: 'blur' }
        ]
      },
      forms: {
        id: '',
        taskId: '',
        day: '',
        status: '', // 添加状态
        length: '',
        type: '',
        content: '',
        participant: '',
        number: '',
        teacher: '',
        material: '',
        original: '',
        path: '',
        pathName: '',
        taskFiles: [],
        fileList1: {
          files: [], // 用来回显数据的地方 {name: '', url: ''}
          limit: 1, // 限制上传个数 不传默认5个可以去组件里面修改
          uploadbtnshow: true // true就现实 上传按钮 否则 按钮隐藏并且附件列表上移
        },
        fileList2: {
          files: [],
          uploadbtnshow: true
        }
      },
      pcParams: {}
    }
  },
  methods: {
    getFormsHx (id) {
      getFormsHx({ id }).then((res) => {
       
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          let {
            id,     // 尝试添加id  （查询并返回的业务id）
            taskId,
            day,
            status, // 添加状态
            length,
            type,
            content,
            participant,
            number,
            teacher,
            material,
            original,
            path,
            pathName
          } = data.business
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
          this.forms.id = id
          this.forms.taskId = taskId
          this.forms.day = day
          this.forms.status = status  // 添加状态
          this.forms.length = length
          this.forms.type = type
          this.forms.content = content
          this.forms.participant = participant
          this.forms.number = number
          this.forms.teacher = teacher
          this.forms.material = material
          this.forms.pathName = pathName
          this.forms.path = path
          this.forms.original = original
          this.forms.fileList1.files =
            path !== null && path !== '' ? [{ name: pathName, url: path }] : []
          this.forms.fileList2.files =
            taskFiles !== null && taskFiles.length
              ? taskFiles.map((item) => {
                return {
                  name: item.fileName,
                  url: item.fileUrl
                }
              })
              : []
        }
      })
    },
    onEdit () {
      this.$refs.forms.validate((validate) => {
         if(this.forms.original == false){
              this.forms.pathName = ''
              this.forms.path = ''
            }
            
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
          this.$confirm('任务修改后将不能修改，是否继续提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log(this.forms)
            this.btnloading = true
            
            let params = {
              id: this.forms.id,
              taskId: this.forms.taskId,
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
              taskFiles: this.forms.taskFiles
            }
            complianceTrainingEditFn(params).then((res) => {
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
    /***
     * --------------------------------------------------处理提交
     */
    onSubmit () {
      this.$refs.forms.validate((validate) => {
        if(this.forms.original == '是'){
              this.forms.fileList1 = ''
            }else{
              
            }
        if (validate) {
          if (this.forms.original == true) {
            if (this.forms.path === '' || this.forms.path === undefined) {
              this.$message({
                type: 'info',
                message: '请上传文件'
              })
              return
            }
          }
          this.$confirm('任务提交后将不能修改，是否继续提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.btnloading = true
           
            let params = {
              taskId: this.forms.id,
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
              taskFiles: this.forms.taskFiles,
              fileList1: this.forms.fileList1
            }
            complianceTrainingSubmitFn(params).then((res) => {
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
          this.forms.fileList1.files = []
      } else {
        this.forms.path = arr[0].fileUrl
        this.forms.pathName = arr[0].fileName
      }
    },
    getDic () {
      this.checkTypeArr = [
        {
          dictValue: 1,
          dictLabel: '是'
        },
        {
          dictValue: 0,
          dictLabel: '否'
        }
      ]
    },
    moreFilesFn (arr) {
      this.forms.taskFiles = arr
    },

    gobackonce () {
      this.$router.go(-1)
    },
    /* 初始化
    --------------------------------------- */
    inittaskParams () {
      this.taskParams = this.$store.state.more.taskParams
      console.log('taskParams', this.taskParams)
      if (
        this.taskParams.id !== '' &&
        this.taskParams.type !== '' &&
        this.taskParams.type !== undefined
      ) {
        this.forms.id = this.taskParams.id
        /**
         * 任务处理界面点进来的业务
         */
        if (this.taskParams.type === 'chuli') {
          this.shenheboxshow = false
          if (this.taskParams.islook === 'yes') {          // 查看方法
            this.problemDisabled = true
            this.forms.fileList1.uploadbtnshow = false
            this.forms.fileList2.uploadbtnshow = false
            this.getFormsHx(this.forms.id)
            // 当任务状态为3、4则显示打分情况
            if (this.taskParams.status === 3 || this.taskParams.status === 4) {
              this.checkAndReviewShow = true // 显示打分情况
              this.editNum = -1
            }
          } else if (this.taskParams.islook === 'edit') {     // 修改方法
            this.editNum = 1
            this.problemDisabled = false
            this.getFormsHx(this.forms.id)
          } else {
            this.problemDisabled = false
          }
        } else if (this.taskParams.type === 'shenhe') {
          this.getFormsHx(this.forms.id)
          this.forms.fileList1.uploadbtnshow = false
          this.forms.fileList2.uploadbtnshow = false
          this.problemDisabled = true
          this.checkAndReviewShow = true
        } else if (this.taskParams.type === 'choucha') {
          this.getFormsHx(this.forms.id)
          this.forms.fileList1.uploadbtnshow = false
          this.forms.fileList2.uploadbtnshow = false
          this.problemDisabled = true
          this.checkAndReviewShow = true
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
          this.getFormsHx(this.forms.id)
          this.forms.fileList1.uploadbtnshow = false
          this.forms.fileList2.uploadbtnshow = false
          this.problemDisabled = true
          this.checkAndReviewShow = true
          // 当任务状态为3、4则显示打分情况
          if (this.taskParams.status === 3 || this.taskParams.status === 4) {
            this.checkAndReviewShow = true // 显示打分情况
            this.editNum = -1
          }
        }
      } else {
        this.gobackonce()
      }
    }
  },
  created () {
    this.getDic()
    this.inittaskParams()
  }
}
</script>

<style scoped>
</style>