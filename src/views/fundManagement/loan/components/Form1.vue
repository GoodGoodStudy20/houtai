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
    <el-form-item label="主体账户" v-if="form.repaymentType==0" prop="subjectAccountTaxId" :rules="[{ required: true, message: '主体账户不可为空', trigger: 'blur' }]">
      <el-select v-model="form.subjectAccountTaxId" placeholder="请选择" style="width:500px">
        <el-option v-for="(item,i) in options1" :key="i" :label="`${item.name}  [${item.account}]`" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="放款账户" v-else prop="subjectAccountTaxId" :rules="[{ required: true, message: '放款账户不可为空', trigger: 'blur' }]">
      <el-select v-model="form.subjectAccountTaxId" placeholder="请选择" style="width:500px">
        <el-option v-for="(item,i) in options1" :key="i" :label="`${item.name}  [${item.account}]`" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="放款金额" prop="loanMoney" :rules="[{ required: true, message: '放款金额不可为空', trigger: 'blur' }]">
      <el-input v-model="form.loanMoney" placeholder="请输入放款金额" style="width:500px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"><template slot="append">元</template></el-input>
    </el-form-item>
    <el-form-item label="放款时间" prop="loanDate" :rules="[{ required: true, message: '放款时间不可为空', trigger: 'blur' }]">
      <el-date-picker v-model="form.loanDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:500px"></el-date-picker>
    </el-form-item>
    <el-form-item label="放款利息" prop="loanInterest" :rules="[{ required: true, message: '放款利息不可为空', trigger: 'blur' }]">
      <el-input v-model="form.loanInterest" placeholder="请输入放款利息" style="width:500px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"><template slot="append">元/万元/天</template></el-input>
    </el-form-item>
    <el-form-item label="放款期限" prop="loanStartTerm" :rules="[{ required: true, message: '放款期限不可为空', trigger: 'blur' }]">
      <el-date-picker v-model="form.loanStartTerm" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:240px"></el-date-picker> 至
      <el-date-picker v-model="form.loanEndTerm" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:240px"></el-date-picker>
    </el-form-item>
    <el-form-item label="还款方式" prop="repaymentType" :rules="[{ required: true, message: '还款方式不可为空', trigger: 'change' }]">
      <el-select v-model="form.repaymentType" @change="repaymentType" placeholder="请选择" style="width:500px">
        <el-option label="按月还款" :value="0"></el-option>
        <el-option label="到期还款" :value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="还款提醒人" prop="repaymentNoticeId" :rules="[{ required: true, message: '请选择提醒人', trigger: 'blur' }]">
      <ChooseUser v-model="form.repaymentNoticeId" placeholder="请选择" :multiple="true" style="width:500px"></ChooseUser>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="form.remark" type="textarea" style="width:500px" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import ChooseCapital from '@/components/ChooseCapital/index.vue'
import ChooseSubject from '@/components/ChooseSubject/index.vue'
import ChooseUser from '@/components/ChooseUser/index.vue'
import { Assign } from '@/utils/index.js'
export default {
  name: 'Form1',
  components: { ChooseCapital, ChooseSubject, ChooseUser },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        backersId: '',                      //资方id
        backersAccountTaxId: '',                      //资方账户税务id
        subjectId: '',                      //主体id
        subjectAccountTaxId: '',                      //主体账户税务id
        loanMoney: '',                      //放款金额(元)
        loanDate: '',                      //放款时间（yyyy-MM-dd）
        loanInterest: '',                      //放款利率(%)
        loanTerm: '',                      //放款期限
        loanStartTerm: '',
        loanEndTerm: '',
        repaymentType: '',
        remark: '',                         //备注
        repaymentNoticeId: ''
      },
      options1: [],
      options2: [],
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
    repaymentType() {
      this.$emit('payTypeChange', this.form.repaymentType)
    },
    handlePro() {
      let data = {
        loanInterest: this.form.loanInterest,
        loanStartTerm: this.form.loanStartTerm,
      }
      this.$emit('loanStartTerm', data)
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