<template>
  <div class="block-form">
    <UploadFile v-model="form.file" :disabled="disabled"></UploadFile>
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
        file: [],                //到账回单
      }
    }
  },
  methods: {
    onload(obj) {
      this.form.file = obj.file ? JSON.parse(obj.file) : []
    },
    commit() {
      if (!this.form.file || !this.form.file.length) return
      let obj = Object.assign({}, this.form)
      obj.file = JSON.stringify(obj.file)
      return obj
    }
  }
}
</script>

<style>
</style>