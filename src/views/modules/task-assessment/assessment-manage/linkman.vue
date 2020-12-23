<template>
  <div>
    <h3 class="form_h3_title">
      <div class="line_type_shu"></div>
      基本信息
    </h3>
    <el-form :inline="true" ref="formrefs" :model="forms" :rules="dataRule">
      <el-form-item label="模板名称:" prop="name">
        <el-input :disabled="lookis" v-model="forms.name" :class="{noborder: lookis}" placeholder="请输入模版名称" clearable class="el-input" style="width:240px;"></el-input>
      </el-form-item>
      <el-form-item label="涉及层级:" prop="levels">
        <el-select v-if="forms.type === 1 || forms.type === '1'" v-model="forms.levels" :disabled="lookis" multiple placeholder="请选择层级" clearable style="width:240px;" :class="{noborder: lookis}">
          <el-option v-for="item in LevelArr" :key="item.id" :label="item.label" :value="item.id">
          </el-option>
        </el-select>
        <el-select v-if="forms.type !== 1 && forms.type !== '1'" v-model="forms.levels" :disabled="lookis" multiple placeholder="请选择层级" clearable style="width:240px;" :class="{noborder: lookis}">
          <el-option label="职场" value="L4" key="3">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="涉及条线:" prop="lineIds">
        <el-select v-model="forms.lineIds" :disabled="lookis" multiple clearable placeholder="请选择涉及条线" style="width:240px;" :class="{noborder: lookis}">
          <el-option v-for="item in forms.stripList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <h3 class="form_h3_title">
        <div class="line_type_shu"></div>考核内容
      </h3>
      <br>

      <div class="selfboxdiv" style="width:100%;display:flex">
        <table cellspacing="0" cellpadding="0" class="self-table" style="width:100%;flex:1;">
          <tr style="height:40px">
            <td>考核指标</td>
            <td>占比</td>
            <td>考核类型</td>
            <td style="width:150px;">任务类型</td>
            <td>任务描述</td>
            <td></td>
          </tr>
          <tr style="height:40px" v-for="(item, index) in forms.tableData" :key="index">
            <td>
              <el-input :disabled="lookis || item.type === 'jiafenxiang' || item.type === 'jianfenxiang'" v-model="item.name" :class="{noborder: problemDisabled}"></el-input>
            </td>
            <td>
              <div class="lookdiv" style="width: 100%;text-align:center;" v-if="item.type === 'jiafenxiang' || item.type === 'jianfenxiang'">100&nbsp;&nbsp; %</div>
              <el-input type="number" :disabled="lookis" v-model="item.ratio" style="width: 45px" :class="{noborder: problemDisabled}" v-else>
                <template slot="append">%</template>
              </el-input>
            </td>
            <td>
              <el-select v-model="item.type" placeholder="请选择" style="width:100px" :disabled="lookis" @change="classifyChange(item.type, index)" :class="{noborder: problemDisabled}">
                <el-option v-for="item in forms.assessmentTypeArr" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                </el-option>
              </el-select>
            </td>
            <td>
              <el-select v-model="item.classify" placeholder="请选择" style="width:150px" :disabled="lookis" v-if="item.type === 'guding' || item.type === 'linshi'" :class="{noborder: problemDisabled}">
                <el-option v-for="item in forms.taskTypeArr" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                </el-option>
              </el-select>
            </td>
            <td>
              <el-input :disabled="lookis" type="textarea" placeholder="请输入内容" v-model="item.description" :autosize="{ minRows: 2, maxRows: 4}" :class="{noborder: problemDisabled}">
              </el-input>
            </td>
            <td>
                <el-button icon="el-icon-delete" type="danger" @click="delTable(index)" v-if="lookis == ''">删除</el-button>
            </td>
          </tr>
        </table>

      </div>
      <el-button style="margin-top:5px;width:100%;font-weight:800;background-color: #CCFFF5;box-shadow:1px 1px 1px #44FFDA;" icon="el-icon-plus" @click="addTable" v-if="forms.islook === ''">添加一行</el-button>
      <div class="fixed-bottm-box">
        <el-button type="primary" v-if="forms.islook !== 'look'" :loading="btnloading" @click="onSubmit">提交</el-button>
        <el-button @click="back" :disabled="btnloading">取消</el-button>
      </div>
    </el-form>

  </div>
</template>

<script>
import {
  addAssessnebtManage,
  hxFroms,
  saveEdit,
} from '@/api/task-assessment/assessmentManage'
import { getTX } from '@/api/common/index.js'
import xtable from '@/components/xtable/xtable'
import LevelArr from '@/mixins/level-arr'
export default {
  mixins: [LevelArr],
  components: {
    xtable,
  },
  data() {
    return {
      btnloading: false,
      forms: {
        id: '',
        islook: '',
        type: '',
        name: '',
        levels: [],
        stripList: '',
        lineIds: [],
        assessmentTypeArr: [],
        taskTypeArr: [],
        tableData: [{}],
        problemDisabled: false,
      },
      dataRule: {
        name: [
          { required: true, message: '模板名称不能为空', trigger: 'blur' },
        ],
        levels: [
          { required: true, message: '涉及层级不能为空', trigger: 'change' },
        ],
        lineIds: [
          { required: true, message: '涉及条线不能为空', trigger: 'change' },
        ],
      },
    }
  },

  computed: {
    lookis() {
      let a = Boolean
      if (this.forms.islook === 'look') {
        this.problemDisabled = true
        a = true
      } else {
        a = false
      }
      return a
    },
  },
  created() {
    if (
      this.$route.query.type !== undefined &&
      this.$route.query.id !== undefined &&
      this.$route.query.islook !== undefined
    ) {
      this.forms.type = this.$route.query.type
      this.forms.id = this.$route.query.id
      this.forms.islook = this.$route.query.islook
      this.getLine()
      this.getAssessmentTypeDic()
      this.getTaskTypeDic()
      if (this.forms.islook !== '') {
        this.hxFn()
      }
    } else {
      this.back()
    }
  },
  methods: {
    classifyChange(type, index) {
      if (type === 'jiafenxiang') {
        this.forms.tableData[index].name = '加分项'
      } else if (type === 'jianfenxiang') {
        this.forms.tableData[index].name = '减分项'
      }
    },
    hxFn() {
      hxFroms(this.forms.id).then((res) => {
        const data = res.data
        if (data.code === 0 && data.msg === 'success') {
          this.forms.levels = data.checkItemVO.levels
          this.forms.lineIds = data.checkItemVO.lineIds
          this.forms.name = data.checkItemVO.name
          this.forms.tableData = data.checkItemVO.tableData
        }
      })
    },
    getLine() {
      // 获取条线字典
      getTX().then((res) => {
        if (res.data.code === 0 && res.data.msg === 'success') {
          this.forms.stripList = res.data.list
        }
      })
    },
    // 获取任务类型字典
    getAssessmentTypeDic() {
      this.forms.assessmentTypeArr = [
        {
          dictValue: 'guding',
          dictLabel: '固定任务',
        },
        {
          dictValue: 'linshi',
          dictLabel: '临时任务',
        },
        {
          dictValue: 'jiafenxiang',
          dictLabel: '加分项',
        },
        {
          dictValue: 'jianfenxiang',
          dictLabel: '减分项',
        },
      ]
    },
    // 获取任务分类字典
    getTaskTypeDic() {
      if (this.forms.type === '1' || this.forms.type === 1) {
        this.forms.taskTypeArr = this.getDictDataList('linkman_task')
      } else {
        this.forms.taskTypeArr = this.getDictDataList('contact-task')
      }
    },
    onSubmit() {
      this.$refs.formrefs.validate((validate) => {
        if (validate) {
          let tabular = this.forms.tableData
          let black = false
          /**
           * 校验核心业务字段是否为空
           */
          tabular.forEach(arr =>{   
            if(arr.name == undefined || arr.name == ''  || arr.type == '' || arr.type == undefined){
              this.$message.error('存在核心业务字段为空')
              black = true
              return
            }
          })
          console.log(black)
          console.log(tabular)
          if(black){
            return
          }
          /**
           * 判断占比是否等于100
           */
          let count = 0
          tabular.forEach(item =>{       
            if(item.classify != ''){
              count = count + (item.ratio / 1)
            }
          })
          if(count != 100){
            this.$message.error('总占比不等于100（不包含加分项减分项）')
            return
          }
          this.btnloading = true
          let params = {
            type: Number(this.forms.type),
            name: this.forms.name,
            levels: this.forms.levels,
            lineIds: this.forms.lineIds,
            tableData: this.forms.tableData,
          }
          if (this.forms.islook === '') {
            this.saveFn(params)
          } else {
            params.id = this.forms.id
            this.saveEditFn(params)
          }
        } else {
          return false
        }
      })
    },
    saveFn(params) {
      addAssessnebtManage(params).then((res) => {
        if (res.data.code === 0 && res.data.msg === 'success') {
          this.$message.success('添加成功')
          setTimeout(() => {
            this.btnloading = false
            this.back()
          }, 2000)
        }
      })
    },
    saveEditFn(params) {
      saveEdit(params).then((res) => {
        if (res.data.code === 0 && res.data.msg === 'success') {
          this.$message.success('修改成功')
          setTimeout(() => {
            this.btnloading = false
            this.back()
          }, 2000)
        }
      })
    },
    back() {
      this.$router.push({
        path: '/task-assessment-assessment-manage/index',
      })
    },
    addTable() {
      this.forms.tableData.push({
        name: '',
        ratio: 0,
        classify: '',
        type: '',
        description: '',
      })
    },
    delTable(index) {
      this.forms.tableData.splice(index, 1)
    },
  },
}
</script>
<style lang="scss" scoped>
.self-table {
  width: 100%;
  overflow: auto;
}
</style>