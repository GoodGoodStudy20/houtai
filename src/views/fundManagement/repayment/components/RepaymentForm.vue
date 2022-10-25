<template>
  <div>
    <div class="form-title">{{editType | typeName}}还款信息</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基础信息" name="1">
        <Form1 ref="form1" :disabled="editType=='show'"></Form1>
      </el-collapse-item>
      <el-collapse-item title="银行回单（建议上传图片）" name="3">
        <Form2 ref="form2" :disabled="editType=='show'"></Form2>
      </el-collapse-item>
      <el-collapse-item title="放款合同" name="3">
        <Form3 ref="form3" :disabled="editType=='show'"></Form3>
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
import { addRepayment, updateRepayment, getRepaymentInfo } from '@/api/index.js'
import Form1 from './Form1'
import Form2 from './Form2'
import Form3 from './Form3'
export default {
  name: 'RepaymentForm',
  components: { Form1, Form2, Form3 },
  props: ['value', 'editId', 'editType'],
  data() {
    return {
      activeNames: ['1', '2', '3'],
    }
  },
  mounted() {
    if (this.editId) {
      this.onload()
    }
  },
  methods: {
    onload() {
      getRepaymentInfo({ id: this.editId }).then(res => {
        let result = res.data || {}
        this.$refs['form1'].onload(result)
        this.$refs['form2'].onload(result)
        this.$refs['form3'].onload(result)
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
      let form3 = this.$refs['form3'].commit()
      if (!form2) {
        this.$message.warning('请上传银行回单')
        return
      }
      if (!form3) {
        this.$message.warning('请上传放款合同')
        return
      }
      let data = { ...form, ...form2, ...form3 }
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
        addRepayment(data).then(success)
      } else {
        data.id = this.editId
        updateRepayment(data).then(success)
      }
    }
  },
}
</script>
