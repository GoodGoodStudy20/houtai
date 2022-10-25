<template>
  <div class="block-form">
    <UploadFile v-model="form.settlementDetailedFile" :disabled="disabled" style="width:500px"></UploadFile>
  </div>
</template>

<script>
import UploadFile from '@/components/UploadFile/index.vue'
export default {
  name: 'Form7',
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
        settlementDetailedFile: [],//结算清单
      }
    }
  },
  created() {
    this.$bus.$on('detailedChange', res => {
      this.form.settlementDetailedFile = res
    })
  },
  methods: {
    onload(obj) {
      this.form.settlementDetailedFile = obj.settlementDetailedFile ? JSON.parse(obj.settlementDetailedFile) : []
    },
    commit() {
      let obj = Object.assign({}, this.form)
      obj.settlementDetailedFile = JSON.stringify(obj.settlementDetailedFile)
      return obj
    }
  }
}
</script>

<style>
</style>