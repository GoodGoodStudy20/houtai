<template>
  <el-form @submit.native.prevent size="small" inline :disabled="disabled" class="block-form">
    <el-form-item label="备注">
      <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" style="width:1000px" :autosize="{ minRows: 2, maxRows: 10}"></el-input>
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
        remark: '',               //备注
      },
    }
  },
  methods: {
    onload(obj) {
      Assign(this.form, obj)
    },
    commit() {
      return this.form
    }
  }
}
</script>

<style>
</style>