<template>
  <div style="width:100%">
    <LoanList v-model="showType" v-if="showType==0" @edit="editClick"></LoanList>
    <LoanShowDetail v-model="showType" :editId="editId" :editType="editType" :LoanType="LoanType" v-if="showType==1 && editType=='show'"></LoanShowDetail>
    <LoanForm v-model="showType" :editId="editId" :editType="editType" v-if="showType==1 && (editType=='edit' || editType=='add')"></LoanForm>
  </div>
</template>

<script>
import LoanForm from './components/LoanForm'
import LoanList from './components/LoanList'
import LoanShowDetail from './components/LoanShowDetail'
export default {
  name: 'Loan',
  components: { LoanForm, LoanList, LoanShowDetail },
  data() {
    return {
      showType: 0,
      editType: '',
      editId: '',
      LoanType: ''
    }
  },
  created() {
    if (this.$route.query.id) {
      this.editId = this.$route.query.id
      this.showType = 1
      this.editType = 'show'
      this.LoanType = this.$route.query.LoanType
    }
  },
  methods: {
    editClick(id, editType) {
      this.editId = id
      this.editType = editType
    }
  }
}
</script>

<style>
</style>