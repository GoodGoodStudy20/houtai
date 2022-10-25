<template>
  <div>
    <el-form size="small" inline :disabled="disabled" class="block-form">
      <div v-if="editType != 'show'">
        <el-form-item label="上传文件识别发票">
          <UploadImgDistinguish v-model="form.imgDistinguish" @changeList="changeList" :type="'invoice'"></UploadImgDistinguish>
          <span style="color: #f14f44">(*上传图片格式为pdf/jpg/png/svg/bmp/jpeg,大小不超过10MB)</span>
        </el-form-item>
      </div>
      <div v-for="(item,i) in list" :key="i">
        <el-form-item label="发票号码" required>
          <el-input v-model="item.invoicingCode" placeholder="请输入发票号码" style="width:180px"></el-input>
        </el-form-item>
        <el-form-item label="金额" required>
          <!-- <el-input v-model="item.invoicingAmount" @change="moneyChange(i)" placeholder="请输入金额" style="width:140px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input> -->
          <el-input v-model="item.invoicingAmount" @change="moneyChange(i)" placeholder="请输入金额" style="width:140px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
        </el-form-item>
        <el-form-item label="税额" required>
          <el-input v-model="item.invoicingTaxAmount" placeholder="请输入税额" style="width:140px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
        </el-form-item>
        <el-form-item label="价税合计" required>
          <el-input v-model="item.priceTaxTotal" placeholder="请输入价税合计" @input="priceTaxTotalChange" style="width:140px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
        </el-form-item>
        <el-form-item label="" required>
          <UploadFile v-model="item.invoiceFile" :disabled="disabled" :limit="1" fileName="发票"></UploadFile>
        </el-form-item>
        <el-form-item label=" " style="width:70px">
          <el-button type="primary" @click="addOne" v-show="i==list.length-1">增加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="delOne(i)" v-show="list.length>1">删除</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import UploadFile from '@/components/UploadFile/index.vue'
import { deleteInvoiceFile } from '@/api/index.js'
import { NumberAdd, NumberMul } from '@/utils/index.js'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'Form2',
  components: { UploadFile },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    taxRate: {
      type: Number,
      default: 0
    },
    subjectId: {
      type: String | Number,
    },
    invoiceFileVoList: {
      type: Array,
      default: () => {
        return []
      }
    },
    editType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [
        {
          invoicingCode: '',
          invoicingAmount: '',
          invoicingTaxAmount: '',
          priceTaxTotal: '',
          invoiceFile: [],
        }
      ],

      // taxRate: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.onload()
    })
  },
  methods: {
    onload() {

      this.list = (this.invoiceFileVoList && this.invoiceFileVoList.length) ? this.invoiceFileVoList : this.list
      this.list.forEach(item => {
        try {
          item.invoiceFile = JSON.parse(item.invoiceFile)
        } catch (error) {
        }
      })
      if (this.editType && (this.editType === 'show' || this.editType == 'approve')) {
        this.list = this.list.filter(item => item.subjectId != '')
        // this.$forceUpdate()
      }

    },
    addOne() {
      this.list.push(Object.assign({}, this.$options.data().list[0]))
    },
    delOne(i) {
      if (!this.list[i].id) {
        this.list.splice(i, 1)
      } else {
        Confirm(`此操作将发票文件, 是否继续?`, () => {
          deleteInvoiceFile({ id: this.list[i].id }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.list.splice(i, 1)
          }).catch(err => {
            this.$message.error('删除失败')
          })
        })
      }
    },
    moneyChange(i) {
      this.list[i].subjectId = this.subjectId
      this.list[i].invoicingTaxAmount = NumberMul(this.list[i].invoicingAmount, (this.taxRate / 100))
      this.list[i].priceTaxTotal = NumberAdd([this.list[i].invoicingAmount, this.list[i].invoicingTaxAmount])
      this.$emit('changeList', this.list[i])
    },
    commit() {
      let list = this.list.filter(item => item.invoicingCode && item.invoiceFile && item.invoiceFile.length).map(item => {
        return {
          invoicingCode: item.invoicingCode,      //发票代码
          invoicingAmount: item.invoicingAmount,      //金额
          invoicingTaxAmount: item.invoicingTaxAmount,      //税额
          priceTaxTotal: item.priceTaxTotal,      //总价
          invoiceFile: JSON.stringify(item.invoiceFile),      //发票文件
          // id: item.id || '',      //主体id
          id: item.id || '',
          subjectId: item.subjectId || item.subjectVo.id || ''
        }
      })
      if (!list || !list.length) {
        this.$message.warning('请至少完整填写一条发票文件')
        return
      }

      return list
    }
  }
}
</script>

<style>
</style>