<template>
  <div>
    <div class="form-title">查看合同信息</div>
    <!-- 基础信息 -->
    <div class="basic-info-container">
      <h3 class="basic-info">基础信息</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1">
            合同编号：<span class="col-text">{{ detailInfo.number }}</span>
          </div>
          <div class="grid-content1">
            合同类型：<span class="col-text" v-if="ContractType[detailInfo.type]">{{ ContractType[detailInfo.type].label }}</span>
          </div>
          <div class="grid-content1" v-if="detailInfo.type == 0">
            客户（甲方）：
            <ChooseCustomer v-model="detailInfo.customerId" disabled style="width: 200px" />
          </div>
          <div class="grid-content1" v-if="detailInfo.type == 0">
            主体（乙方）：
            <ChooseSubject v-model="detailInfo.subjectId" disabled style="width: 200px" />
          </div>
          <div class="grid-content1" v-if="detailInfo.type == 1">
            主题（甲方）：
            <ChooseCustomer v-model="detailInfo.subjectId" disabled />
          </div>
          <div class="grid-content1" v-if="detailInfo.type == 1">
            服务商（乙方）：
            <ChooseServiceProvider v-model="detailInfo.serviceProviderId" disabled />
          </div>
          <div class="grid-content1" v-if="detailInfo.type == 2">
            甲方：
            <ChooseCustomer v-model="detailInfo.partyAId" v-show="detailInfo.partyAType === 0" disabled />
            <ChooseSubject v-model="detailInfo.partyAId" v-show="detailInfo.partyAType == 1" disabled />
            <ChooseServiceProvider v-model="detailInfo.partyAId" v-show="detailInfo.partyAType == 2" disabled />
          </div>
          <div class="grid-content1" v-if="detailInfo.type == 2">
            乙方：
            <ChooseCustomer v-model="detailInfo.partyBId" v-show="detailInfo.partyBType === 0" disabled />
            <ChooseSubject v-model="detailInfo.partyBId" v-show="detailInfo.partyBType == 1" disabled />
            <ChooseServiceProvider v-model="detailInfo.partyBId" v-show="detailInfo.partyBType == 2" disabled />
          </div>
          <div class="grid-content1" v-if="detailInfo.type == 2">
            丙方：
            <ChooseCustomer v-model="detailInfo.partyCId" v-show="detailInfo.partyCType === 0" disabled />
            <ChooseSubject v-model="detailInfo.partyCId" v-show="detailInfo.partyCType == 1" disabled />
            <ChooseServiceProvider v-model="detailInfo.partyCId" v-show="detailInfo.partyCType == 2" disabled />
          </div>
          <div class="grid-content1" v-if="detailInfo.type == 3">
            资方（甲方）：
            <ChooseCapital v-model="detailInfo.backersId" disabled />
          </div>
          <div class="grid-content1" v-if="detailInfo.type == 3">
            主体（乙方）：
            <ChooseSubject v-model="detailInfo.subjectId" disabled />
          </div>
          <div class="grid-content1">
            合同期限：<span class="col-text">{{ detailInfo.contractStartDate || "--" }} 至 {{
                detailInfo.contractEndDate || "--"
              }}</span>
          </div>
          <div class="grid-content1">
            签订日期：<span class="col-text">{{
              detailInfo.signDate || "--"
            }}</span>
          </div>
          <div class="grid-content1">
            备注：<span class="col-text">{{ detailInfo.remark || "--" }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 产品信息 -->
    <div class="basic-info-container">
      <h3 class="basic-info">产品信息</h3>
      <div class="product-header">
        <el-row :gutter="20" class="rol-content">
          <el-col :span="8">
            <div class="grid-content">产品分类</div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">产品名称</div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">产品单价（元）</div>
          </el-col>
        </el-row>
      </div>
      <div class="product-content" v-for="(item, index) in list" :key="index">
        <el-row :gutter="20" class="rol-content" v-if="item.productTypeVo">
          <el-col :span="8">
            <div class="grid-content">
              {{ item.productTypeVo.name || "--" }}
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">{{ item.productVo.name || "--" }}</div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">{{ item.price || 0 | toThousands}}</div>
          </el-col>
        </el-row>
        <el-divider class="divder-product"></el-divider>
      </div>
    </div>
    <!-- 合同文件 -->
    <div class="basic-info-container">
      <h3 class="basic-info">合同文件</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1">
            <UploadFile v-model="fileUrl" :disabled="editType !='again'" />
          </div>
        </div>
      </div>
    </div>
    <div class="basic-info-container" v-show="detailInfo.approvalProcessVoList && detailInfo.approvalProcessVoList.length>0">
      <h3 class="basic-info">流程</h3>
      <div class="basic-info-content">
        <ProcessForm ref="form5" :disabled="!disabled" type="5"></ProcessForm>
      </div>
    </div>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" v-debounce="saveFile" v-if="editType=='again'">保存</el-button>
      <el-button type="primary" v-debounce="submitBack" v-if="!disabled && editType !='again'">保存返回</el-button>
      <el-button type="primary" v-debounce="submitTo" v-if="!disabled && editType !='again'">提交</el-button>
      <el-button type="primary" @click="approveClick" v-if="editType == 'approve'">审批</el-button>
      <el-button type="danger" @click="returnClick" v-if="editType == 'approve'">退回</el-button>
    </div>
    <ApproveDialog v-model="showDialog" v-if="showDialog" :idData="idData" :showIssue="showIssue" :type="5" :relationshipId="editId" @success="approveSuccess"></ApproveDialog>
    <ReturnDialog v-model="showReturnDialog" v-if="showReturnDialog" :approvalProcessVoList="detailInfo.approvalProcessVoList" :idData="idData" :type="5" :relationshipId="editId" @success="returnApproveSuccess" :showIssue="showIssue"></ReturnDialog>

    <!-- <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
    </div> -->
  </div>
</template>

<script>
import {
  getContractInfo,
  getProductTypeList,
  getProductList,
  updateContract
} from "@/api/index.js";
import { ContractType } from "@/utils/field.js";
import ChooseCustomer from "@/components/ChooseCustomer/index.vue";
import ChooseSubject from "@/components/ChooseSubject/index.vue";
import ChooseServiceProvider from "@/components/ChooseServiceProvider/index.vue";
import ChooseCapital from "@/components/ChooseCapital/index.vue";
import UploadFile from "@/components/UploadFile/index.vue";
import ProcessForm from '../../../businessManagement/components/ProcessForm'
import ApproveDialog from '../../../businessManagement/components/ApproveDialog'
import ReturnDialog from '../../../businessManagement/components/ReturnDialog'
export default {
  components: {
    ChooseCustomer,
    ChooseServiceProvider,
    ChooseSubject,
    ChooseCapital,
    UploadFile,
    ProcessForm,
    ApproveDialog,
    ReturnDialog
  },
  props: ["value", "editId", "editType"],
  data() {
    return {
      fileUrl: [],
      detailInfo: {},
      ContractType: ContractType, // 合同类型
      productTypeList: [],
      options2: [],
      list: [
        {
          productTypeId: "", //类id
          productId: "", //产品id
          price: "", //价格
          productList: [],
        },
      ],
      showDialog: false,
      showReturnDialog: false,
      idData: {},
    };
  },
  created() {
    getProductTypeList({}).then((res) => {
      this.productTypeList = res.data;
    });
  },
  mounted() {
    if (this.editId) {
      this.onload();
    }
  },
  methods: {
    onload() {
      getContractInfo({ id: this.editId }).then((res) => {
        this.detailInfo = res.data || {};
        if (this.detailInfo.file) {
          this.fileUrl = JSON.parse(this.detailInfo.file);
        }

        this.onload2(this.detailInfo.productRelationVoList);
        if (this.detailInfo.approvalProcessVoList && this.detailInfo.approvalProcessVoList.length > 0) {
          this.$refs["form5"].onload(this.detailInfo);
        }
        let user = JSON.parse(sessionStorage.getItem("user"));
        this.idData =
          (this.detailInfo.approvalProcessVoList &&
            this.detailInfo.approvalProcessVoList.find((item) => {
              return (
                item.approvalId == user.id &&
                (item.operationType == 0 || item.operationType == 2)
              );
            })) ||
          {};
      });
    },
    onload2(list) {
      let _this = this;
      _this.list = [];
      for (let item of list) {
        getProductList({ productTypeId: item.productTypeId }).then((res) => {
          item.productList = res.data;
          _this.list.push(item);
        });
      }
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
    cancel() {
      if (this.$route.query.id) {
        this.$router.go(-1);
      } else {
        this.$emit("input", 0);
      }
    },
    saveFile() {
      let data = {
        id: this.editId
      }
      data.file = JSON.stringify(this.fileUrl)

      updateContract(data).then(res => {
        if (res.code !== 200) return
        this.cancel()
      })
    }
  },
  computed: {
    disabled() {
      return this.editType == "show" || this.editType == "approve";
    },
    showPayment() {
      let show = false;
      if (this.editType == "approve") {
        let user = JSON.parse(sessionStorage.getItem("user"));
        let item = this.detailInfo.approvalProcessVoList
          ? this.detailInfo.approvalProcessVoList.find((item) => {
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
        let item = this.detailInfo.approvalProcessVoList
          ? this.detailInfo.approvalProcessVoList.find((item) => {
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
        let item = this.detailInfo.approvalProcessVoList
          ? this.detailInfo.approvalProcessVoList.find((item) => {
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
  }
};
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
</style>