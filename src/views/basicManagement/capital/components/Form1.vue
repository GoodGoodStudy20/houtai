<template>
  <el-form size="small" ref="form" :model="form" label-width="auto" :disabled="disabled" class="block-form">
    <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '名称不可为空', trigger: 'blur' }]">
      <el-input v-model="form.name" placeholder="请输入名称" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="简称" prop="abbreviated" :rules="[{ required: true, message: '简称不可为空', trigger: 'blur' }]">
      <el-input v-model="form.abbreviated" placeholder="请输入简称" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="授信额度" prop="creditQuota" :rules="[{ required: true, message: '授信额度不可为空', trigger: 'blur' }]">
      <el-input v-model="form.creditQuota" placeholder="请输入授信额度" style="width:500px" oninput="value=value.replace(/[^\d.]/g,'')">
        <template slot="append">万</template>
      </el-input>
    </el-form-item>
    <el-form-item label="信用代码" prop="creditCode" :rules="[{ required: true, message: '信用代码不可为空', trigger: 'blur' }]">
      <el-input v-model="form.creditCode" placeholder="请输入信用代码" style="width:500px" oninput="value=value.toUpperCase()"></el-input>
    </el-form-item>
    <el-form-item label="注册地址" prop="registeredAddress" :rules="[{ required: true, message: '注册地址不可为空', trigger: 'blur' }]">
      <el-input v-model="form.registeredAddress" placeholder="请输入注册地址" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="往来邮箱">
      <el-input v-model="form.contactMailbox" placeholder="请输入往来邮箱" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="经营范围" prop="businessScope" :rules="[{ required: true, message: '经营范围不可为空', trigger: 'blur' }]">
      <el-input v-model="form.businessScope" type="textarea" style="width:500px" placeholder="请输入经营范围" :autosize="{ minRows: 2, maxRows: 10}"></el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="form.remark" type="textarea" style="width:500px" placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 10}"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import ChooseArea from '@/components/ChooseArea/index.vue'
import { CustomerType } from '@/utils/field.js'
import { Assign } from '@/utils/index.js'
export default {
  name: 'Form1',
  components: { ChooseArea },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: '',        //名称
        abbreviated: '',        //简称
        creditQuota: '',        //授信额度(万)
        creditCode: '',        //信用代码
        registeredAddress: '',        //注册地址
        contactMailbox: '',       //联系邮箱   
        businessScope: '',       //经营范围
        remark: '',        //备注
      },
      options: CustomerType,
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

  }
}
</script>

<style>
</style>