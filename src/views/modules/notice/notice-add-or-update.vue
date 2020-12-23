<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="类型" prop="type">
          <el-dict-radio v-model="dataForm.type" dict-type="notice_type"></el-dict-radio>
      </el-form-item>
      <el-form-item label="标题"  prop="title">
          <el-input v-model="dataForm.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item prop="content" label="内容">
        <!-- 富文本编辑器, 容器 -->
        <div id="J_quillEditor" style="height:280px"></div>
        <!-- 自定义上传图片功能 (使用element upload组件) -->
        <el-upload
                :action="uploadUrl"
                :show-file-list="false"
                :before-upload="uploadBeforeUploadHandle"
                :on-success="uploadSuccessHandle"
                style="display: none;">
            <el-button ref="uploadBtn" type="primary" size="small">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="接收者" prop="receiverType">
          <el-radio-group v-model="dataForm.receiverType">
              <el-radio :label="0">全部</el-radio>
              <el-radio :label="1">部门</el-radio>
          </el-radio-group>
      </el-form-item>
      <el-form-item v-show="dataForm.receiverType == 1" size="mini" label="选择部门">
        <el-tree
            :data="deptList"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            ref="deptListTree"
            accordion
            show-checkbox>
        </el-tree>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="danger" @click="dataFormSubmitHandle(0)">保存草稿</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle(1)">发布通知</el-button>
    </template>
  </el-dialog>
</template>

<script>
import Cookies from 'js-cookie'
import debounce from 'lodash/debounce'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
export default {
  data () {
    return {
      visible: false,
      quillEditor: null,
      quillEditorToolbarOptions: [
        ['bold', 'italic', 'underline', 'strike'],
        ['image'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
      ],
      uploadUrl: '',
      deptList: [],
      dataForm: {
        id: '',
        type: 0,
        title: '',
        content: '',
        receiverType: 0,
        receiverTypeIds: '',
        receiverTypeList: [],
        status: '',
        senderName: '',
        senderDate: ''
      }
    }
  },
  computed: {
    dataRule () {
      var validateContent = (rule, value, callback) => {
        if (this.quillEditor.getLength() <= 1) {
          return callback(new Error('必填项不能为空'))
        }
        callback()
      }
      return {
        type: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '必填项不能为空', trigger: 'blur' },
          { validator: validateContent, trigger: 'blur' }
        ],
        receiverType: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        receiverTypeIds: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        senderName: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        if (this.quillEditor) {
          this.quillEditor.deleteText(0, this.quillEditor.getLength())
        } else {
          this.quillEditorHandle()
        }
        this.$refs['dataForm'].resetFields()
        this.$refs.deptListTree.setCheckedKeys([])
        Promise.all([
          this.getDeptList()
        ]).then(() => {
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      })
    },
    // 富文本编辑器
    quillEditorHandle () {
      this.quillEditor = new Quill('#J_quillEditor', {
        modules: {
          toolbar: this.quillEditorToolbarOptions
        },
        theme: 'snow'
      })
      // 自定义上传图片功能 (使用element upload组件)
      this.uploadUrl = this.$http.adornUrl(`/sys/oss/upload?token=${this.$cookie.get("token")}`)

      this.quillEditor.getModule('toolbar').addHandler('image', () => {
        this.$refs.uploadBtn.$el.click()
      })
      // 监听内容变化，动态赋值
      this.quillEditor.on('text-change', () => {
        this.dataForm.content = this.quillEditor.root.innerHTML
      })
    },
    // 上传图片之前
    uploadBeforeUploadHandle (file) {
      if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
        this.$message.error('只支持jpg、png、gif格式文件！')
        return false
      }
    },
    // 上传图片成功
    uploadSuccessHandle (res, file, fileList) {
      if (res.code !== 0) {
        return this.$message.error(res.msg)
      }
      this.quillEditor.insertEmbed(this.quillEditor.getSelection().index, 'image', res.url)
    },
    // 获取部门列表
    getDeptList () {
      return this.$http({
        url: this.$http.adornUrl("/sys/dept/list"),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deptList = res.data
      }).catch(() => {})
    },
    // 获取信息
    getInfo () {
      this.$http({
        url: this.$http.adornUrl(`/sys/notice/${this.dataForm.id}`),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }

        this.quillEditor.root.innerHTML = this.dataForm.content

        // 接受者为部门
        if (this.dataForm.receiverType === 1) {
          this.$refs.deptListTree.setCheckedKeys(res.data.receiverTypeIds.split(','))
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function (status) {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        // 接受者为部门
        if (this.dataForm.receiverType === 1) {
          this.dataForm.receiverTypeIds = this.$refs.deptListTree.getCheckedKeys().join(',')
          this.dataForm.receiverTypeList = this.$refs.deptListTree.getCheckedKeys()
        } else {
          this.dataForm.receiverTypeIds = ''
        }
        this.dataForm.status = status
        this.$http({
            url: this.$http.adornUrl(`/sys/notice/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData(this.dataForm)
        }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
