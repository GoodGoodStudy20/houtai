<template>
  <div style="margin:auto;width:1180px;">
    <div style="display:flex">
      <div style="margin-bottom:20px">支付委托经营所得金额 <span style="color:red;">{{moneySum || 0 | toThousands}}</span> 元</div>
      <div style="margin-bottom:20px;margin-left:30px">支付服务商金额 <span style="color:red;">{{moneySum2 || 0 | toThousands}}</span> 元</div>
    </div>
    <el-form size="small" inline :disabled="disabled">
      <el-form-item label="付款日期" v-if="showTime">
        <el-date-picker v-model="paymentDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:200px"></el-date-picker>
      </el-form-item>
      <div v-for="(item,i) in list" :key="i">
        <el-form-item label="主体">
          <ChooseSubject v-model="item.subjectId" style="width:200px"></ChooseSubject>
        </el-form-item>
        <el-form-item label="服务商">
          <ChooseServiceProvider v-model="item.serviceId" @change="serviceChange(arguments,i)" style="width:200px"></ChooseServiceProvider>
        </el-form-item>
        <!-- <el-form-item label="账号">
          <el-select v-model="item.accountTaxId" placeholder="请选择" style="width:200px" filterable>
            <el-option v-for="acc in item.accountTaxVoList" :key="acc.id" :label="acc.name" :value="acc.id"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="支付委托经营所得金额">
          <el-input v-model="item.directAmount" @change="moneyChange(i)" placeholder="请输入支付委托经营所得金额" style="width:180px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="支付服务商金额">
          <el-input v-model="item.rechargeAmount" placeholder="请输入支付服务商金额" style="width:180px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label=" " style="width:70px">
          <el-button type="primary" @click="addOne" v-show="i==list.length-1">增加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="delOne(i)" v-show="list.length>1">删除</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import ChooseSubject from '@/components/ChooseSubject/index.vue'
import ChooseServiceProvider from '@/components/ChooseServiceProvider/index.vue'
import { deletePayment } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
import { NumberAdd, NumberMul, NumberSub } from '@/utils/index.js'
export default {
  name: 'PaymentInformation',
  components: { ChooseSubject, ChooseServiceProvider },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    showTime: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [
        {
          rechargeAmount: '',      //充值金额
          directAmount: '',      //直达金额(元)
          serviceId: '',      //服务商id
          subjectId: '',      //主体id
        },
      ],
      refundAmount: 0,
      paymentDate: ''
    }
  },
  created() {
    this.$bus.$on('refundAmount', res => {
      this.refundAmount = res
    })
  },
  computed: {
    moneySum() {
      let list = this.list.map(item => item.directAmount)
      return NumberSub(NumberAdd(list), this.refundAmount)
    },
    moneySum2() {
      let list = this.list.map(item => item.rechargeAmount)
      return NumberAdd(list)
    }
  },
  methods: {
    onload(list, date) {
      this.paymentDate = date
      this.list = (list && list.length) ? list : this.list
    },
    addOne() {
      this.list.push(Object.assign({}, this.$options.data().list[0]))
    },
    delOne(i) {
      if (!this.list[i].id) {
        this.list.splice(i, 1)
      } else {
        Confirm(`此操作将删除支付信息, 是否继续?`, () => {
          deletePayment({ id: this.list[i].id }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.list.splice(i, 1)
          }).catch(err => {
            this.$message.error('删除失败')
          })
        })
      }
    },
    serviceChange(args, i) {
      let item = args[0] || {}
      let type = args[1]
      // this.list[i].accountTaxVoList = item.accountTaxVoList
      this.$set(this.list[i], 'serviceCharge', item.serviceCharge)
      if (type == 'onload') return
      this.$set(this.list[i], 'rechargeAmount', NumberMul(this.list[i].directAmount, NumberAdd([1, item.serviceCharge / 100])))
    },
    moneyChange(i) {
      this.$set(this.list[i], 'rechargeAmount', NumberMul(this.list[i].directAmount, NumberAdd([1, this.list[i].serviceCharge / 100])))
    },
    commit() {
      if (this.showTime && !this.paymentDate) {
        this.$message.warning('请选择付款日期')
        return
      }
      let list = this.list.map(item => {
        return {
          rechargeAmount: item.rechargeAmount,      //充值金额
          directAmount: item.directAmount,      //委托经营所得(元)
          serviceId: item.serviceId || '',      //服务商id
          subjectId: item.subjectId,      //主体id
          id: item.id || '',      //主体id
        }
      })
      return { date: this.paymentDate, list }
    }
  }
}
</script>

<style>
</style>