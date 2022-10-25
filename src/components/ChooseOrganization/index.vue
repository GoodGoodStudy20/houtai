<template>
  <el-select v-model="value2" placeholder="请选择" style="width:100%" @change="change" :disabled="disabled" :multiple="multiple">
    <el-option label="全部" value="" v-if="showAll"></el-option>
    <el-option v-for="item in list" :key="item.id" :label="item.organizationName" :value="item.id"></el-option>
  </el-select>
</template>

<script>
import { getOrganizationList } from '@/api/index'
export default {
  name: 'ChooseOrganization',
  props: {
    value: Number | String,
    showAll: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: [],
      value2: '',
    }
  },
  created() {
    getOrganizationList({ orgId: 1, isPage: 0 }).then(res => {
      this.onload()
      this.list = res.data.filter(item => item.id != 1)
    })
  },
  watch: {
    value(val) {
      if (val && !this.value2) {
        this.onload()
      }
    }
  },
  methods: {
    onload() {
      if (this.multiple && this.value) {
        this.value2 = this.value.split(',')
        this.value2 = this.value2.map(item => Number(item))
      } else {
        this.value2 = Number(this.value) || ''
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