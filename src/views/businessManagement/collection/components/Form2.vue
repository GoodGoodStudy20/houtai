<template>
  <el-form size="small" ref="form" :model="form" label-width="80px" :disabled="disabled" class="block-form">
    <el-form-item label="关联发票" prop="invoiceListId" :rules="[
        { required: true, message: '关联发票不可为空', trigger: 'change' },
      ]">
      <el-button type="primary" @click="show = true">选择</el-button>
    </el-form-item>
    <el-dialog title="选择关联发票" :visible.sync="show" :close-on-click-modal="false" width="1250px">
      <InvoiceList v-if="show" ref="invoice" @select="invoiceSelect" :params="params" :paramsSelectedListId="form.invoiceListId" select style="text-align: left"></InvoiceList>
      <el-button @click="clickSure" type="primary" style="margin-top: 20px">确定</el-button>
    </el-dialog>
    <ChooseInvoiceDetail :editId="editId" @radioChange="radioChange" v-if="invoiceList && invoiceList.length>0" ref="invoicedetail"></ChooseInvoiceDetail>
  </el-form>
</template>

<script>
import ChooseCustomer from "@/components/ChooseCustomer/index.vue";
import ChooseInvoiceDetail from './ChooseInvoiceDetail'
import { InvoiceType, BusinessType } from "@/utils/field.js";
import { Assign } from "@/utils/index.js";
import InvoiceList from "@/views/businessManagement/invoice/components/InvoiceList.vue";
export default {
  name: "Form2",
  components: { InvoiceList, ChooseCustomer, ChooseInvoiceDetail },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    editId: {
      type: Number,
      // default: 0,
    },
  },
  data() {
    return {
      form: {
        customerId: "", //客户id
        channelId: "", //渠道
        businessType: "", //业务模式
        invoiceListId: "", //开票id
        invoicingAmount: 0,
        channelName: "",
      },
      ChannelType: [],
      params: {
        customerId: "",
        subjectId: "",
        isControl: 1,
        approvalStatus: 2,
        isProvince: 1,
        returnStatus: 1, //查询余额大于0的发票
      },
      InvoiceType: InvoiceType,
      BusinessType: BusinessType,
      show: false,
      invoiceList: [],
      radio: '',
      amount: ''
    };
  },
  created() { },
  methods: {
    radioChange(radio) {
      this.radio = radio
    },
    clickSure() {
      this.show = false
      this.$refs['invoicedetail'].onload2(this.amount, this.form.businessType)
      this.$refs['invoicedetail'].onload(this.invoiceList)
    },
    onload(obj) {
      Assign(this.form, obj);
      this.params.customerId = obj.payerId;
      this.invoiceList = obj.invoiceApprovalVoList || [];
      this.amount = obj.amount
      if (obj.customerChannelVo) {
        this.ChannelType = [obj.customerChannelVo];
      }
    },
    changeCustomer(item, type) {
      this.ChannelType = item.customerChannelVoList;
    },
    invoiceSelect(row) {

      this.form.businessType = row.invoicingNature;

      this.form.customerId = row.customerId;
      this.ChannelType = [row.customerChannelVo];
      this.form.channelId = row.channelId;
      this.form.channelName = row.customerChannelVo.name;
      let _index = this.invoiceList.findIndex(
        (invoice) => invoice.id == row.id
      );
      if (_index != -1) {
        this.invoiceList.splice(_index, 1);
      } else {
        this.invoiceList.push(row);
      }
      this.invoiceIdList = [];
      //计算发票总金额
      let _sumMoney = 0;
      for (let invoice of this.invoiceList) {
        _sumMoney += invoice.invoicingAmount;
        this.invoiceIdList.push(invoice.id);
      }
      this.form.invoicingAmount = _sumMoney;
      this.form.invoiceListId = this.invoiceIdList.toString();
      this.$bus.$emit("invoiceSelect", this.invoiceList);
    },
    commit() {
      if (this.radio == 2) {
        let form = this.$refs['invoicedetail'].commit()
        this.form.returnAmountDeductionInvoiceList = form.returnAmountDeductionInvoiceList
        if (this.form.businessType == 0) {
          this.form.returnAmountDeductionDemandList = form.returnAmountDeductionDemandList
        }
        if (!this.form.returnAmountDeductionInvoiceList) return
      }
      if (!this.form.invoiceListId) {
        this.$message.warning("请选择关联发票");
        return;
      }
      let obj = Object.assign({}, this.form);

      return obj;
    },
  },
};
</script>

<style>
</style>