<template>
  <el-dialog :visible.sync="value" title="比对结果提示" :before-close="dialogClose" :close-on-click-modal="false" width="50%" :lock-scroll="false" :modal-append-to-body="false">
    <el-table stripe :data="errorList" max-height="500" style="max-width: 100%;margin-top:15px;" :header-cell-style="{'background-color':'#F4F8FF'}">
      <el-table-column label="姓名" prop="name" width="100" align="left"></el-table-column>
      <el-table-column label="比对结果（本清单）" align="left">
        <template slot-scope="scope">
          <span>{{scope.row.type===0?scope.row.error:'--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="比对结果（历史清单）" align="left">
        <template slot-scope="scope">
          <span>{{scope.row.type===1?scope.row.error:'--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="结论" align="left" width="150">
        <template slot-scope="scope">
          <span style="color:red">不通过</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="errorList.length>0" style="color:red;text-align:left;margin-top:10px">请将错误数据修改后，再次提交文件</div>
    <div style="margin-top:20px">
      <el-button size="small" type="primary" @click="dialogClose">确定</el-button>
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