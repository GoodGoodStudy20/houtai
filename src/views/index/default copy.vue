<template>
  <div class="home-box">
    <div class="data-title">数据统计</div>
    <div class="top-box">
      <div class="child">
        <img src="@/assets/img/今日需求2.png" alt="" />
        <div>
          <p>今日需求</p>
          <p class="text">{{ form.todayDemand || 0 | toThousands }}</p>
        </div>
      </div>
      <!-- <div class="child1">
        <div class="child-left">
          <img src="@/assets/img/今日需求2.png" alt="">
          <div class="text-container">
            <p class="child-left-text">今日需求</p>
            <img class="field-interpretation" src="@/assets/img/字段解释.png" alt="">
          </div>
          <p class="text-num">{{form.todayDemand | toThousands}}w</p>
        </div>
        <div class="border"></div>
        <div class="child-right">
          <div class="child-rt">
            <p class="child-right-text">审批中</p>
            <p class="right-num">111</p>
          </div>
          <div class="child-rb">
            <p class="child-right-text child-right-text2">已完结</p>
            <p class="right-num">222</p>
          </div>
        </div>
      </div> -->
      <div class="child">
        <img src="@/assets/img/今日付款2.png" alt="" />
        <div>
          <p>今日付款</p>
          <p class="text">{{ form.todayPayment || 0 | toThousands }}</p>
        </div>
      </div>
      <div class="child">
        <img src="@/assets/img/本月需求2.png" alt="" />
        <div>
          <p>本月需求</p>
          <p class="text">{{ form.monthDemand || 0 | toThousands }}</p>
        </div>
      </div>
      <div class="child">
        <img src="@/assets/img/本月付款2.png" alt="" />
        <div>
          <p>本月付款</p>
          <p class="text">{{ form.monthPayment || 0 | toThousands }}</p>
        </div>
      </div>
      <!-- <div class="child" @click="handleTarget">
        <img src="@/assets/img/历史应收.png" alt="">
        <div>
          <p>
            历史应收</p>
          <p>{{form.surplusReceivableMoney | toThousands}}</p>
        </div>
      </div> -->
    </div>
    <div class="box-outer">
      <div class="box-container">
        <div class='box-container-title'>
          <el-badge :value="list.length" class="title-badge">
            <p class="title">待办审批</p>
          </el-badge>
          <el-select class="title-dropdown" v-model="type" @change="change" placeholder="全部类型">
            <el-option v-for="item in ApprovalType" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <!-- <span style="float: right; color: #8492a6; font-size: 13px" v-if="item.value!==''">（{{ countNumbet[item.value]?countNumbet[item.value]:0 }}）</span> -->
            </el-option>
          </el-select>
        </div>
        <!-- <p class="title">待办审批</p> -->
        <div class="ban-box">
          <div class="approve" v-for="item in list" @click="gotoApprove(item)">
            <div class="approve-top">
              <!-- <span><i class="icon" :style="{
                    background:
                      item.state == 2
                        ? '#F14F44'
                        : item.state == 1
                        ? '#FFB648'
                        : '#2a38fe',
                  }"></i>{{
                  ApprovalType1[item.type] ? ApprovalType1[item.type].label : ""
                }}</span> -->
              <span :style="{color:item.type==0?'#2A38FE':item.type==2?'#20C997':'#FA4A3E'}">
                <!-- <i class="icon" :style="{ background: item.state == 2 ? '#F14F44' : item.state == 1? '#FFB648' : '#2a38fe',}"></i> -->
                【{{
                  ApprovalType1[item.type] ? ApprovalType1[item.type].label : ""
                }}审批{{item.state==1?'抄送':item.state==2?'退回':''}}】</span>
              <span>{{ item.submitTime }}</span>
            </div>
            <!-- <h3 :style="{ color: item.state == 2 ? '#F14F44' : '#000' }">
              {{ item.createByName }}提交的{{
                ApprovalType[item.type] ? ApprovalType[item.type].label : ""
              }}
              {{
                item.state == 0
                  ? ""
                  : item.state == 1
                  ? "抄送给我"
                  : item.state == 2
                  ? `被${item.approvalName}退回`
                  : ""
              }}
            </h3> -->
            <p>
              <span>客户：</span>
              <span>{{ item.customerName || item.payerName || "" }}</span>
            </p>
            <p>
              <span>{{item.type==0?'委托经营所得':item.type==1?'金额':item.type==2?'开票金额':item.type==3?'回款金额':''}}：</span>
              <span style="color: #f14f44">￥{{ item.money }} </span>
            </p>
            <p v-show="item.type != 2 && item.type != 3">
              <span>类型：</span>
              <span>{{ item.businessType == 0 ? "垫资" : "不垫资" }} +
                {{ item.isIntegral == 0 ? "积分" : "非积分" }}</span>
            </p>
            <p v-show="item.type != 2 && item.type != 3">
              <span>业务条件：</span>
              <span>{{
                item.businessType == 0
                  ? `${item.serviceCharge} (${item.interestFreeDays})+${item.ratio}`
                  : item.serviceCharge
              }}</span>
            </p>
            <p>提交人：{{item.createByName}}</p>
          </div>
        </div>

        <el-empty description="暂无待办审批" v-if="!list || !list.length"></el-empty>
      </div>
      <div class="right-container">
        <div class="cumulative-data">
          <p>累积数据</p>
          <div class="cumulative-container">
            <div class="his-cumulative" @click="handleTarget">
              <img src="@/assets/img/历史应收3.png" alt="" />
              <div class="data-content">
                <p class="his-title">历史应收</p>
                <p class="text">
                  {{ form.surplusReceivableMoney | toThousands }}
                </p>
              </div>
            </div>
            <div class="his-no-pay">
              <img src="@/assets/img/累计未付款.png" alt="" />
              <div class="data-content">
                <p class="his-title">累积未付款</p>
                <p class="text">{{ form.accumulatedUnpaid | toThousands }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="event-reminder">
          <p>事件提醒</p>
          <div class="back-container">
            <div class="backg-contract" @click="expireContractList">
              <div class="contract-number" v-if="form.expireContract || form.expireContract == 0">
                {{ form.expireContract || 0 }}<span>份</span>
              </div>
              <div class="contract-date">30天内到期合同</div>
            </div>
            <div class="backg-repayment" @click="expireRepayment">
              <div class="repayment-number" v-if="form.expireRepayment || form.expireContract == 0">
                {{ form.expireRepayment || 0 }}<span>笔</span>
              </div>
              <div class="repayment-date">到期还款</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getHomeInfo, getHomePageList } from "@/api/index";
import { ApprovalType } from "@/utils/field.js";
export default {
  name: "default",
  data() {
    return {
      form: {},
      list: [],
      menuList: [],
      ApprovalType: ApprovalType,
      ApprovalType1: [
        //审批类型
        { value: 0, label: "需求" },
        { value: 1, label: "付款" },
        { value: 2, label: "开票" },
        { value: 3, label: "回款" },
      ],
      type: '',
      countNumbet: {},//统计审批数据数量
    };
  },
  created() {
    this.onload();
    this.getList()
  },
  methods: {
    expireContractList() {
      this.menuList = JSON.parse(sessionStorage.getItem("menuList"));
      this.menuList.forEach((item) => {
        if (item.path == "/basicManagement/contract") {
          this.$router.push({
            path: "/basicManagement/contract",
            query: { isExpire: 1 },
          });
        } else {
          if (item.child && item.child.length > 0) {
            item.child.forEach((item1) => {
              if (item1.path == "/basicManagement/contract") {
                this.$router.push({
                  path: "/basicManagement/contract",
                  query: { isExpire: 1 },
                });
              }
            });
          }
        }
      });
    },
    handleTarget() {
      this.menuList = JSON.parse(sessionStorage.getItem("menuList"));
      this.menuList.forEach((item) => {
        if (item.path == "/fundCenter/historicalReceivables") {
          this.$router.push({
            path: "/fundCenter/historicalReceivables",
            query: { isExpire: 1 },
          });
        } else {
          if (item.child && item.child.length > 0) {
            item.child.forEach((item1) => {
              if (item1.path == "/fundCenter/historicalReceivables") {
                this.$router.push({
                  path: "/fundCenter/historicalReceivables",
                  query: { isExpire: 1 },
                });
              }
            });
          }
        }
      });
    },
    expireRepayment() {
      this.menuList = JSON.parse(sessionStorage.getItem("menuList"));
      this.menuList.forEach((item) => {
        if (item.path == "/fundManagement/loan") {
          this.$router.push({
            path: "/fundManagement/loan",
            query: { isExpire: 1 },
          });
        } else {
          if (item.child && item.child.length > 0) {
            item.child.forEach((item1) => {
              if (item1.path == "/fundManagement/loan") {
                this.$router.push({
                  path: "/fundManagement/loan",
                  query: { isExpire: 1 },
                });
              }
            });
          }
        }
      });
    },
    onload() {
      getHomeInfo({}).then((res) => {
        this.form = res.data;
      });

    },
    getList(param = {}) {
      getHomePageList({ type: '', ...param }).then((res) => {
        this.list = res.data || [];
      });
    },
    change() {
      this.getList({ type: this.type })
    },
    gotoApprove(item) {
      this.$router.push({
        path: "/approve/index",
        query: {
          id: item.id,
          editType: item.state == 0 ? "approve" : "show",
          type: item.type,
          state: item.state,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.home-box {
  padding: 20px 0 20px 20px;
  .data-title {
    color: #303132;
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 20px;
  }
  .title-badge {
    margin: 20px 0 0;
    .title {
      margin: 0 0 20px 0;
      padding-right: 7px;
    }
  }
  .title {
    font-weight: bold;
    font-size: 20px;
    margin: 20px 0 0;
  }
  .top-box {
    // background: red;
    display: flex;
    justify-content: space-between;
    color: #fff;
    .child {
      flex: 1;
      height: 137px;
      margin-right: 20px;
      display: flex;
      align-items: center;
      // box-shadow: 0px 10px 20px rgba(111, 108, 255, 0.25);
      border-radius: 10px;
      background: #fff;
      p {
        color: #626468;
      }
      .text {
        color: #303132;
      }
      img {
        width: 32px;
        height: 32px;
        margin: 0 22px;
      }
      p:nth-child(1) {
        font-weight: normal;
        font-size: 16px;
        margin: 0;
      }
      p:nth-child(2) {
        font-weight: bold;
        font-size: 26px;
        margin: 6px 0 0 0;
      }
    }
    .child1 {
      display: flex;
      // justify-content: space-between;
      flex: 1;
      height: 137px;
      border-radius: 10px;
      background: #fff;
      margin-right: 20px;
      img {
        width: 32px;
        height: 32px;
      }
      .child-left {
        margin: 19px 40px 21px 20px;
        p {
          margin: 0;
          padding: 0;
        }
        .text-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 6px 0;
          position: relative;
          .field-interpretation {
            width: 13px;
            height: 13px;
            margin-left: 6px;
            position: absolute;
            top: 5px;
            right: -20px;
            cursor: pointer;
          }
        }
        .child-left-text {
          color: #626468;
          opacity: 0.9;
          font-weight: 500;
          font-size: 16px;
        }
      }
      .border {
        width: 1px;
        background: #d0d0d0;
        transform: scale(0.5);
        // transform-origin: 50% 50%;
      }
      .text-num {
        font-weight: 700;
        font-size: 22px;
        color: #303132;
      }
      .child-right {
        margin: 19px 0 21px 40px;

        p {
          margin: 0;
          padding: 0;
        }
        .child-rt {
          position: relative;
        }
        .child-rb {
          position: relative;
          margin-top: 16px;
        }
        .child-right-text {
          color: #626468;
          font-weight: 500;
          font-size: 14px;
          padding-left: 15px;
        }
        .child-right-text:before {
          display: inline-block;
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ffa439;
          position: absolute;
          top: 6px;
          left: 0;
        }
        .child-right-text2:before {
          display: inline-block;
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ccc;
        }
        .right-num {
          font-weight: 700;
          font-size: 15px;
          color: #303132;
          margin: 2px 0;
        }
      }
    }
    // .child:nth-child(1) {
    //   background: #4a93ff;
    // }
    // .child:nth-child(2) {
    //   background: #ffa439;
    // }
    // .child:nth-child(3) {
    //   background: #865bff;
    // }
    // .child:nth-child(4) {
    //   background: #f14f44;
    // }
    // .child:nth-child(5) {
    //   background: #b469ff;
    //   cursor: pointer;
    // }
  }
}
.box-outer {
  margin: 20px 0 0;
  // background: #fff;
  display: flex;
  justify-content: space-between;
}
.box-container {
  // display: flex;
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 0 16px;
  .ban-box {
    display: flex;
    flex-wrap: wrap;
    .approve {
      flex: 1;
      flex-shrink: 0;
      min-width: 380px;
      max-width: 395px;
      height: 269px;
      filter: drop-shadow(0px 15px 50px rgba(160, 163, 189, 0.13));
      background: #fff;
      margin: 20px 20px 0 0;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 10px 12px;
      cursor: pointer;
      &:hover {
        filter: drop-shadow(0px 15px 50px rgba(160, 163, 189, 0.349));
        transition: filter 0.5s;
      }
      .approve-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .icon {
          display: inline-block;
          width: 6px;
          height: 6px;
          margin-left: -5px;
          margin-right: 5px;
          border-radius: 50%;
        }
        span:nth-child(2) {
          color: #666;
          font-size: 14px;
        }
      }
      p {
        span:nth-child(1) {
          color: #000;
          font-size: 16px;
        }
        span:nth-child(2) {
          color: #666;
          font-size: 14px;
        }
      }
    }
  }
  &-title {
    display: flex;
    justify-content: space-between;
    ::v-deep .title-dropdown {
      input::-webkit-input-placeholder {
        font-size: 13px !important;
        color: #303132 !important;
      }
      margin: 22px 16px 0 0;
      width: 130px;
      height: 32px;
      border-radius: 4px;
      line-height: 32px;
      text-align: center;
      span {
        cursor: pointer;
      }
      i {
        margin-left: 32px;
      }
    }
  }
}
.cumulative-data {
  // position: absolute;
  // right: 10px;
  width: 331px;
  height: 325px;
  filter: drop-shadow(0px 15px 50px rgba(160, 163, 189, 0.13));
  background: #fff;
  margin-right: 20px;
  margin-left: 20px;
  border-radius: 8px;
  &:hover {
    filter: drop-shadow(0px 15px 50px rgba(160, 163, 189, 0.349));
    transition: filter 0.5s;
  }
  // margin: 20px 20px 0 0;
  p {
    color: #303132;
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    padding: 18px 0 0 16px;
  }
  .cumulative-container {
    width: 247px;
    height: 188px;
    display: flex;
    padding-top: 20px;
    flex-direction: column;
    justify-content: space-between;
    // filter: drop-shadow(0px 15px 50px rgba(160, 163, 189, 0.13));

    img {
      height: 56px;
    }
    .his-title {
      color: #626468;
      font-size: 16px;
      font-weight: 400;
    }
    .text {
      color: #303132;
      font-size: 25px;
      font-weight: 700;
    }
    .his-cumulative {
      display: flex;
      align-items: center;
      margin-left: 16px;
      cursor: pointer;
    }
    .his-no-pay {
      display: flex;
      align-items: center;
      margin-left: 16px;
      cursor: pointer;
    }
    .data-content {
      p {
        margin: 0;
        padding: 0;
        padding-left: 15px;
        padding-bottom: 10px;
      }
    }
  }
}
.event-reminder {
  width: 331px;
  height: 252px;
  background: #fff;
  margin: 20px 20px 0;
  border-radius: 8px;
  p {
    color: #303132;
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    padding: 18px 0 0 16px;
  }
  .back-container {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }
  .backg-contract {
    width: 140px;
    height: 164px;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    background: url(../../assets/img/Maskgroup1.png) no-repeat;
    background-color: #f0f2fa;
    cursor: pointer;
    .contract-number {
      font-family: Microsoft YaHei;
      font-size: 42px;
      font-weight: 700;
      color: #f68c0e;
      span {
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 400;
        color: #f68c0e;
      }
    }
    .contract-date {
      font-family: PingFang SC;
      font-size: 15px;
      font-weight: 400;
      color: #626468;
    }
  }
  .backg-repayment {
    width: 140px;
    height: 164px;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    background: url("../../assets/img/Mask group.png") no-repeat;
    background-color: #f0f2fa;
    cursor: pointer;
    .repayment-number {
      font-family: Microsoft YaHei;
      font-size: 42px;
      font-weight: 700;
      color: #303132;
      span {
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 400;
        color: #303132;
      }
    }
    .repayment-date {
      font-family: PingFang SC;
      font-size: 15px;
      font-weight: 400;
      color: #626468;
    }
  }
}
</style>