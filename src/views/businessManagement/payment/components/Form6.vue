<template>
  <div style="margin:auto;width:1180px;">
    <el-form size="small" inline :disabled="disabled">
      <div v-for="(item,i) in list" :key="i">
        <el-form-item label="服务商" required>
          <ChooseServiceProvider v-model="item.serviceId" style="width:200px"></ChooseServiceProvider>
        </el-form-item>
        <el-form-item label="退款金额" required>
          <el-input v-model="item.refundAmount" @change="moneyChange" placeholder="请输入退款金额" style="width:180px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="" required>
          <UploadFile v-model="item.refundListFile" :disabled="disabled" :limit="1" fileName="退款清单文件"></UploadFile>
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
import UploadFile from '@/components/UploadFile/index.vue'
import ChooseServiceProvider from '@/components/ChooseServiceProvider/index.vue'
import { deleteRefund } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
import { NumberAdd, NumberMul } from '@/utils/index.js'
export default {
  name: 'Form6',
  components: { ChooseServiceProvider, UploadFile },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      list: [
        {
          refundAmount: '',      //充值金额
          serviceId: '',      //服务商id
          refundListFile: []//退款清单文件
        },
      ],
    }
  },
  created() {

  },
  computed: {
    moneySum() {
      let list = this.list.map(item => item.directAmount)
      return NumberAdd(list)
    },
    moneySum2() {
      let list = this.list.map(item => item.refundAmount)
      return NumberAdd(list)
    }
  },
  methods: {
    onload(obj) {
      this.list = (obj.refundVoList && obj.refundVoList.length) ? obj.refundVoList : this.list
      this.list.forEach(item => {
        try {
          item.refundListFile = JSON.parse(item.refundListFile)
        } catch (error) {
          item.refundListFile = []
        }
      })
      this.moneyChange()
    },
    addOne() {
      this.list.push(Object.assign({}, this.$options.data().list[0]))
    },
    delOne(i) {
      if (!this.list[i].id) {
        this.list.splice(i, 1)
        this.moneyChange()
      } else {
        Confirm(`此操作将删除该退款信息, 是否继续?`, () => {
          deleteRefund({ id: this.list[i].id }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.list.splice(i, 1)
            this.moneyChange()
          }).catch(err => {
            this.$message.error('删除失败')
          })
        })
      }
    },
    moneyChange() {
      this.$bus.$emit('refundAmount', NumberAdd(this.list.map(item => item.refundAmount)))
    },
    commit() {
      let list = this.list.filter(item => item.serviceId && item.refundAmount).map(item => {
        return {
          refundAmount: item.refundAmount,      //充值金额
          serviceId: item.serviceId,      //服务商id
          refundListFile: JSON.stringify(item.refundListFile),      //退款清单文件
          id: item.id || '',      //主体id
        }
      })
      return list || []
    }
  }
}
</script>

<style>
</style>