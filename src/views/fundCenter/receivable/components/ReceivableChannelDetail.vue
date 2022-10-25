<template>
  <div>
    <div>
      <div class="top-title">
        <div class="title-item table-text" v-for="item in path1" :key="item.id" @click="toClick(item)"><img src="@/assets/img/left.png" alt=""><span>{{item.name}}</span></div>
      </div>
      <el-table stripe :data="list" show-summary :summary-method="getSummaries" :header-cell-style="{ 'background-color': '#F4F8FF' }" style="max-width: 100%;margin-top:15px;">
        <!-- <el-table-column type="index" align="center" label="序号" width="50"></el-table-column> -->
        <el-table-column label="渠道" prop="loanAmount" align="left">
          <template slot-scope="scope">
            <span class="table-text" @click="scope.row.number==''?'':toDemand(scope.row.channelId,scope.row.customerId,scope.row.channelName)">{{ scope.row.channelName }} </span>
          </template>
        </el-table-column>
        <el-table-column label="应收总额" width="120" prop="totalReceivable" align="right">
          <template slot="header" slot-scope="">
            <el-tooltip effect="dark" placement="top">
              <div slot="content">应收总额：指截止到当月产生的所有应<br />收总额，包含按期应收、逾期应收、未<br />到期应收。</div>
              <span class="explain-fields">应收总额</span>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.totalReceivable || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="当期应收" width="120" prop="currentReceivable" align="right">
          <template slot="header" slot-scope="">
            <el-tooltip effect="dark" placement="top">
              <div slot="content">当期应收：指当月应收的金额，<br />包含按期应收、逾期应收。</div>
              <span class="explain-fields">当期应收</span>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.currentReceivable || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="应收笔数" width="100" prop="receivableQuantity" align="center"></el-table-column>
        <el-table-column label="按期应收" width="120" prop="onScheduleReceivable" align="right">
          <template slot="header" slot-scope="">
            <el-tooltip effect="dark" content="按期应收：指当月到期的应收金额。" placement="top">
              <span class="explain-fields">按期应收</span>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.onScheduleReceivable || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="逾期应收" width="120" prop="beOverdueReceivable" align="right">
          <template slot="header" slot-scope="">
            <el-tooltip effect="dark" content="逾期应收：指当月逾期的应收金额。" placement="top">
              <span class="explain-fields">逾期应收</span>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.beOverdueReceivable || 0 | toThousands }}</span>
          </template>
        </el-table-column>
        <el-table-column label="未到期应收" align="right">
          <template slot-scope="scope">
            {{scope.row.unexpiredReceivable || 0 | toThousands}}
          </template>
        </el-table-column>
        <el-table-column label="当前剩余应收" align="right">
          <template slot-scope="scope">
            {{ scope.row.currentSurplusReceivable || 0 | toThousands}}
          </template>
        </el-table-column>
        <el-table-column label="剩余总应收" align="right">
          <template slot-scope="scope">
            {{ scope.row.totalSurplusReceivable || 0 | toThousands}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getReceivableChannelInfo } from '@/api/index.js'
import { exportCommon, newExportsExcel, NumberAdd } from '@/utils/index.js'
export default {
  name: 'ReceivableChannelDetail',
  data() {
    return {
      form: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
      },
      list: [],
      loading: false,
      customerId: '',
      date: ''
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
    if (sessionStorage.getItem('path1')) {
      this.path1 = JSON.parse(sessionStorage.getItem('path1'))
    }
    if (this.$route.query.customerId) {
      this.customerId = this.$route.query.customerId
    }
    if (this.$route.query.date) {
      this.date = this.$route.query.date
    }
    // this.getTopSum()
    this.getList()
  },
  methods: {
    getSummaries(param) {
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 1) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.totalReceivable || 0)));
        }
        if (index === 2) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.currentReceivable || 0)));
        }
        if (index === 3) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.receivableQuantity || 0)));
        }
        if (index === 4) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.onScheduleReceivable || 0)));
        }
        if (index === 5) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.beOverdueReceivable || 0)));
        }
        if (index === 6) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.unexpiredReceivable || 0)));
        }
        if (index === 7) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.currentSurplusReceivable || 0)));
        }
        if (index === 8) {
          sums[index] = this.$options.filters.toThousands(NumberAdd(this.list.map((item) => item.totalSurplusReceivable || 0)));
        }
      });
      return sums;
    },
    toClick(item) {
      if (item.routerLevel == 1) {
        sessionStorage.removeItem('path1')
        this.$router.push({ path: item.path })
      } else {
        let b = JSON.parse(sessionStorage.getItem('path1'))
        let c = b.filter(it => it.routerLevel < item.routerLevel)
        sessionStorage.setItem('path1', JSON.stringify(c))
        const { date, customerId, companyId } = item
        this.$router.push({ path: item.path, query: { date, customerId, companyId } })
      }
    },
    toDemand(channelId, customerId, channelName) {
      if (sessionStorage.getItem('path1')) {
        let a = [
          {
            channelId,
            name: channelName,
            routerLevel: 3,
            path: '/fundCenter/ReceivableChannelDetail',
            date: this.date,
            customerId
          }
        ]
        let b = JSON.parse(sessionStorage.getItem('path1'))
        b = b.concat(a)
        this.$router.push({ path: '/fundCenter/ReceivableDemandDetail', query: { channelId, customerId, date: this.date } })
        sessionStorage.setItem('path1', JSON.stringify(b))
        // this.path1 = JSON.parse(sessionStorage.getItem('path1'))
      }
      // /fundCenter/ReceivableChannelDetail
      // this.isReceivableDemandDetailShow = true
    },
    getList() {
      let data = { estimateArrivalDate: this.date, customerId: this.customerId }
      getReceivableChannelInfo(data).then(res => {
        if (res.code != 200) return
        this.list = res.data
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
</script>

<style lang="scss" scoped>
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
}
::v-deep .el-table__footer-wrapper .el-table__footer tbody tr {
  font-weight: 700;
  background-color: #f4f8ff !important;
}
::v-deep .el-table__footer-wrapper tbody td.el-table__cell {
  background-color: #f4f8ff !important;
}
</style>