<template>
  <div>
    <div class="form-title">{{ editType | typeName }}发票信息</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="开票要求" name="1">
        <Form1 ref="form1" :disabled="disabled" @customerChange='customerChange' @typeChange="typeChange"></Form1>
      </el-collapse-item>
      <!-- <el-collapse-item title="结算清单(未盖章)" name="3">
        <Form3 ref="form3" :disabled="disabled"></Form3>
      </el-collapse-item> -->
      <el-collapse-item title="结算清单(盖章文件)" name="7">
        <Form7 ref="form7" :disabled="disabled2"></Form7>
      </el-collapse-item>
      <el-collapse-item title="开票详情" name="6" v-show="showPayment">
        <Form6 ref="form6" :editType="editType" :disabled="disabledPayment"></Form6>
      </el-collapse-item>
      <!-- <el-collapse-item title="发票文件（建议上传图片）" name="2" v-show="showPayment">
        <Form2 ref="form2" :disabled="disabledPayment"></Form2>
      </el-collapse-item> -->
      <el-collapse-item title="客户发票信息" name="9" v-show="customerId">
        <Form9 ref="form9" :disabled="disabled"></Form9>
      </el-collapse-item>
      <el-collapse-item title="物流信息" name="4" v-show="showForm4">
        <Form4 ref="form4" :disabled="disabled"></Form4>
      </el-collapse-item>
      <el-collapse-item title="回款信息" name="5" v-show="editType == 'show' && form.approvalStatus == 2">
        <Form5 :list="list"></Form5>
      </el-collapse-item>
      <el-collapse-item title="流程" name="8">
        <ProcessForm ref="form8" :disabled="disabled" type="2"></ProcessForm>
      </el-collapse-item>
    </el-collapse>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <!-- <el-button type="primary" v-debounce="temporaryStorage" v-if="!disabled">保存</el-button> -->
      <el-button type="primary" v-debounce="submitBack" v-if="!disabled || showIssue == 1">保存返回</el-button>
      <el-button type="primary" v-debounce="submitTo" v-if="!disabled">提交</el-button>
      <!-- <el-button type="primary" v-debounce="approveClick" v-if="editType=='approve'">审批</el-button> -->
      <el-button type="primary" v-debounce="approveClick" v-if="editType == 'approve' && showIssue == 0">审批</el-button>
      <!-- <el-button type="primary" v-debounce="approveClick" v-if="editType == 'approve' && showIssue == 2">办理</el-button> -->
      <!-- <el-button type="primary" v-debounce="approveClick" v-if="editType == 'approve' && showIssue == 2">确认下发</el-button> -->
    </div>
    <ApproveDialog v-model="showDialog" v-if="showDialog" :idData="idData" :type='2' :relationshipId="editId" @success="approveSuccess" :showIssue="showIssue"></ApproveDialog>
  </div>
</template>

<script>
import { addInvoiceApproval, updateInvoiceApproval, getInvoiceApprovalInfo, updateIsRead } from '@/api/index.js'
import Form1 from './Form1'
// import Form2 from './Form2'
// import Form3 from './Form3'
import Form4 from './Form4'
import Form5 from './Form5'
import Form6 from './Form6'
import Form7 from './Form7'
import Form9 from './Form9'
import ApproveDialog from '../../components/ApproveDialog'
import ProcessForm from '../../components/ProcessForm'
export default {
  name: 'InvoiceForm',
  components: { Form1, Form4, Form5, Form6, Form7, Form9, ApproveDialog, ProcessForm },
  props: ['value', 'editId', 'editType'],
  data() {
    return {
      activeNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      showForm4: false,
      list: [],
      showDialog: false,
      form: {},
      idData: {},
      customerId: ''
    }
  },
  mounted() {
    if (this.editId) {
      this.onload()
    }
    if (this.editType == 'add' || this.editType == 'copy') {
      this.$refs['form8'].onload()
    }
  },
  methods: {
    //修改已读
    readUpdate(data) {
      updateIsRead(data).then(res => { })
    },
    onload() {
      getInvoiceApprovalInfo({ id: this.editId }).then(res => {
        let result = res.data || {}
        this.form = result
        if (this.editType == 'copy') {
          result.submitTime = ''
          result.number = ''
          result.approvalProcessVoList = result.approvalProcessVoList.map(item => {
            item.evaluateContent = ''
            item.updateTime = ''
            item.isApproval = ''
            return item
          })
        }
        this.$refs['form1'].onload(result)
        // this.$refs['form2'].onload(result)
        // this.$refs['form3'].onload(result)
        this.$refs['form4'].onload(result)
        this.$refs['form9'].onload(result.customerVo.invoiceVo)
        if (result.customerVo) {
          this.customerId = result.customerVo.invoiceVo.id
        }
        this.$nextTick(() => {
          this.$refs['form6'].onload(result)
        })
        this.$refs['form7'].onload(result)
        this.$refs['form8'].onload(result)
        this.list = result.invoiceReturnMoneyRecordVoList
        this.typeChange(result.type)
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
    cancel() {
      if (this.$route.query.id) {
        this.$router.go(-1)
      } else {
        this.$emit('input', 0)
      }
    },
    customerChange(item) {
      this.customerId = item.id
      this.$refs['form4'].onload(item)
      this.$refs['form9'].onload(item)
    },
    typeChange(type) {
      this.showForm4 = [0, 1].includes(type)
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
      // let form3 = this.$refs['form3'].commit()
      // if (!form3) return
      let form4 = this.$refs['form4'].commit()

      let form7 = this.$refs['form7'].commit()
      if (!form7) return

      // let form8 = this.$refs['form8'].commit()
      // if (!form8) {
      //   this.$message.warning('没查询到审批流程，请联系管理员添加')
      //   return
      // }
      let data = {
        ...form,
        // ...form3,
        ...form4,
        ...form7,
        // addApprovalProcessReqList: form8,
        approvalStatus: state,
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
        // data.addInvoiceFileReqList = form6.InvoiceFileReqList
        addInvoiceApproval(data).then(success)
      } else if (this.editType == 'approve') {
        data.id = this.editId
        let form6 = this.$refs['form6'].commit()
        if (!form6) return
        data.updateInvoiceFileReqList = form6.InvoiceFileReqList
        data.invoicingUserId = form6.invoicingUserId
        data.viceRemark = form6.viceRemark
        data.invoicingDate = form6.invoicingDate
        if (form6.InvoiceFileReqList) {
          data.approvalStatus = ''
        }
        updateInvoiceApproval(data).then(success)
      } else {
        data.id = this.editId
        updateInvoiceApproval(data).then(success)
      }
    },
    approveClick() {
      if (this.showPayment && !this.disabledPayment) {
        // let form2 = this.$refs['form2'].commit()
        // if (!form2) return
        let form6 = this.$refs['form6'].commit()
        if (!form6) return
        // let form7 = this.$refs['form7'].commit()
        // if (!form7) return
      }
      this.showDialog = true
    },
    approveSuccess() {
      if (this.showPayment && !this.disabledPayment) {
        // let form2 = this.$refs['form2'].commit()
        let form6 = this.$refs['form6'].commit()
        // let form7 = this.$refs['form7'].commit()
        let data = {
          ...form6,
          // ...form7,
          id: this.editId
        }
        data.updateInvoiceFileReqList = form6.InvoiceFileReqList
        data.approvalStatus = ''
        let success = res => {
          if (res.code != 200) {
            this.$message.error(res.msg || '操作失败')
            return
          }
          this.$message.success('操作成功')
          this.cancel()
        }
        updateInvoiceApproval(data).then(success)
      } else {
        this.cancel()
      }
    },
  },
  computed: {
    disabled() {
      return this.editType == 'show' || this.editType == 'approve'
    },
    disabled2() {
      let sealDetailedListFile = this.form.sealDetailedListFile ? JSON.parse(this.form.sealDetailedListFile) : []
      return this.editType == 'show' || (this.editType == 'approve' && sealDetailedListFile > 0)
    },
    showPayment() {
      let show = false
      if (this.editType == 'approve') {
        let user = JSON.parse(sessionStorage.getItem('user'))
        let item = this.form.approvalProcessVoList ? this.form.approvalProcessVoList.find(item => { return item.approvalId == user.id && (item.operationType == 0 || item.operationType == 2) }) : {}
        show = !!item.isUpdate
      }
      // if (this.editType == 'show' && this.form.subjectId) {
      if (this.editType == 'show' && this.form.invoiceFileVoList && this.form.invoiceFileVoList.length > 0) {
        show = true
      }
      return show
    },
    disabledPayment() {
      let disabled = true
      if (this.editType == 'approve') {
        let user = JSON.parse(sessionStorage.getItem('user'))
        let item = this.form.approvalProcessVoList ? this.form.approvalProcessVoList.find(item => { return item.approvalId == user.id && (item.operationType == 0 || item.operationType == 2) }) : {}
        disabled = !item.isUpdate
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
        show = item.operationType
      }
      return show
    }
  }
}
</script>
