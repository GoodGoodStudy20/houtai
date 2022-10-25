<template>
  <div>
    <div class="main">
      <div class="main-header">
        <div class="number">200</div>
        <div>待签约客户</div>
      </div>
    </div>
    <waitSign @SubmitApproval="SubmitApproval"></waitSign>
    <submitApproveDialog v-model="isSubmitApproval" :multipleSelection="multipleSelection" v-if="isSubmitApproval"></submitApproveDialog>
  </div>
</template>

<script>
import ChooseCapital from '@/components/ChooseCapital/index.vue'
import ChooseSubject from '@/components/ChooseSubject/index.vue'
import submitApproveDialog from './submitApproveDialog'
import waitSign from "./waitSign"
import { ApprovalStatus } from '@/utils/field.js'
import * as echarts from 'echarts';
// import { deleteRepayment, updateStatusRepayment, getServiceProviderBalancePage, statisticsSurplusAmount, statisticsUseAmount, getSubjectList } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
import moment from 'moment'
export default {
  name: 'serviceProviderBalance',
  components: { ChooseCapital, ChooseSubject, waitSign, submitApproveDialog },
  props: ['value'],
  data() {
    return {
      form: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
        isPage: 1,
        subjectId: '',
        type: 0,  //类型(0.充值,1.使用)
        search: ''
      },
      list: [],
      total: 0,
      user: {},
      activeName: '0',
      year1: moment().format('YYYY-MM'),
      // isAddRecordShow: false,
      serviceProviderList: [],
      UseAmountList: [],
      subjectList: [],
      isSubmitApproval: false,
      multipleSelection: []
    }
  },
  created() {
    this.user = JSON.parse(sessionStorage.getItem('user'))

  },
  methods: {
    SubmitApproval(isSubmitApproval, multipleSelection) {
      this.isSubmitApproval = isSubmitApproval
      this.multipleSelection = multipleSelection
    },

    showAmount() { },

    // handleClick() {
    //   let arr = [0, 1]
    //   this.form.type = arr[this.activeName]
    //   this.handleCurrentChange(1)
    // },

    getList() {
      this.list = []
      getServiceProviderBalancePage(this.form).then(res => {
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
  }
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  .main-header {
    margin: 20px 10px;
    font-size: 18px;
    font-weight: 700;
    text-align: center;
    .number {
      margin-bottom: 20px;
    }
  }
}

::v-deep .el-tabs__header {
  border: none !important;
}
::v-deep .el-tabs__item {
  width: 100px;
  background: #ccc;
  margin: 20px 20px 20px 0;
  // padding: 0;
  box-sizing: border-box;
  border-radius: 5px;
  text-align: center;
  font-weight: 500;
  &.is-active {
    background: #dcf1ff;
    border-color: #dcf1ff;
    border-bottom-color: #dcf1ff !important;
  }
}
.span-reference {
  display: inline-block;
  width: 100%;
}
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: none;
}
</style>