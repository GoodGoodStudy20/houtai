<template>
  <div class="box4">
    <div class="title">智能签约匹配</div>
    <el-steps :active="active" finish-status="success">
      <el-step title="填写签约需求" description="根据提示内容填写客户签约需求"></el-step>
      <el-step title="选择匹配结果" description="在结果中选择最佳签约主体"></el-step>
      <el-step title="新增合同&提交审核" description="完善其他合同信息并提交财务审核"></el-step>
      <el-step title="财务审核" description="审核通过，将合同发给客户盖章"></el-step>
      <el-step title="补传盖章文件" description="将双方已盖章文件补传至系统"></el-step>
    </el-steps>
    <Form1 v-model="active" v-if="active==0"></Form1>
    <Form2 v-model="active" v-if="active==1"></Form2>
    <Form3 v-model="active" :editType="'add'" :contractType="1" v-if="active==2"></Form3>
  </div>
</template>

<script>
import Form1 from './Form1.vue'
import Form2 from './Form2.vue'
import Form3 from '../../../basicManagement/contract/components/ContractFrom';
export default {
  name: 'Form',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    editType: {
      type: String,
      default: ''
    }
  },
  components: { Form1, Form2, Form3 },
  data() {
    return {
      active: 0,
      contractType: 0
    }
  },
  watch: {

  },
  methods: {
    dialogClose() { },
  }
}
</script>

<style lang="scss" scoped>
.box4 {
  padding: 10px;
  .title {
    text-align: center;
    margin: 20px 0 30px;
    font-size: 18px;
    font-weight: 600;
  }
}
</style>