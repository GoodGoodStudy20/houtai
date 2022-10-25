<template>
  <div class="attachment-info">
    <div class="attachment-item">
      <div class="attachment-title">业务合同</div>
      <UploadFile v-model="form.contractFile" :disabled="disabled"></UploadFile>
    </div>
    <div class="attachment-item">
      <div class="attachment-title">公章结算清单</div>
      <UploadFile v-model="form.settlementDetailedFile" :disabled="disabled"></UploadFile>
    </div>
    <div class="attachment-item">
      <div class="attachment-title">服务清单</div>
      <UploadFile v-model="form.serviceDetailedFile" :disabled="disabled"></UploadFile>
    </div>
  </div>
</template>

<script>
import UploadFile from '@/components/UploadFile/index.vue'
export default {
  name: 'Form7',
  components: { UploadFile },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        settlementDetailedFile: [],                    //清单文件(盖章文件)
        contractFile: [],//业务合同
        serviceDetailedFile: [],//服务清单
      }
    }
  },
  methods: {
    onload(obj) {
      this.form.settlementDetailedFile = obj.settlementDetailedFile ? JSON.parse(obj.settlementDetailedFile) : []
      this.form.contractFile = obj.contractFile ? JSON.parse(obj.contractFile) : []
      this.form.serviceDetailedFile = obj.serviceDetailedFile ? JSON.parse(obj.serviceDetailedFile) : []
    },
    commit() {
      if (!this.form.settlementDetailedFile || !this.form.settlementDetailedFile.length) {
        this.$message.warning('请上传结算清单(盖章文件)')
        return
      }
      let obj = Object.assign({}, this.form)
      obj.settlementDetailedFile = JSON.stringify(obj.settlementDetailedFile)
      obj.contractFile = JSON.stringify(obj.contractFile)
      obj.serviceDetailedFile = JSON.stringify(obj.serviceDetailedFile)
      return obj
    }
  }
}
</script>

<style lang="scss" scoped>
.attachment-info {
  display: flex;
  .attachment-item {
    width: 25%;
    .attachment-title {
      font-weight: 600;
      margin-bottom: 10px;
    }
  }
}
</style>