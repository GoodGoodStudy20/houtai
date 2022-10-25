<template>
  <div>
    <div class="form-title">{{editType | typeName}}客户信息</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基础信息" name="1">
        <Form1 ref="form1" :disabled="editType=='show'"></Form1>
      </el-collapse-item>
      <el-collapse-item title="客户需求" name="1">
        <Form6 ref="form6" :disabled="editType=='show'"></Form6>
      </el-collapse-item>
      <el-collapse-item title="渠道" name="5">
        <Form5 ref="form5" :disabled="editType=='show'"></Form5>
      </el-collapse-item>
      <el-collapse-item title="业务条件" name="2">
        <Form2 ref="form2" :disabled="editType=='show'"></Form2>
      </el-collapse-item>
      <el-collapse-item title="联系人" name="3">
        <Form3 ref="form3" :disabled="editType=='show'"></Form3>
      </el-collapse-item>
      <el-collapse-item title="发票信息" name="4">
        <template #title>
          <div style="width:100%;height:100%;display:flex;justify-content: space-between;align-item:center">
            <span>发票信息</span>
            <el-button type="primary" @click.stop="copyClick" size="mini" style="height:30px;margin:10px 10px 0 0" v-if="editType!='add'">复制信息</el-button>
          </div>
        </template>
        <Form4 ref="form4" :disabled="editType=='show'"></Form4>
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
import { addCustomer, updateCustomer, getCustomerInfo } from '@/api/index.js'
import Form1 from './Form1'
import Form2 from './Form2'
import Form3 from '../../serviceProvider/components/Form3'
import Form4 from './Form4'
import Form5 from './Form5'
import Form6 from './Form6'
export default {
  name: 'CustomerForm',
  components: { Form1, Form2, Form3, Form4, Form5, Form6 },
  props: ['value', 'editId', 'editType'],
  data() {
    return {
      activeNames: ['1', '2', '3', '4', '5','6'],
    }
  },
  mounted() {
    if (this.editId) {
      this.onload()
    }
  },
  methods: {
    onload() {
      getCustomerInfo({ id: this.editId }).then(res => {
        let result = res.data || {}
        this.$refs['form1'].onload(result)
        this.$refs['form2'].onload(result)
        this.$refs['form3'].onload(result.contactsVoList)
        this.$refs['form4'].onload(result.invoiceVo)
        this.$refs['form5'].onload(result.customerChannelVoList)
        this.$refs['form6'].onload(result.customerDemandVo)
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
      let form2 = this.$refs['form2'].commit()
      if (!form2) return
      let form6 = this.$refs['form6'].commit()
      if (!form6) return
      let contactsVoList = this.$refs['form3'].commit()
      let invoiceVo = this.$refs['form4'].commit()
      if (!invoiceVo) return
      let form5 = this.$refs['form5'].commit()
      if (!form5) return
      let data = Object.assign(form2, form)
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
        data.addContactsReqList = contactsVoList
        data.addInvoiceReq = invoiceVo
        data.addCustomerChannelReqList = form5
        data.addCustomerDemandReq = form6
        addCustomer(data).then(success)
      } else {
        data.updateContactsReqList = contactsVoList
        data.updateInvoiceReq = invoiceVo
        data.updateCustomerChannelReqList = form5
        data.updateCustomerDemandReq = form6
        data.id = this.editId
        updateCustomer(data).then(success)
      }
    },
    copyClick() {
      this.$refs['form4'].copyClick()
    }
  },
}
</script>
