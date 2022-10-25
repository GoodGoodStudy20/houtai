<template>
  <div class="block-form">
    <el-table stripe :data="list" style="
        max-width: 100%;
        margin-top: 15px;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
      ">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column label="回单编号" align="left" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.returnMoneyApprovalVo && scope.row.returnMoneyApprovalVo.number}}</span>
        </template>
      </el-table-column>
      <el-table-column label="到账金额" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.returnMoneyApprovalVo && scope.row.returnMoneyApprovalVo.amount || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="到账时间" align="left" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.returnMoneyApprovalVo && scope.row.returnMoneyApprovalVo.returnMoneyDate}}</span>
        </template>
      </el-table-column>
      </el-table-column>

      <el-table-column label="抵消发票金额" prop="usedMoney" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.usedMoney || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="到账账户" align="left" show-overflow-tooltip>
        <template slot-scope="scope">
          {{
            scope.row.returnMoneyApprovalVo && scope.row.returnMoneyApprovalVo.accountTaxVo && scope.row.returnMoneyApprovalVo.accountTaxVo.account
          }}
        </template>
      </el-table-column>
      <el-table-column label="银行流水" prop="bankFlow" align="left">
        <template slot-scope="scope">
          {{
            scope.row.returnMoneyApprovalVo && scope.row.returnMoneyApprovalVo.bankFlow
          }}
        </template>
      </el-table-column>
      <el-table-column label="文件" align="left">
        <template slot-scope="scope">
          <span class="table-text" v-if="scope.row.returnMoneyApprovalVo && scope.row.returnMoneyApprovalVo.arrivalReceiptFile" @click="filePreviewImg( scope.row.returnMoneyApprovalVo.arrivalReceiptFile[0])">文件</span>
        </template>
      </el-table-column>
      <!-- arrivalReceiptFile -->
      </el-table-column>
      <!-- <el-table-column prop="createTime" align="center" label="录入时间" width="160"></el-table-column>
      <el-table-column label="录入人" prop="createByName" align="center"></el-table-column> -->
    </el-table>
    <el-image-viewer v-if="dialogVisibleImg" :on-close="onClose" :url-list="[dialogImageUrl]" :zIndex="20060" />
  </div>
</template>

<script>
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import { ApprovalStatus } from "@/utils/field.js";
import {
  deleteReturnMoneyApproval,
  getReturnMoneyApprovalPage,
  updateStatusReturnMoneyApproval,
} from "@/api/index.js";
import { Confirm } from "@/utils/common.js";
export default {
  name: "Form5",
  components: { ElImageViewer },
  props: ["value", "list"],
  data() {
    return {
      ApprovalStatus: ApprovalStatus,
      options1: ["增值税专用发票", "增值税普通发票"],
      options2: ["纸质", "电子"],
      status: ["正常", "撤销"],
      user: {},
      dialogVisibleImg: false,
      dialogImageUrl: "", // 图片路径
    };
  },
  methods: {
    editDetail(id, type) {
      this.$emit("input", 1);
      this.$emit("edit", id, type);
    },
    filePreviewImg(url) {
      if (url) {
        this.dialogImageUrl = url;
        this.dialogVisibleImg = true;
      }
    },
    // 图片关闭
    onClose() {
      this.dialogVisibleImg = false;
    },
  },
};
</script>

<style>
</style>