<template>
  <el-form size="small" inline="" ref="form" :model="form" label-width="auto" :disabled="disabled" class="block-form">
    <el-form-item label="开票人" prop="invoicingUserId" :rules="[
        { required: true, message: '开票人不可为空', trigger: 'change' },
      ]">
      <ChooseUser v-model="form.invoicingUserId" placeholder="请选择" style="width: 300px"></ChooseUser>
    </el-form-item>
    <el-form-item label="开票时间" prop="invoicingDate" :rules="[
        { required: true, message: '开票时间不可为空', trigger: 'blur' },
      ]">
      <el-date-picker v-model="form.invoicingDate" @change="invoicingDateChange" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 250px"></el-date-picker>
    </el-form-item>
    <!-- <el-form-item label="开票主体" prop="subjectId" :rules="[{ required: true, message: '开票主体不可为空', trigger: 'blur' }]">
      <ChooseSubject v-model="form.subjectId" :disabled="!form.invoicingDate" :showAmount="!disabled" ref="subject" placeholder="请选择" style="width:500px"></ChooseSubject>
    </el-form-item> -->
    <el-form-item label="备注">
      <el-input v-model="form.viceRemark" type="textarea" style="width: 500px" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 10 }"></el-input>
    </el-form-item>
    <div v-if="editType != 'show' && form.invoicingDate">
      <el-form-item label="上传文件识别发票">
        <UploadImgDistinguish v-model="form.imgDistinguish" @changeList="changeList" :type="'invoice'"></UploadImgDistinguish>
        <span style="color: #f14f44">(*上传图片格式为pdf/jpg/png/svg/bmp/jpeg,大小不超过10MB)</span>
      </el-form-item>
    </div>
    <div v-for="(item, i) in list" :key="i">
      <el-form size="small" :disabled="disabled" inline :model="item" v-if="item.subjectId || editType === 'approve'">
        <!-- <el-form-item
          label="开票主体"
          v-if="
            form.invoiceFileVoList &&
            form.invoiceFileVoList[0] &&
            form.invoiceFileVoList[0].subjectVo
          "
        >
          <span
            >：{{ form.invoiceFileVoList[0].subjectVo.abbreviated }}
          </span></el-form-item
        > -->
        <el-form-item label="开票主体" prop="subjectId" :rules="[
            { required: true, message: '开票主体不可为空', trigger: 'blur' },
          ]" v-if="subjectList.length !== 0">
          <el-select v-model="item.subjectId" placeholder="请选择" style="width: 200px" :disabled="!form.invoicingDate" :showAmount="!disabled">
            <el-option v-for="item1 in subjectList" :key="item1.id" :label="
                editType == 'show'
                  ? item1.abbreviated
                  : `${item1.abbreviated}【本月已开金额${item1.totalInvoicingAmount}元，剩余额度${item1.surplusInvoicingAmount}元，剩余份数${item1.surplusInvoicingQuantity}份】`
              " :value="item1.id" :disabled="item1.isEffective == 1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" " style="width: 70px">
          <el-button type="primary" @click="addOne(i)" v-show="i == list.length - 1 && editType != 'show'">增加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="delOne(i)" v-show="list.length > 1 && editType != 'show'">删除</el-button>
        </el-form-item>
        <!-- <div> -->
        <!-- <Form2 ref="form2" :disabled="disabled" :editType="editType" @changeList="changeList" :invoiceFileVoList="item.invoiceFileVoList" :taxRate="taxRate" :subjectId="item.subjectId"></Form2> -->
        <!-- <el-form size="small" inline :disabled="disabled" class="block-form"> -->
        <div v-for="(item1, index1) in item.invoiceFileVoList" :key="index1">
          <el-form-item label="发票号码" required>
            <el-input v-model="item1.invoicingCode" placeholder="请输入发票号码" style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item label="金额" required>
            <!-- <el-input v-model="item.invoicingAmount" @change="moneyChange(i)" placeholder="请输入金额" style="width:140px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input> -->
            <el-input v-model="item1.invoicingAmount" @change="moneyChange(i, index1)" placeholder="请输入金额" style="width: 140px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
          </el-form-item>
          <el-form-item label="税额" required>
            <el-input v-model="item1.invoicingTaxAmount" placeholder="请输入税额" style="width: 140px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
          </el-form-item>
          <el-form-item label="价税合计" required>
            <el-input v-model="item1.priceTaxTotal" placeholder="请输入价税合计" style="width: 140px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
          </el-form-item>
          <el-form-item label="" required>
            <UploadFile v-model="item1.invoiceFile" :disabled="disabled" :limit="1" fileName="发票"></UploadFile>
          </el-form-item>
          <el-form-item label=" " style="width: 70px">
            <el-button type="primary" @click="addOneInvoiceFile(i, index1)" v-show="
                index1 == item.invoiceFileVoList.length - 1 &&
                editType != 'show'
              ">增加</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="delOneInvoiceFile(i, index1)" v-show="item.invoiceFileVoList.length > 1 && editType != 'show'">删除</el-button>
          </el-form-item>
        </div>
        <el-divider></el-divider>

        <!-- </el-form> -->
        <!-- </div> -->
      </el-form>
    </div>
    <div style="font-weight: 700">总价税合计：{{ Number(totalPrice) || 0 | toThousands }}</div>
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
        // imgDistinguish: ''     //上传文件
      },
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
      customerId: "",
      taxRate: 0,
      subjectList: [],
      ImgUrl: [],
      newList: [],
      totalPrice: "",
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
        this.list = [];
      } else {
        this.$message.error('发票识别错误')
        return
      }
      if (this.list && this.list[0] && this.list[0].subjectId) {
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
    changeList() {
      this.newList = [];
      this.list.forEach((item) => {
        item.invoiceFileVoList &&
          item.invoiceFileVoList.forEach((it) => {
            this.newList.push(it);
          });
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
    handle() {
      let subjectIdList = [];
      this.form.imgDistinguish.length > 0 &&
        this.form.imgDistinguish.forEach((item) => {
          this.newList.push(item[0]);
        });
      this.newList.forEach((item) => {
        if (item.subjectVo) {
          // if (subjectIdList.indexOf(item.subjectId) == -1) {
          //   subjectIdList.push(item.subjectId);
          // }
          if (subjectIdList.indexOf(item.subjectVo.id) == -1) {
            subjectIdList.push(item.subjectVo.id);
          }
        }
        if (!item.subjectVo && item.subjectId) {
          if (subjectIdList.indexOf(item.subjectId) == -1) {
            subjectIdList.push(item.subjectId);
          }
        }
      });

      subjectIdList.forEach((subjectId) => {
        let item = { subjectId: subjectId, invoiceFileVoList: [] };
        this.newList.forEach((invoiceItem) => {
          if (
            subjectId == (invoiceItem.subjectVo && invoiceItem.subjectVo.id) ||
            subjectId == invoiceItem.subjectId
          ) {
            invoiceItem.invoiceFile = [];
            invoiceItem.invoiceFile.push({
              url: invoiceItem.url,
              name: invoiceItem.fileName,
            });
            item.invoiceFileVoList.push(invoiceItem);
          }
        });
        this.$nextTick(() => {
          this.list.push(item);
        });
      });
      this.$nextTick(() => {
        let priceList = [];
        this.list.forEach((item) => {
          item.subjectId &&
            priceList.push(
              Number(
                NumberAdd(
                  item.invoiceFileVoList.map((item1) => item1.priceTaxTotal)
                )
              )
            );
          // priceList.push(NumberAdd(item.invoiceFileVoList.map(item1 => item1.priceTaxTotal)))
        });
        if (priceList.length > 0) {
          this.totalPrice = NumberAdd(priceList).toFixed(2);
        }
      });
    },
    moneyChange(i, index1) {
      this.list[i].invoiceFileVoList[index1].subjectId = this.list[i].subjectId;
      this.list[i].invoiceFileVoList[index1].invoicingTaxAmount = NumberMul(
        this.list[i].invoiceFileVoList[index1].invoicingAmount,
        this.taxRate / 100
      ).toFixed(2);
      this.list[i].invoiceFileVoList[index1].priceTaxTotal = NumberAdd([
        this.list[i].invoiceFileVoList[index1].invoicingAmount,
        this.list[i].invoiceFileVoList[index1].invoicingTaxAmount,
      ]).toFixed(2);
      this.$nextTick(() => {
        let priceList = [];
        this.list.forEach((item) => {
          item.subjectId &&
            priceList.push(
              Number(
                NumberAdd(
                  item.invoiceFileVoList.map((item1) => item1.priceTaxTotal)
                )
              )
            );
          // priceList.push(NumberAdd(item.invoiceFileVoList.map(item1 => item1.priceTaxTotal)))
        });
        if (priceList.length > 0) {
          this.totalPrice = NumberAdd(priceList).toFixed(2);
        }
      });
    },
    onload(obj) {
      if (obj.invoiceFileVoList.length > 0) {
        this.list = [];
      }
      this.customerId = obj.customerId;
      this.form = Object.assign(this.form, obj);

      this.getSubjectList();
      let subjectIdList = [];
      obj.invoiceFileVoList.forEach((item) => {
        if (subjectIdList.indexOf(item.subjectId) == -1) {
          subjectIdList.push(item.subjectId);
        }
      });
      this.$nextTick(() => {
        subjectIdList.forEach((subjectId) => {
          let item = { subjectId: subjectId, invoiceFileVoList: [] };
          obj.invoiceFileVoList.forEach((invoiceItem) => {
            if (subjectId == invoiceItem.subjectId) {
              item.invoiceFileVoList.push(invoiceItem);
            }
          });
          this.list.push(item);
        });
        this.list.forEach((item) => {
          item.invoiceFileVoList.forEach((item1) => {
            try {
              item1.invoiceFile = JSON.parse(item1.invoiceFile);
            } catch (error) { }
          });
        });

        let priceList = [];
        this.list.forEach((item) => {
          item.subjectId &&
            priceList.push(
              Number(
                NumberAdd(
                  item.invoiceFileVoList.map((item1) => item1.priceTaxTotal)
                )
              )
            );
          // priceList.push(NumberAdd(item.invoiceFileVoList.map(item1 => item1.priceTaxTotal)))
        });
        if (priceList.length > 0) {
          this.totalPrice = NumberAdd(priceList).toFixed(2);
        }
      });

      this.taxRate = this.form.taxRate;
    },
    addOne() {
      this.list.push(Object.assign({}, this.$options.data().list[0]));
      this.getSubjectList();
      // this.$refs[`subject${i + 1}`][0].getList({ customerId: this.customerId, date: this.form.invoicingDate, type: this.form.invoicingType })
      // this.invoicingDateChange()
    },
    addOneInvoiceFile(i) {
      this.list[i].invoiceFileVoList.push(
        Object.assign({}, this.$options.data().list[0].invoiceFileVoList[0])
      );
    },
    delOneInvoiceFile(i, index1) {
      if (!this.list[i].invoiceFileVoList[index1].id) {
        this.list[i].invoiceFileVoList.splice(index1, 1);
      } else {
        Confirm(`此操作将发票文件, 是否继续?`, () => {
          deleteInvoiceFile({ id: this.list[i].invoiceFileVoList[index1].id })
            .then(() => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.list[i].invoiceFileVoList.splice(index1, 1);
            })
            .catch((err) => {
              console.log(err);

              this.$message.error("删除失败");
            });
        });
      }
    },
    delOne(i) {
      if (!this.list[i].invoiceFileVoList[0].invoiceId) {
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
              // this.list[i].invoiceFileVoList.splice(index1, 1)
              this.list.splice(i, 1);
            })
            .catch(() => {
              this.$message.error("删除失败");
            });
        });
      }
    },
    invoicingDateChange() {
      this.getSubjectList();
    },
    commit() {
      let list = [];
      let isCommit = true;
      this.list.forEach((item) => {
        item.invoiceFileVoList.forEach((it) => {
          if (it.invoicingCode == "") {
            this.$message.error({
              message: "请输入发票号码",
              duration: 1500,
            });
            isCommit = false;
            return;
          }

          if (it.invoiceFile.length == 0) {
            this.$message.error({
              message: "请上传发票文件",
              duration: 1500,
            });
            isCommit = false;
            return;
          }
          if (it.invoicingAmount === "") {
            this.$message.error({
              message: "请输入发票金额",
              duration: 1500,
            });
            isCommit = false;
            return;
          }

          if (it.invoicingTaxAmount === "") {
            this.$message.error({
              message: "请输入发票税额",
              duration: 1500,
            });
            isCommit = false;
            return;
          }
          if (it.priceTaxTotal === "") {
            this.$message.error({
              message: "请输入发票总额",
              duration: 1500,
            });
            isCommit = false;
            return;
          }
        });
      });
      if (!isCommit) return;
      this.list.forEach((item) => {
        let list2 = item.invoiceFileVoList
          .filter(
            (item2) =>
              item2.invoicingCode &&
              item2.invoiceFile &&
              item2.invoiceFile.length
          )
          .map((item1) => {
            return {
              invoicingCode: item1.invoicingCode, //发票代码
              invoicingAmount: item1.invoicingAmount, //金额
              invoicingTaxAmount: item1.invoicingTaxAmount, //税额
              priceTaxTotal: item1.priceTaxTotal, //总价
              invoiceFile: JSON.stringify(item1.invoiceFile), //发票文件
              // id: item.id || '',      //主体id
              id: item1.id || "",
              subjectId:
                item.subjectId ||
                (item1.subjectVo && item1.subjectVo.id) ||
                "",
            };
          });
        list = list.concat(list2);
      });
      if (!this.$validate("form")) return;
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
      if (count > this.form.invoicingAmount) {
        this.$message.error("上传的发票总额不能大于开票金额");
        return;
      }
      if (isSubjectId) {
        this.$message.error("请选择开票主体");
        return;
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