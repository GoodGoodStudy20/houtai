<template>
  <div class="block-form">
    <el-row>
      <el-col :span="5">法人身份证正面<UploadImg v-model="form.idCardJust" :disabled="disabled"></UploadImg>
      </el-col>
      <el-col :span="5">法人身份证反面<UploadImg v-model="form.idCardBack" :disabled="disabled"></UploadImg>
      </el-col>
      <el-col :span="5">营业执照正本<UploadImg v-model="form.businessLicenseOriginal" :disabled="disabled"></UploadImg>
      </el-col>
      <el-col :span="5">营业执照副本<UploadImg v-model="form.businessLicenseDuplicate" :disabled="disabled"></UploadImg>
      </el-col>
      <el-col :span="4">门头照<UploadImg v-model="form.doorHeadPhoto" :disabled="disabled"></UploadImg>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px">
      <el-col :span="5">开户许可证<UploadImg v-model="form.accountOpeningPermit" :disabled="disabled"></UploadImg>
      </el-col>
      <el-col :span="5">基本账户信息<UploadImg v-model="form.basicAccount" :disabled="disabled"></UploadImg>
      </el-col>
      <el-col :span="5">其他
        <UploadImg v-model="form.otherPhoto" :limit="99" :disabled="disabled"></UploadImg>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import UploadImg from '@/components/UploadImg/index.vue'
import { Assign } from '@/utils/index.js'
export default {
  name: 'Form4',
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
        idCardJust: '',               //身份证正面
        idCardBack: '',               //身份证反面
        businessLicenseOriginal: '',               //营业执照正本
        businessLicenseDuplicate: '',               //营业执照副本
        doorHeadPhoto: '',               //门头照
        accountOpeningPermit: '', // 开户许可证
        basicAccount: '', // 基本账户信息
        otherPhoto: '',               //其他照片
      },
    }
  },
  methods: {
    onload(obj) {
      Assign(this.form, obj)
      for (let i in this.form) {
        this.form[i] = this.form[i] ? this.form[i].split(',') : []
      }
    },
    commit() {
      let obj = Object.assign({}, this.form)
      for (let i in obj) {
        obj[i] = String(obj[i])
      }
      return obj
    }
  }
}
</script>

<style>
</style>