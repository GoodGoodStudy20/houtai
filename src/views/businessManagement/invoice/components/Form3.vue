<template>
  <div class="block-form">
    <UploadFile v-model="form.notSealDetailedListFile" :disabled="disabled"></UploadFile>
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
        notSealDetailedListFile: [],                    //结算清单(未盖章文件)
      }
    }
  },
  methods: {
    onload(obj) {
      this.form.notSealDetailedListFile = obj.notSealDetailedListFile ? JSON.parse(obj.notSealDetailedListFile) : []
    },
    commit() {
      if (!this.form.notSealDetailedListFile || !this.form.notSealDetailedListFile.length) {
        this.$message.warning('请上传结算清单(未盖章文件)')
        return
      }
      let obj = Object.assign({}, this.form)
      obj.notSealDetailedListFile = JSON.stringify(obj.notSealDetailedListFile)
      return obj
    }
  }
}
</script>

<style>
</style>