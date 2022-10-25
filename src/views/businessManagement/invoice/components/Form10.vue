<template>
  <div>
    <el-form size="small" ref="form" :model="form" label-width="auto" :disabled="disabled" class="block-form block-form-flex">
      <el-form-item class="form-item-container" label="开票性质" prop="invoicingNature" :rules="[{ required: true, message: '开票性质不可为空', trigger: 'blur' }]">
        <el-select v-model="form.invoicingNature" placeholder="请选择" style="width:300px" :disabled="isToVoidOrFlushRed">
          <el-option v-for="(item,i) in InvoiceType" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联签报号" v-if="form.invoicingNature===0 && !isToVoidOrFlushRed" class="form-item-container" prop="demandListId" :rules="[{ required: true, message: '关联签报号不可为空', trigger: 'blur' }]">
        <el-select v-model="form.demandListId" placeholder="请选择关联签报号" :disabled="isToVoidOrFlushRed" multiple style="width:300px" @focus="chooseDemand">
          <el-option v-for="item in demandList" :key="item.id" :label="item.number" :value="item.id"></el-option>
        </el-select>
        <!-- <el-input v-model="form.demandId" @focus="chooseDemand" placeholder="请选择" style="width:300px"></el-input> -->
      </el-form-item>
      <!-- <el-form-item label="关联客户名称" v-if="form.invoicingNature===0" class="form-item-container">
        <el-input v-model="customerIdName" placeholder="请输入关联客户名称" :disabled="isToVoidOrFlushRed" style="width:300px"></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="合同编号" class="form-item-container" prop="channelId" :rules="[{ required: true, message: '渠道不可为空', trigger: 'blur' }]">
      <el-select v-model="form.channelId" placeholder="请选择" style="width:300px">
        <el-option v-for="item in ChannelType" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item> -->
      <!-- <el-form-item label="委托经营所得" v-if="form.invoicingNature===0" class="form-item-container" :rules="[{ required: true, message: '委托经营所得不可为空', trigger: 'blur' }]">
        <el-input v-model="income" placeholder="请输入委托经营所得" :disabled="isToVoidOrFlushRed" style="width:300px"></el-input>
      </el-form-item> -->
      <el-form-item class="form-item-container" prop="contractListId" v-if="form.invoicingNature===1 && !isToVoidOrFlushRed" label="合同编号" :rules="[{ required: true, message: '合同编号不可为空', trigger: 'blur' }]">
        <el-select v-model="form.contractListId" placeholder="请选择合同编号" :disabled="isToVoidOrFlushRed" multiple style="width:300px" @focus="chooseContarct">
          <el-option v-for="item in contarctList" :key="item.id" :label="item.number" :value="item.id"></el-option>
        </el-select>
        <!-- <el-input v-model="form.contractListId" style="width:300px" @focus="chooseContarct"></el-input> -->
      </el-form-item>
      <el-form-item label="预计到账日期" prop="estimateReturnMoneyDate" v-if="form.invoicingNature===1" :rules="[{ required: true, message: '预计到账日期不可为空', trigger: 'blur' },]">
        <el-date-picker v-model="form.estimateReturnMoneyDate" type="date" :disabled="isToVoidOrFlushRed" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 300px"></el-date-picker>
      </el-form-item>
    </el-form>
    <div></div>
    <div v-show="form.invoicingNature==0 && (selectList && selectList.length>0 ) && isChooseDemandInfoShow && !isToVoidOrFlushRed">
      <ChooseDemandDetail ref="demand" @radioChange="radioChange"></ChooseDemandDetail>
    </div>

    <el-dialog :visible.sync="isDemandInfoShow" title="关联项目签报" v-if="isDemandInfoShow" :before-close="dialogClose" :close-on-click-modal="false" center width="80%" :lock-scroll="false" :modal-append-to-body="false">
      <DemandList ref="demandInfo" :fromDemand="'1'" @change="DemadnSelect" @changeDemand="changeDemand" :params="params" select style="text-align: left"></DemandList>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取消</el-button>
        <el-button type="primary" @click="sureSelect">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="isContractInfoShow" title="关联合同信息" v-if="isContractInfoShow" :before-close="dialogClose2" :close-on-click-modal="false" center width="80%" :lock-scroll="false" :modal-append-to-body="false">
      <el-form inline size="small">
        <el-form-item label="模糊搜索">
          <el-input v-model="search" style="width:300px" placeholder="合同编号、主体名称、客户名称、服务商名称"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table stripe :data="contarctList" @selection-change="handleSelectionChange" style="max-width: 100%;margin-top:15px;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="合同编号" align="left" min-width="190" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="table-text" @click="editDetail(scope.row.id, 'show')">{{scope.row.number}}</span>
          </template>
        </el-table-column>
        <el-table-column label="甲方" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row | partyNameA" placement="bottom">
              <span> {{scope.row | partyA}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="乙方" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row | partyNameB" placement="bottom">
              <span> {{scope.row | partyB}}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="合同类型" align="left" width="100">
          <template slot-scope="scope">
            {{ContractType[scope.row.type]?ContractType[scope.row.type].label:''}}
          </template>
        </el-table-column>
        <el-table-column label="启用时间" prop="contractStartDate" align="left" width="120"></el-table-column>
        <el-table-column label="到期时间" prop="contractEndDate" align="left" width="120"></el-table-column>
        <el-table-column label="合同状态" align="left" width="80">
          <template slot-scope="scope">
            <span :style="{color:scope.row.surplusDay<=0?'red':''}">{{scope.row.surplusDay>0?scope.row.surplusDay+'天到期':'已到期'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose2">取消</el-button>
        <el-button type="primary" @click="sureContractSelect">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ChooseCustomer from '@/components/ChooseCustomer/index.vue'
import ChooseSubject from '@/components/ChooseSubject/index.vue'
import ChooseDemandDetail from './ChooseDemandDetail'
import DemandList from "@/views/businessManagement/demand/components/DemandList.vue";
import { getSubjectList, getContractList, getDemandApprovalById } from '@/api/index.js'
import { Assign, NumberAdd } from '@/utils/index.js'
import { InvoiceType, ContractType } from '@/utils/field.js'
export default {
  name: 'Form10',
  components: { ChooseCustomer, ChooseSubject, DemandList, ChooseDemandDetail },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    editType: {
      type: String,
    }
  },
  data() {
    return {
      form: {
        number: '',//编号

        demandListId: '',//签报
        contractListId: '',//合同编号
        estimateReturnMoneyDate: '',                    //预计回款日期
        invoicingNature: '',
      },
      InvoiceType: InvoiceType,
      ChannelType: [],
      subjectList: [],
      InvoiceListType: [
        {
          label: '正数发票',
          value: 0
        },
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
      isDemandInfoShow: false,
      isContractInfoShow: false,
      contarctList: [],
      params: {},
      selectList: [],
      ContractType: ContractType,
      demandList: [],
      customerId: '',
      multipleSelection: [],//选中合同数据
      demandCustomerId: '',     //客户id
      // fromDemand: 0,
      invoicingType: '',
      isChooseDemandInfoShow: false,
      radio: '',
      search: ''
    }
  },
  methods: {
    invoicingAmountChange(invoicingAmount) {
      this.$refs['demand'].invoicingAmountChange(invoicingAmount)
    },
    chooseContarct(param) {
      this.isContractInfoShow = true
      let form = {
        // pageNum: 1,          //页码
        // pageSize: 10,          //每页条数
        search: '',
        customerId: this.customerId
      }
      getContractList({ ...form, ...param }).then(res => {
        if (res.code != 200) return
        this.contarctList = res.data
      })
    },
    handleCurrentChange() {
      let param = {
        search: this.search,
        customerId: this.customerId
      }
      getContractList(param).then(res => {
        if (res.code != 200) return
        this.contarctList = res.data
      })
    },
    radioChange(radio) {
      this.radio = radio
    },
    dialogClose() {
      this.isDemandInfoShow = false
    },
    chooseDemand() {
      // this.fromDemand = '1'
      this.isDemandInfoShow = true
      this.params = {
        customerId: this.customerId,
        businessType: 0,
        approvalStatus: 2,
        isProvince: 0,
      }
      this.$nextTick(() => {
        this.$refs['demandInfo'].getList('invoice')
      })

    },
    changeDemand(list = []) {
      this.demandList = list
    },
    DemadnSelect(val) {
      this.selectList = val
    },
    sureSelect() {
      this.form.demandListId = []
      this.demandCustomerId = []
      this.selectList.forEach(item => {
        this.form.demandListId.push(item.id)
        this.demandCustomerId.push(item.customerId)
      })

      // if (this.selectList[0]) {
      //   this.form.demandId = this.selectList[0].id
      //   this.form.demandCustomerId = this.selectList[0].customerId

      // }
      this.isChooseDemandInfoShow = true
      this.$nextTick(() => {
        this.$refs['demand'].onload(this.selectList, this.form)
      })

      this.dialogClose()

    },
    dialogClose2() {
      this.isContractInfoShow = false
    },
    sureContractSelect() {
      this.form.contractListId = []
      this.multipleSelection.forEach(item => {
        this.form.contractListId.push(item.id)
      })
      // this.form.contractListId = this.form.contractListId.toString()

      this.dialogClose2()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onload2(item) {
      this.customerId = item.id
    },
    async onload(obj) {
      this.$nextTick(() => {
        Assign(this.form, obj)
        this.invoicingType = obj.invoicingType
      })
      if (obj.invoicingNature == 0) {
        await getDemandApprovalById({ id: obj.id }).then(res => {
          if (res.code != 200) return
          this.form.demandListId = []
          let demandList = res.data
          demandList.forEach(item => {
            this.form.demandListId.push(item.id)
          })
          demandList.forEach(item => {
            this.$set(item, 'nowReceivableMoney', NumberAdd([item.interestMoney, item.surplusMoney]))
            this.$set(item, 'money', item.currentUsedInvoiceMoney)
          })
          this.selectList = demandList
          this.demandList = demandList
          this.isChooseDemandInfoShow = true
          this.$nextTick(() => {
            this.$refs['demand'].onload(demandList, obj)
          })
        })
      }
      // this.form = { ...this.form, ...obj }
      this.$nextTick(() => {
        this.customerId = obj.customerId
        this.form.contractListId = []
        // this.form.demandListId = []
        // if (obj.demandApprovalVoList && obj.demandApprovalVoList.length > 0 && obj.invoicingNature == 0) {
        //   obj.demandApprovalVoList.forEach(item => {
        //     this.form.demandListId.push(item.id)
        //   })
        //   this.demandList = obj.demandApprovalVoList
        //   this.selectList = obj.demandApprovalVoList
        //   this.isChooseDemandInfoShow = true

        //   // this.$refs['demand'].onload(this.demandList)
        // }
        if (obj.contractVoList && obj.contractVoList.length > 0) {
          getContractList({ customerId: obj.customerId }).then(res => {
            if (res.code != 200) return
            this.contarctList = res.data
          })
          obj.contractVoList.forEach(item => {
            this.form.contractListId.push(item.id)
          })
        }
      })
      // this.$nextTick(() => {
      //   // this.$refs['demandInfo'].getList('invoice')
      //   // this.$refs['customer'].getList('onload')
      // })


    },
    customerChange(item, type) {
      // this.$refs['subject'].getList({ customerId: item.id })
      this.ChannelType = item.customerChannelVoList
      if (type != 'onload') {
        this.$emit('customerChange', item.invoiceVo || {})
        this.form.subjectId = ''
        this.form.channelId = ''
      }
    },
    commit() {
      if (!this.$validate('form')) return
      // if (this.form.demandListId) {
      //   this.form.demandListId = String(this.form.demandListId)
      // }
      // if (this.form.contractListId) {
      //   this.form.contractListId = String(this.form.contractListId)
      // }
      if (this.radio == 2) {
        if (this.form.invoicingNature == 0 && !this.isToVoidOrFlushRed) {
          this.form.customMoneyDeductionReqList = this.$refs['demand'].commit()
          if (!this.form.customMoneyDeductionReqList) return
        }
      }
      let obj = Object.assign({}, this.form)
      return obj
    },

  },
  filters: {
    partyA(row = {}) {
      let str = ''
      if (row.type == 0) {
        str = row.customerVo ? row.customerVo.abbreviated : ''
      } else if (row.type == 1) {
        str = row.subjectVo ? row.subjectVo.abbreviated : ''
      } else if (row.type == 2) {
        if (row.partyAType == 0) {
          str = row.partyACustomerVo ? row.partyACustomerVo.abbreviated : ''
        } else if (row.partyAType == 1) {
          str = row.partyASubjectVo ? row.partyASubjectVo.abbreviated : ''
        } else if (row.partyAType == 2) {
          str = row.partyAServiceProviderVo ? row.partyAServiceProviderVo.abbreviated : ''
        }
      } else if (row.type == 3) {
        str = row.backersVo ? row.backersVo.abbreviated : ''
      }
      return str
    },
    partyB(row = {}) {
      let str = ''
      if (row.type == 0) {
        str = row.subjectVo ? row.subjectVo.abbreviated : ''
      } else if (row.type == 1) {
        str = row.serviceProviderVo ? row.serviceProviderVo.abbreviated : ''
      } else if (row.type == 2) {
        if (row.partyBType == 0) {
          str = row.partyBCustomerVo ? row.partyBCustomerVo.abbreviated : ''
        } else if (row.partyBType == 1) {
          str = row.partyBSubjectVo ? row.partyBSubjectVo.abbreviated : ''
        } else if (row.partyBType == 2) {
          str = row.partyBServiceProviderVo ? row.partyBServiceProviderVo.abbreviated : ''
        }
      } else if (row.type == 3) {
        str = row.subjectVo ? row.subjectVo.abbreviated : ''
      }
      return str
    },
    partyNameA(row = {}) {
      let str = ''
      if (row.type == 0) {
        str = row.customerVo ? row.customerVo.name : ''
      } else if (row.type == 1) {
        str = row.subjectVo ? row.subjectVo.name : ''
      } else if (row.type == 2) {
        if (row.partyAType == 0) {
          str = row.partyACustomerVo ? row.partyACustomerVo.name : ''
        } else if (row.partyAType == 1) {
          str = row.partyASubjectVo ? row.partyASubjectVo.name : ''
        } else if (row.partyAType == 2) {
          str = row.partyAServiceProviderVo ? row.partyAServiceProviderVo.name : ''
        }
      } else if (row.type == 3) {
        str = row.backersVo ? row.backersVo.name : ''
      }
      return str
    },
    partyNameB(row = {}) {
      let str = ''
      if (row.type == 0) {
        str = row.subjectVo ? row.subjectVo.name : ''
      } else if (row.type == 1) {
        str = row.serviceProviderVo ? row.serviceProviderVo.name : ''
      } else if (row.type == 2) {
        if (row.partyBType == 0) {
          str = row.partyBCustomerVo ? row.partyBCustomerVo.name : ''
        } else if (row.partyBType == 1) {
          str = row.partyBSubjectVo ? row.partyBSubjectVo.name : ''
        } else if (row.partyBType == 2) {
          str = row.partyBServiceProviderVo ? row.partyBServiceProviderVo.name : ''
        }
      } else if (row.type == 3) {
        str = row.subjectVo ? row.subjectVo.name : ''
      }
      return str
    },
  },
  watch: {
    'form.invoicingNature'(val) {
      if (val == 1) {
        this.form.demandListId = ''
        this.demandCustomerId = ''

      }
      if (val == 0) {
        this.form.contractListId = ''
        this.form.estimateReturnMoneyDate = ''
      }
    }
  },
  computed: {
    isToVoidOrFlushRed() {

      return this.editType == 'tovoid' || this.editType == 'flushRed' || this.invoicingType == 1 || this.invoicingType == 2
    }
  },
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
.choose {
  cursor: pointer;
  margin-left: 10px;
}
::v-deep .el-select-dropdown__list {
  display: none !important;
}
</style>