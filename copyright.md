# upload的使用


1. 引入地址: import upload from '@/components/el-upload/el-upload'
2. 使用方式： 
- 标签：  <upload v-bind="tasklookForms.files" @changeFileList="getFileList" />
- data 数据 ： tasklookForms： {
    files: {
        files: [],
        uploadbtnshow: true, // false 是否显示上传按钮 多用于查看
        limit: 1 // 最大传入数
    }
}

3. 事件： changeFileList会在每次上传 /删除成功后返回 fileList 数组 [{name: '附件1', url: 'http://www.bxxxxx.com'}]