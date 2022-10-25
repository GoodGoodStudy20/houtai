<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部" name="0"></el-tab-pane>
      <el-tab-pane label="待处理" name="1"></el-tab-pane>
      <el-tab-pane label="已处理" name="2"></el-tab-pane>
      <el-tab-pane label="我收到的" name="3"></el-tab-pane>
      <el-tab-pane label="我提交的" name="4"></el-tab-pane>
    </el-tabs>
    <div class="search-box">
      <el-form inline size="small">
        <el-form-item label="模糊搜索">
          <el-input v-model="form.search" placeholder="客户名称、提交人名称"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择" style="width:200px">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in ApprovalType" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批状态">
          <el-select v-model="form.approvalStatus" placeholder="请选择" style="width:200px">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in ApprovalStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker v-model="form.submitTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:150px"></el-date-picker>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click="handleCurrentChange(1)">搜索</el-button>
          <el-button type="primary" @click="batchTransfer">批量转让</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;">
      <el-table-column label="编号" align="left" width="220" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="table-text" @click="editDetail(scope.row.id, scope.row.state==0?'approve':'show',scope.row.type)">{{scope.row.number|| '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户" align="left" show-overflow-tooltip min-width="200">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.customerName||scope.row.payerName||''" placement="bottom">
            <span>{{scope.row.abbreviated||scope.row.payerAbbreviated||''}}-{{scope.row.channelName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="left" width="100">
        <template slot-scope="scope">
          {{ApprovalType[scope.row.type]?ApprovalType[scope.row.type].label:''}}
        </template>
      </el-table-column>
      <el-table-column label="业务类型" align="left" width="100">
        <template slot-scope="scope">
          {{BusinessType[scope.row.businessType]?BusinessType[scope.row.businessType].label:''}}
        </template>
      </el-table-column>
      <el-table-column prop="money" label="金额" header-align="right" align="right" width="140"></el-table-column>
      <el-table-column prop="createByName" label="提交人" align="left" width="120"></el-table-column>
      <el-table-column label="状态" align="left" width="140">
        <template slot-scope="scope">
          <span :style="{color:ApprovalStatus[scope.row.approvalStatus]?ApprovalStatus[scope.row.approvalStatus].color:'#000'}">{{ApprovalStatus[scope.row.approvalStatus]?ApprovalStatus[scope.row.approvalStatus].label:''}}</span>
          <span v-if="scope.row.approvalStatus==2 && scope.row.handleName" style="color:red;">({{scope.row.handleName}})</span>
        </template>
      </el-table-column>
      <el-table-column label="当前审批人" align="left" width="140">
        <template slot-scope="scope">
          {{scope.row.approvalStatus==1?scope.row.approvalName:'-'}}
        </template>
      </el-table-column>
      <el-table-column prop="submitTime" align="left" label="提交时间" width="160"></el-table-column>
      <el-table-column align="left" label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button type="text" icon="el-icon-view" style="color:#333" @click="editDetail(scope.row.id,'show',scope.row.type)">查看</el-button> -->
          <el-button type="text" @click="editDetail(scope.row.id,'approve',scope.row.type)" v-if="scope.row.state==0">处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total"></el-pagination>
    <TransferListDialog v-model="showTransferDialog" v-if="showTransferDialog" :type="3" @success="returnApproveSuccess"></TransferListDialog>

  </div>
</template>

<script>
import { BusinessType, ApprovalStatus, ApprovalType } from '@/utils/field.js'
import TransferListDialog from './TransferListDialog'
import { getHomePage } from '@/api/index'
export default {
  name: 'ApproveList',
  components: { TransferListDialog },
  data() {
    return {
      activeName: "0",
      form: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
        approvalStatus: '',//              审批状态(0.未提交,1.审批中,2.审批通过,3.审批未通过,4.已撤销)
        submitTime: '',//              提交时间
        search: '',//              搜索条件
        state: [],//              0.审批 1.抄送 2.已处理 3.我提交的
        type: '',//              类型(0.需求审批,1.付款审批)
      },
      list: [],
      total: 0,
      BusinessType: BusinessType,
      ApprovalStatus: ApprovalStatus,
      ApprovalType: ApprovalType,
      showTransferDialog: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    returnApproveSuccess() {
      this.getList()
    },
    batchTransfer() {
      this.showTransferDialog = true
    },
    handleClick() {
      let list = ['', 0, 2, 1, 3]
      if (this.activeName == 0) {
        this.form.state = []
      } else {
        this.form.state = [list[this.activeName]]
      }
      this.handleCurrentChange(1)
    },
    getList() {
      getHomePage(this.form).then(res => {
        if (res.code != 200) return
        this.list = res.data.records || []
        this.total = res.data.total
      })
    },
    handleSizeChange(val) {
      this.form.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.form.pageNum = val
      this.getList()
    },
    editDetail(id, editType, type) {
      this.$emit('input', 1)
      this.$emit('edit', id, editType, type)
    },
  }
}
</script>

<style>
</style>