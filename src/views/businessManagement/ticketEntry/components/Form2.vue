<template>
  <div class="block-form">
    <UploadFile v-model="form.enterInvoiceFile" :disabled="disabled"></UploadFile>
  </div>
</template>

<script>
import UploadFile from '@/components/UploadFile/index.vue'
export default {
  name: 'Form4',
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
        enterInvoiceFile: [],                    //发票文件
      }
    }
  },
  methods: {
    onload(obj) {
      this.form.enterInvoiceFile = obj.enterInvoiceFile ? JSON.parse(obj.enterInvoiceFile) : []
    },
    commit() {
      if (!this.form.enterInvoiceFile || !this.form.enterInvoiceFile.length) return
      let obj = Object.assign({}, this.form)
      obj.enterInvoiceFile = JSON.stringify(obj.enterInvoiceFile)
      return obj
    }
  }
}
</script>

<style>
</style>