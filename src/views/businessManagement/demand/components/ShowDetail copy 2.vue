<template>
  <div style="width: 99%; margin: auto">
    <div class="form-title">项目签报详情</div>
    <!-- <div class="approve">
      <div class="basic-info-container">
        <h3 class="basic-info">客户信息</h3>
        <div class="basic-info-content">
          <div style="display: flex; flex-wrap: wrap">
            <div v-if="detailData.customerVo" class="grid-content12b">
              客户：<span class="col-text">{{
                detailData.customerVo.abbreviated
              }}</span>
            </div>
            <div v-if="detailData.customerChannelVo" class="grid-content12b">
              渠道：<span class="col-text">{{
                detailData.customerChannelVo.name
              }}</span>
            </div>
            <div class="grid-content12b">
              项目编号：<span class="col-text">{{ detailData.number }}</span>
            </div>
            <div class="grid-content12b">
              需求日期：<span class="col-text">{{
                detailData.demandDate
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="basic-info-container" v-if="Datalist.length > 0">
        <h3 class="basic-info">产品信息</h3>
        <div class="product-header">
          <el-row :gutter="20" class="rol-content">
            <el-col :span="6" style="padding: 0">
              <div class="grid-content">产品分类</div>
            </el-col>
            <el-col :span="6" style="padding: 0">
              <div class="grid-content">产品名称</div>
            </el-col>
            <el-col :span="6" style="padding: 0">
              <div class="grid-content">产品单价（元）</div>
            </el-col>
          </el-row>
        </div>
        <div
          class="product-content"
          v-for="product in Datalist"
          :key="product.id"
        >
          <el-row :gutter="20" class="rol-content">
            <el-col :span="6" style="padding: 0">
              <div class="grid-content">{{ product.productTypeVo.name }}</div>
            </el-col>
            <el-col :span="6" style="padding: 0">
              <div class="grid-content">{{ product.productVo.name }}</div>
            </el-col>
            <el-col :span="6" style="padding: 0">
              <div class="grid-content">{{ product.price }}</div>
            </el-col>
          </el-row>
          <el-divider class="divder-product"></el-divider>
        </div>
      </div>

      <div class="basic-info-container">
        <h3 class="basic-info file-info">附件信息</h3>
        <div class="business-outer-container">
          <div class="business-container2b">
            <span class="sb-title">业务合同</span>
            <FileType :fileList="contractFileList"></FileType>
          </div>

          <div class="business-container2b">
            <span class="sb-title">结算清单</span>
            <div class="business-item">
              <FileType :fileList="settlementDetailedFile"></FileType>
            </div>
          </div>
        </div>
      </div>
      <div class="basic-info-container">
        <h3 class="basic-info">上游服务商</h3>
        <div class="basic-info-content">
          <div style="display: flex; flex-wrap: wrap">
            <div class="grid-content12b">
              名称：<span class="col-text">{{
                detailData.customerVo.abbreviated
              }}</span>
            </div>
            <div v-if="detailData.customerChannelVo" class="grid-content12b">
              应付分配比例：<span class="col-text">{{
                detailData.customerChannelVo.name
              }}</span>
            </div>
            <div class="grid-content12b">
              支付平台：<span class="col-text">{{ detailData.number }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="basic-info-container" v-if="detailData.businessType == 1">
        <h3 class="basic-info">关联回单详情</h3>
        <div style="padding: 0 16px 18px" class="detail">
          <el-table
            :data="detailData.arrivalReceipt"
            max-height="700px"
            show-summary
            :summary-method="getSummaries"
            :header-cell-style="{ 'background-color': '#F4F8FF' }"
          >
            <el-table-column
              label="回单编号"
              align="left"
              width="240"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span
                  class="table-text"
                  @click="openFile(scope.row)"
                  :style="{
                    color:
                      scope.row.status && scope.row.status == 1
                        ? '#ffa814'
                        : '',
                  }"
                  >{{ scope.row.number }}</span
                ><span v-if="scope.row.status == 1" style="color: #ffa814"
                  >(审批中)</span
                >
              </template>
            </el-table-column>
            <el-table-column
              property="customerVo.abbreviated"
              label="渠道"
              width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="`${
                    (scope.row.customerVo &&
                      scope.row.customerVo.abbreviated) ||
                    scope.row.abbreviated
                  }(${
                    (scope.row.customerChannelVo &&
                      scope.row.customerChannelVo.name) ||
                    scope.row.channelName
                  })`"
                  placement="top-start"
                >
                  <span>{{
                    (scope.row.customerChannelVo &&
                      scope.row.customerChannelVo.name) ||
                    scope.row.channelName
                  }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column property="amount" label="到账金额" align="right">
              <template slot-scope="scope">
                <span v-if="scope.row.amount || scope.row.amount == 0">{{
                  scope.row.amount | toThousands
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              property="returnMoneyDate"
              label="到账时间"
              align="right"
              sortable
            >
              <template slot-scope="scope">
                <span>{{ scope.row.returnMoneyDate || "--" }}</span>
              </template>
            </el-table-column>
            <el-table-column
              property="availableMoney"
              label="可用委托"
              align="right"
            >
              <template slot-scope="scope">
                <span
                  v-if="
                    scope.row.availableMoney || scope.row.availableMoney == 0
                  "
                  >{{ Number(scope.row.availableMoney) | toThousands }}</span
                >
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column label="已用次数" align="right">
              <template slot="header" slot-scope="scope">
                <el-tooltip
                  effect="dark"
                  content="已用次数：指之前已用回单次数，不包含本次"
                  placement="top"
                >
                  <span class="explain-fields">已用次数</span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-popover
                  placement="top"
                  offset="100"
                  trigger="click"
                  width="450"
                  v-if="
                    scope.row.availAbleMoneyRecordList &&
                    scope.row.availAbleMoneyRecordList.length > 0
                  "
                >
                  <el-table :data="scope.row.availAbleMoneyRecordList">
                    <el-table-column width="230" label="签报">
                      <template slot-scope="scope1">
                        <span>{{ scope1.row.number }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column width="100" label="渠道">
                      <template slot-scope="scope1">
                        <span>{{ scope1.row.channelName }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column width="100" align="right" label="已用委托">
                      <template slot-scope="scope1">
                        <span>{{ scope1.row.usedMoney | toThousands }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <span
                    style="
                      display: inline-block;
                      padding: 0 20px;
                      color: #3a7dff;
                      cursor: pointer;
                    "
                    slot="reference"
                    >{{
                      scope.row.availAbleMoneyRecordList &&
                      scope.row.availAbleMoneyRecordList.length
                        ? scope.row.availAbleMoneyRecordList.length
                        : 0 || "--"
                    }}</span
                  >
                </el-popover>
                <span v-else style="display: inline-block; padding: 0 20px">{{
                  scope.row.availAbleMoneyRecordList &&
                  scope.row.availAbleMoneyRecordList.length
                    ? scope.row.availAbleMoneyRecordList.length
                    : 0 || "--"
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              property="arrivalUsedMoney"
              label="已用委托"
              align="right"
            >
              <template slot="header" slot-scope="scope">
                <el-tooltip
                  effect="dark"
                  content="已用委托：指之前已用委托金额，不含本次申请金额"
                  placement="top"
                >
                  <span class="explain-fields">已用委托</span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <span>{{
                  scope.row.arrivalUsedMoney ||
                  scope.row.usedMoney | toThousands
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              property="currentUsedMoney"
              label="本次申请"
              align="right"
            >
              <template slot-scope="scope">
                <span
                  v-if="
                    scope.row.currentUsedMoney ||
                    scope.row.currentUsedMoney == 0
                  "
                  >{{ scope.row.currentUsedMoney | toThousands }}</span
                >
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              property="surplusAvailableMoney"
              label="剩余委托"
              align="right"
            >
              <template slot="header" slot-scope="scope">
                <el-tooltip
                  effect="dark"
                  content="剩余委托：指冻结本次申请金额后剩余可用委托"
                  placement="top"
                >
                  <span class="explain-fields">剩余委托</span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <span
                  v-if="
                    scope.row.surplusAvailableMoney ||
                    scope.row.surplusAvailableMoney == 0
                  "
                  >{{
                    Number(scope.row.surplusAvailableMoney) | toThousands
                  }}</span
                >
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="basic-info-container">
        <h3 class="basic-info">审批流程</h3>
        <div class="basic-info-content">
          <ProcessForm ref="processform" :disabled="true"></ProcessForm>
        </div>
      </div>
    </div> -->
    <!-- <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <el-button
        type="primary"
        @click="approveClick"
        v-if="editType == 'approve' && showIssue == 0"
        >审批</el-button
      >
      <el-button
        type="primary"
        @click="approveClick"
        v-if="editType == 'approve' && showIssue == 1"
        >办理</el-button
      >
      <el-button
        type="primary"
        @click="approveClick"
        v-if="editType == 'approve' && showIssue == 2"
        >确认下发</el-button
      >
      <el-button type="danger" @click="returnClick" v-if="editType == 'approve'"
        >退回</el-button
      >
    </div> -->
    <ApproveDialog
      v-model="showDialog"
      v-if="showDialog"
      :idData="idData"
      :type="0"
      :relationshipId="editId"
      @success="approveSuccess"
      :showIssue="showIssue"
    ></ApproveDialog>
    <ReturnDialog
      v-model="showReturnDialog"
      v-if="showReturnDialog"
      :approvalProcessVoList="detailData.approvalProcessVoList"
      :idData="idData"
      :type="0"
      :relationshipId="editId"
      @success="approveSuccess"
      :showIssue="showIssue"
    ></ReturnDialog>
    <ReceiptUseDetails
      v-model="showReceipDialog"
      v-if="showReceipDialog"
      :returnMoneyApprovalList="returnMoneyApprovalList"
    ></ReceiptUseDetails>

    <el-image-viewer
      v-if="dialogVisible"
      :on-close="onClose"
      :url-list="[dialogImageUrl]"
      :zIndex="20060"
    />
  </div>
</template>
<script>
import {
  getDemandApprovalInfo,
  addPaymentApproval,
  updatePaymentApproval,
  getReturnMoneyApprovalById,
  updateIsRead,
  getReturnMoneyApprovalByCustomerId,
} from "@/api/index.js";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import ProcessForm from "../../components/ProcessForm";
import ApproveDialog from "../../components/ApproveDialog";
import ReturnDialog from "../../components/ReturnDialog";
import ReceiptUseDetails from "./ReceiptUseDetails";
import FileType from "@/components/FileType";
import { NumberSub, NumberAdd } from "@/utils/index.js";
export default {
  name: "ShowDetail",
  components: {
    ProcessForm,
    ApproveDialog,
    FileType,
    ElImageViewer,
    ReturnDialog,
    ReceiptUseDetails,
  },

  props: ["value", "editId", "editType"],
  data() {
    return {
      gridData: [],
      Datalist: [],
      showDialog: false,
      showReturnDialog: false,
      showReceipDialog: false,
      form: {},
      detailData: { customerVo: {} }, //详情数据对象
      businessTypelist: "", //资方
      contractFileList: [], //业务合同
      issueDetailedListFile: [], //支付清单
      settlementDetailedFile: [], //结算清单
      serviceDetailedFile: [], //服务清单
      approvalProcessVoList: [], //流程
      // dialogTableVisible: false,
      // gridData: [],
      determineFile: [], //确权文件记录
      determineFile2: [], //确权文件
      moneySum: 0, //支付委托经营所得金额
      moneySum2: 0, //支付服务商金额,
      dialogVisible: false, //图片弹窗
      dialogImageUrl: "",
      idData: {},
      maps: new Map(),
      moneyList: [],
      returnMoneyApprovalList: [],
      submitTime: "",
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$bus.$on("refundAmount", (res) => {
        this.refundAmount = res;
      });
    });
    this.onload();
  },
  methods: {
    changeTime() {
      let param = {};
      if (this.submitTime) {
        param = {
          returnMoneyStartDate: this.submitTime[0],
          returnMoneyEndDate: this.submitTime[1],
        };
      }
      this.getReturnMoneyApprovalByCustomerId(param);
    },
    // returnApprove(id, editType) {
    //   this.$emit('input', 1)
    //   this.$emit('edit', id, editType)
    // },
    handleDetail(row) {
      this.showReceipDialog = true;
      this.returnMoneyApprovalList = row.returnMoneyApprovalList;
    },
    load(tree, treeNode, resolve) {
      const id = tree.id;
      this.maps.set(id, { tree, treeNode, resolve });
      // let list = this.detailData.arrivalReceipt.filter(item => {
      //   return item.deleteId == deleteId
      // })

      resolve(this.detailData.arrivalReceipt);
    },
    getSummaries(param) {
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = "合计";
          return;
        }
        if (index === 2) {
          if (this.detailData.arrivalReceipt) {
            sums[index] = this.$options.filters.toThousands(
              NumberAdd(
                this.detailData.arrivalReceipt.map((item) => item.amount || 0)
              )
            );
          }
        }
        if (index === 4) {
          if (this.detailData.arrivalReceipt) {
            sums[index] = this.$options.filters.toThousands(
              Number(
                NumberAdd(
                  this.detailData.arrivalReceipt.map(
                    (item) => item.availableMoney || 0
                  )
                )
              )
            );
          }
        }
        if (index === 6) {
          if (this.detailData.arrivalReceipt) {
            sums[index] = this.$options.filters.toThousands(
              NumberAdd(
                this.detailData.arrivalReceipt.map(
                  (item) => item.arrivalUsedMoney || item.usedMoney || 0
                )
              )
            );
          }
        }
        if (index === 7) {
          if (this.detailData.arrivalReceipt) {
            sums[index] = this.$options.filters.toThousands(
              NumberAdd(
                this.detailData.arrivalReceipt.map(
                  (item) => item.currentUsedMoney || 0
                )
              )
            );
          }
        }
        if (index === 8) {
          if (this.detailData.arrivalReceipt) {
            sums[index] = this.$options.filters.toThousands(
              Number(
                NumberAdd(
                  this.detailData.arrivalReceipt.map(
                    (item) => item.surplusAvailableMoney || 0
                  )
                )
              )
            );
          }
        }
      });
      return sums;
    },
    returnClick() {
      this.showReturnDialog = true;
    },
    onClose() {
      this.dialogVisible = false;
    },
    openFile(cInfo) {
      let fileList = JSON.parse(cInfo.arrivalReceiptFile);
      if (!fileList || fileList.length == 0) {
        this.$message.warning("文件丢失");
        return;
      }
      let fileItem = fileList[0];
      // this.dialogTableVisible = false
      if (fileItem instanceof Object) {
        if (fileItem.name.indexOf(".pdf") > -1) {
          window.open(fileItem.url);
        } else {
          this.dialogVisible = true;
          this.dialogImageUrl = fileItem.url;
          //this.handleClickItem()
        }
      } else {
        if (fileItem.indexOf(".pdf") > -1) {
          window.open(fileItem);
        } else {
          this.dialogVisible = true;
          this.dialogImageUrl = fileItem;
          //this.handleClickItem()
        }
      }
    },
    // Receipt() {
    //   this.dialogTableVisible = true
    // },
    downLoad(url) {
      if (url) {
        this.dialogVisible = true;
        this.dialogImageUrl = url;
      }
      // if (url) {
      //   window.open(url)
      // }
    },
    //修改已读
    readUpdate(data) {
      updateIsRead(data).then(() => {});
    },
    async onload() {
      await getDemandApprovalInfo({ id: this.editId }).then((res) => {
        this.detailData = res.data;
        let businessTypelist = [];
        if (this.detailData.businessType == 0) {
          this.detailData.backersVoList.forEach((item) => {
            businessTypelist.push(item.abbreviated);
            // businessTypelist.push(item.abbreviated)
            this.businessTypelist = businessTypelist.join(" & ");
          });
        }
        this.Datalist = this.detailData.productRelationVoList;
        this.contractFileList = JSON.parse(this.detailData.contractFile) || [];
        this.issueDetailedListFile =
          JSON.parse(this.detailData.issueDetailedListFile) || [];
        this.settlementDetailedFile =
          JSON.parse(this.detailData.settlementDetailedFile) || [];
        this.serviceDetailedFile =
          JSON.parse(this.detailData.serviceDetailedFile) || [];
        let wxScreenshot = this.detailData.wxScreenshot
          ? this.detailData.wxScreenshot.split(",")
          : [];
        let mailScreenshot = this.detailData.mailScreenshot
          ? this.detailData.mailScreenshot.split(",")
          : [];
        this.determineFile2 = this.detailData.determineFile
          ? JSON.parse(this.detailData.determineFile)
          : [];
        this.determineFile.push(...wxScreenshot, ...mailScreenshot);
        this.approvalProcessVoList =
          this.detailData.approvalProcessVoList || [];
        if (this.detailData.paymentApprovalVoList[0]) {
          let list = this.detailData.paymentApprovalVoList[0].paymentVoList.map(
            (item) => item.directAmount
          );
          this.moneySum = NumberSub(NumberAdd(list), this.refundAmount);
          let list2 =
            this.detailData.paymentApprovalVoList[0].paymentVoList.map(
              (item) => item.rechargeAmount
            );
          this.moneySum2 = NumberAdd(list2);
        }
        let user = JSON.parse(sessionStorage.getItem("user"));
        this.idData =
          (this.detailData.approvalProcessVoList &&
            this.detailData.approvalProcessVoList.find((item) => {
              // if (index > 0) {
              //   this.isShowReturn = true
              // }
              return (
                item.approvalId == user.id &&
                (item.operationType == 0 || item.operationType == 2)
              );
            })) ||
          {};
        if (this.$route.query.id) {
          if (this.$route.query.state == 1 && this.editType == "show") {
            let isCopyData =
              (this.detailData.approvalProcessVoList &&
                this.detailData.approvalProcessVoList.find((item) => {
                  return item.approvalId == user.id && item.operationType == 1;
                })) ||
              {};
            let data = {
              id: isCopyData.id,
            };
            this.readUpdate(data);
          }
        }
        this.$refs["processform"].onload(this.detailData);
        this.detailData.arrivalReceipt = [];
        //计算回单可用委托，有返回值取返回值，没有就根据服务费计算
        // const { agentServiceCharge, serviceCharge } = this.detailData;
        if (this.detailData.businessType == 1) {
          getReturnMoneyApprovalById({ id: this.editId }).then((res) => {
            this.detailData.arrivalReceipt = res.data || [];
            this.detailData.arrivalReceipt.forEach((item) => {
              // if (agentServiceCharge || agentServiceCharge == 0) {
              //   item.availableMoney = (item.availableMoney || item.availableMoney == 0) ? item.availableMoney : NumberMul(NumberDiv(item.amount, NumberSub(1, NumberDiv(agentServiceCharge, 100))), NumberSub(1, NumberDiv(serviceCharge, 100))).toFixed(2)
              // } else {
              //   item.availableMoney = (item.availableMoney || item.availableMoney == 0) ? item.availableMoney : NumberMul(item.amount, NumberSub(1, NumberDiv(serviceCharge, 100))).toFixed(2)
              // }
              if (
                item.availAbleMoneyRecordList &&
                item.availAbleMoneyRecordList.length > 0
              ) {
                item.availAbleMoneyRecordList.forEach((item1) => {
                  this.$set(item1, "status", item1.approvalStatus);
                  // item1.status = item1.approvalStatus
                });
              }
            });
          });
        }

        if (this.detailData.businessType == 1) {
          // let param = {}
          // getReturnMoneyApprovalByCustomerId({ customerId: this.detailData.customerId, ...param }).then(res => {
          //   this.moneyList = res.data
          //   this.moneyList.forEach(item => [
          //     this.$set(item, 'unrecordedAmount', NumberSub(item.invoiceAmount, item.returnAmount))
          //   ])
          // })
          if (
            this.detailData.capitalStartTime &&
            this.detailData.capitalEndTime
          ) {
            this.submitTime = [
              this.detailData.capitalStartTime,
              this.detailData.capitalEndTime,
            ];
          } else {
            this.submitTime = [];
          }


          // let param = {
          //   returnMoneyStartDate: this.submitTime[0],
          //   returnMoneyEndDate: this.submitTime[1],
          // }
          // this.getReturnMoneyApprovalByCustomerId(param)
        }
      });
    },
    getReturnMoneyApprovalByCustomerId(param = {}) {
      getReturnMoneyApprovalByCustomerId({
        customerId: this.detailData.customerId,
        ...param,
      }).then((res) => {
        this.moneyList = res.data;
        this.moneyList.forEach((item) => [
          this.$set(
            item,
            "unrecordedAmount",
            NumberSub(item.invoiceAmount, item.returnAmount)
          ),
        ]);
      });
    },
    getSummaries1(param) {
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 1) {
          sums[index] = this.$options.filters.toThousands(
            NumberAdd(this.moneyList.map((item) => item.invoiceAmount || 0))
          );
        }
        if (index === 2) {
          sums[index] = this.$options.filters.toThousands(
            NumberAdd(this.moneyList.map((item) => item.returnAmount || 0))
          );
        }
        if (index === 3) {
          sums[index] = this.$options.filters.toThousands(
            NumberAdd(this.moneyList.map((item) => item.unrecordedAmount || 0))
          );
        }
        if (index === 4) {
          sums[index] = this.$options.filters.toThousands(
            NumberAdd(this.moneyList.map((item) => item.availableMoney || 0))
          );
        }
        if (index === 5) {
          sums[index] = this.$options.filters.toThousands(
            NumberAdd(this.moneyList.map((item) => item.usedMoney || 0))
          );
        }
        if (index === 6) {
          sums[index] = this.$options.filters.toThousands(
            NumberAdd(this.moneyList.map((item) => item.surplusAvailableMoney || 0))
          );
        }
      });

      return sums;
    },
    approveSuccess(state) {
      if (this.showPayment && !this.disabledPayment && state == "success") {
        this.submitPayment();
      } else {
        this.cancel();
      }
    },
    approveClick() {
      if (this.showPayment && !this.disabledPayment) {
        let { list = [], date = "" } = this.$refs["paymentForm"].commit() || {};
        let index = list.findIndex(
          (item) =>
            (item.rechargeAmount || item.rechargeAmount == 0) &&
            (item.directAmount || item.directAmount == 0) &&
            item.subjectId
        );
        if (index == -1) {
          this.$message.warning("请填写支付信息");
          return;
        }
        if (!date) {
          this.$message.warning("请选择付款日期");
          return;
        }
      }
      this.showDialog = true;
    },
    submitPayment() {
      //审批生成付款审批
      if (
        this.form.paymentApprovalVoList &&
        this.form.paymentApprovalVoList.length
      ) {
        //编辑支付信息
        let { date = "", list = [] } = this.$refs["paymentForm"].commit() || {};
        let data = {
          id: this.form.paymentApprovalVoList[0].id,
          updatePaymentReqList: list, //支付信息
          paymentDate: date, //支付日期
          updateInternalTransactionsReqList: this.$refs["insideForm"].commit(), //往来信息
        };
        updatePaymentApproval(data).then(() => {
          this.cancel();
        });
      } else {
        //新增支付信息
        // let processForm_2 = this.$refs['processForm_2'].commit() || []

        let { date = "", list = [] } = this.$refs["paymentForm"].commit() || {};
        let data = {
          approvalStatus: 1, //状态
          businessCondition:
            this.detailData.businessType == 0
              ? `${this.detailData.serviceCharge} (${this.detailData.interestFreeDays}) +${this.detailData.ratio}`
              : this.detailData.serviceCharge, //业务条件
          businessType: this.detailData.businessType, //业务类型(0.垫资,1.不垫资)
          customerId: this.detailData.customerId, //客户id
          channelId: this.detailData.channelId, //渠道
          demandId: this.detailData.id, //需求id
          income: this.detailData.income, //委托经营所得(元)
          isIntegral: this.detailData.isIntegral, //是否积分(0.是,1.否)
          remark: "", //备注
          paymentListFile: this.detailData.detailedListFile, //支付清单文件
          addPaymentReqList: list, //支付信息
          paymentDate: date, //支付日期
          // addApprovalProcessReqList: processForm_2,//审批流程
          addInternalTransactionsReqList: this.$refs["insideForm"].commit(), //往来信息
          isRelation: 1,
        };
        addPaymentApproval(data).then(() => {
          this.cancel();
        });
      }
    },
    cancel() {
      if (this.$route.query.id) {
        this.$router.go(-1);
      } else {
        this.$emit("input", 0);
      }
    },
  },
  computed: {
    isAgent() {
      return this.detailData.isAgent == 1;
    },
    // disabled() {
    //   return this.editType == 'show' || this.editType == 'approve'
    // },
    showPayment() {
      let show = false;
      if (this.detailData.isIntegral != 1) {
        return false;
      }
      if (this.editType == "approve" || this.editType == "show") {
        let user = JSON.parse(sessionStorage.getItem("user"));
        let item = this.detailData.approvalProcessVoList
          ? this.detailData.approvalProcessVoList.find(
              (item) =>
                item.approvalId == user.id &&
                (item.operationType == "0" || item.operationType == "2")
            )
          : {};
        show = item.isUpdate == 1;
      }
      if (
        this.editType == "show" &&
        this.detailData.paymentApprovalVoList &&
        this.detailData.paymentApprovalVoList.length
      ) {
        show = true;
      }
      return show;
    },
    disabledPayment() {
      let disabled = true;
      if (this.editType == "approve" && this.detailData.isIntegral == 1) {
        let user = JSON.parse(sessionStorage.getItem("user"));
        let item = this.detailData.approvalProcessVoList
          ? this.detailData.approvalProcessVoList.find(
              (item) =>
                item.approvalId == user.id &&
                (item.operationType == "0" || item.operationType == "2")
            )
          : {};
        disabled = !item.isUpdate;
      }
      return disabled;
    },
    showIssue() {
      let show = 0;
      // if (this.detailData.businessType != 1) {
      //   return false
      // }

      if (this.editType == "approve") {
        let user = JSON.parse(sessionStorage.getItem("user"));
        let item = this.detailData.approvalProcessVoList
          ? this.detailData.approvalProcessVoList.find(
              (item) =>
                item.approvalId == user.id &&
                (item.operationType == "0" || item.operationType == "2")
            )
          : {};
        show = item.isUpdate;
      }
      return show;
    },
  },
};
</script>
<style lang="scss" scoped>
.basic-info-container {
  position: relative;
  font-family: PingFang SC;
  font-size: 14px;
  background: #ffffff;
  border-radius: 8px;
  margin: 14px 0;
  .payment-information {
    // display: flex;
    width: 100% !important;
    margin: 0 18px 0 !important;
  }
  .divder-top {
    transform: scaleY(0.5);
  }
  // padding: 54px 16px;
  .basic-info {
    // margin-left: 16px;
    padding: 16px 0 0 20px;
    font-weight: 700;
    margin-left: 12px;
    // font-size: 16px;
  }
  .file-info {
    font-weight: 700;
    margin: 0 0 0 12px;
  }
  .internal-info {
    padding: 0;
    font-weight: 700;
    font-size: 14px;
    margin: 0 0 0 16px;
    color: #3a7dff;
  }
  .basic-info:before {
    display: inline-block;
    content: "";
    width: 4px;
    height: 18px;
    position: absolute;
    background-color: #3a7dff;
    left: 16px;
    top: 18px;
    // margin-right: 10px;
  }
  .money-info {
    padding: 0 20px;
  }
  .border-solid {
    margin: 0 16px 18px;
    border-top: 1px solid rgba(0, 0, 0, 0.15);
    transform: scaleY(0.5);
  }
  .basic-info-content {
    padding: 0 16px 18px;
    &.payment-info {
      padding: 0 16px 5px;
    }
    .rol-content {
      padding-top: 16px;
    }
    .mb {
      padding-top: 16px;
      margin-bottom: 20px;
    }
    .rol-content:nth-of-type(1) {
      padding-top: 0;
    }
    .grid-content {
      // width: 33.33%;
      font-weight: 400;
      font-size: 14px;
      // margin-bottom: 10px;
      color: #626468;
      .col-text {
        font-size: 14px;
        color: #303132;
        &.receipt {
          color: #3a7dff;
          cursor: pointer;
        }
        &.red {
          color: #f14f44;
        }
        &.weight {
          font-size: 16px;
          font-weight: 700;
        }
        &.weight1 {
          font-size: 16px;
          font-weight: 700;
          color: #626468;
        }
      }
      &.top {
        display: flex;
        align-items: center;
        .top-img {
          margin: 0 5px;
        }
      }
      &.bold {
        color: #303132;
        font-weight: 700;
        font-size: 15px;
      }
    }
    .grid-content1 {
      width: 33.33%;
      font-weight: 400;
      font-size: 14px;
      margin-bottom: 16px;
      color: #626468;
      .col-text {
        font-size: 14px;
        color: #303132;
        &.receipt {
          color: #3a7dff;
          cursor: pointer;
        }
        &.red {
          color: #f14f44;
        }
        &.weight {
          font-size: 16px;
          font-weight: 700;
        }
        &.weight1 {
          font-size: 16px;
          font-weight: 700;
          color: #626468;
        }
      }
      &.top {
        display: flex;
        align-items: center;
        .top-img {
          margin: 0 5px;
        }
      }
      &.bold {
        color: #303132;
        font-weight: 700;
        font-size: 15px;
      }
    }
    .grid-content12b {
      width: 25%;
      font-weight: 400;
      font-size: 14px;
      margin-bottom: 16px;
      color: #626468;
      .col-text {
        font-size: 14px;
        color: #303132;
        &.receipt {
          color: #3a7dff;
          cursor: pointer;
        }
        &.red {
          color: #f14f44;
        }
        &.weight {
          font-size: 16px;
          font-weight: 700;
        }
        &.weight1 {
          font-size: 16px;
          font-weight: 700;
          color: #626468;
        }
      }
      &.top {
        display: flex;
        align-items: center;
        .top-img {
          margin: 0 5px;
        }
      }
      &.bold {
        color: #303132;
        font-weight: 700;
        font-size: 15px;
      }
    }
    .remark {
      line-height: 30px;
      // padding: 16px 0 0;
      .col-text {
        color: #303132;
      }
    }
    .business-conditions {
      font-weight: 700;
      color: #3a7dff;
    }
  }
  .table-header-row {
    background-color: #0a3a8b;
  }
  .img {
    height: 48px;
  }
  //产品清单
  .product-header {
    margin: 0 16px;
    height: 54px;
    line-height: 54px;
    background-color: #f4f8ff;
    .grid-content {
      padding-left: 10px;
      color: #3a7dff;
      font-size: 16px;
      font-weight: 700;
    }
  }
  .product-content {
    margin: 0 16px;
    height: 50px;
    line-height: 50px;
    // border-bottom: 1px solid #d0d0d0;
    .grid-content {
      font-size: 15px;
      padding-left: 10px;
      color: #626468;
    }
    .divder-product {
      transform: scaleY(0.5);
    }
  }
  .product-content:last-of-type {
    .divder-product {
      transform: scaleY(0);
    }
  }
  // .product-content:last-of-type {
  //   margin: 0 16px;
  //   height: 50px;
  //   line-height: 50px;
  //   // border-bottom: none;
  //   .grid-content {
  //     font-size: 15px;
  //     padding-left: 10px;
  //     color: #626468;
  //   }
  // }
  //业务凭证
  .business-outer-container {
    display: flex;
    flex-wrap: wrap;
    margin: 0 16px;
    .business-container {
      width: 32%;
      margin: 10px 0.5%;
      .business-item {
        display: flex;
        flex-wrap: wrap;
        cursor: pointer;
        .img-item {
          width: 89px;
          height: 70px;
          margin-left: 18px;
          margin-bottom: 18px;
          .item-content {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #303132;
            &:hover {
              color: #3a7dff;
            }
          }
        }
        .img-item2 {
          width: 64px;
          height: 64px;
          margin: 0 10px;
        }
        .img-item:first-child {
          width: 89px;
          height: 70px;
          margin: 0;
          cursor: pointer;
          .item-content {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #303132;
            &:hover {
              color: #3a7dff;
            }
          }
        }
      }
      .file-data {
        color: #3a7dff;
        font-size: 14px;
        font-weight: 700;
      }
    }
    .business-container2b {
      width: 25%;
      .sb-title {
        display: block;
        margin: 12px 0 10px 0;
        font-weight: 600;
      }
      .business-item {
        display: flex;
        flex-wrap: wrap;
        cursor: pointer;
        .img-item {
          width: 89px;
          height: 70px;
          margin-left: 18px;
          margin-bottom: 18px;
          .item-content {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #303132;
            &:hover {
              color: #3a7dff;
            }
          }
        }
        .img-item2 {
          width: 64px;
          height: 64px;
          margin: 0 10px;
        }
        .img-item:first-child {
          width: 89px;
          height: 70px;
          margin: 0;
          cursor: pointer;
          .item-content {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #303132;
            &:hover {
              color: #3a7dff;
            }
          }
        }
      }
      .file-data {
        color: #3a7dff;
        font-size: 14px;
        font-weight: 700;
      }
    }
    .business-container:last-of-type {
      .business-item-container {
        display: flex;
        flex-wrap: wrap;
      }
      .business-item {
        display: inline-block;
      }
      .business-item-outer {
        display: inline-block;
      }
    }
  }

  .subject-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .subject-item {
      width: 33.33%;
      margin-bottom: 15px;
      // background-color: pink;
      .grid-content {
        font-weight: 400;
        color: #626468;
        margin: 10px 0;
        .col-text {
          color: #303132;
          &.receipt {
            color: #3a7dff;
            cursor: pointer;
          }
          &.red {
            color: #f14f44;
          }
        }
      }
    }
  }
  .internal-container {
    display: flex;
    flex-wrap: wrap;
    .internal-transactions {
      margin-bottom: 15px;
    }
  }
  .internal-transactions {
    width: 33.33%;
    // background-color: pink;
    .grid-content {
      font-weight: 400;
      color: #626468;
      margin: 10px 0;
      .col-text {
        color: #303132;
        &.receipt {
          color: #3a7dff;
          cursor: pointer;
        }
        &.red {
          color: #f14f44;
        }
      }
    }
  }
}
.statistical-time {
  margin-right: 10px;
  font-size: 14px;
  font-weight: 700;
}
.return-money-dialog {
  overflow: scroll;
}
.explain-fields {
  &:after {
    display: inline-block;
    content: "";
    width: 14px;
    height: 14px;
    background: url("../../../../assets/img/字段解释.png") no-repeat;
    background-size: contain;
    vertical-align: middle;
    margin-left: 5px;
    cursor: pointer;
  }
}
.detail {
  ::v-deep .el-table__indent {
    padding: 0 !important;
  }
  ::v-deep .el-table__placeholder {
    width: 0;
  }
}
::v-deep .return-money-date {
  padding-left: 30px !important;
}
::v-deep .el-dialog__title {
  font-weight: 700;
}
::v-deep .el-image-viewer__wrapper {
  z-index: 2005;
}
::v-deep .el-table__footer-wrapper .el-table__footer tbody tr {
  font-weight: 700;
  background-color: #f4f8ff !important;
}
::v-deep .el-table__footer-wrapper tbody td.el-table__cell {
  background-color: #f4f8ff !important;
}
</style>