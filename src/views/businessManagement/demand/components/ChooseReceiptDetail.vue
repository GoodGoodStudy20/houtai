<template>
  <div>
    <div class="radio-box">
      <el-tooltip effect="dark" content="系统规则扣款，不可以自定义使用每张回单剩余可用金额" placement="top">
        <el-radio v-model="radio" label="1" class="explain-fields">系统自动扣款</el-radio>
      </el-tooltip>
      <el-tooltip effect="dark" content="可对每张回单剩余可用委托金额进行自定义使用" placement="top">
        <el-radio v-model="radio" label="2" class="explain-fields">自定义扣款</el-radio>
      </el-tooltip>
    </div>
    <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;" :header-cell-style="{'background-color':'#F4F8FF'}" show-summary :summary-method="getSummaries">
      <el-table-column label="回单编号" prop="number" align="left" width="220"></el-table-column>
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
      <el-table-column label="到账时间" prop="returnMoneyDate" width="100" align="left"></el-table-column>
      <el-table-column label="到账金额" prop="amount" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.amount || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余可用委托总额" prop="availableMoney" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.availableMoney || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="本次指定使用金额" v-if="radio==2" align="right">
        <template slot-scope="scope">
          <el-input v-model="scope.row.money" size="mini" clearable style="width:100px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="回单文件" width="100" align="center">
        <template slot-scope="scope">
          <span class="table-text" @click="openFile(scope.row)">查看</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="100" v-if="radio==2">
        <template slot-scope="scope">
          <span class="table-text" style="margin-right:10px" @click="ClickAllUsed(scope.row)">全部使用</span>
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
  name: 'ChooseReceiptDetail',
  props: ['isExportRecord', 'value', 'returnMoneyApprovalList'],
  data() {
    return {
      dialogImageUrl: '',
      list: [],
      dialogVisible: false,
      radio: "1",
      arrivalAvailableMoney: "",
      income: "",
    }
  },
  components: { ElImageViewer },
  created() {
    this.list.forEach(item => {
      this.$set(item, 'money', "")
    })
  },
  methods: {
    onload2(income) {
      this.income = income
    },
    onload(list = [], arrivalAvailableMoney, obj = {}) {
      this.list = list
      this.arrivalAvailableMoney = arrivalAvailableMoney
      this.radio = obj && obj.returnMoneyDeductionVoList && obj.returnMoneyDeductionVoList.length > 0 ? '2' : '1'
    },
    incomeCahange(income) {
      this.income = income
    },
    onClose() {
      this.dialogVisible = false
    },
    ClickAllUsed(item) {
      this.$set(item, 'money', item.availableMoney)
    },
    UsedMoneyChange() {

      this.list.forEach(item => {
        if (Number(item.money) > Number(this.arrivalAvailableMoney)) {
          this.$message.error("本次指定使用金额不能大于到账可用金额")
        }
        if (Number(item.money) > Number(item.availableMoney)) {
          this.$message.error("本次指定使用金额不能大于剩余可用委托总额")
        }
      })
    },
    openFile(cInfo) {//查看回单文件
      let fileList = JSON.parse(cInfo.arrivalReceiptFile);
      if (!fileList || fileList.length == 0) {
        this.$message.warning('文件丢失');
        return;
      }
      let fileItem = fileList[0];
      if (fileItem instanceof Object) {
        if (fileItem.name.indexOf('.pdf') > -1) {
          window.open(fileItem.url)
        } else {
          this.dialogVisible = true
          this.dialogImageUrl = fileItem.url
        }
      } else {
        if (fileItem.indexOf('.pdf') > -1) {
          window.open(fileItem)
        } else {
          this.dialogVisible = true
          this.dialogImageUrl = fileItem
        }
      }


    },
    dialogClose() {
      this.$emit('input', false)
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计';
          return;
        }
        if (index === 4) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.amount || 0)))
        }
        if (index === 5) {
          sums[index] = this.$options.filters.toThousands(Number(NumberAdd(this.list.map(item => item.availableMoney || 0))))
        }
        if (index === 6 && this.radio == 2) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map(item => item.money || 0)))
        }

      });
      return sums;
    },
    commit() {
      if (this.radio == 2) {

        let list = []
        let isError1 = false
        let isError2 = false
        this.list.forEach(item => {
          list.push({ money: item.money, returnMoneyId: item.id })
        })
        if (NumberAdd(this.list.map(item => item.money)) > Number(this.arrivalAvailableMoney)) {
          this.$message.error("本次指定使用金额不能大于到账可用金额")
          return
        }
        // if (Number(NumberAdd(this.list.map(item => item.money))) != Number(this.income)) {
        //   this.$message.error("本次指定使用金额合计必须等于委托经营所得")
        //   return
        // }
        this.list.forEach(item => {
          if (item.money === '') {
            isError1 = true
          }
          if (Number(item.money) > Number(item.availableMoney)) {
            this.$message.error("本次指定使用金额不能大于剩余可用委托总额")
            return
          }
        })
        if (isError1) {
          this.$message.error("请输入本次指定使用金额")
          return
        }
        list = list.map(item => {
          return {
            money: item.money || 0,
            returnMoneyId: item.returnMoneyId
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
        val.forEach(item => {
          if (Number(item.money) > Number(item.availableMoney)) {
            this.$message.error("本次指定使用金额不能大于剩余可用委托总额")
          }
        })
        if (NumberAdd(val.map(item => item.money)) > Number(this.arrivalAvailableMoney)) {
          this.$message.error("本次指定使用金额不能大于到账可用金额")
        }
      },
      deep: true
    },
    "radio"(val) {
      this.$emit("radioChange", val)
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