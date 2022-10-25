<template>
  <div class="box">
    <el-row>
      <el-col :span="12">
        <div v-for="(item,i) in list" :key="i">
          <div class="step">
            <div class="step-box" @click="![0,list.length-1].includes(i)?editOne(item,'edit'):''">
              <p>{{item.name}}</p>
              <p>{{(!item.approvalName || item.approvalName=='null')?'':item.approvalName}}</p>
            </div>
            <el-button @click="addOne(i)" size="mini" type="primary" icon="el-icon-plus" circle v-if="![list.length-1,list.length].includes(i)"></el-button>
            <el-button @click="editOne(item,'edit')" size="mini" type="primary" icon="el-icon-edit" circle v-if="![0,list.length-1,list.length].includes(i)"></el-button>
            <el-button @click='delOne(item)' size="mini" type="danger" icon="el-icon-delete" circle v-if="![0,list.length-1,list.length].includes(i)"></el-button>
            <el-button @click="editOne(item,'CC')" size="mini" type="primary" icon="el-icon-edit" circle v-if="[list.length].includes(i)"></el-button>
          </div>
          <div class="line" v-if="i!=list.length-1"></div>
        </div>
      </el-col>
    </el-row>
    <Form1 v-if="showForm" v-model="showForm" :item="form" :editType="editType" :type="type" @success="onload"></Form1>
  </div>
</template>

<script>
import Form1 from './Form1.vue'
import { getApprovalProcessConfigList, deleteApprovalProcessConfig, getApprovalProcessConfigInfo } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'ProcessForm',
  components: { Form1 },
  props: ['type'],
  data() {
    return {
      list: [],
      form: {},
      showForm: false,
      editType: ''
    }
  },
  methods: {
    onload() {
      getApprovalProcessConfigList({ type: this.type }).then(res => {
        this.list = res.data || []
      })
    },
    addOne(i) {
      this.form = {
        approvalId: '',       //审批人
        isSkip: 0,       //是否跳过(0.否,1.是)
        name: '',       //名称
        remark: '',       //备注
        sort: Number(this.list[i].sort) + 1,       //顺序
        type: this.type,       //类型(0.需求审批,1.付款审批)
      }
      this.editType = ''
      this.showForm = true
    },
    editOne(item, type) {
      this.editType = type
      this.form = Object.assign({}, item)
      this.showForm = true
    },
    delOne(item) {
      Confirm(`确定删除节点: ${item.name} 吗?`, () => {
        deleteApprovalProcessConfig({ id: item.id }).then(res => {
          if (res.code != 200) {
            this.$message.warning(res.msg || '删除失败')
            return
          }
          this.$message.success('删除成功')
          this.onload()
        })
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.step {
  display: flex;
  align-items: center;
  .step-box {
    width: 200px;
    min-height: 80px;
    // line-height: 50px;
    text-align: center;
    border: 1px solid #ccc;
    margin-right: 50px;
    p:nth-child(2) {
      margin: 0;
      color: #0099ff;
      font-size: 13px;
    }
  }
}
.line {
  width: 2px;
  height: 50px;
  margin-left: 100px;
  background: #000;
}
.form-box {
  text-align: center;
  width: 400px;
  border: 1px solid #ccc;
  padding: 30px;
}
</style>