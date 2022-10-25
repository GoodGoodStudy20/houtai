<template>
  <div>
    <div class="form-title">{{editType | typeName}}付款审批</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基础信息" name="1">
        <Form1 ref="form1" :disabled="disabled" @integral="integralChange" @demand="demandChange"></Form1>
      </el-collapse-item>
      <el-collapse-item title="支付信息" name="2">
        <PaymentInformation ref="form2" :disabled="disabled"></PaymentInformation>
      </el-collapse-item>
      <el-collapse-item title="退票信息" name="7" v-show="editType=='refund' || (refundVoList && refundVoList.length)">
        <Form6 ref="form7" :disabled="disabled && editType!='refund'"></Form6>
      </el-collapse-item>
      <el-collapse-item title="内部往来" name="6">
        <InsideIntercourse ref="form6" :disabled="disabled"></InsideIntercourse>
      </el-collapse-item>
      <el-collapse-item title="支付清单" name="3">
        <Form3 ref="form3" :disabled="disabled"></Form3>
      </el-collapse-item>
      <el-collapse-item title="流程" name="5">
        <ProcessForm ref="form5" :disabled="disabled" type="1"></ProcessForm>
      </el-collapse-item>
    </el-collapse>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <!-- <el-button type="primary" v-debounce="temporaryStorage" v-if="!disabled || editType=='refund'">保存</el-button> -->
      <el-button type="primary" v-debounce="submitBack" v-if="!disabled || editType=='refund'">保存返回</el-button>
      <el-button type="primary" v-debounce="submitTo" v-if="!disabled">提交</el-button>
      <!-- <el-button type="primary" v-debounce="approveClick" v-if="editType=='approve'">审批</el-button> -->
      <el-button type="primary" v-debounce="approveClick" v-if="editType=='approve' && showIssue==0">审批</el-button>
      <el-button type="primary" v-debounce="approveClick" v-if="editType=='approve' && showIssue==1">办理</el-button>
      <el-button type="primary" v-debounce="approveClick" v-if="editType=='approve' && showIssue==2">确认下发</el-button>
    </div>
    <ApproveDialog v-model="showDialog" v-if="showDialog" :idData="idData" :showIssue="showIssue" :type='1' :relationshipId="editId" @success="cancel"></ApproveDialog>
  </div>
</template>

<script>

import { addPaymentApproval, updatePaymentApproval, getPaymentApprovalInfo, updateIsRead } from '@/api/index.js'
import Form1 from './Form1'
import Form6 from './Form6'
import PaymentInformation from './PaymentInformation'
import InsideIntercourse from './InsideIntercourse'
import Form3 from './Form3'
import ProcessForm from '../../components/ProcessForm.vue'
import ApproveDialog from '../../components/ApproveDialog'
export default {
  name: 'PaymentForm',
  components: { Form1, PaymentInformation, InsideIntercourse, Form3, ProcessForm, Form6, ApproveDialog },
  props: ['value', 'editId', 'editType'],
  data() {
    return {
      activeNames: ['1', '2', '3', '4', '5', '6', '7'],
      isIntegral: 0,
      showDialog: false,
      refundVoList: [],
      idData: {},
      form: {}
    }
  },
  mounted() {

    if (this.editId) {
      this.onload()
    }
    if (this.editType == 'add' || this.editType == 'copy') {
      this.$refs['form5'].onload()
    }
  },
  methods: {
    //修改已读
    readUpdate(data) {
      updateIsRead(data).then(res => { })
    },
    approveClick() {
      this.showDialog = true;
    },
    onload() {
      getPaymentApprovalInfo({ id: this.editId }).then(res => {
        let result = res.data || {}
        this.form = result
        if (this.editType == 'copy') {
          result.submitTime = ''
          // result.number = ''
          result.approvalProcessVoList = result.approvalProcessVoList.map(item => {
            item.evaluateContent = ''
            item.updateTime = ''
            item.isApproval = ''
            return item
          })
        }
        this.$refs['form1'].onload(result)
        this.$refs['form2'].onload(result.paymentVoList, result.paymentDate)
        this.$refs['form3'].onload(result.paymentListFile)
        this.$refs['form5'].onload(result)
        this.$refs['form6'].onload(result.internalTransactionsVoList)
        this.$refs['form7'].onload(result)
        this.isIntegral = result.isIntegral
        this.refundVoList = result.refundVoList
        let user = JSON.parse(sessionStorage.getItem('user'))
        this.idData = result.approvalProcessVoList && result.approvalProcessVoList.find(item => {
          return item.approvalId == user.id && (item.operationType == 0 || item.operationType == 2)
        }) || {}
        if (this.$route.query.id) {
          if (this.$route.query.state == 1 && this.editType == 'show') {
            let isCopyData = result.approvalProcessVoList && result.approvalProcessVoList.find(item => {
              return item.approvalId == user.id && item.operationType == 1
            }) || {}
            let data = {
              id: isCopyData.id
            }
            this.readUpdate(data)
          }
        }
      })
    },
    integralChange(val) {
      this.isIntegral = val
    },
    demandChange(val) {
      this.$refs['form3'].onload(val)
    },
    cancel() {
      if (this.$route.query.id) {
        this.$router.go(-1)
      } else {
        this.$emit('input', 0)
      }
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
      let form = this.$refs['form1'].commit()
      if (!form) return
      let { list = [], date = '' } = this.$refs['form2'].commit() || {}
      //if (!date) {
      //  return
      //}
      let form3 = this.isIntegral == 1 ? this.$refs['form3'].commit() : { paymentListFile: '' }
      // let form5 = this.$refs['form5'].commit()

      // if (!form5) {
      //   this.$message.warning('没查询到审批流程，请联系管理员添加')
      //   return
      // }
      let form6 = this.$refs['form6'].commit()
      let data = {
        ...form,
        ...form3,
        approvalStatus: state
      }
      if (this.editType == 'refund') {
        delete data.approvalStatus
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
        data.addPaymentReqList = list
        // data.addApprovalProcessReqList = form5
        data.addInternalTransactionsReqList = form6
        addPaymentApproval(data).then(success)
      } else {
        let form7 = this.$refs['form7'].commit()
        data.id = this.editId
        data.updatePaymentReqList = list
        // if (this.editType != 'refund') {
        //   data.addApprovalProcessReqList = form5
        // }
        data.updateInternalTransactionsReqList = form6
        data.updateRefundReqList = form7
        updatePaymentApproval(data).then(success)
      }
    }
  },
  computed: {
    disabled() {
      return this.editType == 'show' || this.editType == 'approve' || this.editType == 'refund'
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