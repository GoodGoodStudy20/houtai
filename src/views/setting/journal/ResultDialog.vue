<template>
  <el-dialog :visible.sync="value" title="参数详情" :before-close="dialogClose" :close-on-click-modal="false" width="500px" height="500px" :lock-scroll="false" :modal-append-to-body="false">
    <div>
      <div>
        <div style="margin-bottom:20px;text-align:left">
          请求参数：{{row.request}}
        </div>
        <div style="text-align:left">
          返回参数：{{row.response}}
        </div>

      </div>
      <el-button size="small" @click="dialogClose">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: "ResultDialog",
  props: ["value", "row"],
  data() {
    return {

    };
  },
  methods: {
    dialogClose() {
      this.$emit("input", false);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .w-e-text {
  text-align: left;
}
</style>
