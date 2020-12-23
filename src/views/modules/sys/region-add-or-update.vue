<template>
  <el-dialog
    :visible.sync="visible"
    :title="insert ? '新增' : '修改'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmitHandle()"
      label-width="120px"
    >
      <el-form-item prop="parentName" label="上级区域">
        <el-region-tree
          v-model="dataForm.pid"
          placeholder="选择区域"
          :parent-name.sync="dataForm.parentName"
        ></el-region-tree>
      </el-form-item>
      <el-form-item prop="name" label="区域名称">
        <el-input v-model="dataForm.name" placeholder="区域名称"></el-input>
      </el-form-item>
      <el-form-item prop="id" label="区域标识">
        <el-input v-model="dataForm.id" :disabled="!insert" placeholder="区域标识"></el-input>
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
import debounce from "lodash/debounce";
export default {
  data() {
    return {
      visible: false,
      insert: true,
      regionList: [],
      regionListVisible: false,
      dataForm: {
        id: "",
        name: "",
        pid: "0",
        parentName: "",
        sort: 0
      }
    };
  },
  computed: {
    dataRule() {
      return {
        id: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
        name: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
        sort: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
      };
    }
  },
  methods: {
    init(id) {
      this.insert = true;
      this.visible = true;
      this.dataForm.pid = "0";
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        this.dataForm.id = id;
        if (this.dataForm.id) {
          this.insert = false;
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      this.$http({
        url: this.$http.adornUrl(`/sys/region/info/${this.dataForm.id}`),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.dataForm = {
            ...this.dataForm,
            ...res.data
          };
          this.$refs.regionListTree.setCurrentKey(this.dataForm.pid);
        })
        .catch(() => {});
    },
    // 表单提交
    dataFormSubmitHandle: debounce(
      function() {
        this.$refs["dataForm"].validate(valid => {
          if (!valid) {
            return false;
          }
          this.$http({
            url: this.$http.adornUrl(
              `/sys/region/${this.insert ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData(this.dataForm)
          })
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            })
            .catch(() => {});
        });
      },
      1000,
      { leading: true, trailing: false }
    )
  }
};
</script>

<style lang="scss">
.mod-sys__region {
  .region-list {
    .el-input__inner,
    .el-input__suffix {
      cursor: pointer;
    }
  }
}
</style>
