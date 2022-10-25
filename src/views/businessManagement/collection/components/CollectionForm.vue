<template>
  <div>
    <div class="form-title">{{editType | typeName}}回款信息</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="到账信息" name="1">
        <Form1 ref="form1" :disabled="disabled" @receiptFile="receiptFile" @changeDiretor="changeDiretor" :editType="editType"></Form1>
      </el-collapse-item>
      <el-collapse-item title="到账凭证" name="3">
        <Form3 ref="form3" :disabled="disabled"></Form3>
      </el-collapse-item>
      <el-collapse-item title="业务信息" name="2" v-show="showPayment">
        <Form2 ref="form2" :disabled="disabledPayment"></Form2>
      </el-collapse-item>
      <el-collapse-item title="结算清单" name="4" v-show="showPayment">
        <Form4 ref="form4" :disabled="disabledPayment"></Form4>
      </el-collapse-item>
      <el-collapse-item name="5" title="流程">
        <ProcessForm ref="form5" :disabled="disabled" type="3"></ProcessForm>
      </el-collapse-item>
    </el-collapse>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <!-- <el-button type="primary" v-debounce="temporaryStorage" v-if="!disabled">保存</el-button> -->
      <el-button type="primary" v-debounce="submitBack" v-if="!disabled">保存返回</el-button>
      <el-button type="primary" v-debounce="submitTo" v-if="!disabled">提交</el-button>
      <el-button type="primary" @click="approveClick" v-if="editType=='approve'">审批</el-button>
    </div>
    <ApproveDialog v-model="showDialog" v-if="showDialog" :idData="idData" :showIssue="showIssue" :type='3' :relationshipId="editId" @success="approveSuccess"></ApproveDialog>
  </div>
</template>

<script>
import { addReturnMoneyApproval, updateReturnMoneyApproval, getReturnMoneyApprovalInfo, updateIsRead } from '@/api/index.js'
import Form1 from './Form1'
import Form2 from './Form2'
import Form3 from './Form3'
import Form4 from './Form4'
import ProcessForm from '../../components/ProcessForm'
import ApproveDialog from '../../components/ApproveDialog'
export default {
  name: 'CollectionForm',
  components: { Form1, Form2, Form3, Form4, ApproveDialog, ProcessForm },
  props: ['value', 'editId', 'editType'],
  data() {
    return {
      activeNames: ['1', '2', '3', '4', '5'],
      showDialog: false,
      form: {},
      idData: {},
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
    changeDiretor(data) {
      this.$refs['form5'].diretorChange(data)
    },
    //修改已读
    readUpdate(data) {
      updateIsRead(data).then(res => { })
    },
    receiptFile(item) {
      this.$refs['form3'].change(item)
    },
    onload() {
      getReturnMoneyApprovalInfo({ id: this.editId }).then(res => {
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
        this.$refs['form2'].onload(result)
        this.$refs['form3'].onload(result)
        this.$refs['form4'].onload(result)
        this.$refs['form5'].onload(result)
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
      let form3 = this.$refs['form3'].commit()
      if (!form3) {
        this.$message.warning('请上传到账凭证')
        return
      }
      let data = { ...form, ...form3, approvalStatus: state }
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
        addReturnMoneyApproval(data).then(success)
      } else {
        data.id = this.editId
        updateReturnMoneyApproval(data).then(success)
      }
    },
    approveClick() {
      if (this.showPayment && !this.disabledPayment) {
        let form2 = this.$refs['form2'].commit()
        if (!form2) {
          return
        }
        if (this.form.amount > form2.invoicingAmount) {
          this.$message.warning('发票总额需大于回款金额')
          return;
        }
        let form4 = this.$refs['form4'].commit()
        if (!form4) {
          this.$message.warning('请上传结算清单文件')
          return
        }

        let data = { ...form2, ...form4 }
        data.id = this.editId
        updateReturnMoneyApproval(data).then(res => this.showDialog = true)

      } else {
        this.showDialog = true
      }
    },
    approveSuccess(state) {
      if (state == 'success') {
        this.cancel()
      }
    },
  },
  computed: {
    disabled() {
      return this.editType == 'show' || this.editType == 'approve'
    },
    showPayment() {
      let show = false
      if (this.editType == 'approve') {
        let user = JSON.parse(sessionStorage.getItem('user'))
        let item = this.form.approvalProcessVoList ? this.form.approvalProcessVoList.find(item => { return item.approvalId == user.id && (item.operationType == 0 || item.operationType == 2) }) : {}
        show = item.isUpdate == 1
      }
      if (this.editType == 'show' && this.form.invoiceApprovalVoList) {
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
