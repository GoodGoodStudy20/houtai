<template>
  <div style="width: 100%">
    <CapitalList
      v-model="showType"
      v-show="showType == 0"
      ref="list"
      @edit="editClick"
    ></CapitalList>
    <CapitalForm
      v-model="showType"
      :editId="editId"
      :editType="editType"
      v-if="
        showType == 1 &&
        (editType == 'add' || editType == 'edit' || editType == 'copy')
      "
    ></CapitalForm>
    <ShowDetail
      v-model="showType"
      :editId="editId"
      :editType="editType"
      v-if="showType == 1 && (editType == 'show' || editType == 'approve')"
    />
  </div>
</template>

<script>
import CapitalList from "./components/CapitalList";
import CapitalForm from "./components/CapitalForm";
import ShowDetail from "./components/ShowDetail";
export default {
  name: "capital",
  components: { CapitalList, CapitalForm, ShowDetail },
  data() {
    return {
      showType: 0,
      editType: "",
      editId: "",
    };
  },
  created() {},
  watch: {
    showType(val) {
      if (val == 0) {
        this.$refs["list"].getList();
      }
    },
  },
  methods: {
    editClick(id, editType) {
      this.editId = id;
      this.editType = editType;
    },
  },
};
</script>

<style>
</style>