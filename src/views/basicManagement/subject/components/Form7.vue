<template>
  <div class="block-form">
    <UploadFile v-model="form.annualReportFile" :disabled="disabled"></UploadFile>
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
        annualReportFile: []
      }
    }
  },
  methods: {

    onload(obj) {
      this.form.annualReportFile = obj.annualReportFile ? JSON.parse(obj.annualReportFile) : []
    },
    commit() {
      let obj = Object.assign({}, this.form)
      obj.annualReportFile = JSON.stringify(obj.annualReportFile)
      return obj
    }
  }
}
</script>

<style>
</style>