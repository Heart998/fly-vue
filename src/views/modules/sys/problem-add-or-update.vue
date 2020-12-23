<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? '新增负面清单' : '修改负面清单'" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="code" label="负面清单代码">
        <el-input v-model="dataForm.code" placeholder="负面清单代码"></el-input>
      </el-form-item>
      <el-form-item prop="name" label="负面清单名称">
        <el-input v-model="dataForm.name" placeholder="负面清单名称"></el-input>
      </el-form-item>
      <el-form-item prop="parentName" label="上级分类" class="dept-list">
        <el-popover v-model="deptListVisible" ref="problemListPopover" placement="bottom-start" trigger="click">
          <el-tree
            class="dept-listtree"
            :data="deptList"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            ref="deptListTree"
            :highlight-current="true"
            :expand-on-click-node="false"
            accordion
            @current-change="deptListTreeCurrentChangeHandle">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:problemListPopover :readonly="true" placeholder="上级分类">
          <i
            v-if="$store.state.user.id === 1 && dataForm.pid !== '0'"
            slot="suffix"
            @click.stop="deptListTreeSetDefaultHandle()"
            class="el-icon-circle-close el-input__icon">
          </i> 
        </el-input>
      </el-form-item>
      
      <el-form-item label="风险等级" prop="riskLevel">
            <el-select v-model="dataForm.riskLevel" style="width:100%;" clearable>
              <el-option v-for="item in DicRiskClassArr" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
              </el-option>
            </el-select>
       </el-form-item>
       <el-form-item label="主责条线" prop="lines">
            <el-select  v-model="dataForm.lines" multiple style="width:100%;">
              <el-option v-for="item in DicLineArr" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="主责岗位" prop="posts">
            <el-select v-model="dataForm.posts" multiple placeholder="选择岗位" class="input-with-select" style="width:100%;">
              <el-option v-for="post in postList" :key="post.dictValue" :label="post.dictLabel" :value="post.dictLabel">
                <span style="float: left">{{ post.dictLabel }}</span>
                <!-- <span style="float: right; color: #8492a6; font-size: 13px; margin-right: 20px;">{{ post.deptName }}</span> -->
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="description" label="备注">
        <el-input v-model="dataForm.description" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import { getTX } from '@/api/common/index.js'
export default {
  data () {
    return {
      visible: false,
      deptList: [],
      postList: [],
      deptListVisible: false,
      dataForm: {
        id: '',
        name: '',
        code: '',
        description: '',
        parentName: '',
        level: '',
        pid: '',
        riskLevel: '',
        lines: '',
        posts: []
      },
      DicRiskClassArr: [],
      DicLineArr: []

    }
  },
  computed: {
    dataRule () {
      return {
        code: [
          { required: true, message: '负面清单代码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '负面清单名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getDic()
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.deptListTreeSetDefaultHandle()
        this.getProblemList().then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          } else if (this.$store.state.user.id === 1) {
            this.deptListTreeSetDefaultHandle()
          }
        })
      })
    },
    getDic () {
      getTX().then((res) => {
        if (res.data.code === 0 && res.data.msg === 'success') {
          this.DicLineArr = res.data.list
        }
      }) // 条线字典
      this.DicRiskClassArr = this.getDictDataList('risk_class') // 风险等级
      this.postList = this.getDictDataList('post_type')// 岗位列表
    },
    // 获取部门列表
    getProblemList () {
      return this.$http({
        url: this.$http.adornUrl('/biz/commonproblemclassify/list'),
        method: 'get',
        params: this.$http.adornParams({
          type: 'node'
        })
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deptList = res.data
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http({
        url: this.$http.adornUrl(`/biz/commonproblemclassify/info/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        if (this.dataForm.pid === '0') {
          return this.deptListTreeSetDefaultHandle()
        }
        this.$refs.deptListTree.setCurrentKey(this.dataForm.pid)
      }).catch(() => {})
    },
    // 上级部门树, 设置默认值
    deptListTreeSetDefaultHandle () {
      this.dataForm.pid = '0'
      this.dataForm.parentName = '一级分类'
    },
    // 上级部门树, 选中
    deptListTreeCurrentChangeHandle (data) {
      this.dataForm.pid = data.id
      this.dataForm.parentName = data.name
      this.deptListVisible = false
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http({
          url: this.$http.adornUrl(`/biz/commonproblemclassify/${!this.dataForm.id ? 'save' : 'update'}`),
          method: 'post',
          data: this.$http.adornData(this.dataForm)
        }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
<style lang="scss" scoped>
.dept-list {
  .el-input__inner,
  .el-input__suffix {
    cursor: pointer;
  }
}
.dept-listtree{
  min-width: 250px;
  max-height: 350px;
  overflow-y: auto;
}
</style>
