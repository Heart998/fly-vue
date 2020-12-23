<template>
  <div>
    <div v-if="shenheboxshow">
      <h3 class="form_h3_title">
        <div v-if="!aginScoreShow" class="line_type_shu"></div>
        <div v-if="!aginScoreShow">
          任务考核
        </div>
        <div v-if="aginScoreShow" class="line_type_shu" style="background: red;"></div>
        <div v-if="aginScoreShow">
          历史评分
        </div>
      </h3>
      <div class="selfboxdiv">
      <table cellspacing="0" cellpadding="0" class="self-table">
        <tr style="height:40px">
          <td style="width: 140px;">考核项目</td>
          <td style="width:95px;">是否通过</td>
          <td>扣分原因</td>
          <td style="width: 113px;">扣分分值</td>
        </tr>
        <tr>
          <td>
            1、工作时效性
          </td>
          <td>
            <el-select :disabled="shenhedisabled" :class="{noborder: shenhedisabled}" v-model="shenheForms.sxxPass">
              <el-option v-for="(item, index) in pastornoArr" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
          </td>
          <td>
            <div class="flex-box">
              <el-input type="textarea" style="flex:1;" v-model="shenheForms.sxxReason" :disabled="shenhedisabled" :class="{noborder: shenhedisabled}"></el-input>
            </div>

          </td>
          <td>
            <el-input type="number" v-model="shenheForms.sxxScore" :disabled="shenhedisabled" :class="{noborder: shenhedisabled}">
              <template slot="append">分</template>
            </el-input>
          </td>
        </tr>
        <tr>
          <td>
            2、工作完整性
          </td>
          <td>
            <el-select :disabled="shenhedisabled" :class="{noborder: shenhedisabled}" v-model="shenheForms.wzxPass">
              <el-option v-for="(item, index) in pastornoArr" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
          </td>
          <td>
            <div class="flex-box">
              <el-input type="textarea" style="flex:1;" v-model="shenheForms.wzxReason" :disabled="shenhedisabled" :class="{noborder: shenhedisabled}"></el-input>
            </div>
          </td>
          <td>
            <el-input type="number" v-model="shenheForms.wzxScore" :disabled="shenhedisabled" :class="{noborder: shenhedisabled}"
              @input="shenheForms.wzxScore>100?shenheForms.wzxScore=100 : shenheForms.wzxScore = shenheForms.wzxScore">
              <template slot="append">分</template>
            </el-input>
          </td>
        </tr>
        <tr>
          <td>
            3、工作准确性
          </td>
          <td>
            <el-select :disabled="shenhedisabled" :class="{noborder: shenhedisabled}" v-model="shenheForms.zqxPass">
              <el-option v-for="(item, index) in pastornoArr" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
          </td>
          <td>
            <div class="flex-box">
              <el-input type="textarea" style="flex:1;" v-model="shenheForms.zqxReason" :disabled="shenhedisabled" :class="{noborder: shenhedisabled}"></el-input>
            </div>
          </td>
          <td>
            <el-input v-model="shenheForms.zqxScore" type="number" :disabled="shenhedisabled" :class="{noborder: shenhedisabled}"
              @input="shenheForms.zqxScore>100?shenheForms.zqxScore=100 : shenheForms.zqxScore = shenheForms.zqxScore">
              <template slot="append">分</template>
            </el-input>
          </td>
        </tr>
      </table>
      </div>
      <div class="flex-box justify-between align-center" v-if="shenheboxshow">
        <h5 class="description">
        </h5>
        <div class="flex-box align-center dangwei">
          <span class="fontBlod">{{computedContet}}</span>
          <span>分</span>
        </div>
      </div>
      <el-form label-width="120" v-if="shenheboxshow">
        <el-row>
          <el-col :span="24">
            <el-form-item label="审核意见" class="flex-box children_flex">
              <el-input type="textarea" v-model="shenheForms.reason" :rows="2" :disabled="shenhedisabled" :class="{noborder: shenhedisabled}"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <h3 class="form_h3_title" v-if="aginScoreShow">
        <div class="line_type_shu"></div>任务重新考核
      </h3>
      <div class="selfboxdiv"  v-if="aginScoreShow">
      <table cellspacing="0" cellpadding="0"  class="self-table">
        <tr style="height:40px">
          <td style="width: 140px;">考核项目</td>
          <td style="width:95px;">是否通过</td>
          <td>扣分原因</td>
          <td style="width: 113px;">扣分分值</td>
        </tr>
        <tr>
          <td>
            1、工作时效性
          </td>
          <td>
            <el-select :disabled="chouchaDisabled" :class="{noborder: chouchaDisabled}" v-model="againForms.sxxPass">
              <el-option v-for="(item, index) in pastornoArr" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
          </td>
          <td>
            <div class="flex-box">
              <el-input type="textarea" style="flex:1;" v-model="againForms.sxxReason" :disabled="chouchaDisabled" :class="{noborder: chouchaDisabled}"></el-input>
            </div>

          </td>
          <td>
            <el-input type="number" v-model="againForms.sxxScore" :disabled="chouchaDisabled" :class="{noborder: chouchaDisabled}"
            @input="againForms.sxxScore>100?againForms.sxxScore=100 : againForms.sxxScore = againForms.sxxScore">
              <template slot="append">分</template>
            </el-input>
          </td>
        </tr>
        <tr>
          <td>
            2、工作完整性
          </td>
          <td>
            <el-select :disabled="chouchaDisabled" :class="{noborder: chouchaDisabled}" v-model="againForms.wzxPass">
              <el-option v-for="(item, index) in pastornoArr" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
          </td>
          <td>
            <div class="flex-box">
              <el-input type="textarea" style="flex:1;" v-model="againForms.wzxReason" :disabled="chouchaDisabled" :class="{noborder: chouchaDisabled}"></el-input>
            </div>
          </td>
          <td>
            <el-input type="number" v-model="againForms.wzxScore" :disabled="chouchaDisabled" :class="{noborder: chouchaDisabled}"
              @input="againForms.wzxScore>100?againForms.wzxScore=100 : againForms.wzxScore = againForms.wzxScore">
              <template slot="append">分</template>
            </el-input>
          </td>
        </tr>
        <tr>
          <td>
            3、工作准确性
          </td>
          <td>
            <el-select :disabled="chouchaDisabled" :class="{noborder: chouchaDisabled}" v-model="againForms.zqxPass">
              <el-option v-for="(item, index) in pastornoArr" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
          </td>
          <td>
            <div class="flex-box">
              <el-input type="textarea" style="flex:1;" v-model="againForms.zqxReason" :disabled="chouchaDisabled" :class="{noborder: chouchaDisabled}"></el-input>
            </div>
          </td>
          <td>
            <el-input v-model="againForms.zqxScore" type="number" :disabled="chouchaDisabled" :class="{noborder: chouchaDisabled}"
              @input="againForms.zqxScore>100?againForms.zqxScore=100 : againForms.zqxScore = againForms.zqxScore">
              <template slot="append">分</template>
            </el-input>
          </td>
        </tr>
      </table>
      </div>
      
      <div class="flex-box justify-between align-center" v-if="aginScoreShow">
        <h5 class="description">
        </h5>
        <div class="flex-box align-center dangwei">
          <span class="fontBlod">{{computedContetAgain}}</span>
          <span>分</span>
        </div>
      </div>
      <el-form label-width="120" v-if="aginScoreShow">
        <el-row>
          <el-col :span="24">
            <el-form-item label="审核意见" class="flex-box children_flex">
              <el-input type="textarea" v-model="againForms.reason" :rows="2" :disabled="chouchaDisabled" :class="{noborder: chouchaDisabled}"></el-input>
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>

      <!-- 历史评分弹框 -->
      <el-dialog title="历史评分" width="80%" :visible.sync="dialogVisible" style="margin-left:60px;margin-top:100px">
        <span>没有历史评分</span>
      </el-dialog>
      <el-dialog title="历史评分" width="80%" :visible.sync="dialogVisible" style="margin-left:60px;margin-top:100px">
        <el-form>
        <div class="selfboxdiv">
          <table cellspacing="0" cellpadding="0" class="self-table">
            <tr style="height:40px">
              <td style="width: 140px;">考核项目</td>
              <td style="width:95px;">是否通过</td>
              <td>扣分原因</td>
              <td style="width: 113px;">扣分分值</td>
            </tr>
            <tr>
              <td>
                1、工作时效性
              </td>
              <td>
                <el-select :disabled="shenhedisabled" :class="{noborder: shenhedisabled}" v-model="historyAudit.sxxPass">
                  <el-option v-for="(item, index) in pastornoArr" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
              </td>
              <td>
                <div class="flex-box">
                  <el-input type="textarea" style="flex:1;" v-model="historyAudit.sxxReason" :disabled="shenhedisabled" :class="{noborder: shenhedisabled}"></el-input>
                </div>

              </td>
              <td>
                <el-input type="number" v-model="historyAudit.sxxScore" :disabled="shenhedisabled" :class="{noborder: shenhedisabled}">
                  <template slot="append">分</template>
                </el-input>
              </td>
            </tr>
            <tr>
              <td>
                2、工作完整性
              </td>
              <td>
                <el-select :disabled="shenhedisabled" :class="{noborder: shenhedisabled}" v-model="historyAudit.wzxPass">
                  <el-option v-for="(item, index) in pastornoArr" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
              </td>
              <td>
                <div class="flex-box">
                  <el-input type="textarea" style="flex:1;" v-model="historyAudit.wzxReason" :disabled="shenhedisabled" :class="{noborder: shenhedisabled}"></el-input>
                </div>
              </td>
              <td>
                <el-input type="number" v-model="historyAudit.wzxScore" :disabled="shenhedisabled" :class="{noborder: shenhedisabled}">
                  <template slot="append">分</template>
                </el-input>
              </td>
            </tr>
            <tr>
              <td>
                3、工作准确性
              </td>
              <td>
                <el-select :disabled="shenhedisabled" :class="{noborder: shenhedisabled}" v-model="historyAudit.zqxPass">
                  <el-option v-for="(item, index) in pastornoArr" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
              </td>
              <td>
                <div class="flex-box">
                  <el-input type="textarea" style="flex:1;" v-model="historyAudit.zqxReason" :disabled="shenhedisabled" :class="{noborder: shenhedisabled}"></el-input>
                </div>
              </td>
              <td>
                <el-input v-model="historyAudit.zqxScore" type="number" :disabled="shenhedisabled" :class="{noborder: shenhedisabled}">
                  <template slot="append">分</template>
                </el-input>
              </td>
            </tr>
          </table>
          </div>
          <div class="flex-box justify-between align-center">
            <h5 class="description"></h5>
            <div class="flex-box align-center dangwei">
              <span class="fontBlod">{{historyAudit.score}}</span>
              <span>分</span>
            </div>
          </div>
            <el-row>
              <el-col :span="24">
                <el-form-item label="审核意见" class="flex-box children_flex">
                  <el-input type="textarea" v-model="historyAudit.reason" :rows="2" :disabled="shenhedisabled" :class="{noborder: shenhedisabled}"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
      </el-dialog>


      <div class="fixed-bottm-box" v-if="shenheboxshow && !chouchashow">
        <el-button @click="historyQuery" v-if="history">历史评分</el-button>
        <el-button type="danger" v-if="!shenhedisabled && isAuth('biz:taskaudit:reject')" @click="shneheDialogFn('reject')" :loading="btnloading">驳回</el-button>
        <el-button type="primary" v-if="!shenhedisabled && isAuth('biz:taskaudit:audit')" @click="shneheDialogFn('pass')" :loading="btnloading">提交</el-button>
        <el-button @click="back" :disabled="btnloading" v-if="!shenhedisabled">取消</el-button>
        <el-button @click="back" :disabled="btnloading" v-if="shenhedisabled">返回</el-button>
      </div>
      <div class="fixed-bottm-box" v-if="chouchashow">
        <el-button @click="historyQuery" v-if="history">历史评分</el-button>
        <el-button type="primary" v-if="!aginScoreShow && !chouchaDisabled && isAuth('biz:taskaudit:spot')" @click="aginScoreShow = true">重新评分</el-button>
        <el-button v-if="aginScoreShow && !chouchaDisabled" @click="aginScoreShow = false">取消重新评分</el-button>
        <el-button type="primary" v-if="aginScoreShow && !chouchaDisabled && isAuth('biz:taskaudit:spot')" @click="againSubmit" :loading="btnloading">确认提交</el-button>
        <el-button type="primary" v-if="!aginScoreShow && !chouchaDisabled && isAuth('biz:taskaudit:spot')" @click="toSubmit" :loading="btnloading">确认提交</el-button>
        <el-button @click="back" :disabled="btnloading" v-if="!aginScoreShow && !chouchaDisabled">取消</el-button>
        <el-button @click="back" :disabled="btnloading" v-if="chouchaDisabled">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  taskauditDateMark,
  taskauditAudit,
  getSHForms
} from '@/api/task-review/index.js'
import { taskauditSpot } from '@/api/task-check/index.js'
export default {
  data () {
    return {
      id: '',
      status: '', // 任务状态 
      taskParams: {},
      history:false, //历史评分按钮显示
      dialogVisible: false, //历史评分弹框
      dialogVisible2:false,
      pastornoArr: [
        { label: '是', value: true },
        { label: '否', value: false }
      ],
      btnloading: false,
      shenheForms: {
        taskId: '',
        type: '',
        sxxPass: true,
        sxxReason: '',
        sxxScore: null,
        wzxPass: true,
        wzxReason: '',
        wzxScore: null,
        zqxPass: true,
        zqxReason: '',
        zqxScore: null,
        score: null,
        reason: '',
        cmd: '' // pass/ reject
      },
      againForms: {
        taskId: '',
        type: '',
        sxxPass: true,
        sxxReason: '',
        sxxScore: null,
        wzxPass: true,
        wzxReason: '',
        wzxScore: null,
        zqxPass: true,
        zqxReason: '',
        zqxScore: null,
        score: null,
        reason: ''
      },
      historyAudit: {
        taskId: '',
        type: '',
        sxxPass: true,
        sxxReason: '',
        sxxScore: null,
        wzxPass: true,
        wzxReason: '',
        wzxScore: null,
        zqxPass: true,
        zqxReason: '',
        zqxScore: null,
        score: null,
        reason: '',
        cmd: '' // pass/ reject
      },  //考核打分记录
      shenheboxshow: false,
      shenhedisabled: false,
      chouchashow: false,
      aginScoreShow: false,
      chouchaDisabled: false

    }
  },
  methods: {
    gobackonce () {
      this.$router.go(-1)
    },
    back () {
      if (this.taskParams.type === 'pclook') {
        this.$router.replace({
          name: 'TaskManagementPcList',
          params: {
            lastId: this.taskParams.pcParams.id,
            lastTarget: this.taskParams.pcParams.target,
            code: this.taskParams.pcParams.code
          }
        })
      } else if(this.taskParams.type === 'queren' || this.taskParams.type === 'kaohe'){
        this.$router.go(-1)
      }else {
        let route = this.forms
        switch (this.taskParams.type) {
          case 'chuli':
            route = 'processing'
            break
          case 'shenhe':
            route = 'review'
            break
          case 'choucha':
            route = 'check'
            break
          default:
            route = 'processing'
        }
        this.$router.replace({
          path: `/task-management-task-${route}/index`
        })
      }
    },

    /**
     * 查看进来的：展示评分、历史评分
     * ----------------------------------------------
     */
    taskQuery (taskId) {
      this.btnloading = (this.shenheboxshow || this.chouchashow )
      taskauditDateMark({ taskId }).then((res) => {
        this.btnloading = false
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.shenheForms.sxxScore = data.mark
        }
      })
    },
    /* 审核进来需要通过后台拿时效性分数
    --------------------------------------------- */
    taskaudit (taskId) {
      this.btnloading = (this.shenheboxshow || this.chouchashow )
      taskauditDateMark({ taskId }).then((res) => {
        this.btnloading = false
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.shenheForms.sxxScore = data.mark
        }
      })
    },
    /* 回现任务审核数据
    ------------------------------------------ */
    getSHForms (taskId) {
      getSHForms({ taskId }).then((res) => {
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.shenheForms = { ...data.taskAudit }
          this.historyAudit = { ...data.historyAudit }
          // 存在历史评分
          if(this.historyAudit.score){
            this.history = true
          }
        }
      })
    },
    /* 审核提交
    ----------------------------------------- */
    shneheDialogFn (cmd) {
      this.shenheForms.cmd = cmd
      this.btnloading = true
      let datas = { ...this.shenheForms }
      datas.taskId = this.id
      datas.update = 0
      if (cmd === 'reject') {
         this.$confirm('此操作将永久驳回该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          taskauditAudit(datas).then((res) => {
          let data = res.data
          if (data.code === 0 && data.msg === 'success') {
            this.$message.success('已驳回')
            this.gobackonce()
          }
        })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消驳回'
          });        
          this.btnloading = false  
        });
       
      } else {
        taskauditAudit(datas).then((res) => {
          let data = res.data
          if (data.code === 0 && data.msg === 'success') {
            this.$message.success('审核成功')
            this.gobackonce()
          }
        })
      }
    },
    /**
     * 不修改评分直接提交
     */
    toSubmit () {
      this.btnloading = true
      let datas = { ...this.shenheForms }
      datas.taskId = this.id
      datas.update = 0
      taskauditSpot(datas).then((res) => {
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.$message.success('抽查成功')
          this.gobackonce()
        }
      })
    },
    /** 抽查提交
     * ---------------------------------------
     */
    againSubmit () {
      this.btnloading = true
      let datas = { ...this.againForms }

      datas.taskId = this.id
      datas.update = 1
      taskauditSpot(datas).then((res) => {
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.$message.success('抽查成功')
          this.gobackonce()
        }
      })
    },
    /* 抽查回显
    ---------------------------------------- */
    getCHOUCHAForms (taskId) {
      getSHForms({ taskId }).then((res) => {
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.shenheForms = { ...data.taskAudit }
        }
      })
    },
    /**
     * 历史评分按钮
     * --------------------------------------------
     */
    historyQuery(){
      if(this.historyAudit.score){
        this.dialogVisible = true
      }else{
        this.dialogVisible2 = true
      }
    },
    /**
     * 初始化方法
     */
    inittaskParams () {
      this.taskParams = this.$store.state.more.taskParams

      if (this.taskParams.id === '' && this.taskParams.type === '') {
        this.gobackonce()
      } else {
        this.id = this.taskParams.id
        if (this.taskParams.type === 'shenhe') {
          this.shenheboxshow = true
          this.taskaudit(this.id)
          if (this.taskParams.islook === 'yes') {
            this.shenhedisabled = true
            this.getSHForms(this.id)
          } else {
            this.shenhedisabled = false
          }
        } else if (this.taskParams.type === 'choucha') {
          this.shenhedisabled = true
          this.shenheboxshow = true
          this.chouchashow = true
          this.getCHOUCHAForms(this.id)
          if (this.taskParams.islook === 'yes') {
            this.chouchaDisabled = true
          } else {
            this.chouchaDisabled = false
          }
        } else if (this.taskParams.type === 'pclook') {
          this.shenhedisabled = true
          this.shenheboxshow = true
          this.chouchashow = true
          this.getCHOUCHAForms(this.id)
          this.chouchaDisabled = true
          /**
           * 任务处理查看显示评分
           */
        } else if (this.taskParams.type === 'chuli' && this.taskParams.islook === 'yes'){
            if(this.taskParams.status === 3 || this.taskParams.status === 4){
              this.getSHForms(this.id)  //回显打分数据
              this.shenheboxshow = true
              this.shenhedisabled = true
          }
        } else if (this.taskParams.type === 'queren' || this.taskParams.type === 'kaohe'){
          this.getSHForms(this.taskParams.id)  //回显打分数据
          this.shenheboxshow = true
          this.shenhedisabled = true
      }
      }
    }
  },
  mounted () {
    this.inittaskParams()
  },
  computed: {
    computedContet () {
      let count =
        100 -
        this.shenheForms.sxxScore -
        this.shenheForms.wzxScore -
        this.shenheForms.zqxScore
      if (count < 0) {
        count = 0
      }
      this.shenheForms.score = count
      count = Number(count).toFixed(2);
      return count
    },
    computedContetAgain () {
      let count =
        100 -
        this.againForms.sxxScore -
        this.againForms.wzxScore -
        this.againForms.zqxScore
      if (count < 0) {
        count = 0
      }
      this.againForms.score = count
      count = Number(count).toFixed(2);
      return count
    }
  },
  created () {
    let score = this.computedContetAgain
    if (score == NaN) {
      this.computedContetAgain = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.dangwei {
  margin-right: 22px;
}
.fontBlod {
  font-weight: bold;
  font-size: 20px;
}
</style>