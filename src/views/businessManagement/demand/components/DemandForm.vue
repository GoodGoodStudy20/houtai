<template>
  <div style="width:99%;margin:auto;">
    <div class="form-title">{{editType | typeName}}需求审批</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1" title="基础信息">
        <Form1 ref="form1" :editType="editType" :disabled="disabled" @change="formChange" @typeChange="typeChange" @agentTypeChange="agentTypeChange" @customerChange="customerChange" @oilCouponChange="oilCouponChange" @isIntegralChange="isIntegralChange" @incomeCahange="incomeCahange" @chooseReceipt="chooseReceipt"></Form1>
      </el-collapse-item>
      <el-collapse-item name="15" title="已选回单详情" v-show="receiptShow">
        <ChooseReceiptDetail ref="form15" :editType="editType" :disabled="disabled" @radioChange="radioChange"></ChooseReceiptDetail>
      </el-collapse-item>
      <!-- <el-collapse-item name="16" title="机构资金情况" v-show="receiptShow">
        <Form16 ref="form16" :editType="editType" :disabled="disabled"></Form16>
      </el-collapse-item> -->
      <el-collapse-item name="2" title="客户业务条件" v-show="customerShow">
        <Form2 ref="form2" :disabled="disabled"></Form2>
      </el-collapse-item>
      <el-collapse-item name="3" title="代理业务条件" v-show="showAgent">
        <Form3 ref="form3" :disabled="disabled"></Form3>
      </el-collapse-item>

      <el-collapse-item name="14" title="产品信息">
        <Form10 ref="form10" :disabled="disabled"></Form10>
      </el-collapse-item>
      <el-collapse-item name="11" title="业务合同">
        <Form8 ref="form8" :disabled="disabled"></Form8>
      </el-collapse-item>

      <el-collapse-item name="13" title="结算清单">
        <Form9 ref="form9" :disabled="disabled"></Form9>
      </el-collapse-item>

      <el-collapse-item name="10" title="服务清单">
        <Form7 ref="form7" :disabled="disabled"></Form7>
      </el-collapse-item>
      <el-collapse-item name="6" title="支付清单">
        <Form6 ref="form6" :disabled="disabled" @totalAmountChange="totalAmountChange"></Form6>
      </el-collapse-item>
      <el-collapse-item name="5" title="确权记录">
        <Form5 ref="form5" :disabled="disabled"></Form5>
      </el-collapse-item>

      <!-- <el-collapse-item name="8" title="付款信息" v-show="showPayment">
        <PaymentInformation ref="paymentForm" :showTime="true" :disabled="disabledPayment"></PaymentInformation>
      </el-collapse-item>
      <el-collapse-item name="9" title="内部往来" v-show="showPayment">
        <InsideIntercourse ref="insideForm" :disabled="disabledPayment"></InsideIntercourse>
      </el-collapse-item> -->
      <el-collapse-item name="7" title="流程">
        <ProcessForm ref="processForm_1" :disabled="disabled" type="0"></ProcessForm>
        <ProcessForm ref="processForm_2" :disabled="disabled" type="1" v-show="false"></ProcessForm>
      </el-collapse-item>
    </el-collapse>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <!-- <el-button type="primary" v-debounce="temporaryStorage" v-if="!disabled">保存</el-button> -->
      <el-button type="primary" v-debounce="submitBack" v-if="!disabled">保存返回</el-button>
      <el-button type="primary" v-debounce="submitTo" v-if="!disabled">提交</el-button>
      <el-button type="primary" @click="approveClick" v-if="editType=='approve' && showIssue==0">审批</el-button>
      <el-button type="primary" @click="approveClick" v-if="editType=='approve' && showIssue==1">办理</el-button>
      <el-button type="primary" @click="approveClick" v-if="editType=='approve' && showIssue==2">确认下发</el-button>
    </div>
    <ApproveDialog v-model="showDialog" v-if="showDialog" :idData="idData" :type='0' :relationshipId="editId" @success="approveSuccess" :showIssue="showIssue"></ApproveDialog>
  </div>
</template>

<script>
import { addDemandApproval, updateDemandApproval, getDemandApprovalInfo, addPaymentApproval, updatePaymentApproval, getReturnMoneyApprovalById } from '@/api/index.js'
import Form1 from './Form1'
import Form2 from './Form2'
import Form3 from './Form3'
import Form5 from './Form5'
import Form6 from './Form6'
import Form7 from './Form7'
import Form8 from './Form8'
import Form9 from './Form9'
import Form10 from './Form10'
import Form16 from './Form16'
import ChooseReceiptDetail from './ChooseReceiptDetail'
import PaymentInformation from '../../payment/components/PaymentInformation'
import InsideIntercourse from '../../payment/components/InsideIntercourse'
import ProcessForm from '../../components/ProcessForm'
import ApproveDialog from '../../components/ApproveDialog'
export default {
  name: 'DemandForm',
  components: { Form1, Form2, Form3, Form5, Form6, Form7, Form8, Form9, Form10, ProcessForm, ApproveDialog, PaymentInformation, InsideIntercourse, ChooseReceiptDetail, Form16 },
  props: ['value', 'editId', 'editType'],
  data() {
    return {
      activeNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '13', '14', '15', '16', '17'],
      customer: {},
      customerShow: false,
      showDialog: false,
      showAgent: false,
      receiptShow: false,
      form: {},
      idData: {},
      radio: "",
      item: {}
    }
  },
  mounted() {

    if (this.editId) {
      this.onload()
    }
    if (this.editType == 'add' || this.editType == 'copy') {
      this.$refs['processForm_1'].onload()
    }
    if (this.editType == 'approve') {
      this.$refs['processForm_2'].onload()
    }
  },
  methods: {
    totalAmountChange(data) {
      this.$refs['form1'].totalAmountChange(data)

    },
    radioChange(radio) {
      this.radio = radio
    },
    onload() {
      getDemandApprovalInfo({ id: this.editId }).then(async res => {
        let result = res.data || {}
        if (this.editType == 'copy') {
          result.submitTime = ''
          result.number = ''
        }
        await getReturnMoneyApprovalById({ id: this.editId }).then(res => {
          result.arrivalReceipt = res.data
          if (this.editType == 'copy') {
            result.returnMoneyListId = ''
          }
        })
        this.showAgent = result.isAgent == 1
        this.customer = { businessType: result.businessType }
        this.$refs['form1'].onload(result)
        this.$refs['form2'].onload(result)
        this.$refs['form3'].onload(result)
        this.customerShow = true
        this.$refs['form5'].onload(result)
        this.$refs['form6'].onload(result)
        if (result.returnMoneyDeductionVoList) {
          result.returnMoneyDeductionVoList.forEach(item => {
            result.arrivalReceipt.forEach(item1 => {
              if (item.returnMoneyId == item1.id) {
                this.$set(item1, "money", item.money)
              }
            })
          })
        }

        if (this.editType == 'copy') {
          this.$refs['processForm_1'].onload(result)
        } else {
          if (result.businessType == 1) {
            this.receiptShow = true
            this.$refs['form15'].onload(result.arrivalReceipt, result.arrivalAvailableMoney, result)
          }
          this.$refs['processForm_1'].onload(result)
        }
        this.$refs['form7'].onload(result)
        this.$refs['form9'].onload(result)
        this.$refs['form8'].onload(result)
        this.$refs['form10'].onload(result.productRelationVoList)
        this.form = result
        this.form.serviceCharge = this.form.defaultType == 0 ? this.form.advanceServiceCharge : this.form.noAdvanceServiceCharge
        let user = JSON.parse(sessionStorage.getItem('user'))
        this.idData = this.form.approvalProcessVoList && this.form.approvalProcessVoList.find(item => {
          return item.approvalId == user.id
        }) || {}
      })
    },
    chooseReceipt(list = [], arrivalAvailableMoney, income) {
      if (list.length > 0) {
        this.receiptShow = true
        this.$refs['form15'].onload(list, arrivalAvailableMoney)
        this.$refs['form15'].onload2(income)
      }
    },
    incomeCahange(income) {
      if (this.receiptShow) {
        this.$refs['form15'].incomeCahange(income)
      }
    },
    cancel() {
      if (this.$route.query.id) {
        this.$router.go(-1)
      } else {
        this.$emit('input', 0)
      }
    },
    formChange(item) {
      this.customer = item

      this.item = item
      this.customerShow = true
      this.receiptShow = false
      this.$refs['form2'].onload(this.customer)
      this.$refs['processForm_1'].Changeload(item)
    },
    customerChange(item) {
      this.$refs['form3'].onload(item)
    },
    typeChange(type) {

      if (type == 1) {
        this.receiptShow = true
      } else {
        this.receiptShow = false
      }
      this.customer = { businessType: type }
      this.$refs['form2'].businessType = type
      this.$refs['form6'].change(type)
      this.$refs['form7'].change(type)
      this.$refs['processForm_1'].Changeload(this.item)
      if (this.editType == 'copy' || this.editType == 'edit') {
        // this.$refs['processForm_1'].onload()
        this.$refs['processForm_1'].Changeload(this.item)
        // this.$message.warning('审批流程已变更')
      }
    },
    isIntegralChange() {
      // this.$refs['processForm_1'].Changeload(this.item)
      // if (this.editType == 'copy' || this.editType == 'edit') {
      // this.$refs['processForm_1'].onload()
      // this.$refs['processForm_1'].Changeload(this.item)
      // this.$message.warning('审批流程已变更')
      // }
    },
    oilCouponChange() {
      this.$refs['processForm_1'].Changeload(this.item)
      if (this.editType == 'copy' || this.editType == 'edit') {
        // this.$refs['processForm_1'].onload()
        this.$refs['processForm_1'].Changeload(this.item)
        this.$message.warning('审批流程已变更')
      }
    },
    agentTypeChange(type) {
      this.showAgent = type == 1
    },
    temporaryStorage() {
      this.submit(0)
    },
    submitBack() {
      this.submit(0, 'back')
    },
    submitTo() {
      this.submit(1, 'back')
    },
    submit(state, type = 0) {
      let form1 = this.$refs['form1'].commit()

      if (!form1) return
      let form2 = this.$refs['form2'].commit()
      if (!form2) return
      let form3 = this.showAgent ? this.$refs['form3'].commit() : {}
      if (this.showAgent && !form3) return
      if ((this.customer.defaultType == 1 || this.customer.businessType == 1) && form1.arrivalReceipt.length == 0) {
        this.$message.warning('请上传到账回单')
        return
      }
      let form5 = this.$refs['form5'].commit()
      if (!form5) {
        return
      }
      let form6 = this.$refs['form6'].commit()
      if (!form6) {
        return
      }
      let form7 = this.$refs['form7'].commit()
      if (!form7) {
        return
      }
      let form8 = this.$refs['form8'].commit()
      let form9 = this.$refs['form9'].commit()
      let form10 = this.$refs['form10'].commit()
      let data = {
        ...form1,
        ...form2,
        ...form3,
        ...form5,
        ...form6,
        ...form7,
        ...form8,
        ...form9,
        approvalStatus: state,
      }
      if (!form10 || form10.length == 0) {
        this.$message.warning('请完整配置产品信息')
        return
      }

      if (this.editType == 'add' || this.editType == 'copy') {
        data.addProductRelationReqList = form10;
        if (this.radio == 2) {
          let form15 = this.$refs['form15'].commit()
          if (!form15) return
          form15.forEach(item => {
            if (item.money === "") {
              this.$message.error("请输入本次申请金额")
            }
          })
          data.addCustomMoneyDeductionReqList = form15;
        }
      } else {
        data.updateProductRelationReqList = form10;
        if (this.radio == 2) {
          let form15 = this.$refs['form15'].commit()
          if (!form15) return
          data.updateCustomMoneyDeductionReqList = form15;
        }
      }
      let success = res => {
        if (res.code != 200) {
          this.$message.error(res.msg || '操作失败')
          return
        }
        this.$message.success('操作成功')
        if (type == 'back') {
          this.cancel()
        }
      }
      if (this.editType == 'add' || this.editType == 'copy') {
        addDemandApproval(data).then(success)
      } else {
        data.id = this.editId
        updateDemandApproval(data).then(success)
      }
    },
    approveClick() {
      if (this.showPayment && !this.disabledPayment) {
        let { list = [], date = '' } = this.$refs['paymentForm'].commit() || {}
        let index = list.findIndex(item => (item.rechargeAmount || item.rechargeAmount == 0) && (item.directAmount || item.directAmount == 0) && item.serviceId && item.subjectId)
        if (index == -1) {
          this.$message.warning('请填写支付信息')
          return
        }
        if (!date) {
          this.$message.warning('请选择付款日期')
          return
        }
      }
      this.showDialog = true
    },
    approveSuccess(state) {
      if (this.showPayment && !this.disabledPayment && state == 'success') {
        this.submitPayment()
      } else {
        this.cancel()
      }
    },
    submitPayment() {//审批生成付款审批
      if (this.form.paymentApprovalVoList && this.form.paymentApprovalVoList.length) {//编辑支付信息
        let { date = '', list = [] } = this.$refs['paymentForm'].commit() || {}
        let data = {
          id: this.form.paymentApprovalVoList[0].id,
          updatePaymentReqList: list,              //支付信息
          paymentDate: date,              //支付日期
          updateInternalTransactionsReqList: this.$refs['insideForm'].commit(),              //往来信息
        }
        updatePaymentApproval(data).then(res => {
          this.cancel()
        })
      } else {//新增支付信息
        // let processForm_2 = this.$refs['processForm_2'].commit() || []

        let { date = '', list = [] } = this.$refs['paymentForm'].commit() || {}
        let data = {
          approvalStatus: 0,               //状态
          businessCondition: this.form.businessType == 0 ? `${this.form.serviceCharge} (${this.form.interestFreeDays}) +${this.form.ratio}` : this.form.serviceCharge,              //业务条件
          businessType: this.form.businessType,              //业务类型(0.垫资,1.不垫资)
          customerId: this.form.customerId,              //客户id
          channelId: this.form.channelId,            //渠道
          demandId: this.form.id,              //需求id
          income: this.form.income,              //委托经营所得(元)
          isIntegral: this.form.isIntegral,              //是否积分(0.是,1.否)
          remark: '',                   //备注
          paymentListFile: this.form.detailedListFile,              //支付清单文件
          addPaymentReqList: list,              //支付信息
          paymentDate: date,              //支付日期
          // addApprovalProcessReqList: processForm_2,//审批流程
          addInternalTransactionsReqList: this.$refs['insideForm'].commit(), //往来信息
          isRelation: 1
        }
        addPaymentApproval(data).then(res => {
          this.cancel()
        })
      }
    }

  },
  computed: {
    disabled() {
      return this.editType == 'show' || this.editType == 'approve'
    },
    showPayment() {
      let show = false
      // if (this.form.isIntegral != 1) {
      //   return false
      // }
      if (this.editType == 'approve') {
        let user = JSON.parse(sessionStorage.getItem('user'))
        let item = this.form.approvalProcessVoList ? this.form.approvalProcessVoList.find(item => { return item.approvalId == user.id && (item.operationType == 0 || item.operationType == 2) }) : {}
        show = item.isUpdate == 1
      }

      if ((this.editType == 'show' || this.editType == 'approve') && this.form.paymentApprovalVoList && this.form.paymentApprovalVoList.length) {
        show = true
      }
      return show
    },
    disabledPayment() {
      let disabled = true
      if (this.editType == 'approve' && this.form.isIntegral == 1) {
        let user = JSON.parse(sessionStorage.getItem('user'))
        let item = this.form.approvalProcessVoList ? this.form.approvalProcessVoList.find(item => { return item.approvalId == user.id && (item.operationType == 0 || item.operationType == 2) }) : {}
        disabled = (item.isUpdate == 0 || item.isUpdate == 2)
      }
      return disabled
    },
    showIssue() {

      let show = 0//审批
      // if (this.form.businessType != 1) {
      //   return false
      // }
      if (this.editType == 'approve') {
        let user = JSON.parse(sessionStorage.getItem('user'))
        let item = this.form.approvalProcessVoList ? this.form.approvalProcessVoList.find(item => { return item.approvalId == user.id && (item.operationType == 0 || item.operationType == 2) }) : {}
        show = item.isUpdate
      }

      return show
    }
  }
}
</script>