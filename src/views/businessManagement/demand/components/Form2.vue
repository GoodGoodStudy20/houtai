<template>
  <el-form size="small" ref="form" :model="form" inline :disabled="disabled" label-width="100" class="block-form">
    <el-form-item label="服务费率" prop="serviceCharge" :rules="[{ required: true, message: '服务费率不可为空', trigger: 'blur' }]">
      <el-input v-model="form.serviceCharge" @change="serviceChargeChange" placeholder="请输入服务费率" style="width:200px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')">
        <template slot="append">%</template>
      </el-input>
    </el-form-item>
    <el-form-item label="免息天数" prop="interestFreeDays" v-if="businessType === 0" :rules="[{ required: true, message: '免息天数不可为空', trigger: 'blur' }]">
      <el-input v-model="form.interestFreeDays" placeholder="请输入免息天数" style="width:200px" oninput="value=value.replace(/[^\d]/g,'')">
        <template slot="append">天</template>
      </el-input>
    </el-form-item>
    <el-form-item label="利率" prop="ratio" v-if="businessType === 0" :rules="[{ required: true, message: '利率不可为空', trigger: 'blur' }]">
      <el-input v-model="form.ratio" placeholder="请输入利率" style="width:200px" oninput="value=value.replace(/[^\d.]/g,'')">
        <template slot="append">/万/天</template>
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { Assign } from '@/utils/index.js'
export default {
  name: 'Form2',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      form: {
        serviceCharge: '',                //服务费(%)
        interestFreeDays: '',                //免息天数
        ratio: '',                //利率(/万/天)
      },
      businessType: '', //业务模式
    }
  },
  created() {

  },
  methods: {
    onload(obj) {
      Assign(this.form, obj)
      this.form.serviceCharge = obj.serviceCharge
      this.businessType = obj.businessType
      if (obj.hasOwnProperty('defaultType')) {
        this.businessType = obj.defaultType == 0
        this.form.serviceCharge = obj.defaultType == 0 ? obj.advanceServiceCharge : obj.noAdvanceServiceCharge
      }

    },
    serviceChargeChange() {
      this.$bus.$emit('serviceChargeChange', this.form.serviceCharge)
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