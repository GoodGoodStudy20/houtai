<template>
  <el-dialog :visible.sync="value" :title="form.id?'编辑节点':'添加节点'" :before-close="dialogClose" :close-on-click-modal="false" width="340px">
    <el-form size="mini" label-width="auto">
      <el-form-item label="节点名称">
        <el-input v-model="form.name" :disabled="editType=='CC'"></el-input>
      </el-form-item>
      <el-form-item label="节点类型">
        <el-select v-model="form.operationType" placeholder="请选择" style="width:100%" :disabled="editType=='CC'">
          <el-option label="审批" :value="0"></el-option>
          <el-option label="抄送" :value="1"></el-option>
          <el-option label="办理" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="editType=='CC'?'抄送人':'审批人'">
        <ChooseUser v-model="form.approvalId" :multiple="editType=='CC'"></ChooseUser>
      </el-form-item>
      <el-form-item v-if="editType!='CC' && type!=2 && type!=3" style="text-align:left">
        <el-checkbox v-model="form.isSkip" :true-label="1" :false-label="0">找不到人直接跳过</el-checkbox>
      </el-form-item>
      <el-form-item v-if="editType!='CC' && type==0" style="text-align:left">
        <el-checkbox v-model="form.isOilCoupon" :true-label="1" :false-label="0">是否油券业务</el-checkbox>
      </el-form-item>
      <el-form-item v-if="editType!='CC' && type==0" style="text-align:left">
        <el-checkbox v-model="form.isIntegral" :true-label="1" :false-label="0">非权益审批</el-checkbox>
      </el-form-item>
      <el-form-item v-if="editType!='CC' && type==0" style="text-align:left">
        <el-checkbox v-model="form.isUpdate" :true-label="1" :false-label="0">可编辑服务商数据</el-checkbox>
      </el-form-item>
      <!-- <el-form-item v-if="editType!='CC' && type==0" style="text-align:left">
        <el-checkbox v-model="form.isUpdate" :true-label="2" :false-label="0">下发确认环节</el-checkbox>
      </el-form-item> -->
      <el-form-item v-if="editType!='CC' && type==2" style="text-align:left">
        <el-checkbox v-model="form.isUpdate" :true-label="1" :false-label="0">开票环节</el-checkbox>
      </el-form-item>
      <el-form-item v-if="editType!='CC' && type==3" style="text-align:left">
        <el-checkbox v-model="form.isUpdate" :true-label="1" :false-label="0">可编辑回款数据</el-checkbox>
      </el-form-item>

    </el-form>
    <el-button size="mini" type="primary" @click="submit">保存</el-button>
  </el-dialog>
</template>

<script>
import ChooseUser from '@/components/ChooseUser/index.vue'
import { addApprovalProcessConfig, updateApprovalProcessConfig } from '@/api/index.js'
export default {
  name: 'Form1',
  components: { ChooseUser },
  props: ['value', 'item', 'editType', 'type'],
  data() {
    return {
      form: {
        approvalId: '',       //审批人
        isSkip: 0,       //是否跳过(0.否,1.是)
        isUpdate: 0,       //是否编辑付款数据(0.否,1.是)
        name: '',       //名称
        remark: '',       //备注
        isOilCoupon: '',//是否油券业务
        operationType: '',//节点类型
        isIntegral: 0//节点类型
      }
    }
  },
  created() {
    Object.assign(this.form, this.item)
  },
  methods: {
    dialogClose() {
      this.$emit('input', false)
    },
    submit() {
      let success = res => {
        if (res.code == 200) {
          this.$message.success('操作成功')
          this.$emit('success')
          this.dialogClose()
        } else {
          this.$message.error(res.msg || '操作失败')
        }
      }
      if (this.form.id) {
        updateApprovalProcessConfig(this.form).then(success)
      } else {
        addApprovalProcessConfig(this.form).then(success)
      }
    }
  }
}
</script>

<style>
</style>