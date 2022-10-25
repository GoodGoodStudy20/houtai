<template>
  <div>
    <div class="demand-middle">
      <div class="middle-left">
        <div class="top">
          <div class="demand-tj">产品销售趋势</div>
        </div>
        <div class="main-echart" ref="echartRef" id='main'></div>
      </div>
      <div class="middle-right">
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
        <div class="bottom-right-container">
          <div class="top">
            <div class="demand-tj">服务类型数据</div>
            <el-date-picker :clearable="false" size="mini" @change="changeTime" v-model="form.date" style="width:110px" value-format="yyyy-MM" type="month" placeholder="选择月份"></el-date-picker>
          </div>
          <div class="content">
            <div class="main-echart2" ref="echartRef2" id='main2'></div>
            <div class="right-content">
              <div class="title">数据监控</div>
              <div>前置销售占比:{{serviceData.monthFrontSaleProportion}}%</div>
              <div>后置销售占比:{{serviceData.monthPostSaleProportion}}%</div>
              <div>前置销售额:{{serviceData.monthFrontSaleAmount}}</div>
              <div>后置销售额:{{serviceData.monthPostSaleAmount}}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="demand-footer">
      <div class="num-top">
        <div style="margin:0;font-size:16px;font-weight:700">产品销售数据</div>
        <div class="date-box">
          <el-date-picker size="mini" v-model="value2" type="daterange" @change="changeTime2" value-format="yyyy-MM-dd" style=" width:200px" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
        </div>
      </div>
      <div class="data">
        <div class="data-table">
          <el-table stripe :data="list" show-summary :summary-method="getSummaries" style="max-width:100%;margin:15px 0;" :header-cell-style="{ 'background-color': '#F4F8FF' }">
            <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
            <el-table-column label="产品分类名称" prop="productTypeName" align="left" show-overflow-tooltip min-width="160" class-name="format-left"></el-table-column>
            <el-table-column label="产品服务类型" prop="amount" align="right" min-width="120">
              <template slot-scope="scope">
                <span>{{scope.row.type ==0?'前置服务':scope.row.type ==1?'后置服务':'--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="销售数量" prop="saleQuantity" align="right" min-width="120">
              <template slot-scope="scope">
                <span>{{scope.row.saleQuantity || 0 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="销售额" prop="saleAmount" align="right" min-width="120">
              <template slot-scope="scope">
                <span>{{scope.row.saleAmount || 0 | toThousands}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex; justify-content: center">
            <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form1.pageSize" :current-page="form1.pageNum" :total="total"></el-pagination>
            <!-- <el-button v-show="isShowExport && !$attrs.disabled" style="margin-top: 10px; margin-left: 50px" size="mini" type="primary" v-debounce="exportClick" :loading="loading">导出</el-button> -->
          </div>
        </div>
        <div class="main-echart3" ref="echartRef3" id='main3'></div>
      </div>

    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import moment from 'moment'
import { BusinessType, ApprovalStatus } from '@/utils/field.js'
import { newExportsExcel, NumberAdd } from '@/utils/index.js'
import { monthProductSale, serviceTypeData, productSaleData, saleProportion } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'DemandList',
  props: {
    value: Number,
  },
  data() {
    return {
      value2: '',
      options: [],
      customerList: [],
      form: {
        date: moment().format('YYYY-MM'),
      },
      form1: {
        // startDate: moment().startOf('month').format('YYYY-MM-DD'),
        // endDate: moment().endOf('month').format('YYYY-MM-DD'),
        pageSize: 5,
        pageNum: 1,
      },
      form2: {
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().endOf('month').format('YYYY-MM-DD'),
      },
      list: [],
      total: 0,
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
      menuList: [],
      iconList: [],
      serviceData: {}
    }
  },
  created() {
    this.value2 = [this.form2.startDate, this.form2.endDate]
    this.menuList = JSON.parse(sessionStorage.getItem("menuList"));
    this.menuList.forEach(item => {
      if (item.child) {
        item.child.forEach(item1 => {
          if (item1.child && item1.path == '/businessManagement/productHome') {
            item1.child.forEach(item2 => {
              this.iconList.push(item2)
            })
          }
        })
      }
    })
    this.monthProductSale()
    this.serviceTypeData()
    this.productSaleData()
    this.saleProportion()
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
        if (index === 2) {
          sums[index] = '合计';
          return;
        }
        if (index === 3) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.saleQuantity || 0)))
        }
        if (index === 4) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.saleAmount || 0)))
        }
      });
      return sums;
    },
    //产品销售趋势
    monthProductSale() {
      monthProductSale().then(res => {
        if (res.code !== 200) return
        this.myChart(res.data)
      })
    },
    //服务类型数据
    serviceTypeData() {
      serviceTypeData(this.form).then(res => {
        if (res.code !== 200) return
        this.serviceData = res.data
        this.myChart2(res.data)
      })
    },
    productSaleData() {
      productSaleData(this.form1).then(res => {
        if (res.code !== 200) return
        this.list = res.data.records
        this.total = res.data.total
      })
    },

    //销售占比
    saleProportion() {
      saleProportion(this.form2).then(res => {
        if (res.code !== 200) return
        this.myChart3(res.data)
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
      let frontSaleAmount = []
      let postSaleAmount = []
      let list = []
      data.forEach(item => {
        frontSaleAmount.push(item.frontSaleAmount)
        postSaleAmount.push(item.postSaleAmount)
        list.push(`${item.month}月`)
      })
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('main'));
      // 绘制图表
      // for (let i = 1; i < 13; i++) {
      //   if (moment().isSameOrAfter(`${this.form3.date}-${i}-01`)) {
      //     list.push(`${i}月`)
      //   }
      // }
      myChart.setOption({
        legend: {
          data: ['前置服务', '后置服务'],
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
          left: 50
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
            name: '后置服务',
            type: 'line',
            min: 0,
            connectNulls: true,
            itemStyle: {
              color: '#3A7DFF'
            },
            data: postSaleAmount
          },
          {
            name: '前置服务',
            type: 'line',
            min: 0,
            connectNulls: true,
            itemStyle: {
              color: '#ffa439'
            },
            data: frontSaleAmount
          },
        ],
        tooltip: {
          //  提示的时候，就要替换null的为0
          trigger: 'axis',
          formatter: (params) => {
            var res = `${params[0].name} <br/>`
            for (const item of params) {
              res += `<span style="background: ${item.color}; height:10px; width: 10px; border-radius: 50%;display: inline-block;margin-right:10px;"></span> 
              ${item.seriesName} ：${this.$options.filters.toThousands(Number(this.format(item.value)))}w<br/>`
            }
            return res
          }
        }
      });
    },
    myChart2(data = {}) {
      let list = [
        { name: '前置服务', value: data.monthFrontSaleProportion || 0, color: '#3789FF' },
        { name: '后置服务', value: data.monthPostSaleProportion || 0, color: '#B3DDFF' },
      ]
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('main2'));
      myChart.setOption({
        legend: {
          bottom: '10px',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            let res = `<span style="background: ${params.color}; height:10px; width: 10px; border-radius: 50%;display: inline-block;margin-right:10px;"></span> 
              ${params.name} ：${params.value}%<br/>`
            return res
          }
        },
        color: ['#3789FF', '#B3DDFF'],
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            // avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
              normal: {
                label: {
                  show: true,
                  formatter: "{d}%",
                  // formatter: (params) => {
                  //   if (params.data.value == 0) {
                  //     // params.data.itemStyle.normal.labelLine.show = false;
                  //     params.data.label.normal.show = false;
                  //     params.data.labelLine.normal.show = false;
                  //   } else {
                  //     return `${params.value}%`
                  //   }
                  // },
                  position: "inner"
                }
              }
            },
            left: 'left',
            data: list
          },
        ],
      });
    },
    myChart3(data = {}) {
      let NameList = data.map(item => {
        return {
          value: Number(item.proportion),
          name: item.productTypeName
        }
      })
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('main3'));
      // 绘制图表
      myChart.setOption({
        // backgroundColor: '#fff',
        title: {
          left: 'center',
          bottom: 10,
          text: '销售占比',
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
    changeTime() {
      this.serviceTypeData()
    },
    changeTime2() {
      // this.form1.startDate = this.value2[0]
      // this.form1.endDate = this.value2[1]
      this.form2.startDate = this.value2[0]
      this.form2.endDate = this.value2[1]
      this.value2 = [this.form2.startDate, this.form2.endDate]
      this.productSaleData()
      this.saleProportion()
    },

    handleSizeChange(val) {
      this.form1.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.form1.pageNum = val
      this.productSaleData()
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
.demand-middle {
  display: flex;
  height: 500px;
  padding-top: 6px;
  .middle-left {
    width: 65%;
    background-color: #fff;
    margin-right: 20px;
    border-radius: 10px;
    padding: 10px;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .demand-tj {
        font-weight: 700;
        color: #2c3e50;
        font-size: 16px;
        padding: 14px 0 0 10px;
      }
    }
    .main-echart {
      margin: 5px;
      // width: 35%;
      height: 450px;
      border-radius: 5px;
      // box-shadow: 0px 10px 20px rgba(111, 108, 255, 0.25);
    }
  }
  .middle-right {
    width: 35%;
    // // height: 300px;
    // border-radius: 10px;
    // padding: 10px;
    .top-right-container {
      background-color: #fff;
      padding: 10px;
      border-radius: 10px;
      margin-bottom: 20px;
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
    .bottom-right-container {
      background-color: #fff;
      padding: 10px;
      border-radius: 10px;
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
      .content {
        display: flex;
        align-items: center;
        .main-echart2 {
          margin: 5px;
          // width: 50%;
          flex-grow: 1;
          flex-shrink: 1;
          height: 237px;
          border-radius: 5px;
          box-sizing: border-box;
          // box-shadow: 0px 10px 20px rgba(111, 108, 255, 0.25);
        }
        .right-content {
          // width: 50%;
          width: 190px;
          // flex-shrink: 1;
          padding: 10px 0 10px 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-sizing: border-box;
          div {
            margin: 10px 0;
            font-size: 14px;
          }
          .title {
            font-weight: 550;
            font-size: 16px;
          }
        }
      }
    }
  }
}
// ::v-deep .index-class {
//   // width: 10px;
//   // height: 10px;
//   border-radius: 50%;
//   background-color: red;
// }
.demand-footer {
  background-color: #fff;
  margin-top: 20px;
  border-radius: 10px;
  .num-top {
    height: 48px;
    display: flex;
    align-items: center;
    padding: 14px 15px 0 20px;
    // box-shadow: 0px 0.5px 0px rgba(0, 0, 0, 0.1);
    // margin-bottom: 10px;
    .date-box {
      flex: 1;
      text-align: right;
      padding: 10px 0;
    }
  }
  .data {
    display: flex;
    .data-table {
      width: 60%;
      margin-right: 20px;
    }
    .main-echart3 {
      margin: 5px;
      width: 40%;
      height: 400px;
      border-radius: 5px;
      // box-shadow: 0px 10px 20px rgba(111, 108, 255, 0.25);
    }
  }
}
::v-deep .format-right {
  padding-right: 10px;
}
::v-deep .format-left {
  padding-left: 10px;
}
</style>