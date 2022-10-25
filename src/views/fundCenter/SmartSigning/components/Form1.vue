<template>
  <div class="box2">
    <div class="title">客户签约需求</div>
    <el-form size="small" inline ref="form" :model="form" label-width="120px" :disabled="disabled" class="block-form">
      <el-form-item label="客户全称" prop="customerId" :rules="[{ required: true, message: '客户全称不可为空', trigger: 'change' }]">
        <ChooseCustomer v-model="form.customerId" :showValue="'name'" ref="customer" @change="customerChange" style="width:460px"></ChooseCustomer>
      </el-form-item>
      <el-form-item label="">
      </el-form-item>
      <el-form-item label="税务类型要求" prop="taxTypeDemand" :rules="[{ required: true, message: '税务类型不可为空', trigger: 'change' },]">
        <el-select v-model="form.taxTypeDemand" placeholder="请选择税务类型要求" style="width:460px">
          <el-option label="一般纳税人" :value="0"></el-option>
          <el-option label="小规模" :value="1"></el-option>
          <el-option label="无要求" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地域要求" prop="regionDemand" :rules="[{ required: true, message: '地域要求不可为空', trigger: 'change' }]">
        <el-select v-model="form.regionDemand" placeholder="请选择地域要求" style="width:460px">
          <el-option label="要求本省" :value="0"></el-option>
          <el-option label="要求本市" :value="1"></el-option>
          <el-option label="无要求" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="成立年限" prop="establishYears" :rules="[{ required: true, message: '成立年限不可为空', trigger: 'change' }]">
        <el-select v-model="form.establishYears" placeholder="请选择成立年限" style="width:460px">
          <el-option label="六月以上" :value="0"></el-option>
          <el-option label="无要求" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="注册资本" prop="registeredCapital" :rules="[{ required: true, message: '注册资本不可为空', trigger: 'change' }]">
        <el-select v-model="form.registeredCapital" placeholder="请选择注册资本" style="width:460px">
          <el-option label="50万以上" :value="0"></el-option>
          <el-option label="100万以上" :value="1"></el-option>
          <el-option label="无要求" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主体关联要求" prop="subjectRelationDemand" :rules="[{ required: true, message: '主体关联要求不可为空', trigger: 'change' }]">
        <el-select v-model="form.subjectRelationDemand" placeholder="请选择主体关联要求" style="width:460px">
          <el-option label="省内无关联" :value="0"></el-option>
          <el-option label="市内无关联" :value="1"></el-option>
          <el-option label="无要求" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发票类型" prop="subjectRelationDemand" :rules="[{ required: true, message: '发票类型不可为空', trigger: 'change' }]">
        <el-select v-model="form.subjectRelationDemand" placeholder="请选择发票类型" style="width:460px">
          <el-option label="增值税普通发票" :value="0"></el-option>
          <el-option label="增值税普通发票（电子）" :value="1"></el-option>
          <el-option label="增值税专用发票" :value="2"></el-option>
          <el-option label="增值税专用发票（电子）" :value="3"></el-option>
          <el-option label="无要求" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务场景" prop="sceneListId" :rules="[{ required: true, message: '业务场景不可为空', trigger: 'change,blur' }]">
        <el-select v-model="form.sceneListId" multiple placeholder="请选择业务场景" style="width:460px">
          <el-option v-for="item in businessScopeTypeList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务规模/月" prop="businessScale" :rules="[{ required: true, message: '业务规模不可为空', trigger: 'change' }]">
        <el-input v-model="form.businessScale" placeholder="请输入业务量" style="width: 460px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="科目排除" prop="delateListId" :rules="[{ required: true, message: '科目排除不可为空', trigger: 'change,blur' }]">
        <el-select v-model="form.delateListId" multiple placeholder="请选择已开票科目排除名称" style="width:460px">
          <el-option v-for="item in InvoicingAccountList" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div style="text-align:center;margin-top:50px">
      <el-button @click="cancel" style="margin-right:50px">返 回</el-button>
      <el-button type="primary" @click="nextSteps" style="margin-right:50px">下一步</el-button>
    </div>
  </div>
</template>

<script>
// import { Assign } from '@/utils/index.js'
import { getCustomerInfo, getBusinessScopeTypeList } from '@/api/index'
import ChooseCustomer from '@/components/ChooseCustomer/index.vue'
import ChooseUser from '@/components/ChooseUser/index.vue'
import {
  SubjectType,
  NatureOfOperation,
  PrincipalLevel,
} from "@/utils/field.js";
export default {
  name: 'Form1',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    editType: {
      type: String,
      default: ''
    }
  },
  components: { ChooseCustomer, ChooseUser },
  data() {
    return {
      businessScopeTypeList: [],
      form: {
        customerId: '',    //客户ID
        taxTypeDemand: "",
        regionDemand: '',
        establishYears: '',  //成立年限
        registeredCapital: '',  //
        subjectRelationDemand: '',   //
        sceneListId: '',    //
        businessScale: '',//
      },
      ChannelType: [],//
      SubjectType: [
        {
          value: 1,
          label: '一般纳税人'
        },
        {
          value: 2,
          label: '小规模'
        },
        {
          value: '',
          label: '无'
        },
      ],
      detailInfo: {},
      InvoicingAccountList: [
        {
          value: '',
          name: '无要求'
        },
        {
          value: 0,
          name: '现代服务*服务费'
        },
        {
          value: 1,
          name: '现代服务*检测费'
        },
        {
          value: 2,
          name: '现代服务*汽车服务'
        },
        {
          value: 3,
          name: '现代服务*咨询服务费'
        },
        {
          value: 4,
          name: '现代服务*宣传服务费'
        },
        {
          value: 5,
          name: '信息技术服务*服务费'
        },
        {
          value: 6,
          name: '信息技术服务*技术费'
        },
        {
          value: 7,
          name: '信息技术服务*信息服务费'
        },
      ]
    }
  },
  watch: {

  },
  created() {
    this.getBusinessScopeTypeList()
  },
  methods: {
    nextSteps() {
      if (!this.$validate('form')) return
      this.$emit('input', 1)
    },
    getBusinessScopeTypeList() {
      let form = {
        regionDemand: "",
        taxTypeDemand: "",
        registeredCapital: "",
        subjectRelationDemand: "",
        sceneListId: '',
        establishYears: '',
        businessScale: ''
      }
      getBusinessScopeTypeList(form).then(res => {
        if (res.code != 200) return
        this.businessScopeTypeList = res.data
      })
    },
    customerChange(item) {
      getCustomerInfo({ id: item.id }).then((res) => {
        this.detailInfo = res.data || {};
        const { customerDemandVo } = this.detailInfo
        this.form.taxTypeDemand = customerDemandVo.taxTypeDemand
        this.form.regionDemand = customerDemandVo.regionDemand
        this.form.establishYears = customerDemandVo.establishYears
        this.form.registeredCapital = customerDemandVo.registeredCapital
        this.form.subjectRelationDemand = customerDemandVo.subjectRelationDemand
        this.form.sceneListId = customerDemandVo.sceneListId
        this.form.businessScale = customerDemandVo.businessScale
        if (this.form.sceneListId && this.form.sceneListId.length > 0) {
          this.form.sceneListId = this.form.sceneListId.split(',')
          this.form.sceneListId = this.form.sceneListId.map(item => Number(item))
        }
      });
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.box2 {
  .title {
    margin: 20px 0 30px;
    font-size: 16px;
    font-weight: 600;
  }
}
</style>