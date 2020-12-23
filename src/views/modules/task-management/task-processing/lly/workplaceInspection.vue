<template>
  <div>
    职场巡查

    <task-base-info v-bind="forms" @getBaseInfoHxData="getBaseInfoHxData" />
    <el-form :model="forms" :inline="true" ref="forms" :rules="dataRule" label-width="150px" class="problemDisabled">
      <el-row>
        <h3 class="form_h3_title">
          <div class="line_type_shu"></div>任务信息
        </h3>
        <el-form-item label="职场名称:" prop="name">

          <el-input :class="{noborder: problemDisabled}" v-model="forms.name" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="职场巡查时间:" prop="day">
          <el-date-picker :class="{noborder: problemDisabled}" v-model="forms.day" :disabled="problemDisabled" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="date" style="width:240px"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="当日参会人数:" prop="number">

          <el-input :class="{noborder: problemDisabled}" type="number" v-model="forms.number" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="当日参会率:" prop="ratio">
          <el-input :class="{noborder: problemDisabled}" type="number" v-model="forms.ratio" style="width:240px"><template slot="append">%</template></el-input>

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
      <div class="line_type_shu"></div>巡查发现问题明细
    </h3>
    <xtable v-bind="table" v-loading="table.loading" />
    <el-dialog title="问题" :visible.sync="dialogVisible" append-to-body width="1300px">
      <el-form :model="visibleForm" :inline="true" label-width="160px" ref="visibleForm" :rules="problemRule" class="problemDisabled">
        <el-row>
          <el-form-item label="问题发生机构:" prop="problemDeptName">

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
            <el-select :class="{noborder: problemDisabled}" v-model="visibleForm.riskLevel" style="width:240px;" disabled placeholder="">
              <el-option v-for="item in DicRiskClassArr" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题主责条线:" prop="mainLines">
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

    <footterButton @onSubmit="onSubmit" ref="footerbutton" v-if="this.editNum == 0" />
    <footterButton @onSubmit="onEdit" ref="footerbutton" v-if="this.editNum == 1" />
    <checkAndReview v-if="checkAndReviewShow" />
  </div>
</template>
<script>
import xtable from '@/components/xtable/xtable'
import upload from '@/components/el-upload/el-upload'
import LevelArr from '@/mixins/level-arr'
import { getTX } from '@/api/common/index.js'
import footterButton from '@/views/modules/task-management/task-common/footterButtonBox'
import checkAndReview from '@/views/modules/task-management/task-common/footterCheckReview'
import {
  contactinspectSubmitFn,
  contactinspectEditFn,
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
    footterButton
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
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
      DicTimeClassArr: [],
      DicLineClassArr: [],
      categoryArr: [],
      loading: false,
      options: [],
      dialogVisible: false,
      problemDisabled: false,
      forms: {
        id: '',
        project: '',
        commonProblems: [],
        taskFiles: [],
        name: '',
        day: '',
        number: '',
        ratio: '',
        fileList2: {
          files: [],
          uploadbtnshow: true
        }
      },
      corpInfo: {},
      visibleForm: {
        problemDeptName: ''
      },
      dataRule: {
        name: [
          { required: true, message: '职场名称不能为空', trigger: 'blur' }
        ],
        day: [
          { required: true, message: '职场巡查时间不能为空', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '当日参会人数不能为空', trigger: 'blur' }
        ],
        ratio: [
          { required: true, message: '当日参会率不能为空', trigger: 'blur' }
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
            label: '问题发送机构',
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
                    a = item.name
                    arr.push(a)
                  }
                }
              })
              a = arr.join(';')
              console.log(a)
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
        },
      pcParams: {}
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
    getCheckCorpInfo() {
      getCheckCorpInfo({ id: this.forms.id }).then((res) => {
        if (res.data.code === 0 && res.data.msg === 'success') {
          this.corpInfo.problemDept = res.data.dept.id
          this.corpInfo.problemDeptName = res.data.dept.name
        }
      })
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
        problemTime: '',
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
      this.forms.project = row.name
    },
    editFn(row) {
      this.lookChoose = true
      this.resForm()
      this.subandedit = 'edit'
      this.visibleForm = { ...row }
      this.categoryArr = row.categoryArr
      this.indexTypeId = row.indexTypeId
      this.options = row.options
      this.dialogVisible = true
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
        if (data.code === 0 && data.msg === 'success') {
          _this.forms = { ...data.business }
          _this.forms.commonProblems = data.problem
          _this.table.list = data.problem === null ? [] : data.problem
          _this.watchTableListChange()
          this.forms.taskFiles =
            data.taskFiles !== null && data.taskFiles.length
              ? data.taskFiles.map((item) => {
                return {
                  fileName: item.fileName,
                  fileUrl: item.fileUrl
                }
              })
              : []
          let taskFiles = data.taskFiles
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
    onEdit() {
      this.$refs.forms.validate((valid) => {
        if (valid) {
          this.$confirm('任务修改后将不能修改，是否继续提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.btnloading = true
            let params = JSON.stringify(this.forms)
            params = JSON.parse(params)
            let arr = this.table.list.slice()
            let commonProblem = arr.map((item) => {
              let ite = item
              return ite
            })
            params.commonProblems = commonProblem
            // params.taskId = this.id
            contactinspectEditFn(params).then((res) => {
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
    onSubmit() {
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
            let commonProblems = arr.map((item) => {
              let ite = item
              delete ite.options
              delete ite.indexTypeId
              return ite
            })
            params.commonProblems = commonProblems
            delete params.fileList2
            params.taskId = this.id
            delete params.id
            contactinspectSubmitFn(params).then((res) => {
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
    fileChangeFn1(arr) {
      this.forms.hfName = arr[0].fileName
      this.forms.hfUrl = arr[0].fileUrl
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
          this.shenheboxshow = true
          this.getFormsHx(this.forms.id)
          this.problemDisabled = true
        } else if (this.taskParams.type === 'choucha') {
          this.table.title.list[0].show = false
          this.checkAndReviewShow = true
          this.shenheboxshow = true
          this.getFormsHx(this.forms.id)
          this.problemDisabled = true
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
  created() {
    this.getDic()
    this.inittaskParams()
    this.getCheckCorpInfo()
  }
}
</script>

<style>
</style>