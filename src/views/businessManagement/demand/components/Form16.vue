<template>
  <div>
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div>
        <h3 class="basic-info money-info">机构资金情况</h3>
      </div>
      <div style="display:flex;align-items:center;margin-right:20px">
        <div class="statistical-time">
          开票时间
        </div>
        <el-date-picker v-model="submitTime" style="width:300px" @change="changeTime" value-format="yyyy-MM-dd" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>
    <!-- <h3 class="basic-info">机构资金情况</h3> -->
    <div>
      <el-table stripe :data="moneyList" show-summary sum-text='合计' :summary-method="getSummaries" style="max-width: 100%;margin-top:15px;" :header-cell-style="{'background-color':'#F4F8FF'}">
        <el-table-column label="渠道" prop="customerName" align="left"></el-table-column>
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
    <ReceiptUseDetails v-model="showReceipDialog" v-if="showReceipDialog" :returnMoneyApprovalList="returnMoneyApprovalList"></ReceiptUseDetails>

  </div>
</template>

<script>
import ReceiptUseDetails from "./ReceiptUseDetails"
import { NumberSub, NumberAdd, NumberMul, NumberDiv } from "@/utils/index.js"
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { getReturnMoneyApprovalByCustomerId } from '@/api/index.js'
export default {
  name: 'Form16',
  props: ['value',],
  data() {
    return {
      dialogImageUrl: '',
      list: [],
      dialogVisible: false,
      arrivalAvailableMoney: "",
      income: "",
      submitTime: '',
      moneyList: [],
      customerId: '',
      showReceipDialog: false,
      returnMoneyApprovalList: []
    }
  },
  components: { ElImageViewer, ReceiptUseDetails },
  created() {
    // this.getReturnMoneyApprovalByCustomerId({ customerId: this.customer.id })
  },
  methods: {
    handleDetail(row) {
      this.showReceipDialog = true
      this.returnMoneyApprovalList = row.returnMoneyApprovalList
    },
    onload2(item, type) {
      if (type == 'onload') {
        this.customerId = item.customerId
      } else {
        this.customerId = item.id
        this.submitTime = []
      }
      let param = {
        customerId: this.customerId,
        returnMoneyStartDate: item.capitalStartTime,
        returnMoneyEndDate: item.capitalEndTime,
      }
      this.getReturnMoneyApprovalByCustomerId(param)
    },
    onload(result) {
      // this.customerId
      this.customerId = result.customerId
      if (result.capitalStartTime && result.capitalEndTime) {
        this.submitTime = [result.capitalStartTime, result.capitalEndTime]
      } else {
        this.submitTime = []
      }

      let param = {
        returnMoneyStartDate: result.capitalStartTime,
        returnMoneyEndDate: result.capitalEndTime,
        customerId: result.customerId
      }
      this.getReturnMoneyApprovalByCustomerId(param)
    },
    getReturnMoneyApprovalByCustomerId(param = {}) {
      getReturnMoneyApprovalByCustomerId(param).then(res => {
        this.moneyList = res.data
        this.moneyList.forEach(item => [
          this.$set(item, 'unrecordedAmount', NumberSub(item.invoiceAmount, item.returnAmount))
        ])
      })
    },
    changeTime() {
      let param = {}
      if (this.submitTime) {
        param = {
          returnMoneyStartDate: this.submitTime[0],
          returnMoneyEndDate: this.submitTime[1],
          customerId: this.customerId
        }
      }
      this.getReturnMoneyApprovalByCustomerId(param)
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
    commit() {
      if (this.submitTime) {
        return this.submitTime
      } else {
        return []
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.money-info {
  padding: 0;
}
.statistical-time {
  margin-right: 10px;
  font-size: 14px;
  font-weight: 700;
}
::v-deep .el-table__footer-wrapper .el-table__footer tbody tr {
  font-weight: 700;
  background-color: #f4f8ff !important;
}
::v-deep .el-table__footer-wrapper tbody td.el-table__cell {
  background-color: #f4f8ff !important;
}
</style>