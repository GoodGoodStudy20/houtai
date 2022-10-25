<template>
  <div style="width: 100%">
    <ApproveList v-model="showType" v-show="showType == 0" ref="list" @edit="editClick"></ApproveList>
    <ShowDetail v-model="showType" v-if="showType == 1 && type == 0" :editId="editId" :editType="editType"></ShowDetail>
    <PaymentForm v-model="showType" v-if="showType == 1 && type == 1" :editId="editId" :editType="editType"></PaymentForm>
    <ShowDetailInvoiceForm v-model="showType" :editId="editId" :editType="editType" v-if="showType == 1 && type == 2" />
    <ShowDetailCollectionForm v-model="showType" v-if="showType == 1 && type == 3" :editId="editId" :editType="editType" />
    <ShowContractForm v-model="showType" v-if="showType == 1 && type == 5" :editId="editId" :editType="editType" />
  </div>
</template>

<script>
import ApproveList from "./components/ApproveList";
import PaymentForm from "../businessManagement/payment/components/PaymentForm";
import ShowContractForm from "../basicManagement/contract/components/ShowDetail";
import ShowDetail from "../businessManagement/demand/components/ShowDetail";
import ShowDetailInvoiceForm from "../businessManagement/invoice/components/ShowDetail";
import CollectionForm from "../businessManagement/collection/components/CollectionForm";
import ShowDetailCollectionForm from "../businessManagement/collection/components/ShowDetail";
export default {
  name: "approve",
  components: {
    ApproveList,
    PaymentForm,
    ShowContractForm,
    CollectionForm,
    ShowDetail,
    ShowDetailInvoiceForm,
    ShowDetailCollectionForm,
  },
  data() {
    return {
      showType: 0,
      editType: "",
      editId: "",
      type: 0,
      state: "",
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
        this.editClick(
          this.$route.query.id,
          this.$route.query.editType,
          this.$route.query.type,
          this.$route.query.state
        );
      }
    },
    editClick(id, editType, type, state) {
      this.type = type;
      this.editId = id;
      this.editType = editType;
      this.state = state;
      // if (this.editType == 'show' && this.state == 1) {
      //   let data = {
      //     relationshipId: this.$route.query.id || id,
      //     type: this.$route.query.type || type
      //   }
      //   // this.readUpdate(data)
      // }
    },
    // readUpdate(data) {
    //   updateIsRead(data).then(res => { })
    // }
  },
};
</script>

<style>
</style>