<template>
  <el-select ref="selection" v-model="value2" placeholder="请选择" :style="{width:width+'px'}" @change="change" filterable :multiple="multiple" :disabled="disabled">
    <el-option label="全部" value="" v-if="showAll"></el-option>
    <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
/** 选择用户组件 */
import { getServiceProviderTypeList } from '@/api/index'
export default {
  name: 'ChooseUser',
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
    width: {
      type: Number,
      default: 500,
    },
  },
  data() {
    return {
      list: [],
      value2: ''
    }
  },
  created() {
    getServiceProviderTypeList({}).then(res => {
      this.list = res.data
      this.onload()
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
        let nameArr = new Array();
        for(let id of this.value2){
          for(let item of this.list){
            if(id == item.id){
              nameArr.push(item.name);
              break;
            }
          }
        }
        this.$emit('input', this.value2.join(','))        
        this.$emit('setName', nameArr.join(','))

      } else {
        let name = '';
          for(let item of this.list){
            if(this.value2 == item.id){
              name = item.name
              break;
            }
          }
        this.$emit('input', this.value2)
        this.$emit('setName', name)
      }
      
    }
  }
}
</script>

<style>
</style>