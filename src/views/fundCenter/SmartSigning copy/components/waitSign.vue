<template>
  <div>
    <div class="tabs-container">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="待签约" name="0"></el-tab-pane>
        <!-- <el-tab-pane label="异常" name="1"></el-tab-pane> -->
      </el-tabs>
      <el-form inline size="small">
        <el-form-item label="">
          <el-input v-model="form.search" style="width:240px" placeholder="搜索客户名称、主体、项目">
            <el-button slot="append" icon="el-icon-search" @click="handleSearch">
            </el-button>
          </el-input>

        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click="SubmitApproval">提交审批</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;" :header-cell-style="{'background-color':'#F4F8FF'}" @selection-change="selectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="客户名称" align="left" show-overflow-tooltip width="200">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.abbreviated ||''" placement="top">
            <span class="customer-text">{{scope.row.abbreviated||'--'}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="推荐签约主体" width="180" align="left">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.suject ||'--'" placement="top">
            <span>{{scope.row.suject||'--'}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="receivableTotal" label="推荐可签约项目" align="left">
        <template slot-scope="scope">
          <div class="suject-tag">
            <el-tag v-for="i in 3" :key="i" type="success" style="margin-right:10px;margin-bottom:10px">广告印刷</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="开票额度(元)" align="right" width="150">
        <template slot-scope="scope"><span>{{scope.row.returnMoney || 0}}</span></template>
      </el-table-column>
      <el-table-column label="状态" align="left" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status=='0'">正常</span>
          <span v-if="scope.row.status=='1'">坏账</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="createByName" label="提交人" align="left" width="100"></el-table-column> -->
      <!-- <el-table-column prop="createByName" label="原因" v-if="type==1" align="left" width="140"></el-table-column> -->
      <el-table-column align="left" label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="Examine(scope.row.id,'edit')">审核</el-button>
          <el-button type="text" @click="Examine(scope.row.id,'show')">查看</el-button>
          <el-button type="text" v-if="false">下载模板</el-button>
          <el-button type="text" @click="GoSigning(scope.row.id,'add')">去签约</el-button>
          <!-- <el-button type="text" @click="setDisable(scope.row)">修改</el-button> -->
          <el-button type="text" v-if="false">重新提交</el-button>
          <el-button type="text" v-if="false">提交</el-button>
          <!-- v-if="scope.row.status==1 && scope.row.createBy==user.id" -->
          <el-button type="text" @click="deleteOne(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div style="display:flex;justify-content:center"> -->
    <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total"></el-pagination>
    <!-- <el-button style="margin-top:10px;margin-left:50px" size="mini" type="primary" @click="exportClick">导出</el-button> -->
    <!-- </div> -->
    <ExamineDialog v-model="isExamineDiaLogShow" :editType="editType" v-if="isExamineDiaLogShow" :isExamineDiaLogShow="isExamineDiaLogShow"></ExamineDialog>
  </div>
</template>

<script>
import { getCustomerPage, updateHistoryReceivableStatus, deleteHistoryReceivable } from '@/api/index'
import { Confirm } from '@/utils/common.js'
import { exportCommon } from '@/utils/index.js'
import ChooseCustomer from '@/components/ChooseCustomer/index.vue'
import ChooseUser from '@/components/ChooseUser/index.vue'
import ExamineDialog from "./ExamineDialog"
import { NumberAdd } from '@/utils/index.js'
export default {
  name: 'waitSign',
  components: { ChooseCustomer, ChooseUser, ExamineDialog },
  data() {
    return {
      activeName: "0",
      form: {
        pageNum: 1,          //页码
        pageSize: 10,
        isPage: 1,         //每页条数
        customerId: '',//      客户ID
        createBy: '',//         提交人ID
        search: '',//              搜索条件
        status: '',//              状态 0.审批 1.已处理 2.抄送
        // type: '',//              类型(0.需求审批,1.付款审批)
      },
      list: [
        {
          id: 1,
          abbreviated: '甜橙保代',
          suject: '共幸深圳',
        }
      ],
      total: 0,
      statusList: [
        { value: 0, label: '正常' },
        { value: 1, label: '坏账' }
      ],
      sumReceivableTotal: 0,
      isExamineDiaLogShow: false,
      multipleSelection: [],
      editType: '',
      isSubmitApproval: false
    }
  },
  // props: ['type'],
  created() {
    this.$nextTick(() => {
      this.getList()
    })

    this.user = JSON.parse(sessionStorage.getItem('user'))
    sessionStorage.setItem('list', JSON.stringify(this.list))
  },
  methods: {
    selectionChange(list = []) {
      this.multipleSelection = list
    },
    SubmitApproval() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.isSubmitApproval = true
        this.$emit('SubmitApproval', this.isSubmitApproval, this.multipleSelection)
      }
    },
    handleSearch() {
      if (this.form.search) {
        this.list = JSON.parse(sessionStorage.getItem('list'))
        this.list = this.list.filter(item => {
          return item.abbreviated.match(this.form.search.trim())
        })
      } else {
        this.list = JSON.parse(sessionStorage.getItem('list'))
      }
    },
    selectionChange(val) {
      this.multipleSelection = val
      // this.$emit('selectionChange', this.multipleSelection)
    },
    GoSigning(id, editType) {
      this.$router.push({
        path: '/basicManagement/contract',
        query: {
          id: id,
          editType: editType,
          // state: item.state
        }
      }
      )
    },
    Examine(id, editType) {
      this.isExamineDiaLogShow = true
      this.editType = editType
    },
    exportClick() {
      exportCommon("/cii-system/historyReceivable/exportHistoryReceivableListExcel", this.search);
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
      getCustomerPage(this.form).then(res => {
        if (res.code != 200) return
        this.list = res.data.records || []
        // this.sumReceivableTotal = res.data.sumReceivableTotal
        this.total = res.data.total
      })
    },
    handleSizeChange(val) {
      this.form.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.form.pageNum = val

      this.getList()
    },
    editDetail(id, type) {
      this.$emit('input', 1)
      this.$emit('edit', id, type)
    },
  },
  computed: {
    // totalMoney() {
    //   return NumberAdd(this.list.forEach(item => item.surplusReceivableMoney))
    // }
  }

}
</script>

<style lang='scss' scoped>
.customer-text {
  color: #0099ff;
  cursor: pointer;
}
.suject-tag {
  display: flex;
  flex-wrap: wrap;
}
.tabs-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>