<template>
  <div class="block-form">
    <el-form size="small" inline :disabled="disabled">
      <div v-for="(item,i) in list" :key="i">
        <el-form-item label="名称">
          <el-input v-model="item.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="item.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="开户行">
          <el-input v-model="item.openingBank" placeholder="请输入开户行"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="item.remark" placeholder="请输入备注"></el-input>
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
import { deleteAccountTax } from '@/api/index.js'
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
      list: [
        {
          name: '',     //名称
          openingBank: '',     //开户银行
          account: '',     //账号
          remark: '',       //备注
        },
      ],
    }
  },
  created() {

  },
  methods: {
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
        Confirm(`此操作将删除账户：${this.list[i].name}, 是否继续?`, () => {
          deleteAccountTax({ id: this.list[i].id }).then(res => {
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
      return this.list
    }
  }
}
</script>

<style>
</style>