<template>
  <div>
    <div class="form-title">{{ editType | typeName }}回款信息</div>
    <div class="basic-info-container">
      <h3 class="basic-info">到账信息</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1">
            回单编号：<span class="col-text">{{ detailInfo.number }}</span>
          </div>
          <div class="grid-content1">
            付款方：<span class="col-text">{{
              detailInfo.payerVo.abbreviated
            }}</span>
          </div>
          <div class="grid-content1">
            收款主体：<span class="col-text">{{
              detailInfo.subjectVo.abbreviated
            }}</span>
          </div>
          <div class="grid-content1">
            <span class="mw">收款账户：</span>
            <span class="col-text">
              {{ detailInfo.accountTaxVo.name }}({{
                detailInfo.accountTaxVo.account
              }})
            </span>
          </div>
          <div class="grid-content1">
            收款金额(元)：<span class="col-text">{{
              detailInfo.amount || 0 | toThousands
            }}</span>
          </div>
          <div class="grid-content1">
            到账时间：<span class="col-text">{{
              detailInfo.returnMoneyDate
            }}</span>
          </div>
          <div class="grid-content1">
            回单号：<span class="col-text">{{ detailInfo.bankFlow }}</span>
          </div>
          <div class="grid-content1">
            备注：<span class="col-text">{{ detailInfo.remark || "--" }}</span>
          </div>

        </div>
      </div>
      <div class="basic-info-content flex1">
        <div>收款凭证：</div>
        <div class="df-fw">
          <div class="grid-content1">
            <Form3 ref="form3" :disabled="disabled"></Form3>
          </div>
        </div>
      </div>
    </div>
    <div class="basic-info-container" v-show="showPayment">
      <h3 class="basic-info">业务信息</h3>
      <div class="basic-info-content">
        <div class="df-fw" v-show="!disabledPayment">
          <Form2 ref="form2" :editId="detailInfo.id" :disabled="disabledPayment"></Form2>
        </div>
        <div v-if="disabledPayment">
          <InvoiceDetail :businessType="detailInfo.businessType" ref="invoiceDetail"></InvoiceDetail>
        </div>
      </div>
    </div>
    <div class="basic-info-container" v-show="showPayment">
      <h3 class="basic-info">结算清单</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="">
            <Form4 ref="form4" :disabled="disabledPayment"></Form4>
          </div>
        </div>
      </div>
    </div>
    <div class="basic-info-container">
      <h3 class="basic-info">流程</h3>
      <div class="basic-info-content">
        <ProcessForm ref="form5" :disabled="disabled" type="3"></ProcessForm>
      </div>
    </div>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <!-- <el-button type="primary" v-debounce="temporaryStorage" v-if="!disabled">保存</el-button> -->
      <el-button type="primary" v-debounce="submitBack" v-if="!disabled">保存返回</el-button>
      <el-button type="primary" v-debounce="submitTo" v-if="!disabled">提交</el-button>
      <el-button type="primary" @click="approveClick" v-if="editType == 'approve'">审批</el-button>
      <el-button type="danger" @click="returnClick" v-if="editType == 'approve'">退回</el-button>
      <el-button type="danger" @click="TransferClick" v-if="editType == 'approve'">转让</el-button>
    </div>
    <ApproveDialog v-model="showDialog" v-if="showDialog" :idData="idData" :showIssue="showIssue" :type="3" :relationshipId="editId" @success="approveSuccess"></ApproveDialog>
    <ReturnDialog v-model="showReturnDialog" v-if="showReturnDialog" :approvalProcessVoList="detailInfo.approvalProcessVoList" :idData="idData" :type="3" :relationshipId="editId" @success="returnApproveSuccess" :showIssue="showIssue"></ReturnDialog>
    <TransferDialog v-model="showTransferDialog" v-if="showTransferDialog" :idData="idData" :type="3" :relationshipId="editId" @success="returnApproveSuccess"></TransferDialog>
  </div>
</template>

<script>
import { BusinessType } from "@/utils/field.js";
import {
  addReturnMoneyApproval,
  updateReturnMoneyApproval,
  getReturnMoneyApprovalInfo,
  updateIsRead,
  updateApproval,
  getInvoiceApprovalById
} from "@/api/index.js";
import Form2 from "./Form2";
import Form3 from "./Form3";
import Form4 from "./Form4";
import InvoiceDetail from "./InvoiceDetail";
import ProcessForm from "../../components/ProcessForm";
import ApproveDialog from "../../components/ApproveDialog";
import ReturnDialog from "../../components/ReturnDialog";
import TransferDialog from "./TransferDialog";
export default {
  name: "CollectionForm",
  components: {
    Form2,
    Form3,
    Form4,
    ApproveDialog,
    ProcessForm,
    ReturnDialog,
    InvoiceDetail,
    TransferDialog
  },
  props: ["value", "editId", "editType"],
  data() {
    return {
      activeNames: ["1", "2", "3", "4", "5"],
      showDialog: false,
      showReturnDialog: false,
      showTransferDialog: '',
      form: {},
      idData: {},
      detailInfo: {
        payerVo: {},
        subjectVo: {},
        accountTaxVo: {},
        customerVo: {},
        customerChannelVo: {},
        invoiceApprovalVoList: [],
      },
      options1: [],
      ChannelType: [],
      subjectList: [],
      BusinessType: BusinessType,
      invoiceApprovalVoList: []
    };
  },
  mounted() {
    if (this.editId) {
      this.$nextTick(async () => {
        await this.onload();

      })
    }
    if (this.editType == "add" || this.editType == "copy") {
      this.$refs["form5"].onload();
    }
  },
  methods: {
    changeDiretor(data) {
      this.$refs["form5"].diretorChange(data);
    },
    //修改已读
    readUpdate(data) {
      updateIsRead(data).then(() => { });
    },
    receiptFile(item) {
      this.$refs["form3"].change(item);
    },
    subjectChange(item) {
      this.options1 = item.accountTaxVoList || [];
    },
    //查询开票信息列表
    getInvoiceApprovalById() {
      getInvoiceApprovalById({ id: this.editId }).then(res => {
        let result = res.data || []
        this.invoiceApprovalVoList = res.data

        this.$refs['invoiceDetail'].onload(this.invoiceApprovalVoList)
      })
    },

    onload() {
      getReturnMoneyApprovalInfo({ id: this.editId }).then((res) => {
        if (res.code !== 200) return
        this.getInvoiceApprovalById()
        let result = res.data || {};
        this.detailInfo = result;

        this.form = result;
        this.subjectChange(this.form.subjectVo);
        if (this.editType == "copy") {
          result.submitTime = "";
          result.number = "";
          result.approvalProcessVoList = result.approvalProcessVoList.map(
            (item) => {
              item.evaluateContent = "";
              item.updateTime = "";
              item.isApproval = "";
              return item;
            }
          );
        }
        //计算发票总金额
        let _sumMoney = 0;
        if (result.invoiceApprovalVoList) {
          for (let invoice of result.invoiceApprovalVoList) {
            _sumMoney += invoice.invoicingAmount;
          }
        }
        this.detailInfo.invoicingAmount = _sumMoney;
        this.$refs["form2"].onload(result);
        this.$refs["form3"].onload(result);
        this.$refs["form4"].onload(result);
        this.$refs["form5"].onload(result);
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
    temporaryStorage() {
      this.submit(0);
    },
    submitBack() {
      this.submit(0, "back");
    },
    submitTo() {
      this.submit(1, "back");
    },
    submit(state, type = 0) {
      let form = this.$refs["form1"].commit();
      if (!form) return;
      let form3 = this.$refs["form3"].commit();
      if (!form3) {
        this.$message.warning("请上传到账凭证");
        return;
      }
      let data = { ...form, ...form3, approvalStatus: state };
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
      if (this.editType == "add" || this.editType == "copy") {
        addReturnMoneyApproval(data).then(success);
      } else {
        data.id = this.editId;
        updateReturnMoneyApproval(data).then(success);
      }
    },
    approveClick() {
      if (this.showPayment && !this.disabledPayment) {
        let form2 = this.$refs["form2"].commit();
        if (!form2) {
          return;
        }
        if (this.form.amount > form2.invoicingAmount) {
          this.$message.warning("发票总额需大于回款金额");
          return;
        }
        let form4 = this.$refs["form4"].commit();
        if (!form4) {
          this.$message.warning("请上传结算清单文件");
          return;
        }
      }
      this.showDialog = true;
    },
    updateApprovalFun(data) {
      let success = (res) => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.cancel();
        }
      };
      updateApproval(data).then(success);
    },

    approveSuccess(data1) {
      if (this.showPayment && !this.disabledPayment) {
        let form2 = this.$refs["form2"].commit();
        let form4 = this.$refs["form4"].commit();
        let data = { ...form2, ...form4, id: this.editId };
        let success = (res) => {
          if (res.code != 200) {
            this.$message.error(res.msg || "操作失败");
            return;
          }
          this.updateApprovalFun(data1);
        };
        updateReturnMoneyApproval(data).then(success);
      } else {
        this.cancel();
      }
    },
    returnApproveSuccess() {
      this.cancel();
    },
    returnClick() {
      this.showReturnDialog = true;
    },
    TransferClick() {
      this.showTransferDialog = true;
    },
  },
  computed: {
    disabled() {
      return this.editType == "show" || this.editType == "approve";
    },
    showPayment() {

      let show = false;
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
        show = item.isUpdate == 1;
      }

      if (this.editType == "show" && this.invoiceApprovalVoList && this.invoiceApprovalVoList.length > 0) {
        show = true;
      }
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
        show = item.isUpdate;
      }
      return show;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
.flex1 {
  display: flex;
}
</style>
