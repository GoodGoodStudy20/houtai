<template>
  <el-form size="small" ref="form" :model="form" label-width="auto" :disabled="disabled" class="block-form">
    <el-form-item label="地域要求" prop="regionDemand" :rules="[{ required: true, message: '地域要求不可为空', trigger: 'blur' }]">
      <el-select v-model="form.regionDemand" placeholder="请选择地域要求" style="width:500px">
        <el-option label="要求本省" :value="0"></el-option>
        <el-option label="要求本市" :value="1"></el-option>
        <el-option label="无要求" :value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="税务类型要求" prop="taxTypeDemand" :rules="[{ required: true, message: '税务类型要求不可为空', trigger: 'blur' }]">
      <el-select v-model="form.taxTypeDemand" placeholder="请选择税务类型要求" style="width:500px">
        <el-option label="一般纳税人" :value="0"></el-option>
        <el-option label="小规模" :value="1"></el-option>
        <el-option label="无要求" :value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="成立年限" prop="establishYears" :rules="[{ required: true, message: '成立年限不可为空', trigger: 'blur' }]">
      <el-select v-model="form.establishYears" placeholder="请选择成立年限" style="width:500px">
        <el-option label="六月以上" :value="0"></el-option>
        <el-option label="无要求" :value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="注册资本" prop="registeredCapital" :rules="[{ required: true, message: '注册资本不可为空', trigger: 'blur' }]">
      <el-select v-model="form.registeredCapital" placeholder="请选择注册资本" style="width:500px">
        <el-option label="50万以上" :value="0"></el-option>
        <el-option label="100万以上" :value="1"></el-option>
        <el-option label="无要求" :value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="主体关联要求" prop="subjectRelationDemand" :rules="[{ required: true, message: '主体关联要求不可为空', trigger: 'blur' }]">
      <el-select v-model="form.subjectRelationDemand" placeholder="请选择主体关联要求" style="width:500px">
        <el-option label="省内无关联" :value="0"></el-option>
        <el-option label="市内无关联" :value="1"></el-option>
        <el-option label="无要求" :value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="业务场景" prop="sceneListId" :rules="[{ required: true, message: '业务场景不可为空', trigger: 'blur' }]">
      <el-select v-model="form.sceneListId" multiple placeholder="请选择业务场景" style="width:500px">
        <el-option v-for="item in businessScopeTypeList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="业务规模" prop="businessScale" :rules="[{required: true,message: '业务规模不可为空',trigger: 'blur'}]">
      <el-input v-model="form.businessScale" placeholder="请输入业务量" style="width: 500px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')">
        <template slot="append">元</template>
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { Assign } from '@/utils/index.js'
import { getBusinessScopeTypeList } from '@/api/index.js'
export default {
  name: 'Form1',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        regionDemand: "",
        taxTypeDemand: "",
        registeredCapital: "",
        subjectRelationDemand: "",
        sceneListId: '',
        establishYears: '',
        businessScale:''
      },
      businessScopeTypeList: []//业务场景列表
    }
  },
  created() {
    this.getList()

  },
  methods: {
    onload(obj) {
      this.form = Object.assign(this.form, obj)
      // Assign(this.form, obj)
      if (this.form.sceneListId && this.form.sceneListId.length > 0) {
        this.form.sceneListId = this.form.sceneListId.split(',')
        this.form.sceneListId = this.form.sceneListId.map(item => Number(item))
      }
    },
    commit() {
      if (!this.$validate('form')) return
      if (Array.isArray(this.form.sceneListId)) {
        this.form.sceneListId = this.form.sceneListId.join(',')
      }
      return this.form
    },
    getList() {
      getBusinessScopeTypeList(this.form).then(res => {
        if (res.code != 200) return
        this.businessScopeTypeList = res.data
      })
    }
  }
}
</script>

<style>
</style>