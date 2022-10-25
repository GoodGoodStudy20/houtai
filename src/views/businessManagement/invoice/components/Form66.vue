<template>
  <el-form size="small" inline="" ref="form" :model="form" label-width="auto" :disabled="disabled" class="block-form">
    <el-form-item label="开票人" prop="invoicingUserId" :rules="[{ required: true, message: '开票人不可为空', trigger: 'change' }]">
      <ChooseUser v-model="form.invoicingUserId" placeholder="请选择" style="width:300px"></ChooseUser>
    </el-form-item>
    <el-form-item label="开票时间" prop="invoicingDate" :rules="[{ required: true, message: '开票时间不可为空', trigger: 'blur' }]">
      <el-date-picker v-model="form.invoicingDate" @change="invoicingDateChange" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:250px"></el-date-picker>
    </el-form-item>
    <!-- <el-form-item label="开票主体" prop="subjectId" :rules="[{ required: true, message: '开票主体不可为空', trigger: 'blur' }]">
      <ChooseSubject v-model="form.subjectId" :disabled="!form.invoicingDate" :showAmount="!disabled" ref="subject" placeholder="请选择" style="width:500px"></ChooseSubject>
    </el-form-item> -->
    <el-form-item label="备注">
      <el-input v-model="form.viceRemark" type="textarea" style="width:500px" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
    </el-form-item>
    <div v-if="editType !='show'">
      <el-form-item label="上传文件识别发票">
        <UploadImgDistinguish v-model="form.imgDistinguish" @changeList="changeList" :type="'invoice'"></UploadImgDistinguish>
        <span style="color:#F14F44">(*上传图片格式为pdf/jpg/png/svg/bmp/jpeg,大小不超过2MB)</span>
      </el-form-item>
    </div>
    <div v-for="(item,i) in list" :key="i">
      <el-form size="small" :disabled="disabled" inline :model="item" v-if="item.subjectId || editType === 'approve'">
        <el-form-item label="开票主体" prop="subjectId" :rules="[{ required: true, message: '开票主体不可为空', trigger: 'blur' }]">
          <!-- <ChooseSubject v-model="item.subjectId" :showAmount="!disabled" :disabled="!form.invoicingDate" ref="subject" placeholder="请选择"></ChooseSubject> -->
          <el-select v-model="item.subjectId" placeholder="请选择" style="width:200px" :disabled="!form.invoicingDate" :showAmount="!disabled">
            <!-- <el-option label="全部" value="" v-if="showAll"></el-option> -->
            <el-option v-for="item1 in subjectList" :key="item1.id" :label="editType=='show'?item1.abbreviated:`${item1.abbreviated}【本月已开金额${item1.totalInvoicingAmount}元，剩余额度${item1.surplusInvoicingAmount}元，剩余份数${item1.surplusInvoicingQuantity}份】`" :value="item1.id" :disabled="item1.isEffective==1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" " style="width:70px">
          <el-button type="primary" @click="addOne(i)" v-show="i==list.length-1">增加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="delOne(i)" v-show="list.length>1">删除</el-button>
        </el-form-item>
        <div>
          <Form2 ref="form2" :disabled="disabled" :editType="editType" @changeList="changeList" :invoiceFileVoList="item.invoiceFileVoList" :taxRate="taxRate" :subjectId="item.subjectId"></Form2>
          <el-divider></el-divider>
        </div>
      </el-form>
    </div>
  </el-form>
</template>

<script>
import ChooseSubject from '@/components/ChooseSubject/index.vue'
import ChooseUser from '@/components/ChooseUser/index.vue'
import UploadImgDistinguish from '@/components/UploadImgDistinguish/index.vue'
import Form2 from './Form2.vue'
import { Assign } from '@/utils/index.js'
import { getSubjectList, deleteSubject, deleteByInvoiceIdAndSubjectId } from '@/api/index.js'
import { duration } from 'moment'

export default {
  name: 'Form6',
  components: { ChooseSubject, ChooseUser, Form2, UploadImgDistinguish },
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
        // subjectId: '',                    //主体id
        invoicingDate: '',                    //开票日期
        invoicingUserId: '',                    //开票人
        viceRemark: '',
        imgDistinguish: []     //上传文件
        // imgDistinguish: ''     //上传文件
      },
      list: [
        {
          subjectId: '',      //主体id
          invoiceFileVoList: [
            {
              invoicingCode: '',
              invoicingAmount: '',
              invoicingTaxAmount: '',
              priceTaxTotal: '',
              invoiceFile: [],
            }
          ]
        },
      ],
      customerId: '',
      taxRate: 0,
      subjectList: [],
      ImgUrl: [],
      newList: []
    }
  },
  watch: {
    'form.imgDistinguish'(val, oldVal) {
      this.list = []
      if (val && val.length > 0) {
        this.handle()
      }
    }
  },
  methods: {
    changeList(obj) {
      this.newList = []
      this.list.forEach(item => {
        item.invoiceFileVoList && item.invoiceFileVoList.forEach(it => {
          this.newList.push(it)
        })
      })
      if (obj && obj != {}) {
        this.newList.push(obj)
      }
    },
    getSubjectList(params = {}) {
      getSubjectList({  ...params, customerId: this.customerId, date: this.form.invoicingDate, type: this.form.invoicingType }).then(res => {
        this.subjectList = res.data
      })
    },
    handle() {
      let subjectIdList = []
      this.form.imgDistinguish.length > 0 && this.form.imgDistinguish.forEach(item => {
        this.newList.push(item[0])
      })
      this.newList.forEach(item => {
        if (item.subjectVo) {
          if (subjectIdList.indexOf(item.subjectVo.id) == -1) {
            subjectIdList.push(item.subjectVo.id);
          }
        }
      })
      let list = this.list
      subjectIdList.forEach(subjectId => {
        let item = { subjectId: subjectId, invoiceFileVoList: [] }
        this.newList.forEach(invoiceItem => {
          if (subjectId == (invoiceItem.subjectVo && invoiceItem.subjectVo.id) || subjectId == invoiceItem.subjectId) {
            invoiceItem.invoiceFile = []
            invoiceItem.invoiceFile.push({ url: invoiceItem.url, name: invoiceItem.fileName })
            item.invoiceFileVoList.push(invoiceItem);
          }
        })
        this.$nextTick(() => {
          this.list.push(item)
        })
      })
    },

    onload(obj) {
      if (obj.invoiceFileVoList.length > 0) {
        this.list = []
      }
      this.customerId = obj.customerId
      this.form = Object.assign(this.form, obj)
      this.getSubjectList()
      let subjectIdList = []
      obj.invoiceFileVoList.forEach(item => {
        if (subjectIdList.indexOf(item.subjectId) == -1) {
          subjectIdList.push(item.subjectId);
        }
      })
      this.$nextTick(() => {
        subjectIdList.forEach(subjectId => {
          let item = { subjectId: subjectId, invoiceFileVoList: [] }
          obj.invoiceFileVoList.forEach(invoiceItem => {
            if (subjectId == invoiceItem.subjectId) {
              item.invoiceFileVoList.push(invoiceItem);
            }
          })
          this.list.push(item)
        })
      })

      // let a = JSON.parse(JSON.stringify(this.list))
      // var newArr = a
      // newArr.shift();
      // this.list = newArr
      // this.list = a.filter(item => {
      //   return item.subjectId != ''
      // })
      // this.$nextTick(() => {
      // if (this.list) {
      // this.list = this.list.filter(item => {
      //   return item.subjectId != ''
      // })
      // this.$forceUpdate()
      // }
      // })

      // this.list.splice(0, 1)
      this.taxRate = this.form.taxRate
      // this.$nextTick(() => {
      //   this.$forceUpdate()
      // })
    },
    addOne(i) {
      this.list.push(Object.assign({}, this.$options.data().list[0]))
      this.getSubjectList()
      // this.$refs[`subject${i + 1}`][0].getList({ customerId: this.customerId, date: this.form.invoicingDate, type: this.form.invoicingType })
      // this.invoicingDateChange()
    },
    delOne(i) {
      if (!this.list[i].id) {
        this.list.splice(i, 1)
      }
    },
    invoicingDateChange() {
      this.getSubjectList()
    },
    commit() {
      let list = []
      this.list.forEach((item, index) => {
        if (this.$refs['form2'][index]) {
          list.push(...this.$refs['form2'][index].commit())
        }
      })
      if (!this.$validate('form')) return
      if (list && list.length == 0) {
        this.$message.error({
          message: '请输入一条发票信息',
          duration: 1500
        })
        return
      }
      let count = 0
      list.forEach(item => {
        count += Number(item.priceTaxTotal)
      })
      if (count > this.form.invoicingAmount) {
        this.$message.error('上传的发票总额不能大于开票金额')
        return
      }
      // return
      let obj = Object.assign({}, this.form)
      obj.InvoiceFileReqList = list
      return obj
    },

  }
}
</script>

<style>
</style>