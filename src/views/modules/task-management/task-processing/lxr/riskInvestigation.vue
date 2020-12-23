<template>
  <div>
    <!-- 风险排除 -->
    <task-base-info v-bind="forms" @getBaseInfoHxData="getBaseInfoHxData" />
    <el-form :model="forms" :inline="true" label-width="180px" class="problemDisabled" ref="forms">
      <el-row>
        <h3 class="form_h3_title">
          <div class="line_type_shu"></div>任务信息
        </h3>
        <el-form-item label="培训课件数量:" prop="pxNum">

          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="forms.pxNum" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="产说会课件数量:" prop="cshNum">

          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="forms.cshNum" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="宣传资料数量:" prop="xcNum">

          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="forms.xcNum" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item type="number" label="投诉件数量:" prop="tsNum">

          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="forms.tsNum" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="企划方案数量:" prop="qhNum">

          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="forms.qhNum" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="保单数量:" prop="bdNum">

          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="forms.bdNum" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="短信数量:" prop="dxNum">

          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="forms.dxNum" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="微信数量:" prop="wxNum">

          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="forms.wxNum" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="朋友圈数量:" prop="pyqNum">

          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="forms.pyqNum" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="重点销售人员数量:" prop="zdxsNum">

          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="forms.zdxsNum" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="非重点销售人员数量:" prop="fzdxsNum">

          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="forms.fzdxsNum" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="财务凭证数量:" prop="cwpzNum">

          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="forms.cwpzNum" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="中介机构协议数量:" prop="zjxyNum">

          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="forms.zjxyNum" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="中介机构网点数量:" prop="zjwdNum">

          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="forms.zjwdNum" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="第三方网络平台数量:" prop="wrNum">

          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="forms.wrNum" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="单证数量:" prop="dzNum">

          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="forms.dzNum" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="印章数量:" prop="yzNum">

          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="forms.yzNum" style="width:240px"></el-input>
        </el-form-item>
        <el-col :span="24">
          <el-form-item label="回访录音:" prop="dzNum">

          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="forms.hfName" style="width:240px"></el-input>
        </el-form-item>
          <!-- <el-form-item label="回访录音:" prop="fileList1" style="line-height:auto">
           
            <uploadRecording v-bind="forms.fileList1" @changeFileList="fileChangeFn1" />
          </el-form-item> -->
        </el-col>
        <el-col :span="24">
          <el-form-item label="上传附件:" style="line-height:auto">
            <upload v-bind="forms.fileList2" @changeFileList="fileChangeFn2" />
          </el-form-item>
        </el-col>
        <el-form-item label="其他:" class=" children_flex" prop="other">
          <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="textarea" v-model="forms.other" style="width:240px"></el-input>
        </el-form-item>
        <div class="clear"></div>
        <h3 class="form_h3_title">
          <div class="line_type_shu"></div>排查发现问题明细
        </h3>
        <xtable v-bind="table" v-loading="table.loading" />
      </el-row>
    </el-form>

    <el-dialog title="问题" :visible.sync="dialogVisible" append-to-body width="1300px">
      <el-form :model="visibleForm" :inline="true" label-width="160px" ref="visibleForm" :rules="problemRule" class="problemDisabled">
        <el-row>
          <el-form-item label="问题发生击机构:" prop="problemDeptName">

            <el-input :class="{noborder: problemDisabled}" v-model="visibleForm.problemDeptName" style="width:240px" disabled></el-input>
          </el-form-item>

          <el-form-item label="负面清单代码:" prop="problemCode">
            <el-input :class="{noborder: problemDisabled}" disabled v-model="visibleForm.problemCode" style="width:180px">
            </el-input>
              <el-button @click="openCodeTable" v-if="lookChoose">选择</el-button>
          </el-form-item>
          <el-form-item label="类型1:">
            <el-select :class="{noborder: problemDisabled}" v-model="visibleForm.category1" style="width:240px" disabled placeholder="">
              <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型2:">
            <el-select :class="{noborder: problemDisabled}" v-model="visibleForm.category2" style="width:240px" disabled placeholder="">
              <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型3:" disabled>
            <el-select :class="{noborder: problemDisabled}" v-model="visibleForm.category3" style="width:240px" disabled placeholder="">
              <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型4:">
            <el-select :class="{noborder: problemDisabled}" v-model="visibleForm.category4" style="width:240px;" disabled placeholder="">
              <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="风险等级:">
            <el-select :class="{noborder: problemDisabled}" v-model="visibleForm.riskLevel" style="width:240px;" disabled  placeholder="">
              <el-option v-for="item in DicRiskClassArr" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" placeholder="">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题主责条线:">
            <el-select :class="{noborder: problemDisabled}" disabled v-model="visibleForm.mainLines" multiple style="width:240px;" placeholder="">
              <el-option v-for="item in DicLineArr" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <!-- <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="visibleForm.mainLine" style="width:240px"></el-input> -->
          </el-form-item>
          <el-form-item label="问题主责岗位:">
            <el-select :class="{noborder: problemDisabled}" disabled v-model="visibleForm.mainPosts" multiple style="width:240px;" placeholder="">
              <el-option v-for="item in DicLineArr" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <!-- <el-input :class="{noborder: problemDisabled}" disabled v-model="visibleForm.mainPosts" style="width:240px"></el-input> -->
          </el-form-item>
          <el-form-item label="问题涉及条线:" prop="lines">
            <el-select :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="visibleForm.lines" multiple style="width:240px;">
              <el-option v-for="item in DicLineArr" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题涉及层级:" prop="levels">
            <el-select :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="visibleForm.levels" multiple style="width:240px;">
              <el-option v-for="item in LevelArr" :key="item.id" :label="item.label" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="涉及金额:" prop="coverMoney">

            <el-input :class="{noborder: problemDisabled}" type="number" :disabled="problemDisabled" v-model="visibleForm.coverMoney" style="width:240px">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>

          <el-form-item label="问题主责人员:" prop="mainUser">

            <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="visibleForm.mainUser" style="width:240px"></el-input>
          </el-form-item>
          <el-form-item label="涉及件次:" prop="coverNum">

            <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="number" v-model="visibleForm.coverNum" style="width:240px">
              <template slot="append">次</template>
            </el-input>
          </el-form-item>
          <el-form-item label="损失金额:" prop="lossMoney">

            <el-input :class="{noborder: problemDisabled}" type="number" :disabled="problemDisabled" v-model="visibleForm.lossMoney" style="width:240px">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="问题发生的时间:" prop="problemDateTime">
            <!-- <el-date-picker :class="{noborder: problemDisabled}" :picker-options="pickerOptions" v-model="visibleForm.problemDateTime" :disabled="problemDisabled" value-format="yyyy-MM-dd" type="date"
              style="width:240px" placeholder="选择日期">
            </el-date-picker> -->
            <el-select :class="{noborder: problemDisabled}" v-model="visibleForm.problemDateTime" multiple :picker-options="pickerOptions" :disabled="problemDisabled" style="width:240px;">
              <el-option v-for="item in DicTimeClassArr" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发现问题时间:" prop="foundTime">
            <el-date-picker :class="{noborder: problemDisabled}" :picker-options="pickerOptions" :disabled="problemDisabled" v-model="visibleForm.foundTime" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期" style="width:240px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发现问题途径:" prop="foundWay">
            <el-select :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="visibleForm.foundWay" style="width:240px;">
              <el-option v-for="item in DicProblemDiscoveryArr" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>

          <el-col :span="8">
            <el-form-item label="涉及部门,岗位,人员:" class="flex-box children_flex">

              <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="textarea" v-model="visibleForm.others" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="具体问题描述:" class="flex-box children_flex">

              <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="textarea" v-model="visibleForm.description" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注:" class="flex-box children_flex">

              <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="textarea" v-model="visibleForm.remark" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="diaologSubmit" v-if="!problemDisabled">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="清单代码" :visible.sync="dialogVisibleApply" width="70%">
      <el-form :model="classifyForm" ref="classifyForm" :inline="true" >
          <el-form-item label="清单分类:">
 
            <el-popover v-model="classifyFormVisible" :class="{noborder: problemDisabled}" :disabled="problemDisabled" ref="companyListPopover" placement="bottom-start" trigger="click">
              <el-tree class="company-listtree" :data="classifyList" :props="{ label: 'name', children: 'children' }" node-key="id" ref="companyListTree" :highlight-current="true"
                :expand-on-click-node="false" accordion @current-change="classifyListTreeCurrentChangeHandle">
              </el-tree>
            </el-popover>

            <el-input v-model="classifyName" :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-popover:companyListPopover :readonly="true" placeholder="选择清单分类" clearable
              style="width:240px"></el-input>

               <!-- <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="input" v-model="visibleForm.remark"></el-input> -->
          </el-form-item>
          <el-form-item label="清单名称:">
               <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="input" v-model="classifyForm.name"></el-input>
          </el-form-item>
          <el-form-item label="清单代码:">
               <el-input :class="{noborder: problemDisabled}" :disabled="problemDisabled" type="input" v-model="classifyForm.code"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getClassify(1)">查询</el-button>
            <el-button @click="resClassifyList">重置</el-button>
          </el-form-item>
      </el-form>
      <xtable v-bind="tableApply"
      v-loading="table.loading"
      @handleSizeChange="handleSizeChange2"
      @handleSelectionChange="handleSelectionChange2"
      @handleCurrentChange="handleCurrentChange2"
      />
      
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogOk()">确认</el-button>
          <el-button @click="dialogVisibleApply =false">关闭</el-button>
        </span>
    </el-dialog>
    <div style="display:flex;justify-content: flex-end;">
       <div style="margin-top:40px;margin-right:10px">
       <el-button type="primary" @click="onStaing" v-if="taskParams.type === 'chuli' && !problemDisabled ">暂存</el-button>
    </div>
      <div>
      <footterButton @onSubmit="onSubmit" ref="footerbutton" v-if="this.editNum == 0"/>
      <footterButton @onSubmit="onEdit" ref="footerbutton" v-if="this.editNum == 1" />
    </div>
    </div>
    <checkAndReview v-if="checkAndReviewShow" />

  </div>
</template>
<script>
import xtable from '@/components/xtable/xtable'
import checkAndReview from '@/views/modules/task-management/task-common/footterCheckReview'
import upload from '@/components/el-upload/el-upload'
import uploadRecording from '@/components/el-upload/el-uploadRecording'
import LevelArr from '@/mixins/level-arr'
import footterButton from '@/views/modules/task-management/task-common/footterButtonBox'
import { getTX } from '@/api/common/index.js'
import {
  riskInvestigationSubmitFn,
  riskInvestigationEditFn,
  riskInvestigationStaing,
  getFormsHx,
  getFMQDDM,
  getCheckCorpInfo,
  getFMQDDMCODE
} from '@/api/task-processing/index.js'
import taskBaseInfo from '@/views/modules/task-management/task-common/taskBaseInfo'
export default {
  mixins: [LevelArr],
  components: {
    xtable,
    taskBaseInfo,
    upload,
    checkAndReview,
    footterButton,
    uploadRecording
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      staging: 0, // 1 为暂存修改，0 为暂存
      editNum: '0',
      pcParams: {},
      id: '',
      checkAndReviewShow: false,
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
      pastornoArr: [
        { label: '是', value: true },
        { label: '否', value: false }
      ],
      shenheboxshow: false,
      shenhedisabled: false,
      chouchashow: false,
      aginScoreShow: false,
      chouchaDisabled: false,
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
      classifyFormVisible: false,
      classifyList: [],
      classifyForm: {
        id : '',
        name : '',
        code: ''
      },
      dialogVisibleApply: false,
      classifyName : '',
      lookChoose: true,
      forms: {
        id: '',
        istaskid:'',
        project: '',
        pxNum: null,
        cshNum: null,
        xcNum: null,
        tsNum: null,
        qhNum: null,
        bdNum: null,
        dxNum: null,
        wxNum: null,
        pyqNum: null,
        zdxsNum: null,
        fzdxsNum: null,
        cwpzNum: null,
        zjxyNum: null,
        zjwdNum: null,
        wrNum: null,
        dzNum: null,
        yzNum: null,
        hfName: null,
        hfUrl: '',
        taskId:'',
        other: '',
        commonProblem: [],
        taskFiles: [],
        corpId: '',
        fileList1: {
          files: [],
          uploadbtnshow: true,
          limit: 1
        },
        fileList2: {
          files: [],
          uploadbtnshow: true
        }
      },

      problemDept: '',
      corpInfo: {},
      visibleForm: {
        problemDeptName: ''
      },
      dataRule: {
        pxNum: [
          { required: true, message: '培训课件数量不能为空', trigger: 'blur' }
        ],
        cshNum: [
          {
            required: true,
            message: '产说会课件数量不能为空',
            trigger: 'blur'
          }
        ],
        xcNum: [
          {
            required: true,
            message: '宣传资料课件数量不能为空',
            trigger: 'blur'
          }
        ],
        tsNum: [
          { required: true, message: '投诉件数量不能为空', trigger: 'blur' }
        ],
        qhNum: [
          { required: true, message: '企划方案数量不能为空', trigger: 'blur' }
        ],
        bdNum: [
          { required: true, message: '保单数量不能为空', trigger: 'blur' }
        ],
        dxNum: [
          { required: true, message: '短信数量不能为空', trigger: 'blur' }
        ],
        wxNum: [
          { required: true, message: '微信数量不能为空', trigger: 'blur' }
        ],
        pyqNum: [
          { required: true, message: '朋友圈数量不能为空', trigger: 'blur' }
        ],
        hfName:[
          { required: true, message: '回访录音数量不能为空', trigger: 'blur' }
        ],
        zdxsNum: [
          {
            required: true,
            message: '重点销售人员数量不能为空',
            trigger: 'blur'
          }
        ],
        fzdxsNum: [
          {
            required: true,
            message: '非重点销售人员数量不能为空',
            trigger: 'blur'
          }
        ],
        cwpzNum: [
          { required: true, message: '财务凭证数量不能为空', trigger: 'blur' }
        ],
        zjxyNum: [
          { required: true, message: '中介机构协议不能为空', trigger: 'blur' }
        ],
        wrNum: [
          {
            required: true,
            message: '第三方网络平台不能为空',
            trigger: 'blur'
          }
        ],
        dzNum: [
          { required: true, message: '单证数量不能为空', trigger: 'blur' }
        ],
        yzNum: [
          { required: true, message: '印章数量不能为空', trigger: 'blur' }
        ],
        other: [
          { required: true, message: '回访录音数量不能为空', trigger: 'blur' }
        ]
      },
      problemRule: {
        problemDateTime: [
          {
            required: true,
            message: '问题发生的时间不能为空',
            trigger: 'blur'
          }
        ],
        problemDeptName: [{ required: true, message: '机构不能为空', trigger: 'blur' }],
        problemCode: [
          { required: true, message: '负面清单代码不能为空', trigger: 'blur' }
        ],
        levels: [
          { required: true, message: '问题涉及层级不能为空', trigger: 'blur' }
        ],
        lines: [
          { required: true, message: '问题涉及条线不能为空', trigger: 'blur' }
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
        
        mainUser: [
          { required: true, message: '问题主责人员不能为空', trigger: 'blur' }
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
            label: '问题发生机构',
            name: 'problemDeptName',
            width: 100
          },
          {
            label: '问题发生时间',
            name: 'problemDateTime',
            width: 110,
            formatter: (row) => {
              let str = ''
              if (row.problemDateTime.length > 0) {
                str = row.problemDateTime.join(';')
              }
              return str
            }
          },
          {
            label: '负面清单代码',
            name: 'problemCode',
            width: 100
          },
          {
            label: '风险等级',
            name: 'riskLevel',
            width: 100,
            formatter: (row) => {
              let a = ''
              switch (row.riskLevel) {
                case '1':
                  a = '高'
                  break
                case '2':
                  a = '中'
                  break
                case '3':
                  a = '低'
                  break
              }
              return a
            }
          },
          {
            label: '涉及金额',
            name: 'coverMoney',
            width: 100
          },
          {
            label: '损失金额',
            name: 'lossMoney',
            width: 100
          },
          {
            label: '涉及件次',
            name: 'coverNum',
            width: 100
          },
          {
            label: '发现问题时间',
            name: 'foundTime',
            width: 100
          },
          {
            label: '发现问题途径',
            name: 'foundWay',
            width: 100,
            formatter: (row) => {
              let a = ''
              this.DicProblemDiscoveryArr.find((item) => {
                if (row.foundWay === item.dictValue) { // 筛选出匹配数据
                  a = item.dictLabel
                }
              })
              return a
            }
          },
          {
            label: '问题主责条线',
            name: 'mainLines',
            width: 100,
            formatter: (row) => {
              let a = ''
              let arr = []
              this.DicLineArr.find((item) => {
                for (let i = 0; i < row.mainLines.length; i++) {
                  if (row.mainLines[i] === item.id) {
                    console.log(item)
                    a = item.name
                    arr.push(a)
                  }
                }
              })
              a = arr.join(';')
              return a
            }
          },
          {
            label: '问题主责岗位',
            name: 'mainPosts',
            width: 100,
            formatter: (row) => {
              let str = ''
              if (row.mainPosts.length > 0) {
                str = row.mainPosts.join(';')
              }
              return str
            }
          },
          {
            label: '问题主责人员',
            name: 'mainUser',
            width: 100
          },
          {
            label: '涉及其他部门',
            name: 'others',
            width: 100
          },
          {
            label: '问题描述',
            name: 'description',
            width: 100
          },
          {
            label: '备注',
            name: 'remark',
            width: 100
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
      //负面清单列表
        tableApply: {
          loading: false,
          list: [],
          isMultiple: true,
          typeIndex: true,
          title: {
            show: true,
            align: 'left',
            label: '',
            list: []
            },
          tableHeader: [
          {
            label: "负面清单名称",
            name: "name",
            width: 40,
          },
          {
            label: "负面清单代码",
            name: "code",
            width: 60,
          }],
          total: 1,
          listQuery: {
          page: 1,
          pageSize: 10,
          },
          multipleSelection: ''
        }
    }
  },

  methods: {
    //选中清单代码
    dialogOk(){
      var code = this.tableApply.multipleSelection
      if(code !== ""){
        this.fmqdChange(code)
        this.dialogVisibleApply =false
      }else{
        this.$message.warning('请选择清单代码')
      }
    },

    //清单代码列表
    getClassify(page){
      if (page) {
        this.tableApply.listQuery.page = page
      }
      return this.$http({
        url: this.$http.adornUrl('/biz/commonproblemclassify/queryByConditions'),
        method: 'get',
        params : {
          limit: this.tableApply.listQuery.pageSize,
          page: this.tableApply.listQuery.page,
          id: this.classifyForm.id,
          name: this.classifyForm.name,
          code: this.classifyForm.code
        }
      })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.tableApply.list = res.page.list
          this.tableApply.total = res.page.totalCount
        })
        .catch(() => { })
    },
    //加载清单分类
    loadingClassify(){
      return this.$http({
        url: this.$http.adornUrl('/biz/commonproblemclassify/classifyList'),
        method: 'get'
      })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.classifyList = res.data
        })
        .catch(() => { })
    },

    //打开负面清单弹框
    openCodeTable(){
      this.dialogVisibleApply = true
      this.tableApply.list = []
      this.classifyName = ''
      this.classifyForm.name = ''
      this.classifyForm.code = ''
      this.classifyForm.id = ''
      this.tableApply.multipleSelection = ''
      this.loadingClassify()
      this.getClassify(1)
    },

    //负面清单分类数据
    classifyListTreeCurrentChangeHandle(date){

      this.classifyName = date.name
      this.classifyForm.id = date.id
      this.classifyFormVisible = false
    },

    //重置清单代码表单
    resClassifyList(){
      this.classifyForm.id = '',
      this.classifyForm.name = '',
      this.classifyName = '',
      this.classifyForm.code = ''
    },
    handleSizeChange2(val) {
      this.tableApply.listQuery.pageSize = val;
      this.getClassify(1);
    },
    // 每次多选框勾选或取消时触发
    handleSelectionChange2(val) {
      if(val && val.length > 0){
        this.tableApply.multipleSelection = val[0].code;
      }
    },
	  handleCurrentChange2(val) {
      this.tableApply.listQuery.page = val;
      this.getClassify();
    },

    diaologSubmit() {
      let that = this
      that.$refs.visibleForm.validate((vals) => {
        if (vals) {
          if (that.subandedit === 'add') {
            that.indexTypeId += 1
            that.visibleForm.categoryArr = that.categoryArr
            let objs = JSON.stringify(that.visibleForm)
            let obj = JSON.parse(objs)
            obj.indexTypeId = that.indexTypeId
            obj.options = that.options
            that.table.list.push(obj)
          } else if (that.subandedit === 'edit') {
            that.visibleForm.categoryArr = that.categoryArr
            let editobjs = JSON.stringify(that.visibleForm)
            let editobj = JSON.parse(editobjs)
            editobj.indexTypeId = that.indexTypeId
            editobj.options = that.options
            let indd = null
            for (let i = 0; i < that.table.list.length; i++) {
              if (that.indexTypeId === that.table.list[i].indexTypeId) {
                indd = i
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
    watchTableListChange() {
      if(this.table.list){
        this.table.list = this.table.list.filter((item) => {
          if (item.indexTypeId === undefined) {
            item.indexTypeId = item.id
          }
          return item
        })
      }
    },
    resForm() {
      this.visibleForm = {
        id: 0,
        problemDeptName: '',
        problemDept: '',
        problemDateTime: '',
        problemCode: '',
        category1: '',
        category2: '',
        category3: '',
        category4: '',
        riskLevel: '',
        coverMoney: '',
        lossMoney: '',
        coverNum: '',
        foundTime: '',
        foundWay: '',
        mainLine: '',
        mainPost: '',
        mainUser: '',
        others: '',
        description: '',
        remark: ''
      }
      this.categoryArr = []
      this.options = []
      try {
        this.$refs.visibleForm.resetFields()
      } catch (error) {
        console.log(error)
      }
    },
    getBaseInfoHxData(row) {
      console.log(row.creator)
      this.forms.project = row.name
    },
    editFn(row) {
      this.lookChoose = true
      this.dialogVisible = true
      this.resForm()
      this.subandedit = 'edit'
      this.visibleForm = { ...row }
      this.categoryArr = row.categoryArr
      this.indexTypeId = row.indexTypeId
      this.options = row.options
     
    },
    lookFn(row) {
      this.lookChoose = false
      this.resForm()
      this.subandedit = 'look'
      this.visibleForm = { ...row }
      this.dialogVisible = true
      this.fmqdChange(row.problemCode)
    },
    del(row) {
      let indd = null
      for (let i = 0; i < this.table.list.length; i++) {
        if (row.indexTypeId === this.table.list[i].indexTypeId) {
          indd = i
        }
      }
      this.table.list.splice(indd, 1)
    },
    addProblem() {
      this.resForm()
      this.dialogVisible = true
      this.subandedit = 'add'
      this.options = []
      this.visibleForm.problemDept = this.corpInfo.problemDept
      this.visibleForm.problemDeptName = this.corpInfo.problemDeptName
    },
    getCheckCorpInfo() {
      getCheckCorpInfo({ id: this.forms.id }).then((res) => {
        if (res.data.code === 0 && res.data.msg === 'success') {
          this.corpInfo.problemDept = res.data.dept.id
          this.corpInfo.problemDeptName = res.data.dept.name
        }
      })
    },
    fmqdChange(val) {
      this.visibleForm.problemCode = val
      getFMQDDMCODE({ code: val }).then((res) => {
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.categoryArr = data.classifyVos
          this.categoryobj = data.classifyVo
          this.visibleForm.category1 = this.categoryArr[0].code
          this.visibleForm.category2 = this.categoryArr[1].code
          this.visibleForm.category3 = this.categoryArr[2].code
          this.visibleForm.category4 = this.categoryArr[3].code
          this.visibleForm.riskLevel = this.categoryobj.riskLevel
          this.visibleForm.mainLines = this.categoryobj.lines
          this.visibleForm.mainPosts = this.categoryobj.posts
        }
      })
    },
    getFormsHx(id) {
      let _this = this
      getFormsHx({ id }).then((res) => {
        let data = res.data
        //如果查询有数据
        if (data.code === 0 && data.msg === 'success') {
          if(data.business != null){
          if(data.business.id != null){
          _this.forms.id = data.business.id
          _this.forms = { ...data.business }
          // if(_this.forms.hfName == '' || _this.forms.hfUrl == ''){
              
              
          // }
          _this.table.list = data.problem === null ? [] : data.problem
          _this.forms.commonProblem = data.problem
          _this.watchTableListChange()
          let taskFiles = data.taskFiles
          this.forms.taskFiles =
            data.taskFiles !== null && data.taskFiles.length && data.taskFiles.length >= 1
              ? data.taskFiles.map((item) => {
                return {
                  fileName: item.fileName,
                  fileUrl: item.fileUrl
                }
              })
              : []
          _this.forms.fileList1 = {}
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
              let {hfName,hfUrl} = data.business
              if (hfName !== '' && hfUrl !== '') {
                _this.forms.fileList1.files = [
            { name: hfName, url: hfUrl }
          ]
              } else {
                _this.forms.fileList1.files = []
              }
          
          if (
            _this.taskParams.islook === 'yes' ||
            _this.taskParams.type === 'shenhe' ||
            _this.taskParams.type === 'choucha' ||
            _this.taskParams.type === 'kaohe' ||
            _this.taskParams.type === 'queren'
          ) {
            _this.forms.fileList1.uploadbtnshow = false
            _this.forms.fileList2.uploadbtnshow = false
          }
          
          }
          if( _this.taskParams.islook === 'staging'){
            //执行暂存操作
            this.staging = 0
          }
          }
        }
      })
    },
    remoteMethod(name) {
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
      // ---------------------------------------------------------------------- 暂存操作
    onStaing() {
      console.log("2222")
      this.$refs.forms.validate((vals) => {
        if (vals) {
          this.$confirm('是否暂存数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.btnloading = true
              let params = JSON.stringify(this.forms)
              params = JSON.parse(params)
              let arr = this.table.list.slice()
              let commonProblem = arr.map((item) => {
                let ite = item
                delete ite.options
                delete ite.indexTypeId
                return ite
              })
              params.commonProblem = commonProblem
              params.taskId = params.taskId
                  riskInvestigationStaing(params).then((res) => {
                  var data = res.data
                  this.btnloading = false
                  if (data.code === 0 && data.msg === 'success') {
                    this.$message.success('暂存成功')
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

    // ---------------------------------------------------------------------- 任务修改
    onEdit() {
      this.$refs.forms.validate((vals) => {
        if (vals) {
          this.$confirm('任务提交后将不能修改，是否继续提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
  
            this.btnloading = true
           
            let params = JSON.stringify(this.forms)
            params = JSON.parse(params)
            let arr = this.table.list.slice()
            console.log(this.forms.commonProblem)
            let commonProblem = arr.map((item) => {
              let ite = item
             
              return ite
            })
            params.commonProblem = commonProblem
            //   params.taskId = params.id
            riskInvestigationEditFn(params).then((res) => {
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
    /**
     * -------------------------------------------处理提交
     */
    onSubmit() {
      this.$refs.forms.validate((vals) => {
        if (vals) {
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
              let commonProblem = arr.map((item) => {
                let ite = item
                delete ite.options
                delete ite.indexTypeId
                return ite
              })
              params.commonProblem = commonProblem
              params.taskId = params.taskId
              // delete params.id
              riskInvestigationSubmitFn(params).then((res) => {
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
    fileChangeFn1(arr) {
 
      
       if (arr.length <= 0) {
         this.forms.hfUrl = ''
         this.forms.hfName = ''
        this.forms.fileList1.files = []
        
      } else {
        this.forms.hfUrl = arr[0].fileUrl
        this.forms.hfName = arr[0].fileName
      }
      // this.forms.hfName = arr[0].fileName
      // this.forms.hfUrl = arr[0].fileUrl

  
    },


    fileChangeFn2(arr) {
      this.forms.taskFiles = arr
    },
    gobackonce() {
      this.$router.go(-1)
    },
    getDic() {
      getTX().then((res) => {
        if (res.data.code === 0 && res.data.msg === 'success') {
          this.DicLineArr = res.data.list
        }
      }) // 条线字典

      //   this.DicPostTypeeArr = this.getDictDataList('post_typee') // 岗位

      this.DicLineClassArr = this.getDictDataList('line') // 主责条线
      this.DicTimeClassArr = this.getDictDataList('time_annual') // 年度时间
      this.DicRiskClassArr = this.getDictDataList('risk_class') // 风险等级
      this.DicProblemDiscoveryArr = this.getDictDataList('problem_discovery') // 发现问题途径
    },

    inittaskParams() {
      this.taskParams = this.$store.state.more.taskParams
      if (this.taskParams.id === '' && this.taskParams.type === '') {
        this.gobackonce()
      } else {
        this.forms.taskId = this.taskParams.id
        this.forms.id = this.id = this.taskParams.id
        if (this.taskParams.type === 'chuli') {
          if (this.taskParams.islook === 'yes') {
            this.problemDisabled = true
            this.table.title.show = false
            this.getFormsHx(this.forms.id)
            this.forms.fileList1.uploadbtnshow = false
            this.forms.fileList2.uploadbtnshow = false
            this.table.title.list[0].show = false
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
          }
          else if(this.taskParams.islook === 'staging'){
             this.problemDisabled = false
             this.getFormsHx(this.forms.id)
          }
          else {
            this.problemDisabled = false
            this.table.title.show = true
          }
        } else if (this.taskParams.type === 'shenhe') {
          this.table.title.list[0].show = false
          this.getFormsHx(this.forms.id)
          this.problemDisabled = true
          this.checkAndReviewShow = true
        } else if (this.taskParams.type === 'choucha') {
          this.table.title.list[0].show = false
          this.getFormsHx(this.forms.id)
          this.problemDisabled = true
          this.checkAndReviewShow = true
        } else if (this.taskParams.type === 'pclook') {
          this.table.title.list[0].show = false
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
          this.table.title.list[0].show = false
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
  created() {
    this.getDic()
    this.inittaskParams()
    this.getCheckCorpInfo()
    this.staing = this.$route.query.staing
  },
  computed: {
    computedContet() {
      let count =
        100 -
        this.shenheForms.sxxScore -
        this.shenheForms.wzxScore -
        this.shenheForms.zqxScore
      this.shenheForms.score = count
      return count
    },
    computedContetAgain() {
      let count =
        100 -
        this.againForms.sxxScore -
        this.againForms.wzxScore -
        this.againForms.zqxScore
      this.againForms.score = count
      return count
    }
  }
}
</script>

<style scoped>
.distop .el-upload-list {
  overflow: hidden;
}
.el-form-item--small .el-form-item__content {
  height: auto;
  line-height: 50px;
  min-height: 50px;
}
</style>