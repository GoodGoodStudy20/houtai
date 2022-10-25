<template>
  <div class="block-form">
    <UploadFile v-model="form.sealDetailedListFile" :disabled="disabled"></UploadFile>
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
        sealDetailedListFile: [],                    //清单文件(盖章文件)
      }
    }
  },
  methods: {
    onload(obj) {
      this.form.sealDetailedListFile = obj.sealDetailedListFile ? JSON.parse(obj.sealDetailedListFile) : []
    },
    commit() {
      if (!this.form.sealDetailedListFile || !this.form.sealDetailedListFile.length) {
        this.$message.warning('请上传结算清单(盖章文件)')
        return
      }
      let obj = Object.assign({}, this.form)
      obj.sealDetailedListFile = JSON.stringify(obj.sealDetailedListFile)
      return obj
    }
  }
}
</script>

<style>
</style>