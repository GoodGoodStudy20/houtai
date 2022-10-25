<template>
  <el-form size="small" ref="form" :model="form" inline :disabled="disabled" label-width="100">
    <el-form-item label="名称" prop="serviceId" :rules="[{required: true,message: '名称不可为空',trigger: 'blur',},]">
      <ChooseServiceProvider v-model="form.serviceId" style="width: 300px"></ChooseServiceProvider>
    </el-form-item>
    <el-form-item label="应付分配比例" prop="copeWithAllocation" :rules="[{ required: true, message: '应付分配比例不可为空', trigger: 'blur' }]">
      <el-input v-model="form.copeWithAllocation" placeholder="请输入应付分配比例" style="width:200px" oninput="value=value.replace(/[^\d]/g,'')">
        <template slot="append">%</template>
      </el-input>
    </el-form-item>
    <!-- <el-form-item label="利率" prop="ratio" v-if="businessType === 0" :rules="[{ required: true, message: '利率不可为空', trigger: 'blur' }]">
      <el-select v-model="form.issueType" placeholder="请选择" style="width:480px" @change="oilCouponChange">
        <el-option label="否" :value="0"></el-option>
        <el-option label="是" :value="1"></el-option>
      </el-select>
    </el-form-item> -->
  </el-form>
</template>

<script>
import { Assign } from '@/utils/index.js'
import ChooseServiceProvider from "@/components/ChooseServiceProvider/index.vue";
export default {
  name: 'Form17',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
  },
  components: { ChooseServiceProvider },
  data() {
    return {
      form: {
        serviceId: '', //serviceId
        copeWithAllocation: '', //应付分配比例
      },
    }
  },
  created() {

  },
  methods: {
    onload(obj) {
      this.form.copeWithAllocation = obj.copeWithAllocation
      this.form.serviceId = obj.serviceId
    },
    commit() {
      if (!this.$validate('form')) return
      if (!this.form.serviceId) {
        this.$message.warning("请填写服务商");
        return;
      }
      if (!this.form.copeWithAllocation) {
        this.$message.warning("应付分配比例");
        return;
      }
      return this.form
    },
  }
}
</script>

<style>
</style>