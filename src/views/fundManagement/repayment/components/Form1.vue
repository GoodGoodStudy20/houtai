<template>
  <el-form size="small" ref="form" :model="form" label-width="auto" :disabled="disabled" class="block-form">
    <el-form-item label="资方" prop="backersId" :rules="[{ required: true, message: '资方不可为空', trigger: 'blur' }]">
      <ChooseCapital v-model="form.backersId" ref="capital" style="width:500px" @change="changeCapital"></ChooseCapital>
    </el-form-item>
    <el-form-item label="资方账户" prop="backersAccountTaxId" :rules="[{ required: true, message: '资方账户不可为空', trigger: 'change' }]">
      <el-select v-model="form.backersAccountTaxId" placeholder="请选择" style="width:500px">
        <el-option v-for="(item,i) in options2" :key="i" :label="`${item.name}  [${item.account}]`" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="主体" prop="subjectId" :rules="[{ required: true, message: '主体不可为空', trigger: 'blur' }]">
      <ChooseSubject v-model="form.subjectId" ref="subject" @change="subjectChange" style="width:500px"></ChooseSubject>
    </el-form-item>
    <el-form-item label="主体账户" prop="subjectAccountTaxId" :rules="[{ required: true, message: '主体账户不可为空', trigger: 'blur' }]">
      <el-select v-model="form.subjectAccountTaxId" placeholder="请选择" style="width:500px">
        <el-option v-for="(item,i) in options1" :key="i" :label="`${item.name} [${item.account}]`" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="还款金额" prop="repaymentMoney" :rules="[{ required: true, message: '还款金额不可为空', trigger: 'blur' }]">
      <el-input v-model="form.repaymentMoney" placeholder="请输入还款金额" style="width:500px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"><template slot="append">元</template></el-input>
    </el-form-item>
    <el-form-item label="还款时间" prop="repaymentDate" :rules="[{ required: true, message: '还款时间不可为空', trigger: 'blur' }]">
      <el-date-picker v-model="form.repaymentDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:500px"></el-date-picker>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="form.remark" type="textarea" style="width:500px" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { BusinessType } from '@/utils/field.js'
import ChooseCapital from '@/components/ChooseCapital/index.vue'
import ChooseSubject from '@/components/ChooseSubject/index.vue'
import { Assign } from '@/utils/index.js'
export default {
  name: 'Form1',
  components: { ChooseCapital, ChooseSubject },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        backersId: '',                              //资方id
        backersAccountTaxId: '',                              //资方账户税务id
        subjectId: '',                              //主体id
        subjectAccountTaxId: '',                              //主体账户税务id
        repaymentMoney: '',                              //还款金额(元)
        repaymentDate: '',                              //还款时间（yyyy-MM-dd）
        remark: '',                         //备注
      },
      options1: [],
      options2: [],
      BusinessType: BusinessType
    }
  },
  methods: {
    onload(obj) {
      Assign(this.form, obj)
      this.$nextTick(() => {
        this.$refs['capital'].change()
        this.$refs['subject'].change()
      })
    },
    subjectChange(item) {
      this.options1 = item.accountTaxVoList || []
    },
    changeCapital(item) {
      this.options2 = item.accountTaxVoList || []
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