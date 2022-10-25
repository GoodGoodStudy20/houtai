<template>
  <div>
    <div class="header">
      <div class="breadcrumb">
        <el-page-header :title="pathName.label" @back="goBack" :content="editType=='add'?'添加历史应收信息':editType=='edit'?'编辑历史应收信息':editType=='show'?'查看历史应收信息':'历史应收信息'">
        </el-page-header>
      </div>
      <div class="form-title">{{editType | typeName}}历史应收信息</div>
    </div>
    <!-- <div class="form-title">{{editType | typeName}}历史应收信息</div> -->
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <Form1 ref="form1" :disabled="disabled" :editType="editType" @customerChange="customerChange" @receivableTotalChange="receivableTotalChange" style="width:600px;margin:0 auto"></Form1>
      </el-collapse-item>
      <el-collapse-item title="客户业务条件" name="2">
        <Form2 ref="form2" :disabled="disabled && editType!='refund'" style="width:650px"></Form2>
      </el-collapse-item>
      <el-collapse-item title="回款记录" name="3">
        <Form3 ref="form3" :disabled="disabled && editType!='refund'" :editType="editType" style="width:1050px"></Form3>
      </el-collapse-item>
    </el-collapse>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" v-if="!disabled" v-debounce="submitBack">保存返回</el-button>
      <el-button type="primary" v-if="!disabled" v-debounce="submitTo">提交</el-button>
    </div>
  </div>
</template>

<script>

import { addHistoryReceivable, updateHisCustomer, getHistoryReceivableInfo } from '@/api/index.js'
import Form1 from './Form1'
import Form2 from './Form2'
import Form3 from './Form3'
export default {
  name: 'addHistoricalReceivables',
  components: { Form1, Form3, Form2 },
  props: ['value', 'editId', 'editType'],
  data() {
    return {
      activeNames: ['1', '2', '3'],
      isIntegral: 0,
      showDialog: false,
      refundVoList: [],
      pathName: {}
    }
  },
  mounted() {
    this.pathName = JSON.parse(sessionStorage.getItem('title'))
    if (this.editId) {
      this.onload()
    }
  },
  computed: {
    disabled() {
      return this.editType == 'show' || this.editType == 'approve'
    },
  },
  methods: {
    goBack() {
      this.cancel()
    },
    customerChange(item) {
      this.$refs['form2'].onload(item)
    },
    receivableTotalChange(item) {
      this.$refs['form3'].onloadChange(item)
    },
    onload() {
      getHistoryReceivableInfo({ id: this.editId }).then(res => {
        let result = res.data || {}
        // this.repaymentType = Number(result.repaymentType)
        this.$refs['form1'].onload(result)
        this.$refs['form2'].onload(result)
        this.$refs['form3'].onload(result)
      })
    },
    // onload() {
    //   getPaymentApprovalInfo({ id: this.editId }).then(res => {
    //     let result = res.data || {}
    //     if (this.editType == 'copy') {
    //       result.submitTime = ''
    //       // result.number = ''
    //       result.approvalProcessVoList = result.approvalProcessVoList.map(item => {
    //         item.evaluateContent = ''
    //         item.updateTime = ''
    //         item.isApproval = ''
    //         return item
    //       })
    //     }
    //     this.$refs['form1'].onload(result)
    //     this.$refs['form2'].onload(result.paymentVoList, result.paymentDate)
    //     this.$refs['form3'].onload(result.paymentListFile)
    //     this.isIntegral = result.isIntegral
    //     this.refundVoList = result.refundVoList
    //   })
    // },
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
      let form1 = this.$refs['form1'].commit()
      if (!form1) return
      let form2 = this.$refs['form2'].commit()
      if (!form2) return
      let form3 = this.$refs['form3'].commit()
      // let { list = [], date = '' } = this.$refs['form2'].commit() || {}
      let data1 = {
        ...form1,
        ...form2,
        addReturnMoneyRecordReqList: form3,
        // approvalStatus: state
      }
      let data2 = {
        ...form1,
        ...form2,
        updateReturnMoneyRecordReqList: form3,
        // approvalStatus: state
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
      if (this.editType == 'add') {
        // data.addPaymentReqList = list
        // data.addApprovalProcessReqList = form5
        // data.addInternalTransactionsReqList = form6
        addHistoryReceivable(data1).then(success)
      } else {
        // data.id = this.editId
        // data.updatePaymentReqList = list
        // if (this.editType != 'refund') {
        //   data.addApprovalProcessReqList = form5
        // }
        // data.updateInternalTransactionsReqList = form6
        // data.updateRefundReqList = form7
        updateHisCustomer(data2).then(success)
      }
    }
  },
  computed: {
    disabled() {
      return this.editType == 'show' || this.editType == 'approve' || this.editType == 'refund'
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  position: relative;
  .breadcrumb {
    position: absolute;
    top: 13px;
  }
  ::v-deep .el-icon-back {
    display: none;
  }
  ::v-deep .el-page-header__title {
    color: #606266;
  }
  ::v-deep .el-page-header__content {
    color: #303132;
    font-weight: 700;
    font-size: 14px;
  }
  ::v-deep .el-page-header__left::after {
    transform: translateY(-50%) rotate(15deg);
    background-color: #c0c4cc;
  }
}
</style>