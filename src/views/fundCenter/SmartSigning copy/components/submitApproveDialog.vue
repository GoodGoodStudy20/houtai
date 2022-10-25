<template>
  <el-dialog :visible.sync="value" title="审核意见" append-to-body :before-close="dialogClose" :close-on-click-modal="false" center width="50%" :lock-scroll="false">
    <el-table stripe :data="multipleSelection" style="max-width: 100%;margin-top:15px;" :header-cell-style="{'background-color':'#F4F8FF'}">
      <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
      <el-table-column label="客户名称" align="left" show-overflow-tooltip width="150">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.abbreviated ||''" placement="bottom">
            <span class="customer-text">{{scope.row.abbreviated||'--'}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="推荐签约主体" width="200" align="left">
        <template slot-scope="scope">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.suject ||'--'" placement="bottom">
              <span>{{scope.row.suject||'--'}}</span>
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="receivableTotal" label="可签约项目" align="left">
      </el-table-column>

    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" style="margin-right:50px">取 消</el-button>
      <el-button @click="dialogClose" type="primary" style="margin-right:50px">确定提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Confirm } from '@/utils/common.js'
import { NumberAdd, NumberMul, NumberSub } from '@/utils/index.js'
import ChooseSubject from '@/components/ChooseSubject/index.vue'
import ChooseServiceProvider from '@/components/ChooseServiceProvider/index.vue'
import { getIntegralWithdrawalList } from '@/api/index.js'
export default {
  name: 'submitApproveDialog',
  props: ['value', 'editType', 'issueInfoVoList', 'serviceChargeSumVoList', 'multipleSelection'],
  components: {
    ChooseSubject, ChooseServiceProvider
  },
  data() {
    return {
      form: {
        abbreviated: '',
      },
      ChannelType: [],
      radio: '',
      list: [],
      total: 0,

    }
  },
  created() {
  },
  mounted() {
  },
  methods: {

    dialogClose() {
      this.$emit('input', false)
    },
  }
}
</script>

<style lang="scss" scoped>
.select {
  display: flex;
  align-items: center;
  .select-data {
    margin-right: 20px;
  }
}
::v-deep .no-border {
  .el-input__inner {
    border: none;
  }
}
::v-deep .el-dialog__title {
  font-weight: 700;
}
::v-deep .el-dialog--center {
  margin-top: 10vh !important;
}
</style>