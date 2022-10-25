<template>
  <el-form size="small" ref="form" :model="form" label-width="auto" :disabled="disabled" class="block-form">
    <el-form-item label="编号">
      <el-input v-model="form.number" placeholder="自动生成" disabled style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="客户" prop="customerId" :rules="[{ required: true, message: '客户不可为空', trigger: 'blur' }]">
      <ChooseCustomer v-model="form.customerId" ref="customer" style="width:500px" @change="customerChange"></ChooseCustomer>
    </el-form-item>
    <el-form-item label="渠道" prop="channelId" :rules="[{ required: true, message: '渠道不可为空', trigger: 'blur' }]">
      <el-select v-model="form.channelId" placeholder="请选择" style="width:500px">
        <el-option v-for="item in ChannelType" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="发票类型" prop="type" :rules="[{ required: true, message: '发票类型不可为空', trigger: 'blur' }]">
      <el-select v-model="form.type" placeholder="请选择" style="width:500px" @change="typeChange">
        <el-option v-for="(item,i) in InvoiceTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="开票主体" prop="subjectListId" :rules="[{ required: true, message: '开票主体不可为空', trigger: 'blur' }]">
      <!-- <ChooseSubject v-model="form.subjectListId" style="width:500px" :multiple="true"></ChooseSubject> -->
      <el-select v-model="form.subjectListId" placeholder="请选择" style="width:500px" :multiple="true" :disabled="!isDisabled">
        <!-- <el-option label="全部" value="" v-if="showAll"></el-option> -->
        <el-option v-for="item1 in subjectList" :key="item1.id" :label="`${item1.abbreviated}【本月已开金额${item1.totalInvoicingAmount}元，剩余额度${item1.surplusInvoicingAmount}元，剩余份数${item1.surplusInvoicingQuantity}份】`" :value="item1.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label=" 开票内容" prop="invoicingContent" :rules="[{ required: true, message: '开票内容不可为空', trigger: 'blur' }]">
      <el-input v-model="form.invoicingContent" placeholder="请输入开票内容" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="开票金额" prop="invoicingAmount" :rules="[{ required: true, message: '开票金额不可为空', trigger: 'blur' }]">
      <el-input v-model="form.invoicingAmount" placeholder="请输入开票金额" style="width:500px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"><template slot="append">元</template></el-input>
    </el-form-item>
    <el-form-item label="税率" prop="taxRate" :rules="[{ required: true, message: '税率不可为空', trigger: 'blur' }]">
      <el-input v-model="form.taxRate" placeholder="请输入税率" style="width:500px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"><template slot="append">%</template></el-input>
    </el-form-item>
    <el-form-item label="发票种类" prop="invoicingType" :rules="[{ required: true, message: '发票种类不可为空', trigger: 'blur' }]">
      <el-select v-model="form.invoicingType" placeholder="请选择" style="width:500px">
        <el-option v-for="(item,i) in InvoiceType" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="预计回款日期" prop="estimateReturnMoneyDate" :rules="[{ required: true, message: '预计回款日期不可为空', trigger: 'blur' }]">
      <el-date-picker v-model="form.estimateReturnMoneyDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:500px"></el-date-picker>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="form.remark" type="textarea" style="width:500px" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import ChooseCustomer from '@/components/ChooseCustomer/index.vue'
import ChooseSubject from '@/components/ChooseSubject/index.vue'
import { getSubjectList } from '@/api/index.js'
import { Assign } from '@/utils/index.js'
import { InvoiceType, InvoiceTypeList } from '@/utils/field.js'
export default {
  name: 'Form1',
  components: { ChooseCustomer, ChooseSubject },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        number: '',//编号
        customerId: '',                    //客户id
        channelId: '',//渠道
        invoicingType: '',                    //开票种类(0.增值税专用发票,1.增值税普通发票)
        invoicingContent: '',                    //开票内容
        invoicingAmount: '',                    //开票金额
        taxRate: '',                    //税率
        type: '',                    //发票类型(0.纸质,1.电子)
        estimateReturnMoneyDate: '',                    //预计回款日期
        remark: '',                    //备注
        subjectListId: '',//开票主体
      },
      InvoiceTypeList: InvoiceTypeList,
      InvoiceType: InvoiceType,
      ChannelType: [],
      subjectList: []
    }
  },
  watch: {
    'form.type'(val) {
      if (val || val == 0) {
        this.getSubjectList()
      }
    }
  },
  computed: {
    isDisabled() {
      return this.form.type !== ''
    }
  },
  methods: {
    getSubjectList(params = {}) {
      getSubjectList({  ...params, type: this.form.type }).then(res => {
        this.subjectList = res.data
      })
    },
    onload(obj) {
      Assign(this.form, obj)
      this.$nextTick(() => {
        this.$refs['customer'].getList('onload')
      })
      if (this.form.subjectListId && this.form.subjectListId.length > 0) {

        this.form.subjectListId = this.form.subjectListId.split(',')
        this.form.subjectListId = this.form.subjectListId.map(item => Number(item))
      }
    },
    customerChange(item, type) {
      // this.$refs['subject'].getList({ customerId: item.id })
      this.ChannelType = item.customerChannelVoList
      if (type != 'onload') {
        this.$emit('customerChange', item.invoiceVo || {})
        this.form.subjectId = ''
        this.form.channelId = ''
      }
    },
    typeChange() {
      this.$emit('typeChange', this.form.type)
    },
    commit() {
      if (!this.$validate('form')) return
      if (Array.isArray(this.form.subjectListId)) {
        this.form.subjectListId = this.form.subjectListId.join(',')
      }
      let obj = Object.assign({}, this.form)
      return obj
    },

  }
}
</script>

<style>
</style>