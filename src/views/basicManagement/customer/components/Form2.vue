<template>
  <div>
    <el-form size="small" ref="form1" :model="form" inline :disabled="disabled" class="block-form">
      <el-form-item label="业务模式" prop="defaultType" :rules="[{ required: true, message: '业务模式不可为空', trigger: 'blur' }]">
        <!-- <el-select v-model="form.defaultType" placeholder="请选择" style="width:120px">
          <el-option v-for="item in BusinessType" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select> -->
        <div style="width:100px">垫资</div>
      </el-form-item>
      <el-form-item label="当前是否积分" prop="isIntegral" :rules="[{ required: true, message: '当前是否积分不可为空', trigger: 'blur' }]">
        <el-select v-model="form.isIntegral" placeholder="请选择" style="width:120px">
          <el-option label="是" :value="0"></el-option>
          <el-option label="否" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务费率" prop="advanceServiceCharge" :rules="[{ required: true, message: '服务费率不可为空', trigger: 'blur' }]">
        <el-input v-model="form.advanceServiceCharge" placeholder="请输入服务费率" style="width:200px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="免息天数" prop="interestFreeDays" :rules="[{ required: true, message: '免息天数不可为空', trigger: 'blur' }]">
        <el-input v-model="form.interestFreeDays" placeholder="请输入免息天数" style="width:200px" oninput="value=value.replace(/[^\d]/g,'')">
          <template slot="append">天</template>
        </el-input>
      </el-form-item>
      <el-form-item label="利率" prop="ratio" :rules="[{ required: true, message: '利率不可为空', trigger: 'blur' }]">
        <el-input v-model="form.ratio" style="width:200px" placeholder="请输入利率" oninput="value=value.replace(/[^\d.]/g,'')">
          <template slot="append">/万/天</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-radio label="0" v-model="radio">默认选择</el-radio>
      </el-form-item>
    </el-form>

    <el-form size="small" ref="form2" :model="form" inline :disabled="disabled" class="block-form">
      <el-form-item label="业务模式" prop="defaultType" :rules="[{ required: true, message: '业务模式不可为空', trigger: 'blur' }]">
        <!-- <el-select v-model="form.defaultType" placeholder="请选择" style="width:120px">
          <el-option v-for="item in BusinessType" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select> -->
        <div style="width:100px">不垫资</div>
      </el-form-item>
      <el-form-item label="服务费率" prop="noAdvanceServiceCharge" :rules="[{ required: true, message: '服务费率不可为空', trigger: 'blur' }]">
        <el-input v-model="form.noAdvanceServiceCharge" placeholder="请输入服务费率" style="width:200px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-radio label="1" v-model="radio">默认选择</el-radio>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import { BusinessType } from '@/utils/field.js'
import { Assign } from '@/utils/index.js'
export default {
  name: 'Form2',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'radio'(val) {
      if (val == 0) {
        this.form.defaultType = 0
      } else if (val == 1) {
        this.form.defaultType = 1
      }
    }
  },
  data() {
    return {
      form: {
        defaultType: 0,               //是否垫资(0.垫资,1.不垫资)
        isIntegral: '',               //是否积分(0.是,1.否)
        ratio: '',               //利率(/万/天)
        advanceServiceCharge: '',               //垫资服务费(%)
        interestFreeDays: '',               //免息天数
        noAdvanceServiceCharge: ''//不垫资垫资服务费(%)
      },
      BusinessType: BusinessType,
      radio: '0'
    }
  },
  methods: {
    onload(obj) {
      Assign(this.form, obj)
      this.radio = obj.defaultType == 1 ? '1' : '0'
      this.form.defaultType = obj.defaultType
    },
    commit() {
      if (this.form.defaultType == 0) {
        if (!this.$validate('form1')) return
      }
      if (this.form.defaultType == 1) {
        if (!this.$validate('form2')) return
      }
      return this.form
    }
  }
}
</script>

<style>
</style>