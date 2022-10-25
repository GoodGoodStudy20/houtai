<template>
  <div class="block-form">
    <el-form size="small" inline :disabled="disabled" label-width="auto" ref="form" :model="form">
      <el-form-item label="公司名称" prop="name" :rules="[{ required: true, message: '公司名称不可为空', trigger: 'blur' }]">
        <el-input v-model="form.name" placeholder="请输入公司名称"></el-input>
      </el-form-item>
      <el-form-item label="税号" prop="dutyParagraph" :rules="[{ required: true, message: '税号不可为空', trigger: 'blur' }]">
        <el-input v-model="form.dutyParagraph" placeholder="请输入税号"></el-input>
      </el-form-item>
      <!-- <el-form-item label="联系电话">
        <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11"></el-input>
      </el-form-item> -->
      <el-form-item label="注册地址" prop="registeredAddress" :rules="[{ required: true, message: '注册地址不可为空', trigger: 'blur' }]">
        <el-input v-model="form.registeredAddress" placeholder="请输入注册地址" style="width:490px"></el-input>
      </el-form-item>
      <div>
        <el-form-item label="电话" prop="phone" :rules="[{ required: true, message: '电话不可为空', trigger: 'blur' }]">
          <el-input v-model="form.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="account" :rules="[{ required: true, message: '账号不可为空', trigger: 'blur' }]">
          <el-input v-model="form.account" placeholder="请输入账号" maxlength="20" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="开户行" prop="openingBank" :rules="[{ required: true, message: '开户行不可为空', trigger: 'blur' }]">
          <el-input v-model="form.openingBank" placeholder="请输入开户行" style="width:490px"></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="收货人">
          <el-input v-model="form.recipient" placeholder="请输入收货人"></el-input>
        </el-form-item>
        <el-form-item label="收货电话">
          <el-input v-model="form.recipientPhone" placeholder="请输入收货联系电话" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input v-model="form.recipientAddress" placeholder="请输入收货地址" style="width:490px"></el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { Assign } from '@/utils/index.js'
export default {
  name: 'Form4',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: '',               //公司名称
        dutyParagraph: '',               //税号
        phone: '',               //联系电话
        registeredAddress: '',               //注册地址
        // accountName: '',               //账户名称
        account: '',               //账户
        openingBank: '',               //开户银行
        recipient: '',               //收件人
        recipientPhone: '',               //收件联系电话
        recipientAddress: '',               //收件地址
      },
    }
  },
  created() {

  },
  methods: {
    onload(list) {
      Assign(this.form, list)
    },
    commit() {
      if (!this.$validate('form')) return
      return this.form
    },
    copyClick() {
      let input = document.createElement("textarea");
      input.value = `公司名称：${this.form.name}，\n税号：${this.form.dutyParagraph}，\n注册地址：${this.form.registeredAddress}，\n电话：${this.form.phone}，\n账号：${this.form.account}，\n开户行：${this.form.openingBank}，`; // 修改文本框的内容
      document.body.appendChild(input)
      input.select(); // 选中文本
      document.execCommand("copy"); // 执行浏览器复制命令
      document.body.removeChild(input)
      this.$message.success('复制成功')
    }
  }
}
</script>

<style>
</style>