<template>
  <div>
    <div>
      <div>
        <div class="main-container">
          <div class="main-echart2" ref="echartRef" id='main2'></div>
          <div class="main-echart" ref="echartRef2" id='main'></div>
        </div>
      </div>
      <div style="background-color: #fff;">
        <div class="receivable-box">
          <div class="receivable-detail">应收明细</div>
          <div class="right-container">
            <div class="right-time">
              <div style="margin-right:20px;font-weight:700">统计时间</div>
              <el-date-picker :clearable="false" size="small" @change="changeTime" v-model="date" style="width:150px" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
            </div>
            <div>
              <el-button class="export-detail" icon="el-icon-download" v-if="isShowExport" @click="exportClick" :loading="loading" size="mini">导出明细</el-button>
            </div>
          </div>
        </div>
        <el-table stripe :data="list" show-summary :summary-method="getSummaries" style="max-width: 100%;margin:15px 0;" :header-cell-style="{ 'background-color': '#F4F8FF' }">
          <!-- <el-table-column type="index" align="center" label="序号" width="50"></el-table-column> -->
          <el-table-column label="所属分公司" min-width="160" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <!-- <el-tooltip effect="dark" :content="scope.row.customerName" placement="bottom"> -->
              <span class="table-text" @click="editDetail(scope.row.customerId, scope.row.customerName)">{{
                  scope.row.customerName
              }}</span>
              <!-- </el-tooltip> -->
            </template>
          </el-table-column>
          <el-table-column label="应收总额" prop="totalReceivable" align="right" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.totalReceivable || 0 | toThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column label="当期应收" prop="currentReceivable" align="right" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.currentReceivable || 0 | toThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column label="应收笔数" prop="receivableQuantity" align="center" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.receivableQuantity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="按期应收" prop="onScheduleReceivable" align="right" width="120">
            <template slot-scope="scope">
              <span class="table-text" @click="toReceivablesScheduleDetail(scope.row.customerId,scope.row.customerName,scope.row.onScheduleReceivable)">{{scope.row.onScheduleReceivable || 0 | toThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column label="逾期应收" prop="beOverdueReceivable" align="right" width="120">
            <template slot-scope="scope">
              <span class="table-text" @click="toOverdueReceivablesDetail(scope.row.customerId,scope.row.customerName,scope.row.beOverdueReceivable)">{{scope.row.beOverdueReceivable || 0 | toThousands}}</span>
            </template>
          </el-table-column>

          <el-table-column label="当月回款" align="center">
            <el-table-column label="逾期回款" prop="beOverdueReturnMoney" align="right" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.beOverdueReturnMoney || 0 | toThousands}}</span>
              </template>
            </el-table-column>
            <el-table-column label="笔数" prop="beOverdueQuantity" align="center" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.beOverdueQuantity }}</span>
              </template>
            </el-table-column>
            <el-table-column label="按期回款" prop="onScheduleReturnMoney" align="right" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.onScheduleReturnMoney || 0 | toThousands}}</span>
              </template>
            </el-table-column>
            <el-table-column label="笔数" prop="onScheduleQuantity" align="center" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.onScheduleQuantity }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="当期剩余应收" prop="currentSurplusReceivable" align="right" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.currentSurplusReceivable || 0 | toThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column label="剩余总应收" prop="totalSurplusReceivable" align="right" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.totalSurplusReceivable || 0 | toThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column label="应收执行率" prop="receivableRate" align="right" width="120">
            <template slot-scope="scope">
              <span class="table-text" @click="toExecutionRateDetail(scope.row.customerId,scope.row.customerName,scope.row.receivableRate)">{{scope.row.receivableRate || 0 | toThousands}}<span>%</span></span>
            </template>
          </el-table-column>
          <el-table-column label="项目负责人" prop="generalDirectorName" align="center" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.generalDirectorName || '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="项目助理" prop="serviceChargeTotal" align="center" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.directorName}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- <ReceivableInfo v-if="isShowOriInfo"></ReceivableInfo> -->
  </div>
</template>

<script>
import * as echarts from 'echarts';
import moment from 'moment'
import { getReceivableStatistics, getBeOverdueStatistics, getReceivableDetailed } from '@/api/index.js'
import { exportCommon, newExportsExcel, NumberAdd } from '@/utils/index.js'
export default {
  name: 'ReceivableList',
  props: ['value'],
  data() {
    return {
      form: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
      },
      date: moment().format('YYYY-MM-DD'),
      list: [
        // { id: 10, abbreviated: '福建' }
      ],
      totalAmount: 0,
      loading: false,
      customerNameSet: [],
      SeriesData: [],
      ReceivableList: []
    }
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
  created() {
    this.getList()
    this.getReceivableDetailed()
  },
  mounted() {
    const myChart = echarts.init(this.$refs.echartRef)
    const myChart2 = echarts.init(this.$refs.echartRef2)
    let listener = function () {
      myChart.resize()
      myChart2.resize()
    }
    window.addEventListener('resize', listener)
  },
  methods: {
    getSummaries(param) {
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 1) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.totalReceivable)));
        }
        if (index === 2) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.currentReceivable)));
        }
        if (index === 3) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.receivableQuantity)));
        }
        if (index === 4) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.onScheduleReceivable)));
        }
        if (index === 5) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.beOverdueReceivable)));
        }
        if (index === 6) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.beOverdueReturnMoney)));
        }
        if (index === 7) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.beOverdueQuantity)));
        }
        if (index === 8) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.onScheduleReturnMoney)));
        }
        if (index === 9) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.onScheduleQuantity)));
        }
        if (index === 10) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.currentSurplusReceivable)));
        }
        if (index === 11) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.totalSurplusReceivable)));
        }
      });
      return sums;
    },
    changeTime() {
      this.getReceivableDetailed()
    },
    format(num) {
      if (num == 0) {
        return num;
      } else {
        return Number((num / 1e4).toFixed(2));
      }
    },
    myChart(data = {}) {
      // data.map(item => {
      //   item.value = item.amount
      //   item.name = item.typeName
      // })

      let NameList = data.map(item => {
        return {
          value: Number(item.percent),
          name: item.abbreviated
        }
      })
      // let totalAmount1 = this.$options.filters.toThousands(NumberAdd(data.map(item => item.surplusReceivable)))
      let totalAmount = this.$options.filters.toThousands(Number(this.format(NumberAdd(data.map(item => item.surplusReceivable)))))
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('main'));
      // 绘制图表
      myChart.setOption({
        backgroundColor: '#fff',
        title: {
          left: 10,
          top: 10,
          text: '逾期金额',
          subtext: `总额：￥${totalAmount} 万`,
          subtextStyle: {
            color: '#2c3e50',
            fontWeight: 700,
            fontSize: 14
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
        legend: {
          // orient: 'vertical',
          // left: 'right',
          bottom: 10,
          textStyle: {
            color: '#2c3e50'
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
    myChart2(data = {}) {
      let datalist = []
      let list = []
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('main2'));
      // 绘制图表
      let list2 = []
      data && data.monthStatisticList.forEach(item => {
        list.push(item.arrivalDate)
      })
      data.monthStatisticList.forEach(item => {
        item.receivableStatisticsVoList.forEach && item.receivableStatisticsVoList.forEach(item1 => {
          list2.push(item1)
        })
      })
      let list3 = []
      let tempArr = [];
      let Data = [];
      for (let i = 0; i < list2.length; i++) {
        if (tempArr.indexOf(list2[i].abbreviated) === -1) {
          Data.push({
            abbreviated: list2[i].abbreviated,
            dataInfo: [list2[i]]
          });
          tempArr.push(list2[i].abbreviated);
        } else {
          for (let j = 0; j < Data.length; j++) {
            if (Data[j].abbreviated == list2[i].abbreviated) {
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
            value: items.surplusReceivable,
            value2: items.returnReceivable
          }
        })
        var series1 = {
          name: item.abbreviated,
          stack: '总量',
          data: values,
          type: 'bar',
        }
        this.SeriesData.push(series1)
        return item.dataInfo
      })
      var colors = ['#4C98FB', '#83CCE7', '#26C7C8', '#73DEBD'];

      let totalAmount = this.$options.filters.toThousands(Number(this.format(this.totalAmount)))
      myChart.setOption({
        title: {
          left: 10,
          top: 10,
          text: '应收统计',
          subtext: `总额：￥${totalAmount} 万`,
          subtextStyle: {
            color: '#2c3e50',
            fontWeight: 700,
            fontSize: 14
          }
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
          top: 100,
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
                // res += `<span style="background: ${item.color}; height:10px; width: 10px; border-radius: 50%;display: inline-block;margin-right:10px;"></span> ${item.seriesName} ：${item.value}<br/>`
              }
            }
            return res
          }
        }
      });
    },
    getList() {
      getReceivableStatistics().then(res => {
        if (res.code != 200) return
        this.customerNameSet = res.data.customerNameSet
        this.totalAmount = res.data.totalAmount
        this.myChart2(res.data)
      })
      getBeOverdueStatistics().then(res => {
        if (res.code != 200) return
        this.myChart(res.data)
      })
    },
    getReceivableDetailed() {
      getReceivableDetailed({ estimateArrivalDate: this.date }).then(res => {
        if (res.code != 200) return
        this.list = res.data
      })
    },
    editDetail(customerId, customerName) {
      let a = [
        {
          companyId: customerId,
          name: customerName,
          routerLevel: 1,
          path: '/fundCenter/receivable',
          date: this.date
        }
      ]
      this.$router.push({ path: '/fundCenter/ReceivableInfo', query: { companyId: customerId, date: this.date } })
      sessionStorage.setItem('path1', JSON.stringify(a))
    },
    toReceivablesScheduleDetail(customerId, customerName, onScheduleReceivable) {
      let a = [
        {
          companyId: customerId,
          name: customerName,
          routerLevel: 1,
          path: '/fundCenter/receivable',
          date: this.date
        }
      ]
      if (onScheduleReceivable) {
        this.$router.push({ path: '/fundCenter/ReceivablesScheduleDetail', query: { companyId: customerId, date: this.date } })
        sessionStorage.setItem('path2', JSON.stringify(a))
      } else {
        this.$message.error('当前暂无按期应收数据')
      }
    },
    toOverdueReceivablesDetail(customerId, customerName, beOverdueReceivable) {
      let a = [
        {
          companyId: customerId,
          name: customerName,
          routerLevel: 1,
          path: '/fundCenter/receivable',
          date: this.date
        }
      ]
      if (beOverdueReceivable) {
        this.$router.push({ path: '/fundCenter/OverdueReceivablesDetail', query: { companyId: customerId, date: this.date } })
        sessionStorage.setItem('path3', JSON.stringify(a))
      } else {
        this.$message.error('当前暂无逾期应收数据')
      }
    },
    toExecutionRateDetail(customerId, customerName, receivableRate) {
      let a = [
        {
          companyId: customerId,
          name: customerName,
          routerLevel: 1,
          path: '/fundCenter/receivable',
          date: this.date
        }
      ]
      if (receivableRate) {
        this.$router.push({ path: '/fundCenter/ExecutionRateDetail', query: { companyId: customerId, date: this.date } })
        sessionStorage.setItem('path4', JSON.stringify(a))
      } else {
        this.$message.error('当前暂无应收执行率数据')
      }
    },
    exportClick() {
      this.loading = true
      let param = {
        estimateArrivalDate: this.date
      }
      var myDate = new Date();
      var Time1 = myDate.toLocaleDateString()//yyyy/MM/dd 这个方法如果是1月份，会显示yyyy/M/dd，默认把前面的0省略掉，有点坑，别的情况没尝试
      var Time2 = myDate.toISOString().slice(0, 10)//推荐 yyyy-MM-dd
      newExportsExcel('/cii-system/receivable/exportReceivableInfoListExcel', param).then(res => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        let url = URL.createObjectURL(blob);
        const link = document.createElement('a'); //创建a标签
        link.href = url;
        link.download = `应收明细分公司列表-${Time2}`; //重命名文件
        link.click();
        URL.revokeObjectURL(url);
        this.loading = false
        // console.log("下载文件" + res);
      }).catch(err => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-container {
  display: flex;
}
.main-echart2 {
  margin: 5px 5px 0 0;
  width: 65%;
  height: 500px;
  border-radius: 5px;
  // box-shadow: 0px 10px 20px rgba(111, 108, 255, 0.25);
}
.main-echart {
  margin: 5px;
  width: 35%;
  height: 500px;
  border-radius: 5px;
  // box-shadow: 0px 10px 20px rgba(111, 108, 255, 0.25);
}
.receivable-detail {
  font-weight: 700;
  margin: 20px 0;
  padding-left: 10px;
}
.receivable-box {
  margin: 5px 0;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
}
.right-container {
  display: flex;
  align-items: center;
  .export-detail {
    color: #0099ff;
    border-color: #0099ff;
  }
}
.right-time {
  display: flex;
  align-items: center;
  margin-right: 15px;
}
::v-deep .el-table__footer-wrapper .el-table__footer tbody tr {
  font-weight: 700;
  background-color: #f4f8ff !important;
}
::v-deep .el-table__footer-wrapper tbody td.el-table__cell {
  background-color: #f4f8ff !important;
}
</style>