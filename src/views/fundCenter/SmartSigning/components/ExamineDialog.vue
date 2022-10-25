<template>
  <el-dialog :visible.sync="value" :title="editType=='edit'?'审核意见':'审核结果'" append-to-body :before-close="dialogClose" :close-on-click-modal="false" center width="50%" :lock-scroll="false">
    <el-form size="small" ref="form" label-position="left" :model="form">
      <el-form-item label="客户名称：">
        <span>{{form.abbreviated}}</span>
      </el-form-item>
      <el-form-item label="签约主体：">
        <span>{{form.abbreviated}}</span>
      </el-form-item>
      <el-form-item label="推荐签约项目：">
        <span>{{form.abbreviated}}</span>
      </el-form-item>
      <el-form-item label="是否有不可签约项目：">
        <el-radio v-model="radio" label="1" :disabled="editType=='show'">有</el-radio>
        <el-radio v-model="radio" label="2" :disabled="editType=='show'">无</el-radio>
      </el-form-item>
      <el-form-item label="不可签约项目" v-if="radio==1">
        <el-select v-model="form.channelId" placeholder="请选择" style="width:200px" :disabled="editType=='show'">
          <el-option v-for="item in ChannelType" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <!-- <el-input v-if="editType=='show' && form.customerChannelVo" v-model="form.customerChannelVo.name" style="width:500px"></el-input> -->
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <div v-if="editType=='edit'">
        <el-button @click="dialogClose" style="margin-right:50px">取 消</el-button>
        <el-button type="primary" @click="dialogClose" style="margin-right:50px">确定提交</el-button>
      </div>
      <el-button v-if="editType=='show'" @click="dialogClose">关 闭</el-button>
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
  name: 'ExamineDialog',
  props: ['value', 'editType', 'issueInfoVoList', 'serviceChargeSumVoList', 'isEditSuject'],
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
      total: 0
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
  },

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