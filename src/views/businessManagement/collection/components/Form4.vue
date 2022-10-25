<template>
  <div class="block-form">
    <UploadFile v-model="form.detailedListFile" :disabled="disabled"></UploadFile>
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
        detailedListFile: [],                    //清单文件
      }
    }
  },
  created() {
    this.$bus.$on('invoiceSelect', res => {
      this.form.detailedListFile = []
      res.forEach(item => {
        try {
          item.settlementDetailedFile = JSON.parse(item.settlementDetailedFile)
        } catch (error) {
        }
        this.form.detailedListFile.push(...item.settlementDetailedFile)
      })

    })
  },
  methods: {
    onload(obj) {
      this.form.detailedListFile = obj.detailedListFile ? JSON.parse(obj.detailedListFile) : []
    },
    commit() {
      if (!this.form.detailedListFile || !this.form.detailedListFile.length) return
      let obj = Object.assign({}, this.form)
      obj.detailedListFile = JSON.stringify(obj.detailedListFile)
      return obj
    }
  }
}
</script>

<style>
</style>