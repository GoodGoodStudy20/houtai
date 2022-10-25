<template>
  <el-form size="small" ref="form" :model="form" label-width="100px" :disabled="disabled" class="block-form">
    <el-form-item label="收货人">
      <el-input v-model="form.recipient" placeholder="请输入收货人" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="收货电话">
      <el-input v-model="form.recipientPhone" placeholder="请输入收货联系电话" maxlength="11" style="width:500px" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
    </el-form-item>
    <el-form-item label="收货地址">
      <el-input v-model="form.recipientAddress" placeholder="请输入收货地址" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="物流单号">
      <el-input v-model="form.logisticsOrderNo" placeholder="请输入物流单号" style="width:500px"></el-input>
    </el-form-item>
  </el-form>
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
        recipient: '',                    //收件人
        recipientAddress: '',                    //收件地址
        recipientPhone: '',                    //收件联系电话
        logisticsOrderNo: '',                    //物流单号
      },
    }
  },
  methods: {
    onload(obj) {
      Assign(this.form, obj)
    },
    commit() {
      if (!this.$validate('form')) return
      let obj = Object.assign({}, this.form)
      return obj
    },

  }
}
</script>

<style>
</style>