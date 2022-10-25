<template>
  <el-form size="small" ref="form" :model="form" label-width="auto" :disabled="disabled" class="block-form block-form-flex">
    <el-form-item label="编号" class="form-item-container">
      <el-input v-model="form.number" placeholder="自动生成" disabled style="width:300px"></el-input>
    </el-form-item>
    <el-form-item label="付款方" class="form-item-container" prop="payerId" :rules="[{ required: true, message: '付款方不可为空', trigger: 'blur' }]">
      <ChooseCustomer v-model="form.payerId" showValue="name" ref="customer" style="width:300px" @change="changeCustomer"></ChooseCustomer>
    </el-form-item>
    <el-form-item label="收款主体" class="form-item-container" prop="subjectId" :rules="[{ required: true, message: '主体不可为空', trigger: 'blur' }]">
      <ChooseSubject v-model="form.subjectId" showValue="name" ref="subject" @change="subjectChange" style="width:300px"></ChooseSubject>
    </el-form-item>
    <el-form-item label="收款账户" class="form-item-container" prop="accountTaxId" :rules="[{ required: true, message: '到账账户不可为空', trigger: 'blur' }]">
      <el-select v-model="form.accountTaxId" placeholder="请选择" style="width:300px">
        <el-option v-for="(item,i) in options1" :key="i" :label="item.name+'('+item.account+')'" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="收款金额" class="form-item-container" prop="amount" :rules="[{ required: true, message: '到账金额不可为空', trigger: 'blur' }]">
      <el-input v-model="form.amount" placeholder="请输入到账金额" style="width:300px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"><template slot="append">元</template></el-input>
    </el-form-item>
    <el-form-item label="到款时间" class="form-item-container" prop="returnMoneyDate" :rules="[{ required: true, message: '到账时间不可为空', trigger: 'blur' }]">
      <el-date-picker v-model="form.returnMoneyDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:300px"></el-date-picker>
    </el-form-item>

    <el-form-item label="回单号" class="form-item-container" prop="bankFlow" :rules="[{ required: true, message: '回单号不可为空', trigger: 'blur' }]">
      <el-input v-model="form.bankFlow" placeholder="请输入银行流水" style="width:300px"></el-input>
    </el-form-item>
    <el-form-item label="备注" class="form-item-container">
      <el-input v-model="form.remark" type="textarea" style="width:300px" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
    </el-form-item>
    <el-form-item label="识别到账回单" v-if="editType == 'add' || editType == 'edit'">
      <UploadImgDistinguish v-model="form.arrivalReceiptFile"></UploadImgDistinguish>
      <div>点击或将文件拖拽到这里上传</div>
      <span style="color:#F14F44">(*支持上传图片格式：pdf/jpg/png/svg/bmp/jpeg,大小不超过2MB)</span>
    </el-form-item>
  </el-form>
</template>

<script>
import ChooseCustomer from '@/components/ChooseCustomer/index.vue'
import ChooseSubject from '@/components/ChooseSubject/index.vue'
import UploadImgDistinguish from '@/components/UploadImgDistinguish/index.vue'
import { getCustomerByDirector } from '@/api/index.js'
import { Assign } from '@/utils/index.js'
export default {
  name: 'Form1',
  components: { ChooseCustomer, ChooseSubject, UploadImgDistinguish },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    editType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        number: '',//编号
        payerId: '',                         //客户id
        subjectId: '',                         //主体id
        accountTaxId: '',                         //账户税务id
        amount: '',                         //到账金额
        returnMoneyDate: '',                         //到账日期
        bankFlow: '',                    //银行流水
        remark: '',                         //备注
        arrivalReceiptFile: []
      },
      options1: [],
      ChannelType: [],
      subjectList: []
    }
  },
  watch: {
    'form.arrivalReceiptFile'(val) {
      if (val && val.length > 0 && this.editType == 'add') {
        this.handle()
      }
    }
  },
  methods: {
    handle() {
      if (this.form.arrivalReceiptFile) {
        this.form.bankFlow = this.form.arrivalReceiptFile[0].bankFlow
        this.form.amount = this.form.arrivalReceiptFile[0].amount
        this.form.fileName = this.form.arrivalReceiptFile[0].fileName
        this.form.url = this.form.arrivalReceiptFile[0].url
        this.form.returnMoneyDate = this.form.arrivalReceiptFile[0].returnMoneyDate
        this.form.payerId = this.form.arrivalReceiptFile[0].payerVo && this.form.arrivalReceiptFile[0].payerVo.id
        this.form.subjectId = this.form.arrivalReceiptFile[0].subjectVo && this.form.arrivalReceiptFile[0].subjectVo.id
        this.form.accountTaxId = this.form.arrivalReceiptFile[0].accountTaxVo && this.form.arrivalReceiptFile[0].accountTaxVo.id
        let receiptFile = [{
          name: this.form.fileName,
          url: this.form.url
        }]
        this.$nextTick(() => {
          this.$refs['subject'].change()
          this.$refs['subject'].getList('onload')
          this.$refs['customer'].getList('onload')
        })
        this.$emit('receiptFile', receiptFile)
      }
    },
    onload(obj) {
      this.form = Object.assign(this.form, obj)
      this.$nextTick(async () => {
        await this.$refs['customer'].getList()
        await this.$refs['subject'].getList()
        this.$refs['subject'].change()
      })
      this.subjectChange(this.form.subjectVo)
    },
    subjectChange(item) {
      this.options1 = item.accountTaxVoList || []
    },
    changeCustomer(item, type) {
      getCustomerByDirector({ id: item.id }).then(res => {
        let result = res.data
        this.$emit('changeDiretor', result)
      })
      this.$refs['subject'].getList({ customerId: item.id, isProvince: 1 })

      if (type != 'onload') {
        this.options1 = []
        this.form.subjectId = ''
        this.form.accountTaxId = ''
      }
    },
    commit() {
      if (!this.$validate('form')) return
      let obj = Object.assign({}, this.form)
      return obj
    },

  }
}
</script>

<style lang="scss" scoped>
.form-item-container {
  width: 45%;
}
</style>