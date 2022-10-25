<template>
  <div>
    <div class="form-title">{{ editType | typeName }}发票信息</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="开票要求" name="1">
        <Form1 ref="form1" :editType="editType" :disabled="disabled" @invoicingAmountChange="invoicingAmountChange" @invoiceUserChange="invoiceUserChange" @toVoid="toVoid" @customerChange='customerChange' @customerChange1="customerChange1" @typeChange="typeChange"></Form1>
      </el-collapse-item>
      <el-collapse-item title="业务信息" name="10">
        <Form10 ref="form10" :editType="editType" :disabled="disabled"></Form10>
      </el-collapse-item>
      <!-- <el-collapse-item title="业务合同" name="7">
        <Form7 ref="form7" :disabled="disabled2"></Form7>
      </el-collapse-item> -->
      <el-collapse-item title="附件信息" name="7" v-if="(editType !== 'tovoid' && editType !== 'flushRed') && (form.invoicingType!=2 && form.invoicingType!=1)">
        <Form7 ref="form7" :disabled="disabled2"></Form7>
      </el-collapse-item>
      <el-collapse-item title="开票详情" name="6" v-if="showPayment">
        <Form6 ref="form6" :editType="editType" :disabled="disabledPayment"></Form6>
      </el-collapse-item>
      <el-collapse-item title="作废发票详情" name="6" v-if="editType == 'tovoid' || form.invoicingType ==1">
        <Form11 ref="form11" :editType="editType" :disabled="disabledPayment"></Form11>
      </el-collapse-item>
      <!-- <el-collapse-item title="发票文件（建议上传图片）" name="2" v-show="showPayment">
        <Form2 ref="form2" :disabled="disabledPayment"></Form2>
      </el-collapse-item> -->
      <el-collapse-item title="客户开票信息" name="9" v-show="customerId">
        <Form9 ref="form9" :disabled="disabled"></Form9>
      </el-collapse-item>
      <el-collapse-item title="邮寄信息" name="4" v-show="showForm4 && isShow">
        <Form4 ref="form4" :disabled="disabled"></Form4>
      </el-collapse-item>
      <el-collapse-item title="回款信息" name="5" v-show="editType == 'show' && form.approvalStatus == 2">
        <Form5 :list="list"></Form5>
      </el-collapse-item>
      <el-collapse-item title="流程" name="8">
        <ProcessForm ref="form8" :disabled="disabled" type="2"></ProcessForm>
      </el-collapse-item>
    </el-collapse>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <!-- <el-button type="primary" v-debounce="temporaryStorage" v-if="!disabled">保存</el-button> -->
      <el-button type="primary" v-debounce="submitBack" v-if="!disabled || showIssue == 1">保存返回</el-button>
      <el-button type="primary" v-debounce="submitTo" v-if="!disabled">提交</el-button>
      <!-- <el-button type="primary" v-debounce="approveClick" v-if="editType=='approve'">审批</el-button> -->
      <el-button type="primary" v-debounce="approveClick" v-if="editType == 'approve' && showIssue == 0">审批</el-button>
      <!-- <el-button type="primary" v-debounce="approveClick" v-if="editType == 'approve' && showIssue == 2">办理</el-button> -->
      <!-- <el-button type="primary" v-debounce="approveClick" v-if="editType == 'approve' && showIssue == 2">确认下发</el-button> -->
    </div>
    <ApproveDialog v-model="showDialog" v-if="showDialog" :idData="idData" :type="2" :relationshipId="editId" @success="approveSuccess" :showIssue="showIssue"></ApproveDialog>
  </div>
</template>

<script>
import { addInvoiceApproval, updateInvoiceApproval, getInvoiceApprovalInfo, updateIsRead, getInvoiceFilePage } from '@/api/index.js'
import Form1 from './Form1'
import Form2 from './Form2'
// import Form3 from './Form3'
import Form4 from './Form4'
import Form5 from './Form5'
import Form6 from './Form6'
import Form7 from './Form7'
import Form9 from './Form9'
import Form10 from './Form10'
import Form11 from './Form11'
import ApproveDialog from '../../components/ApproveDialog'
import ProcessForm from '../../components/ProcessForm'
export default {
  name: 'InvoiceForm',
  components: { Form1, Form2, Form4, Form5, Form6, Form7, Form9, Form10, ApproveDialog, ProcessForm, Form11 },
  props: ['value', 'editId', 'editType'],
  data() {
    return {
      activeNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      showForm4: false,
      list: [],
      showDialog: false,
      form: {},
      idData: {},
      customerId: '',
      form1: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
        // isPage: 1,
        invoiceId: ''
      },
      invoicingCode: [],
      invoiceId: ''
    }
  },
  async mounted() {
    if (this.editType == 'add') {
      this.form.invoicingType = 0
    }

    if (this.editId) {
      // this.form1.invoiceId = this.invoiceId
      await this.onload();
      this.getInvoiceFilePage()
    }
    if (this.editType == "add" || this.editType == "copy") {
      this.$refs["form8"].onload();
    }
  },
  methods: {
    invoicingAmountChange(invoicingAmount) {
      this.$refs['form10'].invoicingAmountChange(invoicingAmount)
    },
    //获取发票文件
    getInvoiceFilePage() {
      getInvoiceFilePage(this.form1).then(res => {
        if (res.code != 200) return
        this.invoiceFileVoList = res.data.invoiceFileVoIPage.records
        // this.form.invoiceFileVoList = this.invoiceFileVoLists
        this.sumPriceTaxTotal = res.data.sumPriceTaxTotal
        this.total = res.data.invoiceFileVoIPage.total
        this.invoiceFileVoList.forEach((item) => {
          try {
            item.invoiceFile = JSON.parse(item.invoiceFile);
          } catch (error) { }
        });
        this.$refs['form1'].onload2(this.invoiceFileVoList)
        if (this.invoiceFileVoList && this.invoiceFileVoList.length > 0) {
          this.invoiceFileVoList.forEach(item => {
            this.invoicingCode.push(item.invoicingCode)
          })
          this.invoicingCode = String(this.invoicingCode)
          // this.priceTaxTotal=invoicingCode
        }
      })
    },
    //修改流程指定开票人
    invoiceUserChange(result) {
      this.$refs['form8'].invoiceUserChange(result)
    },
    //修改已读
    readUpdate(data) {
      updateIsRead(data).then((res) => { });
    },
    async onload() {
      await getInvoiceApprovalInfo({ id: this.editId }).then((res) => {
        let result = res.data || {};
        this.form1.invoiceId = result.invoiceId || this.editId
        this.form = result;
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
        this.$refs['form1'].onload(result)
        this.$refs["form4"].onload(result);
        this.$refs["form9"].onload(result.customerVo.invoiceVo);
        if (result.customerVo && result.customerVo.invoiceVo) {
          this.customerId = result.customerVo.invoiceVo.id
        }
        if (this.showPayment) {
          this.$nextTick(() => {
            this.$refs['form6'].onload(result)
          })
        }
        if (this.editType !== 'tovoid' && this.editType !== 'flushRed') {
          this.$refs['form7'].onload(result)
        }
        if (this.form.invoicingType == 1) {
          this.$nextTick(() => {
            this.$refs['form11'].onload(result)
          })

        }
        if (this.editType == 'tovoid' || this.editType == 'flushRed') {
          this.$refs['form8'].onload()
        } else {
          this.$refs['form8'].onload(result)
        }
        this.$refs['form10'].onload(result)
        this.list = result.invoiceReturnMoneyRecordVoList
        this.typeChange(result.type)
        let user = JSON.parse(sessionStorage.getItem('user'))
        this.idData = result.approvalProcessVoList && result.approvalProcessVoList.find(item => {
          return item.approvalId == user.id && (item.operationType == 0 || item.operationType == 2)
        }) || {}
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
    // toVoid() {
    //   this.$refs['form11'].onload(this.form)
    // },
    toVoid(list) {
      this.$refs['form11'].onload2(list)
    },
    cancel() {
      if (this.$route.query.id) {
        this.$router.go(-1);
      } else {
        this.$emit("input", 0);
      }
    },
    customerChange(item) {
      this.customerId = item.id
      this.$refs['form4'].onload(item)
      this.$refs['form9'].onload(item)

    },
    customerChange1(item) {
      this.$refs['form10'].onload2(item)
    },
    typeChange(type) {
      this.showForm4 = [0, 1].includes(type);
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
      let form10 = this.$refs['form10'].commit()
      if (!form10) return
      let form = this.$refs['form1'].commit()
      if (!form) return
      // let form3 = this.$refs['form3'].commit()
      // if (!form3) return
      let form4 = this.$refs["form4"].commit();


      // let form8 = this.$refs['form8'].commit()
      // if (!form8) {
      //   this.$message.warning('没查询到审批流程，请联系管理员添加')
      //   return
      // }
      if (form10.demandListId) {
        form10.demandListId = String(form10.demandListId)
      }
      if (form10.contractListId) {
        form10.contractListId = String(form10.contractListId)
      }
      let data
      //新增，编辑正数发票
      if ((this.editType == 'add' || this.editType == 'edit' || this.editType == 'copy') && this.form.invoicingType == 0) {
        let form7 = this.$refs['form7'].commit()
        if (!form7) return
        data = {
          ...form,
          ...form10,
          ...form4,
          ...form7,
          // addApprovalProcessReqList: form8,
          approvalStatus: state,
        }
      } else {
        //新增作废
        if (this.editType == 'tovoid' || this.form.invoicingType == 1) {
          let form11 = this.$refs['form11'].commit()
          if (!form11) return
          data = {
            ...form11,
            ...form,
            ...form10,
            ...form4,
            // addApprovalProcessReqList: form8,
            approvalStatus: state,
          }
          // data.voidDate = form11.voidDate
        } else {
          //冲红
   
          data = {
            ...form,
            ...form10,
            ...form4,
            // addApprovalProcessReqList: form8,
            approvalStatus: state,
          }
          // data.invoicingType = form.invoicingType
          // data.invoiceId = form.invoiceId
          // data.voidRule = form.voidRule
        }
        // data = {
        //   ...form11,
        //   ...form,
        //   ...form10,
        //   ...form4,
        //   // addApprovalProcessReqList: form8,
        //   approvalStatus: state,
        // }
      }
      let success = res => {
        if (res.code != 200) {
          this.$message.error(res.msg || "操作失败");
          return;
        }
        this.$message.success("操作成功");
        if (type == "back") {
          this.cancel();
        }
      };
      if (this.editType == 'add' || this.editType == 'copy' || this.editType == 'tovoid' || this.editType == 'flushRed') {
        // data.addInvoiceFileReqList = form6.InvoiceFileReqList
        let form10 = this.$refs['form10'].commit()
        if (form10.customMoneyDeductionReqList && form10.customMoneyDeductionReqList.length > 0) {
          data.addCustomMoneyDeductionReqList = form10.customMoneyDeductionReqList
        }
        addInvoiceApproval(data).then(success);
      } else if (this.editType == "approve" || this.editType == 'edit') {
        data.id = this.editId;
        if (this.editType == "approve") {
          let form6 = this.$refs["form6"].commit();
          if (!form6) return;
          data.updateInvoiceFileReqList = form6.InvoiceFileReqList;
          data.invoicingUserId = form6.invoicingUserId;
          data.viceRemark = form6.viceRemark;
          data.invoicingDate = form6.invoicingDate;
          if (form6.InvoiceFileReqList) {
            data.approvalStatus = "";
          }
        }

        let form10 = this.$refs['form10'].commit()
        if (form10.customMoneyDeductionReqList && form10.customMoneyDeductionReqList.length > 0) {
          data.updateCustomMoneyDeductionReqList = form10.customMoneyDeductionReqList
        }

        updateInvoiceApproval(data).then(success);
      } else {
        data.id = this.editId;
        updateInvoiceApproval(data).then(success);
      }
    },
    approveClick() {
      if (this.showPayment && !this.disabledPayment && this.detailInfo.invoicingType != 1) {
        // let form2 = this.$refs['form2'].commit()
        // if (!form2) return

        let form6 = this.$refs['form6'].commit()
        if (!form6) return

        // let form7 = this.$refs['form7'].commit()
        // if (!form7) return
      }
      this.showDialog = true;
    },
    approveSuccess() {
      if (this.showPayment && !this.disabledPayment && this.detailInfo.invoicingType != 1) {
        // let form2 = this.$refs['form2'].commit()
        let form6 = this.$refs["form6"].commit();
        // let form7 = this.$refs['form7'].commit()
        let data = {
          ...form6,
          // ...form7,
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
  },
  computed: {
    isShow() {
      return this.editType !== 'tovoid' && this.editType !== 'flushRed'
    },
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

      // if (this.editType == 'show' && this.form.subjectId) {
      if (
        this.editType == "show" &&
        this.form.invoiceFileVoList &&
        this.form.invoiceFileVoList.length > 0
      ) {
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
      // if (this.form.businessType != 1) {
      //   return false
      // }
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
};
</script>
