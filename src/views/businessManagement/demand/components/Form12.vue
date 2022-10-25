<template>
  <div>
    <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;" :header-cell-style="{'background-color':'#F4F8FF'}">
      <el-table-column label="渠道" prop="issueTime" align="left"></el-table-column>
      <el-table-column label="已开票总额（元）" prop="issueAmount" align="left"></el-table-column>
      <el-table-column label="已到账总额（元）" prop="issueAmount" align="left"></el-table-column>
      <el-table-column label="未到账总额（元）" prop="issueAmount" align="left"></el-table-column>
      <el-table-column label="可用委托总额（元）" prop="issueAmount" align="left"></el-table-column>
      <el-table-column label="已用委托（元）" prop="issueAmount" align="left"></el-table-column>
      <el-table-column label="剩余委托（元）" prop="issueAmount" align="left"></el-table-column>
      <el-table-column label="使用记录" prop="surplusAmount" align="left">
        <template slot-scope="scope">
          <span class="table-text" @click="handleDetail">查看明细</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { updateApproval, updateIssueStatus } from '@/api/index.js'
export default {
  name: 'Form12',
  data() {
    return {
      list: [
        { id: 1 }
      ]
    }
  },
  created() {
  },
  methods: {
    onload(obj) {
      this.list = obj.issueRecordVoList
    },
    handleDetail() {

    }
  }
}
</script>

<style>
</style>