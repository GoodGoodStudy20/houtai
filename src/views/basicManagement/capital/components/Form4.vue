<template>
  <div class="block-form">
    <UploadFile v-model="form.fileUrl" :disabled="disabled"></UploadFile>
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
        fileUrl: []
      }
    }
  },
  methods: {

    onload(obj) {
      this.form.fileUrl = obj.fileUrl ? JSON.parse(obj.fileUrl) : []
    },
    commit() {
      let obj = Object.assign({}, this.form)
      obj.fileUrl = JSON.stringify(obj.fileUrl)
      return obj
    }
  }
}
</script>

<style>
</style>