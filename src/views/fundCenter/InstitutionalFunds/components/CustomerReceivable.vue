<template>
  <div>

    <div v-if="!showReceipDialog">
      <div class="top-title">
        <div class="title-item table-text" v-for="item in path5" :key="item.id" @click="toClick(item)"><img src="@/assets/img/left.png" alt=""><span>{{item.name}}</span></div>
      </div>
      <!-- <el-button @click="cancel" class="top-button" style="margin-bottom:10px">返回</el-button> -->
      <div class="title-name">{{companyName}}</div>
      <!-- <h3>资金统计情况</h3> -->

      <div class="num-box" style="margin-right:2%">
        <div class="date-box">
          <el-date-picker @change="changeTime" v-model="form.returnMoneyStartDate" size="mini" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:140px"></el-date-picker>
          至
          <el-date-picker @change="changeTime" v-model="form.returnMoneyEndDate" size="mini" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:140px"></el-date-picker>
          <span class="link" :class="dateType=='month'?'active':''" @click="changeTime('month')">本月</span>
          <span class="link" :class="dateType=='year'?'active':''" @click="changeTime('year')">本年</span>
        </div>
        <div class="top-box">
          <div class="child">
            <!-- <img src="@/assets/img/总额2.png" alt=""> -->
            <p class="title">已开票总额</p>
            <p class="number">{{ moneyData.invoiceAmount || 0 | toThousands }}</p>
          </div>
          <div class="child">
            <!-- <img src="@/assets/img/已开金额.png" alt=""> -->
            <p class="title">已到账总额</p>
            <p class="number">{{ moneyData.returnAmount || 0 | toThousands }}</p>
          </div>
          <div class="child">
            <!-- <img src="@/assets/img/剩余金额.png" alt=""> -->
            <p class="title">未到账总额</p>
            <p class="number">{{ moneyData.unrecordedAmount || 0 | toThousands }}</p>
          </div>
          <div class="child">
            <!-- <img src="@/assets/img/省份.png" alt=""> -->
            <p class="title">可用委托总额</p>
            <p class="number">{{ moneyData.availableMoney || 0 | toThousands }}</p>
          </div>
          <div class="child">
            <!-- <img src="@/assets/img/客户2.png" alt=""> -->
            <p class="title">已用委托</p>
            <p class="number">{{ moneyData.usedMoney || 0 | toThousands }}</p>
          </div>
          <div class="child">
            <!-- <img src="@/assets/img/客户2.png" alt=""> -->
            <p class="title">剩余委托</p>
            <p class="number">{{ moneyData.surplusAvailableMoney || 0 | toThousands }}</p>
          </div>
        </div>
      </div>
      <el-table stripe :data="moneyList" show-summary :summary-method="getSummaries" style="max-width: 100%;margin-top:15px;" :header-cell-style="{'background-color':'#F4F8FF'}">
        <el-table-column label="客户" prop="customerName" width="220" align="left">
          <template slot-scope="scope">
            <span class="table-text" @click="handleClick(scope.row)">{{scope.row.customerName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="已开票总额" prop="invoiceAmount" min-width="110" align="right">
          <template slot-scope="scope">
            <span>{{scope.row.invoiceAmount || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="已到账总额" prop="returnAmount" align="right" min-width="110">
          <template slot-scope="scope">
            <span>{{scope.row.returnAmount || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="未到账总额" prop="unrecordedAmount" align="right" min-width="110">
          <template slot-scope="scope">
            <span>{{scope.row.unrecordedAmount || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="可用委托总额" prop="availableMoney" align="right" min-width="110">
          <template slot-scope="scope">
            <span>{{scope.row.availableMoney || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="已用委托" prop="usedMoney" align="right" min-width="110">
          <template slot-scope="scope">
            <span>{{scope.row.usedMoney || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="剩余委托" prop="surplusAvailableMoney" align="right" min-width="110">
          <template slot-scope="scope">
            <span>{{scope.row.surplusAvailableMoney || 0 | toThousands}}</span>
          </template>
        </el-table-column>
      </el-table>
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
      dateType: 'month',
      customerId: '',
      path5: []
    }
  },
  created() {
    if (sessionStorage.getItem('path5')) {
      this.path5 = JSON.parse(sessionStorage.getItem('path5'))
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
    if (this.$route.query.dateType) {
      this.dateType = this.$route.query.dateType
    }
    if (this.$route.query.companyName) {
      this.companyName = this.$route.query.companyName
    }
    this.getList()
  },
  methods: {
    getList() {
      sumCustomerCapital({ ...this.form, companyId: this.companyId }).then(res => {
        this.moneyData = res.data
        this.$set(this.moneyData, 'unrecordedAmount', NumberSub(this.moneyData.invoiceAmount, this.moneyData.returnAmount))
        this.moneyList = res.data.companyReturnMoneyList
        this.moneyList.forEach(item => {
          this.$set(item, 'unrecordedAmount', NumberSub(item.invoiceAmount, item.returnAmount))
        })
      })
    },
    changeTime(type = '') {
      this.dateType = type
      if (type == 'month') {
        this.form.returnMoneyStartDate = moment().startOf('month').format('YYYY-MM-DD')
        this.form.returnMoneyEndDate = moment().endOf('month').format('YYYY-MM-DD')
      } else if (type == 'year') {
        this.form.returnMoneyStartDate = moment().startOf('year').format('YYYY-MM-DD')
        this.form.returnMoneyEndDate = moment().endOf('year').format('YYYY-MM-DD')
      }
      this.getList()
    },
    handleClick(row) {
      let a = [
        {
          customerId: row.customerId,
          name: row.customerName,
          routerLevel: 2,
          path: '/fundCenter/CustomerReceivable',
          dateType: this.dateType,
          returnMoneyStartDate: this.form.returnMoneyStartDate,
          returnMoneyEndDate: this.form.returnMoneyEndDate,
          companyId: this.companyId,
          companyName: this.companyName
        }
      ]
      let b = JSON.parse(sessionStorage.getItem('path5'))
      b = b.concat(a)
      this.$router.push({ path: '/fundCenter/ChannelReceivable', query: { customerName: row.customerName, customerId: row.customerId, dateType: this.dateType, returnMoneyStartDate: this.form.returnMoneyStartDate, returnMoneyEndDate: this.form.returnMoneyEndDate } })
      sessionStorage.setItem('path5', JSON.stringify(b))
      // this.showReceipDialog = true
      // this.customerId = row.customerId
      // this.customerName = row.customerName
    },
    toClick(item) {
      if (item.routerLevel == 1) {
        sessionStorage.removeItem('path5')
      } else {
        let b = JSON.parse(sessionStorage.getItem('path5'))
        let c = b.filter(it => it.routerLevel < item.routerLevel)
        sessionStorage.setItem('path5', JSON.stringify(c))
      }
      this.$router.push({ path: item.path })
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
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.moneyList.map(item => item.invoiceAmount || 0)))
        }
        if (index === 2) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.moneyList.map(item => item.returnAmount || 0)))
        }
        if (index === 3) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.moneyList.map(item => item.unrecordedAmount || 0)))
        }
        if (index === 4) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.moneyList.map(item => item.availableMoney || 0)))
        }
        if (index === 5) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.moneyList.map(item => item.usedMoney || 0)))
        }
        if (index === 6) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.moneyList.map(item => item.surplusAvailableMoney || 0)))
        }
      });

      return sums;
    },
    cancel() {
      this.$emit('update:isCustomerInfoShow', false)
    },
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
  margin-bottom: 20px;
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
  margin-bottom: 10px;

  // .top-title {
  //   display: flex;
  //   justify-content: space-between;

  //   h3:nth-child(2) {
  //     width: 27%;
  //   }
  // }
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
.top-title {
  display: flex;
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
</style>