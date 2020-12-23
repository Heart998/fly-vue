<template>
  <div>
    <el-form :model="forms" :inline="true" label-width="110px">
        
      <h3 class="form_h3_title"><div class="line_type_shu"></div>基本信息</h3>
      <el-row>
        <el-form-item label="考核人:">
          <div class="lookdiv">{{forms.realName}}</div>
        </el-form-item>
        <el-form-item label="考核条线:">
          <div class="lookdiv">{{forms.lineName}}</div>
        </el-form-item>
        <el-form-item label="任务起始时间:">
          <div class="lookdiv">{{forms.startTime}}</div>
        </el-form-item>
        <el-form-item label="任务截至时间:">
          <div class="lookdiv">{{forms.endTime}}</div>
        </el-form-item>
        <el-form-item label="任务发起人:">
          <div class="lookdiv">{{forms.initiator}}</div>
        </el-form-item>
        <el-form-item label="任务发起部门:">
          <div class="lookdiv">{{forms.deptName}}</div>
        </el-form-item>

        <el-col :span="24">
          <el-form-item label="任务名称:" class="flex-box children_flex">
            <div>{{forms.name}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="查看附件:" class="flex-box children_flex">
            <upload v-bind="forms.files" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="任务说明:" class="flex-box children_flex">
            <el-input v-model="forms.description" disabled class="noborder" type="textarea"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template> 

<script>
import upload from '@/components/el-upload/el-upload'
import { getBaseInfo } from '@/api/task-processing'

export default {
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  components: {
    upload,
  },
  data() {
    return {
      forms: {
        name: '',
        realName: '',
        lineName: '',
        startTime: '',
        endTime: '',
        initiator: '',
        deptName: '',
        description: '',
        files: {
          files: [],
          uploadbtnshow: false,
        },
      },
    }
  },
  methods: {
    getBaseInfoFn(id) {
      getBaseInfo({id}).then((res) => {
        let data = res.data
        if (data.code === 0 && data.msg === 'success') {
            this.$emit('getBaseInfoHxData', data.task)
          this.forms.name = data.task.name
          this.forms.realName = data.task.realName
          this.forms.lineName = data.task.lineName
          this.forms.startTime = data.task.startTime
          this.forms.endTime = data.task.endTime
          this.forms.initiator = data.task.initiator
          this.forms.deptName = data.task.deptName
          this.forms.description = data.task.description
          let files = data.task.files
          if (files&& files !== null && files.length !== undefined && files.length > 0) {
            files = files.map((item) => {
              return {
                name: item.fileName,
                url: item.fileUrl,
              }
            })
            this.forms.files.files = files
          }
        }
      })
    },
  },
  created() {
    this.getBaseInfoFn(this.id)
  },
}
</script>

<style>
</style>