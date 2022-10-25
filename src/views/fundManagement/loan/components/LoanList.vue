<template>
  <div>
    <div class="top">
      <div class="top-title">
        <div class="title-item table-text" @click="toClick"><img src="@/assets/img/left.png" alt=""><span>返回</span></div>
      </div>
      <el-button type="primary" @click="editDetail('', 'add')" size="small">新增</el-button>
    </div>

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
        <!-- <el-form-item label="放款时间">
          <el-date-picker v-model="form.loanStartDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:150px"></el-date-picker> 至
          <el-date-picker v-model="form.loanEndDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:150px"></el-date-picker>
        </el-form-item> -->
        <el-form-item label="放款时间">
          <el-date-picker v-model="form.submitTime" style="width:220px" @change="changeTime" value-format="yyyy-MM-dd" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否近期到期">
          <el-select v-model="form.isExpire" placeholder="请选择" style="width:150px">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe :data="list" show-summary :summary-method="getSummaries" style="max-width: 100%;margin-top:15px;">
      <el-table-column type="index" align="center" label="序号" width="80"></el-table-column>
      <el-table-column label="资方" align="left" show-overflow-tooltip width="180px">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.backersVo?scope.row.backersVo.name:''" placement="bottom">
            <span class="table-text" @click="editDetail(scope.row.id, 'show')">{{scope.row.backersVo?scope.row.backersVo.abbreviated:''}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="主体" align="left" show-overflow-tooltip width="150px">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.subjectVo?scope.row.subjectVo.name:''" placement="bottom">
            <span>{{scope.row.subjectVo?scope.row.subjectVo.abbreviated:''}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="放款金额" prop="loanMoney" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.loanMoney || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="放款利息" prop="loanInterest" align="right"></el-table-column>
      <el-table-column label="待还本金" prop="surplusMoney" align="right" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.surplusMoney || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="待还利息" prop="surplusInterest" width="120" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.surplusInterest || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="待还担保费（元）" prop="surplusGuaranteeMoney" width="120" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.surplusGuaranteeMoney || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="放款时间" prop="loanDate" align="left" width="120"></el-table-column>
      <el-table-column label="放款期限" prop="loanTerm" align="left" width="220">
        <template slot-scope="scope">
          <span>{{scope.row.loanStartTerm}} 至 {{scope.row.loanEndTerm}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="left">
        <template slot-scope="scope">
          <el-tag @click="editDetail(scope.row.id, 'show')" size="mini" :style="{'background-color':scope.row.status==0?'#FFF5EB':'#EBF2FF','border-color':scope.row.status==0?'#FFA439':'#3A7DFF','cursor':'pointer'}">
            <span :style="{color:scope.row.status==0?'#FFA439':'#3A7DFF'}">{{status[scope.row.status]}}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提交人" prop="createByName" align="left"></el-table-column>
      <el-table-column prop="createTime" align="left" label="提交时间" width="160"></el-table-column>
      <el-table-column align="left" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" v-if="scope.row.status !=1" @click="editDetail(scope.row.id,'edit')">编辑</el-button>
          <!-- <el-button type="text" icon="el-icon-remove-outline" @click="setDisable(scope.row)">{{!scope.row.status ? '撤销' : '恢复'}}</el-button> -->
          <el-button type="text" icon="el-icon-delete" style="color:red" v-if="scope.row.status !=1" @click="deleteOne(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="surplus-footer">

      <div class="surplus-item" v-if="surplusRepaymentMoney">
        <p>待还总额：</p>
        <p class="surplus"><span class="surplus-left">￥</span>{{surplusRepaymentMoney || 0 | toThousands}}</p>
      </div>
    </div>
    <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total"></el-pagination>

  </div>
</template>

<script>
import ChooseCapital from '@/components/ChooseCapital/index.vue'
import ChooseSubject from '@/components/ChooseSubject/index.vue'
import { BusinessType, ApprovalStatus } from '@/utils/field.js'
import { deleteLoan, getLoanPage, updateStatusLoan, getLoanStatistics } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'LoanList',
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
        loanEndDate: '',
        loanStartDate: '',
        submitTime: '',
        isExpire: ''
      },
      list: [],
      total: 0,
      ApprovalStatus: ApprovalStatus,
      options1: ['增值税专用发票', '增值税普通发票'],
      options2: ['纸质', '电子'],
      status: ['还款中', '已还款'],
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
      surplusMoney: '',//剩余本金
      surplusRepaymentMoney: '',//剩余金额
      surplusGuaranteeMoney: '',//剩余担保费
      surplusInterest: ''//剩余利息
    }
  },
  // created() {
  //   this.getList()

  // },
  mounted() {
    this.user = JSON.parse(sessionStorage.getItem('user'))
    if (this.$route.query.isExpire == 1) {
      this.form.isExpire = 1
    }
    this.getList()
  },
  methods: {
    toClick() {
      this.$router.go(-1)
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '待还金额';
          return;
        }
        if (index === 5) {
          sums[index] = this.$options.filters.toThousands(Number(this.surplusMoney))
        }
        if (index === 6) {
          sums[index] = this.$options.filters.toThousands(Number(this.surplusInterest))
        }
        if (index === 7) {
          sums[index] = this.$options.filters.toThousands(Number(this.surplusGuaranteeMoney))
        }
      });
      return sums;
    },
    changeTime() {
      if (this.form.submitTime) {
        this.form.loanStartDate = this.form.submitTime[0] || ''
        this.form.loanEndDate = this.form.submitTime[1] || ''
      } else {
        this.form.loanStartDate = ''
        this.form.loanEndDate = ''
      }
    },
    getList(params) {
      getLoanPage({ ...this.form, ...params }).then(res => {
        if (res.code != 200) return
        this.list = res.data.loanVoIPage.records
        this.total = res.data.loanVoIPage.total
        this.surplusMoney = res.data.surplusMoney
        this.surplusRepaymentMoney = res.data.surplusRepaymentMoney
        this.surplusGuaranteeMoney = res.data.surplusGuaranteeMoney
        this.surplusInterest = res.data.surplusInterest
      })
      // getLoanStatistics().then(res => {
      //   if (res.data) {
      //     this.surplusMoney = res.data.surplusMoney
      //     this.surplusRepaymentMoney = res.data.surplusRepaymentMoney
      //     this.surplusGuaranteeMoney = res.data.surplusGuaranteeMoney
      //     this.surplusInterest = res.data.surplusInterest
      //   }
      // })
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
      Confirm('确定删除该放款吗?', () => {
        deleteLoan({ id }).then(res => {
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
      Confirm(`确定${!row.status ? '撤销' : '恢复'}该放款吗?`, () => {
        updateStatusLoan({ id: row.id }).then(res => {
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

<style lang="scss" scoped>
.surplus-footer {
  margin: 0 10px;
  .surplus-item {
    p {
      margin: 10px 0;
    }
    display: flex;
    .surplus-left {
      font-size: 14px;
    }
    // margin: 0 10px;
    .surplus {
      font-weight: 700;
    }
  }
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.top-title {
  float: left;
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
.total-amount {
  font-weight: 700;
}
::v-deep .el-table__footer-wrapper .el-table__footer tbody tr {
  font-weight: 700;
}
</style>