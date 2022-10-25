<template>
  <div>
    <div class="form-title">{{editType | typeName}}主体信息</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基础信息" name="1">
        <Form1 ref="form1" :disabled="editType=='show'"></Form1>
      </el-collapse-item>
      <el-collapse-item title="股东监事信息" name="2">
        <Form2 ref="form2" :disabled="editType=='show'"></Form2>
      </el-collapse-item>
      <el-collapse-item title="账户/税务信息" name="3">
        <Form3 ref="form3" :disabled="editType=='show'"></Form3>
      </el-collapse-item>
      <el-collapse-item title="开票限制" name="6">
        <Form6 ref="form6" :disabled="editType=='show'"></Form6>
      </el-collapse-item>
      <el-collapse-item title="证件信息" name="4">
        <Form4 ref="form4" :disabled="editType=='show'"></Form4>
      </el-collapse-item>
      <el-collapse-item title="工商年报文件" name="7">
        <Form7 ref="form7" :disabled="editType == 'show'"></Form7>
      </el-collapse-item>
      <el-collapse-item title="账号密码" name="5">
        <Form5 ref="form5" :disabled="editType=='show'"></Form5>
      </el-collapse-item>
      <el-collapse-item title="合同信息" name="8" v-if="editType=='show'">
        <Contract :disabled="true" :subjectId="subjectId"></Contract>
      </el-collapse-item>
    </el-collapse>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <!-- <el-button type="primary" v-debounce="submit" v-if="editType!='show'">保存</el-button> -->
      <el-button type="primary" v-debounce="submitBack" v-if="editType!='show'">保存返回</el-button>
    </div>
  </div>
</template>

<script>
import { addSubject, updateSubject, getSubjectInfo } from '@/api/index.js'
import Form1 from './Form1'
import Form2 from './Form2'
import Form3 from './Form3'
import Form4 from './Form4'
import Form5 from './Form5'
import Form6 from './Form6'
import Form7 from './Form7'
import Contract from '../../contract/index.vue'
export default {
  name: 'SubjectForm',
  components: { Form1, Form2, Form3, Form4, Form5, Form6, Contract, Form7 },
  props: ['value', 'subjectId', 'editType'],
  data() {
    return {
      activeNames: ['1', '2', '3', '4', '5', '6', '7', '8'],
    }
  },
  mounted() {
    if (this.subjectId) {
      this.onload()
    }
  },
  methods: {
    onload() {
      getSubjectInfo({ id: this.subjectId }).then(res => {
        let result = res.data || {}
        this.$refs['form1'].onload(result)
        this.$refs['form2'].onload(result.shareholderSupervisorVoList)
        this.$refs['form3'].onload(result.accountTaxVoList)
        this.$refs['form4'].onload(result)
        this.$refs['form5'].onload(result.accountPasswordVoList)
        this.$refs['form6'].onload(result)
        this.$refs['form7'].onload(result)
      })
    },
    cancel() {
      this.$emit('input', 0)
    },
    submitBack() {
      this.submit('back')
    },
    submit(type) {
      let form = this.$refs['form1'].commit()
      if (!form) return
      let addShareholderSupervisorReqList = this.$refs['form2'].commit()
      if (!addShareholderSupervisorReqList) return
      let addAccountTaxReqList = this.$refs['form3'].commit()
      let imgs = this.$refs['form4'].commit()
      let addAccountPasswordReqList = this.$refs['form5'].commit()
      let form6 = this.$refs['form6'].commit()
      let addInvoiceRestrictionsReqList = form6.addInvoiceRestrictionsReqList
      if (!form6) return
      let form7 = this.$refs['form7'].commit()
      if (!form7) {
        this.$message.error('请配置产品信息')
        return
      }
      let data = { ...form6, ...form, ...imgs, ...form7 }
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
        data.addShareholderSupervisorReqList = addShareholderSupervisorReqList
        data.addAccountTaxReqList = addAccountTaxReqList
        data.addAccountPasswordReqList = addAccountPasswordReqList
        data.addInvoiceRestrictionsReqList = addInvoiceRestrictionsReqList
        addSubject(data).then(success)


      } else {
        data.updateShareholderSupervisorReqList = addShareholderSupervisorReqList
        data.updateAccountTaxReqList = addAccountTaxReqList
        data.updateAccountPasswordReqList = addAccountPasswordReqList
        data.updateInvoiceRestrictionsReqList = addInvoiceRestrictionsReqList
        data.id = this.subjectId


        updateSubject(data).then(success)
      }
    }
  },
}
</script>