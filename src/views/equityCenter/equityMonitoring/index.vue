<template>
  <div>
    <div class="row-box">
      <div class="box-row">
        <el-card class="box-card">
          <div class="box-card-row">
            <!-- <div class="box-card-col">
              <div class="el-icon-menu icon"></div>
              <div class="note">总览</div>
            </div> -->
            <div class="box-card-col">
              <div class="num">{{ objNum.importIntegral | toThousands }}</div>
              <div class="note">
                导入金额
                <el-tooltip
                  effect="dark"
                  content="导入“九华保”系统积分金额"
                  placement="bottom"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </div>
            <div class="box-card-col">
              <div class="num">{{ objNum.receiveIntegral || 0 | toThousands }}</div>
              <div class="note">
                领取金额
                <el-tooltip
                  effect="dark"
                  content="指客户在“九华保”系统领取的积分金额"
                  placement="bottom"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </div>
            <div class="box-card-col">
              <div class="num">
                {{ objNum.notReceiveIntegral || 0 | toThousands }}
              </div>
              <div class="note">
                未领取金额
                <el-tooltip
                  effect="dark"
                  content="指已导入“九华保”系统，但客户未登陆领取的积分金额"
                  placement="bottom"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </div>
            <div class="box-card-col">
              <div class="num">
                {{ objNum.withdrawalIntegral || 0 | toThousands }}
              </div>
              <div class="note">
                提现金额
                <el-tooltip
                  effect="dark"
                  content="指客户在“九华保”系统登陆领取积分后，申请提现的金额"
                  placement="bottom"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </div>
            <div class="box-card-col">
              <div class="num">
                {{ objNum.consumptionIntegral || 0 | toThousands }}
              </div>
              <div class="note">
                消费金额
                <el-tooltip
                  effect="dark"
                  content="指在“九华保”系统内，客户实际消费金额，包括“_油券、_洗车、_保养、_其他等"
                  placement="bottom"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </div>
            <div class="box-card-col">
              <div class="num">
                {{ objNum.notConsumptionIntegral || 0 | toThousands }}
              </div>
              <div class="note">
                未提现和未消费金额
                <el-tooltip
                  effect="dark"
                  content="指客户在“九华保”系统领取积分后，尚未做提现或消费金额"
                  placement="bottom"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </div>
            <!-- <div class="box-card-col">
              <div class="num">{{objNum.finishGrantimportIntegral | toThousands}}</div>
              <div class="note">已发
                <el-tooltip effect="dark" content="已下发到账" placement="bottom">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </div>
            <div class="box-card-col">
              <div class="num">{{objNum.surplusimportIntegral | toThousands}}</div>
              <div class="note">剩余
                <el-tooltip effect="dark" content="剩余未使用" placement="bottom">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </div> -->
            <div class="box-card-col">
              <div class="num">{{ objNum.grantIntegral || 0 | toThousands }}</div>
              <div class="note">
                提现已兑付金额
                <el-tooltip
                  effect="dark"
                  content="客户申请提现，下发成功金额"
                  placement="bottom"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </div>
            <div class="box-card-col">
              <div class="num">
                {{ objNum.notWithdrawalIntegral || 0 | toThousands }}
              </div>
              <div class="note">
                提现未兑付金额
                <el-tooltip
                  effect="dark"
                  content="客户申请提现，但未下发成功金额"
                  placement="bottom"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </div>
            <div class="box-card-col">
              <div class="num">{{ objNum.expireIntegral || 0 | toThousands }}</div>
              <div class="note">
                到期应发（T+3）
                <el-tooltip effect="dark" content="今日应发" placement="bottom">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </div>
            <div class="box-card-col">
              <div class="num">
                {{ objNum.returnSumIntegral || 0 | toThousands }}
              </div>
              <div class="note">
                退回
                <el-tooltip
                  effect="dark"
                  content="信息错误退回"
                  placement="bottom"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <el-table
      stripe
      :data="list"
      style="box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1); overflow: auto"
      height="calc(100vh - 330px)"
    >
      <el-table-column
        prop="organizationName"
        align="center"
        label="机构"
      ></el-table-column>
      <el-table-column align="center" label="导入金额">
        <template slot-scope="scope">
          {{ scope.row.importIntegral || 0 | toThousands }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="领取金额">
        <template slot-scope="scope">
          {{ scope.row.receiveIntegral || 0 | toThousands }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="未领取金额">
        <template slot-scope="scope">
          {{ scope.row.notReceiveIntegral || 0 | toThousands }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="提现金额">
        <template slot-scope="scope">
          {{ scope.row.withdrawalIntegral || 0 | toThousands }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="消费金额">
        <template slot-scope="scope">
          {{ scope.row.consumptionIntegral || 0 | toThousands }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="未提现和未消费金额">
        <template slot-scope="scope">
          {{ scope.row.notConsumptionIntegral || 0 | toThousands }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="已发">
        <template slot-scope="scope">
          {{scope.row.finishGrantimportIntegral | toThousands}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="剩余">
        <template slot-scope="scope">
          {{scope.row.surplusimportIntegral | toThousands}}
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="提现已兑付金额">
        <template slot-scope="scope">
          {{ scope.row.grantIntegral || 0 | toThousands }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="提现未兑付金额">
        <template slot-scope="scope">
          {{ scope.row.notWithdrawalIntegral || 0 | toThousands }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="到期应发（T+3）">
        <template slot-scope="scope">
          {{ scope.row.expireIntegral || 0 | toThousands }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="退回">
        <template slot-scope="scope">
          {{ scope.row.returnSumIntegral || 0 | toThousands }}
        </template>
      </el-table-column>
    </el-table>
    <div class="bottom">
      <el-pagination
        layout="total,prev, pager, next,sizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :page-size="pageSize"
        :current-page="pageNum"
        :total="total"
      >
      </el-pagination>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-folder-opened"
        style="margin-top: 10px"
        @click="exportClick"
        >导出</el-button
      >
    </div>
  </div>
</template>
<script>
import { countOrgIntegral, countIntegralTotal } from "@/api/index.js";
import { NumberAdd, exportCommon, getCookies } from "@/utils/utils";
export default {
  name: "overview",
  data() {
    return {
      list: [],
      total: 0,
      objNum: {},
      pageNum: 1,
      pageSize: 10,
    };
  },
  created() {
    this.onload();
  },
  filters: {
    toThousands(num = 0) {
      let c =
        num.toString().indexOf(".") !== -1
          ? num.toLocaleString()
          : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
      return c;
    },
  },
  methods: {
    onload() {
      countIntegralTotal().then((res) => {
        this.objNum = res.data || {};
        this.objNum.consumptionIntegral = NumberAdd(
          this.objNum.consumptionIntegral,
          this.objNum.rechargePrice
        );
      });
      this.getList();
    },
    getList() {
      countOrgIntegral({ pageNum: this.pageNum, pageSize: this.pageSize }).then(
        (res) => {
          this.list = res.data.records || [];
          this.list.forEach((item) => {
            item.consumptionIntegral = NumberAdd(
              item.consumptionIntegral,
              item.rechargePrice
            );
          });
          this.total = res.data.total;
        }
      );
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    exportClick() {
      exportCommon("/cancelCode/exportCountOrgIntegralExcel", {
        orgId: getCookies("organizationId"),
      });
    },
  },
};
</script>

<style scoped lang="scss">
.el-icon-question {
  font-size: 15px;
}
.bottom {
  display: flex;
  justify-content: center;
  align-items: center;
}
.row-box {
  width: 100%;
  overflow: auto;
  .box-row {
    margin: 20px auto;
    display: inline-block;
    white-space: nowrap;
    overflow-x: scroll;
    .box-card-col {
      width: 170px;
      display: inline-block;
    }
    .box-card {
      text-align: center;
      // margin-left: 30px;
      height: 100px;
      .box-card-row {
        box-sizing: border-box;
      }
      .icon {
        color: #0099ff;
        font-size: 40px;
      }
      .note {
        font-size: 13px;
        margin-top: 10px;
      }
      .num {
        margin-top: 5px;
        font-size: 22px;
      }
    }
  }
}
</style>