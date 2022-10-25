<template>
  <div class="block-form">
    <UploadFile v-model="form.contractFile" :disabled="disabled"></UploadFile>
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
        contractFile: [],                         //到账回单文件
      }
    }
  },
  methods: {
    onload(obj) {
      this.form.contractFile = obj.contractFile ? JSON.parse(obj.contractFile) : []
    },
    commit() {
      if (!this.form.contractFile || !this.form.contractFile.length) return
      let obj = Object.assign({}, this.form)
      obj.contractFile = JSON.stringify(obj.contractFile)
      return obj
    }
  }
}
</script>

<style>
</style>