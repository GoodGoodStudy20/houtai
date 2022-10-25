<template>
  <div class="block-form">
    <UploadFile v-model="form.arrivalReceipt" :title="title" :disabled="disabled" style="width:300px"></UploadFile>
  </div>
</template>

<script>
import UploadFile from '@/components/UploadFile/index.vue'
import { Assign } from '@/utils/index.js'
export default {
  name: 'Form4',
  components: { UploadFile },
  props: {
    title: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        arrivalReceipt: [],                //到账回单
      }
    }
  },
  created() {
    this.$bus.$on('collectionSelect', res => {
      this.form.arrivalReceipt = res || []
    })
  },
  methods: {
    onload(obj) {
      this.form.arrivalReceipt = obj.arrivalReceipt ? JSON.parse(obj.arrivalReceipt) : []
    },
    commit() {
      if (!this.form.arrivalReceipt || !this.form.arrivalReceipt.length) return
      let obj = Object.assign({}, this.form)
      obj.arrivalReceipt = JSON.stringify(obj.arrivalReceipt)
      return obj
    }
  }
}
</script>

<style>
</style>