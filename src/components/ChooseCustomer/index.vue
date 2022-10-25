<template>
  <el-select v-model="value2" placeholder="请选择" style="width:100%" @change="change" filterable :multiple="multiple" :disabled="disabled">
    <el-option label="全部" value="" v-if="showAll"></el-option>
    <el-option v-for="item in list" :key="item.id" :label="item[showValue]" :value="item.id"></el-option>
  </el-select>
</template>

<script>
import { getCustomerList } from '@/api/index'
export default {
  name: 'ChooseCustomer',
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
    params: {
      type: Object,
      default: () => { },
    },
    showValue: {
      type: String,
      default: 'abbreviated',
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
      if (!val) {
        this.value2 = ''
      }
    }
  },
  methods: {
    getList(type = '') {
      getCustomerList({ ...this.params,isDisable: 0 }).then(res => {
        this.list = res.data
        this.onload()
        if (type) {
          this.change(type)
        }
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