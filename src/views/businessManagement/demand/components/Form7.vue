<template>
  <div class="block-form">
    <div class="mode1">
      <span class="mode-title">Excel模板</span>
      <a style="margin:0px;" href="https://template.gongxingtech.com/服务清单.xlsx">下载模板</a>
    </div>
    <div class="file-container">
      <div class="primary-file">
        <div class="file-type">客户原文件上传</div>
        <UploadFile v-model="form.primaryServiceDetailedFile" :disabled="disabled" style="width:500px"></UploadFile>
      </div>
      <div>
        <div class="file-type">服务清单文件上传</div>
        <!-- <div style="color:red;line-height:40px">(*只允许上传Excel文件)</div> -->
        <UploadFile v-model="form.serviceDetailedFile" :accept="'.xls, .xlsx'" :isShow="true" :limit="1" :disabled="disabled" style="width:500px"></UploadFile>
      </div>
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
        serviceDetailedFile: [],//服务清单
        primaryServiceDetailedFile: [],//原服务清单
      },
      businessType: ''
    }
  },
  methods: {
    change(type) {
      this.businessType = type

    },
    onload(obj) {
      this.form.serviceDetailedFile = obj.serviceDetailedFile ? JSON.parse(obj.serviceDetailedFile) : []
      this.form.primaryServiceDetailedFile = obj.primaryServiceDetailedFile ? JSON.parse(obj.primaryServiceDetailedFile) : []
    },
    commit() {
      if (this.businessType != 0) {
        if ((!this.form.serviceDetailedFile || !this.form.serviceDetailedFile.length) && (!this.form.primaryServiceDetailedFile || !this.form.primaryServiceDetailedFile.length)) {
          this.$message.warning('请至少上传一种服务清单')
          return
        }
      }
      let obj = Object.assign({}, this.form)
      obj.serviceDetailedFile = JSON.stringify(obj.serviceDetailedFile)
      obj.primaryServiceDetailedFile = JSON.stringify(obj.primaryServiceDetailedFile)
      return obj
    }
  }
}
</script>

<style lang="scss" scoped>
.mode1 {
  margin-bottom: 20px;
  font-size: 14px;
  .mode-title {
    margin-right: 15px;
    font-weight: 700;
    color: #606266;
  }
}
.file-type {
  font-weight: 700;
  margin: 10px 0;
  color: #606266;
}
.file-container {
  display: flex;
  .primary-file {
    margin-right: 50px;
  }
}
</style>