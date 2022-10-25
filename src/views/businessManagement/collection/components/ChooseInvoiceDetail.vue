<template>
  <div>
    <div class="radio-box">
      <el-tooltip effect="dark" content="系统扣减规则，系统顺序扣减每笔业务申请应收未开票金额" placement="top">
        <el-radio v-model="radio" label="1" class="explain-fields">系统扣减规则</el-radio>
      </el-tooltip>
      <el-tooltip effect="dark" content="可以自定义每笔业务申请应收未开票金额" placement="top">
        <el-radio v-model="radio" label="2" class="explain-fields">自定义规则</el-radio>
      </el-tooltip>
    </div>
    <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;" :span-method="businessType==0?objectSpanMethod : ()=>{}" :header-cell-style="{'background-color':'#F4F8FF'}" show-summary :summary-method="getSummaries">
      <el-table-column label="开票编号" align="left" width="220">
        <template slot-scope="scope">
          <span v-if="businessType==0">{{scope.row.invoiceNumber}}</span>
          <span v-if="businessType==1">{{scope.row.number  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主体" align="left" min-width="100">
        <template slot-scope="scope">
          <span v-if="businessType==0">{{scope.row.invoiceSubjectName}}</span>
          <span v-if="businessType==1">{{scope.row.subjectVoList  && scope.row.subjectVoList[0].abbreviated}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开票性质" align=" left" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.invoicinvoicingNature==0?'垫资回款':'不垫资到账'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联业务编号" align=" left" width="220" v-if="businessType==0">
        <template slot-scope="scope">
          <!-- <div v-for="item in scope.row.demandApprovalVoList" :key="item.id">
            {{item.number}}
          </div> -->
          <span>{{scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户" align="left" min-width="160">
        <template slot-scope="scope">
          <!-- <div v-for="item in scope.row.demandApprovalVoList" :key="item.id">
            <span>{{item.customerVo && item.customerVo.abbreviated}}</span>
          </div> -->
          <span>{{scope.row.customerVo && scope.row.customerVo.abbreviated}}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道" align="left" width="100">
        <template slot-scope="scope">
          <!-- <div v-for="item in scope.row.demandApprovalVoList" :key="item.id">
            <span>{{item.customerChannelVo && item.customerChannelVo.name}}</span>
          </div> -->
          <span>{{scope.row.customerChannelVo && scope.row.customerChannelVo.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="本次开票金额" prop="invoicingAmount" width="120" align="right">
        <template slot-scope="scope">
          <span v-if="businessType==0">{{scope.row.alreadyInvoiceMoney || 0 | toThousands}}</span>
          <span v-if="businessType==1">{{scope.row.invoicingAmount || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="未回款" prop="invoicingAmount" width="120" align="right">
        <template slot-scope="scope">
          <span v-if="businessType==0">{{scope.row.alreadyInvoiceMoney | toThousands}}</span>
          <span v-if="businessType==1">{{scope.row.invoicingAmount | toThousands}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="本次指定回款金额" v-if="radio==2" align="right" min-width="130">
        <template slot-scope="scope">
          <el-input v-model="scope.row.money" size="mini" clearable style="width:110px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
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
  props: ['isExportRecord', 'value', 'editId'],
  data() {
    return {
      dialogImageUrl: '',
      list: [],
      dialogVisible: false,
      radio: "1",
      amount: "",
      businessType: '',
      rowAndColumn: [],
      rowRoomColumn: [],
      pos: '',
      posT: '',
      form: {}
    }
  },
  components: { ElImageViewer },
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
      let c = 0
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          // 如果是第一条记录（即索引是0的时候），向数组中加入１
          self.rowAndColumn.push(1);
          self.pos = 0;
        } else {
          //data[i].typeDesc就是你从接口读取的字段信息，下同
          if (data[i].invoiceNumber === data[i - 1].invoiceNumber) {
            // 如果typeDesc相等就累加，并且push 0
            self.rowAndColumn[self.pos] += 1
            self.rowAndColumn.push(0)
          } else {
            // 不相等push 1
            self.rowAndColumn.push(1)
            self.pos = i;
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
    onload2(amount, businessType) {

      this.amount = amount
      this.businessType = businessType
    },
    onload(list = [], obj = {}) {
      if (this.businessType == 1) {
        this.list = list
      }
      else if (this.businessType == 0) {

        let list2 = list
        let list3 = []
        list2.forEach(item => {
          if (item.demandApprovalVoList && item.demandApprovalVoList.length > 0) {
            item.demandApprovalVoList.forEach(item1 => {
              item1.invoiceNumber = item.number
              item1.invoiceSubjectName = item.subjectVoList && item.subjectVoList[0].abbreviated
              item1.invoicinvoicingNature = item.invoicingNature
              item1.invoiceId = item.id
              list3.push(item1)
            })
          }
        })
        this.list = list3
        this.getListDataForRowAndColumn()
      }
    },
    onClose() {
      this.dialogVisible = false
    },
    ClickAllUsed(item) {
      if (this.businessType == 0) {
        this.$set(item, 'money', item.alreadyInvoiceMoney)
      }
      if (this.businessType == 1) {
        this.$set(item, 'money', item.invoicingAmount)
      }
    },

    dialogClose() {
      this.$emit('input', false)
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (this.businessType == 0) {
          if (index === 4) {
            sums[index] = '合计';
            return;
          }
          if (index === 6) {
            sums[index] = this.$options.filters.toThousands(Number(NumberAdd(this.list.map(item => item.alreadyInvoiceMoney || 0))))
          }
          if (this.radio == 2) {
            if (index === 7) {
              sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.money || 0)))
            }
          }
        }
        if (this.businessType == 1) {
          if (index === 4) {
            sums[index] = '合计';
            return;
          }
          if (index === 5) {
            sums[index] = this.$options.filters.toThousands(Number(NumberAdd(this.list.map(item => item.invoicingAmount || 0))))
          }
          if (this.radio == 2) {
            if (index === 6) {
              sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.money || 0)))
            }
          }
        }
      });
      return sums;
    },
    commit() {
      this.$emit('radioChange', this.radio)
      if (this.radio == 2) {
        if (this.businessType == 0) {
          let form = {}
          form.returnAmountDeductionDemandList = []
          form.returnAmountDeductionInvoiceList = []
          let isError1 = false
          let isError2 = false
          let newArray = this.list.reduce((total, cur, index) => {
            let hasValue = total.findIndex((current) => {
              return (
                current.invoiceId != null && current.invoiceId === cur.invoiceId
              );
            });
            hasValue === -1 && total.push(cur);
            hasValue !== -1 &&
              ((total[hasValue].totalMoney =
                NumberAdd([total[hasValue].money, cur.money]).toFixed(2))
              );
            return total;
          }, []);
          this.list.forEach(item => {
            form.returnAmountDeductionDemandList.push({ money: Number(item.money), demandId: item.id, invoiceId: item.invoiceId, returnMoneyId: this.editId })
          })
          newArray.forEach(item => {
            form.returnAmountDeductionInvoiceList.push({ money: Number(item.totalMoney || item.money), invoiceId: item.invoiceId, returnMoneyId: this.editId })
          })
          this.list.forEach(item => {

            if (item.money === '') {
              isError1 = true
            }
            if (Number(item.money) > Number(item.alreadyInvoiceMoney)) {
              this.$message.error("本次指定回款金额不能大于本次开票金额")
              return
            }
          })
          if (isError1) {
            this.$message.error("请输入本次指定回款金额")
            return
          }
          if (NumberAdd(this.list.map(item => item.money)) > Number(this.amount)) {
            this.$message.error("本次指定回款金额合计不能大于回款金额")
            return
          }
          if (Number(NumberAdd(this.list.map(item => item.money))) != Number(this.amount)) {
            this.$message.error("本次指定回款金额合计必须等于回款金额")
            return
          }

          return form
        }
        if (this.businessType == 1) {
          let form = {}
          form.returnAmountDeductionInvoiceList = []
          let list = []
          let isError1 = false
          let isError2 = false
          this.list.forEach(item => {
            form.returnAmountDeductionInvoiceList.push({ money: Number(item.money), invoiceId: item.id, returnMoneyId: this.editId })
          })

          if (NumberAdd(this.list.map(item => item.money)) > Number(this.amount)) {
            this.$message.error("本次指定回款金额合计不能大于回款金额")
            return
          }
          if (Number(NumberAdd(this.list.map(item => item.money))) != Number(this.amount)) {
            this.$message.error("本次指定回款金额合计必须等于回款金额")
            return
          }
          this.list.forEach(item => {
            if (item.money === '') {
              isError1 = true
            }
            if (Number(item.money) > Number(item.invoicingAmount)) {
              this.$message.error("本次指定使用金额不能大于本次开票金额")
              return
            }
          })
          if (isError1) {
            this.$message.error("请输入本次指定使用金额")
            return
          }
          return
          return form
        }
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