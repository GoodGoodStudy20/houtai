<template>
  <div>
    <div class="demand-top">
      <div class="top-left-container">
        <div class="data-statistics">
          <!-- <h3>数据统计</h3> -->
          <div class="data-title">借款资金情况</div>
          <!-- <el-date-picker size="mini" v-model="value1" value-format="yyyy-MM-dd" @change="dataChange" type="daterange" style="width:210px" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker> -->
        </div>
        <div class="data-content">
          <div class="data-item">
            <div class="data-item-content">
              <div class="data-item-title">应还总额</div>
              <div class="data-item-amount">{{topSum.repaymentMoney || 0 | toThousands}}</div>
            </div>
          </div>
          <div class="data-item">
            <div class="data-item-content">
              <div class="data-item-title">应还本金</div>
              <div class="data-item-amount">{{topSum.money || 0 | toThousands}}</div>
            </div>
          </div>
          <div class="data-item">
            <div class="data-item-content">
              <div class="data-item-title">应还利息</div>
              <div class="data-item-amount">{{topSum.interest || 0 | toThousands}}</div>
            </div>
          </div>
          <div class="data-item">
            <div class="data-item-content">
              <div class="data-item-title">应还担保费</div>
              <div class="data-item-amount">{{topSum.guaranteeMoney || 0 | toThousands}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="top-right-container">
        <!-- <h3>常用功能</h3> -->
        <div class="data-title">常用功能</div>
        <div class="common-function">
          <div @click="toClick(item)" class="function-item" v-for="item in iconList" :key="item.id">
            <img :src="item.customIcon" alt="" />
            <p>{{item.label}}</p>
          </div>
          <!-- <div @click="toClick('invoice')" class="function-item">
            <img src="@/assets/img/今日需求2.png" alt="" />
            <p>开票管理</p>
          </div>
          <div @click="toClick('invoice')" class="function-item">
            <img src="@/assets/img/今日需求2.png" alt="" />
            <p>开票管理</p>
          </div>
          <div @click="toClick('invoice')" class="function-item">
            <img src="@/assets/img/今日需求2.png" alt="" />
            <p>开票管理</p>
          </div>
          <div @click="toClick('collection')" class="function-item">
            <img src="@/assets/img/今日需求2.png" alt="" />
            <p>回单管理</p>
          </div> -->
        </div>
      </div>
    </div>
    <div class="demand-middle">
      <div class="middle-left">
        <div class="top">
          <div class="demand-tj">还款统计</div>
        </div>
        <div class="main-echart" ref="echartRef" id='main'></div>
      </div>
      <div class="middle-right">
        <div class="top">
          <div class="remind">还款到期提醒</div>
          <!-- <h3>应收提醒</h3> -->
        </div>
        <el-table stripe :data="list" height="280px" style="max-width: 100%;margin:15px 0;" :header-cell-style="{ 'background-color': '#F4F8FF' }">
          <el-table-column label="资方" prop="backersName" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="table-text" @click="toLoan(scope.row.loanId)">{{scope.row.backersName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="主体" prop="SubjectName" align="left" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="还款日期" prop="RepaymentDate" align="left" width="100">
          </el-table-column>
          <el-table-column label="还款金额" prop="RepaymentMoney" align="right" width="120">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="demand-footer">
      <!-- <div class="main-container"> -->
      <div class="main-echart2" ref="echartRef2" id='main2'></div>
      <div class="main-echart3" ref="echartRef3" id='main3'></div>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import moment from 'moment'
import { BusinessType, ApprovalStatus } from '@/utils/field.js'
import { newExportsExcel, NumberAdd } from '@/utils/index.js'
import { getCustomerList, getDataStatistics, getBusinessStatisticsByCompanyId, loanCapitalSituation, repaymentStatistics, repaymentExpireRemind, repaymentMoneyProportion, estimateControlMoneyList } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'DemandList',
  props: {
    value: Number,
  },
  data() {
    return {
      dateType: '',
      value1: '',
      value2: '',
      options: [],
      customerList: [],
      idList: [],
      topSum: {},
      form1: {
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().endOf('month').format('YYYY-MM-DD')
      },
      form2: {
        level: 1
      },
      form3: {
        companyId: '',
        year: moment().format('YYYY'),
      },
      form4: {
        pageNum: 1,          //页码
        pageSize: 10,
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().endOf('month').format('YYYY-MM-DD')
      },
      list: [],
      total: 0,
      isActive: '1',
      BusinessType: BusinessType,
      ApprovalStatus: ApprovalStatus,
      user: {},
      pickerOptions: {
        shortcuts: [
          {
            text: '本日',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '本月',
            onClick(picker) {
              const end = moment().endOf('month').format('YYYY-MM-DD');
              const start = moment().startOf('month').format('YYYY-MM-DD');
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '上月',
            onClick(picker) {
              const end = moment().month(moment().month() - 1).endOf('month').format('YYYY-MM-DD');
              const start = moment().month(moment().month() - 1).startOf('month').format('YYYY-MM-DD');
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
      pickerOptions1: {
        shortcuts: [
          {
            text: '本日',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '本月',
            onClick(picker) {
              const end = moment().endOf('month').format('YYYY-MM-DD');
              const start = moment().startOf('month').format('YYYY-MM-DD');
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '上月',
            onClick(picker) {
              const end = moment().month(moment().month() - 1).endOf('month').format('YYYY-MM-DD');
              const start = moment().month(moment().month() - 1).startOf('month').format('YYYY-MM-DD');
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
      isClick: false,
      loading: false,
      multipleSelection: [],
      nowReceivableMoney: '',
      surplusNotInvoiced: '',
      menuList: [],
      iconList: [],
      receivableRemindData: {},
      receivableRemindList: [],
      date: moment().format('YYYY-MM-DD'),
      SeriesData: []
    }
  },
  created() {
    this.value1 = [this.form1.startDate, this.form1.endDate]
    this.value2 = [this.form4.startDate, this.form4.endDate]
    if (this.paramsSelectedListId) {
      this.idList = this.paramsSelectedListId.split(',').map(item => Number(item));
    }
    this.menuList = JSON.parse(sessionStorage.getItem("menuList"));
    this.menuList.forEach(item => {
      if (item.child) {
        item.child.forEach(item1 => {
          if (item1.child && item1.path == '/fundCenter/fundStatistics') {
            item1.child.forEach(item2 => {
              this.iconList.push(item2)
            })
          }
        })
      }
    })
    this.loanCapitalSituation()
    this.repaymentStatistics()
    this.repaymentExpireRemind()
    this.repaymentMoneyProportion()
    this.estimateControlMoneyList()
    this.user = JSON.parse(sessionStorage.getItem('user'))
  },
  mounted() {
    const myChart = echarts.init(this.$refs.echartRef)
    const myChart2 = echarts.init(this.$refs.echartRef2)
    const myChart3 = echarts.init(this.$refs.echartRef3)
    let listener = function () {
      myChart.resize()
      myChart2.resize()
      myChart3.resize()
    }
    window.addEventListener('resize', listener)
  },
  methods: {
    toLoan(id) {
      this.$router.push({ path: '/fundManagement/loan', query: { id, LoanType: 'toLoin' } })
    },
    toClick(item) {
      if (item && item.path) {
        this.$router.push({
          path: item.path
        });
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
    getCustomerList() {
      let param = {
        level: 1,
      }
      getCustomerList(param).then(res => {
        if (res.code != 200) return
        this.customerList = res.data
      })
    },
    dataChange() {
      if (this.value1) {
        this.form1.startDate = this.value1[0]
        this.form1.endDate = this.value1[1]
        this.getDataStatistics()
      }
    },
    loanCapitalSituation() {
      loanCapitalSituation().then(res => {
        this.topSum = res.data || {}
      })
    },
    repaymentStatistics() {
      repaymentStatistics().then(res => {
        if (res.code !== 200) return
        this.myChart(res.data)
      })
    },
    repaymentMoneyProportion() {
      repaymentMoneyProportion().then(res => {
        if (res.code !== 200) return
        this.myChart3(res.data)
      })
    },
    estimateControlMoneyList() {
      estimateControlMoneyList().then(res => {
        if (res.code !== 200) return
        this.myChart2(res.data)
      })
    },
    repaymentExpireRemind() {
      repaymentExpireRemind().then(res => {
        if (res.code !== 200) return
        this.list = res.data
        // this.total = res.data.total
      })
    },
    format(num) {
      if (num == 0) {
        return num;
      } else {
        return Number((num / 1e4).toFixed(2));
      }
    },
    myChart(data = {}) {
      let datalist = []
      let list = []
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('main'));
      // 绘制图表
      let list2 = []
      data && data.repaymentList.forEach(item => {
        list.push(`${item.month}月`)
      })
      data.repaymentList.forEach(item => {
        item.capitalStatisticsVoList.forEach && item.capitalStatisticsVoList.forEach(item1 => {
          list2.push(item1)
        })
      })
      let list3 = []
      let tempArr = [];
      let Data = [];
      for (let i = 0; i < list2.length; i++) {
        if (tempArr.indexOf(list2[i].backersName) === -1) {
          Data.push({
            backersName: list2[i].backersName,
            dataInfo: [list2[i]]
          });
          tempArr.push(list2[i].backersName);
        } else {
          for (let j = 0; j < Data.length; j++) {
            if (Data[j].backersName == list2[i].backersName) {
              Data[j].dataInfo.push(list2[i]);
              break;
            }
          }
        }
      }
      let varSeries = []
      var dataSubject = Data.map((item, key) => {
        var values = item.dataInfo.map((items, keys) => {
          return {
            value: items.repaymentMoney,
            // value2: items.returnReceivable
          }
        })
        var series1 = {
          name: item.backersName,
          stack: '总量',
          data: values,
          type: 'bar',
          // barMaxWidth: '100px'
        }
        this.SeriesData.push(series1)
        return item.dataInfo
      })
      myChart.setOption({
        title: {
          left: 10,
          top: 10,
          // text: '应收统计',
        },
        backgroundColor: '#fff',
        // colors: colors,
        legend: {
          type: 'scroll',
          // data: typeData,
          bottom: 10,
          textStyle: {
            color: '#2c3e50'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: list
        },
        grid: {
          // top: 100,
          left: 100
        },
        yAxis: {
          axisLabel: {
            formatter: (value, index) => {
              return this.$options.filters.toThousands(this.format(value)) + 'w'
            }
          },
        },
        series: this.SeriesData,
        tooltip: {
          //  提示的时候，就要替换null的为0
          trigger: 'axis',
          formatter: (params) => {
            var res = `${params[0].name} <br/>`
            for (const item of params) {
              if (item.value !== 0 || (item.value === 0 && item.data.value2 !== 0)) {
                res += `<span style="background: ${item.color}; height:10px; width: 10px; border-radius: 50%;display: inline-block;margin-right:10px;"></span> ${item.seriesName} ：${this.$options.filters.toThousands(Number(this.format(item.value)))}w<br/>`
              }
            }
            return res
          }
        }
      });
    },
    myChart2(data = {}) {
      let datalist = []
      let list = []
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('main2'));
      // 绘制图表
      let list2 = []
      data && data.forEach(item => {
        let month = item.month.split('-')[1].substr('0')
        item.month = month.substr(0, 1) == 0 ? month.substr(month.length - 1) : month
        list.push(`${item.month}月`)
        datalist.push(item.controlMoney)
      })
      myChart.setOption({
        title: {
          left: 20,
          top: 24,
          text: '预期可支配资金',
        },
        backgroundColor: '#fff',
        legend: {
          bottom: 10,
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: list
        },
        grid: {
          // top: 100,
          left: 100
        },
        yAxis: {
          axisLabel: {
            formatter: (value, index) => {
              return this.$options.filters.toThousands(this.format(value)) + 'w'
            }
          },
        },
        series: [
          {
            name: '预期可支配资金',
            type: 'bar',
            data: datalist,
          },
        ],
        tooltip: {
          //  提示的时候，就要替换null的为0
          trigger: 'axis',
          formatter: (params) => {
            var res = `${params[0].name} <br/>`
            for (const item of params) {
              if (item.value !== 0 || (item.value === 0 && item.data.value2 !== 0)) {
                res += `<span style="background: ${item.color}; height:10px; width: 10px; border-radius: 50%;display: inline-block;margin-right:10px;"></span> 预期可支配资金 ：${this.$options.filters.toThousands(Number(this.format(item.value)))}w<br/>`
              }
            }
            return res
          }
        }
      });
    },
    myChart3(data = {}) {
      let NameList = data.map(item => {
        return {
          value: Number(item.proportion),
          name: item.backersName
        }
      })
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('main3'));
      // 绘制图表
      myChart.setOption({
        // backgroundColor: '#fff',
        title: {
          left: 20,
          top: 24,
          text: '待还资金占比',
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          // right: 10,
          top: 'center',
          textStyle: {
            color: '#2c3e50'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            let res = `<span style="background: ${params.color}; height:10px; width: 10px; border-radius: 50%;display: inline-block;margin-right:10px;"></span> 
              ${params.name} ：${params.value}%<br/>`
            return res
          }
        },
        series: [
          {
            // name: '占比(%)',
            type: 'pie',
            radius: '50%',
            data: NameList,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: '{b} \n {d}%' //带当前图例名 + 百分比
                  // formatter: '{d}%' //只要百分比
                },
                labelLine: { show: true }
              }
            }
          },
        ]
      });
    },
  },
  computed: {
    isShowExport() {
      // 是否具有导出权限
      let user = JSON.parse(sessionStorage.getItem('user'))
      if (user && user.exportPermission == 1) {
        return true
      } else {
        return false
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.data-title {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 10px;
  padding: 14px 0 0 10px;
}
.demand-top {
  display: flex;
  margin-bottom: 20px;
  padding-top: 6px;
  .top-left-container {
    background-color: #fff;
    width: 70%;
    margin-right: 20px;
    padding: 10px;
    border-radius: 10px;
  }
  .top-right-container {
    background-color: #fff;
    padding: 10px;
    width: 30%;
    border-radius: 10px;
  }
  .data-statistics {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .data-content {
    display: flex;
    justify-content: space-between;
    padding: 0 40px;
    .data-item {
      display: flex;
      align-items: center;
      height: 100px;
      .data-item-content {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        height: 100%;
      }
      .data-item-title {
        // margin: 5px;
        color: #626468;
        opacity: 0.9;
        font-weight: 500;
        font-size: 16px;
      }
      .data-item-amount {
        // margin: 5px;
        font-weight: 700;
        font-size: 22px;
        color: #303132;
      }
    }
  }
  .common-function {
    width: 100%;
    display: flex;
    // justify-content: space-between;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    .function-item {
      cursor: pointer;
      text-align: center;
      font-weight: 700;
      width: 25%;
      flex-shrink: 0;
      img {
        width: 50px;
        height: 50px;
      }
    }
  }
}
.demand-middle {
  display: flex;
  height: 350px;

  .middle-left {
    width: 60%;
    background-color: #fff;
    margin-right: 20px;
    border-radius: 10px;
    padding: 10px;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 0 0 10px;
      .demand-tj {
        font-weight: 700;
        color: #2c3e50;
        font-size: 16px;
      }
    }
    .main-echart {
      margin: 5px;
      // width: 35%;
      height: 300px;
      border-radius: 5px;
      // box-shadow: 0px 10px 20px rgba(111, 108, 255, 0.25);
    }
  }
  .middle-right {
    background-color: #fff;
    width: 40%;
    // height: 300px;
    border-radius: 10px;
    // padding: 10px;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 0 0 20px;
      .remind {
        font-weight: 700;
      }
    }
  }
}
.demand-footer {
  margin-top: 20px;
  display: flex;
  .main-echart2 {
    border-radius: 10px;
    background-color: #fff;
    // margin: 5px 5px 0 0;
    width: 60%;
    height: 500px;
    border-radius: 5px;
    margin-right: 20px;
    overflow: hidden;
    // box-shadow: 0px 10px 20px rgba(111, 108, 255, 0.25);
  }
  .main-echart3 {
    overflow: hidden;
    border-radius: 10px;
    background-color: #fff;
    // margin: 5px;
    width: 40%;
    height: 500px;
    border-radius: 5px;
    // box-shadow: 0px 10px 20px rgba(111, 108, 255, 0.25);
  }
}
::v-deep .format-right {
  padding-right: 10px;
}
::v-deep .format-left {
  padding-left: 10px;
}
::v-deep .el-table::before {
  height: 0 !important;
  background: none !important;
}
</style>