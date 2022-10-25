<template>
  <el-dialog :visible.sync="value" title="批量转让" :before-close="dialogClose" :close-on-click-modal="false" width="80%" height="700px" :lock-scroll="false" :modal-append-to-body="false">
    <el-form size="small" ref="form" :model="form">
      <el-form-item label="转让人" style="text-align:left" prop="approvalId" :rules="[{ required: true, message: '转让人不可为空', trigger: 'change' }]">
        <ChooseUser v-model="form.approvalId" placeholder="请选择转让人" style="width:300px"></ChooseUser>
      </el-form-item>
    </el-form>
    <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;" @selection-change="handleSelectionChange">
      <el-table-column label="选择" type="selection" width="80"></el-table-column>
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
    </el-table>
    <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form2.pageSize" :current-page="form2.pageNum" :total="total"></el-pagination>

    <div style="margin-top: 20px">
      <el-button size="small" @click="dialogClose">关闭</el-button>
      <el-button size="small" type="primary" v-debounce="returnClick">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { batchUpdateApprovalId, getHomePage } from "@/api/index.js";
import { BusinessType, ApprovalStatus, ApprovalType } from '@/utils/field.js'
import ChooseUser from '@/components/ChooseUser/index.vue'
import E from "wangeditor";
export default {
  name: "TransferDialog",
  props: ["value", "type", "relationshipId", "showIssue", "idData", 'approvalProcessVoList'],
  data() {
    return {
      form: {
        approvalId: "",//退回人
      },
      form2: {
        pageNum: 1,          //页码
        pageSize: 10,
        approvalStatus: '',//              审批状态(0.未提交,1.审批中,2.审批通过,3.审批未通过,4.已撤销)
        submitTime: '',//              提交时间
        search: '',//              搜索条件
        state: 0,//              0.审批 1.抄送 2.已处理 3.我提交的
        type: 3,//              类型(0.需求审批,1.付款审批)
      },
      approveList: [],
      BusinessType: BusinessType,
      ApprovalStatus: ApprovalStatus,
      ApprovalType: ApprovalType,
      list: [],
      total: 0,
      selectList: []
    };
  },
  components: { ChooseUser },
  mounted() {
    this.getList()
  },
  methods: {
    handleSelectionChange(val) {
      this.selectList = val
    },
    getList() {
      getHomePage(this.form2).then(res => {
        if (res.code != 200) return
        this.list = res.data.records || []
        this.total = res.data.total
      })
    },
    handleSizeChange(val) {
      this.form2.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.form2.pageNum = val
      this.getList()
    },
    dialogClose() {
      this.$emit("input", false);
    },
    returnClick() {
      if (!this.$validate('form')) return
      if (this.selectList && this.selectList.length == 0) {
        this.$message.error('请选择回单')
        return
      }
      let user = JSON.parse(sessionStorage.getItem("user"));
      let param = []
      this.selectList.forEach(item => {
        param.push({
          approvalId: this.form.approvalId,
          id: item.approvalProcessList.find((item) => {
            return (
              item.approvalId == user.id &&
              (item.operationType == 0 || item.operationType == 2)
            );
          }).id
        })
      })
      this.submit(param, "success");
    },
    submit(data, state) {
      let success = (res) => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.dialogClose();
          this.$emit("success", state);
        } else {
          this.$message.error(res.msg || "操作失败");
        }
      };
      batchUpdateApprovalId(data).then(success);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .w-e-text {
  text-align: left;
}
</style>
