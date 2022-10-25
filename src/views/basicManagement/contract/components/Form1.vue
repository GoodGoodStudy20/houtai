<template>
  <el-form size="small" ref="form" :model="form" label-width="150px" :disabled="disabled" class="block-form">
    <el-form-item label="合同编号" prop="number" :rules="[
        { required: true, message: '合同编号不可为空', trigger: 'blur' },
      ]">
      <el-input v-model="form.number" placeholder="请输入合同编号" style="width: 500px"></el-input>
    </el-form-item>
    <el-form-item label="合同类型" prop="type" :rules="[
        { required: true, message: '合同类型不可为空', trigger: 'blur' },
      ]">
      <el-radio-group v-model="form.type" @change="typeChange">
        <el-radio :label="item.value" v-for="item in ContractType">{{
          item.label
        }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <div v-if="form.type == 0">
      <el-form-item label="客户（甲方）" prop="customerId" :rules="[
          { required: true, message: '客户（甲方）不可为空', trigger: 'blur' },
        ]">
        <ChooseCustomer v-model="form.customerId" style="width: 500px" @change="customerChange"></ChooseCustomer>
      </el-form-item>
      <el-form-item label="主体（乙方）" prop="subjectId" :rules="[
          { required: true, message: '主体（乙方）不可为空', trigger: 'blur' },
        ]">
        <ChooseSubject v-model="form.subjectId" style="width: 500px"></ChooseSubject>
      </el-form-item>
    </div>
    <div v-if="form.type == 1">
      <el-form-item label="主体（甲方）" prop="subjectId" :rules="[
          { required: true, message: '主体（甲方）不可为空', trigger: 'blur' },
        ]">
        <ChooseSubject v-model="form.subjectId" style="width: 500px" @change="customerChange"></ChooseSubject>
      </el-form-item>
      <el-form-item label="服务商（乙方）" prop="serviceProviderId" :rules="[
          {
            required: true,
            message: '服务商（乙方）不可为空',
            trigger: 'blur',
          },
        ]">
        <ChooseServiceProvider v-model="form.serviceProviderId" style="width: 500px"></ChooseServiceProvider>
      </el-form-item>
    </div>
    <div v-if="form.type == 2">
      <el-form-item label="甲方" prop="partyAId" :rules="[{ required: true, message: '甲方不可为空', trigger: 'blur' }]">
        <ChooseCustomer v-model="form.partyAId" v-show="form.partyAType === 0" style="width: 500px" @change="customerChange"></ChooseCustomer>
        <ChooseSubject v-model="form.partyAId" v-show="form.partyAType == 1" style="width: 500px"></ChooseSubject>
        <ChooseServiceProvider v-model="form.partyAId" v-show="form.partyAType == 2" style="width: 500px"></ChooseServiceProvider>
        <el-dropdown @command="handleCommand($event, 'partyAType', 'partyAId')">
          <el-button type="primary">
            {{ option[form.partyAType] || "选择"
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, i) in option" :key="item" :command="i">{{ item }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
      <el-form-item label="乙方" prop="partyBId" :rules="[{ required: true, message: '乙方不可为空', trigger: 'blur' }]">
        <ChooseCustomer v-model="form.partyBId" v-show="form.partyBType === 0" style="width: 500px"></ChooseCustomer>
        <ChooseSubject v-model="form.partyBId" v-show="form.partyBType == 1" style="width: 500px"></ChooseSubject>
        <ChooseServiceProvider v-model="form.partyBId" v-show="form.partyBType == 2" style="width: 500px"></ChooseServiceProvider>
        <el-dropdown @command="handleCommand($event, 'partyBType', 'partyBId')">
          <el-button type="primary">
            {{ option[form.partyBType] || "选择"
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, i) in option" :key="item" :command="i">{{ item }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
      <el-form-item label="丙方" prop="partyCId" :rules="[{ required: true, message: '丙丁不可为空', trigger: 'blur' }]">
        <ChooseCustomer v-model="form.partyCId" v-show="form.partyCType === 0" style="width: 500px"></ChooseCustomer>
        <ChooseSubject v-model="form.partyCId" v-show="form.partyCType == 1" style="width: 500px"></ChooseSubject>
        <ChooseServiceProvider v-model="form.partyCId" v-show="form.partyCType == 2" style="width: 500px"></ChooseServiceProvider>
        <el-dropdown @command="handleCommand($event, 'partyCType', 'partyCId')">
          <el-button type="primary">
            {{ option[form.partyCType] || "选择"
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, i) in option" :key="item" :command="i">{{ item }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </div>
    <div v-if="form.type == 3">
      <el-form-item label="资方（甲方）" prop="backersId" :rules="[
          { required: true, message: '资方（甲方）不可为空', trigger: 'blur' },
        ]">
        <ChooseCapital v-model="form.backersId" style="width: 500px" @change="customerChange"></ChooseCapital>
      </el-form-item>
      <el-form-item label="主体（乙方）" prop="subjectId" :rules="[
          { required: true, message: '主体（乙方）不可为空', trigger: 'blur' },
        ]">
        <ChooseSubject v-model="form.subjectId" style="width: 500px"></ChooseSubject>
      </el-form-item>
    </div>
    <el-form-item label="合同期限" prop="contractStartDate" :rules="[
        { required: true, message: '合同期限不可为空', trigger: 'blur' },
      ]">
      <el-date-picker v-model="form.contractStartDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 240px"></el-date-picker>
      至
      <el-date-picker v-model="form.contractEndDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 238px"></el-date-picker>
    </el-form-item>
    <el-form-item label="签订日期" prop="signDate" :rules="[
        { required: true, message: '签订日期不可为空', trigger: 'blur' },
      ]">
      <el-date-picker v-model="form.signDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 500px"></el-date-picker>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="form.remark" type="textarea" style="width: 500px" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 10 }"></el-input>
    </el-form-item>
    <!-- <el-form-item label="应用渠道" prop="channelId" :rules="[{ required: true, message: '渠道不可为空', trigger: 'change' }]">
      <el-select v-model="form.channelId" placeholder="请选择" style="width:500px">
        <el-option v-for="item in ChannelType" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item> -->
    <!-- <el-form-item label="产品分类" prop="name" :rules="[{ required: true, message: '产品分类不可为空', trigger: 'blur' }]">
      <el-select v-model="form.productTypeId" placeholder="请选择">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="产品" prop="productListId" :rules="[{ required: true, message: '产品不可为空', trigger: 'blur' }]">
      <ChooseProduct v-model="form.productListId" multiple style="width:500px"></ChooseProduct>
    </el-form-item> -->
    <!-- <el-form-item label="合同期限" prop="contractStartDate" :rules="[{ required: true, message: '合同期限不可为空', trigger: 'blur' }]">
      <el-date-picker v-model="form.contractStartDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:240px"></el-date-picker>
      至
      <el-date-picker v-model="form.contractEndDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:238px"></el-date-picker>
    </el-form-item>
    <el-form-item label="签订日期" prop="signDate" :rules="[{ required: true, message: '签订日期不可为空', trigger: 'blur' }]">
      <el-date-picker v-model="form.signDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:500px"></el-date-picker>
    </el-form-item>
    <el-form-item label="是否有协议时限延长" prop="channelId" :rules="[{ required: true, message: '延长日期不可为空', trigger: 'change' }]">
      <el-date-picker v-model="form.contractStartDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择延长日期" style="width:240px"></el-date-picker>
      <el-radio style="margin-left:50px" v-model="form.radio" label="0">否</el-radio>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="form.remark" type="textarea" style="width:500px" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
    </el-form-item> -->
  </el-form>
</template>

<script>
import ChooseCustomer from "@/components/ChooseCustomer/index.vue";
import ChooseSubject from "@/components/ChooseSubject/index.vue";
import ChooseProduct from "@/components/ChooseProduct/index.vue";
import ChooseServiceProvider from "@/components/ChooseServiceProvider/index.vue";
import ChooseCapital from "@/components/ChooseCapital/index.vue";
import { Assign } from "@/utils/index.js";
import { ContractType } from "@/utils/field.js";
import { getProductTypeList } from "@/api/index.js";

export default {
  name: "Form1",
  components: {
    ChooseCustomer,
    ChooseServiceProvider,
    ChooseSubject,
    ChooseProduct,
    ChooseCapital,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    contractType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      form: {
        number: "", //合同编号
        type: 0, //合同类型(0.客户合同,1.服务商合同)
        subjectId: "", //主体id
        backersId: "", //资方id
        customerId: "", //客户id
        serviceProviderId: "", //服务商id
        partyAId: "", //甲方id
        partyAType: "", //甲方类型(0.客户,1.主体,2.服务商)
        partyBId: "", //乙方id
        partyBType: "", //乙方类型(0.客户,1.主体,2.服务商)
        partyCId: "", //丙方id
        partyCType: "", //丙方类型(0.客户,1.主体,2.服务商)
        contractStartDate: "", //合同期限
        contractEndDate: "", //合同期限
        signDate: "", //签订日期
        remark: "", //备注
        channelId: "", //应用渠道
        radio: "0",
      },
      option: ["客户", "主体", "服务商"],
      ContractType: ContractType,
      ChannelType: [],
    };
  },
  methods: {
    onload(obj) {
      Assign(this.form, obj);

    },
    handleCommand(command, type, id) {
      this.form[type] = command;
      this.form[id] = "";
    },
    commit() {
      if (!this.$validate("form")) return;
      return this.form;
    },
    customerChange(item, type) {
      this.ChannelType = item.customerChannelVoList;
    },
    typeChange() {
      this.clearInfo();
    },
    clearInfo() {
      this.form.subjectId = "";
      this.form.backersId = "";
      this.form.customerId = "";
      this.form.serviceProviderId = "";
      this.form.partyAId = "";
      this.form.partyAType = "";
      this.form.partyBId = "";
      this.form.partyBType = "";
      this.form.partyCType = "";
      this.form.partyCId = "";
      this.ChannelType = [];
    },
  },
  created() {
    getProductTypeList({}).then((res) => {
      this.options = res.data;
    });
    console.log(this.contractType);

    if (this.contractType == 1) {
      this.ContractType = [{ value: 0, label: "客户合同" },]
    }
  },
};
</script>

<style>
</style>