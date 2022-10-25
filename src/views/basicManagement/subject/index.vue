<template>
  <div style="width: 100%">
    <SubjectList
      v-model="showType"
      v-show="showType == 0"
      ref="list"
      @edit="editClick"
    ></SubjectList>
    <SubjectForm
      v-model="showType"
      :subjectId="subjectId"
      :editType="editType"
      v-if="
        showType == 1 &&
        (editType == 'add' || editType == 'edit' || editType == 'copy')
      "
    ></SubjectForm>
    <ShowDetail
      v-model="showType"
      :subjectId="subjectId"
      :editType="editType"
      v-if="showType == 1 && (editType == 'show' || editType == 'approve')"
    />
  </div>
</template>

<script>
import SubjectForm from "./components/SubjectForm";
import SubjectList from "./components/SubjectList";
import ShowDetail from "./components/ShowDetail";
export default {
  name: "subject",
  components: { SubjectForm, SubjectList, ShowDetail },
  data() {
    return {
      showType: 0,
      editType: "",
      subjectId: "",
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
      this.subjectId = id;
      this.editType = editType;
    },
  },
};
</script>

<style>
</style>