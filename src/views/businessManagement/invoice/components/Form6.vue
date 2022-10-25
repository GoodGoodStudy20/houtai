<template>
  <el-form size="small" inline="" ref="form" :model="form" label-width="auto" :disabled="disabled" class="block-form">
    <div v-if="editType != 'show'">
      <el-form-item label="上传文件识别发票">
        <UploadImgDistinguish v-model="form.imgDistinguish" :type="'invoice'"></UploadImgDistinguish>
        <span style="color: #f14f44">(*上传图片格式为pdf/jpg/png/jpeg/ofd,大小不超过10MB)</span>
      </el-form-item>
    </div>
    <div style="font-weight: 700;margin-bottom:20px">总价税合计：{{ Number(totalPrice) || 0 | toThousands }}</div>
    <el-form size="small" :disabled="disabled" inline :model="form">
      <div v-for="(item, index) in list" :key="index">
        <el-form-item label="开票时间" prop="invoicingDate">
          <el-date-picker v-model="item.invoicingDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 150px"></el-date-picker>
        </el-form-item>
        <el-form-item label="发票号码" required>
          <el-input v-model="item.invoicingCode" placeholder="请输入发票号码" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="金额" required>
          <!-- oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" -->
          <!-- /(^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$)/ -->
          <!-- <el-input v-model="item.invoicingAmount" @change="moneyChange(i)" placeholder="请输入金额" style="width:140px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input> -->
          <el-input v-model="item.invoicingAmount" @input="moneyChange(index)" placeholder="请输入金额" style="width: 140px" oninput="value=value.replace(/[^\d.-]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
        </el-form-item>
        <el-form-item label="税额" required>
          <el-input v-model="item.invoicingTaxAmount" @input="change" placeholder="请输入税额" style="width: 140px" oninput="value=value.replace(/[^\d.-]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
        </el-form-item>
        <el-form-item label="价税合计" required>
          <el-input v-model="item.priceTaxTotal" @input="change" placeholder="请输入价税合计" style="width: 140px" oninput="value=value.replace(/[^\d.-]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
        </el-form-item>
        <el-form-item label="发票状态" v-if="form.invoicingStatus==1">
          <el-input v-model="item.invoicingStatus==1?'作废':'正常'" :disabled="true" style="width: 140px"></el-input>
          <!-- <span>{{item.invoicingStatus==1?'作废':'正常'}}</span> -->
        </el-form-item>
        <el-form-item label="" required>
          <UploadFile v-model="item.invoiceFile" :disabled="disabled" :limit="1" fileName="发票"></UploadFile>
        </el-form-item>
        <el-form-item label=" " style="width: 70px">
          <el-button type="primary" @click="addOne(index)" v-show="
                index == list.length - 1 &&
                editType != 'show'
              ">增加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="delOne(index)" v-show="list.length > 1 && editType != 'show'">删除</el-button>
        </el-form-item>
      </div>
      <el-divider></el-divider>

      <!-- </el-form> -->
      <!-- </div> -->
    </el-form>

  </el-form>
</template>

<script>
// import ChooseSubject from "@/components/ChooseSubject/index.vue";
import UploadFile from "@/components/UploadFile/index.vue";
import ChooseUser from "@/components/ChooseUser/index.vue";
import UploadImgDistinguish from "@/components/UploadImgDistinguish/index.vue";
// import Form2 from "./Form2.vue";
import { Assign, NumberAdd, NumberMul } from "@/utils/index.js";
import {
  getSubjectList,
  // deleteSubject,
  deleteByInvoiceIdAndSubjectId,
  deleteInvoiceFile,
} from "@/api/index.js";
// import { duration } from "moment";
import { Confirm } from "@/utils/common.js";

export default {
  name: "Form6",
  components: {
    // ChooseSubject,
    ChooseUser,
    // Form2,
    UploadImgDistinguish,
    UploadFile,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    editType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        // subjectId: '',                    //主体id
        invoicingDate: "", //开票日期
        invoicingUserId: "", //开票人
        viceRemark: "",
        imgDistinguish: [], //上传文件
      },
      list: [
        {
          invoicingCode: "",
          invoicingAmount: "",
          invoicingTaxAmount: "",
          priceTaxTotal: "",
          invoiceFile: [],
          invoicingDate: ''
        },
      ],
      customerId: "",
      taxRate: '',
      subjectList: [],
      ImgUrl: [],
      newList: [],
      totalPrice: "",
      subjectListId: ''
    };
  },
  watch: {
    "form.imgDistinguish"(val, oldVal) {
      let isError = false
      if (val[0] && (val[0][0].subjectVo || val[0][0].subjectId)) {
        this.subjectList.forEach(item => {
          if (item.id == val[0][0].subjectVo.id) {
            isError = true
          }
        })

        if (!isError) {
          this.$message.error('合同已过期或暂未签订合同，请更新合同信息！')
          return
        }
        if (this.subjectListId != val[0][0].subjectVo.id) {
          this.$message.error('系统识别出的发票主体与需开票主体不一致，请上传正确的发票')
          return
        }
      } else {
        this.$message.error('发票识别错误')
        return
      }
      if (this.list && this.list[0] && this.list[0].invoiceFile.length == 0) {
        if (val[0] && (!val[0][0].subjectVo || !val[0][0].subjectId)) {
          this.list = [];
        }
      }
      if (val && val.length > 0) {
        this.handle();
      }
    },
    'list'(val) {
      this.totalPrice = NumberAdd(this.list.map(item => Number(item.priceTaxTotal)))
    }
  },
  methods: {
    handle() {
      this.form.imgDistinguish.length > 0 &&
        this.form.imgDistinguish.forEach((item) => {
          this.list.push({
            invoicingAmount: item[0].invoicingAmount,
            invoicingCode: item[0].invoicingCode,
            invoicingTaxAmount: item[0].invoicingTaxAmount,
            priceTaxTotal: item[0].priceTaxTotal,
            invoicingDate: item[0].invoiceDate.replace("年", "-").replace("月", "-").replace("日", ""),
            invoiceFile: [{ name: item[0].fileName, url: item[0].url }],
          });
        });
      this.$nextTick(() => {
        this.totalPrice = NumberAdd(this.list.map(item => Number(item.priceTaxTotal)))
      });
    },
    getSubjectList(params = {}) {
      getSubjectList({
        // isDisable: 0,
        ...params,
        customerId: this.customerId,
        date: this.form.invoicingDate,
        type: this.form.invoicingType,
      }).then((res) => {
        this.subjectList = res.data;
      });
    },
    moneyChange(index) {
      this.list[index].invoicingTaxAmount = NumberMul(
        this.list[index].invoicingAmount,
        this.taxRate / 100
      ).toFixed(2);
      this.list[index].priceTaxTotal = NumberAdd([
        this.list[index].invoicingAmount,
        this.list[index].invoicingTaxAmount,
      ]).toFixed(2);
      this.$nextTick(() => {
        this.totalPrice = NumberAdd(this.list.map(item => Number(item.priceTaxTotal)))
      });
    },
    change() {
      this.$nextTick(() => {
        this.totalPrice = NumberAdd(this.list.map(item => Number(item.priceTaxTotal)))
      });
    },
    onload(obj) {
      this.$nextTick(() => {
        this.customerId = obj.customerId;
        this.form = Object.assign(this.form, obj);
        if (obj.subjectListId) {
          this.subjectListId = obj.subjectListId.split(',')[0]
        }

        // if (obj.invoiceFileVoList && obj.invoiceFileVoList.length > 0) {
        //   this.list = obj.invoiceFileVoList
        //   this.list.forEach((item) => {
        //     try {
        //       item.invoiceFile = JSON.parse(item.invoiceFile);
        //     } catch (error) { }
        //   });
        // }
        this.getSubjectList();
        this.totalPrice = NumberAdd(this.list.map(item => Number(item.priceTaxTotal)))
        this.taxRate = obj.taxRate;
      });
    },
    addOne() {
      this.list.push(Object.assign({}, this.$options.data().list[0]));
      // this.$refs[`subject${i + 1}`][0].getList({ customerId: this.customerId, date: this.form.invoicingDate, type: this.form.invoicingType })
      // this.invoicingDateChange()
    },
    addOneInvoiceFile(i) {
      this.list[i].invoiceFileVoList.push(
        Object.assign({}, this.$options.data().list[0].invoiceFileVoList[0])
      );
    },
    delOne(i) {
      if (!this.list[i].invoiceId) {
        this.list.splice(i, 1);
      } else {
        Confirm(`此操作将发票文件, 是否继续?`, () => {
          deleteByInvoiceIdAndSubjectId({
            subjectId: this.list[i].subjectId,
            invoiceId: this.form.id,
          })
            .then(() => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.list.splice(i, 1);
            })
            .catch(() => {
              this.$message.error("删除失败");
            });
        });
      }
    },
    commit() {
      let list = [];
      let isCommit = true;
      this.list.forEach((item) => {
        if (!item.invoicingDate) {
          this.$message.error({
            message: "请输入开票时间",
            duration: 1500,
          });
          isCommit = false;
          return;
        }
        if (item.invoicingCode == "" || !item.invoicingCode) {
          this.$message.error({
            message: "请输入发票号码",
            duration: 1500,
          });
          isCommit = false;
          return;
        }

        if (item.invoiceFile.length == 0) {
          this.$message.error({
            message: "请上传发票文件",
            duration: 1500,
          });
          isCommit = false;
          return;
        }
        if (item.invoicingAmount === "" || !item.invoicingAmount) {
          this.$message.error({
            message: "请输入发票金额",
            duration: 1500,
          });
          isCommit = false;
          return;
        }

        if (item.invoicingTaxAmount === "") {

          this.$message.error({
            message: "请输入发票税额",
            duration: 1500,
          });
          isCommit = false;
          return;
        }
        if (item.priceTaxTotal === "") {
          this.$message.error({
            message: "请输入发票总额",
            duration: 1500,
          });
          isCommit = false;
          return;
        }
      });
      if (!isCommit) return;
      // this.list.filter(item => item.invoicingCode &&
      //   item.invoiceFile &&
      //   item.invoiceFile.length).map(item1 => {
      //     return {
      //       invoicingCode: item1.invoicingCode, //发票代码
      //       invoicingAmount: item1.invoicingAmount, //金额
      //       invoicingTaxAmount: item1.invoicingTaxAmount, //税额
      //       priceTaxTotal: item1.priceTaxTotal, //总价
      //       invoiceFile: JSON.stringify(item1.invoiceFile), //发票文件
      //       // id: item.id || '',      //主体id
      //       id: item1.id || "",
      //       subjectId:
      //         item.subjectId ||
      //         (item1.subjectVo && item1.subjectVo.id) ||
      //         "",
      //     }
      //   })
      let list2 = this.list.filter(item => {
        return item.invoicingCode && item.invoiceFile && item.priceTaxTotal
      }).map(item1 => {
        return {
          invoicingCode: item1.invoicingCode, //发票代码
          invoicingAmount: item1.invoicingAmount, //金额
          invoicingTaxAmount: item1.invoicingTaxAmount, //税额
          invoicingDate: item1.invoicingDate, //税额
          priceTaxTotal: item1.priceTaxTotal, //总价
          invoiceFile: JSON.stringify(item1.invoiceFile), //发票文件
          id: item1.id || "",
          subjectId: this.subjectListId
        }
      })
      list = list.concat(list2);
      if (list && list.length == 0) {
        this.$message.error({
          message: "请输入一条发票信息",
          duration: 1500,
        });
        return;
      }
      let count = 0;
      let isSubjectId = false
      list.forEach((item) => {
        if (!item.subjectId) {
          isSubjectId = true
        }
        count += Number(item.priceTaxTotal);
      });
      if (this.form.invoicingType != 2) {
        // if (count > this.form.invoicingAmount) {
        //   this.$message.error("上传的发票总额不能大于开票金额");
        //   return;
        // }
        if (count != this.form.invoicingAmount) {
          this.$message.error("上传的发票总额必须等于开票金额");
          return;
        }
      } else {
        if (0 - count != this.form.invoicingAmount) {
          this.$message.error("上传的发票总额必须等于开票金额");
          return;
        }
      }
      // return
      let obj = Object.assign({}, this.form);
      obj.InvoiceFileReqList = list;
      return obj;
    },
  },
};
</script>

<style>
</style>