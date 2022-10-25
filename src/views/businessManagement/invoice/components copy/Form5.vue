<template>
  <div class="block-form">
    <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column label="回款编号" prop="number" align="left" show-overflow-tooltip></el-table-column>
      <el-table-column label="回款时间" prop="returnMoneyDate" align="center" width="120"></el-table-column>
      <el-table-column label="到账金额" prop="arrivalMoney" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.arrivalMoney || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="抵消金额" prop="returnMoney" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.returnMoney || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="回款账户" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.accountTaxVo?`${scope.row.accountTaxVo.name}(${scope.row.accountTaxVo.account})`:''}}
        </template>
      </el-table-column>
      <el-table-column label="银行流水" prop="bankFlow" align="center"></el-table-column>
      <el-table-column prop="createTime" align="center" label="录入时间" width="160"></el-table-column>
      <el-table-column label="录入人" prop="createByName" align="center"></el-table-column>
    </el-table>

  </div>
</template>

<script>
import ChooseCustomer from '@/components/ChooseCustomer/index.vue'
import ChooseSubject from '@/components/ChooseSubject/index.vue'
import { ApprovalStatus } from '@/utils/field.js'
import { deleteReturnMoneyApproval, getReturnMoneyApprovalPage, updateStatusReturnMoneyApproval } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'Form5',
  components: { ChooseCustomer, ChooseSubject },
  props: ['value', 'list'],
  data() {
    return {
      ApprovalStatus: ApprovalStatus,
      options1: ['增值税专用发票', '增值税普通发票'],
      options2: ['纸质', '电子'],
      status: ['正常', '撤销'],
      user: {}
    }
  },
  methods: {
    editDetail(id, type) {
      this.$emit('input', 1)
      this.$emit('edit', id, type)
    },
  }
}
</script>

<style>
</style>