<template>
  <div>
    <div class="form-title">{{ editType | typeName }}放款信息</div>
    <div class="basic-info-container">
      <h3 class="basic-info">到账信息</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1" v-if="loanData.backersVo">
            资方：<span class="col-text">{{
              loanData.backersVo.abbreviated
            }}</span>
          </div>
          <div class="grid-content1" v-if="loanData.backersAccountTaxVo">
            <span class="mw">资方账户：</span>
            <span class="col-text">{{ loanData.backersAccountTaxVo.name }} [{{
                loanData.backersAccountTaxVo.account
              }}]</span>
          </div>
          <div class="grid-content1" v-if="loanData.subjectVo">
            主体：<span class="col-text">{{
              loanData.subjectVo.abbreviated
            }}</span>
          </div>
          <div class="grid-content1" v-if="loanData.subjectVo">
            <span class="mw" v-if="loanData.backersAccountTaxVo">{{ loanData.repaymentType == 0 ? "主体" : "放款" }}账户：</span><span class="col-text">{{ loanData.subjectAccountTaxVo.name }} [{{
                loanData.subjectAccountTaxVo.account
              }}]</span>
          </div>

          <div class="grid-content1">
            放款金额（元）：<span class="col-text">{{
              loanData.loanMoney || 0 | toThousands
            }}</span>
          </div>
          <div class="grid-content1">
            放款时间：<span class="col-text">{{ loanData.loanDate }}</span>
          </div>
          <div class="grid-content1">
            放款利息（元/万元/天）：<span class="col-text">{{
              loanData.loanInterest
            }}</span>
          </div>
          <div class="grid-content1">
            放款期限：<span class="col-text">{{ loanData.loanStartTerm || "--" }} 至
              {{ loanData.loanEndTerm || "--" }}</span>
          </div>
          <div class="grid-content1">
            还款方式：<span class="col-text">{{
              loanData.repaymentType == 1 ? "到期还款" : "按月还款"
            }}</span>
          </div>
          <div class="grid-content1">
            还款提醒人：<span class="col-text">{{
              repaymentNoticeListVo
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="basic-info-container">
      <h3 class="basic-info">
        {{ loanData.repaymentType == 0 ? "还款计划" : "还款记录" }}
      </h3>
      <div class="basic-info-content">
        <el-table stripe :data="loanData.repaymentPlanVoList" show-summary sum-text="待还金额" :summary-method="getSummaries" style="
            max-width: 100%;
            margin-top: 15px;
            box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
          ">
          <el-table-column prop="repaymentDate" align="center" label="日期"></el-table-column>
          <el-table-column prop="guaranteeMoney" align="center" label="担保费">
            <template slot-scope="scope">
              <span>{{ scope.row.guaranteeMoney || 0 | toThousands }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="money" align="center" label="本金">
            <template slot-scope="scope">
              <span>{{ scope.row.money || 0 | toThousands }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="interest" align="center" label="利息">
            <template slot-scope="scope">
              <span>{{ scope.row.interest || 0 | toThousands }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="repaymentMoney" align="center" label="还款金额">
            <template slot-scope="scope">
              <span>{{ scope.row.repaymentMoney || 0 | toThousands }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <!-- #F14F44 -->
              <el-tag size="mini" :style="{
                  'background-color':
                    scope.row.status == 0
                      ? '#D6D6D6'
                      : scope.row.status == 1
                      ? '#EBF2FF'
                      : scope.row.status == 2
                      ? '#FDEDEC'
                      : '#FFF5EB',
                  'boeder-color':
                    scope.row.status == 0
                      ? '#C6C8CB'
                      : scope.row.status == 1
                      ? '#3A7DFF'
                      : scope.row.status == 2
                      ? '#F14F44'
                      : '#FFA439',
                }">
                <span :style="{
                    color:
                      scope.row.status == 0
                        ? '#fff'
                        : scope.row.status == 1
                        ? '#3A7DFF'
                        : scope.row.status == 2
                        ? '#F14F44'
                        : '#FFA439',
                  }">{{ statusList[scope.row.status] }}</span>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <!-- <el-button type="text" v-if="scope.row.status==2 || scope.row.status==3" @click="handleShow(scope.row)">处理</el-button> -->
              <el-button type="text" v-if="scope.row.status != 1" @click="handleShow(scope.row, 'edit')">处理</el-button>
              <!-- <el-button type="text" v-if="scope.row.status!=0 ">详情</el-button> -->
              <el-button type="text" @click="handleShow(scope.row, 'show')">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="basic-info-container">
      <h3 class="basic-info">银行回单（建议上传图片）</h3>
      <div class="basic-info-content">
        <Form2 ref="form2" :disabled="editType == 'show'"></Form2>
      </div>
    </div>
    <div class="basic-info-container">
      <h3 class="basic-info">放款合同</h3>
      <div class="basic-info-content">
        <Form4 ref="form4" :disabled="editType == 'show'"></Form4>
      </div>
    </div>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <!-- <el-button type="primary" v-debounce="submit" v-if="editType!='show'">保存</el-button> -->
      <!-- <el-button type="primary" v-debounce="submitBack" v-if="editType!='show'">保存返回</el-button> -->
    </div>
    <LoanDialog ref="loanDialog" @onload="onload" :loanInfo="loanInfo" :loanData="loanData" :subjectId="loanData.subjectId" :repaymentType="loanData.repaymentType" :type="type" v-model="showDialog"></LoanDialog>
  </div>
</template>

<script>
import { getLoanInfo } from "@/api/index.js";
import Form2 from "./Form2";
import Form4 from "./Form4";
import LoanDialog from "./LoanDialog";
export default {
  name: "LoanShowDetail",
  components: { Form2, Form4, LoanDialog },
  props: ["value", "editId", "editType", "LoanType"],
  data() {
    return {
      activeNames: ["1", "2", "3", "4"],
      repaymentType: "",
      form1: {},
      loanData: {},
      statusList: ["未还款", "已还款", "待还款", "还款中"],
      showDialog: false,
      type: "",
      loanInfo: {},
      repaymentNoticeListVo: "",
    };
  },
  mounted() {
    if (this.editId) {
      this.$nextTick(() => {
        this.onload();
      });
    }
  },
  methods: {
    getSummaries(param) {
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "待还金额";
          return;
        }
        if (index === 1) {
          sums[index] = this.$options.filters.toThousands(
            Number(this.loanData.surplusGuaranteeMoney)
          );
        }
        if (index === 2) {
          sums[index] = this.$options.filters.toThousands(
            Number(this.loanData.surplusMoney)
          );
        }
        if (index === 3) {
          sums[index] = this.$options.filters.toThousands(
            Number(this.loanData.surplusInterest)
          );
        }
        if (index === 4) {
          sums[index] = this.$options.filters.toThousands(
            Number(this.loanData.surplusRepaymentMoney)
          );
        }
      });

      return sums;
    },
    handleShow(item, type) {
      this.showDialog = true;
      this.loanInfo = item;
      this.type = type;
    },
    onload() {      
      getLoanInfo({ id: this.editId }).then((res) => {
        let result = res.data || {};
        this.loanData = res.data || {};
        let repaymentNoticeListVo = [];
        if (this.loanData && this.loanData.repaymentNoticeListVo) {
          this.loanData.repaymentNoticeListVo.forEach((item) => {
            repaymentNoticeListVo.push(item.name);
            this.repaymentNoticeListVo = repaymentNoticeListVo.join(" & ");
          });
        }

        this.$refs["form2"].onload(result);
        this.$refs["form4"].onload(result);
      });
    },
    cancel() {
      if (this.LoanType == 'toLoin') {
        this.$router.go(-1)
      }
      else {
        this.$emit("input", 0);
      }

    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
.block-form3 {
  // width: 1180px;
  margin: 0 auto;
  .loan-item {
    display: flex;
    // margin-left: 20px;
    margin: 0 0 16px 20px;
    .loan-item-text {
      width: 50%;
      margin: 0;
    }
  }
}
.loanData-info {
  font-size: 15px;
  color: #626468;
  font-weight: 600;
}
.surplus-money {
  font-size: 14px;
  font-weight: 400;
  margin: 10px 0;
  .surplus-money-text {
    font-size: 15px;
    font-weight: 700;
    color: #626468;
  }
}
::v-deep .el-table__footer-wrapper .el-table__footer tbody tr {
  font-weight: 700;
}
</style>
