<template>
  <div>
  <el-input v-model="userName" :placeholder="placeholder" readonly>
    <el-button slot="append" icon="el-icon-search" @click="userDialog"></el-button>
  </el-input>
  <el-dialog :visible.sync="visibleUser" width="70%" :modal="false" title="选择用户" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-row :gutter="20">
      <el-col :span="18">
        <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="multipleTable"
          v-loading="dataListLoading"
          :data="dataList"
          border
          @selection-change="dataListSelectionChangeHandle"
          @row-click="dataListRowClickHandle"
          style="width: 100%;" size="mini">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="username" label="用户名" sortable="custom" header-align="center" align="center"></el-table-column>
          <el-table-column prop="realName" label="姓名" sortable="custom" header-align="center" align="center"></el-table-column>
          <el-table-column prop="deptName" label="所属部门" header-align="center" align="center"></el-table-column>
          <el-table-column prop="mobile" label="手机号" header-align="center" align="center"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper">
        ></el-pagination>
      </el-col>
      <el-col :span="6">
        已选用户
        <el-table :data="userList" border size="small" height="265" style="width:100%;margin-top: 22px;">
          <el-table-column label="姓名">
            <template slot-scope="scope">{{ scope.row.realName }}</template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="deleteUser(scope.$index,scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <template slot="footer">
      <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
      <el-button type="primary" @click="commitHandle()" size="mini">确定</el-button>
    </template>
  </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'ElUserSelect',
  data () {
    return {
      visibleUser: false,
      userList: [],
      userName: '',
      dataForm: {
        userName: ""
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: []
    }
  },
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    userNames: String,
    placeholder: String
  },
  watch: {
    userNames (val) {
      this.userName = val
    }
  },
  methods: {
    userDialog () {
      this.visibleUser = true
      this.dataForm.userName = ''
      this.userList = []
      this.$nextTick(() => {
        this.value.forEach(item=>{
          this.userList.push({...item})
        })
        this.getDataList()
      })
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/sys/user/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          username: this.dataForm.userName
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 单选
    dataListRowClickHandle(row, column, event){
      let elTable = this.$refs.multipleTable;
      let findRow = this.dataListSelections.find(c => c.userId == row.userId);
      if (findRow) {
        elTable.toggleRowSelection(row, false);
        this.dataListRowSelect(row, false);
        return;
      }
      elTable.toggleRowSelection(row); 
      this.dataListRowSelect(row, true);
    },
    // 多选
    dataListSelectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 选择
    dataListRowSelect(row, selected){
      if(this.userList){
        let rowIndex = this.userList.findIndex(c => c.userId == row.userId);
        if(selected){
          if(rowIndex == -1){
            this.userList.push({...row})
          }
        }else{
          if(rowIndex >= 0){
            this.userList.splice(rowIndex, 1)
          }
        }
      }
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    deleteUser(index, row) {
      this.userList.splice(index, 1);
    },
    cancelHandle () {
      this.visibleUser = false
    },
    commitHandle () {
      this.userName = this.userList.map(item=>item.realName).join(",");
      this.$emit('input', this.userList)
      this.$emit('update:userNames', this.userName)
      this.$emit('update:userIds', this.userList.map(item=>item.userId).join(","))
      this.visibleUser = false
    }
  }
}
</script>
