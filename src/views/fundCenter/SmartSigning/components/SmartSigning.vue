<template>
  <div class="home-box">

    <div class="middle-box">
      <div class="middle-left">
        <div class="main-right">
          <div class="left-top">
            <div class="right-title">客户签约情况</div>
            <div>
              <el-input v-model="form.search" size="mini" style="width:240px;margin-right:20px" placeholder="搜索客户名称、主体、项目">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
          </div>
          <el-table stripe :data="list" height="330px" style="max-width: 100%;margin:15px 0;" :header-cell-style="{ 'background-color': '#F4F8FF' }">
            <el-table-column label="客户" align="left" min-width="110px" show-overflow-tooltip class-name="format-left">
              <template slot-scope="scope">
                <span>{{scope.row.number}}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属省份" prop="amount" min-width="110px" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.customerVo && scope.row.customerVo.abbreviated || '--'}}</span>
              </template>
            </el-table-column>

            <el-table-column label="签约主体数" min-width="110px" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.subjectVo && scope.row.subjectVo.abbreviated || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="签约主体" min-width="110px" align="right">
              <template slot-scope="scope">
                <span>{{scope.row.createByName || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="签约项目" min-width="110px" align="right" class-name="format-right">
              <template slot-scope="scope">
                <span>{{scope.row.beOverdueQuantity}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="display:flex;justify-content:center;padding-bottom: 10px">
            <el-pagination layout="total, prev, pager, next,sizes" :page-sizes="[5, 10, 15, 20]" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total"></el-pagination>
          </div>
        </div>
      </div>
      <div class="middle-right">
        <div class="top">
          <div class="demand-tj">签约项目占比</div>
          <el-date-picker :clearable="false" size="mini" @change="changeTime" v-model="date" style="width:110px" value-format="yyyy-MM" type="month" placeholder="选择日期"></el-date-picker>
        </div>
        <div class="main-echart" ref="echartRef" id='main'></div>
      </div>
    </div>
    <div class="footer-box">
      <div class="search-box">
        <div class="footer-title">签约异常处理</div>
        <el-form size="small" class="top">
          <el-form-item label=" ">
            <el-input v-model="form.search" style="width:240px;margin-right:50px" placeholder="搜索客户名称、主体、项目">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label=" ">
            <el-button class="main-right-all" type="primary" @click="clickSmartSign">智能签约</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table stripe :data="list" style="max-width: 100%;margin:15px 0;" :header-cell-style="{ 'background-color': '#F4F8FF' }">
        <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
        <el-table-column label="客户名称" align="left" show-overflow-tooltip min-width="160" class-name="format-left">
          <template slot-scope="scope">
            <span>{{
                  scope.row.number
              }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已签约主体" align="left" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.productName || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已签约项目" prop="advanceMoney" align="left" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.customerVo && scope.row.customerVo.abbreviated}}</span>
          </template>
        </el-table-column>
        <el-table-column label="推荐签约主体" align="left" min-width="120">
          <template slot-scope="scope">
            <span>{{scope.row.subjectVo && scope.row.subjectVo.abbreviated}}</span>
          </template>
        </el-table-column>
        <el-table-column label="推荐签约项目" align="left" min-width="120" class-name="format-right">
          <template slot-scope="scope">
            <span>{{scope.row.surplusDay}}天到期</span>
          </template>
        </el-table-column>
        <el-table-column label="项目助理" align="left" min-width="120" class-name="format-right">
          <template slot-scope="scope">
            <span>{{scope.row.surplusDay}}天到期</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="left" min-width="120" class-name="format-right">
          <template slot-scope="scope">
            <span>{{scope.row.surplusDay}}天到期</span>
          </template>
        </el-table-column>
        <el-table-column label="原因" align="left" min-width="120" class-name="format-right">
          <template slot-scope="scope">
            <span>{{scope.row.surplusDay}}天到期</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left" fixed="right" min-width="160" class-name="format-right">
          <template slot-scope="scope">
            <div style="display:flex">
              <div class="table-text" style="margin-right:10px" @click="ToAdd">续签</div>
              <div class="table-text" style="margin-right:10px">忽略</div>
              <div class="table-text">去签约</div>
            </div>

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
import { getHomePage, expireContractPage, receivableAccounts, getContractPage } from "@/api/index";
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
      },
      total: 0,
      total2: 0,
      total3: 0,
      total5: 0,
      date: moment().format('YYYY-MM'),
      monthEntrust: {},
      monthCopeWith: {},
      monthReceivable: {},
      list: [
        { id: 1 }
      ],
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
      type: '',
      countNumbet: {},//统计审批数据数量
      listLength: 0,
      amoutFrame: 0,
      amountShow: 0,
      receivableAccountList: [],
      total3: 0,
      user: {}
    };
  },
  created() {
    this.user = JSON.parse(sessionStorage.getItem("user"));
    // this.expireContractPage()
    // this.receivableAccountsPage()
    this.receivableAccounts()
    // this.getHomePage()
    this.getContractPage()
    //从审批回来滚动条为0
    let id = document.getElementById('viewBox')
    if (id) {
      document.getElementById('viewBox').scrollTo(0, 0)
    }
  },
  mounted() {
    const myChart = echarts.init(this.$refs.echartRef)
    // const myChart2 = echarts.init(this.$refs.echartRef2)
    let listener = function () {
      myChart.resize()
      // myChart2.resize()
    }
    window.addEventListener('resize', listener)
  },

  methods: {
    getHomePage() {
      getHomePage({ ...this.form2 }).then((res) => {
        this.list = res.data.records || []
      })
    },
    getContractPage() {
      getContractPage(this.form).then(res => {
        this.list = res.data.records || []
        this.total = res.data.total
      })
    },
    ToAdd() {
      this.$emit('input', 2)
      this.$emit('edit', 'add')
    },
    changeTime() {
      this.receivableAccounts()
    },
    clickSmartSign() {
      this.$router.push({ path: '/fundCenter/SmartSigning' })
      // this.$emit('input', 1)
      // this.$emit('edit', id, type)
    },
    changeAmount() {
      // const total = 16000; //设置初始总金额
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
      this.getContractPage()
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
      // this.form3.pageSize = val
      this.handleCurrentChange3(1)
    },
    handleCurrentChange3(val) {
      // this.form3.pageNum = val
      // this.receivableAccountsPage()
    },
    myChart(data = []) {
      let NameList = data.map(item => {
        return {
          value: Number(item.totalProportion),
          name: item.regionName
        }
      })
      // let totalAmount1 = this.$options.filters.toThousands(NumberAdd(data.map(item => item.surplusReceivable)))
      // let totalAmount = this.$options.filters.toThousands(Number(this.format(NumberAdd(data.map(item => item.surplusReceivable)))))
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('main'));
      // 绘制图表
      myChart.setOption({
        backgroundColor: '#fff',
        title: {
          left: 10,
          top: 10,
          // text: '签约项目占比',
          // subtext: `总额：￥${totalAmount} 万`,
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
          // bottom: 10,
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
            // zoom: 1.5,
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
    receivableAccounts() {
      let param = {
        date: this.date
      }
      receivableAccounts(param).then(res => {
        if (res.code !== 200) return
        this.myChart(res.data)
      })
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
  },
};
</script>
<style lang="scss" scoped>
.home-box {
  // padding: 10px;
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
      text-align: right;
      font-size: 14px;
      margin-right: 20px;
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
        text-align: right;
        margin-right: 20px;
        // padding-top: 20px;
        font-size: 14px;
      }
    }
  }
  .middle-right {
    width: 39%;
    background: #fff;
    border-radius: 10px;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 20px 0;
      .demand-tj {
        font-weight: 700;
        color: #2c3e50;
        font-size: 20px;
      }
    }
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
  .search-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
  }
  .footer-title {
    font-size: 20px;
    font-weight: 700;
    color: #2c3e50;
    padding-left: 10px;
    // padding: 20px 0 0 20px;
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
    // background: url("../../assets/img/字段解释.png") no-repeat;
    background-size: contain;
    vertical-align: middle;
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>