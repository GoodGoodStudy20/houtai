<template>
  <el-form size="small" ref="form" :model="form" label-width="130px" :disabled="disabled" class="block-form">
    <el-form-item label="主体名称" prop="name" :rules="[
        { required: true, message: '主体名称不可为空', trigger: 'blur' },
      ]">
      <el-input v-model="form.name" placeholder="请输入主体名称" style="width: 500px"></el-input>
    </el-form-item>
    <el-form-item label="简称" prop="abbreviated" :rules="[{ required: true, message: '简称不可为空', trigger: 'blur' }]">
      <el-input v-model="form.abbreviated" placeholder="请输入简称" style="width: 500px"></el-input>
    </el-form-item>
    <el-form-item
      label="运营性质"
      prop="operateNature"
      :rules="[{ required: true, message: '运营性质', trigger: 'blur' }]"
    >
      <el-select
        v-model="form.operateNature"
        placeholder="请选择"
        style="width: 500px"
      >
        <el-option
          v-for="item in NatureOfOperation"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="主体级别"
      prop="level"
      :rules="[
        { required: true, message: '主体级别不可为空', trigger: 'blur' },
      ]"
    >
      <el-select v-model="form.level" placeholder="请选择" style="width: 500px">
        <el-option
          v-for="item in PrincipalLevel"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="税务类型"
      prop="type"
      :rules="[
        { required: true, message: '税务类型不可为空', trigger: 'blur' },
      ]">
      <el-select v-model="form.type" placeholder="请选择" style="width: 500px" @change="setTaxType">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="信用代码" prop="creditCode" :rules="[
        { required: true, message: '信用代码不可为空', trigger: 'blur' },
      ]">
      <el-input v-model="form.creditCode" placeholder="请输入信用代码" oninput="value=value.toUpperCase()" style="width: 500px"></el-input>
    </el-form-item>
    <el-form-item label="成立日期" prop="establishDate" :rules="[
        { required: true, message: '成立日期不可为空', trigger: 'blur' },
      ]">
      <el-date-picker v-model="form.establishDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 500px"></el-date-picker>
    </el-form-item>
    <el-form-item label="有效期" prop="expireDate" :rules="[
        {
          required: form.isNoFixed == 0,
          message: '有效期不可为空',
          trigger: 'blur',
        },
      ]">
      <el-date-picker v-model="form.expireDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 500px"></el-date-picker>
      <el-checkbox v-model="form.isNoFixed" :true-label="1" :false-label="0">无固定</el-checkbox>
    </el-form-item>
    <el-form-item label="所属地区" prop="province" :rules="[
        { required: true, message: '所属地区不可为空', trigger: 'blur' },
      ]">
      <ChooseArea :province.sync="form.province" :city.sync="form.city" style="width: 500px"></ChooseArea>
    </el-form-item>
    <el-form-item label="注册资本" prop="registeredCapital" :rules="[
        { required: true, message: '注册资本不可为空', trigger: 'blur' },
      ]">
      <el-input v-model="form.registeredCapital" placeholder="请输入注册资本" style="width: 500px" oninput="value=value.replace(/[^\d.]/g,'')">
        <template slot="append">万</template>
      </el-input>
    </el-form-item>
    <el-form-item label="法人" prop="legalPersonName" :rules="[{ required: true, message: '法人不可为空', trigger: 'blur' }]">
      <el-input v-model="form.legalPersonName" placeholder="请输入法人" style="width: 500px"></el-input>
    </el-form-item>
    <el-form-item label="法人联系电话" prop="legalPersonPhone" :rules="[
        { required: true, message: '法人联系电话不可为空', trigger: 'blur' },
      ]">
      <el-input v-model="form.legalPersonPhone" placeholder="请输入法人联系电话" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')" style="width: 500px"></el-input>
    </el-form-item>
    <el-form-item label="工商年报提醒人" prop="annualReportRemind" :rules="[
        { required: true, message: '工商年报提醒人不可为空', trigger: 'blur' },
      ]">
      <ChooseUser v-model="form.annualReportRemind" placeholder="请选择" style="width: 500px"></ChooseUser>
    </el-form-item>
    <el-form-item label="开票人" prop="invoiceUserId" :rules="[
        { required: true, message: '开票人不可为空', trigger: 'blur' },
      ]">
      <ChooseUser v-model="form.invoiceUserId" placeholder="请选择" style="width: 500px"></ChooseUser>
    </el-form-item>
    <el-form-item label="注册地址" prop="registeredAddress" :rules="[
        { required: true, message: '注册地址不可为空', trigger: 'blur' },
      ]">
      <el-input v-model="form.registeredAddress" type="textarea" style="width: 500px" placeholder="请输入注册地址"></el-input>
    </el-form-item>
    <el-form-item label="经营范围" prop="businessScope" :rules="[
        { required: true, message: '经营范围不可为空', trigger: 'blur' },
      ]">
      <el-input v-model="form.businessScope" type="textarea" style="width: 500px" placeholder="请输入经营范围" :autosize="{ minRows: 4, maxRows: 10 }"></el-input>
    </el-form-item>
    <el-form-item label="经营范围分类" prop="scopeListId" :rules="[
        { required: true, message: '经营范围分类不可为空', trigger: 'blur' },
      ]">
      <el-select v-model="form.scopeListId" multiple placeholder="请选择">
        <el-option v-for="item in businessScopeTypeList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="form.remark" type="textarea" style="width: 500px" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 10 }"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { getBusinessScopeTypeList } from "@/api/index.js";
import ChooseArea from "@/components/ChooseArea/index.vue";
import ChooseUser from "@/components/ChooseUser/index.vue";
import {
  SubjectType,
  NatureOfOperation,
  PrincipalLevel,
} from "@/utils/field.js";
import { Assign } from "@/utils/index.js";
export default {
  name: "Form1",
  components: { ChooseArea, ChooseUser },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        name: "", //主体名称
        abbreviated: "", //主体简称
        operateNature: "", //运营性质
        level: "", //主体级别
        type: "", //主体类型(0.一般纳税人,1.小规模)
        creditCode: "", //信用代码
        establishDate: "", //成立日期
        expireDate: "", //到期日期
        isNoFixed: 0, //是否无固定(0.否,1.是)
        province: "", //省
        city: "", //市
        registeredCapital: "", //注册资本(万)
        legalPersonName: "", //法人名称
        legalPersonPhone: "", //法人联系电话
        registeredAddress: "", //注册地址
        businessScope: "", //经营范围
        remark: "", //备注
        scopeListId: "",
        annualReportRemind: "", //工商年报提醒人
        invoiceUserId: "", //开票人
      },
      options: SubjectType,
      businessScopeTypeList: [],
      NatureOfOperation: NatureOfOperation,
      PrincipalLevel: PrincipalLevel,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    onload(obj) {
      Assign(this.form, obj);
      if (this.form.scopeListId && this.form.scopeListId.length > 0) {
        this.form.scopeListId = this.form.scopeListId.split(",");
        this.form.scopeListId = this.form.scopeListId.map((item) =>
          Number(item)
        );
      }
    },
    commit() {
      if (!this.$validate("form")) return;
      if (Array.isArray(this.form.scopeListId)) {
        this.form.scopeListId = this.form.scopeListId.join(",");
      }
      return this.form;
    },
    getList() {
      getBusinessScopeTypeList(this.form).then((res) => {
        if (res.code != 200) return;
        this.businessScopeTypeList = res.data;
      });
    },
    // 税务类型
    setTaxType(e) {
      this.$store.commit("setTaxType", e);
    },
  },
};
</script>

<style>
</style>