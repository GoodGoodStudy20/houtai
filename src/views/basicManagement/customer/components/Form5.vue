<template>
  <div class="block-form">
    <el-form size="small" inline :disabled="disabled">
      <div v-for="(item,i) in list" :key="i">
        <el-form-item label="名称" required>
          <el-input v-model="item.name" placeholder="请输入渠道名称" style="width:200px"></el-input>
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
import { deleteCustomerChannel } from '@/api/index.js'
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
      list: [
        {
          name: '',      //渠道名称
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
        Confirm(`此操作将删除渠道信息, 是否继续?`, () => {
          deleteCustomerChannel({ id: this.list[i].id }).then(res => {
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
      let list = this.list.filter(item => item.name).map(item => {
        return {
          name: item.name,      //渠道名称
          id: item.id || '',      //主id
        }
      })
      if (!list || !list.length) {
        this.$message.warning('请至少添加一个渠道')
        return
      }
      return list
    }
  }
}
</script>

<style>
</style>