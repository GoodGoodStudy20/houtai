<template>
  <el-form class="block-form">
    <!-- <el-form-item label="微信沟通">
      <UploadImg v-model="form.wxScreenshot" :disabled="disabled" :limit="99"></UploadImg>
    </el-form-item> -->
    <el-form-item label="确权记录">
      <UploadImg v-model="form.screenshot" :accept="'.png , .bmp , .jpg , .svg'" :disabled="disabled" :limit="99"></UploadImg>
    </el-form-item>
    <!-- <el-form-item label="其他文件">
      <UploadFile v-model="form.determineFile" :disabled="disabled" style="width:500px"></UploadFile>
    </el-form-item> -->
  </el-form>
</template>

<script>
import UploadImg from '@/components/UploadImg/index.vue'
import UploadFile from '@/components/UploadFile/index.vue'
export default {
  name: 'Form4',
  components: { UploadFile, UploadImg },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        screenshot: [],                //确权文件
        wxScreenshot: '',                //微信截图
        mailScreenshot: '',                //邮件截图
      }
    }
  },
  methods: {
    onload(obj) {

      // this.form.wxScreenshot = obj.wxScreenshot ? obj.wxScreenshot.split(',') : []
      // this.form.mailScreenshot = obj.mailScreenshot ? obj.mailScreenshot.split(',') : []
      this.form.screenshot = obj.screenshot ? obj.screenshot.split(',') : []
    },
    commit() {
      // if (!this.form.wxScreenshot) {
      //   this.$message.warning('请上传微信截图')
      //   return
      // }
      // if (!this.form.mailScreenshot) {
      //   this.$message.warning('请上传邮件截图')
      //   return
      // }
      // if (!this.form.determineFile || !this.form.determineFile.length) {
      //   this.$message.warning('请上传确权文件')
      //   return
      // }
      let obj = Object.assign({}, this.form)
      // obj.screenshot = JSON.stringify(this.form.screenshot)
      obj.screenshot = String(this.form.screenshot)
      // obj.mailScreenshot = String(obj.mailScreenshot)
      // obj.wxScreenshot = String(obj.wxScreenshot)
      return obj
    }
  }
}
</script>

<style>
</style>