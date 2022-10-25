<template>
  <div style="width: 100%">
    <InvoiceList v-model="showType" v-show="showType == 0" ref="list" @edit="editClick"></InvoiceList>
    <InvoiceForm v-model="showType" :editId="editId" :editType="editType" v-if="
        showType == 1 &&
        (editType == 'add' || editType == 'edit' || editType == 'copy' || editType=='tovoid' || editType=='flushRed')
      "></InvoiceForm>
    <ShowDetail v-model="showType" :editId="editId" :editType="editType" v-if="showType == 1 && (editType == 'show' || editType == 'approve')" />
  </div>
</template>

<script>
import InvoiceList from "./components/InvoiceList";
import InvoiceForm from "./components/InvoiceForm";
import ShowDetail from "./components/ShowDetail";
export default {
  name: "invoice",
  components: { InvoiceList, InvoiceForm, ShowDetail },
  data() {
    return {
      showType: 0,
      editType: "",
      editId: "",
    };
  },
  created() { },
  watch: {
    showType(val) {
      if (val == 0) {
        this.$refs["list"].getList();
        this.$refs["list"].getApprovalData();
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