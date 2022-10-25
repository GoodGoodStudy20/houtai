<template>
  <el-form size="small" ref="form" :model="form" label-width="auto" :disabled="disabled" class="block-form">
    <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '名称不可为空', trigger: 'blur' }]">
      <el-input v-model="form.name" placeholder="请输入名称" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="简称" prop="abbreviated" :rules="[{ required: true, message: '简称不可为空', trigger: 'blur' }]">
      <el-input v-model="form.abbreviated" placeholder="请输入简称" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="分类" prop="typeId" :rules="[{ required: true, message: '分类不可为空', trigger: 'blur' }]">
      <ChooseServiceProviderType v-model="form.typeId"></ChooseServiceProviderType>
    </el-form-item>
    <el-form-item label="信用代码" prop="creditCode" :rules="[{ required: true, message: '信用代码不可为空', trigger: 'blur' }]">
      <el-input v-model="form.creditCode" placeholder="请输入信用代码" oninput="value=value.toUpperCase()" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="所属地区" prop="province" :rules="[{ required: true, message: '所属地区不可为空', trigger: 'blur' }]">
      <ChooseArea :province.sync="form.province" :city.sync="form.city" style="width:500px"></ChooseArea>
    </el-form-item>
    <el-form-item label="往来邮箱" prop="contactMailbox" :rules="[{ required: true, message: '往来邮箱不可为空', trigger: 'blur' },{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
      <el-input v-model="form.contactMailbox" placeholder="请输入往来邮箱" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="服务时间" required>
      <div style="display:flex;width:500px;justify-content: space-between;">
        <el-form-item prop="startWeek" :rules="[{ required: true, message: '服务时间不可为空', trigger: 'change' }]">
          <el-select v-model="form.startWeek" placeholder="请选择" style="width:110px">
            <el-option v-for="item in weekList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <span>至</span>
        <el-form-item prop="endWeek" :rules="[{ required: true, message: '服务时间不可为空', trigger: 'change' }]">
          <el-select v-model="form.endWeek" placeholder="请选择" style="width:110px">
            <el-option v-for="item in weekList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="startTime" :rules="[{ required: true, message: '起始时间不可为空', trigger: 'change' }]">
          <el-time-select placeholder="起始时间" v-model="form.startTime" style="width:100px;margin-left:10px" :picker-options="{start: '07:00',step: '00:15', end: '22:30'}"></el-time-select>
        </el-form-item> 至
        <el-form-item prop="endTime" :rules="[{ required: true, message: '结束时间不可为空', trigger: 'change' }]">
          <el-time-select placeholder="结束时间" v-model="form.endTime" style="width:100px" :picker-options="{start: '07:00',step: '00:15',end: '22:30',minTime: form.startTim}"></el-time-select>
        </el-form-item>
      </div>
    </el-form-item>
    <el-form-item label="服务费率" prop="serviceCharge" :rules="[{ required: true, message: '服务费率不可为空', trigger: 'blur' }]">
      <el-input v-model="form.serviceCharge" placeholder="请输入服务费率" style="width:500px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')">
        <template slot="append">%</template>
      </el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="form.remark" type="textarea" style="width:500px" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import ChooseArea from '@/components/ChooseArea/index.vue'
import ChooseServiceProviderType from '@/components/ChooseServiceProviderType/index.vue'
import { Assign } from '@/utils/index.js'
export default {
  name: 'Form1',
  components: { ChooseArea, ChooseServiceProviderType },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: '',        //名称
        abbreviated: '',        //简称
        typeId: '',        //服务商类型(0.身边云,1.合摩,2.嗨客,3.浪潮,4.北斗)
        province: '',        //省
        city: '',       //市
        creditCode: '',        //信用代码
        contactMailbox: '',       //联系邮箱   
        tradeDate: '',        //营业日期
        tradeTime: '',        //营业时间
        serviceCharge: '',        //服务费率
        remark: '',        //备注
        startWeek: '',
        endWeek: '',
        startTime: '',
        endTime: '',
      },
      weekList: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    }
  },
  methods: {
    onload(obj) {
      Assign(this.form, obj)
      this.form.startWeek = this.form.tradeDate.split(',')[0]
      this.form.endWeek = this.form.tradeDate.split(',')[1]
      this.form.startTime = this.form.tradeTime.split(',')[0]
      this.form.endTime = this.form.tradeTime.split(',')[1]
    },
    commit() {
      if (!this.$validate('form')) return
      let obj = Object.assign({}, this.form)
      obj.tradeDate = this.form.startWeek + ',' + this.form.endWeek
      obj.tradeTime = this.form.startTime + ',' + this.form.endTime
      return obj
    },

  }
}
</script>
