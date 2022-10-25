<template>
  <el-form size="small" ref="form" :model="form" inline :disabled="disabled" label-width="100" class="block-form">
    <el-form-item label="服务费率" prop="agentServiceCharge" :rules="[{ required: true, message: '服务费率不可为空', trigger: 'blur' }]">
      <el-input v-model="form.agentServiceCharge" @change="serviceChargeChange" placeholder="请输入服务费率" style="width:200px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')">
        <template slot="append">%</template>
      </el-input>
    </el-form-item>
    <el-form-item label="免息天数" prop="agentInterestFreeDays" :rules="[{ required: true, message: '免息天数不可为空', trigger: 'blur' }]">
      <el-input v-model="form.agentInterestFreeDays" placeholder="请输入免息天数" style="width:200px" oninput="value=value.replace(/[^\d]/g,'')">
        <template slot="append">天</template>
      </el-input>
    </el-form-item>
    <el-form-item label="利率" prop="agentRatio" :rules="[{ required: true, message: '利率不可为空', trigger: 'blur' }]">
      <el-input v-model="form.agentRatio" placeholder="请输入利率" style="width:200px" oninput="value=value.replace(/[^\d.]/g,'')">
        <template slot="append">/万/天</template>
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { Assign } from '@/utils/index.js'
export default {
  name: 'Form3',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      form: {
        agentServiceCharge: '',                //服务费(%)
        agentInterestFreeDays: '',                //免息天数
        agentRatio: '',                //利率(/万/天)
      },
    }
  },
  created() {

  },
  methods: {
    onload(obj) {
      Assign(this.form, obj)
    },
    serviceChargeChange() {
      this.$bus.$emit('agentServiceCharge', this.form.agentServiceCharge)
    },
    commit() {
      if (!this.$validate('form')) return
      return this.form
    },
  }
}
</script>

<style>
</style>