<template>
  <div>
    <el-button type="primary" @click="editDetail('', 'add')" size="small" v-if="!$attrs.disabled">新增</el-button>
    <div class="search-box">
      <el-form inline size="small">
        <el-form-item label="客户">
          <ChooseCustomer v-model="search.customerId" placeholder="请选择"></ChooseCustomer>
        </el-form-item>
        <el-form-item label="提交人">
          <ChooseUser v-model="search.createBy" placeholder="请选择"></ChooseUser>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="search.status" placeholder="全部" style="width:200px">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click="handleCurrentChange(1)">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column label="客户" align="left" show-overflow-tooltip min-width="200">
        <template slot-scope="scope">
          <!-- <el-tooltip effect="dark" :content="scope.row.customerName||scope.row.payerName||''" placement="bottom"> -->
          <span class="customer-text" @click="editDetail(scope.row.id, 'show')">{{ scope.row.customerVo.abbreviated ||
              '--'
          }}</span>
          <!-- </el-tooltip> -->
        </template>
      </el-table-column>
      <el-table-column label="渠道" align="left">
        <template slot-scope="scope" v-if="scope.row.customerChannelVo">
          <!-- <el-tooltip effect="dark" :content="scope.row.customerChannelVo.name ||'--'" placement="bottom"> -->
          <span>{{ scope.row.customerChannelVo.name || '--' }}</span>
          <!-- </el-tooltip> -->
        </template>
      </el-table-column>
      <el-table-column prop="receivableTotal" label="应收总额（元）" align="right" width="150">
        <template slot-scope="scope"><span>{{ scope.row.receivableTotal || 0 | toThousands}}</span></template>
      </el-table-column>
      <el-table-column label="已还款总额（元）" align="right" width="150">
        <template slot-scope="scope"><span>{{ scope.row.returnMoney || 0 | toThousands}}</span></template>
      </el-table-column>
      <el-table-column prop="surplusReceivableMoney" label="剩余应收总额（元）" align="right" width="150">
        <template slot-scope="scope"><span>{{ scope.row.surplusReceivableMoney || 0 | toThousands}}</span></template>
      </el-table-column>
      <el-table-column label="当前状态" align="center" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status == '0'">正常</span>
          <span v-if="scope.row.status == '1'">坏账</span>
        </template>
      </el-table-column>
      <el-table-column prop="createByName" label="提交人" align="left" width="140"></el-table-column>
      <el-table-column prop="createTime" align="left" label="提交时间" width="160"></el-table-column>
      <el-table-column align="left" label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="editDetail(scope.row.id, 'edit')">编辑</el-button>
          <el-button type="text" @click="setDisable(scope.row)">修改</el-button>
          <!-- v-if="scope.row.status==1 && scope.row.createBy==user.id" -->
          <el-button type="text" @click="deleteOne(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <p>剩余应收总额：{{ sumReceivableTotal }} 元</p>
    <div style="display:flex;justify-content:center">
      <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="search.pageSize" :current-page="search.pageNum" :total="total"></el-pagination>
      <el-button v-show="isShowExport" style="margin-top:10px;margin-left:50px" size="mini" type="primary" v-debounce="exportClick" :loading="loading">导出</el-button>
    </div>
  </div>
</template>

<script>
import { getHistoryReceivablePage, updateHistoryReceivableStatus, deleteHistoryReceivable } from '@/api/index'
import { Confirm } from '@/utils/common.js'
import { exportCommon, newExportsExcel } from '@/utils/index.js'
import ChooseCustomer from '@/components/ChooseCustomer/index.vue'
import ChooseUser from '@/components/ChooseUser/index.vue'
import { NumberAdd } from '@/utils/index.js'
// import { baseURL } from '@/api/http';
// import axios from "axios";
export default {
  name: 'historicalReceivables',
  components: { ChooseCustomer, ChooseUser },
  data() {
    return {
      activeName: "0",
      search: {
        pageNum: 1,          //页码
        pageSize: 10,
        isPage: 1,         //每页条数
        customerId: '',//      客户ID
        createBy: '',//         提交人ID
        search: '',//              搜索条件
        status: '',//              状态 0.审批 1.已处理 2.抄送
        // type: '',//              类型(0.需求审批,1.付款审批)
      },
      list: [],
      total: 0,
      statusList: [
        { value: 0, label: '正常' },
        { value: 1, label: '坏账' }
      ],
      sumReceivableTotal: 0,
      loading: false
    }
  },
  computed: {
    // totalMoney() {
    //   return NumberAdd(this.list.forEach(item => item.surplusReceivableMoney))
    // }
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
    this.getList()
    this.user = JSON.parse(sessionStorage.getItem('user'))
  },
  methods: {
    // exportClick() {
    //   exportCommon("/cii-system/historyReceivable/exportHistoryReceivableListExcel", this.search);
    // },
    exportClick() {
      this.loading = true
      var myDate = new Date();
      var Time1 = myDate.toLocaleDateString()//yyyy/MM/dd 这个方法如果是1月份，会显示yyyy/M/dd，默认把前面的0省略掉，有点坑，别的情况没尝试
      var Time2 = myDate.toISOString().slice(0, 10)//推荐 yyyy-MM-dd
      newExportsExcel('/cii-system/historyReceivable/exportHistoryReceivableListExcel', this.search).then(res => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        let url = URL.createObjectURL(blob);
        const link = document.createElement('a'); //创建a标签
        link.href = url;
        link.download = `历史应收列表-${Time2}`; //重命名文件
        link.click();
        URL.revokeObjectURL(url);
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    //删除应收历史记录
    deleteOne(id) {
      Confirm('确定删除该条应收历史记录吗?', () => {
        deleteHistoryReceivable({ id }).then(res => {
          if (res.code != 200) {
            this.$message.warning(res.msg || '删除失败')
            return
          }
          this.$message.success('删除成功')
          this.getList()
        })
      })
    },
    //撤销应收历史记录
    setDisable(row) {
      Confirm(`确定修改该应收历史记录状态吗?`, () => {
        updateHistoryReceivableStatus({ id: row.id }).then(res => {
          if (res.code != 200) {
            this.$message.warning(res.msg || '操作失败')
            return
          }
          this.$message.success('操作成功')
          this.getList()
        })
      })
    },
    getList() {
      getHistoryReceivablePage(this.search).then(res => {
        if (res.code != 200) return
        this.list = res.data.historyReceivableVoIPage.records || []
        this.sumReceivableTotal = res.data.sumReceivableTotal
        this.total = res.data.historyReceivableVoIPage.total
      })
    },
    handleSizeChange(val) {
      this.search.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.search.pageNum = val

      this.getList()
    },
    editDetail(id, type) {
      this.$emit('input', 1)
      this.$emit('edit', id, type)
    },
  }

}
</script>

<style lang='scss' scoped>
.customer-text {
  color: #0099ff;
  cursor: pointer;
}
</style>