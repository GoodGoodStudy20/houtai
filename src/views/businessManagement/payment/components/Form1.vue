<template>
  <el-form size="small" ref="form" inline :model="form" label-width="110px" :disabled="disabled" class="block-form" style="width:1280px">
    <el-form-item label="编号">
      <el-input v-model="form.number" disabled placeholder="自动生成" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="付款日期" :rules="[{ required: true, message: '付款日期不可为空', trigger: 'change' }]">
      <el-date-picker v-model="form.paymentDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:500px"></el-date-picker>
    </el-form-item>
    <el-form-item label="是否积分需求" prop="isIntegral" :rules="[{ required: true, message: '是否积分需求不可为空', trigger: 'blur' }]">
      <el-select v-model="form.isIntegral" placeholder="请选择" style="width:500px" @change="isIntegralChange">
        <el-option label="是" :value="0"></el-option>
        <el-option label="否" :value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关联需求单" v-if="form.isIntegral==1" prop="demandId" :rules="[{ required: true, message: '关联需求单不可为空', trigger: 'blur' }]">
      <el-select v-model="form.demandId" placeholder="请选择" style="width:500px" @change="demandChange">
        <el-option v-for="item in demandList" :key="item.id" :label="item.number" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="客户" prop="customerId" :rules="[{ required: true, message: '客户不可为空', trigger: 'blur' }]">
      <ChooseCustomer v-model="form.customerId" ref="customer" :disabled="form.isIntegral==1" @change="customerChange" style="width:500px"></ChooseCustomer>
    </el-form-item>
    <el-form-item label="渠道" prop="channelId" :rules="[{ required: true, message: '渠道不可为空', trigger: 'change' }]">
      <el-select v-model="form.channelId" placeholder="请选择" style="width:500px" :disabled="form.isIntegral==1">
        <el-option v-for="item in ChannelType" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <div>
      <el-form-item label="业务条件">
        {{form.businessCondition}}
      </el-form-item>
    </div>
    <el-form-item label="备注">
      <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" style="width:500px" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import ChooseCustomer from '@/components/ChooseCustomer/index.vue'
import { BusinessType } from '@/utils/field.js'
import { getDemandApprovalList } from '@/api/index.js'
import { Assign } from '@/utils/index.js'
export default {
  name: 'Form1',
  components: { ChooseCustomer },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        businessCondition: '',              //业务条件
        businessType: '',              //业务类型(0.垫资,1.不垫资)
        customerId: '',              //客户id
        channelId: '',//渠道
        paymentDate: '',//付款时间
        demandId: '',              //需求id
        income: '',              //委托经营所得(元)
        isIntegral: '',              //是否积分(0.是,1.否)
        number: '',              //编号
        paymentListFile: '',              //支付清单文件
        remark: '',               //备注
      },
      demandList: [],
      BusinessType: BusinessType,
      ChannelType: []
    }
  },
  created() {
    getDemandApprovalList({ approvalStatus: 2, isPaymentDate: '', isDemandDate: 0, isControl: 1, }).then(res => {
      this.demandList = res.data || []
    })
  },
  methods: {
    onload(obj) {
      Assign(this.form, obj)
      this.$nextTick(() => {
        this.$refs['customer'].getList('onload')
      })
    },
    isIntegralChange() {
      this.form.businessType = ''
      this.form.demandId = ''
      this.form.customerId = ''
      this.form.income = ''
      this.form.businessCondition = ''
      this.form.channelId = ''
      this.$emit('integral', this.form.isIntegral)
    },
    demandChange() {
      let item = this.demandList.find(item => item.id == this.form.demandId) || {}
      this.form.businessType = item.businessType
      this.form.channelId = item.channelId
      this.form.customerId = item.customerId
      this.form.income = item.income
      this.form.businessCondition = `${item.income}, ${this.BusinessType[this.form.businessType] ? this.BusinessType[this.form.businessType].label : ''},` + (this.form.businessType == 0 ? `${item.serviceCharge} (${item.interestFreeDays}) +${item.ratio}` : item.serviceCharge)
      this.$emit('demand', item.detailedListFile)
      this.$nextTick(() => {
        this.$refs['customer'].change('onload')
      })
    },
    customerChange(item, type) {
      this.ChannelType = item.customerChannelVoList
      if (type != 'onload') {
        this.form.businessType = item.defaultType
        item.serviceCharge = item.defaultType == 0 ? item.advanceServiceCharge : item.noAdvanceServiceCharge
        // this.form.income = item.income
        if (this.form.income) {
          this.form.businessCondition = `${this.form.income}, ${this.BusinessType[this.form.businessType] ? this.BusinessType[this.form.businessType].label : ''},` + (this.form.businessType == 0 ? `${item.serviceCharge} (${item.interestFreeDays}) +${item.ratio}` : item.serviceCharge)
        } else {
          this.form.businessCondition = ` ${this.BusinessType[this.form.businessType] ? this.BusinessType[this.form.businessType].label : ''},` + (this.form.businessType == 0 ? `${item.serviceCharge} (${item.interestFreeDays}) +${item.ratio}` : item.serviceCharge)
        }
        // this.form.businessCondition = `${this.form.income}, ${this.BusinessType[this.form.businessType] ? this.BusinessType[this.form.businessType].label : ''},` + (this.form.businessType == 0 ? `${item.serviceCharge} (${item.interestFreeDays}) +${item.ratio}` : item.serviceCharge)
        this.form.channelId = ''
      }
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