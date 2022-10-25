<template>
  <div>
    <div class="form-title">{{editType | typeName}}进票信息</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基础信息" name="1">
        <Form1 ref="form1" :disabled="editType=='show'"></Form1>
      </el-collapse-item>
      <el-collapse-item title="发票文件（建议上传图片）" name="2">
        <Form2 ref="form2" :disabled="editType=='show'"></Form2>
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
import { addEnterInvoiceApproval, updateEnterInvoiceApproval, getEnterInvoiceApprovalInfo } from '@/api/index.js'
import Form1 from './Form1'
import Form2 from './Form2'
export default {
  name: 'TicketEntryForm',
  components: { Form1, Form2 },
  props: ['value', 'editId', 'editType'],
  data() {
    return {
      activeNames: ['1', '2'],
      showForm4: false
    }
  },
  mounted() {
    if (this.editId) {
      this.onload()
    }
  },
  methods: {
    onload() {
      getEnterInvoiceApprovalInfo({ id: this.editId }).then(res => {
        let result = res.data || {}
        this.$refs['form1'].onload(result)
        this.$refs['form2'].onload(result)
      })
    },
    cancel() {
      this.$emit('input', 0)
    },
    submitBack() {
      this.submit('back')
    },
    submit(type = '') {
      let form = this.$refs['form1'].commit()
      if (!form) return
      let form2 = this.$refs['form2'].commit()
      if (!form2) {
        this.$message.warning('请上传发票文件')
        return
      }
      let data = { ...form, ...form2 }
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
        data.approvalStatus = 0
        addEnterInvoiceApproval(data).then(success)
      } else {
        data.approvalStatus = 0
        data.id = this.editId
        updateEnterInvoiceApproval(data).then(success)
      }
    }
  },
}
</script>
