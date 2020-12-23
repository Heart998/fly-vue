<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="90px">
    <el-form-item label="岗位名称" prop="postName">
      <el-input v-model="dataForm.postName" placeholder="岗位名称" @change="getPostCodeByName"></el-input>
    </el-form-item>
    <el-form-item label="岗位编码" prop="postCode">
      <el-input v-model="dataForm.postCode" placeholder="岗位编码"></el-input>
    </el-form-item>
    <el-form-item label="岗位分类" prop="postType">
      <el-select v-model="dataForm.postType" clearable placeholder="选择岗位分类" class="input-with-select">
        <el-option :label="data.dictLabel" v-for="data in postTypeList" :key="data.dictValue" :value ="data.dictValue"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="deptName" label="所属机构" class="dept-list">
      <el-popover v-model="deptListVisible" ref="deptListPopover" placement="bottom-start" trigger="click">
        <el-tree
          class="dept-listtree"
          :data="deptList"
          :props="{ label: 'name', children: 'children' }"
          node-key="id"
          ref="deptListTree"
          :highlight-current="true"
          :expand-on-click-node="false"
          accordion
          @current-change="deptListTreeCurrentChangeHandle">
        </el-tree>
      </el-popover>
      <el-input v-model="dataForm.deptName" v-popover:deptListPopover :readonly="true" placeholder="请选择所属机构"></el-input>
    </el-form-item>
    <el-form-item label="备注信息" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注信息"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        deptListVisible: false,
        deptList: [],
        postTypeList: [],
        dataForm: {
          postId: 0,
          postName: '',
          postCode: '',
          postType: '',
          remark: '',
          deptId: '',
          deptName: ""
        },
        dataRule: {
          postName: [
            { required: true, message: '岗位名称不能为空', trigger: 'blur' }
          ],
          postCode: [
            { required: true, message: '岗位编码不能为空', trigger: 'blur' }
          ],
          postType: [
            { required: true, message: '岗位分类不能为空', trigger: 'blur' }
          ],
          deptName: [
            { required: true, message: '所属机构不能为空', trigger: 'change' }
          ]
        }
      }
    },
    created() {
      this.getPostTypeList()
    },
    methods: {
      init (id) {
        this.dataForm.postId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.getDeptList().then(() => {
              if (this.dataForm.postId) {
              this.$http({
                url: this.$http.adornUrl(`/sys/post/info/${this.dataForm.postId}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.dataForm.postName = data.sysPost.postName
                  this.dataForm.postCode = data.sysPost.postCode
                  this.dataForm.postType = data.sysPost.postType + ''
                  this.dataForm.remark = data.sysPost.remark
                  this.dataForm.deptId = data.sysPost.deptId
                  this.dataForm.deptName = data.sysPost.deptName
                }
              })
            }
          })
        })
      },
      // 获取部门列表
      getDeptList () {
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
          this.deptList = res.data
        }).catch(() => {})
      },
      // 上级部门树, 选中
      deptListTreeCurrentChangeHandle (data) {
        this.dataForm.deptId = data.id
        this.dataForm.deptName = data.name
        this.deptListVisible = false
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/post/${!this.dataForm.postId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'postId': this.dataForm.postId || undefined,
                'postName': this.dataForm.postName,
                'postCode': this.dataForm.postCode,
                'postType': this.dataForm.postType,
                'remark': this.dataForm.remark,
                'deptId': this.dataForm.deptId
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      getPostTypeList(){
        this.postTypeList = this.getDictDataList('post_type');
      },
      getPostCodeByName(val){
        if(val){
          this.$http({
            url: this.$http.adornUrl(`/sys/pinyin`),
            method: 'get',
            params: this.$http.adornParams({
              text: val
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              if(data.data){
                this.dataForm.postCode = data.data
              }
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .input-with-select {
    width: 100%;
  }
  .dept-list {
    .el-input__inner,
    .el-input__suffix {
      cursor: pointer;
    }
  }
  .dept-listtree{
    min-width: 250px;
    max-height: 350px;
    overflow-y: auto;
  }
</style>

