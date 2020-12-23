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
           slot="tip">提示：仅允许导入“.wav,.midi,.cda,.mp3,.wma,.mp4”格式文件！</div>
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
      default: 1
    }
  },
  data () {
    return {
      fileList: [],
      upload: {
        accept:
          '.wav,.midi,.cda,.mp3,.wma,.mp4',
        limit: 1,
        headers: { token: Vue.cookie.get('token') },
        url: ''
      },
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
      // console.log(file)
      //     var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
      //     const extension = testmsg === 'wav'
      //     const extension2 = testmsg === 'midi'
      //     const extension3 = testmsg === 'cda'
      //     const extension4 = testmsg === 'mp3'
      //     const extension5 = testmsg === 'wma'
      //     const extension6 = testmsg === 'mp4'
      //     // const isLt2M = file.size / 1024 / 1024 < 10
      //     if(!extension && !extension2 && !extension3 && !extension4 && !extension5 && !extension6) {
      //       this.$refs.editEnc.clearFiles();
      //         this.$notify({
      //             message: '上传文件只能是 xls、xlsx格式!',
      //             type: 'warning'
      //         });
      //         return false;
      //     }else{
      //       this.applyInfo.enc_cert_name = fileList[0].raw;
      //     }

      //     return extension || extension  || extension3  || extension4 || extension5 || extension6
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (
        testmsg !== 'wav' &&
        testmsg !== 'midi' &&
        testmsg !== 'cda' &&
        testmsg !== 'mp3' &&
        testmsg !== 'wma' &&
        testmsg !== 'mp4'
      )
      {
        this.$message.error('不支持的类型！')
        return false
      }
      return true
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
              console.log(fileList)
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
          console.log(fileList)
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
    // changlist() {
    //   let arr = this.fileList
    //   let arrt
    //   try {
    //     arrt = arr.map((item) => {

    //       if (item.response) {
    //         return {
    //           fileName: item.name,
    //           fileUrl: item.response.url
    //         }
    //       } else {
    //         return {
    //           fileName: item.name,
    //           fileUrl: item.url
    //         }
    //       }
    //     })
    //     this.$emit('changeFileList', arrt)
    //   } catch (error) {
    //     this.$message.error('系统繁忙')
    //   }
    // }
    changlist () {
      let arr = this.fileList
      let arrt = []
      if (arr.every(ite => ite.name !== ''))
      {
        arrt = arr.map((item) => {
          return {
            fileName: item.response.name,
            fileUrl: item.response.url
          }
        })
      }

      this.$emit('changeFileList', arrt)
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