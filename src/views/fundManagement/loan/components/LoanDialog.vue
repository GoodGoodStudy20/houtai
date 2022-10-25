<template>
  <el-dialog :visible.sync="value" :title="`${loanInfo.repaymentDate}还款详情`" :before-close="dialogClose" :close-on-click-modal="false" width="800px" :lock-scroll="false" :modal-append-to-body="false">
    <div style="margin-top:20px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="新增信息" name="1" v-if="type=='edit'">
          <el-form :model="form" ref="form" size="mini" label-width="auto">
            <el-form-item label="还款时间" prop="repaymentDate" :rules="[{ required: true, message: '还款时间不可为空', trigger: 'change' }]">
              <el-date-picker v-model="form.repaymentDate" @change="repaymentDateChange" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:500px"></el-date-picker>
            </el-form-item>
            <el-form-item label="担保费（元）" prop="guaranteeMoney" :rules="[{ required: true, message: '担保费不可为空', trigger: 'blur' }]">
              <el-input type="number" :max="loanInfo.surplusMoney" v-model="form.guaranteeMoney" @input="repaymentMoneyChange" @change="repaymentMoneyChange" placeholder="请输入担保费" style="width:500px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
            </el-form-item>
            <el-form-item label="还款本金（元）" prop="money" :rules="[{ required: true, message: '还款本金不可为空', trigger: 'blur' }]">
              <el-input type="number" min="1" :max="loanInfo.surplusMoney" v-model="form.money" @input="repaymentDateChange" @change="repaymentDateChange" placeholder="请输入还款本金" style="width:500px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
            </el-form-item>
            <el-form-item label="还款利息（元）" prop="interest" :rules="[{ required: true, message: '还款利息不可为空', trigger: 'blur' }]">
              <el-input type="number" v-model="form.interest" placeholder="请输入还款利息" style="width:500px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
            </el-form-item>
            <el-form-item label="还款金额" prop="repaymentMoney" :rules="[{ required: true, message: '还款金额不可为空', trigger: 'blur' }]">
              <el-input type="number" min="1" :max="loanInfo.surplusMoney" v-model="form.repaymentMoney" @input="repaymentMoneyChange" @change="repaymentMoneyChange" placeholder="请输入还款金额" style="width:500px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
            </el-form-item>
            <el-form-item label="主体 " prop="subjectId" v-if="repaymentType==1" :rules="[{ required: true, message: '主体不可为空', trigger: 'blur' }]">
              <ChooseSubject v-model="form.subjectId" ref="subject" @change="subjectChange" style="width:500px"></ChooseSubject>
            </el-form-item>

            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" style="width:500px" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
            </el-form-item>
            <el-form-item label="还款银行回单" label-width="100">
              <div style="display:flex;padding-left:75px">
                <UploadFile v-model="form.bankReceipt"></UploadFile>
                <span style="color:#F14F44">（* 建议上传图片）</span>
              </div>
            </el-form-item>
          </el-form>
          <el-button size="small" @click="dialogClose">取消</el-button>
          <el-button size="small" type="primary" v-debounce="handleSubmit">提交</el-button>
        </el-tab-pane>
        <el-tab-pane label="还款记录" name="2">
          <el-table :data="loanInfo.repaymentVoList" show-summary sum-text='待还金额' :summary-method="getSummaries" header-row-class-name="table-loanInfo">
            <el-table-column property="repaymentDate" label="还款时间" width="100"></el-table-column>
            <el-table-column property="guaranteeMoney" label="担保费（元）" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.guaranteeMoney || 0 | toThousands}}</span>
              </template>
            </el-table-column>
            <el-table-column property="money" label="本金" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.money || 0 | toThousands}}</span>
              </template>
            </el-table-column>
            <el-table-column property="interest" label="利息" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.interest || 0 | toThousands}}</span>
              </template>
            </el-table-column>
            <el-table-column property="repaymentMoney" label="还款金额（元）" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.repaymentMoney || 0 | toThousands}}</span>
              </template>
            </el-table-column>
            <el-table-column property="subjectVo.abbreviated" v-if="repaymentType==1" label="主体"></el-table-column>
            <el-table-column property="name" width="150" label="回单文件">
              <template slot-scope="scope">
                <img @click="open(item)" style="width:64px;height:64px" v-for="item in JSON.parse(scope.row.bankReceipt)" :key="item.rul" :src="item.url" />
              </template>
            </el-table-column>
            <el-table-column property="remark" label="备注" width="150"></el-table-column>
            <el-table-column property="createByName" label="提交人"></el-table-column>
            <el-table-column property="createTime" label="提交时间" width="180"></el-table-column>
          </el-table>
          <!-- <div style="text-align:left;margin:15px 0">剩余还款金额：<span style="color: #f14f44;">￥{{loanInfo.surplusMoney}}</span></div> -->
          <el-button size="small" style="margin-top:20px" @click="dialogClose">关闭</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script>
import { addRepayment, updateIssueStatus, getRepaymentInfo } from '@/api/index.js'
import UploadFile from '@/components/UploadFile/index.vue'
import ChooseSubject from '@/components/ChooseSubject/index.vue'
import { NumberAdd, NumberMul, NumberDiv } from '@/utils/index.js'
export default {
  name: 'LoanDialog',
  props: ['value', 'type', 'loanInfo', 'repaymentType', 'subjectId', 'loanData'],
  components: { UploadFile, ChooseSubject },
  data() {
    return {
      form: {
        repaymentMoney: '',
        bankReceipt: [],
        repaymentDate: '',//还款时间
        remark: '',
        subjectId: '',
        interest: '',
        money: '',
        guaranteeMoney: '',
      },
      gridData: [],
      activeName: '1'
    }
  },
  created() {
  },
  watch: {
    'value'(val) {
      if (val) {
        if (this.type == 'show') {
          this.activeName = '2'
        } else {
          this.activeName = '1'
        }
      }
    }
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '待还金额';
          return;
        }
        if (index === 1) {
          sums[index] = this.$options.filters.toThousands(Number(this.loanInfo.surplusGuaranteeMoney))
        }
        if (index === 2) {
          sums[index] = this.$options.filters.toThousands(Number(this.loanInfo.surplusMoney))
        }
        if (index === 3) {
          sums[index] = this.$options.filters.toThousands(Number(this.loanInfo.surplusInterest))
        }
        if (index === 4) {
          sums[index] = this.$options.filters.toThousands(Number(this.loanInfo.surplusRepaymentMoney))
        }

      });
      return sums;
    },
    clearInit() {
      this.form.repaymentDate = '';
      this.form.repaymentMoney = '';
      this.form.bankReceipt = [];
      this.form.remark = '';
      this.form.subjectId = '';
      this.form.guaranteeMoney = '';
      this.form.money = '';
      this.form.interest = ''

    },
    repaymentDateChange() {
      let day = this.GetNumberOfDays(this.loanData.loanStartTerm, this.form.repaymentDate)
      let interest = NumberMul(Number(this.form.money), day)
      let interest2 = NumberMul(Number(this.loanData.loanInterest), Number(interest))
      this.form.interest = NumberDiv(interest2, 10000)
      this.form.repaymentMoney = NumberAdd([this.form.interest, this.form.money, this.form.guaranteeMoney])
    },
    //计算天数
    GetNumberOfDays(date1, date2) {//获得天数
      //date1：开始日期，date2结束日期
      var a1 = Date.parse(new Date(date1));
      var a2 = Date.parse(new Date(date2));
      var day = parseInt((a2 - a1) / (1000 * 60 * 60 * 24));//核心：时间戳相减，然后除以天数
      return day
    },
    repaymentMoneyChange() {
      this.$nextTick(() => {
        if (Number(this.form.repaymentMoney) > this.loanInfo.surplusMoney) {
          this.form.repaymentMoney = this.loanInfo.surplusRepaymentMoney
        }
        if (Number(this.form.interest) > this.loanInfo.surplusMoney) {
          this.form.interest = this.loanInfo.surplusInterest
        }
        if (Number(this.form.money) > this.loanInfo.surplusMoney) {
          this.form.money = this.loanInfo.surplusMoney
        }
        if (Number(this.form.guaranteeMoney) > this.loanInfo.surplusMoney) {
          this.form.guaranteeMoney = this.loanInfo.surplusGuaranteeMoney
        }
      })
    },
    open(file) {
      if (file.url) {
        window.open(file.url)
      }
    },
    dialogClose() {
      this.$emit('input', false)
      if (this.type == 'edit') {
        this.$refs['form'].clearValidate()
        this.clearInit()
      }

    },
    subjectChange(item) {
      // this.options1 = item.accountTaxVoList || []
    },
    handleSubmit() {
      let data = {
        repaymentMoney: this.form.repaymentMoney,//还款金额
        remark: this.form.remark,//还款金额
        interest: this.form.interest,
        money: this.form.money,
        guaranteeMoney: this.form.guaranteeMoney,
        bankReceipt: this.form.bankReceipt,//银行回单
        repaymentDate: this.form.repaymentDate,//还款时间,
        subjectId: this.form.subjectId || this.subjectId,//主体ID
        repaymentPlanId: this.loanInfo.id//还款计划ID,
      }
      if (!this.form.bankReceipt || !this.form.bankReceipt.length) {
        this.$message.error('请上传银行回单')
        return
      }
      if (!this.$validate('form')) return
      data.bankReceipt = JSON.stringify(this.form.bankReceipt)
      this.submit(data, 'success')
    },
    cancel() {
      this.dialogClose()
    },
    submit(data, state) {
      let success = res => {
        if (res.code == 200) {
          this.$message.success('操作成功')
          this.$emit('onload')
          // this.$emit('success', state)
          this.dialogClose()
        } else {
          this.$message.error(res.msg || '操作失败')
        }
      }
      addRepayment(data).then(success)

    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__error {
  left: 100px !important;
}
::v-deep .el-table__footer-wrapper .el-table__footer tbody tr {
  font-weight: 700;
}
</style>