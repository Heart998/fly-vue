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
      label-width="110px"
    >
      <el-row align="middle">
        <el-col>
          <div class="row-header">基本信息</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="员工姓名" prop="realName" >
            <el-input v-model="dataForm.realName" placeholder="员工姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- 
          <el-form-item label="员工工号" prop="usercode">
            <el-input v-model="dataForm.usercode" placeholder="员工工号"></el-input>
          </el-form-item> 
          -->
          <el-form-item label="员工工号" prop="userName">
            <el-input v-model="dataForm.userName" placeholder="员工工号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <!-- 
          <el-form-item label="员工工号" prop="userName">
            <el-input v-model="dataForm.userName" placeholder="员工工号"></el-input>
          </el-form-item> 
          -->
          <el-form-item label="所属部门" prop="deptId">
            <treeselect
              style="line-height:18px;"
              v-model="dataForm.deptId" 
              :options="deptList" 
              :normalizer="deptNormalizer"
              :disable-branch-nodes="true"
              :max-height="200"
              placeholder="选择所属部门" 
              @select="deptSelect"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登录密码" prop="password" :class="{ 'is-required': !dataForm.id }">
            <el-input v-model="dataForm.password" type="password" placeholder="登录密码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="dataForm.mobile" placeholder="手机号码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电子邮箱" prop="email">
            <el-input v-model="dataForm.email" placeholder="电子邮箱"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用工性质" prop="workType">
            <el-select v-model="dataForm.workType" placeholder="用工性质" clearable class="input-with-select">
              <el-option key="ht" label="劳动合同" value="ht"></el-option>
              <el-option key="dl" label="代理合同" value="dl"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="dataForm.idCard" placeholder="身份证号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="入司时间" prop="entryTime">
            <el-date-picker :picker-options="patchDayPickerOptions" v-model="dataForm.entryTime" type="date" placeholder="请选择入司时间" value-format="yyyy-MM-dd" format="yyyy-MM-dd" class="input-with-select"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="担任联系人时间" prop="startTime">
            <el-date-picker :picker-options="patchDayPickerOptions" v-model="dataForm.startTime" type="date" placeholder="请选择担任联系人时间" value-format="yyyy-MM-dd" format="yyyy-MM-dd" class="input-with-select"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="gender" label="用户性别">
            <el-radio-group v-model="dataForm.gender">
              <el-radio :label="0">男</el-radio>
              <el-radio :label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户状态" size="mini" prop="status">
            <el-radio-group v-model="dataForm.status">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="false">
        <el-col :span="12">
          <el-form-item label="用户身份" prop="usertype">
            <el-radio-group v-model="dataForm.usertype">
              <el-radio :label="0">普通员工</el-radio>
              <el-radio :label="1">上级</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责部门" prop="deptIdList" v-if="dataForm.usertype === 1">
            <treeselect
              style="line-height:18px;"
              :multiple="true"
              v-model="dataForm.deptIdList" 
              :options="deptList" 
              :normalizer="deptNormalizer"
              :max-height="200"
              value-consists-of="ALL"
              placeholder="选择负责部门" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="排序号">
            <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row align="middle">
        <el-col>
          <div class="row-header">权限信息</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="角色分配" prop="roleIdList">
            <el-select v-model="dataForm.roleIdList" multiple placeholder="选择角色" class="input-with-select">
              <el-option v-for="role in roleList" :key="role.roleId" :label="role.roleName" :value="role.roleId">
                <span style="float: left">{{ role.roleName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px; margin-right: 20px;">{{ role.deptName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="数据授权" prop="deptIdList">
            <treeselect
              style="line-height:18px;"
              :multiple="true"
              :flat="false"
              v-model="dataForm.deptIdList" 
              :options="deptList" 
              :normalizer="deptNormalizer"
              :max-height="200"
              value-consists-of="ALL"
              placeholder="数据授权" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="岗位分配" prop="postIdList">
            <el-select v-model="dataForm.postIdList" multiple placeholder="选择岗位" class="input-with-select">
              <el-option v-for="post in postList" :key="post.postId" :label="post.postName" :value="post.postId">
                <span style="float: left">{{ post.postName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px; margin-right: 20px;">{{ post.deptName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col>
          <el-form-item label="包含条线" prop="lineList">
            <template>
              <el-table
                :data="dataForm.lineList"
                border
                size="mini"
                height="150"
                style="width:100%;">
                <el-table-column type="index" label="序号" width="50" fixed></el-table-column>
                <el-table-column label="所属部门" header-align="center">
                  <template slot-scope="scope">
                    <treeselect
                      v-model="scope.row.deptId"
                      style="line-height:18px;"
                      :z-index="9999"
                      :append-to-body="true"
                      :disable-branch-nodes="true"
                      :options="deptList" 
                      :normalizer="deptNormalizer"
                      :max-height="200"
                      placeholder="选择所属部门" />
                  </template>
                </el-table-column>
                <el-table-column label="所属条线" header-align="center">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.lineId" placeholder="选择所属条线" class="input-with-select">
                      <el-option v-for="line in lineList" :key="line.id" :label="line.name" :value="line.id"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="deleteListRow(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="row-item">
                <el-button size="mini" type="primary" @click="addListRow()" icon="el-icon-plus">添加</el-button>
              </div>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="buttonLoading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isEmail, isMobile } from '@/utils/validate'
export default {
  data () {
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (this.dataForm.password !== value) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (value && !isEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (value && !isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      buttonLoading: false,
      roleList: [],
      deptList: [],
      postList: [],
      allDeptList: [],
      lineList: [],
      dataForm: {
        id: 0,
        userName: '',
        usercode: '',
        usertype: 0,
        deptId: undefined,
        deptName: '',
        password: '',
        orderNum: 0,
        realName: '',
        gender: 0,
        salt: '',
        email: '',
        mobile: '',
        idCard: '',
        workType: '',
        workLevel: '',
        entryTime: '',
        startTime: '',
        roleIdList: [],
        deptIdList: [],
        postIdList: [],
        lineList: [],
        status: 1
      },
      dataRule: {
        userName: [
          { required: true, message: '登录账号不能为空', trigger: 'blur' }
        ],
        // usercode: [
        //   { required: true, message: '员工工号不能为空', trigger: 'blur' }
        // ],
        deptId: [
          { required: true, message: '所属部门不能为空', trigger: 'change' }
        ],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        realName: [
          { required: true, message: '员工姓名不能为空', trigger: 'blur' }
        ],
        email: [
          { required: false, message: '电子邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: false, message: '手机号码不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        workType: [
          { required: false, message: '用工性质不能为空', trigger: 'blur' }
        ]
      },
      patchDayPickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e6 // 选择今天以及今天以前的日期
        }
      }
    }
  },

  methods: {
    init (id) {
      this.visible = true
      this.buttonLoading = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.id = id || 0
        this.dataForm.deptId = undefined
        this.dataForm.deptIdList = []
        this.dataForm.roleIdList = []
        this.dataForm.postIdList = []
        this.dataForm.lineList = []
        Promise.all([this.getRoleList(), this.getDeptList(), this.getPostList(), this.getLineList()]).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm.userName = data.user.username
                this.dataForm.usercode = data.user.usercode
                this.dataForm.usertype = data.user.usertype
                this.dataForm.deptId = data.user.deptId
                this.dataForm.deptName = data.user.deptName
                this.dataForm.salt = data.user.salt
                this.dataForm.realName = data.user.realName
                this.dataForm.orderNum = data.user.orderNum
                this.dataForm.gender = data.user.gender
                this.dataForm.email = data.user.email
                this.dataForm.mobile = data.user.mobile
                this.dataForm.idCard = data.user.idCard
                this.dataForm.workType = data.user.workType
                this.dataForm.workLevel = data.user.workLevel
                this.dataForm.entryTime = data.user.entryTime
                this.dataForm.startTime = data.user.startTime
                this.dataForm.roleIdList = data.user.roleIdList
                this.dataForm.deptIdList = data.user.deptIdList
                this.dataForm.postIdList = data.user.postIdList
                this.dataForm.lineList = data.user.lineList
                this.dataForm.status = data.user.status
              }
            })
          }
        })
      })
    },
    // 获取角色列表
    getRoleList () {
      return this.$http({
        url: this.$http.adornUrl('/sys/role/select'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.roleList = data && data.code === 0 ? data.list : []
      }).catch(() => {})
    },
    // 获取部门列表
    getDeptList () {
      return this.$http({
        url: this.$http.adornUrl('/sys/dept/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.deptList = data && data.code === 0 ? data.data : []
      }).catch(() => {})
    },
    // 获取岗位列表
    getPostList () {
      return this.$http({
        url: this.$http.adornUrl('/sys/post/select'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.postList = data && data.code === 0 ? data.list : []
      }).catch(() => {})
    },
    // 获取条线列表
    getLineList () {
      return this.$http({
        url: this.$http.adornUrl('/sys/line/select'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.lineList = data && data.code === 0 ? data.list : []
      }).catch(() => {})
    },
    // 部门树形数据格式化
    deptNormalizer (node) {
      if (node.children && node.children.length > 0) {
        return {
          id: node.id,
          label: node.name,
          children: node.children
        }
      } else {
        return {
          id: node.id,
          label: node.name,
          children: undefined
        }
      }
    },
    selectDept (node) {
      console.log(node)
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.buttonLoading = true
          this.$http({
            url: this.$http.adornUrl(
              `/sys/user/${!this.dataForm.id ? 'save' : 'update'}`
            ),
            method: 'post',
            data: this.$http.adornData({
              userId: this.dataForm.id || undefined,
              username: this.dataForm.userName,
              usercode: this.dataForm.userName,
              usertype: this.dataForm.usertype,
              deptId: this.dataForm.deptId,
              password: this.dataForm.password,
              orderNum: this.dataForm.orderNum,
              salt: this.dataForm.salt,
              realName: this.dataForm.realName,
              gender: this.dataForm.gender,
              email: this.dataForm.email,
              mobile: this.dataForm.mobile,
              idCard: this.dataForm.idCard,
              workType: this.dataForm.workType,
              workLevel: this.dataForm.workLevel,
              entryTime: this.dataForm.entryTime,
              startTime: this.dataForm.startTime,
              status: this.dataForm.status,
              roleIdList: this.dataForm.roleIdList,
              deptIdList: this.dataForm.deptIdList,
              postIdList: this.dataForm.postIdList,
              lineList: this.dataForm.lineList
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.buttonLoading = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
              this.buttonLoading = false
            }
          })
        }
      })
    },
    deptSelect (node, instanceId) {
      this.$http({
        url: this.$http.adornUrl(`/sys/dept/line/${node.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        var list = data && data.code === 0 ? data.data : []
        list.forEach(item => {
          this.dataForm.lineList.push({
            id: undefined,
            deptId: item.deptId,
            lineId: item.lineId
          })
        })
      }).catch(() => {})
    },
    addListRow () {
      this.dataForm.lineList.push({
        id: undefined,
        deptId: undefined,
        lineId: undefined
      })
    },
    deleteListRow (index) {
      this.dataForm.lineList.splice(index, 1)
    }
  }
}
</script>
<style scoped>
  .input-with-select {
    width: 100%;
  }
  .row-header {
    font-weight: bold;
    font-size: 16px;
    color: #303133;
    margin-bottom: 10px;
  }
  .row-item {
    margin-top: 10px;
  }
</style>
