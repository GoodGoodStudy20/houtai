<template>
  <el-form size="small" ref="form" :model="form" label-width="150px" class="block-form">
    <el-form-item label="登记账户类型" prop="channelId" :rules="[{ required: true, message: '登记账户类型不可为空', trigger: 'change' }]">
      <el-select v-model="form.channelId" placeholder="请选择" style="width:500px">
        <el-option v-for="item in ChannelType" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="登记账户" prop="channelId" :rules="[{ required: true, message: '登记账户类型不可为空', trigger: 'change' }]">
      <el-input v-model="form.input" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="开户行" prop="channelId" :rules="[{ required: true, message: '开户行不可为空', trigger: 'change' }]">
      <el-input v-model="form.input" style="width:500px"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { Assign } from '@/utils/index.js'

export default {
  name: 'Form3',
  data() {
    return {
      form: {
        input: ''
      },
      ChannelType: [
        {
          name: '基本户',
          id: 0
        }, {
          name: '一般户',
          id: 1
        },
        {
          name: '共管户',
          id: 2
        }],
    }
  },
  methods: {
    onload(obj) {
      Assign(this.form, obj)
    },
    commit() {
      if (!this.$validate('form')) return
      return this.form
    },
  },
}
</script>

<style>
</style>