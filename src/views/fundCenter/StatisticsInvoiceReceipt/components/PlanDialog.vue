<template>
  <el-dialog :visible.sync="value" center title="开票规划金额信息" :before-close="dialogClose" :close-on-click-modal="false" width="500px" :lock-scroll="false" :modal-append-to-body="false">
    <el-form size="small" ref="form" :model="form" label-width="auto" class="block-form ">
      <el-form-item label="所属分公司" prop="companyId" :rules="[{ required: true, message: '所属分公司不可为空', trigger: 'blur' }]">
        <el-select v-model="form.companyId" placeholder="请选择" @change="companyChange" style="width:300px">
          <el-option v-for="item in companyList" :key="item.companyId" :label="item.companyName" :value="item.companyId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户" class="form-item-container" prop="customerId" :rules="[{ required: true, message: '客户不可为空', trigger: 'blur' }]">
        <!-- <ChooseCustomer v-model="form.customerId" showValue="name" ref="customer" style="width:300px" @change="changeCustomer"></ChooseCustomer> -->
        <el-select v-model="form.customerId" placeholder="请选择" @change="changeCustomer" style="width:300px">
          <el-option v-for="item in customerList" :key="item.customerId" :label="item.customerName" :value="item.customerId"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="渠道" prop="channelId" :rules="[{ required: true, message: '渠道不可为空', trigger: 'change' }]">
        <el-select v-model="form.channelId" placeholder="请选择" @change="changeChannel" style="width:300px">
          <el-option v-for="item in ChannelType" :key="item.channelId" :label="item.channelName" :value="item.channelId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form-item-container" label="开票性质" prop="nature" :rules="[{ required: true, message: '开票性质不可为空', trigger: 'blur' }]">
        <el-select v-model="form.nature" placeholder="请选择" disabled style="width:300px">
          <el-option v-for="(item,i) in InvoiceType" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form-item-container" label="月份" prop="month" :rules="[{ required: true, message: '月份不可为空', trigger: 'blur' }]">
        <el-date-picker v-model="form.month" type="month" value-format="yyyy-MM" placeholder="选择月份" style="width:300px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="规划金额" class="form-item-container" prop="planAmount" :rules="[{ required: true, message: '规划金额不可为空', trigger: 'blur' }]">
        <el-input v-model="form.planAmount" placeholder="请输入规划金额" style="width:300px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"><template slot="append">元</template></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { NumberSub, NumberAdd, NumberMul, NumberDiv } from "@/utils/index.js"
import { InvoiceType, ContractType } from '@/utils/field.js'
import { addInvoicePlanAmountRecord, updateInvoicePlanAmountRecord } from '@/api/index'
import ChooseCustomer from '@/components/ChooseCustomer/index.vue'
export default {
  name: 'PlanDialog',
  data() {
    return {
      dialogInfo: false,
      dialogVisible: false,
      form: {
        customerId: '',
        companyId: '',
        channelId: '',
        nature: '',
        planAmount: '',
        month: ''
      },
      ChannelType: [],
      companyList: [],
      customerList: [],
      InvoiceType: InvoiceType,
      planId: ''
    }
  },
  props: ['value', 'nature'],
  components: { ChooseCustomer },
  created() {
    this.$nextTick(() => {
      this.form.nature = this.nature
    })

  },
  methods: {
    onload(list = []) {
      this.companyList = list
    },
    companyChange() {
      this.form.customerId = ''
      this.form.channelId = ''
      this.form.planAmount = ''
      this.planId = ''
      this.companyList.forEach(item => {
        if (this.form.companyId == item.companyId) {
          this.customerList = item.returnMoneyStatisticsVoList || []
        }
      })
    },
    changeCustomer() {
      this.form.channelId = ''
      this.form.planAmount = ''
      this.planId = ''
      this.customerList.forEach(item => {
        if (this.form.customerId == item.customerId) {
          this.ChannelType = item.returnMoneyStatisticsVoList || []
        }
      })
    },
    changeChannel() {
      let obj = {}
      this.ChannelType.forEach(item => {
        if (item.channelId == this.form.channelId) {
          obj = item
        }
      })
      this.form.planAmount = obj.planAmount
      this.planId = obj.planId
    },
    submit() {
      if (!this.$validate('form')) return
      let success = res => {
        if (res.code != 200) {
          this.$message.error(res.msg || '操作失败')
          return
        }
        this.$message.success('操作成功')
        this.dialogClose()
      }
      if (this.planId) {
        // updateInvoicePlanAmountRecord({ ...this.form, id: this.planId }).then(success)
        this.$message.error('请不要重复添加规划金额')
      } else {
        addInvoicePlanAmountRecord(this.form).then(success)
      }
      this.$emit('getList')
    },
    // ChannelType() { },
    // InvoiceType() { },
    dialogClose() {
      this.$emit('input', false)
    },

  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  text-align: center;
  margin-left: 10px;
  font-weight: 700;
}
</style>