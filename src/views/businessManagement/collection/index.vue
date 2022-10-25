<template>
  <div style="width: 100%">
    <CollectionList
      v-model="showType"
      v-show="showType == 0"
      ref="list"
      @edit="editClick"
      v-bind="$attrs"
      v-on="$listeners"
      :fromDemand="fromDemand"
    ></CollectionList>
    <CollectionForm
      v-model="showType"
      :editId="editId"
      :editType="editType"
      v-if="
        showType == 1 &&
        (editType == 'add' || editType == 'edit' || editType == 'copy')
      "
    ></CollectionForm>
    <ShowDetail
      v-model="showType"
      :editId="editId"
      :editType="editType"
      v-if="showType == 1 && (editType == 'show' || editType == 'approve')"
    />
  </div>
</template>

<script>
import CollectionList from "./components/CollectionList";
import CollectionForm from "./components/CollectionForm";
import ShowDetail from "./components/ShowDetail";
export default {
  name: "collection",
  components: { CollectionList, CollectionForm, ShowDetail },
  props: ["fromDemand"],
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