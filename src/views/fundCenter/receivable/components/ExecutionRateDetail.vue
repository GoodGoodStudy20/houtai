<template>
  <div>
    <div class="top-title">
      <div class="title-item table-text" v-for="item in path4" :key="item.id" @click="toClick(item)"><img src="@/assets/img/left.png" alt=""><span>{{item.name}}</span></div>
    </div>
    <el-table stripe :data="list" show-summary :span-method="objectSpanMethod" :summary-method="getSummaries" :header-cell-style="{ 'background-color': '#F4F8FF' }" style="max-width: 100%;margin-top:15px;">
      <el-table-column label="机构" min-width="160" prop="number" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.customerName ||
                '-'
            }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道" prop="channelName" align="left" min-width="120"></el-table-column>
      <el-table-column label="业务编码" prop="number" align="left" min-width="220">
        <template slot-scope="scope">
          <span class="table-text" @click="gotoApprove(scope.row.demandId, 'show','0')">{{ scope.row.number ||
                '-'
            }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到期日" prop="estimateArrivalDate" align="left" min-width="100"></el-table-column>
      <el-table-column label="当期应收" min-width="120" prop="currentReceivable" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.currentReceivable || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="按期应收" min-width="120" prop="onScheduleReceivable" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.onScheduleReceivable || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="逾期应收" min-width="120" prop="beOverdueReceivable" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.beOverdueReceivable || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已回款" align="center">
        <el-table-column label="逾期回款" min-width="110" align="right">
          <template slot-scope="scope">
            <el-popover placement="right" width="250" trigger="click" v-if="scope.row.beOverdueReturnMoney!=0">
              <el-table :data="scope.row.beOverdueReturnMoneyList">
                <el-table-column width="150" prop="returnMoneyDate" label="回款日期">
                </el-table-column>
                <el-table-column width="100" prop="beOverdueReturnMoney" label="回款金额">
                  <template slot-scope="scope1">
                    {{scope1.row.beOverdueReturnMoney || 0 | toThousands}}
                  </template>
                </el-table-column>
              </el-table>
              <span slot="reference" class="table-text">{{scope.row.beOverdueReturnMoney || 0 | toThousands}}</span>
            </el-popover>
            <span v-else class="table-text">{{scope.row.beOverdueReturnMoney || 0 | toThousands}}</span>
            <!-- {{ scope.row.type == 1 ? 0 : scope.row.surplusMoney }} -->
          </template>
        </el-table-column>
        <el-table-column label="按期回款" min-width="110" align="right">

          <template slot-scope="scope">
            <el-popover placement="right" width="250" trigger="click" v-if="scope.row.onScheduleReturnMoney!=0">
              <el-table :data="scope.row.onScheduleReturnMoneyList">
                <el-table-column width="150" prop="returnMoneyDate" label="回款日期"></el-table-column>
                <el-table-column width="100" prop="name" label="回款金额">
                  <template slot-scope="scope1">
                    {{scope1.row.onScheduleReturnMoney || 0 | toThousands}}
                  </template>
                </el-table-column>
              </el-table>
              <span slot="reference" class="table-text">{{scope.row.onScheduleReturnMoney || 0 | toThousands}}</span>
            </el-popover>
            <span v-else class="table-text">{{scope.row.onScheduleReturnMoney || 0 | toThousands}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="应收执行率" align="right">
        <template slot-scope="scope">
          {{ scope.row.rate }}%
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getReceivableRateList, getReceivableInfo } from '@/api/index.js'
import { exportCommon, newExportsExcel, NumberAdd } from '@/utils/index.js'
export default {
  name: 'ExecutionRateDetail',
  data() {
    return {
      form: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
      },
      list: [],
      total: 0,
      loading: false,
      path4: [],
      gridData: [],
      companyId: '',
      date: '',
      rowAndColumn: [],
      rowRoomColumn: [],
      pos: '',
      posT: '',
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
    if (sessionStorage.getItem('path4')) {
      this.path4 = JSON.parse(sessionStorage.getItem('path4'))
    }
    if (this.$route.query.companyId) {
      this.companyId = this.$route.query.companyId
    }
    if (this.$route.query.date) {
      this.date = this.$route.query.date
    }
    // this.getTopSum()
    this.getList()
  },
  methods: {
    getListDataForRowAndColumn() {
      let data = this.list
      let self = this;
      self.rowAndColumn = [];
      self.rowRoomColumn = [];
      let c = 0
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          // 如果是第一条记录（即索引是0的时候），向数组中加入１
          self.rowAndColumn.push(1);
          self.rowRoomColumn.push(1)
          self.pos = 0;
          self.posT = 0;
        } else {
          //data[i].typeDesc就是你从接口读取的字段信息，下同
          if (data[i].customerName === data[i - 1].customerName) {
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
          if (data[i].channelName === data[i - 1].channelName) {
            // 如果typeDesc相等就累加，并且push 0
            self.rowRoomColumn[self.posT] += 1
            self.rowRoomColumn.push(0)
          } else {
            // 不相等push 1
            self.rowRoomColumn.push(1)
            self.posT = i;
            // self.rowRoomColumn.push(1)
            // self.posT = i
          }
        }
      }

    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let self = this
      if (columnIndex === 0) {
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
      if (columnIndex === 1) {
        if (self.rowRoomColumn[rowIndex]) {
          let rowNum = self.rowRoomColumn[rowIndex];
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
    getSummaries(param) {
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 2) {
          sums[index] = "合计";
          return;
        }
        if (index === 4) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.currentReceivable || 0)));
        }
        if (index === 5) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.onScheduleReceivable || 0)));
        }
        if (index === 6) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.beOverdueReceivable || 0)));
        }
        if (index === 7) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.beOverdueReturnMoney || 0)));
        }
        if (index === 8) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.onScheduleReturnMoney || 0)));
        }
        if (index === 9) {
          sums[index] = `${(NumberAdd(this.list.map((item) => item.rate)) / this.list.length).toFixed(2)}%`
        }
      });
      return sums;
    },
    toClick(item) {
      sessionStorage.removeItem('path4')
      this.$router.push({ path: item.path })
    },

    getList() {
      let data = { estimateArrivalDate: this.date, companyId: this.companyId }
      getReceivableRateList(data).then(res => {
        if (res.code != 200) return
        this.list = res.data
        this.getListDataForRowAndColumn()
        // this.total = res.data.total
      })
    },
    exportClick() {
      let param = {
        customerId: this.editId,
        channelId: this.channelId,
        agentId: this.agentId
      }
      this.loading = true
      // exportCommon("/cii-system/demandMoneyFlowRecord/exportReceivableInfoListExcel", param);
      var myDate = new Date();
      var Time1 = myDate.toLocaleDateString()//yyyy/MM/dd 这个方法如果是1月份，会显示yyyy/M/dd，默认把前面的0省略掉，有点坑，别的情况没尝试
      var Time2 = myDate.toISOString().slice(0, 10)//推荐 yyyy-MM-dd
      newExportsExcel('/cii-system/demandMoneyFlowRecord/exportReceivableInfoListExcel', param).then(res => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        let url = URL.createObjectURL(blob);
        const link = document.createElement('a'); //创建a标签
        link.href = url;
        link.download = `应收账款中心详情列表-${Time2}`; //重命名文件
        link.click();
        URL.revokeObjectURL(url);
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    gotoApprove(id, editType, type) {
      if (id) {
        this.$router.push({
          path: '/approve/index',
          query: {
            id: id,
            editType: editType,
            type: type,
            // state: item.state
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
.top-title {
  display: flex;
  .title-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-right: 5px;
    img {
      width: 19px;
      height: 19px;
      margin-top: 2px;
    }
  }
  .title-item:before {
    display: inline-block;
    content: "<";
    margin-right: 5px;
  }
  // .title-item:first-child:before {
  //   display: inline-block;
  //   content: "";
  // }
}
::v-deep .el-table__footer-wrapper .el-table__footer tbody tr {
  font-weight: 700;
  background-color: #f4f8ff !important;
}
::v-deep .el-table__footer-wrapper tbody td.el-table__cell {
  background-color: #f4f8ff !important;
}
</style>