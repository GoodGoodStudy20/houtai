<template>
  <div style="display: table; margin: 0 auto">
    <el-form
      size="small"
      inline
      ref="form"
      :model="form"
      label-width="auto"
      :disabled="disabled"
    >
      <div style="display: flex">
        <el-form-item
          label="单个客户每月不超过"
          prop="customerMonthly"
          :rules="[
            {
              required: true,
              message: '单个客户每月不超过不可为空',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="form.customerMonthly"
            placeholder="请输入单个客户每月不超过"
            style="width: 200px"
            oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="单个省份每月不超过"
          prop="provinceMonthly"
          :rules="[
            {
              required: true,
              message: '单个省份每月不超过不可为空',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="form.provinceMonthly"
            placeholder="请输入单个省份每月不超过"
            style="width: 200px"
            oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </div>
    </el-form>
    <el-divider></el-divider>
    <el-form
      size="small"
      ref="form2"
      :model="form2"
      inline
      :disabled="disabled"
      class="from2-block"
    >
      <div v-for="(item, i) in list" :key="i">
        <el-form-item
          label="发票类型"
          :rules="[
            { required: true, message: '发票类型不可为空', trigger: 'blur' },
          ]"
        >
          <el-select
            v-model="item.type"
            placeholder="请选择"
            @change="onload(item.type, i)"
            style="width: 186px"
          >
            <el-option
              v-for="invoiceType in InvoiceTypeList"
              :key="invoiceType.value"
              :label="invoiceType.label"
              :value="invoiceType.value"
              :disabled="invoiceType.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="发票份数(份):"
          :rules="[
            { required: true, message: '发票份数不可为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="item.quantity"
            @change="moneyChange(i)"
            placeholder="请输入"
            oninput="value=value.replace(/[^\d]/g,'')"
            style="width: 70px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="单张票最大额度(元):"
          :rules="[
            {
              required: true,
              message: '单张票最大额度不可为空',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="item.maxAmount"
            @change="moneyChange(i)"
            placeholder="请输入"
            oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
            style="width: 92px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="开票额度(元):"
          :rules="[
            { required: true, message: '开票额度不可为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="item.totalAmount"
            placeholder="请输入"
            oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
            style="width: 92px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="税率(%):"
          :rules="[
            { required: true, message: '税率不可为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="item.taxRate"
            placeholder="请输入"
            oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
            style="width: 70px"
          ></el-input>
        </el-form-item>
        <el-form-item label=" " style="width: 70px">
          <el-button
            @click="addOne"
            type="primary"
            v-show="i == list.length - 1"
            :disabled="list.length == 4"
            >增加</el-button
          >
        </el-form-item>
        <el-form-item label=" " style="width: 70px">
          <el-button @click="delOne(i)" type="danger" v-show="list.length > 1"
            >删除</el-button
          >
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { Assign } from "@/utils/index.js";
import { InvoiceTypeList } from "@/utils/field.js";
import { Confirm } from "@/utils/common.js";
import { NumberMul } from "@/utils/index.js";
import { deleteInvoiceRestrictions } from "@/api/index.js";
export default {
  name: "Form6",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        // invoicingRestrictions: '',               //开票额度
        // maxAmount: '',               //单张票最大额度
        customerMonthly: "", //单个客户每月不超过
        provinceMonthly: "", //单个省份每月不超过
      },
      form2: {},
      InvoiceTypeList: InvoiceTypeList,
      list: [
        {
          maxAmount: "", //单张票最大额度
          quantity: "", //开票数量
          subjectId: "", //主体id
          totalAmount: "", //开票总额
          type: "", //发票类型（0.普通发票,1.专用发票,2.普通发票电子版）
          remark: "",
          taxRate: "", // 税率
        },
      ],
      invoiceType: "", // 发票类型
      currentInvoiceTypeRow: {},
    };
  },
  watch: {
    "$store.state.taxType": {
      handler() {
        this.setTaxType2();
      },
    },
  },
  methods: {
    onload(obj, index) {
      Assign(this.form, obj);

      this.list =
        obj.invoiceRestrictionsVoList && obj.invoiceRestrictionsVoList.length
          ? obj.invoiceRestrictionsVoList
          : this.list;
      this.invoiceType = obj; // 发票类型
      this.currentInvoiceTypeRow = this.list[index]; // 当前发票类型 row

      this.setTaxType();
      this.setDisabled();
    },
    setDisabled() {
      // 动态设置禁用选项
      this.InvoiceTypeList.map((item) => {
        item.disabled = false;
      });
      this.list.map((item) => {
        if (this.InvoiceTypeList[item.type]) {
          this.InvoiceTypeList[item.type].disabled = true;
        }
      });
    },
    /**
     *  1、一般纳税人：0
     *  专票/普票   6%
     *  2、小规模：1
     *  专票   3%
     *  普票   免税（0%）
     */
    setTaxType() {
      let taxType = this.$store.state.taxType; // 税务类型
      if (taxType === 0) {
        if (this.invoiceType || this.invoiceType == 0) {
          this.currentInvoiceTypeRow.taxRate = 6;
        }
      } else if (taxType === 1) {
        if (this.invoiceType == 0 || this.invoiceType == 3) {
          this.currentInvoiceTypeRow.taxRate = 3;
        } else if (this.invoiceType == 1 || this.invoiceType == 2) {
          this.currentInvoiceTypeRow.taxRate = 0;
        }
      }
    },
    setTaxType2() {
      let taxType = this.$store.state.taxType; // 税务类型
      if (taxType === 0) {
        this.list.map((item) => {
          if (item.type || item.type == 0) {
            item.taxRate = 6;
          }
        });
      } else if (taxType === 1) {
        this.list.map((item) => {
          if (item.type == 0 || item.type == 3) {
            item.taxRate = 3;
          } else if (item.type == 1 || item.type == 2) {
            item.taxRate = 0;
          }
        });
      }
    },
    addOne() {
      // this[list].push(Object.assign({}, this.$options.data()[list][0]))
      this.list.push(Object.assign({}, this.$options.data().list[0]));
    },
    moneyChange(i) {
      this.$set(
        this.list[i],
        "totalAmount",
        NumberMul(this.list[i].maxAmount, this.list[i].quantity)
      );
    },
    delOne(i) {
      if (!this.list[i].id) {
        this.list.splice(i, 1);
      } else {
        Confirm(`此操作将删除开票限制信息, 是否继续?`, () => {
          deleteInvoiceRestrictions({ id: this.list[i].id })
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
      this.setDisabled();
    },
    commit() {
      if (!this.$validate("form")) return;
      if (!this.$validate("form2")) return;
      let list = this.list
        .filter(
          (item) =>
            item.maxAmount &&
            item.quantity &&
            item.totalAmount &&
            item.taxRate &&
            (item.type == 0 || item.type)
        )
        .map((item) => {
          return {
            maxAmount: item.maxAmount, //单张票最大额度
            quantity: item.quantity, //开票数量
            totalAmount: item.totalAmount, //开票总额
            type: item.type, //发票类型（0.普通发票,1.专用发票,2.普通发票电子版）
            id: item.id || "",
            taxRate: item.taxRate, // 税率
          };
        });
      this.form.addInvoiceRestrictionsReqList = list;
      return this.form;
    },
  },
};
</script>

<style lang="scss" scoped>
// .from2-block{

// }
</style>