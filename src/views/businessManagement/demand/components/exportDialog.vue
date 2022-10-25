<template>
  <el-dialog :visible.sync="value" title="下载文件" :before-close="dialogClose" :close-on-click-modal="false" width="50%" :lock-scroll="false" :modal-append-to-body="false">
    <div></div>
    <div style="margin-top:20px">
      <el-button size="small" type="primary" @click="dialogClose">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ResultDialog',
  props: ['value', 'errorList'],
  data() {
    return {
      list: []
    }
  },
  methods: {
    dialogClose() {
      this.$emit('input', false)

      if (this.errorList && this.errorList.length > 0) {
        this.$emit('delate')
      }
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__title {
  font-weight: 700;
}
</style>