<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="name" label="部门名称">
        <el-input v-model="dataForm.name" placeholder="部门名称"></el-input>
      </el-form-item>
      <el-form-item prop="code" label="部门代码">
        <el-input v-model="dataForm.code" placeholder="部门代码"></el-input>
      </el-form-item>
      <el-form-item prop="parentName" label="上级部门" class="dept-list">
        <el-popover v-model="deptListVisible" ref="deptListPopover" placement="bottom-start" trigger="click">
          <el-tree
            class="dept-listtree"
            :data="deptList"
            :default-expanded-keys="expandedKeys"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            ref="deptListTree"
            :highlight-current="true"
            :expand-on-click-node="false"
            accordion
            @current-change="deptListTreeCurrentChangeHandle">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:deptListPopover :readonly="true" placeholder="上级部门">
          <i
            v-if="$store.state.user.id === 1 && dataForm.pid !== '0'"
            slot="suffix"
            @click.stop="deptListTreeSetDefaultHandle()"
            class="el-icon-circle-close el-input__icon">
          </i>
        </el-input>
      </el-form-item>
      <el-form-item prop="lineIdList" label="包含条线">
        <el-select v-model="dataForm.lineIdList" multiple placeholder="选择所属条线" class="input-with-select">
          <el-option v-for="line in lineList" :key="line.id" :label="line.name" :value="line.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="sort" label="排序">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" label="排序"></el-input-number>
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
export default {
  data () {
    return {
      visible: false,
      deptList: [],
      lineList: [],
      expandedKeys: [],
      deptTypeList: [],
      deptListVisible: false,
      dataForm: {
        id: '',
        name: '',
        code: '',
        type: '2',
        level: '',
        pid: '',
        parentName: '',
        sort: 0,
        lineIdList: []
      }
    }
  },
  computed: {
    dataRule () {
      return {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级部门不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getDeptTypeList();
    this.getLineList();
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.getDeptList().then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          } else if (this.$store.state.user.id === 1) {
            this.deptListTreeSetDefaultHandle()
          }
        })
      })
    },
    // 获取部门列表
    getDeptList () {
      return this.$http({
        url: this.$http.adornUrl("/sys/dept/list"),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deptList = res.data
        if(this.deptList && this.deptList.length > 0){
          this.expandedKeys = this.deptList.map(node=>node.id)
        }
      }).catch(() => {})
    },
    // 获取部门分类
    getDeptTypeList(){
      this.deptTypeList = this.getDictDataList('dept_type');
    },
    // 获取条线列表
    getLineList () {
      return this.$http({
        url: this.$http.adornUrl("/sys/line/select"),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.lineList = data && data.code === 0 ? data.list : [];
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http({
        url: this.$http.adornUrl(`/sys/dept/info/${this.dataForm.id}`),
        method: "get",
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
      this.dataForm.parentName = '一级部门'
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
            url: this.$http.adornUrl(`/sys/dept/${!this.dataForm.id ? "save" : "update"}`),
            method: "post",
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
.input-with-select {
  width: 100%;
}
</style>
