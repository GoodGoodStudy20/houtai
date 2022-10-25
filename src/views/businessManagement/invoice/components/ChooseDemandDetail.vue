<template>
  <div>
    <div class="radio-box" v-if="type !='showInfo'">
      <el-tooltip effect="dark" content="系统扣减规则，系统顺序扣减每笔业务申请应收未开票金额" placement="top">
        <el-radio v-model="radio" label="1" class="explain-fields">系统扣减规则</el-radio>
      </el-tooltip>
      <el-tooltip effect="dark" content="可以自定义每笔业务申请应收未开票金额" placement="top">
        <el-radio v-model="radio" label="2" class="explain-fields">自定义规则</el-radio>
      </el-tooltip>
    </div>
    <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;" :header-cell-style="{'background-color':'#F4F8FF'}" show-summary :summary-method="getSummaries">
      <el-table-column label="业务编号" prop="number" align="left" width="220"></el-table-column>
      <el-table-column label="客户" align="left" min-width="160">
        <template slot-scope="scope">
          <span>{{scope.row.customerVo && scope.row.customerVo.abbreviated}}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道" align="left" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.customerChannelVo && scope.row.customerChannelVo.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="委托经营所得" prop="income" min-width="120" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.income || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计回款时间" prop="estimateArrivalDate" width="100" align="left">
      </el-table-column>
      <el-table-column label="当前应收" min-width="120" prop="nowReceivableMoney" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.nowReceivableMoney || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已开票" min-width="120" prop="alreadyInvoiceMoney" align="right" v-if="type=='showInfo'">
        <template slot-scope="scope">
          <span>{{scope.row.alreadyInvoiceMoney || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="本次开票" min-width="120" prop="currentUsedInvoiceMoney" align="right" v-if="type=='showInfo'">
        <template slot-scope="scope">
          <span>{{scope.row.currentUsedInvoiceMoney || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余未开票" min-width="120" prop="surplusNotInvoiced" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.surplusNotInvoiced || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已回款" prop="alreadyReturnMoney" min-width="120" align="right" v-if="type=='showInfo'">
        <template slot-scope="scope">
          <span>{{scope.row.alreadyReturnMoney || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="未回款" min-width="120" prop="surplusNotReturnMoney" align="right" v-if="type=='showInfo'">
        <template slot-scope="scope">
          <span>{{scope.row.surplusNotReturnMoney || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="本次指定开票金额" min-width="120" v-if="radio==2" align="right">
        <template slot-scope="scope">
          <el-input v-model="scope.row.money" size="mini" clearable style="width:100px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="100" v-if="radio==2">
        <template slot-scope="scope">
          <span class="table-text" style="margin-right:10px" @click="ClickAllUsed(scope.row)">指定全部</span>
        </template>
      </el-table-column>
    </el-table>
    <el-image-viewer v-if="dialogVisible" :on-close="onClose" :url-list="[dialogImageUrl]" />
  </div>
</template>

<script>
import { NumberSub, NumberAdd, NumberMul, NumberDiv } from "@/utils/index.js"
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name: 'ChooseDemandDetail',
  props: ['isExportRecord', 'value', 'type'],
  data() {
    return {
      dialogImageUrl: '',
      list: [],
      dialogVisible: false,
      radio: "1",
      arrivalAvailableMoney: "",
      income: "",
      invoicingAmount: ''
      // returnMoneyDeductionVoList: []
    }
  },
  components: { ElImageViewer },
  created() {
    this.list.forEach(item => {
      this.$set(item, 'money', "")
    })
  },
  methods: {
    invoicingAmountChange(invoicingAmount) {
      this.invoicingAmount = invoicingAmount
    },
    onload2(income) {
      this.income = income
    },
    onload(list = [], obj = {}) {
      this.list = list
      this.invoicingAmount = obj.invoicingAmount
      this.radio = obj && obj.customMoneyDeductionVoList && obj.customMoneyDeductionVoList.length > 0 ? '2' : '1'
    },
    incomeCahange(income) {
      this.income = income
    },
    onClose() {
      this.dialogVisible = false
    },
    ClickAllUsed(item) {
      this.$set(item, 'money', item.surplusNotInvoiced)
    },
    dialogClose() {
      this.$emit('input', false)
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
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.income || 0)))
        }
        if (index === 5) {
          sums[index] = this.$options.filters.toThousands(Number(NumberAdd(this.list.map(item => item.nowReceivableMoney || 0))))
        }
        if (index === 6) {
          if (this.type != 'showInfo') {
            sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.surplusNotInvoiced || 0)))
          } else {
            sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.alreadyInvoiceMoney || 0)))

          }
        }
        if (index === 7) {
          if (this.radio == 2) {
            sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.money || 0)))
          }
          if (this.type == 'showInfo') {
            sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.currentUsedInvoiceMoney || 0)))
          }
        }
        if (index === 8) {
          if (this.type == 'showInfo') {
            sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.surplusNotInvoiced || 0)))
          }
        }
        if (index === 9) {
          if (this.type == 'showInfo') {
            sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.alreadyReturnMoney || 0)))
          }
        }
        if (index === 10) {
          if (this.type == 'showInfo') {
            sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.surplusNotReturnMoney || 0)))
          }
        }
      });
      return sums;
    },
    commit() {
      this.$emit('radioChange', this.radio)
      if (this.radio == 2) {
        let list = []
        let isError1 = false
        let isError2 = false

        this.list.forEach(item => {
          list.push({ money: item.money, demandId: item.id })
        })
        if (NumberAdd(this.list.map(item => item.money)) > Number(this.invoicingAmount)) {
          this.$message.error("本次指定开票金额合计不能大于开票金额")
          return
        }

        if (Number(NumberAdd(this.list.map(item => item.money))) != Number(this.invoicingAmount)) {
          this.$message.error("本次指定开票金额合计必须等于开票金额")
          return
        }
        this.list.forEach(item => {
          if (item.money === '') {
            isError1 = true
          }
        })
        if (isError1) {
          this.$message.error("请输入本次指定使用金额")
          return
        }
        if (isError2) {
          this.$message.error("本次指定使用金额不能大于剩余未开票金额")
          return
        }
        list = list.map(item => {
          return {
            money: item.money || 0,
            demandId: item.demandId
          }
        })

        return list
      }
    }
  },
  computed: {
    newArr: function () {
      return JSON.parse(JSON.stringify(this.list))
    }
  },
  watch: {
    newArr: {
      handler: function (val, oldval) {

        // val.forEach(item => {
        //   if (Number(item.money) > Number(item.availableMoney)) {
        //     this.$message.error("本次指定使用金额不能大于剩余可用委托总额")
        //   }
        //   if (NumberAdd(val.map(item => item.money)) > Number(this.arrivalAvailableMoney)) {
        //     this.$message.error("本次指定使用金额不能大于到账可用金额")
        //   }
        // })

      },
      deep: true
    },
    "radio"(val) {
      this.$emit("radioChange", val)
      // if (val == 1) {
      //   this.list.forEach(item => {
      //     item.money = ""
      //   })
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  text-align: left;
  margin-left: 10px;
}
.radio-box {
  text-align: right;
  margin-right: 100px;
}
.demand-number {
  border-bottom: 1px solid #ebeef5;
  padding: 5px;
}
.explain-fields {
  &:after {
    display: inline-block;
    content: "";
    width: 14px;
    height: 14px;
    background: url("../../../../assets/img/字段解释.png") no-repeat;
    background-size: contain;
    vertical-align: middle;
    margin-left: 5px;
    cursor: pointer;
  }
}
::v-deep .el-table__footer-wrapper .el-table__footer tbody tr {
  font-weight: 700;
  background-color: #f4f8ff !important;
}
::v-deep .el-table__footer-wrapper tbody td.el-table__cell {
  background-color: #f4f8ff !important;
}
</style>