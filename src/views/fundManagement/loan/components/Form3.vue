<template>
  <div style="margin:auto;width:1180px;">
    <div v-for="(item,i) in list" :key="i">
      <el-form size="small" :model="item" inline :disabled="disabled">
        <el-form-item label="还款日期" prop="repaymentDate" :rules="[{ required: true, message: '还款日期不可为空', trigger: 'blur' }]">
          <el-date-picker v-model="item.repaymentDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:150px"></el-date-picker>
        </el-form-item>
        <el-form-item label="担保费" prop="guaranteeMoney">
          <el-input v-model="item.guaranteeMoney" style="width:100px" @change="moneyChange(i)" placeholder="担保费" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
        </el-form-item>
        <el-form-item label="本金" prop="money">
          <el-input v-model="item.money" style="width:100px" @change="moneyChange(i)" placeholder="本金" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
        </el-form-item>
        <el-form-item label="利息" prop="interest">
          <el-input v-model="item.interest" style="width:100px" @change="moneyChange(i)" placeholder="利息" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
        </el-form-item>
        <el-form-item label="还款总额" prop="repaymentMoney">
          <el-input v-model="item.repaymentMoney" style="width:100px" placeholder="还款总额" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"></el-input>
        </el-form-item>
        <el-form-item label=" " style="width:70px">
          <el-button type="primary" @click="addOne" v-show="i==list.length-1 && repaymentType==0">增加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="delOne(i)" v-show="list.length>1">删除</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import { deleteRepaymentPlan } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
import { NumberAdd } from '@/utils/index.js'
export default {
  name: 'Form3',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    repaymentType: {
      type: Number,
      default: 1
    },
  },
  data() {
    return {
      list: [
        {
          repaymentDate: '',     //还款日期
          repaymentMoney: '',     //还款金额
          guaranteeMoney: '',//担保费
          interest: '',//利息
          money: '',//本金金额

        },
      ],
      form: {}
    }
  },
  created() {

  },
  methods: {
    moneyChange(i) {
      this.list[i].repaymentMoney = NumberAdd([this.list[i].money, this.list[i].interest, this.list[i].guaranteeMoney])
    },
    onload(list) {
      this.list = (list && list.length) ? list : this.list
    },
    addOne() {
      this.list.push(Object.assign({}, this.$options.data().list[0]))

    },
    delOne(i) {
      if (!this.list[i].id) {
        this.list.splice(i, 1)
      } else {
        Confirm(`此操作将删除该还款计划, 是否继续?`, () => {
          deleteRepaymentPlan({ id: this.list[i].id }).then(res => {
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
      // if (!this.$validate('form')) {
      //   this.$message.warning('请输入还款计划')
      //   return
      // }
      let list = this.list.filter(item => item.repaymentDate && item.repaymentMoney)
      return list
    }
  }
}
</script>

<style lang="scss" scoped>
</style>