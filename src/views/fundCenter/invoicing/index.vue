<template>
  <div class="spacel-box">
    <el-form inline size="small">
      <el-form-item>
        <el-radio v-model="form.type" @change="onload(0)" :label="0">按月</el-radio>
        <el-radio v-model="form.type" @change="onload(1)" :label="1">按年</el-radio>
        <el-date-picker :clearable="false" @change="onload" v-model="form.date" :value-format="form.type == 1 ? 'yyyy' : 'yyyy-MM'" :type="form.type == 1 ? 'year' : 'month'" :placeholder="form.type == 1 ? '选择年份' : '选择月份'"></el-date-picker>
      </el-form-item>
    </el-form>
    <div class="num-box" style="width:70%;margin-right:2%">
      <div class="top-title">
        <h3 style="margin:10px;">开票金额</h3>
        <!-- <h3 style="margin:10px;">进票金额</h3> -->
      </div>
      <div class="top-box">
        <div class="child">
          <img src="@/assets/img/总额2.png" alt="">
          <div>
            <p>总额度</p>
            <p>{{ topSum.invoicingRestrictions || 0 | toThousands }}</p>
          </div>
        </div>
        <div class="child">
          <img src="@/assets/img/已开金额.png" alt="">
          <div>
            <p>已开金额</p>
            <p>{{ topSum.totalInvoicingAmount || 0 | toThousands }}</p>
          </div>
        </div>
        <div class="child">
          <img src="@/assets/img/剩余金额.png" alt="">
          <div>
            <p>剩余额度</p>
            <p>{{ topSum.surplusInvoicingAmount || 0 | toThousands }}</p>
          </div>
        </div>
        <div class="child">
          <img src="@/assets/img/省份.png" alt="">
          <div>
            <p>省份</p>
            <p>{{ topSum.provincesQuantity || 0 | toThousands }}</p>
          </div>
        </div>
        <div class="child">
          <img src="@/assets/img/客户2.png" alt="">
          <div>
            <p>客户数</p>
            <p>{{ topSum.customerQuantity || 0 | toThousands }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="num-box" style="width:28%">
      <div class="top-title">
        <h3 style="margin:10px;">进票金额</h3>
      </div>
      <div class="top-box">
        <div class="child">
          <img src="@/assets/img/总额2.png" alt="">
          <div>
            <p>总额</p>
            <p>{{ topSum.enterInvoiceAmount || 0 | toThousands }}</p>
          </div>
        </div>
        <div class="child">
          <img src="@/assets/img/进销差.png" alt="">
          <div>
            <p>进销差</p>
            <p>{{ topSum.enterInvoiceDifference || 0 | toThousands }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="table-box">
      <h3 style="margin:10px 5px">各主体开票情况</h3>
      <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;">
        <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
        <el-table-column label="主体" align="left" prop="subjectName" show-overflow-tooltip width="300"></el-table-column>
        <el-table-column label="税务类型" align="left" width="100" prop="type">
          <template slot-scope="scope">
            <span>{{ scope.row.type == 1 ? '小规模' : '一般纳税人' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开票" align="center">
          <el-table-column label="总额" align="center">
            <el-table-column label="开票额度" prop="invoicingRestrictions" align="center">
              <template slot-scope="scope">
                <el-popover placement="top-start" @show="showInvoicingRestrictions(scope.row, 0)" width="200" trigger="hover">
                  <div v-for="(item, index) in specialTicket" :key="index">
                    {{ InvoiceTypeList[item.type] }}:{{ item.invoicingRestrictions || 0 | toThousands}}
                  </div>
                  <span slot="reference">{{ scope.row.invoicingRestrictions || 0 | toThousands}}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="份数" prop="invoicingQuantity" align="center">
              <template slot-scope="scope">
                <el-popover @show="showInvoicingRestrictions(scope.row, 1)" placement="top-start" width="200" trigger="hover">
                  <div v-for="(item, index) in specialTicket" :key="index">
                    {{ InvoiceTypeList[item.type] }}:{{ item.invoicingQuantity }}
                  </div>
                  <span slot="reference">{{ scope.row.invoicingQuantity }}</span>
                </el-popover>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="已开" align="center">
            <el-table-column label="已开金额" prop="totalInvoicingAmount" align="center">
              <template slot-scope="scope">
                <el-popover @show="showInvoicingRestrictions(scope.row, 2)" placement="top-start" width="200" trigger="hover">
                  <div v-for="(item, index) in specialTicket" :key="index">
                    {{ InvoiceTypeList[item.type] }}:{{ item.totalInvoicingAmount || 0 | toThousands}}
                  </div>
                  <span slot="reference">{{ scope.row.totalInvoicingAmount || 0 | toThousands}}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="已开份数" prop="totalInvoicingQuantity" align="center">
              <template slot-scope="scope">
                <el-popover @show="showInvoicingRestrictions(scope.row, 3)" placement="top-start" width="200" trigger="hover">
                  <div v-for="(item, index) in specialTicket" :key="index">
                    {{ InvoiceTypeList[item.type] }}:{{ item.totalInvoicingQuantity }}
                  </div>
                  <span slot="reference">{{ scope.row.totalInvoicingQuantity }}</span>
                </el-popover>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="剩余" align="center">
            <el-table-column label="剩余额度" prop="surplusInvoicingAmount" align="center">
              <template slot-scope="scope">
                <el-popover @show="showInvoicingRestrictions(scope.row, 4)" placement="top-start" width="200" trigger="hover">
                  <div v-for="(item, index) in specialTicket" :key="index">
                    {{ InvoiceTypeList[item.type] }}:{{ item.surplusInvoicingAmount || 0 | toThousands}}
                  </div>
                  <span slot="reference">{{ scope.row.surplusInvoicingAmount || 0 | toThousands}}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="剩余份数" prop="surplusInvoicingQuantity" align="center">
              <template slot-scope="scope">
                <el-popover @show="showInvoicingRestrictions(scope.row, 5)" placement="top-start" width="200" trigger="hover">
                  <div v-for="(item, index) in specialTicket" :key="index">
                    {{ InvoiceTypeList[item.type] }}:{{ item.surplusInvoicingQuantity
                    }}
                  </div>
                  <span slot="reference">{{ scope.row.surplusInvoicingQuantity }}</span>
                </el-popover>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="已开省份数量" prop="provincesQuantity" align="center"></el-table-column>
          <el-table-column label="已开客户数量" prop="customerQuantity" align="center"></el-table-column>
        </el-table-column>
        <el-table-column label="进票" align="center">
          <el-table-column label="总额" prop="enterInvoiceAmount" align="center">
            <template slot-scope="scope">
              <el-popover @show="showInvoicingRestrictions(scope.row, 6)" placement="top-start" width="200" trigger="hover">
                <div v-for="(item, index) in specialTicket" :key="index">
                  {{ InvoiceTypeList[item.type] }}:{{ item.enterInvoiceAmount || 0 | toThousands}}
                </div>
                <span slot="reference">{{ scope.row.enterInvoiceAmount || 0 | toThousands}}</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="进销差" prop="enterInvoiceDifference" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.enterInvoiceDifference || 0 | toThousands}}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <div style="display:flex;justify-content:center">
        <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total"></el-pagination>
        <el-button v-show="isShowExport" style="margin-top:10px;margin-left:50px" size="mini" type="primary" v-debounce="exportClick" :loading="loading">导出
        </el-button>
      </div>
    </div>

  </div>
</template>

<script>
import { getInvoiceStatisticsPage, invoiceStatistics, getInvoiceStatisticsInfo } from '@/api/index.js'
import { exportCommon, newExportsExcel } from '@/utils/index.js'
import moment from 'moment'
export default {
  name: 'invoicing',
  props: ['value'],
  data() {
    return {
      form: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
        type: 0,
        date: moment().format('YYYY-MM')
      },
      list: [],
      total: 0,
      topSum: {},
      invoicingRestrictionsList: [],
      specialTicket: [],
      date: '',
      InvoiceTypeList: ['专票', '普票', '普票(电子)', '专票(电子)'],
      loading: false
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
    showInvoicingRestrictions(row, type) {
      this.specialTicket = row.invoiceStatisticsInfoVoList.filter(item => item.dateType == type)
    },
    onload(i) {
      this.getTopSum()
      this.getList()
    },
    getTopSum() {
      let param = {
        date: this.form.type == 1 ? this.form.date.slice(0, 4) : this.form.date,
        type: this.form.type
      }
      invoiceStatistics(param).then(res => {
        this.topSum = res.data || {}
      })
    },
    getList() {
      let param = {
        ...this.form,
        date: this.form.type == 1 ? this.form.date.slice(0, 4) : this.form.date,
      }
      getInvoiceStatisticsPage(param).then(res => {
        if (res.code != 200) return
        this.list = res.data.records
        this.total = res.data.total
      })
    },
    // onload(i) {
    //   if (this.form.type == 1) {
    //     this.getTopSum1()
    //     this.getList1()
    //   } else {
    //     this.getTopSum()
    //     this.getList()
    //   }
    // },
    // getTopSum() {
    //   invoiceStatistics({ date: this.form.date, type: this.form.type }).then(res => {
    //     this.topSum = res.data || {}
    //   })
    // },
    // getList() {
    //   getInvoiceStatisticsPage(this.form).then(res => {
    //     if (res.code != 200) return
    //     this.list = res.data.records
    //     this.total = res.data.total
    //   })
    // },
    handleSizeChange(val) {
      this.form.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.form.pageNum = val
      this.getList()
    },
    editDetail(id, type, customerName) {
      this.$emit('input', 1)
      this.$emit('edit', id, type, customerName)
    },
    exportClick() {
      this.loading = true
      let param = { date: this.form.date, type: this.form.type }
      // exportCommon("/cii-system/invoiceApproval/exportInvoiceStatisticsExcel", param);
      var myDate = new Date();
      var Time1 = myDate.toLocaleDateString()//yyyy/MM/dd 这个方法如果是1月份，会显示yyyy/M/dd，默认把前面的0省略掉，有点坑，别的情况没尝试
      var Time2 = myDate.toISOString().slice(0, 10)//推荐 yyyy-MM-dd
      newExportsExcel('/cii-system/invoiceApproval/exportInvoiceStatisticsExcel', param).then(res => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        let url = URL.createObjectURL(blob);
        const link = document.createElement('a'); //创建a标签
        link.href = url;
        link.download = `开票统计列表-${Time2}`; //重命名文件
        link.click();
        URL.revokeObjectURL(url);
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.num-box {
  display: inline-block;
  background: #fff;
  border-radius: 10px;
  padding: 10px 0;
  margin-bottom: 10px;

  .top-title {
    display: flex;
    justify-content: space-between;

    h3:nth-child(2) {
      width: 27%;
    }
  }
}

.top-box {
  // background: red;
  display: flex;
  justify-content: space-between;

  // color: #fff;
  .child {
    flex: 1;
    height: 150px;
    margin: 0 10px;
    // display: flex;
    align-items: center;
    border-radius: 10px;
    background: #fff;
    filter: drop-shadow(0px 7px 14px rgba(58, 125, 255, 0.1));
    box-sizing: border-box;
    padding: 20px 0 14px 13px;

    img {
      width: 36px;
      height: 36px;
      margin-bottom: 15px;
    }

    p:nth-child(1) {
      font-size: 16px;
      color: #5a5881;
      margin: 0;
    }

    p:nth-child(2) {
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

.table-box {
  background: #fff;
  border-radius: 10px;
  padding: 10px 10px 40px 10px;
  box-sizing: border-box;
}
</style>
<style lang="scss">
.spacel-box {
  .el-input__inner {
    background: #ffffff00 !important;
  }
}
</style>