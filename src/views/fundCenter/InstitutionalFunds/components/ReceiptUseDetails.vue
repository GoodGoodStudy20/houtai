<template>
  <el-dialog :visible.sync="value" title="回单使用详情" :before-close="dialogClose" :close-on-click-modal="false" center width="80%" :lock-scroll="false" :modal-append-to-body="false">
    <el-table stripe show-summary border sum-text='合计' :summary-method="getSummaries" :data="returnMoneyApprovalList" max-height="500px" style="max-width: 100%;margin-top:15px;" :header-cell-style="{'background-color':'#F4F8FF'}">
      <!-- <el-table-column label="导入类型" prop="type" align="left"></el-table-column> -->
      <el-table-column label="回单编号" prop="number" width="210" align="left">
        <template slot-scope="scope">
          <span class="table-text" @click="openFile(scope.row)">{{scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column label="到账时间" prop="returnMoneyDate" width="100" align="left"></el-table-column>
      <el-table-column label="已到账金额" prop="amount" align="right" min-width="110">
        <template slot-scope="scope">
          <span>{{scope.row.amount || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="可用委托金额" prop="availableMoney" align="right" min-width="110">
        <template slot-scope="scope">
          <span>{{scope.row.availableMoney || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用签报号" width="220" align="left">
        <template slot-scope="scope">
          <div v-if="scope.row.availAbleMoneyRecordList && scope.row.availAbleMoneyRecordList.length>0">
            <div class="demand-number" v-for="(item,index) in scope.row.availAbleMoneyRecordList" :key="index">
              <!-- <span class="table-text" @click="Godemand(item)">{{item.number || '--'}}</span> -->
              <span>{{item.number}}</span>
            </div>
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column label="使用金额" align="right" min-width="110">
        <template slot-scope="scope">
          <div v-if="scope.row.availAbleMoneyRecordList && scope.row.availAbleMoneyRecordList.length>0">
            <div class="demand-number" v-for="(item,index) in scope.row.availAbleMoneyRecordList" :key="index">
              <span>{{item.usedMoney || 0 | toThousands}}</span>
            </div>
          </div>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="回单当时剩余金额（元）" align="right" min-width="110" v-if="false">
        <template slot-scope="scope">
          <div v-if="scope.row.availAbleMoneyRecordList && scope.row.availAbleMoneyRecordList.length>0">
            <div class="demand-number" v-for="(item,index) in scope.row.availAbleMoneyRecordList" :key="index">
              <span>{{item.surplusAvailableMoney || 0 | toThousands}}</span>
            </div>
          </div>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="回单剩余最终委托" prop="surplusAvailableMoney" align="right" min-width="125">
        <template slot-scope="scope">
          <span>{{scope.row.surplusAvailableMoney || 0 | toThousands}}</span>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">返回</el-button>
    </span>
    <el-image-viewer v-if="dialogVisible" :on-close="onClose" :url-list="[dialogImageUrl]" :zIndex='20060' />
  </el-dialog>
</template>

<script>
import { NumberSub, NumberAdd, NumberMul, NumberDiv } from "@/utils/index.js"
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name: 'ReceiptUseDetails',
  props: ['isExportRecord', 'value', 'returnMoneyApprovalList'],
  data() {
    return {
      dialogInfo: false,
      dialogVisible: false
    }
  },
  components: { ElImageViewer },
  created() {
    this.returnMoneyApprovalList.forEach(item => {
      if (item.availAbleMoneyRecordList.length == 0) {
        item.surplusAvailableMoney = item.availableMoney
      }
    })

  },
  methods: {
    Godemand(item) {
      sessionStorage.setItem('DemandId', item.demandId)
      sessionStorage.setItem('EditType', 'show')
      this.$router.push({
        path: '/approve/index',
        query: {
          id: item.demandId,
          editType: 'show',
          type: 0
          // state: item.state
        }
      })
      // this.$emit('returnApprove', item.demandId, 'show')
      // this.$emit('input', false)
    },
    dialogClose() {
      this.$emit('input', false)
    },
    onClose() {
      this.dialogVisible = false
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 2) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.returnMoneyApprovalList.map(item => item.amount)))
        }
        if (index === 3) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.returnMoneyApprovalList.map(item => item.availableMoney)))
        }
        if (index === 6) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.returnMoneyApprovalList.map(item => item.surplusAvailableMoney)))
        }
        if (index === 5) {
          let a = this.returnMoneyApprovalList.map(item => item.availAbleMoneyRecordList.map(item1 => item1.usedMoney))
          let c = []
          a.forEach((item, index) => {
            c.push(...item)
          })
          sums[index] = this.$options.filters.toThousands(NumberAdd(c))
        }
        // if (index === 5) {
        //   let a = this.returnMoneyApprovalList.map(item => item.availAbleMoneyRecordList.map(item1 => item1.surplusAvailableMoney))
        //   let c = []
        //   a.forEach((item, index) => {
        //     c.push(...item)
        //   })
        //   sums[index] = this.$options.filters.toThousands(NumberAdd(c))
        // }
      });

      return sums;
    },
    openFile(cInfo) {
      let fileList = JSON.parse(cInfo.arrivalReceiptFile);
      if (!fileList || fileList.length == 0) {
        this.$message.warning('文件丢失');
        return;
      }
      let fileItem = fileList[0];
      // this.dialogTableVisible = false
      if (fileItem instanceof Object) {
        if (fileItem.name.indexOf('.pdf') > -1) {
          window.open(fileItem.url)

        } else {
          this.dialogVisible = true
          this.dialogImageUrl = fileItem.url
          //this.handleClickItem()
        }
      } else {
        if (fileItem.indexOf('.pdf') > -1) {
          window.open(fileItem)
        } else {
          this.dialogVisible = true
          this.dialogImageUrl = fileItem
          //this.handleClickItem()
        }
      }
    },

  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  text-align: left;
  margin-left: 10px;
}
.demand-number {
  border-bottom: 1px solid #ebeef5;
  padding: 5px;
}
</style>