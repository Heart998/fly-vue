<template>
    <div class="mod-sys__problem">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button v-if="isAuth('biz:commonproblemclassify:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        </el-form-item>
      </el-form>
      
      <el-table v-loading="dataListLoading" :data="dataList" row-key="id" border style="width: 100%;">
        <el-table-column prop="name" label="负面清单名称" header-align="center" min-width="150"></el-table-column>
        <el-table-column prop="code" label="负面清单代码" header-align="center" align="left" width="150"></el-table-column>
        <el-table-column prop="level" label="负面清单分类" header-align="center" align="center" width="100">
           <template slot-scope="scope">
             {{ getLevelLabel(scope.row.level) }}
          </template>
        </el-table-column>
        <el-table-column prop="riskLevel" label="风险等级" header-align="center" align="center" width="150">
            <template slot-scope="scope">
             {{ getRiskLevelLabels(scope.row.riskLevel) }}  
          </template>

        </el-table-column>
        
        <el-table-column prop="lineNames" label="主责条线" header-align="center" align="center" width="150">
            <!-- <template slot-scope="scope">
            {{ getMainLine(scope.row.lines) }} 
            </template> -->
        </el-table-column>
        <el-table-column prop="postNames" label="主责岗位" header-align="center" align="center" width="150">
            <!-- <template slot-scope="scope">
            {{ getMainPosts(scope.row.posts) }} 
            </template> -->
        </el-table-column>
        <!-- <el-table-column prop="parentName" label="上级分类" header-align="center" align="center"></el-table-column> -->
        <el-table-column prop="description" label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="isAuth('biz:commonproblemclassify:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
            <el-button v-if="isAuth('biz:commonproblemclassify:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './problem-add-or-update'
import { getTX } from '@/api/common/index.js'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/biz/commonproblemclassify/list',
        deleteURL: '/biz/commonproblemclassify/delete'
      },
      DicLineArr: [],
      dataForm: {
        type: '1'
      }
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDic()
  },
  methods: {

    getRiskLevelLabels (key) {
      let lable
      if (key) {
        switch (key) {
          case '1':
            lable = '高'
            break
          case '2':
            lable = '中'
            break
          case '3':
            lable = '低'
            break
        }
      }
      return lable
    },

    getLevelLabel (key) {
      let lable
      if (key) {
        switch (key) {
          case 1:
            lable = '类别1'
            break
          case 2:
            lable = '类别2'
            break
          case 3:
            lable = '类别3'
            break
          case 4:
            lable = '类别4'
            break
          case 5:
            lable = '负面清单'
            break
        }
      }
      return lable
    },
    getMainLine (lines) {
      if(lines){
        let a = ''
        let arr = []
        this.DicLineArr.map((item) => {
          for (let i = 0; i < lines.length; i++) {
            if (lines[i] === item.id) {
              a = item.name
              arr.push(a)
            }
          }
          a = arr.join(';')
        })
        return a
      }
      return '';
    },
    getMainPosts (posts) {
      if(posts){
         return posts.join(';')
      }
      return '';
    },
    getDic () {
      getTX().then((res) => {
        if (res.data.code === 0 && res.data.msg === 'success') {
          this.DicLineArr = res.data.list
        }
      }) // 条线字典
    }
  }
}
</script>
