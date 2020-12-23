<template>
  <div>
    <el-upload style="margin-left: 10px"
               :class="{distop: !uploadbtnshow}"
               :multiple="false"
               :show-file-list="true"
               :file-list="files"
               :action="upload.url"
               :before-upload="beforeUploadHandle"
               :before-remove="beforeRemoveHandle"
               :on-preview="filePreviewHandle"
               :on-success="successHandle"
               :disabled="!uploadbtnshow"
               :limit="limit"
               :on-exceed="handleExceed">
      <el-button size="small"
                 type="primary"
                 v-if="uploadbtnshow">点击上传</el-button>
      <div class="el-upload__tip"
           style="color:red"
           v-if="uploadbtnshow"
           slot="tip">提示：仅允许导入“.jpg,.jpeg,.png,.gif,.pdf,.JPG,.JPEG,.GIF,.PDF,.xls,.docx,.doc,.xlsx,.ppt,.pptx,.zip,.rar”格式文件！</div>
    </el-upload>

  </div>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    files: {
      type: Array,
      default: []
    },
    uploadbtnshow: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 5
    }
  },
  data () {
    return {
      fileList: [],
      upload: {
        accept:
          '.jpg,.jpeg,.png,.gif,.pdf,.JPG,.JPEG,.GIF,.PDF,.xls,.docx,.doc,.xlsx,.ppt,.pptx,.zip,.rar',
        limit: 5,
        headers: { token: Vue.cookie.get('token') },
        url: ''
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.upload.url = this.$http.adornUrl(
        `/sys/oss/upload?token=${this.$cookie.get('token')}`
      )
    },
    // 上传之前
    beforeUploadHandle (file) {
      let a = true
      if (
        file.type !== 'image/jpg' &&
        file.type !== 'image/jpeg' &&
        file.type !== 'image/png' &&
        file.type !== 'image/gif' &&
        file.type !== 'application/pdf' &&
        file.type !== 'application/xls' &&
        file.type !== 'application/docx' &&
        file.type !== 'application/doc' &&
        file.type !== 'application/xlsx' &&
        file.type !== 'application/ppt' &&
        file.type !== 'application/pptx' &&
        file.type !== 'application/msword' &&
        file.type !== 'application/x-zip-compressed' &&
        file.type !==
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
        file.type !== 'application/vnd.ms-powerpoint' &&
        file.type !==
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' &&
        file.type !== 'application/vnd.ms-excel' &&
        file.type !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      {
        if(file.type === '' || file.type === undefined){
          if(file.name.indexOf(".rar")==-1){
            this.$message.error('不支持的类型！')
            a = false
          }
        }else{
            this.$message.error('不支持的类型！')
            a = false
        }
        
      }
      return a
    },
    // 查看图片
    filePreviewHandle (file) {
      console.log('preview handle', file)
      let fileUrl = file.url
      if (file.response)
      {
        fileUrl = file.response.url
      }
      if (fileUrl)
      {
        window.open(fileUrl)
      }
    },
    // 移除之前
    beforeRemoveHandle (file, fileList) {
      //"success"的附件在删除前提示，"ready"则直接删除
      if (file.status == "success")
      {
        this.$confirm('您确定要删除该文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            if (fileList.length === 1)
            {
              fileList.splice(0, 1)
              this.fileList = fileList
            } else
            {
              let delindex = null
              fileList.forEach((element, index) => {
                if (element.uid === file.uid)
                {
                  delindex = index
                }
              })
              fileList.splice(delindex, 1)
              this.fileList = fileList
            }
            this.changlist()
          })
          .catch(() => { })
      } else
      {
        if (fileList.length === 1)
        {
          fileList.splice(0, 1)
          this.fileList = fileList
        } else
        {
          let delindex = null
          fileList.forEach((element, index) => {
            if (element.uid === file.uid)
            {
              delindex = index
            }
          })
          fileList.splice(delindex, 1)
          this.fileList = fileList
        }
        this.changlist()
      }
      return false
    },
    // 上传成功
    successHandle (response, file, fileList) {
      if (response && response.code === 0)
      {
        this.fileList = fileList
        this.changlist()
      } else
      {
        this.$message.error(response.msg)
      }
    },
    // 超出限制
    handleExceed (files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    changlist () {
      let arr = this.fileList
      let arrt
      try
      {
        arrt = arr.map((item) => {

          if (item.response)
          {
            return {
              fileName: item.name,
              fileUrl: item.response.url
            }
          } else
          {
            return {
              fileName: item.name,
              fileUrl: item.url
            }
          }
        })
        this.$emit('changeFileList', arrt)
      } catch (error)
      {
        this.$message.error('系统繁忙')
      }
    }
  }
}
</script>

<style lang="scss">
.distop {
  position: relative;
  margin-left: 0 !important;
  .el-upload {
    display: none !important;
  }
  .el-upload-list {
    position: absolute;
    top: 0;
    margin-top: -6px;
  }
}
</style>