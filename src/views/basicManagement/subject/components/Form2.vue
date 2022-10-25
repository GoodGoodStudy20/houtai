<template>
  <div class="block-form">
    监事 <el-divider></el-divider>
    <el-form size="small" inline :disabled="disabled" ref="form" :model="form">
      <el-form-item label="姓名" prop="name" :rules="[{ required: true, message: '姓名不可为空', trigger: 'blur' }]">
        <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="name" :rules="[{ required: true, message: '联系电话不可为空', trigger: 'blur' }]">
        <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11"></el-input>
      </el-form-item>
    </el-form>
    股东 <el-divider></el-divider>
    <el-form size="small" inline :disabled="disabled">
      <div v-for="(item,i) in list" :key="i">
        <el-form-item label="名称">
          <el-input v-model="item.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="item.phone" placeholder="请输入联系电话" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="占比">
          <el-input v-model="item.proportion" placeholder="请输入占比" oninput="value=value.replace(/[^\d.]/g,'')>100?100:value=value.replace(/[^\d.]/g,'')">
            <template slot="append">%</template>
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
import { deleteShareholderSupervisor } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
import { NumberAdd } from '@/utils/index.js'
export default {
  name: 'Form2',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: '',         //公司名称
        phone: '',         //联系电话
        remark: '',         //备注
        type: 1,         //类型(0.股东,1.监事)
      },
      list: [//股东监事信息
        {
          name: '',         //公司名称
          phone: '',         //联系电话
          proportion: '',         //占比(%)
          remark: '',         //备注
          type: 0,         //类型(0.股东,1.监事)
        },
      ],
    }
  },
  created() {

  },
  methods: {
    onload(list) {
      this.list = list.filter(item => item.type == 0).length ? list.filter(item => item.type == 0) : this.list
      this.form = list.find(item => item.type == 1) || this.form
    },
    addOne() {
      this.list.push(Object.assign({}, this.$options.data().list[0]))
    },
    delOne(i) {
      if (!this.list[i].id) {
        this.list.splice(i, 1)
      } else {
        Confirm(`此操作将删除股东：${this.list[i].name}, 是否继续?`, () => {
          deleteShareholderSupervisor({ id: this.list[i].id }).then(res => {
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
      if (!this.$validate('form')) return
      if (this.proportionSum > 100) {
        this.$message.warning('股东总占比不能大于100%')
        return
      }
      return [...this.list, this.form]
    }
  },
  computed: {
    proportionSum() {
      return NumberAdd(this.list.map(item => item.proportion))
    }
  }
}
</script>

<style>
</style>