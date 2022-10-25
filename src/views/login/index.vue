<template>
  <div class="bg-login">
    <div class="login-container">
      <div class="title-container">CII欢迎您！</div>
      <el-form
        ref="loginForm"
        :model="form"
        :rules="rules"
        label-position="top"
        class="login-box"
      >
        <div class="tit-box">账号</div>
        <el-input
          type="text"
          placeholder="请输入账号"
          maxlength="11"
          v-model.trim="form.phone"
          @keyup.enter.native="subLogin"
        />
        <div class="tit-box">密码</div>
        <el-input
          type="password"
          placeholder="请输入密码"
          v-model.trim="form.sysPwd"
          @keyup.enter.native="subLogin"
          show-password
        />
        <div style="margin-top: 140px">
          <el-button
            type="primary"
            style="width: 100%; border-radius: 12px"
            :disabled="!form.phone || !form.sysPwd"
            v-debounce="subLogin"
            >立即登录</el-button
          >
        </div>
      </el-form>
    </div>
    <div class="statement">
      Copyright @ 2021 共幸科技（深圳）有限公司
      <a href="https://beian.miit.gov.cn" target="_blank">粤ICP备20066053号</a>
    </div>
    <ChangePassword
      :show.sync="showChange"
      :sysId="userInfo.id"
    ></ChangePassword>
  </div>
</template>
<script>
import ChangePassword from "@/components/ChangePassword/index";
import { sysLogin, getRoleMenu } from "@/api/index";
import moment from "moment";
export default {
  name: "login",
  components: { ChangePassword },
  data() {
    return {
      form: {
        phone: "",
        sysPwd: "",
        // imageCode:'',
      },
      verfThrottling: false, //验证码节流控制
      imageCode: "", //验证码图片
      showChange: false, //修改密码
      rules: {
        phone: [{ required: true, message: "账号不可为空", trigger: "blur" }],
        sysPwd: [{ required: true, message: "密码不可为空", trigger: "blur" }],
      },
      userInfo: {},
    };
  },
  created() {
    if (sessionStorage.getItem("x-token")) {
      this.$router.push({ path: "/index" });
    }
  },
  methods: {
    subLogin() {
      if (!this.$validate("loginForm")) return;
      sysLogin(this.form).then(async (response) => {
        if (response.code == 200) {
          if (response.data.roleId == 0 || response.data.organizationOrg) {
            if (
              !response.data.pwdUpdateTime ||
              moment()
                .subtract(30, "days")
                .isSameOrAfter(response.data.pwdUpdateTime)
            ) {
              //30天强制修改密码
              this.userInfo = response.data || {};
              this.showChange = true;
              return;
            }
            sessionStorage.setItem("user", JSON.stringify(response.data));
            sessionStorage.setItem("x-token", response.data.accessToken);
            sessionStorage.setItem("orgId", response.data.organizationOrg);
            await this.getRoleMenu(response.data.roleId);
          } else {
            this.$message.error({
              title: "错误",
              message: "该账号暂未关联机构,请联系管理员关联机构后再开始使用",
              duration: 3500,
            });
          }
        } else {
          this.$message.error({
            title: "错误",
            message: response.msg,
            duration: 3500,
          });
        }
      });
    },
    async getRoleMenu(roleId) {
      await getRoleMenu({ roleId }).then((res) => {
        sessionStorage.setItem("menuList", JSON.stringify(res.data || []));
        let path = res.data[0].path
          ? res.data[0].path
          : res.data[0].child[0].path;
        this.$router.push({ path: path });
      });
    },
  },
};
</script>
<style scoped lang="scss">
.bg-login {
  height: 100%;
  background: url("../../assets/loginbj.png") no-repeat;
  background-position: center;
  // background-size: 100% 100%;
  background-size: cover;
  width: 100%;
  position: relative;
}
.login-container {
  position: absolute;
  width: 448px;
  height: 573px;
  right: 130px;
  top: calc(50% - 286px);
  background: rgba(222, 228, 255, 0.2);
  border: 1px solid #dee4ff;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 66px 39px 40px;
  box-sizing: border-box;
}
.title-container {
  text-align: left;
  font-weight: 900;
  font-size: 32px;
  line-height: 130%;
  color: #3a7dff;
  margin: 0;
}
.tit-box {
  color: #fff;
  margin: 30px 0 10px;
  font-weight: normal;
  font-size: 14px;
}
.statement {
  position: fixed;
  width: 100%;
  text-align: center;
  bottom: 20px;
  color: #808080;
  font-size: 12px;
  a {
    color: #808080;
  }
  a:hover {
    color: #0099ff;
  }
}
</style>