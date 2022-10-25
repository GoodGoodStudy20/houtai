<template>
  <div style="margin:auto;width:1280px;">
    <div v-for="(item,i) in list" :key="i">
      <el-form size="small" inline :disabled="disabled">
        <el-form-item label="日期" prop="establishDate">
          <el-date-picker v-model="item.repaymentDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="回款金额（元）">
          <el-input v-model="item.returnMoney" @input="handleSurplusReceivableMoney(item,i)" placeholder="请输入金额" style="width:180px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')">
          </el-input>
        </el-form-item>
        <el-form-item label="剩余应收金额（元）">
          <el-input v-model="item.surplusReceivableMoney" placeholder="金额自动计算" style="width:180px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')">
          </el-input>
        </el-form-item>
        <el-form-item label=" " style="width:70px">
          <el-button type="primary" @click="addOne" v-show="i==list.length-1">增加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="delOne(i)" v-show="list.length>1">删除</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import { Confirm } from '@/utils/common.js'
import { NumberSub } from '@/utils/index.js'
import { deleteReturnMoneyRecord } from '@/api/index.js'
export default {
  name: 'Form3',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    editType: {
      type: String
    },
  },
  data() {
    return {
      form: {
        returnMoneyRecordVoList: [
          {
            repaymentDate: '',
            returnMoney: '',
            surplusReceivableMoney: ''
          }
        ]
      },
      list: [
        {
          repaymentDate: '',     //还款日期
          returnMoney: '',     //还款金额
          surplusReceivableMoney: '',//担保费
        },
      ],
      refundAmount: 0,
      paymentDate: '',
      receivableTotal: 0,
    }
  },
  created() {
    this.$bus.$on('refundAmount', res => {
      this.refundAmount = res
    })
  },
  methods: {
    handleSurplusReceivableMoney(item, i) {
      if (this.editType == 'add') {
        if (i == 0) {
          item.surplusReceivableMoney = (parseFloat(Number(this.receivableTotal).toFixed(2)) - parseFloat(Number(item.returnMoney).toFixed(2))) > 0 ? (parseFloat(Number(this.receivableTotal).toFixed(2)) - parseFloat(Number(item.returnMoney).toFixed(2))) : 0
        } else {
          item.surplusReceivableMoney = (parseFloat(Number(this.list[i - 1].surplusReceivableMoney).toFixed(2)) - parseFloat(Number(item.returnMoney).toFixed(2))) > 0 ? (parseFloat(Number(this.list[i - 1].surplusReceivableMoney).toFixed(2)) - parseFloat(Number(item.returnMoney).toFixed(2))) : 0
        }
      } else {
        if (i == 0) {
          item.surplusReceivableMoney = (parseFloat(Number(this.receivableTotal).toFixed(2)) - parseFloat(Number(item.returnMoney).toFixed(2))) > 0 ? (parseFloat(Number(this.receivableTotal).toFixed(2)) - parseFloat(Number(item.returnMoney).toFixed(2))) : 0
        } else {
          item.surplusReceivableMoney = (parseFloat(Number(this.list[i - 1].surplusReceivableMoney).toFixed(2)) - parseFloat(Number(item.returnMoney).toFixed(2))) > 0 ? (parseFloat(Number(this.list[i - 1].surplusReceivableMoney).toFixed(2)) - parseFloat(Number(item.returnMoney).toFixed(2))) : 0
        }
      }
    },
    onloadChange(obj) {
      this.receivableTotal = obj
      this.list.forEach((item, i) => {
        if (i == 0) {
          item.surplusReceivableMoney = NumberSub(this.receivableTotal, item.returnMoney)
        } else {
          item.surplusReceivableMoney = NumberSub(this.list[i - 1].surplusReceivableMoney, item.returnMoney)
        }
      })
    },
    onload(obj) {
      this.list = (obj.returnMoneyRecordVoList && obj.returnMoneyRecordVoList.length) ? obj.returnMoneyRecordVoList : this.list
    },
    addOne() {
      this.list.push(Object.assign({}, this.$options.data().list[0]))
      // this.list.push(Object.assign({}, this.$options.data().list[0]))
      // this.form.returnMoneyRecordVoList.push(Object.assign({}, this.$options.data().form.returnMoneyRecordVoList[0]))
    },
    delOne(i) {
      if (!this.list[i].id) {
        this.list.splice(i, 1)
      }
      else {
        Confirm(`此操作将删除回款记录, 是否继续?`, () => {
          deleteReturnMoneyRecord({ id: this.list[i].id }).then(res => {
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
    commit() {
      let list = this.list.filter(item => item.repaymentDate && (item.returnMoney || item.returnMoney == 0) && (item.surplusReceivableMoney || item.surplusReceivableMoney == 0))
      return list
      // return this.form.returnMoneyRecordVoList
    }
  }
}
</script>

<style>
</style>