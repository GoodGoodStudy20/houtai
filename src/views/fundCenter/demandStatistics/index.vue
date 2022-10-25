<template>
  <div style="width:100%" class="spacel-box">
    <div style="margin:10px 0">
      <span class="customer">客户</span>
      <ChooseCustomer v-model="form.customerId" showAll style="width:200px" @change="customerChange"></ChooseCustomer>

      <span class="customer" style="margin-left:30px">渠道</span>
      <el-select v-model="form.channelId" placeholder="请选择" style="width:200px" @change="onload">
        <el-option label="全部" value=""></el-option>
        <el-option v-for="item in ChannelType" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
    <div class="num-box">
      <div class="num-top">
        <h3 style="margin:0;font-size:16px">需求金额</h3>
        <div class="date-box">
          <el-date-picker @change="changeTime" v-model="form.startDate" size="mini" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:140px"></el-date-picker>
          至
          <el-date-picker @change="changeTime" v-model="form.endDate" size="mini" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:140px"></el-date-picker>
          <span class="link" :class="dateType=='today'?'active':''" style="margin:0 10px" @click="changeTime('today')">今日</span>
          <span class="link" :class="dateType=='month'?'active':''" @click="changeTime('month')">本月</span>
          <span class="link" :class="dateType=='quarter'?'active':''" style="margin:0 10px" @click="changeTime('quarter')">本季</span>
          <span class="link" :class="dateType=='year'?'active':''" @click="changeTime('year')">本年</span>
        </div>
      </div>
      <div class="top-box">
        <div class="child">
          <img src="@/assets/img/总额.png" alt="">
          <div>
            <p>总额</p>
            <p>{{topSum.totalAmount || 0 | toThousands}}</p>
          </div>
        </div>
        <div class="child">
          <img src="@/assets/img/垫资.png" alt="">
          <div>
            <p>垫资</p>
            <p>{{topSum.advanceAmount || 0| toThousands}}</p>
          </div>
        </div>
        <div class="child">
          <img src="@/assets/img/不垫资.png" alt="">
          <div>
            <p>不垫资</p>
            <p>{{topSum.noAdvanceAmount || 0 | toThousands}}</p>
          </div>
        </div>
        <div class="child">
          <img src="@/assets/img/常规.png" alt="">
          <div>
            <p>常规</p>
            <p>{{topSum.routineAmount || 0 | toThousands}}</p>
          </div>
        </div>
        <div class="child">
          <img src="@/assets/img/积分.png" alt="">
          <div>
            <p>积分</p>
            <p>{{topSum.integralAmount || 0 | toThousands}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="charts-box">
      <div class="main">
        <el-date-picker @change="getLeft" v-model="year1" type="year" value-format="yyyy" placeholder="选择年" size="mini" class="time-box"></el-date-picker>
        <div id='main'>
        </div>
      </div>
      <div class="main2">
        <el-date-picker @change="getRight" v-model="year2" type="year" value-format="yyyy" placeholder="选择年" size="mini" class="time-box"></el-date-picker>
        <div id='main2'>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import * as echarts from 'echarts';
import ChooseCustomer from '@/components/ChooseCustomer/index'
import { demandMonthComparison, demandStatistics, demandYearProportion } from '@/api/index.js'
export default {
  name: 'demandStatistics',
  components: { ChooseCustomer },
  data() {
    return {
      showType: 0,
      editType: '',
      editId: '',
      customerName: '',
      topSum: {},
      form: {
        channelId: '',
        customerId: '',
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().endOf('month').format('YYYY-MM-DD')
      },
      ChannelType: [],
      dateType: 'month',
      year1: moment().format('YYYY'),
      year2: moment().format('YYYY'),
    }
  },
  mounted() {
    this.onload()
  },
  filters: {
    toThousands(num = 0) {
      num = Number(num)
      let c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
      return c
    }
  },
  methods: {
    onload() {
      this.getTop()
      this.getLeft()
      this.getRight()
    },
    getTop() {
      demandStatistics(this.form).then(res => {
        this.topSum = res.data || {}
      })
    },
    getLeft() {
      demandMonthComparison({ year: this.year1, customerId: this.form.customerId, channelId: this.form.channelId }).then(res => {
        this.myChart1(res.data || {})
      })
    },
    getRight() {
      demandYearProportion({ year: this.year2, customerId: this.form.customerId, channelId: this.form.channelId }).then(res => {
        this.myChart2(res.data || {})
      })
    },
    changeTime(type = '') {
      this.dateType = type
      if (type == 'today') {
        this.form.startDate = moment().format('YYYY-MM-DD')
        this.form.endDate = moment().format('YYYY-MM-DD')
      } else if (type == 'month') {
        this.form.startDate = moment().startOf('month').format('YYYY-MM-DD')
        this.form.endDate = moment().endOf('month').format('YYYY-MM-DD')
      } else if (type == 'quarter') {
        this.form.startDate = moment().startOf('quarter').format('YYYY-MM-DD')
        this.form.endDate = moment().endOf('quarter').format('YYYY-MM-DD')
      } else if (type == 'year') {
        this.form.startDate = moment().startOf('year').format('YYYY-MM-DD')
        this.form.endDate = moment().endOf('year').format('YYYY-MM-DD')
      }
      this.getTop()
    },
    customerChange(item) {
      this.ChannelType = item.customerChannelVoList
      this.form.channelId = ''
      this.onload()
    },
    myChart1(data = {}) {
      for (let i in data) {
        if (data[i] && data[i].length) {
          data[i] = data[i].map(item => item.amount || 0)
        }
      }
      let { totalAmountList, advanceAmountList, noAdvanceAmountList, routineAmountList, integralAmountList } = data
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('main'));
      // 绘制图表
      let list = []
      for (let i = 1; i < 13; i++) {
        if (moment().isSameOrAfter(`${this.year1}-${i}-01`)) {
          list.push(`${i}月`)
        }
      }
      myChart.setOption({
        title: {
          text: `${this.year1}年月度对比`
        },
        legend: {
          data: ['总额', '垫资', '不垫资', '常规', '积分'],
          bottom: 10
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: list
        },
        yAxis: {},
        series: [
          {
            name: '总额',
            type: 'line',
            itemStyle: {
              color: '#3A7DFF'
            },
            data: totalAmountList
          },
          {
            name: '垫资',
            type: 'line',
            itemStyle: {
              color: '#ffa439'
            },
            data: advanceAmountList
          },
          {
            name: '不垫资',
            type: 'line',
            itemStyle: {
              color: '#865bff'
            },
            data: noAdvanceAmountList
          },
          {
            name: '常规',
            type: 'line',
            itemStyle: {
              color: '#f14f44'
            },
            data: routineAmountList
          },
          {
            name: '积分',
            type: 'line',
            itemStyle: {
              color: '#20C997'
            },
            data: integralAmountList
          },
        ]
      });
    },
    myChart2(data = {}) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('main2'));
      let { totalAmount, advanceAmount, noAdvanceAmount, routineAmount, integralAmount } = data
      // 绘制图表
      myChart.setOption({
        title: {
          text: `${this.year2}年占比（%）`
        },
        tooltip: {},
        xAxis: {
          data: ['垫资', '不垫资', '常规', '积分']
        },
        yAxis: {},
        series: [
          {
            name: '占比(%)',
            type: 'bar',
            data: [
              {
                value: advanceAmount,
                itemStyle: {
                  color: '#ffa439'
                }
              },
              {
                value: noAdvanceAmount,
                itemStyle: {
                  color: '#865bff'
                }
              },
              {
                value: routineAmount,
                itemStyle: {
                  color: '#f14f44'
                }
              },
              {
                value: integralAmount,
                itemStyle: {
                  color: '#20C997'
                }
              },
            ]
          },
        ]
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.customer {
  font-weight: bold;
  font-size: 16px;
  color: #333333;
  margin-right: 10px;
}
.num-box {
  background: #fff;
  box-sizing: border-box;
  border-radius: 8px;
  padding-bottom: 15px;
  margin-bottom: 20px;
  .num-top {
    height: 48px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    box-shadow: 0px 0.5px 0px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    .link {
      font-size: 15px;
      height: 20px;
      display: inline-block;
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
  .date-box {
    flex: 1;
    text-align: right;
    padding: 10px 0;
  }
  .top-box {
    // background: red;
    display: flex;
    justify-content: space-between;
    // color: #fff;
    .child {
      flex: 1;
      height: 122px;
      margin-right: 20px;
      display: flex;
      align-items: center;
      border-radius: 10px;
      background: #fff;
      filter: drop-shadow(0px 7px 14px rgba(58, 125, 255, 0.1));
      img {
        width: 52px;
        height: 52px;
        margin: 0 16px;
      }
      p:nth-child(1) {
        font-weight: normal;
        font-size: 16px;
        color: #5a5881;
        margin: 0;
      }
      p:nth-child(2) {
        font-weight: bold;
        font-size: 23px;
        margin: 6px 0 0 0;
        color: #15134b;
      }
    }
    .child:hover {
      box-shadow: 0px 10px 20px rgba(111, 108, 255, 0.25);
      transition: all 0.5s;
    }
    // .child:nth-child(1) {
    //   background: #3A7DFF;
    // }
    // .child:nth-child(2) {
    //   background: #ffa439;
    // }
    // .child:nth-child(3) {
    //   background: #865bff;
    // }
    // .child:nth-child(4) {
    //   background: #f14f44;
    // }
    .child:nth-child(5) {
      // background: #20C997;
      margin-right: 0;
    }
  }
}
.charts-box {
  margin-top: 20px;
  height: 50vh;
  display: flex;
  justify-content: space-between;
  width: 100%;
  div {
    background: #fff;
    // padding: 10px;
    border-radius: 10px;
  }
  .time-box {
    position: absolute;
    right: 10px;
    z-index: 99999;
    width: 100px;
  }
  .main {
    padding: 10px;
    width: 59%;
    height: 100%;
    position: relative;
    box-shadow: 0px 10px 20px rgba(111, 108, 255, 0.25);
  }
  .main2 {
    padding: 10px;
    margin-left: 20px;
    flex: 1;
    height: 100%;
    position: relative;
    box-shadow: 0px 10px 20px rgba(111, 108, 255, 0.25);
  }
  #main {
    width: 100%;
    height: 100%;
  }
  #main2 {
    width: 100%;
    height: 100%;
  }
}
</style>