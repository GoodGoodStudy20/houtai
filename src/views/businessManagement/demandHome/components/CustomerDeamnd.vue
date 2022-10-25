<template>
  <div>
    <div style="background:#fff">
      <div class="top-title">
        <div class="title-item table-text" @click="toClick"><img src="@/assets/img/left.png" alt=""><span>返回</span></div>
      </div>
      <div class="title-name">{{companyName}}业务统计</div>
      <div class="num-box" style="margin-right:2%">
        <div class="date-box">
          <el-date-picker size="mini" v-model="value1" value-format="yyyy-MM-dd" @change="changeTime" type="daterange" style="width:200px" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
        </div>
        <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;" :header-cell-style="{'background-color':'#F4F8FF'}">
          <el-table-column label="客户" prop="abbreviated" width="220" align="left" class-name="format-left">
            <template slot-scope="scope">
              <span class="table-text" @click="handleClick(scope.row)">{{scope.row.abbreviated}}</span>
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
        <!-- <div style="display: flex; justify-content: center">
          <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total"></el-pagination> -->
        <!-- <el-button v-show="isShowExport && !$attrs.disabled" style="margin-top: 10px; margin-left: 50px" size="mini" type="primary" v-debounce="exportClick" :loading="loading">导出</el-button> -->
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { getBusinessStatisticsByCustomerId } from '@/api/index'
import { NumberAdd, NumberSub } from '@/utils/index.js'
import moment from 'moment'
export default {
  name: 'CustomerDeamnd',
  data() {
    return {
      list: [],
      customerName: '',
      form: {
        startDate: '',
        endDate: '',
      },
      customerId: '',
      nature: '',
      value1: [],
      total: 0,
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
    if (this.$route.query.startDate) {
      this.form.startDate = this.$route.query.startDate
    }
    if (this.$route.query.endDate) {
      this.form.endDate = this.$route.query.endDate
    }
    if (this.$route.query.companyName) {
      this.companyName = this.$route.query.companyName
    }
    const { startDate, endDate } = this.form
    this.value1 = [startDate, endDate]
    this.getList()
  },
  methods: {
    getList() {
      const { startDate, endDate } = this.form
      getBusinessStatisticsByCustomerId({ ...this.form, companyId: this.companyId, startDate, endDate }).then(res => {
        this.list = res.data
        // this.total = res.data.total
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
    handleClick(row) {
      let a =
      {
        customerId: row.customerId,
        name: row.customerName,
        routerLevel: 2,
        path: '/businessManagement/CustomerDeamnd',
        startDate: this.form.startDate,
        endDate: this.form.endDate,
        companyId: this.companyId,
        companyName: this.companyName,
      }
      this.$router.push({ path: '/businessManagement/ChannelDemand', query: { customerName: row.abbreviated, customerId: row.customerId, startDate: this.form.startDate, endDate: this.form.endDate } })
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
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.amount || 0)))
        }
        if (index === 2) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.advanceMoney || 0)))
        }
        if (index === 3) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.noAdvanceMoney || 0)))
        }
        if (index === 4) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.integralMoney || 0)))
        }
        if (index === 5) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.noIntegralMoney || 0)))
        }
      });
      return sums;
    },
    toClick() {
      this.$router.push({ path: '/businessManagement/demandHome' })
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
  .top-title {
    display: flex;
    justify-content: space-between;
    h3:nth-child(2) {
      width: 27%;
    }
  }
}
.top-box {
  display: flex;
  justify-content: space-between;
  .child {
    flex: 1;
    height: 150px;
    margin: 0 10px;
    align-items: center;
    border-radius: 10px;
    background: #fff;
    filter: drop-shadow(0px 7px 14px rgba(58, 125, 255, 0.1));
    box-sizing: border-box;
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