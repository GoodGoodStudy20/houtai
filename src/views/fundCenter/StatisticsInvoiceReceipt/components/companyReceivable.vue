<template>
  <div>
    <div v-loading="loading" style="padding-top:6px">
      <!-- <h3>资金统计情况</h3> -->

      <div class="num-box" style="margin-right:2%">
        <div class="date-box">
          <div>
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
              <el-tab-pane label="不垫资开票" name="1">
                <span slot="label" class="line">不垫资开票</span>
              </el-tab-pane>
              <el-tab-pane label="垫资开票" name="0">
                <span slot="label" class="line">垫资开票</span>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div>
            <el-date-picker size="mini" v-model="value1" value-format="yyyy-MM-dd" @change="changeTime" type="daterange" style="width:200px" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
          </div>
        </div>
        <div class="top-box">
          <div class="child">
            <!-- <img src="@/assets/img/总额2.png" alt=""> -->
            <p class="title">规划总额</p>
            <p class="number">{{ moneyData.planAmount || 0 | toThousands }}</p>
          </div>
          <div class="child">
            <!-- <img src="@/assets/img/总额2.png" alt=""> -->
            <p class="title">已开总额</p>
            <p class="number">{{ moneyData.invoiceAmount || 0 | toThousands }}</p>
          </div>
          <div class="child">
            <!-- <img src="@/assets/img/总额2.png" alt=""> -->
            <p class="title">未开总额</p>
            <p class="number">{{ moneyData.noInvoiceAmount || 0 | toThousands }}</p>
          </div>
          <div class="child">
            <!-- <img src="@/assets/img/已开金额.png" alt=""> -->
            <p class="title">{{form.nature==1?'已到账总额':'已回款总额'}}</p>
            <p class="number">{{ moneyData.returnAmount || 0 | toThousands }}</p>
          </div>
          <div class="child">
            <!-- <img src="@/assets/img/剩余金额.png" alt=""> -->
            <p class="title">{{form.nature==1?'已开未到账总额':'已开未回款总额'}}</p>
            <p class="number">{{ moneyData.unrecordedAmount || 0 | toThousands }}</p>
          </div>
          <div class="child" v-if="form.nature==1">
            <!-- <img src="@/assets/img/省份.png" alt=""> -->
            <p class="title">可用委托总额</p>
            <p class="number">{{ moneyData.availableMoney || 0 | toThousands }}</p>
          </div>
          <div class="child" v-if="form.nature==1">
            <!-- <img src="@/assets/img/客户2.png" alt=""> -->
            <p class="title">已用委托</p>
            <p class="number">{{ moneyData.usedMoney || 0 | toThousands }}</p>
          </div>
          <div class="child" v-if="form.nature==1">
            <!-- <img src="@/assets/img/客户2.png" alt=""> -->
            <p class="title">剩余委托</p>
            <p class="number">{{ moneyData.surplusAvailableMoney || 0 | toThousands }}</p>
          </div>
        </div>
      </div>
      <div class="list-container">
        <div class="top">
          <div class="invoice-list">各分公司开票报表</div>
          <el-button icon="el-icon-edit" type="primary" @click="addClick" style="margin-right:20px" size="mini">规划金额</el-button>
        </div>

        <el-table stripe :data="moneyList" show-summary :summary-method="getSummaries" style="max-width: 100%;margin-top:15px;" :header-cell-style="{'background-color':'#F4F8FF'}">
          <el-table-column label="分公司" prop="companyName" width="220" align="left" class-name="format-left">
            <template slot-scope="scope">
              <span class="table-text" @click="handleClick(scope.row)">{{scope.row.companyName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="规划总额" prop="planAmount" min-width="110" align="right">
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
          <el-table-column :label="form.nature==1?'已到账':'已回款'" prop="returnAmount" align="right" min-width="110">
            <template slot-scope="scope">
              <span>{{scope.row.returnAmount || 0 | toThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="form.nature==1?'已开未到账':'已开未回款'" prop="unrecordedAmount" align="right" min-width="110" class-name="format-right">
            <template slot-scope="scope">
              <span>{{scope.row.unrecordedAmount || 0 | toThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column label="可用委托总额" prop="availableMoney" align="right" min-width="110" v-if="form.nature==1">
            <template slot-scope="scope">
              <span>{{scope.row.availableMoney || 0 | toThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column label="已用委托" prop="usedMoney" align="right" min-width="110" v-if="form.nature==1">
            <template slot-scope="scope">
              <span>{{scope.row.usedMoney || 0 | toThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column label="剩余委托" prop="surplusAvailableMoney" align="right" min-width="110" v-if="form.nature==1" class-name="format-right">
            <template slot-scope="scope">
              <span>{{scope.row.surplusAvailableMoney || 0 | toThousands}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <PlanDialog ref="plan" @getList="getList" v-model="isAddPlanShow" :nature="form.nature" v-if="isAddPlanShow"></PlanDialog>
  </div>
</template>

<script>
import { sumCompanyCapital } from '@/api/index'
// import CustomerInfo from './components/CustomerInfo.vue'
import PlanDialog from './PlanDialog'
import { NumberAdd, NumberSub } from '@/utils/index.js'
import moment from 'moment'
export default {
  name: 'StatisticsInvoiceReceipt',
  components: { PlanDialog },
  data() {
    return {
      isRouterAlive: true,
      form: {
        returnMoneyStartDate: moment().startOf('month').format('YYYY-MM-DD'),
        returnMoneyEndDate: moment().endOf('month').format('YYYY-MM-DD'),
        nature: 1
      },
      moneyList: [],
      moneyData: {},
      isCustomerInfoShow: false,
      companyName: '',
      companyId: '',
      time: '',
      activeName: '1',
      isAddPlanShow: false,
      value1: '',
      loading: true,
      pickerOptions: {
        shortcuts: [
          {
            text: '本日',
            onClick(picker) {
              const end = new Date();
              const start = new Date();;
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '本月',
            onClick(picker) {
              const end = moment().endOf('month').format('YYYY-MM-DD');
              const start = moment().startOf('month').format('YYYY-MM-DD');
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '上月',
            onClick(picker) {
              const end = moment().month(moment().month() - 1).endOf('month').format('YYYY-MM-DD');
              const start = moment().month(moment().month() - 1).startOf('month').format('YYYY-MM-DD');
              picker.$emit('pick', [start, end]);
            }
          },
          {
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
    if (this.$route.query.returnMoneyStartDate && this.$route.query.returnMoneyStartDate) {
      this.form.returnMoneyStartDate = this.$route.query.returnMoneyStartDate
      this.form.returnMoneyStartDate = this.$route.query.returnMoneyStartDate
    }
    const { returnMoneyStartDate, returnMoneyEndDate } = this.form
    this.value1 = [returnMoneyStartDate, returnMoneyEndDate]
    this.$nextTick(() => {
      this.getList()
    })
  },
  methods: {
    addClick() {
      this.isAddPlanShow = true
      this.$nextTick(() => {
        this.$refs['plan'].onload(this.moneyList)
      })

    },
    handleTabClick() {
      this.form.nature = Number(this.activeName)
      this.getList()
    },
    handleClick(row) {
      this.$router.push({ path: '/fundCenter/CustomerReceivable', query: { companyName: row.companyName, nature: this.form.nature, companyId: row.companyId, returnMoneyStartDate: this.form.returnMoneyStartDate, returnMoneyEndDate: this.form.returnMoneyEndDate } })
    },
    getList() {
      this.loading = true
      sumCompanyCapital(this.form).then(res => {
        this.loading = false
        this.moneyData = res.data
        this.$set(this.moneyData, 'unrecordedAmount', NumberSub(this.moneyData.invoiceAmount, this.moneyData.returnAmount))
        this.$set(this.moneyData, 'noInvoiceAmount', NumberSub(this.moneyData.planAmount, this.moneyData.invoiceAmount) > 0 ? NumberSub(this.moneyData.planAmount, this.moneyData.invoiceAmount) : 0)
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
        if (this.form.nature == 1) {
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
    changeTime() {
      if (this.value1) {
        this.form.returnMoneyStartDate = this.value1[0]
        this.form.returnMoneyEndDate = this.value1[1]
        const { returnMoneyStartDate, returnMoneyEndDate } = this.form
        this.value1 = [returnMoneyStartDate, returnMoneyEndDate]
        this.getList()
      }

    }
  }

}
</script>

<style lang='scss' scoped>
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
  margin-bottom: 10px;

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
    max-width: 250px;
    height: 150px;
    margin: 0 8px;
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
::v-deep .el-tabs__nav-wrap::after {
  // display: block;
  width: 0;
}
.date-box {
  display: flex;
  justify-content: space-between;
  align-content: center;
  // margin-bottom: 20px;
  padding: 10px 0;
  // text-align: right;
  margin-right: 20px;
  margin-left: 20px;
}
.list-container {
  background-color: #fff;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.invoice-list {
  font-size: 16px;
  font-weight: 700;
  padding: 10px 0 10px 20px;
}
// ::v-deep .el-tabs__item {
//   border-right: 1px solid #ccc;
// }
// ::v-deep .el-tabs__item:last-child {
//   border: none;
// }
::v-deep .el-table__footer-wrapper .el-table__footer tbody tr {
  font-weight: 700;
  background-color: #f4f8ff !important;
}
::v-deep .el-table__footer-wrapper tbody td.el-table__cell {
  background-color: #f4f8ff !important;
}
// ::v-deep .cell {
//   padding: 0 10px !important;
// }

::v-deep .format-right {
  padding-right: 10px;
}
::v-deep .format-left {
  padding-left: 10px;
}
</style>