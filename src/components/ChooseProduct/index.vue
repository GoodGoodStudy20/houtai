<template>
  <el-select v-model="value2" placeholder="请选择" style="width:100%" @change="change" filterable :multiple="multiple" :disabled="disabled">
    <el-option label="全部" value="" v-if="showAll"></el-option>
    <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
import { getProductList } from '@/api/index'
export default {
  name: 'ChooseProduct',
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
    getProductList({}).then(res => {
      this.list = res.data
      this.onload()
    })
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
    onload() {
      if (this.multiple && this.value) {
        this.value2 = this.value.split(',')
        this.value2 = this.value2.map(item => Number(item))
      } else {
        this.value2 = this.value
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