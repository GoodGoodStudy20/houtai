<template>
  <div>
    <div class="demand-top">
      <div class="top-left-container">
        <div class="data-statistics">
          <!-- <h3>数据统计</h3> -->
          <div class="data-title">数据统计</div>
          <el-date-picker size="mini" v-model="value1" value-format="yyyy-MM-dd" @change="dataChange" type="daterange" style="width:210px" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
        </div>
        <div class="data-content">
          <div class="data-item">
            <img src="@/assets/img/业务总额.png" alt="" />
            <div class="data-item-content">
              <div class="data-item-title">业务总额</div>
              <div class="data-item-amount">{{topSum.totalAmount || 0 | toThousands}}</div>
            </div>
          </div>
          <div class="data-item">
            <img src="@/assets/img/垫资.png" alt="" />
            <div class="data-item-content">
              <div class="data-item-title">垫资</div>
              <div class="data-item-amount">{{topSum.advanceAmount || 0 | toThousands}}</div>
            </div>
          </div>
          <div class="data-item">
            <img src="@/assets/img/不垫资.png" alt="" />
            <div class="data-item-content">
              <div class="data-item-title">不垫资</div>
              <div class="data-item-amount">{{topSum.noAdvanceAmount || 0 | toThousands}}</div>
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
          <div class="demand-tj">月度统计</div>
          <!-- <h3>业务统计</h3> -->
          <div>
            <el-select size="mini" v-model="form3.companyId" @change="companyIdChange" placeholder="所有分公司" style="width:150px; margin-right:20px" filterable>
              <el-option label="所有分公司" value=""></el-option>
              <el-option v-for="item in customerList" :key="item.id" :label="item.abbreviated" :value="item.id"></el-option>
            </el-select>
            <!-- <el-cascader size="mini" :props="props" style="margin-right:20px" :show-all-levels="false" clearable filterable v-model="value2" :options="options" placeholder="请选择所属分公司/客户" @change="handleChange"></el-cascader> -->
            <el-date-picker :clearable="false" size="mini" @change="changeTime2" v-model="form3.year" style="width:100px" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
          </div>
        </div>
        <div class="main-echart" ref="echartRef" id='main'></div>
      </div>
      <div class="middle-right">
        <div class="top">
          <div class="remind">应收提醒</div>
          <!-- <h3>应收提醒</h3> -->
          <div class="tabs-container">
            <div class="tabs-item" :class="{active:isActive==1}" @click="changeActive(1)">已逾期</div>
            <div class="tabs-item" :class="{active:isActive==2}" @click="changeActive(2)">本月到期</div>
          </div>
        </div>
        <el-table stripe :data="receivableRemindList" height="275px" style="max-width: 100%;margin:15px 0;" :header-cell-style="{ 'background-color': '#F4F8FF' }">
          <el-table-column align="center" label="排序" width="50" class-name="index-class">
            <template slot-scope="{ row, $index }">
              <span :class="{'index1':$index+1==1,'index2':$index+1==2,'index3':$index+1==3}">{{$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="区域" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="table-text" @click="editDetail(scope.row)">{{
                  scope.row.abbreviated
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="totalReceivable" align="right" width="120">
            <template slot-scope="scope">
              <!-- {{scope.row.onScheduleReceivableAmount || 0 | toThousands}} -->
              <span v-if="isActive ==1">{{scope.row.beOverdueReceivableAmount || 0 | toThousands}}</span>
              <span v-if="isActive==2">{{scope.row.onScheduleReceivableAmount || 0 | toThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column label="笔数" prop="currentReceivable" align="center" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.onScheduleReceivable || '--'}}</span>
              <!-- <span v-if="isActive==2">{{scope.row.beOverdueReceivableAmount || 0 | toThousands}}</span> -->
              <!-- <span>{{scope.row.beOverdueQuantity}}</span> -->
            </template>
          </el-table-column>
          <el-table-column label="项目助理" prop="serviceChargeTotal" align="center" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.directorName}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="demand-footer">
      <div class="num-top">
        <div style="margin:0;font-size:16px;font-weight:700;">地区统计</div>
        <div class="date-box">
          <el-date-picker size="mini" v-model="value2" type="daterange" @change="changeTime" value-format="yyyy-MM-dd" style=" width:200px" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions1"></el-date-picker>
        </div>
      </div>
      <el-table stripe :data="list" show-summary :summary-method=" getSummaries" style="max-width:100%;margin:15px 0;" :header-cell-style="{ 'background-color': '#F4F8FF' }">
        <!-- <el-table-column type="index" align="center" label="排序" width="50"></el-table-column> -->
        <el-table-column label="分公司" align="left" show-overflow-tooltip min-width="160" class-name="format-left">
          <template slot-scope="scope">
            <span class="table-text" @click="handleClick(scope.row)">{{
                  scope.row.abbreviated
              }}</span>
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
      <div style="display: flex; justify-content: center">
        <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form4.pageSize" :current-page="form4.pageNum" :total="total"></el-pagination>
        <!-- <el-button v-show="isShowExport && !$attrs.disabled" style="margin-top: 10px; margin-left: 50px" size="mini" type="primary" v-debounce="exportClick" :loading="loading">导出</el-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import moment from 'moment'
import { BusinessType, ApprovalStatus } from '@/utils/field.js'
import { newExportsExcel, NumberAdd } from '@/utils/index.js'
import { getCustomerList, getDataStatistics, getBusinessStatistics, getBusinessStatisticsByCompanyId, getReceivableRemind } from '@/api/index.js'
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
          if (item1.child && item1.path == '/businessManagement/demandHome') {
            item1.child.forEach(item2 => {
              this.iconList.push(item2)
            })
          }
        })
      }
    })
    this.getReceivableRemind()
    this.getDataStatistics()
    this.getBusinessStatistics()
    this.getBusinessStatisticsByCompanyId()
    this.getCustomerList()
    this.user = JSON.parse(sessionStorage.getItem('user'))
  },
  mounted() {
    const myChart = echarts.init(this.$refs.echartRef)
    let listener = function () {
      myChart.resize()
    }
    window.addEventListener('resize', listener)
  },
  methods: {
    handleClick(row) {
      this.$router.push({ path: '/businessManagement/CustomerDeamnd', query: { companyName: row.abbreviated, companyId: row.companyId, startDate: this.form4.startDate, endDate: this.form4.endDate } })
    },
    editDetail(row) {
      const { companyId, abbreviated } = row
      this.$router.push({ path: '/fundCenter/OverdueReceivablesDetail', query: { companyId, abbreviated, isActive: this.isActive, type: 'fromRemind', date: this.date } })
    },
    changeActive(type) {
      this.isActive = type
      this.receivableRemindList = this.isActive == 1 ? this.receivableRemindData.beOverdueReceivableList : this.receivableRemindData.onScheduleReceivableList
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
    getDataStatistics() {
      getDataStatistics(this.form1).then(res => {
        this.topSum = res.data || {}
      })
    },
    getReceivableRemind() {
      getReceivableRemind().then(res => {
        this.receivableRemindData = res.data || {}
        this.receivableRemindList = this.isActive == 1 ? this.receivableRemindData.beOverdueReceivableList : this.receivableRemindData.onScheduleReceivableList
        // this.receivableRemindList = this.receivableRemindList.concat(this.receivableRemindList)
      })
    },
    getBusinessStatistics() {
      getBusinessStatistics(this.form3).then(res => {
        if (res.code !== 200) return
        this.myChart(res.data)
      })
    },
    getBusinessStatisticsByCompanyId() {
      getBusinessStatisticsByCompanyId(this.form4).then(res => {
        if (res.code !== 200) return
        this.list = res.data.records
        this.total = res.data.total
      })
    },
    companyIdChange() {
      this.getBusinessStatistics()
    },
    format(num) {
      if (num == 0) {
        return num;
      } else {
        return Number((num / 1e4).toFixed(2));
      }
    },
    myChart(data = {}) {
      let list = []
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('main'));
      // 绘制图表
      let list2 = []
      data && data.businessStatisticsList.forEach(item => {
        list.push(item.month + '月')
      })
      var advanceData = data.businessStatisticsList.map((item, key) => {
        return {
          value: item.advanceAmount,
          value2: item.advanceList,
          value3: '垫资'
        }
      })
      var noAdvanceData = data.businessStatisticsList.map((item, key) => {
        return {
          value: item.noAdvanceAmount,
          value2: item.noAdvanceList,
          value3: '不垫资'
        }
      })
      myChart.setOption({
        title: {
          show: data.businessStatisticsList.length == 0,   // 没数据才显示
          extStyle: {
            color: "grey",
            fontSize: 20
          },
          text: "暂无数据",
          left: "center",
          top: "center"
        },
        backgroundColor: '#fff',
        // colors: colors,
        legend: {
          type: 'scroll',
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
            name: '垫资',
            type: 'bar',
            barGap: 0,
            data: advanceData,
            itemStyle: {
              color: '#4996FC'
            }
          },
          {
            name: '不垫资',
            type: 'bar',
            data: noAdvanceData,
            itemStyle: {
              color: '#B9DDFC'
            }
          },
        ],
        tooltip: {
          //  提示的时候，就要替换null的为0
          trigger: 'axis',
          formatter: (params) => {
            let total = this.$options.filters.toThousands(Number(this.format(NumberAdd(params.map(item => item.value)))))
            var res = `<div>${params[0] ? params[0].name : "-"}</div> <div><span style="background: #ccc; height:10px; width: 10px; border-radius: 50%;display: inline-block;margin-right:10px;"></span>总额</div><div><div>总额: ${total}w</div>`;
            params.forEach(item => {
              if (item.value !== 0) {
                res += `<div><span style="background: ${item.color}; height:10px; width: 10px; border-radius: 50%;display: inline-block;margin-right:10px;"></span>${item.data.value3}</div><div>
                <div>${item.data.value3}总额: ${this.$options.filters.toThousands(Number(this.format(item.value)))}w</div>
                  ${item.data.value2.map((item1) => {
                  return `<div><span>${item1.abbreviated}: </span><span>${this.$options.filters.toThousands(Number(this.format(item1.amount)))}w</span></div>`
                }).join('')}
                      </div>`
              }
            })
            return res
          }
        }
      });
    },
    changeTime() {
      if (this.value2) {
        this.form4.startDate = this.value2[0]
        this.form4.endDate = this.value2[1]
        this.value2 = [this.form4.startDate, this.form4.endDate]
        this.getBusinessStatisticsByCompanyId()
      }
    },
    changeTime2() {
      this.getBusinessStatistics()
    },
    handleSizeChange(val) {
      this.form4.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.form4.pageNum = val
      this.getBusinessStatisticsByCompanyId()
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
  padding-left: 10px;
  padding-top: 14px;
}
.demand-top {
  padding-top: 6px;
  display: flex;
  margin-bottom: 20px;
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
    padding-right: 10px;
  }
  .data-content {
    display: flex;
    justify-content: space-between;
    padding: 0 30px;
    .data-item {
      display: flex;
      align-items: center;
      height: 100px;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
      .data-item-content {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        height: 100%;
      }
      .data-item-title {
        color: #626468;
        opacity: 0.9;
        font-weight: 500;
        font-size: 16px;
      }
      .data-item-amount {
        font-weight: 700;
        font-size: 22px;
        color: #303132;
      }
    }
  }
  .common-function {
    width: 100%;
    display: flex;
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
      height: 290px;
      border-radius: 5px;
    }
  }
  .middle-right {
    background-color: #fff;
    width: 40%;
    border-radius: 10px;
    // padding: 10px;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 0 0 20px;
      .tabs-container {
        display: flex;
        .tabs-item {
          margin: 0 5px;
          padding: 3px 10px;
          font-size: 14px;
          cursor: pointer;
          &.active {
            border: 1px solid #0099ff;
            border-radius: 25px;
            color: #0099ff;
          }
        }
      }
      .remind {
        font-weight: 700;
      }
    }
    .index1 {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      border-radius: 50%;
      background-color: #fa4a3e;
      color: #fff;
    }
    .index2 {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      border-radius: 50%;
      background-color: #fa4a3e;
      color: #fff;
    }
    .index3 {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      border-radius: 50%;
      background-color: #fcb000;
      color: #fff;
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
    margin-bottom: 10px;
    .date-box {
      flex: 1;
      text-align: right;
      padding: 10px 0;
    }
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