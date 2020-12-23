<template>
  <div>
    <el-form :inline="true" label-width="90px">
      <el-form-item label="发生时间段:">
        <el-date-picker v-model="tforms.datatimes" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
        </el-date-picker>
      </el-form-item>
      <el-form-item label="问题状态:">
        <el-select v-model="tforms.status" style="width: 240px" clearable>
          <el-option v-for="item in CList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList(1)" v-if="isAuth('biz:commonproblem:list')">查询</el-button>
        <el-button @click="resDataList">重置</el-button>
      </el-form-item>
      <xtable v-bind="table" v-loading="table.loading" @handleSelectionChange="handleSelectionChange" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
    </el-form>

    <el-dialog :visible.sync="dialogVisible" append-to-body width="1300px" padding='0px'>
      <h2>问题</h2>
      <el-form :model="visibleForm" ref="visibleForm" :rules="dataRule" :inline="true" label-width="160px">
        <el-row>
          <el-form-item label="问题发生机构:" prop="problemDeptName">
            <el-popover v-model="companyListVisible" :class="{noborder: problemDisabled}" :disabled="problemDisabled" ref="companyListPopover" placement="bottom-start" trigger="click">
              <el-tree class="company-listtree" :data="companyList" :props="{ label: 'name', children: 'children' }" node-key="id" ref="companyListTree" :highlight-current="true"
                :expand-on-click-node="false" accordion @current-change="companyListTreeCurrentChangeHandle">
              </el-tree>
            </el-popover>

            <el-input v-model="visibleForm.problemDeptName" :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-popover:companyListPopover :readonly="true" placeholder="所属单位" clearable
              style="width:240px"></el-input>

          </el-form-item>

          <el-form-item label="负面清单代码:" prop="problemCode">
            <!-- <el-select :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="visibleForm.problemCode" filterable :loading="loading" :remote-method="remoteMethod" remote
              reserve-keyword style="width:240px" @change="fmqdChange" clearable>
              <el-option v-for="item in options" :key="item.code" :label="item.code" :value="item.code">
                <span style="float: left">{{ item.code }}&nbsp;|&nbsp;{{ item.name }}</span>
                
              </el-option>
            </el-select> -->
            
            <el-input :class="{noborder: problemDisabled}" disabled v-model="visibleForm.problemCode" style="width:180px">
            </el-input>
              <el-button @click="openCodeTable" v-if="lookChoose">选择</el-button>
          </el-form-item>

          <el-form-item label="类型1:" prop="category1">
            <el-select :class="{noborder: problemDisabled}" v-model="visibleForm.category1" style="width:240px" disabled placeholder="">
              <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型2:" prop="category2">
            <el-select :class="{noborder: problemDisabled}" v-model="visibleForm.category2" style="width:240px" disabled placeholder="">
              <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型3:" disabled prop="category3">
            <el-select :class="{noborder: problemDisabled}" v-model="visibleForm.category3" style="width:240px" disabled placeholder="">
              <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型4:" prop="category4">
            <el-select :class="{noborder: problemDisabled}" v-model="visibleForm.category4" style="width:240px;" disabled placeholder="">
              <el-option v-for="(item, index) in categoryArr" :key="index" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="风险等级:">
            <el-select :class="{noborder: problemDisabled}" v-model="visibleForm.riskLevel" style="width:240px;" disabled placeholder="">
              <el-option v-for="item in DicRiskClassArr" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题主责条线:">
            <el-select :class="{noborder: problemDisabled}" disabled v-model="visibleForm.mainLines" multiple style="width:240px;" placeholder="">
              <el-option v-for="item in DicLineArr" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <!-- <el-input :class="{noborder: problemDisabled}" disabled v-model="visibleForm.mainLine" style="width:240px"></el-input> -->
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
            <el-select :class="{noborder: problemDisabled}" v-model="visibleForm.problemDateTime" multiple :picker-options="pickerOptions" :disabled="problemDisabled" style="width:240px;">
              <el-option v-for="item in DicTimeClassArr" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
              </el-option>
            </el-select>
            <!-- <el-date-picker :class="{noborder: problemDisabled}" v-model="visibleForm.problemDateTime" :picker-options="pickerOptions" :disabled="problemDisabled" value-format="yyyy-MM-dd" type="date"
              style="width:240px" placeholder="选择年度">
            </el-date-picker> -->
          </el-form-item>
          <el-form-item label="发现问题时间:" prop="foundTime">
            <el-date-picker :class="{noborder: problemDisabled}" :disabled="problemDisabled" v-model="visibleForm.foundTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"
              style="width:240px">
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
        <el-button type="primary" :loading="btnloading" @click="diaologSubmit" v-if="!problemDisabled">确 定</el-button>
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
          <el-form-item label="清单内容:">
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
    <!-- 问题信息导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-button type="text" @click="importTemplate">点击下载导入模板</el-button>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import xtable from '@/components/xtable/xtable'
import { getFMQDDM, getFMQDDMCODE, getorganization } from '@/api/task-processing/index.js'
import LevelArr from '@/mixins/level-arr'
import { getTX } from '@/api/common/index.js'
import {
  getDataList,
  getFormsHx,
  saveForms,
  updateForms,
  addTaskDef,
  deleteFn,
  exportCommonProblem
} from '@/api/statistical-report/statistics-of-rectification-problems/index'
export default {
  mixins: [LevelArr],
  components: {
    xtable
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      upload: {
        open: false,
        title: '',
        isUploading: false,
        updateSupport: 0,
        headers: { token: Vue.cookie.get('token') },
        url: this.$http.adornUrl('/biz/commonproblem/import')
      },
      lookChoose: true,
      dialogVisibleApply: false,
      companyListVisible: false,
      classifyFormVisible: false,
      companyList: [],
      corpName: '',
      deptList: [],
      options: [],
      categoryArr: [],
      classifyList: [],
      classifyForm: {
        id : '',
        name : '',
        code: ''
      },
      classifyName : '',
      visibleForm: {
        id: '',
        problemDept: '',
        problemDeptName: '',
        problemDateTime: [],
        problemCode: '',
        levels: '',
        lines: '',
        riskLevel: '',
        coverMoney: '',
        lossMoney: '',
        coverNum: '',
        foundTime: '',
        foundWay: '',
        mainLine: '',
        mainLines: [],
        mainPosts: [],
        mainUser: '',
        others: '',
        description: '',
        remark: '',
        status: ''
      },
      dialogVisible: false,
      problemDisabled: false,
      btnloading: false,
      subandedit: '',
      loading: false,
      dataRule: {
        
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
          { required: true, message: '发现问题途径不能为空', trigger: 'blur' }
        ],
        mainUser: [
          { required: true, message: '问题主责人员不能为空', trigger: 'blur' }
        ],
      },
      CList: [
        {
          value: '0',
          label: '草稿'
        }, {
          value: '1',
          label: '待整改'
        },
        {
          value: '2',
          label: '整改中'
        },
        {
          value: '3',
          label: '已整改'
        }
      ],
      tforms: {
        datatimes: [],
        status: ''
      },
      table: {
        loading: false,
        list: [],
        isMultiple: true,
        typeIndex: false,
        title: {
          show: true,
          align: 'left',
          label: '',
          list: [
            {
              size: 'small',
              show: true,
              type: 'primary',
              label: '新增',
              filter: (row) => {
                if (this.isAuth('biz:commonproblem:save')) {
                  return true
                } else {
                  return false
                }
              },
              method: () => {
                this.subandedit = 'add'
                this.dialogVisible = true
                this.resetAllForm()
                this.$nextTick(() => {
                  this.$refs.visibleForm.resetFields()
                })
              }
            },
            {
              size: 'small',
              show: true,
              type: 'primary',
              label: '发起整改',
              method: () => {
                this.addTaskDef()
              }
            },
            {
              size: 'small',
              show: true,
              type: '',
              label: '导出',
              filter: (row) => {
                if (this.isAuth('biz:exportViewRiskClues:list')) {
                  return true
                } else {
                  return false
                }
              },
              method: () => {
                this.importTemplate()
              }
            },
            {
              size: 'small',
              show: true,
              type: '',
              label: '导入',
              filter: (row) => {
                if (this.isAuth('sys:importCommonProblem:save')) {
                  return true
                } else {
                  return false
                }
              },
              method: () => {
                this.handleImport()
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
                str = row.problemDateTime.join(',')
              }
              return str
            }
          },
          {
            label: '负面清单代码',
            name: 'problemCode',
            width: 120
          },

          {
            label: '风险等级',
            name: 'riskLevel',
            width: 80,
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
                    a = item.name
                    arr.push(a)
                  }
                }
              })
              a = arr.join(',')
              console.log(a)
              return a
            }
          },
          {
            label: '问题主责岗位',
            name: 'mainPost',
            width: 100
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
          },
          {
            label: '状态',
            name: 'status',
            formatter: (row) => {
              let a = ''
              switch (row.status) {
                case 0:
                  a = '草稿'
                  break
                case 1:
                  a = '待整改'
                  break
                case 2:
                  a = '整改中'
                  break
                case 3:
                  a = '已整改'
                  break
              }
              return a
            }
          }
        ],
        total: 1,
        listQuery: {
          page: 1,
          pageSize: 10
        },
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
                this.getFormsHx(row.id)
              },
              filter: (row) => {
                if (row.status === 0 || row.status === 1) {
                  return true
                } else {
                  return false
                }
              }
            },
            {
              label: '查看',
              type: 'text',
              method: (index, row) => {
                this.lookFn(row.id)
              }
            },
            {
              label: '删除',
              type: 'text',
              show: true,
              method: (index, row) => {
                this.deleteFn(row.id)
              },
              filter: (row) => {
                if (row.status === 0 || row.status === 1) {
                  return true
                } else {
                  return false
                }
              }
            }
          ]
        },
        multiple: []
      },
      DicLineArr: [],
      DicRiskClassArr: [],
      DicLineClassArr: [],
      DicProblemDiscoveryArr: [],
      DicTimeClassArr: [],

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
      },
    }
  },
  methods: {
    //新增时重置表单
    resetAllForm(){
        this.visibleForm.id = '',
        this.visibleForm.problemDeptName = '',
        this.visibleForm.category1 = '',
        this.visibleForm.category2 = '',
        this.visibleForm.category3 = '',
        this.visibleForm.category4 = '',
        this.visibleForm.problemDept= '',
        this.visibleForm.problemDateTime= [],
        this.visibleForm.problemCode= '',
        this.visibleForm.levels= '',
        this.visibleForm.lines= '',
        this.visibleForm.riskLevel= '',
        this.visibleForm.coverMoney= '',
        this.visibleForm.lossMoney= '',
        this.visibleForm.coverNum= '',
        this.visibleForm.foundTime= '',
        this.visibleForm.foundWay= '',
        this.visibleForm.mainLine= '',
        this.visibleForm.mainLines= [],
        this.visibleForm.mainPosts= [],
        this.visibleForm.mainUser= '',
        this.visibleForm.others= '',
        this.visibleForm.description= '',
        this.visibleForm.remark= '',
        this.visibleForm.status= ''
    },
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

    //机构数据
    companyListTreeCurrentChangeHandle(data) {
      //   this.corpName = data.name
      this.visibleForm.problemDeptName = data.name
      this.visibleForm.problemDept = data.id
      this.companyListVisible = false
    },
    // 获取机构列表
    getCompanyList() {
      return this.$http({
        url: this.$http.adornUrl('/sys/company/list'),
        method: 'get',
        params: this.$http.adornParams({
          type: 1
        })
      })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.companyList = res.data
        })
        .catch(() => { })
    },
    deptSelect(node, instanceId) {
      this.$http({
        url: this.$http.adornUrl(`/sys/dept/line/${node.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        var list = data && data.code === 0 ? data.data : []
        list.forEach(item => {
          this.dataForm.lineList.push({
            id: undefined,
            deptId: item.deptId,
            lineId: item.lineId
          })
        })
      }).catch(() => { })
    },
    // 导出
    importTemplate() {
      let foundTime = ''
      let endTime = ''
      if (this.tforms.datatimes.length === 2) {
        foundTime = this.tforms.datatimes[0]
        endTime = this.tforms.datatimes[1]
      }
      let params = {
        status: this.tforms.status,
        foundTime,
        endTime
      }
      exportCommonProblem(params).then((res) => {
        if (res) {
          const aLink = document.createElement('a')
          let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
          aLink.href = URL.createObjectURL(blob)
          aLink.setAttribute('download', '问题整改' + '.xlsx') // 设置下载文件名称
          aLink.click()
          this.$refs.loadElement.appendChild(aLink)
        }
      })
    },
    achieve() {
      let params = {
        id: this.visibleForm.problemDept
      }
      getorganization(params).then((res) => {
        console.log(res)
      })
    },

    //重置清单代码表单
    resClassifyList(){
      this.classifyForm.id = '',
      this.classifyForm.name = '',
      this.classifyName = '',
      this.classifyForm.code = ''
    },

    //重置问题整改表单
    resDataList() {
      this.tforms.datatimes = []
      this.tforms.status = ''
      this.table.listQuery = {
        pageSize: 10,
        page: 1
      }
      this.getDataList()
    },
    addTaskDef() {
      var params
      if (this.table.multiple.length > 0) {
        if (
          this.table.multiple.some((item) => {
            return item.status !== 1
          })
        ) {
          this.$message.warning('有非‘待整改’的数据，不能整改！')
          return false
        }
        params = this.table.multiple.map((item) => {
          return item.id
        })
      } else {
        this.$message.warning('请先选中要整改的数据')
        return false
      }
      this.$confirm('确定发起整改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          addTaskDef(params).then((res) => {
            let data = res.data
            if (data.code === 0 && data.msg === 'success') {
              this.$message.success('整改成功')
              this.getDataList(1)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消整改'
          })
        })
    },
    deleteFn(id) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteFn(id).then((res) => {
            let data = res.data
            if (data.code === 0 && data.msg === 'success') {
              this.$message.success('删除成功')
              this.getDataList(1)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getDataList(page) {
      this.table.loading = true
      let foundTime = ''
      let endTime = ''
      if (this.tforms.datatimes.length === 2) {
        foundTime = this.tforms.datatimes[0]
        endTime = this.tforms.datatimes[1]
      }
      if (page) {
        this.table.listQuery.page = page
      }
      let params = {
        limit: this.table.listQuery.pageSize,
        page: this.table.listQuery.page,
        status: this.tforms.status,
        foundTime,
        endTime
      }
      getDataList(params).then((res) => {
        let data = res.data
        this.table.loading = false
        if (data.code === 0 && data.msg === 'success') {
          this.table.list = data.page.list
          this.table.total = data.page.totalCount
        }
      })
    },
    // 查看
    lookFn(id) {
      this.lookChoose = false
      this.problemDisabled = true
      this.dialogVisible = true
      getFormsHx(id).then((res) => {
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.visibleForm = { ...data.commonProblem }
          this.fmqdChange(data.commonProblem.problemCode)
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
    diaologSubmit() {
      this.$refs.visibleForm.validate((validate) => {
        if (validate) {
          this.btnloading = true
          if (this.subandedit === 'add') {
            saveForms(this.visibleForm).then((res) => {
              let data = res.data
              this.dialogVisible = false
              this.btnloading = false
              if (data.code === 0 && data.msg === 'success') {
                this.$message.success('新增成功')
                this.getDataList(1)
              }
            })
          } else if (this.subandedit === 'edit') {
            updateForms(this.visibleForm).then((res) => {
              let data = res.data
              this.dialogVisible = false
              this.btnloading = false
              if (data.code === 0 && data.msg === 'success') {
                this.$message.success('修改成功')
                this.getDataList(1)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 编辑
    getFormsHx(id) {
      this.lookChoose = true
      let _this = this
      _this.problemDisabled = false
      _this.subandedit = 'edit'
      _this.dialogVisible = true
      getFormsHx(id).then((res) => {
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.visibleForm = { ...data.commonProblem }
          this.fmqdChange(data.commonProblem.problemCode)
          // this.achieve()
        }
      })
    },
    getDic() {
      getTX().then((res) => {
        if (res.data.code === 0 && res.data.msg === 'success') {
          this.DicLineArr = res.data.list
        }
      }) // 条线字典

      //   this.DicPostTypeeArr = this.getDictDataList('post_typee') // 岗位

      this.DicLineClassArr = this.getDictDataList('line') // 主责条线
      this.DicRiskClassArr = this.getDictDataList('risk_class') // 风险等级
      this.DicTimeClassArr = this.getDictDataList('time_annual') // 年度时间
      this.DicProblemDiscoveryArr = this.getDictDataList('problem_discovery') // 发现问题途径
    },
    handleSelectionChange(val) {
      this.table.multiple = val
    },
    handleCurrentChange(val) {
      this.table.listQuery.page = val
      this.getDataList()
    },
    handleSizeChange(val) {
      this.table.listQuery.pageSize = val
      this.getDataList(1)
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

    resetForm() {
      this.visibleForm = {
        problemDept: undefined,
        problemDateTime: undefined,
        problemCode: undefined
      }
    },
    // 下载导入模板
    importTemplate () {
      window.location.href = this.$http.adornUrl('/biz/commonproblem/exportTemplate?token=' + Vue.cookie.get('token'))
    },
    /** 导入按钮操作 */
    handleImport () {
      this.upload.title = '问题信息导入'
      this.upload.open = true
    },
    // 文件上传中处理
    handleFileUploadProgress (event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess (response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      if (response.code === 0) {
        this.$message({
          message: response.msg,
          type: 'success',
          duration: 3000,
          dangerouslyUseHTMLString: true,
          onClose: () => {
            this.getDataList()
          }
        })
      } else {
        this.$message({
          message: response.msg,
          type: 'error',
          duration: 3000,
          dangerouslyUseHTMLString: true,
          onClose: () => {
            this.getDataList()
          }
        })
      }
    },
    // 提交上传文件
    submitFileForm () {
      this.$refs.upload.submit()
    }
  },
  created() {
    this.getDic()
    this.getDataList()
    this.getCompanyList()
  }
}
</script>

<style>
</style>>
