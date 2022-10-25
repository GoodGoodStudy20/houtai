<template>
  <el-dialog
    :visible.sync="value"
    title="编辑抄送人"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    width="340px"
  >
    <el-form size="mini" label-width="auto">
      <el-form-item label="节点名称">
        <el-input v-model="form.name" :disabled="editType == 'CC'"></el-input>
      </el-form-item>
      <el-form-item label="抄送人">
        <ChooseUser
          v-model="form.approvalId"
          :multiple="editType == 'CC'"
          @setName="setUserName"
        ></ChooseUser>
      </el-form-item>
    </el-form>
    <el-button size="mini" type="primary" @click="submit">保存</el-button>
  </el-dialog>
</template>

<script>
import ChooseUser from "@/components/ChooseUser/index.vue";
import {
  addApprovalProcessConfig,
  updateApprovalProcessConfig,
} from "@/api/index.js";
export default {
  name: "Form1",
  components: { ChooseUser },
  props: ["value", "item", "editType"],
  data() {
    return {
      form: {
        approvalId: "", //审批人
        isSkip: 0, //是否跳过(0.否,1.是)
        name: "", //名称
        remark: "", //备注
      },
    };
  },
  created() {
    Object.assign(this.form, this.item);
  },
  methods: {
    dialogClose() {
      this.$emit("input", false);
    },
    setUserName(nameStr) {
      this.form.approvalName = nameStr;
    },
    submit() {
      this.$message.success("操作成功");
      this.$emit("success", this.form);
      this.dialogClose();
    },
  },
};
</script>

<style>
</style>