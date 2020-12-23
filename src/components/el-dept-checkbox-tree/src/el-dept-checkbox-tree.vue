<template>
  <div>
  <el-input v-model="deptNames" :placeholder="placeholder" readonly>
    <el-button slot="append" icon="el-icon-search" @click="deptDialog"></el-button>
  </el-input>
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
      :filter-node-method="filterNode"
      :highlight-current="true"
      :show-checkbox="true"
      :check-strictly="true"
      node-key="id"
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
  name: 'ElDeptCheckboxTree',
  data () {
    return {
      filterText: '',
      visibleDept: false,
      deptList: [],
      deptIds: [],
      deptNames: '',
      expandedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    required: {
      type: Boolean,
      default () {
        return true
      }
    },
    deptName: String,
    query: Boolean,
    placeholder: String
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    deptName (val) {
      console.log('watch deptName',val)
      this.deptNames = val
    }
  },
  methods: {
    deptDialog () {
      this.visibleDept = true
      this.getDeptList(this.value)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getDeptList (ids) {
      this.$nextTick(() => {
        this.expandedKeys = []
        this.deptIds = []
        this.$refs.tree.setCheckedKeys([]);
        this.$http({
          url: this.$http.adornUrl("/sys/dept/list"),
          method: "get",
          params: this.$http.adornParams()
        }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.deptList = res.data
          this.deptIds = ids
          this.expandedKeys = ids
          this.$refs.tree.setCheckedKeys(ids)
        }).catch(() => {})
      })
    },
    cancelHandle () {
      this.visibleDept = false
      this.deptList = []
      this.filterText = ''
    },
    clearHandle () {
      this.$emit('input', [])
      this.$emit('update:deptName', '')
      this.deptNames = ''
      this.visibleDept = false
      this.deptList = []
      this.filterText = ''
    },
    commitHandle () {
      const nodes = this.$refs.tree.getCheckedNodes();
      if (nodes && nodes.length == 0 ) {
        if(this.required){
          this.$message.error('请选择部门')
          return
        }
      }
      this.deptIds = nodes.map(node=>node.id)
      this.deptNames = nodes.map(node=>node.name).join(",");
      this.$emit('input', this.deptIds)
      this.$emit('update:deptName', this.deptNames)
      this.visibleDept = false
      this.deptList = []
      this.deptIds = []
      this.filterText = ''
    }
  }
}
</script>
