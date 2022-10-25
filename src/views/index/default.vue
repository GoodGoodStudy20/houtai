<template>
  <div class="home-box">
    <div class="top-box">
      <div class="child">
        <img src="@/assets/img/本月需求2.png" alt="" />
        <div class="content">
          <div class="child-title">
            <div class="after">
              <div>本月委托</div>
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">本月委托：指本月业务申请中,已</br>审批完成的业务委托经营所得金额。</div>
                <img class="field-interpretation" src="@/assets/img/字段解释.png" alt="" />
              </el-tooltip>
            </div>
            <div class="month-ratio">
              <span>环比上月</span>
              <svg width="20" v-if="monthEntrust.increaseProportion>0" style="margin:0 8px" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.1666 5L11.2499 12.9167L7.08325 8.75L0.833252 15" stroke="#20C997" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M14.1667 5H19.1667V10" stroke="#20C997" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg style="margin:0 8px" v-if="monthEntrust.increaseProportion<0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.1666 15L11.2499 7.08333L7.08325 11.25L0.833252 5" stroke="#FA4A3E" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M14.1667 15H19.1667V10" stroke="#FA4A3E" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <!-- .slice(1) -->
              <span class="ratio-count">{{monthEntrust.increaseProportion<0?String(monthEntrust.increaseProportion).slice(1):monthEntrust.increaseProportion}}%</span>
            </div>
          </div>
          <div class="text" id="num1">{{ monthEntrust.demandAmount | toThousands }}</div>
          <div class="ratio">权益发放占比 <span class="ratio-count">{{monthEntrust.totalProportion}}%</span></div>
        </div>
      </div>
      <div class="child">
        <img src="@/assets/img/本月应付.png" alt="" />
        <div class="content">
          <div class="child-title">
            <div class="after">
              <div>本月应付</div>
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">本月应付：指本月已付金额。</div>
                <img class="field-interpretation" src="@/assets/img/字段解释.png" alt="" />
              </el-tooltip>

            </div>
            <div class="month-ratio">
              <span>环比上月</span>
              <svg width="20" v-if="monthCopeWith.increaseProportion>0" style="margin:0 8px" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.1666 5L11.2499 12.9167L7.08325 8.75L0.833252 15" stroke="#20C997" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M14.1667 5H19.1667V10" stroke="#20C997" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg style="margin:0 8px" v-if="monthCopeWith.increaseProportion<0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.1666 15L11.2499 7.08333L7.08325 11.25L0.833252 5" stroke="#FA4A3E" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M14.1667 15H19.1667V10" stroke="#FA4A3E" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="ratio-count">{{monthCopeWith.increaseProportion<0?String(monthCopeWith.increaseProportion).slice(1):monthCopeWith.increaseProportion}}%</span>
            </div>
          </div>
          <div class="text">{{ monthCopeWith.paymentAmount | toThousands }}</div>
          <div class="ratio">NF:F <span class="ratio-count">{{monthCopeWith.totalProportion}}</span></div>
        </div>
      </div>
      <div class="child">
        <img src="@/assets/img/本月应收.png" alt="" />
        <div class="content">
          <div class="child-title">
            <div class="after">
              <div>本月应收</div>
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">本月应收：是指所有在当月应还</br>的应收金额。</div>
                <img class="field-interpretation" src="@/assets/img/字段解释.png" alt="" />
              </el-tooltip>
            </div>
            <div class="month-ratio">
              <span>环比上月</span>
              <svg width="20" v-if="monthReceivable.increaseProportion>0" style="margin:0 8px" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.1666 5L11.2499 12.9167L7.08325 8.75L0.833252 15" stroke="#20C997" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M14.1667 5H19.1667V10" stroke="#20C997" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg style="margin:0 8px" v-if="monthReceivable.increaseProportion<0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.1666 15L11.2499 7.08333L7.08325 11.25L0.833252 5" stroke="#FA4A3E" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M14.1667 15H19.1667V10" stroke="#FA4A3E" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="ratio-count">{{monthReceivable.increaseProportion<0?String(monthReceivable.increaseProportion).slice(1):monthReceivable.increaseProportion}}%</span>
            </div>
          </div>
          <div class="text">{{ monthReceivable.monthReceivable | toThousands }}</div>
          <div class="ratio">历史 <span class="ratio-count">{{monthReceivable.totalProportion}}%</span></div>
        </div>
      </div>
    </div>
    <div class="box-outer">
      <div class="box-container">
        <div class='box-container-title'>
          <el-badge :value="total5" class="title-badge">
            <p class="title">待办列表</p>
          </el-badge>
          <div class="box-container-top">
            <div v-if="ApprovalTypeNum.length>1">待办类型</div>
            <el-select class="title-dropdown" size="mini" v-model="form2.type" v-if="ApprovalTypeNum.length>1" @change="change" placeholder="全部类型">
              <el-option v-for="item in ApprovalType" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
              </el-option>
            </el-select>
            <div class="table-text main-right-more" @click="gotoApproveList"><span>查看更多</span><img src="@/assets/img/right.png" alt=""></div>
          </div>
        </div>
        <div v-if="list && list.length">
          <el-table stripe :data="list" style="max-width: 100%;margin:15px 0;" :header-cell-style="{ 'background-color': '#F4F8FF' }">
            <el-table-column label="编号" align="left" show-overflow-tooltip min-width="160" class-name="format-left">
              <template slot-scope="scope">
                <el-badge value="抄" class="title-badge" v-if="scope.row.state==1">
                  <span class="table-text" style="padding-right:5px" @click="gotoApprove(scope.row)">{{
                  scope.row.number
              }}</span>
                </el-badge>
                <span v-else class="table-text" style="padding-right:5px" @click="gotoApprove(scope.row)">{{
                  scope.row.number
              }}</span>
              </template>
            </el-table-column>
            <el-table-column label="客户" prop="amount" align="left" min-width="180">
              <template slot-scope="scope">
                <span>{{scope.row.abbreviated || '--' }}<span v-if="scope.row.channelName">({{scope.row.channelName}})</span></span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="渠道" prop="channelName" align="left" min-width="120">
              <template slot-scope="scope">
                <span>{{scope.row.channelName }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="产品" prop="productName" align="left" min-width="120">
              <template slot-scope="scope">
                <span>{{scope.row.productName || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="NF/F" v-if="form2.type !=5" align="left" width="100">
              <template slot-scope="scope">
                <span>{{scope.row.businessType ==0?'F':'NF'}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="form2.type==0?'申请委托':'审批金额'" v-if="form2.type !=5" prop="money" align="right" min-width="120">
              <template slot-scope="scope">
                <span>{{scope.row.money || 0 | toThousands}}</span>
              </template>
            </el-table-column>
            <el-table-column label="申请人" prop="createByName" align="center" min-width="120" class-name="format-right">
              <template slot-scope="scope">
                <span>{{scope.row.createByName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="申请时间" align="left" min-width="120" class-name="format-right">
              <template slot-scope="scope">
                <span>{{scope.row.submitTime}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="display:flex;justify-content:center;padding-bottom: 10px">
            <el-pagination layout="total, prev, pager, next,sizes" :page-sizes="[5, 10, 15, 20]" @size-change="handleSizeChange2" @current-change="handleCurrentChange2" background :page-size="form2.pageSize" :current-page="form2.pageNum" :total="total2"></el-pagination>
          </div>
        </div>
        <el-empty description="暂无待办审批" v-if="!list || !list.length"></el-empty>
      </div>
    </div>
    <div class="middle-box">
      <div class="middle-left">
        <!-- <div class="main-echart" ref="echartRef" id='main'></div> -->
        <div class="main-right">
          <div class="left-top">
            <div class="right-title">应收账款</div>
            <div class="table-text main-right-all" @click="expireContractList('receivable')"><span>查看全部</span><img src="@/assets/img/right.png" alt=""></div>
          </div>

          <el-table stripe :data="receivableAccountList" height="286px" style="max-width: 100%;margin:15px 0;" :header-cell-style="{ 'background-color': '#F4F8FF' }">
            <el-table-column label="省/市" align="left" min-width="110px" show-overflow-tooltip class-name="format-left">
              <template slot-scope="scope">
                <span class="table-text" @click="gotoReceivable(scope.row)">{{
                  scope.row.regionName
              }}</span>
              </template>
            </el-table-column>
            <el-table-column label="总应收" prop="amount" min-width="110px" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.totalReceivable || 0 | toThousands}}</span>
              </template>
            </el-table-column>
            <el-table-column label="本月应收" min-width="110px" align="right">
              <template slot="header" slot-scope="">
                <el-tooltip effect="dark" placement="top">
                  <div slot="content">本月应收：本月应收是指所有在当月应<br />还的应收金额，包含逾期应收。</div>
                  <span class="explain-fields">本月应收</span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <span>{{scope.row.monthReceivable || 0 | toThousands}}</span>
              </template>
            </el-table-column>
            <el-table-column label="逾期应收" min-width="110px" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.beOverdueReceivable || 0 | toThousands}}</span>
              </template>
            </el-table-column>
            <el-table-column label="逾期笔数" min-width="110px" align="right" class-name="format-right">
              <template slot-scope="scope">
                <span>{{scope.row.beOverdueQuantity}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="display:flex;justify-content:center;padding-bottom: 10px">
            <el-pagination layout="total, prev, pager, next,sizes" :page-sizes="[5, 10, 15, 20]" @size-change="handleSizeChange3" @current-change="handleCurrentChange3" background :page-size="form3.pageSize" :current-page="form3.pageNum" :total="total3"></el-pagination>
          </div>
        </div>
      </div>
      <div class="middle-right">
        <div class="main-echart" ref="echartRef" id='main'></div>
        <!-- <div class="main-echart2" ref="echartRef2" id='main2'></div> -->
      </div>
    </div>
    <div class="footer-box">
      <div class="footer-top">
        <div class="title-container">
          <div class="footer-title">到期合同</div>
          <div class="month">近2个月内到期</div>
        </div>
        <div class="table-text main-right-all" @click="expireContractList('contract')"><span>查看全部</span><img src="@/assets/img/right.png" alt=""></div>
      </div>
      <el-table stripe :data="ExpireContractList" style="max-width: 100%;margin:15px 0;" :header-cell-style="{ 'background-color': '#F4F8FF' }">
        <el-table-column label="合约编号" align="left" show-overflow-tooltip min-width="160" class-name="format-left">
          <template slot-scope="scope">
            <span>{{
                  scope.row.number
              }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品" align="left" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.productName || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户简称" prop="advanceMoney" align="left" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.customerVo && scope.row.customerVo.abbreviated}}</span>
          </template>
        </el-table-column>
        <el-table-column label="运营主体" align="left" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.subjectVo && scope.row.subjectVo.abbreviated}}</span>
          </template>
        </el-table-column>
        <el-table-column label="到期日" align="left" min-width="120" class-name="format-right">
          <template slot-scope="scope">
            <span>{{scope.row.surplusDay}}天到期</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="display:flex;justify-content:center;padding-bottom: 10px">
        <el-pagination layout="total, prev, pager, next,sizes" :page-sizes="[5, 10, 15, 20]" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getHomeInfo, getHomePage, expireContractPage, receivableAccountsPage, receivableAccounts } from "@/api/index";
import moment from 'moment'
import { ApprovalType } from "@/utils/field.js";
import * as echarts from 'echarts';
export default {
  name: "default",
  data() {
    return {
      form: {
        pageSize: 5,
        pageNum: 1
      },
      form2: {
        isPage: 1,
        pageSize: 5,
        pageNum: 1,
        state: [0, 1],
        type: '',
        isHome: 1
      },
      total: 0,
      total2: 0,
      total3: 0,
      total5: 0,
      form3: {
        pageSize: 5,
        pageNum: 1
      },
      monthEntrust: {},
      monthCopeWith: {},
      monthReceivable: {},
      list: [],
      ExpireContractList: [],
      total: 0,
      menuList: [],
      ApprovalType: [
        { value: 0, label: "业务审批" },
        { value: 1, label: "付款审批" },
        { value: 2, label: "开票审批" },
        { value: 3, label: "回款审批" },
        { value: 5, label: "合同审批" },
      ],
      ApprovalTypeNum: 0,
      type: '',
      countNumbet: {},//统计审批数据数量
      listLength: 0,
      amoutFrame: 0,
      amountShow: 0,
      receivableAccountList: [],
      total3: 0
    };
  },
  created() {
    this.$nextTick(() => {
      this.onload();
    })
    this.getList('onload')
    this.expireContractPage()
    this.receivableAccountsPage()
    this.receivableAccounts()
    //从审批回来滚动条为0
    let id = document.getElementById('viewBox')
    if (id) {
      document.getElementById('viewBox').scrollTo(0, 0)
    }
  },
  mounted() {
    const myChart = echarts.init(this.$refs.echartRef)
    let listener = function () {
      myChart.resize()
    }
    window.addEventListener('resize', listener)
  },

  methods: {
    changeAmount() {
      const total1 = this.monthEntrust.demandAmount
      const total2 = this.monthCopeWith.paymentAmount
      const total3 = this.monthReceivable.monthReceivable
      const _this = this;
      let i = 0;
      //变化15次，每次间隔30毫秒
      const amoutInterval = setInterval(() => {
        if (i < 10) {
          i++;
          _this.monthEntrust.demandAmount = (total1 * i) / 10;
          _this.monthCopeWith.paymentAmount = (total2 * i) / 10;
          _this.monthReceivable.monthReceivable = (total3 * i) / 10;
        } else {
          clearInterval(amoutInterval);
        }
      }, 100);
    },
    gotoReceivable(row) {
      let date = moment().format('YYYY-MM-DD')
      let a = [
        {
          companyId: row.companyId,
          name: row.regionName,
          routerLevel: 1,
          path: '/default',
          date: date
        }
      ]
      this.$router.push({ path: '/fundCenter/ReceivableInfo', query: { companyId: row.companyId, date } })
      sessionStorage.setItem('path1', JSON.stringify(a))
    },
    handleSizeChange(val) {
      this.form.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.form.pageNum = val
      this.expireContractPage()
    },
    handleSizeChange2(val) {
      this.form2.pageSize = val
      this.handleCurrentChange2(1)
    },
    handleCurrentChange2(val) {
      this.form2.pageNum = val
      this.getList()
    },
    handleSizeChange3(val) {
      this.form3.pageSize = val
      this.handleCurrentChange3(1)
    },
    handleCurrentChange3(val) {
      this.form3.pageNum = val
      this.receivableAccountsPage()
    },
    myChart(data = []) {
      let NameList = data.map(item => {
        return {
          value: Number(item.totalProportion),
          name: item.regionName
        }
      })
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('main'));
      // 绘制图表
      myChart.setOption({
        backgroundColor: '#fff',
        title: {
          left: 10,
          top: 10,
          text: '应收占比',
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
          orient: 'vertical',
          right: 'right',
          top: 'middle',
          textStyle: {
            color: '#2c3e50'
          }
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: NameList,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: '{b} \n {d}%' //带当前图例名 + 百分比
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
              }
            }
            return res
          }
        }
      });
    },
    receivableAccounts() {
      receivableAccounts().then(res => {
        if (res.code !== 200) return
        this.myChart(res.data)
      })
    },
    expireContractList(type) {
      this.menuList = JSON.parse(sessionStorage.getItem("menuList"));
      let isToDemand = true
      let path = type == 'contract' ? '/basicManagement/contract' : type == 'receivable' ? '/fundCenter/receivable' : ''
      let query = type == 'contract' ? { isExpire: 1 } : ''
      this.menuList.forEach((item) => {
        if (item.path == path) {
          this.$router.push({
            path,
            query,
          });
          isToDemand = false
        }
        if (item.child && item.child.length > 0) {
          item.child.forEach((item1) => {
            if (item1.path == path) {
              this.$router.push({
                path,
                query,
              });
              isToDemand = false
            }
            if (item1.child && item.child.length > 0) {
              item1.child.forEach((item2) => {
                if (item2.path == path) {
                  this.$router.push({
                    path,
                    query,
                  });
                  isToDemand = false
                }
              });
            }
          });
        }
      });
      if (isToDemand) {
        this.$message.error('您暂无此权限，请您联系管理员添加权限！')
      }
    },
    async onload() {
      await getHomeInfo({}).then((res) => {
        if (res.code !== 200) return
        this.monthEntrust = res.data.monthEntrust
        this.monthCopeWith = res.data.monthCopeWith
        this.monthReceivable = res.data.monthReceivable
        this.changeAmount()
      });
    },
    receivableAccountsPage() {
      receivableAccountsPage(this.form3).then(res => {
        if (res.code !== 200) return
        this.receivableAccountList = res.data.records || []
        this.total3 = res.data.total
      })
    },
    getList(type) {
      getHomePage({ ...this.form2 }).then((res) => {
        if (res.code !== 200) return
        this.list = res.data.records || [];
        let total = res.data.total
        this.total2 = res.data.total
        //第一次进页面执行
        if (type == 'onload') {
          let param = {
            isPage: 1,
            pageNum: 1,
            pageSize: 100,
            isHome: 1,
            state: [0, 1]
          }
          getHomePage(param).then(resu => {
            if (resu.code !== 200) return
            this.total5 = resu.data.total
            let list2 = resu.data.records || [];
            let typeList = []
            if (list2 && list2.length > 0) {
              list2.forEach(item => {
                if (typeList.indexOf(item.type) == -1) {
                  typeList.push(item.type);
                }
              })
            }
            //待办数量统计
            // this.listLength = this.list.length
            let b = []
            typeList.forEach(item => {
              this.ApprovalType.forEach(item1 => {
                if (item == item1.value) {
                  b.push(item1)
                }
              })
            })
            this.ApprovalType = b
            this.ApprovalTypeNum = this.ApprovalType.length
            this.form2.type = typeList[0]
            this.list = list2.filter(item => {
              return item.type == typeList[0]
            }).splice(0, 5)
            this.total2 = list2.filter(item => {
              return item.type == typeList[0]
            }).length || 0
          })
        }
      });
    },
    expireContractPage() {
      expireContractPage({ ...this.form }).then((res) => {
        this.ExpireContractList = res.data.records || [];
        this.total = res.data.total
      });
    },
    change() {
      this.getList()
    },
    gotoApproveList() {
      this.$router.push({
        path: "/approve/index",
      })
    },
    gotoApprove(item) {
      this.$router.push({
        path: "/approve/index",
        query: {
          id: item.id,
          editType: item.state == 0 ? "approve" : "show",
          type: item.type,
          state: item.state,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.home-box {
  // padding: 10px;
  padding-top: 6px;
  .data-title {
    color: #303132;
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 20px;
  }
  .title-badge {
    margin: 20px 0 0;
    .title {
      margin: 0 0 20px 0;
      padding-right: 7px;
    }
  }
  .title {
    font-weight: bold;
    font-size: 20px;
    margin: 20px 0 0;
  }
  .top-box {
    background: #fff;
    // background: red;
    display: flex;
    justify-content: space-between;
    color: #fff;
    border-radius: 10px;
    .child {
      flex: 1;
      height: 137px;
      margin-right: 20px;
      display: flex;
      align-items: center;
      .content {
        min-width: 280px;
      }
      .child-title {
        color: #626468;
        font-weight: normal;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        .after {
          display: flex;
          justify-content: center;
          align-items: center;
          // margin: 6px 0;
          position: relative;
          .field-interpretation {
            width: 15px;
            height: 15px;
            margin-left: 6px;
            position: absolute;
            top: 3px;
            left: 65px;
            // right: -20px;
            cursor: pointer;
          }
        }
        .month-ratio {
          display: flex;
        }
      }
      .text {
        color: #303132;
        font-weight: bold;
        font-size: 26px;
        margin: 10px 0;
      }
      .ratio {
        color: #626468;
        font-weight: normal;
        font-size: 14px;
        // margin: 0;
      }
      .ratio-count {
        color: #fa4a3e;
      }
      img {
        width: 48px;
        height: 48px;
        margin: 0 22px;
      }
    }
  }
}
.box-outer {
  margin: 20px 0 0;
  // background: #fff;
  display: flex;
  justify-content: space-between;
}
.box-container {
  // display: flex;
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 0 16px;
  .box-container-top {
    display: flex;
    align-items: center;
    .main-right-more {
      display: flex;
      align-items: center;
      text-align: right;
      font-size: 14px;
      margin-right: 20px;
      img {
        width: 19px;
        height: 19px;
        margin-top: 2px;
      }
    }
  }
  .ban-box {
    display: flex;
    flex-wrap: wrap;
    .approve {
      flex: 1;
      flex-shrink: 0;
      min-width: 380px;
      max-width: 395px;
      height: 269px;
      filter: drop-shadow(0px 15px 50px rgba(160, 163, 189, 0.13));
      background: #fff;
      margin: 20px 20px 0 0;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 10px 12px;
      cursor: pointer;
      &:hover {
        filter: drop-shadow(0px 15px 50px rgba(160, 163, 189, 0.349));
        transition: filter 0.5s;
      }
      .approve-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .icon {
          display: inline-block;
          width: 6px;
          height: 6px;
          margin-left: -5px;
          margin-right: 5px;
          border-radius: 50%;
        }
        span:nth-child(2) {
          color: #666;
          font-size: 14px;
        }
      }
      p {
        span:nth-child(1) {
          color: #000;
          font-size: 16px;
        }
        span:nth-child(2) {
          color: #666;
          font-size: 14px;
        }
      }
    }
  }
  &-title {
    display: flex;
    justify-content: space-between;
    ::v-deep .title-dropdown {
      input::-webkit-input-placeholder {
        font-size: 13px !important;
        color: #303132 !important;
      }
      // margin: 22px 16px 0 0;
      margin: 0 20px;
      width: 130px;
      height: 32px;
      border-radius: 4px;
      line-height: 32px;
      text-align: center;
      span {
        cursor: pointer;
      }
      i {
        margin-left: 32px;
      }
    }
  }
}
.middle-box {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  .middle-left {
    width: 60%;
    background: #fff;
    border-radius: 10px;
    // display: flex;

    .main-right {
      .left-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 20px;
        .right-title {
          font-size: 20px;
          font-weight: 700;
          margin-left: 20px;
        }
      }
      // width: 48%;
      .main-right-all {
        display: flex;
        align-items: center;
        text-align: right;
        margin-right: 20px;
        // padding-top: 20px;
        font-size: 14px;
        img {
          width: 19px;
          height: 19px;
          margin-top: 2px;
        }
      }
    }
  }
  .middle-right {
    width: 39%;
    background: #fff;
    border-radius: 10px;
  }
  .main-echart {
    margin: 5px;
    height: 400px;
    border-radius: 5px;
    // width: 50%;
    // box-shadow: 0px 10px 20px rgba(111, 108, 255, 0.25);
  }
  .main-echart2 {
    margin: 5px 5px 0 0;
    height: 440px;
    border-radius: 5px;
    // box-shadow: 0px 10px 20px rgba(111, 108, 255, 0.25);
  }
}
.footer-box {
  margin-top: 20px;
  background: #fff;
  border-radius: 10px;
  .footer-top {
    padding: 20px 20px 10px;
    display: flex;
    justify-content: space-between;
    .main-right-all {
      // margin-right: 20px;
      display: flex;
      align-items: center;
      font-size: 14px;
      img {
        width: 19px;
        height: 19px;
      }
    }
    .title-container {
      display: flex;
      .month {
        font-size: 14px;
        font-weight: 600;
        margin-left: 10px;
        margin-top: 8px;
      }
    }
    .footer-title {
      font-size: 20px;
      font-weight: 700;
      color: #2c3e50;
    }
  }
}
::v-deep .el-badge__content.is-fixed {
  right: 5px;
}
::v-deep .format-left {
  padding-left: 10px;
}
::v-deep .format-right {
  padding-right: 10px;
}
.explain-fields {
  &:after {
    display: inline-block;
    content: "";
    width: 14px;
    height: 14px;
    background: url("../../assets/img/字段解释.png") no-repeat;
    background-size: contain;
    vertical-align: middle;
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>