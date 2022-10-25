<template>
  <div class="block-form">
    <UploadFile v-model="form.bankReceipt" :disabled="disabled"></UploadFile>
  </div>
</template>

<script>
import UploadFile from '@/components/UploadFile/index.vue'
export default {
  name: 'Form3',
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
        bankReceipt: [],                         //银行回单
      }
    }
  },
  methods: {
    onload(obj) {
      this.form.bankReceipt = obj.bankReceipt ? JSON.parse(obj.bankReceipt) : []
    },
    commit() {
      if (!this.form.bankReceipt || !this.form.bankReceipt.length) return
      let obj = Object.assign({}, this.form)
      obj.bankReceipt = JSON.stringify(obj.bankReceipt)
      return obj
    }
  }
}
</script>

<style>
</style>