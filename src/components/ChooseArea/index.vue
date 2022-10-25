<template>
  <el-cascader
    @change="areaChange"
    :options="cityList"
    v-model="value"
    :props="{
      expandTrigger: 'hover',
      checkStrictly: checkStrictly,
      value: 'id',
      label: 'content',
    }"
    clearable
    :disabled="disabled"
  ></el-cascader>
</template>

<script>
import { areaList, cityList } from "@/utils/area.js";
export default {
  name: "ChooseArea",
  props: {
    province: String | Number,
    city: String | Number,
    county: String | Number,
    disabled: {
      type: Boolean,
      default: false,
    },
    checkStrictly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      areaList: cityList(),
      cityList: cityList(),
      value: "",
    };
  },
  watch: {
    province: {
      handler(val) {
        if (val && !this.value) {
          this.value = [
            Number(this.province),
            Number(this.city),
            Number(this.county),
          ].filter((item) => !!item);
        }
      },
      immediate: true,
    },
  },
  methods: {
    areaChange(value) {
      this.$emit("update:province", value[0]);
      this.$emit("update:city", value[1]);
      this.$emit("update:county", value[2]);
    },
  },
};
</script>

<style>
</style>