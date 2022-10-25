<template>
  <div class="box2">
    <div class="title">主体匹配结果</div>
    <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;" :header-cell-style="{'background-color':'#F4F8FF'}" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="推荐签约主体" align="left" show-overflow-tooltip width="150">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.abbreviated ||''" placement="bottom">
            <span class="customer-text">{{scope.row.abbreviated||'--'}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="推荐签约项目" width="200" align="left">
        <template slot-scope="scope">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.suject ||'--'" placement="bottom">
              <span>{{scope.row.suject||'--'}}</span>
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="receivableTotal" label="开票额度" align="left">
      </el-table-column>
      <el-table-column prop="receivableTotal" label="剩余开票额度" align="left">
      </el-table-column>
      <el-table-column prop="receivableTotal" label="操作" align="left">
        <template slot-scope="scope">
          <span class="table-text">下载模板合同</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center;margin-top:50px">
      <el-button @click="dialogClose" style="margin-right:50px">返 回</el-button>
      <el-button type="primary" @click="addContarct" style="margin-right:50px">新增合同</el-button>
    </div>
  </div>
</template>

<script>
import { Assign } from '@/utils/index.js'
export default {
  name: 'Form2',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        serviceCharge: '',              //服务费率（%）
        interestFreeDays: '',//免息条件（天）
        ratio: '',                    //利率（万/天）
      },
      list: [
        { id: 1 }
      ]
    }
  },
  methods: {
    handleSelectionChange(val) {

    },
    dialogClose() {
      this.$emit('input', 0)
    },
    addContarct() {
      this.$emit('input', 2)
      this.$emit('edit', 'add')
    }

  }
}
</script>

<style lang="scss" scoped>
.box2 {
  .title {
    margin: 20px 0 30px;
    font-size: 16px;
    font-weight: 600;
  }
}
</style>