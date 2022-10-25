<template>
  <div>
    <div class="form-title">{{ editType | typeName }}放款信息</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基础信息" name="1">
        <Form1
          ref="form1"
          :disabled="editType == 'show'"
          @payTypeChange="payTypeChange"
        ></Form1>
      </el-collapse-item>
      <el-collapse-item title="还款计划" name="3">
        <Form3
          ref="form3"
          :repaymentType="repaymentType"
          :disabled="editType == 'show'"
        ></Form3>
      </el-collapse-item>
      <el-collapse-item title="银行回单（建议上传图片）" name="2">
        <Form2 ref="form2" :disabled="editType == 'show'"></Form2>
      </el-collapse-item>
      <el-collapse-item title="放款合同" name="4">
        <Form4 ref="form4" :disabled="editType == 'show'"></Form4>
      </el-collapse-item>
    </el-collapse>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <!-- <el-button type="primary" v-debounce="submit" v-if="editType!='show'">保存</el-button> -->
      <el-button
        type="primary"
        v-debounce="submitBack"
        v-if="editType != 'show'"
        >保存返回</el-button
      >
    </div>
  </div>
</template>

<script>
import { addLoan, updateLoan, getLoanInfo } from "@/api/index.js";
import Form1 from "./Form1";
import Form2 from "./Form2";
import Form3 from "./Form3";
import Form4 from "./Form4";
export default {
  name: "LoanForm",
  components: { Form1, Form2, Form3, Form4 },
  props: ["value", "editId", "editType"],
  data() {
    return {
      activeNames: ["1", "2", "3", "4"],
      repaymentType: 1,
    };
  },
  mounted() {
    if (this.editId) {
      this.onload();
    }
  },
  methods: {
    onload() {
      getLoanInfo({ id: this.editId }).then((res) => {
        let result = res.data || {};
        this.repaymentType = Number(result.repaymentType);
        this.$refs["form1"].onload(result);
        this.$refs["form2"].onload(result);
        this.$refs["form4"].onload(result);
        this.$refs["form3"].onload(result.repaymentPlanVoList);
      });
    },
    payTypeChange(val) {
      this.repaymentType = val;
    },
    cancel() {
      this.$emit("input", 0);
    },
    submitBack() {
      this.submit("back");
    },
    submit(type) {
      let form = this.$refs["form1"].commit();
      if (!form) return;
      let form2 = this.$refs["form2"].commit();
      if (!form2) {
        this.$message.warning("请上传银行回单");
        return;
      }
      let form4 = this.$refs["form4"].commit();
      if (!form4) {
        this.$message.warning("请上传放款合同");
        return;
      }
      let form3 = this.$refs["form3"].commit();
      if (!form3 && form3.length == 0) {
        this.$message.warning("请填写还款计划");
        return;
      }
      let data = { ...form, ...form2, ...form4 };
      let success = (res) => {
        if (res.code != 200) {
          this.$message.error(res.msg || "操作失败");
          return;
        }
        this.$message.success("操作成功");
        if (type == "back") {
          this.cancel();
        }
      };
      if (this.editType == "add") {
        data.addRepaymentPlanReqList = form3;
        addLoan(data).then(success);
      } else {
        data.id = this.editId;
        data.updateRepaymentPlanReqList = form3;
        updateLoan(data).then(success);
      }
    },
  },
};
</script>
