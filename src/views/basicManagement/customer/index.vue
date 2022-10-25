<template>
  <div style="width: 100%">
    <CustomerList
      v-model="showType"
      v-show="showType == 0"
      @edit="editClick"
      ref="list"
    ></CustomerList>
    <CustomerForm
      v-model="showType"
      :editId="editId"
      :editType="editType"
      v-if="
        showType == 1 &&
        (editType == 'add' || editType == 'edit' || editType == 'copy')
      "
    ></CustomerForm>
    <ShowDetail
      v-model="showType"
      :editId="editId"
      :editType="editType"
      v-if="showType == 1 && (editType == 'show' || editType == 'approve')"
    />
  </div>
</template>

<script>
import CustomerList from "./components/CustomerList";
import CustomerForm from "./components/CustomerForm";
import ShowDetail from "./components/ShowDetail";
export default {
  name: "customer",
  components: { CustomerList, CustomerForm, ShowDetail },
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