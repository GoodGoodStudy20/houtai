<template>
  <el-form size="small" inline :disabled="disabled" class="block-form">
    <el-form-item label="单人单月限额">
      <el-input v-model="form.singleMonthlyQuota" placeholder="单人单月限额" oninput="value=value.replace(/[^\d.]/g,'')">
        <template slot="append">元</template>
      </el-input>
    </el-form-item>
    <el-form-item label="年龄限制">
      <el-input v-model="form.ageQuotaStart" style="width:100px" placeholder="最小限制" maxlength="2" oninput="value=value.replace(/[^\d]/g,'')"></el-input>至
      <el-input v-model="form.ageQuotaEnd" style="width:100px" placeholder="最大限制" maxlength="2" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import UploadImg from '@/components/UploadImg/index.vue'
import { Assign } from '@/utils/index.js'
export default {
  name: 'Form2',
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
        ageQuota: '',       //年龄限额
        singleMonthlyQuota: '',        //单人单月限额(元)
        ageQuotaStart: '',
        ageQuotaEnd: ''
      },
    }
  },
  methods: {
    onload(obj) {
      Assign(this.form, obj)
      this.form.ageQuotaStart = this.form.ageQuota.split(',')[0]
      this.form.ageQuotaEnd = this.form.ageQuota.split(',')[1]
    },
    commit() {
      let obj = Object.assign({}, this.form)
      obj.ageQuota = this.form.ageQuotaStart + ',' + this.form.ageQuotaEnd
      return obj
    }
  }
}
</script>

<style>
</style>