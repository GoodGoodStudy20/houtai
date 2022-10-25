<template>
  <el-select v-model="value2" placeholder="请选择" style="width:100%" @change="change" filterable :multiple="multiple" :disabled="disabled">
    <el-option label="全部" value="" v-if="showAll"></el-option>
    <el-option v-for="item in list" :key="item.id" :label="item.abbreviated" :value="item.id"></el-option>
  </el-select>
</template>

<script>
/** 选择服务商组件 */
import { getServiceProviderList } from '@/api/index'
export default {
  name: 'ChooseServiceProvider',
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
      getServiceProviderList({ ...params }).then(res => {
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
        let item = this.list.find(item => item.id == this.value2) || {}
        this.$emit('change', item, 'onload')
      }
    },
    change() {
      if (Array.isArray(this.value2)) {
        this.$emit('input', this.value2.join(','))
      } else {
        this.$emit('input', this.value2)
        let item = this.list.find(item => item.id == this.value2) || {}
        this.$emit('change', item)
      }
    }
  }
}
</script>

<style>
</style>