<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__dict">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.dictValue" placeholder="字典值" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.dictLabel" placeholder="字典标签" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="isAuth('sys:dict:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="isAuth('sys:dict:delete')" type="danger" @click="deleteHandle()">批量删除</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
        @selection-change="dataListSelectionChangeHandle"
        @sort-change="dataListSortChangeHandle"
        style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="dictValue" label="字典值" header-align="center" align="center"></el-table-column>
        <el-table-column prop="dictLabel" label="字典标签" header-align="center" align="center"></el-table-column>
        <el-table-column prop="sort" label="排序" sortable="custom" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column  label="操作" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="isAuth('sys:dict:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
            <el-button v-if="isAuth('sys:dict:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './dict-data-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false,
        getDataListURL: '/sys/dict/data/page',
        getDataListIsPage: true,
        deleteURL: '/sys/dict/data/delete',
        deleteIsBatch: true
      },
      dataForm: {
        dictTypeId: '0',
        dictLabel: '',
        dictValue: ''
      }
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.dataForm.dictTypeId = this.$route.params.dictTypeId || '0'
    this.getDataList()
  },
  methods: {
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id
        this.$refs.addOrUpdate.dataForm.dictTypeId = this.dataForm.dictTypeId
        this.$refs.addOrUpdate.init()
      })
    }
  }
}
</script>
