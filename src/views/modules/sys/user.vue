<template>
  <div class="mod-user">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-title"><i class="el-icon-menu"></i>组织机构</div>
        <div class="head-container">
          <el-scrollbar style="height:100%">
            <el-tree
              ref="tree"
              node-key="id"
              :data="deptList"
              :props="{ label: 'name', children: 'children' }"
              :expand-on-click-node="false"
              :default-expanded-keys="expandedKeys"
              @node-click="handleNodeClick"
            />
          </el-scrollbar>
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item prop="userName" label="用户名称">
            <el-input v-model="dataForm.userName" placeholder="工号或姓名" clearable @clear="getDataList()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
            <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
            <el-button v-if="isAuth('sys:user:save')" type="info" @click="handleImport()">导入</el-button>
            <el-button
              v-if="isAuth('sys:user:delete')"
              type="danger"
              @click="deleteHandle()"
              :disabled="dataListSelections.length <= 0"
            >批量删除</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          @selection-change="selectionChangeHandle"
          style="width: 100%;"
        >
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="username" header-align="center" align="center" label="工号" min-width="120"></el-table-column>
          <!-- <el-table-column prop="usercode" header-align="center" align="center" label="工号" min-width="120"></el-table-column> -->
          <el-table-column prop="realName" header-align="center" align="center" label="姓名" min-width="120"></el-table-column>
          <el-table-column prop="gender" header-align="center" align="center"  width="80" label="性别">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.gender === 0" size="small" type="success">男</el-tag>
              <el-tag v-else-if="scope.row.gender === 1" size="small" type="danger">女</el-tag>
              <el-tag v-else size="small" type="info" effect="dark">保密</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="email" header-align="center" align="center" label="邮箱" v-if="false"></el-table-column>
          <el-table-column prop="mobile" header-align="center" align="center" width="100" label="手机号"></el-table-column>
          <el-table-column prop="corpName" header-align="center" align="center" label="所属机构" min-width="150"></el-table-column>
          <el-table-column prop="deptName" header-align="center" align="center" label="所属部门" min-width="150"></el-table-column>
          <el-table-column prop="status" header-align="center" align="center" width="80" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
              <el-tag v-else size="small">正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" header-align="center" align="center" width="150" label="创建时间" v-if="false"></el-table-column>
          <el-table-column prop="orderNum" header-align="center" align="center" width="80" label="排序"></el-table-column>
          <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="isAuth('sys:user:update')"
                type="text"
                size="small"
                @click="addOrUpdateHandle(scope.row.userId)"
              >修改</el-button>
              <el-button
                v-if="isAuth('sys:user:delete')"
                type="text"
                size="small"
                @click="deleteHandle(scope.row.userId)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </el-col>
    </el-row>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

    <!-- 用户导入对话框 -->
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
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import AddOrUpdate from './user-add-or-update'
export default {
  data () {
    return {
      dataForm: {
        userName: '',
        deptId: undefined
      },
      upload: {
        open: false,
        title: '',
        isUploading: false,
        updateSupport: 0,
        headers: { token: Vue.cookie.get('token') },
        url: this.$http.adornUrl('/sys/user/import')
      },
      deptName: undefined,
      dataList: [],
      deptList: [],
      expandedKeys: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate,
    Treeselect
  },
  watch: {
    // 根据名称筛选部门树
    deptName (val) {
      this.$refs.tree.filter(val)
    }
  },
  activated () {
    this.dataForm.deptId = this.$store.state.user.corpId
    this.getDeptList()
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/sys/user/list'),
        method: 'post',
        data: this.$http.adornData({
          page: this.pageIndex + '',
          limit: this.pageSize + '',
          username: this.dataForm.userName,
          deptId: this.dataForm.deptId
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      var userIds = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.userId
        })
      this.$confirm(
        '确定执行删除操作吗?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/user/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
        .catch(() => {})
    },
    // 获取部门列表
    getDeptList () {
      return this.$http({
        url: this.$http.adornUrl('/sys/dept/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.deptList = data && data.code === 0 ? data.data : []
        if (this.deptList && this.deptList.length > 0) {
          this.expandedKeys = this.deptList.map(node => node.id)
        }
      }).catch(() => {})
    },
    // 下载导入模板
    importTemplate () {
      window.location.href = this.$http.adornUrl('/sys/user/export?token=' + Vue.cookie.get('token'))
    },
    /** 导入按钮操作 */
    handleImport () {
      this.upload.title = '用户导入'
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
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick (data) {
      this.dataForm.deptId = data.id
      this.getDataList()
    }
  }
}
</script>
<style>
.mod-user .el-scrollbar .el-scrollbar__wrap{
  overflow-x: hidden;
}
</style>
<style scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #17B3A3;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .el-scrollbar .el-scrollbar__wrap{
    overflow-x: hidden;
  }
  .head-title{
    font-size: 16px;
    margin-bottom: 13px;
  }
  .head-title > i{
    margin-right: 10px;
  }
  .head-container{
    height: 400px;
  }
  .el-tree > .el-tree-node{
    height: 400px;
    min-width: 100%;
    display: inline-block;
  }
</style>
