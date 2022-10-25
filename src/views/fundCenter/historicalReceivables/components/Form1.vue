<template>
  <el-form size="small" ref="form" :model="form" label-width="auto" :disabled="disabled" class="block-form">
    <el-form-item label="客户全称" prop="customerId" :rules="[{ required: true, message: '客户全称不可为空', trigger: 'change' }]">
      <!-- <el-select v-model="form.customer" placeholder="请选择" style="width:500px">
        <el-option v-for="(item,i) in customerList" :key="item" :label="item.name" :value="item.name"></el-option>
      </el-select> -->
      <ChooseCustomer v-model="form.customerId" :showValue="'name'" ref="customer" @change="customerChange" style="width:500px"></ChooseCustomer>
    </el-form-item>
    <el-form-item label="客户简称" prop="customerId" :rules="[{ required: true, message: '客户简称不可为空', trigger: 'change' }]">
      <!-- <el-select v-model="form.invoicingType" placeholder="请选择" style="width:500px">
        <el-option v-for="(item,i) in options1" :key="item" :label="item" :value="i"></el-option>
      </el-select> -->
      <!-- customerVo -->
      <el-input v-model="form.abbreviated" placeholder="请输入客户简称" :disabled="true" style="width:500px"></el-input>
      <!-- <ChooseCustomer v-model="form.abbreviated" :disabled="true" :showValue="'abbreviated'" ref="customer" style="width:500px"></ChooseCustomer> -->
    </el-form-item>
    <el-form-item label="渠道" prop="channelId" :rules="[{ required: true, message: '渠道不可为空', trigger: 'change' }]">
      <el-select v-if="editType !='show'" v-model="form.channelId" placeholder="请选择" style="width:500px">
        <el-option v-for="item in ChannelType" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-input v-if="editType=='show' && form.customerChannelVo" v-model="form.customerChannelVo.name" style="width:500px"></el-input>
    </el-form-item>
    <el-form-item label="应收利息" prop="receivableInterest" :rules="[{ required: true, message: '应收利息不可为空', trigger: 'change' }]">
      <el-input v-model="form.receivableInterest" placeholder="请输入应收利息" style="width:500px"><template slot="append">元</template></el-input>
    </el-form-item>
    <el-form-item label="应收本金" prop="receivablePrincipal" :rules="[{ required: true, message: '应收本金不可为空', trigger: 'change' }]">
      <el-input v-model="form.receivablePrincipal" placeholder="请输入应收本金" style="width:500px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"><template slot="append">元</template></el-input>
    </el-form-item>
    <el-form-item label="应收总额" prop="receivableTotal" :rules="[{ required: true, message: '应收总额不可为空', trigger: 'change' }]">
      <el-input v-model="form.receivableTotal" @change="receivableTotalChange" placeholder="公式自动计算" style="width:500px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"><template slot="append">元</template></el-input>
    </el-form-item>
    <el-form-item label="应收负责人" prop="directorId" :rules="[{ required: true, message: '应收负责人不可为空', trigger: 'change' }]">
      <!-- <el-select v-model="form.type" placeholder="请选择" style="width:500px">
        <el-option v-for="(item,i) in options2" :key="item" :label="item" :value="i"></el-option>
      </el-select> -->
      <ChooseUser v-model="form.directorId" placeholder="请选择" style="width:500px"></ChooseUser>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="form.remark" type="textarea" style="width:500px" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
// import { Assign } from '@/utils/index.js'
// import { getCustomerList } from '@/api/index'
import ChooseCustomer from '@/components/ChooseCustomer/index.vue'
import ChooseUser from '@/components/ChooseUser/index.vue'
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
      form: {
        customerId: '',    //客户ID
        abbreviated: "",//客户简称
        receivableInterest: '',  //应收利息
        receivablePrincipal: '',  //应收本金
        receivableTotal: '',  //应收总额
        directorId: '',   //应收负责人id
        remark: '',    //备注
        channelId: '',//渠道
      },
      ChannelType: [],//
    }
  },
  watch: {
    // 'form.receivableInterest'
    'form.receivableInterest': {
      handler(newv, oldv) {
        this.arrivalMoneyMoneyChange()
      },
      deep: true
    },
    'form.receivablePrincipal': {
      handler(newv, oldv) {
        this.arrivalMoneyMoneyChange()
      },
      deep: true
    },
    'form.receivableTotal': {
      handler(newv, oldv) {
        this.receivableTotalChange(newv)
      },
      deep: true
    },
  },
  methods: {
    arrivalMoneyMoneyChange() {
      const { receivableInterest, receivablePrincipal } = this.form
      this.form.receivableTotal = parseFloat(Number(receivableInterest).toFixed(2)) + parseFloat(Number(receivablePrincipal).toFixed(2))
    },
    customerChange(item, type) {
      this.ChannelType = item.customerChannelVoList
      if (type != 'onload') {
        this.$set(this.form, 'abbreviated', item.abbreviated)
        this.$emit('customerChange', item)
        this.$emit('change', item)
      }
    },
    receivableTotalChange(item, type) {
      // if (type != 'onload') {
      this.$emit('receivableTotalChange', item)
      // }
    },
    onload(obj) {
      this.$nextTick(() => {
        this.$refs['customer'].getList('onload')
      })
      this.form = Object.assign(this.form, obj)
      if (this.form && this.form.customerVo) {
        this.form.abbreviated = this.form.customerVo.abbreviated
        // this.form.customerChannelName = this.form.customerChannelVo.name
      }
    },
    commit() {
      if (!this.$validate('form')) return
      let obj = Object.assign({}, this.form)
      return obj
    },

  }
}
</script>

<style>
</style>