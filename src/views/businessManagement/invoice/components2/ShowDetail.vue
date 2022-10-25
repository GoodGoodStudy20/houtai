<template>
  <div>
    <div class="form-title">发票信息</div>
    <!-- 基础信息 -->
    <div class="basic-info-container">
      <h3 class="basic-info">开票要求</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1">
            编号：<span class="col-text">{{ detailInfo.number }}</span>
          </div>
          <div class="grid-content1">
            客户：<span class="col-text">{{
              detailInfo.customerVo.abbreviated
            }}</span>
          </div>
          <div class="grid-content1">
            渠道：<span class="col-text">{{
              detailInfo.customerChannelVo.name
            }}</span>
          </div>
          <div class="grid-content1">
            发票类型：<span class="col-text" v-if="InvoiceTypeList[detailInfo.type]">{{ InvoiceTypeList[detailInfo.type].label }}</span>
          </div>

          <div class="grid-content1">
            开票内容：<span class="col-text">{{
              detailInfo.invoicingContent
            }}</span>
          </div>
          <div class="grid-content1">
            开票金额（元）：<span class="col-text">{{
              detailInfo.invoicingAmount || 0 | toThousands
            }}</span>
          </div>
          <div class="grid-content1">
            税率（%）：<span class="col-text">{{ detailInfo.taxRate }}</span>
          </div>
          <div class="grid-content1">
            发票种类：<span class="col-text" v-if="InvoiceType[detailInfo.invoicingType]">{{ InvoiceType[detailInfo.invoicingType].label }}</span>
          </div>
          <div class="grid-content1">
            预计回款日期：<span class="col-text">{{
              detailInfo.estimateReturnMoneyDate
            }}</span>
          </div>

          <div class="" style="display: block">
            开票主体：
            <span class="col-text" v-for="(item, index) in detailInfo.subjectVoList" :key="index">
              {{ item.abbreviated || 0 }}
            </span>
          </div>
          <div class="grid-content2" style="width: 100%; margin-top: 20px">
            <span class="mmw"> 备注：</span>
            <span class="col-text">{{ detailInfo.remark || "--" }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- >结算清单(盖章文件) -->
    <div class="basic-info-container">
      <h3 class="basic-info">结算清单(盖章文件)</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1">
            <UploadFile v-model="sealDetailedListFile" disabled />
          </div>
        </div>
      </div>
    </div>
    <!-- 开票详情 -->
    <div class="basic-info-container" v-show="showPayment">
      <h3 class="basic-info">开票详情</h3>
      <div class="basic-info-content">
        <div class="df-fw" v-show="!disabledPayment">
          <Form6 ref="form6" :editType="editType" :disabled="disabledPayment" />
        </div>
        <template v-if="disabledPayment">
          <div class="df-fw bm">
            <div class="grid-content1">
              <span class="zmw">开票人：</span
              ><ChooseUser
                v-model="detailInfo.invoicingUserId"
                style="width: 300px"
                disabled
              ></ChooseUser>
            </div>
            <div class="grid-content1">
              开票时间：
              <span class="col-text">{{
                detailInfo.invoicingDate || "--"
              }}</span>
            </div>
            <div class="grid-content1">
              备注：
              <span class="col-text">{{ detailInfo.viceRemark || "--" }}</span>
            </div>
            <div class="grid-content1" style="width: 100%">
              开票主体：
              <span
                class="col-text"
                v-for="(item, index) in detailInfo.subjectVoList"
                :key="index"
                >{{ item.abbreviated }}【本月已开金额
                {{ item.totalInvoicingAmount }}元，剩余额度{{
                  item.surplusInvoicingAmount
                }}元，剩余份数{{ item.surplusInvoicingQuantity }}份】</span
              >
            </div>
          </div>
          <div
            class="df-fw bm"
            v-for="(item, index) in detailInfo.invoiceFileVoList"
            :key="index"
          >
            <div class="grid-content1">
              发票号码：
              <span class="col-text">{{ item.invoicingCode || "--" }}</span>
            </div>
            <div class="grid-content1">
              金额：
              <span class="col-text">{{ item.invoicingAmount || "--" }}</span>
            </div>
            <div class="grid-content1">
              税额：
              <span class="col-text">{{
                item.invoicingTaxAmount || "--"
              }}</span>
            </div>
            <div class="grid-content1">
              价税合计：
              <span class="col-text">{{ item.priceTaxTotal || "--" }}</span>
            </div>
            <div class="grid-content1" v-if="item.invoiceFile.length != 0">
              <span class="mmw"> 发票：</span>
              <UploadFile
                style="height: 20px; margin-top: -61px"
                v-model="item.invoiceFile"
                disabled
              ></UploadFile>
            </div>
          </div>
          <div style="font-weight: 700">
            总价税合计：{{ Number(totalPrice) || 0 | toThousands }}
          </div>
        </template>
      </div>
    </div>
    <!-- 客户发票信息 customerVo.invoiceVo -->
    <div class="basic-info-container" v-if="
        customerId && detailInfo.customerVo && detailInfo.customerVo.invoiceVo
      ">
      <h3 class="basic-info">客户发票信息</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1">
            <span class="mw">公司名称：</span><span class="col-text">{{
              detailInfo.customerVo.invoiceVo.name
            }}</span>
          </div>
          <div class="grid-content1">
            税号：<span class="col-text">{{
              detailInfo.customerVo.invoiceVo.dutyParagraph
            }}</span>
          </div>
          <div class="grid-content1">
            <span class="mw">注册地址：</span><span class="col-text">{{
              detailInfo.customerVo.invoiceVo.registeredAddress
            }}</span>
          </div>
          <div class="grid-content1">
            账号：<span class="col-text">{{
              detailInfo.customerVo.invoiceVo.account
            }}</span>
          </div>
          <div class="grid-content1">
            开户行：<span class="col-text">{{
              detailInfo.customerVo.invoiceVo.openingBank
            }}</span>
          </div>
          <div class="grid-content1">
            电话：<span class="col-text">{{
              detailInfo.customerVo.invoiceVo.phone
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 物流信息 -->
    <div class="basic-info-container" v-if="showForm4">
      <h3 class="basic-info">物流信息</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1">
            收货人：<span class="col-text">{{
              detailInfo.recipient || "--"
            }}</span>
          </div>
          <div class="grid-content1">
            收货电话：<span class="col-text">{{
              detailInfo.recipientPhone || "--"
            }}</span>
          </div>
          <div class="grid-content1">
            收货地址：<span class="col-text">{{
              detailInfo.recipientAddress || "--"
            }}</span>
          </div>
          <div class="grid-content1">
            物流单号：<span class="col-text">{{
              detailInfo.logisticsOrderNo || "--"
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 回款信息 invoiceReturnMoneyRecordVoList -->
    <div class="basic-info-container" v-if="editType == 'show' && detailInfo.approvalStatus == 2">
      <h3 class="basic-info">回款信息</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <Form5 :list="list" />
        </div>
      </div>
    </div>
    <!-- 流程 -->
    <div class="basic-info-container">
      <h3 class="basic-info">流程</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <ProcessForm ref="form8" disabled type="2" />
        </div>
      </div>
    </div>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" v-debounce="submitBack" v-if="!disabled || showIssue == 1">保存返回</el-button>
      <el-button type="primary" v-debounce="submitTo" v-if="!disabled">提交</el-button>
      <el-button type="primary" v-debounce="approveClick" v-if="editType == 'approve' && showIssue == 0">审批</el-button>
      <el-button type="danger" @click="returnClick" v-if="editType == 'approve'">退回</el-button>
    </div>
    <ApproveDialog v-model="showDialog" v-if="showDialog" :idData="idData" :type="2" :relationshipId="editId" @success="approveSuccess" :showIssue="showIssue" />
    <ReturnDialog v-model="showReturnDialog" v-if="showReturnDialog" :approvalProcessVoList="detailInfo.approvalProcessVoList" :idData="idData" :type="2" :relationshipId="editId" @success="returnApproveSuccess" :showIssue="showIssue" />
  </div>
</template>

<script>
import Form5 from "./Form5";
import Form6 from "./Form6";
import ProcessForm from "../../components/ProcessForm";
// import ChooseCustomer from "@/components/ChooseCustomer/index.vue";
import UploadFile from "@/components/UploadFile/index.vue";
import ChooseUser from "@/components/ChooseUser/index.vue";
// import UploadImgDistinguish from "@/components/UploadImgDistinguish/index.vue";
import ApproveDialog from "../../components/ApproveDialog";
import ReturnDialog from "../../components/ReturnDialog";
import {
  updateInvoiceApproval,
  getInvoiceApprovalInfo,
  updateIsRead,
  getSubjectList,
} from "@/api/index.js";
import { InvoiceType, InvoiceTypeList } from "@/utils/field.js";
export default {
  components: {
    // ChooseCustomer,
    UploadFile,
    Form5,
    Form6,
    ProcessForm,
    ChooseUser,
    // UploadImgDistinguish,
    ApproveDialog,
    ReturnDialog,
  },
  props: ["value", "editId", "editType"],
  data() {
    return {
      showReturnDialog: false,
      showForm4: false,
      list: [
        {
          subjectId: "", //主体id
          invoiceFileVoList: [
            {
              invoicingCode: "",
              invoicingAmount: "",
              invoicingTaxAmount: "",
              priceTaxTotal: "",
              invoiceFile: [],
            },
          ],
        },
      ],
      showDialog: false,
      form: {},
      idData: {},
      customerId: "",
      detailInfo: { customerChannelVo: {}, customerVo: {} },
      InvoiceTypeList: InvoiceTypeList, // 发票类型
      InvoiceType: InvoiceType, // 发票种类
      subjectList: [], // 开票主体
      totalPrice: 0, // 总价
      sealDetailedListFile: [], // 结算清单(盖章文件)
    };
  },
  watch: {
    "form.type"(val) {
      if (val || val == 0) {
        this.getSubjectList();
      }
    },
  },
  computed: {
    disabled() {
      return this.editType == "show" || this.editType == "approve";
    },
    disabled2() {
      let sealDetailedListFile = this.form.sealDetailedListFile
        ? JSON.parse(this.form.sealDetailedListFile)
        : [];
      return (
        this.editType == "show" ||
        (this.editType == "approve" && sealDetailedListFile > 0)
      );
    },
    showPayment() {
      let show = false;
      // this.$nextTick(() => {
      if (this.editType == "approve") {
        let user = JSON.parse(sessionStorage.getItem("user"));
        let item = this.form.approvalProcessVoList
          ? this.form.approvalProcessVoList.find((item) => {
            return (
              item.approvalId == user.id &&
              (item.operationType == 0 || item.operationType == 2)
            );
          })
          : {};
        show = !!item.isUpdate;
      }
      if (
        this.editType == "show" &&
        this.form.invoiceFileVoList &&
        this.form.invoiceFileVoList.length > 0
      ) {
        show = true;
      }
      // });
      return show;
    },
    disabledPayment() {
      let disabled = true;
      if (this.editType == "approve") {
        let user = JSON.parse(sessionStorage.getItem("user"));
        let item = this.form.approvalProcessVoList
          ? this.form.approvalProcessVoList.find((item) => {
            return (
              item.approvalId == user.id &&
              (item.operationType == 0 || item.operationType == 2)
            );
          })
          : {};
        disabled = !item.isUpdate;
      }
      return disabled;
    },
    showIssue() {
      let show = 0; //审批
      if (this.editType == "approve") {
        let user = JSON.parse(sessionStorage.getItem("user"));
        let item = this.form.approvalProcessVoList
          ? this.form.approvalProcessVoList.find((item) => {
            return (
              item.approvalId == user.id &&
              (item.operationType == 0 || item.operationType == 2)
            );
          })
          : {};
        show = item.operationType;
      }
      return show;
    },
  },
  mounted() {
    if (this.editId) {
      this.onload();
    }
  },
  methods: {
    jp(file) {
      if (file) return JSON.parse(file);
    },
    //修改已读
    readUpdate(data) {
      updateIsRead(data).then((res) => {
      });
    },
    // 开票主体
    getSubjectList(params = {}) {
      getSubjectList({ ...params, type: this.form.type }).then((res) => {
        this.subjectList = res.data;
      });
    },
    // 物流信息是否展示
    typeChange(type) {
      this.showForm4 = [0, 1].includes(type);
    },
    onload() {
      getInvoiceApprovalInfo({ id: this.editId }).then((res) => {
        let result = res.data || {};
        this.form = result;
        this.detailInfo = result;
        this.detailInfo.invoiceFileVoList.map((item) => {
          item.invoiceFile = JSON.parse(item.invoiceFile);
          this.totalPrice += Number(item.priceTaxTotal);
        });
        this.sealDetailedListFile = JSON.parse(
          this.detailInfo.sealDetailedListFile
        );
        this.$refs["form6"].onload(result); // 流程
        this.$refs["form8"].onload(result); // 流程
        // 物流信息是否展示
        this.typeChange(result.type);
        if (result.customerVo) {
          this.customerId = result.customerVo.invoiceVo.id;
        }
        this.list = result.invoiceReturnMoneyRecordVoList;
        let user = JSON.parse(sessionStorage.getItem("user"));
        this.idData =
          (result.approvalProcessVoList &&
            result.approvalProcessVoList.find((item) => {
              return (
                item.approvalId == user.id &&
                (item.operationType == 0 || item.operationType == 2)
              );
            })) ||
          {};
        if (this.$route.query.id) {
          if (this.$route.query.state == 1 && this.editType == "show") {
            let isCopyData =
              (result.approvalProcessVoList &&
                result.approvalProcessVoList.find((item) => {
                  return item.approvalId == user.id && item.operationType == 1;
                })) ||
              {};
            let data = {
              id: isCopyData.id,
            };
            this.readUpdate(data);
          }
        }
      });
    },
    cancel() {
      if (this.$route.query.id) {
        this.$router.go(-1);
      } else {
        this.$emit("input", 0);
      }
    },
    // 保存返回
    submitBack() {
      this.submit(0, "back");
    },
    // 提交
    submitTo() {
      this.submit(1, "back");
    },
    submit(state, type = 0) {
      let form = this.form1Commit();
      if (!form) return;
      let form4 = this.form4Commit();
      let form7 = this.form7Commit();
      if (!form7) return;
      let data = {
        ...form,
        // ...form3,
        ...form4,
        ...form7,
        // addApprovalProcessReqList: form8,
        approvalStatus: state,
      };
      let success = (res) => {
        if (res.code != 200) {
          this.$message.error(res.msg || "操作失败");
          return;
        }
        this.$message.success("操作成功");
        if (type == "back") {
          this.cancel();
        }
      };
      if (this.editType == "approve") {
        data.id = this.editId;
        alert(111);
        let form6 = this.$refs["form6"].commit();
        if (!form6) return;
        data.updateInvoiceFileReqList = form6.InvoiceFileReqList;
        data.invoicingUserId = form6.invoicingUserId;
        data.viceRemark = form6.viceRemark;
        data.invoicingDate = form6.invoicingDate;
        if (form6.InvoiceFileReqList) {
          data.approvalStatus = "";
        }
        updateInvoiceApproval(data).then(success);
      }
    },
    // form1 commit
    form1Commit() {
      // if (!this.$validate("form")) return;
      if (Array.isArray(this.form.subjectListId)) {
        this.form.subjectListId = this.form.subjectListId.join(",");
      }
      let obj = Object.assign({}, this.form);
      return obj;
    },
    // form4 commit
    form4Commit() {
      if (!this.form.contractFile || !this.form.contractFile.length) return;
      let obj = Object.assign({}, this.form);
      obj.contractFile = JSON.stringify(obj.contractFile);
      return obj;
    },
    // form6 commit
    // form6Commit() {
    //   let list = [];
    //   let isCommit = true;
    //   this.list.forEach((item) => {
    //     item.invoiceFileVoList.forEach((it) => {
    //       if (it.invoicingCode == "") {
    //         this.$message.error({
    //           message: "请输入发票号码",
    //           duration: 1500,
    //         });
    //         isCommit = false;
    //         return;
    //       }

    //       if (it.invoiceFile.length == 0) {
    //         this.$message.error({
    //           message: "请上传发票文件",
    //           duration: 1500,
    //         });
    //         isCommit = false;
    //         return;
    //       }
    //       if (it.invoicingAmount === "") {
    //         this.$message.error({
    //           message: "请输入发票金额",
    //           duration: 1500,
    //         });
    //         isCommit = false;
    //         return;
    //       }

    //       if (it.invoicingTaxAmount === "") {
    //         this.$message.error({
    //           message: "请输入发票税额",
    //           duration: 1500,
    //         });
    //         isCommit = false;
    //         return;
    //       }
    //       if (it.priceTaxTotal === "") {
    //         this.$message.error({
    //           message: "请输入发票总额",
    //           duration: 1500,
    //         });
    //         isCommit = false;
    //         return;
    //       }
    //     });
    //   });
    //   if (!isCommit) return;
    //   this.list.forEach((item) => {
    //     let list2 = item.invoiceFileVoList
    //       .filter(
    //         (item2) =>
    //           item2.invoicingCode &&
    //           item2.invoiceFile &&
    //           item2.invoiceFile.length
    //       )
    //       .map((item1) => {
    //         return {
    //           invoicingCode: item1.invoicingCode, //发票代码
    //           invoicingAmount: item1.invoicingAmount, //金额
    //           invoicingTaxAmount: item1.invoicingTaxAmount, //税额
    //           priceTaxTotal: item1.priceTaxTotal, //总价
    //           invoiceFile: JSON.stringify(item1.invoiceFile), //发票文件
    //           // id: item.id || '',      //主体id
    //           id: item1.id || "",
    //           subjectId:
    //             item1.subjectId ||
    //             (item1.subjectVo && item1.subjectVo.id) ||
    //             "",
    //         };
    //       });
    //     list = list.concat(list2);
    //   });

    //   if (!this.$validate("form")) return;
    //   if (list && list.length == 0) {
    //     this.$message.error({
    //       message: "请输入一条发票信息",
    //       duration: 1500,
    //     });
    //     return;
    //   }
    //   let count = 0;
    //   list.forEach((item) => {
    //     count += Number(item.priceTaxTotal);
    //   });
    //   if (count > this.form.invoicingAmount) {
    //     this.$message.error("上传的发票总额不能大于开票金额");
    //     return;
    //   }
    //   // return
    //   let obj = Object.assign({}, this.form);
    //   obj.InvoiceFileReqList = list;
    //   return obj;
    // },
    // form7 commit
    form7Commit() {
      if (
        !this.form.sealDetailedListFile ||
        !this.form.sealDetailedListFile.length
      ) {
        this.$message.warning("请上传结算清单(盖章文件)");
        return;
      }
      let obj = Object.assign({}, this.form);
      obj.sealDetailedListFile = JSON.stringify(obj.sealDetailedListFile);
      return obj;
    },
    // 点击权限弹窗
    approveClick() {
      if (this.showPayment && !this.disabledPayment) {
        let form6 = this.$refs["form6"].commit();
        if (!form6) return;
      }
      this.showDialog = true;
    },
    // 权限弹窗
    approveSuccess() {
      if (this.showPayment && !this.disabledPayment) {
        let form6 = this.$refs["form6"].commit();
        let data = {
          ...form6,
          id: this.editId,
        };
        data.updateInvoiceFileReqList = form6.InvoiceFileReqList;
        data.approvalStatus = "";
        let success = (res) => {
          if (res.code != 200) {
            this.$message.error(res.msg || "操作失败");
            return;
          }
          this.$message.success("操作成功");
          this.cancel();
        };
        updateInvoiceApproval(data).then(success);
      } else {
        this.cancel();
      }
    },
    // 退回
    returnApproveSuccess() {
      if (this.showPayment && !this.disabledPayment) {
        this.$message.success("操作成功");
        this.cancel();
      } else {
        this.cancel();
      }
    },

    // 退回
    returnClick() {
      this.showReturnDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
</style>