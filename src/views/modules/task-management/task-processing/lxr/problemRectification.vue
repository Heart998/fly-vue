<template>
  <div>
    <!-- 问题整改 -->
    <taskBaseInfo v-bind="forms"></taskBaseInfo>

    <h3 class="form_h3_title">
      <div class="line_type_shu"></div>
      关联问题
    </h3>
    <el-form :model="forms" :inline="true" label-width="170px" class="problemDisabled" ref="forms">
      <el-row>
        <el-form-item label="问题发生击机构:" prop="problemDeptName">
          <el-input class="noborder" disabled v-model="forms.problemDeptName" style="width:240px"></el-input>
        </el-form-item>

        <el-form-item label="负面清单代码:" prop="problemCode">
          <el-select class="noborder" disabled v-model="forms.problemCode" filterable :loading="loading" :remote-method="remoteMethod" remote reserve-keyword style="width:240px" @change="fmqdChange"
            clearable>
            <el-option v-for="item in options" :key="item.code" :label="item.code + item.code" :value="item.code">
              <span style="float: left">{{ item.code }}&nbsp;|&nbsp;{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型1:">
          <el-select class="noborder" v-model="forms.category1" style="width:240px" disabled>
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型2:">
          <el-select class="noborder" v-model="forms.category2" style="width:240px" disabled>
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型3:" disabled>
          <el-select class="noborder" v-model="forms.category3" style="width:240px" disabled>
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型4:">
          <el-select class="noborder" v-model="forms.category4" style="width:240px;" disabled>
            <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="风险等级:" prop="riskLevel">
          <el-select class="noborder" disabled v-model="forms.riskLevel" style="width:240px;">
            <el-option v-for="item in DicRiskClassArr" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题主责条线:" prop="mainLine">

          <el-input class="noborder" disabled v-model="forms.mainLine" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="问题主责岗位:" prop="mainPost">

          <el-input class="noborder" disabled v-model="forms.mainPost" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="问题涉及条线:" prop="lines">
          <el-select class="noborder" disabled v-model="forms.lines" multiple style="width:240px;">
            <el-option v-for="item in DicLineArr" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题涉及层级:" prop="levels">
          <el-select class="noborder" disabled v-model="forms.levels" multiple style="width:240px;">
            <el-option v-for="item in LevelArr" :key="item.id" :label="item.label" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="涉及金额:" prop="coverMoney">

          <el-input class="noborder" disabled v-model="forms.coverMoney" style="width:240px">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="问题主责人员:" prop="mainUser">

          <el-input class="noborder" disabled v-model="forms.mainUser" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="涉及件次:" prop="coverNum">

          <el-input class="noborder" disabled type="number" v-model="forms.coverNum" style="width:240px">
            <template slot="append">次</template>
          </el-input>
        </el-form-item>
        <el-form-item label="损失金额:" prop="lossMoney">

          <el-input class="noborder" disabled v-model="forms.lossMoney" style="width:240px">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="问题发生的时间:" prop="problemTime">
          <el-input class="noborder" disabled v-model="forms.problemTime" style="width:240px"></el-input>
          <!-- <el-date-picker class="noborder" v-model="forms.problemTime"  value-format="yyyy-MM-dd" type="date" style="width:240px" placeholder="选择日期">
          </el-date-picker> -->
        </el-form-item>
        <el-form-item label="发现问题时间:" prop="foundTime">
          <el-date-picker class="noborder" disabled v-model="forms.foundTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width:240px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发现问题途径:" prop="foundWay">
          <el-select class="noborder" disabled v-model="forms.foundWay" style="width:240px;">
            <el-option v-for="item in DicProblemDiscoveryArr" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>

        <el-col :span="8">
          <el-form-item label="涉及部门,岗位,人员:" class="flex-box children_flex" prop="others">

            <el-input class="noborder" disabled type="textarea" v-model="forms.others" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="具体问题描述:" class="flex-box children_flex" prop="description">

            <el-input class="noborder" disabled type="textarea" v-model="forms.description" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备注:" class="flex-box children_flex" prop="remark">
            <el-input class="noborder" disabled type="textarea" v-model="forms.remark" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form :model="visForms" :inline="true" label-width="170px" class="problemDisabled" ref="visForms" :rules="visFormsRules">
      <el-row>
        <h3 class="form_h3_title">
          <div class="line_type_shu"></div>任务信息
        </h3>
        <el-col :span="24">
          <el-form-item label="问题产生原因:" class="flex-box children_flex" prop="reason">
            <el-input :disabled="problemDisabled" :class="{noborder: problemDisabled}" type="textarea" :rows="2" placeholder="请输入内容" v-model="visForms.reason"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="问题整改措施:" class="flex-box children_flex" prop="reformSteps">
            <el-input :disabled="problemDisabled" :class="{noborder: problemDisabled}" type="textarea" :rows="2" placeholder="请输入内容" v-model="visForms.reformSteps"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="问题整改结果:" class="flex-box children_flex" prop="rectificationResults">
            <el-input :disabled="problemDisabled" :class="{noborder: problemDisabled}" type="textarea" :rows="2" placeholder="请输入内容" v-model="visForms.rectificationResults"></el-input>
          </el-form-item>
        </el-col>
        <el-form-item label="整改类型:" prop="reformType">
          <el-select v-model="visForms.reformType" placeholder="请选择" :disabled="problemDisabled" :class="{noborder: problemDisabled}" style="width:150px">
            <el-option v-for="item in DicRectificationArr" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
            </el-option>
          </el-select>
          <!-- <el-input :disabled="problemDisabled" :class="{noborder: problemDisabled}" v-model="visForms.reformType" style="width:150px"></el-input> -->
        </el-form-item>
        <el-form-item label="整改主责条线:" prop="reformLine">
          <el-input :disabled="problemDisabled" :class="{noborder: problemDisabled}" v-model="visForms.reformLine" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="整改主责岗位:" prop="reformPost">
          <el-input :disabled="problemDisabled" :class="{noborder: problemDisabled}" v-model="visForms.reformPost" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="整改负责人:" prop="reformUser">
          <el-input :disabled="problemDisabled" :class="{noborder: problemDisabled}" v-model="visForms.reformUser" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="配合整改部门:" prop="reformDept">
          <el-input :disabled="problemDisabled" :class="{noborder: problemDisabled}" v-model="visForms.reformDept" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="整改状态:" prop="rectificationStatus">
          <el-select v-model="visForms.rectificationStatus" placeholder="请选择" :disabled="problemDisabled" :class="{noborder: problemDisabled}" style="width:150px">
            <el-option v-for="item in rectificationStatu" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划完成整改时间:" prop="reformTime" v-if="visForms.rectificationStatus == 0 || visForms.rectificationStatus == 1">
          <el-date-picker :disabled="problemDisabled" :class="{noborder: problemDisabled}" v-model="visForms.reformTime" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="date"
            placeholder="选择日期" style="width:150px">
          </el-date-picker>
        </el-form-item>
        <el-col :span="24">
          <el-form-item label="销售人员问责措施:" class="flex-box children_flex" prop="punishSales">
            <el-input :disabled="problemDisabled" :class="{noborder: problemDisabled}" type="textarea" :rows="2" placeholder="请输入内容" v-model="visForms.punishSales"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="管理人员问责措施:" class="flex-box children_flex" prop="punishManager">
            <el-input :disabled="problemDisabled" :class="{noborder: problemDisabled}" type="textarea" :rows="2" placeholder="请输入内容" v-model="visForms.punishManager"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上传附件:">
            <upload v-bind="visForms.fileList2" @changeFileList="fileChangeFn2" />
          </el-form-item>
        </el-col>

      </el-row>
      <div class="clear"></div>
    </el-form>
    <footterButton @onSubmit="onSubmit" ref="footerbutton" v-if="this.editNum == 0" />
    <footterButton @onSubmit="onEdit" ref="footerbutton" v-if="this.editNum == 1" />
    <checkAndReview v-if="checkAndReviewShow" />
  </div>
</template>

<script>
import upload from '@/components/el-upload/el-upload'
import LevelArr from '@/mixins/level-arr'
import { getTX } from '@/api/common/index.js'
import {
  commonrectifySubmitFn,
  commonrectifyEditFn,
  getFMQDDM,
  getFMQDDMCODE,
  problemInfo
} from '@/api/task-processing/index.js'
import checkAndReview from '@/views/modules/task-management/task-common/footterCheckReview'
import footterButton from '@/views/modules/task-management/task-common/footterButtonBox'
import taskBaseInfo from '@/views/modules/task-management/task-common/taskBaseInfo'
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
          let times = time.getTime() + 24 * 60 * 60 * 1000
          return times <= Date.now()
        }
      },
      editNum: '0',
      rectificationStatu: [{
        value: '0',
        label: '未完成'
      }, {
        value: '1',
        label: '部分完成'
      }, {
        value: '2',
        label: '已完成'
      }
      ],
      value: '',
      pcParams: {},
      shenheboxshow: false,
      checkAndReviewShow: false,
      DicRiskClassArr: [],
      DicLineArr: [],
      DicPostTypeeArr: [],
      DicProblemDiscoveryArr: [],
      categoryArr: [],
      loading: false,
      options: [],
      DicRectificationArr: [],
      btnloading: false,
      problemDisabled: false,
      forms: {
        id: '',
        category1: '',
        problemId: ''
      },
      visForms: {
        taskId: '',
        reformSteps: '',
        reason: '',
        fileList2: {
          files: [],
          uploadbtnshow: true
        },
        taskFiles: []
      },
      // 问题明细表单验证
      problemRule: {
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

        problemCode: [
          { required: true, message: '负面清单代码不能为空', trigger: 'blur' }
        ],
        // category1 : [
        //     {required: true, message: '类型1不能为空', trigger: 'change'}
        // ],
        // category2 : [
        //     {required: true, message: '类型2:不能为空', trigger: 'change'}
        // ],
        // category3 : [
        //     {required: true, message: '分类名称 : 分类名称不能为空', trigger: 'change'}
        // ],
        // category4 : [
        //     {required: true, message: '分类名称 : 分类名称不能为空', trigger: 'change'}
        // ],
        levels: [
          { required: true, message: '问题涉及层级不能为空', trigger: 'blur' }
        ],
        lines: [
          { required: true, message: '问题涉及条线不能为空', trigger: 'blur' }
        ],
        riskLevel: [
          { required: true, message: '风险等级不能为空', trigger: 'change' }
        ],
        coverMoney: [
          { required: true, message: '涉及金额不能为空', trigger: 'blur' }
        ],
        lossMoney: [
          { required: true, message: '损失金额不能为空', trigger: 'blur' }
        ],
        coverNum: [
          { required: true, message: '涉及件次不能为空', trigger: 'blur' }
        ],
        foundTime: [
          { required: true, message: '发现问题时间不能为空', trigger: 'blur' }
        ],
        foundWay: [
          {
            required: true,
            message: '发现问题途径不能为空',
            trigger: 'change'
          }
        ],
        mainLine: [
          { required: true, message: '问题主责条线不能为空', trigger: 'blur' }
        ],
        mainPost: [
          { required: true, message: '问题主责岗位不能为空', trigger: 'blur' }
        ],
        mainUser: [
          { required: true, message: '问题主责人员不能为空', trigger: 'blur' }
        ],
        others: [
          {
            required: true,
            message: '涉及部门,岗位,人员不能为空',
            trigger: 'blur'
          }
        ],
        description: [
          { required: true, message: '具体问题描述不能为空', trigger: 'blur' }
        ],
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
      },
      // 表单验证
      visFormsRules: {
        reason: [
          { required: true, message: '问题产生原因不能为空', trigger: 'blur' }
        ],
        reformSteps: [
          { required: true, message: '问题整改措施不能为空', trigger: 'blur' }
        ],
        reformTime: [
          {
            required: true,
            message: '计划完成整改时间不能为空',
            trigger: 'blur'
          }
        ],
        rectificationStatus: [{
          required: true,
          message: '整改状态不能为空',
          trigger: 'change'
        }],
        reformType: [
          { required: true, message: '整改类型不能为空', trigger: 'blur' }
        ],
        reformLine: [
          { required: true, message: '整改主责条线不能为空', trigger: 'blur' }
        ],
        reformPost: [
          { required: true, message: '整改主责岗位不能为空', trigger: 'blur' }
        ],
        reformUser: [
          { required: true, message: '整改负责人不能为空', trigger: 'blur' }
        ],
        reformDept: [
          { required: true, message: '配合整改部门不能为空', trigger: 'blur' }
        ],
        punishSales: [
          {
            required: true,
            message: '销售人员问责措施不能为空',
            trigger: 'blur'
          }
        ],
        punishManager: [
          {
            required: true,
            message: '管理人员问责措施不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    resForm () {
      for (let item in this.forms) {
        this.forms[item] = ''
      }
      this.categoryArr = []
      this.options = []
      try {
        this.$refs.visibleForm.resetFields()
      } catch (error) {
        console.log(error)
      }
    },
    addProblem () {
      this.dialogVisible = true
      this.resForm()

      this.subandedit = 'add'
      this.options = []
    },
    fmqdChange (val) {
      console.log(val)
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
    problemInfo (id) {
      let _this = this
      problemInfo({ id }).then((res) => {
        let dataProblemCode = res.data.commonProblem.problemCode
        // 获取清单代码，调取字典转换为文字
        if (dataProblemCode != '') {
          this.fmqdChange(dataProblemCode)
        }
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          let data = res.data
          const idc = this.forms.id
          _this.forms = { ...data.commonProblem }
          let a = ''
          let arr = []
          this.DicLineArr.map((item) => {
            for (let i = 0; i < _this.forms.mainLines.length; i++) {
              if (_this.forms.mainLines[i] === item.id) {
                console.log(item)
                a = item.name
                arr.push(a)
              }
            }
            a = arr.join(',')
            console.log(a)
            return a
          })
          _this.forms.mainLine = a
          _this.forms.id = idc
          if (
            _this.taskParams.islook === 'yes' ||
            _this.taskParams.islook === 'edit' ||
            _this.taskParams.type === 'shenhe' ||
            _this.taskParams.type === 'choucha' ||
            _this.taskParams.type === 'kaohe' ||
            _this.taskParams.type === 'queren'
          ) {
            _this.visForms = { ...data.commonRectify }
            _this.visForms.fileList2 = {}
            let taskFiles = data.commonRectify.taskFiles
            let a =
              taskFiles.length > 0
                ? taskFiles.map((item) => {
                  return {
                    name: item.fileName,
                    url: item.fileUrl
                  }
                })
                : []
            _this.visForms.fileList2.uploadbtnshow = false
            _this.visForms.fileList2.files = a
          }
          if (this.taskParams.islook === 'edit') {
            _this.visForms.fileList2.uploadbtnshow = true
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
      this.$refs.visForms.validate((vals) => {
        if (vals) {
          this.$confirm('任务提交后将不能修改，是否继续提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.btnloading = true
            let params = JSON.stringify(this.visForms)
            params = JSON.parse(params)
            commonrectifyEditFn(params).then((res) => {
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
      this.$refs.visForms.validate((vals) => {
        if (vals) {
          this.$confirm('任务提交后将不能修改，是否继续提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.btnloading = true
            let params = JSON.stringify(this.visForms)
            params = JSON.parse(params)
            params.taskId = this.forms.id
            delete params.fileList2
            commonrectifySubmitFn(params).then((res) => {
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

    fileChangeFn2 (arr) {
      this.visForms.taskFiles = arr
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
      this.DicRectificationArr = this.getDictDataList('rectification_type') // 整改类型
      this.DicProblemDiscoveryArr = this.getDictDataList('problem_discovery') // 发现问题途径
    },
    inittaskParams () {
      this.taskParams = this.$store.state.more.taskParams
      if (this.taskParams.id === '' || this.taskParams.type === '' || this.taskParams.type === undefined) {
        this.gobackonce()
      } else {
        this.forms.id = this.taskParams.id
        this.problemInfo(this.forms.id)
        if (this.taskParams.type === 'chuli') {
          if (this.taskParams.islook === 'yes') {
            this.problemDisabled = true
            this.visForms.fileList2.uploadbtnshow = false
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
          this.problemDisabled = true
          this.visForms.fileList2.uploadbtnshow = false
        } else if (this.taskParams.type === 'choucha') {
          this.checkAndReviewShow = true
          this.shenheboxshow = true
          this.problemDisabled = true
          this.visForms.fileList2.uploadbtnshow = false
        } else if (this.taskParams.type === 'pclook') {
          this.visForms.fileList2.uploadbtnshow = false
          this.problemDisabled = true
          this.checkAndReviewShow = true
          this.pcParams = this.taskParams.pcParams
        } else if (
          this.taskParams.type === 'queren' ||
          this.taskParams.type === 'kaohe'
        ) {
          this.visForms.fileList2.uploadbtnshow = false
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