<template>
  <el-form size="small" inline :disabled="disabled" class="block-form">
    <div v-for="(item,i) in list" :key="i">
      <el-form-item label="名称">
        <el-input v-model="item.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="网址">
        <el-input v-model="item.website" placeholder="请输入网址"></el-input>
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="item.account" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="item.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label=" " style="width:70px">
        <el-button @click="addOne" type="primary" v-show="i==list.length-1">增加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="delOne(i)" type="danger" v-show="list.length>1">删除</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { deleteAccountPassword } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'Form5',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [//账号密码信息
        {
          name: "",            //名称
          website: "",            //网址    
          account: "",            //账户
          password: "",            //密码
          remark: "",            //备注
        }
      ]
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
        Confirm(`此操作将删除账号：${this.list[i].name}, 是否继续?`, () => {
          deleteAccountPassword({ id: this.list[i].id }).then(res => {
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