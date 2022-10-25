<template>
  <div style="background:#fff">
    <!-- <el-button @click="cancel" class="top-button" style="margin-bottom:10px">返回</el-button> -->
    <div class="top-title">
      <div class="title-item table-text" @click="toClick"><img src="@/assets/img/left.png" alt=""><span>返回</span></div>
    </div>
    <div class="title-name">{{customerName}}开票报表</div>
    <div>
      <div class="date-box">
        <!-- <el-date-picker @change="changeTime" v-model="form.returnMoneyStartDate" size="mini" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:140px"></el-date-picker>
          至
          <el-date-picker @change="changeTime" v-model="form.returnMoneyEndDate" size="mini" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:140px"></el-date-picker> -->
        <el-date-picker size="mini" v-model="value1" value-format="yyyy-MM-dd" @change="changeTime" type="daterange" style="width:200px" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
      </div>
      <el-table stripe :data="moneyList" show-summary :summary-method="getSummaries" style="max-width: 100%;margin-top:15px;" :header-cell-style="{'background-color':'#F4F8FF'}">
        <el-table-column label="渠道" prop="channelName" align="center">
          <template slot-scope="scope">
            <span :class="{'table-text':nature==1}" @click="nature==1?handleDetail(scope.row):''">{{scope.row.channelName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="规划金额" prop="planAmount" min-width="110" align="right">
          <template slot-scope="scope">
            <span>{{scope.row.planAmount || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="已开金额" prop="invoiceAmount" min-width="110" align="right">
          <template slot-scope="scope">
            <span>{{scope.row.invoiceAmount || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="未开金额" prop="noInvoiceAmount" min-width="110" align="right">
          <template slot-scope="scope">
            <span>{{scope.row.noInvoiceAmount || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="nature==1?'已到账':'已回款'" prop="returnAmount" align="right" min-width="110">
          <template slot-scope="scope">
            <span>{{scope.row.returnAmount || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="nature==1?'已开未到账':'已开未回款'" prop="unrecordedAmount" align="right" min-width="110" class-name="format-right">
          <template slot-scope="scope">
            <span>{{scope.row.unrecordedAmount || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="可用委托总额" prop="availableMoney" align="right" min-width="110" v-if="nature==1">
          <template slot-scope="scope">
            <span>{{scope.row.availableMoney || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="已用委托" prop="usedMoney" align="right" min-width="110" v-if="nature==1">
          <template slot-scope="scope">
            <span>{{scope.row.usedMoney || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="剩余委托" prop="surplusAvailableMoney" align="right" min-width="110" v-if="nature==1" class-name="format-right">
          <template slot-scope="scope">
            <span>{{scope.row.surplusAvailableMoney || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="100" fixed="right" align="center">
          <template slot-scope="scope">
            <span class="table-text" @click="editPlan(scope.row)">修改规划金额</span>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <ReceiptUseDetails v-model="showReceipDetailDialog" v-if="showReceipDetailDialog" :returnMoneyApprovalVoList="returnMoneyApprovalVoList"></ReceiptUseDetails>
  </div>
</template>

<script>
import ReceiptUseDetails from "./ReceiptUseDetails"
import { NumberSub, NumberAdd, NumberMul, NumberDiv } from "@/utils/index.js"
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { sumCustomerChannelCapital } from '@/api/index.js'
import PlanDialog from './PlanDialog'
import moment from 'moment'
export default {
  name: 'Form',
  // props: ['showReceipDialog', 'dateType1', 'customerId', 'customerName', 'returnMoneyStartDate', 'returnMoneyEndDate'],
  data() {
    return {
      moneyList: [],
      returnMoneyApprovalVoList: [],
      showReceipDetailDialog: false,
      form: {
        returnMoneyStartDate: '',
        returnMoneyEndDate: '',
      },
      companyId: '',
      companyName: '',
      isEditPlanShow: false,
      ChannelType: [],
      nature: '',
      path5: {},
      value1: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '本日',
            onClick(picker) {
              const end = new Date();
              const start = new Date();;
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '本季',
            onClick(picker) {
              const end = moment().endOf('quarter').format('YYYY-MM-DD');
              const start = moment().startOf('quarter').format('YYYY-MM-DD');
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '本年',
            onClick(picker) {
              const end = moment().endOf('year').format('YYYY-MM-DD');
              const start = moment().startOf('year').format('YYYY-MM-DD');
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
    }
  },
  components: { ReceiptUseDetails, PlanDialog },
  created() {
    if (sessionStorage.getItem('path5')) {
      this.path5 = JSON.parse(sessionStorage.getItem('path5'))
    }
    if (this.$route.query.customerId) {
      this.customerId = this.$route.query.customerId
    }
    if (this.$route.query.companyId) {
      this.companyId = this.$route.query.companyId
    }
    if (this.$route.query.returnMoneyStartDate) {
      this.form.returnMoneyStartDate = this.$route.query.returnMoneyStartDate
    }
    if (this.$route.query.returnMoneyStartDate) {
      this.form.returnMoneyEndDate = this.$route.query.returnMoneyEndDate
    }
    if (this.$route.query.customerName) {
      this.customerName = this.$route.query.customerName
    }
    if (this.$route.query.nature) {
      this.nature = this.$route.query.nature
    }
    const { returnMoneyStartDate, returnMoneyEndDate } = this.form
    this.value1 = [returnMoneyStartDate, returnMoneyEndDate]
    this.getList()
  },
  beforeDestroy() {
    if (sessionStorage.getItem('path5')) {
      sessionStorage.removeItem('path5')
    }
  },
  methods: {
    toClick() {
      if (this.path5) {
        const { path, nature, returnMoneyStartDate, returnMoneyEndDate, companyId, companyName } = this.path5
        this.$router.push({ path: path, query: { nature, returnMoneyStartDate, returnMoneyEndDate, companyId, companyName } })
      }
    },
    getList() {
      sumCustomerChannelCapital({ ...this.form, companyId: this.companyId, customerId: this.customerId, nature: this.nature }).then(res => {
        this.moneyList = res.data
        this.moneyList.forEach(item => {
          this.$set(item, 'unrecordedAmount', NumberSub(item.invoiceAmount, item.returnAmount))
          this.$set(item, 'noInvoiceAmount', NumberSub(item.planAmount, item.invoiceAmount) > 0 ? NumberSub(item.planAmount, item.invoiceAmount) : 0)
        })
        this.moneyList = this.moneyList.filter(item => {
          return item.planAmount != 0 ||
            item.invoiceAmount != 0 ||
            item.noInvoiceAmount != 0 ||
            item.returnAmount != 0 ||
            item.unrecordedAmount != 0 ||
            item.availableMoney != 0 ||
            item.usedMoney != 0 ||
            item.surplusAvailableMoney != 0
        })
      })
    },
    changeTime() {
      if (this.value1) {
        this.form.returnMoneyStartDate = this.value1[0]
        this.form.returnMoneyEndDate = this.value1[1]
        const { returnMoneyStartDate, returnMoneyEndDate } = this.form
        this.value1 = [returnMoneyStartDate, returnMoneyEndDate]
        this.getList()
      }
    },
    handleDetail(row) {
      this.showReceipDetailDialog = true
      this.returnMoneyApprovalVoList = row.returnMoneyApprovalVoList
    },
    dialogClose() {
      this.$emit('input', false)
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 1) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.moneyList.map(item => item.planAmount)))
        }
        if (index === 2) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.moneyList.map(item => item.invoiceAmount)))
        }
        if (index === 3) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.moneyList.map(item => item.noInvoiceAmount)))
        }
        if (index === 4) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.moneyList.map(item => item.returnAmount)))
        }
        if (index === 5) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.moneyList.map(item => item.unrecordedAmount)))
        }
        if (this.nature == 1) {
          if (index === 6) {
            sums[index] = this.$options.filters.toThousands(NumberAdd(this.moneyList.map(item => item.availableMoney)))
          }
          if (index === 7) {
            sums[index] = this.$options.filters.toThousands(NumberAdd(this.moneyList.map(item => item.usedMoney)))
          }
          if (index === 8) {
            sums[index] = this.$options.filters.toThousands(NumberAdd(this.moneyList.map(item => item.surplusAvailableMoney)))
          }
        }
      });

      return sums;
    },
    cancel() {
      this.$emit('update:showReceipDialog', false)
    },
  },
}
</script>

<style lang="scss" scoped>
.top-search {
  display: flex;
  justify-content: end;
  align-items: center;
  margin-right: 20px;
}
.date-box {
  // margin-bottom: 20px;
  padding: 10px 0;
  text-align: right;
  margin-right: 20px;
  .link {
    font-size: 15px;
    height: 20px;
    display: inline-block;
    margin-left: 10px;
    cursor: pointer;
  }
  .active {
    color: #3a7dff;
  }
  .active::after {
    content: " ";
    display: block;
    margin-top: 14px;
    border-bottom: 2px solid #3a7dff;
  }
}
.top-button {
  float: left;
  margin-left: 20px;
}
.title-name {
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  // margin-bottom: 20px;
  padding-top: 5px;
}
.money-info {
  padding: 0;
}
.statistical-time {
  margin-right: 10px;
  font-size: 14px;
  font-weight: 700;
}
.top-title {
  display: flex;
  padding-left: 10px;
  padding-top: 10px;
  float: left;
  .title-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-right: 5px;
    img {
      width: 19px;
      height: 19px;
      margin-top: 2px;
    }
  }
}
::v-deep .el-table__footer-wrapper .el-table__footer tbody tr {
  font-weight: 700;
  background-color: #f4f8ff !important;
}
::v-deep .el-table__footer-wrapper tbody td.el-table__cell {
  background-color: #f4f8ff !important;
}
::v-deep .format-right {
  padding-right: 10px;
}
</style>