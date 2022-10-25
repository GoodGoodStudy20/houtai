<template>
  <div class="block-form">
    基本户 <el-divider></el-divider>
    <el-form size="small" inline :disabled="disabled">
      <el-form-item label="名称">
        <el-input v-model="form.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="form.account" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="开户行">
        <el-input v-model="form.openingBank" placeholder="请输入开户行"></el-input>
      </el-form-item>
    </el-form>
    一般户 <el-divider></el-divider>
    <el-form size="small" inline :disabled="disabled">
      <div v-for="(item,i) in commonlyList" :key="i">
        <el-form-item label="名称">
          <el-input v-model="item.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="item.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="开户行">
          <el-input v-model="item.openingBank" placeholder="请输入开户行"></el-input>
        </el-form-item>
        <el-form-item label=" " style="width:70px">
          <el-button @click="addOne" type="primary" v-show="i==commonlyList.length-1">增加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="delOne(i)" type="danger" v-show="commonlyList.length>1">删除</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { deleteAccountTax } from '@/api/index.js'
import { Assign } from '@/utils/index.js'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'Form4',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {//基本户
        name: '',     //名称
        openingBank: '',     //开户银行
        account: '',     //账号
        type: 0,     //账户类型(0.基本户,1.一般户,2.共管户)
      },
      commonlyList: [//一般户
        {
          name: '',     //名称
          openingBank: '',     //开户银行
          account: '',     //账号
          type: 1,     //账户类型(0.基本户,1.一般户,2.共管户)
        }
      ],
    }
  },
  created() {

  },
  methods: {
    onload(list) {
      this.form = list.find(item => item.type == 0) || this.form
      this.commonlyList = list.filter(item => item.type == 1).length ? list.filter(item => item.type == 1) : this.commonlyList
    },
    addOne(list) {
      this.commonlyList.push(Object.assign({}, this.$options.data().commonlyList[0]))
    },
    delOne(list, i) {
      if (!this.commonlyList[i].id) {
        this.commonlyList.splice(i, 1)
      } else {
        Confirm(`此操作将删除：${this.commonlyList[i].name}, 是否继续?`, () => {
          deleteAccountTax({ id: this.commonlyList[i].id }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.commonlyList.splice(i, 1)
          }).catch(err => {
            this.$message.error('删除失败')
          })
        })
      }
    },
    commit() {
      let list = [...this.commonlyList, this.form]

      return list
    }
  }
}
</script>

<style>
</style>