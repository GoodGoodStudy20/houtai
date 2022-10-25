<template>
  <div>

    <el-form size="small" ref="form" :model="form" label-width="auto" :disabled="disabled" class="block-form block-form-flex">

      <el-form-item class="form-item-container" label="编号">
        <el-input v-model="form.number" placeholder="自动生成" disabled style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="开票类型" v-if="isToVoidOrFlushRed" class="form-item-container">
        <el-radio-group v-model="form.invoicingType" @change="InvoiceTypeChange">
          <el-radio :label="item.value" v-for="item in InvoiceListType" :disabled="((editType=='tovoid' || form.invoicingType == 1) &&item.value=='2') || ((editType=='flushRed' || form.invoicingType == 2)&&item.value=='1')">{{
          item.label
        }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="作废规则" v-if="editType=='tovoid' || form.invoicingType == 1" class="form-item-container">
        <el-radio-group v-model="form.voidRule" @change="toVoidChange">
          <el-radio :label="item.value" v-for="item in invoiveRuleList">{{
          item.label
        }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="冲红规则" v-if="editType=='flushRed' || form.invoicingType == 2" class="form-item-container">
        <el-radio-group v-model="form.voidRule" @change="RedChange">
          <el-radio :label="item.value" v-for="item in invoiveRedList">{{
          item.label
        }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="form-item-container" prop="invoiceFileListId" v-if="isToVoidOrFlushRed && form.voidRule==1" label="发票号码" :rules="[{ required: true, message: '发票号码不可为空', trigger: 'blur' }]">
        <el-select v-model="form.invoiceFileListId" placeholder="请选择" style="width:300px" multiple @focus="focusInvoice">
          <el-option v-for="item in invoiceFileVoList" :key="item.id" :label="item.invoicingCode" :value="item.id"></el-option>
        </el-select>
        <!-- <el-input v-model="form.invoice" style="width:300px" @focus="focusInvoice"></el-input> -->
      </el-form-item>
      <el-form-item label="客户" class="form-item-container" prop="customerId" :rules="[{ required: true, message: '客户不可为空', trigger: 'blur' }]">
        <ChooseCustomer v-model="form.customerId" ref="customer" :disabled="isToVoidOrFlushRed" style="width:300px" @change="customerChange"></ChooseCustomer>
      </el-form-item>
      <el-form-item label="渠道" class="form-item-container" prop="channelId" :rules="[{ required: true, message: '渠道不可为空', trigger: 'blur' }]">
        <el-select v-model="form.channelId" placeholder="请选择" style="width:300px" :disabled="isToVoidOrFlushRed">
          <el-option v-for="item in ChannelType" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开票主体" class="form-item-container" prop="subjectListId" :rules="[{ required: true, message: '开票主体不可为空', trigger: 'blur' }]">
        <el-select v-model="form.subjectListId" placeholder="请选择" style="width:300px" @change="subjectChange" clearable filterable :disabled="!isDisabled || isToVoidOrFlushRed">
          <el-option v-for="item1 in subjectList" :key="item1.id" :label="`${item1.abbreviated}【本月已开金额${item1.totalInvoicingAmount}元，剩余额度${item1.surplusInvoicingAmount}元，剩余份数${item1.surplusInvoicingQuantity}份】`" :value="item1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发票类型" class="form-item-container" prop="type" :rules="[{ required: true, message: '发票类型不可为空', trigger: 'blur' }]">
        <el-select v-model="form.type" placeholder="请选择" style="width:300px" @change="typeChange" :disabled="isToVoidOrFlushRed">
          <el-option v-for="(item,i) in InvoiceTypeList1" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label=" 开票科目" class="form-item-container" prop="invoicingContent" :rules="[{ required: true, message: '开票科目内容不可为空', trigger: 'blur' }]">
        <el-input v-model="form.invoicingContent" :disabled="isToVoidOrFlushRed" placeholder="请输入开票内容" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="开票金额" v-if="!isToVoidOrFlushRed" class="form-item-container" prop="invoicingAmount" :rules="[{ required: true, message: '开票金额不可为空', trigger: 'blur' }]">
        <el-input v-model="form.invoicingAmount" @change="invoicingAmountChange" :disabled="isToVoidOrFlushRed" placeholder="请输入开票金额" style="width:300px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"><template slot="append">元</template></el-input>
      </el-form-item>
      <el-form-item label="作废金额" v-if="editType=='tovoid' || form.invoicingType==1" class="form-item-container" prop="invoicingAmount" :rules="[{ required: true, message: '作废金额不可为空', trigger: 'blur' }]">
        <el-input v-model="form.invoicingAmount" :disabled="isToVoidOrFlushRed" placeholder="请输入作废金额" style="width:300px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"><template slot="append">元</template></el-input>
      </el-form-item>
      <el-form-item label="冲红金额" v-if="editType=='flushRed' || form.invoicingType==2" class="form-item-container" prop="invoicingAmount" :rules="[{ required: true, message: '冲红金额不可为空', trigger: 'blur' }]">
        <el-input v-model="form.invoicingAmount" :disabled="isToVoidOrFlushRed" placeholder="请输入冲红金额" style="width:300px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"><template slot="append">元</template></el-input>
      </el-form-item>
      <el-form-item label="税率" class="form-item-container" prop="taxRate" :rules="[{ required: true, message: '税率不可为空', trigger: 'blur' }]">
        <el-input v-model="form.taxRate" :disabled="isToVoidOrFlushRed" placeholder="请输入税率" style="width:300px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"><template slot="append">%</template></el-input>
      </el-form-item>
      <!-- <el-form-item label="税率" v-if="isToVoidOrFlushRed" style="width:100%" prop="taxRate" :rules="[{ required: true, message: '税率不可为空', trigger: 'blur' }]">
        <el-input v-model="form.taxRate" :disabled="isToVoidOrFlushRed" placeholder="请输入税率" style="width:300px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"><template slot="append">%</template></el-input>
      </el-form-item> -->
      <div>
        <el-form-item :label="isToVoidOrFlushRed?'原因/备注':'备注'" class="form-item-container">
          <el-input v-model="form.remark" type="textarea" style="width:300px" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
        </el-form-item>
      </div>

    </el-form>
    <el-dialog :visible.sync="isInvoiceListShow" title="选择发票信息" v-if="isInvoiceListShow" :before-close="dialogClose" :close-on-click-modal="false" center width="80%" :lock-scroll="false" :modal-append-to-body="false">
      <el-table stripe :data="invoiceFileVoList" @selection-change="handleSelectionChange" style="max-width: 100%;margin-top:15px;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="发票号码" align="left" prop="invoicingCode">

        </el-table-column>
        <el-table-column label="金额" prop="invoicingAmount" align="left"></el-table-column>
        <el-table-column label="税额" prop="invoicingTaxAmount" align="left"></el-table-column>
        <el-table-column label="税价合计" prop="priceTaxTotal" align="left"></el-table-column>
        <!-- <el-table-column align=" center" label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-radio v-model="radio" label="1">选择</el-radio>
          </template>
        </el-table-column> -->
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose" style="margin-right:50px">取消</el-button>
        <el-button type="primary" @click="invoiceSelect">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ChooseCustomer from '@/components/ChooseCustomer/index.vue'
import ChooseSubject from '@/components/ChooseSubject/index.vue'
import { getSubjectList, getInvoiceFilePage } from '@/api/index.js'
import { Assign, NumberAdd } from '@/utils/index.js'
import { InvoiceType, InvoiceTypeList } from '@/utils/field.js'
export default {
  name: 'Form1',
  components: { ChooseCustomer, ChooseSubject },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    editType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        number: '',//编号
        customerId: '',                    //客户id
        channelId: '',//渠道
        // invoicingType: '',                    //开票种类(0.增值税专用发票,1.增值税普通发票)
        invoicingContent: '',                    //开票内容
        invoicingAmount: '',                    //开票金额
        taxRate: '',                    //税率
        type: '',                    //发票类型(0.纸质,1.电子)
        estimateReturnMoneyDate: '',                    //预计回款日期
        remark: '',                    //备注
        subjectListId: '',//开票主体
        invoicingType: 0,
        voidRule: '',
        invoiceFileListId: '',
        invoiceId: ''
        // invoiveRed: 1
      },
      InvoiceType: InvoiceType,
      InvoiceTypeList1: [],
      ChannelType: [],
      subjectList: [],
      InvoiceListType: [
        {
          label: '作废发票',
          value: 1
        },
        {
          label: '冲红发票',
          value: 2
        },
      ],
      invoiveRuleList: [
        {
          label: '全部作废',
          value: 0
        },
        {
          label: '部分作废',
          value: 1
        },
      ],
      invoiveRedList: [
        {
          label: '全部冲红',
          value: 0
        },
        {
          label: '部分冲红',
          value: 1
        },
      ],
      isInvoiceListShow: false,
      invoiceFileVoList: [],
      multipleSelection: [],
      form1: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
        isPage: 1,
        invoiceId: ''
      }
    }
  },
  watch: {
    'form.type'(val) {
      if (val || val == 0) {
        this.getSubjectList()
      }
    }
  },
  computed: {
    isDisabled() {
      return this.form.customerId !== ''
    },
    isToVoidOrFlushRed() {

      return this.editType == 'tovoid' || this.editType == 'flushRed' || this.form.invoicingType == 1 || this.form.invoicingType == 2
    }
  },
  methods: {
    invoicingAmountChange() {
      this.$emit('invoicingAmountChange', this.form.invoicingAmount)
    },
    getInvoiceFilePage() {
      getInvoiceFilePage(this.form1).then(res => {
        if (res.code != 200) return
      })
    },
    //全部作废
    toVoidChange() {
      if (this.form.voidRule == 0) {
        this.form.invoicingAmount = NumberAdd(this.invoiceFileVoList.map(item => Number(item.priceTaxTotal)))
        this.form.invoiceFileListId = []
        this.invoiceFileVoList.forEach(item => {
          this.form.invoiceFileListId.push(item.id)
        })
        this.$emit('toVoid', this.invoiceFileVoList)
      } else {
        this.form.invoiceFileListId = []
      }
    },
    //全部冲红
    RedChange() {
      if (this.form.voidRule == 0) {
        this.form.invoicingAmount = NumberAdd(this.invoiceFileVoList.map(item => Number(item.priceTaxTotal)))
        this.form.invoiceFileListId = []
        this.invoiceFileVoList.forEach(item => {
          this.form.invoiceFileListId.push(item.id)
        })
      } else {
        this.form.invoiceFileListId = []
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //部分作废,冲红
    invoiceSelect() {
      this.form.invoiceFileListId = []
      this.isInvoiceListShow = false
      this.multipleSelection.forEach(item => {
        this.form.invoiceFileListId.push(item.id)
      })
      this.form.invoicingAmount = NumberAdd(this.multipleSelection.map(item => Number(item.priceTaxTotal)))
      if (this.editType == 'tovoid') {
        this.$emit('toVoid', this.multipleSelection)
      }
    },
    dialogClose() {
      this.isInvoiceListShow = false
      this.form.invoiceFileListId = ''
    },
    InvoiceTypeChange() {
      // if()
    },
    focusInvoice() {
      this.isInvoiceListShow = true
    },
    async getSubjectList(params = {}) {
      await getSubjectList({ ...params, type: this.form.type, customerId: this.form.customerId }).then(res => {
        this.subjectList = res.data

      })
    },
    onload2(list = []) {
      this.invoiceFileVoList = list.filter(item => item.invoicingStatus == 0)
    },
    onload(obj) {
      this.$nextTick(() => {
        this.$refs['customer'].getList('onload')

      })
      Assign(this.form, obj)
      this.form1.invoiceId = obj.id
      this.form.invoiceFileListId = []
      if (obj.invoiceFileVoList && obj.invoiceFileVoList.length > 0) {
        obj.invoiceFileVoList.forEach(item => {
          this.form.invoiceFileListId.push(item.id)
        })
      }

      if (this.editType == 'tovoid' || obj.invoicingType == 1) {
        this.form.invoicingType = 1
        this.form.voidRule = 1
        if (obj.invoiceId) {
          this.form.invoiceId = obj.invoiceId
        } else {
          this.form.invoiceId = obj.id
        }
        if (obj.voidRule || obj.voidRule == 0) {
          this.form.voidRule = obj.voidRule
        }
      }
      if (this.editType == 'flushRed' || obj.invoicingType == 2) {
        this.form.invoicingType = 2
        this.form.voidRule = 1
        if (obj.invoiceId) {
          this.form.invoiceId = obj.invoiceId
        } else {
          this.form.invoiceId = obj.id
        }
        if (obj.voidRule || obj.voidRule == 0) {
          this.form.voidRule = obj.voidRule
        }
        if (obj.voidRule || obj.voidRule == 0) {
          this.form.voidRule = obj.voidRule
        }
      }
      this.form.subjectListId = Number(this.form.subjectListId)
    },
    subjectChange(type) {
      let result = {}
      if (type != 'onload') {
        this.form.taxRate = ''
        this.form.type = ''
      }
      let InvoiceTypeList = [
        //发票类型
        { value: 0, label: "增值税专用发票（纸质）" },
        { value: 1, label: "增值税普通发票（纸质）" },
        { value: 2, label: "增值税普通发票（电子）" },
        { value: 3, label: "增值税专用发票（电子）" },
      ];
      this.subjectList.forEach(item => {
        if (item.id == this.form.subjectListId) {
          this.InvoiceTypeList1 = item.invoiceRestrictionsVoList
          result = item || {}
        }
      })
      if (result) {
        this.$emit('invoiceUserChange', result)
      }
      this.InvoiceTypeList1.forEach(item => {
        item.value = item.type
        item.label = InvoiceTypeList[item.type].label
      })
    },
    customerChange(item, type) {
      // this.$emit('changeCustomer', item)

      this.getSubjectList()
      if (type == 'onload') {
        this.subjectChange('onload')
      }
      // this.$refs['subject'].getList({ customerId: item.id })
      this.ChannelType = item.customerChannelVoList
      if (type != 'onload') {
        this.$emit('customerChange', item.invoiceVo || {})
        this.$emit('customerChange1', item || {})
        this.form.subjectId = ''
        this.form.channelId = ''
        this.form.subjectListId = ''
        this.form.taxRate = ''
      }
    },
    typeChange() {
      this.InvoiceTypeList1.forEach(item => {
        if (item.type === this.form.type) {
          this.form.taxRate = item.taxRate
        }
      })
      // this.form.taxRate
      this.$emit('typeChange', this.form.type)
    },
    commit() {
      if (!this.$validate('form')) return
      this.form.invoiceFileListId = String(this.form.invoiceFileListId)
      if (Array.isArray(this.form.subjectListId)) {
        this.form.subjectListId = this.form.subjectListId.join(',')
      }
      let obj = Object.assign({}, this.form)
      return obj
    },
  }
}
</script>

<style lang="scss" scoped>
.block-form-flex {
  display: flex;
  flex-wrap: wrap;
}
.form-item-container {
  width: 45%;
}
</style>