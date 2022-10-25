<template>
  <el-dialog :visible.sync="value" title="退回" :before-close="dialogClose" :close-on-click-modal="false" width="500px" height="500px" :lock-scroll="false" :modal-append-to-body="false">
    <el-form size="small" ref="form" :model="form">
      <el-form-item label="退回人" style="text-align:left" prop="returnId" :rules="[{ required: true, message: '退回人不可为空', trigger: 'change' }]">
        <el-select v-model="form.returnId" placeholder="请选择退回人" style="width:200px;">
          <el-option :label="item.name" :value="item.returnId" v-for="item in approveList" :key="item.returnId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- <el-input v-model="form.returnContent" type="textarea" :rows="5" placeholder="请输入退回原因"></el-input> -->
    <div id="editor" style="width:100%"></div>
    <div style="margin-top: 20px">
      <el-button size="small" @click="dialogClose">关闭</el-button>
      <el-button size="small" type="primary" v-debounce="returnClick">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
var editor = null
import { returnApproval, updateApproval } from "@/api/index.js";
import E from "wangeditor";
export default {
  name: "ReturnDialog",
  props: ["value", "type", "relationshipId", "showIssue", "idData", 'approvalProcessVoList'],
  data() {
    return {
      form: {
        returnContent: "", //审批意见
        returnId: "",//退回人
      },
      approveList: []
    };
  },
  created() {
    Object.assign(this.form, this.idData);
    let list = this.approvalProcessVoList.filter(item => {
      return (item.operationType == 0 || item.operationType == 2 || !item.approvalId) && item.isApproval == 1
    })
    let list2 = this.approvalProcessVoList
    list2.forEach((item, index) => {
      if (!item.approvalId) {
        if (item.approvalName.indexOf(`(提交人)`) > -1) {
          item.approvalName = item.approvalName
        } else {
          item.approvalName = item.approvalName + `(提交人)`
        }
        this.$set(item, 'id', new Date().getTime())
      }
    })
    list.forEach(item => {
      this.approveList.push({ returnId: item.id, name: item.approvalName })
    })
  },
  mounted() {
    this.$nextTick(() => {
      editor = new E("#editor");
      editor.config.placeholder = '请输入退回原因';
      editor.model = 'simple ';
      editor.config.menus = ['bold', 'list', 'foreColor']
      editor.create();
      editor.txt.html(this.form.returnContent)
    });
  },
  methods: {
    dialogClose() {
      this.$emit("input", false);
    },
    returnClick() {
      if (!this.$validate('form')) return
      let param
      if (this.approvalProcessVoList[0].id == this.form.returnId) {
        param = {
          type: this.type,
          relationshipId: this.relationshipId,
          evaluateContent: editor.txt.html(),
          isApproval: 0, //是否审批通过(0.否,1.是)
          id: this.idData.id,
          name: this.idData.name,
          operationType: this.idData.operationType,
        };
        this.submit2(param, "fail");
      } else {
        param = {
          returnContent: editor.txt.html(),
          returnId: this.form.returnId,
          id: this.idData.id,
        }
        this.submit(param, "success");
      }
      // if () {
      //   param = {
      //     type: this.type,
      //     relationshipId: this.relationshipId,
      //     evaluateContent: editor.txt.html(),
      //     isApproval: 0, //是否审批通过(0.否,1.是)
      //     id: this.idData.id,
      //     operationType: this.idData.operationType,
      //   };
      // }
      // this.submit(param, "success");
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
      returnApproval(data).then(success);
    },
    submit2(data, state) {
      let success = (res) => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.$emit("success", state);
          this.dialogClose();
        } else {
          this.$message.error(res.msg || "操作失败");
        }
      };
      updateApproval(data).then(success);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .w-e-text {
  text-align: left;
}
</style>
