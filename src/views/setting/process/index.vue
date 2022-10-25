<template>
  <div style="width:100%">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="需求审批流程" name="0"></el-tab-pane>
      <el-tab-pane label="付款审批流程" name="1"></el-tab-pane>
      <el-tab-pane label="开票审批流程" name="2"></el-tab-pane>
      <el-tab-pane label="回款审批流程" name="3"></el-tab-pane>
      <el-tab-pane label="合同审批流程" name="5"></el-tab-pane>
    </el-tabs>
    <!-- <div v-if="!show">
      <el-button @click="btnClick(0)" type="primary">需求审批流程</el-button>
      <el-button @click="btnClick(1)" type="primary">付款审批流程</el-button>
    </div> -->
    <ProcessForm :type="type" ref="ProcessForm"></ProcessForm>
  </div>
</template>

<script>
import ProcessForm from './components/ProcessForm.vue'
export default {
  name: 'process',
  components: { ProcessForm },
  data() {
    return {
      activeName: '0',
      type: 0
    }
  },
  mounted() {
    this.$refs['ProcessForm'].onload()
  },
  methods: {
    handleClick(type) {
      this.type = this.activeName
      this.$nextTick(() => {
        this.$refs['ProcessForm'].onload()
      })
    },
  }
}
</script>

<style>
</style>