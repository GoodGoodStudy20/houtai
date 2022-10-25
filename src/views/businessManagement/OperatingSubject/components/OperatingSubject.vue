<template>
  <div>
    <div class="demand-top">
      <div class="top-left-container">
        <div class="top-left">
          <div class="top">
            <div class="demand-tj">进销票情况</div>
            <div style="display:flex;align-items:center">
              <div style="display:flex;align-items:center">
                <div style="margin-right:10px;color: #606266;font-size:14px;font-weight: 500;">主体</div>
                <ChooseSubject :size="'mini'" v-model="form3.subjectId" @change="sujectChange" placeholder="全部" style="width: 120px;margin-right:20px" showAll></ChooseSubject>
              </div>
              <!-- <el-cascader size="mini" :props="props" style="margin-right:20px" :show-all-levels="false" clearable filterable v-model="value2" :options="options" placeholder="请选择所属分公司/客户" @change="handleChange"></el-cascader> -->
              <el-date-picker :clearable="false" size="mini" @change="changeTime" v-model="form3.date" style="width:100px" value-format="yyyy" type="year" placeholder="选择年份"></el-date-picker>
            </div>
          </div>
          <div class="main-echart" ref="echartRef" id='main'></div>
        </div>
      </div>
      <div class="top-right-container">
        <div class="top-right1">
          <div class="data-title">常用功能</div>
          <div class="common-function">
            <div @click="toClick(item)" class="function-item" v-for="item in iconList" :key="item.id">
              <img :src="item.customIcon" alt="" />
              <p>{{item.label}}</p>
            </div>
          </div>
        </div>
        <div class="top-right2">
          <div class="data-title">签约预警</div>
          <!-- <div class="common-function">
            <div @click="toClick(item)" class="function-item" v-for="item in iconList" :key="item.id">
              <img :src="item.customIcon" alt="" />
              <p>{{item.label}}</p>
            </div>
          </div> -->
        </div>

      </div>
    </div>
    <div class="demand-footer">
      <div class="footer-left">
        <div class="num-top">
          <div style="margin:0;font-size:16px;font-weight:700">票量预警</div>
          <div class="date-box">

            <el-radio v-model="form.type" @change="onload(0)" :label="0">按月</el-radio>
            <el-radio v-model="form.type" @change="onload(1)" :label="1">按年</el-radio>
            <el-date-picker :clearable="false" size="mini" @change="onload" style="width:110px" v-model="form.date" :value-format="form.type == 1 ? 'yyyy' : 'yyyy-MM'" :type="form.type == 1 ? 'year' : 'month'" :placeholder="form.type == 1 ? '选择年份' : '选择月份'"></el-date-picker>
          </div>
        </div>
        <el-table stripe show-summary :summary-method="getSummaries" :data="list" style="max-width: 100%;margin:15px 0;" :header-cell-style="{ 'background-color': '#F4F8FF' }">
          <el-table-column label="运营主体" align="left" show-overflow-tooltip min-width="160" class-name="format-left">
            <template slot-scope="scope">
              <span>{{
                  scope.row.subjectName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开票额度" prop="invoicingRestrictions" align="right" min-width="120">
            <template slot-scope="scope">
              <el-popover @show="showInvoicingRestrictions(scope.row, 0)" placement="top-start" width="200" trigger="hover" v-if="scope.row.invoicingRestrictions">
                <div v-for="(item, index) in specialTicket" :key="index">
                  {{ InvoiceTypeList[item.type] }}:{{ item.invoicingRestrictions || 0 | toThousands}}
                </div>
                <span slot="reference">{{ scope.row.invoicingRestrictions || 0 | toThousands}}</span>
              </el-popover>
              <span v-else>{{scope.row.invoicingRestrictions || 0 | toThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column label="已开票" prop="totalInvoicingAmount" align="right" min-width="120">
            <template slot-scope="scope">
              <el-popover @show="showInvoicingRestrictions(scope.row, 2)" placement="top-start" width="200" trigger="hover" v-if="scope.row.totalInvoicingAmount">
                <div v-for="(item, index) in specialTicket" :key="index">
                  {{ InvoiceTypeList[item.type] }}:{{ item.totalInvoicingAmount || 0 | toThousands}}
                </div>
                <span slot="reference">{{ scope.row.totalInvoicingAmount || 0 | toThousands}}</span>
              </el-popover>
              <span v-else>{{scope.row.totalInvoicingAmount || 0 | toThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column label="剩余额度" prop="surplusInvoicingAmount" align="right" min-width="120">
            <template slot-scope="scope">
              <el-popover @show="showInvoicingRestrictions(scope.row, 4)" placement="top-start" width="200" trigger="hover" v-if="scope.row.surplusInvoicingAmount">
                <div v-for="(item, index) in specialTicket" :key="index">
                  {{ InvoiceTypeList[item.type] }}:{{ item.surplusInvoicingAmount || 0 | toThousands}}
                </div>
                <span slot="reference">{{ scope.row.surplusInvoicingAmount || 0 | toThousands}}</span>
              </el-popover>
              <span v-else>{{scope.row.surplusInvoicingAmount || 0 | toThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column label="剩余份数" prop="surplusInvoicingQuantity" align="right" min-width="120" class-name="format-right">
            <template slot-scope="scope">
              <el-popover @show="showInvoicingRestrictions(scope.row, 5)" placement="top-start" width="200" trigger="hover">
                <div v-for="(item, index) in specialTicket" :key="index">
                  {{ InvoiceTypeList[item.type] }}:{{ item.surplusInvoicingQuantity || 0 | toThousands}}
                </div>
                <span slot="reference">{{ scope.row.surplusInvoicingQuantity || 0 | toThousands}}</span>
              </el-popover>
              <!-- <span>{{scope.row.surplusInvoicingQuantity || 0 | toThousands}}</span> -->
            </template>
          </el-table-column>
        </el-table>
        <div style="display: flex; justify-content: center;margin-bottom:10px">
          <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total"></el-pagination>
          <el-button v-show="isShowExport" style="margin-top:10px;margin-left:20px" size="mini" type="primary" v-debounce="exportClick" :loading="loading">导出
          </el-button>
        </div>
      </div>
      <div class="footer-right">
        <div class="num-top">
          <div style="margin:0;font-size:16px;font-weight:700">各类主体签约情况</div>
          <div class="tabs-container">
            <div class="tabs-item" :class="{active:isActive==0}" @click="changeActive(0)">一类</div>
            <div class="tabs-item" :class="{active:isActive==1}" @click="changeActive(1)">二类</div>
            <div class="tabs-item" :class="{active:isActive==2}" @click="changeActive(2)">三类</div>
          </div>
        </div>
        <el-table stripe :data="list2" style="max-width: 100%;margin:15px 0;" :header-cell-style="{ 'background-color': '#F4F8FF' }">
          <!-- <el-table-column type="index" align="center" label="排序" width="50"></el-table-column> -->
          <el-table-column :label="isActive==0?'一类主体':isActive==1?'二类主体':'三类主体'" align="left" show-overflow-tooltip width="100" class-name="format-left">
            <template slot-scope="scope">
              <span>{{
                  scope.row.subjectName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属省级" prop="provinceName" align="left" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.provinceName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="纳税类型" align="left" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.type==0?'一般纳税人':'小规模' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="签约客户" align="center" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.signedQuantity || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="已签约地区" align="left" show-overflow-tooltip min-width="120" class-name="format-right">
            <template slot-scope="scope">
              <span>{{scope.row.signedRegionName || '--' }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div style="display: flex; justify-content: center">
          <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange2" @current-change="handleCurrentChange2" background :page-size="form2.pageSize" :current-page="form2.pageNum" :total="total2"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import moment from 'moment'
import { newExportsExcel, NumberAdd } from '@/utils/index.js'
import ChooseSubject from "@/components/ChooseSubject/index.vue";
import { enterSaleTicketStatistics, getInvoiceStatisticsPage, getSubjectSignedStatistics } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'OperatingSubject',
  props: {
    value: Number,
  },
  components: { ChooseSubject },
  data() {
    return {
      form2: {
        level: 0,
        pageNum: 1,          //页码
        pageSize: 10,
      },
      form3: {
        subjectId: '',
        date: moment().format('YYYY'),
      },
      form: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
        type: 0,
        date: moment().format('YYYY-MM')
      },
      list: [],
      list2: [],
      total: 0,
      total2: 0,
      isActive: '0',
      user: {},
      loading: false,
      menuList: [],
      iconList: [],
      date: moment().format('YYYY-MM-DD'),
      invoiceStatistics: {},
      specialTicket: [],
      InvoiceTypeList: ['专票', '普票', '普票(电子)', '专票(电子)'],
    }
  },
  created() {
    this.menuList = JSON.parse(sessionStorage.getItem("menuList"));
    this.menuList.forEach(item => {
      if (item.child) {
        item.child.forEach(item1 => {
          if (item1.child && item1.path == '/businessManagement/OperatingSubject') {
            item1.child.forEach(item2 => {
              this.iconList.push(item2)
            })
          }
        })
      }
    })
    this.getInvoiceStatisticsPage()
    this.getSubjectSignedStatistics()
    this.enterSaleTicketStatistics()
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
    exportClick() {
      this.loading = true
      let param = { date: this.form.date, type: this.form.type }
      // exportCommon("/cii-system/invoiceApproval/exportInvoiceStatisticsExcel", param);
      var myDate = new Date();
      var Time1 = myDate.toLocaleDateString()//yyyy/MM/dd 这个方法如果是1月份，会显示yyyy/M/dd，默认把前面的0省略掉，有点坑，别的情况没尝试
      var Time2 = myDate.toISOString().slice(0, 10)//推荐 yyyy-MM-dd
      newExportsExcel('/cii-system/subjectStatistics/exportInvoiceStatisticsExcel', param).then(res => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        let url = URL.createObjectURL(blob);
        const link = document.createElement('a'); //创建a标签
        link.href = url;
        link.download = `主体票量列表-${Time2}`; //重命名文件
        link.click();
        URL.revokeObjectURL(url);
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    showInvoicingRestrictions(row, type) {
      this.specialTicket = row.invoiceStatisticsInfoVoList.filter(item => item.dateType == type)
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
          sums[index] = this.$options.filters.toThousands(this.invoiceStatistics.invoicingRestrictions || 0)
        }
        if (index === 2) {
          sums[index] = this.$options.filters.toThousands(this.invoiceStatistics.totalInvoicingAmount || 0)
        }
        if (index === 3) {
          sums[index] = this.$options.filters.toThousands(this.invoiceStatistics.surplusInvoicingAmount || 0)
        }
        if (index === 4) {
          sums[index] = this.$options.filters.toThousands(this.invoiceStatistics.surplusInvoicingQuantity || 0)
        }
      });
      return sums;
    },
    onload() {
      this.getInvoiceStatisticsPage()
    },
    changeActive(type) {
      this.isActive = type
      this.form2.level = type
      this.getSubjectSignedStatistics()
    },
    toClick(item) {

      if (item && item.path) {
        this.$router.push({
          path: item.path
        });
      }
      // let path = type == 'demand' ? '/businessManagement/demand' : type == 'invoice' ? '/businessManagement/invoice' : type == 'collection' ? '/businessManagement/collection' : ''
      // let isToDemand = true
      // this.menuList.forEach((item) => {
      //   if (item.path == path) {
      //     this.$router.push({
      //       path
      //     });
      //     isToDemand = false
      //   }
      //   if (item.child && item.child.length > 0) {
      //     item.child.forEach((item1) => {
      //       if (item1.path == path) {
      //         this.$router.push({
      //           path
      //         });
      //         isToDemand = false
      //       }
      //     });
      //   }
      // });
      // if (isToDemand) {
      //   this.$message.error('您暂无此权限，请您联系管理员添加权限！')
      // }
    },
    enterSaleTicketStatistics() {
      enterSaleTicketStatistics(this.form3).then(res => {
        if (res.code !== 200) return
        this.myChart(res.data)
      })
    },
    getInvoiceStatisticsPage() {
      let params = {
        ...this.form,
        date: this.form.type == 1 ? this.form.date.slice(0, 4) : this.form.date,
      }
      getInvoiceStatisticsPage(params).then(res => {
        if (res.code !== 200) return
        this.list = res.data.invoiceStatisticsPage.records
        this.invoiceStatistics = res.data.invoiceStatistics
        this.total = res.data.invoiceStatisticsPage.total
      })
    },
    getSubjectSignedStatistics() {
      getSubjectSignedStatistics(this.form2).then(res => {
        if (res.code !== 200) return
        this.list2 = res.data.records
        // this.invoiceStatistics = res.data.invoiceStatistics
        this.total2 = res.data.total
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
      let incomeAmount = []
      let writeOffAmount = []
      let list = []
      data.forEach(item => {
        incomeAmount.push(item.incomeAmount)
        writeOffAmount.push(item.writeOffAmount)
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
        title: {
          text: `${this.form3.date}年进销票情况`
        },
        legend: {
          data: ['销项', '进项'],
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
            name: '销项',
            type: 'line',
            min: 0,
            connectNulls: true,
            itemStyle: {
              color: '#3A7DFF'
            },
            data: writeOffAmount
          },
          {
            name: '进项',
            type: 'line',
            min: 0,
            connectNulls: true,
            itemStyle: {
              color: '#ffa439'
            },
            data: incomeAmount
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
    changeTime() {
      this.enterSaleTicketStatistics()
    },
    sujectChange() {
      this.enterSaleTicketStatistics()
    },
    handleSizeChange(val) {
      this.form.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.form.pageNum = val
      this.getInvoiceStatisticsPage()
    },
    handleSizeChange2(val) {
      this.form2.pageSize = val
      this.handleCurrentChange2(1)
    },
    handleCurrentChange2(val) {
      this.form2.pageNum = val
      this.getSubjectSignedStatistics()
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
  margin: 10px 0 20px;
  padding-top: 4px;
  padding-left: 10px;
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
    .top-left {
      background-color: #fff;
      margin-right: 20px;
      border-radius: 10px;
      // padding: 10px;
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
  }
  .top-right-container {
    width: 30%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .top-right1 {
      padding: 10px;
      border-radius: 10px;
      background-color: #fff;
      margin-bottom: 20px;
    }
    .top-right2 {
      flex: 1;
      padding: 10px;
      border-radius: 10px;
      background-color: #fff;
    }
  }
  .data-statistics {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .data-content {
    display: flex;
    justify-content: space-between;
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
    // justify-content: space-around;
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

.demand-footer {
  margin-top: 20px;

  display: flex;
  justify-content: space-between;
  .footer-left {
    width: 50%;
    background-color: #fff;
    border-radius: 10px;
    margin-right: 20px;
  }
  .footer-right {
    background-color: #fff;
    border-radius: 10px;
    width: 48%;
  }
  .num-top {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // padding: 0 15px;
    padding: 14px 15px 0 20px;
    // box-shadow: 0px 0.5px 0px rgba(0, 0, 0, 0.1);
    // margin-bottom: 10px;
    .date-box {
      flex: 1;
      text-align: right;
      padding: 10px 0;
    }
    .tabs-container {
      display: flex;
      .tabs-item {
        margin: 0 5px;
        padding: 3px 10px;
        font-size: 14px;
        cursor: pointer;
        &.active {
          border: 1px solid #0099ff;
          border-radius: 15px;
          color: #0099ff;
        }
      }
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