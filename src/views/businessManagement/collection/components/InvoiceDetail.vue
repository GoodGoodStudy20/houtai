<template>
  <div>
    <el-table stripe :key="Math.random()" :data="list" style="max-width: 100%;margin-top:15px;" :span-method="businessType==0 && !isNoApprove ? objectSpanMethod : ()=>{}" :header-cell-style="{'background-color':'#F4F8FF'}" show-summary :summary-method="getSummaries">
      <el-table-column label="开票编号" align="left" width="200">
        <template slot-scope="scope">
          <span v-if="businessType==0 && !isNoApprove">{{scope.row.invoiceNumber }}</span>
          <span v-if="businessType==1 || isNoApprove">{{scope.row.invoiceApprovalVo && scope.row.invoiceApprovalVo.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票主体" align="left" min-width="100" v-if="businessType==0 && !isNoApprove">
        <template slot-scope="scope">
          <span v-if="businessType==0">{{scope.row.subjectName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票性质" align=" left" width="100" v-if="businessType==0 && !isNoApprove">
        <template slot-scope="scope">
          <span>{{businessType==0?'垫资回款':'不垫资到账'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联业务编号" align=" left" width="200" v-if="businessType==0  && !isNoApprove">
        <template slot-scope="scope">
          <span>{{scope.row.demandApprovalVo && scope.row.demandApprovalVo.number}}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户" align="left">
        <template slot-scope="scope">
          <span v-if="businessType==0 && !isNoApprove">{{scope.row.demandApprovalVo && scope.row.demandApprovalVo.customerVo && scope.row.demandApprovalVo.customerVo.abbreviated}}</span>
          <span v-if="businessType==1 || isNoApprove">{{scope.row.invoiceApprovalVo && scope.row.invoiceApprovalVo.customerVo && scope.row.invoiceApprovalVo.customerVo.abbreviated}}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道" align="left" width="100">
        <template slot-scope="scope">
          <span v-if="businessType==0 && !isNoApprove">{{scope.row.demandApprovalVo && scope.row.demandApprovalVo.customerChannelVo && scope.row.demandApprovalVo.customerChannelVo.name }}</span>
          <span v-if="businessType==1 || isNoApprove">{{scope.row.invoiceApprovalVo && scope.row.invoiceApprovalVo.customerChannelVo && scope.row.invoiceApprovalVo.customerChannelVo.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票主体" align="left" min-width="100" v-if="businessType==1 || isNoApprove">
        <template slot-scope="scope">
          <span>{{scope.row.invoiceApprovalVo && scope.row.invoiceApprovalVo.subjectVoList && scope.row.invoiceApprovalVo.subjectVoList[0].abbreviated}}</span>
        </template>
      </el-table-column>
      <el-table-column label="委托经营所得" prop="invoicingAmount" min-width="95" align="right" v-if="businessType==0 && !isNoApprove">
        <template slot-scope="scope">
          <span>{{scope.row.demandApprovalVo && scope.row.demandApprovalVo.income  || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计回款时间" prop="invoicingAmount" min-width="95" align="right" v-if="businessType==0 && !isNoApprove">
        <template slot-scope="scope">
          <span>{{scope.row.demandApprovalVo && scope.row.demandApprovalVo.estimateArrivalDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前应收" prop="invoicingAmount" min-width="95" align="right" v-if="businessType==0 && !isNoApprove">
        <template slot-scope="scope">
          <span>{{scope.row.nowReceivableMoney  || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="本次开票金额" prop="invoicingAmount" min-width="95" align="right" v-if="businessType==0 && !isNoApprove">
        <template slot-scope="scope">
          <span>{{scope.row.demandApprovalVo && scope.row.demandApprovalVo.alreadyInvoiceMoney || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票金额" align="right" v-if="businessType==1 || isNoApprove">
        <template slot-scope="scope">
          <span>{{scope.row.invoiceApprovalVo && scope.row.invoiceApprovalVo.invoiceFileAmount || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="开票金额" align="right" v-if="businessType==0 && isNoApprove">
        <template slot-scope="scope">
          <span>{{scope.row.invoiceApprovalVo && scope.row.invoiceApprovalVo.invoiceFileAmount | toThousands}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="本次回款金额" min-width="95" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.usedMoney || 0 | toThousands}}</span>

        </template>
      </el-table-column>
      <el-table-column label="开票时间" align="left" v-if=" businessType==1 || isNoApprove">
        <template slot-scope="scope">
          <span>{{scope.row.invoiceApprovalVo && scope.row.invoiceApprovalVo.invoicingDate }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="开票时间" align="left" v-if="businessType==0 && isNoApprove">
        <template slot-scope="scope">
          <span>{{scope.row.invoiceApprovalVo && scope.row.invoiceApprovalVo.invoicingDate }}</span>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import { NumberSub, NumberAdd, NumberMul, NumberDiv } from "@/utils/index.js"
export default {
  name: 'InvoiceDetail',
  props: ['isExportRecord', 'value', 'editId', 'businessType'],
  data() {
    return {
      dialogImageUrl: '',
      list: [],
      dialogVisible: false,
      radio: "1",
      amount: "",
      rowAndColumn: [],
      rowRoomColumn: [],
      pos: '',
      posT: '',
      form: {},
      isNoApprove: false
    }
  },
  created() {
    this.list.forEach(item => {
      this.$set(item, 'money', "")
    })
  },
  methods: {
    getListDataForRowAndColumn() {
      let data = this.list
      let self = this;
      self.rowAndColumn = [];
      // self.rowRoomColumn = [];
      let c = 0
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          // 如果是第一条记录（即索引是0的时候），向数组中加入１
          self.rowAndColumn.push(1);
          self.pos = 0;
        } else {
          //data[i].typeDesc就是你从接口读取的字段信息，下同
          if (data[i].invoiceId === data[i - 1].invoiceId) {
            // 如果typeDesc相等就累加，并且push 0
            self.rowAndColumn[self.pos] += 1
            self.rowAndColumn.push(0)
          } else {
            // 不相等push 1
            self.rowAndColumn.push(1)
            self.pos = i;
            // self.rowRoomColumn.push(1)
            // self.posT = i
          }
        }
      }

    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let self = this
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
        if (self.rowAndColumn[rowIndex]) {
          let rowNum = self.rowAndColumn[rowIndex];
          return {
            rowspan: rowNum,
            colspan: rowNum > 0 ? 1 : 0
          }
        }
        return {
          rowspan: 0,
          colspan: 0
        }
      }

    },
    onload(list = [], obj = {}) {

      if (this.businessType == 0) {
        let list2 = []
        list.forEach(item => {
          // invoiceId
          item.availableMoneyRecordVoList.forEach(item1 => {
            item1.invoicingNature = item.invoiceApprovalVo && item.invoiceApprovalVo.invoicingNature
            // item1.invoiceId = item.invoiceId 
            item1.invoiceNumber = item.invoiceApprovalVo && item.invoiceApprovalVo.number
            item1.subjectName = item.invoiceApprovalVo && item.invoiceApprovalVo.subjectVoList && item.invoiceApprovalVo.subjectVoList[0].abbreviated
            if (item1.demandApprovalVo) {
              this.$set(item1, 'nowReceivableMoney', NumberAdd([item1.demandApprovalVo.interestMoney, item1.demandApprovalVo.surplusMoney]))
            }
            list2.push(item1)
          })
        })
        this.list = list2
        //兼容垫资业务未关联签报的旧数据
        if (list2 && list2.length == 0) {
          this.isNoApprove = true
          this.list = list
        }
        this.getListDataForRowAndColumn()
      }
      if (this.businessType == 1) {
        this.list = list
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (this.businessType == 0 && !this.isNoApprove) {
          if (index === 5) {
            sums[index] = '合计';
            return;
          }
          if (index === 6) {
            sums[index] = this.$options.filters.toThousands(Number(NumberAdd(this.list.map(item => item.demandApprovalVo && item.demandApprovalVo.income || 0))))
          }
          if (index === 8) {
            sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.nowReceivableMoney || 0)))
          }
          if (index === 9) {
            sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.demandApprovalVo && item.demandApprovalVo.alreadyInvoiceMoney || 0)))
          }
          if (index === 10) {
            sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.usedMoney || 0)))
          }
        }
        if (this.businessType == 1 || this.isNoApprove) {
          if (index === 3) {
            sums[index] = '合计';
            return;
          }
          if (index === 4) {
            sums[index] = this.$options.filters.toThousands(Number(NumberAdd(this.list.map(item => item.invoiceApprovalVo && item.invoiceApprovalVo.invoiceFileAmount || 0))))
          }
          if (index === 5) {
            sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.usedMoney || 0)))
          }
        }
      });
      return sums;
    },

  },
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