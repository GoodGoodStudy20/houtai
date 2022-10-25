<template>
  <el-select v-model="value2" placeholder="请选择" :size="size" style="width:100%" @change="change" filterable :multiple="multiple" :disabled="disabled">
    <el-option label="全部" value="" v-if="showAll"></el-option>
    <el-option v-for="item in list" :key="item.id" :label="showAmount?`${item[showValue]}【本月已开金额${item.totalInvoicingAmount}元，剩余额度${item.surplusInvoicingAmount}元，剩余份数${item.surplusInvoicingQuantity}】`:item[showValue]" :value="item.id" :disabled="item.isEffective==1"></el-option>
  </el-select>
</template>

<script>
/** 选择主体组件 */
import { getSubjectList } from '@/api/index'
export default {
  name: 'ChooseSubject',
  props: {
    value: Number | String,
    showAll: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showAmount: {
      type: Boolean,
      default: false,
    },
    showValue: {
      type: String,
      default: 'abbreviated',
    },
    size: {
      type: String
    }

  },
  data() {
    return {
      list: [],
      value2: ''
    }
  },
  created() {
    this.getList()
  },
  watch: {
    value(val) {
      if (val && !this.value2) {
        this.onload()
      }
    }
  },
  methods: {
    getList(params = {}) {
      getSubjectList({ ...params }).then(res => {
        this.list = res.data
        this.onload()
      })
    },
    onload() {
      if (this.multiple && this.value) {
        this.value2 = this.value.split(',')
        this.value2 = this.value2.map(item => Number(item))
      } else {
        this.value2 = this.value
      }
    },
    change(type = '') {
      if (Array.isArray(this.value2)) {
        this.$emit('input', this.value2.join(','))
      } else {
        this.$emit('input', this.value2)
        let item = this.list.find(item => item.id == this.value2) || {}
        this.$emit('change', item, type)
      }
    }
  }
}
</script>

<style>
</style>