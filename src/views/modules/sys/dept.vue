<template>
  <div class="mod-sys__dept">
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
        <el-row :gutter="20" type="flex">
          <el-col :span="4">
            <div class="head-title"><i class="el-icon-menu"></i>部门管理</div>
          </el-col>
          <el-col :span="20">
            <el-button class="add-button" v-if="isAuth('sys:dept:save')" type="primary" size="mini" @click="addOrUpdateHandle()">新增</el-button>
            <el-button class="import-button" v-if="isAuth('sys:dept:import')" type="info" size="mini" @click="handleImport()">导入</el-button>
          </el-col>
        </el-row>
        <el-table
          v-loading="dataListLoading"
          :data="dataList"
          row-key="id"
          border
          style="width: 100%;"
        >
          <el-table-column prop="name" label="部门名称" header-align="center" min-width="150"></el-table-column>
          <el-table-column prop="code" label="部门代码" header-align="center" align="center" width="150"></el-table-column>
          <el-table-column prop="parentName" label="上级部门" header-align="center" align="center"></el-table-column>
          <el-table-column prop="sort" label="排序" header-align="center" align="center" width="80"></el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            header-align="center"
            align="center"
            width="150"
          >
            <template slot-scope="scope">
              <el-button
                v-if="isAuth('sys:dept:update')"
                type="text"
                size="small"
                @click="addOrUpdateHandle(scope.row.id)"
              >修改</el-button>
              <el-button
                v-if="isAuth('sys:dept:delete')"
                type="text"
                size="small"
                @click="deleteHandle(scope.row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
import mixinViewModule from "@/mixins/view-module";
import AddOrUpdate from "./dept-add-or-update";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      deptList: [],
      expandedKeys: [],
      dataForm: {
        corpId: -1,
        type: 2
      },
       upload: {
        open: false,
        title: '',
        isUploading: false,
        updateSupport: 0,
        headers: { token: Vue.cookie.get('token') },
        url: this.$http.adornUrl('/sys/dept/import')
      },
      mixinViewModuleOptions: {
        getDataListURL: "/sys/dept/list",
        deleteURL: "/sys/dept/delete",
        createdIsNeed: false,
        activatedIsNeed: false
      },
    };
  },
  components: {
    AddOrUpdate,
  },
  activated() {
    this.getDeptList();
  },
  methods: {
    // 获取部门列表
    getDeptList() {
      return this.$http({
        url: this.$http.adornUrl("/sys/company/list"),
        method: "get",
        params: this.$http.adornParams({
          type: "1",
        }),
      }).then(({ data }) => {
        this.deptList = data && data.code === 0 ? data.data : [];
        if(this.deptList && this.deptList.length > 0){
            this.expandedKeys = this.deptList.map(node=>node.id)
        }
      }).catch(() => {});
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.dataForm.corpId = data.id;
      this.getDataList();
    },
    // 下载导入模板
    importTemplate () {
      window.location.href = this.$http.adornUrl('/sys/dept/export?token=' + Vue.cookie.get('token'))
    },
    /** 导入按钮操作 */
    handleImport () {
      this.upload.title = '部门导入'
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
};
</script>
<style>
.mod-sys__dept .el-scrollbar .el-scrollbar__wrap{
  overflow-x: hidden;
}
</style>
<style scoped>
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
.add-button{
  float: right;
  margin-top: -5px;
}
.import-button{
  float: right;
  margin-top: -5px;
  margin-right: 10px ;
}
</style>
