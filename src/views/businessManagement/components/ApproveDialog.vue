<template>
  <el-dialog :visible.sync="value" :title="showIssue == 0 ? '审批' : showIssue == 1 ? '办理' : '确认下发'" :before-close="dialogClose" :close-on-click-modal="false" width="500px" height="500px" :lock-scroll="false" :modal-append-to-body="false">
    <div id="editor" style="width: 100%"></div>
    <div style="margin-top: 20px">
      <el-button size="small" @click="dialogClose">关闭</el-button>
      <el-button size="small" type="primary" v-debounce="passClick">{{
        showIssue == 0 ? "通过" : showIssue == 1 ? "确认办理" : "确认下发"
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
var editor = null;
import { updateApproval, updateIssueStatus } from "@/api/index.js";
import E from "wangeditor";
export default {
  name: "ApproveDialog",
  props: ["value", "type", "relationshipId", "showIssue", "idData"],
  data() {
    return {
      form: {
        evaluateContent: "", //审批意见
      },
    };
  },
  created() {
    Object.assign(this.form, this.idData);
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.form.evaluateContent) {
        this.form.evaluateContent = '同意'
      }
      editor = new E("#editor");
      editor.config.placeholder = "请输入审批意见";
      editor.model = "simple ";
      editor.config.menus = ["bold", "list", "foreColor"];
      editor.create();
      editor.txt.html(this.form.evaluateContent);
    });
  },
  methods: {
    dialogClose() {
      this.$emit("input", false);
    },
    passClick() {
      let data = {
        type: this.type,
        relationshipId: this.relationshipId,
        evaluateContent: editor.txt.html(),
        isApproval: 1, //是否审批通过(0.否,1.是)
        id: this.idData.id,
        name: this.idData.name,
        operationType: this.idData.operationType,
      };
      this.submit(data, "success");
    },
    failClick() {
      let data = {
        type: this.type,
        relationshipId: this.relationshipId,
        evaluateContent: editor.txt.html(),
        isApproval: 0, //是否审批通过(0.否,1.是)
        id: this.idData.id,
        name: this.idData.name,
        operationType: this.idData.operationType,
      };
      this.submit(data, "fail");
    },
    submit(data, state) {
      let success = (res) => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.$emit("success", state);
          this.dialogClose();
          if (this.showIssue == 2 && this.type == 0) {
            //确认下发
            updateIssueStatus({ id: this.relationshipId }).then(() => { });
          }
        } else {
          this.$message.error(res.msg || "操作失败");
        }
      };
      if ((this.type == 3 && this.idData.isUpdate == 1) || (this.type == 2 && this.idData.isUpdate == 1) || (this.type == 0 && this.idData.isUpdate == 1)) {
        this.$emit("success", data);
      } else {
        updateApproval(data).then(success);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .w-e-text {
  text-align: left;
}
</style>
