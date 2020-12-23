<template>
  <div>
  <el-input v-model="showDeptName" v-show="inputVisible" :placeholder="placeholder" @focus="deptDialog">
    <el-button slot="append" icon="el-icon-search" @click="deptDialog"></el-button>
  </el-input>
  <el-input :value="value" style="display: none"></el-input>
  <el-dialog :visible.sync="visibleDept" width="30%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form size="mini" :inline="true">
      <el-form-item label="关键字：">
        <el-input v-model="filterText"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="default">查询</el-button>
      </el-form-item>
    </el-form>
    <el-tree
      class="filter-tree"
      :data="deptList"
      :default-expanded-keys="expandedKeys"
      :props="{ label: 'name', children: 'children' }"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :highlight-current="true"
      node-key="id"
      accordion
      ref="tree">
    </el-tree>
    <template slot="footer">
      <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
      <el-button v-if="query" type="info" @click="clearHandle()" size="mini">清除</el-button>
      <el-button type="primary" @click="commitHandle()" size="mini">确定</el-button>
    </template>
  </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'ElDeptTree',
  data () {
    return {
      filterText: '',
      visibleDept: false,
      deptList: [],
      showDeptName: '',
      expandedKeys: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  props: {
    value: [Number, String],
    deptName: String,
    query: Boolean,
    selectMode: String,//corp公司 dept部门
    placeholder: String,
    inputVisible: { // 是否显示输入框
      type: Boolean,
      default: true
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    deptName (val) {
      this.showDeptName = val
    }
  },
  methods: {
    deptDialog () {
      this.expandedKeys = null
      if (this.$refs.tree) {
        this.$refs.tree.setCurrentKey(null)
      }
      this.visibleDept = true
      this.getDeptList(this.value)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getDeptList (id) {
      let param = {}
      if(this.selectMode == 'corp'){
        param.type = '1'// 筛选公司数据
      }
      return this.$http({
        url: this.$http.adornUrl("/sys/dept/list"),
        method: "get",
        params: this.$http.adornParams(param)
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deptList = res.data
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(id)
          this.expandedKeys = [id]
        })
      }).catch(() => {})
    },
    cancelHandle () {
      this.visibleDept = false
      this.deptList = []
      this.filterText = ''
    },
    clearHandle () {
      this.$emit('input', '')
      this.$emit('update:deptName', '')
      this.showDeptName = ''
      this.visibleDept = false
      this.deptList = []
      this.filterText = ''
    },
    commitHandle () {
      const node = this.$refs.tree.getCurrentNode()
      if (!node) {
        this.$message.error('请选择部门')
        return
      }
      if(this.selectMode == 'dept' && node.type == 1){
        this.$message.error('只能选择部门')
        return
      }
      this.$emit('input', node.id)
      this.$emit('update:deptName', node.name)
      this.showDeptName = node.name
      this.visibleDept = false
      this.deptList = []
      this.filterText = ''
    }
  }
}
</script>
<style scoped>
  .filter-tree{
    max-height: 350px;
    overflow-y: auto;
  }
</style>