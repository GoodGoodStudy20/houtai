<template>
  <div style="background:#fff">
    <!-- <el-button @click="cancel" class="top-button" style="margin-bottom:10px">返回</el-button> -->
    <div class="top-title">
      <div class="title-item table-text" @click="toClick"><img src="@/assets/img/left.png" alt=""><span>返回</span></div>
    </div>
    <div class="title-name">{{customerName}}业务统计</div>
    <div>
      <div class="date-box">
        <!-- <el-date-picker @change="changeTime" v-model="form.returnMoneyStartDate" size="mini" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:140px"></el-date-picker>
          至
          <el-date-picker @change="changeTime" v-model="form.returnMoneyEndDate" size="mini" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:140px"></el-date-picker> -->
        <el-date-picker size="mini" v-model="value1" value-format="yyyy-MM-dd" @change="changeTime" type="daterange" style="width:200px" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
      </div>
      <el-table stripe :data="list" show-summary :summary-method="getSummaries" style="max-width: 100%;margin-top:15px;" :header-cell-style="{'background-color':'#F4F8FF'}">
        <el-table-column label="渠道" prop="channelName" width="220" align="left" class-name="format-left">
          <template slot-scope="scope">
            <span>{{scope.row.channelName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务总额" prop="amount" align="right" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.amount || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="垫资总额" prop="advanceMoney" align="right" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.advanceMoney || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="不垫资总额" prop="noAdvanceMoney" align="right" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.noAdvanceMoney || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="权益总额" prop="integralMoney" align="right" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.integralMoney || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="非权益总额" prop="noIntegralMoney" align="right" min-width="120" class-name="format-right">
          <template slot-scope="scope">
            <span>{{scope.row.noIntegralMoney || 0 | toThousands}}</span>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>

<script>
import { NumberSub, NumberAdd, NumberMul, NumberDiv } from "@/utils/index.js"
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { getBusinessStatisticsByChannelId } from '@/api/index.js'
import moment from 'moment'
export default {
  name: 'Form',
  // props: ['showReceipDialog', 'dateType1', 'customerId', 'customerName', 'returnMoneyStartDate', 'returnMoneyEndDate'],
  data() {
    return {
      list: [],
      returnMoneyApprovalVoList: [],
      showReceipDetailDialog: false,
      form: {
        startDate: '',
        endDate: '',
      },
      total: 0,
      companyName: '',
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
  created() {
    if (sessionStorage.getItem('path5')) {
      this.path5 = JSON.parse(sessionStorage.getItem('path5'))
    }
    if (this.$route.query.customerId) {
      this.customerId = this.$route.query.customerId
    }
    if (this.$route.query.startDate) {
      this.form.startDate = this.$route.query.startDate
    }
    if (this.$route.query.endDate) {
      this.form.endDate = this.$route.query.endDate
    }
    if (this.$route.query.customerName) {
      this.customerName = this.$route.query.customerName
    }
    const { startDate, endDate } = this.form
    this.value1 = [startDate, endDate]
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
        const { path, startDate, endDate, companyId, companyName } = this.path5
        this.$router.push({ path: path, query: { startDate, endDate, companyId, companyName } })
      }
    },
    getList() {
      getBusinessStatisticsByChannelId({ ...this.form, customerId: this.customerId }).then(res => {
        this.list = res.data
        this.total = res.data.total
      })
    },
    changeTime() {
      if (this.value1) {
        this.form.startDate = this.value1[0]
        this.form.endDate = this.value1[1]
        const { startDate, endDate } = this.form
        this.value1 = [startDate, endDate]
        this.getList()
      }
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
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.amount)))
        }
        if (index === 2) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.advanceMoney)))
        }
        if (index === 3) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.noAdvanceMoney)))
        }
        if (index === 4) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.integralMoney)))
        }
        if (index === 5) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.noIntegralMoney)))
        }
      });
      return sums;
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