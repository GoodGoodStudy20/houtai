<template>
  <div class="block-form">
    <UploadImg v-model="form.arrivalReceiptFile" :disabled="disabled" :limit="1"></UploadImg>
  
  </div>
</template>

<script>
import UploadImg from '@/components/UploadImg/index.vue'
export default {
  name: 'Form3',
  components: { UploadImg },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        arrivalReceiptFile: [],                         //到账回单文件
      }
    }
  },
  methods: {
    onload(obj) {
      let fileList = obj.arrivalReceiptFile ? JSON.parse(obj.arrivalReceiptFile) : [];
      //因为旧数据结构为[{name,url}],新数据为['']所以做以下判断
      if (fileList.length > 0) {
        let file = fileList[0];
        if (file instanceof Object) {
          let newFileList = fileList.map(item => {
            return item.url
          })
          this.form.arrivalReceiptFile = newFileList
        } else {
          this.form.arrivalReceiptFile = fileList;
        }
      }

    },
    commit() {
      if (!this.form.arrivalReceiptFile || !this.form.arrivalReceiptFile.length) return
      let obj = Object.assign({}, this.form)
      obj.arrivalReceiptFile = JSON.stringify(obj.arrivalReceiptFile)
      return obj
    },
    change(obj) {
      let fileList = obj ? obj : [];
      if (fileList.length > 0) {
        let file = fileList[0];
        if (file instanceof Object) {
          let newFileList = fileList.map(item => {
            return item.url
          })
          this.form.arrivalReceiptFile = newFileList
        } else {
          this.form.arrivalReceiptFile = fileList;
        }
      }
    }
  }
}
</script>

<style>
</style>