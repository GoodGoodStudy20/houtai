<template>
  <el-form size="small" inline="" ref="form" :model="form" label-width="auto" class="block-form">
    <!-- <div v-if="editType != 'show' && editType != 'tovoid'">
      <el-form-item label="上传文件识别发票">
        <UploadImgDistinguish v-model="form.imgDistinguish" :type="'invoice'"></UploadImgDistinguish>
        <span style="color: #f14f44">(*上传图片格式为pdf/jpg/png/svg/bmp/jpeg,大小不超过10MB)</span>
      </el-form-item>
    </div> -->
    <div style="display:flex;align-items:center">
      <div style="font-weight: 700;margin-bottom:20px;margin-right:20px">总价税合计：{{ Number(totalPrice) || 0 | toThousands }} </div>
      <el-form-item label="作废日期" prop="voidDate" :rules="[{ required: true, message:  '作废日期不可为空', trigger: 'blur' }]">
        <el-date-picker v-model="form.voidDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 150px" :disabled="(editType!='tovoid' && form.invoicingType!=1) || editType=='show' || editType=='approve'"></el-date-picker>
      </el-form-item>
    </div>
    <el-form size="small" :disabled="true" inline>
      <div v-for="(item, index) in list" :key="index">
        <el-form-item label="开票时间" prop="invoicingDate">
          <el-date-picker v-model="item.invoicingDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 150px"></el-date-picker>
        </el-form-item>
        <el-form-item label="发票号码" required>
          <el-input v-model="item.invoicingCode" placeholder="请输入发票号码" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="金额" required>
          <!-- <el-input v-model="item.invoicingAmount" @change="moneyChange(i)" placeholder="请输入金额" style="width:140px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input> -->
          <el-input v-model="item.invoicingAmount" @change="moneyChange(index)" placeholder="请输入金额" style="width: 140px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
        </el-form-item>
        <el-form-item label="税额" required>
          <el-input v-model="item.invoicingTaxAmount" placeholder="请输入税额" style="width: 140px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
        </el-form-item>
        <el-form-item label="价税合计" required>
          <el-input v-model="item.priceTaxTotal" placeholder="请输入价税合计" style="width: 140px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
        </el-form-item>
        <el-form-item label="" required v-if="form.invoicingType !=1 && editType!='tovoid'">
          <UploadFile v-model="item.invoiceFile" :disabled="disabled" :limit="1" fileName="发票"></UploadFile>
        </el-form-item>
        <el-form-item label=" " style="width: 70px">
          <el-button type="primary" @click="addOne(index)" v-show="
                index == list.length - 1 &&
                editType != 'show' && form.invoicingType !=1
              ">增加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="delOne(index)" v-show="list.length > 1 && editType != 'show' && form.invoicingType !=1">删除</el-button>
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
        voidDate: '',//作废日期
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
            invoicingDate: item[0].invoicingDate,
            invoiceFile: [{ name: item[0].fileName, url: item[0].url }],
          });
        });
      this.$nextTick(() => {
        this.totalPrice = NumberAdd(this.list.map(item => Number(item.priceTaxTotal)))
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
    onload(obj) {
      this.$nextTick(() => {
        this.form = Object.assign(this.form, obj);
        if (obj.invoiceFileVoList && obj.invoiceFileVoList.length > 0) {
          this.list = obj.invoiceFileVoList
          this.list.forEach((item) => {
            try {
              item.invoiceFile = JSON.parse(item.invoiceFile);
            } catch (error) { }
          });
        }

        this.totalPrice = NumberAdd(this.list.map(item => Number(item.priceTaxTotal)))
        this.taxRate = obj.taxRate;
      });
    },
    onload2(list) {
      this.$nextTick(() => {
        // this.customerId = obj.customerId;
        // this.form = Object.assign(this.form, obj);
        if (list.length > 0) {
          this.list = list
          this.list.forEach((item) => {
            try {
              item.invoiceFile = JSON.parse(item.invoiceFile);
            } catch (error) { }
          });
        }

        this.totalPrice = NumberAdd(this.list.map(item => Number(item.priceTaxTotal)))
        // this.taxRate = obj.taxRate;
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
      if (!this.form.voidDate) {
        this.$message.error('请输入作废日期')
        return
      }
      let obj = Object.assign({}, this.form);
      return obj;
    },
  },
};
</script>

<style>
</style>