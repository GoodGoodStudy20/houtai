<template>
  <div class="block-form">
    <UploadFile v-model="form.paymentListFile" :disabled="disabled"></UploadFile>
  </div>
</template>

<script>
import UploadFile from '@/components/UploadFile/index.vue'
export default {
  name: 'Form3',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
  },
  components: { UploadFile },
  data() {
    return {
      form: {
        paymentListFile: []
      }
    }
  },
  methods: {
    onload(obj) {
      this.form.paymentListFile = obj ? JSON.parse(obj) : []
    },
    commit() {
      let obj = Object.assign({}, this.form)
      obj.paymentListFile = JSON.stringify(obj.paymentListFile)
      return obj
    }
  }
}
</script>

<style>
</style>