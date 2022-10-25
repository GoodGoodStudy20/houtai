<template>
  <div style="width: 100%">
    <ServiceProviderList
      v-model="showType"
      v-show="showType == 0"
      ref="list"
      @edit="editClick"
    ></ServiceProviderList>
    <ServiceProviderForm
      v-model="showType"
      :editId="editId"
      :editType="editType"
      v-if="
        showType == 1 &&
        (editType == 'add' || editType == 'edit' || editType == 'copy')
      "
    ></ServiceProviderForm>
    <ShowDetail
      v-model="showType"
      :editId="editId"
      :editType="editType"
      v-if="showType == 1 && (editType == 'show' || editType == 'approve')"
    />
  </div>
</template>

<script>
import ServiceProviderList from "./components/ServiceProviderList";
import ServiceProviderForm from "./components/ServiceProviderForm";
import ShowDetail from "./components/ShowDetail";
export default {
  name: "serviceProvider",
  components: { ServiceProviderList, ServiceProviderForm, ShowDetail },
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