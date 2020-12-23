<template>
    <div class="mod-sys__dept">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button v-if="isAuth('sys:company:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button type="info" v-if="isAuth('sys:company:import')" @click="handleImport()">导入</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" row-key="id" border style="width: 100%;">
        <el-table-column prop="name" label="机构名称" header-align="center" min-width="150"></el-table-column>
        <el-table-column prop="code" label="机构代码" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="level" label="所属层级" header-align="center" align="center" width="100">
           <template slot-scope="scope">
             {{ getLevelLabel(scope.row.level) }}
          </template>
        </el-table-column>
        <el-table-column prop="parentName" label="上级机构" header-align="center" align="center"></el-table-column>
        <el-table-column prop="leader" label="负责人" header-align="center" align="center"></el-table-column>
        <el-table-column prop="address" label="地址" header-align="center" align="center"></el-table-column>
        <el-table-column prop="sort" label="排序" header-align="center" align="center" width="80"></el-table-column>
        <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="isAuth('sys:company:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
            <el-button v-if="isAuth('sys:company:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './company-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/company/list',
        deleteURL: '/sys/company/delete'
      },
      dataForm: {
        type: '1'
      },
       upload: {
        open: false,
        title: '',
        isUploading: false,
        updateSupport: 0,
        headers: { token: Vue.cookie.get('token') },
        url: this.$http.adornUrl('/sys/company/import')
      }
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    getLevelLabel(key){
      let lable = undefined
      if(key){
        switch(key) {
          case 'L1':
              lable = "省级"
              break
          case 'L2':
              lable = "市级"
              break;
          case 'L3':
              lable = "县级"
              break;
          case 'L4':
              lable = "职场"
              break;
        }
      }
      return lable;
    },
    // 下载导入模板
    importTemplate () {
      window.location.href = this.$http.adornUrl('/sys/company/export?token=' + Vue.cookie.get('token'))
    },
    /** 导入按钮操作 */
    handleImport () {
      this.upload.title = '机构导入'
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
  }
}
</script>
