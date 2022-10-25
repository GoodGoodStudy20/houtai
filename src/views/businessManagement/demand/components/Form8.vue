<template>
  <div class="block-form">
    <UploadFile v-model="form.contractFile" :disabled="disabled" style="width:500px"></UploadFile>
  </div>
</template>

<script>
import UploadFile from '@/components/UploadFile/index.vue'
export default {
  name: 'Form8',
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
        contractFile: [],//业务合同文件
      }
    }
  },
  created() {
    this.$bus.$on('fileChange', res => {
      this.form.contractFile = res
    })
  },
  methods: {
    onload(obj) {
      // this.$nextTick(() => {
      this.form.contractFile = obj.contractFile ? JSON.parse(obj.contractFile) : []
      // })
    },
    commit() {
      let obj = Object.assign({}, this.form)
      obj.contractFile = JSON.stringify(obj.contractFile)
      return obj
    }
  }
}
</script>

<style>
</style>