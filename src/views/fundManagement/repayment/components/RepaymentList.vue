<template>
  <div>
    <el-button type="primary" @click="editDetail('', 'add')" size="small">新增</el-button>
    <div class="search-box">
      <el-form inline size="small">
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择" style="width:150px">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,i) in status" :key="item" :label="item" :value="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资方">
          <ChooseCapital v-model="form.backersId" style="width:200px" showAll></ChooseCapital>
        </el-form-item>
        <el-form-item label="主体">
          <ChooseSubject v-model="form.subjectId" placeholder="请选择" style="width:200px" showAll></ChooseSubject>
        </el-form-item>
        <!-- <el-form-item label="还款时间">
          <el-date-picker v-model="form.repaymentStartDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:150px"></el-date-picker> 至
          <el-date-picker v-model="form.repaymentEndDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:150px"></el-date-picker>
        </el-form-item> -->
        <el-form-item label="还款时间">
          <el-date-picker v-model="form.submitTime" @change="changeTime" value-format="yyyy-MM-dd" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column label="资方" align="center" show-overflow-tooltip width="250px">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.backersVo?scope.row.backersVo.name:''" placement="bottom">
            <span class="table-text" @click="editDetail(scope.row.id, 'show')">{{scope.row.backersVo?scope.row.backersVo.abbreviated:''}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="主体" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.subjectVo?scope.row.subjectVo.name:''" placement="bottom">
            <span>{{scope.row.subjectVo?scope.row.subjectVo.abbreviated:''}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="还款金额" prop="repaymentMoney" align="center" width="160"></el-table-column>
      <el-table-column label="还款时间" prop="repaymentDate" align="center" width="120"></el-table-column>
      <el-table-column label="状态" align="center" width="120">
        <template slot-scope="scope">
          {{status[scope.row.status]}}
        </template>
      </el-table-column>
      <el-table-column label="提交人" prop="createByName" align="center" width="120"></el-table-column>
      <el-table-column prop="createTime" align="center" label="提交时间" width="160"></el-table-column>
      <el-table-column align="center" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="editDetail(scope.row.id,'edit')">编辑</el-button>
          <el-button type="text" icon="el-icon-remove-outline" @click="setDisable(scope.row)">{{!scope.row.status ? '撤销' : '恢复'}}</el-button>
          <el-button type="text" icon="el-icon-delete" style="color:red" @click="deleteOne(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total"></el-pagination>

  </div>
</template>

<script>
import ChooseCapital from '@/components/ChooseCapital/index.vue'
import ChooseSubject from '@/components/ChooseSubject/index.vue'
import { ApprovalStatus } from '@/utils/field.js'
import { deleteRepayment, getRepaymentPage, updateStatusRepayment } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'RepaymentList',
  components: { ChooseCapital, ChooseSubject },
  props: ['value'],
  data() {
    return {
      form: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
        status: '',
        backersId: '',
        subjectId: '',
        repaymentEndDate: '',
        repaymentStartDate: '',
        submitTime: ''
      },
      list: [],
      total: 0,
      ApprovalStatus: ApprovalStatus,
      options1: ['增值税专用发票', '增值税普通发票'],
      options2: ['纸质', '电子'],
      status: ['正常', '撤销'],
      user: {},
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
      },
    }
  },
  created() {
    this.getList()
    this.user = JSON.parse(sessionStorage.getItem('user'))
  },
  methods: {
    changeTime() {
      if (this.form.submitTime) {
        this.form.repaymentStartDate = this.form.submitTime[0] || ''
        this.form.repaymentEndDate = this.form.submitTime[1] || ''
      } else {
        this.form.repaymentStartDate = ''
        this.form.repaymentEndDate = ''
      }
    },
    getList() {
      getRepaymentPage(this.form).then(res => {
        if (res.code != 200) return
        this.list = res.data.records
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
    deleteOne(id) {
      Confirm('确定删除该还款吗?', () => {
        deleteRepayment({ id }).then(res => {
          if (res.code != 200) {
            this.$message.warning(res.msg || '删除失败')
            return
          }
          this.$message.success('删除成功')
          this.getList()
        })
      })
    },
    setDisable(row) {
      Confirm(`确定${!row.status ? '撤销' : '恢复'}该还款吗?`, () => {
        updateStatusRepayment({ id: row.id }).then(res => {
          if (res.code != 200) {
            this.$message.warning(res.msg || '操作失败')
            return
          }
          this.$message.success('操作成功')
          this.getList()
        })
      })
    },
  }
}
</script>

<style>
</style>