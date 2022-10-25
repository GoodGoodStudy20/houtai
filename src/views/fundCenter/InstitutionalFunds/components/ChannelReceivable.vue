<template>
  <div>
    <!-- <el-button @click="cancel" class="top-button" style="margin-bottom:10px">返回</el-button> -->
    <div class="top-title">
      <div class="title-item table-text" v-for="item in path5" :key="item.id" @click="toClick(item)">{{item.name}}</div>
    </div>
    <div class="title-name">{{customerName}}</div>
    <div class="top-search">
      <div class="statistical-time">
        开票时间
      </div>
      <div class="date-box">
        <el-date-picker @change="changeTime" v-model="form.returnMoneyStartDate" size="mini" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:140px"></el-date-picker>
        至
        <el-date-picker @change="changeTime" v-model="form.returnMoneyEndDate" size="mini" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:140px"></el-date-picker>
        <span class="link" :class="dateType=='month'?'active':''" @click="changeTime('month')">本月</span>
        <span class="link" :class="dateType=='year'?'active':''" @click="changeTime('year')">本年</span>
      </div>
    </div>

    <div>
      <el-table stripe :data="moneyList" show-summary :summary-method="getSummaries" style="max-width: 100%;margin-top:15px;" :header-cell-style="{'background-color':'#F4F8FF'}">
        <el-table-column label="渠道" prop="customerChannelName" align="left"></el-table-column>
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
        <el-table-column label="使用记录" width="100" fixed="right" align="center">
          <template slot-scope="scope">
            <span class="table-text" @click="handleDetail(scope.row)">查看明细</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ReceiptUseDetails v-model="showReceipDetailDialog" v-if="showReceipDetailDialog" :returnMoneyApprovalList="returnMoneyApprovalList"></ReceiptUseDetails>

  </div>
</template>

<script>
import ReceiptUseDetails from "./ReceiptUseDetails"
import { NumberSub, NumberAdd, NumberMul, NumberDiv } from "@/utils/index.js"
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { sumCustomerChannelCapital } from '@/api/index.js'
import moment from 'moment'
export default {
  name: 'ChannelReceivable',
  // props: ['showReceipDialog', 'dateType1', 'customerId', 'customerName', 'returnMoneyStartDate', 'returnMoneyEndDate'],
  data() {
    return {
      moneyList: [],
      returnMoneyApprovalList: [],
      showReceipDetailDialog: false,
      form: {
        returnMoneyStartDate: '',
        returnMoneyEndDate: '',
      },
      dateType: 'month',
      path5: []
    }
  },
  components: { ReceiptUseDetails },
  created() {
    if (sessionStorage.getItem('path5')) {
      this.path5 = JSON.parse(sessionStorage.getItem('path5'))
    }
    if (this.$route.query.customerId) {
      this.customerId = this.$route.query.customerId
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
    if (this.$route.query.customerName) {
      this.customerName = this.$route.query.customerName
    }
    // this.dateType = this.dateType1
    // this.form.returnMoneyStartDate = this.returnMoneyStartDate
    // this.form.returnMoneyEndDate = this.returnMoneyEndDate
    this.getList()
  },
  methods: {
    toClick(item) {
      if (item.routerLevel == 1) {
        sessionStorage.removeItem('path5')
        this.$router.push({ path: item.path })
      } else {
        let b = JSON.parse(sessionStorage.getItem('path5'))
        let c = b.filter(it => it.routerLevel < item.routerLevel)
        sessionStorage.setItem('path5', JSON.stringify(c))
        const { returnMoneyStartDate, returnMoneyEndDate, dateType, companyId, companyName } = item
        this.$router.push({ path: item.path, query: { returnMoneyStartDate, returnMoneyEndDate, dateType, companyId, companyName } })
      }
    },
    getList() {
      sumCustomerChannelCapital({ ...this.form, customerId: this.customerId }).then(res => {
        this.moneyList = res.data
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
    handleDetail(row) {
      this.showReceipDetailDialog = true
      this.returnMoneyApprovalList = row.returnMoneyApprovalList
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
  margin-bottom: 20px;
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
  .title-item {
    font-size: 14px;
    margin-right: 5px;
  }
  .title-item:after {
    display: inline-block;
    content: ">";
    margin-left: 5px;
  }
  // .title-item:first-child:before {
  //   display: inline-block;
  //   content: "";
  // }
}
::v-deep .el-table__footer-wrapper .el-table__footer tbody tr {
  font-weight: 700;
  background-color: #f4f8ff !important;
}
::v-deep .el-table__footer-wrapper tbody td.el-table__cell {
  background-color: #f4f8ff !important;
}
</style>