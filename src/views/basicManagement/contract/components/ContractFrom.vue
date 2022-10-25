<template>
  <div>
    <div class="form-title" v-if="contractType!=1">{{editType | typeName}}合同信息</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基础信息" name="1">
        <Form1 ref="form1" :disabled="editType=='show'" :contractType="contractType"></Form1>
      </el-collapse-item>
      <!-- <el-collapse-item title="乙方财税信息" name="3">
        <Form3 ref="form3" :disabled="editType=='show'"></Form3>
      </el-collapse-item> -->
      <el-collapse-item name="14" title="产品信息">
        <Form10 ref="form14" :disabled="editType=='show'"></Form10>
      </el-collapse-item>
      <el-collapse-item title="合同文件" name="2">
        <Form2 ref="form2" :disabled="editType=='show'"></Form2>
      </el-collapse-item>
      <el-collapse-item name="7" title="流程">
        <ProcessForm ref="form7" type="5" :disabled="disabled"></ProcessForm>
      </el-collapse-item>
    </el-collapse>

    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" v-debounce="submitBack" v-if="!disabled">保存返回</el-button>
      <el-button type="primary" v-debounce="submitTo" v-if="!disabled">提交</el-button>
      <el-button type="primary" @click="approveClick" v-if="editType=='approve' && showIssue==0">审批</el-button>
    </div>
    <ApproveDialog v-model="showDialog" v-if="showDialog" :idData="idData" :type='5' :relationshipId="editId" @success="approveSuccess" :showIssue="showIssue"></ApproveDialog>

    <!-- <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" v-debounce="submitBack" v-if="editType!='show'">保存返回</el-button>
    </div> -->
  </div>
</template>

<script>
import { addContract, updateContract, getContractInfo, submitContractApproval } from '@/api/index.js'
import ProcessForm from '../../../businessManagement/components/ProcessForm'
import ApproveDialog from '../../../businessManagement/components/ApproveDialog'
import Form1 from './Form1'
import Form2 from './Form2'
import Form10 from './Form10'
export default {
  name: 'ContractFrom',
  components: { Form1, Form2, Form10, ProcessForm, ApproveDialog },
  props: ['value', 'editId', 'editType', 'contractType'],
  data() {
    return {
      activeNames: ['1', '2', '3', '7', '14'],
      showDialog: false
    }
  },
  mounted() {
    console.log(this.contractType);
    if (this.editId) {
      this.onload()
    }
    if (this.editType == 'add' || this.editType == 'edit' || this.editType == 'copy') {
      this.$refs['form7'].onload()
    }
  },
  methods: {
    onload() {
      getContractInfo({ id: this.editId }).then(res => {
        let result = res.data || {}
        this.$refs['form1'].onload(result)
        this.$refs['form2'].onload(result)
        this.$refs['form14'].onload(result.productRelationVoList)
      })
    },
    cancel() {
      this.$emit('input', 0)
    },
    submitBack() {
      this.submit(0, 'back')
    },
    submitTo() {
      this.submit(1, 'back')
    },
    submit(state, type) {
      let form = this.$refs['form1'].commit()
      if (!form) return
      let form2 = this.$refs['form2'].commit()
      let form14 = this.$refs['form14'].commit() //产品信息
      if (!form14 || form14.length == 0) {
        this.$message.error('请配置产品信息')
        return
      }

      let data = { ...form, ...form2, approvalStatus: state }
      if (this.editId) {
        data.updateProductRelationReqList = form14;
      } else {
        data.addProductRelationReqList = form14;
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
        addContract(data).then(success)
      } else {
        data.id = this.editId
        updateContract(data).then(success)
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
  },
  computed: {
    disabled() {
      return this.editType == 'show' || this.editType == 'approve'
    },
  }
}
</script>