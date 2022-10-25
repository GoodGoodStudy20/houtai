<template>
  <div>
    <el-form size="small" inline :disabled="disabled" class="block-form">
      <div v-for="(item,i) in list" :key="i">
        <el-form-item label="职位">
          <el-input v-model="item.position" placeholder="请输入职位"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="item.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="item.phone" placeholder="请输入联系电话" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="item.mailbox" placeholder="请输入邮箱"></el-input>
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
import { deleteContacts } from '@/api/index.js'
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
          position: '',       //职位
          name: '',       //名称
          phone: '',       //联系电话
          mailbox: '',       //联系邮箱
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
        Confirm(`此操作将删除联系人：${this.list[i].name}, 是否继续?`, () => {
          deleteContacts({ id: this.list[i].id }).then(res => {
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