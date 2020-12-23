<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__region">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button v-if="isAuth('sys:region:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        row-key="id"
        border
        lazy
        :load="load"
        style="width: 100%"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="name" label="区域名称" header-align="center" min-width="180">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column prop="id" label="区域标识" header-align="center" min-width="180">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column prop="treeLevel" label="区域类型" header-align="center" min-width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.treeLevel === 1">省份直辖市</span>
            <span v-else-if="scope.row.treeLevel === 2">地市</span>
            <span v-else>区县</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          header-align="center"
          align="center"
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="updateDate"
          label="更新时间"
          header-align="center"
          align="center"
          min-width="150"
        ></el-table-column>
        <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              v-if="isAuth('sys:region:update')"
              type="text"
              size="small"
              @click="addOrUpdateHandle(scope.row.id)"
            >修改</el-button>
            <el-button
              v-if="isAuth('sys:region:delete')"
              type="text"
              size="small"
              @click="deleteHandle(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import AddOrUpdate from "./region-add-or-update";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/region/list",
        deleteURL: "/sys/region/delete"
      }
    };
  },
  components: {
    AddOrUpdate
  },
  methods: {
    load(tree, treeNode, resolve) {
      this.$http({
        url: this.$http.adornUrl(`/sys/region/list`),
        method: "get",
        params: this.$http.adornParams({
          pid: tree.id
        })
      }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          resolve(res.data);
        })
        .catch(() => {});
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    }
  }
};
</script>
