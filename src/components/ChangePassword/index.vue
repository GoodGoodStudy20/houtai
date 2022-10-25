<template>
  <el-dialog :destroy-on-close="true" title="修改密码" :visible.sync="show" :lock-scroll="false" :close-on-click-modal="false" width="440px" :before-close="dialogClose">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="原密码" prop="pwd">
        <el-input v-model="form.pwd" maxlength="16" placeholder="请输入原密码" style="width:280px;" type="password" show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="confirmPwd">
        <el-input v-model="form.confirmPwd" maxlength="16" placeholder="请输入新密码(字母数字组合)" style="width:280px;" type="password" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="newPwd">
        <el-input v-model="form.newPwd" maxlength="16" placeholder="请输入确认密码" style="width:280px;" type="password" show-password></el-input>
      </el-form-item>
      <el-button type="primary" v-debounce="changePwdSubmit">确认修改</el-button>
    </el-form>
  </el-dialog>
</template>

<script>
import { changePwd } from "@/api/index";
export default {
  name: 'ChangePassword',
  props: ['show', 'sysId'],
  data() {
    let checkPwd = (rule, value, callback) => {
      if (!/^(?=.*[a-zA-Z$@$!%*?&,.])(?=.*\d)[^]{8,16}$/.test(value)) {
        return callback(new Error("支持8-16个字符，至少包含一个字母和数字或特殊符号"));
      }
      callback();
    };
    return {
      rules: {
        pwd: [{ required: true, message: "原密码不能为空", trigger: "blur" }],
        confirmPwd: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { validator: checkPwd, trigger: "blur" },
        ],
        newPwd: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { validator: checkPwd, trigger: "blur" },
        ],
      },

      form: {
        pwd: '',
        confirmPwd: "",
        newPwd: "",
      },
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:show", false);
    },
    changePwdSubmit() {
      if (!this.$validate('form')) return
      if (this.form.confirmPwd == this.form.pwd) {
        this.$message.error({
          message: "新密码不能与原密码一致",
        });
        return
      }
      if (this.form.confirmPwd != this.form.newPwd) {
        this.$message.error({
          message: "两次密码不一致",
        });
        return false;
      }
      let headers = {}
      let form = JSON.parse(JSON.stringify(this.form));
      form.id = this.sysId
      changePwd(form, headers).then((response) => {
        if (response.code == 200) {
          this.dialogClose()
          this.$message({
            message: "修改成功，请稍后重新登录！",
            type: "success",
            duration: 1500,
          });
        } else {
          this.$message.error({
            message: response.msg || response.error_msg,
            duration: 1500,
          });
        }
      });
    },
  }
}
</script>

<style>
</style>