<template>
  <el-dialog :visible.sync="value" title="转让" :before-close="dialogClose" :close-on-click-modal="false" width="500px" height="500px" :lock-scroll="false" :modal-append-to-body="false">
    <el-form size="small" ref="form" :model="form">
      <el-form-item label="转让人" style="text-align:left" prop="approvalId" :rules="[{ required: true, message: '转让人不可为空', trigger: 'change' }]">
        <ChooseUser v-model="form.approvalId" placeholder="请选择转让人" style="width:300px"></ChooseUser>
      </el-form-item>
    </el-form>
    <div style="margin-top: 20px">
      <el-button size="small" @click="dialogClose">关闭</el-button>
      <el-button size="small" type="primary" v-debounce="returnClick">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateApprovalId } from "@/api/index.js";
import ChooseUser from '@/components/ChooseUser/index.vue'
export default {
  name: "TransferDialog",
  props: ["value", "type", "relationshipId", "showIssue", "idData", 'approvalProcessVoList'],
  data() {
    return {
      form: {
        returnContent: "", //审批意见
        approvalId: "",//退回人
      },
      approveList: []
    };
  },
  components: { ChooseUser },
  methods: {
    dialogClose() {
      this.$emit("input", false);
    },
    returnClick() {
      if (!this.$validate('form')) return
      let param = {
        approvalId: this.form.approvalId,
        id: this.idData.id,
      }
      this.submit(param, "success");
    },
    submit(data, state) {
      let success = (res) => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.$emit("success", state);
          this.dialogClose();
        } else {
          this.$message.error(res.msg || "操作失败");
        }
      };
      updateApprovalId(data).then(success);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .w-e-text {
  text-align: left;
}
</style>
