<template>
  <el-form size="small" ref="form" :model="form" label-width="auto" :disabled="disabled" class="block-form">
    <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '名称不可为空', trigger: 'blur' }]">
      <el-input v-model="form.name" placeholder="请输入名称" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="简称" prop="abbreviated" :rules="[{ required: true, message: '简称不可为空', trigger: 'blur' }]">
      <el-input v-model="form.abbreviated" placeholder="请输入简称" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="类型" prop="type" :rules="[{ required: true, message: '分类不可为空', trigger: 'blur' }]">
      <el-select v-model="form.type" placeholder="请选择" style="width:500px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="所属地区" prop="province" :rules="[{ required: true, message: '所属地区不可为空', trigger: 'blur' }]">
      <ChooseArea :province.sync="form.province" :city.sync="form.city" style="width:500px"></ChooseArea>
    </el-form-item>
    <el-form-item label="级别" prop="level" :rules="[{ required: true, message: '级别不可为空', trigger: 'blur' }]">
      <el-select v-model="form.level" placeholder="请选择" style="width:500px">
        <el-option v-for="item in LevelType" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="所属分公司" prop="companyId" :rules="[{ required: true, message: '所属分公司不可为空', trigger: 'blur' }]" v-if="[2,3].includes(form.level)">
      <el-select v-model="form.companyId" placeholder="请选择" style="width:500px">
        <el-option v-for="item in customerList" :key="item.id" :label="item.abbreviated" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="负责人" prop="directorId" :rules="[{ required: true, message: '负责人不可为空', trigger: 'change' }]">
      <ChooseUser v-model="form.directorId" placeholder="请选择" style="width:500px"></ChooseUser>
    </el-form-item>
    <el-form-item label="总负责人" prop="generalDirectorId" :rules="[{ required: true, message: '总负责人不可为空', trigger: 'change' }]">
      <ChooseUser v-model="form.generalDirectorId" placeholder="请选择" style="width:500px"></ChooseUser>
    </el-form-item>
    <el-form-item label="信用代码" prop="creditCode" :rules="[{ required: true, message: '信用代码不可为空', trigger: 'blur' }]">
      <el-input v-model="form.creditCode" placeholder="请输入信用代码" oninput="value=value.toUpperCase()" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="业务编码" prop="businessNumber" :rules="[{ required: true, message: '业务编码不可为空', trigger: 'blur' }]">
      <el-input v-model="form.businessNumber" placeholder="请输入业务编码" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="往来邮箱">
      <el-input v-model="form.contactMailbox" placeholder="请输入往来邮箱" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="form.remark" type="textarea" style="width:500px" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>

import { getCustomerList } from '@/api/index.js'
import ChooseArea from '@/components/ChooseArea/index.vue'
import ChooseUser from '@/components/ChooseUser/index.vue'
import { CustomerType, LevelType } from '@/utils/field.js'
import { Assign } from '@/utils/index.js'
export default {
  name: 'Form1',
  components: { ChooseArea, ChooseUser },
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
        type: '',        //服务商类型(0.身边云,1.合摩,2.嗨客,3.浪潮,4.北斗)
        province: '',        //省
        level: '',//级别
        city: '',       //市
        creditCode: '',        //信用代码
        businessNumber: '',        //业务编码
        contactMailbox: '',       //联系邮箱   
        remark: '',        //备注
        directorId: '',//负责人
        companyId: '',
        generalDirectorId:''//总负责人
      },
      options: CustomerType,
      LevelType: LevelType,//客户级别
      customerList: []
    }
  },
  watch: {
    'form.level'(val) {
      if ([2, 3].includes(val)) {
        this.getCustomerList()
      }
    },
    'form.city'(val, oldVal) {
      if (oldVal && val != oldVal) {
        this.form.level = ''
      }
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
    getCustomerList() {
      let param = {
        level: 1,
        province: this.form.province,
        // city: this.form.city,
        isProvince: 1
      }
      getCustomerList(param).then(res => {
        if (res.code != 200) return
        this.customerList = res.data
      })
    },
  }
}
</script>

<style>
</style>