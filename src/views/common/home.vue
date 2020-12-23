<template>
  <div class="mod-home">
    <el-row :gutter="10">
      <h4>{{season}} 季度</h4>
      <el-col :sm="6">
        <div class="ibox">
          <div class="ibox-content">
              <h5>总任务数</h5>
              <h1 class="no-margins el-icon-tickets" style="float: left;padding-top:6px;padding-right:10px;color: #f56c6c;"></h1>
              <h1 class="no-margins" style="color: #f56c6c;">{{countSum}}</h1>
          </div>
        </div>
      </el-col>
      <el-col :sm="6">
        <div class="ibox">
          <div class="ibox-content">
              <h5>待处理任务数</h5>
              <h1 class="no-margins el-icon-edit" style="float: left;padding-top:6px;padding-right:10px;color: #f56c6c;"></h1>
              <h1 class="no-margins" style="color: #f56c6c;">{{unSum}}</h1>
          </div>
        </div>
      </el-col>
      <el-col :sm="6">
        <div class="ibox">
          <div class="ibox-content">
              <h5>已处理任务数</h5>
              <h1 class="no-margins el-icon-success" style="float: left;padding-top:6px;padding-right:10px;color: #17b3a3;"></h1>
              <h1 class="no-margins" style="color: #17b3a3;">{{countSum - unSum}}</h1>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getChart } from '@/api/common/index'
  export default {
    data(){
      return{
        chart:[],
        countSum:0,
        unSum:0,
        season:''
      }
    },
    methods:{
      // 获取数据接口
      getData(){
        getChart().then((res)=>{
          console.log(res)
          this.chart = res.data.chart
          this.countSum = res.data.countSum
          this.unSum = res.data.unSum
          this.season = res.data.season
        })
      }
    },
    created(){
      this.getData();
    }
  }
</script>

<style>
  .mod-home {
    line-height: 1.5;
  }
  .ibox {
    clear: both;
    margin-top: 0;
    padding: 0;
    margin-bottom: 25px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    height: 100%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }
  .ibox-content {
    background-color: #ffffff;
    color: inherit;
    padding: 15px 20px 20px 20px;
    border-color: #e7eaec;
    -webkit-border-image: none;
    -o-border-image: none;
    border-image: none;
    border-style: solid solid none;
    border-width: 1px 0px;
    clear: both;
    cursor: pointer;
  }
  .ibox-content h1, .ibox-content h2, .ibox-content h3, .ibox-content h4, .ibox-content h5, .ibox-title h1, .ibox-title h2, .ibox-title h3, .ibox-title h4, .ibox-title h5 {
    margin-top: 5px;
  }
  .no-margins {
    margin: 0 !important;
  }
  
</style>