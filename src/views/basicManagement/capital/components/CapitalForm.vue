<template>
  <div>
    <div class="form-title">{{ editType | typeName }}资方信息</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基础信息" name="1">
        <Form1 ref="form1" :disabled="editType == 'show'"></Form1>
      </el-collapse-item>
      <el-collapse-item title="账户" name="2">
        <Form2 ref="form2" :disabled="editType == 'show'"></Form2>
      </el-collapse-item>
      <el-collapse-item title="联系人" name="3">
        <Form3 ref="form3" :disabled="editType == 'show'"></Form3>
      </el-collapse-item>
      <el-collapse-item title="文件" name="4">
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
import { addBackers, updateBackers, getBackersInfo } from "@/api/index.js";
import Form1 from "./Form1";
import Form2 from "./Form2";
import Form3 from "../../serviceProvider/components/Form3";
import Form4 from "./Form4";
export default {
  name: "CapitalForm",
  components: { Form1, Form2, Form3, Form4 },
  props: ["value", "editId", "editType"],
  data() {
    return {
      activeNames: ["1", "2", "3", "4"],
    };
  },
  mounted() {
    if (this.editId) {
      this.onload();
    }
  },
  methods: {
    onload() {
      getBackersInfo({ id: this.editId }).then((res) => {
        let result = res.data || {};
        this.$refs["form1"].onload(result);
        this.$refs["form2"].onload(result.accountTaxVoList);
        this.$refs["form3"].onload(result.contactsVoList);
        this.$refs["form4"].onload(result);
      });
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
      let accountTaxVoList = this.$refs["form2"].commit();
      let contactsVoList = this.$refs["form3"].commit();
      let form4 = this.$refs["form4"].commit();
      let data = { ...form, ...form4 };
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
        data.addContactsReqList = contactsVoList;
        data.addAccountTaxReqList = accountTaxVoList;
        addBackers(data).then(success);
      } else {
        data.updateContactsReqList = contactsVoList;
        data.updateAccountTaxReqList = accountTaxVoList;
        data.id = this.editId;
        updateBackers(data).then(success);
      }
    },
  },
};
</script>