<template>
  <div>
    <h3 class="form_h3_title">
      <div class="line_type_shu"></div>
      基本信息
    </h3>
    <el-form :inline="true" ref="form" :model="forms">
      <el-row>
        <el-form-item label="员工姓名:">
          <el-input v-model="forms.name" disabled class="noborder" placeholder="员工姓名" style="width:240px;"></el-input>
        </el-form-item>
        <el-form-item label="考核周期:">
          <el-input v-model="forms.period" disabled class="noborder" placeholder="考核周期" style="width:240px;"></el-input>
        </el-form-item>
        <el-form-item label="所属公司:">
          <el-input v-model="forms.company" disabled class="noborder" placeholder="所属公司" style="width:240px;"></el-input>
        </el-form-item>
        <el-form-item label="所属部门:">
          <el-input v-model="forms.deptName" disabled class="noborder" placeholder="所属部门" style="width:240px;"></el-input>
        </el-form-item>
        <el-form-item label="所属条线:">
          <el-input v-model="forms.lineName" disabled class="noborder" placeholder="所属条线" style="width:240px;"></el-input>
        </el-form-item>

        <h3 class="form_h3_title">
          <div class="line_type_shu"></div>考核内容
        </h3>
        <el-form-item>
          <div class="selfboxdiv">
            <table cellspacing="0" cellpadding="0" class="self-table">
              <tr style="height:40px">
                <td>考核指标</td>
                <td>占比</td>
                <td>考核类型</td>
                <td style="width:150px;">任务类型</td>
                <td style="min-width:300px">任务描述</td>
                <td style="min-width:300px">完成情况</td>
                <td style="min-width:150px">得分</td>
              </tr>
              <tr style="height:40px" v-for="(item, index) in forms.checkItem" :key="index">
                <td>
                  <el-input disabled class="noborder" v-model="item.name" style="min-width:150px;"></el-input>
                </td>
                <td>
                  <div class="lookdiv" style="width: 45px;text-align:center;" v-if="item.type === 'jiafenxiang' || item.type === 'jianfenxiang'">100 &nbsp;&nbsp;%</div>
                  <el-input type="number" disabled class="noborder" v-model="item.ratio" style="width: 45px" v-else>
                    <template slot="append">%</template>
                  </el-input>
                </td>
                <td>
                  <el-select v-model="item.type" placeholder="请选择" style="width:100px" @change="classifyChange(item.type, index)" disabled class="noborder">
                    <el-option v-for="(item, typeIndex) in assessmentTypeArr" :key="item.typeIndex" :label="item.dictLabel" :value="item.dictValue">
                    </el-option>
                  </el-select>
                </td>
                <td>
                  <el-select v-model="item.classify" placeholder="请选择" style="width:150px" v-if="item.type === 'guding' || item.type === 'linshi'" disabled class="noborder">
                    <el-option v-for="(item, classifyIndex) in taskTypeArr" :key="item.classifyIndex" :label="item.dictLabel" :value="item.dictValue">
                    </el-option>
                  </el-select>
                </td>
                <td>
                  <el-input type="textarea" disabled class="noborder" v-model="item.description" :autosize="{ minRows: 2, maxRows: 4}">
                  </el-input>
                </td>
                <td>
                  <div v-if="item.contents.length > 0">
                    <div v-for="(ite, ind) in item.contents" :key="ite.id">
                      {{ind+1}}、{{ite.name}} {{ite.score}} 分
                      <el-button type="text" @click="lookxiangqing(item.classify,ite.id)">
                        详情
                      </el-button>
                    </div>
                  </div>
                  <div v-else>暂无数据</div>
                </td>
                <td>
                  <el-input type="number" v-model="item.score" style="width: 45px" :disabled="problemDisabled" :class="{noborder: problemDisabled}" @input="filterScore(item.score, index)">
                    <template slot="append">分</template>
                  </el-input>
                </td>
              </tr>
            </table>

          </div>
          <div class="flex-box justify-between align-center">
            <div></div>
            <div class="flex-box align-center dangwei">
              <span class="fontBlod">{{computedConcat}}</span>
              <span>分</span>
            </div>
          </div>
        </el-form-item>

        <h3 class="form_h3_title">
          <div class="line_type_shu"></div>考核意见
        </h3>
        <el-col :span="24">
          <el-form-item class="flex-box children_flex">
            <el-input type="textarea" v-model="forms.checkMsg" :disabled="problemDisabled" :class="{noborder: problemDisabled}" :autosize="{minRows: 2, maxRows: 4}"></el-input>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>

    <div class="fixed-bottm-box">
      <el-button type="primary" @click="onSubmit" :loading="btnloading" v-if="!problemDisabled">提交</el-button>
      <el-button @click="back" :disabled="btnloading">取消</el-button>
      <!--人员确认按钮-->
      <el-button type="primary" @click="userCheck" :loading="btnloading" v-if="isCheck && problemDisabled">确认</el-button>
    </div>

  </div>
</template>

<script>
import {
  getBseInfo,
  userAffirm,
  saveUserCheck
} from '@/api/task-assessment/perssonAssessment'
export default {
  data () {
    return {
      id: '',
      btnloading: false,
      assessmentTypeArr: [
        {
          dictValue: 'guding',
          dictLabel: '固定任务'
        },
        {
          dictValue: 'linshi',
          dictLabel: '临时任务'
        },
        {
          dictValue: 'jiafenxiang',
          dictLabel: '加分项'
        },
        {
          dictValue: 'jianfenxiang',
          dictLabel: '减分项'
        }
      ],
      lxrtypeArr: [],
      llrtypeArr: [],
      taskTypeArr: [],
      forms: {
        checkMsg: '',
        checkItem: []
      },
      assessmentParams: {},
      problemDisabled: false,
      isCheck:false
    }
  },

  methods: {
    filterScore (score, index) {
      if (score < 0 || score > 100) {
        this.forms.checkItem[index].score = ''
        this.$message.warning('分数应该大于0小于100')
      }
    },
    lookxiangqing (classify, id) {
      let row = {
        classify,
        type: this.assessmentParams.type,
        id,
        status: 0,
        islook: 'yes'
      }
      this.taskProcessing(row)
    },
    taskProcessing (row, islook) {
      this.$store.dispatch('setTaskParams', {
        type: row.type,
        id: row.id,
        status: 4,
        islook: 'yes'
      })
      if (row.classify === 'lhg') {
        this.$router.push({
          name: 'ComplianceTraining'
        })
      } else if (row.classify === 'lfx') {
        this.$router.push({
          name: 'RiskInvestigation'
        })
      } else if (row.classify === 'ldd') {
        this.$router.push({
          name: 'SupervisionAndInspection'
        })
      } else if (row.classify === 'lwt') {
        this.$router.push({
          name: 'ProblemClueSubmission'
        })
      } else if (row.classify === 'lbg') {
        this.$router.push({
          name: 'ReportReportSubmission'
        })
      } else if (row.classify === 'lcy') {
        this.$router.push({
          name: 'ParticipateInInspectionItems'
        })
      } else if (row.classify === '1') {
        this.$router.push({
          name: 'ProblemRectification'
        })
      } else if (row.classify === 'ccx') {
        this.$router.push({
          name: 'IntegrityAndComplianceEducation'
        })
      } else if (row.classify === 'cfx') {
        this.$router.push({
          name: 'LlyRiskInvestigation'
        })
      } else if (row.classify === 'czc') {
        this.$router.push({
          name: 'WorkplaceInspection'
        })
      } else if (row.classify === 'cry') {
        this.$router.push({
          name: 'PersonnelInterview'
        })
      } else if (row.classify === 'cwt') {
        this.$router.push({
          name: 'LlyProblemClueSubmission'
        })
      } else if (row.classify === 'prs') {
        if (row.target === '1') {
          this.$router.push({
            name: 'ProblemRectification'
          })
        } else {
          this.$router.push({
            name: 'LlyProblemRectification'
          })
        }
      }
    },
    getBseInfo (id) {
      getBseInfo({ id }).then((res) => {
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.forms = { ...data.userCheck }
          if(data.userCheck.status === 2){
            this.isCheck = true
          }else{
            this.isCheck = false
          }
        }
      })
    },
    classifyChange (type, index) {
      if (type === 'jiafenxiang') {
        this.forms.tableData[index].name = '加分项'
      } else if (type === 'jianfenxiang') {
        this.forms.tableData[index].name = '减分项'
      }
    },
    onSubmit () {
      let cheit = this.forms.checkItem
      let data = {
        id: this.assessmentParams.id,
        checkScore: this.computedConcat,
        checkMsg: this.forms.checkMsg,
        checkItemList: []
      }
      if (
        cheit.every((item) => {
          return item.score !== '' && item.score !== null && item.score >= 0
        })
      ) {
        cheit.forEach((items) => {
          data.checkItemList.push({
            id: items.id,
            score: items.score
          })
        })
        this.btnloading = true
        saveUserCheck(data).then((res) => {
          let dats = res.data
          this.btnloading = false
          if (dats.code === 0 && dats.msg === 'success') {
            this.$message.success('考核成功')
            this.$router.replace({
              path: '/task-assessment-persson-assessment/index'
            })
          }
        })
      } else {
        let ar = []
        cheit.forEach((items) => {
          if (items.score === null || items.score === '') {
            ar.push(items.name)
          }
        })
        ar = ar.join()
        this.$message.warning(`考核指标${ar}未打分`)
      }
    },
    back () {
      let a = 1
      if (a === 1) {
        a = 2
        this.$router.go(-1)
      } else {
        setTimeout(() => {
          a = 1
        }, 2000)
      }
    },
    initAssessmentParams () {
      this.assessmentParams = this.$store.state.more.assessmentParams
      if (
        this.assessmentParams.id !== undefined &&
        this.assessmentParams.id !== ''
      ) {
        this.id = this.assessmentParams.id
        this.getBseInfo(this.assessmentParams.id)
        if (this.$route.params.types === 1) {
          this.taskTypeArr = this.getDictDataList('linkman_task')
        } else {
          this.taskTypeArr = this.getDictDataList('contact-task')
        }
        // let lxrarr = this.getDictDataList('linkman_task')
        // let llyarr = this.getDictDataList('contact-task')
        // this.taskTypeArr = lxrarr.concat(llyarr)
        // console.log(this.taskTypeArr)
        if (this.assessmentParams.islook === 'yes') {
          this.problemDisabled = true
        } else {
          this.problemDisabled = false
        }
      } else {
        this.$router.replace({
          path: '/task-assessment-assessment-confirmation/index'
        })
      }
    },
    userCheck() {
      let id = this.id
      this.$confirm('即将确认成绩, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          userAffirm({ id }).then((res) => {
            let data = res.data
            if (data.code === 0 && data.msg === 'success') {
              this.$message({
                type: 'success',
                message: '确认成功!',
              })
              this.initAssessmentParams()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消确认',
          })
        })
    },
  },
  created () {
    this.initAssessmentParams()
  },
  computed: {
    computedConcat () {
      let cont = 0
      if (this.forms.checkItem.length > 0) {
        let arrc = []
        let checkitem = this.forms.checkItem.forEach((item) => {
          if (item.type === 'jiafenxiang') {
            arrc.push(Number(item.score))
          } else if (item.type === 'jianfenxiang') {
            arrc.push(item.score * -1)
          } else {
            arrc.push((item.score * item.ratio) / 100)
          }
        })
        for (let i = 0; i < arrc.length; i++) {
          cont = arrc[i] + Number(cont)
        }
      }
      if(isNaN(cont)){
        return ''
      }else{
        let realVal = parseFloat(cont).toFixed(2)
        return realVal
      }
    }
  }
}
</script>
<style>
</style>