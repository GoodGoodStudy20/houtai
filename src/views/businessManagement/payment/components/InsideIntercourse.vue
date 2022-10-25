<template>
  <div style="margin:auto;width:1180px;">
    <el-form size="small" inline :disabled="disabled">
      <div v-for="(item,i) in list" :key="i">
        <el-form-item label="主体">
          <ChooseSubject v-model="item.subjectId" style="width:300px"></ChooseSubject>
        </el-form-item>
        <el-form-item label="至">
          <ChooseSubject v-model="item.viceSubjectId" style="width:300px"></ChooseSubject>
        </el-form-item>
        <el-form-item label="往来金额">
          <el-input v-model="item.transactionsMoney" placeholder="请输入金额" style="width:180px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')">
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
import { deleteInternalTransactions } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
import { NumberAdd } from '@/utils/index.js'
export default {
  name: 'InsideIntercourse',
  components: { ChooseSubject },
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
          subjectId: '',      //主体id
          viceSubjectId: '',      //副主体id
          transactionsMoney: '',      //往来金额(元)
        },
      ],
    }
  },
  created() {

  },
  computed: {
    moneySum() {
      let list = this.list.map(item => item.money)
      return NumberAdd(list)
    }
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
        Confirm(`此操作将删除内部往来信息, 是否继续?`, () => {
          deleteInternalTransactions({ id: this.list[i].id }).then(res => {
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
      let list = this.list.filter(item => item.transactionsMoney && item.viceSubjectId && item.subjectId).map(item => {
        return {
          transactionsMoney: item.transactionsMoney,      //往来金额(元)
          viceSubjectId: item.viceSubjectId,      //副主体id
          subjectId: item.subjectId,      //主体id
          id: item.id || '',      //主id
        }
      })
      return list
    }
  }
}
</script>

<style>
</style>