<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="90px"
      v-loading="loading"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item prop="deptName" label="所属机构" class="company-list">
        <el-popover v-model="companyListVisible" ref="companyListPopover" placement="bottom-start" trigger="click">
          <el-tree
            class="company-listtree"
            :data="companyList"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            ref="companyListTree"
            :highlight-current="true"
            :expand-on-click-node="false"
            accordion
            @current-change="companyListTreeCurrentChangeHandle">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptName" v-popover:companyListPopover :readonly="true" placeholder="所属机构"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item size="mini" label="菜单授权">
            <el-tree
              :data="menuList"
              :props="menuListTreeProps"
              node-key="menuId"
              ref="menuListTree"
              accordion
              show-checkbox
            ></el-tree>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item size="mini" label="数据授权">
            <el-tree
              :data="deptList"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              ref="deptListTree"
              accordion
              show-checkbox>
            </el-tree>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from "@/utils";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      companyListVisible: false,
      menuList: [],
      deptList: [],
      companyList: [],
      menuListTreeProps: {
        label: "name",
        children: "children"
      },
      dataForm: {
        id: 0,
        roleName: "",
        deptId: undefined,
        deptName: "",
        menuIdList: [],
        deptIdList: [],
        remark: ""
      },
      dataRule: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "所属机构不能为空", trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.loading = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        this.$refs.menuListTree.setCheckedKeys([]);
        this.$refs.deptListTree.setCheckedKeys([]);
        Promise.all([this.getMenuList(), this.getCompanyList(), this.getDeptList()]).then(() => {
          this.loading = false
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.id}`),
              method: "get",
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm.roleName = data.role.roleName;
                this.dataForm.remark = data.role.remark;
                this.dataForm.deptId = data.role.deptId;
                this.dataForm.deptName = data.role.deptName;
                this.dataForm.deptIdList = data.role.deptIdList;
                this.dataForm.menuIdList = data.role.menuIdList;
                this.dataForm.menuIdList.forEach(item => this.$refs.menuListTree.setChecked(item, true));
                this.$refs.deptListTree.setCheckedKeys(this.dataForm.deptIdList);
              }
            });
          }
        });
      });
    },
    // 获取菜单列表
    getMenuList() {
      return this.$http({
        url: this.$http.adornUrl("/sys/menu/list"),
        method: "get",
        params: this.$http.adornParams()
      }).then(({data}) => {
          this.menuList = treeDataTranslate(data, "menuId", "parentId");
      }).catch(() => {});
    },
    // 获取部门列表
    getDeptList() {
      return this.$http({
        url: this.$http.adornUrl("/sys/dept/list"),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.deptList = res.data;
      }).catch(() => {});
    },
    // 获取机构列表
    getCompanyList () {
      return this.$http({
        url: this.$http.adornUrl("/sys/company/list"),
        method: "get",
        params: this.$http.adornParams({
          type: 1
        })
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.companyList = res.data
      }).catch(() => {})
    },
    // 上级部门树, 选中
    companyListTreeCurrentChangeHandle (data) {
      this.dataForm.deptId = data.id
      this.dataForm.deptName = data.name
      this.companyListVisible = false
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          this.dataForm.deptIdList = this.$refs.deptListTree.getCheckedKeys();
          this.dataForm.menuIdList = [
            ...this.$refs.menuListTree.getHalfCheckedKeys(),
            ...this.$refs.menuListTree.getCheckedKeys()
          ];
          this.$http({
            url: this.$http.adornUrl(`/sys/role/${!this.dataForm.id ? "save" : "update"}`),
            method: "post",
            data: this.$http.adornData({
              roleId: this.dataForm.id || undefined,
              roleName: this.dataForm.roleName,
              deptId: this.dataForm.deptId,
              remark: this.dataForm.remark,
              menuIdList: this.dataForm.menuIdList,
              deptIdList: this.dataForm.deptIdList
            })
          }).then(({ data }) => {
            this.loading = false
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>

</style>