<template>
  <el-form size="small" ref="form" :model="form" label-width="auto" :disabled="disabled" class="block-form">
    <el-form-item label="服务费率（%）" prop="serviceCharge" :rules="[{ required: true, message: '服务费率不可为空', trigger: 'change' }]">
      <el-input v-model="form.serviceCharge" placeholder="请输入" style="width:500px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
    </el-form-item>
    <el-form-item label="免息条件（天）" prop="interestFreeDays" :rules="[{ required: true, message: '免息条件不可为空', trigger: 'change' }]">
      <el-input v-model="form.interestFreeDays" placeholder="请输入" style="width:500px" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
    </el-form-item>
    <el-form-item label="利率（万/天）" prop="ratio" :rules="[{ required: true, message: '利率不可为空', trigger: 'change' }]">
      <el-input v-model="form.ratio" placeholder="请输入" style="width:500px" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
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
    }
  },
  data() {
    return {
      form: {
        serviceCharge: '',              //服务费率（%）
        interestFreeDays: '',//免息条件（天）
        ratio: '',                    //利率（万/天）
      },
    }
  },
  methods: {
    onload(obj) {
      Assign(this.form, obj)
      // this.$nextTick(() => {
      //   this.$refs['subject'].change('onload')
      // })
    },
    commit() {
      let obj = Object.assign({}, this.form)
      if (!this.$validate('form')) return
      return obj
    },

  }
}
</script>

<style>
</style>