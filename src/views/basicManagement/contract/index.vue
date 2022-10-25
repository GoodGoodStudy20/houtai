<template>
  <div style="width: 100%">
    <ContractList v-model="showType" v-show="showType == 0" ref="list" @edit="editClick" v-bind="$attrs"></ContractList>
    <ContractFrom v-model="showType" :editId="editId" :editType="editType" v-if="
        showType == 1 &&
        (editType == 'add' || editType == 'edit' || editType == 'copy')
      " v-bind="$attrs"></ContractFrom>
    <ShowDetail v-model="showType" :editId="editId" :editType="editType" v-if="showType == 1 && (editType == 'show' || editType == 'approve' || editType == 'again')" />
  </div>
</template>

<script>
import ContractList from "./components/ContractList";
import ContractFrom from "./components/ContractFrom";
import ShowDetail from "./components/ShowDetail";
export default {
  name: "contract",
  components: { ContractList, ContractFrom, ShowDetail },
  data() {
    return {
      showType: 0,
      editType: "",
      editId: "",
    };
  },
  created() {
    this.onload();
  },
  watch: {
    showType(val) {
      if (val == 0) {
        this.$refs["list"].getList();
      }
    },
  },
  methods: {
    onload() {
      if (this.$route.query.id) {
        this.showType = 1;
        this.editClick("", this.$route.query.editType);
      }
    },
    editClick(id, editType) {
      this.editId = id;
      this.editType = editType;
    },
  },
};
</script>

<style>
</style>