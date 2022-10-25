<template>
  <div class="block-form">
    <el-form :disabled="disabled">
      <el-checkbox label="公章" v-model="checkForm.isOfficialSeal" :true-label="1" :false-label="0"></el-checkbox>
      <el-checkbox label="发票章" v-model="checkForm.isInvoiceSeal" :true-label="1" :false-label="0"></el-checkbox>
      <el-checkbox label="合同章" v-model="checkForm.isContractSeal" :true-label="1" :false-label="0"></el-checkbox>
      <el-checkbox label="财务章" v-model="checkForm.isFinancialSeal" :true-label="1" :false-label="0"></el-checkbox>
      <el-checkbox label="法人章" v-model="checkForm.isLegalPersonSeal" :true-label="1" :false-label="0"></el-checkbox>
      <el-checkbox label="税盘" v-model="checkForm.isTaxPlate" :true-label="1" :false-label="0"></el-checkbox>
    </el-form>
    <el-divider></el-divider>
    <el-form size="small" inline :disabled="disabled">
      <div v-for="(item, i) in accountTaxList" :key="i">
        <el-form-item label="账户类型">
          <el-select v-model="item.type" placeholder="请选择账户类型" style="width:200px">
            <el-option v-for="item in accountType" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="item.name" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="item.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="开户行">
          <el-input v-model="item.openingBank" placeholder="请输入开户行"></el-input>
        </el-form-item>
        <el-form-item label="" v-if="item.type !== 2">
          <el-checkbox label="优盾" v-model="item.isYouDun" :true-label="1" :false-label="0"></el-checkbox>
        </el-form-item>
        <el-form-item label="共管方" v-else>
          <el-input v-model="item.manageTogether" placeholder="请输入共管方"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button @click="addOne('accountTaxList')" type="primary" v-show="i == accountTaxList.length - 1">增加
          </el-button>
        </el-form-item>
        <el-form-item label=" ">
          <el-button @click="delOne('accountTaxList', i)" type="danger" v-show="accountTaxList.length > 1">删除
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { deleteAccountTax } from '@/api/index.js'
import { Assign } from '@/utils/index.js'
import { AccountType } from '@/utils/field.js'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'Form3',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      accountType: AccountType,
      checkForm: {
        isOfficialSeal: 0,         //是否有公章(0.否,1.是)
        isInvoiceSeal: 0,         //是否有发票章(0.否,1.是)
        isContractSeal: 0,         //是否有合同章(0.否,1.是)
        isFinancialSeal: 0,         //是否有财务章(0.否,1.是)
        isLegalPersonSeal: 0,         //是否有法人章(0.否,1.是)
        isTaxPlate: 0,         //是否有税盘(0.否,1.是)
      },
      accountTaxList: [//一般户
        {
          isYouDun: 0, // 是否有U盾
          name: '', // 名称
          openingBank: '', // 开户银行
          account: '', // 账号
          type: '', // 账户类型(0.基本户,1.一般户,2.共管户)
          manageTogether: '' // 共管方
        }
      ],
    }
  },
  created() {

  },
  methods: {
    onload(list) {
      // this.form = list.find(item => item.type == 0) || this.form
      // this.commonlyList = list.filter(item => item.type == 1).length ? list.filter(item => item.type == 1) : this.commonlyList
      // this.commonList = list.filter(item => item.type == 2).length ? list.filter(item => item.type == 2) : this.commonList
      this.accountTaxList = list && list.length ? list : this.accountTaxList
      Assign(this.checkForm, this.form)
    },
    addOne(list) {
      this[list].push(Object.assign({}, this.$options.data()[list][0]))
    },
    delOne(list, i) {
      if (!this[list][i].id) {
        this[list].splice(i, 1)
      } else {
        Confirm(`此操作将删除：${this[list][i].name}, 是否继续?`, () => {
          deleteAccountTax({ id: this[list][i].id }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this[list].splice(i, 1)
          }).catch(err => {
            this.$message.error('删除失败')
          })
        })
      }
    },
    commit() {
      let list = [...this.accountTaxList]
      list.forEach(item => {
        Object.assign(item, this.checkForm)
      })
      return list
    }
  }
}
</script>

<style>
</style>