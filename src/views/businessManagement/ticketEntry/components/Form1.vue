<template>
  <el-form size="small" ref="form" :model="form" label-width="auto" :disabled="disabled" class="block-form">
    <el-form-item label="业务类型" prop="businessType" :rules="[{ required: true, message: '业务类型不可为空', trigger: 'blur' }]">
      <el-select v-model="form.businessType" placeholder="请选择" style="width:500px">
        <el-option v-for="(item,i) in businessTypeList" :key="item" :label="item" :value="i"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="主体" prop="subjectId" :rules="[{ required: true, message: '主体不可为空', trigger: 'blur' }]">
      <ChooseSubject v-model="form.subjectId" ref="subject" @change="subjectChange" placeholder="请选择" style="width:500px"></ChooseSubject>
    </el-form-item>
    <el-form-item label="服务商" v-if="form.businessType==0" prop="serviceId" :rules="[{ required: true, message: '服务商不可为空', trigger: 'blur' }]">
      <ChooseServiceProvider v-model="form.serviceId" ref="service" style="width:500px"></ChooseServiceProvider>
    </el-form-item>
    <el-form-item label="资方" v-else prop="backersId" :rules="[{ required: true, message: '资方不可为空', trigger: 'blur' }]">
      <ChooseCapital v-model="form.backersId" style="width:500px"></ChooseCapital>
    </el-form-item>
    <el-form-item label="发票类型" prop="invoicingType" :rules="[{ required: true, message: '发票类型不可为空', trigger: 'blur' }]">
      <el-select v-model="form.invoicingType" placeholder="请选择" style="width:500px">
        <el-option v-for="(item,i) in InvoiceTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="开票内容" prop="enterInvoicingContent" :rules="[{ required: true, message: '开票内容不可为空', trigger: 'blur' }]">
      <el-input v-model="form.enterInvoicingContent" placeholder="请输入进票内容" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="不含税金额（元）" v-if="isType" prop="includingTaxAmount" :rules="[{ required: true, message: '不含税金额不可为空', trigger: 'blur' }]">
      <el-input v-model="form.includingTaxAmount" placeholder="请输入进票金额" @change="changeWithoutTaxAmount" style="width:500px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"><template slot="append">元</template></el-input>
    </el-form-item>
    <el-form-item label="税额（元）" v-if="isType" prop="taxAmount" :rules="[{ required: true, message: '税率不可为空', trigger: 'blur' }]">
      <el-input v-model="form.taxAmount" placeholder="请输入税率" @change="changeWithoutTaxAmount" style="width:500px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"><template slot="append">元</template></el-input>
    </el-form-item>
    <el-form-item label="税价合计（元）" prop="withoutTaxAmount" :rules="[{ required: true, message: '税价合计不可为空', trigger: 'blur' }]">
      <el-input v-model="form.withoutTaxAmount" placeholder="请输入税价合计" style="width:500px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"><template slot="append">元</template></el-input>
    </el-form-item>
    <el-form-item label="税率" prop="taxRate" :rules="[{ required: true, message: '税率不可为空', trigger: 'blur' }]">
      <el-input v-model="form.taxRate" placeholder="请输入税率" style="width:500px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"><template slot="append">%</template></el-input>
    </el-form-item>
    <!-- <el-form-item label="发票类型" prop="type" :rules="[{ required: true, message: '发票类型不可为空', trigger: 'blur' }]">
      <el-select v-model="form.type" placeholder="请选择" style="width:500px">
        <el-option v-for="(item,i) in options2" :key="item" :label="item" :value="i"></el-option>
      </el-select>
    </el-form-item> -->
    <el-form-item label="开票时间" prop="enterInvoicingDate" :rules="[{ required: true, message: '开票时间不可为空', trigger: 'blur' }]">
      <el-date-picker v-model="form.enterInvoicingDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:500px"></el-date-picker>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="form.remark" type="textarea" style="width:500px" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import ChooseServiceProvider from '@/components/ChooseServiceProvider/index.vue'
import ChooseSubject from '@/components/ChooseSubject/index.vue'
import ChooseCapital from '@/components/ChooseCapital/index.vue'
import { Assign, NumberAdd } from '@/utils/index.js'
import { getSubjectList } from '@/api/index'
import { InvoiceTypeList } from '@/utils/field.js'
export default {
  name: 'Form1',
  components: { ChooseServiceProvider, ChooseSubject, ChooseCapital },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        serviceId: '',              //服务商id
        businessType: 0,//业务类型(0.服务商发票,1.资方发票)
        subjectId: '',                    //主体id
        backersId: '',                    //资方
        invoicingType: '',
        // enterInvoicingAmount: '',        //税价合计
        enterInvoicingContent: '',                    //进票内容
        withoutTaxAmount: '',                    //进票金额
        includingTaxAmount: '',//不含税金额
        taxAmount: '',                 //税金额
        taxRate: '',                    //税率
        type: '',                    //发票类型(0.纸质,1.电子)
        enterInvoicingDate: '',                    //进票日期
        remark: '',                    //备注
        enterInvoiceFile: ''
      },
      InvoiceTypeList: InvoiceTypeList,
      businessTypeList: ['服务商发票', '资方发票'],
      // options1: ['增值税专用发票', '增值税普通发票'],
      // options2: ['纸质', '电子'],
      list: [],//主体列表
      isType: false//主体是否小规模
    }
  },
  watch: {
    'form.invoicingType'(val) {
      if (val == 0) {
        this.isType = true
      } else {
        this.isType = false
      }
    }
  },
  methods: {
    changeWithoutTaxAmount() {
      if (this.isType) {
        this.form.withoutTaxAmount = NumberAdd([this.form.includingTaxAmount, this.form.taxAmount])
      }
    },
    onload(obj) {
      Assign(this.form, obj)
      this.$nextTick(() => {
        this.$refs['subject'].change('onload')
      })
    },
    subjectChange(item, type) {
      if (this.form.businessType == 0) {
        this.$refs['service'].getList({ subjectId: item.id })
      }
      if (type != 'onload') {
        this.form.serviceId = ''
      }
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