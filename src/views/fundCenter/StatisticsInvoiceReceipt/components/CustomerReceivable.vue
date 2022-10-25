<template>
  <div>
    <div style="background:#fff">
      <div class="top-title">
        <div class="title-item table-text" @click="toClick"><img src="@/assets/img/left.png" alt=""><span>返回</span></div>
      </div>
      <!-- <el-button @click="cancel" class="top-button" style="margin-bottom:10px">返回</el-button> -->
      <div class="title-name">{{companyName}}开票报表</div>

      <div class="num-box" style="margin-right:2%">
        <div class="date-box">
          <el-date-picker size="mini" v-model="value1" value-format="yyyy-MM-dd" @change="changeTime" type="daterange" style="width:200px" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
        </div>

        <el-table stripe :data="moneyList" show-summary :summary-method="getSummaries" style="max-width: 100%;margin-top:15px;" :header-cell-style="{'background-color':'#F4F8FF'}">
          <el-table-column label="客户" prop="customerName" width="220" align="left" class-name="format-left">
            <template slot-scope="scope">
              <span class="table-text" @click="handleClick(scope.row)">{{scope.row.customerName}}</span>
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
        </el-table>
      </div>
    </div>
    <!-- <Form :customerName="customerName" :dateType1="dateType" :returnMoneyStartDate="form.returnMoneyStartDate" :returnMoneyEndDate="form.returnMoneyEndDate" :customerId="customerId" :showReceipDialog.sync="showReceipDialog" v-if="showReceipDialog"></Form> -->
    <!-- <ReceiptUseDetails v-model="showReceipDialog" v-if="showReceipDialog" :returnMoneyApprovalList="returnMoneyApprovalList"></ReceiptUseDetails> -->
  </div>
</template>

<script>
import { sumCustomerCapital } from '@/api/index'
// import Form from './Form.vue'
import { NumberAdd, NumberSub } from '@/utils/index.js'
import moment from 'moment'
export default {
  name: 'InstitutionalFunds',
  // components: { Form },
  // inject: ['reload'],
  // props: ['dateType1', 'isCustomerInfoShow', 'companyName', 'companyId', 'returnMoneyStartDate', 'returnMoneyEndDate'],
  data() {
    return {
      moneyList: [],
      moneyData: {},
      showReceipDialog: false,
      returnMoneyApprovalList: [],
      detailReceipRow: {},
      customerName: '',
      form: {
        returnMoneyStartDate: '',
        returnMoneyEndDate: '',
      },
      customerId: '',
      nature: '',
      value1: [],
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
  created() {
    if (this.$route.query.companyId) {
      this.companyId = this.$route.query.companyId
    }
    if (this.$route.query.returnMoneyStartDate) {
      this.form.returnMoneyStartDate = this.$route.query.returnMoneyStartDate
    }
    if (this.$route.query.returnMoneyStartDate) {
      this.form.returnMoneyEndDate = this.$route.query.returnMoneyEndDate
    }
    if (this.$route.query.companyName) {
      this.companyName = this.$route.query.companyName
    }
    if (this.$route.query.nature) {
      this.nature = this.$route.query.nature
    }
    const { returnMoneyStartDate, returnMoneyEndDate } = this.form
    this.value1 = [returnMoneyStartDate, returnMoneyEndDate]
    this.getList()
  },
  methods: {
    getList() {
      sumCustomerCapital({ ...this.form, companyId: this.companyId, nature: this.nature }).then(res => {
        this.moneyData = res.data
        this.$set(this.moneyData, 'unrecordedAmount', NumberSub(this.moneyData.invoiceAmount, this.moneyData.returnAmount))
        this.moneyList = res.data.returnMoneyStatisticsVoList
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
    handleClick(row) {
      let a =
      {
        customerId: row.customerId,
        name: row.customerName,
        routerLevel: 2,
        path: '/fundCenter/CustomerReceivable',
        returnMoneyStartDate: this.form.returnMoneyStartDate,
        returnMoneyEndDate: this.form.returnMoneyEndDate,
        companyId: this.companyId,
        companyName: this.companyName,
        nature: this.nature
      }
      this.$router.push({ path: '/fundCenter/ChannelReceivable', query: { customerName: row.customerName, companyId: this.companyId, nature: this.nature, customerId: row.customerId, returnMoneyStartDate: this.form.returnMoneyStartDate, returnMoneyEndDate: this.form.returnMoneyEndDate } })
      sessionStorage.setItem('path5', JSON.stringify(a))
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
      this.$emit('update:isCustomerInfoShow', false)
    },
    toClick() {
      this.$router.push({ path: '/fundCenter/StatisticsInvoiceReceipt', query: { returnMoneyStartDate: this.form.returnMoneyStartDate, returnMoneyEndDate: this.form.returnMoneyEndDate, } })
    }
  }

}
</script>

<style lang='scss' scoped>
.top-button {
  float: left;
  margin-left: 20px;
}
.title-name {
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  padding-top: 5px;
  // margin-bottom: 20px;
}
.customer-text {
  color: #0099ff;
  cursor: pointer;
}
.num-box {
  width: 100%;
  display: inline-block;
  background: #fff;
  border-radius: 10px;
  padding: 10px 0;
  // margin-bottom: 10px;

  .top-title {
    display: flex;
    justify-content: space-between;
    h3:nth-child(2) {
      width: 27%;
    }
  }
}
.top-box {
  // background: red;
  display: flex;
  justify-content: space-between;

  // color: #fff;
  .child {
    flex: 1;
    height: 150px;
    margin: 0 10px;
    // display: flex;
    align-items: center;
    border-radius: 10px;
    background: #fff;
    filter: drop-shadow(0px 7px 14px rgba(58, 125, 255, 0.1));
    box-sizing: border-box;
    // padding: 20px 0 14px 13px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      width: 36px;
      height: 36px;
      margin-bottom: 15px;
    }

    .title {
      font-size: 16px;
      color: #5a5881;
      margin: 0;
    }

    .number {
      font-weight: bold;
      font-size: 22px;
      margin: 6px 0 0 0;
      color: #15134b;
    }
  }

  .child:hover {
    box-shadow: 0px 10px 20px rgba(111, 108, 255, 0.25);
    transition: all 0.5s;
  }
}
.date-box {
  margin-bottom: 20px;
  // padding: 10px 0;
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
::v-deep .format-right {
  padding-right: 10px;
}
::v-deep .format-left {
  padding-left: 10px;
}
::v-deep .el-table__footer-wrapper .el-table__footer tbody tr {
  font-weight: 700;
  background-color: #f4f8ff !important;
}
::v-deep .el-table__footer-wrapper tbody td.el-table__cell {
  background-color: #f4f8ff !important;
}
</style>